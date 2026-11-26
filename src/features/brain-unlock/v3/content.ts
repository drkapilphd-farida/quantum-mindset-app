// Brain Test v3 — what the person sees in rounds 3 and 4. English and Hindi
// share the item ids, so a set is equally hard in both languages. Easy,
// neutral topics; every question needs the passage.

export type V3Lang = 'en' | 'hi'

export type MemoryItem = { id: string; emoji: string; word: Record<V3Lang, string> }
export type MemorySet = { id: string; shown: readonly MemoryItem[]; distractors: readonly MemoryItem[] }

const item = (id: string, emoji: string, en: string, hi: string): MemoryItem => ({ id, emoji, word: { en, hi } })

/** Round 3: 7 items to remember, 5 that were not shown. */
export const MEMORY_SETS: readonly MemorySet[] = [
  {
    id: 'm1',
    shown: [
      item('apple', '🍎', 'Apple', 'सेब'),
      item('bicycle', '🚲', 'Bicycle', 'साइकिल'),
      item('umbrella', '☂️', 'Umbrella', 'छाता'),
      item('clock', '⏰', 'Clock', 'घड़ी'),
      item('fish', '🐟', 'Fish', 'मछली'),
      item('key', '🔑', 'Key', 'चाबी'),
      item('tree', '🌳', 'Tree', 'पेड़'),
    ],
    distractors: [
      item('banana', '🍌', 'Banana', 'केला'),
      item('car', '🚗', 'Car', 'कार'),
      item('cat', '🐱', 'Cat', 'बिल्ली'),
      item('book', '📕', 'Book', 'किताब'),
      item('star', '⭐', 'Star', 'तारा'),
    ],
  },
  {
    id: 'm2',
    shown: [
      item('elephant', '🐘', 'Elephant', 'हाथी'),
      item('guitar', '🎸', 'Guitar', 'गिटार'),
      item('moon', '🌙', 'Moon', 'चाँद'),
      item('shoe', '👟', 'Shoe', 'जूता'),
      item('cake', '🎂', 'Cake', 'केक'),
      item('boat', '⛵', 'Boat', 'नाव'),
      item('pencil', '✏️', 'Pencil', 'पेंसिल'),
    ],
    distractors: [
      item('lion', '🦁', 'Lion', 'शेर'),
      item('drum', '🥁', 'Drum', 'ढोल'),
      item('sun', '☀️', 'Sun', 'सूरज'),
      item('hat', '🎩', 'Hat', 'टोपी'),
      item('train', '🚆', 'Train', 'रेलगाड़ी'),
    ],
  },
  {
    id: 'm3',
    shown: [
      item('mango', '🥭', 'Mango', 'आम'),
      item('kite', '🪁', 'Kite', 'पतंग'),
      item('bell', '🔔', 'Bell', 'घंटी'),
      item('flower', '🌸', 'Flower', 'फूल'),
      item('dog', '🐶', 'Dog', 'कुत्ता'),
      item('cup', '☕', 'Cup', 'कप'),
      item('house', '🏠', 'House', 'घर'),
    ],
    distractors: [
      item('grapes', '🍇', 'Grapes', 'अंगूर'),
      item('ball', '⚽', 'Ball', 'गेंद'),
      item('lamp', '💡', 'Bulb', 'बल्ब'),
      item('bird', '🐦', 'Bird', 'चिड़िया'),
      item('rocket', '🚀', 'Rocket', 'रॉकेट'),
    ],
  },
]

export type RsvpQuestion = { q: string; options: readonly string[]; answer: number }
export type RsvpPassage = { id: string; text: Record<V3Lang, string>; question: Record<V3Lang, RsvpQuestion> }

