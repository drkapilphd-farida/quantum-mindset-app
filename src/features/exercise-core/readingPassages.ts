// Short reading passages for the chunk-reading exercises (Dynamic Chunk
// Sliding, Vertical Chunk Sliding). English and Hindi, three lengths:
//   tier 1 ≈ 45–60 words · tier 2 ≈ 75–95 words · tier 3 ≈ 105–130 words
// Each has 3 recall questions (answerable only from the passage) and a
// one-line summary to choose. Facts are well-established and kept simple;
// no claims about the app or about "speed reading".

export type PassageLang = 'en' | 'hi'

export type PassageQuestion = { q: string; options: readonly string[]; answer: number }

export type ReadingPassage = {
  id: string
  lang: PassageLang
  tier: 1 | 2 | 3
  title: string
  text: string
  questions: readonly PassageQuestion[]
  summary: { options: readonly string[]; answer: number }
}

const EN: readonly ReadingPassage[] = [
  // ---- tier 1 ----
  {
    id: 'banyan',
    lang: 'en',
    tier: 1,
    title: 'The banyan tree',
    text: 'The banyan is the national tree of India. As it grows, it sends thin roots down from its branches. When these roots reach the soil, they thicken and become new trunks. In this way one banyan can spread very wide. A famous banyan near Kolkata covers more ground than two football fields.',
    questions: [
      { q: 'What does the banyan send down from its branches?', options: ['Thin roots', 'Seeds', 'Flowers'], answer: 0 },
      { q: 'What do those roots become?', options: ['Leaves', 'New trunks', 'Fruit'], answer: 1 },
      { q: 'Where is the famous banyan in the passage?', options: ['Near Chennai', 'Near Delhi', 'Near Kolkata'], answer: 2 },
    ],
    summary: { options: ['A banyan spreads by growing roots from its branches that become new trunks.', 'Banyan trees grow only near Kolkata.', 'Football fields are often planted with banyan trees.'], answer: 0 },
  },
  {
    id: 'monsoon',
    lang: 'en',
    tier: 1,
    title: 'The monsoon',
    text: 'Every summer, moist winds from the sea bring the monsoon rains to India. The rains usually reach Kerala first, around the first of June, and then move north. Most of India’s yearly rain falls in these few months. Farmers watch the monsoon closely, because crops like rice depend on it.',
    questions: [
      { q: 'Which state do the rains usually reach first?', options: ['Punjab', 'Kerala', 'Assam'], answer: 1 },
      { q: 'Around which date do they arrive there?', options: ['1 June', '15 August', '1 January'], answer: 0 },
      { q: 'Which crop is named as depending on the monsoon?', options: ['Wheat', 'Cotton', 'Rice'], answer: 2 },
    ],
    summary: { options: ['Kerala is the wettest state in India.', 'The monsoon brings most of India’s rain and matters greatly to farmers.', 'Sea winds are always dry in summer.'], answer: 1 },
  },
  {
    id: 'bees',
    lang: 'en',
    tier: 1,
    title: 'The bee dance',
    text: 'When a honeybee finds a good patch of flowers, it flies back to the hive and dances. It moves in a figure-of-eight and waggles its body in the middle. The direction of the waggle shows which way to fly. The length of the waggle shows how far away the flowers are.',
    questions: [
      { q: 'What shape does the bee dance in?', options: ['A circle', 'A figure-of-eight', 'A straight line'], answer: 1 },
      { q: 'What does the direction of the waggle show?', options: ['Which way to fly', 'How sweet the flowers are', 'How many bees to send'], answer: 0 },
      { q: 'What does the length of the waggle show?', options: ['The colour of the flowers', 'The time of day', 'How far away the flowers are'], answer: 2 },
    ],
    summary: { options: ['Bees dance to keep the hive warm.', 'Honeybees only visit flowers near the hive.', 'A honeybee’s dance tells others where to find flowers.'], answer: 2 },
  },
  {
    id: 'sleep',
    lang: 'en',
    tier: 1,
    title: 'Sleep and learning',
    text: 'Sleep is not wasted time for a learner. While you sleep, the brain replays and strengthens what you practised during the day. Students who sleep well after studying usually remember more the next morning. Staying up all night before a test often means remembering less, not more.',
    questions: [
      { q: 'What does the brain do with the day’s practice during sleep?', options: ['Deletes it', 'Replays and strengthens it', 'Mixes it up'], answer: 1 },
      { q: 'When do good sleepers remember more?', options: ['The next morning', 'Only after a week', 'Only during the night'], answer: 0 },
      { q: 'What often happens after staying up all night before a test?', options: ['You remember more', 'Nothing changes', 'You remember less'], answer: 2 },
    ],
    summary: { options: ['Good sleep helps you remember what you learned.', 'Tests should always be in the morning.', 'Studying at night is the best way to learn.'], answer: 0 },
  },
  {
    id: 'dabbawala',
    lang: 'en',
    tier: 1,
    title: 'Mumbai’s dabbawalas',
    text: 'Every working day, Mumbai’s dabbawalas carry about two lakh home-cooked lunch boxes to offices across the city. They began in 1890. Many of them never studied much, so each box carries a simple code of colours and numbers. With this code, boxes reach the right desk and come back home almost without mistakes.',
    questions: [
      { q: 'About how many lunch boxes do they carry each day?', options: ['Two thousand', 'Two lakh', 'Two crore'], answer: 1 },
      { q: 'In which year did the dabbawalas begin?', options: ['1890', '1947', '1990'], answer: 0 },
      { q: 'What helps each box reach the right place?', options: ['A phone app', 'A printed map', 'A code of colours and numbers'], answer: 2 },
    ],
    summary: { options: ['Mumbai has the most offices in India.', 'Dabbawalas deliver lunch boxes accurately using a simple code.', 'Home-cooked food is healthier than office food.'], answer: 1 },
  },
  {
    id: 'chess',
    lang: 'en',
    tier: 1,
    title: 'Where chess began',
    text: 'Chess grew from an old Indian game called chaturanga, played about 1,500 years ago. Its pieces stood for the four parts of an army: foot soldiers, horses, elephants and chariots. The game travelled to Persia and then to Europe, changing a little in each place, until it became the chess we play today.',
    questions: [
      { q: 'What was the old Indian game called?', options: ['Chaturanga', 'Pachisi', 'Kabaddi'], answer: 0 },
      { q: 'What did the pieces stand for?', options: ['Kings and queens', 'Parts of an army', 'Planets'], answer: 1 },
      { q: 'Where did the game travel after India?', options: ['China', 'Africa', 'Persia'], answer: 2 },
    ],
    summary: { options: ['Chess began in Europe and later came to India.', 'Elephants were used in real wars.', 'Modern chess grew from the Indian game chaturanga.'], answer: 2 },
  },
  // ---- tier 2 ----
  {
    id: 'chandrayaan',
    lang: 'en',
    tier: 2,
    title: 'Chandrayaan-3',
    text: 'On 23 August 2023, India’s Chandrayaan-3 mission landed gently on the Moon. Its lander, Vikram, touched down near the Moon’s south pole, a region no country had landed in before. India became only the fourth country to make a soft landing on the Moon. A small rover called Pragyan rolled out and studied the soil for about two weeks. To remember the day, 23 August is now celebrated as National Space Day.',
    questions: [
      { q: 'What was the lander called?', options: ['Pragyan', 'Vikram', 'Aryabhata'], answer: 1 },
      { q: 'Near which part of the Moon did it land?', options: ['The south pole', 'The north pole', 'The equator'], answer: 0 },
      { q: 'What is 23 August now celebrated as?', options: ['Science Day', 'Moon Festival', 'National Space Day'], answer: 2 },
    ],
    summary: { options: ['Chandrayaan-3 made India the first country to reach the Moon.', 'Chandrayaan-3 landed softly near the Moon’s south pole, a first for any country.', 'The Pragyan rover is still working on the Moon today.'], answer: 1 },
  },
  {
    id: 'handnotes',
    lang: 'en',
    tier: 2,
    title: 'Notes by hand',
    text: 'Typing is fast, so many students copy a lecture almost word for word. Writing by hand is slower, and that turns out to be useful. Because you cannot write everything, you must choose the main ideas and put them in your own words. In one well-known study, students who took notes by hand answered questions about ideas better than students who typed. The lesson is simple: notes help most when they make you think, not just copy.',
    questions: [
      { q: 'Why do many typists copy a lecture word for word?', options: ['Typing is fast', 'Teachers ask them to', 'Laptops correct spelling'], answer: 0 },
      { q: 'What does slower handwriting force you to do?', options: ['Write neatly', 'Choose the main ideas', 'Stop listening'], answer: 1 },
      { q: 'In the study, who did better on questions about ideas?', options: ['Students who typed', 'Students who took no notes', 'Students who wrote by hand'], answer: 2 },
    ],
    summary: { options: ['Laptops should not be allowed in class.', 'Handwriting is always faster than typing.', 'Notes work best when they make you think and use your own words.'], answer: 2 },
  },
  {
    id: 'ganga',
    lang: 'en',
    tier: 2,
    title: 'The Ganga',
    text: 'The Ganga begins at the Gangotri glacier, high in the Himalayas of Uttarakhand. From there it flows about 2,500 kilometres across the plains of north India. Many large cities grew up on its banks. Near the sea, the Ganga joins the Brahmaputra, and together they form a huge delta before reaching the Bay of Bengal. Part of this delta is the Sundarbans, the largest mangrove forest in the world.',
    questions: [
      { q: 'Where does the Ganga begin?', options: ['At the Gangotri glacier', 'In the Bay of Bengal', 'In the Western Ghats'], answer: 0 },
      { q: 'About how long is its journey?', options: ['250 km', '2,500 km', '25,000 km'], answer: 1 },
      { q: 'What is the Sundarbans?', options: ['A desert', 'A mountain range', 'The largest mangrove forest'], answer: 2 },
    ],
    summary: { options: ['The Ganga flows from a Himalayan glacier across north India to a great delta by the sea.', 'The Brahmaputra is longer than the Ganga.', 'Every city in India is on the Ganga.'], answer: 0 },
  },
  {
    id: 'forgetting',
    lang: 'en',
    tier: 2,
    title: 'Why we forget',
    text: 'More than a hundred years ago, a German scientist named Hermann Ebbinghaus tested his own memory. He found that we forget much of something new within a day, unless we look at it again. But each time we review, we forget more slowly. So a short review the next day, then after a few days, then after a week, keeps learning alive far better than one long session.',
    questions: [
      { q: 'Whose memory did Ebbinghaus test?', options: ['His students’', 'His own', 'Children’s'], answer: 1 },
      { q: 'How soon do we forget much of something new?', options: ['Within a day', 'After a year', 'Never'], answer: 0 },
      { q: 'What does each review do?', options: ['Makes us forget faster', 'Changes nothing', 'Makes us forget more slowly'], answer: 2 },
    ],
    summary: { options: ['One long study session is best.', 'Short reviews spread over days help us remember for longer.', 'Germans have better memories.'], answer: 1 },
  },
  {
    id: 'water',
    lang: 'en',
    tier: 2,
    title: 'Water and focus',
    text: 'About 60 per cent of an adult’s body is water. We lose some of it all day through breathing, sweat and the toilet. When we do not drink enough, even mild thirst can make it harder to concentrate and can bring on a headache. Thirst is a late signal, so it helps to sip water through the day, especially in hot weather or after sport, instead of waiting until you feel very thirsty.',
    questions: [
      { q: 'About how much of an adult’s body is water?', options: ['10 per cent', '60 per cent', '95 per cent'], answer: 1 },
      { q: 'What can even mild thirst make harder?', options: ['Concentrating', 'Sleeping', 'Seeing colours'], answer: 0 },
      { q: 'What does the passage suggest?', options: ['Drink only when very thirsty', 'Avoid water during sport', 'Sip water through the day'], answer: 2 },
    ],
    summary: { options: ['Headaches are always caused by thirst.', 'Drinking water regularly helps the body and the ability to focus.', 'Adults need less water than children.'], answer: 1 },
  },
  {
    id: 'railways',
    lang: 'en',
    tier: 2,
    title: 'India’s first passenger train',
    text: 'On 16 April 1853, India’s first passenger train left Bori Bunder in Bombay, now Mumbai, for Thane. The journey was about 34 kilometres long, and three steam engines pulled fourteen carriages. A holiday was declared, and crowds gathered to watch. Today Indian Railways is one of the largest railway networks in the world and carries more than two crore passengers on an ordinary day.',
    questions: [
      { q: 'Where did the first train go to?', options: ['Pune', 'Thane', 'Surat'], answer: 1 },
      { q: 'How long was the journey?', options: ['About 34 km', 'About 340 km', 'About 3 km'], answer: 0 },
      { q: 'How many passengers does Indian Railways carry on an ordinary day?', options: ['Two lakh', 'Twenty thousand', 'More than two crore'], answer: 2 },
    ],
    summary: { options: ['Steam engines are still used across India.', 'India’s railways began with a short 1853 trip and are now among the world’s largest.', 'Bombay was renamed Thane.'], answer: 1 },
  },
  // ---- tier 3 ----
  {
    id: 'pomodoro',
    lang: 'en',
    tier: 3,
    title: 'The tomato timer',
    text: 'In the late 1980s, an Italian student named Francesco Cirillo found it hard to focus. He picked up a kitchen timer shaped like a tomato — pomodoro in Italian — and promised himself he would work for just a short, fixed time. That idea became the Pomodoro method. You choose one task, set a timer for 25 minutes and work only on that task. Then you take a five-minute break. After four rounds, you take a longer break of fifteen to thirty minutes. Many people find that a clear finish line makes it easier to start, and that short breaks keep the mind fresh.',
    questions: [
      { q: 'What was the timer shaped like?', options: ['An apple', 'A tomato', 'A clock tower'], answer: 1 },
      { q: 'How long is one work period?', options: ['25 minutes', '45 minutes', '10 minutes'], answer: 0 },
      { q: 'When do you take a longer break?', options: ['After every round', 'Never', 'After four rounds'], answer: 2 },
    ],
    summary: { options: ['Italian students study longer than others.', 'Kitchen timers are useful for cooking tomatoes.', 'The Pomodoro method uses short timed work periods with breaks to help focus.'], answer: 2 },
  },
  {
    id: 'raman',
    lang: 'en',
    tier: 3,
    title: 'C. V. Raman and the colour of light',
    text: 'On a sea voyage in 1921, the physicist C. V. Raman wondered why the sea looks so deeply blue. Back in Kolkata, he and his team shone light through liquids and studied it carefully. On 28 February 1928 they found that a tiny part of the light comes out with a slightly different colour, because it has exchanged a little energy with the molecules. This became known as the Raman effect. In 1930 Raman received the Nobel Prize in Physics, the first Asian to win a Nobel Prize in science. India now celebrates 28 February every year as National Science Day.',
    questions: [
      { q: 'What did Raman wonder about on his voyage?', options: ['Why the sea is so blue', 'Why ships float', 'Why the Moon shines'], answer: 0 },
      { q: 'What happened to a tiny part of the light?', options: ['It disappeared', 'It came out a slightly different colour', 'It became heat'], answer: 1 },
      { q: 'What is 28 February celebrated as?', options: ['Teachers’ Day', 'Space Day', 'National Science Day'], answer: 2 },
    ],
    summary: { options: ['Raman discovered how light changes colour when it meets molecules, and won the Nobel Prize.', 'The sea is blue because it reflects the sky.', 'Raman built India’s first ship.'], answer: 0 },
  },
  {
    id: 'phonenear',
    lang: 'en',
    tier: 3,
    title: 'A phone on the desk',
    text: 'In a study published in 2017, researchers asked students to do tests that needed full attention. Some students left their phones in another room. Others kept them in a bag, and others kept them face down on the desk. All the phones were silent. The students whose phones were in another room did best, and those with the phone on the desk did worst — even though nobody touched their phones. Part of the mind, it seems, keeps working to ignore the phone. The practical lesson is easy: when you want to focus, put the phone out of the room, not just out of your hand.',
    questions: [
      { q: 'Where were the phones of the students who did best?', options: ['In a bag', 'In another room', 'On the desk'], answer: 1 },
      { q: 'Were the phones ringing during the tests?', options: ['No, they were silent', 'Yes, often', 'Only once'], answer: 0 },
      { q: 'What does the passage suggest when you want to focus?', options: ['Turn the screen face down', 'Keep the phone in your hand', 'Put the phone in another room'], answer: 2 },
    ],
    summary: { options: ['Silent phones never affect attention.', 'Just having a phone nearby can reduce focus, so keep it out of the room.', 'Students should not own phones.'], answer: 1 },
  },
  {
    id: 'sundarbans',
    lang: 'en',
    tier: 3,
    title: 'Tigers of the Sundarbans',
    text: 'The Sundarbans is a maze of islands, rivers and mangrove forest where the Ganga and Brahmaputra meet the Bay of Bengal. It is shared by India and Bangladesh. Twice a day the tide floods much of the forest, so mangrove trees have special roots that poke up out of the mud to breathe. The Sundarbans is home to the Royal Bengal tiger, which here has learned to swim between islands. The Indian part of the forest is a UNESCO World Heritage Site. Its thick mangroves also protect villages on the coast by slowing down the waves of storms.',
    questions: [
      { q: 'Which two countries share the Sundarbans?', options: ['India and Bangladesh', 'India and Nepal', 'India and Sri Lanka'], answer: 0 },
      { q: 'Why do mangrove roots poke out of the mud?', options: ['To catch fish', 'To breathe', 'To hold water'], answer: 1 },
      { q: 'How do the mangroves help coastal villages?', options: ['They provide electricity', 'They stop the tides completely', 'They slow down storm waves'], answer: 2 },
    ],
    summary: { options: ['Tigers in the Sundarbans live only on one island.', 'The Sundarbans is a tidal mangrove forest with swimming tigers that also shields the coast.', 'Bangladesh has more tigers than India.'], answer: 1 },
  },
  {
    id: 'eyesjump',
    lang: 'en',
    tier: 3,
    title: 'How your eyes read',
    text: 'When you read, your eyes do not glide smoothly along the line. They jump, stop for a quarter of a second or so, and jump again. Almost all the reading happens during the stops. Skilled readers are not using special eye tricks; they recognise familiar words and common word groups faster, so each stop takes in meaning quickly. That is why practice with meaningful phrases helps. But speed has a limit: if you push so fast that you skip the meaning, you have not really read. Good reading is the fastest speed at which you still understand.',
    questions: [
      { q: 'How do the eyes move along a line?', options: ['They glide smoothly', 'They jump and stop', 'They move backwards only'], answer: 1 },
      { q: 'When does almost all the reading happen?', options: ['During the stops', 'During the jumps', 'Between lines'], answer: 0 },
      { q: 'What does the passage call good reading?', options: ['Reading as fast as possible', 'Reading every word twice', 'The fastest speed at which you still understand'], answer: 2 },
    ],
    summary: { options: ['Eye exercises are the secret of fast reading.', 'Skilled readers recognise words and phrases quickly, but understanding sets the limit on speed.', 'Reading happens while the eyes are moving.'], answer: 1 },
  },
  {
    id: 'stepwell',
    lang: 'en',
    tier: 3,
    title: 'The Queen’s stepwell',
    text: 'In Patan, in Gujarat, there is a stepwell called Rani ki Vav, the Queen’s stepwell. It was built in the eleventh century in memory of King Bhimdev I, and is linked with his queen, Udayamati. Long flights of steps lead down seven levels to the water, and the walls carry hundreds of carved figures. For centuries the stepwell lay buried under silt from a nearby river, which helped protect the carvings. It was named a UNESCO World Heritage Site in 2014, and a picture of it appears on India’s 100-rupee note.',
    questions: [
      { q: 'In which state is Rani ki Vav?', options: ['Rajasthan', 'Gujarat', 'Karnataka'], answer: 1 },
      { q: 'How many levels lead down to the water?', options: ['Seven', 'Three', 'Twelve'], answer: 0 },
      { q: 'What helped protect the carvings?', options: ['A glass roof', 'Royal guards', 'Being buried under silt'], answer: 2 },
    ],
    summary: { options: ['Rani ki Vav is a carved eleventh-century stepwell in Gujarat, now a World Heritage Site.', 'All stepwells in India were built by queens.', 'The 100-rupee note shows a river in Patan.'], answer: 0 },
  },
]

