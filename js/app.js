/* LevelUp English — single-page app (no build step) */
(function () {
  "use strict";
  const { SKILLS, LEVELS, SKILL_TIPS, TEST_BANK, UNITS } = window.LU_DATA;
  const KEY = "levelup-english-v1";
  const TEST_LENGTH = 20;
  const PASS_PCT = 70;

  /* ---------- state ---------- */
  const defaultState = () => ({ level: null, placement: null, units: {}, history: [] });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      return s ? Object.assign(defaultState(), s) : defaultState();
    } catch (e) { return defaultState(); }
  }
  let state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }

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
  const levelBadge = (n, big) => { const L = lvl(n); return `<span class="lvl-badge${big ? " big" : ""}" style="--lc:${L.color}">${L.code}</span>`; };
  const levelProgress = (n) => { const us = unitsOf(n); return Math.round((us.filter((u) => unitDone(u.id)).length / us.length) * 100); };

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

  function audioBox(text) {
    if (!hasTTS) return `<div class="audio-box"><span class="muted">Audio is not supported in this browser. Transcript: “${esc(text)}”</span></div>`;
    return `<div class="audio-box">
      <button class="btn btn-audio" data-speak="${esc(text)}"><span class="ico">▶</span> Play audio</button>
      <button class="btn btn-ghost btn-sm" data-speak="${esc(text)}" data-rate="0.7">Slow</button>
      <span class="muted small">Listen, then answer. You can replay.</span></div>`;
  }

  /* ---------- router ---------- */
  const routes = [
    [/^\/?$/, home],
    [/^\/test$/, testIntro],
    [/^\/test\/run$/, testRun],
    [/^\/results$/, results],
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
  function notFound() { app.innerHTML = `<section class="narrow center"><h1>Page not found</h1><p><a class="btn btn-primary" href="#/">Go home</a></p></section>`; }

  /* =========================================================
     HOME
     ========================================================= */
  function home() {
    const has = state.level != null;
    const ladder = LEVELS.slice().reverse().map((L) => `
      <div class="ladder-step${has && state.level === L.n ? " current" : ""}" style="--lc:${L.color}">
        <span class="lvl-badge" style="--lc:${L.color}">${L.code}</span>
        <span class="ladder-name">${L.name}</span>
        ${has && state.level === L.n ? `<span class="you">You are here</span>` : ""}
      </div>`).join("");

    app.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <span class="eyebrow">Personalised English learning · CEFR A1–C2</span>
        <h1>Find your level.<br>Follow your path.<br><span class="accent">Speak with confidence.</span></h1>
        <p class="lead">Take a free adaptive placement test that measures your grammar, vocabulary, reading and listening. Get your level and a study plan built around your strengths and gaps — with lessons, exercises and speaking practice for every level.</p>
        <div class="cta-row">
          ${has
            ? `<a class="btn btn-primary btn-lg" href="#/level/${state.level}">Continue ${lvl(state.level).code} ${lvl(state.level).name}</a><a class="btn btn-ghost btn-lg" href="#/test">Retake level test</a>`
            : `<a class="btn btn-primary btn-lg" href="#/test">Take the free level test</a><a class="btn btn-ghost btn-lg" href="#/levels">Browse levels</a>`}
        </div>
        <p class="meta">${TEST_LENGTH} questions · about 15 minutes · no sign-up · progress saved on this device</p>
      </div>
      <div class="hero-card card"><div class="ladder">${ladder}</div></div>
    </section>

    <section class="section">
      <h2 class="section-title">How it works</h2>
      <div class="grid-3">
        <div class="card step"><span class="step-n">1</span><h3>Assess</h3><p>An adaptive test gets harder when you answer correctly and easier when you don't, so it finds your true level quickly.</p></div>
        <div class="card step"><span class="step-n">2</span><h3>Measure</h3><p>See your overall CEFR level plus a separate score for grammar, vocabulary, reading and listening.</p></div>
        <div class="card step"><span class="step-n">3</span><h3>Study</h3><p>Follow a recommended plan of units with lessons, vocabulary, reading, exercises and speaking — then pass the level test to move up.</p></div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Skills we measure</h2>
      <div class="grid-4">
        ${SKILLS.map((s) => `<div class="card skill-card skill-${s.id}"><span class="skill-ico">${s.icon}</span><h3>${s.name}</h3><p>${s.desc}</p></div>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Six levels, one clear path</h2>
      <div class="grid-3">
        ${LEVELS.map((L) => `
          <a class="card level-card" href="#/level/${L.n}" style="--lc:${L.color}">
            <div class="level-card-top">${levelBadge(L.n)}<h3>${L.name}</h3></div>
            <p>${L.summary}</p>
            <span class="link">${unitsOf(L.n).length} units →</span>
          </a>`).join("")}
      </div>
    </section>`;
  }

  /* =========================================================
     PLACEMENT TEST (adaptive)
     ========================================================= */
  let T = null;

  function testIntro() {
    app.innerHTML = `
    <section class="narrow">
      <span class="eyebrow">Placement test</span>
      <h1>Find your English level</h1>
      <p class="lead">This test adapts to you. Each correct answer brings a harder question; each wrong answer an easier one. Don't guess — choose <b>“I don't know”</b> if you're not sure. That gives a more accurate result.</p>
      <div class="grid-2 test-facts">
        <div class="card"><h3>${TEST_LENGTH} questions</h3><p class="muted">About 15 minutes</p></div>
        <div class="card"><h3>4 skills</h3><p class="muted">Grammar, vocabulary, reading, listening</p></div>
      </div>
      <div class="card notice">
        <b>🎧 Turn your sound on.</b> Listening questions play audio. ${hasTTS ? "Click <i>Test audio</i> to check." : "Your browser doesn't support audio — transcripts will be shown instead."}
        ${hasTTS ? `<button class="btn btn-ghost btn-sm" data-speak="Hello! If you can hear this, your audio is working.">Test audio</button>` : ""}
      </div>
      <button class="btn btn-primary btn-lg" id="start">Start the test</button>
    </section>`;
    $("#start").onclick = () => {
      T = { cur: 2, asked: new Set(), answers: [], total: TEST_LENGTH };
      location.hash = "#/test/run";
    };
  }

  function pickQuestion() {
    const count = (s) => T.answers.filter((a) => a.skill === s).length;
    for (const d of [0, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5]) {
      const L = T.cur + d;
      if (L < 1 || L > 6) continue;
      const pool = shuffle(TEST_BANK.filter((q) => q.lvl === L && !T.asked.has(q.id)));
      if (pool.length) { pool.sort((a, b) => count(a.skill) - count(b.skill)); return pool[0]; }
    }
    return null;
  }

  function testRun() {
    if (!T) { location.hash = "#/test"; return; }
    renderTestQuestion();
  }

  function renderTestQuestion() {
    const q = pickQuestion();
    if (!q) return finishTest();
    const n = T.answers.length + 1;
    let selected = null;
    const showText = q.audio && !hasTTS;
    app.innerHTML = `
    <section class="test-wrap">
      <div class="test-top"><span>Question <b>${n}</b> of ${T.total}</span><span class="chip chip-${q.skill}">${skill(q.skill).name}</span></div>
      <div class="progress"><div style="width:${((n - 1) / T.total) * 100}%"></div></div>
      <div class="card qcard">
        ${q.passage ? `<div class="passage">${esc(q.passage)}</div>` : ""}
        ${q.audio ? audioBox(q.audio) : ""}
        ${showText ? `<div class="passage">${esc(q.audio)}</div>` : ""}
        <h2 class="qtext">${esc(q.q)}</h2>
        <div class="options">${q.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="opt-key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="q-actions">
          <button class="btn btn-link" id="skip">I don't know</button>
          <button class="btn btn-primary" id="next" disabled>${n === T.total ? "Finish" : "Next →"}</button>
        </div>
      </div>
      <p class="center muted small"><a href="#/test" id="quit">Quit test</a></p>
    </section>`;

    const opts = $$(".opt");
    const select = (i) => { selected = i; opts.forEach((b, j) => b.classList.toggle("selected", j === i)); $("#next").disabled = false; };
    opts.forEach((b) => (b.onclick = () => select(+b.dataset.i)));
    const answer = (idx) => {
      document.onkeydown = null;
      const correct = idx === q.a;
      T.asked.add(q.id);
      T.answers.push({ id: q.id, lvl: q.lvl, skill: q.skill, correct });
      T.cur = correct ? Math.min(6, T.cur + 1) : Math.max(1, T.cur - 1);
      if (T.answers.length >= T.total) finishTest(); else { renderTestQuestion(); window.scrollTo(0, 0); }
    };
    $("#next").onclick = () => selected != null && answer(selected);
    $("#skip").onclick = () => answer(-1);
    $("#quit").onclick = () => { T = null; document.onkeydown = null; };
    document.onkeydown = (e) => {
      if (!location.hash.startsWith("#/test/run")) { document.onkeydown = null; return; }
      const k = e.key.toLowerCase();
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      if (k in map && map[k] < q.o.length && !e.target.closest("input,textarea")) select(map[k]);
      else if (k === "enter" && selected != null) answer(selected);
    };
    if (q.audio && hasTTS) setTimeout(() => speak(q.audio), 350);
  }

  /* Ability estimate: each answer contributes level+0.5 if right, level-0.5 if wrong.
     The staircase converges around the learner's ceiling, so we ignore the warm-up. */
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
  function results() {
    const p = state.placement;
    if (!p) { location.hash = "#/test"; return; }
    const L = lvl(p.level);
    const skillRows = SKILLS.filter((s) => p.skills[s.id] != null).map((s) => {
      const v = p.skills[s.id];
      const sl = lvl(Math.floor(v));
      return { s, v, sl, pct: Math.max(4, Math.min(100, ((v - 1) / 5.99) * 100)) };
    });
    const sorted = skillRows.slice().sort((a, b) => a.v - b.v);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];
    const weakSkills = sorted.filter((r) => r.v < p.level + 0.5 && r !== strongest).slice(0, 2);
    const focus = weakSkills.length ? weakSkills : [weakest];

    const plan = buildPlan(p.level, focus.map((f) => f.s.id));

    app.innerHTML = `
    <section class="results-head card" style="--lc:${L.color}">
      <div>
        <span class="eyebrow">Your result · ${fmtDate(p.date)}</span>
        <h1>Your level is ${L.code} <span class="muted-strong">${L.name}</span></h1>
        <p class="lead">${L.summary}</p>
        <p><span class="pill">${p.band === "secure" ? "Secure " + L.code : "Developing " + L.code}</span>
           <span class="pill pill-muted">${p.correct}/${p.total} answered correctly</span></p>
      </div>
      <div class="big-badge-wrap">${levelBadge(p.level, true)}<div class="scale">${LEVELS.map((x) => `<span class="${x.n === p.level ? "on" : ""}" style="--lc:${x.color}">${x.code}</span>`).join("")}</div></div>
    </section>

    <section class="grid-2 section">
      <div class="card">
        <h2>Skills breakdown</h2>
        <div class="bars">
          ${skillRows.map((r) => `
            <div class="bar-row">
              <div class="bar-label"><span>${r.s.name}</span><span class="muted">${r.sl.code}</span></div>
              <div class="bar"><div class="bar-fill skill-bg-${r.s.id}" style="width:${r.pct}%"></div></div>
            </div>`).join("")}
        </div>
        <p class="small muted">Scale A1 → C2. Each skill is estimated from the difficulty of the questions you answered correctly and incorrectly.</p>
      </div>
      <div class="card">
        <h2>What you can do at ${L.code}</h2>
        <ul class="checks">${L.canDo.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <div class="callouts">
          <div class="callout good"><b>Strongest skill:</b> ${strongest.s.name}</div>
          <div class="callout warn"><b>Focus on:</b> ${focus.map((f) => f.s.name).join(" & ")}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Your recommended study plan</h2>
      <div class="plan">
        ${plan.map((w, i) => `
          <div class="card plan-week">
            <span class="week">Week ${i + 1}</span>
            <h3>${esc(w.title)}</h3>
            <p class="muted">${esc(w.desc)}</p>
            ${w.link ? `<a class="btn btn-sm ${i === 0 ? "btn-primary" : "btn-ghost"}" href="${w.link}">${esc(w.cta)}</a>` : ""}
          </div>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">How to improve your ${focus.map((f) => f.s.name.toLowerCase()).join(" and ")}</h2>
      <div class="grid-2">
        ${focus.map((f) => `
          <div class="card">
            <h3><span class="chip chip-${f.s.id}">${f.s.name}</span> currently ${f.sl.code}</h3>
            <ul class="tips">${SKILL_TIPS[f.s.id].map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            <p class="small"><b>Practise it in:</b> ${unitsForSkill(f.s.id, p.level).map((u) => `<a href="#/unit/${u.id}?tab=${tabForSkill(f.s.id)}">${lvl(u.level).code} · ${esc(u.title)}</a>`).join(" · ")}</p>
          </div>`).join("")}
      </div>
    </section>

    <section class="section cta-band card">
      <div><h2>Ready to start?</h2><p class="muted">Your progress is saved automatically on this device.</p></div>
      <div class="cta-row"><a class="btn btn-primary btn-lg" href="#/unit/${unitsOf(p.level)[0].id}">Start ${L.code} Unit 1</a><a class="btn btn-ghost" href="#/dashboard">My progress</a></div>
    </section>`;
  }

  function tabForSkill(id) { return { grammar: "learn", vocabulary: "vocab", reading: "reading", listening: "practice" }[id]; }
  function unitsForSkill(skillId, level) {
    const cands = UNITS.filter((u) => u.focus.includes(skillId) && (u.level === level || u.level === level - 1));
    return (cands.length ? cands : UNITS.filter((u) => u.level === level)).sort((a, b) => b.level - a.level).slice(0, 3);
  }
  function buildPlan(level, focusIds) {
    const us = unitsOf(level);
    const L = lvl(level);
    const fnames = focusIds.map((id) => skill(id).name.toLowerCase()).join(" and ");
    const plan = us.map((u, i) => ({
      title: `Unit ${i + 1}: ${u.title}`,
      desc: `${u.grammar.title}. Do the lesson, learn the ${u.vocab.length} key words, then score ${PASS_PCT}%+ in practice. Extra: 10 min/day of ${fnames}.`,
      link: `#/unit/${u.id}`, cta: "Open unit"
    }));
    if (level > 1) {
      const rev = unitsForSkill(focusIds[0], level).find((u) => u.level === level - 1);
      if (rev) plan.push({ title: `Review: ${lvl(level - 1).code} ${rev.title}`, desc: `Strengthen your ${skill(focusIds[0]).name.toLowerCase()} foundations with a unit from the level below.`, link: `#/unit/${rev.id}`, cta: "Review unit" });
    }
    plan.push({
      title: level < 6 ? `${L.code} level test` : "C2 mastery check",
      desc: level < 6 ? `Score ${PASS_PCT}% or more to unlock ${lvl(level + 1).code} ${lvl(level + 1).name}.` : "Confirm your mastery and keep your skills sharp.",
      link: `#/level/${level}/test`, cta: "Take level test"
    });
    return plan;
  }

  /* =========================================================
     LEVELS
     ========================================================= */
  function levelsPage() {
    app.innerHTML = `
    <section>
      <span class="eyebrow">Course</span>
      <h1>All levels</h1>
      <p class="lead">Six levels aligned to the Common European Framework of Reference (CEFR). ${state.level ? `You're currently at <b>${lvl(state.level).code}</b>.` : `Not sure where to start? <a href="#/test">Take the placement test</a>.`}</p>
      <div class="levels-list">
        ${LEVELS.map((L) => {
          const pct = levelProgress(L.n);
          return `
          <a class="card level-row${state.level === L.n ? " current" : ""}" href="#/level/${L.n}" style="--lc:${L.color}">
            ${levelBadge(L.n, true)}
            <div class="level-row-body">
              <h3>${L.name} ${state.level === L.n ? `<span class="pill">Your level</span>` : ""}</h3>
              <p class="muted">${L.summary}</p>
              <div class="mini-progress"><div style="width:${pct}%"></div></div>
              <span class="small muted">${pct}% complete · ${unitsOf(L.n).length} units · ~${L.hours} guided hours to reach</span>
            </div>
          </a>`;
        }).join("")}
      </div>
    </section>`;
  }

  function levelPage(n) {
    const L = lvl(n);
    const us = unitsOf(n);
    const best = state.history.find((h) => h.type === "level" && h.level === n);
    app.innerHTML = `
    <nav class="crumbs"><a href="#/levels">Levels</a> / ${L.code}</nav>
    <section class="level-head card" style="--lc:${L.color}">
      ${levelBadge(n, true)}
      <div>
        <h1>${L.code} · ${L.name}</h1>
        <p class="lead">${L.summary}</p>
        <div class="mini-progress"><div style="width:${levelProgress(n)}%"></div></div>
        <span class="small muted">${us.filter((u) => unitDone(u.id)).length} of ${us.length} units completed</span>
      </div>
    </section>
    <section class="grid-2 section">
      <div class="card"><h2>By the end of this level you can…</h2><ul class="checks">${L.canDo.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>
      <div class="card">
        <h2>Level test</h2>
        <p class="muted">10 questions covering all four skills. Score ${PASS_PCT}% or more to ${n < 6 ? `move up to ${lvl(n + 1).code}` : "confirm C2 mastery"}.</p>
        ${best ? `<p>Last attempt: <b>${best.score}%</b> ${best.passed ? "✅ passed" : "— not passed yet"}</p>` : ""}
        <a class="btn btn-primary" href="#/level/${n}/test">Take ${L.code} level test</a>
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">Units</h2>
      <div class="grid-2">
        ${us.map((u, i) => unitCard(u, i)).join("")}
      </div>
    </section>
    <div class="pager">
      ${n > 1 ? `<a class="btn btn-ghost" href="#/level/${n - 1}">← ${lvl(n - 1).code}</a>` : "<span></span>"}
      ${n < 6 ? `<a class="btn btn-ghost" href="#/level/${n + 1}">${lvl(n + 1).code} →</a>` : ""}
    </div>`;
  }

  function unitCard(u, i) {
    const s = state.units[u.id];
    return `
    <a class="card unit-card" href="#/unit/${u.id}">
      <div class="unit-card-top"><span class="small muted">Unit ${i + 1} · ${esc(u.topic)}</span>
        ${s ? `<span class="pill ${s.done ? "" : "pill-muted"}">${s.done ? "✓ " : ""}Best ${s.best}%</span>` : `<span class="pill pill-muted">Not started</span>`}</div>
      <h3>${esc(u.title)}</h3>
      <p class="muted">${esc(u.grammar.title)}</p>
      <div class="chips">${u.focus.map((f) => `<span class="chip chip-${f}">${skill(f).name}</span>`).join("")}</div>
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
    <section class="unit-head" style="--lc:${L.color}">
      ${levelBadge(L.n)}
      <div><h1>${esc(u.title)}</h1><p class="muted">${esc(u.topic)} · ${esc(u.grammar.title)}</p></div>
    </section>
    <div class="tabs" role="tablist">${TABS.map(([k, label]) => `<button role="tab" class="tab${k === tab ? " active" : ""}" data-tab="${k}">${label}</button>`).join("")}</div>
    <section id="tab-body" class="tab-body"></section>
    <div class="pager">
      ${idx > 0 ? `<a class="btn btn-ghost" href="#/unit/${siblings[idx - 1].id}">← Previous unit</a>` : `<a class="btn btn-ghost" href="#/level/${L.n}">← ${L.code} overview</a>`}
      ${idx < siblings.length - 1 ? `<a class="btn btn-ghost" href="#/unit/${siblings[idx + 1].id}">Next unit →</a>` : `<a class="btn btn-ghost" href="#/level/${L.n}/test">${L.code} level test →</a>`}
    </div>`;

    const body = $("#tab-body");
    const show = (k) => {
      tab = k;
      $$(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === k));
      history.replaceState(null, "", `#/unit/${u.id}?tab=${k}`);
      if (hasTTS) speechSynthesis.cancel();
      ({ learn: renderLearn, vocab: renderVocab, reading: renderReading, practice: renderPractice, speaking: renderSpeaking })[k](body, u, show);
    };
    $$(".tab").forEach((b) => (b.onclick = () => show(b.dataset.tab)));
    show(tab);
  }

  function renderLearn(el, u, show) {
    el.innerHTML = `
    <div class="grid-side">
      <div class="card">
        <h2>${esc(u.grammar.title)}</h2>
        <div class="grammar">${u.grammar.html}</div>
        <h3>Examples</h3>
        <ul class="examples">${u.grammar.examples.map((e) => `<li><button class="icon-btn" data-speak="${esc(e)}" aria-label="Listen">🔊</button>${esc(e)}</li>`).join("")}</ul>
      </div>
      <aside class="card">
        <h3>In this unit you will</h3>
        <ul class="checks">${u.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
        <h3>Study route</h3>
        <ol class="route"><li>Read the lesson</li><li>Learn the vocabulary</li><li>Read the text</li><li>Practise (${PASS_PCT}% to complete)</li><li>Speak</li></ol>
        <button class="btn btn-primary btn-block" id="go-vocab">Next: Vocabulary →</button>
      </aside>
    </div>`;
    $("#go-vocab").onclick = () => show("vocab");
  }

  function renderVocab(el, u, show) {
    el.innerHTML = `
    <p class="muted">Click a card to flip it. Use 🔊 to hear the word and example.</p>
    <div class="vocab-grid">
      ${u.vocab.map(([w, d, ex]) => `
        <div class="flip" tabindex="0">
          <div class="flip-inner">
            <div class="flip-front card"><span class="word">${esc(w)}</span><button class="icon-btn" data-speak="${esc(w)}" aria-label="Listen">🔊</button></div>
            <div class="flip-back card"><b>${esc(w)}</b><p>${esc(d)}</p><p class="ex">“${esc(ex)}” <button class="icon-btn" data-speak="${esc(ex)}" aria-label="Listen">🔊</button></p></div>
          </div>
        </div>`).join("")}
    </div>
    <div class="center"><button class="btn btn-primary" id="go-read">Next: Reading →</button></div>`;
    $$(".flip").forEach((f) => {
      const toggle = (e) => { if (e.target.closest("[data-speak]")) return; f.classList.toggle("flipped"); };
      f.onclick = toggle;
      f.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f.classList.toggle("flipped"); } };
    });
    $("#go-read").onclick = () => show("reading");
  }

  function renderReading(el, u, show) {
    const words = u.vocab.map((v) => v[0]);
    let html = esc(u.reading.text);
    words.forEach((w) => {
      const re = new RegExp(`\\b(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
      html = html.replace(re, `<mark title="Key word">$1</mark>`);
    });
    el.innerHTML = `
    <div class="card reading">
      <div class="reading-top"><h2>${esc(u.reading.title)}</h2>
        ${hasTTS ? `<div><button class="btn btn-audio btn-sm" data-speak="${esc(u.reading.text)}">▶ Read aloud</button> <button class="btn btn-ghost btn-sm" data-speak="${esc(u.reading.text)}" data-rate="0.75">Slow</button></div>` : ""}</div>
      <p class="reading-text">${html}</p>
      <p class="small muted">Highlighted words are from this unit's vocabulary. Read once for the general idea, then again for detail. The practice section has questions on this text.</p>
    </div>
    <div class="center"><button class="btn btn-primary" id="go-prac">Next: Practice →</button></div>`;
    $("#go-prac").onclick = () => show("practice");
  }

  function renderPractice(el, u, show) {
    const s = state.units[u.id];
    el.innerHTML = `${s ? `<p class="muted">Best score: <b>${s.best}%</b>${s.done ? " · ✓ Completed" : ` · Score ${PASS_PCT}% to complete this unit`}</p>` : `<p class="muted">Score ${PASS_PCT}% or more to complete this unit.</p>`}<div id="ex-host"></div>`;
    mountExercises($("#ex-host"), u.ex, (score) => {
      const prev = state.units[u.id] || { best: 0, done: false };
      state.units[u.id] = { best: Math.max(prev.best, score), done: prev.done || score >= PASS_PCT, last: new Date().toISOString() };
      save();
      return score >= PASS_PCT
        ? `<b>Great work — unit completed!</b> <button class="btn btn-sm btn-primary" id="go-speak">Next: Speaking →</button>`
        : `Keep going — you need ${PASS_PCT}% to complete the unit. Review the <a href="#/unit/${u.id}?tab=learn">lesson</a> and try again.`;
    }, () => renderPractice(el, u, show));
    el.onclick = (e) => { if (e.target.id === "go-speak") show("speaking"); };
  }

  function renderSpeaking(el, u) {
    el.innerHTML = `
    <div class="card">
      <h2>Speaking practice</h2>
      <p class="muted">Listen to each sentence, then say it aloud. ${SR ? "Press <b>🎙 Speak</b> and we'll check how closely you matched it." : "Speech recognition isn't available in this browser (try Chrome or Edge) — listen and repeat, then compare yourself."}</p>
      <div class="speak-list">
        ${u.speaking.map((s, i) => `
          <div class="speak-row" data-i="${i}">
            <p class="speak-text">${esc(s)}</p>
            <div class="speak-actions">
              <button class="btn btn-ghost btn-sm" data-speak="${esc(s)}">🔊 Listen</button>
              ${SR ? `<button class="btn btn-primary btn-sm rec">🎙 Speak</button>` : ""}
            </div>
            <div class="speak-result small"></div>
          </div>`).join("")}
      </div>
    </div>
    <div class="card section"><h3>Speaking challenge</h3><p>Record yourself for 60 seconds answering: <b>${esc(speakingPrompt(u))}</b> Try to use the grammar and vocabulary from this unit.</p></div>`;
    if (!SR) return;
    $$(".speak-row").forEach((row) => {
      const target = u.speaking[+row.dataset.i];
      const btn = $(".rec", row);
      const out = $(".speak-result", row);
      btn.onclick = () => {
        let rec;
        try { rec = new SR(); } catch (e) { out.textContent = "Couldn't start the microphone."; return; }
        rec.lang = "en-GB"; rec.interimResults = false; rec.maxAlternatives = 1;
        btn.disabled = true; btn.textContent = "Listening…"; out.textContent = "";
        rec.onresult = (ev) => {
          const heard = ev.results[0][0].transcript;
          const pct = similarity(target, heard);
          out.innerHTML = `You said: “${esc(heard)}” — <b class="${pct >= 80 ? "ok" : pct >= 50 ? "mid" : "bad"}">${pct}% match</b> ${pct >= 80 ? "Excellent!" : pct >= 50 ? "Good — try once more." : "Listen again and repeat slowly."}`;
        };
        rec.onerror = (ev) => { out.textContent = ev.error === "not-allowed" ? "Microphone permission was denied." : "Didn't catch that — try again."; };
        rec.onend = () => { btn.disabled = false; btn.textContent = "🎙 Speak"; };
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
      "b2-1": "Describe a decision you regret, or one you are glad you made.",
      "b2-2": "Report a conversation you had recently.",
      "c1-1": "Describe something that truly surprised you, using inversion for emphasis.",
      "c1-2": "Give a cautious, hedged opinion on whether social media harms society.",
      "c2-1": "Make a formal recommendation to your company's board.",
      "c2-2": "Give a short persuasive speech using at least two rhetorical devices."
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
      <div class="ex-list">${list.map((ex, i) => exHTML(ex, i)).join("")}</div>
      <div class="ex-footer card"><button class="btn btn-primary btn-lg" id="check">Check answers</button><div id="ex-score"></div></div>`;

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
      $(".built", box).innerHTML = st.built.length ? st.built.map((t, j) => `<button class="tile" data-from="built" data-j="${j}">${esc(t.w)}</button>`).join("") : `<span class="muted small">Click the words below in the correct order</span>`;
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
          ? `<span class="ok">✓ Correct.</span> ${ex.x ? esc(ex.x) : ""}`
          : `<span class="bad">✗ Answer: <b>${esc(answerText)}</b>.</span> ${ex.x ? esc(ex.x) : ""}`;
        if (ex.t === "listen" && ex.audio) $(".fb", box).innerHTML += `<div class="transcript small muted">Transcript: “${esc(ex.audio)}”</div>`;
      });
      const pct = Math.round((correct / list.length) * 100);
      const msg = onScore(pct, correct, list.length);
      $("#check", host).remove();
      $("#ex-score", host).innerHTML = `
        <div class="score-ring" style="--p:${pct}"><span>${pct}%</span></div>
        <div><p><b>${correct} / ${list.length} correct</b></p><p>${msg}</p><button class="btn btn-ghost btn-sm" id="retry">Try again</button></div>`;
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
      body += `<p class="ex-q">${esc(ex.q)}</p><div class="options compact">${ex.o.map((o, k) => `<button class="opt" data-o="${k}"><span class="opt-key">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
    } else if (ex.t === "fill") {
      const [a, b] = ex.q.split("___");
      body += `<p class="ex-q fill-q">${esc(a)}<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer">${esc(b || "")}</p>`;
    } else if (ex.t === "order") {
      body += `<div class="built"></div><div class="pool"></div>${ex.p ? `<p class="small muted">Sentence ends with “${esc(ex.p)}”</p>` : ""}`;
    }
    return `<div class="card ex" data-i="${i}"><div class="ex-head"><span class="ex-n">${i + 1}</span><span class="small muted">${label}</span></div>${body}<div class="fb"></div></div>`;
  }

  /* =========================================================
     LEVEL TEST
     ========================================================= */
  function levelTest(n) {
    const L = lvl(n);
    const qs = shuffle(TEST_BANK.filter((q) => q.lvl === n)).map((q) => ({ t: q.audio ? "listen" : "mc", q: q.q, o: q.o, a: q.a, audio: q.audio, passage: q.passage }));
    app.innerHTML = `
    <nav class="crumbs"><a href="#/levels">Levels</a> / <a href="#/level/${n}">${L.code}</a> / Level test</nav>
    <section class="unit-head" style="--lc:${L.color}">${levelBadge(n)}<div><h1>${L.code} level test</h1><p class="muted">${qs.length} questions · pass mark ${PASS_PCT}%</p></div></section>
    <div id="lt-host"></div>`;
    mountExercises($("#lt-host"), qs, (pct) => {
      const passed = pct >= PASS_PCT;
      let moved = false;
      if (passed && n < 6 && (state.level == null || state.level <= n)) { state.level = n + 1; moved = true; }
      if (state.level == null) state.level = n;
      state.history.unshift({ type: "level", date: new Date().toISOString(), level: n, score: pct, passed });
      save();
      if (!passed) return `Not quite — you need ${PASS_PCT}%. Review the <a href="#/level/${n}">${L.code} units</a> and try again.`;
      if (moved) return `🎉 <b>Congratulations! You've unlocked ${lvl(n + 1).code} ${lvl(n + 1).name}.</b> <a class="btn btn-sm btn-primary" href="#/level/${n + 1}">Go to ${lvl(n + 1).code}</a>`;
      return n === 6 ? `🏆 <b>C2 mastery confirmed.</b> Outstanding!` : `<b>Passed!</b> You've already reached a higher level.`;
    }, () => levelTest(n));
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */
  function dashboard() {
    if (state.level == null) {
      app.innerHTML = `<section class="narrow center"><h1>My progress</h1><p class="lead">You haven't taken the placement test yet. It takes about 15 minutes and tells you where to start.</p><a class="btn btn-primary btn-lg" href="#/test">Take the level test</a><p class="small muted">Or <a href="#/levels">browse levels</a> and start anywhere.</p></section>`;
      return;
    }
    const L = lvl(state.level);
    const next = unitsOf(state.level).find((u) => !unitDone(u.id));
    const doneAll = UNITS.filter((u) => unitDone(u.id)).length;
    const p = state.placement;

    app.innerHTML = `
    <section>
      <span class="eyebrow">My progress</span>
      <h1>Welcome back</h1>
    </section>
    <section class="grid-3 section">
      <div class="card stat" style="--lc:${L.color}">${levelBadge(state.level, true)}<div><span class="muted small">Current level</span><h3>${L.name}</h3></div></div>
      <div class="card stat"><div class="stat-n">${doneAll}<span class="muted">/${UNITS.length}</span></div><div><span class="muted small">Units completed</span><h3>across all levels</h3></div></div>
      <div class="card stat"><div class="stat-n">${levelProgress(state.level)}%</div><div><span class="muted small">${L.code} progress</span><h3>${unitsOf(state.level).filter((u) => unitDone(u.id)).length} of ${unitsOf(state.level).length} units</h3></div></div>
    </section>

    <section class="card section next-up">
      <div>
        <span class="eyebrow">Recommended next</span>
        ${next
          ? `<h2>${L.code} · ${esc(next.title)}</h2><p class="muted">${esc(next.grammar.title)}</p>`
          : `<h2>${state.level < 6 ? `Take the ${L.code} level test` : "C2 mastery check"}</h2><p class="muted">You've completed every unit at this level.</p>`}
      </div>
      <a class="btn btn-primary btn-lg" href="${next ? `#/unit/${next.id}` : `#/level/${state.level}/test`}">${next ? "Continue" : "Start test"}</a>
    </section>

    <section class="grid-2 section">
      <div class="card">
        <h2>Level map</h2>
        <div class="bars">
          ${LEVELS.map((x) => `
            <div class="bar-row">
              <div class="bar-label"><span>${x.code} ${x.name}${x.n === state.level ? " · <b>current</b>" : ""}</span><span class="muted">${levelProgress(x.n)}%</span></div>
              <div class="bar"><div class="bar-fill" style="width:${Math.max(levelProgress(x.n), 0)}%;background:${x.color}"></div></div>
            </div>`).join("")}
        </div>
      </div>
      <div class="card">
        <h2>Placement skills</h2>
        ${p ? `<div class="bars">${SKILLS.filter((s) => p.skills[s.id] != null).map((s) => {
          const v = p.skills[s.id];
          return `<div class="bar-row"><div class="bar-label"><span>${s.name}</span><span class="muted">${lvl(Math.floor(v)).code}</span></div><div class="bar"><div class="bar-fill skill-bg-${s.id}" style="width:${Math.max(4, ((v - 1) / 5.99) * 100)}%"></div></div></div>`;
        }).join("")}</div><p class="small"><a href="#/results">View full results & study plan →</a></p>` : `<p class="muted">Take the <a href="#/test">placement test</a> to see your skill profile.</p>`}
      </div>
    </section>

    <section class="card section">
      <h2>Test history</h2>
      ${state.history.length ? `<table class="table"><thead><tr><th>Date</th><th>Test</th><th>Result</th></tr></thead><tbody>
        ${state.history.slice(0, 12).map((h) => `<tr><td>${fmtDate(h.date)}</td><td>${h.type === "placement" ? "Placement test" : `${lvl(h.level).code} level test`}</td><td>${h.type === "placement" ? `${lvl(h.level).code} (${h.band}) · ${h.correct}/${h.total}` : `${h.score}% ${h.passed ? "✅" : "❌"}`}</td></tr>`).join("")}
      </tbody></table>` : `<p class="muted">No tests yet.</p>`}
    </section>

    <section class="section danger-zone">
      <button class="btn btn-link" id="reset">Reset all progress</button>
      <span id="reset-confirm" hidden> Are you sure? <button class="btn btn-sm btn-danger" id="reset-yes">Yes, reset</button> <button class="btn btn-sm btn-ghost" id="reset-no">Cancel</button></span>
    </section>`;

    $("#reset").onclick = () => ($("#reset-confirm").hidden = false);
    $("#reset-no").onclick = () => ($("#reset-confirm").hidden = true);
    $("#reset-yes").onclick = () => { state = defaultState(); save(); location.hash = "#/"; };
  }

  /* ---------- boot ---------- */
  $(".nav-toggle").onclick = () => $(".nav").classList.toggle("open");
  window.addEventListener("hashchange", router);
  router();
})();
