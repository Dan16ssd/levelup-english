/* LevelUp English — speech recognition that works in every browser.
   Chrome and Edge have built-in recognition. Everywhere else (Safari, Firefox, iPhone) we record
   the microphone and transcribe it on the device with an open-source Whisper model. */
window.LU_SPEECH = (function () {
  "use strict";
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const PREF_STORE = "levelup-asr";
  const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5/+esm";
  const MODEL_ID = "onnx-community/whisper-base.en";
  const MODEL_MB = 80;
  const RATE = 16000;

  const AC = window.AudioContext || window.webkitAudioContext;
  const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && AC);
  /* Chrome on iOS is Safari underneath, and its built-in recognition is unreliable there */
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const goodBrowserSR = !!SR && !isIOS && !/^((?!chrome|android|crios|edg).)*safari/i.test(navigator.userAgent);

  const pref = () => { try { return localStorage.getItem(PREF_STORE) || "auto"; } catch (e) { return "auto"; } };
  const setPref = (v) => { try { localStorage.setItem(PREF_STORE, v); } catch (e) { /* ignore */ } };

  /* which engine we'll actually use: "browser", "device" or "" (none available) */
  function mode() {
    const p = pref();
    if (p === "device" && canRecord) return "device";
    if (p === "browser" && SR) return "browser";
    if (goodBrowserSR) return "browser";
    if (canRecord) return "device";
    return SR ? "browser" : "";
  }
  const available = () => !!mode();
  let modelReady = false;
  const modelCached = () => modelReady || (function () { try { return localStorage.getItem("levelup-asr-cached") === "1"; } catch (e) { return false; } })();

  /* ---------- on-device model ---------- */
  let asrPromise = null;
  function loadModel(onProgress) {
    if (!asrPromise) {
      const files = {};
      asrPromise = import(TRANSFORMERS_URL).then(async (T) => {
        T.env.allowLocalModels = false;
        const asr = await T.pipeline("automatic-speech-recognition", MODEL_ID, {
          dtype: "q8",
          device: "wasm",
          progress_callback: (p) => {
            if (p.status === "progress" && p.total) {
              files[p.file] = [p.loaded, p.total];
              const v = Object.values(files);
              const pct = Math.round((v.reduce((a, x) => a + x[0], 0) / v.reduce((a, x) => a + x[1], 0)) * 100);
              if (loadModel.cb) loadModel.cb(pct);
            }
          }
        });
        modelReady = true;
        try { localStorage.setItem("levelup-asr-cached", "1"); } catch (e) { /* ignore */ }
        return asr;
      }).catch((e) => { asrPromise = null; throw e; });
    }
    loadModel.cb = onProgress;
    return asrPromise;
  }

  /* ---------- recording raw audio ---------- */
  function resample(chunks, fromRate) {
    const len = chunks.reduce((a, c) => a + c.length, 0);
    const all = new Float32Array(len);
    let o = 0;
    chunks.forEach((c) => { all.set(c, o); o += c.length; });
    if (fromRate === RATE) return all;
    const ratio = fromRate / RATE;
    const out = new Float32Array(Math.floor(len / ratio));
    for (let i = 0; i < out.length; i++) {
      /* average the source samples that fall into this output sample (a simple low-pass) */
      const a = Math.floor(i * ratio), b = Math.min(len, Math.floor((i + 1) * ratio));
      let s = 0;
      for (let k = a; k < b; k++) s += all[k];
      out[i] = b > a ? s / (b - a) : all[a] || 0;
    }
    return out;
  }

  /* speaking time, pace and pauses from the audio itself (30 ms frames) */
  function analyse(pcm) {
    const F = Math.round(RATE * 0.03);
    const rms = [];
    for (let i = 0; i + F <= pcm.length; i += F) {
      let s = 0;
      for (let k = i; k < i + F; k++) s += pcm[k] * pcm[k];
      rms.push(Math.sqrt(s / F));
    }
    if (!rms.length) return { voiced: false, speechSec: 0, pauses: 0, first: 0, last: 0 };
    const sorted = rms.slice().sort((a, b) => a - b);
    const floor = sorted[Math.floor(sorted.length * 0.1)] || 0;
    const thr = Math.max(0.012, floor * 3);
    const on = rms.map((r) => r > thr);
    const first = on.indexOf(true), last = on.lastIndexOf(true);
    if (first < 0 || on.filter(Boolean).length < 6) return { voiced: false, speechSec: 0, pauses: 0, first: 0, last: 0 };
    let pauses = 0, run = 0;
    for (let i = first; i <= last; i++) {
      if (!on[i]) run++;
      else { if (run * 0.03 >= 0.6) pauses++; run = 0; }
    }
    return { voiced: true, speechSec: (last - first + 1) * 0.03, pauses, first: first * F, last: (last + 1) * F };
  }

  /* listen({ maxMs, silenceMs, onState }) → { done: Promise<result>, stop() }
     onState(state, info): "loading" {pct}, "listening", "processing"
     result: { text, seconds, pauses, wpm, engine } */
  function listen(opts = {}) {
    const m = mode();
    const maxMs = opts.maxMs || 15000;
    const onState = opts.onState || (() => {});
    let stopFn = () => {};
    const done = new Promise((resolve, reject) => {
      if (m === "browser") {
        let rec;
        try { rec = new SR(); } catch (e) { reject(new Error("mic")); return; }
        const long = maxMs > 20000;
        rec.lang = "en-GB"; rec.interimResults = false; rec.maxAlternatives = 1; rec.continuous = long;
        const parts = [];
        const t0 = Date.now();
        let failed = null;
        rec.onresult = (ev) => { for (let i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) parts.push(ev.results[i][0].transcript); };
        rec.onerror = (ev) => { failed = ev.error; };
        rec.onend = () => {
          clearTimeout(timer);
          if (failed && failed !== "no-speech" && failed !== "aborted") { reject(new Error(failed === "not-allowed" || failed === "service-not-allowed" ? "denied" : failed)); return; }
          const text = parts.join(" ").trim();
          const secs = (Date.now() - t0) / 1000;
          resolve({ text, seconds: secs, pauses: null, wpm: text && long ? Math.round(text.split(/\s+/).length / (secs / 60)) : null, engine: "browser" });
        };
        const timer = setTimeout(() => { try { rec.stop(); } catch (e) { /* ignore */ } }, maxMs);
        stopFn = () => { try { rec.stop(); } catch (e) { /* ignore */ } };
        try { rec.start(); onState("listening"); } catch (e) { reject(new Error("mic")); }
        return;
      }
      if (m !== "device") { reject(new Error("unsupported")); return; }

      /* start downloading the model straight away, while the learner speaks */
      const modelP = loadModel((pct) => onState("loading", { pct }));
      modelP.catch(() => {});
      navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } }).then((stream) => {
        const ctx = new AC();
        const src = ctx.createMediaStreamSource(stream);
        const proc = ctx.createScriptProcessor(4096, 1, 1);
        const mute = ctx.createGain();
        mute.gain.value = 0;
        const chunks = [];
        let heard = false, quietFor = 0, finished = false;
        const silenceMs = opts.silenceMs || 1800;
        const t0 = Date.now();
        proc.onaudioprocess = (e) => {
          if (finished) return;
          const d = e.inputBuffer.getChannelData(0);
          chunks.push(new Float32Array(d));
          let s = 0;
          for (let i = 0; i < d.length; i++) s += d[i] * d[i];
          const r = Math.sqrt(s / d.length);
          const ms = (d.length / ctx.sampleRate) * 1000;
          if (r > 0.02) { heard = true; quietFor = 0; } else if (heard) quietFor += ms;
          if ((heard && quietFor > silenceMs) || Date.now() - t0 > maxMs) finish();
        };
        src.connect(proc); proc.connect(mute); mute.connect(ctx.destination);
        if (ctx.state === "suspended") ctx.resume();
        onState("listening");
        const finish = async () => {
          if (finished) return;
          finished = true;
          try { proc.disconnect(); src.disconnect(); } catch (e) { /* ignore */ }
          stream.getTracks().forEach((t) => t.stop());
          const rate = ctx.sampleRate;
          ctx.close().catch(() => {});
          const pcm = resample(chunks, rate);
          const a = analyse(pcm);
          if (!a.voiced) { resolve({ text: "", seconds: 0, pauses: 0, wpm: null, engine: "device" }); return; }
          onState(modelReady ? "processing" : "loading", { pct: 0 });
          try {
            const asr = await modelP;
            onState("processing");
            /* trim silence (Whisper invents words in long silences) and keep a little margin */
            const pad = Math.round(RATE * 0.25);
            const clip = pcm.subarray(Math.max(0, a.first - pad), Math.min(pcm.length, a.last + pad));
            const out = await asr(clip, clip.length > RATE * 30 ? { chunk_length_s: 30, stride_length_s: 5 } : {});
            let text = String((out && out.text) || "").trim();
            if (/^[\s.!?,]*$|^\[.*\]$|^\(.*\)$/.test(text)) text = "";
            const words = text ? text.split(/\s+/).length : 0;
            resolve({ text, seconds: a.speechSec, pauses: a.pauses, wpm: words && a.speechSec > 2 ? Math.round(words / (a.speechSec / 60)) : null, engine: "device" });
          } catch (e) { reject(new Error("model")); }
        };
        stopFn = finish;
      }).catch((e) => reject(new Error(e && (e.name === "NotAllowedError" || e.name === "SecurityError") ? "denied" : "mic")));
    });
    return { done, stop: () => stopFn() };
  }

  function errorText(e) {
    const m = e && e.message;
    if (m === "denied") return "Microphone permission was denied. Allow it in your browser's site settings.";
    if (m === "model") return "Couldn't load the speech model. Check your connection and try again.";
    if (m === "unsupported") return "Speech recognition isn't available in this browser.";
    if (m === "network") return "The browser's speech service needs an internet connection. You can switch to the on-device model in Settings.";
    return "Couldn't use the microphone. Check that no other app is using it.";
  }

  /* ---------- comparing what was said with the target ---------- */
  const NUMS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  const tok = (s) => String(s).toLowerCase().replace(/[’']/g, "'").replace(/\b(\d{1,2})\b/g, (m, d) => NUMS[+d] || d).replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const close = (a, b) => a === b || a.replace(/'/g, "") === b.replace(/'/g, "") || (Math.max(a.length, b.length) > 3 && 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.7);
  /* word-by-word alignment: each target word is "ok", "close" (heard as a similar word) or "missed" */
  function compare(target, heard) {
    const raw = String(target).split(/\s+/).filter(Boolean);
    const T = raw.map((w) => tok(w).join(" "));
    const H = tok(heard);
    const n = T.length, m = H.length;
    const S = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    const sc = (t, h) => (t === h || t.replace(/'/g, "") === h.replace(/'/g, "") ? 2 : close(t, h) ? 1 : -1);
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) S[i][j] = Math.max(S[i - 1][j], S[i][j - 1], S[i - 1][j - 1] + Math.max(0, sc(T[i - 1], H[j - 1])));
    const st = new Array(n).fill("missed");
    let i = n, j = m;
    while (i > 0 && j > 0) {
      const s = sc(T[i - 1], H[j - 1]);
      if (s > 0 && S[i][j] === S[i - 1][j - 1] + s) { st[i - 1] = s === 2 ? "ok" : "close"; i--; j--; }
      else if (S[i][j] === S[i - 1][j]) i--;
      else j--;
    }
    /* words with no letters (e.g. "–") don't count */
    const counted = raw.map((w, k) => ({ w, st: T[k] ? st[k] : "ok", skip: !T[k] }));
    const real = counted.filter((x) => !x.skip);
    const pts = real.reduce((a, x) => a + (x.st === "ok" ? 1 : x.st === "close" ? 0.5 : 0), 0);
    return { score: real.length ? Math.round((pts / real.length) * 100) : 0, words: counted };
  }

  return { mode, available, listen, errorText, compare, pref, setPref, canRecord, hasBrowserSR: !!SR, goodBrowserSR, modelCached, MODEL_MB, _analyse: analyse, _tok: tok };
})();
