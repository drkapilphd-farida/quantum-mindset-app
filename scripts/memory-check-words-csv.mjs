// Writes docs/translations/memory-check-words.csv: the memory check's word
// lists (forms A and B) in all 8 app languages, for native-speaker review.
// EN + HI are what the app shows now; the other 6 are drafts and are NOT
// shown until reviewed (those learners use the English list meanwhile).
// Run: node scripts/memory-check-words-csv.mjs
import { writeFileSync } from 'node:fs'

const CATS = ['animal', 'food', 'home', 'nature', 'thing']
const EN = [
  'dog parrot camel frog cat lion goat deer cow monkey peacock rabbit horse elephant fish tiger',
  'mango onion honey egg banana rice lemon salt apple milk carrot sugar grapes potato tea bread',
  'chair mirror bucket key table spoon pillow clock door bottle broom plate window cup bed lamp',
  'river star stone grass tree cloud sand fire moon flower leaf forest mountain rain sea sun',
  'bus umbrella drum ring boat kite pen shirt train shoe ball bag bicycle cap book ship',
].map((l) => l.split(' '))
const L = {
  hi: [
    'कुत्ता तोता ऊँट मेंढक बिल्ली शेर बकरी हिरण गाय बंदर मोर खरगोश घोड़ा हाथी मछली बाघ',
    'आम प्याज़ शहद अंडा केला चावल नींबू नमक सेब दूध गाजर चीनी अंगूर आलू चाय रोटी',
    'कुर्सी आईना बाल्टी चाबी मेज़ चम्मच तकिया घड़ी दरवाज़ा बोतल झाड़ू थाली खिड़की कप पलंग दीपक',
    'नदी तारा पत्थर घास पेड़ बादल रेत आग चाँद फूल पत्ता जंगल पहाड़ बारिश समुद्र सूरज',
    'बस छाता ढोल अँगूठी नाव पतंग कलम कमीज़ रेलगाड़ी जूता गेंद थैला साइकिल टोपी किताब जहाज़',
  ],
  kn: [
    'ನಾಯಿ ಗಿಳಿ ಒಂಟೆ ಕಪ್ಪೆ ಬೆಕ್ಕು ಸಿಂಹ ಮೇಕೆ ಜಿಂಕೆ ಹಸು ಕೋತಿ ನವಿಲು ಮೊಲ ಕುದುರೆ ಆನೆ ಮೀನು ಹುಲಿ',
    'ಮಾವಿನಹಣ್ಣು ಈರುಳ್ಳಿ ಜೇನುತುಪ್ಪ ಮೊಟ್ಟೆ ಬಾಳೆಹಣ್ಣು ಅಕ್ಕಿ ನಿಂಬೆಹಣ್ಣು ಉಪ್ಪು ಸೇಬು ಹಾಲು ಗಜ್ಜರಿ ಸಕ್ಕರೆ ದ್ರಾಕ್ಷಿ ಆಲೂಗಡ್ಡೆ ಚಹಾ ರೊಟ್ಟಿ',
    'ಕುರ್ಚಿ ಕನ್ನಡಿ ಬಕೆಟ್ ಬೀಗದಕೈ ಮೇಜು ಚಮಚ ದಿಂಬು ಗಡಿಯಾರ ಬಾಗಿಲು ಬಾಟಲಿ ಪೊರಕೆ ತಟ್ಟೆ ಕಿಟಕಿ ಕಪ್ ಮಂಚ ದೀಪ',
    'ನದಿ ನಕ್ಷತ್ರ ಕಲ್ಲು ಹುಲ್ಲು ಮರ ಮೋಡ ಮರಳು ಬೆಂಕಿ ಚಂದ್ರ ಹೂವು ಎಲೆ ಕಾಡು ಬೆಟ್ಟ ಮಳೆ ಸಮುದ್ರ ಸೂರ್ಯ',
    'ಬಸ್ ಛತ್ರಿ ಡೋಲು ಉಂಗುರ ದೋಣಿ ಗಾಳಿಪಟ ಪೆನ್ನು ಅಂಗಿ ರೈಲು ಬೂಟು ಚೆಂಡು ಚೀಲ ಸೈಕಲ್ ಟೋಪಿ ಪುಸ್ತಕ ಹಡಗು',
  ],
  ta: [
    'நாய் கிளி ஒட்டகம் தவளை பூனை சிங்கம் ஆடு மான் பசு குரங்கு மயில் முயல் குதிரை யானை மீன் புலி',
    'மாம்பழம் வெங்காயம் தேன் முட்டை வாழைப்பழம் அரிசி எலுமிச்சை உப்பு ஆப்பிள் பால் கேரட் சர்க்கரை திராட்சை உருளைக்கிழங்கு தேநீர் ரொட்டி',
    'நாற்காலி கண்ணாடி வாளி சாவி மேசை கரண்டி தலையணை கடிகாரம் கதவு பாட்டில் துடைப்பம் தட்டு ஜன்னல் கோப்பை கட்டில் விளக்கு',
    'நதி நட்சத்திரம் கல் புல் மரம் மேகம் மணல் நெருப்பு நிலா பூ இலை காடு மலை மழை கடல் சூரியன்',
    'பேருந்து குடை மேளம் மோதிரம் படகு பட்டம் பேனா சட்டை ரயில் காலணி பந்து பை மிதிவண்டி தொப்பி புத்தகம் கப்பல்',
  ],
  te: [
    'కుక్క చిలుక ఒంటె కప్ప పిల్లి సింహం మేక జింక ఆవు కోతి నెమలి కుందేలు గుర్రం ఏనుగు చేప పులి',
    'మామిడిపండు ఉల్లిపాయ తేనె గుడ్డు అరటిపండు బియ్యం నిమ్మకాయ ఉప్పు ఆపిల్ పాలు క్యారెట్ చక్కెర ద్రాక్ష బంగాళాదుంప టీ రొట్టె',
    'కుర్చీ అద్దం బకెట్ తాళంచెవి బల్ల చెంచా దిండు గడియారం తలుపు సీసా చీపురు పళ్ళెం కిటికీ కప్పు మంచం దీపం',
    'నది నక్షత్రం రాయి గడ్డి చెట్టు మేఘం ఇసుక నిప్పు చంద్రుడు పువ్వు ఆకు అడవి కొండ వాన సముద్రం సూర్యుడు',
    'బస్సు గొడుగు డోలు ఉంగరం పడవ గాలిపటం పెన్ను చొక్కా రైలు బూటు బంతి సంచి సైకిల్ టోపీ పుస్తకం ఓడ',
  ],
  mr: [
    'कुत्रा पोपट उंट बेडूक मांजर सिंह बकरी हरीण गाय माकड मोर ससा घोडा हत्ती मासा वाघ',
    'आंबा कांदा मध अंडं केळं तांदूळ लिंबू मीठ सफरचंद दूध गाजर साखर द्राक्षं बटाटा चहा पोळी',
    'खुर्ची आरसा बादली चावी टेबल चमचा उशी घड्याळ दार बाटली झाडू ताट खिडकी कप पलंग दिवा',
    'नदी तारा दगड गवत झाड ढग वाळू आग चंद्र फूल पान जंगल डोंगर पाऊस समुद्र सूर्य',
    'बस छत्री ढोल अंगठी होडी पतंग पेन शर्ट रेल्वे बूट चेंडू पिशवी सायकल टोपी पुस्तक जहाज',
  ],
  gu: [
    'કૂતરો પોપટ ઊંટ દેડકો બિલાડી સિંહ બકરી હરણ ગાય વાંદરો મોર સસલું ઘોડો હાથી માછલી વાઘ',
    'કેરી ડુંગળી મધ ઈંડું કેળું ચોખા લીંબુ મીઠું સફરજન દૂધ ગાજર ખાંડ દ્રાક્ષ બટાકા ચા રોટલી',
    'ખુરશી અરીસો ડોલ ચાવી ટેબલ ચમચી ઓશીકું ઘડિયાળ દરવાજો બોટલ સાવરણી થાળી બારી કપ પલંગ દીવો',
    'નદી તારો પથ્થર ઘાસ ઝાડ વાદળ રેતી આગ ચંદ્ર ફૂલ પાંદડું જંગલ પર્વત વરસાદ દરિયો સૂરજ',
    'બસ છત્રી ઢોલ વીંટી હોડી પતંગ પેન શર્ટ ટ્રેન જૂતું દડો થેલી સાયકલ ટોપી પુસ્તક વહાણ',
  ],
  bn: [
    'কুকুর টিয়া উট ব্যাঙ বিড়াল সিংহ ছাগল হরিণ গরু বানর ময়ূর খরগোশ ঘোড়া হাতি মাছ বাঘ',
    'আম পেঁয়াজ মধু ডিম কলা চাল লেবু নুন আপেল দুধ গাজর চিনি আঙুর আলু চা রুটি',
    'চেয়ার আয়না বালতি চাবি টেবিল চামচ বালিশ ঘড়ি দরজা বোতল ঝাঁটা থালা জানালা কাপ খাট প্রদীপ',
    'নদী তারা পাথর ঘাস গাছ মেঘ বালি আগুন চাঁদ ফুল পাতা জঙ্গল পাহাড় বৃষ্টি সমুদ্র সূর্য',
    'বাস ছাতা ঢোল আংটি নৌকা ঘুড়ি কলম জামা ট্রেন জুতো বল ব্যাগ সাইকেল টুপি বই জাহাজ',
  ],
}
const LANGS = ['hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn']
const NOTES = {
  'hi:bread': 'roti', 'mr:bread': 'पोळी (roti)', 'ta:river': 'நதி, not ஆறு (which also means "six")',
  'ta:mirror': 'கண்ணாடி also means spectacles — OK?', 'kn:key': 'ಬೀಗದಕೈ — or ಕೀಲಿ?', 'mr:leaf': 'पान also means betel leaf — OK?',
}
const SETS = ['A – words to remember', 'A – unseen (recall grid)', 'B – words to remember', 'B – unseen (recall grid)']
const q = (s) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
const rows = [['id', 'form/set', 'kind', 'english', ...LANGS.map((l) => ({ hi: 'hindi (shown now)', kn: 'kannada (draft)', ta: 'tamil (draft)', te: 'telugu (draft)', mr: 'marathi (draft)', gu: 'gujarati (draft)', bn: 'bengali (draft)' })[l]), 'status', 'notes']]
EN.forEach((words, c) => {
  const split = Object.fromEntries(LANGS.map((l) => [l, L[l][c].split(' ')]))
  for (const l of LANGS) if (split[l].length !== 16) throw new Error(`${l} ${CATS[c]}: ${split[l].length} words`)
  words.forEach((en, i) => {
    const notes = LANGS.map((l) => NOTES[`${l}:${en}`] && `${l}: ${NOTES[`${l}:${en}`]}`).filter(Boolean).join('; ')
    rows.push([en, SETS[Math.floor(i / 4)], CATS[c], en, ...LANGS.map((l) => split[l][i]), 'pending', notes])
  })
})
for (const l of LANGS) {
  const all = rows.slice(1).map((r) => r[4 + LANGS.indexOf(l)])
  if (new Set(all).size !== all.length) throw new Error(`${l}: two words are the same`)
}
rows.push([])
rows.push(['names', 'A: Arjun, Meera, Farhan, Lakshmi, Joseph · B: Ravi, Ayesha, Harpreet, Kabir, Tenzin', 'faces', 'shown in English letters; Hindi in Devanagari (अर्जुन, मीरा, फ़रहान, लक्ष्मी, जोसेफ़ · रवि, आयशा, हरप्रीत, कबीर, तेनज़िन)', '', '', '', '', '', '', '', 'pending', 'reviewers: tell us if any name should be written in your script'])
writeFileSync('docs/translations/memory-check-words.csv', '﻿' + rows.map((r) => r.map((x) => q(String(x ?? ''))).join(',')).join('\n') + '\n')
console.log(`wrote ${rows.length - 3} words`)
