// Parent consent form for the EEG Brain & Focus Assessment (founder brief,
// 15 Nov 2026). The English text is the founder's own; the Hindi is its
// translation. scripts/schools/consent-pdf.ts prints both to one-page A4
// PDFs in public/schools/. Change the text here, then run that script.
export type ConsentText = {
  title: string;
  intro: string;
  understand: string;
  points: string[];
  boxes: string[];
  fields: string[];
  footer: string;
};

export const CONSENT: Record<"en" | "hi", ConsentText> = {
  en: {
    title: "Sharp Brain EEG Brain & Focus Assessment, Mind Ur Mind: Parent Consent",
    intro:
      "I, the parent/guardian named below, agree that my child may take part in the Sharp Brain EEG Brain & Focus Assessment at school.",
    understand: "I understand that:",
    points: [
      "It is an educational assessment of focus, memory and reading, not a medical test or diagnosis.",
      "A soft, non-invasive EEG headband is worn for about 8 minutes. It only reads signals and is cleaned between students.",
      "My child's report will be shared with me on WhatsApp. The school will see only class-level results without my child's name, unless I tick the box below.",
      "The data will be used only to prepare my child's report and measure progress, and will not be shared with anyone else.",
      "My child can stop at any time, and I can ask for the data to be deleted by writing to info@mindurmind.org.in.",
    ],
    boxes: [
      "I also allow the school to see my child's individual report.",
      "I allow an anonymous photo/video of the session for Mind Ur Mind's educational material (optional).",
    ],
    fields: ["Student name", "Class & section", "Age", "Parent/guardian name", "WhatsApp number", "Signature", "Date"],
    footer: "Mind Ur Mind · mindurmind.org.in · info@mindurmind.org.in · +91 95401 23161",
  },
  hi: {
    title: "Sharp Brain EEG Brain & Focus Assessment, Mind Ur Mind: अभिभावक की सहमति",
    intro:
      "मैं, नीचे लिखे नाम वाला/वाली अभिभावक, सहमति देता/देती हूँ कि मेरा बच्चा school में Sharp Brain EEG Brain & Focus Assessment में भाग ले सकता है।",
    understand: "मैं समझता/समझती हूँ कि:",
    points: [
      "यह focus, memory और reading का शैक्षिक आकलन है, कोई मेडिकल टेस्ट या निदान नहीं।",
      "लगभग 8 मिनट के लिए एक नरम EEG headband पहनाया जाता है, जो शरीर में कुछ नहीं डालता। यह सिर्फ़ signals पढ़ता है और हर student के बाद साफ़ किया जाता है।",
      "मेरे बच्चे की report मुझे WhatsApp पर भेजी जाएगी। School को सिर्फ़ class के नतीजे दिखेंगे, मेरे बच्चे के नाम के बिना, जब तक मैं नीचे का box tick न करूँ।",
      "Data का उपयोग सिर्फ़ मेरे बच्चे की report बनाने और progress मापने के लिए होगा, और यह किसी और को नहीं दिया जाएगा।",
      "मेरा बच्चा कभी भी रुक सकता है, और मैं info@mindurmind.org.in पर लिखकर data delete करवा सकता/सकती हूँ।",
    ],
    boxes: [
      "मैं school को भी अपने बच्चे की व्यक्तिगत report देखने की अनुमति देता/देती हूँ।",
      "मैं Mind Ur Mind की शैक्षिक सामग्री के लिए session की बिना पहचान वाली photo/video की अनुमति देता/देती हूँ (ज़रूरी नहीं)।",
    ],
    fields: ["Student का नाम", "Class और section", "उम्र", "अभिभावक का नाम", "WhatsApp number", "हस्ताक्षर", "तारीख़"],
    footer: "Mind Ur Mind · mindurmind.org.in · info@mindurmind.org.in · +91 95401 23161",
  },
};
