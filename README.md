# LevelUp English

Live: https://dan16ssd.github.io/levelup-english/

A free, static English-learning site:

- **Adaptive placement test** (20 questions) covering grammar, vocabulary, reading and listening. It places learners on the CEFR scale (A1–C2) and scores each skill separately. **New questions every attempt.**
- **Unlimited practice**: choose a level and a skill, then answer generated questions with instant explanations, streaks and stats.
- **Personalised study plan** after each test, with a focus on your weakest skills.
- **12 study units** (2 per level), each with a grammar lesson, vocabulary, a reading text, auto-marked exercises and speaking practice (speech recognition in Chrome/Edge). Every unit can generate unlimited new practice sets.
- **Level tests** (16 fresh questions each time). Score 70% to move up.

## How the infinite questions work

`js/generators.js` holds about 100 question generators, covering every level × skill. Each one builds a question from templates and word banks (names, verbs, places, times, prices, passages and so on), which gives thousands of distinct questions. The app remembers the last 2,000 questions each browser has seen and avoids repeating them.

To add content, add a generator with `G(level, skill, topic, () => ({ q, correct, wrong: [...], passage?, audio?, x }))`.

No build step: open `index.html` or serve the folder with any static host. Progress is stored in the browser (localStorage).
