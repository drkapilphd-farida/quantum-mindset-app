// Reading Speed Test passages — server-side only (the answer key lives
// here and must never be sent to the browser; only actions.ts imports it).
//
// Step 1 (measured test): 300–350 words, 5 questions about specific
// details (names, numbers, order, reasons) so they cannot be answered from
// general knowledge. Step 2 (app practice demo): a short passage with 3
// questions. All stories are original and fictional. The approval copy of
// every passage and question lives in docs/speed-test-passages.md — keep
// both in sync (speedTestPassages.test.ts checks word counts and shape).

export type TestLang = 'en' | 'hi'

export type TestQuestion = {
  question: string
  /** Exactly 4 options; `correctIndex` points into this list. Shown shuffled. */
  options: readonly [string, string, string, string]
  correctIndex: number
}

export type TestPassage = {
  id: string
  lang: TestLang
  title: string
  text: string
  questions: readonly TestQuestion[]
}

export const MEASURED_PASSAGES: readonly TestPassage[] = [
  {
    id: 'en-lamp-shop',
    lang: 'en',
    title: 'The Lamp Shop on Station Road',
    text: `In 1987, Farida Khan opened a small shop on Station Road in Jalgaon. She sold kerosene lamps, because power cuts in the town were long and frequent. Her first shop had only two shelves and a wooden counter that her uncle, Salim, built from an old door.

For the first three years, business was slow. Farida kept a notebook in which she wrote down every customer's question. She noticed that farmers from nearby villages asked the same thing again and again: which lamp would last the whole night without refilling? Most lamps she stocked burned for about five hours. In 1990, she began ordering a larger brass lamp from a workshop in Moradabad. It cost more, but it burned for nine hours, and farmers were willing to pay the extra money.

By 1995, electricity in Jalgaon had become more reliable, and lamp sales began to fall. Farida did not close the shop. Instead, she looked again at her notebook. This time she saw that people were asking about torches and batteries for travel. She cleared one of her two shelves and filled it with torches. Within a year, torches brought in more money than lamps.

In 2004, her son Imran joined the business after finishing a diploma in electronics. He suggested repairing fans and radios in the back room, which had been used only for storage. Farida agreed on one condition: every repair had to come with a written bill, so that customers would trust the shop. The repair counter became so popular that the family rented the shop next door in 2008.

Today, the shop is run by Imran and his daughter, Sana. They sell solar lights, which Farida says are simply the newest kind of lamp. The original wooden counter is still there, near the entrance. The notebook is kept in a drawer under it, with more than four thousand questions written inside.`,
    questions: [
      {
        question: 'Who built the first wooden counter?',
        options: ['Her uncle, Salim', 'Her son, Imran', 'A carpenter from Moradabad', 'Farida herself'],
        correctIndex: 0,
      },
      {
        question: 'How long did the brass lamp from Moradabad burn?',
        options: ['Five hours', 'Seven hours', 'Nine hours', 'Twelve hours'],
        correctIndex: 2,
      },
      {
        question: 'Why did Farida start selling torches?',
        options: [
          'Lamp prices had gone up',
          'Customers were asking about torches and batteries for travel',
          'Her son suggested it',
          'The Moradabad workshop had closed',
        ],
        correctIndex: 1,
      },
      {
        question: 'What condition did Farida set for the repair service?',
        options: [
          'Repairs only on weekends',
          'Every repair had to come with a written bill',
          'Only fans could be repaired',
          'Imran had to finish his diploma first',
        ],
        correctIndex: 1,
      },
      {
        question: 'In which order did these happen?',
        options: [
          'Torches → brass lamps → repair counter',
          'Brass lamps → torches → repair counter',
          'Repair counter → torches → brass lamps',
          'Brass lamps → repair counter → torches',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'en-school-garden',
    lang: 'en',
    title: 'The School Garden Experiment',
    text: `In June last year, the Class 8 students of a school in Kolhapur started a garden experiment with their science teacher, Mr. Deshpande. The school had a strip of unused land behind the bus stand, about thirty metres long. Mr. Deshpande divided it into three equal plots and gave each plot to a group of eleven students.

The question was simple: which method would grow the most tomatoes? The first group, led by a student named Kavya, watered their plot every morning with a bucket. The second group, led by Rohan, used a drip line made from old plastic bottles, which let water fall slowly near the roots. The third group, led by Aditi, watered only twice a week but covered the soil with dry leaves to keep it moist.

Each group planted forty seedlings on the same day, 14 June. Every Friday, one student from each group counted the plants and measured the tallest one with a steel ruler. The results were written on a chart outside the staff room, so that the whole school could follow the experiment.

In the first month, Kavya's plot looked the greenest. But in August, heavy rain washed away some of its soil, and eight of its plants fell over. Rohan's drip line kept working through the rain, but two bottles cracked and had to be replaced. Aditi's plot grew slowly at first, but the leaf cover protected it from the rain.

The harvest was weighed on 30 September. Aditi's group collected 23 kilograms of tomatoes, Rohan's group collected 19 kilograms, and Kavya's group collected 12 kilograms. The students were surprised that the plot which received the least water produced the most.

Mr. Deshpande asked each group to write one paragraph explaining the result. The paragraphs were read aloud at the school assembly, and the tomatoes were sent to the school canteen, which served them at lunch for a week.`,
    questions: [
      {
        question: 'How many students were in each group?',
        options: ['Eight', 'Eleven', 'Fourteen', 'Forty'],
        correctIndex: 1,
      },
      {
        question: "How did Rohan's group water their plot?",
        options: [
          'With a bucket every morning',
          'With a drip line made from old plastic bottles',
          'Only with rainwater',
          'With a garden hose twice a week',
        ],
        correctIndex: 1,
      },
      {
        question: "What happened to Kavya's plot in August?",
        options: [
          'Goats ate the plants',
          'Heavy rain washed away soil and eight plants fell over',
          'Two bottles cracked',
          'It was moved behind the staff room',
        ],
        correctIndex: 1,
      },
      {
        question: "How many kilograms of tomatoes did Aditi's group collect?",
        options: ['12', '19', '23', '30'],
        correctIndex: 2,
      },
      {
        question: 'Where were the tomatoes sent after the harvest?',
        options: ['To a local market', 'To the school canteen', "To Mr. Deshpande's home", "To the students' homes"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'en-bridge',
    lang: 'en',
    title: 'A Bridge Built Twice',
    text: `The village of Kherwadi sits on the western bank of a narrow river. For many years, children crossed the river on a wooden footbridge to reach the high school in the next village, Palashi. In the monsoon of 2009, a flood carried the footbridge away in a single night.

The village council asked a retired engineer, Anil Rao, for help. He had spent thirty years building roads in the hills and had moved to Kherwadi to live with his sister. Anil walked along the river for three days before making any plan. He wanted to know where the water rose highest and where the banks were made of rock rather than mud.

He chose a spot four hundred metres north of the old bridge, where both banks were rocky. The new bridge would be made of steel and concrete, and it would stand on six pillars instead of the old bridge's twelve wooden posts. Fewer pillars meant fewer places where floating branches could get stuck and push against the bridge.

Money was the biggest problem. The council had only a third of what was needed. A women's savings group in the village offered a loan, and each family agreed to give two days of labour. Anil himself did not take a fee, but asked for one thing: that the names of every worker be painted on a board at the end of the bridge.

Work began in November 2010 and finished in April 2012. That July, the river rose higher than it had in 2009, but the bridge stood. The school in Palashi reported that attendance from Kherwadi went up during the monsoon months, because children no longer had to wait for the water to fall.

The board at the end of the bridge now lists 214 names. Anil Rao's name is not on it; he said the board was for the people who carried the stones.`,
    questions: [
      {
        question: 'Why did Anil Rao walk along the river for three days?',
        options: [
          'To find money for the bridge',
          'To see where the water rose highest and where the banks were rocky',
          'To visit the school in Palashi',
          'To collect floating branches',
        ],
        correctIndex: 1,
      },
      {
        question: 'How many pillars does the new bridge stand on?',
        options: ['Four', 'Six', 'Twelve', 'Fourteen'],
        correctIndex: 1,
      },
      {
        question: 'Who offered a loan for the bridge?',
        options: ['The school in Palashi', "A women's savings group", "Anil's sister", 'A road company'],
        correctIndex: 1,
      },
      {
        question: 'What did Anil ask for instead of a fee?',
        options: [
          'A house near the river',
          "That every worker's name be painted on a board",
          'That the bridge be named after him',
          'Two days of labour from each family',
        ],
        correctIndex: 1,
      },
      {
        question: 'When was the bridge finished?',
        options: ['November 2010', 'July 2011', 'April 2012', 'July 2012'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'hi-cycle-shop',
    lang: 'hi',
    title: 'सुनीता की साइकिल दुकान',
    text: `सन 1992 में सुनीता वर्मा ने इंदौर के पास एक छोटे कस्बे, महू, में साइकिल ठीक करने की दुकान खोली। उस समय कस्बे में कोई महिला ऐसा काम नहीं करती थी, इसलिए पहले कुछ महीनों में बहुत कम ग्राहक आए। दुकान के लिए औज़ार उसके पिता, रामप्रसाद, ने दिए थे, जो रेलवे वर्कशॉप में फिटर थे।

सुनीता ने एक नियम बनाया: जो भी साइकिल आधे घंटे में ठीक न हो सके, उसके ग्राहक को मुफ़्त चाय दी जाएगी। यह नियम धीरे-धीरे पूरे कस्बे में मशहूर हो गया। कई लोग तो सिर्फ़ यह देखने आते थे कि क्या सच में आधे घंटे में काम हो जाता है।

1996 में पास के सरकारी स्कूल ने लड़कियों को साइकिलें बाँटीं। स्कूल की प्रिंसिपल, श्रीमती जोशी, ने सुनीता से कहा कि वह हर शनिवार स्कूल आकर लड़कियों को पंचर ठीक करना सिखाए। सुनीता ने यह काम बिना पैसे लिए किया। तीन साल में उसने लगभग तीन सौ लड़कियों को यह काम सिखाया।

2003 में दुकान इतनी बड़ी हो गई कि सुनीता ने दो मददगार रखे — गोपाल और फ़ातिमा। गोपाल पहियों का काम देखता था और फ़ातिमा ब्रेक और चेन का। सुनीता ख़ुद हिसाब-किताब और नए ग्राहकों से बात करने का काम करने लगी। दोनों आज भी उसी दुकान में काम करते हैं।

2015 में कस्बे में बिजली से चलने वाली साइकिलें आने लगीं। बहुत से मिस्त्रियों ने सोचा कि अब उनका काम ख़त्म हो जाएगा। लेकिन सुनीता ने भोपाल जाकर छह हफ़्ते का एक कोर्स किया और बैटरी वाली साइकिलें ठीक करना सीखा। आज उसकी दुकान में आने वाली हर चौथी साइकिल बिजली वाली होती है।

दुकान की दीवार पर आज भी एक पुरानी तख़्ती टँगी है, जिस पर लिखा है: "आधा घंटा, नहीं तो चाय हमारी।" सुनीता कहती हैं कि पिछले दस सालों में उन्हें सिर्फ़ ग्यारह बार चाय पिलानी पड़ी है, और हर बार ग्राहक हँसते हुए गया।`,
    questions: [
      {
        question: 'सुनीता को दुकान के औज़ार किसने दिए थे?',
        options: ['उसके पिता रामप्रसाद ने', 'स्कूल की प्रिंसिपल ने', 'गोपाल ने', 'भोपाल के एक मिस्त्री ने'],
        correctIndex: 0,
      },
      {
        question: 'आधे घंटे में साइकिल ठीक न होने पर ग्राहक को क्या मिलता था?',
        options: ['पैसे वापस', 'मुफ़्त चाय', 'एक नई घंटी', 'अगली बार छूट'],
        correctIndex: 1,
      },
      {
        question: 'सुनीता हर शनिवार स्कूल में क्या सिखाती थी?',
        options: ['साइकिल चलाना', 'पंचर ठीक करना', 'हिसाब-किताब', 'बैटरी बदलना'],
        correctIndex: 1,
      },
      {
        question: 'दुकान में फ़ातिमा किस काम को देखती थी?',
        options: ['पहिये', 'ब्रेक और चेन', 'हिसाब-किताब', 'नए ग्राहकों से बात'],
        correctIndex: 1,
      },
      {
        question: 'बिजली वाली साइकिलें ठीक करना सीखने के लिए सुनीता कहाँ गई?',
        options: ['इंदौर', 'महू', 'भोपाल', 'दिल्ली'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'hi-village-library',
    lang: 'hi',
    title: 'गाँव का पुस्तकालय',
    text: `राजस्थान के एक गाँव, सांगानेरी, में 2011 तक कोई पुस्तकालय नहीं था। गाँव के डाकिए, हरीश मीणा, ने देखा कि बच्चे अक्सर उसके थैले में रखी पुरानी पत्रिकाएँ माँगते हैं। उसने सोचा कि अगर बच्चों को पढ़ने का इतना शौक़ है, तो गाँव में किताबों की एक जगह होनी चाहिए।

हरीश ने पंचायत से पुरानी चौपाल का एक कमरा माँगा, जो कई सालों से बंद पड़ा था। पंचायत ने कमरा दे दिया, पर शर्त रखी कि उसकी मरम्मत गाँव वाले ख़ुद करेंगे। छत की मरम्मत में दो हफ़्ते लगे और पूरा काम गाँव के सात युवकों ने मिलकर किया।

पहली किताबें हरीश के अपने घर से आईं — कुल अड़तीस किताबें। फिर उसने शहर में रहने वाले अपने पुराने सहपाठियों को चिट्ठियाँ लिखीं। छह महीने में डाक से चार सौ से ज़्यादा किताबें पहुँच गईं। हर किताब के पहले पन्ने पर भेजने वाले का नाम लिखा गया। कुछ किताबें इतनी पुरानी थीं कि उनके पन्नों को धागे से सिलना पड़ा।

पुस्तकालय हर दिन शाम चार बजे से सात बजे तक खुलता था, क्योंकि उससे पहले बच्चे स्कूल में और बड़े खेतों में होते थे। किताबें घर ले जाने का एक सीधा नियम था: एक किताब, एक हफ़्ता। जो बच्चा किताब समय पर लौटाता, उसका नाम दीवार पर लगे एक चार्ट पर लिखा जाता। चार्ट पर सबसे ज़्यादा नाम अक्सर छोटी कक्षाओं के बच्चों के होते थे।

2014 में गाँव की एक लड़की, पूजा, ने ज़िले की निबंध प्रतियोगिता में पहला स्थान पाया। उसने अपने निबंध में लिखा कि उसने पुस्तकालय की लगभग हर कहानी की किताब पढ़ी है। इसके बाद आस-पास के तीन गाँवों के बच्चे भी यहाँ आने लगे।

आज पुस्तकालय में दो हज़ार से ज़्यादा किताबें हैं और उसे हरीश की जगह गाँव की दो महिलाएँ, कमला और रेशमा, चलाती हैं। हरीश अब सेवानिवृत्त हो चुके हैं, पर हर रविवार वे बच्चों को एक कहानी पढ़कर सुनाते हैं।`,
    questions: [
      {
        question: 'हरीश मीणा का काम क्या था?',
        options: ['अध्यापक', 'डाकिया', 'किसान', 'पंचायत सदस्य'],
        correctIndex: 1,
      },
      {
        question: 'कमरे की छत की मरम्मत किसने की?',
        options: ['पंचायत के कर्मचारियों ने', 'गाँव के सात युवकों ने', 'हरीश के सहपाठियों ने', 'कमला और रेशमा ने'],
        correctIndex: 1,
      },
      {
        question: 'पुस्तकालय की पहली किताबें कहाँ से आईं?',
        options: ['शहर के सहपाठियों से', 'हरीश के अपने घर से', 'ज़िले के स्कूल से', 'पंचायत से'],
        correctIndex: 1,
      },
      {
        question: 'पुस्तकालय शाम को ही क्यों खुलता था?',
        options: [
          'क्योंकि बिजली सिर्फ़ शाम को आती थी',
          'क्योंकि उससे पहले बच्चे स्कूल में और बड़े खेतों में होते थे',
          'क्योंकि हरीश दिन में डाक बाँटते थे',
          'क्योंकि कमरा सुबह बंद रहता था',
        ],
        correctIndex: 1,
      },
      {
        question: 'पूजा की जीत के बाद क्या हुआ?',
        options: [
          'पुस्तकालय का नाम बदला गया',
          'आस-पास के तीन गाँवों के बच्चे भी आने लगे',
          'पंचायत ने नया कमरा दिया',
          'हरीश सेवानिवृत्त हो गए',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'hi-train-journey',
    lang: 'hi',
    title: 'पहली रेल यात्रा',
    text: `ग्यारह साल की अनन्या ने अपनी पहली लंबी रेल यात्रा दिसंबर की एक सर्द सुबह शुरू की। वह अपनी दादी, सरला देवी, के साथ लखनऊ से गुवाहाटी जा रही थी, जहाँ उसके मामा की शादी थी। यात्रा लगभग छत्तीस घंटे की थी।

ट्रेन सुबह छह बजकर दस मिनट पर चलनी थी, पर कोहरे की वजह से वह दो घंटे देर से आई। स्टेशन पर इंतज़ार करते हुए दादी ने अनन्या को एक छोटी डायरी दी और कहा कि वह रास्ते में हर उस चीज़ के बारे में लिखे जो उसे नई लगे।

पहले दिन अनन्या ने डायरी में चार बातें लिखीं। पहली, कि बिहार में खेतों के बीच बहुत से तालाब थे। दूसरी, कि एक स्टेशन पर चाय मिट्टी के कुल्हड़ में मिली। तीसरी, कि सामने की बर्थ पर बैठे एक सज्जन, जो असम के एक चाय बागान में काम करते थे, ने उसे बताया कि चाय की पत्तियाँ सुबह जल्दी तोड़ी जाती हैं। चौथी बात उसने सबसे बड़े अक्षरों में लिखी: रात में ट्रेन एक बहुत लंबे पुल से गुज़री, जिसके नीचे कोसी नदी थी।

दूसरे दिन सुबह ट्रेन न्यू जलपाईगुड़ी पहुँची। वहाँ डिब्बे में एक परिवार चढ़ा जिसके पास एक पिंजरे में दो तोते थे। तोते पूरे रास्ते "राम-राम" बोलते रहे और डिब्बे के सब बच्चे उनके पास इकट्ठा हो गए। परिवार ने बताया कि वे सिलीगुड़ी में एक रिश्तेदार के घर से लौट रहे थे।

गुवाहाटी पहुँचने से पहले ट्रेन ब्रह्मपुत्र नदी के ऊपर बने पुल से गुज़री। अनन्या ने लिखा कि यह नदी इतनी चौड़ी थी कि उसका दूसरा किनारा धुँधला दिखता था। दादी ने बताया कि पचास साल पहले वे भी इसी पुल से पहली बार गुज़री थीं, जब वे ख़ुद अपनी शादी के बाद गुवाहाटी गई थीं।

शादी के बाद, लौटते समय, अनन्या ने डायरी का आख़िरी पन्ना दादी को दे दिया। उस पर लिखा था: "अगली यात्रा में डायरी आप लिखेंगी, और मैं पढ़ूँगी।"`,
    questions: [
      {
        question: 'अनन्या किसके साथ यात्रा कर रही थी?',
        options: ['अपनी माँ के साथ', 'अपनी दादी सरला देवी के साथ', 'अपने मामा के साथ', 'अपनी सहेली के साथ'],
        correctIndex: 1,
      },
      {
        question: 'ट्रेन देर से क्यों आई?',
        options: ['बारिश की वजह से', 'कोहरे की वजह से', 'पुल की मरम्मत की वजह से', 'इंजन ख़राब होने से'],
        correctIndex: 1,
      },
      {
        question: 'सामने की बर्थ वाले सज्जन कहाँ काम करते थे?',
        options: ['गुवाहाटी स्टेशन पर', 'असम के एक चाय बागान में', 'बिहार के एक गाँव में', 'लखनऊ के एक स्कूल में'],
        correctIndex: 1,
      },
      {
        question: 'अनन्या ने सबसे बड़े अक्षरों में क्या लिखा?',
        options: ['कुल्हड़ वाली चाय के बारे में', 'कोसी नदी पर बने लंबे पुल के बारे में', 'तोतों के बारे में', 'ब्रह्मपुत्र नदी के बारे में'],
        correctIndex: 1,
      },
      {
        question: 'न्यू जलपाईगुड़ी में चढ़े परिवार के पास क्या था?',
        options: ['एक पिल्ला', 'पिंजरे में दो तोते', 'चाय की पत्तियों का थैला', 'एक डायरी'],
        correctIndex: 1,
      },
    ],
  },
]

export const PRACTICE_PASSAGES: readonly TestPassage[] = [
  {
    id: 'en-night-market',
    lang: 'en',
    title: 'The Thursday Market',
    text: `Every Thursday evening, a small market opens in the car park behind a cinema in Nagpur. It begins at seven o'clock, when the last office cars leave. There are about forty stalls. The most popular one belongs to a man named Deepak, who sells corn roasted over charcoal. He squeezes lime on each cob and adds a pinch of black salt. Deepak started with one cart in 2016; today his wife, Meena, runs a second cart at the other end of the market. The market closes at eleven, and the stall owners sweep the car park together before leaving, because the cinema manager allows the market only if the ground is clean by morning.`,
    questions: [
      {
        question: 'On which day does the market open?',
        options: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        correctIndex: 2,
      },
      {
        question: 'What does Deepak sell?',
        options: ['Tea', 'Roasted corn', 'Samosas', 'Fruit juice'],
        correctIndex: 1,
      },
      {
        question: 'Why do the stall owners sweep the car park?',
        options: [
          'Because it often rains',
          'Because the cinema manager allows the market only if the ground is clean',
          'Because Meena asks them to',
          'Because of a cleanliness competition',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'en-lighthouse',
    lang: 'en',
    title: "The Lighthouse Keeper's Log",
    text: `On the island of Kavaratti, a lighthouse keeper named Joseph wrote in a log book every night for twenty-two years. He noted the wind, the number of fishing boats that passed, and whether the lamp needed cleaning. In 1998 a storm damaged the lamp, and Joseph kept a line of oil lanterns burning on the tower for five nights until a new lamp arrived by ship. Fishermen later said the lanterns were weaker, but they were enough to show where the rocks began. When Joseph retired, he gave the log books to the island school, where students now use them to study how the weather has changed.`,
    questions: [
      {
        question: 'For how many years did Joseph keep the log?',
        options: ['Five', 'Twelve', 'Twenty-two', 'Thirty'],
        correctIndex: 2,
      },
      {
        question: 'What did Joseph use after the storm damaged the lamp?',
        options: ['A torch', 'A line of oil lanterns', 'A fire on the beach', 'A large mirror'],
        correctIndex: 1,
      },
      {
        question: 'Where are the log books now?',
        options: ['In a museum', 'At the island school', 'On the ship', 'With the fishermen'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'hi-pinwheel',
    lang: 'hi',
    title: 'मेले की चकरी',
    text: `हर साल कार्तिक के महीने में पुष्कर के पास एक बड़ा मेला लगता है। इस मेले में रमेश नाम का एक आदमी लकड़ी की चकरियाँ बेचता है, जिन्हें वह ख़ुद बनाता है। हर चकरी पर वह तीन रंग भरता है — लाल, पीला और हरा। रमेश ने यह काम अपने दादा से सीखा था, जो पचास साल तक इसी मेले में चकरियाँ बेचते रहे। मेले में वह सुबह नौ बजे अपनी जगह लगाता है और सूरज ढलने तक बैठता है। उसका कहना है कि बच्चे चकरी तभी ख़रीदते हैं जब वे उसे हवा में घूमती देखते हैं, इसलिए वह हमेशा एक चकरी अपनी पगड़ी में लगाकर रखता है।`,
    questions: [
      {
        question: 'रमेश ने चकरी बनाना किससे सीखा?',
        options: ['अपने पिता से', 'अपने दादा से', 'एक दुकानदार से', 'मेले के आयोजक से'],
        correctIndex: 1,
      },
      {
        question: 'हर चकरी पर कितने रंग होते हैं?',
        options: ['दो', 'तीन', 'चार', 'पाँच'],
        correctIndex: 1,
      },
      {
        question: 'रमेश एक चकरी पगड़ी में क्यों लगाता है?',
        options: ['धूप से बचने के लिए', 'ताकि बच्चे उसे हवा में घूमती देखें', 'दादा की याद में', 'क्योंकि यह मेले का नियम है'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'hi-boat-school',
    lang: 'hi',
    title: 'नाव वाला स्कूल',
    text: `असम के माजुली द्वीप पर एक छोटा स्कूल है जो हर साल बाढ़ के मौसम में नाव पर चलता है। स्कूल की अध्यापिका, मिताली, एक बड़ी नाव पर ब्लैकबोर्ड बाँधकर गाँव-गाँव जाती हैं। नाव में बारह बच्चे एक साथ बैठ सकते हैं, इसलिए कक्षाएँ दो पालियों में होती हैं — सुबह छोटे बच्चे और दोपहर में बड़े। बाढ़ ख़त्म होने के बाद स्कूल फिर से ज़मीन पर बने अपने भवन में लौट आता है। मिताली कहती हैं कि नाव वाले महीनों में बच्चों की हाज़िरी सबसे अच्छी रहती है, क्योंकि स्कूल ख़ुद उनके घर तक आता है।`,
    questions: [
      {
        question: 'बाढ़ के मौसम में स्कूल कहाँ चलता है?',
        options: ['मंदिर में', 'नाव पर', 'पंचायत भवन में', 'पेड़ के नीचे'],
        correctIndex: 1,
      },
      {
        question: 'नाव में एक साथ कितने बच्चे बैठ सकते हैं?',
        options: ['आठ', 'बारह', 'बीस', 'तीस'],
        correctIndex: 1,
      },
      {
        question: 'नाव वाले महीनों में हाज़िरी सबसे अच्छी क्यों रहती है?',
        options: [
          'क्योंकि छुट्टियाँ कम होती हैं',
          'क्योंकि स्कूल ख़ुद बच्चों के घर तक आता है',
          'क्योंकि दोपहर का खाना मिलता है',
          'क्योंकि उस समय परीक्षा होती है',
        ],
        correctIndex: 1,
      },
    ],
  },
]
