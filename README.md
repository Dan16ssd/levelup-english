# LevelUp English

Live: https://dan16ssd.github.io/levelup-english/

A free, static English-learning site:

- **Adaptive placement test** (20 questions) covering grammar, vocabulary, reading and listening. It places learners on the CEFR scale (A1–C2) and scores each skill separately. **New questions every attempt.**
- **Unlimited practice**: choose a level and a skill, then answer generated questions with instant explanations, streaks and stats.
- **Personalised study plan** after each test, with a focus on your weakest skills.
- **18 study units** (3 per level), each with a grammar lesson, vocabulary, a reading text, auto-marked exercises, speaking practice (speech recognition in Chrome/Edge, with missed words highlighted) and a **writing task** that is checked automatically (length, target grammar, unit vocabulary, punctuation, repetition) and comes with a model answer. Every unit can generate unlimited new practice sets.
- **Vocabulary review** with spaced repetition: unit words come back after 1, 2, 4, 8… days.
- **Daily goal and day streak** on the progress page.
- **Shareable certificate** after the placement test: add your name, print or save it as a PDF, or share a link (the result is encoded in the link, so no server is needed).
- **Voice settings**: pick the most natural voice on your device and set the speed.
- **Backup and transfer**: copy a transfer code or download a backup file to move progress to another device without an account.
- **Level tests** (16 fresh questions each time). Score 70% to move up.

## How the infinite questions work

`js/generators.js` holds about 100 question generators, covering every level × skill. Each one builds a question from templates and word banks (names, verbs, places, times, prices, passages and so on), which gives thousands of distinct questions. The app remembers the last 2,000 questions each browser has seen and avoids repeating them.

Extra units and every unit's writing task live in `js/content-extra.js`.

To add content, add a generator with `G(level, skill, topic, () => ({ q, correct, wrong: [...], passage?, audio?, x }))`.

No build step: open `index.html` or serve the folder with any static host. Progress is stored in the browser (localStorage).
