/* LevelUp English — single-page app (no build step) */
(function () {
  "use strict";
  const { SKILLS, LEVELS, SKILL_TIPS, UNITS } = window.LU_DATA;
  const GEN = window.LU_GEN;
  const KEY = "levelup-english-v1";
  const TEST_LENGTH = 20;
  const LEVEL_TEST_PER_SKILL = 4;
  const PASS_PCT = 70;
  const SKILL_IDS = SKILLS.map((s) => s.id);

  /* ---------- state ---------- */
  const DAILY_GOAL = 20;
  const SRS_DAYS = [0, 1, 2, 4, 8, 16, 32, 64];
  const defaultState = () => ({
    level: null, placement: null, units: {}, history: [], seen: [], practice: { answered: 0, correct: 0, best: 0 },
    days: {}, srs: {}, writing: {}, name: "", settings: { voice: "", rate: 1 }
  });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s) return defaultState();
      const d = defaultState();
      const out = Object.assign(d, s);
      out.settings = Object.assign(defaultState().settings, s.settings || {});
      out.practice = Object.assign(defaultState().practice, s.practice || {});
      return out;
    } catch (e) { return defaultState(); }
  }
  let state = load();
  let seen = new Set(state.seen || []);
  function save() {
    state.seen = Array.from(seen).slice(-2000);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  /* ---------- helpers ---------- */
  const app = document.getElementById("app");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lvl = (n) => LEVELS.find((l) => l.n === n);
  const skill = (id) => SKILLS.find((s) => s.id === id);
  const unitsOf = (n) => UNITS.filter((u) => u.level === n);
  const unitDone = (id) => !!(state.units[id] && state.units[id].done);
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = (s) => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"]/g, "").replace(/\s+/g, " ").trim();
  const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  const pad = (n) => String(n).padStart(2, "0");
  const levelProgress = (n) => { const us = unitsOf(n); return Math.round((us.filter((u) => unitDone(u.id)).length / us.length) * 100); };
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayKey(d); };
  function logActivity(n) {
    const k = dayKey();
    state.days[k] = (state.days[k] || 0) + (n || 1);
    const keys = Object.keys(state.days).sort();
    if (keys.length > 400) keys.slice(0, keys.length - 400).forEach((x) => delete state.days[x]);
  }
  function dayStreak() {
    let n = 0;
    const d = new Date();
    if (!state.days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (state.days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const today = () => state.days[dayKey()] || 0;
  const b64enc = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const b64dec = (str) => JSON.parse(decodeURIComponent(escape(atob(str.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")))));
  const toEx = (q) => ({ t: q.audio ? "listen" : "mc", q: q.q, o: q.o, a: q.a, audio: q.audio, passage: q.passage, x: q.x, skill: q.skill });

  const ICON_PLAY = `<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>`;
  const ICON_SPEAKER = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 5.5c1 .8 1 4.2 0 5M12.8 3.8c2 1.8 2 6.6 0 8.4" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`;
  const ICON_MIC = `<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="9" rx="2.5" fill="currentColor"/><path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`;

  /* CEFR ruler used across pages */
  function ruler(current, opts = {}) {
    return `<div class="ruler${opts.compact ? " compact" : ""}" role="img" aria-label="CEFR scale${current ? ", current level " + lvl(current).code : ""}">
      ${LEVELS.map((L) => `<div class="ruler-seg${L.n === current ? " on" : ""}${current && L.n < current ? " past" : ""}">
        <span class="ruler-code">${L.code}</span>${opts.compact ? "" : `<span class="ruler-name">${L.name}</span>`}
      </div>`).join("")}
    </div>`;
  }

  /* ---------- speech ---------- */
  /* Notes for Safari / iOS, which is strict about speech:
     - the first utterance must start inside a tap/click, so we "unlock" speech on the first interaction;
     - speak() right after cancel() is silently dropped, so we wait a moment after cancelling;
     - utterances can be garbage-collected mid-sentence unless we keep a reference;
     - some listed voices aren't installed, so we prefer local/default voices and fall back to lang only. */
  const hasTTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let voice = null;
  let unlocked = false;
  let current = null;
  /* Rank voices so the natural-sounding ones win over the robotic defaults. */
  const NOVELTY = /compact|eloquence|novelty|whisper|bells|zarvox|bad news|good news|bahh|boing|bubbles|cellos|jester|organ|superstar|trinoids|wobble|albert|fred|junior|ralph|kathy|grandma|grandpa|rocko|shelley|\bflo\b|eddy|reed|sandy/i;
  function voiceScore(v) {
    let s = 0;
    const n = v.name || "";
    if (/natural|neural|premium|enhanced|siri/i.test(n)) s += 40;
    if (/google/i.test(n)) s += 25;
    if (/samantha|daniel|serena|karen|moira|tessa|kate|oliver|arthur|martha|libby|sonia|ryan|aria|jenny|guy/i.test(n)) s += 15;
    if (/en[-_]GB/i.test(v.lang)) s += 6; else if (/en[-_]US/i.test(v.lang)) s += 4;
    if (v.localService !== false) s += 8;
    if (v.default) s += 3;
    if (NOVELTY.test(n)) s -= 60;
    return s;
  }
  function englishVoices() {
    if (!hasTTS) return [];
    return speechSynthesis.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
  }
  function pickVoice() {
    const vs = englishVoices();
    const chosen = state.settings.voice && vs.find((v) => v.voiceURI === state.settings.voice);
    voice = chosen || vs[0] || null;
  }
  if (hasTTS) {
    pickVoice();
    if (typeof speechSynthesis.addEventListener === "function") speechSynthesis.addEventListener("voiceschanged", pickVoice);
    else speechSynthesis.onvoiceschanged = pickVoice;
  }
  function unlockSpeech() {
    if (unlocked || !hasTTS) return;
    unlocked = true;
    try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  }
  function stopSpeech() {
    if (hasTTS && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
    current = null;
  }
  function showTranscript(box) {
    const b = box || $(".audio");
    const t = b && $(".audio-fallback", b);
    if (t) t.hidden = false;
  }
  /* Dialogues are written one line per speaker ("A: …\nB: …") and are read with two different voices. */
  const DIALOGUE_LINE = /^\s*([A-Z][A-Za-z .']{0,18}):\s+\S/;
  const isDialogue = (t) => { const ls = String(t || "").split("\n").filter((l) => l.trim()); return ls.length > 1 && ls.every((l) => DIALOGUE_LINE.test(l)); };
  const parseDialogue = (t) => String(t).split("\n").filter((l) => l.trim()).map((l) => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; });
  const FEMALE_V = /samantha|karen|moira|tessa|serena|libby|sonia|aria|jenny|zira|hazel|susan|kate|martha|fiona|victoria|allison|ava\b|emma|olivia|natasha|catherine|female/i;
  const MALE_V = /daniel|arthur|oliver|ryan|guy\b|david|mark|george|alex\b|james|thomas|christopher|eric|brian|william|\bmale/i;
  function secondVoice() {
    if (!voice) return null;
    const vs = englishVoices().filter((v) => v.voiceURI !== voice.voiceURI && !NOVELTY.test(v.name));
    const f = FEMALE_V.test(voice.name), m = !f && MALE_V.test(voice.name);
    const opposite = vs.find((v) => (f ? !FEMALE_V.test(v.name) && MALE_V.test(v.name) : m ? FEMALE_V.test(v.name) : false));
    return opposite || vs.find((v) => v.lang === voice.lang) || vs[0] || null;
  }
  function transcript(text) {
    if (!isDialogue(text)) return `“${esc(text)}”`;
    return parseDialogue(text).map(([who, line]) => `<span class="tline"><b>${esc(who)}:</b> ${esc(line)}</span>`).join("");
  }
  function speak(text, rate, box) {
    if (!hasTTS) return;
    if (!voice) pickVoice();
    const go = () => {
      const r = Math.min(2, Math.max(0.4, (rate || 0.95) * (state.settings.rate || 1)));
      const lines = isDialogue(text) ? parseDialogue(text) : [[null, text]];
      const v2 = lines.length > 1 ? secondVoice() : null;
      const speakers = [];
      let started = false;
      const batch = lines.map(([who, line], i) => {
        const u = new SpeechSynthesisUtterance(line);
        if (who && !speakers.includes(who)) speakers.push(who);
        const n = who ? speakers.indexOf(who) : 0;
        const vv = n % 2 === 1 && v2 ? v2 : voice;
        if (vv) u.voice = vv;
        u.lang = vv ? vv.lang : "en-GB";
        u.rate = r;
        if (n % 2 === 1 && !v2) u.pitch = 0.75; // only one voice installed: change the pitch instead
        if (n >= 2) u.pitch = 1.25;
        u.onstart = () => { started = true; };
        if (i === lines.length - 1) u.onend = () => { if (current === batch) current = null; };
        u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled") showTranscript(box); };
        return u;
      });
      current = batch; // keep references so Safari doesn't drop them mid-sentence
      batch.forEach((u) => speechSynthesis.speak(u));
      if (speechSynthesis.paused) speechSynthesis.resume();
      setTimeout(() => { if (!started && current === batch) showTranscript(box); }, 3000);
    };
    if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(go, 80); } else go();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-speak]");
    if (b) { e.preventDefault(); unlocked = true; speak(b.getAttribute("data-speak"), parseFloat(b.getAttribute("data-rate")) || 0.95, b.closest(".audio")); }
    else unlockSpeech();
  }, true);
  document.addEventListener("touchend", () => unlockSpeech(), { passive: true });
  const SPEECH = window.LU_SPEECH;
  const canSpeak = SPEECH.available();
  /* Runs one recording on a button: the button toggles to Stop, status shows download / checking. */
  function micRun(btn, status, opts = {}) {
    if (btn._ctl) { btn._ctl.stop(); return null; }
    const label = btn.lastChild.textContent;
    const setL = (t) => { btn.lastChild.textContent = " " + t; };
    const say = (t) => { if (status) status.innerHTML = t; };
    const device = SPEECH.mode() === "device";
    let listening = false, pct = 0;
    const hint = () => (device && !SPEECH.modelCached() ? ` <span class="muted">The speech model (about ${SPEECH.MODEL_MB} MB) is downloading the first time${pct ? `: ${pct}%` : ""}.</span>` : "");
    const ctl = SPEECH.listen(Object.assign({}, opts, {
      onState: (st, info) => {
        if (st === "listening") { listening = true; btn.classList.add("recording"); setL(device || opts.maxMs > 20000 ? "Stop" : "Listening…"); say(`<span class="rec-dot"></span> Listening. ${device || opts.maxMs > 20000 ? "Press Stop when you finish." : "Speak now."}${hint()}`); }
        else if (st === "loading") { pct = (info && info.pct) || pct; if (listening && btn._ctl) say(`<span class="rec-dot"></span> Listening. Press Stop when you finish.${hint()}`); else { btn.disabled = true; setL("Please wait"); say(`Downloading the speech model${pct ? `: ${pct}%` : "…"} This only happens once.`); } }
        else if (st === "processing") { btn.classList.remove("recording"); btn.disabled = true; setL("Checking…"); say("Checking what you said…"); }
      }
    }));
    btn._ctl = ctl;
    const finish = () => { btn._ctl = null; listening = false; btn.disabled = false; btn.classList.remove("recording"); setL(label.trim()); };
    return ctl.done.then((r) => { finish(); say(""); return r; }, (e) => { finish(); say(`<span class="t-bad">${esc(SPEECH.errorText(e))}</span>`); return null; });
  }
  /* 60–120 second speaking answers: transcript, pace, pauses and target words used */
  function fluencyHTML(r, words) {
    if (!r.text) return `<p class="t-bad">We didn't hear anything. Check your microphone and try again.</p>`;
    const n = r.text.split(/\s+/).length;
    const used = (words || []).filter((w) => new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(r.text));
    const pace = r.wpm == null ? "" : r.wpm < 80 ? "slow: try to keep talking without stopping" : r.wpm < 110 ? "steady" : r.wpm <= 170 ? "a natural pace" : "fast: slow down a little so you're clear";
    const ppm = r.pauses != null && r.seconds > 5 ? Math.round((r.pauses / r.seconds) * 60) : null;
    return `<div class="fluency">
      <div class="stats-line"><div><span>Words</span><b>${n}</b></div><div><span>Speaking time</span><b>${Math.round(r.seconds)}s</b></div>${r.wpm != null ? `<div><span>Pace</span><b>${r.wpm}<small> wpm</small></b></div>` : ""}${ppm != null ? `<div><span>Long pauses</span><b>${r.pauses}</b></div>` : ""}</div>
      <p class="small">${pace ? `Your pace was ${pace}. ` : ""}${ppm != null ? (ppm <= 4 ? "You kept going well with few long pauses. " : "You paused quite often; fillers like “well…” or “let me think” help you keep going. ") : ""}${words && words.length ? `You used ${used.length} of the target words${used.length ? `: ${used.map(esc).join(", ")}` : ""}.` : ""}</p>
      <p class="small muted">What we heard:</p><div class="passage">${esc(r.text)}</div></div>`;
  }
  const sayBtn = (text, label) => `<button class="say" data-speak="${esc(text)}" aria-label="Listen">${ICON_SPEAKER}${label ? `<span>${label}</span>` : ""}</button>`;

  function audioBox(text) {
    if (!hasTTS) return `<div class="audio"><span class="muted">Audio isn't supported in this browser. Transcript: ${transcript(text)}</span></div>`;
    return `<div class="audio">
      <button class="btn btn-sm" data-speak="${esc(text)}">${ICON_PLAY} Play recording</button>
      <button class="btn btn-sm btn-line" data-speak="${esc(text)}" data-rate="0.7">Slower</button>
      <span class="audio-note">Replay as often as you need.</span>
      ${isDialogue(text) ? `<span class="audio-note">Conversation &middot; ${parseDialogue(text).length} lines</span>` : ""}
      <p class="audio-fallback" hidden>No sound? Check your volume, and on iPhone make sure silent mode is off. Transcript: ${transcript(text)}</p></div>`;
  }

  let pageTimer = null;
  /* ---------- router ---------- */
  const routes = [
    [/^\/?$/, home],
    [/^\/test$/, testIntro],
    [/^\/test\/run$/, testRun],
    [/^\/results$/, results],
    [/^\/practice$/, practicePage],
    [/^\/levels$/, levelsPage],
    [/^\/level\/([1-6])$/, (n) => levelPage(+n)],
    [/^\/level\/([1-6])\/test$/, (n) => levelTest(+n)],
    [/^\/unit\/([\w-]+)$/, unitPage],
    [/^\/dashboard$/, dashboard],
    [/^\/review$/, reviewPage],
    [/^\/talk$/, talkPage],
    [/^\/exam$/, examHub],
    [/^\/exam\/([\w-]+)$/, (k, params) => examRoute(k, params)],
    [/^\/settings$/, settingsPage],
    [/^\/certificate$/, certificatePage],
    [/^\/cert\/([\w-]+)$/, (d) => certView(d)]
  ];
  function router() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, query] = raw.split("?");
    stopSpeech();
    clearInterval(pageTimer); pageTimer = null;
    document.onkeydown = null;
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (m) { fn(...m.slice(1), new URLSearchParams(query || "")); updateNav(path); window.scrollTo(0, 0); return; }
    }
    notFound();
  }
  function updateNav(path) {
    $$(".nav a[data-nav]").forEach((a) => a.classList.toggle("active", path.startsWith(a.getAttribute("data-nav"))));
    $(".nav").classList.remove("open");
  }
  function notFound() { app.innerHTML = `<section class="page-head"><h1 class="display">Page not found</h1><p><a class="btn" href="#/">Go home</a></p></section>`; }

  /* =========================================================
     HOME
     ========================================================= */
  function home() {
    const has = state.level != null;
    const spec = GEN.generate({ lvl: 3 + Math.floor(Math.random() * 2), skill: "grammar" });

    app.innerHTML = `
    <section class="hero">
      <div class="hero-main">
        <p class="kicker">English placement &amp; study &middot; CEFR A1&ndash;C2</p>
        <h1 class="display">Find out where your English stands. <em>Then improve it.</em></h1>
        <p class="lede">An adaptive test measures your grammar, vocabulary, reading and listening, and places you on the CEFR scale. Then you get a study plan with lessons and exercises for your level. The questions are generated as you go, so you can retest and practise as often as you like.</p>
        <div class="actions">
          ${has
            ? `<a class="btn btn-lg" href="#/level/${state.level}">Continue at ${lvl(state.level).code}</a><a class="btn btn-lg btn-line" href="#/practice?l=${state.level}">Practise now</a>`
            : `<a class="btn btn-lg" href="#/test">Take the level test</a><a class="btn btn-lg btn-line" href="#/practice">Practise without a test</a>`}
        </div>
        <dl class="facts">
          <div><dt>20</dt><dd>questions that adapt to your answers</dd></div>
          <div><dt>4</dt><dd>skills, each scored separately</dd></div>
          <div><dt>8,000+</dt><dd>different questions, so retakes don't repeat</dd></div>
        </dl>
      </div>
      <aside class="specimen" id="specimen">
        <div class="specimen-head"><span>Specimen question</span><span>${lvl(spec.lvl).code} &middot; Grammar</span></div>
        <p class="specimen-q">${esc(spec.q)}</p>
        <ol class="specimen-opts">${spec.o.map((o, i) => `<li><button data-i="${i}"><span class="key">${"ABCD"[i]}</span>${esc(o)}</button></li>`).join("")}</ol>
        <p class="specimen-note" id="spec-note">Choose an answer.</p>
      </aside>
    </section>

    <section class="band">
      <div class="band-head"><h2 class="h-section">The scale</h2><p class="muted">Six levels from the Common European Framework of Reference.${has ? ` You are at <b>${lvl(state.level).code}</b>.` : ""}</p></div>
      ${ruler(state.level)}
    </section>

    <section class="band">
      <h2 class="h-section">How it works</h2>
      <ol class="steps">
        <li><span class="step-n">01</span><h3>Assess</h3><p>Answer correctly and the next question is harder. Get one wrong and it's easier. After 20 questions the test has found your level.</p></li>
        <li><span class="step-n">02</span><h3>Measure</h3><p>You get a CEFR level, plus a separate estimate for grammar, vocabulary, reading and listening, so you can see where you're strong and where you're weak.</p></li>
        <li><span class="step-n">03</span><h3>Study</h3><p>Work through your level's units, then practise as much as you want. Pass the level test to move up.</p></li>
      </ol>
    </section>

    <section class="band">
      <h2 class="h-section">Levels</h2>
      <div class="table-list">
        ${LEVELS.map((L) => `
          <a class="row-link" href="#/level/${L.n}">
            <span class="code">${L.code}</span>
            <span class="row-title">${L.name}</span>
            <span class="row-desc">${L.summary}</span>
            <span class="row-meta">${unitsOf(L.n).length} units &rarr;</span>
          </a>`).join("")}
      </div>
    </section>`;

    const btns = $$("#specimen button");
    btns.forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i;
      btns.forEach((x, j) => { x.disabled = true; x.parentElement.classList.toggle("is-key", j === spec.a); x.parentElement.classList.toggle("is-wrong", j === i && i !== spec.a); });
      $("#spec-note").innerHTML = (i === spec.a ? "<b>Correct.</b> " : "<b>Not quite.</b> ") + esc(spec.x) + ` <a href="#/practice?l=${spec.lvl}&s=grammar">More like this &rarr;</a>`;
    }));
  }

  /* =========================================================
     PLACEMENT TEST (adaptive, generated)
     ========================================================= */
  let T = null;

  function testIntro() {
    const prev = state.placement;
    app.innerHTML = `
    <section class="page-head narrow">
      <p class="kicker">Placement test</p>
      <h1 class="display">What's your level?</h1>
      <p class="lede">The test adapts as you go: a correct answer makes the next question harder, and a wrong answer makes it easier. If you don't know an answer, choose <b>I don't know</b>. Guessing makes the result less accurate. You'll get new questions every time you take it.</p>
      <dl class="facts facts-inline">
        <div><dt>${TEST_LENGTH}</dt><dd>questions</dd></div>
        <div><dt>~15</dt><dd>minutes</dd></div>
        <div><dt>4</dt><dd>skills</dd></div>
      </dl>
      <div class="note">
        <p><b>Listening questions play audio.</b> ${hasTTS ? "Turn your sound on and check it works:" : "Your browser can't play audio, so you'll see transcripts instead."}</p>
        ${hasTTS ? `<button class="btn btn-sm btn-line" data-speak="Hello. If you can hear this, your audio is working.">${ICON_PLAY} Test audio</button>` : ""}
      </div>
      <div class="actions"><button class="btn btn-lg" id="start">${prev ? "Start a new test" : "Start the test"}</button>
        ${prev ? `<a class="btn btn-lg btn-line" href="#/results">See last result (${lvl(prev.level).code})</a>` : ""}</div>
      <p class="muted small">Keyboard: press A–D or 1–4 to choose, Enter for the next question.</p>
    </section>`;
    $("#start").onclick = () => {
      T = { cur: 2, answers: [], total: TEST_LENGTH, seen: new Set() };
      location.hash = "#/test/run";
    };
  }

  function nextTestQuestion() {
    const counts = {};
    SKILL_IDS.forEach((s) => (counts[s] = T.answers.filter((a) => a.skill === s).length));
    const min = Math.min(...Object.values(counts));
    const sk = shuffle(SKILL_IDS.filter((s) => counts[s] === min))[0];
    // avoid repeats within this test and (where possible) across previous tests
    const combined = new Set([...seen, ...T.seen]);
    const q = GEN.generate({ lvl: T.cur, skill: sk }, combined);
    T.seen.add(GEN.keyOf(q));
    return q;
  }

  function testRun() {
    if (!T) { location.hash = "#/test"; return; }
    renderTestQuestion();
  }

  function renderTestQuestion() {
    const q = nextTestQuestion();
    const n = T.answers.length + 1;
    let selected = null;
    app.innerHTML = `
    <section class="sheet">
      <div class="sheet-top"><span>Question <b>${pad(n)}</b> / ${T.total}</span><span class="skill-label">${skill(q.skill).name}</span></div>
      <div class="ticks">${Array.from({ length: T.total }, (_, i) => `<span class="${i < n - 1 ? "done" : i === n - 1 ? "now" : ""}"></span>`).join("")}</div>
      ${q.passage ? `<div class="passage">${esc(q.passage)}</div>` : ""}
      ${q.audio ? audioBox(q.audio) : ""}

      <h2 class="qtext">${esc(q.q)}</h2>
      <div class="options">${q.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
      <div class="sheet-actions">
        <button class="btn-text" id="skip">I don't know</button>
        <button class="btn" id="next" disabled>${n === T.total ? "Finish" : "Next"} &rarr;</button>
      </div>
      <p class="sheet-foot"><a href="#/test" id="quit">Quit test</a></p>
    </section>`;

    const opts = $$(".opt");
    const select = (i) => { selected = i; opts.forEach((b, j) => b.classList.toggle("selected", j === i)); $("#next").disabled = false; };
    opts.forEach((b) => (b.onclick = () => select(+b.dataset.i)));
    const answer = (idx) => {
      document.onkeydown = null;
      const correct = idx === q.a;
      seen.add(GEN.keyOf(q));
      T.answers.push({ lvl: q.lvl, skill: q.skill, correct });
      logActivity(1);
      T.cur = correct ? Math.min(6, T.cur + 1) : Math.max(1, T.cur - 1);
      if (T.answers.length >= T.total) finishTest(); else { renderTestQuestion(); window.scrollTo(0, 0); }
    };
    $("#next").onclick = () => selected != null && answer(selected);
    $("#skip").onclick = () => answer(-1);
    $("#quit").onclick = () => { T = null; };
    document.onkeydown = (e) => {
      const k = e.key.toLowerCase();
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      if (k in map && map[k] < q.o.length) select(map[k]);
      else if (k === "enter" && selected != null) answer(selected);
    };
    if (q.audio && hasTTS) speak(q.audio);
  }

  /* Ability estimate: each answer contributes level+0.5 if right, level-0.5 if wrong.
     The staircase converges around the learner's ceiling, so the warm-up is ignored. */
  function estimate(answers) {
    // A correct answer at the top level counts higher: there is no harder question to climb to.
    const v = answers.reduce((t, a) => t + (a.correct ? (a.lvl === 6 ? 7 : a.lvl + 0.5) : a.lvl - 0.5), 0) / answers.length;
    return Math.max(1, Math.min(6.99, v));
  }
  function scoreTest(answers) {
    const settled = answers.length > 8 ? answers.slice(5) : answers;
    const theta = estimate(settled);
    const level = Math.floor(theta);
    const band = theta - level >= 0.5 ? "secure" : "developing";
    const skills = {};
    SKILLS.forEach((s) => {
      const as = answers.filter((a) => a.skill === s.id);
      skills[s.id] = as.length ? +estimate(as).toFixed(2) : null;
    });
    return { level, band, theta: +theta.toFixed(2), skills, correct: answers.filter((a) => a.correct).length, total: answers.length };
  }

  function finishTest() {
    const r = scoreTest(T.answers);
    r.date = new Date().toISOString();
    state.placement = r;
    state.level = r.level;
    state.history.unshift({ type: "placement", date: r.date, level: r.level, band: r.band, correct: r.correct, total: r.total });
    save();
    T = null;
    location.hash = "#/results";
  }

  /* =========================================================
     RESULTS + RECOMMENDATIONS
     ========================================================= */
  function skillRowsOf(p) {
    return SKILLS.filter((s) => p.skills[s.id] != null).map((s) => {
      const v = p.skills[s.id];
      return { s, v, sl: lvl(Math.floor(v)), pct: Math.max(3, Math.min(100, ((v - 1) / 5.99) * 100)) };
    });
  }
  function skillBars(rows) {
    return `<div class="skillbars">${rows.map((r) => `
      <div class="skillbar">
        <span class="skillbar-name">${r.s.name}</span>
        <span class="skillbar-track">${LEVELS.map(() => "<i></i>").join("")}<b style="width:${r.pct}%"></b></span>
        <span class="skillbar-code">${r.sl.code}</span>
      </div>`).join("")}</div>`;
  }

  function results() {
    const p = state.placement;
    if (!p) { location.hash = "#/test"; return; }
    const L = lvl(p.level);
    const rows = skillRowsOf(p);
    const sorted = rows.slice().sort((a, b) => a.v - b.v);
    const strongest = sorted[sorted.length - 1];
    const weak = sorted.filter((r) => r.v < p.level + 0.5 && r !== strongest).slice(0, 2);
    const focus = weak.length ? weak : [sorted[0]];
    const plan = buildPlan(p.level, focus.map((f) => f.s.id));

    app.innerHTML = `
    <section class="result-head">
      <div>
        <p class="kicker">Result &middot; ${fmtDate(p.date)}</p>
        <h1 class="display">Your level is <em>${L.code}</em>, ${L.name.toLowerCase()}.</h1>
        <p class="lede">${L.summary}</p>
        <p class="result-meta">${p.band === "secure" ? "Secure" : "Developing"} ${L.code} &middot; ${p.correct} of ${p.total} correct</p>
      </div>
      <div class="result-code" aria-hidden="true">${L.code}</div>
    </section>
    ${ruler(p.level)}

    <section class="cols band">
      <div>
        <h2 class="h-section">By skill</h2>
        ${skillBars(rows)}
        <p class="muted small">Each skill estimate is based on how hard the questions you got right and wrong were.</p>
      </div>
      <div>
        <h2 class="h-section">At ${L.code} you can</h2>
        <ul class="list-check">${L.canDo.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <dl class="kv">
          <div><dt>Strongest</dt><dd>${strongest.s.name}</dd></div>
          <div><dt>Focus on</dt><dd>${focus.map((f) => f.s.name).join(" and ")}</dd></div>
        </dl>
      </div>
    </section>

    <section class="band">
      <h2 class="h-section">Your study plan</h2>
      <ol class="exam-plan">
        ${plan.map((w, i) => `
          <li>
            <span class="plan-n">Week ${i + 1}</span>
            <div><h3>${esc(w.title)}</h3><p class="muted">${esc(w.desc)}</p></div>
            <a class="btn btn-sm ${i === 0 ? "" : "btn-line"}" href="${w.link}">${esc(w.cta)}</a>
          </li>`).join("")}
      </ol>
    </section>

    <section class="band cols">
      ${focus.map((f) => `
        <div>
          <h2 class="h-section">Improving your ${f.s.name.toLowerCase()} <span class="muted">(now ${f.sl.code})</span></h2>
          <ol class="list-num">${SKILL_TIPS[f.s.id].map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
          <p><a class="btn btn-sm" href="#/practice?l=${p.level}&s=${f.s.id}">Practise ${f.s.name.toLowerCase()} at ${L.code} &rarr;</a></p>
        </div>`).join("")}
    </section>

    <section class="band cta-line">
      <p>Your progress is saved in this browser.</p>
      <div class="actions"><a class="btn" href="#/unit/${unitsOf(p.level)[0].id}">Start ${L.code} unit 1</a><a class="btn btn-line" href="#/certificate">Get your certificate</a><a class="btn btn-line" href="#/test">Take a new test</a></div>
    </section>`;
  }

  function buildPlan(level, focusIds) {
    const L = lvl(level);
    const fnames = focusIds.map((id) => skill(id).name.toLowerCase()).join(" and ");
    const plan = unitsOf(level).map((u, i) => ({
      title: `Unit ${i + 1}: ${u.title}`,
      desc: `${u.grammar.title}. Read the lesson, learn the ${u.vocab.length} key words and score ${PASS_PCT}%+ on the practice. Then spend 10 minutes a day on ${fnames} in Practice.`,
      link: `#/unit/${u.id}`, cta: "Open unit"
    }));
    plan.push({
      title: `Targeted practice: ${fnames}`,
      desc: `Do sets of fresh ${fnames} questions at ${L.code} until you're getting 8 out of 10 right.`,
      link: `#/practice?l=${level}&s=${focusIds[0]}`, cta: "Practise"
    });
    plan.push({
      title: level < 6 ? `${L.code} level test` : "C2 mastery check",
      desc: level < 6 ? `Score ${PASS_PCT}% or more to unlock ${lvl(level + 1).code}. The questions are new every time you take it.` : "Confirm your C2 level. The questions are new every time you take it.",
      link: `#/level/${level}/test`, cta: "Take test"
    });
    return plan;
  }

  /* =========================================================
     UNLIMITED PRACTICE
     ========================================================= */
  function practicePage(params) {
    let L = +params.get("l") || state.level || 1;
    if (L < 1 || L > 6) L = 1;
    let S = SKILL_IDS.includes(params.get("s")) ? params.get("s") : "";
    const session = { answered: 0, correct: 0, streak: 0 };

    app.innerHTML = `
    <section class="page-head">
      <p class="kicker">Practice</p>
      <h1 class="display">Unlimited practice</h1>
      <p class="lede">Every question is generated as you go. Choose a level and a skill, answer, check the explanation, and keep going.</p>
    </section>
    <section class="controls">
      <div class="seg" role="group" aria-label="Level">${LEVELS.map((x) => `<button data-l="${x.n}" class="${x.n === L ? "on" : ""}">${x.code}</button>`).join("")}</div>
      <div class="seg" role="group" aria-label="Skill"><button data-s="" class="${!S ? "on" : ""}">All skills</button>${SKILLS.map((s) => `<button data-s="${s.id}" class="${s.id === S ? "on" : ""}">${s.name}</button>`).join("")}</div>
    </section>
    <section class="stats-line" id="pstats"></section>
    <section class="sheet sheet-wide" id="pq"></section>`;

    const renderStats = () => {
      const acc = session.answered ? Math.round((session.correct / session.answered) * 100) : 0;
      $("#pstats").innerHTML = `
        <div><span>Answered</span><b>${session.answered}</b></div>
        <div><span>Accuracy</span><b>${session.answered ? acc + "%" : "—"}</b></div>
        <div><span>Streak</span><b>${session.streak}</b></div>
        <div><span>Best streak</span><b>${state.practice.best}</b></div>
        <div><span>Today</span><b>${Math.min(today(), DAILY_GOAL)}<small>/${DAILY_GOAL}</small></b></div>`;
    };
    const setParams = () => history.replaceState(null, "", `#/practice?l=${L}${S ? "&s=" + S : ""}`);

    function nextQ() {
      const q = GEN.generate({ lvl: L, skill: S || undefined }, seen);
      let picked = null, done = false;
      $("#pq").innerHTML = `
        <div class="sheet-top"><span>${lvl(L).code} &middot; ${skill(q.skill).name}</span><span class="muted">Question ${session.answered + 1}</span></div>
        ${q.passage ? `<div class="passage">${esc(q.passage)}</div>` : ""}
        ${q.audio ? audioBox(q.audio) : ""}
        <h2 class="qtext">${esc(q.q)}</h2>
        <div class="options">${q.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="feedback" id="pfb" hidden></div>
        <div class="sheet-actions"><button class="btn-text" id="pskip">Skip</button><button class="btn" id="pgo" disabled>Check</button></div>`;
      const opts = $$("#pq .opt");
      const choose = (i) => { if (done) return; picked = i; opts.forEach((b, j) => b.classList.toggle("selected", j === i)); $("#pgo").disabled = false; };
      opts.forEach((b) => (b.onclick = () => choose(+b.dataset.i)));
      const check = () => {
        if (done) { nextQ(); return; }
        if (picked == null) return;
        done = true;
        const ok = picked === q.a;
        session.answered++; state.practice.answered++; logActivity(1);
        if (ok) { session.correct++; state.practice.correct++; session.streak++; } else session.streak = 0;
        state.practice.best = Math.max(state.practice.best, session.streak);
        save();
        opts.forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add("right"); else if (j === picked) b.classList.add("wrong"); });
        const fb = $("#pfb");
        fb.hidden = false;
        fb.className = "feedback " + (ok ? "ok" : "bad");
        fb.innerHTML = `<b>${ok ? "Correct." : "Answer: " + esc(q.o[q.a]) + "."}</b> ${esc(q.x || "")}${q.audio ? `<div class="muted small">Transcript: ${transcript(q.audio)}</div>` : ""}`;
        $("#pgo").textContent = "Next question →";
        $("#pskip").hidden = true;
        renderStats();
        $("#pgo").focus();
      };
      $("#pgo").onclick = check;
      $("#pskip").onclick = () => { seen.add(GEN.keyOf(q)); nextQ(); };
      document.onkeydown = (e) => {
        const k = e.key.toLowerCase();
        const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
        if (k in map && map[k] < q.o.length) choose(map[k]);
        else if (k === "enter") { e.preventDefault(); check(); }
      };
      if (q.audio && hasTTS) speak(q.audio);
    }

    $$(".seg [data-l]").forEach((b) => (b.onclick = () => { L = +b.dataset.l; $$(".seg [data-l]").forEach((x) => x.classList.toggle("on", x === b)); setParams(); nextQ(); }));
    $$(".seg [data-s]").forEach((b) => (b.onclick = () => { S = b.dataset.s; $$(".seg [data-s]").forEach((x) => x.classList.toggle("on", x === b)); setParams(); nextQ(); }));
    renderStats();
    nextQ();
  }

  /* =========================================================
     LEVELS
     ========================================================= */
  function levelsPage() {
    app.innerHTML = `
    <section class="page-head">
      <p class="kicker">Course</p>
      <h1 class="display">Levels</h1>
      <p class="lede">Six levels aligned to the CEFR. ${state.level ? `You're at <b>${lvl(state.level).code}</b>.` : `Not sure where to start? <a href="#/test">Take the placement test</a>.`}</p>
    </section>
    ${ruler(state.level)}
    <div class="table-list band">
      ${LEVELS.map((L) => {
        const pct = levelProgress(L.n);
        return `
        <a class="row-link${state.level === L.n ? " current" : ""}" href="#/level/${L.n}">
          <span class="code">${L.code}</span>
          <span class="row-title">${L.name}${state.level === L.n ? ` <span class="tag">Your level</span>` : ""}</span>
          <span class="row-desc">${L.summary}<span class="row-sub">About ${L.hours} guided hours to reach this level</span></span>
          <span class="row-meta"><span class="meter"><b style="width:${pct}%"></b></span>${pct}%</span>
        </a>`;
      }).join("")}
    </div>`;
  }

  function levelPage(n) {
    const L = lvl(n);
    const us = unitsOf(n);
    const last = state.history.find((h) => h.type === "level" && h.level === n);
    app.innerHTML = `
    <nav class="crumbs"><a href="#/levels">Levels</a> / ${L.code}</nav>
    <section class="result-head">
      <div>
        <p class="kicker">Level ${n} of 6</p>
        <h1 class="display">${L.name}</h1>
        <p class="lede">${L.summary}</p>
        <p class="result-meta">${us.filter((u) => unitDone(u.id)).length} of ${us.length} units complete</p>
      </div>
      <div class="result-code" aria-hidden="true">${L.code}</div>
    </section>
    ${ruler(n, { compact: true })}

    <section class="cols band">
      <div>
        <h2 class="h-section">Units</h2>
        <div class="table-list">${us.map((u, i) => unitRow(u, i)).join("")}</div>
      </div>
      <div>
        <h2 class="h-section">Goals for this level</h2>
        <ul class="list-check">${L.canDo.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <div class="boxed">
          <h3>Level test</h3>
          <p class="muted">${SKILLS.length * LEVEL_TEST_PER_SKILL} new questions each time, covering all four skills. Score ${PASS_PCT}% to ${n < 6 ? `move up to ${lvl(n + 1).code}` : "confirm C2"}.</p>
          ${last ? `<p class="small">Last attempt: <b>${last.score}%</b>, ${last.passed ? "passed" : "not passed yet"}</p>` : ""}
          <div class="actions"><a class="btn" href="#/level/${n}/test">Take the test</a><a class="btn btn-line" href="#/practice?l=${n}">Practise ${L.code}</a></div>
        </div>
      </div>
    </section>
    <div class="pager">
      ${n > 1 ? `<a href="#/level/${n - 1}">&larr; ${lvl(n - 1).code} ${lvl(n - 1).name}</a>` : "<span></span>"}
      ${n < 6 ? `<a href="#/level/${n + 1}">${lvl(n + 1).code} ${lvl(n + 1).name} &rarr;</a>` : ""}
    </div>`;
  }

  function unitRow(u, i) {
    const s = state.units[u.id];
    return `
    <a class="row-link unit-row" href="#/unit/${u.id}">
      <span class="code">${pad(i + 1)}</span>
      <span class="row-title">${esc(u.title)}<span class="row-sub">${esc(u.grammar.title)}</span></span>
      <span class="row-meta">${s ? (s.done ? `<span class="tag tag-ok">Done &middot; ${s.best}%</span>` : `Best ${s.best}%`) : "Not started"}</span>
    </a>`;
  }

  /* =========================================================
     UNIT
     ========================================================= */
  const TABS = [["learn", "Lesson"], ["vocab", "Vocabulary"], ["reading", "Reading"], ["practice", "Practice"], ["speaking", "Speaking"], ["writing", "Writing"]];

  function unitPage(id, params) {
    const u = UNITS.find((x) => x.id === id);
    if (!u) return notFound();
    const L = lvl(u.level);
    const siblings = unitsOf(u.level);
    const idx = siblings.indexOf(u);
    let tab = params.get("tab") || "learn";
    if (!TABS.some((t) => t[0] === tab)) tab = "learn";

    app.innerHTML = `
    <nav class="crumbs"><a href="#/levels">Levels</a> / <a href="#/level/${L.n}">${L.code}</a> / Unit ${idx + 1}</nav>
    <section class="unit-head">
      <p class="kicker">${L.code} &middot; Unit ${idx + 1} &middot; ${esc(u.topic)}</p>
      <h1 class="display">${esc(u.title)}</h1>
    </section>
    <nav class="tabs" role="tablist">${TABS.map(([k, label], i) => `<button role="tab" class="tab${k === tab ? " active" : ""}" data-tab="${k}"><span>${pad(i + 1)}</span>${label}</button>`).join("")}</nav>
    <section id="tab-body" class="tab-body"></section>
    <div class="pager">
      ${idx > 0 ? `<a href="#/unit/${siblings[idx - 1].id}">&larr; ${esc(siblings[idx - 1].title)}</a>` : `<a href="#/level/${L.n}">&larr; ${L.code} overview</a>`}
      ${idx < siblings.length - 1 ? `<a href="#/unit/${siblings[idx + 1].id}">${esc(siblings[idx + 1].title)} &rarr;</a>` : `<a href="#/level/${L.n}/test">${L.code} level test &rarr;</a>`}
    </div>`;

    const body = $("#tab-body");
    const show = (k) => {
      $$(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === k));
      history.replaceState(null, "", `#/unit/${u.id}?tab=${k}`);
      stopSpeech();
      body.onclick = null;
      ({ learn: renderLearn, vocab: renderVocab, reading: renderReading, practice: renderPractice, speaking: renderSpeaking, writing: renderWriting })[k](body, u, show);
    };
    $$(".tab").forEach((b) => (b.onclick = () => show(b.dataset.tab)));
    show(tab);
  }

  function nextBtn(label, id) { return `<div class="next-row"><button class="btn" id="${id}">${label} &rarr;</button></div>`; }

  function renderLearn(el, u, show) {
    el.innerHTML = `
    <div class="cols cols-wide">
      <article class="prose">
        <h2>${esc(u.grammar.title)}</h2>
        <div class="grammar">${u.grammar.html}</div>
        <h3>Examples</h3>
        <ul class="examples">${u.grammar.examples.map((e) => `<li>${sayBtn(e)}<span>${esc(e)}</span></li>`).join("")}</ul>
      </article>
      <aside class="side">
        <h3 class="h-small">Objectives</h3>
        <ul class="list-check">${u.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
        <h3 class="h-small">Route</h3>
        <ol class="list-num small"><li>Lesson</li><li>Vocabulary</li><li>Reading</li><li>Practice (${PASS_PCT}% to complete)</li><li>Speaking</li><li>Writing</li></ol>
      </aside>
    </div>
    ${nextBtn("Vocabulary", "go-next")}`;
    $("#go-next").onclick = () => show("vocab");
  }

  function renderVocab(el, u, show) {
    const added = addUnitToDeck(u);
    el.innerHTML = `
    <p class="muted">Try to recall each meaning before you reveal it. ${added ? `These ${added} words have been added to your <a href="#/review">review deck</a>.` : `These words are in your <a href="#/review">review deck</a>.`}</p>
    <div class="vocab">
      ${u.vocab.map(([w, d, ex], i) => `
        <div class="vocab-row">
          <span class="vocab-n">${pad(i + 1)}</span>
          <div class="vocab-word">${sayBtn(w)}<b>${esc(w)}</b></div>
          <div class="vocab-def" data-hidden="true">
            <button class="btn-text reveal">Reveal meaning</button>
            <div class="vocab-body"><p>${esc(d)}</p><p class="vocab-ex">${sayBtn(ex)}<i>${esc(ex)}</i></p></div>
          </div>
        </div>`).join("")}
    </div>
    <div class="next-row"><button class="btn btn-line" id="reveal-all">Reveal all</button> <button class="btn" id="go-next">Reading &rarr;</button></div>`;
    $$(".reveal", el).forEach((b) => (b.onclick = () => (b.parentElement.dataset.hidden = "false")));
    $("#reveal-all").onclick = () => $$(".vocab-def", el).forEach((d) => (d.dataset.hidden = "false"));
    $("#go-next").onclick = () => show("reading");
  }

  function renderReading(el, u, show) {
    let html = esc(u.reading.text);
    u.vocab.map((v) => v[0]).forEach((w) => {
      const re = new RegExp(`\\b(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
      html = html.replace(re, `<mark>$1</mark>`);
    });
    el.innerHTML = `
    <article class="reading">
      <h2>${esc(u.reading.title)}</h2>
      ${hasTTS ? `<div class="audio"><button class="btn btn-sm" data-speak="${esc(u.reading.text)}">${ICON_PLAY} Read aloud</button><button class="btn btn-sm btn-line" data-speak="${esc(u.reading.text)}" data-rate="0.75">Slower</button></div>` : ""}
      <p class="reading-text">${html}</p>
      <p class="muted small">Underlined words are from this unit's vocabulary. Read it once for the general idea, then again for detail.</p>
    </article>
    ${nextBtn("Practice", "go-next")}`;
    $("#go-next").onclick = () => show("practice");
  }

  function renderPractice(el, u, show) {
    const s = state.units[u.id];
    el.innerHTML = `
      <div class="practice-head">
        <p class="muted">${s ? `Best score <b>${s.best}%</b>${s.done ? " &middot; unit complete" : ` &middot; ${PASS_PCT}% completes the unit`}` : `Score ${PASS_PCT}% or more to complete the unit.`}</p>
        <button class="btn btn-sm btn-line" id="fresh">New practice set</button>
      </div>
      <div id="ex-host"></div>`;
    const scoreMsg = (score) => {
      const prev = state.units[u.id] || { best: 0, done: false };
      state.units[u.id] = { best: Math.max(prev.best, score), done: prev.done || score >= PASS_PCT, last: new Date().toISOString() };
      save();
      return score >= PASS_PCT
        ? `<b>Unit complete.</b> <button class="btn-text" id="go-speak">Go to speaking &rarr;</button>`
        : `You need ${PASS_PCT}% to complete the unit. Review the lesson, then try a new set.`;
    };
    mountExercises($("#ex-host", el), u.ex, scoreMsg, () => renderPractice(el, u, show));
    $("#fresh", el).onclick = () => {
      const topics = GEN.UNIT_TOPICS[u.id];
      const local = new Set(seen);
      const set = [];
      for (let i = 0; i < 6; i++) set.push(GEN.generate({ lvl: u.level, topics }, local));
      for (let i = 0; i < 4; i++) set.push(GEN.generate({ lvl: u.level }, local));
      set.forEach((q) => seen.add(GEN.keyOf(q)));
      $(".practice-head p", el).innerHTML = `New practice set: 10 questions on <b>${esc(u.grammar.title)}</b> and other ${lvl(u.level).code} material.`;
      mountExercises($("#ex-host", el), set.map(toEx), scoreMsg, () => $("#fresh", el).click());
      el.scrollIntoView({ behavior: "smooth" });
    };
    el.onclick = (e) => { if (e.target.id === "go-speak") show("speaking"); };
  }

  function renderSpeaking(el, u) {
    const device = SPEECH.mode() === "device";
    el.innerHTML = `
    <p class="muted">Listen to each sentence, then say it aloud. ${canSpeak ? "Press <b>Speak</b> and we'll check each word." + (device ? " Your voice is checked on this device by an open-source model and never uploaded." : "") : "Your browser can't record audio, so listen, repeat, and compare yourself."}</p>
    <div class="speak-list">
      ${u.speaking.map((s, i) => `
        <div class="speak-row" data-i="${i}">
          <span class="vocab-n">${pad(i + 1)}</span>
          <p class="speak-text">${esc(s)}</p>
          <div class="speak-actions">
            <button class="btn btn-sm btn-line" data-speak="${esc(s)}">${ICON_PLAY} Listen</button>
            ${canSpeak ? `<button class="btn btn-sm rec">${ICON_MIC} Speak</button>` : ""}
          </div>
          <div class="speak-result small"></div>
        </div>`).join("")}
    </div>
    <div class="boxed"><h3>Speaking task</h3><p>Talk for 60 seconds about this: <b>${esc(speakingPrompt(u))}</b> Try to use this unit's grammar and vocabulary.</p>
      ${canSpeak ? `<div class="actions"><button class="btn rec-long">${ICON_MIC} Record my answer</button></div><div class="speak-status small"></div><div class="long-result"></div>` : `<p class="muted small">Record yourself on your phone and listen back.</p>`}</div>`;
    if (!canSpeak) return;
    $$(".speak-row", el).forEach((row) => {
      const target = u.speaking[+row.dataset.i];
      const btn = $(".rec", row);
      const out = $(".speak-result", row);
      btn.onclick = async () => {
        const r = await micRun(btn, out, { maxMs: 12000 });
        if (!r) return;
        if (!r.text) { out.innerHTML = "Didn't catch that. Try again, a little louder."; return; }
        const c = SPEECH.compare(target, r.text);
        logActivity(1);
        const marked = c.words.map((x) => (x.st === "ok" ? esc(x.w) : `<span class="${x.st === "close" ? "close" : "missed"}">${esc(x.w)}</span>`)).join(" ");
        out.innerHTML = `Heard: “${esc(r.text)}” &middot; <b class="${c.score >= 80 ? "t-ok" : c.score >= 50 ? "t-mid" : "t-bad"}">${c.score}% match</b>. ${c.score >= 90 ? "Excellent." : c.score >= 70 ? "Good. Practise the marked words." : c.score >= 50 ? "Close. Try once more." : "Listen again and repeat it slowly."}${c.score < 100 ? `<div class="speak-marked">${marked}</div><div class="muted">Underlined words weren't heard; dotted words sounded like a different word.</div>` : ""}`;
      };
    });
    const lb = $(".rec-long", el);
    lb.onclick = async () => {
      const r = await micRun(lb, $(".speak-status", el), { maxMs: 90000, silenceMs: 8000 });
      if (!r) return;
      logActivity(2);
      $(".long-result", el).innerHTML = fluencyHTML(r, u.vocab.map((v) => v[0]));
    };
  }
  function speakingPrompt(u) {
    return {
      "a1-1": "Introduce yourself: your name, age, country and job.",
      "a1-2": "Describe a normal day in your life.",
      "a2-1": "What did you do last weekend?",
      "a2-2": "Describe your plans for your next holiday and compare two places.",
      "b1-1": "Talk about the most interesting experience you have had.",
      "b1-2": "What will you do if you get your dream job?",
      "b2-1": "Describe a decision you regret, or one you're glad you made.",
      "b2-2": "Report a conversation you had recently.",
      "c1-1": "Describe something that really surprised you, using inversion for emphasis.",
      "c1-2": "Give a cautious, hedged opinion on whether social media harms society.",
      "c2-1": "Make a formal recommendation to your company's board.",
      "c2-2": "Give a short persuasive speech that uses at least two rhetorical devices."
    }[u.id] || (window.LU_DATA.SPEAKING_PROMPTS || {})[u.id] || "Talk about the topic of this unit.";
  }
  function similarity(target, heard) {
    const tw = norm(target).split(" ");
    const pool = norm(heard).split(" ");
    let hit = 0;
    tw.forEach((w) => { const i = pool.indexOf(w); if (i >= 0) { hit++; pool.splice(i, 1); } });
    return Math.round((hit / tw.length) * 100);
  }

  /* =========================================================
     EXERCISE ENGINE (used by units and level tests)
     ========================================================= */
  function mountExercises(host, list, onScore, onRetry) {
    const resp = list.map(() => null);
    const results = list.map(() => false);
    const orders = {};
    host.innerHTML = `
      <ol class="ex-list">${list.map((ex, i) => exHTML(ex, i)).join("")}</ol>
      <div class="ex-footer"><button class="btn btn-lg" id="check">Check answers</button><div id="ex-score"></div></div>`;

    list.forEach((ex, i) => {
      const box = $(`.ex[data-i="${i}"]`, host);
      if (ex.t === "mc" || ex.t === "listen") {
        $$(".opt", box).forEach((b) => (b.onclick = () => {
          if (box.classList.contains("graded")) return;
          resp[i] = +b.dataset.o;
          $$(".opt", box).forEach((x) => x.classList.toggle("selected", x === b));
        }));
      } else if (ex.t === "fill") {
        const inp = $("input", box);
        inp.oninput = () => (resp[i] = inp.value);
      } else if (ex.t === "order") {
        let tiles = shuffle(ex.a.map((w, k) => ({ w, k })));
        if (tiles.every((t, k) => t.k === k)) tiles = tiles.reverse();
        orders[i] = { pool: tiles, built: [] };
        renderOrder(box, i);
      }
    });

    function renderOrder(box, i) {
      const st = orders[i];
      const graded = box.classList.contains("graded");
      $(".built", box).innerHTML = st.built.length ? st.built.map((t, j) => `<button class="tile" data-from="built" data-j="${j}">${esc(t.w)}</button>`).join("") : `<span class="muted small">Click the words below in order</span>`;
      $(".pool", box).innerHTML = st.pool.map((t, j) => `<button class="tile" data-from="pool" data-j="${j}">${esc(t.w)}</button>`).join("");
      $$(".tile", box).forEach((b) => (b.onclick = () => {
        if (graded) return;
        const from = b.dataset.from, j = +b.dataset.j;
        if (from === "pool") st.built.push(st.pool.splice(j, 1)[0]); else st.pool.push(st.built.splice(j, 1)[0]);
        resp[i] = st.built.map((t) => t.w);
        renderOrder(box, i);
      }));
    }

    $("#check", host).onclick = () => {
      let correct = 0;
      list.forEach((ex, i) => {
        const box = $(`.ex[data-i="${i}"]`, host);
        box.classList.add("graded");
        let ok = false, answerText = "";
        if (ex.t === "mc" || ex.t === "listen") {
          ok = resp[i] === ex.a;
          answerText = ex.o[ex.a];
          $$(".opt", box).forEach((b) => { const o = +b.dataset.o; if (o === ex.a) b.classList.add("right"); else if (o === resp[i]) b.classList.add("wrong"); b.disabled = true; });
        } else if (ex.t === "fill") {
          ok = resp[i] != null && ex.a.map(norm).includes(norm(resp[i]));
          answerText = ex.a.slice(0, 2).join(" / ");
          const inp = $("input", box); inp.disabled = true; inp.classList.add(ok ? "right" : "wrong");
        } else if (ex.t === "order") {
          ok = resp[i] != null && norm(resp[i].join(" ")) === norm(ex.a.join(" "));
          answerText = ex.a.join(" ") + (ex.p || "");
          $(".built", box).classList.add(ok ? "right" : "wrong");
        }
        if (ok) correct++;
        box.classList.add(ok ? "is-right" : "is-wrong");
        $(".fb", box).innerHTML = ok
          ? `<b class="t-ok">Correct.</b> ${ex.x ? esc(ex.x) : ""}`
          : `<b class="t-bad">Answer: ${esc(answerText)}.</b> ${ex.x ? esc(ex.x) : ""}`;
        if (ex.audio && !ex.sameAsAbove) $(".fb", box).innerHTML += `<div class="muted small">Transcript: ${transcript(ex.audio)}</div>`;
        results[i] = ok;
      });
      const pct = Math.round((correct / list.length) * 100);
      logActivity(list.length);
      const msg = onScore(pct, correct, list.length, results);
      $("#check", host).remove();
      $("#ex-score", host).innerHTML = `
        <div class="score"><span class="score-n">${pct}<small>%</small></span><span class="muted">${correct} of ${list.length} correct</span></div>
        <div class="score-msg"><p>${msg}</p><button class="btn btn-sm btn-line" id="retry">Try again</button></div>`;
      $("#retry", host).onclick = onRetry;
      $("#ex-score", host).scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  function exHTML(ex, i) {
    const label = ex.label || { mc: "Choose the answer", listen: "Listening", fill: "Complete the sentence", order: "Put the words in order" }[ex.t];
    let body = "";
    if (ex.sameAsAbove) body += `<p class="small muted same-above">Use the same ${esc(ex.sameAsAbove)} as above.</p>`;
    else {
      if (ex.pre) body += `<p class="ex-pre">${esc(ex.pre)}</p>`;
      if (ex.passage) body += `<div class="passage">${esc(ex.passage)}</div>`;
      if (ex.audio) body += audioBox(ex.audio);
    }
    if (ex.t === "mc" || ex.t === "listen") {
      body += `<p class="ex-q">${esc(ex.q)}</p><div class="options compact">${ex.o.map((o, k) => `<button class="opt" data-o="${k}"><span class="key">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
    } else if (ex.t === "fill") {
      const [a, b] = ex.q.split("___");
      body += `<p class="ex-q fill-q">${esc(a)}<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer">${esc(b || "")}</p>`;
    } else if (ex.t === "order") {
      body += `<div class="built"></div><div class="pool"></div>${ex.p ? `<p class="small muted">The sentence ends with “${esc(ex.p)}”</p>` : ""}`;
    }
    return `<li class="ex" data-i="${i}"><div class="ex-head"><span class="ex-n">${pad(i + 1)}</span><span class="ex-label">${label}${ex.skill ? " &middot; " + skill(ex.skill).name : ""}</span></div>${body}<div class="fb"></div></li>`;
  }

  /* =========================================================
     LEVEL TEST (generated fresh every attempt)
     ========================================================= */
  function levelTest(n) {
    const L = lvl(n);
    const local = new Set(seen);
    const qs = [];
    SKILL_IDS.forEach((s) => { for (let i = 0; i < LEVEL_TEST_PER_SKILL; i++) qs.push(GEN.generate({ lvl: n, skill: s }, local)); });
    qs.forEach((q) => seen.add(GEN.keyOf(q)));
    const list = shuffle(qs).map(toEx);
    app.innerHTML = `
    <nav class="crumbs"><a href="#/levels">Levels</a> / <a href="#/level/${n}">${L.code}</a> / Level test</nav>
    <section class="unit-head">
      <p class="kicker">${L.code} level test</p>
      <h1 class="display">${L.name} level test</h1>
      <p class="muted">${list.length} questions &middot; pass mark ${PASS_PCT}% &middot; new questions every attempt</p>
    </section>
    <div id="lt-host"></div>`;
    mountExercises($("#lt-host"), list, (pct) => {
      const passed = pct >= PASS_PCT;
      let moved = false;
      if (passed && n < 6 && (state.level == null || state.level <= n)) { state.level = n + 1; moved = true; }
      if (state.level == null) state.level = n;
      state.history.unshift({ type: "level", date: new Date().toISOString(), level: n, score: pct, passed });
      save();
      if (!passed) return `Not this time: you need ${PASS_PCT}%. Practise at <a href="#/practice?l=${n}">${L.code}</a>, then take a new test.`;
      if (moved) return `<b>Passed. You've unlocked ${lvl(n + 1).code} ${lvl(n + 1).name}.</b> <a href="#/level/${n + 1}">Go to ${lvl(n + 1).code} &rarr;</a>`;
      return n === 6 ? `<b>C2 confirmed.</b>` : `<b>Passed.</b> You're already above this level.`;
    }, () => levelTest(n));
  }


  /* =========================================================
     EXAM PRACTICE (IELTS-style and TOEIC-style)
     ========================================================= */
  const EX = window.LU_EXAM;
  const EXAM_NOTE = "Original practice material in the style of the real tests. Scores are rough estimates, not official results.";
  const EXAM_TASKS = {
    "ielts-listening": { exam: "IELTS", name: "Listening: forms and discussions", desc: "Fill in a form from a phone call, then answer questions on discussions.", build: () => EX.ielts.form().concat(EX.many(EX.ielts.discussion, 2)) },
    "ielts-reading": { exam: "IELTS", name: "Reading: True / False / Not given", desc: "Read an academic-style passage and decide if statements agree with it.", build: () => EX.ielts.reading() },
    "ielts-writing": { exam: "IELTS", name: "Writing Task 2: essay", desc: "A 40-minute opinion, discussion or problem essay, with feedback.", page: (pr) => examWriting(pr) },
    "ielts-speaking": { exam: "IELTS", name: "Speaking Part 2: cue card", desc: "One minute to prepare, then talk for up to two minutes.", page: (pr) => examSpeaking(pr) },
    "ielts-mock": { exam: "IELTS", name: "Mini mock test", desc: "Listening and reading, 30 minutes, with a band estimate.", page: () => examMock("ielts") },
    "toeic-p2": { exam: "TOEIC", name: "Part 2: Question and response", desc: "Hear a question and choose the best reply.", build: () => EX.many(EX.toeic.p2, 10) },
    "toeic-p3": { exam: "TOEIC", name: "Part 3: Conversations", desc: "Short workplace conversations, two questions each.", build: () => EX.many(EX.toeic.p3, 4) },
    "toeic-p5": { exam: "TOEIC", name: "Part 5: Incomplete sentences", desc: "Business grammar and vocabulary.", build: () => { const seen = new Set(), out = []; for (let i = 0; i < 40 && out.length < 12; i++) { const q = EX.toeic.p5(); if (!seen.has(q.q)) { seen.add(q.q); out.push(q); } } return out; } },
    "toeic-p7": { exam: "TOEIC", name: "Part 7: Reading", desc: "Emails, notices, memos and adverts.", build: () => EX.many(EX.toeic.p7, 2) },
    "toeic-mock": { exam: "TOEIC", name: "Mini mock test", desc: "37 questions in 25 minutes, with a score estimate.", page: () => examMock("toeic") }
  };
  function examHub() {
    const col = (exam) => Object.entries(EXAM_TASKS).filter(([, t]) => t.exam === exam).map(([k, t]) => `
      <a class="exam-task" href="#/exam/${k}"><b>${esc(t.name)}</b><span class="muted small">${esc(t.desc)}</span></a>`).join("");
    const recent = state.history.filter((h) => h.type === "exam").slice(0, 6);
    app.innerHTML = `
    <section class="page-head"><p class="kicker">Exam practice</p><h1 class="display">IELTS and TOEIC practice</h1>
      <p class="lede">Practise the question types used in the two most popular English exams, with timed mock tests and feedback on writing and speaking.</p>
      <p class="muted small">${EXAM_NOTE} IELTS is a trademark of the British Council, IDP and Cambridge; TOEIC is a trademark of ETS. This site isn't connected with them.</p></section>
    <section class="exam-cols">
      <div class="exam-col"><p class="kicker">IELTS-style &middot; study, work and migration</p>${col("IELTS")}</div>
      <div class="exam-col"><p class="kicker">TOEIC-style &middot; English for work</p>${col("TOEIC")}</div>
    </section>
    ${recent.length ? `<section class="sheet"><h2 class="h-section">Recent results</h2><table class="table"><tbody>${recent.map((h) => `<tr><td>${fmtDate(h.date)}</td><td>${esc(h.name)}</td><td>${esc(h.result)}</td></tr>`).join("")}</tbody></table></section>` : ""}`;
  }
  function examHead(t, extra) {
    return `<nav class="crumbs"><a href="#/exam">Exam practice</a> / ${t.exam}</nav>
    <section class="unit-head"><p class="kicker">${t.exam}-style</p><h1 class="display display-sm">${esc(t.name)}</h1><p class="muted">${esc(t.desc)} ${extra || ""}</p></section>`;
  }
  function examRoute(k, params) {
    const t = EXAM_TASKS[k];
    if (!t) { location.hash = "#/exam"; return; }
    if (t.page) { t.page(params); return; }
    const list = t.build();
    app.innerHTML = examHead(t, "A new set is generated every time.") + `<div id="ex-host"></div>`;
    mountExercises($("#ex-host"), list, (pct) => {
      state.history.unshift({ type: "exam", date: new Date().toISOString(), name: `${t.exam}-style ${t.name.split(":")[0]}`, result: `${pct}%` });
      save();
      return `${pct >= 80 ? "<b>Strong result.</b>" : pct >= 60 ? "<b>Good.</b>" : "<b>Keep practising.</b>"} ${k.startsWith("toeic") ? "In TOEIC, about 75% correct is roughly a B2-level score." : "In IELTS, about 75% correct is roughly band 7."} Press <b>Try again</b> for a new set, or go back to <a href="#/exam">all tasks</a>.`;
    }, () => examRoute(k, params));
  }
  const mmss = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  function startTimer(el, seconds, onEnd) {
    clearInterval(pageTimer);
    const end = Date.now() + seconds * 1000;
    const tick = () => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      if (el && el.isConnected) { el.textContent = mmss(left); el.classList.toggle("low", left <= 60); }
      if (!left) { clearInterval(pageTimer); pageTimer = null; onEnd && onEnd(); }
    };
    tick();
    pageTimer = setInterval(tick, 1000);
  }
  function examMock(kind) {
    const t = EXAM_TASKS[kind + "-mock"];
    const mins = kind === "toeic" ? 25 : 30;
    app.innerHTML = examHead(t) + `
    <section class="sheet narrow-sheet"><h2 class="h-section">Before you start</h2>
      <ul class="list-check"><li>${mins} minutes for the whole test. When the time runs out, your answers are marked automatically.</li><li>Listening comes first. In the real test you hear each recording once; here you can replay, but try to listen only once.</li><li>Use headphones in a quiet place.</li></ul>
      <div class="actions"><button class="btn btn-lg" id="mk-go">Start the ${mins}-minute test</button></div></section>`;
    $("#mk-go").onclick = () => {
      const list = kind === "toeic" ? EX.toeic.mock() : EX.ielts.mock();
      app.innerHTML = examHead(t) + `<div class="exam-timer" role="timer"><span>Time left</span><b id="mk-time"></b></div><div id="ex-host"></div>`;
      mountExercises($("#ex-host"), list, (pct, correct, total, results) => {
        clearInterval(pageTimer); pageTimer = null;
        const part = (sec) => { const idx = list.map((e, i) => (e.section === sec ? i : -1)).filter((i) => i >= 0); return idx.length ? Math.round((idx.filter((i) => results[i]).length / idx.length) * 100) : 0; };
        const L = part("L"), R = part("R");
        let result, html;
        if (kind === "toeic") {
          const ls = EX.toeicScale(L), rs = EX.toeicScale(R), tot = ls + rs;
          result = `${tot} / 990 (est.)`;
          html = `<div class="exam-result"><div><span>Listening</span><b>${ls}</b><small>${L}% correct</small></div><div><span>Reading</span><b>${rs}</b><small>${R}% correct</small></div><div><span>Total</span><b>${tot}</b><small>about ${EX.toeicToCEFR(tot)}</small></div></div>`;
        } else {
          const lb = EX.ieltsBand(L), rb = EX.ieltsBand(R), ov = Math.round(((lb + rb) / 2) * 2) / 2;
          result = `Band ${ov} (est., L+R)`;
          html = `<div class="exam-result"><div><span>Listening</span><b>${lb}</b><small>${L}% correct</small></div><div><span>Reading</span><b>${rb}</b><small>${R}% correct</small></div><div><span>Overall (L+R)</span><b>${ov}</b><small>about ${EX.bandToCEFR(ov)}</small></div></div>`;
        }
        state.history.unshift({ type: "exam", date: new Date().toISOString(), name: `${t.exam}-style mini mock`, result });
        save();
        return `${html}<p class="small muted">${EXAM_NOTE} A short test like this can easily be half a band or 50 points out either way.</p>${kind === "ielts" ? `Complete your estimate with <a href="#/exam/ielts-writing">Writing</a> and <a href="#/exam/ielts-speaking">Speaking</a>.` : ""}`;
      }, () => examMock(kind));
      startTimer($("#mk-time"), mins * 60, () => { const c = $("#check"); if (c) c.click(); });
    };
  }

  /* --- AI marking for writing and speaking (optional) --- */
  const band = { type: "object", additionalProperties: false, required: ["band", "comment"], properties: { band: { type: "number" }, comment: { type: "string" } } };
  const MARK_SCHEMA = (crit) => ({
    type: "object", additionalProperties: false, required: crit.concat(["overall", "summary", "improvements"]),
    properties: Object.assign({}, ...crit.map((c) => ({ [c]: band })), {
      overall: { type: "number" }, summary: { type: "string" },
      improvements: { type: "array", items: { type: "object", additionalProperties: false, required: ["original", "better", "why"], properties: { original: { type: "string" }, better: { type: "string" }, why: { type: "string" } } } }
    })
  });
  const CRIT_NAMES = { task_response: "Task response", coherence: "Coherence and cohesion", lexical: "Vocabulary", grammar: "Grammar", fluency: "Fluency and coherence" };
  async function aiMark(host, { crit, system, content }) {
    const local = aiProvider() === "local";
    host.innerHTML = `<p class="muted">Marking your answer…</p><div class="dl" hidden><div class="dl-bar"><i></i></div><span></span></div>`;
    try {
      const txt = await aiGenerate({
        system, maxTokens: 2500, schema: MARK_SCHEMA(crit),
        messages: [{ role: "user", content: content + (local ? `\n\nReply only with JSON in this shape: {${crit.map((c) => `"${c}": {"band": 6, "comment": "..."}`).join(", ")}, "overall": 6, "summary": "...", "improvements": [{"original": "...", "better": "...", "why": "..."}]}` : "") }],
        onProgress: (r) => { const d = $(".dl", host); if (d) { d.hidden = false; $("i", d).style.width = Math.round((r.progress || 0) * 100) + "%"; $("span", d).textContent = r.text || ""; } }
      });
      const o = parseLooseJSON(txt);
      if (!o) { host.innerHTML = `<div class="passage">${esc(txt)}</div>`; return null; }
      const b = (v) => { const n = Math.round(Number(v) * 2) / 2; return isFinite(n) && n > 0 ? Math.min(9, n) : null; };
      const ov = b(o.overall) || (() => { const v = crit.map((c) => b(o[c] && o[c].band)).filter(Boolean); return v.length ? Math.round((v.reduce((a, x) => a + x, 0) / v.length) * 2) / 2 : null; })();
      host.innerHTML = `
        <div class="exam-result">${crit.map((c) => `<div><span>${CRIT_NAMES[c]}</span><b>${b(o[c] && o[c].band) || "–"}</b></div>`).join("")}<div><span>Overall</span><b>${ov || "–"}</b><small>${ov ? "about " + EX.bandToCEFR(ov) : ""}</small></div></div>
        ${o.summary ? `<p>${esc(o.summary)}</p>` : ""}
        <dl class="crit">${crit.map((c) => o[c] && o[c].comment ? `<dt>${CRIT_NAMES[c]}</dt><dd>${esc(o[c].comment)}</dd>` : "").join("")}</dl>
        ${Array.isArray(o.improvements) && o.improvements.length ? `<h3 class="h-section">Improve these sentences</h3>${o.improvements.slice(0, 5).map((x) => `<div class="fix"><div><s>${esc(x.original || "")}</s></div><div><b>${esc(x.better || "")}</b></div>${x.why ? `<div class="muted">${esc(x.why)}</div>` : ""}</div>`).join("")}` : ""}
        <p class="small muted">AI estimate${local ? " from the free on-device model, which is much less reliable than a human examiner" : ""}. Real examiners may score differently.</p>`;
      return ov;
    } catch (e) {
      host.innerHTML = `<p class="t-bad">${esc(aiErrorText(e))}</p>`;
      return null;
    }
  }
  const noAIHint = () => `<p class="small muted">Want an estimated band and corrections? <a href="#/talk">Set up the AI partner</a> (there's a free option) and it will mark your answers here too.</p>`;

  const LINKERS = /\b(however|moreover|furthermore|in addition|on the other hand|therefore|consequently|as a result|for example|for instance|in conclusion|to sum up|although|whereas|while|despite|nevertheless|firstly|secondly|finally|in contrast|similarly|this means|because of this)\b/gi;
  function examWriting(params) {
    const t = EXAM_TASKS["ielts-writing"];
    let idx = +params.get("p");
    if (!(idx >= 0 && idx < EX.WRITING.length)) idx = Math.floor(Math.random() * EX.WRITING.length);
    const [type, prompt] = EX.WRITING[idx];
    const key = "ielts-" + idx;
    const saved = (state.writing[key] && state.writing[key].text) || "";
    app.innerHTML = examHead(t, "Aim for at least 250 words in 40 minutes.") + `
    <div class="cols cols-wide">
      <div>
        <div class="boxed"><p class="kicker">Task 2 &middot; ${esc({ opinion: "Opinion", discussion: "Discuss both views", problem: "Problem and solution", advantages: "Advantages and disadvantages" }[type])}</p><h2 class="w-prompt">${esc(prompt)}</h2></div>
        <textarea id="w-text" class="w-text" rows="16" spellcheck="false" placeholder="Start writing. The 40-minute timer starts when you type.">${esc(saved)}</textarea>
        <div class="w-bar"><span id="w-count" class="mono"></span><span class="exam-timer inline"><span>Time</span><b id="w-time">40:00</b></span><button class="btn" id="w-check">Get feedback</button></div>
        <div id="w-out"></div>
      </div>
      <aside>
        <h3 class="h-section">How to plan it</h3>
        <ol class="exam-plan">${EX.PLANS[type].map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
        <p class="small muted">Spell-check is off, as in the real test.</p>
        <p><a href="#/exam/ielts-writing?p=${(idx + 1) % EX.WRITING.length}">Try a different question &rarr;</a></p>
      </aside>
    </div>`;
    const ta = $("#w-text"), cnt = $("#w-count");
    let started = false;
    const words = () => (ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0);
    const upd = () => { const n = words(); cnt.textContent = `${n} words`; cnt.classList.toggle("t-ok", n >= 250); };
    ta.oninput = () => {
      upd();
      state.writing[key] = { text: ta.value, done: false }; save();
      if (!started) { started = true; startTimer($("#w-time"), 40 * 60, () => { $("#w-time").textContent = "Time's up"; }); }
    };
    upd();
    $("#w-check").onclick = async () => {
      const text = ta.value.trim(), n = words();
      if (n < 40) { $("#w-out").innerHTML = `<p class="t-bad">Write at least a few paragraphs first.</p>`; return; }
      const paras = text.split(/\n\s*\n|\n/).filter((p) => p.trim().split(/\s+/).length > 8).length;
      const links = Array.from(new Set((text.match(LINKERS) || []).map((x) => x.toLowerCase())));
      const opinion = /\b(i (strongly )?(believe|think|agree|disagree|feel)|in my (view|opinion)|from my perspective|i would argue)\b/i.test(text);
      const sents = text.split(/[.!?]+/).filter((x) => x.trim()).length;
      const stop = new Set("the a an and or but of to in on for is are be it this that with as at by from they their there was were have has not can will which who more people also".split(" "));
      const freq = {};
      text.toLowerCase().match(/[a-z']+/g).forEach((w) => { if (w.length > 3 && !stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
      const rep = Object.entries(freq).filter(([, c]) => c >= 5).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const row = (ok, txt) => `<li class="${ok ? "" : "warn"}">${txt}</li>`;
      logActivity(3);
      state.writing[key] = { text: ta.value, done: true }; save();
      $("#w-out").innerHTML = `<section class="sheet"><h2 class="h-section">Checklist</h2><ul class="list-check">
        ${row(n >= 250, `${n} words ${n >= 250 ? "(enough)" : "&middot; under 250 words loses marks for task response"}`)}
        ${row(paras >= 4, `${paras} paragraph${paras === 1 ? "" : "s"} ${paras >= 4 ? "" : "&middot; aim for 4–5: introduction, two or three body paragraphs, conclusion"}`)}
        ${row(links.length >= 4, `Linking words: ${links.length ? links.map(esc).join(", ") : "none found"}${links.length >= 4 ? "" : " &middot; use a few more to connect your ideas"}`)}
        ${type !== "problem" ? row(opinion, opinion ? "Your opinion is clearly stated." : "We couldn't find a clear opinion. This question type asks for one.") : ""}
        ${row(!rep.length, rep.length ? `Repeated words: ${rep.map(([w, c]) => `${esc(w)} (${c}×)`).join(", ")} &middot; vary them with synonyms` : "Good range: no words repeated too often.")}
        ${row(sents && n / sents <= 28, `Average sentence length: ${sents ? Math.round(n / sents) : 0} words`)}
      </ul></section><section class="sheet" id="w-ai">${hasAI() ? "" : noAIHint()}</section>`;
      if (hasAI()) {
        const ov = await aiMark($("#w-ai"), {
          crit: ["task_response", "coherence", "lexical", "grammar"],
          system: "You are an experienced, fair IELTS Writing examiner. Mark a Task 2 essay using the four public IELTS band descriptors (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Give each a band from 1 to 9 in steps of 0.5 and a short comment written to the candidate in simple English. Essays under 250 words lose marks in Task Response. Then give the overall band, a two-sentence summary and up to 5 sentences from the essay rewritten at a higher level, each with a short reason. Be honest; do not inflate scores.",
          content: `Question: ${prompt}\n\nCandidate's essay (${n} words):\n${text}`
        });
        if (ov) { state.history.unshift({ type: "exam", date: new Date().toISOString(), name: "IELTS-style Writing Task 2", result: `Band ${ov} (AI est.)` }); save(); }
      }
    };
  }

  function examSpeaking(params) {
    const t = EXAM_TASKS["ielts-speaking"];
    let idx = +params.get("c");
    if (!(idx >= 0 && idx < EX.CUE_CARDS.length)) idx = Math.floor(Math.random() * EX.CUE_CARDS.length);
    const [topic, points] = EX.CUE_CARDS[idx];
    app.innerHTML = examHead(t) + `
    <section class="cue">
      <h2 class="w-prompt">${esc(topic)}</h2>
      <p class="muted">You should say:</p><ul>${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
    </section>
    <section class="sheet" id="sp-stage">
      ${canSpeak ? `<p>You have <b>one minute</b> to prepare. You can make notes. Then speak for <b>one to two minutes</b>.</p>
      <div class="actions"><button class="btn btn-lg" id="sp-prep">Start preparing</button><button class="btn btn-lg btn-line" id="sp-now">Skip to speaking</button></div>`
      : `<p>Your browser can't record audio. Prepare for one minute, then record yourself on your phone for two minutes and listen back.</p>`}
    </section>
    <div id="sp-out"></div>
    <p><a href="#/exam/ielts-speaking?c=${(idx + 1) % EX.CUE_CARDS.length}">Try a different card &rarr;</a></p>`;
    if (!canSpeak) return;
    const speakStage = () => {
      clearInterval(pageTimer); pageTimer = null;
      $("#sp-stage").innerHTML = `<p>Speak now for up to two minutes. Press <b>Stop</b> when you finish.</p>
        <div class="actions"><button class="btn btn-lg" id="sp-rec">${ICON_MIC} Start speaking</button><span class="exam-timer inline"><span>Time</span><b id="sp-time">2:00</b></span></div><div class="speak-status small" id="sp-status"></div>`;
      const btn = $("#sp-rec");
      btn.onclick = async () => {
        const first = !btn._ctl;
        if (first) startTimer($("#sp-time"), 120, () => { if (btn._ctl) btn._ctl.stop(); });
        const r = await micRun(btn, $("#sp-status"), { maxMs: 125000, silenceMs: 15000 });
        clearInterval(pageTimer); pageTimer = null;
        if (!r) return;
        logActivity(3);
        $("#sp-out").innerHTML = `<section class="sheet">${fluencyHTML(r, [])}${r.text && r.seconds < 60 ? `<p class="small">You spoke for under a minute. In the real test, keep going until the examiner stops you (two minutes).</p>` : ""}</section><section class="sheet" id="sp-ai">${hasAI() ? "" : noAIHint()}</section>`;
        if (hasAI() && r.text) {
          const ov = await aiMark($("#sp-ai"), {
            crit: ["fluency", "lexical", "grammar"],
            system: "You are an experienced, fair IELTS Speaking examiner. You will get a speech-recognition transcript of a Part 2 answer (so punctuation, filler words and some words may be missing or wrong; pronunciation cannot be judged). Estimate bands from 1 to 9 in steps of 0.5 for Fluency and Coherence, Lexical Resource and Grammatical Range and Accuracy, each with a short comment in simple English. Consider the length: a strong answer lasts about two minutes. Then give the overall band (average of the three), a two-sentence summary, and up to 5 phrases from the answer rewritten more naturally, each with a short reason.",
            content: `Cue card: ${topic} (${points.join("; ")})\nSpeaking time: about ${Math.round(r.seconds)} seconds${r.wpm ? `, ${r.wpm} words per minute` : ""}.\n\nTranscript:\n${r.text}`
          });
          if (ov) { state.history.unshift({ type: "exam", date: new Date().toISOString(), name: "IELTS-style Speaking Part 2", result: `Band ${ov} (AI est.)` }); save(); }
        }
      };
    };
    $("#sp-now").onclick = speakStage;
    $("#sp-prep").onclick = () => {
      $("#sp-stage").innerHTML = `<div class="actions"><span class="exam-timer inline"><span>Preparation</span><b id="sp-time">1:00</b></span><button class="btn btn-line" id="sp-ready">I'm ready</button></div>
        <textarea class="w-text" rows="4" placeholder="Notes (only for you)"></textarea>`;
      $("#sp-ready").onclick = speakStage;
      startTimer($("#sp-time"), 60, speakStage);
    };
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */
  function dashboard() {
    if (state.level == null) {
      app.innerHTML = `<section class="page-head narrow"><p class="kicker">My progress</p><h1 class="display">Nothing here yet</h1><p class="lede">Take the placement test to find out where to start. It takes about 15 minutes.</p><div class="actions"><a class="btn btn-lg" href="#/test">Take the level test</a><a class="btn btn-lg btn-line" href="#/practice">Practise without a test</a></div></section>${backupSection()}`;
      bindBackup();
      return;
    }
    const L = lvl(state.level);
    const next = unitsOf(state.level).find((u) => !unitDone(u.id));
    const doneAll = UNITS.filter((u) => unitDone(u.id)).length;
    const p = state.placement;
    const pr = state.practice;

    app.innerHTML = `
    <section class="page-head">
      <p class="kicker">My progress</p>
      <h1 class="display">You're at <em>${L.code}</em>, ${L.name.toLowerCase()}.</h1>
    </section>
    ${ruler(state.level)}
    <section class="stats-line band">
      <div><span>Units complete</span><b>${doneAll}<small>/${UNITS.length}</small></b></div>
      <div><span>${L.code} progress</span><b>${levelProgress(state.level)}<small>%</small></b></div>
      <div><span>Practice answered</span><b>${pr.answered}</b></div>
      <div><span>Practice accuracy</span><b>${pr.answered ? Math.round((pr.correct / pr.answered) * 100) + "<small>%</small>" : "—"}</b></div>
      <div><span>Day streak</span><b>${dayStreak()}<small> day${dayStreak() === 1 ? "" : "s"}</small></b></div>
    </section>

    <section class="goal band">
      <div class="goal-text"><span class="kicker">Today's goal</span><b>${Math.min(today(), DAILY_GOAL)} of ${DAILY_GOAL} questions</b>${today() >= DAILY_GOAL ? `<span class="tag tag-ok">Done</span>` : ""}</div>
      <div class="goal-track"><b style="width:${Math.min(100, (today() / DAILY_GOAL) * 100)}%"></b></div>
      <div class="goal-week">${weekStrip()}</div>
    </section>

    <section class="next-up">
      <div>
        <p class="kicker">Up next</p>
        ${next
          ? `<h2>${esc(next.title)}</h2><p class="muted">${L.code} &middot; ${esc(next.grammar.title)}</p>`
          : `<h2>${state.level < 6 ? `${L.code} level test` : "C2 mastery check"}</h2><p class="muted">You've completed every unit at this level.</p>`}
      </div>
      <div class="actions"><a class="btn btn-lg" href="${next ? `#/unit/${next.id}` : `#/level/${state.level}/test`}">${next ? "Continue" : "Start test"}</a><a class="btn btn-lg btn-line" href="#/practice?l=${state.level}">Practise</a></div>
    </section>
    ${dueCount() ? `<section class="next-up next-up-quiet"><div><p class="kicker">Vocabulary review</p><h2>${dueCount()} word${dueCount() === 1 ? "" : "s"} due today</h2><p class="muted">Short daily reviews move words into long-term memory.</p></div><div class="actions"><a class="btn btn-lg btn-line" href="#/review">Review now</a></div></section>` : ""}

    <section class="cols band">
      <div>
        <h2 class="h-section">Placement skills</h2>
        ${p ? `${skillBars(skillRowsOf(p))}<p class="small"><a href="#/results">Full results and study plan &rarr;</a> &middot; <a href="#/certificate">Certificate &rarr;</a></p>` : `<p class="muted">Take the <a href="#/test">placement test</a> to see your skill profile.</p>`}
      </div>
      <div>
        <h2 class="h-section">Test history</h2>
        ${state.history.length ? `<table class="table"><thead><tr><th>Date</th><th>Test</th><th>Result</th></tr></thead><tbody>
          ${state.history.slice(0, 10).map((h) => `<tr><td>${fmtDate(h.date)}</td><td>${h.type === "placement" ? "Placement" : h.type === "talk" ? `Conversation: ${esc(h.scenario)}` : h.type === "exam" ? esc(h.name) : `${lvl(h.level).code} level test`}</td><td>${h.type === "placement" ? `${lvl(h.level).code} &middot; ${h.correct}/${h.total}` : h.type === "talk" ? `${esc(h.est)} (AI estimate)` : h.type === "exam" ? esc(h.result) : `${h.score}% ${h.passed ? "pass" : "fail"}`}</td></tr>`).join("")}
        </tbody></table>` : `<p class="muted">No tests yet.</p>`}
      </div>
    </section>

    ${backupSection()}

    <section class="danger">
      <a class="btn-text" href="#/settings">Voice &amp; audio settings</a> &middot;
      <button class="btn-text" id="reset">Reset all progress</button>
      <span id="reset-confirm" hidden>This deletes your level, scores and history. <button class="btn btn-sm btn-danger" id="reset-yes">Reset</button> <button class="btn btn-sm btn-line" id="reset-no">Cancel</button></span>
    </section>`;

    bindBackup();
    $("#reset").onclick = () => ($("#reset-confirm").hidden = false);
    $("#reset-no").onclick = () => ($("#reset-confirm").hidden = true);
    $("#reset-yes").onclick = () => { state = defaultState(); seen = new Set(); save(); location.hash = "#/"; };
  }

  /* =========================================================
     WRITING (per unit)
     ========================================================= */
  const STOP = new Set("the a an and or but to of in on at for with is are was were be been it this that i you he she we they my your his her our their me him them as by from not do does did have has had will would can could should so if then than there here what which who when where how very just also about into up out".split(" "));
  const wordsOf = (t) => (t.match(/[A-Za-z’']+/g) || []);

  function renderWriting(el, u) {
    const W = (window.LU_DATA.WRITING || {})[u.id];
    if (!W) { el.innerHTML = `<p class="muted">No writing task for this unit yet.</p>`; return; }
    const saved = state.writing[u.id] || { text: "", done: false };
    el.innerHTML = `
    <div class="cols cols-wide">
      <div>
        <p class="kicker">Writing task &middot; at least ${W.min} words</p>
        <h2 class="w-prompt">${esc(W.prompt)}</h2>
        <textarea id="w-text" class="w-text" rows="12" spellcheck="true" placeholder="Start writing here. Your draft is saved automatically.">${esc(saved.text)}</textarea>
        <div class="w-bar"><span id="w-count" class="mono"></span><button class="btn" id="w-check">Check my writing</button></div>
        <div id="w-out"></div>
      </div>
      <aside class="side">
        <h3 class="h-small">Try to use</h3>
        <ul class="list-num small"><li>${esc(u.grammar.title)}</li>${u.vocab.slice(0, 6).map((v) => `<li>${esc(v[0])}</li>`).join("")}</ul>
        <h3 class="h-small">How it's checked</h3>
        <p class="small muted">We check length, this unit's grammar and vocabulary, punctuation and repetition automatically. Then compare your text with the model answer. A teacher would also mark ideas and accuracy, so read the model answer closely.</p>
        ${saved.done ? `<p><span class="tag tag-ok">Task complete</span></p>` : ""}
      </aside>
    </div>`;
    const ta = $("#w-text", el);
    const count = () => { const n = wordsOf(ta.value).length; $("#w-count", el).textContent = `${n} / ${W.min} words`; $("#w-count", el).classList.toggle("t-ok", n >= W.min); };
    let timer = null;
    ta.oninput = () => { count(); clearTimeout(timer); timer = setTimeout(() => { state.writing[u.id] = Object.assign(state.writing[u.id] || {}, { text: ta.value }); save(); }, 400); };
    count();
    $("#w-check", el).onclick = () => {
      const text = ta.value.trim();
      const words = wordsOf(text);
      const low = text.toLowerCase().replace(/’/g, "'");
      const sentences = text.split(/(?<=[.!?])\s+/).filter((x) => x.trim());
      const usedVocab = u.vocab.filter((v) => { const key = v[0].toLowerCase().replace(/^(a|an|the) /, "").split(" ")[0].replace(/e$/, ""); return key.length > 2 && low.includes(key); }).map((v) => v[0]);
      const freq = {};
      words.forEach((w) => { const k = w.toLowerCase(); if (!STOP.has(k) && k.length > 3 && !/['’]/.test(k)) freq[k] = (freq[k] || 0) + 1; });
      const repeated = Object.keys(freq).filter((k) => freq[k] > Math.max(3, words.length / 25));
      const caps = sentences.filter((x) => /^[a-z]/.test(x.trim())).length;
      const endsOk = /[.!?]["”')]?$/.test(text);
      const grammarOk = new RegExp(W.check[0], "i").test(low);
      const avg = sentences.length ? Math.round(words.length / sentences.length) : 0;
      const checks = [
        [words.length >= W.min, `Length: ${words.length} words`, words.length >= W.min ? "Long enough." : `Write at least ${W.min - words.length} more words.`],
        [grammarOk, `Grammar: ${W.check[1]}`, grammarOk ? "Good, you used this unit's grammar." : `Try to include the unit's grammar: ${u.grammar.title}.`],
        [usedVocab.length >= 2, `Vocabulary: ${usedVocab.length} unit word${usedVocab.length === 1 ? "" : "s"}`, usedVocab.length ? `You used: ${usedVocab.join(", ")}.` : "Use at least two words from this unit's vocabulary."],
        [caps === 0 && endsOk, "Punctuation", caps === 0 && endsOk ? "Sentences start with capitals and end with punctuation." : `${caps ? `${caps} sentence${caps > 1 ? "s" : ""} start${caps > 1 ? "" : "s"} with a small letter. ` : ""}${endsOk ? "" : "End your last sentence with a full stop."}`],
        [repeated.length === 0, "Variety", repeated.length ? `You repeat ${repeated.map((r) => `“${r}”`).join(", ")} a lot. Try a synonym.` : "Good range of words."],
        [avg <= (u.level <= 2 ? 18 : 30), "Sentence length", `About ${avg} words per sentence.${avg > (u.level <= 2 ? 18 : 30) ? " Split some long sentences." : ""}`]
      ];
      const passed = checks.filter((c) => c[0]).length;
      const done = checks[0][0] && checks[1][0] && passed >= 5;
      state.writing[u.id] = { text: ta.value, done: done || !!saved.done, last: new Date().toISOString() };
      if (done) logActivity(5);
      save();
      $("#w-out", el).innerHTML = `
        <ul class="w-checks">${checks.map(([ok, label, note]) => `<li class="${ok ? "ok" : "bad"}"><b>${ok ? "✓" : "✗"} ${esc(label)}</b><span>${esc(note)}</span></li>`).join("")}</ul>
        <p class="${done ? "t-ok" : ""}"><b>${done ? "Task complete." : `${passed} of ${checks.length} checks passed.`}</b> ${done ? "" : "Revise your text and check again."}</p>
        <details class="model" ${done ? "open" : ""}><summary>Model answer</summary>
          ${hasTTS ? `<div class="audio"><button class="btn btn-sm btn-line" data-speak="${esc(W.model)}">${ICON_PLAY} Listen</button></div>` : ""}
          <p class="reading-text">${esc(W.model)}</p></details>`;
    };
  }

  /* =========================================================
     VOCABULARY REVIEW (spaced repetition, Leitner boxes)
     ========================================================= */
  function addUnitToDeck(u) {
    let n = 0;
    u.vocab.forEach(([w, d, ex]) => { if (!state.srs[w]) { state.srs[w] = { d, ex, u: u.id, b: 0, due: dayKey() }; n++; } });
    if (n) save();
    return n;
  }
  const dueCards = () => Object.keys(state.srs).filter((w) => state.srs[w].due <= dayKey());
  const dueCount = () => dueCards().length;

  function reviewPage() {
    const total = Object.keys(state.srs).length;
    const lvlN = state.level || 1;
    if (!total) {
      app.innerHTML = `
      <section class="page-head narrow"><p class="kicker">Review</p><h1 class="display">Your review deck is empty</h1>
      <p class="lede">Words are added when you open a unit's vocabulary. Then they come back for review on a schedule: tomorrow, in 2 days, 4, 8 and so on. Each review makes them stick for longer.</p>
      <div class="actions"><button class="btn btn-lg" id="seed">Add all ${lvl(lvlN).code} words</button><a class="btn btn-lg btn-line" href="#/level/${lvlN}">Go to ${lvl(lvlN).code} units</a></div></section>`;
      $("#seed").onclick = () => { unitsOf(lvlN).forEach(addUnitToDeck); reviewPage(); };
      return;
    }
    const queue = shuffle(dueCards()).slice(0, 20);
    const boxes = [0, 0, 0];
    Object.values(state.srs).forEach((c) => boxes[c.b >= 5 ? 2 : c.b >= 2 ? 1 : 0]++);
    let done = 0, known = 0;
    app.innerHTML = `
    <section class="page-head"><p class="kicker">Review</p><h1 class="display">Vocabulary review</h1>
      <p class="lede">See the word, say what it means, then check. Be honest: words you miss come back sooner.</p></section>
    <section class="stats-line">
      <div><span>This session</span><b id="r-left">${queue.length}</b></div>
      <div><span>Due today</span><b>${dueCount()}</b></div>
      <div><span>Learning</span><b>${boxes[0]}</b></div>
      <div><span>Familiar</span><b>${boxes[1]}</b></div>
      <div><span>Mastered</span><b>${boxes[2]}</b></div>
    </section>
    <section class="sheet sheet-wide" id="card"></section>
    <section class="danger"><span class="muted small">Add more words:</span> ${LEVELS.filter((L) => L.n <= Math.max(lvlN, 1) + 1).map((L) => `<button class="btn-text" data-add="${L.n}">${L.code}</button>`).join(" ")}</section>`;
    $$("[data-add]").forEach((b) => (b.onclick = () => { const n = unitsOf(+b.dataset.add).reduce((a, u) => a + addUnitToDeck(u), 0); b.textContent = `${lvl(+b.dataset.add).code} +${n}`; }));

    const card = $("#card");
    function nextCard() {
      $("#r-left").textContent = queue.length;
      if (!queue.length) {
        const next = Object.values(state.srs).map((c) => c.due).filter((d) => d > dayKey()).sort()[0];
        card.innerHTML = `<div class="r-done"><h2 class="qtext">${done ? `Done. You knew ${known} of ${done}.` : "Nothing due right now."}</h2>
          <p class="muted">${next ? `Next review: ${fmtDate(next + "T12:00:00")}.` : ""} Come back tomorrow to keep your streak going.</p>
          <div class="actions"><a class="btn" href="#/practice?l=${lvlN}">Practise questions</a><a class="btn btn-line" href="#/dashboard">My progress</a></div></div>`;
        document.onkeydown = null;
        return;
      }
      const w = queue[0];
      const c = state.srs[w];
      const unit = UNITS.find((x) => x.id === c.u);
      let revealed = false;
      card.innerHTML = `
        <div class="sheet-top"><span>${unit ? `${lvl(unit.level).code} &middot; ${esc(unit.title)}` : "Vocabulary"}</span><span class="muted">${done + 1} of ${done + queue.length}</span></div>
        <div class="r-word">${sayBtn(w)}<b>${esc(w)}</b></div>
        <p class="muted" id="r-hint">What does it mean? Say it aloud or in your head.</p>
        <div class="r-back" id="r-back" hidden><p class="r-def">${esc(c.d)}</p><p class="vocab-ex">${sayBtn(c.ex)}<i>${esc(c.ex)}</i></p></div>
        <div class="sheet-actions" id="r-act"><span></span><button class="btn" id="r-show">Show meaning</button></div>`;
      const answer = (ok) => {
        done++; if (ok) known++;
        c.b = ok ? Math.min(c.b + 1, SRS_DAYS.length - 1) : 0;
        c.due = ok ? addDays(SRS_DAYS[c.b]) : dayKey();
        queue.shift();
        if (!ok) queue.splice(Math.min(queue.length, 3), 0, w);
        logActivity(1);
        save();
        nextCard();
      };
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        $("#r-back").hidden = false; $("#r-hint").hidden = true;
        $("#r-act").innerHTML = `<button class="btn btn-line" id="r-no">Didn't know <span class="kbd">1</span></button><button class="btn" id="r-yes">Knew it <span class="kbd">2</span></button>`;
        $("#r-no").onclick = () => answer(false);
        $("#r-yes").onclick = () => answer(true);
      };
      $("#r-show").onclick = reveal;
      document.onkeydown = (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (!revealed && (e.key === " " || e.key === "Enter")) { e.preventDefault(); reveal(); }
        else if (revealed && e.key === "1") answer(false);
        else if (revealed && (e.key === "2" || e.key === "Enter")) answer(true);
      };
    }
    nextCard();
  }

  /* =========================================================
     SETTINGS (voice & speed)
     ========================================================= */
  function settingsPage() {
    const render = () => {
      const vs = englishVoices();
      if (!voice) pickVoice();
      app.innerHTML = `
      <section class="page-head narrow"><p class="kicker">Settings</p><h1 class="display">Voice &amp; audio</h1>
        <p class="lede">Listening questions use the voices built into your device. Some sound much more natural than others, so pick the one you like best.</p></section>
      ${!hasTTS ? `<p class="boxed">This browser doesn't support speech. Listening questions will show a transcript instead.</p>` : `
      <section class="settings">
        <label class="field"><span>Voice</span>
          <select id="s-voice">${vs.length ? vs.map((v) => `<option value="${esc(v.voiceURI)}" ${voice && v.voiceURI === voice.voiceURI ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})${voiceScore(v) >= 40 ? " ★" : ""}</option>`).join("") : `<option>Default voice</option>`}</select>
        </label>
        <div class="field"><span>Speed</span>
          <div class="seg" role="group" aria-label="Speed">${[[0.8, "Slow"], [0.9, "Relaxed"], [1, "Normal"], [1.15, "Fast"]].map(([r, l]) => `<button data-rate="${r}" class="${(state.settings.rate || 1) === r ? "on" : ""}">${l}</button>`).join("")}</div>
        </div>
        <div class="actions"><button class="btn" data-speak="Hello! This is how listening questions will sound. Is this voice clear for you?">${ICON_PLAY} Test voice</button><button class="btn btn-line" id="s-auto">Use recommended</button></div>
        <p class="muted small">★ marks higher-quality voices. ${/iPhone|iPad|Mac/.test(navigator.userAgent) ? "On Apple devices you can download better voices in Settings → Accessibility → Spoken Content → Voices (look for “Enhanced” or “Premium”)." : "On Windows, Microsoft Edge offers the most natural voices (“Online (Natural)”). On Android, install more voices from Google's text-to-speech settings."}</p>
      </section>`}`;
      app.insertAdjacentHTML("beforeend", `
      <section class="settings"><h2 class="h-section">Speech recognition</h2>
        <p class="muted small">Used when you press <b>Speak</b>. The browser option is fast but, in Chrome, sends your voice to Google. The on-device option downloads an open-source model (about ${SPEECH.MODEL_MB} MB, once) and works in every modern browser, including Safari and Firefox.</p>
        <div class="seg" role="group" aria-label="Speech recognition">${[["auto", "Automatic"], ["browser", "Browser"], ["device", "On this device"]].map(([k, l]) => `<button data-asr="${k}" class="${SPEECH.pref() === k ? "on" : ""}" ${(k === "browser" && !SPEECH.hasBrowserSR) || (k === "device" && !SPEECH.canRecord) ? "disabled" : ""}>${l}</button>`).join("")}</div>
        <p class="small" id="asr-now">Now using: <b>${{ browser: "the browser's speech service", device: "the on-device model", "": "nothing (this browser can't record audio)" }[SPEECH.mode()]}</b></p>
      </section>`);
      $$("[data-asr]", app).forEach((b) => (b.onclick = () => { SPEECH.setPref(b.dataset.asr); location.reload(); }));
      if (!hasTTS) return;
      const sel = $("#s-voice");
      if (sel) sel.onchange = () => { state.settings.voice = sel.value; save(); pickVoice(); };
      $$("[data-rate]", app).forEach((b) => (b.onclick = () => { state.settings.rate = +b.dataset.rate; save(); $$("[data-rate]", app).forEach((x) => x.classList.toggle("on", x === b)); }));
      $("#s-auto").onclick = () => { state.settings.voice = ""; state.settings.rate = 1; save(); pickVoice(); render(); };
    };
    render();
    if (hasTTS && !speechSynthesis.getVoices().length) setTimeout(() => { if (location.hash === "#/settings") render(); }, 700);
  }

  /* =========================================================
     CERTIFICATE
     ========================================================= */
  function certData() {
    const p = state.placement;
    return { n: state.name || "", l: p.level, b: p.band === "secure" ? 1 : 0, d: dayKey(new Date(p.date)), c: p.correct, t: p.total, s: SKILL_IDS.map((k) => (p.skills[k] == null ? -1 : Math.round(p.skills[k] * 10))) };
  }
  function certHTML(c, shared) {
    const L = lvl(c.l);
    const rows = SKILLS.map((s, i) => (c.s[i] < 0 ? null : { s, v: c.s[i] / 10 })).filter(Boolean).map((r) => ({ s: r.s, v: r.v, sl: lvl(Math.max(1, Math.min(6, Math.floor(r.v)))), pct: Math.max(3, Math.min(100, ((r.v - 1) / 5.99) * 100)) }));
    return `
    <article class="cert">
      <div class="cert-top"><span class="cert-brand">LevelUp English</span><span class="mono">Placement result</span></div>
      <p class="kicker">This is to record that</p>
      <h1 class="cert-name">${c.n ? esc(c.n) : "<span class='muted'>Your name</span>"}</h1>
      <p class="cert-line">was placed at CEFR level</p>
      <div class="cert-level"><span class="cert-code">${L.code}</span><span>${L.name}<small>${c.b ? "Secure" : "Developing"} &middot; ${c.c} of ${c.t} correct</small></span></div>
      ${ruler(c.l, { compact: true })}
      ${skillBars(rows)}
      <div class="cert-foot"><span>Date: ${fmtDate(c.d + "T12:00:00")}</span><span>Adaptive test, ${c.t} questions</span></div>
      <p class="cert-note">Unofficial result from a free online adaptive test. It is not an accredited exam certificate.${shared ? "" : ""}</p>
    </article>`;
  }
  function certificatePage() {
    if (!state.placement) { location.hash = "#/test"; return; }
    const render = () => {
      const link = `${location.origin}${location.pathname}#/cert/${b64enc(certData())}`;
      app.innerHTML = `
      <section class="page-head narrow no-print"><p class="kicker">Certificate</p><h1 class="display">Your level certificate</h1>
        <p class="lede">Add your name, then print it, save it as a PDF or share the link.</p></section>
      <section class="settings no-print">
        <label class="field"><span>Name on certificate</span><input id="c-name" type="text" maxlength="60" value="${esc(state.name)}" placeholder="Your full name" autocomplete="name"></label>
        <div class="actions"><button class="btn" id="c-print">Print or save as PDF</button><button class="btn btn-line" id="c-copy">Copy share link</button><span id="c-msg" class="muted small"></span></div>
      </section>
      <div id="c-body">${certHTML(certData())}</div>`;
      const inp = $("#c-name");
      inp.oninput = () => { state.name = inp.value.trim(); save(); $("#c-body").innerHTML = certHTML(certData()); };
      $("#c-print").onclick = () => window.print();
      $("#c-copy").onclick = () => copyText(`${location.origin}${location.pathname}#/cert/${b64enc(certData())}`, $("#c-msg"));
      return link;
    };
    render();
  }
  function certView(d) {
    let c;
    try { c = b64dec(d); if (!lvl(c.l) || !Array.isArray(c.s)) throw 0; } catch (e) { return notFound(); }
    app.innerHTML = `${certHTML(c, true)}
      <section class="band cta-line no-print"><p>What's your level? The test is free and takes about 15 minutes.</p><div class="actions"><a class="btn" href="#/test">Take the level test</a></div></section>`;
  }
  function copyText(text, msgEl) {
    const done = () => { if (msgEl) { msgEl.textContent = "Copied."; setTimeout(() => (msgEl.textContent = ""), 2500); } };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
    else fallback();
    function fallback() {
      const t = document.createElement("textarea");
      t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) { if (msgEl) msgEl.textContent = "Couldn't copy. Select and copy it manually."; }
      t.remove();
    }
  }

  /* =========================================================
     BACKUP & TRANSFER (no account needed)
     ========================================================= */
  function weekStrip() {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const n = state.days[dayKey(d)] || 0;
      out.push(`<span class="day${n >= DAILY_GOAL ? " full" : n ? " some" : ""}" title="${fmtDate(d.toISOString())}: ${n} questions"><i></i>${d.toLocaleDateString(undefined, { weekday: "narrow" })}</span>`);
    }
    return out.join("");
  }
  function backupSection() {
    return `
    <section class="band backup">
      <h2 class="h-section">Move or back up your progress</h2>
      <p class="muted">Your progress is stored in this browser only. To use another device, copy your transfer code here and paste it there, or download a backup file.</p>
      <div class="cols">
        <div>
          <h3 class="h-small">This device</h3>
          <div class="actions"><button class="btn btn-sm" id="b-copy">Copy transfer code</button><button class="btn btn-sm btn-line" id="b-file">Download backup file</button></div>
          <p id="b-msg" class="muted small"></p>
        </div>
        <div>
          <h3 class="h-small">Restore</h3>
          <textarea id="b-code" class="w-text" rows="3" placeholder="Paste a transfer code"></textarea>
          <div class="actions"><button class="btn btn-sm" id="b-restore">Restore from code</button><label class="btn btn-sm btn-line">Open backup file<input type="file" id="b-upload" accept="application/json,.json" hidden></label></div>
          <p id="b-msg2" class="small"></p>
        </div>
      </div>
    </section>`;
  }
  function exportState() { const s = Object.assign({}, state); delete s.seen; return { app: "levelup-english", v: 1, at: new Date().toISOString(), state: s }; }
  function importState(obj, msgEl) {
    const s = obj && obj.app === "levelup-english" && obj.state;
    if (!s || typeof s !== "object" || !("units" in s)) { msgEl.textContent = "That doesn't look like a LevelUp English backup."; msgEl.className = "small t-bad"; return; }
    try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, s, { seen: [] }))); } catch (e) { /* ignore */ }
    state = load();
    if (!localStorage.getItem(KEY)) state = Object.assign(defaultState(), s);
    seen = new Set();
    pickVoice();
    msgEl.textContent = "Progress restored."; msgEl.className = "small t-ok";
    setTimeout(() => router(), 900);
  }
  function bindBackup() {
    $("#b-copy").onclick = () => copyText(b64enc(exportState()), $("#b-msg"));
    $("#b-file").onclick = () => {
      const blob = new Blob([JSON.stringify(exportState(), null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `levelup-english-backup-${dayKey()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $("#b-restore").onclick = () => {
      const code = $("#b-code").value.trim();
      if (!code) return;
      try { importState(b64dec(code), $("#b-msg2")); } catch (e) { $("#b-msg2").textContent = "That code isn't valid. Copy the whole code and try again."; $("#b-msg2").className = "small t-bad"; }
    };
    $("#b-upload").onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { importState(JSON.parse(r.result), $("#b-msg2")); } catch (err) { $("#b-msg2").textContent = "Couldn't read that file."; $("#b-msg2").className = "small t-bad"; } };
      r.readAsText(f);
    };
  }


  /* =========================================================
     AI CONVERSATION PARTNER
     Three ways to run it: a free open model in the learner's browser (WebGPU),
     Claude with the learner's own key, or Claude through the site owner's proxy.
     ========================================================= */
  const CFG = window.LU_CONFIG || {};
  const AI_KEY_STORE = "levelup-ai-key"; // kept apart from progress so it never ends up in backups or transfer codes
  const PROVIDER_STORE = "levelup-ai-provider";
  const LOCAL_SIZE_STORE = "levelup-ai-local-size";
  const AI_MODEL = CFG.aiModel || "claude-opus-5-5";
  const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.6.0/+esm";
  const WEBLLM_URL = "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.87/+esm";
  const LOCAL_MODELS = {
    standard: { base: "Llama-3.2-3B-Instruct", label: "Standard", size: "about 1.8 GB", note: "better conversations; best on a computer" },
    lite: { base: "Llama-3.2-1B-Instruct", label: "Lite", size: "about 0.7 GB", note: "faster and lighter; for phones and older computers" }
  };
  const MAX_TURNS = 40;
  const lsGet = (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
  const lsSet = (k, v) => { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); return true; } catch (e) { return false; } };
  const getAIKey = () => lsGet(AI_KEY_STORE);
  function aiProvider() {
    if (CFG.aiProxy) return "proxy";
    const p = lsGet(PROVIDER_STORE);
    if (p === "claude" && getAIKey()) return "claude";
    if (p === "local") return "local";
    return "";
  }
  const hasAI = () => !!aiProvider();
  /* Default to the smaller model on phones and low-memory devices. */
  const smallDevice = () => (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const localSize = () => { const v = lsGet(LOCAL_SIZE_STORE); return v === "lite" || v === "standard" ? v : smallDevice() ? "lite" : "standard"; };
  const providerLabel = () => ({ proxy: "Claude", claude: "Claude (your API key)", local: `free on-device model (${LOCAL_MODELS[localSize()].label})` })[aiProvider()] || "not set up";

  /* ---- Claude (official Anthropic SDK) ---- */
  let AnthropicCls = null;
  let sdkPromise = null;
  function loadSDK() {
    if (!sdkPromise) sdkPromise = import(SDK_URL).then((m) => (AnthropicCls = m.default || m.Anthropic)).catch((e) => { sdkPromise = null; throw e; });
    return sdkPromise;
  }
  async function aiClient() {
    const Anthropic = await loadSDK();
    if (CFG.aiProxy) return new Anthropic({ apiKey: "via-proxy", baseURL: CFG.aiProxy.replace(/\/+$/, ""), dangerouslyAllowBrowser: true, maxRetries: 1 });
    return new Anthropic({ apiKey: getAIKey(), dangerouslyAllowBrowser: true, maxRetries: 1 });
  }

  /* ---- Free model in the browser (WebLLM + WebGPU) ---- */
  let gpuInfo = null;
  async function checkGPU() {
    if (gpuInfo) return gpuInfo;
    try {
      const a = navigator.gpu ? await navigator.gpu.requestAdapter() : null;
      gpuInfo = a ? { ok: true, f16: a.features.has("shader-f16") } : { ok: false };
    } catch (e) { gpuInfo = { ok: false }; }
    return gpuInfo;
  }
  let engineP = null, engineId = "", progressCb = null;
  async function localEngine() {
    const g = await checkGPU();
    if (!g.ok) { const e = new Error("nogpu"); e.code = "nogpu"; throw e; }
    const id = `${LOCAL_MODELS[localSize()].base}-${g.f16 ? "q4f16_1" : "q4f32_1"}-MLC`;
    if (engineP && engineId === id) return engineP;
    if (engineP) engineP.then((e) => e.unload()).catch(() => {});
    engineId = id;
    engineP = import(WEBLLM_URL)
      .then((m) => m.CreateMLCEngine(id, { initProgressCallback: (r) => progressCb && progressCb(r) }))
      .catch((e) => { engineP = null; throw e; });
    return engineP;
  }
  /* Small models are much better at one focused job, so on-device corrections are a separate step. */
  const CHECK_SYSTEM = `You are a careful English teacher. You will get one message written by an English learner. Find real mistakes in grammar, word forms, plurals, verb tenses and word choice.
Answer only with lines in this format, at most 3 lines:
- wrong words → corrected words — short reason
If the message has no real mistakes, answer only: - none
Only correct things that are actually wrong. Never change a correct sentence just to make it more formal or polite: "Hi", "I want a coffee" and "Yes please" are correct.
Check every verb: if the message talks about the past (yesterday, last week, ago), the verb must be in the past tense.
Ignore capital letters, missing full stops and obvious typing slips.`;
  const CHECK_SHOTS = [
    ["I goed to the park yesterday and I see many dog.", "- I goed → I went — 'go' is irregular: went\n- I see many dog → I saw many dogs — past tense, and plural after 'many'"],
    ["Can I have a cup of tea, please?", "- none"],
    ["Hi, I want a sandwich and a juice.", "- none"],
    ["Last week I buy two book.", "- I buy → I bought — past tense after 'last week'\n- two book → two books — plural after 'two'"],
    ["She don't like coffee but she like tea.", "- She don't like → She doesn't like — he/she/it takes 'doesn't'\n- she like tea → she likes tea — add -s for he/she/it"]
  ];
  async function localCorrections(text) {
    const engine = await localEngine();
    const messages = [{ role: "system", content: CHECK_SYSTEM }];
    CHECK_SHOTS.forEach(([u, a]) => { messages.push({ role: "user", content: u }); messages.push({ role: "assistant", content: a }); });
    messages.push({ role: "user", content: text });
    const r = await engine.chat.completions.create({ messages, max_tokens: 160, temperature: 0 });
    return (r.choices[0].message.content || "").trim();
  }
  /* Small models have short memories: keep the opening message and the most recent exchanges. */
  const trimForLocal = (msgs) => (msgs.length <= 13 ? msgs : [msgs[0]].concat(msgs.slice(-12)));

  /* One function for every provider. Streams text through onText and returns the full text. */
  async function aiGenerate({ system, messages, maxTokens, schema, onText, onProgress }) {
    if (aiProvider() === "local") {
      progressCb = onProgress || null;
      const engine = await localEngine();
      progressCb = null;
      const chunks = await engine.chat.completions.create({
        messages: [{ role: "system", content: system }].concat(trimForLocal(messages)),
        stream: true,
        max_tokens: schema ? 700 : 320,
        temperature: schema ? 0.2 : 0.7,
        frequency_penalty: schema ? 0.6 : 0.3,
        ...(schema ? { response_format: { type: "json_object", schema: JSON.stringify(schema) } } : {})
      });
      let full = "";
      for await (const c of chunks) {
        const d = c.choices && c.choices[0] && c.choices[0].delta && c.choices[0].delta.content;
        if (d) { full += d; if (onText) onText(full); }
      }
      return full;
    }
    const client = await aiClient();
    const stream = client.beta.messages.stream({
      model: AI_MODEL,
      max_tokens: maxTokens,
      system,
      messages,
      output_config: schema ? { effort: "low", format: { type: "json_schema", schema } } : { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default"
    });
    let full = "";
    for await (const ev of stream) {
      if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") { full += ev.delta.text; if (onText) onText(full); }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") { const e = new Error("refusal"); e.code = "refusal"; throw e; }
    return full;
  }

  function aiErrorText(err) {
    if (err && err.code === "refusal") return "The partner couldn't reply to that. Try saying it a different way.";
    if (aiProvider() === "local") {
      if (err && err.code === "nogpu") return "This browser can't run the free AI model. Use Chrome or Edge on a computer, or Chrome on a recent Android phone, or choose another option below.";
      const m = String((err && err.message) || err || "");
      if (/memory|OOM|allocate|device (was )?lost|DXGI/i.test(m)) return "Your device ran out of memory for the AI model. Switch to the Lite model and try again.";
      if (/fetch|network|Failed to|download|cache/i.test(m)) return "Downloading the AI model failed. Check your internet connection and try again.";
      return "The free AI model had a problem: " + m.slice(0, 160);
    }
    const A = AnthropicCls;
    if (A && err instanceof A.AuthenticationError) return CFG.aiProxy ? "The conversation service rejected the request. Please try again later." : "Your API key wasn't accepted. Check it and enter it again.";
    if (A && err instanceof A.PermissionDeniedError) return "This API key isn't allowed to use the model. Check your Anthropic account.";
    if (A && err instanceof A.RateLimitError) return "Too many messages in a short time. Wait a minute and try again.";
    if (A && err instanceof A.BadRequestError) return /credit|billing/i.test(err.message) ? "Your Anthropic account has no credit left. Add credit in the Anthropic Console." : "The request was rejected: " + err.message;
    if (A && err instanceof A.APIConnectionError) return "Couldn't reach the conversation service. Check your internet connection.";
    if (A && err instanceof A.APIError) return "The conversation service had a problem (" + (err.status || "error") + "). Try again in a moment.";
    return "Couldn't load the conversation service. Check your connection and try again.";
  }

  const SCENARIOS = [
    { id: "free", name: "Free conversation", lv: [1, 6], role: "a friendly conversation partner", brief: "A relaxed chat. Ask the learner about their life, interests and opinions, and share a little about yourself (you are an English speaker who loves travel, food and books)." },
    { id: "unit", name: "Your current unit", lv: [1, 6], role: "a friendly conversation partner", brief: "" },
    { id: "cafe", name: "Ordering at a café", lv: [1, 2], role: "a barista in a busy London café", brief: "The learner is a customer ordering drinks and food. Offer choices, sizes and prices in pounds, and take payment." },
    { id: "directions", name: "Asking for directions", lv: [1, 2], role: "a helpful local person in the street", brief: "The learner is a tourist who is lost and asks how to get to places in your town." },
    { id: "hotel", name: "Checking into a hotel", lv: [2, 3], role: "a hotel receptionist", brief: "The learner is checking in. There is a small problem with the booking that you solve together." },
    { id: "doctor", name: "At the doctor's", lv: [2, 3], role: "a family doctor (GP)", brief: "The learner is a patient who feels unwell. Ask about symptoms and give simple advice. Don't give real medical advice; keep it a role-play." },
    { id: "party", name: "Small talk at a party", lv: [2, 4], role: "a guest at a friend's birthday party", brief: "You have just met the learner. Make small talk: how you know the host, work, hobbies, plans." },
    { id: "flat", name: "Renting a flat", lv: [3, 4], role: "a landlord showing a flat", brief: "The learner wants to rent your flat. Answer and ask questions about rent, bills, the area and the contract." },
    { id: "complaint", name: "Making a complaint", lv: [3, 4], role: "a customer service agent for an online shop", brief: "The learner's order arrived late and damaged. Handle the complaint politely, and negotiate a solution." },
    { id: "interview", name: "Job interview", lv: [3, 5], role: "an interviewer for a role the learner chooses", brief: "Start by asking which job they are applying for, then run a realistic interview with follow-up questions." },
    { id: "salary", name: "Negotiating a pay rise", lv: [4, 6], role: "the learner's manager", brief: "The learner asks for a pay rise. Be friendly but cautious about budget; make them justify it, and look for a compromise." },
    { id: "debate", name: "Debate: remote work", lv: [4, 6], role: "a debate partner", brief: "Debate whether companies should go back to full-time office work. Take the opposite view to the learner, argue politely and ask them to support their points." },
    { id: "news", name: "Discussing the news", lv: [5, 6], role: "a well-read friend", brief: "Discuss a current-affairs theme the learner chooses (technology, climate, cities, education). Push for nuance and ask for examples." }
  ];
  const LEVEL_GUIDE = {
    1: "use only very simple, common words and the present tense; sentences of about 5–8 words; speak slowly and clearly",
    2: "use simple everyday vocabulary; present, past and 'going to' forms; short sentences",
    3: "use clear everyday English; you can use common phrasal verbs, but avoid rare idioms",
    4: "use natural English with some common idioms and a range of tenses",
    5: "use natural, idiomatic English with varied structures and some advanced vocabulary",
    6: "use fully natural, nuanced, idiomatic English, as you would with an educated native speaker"
  };
  const REPLY_LEN = (n) => (n <= 2 ? "1–2 short sentences" : n <= 4 ? "2–3 sentences" : "2–4 sentences");

  function systemPrompt(level, sc, unit, withFeedback = true) {
    const L = lvl(level);
    const brief = sc.id === "unit" && unit
      ? `Chat about the topic "${unit.topic}" (unit: "${unit.title}"). Create chances for the learner to use ${unit.grammar.title} and some of these words: ${unit.vocab.map((v) => v[0]).join(", ")}. Don't announce this; just steer the conversation naturally.`
      : sc.brief;
    return `You are an English conversation partner on LevelUp English, a website where people practise English. The learner's level is ${L.code} (${L.name}) on the CEFR scale.

Scenario: ${brief}
Your role: ${sc.role}.

How to talk:
- Write only in English and pitch it to the learner's level: ${LEVEL_GUIDE[level]}.
- Keep every reply short, ${REPLY_LEN(level)}, and usually end with a question or prompt that keeps the conversation going.
- Stay in your role during role-plays. Be warm, natural and curious. Don't lecture or explain grammar in the reply itself.
- If the learner writes in another language, seems stuck or asks for help, help briefly in simple English and give them a phrase they could use.
- This is English practice only. If asked to do unrelated work (write code, homework, long essays), say kindly that you're here for conversation practice and carry on the chat.
- Keep the conversation suitable for all ages.${withFeedback ? `

After your reply, write a line containing exactly ###, then feedback on the learner's most recent message only:
- One line per real mistake (grammar, wrong word, clearly unnatural phrasing) in the form: - original → corrected — short reason
- At most 3 lines, most important first.
- If there are no mistakes, write: - none
- You may add one line starting with "- tip:" to suggest a more natural way to say something.
- Ignore capital letters, missing full stops and typos that are obviously just typing slips.
For your very first message, when the learner hasn't written anything yet, the feedback is: - none` : "\n- Reply with your message only, with no notes, labels or corrections."}`;
  }

  /* Split a streamed reply into the conversational part and the feedback part. */
  function splitReply(text) {
    const i = text.indexOf("###");
    if (i < 0) return { reply: text.replace(/#{1,2}\s*$/, ""), fb: null };
    return { reply: text.slice(0, i).trim(), fb: text.slice(i + 3).trim() };
  }
  function parseFeedback(fb) {
    if (!fb) return { fixes: [], tip: "" };
    const fixes = []; let tip = "";
    fb.split("\n").map((l) => l.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean).forEach((l) => {
      if (/^none\.?$/i.test(l)) return;
      if (/^tip:/i.test(l)) { tip = l.replace(/^tip:\s*/i, ""); return; }
      const m = l.match(/^(.*?)\s*(?:→|->)\s*(.*?)(?:\s+[—–-]{1,2}\s+(.*))?$/);
      if (m) fixes.push({ from: m[1].replace(/^["“']|["”']$/g, ""), to: m[2].replace(/^["“']|["”']$/g, ""), why: m[3] || "" });
    });
    const same = (a, b) => norm(a) === norm(b);
    const kept = fixes.filter((f) => f.from && f.to && !same(f.from, f.to) && !/^(hi|hello|hey)\b/i.test(f.from.trim()));
    return { fixes: kept.slice(0, 3), tip };
  }

  let TALK = null; // current conversation

  function talkPage(params) {
    if (!hasAI()) return talkSetup();
    if (TALK && TALK.messages.length && params.get("new") !== "1") return talkChat();
    const level = Math.min(6, Math.max(1, +params.get("l") || state.level || 2));
    const unit = unitsOf(level).find((u) => !unitDone(u.id)) || unitsOf(level)[0];
    const fits = (s) => level >= s.lv[0] && level <= s.lv[1];
    app.innerHTML = `
    <section class="page-head"><p class="kicker">Conversation practice &middot; AI partner</p>
      <h1 class="display">Talk it through</h1>
      <p class="lede">Have a real conversation in English with an AI partner. Type or speak, and you'll get quick corrections after every message and written feedback at the end.</p></section>
    <section class="controls">
      <div class="seg" role="group" aria-label="Level">${LEVELS.map((x) => `<button data-l="${x.n}" class="${x.n === level ? "on" : ""}">${x.code}</button>`).join("")}</div>
      <label class="check"><input type="checkbox" id="t-voice" ${state.settings.talkVoice !== false && hasTTS ? "checked" : ""} ${hasTTS ? "" : "disabled"}> Read replies aloud</label>
    </section>
    <section>
      <h2 class="h-section">Choose a situation</h2>
      <div class="table-list">
        ${SCENARIOS.filter(fits).map((s) => scenarioRow(s, level, unit)).join("")}
      </div>
      <details class="more-sc"><summary>Situations for other levels</summary><div class="table-list">${SCENARIOS.filter((s) => !fits(s)).map((s) => scenarioRow(s, level, unit)).join("")}</div></details>
    </section>
    <section class="danger"><span class="muted small">AI: ${esc(providerLabel())}</span>${CFG.aiProxy ? "" : ` &middot; <button class="btn-text" id="t-change">Change</button>`}${!CFG.aiProxy && getAIKey() ? ` &middot; <button class="btn-text" id="t-forget">Remove my API key</button>` : ""}</section>`;
    $$(".seg [data-l]").forEach((b) => (b.onclick = () => { location.hash = `#/talk?new=1&l=${b.dataset.l}`; }));
    $("#t-voice").onchange = (e) => { state.settings.talkVoice = e.target.checked; save(); };
    if ($("#t-change")) $("#t-change").onclick = () => { TALK = null; talkSetup(); };
    if ($("#t-forget")) $("#t-forget").onclick = () => { lsSet(AI_KEY_STORE, ""); if (lsGet(PROVIDER_STORE) === "claude") lsSet(PROVIDER_STORE, ""); TALK = null; talkPage(new URLSearchParams("new=1")); };
    $$("[data-sc]").forEach((b) => (b.onclick = () => {
      const sc = SCENARIOS.find((s) => s.id === b.dataset.sc);
      TALK = { level, sc, unit: sc.id === "unit" ? unit : null, messages: [], turns: [], busy: false, ended: false };
      talkChat();
      talkSend(null);
    }));
  }
  function scenarioRow(s, level, unit) {
    const sub = s.id === "unit" ? `${lvl(level).code} &middot; ${esc(unit.title)}: ${esc(unit.grammar.title)}` : `${lvl(s.lv[0]).code}${s.lv[1] !== s.lv[0] ? "–" + lvl(s.lv[1]).code : ""} &middot; you talk to ${esc(s.role.replace(/^(a|an|the) /, "a "))}`;
    return `<button class="row-link sc-row" data-sc="${s.id}"><span class="row-title">${esc(s.name)}<span class="row-sub">${sub}</span></span><span class="row-meta">Start &rarr;</span></button>`;
  }

  function talkSetup() {
    const size = localSize();
    app.innerHTML = `
    <section class="page-head narrow"><p class="kicker">Conversation practice &middot; AI partner</p>
      <h1 class="display">Talk it through</h1>
      <p class="lede">Practise real conversations with an AI partner. You get corrections after every message and feedback at the end. Choose how to run it:</p></section>
    <section class="ai-options">
      <div class="ai-opt">
        <p class="kicker">Free &middot; no account &middot; private</p>
        <h3>Free AI on your device</h3>
        <p>An open-source AI model is downloaded once and then runs inside your browser. It's free, needs no key, and your messages never leave your device.</p>
        <ul class="list-check small"><li>Needs Chrome or Edge on a computer, or Chrome on a recent Android phone</li><li>First start downloads the model; after that it loads from your browser's storage</li><li>Simpler than Claude: corrections are helpful but sometimes miss mistakes</li></ul>
        <div class="field"><span>Model size</span>
          <div class="seg" role="group" aria-label="Model size">${Object.keys(LOCAL_MODELS).map((k) => `<button data-size="${k}" class="${k === size ? "on" : ""}">${LOCAL_MODELS[k].label} &middot; ${LOCAL_MODELS[k].size}</button>`).join("")}</div>
          <p class="small muted" id="t-size-note">${esc(LOCAL_MODELS[size].note)}</p>
        </div>
        <div class="actions"><button class="btn" id="t-local">Use the free AI</button></div>
        <p class="small" id="t-gpu"></p>
      </div>
      <div class="ai-opt">
        <p class="kicker">Best quality &middot; your Anthropic account</p>
        <h3>Claude, with your own API key</h3>
        <p>Claude gives the most natural conversations and the most accurate corrections. You need an API key from <b>console.anthropic.com</b>, and usage is billed to your account: roughly $0.10–0.40 for a 20-message chat.</p>
        <ul class="list-check small"><li>The key is stored only in this browser and sent only to Anthropic</li><li>It isn't included in backups or transfer codes</li><li>Don't save it on a shared computer</li></ul>
        <label class="field"><span>Anthropic API key</span><input id="t-key" type="password" autocomplete="off" spellcheck="false" placeholder="${getAIKey() ? "Saved. Paste a new key to replace it" : "sk-ant-…"}"></label>
        <div class="actions"><button class="btn btn-line" id="t-save">${getAIKey() ? "Use Claude" : "Save key and use Claude"}</button><span id="t-msg" class="small t-bad"></span></div>
      </div>
    </section>`;
    $$("[data-size]").forEach((b) => (b.onclick = () => { lsSet(LOCAL_SIZE_STORE, b.dataset.size); $$("[data-size]").forEach((x) => x.classList.toggle("on", x === b)); $("#t-size-note").textContent = LOCAL_MODELS[b.dataset.size].note; }));
    checkGPU().then((g) => {
      const el = $("#t-gpu");
      if (!el) return;
      if (g.ok) { el.className = "small t-ok"; el.textContent = "Your browser can run the free AI."; }
      else { el.className = "small t-bad"; el.textContent = "This browser can't run the free AI (it needs WebGPU). Try Chrome or Edge on a computer, or use Claude."; $("#t-local").disabled = true; }
    });
    $("#t-local").onclick = () => { lsSet(PROVIDER_STORE, "local"); history.replaceState(null, "", "#/talk?new=1"); router(); };
    $("#t-save").onclick = () => {
      const k = $("#t-key").value.trim();
      if (!k && getAIKey()) { lsSet(PROVIDER_STORE, "claude"); history.replaceState(null, "", "#/talk?new=1"); router(); return; }
      if (!/^sk-ant-/.test(k) || k.length < 30) { $("#t-msg").textContent = "That doesn't look like an Anthropic API key (it starts with sk-ant-)."; return; }
      if (!lsSet(AI_KEY_STORE, k)) { $("#t-msg").textContent = "This browser won't let the site save the key."; return; }
      lsSet(PROVIDER_STORE, "claude");
      history.replaceState(null, "", "#/talk?new=1"); router();
    };
  }

  function talkChat() {
    const T2 = TALK;
    const L = lvl(T2.level);
    app.innerHTML = `
    <nav class="crumbs"><a href="#/talk?new=1">Conversation practice</a> / ${esc(T2.sc.name)}</nav>
    <section class="talk-head"><div><p class="kicker">${L.code} &middot; ${esc(T2.sc.role)}</p><h1 class="display display-sm">${esc(T2.sc.name)}</h1></div>
      <div class="actions"><button class="btn btn-line btn-sm" id="t-end">Finish and get feedback</button></div></section>
    <section class="chat" id="chat" aria-live="polite"></section>
    <form class="composer" id="composer">
      <textarea id="t-in" rows="2" placeholder="Write your reply…" maxlength="1200"></textarea>
      <div class="composer-actions">
        ${canSpeak ? `<button type="button" class="btn btn-line btn-sm" id="t-mic">${ICON_MIC} Speak</button>` : ""}
        <span class="mono" id="t-count"></span>
        <span class="small" id="t-mic-status"></span>
        <button class="btn" id="t-send" type="submit">Send</button>
      </div>
    </form>
    <p class="muted small talk-note">AI replies can contain mistakes. Corrections are suggestions, not a teacher's marking.</p>`;
    renderTurns();
    const inp = $("#t-in");
    $("#composer").onsubmit = (e) => { e.preventDefault(); const v = inp.value.trim(); if (v && !TALK.busy) { inp.value = ""; talkSend(v); } };
    inp.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#composer").requestSubmit ? $("#composer").requestSubmit() : $("#t-send").click(); } };
    $("#t-end").onclick = () => talkFinish();
    if ($("#t-mic")) $("#t-mic").onclick = () => dictate(inp, $("#t-mic"));
    updateComposer();
  }
  function updateComposer() {
    if (!$("#t-send")) return;
    const learnerTurns = TALK.turns.filter((t) => t.who === "me").length;
    $("#t-send").disabled = TALK.busy || learnerTurns >= MAX_TURNS;
    $("#t-count").textContent = learnerTurns ? `${learnerTurns}/${MAX_TURNS}` : "";
    $("#t-end").disabled = TALK.busy || learnerTurns < 2;
    if (learnerTurns >= MAX_TURNS) $("#t-in").placeholder = "That's the end of this conversation. Get your feedback.";
  }
  async function dictate(inp, btn) {
    const st = $("#t-mic-status");
    const r = await micRun(btn, st, { maxMs: 30000, silenceMs: 2500 });
    if (r && r.text) { inp.value = (inp.value ? inp.value + " " : "") + r.text; inp.focus(); }
    else if (r) alertLine("Didn't catch that. Try again.");
  }
  function alertLine(msg) { const c = $("#chat"); if (c) c.insertAdjacentHTML("beforeend", `<div class="chat-error">${esc(msg)}</div>`); }

  function turnHTML(t, i) {
    if (t.who === "me") {
      const f = t.fb;
      return `<div class="msg msg-me"><div class="bubble">${esc(t.text)}</div>
        ${f ? (f.fixes.length || f.tip
          ? `<div class="fix">${f.fixes.map((x) => `<div><s>${esc(x.from)}</s> <span aria-hidden="true">→</span> <b>${esc(x.to)}</b>${x.why ? `<span class="muted"> · ${esc(x.why)}</span>` : ""}</div>`).join("")}${f.tip ? `<div class="muted">Tip: ${esc(f.tip)}</div>` : ""}</div>`
          : `<div class="fix fix-ok">No mistakes.</div>`) : ""}</div>`;
    }
    return `<div class="msg msg-ai"><span class="who">${esc(TALK.sc.id === "free" || TALK.sc.id === "unit" ? "Partner" : TALK.sc.role.replace(/^(a|an|the) /, ""))}</span>
      <div class="bubble">${t.text ? esc(t.text) : `<span class="typing"><i></i><i></i><i></i></span>`}</div>
      ${t.text && hasTTS ? `<button class="say" data-speak="${esc(t.text)}" aria-label="Listen">${ICON_SPEAKER}</button>` : ""}</div>`;
  }
  function renderTurns() {
    const c = $("#chat");
    if (!c) return;
    c.innerHTML = TALK.turns.map(turnHTML).join("") || "";
    c.lastElementChild && c.lastElementChild.scrollIntoView({ block: "nearest" });
  }

  async function talkSend(text) {
    const T2 = TALK;
    if (!T2 || T2.busy) return;
    T2.busy = true;
    if (text) {
      T2.messages.push({ role: "user", content: text });
      T2.turns.push({ who: "me", text, fb: null });
      logActivity(1);
    } else {
      T2.messages.push({ role: "user", content: "[The learner has just opened the chat. Greet them and start the conversation with your first question.]" });
    }
    const me = text ? T2.turns[T2.turns.length - 1] : null;
    const ai = { who: "ai", text: "" };
    T2.turns.push(ai);
    renderTurns(); updateComposer();
    const bubble = () => $("#chat .msg-ai:last-child .bubble");
    try {
      const local = aiProvider() === "local";
      const full = await aiGenerate({
        system: systemPrompt(T2.level, T2.sc, T2.unit, !local),
        messages: T2.messages,
        maxTokens: 4000,
        onProgress: (r) => {
          if (TALK !== T2 || !bubble()) return;
          const pct = Math.round((r.progress || 0) * 100);
          const loading = /cache|Loading model from cache/i.test(r.text || "");
          bubble().innerHTML = `<div class="dl"><b>${loading ? "Loading the free AI model…" : `Downloading the free AI model: ${pct}%`}</b><span class="dl-bar"><i style="width:${pct}%"></i></span><span class="muted small">${loading ? "Almost ready." : `First time only, ${esc(LOCAL_MODELS[localSize()].size)}. Keep this page open.`}</span></div>`;
        },
        onText: (t) => {
          if (TALK !== T2) return;
          const shown = splitReply(t).reply.replace(/^\s*["“]/, "");
          if (bubble() && shown) bubble().textContent = shown;
        }
      });
      if (TALK !== T2) return;
      const { reply, fb } = splitReply(full);
      ai.text = reply.replace(/^\s*(partner|assistant|ai)\s*:\s*/i, "").trim().replace(/^["“](.*)["”]$/s, "$1") || "Sorry, could you say that again?";
      T2.messages.push({ role: "assistant", content: local ? ai.text : full });
      if (me && !local) me.fb = parseFeedback(fb);
      if (me && local) {
        renderTurns();
        const box = $("#chat .msg-me:nth-last-child(2)");
        if (box) box.insertAdjacentHTML("beforeend", `<div class="fix muted">Checking your message…</div>`);
        try { me.fb = parseFeedback(await localCorrections(text)); } catch (e) { me.fb = null; }
        if (TALK !== T2) return;
      }
      T2.busy = false;
      renderTurns(); updateComposer();
      save();
      if (state.settings.talkVoice !== false && hasTTS) speak(ai.text, 1);
      const inp = $("#t-in"); if (inp && window.matchMedia("(pointer: fine)").matches) inp.focus();
    } catch (err) {
      if (TALK !== T2) return;
      T2.turns.pop();
      T2.messages.pop();
      if (me) { T2.turns.pop(); const inp = $("#t-in"); if (inp && !inp.value) inp.value = text; }
      T2.busy = false;
      renderTurns(); updateComposer();
      alertLine(aiErrorText(err));
      if (!CFG.aiProxy) $("#chat").insertAdjacentHTML("beforeend", `<p class="small"><a href="#/talk?new=1" id="t-switch">Change how the AI runs</a></p>`);
      if ($("#t-switch")) $("#t-switch").onclick = (e) => { e.preventDefault(); TALK = null; talkSetup(); };
      if (!text && !T2.turns.length) {
        $("#chat").insertAdjacentHTML("beforeend", `<div class="actions"><button class="btn btn-sm" id="t-retry">Try again</button></div>`);
        $("#t-retry").onclick = () => { $("#chat").innerHTML = ""; talkSend(null); };
      }
    }
  }

  const FEEDBACK_SCHEMA = {
    type: "object",
    additionalProperties: false,
    required: ["level", "summary", "strengths", "work_on", "phrases"],
    properties: {
      level: { type: "string", enum: ["A1", "A2", "B1", "B2", "C1", "C2"] },
      summary: { type: "string" },
      strengths: { type: "array", items: { type: "string" } },
      work_on: { type: "array", items: { type: "object", additionalProperties: false, required: ["point", "example"], properties: { point: { type: "string" }, example: { type: "string" } } } },
      phrases: { type: "array", items: { type: "string" } }
    }
  };
  /* Small local models don't support schemas, so accept anything close and fall back to plain text. */
  function parseLooseJSON(txt) {
    txt = String(txt || "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    const i = txt.indexOf("{");
    if (i < 0) return null;
    const closeJSON = (t) => {
      const stack = []; let inStr = false, escp = false;
      for (const ch of t) {
        if (inStr) { if (escp) escp = false; else if (ch === "\\") escp = true; else if (ch === '"') inStr = false; continue; }
        if (ch === '"') inStr = true; else if (ch === "{" || ch === "[") stack.push(ch); else if (ch === "}" || ch === "]") stack.pop();
      }
      let r = t + (inStr ? '"' : "");
      r = r.replace(/,\s*$/, "").replace(/:\s*$/, ': ""');
      while (stack.length) r += stack.pop() === "{" ? "}" : "]";
      return r;
    };
    const parse = (t) => { try { return JSON.parse(t); } catch (e) { return null; } };
    try {
      const body = txt.slice(i);
      return parse(body.slice(0, body.lastIndexOf("}") + 1)) || parse(closeJSON(body)) || JSON.parse(closeJSON(body.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"{}\[\]]*$/, "")));
    } catch (e) { return null; }
  }
  function readFeedback(txt) {
    const o = parseLooseJSON(txt);
    if (!o) return null;
    try {
      const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []).map((v) => (typeof v === "string" ? v : v && typeof v === "object" ? v : String(v)));
      const lv = String(o.level || "").toUpperCase().match(/[ABC][12]/);
      /* small models can loop and repeat themselves: drop duplicates and keep the lists short */
      const uniq = (list, key, n) => { const seen = new Set(); return list.filter((x) => { const k = norm(key(x)); if (!k || seen.has(k)) return false; seen.add(k); return true; }).slice(0, n); };
      return {
        level: lv ? lv[0] : "",
        summary: String(o.summary || "").slice(0, 400),
        strengths: uniq(arr(o.strengths).map(String), (x) => x, 3),
        work_on: uniq(arr(o.work_on).map((w) => (typeof w === "string" ? { point: w, example: "" } : { point: String(w.point || ""), example: String(w.example || "") })), (w) => w.point, 3),
        phrases: uniq(arr(o.phrases).map(String), (x) => x, 5)
      };
    } catch (e) { return null; }
  }

  async function talkFinish() {
    const T2 = TALK;
    if (!T2 || T2.busy) return;
    T2.busy = true; updateComposer();
    $("#t-end").textContent = "Writing your feedback…";
    const local = aiProvider() === "local";
    try {
      const ask = `[The learner has finished the conversation. Now act as their English teacher and assess the learner's messages in this conversation (not your own). Write in simple English suited to ${lvl(T2.level).code}, addressed to the learner as "you". Keep every item short (one sentence). Give: your estimate of the CEFR level their messages show; a two-sentence summary; 2–3 specific strengths; the 3 most useful things to work on, each with a corrected example taken from what they wrote; and 3–5 useful phrases for this situation.]` +
        (local ? `\nReply with only JSON, no other text, in exactly this shape: {"level": "B1", "summary": "...", "strengths": ["..."], "work_on": [{"point": "...", "example": "..."}], "phrases": ["..."]}` : "");
      const txt = await aiGenerate({ system: systemPrompt(T2.level, T2.sc, T2.unit), messages: T2.messages.concat([{ role: "user", content: ask }]), maxTokens: 8000, schema: FEEDBACK_SCHEMA });
      if (TALK !== T2) return;
      const fb = readFeedback(txt);
      if (!fb && !local) throw new SyntaxError("bad json");
      T2.busy = false; T2.ended = true;
      state.history.unshift({ type: "talk", date: new Date().toISOString(), level: T2.level, scenario: T2.sc.name, est: (fb && fb.level) || "—", turns: T2.turns.filter((t) => t.who === "me").length });
      logActivity(5);
      save();
      renderTalkFeedback(T2, fb, txt);
    } catch (err) {
      T2.busy = false;
      if (TALK !== T2) return;
      updateComposer();
      $("#t-end").textContent = "Finish and get feedback";
      alertLine(err instanceof SyntaxError ? "The feedback came back in an unexpected format. Try again." : aiErrorText(err));
    }
  }

  function renderTalkFeedback(T2, fb, raw) {
    const L = lvl(T2.level);
    if (!fb || !fb.level) {
      const corr = T2.turns.filter((t) => t.who === "me" && t.fb && t.fb.fixes.length);
      app.innerHTML = `
      <nav class="crumbs"><a href="#/talk?new=1">Conversation practice</a> / Feedback</nav>
      <section class="page-head"><p class="kicker">${esc(T2.sc.name)} &middot; practised at ${L.code}</p><h1 class="display">Your feedback</h1></section>
      <section class="cols band"><div><h2 class="h-section">From your AI partner</h2><p class="reading-text" style="white-space:pre-wrap">${esc(String(raw || "").trim())}</p></div>
      <div><h2 class="h-section">Corrections from this chat</h2>${corr.length ? `<div class="fix-list">${corr.map((t) => t.fb.fixes.map((x) => `<div><s>${esc(x.from)}</s> → <b>${esc(x.to)}</b>${x.why ? `<span class="muted"> · ${esc(x.why)}</span>` : ""}</div>`).join("")).join("")}</div>` : `<p class="muted">No corrections.</p>`}</div></section>
      <section class="band cta-line"><p>Keep the momentum going.</p><div class="actions"><a class="btn" href="#/talk?new=1&l=${T2.level}">New conversation</a><a class="btn btn-line" href="#/practice?l=${state.level || T2.level}">Practise questions</a></div></section>`;
      TALK = null;
      return;
    }
    const estN = LEVELS.find((x) => x.code === fb.level);
    const corrections = T2.turns.filter((t) => t.who === "me" && t.fb && t.fb.fixes.length);
    app.innerHTML = `
    <nav class="crumbs"><a href="#/talk?new=1">Conversation practice</a> / Feedback</nav>
    <section class="result-head"><div>
      <p class="kicker">${esc(T2.sc.name)} &middot; practised at ${L.code}</p>
      <h1 class="display">Your messages read like <em>${esc(fb.level)}</em>.</h1>
      <p class="lede">${esc(fb.summary)}</p>
      <p class="result-meta">AI estimate from one conversation. Your placement test gives a more reliable level.</p>
    </div><div class="result-code" aria-hidden="true">${esc(fb.level)}</div></section>
    ${estN ? ruler(estN.n, { compact: true }) : ""}
    <section class="cols band">
      <div><h2 class="h-section">What went well</h2><ul class="list-check">${fb.strengths.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <div><h2 class="h-section">Work on</h2><ol class="list-num">${fb.work_on.map((w) => `<li><b>${esc(w.point)}</b>${w.example ? `<br><span class="muted">${esc(w.example)}</span>` : ""}</li>`).join("")}</ol></div>
    </section>
    <section class="cols band">
      <div><h2 class="h-section">Useful phrases</h2><ul class="examples">${fb.phrases.map((p) => `<li>${sayBtn(p)}<span>${esc(p)}</span></li>`).join("")}</ul></div>
      <div><h2 class="h-section">Corrections from this chat</h2>${corrections.length ? `<div class="fix-list">${corrections.map((t) => t.fb.fixes.map((x) => `<div><s>${esc(x.from)}</s> → <b>${esc(x.to)}</b>${x.why ? `<span class="muted"> · ${esc(x.why)}</span>` : ""}</div>`).join("")).join("")}</div>` : `<p class="muted">No corrections. Nice work.</p>`}</div>
    </section>
    <section class="band cta-line"><p>Keep the momentum going.</p>
      <div class="actions"><a class="btn" href="#/talk?new=1&l=${T2.level}">New conversation</a><a class="btn btn-line" href="#/practice?l=${state.level || T2.level}">Practise questions</a></div></section>`;
    TALK = null;
  }

  /* ---------- boot ---------- */
  $(".nav-toggle").onclick = () => $(".nav").classList.toggle("open");
  window.addEventListener("hashchange", router);
  router();
})();
