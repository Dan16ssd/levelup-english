# LevelUp English

Live: https://dan16ssd.github.io/levelup-english/

A free, static English-learning site:

- **Adaptive placement test** (20 questions) covering grammar, vocabulary, reading and listening. It places learners on the CEFR scale (A1–C2) and scores each skill separately. **New questions every attempt.**
- **Unlimited practice**: choose a level and a skill, then answer generated questions with instant explanations, streaks and stats.
- **Personalised study plan** after each test, with a focus on your weakest skills.
- **36 study units** (6 per level), each with a grammar lesson, vocabulary, a reading text, auto-marked exercises, speaking practice (each word of your answer is checked, plus a recorded 60-second talk with pace and pause feedback) and a **writing task** that is checked automatically (length, target grammar, unit vocabulary, punctuation, repetition) and comes with a model answer. Every unit can generate unlimited new practice sets.
- **Exam practice** (Exams page), in the style of IELTS and TOEIC (original material, not official content):
  - IELTS-style: listening form completion and discussions, reading True / False / Not given, a timed Writing Task 2 essay with a checklist, a Speaking Part 2 cue card with a preparation timer, and a 30-minute mini mock with a band estimate.
  - TOEIC-style: Parts 2, 3, 5 and 7 (generated, so they never run out) and a 25-minute mini mock with a score estimate.
  - When the AI partner is set up, essays and spoken answers also get estimated bands and corrected sentences.
- **Two-voice dialogues**: conversations in listening questions are read with two different voices.
- **Natural AI voice** (optional, in Settings): an open-source text-to-speech model (Kokoro) replaces the device voice, with British or American accents and a separate voice for each speaker. It downloads once: about 330 MB on computers with WebGPU (fast, uses the graphics card) or 90 MB elsewhere (slower, so recordings on screen are prepared in advance).
- **Speech recognition in every browser**: Chrome and Edge use the built-in service; Safari, Firefox and iPhone use an open-source Whisper model (about 80 MB, downloaded once) that runs on the device. You can choose in Settings.
- **Vocabulary review** with spaced repetition: unit words come back after 1, 2, 4, 8… days.
- **Daily goal and day streak** on the progress page.
- **Shareable certificate** after the placement test: add your name, print or save it as a PDF, or share a link (the result is encoded in the link, so no server is needed).
- **AI conversation partner** (Talk page): role-plays and free conversation pitched to your level, by text or voice, with corrections after every message and written feedback at the end. Three ways to run it:
  - **Free, on your device**: an open-source model (Llama 3.2, via WebLLM) downloads once and runs in the browser with WebGPU. No key, no cost, messages stay on the device.
  - **Claude with your own API key**: best quality, billed to your Anthropic account.
  - **Claude for everyone**: the site owner deploys the proxy in `worker/` (see `worker/README.md`) and pays for usage.
- **Voice settings**: pick the most natural voice on your device and set the speed.
- **Backup and transfer**: copy a transfer code or download a backup file to move progress to another device without an account.
- **Level tests** (16 fresh questions each time). Score 70% to move up.

## How the infinite questions work

`js/generators.js` holds about 100 question generators (131 with the add-ons), covering every level × skill. Each one builds a question from templates and word banks (names, verbs, places, times, prices, passages and so on), which gives thousands of distinct questions. The app remembers the last 2,000 questions each browser has seen and avoids repeating them.

Extra units and every unit's writing task live in `js/content-extra.js`, `js/content-more.js` and `js/content-units2.js` (which also adds the dialogue listening generators). Exam tasks are in `js/exam.js`; speech recognition is in `js/speech.js`; the natural voice is in `js/voice.js`.

To add content, add a generator with `G(level, skill, topic, () => ({ q, correct, wrong: [...], passage?, audio?, x }))`.

No build step: open `index.html` or serve the folder with any static host. Progress is stored in the browser (localStorage).
