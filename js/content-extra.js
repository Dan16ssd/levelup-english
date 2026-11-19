/* LevelUp English — extra units (one more per level) and writing tasks for every unit. */
(function () {
  "use strict";
  const D = window.LU_DATA;

  D.UNITS.push(
    {
      id: "a1-3", level: 1, title: "At the shops", topic: "Shopping & food",
      focus: ["vocabulary", "listening"],
      objectives: ["Ask for things in a shop", "Use 'some' and 'any'", "Ask and say prices"],
      grammar: {
        title: "There is / there are with some & any",
        html: `<p>Use <b>there is</b> with one thing and <b>there are</b> with two or more:</p>
<ul><li><i>There <b>is</b> a bakery near my house.</i></li><li><i>There <b>are</b> two supermarkets in the town.</i></li></ul>
<p><b>some</b> in positive sentences, <b>any</b> in questions and negatives:</p>
<ul><li><i>There are <b>some</b> apples in the bag.</i></li><li><i>Are there <b>any</b> eggs?</i> / <i>There aren't <b>any</b> eggs.</i></li></ul>
<p>Prices: <i>How much <b>is</b> this bread?</i> (one thing) · <i>How much <b>are</b> these bananas?</i> (two or more)</p>`,
        examples: ["There is some milk in the fridge.", "Are there any tomatoes?", "How much are these oranges?"]
      },
      vocab: [
        ["bread", "a basic food made from flour and baked", "I buy fresh bread every morning."],
        ["cheap", "not expensive", "The apples are very cheap today."],
        ["expensive", "costs a lot of money", "This coffee is too expensive."],
        ["receipt", "a paper that shows what you paid", "Can I have a receipt, please?"],
        ["bag", "something you carry things in", "Do you need a bag?"],
        ["cash", "money in coins and notes", "Can I pay in cash?"]
      ],
      reading: {
        title: "Saturday at the market",
        text: "Every Saturday, Mia goes to the market in the town centre. There are a lot of small shops and there is a big café. She buys some bread, some cheese and some fruit. The fruit is cheap but the cheese is expensive. Today there aren't any strawberries, so she buys some bananas. She always pays in cash and takes her own bag."
      },
      ex: [
        { t: "mc", q: "Reading: What does Mia buy instead of strawberries?", o: ["Apples", "Bananas", "Oranges", "Cheese"], a: 1, x: "'there aren't any strawberries, so she buys some bananas'." },
        { t: "mc", q: "There ___ two cafés on this street.", o: ["is", "are", "be"], a: 1, x: "Two cafés → there are." },
        { t: "fill", q: "Are there ___ eggs in the fridge?", a: ["any"], x: "Questions → any." },
        { t: "fill", q: "I'd like ___ water, please.", a: ["some"], x: "Positive requests → some." },
        { t: "mc", q: "How much ___ these shoes?", o: ["is", "are", "am"], a: 1, x: "'these shoes' is plural → are." },
        { t: "mc", q: "The opposite of 'cheap' is ___.", o: ["small", "expensive", "fresh", "free"], a: 1, x: "cheap ↔ expensive." },
        { t: "order", a: ["Can", "I", "pay", "in", "cash"], p: "?", x: "Can + I + verb … ?" },
        { t: "listen", audio: "That's four pounds fifty for the bread and the milk. Do you need a bag?", q: "How much does the customer pay?", o: ["£4.15", "£4.50", "£5.40", "£14.50"], a: 1, x: "'four pounds fifty' = £4.50." }
      ],
      speaking: ["How much is this, please?", "Are there any apples?", "Can I pay by card?"]
    },
    {
      id: "a2-3", level: 2, title: "Rules and advice", topic: "Health & rules",
      focus: ["grammar", "listening"],
      objectives: ["Talk about rules and obligations", "Give advice", "Say what isn't necessary"],
      grammar: {
        title: "must / have to / should / don't have to",
        html: `<ul><li><b>must</b> / <b>have to</b>: it's necessary or it's a rule. <i>You <b>must</b> wear a helmet. I <b>have to</b> start work at eight.</i></li>
<li><b>mustn't</b>: it's not allowed. <i>You <b>mustn't</b> smoke here.</i></li>
<li><b>don't have to</b>: it isn't necessary (but you can). <i>You <b>don't have to</b> come. It's optional.</i></li>
<li><b>should</b> / <b>shouldn't</b>: advice. <i>You <b>should</b> see a doctor. You <b>shouldn't</b> work so late.</i></li></ul>
<p>After all of these, use the <b>base verb</b>: <i>should <s>to</s> go</i>, <i>must <s>going</s> go</i>.</p>`,
        examples: ["You should drink more water.", "We don't have to wear a uniform.", "You mustn't use your phone in the exam."]
      },
      vocab: [
        ["headache", "a pain in your head", "I've got a terrible headache."],
        ["rest", "relax or sleep to get better", "You should rest for a few days."],
        ["medicine", "something you take when you are ill", "Take this medicine twice a day."],
        ["allowed", "permitted by the rules", "Dogs aren't allowed in the shop."],
        ["healthy", "good for your body", "Fruit is a healthy snack."],
        ["exercise", "physical activity to stay fit", "I do exercise three times a week."]
      ],
      reading: {
        title: "Ask the doctor",
        text: "Dear Doctor, I often feel tired and I get headaches in the afternoon. What should I do? — Sam. Dear Sam, You should drink more water and you shouldn't drink so much coffee. Try to go to bed earlier. You don't have to go to the gym every day, but you should walk for thirty minutes. If the headaches don't stop, you must see your doctor."
      },
      ex: [
        { t: "mc", q: "Reading: What does the doctor say Sam doesn't need to do?", o: ["Drink water", "Go to the gym every day", "Walk for thirty minutes", "Go to bed earlier"], a: 1, x: "'You don't have to go to the gym every day.'" },
        { t: "mc", q: "You look tired. You ___ go to bed.", o: ["should", "mustn't", "don't have to"], a: 0, x: "Advice → should." },
        { t: "mc", q: "It's Sunday, so I ___ get up early.", o: ["mustn't", "don't have to", "must"], a: 1, x: "Not necessary → don't have to." },
        { t: "fill", q: "You ___ smoke in the hospital. It's against the rules.", a: ["mustn't", "must not", "can't", "cannot"], x: "Not allowed → mustn't." },
        { t: "fill", q: "She has ___ wear a uniform at work.", a: ["to"], x: "have to + verb." },
        { t: "mc", q: "Which is correct?", o: ["You should to rest.", "You should rest.", "You should resting."], a: 1, x: "should + base verb." },
        { t: "order", a: ["You", "should", "drink", "more", "water"], p: ".", x: "Subject + should + verb." },
        { t: "listen", audio: "You don't have to bring any food, but you must bring good walking shoes.", q: "What must people bring?", o: ["Food", "Walking shoes", "Water", "Nothing"], a: 1, x: "'you must bring good walking shoes'." }
      ],
      speaking: ["You should get some rest.", "We don't have to wear a uniform.", "You mustn't park here."]
    },
    {
      id: "b1-3", level: 3, title: "How it's made", topic: "Products & processes",
      focus: ["grammar", "reading"],
      objectives: ["Describe processes with the passive", "Say who did something with 'by'", "Talk about where products come from"],
      grammar: {
        title: "The passive (present & past)",
        html: `<p>Use the <b>passive</b> when the action is more important than who does it. Form: <b>be + past participle</b>.</p>
<ul><li>Present: <i>Coffee <b>is grown</b> in Brazil. The cars <b>are made</b> in Germany.</i></li>
<li>Past: <i>The bridge <b>was built</b> in 1890. These photos <b>were taken</b> by my father.</i></li></ul>
<p>Add <b>by</b> only when the person is important: <i>Hamlet was written <b>by</b> Shakespeare.</i></p>
<p>Active → passive: <i>They <b>clean</b> the offices every night.</i> → <i>The offices <b>are cleaned</b> every night.</i></p>`,
        examples: ["Chocolate is made from cocoa beans.", "The museum was opened in 1995.", "Thousands of emails are sent every second."]
      },
      vocab: [
        ["produce", "make or grow something to sell", "This factory produces furniture."],
        ["ingredient", "one of the foods in a recipe", "Flour is the main ingredient."],
        ["factory", "a building where things are made", "She works in a car factory."],
        ["export", "sell goods to another country", "Japan exports a lot of cars."],
        ["invent", "create something new for the first time", "The telephone was invented in 1876."],
        ["process", "a series of steps to make something", "Making cheese is a slow process."]
      ],
      reading: {
        title: "From bean to bar",
        text: "Most of the world's cocoa is grown in West Africa. The beans are picked by hand and are left in the sun to dry. Then they are sent to factories, often in Europe, where they are roasted and turned into chocolate. Milk chocolate was invented in Switzerland in 1875. Today, millions of bars are produced every day and exported all over the world."
      },
      ex: [
        { t: "mc", q: "Reading: Where was milk chocolate invented?", o: ["West Africa", "Brazil", "Switzerland", "Belgium"], a: 2, x: "'Milk chocolate was invented in Switzerland in 1875.'" },
        { t: "mc", q: "English ___ in many countries.", o: ["speaks", "is spoken", "is speaking"], a: 1, x: "Present passive: is + spoken." },
        { t: "mc", q: "The Eiffel Tower ___ in 1889.", o: ["was built", "is built", "built"], a: 0, x: "Past passive: was + built." },
        { t: "fill", q: "These photos were taken ___ my grandfather.", a: ["by"], x: "by + the person who did it." },
        { t: "fill", q: "The letters ___ delivered every morning.", a: ["are"], x: "Plural, present → are delivered." },
        { t: "mc", q: "Active: 'Someone stole my bike.' Passive:", o: ["My bike stole.", "My bike was stolen.", "My bike is stolen by someone."], a: 1, x: "Past passive: was stolen." },
        { t: "order", a: ["The", "museum", "was", "opened", "in", "1995"], p: ".", x: "Subject + was + past participle." },
        { t: "listen", audio: "All our furniture is designed in Sweden, but most of it is made in Poland.", q: "Where is most of the furniture made?", o: ["Sweden", "Poland", "Germany", "Denmark"], a: 1, x: "'most of it is made in Poland'." }
      ],
      speaking: ["Coffee is grown in Brazil.", "The bridge was built in 1890.", "It was invented by a teenager."]
    },
    {
      id: "b2-3", level: 4, title: "Telling stories", topic: "Narratives & anecdotes",
      focus: ["grammar", "listening"],
      objectives: ["Use narrative tenses to tell a story", "Show the order of past events", "Use time linkers"],
      grammar: {
        title: "Narrative tenses: past simple, continuous & perfect",
        html: `<ul><li><b>Past simple</b>: the main events, in order. <i>I <b>got</b> up, <b>grabbed</b> my bag and <b>left</b>.</i></li>
<li><b>Past continuous</b>: the background, or an action in progress. <i>It <b>was raining</b> and people <b>were rushing</b> home.</i></li>
<li><b>Past perfect</b>: something that happened <i>before</i> another past event. <i>When I reached the station, the train <b>had</b> already <b>left</b>.</i></li></ul>
<p>Linkers: <i>as soon as, by the time, while, just as, eventually, in the end</i>.</p>`,
        examples: ["I was walking home when I heard a strange noise.", "By the time the police arrived, the thief had escaped.", "As soon as she had finished, she called me."]
      },
      vocab: [
        ["realise", "suddenly understand or notice", "I realised I'd left my keys inside."],
        ["eventually", "in the end, after a long time", "We eventually found the hotel."],
        ["rush", "move or do something very quickly", "Everyone was rushing to catch the train."],
        ["turn out", "happen in a way you didn't expect", "The stranger turned out to be my neighbour."],
        ["embarrassed", "feeling silly in front of others", "I was so embarrassed I went red."],
        ["luckily", "fortunately", "Luckily, nobody was hurt."]
      ],
      reading: {
        title: "The wrong wedding",
        text: "It was a hot afternoon and I was running late. By the time I found the church, the ceremony had already started. I sat at the back and tried to look calm. Just as the couple were exchanging rings, I realised that I didn't recognise anyone. It turned out that my friend's wedding was at a different church on the same street. I left as quietly as I could, feeling deeply embarrassed. Luckily, I eventually arrived in time for the speeches."
      },
      ex: [
        { t: "mc", q: "Reading: Why was the writer at the wrong wedding?", o: ["The wedding was cancelled", "There were two churches on the same street", "The friend gave the wrong date", "The writer was invited by mistake"], a: 1, x: "'a different church on the same street'." },
        { t: "mc", q: "When we got to the cinema, the film ___.", o: ["already started", "had already started", "was already starting"], a: 1, x: "Earlier past event → past perfect." },
        { t: "mc", q: "I ___ dinner when the phone rang.", o: ["cooked", "was cooking", "had cooked"], a: 1, x: "Action in progress → past continuous." },
        { t: "fill", q: "She ___ never flown before, so she was nervous.", a: ["had"], x: "Past perfect: had + flown." },
        { t: "fill", q: "We waited for hours and ___ the bus came.", a: ["eventually", "finally"], x: "eventually = in the end." },
        { t: "mc", q: "The man at the door turned ___ to be my old teacher.", o: ["up", "out", "over"], a: 1, x: "turn out = prove to be." },
        { t: "order", a: ["I", "was", "walking", "home", "when", "it", "started", "to", "rain"], p: ".", x: "Background (continuous) + interruption (simple)." },
        { t: "listen", audio: "I'd just got into the shower when the doorbell rang, and of course it was the delivery I'd been waiting for all day.", q: "What was the speaker doing when the doorbell rang?", o: ["Waiting by the door", "Taking a shower", "Making a delivery", "Sleeping"], a: 1, x: "'I'd just got into the shower when the doorbell rang'." }
      ],
      speaking: ["By the time I arrived, everyone had left.", "I was walking home when it started to rain.", "It turned out to be a great day."]
    },
    {
      id: "c1-3", level: 5, title: "If only…", topic: "Regrets & hypotheticals",
      focus: ["grammar", "vocabulary"],
      objectives: ["Talk about unreal situations", "Use 'it's time', 'would rather' and 'as if'", "Express regret precisely"],
      grammar: {
        title: "Unreal past: it's time, would rather, as if, if only",
        html: `<p>After these phrases, a <b>past form</b> talks about the present or future in an unreal way:</p>
<ul><li><b>It's (high) time</b> + past: <i>It's high time we <b>left</b>.</i></li>
<li><b>would rather</b> + someone + past: <i>I'd rather you <b>didn't</b> tell anyone.</i></li>
<li><b>as if / as though</b> + past: <i>He talks as if he <b>owned</b> the place.</i></li>
<li><b>If only</b> + past: <i>If only I <b>had</b> more time.</i></li></ul>
<p>Use the <b>past perfect</b> for regrets about the past: <i>If only I <b>had listened</b>. I'd rather you <b>hadn't said</b> that.</i></p>`,
        examples: ["It's about time you got a proper job.", "I'd rather we met tomorrow, if that's OK.", "If only I hadn't sent that email."]
      },
      vocab: [
        ["hindsight", "understanding a situation only after it has happened", "In hindsight, we should have waited."],
        ["rash", "done too quickly without thinking", "It was a rash decision."],
        ["dwell on", "keep thinking about something negative", "Try not to dwell on your mistakes."],
        ["remorse", "a strong feeling of regret", "He showed no remorse."],
        ["wistful", "sadly thinking about something you can't have", "She gave a wistful smile."],
        ["in retrospect", "looking back on a past event", "In retrospect, it was the right choice."]
      ],
      reading: {
        title: "The road not taken",
        text: "In hindsight, turning down the job in Singapore was a rash decision. At the time I'd rather my family hadn't had to move, and I spoke as though staying were the only sensible option. Now I sometimes catch myself dwelling on what might have been. If only I had given it more thought. Yet in retrospect the regret is less about the job than about the certainty with which I dismissed it. It's high time I stopped being so sure of myself."
      },
      ex: [
        { t: "mc", q: "Reading: What does the writer mainly regret?", o: ["Moving to Singapore", "How certain they were when they rejected the offer", "Their family's decision", "Taking the wrong job"], a: 1, x: "'the regret is less about the job than about the certainty …'" },
        { t: "mc", q: "It's high time the government ___ something about it.", o: ["does", "did", "has done", "will do"], a: 1, x: "It's high time + past simple." },
        { t: "mc", q: "I'd rather you ___ my phone without asking.", o: ["don't use", "didn't use", "not use", "won't use"], a: 1, x: "would rather + someone + past." },
        { t: "fill", q: "If only I ___ listened to your advice last year.", a: ["had"], x: "Regret about the past → past perfect." },
        { t: "fill", q: "He behaves as ___ he were the boss.", a: ["if", "though"], x: "as if / as though + past." },
        { t: "mc", q: "'Don't ___ on the past; focus on what you can change.'", o: ["dwell", "linger", "stay", "remain"], a: 0, x: "dwell on = keep thinking about." },
        { t: "order", a: ["It's", "high", "time", "we", "made", "a", "decision"], p: ".", x: "It's high time + subject + past." },
        { t: "listen", audio: "I'd rather we didn't discuss the budget today, if it's all the same to you. The figures aren't final yet.", q: "What does the speaker want?", o: ["To discuss the budget now", "To postpone talking about the budget", "To change the figures", "To cancel the meeting"], a: 1, x: "'I'd rather we didn't discuss the budget today'." }
      ],
      speaking: ["It's high time we left.", "I'd rather you didn't mention it.", "If only I had known sooner."]
    },
    {
      id: "c2-3", level: 6, title: "Making a point", topic: "Emphasis & style",
      focus: ["grammar", "reading"],
      objectives: ["Add emphasis with auxiliary 'do'", "Use fronting for effect", "Choose a register for formal writing"],
      grammar: {
        title: "Emphatic structures & fronting",
        html: `<ul><li><b>Emphatic do</b>: stress truth or contrast. <i>I <b>did</b> warn you. She <b>does</b> know what she's talking about.</i></li>
<li><b>Fronting</b>: move a phrase to the start for effect. <i><b>Strange</b> though it may seem, … · <b>Try</b> as they might, they couldn't open it. · <b>Much as</b> I admire her, I disagree.</i></li>
<li><b>Intensifying negatives</b>: <i>not in the least, by no means, not for a moment</i>.</li>
<li><b>Such … that / so … that</b> with inversion (formal): <i><b>Such was</b> the demand <b>that</b> tickets sold out in minutes.</i></li></ul>`,
        examples: ["I did tell you the deadline was Friday.", "Try as she might, she couldn't remember his name.", "Such was the noise that nobody could sleep."]
      },
      vocab: [
        ["salient", "most noticeable or important", "The salient point is the cost."],
        ["understated", "subtle, not exaggerated", "Her humour is quietly understated."],
        ["emphatic", "expressed forcefully and clearly", "His answer was an emphatic no."],
        ["belabour", "explain something more than necessary", "I won't belabour the point."],
        ["cogent", "clear, logical and convincing", "She made a cogent case for reform."],
        ["by no means", "not at all", "This is by no means a simple problem."]
      ],
      reading: {
        title: "On saying less",
        text: "Much as we admire eloquence, it is by no means the same as clarity. Strange though it may seem, the most cogent arguments are often the most understated: they identify the salient point and decline to belabour it. Such is our appetite for emphasis that we mistake volume for conviction. Writers do, of course, need emphasis; the craft lies in reserving it for the moments that genuinely warrant it."
      },
      ex: [
        { t: "mc", q: "Reading: What is the writer's main argument?", o: ["Eloquence and clarity are identical", "Strong arguments are often quiet and selective in their emphasis", "Writers should never use emphasis", "Loud arguments are the most convincing"], a: 1, x: "'the most cogent arguments are often the most understated'." },
        { t: "mc", q: "I ___ remind you about the meeting, so don't blame me.", o: ["did", "do", "had", "was"], a: 0, x: "Emphatic did + base verb." },
        { t: "mc", q: "___ as they might, they couldn't persuade him.", o: ["Tried", "Try", "Trying", "To try"], a: 1, x: "Fronted 'Try as they might'." },
        { t: "fill", q: "___ was the demand that the shop ran out within an hour.", a: ["such"], x: "Such was + noun + that …" },
        { t: "fill", q: "Strange ___ it may seem, I enjoyed the exam.", a: ["though", "as"], x: "Adjective + though/as + clause." },
        { t: "mc", q: "'I won't ___ the point' means:", o: ["I won't explain it at excessive length", "I won't admit it", "I won't forget it", "I won't argue against it"], a: 0, x: "belabour = over-explain." },
        { t: "order", a: ["Much", "as", "I", "admire", "her", "I", "disagree"], p: ".", x: "Much as + clause, main clause." },
        { t: "listen", audio: "I do take your point, and I by no means dismiss it, but such is the urgency that we simply can't wait for another review.", q: "What is the speaker's position?", o: ["They reject the point entirely", "They accept the point but still want to act now", "They want another review", "They think there is no urgency"], a: 1, x: "Acknowledges the point, but 'we simply can't wait'." }
      ],
      speaking: ["I did tell you.", "Try as I might, I couldn't do it.", "Such was the noise that nobody slept."]
    }
  );

  /* Writing tasks: prompt, minimum words, a grammar check (regex + label) and a model answer. */
  D.WRITING = {
    "a1-1": { prompt: "Write about yourself: your name, age, where you are from and your job or studies.", min: 30, check: ["\\b(am|is|are|i'm)\\b", "uses 'am / is / are'"], model: "Hello! My name is Lina. I am 24 years old and I am from Madrid in Spain. I am a nurse. My hospital is big and my colleagues are friendly. I am happy to meet you!" },
    "a1-2": { prompt: "Describe your normal weekday from morning to night.", min: 35, check: ["\\b\\w+s\\b|\\b(get|go|have|work|eat|start|finish)\\b", "uses the present simple"], model: "I usually get up at seven o'clock. I have coffee and toast for breakfast. I go to work by bus. I start work at nine and I finish at five. In the evening I cook dinner and watch TV. I go to bed at eleven." },
    "a1-3": { prompt: "Write a shopping list for a party and say where you buy each thing and how much it costs.", min: 30, check: ["\\b(there is|there are|some|any)\\b", "uses 'there is/are' or 'some/any'"], model: "For the party I need some bread, some cheese and some juice. There is a good bakery near my house, and the bread is cheap: one pound. There aren't any big shops in my street, so I buy the juice at the supermarket. It is three pounds." },
    "a2-1": { prompt: "Write an email to a friend about what you did last weekend.", min: 50, check: ["\\b(went|was|were|did|had|saw|visited|played|watched)\\b", "uses the past simple"], model: "Hi Tom, I had a great weekend! On Saturday I went to the beach with my sister. The weather was sunny and we swam in the sea. In the evening we had dinner at a fish restaurant. On Sunday we went on a short trip to visit the old museum in town, and the cakes in the café were delicious. What did you do?" },
    "a2-2": { prompt: "You are planning a holiday. Compare two places and say which one you are going to choose and why.", min: 50, check: ["\\b(going to|\\w+er than|more \\w+ than)\\b", "uses 'going to' or a comparative"], model: "I'm going to take a holiday in July. Rome is more interesting than Nice because it has a lot of history, but Nice is cheaper and the beaches are better. Rome is also hotter in summer. In the end, I'm going to choose Nice, because I want to relax by the sea." },
    "a2-3": { prompt: "A friend wants to be healthier. Write them some advice and tell them about any rules at your gym or sports club.", min: 50, check: ["\\b(should|must|have to|don't have to|mustn't)\\b", "uses should / must / have to"], model: "You should walk more and you shouldn't eat so much fast food. You don't have to go to the gym every day; three times a week is fine. At my gym you have to bring a towel and you mustn't use your phone in the changing rooms. You should come with me next week!" },
    "b1-1": { prompt: "Write about the most interesting experience you have had. Say what happened and how you feel about it now.", min: 70, check: ["\\b(have|has|i've|we've|she's|he's) (\\w+ )?(been|done|seen|had|visited|tried|met|lived|worked)\\b", "uses the present perfect"], model: "I've travelled quite a lot, but the most interesting experience I've ever had was a week on a small farm in Ireland. I went there in 2019 to help with the animals. I had never milked a cow before, and on the first day I was terrible at it! By the end of the week I had made good friends. I've visited them twice since then, and I've learned that hard physical work can be very relaxing." },
    "b1-2": { prompt: "What would you do if you won a lot of money? And what will you do if you pass your English exam?", min: 70, check: ["\\bif\\b[^.]*\\b(will|would|'ll|'d)\\b", "uses a conditional"], model: "If I won a lot of money, I would buy a small house near the sea and I would give some money to my parents. I wouldn't stop working, because I enjoy my job, but I would travel more. On a more realistic note, if I pass my English exam this summer, I will apply for a job with an international company. If they offer me an interview, I'll probably be nervous, but unless I try, I'll never know. I promise I'll tell you how it goes!" },
    "b1-3": { prompt: "Describe how a product from your country is made or produced, step by step.", min: 65, check: ["\\b(is|are|was|were) \\w+(ed|en|wn|ght|ade|un)\\b", "uses the passive"], model: "Olive oil is produced in many parts of my country. First, the olives are picked by hand or with machines in late autumn. Then they are washed and taken to a mill, where they are crushed into a paste. The oil is separated from the water and the paste, and it is stored in large metal tanks. Finally, it is put into bottles and exported all over the world." },
    "b2-1": { prompt: "Write about a decision you regret, or one you are glad you made. What would have happened if you had chosen differently?", min: 85, check: ["\\b(would have|wish|if only|had \\w+(ed|en|wn|ght))\\b", "uses the third conditional or 'wish'"], model: "Five years ago I was offered a place on a degree course in law, but I chose to study design instead. My parents were disappointed, and for a while I wished I had listened to them. If I had studied law, I would probably have a more stable income today. However, I wouldn't have met my business partner, and we wouldn't have started the studio that I'm now so proud of. In hindsight, turning down that opportunity was the right trade-off, and I'm glad I followed my instinct, although I do sometimes wish I had planned my finances more carefully." },
    "b2-2": { prompt: "Report a conversation or interview you had recently. Who said what, and what did they ask you?", min: 85, check: ["\\b(said|told|asked|explained|suggested|admitted|promised|warned|denied|insisted)\\b", "uses reporting verbs"], model: "Last week I had a job interview at a marketing agency. The manager asked me why I wanted to leave my current job, and I explained that I was looking for more creative responsibility. She wanted to know whether I had managed a team before. I admitted that I hadn't, but I insisted that I was a fast learner. At the end she told me they would contact me within a week, and she suggested that I prepare a short portfolio in case I was invited back." },
    "b2-3": { prompt: "Tell the story of a day when something went wrong (or surprisingly right). Use a mix of past tenses.", min: 85, check: ["\\b(was|were) \\w+ing\\b|\\bhad (\\w+ )?\\w+(ed|en|wn|ght|ft)\\b", "uses past continuous or past perfect"], model: "It was a cold Monday morning and I was rushing to an important meeting. I had prepared my presentation the night before and had saved it on a memory stick. As I was getting off the train, I realised that the stick wasn't in my pocket. By the time I reached the office, I had already imagined the worst. Luckily, it turned out that I had emailed the file to myself as a backup. The meeting went perfectly, and nobody ever knew how close I had come to disaster." },
    "c1-1": { prompt: "Describe something that genuinely surprised you. Use inversion or a cleft sentence for emphasis at least twice.", min: 100, check: ["\\b(never|rarely|seldom|hardly|no sooner|not only|little|only when|only after)\\b[^.]*\\b(had|have|did|do|does|was|were|is|could|would)\\b|\\b(what|it was|it is)\\b[^.]*\\b(was|is) (that|the)\\b", "uses inversion or a cleft sentence"], model: "Never had I expected a weekend in a small mountain village to change how I think about work. What struck me first was the silence: not a car, not a notification, nothing. Not only did the villagers seem unhurried, but they also appeared to accomplish a remarkable amount. It was the baker, a man in his seventies, who explained it best. He told me that the secret wasn't working less, but refusing to do two things at once. Only after I returned home did I realise how rarely I give anything my full attention. The experience had a profound effect on me; nevertheless, it is that simple realisation which has stayed with me most." },
    "c1-2": { prompt: "Give a balanced, cautious opinion on whether social media does more harm than good. Hedge your claims.", min: 100, check: ["\\b(arguably|seems|appears|tend to|likely|may|might|could|to some extent|it would seem|suggests)\\b", "uses hedging language"], model: "It would seem that few questions divide opinion as sharply as this one. Social media has arguably given a voice to people who were previously unheard, and it appears to have made it easier for communities to organise. That said, there is growing evidence to suggest that heavy use may be linked to anxiety, particularly among teenagers, although the causal relationship remains unclear. To some extent, the harm seems to depend less on the platforms themselves than on how they are designed and used. On balance, I would tentatively argue that the technology is not inherently harmful, but that it is likely to remain so unless regulation catches up." },
    "c1-3": { prompt: "Write about a regret, real or imagined, and what you would rather had happened. Use 'if only', 'would rather' or 'it's time'.", min: 100, check: ["\\b(if only|would rather|'d rather|it's (high |about )?time|as if|as though)\\b", "uses unreal past structures"], model: "In hindsight, the biggest mistake of my twenties was not learning a musical instrument properly. My parents paid for piano lessons, but I treated them as though they were a punishment, and I'd rather they had insisted a little more. If only I had practised for twenty minutes a day, I would now be able to play for pleasure instead of envying friends who can. I try not to dwell on it, though. In retrospect, the regret is useful: it has taught me that consistency matters more than talent. It's high time I stopped making excuses and booked a lesson." },
    "c2-1": { prompt: "Write a short formal recommendation to a board of directors proposing one change to the organisation.", min: 100, check: ["\\b(recommend|propose|suggest|essential|imperative|vital|insist)\\b[^.]*\\bthat\\b", "uses the subjunctive after recommend/propose"], model: "Following a review of our recruitment process, I would recommend that the board adopt a policy of anonymised applications for all graduate roles. It is essential that candidates be assessed on the basis of skills and potential rather than background, and the current process falls short in this respect. Should the board approve the proposal, a six-month pilot could begin in the next quarter, with results reported in time for the annual review. Notwithstanding the modest administrative cost, I am confident that the long-term benefits, namely a broader talent pool and a stronger reputation as an employer, would far outweigh it, and the pilot would help mitigate any risks. The case for change is, I believe, cogent. I therefore propose that a working group be established to oversee implementation." },
    "c2-2": { prompt: "Write a short persuasive speech on a cause you care about. Use at least two rhetorical devices (tricolon, antithesis, rhetorical question, litotes).", min: 100, check: ["\\?|\\bnot\\b[^.]*\\bbut\\b|,[^,.]+,[^,.]+\\band\\b", "uses a rhetorical device"], model: "Friends, we are told that libraries are a luxury we can no longer afford. I say they are a necessity we cannot afford to lose. Where else can a child discover a new world, a pensioner find company and a job-seeker get online, all without spending a penny? Some call it frugal; I call it stingy. And let us not toe the line of those who call this a moot point. Closing them would be no small loss; it would be the quiet abandonment of an idea, the idea that knowledge belongs to everyone. The question is not whether we can afford to keep them open, but whether we can afford to let them close. Let us fund them, defend them and, above all, use them." },
    "c2-3": { prompt: "Write an opinion piece arguing that less is more in some area of life. Use emphatic do, fronting or 'such … that'.", min: 100, check: ["\\b(do|does|did) (\\w+ )?(know|need|want|matter|believe|think|help|make|warn|tell|say|admire|have)\\b|\\b(such was|such is|much as|though it|as it may|try as)\\b", "uses emphatic structures"], model: "Much as I love a well-stocked kitchen, I have come to believe that the best cooking is done with very little. Strange though it may seem, and by no means is this an emphatic rejection of technology, a single good knife does more for a meal than a drawer full of gadgets. Such is the marketing around kitchen equipment that we assume skill can be bought; it cannot. I do understand the appeal of new tools, and I by no means suggest that we throw everything away. But the salient point is this: fewer ingredients, chosen carefully and treated with respect, will almost always taste better. Try as we might to complicate it, good food remains stubbornly simple." }
  };

  /* Speaking prompts for the new units */
  D.SPEAKING_PROMPTS = {
    "a1-3": "Describe the shops near your home and what you buy there.",
    "a2-3": "Give advice to someone who wants to sleep better.",
    "b1-3": "Explain how a food or product from your country is made.",
    "b2-3": "Tell a funny or embarrassing story from your past.",
    "c1-3": "Talk about a decision you would make differently now.",
    "c2-3": "Argue that simplicity is underrated, using emphatic structures."
  };
})();
