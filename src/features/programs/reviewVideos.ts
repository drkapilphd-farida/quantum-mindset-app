import type { Bi, ProgramSlug } from './types'
import type { ThumbFrame } from '@/lib/video/reviewFrames'

// Review videos for Personal Sessions (owner's strict reviews brief, Nov 2026,
// plus the three videos he added back). IDs, types, English captions and
// placement exactly as given; Hindi written from each "Original" line.
// Long videos (L) open from a 16:9 card, Shorts (S) from a 9:16 card.

export type ReviewTopic = 'telepathy' | 'cosmic' | 'ksa' | 'mind' | 'retreat' | 'intuition'

/** thumbFrame: which in-video frame the card shows — hq1 (25%), hq2 (50%, default) or hq3 (75%). Owner, Nov 2026. */
export type ReviewVideo = { id: string; type: 'L' | 'S'; caption: Bi; topics: ReviewTopic[]; thumbFrame?: ThumbFrame }

/** /reviews filter chips, in the owner's order ("All" first). */
export const REVIEW_CHIPS: { id: ReviewTopic | 'all'; label: Bi }[] = [
  { id: 'all', label: { en: 'All', hi: 'सब' } },
  { id: 'telepathy', label: { en: 'Telepathy', hi: 'टेलीपैथी' } },
  { id: 'cosmic', label: { en: 'Cosmic Fusion & Meditation', hi: 'कॉस्मिक फ्यूज़न और मेडिटेशन' } },
  { id: 'ksa', label: { en: 'Kundalini, Samadhi & Astral', hi: 'कुंडलिनी, समाधि और एस्ट्रल' } },
  { id: 'mind', label: { en: 'Mind & Confidence', hi: 'मन और आत्मविश्वास' } },
  { id: 'retreat', label: { en: 'Retreat', hi: 'रिट्रीट' } },
  { id: 'intuition', label: { en: 'Intuition', hi: 'इनट्यूशन' } },
]

/** Topic tag under a video: its first topic, or "Personal Sessions" for general reviews. */
export function topicTag(video: ReviewVideo): Bi {
  const first = video.topics[0]
  return first === undefined ? { en: 'Personal Sessions', hi: 'पर्सनल सेशन' } : (REVIEW_CHIPS.find((c) => c.id === first)?.label ?? { en: 'Personal Sessions', hi: 'पर्सनल सेशन' })
}

export const REVIEW_LINE: Bi = {
  en: "Individual experiences of past participants. Every person's experience is different.",
  hi: 'पिछले प्रतिभागियों के व्यक्तिगत अनुभव। हर व्यक्ति का अनुभव अलग होता है।',
}

// To switch a video's thumbnail frame, add it as the last argument: v(id, type, en, hi, topics, 1) or (…, 3).
const v = (id: string, type: 'L' | 'S', en: string, hi: string, topics: ReviewTopic[] = [], thumbFrame?: ThumbFrame): ReviewVideo => ({ id, type, caption: { en, hi }, topics, ...(thumbFrame !== undefined ? { thumbFrame } : {}) })

