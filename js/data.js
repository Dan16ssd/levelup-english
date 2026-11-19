/* LevelUp English — course content & placement test bank */
window.LU_DATA = (function () {
  const SKILLS = [
    { id: "grammar", name: "Grammar", icon: "Aa", desc: "Sentence structure, tenses and accuracy" },
    { id: "vocabulary", name: "Vocabulary", icon: "Ab", desc: "Words, collocations and phrasal verbs" },
    { id: "reading", name: "Reading", icon: "¶", desc: "Understanding texts, gist and detail" },
    { id: "listening", name: "Listening", icon: "♪", desc: "Understanding spoken English" }
  ];

  const LEVELS = [
    {
      n: 1, code: "A1", name: "Beginner", color: "#14b8a6",
      summary: "You can understand and use familiar everyday expressions and very basic phrases.",
      canDo: ["Introduce yourself and others", "Ask and answer simple personal questions", "Understand familiar everyday words", "Talk about your daily routine"],
      hours: "80–100"
    },
    {
      n: 2, code: "A2", name: "Elementary", color: "#0ea5e9",
      summary: "You can communicate in simple, routine tasks and describe your background and immediate needs.",
      canDo: ["Describe past events simply", "Make plans and arrangements", "Compare people, places and things", "Handle simple shopping and travel situations"],
      hours: "180–200"
    },
    {
      n: 3, code: "B1", name: "Intermediate", color: "#3b82f6",
      summary: "You can deal with most situations while travelling and talk about experiences, hopes and plans.",
      canDo: ["Talk about life experiences", "Explain reasons and consequences", "Write simple connected text", "Follow the main points of clear speech"],
      hours: "350–400"
    },
    {
      n: 4, code: "B2", name: "Upper-Intermediate", color: "#6366f1",
      summary: "You can interact with fluency and spontaneity and understand the main ideas of complex texts.",
      canDo: ["Discuss hypothetical situations and regrets", "Report what others said accurately", "Argue a point of view", "Understand detailed texts on many topics"],
      hours: "500–600"
    },
    {
      n: 5, code: "C1", name: "Advanced", color: "#8b5cf6",
      summary: "You can express ideas fluently and use language flexibly for social, academic and professional purposes.",
      canDo: ["Use emphasis and inversion naturally", "Hedge claims in academic writing", "Understand implicit meaning", "Produce well-structured, detailed text"],
      hours: "700–800"
    },
    {
      n: 6, code: "C2", name: "Proficient", color: "#c026d3",
      summary: "You can understand virtually everything and express yourself with precision and fine shades of meaning.",
      canDo: ["Adapt register to any situation", "Use idiom and rhetoric naturally", "Distinguish subtle connotations", "Summarise and argue complex ideas"],
      hours: "1,000+"
    }
  ];

  const SKILL_TIPS = {
    grammar: [
      "Study one grammar point per day and write five sentences of your own using it.",
      "When you read, highlight the structure you are studying and notice how it is used.",
      "Repeat each unit's practice until you score 100% — accuracy comes from repetition."
    ],
    vocabulary: [
      "Learn words in phrases (collocations) — e.g. 'make a decision', not just 'decision'.",
      "Review new words after 1, 3 and 7 days (spaced repetition).",
      "Keep a vocabulary notebook with an example sentence for every new word."
    ],
    reading: [
      "Read something at your level for 15 minutes every day.",
      "Skim first for the main idea, then read again for detail.",
      "Guess unknown words from context before you check a dictionary."
    ],
    listening: [
      "Listen to short clips every day and replay the difficult parts.",
      "Shadowing: repeat each sentence immediately after the speaker.",
      "Use the slow audio first, then the normal speed, in every unit."
    ]
  };

  /* ---------------- PLACEMENT TEST BANK (10 per level) ---------------- */
  const TEST_BANK = [
    // Level 1 — A1
    { id: "t1-1", lvl: 1, skill: "grammar", q: "She ___ a teacher.", o: ["am", "is", "are", "be"], a: 1 },
    { id: "t1-2", lvl: 1, skill: "grammar", q: "I ___ two brothers.", o: ["has", "have", "haves", "having"], a: 1 },
    { id: "t1-3", lvl: 1, skill: "vocabulary", q: "Which word is a colour?", o: ["table", "green", "run", "happy"], a: 1 },
    { id: "t1-4", lvl: 1, skill: "vocabulary", q: "The opposite of 'big' is ___.", o: ["tall", "small", "long", "fast"], a: 1 },
    { id: "t1-5", lvl: 1, skill: "grammar", q: "___ you like coffee?", o: ["Do", "Does", "Are", "Is"], a: 0 },
    { id: "t1-6", lvl: 1, skill: "reading", passage: "My name is Tom. I am 25 years old. I live in London with my sister. I work in a bank.", q: "Where does Tom work?", o: ["In a school", "In a bank", "In a hospital", "At home"], a: 1 },
    { id: "t1-7", lvl: 1, skill: "listening", audio: "The meeting is at three o'clock.", q: "What time is the meeting?", o: ["1:00", "2:00", "3:00", "4:00"], a: 2 },
    { id: "t1-8", lvl: 1, skill: "vocabulary", q: "We eat breakfast in the ___.", o: ["night", "morning", "evening", "midnight"], a: 1 },
    { id: "t1-9", lvl: 1, skill: "grammar", q: "There ___ three apples on the table.", o: ["is", "are", "am", "be"], a: 1 },
    { id: "t1-10", lvl: 1, skill: "listening", audio: "I have a black cat and a white dog.", q: "What colour is the dog?", o: ["Black", "Brown", "White", "Grey"], a: 2 },

    // Level 2 — A2
    { id: "t2-1", lvl: 2, skill: "grammar", q: "Yesterday I ___ to the cinema.", o: ["go", "goes", "went", "gone"], a: 2 },
    { id: "t2-2", lvl: 2, skill: "grammar", q: "She is ___ than her brother.", o: ["tall", "taller", "tallest", "more tall"], a: 1 },
    { id: "t2-3", lvl: 2, skill: "vocabulary", q: "I need to ___ a table at the restaurant for Friday.", o: ["book", "write", "take", "put"], a: 0 },
    { id: "t2-4", lvl: 2, skill: "grammar", q: "How ___ milk do we have?", o: ["many", "much", "lot", "few"], a: 1 },
    { id: "t2-5", lvl: 2, skill: "grammar", q: "I'm ___ to visit my grandmother this weekend.", o: ["go", "going", "went", "goes"], a: 1 },
    { id: "t2-6", lvl: 2, skill: "reading", passage: "Dear Anna, Thanks for your email. I'm sorry I can't come to your party on Saturday. My parents are visiting and we are going to the beach. Can we meet next week? Love, Kate", q: "Why can't Kate go to the party?", o: ["She is ill", "Her parents are visiting", "She has to work", "She doesn't like parties"], a: 1 },
    { id: "t2-7", lvl: 2, skill: "listening", audio: "The train to Manchester leaves from platform six at ten fifteen.", q: "Which platform does the train leave from?", o: ["Platform 2", "Platform 6", "Platform 10", "Platform 15"], a: 1 },
    { id: "t2-8", lvl: 2, skill: "vocabulary", q: "My sister's husband is my ___.", o: ["uncle", "cousin", "brother-in-law", "nephew"], a: 2 },
    { id: "t2-9", lvl: 2, skill: "grammar", q: "You ___ wear a seatbelt in the car. It's the law.", o: ["must", "can", "might", "would"], a: 0 },
    { id: "t2-10", lvl: 2, skill: "listening", audio: "I usually take the bus, but today I walked because it was sunny.", q: "How did the speaker travel today?", o: ["By bus", "On foot", "By car", "By bike"], a: 1 },

    // Level 3 — B1
    { id: "t3-1", lvl: 3, skill: "grammar", q: "I ___ in this city since 2018.", o: ["live", "am living", "have lived", "lived"], a: 2 },
    { id: "t3-2", lvl: 3, skill: "grammar", q: "If it rains tomorrow, we ___ at home.", o: ["stay", "will stay", "would stay", "stayed"], a: 1 },
    { id: "t3-3", lvl: 3, skill: "grammar", q: "This book ___ by millions of people every year.", o: ["reads", "is read", "is reading", "has read"], a: 1 },
    { id: "t3-4", lvl: 3, skill: "vocabulary", q: "She ___ up smoking last year.", o: ["gave", "took", "put", "made"], a: 0 },
    { id: "t3-5", lvl: 3, skill: "vocabulary", q: "The flight was ___ because of the storm.", o: ["cancelled", "refused", "denied", "rejected"], a: 0 },
    { id: "t3-6", lvl: 3, skill: "grammar", q: "He asked me where I ___.", o: ["live", "lived", "am living", "do live"], a: 1 },
    { id: "t3-7", lvl: 3, skill: "reading", passage: "Working from home has become common for many office workers. Supporters say it saves time and money on commuting and allows people to organise their day more flexibly. However, some employees report feeling isolated, and managers sometimes worry about communication within teams.", q: "According to the text, what is a disadvantage of working from home?", o: ["Higher costs", "Feeling isolated", "Longer commutes", "Less flexibility"], a: 1 },
    { id: "t3-8", lvl: 3, skill: "listening", audio: "Sorry, I won't be able to make it on Thursday. Could we move our appointment to Friday morning instead?", q: "What does the speaker want to do?", o: ["Cancel the appointment completely", "Move the appointment to Friday", "Meet on Thursday afternoon", "Confirm the Thursday appointment"], a: 1 },
    { id: "t3-9", lvl: 3, skill: "grammar", q: "I'm used to ___ up early.", o: ["get", "getting", "got", "have got"], a: 1 },
    { id: "t3-10", lvl: 3, skill: "vocabulary", q: "Could you ___ an eye on my bag for a minute?", o: ["keep", "hold", "take", "put"], a: 0 },

    // Level 4 — B2
    { id: "t4-1", lvl: 4, skill: "grammar", q: "If I had known about the traffic, I ___ earlier.", o: ["would leave", "would have left", "will leave", "had left"], a: 1 },
    { id: "t4-2", lvl: 4, skill: "grammar", q: "By the time we arrived, the film ___.", o: ["already started", "has already started", "had already started", "is already starting"], a: 2 },
    { id: "t4-3", lvl: 4, skill: "vocabulary", q: "The company decided to ___ the project due to a lack of funding.", o: ["call off", "call up", "call on", "call in"], a: 0 },
    { id: "t4-4", lvl: 4, skill: "grammar", q: "She suggested ___ a taxi.", o: ["to take", "taking", "take", "that take"], a: 1 },
    { id: "t4-5", lvl: 4, skill: "vocabulary", q: "His argument was so ___ that everyone agreed with him.", o: ["persuasive", "persuaded", "persuading", "persuasion"], a: 0 },
    { id: "t4-6", lvl: 4, skill: "grammar", q: "Not only ___ late, but he also forgot the documents.", o: ["he was", "was he", "he is", "did he"], a: 1 },
    { id: "t4-7", lvl: 4, skill: "reading", passage: "Urban planners increasingly recognise that parks are not a luxury but essential infrastructure. Studies link access to green space with lower stress levels and improved air quality. Critics, however, point out that new parks can drive up nearby property prices, potentially pushing out the very residents they were meant to benefit.", q: "What concern do critics raise?", o: ["Parks increase pollution", "Parks may lead to residents being priced out", "Parks are too expensive to maintain", "Parks raise stress levels"], a: 1 },
    { id: "t4-8", lvl: 4, skill: "listening", audio: "Although the proposal has some merit, I'm not convinced the budget is realistic, so I'd rather we revisited the figures before committing.", q: "What is the speaker's attitude to the proposal?", o: ["Fully supportive", "Cautiously sceptical", "Completely opposed", "Indifferent"], a: 1 },
    { id: "t4-9", lvl: 4, skill: "vocabulary", q: "The new law will come into ___ next month.", o: ["force", "action", "place", "work"], a: 0 },
    { id: "t4-10", lvl: 4, skill: "grammar", q: "I wish I ___ more time to travel.", o: ["have", "had", "will have", "am having"], a: 1 },

    // Level 5 — C1
    { id: "t5-1", lvl: 5, skill: "grammar", q: "Hardly ___ the room when the lights went out.", o: ["I had entered", "had I entered", "I entered", "did I enter"], a: 1 },
    { id: "t5-2", lvl: 5, skill: "vocabulary", q: "The minister's remarks were widely ___ as an attempt to deflect criticism.", o: ["construed", "constructed", "consisted", "constrained"], a: 0 },
    { id: "t5-3", lvl: 5, skill: "grammar", q: "It's high time we ___ a decision.", o: ["make", "made", "will make", "have made"], a: 1 },
    { id: "t5-4", lvl: 5, skill: "vocabulary", q: "Her ___ to detail made her an excellent editor.", o: ["attention", "intention", "retention", "tension"], a: 0 },
    { id: "t5-5", lvl: 5, skill: "grammar", q: "___ the circumstances, the team performed remarkably well.", o: ["Given", "Giving", "Being given", "To give"], a: 0 },
    { id: "t5-6", lvl: 5, skill: "vocabulary", q: "The negotiations reached an ___, with neither side willing to compromise.", o: ["impasse", "impulse", "impact", "impetus"], a: 0 },
    { id: "t5-7", lvl: 5, skill: "reading", passage: "Confirmation bias — the tendency to seek out information that supports one's existing beliefs — is often portrayed as a flaw of the uninformed. Yet research suggests that highly educated individuals may be more susceptible in certain domains, precisely because they are adept at constructing sophisticated justifications for conclusions they have already reached.", q: "What point does the writer make?", o: ["Educated people are immune to confirmation bias", "Education can make people better at justifying what they already believe", "Confirmation bias only affects uninformed people", "Research on confirmation bias is unreliable"], a: 1 },
    { id: "t5-8", lvl: 5, skill: "listening", audio: "Frankly, the report raises more questions than it answers. It's not that the data are wrong as such, but the conclusions go well beyond what the evidence supports.", q: "What is the speaker's main criticism?", o: ["The data are incorrect", "The conclusions overreach the evidence", "The report is too short", "The report answers too many questions"], a: 1 },
    { id: "t5-9", lvl: 5, skill: "grammar", q: "Were the government ___ taxes, there would be widespread protests.", o: ["to raise", "raising", "raised", "raise"], a: 0 },
    { id: "t5-10", lvl: 5, skill: "vocabulary", q: "The evidence is ___ at best; we can't draw firm conclusions.", o: ["tenuous", "tenacious", "tedious", "tremendous"], a: 0 },

    // Level 6 — C2
    { id: "t6-1", lvl: 6, skill: "vocabulary", q: "The author's prose is so ___ that almost every sentence demands rereading.", o: ["dense", "thick", "heavy", "solid"], a: 0 },
    { id: "t6-2", lvl: 6, skill: "grammar", q: "Little ___ that his decision would change the course of the company.", o: ["he knew", "did he know", "he did know", "knew he"], a: 1 },
    { id: "t6-3", lvl: 6, skill: "vocabulary", q: "Her speech was a masterclass in ___, saying much while committing to nothing.", o: ["equivocation", "elucidation", "enunciation", "exaggeration"], a: 0 },
    { id: "t6-4", lvl: 6, skill: "vocabulary", q: "The scandal ___ his reputation beyond repair.", o: ["tarnished", "varnished", "garnished", "burnished"], a: 0 },
    { id: "t6-5", lvl: 6, skill: "grammar", q: "Should you ___ any further assistance, do not hesitate to contact us.", o: ["require", "required", "requiring", "to require"], a: 0 },
    { id: "t6-6", lvl: 6, skill: "vocabulary", q: "The proposal was met with ___ approval: few were enthusiastic, but none objected.", o: ["tacit", "explicit", "vocal", "fervent"], a: 0 },
    { id: "t6-7", lvl: 6, skill: "reading", passage: "The paradox of the modern archive is that abundance breeds a new kind of scarcity. When every email, draft and message is retained, the historian's challenge shifts from recovering lost fragments to discerning signal amid overwhelming noise — an act of curation that is itself an interpretive, and therefore contestable, intervention.", q: "What does the writer suggest about historians today?", o: ["They suffer from a lack of sources", "Selecting from abundant material is itself a subjective act", "Digital archives are completely objective", "Emails should not be archived"], a: 1 },
    { id: "t6-8", lvl: 6, skill: "listening", audio: "One might be forgiven for assuming the policy was an unqualified success, though a closer reading of the figures paints a decidedly more ambivalent picture.", q: "What does the speaker imply?", o: ["The policy was a clear success", "The policy's success is questionable", "The figures were invented", "Nobody has read the figures"], a: 1 },
    { id: "t6-9", lvl: 6, skill: "grammar", q: "Much as I ___ your offer, I'm afraid I must decline.", o: ["appreciate", "am appreciating", "appreciated", "would appreciate"], a: 0 },
    { id: "t6-10", lvl: 6, skill: "listening", audio: "Far from settling the matter, the ruling has merely shifted the battleground from the courts to parliament.", q: "What does the speaker say about the ruling?", o: ["It ended the dispute", "It moved the dispute to a different arena", "It was made by parliament", "It was widely celebrated"], a: 1 }
  ];

  /* ---------------- STUDY UNITS (2 per level) ---------------- */
  const UNITS = [
    /* ===== A1 ===== */
    {
      id: "a1-1", level: 1, title: "Nice to meet you", topic: "Introductions",
      focus: ["grammar", "vocabulary", "listening"],
      objectives: ["Introduce yourself and others", "Use am / is / are correctly", "Ask simple questions with the verb 'to be'"],
      grammar: {
        title: "The verb 'to be' (am / is / are)",
        html: `<p>Use <b>to be</b> to talk about names, jobs, age, nationality and feelings.</p>
<table class="gtable"><tr><th>Positive</th><th>Negative</th><th>Question</th></tr>
<tr><td>I <b>am</b> (I'm)</td><td>I'm <b>not</b></td><td><b>Am</b> I…?</td></tr>
<tr><td>You / We / They <b>are</b> (you're)</td><td>You <b>aren't</b></td><td><b>Are</b> you…?</td></tr>
<tr><td>He / She / It <b>is</b> (she's)</td><td>She <b>isn't</b></td><td><b>Is</b> she…?</td></tr></table>
<p>To make a question, put the verb <b>before</b> the subject: <i>You are a student → Are you a student?</i></p>`,
        examples: ["I'm Maria. I'm from Brazil.", "Is she your teacher? Yes, she is.", "They aren't at home today."]
      },
      vocab: [
        ["hello", "a greeting", "Hello! How are you?"],
        ["name", "what someone is called", "My name is Ali."],
        ["teacher", "a person who teaches", "Our teacher is very friendly."],
        ["student", "a person who studies", "I'm a student at the university."],
        ["country", "a nation, e.g. Spain, Japan", "What country are you from?"],
        ["friend", "a person you like and know well", "Sara is my best friend."]
      ],
      reading: {
        title: "My English class",
        text: "Hi! My name is Lena. I am 22 and I am from Germany. I'm a student in Dublin. My best friend is Sara. She is from Italy. We are in the same English class. Our teacher is Mr Brown. He is very friendly."
      },
      ex: [
        { t: "mc", q: "Lena ___ from Germany.", o: ["am", "is", "are"], a: 1, x: "Lena = she → is." },
        { t: "mc", q: "Reading: Where is Sara from?", o: ["Germany", "Ireland", "Italy", "Spain"], a: 2, x: "'She is from Italy.'" },
        { t: "fill", q: "We ___ in the same class.", a: ["are"], x: "We → are." },
        { t: "fill", q: "I ___ not a teacher. I'm a student.", a: ["am"], x: "I → am." },
        { t: "fill", q: "___ he your brother? — Yes, he is.", a: ["is"], x: "Questions with he/she/it start with Is." },
        { t: "order", a: ["Are", "you", "a", "student"], p: "?", x: "Question: verb + subject." },
        { t: "listen", audio: "Hello, my name is David and I am from Canada.", q: "Where is David from?", o: ["Canada", "The USA", "England", "Australia"], a: 0, x: "'I am from Canada.'" },
        { t: "mc", q: "They ___ my friends.", o: ["is", "am", "are"], a: 2, x: "They → are." }
      ],
      speaking: ["Nice to meet you.", "Where are you from?", "I am a student."]
    },
    {
      id: "a1-2", level: 1, title: "My daily routine", topic: "Everyday life",
      focus: ["grammar", "reading"],
      objectives: ["Describe your daily routine", "Use the present simple", "Use adverbs of frequency (always, usually, never)"],
      grammar: {
        title: "Present simple",
        html: `<p>Use the <b>present simple</b> for habits, routines and facts.</p>
<ul><li>I / you / we / they <b>work</b> — he / she / it <b>works</b> (add <b>-s / -es</b>: watch → watch<b>es</b>, go → go<b>es</b>)</li>
<li>Negative: <b>don't / doesn't</b> + base verb — <i>She <b>doesn't like</b> coffee.</i></li>
<li>Question: <b>Do / Does</b> + subject + base verb — <i><b>Does</b> he <b>work</b> here?</i></li></ul>
<p><b>Adverbs of frequency</b> go before the main verb: <i>I <b>usually</b> get up at 7.</i> But after <i>be</i>: <i>He is <b>always</b> late.</i></p>`,
        examples: ["He gets up at six o'clock.", "We don't work on Sundays.", "Do you usually have breakfast?"]
      },
      vocab: [
        ["get up", "leave your bed in the morning", "I get up at seven."],
        ["breakfast", "the first meal of the day", "I have toast for breakfast."],
        ["work", "do your job", "She works in a hospital."],
        ["usually", "most of the time", "I usually take the bus."],
        ["never", "not at any time", "He never drinks coffee."],
        ["weekend", "Saturday and Sunday", "What do you do at the weekend?"]
      ],
      reading: {
        title: "Carlos's day",
        text: "Carlos is a nurse. He gets up at six o'clock every day. He has breakfast at half past six and he takes the bus to the hospital. He works from seven to three. In the evening, he usually cooks dinner and watches TV. He never goes to bed late. At the weekend, he plays football with his friends."
      },
      ex: [
        { t: "mc", q: "Carlos ___ the bus to work.", o: ["take", "takes", "taking"], a: 1, x: "He → verb + s." },
        { t: "mc", q: "Reading: What does Carlos do at the weekend?", o: ["He works", "He plays football", "He cooks", "He sleeps all day"], a: 1, x: "'At the weekend, he plays football.'" },
        { t: "fill", q: "She ___ (not / like) coffee.", a: ["doesn't like", "does not like"], x: "She → doesn't + base verb." },
        { t: "fill", q: "___ you work on Saturdays?", a: ["do"], x: "You → Do." },
        { t: "fill", q: "My brother ___ (watch) TV every evening.", a: ["watches"], x: "watch → watches (add -es after -ch)." },
        { t: "order", a: ["I", "never", "get", "up", "late"], p: ".", x: "Adverb of frequency goes before the main verb." },
        { t: "listen", audio: "I usually have lunch at one o'clock, but on Fridays I have lunch at two.", q: "When does the speaker have lunch on Fridays?", o: ["At 1:00", "At 12:00", "At 2:00", "At 3:00"], a: 2, x: "'On Fridays I have lunch at two.'" },
        { t: "mc", q: "Which sentence is correct?", o: ["He go to work by car.", "He goes to work by car.", "He going to work by car."], a: 1, x: "He → goes." }
      ],
      speaking: ["I get up at seven o'clock.", "She works in a hospital.", "Do you like coffee?"]
    },

    /* ===== A2 ===== */
    {
      id: "a2-1", level: 2, title: "Last weekend", topic: "Past events",
      focus: ["grammar", "reading", "listening"],
      objectives: ["Talk about finished past events", "Use regular and irregular past simple verbs", "Ask questions with 'Did…?'"],
      grammar: {
        title: "Past simple",
        html: `<p>Use the <b>past simple</b> for finished actions in the past.</p>
<ul><li>Regular verbs: add <b>-ed</b> — work → work<b>ed</b>, stop → stop<b>ped</b>, study → stud<b>ied</b></li>
<li>Irregular verbs: go → <b>went</b>, have → <b>had</b>, see → <b>saw</b>, buy → <b>bought</b>, eat → <b>ate</b></li>
<li>Negative: <b>didn't</b> + base verb — <i>I <b>didn't go</b> out.</i></li>
<li>Question: <b>Did</b> + subject + base verb — <i><b>Did</b> you <b>enjoy</b> it?</i></li></ul>
<p>Time words: <i>yesterday, last week, two days ago, in 2020</i>.</p>`,
        examples: ["We went to the coast last summer.", "I didn't see him yesterday.", "Did you have a good time?"]
      },
      vocab: [
        ["trip", "a short journey for pleasure", "We had a great trip to Rome."],
        ["visit", "go to see a place or person", "We visited a museum."],
        ["beach", "sand next to the sea", "They walked on the beach."],
        ["museum", "a building with art or history objects", "The museum was free."],
        ["ago", "before now", "I moved here two years ago."],
        ["delicious", "tasting very good", "The pizza was delicious."]
      ],
      reading: {
        title: "A weekend by the sea",
        text: "Last weekend, Emma and her family went to the coast. On Saturday morning, they visited an old castle and took lots of photos. In the afternoon, they swam in the sea, but the water was very cold! In the evening, they ate fish and chips in a small restaurant. It was delicious. On Sunday, it rained, so they stayed in the hotel and played cards."
      },
      ex: [
        { t: "mc", q: "Reading: What did they do on Sunday?", o: ["Visited a castle", "Swam in the sea", "Stayed in the hotel", "Went to a restaurant"], a: 2, x: "'On Sunday, it rained, so they stayed in the hotel.'" },
        { t: "fill", q: "We ___ (go) to Paris two years ago.", a: ["went"], x: "go → went (irregular)." },
        { t: "fill", q: "I ___ (not / see) the film yesterday.", a: ["didn't see", "did not see"], x: "didn't + base verb." },
        { t: "fill", q: "___ you enjoy the party?", a: ["did"], x: "Past simple questions use Did." },
        { t: "mc", q: "She ___ a new phone last week.", o: ["buyed", "bought", "buys", "buy"], a: 1, x: "buy → bought (irregular)." },
        { t: "order", a: ["They", "arrived", "three", "days", "ago"], p: ".", x: "'ago' comes after the time period." },
        { t: "listen", audio: "On Friday I didn't go out. I stayed at home and read a book.", q: "What did the speaker do on Friday?", o: ["Went out with friends", "Read a book at home", "Went to the cinema", "Worked late"], a: 1, x: "'I stayed at home and read a book.'" },
        { t: "mc", q: "Choose the correct question.", o: ["Where you went last summer?", "Where did you go last summer?", "Where did you went last summer?"], a: 1, x: "Did + subject + base verb." }
      ],
      speaking: ["I went to the beach last weekend.", "Did you have a good time?", "We visited my grandparents."]
    },
    {
      id: "a2-2", level: 2, title: "Plans and choices", topic: "Holidays & comparisons",
      focus: ["grammar", "vocabulary"],
      objectives: ["Talk about future plans with 'going to'", "Compare things with comparative adjectives", "Give reasons for choices"],
      grammar: {
        title: "'Going to' & comparatives",
        html: `<p><b>be going to + verb</b> for plans and intentions: <i>I'm <b>going to study</b> tonight.</i></p>
<p><b>Comparatives</b> + <b>than</b>:</p>
<ul><li>Short adjectives: + <b>-er</b> — cheap → cheap<b>er</b>, big → big<b>ger</b></li>
<li>Ending in -y: → <b>-ier</b> — easy → eas<b>ier</b></li>
<li>Long adjectives: <b>more</b> + adjective — <b>more</b> expensive</li>
<li>Irregular: good → <b>better</b>, bad → <b>worse</b>, far → <b>further</b></li></ul>`,
        examples: ["We're going to visit Rome next summer.", "The train is faster than the bus.", "This hotel is more expensive than that one."]
      },
      vocab: [
        ["plan", "something you intend to do", "What are your plans for tonight?"],
        ["cheap", "not costing much money", "The market is cheaper than the shop."],
        ["expensive", "costing a lot of money", "London is expensive."],
        ["crowded", "full of people", "The beach was very crowded."],
        ["quiet", "with little noise", "The village is quiet at night."],
        ["holiday", "time off work or school, often travelling", "We're going on holiday in July."]
      ],
      reading: {
        title: "City or mountains?",
        text: "Mia and Jake are planning their summer holiday. Mia wants to go to the city because it's more exciting than the countryside, and there are more shops and restaurants. Jake prefers the mountains. He says they are quieter and cheaper than the city. In the end, they are going to spend one week in each place."
      },
      ex: [
        { t: "mc", q: "Reading: Why does Jake prefer the mountains?", o: ["They are more exciting", "They are quieter and cheaper", "They have more shops", "They are closer"], a: 1, x: "'He says they are quieter and cheaper.'" },
        { t: "mc", q: "This hotel is ___ than the other one.", o: ["expensiver", "more expensive", "most expensive"], a: 1, x: "Long adjective → more + adjective." },
        { t: "fill", q: "My new job is ___ (good) than my old one.", a: ["better"], x: "good → better (irregular)." },
        { t: "fill", q: "Today is ___ (hot) than yesterday.", a: ["hotter"], x: "hot → hotter (double the consonant)." },
        { t: "fill", q: "We're ___ to visit Rome next summer.", a: ["going"], x: "be going to + verb." },
        { t: "order", a: ["She", "is", "going", "to", "study", "medicine"], p: ".", x: "Subject + be + going to + verb." },
        { t: "listen", audio: "Next year I'm going to learn to drive, because the bus is slower than a car.", q: "What is the speaker going to do next year?", o: ["Buy a bus pass", "Learn to drive", "Move house", "Change jobs"], a: 1, x: "'I'm going to learn to drive.'" },
        { t: "mc", q: "Which is correct?", o: ["The test was more easy than I thought.", "The test was easier than I thought.", "The test was easyer than I thought."], a: 1, x: "easy → easier." }
      ],
      speaking: ["I'm going to visit my friend tomorrow.", "The city is bigger than my town.", "This one is cheaper."]
    },

    /* ===== B1 ===== */
    {
      id: "b1-1", level: 3, title: "Life experiences", topic: "Experiences & achievements",
      focus: ["grammar", "reading"],
      objectives: ["Talk about life experiences", "Choose between present perfect and past simple", "Use 'for' and 'since'"],
      grammar: {
        title: "Present perfect vs past simple",
        html: `<p><b>Present perfect</b> (have / has + past participle) connects the past to now:</p>
<ul><li>Experiences (time not stated): <i>Have you <b>ever been</b> to Japan?</i></li>
<li>Unfinished time: <i>I've <b>lived</b> here <b>for</b> five years / <b>since</b> 2019.</i></li>
<li>Recent results: <i>I've <b>lost</b> my keys.</i> (I can't get in now)</li></ul>
<p><b>Past simple</b> for a finished time: <i>I <b>went</b> to Japan <b>in 2019</b>.</i> Never use the present perfect with <i>yesterday, last year, in 2019</i>.</p>
<p><b>for</b> + a period (for ten years) · <b>since</b> + a starting point (since 2015, since Monday)</p>`,
        examples: ["I've never ridden a horse.", "She has worked here since March.", "We met in 2016 and have been friends ever since."]
      },
      vocab: [
        ["experience", "something that happens to you", "Living abroad was a great experience."],
        ["abroad", "in or to another country", "Have you ever worked abroad?"],
        ["ever", "at any time (in questions)", "Have you ever met someone famous?"],
        ["recently", "not long ago", "I've recently started yoga."],
        ["achieve", "succeed in doing something", "She achieved her goal."],
        ["challenge", "something difficult that tests you", "Learning Chinese is a challenge."]
      ],
      reading: {
        title: "Behind the lens",
        text: "Daniel has worked as a photographer for ten years. He has travelled to more than thirty countries and has taken pictures of everything from festivals to wildlife. His biggest challenge came in 2020, when he spent two months in the Arctic. 'It was incredibly cold,' he says, 'but it was the best experience I've ever had.' Recently, he has started teaching photography online."
      },
      ex: [
        { t: "mc", q: "Reading: How long has Daniel worked as a photographer?", o: ["Two months", "Ten years", "Since 2020", "Thirty years"], a: 1, x: "'for ten years'." },
        { t: "mc", q: "I ___ to Japan twice.", o: ["have been", "was", "am being"], a: 0, x: "Experience, no specific time → present perfect." },
        { t: "fill", q: "She has lived here ___ 2015.", a: ["since"], x: "since + a point in time." },
        { t: "fill", q: "We've known each other ___ ten years.", a: ["for"], x: "for + a period of time." },
        { t: "fill", q: "___ you ever eaten sushi?", a: ["have"], x: "Have you ever + past participle?" },
        { t: "mc", q: "Which is correct?", o: ["I have seen him yesterday.", "I saw him yesterday.", "I have saw him yesterday."], a: 1, x: "'yesterday' is finished time → past simple." },
        { t: "order", a: ["I've", "never", "ridden", "a", "horse"], p: ".", x: "never goes between have and the participle." },
        { t: "listen", audio: "I've just finished my exams, so I'm going to relax this weekend.", q: "What has the speaker just done?", o: ["Started a new job", "Finished exams", "Booked a holiday", "Moved house"], a: 1, x: "'I've just finished my exams.'" }
      ],
      speaking: ["Have you ever been abroad?", "I've lived here for three years.", "It was the best experience I've ever had."]
    },
    {
      id: "b1-2", level: 3, title: "What if…?", topic: "Work & consequences",
      focus: ["grammar", "listening"],
      objectives: ["Talk about facts and real future possibilities", "Use zero and first conditionals", "Use 'unless' correctly"],
      grammar: {
        title: "Zero & first conditionals",
        html: `<p><b>Zero conditional</b> — general truths: <b>If + present, present</b><br><i>If you heat ice, it melts.</i></p>
<p><b>First conditional</b> — real future possibilities: <b>If + present, will + verb</b><br><i>If it rains, we'll stay at home.</i></p>
<p><b>Unless</b> = if… not: <i><b>Unless</b> you hurry, you'll miss the bus.</i></p>
<p>⚠ Don't use <i>will</i> in the if-clause: <s>If it will rain</s> → If it <b>rains</b>.</p>`,
        examples: ["If you press this button, the machine starts.", "If I see Tom, I'll tell him.", "We won't finish unless everyone helps."]
      },
      vocab: [
        ["likely", "probably going to happen", "It's likely to rain later."],
        ["deadline", "the time by which something must be done", "The deadline is Friday."],
        ["promise", "say you will definitely do something", "I promise I'll call you."],
        ["unless", "except if", "Don't call unless it's urgent."],
        ["warn", "tell someone about a danger", "They warned us about the storm."],
        ["consequence", "a result of an action", "Think about the consequences."]
      ],
      reading: {
        title: "A message from the manager",
        text: "Our manager sent a message this morning: 'If we finish the report by Friday, the client will sign the contract next week. However, unless everyone sends their data by Wednesday, we won't meet the deadline. If you have any problems, tell me as soon as possible. I promise I'll help.'"
      },
      ex: [
        { t: "mc", q: "Reading: What will happen if the report is finished by Friday?", o: ["The manager will leave", "The client will sign the contract", "The deadline will change", "Everyone will get a bonus"], a: 1, x: "'the client will sign the contract next week.'" },
        { t: "mc", q: "If you heat water to 100°C, it ___.", o: ["boils", "will boiling", "boiled"], a: 0, x: "A general truth → zero conditional." },
        { t: "fill", q: "If I see Tom, I ___ (tell) him.", a: ["will tell", "'ll tell"], x: "First conditional → will + verb." },
        { t: "fill", q: "We'll miss the bus ___ we hurry.", a: ["unless"], x: "unless = if not." },
        { t: "mc", q: "If it ___ tomorrow, we'll cancel the picnic.", o: ["will rain", "rains", "rained"], a: 1, x: "Present simple in the if-clause." },
        { t: "order", a: ["I'll", "call", "you", "if", "I'm", "late"], p: ".", x: "The if-clause can come second (no comma)." },
        { t: "listen", audio: "Unless the weather improves, the match will be postponed until next Saturday.", q: "What will happen if the weather doesn't improve?", o: ["The match will be cancelled forever", "The match will be postponed", "The match will be played indoors", "The match will start earlier"], a: 1, x: "'will be postponed until next Saturday.'" },
        { t: "mc", q: "Choose the correct sentence.", o: ["If you will study, you will pass.", "If you study, you will pass.", "If you studied, you will pass."], a: 1, x: "If + present, will + verb." }
      ],
      speaking: ["If it rains, we'll stay at home.", "I'll help you if you need me.", "Unless you hurry, you'll be late."]
    },

    /* ===== B2 ===== */
    {
      id: "b2-1", level: 4, title: "Regrets and wishes", topic: "Life choices",
      focus: ["grammar", "reading"],
      objectives: ["Talk about unreal past situations", "Express regret with 'wish' and 'if only'", "Use mixed conditionals"],
      grammar: {
        title: "Third conditional, mixed conditionals & wish",
        html: `<p><b>Third conditional</b> — imagining a different past: <b>If + past perfect, would have + past participle</b><br><i>If I <b>had left</b> earlier, I <b>wouldn't have missed</b> the train.</i></p>
<p><b>Mixed conditional</b> — past cause, present result:<br><i>If I <b>had studied</b> medicine, I <b>would be</b> a doctor now.</i></p>
<p><b>Wish / If only</b>:</p>
<ul><li>+ past simple → present regret: <i>I wish I <b>had</b> more time.</i></li>
<li>+ past perfect → past regret: <i>I wish I <b>hadn't said</b> that.</i></li>
<li>+ would → annoyance / wanting change: <i>I wish you <b>would</b> stop talking.</i></li></ul>`,
        examples: ["If she'd taken the job, she would have moved abroad.", "I wish I lived closer to the sea.", "If only I hadn't sold that car!"]
      },
      vocab: [
        ["regret", "feel sorry about something you did", "I regret not studying harder."],
        ["opportunity", "a chance to do something", "It was a great opportunity."],
        ["in hindsight", "looking back with what you know now", "In hindsight, it was a mistake."],
        ["turn down", "refuse an offer", "She turned down the job."],
        ["trade-off", "a balance between two things you can't both have", "There's a trade-off between price and quality."],
        ["in retrospect", "thinking about the past", "In retrospect, we should have waited."]
      ],
      reading: {
        title: "The road not taken",
        text: "Looking back, Sophie sometimes regrets turning down a job offer in Singapore. 'If I had accepted it, I would have gained international experience,' she admits. 'But if I had moved, I wouldn't have met my husband.' In hindsight, she believes most decisions involve trade-offs. 'I wish I had worried less at the time. Every path has its own opportunities.'"
      },
      ex: [
        { t: "mc", q: "Reading: What does Sophie wish?", o: ["That she had moved to Singapore", "That she had worried less", "That she had never met her husband", "That she had a different job now"], a: 1, x: "'I wish I had worried less at the time.'" },
        { t: "mc", q: "If she had studied harder, she ___ the exam.", o: ["would pass", "would have passed", "will pass", "passed"], a: 1, x: "Third conditional → would have + participle." },
        { t: "fill", q: "I wish I ___ (have) a bigger flat.", a: ["had"], x: "Present regret → wish + past simple." },
        { t: "fill", q: "If we had left earlier, we ___ have missed the train.", a: ["wouldn't", "would not"], x: "would not have + participle." },
        { t: "fill", q: "I wish I ___ (not / say) that to her yesterday.", a: ["hadn't said", "had not said"], x: "Past regret → wish + past perfect." },
        { t: "order", a: ["I", "wish", "I", "hadn't", "quit", "the", "job"], p: ".", x: "wish + past perfect for a past regret." },
        { t: "listen", audio: "If I'd checked the weather forecast, I wouldn't have planned a barbecue on the wettest day of the year.", q: "What happened?", o: ["The barbecue was a success", "The speaker didn't check the forecast and it rained", "The speaker cancelled because of the forecast", "The weather was perfect"], a: 1, x: "Third conditional = the opposite happened: they didn't check, and it was wet." },
        { t: "mc", q: "If I had taken that job, I ___ in London now.", o: ["will live", "would be living", "would have lived"], a: 1, x: "Mixed conditional: past condition, present result." }
      ],
      speaking: ["If I had known, I would have helped.", "I wish I had more free time.", "In hindsight, it was the right decision."]
    },
    {
      id: "b2-2", level: 4, title: "He said that…", topic: "News & reporting",
      focus: ["grammar", "vocabulary", "listening"],
      objectives: ["Report statements and questions", "Use reporting verbs (claim, admit, deny, insist)", "Change tenses, pronouns and time words"],
      grammar: {
        title: "Reported speech",
        html: `<p>When reporting, tenses usually move <b>one step back</b>:</p>
<table class="gtable"><tr><th>Direct</th><th>Reported</th></tr>
<tr><td>"I <b>am</b> tired."</td><td>She said she <b>was</b> tired.</td></tr>
<tr><td>"We <b>will</b> call."</td><td>They said they <b>would</b> call.</td></tr>
<tr><td>"I <b>have finished</b> / I <b>finished</b>."</td><td>He said he <b>had finished</b>.</td></tr>
<tr><td>"I <b>can</b> help."</td><td>She said she <b>could</b> help.</td></tr></table>
<p><b>Reported questions</b> use statement word order and no <i>do/does/did</i>:<br><i>"Where do you live?" → He asked where I <b>lived</b>.</i><br>Yes/No questions → <b>if / whether</b>: <i>She asked <b>if</b> I was ready.</i></p>
<p>Time words change: today → that day, tomorrow → the next day, here → there.</p>`,
        examples: ["She claimed that sales had risen.", "He denied breaking the window.", "They asked whether we could stay."]
      },
      vocab: [
        ["claim", "say something is true (without proof)", "He claimed he was innocent."],
        ["admit", "agree that something bad is true", "She admitted making a mistake."],
        ["deny", "say something is not true", "He denied taking the money."],
        ["insist", "say firmly", "She insisted that she was right."],
        ["point out", "draw attention to a fact", "He pointed out a problem."],
        ["whether", "if (used for alternatives)", "I don't know whether to go."]
      ],
      reading: {
        title: "Press conference",
        text: "At yesterday's press conference, the CEO claimed that sales had risen by 12%. When a journalist asked whether the company would cut jobs, she insisted that no redundancies were planned. However, she admitted that some departments might be restructured. She pointed out that the market was becoming increasingly competitive."
      },
      ex: [
        { t: "mc", q: "Reading: What did the CEO admit?", o: ["Sales had fallen", "Jobs would be cut", "Some departments might be restructured", "The market was easy"], a: 2, x: "'she admitted that some departments might be restructured.'" },
        { t: "fill", q: "'I am busy.' → She said she ___ busy.", a: ["was"], x: "am → was." },
        { t: "fill", q: "'We will call you.' → They said they ___ call me.", a: ["would"], x: "will → would." },
        { t: "mc", q: "'Where do you work?' → He asked me where ___.", o: ["do I work", "I worked", "did I work", "I work"], a: 1, x: "Statement word order + backshift." },
        { t: "fill", q: "'Are you coming?' → She asked ___ I was coming.", a: ["if", "whether"], x: "Yes/No question → if / whether." },
        { t: "mc", q: "He ___ breaking the window, but nobody believed him.", o: ["denied", "refused", "rejected", "said"], a: 0, x: "deny + -ing." },
        { t: "order", a: ["She", "asked", "me", "if", "I", "was", "ready"], p: ".", x: "asked + object + if + statement order." },
        { t: "listen", audio: "My doctor told me that I needed to get more sleep and suggested that I stop drinking coffee after lunch.", q: "What did the doctor suggest?", o: ["Drinking more coffee", "Not drinking coffee after lunch", "Sleeping less", "Eating lunch later"], a: 1, x: "'suggested that I stop drinking coffee after lunch.'" }
      ],
      speaking: ["She said that she was tired.", "He asked me where I lived.", "They promised they would come."]
    },

    /* ===== C1 ===== */
    {
      id: "c1-1", level: 5, title: "For emphasis", topic: "Science & society",
      focus: ["grammar", "reading"],
      objectives: ["Use negative inversion for emphasis", "Form conditionals without 'if'", "Use cleft sentences to focus information"],
      grammar: {
        title: "Inversion & cleft sentences",
        html: `<p><b>Negative / limiting adverbials</b> at the start of a sentence → auxiliary + subject:</p>
<ul><li><b>Never have I</b> seen such chaos.</li>
<li><b>Rarely do</b> we get this opportunity.</li>
<li><b>Not until</b> the results came in <b>did</b> they believe it.</li>
<li><b>No sooner had</b> I sat down <b>than</b> the phone rang. / <b>Hardly had</b> I… <b>when</b>…</li>
<li><b>Only when / Only after</b> the storm passed <b>could</b> we leave.</li></ul>
<p><b>Inverted conditionals</b> (formal): <b>Had</b> I known… · <b>Should</b> you need… · <b>Were</b> it not for…</p>
<p><b>Cleft sentences</b>: <i><b>What</b> I need <b>is</b> a holiday.</i> · <i><b>It was</b> Maria <b>who</b> solved it.</i></p>`,
        examples: ["Under no circumstances should you open this door.", "Had we left on time, we would have caught the flight.", "What surprised me most was his reaction."]
      },
      vocab: [
        ["nevertheless", "despite that", "It was risky; nevertheless, they continued."],
        ["undermine", "gradually weaken", "Leaks undermined trust in the leadership."],
        ["unprecedented", "never having happened before", "The crisis was unprecedented."],
        ["scrutiny", "careful, critical examination", "The plan came under close scrutiny."],
        ["profound", "very great or deep", "The discovery had a profound impact."],
        ["robust", "strong and reliable", "The data are robust."]
      ],
      reading: {
        title: "A discovery under the microscope",
        text: "Rarely has a scientific discovery attracted such intense public scrutiny. Not until the results were replicated by independent laboratories did the wider community accept them. What surprised researchers most was not the finding itself but the speed with which it was adopted into policy. Had the data been less robust, the consequences could have been profound."
      },
      ex: [
        { t: "mc", q: "Reading: When did the wider community accept the results?", o: ["Immediately", "After independent replication", "After it became policy", "Never"], a: 1, x: "'Not until the results were replicated … did the wider community accept them.'" },
        { t: "mc", q: "Never ___ such a beautiful sunset.", o: ["I have seen", "have I seen", "I saw", "did I saw"], a: 1, x: "Negative adverbial → inversion." },
        { t: "fill", q: "No sooner ___ we sat down than the phone rang.", a: ["had"], x: "No sooner had + subject + participle … than." },
        { t: "fill", q: "___ I known about the problem, I would have acted sooner.", a: ["had"], x: "Had I known = If I had known." },
        { t: "mc", q: "Only when the storm passed ___ leave the shelter.", o: ["we could", "could we", "we can", "can we"], a: 1, x: "Only when … → inversion in the main clause." },
        { t: "fill", q: "___ I need right now is a long holiday.", a: ["what"], x: "Cleft: What + clause + is …" },
        { t: "order", a: ["Not", "until", "later", "did", "I", "realise", "the", "truth"], p: ".", x: "Not until … + did + subject + verb." },
        { t: "listen", audio: "Under no circumstances should passengers leave their luggage unattended.", q: "What does this announcement mean?", o: ["Passengers may sometimes leave bags", "Passengers must never leave bags unattended", "Luggage will be removed", "Passengers should check in bags"], a: 1, x: "Under no circumstances = never." }
      ],
      speaking: ["Never have I seen anything like it.", "Had I known, I would have come.", "What matters most is the result."]
    },
    {
      id: "c1-2", level: 5, title: "Hedging your claims", topic: "Academic & professional writing",
      focus: ["vocabulary", "reading", "listening"],
      objectives: ["Soften claims appropriately", "Use impersonal reporting structures", "Distinguish correlation from causation in texts"],
      grammar: {
        title: "Hedging & impersonal structures",
        html: `<p><b>Hedging</b> makes claims more cautious and academic:</p>
<ul><li>Modals: <b>may, might, could</b> — <i>This <b>may</b> indicate…</i></li>
<li>Tentative verbs: <b>appear, seem, suggest, tend to</b> — <i>The data <b>appear to suggest</b>…</i></li>
<li>Adverbs: <b>arguably, possibly, presumably, potentially, to some extent</b></li>
<li>Impersonal: <i><b>It is widely believed that</b>… · <b>There is evidence to suggest that</b>…</i></li>
<li>Passive reporting: <i>The minister <b>is thought to have</b> resigned.</i></li></ul>
<p>Compare <b>boosters</b> (clearly, undoubtedly, it is certain that) — use them only when evidence is strong.</p>`,
        examples: ["These findings would seem to support the hypothesis.", "It could be argued that the policy has failed.", "The suspect is believed to be in France."]
      },
      vocab: [
        ["arguably", "it can be argued that", "She is arguably the best writer of her generation."],
        ["substantiate", "provide evidence to support", "The claims could not be substantiated."],
        ["tentative", "not certain or fixed", "We reached a tentative agreement."],
        ["correlation", "a connection between two things", "There's a correlation between income and health."],
        ["inconclusive", "not leading to a firm result", "The tests were inconclusive."],
        ["implication", "a possible future effect or result", "Consider the implications of the policy."]
      ],
      reading: {
        title: "Screens and sleep",
        text: "The data appear to suggest a correlation between screen time and reduced sleep quality among teenagers. However, it would be premature to infer causation: the findings are, at this stage, inconclusive. It is conceivable that underlying factors, such as stress, contribute to both. Further longitudinal research would be needed to substantiate these tentative conclusions."
      },
      ex: [
        { t: "mc", q: "Reading: What is the writer's position?", o: ["Screen time definitely causes poor sleep", "There is a correlation, but causation is unproven", "There is no link at all", "More research is unnecessary"], a: 1, x: "'it would be premature to infer causation.'" },
        { t: "mc", q: "Which sentence is most appropriately hedged for an academic essay?", o: ["This proves that diet causes cancer.", "This may indicate a link between diet and cancer.", "Diet totally causes cancer.", "Everyone knows diet causes cancer."], a: 1, x: "'may indicate' is cautious and precise." },
        { t: "fill", q: "The minister is ___ to have resigned, although this has not been confirmed.", a: ["thought", "believed", "said", "reported", "understood", "rumoured", "rumored"], x: "Passive reporting: is thought / believed / said to have…" },
        { t: "fill", q: "There is some evidence to ___ that the policy has worked.", a: ["suggest"], x: "Fixed phrase: there is evidence to suggest that…" },
        { t: "mc", q: "The results ___ to contradict earlier studies.", o: ["appear", "are appearing", "appearing", "appeared being"], a: 0, x: "appear + to-infinitive." },
        { t: "mc", q: "'Inconclusive' means:", o: ["Final and certain", "Not leading to a firm result", "Clearly negative", "Completely wrong"], a: 1, x: "in- (not) + conclusive." },
        { t: "order", a: ["It", "is", "widely", "believed", "that", "prices", "will", "rise"], p: ".", x: "Impersonal structure: It is + adverb + believed that…" },
        { t: "listen", audio: "While the initial figures are encouraging, it would be unwise to draw firm conclusions from such a small sample.", q: "What is the speaker's view?", o: ["The figures prove success", "More data is needed before drawing conclusions", "The sample is too large", "The conclusions are already clear"], a: 1, x: "'unwise to draw firm conclusions from such a small sample.'" }
      ],
      speaking: ["The data appear to suggest a link.", "It is widely believed that prices will rise.", "Further research would be needed."]
    },

    /* ===== C2 ===== */
    {
      id: "c2-1", level: 6, title: "Register & the subjunctive", topic: "Formal communication",
      focus: ["grammar", "vocabulary"],
      objectives: ["Use the mandative subjunctive", "Shift between formal and informal register", "Use fixed formal expressions"],
      grammar: {
        title: "The subjunctive & formal register",
        html: `<p><b>Mandative subjunctive</b>: after <i>demand, insist, recommend, propose, suggest</i> and <i>it is essential / vital / imperative that</i>, use the <b>base form</b> for all persons:</p>
<ul><li>The board recommended that she <b>be</b> appointed.</li>
<li>It is vital that he <b>attend</b> the meeting. (not <s>attends</s>)</li></ul>
<p><b>Fixed subjunctive expressions</b>: <i>be that as it may · come what may · suffice it to say · if need be · so be it</i></p>
<p><b>Formal register</b>: prefer nominalisation (<i>the decision to expand</i>), single Latinate verbs over phrasal verbs (<i>investigate</i> vs <i>look into</i>), and avoid contractions.</p>`,
        examples: ["The committee insisted that the report be published.", "Come what may, we will finish on time.", "The matter requires further investigation."]
      },
      vocab: [
        ["commensurate", "corresponding in size or degree", "Salary will be commensurate with experience."],
        ["mitigate", "make less severe", "Steps were taken to mitigate the risk."],
        ["ostensibly", "apparently, but perhaps not really", "He left, ostensibly for health reasons."],
        ["juxtapose", "place side by side for contrast", "The film juxtaposes wealth and poverty."],
        ["pervasive", "spreading widely throughout", "A pervasive sense of unease."],
        ["cogent", "clear, logical and convincing", "She made a cogent case for reform."]
      ],
      reading: {
        title: "Committee minutes",
        text: "The committee has recommended that the proposal be reconsidered in light of new evidence. Ostensibly, the delay is procedural; however, it is widely understood that the original cost estimates were not commensurate with the project's scope. Be that as it may, it is essential that any revised plan mitigate the risks identified in the audit."
      },
      ex: [
        { t: "mc", q: "Reading: What does 'ostensibly' suggest here?", o: ["The stated reason may not be the real one", "The delay is definitely procedural", "The committee is lying deliberately", "The delay is permanent"], a: 0, x: "'Ostensibly' = apparently, and the next clause hints at another reason." },
        { t: "mc", q: "It is essential that every applicant ___ the form in person.", o: ["submits", "submit", "submitted", "will submit"], a: 1, x: "Mandative subjunctive → base form." },
        { t: "fill", q: "The doctor insisted that he ___ (rest) for a week.", a: ["rest"], x: "insist that + base form." },
        { t: "mc", q: "Choose the most formal equivalent of 'We need to look into the problem.'", o: ["We gotta check the problem out.", "The matter requires investigation.", "Let's look into it.", "We should check it."], a: 1, x: "Nominalisation + Latinate vocabulary." },
        { t: "fill", q: "Suffice it to ___ that the meeting did not go well.", a: ["say"], x: "Fixed expression: suffice it to say." },
        { t: "mc", q: "A 'cogent' argument is:", o: ["Confusing", "Clear and convincing", "Long-winded", "Emotional"], a: 1, x: "cogent = logical and persuasive." },
        { t: "order", a: ["She", "demanded", "that", "he", "be", "dismissed"], p: ".", x: "demand that + subject + base form (be)." },
        { t: "listen", audio: "Be that as it may, the board's decision stands, and it is imperative that all staff comply with the new guidelines.", q: "What does the speaker require?", o: ["Staff to challenge the decision", "Staff to follow the guidelines", "The board to reconsider", "Staff to ignore the guidelines"], a: 1, x: "'imperative that all staff comply'." }
      ],
      speaking: ["It is essential that he attend the meeting.", "Be that as it may, the decision stands.", "Suffice it to say, it was a success."]
    },
    {
      id: "c2-2", level: 6, title: "Nuance & rhetoric", topic: "Persuasion & public speaking",
      focus: ["vocabulary", "reading", "listening"],
      objectives: ["Recognise rhetorical devices", "Distinguish connotations of near-synonyms", "Use advanced idioms precisely"],
      grammar: {
        title: "Rhetorical devices & connotation",
        html: `<ul><li><b>Tricolon</b> (rule of three): <i>"It will cost too much, take too long and achieve too little."</i></li>
<li><b>Antithesis</b>: contrasting ideas in parallel — <i>"The question is not whether, but how."</i></li>
<li><b>Litotes</b> (understatement by negation): <i>"no small achievement"</i> = a big achievement</li>
<li><b>Rhetorical question</b>: asked for effect, not an answer.</li></ul>
<p><b>Connotation</b>: near-synonyms carry different attitudes — <i>frugal / thrifty</i> (positive) vs <i>stingy / tight-fisted</i> (negative); <i>confident</i> vs <i>arrogant</i>; <i>curious</i> vs <i>nosy</i>.</p>`,
        examples: ["We came, we listened, we acted.", "It's not a setback; it's a detour.", "Her contribution was not insignificant."]
      },
      vocab: [
        ["frugal", "careful with money (positive)", "A frugal lifestyle helped them save."],
        ["stingy", "unwilling to spend or give (negative)", "He's too stingy to buy a round."],
        ["a double-edged sword", "something with both good and bad effects", "Fame is a double-edged sword."],
        ["toe the line", "obey the rules or official policy", "Ministers are expected to toe the line."],
        ["a moot point", "a matter no longer worth discussing / open to debate", "Whether we'd have won is a moot point."],
        ["play devil's advocate", "argue the opposite side to test an idea", "Let me play devil's advocate for a moment."]
      ],
      reading: {
        title: "A speech for the future",
        text: "We were told it could not be done. We were told it would cost too much, take too long and achieve too little. And yet here we stand. Technology, of course, is a double-edged sword: it can connect or divide, empower or exclude. The question is not whether we embrace it, but how. It would be no small achievement if, a decade from now, we could say we chose wisely."
      },
      ex: [
        { t: "mc", q: "Reading: 'cost too much, take too long and achieve too little' is an example of:", o: ["Tricolon (rule of three)", "Rhetorical question", "Metaphor", "Alliteration"], a: 0, x: "Three parallel phrases = tricolon." },
        { t: "mc", q: "'It would be no small achievement' is an example of:", o: ["Hyperbole", "Litotes (understatement)", "Simile", "Onomatopoeia"], a: 1, x: "Negating the opposite to emphasise." },
        { t: "mc", q: "Which word has the most positive connotation?", o: ["stingy", "miserly", "frugal", "tight-fisted"], a: 2, x: "frugal = sensible with money." },
        { t: "fill", q: "Whether we would have won anyway is a ___ point now.", a: ["moot"], x: "a moot point." },
        { t: "fill", q: "She's only playing devil's ___; she doesn't really believe it.", a: ["advocate"], x: "play devil's advocate." },
        { t: "fill", q: "Employees who refuse to toe the ___ are often sidelined.", a: ["line"], x: "toe the line." },
        { t: "order", a: ["The", "question", "is", "not", "whether", "but", "how"], p: ".", x: "Antithesis: not X but Y." },
        { t: "listen", audio: "Let us be clear: this setback is not a defeat, merely a detour, and detours, as any traveller knows, often reveal the most interesting roads.", q: "How does the speaker view the setback?", o: ["As a final defeat", "As a temporary change of course that may bring benefits", "As irrelevant", "As a reason to give up"], a: 1, x: "'not a defeat, merely a detour … reveal the most interesting roads.'" }
      ],
      speaking: ["The question is not whether, but how.", "Technology is a double-edged sword.", "It was no small achievement."]
    }
  ];

  return { SKILLS, LEVELS, SKILL_TIPS, TEST_BANK, UNITS };
})();
