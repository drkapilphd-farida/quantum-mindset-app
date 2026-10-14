// Free Reading & Memory Test passages — server-side only (the answer key
// lives here and must never reach the browser; only ./actions.ts imports it).
//
// 200–250 words each, with a few names, numbers and reasons, and 4 detail
// questions that cannot be answered from general knowledge. The questions
// are asked AFTER the memory challenge, so they measure what the reader
// still remembers after about a minute. All stories are original and
// fictional. The approval copy lives in docs/reading-memory-test-passages.md.
import type { TestPassage } from '@/features/reading-speed-test/passages'

export const MEMORY_TEST_PASSAGES: readonly TestPassage[] = [
  {
    id: 'rm-en-bakery',
    lang: 'en',
    title: 'The Four O’Clock Bakery',
    text: `In 2009, Meera Joshi opened a small bakery in Kothrud, Pune. She called it Four O’Clock, because the ovens were lit every morning at four. At first she baked only two things: bread rolls and a cardamom cake that her grandmother had taught her.
The first year was hard. Meera sold about 60 rolls a day, and most of her customers were students from the college across the road. To save money, she rode a red bicycle to the market twice a week instead of hiring a van.
Everything changed in the monsoon of 2011. A long strike closed most shops in the area for nine days, but Meera kept baking. Her neighbour, a retired teacher named Mr. Kulkarni, offered to sell rolls from his front gate, so that people would not have to walk far in the rain. By the end of the strike, the bakery was selling more than 300 rolls a day.
Meera never forgot that help. Every Sunday, the first tray of rolls goes free to the hostel students who cannot go home for the weekend. Today Four O’Clock has eleven workers, and the cardamom cake is still made by hand, from the same recipe, in the same old tin.`,
    questions: [
      { question: 'Why was the bakery called Four O’Clock?', options: ['The ovens were lit at four every morning', 'It opened at four in the afternoon', 'It had four ovens', 'Meera had four sisters'], correctIndex: 0 },
      { question: 'About how many rolls did the bakery sell a day in its first year?', options: ['About 30', 'About 60', 'About 100', 'More than 300'], correctIndex: 1 },
      { question: 'Who sold rolls from his front gate during the strike?', options: ['A college student', 'Meera’s uncle', 'Mr. Kulkarni, a retired teacher', 'The owner of a van'], correctIndex: 2 },
      { question: 'What happens every Sunday?', options: ['The bakery stays closed', 'Meera teaches a baking class', 'The cake is sold at half price', 'The first tray of rolls goes free to hostel students'], correctIndex: 3 },
    ],
  },
  {
    id: 'rm-en-ferry',
    lang: 'en',
    title: 'The Tuesday Ferry',
    text: `Every Tuesday, a small ferry called Tara leaves the island of Kavaratti at half past seven in the morning and reaches Kadmat about three hours later. Its captain, Abdul Rahman, has made this trip for 22 years.
The ferry carries 40 passengers, but on most days it also carries something more important: letters, medicines and fresh vegetables for the 5,000 people who live on Kadmat. Before the ferry service began in 1998, vegetables reached the island only once a month, and many families grew tired of eating rice and fish every day.
In 2015, a storm damaged the ferry’s engine halfway through the journey. Captain Rahman did not panic. First, he asked all the passengers to sit in the middle of the boat to keep it steady. Then he used the radio to reach a fishing boat nearby. The fishing boat pulled the ferry slowly for two hours, until a coast guard ship arrived from the main island. Nobody was hurt.
The children of Kadmat now have a small tradition. When they see the ferry coming, they run to the jetty and count the white flags on its mast. Three flags mean that the ferry is carrying mail for the school.`,
    questions: [
      { question: 'For how many years has Captain Abdul Rahman made this trip?', options: ['22 years', '15 years', '3 years', '40 years'], correctIndex: 0 },
      { question: 'Before 1998, how often did vegetables reach Kadmat?', options: ['Every Tuesday', 'Once a month', 'Twice a week', 'Once a year'], correctIndex: 1 },
      { question: 'What did the captain do first when the engine was damaged?', options: ['He called the coast guard', 'He turned the ferry back', 'He asked the passengers to sit in the middle of the boat', 'He asked a fishing boat to pull it'], correctIndex: 2 },
      { question: 'What do three white flags on the mast mean?', options: ['A storm is coming', 'The ferry is full', 'It is the captain’s birthday', 'The ferry is carrying mail for the school'], correctIndex: 3 },
    ],
  },
  {
    id: 'rm-en-van',
    lang: 'en',
    title: 'The Reading Van',
    text: `In 2016, a retired bus driver named Joseph D’Souza bought an old school van for 90,000 rupees. He painted it blue, fixed 14 wooden shelves inside, and filled them with books given by his church in Mangaluru. He named it the Reading Van.
Every Saturday, Joseph drives the van to three villages. He stays two hours in each one, and children can borrow up to two books for a week. At first, only eight children came. Joseph noticed that many of them were too shy to choose, so he started reading the first page of a story aloud and stopping at the most exciting moment. Within a month, more than fifty children were waiting for the van.
Joseph has one rule: every book must come back with a drawing. On a slip of paper, each child draws one scene from the story they read. Joseph keeps these drawings in a big box, and he says it now holds more than 3,000 of them.
In 2022, the van broke down for six weeks. The children of one village collected 4,200 rupees from their families to help pay for the repair, and they made a thank-you card that is still taped above the steering wheel.`,
    questions: [
      { question: 'How much did Joseph pay for the old van?', options: ['90,000 rupees', '14,000 rupees', '4,200 rupees', '3,000 rupees'], correctIndex: 0 },
      { question: 'How did Joseph get the shy children interested?', options: ['He gave them sweets', 'He read a story aloud and stopped at an exciting moment', 'He asked their teachers to send them', 'He let them keep the books'], correctIndex: 1 },
      { question: 'What must come back with every book?', options: ['A short written summary', 'A small payment', 'A drawing of one scene', 'A note from a parent'], correctIndex: 2 },
      { question: 'Who helped pay for the repair in 2022?', options: ['Joseph’s church', 'The village school', 'A bank', 'The children of one village and their families'], correctIndex: 3 },
    ],
  },
  {
    id: 'rm-hi-bakery',
    lang: 'hi',
    title: '“चार बजे” वाली बेकरी',
    text: `सन 2009 में मीरा जोशी ने पुणे के कोथरूड में एक छोटी-सी बेकरी खोली। उसने उसका नाम रखा “चार बजे”, क्योंकि उसके ओवन हर सुबह ठीक चार बजे जलाए जाते थे। शुरू में वह सिर्फ़ दो चीज़ें बनाती थी: ब्रेड रोल और इलायची वाला केक, जो उसकी दादी ने उसे सिखाया था।
पहला साल मुश्किल था। मीरा रोज़ लगभग 60 रोल बेचती थी, और उसके ज़्यादातर ग्राहक सड़क के उस पार वाले कॉलेज के विद्यार्थी थे। पैसे बचाने के लिए वह गाड़ी किराए पर लेने के बजाय हफ़्ते में दो बार अपनी लाल साइकिल से बाज़ार जाती थी।
2011 के मानसून में सब कुछ बदल गया। एक लंबी हड़ताल की वजह से इलाके की ज़्यादातर दुकानें नौ दिन तक बंद रहीं, लेकिन मीरा ने बेकिंग बंद नहीं की। उसके पड़ोसी, रिटायर्ड शिक्षक कुलकर्णी जी, ने अपने घर के गेट से रोल बेचने की पेशकश की, ताकि लोगों को बारिश में दूर न जाना पड़े। हड़ताल ख़त्म होते-होते बेकरी रोज़ 300 से ज़्यादा रोल बेचने लगी।
मीरा वह मदद कभी नहीं भूली। हर रविवार रोल की पहली ट्रे हॉस्टल के उन विद्यार्थियों को मुफ़्त जाती है, जो छुट्टी में घर नहीं जा पाते। आज “चार बजे” में ग्यारह लोग काम करते हैं, और इलायची वाला केक आज भी उसी पुराने टिन में, उसी नुस्ख़े से, हाथ से बनता है।`,
    questions: [
      { question: 'बेकरी का नाम “चार बजे” क्यों रखा गया?', options: ['क्योंकि ओवन हर सुबह चार बजे जलाए जाते थे', 'क्योंकि वह दोपहर चार बजे खुलती थी', 'क्योंकि उसमें चार ओवन थे', 'क्योंकि मीरा की चार बहनें थीं'], correctIndex: 0 },
      { question: 'पहले साल बेकरी रोज़ लगभग कितने रोल बेचती थी?', options: ['लगभग 30', 'लगभग 60', 'लगभग 100', '300 से ज़्यादा'], correctIndex: 1 },
      { question: 'हड़ताल के दौरान अपने गेट से रोल किसने बेचे?', options: ['कॉलेज के एक विद्यार्थी ने', 'मीरा के चाचा ने', 'रिटायर्ड शिक्षक कुलकर्णी जी ने', 'एक गाड़ी वाले ने'], correctIndex: 2 },
      { question: 'हर रविवार क्या होता है?', options: ['बेकरी बंद रहती है', 'मीरा बेकिंग सिखाती है', 'केक आधे दाम पर बिकता है', 'रोल की पहली ट्रे हॉस्टल के विद्यार्थियों को मुफ़्त जाती है'], correctIndex: 3 },
    ],
  },
  {
    id: 'rm-hi-ferry',
    lang: 'hi',
    title: 'मंगलवार वाली नाव',
    text: `हर मंगलवार सुबह साढ़े सात बजे “तारा” नाम की एक छोटी नाव कवरत्ती द्वीप से निकलती है और लगभग तीन घंटे बाद कदमत पहुँचती है। उसके कप्तान अब्दुल रहमान 22 साल से यह सफ़र कर रहे हैं।
नाव में 40 यात्री बैठ सकते हैं, लेकिन ज़्यादातर दिनों में वह इससे भी ज़रूरी चीज़ें ले जाती है: चिट्ठियाँ, दवाइयाँ और कदमत में रहने वाले 5,000 लोगों के लिए ताज़ी सब्ज़ियाँ। 1998 में यह सेवा शुरू होने से पहले सब्ज़ियाँ द्वीप पर महीने में सिर्फ़ एक बार पहुँचती थीं, और कई परिवार रोज़ चावल और मछली खाकर ऊब जाते थे।
2015 में आधे रास्ते में एक तूफ़ान से नाव का इंजन ख़राब हो गया। कप्तान रहमान घबराए नहीं। सबसे पहले उन्होंने सभी यात्रियों से नाव के बीच में बैठने को कहा, ताकि नाव स्थिर रहे। फिर उन्होंने रेडियो से पास की एक मछली पकड़ने वाली नाव से संपर्क किया। वह नाव दो घंटे तक “तारा” को खींचती रही, जब तक तटरक्षक का जहाज़ नहीं आ गया। किसी को चोट नहीं आई।
अब कदमत के बच्चों की एक छोटी-सी परंपरा है। नाव को आते देखकर वे घाट की ओर दौड़ते हैं और उसके खंभे पर लगे सफ़ेद झंडे गिनते हैं। तीन झंडों का मतलब है कि नाव स्कूल के लिए डाक ला रही है।`,
    questions: [
      { question: 'कप्तान अब्दुल रहमान कितने साल से यह सफ़र कर रहे हैं?', options: ['22 साल से', '15 साल से', '3 साल से', '40 साल से'], correctIndex: 0 },
      { question: '1998 से पहले सब्ज़ियाँ कदमत कितनी बार पहुँचती थीं?', options: ['हर मंगलवार', 'महीने में एक बार', 'हफ़्ते में दो बार', 'साल में एक बार'], correctIndex: 1 },
      { question: 'इंजन ख़राब होने पर कप्तान ने सबसे पहले क्या किया?', options: ['तटरक्षक को बुलाया', 'नाव वापस मोड़ दी', 'यात्रियों से नाव के बीच में बैठने को कहा', 'मछली वाली नाव से खींचने को कहा'], correctIndex: 2 },
      { question: 'खंभे पर तीन सफ़ेद झंडों का क्या मतलब है?', options: ['तूफ़ान आने वाला है', 'नाव भरी हुई है', 'कप्तान का जन्मदिन है', 'नाव स्कूल के लिए डाक ला रही है'], correctIndex: 3 },
    ],
  },
  {
    id: 'rm-hi-van',
    lang: 'hi',
    title: 'किताबों वाली गाड़ी',
    text: `सन 2016 में जोसेफ़ डिसूज़ा नाम के एक रिटायर्ड बस ड्राइवर ने 90,000 रुपये में स्कूल की एक पुरानी गाड़ी ख़रीदी। उन्होंने उसे नीले रंग से रंगा, अंदर लकड़ी की 14 अलमारियाँ लगाईं और उन्हें मंगलुरु के अपने चर्च से मिली किताबों से भर दिया। उन्होंने उसका नाम रखा “किताबों वाली गाड़ी”।
हर शनिवार जोसेफ़ यह गाड़ी तीन गाँवों में ले जाते हैं। हर गाँव में वे दो घंटे रुकते हैं, और बच्चे एक हफ़्ते के लिए दो किताबें तक ले जा सकते हैं। शुरू में सिर्फ़ आठ बच्चे आए। जोसेफ़ ने देखा कि बहुत-से बच्चे किताब चुनने में शरमाते हैं, इसलिए वे कहानी का पहला पन्ना ज़ोर से पढ़ने लगे और सबसे रोमांचक मोड़ पर रुक जाने लगे। एक महीने के अंदर पचास से ज़्यादा बच्चे गाड़ी का इंतज़ार करने लगे।
जोसेफ़ का एक नियम है: हर किताब के साथ एक चित्र वापस आना चाहिए। एक पर्ची पर हर बच्चा अपनी पढ़ी हुई कहानी का एक दृश्य बनाता है। जोसेफ़ ये चित्र एक बड़े डिब्बे में रखते हैं, और उनका कहना है कि उसमें अब 3,000 से ज़्यादा चित्र हैं।
2022 में गाड़ी छह हफ़्ते के लिए ख़राब हो गई। एक गाँव के बच्चों ने मरम्मत में मदद के लिए अपने परिवारों से 4,200 रुपये इकट्ठा किए, और एक धन्यवाद-कार्ड बनाया, जो आज भी स्टीयरिंग के ऊपर चिपका हुआ है।`,
    questions: [
      { question: 'जोसेफ़ ने पुरानी गाड़ी कितने रुपये में ख़रीदी?', options: ['90,000 रुपये', '14,000 रुपये', '4,200 रुपये', '3,000 रुपये'], correctIndex: 0 },
      { question: 'जोसेफ़ ने शर्मीले बच्चों की रुचि कैसे जगाई?', options: ['उन्हें मिठाई देकर', 'कहानी ज़ोर से पढ़कर और रोमांचक मोड़ पर रुककर', 'उनके शिक्षकों से कहकर', 'किताबें हमेशा के लिए देकर'], correctIndex: 1 },
      { question: 'हर किताब के साथ क्या वापस आना चाहिए?', options: ['एक छोटा लिखित सार', 'थोड़े पैसे', 'कहानी के एक दृश्य का चित्र', 'माता-पिता की चिट्ठी'], correctIndex: 2 },
      { question: '2022 में मरम्मत के पैसे देने में किसने मदद की?', options: ['जोसेफ़ के चर्च ने', 'गाँव के स्कूल ने', 'एक बैंक ने', 'एक गाँव के बच्चों और उनके परिवारों ने'], correctIndex: 3 },
    ],
  },
]