/** Round 4: about 60 words each, read one word at a time at 350 words per minute. */
export const RSVP_PASSAGES: readonly RsvpPassage[] = [
  {
    id: 'r1',
    text: {
      en: 'Every morning, Meera waters the small garden behind her house. She grows tomatoes, mint and bright yellow marigolds. Last week a family of sparrows built a nest in the old guava tree near the gate. Now Meera fills a clay bowl with fresh water for them each day, and the birds sing while she works.',
      hi: 'हर सुबह मीरा अपने घर के पीछे वाले छोटे बगीचे में पानी देती है। वह टमाटर, पुदीना और चमकीले पीले गेंदे उगाती है। पिछले हफ़्ते गौरैयों के एक परिवार ने गेट के पास वाले पुराने अमरूद के पेड़ पर घोंसला बनाया। अब मीरा रोज़ उनके लिए मिट्टी के कटोरे में ताज़ा पानी भरती है, और जब वह काम करती है तो चिड़ियाँ गाती हैं।',
    },
    question: {
      en: { q: 'Where did the sparrows build their nest?', options: ['In the guava tree', 'On the roof', 'In the mint plants'], answer: 0 },
      hi: { q: 'गौरैयों ने घोंसला कहाँ बनाया?', options: ['अमरूद के पेड़ पर', 'छत पर', 'पुदीने के पौधों में'], answer: 0 },
    },
  },
  {
    id: 'r2',
    text: {
      en: 'The school bus was late on Monday because of heavy rain. While the children waited, Arjun took out his notebook and started drawing the clouds. His friend Riya counted the red cars that passed by. By the time the bus arrived, Arjun had drawn six clouds and Riya had counted eleven red cars. Waiting felt much shorter that day.',
      hi: 'सोमवार को तेज़ बारिश की वजह से स्कूल बस देर से आई। बच्चे इंतज़ार कर रहे थे, तभी अर्जुन ने अपनी कॉपी निकाली और बादलों का चित्र बनाने लगा। उसकी दोस्त रिया पास से गुज़रती लाल गाड़ियाँ गिनने लगी। जब तक बस आई, अर्जुन छह बादल बना चुका था और रिया ग्यारह लाल गाड़ियाँ गिन चुकी थी। उस दिन इंतज़ार बहुत छोटा लगा।',
    },
    question: {
      en: { q: 'What did Riya count?', options: ['Clouds', 'Red cars', 'Raindrops'], answer: 1 },
      hi: { q: 'रिया ने क्या गिना?', options: ['बादल', 'लाल गाड़ियाँ', 'बारिश की बूँदें'], answer: 1 },
    },
  },
  {
    id: 'r3',
    text: {
      en: 'A small bakery opened on our street last month. The baker starts work at four in the morning, long before anyone else is awake. By seven, the whole street smells of warm bread. His most popular item is a soft coconut bun, and it is usually sold out before nine. People now come early just to get one.',
      hi: 'पिछले महीने हमारी गली में एक छोटी बेकरी खुली। बेकरी वाला सुबह चार बजे काम शुरू कर देता है, जब बाकी सब सो रहे होते हैं। सात बजे तक पूरी गली में गरम ब्रेड की खुशबू फैल जाती है। उसकी सबसे पसंदीदा चीज़ नारियल वाला नरम बन है, जो अक्सर नौ बजे से पहले ही ख़त्म हो जाता है। अब लोग उसे पाने के लिए जल्दी आते हैं।',
    },
    question: {
      en: { q: 'What is the most popular item?', options: ['Chocolate cake', 'Warm bread', 'Coconut bun'], answer: 2 },
      hi: { q: 'सबसे पसंदीदा चीज़ क्या है?', options: ['चॉकलेट केक', 'गरम ब्रेड', 'नारियल वाला बन'], answer: 2 },
    },
  },
]

export function memorySetById(id: string): MemorySet | undefined {
  return MEMORY_SETS.find((s) => s.id === id)
}

export function rsvpPassageById(id: string): RsvpPassage | undefined {
  return RSVP_PASSAGES.find((p) => p.id === id)
}

/** Fisher–Yates with an injectable random source (tests pass a fixed one). */
export function shuffled<TItem>(list: readonly TItem[], rng: () => number = Math.random): TItem[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const t = a[i]!
    a[i] = a[j]!
    a[j] = t
  }
  return a
}

export function pickOne<TItem>(list: readonly TItem[], rng: () => number = Math.random): TItem {
  return list[Math.min(list.length - 1, Math.floor(rng() * list.length))]!
}

/** The 25 numbers of a focus grid in a random order. */
export function gridOrder(rng: () => number = Math.random): number[] {
  return shuffled(Array.from({ length: 25 }, (_, i) => i + 1), rng)
}
