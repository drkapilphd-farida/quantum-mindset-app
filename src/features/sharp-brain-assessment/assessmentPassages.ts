// Day 1 / Day 30 assessment passages (Phase 8, Item 11). Two parallel
// forms (A and B) of the same length and reading level in each language
// (English, Hindi), each with five questions (three about what the text
// says, two that need a small inference). The learner picks the language
// at Day 1; Day 30 uses the OTHER form in the SAME language, so the result
// is not memory of the same text. All four are listed for approval in
// docs/assessment-passages.md — keep the assessment switched off until
// Dr. Kapil Dev Sharma approves them.

export type AssessmentQuestion = {
  question: string
  options: readonly [string, string, string]
  correctIndex: 0 | 1 | 2
}

export type AssessmentLang = 'en' | 'hi'

export type AssessmentPassage = {
  id: 'form-a' | 'form-b' | 'form-a-hi' | 'form-b-hi'
  lang: AssessmentLang
  form: 'A' | 'B'
  title: string
  paragraphs: readonly string[]
  questions: readonly AssessmentQuestion[]
}

export const ASSESSMENT_PASSAGES: readonly AssessmentPassage[] = [
  {
    id: 'form-a',
    lang: 'en',
    form: 'A',
    title: 'How Honeybees Share Directions',
    paragraphs: [
      'A honeybee that finds a good patch of flowers faces a problem. The flowers may be more than a kilometre from the hive, and the other bees cannot see them. Yet within minutes, many more bees arrive at the same flowers. How do they know where to go?',
      'The answer was worked out in the twentieth century by the Austrian scientist Karl von Frisch, who later shared a Nobel Prize for his work. He spent years watching bees through glass-sided hives. He noticed that a bee returning with food often performed a special movement on the wall of the honeycomb, which he called the waggle dance.',
      'In the waggle dance, the bee runs forward in a straight line while shaking its body from side to side. Then it circles back and repeats the run, again and again. The direction of the straight run tells the other bees which way to fly. Inside the dark hive, straight up on the honeycomb stands for the direction of the sun. If the bee runs straight up, the food lies toward the sun. If it runs at an angle to the right of straight up, the food lies at that same angle to the right of the sun.',
      'The length of the waggle run carries a second message: distance. A longer waggle means the flowers are farther away. For food very close to the hive, bees use a simpler circling movement instead, sometimes called the round dance.',
      'The dancing bee also carries the scent of the flowers on its body, and the watching bees can taste samples of the nectar it brings back. Together, direction, distance and smell give them enough information to find the flowers on their own.',
      'Bees use the same kind of dance for another important job. When a colony needs a new home, scout bees search for hollow trees and other sheltered spaces, and they dance to report the best places they have found.',
    ],
    questions: [
      {
        question: 'Who worked out how the waggle dance works?',
        options: ['Karl von Frisch', 'A French engineer', 'A Nobel Prize committee'],
        correctIndex: 0,
      },
      {
        question: 'In the dance, what does a run straight up the honeycomb mean?',
        options: ['Fly away from the sun', 'Fly toward the sun', 'The food is very close'],
        correctIndex: 1,
      },
      {
        question: 'What does a longer waggle run tell the other bees?',
        options: ['There are more flowers', 'The flowers are to the left', 'The flowers are farther away'],
        correctIndex: 2,
      },
      {
        question: 'Why is it useful for the watching bees to taste the nectar the dancer brings?',
        options: ['So they can recognise the right flowers', 'So they know the dancer is from their hive', 'So they can make honey faster'],
        correctIndex: 0,
      },
      {
        question: 'Which signal would bees most likely use for flowers just outside the hive?',
        options: ['A very long waggle run', 'The round dance', 'No signal at all'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'form-b',
    lang: 'en',
    form: 'B',
    title: 'How Lighthouses Guided Ships',
    paragraphs: [
      'For thousands of years, sailors feared the moment when land came close. Rocks hidden under the water, sandbanks and narrow harbour entrances could wreck a ship in seconds, especially at night. Lighthouses were built to warn them of these dangers and to help them find a safe way in.',
      'The earliest lighthouses were simply fires lit on hilltops or on top of towers. Later, keepers burned candles and oil lamps behind glass. These lights were weak, and a ship often could not see them until it was already in danger.',
      'A great improvement came in the 1820s, when the French engineer Augustin-Jean Fresnel designed a new kind of lens. Instead of one thick, heavy piece of glass, his lens used rings of glass prisms arranged around the lamp. The prisms bent the light into a single strong beam. With a Fresnel lens, a lighthouse could be seen from more than thirty kilometres away.',
      'Seeing a light was not enough, however. A sailor also needed to know which lighthouse it was, because that told him exactly where he was on the coast. So each lighthouse was given its own pattern, called its characteristic. One might flash every five seconds, another might show two quick flashes and a pause, and a third might shine steadily. Sailors carried lists of these patterns and checked them against what they saw.',
      'During the day, a light is hard to notice, so many towers were painted with bold stripes or bands of colour. In thick fog, when no light could be seen at all, some stations used loud fog horns instead.',
      'For most of their history, lighthouses needed keepers who lived beside them and tended the lamp every night. Today, nearly all lighthouses run automatically, and ships also use satellite navigation. Even so, many lights still shine, because a clear signal from the shore remains a useful backup.',
    ],
    questions: [
      {
        question: 'Who designed the lens that made lighthouses much brighter?',
        options: ['A lighthouse keeper', 'Augustin-Jean Fresnel', 'An ancient Greek builder'],
        correctIndex: 1,
      },
      {
        question: 'How did the Fresnel lens make the light stronger?',
        options: ['Rings of prisms bent the light into one beam', 'It used a much bigger fire', 'It was one thick piece of glass'],
        correctIndex: 0,
      },
      {
        question: 'What is a lighthouse’s “characteristic”?',
        options: ['The colour of its tower', 'The name of its keeper', 'Its own pattern of light'],
        correctIndex: 2,
      },
      {
        question: 'Why did sailors need to know which lighthouse they were seeing?',
        options: ['To know how old it was', 'To know where they were on the coast', 'To choose the harbour with the best food'],
        correctIndex: 1,
      },
      {
        question: 'Why do many lighthouses still shine even though ships use satellite navigation?',
        options: ['They are a useful backup', 'Satellite navigation does not work at night', 'Keepers still live in all of them'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'form-a-hi',
    lang: 'hi',
    form: 'A',
    title: 'मधुमक्खियां रास्ता कैसे बताती हैं',
    paragraphs: [
      'जब किसी मधुमक्खी को फूलों से भरी अच्छी जगह मिलती है, तो उसके सामने एक मुश्किल होती है। फूल छत्ते से एक किलोमीटर से भी ज़्यादा दूर हो सकते हैं, और बाकी मधुमक्खियां उन्हें देख नहीं सकतीं। फिर भी कुछ ही मिनटों में बहुत-सी मधुमक्खियां उन्हीं फूलों तक पहुंच जाती हैं। उन्हें रास्ता कैसे पता चलता है?',
      'इसका जवाब बीसवीं सदी में ऑस्ट्रिया के वैज्ञानिक कार्ल फ़ॉन फ़्रिश ने खोजा। इस काम के लिए उन्हें बाद में नोबेल पुरस्कार भी मिला। उन्होंने कई साल कांच की दीवार वाले छत्तों में मधुमक्खियों को ध्यान से देखा। उन्होंने पाया कि भोजन लेकर लौटी मधुमक्खी अक्सर छत्ते की दीवार पर एक ख़ास तरह से हिलती-डुलती है। उन्होंने इसे “वैगल डांस” यानी हिलने वाला नाच कहा।',
      'इस नाच में मधुमक्खी अपना शरीर दाएं-बाएं हिलाते हुए एक सीधी रेखा में आगे चलती है। फिर वह घूमकर वापस आती है और यही दौड़ बार-बार दोहराती है। सीधी दौड़ की दिशा बाकी मधुमक्खियों को बताती है कि किस ओर उड़ना है। अंधेरे छत्ते के अंदर, छत्ते पर सीधे ऊपर की दिशा का मतलब है सूरज की दिशा। अगर मधुमक्खी सीधे ऊपर की ओर दौड़ती है, तो भोजन सूरज की ओर है। अगर वह ऊपर से थोड़ा दाईं ओर तिरछी दौड़ती है, तो भोजन भी सूरज से उतना ही दाईं ओर है।',
      'हिलते हुए दौड़ने की लंबाई एक दूसरा संदेश देती है: दूरी। जितनी लंबी दौड़, फूल उतने ही दूर। छत्ते के बहुत पास के भोजन के लिए मधुमक्खियां इसकी जगह गोल-गोल घूमने वाला एक आसान नाच करती हैं, जिसे कभी-कभी “राउंड डांस” कहा जाता है।',
      'नाचने वाली मधुमक्खी के शरीर पर फूलों की ख़ुशबू भी होती है, और देखने वाली मधुमक्खियां उसके लाए रस को चखकर भी देख सकती हैं। दिशा, दूरी और गंध — ये तीनों मिलकर उन्हें ख़ुद फूलों तक पहुंचने के लिए काफ़ी जानकारी दे देते हैं।',
      'मधुमक्खियां ऐसा ही नाच एक और ज़रूरी काम के लिए भी करती हैं। जब किसी झुंड को नया घर चाहिए होता है, तो खोजी मधुमक्खियां खोखले पेड़ और दूसरी सुरक्षित जगहें ढूंढती हैं, और सबसे अच्छी जगहों की ख़बर नाचकर देती हैं।',
    ],
    questions: [
      { question: 'वैगल डांस कैसे काम करता है, यह किसने पता लगाया?', options: ['कार्ल फ़ॉन फ़्रिश ने', 'फ़्रांस के एक इंजीनियर ने', 'नोबेल पुरस्कार समिति ने'], correctIndex: 0 },
      { question: 'नाच में छत्ते पर सीधे ऊपर की ओर दौड़ने का क्या मतलब है?', options: ['सूरज से उल्टी दिशा में उड़ो', 'सूरज की ओर उड़ो', 'भोजन बहुत पास है'], correctIndex: 1 },
      { question: 'लंबी दौड़ बाकी मधुमक्खियों को क्या बताती है?', options: ['फूल ज़्यादा हैं', 'फूल बाईं ओर हैं', 'फूल ज़्यादा दूर हैं'], correctIndex: 2 },
      { question: 'देखने वाली मधुमक्खियों के लिए लाए गए रस को चखना क्यों काम का है?', options: ['ताकि वे सही फूल पहचान सकें', 'ताकि पता चले कि नाचने वाली उनके छत्ते की है', 'ताकि वे जल्दी शहद बना सकें'], correctIndex: 0 },
      { question: 'छत्ते के ठीक बाहर के फूलों के लिए मधुमक्खियां शायद कौन-सा संकेत देंगी?', options: ['बहुत लंबी दौड़', 'गोल-गोल घूमने वाला नाच', 'कोई संकेत नहीं'], correctIndex: 1 },
    ],
  },
  {
    id: 'form-b-hi',
    lang: 'hi',
    form: 'B',
    title: 'लाइटहाउस जहाज़ों को रास्ता कैसे दिखाते थे',
    paragraphs: [
      'हज़ारों सालों तक नाविक उस पल से डरते थे जब ज़मीन पास आने लगती थी। पानी के नीचे छिपी चट्टानें, रेत के टीले और बंदरगाह के संकरे रास्ते पल भर में जहाज़ को तोड़ सकते थे, ख़ासकर रात में। लाइटहाउस इन्हीं ख़तरों से सावधान करने और सुरक्षित रास्ता दिखाने के लिए बनाए गए।',
      'सबसे पुराने लाइटहाउस बस पहाड़ियों या मीनारों के ऊपर जलाई गई आग होते थे। बाद में रखवाले कांच के पीछे मोमबत्तियां और तेल के दीये जलाने लगे। ये रोशनियां कमज़ोर थीं, और अक्सर जहाज़ को ये तब दिखती थीं जब वह पहले ही ख़तरे में पहुंच चुका होता था।',
      'बड़ा सुधार 1820 के दशक में आया, जब फ़्रांस के इंजीनियर ऑगस्टिन-जीन फ़्रेनेल ने एक नए तरह का लेंस बनाया। कांच के एक मोटे, भारी टुकड़े की जगह उनके लेंस में दीये के चारों ओर कांच के प्रिज़्म के छल्ले लगे थे। ये प्रिज़्म रोशनी को मोड़कर एक तेज़ किरण बना देते थे। फ़्रेनेल लेंस वाला लाइटहाउस तीस किलोमीटर से भी ज़्यादा दूर से दिख सकता था।',
      'लेकिन सिर्फ़ रोशनी दिख जाना काफ़ी नहीं था। नाविक को यह भी जानना होता था कि वह कौन-सा लाइटहाउस है, क्योंकि इससे उसे पता चलता था कि वह तट पर ठीक कहां है। इसलिए हर लाइटहाउस को रोशनी का अपना एक ढंग दिया गया, जिसे उसकी “पहचान” कहा जाता है। कोई हर पांच सेकंड में चमकता, कोई दो बार जल्दी चमककर रुकता, और कोई लगातार जलता रहता। नाविक इन ढंगों की सूची साथ रखते थे और जो दिखता, उससे मिलाते थे।',
      'दिन में रोशनी पर ध्यान जाना मुश्किल होता है, इसलिए कई मीनारों पर चौड़ी धारियां या रंगीन पट्टियां पेंट की जाती थीं। घने कोहरे में, जब कोई रोशनी दिखती ही नहीं थी, कुछ जगहों पर तेज़ आवाज़ वाले भोंपू बजाए जाते थे।',
      'अपने ज़्यादातर इतिहास में लाइटहाउस को ऐसे रखवालों की ज़रूरत रही जो पास ही रहते थे और हर रात दीया संभालते थे। आज लगभग सभी लाइटहाउस अपने-आप चलते हैं, और जहाज़ सैटेलाइट नेविगेशन का भी इस्तेमाल करते हैं। फिर भी कई रोशनियां आज भी जलती हैं, क्योंकि किनारे से मिलने वाला साफ़ संकेत एक काम का सहारा बना रहता है।',
    ],
    questions: [
      { question: 'किसने वह लेंस बनाया जिससे लाइटहाउस बहुत ज़्यादा चमकदार हो गए?', options: ['एक लाइटहाउस रखवाले ने', 'ऑगस्टिन-जीन फ़्रेनेल ने', 'एक प्राचीन यूनानी कारीगर ने'], correctIndex: 1 },
      { question: 'फ़्रेनेल लेंस रोशनी को तेज़ कैसे बनाता था?', options: ['प्रिज़्म के छल्ले रोशनी को मोड़कर एक किरण बना देते थे', 'इसमें बहुत बड़ी आग जलती थी', 'यह कांच का एक मोटा टुकड़ा था'], correctIndex: 0 },
      { question: 'लाइटहाउस की “पहचान” किसे कहा जाता है?', options: ['उसकी मीनार का रंग', 'उसके रखवाले का नाम', 'उसकी रोशनी का अपना ढंग'], correctIndex: 2 },
      { question: 'नाविकों को यह जानना क्यों ज़रूरी था कि उन्हें कौन-सा लाइटहाउस दिख रहा है?', options: ['यह जानने के लिए कि वह कितना पुराना है', 'यह जानने के लिए कि वे तट पर कहां हैं', 'सबसे अच्छे खाने वाला बंदरगाह चुनने के लिए'], correctIndex: 1 },
      { question: 'जहाज़ सैटेलाइट नेविगेशन इस्तेमाल करते हैं, फिर भी कई लाइटहाउस आज भी क्यों जलते हैं?', options: ['वे एक काम का सहारा हैं', 'सैटेलाइट नेविगेशन रात में काम नहीं करता', 'सभी में आज भी रखवाले रहते हैं'], correctIndex: 0 },
    ],
  },
]

export function countWords(passage: AssessmentPassage): number {
  return passage.paragraphs.join(' ').split(/\s+/).filter((word) => word.length > 0).length
}

export function getAssessmentPassage(id: string): AssessmentPassage | null {
  return ASSESSMENT_PASSAGES.find((passage) => passage.id === id) ?? null
}

/** Day 1 uses Form A in the chosen language; Day 30 uses the other form in Day 1's language. */
export function passageForStage(stage: 'day1' | 'day30', day1PassageId: string | null, lang: AssessmentLang = 'en'): AssessmentPassage {
  const day1Passage = day1PassageId === null ? null : getAssessmentPassage(day1PassageId)
  const passageLang = stage === 'day30' && day1Passage !== null ? day1Passage.lang : lang
  const form = stage === 'day1' ? 'A' : day1Passage?.form === 'B' ? 'A' : 'B'
  const found = ASSESSMENT_PASSAGES.find((passage) => passage.lang === passageLang && passage.form === form)
  if (found === undefined) throw new Error(`No assessment passage for ${passageLang}/${form}`)
  return found
}
