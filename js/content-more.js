/* LevelUp English — a fourth unit for every level, their question generators,
   and two-voice dialogue listening questions for every level. */
(function () {
  "use strict";
  const D = window.LU_DATA;
  const GEN = window.LU_GEN;
  const G = GEN.register;
  const { pick, sample, cap, others, person, twoPeople, CITIES, DAYS } = GEN.helpers;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  D.UNITS.push(
    {
      id: "a1-4", level: 1, title: "What can you do?", topic: "Abilities & free time",
      focus: ["grammar", "speaking"],
      objectives: ["Say what you can and can't do", "Talk about hobbies with like / love / hate + -ing", "Ask about abilities"],
      grammar: {
        title: "can / can't and like + -ing",
        html: `<p><b>can</b> is the same for every person. After it, use the <b>base verb</b>:</p>
<ul><li><i>I <b>can swim</b>. She <b>can speak</b> French.</i> (not <s>she cans</s>, not <s>can to speak</s>)</li><li><i>He <b>can't</b> drive.</i> · <i><b>Can</b> you cook? Yes, I <b>can</b>. / No, I <b>can't</b>.</i></li></ul>
<p>After <b>like, love, enjoy, hate</b>, use the <b>-ing</b> form for hobbies:</p>
<ul><li><i>I <b>love dancing</b>. She <b>enjoys reading</b>. They <b>hate running</b>.</i></li></ul>`,
        examples: ["I can play the guitar, but I can't sing.", "Can your brother swim?", "We enjoy cooking at the weekend."]
      },
      vocab: [
        ["swim", "move through water using your arms and legs", "I can swim very well."],
        ["draw", "make a picture with a pen or pencil", "My daughter loves drawing animals."],
        ["guitar", "a musical instrument with strings", "He plays the guitar in a band."],
        ["hobby", "something you enjoy doing in your free time", "My hobby is photography."],
        ["free time", "time when you are not working or studying", "What do you do in your free time?"],
        ["team", "a group of people who play or work together", "She plays in a football team."]
      ],
      reading: {
        title: "Our new members",
        text: "Welcome to the City Sports Club! This month we have three new members. Sam is twenty-two. He can swim and he loves running, but he can't play tennis. He wants to learn. Lucy is thirty. She enjoys yoga and she can dance very well. She hates running! Omar is forty-five. He can play football and basketball, and he is in a team on Saturdays. In his free time, he also likes cooking for his family."
      },
      ex: [
        { t: "mc", q: "Reading: What can't Sam do?", o: ["swim", "run", "play tennis", "dance"], a: 2, x: "'he can't play tennis. He wants to learn.'" },
        { t: "mc", q: "Reading: Who hates running?", o: ["Sam", "Lucy", "Omar", "Nobody"], a: 1, x: "'She hates running!'" },
        { t: "mc", q: "She ___ speak three languages.", o: ["can", "cans", "can to", "is can"], a: 0, x: "can + base verb, the same for every person." },
        { t: "fill", q: "I love ___ (read) books in bed.", a: ["reading"], x: "love + -ing." },
        { t: "fill", q: "___ you ride a bike? Yes, I can.", a: ["can"], x: "Questions: Can + subject + verb?" },
        { t: "mc", q: "He enjoys ___ in the sea.", o: ["swim", "swimming", "to swims", "swims"], a: 1, x: "enjoy + -ing." },
        { t: "order", a: ["My", "brother", "can't", "drive", "a", "car"], p: ".", x: "Subject + can't + base verb." },
        { t: "listen", audio: "Anna: Can you play an instrument, Tom?\nTom: Yes, I can play the piano. But I can't sing at all!\nAnna: Me neither. I love dancing, though.", q: "What can Tom do?", o: ["sing", "play the piano", "dance", "play the guitar"], a: 1, x: "Tom says 'I can play the piano. But I can't sing.'" }
      ],
      speaking: ["I can swim, but I can't ski.", "What do you like doing in your free time?", "I really enjoy cooking for my friends."]
    },
    {
      id: "a2-4", level: 2, title: "Travel stories", topic: "Travel & experiences",
      focus: ["grammar", "listening"],
      objectives: ["Tell a story about a trip", "Use the past continuous for background", "Use 'when' and 'while' to connect events"],
      grammar: {
        title: "Past continuous and past simple",
        html: `<p>The <b>past continuous</b> (<b>was/were + -ing</b>) describes an action in progress at a time in the past. The <b>past simple</b> describes a shorter action that interrupted it.</p>
<ul><li><i>I <b>was walking</b> to the hotel when it <b>started</b> to rain.</i></li><li><i>While we <b>were waiting</b> for the bus, we <b>met</b> an old friend.</i></li></ul>
<p>Use <b>when</b> + past simple for the short action, and <b>while</b> + past continuous for the longer one.</p>
<p>I / he / she / it <b>was</b> + -ing · you / we / they <b>were</b> + -ing</p>`,
        examples: ["She was sleeping when the plane landed.", "While they were swimming, someone took their bags.", "What were you doing at eight o'clock?"]
      },
      vocab: [
        ["luggage", "the bags you take on a journey", "Our luggage arrived two days late."],
        ["passport", "the document you need to travel to other countries", "Don't forget your passport!"],
        ["delay", "a time when something is later than planned", "There was a two-hour delay at the airport."],
        ["sightseeing", "visiting famous places as a tourist", "We went sightseeing in the old town."],
        ["lost", "not able to find your way", "We got lost in the mountains."],
        ["souvenir", "something you buy to remember a place", "I bought a small souvenir for my mum."]
      ],
      reading: {
        title: "A holiday to remember",
        text: "Last summer, Elena and her brother went to Lisbon. On the first day, they were walking around the old town when Elena realised that her bag was open. Her passport wasn't there! While her brother was calling the hotel, a young man came up to them. He was holding the passport. He found it on a tram and he was looking for its owner. Elena was so happy that she bought him a coffee. They spent the afternoon sightseeing together, and they are still friends today."
      },
      ex: [
        { t: "mc", q: "Reading: What were Elena and her brother doing when she noticed the problem?", o: ["eating in a café", "walking around the old town", "riding a tram", "calling the hotel"], a: 1, x: "'they were walking around the old town when Elena realised…'" },
        { t: "mc", q: "Reading: Where did the young man find the passport?", o: ["in the hotel", "in a café", "on a tram", "in the street"], a: 2, x: "'He found it on a tram'." },
        { t: "mc", q: "I ___ TV when the phone rang.", o: ["watched", "was watching", "were watching", "am watching"], a: 1, x: "Longer action in progress → past continuous; I → was." },
        { t: "fill", q: "While we ___ (wait) for the train, it started to snow.", a: ["were waiting"], x: "while + past continuous; we → were." },
        { t: "mc", q: "She was cooking dinner when her friends ___.", o: ["were arriving", "arrived", "arrive", "was arrived"], a: 1, x: "The short action that interrupts → past simple." },
        { t: "fill", q: "What ___ you doing at 10 o'clock last night?", a: ["were"], x: "you → were + -ing." },
        { t: "order", a: ["They", "were", "sleeping", "when", "the", "plane", "landed"], p: ".", x: "past continuous + when + past simple." },
        { t: "listen", audio: "Mark: How was your trip to Rome?\nJulia: Great, but on the last day we were having lunch when I realised I didn't have my phone.\nMark: Oh no! Where was it?\nJulia: In the taxi! The driver brought it back an hour later.", q: "Where did Julia leave her phone?", o: ["in a restaurant", "in a taxi", "in the hotel", "on the plane"], a: 1, x: "'In the taxi! The driver brought it back.'" }
      ],
      speaking: ["I was waiting for the bus when it started to rain.", "What were you doing at this time yesterday?", "While we were travelling, we met some interesting people."]
    },
    {
      id: "b1-4", level: 3, title: "People and places", topic: "Work & describing",
      focus: ["grammar", "writing"],
      objectives: ["Join sentences with who, which, that, where and whose", "Describe people, jobs and places precisely", "Know when you can leave out the relative pronoun"],
      grammar: {
        title: "Relative clauses",
        html: `<p>Relative clauses give information about a noun:</p>
<ul><li><b>who</b> / <b>that</b> for people: <i>She's the manager <b>who</b> hired me.</i></li><li><b>which</b> / <b>that</b> for things: <i>This is the laptop <b>which</b> I bought.</i></li><li><b>where</b> for places: <i>That's the café <b>where</b> we met.</i></li><li><b>whose</b> for possession: <i>He's the colleague <b>whose</b> car was stolen.</i></li></ul>
<p>You can leave out who/which/that when it is the <b>object</b> of the clause: <i>The book (that) I'm reading is great.</i></p>
<p><b>Non-defining</b> clauses add extra information, use commas and never use <i>that</i>: <i>My boss, <b>who</b> is from Canada, speaks four languages.</i></p>`,
        examples: ["The woman who lives next door is a pilot.", "Is this the train that goes to the airport?", "Paris, where I studied, is a beautiful city."]
      },
      vocab: [
        ["colleague", "a person you work with", "My colleagues are very helpful."],
        ["responsible for", "having the job of dealing with something", "She's responsible for training new staff."],
        ["deadline", "the time by which something must be finished", "The deadline for the report is Friday."],
        ["skill", "an ability to do something well", "Communication is an important skill."],
        ["experienced", "having done something many times", "We need an experienced engineer."],
        ["neighbourhood", "the area around where you live", "It's a quiet neighbourhood with lots of parks."]
      ],
      reading: {
        title: "Meet the team",
        text: "Our office in Toronto, which opened last year, now has twelve people. Priya, who joined us from a bank in London, is responsible for our finances. Carlos is the designer whose posters won an award in March. Most of the team live in the neighbourhood around the office, where there are lots of good cafés. The person that everyone goes to with computer problems is Ken, our IT manager. He's the most experienced member of the team, and the only one who has worked here since the company started."
      },
      ex: [
        { t: "mc", q: "Reading: Who is responsible for the finances?", o: ["Carlos", "Priya", "Ken", "The designer"], a: 1, x: "'Priya … is responsible for our finances.'" },
        { t: "mc", q: "Reading: Ken is the only person who…", o: ["won an award", "worked at a bank", "has worked there since the start", "lives far from the office"], a: 2, x: "'the only one who has worked here since the company started'." },
        { t: "mc", q: "That's the restaurant ___ we had our first date.", o: ["which", "where", "who", "whose"], a: 1, x: "Place + where." },
        { t: "mc", q: "She's the singer ___ song won the competition.", o: ["who", "which", "whose", "that"], a: 2, x: "whose = her song." },
        { t: "fill", q: "The man ___ fixed my car was very friendly.", a: ["who", "that"], x: "People → who or that." },
        { t: "mc", q: "My sister, ___ lives in Spain, is a nurse.", o: ["that", "who", "which", "where"], a: 1, x: "Non-defining clause (with commas) → who, never that." },
        { t: "order", a: ["This", "is", "the", "book", "I", "told", "you", "about"], p: ".", x: "The relative pronoun 'that' is left out because it's the object." },
        { t: "listen", audio: "Interviewer: So tell me about your current job.\nCandidate: I work for a company that makes medical equipment. I'm the person who deals with our customers in Asia.\nInterviewer: And what's the most difficult part?\nCandidate: The time difference! Most of my meetings are early in the morning.", q: "What does the candidate find difficult?", o: ["the customers", "the time difference", "the equipment", "travelling to Asia"], a: 1, x: "'The time difference! Most of my meetings are early in the morning.'" }
      ],
      speaking: ["She's the colleague who helped me on my first day.", "This is the town where I grew up.", "I've got a friend whose father is a famous chef."]
    },
    {
      id: "b2-4", level: 4, title: "Looking ahead", topic: "Future & planning",
      focus: ["grammar", "vocabulary"],
      objectives: ["Talk about actions in progress in the future", "Say what will be completed by a future time", "Use phrases for predictions and plans"],
      grammar: {
        title: "Future continuous and future perfect",
        html: `<p><b>Future continuous</b> (<b>will be + -ing</b>): an action in progress at a time in the future.</p>
<ul><li><i>This time next week I'<b>ll be lying</b> on a beach.</i></li><li><i>Don't call at eight; we'<b>ll be having</b> dinner.</i></li></ul>
<p><b>Future perfect</b> (<b>will have + past participle</b>): an action completed before a time in the future. It's often used with <b>by</b>.</p>
<ul><li><i><b>By</b> 2030, I'<b>ll have finished</b> my degree.</i></li><li><i>By the time you arrive, we'<b>ll have eaten</b>.</i></li></ul>
<p>Use <b>be likely to</b>, <b>be bound to</b> (certain) and <b>be about to</b> (very soon) for predictions and plans.</p>`,
        examples: ["By the end of the year, we'll have opened three new shops.", "At 10 a.m. tomorrow I'll be flying to Madrid.", "Prices are likely to rise next year."]
      },
      vocab: [
        ["forecast", "a statement about what is expected to happen", "The sales forecast for next year is positive."],
        ["long-term", "lasting or planned for a long time", "Our long-term goal is to expand into Asia."],
        ["milestone", "an important stage in a process", "Launching the app was a major milestone."],
        ["be bound to", "be certain to", "With so much traffic, we're bound to be late."],
        ["foresee", "know that something will happen before it does", "Nobody could foresee the problems."],
        ["on track", "making the progress that was planned", "The project is on track to finish in June."]
      ],
      reading: {
        title: "Five-year plan",
        text: "When Hassan started his small coffee business, he wrote a five-year plan. 'By the end of the second year,' he wrote, 'I'll have paid back my bank loan. By year five, I'll be running three cafés and I'll have trained a manager for each one.' Three years later, he is on track: the loan has been repaid and the second café opened in May. He admits he didn't foresee how expensive rents would become, but he is confident. 'This time next year,' he says, 'we'll be serving coffee in the city centre, too.'"
      },
      ex: [
        { t: "mc", q: "Reading: What had Hassan planned to do by the end of year two?", o: ["open three cafés", "pay back his loan", "train three managers", "move to the city centre"], a: 1, x: "'By the end of the second year, I'll have paid back my bank loan.'" },
        { t: "mc", q: "Reading: What didn't Hassan expect?", o: ["high rents", "a lot of customers", "problems with staff", "a second café"], a: 0, x: "'he didn't foresee how expensive rents would become'." },
        { t: "mc", q: "By the time you get home, I ___ dinner.", o: ["will cook", "will have cooked", "will be cooked", "have cooked"], a: 1, x: "Completed before a future time → future perfect." },
        { t: "mc", q: "This time tomorrow, we ___ over the Atlantic.", o: ["will fly", "will have flown", "will be flying", "fly"], a: 2, x: "In progress at a future time → future continuous." },
        { t: "fill", q: "By 2030, scientists will ___ (find) a cure, I hope.", a: ["have found"], x: "will have + past participle." },
        { t: "mc", q: "Look at those clouds. It's ___ to rain.", o: ["bound", "about", "likely", "due"], a: 2, x: "likely to = probably will; 'bound' also needs 'to', but clouds only make it probable." },
        { t: "order", a: ["I'll", "be", "working", "from", "home", "all", "next", "week"], p: ".", x: "will be + -ing for an action in progress in the future." },
        { t: "listen", audio: "Manager: Will the new website be ready for the launch?\nDeveloper: We'll have finished the main pages by Friday, but the online shop will take another week.\nManager: So customers won't be able to buy anything at the launch?\nDeveloper: Not online, no. But they'll be able to pre-order by email.", q: "What will NOT be ready for the launch?", o: ["the main pages", "the online shop", "the email address", "the launch event"], a: 1, x: "'the online shop will take another week'." }
      ],
      speaking: ["By this time next year, I'll have changed jobs.", "I'll be working late tomorrow, so let's meet on Thursday.", "Prices are bound to go up after the summer."]
    },
    {
      id: "c1-4", level: 5, title: "Building an argument", topic: "Debate & persuasion",
      focus: ["grammar", "writing"],
      objectives: ["Use participle clauses to write concisely", "Link ideas with precise discourse markers", "Present and counter an argument"],
      grammar: {
        title: "Participle clauses and discourse markers",
        html: `<p><b>Participle clauses</b> make writing more concise. The subject must be the same as in the main clause.</p>
<ul><li>Present participle (active, same time): <i><b>Walking</b> into the room, she noticed the silence.</i></li><li>Perfect participle (one action before another): <i><b>Having finished</b> the report, he went home.</i></li><li>Past participle (passive): <i><b>Built</b> in 1890, the bridge is still in use.</i></li></ul>
<p><b>Discourse markers</b> show how ideas relate:</p>
<ul><li>Contrast: <i>nevertheless, even so, by contrast, whereas</i></li><li>Addition: <i>moreover, furthermore, what is more</i></li><li>Result: <i>consequently, hence, as a result</i></li><li>Concession: <i>admittedly, granted, while it is true that</i></li></ul>`,
        examples: ["Having considered all the options, the board rejected the plan.", "Admittedly, the scheme is expensive. Nevertheless, it is worth it.", "Written in plain English, the guide is easy to follow."]
      },
      vocab: [
        ["compelling", "very convincing", "She made a compelling case for change."],
        ["counter-argument", "an argument against another argument", "Good essays address the counter-argument."],
        ["undermine", "make something weaker or less effective", "The scandal undermined public trust."],
        ["substantiate", "provide evidence to prove something", "He couldn't substantiate his claims."],
        ["concede", "admit that something is true, often unwillingly", "I concede that the plan has some weaknesses."],
        ["flawed", "having a mistake or weakness", "The study was deeply flawed."]
      ],
      reading: {
        title: "Should cities ban cars from their centres?",
        text: "Having seen the success of car-free zones in cities such as Oslo, many councils are considering similar schemes. Supporters present a compelling case: air quality improves, streets become safer and local shops often benefit from increased footfall. Admittedly, the evidence on shops is mixed; some businesses report falling sales in the first year. Moreover, critics argue that bans can undermine access for elderly and disabled residents. Nevertheless, cities that have combined bans with better public transport and exemptions for those in need have, by and large, found that opposition fades once residents experience the benefits."
      },
      ex: [
        { t: "mc", q: "Reading: What does the writer concede?", o: ["Air quality doesn't improve.", "The effect on shops isn't clear.", "Oslo's scheme failed.", "Public transport is too expensive."], a: 1, x: "'Admittedly, the evidence on shops is mixed'." },
        { t: "mc", q: "Reading: What is the writer's overall view?", o: ["Bans should be avoided.", "Bans work when combined with other measures.", "Only small cities should try bans.", "The evidence is too weak to decide."], a: 1, x: "Cities that combined bans with better transport and exemptions found opposition faded." },
        { t: "mc", q: "___ the email, she realised she had sent it to the wrong person.", o: ["Having sent", "Sent", "Being sent", "To send"], a: 0, x: "One action completed before another → perfect participle." },
        { t: "mc", q: "___ in 1920, the theatre has recently been restored.", o: ["Building", "Built", "Having built", "To build"], a: 1, x: "The theatre was built → past participle (passive)." },
        { t: "mc", q: "The plan is expensive. ___, it is the only realistic option.", o: ["Moreover", "Consequently", "Nevertheless", "For instance"], a: 2, x: "A contrast with the previous sentence → nevertheless." },
        { t: "fill", q: "The company lost its biggest client. ___, it had to cut jobs. (as a result)", a: ["consequently", "as a result", "hence", "therefore"], x: "A result → consequently / as a result." },
        { t: "order", a: ["Granted,", "the", "evidence", "is", "limited,", "but", "the", "trend", "is", "clear"], p: ".", x: "Granted = concession before the main point." },
        { t: "listen", audio: "Host: Some people say the four-day week will damage productivity.\nGuest: I understand that concern. Admittedly, it won't suit every industry. Even so, the trials so far have shown output staying the same, and staff turnover falling.\nHost: So you're in favour?\nGuest: Cautiously, yes.", q: "What is the guest's view of the four-day week?", o: ["strongly against", "cautiously in favour", "undecided", "only for some workers"], a: 1, x: "'Cautiously, yes.'" }
      ],
      speaking: ["Having considered the alternatives, I believe this is the best option.", "Admittedly, there are risks. Nevertheless, the benefits are clear.", "Granted, it's expensive, but it will save money in the long run."]
    },
    {
      id: "c2-4", level: 6, title: "Precision and style", topic: "Academic & formal style",
      focus: ["vocabulary", "writing"],
      objectives: ["Use nominalisation for a formal, academic style", "Avoid repetition with substitution and ellipsis", "Choose precise reporting verbs"],
      grammar: {
        title: "Nominalisation, substitution and ellipsis",
        html: `<p><b>Nominalisation</b> turns verbs and adjectives into nouns, which makes writing more formal and compact:</p>
<ul><li><i>The government <s>decided to close</s> the mine, which <s>angered</s> residents.</i> → <i>The government's <b>decision</b> to close the mine caused <b>anger</b> among residents.</i></li><li><i>Prices rose sharply</i> → <i>a sharp <b>rise</b> in prices</i></li></ul>
<p><b>Substitution</b> replaces repeated words: <i>one/ones, do so, so, not</i>. <i>I asked them to reconsider, and they <b>did so</b>. Will it rain? I hope <b>not</b>.</i></p>
<p><b>Ellipsis</b> leaves words out when the meaning is clear: <i>She can speak Arabic, and her brother can (speak Arabic) too. I'd like to help, but I'm not able to (help).</i></p>`,
        examples: ["The introduction of the tax led to a reduction in consumption.", "Many proposals were made, but few were adopted, and none in full.", "He promised to apologise, but he never did."]
      },
      vocab: [
        ["implementation", "the process of putting a plan into action", "Implementation of the policy will take two years."],
        ["contend", "state that something is true, especially in an argument", "Critics contend that the figures are misleading."],
        ["discrepancy", "a difference between things that should be the same", "There is a discrepancy between the two reports."],
        ["attribute (to)", "say that something is caused by something", "The decline is attributed to rising costs."],
        ["warrant", "make something necessary or justified", "The results warrant further research."],
        ["notwithstanding", "despite", "Notwithstanding the cost, the plan was approved."]
      ],
      reading: {
        title: "The trouble with averages",
        text: "The publication of national statistics is frequently followed by sweeping conclusions. A rise in average income, for instance, is often taken as evidence of widespread improvement. Economists contend, however, that averages can conceal significant discrepancies. Where the gains are concentrated among the highest earners, the median household may see little or no change; indeed, it may see a decline. The failure to distinguish between the two has, some argue, contributed to a loss of public trust in official figures. Notwithstanding their limitations, averages remain useful, but their interpretation warrants considerably more care than it usually receives."
      },
      ex: [
        { t: "mc", q: "Reading: According to economists, what is the problem with averages?", o: ["They are usually calculated wrongly.", "They can hide large differences.", "They are published too rarely.", "They always show a decline."], a: 1, x: "'averages can conceal significant discrepancies'." },
        { t: "mc", q: "Reading: What is the writer's conclusion?", o: ["Averages should no longer be used.", "Averages are useful but need careful interpretation.", "The public trusts official figures too much.", "Median income always rises with the average."], a: 1, x: "'averages remain useful, but their interpretation warrants considerably more care'." },
        { t: "mc", q: "Choose the most formal version: 'Because the company expanded quickly, it had problems.'", o: ["The company's rapid expansion led to difficulties.", "The company expanded and so it had problems.", "Expanding quickly, problems happened.", "The company was expanding rapidly with problems."], a: 0, x: "Nominalisation: expanded quickly → rapid expansion; had problems → difficulties." },
        { t: "fill", q: "Prices increased sharply → a sharp ___ in prices.", a: ["increase", "rise"], x: "Verb → noun: increase / rise." },
        { t: "mc", q: "\"Will the meeting be cancelled?\" \"I hope ___.\"", o: ["not", "no", "don't", "not so"], a: 0, x: "hope + not = I hope it won't be." },
        { t: "mc", q: "They were asked to leave the building, and they did ___ immediately.", o: ["it", "so", "this", "such"], a: 1, x: "do so replaces the repeated verb phrase." },
        { t: "order", a: ["The", "rise", "in", "unemployment", "has", "been", "attributed", "to", "automation"], p: ".", x: "Nominalised subject + passive reporting verb." },
        { t: "listen", audio: "Professor: So, did the data support your hypothesis?\nStudent: Partly. The correlation was there, but it was weaker than we'd anticipated.\nProfessor: Then I'd be cautious about claiming a causal link.\nStudent: Absolutely. We're recommending a larger study before drawing any firm conclusions.", q: "What does the student recommend?", o: ["publishing the results now", "a larger study", "changing the hypothesis", "ignoring the correlation"], a: 1, x: "'We're recommending a larger study before drawing any firm conclusions.'" }
      ],
      speaking: ["The implementation of the policy has been delayed.", "Critics contend that the figures are misleading.", "Notwithstanding the cost, the project warrants further investment."]
    }
  );

  Object.assign(GEN.UNIT_TOPICS, {
    "a1-4": ["can", "likeIng"], "a2-4": ["pastCont"], "b1-4": ["relative"],
    "b2-4": ["futurePerf"], "c1-4": ["participle", "discourse"], "c2-4": ["nominal"]
  });

  D.WRITING = D.WRITING || {};
  Object.assign(D.WRITING, {
    "a1-4": { prompt: "Write about what you can and can't do, and what you like doing in your free time.", min: 30, check: ["\\b(can|can't|cannot)\\b", "uses 'can' or 'can't'"], model: "I can cook and I can swim, but I can't drive a car. In my free time I like reading and I love walking in the park with my dog. I don't like running. At the weekend I enjoy playing football with my friends." },
    "a2-4": { prompt: "Tell the story of a trip when something unexpected happened.", min: 50, check: ["\\b(was|were) \\w+ing\\b", "uses the past continuous"], model: "Two years ago I went to Rome with my friend. On the second day we were walking near the river when it started to rain very hard. We didn't have an umbrella, so we ran into a small café. While we were drinking coffee, the owner told us about a secret garden near the café. After the rain stopped, we visited it. It was the best part of the trip!" },
    "b1-4": { prompt: "Describe your workplace, school or neighbourhood and some of the people there.", min: 65, check: ["\\b(who|which|where|whose|that)\\b", "uses relative clauses"], model: "I live in a small neighbourhood which is about twenty minutes from the city centre. There is a market where I buy fruit every Saturday, and a café that makes the best croissants in town. My neighbour, who is a retired teacher, often helps the children whose parents work late. The person I see most is the baker, who always asks about my family. It's a place where everyone knows each other." },
    "b2-4": { prompt: "Where do you see yourself in five years? Describe what you will have achieved and what you will be doing.", min: 85, check: ["\\bwill have \\w+|\\bwill be \\w+ing|'ll have \\w+|'ll be \\w+ing", "uses future perfect or future continuous"], model: "In five years' time, I hope I'll have finished my master's degree and I'll have gained some experience abroad. Ideally, I'll be working for an international company, possibly in Singapore or Toronto, and I'll be managing a small team. By then I'll also have saved enough money for a deposit on a flat. Of course, it's bound to be harder than I expect, and I can't foresee everything, but having a long-term plan keeps me on track. This time next year, I'll probably be writing my dissertation, so the first milestone isn't far away." },
    "c1-4": { prompt: "Write a short argument for or against a controversial idea, conceding at least one point to the other side.", min: 100, check: ["\\b(admittedly|granted|nevertheless|nonetheless|even so|while it is true|having \\w+)\\b", "uses concession or participle clauses"], model: "Having followed the debate on school uniforms for some time, I have come to the conclusion that they do more good than harm. Admittedly, uniforms limit pupils' self-expression, and families on low incomes may struggle with the cost. Nevertheless, the case in their favour is compelling. Removing visible differences in wealth, uniforms reduce one source of bullying and peer pressure. Moreover, they simplify mornings for parents and create a sense of belonging. Granted, the evidence on academic results is flawed and inconclusive; even so, the social benefits alone are enough to justify keeping them, provided that schools offer affordable or second-hand options." },
    "c2-4": { prompt: "Write a formal summary of a trend or problem in your field, using nominalisation and avoiding repetition.", min: 100, check: ["\\b\\w+(tion|ment|ance|ence|ity|ness)\\b[^.]*\\b\\w+(tion|ment|ance|ence|ity|ness)\\b", "uses nominalisation"], model: "Recent years have seen a marked increase in the adoption of remote working across the professional services sector. The introduction of reliable video-conferencing, combined with a shift in employee expectations, has accelerated a transformation that had previously been gradual. Its implementation, however, has been uneven. Larger firms report improvements in retention and a reduction in office costs; smaller ones, by contrast, cite difficulties in the training of junior staff, and some contend that innovation has suffered. Notwithstanding these concerns, a return to pre-2020 arrangements appears unlikely. The discrepancy between firms' experiences warrants further investigation, particularly into the long-term development of employees who have never worked in an office." }
  });
  D.SPEAKING_PROMPTS = Object.assign(D.SPEAKING_PROMPTS || {}, {
    "a1-4": "Talk about what you can do, what you can't do, and your favourite hobbies.",
    "a2-4": "Tell a story about a journey when something went wrong.",
    "b1-4": "Describe a person you work or study with, and the place where you do it.",
    "b2-4": "Describe where you will be and what you will have done in five years.",
    "c1-4": "Argue for or against a four-day working week, conceding one point.",
    "c2-4": "Summarise a trend in your industry in a formal, precise style."
  });

  /* =====================================================================
     generators for the new units
     ===================================================================== */
  const ABIL = ["swim", "drive", "cook", "ski", "dance", "sing", "speak Chinese", "play the piano", "ride a horse", "draw"];
  G(1, "grammar", "can", () => {
    const p = person(), v = pick(ABIL);
    const k = pick([0, 1, 2]);
    if (k === 0) return { q: `${p.n} ___ ${v}, but ${p.he} can't ${pick(ABIL.filter((x) => x !== v))}.`, correct: "can", wrong: ["cans", "can to", "is can"], x: "can is the same for every person, with the base verb." };
    if (k === 1) return { q: `___ you ${v}?`, correct: "Can", wrong: ["Do", "Are", "Does"], x: "Questions about ability: Can + subject + verb?" };
    const V = v.split(" ")[0], rest = v.slice(V.length);
    return { q: `My brother can ___${rest} very well.`, correct: V, wrong: [V + "s", "to " + V, V + (V.endsWith("e") ? "d" : "ed")], x: "can + base verb (no 's', no 'to')." };
  });
  const HOBBY = [["read", "reading"], ["swim", "swimming"], ["run", "running"], ["dance", "dancing"], ["cook", "cooking"], ["paint", "painting"], ["travel", "travelling"], ["play chess", "playing chess"], ["watch films", "watching films"], ["go shopping", "going shopping"]];
  G(1, "grammar", "likeIng", () => {
    const p = person(), [b, ing] = pick(HOBBY), verb = pick(["enjoys", "loves", "hates"]);
    const [w1, ...rest] = b.split(" ");
    return { q: `${p.n} ${verb} ___${rest.length ? " " + rest.join(" ") : ""} at the weekend.`, correct: ing.split(" ")[0], wrong: [w1, w1 + "s", "to " + w1], x: `${verb.replace(/s$/, "")} + -ing for hobbies.` };
  });
  const PASTC = [["watching", "TV", "watched"], ["cooking", "dinner", "cooked"], ["walking", "home", "walked"], ["reading", "a book", "read"], ["driving", "to work", "drove"], ["having", "a shower", "had"], ["working", "in the garden", "worked"]];
  const INTERR = [["the phone", "rang", "ringing", "rings"], ["someone", "knocked", "knocking", "knocks"], ["the lights", "went", "going", "go"], ["my friend", "arrived", "arriving", "arrives"], ["I", "heard", "hearing", "hear"]];
  const INTERR_REST = { rang: "", knocked: "on the door", went: "out", arrived: "", heard: "a loud noise" };
  G(2, "grammar", "pastCont", () => {
    const [ing, obj, past] = pick(PASTC), S = pick([["I", "was"], ["We", "were"], ["They", "were"], ["She", "was"], ["He", "was"]]);
    const [who, v, vIng, vPres] = pick(INTERR), rest = INTERR_REST[v];
    const tail = `${who} ${v}${rest ? " " + rest : ""}`;
    if (Math.random() < 0.6) return { q: `${S[0]} ___ ${obj} when ${tail}.`, correct: `${S[1]} ${ing}`, wrong: [`${S[1] === "was" ? "were" : "was"} ${ing}`, past, `${S[0] === "I" ? "am" : S[1] === "was" ? "is" : "are"} ${ing}`], x: "An action in progress (past continuous) interrupted by a short action (past simple)." };
    return { q: `${S[0]} ${S[1]} ${ing} ${obj} when ${who} ___${rest ? " " + rest : ""}.`, correct: v, wrong: [`was ${vIng}`, vPres, `has ${vIng}`], x: "The short action that interrupts → past simple." };
  });
  const REL = [
    ["That's the hotel ___ we stayed last summer.", "where", "A place → where."],
    ["She's the doctor ___ helped my father.", "who", "A person (subject) → who."],
    ["This is the phone ___ I bought online.", "which", "A thing → which (or that)."],
    ["He's the student ___ essay won the prize.", "whose", "Possession → whose."],
    ["I met a man ___ dog was bigger than him!", "whose", "Possession → whose."],
    ["The town ___ I grew up is very small.", "where", "A place → where."],
    ["The people ___ live next door are very noisy.", "who", "A person → who."],
    ["Is this the bus ___ goes to the station?", "which", "A thing → which (or that)."]
  ];
  G(3, "grammar", "relative", () => {
    const [q, c, x] = pick(REL);
    return { q, correct: c, wrong: ["who", "which", "where", "whose", "what"].filter((w) => w !== c && !(c === "which" && w === "that")), x };
  });
  G(4, "grammar", "futurePerf", () => {
    const p = person();
    const k = pick([0, 1, 2]);
    const done = pick([["finish", "finished", "the report"], ["write", "written", "the article"], ["build", "built", "the new bridge"], ["read", "read", "all the documents"], ["save", "saved", "enough money"]]);
    if (k === 0) return { q: `By next ${pick(["Monday", "month", "summer", "year"])}, ${p.n} ___ ${done[2]}.`, correct: `will have ${done[1]}`, wrong: [`will ${done[0]}`, `will be ${done[0]}ing`.replace("eing", "ing"), `has ${done[1]}`], x: "Completed before a future time (by …) → will have + past participle." };
    if (k === 1) {
      const act = pick([["lie", "lying", "on a beach"], ["fly", "flying", `to ${pick(CITIES)}`], ["sit", "sitting", "an exam"], ["have", "having", "dinner"], ["work", "working", "from home"]]);
      return { q: `Don't call ${p.him} at eight tomorrow; ${p.he} ___ ${act[2]}.`, correct: `will be ${act[1]}`, wrong: [`will ${act[0]}`, `will have ${act[1].replace(/ing$/, "ed")}`.replace("lyed", "lain").replace("flyed", "flown").replace("sitted", "sat").replace("haved", "had"), `is ${act[0]}`], x: "In progress at a future time → will be + -ing." };
    }
    return { q: "With all this traffic, we're ___ to be late.", correct: "bound", wrong: ["about", "due", "sure of"], x: "be bound to = be certain to." };
  });
  const PART = [
    ["___ the instructions, he assembled the desk in ten minutes.", "Having read", ["Read", "Being read", "To read"], "Completed before the main action → having + past participle."],
    ["___ in 1850, the bridge is still in use today.", "Built", ["Building", "Having built", "To build"], "The bridge was built → past participle (passive)."],
    ["___ down the street, she saw an old friend.", "Walking", ["Walked", "Having walked", "To walk"], "Two actions at the same time → present participle."],
    ["___ by the news, they decided to cancel the trip.", "Shocked", ["Shocking", "Having shocked", "To shock"], "They were shocked → past participle."],
    ["___ worked abroad for years, he speaks four languages.", "Having", ["Being", "Had", "Have"], "Having + past participle shows an earlier action."]
  ];
  G(5, "grammar", "participle", () => { const [q, c, w, x] = pick(PART); return { q, correct: c, wrong: w, x }; });
  const DISC = [
    ["The plan is expensive. ___, it is the only realistic option.", "Nevertheless", ["Moreover", "Consequently", "For instance"], "A contrast → nevertheless."],
    ["The factory closed. ___, hundreds of people lost their jobs.", "Consequently", ["Nevertheless", "Moreover", "Admittedly"], "A result → consequently."],
    ["The flat is close to the station. ___, it's very cheap.", "Moreover", ["However", "Consequently", "Whereas"], "Adding a further point → moreover."],
    ["___, the evidence is limited, but the trend is clear.", "Admittedly", ["Consequently", "Furthermore", "Hence"], "Conceding a point → admittedly."],
    ["Some people prefer cities, ___ others prefer the countryside.", "whereas", ["moreover", "hence", "admittedly"], "Contrasting two things in one sentence → whereas."],
    ["The roads were icy; ___, the race was cancelled.", "hence", ["whereas", "moreover", "even so"], "A result → hence."]
  ];
  G(5, "vocabulary", "discourse", () => { const [q, c, w, x] = pick(DISC); return { q, correct: c, wrong: w, x }; });
  const NOM = [["decide", "decision"], ["introduce", "introduction"], ["fail", "failure"], ["reduce", "reduction"], ["expand", "expansion"], ["analyse", "analysis"], ["approve", "approval"], ["refuse", "refusal"], ["arrive", "arrival"], ["discover", "discovery"], ["fluctuate", "fluctuation"], ["implement", "implementation"]];
  G(6, "vocabulary", "nominal", () => {
    const [v, n] = pick(NOM);
    const k = Math.random() < 0.5;
    const ing = v.replace(/e$/, "") + "ing", past = v.replace(/e$/, "") + "ed";
    if (k) return { q: `Make it formal: "The board ${past} the plan." → "The board's ___ of the plan."`, correct: n, wrong: [ing, past, v], x: `${v} → ${n}.` };
    const n2 = pick(NOM.filter((x) => x[1] !== n))[1];
    return { q: `Which noun comes from the verb "${v}"?`, correct: n, wrong: [n2, ing, past], x: `${v} → ${n}.` };
  });

  /* =====================================================================
     two-voice dialogue listening for every level
     ===================================================================== */
  G(1, "listening", "dlgCafe", () => {
    const [a, b] = twoPeople();
    const drink = pick(["coffee", "tea", "hot chocolate", "orange juice"]), size = pick(["small", "large"]), food = pick(["a sandwich", "a croissant", "a piece of cake", "a muffin"]);
    const k = Math.random() < 0.5;
    return k
      ? { q: "What size drink does the customer want?", audio: `${a.n}: Hello! What can I get you?\n${b.n}: A ${drink}, please.\n${a.n}: Small or large?\n${b.n}: ${cap(size)}, please. And ${food}.`, correct: size, wrong: [size === "small" ? "large" : "small", "medium"], x: `The customer says '${cap(size)}, please.'` }
      : { q: "What food does the customer order?", audio: `${a.n}: Hi there. What would you like?\n${b.n}: Can I have ${/^[aeiou]/.test(drink) ? "an" : "a"} ${drink} and ${food}, please?\n${a.n}: Sure. Anything else?\n${b.n}: No, thank you.`, correct: food.replace(/^an? /, ""), wrong: ["a sandwich", "a croissant", "a piece of cake", "a muffin"].filter((f) => f !== food).map((f) => f.replace(/^an? /, "")), x: "" };
  });
  G(2, "listening", "dlgPlans", () => {
    const [a, b] = twoPeople();
    const [d1, d2] = sample(["Friday", "Saturday", "Sunday"], 2), what = pick(["see a film", "go for a walk", "have dinner", "play tennis"]), reason = pick(["visiting my grandparents", "working", "going to a wedding", "helping my sister move house"]);
    return { q: "When are they going to meet?", audio: `${a.n}: Are you free on ${d1}? Do you want to ${what}?\n${b.n}: Sorry, I can't. I'm ${reason}.\n${a.n}: What about ${d2}?\n${b.n}: ${d2} is perfect. See you then!`, correct: d2, wrong: [d1, "next week", "tonight"], x: `${b.n} is busy on ${d1}, so they choose ${d2}.` };
  });
  G(3, "listening", "dlgBooking", () => {
    const [a, b] = twoPeople();
    const n = rnd(3, 8), t = pick([["seven", "7:00"], ["half past seven", "7:30"], ["eight", "8:00"], ["quarter past eight", "8:15"]]), alt = pick([["six", "6:00"], ["nine", "9:00"]]);
    return { q: "What time is the table booked for?", audio: `${a.n}: Good evening, Rosa's restaurant.\n${b.n}: Hi, I'd like to book a table for ${n} tonight, at ${alt[0]} if possible.\n${a.n}: I'm sorry, we're fully booked at ${alt[0]}. We have a table at ${t[0]}.\n${b.n}: That's fine, we'll take it.`, correct: t[1], wrong: [alt[1], "7:45", "8:30"].filter((w) => w !== t[1]), x: `The ${alt[1]} slot is full; they accept ${t[1]}.` };
  });
  G(4, "listening", "dlgWork", () => {
    const [a, b] = twoPeople();
    const doc = pick(["report", "proposal", "presentation", "budget"]), why = pick([["checking the figures", "Someone is still checking the figures."], ["waiting for approval from the director", "It is waiting for the director's approval."], ["adding the latest sales data", "The latest sales data is being added."]]);
    return { q: `Why hasn't the ${doc} been sent yet?`, audio: `${a.n}: Has the ${doc} gone to the client yet?\n${b.n}: Not yet, I'm afraid. We're still ${why[0]}.\n${a.n}: They were expecting it yesterday.\n${b.n}: I know. It should be ready by tomorrow morning at the latest.`, correct: why[1], wrong: ["The client cancelled it.", "It was sent to the wrong person.", "Nobody has started it."], x: "" };
  });
  G(5, "listening", "dlgMeeting", () => {
    const [a, b] = twoPeople();
    const T = pick([
      ["What did you make of the proposal?", "Well, it's ambitious, I'll give them that. I just can't see the budget stretching that far.", "The proposal may be too expensive.", ["The proposal isn't ambitious enough.", "The proposal should be accepted at once.", "The budget has already been approved."]],
      ["How do you think the new manager is doing?", "It's early days, but she's certainly shaken things up. Whether that's a good thing remains to be seen.", "It's too soon to judge the manager's changes.", ["The manager's changes have clearly failed.", "The manager hasn't changed anything.", "Everyone is happy with the manager."]],
      ["Are you going to apply for the job in Singapore?", "I'd be lying if I said I wasn't tempted. But with the kids settled at school, the timing couldn't be worse.", "The job is attractive, but the timing is wrong.", ["The application has already been sent.", "The job isn't interesting at all.", "The children want to move abroad."]]
    ]);
    return { q: `What does ${b.n} suggest?`, audio: `${a.n}: ${T[0]}\n${b.n}: ${T[1]}`, correct: T[2], wrong: T[3], x: "Listen for what comes after 'I'll give them that', 'but' or 'whether': that's the real point." };
  });
  G(6, "listening", "dlgIrony", () => {
    const [a, b] = twoPeople();
    const T = pick([
      [`How was the conference?`, `Oh, riveting. Three hours on spreadsheet formatting. I can hardly wait for next year's.`, "found it boring", ["found it fascinating", "is looking forward to next year", "didn't go"]],
      [`Did the new software solve the problem?`, `Solved it? It's created three new ones. Still, at least the logo looks nice.`, "thinks it made things worse", ["is pleased with it", "thinks the logo is the problem", "hasn't installed it yet"]],
      [`Was the client happy with our proposal?`, `Let's just say I wouldn't start celebrating just yet.`, "suspects the client was not satisfied", ["is sure the client accepted it", "wants to celebrate", "hasn't heard from the client"]]
    ]);
    return { q: `What does ${b.n} mean? The speaker…`, audio: `${a.n}: ${T[0]}\n${b.n}: ${T[1]}`, correct: T[2], wrong: T[3], x: "The speaker is being ironic: the words say one thing, the meaning is the opposite." };
  });
})();
