/* LevelUp English — units 5 and 6 for every level (36 units in total), with their generators. */
(function () {
  "use strict";
  const D = window.LU_DATA;
  const GEN = window.LU_GEN;
  const G = GEN.register;
  const { pick, sample, cap, person, twoPeople, CITIES, DAYS } = GEN.helpers;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  D.UNITS.push(
    /* ---------------- A1 ---------------- */
    {
      id: "a1-5", level: 1, title: "My home", topic: "Home & places",
      focus: ["vocabulary", "grammar"],
      objectives: ["Name rooms and furniture", "Say where things are with in, on, under, next to, between", "Describe your home"],
      grammar: {
        title: "Prepositions of place",
        html: `<ul><li><b>in</b>: inside something. <i>The milk is <b>in</b> the fridge.</i></li><li><b>on</b>: on top of a surface. <i>The keys are <b>on</b> the table.</i></li><li><b>under</b>: below. <i>The cat is <b>under</b> the bed.</i></li><li><b>next to</b>: at the side of. <i>The lamp is <b>next to</b> the sofa.</i></li><li><b>between</b>: in the middle of two things. <i>The bathroom is <b>between</b> the two bedrooms.</i></li><li><b>in front of</b> / <b>behind</b>. <i>The car is <b>in front of</b> the house. The garden is <b>behind</b> it.</i></li></ul>
<p>Ask: <i><b>Where is</b> my phone? <b>Where are</b> my shoes?</i></p>`,
        examples: ["My bag is on the chair.", "There's a small garden behind the house.", "The bank is between the café and the school."]
      },
      vocab: [
        ["kitchen", "the room where you cook", "We eat breakfast in the kitchen."],
        ["bedroom", "the room where you sleep", "My flat has two bedrooms."],
        ["sofa", "a long soft seat for two or more people", "The dog sleeps on the sofa."],
        ["shelf", "a flat board on a wall for putting things on", "The books are on the shelf."],
        ["upstairs", "on a higher floor of a building", "The bathroom is upstairs."],
        ["garden", "land next to a house with grass or flowers", "We have lunch in the garden in summer."]
      ],
      reading: {
        title: "Our new flat",
        text: "We have a new flat in the city centre. It's on the third floor. There's a big living room with a sofa and a TV, and the kitchen is next to it. There are two bedrooms: my bedroom is small, but it has a big window. The bathroom is between the two bedrooms. We don't have a garden, but there's a small balcony in front of the living room. My favourite thing is the bookshelf in the hall. It has all my books on it!"
      },
      ex: [
        { t: "mc", q: "Reading: Where is the bathroom?", o: ["next to the kitchen", "between the bedrooms", "on the balcony", "upstairs"], a: 1, x: "'The bathroom is between the two bedrooms.'" },
        { t: "mc", q: "Reading: What doesn't the flat have?", o: ["a balcony", "a garden", "a sofa", "two bedrooms"], a: 1, x: "'We don't have a garden'." },
        { t: "mc", q: "The cat is sleeping ___ the bed. You can't see it.", o: ["on", "under", "between", "next"], a: 1, x: "under = below." },
        { t: "fill", q: "Your keys are ___ the table, next to the phone.", a: ["on"], x: "on = on top of a surface." },
        { t: "mc", q: "The café is ___ the bank and the cinema.", o: ["between", "next", "in", "under"], a: 0, x: "between + two things." },
        { t: "fill", q: "Where ___ my glasses? (be)", a: ["are"], x: "glasses is plural → are." },
        { t: "order", a: ["The", "milk", "is", "in", "the", "fridge"], p: ".", x: "Subject + is + preposition + place." },
        { t: "listen", audio: "Mum: Ben, where's your football?\nBen: It's in my bedroom, under the bed.\nMum: No, it isn't. I looked there.\nBen: Oh! Then it's in the garden, next to the tree.", q: "Where is the football in the end?", o: ["under the bed", "in the garden", "in the kitchen", "on the sofa"], a: 1, x: "'Then it's in the garden, next to the tree.'" }
      ],
      speaking: ["My bedroom is next to the bathroom.", "Where are my keys? They're on the table.", "There's a big sofa in the living room."]
    },
    {
      id: "a1-6", level: 1, title: "Food and drink", topic: "Food & meals",
      focus: ["vocabulary", "speaking"],
      objectives: ["Talk about food you like and eat", "Use a/an, some and any with countable and uncountable nouns", "Ask How much? and How many?"],
      grammar: {
        title: "Countable and uncountable nouns",
        html: `<p><b>Countable</b> nouns have a plural: <i>an apple, two apples, an egg, three eggs</i>.</p>
<p><b>Uncountable</b> nouns have no plural and no <i>a/an</i>: <i>water, rice, bread, milk, cheese, money</i>.</p>
<ul><li><b>How many</b> + plural countable: <i>How many eggs do we need?</i></li><li><b>How much</b> + uncountable: <i>How much milk is there?</i></li><li><b>a lot of</b> works with both: <i>a lot of apples, a lot of water</i>.</li></ul>`,
        examples: ["Can I have an orange, please?", "How much rice do you want?", "There are a lot of eggs in the fridge."]
      },
      vocab: [
        ["breakfast", "the first meal of the day", "I have breakfast at seven."],
        ["vegetables", "plants you eat, like carrots and onions", "Eat more vegetables!"],
        ["rice", "small white or brown grains you cook", "We often have rice with chicken."],
        ["hungry", "wanting to eat", "I'm hungry. Is lunch ready?"],
        ["thirsty", "wanting to drink", "It's hot. I'm very thirsty."],
        ["delicious", "tasting very good", "This soup is delicious!"]
      ],
      reading: {
        title: "What I eat in a day",
        text: "My name is Yuki and I'm a nurse. I always have breakfast at six: some rice, an egg and a cup of green tea. At work I'm very busy, so for lunch I have a sandwich and an apple. I drink a lot of water because the hospital is hot. In the evening I cook dinner with my husband. We love vegetables, so we make a big salad or some soup. On Fridays we don't cook. We go to a small Italian restaurant near our flat. Their pizza is delicious!"
      },
      ex: [
        { t: "mc", q: "Reading: What does Yuki drink in the morning?", o: ["coffee", "green tea", "water", "milk"], a: 1, x: "'a cup of green tea'." },
        { t: "mc", q: "Reading: What do they do on Fridays?", o: ["cook pizza", "make soup", "eat at a restaurant", "have a salad"], a: 2, x: "'On Fridays we don't cook. We go to a small Italian restaurant'." },
        { t: "mc", q: "How ___ apples do you want?", o: ["much", "many", "lot", "any"], a: 1, x: "apples is countable → How many." },
        { t: "mc", q: "How ___ water do you drink every day?", o: ["many", "much", "lot", "a"], a: 1, x: "water is uncountable → How much." },
        { t: "fill", q: "Can I have ___ egg, please?", a: ["an"], x: "an before a vowel sound." },
        { t: "mc", q: "Which word is uncountable?", o: ["banana", "egg", "bread", "sandwich"], a: 2, x: "We say 'some bread', not 'a bread'." },
        { t: "order", a: ["I'm", "thirsty.", "Can", "I", "have", "some", "water"], p: "?", x: "some + uncountable noun in requests." },
        { t: "listen", audio: "Waiter: Are you ready to order?\nCustomer: Yes. I'd like the chicken with rice, please.\nWaiter: And to drink?\nCustomer: Just some water, please. I'm very thirsty.", q: "What does the customer order to drink?", o: ["juice", "water", "tea", "coffee"], a: 1, x: "'Just some water, please.'" }
      ],
      speaking: ["How many eggs do we need?", "I'd like some rice and vegetables, please.", "This soup is delicious!"]
    },

    /* ---------------- A2 ---------------- */
    {
      id: "a2-5", level: 2, title: "Then and now", topic: "Life changes",
      focus: ["grammar", "speaking"],
      objectives: ["Talk about past habits with used to", "Compare your life now and in the past", "Use didn't use to and Did you use to…?"],
      grammar: {
        title: "used to",
        html: `<p><b>used to</b> + base verb describes past habits or states that are not true now.</p>
<ul><li><i>I <b>used to play</b> football every day. (Now I don't.)</i></li><li><i>She <b>used to live</b> in Madrid.</i></li></ul>
<p>Negative: <i>I <b>didn't use to</b> like coffee.</i> · Question: <i><b>Did</b> you <b>use to</b> have long hair?</i></p>
<p>Don't use <i>used to</i> for the present: say <i>I usually get up at seven</i>, not <s>I use to get up</s>.</p>`,
        examples: ["We used to go camping every summer.", "He didn't use to wear glasses.", "Did you use to walk to school?"]
      },
      vocab: [
        ["childhood", "the time when you were a child", "I had a happy childhood."],
        ["grow up", "change from a child into an adult", "I grew up in a small village."],
        ["change", "become different", "The town has changed a lot."],
        ["nowadays", "at the present time", "Nowadays everyone has a phone."],
        ["neighbour", "a person who lives near you", "Our neighbours are very kind."],
        ["remember", "have something in your mind from the past", "I remember my first teacher."]
      ],
      reading: {
        title: "My grandfather's village",
        text: "My grandfather grew up in a small village in the mountains. He says life used to be very different. There didn't use to be any cars, so people walked or used horses. Children used to help their parents on the farm before school. There was no TV, so in the evenings families used to sit together and tell stories. Nowadays the village has a road, a small supermarket and fast internet. My grandfather likes the changes, but he says people used to know all their neighbours, and now they don't."
      },
      ex: [
        { t: "mc", q: "Reading: How did people travel in the past?", o: ["by bus", "by car", "on foot or by horse", "by train"], a: 2, x: "'people walked or used horses'." },
        { t: "mc", q: "Reading: What does the grandfather miss?", o: ["the farm", "knowing all the neighbours", "the stories on TV", "the horses"], a: 1, x: "'people used to know all their neighbours, and now they don't'." },
        { t: "mc", q: "I ___ play the piano when I was a child.", o: ["use to", "used to", "was used to", "using to"], a: 1, x: "Past habit → used to + base verb." },
        { t: "fill", q: "Did you ___ to live in London? (use)", a: ["use"], x: "Questions: Did + subject + use to." },
        { t: "mc", q: "She ___ like vegetables, but now she loves them.", o: ["didn't use to", "didn't used to", "wasn't use to", "not used to"], a: 0, x: "Negative: didn't use to." },
        { t: "mc", q: "Nowadays I ___ get up at six.", o: ["use to", "used to", "usually", "am used"], a: 2, x: "Present habits: usually + present simple." },
        { t: "order", a: ["We", "used", "to", "go", "to", "the", "beach", "every", "summer"], p: ".", x: "used to + base verb." },
        { t: "listen", audio: "Lucy: Is this you in the photo? You look so different!\nTom: I know. I used to have really long hair.\nLucy: And you used to wear glasses!\nTom: Yes, but I don't need them now.", q: "What is true about Tom now?", o: ["He has long hair.", "He doesn't wear glasses.", "He wears glasses.", "He doesn't like photos."], a: 1, x: "'I don't need them now.'" }
      ],
      speaking: ["I used to walk to school every day.", "Did you use to play any sports?", "We didn't use to have a car."]
    },
    {
      id: "a2-6", level: 2, title: "Getting around", topic: "Directions & town",
      focus: ["listening", "speaking"],
      objectives: ["Ask for and give directions", "Use imperatives and prepositions of movement", "Understand directions you hear"],
      grammar: {
        title: "Imperatives and prepositions of movement",
        html: `<p>Give directions with the <b>imperative</b> (base verb, no subject): <i><b>Go</b> straight on. <b>Turn</b> left. <b>Take</b> the second right. <b>Don't cross</b> the bridge.</i></p>
<p>Prepositions of movement: <b>along</b> the street, <b>across</b> the road, <b>past</b> the bank, <b>over</b> the bridge, <b>through</b> the park, <b>out of</b> the station, <b>to</b> the end.</p>
<p>Ask politely: <i><b>Excuse me, how do I get to</b> the station? <b>Is there</b> a pharmacy <b>near here</b>?</i></p>`,
        examples: ["Go along this road and turn right at the lights.", "Walk through the park and you'll see it.", "Excuse me, is there a bank near here?"]
      },
      vocab: [
        ["straight on", "forward, without turning", "Go straight on for two minutes."],
        ["corner", "the place where two streets meet", "The shop is on the corner."],
        ["traffic lights", "red, yellow and green lights for cars", "Turn left at the traffic lights."],
        ["opposite", "on the other side, facing", "The hotel is opposite the station."],
        ["roundabout", "a round place where several roads meet", "Take the second exit at the roundabout."],
        ["far", "a long way away", "Is it far from here?"]
      ],
      reading: {
        title: "How to find us",
        text: "Welcome to Green Street Language School! From the train station, it's a ten-minute walk. Go out of the station and turn left. Walk along King Street and go past the big supermarket. At the traffic lights, turn right into Green Street. Go over the small bridge and you'll see a park on your left. Our school is opposite the park, next to a café. If you come by bus, take the number 12 and get off at Green Street. Don't park in front of the school: it's not allowed."
      },
      ex: [
        { t: "mc", q: "Reading: What do you do at the traffic lights?", o: ["turn left", "turn right", "go straight on", "cross the bridge"], a: 1, x: "'At the traffic lights, turn right into Green Street.'" },
        { t: "mc", q: "Reading: Where is the school?", o: ["next to the station", "opposite the park", "behind the supermarket", "on King Street"], a: 1, x: "'Our school is opposite the park'." },
        { t: "mc", q: "Walk ___ the park. It's quicker than going around it.", o: ["through", "over", "along", "out"], a: 0, x: "through = from one side to the other inside something." },
        { t: "fill", q: "___ the second street on the left. (take)", a: ["take"], x: "Imperative = base verb." },
        { t: "mc", q: "Excuse me, how do I ___ to the museum?", o: ["go", "get", "arrive", "come"], a: 1, x: "How do I get to…? is the usual question." },
        { t: "mc", q: "The bank is ___ the post office, on the other side of the road.", o: ["opposite", "between", "along", "through"], a: 0, x: "opposite = facing, on the other side." },
        { t: "order", a: ["Turn", "left", "at", "the", "end", "of", "the", "road"], p: ".", x: "Imperative + direction." },
        { t: "listen", audio: "Tourist: Excuse me, is there a pharmacy near here?\nWoman: Yes, there's one on Bridge Street. Go straight on and take the first left.\nTourist: The first left?\nWoman: That's right. It's on the corner, opposite a bakery.", q: "Where is the pharmacy?", o: ["next to a bakery", "opposite a bakery", "on the first right", "behind the bridge"], a: 1, x: "'It's on the corner, opposite a bakery.'" }
      ],
      speaking: ["Excuse me, how do I get to the station?", "Go straight on and turn left at the lights.", "Is it far from here?"]
    },

    /* ---------------- B1 ---------------- */
    {
      id: "b1-5", level: 3, title: "Media and news", topic: "News & media",
      focus: ["grammar", "reading"],
      objectives: ["Talk about recent activities with the present perfect continuous", "Choose between present perfect simple and continuous", "Discuss news and media habits"],
      grammar: {
        title: "Present perfect continuous",
        html: `<p><b>have/has been + -ing</b> describes an activity that started in the past and continues now, or has just stopped and has a visible result.</p>
<ul><li><i>I'<b>ve been reading</b> the news for an hour.</i> (still reading)</li><li><i>You look tired. <b>Have</b> you <b>been working</b> late?</i> (result now)</li></ul>
<p>Use the <b>simple</b> form for completed results and numbers: <i>I'<b>ve read</b> three articles.</i> Use the <b>continuous</b> for how long: <i>I'<b>ve been reading</b> since nine.</i></p>
<p>State verbs (know, like, believe, own) don't usually use the continuous: <i>I'<b>ve known</b> him for years.</i></p>`,
        examples: ["She's been writing for the newspaper since 2019.", "How long have you been following this story?", "I've watched two documentaries this week."]
      },
      vocab: [
        ["headline", "the title of a news story", "The headline was very dramatic."],
        ["journalist", "a person who writes or reports the news", "She works as a journalist for the BBC."],
        ["fake news", "false stories that look like real news", "It's important to recognise fake news."],
        ["source", "where information comes from", "Always check the source of a story."],
        ["subscribe", "pay regularly to receive something", "I subscribe to two online newspapers."],
        ["update", "the newest information about something", "Here's an update on the storm."]
      ],
      reading: {
        title: "How we get our news",
        text: "Researchers have been studying how people get their news for over twenty years. In the past, most adults read a newspaper or watched the evening news. Recently, however, more and more people have been getting their news from social media, especially those under thirty. This has made news faster, but it has also helped fake news to spread. Many newspapers have lost readers, so some have started asking readers to subscribe online. Experts say we should always check the source of a story before we share it."
      },
      ex: [
        { t: "mc", q: "Reading: Who gets news from social media most?", o: ["older adults", "people under thirty", "journalists", "researchers"], a: 1, x: "'especially those under thirty'." },
        { t: "mc", q: "Reading: What do experts recommend?", o: ["reading more newspapers", "checking the source", "avoiding social media", "subscribing online"], a: 1, x: "'we should always check the source of a story'." },
        { t: "mc", q: "I ___ for this company since 2020.", o: ["work", "have been working", "am working", "was working"], a: 1, x: "From the past until now + since → present perfect continuous." },
        { t: "mc", q: "She ___ three articles today.", o: ["has been writing", "has written", "writes", "is writing"], a: 1, x: "A number of completed things → present perfect simple." },
        { t: "fill", q: "How long have you ___ waiting? (be)", a: ["been"], x: "have + been + -ing." },
        { t: "mc", q: "I ___ him for ten years.", o: ["have been knowing", "have known", "know", "am knowing"], a: 1, x: "'know' is a state verb → no continuous." },
        { t: "order", a: ["They've", "been", "talking", "about", "it", "all", "morning"], p: ".", x: "have been + -ing for duration." },
        { t: "listen", audio: "Anna: You look exhausted.\nDavid: I've been reading about the election all night.\nAnna: All night? Have you found anything new?\nDavid: Not really. Most of the articles say the same thing.", q: "Why is David tired?", o: ["He worked late.", "He's been reading news all night.", "He was at the election.", "He wrote an article."], a: 1, x: "'I've been reading about the election all night.'" }
      ],
      speaking: ["I've been following this story for weeks.", "How long have you been learning English?", "She's written three articles this week."]
    },
    {
      id: "b1-6", level: 3, title: "Making arrangements", topic: "Plans & arrangements",
      focus: ["grammar", "speaking"],
      objectives: ["Choose between will, going to and the present continuous for the future", "Make, accept and change arrangements", "Talk about timetables with the present simple"],
      grammar: {
        title: "Future forms",
        html: `<ul><li><b>Present continuous</b>: fixed arrangements with a time and place. <i>I'<b>m meeting</b> Sara at six.</i></li><li><b>going to</b>: plans and intentions, and predictions from evidence. <i>I'<b>m going to</b> look for a new job. Look at the sky: it'<b>s going to</b> rain.</i></li><li><b>will</b>: decisions made now, offers, promises and opinions about the future. <i>I'<b>ll</b> get the phone! I think she'<b>ll</b> win.</i></li><li><b>Present simple</b>: timetables. <i>The train <b>leaves</b> at 9.15.</i></li></ul>`,
        examples: ["We're having a party on Saturday. Can you come?", "I'm going to start running in the mornings.", "Don't worry, I'll help you with your bags."]
      },
      vocab: [
        ["arrangement", "a plan to do something with other people", "We've made an arrangement to meet on Friday."],
        ["postpone", "change an event to a later time", "Can we postpone the meeting?"],
        ["available", "free to do something", "Are you available next Tuesday?"],
        ["confirm", "say that something is definitely true or will happen", "Please confirm your booking by email."],
        ["suit", "be convenient for someone", "Does three o'clock suit you?"],
        ["call off", "cancel", "They called off the match because of the rain."]
      ],
      reading: {
        title: "Message from Hassan",
        text: "Hi everyone! Just to confirm, we're meeting at the Blue Café on Saturday at eleven. The bus from the station leaves at 10.30, so I'm going to take that one. Elena says she's working until twelve, so she'll join us later for lunch. If it rains, we aren't going to walk to the lake. We'll go to the museum instead. And don't forget, it's Omar's birthday, so I'm going to buy him a cake. Let me know if this time suits you!"
      },
      ex: [
        { t: "mc", q: "Reading: Why will Elena arrive later?", o: ["She's taking a later bus.", "She's working until twelve.", "She's buying a cake.", "She's at the museum."], a: 1, x: "'she's working until twelve'." },
        { t: "mc", q: "Reading: What will they do if it rains?", o: ["walk to the lake", "go to the museum", "stay at the café", "call off the day"], a: 1, x: "'We'll go to the museum instead.'" },
        { t: "mc", q: "\"The phone's ringing!\" \"OK, I ___ answer it.\"", o: ["'m answering", "'ll", "'m going to", "answer"], a: 1, x: "A decision made at the moment → will." },
        { t: "mc", q: "My flight ___ at 7.40 tomorrow morning.", o: ["leaves", "will leave", "is going to leave", "leaving"], a: 0, x: "Timetables → present simple." },
        { t: "fill", q: "I ___ seeing the dentist at four. It's in my diary. (be)", a: ["'m", "am"], x: "Fixed arrangement → present continuous." },
        { t: "mc", q: "Look at those clouds! It ___ rain.", o: ["will", "is going to", "is raining to", "rains"], a: 1, x: "Prediction from evidence → going to." },
        { t: "order", a: ["Does", "Thursday", "afternoon", "suit", "you"], p: "?", x: "suit + person." },
        { t: "listen", audio: "Sam: Are you free on Friday evening?\nMia: Sorry, I'm going to a concert with my sister.\nSam: What about Saturday?\nMia: Saturday's fine. I'll call you in the morning to confirm.", q: "What will Mia do on Saturday morning?", o: ["go to a concert", "call Sam", "meet her sister", "cancel the plan"], a: 1, x: "'I'll call you in the morning to confirm.'" }
      ],
      speaking: ["I'm meeting my manager at ten tomorrow.", "Does Friday afternoon suit you?", "Don't worry, I'll send you the details."]
    },

    /* ---------------- B2 ---------------- */
    {
      id: "b2-5", level: 4, title: "Science and technology", topic: "Science & innovation",
      focus: ["grammar", "reading"],
      objectives: ["Report information impersonally (It is said that…, X is thought to…)", "Use have/get something done", "Discuss inventions and research"],
      grammar: {
        title: "Impersonal passives and causative have",
        html: `<p><b>Impersonal passive</b> reports what people say or believe, in a formal, neutral way:</p>
<ul><li><i><b>It is believed that</b> the device will cut energy use.</i></li><li><i>The device <b>is believed to cut</b> energy use.</i></li><li>For the past: <i>The bridge <b>is thought to have been built</b> in Roman times.</i></li></ul>
<p>Common verbs: <i>say, think, believe, report, expect, claim, estimate</i>.</p>
<p><b>have / get something done</b>: someone else does it for you. <i>I'<b>m having</b> my laptop <b>repaired</b>. We <b>got</b> the house <b>painted</b> last year.</i></p>`,
        examples: ["It is estimated that a billion devices are connected.", "The company is said to be developing a new battery.", "I need to get my phone screen replaced."]
      },
      vocab: [
        ["breakthrough", "an important discovery or development", "Scientists have made a breakthrough in cancer research."],
        ["device", "a machine or tool made for a special purpose", "Most people own several electronic devices."],
        ["cutting-edge", "the newest and most advanced", "The lab uses cutting-edge technology."],
        ["obsolete", "no longer used because something newer exists", "Fax machines are almost obsolete."],
        ["prototype", "the first model of a new design", "They tested the prototype for six months."],
        ["drawback", "a disadvantage", "The main drawback is the price."]
      ],
      reading: {
        title: "Batteries of the future",
        text: "Batteries are widely considered to be the biggest barrier to cleaner transport. Today's electric cars rely on lithium-ion batteries, which are expensive and take time to charge. Researchers are now reported to be testing solid-state batteries, which are thought to be safer and could charge in minutes. A prototype is expected to be ready within three years. However, the main drawback is cost: producing the batteries on a large scale is estimated to be several times more expensive than current methods. Critics claim that the technology has been 'five years away' for over a decade."
      },
      ex: [
        { t: "mc", q: "Reading: What advantage are solid-state batteries thought to have?", o: ["They are cheaper.", "They are safer and charge faster.", "They are already in cars.", "They don't need lithium."], a: 1, x: "'thought to be safer and could charge in minutes'." },
        { t: "mc", q: "Reading: What do critics suggest?", o: ["The technology is dangerous.", "The technology keeps being delayed.", "Lithium-ion batteries are obsolete.", "The prototype is ready."], a: 1, x: "It has been 'five years away' for over a decade." },
        { t: "mc", q: "The castle ___ to have been built in the 12th century.", o: ["is believed", "believes", "is believing", "has believed"], a: 0, x: "Impersonal passive: is believed + to have + past participle." },
        { t: "mc", q: "It ___ that prices will rise next year.", o: ["expects", "is expected", "is expecting", "expected"], a: 1, x: "It is expected that…" },
        { t: "fill", q: "I'm having my car ___ tomorrow. (service)", a: ["serviced"], x: "have + object + past participle." },
        { t: "mc", q: "The company is said ___ a new phone next month.", o: ["launching", "to launch", "launch", "to be launch"], a: 1, x: "be said + to-infinitive." },
        { t: "order", a: ["We", "got", "our", "kitchen", "redesigned", "last", "year"], p: ".", x: "get + object + past participle." },
        { t: "listen", audio: "Host: Is it true that the new chip will make phones last a week?\nScientist: That's what's being claimed, but it's thought to be at least five years from reaching the shops.\nHost: Why so long?\nScientist: Manufacturing it cheaply is the real challenge.", q: "What is the main problem with the new chip?", o: ["It doesn't work.", "Producing it cheaply.", "Phones are too small.", "Nobody wants it."], a: 1, x: "'Manufacturing it cheaply is the real challenge.'" }
      ],
      speaking: ["It is believed that the new drug will save lives.", "I'm getting my laptop repaired this week.", "The main drawback is that it's very expensive."]
    },
    {
      id: "b2-6", level: 4, title: "Money matters", topic: "Money & consumers",
      focus: ["grammar", "listening"],
      objectives: ["Make deductions about the past with must have, can't have, might have", "Talk about spending, saving and consumer problems", "Complain and ask for a refund"],
      grammar: {
        title: "Modals of deduction in the past",
        html: `<p>Use <b>modal + have + past participle</b> to make guesses about the past:</p>
<ul><li><b>must have</b>: you're almost sure it happened. <i>The shop's closed. It <b>must have shut</b> early.</i></li><li><b>can't / couldn't have</b>: you're sure it didn't happen. <i>She <b>can't have spent</b> all that money in one day!</i></li><li><b>might / may / could have</b>: it's possible. <i>I <b>might have left</b> my wallet in the taxi.</i></li></ul>
<p>Compare with <b>should have</b> (criticism or regret): <i>I <b>should have kept</b> the receipt.</i></p>`,
        examples: ["You must have paid too much for that.", "He can't have seen the price, or he wouldn't have bought it.", "The parcel might have been delivered to a neighbour."]
      },
      vocab: [
        ["refund", "money given back to you when you return something", "I asked for a refund."],
        ["budget", "a plan for how to spend money", "We're on a tight budget this month."],
        ["bargain", "something bought for less than its usual price", "This jacket was a real bargain."],
        ["overcharge", "ask someone to pay too much", "I think the restaurant overcharged us."],
        ["afford", "have enough money to pay for something", "We can't afford a new car."],
        ["impulse buy", "something you buy suddenly without planning", "These shoes were an impulse buy."]
      ],
      reading: {
        title: "Where did the money go?",
        text: "When Carlos checked his bank account at the end of the month, he got a shock: he had spent almost twice his budget. He couldn't have spent that much on food, he thought, and he hadn't bought anything big. Then he looked more closely. There were fourteen small payments to apps and streaming services, some of which he had forgotten about completely. He must have signed up for free trials and never cancelled them. He has now cancelled seven subscriptions and set a reminder for every free trial. 'I should have checked my statements months ago,' he admits."
      },
      ex: [
        { t: "mc", q: "Reading: Why had Carlos spent so much?", o: ["He bought something expensive.", "He had many forgotten subscriptions.", "He spent too much on food.", "The bank overcharged him."], a: 1, x: "Fourteen small payments to apps and streaming services." },
        { t: "mc", q: "Reading: What does Carlos regret?", o: ["not checking his statements earlier", "cancelling subscriptions", "buying food", "using free trials"], a: 0, x: "'I should have checked my statements months ago.'" },
        { t: "mc", q: "The lights are off. They ___ gone to bed.", o: ["must have", "can't have", "should have", "must"], a: 0, x: "Almost sure about the past → must have." },
        { t: "mc", q: "She ___ bought it. She doesn't have any money!", o: ["must have", "can't have", "might", "should have"], a: 1, x: "Sure it didn't happen → can't have." },
        { t: "fill", q: "I'm not sure where my keys are. I might ___ left them at work. (have)", a: ["have"], x: "might + have + past participle." },
        { t: "mc", q: "I ___ kept the receipt. Now I can't get a refund.", o: ["must have", "should have", "can't have", "may have"], a: 1, x: "Regret → should have." },
        { t: "order", a: ["The", "parcel", "may", "have", "been", "delivered", "next", "door"], p: ".", x: "may have been + past participle (passive)." },
        { t: "listen", audio: "Customer: I bought this kettle last week and it's already stopped working.\nAssistant: I'm sorry to hear that. Do you have the receipt?\nCustomer: I'm afraid I can't find it. I must have thrown it away.\nAssistant: That's OK. If you paid by card, we can find the payment and give you a refund.", q: "How can the customer get a refund?", o: ["by finding the receipt", "if they paid by card", "by buying a new kettle", "they can't"], a: 1, x: "'If you paid by card, we can find the payment'." }
      ],
      speaking: ["I must have left my wallet in the taxi.", "He can't have spent all his money already!", "I'd like a refund, please. It stopped working after a week."]
    },

    /* ---------------- C1 ---------------- */
    {
      id: "c1-5", level: 5, title: "Workplace culture", topic: "Work & organisations",
      focus: ["grammar", "speaking"],
      objectives: ["Use mixed conditionals to link past and present", "Discuss management styles and company culture", "Talk diplomatically about problems at work"],
      grammar: {
        title: "Mixed conditionals",
        html: `<p>Mixed conditionals connect different times:</p>
<ul><li><b>Past condition → present result</b>: <i>If I <b>had accepted</b> that job, I <b>would be living</b> in Dubai now.</i></li><li><b>Present condition → past result</b>: <i>If she <b>weren't</b> so organised, the project <b>would have failed</b>.</i></li></ul>
<p>You can also use <b>but for</b> + noun, <b>were it not for</b> and <b>had it not been for</b> (formal): <i><b>Had it not been for</b> her support, I <b>wouldn't be</b> a manager today.</i></p>`,
        examples: ["If we had invested in training, staff turnover wouldn't be so high now.", "If he weren't so stubborn, he would have agreed to the compromise.", "But for the new CEO, the company would have gone bankrupt."]
      },
      vocab: [
        ["hierarchy", "a system where people have higher and lower positions", "The company has a very flat hierarchy."],
        ["micromanage", "control every small detail of someone's work", "Nobody likes being micromanaged."],
        ["morale", "how confident and happy people feel at work", "Morale has been low since the layoffs."],
        ["burnout", "extreme tiredness caused by working too hard", "Long hours can lead to burnout."],
        ["delegate", "give part of your work to someone else", "Good managers know how to delegate."],
        ["accountable", "responsible for your actions and decisions", "Managers must be held accountable for results."]
      ],
      reading: {
        title: "The cost of control",
        text: "When Elena took over the design team, morale was at an all-time low. Her predecessor had micromanaged every decision, and three senior designers had already left. 'If he had trusted people more,' one employee commented, 'we wouldn't be so far behind schedule now.' Elena's approach was the opposite: she delegated whole projects and held people accountable for outcomes rather than hours. Within a year, the team had launched two products. Had it not been for her willingness to step back, colleagues say, burnout would almost certainly have claimed more of the team."
      },
      ex: [
        { t: "mc", q: "Reading: What was the problem before Elena arrived?", o: ["too little control", "excessive control", "too many products", "a flat hierarchy"], a: 1, x: "'Her predecessor had micromanaged every decision'." },
        { t: "mc", q: "Reading: How did Elena judge her team?", o: ["by the hours they worked", "by their outcomes", "by their seniority", "by their designs only"], a: 1, x: "'held people accountable for outcomes rather than hours'." },
        { t: "mc", q: "If I had studied law, I ___ a lawyer now.", o: ["would have been", "would be", "will be", "had been"], a: 1, x: "Past condition → present result: would + base verb." },
        { t: "mc", q: "If she ___ so shy, she would have spoken up in the meeting.", o: ["weren't", "hadn't been", "isn't", "wouldn't be"], a: 0, x: "Present (general) condition → past result." },
        { t: "fill", q: "Had it not ___ for your help, we would have missed the deadline. (be)", a: ["been"], x: "Had it not been for… (formal)." },
        { t: "mc", q: "But ___ her advice, I would have made a terrible mistake.", o: ["for", "of", "with", "from"], a: 0, x: "but for + noun = without." },
        { t: "order", a: ["If", "we'd", "hired", "more", "staff,", "we", "wouldn't", "be", "so", "busy", "now"], p: ".", x: "Mixed conditional: past → present." },
        { t: "listen", audio: "Manager: Why is the launch delayed again?\nTeam lead: Honestly? If we'd been given the final specs in March, we'd be testing now.\nManager: I understand. Is there anything I can do?\nTeam lead: Fewer last-minute changes would help.", q: "What caused the delay, according to the team lead?", o: ["The team worked too slowly.", "The specifications arrived late.", "Testing failed.", "The manager was absent."], a: 1, x: "'If we'd been given the final specs in March, we'd be testing now.'" }
      ],
      speaking: ["If I'd taken that job, I'd be living abroad now.", "Had it not been for her support, I wouldn't be here today.", "Good managers delegate and trust their teams."]
    },
    {
      id: "c1-6", level: 5, title: "Plans that changed", topic: "Plans & expectations",
      focus: ["grammar", "listening"],
      objectives: ["Talk about the future in the past (was going to, was about to, would)", "Describe plans that changed and expectations that weren't met", "Use expressions for timing and interruptions"],
      grammar: {
        title: "The future in the past",
        html: `<p>To describe what was planned or expected at a past moment:</p>
<ul><li><b>was/were going to</b>: a plan that often didn't happen. <i>I <b>was going to</b> call you, but I forgot.</i></li><li><b>was/were about to</b>: something that was going to happen very soon. <i>We <b>were about to</b> leave when the phone rang.</i></li><li><b>would</b>: the future seen from the past, often in stories. <i>She didn't know it then, but this meeting <b>would</b> change her life.</i></li><li><b>was/were to</b> (formal): <i>He <b>was to</b> become the youngest director in the company's history.</i> <b>was to have</b> + pp = it was planned but didn't happen.</li></ul>`,
        examples: ["We were going to buy a house, but prices rose too fast.", "I was on the point of giving up when they offered me the job.", "The concert was to have taken place in June."]
      },
      vocab: [
        ["on the verge of", "very close to doing something", "She was on the verge of quitting."],
        ["fall through", "fail to happen", "The deal fell through at the last minute."],
        ["in hindsight", "thinking about it later", "In hindsight, we should have waited."],
        ["unforeseen", "not expected", "Unforeseen problems delayed the project."],
        ["abandon", "stop doing a plan completely", "They abandoned the idea after a year."],
        ["turning point", "a time when an important change happens", "Moving abroad was a turning point in my life."]
      ],
      reading: {
        title: "The trip that never happened",
        text: "In 2019, Daniel and his partner were going to spend a year cycling from Lisbon to Istanbul. They had saved for three years and were about to hand in their notice when Daniel's father became seriously ill. The trip, which was to have started that September, was postponed, then abandoned altogether. At the time, Daniel was devastated. In hindsight, however, he sees it as a turning point. Caring for his father led him to retrain as a nurse, a career that would bring him far more satisfaction than the office job he had been on the verge of leaving."
      },
      ex: [
        { t: "mc", q: "Reading: When did the problem happen?", o: ["during the trip", "just before they resigned", "after they reached Istanbul", "three years earlier"], a: 1, x: "'were about to hand in their notice when…'" },
        { t: "mc", q: "Reading: How does Daniel feel now?", o: ["still devastated", "that it led to something positive", "that he should have gone", "angry with his father"], a: 1, x: "'he sees it as a turning point'." },
        { t: "mc", q: "I ___ to email you, but my laptop crashed.", o: ["was going", "would", "am going", "went"], a: 0, x: "A plan that didn't happen → was going to." },
        { t: "mc", q: "We were ___ to leave when it started snowing.", o: ["about", "going", "on", "verge"], a: 0, x: "was about to = very soon." },
        { t: "fill", q: "The wedding was to ___ taken place in May, but it was cancelled. (have)", a: ["have"], x: "was to have + past participle = planned, but didn't happen." },
        { t: "mc", q: "Neither of them knew that this meeting ___ change their lives.", o: ["will", "would", "was", "is going to"], a: 1, x: "Future seen from the past → would." },
        { t: "order", a: ["The", "deal", "fell", "through", "at", "the", "last", "minute"], p: ".", x: "fall through = fail to happen." },
        { t: "listen", audio: "Sofia: Weren't you going to move to Berlin this year?\nJames: I was. I'd even found a flat. Then my company offered me a promotion here.\nSofia: So the move's off?\nJames: For now. In hindsight, it was probably the right decision.", q: "Why didn't James move to Berlin?", o: ["He couldn't find a flat.", "He was offered a promotion.", "His company closed.", "He didn't like Berlin."], a: 1, x: "'Then my company offered me a promotion here.'" }
      ],
      speaking: ["I was going to call you, but I completely forgot.", "We were about to leave when the phone rang.", "In hindsight, it was the right decision."]
    },

    /* ---------------- C2 ---------------- */
    {
      id: "c2-5", level: 6, title: "Negotiation and tact", topic: "Diplomacy & negotiation",
      focus: ["speaking", "vocabulary"],
      objectives: ["Soften requests and disagreement with distancing language", "Use past tenses and modals for politeness", "Negotiate without causing offence"],
      grammar: {
        title: "Distancing and softening",
        html: `<p>Diplomatic English often makes statements less direct:</p>
<ul><li><b>Past tenses for politeness</b>: <i>I <b>was wondering</b> if you could… · We <b>were hoping</b> to…</i></li><li><b>Modals and tentative verbs</b>: <i>That <b>might</b> be difficult. It <b>would appear</b> that… · I <b>would suggest</b>…</i></li><li><b>Negative questions</b> to make suggestions: <i><b>Wouldn't it be</b> better to wait?</i></li><li><b>Qualifiers</b>: <i>slightly, a little, rather, not entirely, a bit of a</i>. <i>We're <b>not entirely</b> convinced. That's <b>a little</b> higher than we expected.</i></li><li><b>Passive</b> to avoid blame: <i>Mistakes <b>were made</b>.</i> rather than <i>You made mistakes.</i></li></ul>`,
        examples: ["I was wondering whether you'd be open to a slightly longer contract.", "It would seem that there has been a misunderstanding.", "Wouldn't it make more sense to review the figures first?"]
      },
      vocab: [
        ["leverage", "power or influence you can use to get what you want", "We don't have much leverage in this negotiation."],
        ["concession", "something you agree to give in order to reach an agreement", "Both sides made concessions."],
        ["deal-breaker", "a point that would make you reject an agreement", "The delivery date is a deal-breaker for us."],
        ["common ground", "shared interests or opinions", "Let's start by finding some common ground."],
        ["bottom line", "the minimum you will accept", "Our bottom line is a 10% discount."],
        ["tactful", "careful not to upset people", "She gave tactful but honest feedback."]
      ],
      reading: {
        title: "Saying no without saying no",
        text: "In many business cultures, a direct refusal is considered abrasive. Experienced negotiators therefore rely on an array of softening devices. Rather than 'Your price is too high', they might observe that the figure is 'a little above what we had budgeted for', or wonder aloud whether there might be 'some flexibility'. Such phrasing preserves goodwill and leaves room for concessions on both sides. The risk, of course, lies in being misunderstood: a counterpart from a more direct culture may take 'that could be challenging' at face value, unaware that it is, in effect, a polite rejection."
      },
      ex: [
        { t: "mc", q: "Reading: Why do negotiators use softening language?", o: ["to confuse the other side", "to preserve goodwill", "to avoid making concessions", "to sound more direct"], a: 1, x: "'Such phrasing preserves goodwill'." },
        { t: "mc", q: "Reading: What is the risk mentioned?", o: ["seeming rude", "being taken literally", "paying too much", "losing leverage"], a: 1, x: "A counterpart may take it 'at face value'." },
        { t: "mc", q: "Which is the most tactful?", o: ["Your report is wrong.", "There seem to be one or two inaccuracies in the report.", "You made mistakes in the report.", "The report is bad."], a: 1, x: "'seem', 'one or two' and an impersonal subject soften the criticism." },
        { t: "mc", q: "I ___ wondering if we could discuss the deadline.", o: ["am being", "was", "would", "have"], a: 1, x: "Past continuous for politeness: I was wondering…" },
        { t: "fill", q: "___ it be better to wait until next quarter? (would)", a: ["wouldn't", "would not"], x: "Negative questions make suggestions sound less forceful." },
        { t: "mc", q: "That price is ___ higher than we had anticipated.", o: ["a little", "very much", "extremely", "totally"], a: 0, x: "A qualifier softens the statement." },
        { t: "order", a: ["It", "would", "appear", "that", "there", "has", "been", "a", "misunderstanding"], p: ".", x: "It would appear that… distances the speaker." },
        { t: "listen", audio: "Supplier: So, can we go ahead at that price?\nBuyer: We're not entirely sure the figures work for us yet. Would there be any flexibility on the delivery charges?\nSupplier: Possibly, if you could commit to a two-year contract.\nBuyer: That might be something we could look at.", q: "What does the buyer really mean at the start?", o: ["They accept the price.", "The price is probably too high.", "They want to cancel.", "They need more time to deliver."], a: 1, x: "'not entirely sure the figures work' is a polite way to say the price is too high." }
      ],
      speaking: ["I was wondering whether there might be some flexibility on the price.", "Wouldn't it make more sense to review the figures first?", "That might be a little difficult for us."]
    },
    {
      id: "c2-6", level: 6, title: "The art of storytelling", topic: "Literature & narrative",
      focus: ["writing", "reading"],
      objectives: ["Use inversion after adverbials of place and movement", "Vary narrative tenses for effect", "Choose vivid, precise descriptive language"],
      grammar: {
        title: "Inversion for narrative effect",
        html: `<p>In literary and descriptive writing, the verb can come before the subject after an adverbial of <b>place</b> or <b>movement</b>:</p>
<ul><li><i>At the end of the corridor <b>stood a tall, silent figure</b>.</i></li><li><i>Into the room <b>burst the children</b>, soaked from the rain.</i></li><li><i>Down <b>came the rain</b>.</i> · <i>Here <b>comes the bus</b>.</i></li></ul>
<p>This only works with a <b>noun</b> subject, not a pronoun: <i>Here it comes</i> (not <s>Here comes it</s>).</p>
<p>Mix tenses for rhythm: past perfect for the backstory, past continuous for atmosphere, past simple for the key events, and occasionally the historic present for drama.</p>`,
        examples: ["On the hill above the village stood an abandoned church.", "Out of the fog emerged a small fishing boat.", "Away flew the birds, startled by the shot."]
      },
      vocab: [
        ["eerie", "strange and slightly frightening", "An eerie silence filled the house."],
        ["glimpse", "a quick, incomplete view of something", "I caught a glimpse of her in the crowd."],
        ["linger", "stay longer than expected", "The smell of smoke lingered for days."],
        ["dishevelled", "untidy, especially hair or clothes", "He arrived looking dishevelled and exhausted."],
        ["poignant", "causing a strong feeling of sadness", "It was a poignant reminder of what they had lost."],
        ["foreshadow", "be a sign of something that will happen later", "The storm foreshadows the tragedy to come."]
      ],
      reading: {
        title: "The lighthouse (extract)",
        text: "The boat had been drifting for hours when, at last, the fog began to thin. Ahead of them rose the cliffs, black and glistening, and on the highest point stood the lighthouse, its lamp long dead. Nobody had lived there for thirty years, or so the villagers claimed. Yet as they drew closer, Mara caught a glimpse of something that made her breath catch: in the topmost window, a faint, flickering light. She said nothing. The others were rowing in silence, their faces grey with fatigue, and she was not yet sure whether what she had seen was real or merely a trick of the lingering mist."
      },
      ex: [
        { t: "mc", q: "Reading: What surprised Mara?", o: ["the height of the cliffs", "a light in the lighthouse", "the villagers on the shore", "the end of the fog"], a: 1, x: "'a faint, flickering light' in a lighthouse believed to be empty." },
        { t: "mc", q: "Reading: Why didn't Mara tell the others?", o: ["She wanted to surprise them.", "She wasn't sure it was real.", "They were asleep.", "She was afraid of them."], a: 1, x: "'she was not yet sure whether what she had seen was real'." },
        { t: "mc", q: "In the corner of the room ___.", o: ["stood an old piano", "an old piano it stood", "did stand an old piano", "stood it"], a: 0, x: "Adverbial of place + verb + noun subject." },
        { t: "mc", q: "Which sentence is correct?", o: ["Here comes it.", "Here it comes.", "Here does it come.", "Here coming it."], a: 1, x: "No inversion with a pronoun subject." },
        { t: "fill", q: "Down ___ the rain, and the streets emptied in seconds. (come)", a: ["came"], x: "Inversion after 'down': came + subject." },
        { t: "mc", q: "Choose the most vivid verb: 'The old man ___ across the room.'", o: ["went", "moved", "shuffled", "did"], a: 2, x: "'shuffled' shows how he moved: slowly, dragging his feet." },
        { t: "order", a: ["Out", "of", "the", "darkness", "stepped", "a", "tall", "stranger"], p: ".", x: "Adverbial of movement + verb + subject." },
        { t: "listen", audio: "Editor: The opening's strong, but the middle drags a bit.\nWriter: Too much description?\nEditor: Partly. You've told us three times that the house is eerie. Show it once, through one detail, and trust the reader.\nWriter: Fair enough. I'll cut it back.", q: "What does the editor advise?", o: ["adding more description", "using one strong detail instead of repetition", "changing the setting", "rewriting the opening"], a: 1, x: "'Show it once, through one detail, and trust the reader.'" }
      ],
      speaking: ["At the end of the corridor stood a tall, silent figure.", "Here comes the bus at last!", "The smell of smoke lingered for days."]
    }
  );

  Object.assign(GEN.UNIT_TOPICS, {
    "a1-5": ["prepPlace", "everyday"], "a1-6": ["countable", "thereIs"],
    "a2-5": ["usedTo", "pastSimple"], "a2-6": ["directions", "places"],
    "b1-5": ["ppCont", "presentPerfect"], "b1-6": ["futureForms", "goingTo"],
    "b2-5": ["passiveReport", "haveDone"], "b2-6": ["deductionPast", "collocations"],
    "c1-5": ["mixedCond", "invertedCond"], "c1-6": ["futureInPast", "advancedVocab"],
    "c2-5": ["softening", "connotation"], "c2-6": ["placeInversion", "idioms"]
  });

  Object.assign(D.WRITING, {
    "a1-5": { prompt: "Describe your home. What rooms are there, and where are your favourite things?", min: 30, check: ["\\b(in|on|under|next to|between|behind|in front of)\\b", "uses prepositions of place"], model: "I live in a small house with my family. There is a kitchen, a living room and three bedrooms. My bedroom is upstairs, next to the bathroom. My favourite thing is my guitar. It is on a chair in my bedroom, between the bed and the window." },
    "a1-6": { prompt: "What do you usually eat and drink in a day? Write about your meals.", min: 30, check: ["\\b(some|any|a lot of|how much|how many|an?)\\b", "uses a/an, some or a lot of"], model: "For breakfast I have some bread with cheese and a cup of coffee. I eat an apple at eleven. For lunch I usually have rice and vegetables. In the evening my family cooks dinner together. We drink a lot of water. I don't eat any meat, but I love fish." },
    "a2-5": { prompt: "How is your life different now from when you were a child? Write about three changes.", min: 50, check: ["\\bused to\\b|\\bdidn't use to\\b", "uses 'used to'"], model: "When I was a child, I used to live in a small town by the sea. I used to swim every day in summer, but now I live in a big city and I don't swim very often. I didn't use to like vegetables, but now I eat them every day. I also used to be very shy. Nowadays I talk to new people at work all the time." },
    "a2-6": { prompt: "Write directions from your home (or a station) to your favourite place in your town.", min: 50, check: ["\\b(turn|go|walk|take|cross)\\b", "uses imperatives for directions"], model: "From the station, go out of the main exit and turn right. Walk along the main road and go past the bank and the cinema. At the traffic lights, cross the road and turn left. Go through the small park and you will see my favourite café opposite the library. It's on the corner, next to a bookshop. It takes about ten minutes." },
    "b1-5": { prompt: "How do you get your news? Describe your habits and how they have changed recently.", min: 65, check: ["\\b(have|has|i've|we've|she's|he's) been \\w+ing\\b", "uses the present perfect continuous"], model: "I've been reading the news on my phone for about ten years, and I haven't bought a printed newspaper since university. Recently I've been listening to news podcasts on my way to work, which I really enjoy because they explain the stories in more detail. I've also been trying to spend less time on social media, because I've noticed that a lot of the stories there are not reliable. I've subscribed to one online newspaper, and I always check the source before I share anything." },
    "b1-6": { prompt: "Write a message to friends to arrange a day out. Include times, plans and what you'll do if something goes wrong.", min: 65, check: ["\\b(going to|'m \\w+ing|are \\w+ing|is \\w+ing|will|'ll)\\b", "uses future forms"], model: "Hi everyone! Just to confirm the plan for Sunday: we're meeting at the station at nine, and the train leaves at 9.20. I'm going to bring sandwiches, so you don't need to buy lunch. Ana is working in the morning, so she'll meet us at the beach at about one. If it rains, we'll go to the aquarium instead. I'll check the weather forecast on Saturday evening and send you a message. Let me know if this suits you!" },
    "b2-5": { prompt: "Write a short article about a new technology. Report what experts say about it, and mention its drawbacks.", min: 85, check: ["\\b(is|are|was|were) (said|thought|believed|expected|reported|claimed|estimated|considered) (to|that)\\b|\\bit is (said|thought|believed|expected|reported|claimed|estimated) that\\b", "uses impersonal passive structures"], model: "Vertical farms, in which crops are grown indoors on tall shelves under LED lights, are thought to be one of the most promising solutions to food shortages in cities. It is estimated that they use up to 95% less water than traditional farms, and because they are built close to consumers, transport costs are dramatically reduced. Several supermarket chains are reported to be investing in the technology. However, there are significant drawbacks. The farms are said to consume enormous amounts of electricity, and so far only salad leaves and herbs are considered profitable. Until energy becomes cheaper, the breakthrough many people expect may be some way off." },
    "b2-6": { prompt: "Write about a time when money or a purchase went wrong, and speculate about what must or might have happened.", min: 85, check: ["\\b(must|might|may|could|can't|couldn't|should) have \\w+", "uses past modals of deduction"], model: "Last year I ordered a sofa online for what seemed like a real bargain. The website promised delivery in a week, but after a month nothing had arrived and the company wasn't answering emails. At first I thought the parcel might have been delivered to the wrong address, but none of my neighbours had seen it. In the end I realised the company can't have been genuine: the website must have been a scam, because it disappeared a few days later. Luckily, I had paid by credit card, so the bank gave me a refund. I should have checked the reviews before I paid." },
    "c1-5": { prompt: "Describe a manager, teacher or leader who made a difference. How would things be different now if they hadn't?", min: 100, check: ["\\bif\\b[^.]*\\b(had|hadn't|'d)\\b[^.]*\\b(would|wouldn't|'d) (be|have|not)\\b|\\bhad it not been for\\b|\\bbut for\\b", "uses a mixed or inverted conditional"], model: "The person who made the biggest difference to my career was my first manager, Grace. Unlike many managers, she never micromanaged; instead, she delegated real responsibility from the start and held us accountable for results rather than hours. When I made a serious mistake in my first month, she treated it as a learning opportunity rather than a disaster. If she had reacted differently, I would probably not be working in this industry now, because I was on the verge of giving up. Had it not been for her trust, I wouldn't have the confidence I have today. But for her example, I would also be a far worse manager myself." },
    "c1-6": { prompt: "Write about a plan that changed or never happened, and what happened instead.", min: 100, check: ["\\b(was|were) (going to|about to|on the point of|on the verge of|to have)\\b|\\bwould\\b", "uses the future in the past"], model: "When I finished university, I was going to spend a year teaching English in Japan. I had already been offered a position and was about to book my flight when the school unexpectedly closed. The job, which was to have started in April, simply disappeared, and for a few weeks I was on the verge of abandoning the idea of travelling altogether. In the end, I took a temporary job at a local publisher to save some money. I didn't know it then, but that job would turn out to be a turning point: I discovered that I loved editing, and I have worked in publishing ever since. In hindsight, the unforeseen closure was a lucky escape." },
    "c2-5": { prompt: "Write a tactful email to a client or colleague, declining a request or disagreeing with a proposal without causing offence.", min: 100, check: ["\\b(i was wondering|we were hoping|it would (seem|appear)|not entirely|might|a little|slightly|would suggest|wouldn't it)\\b", "uses softening language"], model: "Dear Ms Hughes,\n\nThank you for sending through the revised proposal, and for the considerable work that has clearly gone into it. Having discussed it with the team, we are not entirely convinced that the proposed timeline would be achievable on our side, particularly given the current pressure on our production capacity. The fee, too, is a little higher than we had budgeted for. I was wondering, therefore, whether there might be some flexibility on either the schedule or the scope. Wouldn't it make sense to arrange a short call next week to explore some common ground? We would, of course, be prepared to make some concessions ourselves, and we would very much like to find an arrangement that works for both of us." },
    "c2-6": { prompt: "Write the opening of a short story. Use at least one inversion after an adverbial of place or movement, and vivid descriptive language.", min: 100, check: ["\\b(at|on|in|into|out of|down|up|across|beyond|above|below|beside|through|away|here|there)\\b[^.]{0,40}\\b(stood|sat|lay|came|rose|ran|hung|stretched|burst|emerged|flew|loomed|walked|stepped|lived|grew)\\b (a|an|the|two|three|his|her|their|my|our)\\b", "uses inversion after a place or movement adverbial"], model: "The town had been asleep for hours when the first car of the evening rolled down the hill. At the bottom of the main street stood a hotel that had not welcomed a guest since the mine closed, its sign hanging by a single rusted chain. Out of the car stepped a woman in a long grey coat, dishevelled from the journey, and for a moment she simply looked up at the dark windows, as though she expected someone to look back. An eerie stillness lingered over everything. She took a key from her pocket, an old brass key that she had kept for twenty years, and walked towards the door." }
  });
  Object.assign(D.SPEAKING_PROMPTS, {
    "a1-5": "Describe your home: the rooms and where your things are.",
    "a1-6": "Talk about your favourite meal and what you eat in a normal day.",
    "a2-5": "Talk about how your life has changed since you were a child.",
    "a2-6": "Give directions from your home to the nearest shop or station.",
    "b1-5": "Talk about how you get your news and what you've been following recently.",
    "b1-6": "Make plans for next weekend with a friend: say what's fixed and what isn't.",
    "b2-5": "Talk about a technology that is said to be changing the world, and its drawbacks.",
    "b2-6": "Talk about a time money went wrong and what must have happened.",
    "c1-5": "Describe the best or worst manager you've had and how things would be different now.",
    "c1-6": "Talk about a plan that never happened and what happened instead.",
    "c2-5": "Politely turn down a request from your manager, without causing offence.",
    "c2-6": "Tell a short story, using vivid description and at least one inversion."
  });

  /* =====================================================================
     generators for units 5 and 6
     ===================================================================== */

  const QA = (list) => () => { const [q, c, w, x] = pick(list); return { q, correct: c, wrong: w, x }; };
  G(1, "grammar", "prepPlace", QA([
    ["The milk is cold because it's ___ the fridge.", "in", ["on", "under", "between"], "in = inside."],
    ["Your keys are ___ the table, next to the phone.", "on", ["in", "under", "between"], "on = on top of a surface."],
    ["The cat is hiding ___ the bed. I can only see its tail.", "under", ["on", "in", "between"], "under = below."],
    ["The bank is ___ the café and the cinema.", "between", ["next", "under", "in"], "between + two things."],
    ["My bag is ___ to the door, on the floor.", "next", ["between", "under", "in front"], "next to = at the side of."],
    ["The car is parked ___ front of the house.", "in", ["on", "at", "under"], "in front of."],
    ["There's a small garden ___ the house, where the children play.", "behind", ["between", "under", "on"], "behind = at the back of."],
    ["The books are ___ the shelf above my desk.", "on", ["in", "under", "between"], "on a shelf."]
  ]));
  const CNT = [["apples", 1], ["eggs", 1], ["bananas", 1], ["sandwiches", 1], ["water", 0], ["milk", 0], ["rice", 0], ["bread", 0], ["cheese", 0], ["money", 0]];
  G(1, "grammar", "countable", () => {
    const [n, c] = pick(CNT);
    if (Math.random() < 0.6) return { q: `How ___ ${n} do we need?`, correct: c ? "many" : "much", wrong: [c ? "much" : "many", "lot", "any"], x: c ? "Countable plural → How many." : "Uncountable → How much." };
    const w = pick([["orange", "an"], ["egg", "an"], ["apple", "an"], ["banana", "a"], ["sandwich", "a"]]);
    return { q: `Can I have ___ ${w[0]}, please?`, correct: w[1], wrong: [w[1] === "an" ? "a" : "an", "some", "any"], x: "a/an + one countable thing; an before a vowel sound." };
  });
  const HABITS = [["play", "football"], ["live", "in a village"], ["walk", "to school"], ["have", "long hair"], ["go", "camping"], ["read", "comics"], ["watch", "cartoons"]];
  G(2, "grammar", "usedTo", () => {
    const p = person(), [v, o] = pick(HABITS);
    const k = pick([0, 1, 2]);
    if (k === 0) return { q: `When ${p.he} was young, ${p.n} ___ ${v} ${o}.`, correct: "used to", wrong: ["use to", "was used to", "uses to"], x: "Past habit → used to + base verb." };
    if (k === 1) return { q: `${p.n} ___ ${v} ${o}, but now ${p.he} does.`, correct: "didn't use to", wrong: ["didn't used to", "wasn't use to", "not used to"], x: "Negative: didn't use to." };
    return { q: `Did you ___ ${v} ${o} as a child?`, correct: "use to", wrong: ["used to", "using to", "uses to"], x: "Question: Did + subject + use to." };
  });
  G(2, "vocabulary", "directions", QA([
    ["Walk ___ the park and you'll see the museum on the other side.", "through", ["over", "along", "out"], "through = from one side to the other inside something."],
    ["Go ___ the bridge and turn left.", "over", ["through", "out of", "between"], "over a bridge."],
    ["The hotel is ___ the station, on the other side of the road.", "opposite", ["through", "along", "over"], "opposite = facing."],
    ["Go ___ on for about two hundred metres.", "straight", ["direct", "right", "forward to"], "Go straight on = don't turn."],
    ["Turn left ___ the traffic lights.", "at", ["in", "on", "to"], "at the traffic lights / at the corner."],
    ["Excuse me, how do I ___ to the station?", "get", ["arrive", "go to", "reach to"], "How do I get to…?"],
    ["Take the second exit at the ___.", "roundabout", ["corner", "crossing", "traffic lights"], "Exits are on a roundabout."]
  ]));
  const SINCE = ["2019", "January", "last summer", "eight o'clock", "Monday"];
  const PPC = [["work", "working", "works", "here"], ["study", "studying", "studies", "Spanish"], ["live", "living", "lives", "in this flat"], ["wait", "waiting", "waits", "for the bus"], ["play", "playing", "plays", "in the band"]];
  const PPS = [["written", "writing", "write", "emails"], ["read", "reading", "read", "chapters"], ["made", "making", "make", "phone calls"], ["sent", "sending", "send", "messages"]];
  G(3, "grammar", "ppCont", () => {
    const p = person();
    if (Math.random() < 0.55) {
      const [, ing, s3, rest] = pick(PPC);
      return { q: `${p.n} ___ ${rest} since ${pick(SINCE)}.`, correct: `has been ${ing}`, wrong: [`is ${ing}`, s3, `was ${ing}`], x: "From a past time until now (since) → has been + -ing." };
    }
    const [pp, ing, base, things] = pick(PPS);
    return { q: `I ___ ${pick(["three", "four", "five"])} ${things} this morning.`, correct: `'ve ${pp}`, wrong: [`'ve been ${ing}`, `'m ${ing}`, base], x: "A number of finished things → present perfect simple." };
  });
  G(3, "grammar", "futureForms", QA([
    ["\"The phone's ringing.\" \"I ___ get it!\"", "'ll", ["'m getting", "'m going to", "get"], "A decision at the moment of speaking → will."],
    ["My train ___ at 8.15 tomorrow.", "leaves", ["will leave", "is leaving to", "leaving"], "Timetables → present simple."],
    ["I ___ my aunt on Saturday. We booked it last week.", "'m visiting", ["'ll visit", "visit", "would visit"], "A fixed arrangement → present continuous."],
    ["Look at that car! It ___ crash!", "'s going to", ["will", "crashes", "is crashing to"], "A prediction from present evidence → going to."],
    ["I think the team ___ win the match.", "will", ["is winning", "wins", "are going"], "An opinion about the future → will."],
    ["We ___ start a business next year. That's our plan.", "'re going to", ["will", "start", "would"], "An intention → going to."]
  ]));
  G(4, "grammar", "passiveReport", QA([
    ["It ___ that the economy will grow next year.", "is expected", ["expects", "is expecting", "has expected"], "Impersonal passive: It is expected that…"],
    ["The painting is said ___ worth millions.", "to be", ["being", "be", "that is"], "be said + to-infinitive."],
    ["The castle is thought ___ in the 1300s.", "to have been built", ["to build", "to be built", "having built"], "A past event → to have + past participle."],
    ["The company ___ to be planning job cuts.", "is reported", ["reports", "is reporting", "reported"], "be reported + to-infinitive."],
    ["It ___ that over a million people attended.", "is estimated", ["estimates", "is estimating", "has estimated"], "It is estimated that…"],
    ["The minister is believed ___ the country last night.", "to have left", ["to leave", "leaving", "to be left"], "Past action → to have + past participle."]
  ]));
  G(4, "grammar", "haveDone", () => {
    const [obj, pp, ing, base] = pick([["my hair", "cut", "cutting", "cut"], ["my car", "serviced", "servicing", "service"], ["the house", "painted", "painting", "paint"], ["my phone screen", "replaced", "replacing", "replace"], ["our windows", "cleaned", "cleaning", "clean"], ["my eyes", "tested", "testing", "test"]]);
    return { q: `I'm going to have ${obj} ___ next week.`, correct: pp, wrong: [ing, "to " + base, base === pp ? base + "s" : base], x: "have + object + past participle: someone else does it for you." };
  });
  G(4, "grammar", "deductionPast", QA([
    ["The ground is wet. It ___ rained last night.", "must have", ["can't have", "should have", "must"], "Almost sure about the past → must have."],
    ["She ___ seen us. She walked straight past without saying hello.", "can't have", ["must have", "should have", "can have"], "Sure it didn't happen → can't have."],
    ["I don't know where he is. He ___ gone home early.", "might have", ["must", "can't have", "should have"], "Possible → might have."],
    ["You ___ told me you were coming! I'd have made dinner.", "should have", ["must have", "might have", "can't have"], "Criticism → should have."],
    ["They ___ been at home. Nobody answered the door.", "can't have", ["must have", "should have", "would have"], "Logically impossible → can't have."],
    ["He looks really happy. He ___ got the job.", "must have", ["can't have", "should have", "might"], "A strong conclusion from evidence → must have."]
  ]));
  G(5, "grammar", "mixedCond", QA([
    ["If I had saved more money, I ___ a house now.", "would own", ["would have owned", "will own", "owned"], "Past condition → present result: would + base verb."],
    ["If she weren't so talented, she ___ promoted last year.", "wouldn't have been", ["wouldn't be", "won't be", "hadn't been"], "Present condition → past result."],
    ["If we had left earlier, we ___ stuck in traffic now.", "wouldn't be", ["wouldn't have been", "won't be", "aren't"], "Past condition → present result."],
    ["___ it not been for the rain, the match would have finished.", "Had", ["If", "Were", "Should"], "Had it not been for… (formal)."],
    ["If he spoke French, he ___ the job in Paris.", "would have got", ["would get", "will get", "had got"], "Present condition (he doesn't speak French) → past result."],
    ["But ___ your help, I'd still be looking for a flat.", "for", ["of", "without", "with"], "but for + noun = without."]
  ]));
  G(5, "grammar", "futureInPast", QA([
    ["I ___ going to call you, but I lost my phone.", "was", ["am", "would", "will be"], "A plan that didn't happen → was going to."],
    ["We were ___ to leave when it started to rain.", "about", ["going", "verge", "point"], "was about to = very soon."],
    ["She didn't know then that she ___ become famous.", "would", ["will", "was", "is going to"], "Future seen from the past → would."],
    ["The concert was to ___ taken place last Friday, but it was cancelled.", "have", ["be", "had", "been"], "was to have + past participle = planned but didn't happen."],
    ["I was on the ___ of giving up when they called.", "point", ["edge", "about", "side"], "on the point of + -ing."],
    ["The deal fell ___ at the last minute.", "through", ["off", "down", "over"], "fall through = fail to happen."]
  ]));
  G(6, "vocabulary", "softening", QA([
    ["Which is the most tactful way to disagree?", "I'm not entirely sure I agree with that.", ["You're wrong.", "That's a stupid idea.", "I disagree completely."], "'not entirely' softens the disagreement."],
    ["Choose the most diplomatic request.", "I was wondering if you could send it by Friday.", ["Send it by Friday.", "You must send it by Friday.", "I want it by Friday."], "Past continuous 'I was wondering' sounds polite and indirect."],
    ["Which sentence avoids blaming anyone?", "Some mistakes were made in the report.", ["You made mistakes in the report.", "Your report is full of mistakes.", "Who made these mistakes?"], "The passive avoids naming the person."],
    ["Choose the softest way to say the price is too high.", "It's a little above what we'd budgeted for.", ["It's far too expensive.", "Your price is ridiculous.", "We won't pay that."], "Qualifiers like 'a little' soften criticism."],
    ["\"___ it be better to wait until the spring?\"", "Wouldn't", ["Won't", "Doesn't", "Isn't"], "Negative questions make suggestions less forceful."],
    ["It would ___ that there has been a misunderstanding.", "appear", ["look", "show", "seem to"], "It would appear that… distances the speaker."]
  ]));
  G(6, "grammar", "placeInversion", QA([
    ["At the top of the hill ___.", "stood an old castle", ["an old castle stood it", "did stand an old castle", "stood it"], "Adverbial of place + verb + noun subject."],
    ["Which sentence is correct?", "Here comes the bus.", ["Here comes it.", "Here does the bus come.", "Here the bus does come."], "Inversion only with a noun subject."],
    ["Into the room ___, laughing and shouting.", "ran the children", ["the children did run", "did the children run", "ran they"], "Adverbial of movement + verb + subject."],
    ["Which sentence is correct?", "There it is!", ["There is it!", "There does it be!", "There it does is!"], "With a pronoun, no inversion: There it is."],
    ["Out of the shadows ___ a tall figure.", "stepped", ["did step", "stepping", "has stepping"], "Inversion after an adverbial of movement: stepped + subject."],
    ["Choose the most vivid verb: 'The wind ___ through the empty streets.'", "howled", ["went", "was", "moved"], "'howled' adds sound and atmosphere."]
  ]));
})();
