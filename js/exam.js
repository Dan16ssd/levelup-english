/* LevelUp English — exam practice in the style of IELTS and TOEIC.
   Original practice material written for this site; it is not official test content.
   Every task returns exercise objects for the app's exercise player. */
window.LU_EXAM = (function () {
  "use strict";
  const { pick, sample, shuffle, person, twoPeople, CITIES, DAYS, MONTHS } = window.LU_GEN.helpers;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  /* multiple choice with shuffled options */
  function mc(q, correct, wrong, extra) {
    const o = shuffle([correct].concat(wrong.filter((w) => w !== correct).slice(0, 3)));
    return Object.assign({ t: "mc", q, o, a: o.indexOf(correct) }, extra || {});
  }
  /* a group of questions that share one recording or text */
  function group(list, stim) {
    return list.map((ex, i) => Object.assign(ex, i === 0 ? stim : { sameAsAbove: stim.audio ? "recording" : "text" }));
  }
  const listenEx = (ex) => Object.assign(ex, { t: ex.t === "fill" ? "fill" : "listen" });

  const TIMES = [["nine o'clock", "9:00"], ["half past nine", "9:30"], ["ten fifteen", "10:15"], ["eleven o'clock", "11:00"], ["two thirty", "2:30"], ["three o'clock", "3:00"], ["quarter past four", "4:15"]];
  const DOCS = ["report", "invoice", "contract", "schedule", "agenda", "budget"];
  const EVENTS = ["training session", "workshop", "sales meeting", "presentation", "product launch"];
  const DEPTS = ["marketing", "finance", "sales", "IT", "human resources"];
  const FLOORS = ["second", "third", "fourth", "fifth"];
  const SURNAMES = [["Patel", "P, A, T, E, L"], ["Moreno", "M, O, R, E, N, O"], ["Clarke", "C, L, A, R, K, E"], ["Novak", "N, O, V, A, K"], ["Becker", "B, E, C, K, E, R"], ["Hughes", "H, U, G, H, E, S"], ["Tanaka", "T, A, N, A, K, A"], ["Okafor", "O, K, A, F, O, R"]];
  const STREETS = ["Hill Road", "Park Street", "Mill Lane", "River Road", "Station Avenue", "Church Street"];

  /* =========================================================
     TOEIC-STYLE
     ========================================================= */

  /* Part 2: question–response. You hear a question and choose the best reply. */
  function toeicP2() {
    const p = person(), [t] = sample(TIMES, 1), doc = pick(DOCS), ev = pick(EVENTS), city = pick(CITIES);
    const items = [
      [`When does the ${ev} start?`, `At ${t[1]}, I think.`, ["In the main hall.", "Yes, it started well."]],
      [`Where should I put these ${pick(["files", "boxes", "brochures", "samples"])}?`, "On the shelf by the door.", ["Yesterday afternoon.", "I'll put on my coat."]],
      [`Who's in charge of the ${pick(["website", "budget", "recruitment", "trade fair"])} project?`, `${p.n} from ${pick(DEPTS)}.`, ["There's no charge for delivery.", "At the end of the month."]],
      ["Why was the flight delayed?", "Because of the bad weather.", ["I'd like a window seat, please.", `It's flying to ${city}.`]],
      [`Would you like me to send you the ${doc}?`, "Yes, that would be helpful.", ["I like it very much.", `It was sent from ${city}.`]],
      [`Haven't you finished the ${doc} yet?`, "I'm working on it now.", ["Yes, it's a fine day.", "The finish line is over there."]],
      ["How much does the new printer cost?", `About ${rnd(2, 9)}00 dollars.`, ["Three times a week.", "It prints in colour."]],
      ["Shall we take a taxi or the train?", "The train is quicker at this time of day.", ["Yes, we shall.", "I trained for a marathon last year."]],
      [`Isn't ${p.n} coming to the meeting?`, `No, ${p.he}'s on holiday this week.`, ["The meeting room is upstairs.", `Yes, ${p.he} met ${p.him} there.`]],
      ["How long will the repairs take?", "About two days.", ["It's two metres long.", "The repair shop is on Park Street."]],
      ["Could you help me carry these boxes?", "Sure, where do they go?", ["The box office is closed.", "I helped him yesterday."]],
      ["Which printer is working?", "The one by the window.", ["He's working late tonight.", "Print it in colour."]],
      [`Where can I find the ${doc}?`, "It's in the top drawer of my desk.", ["I found it very interesting.", "Next Tuesday."]],
      [`Why don't we meet on ${pick(DAYS.slice(0, 5))} instead?`, "Good idea, that works for me.", ["Because it was raining.", "We met last week."]],
      ["Who should I give this application form to?", "Leave it with the receptionist.", ["I applied last year.", "Yes, give it a try."]],
      ["When will the new manager start?", "At the beginning of next month.", ["From the head office.", "She manages the sales team."]],
      ["Do you know where the nearest bank is?", "There's one just around the corner.", ["Yes, I banked on it.", "It opens at nine."]],
      [`Has the ${ev} been cancelled?`, "No, just moved to next week.", ["It was very well organised.", `In ${city}, I believe.`]]
    ];
    const [q, c, w] = pick(items);
    return listenEx(mc("Choose the best response to the question you hear.", c, w, { audio: q, x: "In this part, look out for answers that repeat a word from the question or answer the wrong type of question (e.g. 'Yes' to a 'when' question).", label: "Question and response" }));
  }

  /* Part 3: short conversations, two questions each */
  function toeicP3() {
    const [a, b] = twoPeople(), d = pick(DAYS.slice(0, 5)), floor = pick(FLOORS), doc = pick(DOCS), n = pick([20, 30, 40, 50]), city = pick(CITIES);
    const T = [
      () => ({
        audio: `${a.n}: Hi ${b.n}. The printer has run out of paper again. Did you order more?\n${b.n}: I did, but the supplier says the delivery won't arrive until ${d}.\n${a.n}: That's a problem. I need to print ${n} copies of the ${doc} for tomorrow's meeting.\n${b.n}: You could use the printer on the ${floor} floor. Nobody uses it in the afternoon.`,
        qs: [["What is the problem?", "The printer has no paper.", ["The printer is broken.", "The meeting was cancelled.", `The ${doc} is missing.`]],
             [`What does ${b.n} suggest?`, `Using a printer on the ${floor} floor`, ["Cancelling the meeting", `Waiting until ${d}`, "Ordering from a different supplier"]]]
      }),
      () => ({
        audio: `${a.n}: ${b.n}, the client from ${city} just called. They can't make our meeting on ${d}.\n${b.n}: Oh no. Did they suggest another day?\n${a.n}: They asked if we could do a video call instead, at the same time.\n${b.n}: That's fine with me. I'll send them a link this afternoon.`,
        qs: [["Why did the client call?", "To say they can't attend the meeting", ["To place a new order", "To complain about a product", "To ask for a discount"]],
             [`What will ${b.n} do this afternoon?`, "Send a link for a video call", [`Travel to ${city}`, "Book a meeting room", "Call the client back"]]]
      }),
      () => ({
        audio: `${a.n}: Good morning, I'd like to book a room for the ${pick(EVENTS)} on ${d}. There'll be about ${n} people.\n${b.n}: Let me check. Our largest room only holds ${n - 5}, I'm afraid.\n${a.n}: Hmm. Is there anything else available?\n${b.n}: We could open the doors between rooms A and B. That would give you space for up to ${n + 20}.`,
        qs: [[`What is ${a.n}'s problem?`, "The largest room is too small.", ["The rooms are all booked.", `The event is not on ${d}.`, "The price is too high."]],
             [`What does ${b.n} offer to do?`, "Combine two rooms", ["Change the date", "Lower the price", "Find another hotel"]]]
      }),
      () => ({
        audio: `${a.n}: Have you heard? ${pick(["Maria", "Kenji", "Sofia", "Daniel"])} is leaving the company at the end of the month.\n${b.n}: Really? I thought she was happy in the ${pick(DEPTS)} team.\n${a.n}: She is, but she's moving to ${city} to be closer to her family.\n${b.n}: We should organise a leaving lunch for her. I'll ask everyone which day suits them.`,
        qs: [["Why is the colleague leaving?", "She is moving to be near her family.", ["She is unhappy with her team.", "She found a better-paid job.", "She is retiring."]],
             [`What will ${b.n} do next?`, "Find a date for a lunch", [`Book a flight to ${city}`, "Write a job advert", "Speak to the manager"]]]
      }),
      () => ({
        audio: `${a.n}: IT support, how can I help?\n${b.n}: Hi, I can't log in to the sales system. It keeps saying my password has expired.\n${a.n}: That happens every ninety days. I'll send you a reset link by email; it's valid for ${pick([10, 15, 30])} minutes.\n${b.n}: Great, thanks. I'll check my inbox now.`,
        qs: [[`Why is ${b.n} calling?`, "They can't log in to a system.", ["Their computer won't turn on.", "They need a new email address.", "The sales figures are wrong."]],
             ["What will the IT worker send?", "A password reset link", ["A new computer", "A user manual", "An invoice"]]]
      }),
      () => ({
        audio: `${a.n}: Our train to ${city} has been delayed by an hour.\n${b.n}: Then we'll miss the start of the presentation. Should we call the organisers?\n${a.n}: Yes, let's. And maybe they can swap our slot with someone in the afternoon.\n${b.n}: Good idea. I'll call them while you get us some coffee.`,
        qs: [["What problem do the speakers have?", "Their train is late.", ["Their tickets are wrong.", "The presentation was cancelled.", "They have lost their notes."]],
             [`What will ${b.n} do?`, "Phone the organisers", ["Buy coffee", "Take a taxi", "Rewrite the presentation"]]]
      }),
      () => ({
        audio: `${a.n}: The new budget figures are in. We spent ${pick([10, 15, 20])} percent more on travel than we planned.\n${b.n}: That's mostly the trade fair in ${city}. Flights were very expensive this year.\n${a.n}: Next year we should book much earlier.\n${b.n}: Agreed. And for smaller meetings, video calls would save a lot.`,
        qs: [["What are the speakers discussing?", "Travel costs", ["A new product", "Staff salaries", "Office rent"]],
             [`What does ${a.n} suggest for next year?`, "Booking travel earlier", ["Cancelling the trade fair", "Hiring more staff", "Moving to a new office"]]]
      })
    ];
    const t = pick(T)();
    const exs = t.qs.map(([q, c, w]) => listenEx(mc(q, c, w, { label: "Conversation" })));
    exs[exs.length - 1].x = "";
    return group(exs, { audio: t.audio });
  }

  /* Part 5: incomplete sentences (grammar and business vocabulary) */
  function toeicP5() {
    const p = person(), city = pick(CITIES), dept = pick(DEPTS);
    const items = [
      [`Ms. ${p.n} spoke very ___ about the new product.`, "confidently", ["confident", "confidence", "confide"], "An adverb describes the verb 'spoke'."],
      [`The ${dept} department is responsible ___ approving all expenses.`, "for", ["of", "to", "at"], "responsible for + -ing."],
      ["Please submit your report ___ Friday at the latest.", "by", ["until", "since", "during"], "'by' = no later than a deadline."],
      ["All visitors must ___ their badges at all times.", "wear", ["wearing", "to wear", "worn"], "must + base verb."],
      ["The new software has made our work much more ___.", "efficient", ["efficiently", "efficiency", "efficiencies"], "make + object + adjective."],
      ["Neither the manager ___ her assistant was available.", "nor", ["or", "and", "but"], "neither … nor."],
      ["If the shipment ___ late, we will contact the customer.", "arrives", ["will arrive", "arrived", "arriving"], "First conditional: if + present simple."],
      ["The meeting ___ until next week because the director is ill.", "has been postponed", ["has postponed", "postponing", "postpones"], "The meeting doesn't postpone itself: passive."],
      ["___ the bad weather, the event was a great success.", "Despite", ["Although", "Because", "However"], "Despite + noun; although + clause."],
      [`We are pleased to announce the ___ of our new office in ${city}.`, "opening", ["open", "opened", "opens"], "the + noun + of."],
      [`${p.n} asked me to forward the email to ___.`, p.him, [p.he, p.his, p.him + "self"], "Object pronoun after a preposition."],
      ["Customers who register online will receive a ___ discount.", "substantial", ["substantially", "substance", "substantiate"], "An adjective before the noun 'discount'."],
      ["The training was ___ useful that we've booked another session.", "so", ["such", "too", "very"], "so + adjective + that."],
      ["___ you have any questions, please contact our office.", "Should", ["Would", "Could", "Must"], "Should you … = if you (formal)."],
      ["The proposal must be ___ to the board before the end of the quarter.", "submitted", ["submit", "submitting", "submission"], "must be + past participle (passive)."],
      ["Our sales have increased ___ over the past year.", "steadily", ["steady", "steadiness", "steadied"], "An adverb describes 'increased'."],
      ["Mr. Lee has worked here ___ 2015.", "since", ["for", "from", "ago"], "since + a point in time."],
      ["The hotel is conveniently located ___ walking distance of the station.", "within", ["among", "between", "along"], "within walking distance."],
      ["Employees are reminded ___ their timesheets by Monday.", "to submit", ["submitting", "submit", "submitted"], "remind someone to do something."],
      ["The company plans to ___ its operations into Asia next year.", "expand", ["extend", "enlarge", "increase"], "expand operations/business into a new market."],
      ["Thank you for your ___ in our products.", "interest", ["interesting", "interested", "interests"], "your + noun."],
      ["The figures are ___ than we expected.", "higher", ["highest", "high", "more high"], "Comparative + than."],
      ["Ms. Tan, ___ team won the award, will give a short speech.", "whose", ["who", "which", "whom"], "whose = possession (her team)."],
      ["Applicants must have at least three years of ___ experience.", "relevant", ["relevance", "relevantly", "relevancy"], "An adjective before 'experience'."]
    ];
    const [q, c, w, x] = pick(items);
    return mc(q, c, w, { x, label: "Incomplete sentence" });
  }

  /* Part 7: reading emails, notices and adverts (three questions each) */
  function toeicP7() {
    const [a, b] = twoPeople(), d = pick(DAYS.slice(0, 5)), m = pick(MONTHS), day = rnd(3, 27), city = pick(CITIES), floor = pick(FLOORS);
    const T = [
      () => ({
        text: `To: All staff\nFrom: ${a.n}, Facilities\nSubject: Office move\n\nAs you know, the ${pick(DEPTS)} team will move to the ${floor} floor on ${m} ${day}. Please pack your personal items in the boxes provided and label them with your name before you leave on the previous evening. The removal company will move all furniture and computers. Desks will be ready by 10 a.m., so there is no need to arrive early. If you have any questions, please contact me on extension ${rnd(200, 499)}.`,
        qs: [["What is the purpose of the email?", "To give instructions about an office move", ["To announce a new manager", "To ask staff to buy boxes", "To invite staff to a meeting"]],
             ["What should staff do before the move?", "Pack and label their personal items", ["Move their own computers", "Arrive early on the day", "Order new furniture"]],
             ["What is suggested about the move?", "Staff can arrive at their normal time.", ["It will take several days.", `It is to a new building in ${city}.`, "Staff must pay for the boxes."]]]
      }),
      () => ({
        text: `NOTICE: System maintenance\n\nThe online booking system will be unavailable from 10 p.m. on ${d} until 6 a.m. the following morning while we install an upgrade. During this time, customers can still make bookings by phone. Bookings made before the maintenance period will not be affected. After the upgrade, customers will be able to choose their seats and pay in more currencies. We apologise for any inconvenience.`,
        qs: [["What is the notice mainly about?", "A temporary interruption to a service", ["A change in prices", "A new phone number", "The closure of a company"]],
             ["How can customers book during the maintenance?", "By telephone", ["Online", "In person only", "They cannot book."]],
             ["What will be new after the upgrade?", "Seat selection", ["Lower prices", "A mobile app", "Free cancellations"]]]
      }),
      () => ({
        text: `JOB OPPORTUNITY: Customer Service Supervisor (${city})\n\nWe are looking for an experienced supervisor to lead a team of ${rnd(8, 15)} customer service advisers. The successful candidate will have at least two years of supervisory experience and excellent communication skills. Knowledge of a second language is an advantage but not essential. The position is full-time, with some weekend work. To apply, send your CV and a cover letter to ${b.n.toLowerCase()}@example.com by ${m} ${day}.`,
        qs: [["What is required for the job?", "Experience as a supervisor", ["A second language", "A university degree", "Experience in sales"]],
             ["What is mentioned about the working hours?", "They include some weekends.", ["They are part-time.", "They are flexible.", "They are only at night."]],
             ["How should people apply?", "By email", ["By phone", "In person", "Through a website form"]]]
      }),
      () => ({
        text: `MEMO\nTo: Sales team\nFrom: ${a.n}, Finance\nRe: New expenses policy\n\nFrom ${m} 1, all expense claims must be submitted through the new online form within 30 days of the purchase. Paper receipts will no longer be accepted; instead, please upload a photo of each receipt. Claims for taxis will only be approved when public transport is not available. Hotel costs must not exceed ${rnd(12, 20)}0 dollars per night unless your manager approves it in advance.`,
        qs: [["What change is introduced?", "Expense claims must be made online.", ["Staff can no longer travel.", "Hotels will be booked by Finance.", "Taxis are no longer allowed."]],
             ["What should staff do with receipts?", "Upload a photo of them", ["Post them to Finance", "Keep them for a year", "Give them to their manager"]],
             ["When can a hotel cost more than the limit?", "When a manager agrees beforehand", ["When the trip is abroad", "When there is no public transport", "Never"]]]
      })
    ];
    const t = pick(T)();
    const exs = t.qs.map(([q, c, w]) => mc(q, c, w, { label: "Reading" }));
    return group(exs, { passage: t.text });
  }

  /* =========================================================
     IELTS-STYLE
     ========================================================= */

  /* Listening part 1: form completion (write the answer) */
  function ieltsFormFill() {
    const [sur, spelled] = pick(SURNAMES), first = person(), num = rnd(12, 98), street = pick(STREETS), m = pick(MONTHS), day = rnd(2, 28);
    const kind = pick([["the swimming club", "membership", ["Gold", "Silver"]], ["the language school", "evening course", ["Spanish", "Italian"]], ["the city library", "library card", ["Standard", "Student"]]]);
    const choice = pick(kind[2]);
    const audio = `Receptionist: Good morning, ${kind[0]}. How can I help?\nCaller: Hello, I'd like to sign up for a ${kind[1]}, please.\nReceptionist: Of course. Can I take your surname?\nCaller: It's ${sur}. That's ${spelled}.\nReceptionist: Thank you. And your address?\nCaller: ${num} ${street}.\nReceptionist: Lovely. When would you like to start?\nCaller: On the ${day}${day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th"} of ${m}, if possible.\nReceptionist: That's fine. And which option would you like, ${kind[2][0]} or ${kind[2][1]}?\nCaller: ${choice}, please.`;
    const exs = [
      { t: "fill", q: "Surname: ___", a: [sur.toLowerCase()], x: "Names are spelled out letter by letter. Spelling must be correct." },
      { t: "fill", q: "Address: ___ " + street, a: [String(num)], x: "Write the house number." },
      { t: "fill", q: `Start date: ___ ${m}`, a: [String(day), `${day}th`, `${day}st`, `${day}nd`, `${day}rd`], x: "Dates can be written as a number." },
      { t: "fill", q: "Option chosen: ___", a: [choice.toLowerCase()], x: "" }
    ];
    exs.forEach((e) => { e.label = "Form completion"; });
    return group(exs, { audio });
  }

  /* Listening parts 2–3: discussions with multiple-choice questions */
  function ieltsDiscussion() {
    const [a, b] = twoPeople();
    const T = [
      () => ({
        audio: `${a.n}: So, for our presentation on city transport, should we focus on buses or bikes?\n${b.n}: I'd say bikes. There's much more recent research on bike lanes.\n${a.n}: True, but our tutor said she wanted local examples, and the council has only published data on buses.\n${b.n}: Fair point. Let's do buses, then, and mention bikes in the conclusion.`,
        qs: [["Why does the second speaker first prefer bikes?", "There is more recent research.", ["Bikes are cheaper.", "The tutor suggested it.", "It is easier to present."]],
             ["What do they finally decide?", "To focus on buses", ["To focus on bikes", "To change the topic", "To ask the tutor"]]]
      }),
      () => ({
        audio: `Guide: Welcome to the castle. Before we start, a few changes this season. The tower is closed for repairs, so the tour will finish in the gardens instead. The café has moved from the entrance to the old kitchen, which many visitors say is more atmospheric. And photography is now allowed everywhere except in the library, where the old books are sensitive to light.\nVisitor: Can we take photos in the gardens?\nGuide: Absolutely, please do.`,
        qs: [["Why is the tower closed?", "It is being repaired.", ["It is too dangerous for children.", "It is used for events.", "It is too crowded."]],
             ["Where are photos NOT allowed?", "In the library", ["In the gardens", "In the old kitchen", "In the tower"]]]
      }),
      () => ({
        audio: `${a.n}: How did your survey go?\n${b.n}: Better than I expected. I hoped for fifty replies and got almost eighty.\n${a.n}: Impressive. What made the difference?\n${b.n}: I think it was keeping it short. Only ten questions, and I promised it would take less than five minutes.\n${a.n}: I'll try that. Mine had thirty questions and hardly anyone finished it.`,
        qs: [["How many replies did the survey get?", "Almost eighty", ["Fifty", "Thirty", "Ten"]],
             ["What helped the survey succeed?", "It was short.", ["It offered a prize.", "It was sent by the tutor.", "It was on paper."]]]
      })
    ];
    const t = pick(T)();
    return group(t.qs.map(([q, c, w]) => listenEx(mc(q, c, w, { label: "Discussion" }))), { audio: t.audio });
  }

  /* Reading: original passages with True / False / Not given */
  const TFNG = ["True", "False", "Not given"];
  const PASSAGES = [
    {
      title: "Bees on the rooftops",
      text: "Over the past two decades, beekeeping has moved from the countryside onto the rooftops of major cities. In London alone, the number of registered hives more than doubled between 2008 and 2013. Supporters argue that cities offer bees a surprising variety of flowers, from parks and gardens to the plants on balconies, and that urban honey often has a more complex flavour than its rural equivalent.\n\nHowever, some ecologists have begun to question whether the trend is as positive as it appears. Honeybees are just one of hundreds of bee species, and most wild bees are solitary insects that do not live in hives. Where honeybee numbers rise quickly, wild bees may face more competition for the same limited supply of pollen and nectar. A study in Paris found that wild bee visits to flowers fell as the density of hives increased.\n\nAs a result, several conservation groups now recommend planting more flowers rather than adding more hives. Some companies that once installed hives on their office roofs as part of their environmental commitments have replaced them with wildflower meadows.",
      st: [
        ["The number of registered hives in London increased between 2008 and 2013.", 0],
        ["Urban honey is more expensive than rural honey.", 2],
        ["Most wild bee species live in hives.", 1],
        ["A study in Paris linked more hives with fewer wild bee visits to flowers.", 0],
        ["Conservation groups advise cities to ban beekeeping.", 1],
        ["Some companies have removed rooftop hives.", 0]
      ]
    },
    {
      title: "The four-day week",
      text: "In recent years, a number of companies around the world have experimented with a four-day working week, in which employees work around 80 percent of their usual hours for the same pay. The largest trial so far, in the United Kingdom in 2022, involved around 60 organisations and nearly 3,000 workers.\n\nAt the end of the six-month trial, the great majority of companies chose to continue with the shorter week. Employees reported lower levels of stress and better sleep, and the number of sick days fell. Perhaps more surprisingly for managers, revenue across the participating companies stayed broadly the same, suggesting that productivity per hour had risen.\n\nCritics point out that the companies taking part volunteered, and so were probably more suited to the change than an average business. Sectors such as healthcare and manufacturing, where work cannot easily be compressed, were also under-represented. Nonetheless, the results have encouraged governments in several countries to fund their own pilot schemes.",
      st: [
        ["Workers in the trial received less pay than before.", 1],
        ["The UK trial lasted six months.", 0],
        ["Most companies stopped the four-day week after the trial.", 1],
        ["Employees took fewer days off sick during the trial.", 0],
        ["All the companies in the trial were in the technology sector.", 2],
        ["Some governments are now paying for their own trials.", 0]
      ]
    },
    {
      title: "Why we sleep on it",
      text: "The advice to 'sleep on' a difficult decision may have a scientific basis. Researchers have long known that sleep helps the brain to store new memories, but more recent studies suggest that it also reorganises them, making connections that were not obvious while we were awake.\n\nIn one well-known experiment, volunteers were given a number puzzle that contained a hidden shortcut. Those who slept for eight hours before trying again were more than twice as likely to discover the shortcut as those who stayed awake for the same period. The researchers concluded that sleep had helped the participants to restructure what they had learned.\n\nNot all stages of sleep seem to be equally important. Deep sleep, which occurs mostly early in the night, appears to strengthen facts, while dream sleep, which is more common towards morning, may be linked to creative problem-solving. This may explain why cutting sleep short by getting up very early can affect creativity more than memory.",
      st: [
        ["Scientists have only recently discovered that sleep helps memory.", 1],
        ["In the experiment, sleeping volunteers found the shortcut more often.", 0],
        ["The volunteers were all university students.", 2],
        ["Deep sleep happens mainly in the early part of the night.", 0],
        ["Dream sleep is more common towards the morning.", 0],
        ["Getting up very early improves creativity.", 1]
      ]
    },
    {
      title: "Restoring coral reefs",
      text: "Coral reefs cover less than one percent of the ocean floor, yet they support around a quarter of all marine species. Rising sea temperatures have caused repeated 'bleaching' events, in which corals lose the tiny algae that give them colour and most of their food. If temperatures fall quickly, corals can recover; if not, they die.\n\nScientists are now testing several ways to help reefs recover. One common method involves growing small pieces of coral in underwater 'nurseries' and then attaching them to damaged reefs. Another approach focuses on breeding corals that can survive higher temperatures. Some projects even play recordings of healthy reefs underwater, after a study found that the sounds attracted young fish, which help keep reefs clean.\n\nMost scientists agree, however, that restoration can only buy time. Without significant cuts in greenhouse gas emissions, they warn, even the most successful projects will not be able to keep up with the scale of the damage.",
      st: [
        ["Coral reefs cover about a quarter of the ocean floor.", 1],
        ["Bleached corals always die.", 1],
        ["Coral nurseries are located on land.", 1],
        ["Recordings of healthy reefs attracted young fish in a study.", 0],
        ["Breeding heat-resistant corals is cheaper than using nurseries.", 2],
        ["Most scientists believe restoration alone is not enough.", 0]
      ]
    },
    {
      title: "The return of the bicycle",
      text: "When the first practical bicycles appeared in the 1880s, they were hailed as a revolution in personal transport. For the first time, ordinary working people could travel several kilometres to work or to visit relatives without a horse. The bicycle also played a role in social change; in many countries it gave women a new degree of independence, and it influenced clothing fashions.\n\nBy the middle of the twentieth century, however, the car had largely replaced the bicycle in wealthier nations, and many cities were redesigned around motor traffic. Cycling became mainly a leisure activity.\n\nSince the 1970s, a number of European cities, most famously Amsterdam and Copenhagen, have reversed this trend by building networks of protected cycle lanes. Today, more people in Copenhagen commute by bike than by car. Electric bicycles, which make longer and hillier journeys easier, are now spreading the idea to cities that were once considered unsuitable for cycling.",
      st: [
        ["The first practical bicycles appeared in the 1880s.", 0],
        ["Early bicycles were too expensive for working people.", 1],
        ["Bicycles influenced what women wore.", 0],
        ["Amsterdam built protected cycle lanes before Copenhagen.", 2],
        ["In Copenhagen, more people now cycle to work than drive.", 0],
        ["Electric bicycles are only suitable for flat cities.", 1]
      ]
    },
    {
      title: "Plants that store water",
      text: "In deserts, where rain may fall only a few times a year, plants have developed remarkable ways to survive. Cacti and other succulents store water in thick stems or leaves, which can swell after rain and shrink again during dry periods. A large saguaro cactus can hold more than a thousand litres of water.\n\nMany desert plants also reduce water loss through their leaves. Some have tiny leaves or none at all; in cacti, the leaves have evolved into spines, which also protect the plant from animals. Others open their pores only at night, when it is cooler and less water evaporates, and store carbon dioxide until the sun rises.\n\nRoots are just as important. Some desert shrubs send roots more than twenty metres down to reach underground water, while many cacti grow wide, shallow roots that can quickly absorb rain before it evaporates.",
      st: [
        ["Succulents store water in their stems or leaves.", 0],
        ["A saguaro cactus can hold over a thousand litres of water.", 0],
        ["Cactus spines are used mainly to collect water.", 1],
        ["Some desert plants open their pores at night.", 0],
        ["Desert shrubs grow faster than cacti.", 2],
        ["Many cacti have deep roots of more than twenty metres.", 1]
      ]
    }
  ];
  function ieltsReading(index) {
    const P = index != null ? PASSAGES[index % PASSAGES.length] : pick(PASSAGES);
    const exs = P.st.map(([s, k]) => {
      const o = TFNG.slice();
      return { t: "mc", q: s, o, a: k, label: "True / False / Not given", x: k === 2 ? "The text doesn't say this, so it's Not given." : "" };
    });
    return group(exs, { passage: `${P.title}\n\n${P.text}`, pre: "Do these statements agree with the text? Choose True, False or Not given." });
  }

  /* Writing task 2 prompts */
  const WRITING = [
    ["opinion", "Some people believe that university education should be free for everyone. To what extent do you agree or disagree?"],
    ["opinion", "Working from home is better for employees than working in an office. To what extent do you agree or disagree?"],
    ["opinion", "Children should not be allowed to use smartphones until they are 14. To what extent do you agree or disagree?"],
    ["discussion", "Some people think that governments should spend money on public transport, while others think roads are more important. Discuss both views and give your own opinion."],
    ["discussion", "Some people prefer to live in a big city, while others prefer the countryside. Discuss both views and give your own opinion."],
    ["discussion", "Some say that the best way to learn a language is to live in a country where it is spoken. Others say classroom study is more effective. Discuss both views and give your own opinion."],
    ["problem", "In many cities, young people cannot afford to buy a home. What are the causes of this problem, and what can be done to solve it?"],
    ["problem", "Many people today feel stressed at work. Why is this, and what can employers do to help?"],
    ["problem", "Plastic waste is a growing problem around the world. What are the causes, and what solutions can you suggest?"],
    ["advantages", "More and more people are shopping online instead of in shops. Do the advantages of this outweigh the disadvantages?"],
    ["advantages", "Many companies now use artificial intelligence to answer customer questions. Do the advantages of this outweigh the disadvantages?"],
    ["advantages", "In some countries, people are retiring later than before. Is this a positive or negative development?"]
  ];
  const PLANS = {
    opinion: ["Introduction: rephrase the question and give your clear opinion.", "Body 1: your main reason, with an explanation and an example.", "Body 2: a second reason (or the opposing view and why you disagree).", "Conclusion: restate your opinion in different words."],
    discussion: ["Introduction: rephrase both views and say you will discuss them.", "Body 1: the first view, with reasons and an example.", "Body 2: the second view, with reasons and an example.", "Conclusion: your own opinion, clearly stated."],
    problem: ["Introduction: rephrase the problem and say you will look at causes and solutions.", "Body 1: two causes, explained.", "Body 2: solutions that match those causes.", "Conclusion: summarise the main points."],
    advantages: ["Introduction: rephrase the question and say which side is stronger.", "Body 1: the advantages, with examples.", "Body 2: the disadvantages, with examples.", "Conclusion: your answer: which outweighs the other, and why."]
  };

  /* Speaking part 2 cue cards */
  const CUE_CARDS = [
    ["Describe a place you visited that you would like to go back to.", ["where it is", "when you went there", "what you did there", "and explain why you would like to go back"]],
    ["Describe a skill you would like to learn.", ["what the skill is", "why you want to learn it", "how you would learn it", "and explain how it would help you"]],
    ["Describe a person who has influenced you.", ["who the person is", "how you know them", "what they did", "and explain how they influenced you"]],
    ["Describe a book or film that made you think.", ["what it was", "when you read or saw it", "what it was about", "and explain why it made you think"]],
    ["Describe a time when you helped someone.", ["who you helped", "what the problem was", "what you did", "and explain how you felt about it"]],
    ["Describe an important decision you made.", ["what the decision was", "when you made it", "what you considered", "and explain why it was important"]],
    ["Describe a piece of technology you use every day.", ["what it is", "how often you use it", "what you use it for", "and explain how your life would be different without it"]],
    ["Describe a celebration you enjoyed.", ["what it was", "where it took place", "who was there", "and explain why you enjoyed it"]],
    ["Describe a goal you hope to achieve in the future.", ["what the goal is", "why you have this goal", "what you need to do", "and explain how you will feel if you achieve it"]],
    ["Describe a job you would like to do.", ["what the job is", "what skills it needs", "why it interests you", "and explain whether you think you will do it one day"]],
    ["Describe a time you were late for something.", ["what you were late for", "why you were late", "what happened", "and explain how you felt"]],
    ["Describe an outdoor activity you enjoy.", ["what it is", "where you do it", "who you do it with", "and explain why you enjoy it"]]
  ];

  /* =========================================================
     MOCK TESTS AND SCORES
     ========================================================= */
  const flat = (a) => a.reduce((x, y) => x.concat(y), []);
  const many = (fn, n) => flat(Array.from({ length: n }, () => [].concat(fn())));
  function toeicMock() {
    const listening = many(toeicP2, 8).concat(many(toeicP3, 4)).map((e) => Object.assign(e, { section: "L" }));
    const reading = many(toeicP5, 12).concat(many(toeicP7, 3)).map((e) => Object.assign(e, { section: "R" }));
    return listening.concat(reading);
  }
  function ieltsMock() {
    const listening = many(ieltsFormFill, 1).concat(many(ieltsDiscussion, 3)).map((e) => Object.assign(e, { section: "L" }));
    const reading = ieltsReading().map((e) => Object.assign(e, { section: "R" }));
    const second = ieltsReading();
    if (second[0].passage !== reading[0].passage) second.forEach((e) => reading.push(Object.assign(e, { section: "R" })));
    return listening.concat(reading);
  }
  const round5 = (n) => Math.round(n / 5) * 5;
  const toeicScale = (pct) => Math.max(5, Math.min(495, round5(5 + (pct / 100) * 490)));
  function ieltsBand(pct) {
    const T = [[95, 9], [88, 8.5], [80, 8], [73, 7.5], [65, 7], [57, 6.5], [48, 6], [40, 5.5], [32, 5], [25, 4.5], [18, 4], [10, 3.5]];
    for (const [p, b] of T) if (pct >= p) return b;
    return 3;
  }
  const bandToCEFR = (b) => (b >= 8.5 ? "C2" : b >= 7 ? "C1" : b >= 5.5 ? "B2" : b >= 4 ? "B1" : "A2");
  const toeicToCEFR = (s) => (s >= 945 ? "C1" : s >= 785 ? "B2" : s >= 550 ? "B1" : s >= 225 ? "A2" : "A1");

  return {
    toeic: { p2: toeicP2, p3: toeicP3, p5: toeicP5, p7: toeicP7, mock: toeicMock },
    ielts: { form: ieltsFormFill, discussion: ieltsDiscussion, reading: ieltsReading, mock: ieltsMock },
    WRITING, PLANS, CUE_CARDS, PASSAGES,
    toeicScale, ieltsBand, bandToCEFR, toeicToCEFR, many
  };
})();
