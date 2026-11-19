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
  function speak(text, rate, box) {
    if (!hasTTS) return;
    if (!voice) pickVoice();
    const go = () => {
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = voice ? voice.lang : "en-GB";
      u.rate = Math.min(2, Math.max(0.4, (rate || 0.95) * (state.settings.rate || 1)));
      let started = false;
      u.onstart = () => { started = true; };
      u.onend = () => { if (current === u) current = null; };
      u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled") showTranscript(box); };
      current = u; // keep a reference so Safari doesn't drop it mid-sentence
      speechSynthesis.speak(u);
      if (speechSynthesis.paused) speechSynthesis.resume();
      setTimeout(() => { if (!started && current === u) showTranscript(box); }, 3000);
    };
    if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(go, 80); } else go();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-speak]");
    if (b) { e.preventDefault(); unlocked = true; speak(b.getAttribute("data-speak"), parseFloat(b.getAttribute("data-rate")) || 0.95, b.closest(".audio")); }
    else unlockSpeech();
  }, true);
  document.addEventListener("touchend", () => unlockSpeech(), { passive: true });
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sayBtn = (text, label) => `<button class="say" data-speak="${esc(text)}" aria-label="Listen">${ICON_SPEAKER}${label ? `<span>${label}</span>` : ""}</button>`;

  function audioBox(text) {
    if (!hasTTS) return `<div class="audio"><span class="muted">Audio isn't supported in this browser. Transcript: “${esc(text)}”</span></div>`;
    return `<div class="audio">
      <button class="btn btn-sm" data-speak="${esc(text)}">${ICON_PLAY} Play recording</button>
      <button class="btn btn-sm btn-line" data-speak="${esc(text)}" data-rate="0.7">Slower</button>
      <span class="audio-note">Replay as often as you need.</span>
      <p class="audio-fallback" hidden>No sound? Check your volume, and on iPhone make sure silent mode is off. Transcript: “${esc(text)}”</p></div>`;
  }

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
    [/^\/settings$/, settingsPage],
    [/^\/certificate$/, certificatePage],
    [/^\/cert\/([\w-]+)$/, (d) => certView(d)]
  ];
  function router() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, query] = raw.split("?");
    stopSpeech();
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
      ${q.audio && !hasTTS ? `<div class="passage">${esc(q.audio)}</div>` : ""}
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
      <ol class="plan">
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
        fb.innerHTML = `<b>${ok ? "Correct." : "Answer: " + esc(q.o[q.a]) + "."}</b> ${esc(q.x || "")}${q.audio ? `<div class="muted small">Transcript: “${esc(q.audio)}”</div>` : ""}`;
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
    el.innerHTML = `
    <p class="muted">Listen to each sentence, then say it aloud. ${SR ? "Press <b>Speak</b> and we'll check how closely you matched it." : "Speech recognition isn't available in this browser (try Chrome or Edge), so listen, repeat, and compare yourself."}</p>
    <div class="speak-list">
      ${u.speaking.map((s, i) => `
        <div class="speak-row" data-i="${i}">
          <span class="vocab-n">${pad(i + 1)}</span>
          <p class="speak-text">${esc(s)}</p>
          <div class="speak-actions">
            <button class="btn btn-sm btn-line" data-speak="${esc(s)}">${ICON_PLAY} Listen</button>
            ${SR ? `<button class="btn btn-sm rec">${ICON_MIC} Speak</button>` : ""}
          </div>
          <div class="speak-result small"></div>
        </div>`).join("")}
    </div>
    <div class="boxed"><h3>Speaking task</h3><p>Talk for 60 seconds about this: <b>${esc(speakingPrompt(u))}</b> Try to use this unit's grammar and vocabulary. Record yourself and listen back.</p></div>`;
    if (!SR) return;
    $$(".speak-row", el).forEach((row) => {
      const target = u.speaking[+row.dataset.i];
      const btn = $(".rec", row);
      const out = $(".speak-result", row);
      btn.onclick = () => {
        let rec;
        try { rec = new SR(); } catch (e) { out.textContent = "Couldn't start the microphone."; return; }
        rec.lang = "en-GB"; rec.interimResults = false; rec.maxAlternatives = 1;
        btn.disabled = true; btn.lastChild.textContent = " Listening…"; out.textContent = "";
        rec.onresult = (ev) => {
          const heard = ev.results[0][0].transcript;
          const pct = similarity(target, heard);
          const heardSet = norm(heard).split(" ");
          const marked = target.split(/\s+/).map((w) => { const n = norm(w); return n && !heardSet.includes(n) ? `<span class="missed">${esc(w)}</span>` : esc(w); }).join(" ");
          out.innerHTML = `Heard: “${esc(heard)}” &middot; <b class="${pct >= 80 ? "t-ok" : pct >= 50 ? "t-mid" : "t-bad"}">${pct}% match</b>. ${pct >= 80 ? "Excellent." : pct >= 50 ? "Close. Try once more." : "Listen again and repeat it slowly."}${pct < 100 ? `<div class="speak-marked">${marked}</div><div class="muted">Words we didn't catch are underlined. Practise those.</div>` : ""}`;
        };
        rec.onerror = (ev) => { out.textContent = ev.error === "not-allowed" ? "Microphone permission was denied." : "Didn't catch that. Try again."; };
        rec.onend = () => { btn.disabled = false; btn.lastChild.textContent = " Speak"; };
        rec.start();
      };
    });
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
        if (ex.t === "listen" && ex.audio) $(".fb", box).innerHTML += `<div class="muted small">Transcript: “${esc(ex.audio)}”</div>`;
      });
      const pct = Math.round((correct / list.length) * 100);
      logActivity(list.length);
      const msg = onScore(pct, correct, list.length);
      $("#check", host).remove();
      $("#ex-score", host).innerHTML = `
        <div class="score"><span class="score-n">${pct}<small>%</small></span><span class="muted">${correct} of ${list.length} correct</span></div>
        <div class="score-msg"><p>${msg}</p><button class="btn btn-sm btn-line" id="retry">Try again</button></div>`;
      $("#retry", host).onclick = onRetry;
      $("#ex-score", host).scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  function exHTML(ex, i) {
    const label = { mc: "Choose the answer", listen: "Listening", fill: "Complete the sentence", order: "Put the words in order" }[ex.t];
    let body = "";
    if (ex.passage) body += `<div class="passage">${esc(ex.passage)}</div>`;
    if (ex.t === "listen") body += audioBox(ex.audio) + (hasTTS ? "" : `<div class="passage">${esc(ex.audio)}</div>`);
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
          ${state.history.slice(0, 10).map((h) => `<tr><td>${fmtDate(h.date)}</td><td>${h.type === "placement" ? "Placement" : `${lvl(h.level).code} level test`}</td><td>${h.type === "placement" ? `${lvl(h.level).code} &middot; ${h.correct}/${h.total}` : `${h.score}% ${h.passed ? "pass" : "fail"}`}</td></tr>`).join("")}
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


  /* ---------- boot ---------- */
  $(".nav-toggle").onclick = () => $(".nav").classList.toggle("open");
  window.addEventListener("hashchange", router);
  router();
})();
