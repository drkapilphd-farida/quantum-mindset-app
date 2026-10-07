import type { FairForm } from './forms'

// English test forms for the fair reading test (Phase 3). Original stories,
// 300 ± 10 words, Flesch–Kincaid grade 6–7, 14–17 words per sentence; never
// the free Reading Speed Test's passages (forms.test.ts checks all of this).
export const EN_FORMS: readonly FairForm[] = [
  {
    id: 'A',
    lang: 'en',
    title: 'Twenty Minutes on the Bus',
    text: `Rahul Desai works as an accountant at a cement company in Nashik. For six years, his day looked the same: a forty-minute bus ride to the office, nine hours of spreadsheets, and the same ride home. He often said he wanted to learn computer programming, but he never seemed to have the time.

Last January, his younger cousin Pooja gave him a simple challenge. She told him to study for twenty minutes on the bus every morning, and to do nothing else during that time. Pooja was studying engineering, and she sent him one short lesson each night on his phone.

The first week was difficult: on Monday he fell asleep after ten minutes, and on Wednesday the bus was so crowded that he had to stand for the entire journey. By Friday he had completed only three of the five lessons, and he seriously considered giving up.

Instead, he changed two small things. He started taking the earlier bus, which left at seven and was usually half empty. He also wrote one line in a small notebook after each lesson, describing what he had learned in his own words.

After four months, Rahul wrote his first really useful program, which read the monthly expense sheets at his office and found entries that had been typed twice. The task used to take his team two full days; now it took only a few minutes.

His manager asked him to show the program at the next team meeting. Rahul was nervous, so he practised his presentation on the bus, of course. Three colleagues have since asked him to teach them.

Rahul still takes the seven o'clock bus. His notebook is almost full, and the first page has just one line: "Today I learned what a variable is."`,
    questions: [
      { kind: 'fact', question: 'Where does Rahul work?', options: ['At a cement company', 'At a bank', 'At a school', 'At a bus company'], correctIndex: 0 },
      { kind: 'fact', question: 'Who gave Rahul the twenty-minute challenge?', options: ['His manager', 'His cousin Pooja', 'A colleague', 'His teacher'], correctIndex: 1 },
      { kind: 'order', question: 'What happened on the Wednesday of the first week?', options: ['He fell asleep after ten minutes', 'He finished all five lessons', 'The bus was so crowded that he had to stand', 'He started taking the earlier bus'], correctIndex: 2 },
      {
        kind: 'main-idea',
        question: 'What is the passage mainly about?',
        options: ['Why buses in Nashik are crowded', 'How to write a computer program', 'Why accountants work long hours', 'How short daily study on the bus helped Rahul learn a new skill'],
        correctIndex: 3,
      },
      {
        kind: 'inference',
        question: 'Why did writing one line after each lesson probably help Rahul?',
        options: ['It made him put the lesson in his own words, so he remembered it', 'His manager checked the notebook', 'Pooja needed it for her college', 'It helped him stay awake on the bus'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'B',
    lang: 'en',
    title: 'The Timetable on the Fridge',
    text: `Ananya was preparing for her medical entrance exam, and she was sure she was failing. She studied for ten hours a day, but her mock test scores had not improved in two months. She felt exhausted all the time, and she had stopped meeting her friends and even her cousins on weekends.

Her grandmother, who had been a school principal for thirty years, watched quietly for a week. Then she asked Ananya to write down exactly what she did each hour for three days. The list surprised them both. Ananya was spending almost three hours a day reading the same chapters again, and only forty minutes answering questions.

Together they made a new timetable and stuck it on the fridge. Mornings were for new topics. Afternoons were for practice questions, with a timer. Every evening, Ananya had to explain one difficult idea to her grandmother, who knew no biology at all. If her grandmother could not follow it, Ananya had to try again the next day.

The new plan had one more rule that Ananya did not like at first. On Sundays, she had to stop studying at two o'clock and go for a walk.

The first mock test after the change went badly, and Ananya wanted to return to her old routine. Her grandmother asked her to wait three more weeks. By the fourth week, her score had risen by forty marks. More importantly, she noticed that she remembered the chapters she had explained aloud far better than the ones she had only read.

Ananya passed the exam the next year with a good rank. She kept the timetable, now yellow at the edges, and gave it to a younger student in her building who was starting the same journey.`,
    questions: [
      { kind: 'fact', question: 'What exam was Ananya preparing for?', options: ['A school board exam', 'A medical entrance exam', 'A job interview', 'A music competition'], correctIndex: 1 },
      { kind: 'fact', question: 'What job had her grandmother done?', options: ['Doctor', 'Biology teacher', 'School principal', 'Nurse'], correctIndex: 2 },
      { kind: 'order', question: 'Before the change, how much time did Ananya spend on practice questions each day?', options: ['About three hours', 'About ten hours', 'About two hours', 'About forty minutes'], correctIndex: 3 },
      {
        kind: 'main-idea',
        question: 'What is the passage mainly about?',
        options: ['How changing the way she studied, not the hours, helped Ananya improve', 'Why Sunday walks are healthy', 'How grandmothers teach biology', 'How hard medical exams are'],
        correctIndex: 0,
      },
      {
        kind: 'inference',
        question: 'Why did explaining ideas to her grandmother probably help Ananya?',
        options: ['Her grandmother knew all the answers', 'She had to understand an idea fully to explain it simply', 'It took less time than reading', 'The exam asked the same questions'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'C',
    lang: 'en',
    title: "The Rider's Notebook",
    text: `Imran Shaikh delivers food on a scooter in Pune. When he started, he lost a lot of time looking for buildings, especially in the newer parts of the city where new towers kept coming up. Many housing societies had several gates, and the map on his phone often showed the wrong gate. On his worst evening, he spent twenty minutes searching for one flat while the food went cold.

He began to keep notes in a small book. For every difficult address, he wrote down which gate to use, where to park, and whether the security guard needed the customer's name. After two months, his notebook held more than three hundred addresses.

One night, a new rider named Deepak was standing outside a large complex, completely lost. Imran showed him the right gate and then, on an impulse, sent him photos of ten pages from his notebook. Deepak shared the photos with four friends. Within a week, Imran was getting calls from riders he had never met.

He decided to start a WhatsApp group with a simple rule. Anyone could ask about an address, but anyone who got help had to add one tip of their own. The group grew to more than two hundred riders. Members began to post about broken lifts, closed lanes during festivals, and places where orders were always late.

The time Imran saved every day added up faster than he had expected, mainly during the busy festival season. He was now finishing four or five more deliveries each evening than before. With the extra money, he paid for an evening course in basic accounts.

Last month, a small delivery company asked Imran to help train its new riders. He agreed on one condition: every trainee must start a notebook on the very first day.`,
    questions: [
      { kind: 'fact', question: 'In which city does Imran deliver food?', options: ['Mumbai', 'Nagpur', 'Pune', 'Nashik'], correctIndex: 2 },
      {
        kind: 'fact',
        question: 'What did Imran write in his notebook?',
        options: ['His daily earnings', "Customers' phone numbers", 'Restaurant menus', 'Which gate to use and where to park at difficult addresses'],
        correctIndex: 3,
      },
      {
        kind: 'order',
        question: 'What did Imran do right after showing Deepak the right gate?',
        options: ['He sent him photos of pages from his notebook', 'He started the WhatsApp group', 'He joined an accounting course', 'He trained new riders'],
        correctIndex: 0,
      },
      {
        kind: 'main-idea',
        question: 'What is the passage mainly about?',
        options: ['Why food delivery is a hard job', "How Imran's note-taking habit grew into help for many riders", 'How to find gates in Pune', 'Why WhatsApp groups become large'],
        correctIndex: 1,
      },
      {
        kind: 'inference',
        question: "Why did the group's rule probably make it so useful?",
        options: ['It kept the group small', 'Only experts could join', 'Everyone who took help also gave a tip, so the knowledge kept growing', 'It stopped people from asking questions'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'D',
    lang: 'en',
    title: 'The Debate Club Recordings',
    text: `The debate club at a government school in Bhopal had one big problem. Its members knew their topics well, but they froze when they stood in front of an audience. In the district competition last year, two of the three speakers forgot their main points halfway through.

Their teacher, Mr. Fernandes, tried something new. He asked every student to record a two-minute speech on their phone at home, once a week, and to listen to it the next morning before school. He did not ask them to share the recordings with anyone.

Most students hated their first recording, and Kabir complained that he sounded like a nervous radio announcer reading the weather. Sneha counted that she had said the word "basically" eleven times in two minutes. But listening to themselves showed them their habits faster than any advice could.

By the third week, the students were setting their own small targets: Sneha wanted to say "basically" fewer than three times, and Kabir wanted to pause before each new point instead of rushing through his arguments. Another student practised looking up from his notes every time he finished a sentence.

In the club meetings, Mr. Fernandes added one rule. Before anyone gave feedback to a friend, they had to name one thing the speaker had done better than the week before.

At this year's district competition, the team reached the final for the first time. They did not win, but the judges wrote that the team's speakers were the calmest and most organised in the entire hall.

The club now has twenty-six members, twice as many as it had a year ago. Each new member gets the same first task: record two minutes, listen once, and write down one thing to change.`,
    questions: [
      { kind: 'fact', question: 'In which city is the school?', options: ['Indore', 'Pune', 'Nagpur', 'Bhopal'], correctIndex: 3 },
      { kind: 'fact', question: 'How long was each recorded speech?', options: ['Two minutes', 'Five minutes', 'Ten minutes', 'One minute'], correctIndex: 0 },
      {
        kind: 'order',
        question: "What happened at last year's district competition?",
        options: ['The team reached the final', 'Two of the three speakers forgot their main points', 'The team won', 'The judges praised their calm'],
        correctIndex: 1,
      },
      {
        kind: 'main-idea',
        question: 'What is the passage mainly about?',
        options: ['How to win a debate competition', 'Why students fear radio', 'How recording and listening to themselves made students confident speakers', 'The history of the school'],
        correctIndex: 2,
      },
      {
        kind: 'inference',
        question: 'Why did Mr. Fernandes probably ask students to name one improvement before giving feedback?',
        options: ['To make meetings shorter', 'Because the judges asked him to', 'To choose the team captain', 'So speakers felt encouraged and noticed their progress'],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 'E',
    lang: 'en',
    title: 'The Donor Register',
    text: `Every few months, the blood bank at the district hospital in Satara ran short of blood, and Nurse Kavita More saw what happened next. Families of patients had to call relatives late at night, and some planned surgeries were put off by a day or more.

Kavita saw that most donors gave blood only once, usually when someone they knew needed it. They were never asked again. So she started a simple register. Every donor who agreed was added with their name, phone number, blood group, and the date they gave blood.

Three months after each donation, when a person can safely give blood again, Kavita sent a short message to thank them and ask if they could come back. She wrote each message herself and never used a ready-made text.

At first, only one donor in ten returned, which was hard after so much effort, but Kavita did not give up. She began to tell each donor, in her message, how many patients had been helped that month. She also asked the hospital to keep Sunday mornings open for donations, because many people could not leave work on weekdays.

Slowly, over many months of steady work, the numbers began to change. After a year, nearly half of the donors in the register were coming back. The shortages became rare, and the hospital stopped putting off planned surgeries for lack of blood.

Other hospitals in the district asked Kavita how she did it. She explained that there was no secret. The register was only a notebook, and the messages took her fifteen minutes each evening.

The hospital now gives a small badge to anyone who donates five times. Kavita's register holds more than six hundred names, and the first one is her own.`,
    questions: [
      { kind: 'fact', question: 'Where does Kavita work?', options: ['At the district hospital in Satara', 'At a school in Satara', 'At a clinic in Pune', 'At a blood bank in Mumbai'], correctIndex: 0 },
      { kind: 'fact', question: 'When did Kavita send each donor a message?', options: ['The next day', 'Three months after their donation', 'One year later', 'Every Sunday'], correctIndex: 1 },
      {
        kind: 'order',
        question: 'What did Kavita do after only one donor in ten returned?',
        options: ['She stopped the register', 'She used a ready-made text', 'She told donors how many patients had been helped', 'She closed the blood bank on Sundays'],
        correctIndex: 2,
      },
      {
        kind: 'main-idea',
        question: 'What is the passage mainly about?',
        options: ['How to donate blood safely', 'Why operations are delayed', 'How hospitals give badges', 'How a simple register and personal messages solved a blood shortage'],
        correctIndex: 3,
      },
      {
        kind: 'inference',
        question: 'Why did opening on Sunday mornings probably help?',
        options: ['Many donors could only come when they were not at work', 'Blood given on Sundays is fresher', 'Nurses preferred working on Sundays', 'The register was updated on Sundays'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'R',
    lang: 'en',
    title: 'Swimming at Forty',
    text: `Suresh Iyer could not swim, and for most of his life this weakness did not seem important. Then, at the age of forty, he took his eight-year-old son to a lake near Coimbatore and realised he could not follow him into water deeper than his waist. That evening he made a decision to learn.

The only pool near his home offered lessons for adults at six in the morning. On the first day, Suresh was the oldest person in the class by fifteen years. He was so frightened of the deep end that he held the side of the pool for the entire lesson.

His coach, a former state champion named Leela, was patient and did not push him. For the first two weeks, she asked him only to put his face in the water and breathe out slowly. Suresh thought this was a waste of time, but he did it every morning.

In the third week, something important changed. Because he could now breathe calmly with his face in the water, he was able to float for a few seconds. By the end of the month, he could cross the width of the pool without stopping or panicking.

There were difficult days too, and twice he swallowed water and climbed out of the pool, coughing and embarrassed in front of everyone. Leela told him that every swimmer in that pool had done the same thing.

Six months later, Suresh completed a full length of the pool for the first time. His son was watching from the side and cheered louder than anyone.

Suresh still goes to the pool three mornings a week, before his office opens. He says the most valuable thing he learned was not a particular swimming stroke. It was how to stay calm while attempting something difficult.`,
    questions: [
      { kind: 'fact', question: 'How old was Suresh when he decided to learn swimming?', options: ['Thirty', 'Forty', 'Fifty', 'Eight'], correctIndex: 1 },
      {
        kind: 'fact',
        question: 'What did Leela ask Suresh to do for the first two weeks?',
        options: ['Swim to the deep end', 'Race the other students', 'Put his face in the water and breathe out slowly', 'Float on his back'],
        correctIndex: 2,
      },
      { kind: 'order', question: 'What could Suresh do by the end of the first month?', options: ['Swim a full length', 'Race his son', 'Dive into the deep end', 'Cross the width of the pool without stopping'], correctIndex: 3 },
      {
        kind: 'main-idea',
        question: 'What is the passage mainly about?',
        options: ['How Suresh slowly overcame his fear and learned to swim as an adult', 'How to become a state swimmer', 'Why lakes are dangerous', 'How pools in Coimbatore are run'],
        correctIndex: 0,
      },
      {
        kind: 'inference',
        question: 'Why did Leela probably start with breathing instead of strokes?',
        options: ['The pool was too small', 'Calm breathing had to come first before he could float or swim', 'She was not a good coach', 'Strokes are not important'],
        correctIndex: 1,
      },
    ],
  },
]