/** Master list, in the owner's order (74 from the brief + 3 added back). */
export const REVIEW_VIDEOS: readonly ReviewVideo[] = [
  v('eFskqwYdrw4', 'L', 'Unfiltered reviews from participants', 'प्रतिभागियों के बिना किसी फ़िल्टर के रिव्यू'),
  v('h6KiUZKXqKM', 'L', 'Telepathy gave us direct proof. Sir explains complicated things in a very simple way.', 'यहाँ टेलीपैथी से सीधा प्रमाण मिलता है। सर उलझी हुई बातों को बहुत आसान तरीके से समझा देते हैं।', ['telepathy']),
  v('uir34_yIUGo', 'L', 'Telepathy is not magic — but it\'s no less than magic.', 'टेलीपैथी जादू नहीं है — लेकिन जादू से कम भी नहीं है।', ['telepathy']),
  v('KJXvSaGjHJk', 'L', 'Now I can do telepathy very easily.', 'अब मैं टेलीपैथी बहुत आसानी से कर सकता हूँ।', ['telepathy']),
  v('pRG3sdsXiHM', 'L', 'Dr. Sharma is a scientist who is still open to spirituality.', 'डॉ. शर्मा एक बेहतरीन वैज्ञानिक हैं, फिर भी आध्यात्मिकता के लिए खुले हैं।', ['telepathy']),
  v('WZMSSuRTr78', 'L', "Sir's program is 100% authentic.", 'सर का प्रोग्राम 100% प्रामाणिक है।', ['cosmic']),
  v('Z5v-1ms8j8c', 'L', 'I did many workshops, but only here I learned what my mind can do. I found what I was searching for, for years.', 'मैंने बहुत-सी वर्कशॉप कीं, पर मेरा मन क्या कर सकता है, यह यहीं सीखा। जो मैं सालों से ढूँढ रही थी, वह यहाँ मिला।', ['mind']),
  v('NubHGGlQdo8', 'L', "Sir taught me what I hadn't learned even by the age of 50.", 'सर ने वह सिखाया जो मैंने 50 साल की उम्र तक भी नहीं सीखा था।', ['retreat']),
  v('LxZC82BlYiM', 'L', 'Everything here is practical, and it benefits everyone.', 'यहाँ सब कुछ प्रैक्टिकल होता है, और इससे सबको फ़ायदा होता है।', [], 3),
  v('LF4aKFnk6eo', 'L', 'My confidence has grown with this program.', 'इस प्रोग्राम से मेरा आत्मविश्वास बढ़ गया है।', ['mind']),
  v('m8eJQ63XGtI', 'L', "It's unique because it's all practical.", 'यह अनोखा है, क्योंकि इसमें सब कुछ प्रैक्टिकल है।'),
  v('_1A-vR9f9oo', 'L', 'A live astral travel experience.', 'एस्ट्रल ट्रैवल का लाइव अनुभव।', ['ksa']),
  v('sQ6n0Dwv96w', 'L', 'I received many times more than I expected.', 'जो सोचा था, उससे कई गुना ज़्यादा मिला।'),
  v('M4Pl9PhdFZs', 'L', 'I experienced deep meditation and my chakras here.', 'मैंने यहाँ गहरे मेडिटेशन और अपने चक्रों का अनुभव किया।', ['cosmic']),
  v('1FO8UVfxJ9I', 'L', 'I was under stress, and my stress went away completely.', 'मैं तनाव में था, और मेरा तनाव पूरी तरह चला गया।', ['mind']),
  v('BVnd8arxtvE', 'L', 'Astral projection, samadhi and kundalini — what I was searching for, I found here.', 'एस्ट्रल प्रोजेक्शन, समाधि और कुंडलिनी — जो मैं ढूँढ रहा था, वह मुझे यहाँ मिला।', ['ksa']),
  v('ZyD_iQTOR60', 'L', 'Every person should learn this from childhood.', 'हर इंसान को यह बचपन से सीखना चाहिए।', ['retreat']),
  v('lqepnUkMQSk', 'L', 'I found answers to many doubts and unresolved life questions. I could understand myself.', 'मुझे अपने बहुत-से संदेहों और ज़िंदगी के अनसुलझे सवालों के जवाब मिले। मैं ख़ुद को समझ पाया।', ['mind']),
  v('r87Klz1GkAE', 'L', 'I learned kundalini awakening and experienced samadhi meditation. Here I discovered what we are capable of.', 'मैंने कुंडलिनी जागरण सीखा और समाधि मेडिटेशन का अनुभव किया। यहाँ मैंने जाना कि हम क्या-क्या कर सकते हैं।', ['ksa']),
  v('vbNGdtGRxeQ', 'L', 'What I found here was even better than what I had heard.', 'मैंने जो सुना था, यहाँ उससे भी अच्छा पाया।', ['retreat']),
  v('KonjolUeSdw', 'L', 'A Jain Sadhvi ji shares her experience of meditation.', 'एक जैन साध्वी जी ध्यान का अपना अनुभव बताती हैं।', ['cosmic']),
  v('oNCTzab8zdc', 'L', 'Here you learn the secret knowledge, the art and the science — all three.', 'यहाँ गुप्त विद्या, कला और विज्ञान — तीनों सीखने को मिलते हैं।'),
  v('9JNC7Djvl7Y', 'L', 'My vision was small; here it became much bigger.', 'मेरा विज़न छोटा था; यहाँ आकर बहुत बड़ा हो गया।', ['mind']),
  v('X66b3WfrsZw', 'L', "What I didn't find in 62 years, I found here.", 'जो मुझे 62 साल में नहीं मिला, वह यहाँ मिल गया।', ['retreat']),
  v('Dp2aE_-aZ0g', 'L', 'We had no direction. We found our direction here.', 'हम दिशाहीन थे। यहाँ हमें दिशा मिल गई।', ['retreat', 'mind']),
  v('AQP2r2GNuME', 'S', "A participant's review", 'एक प्रतिभागी का रिव्यू'),
  v('5Hmett2wc-E', 'S', 'Change in my personal and professional life.', 'मेरी निजी और प्रोफ़ेशनल ज़िंदगी में बदलाव।', ['mind']),
  v('hpF2_DmvvFQ', 'S', 'Personal, professional and self-improvement.', 'निजी, प्रोफ़ेशनल और आत्म-सुधार।', ['mind']),
  v('tJeh1r9TG3c', 'S', 'I could learn astral projection and telepathy.', 'मैं एस्ट्रल प्रोजेक्शन और टेलीपैथी सीख पाया।', ['ksa', 'telepathy']),
  v('iNz45u5sUl8', 'S', 'My Cosmic Fusion experience.', 'मेरा कॉस्मिक फ्यूज़न अनुभव।', ['cosmic']),
  v('4Qiz0rkpTwc', 'S', 'A deep experience of meditation.', 'मेडिटेशन का एक गहरा अनुभव।', ['cosmic']),
  v('TG4grL3AnDw', 'S', 'Kundalini and astral projection.', 'कुंडलिनी और एस्ट्रल प्रोजेक्शन।', ['ksa']),
  v('QjoJl5R0bBk', 'S', 'I came to know myself in 7 days.', '7 दिन में मैंने ख़ुद को पहचाना।', ['retreat', 'mind']),
  v('gsBtKN9K08M', 'S', 'Telepathy, astral projection, samadhi and kundalini meditation.', 'टेलीपैथी, एस्ट्रल प्रोजेक्शन, समाधि और कुंडलिनी मेडिटेशन।', ['telepathy', 'ksa']),
  v('8a3vd3ep7QY', 'S', 'My astral projection experience.', 'मेरा एस्ट्रल प्रोजेक्शन अनुभव।', ['ksa']),
  v('9Heb6Hk9ANE', 'S', 'I felt my own powers through this program.', 'इस प्रोग्राम से मैंने अपनी शक्तियों को महसूस किया।'),
  v('sNRqXSD_xrk', 'S', 'We understood what we really are.', 'हमने समझा कि हम असल में क्या हैं।'),
  v('Go9QZBTDeO8', 'S', 'I could feel myself connecting with cosmic energy.', 'मैं ख़ुद को कॉस्मिक ऊर्जा से जुड़ता हुआ महसूस कर पाया।', ['cosmic']),
  v('VA_IKWt4f2g', 'S', 'I experienced mind-to-mind communication.', 'मैंने मन से मन तक संवाद का अनुभव किया।', ['telepathy']),
  v('4Pde6v_k99E', 'S', 'This program cleared all my doubts.', 'इस प्रोग्राम ने मेरे सारे संदेह दूर कर दिए।'),
  v('pGI-uSBNOIc', 'S', 'It cleared all my doubts about meditation and tratak.', 'इससे मेडिटेशन और त्राटक के बारे में मेरे सारे संदेह दूर हो गए।', ['cosmic']),
  v('x6AQjr6UQzw', 'S', 'Telepathy and visualisation became clear to me here.', 'यहाँ आकर टेलीपैथी और विज़ुअलाइज़ेशन मुझे साफ़ समझ आए।', ['telepathy']),
  v('yQzvY-YDaM0', 'S', 'A meditation experience like never before.', 'मेडिटेशन का ऐसा अनुभव जैसा पहले कभी नहीं हुआ।', ['cosmic']),
  v('iHOJgWQwkFk', 'S', 'My spiritual practice found a new direction.', 'मेरी आध्यात्मिक साधना को एक नई दिशा मिली।', ['cosmic']),
  v('jeUEhSCwVnE', 'S', 'I felt the energy of the universe at my crown.', 'मैंने अपने सिर के शीर्ष पर ब्रह्मांड की ऊर्जा महसूस की।', ['cosmic']),
  v('w7Vb6HGJBsE', 'S', 'A very nice experience of crown chakra and Cosmic Fusion meditation. I learned many mind techniques.', 'क्राउन चक्र और कॉस्मिक फ्यूज़न मेडिटेशन का बहुत अच्छा अनुभव। मैंने मन की कई तकनीकें सीखीं।', ['cosmic']),
  v('aim4MUBT8oY', 'S', 'I found change in my life. I learned a lot and did telepathy.', 'मुझे अपनी ज़िंदगी में बदलाव मिला। बहुत कुछ जानने को मिला और मैंने टेलीपैथी की।', ['telepathy']),
  v('iDQ2YxNqbR8', 'S', 'I experienced that I am only vibration.', 'मैंने अनुभव किया कि मैं सिर्फ़ एक कंपन हूँ।', ['cosmic']),
  v('uT5qpNc2-zg', 'S', 'I strengthened my intuition here.', 'मैंने यहाँ अपना इनट्यूशन मज़बूत किया।', ['intuition']),
  v('Bhy5pGinK_U', 'S', 'I experienced telepathy here.', 'मैंने यहाँ टेलीपैथी का अनुभव किया।', ['telepathy']),
  v('s87Pxs0EP58', 'S', 'His meditation is really very good.', 'इनका मेडिटेशन तो सच में बहुत अच्छा है।', ['cosmic']),
  v('nPbPbWTlVpg', 'S', 'This program is beneficial for everyone.', 'यह प्रोग्राम सभी के लिए फ़ायदेमंद है।'),
  v('otIFQVpc-RQ', 'S', 'I was mentally disturbed. After the program I feel very well.', 'मैं मानसिक रूप से परेशान था। प्रोग्राम के बाद मैं एकदम अच्छा महसूस करता हूँ।', ['mind']),
  v('8UqjrPzSbHE', 'S', "What I couldn't understand through NLP, I found here.", 'जो NLP से समझ नहीं आया, वह यहाँ मिला।', ['mind']),
  v('JZ3U_nRXH5k', 'S', 'I experienced third-eye power and telepathy. Now I can feel and see energy.', 'मैंने तीसरी आँख की शक्ति और टेलीपैथी का अनुभव किया। अब मैं ऊर्जा को महसूस कर सकती हूँ और देख सकती हूँ।', ['telepathy']),
  v('ExyW7mnHW0w', 'S', 'I learned more than I expected.', 'जो सोचा था, उससे ज़्यादा सीखने को मिला।'),
  v('Nji0LLBwhtc', 'S', 'A life-changing program — everyone should do it.', 'यह ज़िंदगी बदल देने वाला प्रोग्राम है — सबको करना चाहिए।'),
  v('BKu4PCtrnpk', 'S', 'I experienced telepathy.', 'मैंने टेलीपैथी का अनुभव किया।', ['telepathy']),
  v('SPD1x72viiU', 'S', 'I feel ten times more confident now.', 'अब मैं दस गुना ज़्यादा आत्मविश्वास महसूस करता हूँ।', ['mind']),
  v('8dA1C5bzI28', 'S', 'Rather than wandering here and there, do this program.', 'इधर-उधर भटकने से अच्छा है, यह प्रोग्राम कीजिए।'),
  v('xtpJZtfwrug', 'S', 'This program awakened my energy and inner senses.', 'इस प्रोग्राम ने मेरी ऊर्जा और भीतरी इंद्रियों को जगा दिया।'),
  v('2OH8qtVSQ3E', 'S', 'I experienced and learned telepathy and intuition here.', 'मैंने यहाँ टेलीपैथी और इनट्यूशन का अनुभव किया और सीखा।', ['telepathy', 'intuition']),
  v('QwMZfl9jLvA', 'S', "What people don't learn in years, I learned in a few days. If I can do it, anyone can.", 'जो लोग सालों में नहीं सीखते, वह मैंने कुछ दिनों में सीखा। अगर मैं कर सकती हूँ, तो कोई भी कर सकता है।'),
  v('-Y-EYH6jnnI', 'S', 'Through telepathy I sent my thoughts to others.', 'टेलीपैथी से मैंने अपने विचार दूसरों तक भेजे।', ['telepathy']),
  v('kPhGbEiZUXY', 'S', 'This program is a real experience of quantum physics.', 'यह प्रोग्राम क्वांटम फ़िज़िक्स का असली अनुभव है।', ['cosmic']),
  v('Dwdxr0G5-EI', 'S', 'I loved learning telepathy.', 'टेलीपैथी सीखना मुझे बहुत अच्छा लगा।', ['telepathy']),
  v('v0s6Wc7UGk4', 'S', 'I liked the intuition power the most.', 'मुझे इनट्यूशन की शक्ति सबसे ज़्यादा अच्छी लगी।', ['intuition']),
  v('t5JzaLTptrI', 'S', 'It was life-changing for me. I learned a lot.', 'यह मेरे लिए ज़िंदगी बदल देने वाला था। मैंने बहुत कुछ सीखा।'),
  v('SwCtIyx5yUw', 'S', 'I experienced telepathy.', 'मैंने टेलीपैथी का अनुभव किया।', ['telepathy']),
  v('R6f1_LEWOMs', 'S', 'I would love to do this course again and again.', 'मैं यह कोर्स बार-बार करना चाहूँगी।', [], 3),
  v('2fqhU92lIWM', 'S', 'This program is both spiritual and scientific.', 'यह प्रोग्राम आध्यात्मिक भी है और वैज्ञानिक भी।'),
  v('mG5zL3jRGWw', 'S', 'I had all these experiences myself.', 'ये सारे अनुभव मैंने ख़ुद किए हैं।'),
  v('rT4IehlpUWc', 'S', 'Sir is a very high-level intellectual and spiritual person.', 'सर बहुत ऊँचे स्तर के बौद्धिक और आध्यात्मिक व्यक्ति हैं।'),
  v('6ug_qgbx47w', 'S', 'Live telepathy practice.', 'टेलीपैथी का लाइव अभ्यास।', ['telepathy']),
  v('zAqVF7Z37DI', 'S', "I could read another person's mind and receive their messages.", 'मैं दूसरे का मन पढ़ पाई और उनके संदेश ग्रहण कर पाई।', ['telepathy']),
  v('_fx5kcPThEs', 'S', 'Here I sent and received messages through telepathy.', 'यहाँ मैंने टेलीपैथी से संदेश भेजे और ग्रहण किए।', ['telepathy']),
  v('fuJTgbqFn3w', 'S', "Sir's telepathy course is special — detailed and practical.", 'सर का टेलीपैथी कोर्स ख़ास है — विस्तार से और प्रैक्टिकल।', ['telepathy']),
  // Added back by the owner (Nov 2026).
  v('uNWLFqACpDU', 'S', 'An awesome session of meditation and sadhana.', 'मेडिटेशन और साधना का एक शानदार सेशन।', ['cosmic']),
  v('Tf1zH0uHW_k', 'S', 'This program is very good for health and well-being.', 'यह प्रोग्राम सेहत और सुकून के लिए बहुत अच्छा है।', ['cosmic']),
  v('nwyXXshYg3Y', 'S', 'By connecting with the universe, I feel well again.', 'ब्रह्मांड से जुड़कर मैं फिर से अच्छा महसूस करता हूँ।', ['cosmic']),
]

