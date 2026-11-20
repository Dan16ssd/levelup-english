/* LevelUp English — natural AI voices (optional).
   Kokoro, an open-source text-to-speech model, runs in the browser after a one-time download.
   Conversations get a different voice per speaker, matched to the speaker's name where we can. */
window.LU_VOICE = (function () {
  "use strict";
  const LIB = "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm";
  const MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
  const STORE = "levelup-tts", ACCENT = "levelup-tts-accent";
  const VOICES = {
    gb: { f: ["bf_emma", "bf_isabella"], m: ["bm_george", "bm_lewis"] },
    us: { f: ["af_heart", "af_bella"], m: ["am_michael", "am_fenrir"] }
  };
  const FEMALE = /^(anna|maria|sara|lucy|emma|nina|mia|yuki|fatima|zoe|elena|grace|layla|julia|sofia|priya|mum|mother|woman|girl|ms|mrs|miss|lisa|kate|amy|ana|she|grandma|aunt|sister|receptionist)\b/i;
  const MALE = /^(tom|ali|david|ken|omar|leo|jack|sam|carlos|ben|hassan|raj|daniel|mark|james|kenji|dad|father|man|boy|mr|guide|grandad|uncle|brother|waiter|host)\b/i;

  const AC = window.AudioContext || window.webkitAudioContext;
  const supported = !!(AC && window.WebAssembly);
  const get = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } };
  const enabled = () => supported && get(STORE, "") === "natural";
  const setEnabled = (on) => set(STORE, on ? "natural" : "device");
  const accent = () => (get(ACCENT, "gb") === "us" ? "us" : "gb");
  const setAccent = (a) => { set(ACCENT, a === "us" ? "us" : "gb"); cache.clear(); };

  /* Computers with WebGPU run the full model on the graphics card: a bigger download (about 330 MB)
     but about six times faster than real time. Everything else (including phones) uses the 90 MB
     version on the processor, which is slower than real time, so recordings are prepared in advance. */
  const isPhone = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const gpuLikely = !!navigator.gpu && !isPhone;
  const MB = gpuLikely ? 330 : 90;
  let tts = null, loading = null, ctx = null, source = null, token = 0, backend = "";
  let progressCb = null;
  function load(onProgress) {
    if (onProgress) progressCb = onProgress;
    if (tts) return Promise.resolve(tts);
    if (!loading) {
      const files = {};
      const progress_callback = (p) => {
        if (p.status === "progress" && p.total) {
          files[p.file] = [p.loaded, p.total];
          const v = Object.values(files);
          const pct = Math.round((v.reduce((a, x) => a + x[0], 0) / v.reduce((a, x) => a + x[1], 0)) * 100);
          if (progressCb) progressCb(pct);
        }
      };
      loading = import(LIB).then(async ({ KokoroTTS }) => {
        let m = null;
        if (gpuLikely) {
          try {
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter) {
              m = await KokoroTTS.from_pretrained(MODEL, { dtype: "fp32", device: "webgpu", progress_callback });
              /* the first generation compiles the graphics shaders; do it now, not when the learner presses play */
              const a = await m.generate("Hello there.", { voice: VOICES[accent()].f[0] });
              if (!a.audio.length || !isFinite(a.audio[0])) throw new Error("bad gpu output");
              backend = "webgpu";
            }
          } catch (e) { m = null; }
        }
        if (!m) { m = await KokoroTTS.from_pretrained(MODEL, { dtype: "q8", device: "wasm", progress_callback }); backend = "wasm"; }
        tts = m;
        return m;
      }).catch((e) => { loading = null; throw e; });
    }
    return loading;
  }
  const ready = () => !!tts;
  const fast = () => backend === "webgpu";

  /* must be called from a click/tap so Safari allows playback later */
  function unlock() {
    if (!AC) return;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
  }

  /* one generation at a time; what the learner pressed Play on jumps ahead of background preparation */
  const high = [], low = [];
  let running = false;
  async function pump() {
    if (running) return;
    running = true;
    while (high.length || low.length) {
      const job = (high.length ? high : low).shift();
      job.state = "running";
      try { job.resolve(await job.run()); } catch (e) { job.reject(e); }
      job.state = "done";
    }
    running = false;
  }
  const cache = new Map();
  function synth(text, voice, speed, urgent) {
    const key = voice + "|" + speed + "|" + text;
    let job = cache.get(key);
    if (job) {
      cache.delete(key); cache.set(key, job);
      if (urgent && job.state === "queued") { const i = low.indexOf(job); if (i >= 0) { low.splice(i, 1); high.push(job); } }
      return job.promise;
    }
    job = { key, state: "queued", run: async () => { const a = await (await load()).generate(text, { voice, speed }); return { data: a.audio, rate: a.sampling_rate }; } };
    job.promise = new Promise((res, rej) => { job.resolve = res; job.reject = rej; });
    job.promise.catch(() => { if (cache.get(key) === job) cache.delete(key); });
    cache.set(key, job);
    while (cache.size > 80) cache.delete(cache.keys().next().value);
    (urgent ? high : low).push(job);
    pump();
    return job.promise;
  }

  /* split "A: …\nB: …" into lines with a voice each; long text is split into sentences */
  function plan(text) {
    const raw = String(text).split("\n").filter((l) => l.trim());
    const dialogue = raw.length > 1 && raw.every((l) => /^\s*[A-Z][A-Za-z .']{0,18}:\s+\S/.test(l));
    const V = VOICES[accent()];
    const who = {};
    const used = { f: 0, m: 0 };
    let last = null;
    const voiceFor = (name) => {
      if (who[name]) return who[name];
      let g = FEMALE.test(name) ? "f" : MALE.test(name) ? "m" : null;
      if (!g) g = last && last[1] === "f" ? "m" : "f";
      who[name] = V[g][used[g]++ % 2];
      return who[name];
    };
    const out = [];
    const push = (voice, t) => {
      const parts = t.length > 260 ? t.match(/[^.!?]+[.!?]+["”']?\s*|[^.!?]+$/g) || [t] : [t];
      parts.forEach((x) => x.trim() && out.push({ voice, text: x.trim() }));
    };
    if (dialogue) raw.forEach((l) => { const i = l.indexOf(":"); const v = voiceFor(l.slice(0, i).trim()); last = v; push(v, l.slice(i + 1).trim()); });
    else push(V.f[0], String(text).replace(/\s+/g, " "));
    return out;
  }
  const speedOf = (rate) => Math.max(0.6, Math.min(1.4, Math.round((rate || 1) * 20) / 20));

  function stop() {
    token++;
    if (source) { try { source.stop(); } catch (e) { /* ignore */ } source = null; }
  }
  /* play(text, rate, { onWait, onStart, onEnd, onError }) */
  async function play(text, rate, cb = {}) {
    stop();
    unlock();
    const my = token;
    const lines = plan(text), sp = speedOf(rate);
    /* drop background work for other recordings, so this one starts as soon as possible */
    const jobs = lines.map((l) => synth(l.text, l.voice, sp, true));
    low.splice(0).forEach((j) => { j.state = "dropped"; if (cache.get(j.key) === j) cache.delete(j.key); j.reject(new Error("dropped")); });
    let started = false;
    const waitTimer = setTimeout(() => { if (!started && my === token && cb.onWait) cb.onWait(); }, 150);
    /* slower devices: if it isn't ready in 3 seconds, give up on this play (generation carries on for the replay) */
    if (cb.onSlow && !fast()) setTimeout(() => { if (!started && my === token) { token++; cb.onSlow(); } }, 3000);
    try {
      for (let i = 0; i < jobs.length; i++) {
        const a = await jobs[i];
        if (my !== token) return;
        if (i === 0) { started = true; clearTimeout(waitTimer); if (cb.onStart) cb.onStart(); }
        const buf = ctx.createBuffer(1, a.data.length, a.rate);
        buf.copyToChannel(a.data, 0);
        await new Promise((res) => {
          const s = ctx.createBufferSource();
          s.buffer = buf; s.connect(ctx.destination);
          s.onended = res;
          source = s;
          s.start();
        });
        if (my !== token) return;
        if (i < jobs.length - 1) await new Promise((r) => setTimeout(r, 250));
      }
      if (my === token) { source = null; cb.onEnd && cb.onEnd(); }
    } catch (e) {
      clearTimeout(waitTimer);
      if (my === token && cb.onError) cb.onError(e);
    }
  }
  function prefetch(text, rate) {
    if (!tts) return;
    const sp = speedOf(rate);
    plan(text).forEach((l) => synth(l.text, l.voice, sp).catch(() => {}));
  }
  /* real-time factor check, for testing */
  async function benchmark(text) {
    const t0 = performance.now();
    const a = await synth(text, VOICES[accent()].f[0], 1, true);
    return { seconds: (performance.now() - t0) / 1000, audio: a.data.length / a.rate };
  }

  return { supported, enabled, setEnabled, accent, setAccent, load, ready, unlock, play, stop, prefetch, fast, MB, gpuLikely, _plan: plan, _benchmark: benchmark };
})();
