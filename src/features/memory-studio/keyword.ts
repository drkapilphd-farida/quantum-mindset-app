import { clampLevel } from '@/features/exercise-core/levelEngine'
import { shuffle, type Rng } from './storyMethod'

// Keyword method (Group A): a new word → a familiar word that sounds like it
// (the keyword) → one vivid picture joining the keyword and the meaning.
// Practice words are useful English words. English learners get English
// meanings and English keywords; Hindi learners get Hindi meanings and Hindi
// keywords; the other languages use the English set until native review.
// Pure logic only.

export const KEYWORD_EXERCISE_ID = 'keyword-method'
export const KEYWORD_OWN_EXERCISE_ID = 'keyword-method-own'

export type KeywordList = 'en' | 'hi'
export type KeywordCard = { id: string; word: string; meaning: string; keyword: string; picture: string }

const k = (word: string, meaning: string, keyword: string, picture: string): KeywordCard => ({ id: word, word, meaning, keyword, picture })

export const KEYWORD_CARDS: Readonly<Record<KeywordList, readonly KeywordCard[]>> = {
  en: [
    k('frugal', 'careful not to waste money', 'fruit', 'A fruit seller counting every coin twice before spending one.'),
    k('gregarious', 'loves being with people', 'Greg', 'Greg is always in the middle of a big, happy crowd.'),
    k('lethargic', 'tired and slow, with no energy', 'leather', 'Sinking into a soft leather sofa, too tired to get up.'),
    k('benevolent', 'kind and generous', 'Ben’s violin', 'Ben plays his violin for free to cheer everyone up.'),
    k('candid', 'honest and direct', 'candy', 'A candy that makes you say exactly what you think.'),
    k('meticulous', 'very careful about small details', 'metal tick', 'Checking every tiny metal tick with a magnifying glass.'),
    k('obsolete', 'out of date, no longer used', 'so late', 'A radio so late and so old that nobody switches it on.'),
    k('diligent', 'hard-working', 'dig a lot', 'A worker who digs and digs and never stops.'),
    k('voracious', 'very hungry, eating a lot', 'four races', 'A racing car that eats four tyres in every race.'),
    k('serene', 'calm and peaceful', 'siren', 'A siren that plays a soft, sleepy lullaby.'),
    k('tenacious', 'never gives up', 'ten aces', 'A player who keeps on playing until holding ten aces.'),
    k('placid', 'calm, not easily upset', 'plastic', 'A plastic duck floating calmly through a storm.'),
    k('arid', 'very dry', 'a ride', 'A long ride through a desert with not one drop of water.'),
    k('nocturnal', 'active at night', 'knock', 'A bat knocking, knock-knock, at midnight and waking everyone up.'),
    k('jovial', 'cheerful and friendly', 'jolly vial', 'A tiny magic vial that makes everyone jolly.'),
    k('lucid', 'clear and easy to understand', 'Lucy', 'Lucy shines a torch so everything is clear.'),
    k('robust', 'strong and healthy', 'robot', 'A robot with huge muscles lifting a car.'),
    k('vivid', 'bright and clear', 'video', 'A video with super-bright colours jumping out of the screen.'),
    k('timid', 'shy and nervous', 'Tim', 'Tim hiding behind the curtain when guests arrive.'),
    k('opulent', 'rich and grand', 'opal', 'A palace covered in shining opals.'),
    k('feeble', 'weak', 'fee bill', 'A fee bill so heavy you are too weak to lift it.'),
    k('elated', 'very happy', 'elevator', 'So happy you float up like an elevator.'),
    k('morose', 'sad and gloomy', 'more rose', 'Crying over more and more wilted roses.'),
    k('audacious', 'very bold and daring', 'audio', 'Shouting into a microphone in front of the whole school.'),
    k('cryptic', 'mysterious, hard to understand', 'crypt', 'A secret message hidden in an old crypt.'),
    k('lavish', 'rich, more than needed', 'lava', 'A flood of lava made of gold coins.'),
    k('pensive', 'deep in thought', 'pension', 'Grandpa thinking hard about his pension.'),
    k('ardent', 'very eager and passionate', 'art dent', 'An artist painting so hard the brush dents the wall.'),
    k('sluggish', 'slow-moving', 'slug', 'A slug racing a tortoise — and losing.'),
    k('nostalgia', 'a warm longing for the past', 'nose', 'Your nose smelling grandma’s cooking from long ago.'),
  ],
  hi: [
    k('frugal', 'सोच-समझकर खर्च करने वाला', 'फ्रूट गल्ला', 'फल वाला अपने गल्ले का हर सिक्का दो बार गिनता है।'),
    k('gregarious', 'मिलनसार, लोगों के बीच रहना पसंद करने वाला', 'गुरु के घर', 'गुरु के घर की भीड़ में सबसे घुल-मिलकर हँसता बच्चा।'),
    k('lethargic', 'सुस्त, बिना ऊर्जा का', 'लेट', 'हमेशा लेट, आधा सोया-सा, धीरे-धीरे चलता आदमी।'),
    k('benevolent', 'दयालु और उदार', 'बहन वाला', 'दयालु बहन जो सबको अपना खाना बाँट देती है।'),
    k('candid', 'साफ़-साफ़ सच बोलने वाला', 'कैंडी', 'ऐसी कैंडी जो खाते ही सच बुलवा दे।'),
    k('meticulous', 'छोटी-छोटी बातों का ध्यान रखने वाला', 'माटी कुल्हड़', 'कुम्हार माटी के हर कुल्हड़ को बारीकी से जाँचता है।'),
    k('obsolete', 'पुराना, अब इस्तेमाल में नहीं', 'अब सो लेट', 'पुराना रेडियो — अब सो गया, कोई उसे नहीं चलाता।'),
    k('diligent', 'मेहनती', 'दिल लगा', 'दिल लगाकर दिन-रात काम करता किसान।'),
    k('voracious', 'बहुत भूखा, बहुत खाने वाला', 'वो रेस', 'रेस की गाड़ी जो हर रेस में चार टायर खा जाए।'),
    k('serene', 'शांत', 'साइरन', 'ऐसा साइरन जो धीमी-धीमी लोरी गाए।'),
    k('tenacious', 'हार न मानने वाला', 'टेंशन', 'टेंशन में भी मैदान में डटा रहने वाला खिलाड़ी।'),
    k('placid', 'शांत, जल्दी न घबराने वाला', 'प्लास्टिक', 'तूफ़ान में भी आराम से तैरती प्लास्टिक की बत्तख।'),
    k('arid', 'बहुत सूखा', 'अरी दी', '"अरी दीदी, पानी दो!" — रेगिस्तान में प्यासा यात्री।'),
    k('nocturnal', 'रात में जागने वाला', 'नॉक', 'आधी रात नॉक-नॉक करके सबको जगाता चमगादड़।'),
    k('jovial', 'हँसमुख और ख़ुशमिज़ाज', 'जोश', 'जोश से भरा, ठहाके लगाता आदमी।'),
    k('lucid', 'साफ़ और आसानी से समझ आने वाला', 'लूसी', 'लूसी टॉर्च से सब कुछ साफ़-साफ़ दिखाती है।'),
    k('robust', 'मज़बूत और तंदुरुस्त', 'रोबोट', 'बड़े-बड़े मसल वाला रोबोट कार उठा रहा है।'),
    k('vivid', 'चटकीला और साफ़', 'वीडियो', 'ऐसा वीडियो जिसके चटकीले रंग स्क्रीन से बाहर उछल रहे हैं।'),
    k('timid', 'डरपोक, शर्मीला', 'टिमटिम', 'टिमटिमाता जुगनू जो डर के मारे झाड़ी में छिप जाता है।'),
    k('opulent', 'बहुत अमीर और शानदार', 'ओपल', 'चमकते ओपल रत्नों से ढका महल।'),
    k('feeble', 'कमज़ोर', 'फीका बल', 'इतना फीका बल कि एक पंख भी न उठे।'),
    k('elated', 'बहुत ख़ुश', 'एलिवेटर', 'इतना ख़ुश कि एलिवेटर की तरह ऊपर उड़ जाए।'),
    k('morose', 'उदास', 'मरोड़', 'पेट में मरोड़ से उदास बैठा लड़का।'),
    k('audacious', 'बहुत साहसी', 'ऑडियो', 'पूरे स्कूल के सामने माइक पर ज़ोर से बोलना।'),
    k('cryptic', 'रहस्यमय, समझने में कठिन', 'क्रिकेट', 'क्रिकेट के गुप्त इशारे जो कोई और न समझ सके।'),
    k('lavish', 'ज़रूरत से ज़्यादा, शाही', 'लावा', 'सोने के सिक्कों का बहता हुआ लावा।'),
    k('pensive', 'विचारों में खोया हुआ', 'पेंशन', 'अपनी पेंशन के बारे में गहराई से सोचते दादाजी।'),
    k('ardent', 'बहुत उत्साही, जोशीला', 'आर्ट डेंट', 'इतना जोशीला कलाकार कि ब्रश से दीवार में डेंट पड़ जाए।'),
    k('sluggish', 'धीमा', 'सुलग', 'धीरे-धीरे सुलगती अगरबत्ती जैसा धीमा।'),
    k('nostalgia', 'बीते दिनों की मीठी याद', 'नाश्ता', 'बचपन के लज़ीज़ नाश्ते की ख़ुशबू याद आना।'),
  ],
}

