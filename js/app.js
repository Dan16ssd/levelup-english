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
  const defaultState = () => ({ level: null, placement: null, units: {}, history: [], seen: [], practice: { answered: 0, correct: 0, best: 0 } });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      return s ? Object.assign(defaultState(), s) : defaultState();
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
  const hasTTS = "speechSynthesis" in window;
  let voice = null;
  function pickVoice() {
    const vs = speechSynthesis.getVoices();
    voice = vs.find((v) => /en[-_]GB/i.test(v.lang)) || vs.find((v) => /en[-_]US/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, rate) {
    if (!hasTTS) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = "en-GB"; }
    u.rate = rate || 0.95;
    speechSynthesis.speak(u);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-speak]");
    if (b) { e.preventDefault(); speak(b.getAttribute("data-speak"), parseFloat(b.getAttribute("data-rate")) || 0.95); }
  });
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sayBtn = (text, label) => `<button class="say" data-speak="${esc(text)}" aria-label="Listen">${ICON_SPEAKER}${label ? `<span>${label}</span>` : ""}</button>`;

  function audioBox(text) {
    if (!hasTTS) return `<div class="audio"><span class="muted">Audio isn't supported in this browser. Transcript: “${esc(text)}”</span></div>`;
    return `<div class="audio">
      <button class="btn btn-sm" data-speak="${esc(text)}">${ICON_PLAY} Play recording</button>
      <button class="btn btn-sm btn-line" data-speak="${esc(text)}" data-rate="0.7">Slower</button>
      <span class="audio-note">Replay as often as you need.</span></div>`;
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
    [/^\/dashboard$/, dashboard]
  ];
  function router() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, query] = raw.split("?");
    if (hasTTS) speechSynthesis.cancel();
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
    if (q.audio && hasTTS) setTimeout(() => speak(q.audio), 350);
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
      <div class="actions"><a class="btn" href="#/unit/${unitsOf(p.level)[0].id}">Start ${L.code} unit 1</a><a class="btn btn-line" href="#/test">Take a new test</a></div>
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
        <div><span>All-time answered</span><b>${state.practice.answered}</b></div>`;
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
        session.answered++; state.practice.answered++;
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
      if (q.audio && hasTTS) setTimeout(() => speak(q.audio), 300);
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
  const TABS = [["learn", "Lesson"], ["vocab", "Vocabulary"], ["reading", "Reading"], ["practice", "Practice"], ["speaking", "Speaking"]];

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
      if (hasTTS) speechSynthesis.cancel();
      body.onclick = null;
      ({ learn: renderLearn, vocab: renderVocab, reading: renderReading, practice: renderPractice, speaking: renderSpeaking })[k](body, u, show);
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
        <ol class="list-num small"><li>Lesson</li><li>Vocabulary</li><li>Reading</li><li>Practice (${PASS_PCT}% to complete)</li><li>Speaking</li></ol>
      </aside>
    </div>
    ${nextBtn("Vocabulary", "go-next")}`;
    $("#go-next").onclick = () => show("vocab");
  }

  function renderVocab(el, u, show) {
    el.innerHTML = `
    <p class="muted">Try to recall each meaning before you reveal it.</p>
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
          out.innerHTML = `Heard: “${esc(heard)}” &middot; <b class="${pct >= 80 ? "t-ok" : pct >= 50 ? "t-mid" : "t-bad"}">${pct}% match</b>. ${pct >= 80 ? "Excellent." : pct >= 50 ? "Close. Try once more." : "Listen again and repeat it slowly."}`;
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
    }[u.id] || "Talk about the topic of this unit.";
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
      app.innerHTML = `<section class="page-head narrow"><p class="kicker">My progress</p><h1 class="display">Nothing here yet</h1><p class="lede">Take the placement test to find out where to start. It takes about 15 minutes.</p><div class="actions"><a class="btn btn-lg" href="#/test">Take the level test</a><a class="btn btn-lg btn-line" href="#/practice">Practise without a test</a></div></section>`;
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
      <div><span>Best streak</span><b>${pr.best}</b></div>
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

    <section class="cols band">
      <div>
        <h2 class="h-section">Placement skills</h2>
        ${p ? `${skillBars(skillRowsOf(p))}<p class="small"><a href="#/results">Full results and study plan &rarr;</a></p>` : `<p class="muted">Take the <a href="#/test">placement test</a> to see your skill profile.</p>`}
      </div>
      <div>
        <h2 class="h-section">Test history</h2>
        ${state.history.length ? `<table class="table"><thead><tr><th>Date</th><th>Test</th><th>Result</th></tr></thead><tbody>
          ${state.history.slice(0, 10).map((h) => `<tr><td>${fmtDate(h.date)}</td><td>${h.type === "placement" ? "Placement" : `${lvl(h.level).code} level test`}</td><td>${h.type === "placement" ? `${lvl(h.level).code} &middot; ${h.correct}/${h.total}` : `${h.score}% ${h.passed ? "pass" : "fail"}`}</td></tr>`).join("")}
        </tbody></table>` : `<p class="muted">No tests yet.</p>`}
      </div>
    </section>

    <section class="danger">
      <button class="btn-text" id="reset">Reset all progress</button>
      <span id="reset-confirm" hidden>This deletes your level, scores and history. <button class="btn btn-sm btn-danger" id="reset-yes">Reset</button> <button class="btn btn-sm btn-line" id="reset-no">Cancel</button></span>
    </section>`;

    $("#reset").onclick = () => ($("#reset-confirm").hidden = false);
    $("#reset-no").onclick = () => ($("#reset-confirm").hidden = true);
    $("#reset-yes").onclick = () => { state = defaultState(); seen = new Set(); save(); location.hash = "#/"; };
  }

  /* ---------- boot ---------- */
  $(".nav-toggle").onclick = () => $(".nav").classList.toggle("open");
  window.addEventListener("hashchange", router);
  router();
})();
