// A ready sample chapter for Chapter & Book inside the 30-day plan, for
// learners with no chapter at hand. Written for the app; it uses no
// memory-check word (tested), so practising on it never makes the Day 30
// memory check easier. The other languages use the English sample.

export const SAMPLE_CHAPTER: Readonly<Record<'en' | 'hi', { title: string; text: string }>> = {
  en: {
    title: 'The Human Heart',
    text: `The Human Heart

The heart is a strong muscle, about the size of your fist, that sits in the middle of the chest, a little to the left. Its job is to push blood around the whole body, all day and all night, without ever taking a rest.

The heart has four rooms, called chambers. The two upper chambers are the atria; they receive blood. The two lower chambers are the ventricles; they push blood out. A wall called the septum keeps the right side and the left side apart.

The right side of the heart collects blood that has given away its oxygen. It sends this blood to the lungs, where the blood picks up fresh oxygen and gives away carbon dioxide.

The left side of the heart receives the fresh, oxygen-rich blood from the lungs and pushes it out to every part of the body. Because it has to push harder and further, the wall of the left ventricle is the thickest.

Blood travels through tubes called blood vessels. Arteries carry blood away from the heart. Veins bring blood back to the heart. Tiny capillaries connect them and pass oxygen and food to every cell.

Inside the heart, valves work like one-way gates. They open to let blood through and close to stop it flowing backwards. The "lub-dub" sound of a heartbeat is the sound of these valves closing.

An adult heart beats about seventy times a minute. Exercise, healthy food and good sleep keep the heart strong, while smoking and too much junk food make its work harder.`,
  },
  hi: {
    title: 'मानव हृदय',
    text: `मानव हृदय

हृदय एक मज़बूत मांसपेशी है, लगभग आपकी मुट्ठी के आकार का, जो छाती के बीच में थोड़ा बाईं ओर होता है। इसका काम है पूरे शरीर में ख़ून पहुँचाना — दिन-रात, बिना कभी आराम किए।

हृदय में चार कक्ष होते हैं। ऊपर के दो कक्ष आलिंद कहलाते हैं; वे ख़ून लेते हैं। नीचे के दो कक्ष निलय कहलाते हैं; वे ख़ून बाहर भेजते हैं। बीच की एक दीवार, जिसे पट कहते हैं, दाएँ और बाएँ हिस्से को अलग रखती है।

हृदय का दायाँ हिस्सा वह ख़ून इकट्ठा करता है जिसकी ऑक्सीजन इस्तेमाल हो चुकी है। यह ख़ून फेफड़ों में भेजा जाता है, जहाँ उसे ताज़ी ऑक्सीजन मिलती है और कार्बन डाइऑक्साइड बाहर निकलती है।

हृदय का बायाँ हिस्सा फेफड़ों से आया ऑक्सीजन वाला ताज़ा ख़ून लेता है और उसे शरीर के हर हिस्से तक भेजता है। इसे ज़्यादा ज़ोर लगाना पड़ता है, इसलिए बाएँ निलय की दीवार सबसे मोटी होती है।

ख़ून नलियों में चलता है जिन्हें रक्त वाहिकाएँ कहते हैं। धमनियाँ ख़ून को हृदय से दूर ले जाती हैं। शिराएँ ख़ून को हृदय तक वापस लाती हैं। बहुत पतली केशिकाएँ इन्हें जोड़ती हैं और हर कोशिका तक ऑक्सीजन और भोजन पहुँचाती हैं।

हृदय के अंदर वाल्व एक-तरफ़ा फाटकों की तरह काम करते हैं। वे ख़ून को आगे जाने देते हैं और पीछे लौटने से रोकते हैं। धड़कन की "लब-डब" आवाज़ इन्हीं वाल्वों के बंद होने की आवाज़ है।

एक बड़े व्यक्ति का हृदय एक मिनट में लगभग सत्तर बार धड़कता है। व्यायाम, सेहतमंद खाना और अच्छी नींद हृदय को मज़बूत रखते हैं, जबकि धूम्रपान और बहुत ज़्यादा जंक फ़ूड उसका काम कठिन बना देते हैं।`,
  },
}