const HI: readonly ReadingPassage[] = [
  // ---- tier 1 ----
  {
    id: 'banyan',
    lang: 'hi',
    tier: 1,
    title: 'बरगद का पेड़',
    text: 'बरगद भारत का राष्ट्रीय वृक्ष है। बढ़ते समय यह अपनी डालियों से पतली जड़ें नीचे की ओर लटकाता है। जब ये जड़ें मिट्टी तक पहुँचती हैं, तो मोटी होकर नए तने बन जाती हैं। इसी तरह एक बरगद बहुत दूर तक फैल सकता है। कोलकाता के पास का एक प्रसिद्ध बरगद दो फ़ुटबॉल मैदानों से भी ज़्यादा जगह घेरता है।',
    questions: [
      { q: 'बरगद अपनी डालियों से नीचे क्या लटकाता है?', options: ['पतली जड़ें', 'बीज', 'फूल'], answer: 0 },
      { q: 'ये जड़ें आगे चलकर क्या बनती हैं?', options: ['पत्ते', 'नए तने', 'फल'], answer: 1 },
      { q: 'प्रसिद्ध बरगद कहाँ के पास है?', options: ['चेन्नई', 'दिल्ली', 'कोलकाता'], answer: 2 },
    ],
    summary: { options: ['बरगद डालियों से जड़ें उतारकर, उन्हें नए तने बनाकर फैलता है।', 'बरगद सिर्फ़ कोलकाता के पास उगता है।', 'फ़ुटबॉल मैदानों में बरगद लगाए जाते हैं।'], answer: 0 },
  },
  {
    id: 'monsoon',
    lang: 'hi',
    tier: 1,
    title: 'मानसून',
    text: 'हर गर्मी में समुद्र से आने वाली नम हवाएँ भारत में मानसून की बारिश लाती हैं। बारिश आमतौर पर सबसे पहले केरल पहुँचती है, लगभग 1 जून के आसपास, और फिर उत्तर की ओर बढ़ती है। भारत की साल भर की ज़्यादातर बारिश इन्हीं कुछ महीनों में होती है। किसान मानसून पर बहुत ध्यान रखते हैं, क्योंकि धान जैसी फ़सलें इसी पर टिकी हैं।',
    questions: [
      { q: 'बारिश आमतौर पर सबसे पहले किस राज्य में पहुँचती है?', options: ['पंजाब', 'केरल', 'असम'], answer: 1 },
      { q: 'वहाँ बारिश लगभग किस तारीख़ को आती है?', options: ['1 जून', '15 अगस्त', '1 जनवरी'], answer: 0 },
      { q: 'मानसून पर टिकी कौन-सी फ़सल का नाम लिया गया है?', options: ['गेहूँ', 'कपास', 'धान'], answer: 2 },
    ],
    summary: { options: ['केरल भारत का सबसे गीला राज्य है।', 'मानसून भारत की ज़्यादातर बारिश लाता है और किसानों के लिए बहुत अहम है।', 'गर्मी में समुद्री हवाएँ हमेशा सूखी होती हैं।'], answer: 1 },
  },
  {
    id: 'bees',
    lang: 'hi',
    tier: 1,
    title: 'मधुमक्खी का नाच',
    text: 'जब किसी मधुमक्खी को फूलों का अच्छा ठिकाना मिलता है, तो वह छत्ते पर लौटकर नाचती है। वह आठ के अंक जैसी आकृति में घूमती है और बीच में अपना शरीर हिलाती है। हिलने की दिशा बताती है कि किस ओर उड़ना है। हिलने की लंबाई बताती है कि फूल कितनी दूर हैं।',
    questions: [
      { q: 'मधुमक्खी किस आकृति में नाचती है?', options: ['गोले में', 'आठ के अंक जैसी', 'सीधी रेखा में'], answer: 1 },
      { q: 'शरीर हिलाने की दिशा क्या बताती है?', options: ['किस ओर उड़ना है', 'फूल कितने मीठे हैं', 'कितनी मधुमक्खियाँ भेजनी हैं'], answer: 0 },
      { q: 'हिलने की लंबाई क्या बताती है?', options: ['फूलों का रंग', 'दिन का समय', 'फूल कितनी दूर हैं'], answer: 2 },
    ],
    summary: { options: ['मधुमक्खियाँ छत्ते को गरम रखने के लिए नाचती हैं।', 'मधुमक्खियाँ सिर्फ़ पास के फूलों पर जाती हैं।', 'मधुमक्खी का नाच दूसरों को फूलों का रास्ता बताता है।'], answer: 2 },
  },
  {
    id: 'sleep',
    lang: 'hi',
    tier: 1,
    title: 'नींद और सीखना',
    text: 'सीखने वाले के लिए नींद बेकार समय नहीं है। सोते समय दिमाग़ दिन में किए अभ्यास को दोहराता है और उसे पक्का करता है। जो छात्र पढ़ाई के बाद अच्छी नींद लेते हैं, उन्हें अगली सुबह आमतौर पर ज़्यादा याद रहता है। परीक्षा से पहले पूरी रात जागने से अक्सर याद कम रहता है, ज़्यादा नहीं।',
    questions: [
      { q: 'नींद में दिमाग़ दिन के अभ्यास के साथ क्या करता है?', options: ['मिटा देता है', 'दोहराकर पक्का करता है', 'उलझा देता है'], answer: 1 },
      { q: 'अच्छी नींद लेने वालों को कब ज़्यादा याद रहता है?', options: ['अगली सुबह', 'एक हफ़्ते बाद', 'सिर्फ़ रात में'], answer: 0 },
      { q: 'परीक्षा से पहले पूरी रात जागने से अक्सर क्या होता है?', options: ['ज़्यादा याद रहता है', 'कोई फ़र्क़ नहीं पड़ता', 'कम याद रहता है'], answer: 2 },
    ],
    summary: { options: ['अच्छी नींद सीखी हुई बातें याद रखने में मदद करती है।', 'परीक्षा हमेशा सुबह होनी चाहिए।', 'रात में पढ़ना सीखने का सबसे अच्छा तरीक़ा है।'], answer: 0 },
  },
  {
    id: 'dabbawala',
    lang: 'hi',
    tier: 1,
    title: 'मुंबई के डब्बावाले',
    text: 'हर कामकाजी दिन मुंबई के डब्बावाले घर का बना लगभग दो लाख टिफ़िन पूरे शहर के दफ़्तरों तक पहुँचाते हैं। उनका काम 1890 में शुरू हुआ था। उनमें से कई ज़्यादा पढ़े-लिखे नहीं हैं, इसलिए हर डिब्बे पर रंगों और अंकों का एक आसान कोड होता है। इसी कोड से डिब्बे सही मेज़ तक पहुँचते हैं और लगभग बिना ग़लती के घर लौट आते हैं।',
    questions: [
      { q: 'वे रोज़ लगभग कितने टिफ़िन पहुँचाते हैं?', options: ['दो हज़ार', 'दो लाख', 'दो करोड़'], answer: 1 },
      { q: 'डब्बावालों का काम किस साल शुरू हुआ?', options: ['1890', '1947', '1990'], answer: 0 },
      { q: 'हर डिब्बा सही जगह कैसे पहुँचता है?', options: ['फ़ोन ऐप से', 'छपे नक्शे से', 'रंगों और अंकों के कोड से'], answer: 2 },
    ],
    summary: { options: ['मुंबई में भारत के सबसे ज़्यादा दफ़्तर हैं।', 'डब्बावाले एक आसान कोड से टिफ़िन सही-सही पहुँचाते हैं।', 'घर का खाना दफ़्तर के खाने से अच्छा है।'], answer: 1 },
  },
  {
    id: 'chess',
    lang: 'hi',
    tier: 1,
    title: 'शतरंज कहाँ से शुरू हुआ',
    text: 'शतरंज चतुरंग नाम के एक पुराने भारतीय खेल से निकला है, जो लगभग 1,500 साल पहले खेला जाता था। इसके मोहरे सेना के चार अंगों को दर्शाते थे: पैदल सैनिक, घोड़े, हाथी और रथ। यह खेल फ़ारस गया और फिर यूरोप पहुँचा। हर जगह इसमें थोड़ा बदलाव हुआ, और आख़िर में यह आज का शतरंज बन गया।',
    questions: [
      { q: 'पुराने भारतीय खेल का नाम क्या था?', options: ['चतुरंग', 'पचीसी', 'कबड्डी'], answer: 0 },
      { q: 'मोहरे किसे दर्शाते थे?', options: ['राजा-रानी को', 'सेना के अंगों को', 'ग्रहों को'], answer: 1 },
      { q: 'भारत के बाद यह खेल कहाँ गया?', options: ['चीन', 'अफ़्रीका', 'फ़ारस'], answer: 2 },
    ],
    summary: { options: ['शतरंज यूरोप में शुरू होकर भारत आया।', 'असली युद्धों में हाथियों का इस्तेमाल होता था।', 'आज का शतरंज भारतीय खेल चतुरंग से निकला है।'], answer: 2 },
  },
  // ---- tier 2 ----
  {
    id: 'chandrayaan',
    lang: 'hi',
    tier: 2,
    title: 'चंद्रयान-3',
    text: '23 अगस्त 2023 को भारत का चंद्रयान-3 चंद्रमा पर धीरे से उतरा। इसका लैंडर विक्रम चंद्रमा के दक्षिणी ध्रुव के पास उतरा, जहाँ इससे पहले कोई भी देश नहीं उतरा था। चंद्रमा पर सॉफ़्ट लैंडिंग करने वाला भारत सिर्फ़ चौथा देश बना। प्रज्ञान नाम का एक छोटा रोवर बाहर निकला और लगभग दो हफ़्ते तक वहाँ की मिट्टी की जाँच करता रहा। इस दिन की याद में अब 23 अगस्त को राष्ट्रीय अंतरिक्ष दिवस मनाया जाता है।',
    questions: [
      { q: 'लैंडर का नाम क्या था?', options: ['प्रज्ञान', 'विक्रम', 'आर्यभट'], answer: 1 },
      { q: 'यह चंद्रमा के किस हिस्से के पास उतरा?', options: ['दक्षिणी ध्रुव', 'उत्तरी ध्रुव', 'भूमध्य रेखा'], answer: 0 },
      { q: '23 अगस्त अब किस रूप में मनाया जाता है?', options: ['विज्ञान दिवस', 'चंद्र उत्सव', 'राष्ट्रीय अंतरिक्ष दिवस'], answer: 2 },
    ],
    summary: { options: ['चंद्रयान-3 से भारत चंद्रमा पर पहुँचने वाला पहला देश बना।', 'चंद्रयान-3 चंद्रमा के दक्षिणी ध्रुव के पास धीरे से उतरा, जहाँ पहले कोई देश नहीं उतरा था।', 'प्रज्ञान रोवर आज भी चंद्रमा पर काम कर रहा है।'], answer: 1 },
  },
  {
    id: 'handnotes',
    lang: 'hi',
    tier: 2,
    title: 'हाथ से नोट्स',
    text: 'टाइप करना तेज़ होता है, इसलिए कई छात्र लेक्चर को लगभग शब्द-दर-शब्द उतार लेते हैं। हाथ से लिखना धीमा है, और यही बात काम की निकलती है। क्योंकि आप सब कुछ नहीं लिख सकते, आपको मुख्य बातें चुनकर अपने शब्दों में लिखनी पड़ती हैं। एक जानी-मानी स्टडी में हाथ से नोट्स लेने वाले छात्रों ने विचारों से जुड़े सवालों के जवाब टाइप करने वालों से बेहतर दिए। सीख आसान है: नोट्स तब सबसे ज़्यादा मदद करते हैं जब वे आपको सोचने पर मजबूर करें, सिर्फ़ नकल करने पर नहीं।',
    questions: [
      { q: 'कई छात्र लेक्चर शब्द-दर-शब्द क्यों उतार लेते हैं?', options: ['टाइप करना तेज़ है', 'शिक्षक कहते हैं', 'लैपटॉप वर्तनी ठीक करता है'], answer: 0 },
      { q: 'धीमी लिखावट आपको क्या करने पर मजबूर करती है?', options: ['सुंदर लिखने पर', 'मुख्य बातें चुनने पर', 'सुनना बंद करने पर'], answer: 1 },
      { q: 'स्टडी में विचारों वाले सवालों में किसने बेहतर किया?', options: ['टाइप करने वालों ने', 'नोट्स न लेने वालों ने', 'हाथ से लिखने वालों ने'], answer: 2 },
    ],
    summary: { options: ['कक्षा में लैपटॉप नहीं होने चाहिए।', 'हाथ से लिखना हमेशा टाइपिंग से तेज़ होता है।', 'नोट्स तब सबसे अच्छे हैं जब वे सोचने और अपने शब्दों में लिखने पर मजबूर करें।'], answer: 2 },
  },
  {
    id: 'ganga',
    lang: 'hi',
    tier: 2,
    title: 'गंगा',
    text: 'गंगा उत्तराखंड के ऊँचे हिमालय में गंगोत्री हिमनद से निकलती है। वहाँ से यह उत्तर भारत के मैदानों में लगभग 2,500 किलोमीटर बहती है। इसके किनारों पर कई बड़े शहर बसे। समुद्र के पास गंगा ब्रह्मपुत्र से मिलती है, और दोनों मिलकर बंगाल की खाड़ी तक पहुँचने से पहले एक विशाल डेल्टा बनाती हैं। इस डेल्टा का एक हिस्सा सुंदरबन है, जो दुनिया का सबसे बड़ा मैंग्रोव जंगल है।',
    questions: [
      { q: 'गंगा कहाँ से निकलती है?', options: ['गंगोत्री हिमनद से', 'बंगाल की खाड़ी से', 'पश्चिमी घाट से'], answer: 0 },
      { q: 'इसकी यात्रा लगभग कितनी लंबी है?', options: ['250 किमी', '2,500 किमी', '25,000 किमी'], answer: 1 },
      { q: 'सुंदरबन क्या है?', options: ['एक रेगिस्तान', 'एक पर्वत-श्रृंखला', 'सबसे बड़ा मैंग्रोव जंगल'], answer: 2 },
    ],
    summary: { options: ['गंगा हिमालय के हिमनद से निकलकर उत्तर भारत से होती हुई समुद्र के पास बड़े डेल्टा तक बहती है।', 'ब्रह्मपुत्र गंगा से लंबी है।', 'भारत का हर शहर गंगा के किनारे है।'], answer: 0 },
  },
  {
    id: 'forgetting',
    lang: 'hi',
    tier: 2,
    title: 'हम क्यों भूलते हैं',
    text: 'सौ से ज़्यादा साल पहले जर्मनी के वैज्ञानिक हर्मन एबिंगहॉस ने अपनी ही याददाश्त की जाँच की। उन्होंने पाया कि कोई नई बात हम एक दिन के अंदर काफ़ी हद तक भूल जाते हैं, जब तक उसे दोबारा न देखें। लेकिन हर बार दोहराने पर हम धीरे-धीरे भूलते हैं। इसलिए अगले दिन, फिर कुछ दिन बाद, फिर एक हफ़्ते बाद की छोटी-सी दोहराई, एक लंबे सत्र से कहीं बेहतर तरीक़े से सीख को ज़िंदा रखती है।',
    questions: [
      { q: 'एबिंगहॉस ने किसकी याददाश्त जाँची?', options: ['अपने छात्रों की', 'अपनी ही', 'बच्चों की'], answer: 1 },
      { q: 'नई बात का बड़ा हिस्सा हम कितनी जल्दी भूल जाते हैं?', options: ['एक दिन के अंदर', 'एक साल बाद', 'कभी नहीं'], answer: 0 },
      { q: 'हर दोहराई से क्या होता है?', options: ['हम जल्दी भूलते हैं', 'कुछ नहीं बदलता', 'हम धीरे भूलते हैं'], answer: 2 },
    ],
    summary: { options: ['एक लंबा पढ़ाई का सत्र सबसे अच्छा है।', 'कुछ-कुछ दिनों में की गई छोटी दोहराई से बातें लंबे समय तक याद रहती हैं।', 'जर्मन लोगों की याददाश्त बेहतर होती है।'], answer: 1 },
  },
  {
    id: 'water',
    lang: 'hi',
    tier: 2,
    title: 'पानी और ध्यान',
    text: 'एक वयस्क के शरीर का लगभग 60 प्रतिशत हिस्सा पानी है। साँस, पसीने और शौच के ज़रिए हम दिन भर इसका कुछ हिस्सा खोते रहते हैं। जब हम पूरा पानी नहीं पीते, तो हल्की प्यास भी ध्यान लगाना मुश्किल कर सकती है और सिरदर्द ला सकती है। प्यास देर से आने वाला संकेत है, इसलिए बहुत प्यास लगने का इंतज़ार करने के बजाय दिन भर थोड़ा-थोड़ा पानी पीना अच्छा है, ख़ासकर गर्मी में या खेल के बाद।',
    questions: [
      { q: 'एक वयस्क के शरीर का लगभग कितना हिस्सा पानी है?', options: ['10 प्रतिशत', '60 प्रतिशत', '95 प्रतिशत'], answer: 1 },
      { q: 'हल्की प्यास भी क्या मुश्किल कर सकती है?', options: ['ध्यान लगाना', 'सोना', 'रंग देखना'], answer: 0 },
      { q: 'पाठ क्या सुझाव देता है?', options: ['बहुत प्यास लगने पर ही पिएँ', 'खेल में पानी न पिएँ', 'दिन भर थोड़ा-थोड़ा पानी पिएँ'], answer: 2 },
    ],
    summary: { options: ['सिरदर्द हमेशा प्यास से होता है।', 'नियमित पानी पीना शरीर और ध्यान दोनों के लिए अच्छा है।', 'वयस्कों को बच्चों से कम पानी चाहिए।'], answer: 1 },
  },
  {
    id: 'railways',
    lang: 'hi',
    tier: 2,
    title: 'भारत की पहली यात्री रेल',
    text: '16 अप्रैल 1853 को भारत की पहली यात्री रेलगाड़ी बॉम्बे, यानी आज की मुंबई, के बोरी बंदर से ठाणे के लिए चली। यह सफ़र लगभग 34 किलोमीटर का था, और तीन भाप इंजन चौदह डिब्बे खींच रहे थे। उस दिन छुट्टी घोषित की गई, और देखने के लिए भीड़ जमा हुई। आज भारतीय रेल दुनिया के सबसे बड़े रेल नेटवर्क में से एक है और आम दिन में दो करोड़ से ज़्यादा यात्रियों को ले जाती है।',
    questions: [
      { q: 'पहली रेलगाड़ी कहाँ तक गई?', options: ['पुणे', 'ठाणे', 'सूरत'], answer: 1 },
      { q: 'सफ़र कितना लंबा था?', options: ['लगभग 34 किमी', 'लगभग 340 किमी', 'लगभग 3 किमी'], answer: 0 },
      { q: 'आम दिन में भारतीय रेल कितने यात्रियों को ले जाती है?', options: ['दो लाख', 'बीस हज़ार', 'दो करोड़ से ज़्यादा'], answer: 2 },
    ],
    summary: { options: ['भारत में आज भी भाप इंजन चलते हैं।', 'भारतीय रेल 1853 के एक छोटे सफ़र से शुरू होकर आज दुनिया के सबसे बड़े नेटवर्क में है।', 'बॉम्बे का नाम बदलकर ठाणे रखा गया।'], answer: 1 },
  },
  // ---- tier 3 ----
  {
    id: 'pomodoro',
    lang: 'hi',
    tier: 3,
    title: 'टमाटर वाला टाइमर',
    text: '1980 के दशक के आख़िर में इटली के एक छात्र फ़्रांचेस्को चिरिलो को ध्यान लगाने में मुश्किल होती थी। उन्होंने टमाटर के आकार का एक रसोई टाइमर उठाया — इतालवी में टमाटर को पोमोडोरो कहते हैं — और ख़ुद से वादा किया कि बस थोड़े, तय समय के लिए काम करेंगे। यही विचार पोमोडोरो तरीक़ा बना। आप एक काम चुनते हैं, 25 मिनट का टाइमर लगाते हैं और सिर्फ़ उसी काम पर लगे रहते हैं। फिर पाँच मिनट का ब्रेक लेते हैं। चार राउंड के बाद पंद्रह से तीस मिनट का लंबा ब्रेक लेते हैं। कई लोगों को लगता है कि साफ़ अंत-रेखा होने से शुरू करना आसान होता है, और छोटे ब्रेक दिमाग़ को ताज़ा रखते हैं।',
    questions: [
      { q: 'टाइमर किस आकार का था?', options: ['सेब के', 'टमाटर के', 'घंटाघर के'], answer: 1 },
      { q: 'काम का एक दौर कितना लंबा होता है?', options: ['25 मिनट', '45 मिनट', '10 मिनट'], answer: 0 },
      { q: 'लंबा ब्रेक कब लेते हैं?', options: ['हर राउंड के बाद', 'कभी नहीं', 'चार राउंड के बाद'], answer: 2 },
    ],
    summary: { options: ['इटली के छात्र दूसरों से ज़्यादा पढ़ते हैं।', 'रसोई टाइमर टमाटर पकाने के काम आते हैं।', 'पोमोडोरो तरीक़े में छोटे, तय समय के काम और ब्रेक से ध्यान बना रहता है।'], answer: 2 },
  },
  {
    id: 'raman',
    lang: 'hi',
    tier: 3,
    title: 'सी. वी. रमन और रोशनी का रंग',
    text: '1921 में एक समुद्री यात्रा के दौरान भौतिक-विज्ञानी सी. वी. रमन सोच में पड़ गए कि समुद्र इतना गहरा नीला क्यों दिखता है। कोलकाता लौटकर उन्होंने और उनकी टीम ने द्रवों से रोशनी गुज़ारकर उसका ध्यान से अध्ययन किया। 28 फ़रवरी 1928 को उन्होंने पाया कि रोशनी का एक बहुत छोटा हिस्सा थोड़े अलग रंग में बाहर आता है, क्योंकि वह अणुओं के साथ थोड़ी ऊर्जा का लेन-देन कर लेता है। इसे रमन प्रभाव कहा गया। 1930 में रमन को भौतिकी का नोबेल पुरस्कार मिला — विज्ञान में नोबेल पाने वाले वे पहले एशियाई थे। भारत अब हर साल 28 फ़रवरी को राष्ट्रीय विज्ञान दिवस मनाता है।',
    questions: [
      { q: 'यात्रा में रमन किस बात पर सोच में पड़े?', options: ['समुद्र इतना नीला क्यों है', 'जहाज़ कैसे तैरते हैं', 'चाँद क्यों चमकता है'], answer: 0 },
      { q: 'रोशनी के एक छोटे हिस्से के साथ क्या हुआ?', options: ['वह ग़ायब हो गया', 'वह थोड़े अलग रंग में बाहर आया', 'वह गर्मी बन गया'], answer: 1 },
      { q: '28 फ़रवरी किस रूप में मनाया जाता है?', options: ['शिक्षक दिवस', 'अंतरिक्ष दिवस', 'राष्ट्रीय विज्ञान दिवस'], answer: 2 },
    ],
    summary: { options: ['रमन ने खोजा कि अणुओं से मिलकर रोशनी का रंग कैसे बदलता है, और नोबेल पुरस्कार जीता।', 'समुद्र आसमान की परछाईं से नीला दिखता है।', 'रमन ने भारत का पहला जहाज़ बनाया।'], answer: 0 },
  },
  {
    id: 'phonenear',
    lang: 'hi',
    tier: 3,
    title: 'मेज़ पर रखा फ़ोन',
    text: '2017 में छपी एक स्टडी में शोधकर्ताओं ने छात्रों से ऐसे टेस्ट करवाए जिनमें पूरा ध्यान चाहिए था। कुछ छात्रों ने फ़ोन दूसरे कमरे में छोड़ दिए। कुछ ने बैग में रखे, और कुछ ने मेज़ पर उल्टा रख दिए। सारे फ़ोन साइलेंट थे। जिनके फ़ोन दूसरे कमरे में थे, उन्होंने सबसे अच्छा किया, और जिनके फ़ोन मेज़ पर थे, उन्होंने सबसे ख़राब — जबकि किसी ने फ़ोन छुआ तक नहीं। लगता है दिमाग़ का एक हिस्सा फ़ोन को नज़रअंदाज़ करने में ही लगा रहता है। सीख आसान है: जब ध्यान लगाना हो, तो फ़ोन को सिर्फ़ हाथ से नहीं, कमरे से बाहर रखें।',
    questions: [
      { q: 'सबसे अच्छा करने वाले छात्रों के फ़ोन कहाँ थे?', options: ['बैग में', 'दूसरे कमरे में', 'मेज़ पर'], answer: 1 },
      { q: 'क्या टेस्ट के दौरान फ़ोन बज रहे थे?', options: ['नहीं, साइलेंट थे', 'हाँ, अक्सर', 'सिर्फ़ एक बार'], answer: 0 },
      { q: 'ध्यान लगाने के लिए पाठ क्या सुझाव देता है?', options: ['स्क्रीन उल्टी कर दें', 'फ़ोन हाथ में रखें', 'फ़ोन दूसरे कमरे में रखें'], answer: 2 },
    ],
    summary: { options: ['साइलेंट फ़ोन ध्यान पर कभी असर नहीं डालते।', 'पास में फ़ोन होना भी ध्यान घटा सकता है, इसलिए उसे कमरे से बाहर रखें।', 'छात्रों के पास फ़ोन नहीं होने चाहिए।'], answer: 1 },
  },
  {
    id: 'sundarbans',
    lang: 'hi',
    tier: 3,
    title: 'सुंदरबन के बाघ',
    text: 'सुंदरबन टापुओं, नदियों और मैंग्रोव जंगल की भूलभुलैया है, जहाँ गंगा और ब्रह्मपुत्र बंगाल की खाड़ी से मिलती हैं। इसे भारत और बांग्लादेश बाँटते हैं। दिन में दो बार ज्वार जंगल के बड़े हिस्से को डुबो देता है, इसलिए मैंग्रोव पेड़ों की ख़ास जड़ें साँस लेने के लिए कीचड़ से ऊपर निकली रहती हैं। सुंदरबन रॉयल बंगाल टाइगर का घर है, जिसने यहाँ टापुओं के बीच तैरना सीख लिया है। जंगल का भारतीय हिस्सा यूनेस्को विश्व धरोहर स्थल है। इसके घने मैंग्रोव तूफ़ानी लहरों को धीमा करके तट के गाँवों की रक्षा भी करते हैं।',
    questions: [
      { q: 'सुंदरबन को कौन-से दो देश बाँटते हैं?', options: ['भारत और बांग्लादेश', 'भारत और नेपाल', 'भारत और श्रीलंका'], answer: 0 },
      { q: 'मैंग्रोव की जड़ें कीचड़ से ऊपर क्यों निकलती हैं?', options: ['मछली पकड़ने के लिए', 'साँस लेने के लिए', 'पानी जमा करने के लिए'], answer: 1 },
      { q: 'मैंग्रोव तट के गाँवों की मदद कैसे करते हैं?', options: ['बिजली देकर', 'ज्वार पूरी तरह रोककर', 'तूफ़ानी लहरों को धीमा करके'], answer: 2 },
    ],
    summary: { options: ['सुंदरबन के बाघ सिर्फ़ एक टापू पर रहते हैं।', 'सुंदरबन तैरने वाले बाघों का ज्वार वाला मैंग्रोव जंगल है, जो तट की रक्षा भी करता है।', 'बांग्लादेश में भारत से ज़्यादा बाघ हैं।'], answer: 1 },
  },
  {
    id: 'eyesjump',
    lang: 'hi',
    tier: 3,
    title: 'आँखें कैसे पढ़ती हैं',
    text: 'पढ़ते समय आँखें पंक्ति पर आराम से फिसलती नहीं हैं। वे कूदती हैं, लगभग चौथाई सेकंड के लिए रुकती हैं, और फिर कूदती हैं। लगभग सारा पढ़ना इन ठहरावों में ही होता है। अच्छे पाठक आँखों की कोई ख़ास तरकीब नहीं अपनाते; वे जाने-पहचाने शब्दों और आम शब्द-समूहों को जल्दी पहचानते हैं, इसलिए हर ठहराव में अर्थ जल्दी पकड़ लेते हैं। इसीलिए अर्थपूर्ण वाक्यांशों का अभ्यास मदद करता है। लेकिन रफ़्तार की एक सीमा है: अगर आप इतनी तेज़ी करें कि अर्थ ही छूट जाए, तो आपने सच में पढ़ा नहीं। अच्छा पढ़ना वह सबसे तेज़ रफ़्तार है जिस पर आप अब भी समझते हैं।',
    questions: [
      { q: 'पंक्ति पर आँखें कैसे चलती हैं?', options: ['आराम से फिसलती हैं', 'कूदती और रुकती हैं', 'सिर्फ़ पीछे चलती हैं'], answer: 1 },
      { q: 'लगभग सारा पढ़ना कब होता है?', options: ['ठहरावों में', 'कूदते समय', 'पंक्तियों के बीच'], answer: 0 },
      { q: 'पाठ अच्छा पढ़ना किसे कहता है?', options: ['जितना तेज़ हो सके पढ़ना', 'हर शब्द दो बार पढ़ना', 'वह सबसे तेज़ रफ़्तार जिस पर आप समझते हैं'], answer: 2 },
    ],
    summary: { options: ['आँखों के व्यायाम तेज़ पढ़ने का राज़ हैं।', 'अच्छे पाठक शब्द और वाक्यांश जल्दी पहचानते हैं, पर रफ़्तार की सीमा समझ तय करती है।', 'पढ़ना आँखों के चलते समय होता है।'], answer: 1 },
  },
  {
    id: 'stepwell',
    lang: 'hi',
    tier: 3,
    title: 'रानी की वाव',
    text: 'गुजरात के पाटन में रानी की वाव नाम की एक बावड़ी है। इसे ग्यारहवीं सदी में राजा भीमदेव प्रथम की याद में बनाया गया था, और इसका नाम उनकी रानी उदयमती से जुड़ा है। सीढ़ियों की लंबी कतारें सात तलों से होकर पानी तक उतरती हैं, और दीवारों पर सैकड़ों नक़्क़ाशीदार मूर्तियाँ हैं। सदियों तक यह बावड़ी पास की नदी की गाद के नीचे दबी रही, जिससे मूर्तियाँ बची रहीं। 2014 में इसे यूनेस्को विश्व धरोहर स्थल घोषित किया गया, और इसकी तस्वीर भारत के 100 रुपये के नोट पर है।',
    questions: [
      { q: 'रानी की वाव किस राज्य में है?', options: ['राजस्थान', 'गुजरात', 'कर्नाटक'], answer: 1 },
      { q: 'पानी तक कितने तल उतरते हैं?', options: ['सात', 'तीन', 'बारह'], answer: 0 },
      { q: 'मूर्तियों को किस चीज़ ने बचाए रखा?', options: ['काँच की छत ने', 'शाही पहरेदारों ने', 'गाद के नीचे दबे रहने ने'], answer: 2 },
    ],
    summary: { options: ['रानी की वाव गुजरात की ग्यारहवीं सदी की नक़्क़ाशीदार बावड़ी है, जो अब विश्व धरोहर है।', 'भारत की सारी बावड़ियाँ रानियों ने बनवाईं।', '100 रुपये के नोट पर पाटन की एक नदी है।'], answer: 0 },
  },
]

export const READING_PASSAGES: Readonly<Record<PassageLang, readonly ReadingPassage[]>> = { en: EN, hi: HI }

/** Passage length grows with level: short (L1–3), medium (L4–7), long (L8–10). */
export function passageTierForLevel(level: number): 1 | 2 | 3 {
  if (level <= 3) return 1
  if (level <= 7) return 2
  return 3
}

/** Picks a passage of the right length, preferring ones not in `recentIds`. */
export function pickPassage(lang: PassageLang, level: number, recentIds: readonly string[], rng: () => number = Math.random): ReadingPassage {
  const tier = passageTierForLevel(level)
  const pool = READING_PASSAGES[lang].filter((p) => p.tier === tier)
  const fresh = pool.filter((p) => !recentIds.includes(p.id))
  const from = fresh.length > 0 ? fresh : pool
  return from[Math.floor(rng() * from.length)] ?? pool[0]!
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