export function keywordListFor(appLang: string): KeywordList {
  return appLang === 'hi' ? 'hi' : 'en'
}

/** How much help is shown while studying: the keyword and picture, the keyword only, or nothing (make your own). */
export type KeywordHelp = 'full' | 'keyword' | 'none'
export type KeywordLevelConfig = { count: number; help: KeywordHelp; unseen: number }

const LEVELS: readonly KeywordLevelConfig[] = [
  { count: 3, help: 'full', unseen: 1 },
  { count: 4, help: 'full', unseen: 1 },
  { count: 5, help: 'full', unseen: 2 },
  { count: 5, help: 'keyword', unseen: 2 },
  { count: 6, help: 'keyword', unseen: 2 },
  { count: 6, help: 'keyword', unseen: 3 },
  { count: 7, help: 'none', unseen: 3 },
  { count: 8, help: 'none', unseen: 3 },
  { count: 9, help: 'none', unseen: 4 },
  { count: 10, help: 'none', unseen: 4 },
]

export function keywordLevel(level: number): KeywordLevelConfig {
  return LEVELS[clampLevel(level) - 1]!
}

export type KeywordRound = { cards: KeywordCard[]; askOrder: number[]; choices: KeywordCard[] }

/** A round: `count` words to learn, asked in a new order; the choices are their meanings plus unseen ones. Avoids the last round's words where it can. */
export function pickKeywordRound(list: KeywordList, level: number, avoid: readonly string[], rng: Rng, countOverride?: number): KeywordRound {
  const config = keywordLevel(level)
  const count = countOverride ?? config.count
  const unseen = countOverride === undefined ? config.unseen : 1
  const all = KEYWORD_CARDS[list]
  const fresh = all.filter((c) => !avoid.includes(c.id))
  const pool = shuffle(fresh.length >= count + unseen ? fresh : all, rng)
  const cards = pool.slice(0, count)
  return {
    cards,
    askOrder: shuffle(
      cards.map((_, i) => i),
      rng,
    ),
    choices: shuffle(pool.slice(0, count + unseen), rng),
  }
}