const BY_ID = new Map(REVIEW_VIDEOS.map((r) => [r.id, r]))

export function reviewVideo(id: string): ReviewVideo {
  const video = BY_ID.get(id)
  if (video === undefined) throw new Error(`Unknown review video: ${id}`)
  return video
}

/** Placement: first 3 = large cards, the rest = sideways row (owner's table). */
export const HUB_REVIEWS: string[] = ['eFskqwYdrw4', 'h6KiUZKXqKM', 'X66b3WfrsZw', 'Z5v-1ms8j8c', '1FO8UVfxJ9I', 'WZMSSuRTr78', 'Nji0LLBwhtc', 'QwMZfl9jLvA']

export const PROGRAM_REVIEWS: Record<ProgramSlug, string[]> = {
  telepathy: ['h6KiUZKXqKM', 'uir34_yIUGo', 'KJXvSaGjHJk', 'VA_IKWt4f2g', 'zAqVF7Z37DI', '_fx5kcPThEs', '-Y-EYH6jnnI', '6ug_qgbx47w', 'fuJTgbqFn3w', 'Bhy5pGinK_U', 'x6AQjr6UQzw', 'Dwdxr0G5-EI', 'BKu4PCtrnpk', 'SwCtIyx5yUw', 'pRG3sdsXiHM'],
  'cosmic-fusion': ['WZMSSuRTr78', 'Go9QZBTDeO8', 'jeUEhSCwVnE', 'iNz45u5sUl8', 'w7Vb6HGJBsE', 'iDQ2YxNqbR8', 'kPhGbEiZUXY', 'Tf1zH0uHW_k', 'nwyXXshYg3Y'],
  manifestation: ['Go9QZBTDeO8', '9JNC7Djvl7Y', 'kPhGbEiZUXY', 'iDQ2YxNqbR8', 'aim4MUBT8oY'],
  'heart-brain-coherence': ['1FO8UVfxJ9I', 'SPD1x72viiU', 'LF4aKFnk6eo'],
  'intuition-for-traders': ['uT5qpNc2-zg', 'v0s6Wc7UGk4', '2OH8qtVSQ3E'],
  'stress-anxiety-support': ['1FO8UVfxJ9I', 'otIFQVpc-RQ', '4Qiz0rkpTwc'],
  'mindset-coaching': ['SPD1x72viiU', 'LF4aKFnk6eo', '5Hmett2wc-E', 'hpF2_DmvvFQ', '9JNC7Djvl7Y', 't5JzaLTptrI'],
  'subconscious-reprogramming': ['lqepnUkMQSk', '8UqjrPzSbHE', 'QjoJl5R0bBk', 'sNRqXSD_xrk', '4Pde6v_k99E'],
  'business-loss-mindset': ['Dp2aE_-aZ0g', '9JNC7Djvl7Y', '5Hmett2wc-E'],
  'aura-reading': ['JZ3U_nRXH5k', 'xtpJZtfwrug', '9Heb6Hk9ANE'],
  'chakra-activation': ['M4Pl9PhdFZs', 'w7Vb6HGJBsE', 'xtpJZtfwrug', 'jeUEhSCwVnE'],
  'samadhi-meditation': ['r87Klz1GkAE', 'KonjolUeSdw', 'yQzvY-YDaM0', 'gsBtKN9K08M', '4Qiz0rkpTwc', 's87Pxs0EP58', 'pGI-uSBNOIc', 'uNWLFqACpDU'],
  'kundalini-meditation': ['r87Klz1GkAE', 'BVnd8arxtvE', 'TG4grL3AnDw', 'gsBtKN9K08M'],
  'astral-projection': ['_1A-vR9f9oo', 'BVnd8arxtvE', '8a3vd3ep7QY', 'tJeh1r9TG3c', 'TG4grL3AnDw', 'gsBtKN9K08M'],
  'personal-retreat': ['ZyD_iQTOR60', 'X66b3WfrsZw', 'NubHGGlQdo8', 'vbNGdtGRxeQ', 'Dp2aE_-aZ0g', 'QjoJl5R0bBk'],
}
