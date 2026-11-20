/* LevelUp English — procedural question generators.
   Every generator builds a fresh multiple-choice question from templates + word banks,
   so tests and practice never run out. */
window.LU_GEN = (function () {
  "use strict";
  const { TEST_BANK } = window.LU_DATA;

  /* ---------- helpers ---------- */
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const art = (w) => (/^[aeiou]/i.test(w) ? "an " : "a ") + w;
  const uniq = (a) => Array.from(new Set(a));
  const others = (list, x, n, f = (v) => v) => sample(list.filter((v) => f(v) !== f(x)), n).map(f);

  const PEOPLE = [["Tom", "he"], ["Anna", "she"], ["Ali", "he"], ["Maria", "she"], ["David", "he"], ["Sara", "she"], ["Ken", "he"], ["Lucy", "she"], ["Omar", "he"], ["Emma", "she"], ["Leo", "he"], ["Nina", "she"], ["Jack", "he"], ["Mia", "she"], ["Sam", "he"], ["Yuki", "she"], ["Carlos", "he"], ["Fatima", "she"], ["Ben", "he"], ["Zoe", "she"], ["Hassan", "he"], ["Elena", "she"], ["Raj", "he"], ["Grace", "she"], ["Daniel", "he"], ["Layla", "she"]];
  const person = () => { const [n, g] = pick(PEOPLE); return { n, he: g, He: cap(g), his: g === "he" ? "his" : "her", him: g === "he" ? "him" : "her" }; };
  const twoPeople = () => { const a = person(); let b; do { b = person(); } while (b.n === a.n); return [a, b]; };
  const JOBS = ["teacher", "doctor", "nurse", "student", "engineer", "chef", "driver", "artist", "pilot", "farmer", "lawyer", "waiter", "dentist", "actor", "architect", "mechanic"];
  const CITIES = ["London", "Paris", "Tokyo", "Madrid", "Rome", "Berlin", "Dubai", "Sydney", "Toronto", "Cairo", "Istanbul", "Seoul", "Lisbon", "Mexico City", "Mumbai", "Nairobi", "Lima", "Oslo"];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  const TENS = { 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety" };
  const numWord = (n) => (n <= 20 ? NUM[n] : TENS[n]);
  const ORD = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];

  /* ---------- registry ---------- */
  const GENS = [];
  function G(lvl, skill, topic, fn) { GENS.push({ lvl, skill, topic, fn }); }

  function build(g) {
    const r = g.fn();
    const wrong = uniq(r.wrong.filter((w) => w !== r.correct)).slice(0, 3);
    const o = shuffle([r.correct].concat(wrong));
    return { lvl: g.lvl, skill: g.skill, topic: g.topic, q: r.q, o, a: o.indexOf(r.correct), passage: r.passage, audio: r.audio, x: r.x || "" };
  }
  const keyOf = (q) => [q.q, q.passage || "", q.audio || "", q.o[q.a]].join("|");

  /* filter: { lvl, skill, topics } ; seen: Set of keys (updated) */
  function generate(filter, seen) {
    const f = filter || {};
    const match = (g) => (f.lvl == null || g.lvl === f.lvl) && (!f.skill || g.skill === f.skill) && (!f.topics || f.topics.includes(g.topic));
    let pool = GENS.filter(match);
    if (!pool.length) pool = GENS.filter((g) => f.lvl == null || g.lvl === f.lvl);
    let q = null;
    for (let i = 0; i < 40; i++) {
      q = build(pick(pool));
      if (!seen || !seen.has(keyOf(q))) break;
    }
    if (seen) seen.add(keyOf(q));
    return q;
  }
  function generateSet(n, filter, seen) {
    const out = [];
    const local = seen || new Set();
    for (let i = 0; i < n; i++) out.push(generate(filter, local));
    return out;
  }

  /* ---------- the original hand-written bank also acts as generators ---------- */
  [1, 2, 3, 4, 5, 6].forEach((lvl) => ["grammar", "vocabulary", "reading", "listening"].forEach((skill) => {
    const items = TEST_BANK.filter((q) => q.lvl === lvl && q.skill === skill);
    if (items.length) G(lvl, skill, "bank", () => { const q = pick(items); return { q: q.q, correct: q.o[q.a], wrong: q.o.filter((_, i) => i !== q.a), passage: q.passage, audio: q.audio }; });
  }));

  /* =====================================================================
     A1 — BEGINNER
     ===================================================================== */
  G(1, "grammar", "be", () => {
    const p = person();
    const S = pick([["I", "am", 1], ["You", "are", 1], ["We", "are", 2], ["They", "are", 2], ["He", "is", 1], ["She", "is", 1], [p.n, "is", 1], ["My parents", "are", 2], ["My sister", "is", 1], [`${p.n} and I`, "are", 2], ["The children", "are", 2]]);
    const job = pick(JOBS);
    const tail = S[2] === 2
      ? pick([`${job}s`, `from ${pick(CITIES)}`, "at home now", "very happy today", "in the classroom"])
      : pick([art(job), `from ${pick(CITIES)}`, "at home now", "tired today", "in the kitchen"]);
    return { q: `${S[0]} ___ ${tail}.`, correct: S[1], wrong: ["am", "is", "are", "be"], x: `${S[0]} → ${S[1]}.` };
  });
  G(1, "grammar", "be", () => {
    const p = person();
    const S = pick([["I", "'m not"], ["He", "isn't"], ["She", "isn't"], [p.n, "isn't"], ["We", "aren't"], ["They", "aren't"], ["You", "aren't"]]);
    const tail = pick(["at work today", "hungry", "from " + pick(CITIES), "ready yet", "very tall"]);
    const neg = S[0] === "I" ? "am not" : S[1];
    return { q: `Make it negative: ${S[0]} ___ ${tail}.`, correct: neg, wrong: ["am not", "isn't", "aren't", "don't", "doesn't"], x: `${S[0]} → ${neg}.` };
  });

  const PS_VERBS = [["work", "works", "working", "in an office"], ["play", "plays", "playing", "tennis"], ["watch", "watches", "watching", "TV"], ["go", "goes", "going", "to the gym"], ["study", "studies", "studying", "English"], ["drink", "drinks", "drinking", "tea"], ["read", "reads", "reading", "the news"], ["cook", "cooks", "cooking", "dinner"], ["wash", "washes", "washing", "the car"], ["eat", "eats", "eating", "fruit"], ["speak", "speaks", "speaking", "French"], ["finish", "finishes", "finishing", "work at five"], ["visit", "visits", "visiting", "friends"], ["teach", "teaches", "teaching", "children"]];
  const wrongS = (v) => (v[1] === v[0] + "s" ? v[0] + "es" : v[0] + "s");
  G(1, "grammar", "presentSimple", () => {
    const v = pick(PS_VERBS);
    const p = person();
    const third = Math.random() < 0.6;
    const S = third ? pick([p.n, "He", "She", "My brother", "My mother"]) : pick(["I", "You", "We", "They", "My friends"]);
    const time = pick(["every day", "every evening", "on Mondays", "at the weekend", "every morning"]);
    const correct = third ? v[1] : v[0];
    return { q: `${S} ___ ${v[3]} ${time}.`, correct, wrong: [third ? v[0] : v[1], v[2], wrongS(v)], x: third ? `He/she/it → verb + s (${v[1]}).` : `${S} → base form (${v[0]}).` };
  });
  G(1, "grammar", "presentSimple", () => {
    const v = pick(PS_VERBS);
    const p = person();
    const third = Math.random() < 0.5;
    const S = third ? pick([p.n, "He", "She"]) : pick(["You", "They", "your parents"]);
    const aux = third ? "Does" : "Do";
    return { q: `___ ${S} ${v[0]} ${v[3]}?`, correct: aux, wrong: ["Do", "Does", "Is", "Are"], x: `Questions: ${aux} + ${third ? "he/she/it" : "I/you/we/they"} + base verb.` };
  });
  G(1, "grammar", "presentSimple", () => {
    const v = pick(PS_VERBS);
    const p = person();
    const third = Math.random() < 0.5;
    const S = third ? p.n : pick(["I", "We", "They"]);
    const neg = third ? "doesn't" : "don't";
    return { q: `${S} ___ ${v[0]} ${v[3]}.`, correct: neg, wrong: ["don't", "doesn't", "isn't", "aren't"], x: `Negative: ${neg} + base verb.` };
  });
  G(1, "grammar", "thereIs", () => {
    const things = [["chair", "chairs"], ["book", "books"], ["apple", "apples"], ["window", "windows"], ["cat", "cats"], ["box", "boxes"], ["bed", "beds"], ["lamp", "lamps"], ["cup", "cups"], ["picture", "pictures"]];
    const t = pick(things);
    const n = rnd(5) + 1;
    const place = pick(["in the room", "on the table", "in the kitchen", "near the door", "in my bag"]);
    const one = n === 1;
    return { q: `There ___ ${one ? art(t[0]) : NUM[n] + " " + t[1]} ${place}.`, correct: one ? "is" : "are", wrong: ["is", "are", "am", "be"], x: one ? "One thing → there is." : "More than one → there are." };
  });
  G(1, "grammar", "possessive", () => {
    const [a, b] = twoPeople();
    const fam = pick(["dog", "car", "bike", "brother", "sister", "mother", "teacher", "phone"]);
    if (Math.random() < 0.6) return { q: `${a.n} loves ___ ${fam}.`, correct: a.his, wrong: ["his", "her", "their", "its", "your"], x: `${a.n} → ${a.his}.` };
    return { q: `${a.n} and ${b.n} visit ___ grandparents every Sunday.`, correct: "their", wrong: ["his", "her", "them", "they"], x: "Two people → their." };
  });

  const OPP = [["big", "small"], ["hot", "cold"], ["happy", "sad"], ["old", "young"], ["fast", "slow"], ["tall", "short"], ["open", "closed"], ["early", "late"], ["easy", "difficult"], ["full", "empty"], ["clean", "dirty"], ["rich", "poor"], ["strong", "weak"], ["light", "heavy"], ["day", "night"], ["up", "down"], ["good", "bad"], ["new", "old"]];
  G(1, "vocabulary", "opposites", () => {
    const pair = pick(OPP);
    const [w, o] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
    const pool = uniq(OPP.flat()).filter((x) => x !== w && x !== o);
    return { q: `The opposite of '${w}' is ___.`, correct: o, wrong: sample(pool, 3), x: `${w} ↔ ${o}` };
  });
  const CATS = {
    "a colour": ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"],
    "an animal": ["dog", "horse", "cow", "lion", "rabbit", "elephant", "monkey", "sheep"],
    "a food": ["bread", "rice", "cheese", "egg", "banana", "soup", "chicken", "pasta"],
    "a job": ["teacher", "doctor", "nurse", "farmer", "driver", "chef", "pilot", "waiter"],
    "a part of the body": ["hand", "head", "arm", "leg", "foot", "nose", "ear", "mouth"],
    "a type of transport": ["bus", "train", "car", "bike", "plane", "boat", "taxi", "tram"],
    "a piece of furniture": ["sofa", "table", "chair", "bed", "desk", "wardrobe", "shelf", "armchair"],
    "a family member": ["mother", "uncle", "aunt", "cousin", "grandfather", "daughter", "son", "nephew"]
  };
  G(1, "vocabulary", "categories", () => {
    const keys = Object.keys(CATS);
    const k = pick(keys);
    const correct = pick(CATS[k]);
    const wrong = sample(keys.filter((x) => x !== k), 3).map((c) => pick(CATS[c]));
    return { q: `Which word is ${k}?`, correct, wrong, x: `'${correct}' is ${k}.` };
  });
  G(1, "vocabulary", "calendar", () => {
    if (Math.random() < 0.5) {
      const i = rnd(7);
      const after = Math.random() < 0.5;
      const correct = DAYS[(i + (after ? 1 : 6)) % 7];
      return { q: `Which day comes ${after ? "after" : "before"} ${DAYS[i]}?`, correct, wrong: others(DAYS.filter((d) => d !== DAYS[i]), correct, 3), x: `${DAYS[i]} → ${correct}.` };
    }
    const i = rnd(12);
    return { q: `What is the ${ORD[i]} month of the year?`, correct: MONTHS[i], wrong: others(MONTHS, MONTHS[i], 3), x: `${MONTHS[i]} is month ${i + 1}.` };
  });
  G(1, "vocabulary", "everyday", () => {
    const items = [["You sleep in a ___.", "bed"], ["You cook in the ___.", "kitchen"], ["You wash your hands in the ___.", "bathroom"], ["You read a ___.", "book"], ["You drink ___ when you are thirsty.", "water"], ["You wear ___ on your feet.", "shoes"], ["You use a ___ to call people.", "phone"], ["You open a ___ to enter a room.", "door"], ["You eat soup with a ___.", "spoon"], ["You write with a ___.", "pen"]];
    const [q, c] = pick(items);
    return { q, correct: c, wrong: others(items.map((i) => i[1]), c, 3), x: "" };
  });

  G(1, "listening", "time", () => {
    const h = rnd(12) + 1;
    const ev = pick(["The meeting", "The film", "The class", "Dinner", "The party", "The bus"]);
    const half = Math.random() < 0.4;
    const audio = half ? `${ev} is at half past ${NUM[h]}.` : `${ev} is at ${NUM[h]} o'clock.`;
    const fmt = (x) => `${x}:${half ? "30" : "00"}`;
    const wrong = uniq([fmt((h % 12) + 1), fmt(((h + 10) % 12) + 1), fmt(((h + 4) % 12) + 1), half ? `${h}:00` : `${h}:30`]);
    return { q: `What time is ${ev.toLowerCase().replace(/^the /, "the ")}?`, audio, correct: fmt(h), wrong, x: "" };
  });
  G(1, "listening", "family", () => {
    const p = person();
    const b = rnd(4) + 1, s = rnd(4) + 1;
    const askB = Math.random() < 0.5;
    const audio = `${p.n} has ${NUM[b]} ${b === 1 ? "brother" : "brothers"} and ${NUM[s]} ${s === 1 ? "sister" : "sisters"}.`;
    const c = askB ? b : s;
    const wrong = uniq([askB ? s : b, c + 1, c + 2, Math.max(0, c - 1)].map(String));
    return { q: `How many ${askB ? "brothers" : "sisters"} does ${p.n} have?`, audio, correct: String(c), wrong, x: "" };
  });
  G(1, "listening", "likes", () => {
    const foods = ["fish", "coffee", "chocolate", "cheese", "tomatoes", "rice", "eggs", "milk", "bananas", "onions"];
    const [a, b] = sample(foods, 2);
    const askNot = Math.random() < 0.5;
    return { q: askNot ? "What doesn't the speaker like?" : "What does the speaker like?", audio: `I like ${a}, but I don't like ${b}.`, correct: askNot ? b : a, wrong: [askNot ? a : b].concat(others(foods.filter((f) => f !== a && f !== b), "", 2)), x: "" };
  });
  G(1, "listening", "where", () => {
    const p = person();
    const city = pick(CITIES), job = pick(JOBS);
    const askJob = Math.random() < 0.5;
    const audio = `Hi, I'm ${p.n}. I'm from ${city} and I'm ${art(job)}.`;
    return askJob
      ? { q: `What is ${p.n}'s job?`, audio, correct: cap(art(job)), wrong: others(JOBS, job, 3).map((j) => cap(art(j))) }
      : { q: `Where is ${p.n} from?`, audio, correct: city, wrong: others(CITIES, city, 3) };
  });

  G(1, "reading", "profile", () => {
    const p = person();
    const age = 18 + rnd(40), city = pick(CITIES), job = pick(JOBS);
    const RELS = ["sister", "brother", "parents", "two cats", "grandmother", "best friend"];
    const HOB = ["playing football", "cooking", "reading books", "watching films", "swimming", "drawing", "dancing", "playing the guitar"];
    const rel = pick(RELS), hobby = pick(HOB);
    const passage = `My name is ${p.n}. I am ${age} years old. I am from ${city}, but now I live in ${pick(CITIES.filter((c) => c !== city))}. I am ${art(job)}. I live with my ${rel}. In my free time, I like ${hobby}.`;
    const opts = [
      { q: `Where is ${p.n} from?`, correct: city, wrong: others(CITIES, city, 3) },
      { q: `What is ${p.n}'s job?`, correct: cap(art(job)), wrong: others(JOBS, job, 3).map((j) => cap(art(j))) },
      { q: `Who does ${p.n} live with?`, correct: `${cap(p.his)} ${rel}`, wrong: others(RELS, rel, 3).map((r) => `${cap(p.his)} ${r}`) },
      { q: `What does ${p.n} like doing?`, correct: cap(hobby), wrong: others(HOB, hobby, 3).map(cap) },
      { q: `How old is ${p.n}?`, correct: String(age), wrong: [age + 10, age + 2, age - 3].map(String) }
    ];
    return Object.assign({ passage }, pick(opts));
  });
  G(1, "reading", "notice", () => {
    const shop = pick(["The café", "The library", "The supermarket", "The swimming pool", "The bakery"]);
    const open = 7 + rnd(3), close = 5 + rnd(4);
    const closedDay = pick(DAYS);
    const passage = `${shop} is open every day from ${open}:00 in the morning to ${close}:00 in the evening. It is closed on ${closedDay}s.`;
    return Math.random() < 0.5
      ? { passage, q: `When is ${shop.toLowerCase()} closed?`, correct: `On ${closedDay}s`, wrong: others(DAYS, closedDay, 3).map((d) => `On ${d}s`) }
      : { passage, q: `What time does ${shop.toLowerCase()} open?`, correct: `${open}:00`, wrong: uniq([`${open + 1}:00`, `${close}:00`, `${open + 2}:00`, `${open - 1}:00`]) };
  });

  /* =====================================================================
     A2 — ELEMENTARY
     ===================================================================== */
  const IRREG = [["go", "went", "gone", "to the park"], ["buy", "bought", "bought", "a new bag"], ["eat", "ate", "eaten", "pizza for dinner"], ["see", "saw", "seen", "a great film"], ["write", "wrote", "written", "a long email"], ["drink", "drank", "drunk", "a lot of coffee"], ["take", "took", "taken", "the bus to work"], ["meet", "met", "met", "an old friend"], ["make", "made", "made", "a chocolate cake"], ["drive", "drove", "driven", "to the coast"], ["swim", "swam", "swum", "in the sea"], ["speak", "spoke", "spoken", "to the manager"], ["find", "found", "found", "a wallet in the street"], ["give", "gave", "given", "a speech"], ["sing", "sang", "sung", "at a wedding"], ["catch", "caught", "caught", "a cold"], ["teach", "taught", "taught", "a yoga class"], ["run", "ran", "run", "five kilometres"], ["sell", "sold", "sold", "an old car"], ["wear", "wore", "worn", "a suit"], ["break", "broke", "broken", "a glass"], ["fly", "flew", "flown", "to " + "Rome"]];
  const PAST_T = ["Yesterday", "Last week", "Two days ago", "Last night", "On Saturday", "Last summer"];
  G(2, "grammar", "pastSimple", () => {
    const v = pick(IRREG); const p = person();
    const S = pick([p.n, "I", "We", "My parents", "She", "They"]);
    return { q: `${pick(PAST_T)}, ${S} ___ ${v[3]}.`, correct: v[1], wrong: [v[0], v[2] !== v[1] ? v[2] : v[0] + "s", v[0] + "ed"], x: `${v[0]} → ${v[1]} (past simple).` };
  });
  G(2, "grammar", "pastSimple", () => {
    const v = pick(IRREG); const p = person();
    const S = pick([p.n, "I", "We", "They"]);
    return { q: `${S} didn't ___ ${v[3]} ${pick(["yesterday", "last week", "on Friday"])}.`, correct: v[0], wrong: [v[1], v[0] + (v[0].endsWith("s") || v[0].endsWith("ch") ? "es" : "s"), v[0] + "ing"], x: "didn't + base verb." };
  });
  G(2, "grammar", "pastSimple", () => {
    const v = pick(IRREG);
    return { q: `___ you ${v[0]} ${v[3]} ${pick(["yesterday", "last weekend", "on holiday"])}?`, correct: "Did", wrong: ["Do", "Were", "Have", "Was"], x: "Past simple questions: Did + subject + base verb." };
  });
  const ADJ = [["big", "bigger", "biggest"], ["small", "smaller", "smallest"], ["cheap", "cheaper", "cheapest"], ["hot", "hotter", "hottest"], ["easy", "easier", "easiest"], ["busy", "busier", "busiest"], ["expensive", "more expensive", "most expensive"], ["beautiful", "more beautiful", "most beautiful"], ["good", "better", "best"], ["bad", "worse", "worst"], ["interesting", "more interesting", "most interesting"], ["fast", "faster", "fastest"], ["comfortable", "more comfortable", "most comfortable"], ["old", "older", "oldest"], ["quiet", "quieter", "quietest"], ["dangerous", "more dangerous", "most dangerous"], ["happy", "happier", "happiest"], ["far", "further", "furthest"]];
  G(2, "grammar", "comparative", () => {
    const a = pick(ADJ);
    const pair = pick([["My new flat", "my old one"], ["This film", "the book"], ["The train", "the bus"], ["This restaurant", "the one next door"], ["Her car", "mine"], ["This city", "my home town"], ["The second exam", "the first one"]]);
    const longForm = a[1].startsWith("more");
    const irregular = ["good", "bad", "far"].includes(a[0]);
    const wrong = [longForm ? a[0] + "er" : "more " + a[0], "the " + a[2], a[0]];
    if (irregular) wrong[0] = a[0] === "good" ? "gooder" : a[0] === "bad" ? "badder" : "farer";
    return { q: `${pair[0]} is ___ (${a[0]}) than ${pair[1]}.`, correct: a[1], wrong, x: `${a[0]} → ${a[1]}.` };
  });
  G(2, "grammar", "comparative", () => {
    const a = pick(ADJ);
    const noun = pick(["hotel", "restaurant", "street", "museum", "park", "shop"]);
    const longForm = a[2].startsWith("most");
    return { q: `It's the ___ (${a[0]}) ${noun} in the city.`, correct: a[2], wrong: [a[1], longForm ? a[0] + "est" : "most " + a[0], "more " + a[0]], x: `Superlative: the ${a[2]}.` };
  });
  G(2, "grammar", "goingTo", () => {
    const S = pick([["I", "'m"], ["We", "'re"], ["They", "'re"], ["She", "'s"], ["He", "'s"]]);
    const act = pick([`visit ${pick(CITIES)}`, "buy a new car", "start a new job", "learn to swim", "paint the kitchen", "move house", "have a party"]);
    return { q: `${S[0]}${S[1]} ___ ${act} next ${pick(["week", "month", "year", "summer"])}.`, correct: "going to", wrong: ["go to", "going", "will to", "goes to"], x: "Plans: be + going to + verb." };
  });
  G(2, "grammar", "quantity", () => {
    const count = Math.random() < 0.5;
    const n = count ? pick(["books", "friends", "apples", "chairs", "eggs", "questions", "students", "tickets"]) : pick(["money", "time", "water", "milk", "sugar", "homework", "information", "bread"]);
    return { q: `How ___ ${n} do you need?`, correct: count ? "many" : "much", wrong: ["many", "much", "lot of", "a lot"], x: count ? "Countable plural → many." : "Uncountable → much." };
  });
  G(2, "grammar", "modals", () => {
    const items = [["You ___ smoke in the hospital.", "mustn't"], ["You ___ wear a seatbelt in the car.", "must"], ["You ___ pay — the museum is free.", "don't have to"], ["You ___ be quiet in the library.", "must"], ["You ___ use your phone during the exam.", "mustn't"], ["You ___ come if you don't want to.", "don't have to"], ["Students ___ bring a pen to the exam.", "must"], ["You ___ touch the paintings in the gallery.", "mustn't"], ["Tomorrow is Sunday, so I ___ get up early.", "don't have to"]];
    const [q, c] = pick(items);
    return { q, correct: c, wrong: ["must", "mustn't", "don't have to", "can"], x: { must: "must = it's necessary.", "mustn't": "mustn't = it's not allowed.", "don't have to": "don't have to = it's not necessary." }[c] };
  });
  G(2, "vocabulary", "collocations", () => {
    const L = [["a mistake", "make"], ["your homework", "do"], ["a photo", "take"], ["breakfast", "have"], ["the shopping", "do"], ["a decision", "make"], ["a taxi", "take"], ["a party", "have"], ["the dishes", "do"], ["a noise", "make"], ["exercise", "do"], ["a good time", "have"], ["friends", "make"], ["a phone call", "make"], ["the housework", "do"], ["a seat", "take"], ["an appointment", "make"], ["your best", "do"], ["medicine", "take"], ["a cake", "make"], ["a favour", "do"], ["lunch", "have"]];
    const [n, v] = pick(L);
    return { q: `Which verb goes with "${n}"?  ___ ${n}`, correct: v, wrong: ["make", "do", "take", "have"], x: `We say "${v} ${n}".` };
  });
  G(2, "vocabulary", "family", () => {
    const L = [["My mother's sister is my ___.", "aunt"], ["My father's brother is my ___.", "uncle"], ["My aunt's son is my ___.", "cousin"], ["My sister's son is my ___.", "nephew"], ["My brother's daughter is my ___.", "niece"], ["My father's father is my ___.", "grandfather"], ["My wife's mother is my ___.", "mother-in-law"], ["My sister's husband is my ___.", "brother-in-law"], ["My son's daughter is my ___.", "granddaughter"]];
    const [q, c] = pick(L);
    return { q, correct: c, wrong: others(L.map((x) => x[1]), c, 3), x: "" };
  });
  G(2, "vocabulary", "places", () => {
    const L = [["Where can you buy medicine?", "At a pharmacy"], ["Where can you borrow books?", "At a library"], ["Where can you send a parcel?", "At a post office"], ["Where can you see old paintings?", "At an art gallery"], ["Where can you catch a train?", "At a station"], ["Where can you get cash?", "At a bank"], ["Where can you watch a new film?", "At a cinema"], ["Where can you buy fresh vegetables?", "At a market"], ["Where do planes take off?", "At an airport"], ["Where can you get a haircut?", "At a hairdresser's"]];
    const [q, c] = pick(L);
    return { q, correct: c, wrong: others(L.map((x) => x[1]), c, 3), x: "" };
  });
  G(2, "listening", "price", () => {
    const pairs = { 13: 30, 14: 40, 15: 50, 16: 60, 17: 70, 18: 80, 19: 90 };
    const base = pick(Object.keys(pairs)).valueOf();
    const teen = +base, ten = pairs[base];
    const n = Math.random() < 0.5 ? teen : ten;
    const other = n === teen ? ten : teen;
    const item = pick(["ticket", "T-shirt", "book", "umbrella", "museum ticket", "lunch menu", "phone case"]);
    return { q: `How much is the ${item}?`, audio: `The ${item} costs ${numWord(n)} pounds.`, correct: `£${n}`, wrong: [`£${other}`, `£${n + 1}`, `£${n === teen ? ten + 10 : teen + 1}`], x: "Listen for the stress: thirTEEN vs THIRty." };
  });
  G(2, "listening", "train", () => {
    const h = rnd(12) + 1, m = pick([15, 30, 45]), plat = rnd(12) + 1, city = pick(CITIES);
    const mw = { 15: "fifteen", 30: "thirty", 45: "forty-five" }[m];
    const audio = `The train to ${city} leaves from platform ${NUM[plat]} at ${NUM[h]} ${mw}.`;
    if (Math.random() < 0.5) return { q: "What time does the train leave?", audio, correct: `${h}:${m}`, wrong: uniq([`${h}:${m === 15 ? 50 : 15}`, `${(h % 12) + 1}:${m}`, `${plat}:${m}`, `${h}:${m === 30 ? 13 : 30}`]) };
    return { q: "Which platform does the train leave from?", audio, correct: `Platform ${plat}`, wrong: uniq([`Platform ${h}`, `Platform ${(plat % 12) + 1}`, `Platform ${((plat + 5) % 12) + 1}`, `Platform ${plat + 10}`]) };
  });
  G(2, "listening", "transport", () => {
    const T = [["take the bus", "took the bus", "By bus"], ["drive", "drove", "By car"], ["cycle", "cycled", "By bike"], ["walk", "walked", "On foot"], ["take the train", "took the train", "By train"], ["take a taxi", "took a taxi", "By taxi"]];
    const [u, t] = sample(T, 2);
    const why = pick(["it was sunny", "it was raining", "I was late", "the buses were on strike", "my car was at the garage"]);
    return { q: "How did the speaker travel today?", audio: `I usually ${u[0]}, but today I ${t[1]} because ${why}.`, correct: t[2], wrong: [u[2]].concat(others(T.filter((x) => x !== u), t, 2, (x) => x[2])), x: "" };
  });
  G(2, "reading", "message", () => {
    const [a, b] = twoPeople();
    const ev = pick(["your birthday party", "the barbecue", "the cinema", "the football match", "dinner"]);
    const R = ["I have to work late", "my sister is visiting", "I am ill", "I have an exam the next day", "my car is broken", "I am going to a wedding"];
    const reason = pick(R);
    const [d1, d2] = sample(DAYS, 2);
    const passage = `Hi ${b.n}, thanks for the invitation! I'm really sorry, but I can't come to ${ev} on ${d1} because ${reason}. Are you free on ${d2}? Maybe we can meet for coffee. See you soon, ${a.n}`;
    return Math.random() < 0.5
      ? { passage, q: `Why can't ${a.n} come?`, correct: cap(reason.replace(/^I /, `${a.He} `).replace(/^my /, `${a.his} `).replace(/ am /, " is ").replace(/ have /, " has ")), wrong: others(R, reason, 3).map((r) => cap(r.replace(/^I /, `${a.He} `).replace(/^my /, `${a.his} `).replace(/ am /, " is ").replace(/ have /, " has "))) }
      : { passage, q: `When does ${a.n} suggest meeting?`, correct: `On ${d2}`, wrong: [`On ${d1}`].concat(others(DAYS.filter((d) => d !== d1), d2, 2).map((d) => `On ${d}`)) };
  });
  G(2, "reading", "ad", () => {
    const thing = pick([["bike", "Bike"], ["sofa", "Sofa"], ["laptop", "Laptop"], ["guitar", "Guitar"], ["desk", "Desk"]]);
    const price = 20 + rnd(16) * 5, age = 1 + rnd(5);
    const day = pick(["weekday evenings", "weekends", "mornings only"]);
    const passage = `FOR SALE: ${thing[1]}, ${NUM[age]} ${age === 1 ? "year" : "years"} old, in very good condition. Only £${price}! I'm selling it because I'm moving abroad. Call me on ${day}.`;
    const opts = [
      { q: `Why is the person selling the ${thing[0]}?`, correct: "They are moving to another country", wrong: ["It is broken", "They bought a new one", "It is too old"] },
      { q: `How much is the ${thing[0]}?`, correct: `£${price}`, wrong: [`£${price + 10}`, `£${price * 2}`, `£${price - 5}`] },
      { q: "When can you call?", correct: cap(day), wrong: others(["weekday evenings", "weekends", "mornings only", "any time"], day, 3).map(cap) }
    ];
    return Object.assign({ passage }, pick(opts));
  });

  /* =====================================================================
     B1 — INTERMEDIATE
     ===================================================================== */
  G(3, "grammar", "presentPerfect", () => {
    const useFor = Math.random() < 0.5;
    const t = useFor ? pick(["ten years", "two weeks", "a long time", "three months", "ages", "an hour", "six days"]) : pick(["2015", "Monday", "last summer", "I was a child", "January", "nine o'clock", "we met"]);
    const S = pick(["I have lived here", "She has worked there", "We have known each other", "They have been married", "He has studied English", "I haven't seen him"]);
    return { q: `${S} ___ ${t}.`, correct: useFor ? "for" : "since", wrong: ["for", "since", "ago", "during"], x: useFor ? "for + a period of time." : "since + a point in time." };
  });
  G(3, "grammar", "presentPerfect", () => {
    const p = person();
    const v = pick([["see", "saw", "seen"], ["meet", "met", "met"], ["visit", "visited", "visited"], ["call", "called", "called"], ["speak to", "spoke to", "spoken to"]]);
    const finished = Math.random() < 0.5;
    const t = finished ? pick(["yesterday", "last week", "two days ago", "in 2020", "on Monday"]) : pick(["three times this week", "twice today", "many times", "a lot recently"]);
    const correct = finished ? v[1] : "have " + v[2];
    return { q: `I ___ ${p.n} ${t}.`, correct, wrong: [finished ? "have " + v[2] : v[1], finished ? "had " + v[2] : "have " + v[0], "am " + v[0].replace(/^(\w+)/, "$1ing")], x: finished ? "Finished time → past simple." : "Unfinished time / experience → present perfect." };
  });
  G(3, "grammar", "presentPerfect", () => {
    const pp = pick([["been", "to Japan"], ["eaten", "sushi"], ["ridden", "a horse"], ["seen", "a whale"], ["climbed", "a mountain"], ["written", "a poem"], ["flown", "in a helicopter"]]);
    return { q: `Have you ever ___ ${pp[1]}?`, correct: pp[0], wrong: [{ been: "went", eaten: "ate", ridden: "rode", seen: "saw", climbed: "climb", written: "wrote", flown: "flew" }[pp[0]], { been: "be", eaten: "eat", ridden: "ride", seen: "see", climbed: "climbing", written: "write", flown: "fly" }[pp[0]], "did " + ({ been: "go", eaten: "eat", ridden: "ride", seen: "see", climbed: "climb", written: "write", flown: "fly" }[pp[0]])], x: "Have you ever + past participle?" };
  });
  G(3, "grammar", "conditionals", () => {
    const items = [["If it rains tomorrow,", "we", "stay", "at home"], ["If you heat ice,", "it", "melt", ""], ["If I see Tom,", "I", "tell", "him"], ["If she studies hard,", "she", "pass", "the exam"], ["If we leave now,", "we", "catch", "the bus"], ["If you don't hurry,", "you", "miss", "the train"], ["If they win this match,", "they", "be", "champions"]];
    const it = pick(items);
    const zero = it[0].startsWith("If you heat");
    const correct = zero ? "melts" : "will " + it[2];
    return { q: `${it[0]} ${it[1]} ___ ${it[3]}.`.replace(" .", "."), correct, wrong: zero ? ["will melting", "melted", "would melt"] : [it[2] === "be" ? "were" : it[2] + "ed", "would " + it[2], "will " + it[2] + "ing"], x: zero ? "General truth → zero conditional (present + present)." : "First conditional: If + present, will + verb." };
  });
  G(3, "grammar", "conditionals", () => {
    const items = [["hurry", "hurried", "you'll catch the bus"], ["ask", "asked", "she'll help you"], ["study", "studied", "you'll pass"], ["leave", "left", "we'll arrive on time"], ["call", "called", "I'll pick you up"]];
    const it = pick(items);
    if (Math.random() < 0.5) return { q: `If you ___ (${it[0]}), ${it[2]}.`, correct: it[0], wrong: ["will " + it[0], it[1], "would " + it[0]], x: "No 'will' in the if-clause." };
    return { q: `___ you ${it[0]}, ${it[2].replace(/'ll/, " won't").replace("won't", "won't")}`.replace(/$/, "."), correct: "Unless", wrong: ["If", "When", "Although"], x: "unless = if not." };
  });
  G(3, "grammar", "passive", () => {
    const L = [["Spanish", "speak", "spoken", "in Mexico", 1], ["These phones", "make", "made", "in China", 2], ["Millions of books", "sell", "sold", "online every year", 2], ["The museum", "visit", "visited", "by thousands of tourists every day", 1], ["Coffee", "produce", "produced", "in Brazil", 1], ["The rooms", "clean", "cleaned", "every morning", 2], ["This cheese", "make", "made", "from goat's milk", 1], ["The windows", "wash", "washed", "once a month", 2]];
    const [s, base, pp, rest, n] = pick(L);
    const be = n === 1 ? "is" : "are";
    return { q: `${s} ___ ${rest}.`, correct: `${be} ${pp}`, wrong: [n === 1 ? base + "s" : base, `${be} ${base}ing`.replace("eing", "ing"), `has ${pp}`, `${n === 1 ? "are" : "is"} ${pp}`], x: "Passive: be + past participle." };
  });
  G(3, "grammar", "gerundInf", () => {
    const ING = ["enjoyed", "finished", "avoided", "kept", "considered", "practised", "didn't mind"];
    const TO = ["decided", "hoped", "planned", "promised", "agreed", "refused", "wanted", "managed", "learned"];
    const A = [["learn Spanish", "learning Spanish"], ["travel alone", "travelling alone"], ["cook dinner", "cooking dinner"], ["play the guitar", "playing the guitar"], ["work at the weekend", "working at the weekend"], ["swim in the lake", "swimming in the lake"], ["drive to the coast", "driving to the coast"]];
    const ing = Math.random() < 0.5;
    const v = ing ? pick(ING) : pick(TO);
    const a = pick(A);
    const p = person();
    const toForm = "to " + a[0];
    return { q: `${p.n} ${v} ___.`, correct: ing ? a[1] : toForm, wrong: [ing ? toForm : a[1], a[0], "to " + a[1]], x: ing ? `'${v.replace("didn't ", "")}' is followed by -ing.` : `'${v}' is followed by to + infinitive.` };
  });
  G(3, "grammar", "reported", () => {
    const p = person();
    const L = [
      () => { const adj = pick(["tired", "hungry", "busy", "ready", "bored"]); return [`"I'm ${adj}," said ${p.n}. → ${p.n} said that ${p.he} ___ ${adj}.`, "was", ["is", "were", "has been"]]; },
      () => [`"I will call you tomorrow," said ${p.n}. → ${p.n} said ${p.he} ___ call me the next day.`, "would", ["will", "can", "is going"]],
      () => { const act = pick(["swim", "drive", "speak Italian", "cook"]); return [`"I can ${act}," said ${p.n}. → ${p.n} said ${p.he} ___ ${act}.`, "could", ["can", "will", "is able"]]; },
      () => { const t = pick(["jazz", "spicy food", "my job", "this city"]); return [`"I like ${t}," said ${p.n}. → ${p.n} said ${p.he} ___ ${t.replace("my ", p.his + " ")}.`, "liked", ["likes", "like", "is liking"]]; },
      () => [`"I'm working," said ${p.n}. → ${p.n} said ${p.he} ___ working.`, "was", ["is", "were", "has"]]
    ];
    const [q, c, w] = pick(L)();
    return { q, correct: c, wrong: w, x: "Reported speech: move the tense one step back." };
  });
  const PV1 = [["give up", "stop doing something"], ["look after", "take care of"], ["find out", "discover information"], ["get on with", "have a good relationship with"], ["look forward to", "feel excited about something in the future"], ["run out of", "have none left"], ["set up", "start a business or organisation"], ["pick up", "collect someone or something"], ["turn up", "arrive or appear"], ["break down", "stop working (a machine)"], ["grow up", "become an adult"], ["put on", "start wearing clothes"]];
  G(3, "vocabulary", "phrasal", () => {
    const [pv, def] = pick(PV1);
    if (Math.random() < 0.5) return { q: `Which phrasal verb means '${def}'?`, correct: pv, wrong: others(PV1, pv, 3, (x) => x[0]), x: `${pv} = ${def}.` };
    return { q: `What does '${pv}' mean?`, correct: cap(def), wrong: others(PV1, def, 3, (x) => cap(x[1])), x: `${pv} = ${def}.` };
  });
  G(3, "vocabulary", "wordForm", () => {
    const L = [["decide", "decision", ["decidement", "decidance", "decition"]], ["improve", "improvement", ["improval", "improvation", "improvance"]], ["develop", "development", ["developation", "developance", "develoption"]], ["explain", "explanation", ["explainment", "explaination", "explainance"]], ["arrive", "arrival", ["arrivement", "arrivation", "arrivance"]], ["choose", "choice", ["choosement", "choosion", "choosal"]], ["know", "knowledge", ["knowment", "knowance", "knowledgement"]], ["fail", "failure", ["failment", "failance", "failation"]], ["agree", "agreement", ["agreation", "agreal", "agreeness"]], ["describe", "description", ["describement", "describation", "describal"]], ["protect", "protection", ["protectment", "protectance", "protectal"]], ["refuse", "refusal", ["refusement", "refusation", "refusion"]], ["behave", "behaviour", ["behavement", "behavation", "behavance"]], ["weigh", "weight", ["weighment", "weighance", "weighth"]], ["educate", "education", ["educatement", "educatance", "educal"]]];
    const [v, n, w] = pick(L);
    return { q: `What is the noun form of '${v}'?`, correct: n, wrong: w, x: `${v} → ${n}.` };
  });
  G(3, "vocabulary", "adjPrep", () => {
    const p = person();
    const L = [["interested", "in", "history"], ["good", "at", "maths"], ["afraid", "of", "spiders"], ["proud", "of", p.his + " children"], ["worried", "about", "the exam"], ["responsible", "for", "the budget"], ["married", "to", "a doctor"], ["keen", "on", "football"], ["tired", "of", "waiting"], ["similar", "to", p.his + " brother"], ["angry", "with", p.his + " boss"], ["bored", "with", p.his + " job"]];
    const [adj, prep, obj] = pick(L);
    return { q: `${p.n} is ${adj} ___ ${obj}.`, correct: prep, wrong: others(["in", "at", "of", "about", "for", "to", "on", "with"], prep, 3), x: `${adj} + ${prep}.` };
  });
  G(3, "vocabulary", "travel", () => {
    const L = [["The flight was ___ because of the storm.", "cancelled", ["refused", "denied", "rejected"]], ["Please fasten your ___ before take-off.", "seatbelt", ["belt seat", "safety", "lock"]], ["We need to ___ in two hours before the flight.", "check", ["sign", "log", "book"]], ["The hotel was fully ___, so we stayed somewhere else.", "booked", ["filled", "reserved up", "occupied up"]], ["I bought a return ___ to Paris.", "ticket", ["fare", "trip", "voyage"]], ["Our train was ___ by forty minutes.", "delayed", ["late", "slowed", "waited"]], ["Can I see your ___ and boarding pass, please?", "passport", ["licence", "visa card", "pass card"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: "" };
  });
  G(3, "listening", "appointment", () => {
    const [d1, d2] = sample(DAYS.slice(0, 5), 2);
    const part = pick(["morning", "afternoon"]);
    return { q: "When does the speaker want to meet?", audio: `Sorry, I won't be able to make it on ${d1}. Could we move our meeting to ${d2} ${part} instead?`, correct: `${d2} ${part}`, wrong: [`${d1} ${part}`, `${d2} ${part === "morning" ? "afternoon" : "morning"}`, `${d1} ${part === "morning" ? "afternoon" : "morning"}`], x: "" };
  });
  G(3, "listening", "museum", () => {
    const t = [["eight", "8:00"], ["nine", "9:00"], ["ten", "10:00"], ["eleven", "11:00"], ["half past nine", "9:30"], ["half past ten", "10:30"]];
    const [a, b] = sample(t, 2);
    const place = pick(["museum", "swimming pool", "library", "gallery"]);
    return { q: `When does the ${place} open at the weekend?`, audio: `The ${place} opens at ${a[0]} on weekdays, but at weekends it doesn't open until ${b[0]}.`, correct: b[1], wrong: [a[1]].concat(others(t.filter((x) => x !== a), b, 2, (x) => x[1])), x: "" };
  });
  G(3, "listening", "decision", () => {
    const A = ["take the train", "drive", "fly", "stay at home", "go to the gym", "go for a run", "cook at home", "eat out", "study in the library", "watch a film"];
    const [x, y] = sample(A, 2);
    const why = pick(["it was cheaper", "the weather was terrible", "I was really tired", "a friend called me", "it was much quicker"]);
    return { q: "What did the speaker decide to do?", audio: `I was going to ${x}, but in the end I decided to ${y} because ${why}.`, correct: cap(y), wrong: [cap(x)].concat(others(A.filter((a) => a !== x), y, 2).map(cap)), x: "" };
  });
  const PROCON = [
    { t: "Living in a big city", pros: ["there are more job opportunities", "public transport is usually good"], cons: ["housing is very expensive", "it can be noisy and crowded"] },
    { t: "Working from home", pros: ["people save time on commuting", "they can organise their day flexibly"], cons: ["some workers feel isolated", "it is harder to separate work and free time"] },
    { t: "Shopping online", pros: ["it is quick and convenient", "prices are often lower"], cons: ["you cannot try things on", "returning items can be difficult"] },
    { t: "Studying abroad", pros: ["students improve their language skills quickly", "they meet people from different cultures"], cons: ["it can be very expensive", "many students feel homesick"] },
    { t: "Owning a car", pros: ["you can travel whenever you want", "it is useful for carrying heavy things"], cons: ["fuel and insurance are expensive", "finding a parking space is often hard"] },
    { t: "Using social media", pros: ["it helps people stay in touch with friends", "news spreads quickly"], cons: ["it can waste a lot of time", "some users feel worse about themselves"] },
    { t: "Living alone", pros: ["you have complete privacy", "you can make all the decisions yourself"], cons: ["you have to pay all the bills yourself", "it can feel lonely"] },
    { t: "Having a pet", pros: ["animals are good company", "dogs encourage people to exercise"], cons: ["pets need attention every day", "vet bills can be high"] }
  ];
  G(3, "reading", "proCon", () => {
    const T = pick(PROCON);
    const pros = shuffle(T.pros), cons = shuffle(T.cons);
    const passage = `${T.t} has both advantages and disadvantages. On the one hand, ${pros[0]}, and ${pros[1]}. On the other hand, ${cons[0]}. Some people also say that ${cons[1]}.`;
    const other = pick(PROCON.filter((x) => x !== T));
    if (Math.random() < 0.5) return { passage, q: "According to the text, which is a disadvantage?", correct: cap(pick(cons)), wrong: pros.map(cap).concat(cap(pick(other.pros))) };
    return { passage, q: "According to the text, which is an advantage?", correct: cap(pick(pros)), wrong: cons.map(cap).concat(cap(pick(other.cons))) };
  });
  G(3, "reading", "closure", () => {
    const place = pick(["library", "sports centre", "swimming pool", "town museum"]);
    const [d1, d2] = sample(DAYS, 2);
    const t = pick([["9 am", "9 am"], ["10 am", "10 am"], ["midday", "12 pm"]]);
    const alt = pick(["the post office", "the reception desk at the town hall", "the box outside the main door"]);
    const passage = `Please note: the ${place} will be closed from ${d1} for repairs to the roof. It will reopen on ${d2} at ${t[0]}. During this time, items can be returned to ${alt}. We apologise for any inconvenience.`;
    return Math.random() < 0.5
      ? { passage, q: `Why is the ${place} closing?`, correct: "Because the roof needs repairing", wrong: ["Because of a staff holiday", "Because it is moving to a new building", "Because of a public holiday"] }
      : { passage, q: `When will the ${place} reopen?`, correct: `On ${d2} at ${t[1]}`, wrong: [`On ${d1} at ${t[1]}`, `On ${d2} at ${t[1] === "9 am" ? "10 am" : "9 am"}`, `On ${pick(DAYS.filter((d) => d !== d1 && d !== d2))} at ${t[1]}`] };
  });

  /* =====================================================================
     B2 — UPPER-INTERMEDIATE
     ===================================================================== */
  const COND3 = [
    { i: ["leave", "left", "left", "earlier"], r: ["catch", "caught", "caught", "the train", false] },
    { i: ["study", "studied", "studied", "harder"], r: ["pass", "passed", "passed", "the exam", false] },
    { i: ["save", "saved", "saved", "more money"], r: ["buy", "bought", "bought", "the house", false] },
    { i: ["set", "set", "set", "an alarm"], r: ["oversleep", "overslept", "overslept", "", true] },
    { i: ["take", "took", "taken", "an umbrella"], r: ["get", "got", "got", "wet", true] },
    { i: ["know", "knew", "known", "about the party"], r: ["come", "came", "come", "", false] },
    { i: ["check", "checked", "checked", "the map"], r: ["get", "got", "got", "lost", true] },
    { i: ["book", "booked", "booked", "a table"], r: ["wait", "waited", "waited", "so long", true] },
    { i: ["listen", "listened", "listened", "to the advice"], r: ["make", "made", "made", "that mistake", true] }
  ];
  G(4, "grammar", "cond3", () => {
    const c = pick(COND3);
    const p = person();
    const [S, s] = Math.random() < 0.5 ? ["I", "I"] : [p.n, p.he];
    const would = c.r[4] ? "wouldn't" : "would";
    const res = `${would} have ${c.r[2]} ${c.r[3]}`.trim();
    if (Math.random() < 0.5) return { q: `If ${S} ___ ${c.i[3]}, ${s} ${res}.`, correct: `had ${c.i[2]}`, wrong: [`would have ${c.i[2]}`, c.i[1], `has ${c.i[2]}`], x: "Third conditional: If + had + past participle." };
    return { q: `If ${S} had ${c.i[2]} ${c.i[3]}, ${s} ___ ${c.r[3]}.`.replace(" .", "."), correct: `${would} have ${c.r[2]}`, wrong: [`${would} ${c.r[0]}`, `${c.r[4] ? "won't" : "will"} ${c.r[0]}`, `${c.r[4] ? "hadn't" : "had"} ${c.r[2]}`], x: "Third conditional: would have + past participle." };
  });
  G(4, "grammar", "wish", () => {
    const L = [["I don't have a car.", "I wish I ___ a car.", "had", ["have", "would have", "am having"]], ["I can't speak Japanese.", "I wish I ___ speak Japanese.", "could", ["can", "will", "would"]], ["I live far from my family.", "I wish I ___ closer to my family.", "lived", ["live", "am living", "will live"]], ["It's raining again.", "I wish it ___ raining.", "wasn't", ["isn't", "won't be", "doesn't"]], ["I didn't study for the test.", "I wish I ___ for the test.", "had studied", ["studied", "have studied", "would study"]], ["I ate too much at dinner.", "I wish I ___ so much.", "hadn't eaten", ["didn't eat", "haven't eaten", "wouldn't eat"]], ["I sold my old guitar.", "I wish I ___ my old guitar.", "hadn't sold", ["didn't sell", "haven't sold", "don't sell"]], ["I missed the concert.", "If only I ___ the concert!", "hadn't missed", ["didn't miss", "haven't missed", "won't miss"]], ["I forgot her birthday.", "I wish I ___ her birthday.", "hadn't forgotten", ["didn't forget", "haven't forgotten", "wouldn't forget"]], ["My neighbour plays loud music every night.", "I wish my neighbour ___ playing loud music.", "would stop", ["stops", "will stop", "has stopped"]], ["I'm always so busy.", "I wish I ___ more free time.", "had", ["have", "will have", "having"]]];
    const [f, q, c, w] = pick(L);
    return { q: `${f} ${q}`, correct: c, wrong: w, x: "wish + past = present regret; wish + past perfect = past regret; wish + would = annoyance." };
  });
  G(4, "grammar", "pastPerfect", () => {
    const p = person();
    const E = [["the cinema", "the film", "started"], ["the station", "the train", "left"], ["the office", "the meeting", "finished"], ["the shop", "the shop", "closed"], ["the party", "most guests", "gone home"], ["the restaurant", "the kitchen", "closed"]];
    const [place, ev, pp] = pick(E);
    const base = { started: "start", left: "leave", finished: "finish", closed: "close", "gone home": "go home" }[pp];
    return { q: `When ${p.n} arrived at ${place}, ${ev} ___.`, correct: `had already ${pp}`, wrong: [`has already ${pp}`, `already ${base}s`.replace("go homes", "goes home"), `was already ${base}`], x: "An action before another past action → past perfect." };
  });
  G(4, "grammar", "reportingVerbs", () => {
    const p = person();
    const ingVerbs = ["denied", "admitted", "suggested", "recommended", "avoided"];
    const toVerbs = ["refused", "promised", "agreed", "offered", "threatened"];
    if (Math.random() < 0.5) {
      const act = pick(["taking the money", "breaking the window", "eating the cake", "reading the email", "losing the keys"]);
      return { q: `${p.n} ___ ${act}.`, correct: pick(ingVerbs), wrong: sample(toVerbs, 3), x: "deny / admit / suggest / recommend / avoid + -ing." };
    }
    const act = pick(["to help me", "to pay for dinner", "to lend me the car", "to call the police", "to work late"]);
    return { q: `${p.n} ___ ${act}.`, correct: pick(toVerbs), wrong: sample(ingVerbs, 3), x: "refuse / promise / agree / offer / threaten + to-infinitive." };
  });
  G(4, "grammar", "reportedQ", () => {
    const p = person();
    const L = [["Where do you live?", "where I lived", ["where did I live", "where do I live", "where I did live"]], ["What are you doing?", "what I was doing", ["what was I doing", "what am I doing", "what did I do"]], ["Have you finished the report?", "if I had finished the report", ["had I finished the report", "did I finish the report", "if had I finished the report"]], [`Can you help me?`, `if I could help ${p.him}`, [`could I help ${p.him}`, `can I help ${p.him}`, `if could I help ${p.him}`]], ["Why did you leave early?", "why I had left early", ["why did I leave early", "why had I left early", "why I did leave early"]], ["When will the train arrive?", "when the train would arrive", ["when would the train arrive", "when will the train arrive", "when did the train arrive"]], ["Are you coming to the party?", "whether I was coming to the party", ["was I coming to the party", "whether was I coming to the party", "that I was coming to the party"]]];
    const [dq, c, w] = pick(L);
    return { q: `${p.n} asked me: "${dq}" → ${p.n} asked me ___.`, correct: c, wrong: w, x: "Reported questions use statement word order, with no do/does/did." };
  });
  const PV2 = [["call off", "cancel"], ["put off", "postpone"], ["turn down", "refuse an offer"], ["bring up", "mention a topic"], ["carry out", "perform or complete a task"], ["come up with", "think of an idea or plan"], ["look into", "investigate"], ["point out", "draw attention to a fact"], ["set off", "start a journey"], ["take over", "gain control of"], ["run into", "meet by chance"], ["make up", "invent a story or excuse"], ["get over", "recover from"], ["back up", "support someone's claim"]];
  G(4, "vocabulary", "phrasal", () => {
    const [pv, def] = pick(PV2);
    if (Math.random() < 0.5) return { q: `Which phrasal verb means '${def}'?`, correct: pv, wrong: others(PV2, pv, 3, (x) => x[0]), x: `${pv} = ${def}.` };
    return { q: `What does '${pv}' mean?`, correct: cap(def), wrong: others(PV2, def, 3, (x) => cap(x[1])), x: `${pv} = ${def}.` };
  });
  G(4, "vocabulary", "collocations", () => {
    const L = [["The jury took hours to ___ a verdict.", "reach", ["make", "do", "take"]], ["Please ___ attention to the safety instructions.", "pay", ["make", "do", "take"]], ["We need to ___ into account the cost of transport.", "take", ["make", "put", "bring"]], ["The campaign aims to ___ awareness of the disease.", "raise", ["rise", "lift", "grow"]], ["It's ___ unlikely that the plan will succeed.", "highly", ["strongly", "heavily", "greatly"]], ["She was ___ disappointed by the result.", "bitterly", ["heavily", "strongly", "highly"]], ["There was ___ rain all night.", "heavy", ["strong", "big", "thick"]], ["I always drink ___ coffee in the morning.", "strong", ["heavy", "hard", "powerful"]], ["We worked late to ___ the deadline.", "meet", ["reach", "arrive", "do"]], ["The company ___ a profit for the first time last year.", "made", ["did", "took", "won"]], ["He ___ a crucial role in the negotiations.", "played", ["made", "did", "took"]], ["The government has ___ steps to reduce pollution.", "taken", ["made", "done", "put"]], ["Doctors are ___ concerned about the rise in cases.", "deeply", ["strongly", "heavily", "widely"]], ["Let's try to ___ a compromise.", "reach", ["arrive", "get", "do"]], ["Could you ___ me a favour?", "do", ["make", "give", "take"]], ["The new law will come into ___ next month.", "force", ["action", "place", "work"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: `Collocation: "${q.replace("___", c)}"` };
  });
  G(4, "vocabulary", "prefixes", () => {
    const L = [["possible", "im"], ["patient", "im"], ["legal", "il"], ["regular", "ir"], ["honest", "dis"], ["comfortable", "un"], ["responsible", "ir"], ["mature", "im"], ["visible", "in"], ["formal", "in"], ["likely", "un"], ["polite", "im"], ["logical", "il"], ["relevant", "ir"], ["satisfied", "dis"], ["correct", "in"], ["convenient", "in"], ["employed", "un"], ["loyal", "dis"], ["literate", "il"]];
    const [w, pre] = pick(L);
    const wrong = others(["un", "in", "im", "il", "ir", "dis"], pre, 3).map((p) => p + w);
    return { q: `What is the opposite of '${w}'?`, correct: pre + w, wrong, x: `${w} → ${pre}${w}.` };
  });
  G(4, "listening", "attitude", () => {
    const topic = pick(["moving the office", "the new marketing plan", "hiring more staff", "changing suppliers", "launching the product early", "the new timetable"]);
    const A = [
      [`Although ${topic} has some merit, I'm not convinced the figures add up, so I'd rather we looked at it again before deciding.`, "Cautiously sceptical"],
      [`I couldn't agree more. ${cap(topic)} is exactly what we need right now, and I'll support it all the way.`, "Enthusiastically supportive"],
      [`Frankly, I don't see any point in ${topic}. It's a complete waste of time and money.`, "Strongly opposed"],
      [`Honestly, whatever you decide about ${topic} is fine with me. I really don't mind either way.`, "Indifferent"]
    ];
    const [audio, c] = pick(A);
    return { q: `What is the speaker's attitude to ${topic}?`, audio, correct: c, wrong: A.map((a) => a[1]), x: "" };
  });
  G(4, "listening", "contrast", () => {
    const L = [["hotel", "The hotel was quite expensive and the room was small, but the staff were absolutely wonderful.", "The staff", ["The price", "The room", "The location"]], ["course", "The course was harder than I expected and the classroom was cold, but the teacher was brilliant.", "The teacher", ["The difficulty", "The classroom", "The timetable"]], ["concert", "The tickets were overpriced and the venue was crowded, but the band were fantastic.", "The band", ["The tickets", "The venue", "The crowd"]], ["new job", "The salary isn't great and the commute is long, but my colleagues are really supportive.", "The colleagues", ["The salary", "The commute", "The hours"]], ["restaurant", "Service was slow and it was very noisy, but honestly, the food was the best I've had all year.", "The food", ["The service", "The atmosphere", "The prices"]]];
    const [thing, audio, c, w] = pick(L);
    return { q: `What did the speaker like most about the ${thing}?`, audio, correct: c, wrong: w, x: "" };
  });
  G(4, "reading", "critics", () => {
    const L = [
      { p: "Urban planners increasingly see parks as essential infrastructure rather than a luxury. Studies link access to green space with lower stress and cleaner air.", c: "New parks can push up nearby property prices and force out existing residents", w: ["Parks increase air pollution", "Parks are rarely used by residents", "Parks reduce the number of local jobs"] },
      { p: "A growing number of companies are trialling a four-day working week. Early results suggest employees are happier and just as productive.", c: "The model may not suit industries that need constant cover, such as healthcare", w: ["Employees become less productive", "Workers dislike having more free time", "It always doubles company costs"] },
      { p: "Governments are offering incentives to encourage drivers to switch to electric cars, which produce no exhaust emissions in cities.", c: "Producing the batteries requires mining that can damage the environment", w: ["Electric cars are slower than petrol cars", "Nobody wants to buy them", "They produce more exhaust emissions"] },
      { p: "Universities are offering more degrees entirely online. This makes education accessible to people who cannot relocate or study full-time.", c: "Students may miss out on the networking and support of a physical campus", w: ["Online courses are always more expensive", "Online degrees take twice as long", "Teachers refuse to teach online"] },
      { p: "Many small towns depend heavily on tourism. Visitors bring money that supports local businesses and jobs.", c: "Too many tourists can drive up rents and change the character of a place", w: ["Tourists rarely spend any money", "Tourism creates no jobs", "Small towns cannot attract visitors"] },
      { p: "Companies are rapidly introducing AI tools into everyday office tasks. Supporters argue that this frees employees from repetitive work.", c: "Workers may lose important skills if they rely too heavily on automated tools", w: ["AI tools are too expensive to install", "Employees refuse to use computers", "AI makes repetitive work more common"] },
      { p: "Many schools have banned mobile phones during the school day. Teachers report fewer distractions and more conversation between pupils.", c: "Some parents worry they cannot contact their children in an emergency", w: ["Pupils talk to each other less", "Teachers want phones in every lesson", "The ban has increased distractions"] }
    ];
    const t = pick(L);
    return { passage: `${t.p} Critics, however, point out that ${t.c.charAt(0).toLowerCase() + t.c.slice(1)}.`, q: "What concern do critics raise?", correct: t.c, wrong: t.w, x: "Look for the signal words 'Critics, however, …'." };
  });

  /* =====================================================================
     C1 — ADVANCED
     ===================================================================== */
  G(5, "grammar", "inversion", () => {
    const S = pick(["I", "we", "they"]);
    const be = S === "I" ? "was" : "were";
    const L = [
      ["Never ___ such a beautiful view.", `have ${S} seen`, [`${S} have seen`, `${S} saw`, `did ${S} saw`]],
      ["Rarely ___ such kindness from strangers.", `do ${S} experience`, [`${S} experience`, `${S} do experience`, `experience ${S}`]],
      [`Not only ___ late, but ${S} also forgot the tickets.`, `${be} ${S}`, [`${S} ${be}`, `did ${S} be`, `${S} did`]],
      ["Hardly ___ home when the phone rang.", `had ${S} arrived`, [`${S} had arrived`, `did ${S} arrive`, `${S} arrived`]],
      ["No sooner ___ down than it started to rain.", `had ${S} sat`, [`${S} had sat`, `did ${S} sit`, `${S} sat`]],
      ["Only after the meeting had ended ___ the truth.", `did ${S} learn`, [`${S} learned`, `${S} did learn`, `learned ${S}`]],
      ["Little ___ that the plan would fail.", `did ${S} know`, [`${S} knew`, `${S} did know`, `knew ${S}`]],
      ["Not until much later ___ how serious the problem was.", `did ${S} realise`, [`${S} realised`, `${S} did realise`, `realised ${S}`]],
      ["Seldom ___ with such a talented team.", `have ${S} worked`, [`${S} have worked`, `${S} worked`, `did ${S} worked`]],
      ["Under no circumstances ___ the door to strangers.", "should you open", ["you should open", "you open", "open you"]]
    ];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: "A negative or limiting adverbial at the start → auxiliary + subject (inversion)." };
  });
  G(5, "grammar", "invertedCond", () => {
    const L = [["___ I known about the delay, I would have taken a later train.", "Had"], ["___ you need any help, please call me.", "Should"], ["___ it not for your help, I would still be lost.", "Were"], ["___ the government to raise taxes, there would be protests.", "Were"], ["___ we left earlier, we would have avoided the traffic.", "Had"], ["___ anyone ask, tell them I'm in a meeting.", "Should"], ["___ it not been for the rain, the match would have finished.", "Had"], ["___ you require further information, do not hesitate to contact us.", "Should"], ["___ I in your position, I would accept the offer.", "Were"]];
    const [q, c] = pick(L);
    return { q, correct: c, wrong: ["Had", "Should", "Were", "Did"], x: { Had: "Had + subject = If + subject + had.", Should: "Should + subject = If + subject + happens to.", Were: "Were + subject = If + subject + were." }[c] };
  });
  G(5, "grammar", "unreal", () => {
    const p = person();
    const L = [["It's high time we ___ home.", "went", ["go", "will go", "have gone"]], [`It's high time ${p.n} ___ a job.`, "got", ["gets", "will get", "is getting"]], ["I'd rather you ___ smoke in here.", "didn't", ["don't", "won't", "not"]], ["I'd rather you ___ me the truth.", "told", ["tell", "will tell", "telling"]], ["It's about time the council ___ the roads.", "repaired", ["repairs", "will repair", "repair"]], ["I'd rather we ___ the meeting until Friday.", "postponed", ["postpone", "will postpone", "postponing"]], ["Suppose you ___ the lottery — what would you do?", "won", ["win", "will win", "had won"]], ["He talks as if he ___ the boss.", "were", ["is being", "will be", "be"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: "After 'It's high time', 'I'd rather (someone)', 'suppose', 'as if' → past form for present/future meaning." };
  });
  G(5, "grammar", "cleft", () => {
    const p = person();
    const L = [["___ I need right now is a long holiday.", "What", ["That", "Which", "It"]], [`It was ${p.n} ___ found the solution.`, "who", ["what", "which", "whose"]], ["___ was only when I got home that I noticed.", "It", ["What", "That", "There"]], ["All I want ___ some peace and quiet.", "is", ["are", "be", "am"]], ["The reason ___ I called is to apologise.", "why", ["what", "which", "because"]], ["What annoys me ___ the constant noise.", "is", ["are", "it is", "that"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: "Cleft sentences focus on one part of the sentence." };
  });
  const C1W = [
    ["impasse", "n", "a situation in which no progress is possible", null],
    ["tenuous", "adj", "very weak or slight", "The link between the two events is ___ at best."],
    ["undermine", "v", "gradually weaken", "Constant criticism can ___ a person's confidence."],
    ["unprecedented", "adj", "never having happened before", "Demand for the product has been ___."],
    ["scrutiny", "n", "close, critical examination", "The minister's expenses came under intense ___."],
    ["ubiquitous", "adj", "found everywhere", "Smartphones have become ___ in modern life."],
    ["meticulous", "adj", "showing great attention to detail", "She kept ___ records of every transaction."],
    ["ambivalent", "adj", "having mixed feelings", "He felt ___ about moving abroad: excited but anxious."],
    ["pragmatic", "adj", "dealing with things in a practical way", "We need a solution that is ___, not idealistic."],
    ["alleviate", "v", "make less severe", "The medicine helped to ___ the pain."],
    ["exacerbate", "v", "make worse", "Cutting staff will only ___ the problem."],
    ["inherent", "adj", "existing as a natural, permanent part", "There are risks ___ in any investment."],
    ["plausible", "adj", "seeming reasonable or probable", "Her explanation sounded perfectly ___."],
    ["conducive", "adj", "helping something to happen", "A quiet room is ___ to studying."],
    ["detrimental", "adj", "harmful", "Lack of sleep is ___ to your health."],
    ["viable", "adj", "capable of working successfully", "Is the plan financially ___?"],
    ["substantiate", "v", "provide evidence to support", "He couldn't ___ his claims."],
    ["scrutinise", "v", "examine very carefully", "Auditors will ___ every invoice."],
    ["discrepancy", "n", "a difference between things that should match", "There was a ___ between the two reports."],
    ["deteriorate", "v", "become progressively worse", "His health began to ___ rapidly."],
    ["tentative", "adj", "not certain or fixed", "We reached a ___ agreement, subject to approval."],
    ["mitigate", "v", "make less severe or serious", "Steps were taken to ___ the impact of the floods."]
  ];
  const vocabGen = (W) => () => {
    const w = pick(W);
    const samePos = W.filter((x) => x[1] === w[1] && x[0] !== w[0]);
    if (w[3] && samePos.length >= 3 && Math.random() < 0.55) return { q: w[3], correct: w[0], wrong: sample(samePos, 3).map((x) => x[0]), x: `${w[0]} = ${w[2]}.` };
    if (Math.random() < 0.5) return { q: `Which word means '${w[2]}'?`, correct: w[0], wrong: sample(samePos.length >= 3 ? samePos : W.filter((x) => x !== w), 3).map((x) => x[0]), x: `${w[0]} = ${w[2]}.` };
    return { q: `What does '${w[0]}' mean?`, correct: cap(w[2]), wrong: sample(W.filter((x) => x !== w), 3).map((x) => cap(x[2])), x: `${w[0]} = ${w[2]}.` };
  };
  G(5, "vocabulary", "advancedVocab", vocabGen(C1W));
  G(5, "vocabulary", "hedging", () => {
    const pairs = [["screen time", "poor sleep"], ["coffee", "heart disease"], ["social media", "anxiety"], ["regular exercise", "better memory"], ["remote work", "higher productivity"], ["air pollution", "asthma"], ["sugar", "hyperactivity in children"]];
    const [x, y] = pick(pairs);
    const hedged = pick([`${cap(x)} may contribute to ${y}.`, `There is some evidence that ${x} may be linked to ${y}.`, `${cap(x)} appears to be associated with ${y}.`, `It is possible that ${x} plays a role in ${y}.`]);
    return { q: "Which sentence is most appropriately hedged for an academic essay?", correct: hedged, wrong: [`${cap(x)} definitely causes ${y}.`, `It is obvious that ${x} causes ${y}.`, `Everyone knows ${x} leads to ${y}.`], x: "Hedging (may, appears, some evidence) makes a claim cautious and academic." };
  });
  G(5, "vocabulary", "hedging", () => {
    const L = [["The minister is ___ to have resigned, though this has not been confirmed.", "thought", ["thinking", "think", "thinks"]], ["There is some evidence to ___ that the policy has worked.", "suggest", ["prove", "show clearly", "confirm absolutely"]], ["The results ___ to contradict earlier studies.", "appear", ["appearing", "are appearing", "appeared being"]], ["It could be ___ that the reforms came too late.", "argued", ["arguing", "argue", "argument"]], ["The findings are, at this stage, ___.", "inconclusive", ["indisputable", "undeniable", "definitive"]], ["These data would ___ to support the hypothesis.", "seem", ["seeming", "seemed", "seems"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: "Academic hedging language." };
  });
  G(5, "listening", "notThatBut", () => {
    const L = [["the idea is bad", "the timing is completely wrong", "The timing is wrong", ["The idea is bad", "The cost is too high", "The team is too small"]], ["the data are wrong", "the conclusions go well beyond the evidence", "The conclusions overreach the evidence", ["The data are incorrect", "There is too little data", "The report is too long"]], ["I don't trust the team", "they simply haven't been given enough resources", "The team lacks resources", ["The team can't be trusted", "The team is too large", "The project is already finished"]], ["the proposal isn't ambitious", "it hasn't been costed properly", "The costs haven't been worked out properly", ["It lacks ambition", "It is too detailed", "It has already been approved"]], ["customers don't like the product", "most of them simply don't know it exists", "Customers are unaware of the product", ["Customers dislike the product", "The product is too cheap", "The product has been withdrawn"]], ["the new system is too difficult", "staff were never properly trained to use it", "Staff were not trained properly", ["The system is too difficult", "The system is too expensive", "Staff refused to use it"]]];
    const [a, b, c, w] = pick(L);
    return { q: "What is the speaker's main concern?", audio: `To be honest, it's not that ${a}; it's that ${b}.`, correct: c, wrong: w, x: "'It's not that A; it's that B' — the real point is B." };
  });
  G(5, "listening", "noCircumstances", () => {
    const x = pick(["passengers leave their luggage unattended", "visitors feed the animals", "employees share their passwords", "students use their phones during the exam", "guests smoke in the rooms", "swimmers dive into the shallow end"]);
    return { q: "What does the announcement mean?", audio: `Please note: under no circumstances should ${x}.`, correct: "This is never allowed", wrong: ["This is allowed in some situations", "This is recommended", "This is required"], x: "Under no circumstances = never." };
  });
  G(5, "reading", "counterView", () => {
    const L = [
      { p: "Multitasking is often celebrated as an essential skill in the modern workplace. Yet a growing body of research suggests that what we call multitasking is in fact rapid task-switching, and that each switch carries a hidden cost in attention and accuracy.", c: "Multitasking may reduce performance rather than improve it", w: ["Multitasking is an essential modern skill", "Research proves people can focus on two tasks at once", "Task-switching has no effect on accuracy"] },
      { p: "Nostalgia was once classified as a medical disorder, a kind of homesickness that could even prove fatal. Contemporary psychologists, by contrast, tend to view it as a resource: recalling cherished memories appears to boost mood and strengthen social connection.", c: "Views of nostalgia have shifted from harmful to beneficial", w: ["Nostalgia is still classified as a dangerous disorder", "Psychologists recommend avoiding old memories", "Nostalgia has no effect on mood"] },
      { p: "Choice is widely assumed to be liberating: the more options we have, the freer we feel. Studies of consumer behaviour, however, indicate that an abundance of options can lead to paralysis and lower satisfaction, as people worry they have not chosen the best alternative.", c: "Having too many options can make people less satisfied", w: ["More choice always makes people happier", "Consumers prefer having no choice at all", "Studies show choice has no effect on satisfaction"] },
      { p: "Boredom is generally regarded as something to be eliminated, and smartphones make it easier than ever to do so. Some researchers argue, though, that periods of unstimulated thought allow the mind to wander productively, fostering creative insights.", c: "Boredom may encourage creative thinking", w: ["Boredom should always be avoided", "Smartphones increase creativity", "The mind cannot wander productively"] },
      { p: "In some business cultures, a failed start-up permanently damages a founder's reputation. In others, failure is treated almost as a credential — evidence of experience that investors actively look for when deciding whom to back.", c: "Attitudes to business failure differ between cultures", w: ["Failure always ends an entrepreneur's career", "Investors everywhere avoid founders who have failed", "Failure is viewed the same way in all cultures"] },
      { p: "Confirmation bias is often portrayed as a flaw of the uninformed. Yet research suggests that highly educated people may be more susceptible in certain areas, precisely because they are skilled at constructing sophisticated justifications for conclusions they have already reached.", c: "Education can make people better at justifying what they already believe", w: ["Educated people are immune to bias", "Confirmation bias only affects the uninformed", "Research on bias is unreliable"] }
    ];
    const t = pick(L);
    return { passage: t.p, q: "What point does the writer make?", correct: t.c, wrong: t.w, x: "Words like 'Yet', 'however' and 'by contrast' introduce the writer's real point." };
  });

  /* =====================================================================
     C2 — PROFICIENT
     ===================================================================== */
  G(6, "grammar", "subjunctive", () => {
    const p = person();
    const frame = pick(["It is essential that", "It is vital that", "It is imperative that", "It is crucial that", "The rules require that", "The board insists that", "We recommend that"]);
    const V = [["attend", "attends", "attended", "the meeting"], ["submit", "submits", "submitted", "the report by Friday"], ["be", "is", "was", "informed immediately"], ["arrive", "arrives", "arrived", "on time"], ["sign", "signs", "signed", "the contract in person"], ["leave", "leaves", "left", "the building immediately"], ["receive", "receives", "received", "full compensation"]];
    const v = pick(V);
    return { q: `${frame} ${p.n} ___ ${v[3]}. (formal)`, correct: v[0], wrong: [v[1], v[2], "will " + v[0]], x: "Mandative subjunctive: base form for every person (formal style)." };
  });
  G(6, "grammar", "fixedExpr", () => {
    const L = [["___ that as it may, the decision stands.", "Be", ["So", "If", "Should"]], ["Suffice it to ___ that the meeting was a disaster.", "say", ["tell", "speak", "state"]], ["Come what ___, we will finish on time.", "may", ["might", "will", "can"]], ["We will work through the night, if need ___.", "be", ["is", "being", "been"]], ["If that's what you want, so ___ it.", "be", ["is", "let", "will"]], ["Far be it from me to ___ you how to live your life.", "tell", ["telling", "told", "say"]], ["Woe ___ anyone who arrives late.", "betide", ["befall", "bestow", "behold"]], ["Much as I ___ your offer, I must decline.", "appreciate", ["am appreciating", "appreciated", "would appreciate"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: `Fixed expression: "${q.replace("___", c)}"` };
  });
  G(6, "grammar", "emphatic", () => {
    const L = [["So severe ___ the storm that all flights were cancelled.", "was", ["were", "had", "did"]], ["Such ___ the noise that nobody could sleep.", "was", ["is", "had", "did"]], ["Only by working together ___ solve this crisis.", "can we", ["we can", "we could", "do we can"]], ["Not once ___ thank us for our help.", "did she", ["she did", "she", "has she did"]], ["Little ___ that the decision would change everything.", "did they realise", ["they realised", "realised they", "they did realise"]], ["Nowhere ___ such hospitality as in that village.", "have I encountered", ["I have encountered", "I encountered", "encountered I"]], ["So great was his influence ___ few dared to disagree.", "that", ["which", "as", "so"]]];
    const [q, c, w] = pick(L);
    return { q, correct: c, wrong: w, x: "Emphatic fronting with inversion." };
  });
  const C2W = [
    ["equivocation", "n", "the use of vague language to avoid committing yourself", "Her answer was a masterclass in ___: it sounded clear but committed to nothing."],
    ["tacit", "adj", "understood without being stated", "There was a ___ agreement not to mention the incident."],
    ["tarnish", "v", "damage the reputation of", "The scandal will ___ his legacy."],
    ["gratuitous", "adj", "unnecessary and unjustified", "The film was criticised for its ___ violence."],
    ["perfunctory", "adj", "done with minimum effort or care", "He gave the document a ___ glance before signing."],
    ["recalcitrant", "adj", "stubbornly uncooperative", "The ___ pupil refused to follow any instructions."],
    ["sanguine", "adj", "optimistic, especially in a difficult situation", "Despite the losses, she remained ___ about the future."],
    ["laconic", "adj", "using very few words", "His ___ reply — 'No.' — ended the discussion."],
    ["esoteric", "adj", "understood by only a small group", "The lecture was too ___ for a general audience."],
    ["insidious", "adj", "gradually and secretly harmful", "Stress can have an ___ effect on health."],
    ["vacillate", "v", "keep changing your mind", "Voters continued to ___ between the two candidates."],
    ["magnanimous", "adj", "generous towards a rival or someone less powerful", "She was ___ in victory, praising her opponent."],
    ["obsequious", "adj", "excessively eager to please", "The waiter's ___ manner made us uncomfortable."],
    ["pernicious", "adj", "having a harmful effect, especially gradually", "The ___ influence of misinformation is hard to measure."],
    ["ephemeral", "adj", "lasting a very short time", "Fame on social media is often ___."],
    ["intransigent", "adj", "refusing to change your views", "Both sides remained ___, so talks collapsed."],
    ["obfuscate", "v", "make something deliberately unclear", "The report seemed designed to ___ rather than inform."],
    ["disparage", "v", "speak about someone as unimportant or bad", "It's unprofessional to ___ your competitors."],
    ["ameliorate", "v", "make something bad better", "New measures aim to ___ living conditions."],
    ["prescient", "adj", "knowing about events before they happen", "Her ___ warnings were ignored until it was too late."],
    ["commensurate", "adj", "corresponding in size or degree", "Pay will be ___ with experience."],
    ["cogent", "adj", "clear, logical and convincing", "She presented a ___ argument for reform."]
  ];
  G(6, "vocabulary", "advancedVocab", vocabGen(C2W));
  G(6, "vocabulary", "connotation", () => {
    const sets = [["frugal", "stingy", "miserly", "tight-fisted"], ["confident", "arrogant", "conceited", "smug"], ["curious", "nosy", "prying", "meddlesome"], ["slim", "skinny", "scrawny", "bony"], ["determined", "stubborn", "obstinate", "pig-headed"], ["assertive", "pushy", "bossy", "domineering"], ["youthful", "childish", "immature", "juvenile"], ["relaxed", "lazy", "idle", "slothful"], ["innovative", "gimmicky", "newfangled", "faddish"], ["thrifty", "penny-pinching", "mean", "parsimonious"], ["inquisitive", "nosy", "snooping", "intrusive"]];
    const s = pick(sets);
    return { q: "Which word has the most positive connotation?", correct: s[0], wrong: s.slice(1), x: `'${s[0]}' is complimentary; the others are critical.` };
  });
  const IDIOMS = [["a red herring", "something that misleads or distracts"], ["bite the bullet", "force yourself to do something unpleasant"], ["cut corners", "do something badly to save time or money"], ["the elephant in the room", "an obvious problem nobody wants to discuss"], ["a Pyrrhic victory", "a win that costs so much it is hardly worth it"], ["toe the line", "follow the rules or official policy"], ["a moot point", "a question that is debatable or no longer relevant"], ["play devil's advocate", "argue the opposite view to test an argument"], ["a double-edged sword", "something with both advantages and disadvantages"], ["beat around the bush", "avoid talking directly about something"], ["a storm in a teacup", "a lot of fuss about something unimportant"], ["sit on the fence", "avoid choosing a side"], ["go back to the drawing board", "start planning again from the beginning"], ["the tip of the iceberg", "a small visible part of a much bigger problem"], ["a blessing in disguise", "something that seems bad but turns out well"]];
  G(6, "vocabulary", "idioms", () => {
    const [i, m] = pick(IDIOMS);
    if (Math.random() < 0.5) return { q: `What does '${i}' mean?`, correct: cap(m), wrong: others(IDIOMS, m, 3, (x) => cap(x[1])), x: `${i} = ${m}.` };
    return { q: `Which idiom means '${m}'?`, correct: i, wrong: others(IDIOMS, i, 3, (x) => x[0]), x: `${i} = ${m}.` };
  });
  G(6, "listening", "forgiven", () => {
    const x = pick(["the policy was an unqualified success", "the merger was a triumph", "the campaign changed public opinion", "the reforms reduced inequality", "the new treatment was effective"]);
    const y = pick(["a closer look at the figures paints a far more ambivalent picture", "the evidence tells a rather different story", "the details suggest otherwise"]);
    return { q: "What does the speaker imply?", audio: `One might be forgiven for assuming ${x}, though ${y}.`, correct: "The common assumption is questionable", wrong: ["The assumption is certainly correct", "Nobody has examined the evidence", "The speaker fully agrees with the assumption"], x: "'One might be forgiven for assuming…' signals that the assumption is wrong or doubtful." };
  });
  G(6, "listening", "farFrom", () => {
    const L = [["settling the matter", "the ruling has merely shifted the dispute to parliament", "It moved the dispute elsewhere", ["It ended the dispute", "It was made by parliament", "It was widely celebrated"]], ["reducing costs", "the new system has actually increased them", "It increased costs", ["It reduced costs", "It had no effect on costs", "It was never introduced"]], ["calming the markets", "the announcement triggered a further sell-off", "It made the markets more unstable", ["It calmed the markets", "It had no effect on the markets", "It was not announced"]], ["uniting the party", "the speech exposed deep divisions", "It revealed divisions", ["It united the party", "It was not well attended", "It ended the party"]], ["being a setback", "the delay gave the team time to perfect the design", "It turned out to be beneficial", ["It was a serious setback", "It caused the design to fail", "It was cancelled"]]];
    const [x, y, c, w] = pick(L);
    return { q: "What does the speaker say?", audio: `Far from ${x}, ${y}.`, correct: c, wrong: w, x: "'Far from X' = the opposite of X happened." };
  });
  G(6, "reading", "thesis", () => {
    const L = [
      { p: "The notion that technology is neutral — a mere tool whose value depends entirely on how it is used — has proved remarkably durable. Yet such a view overlooks the extent to which tools shape the very purposes we pursue: a medium designed to maximise engagement does not merely serve our attention; it redefines what we deem worthy of it.", c: "Technology shapes what people value, not just how they act", w: ["Technology is entirely neutral", "Tools have no effect on human purposes", "Engagement is always beneficial"] },
      { p: "Translators are often praised for being invisible, as though the ideal rendering were one in which the translator left no trace. This ideal, however, obscures an uncomfortable truth: every translation involves countless choices, and the pretence of invisibility merely conceals whose judgement is being exercised.", c: "Translation always involves the translator's own judgement", w: ["Good translators leave no trace at all", "Translation is a purely mechanical process", "Translators should make fewer choices"] },
      { p: "Few economic indicators enjoy the prestige of GDP, yet its architects themselves cautioned against treating it as a measure of welfare. A country can boost its output by felling forests or by rebuilding after disasters — outcomes that leave its citizens no better off, and arguably considerably worse.", c: "GDP growth does not necessarily reflect people's wellbeing", w: ["GDP is the best measure of welfare", "GDP's creators saw it as a measure of happiness", "Felling forests always improves living standards"] },
      { p: "Memory is less a recording than a reconstruction. Each time we recall an event, we rebuild it from fragments, unwittingly incorporating details from later experience — which is why vivid, confidently held recollections can nonetheless be profoundly mistaken.", c: "Confident memories can still be inaccurate", w: ["Memories are exact recordings of events", "Vivid memories are always reliable", "We cannot recall past events at all"] },
      { p: "It is tempting to read the history of science as a steady march from ignorance to truth. Such narratives, however, flatten a far messier reality, in which discarded theories were often reasonable given the evidence available, and in which today's certainties may well become tomorrow's cautionary tales.", c: "Scientific progress is less straightforward than it is often portrayed", w: ["Science has always moved steadily towards truth", "Discarded theories were always foolish", "Current scientific knowledge is certain to last"] },
      { p: "The paradox of the modern archive is that abundance breeds a new kind of scarcity. When every email, draft and message is retained, the historian's challenge shifts from recovering lost fragments to discerning signal amid overwhelming noise — an act of curation that is itself an interpretive, and therefore contestable, intervention.", c: "Selecting from abundant material is itself a subjective act", w: ["Historians suffer from a lack of sources", "Digital archives are completely objective", "Emails should not be archived"] }
    ];
    const t = pick(L);
    return { passage: t.p, q: "What is the writer's main point?", correct: t.c, wrong: t.w, x: "" };
  });

  /* ---------- topic map for units ---------- */
  const UNIT_TOPICS = {
    "a1-1": ["be", "possessive"], "a1-2": ["presentSimple", "thereIs"],
    "a2-1": ["pastSimple"], "a2-2": ["comparative", "goingTo"],
    "b1-1": ["presentPerfect"], "b1-2": ["conditionals"],
    "b2-1": ["cond3", "wish"], "b2-2": ["reportedQ", "reportingVerbs"],
    "c1-1": ["inversion", "invertedCond", "cleft"], "c1-2": ["hedging", "advancedVocab"],
    "c2-1": ["subjunctive", "fixedExpr"], "c2-2": ["connotation", "idioms"],
    "a1-3": ["thereIs", "everyday"], "a2-3": ["modals", "quantity"], "b1-3": ["passive", "gerundInf"],
    "b2-3": ["pastPerfect", "prefixes"], "c1-3": ["unreal", "advancedVocab"], "c2-3": ["emphatic", "fixedExpr"]
  };

  /* add-on files register more generators with LU_GEN.register and reuse these helpers */
  const helpers = { rnd, pick, shuffle, sample, cap, art, others, person, twoPeople, JOBS, CITIES, DAYS, MONTHS, numWord, ORD };
  return { generate, generateSet, keyOf, UNIT_TOPICS, register: G, helpers, count: () => GENS.length, _gens: GENS, _build: build };
})();
