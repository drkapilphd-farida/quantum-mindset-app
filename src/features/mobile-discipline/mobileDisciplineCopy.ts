// EN/HI copy for Mobile Discipline (Phase 8, Item 12). Calm and kind —
// no shaming language for missed days.

export const MOBILE_DISCIPLINE_COPY = {
  en: {
    title: 'Mobile Discipline',
    sub: 'A daily screen-time goal you set yourself, a focus timer and a daily check-in.',
    selfReported: 'Everything here is self-reported. The app never blocks your phone or looks at other apps.',
    goalTitle: 'Your daily screen-time goal',
    goalNone: 'Choose how much time on your phone for fun (games, videos, social media) feels right for you each day.',
    goalCurrent: (minutes: number) => `Your goal: at most ${formatMinutes(minutes, 'en')} a day.`,
    goalChange: 'Change goal',
    goalCustom: 'Other (minutes)',
    goalSave: 'Save goal',
    goalSaved: 'Goal saved.',
    focusTitle: 'Focus timer',
    focusSub: 'Put your phone away from you, pick a time and do just one task until the timer ends.',
    minutes: (n: number) => `${n} min`,
    start: 'Start',
    focusRunning: 'Stay with this one task. Your phone can wait.',
    endEarly: 'Stop',
    endEarlyNote: 'Stopping early is fine — only finished sessions are counted.',
    focusDone: (n: number) => `Well done — ${n} focused minutes.`,
    focusDoneSub: 'Take a slow breath before you move on.',
    focusAgain: 'Done',
    checkinTitle: 'Daily check-in',
    checkinQuestion: 'Did you stay within your screen-time goal today?',
    checkinNeedsGoal: 'Set your goal first, then check in each evening.',
    yes: 'Yes',
    notToday: 'Not today',
    checkedYes: 'Nice work today.',
    checkedNo: 'That’s okay — tomorrow is a fresh start.',
    streak: (n: number) => (n === 1 ? '1 day in a row within your goal' : `${n} days in a row within your goal`),
    streakZero: 'Your streak starts with the next day within your goal.',
    weekTitle: 'This week',
    weekFocusMinutes: 'Focus minutes',
    weekSessions: 'Focus sessions',
    weekDaysWithin: (within: number, checked: number) => `${within} of ${checked} checked-in days`,
    weekDaysWithinLabel: 'Days within goal',
    error: 'Could not save. Please try again.',
    notCompleted: 'That session didn’t reach the full time, so it wasn’t counted.',
  },
  hi: {
    title: 'मोबाइल डिसिप्लिन',
    sub: 'खुद तय किया रोज़ का स्क्रीन-टाइम लक्ष्य, फोकस टाइमर और रोज़ का चेक-इन।',
    selfReported: 'यहां सब कुछ आप खुद बताते हैं। ऐप कभी आपका फ़ोन ब्लॉक नहीं करता और दूसरे ऐप्स नहीं देखता।',
    goalTitle: 'आपका रोज़ का स्क्रीन-टाइम लक्ष्य',
    goalNone: 'चुनें कि मनोरंजन के लिए (गेम, वीडियो, सोशल मीडिया) रोज़ कितना फ़ोन इस्तेमाल आपको ठीक लगता है।',
    goalCurrent: (minutes: number) => `आपका लक्ष्य: रोज़ ज़्यादा से ज़्यादा ${formatMinutes(minutes, 'hi')}।`,
    goalChange: 'लक्ष्य बदलें',
    goalCustom: 'अन्य (मिनट)',
    goalSave: 'लक्ष्य सेव करें',
    goalSaved: 'लक्ष्य सेव हो गया।',
    focusTitle: 'फोकस टाइमर',
    focusSub: 'फ़ोन को खुद से दूर रखें, समय चुनें और टाइमर खत्म होने तक सिर्फ़ एक काम करें।',
    minutes: (n: number) => `${n} मिनट`,
    start: 'शुरू करें',
    focusRunning: 'बस इसी एक काम पर टिके रहें। फ़ोन इंतज़ार कर सकता है।',
    endEarly: 'रोकें',
    endEarlyNote: 'बीच में रोकना ठीक है — सिर्फ़ पूरे हुए सेशन गिने जाते हैं।',
    focusDone: (n: number) => `बहुत बढ़िया — ${n} मिनट का फोकस।`,
    focusDoneSub: 'आगे बढ़ने से पहले एक धीमी, गहरी सांस लें।',
    focusAgain: 'ठीक है',
    checkinTitle: 'रोज़ का चेक-इन',
    checkinQuestion: 'क्या आज आप अपने स्क्रीन-टाइम लक्ष्य के अंदर रहे?',
    checkinNeedsGoal: 'पहले अपना लक्ष्य तय करें, फिर हर शाम चेक-इन करें।',
    yes: 'हां',
    notToday: 'आज नहीं',
    checkedYes: 'आज बहुत अच्छा रहा।',
    checkedNo: 'कोई बात नहीं — कल एक नई शुरुआत है।',
    streak: (n: number) => `लगातार ${n} दिन लक्ष्य के अंदर`,
    streakZero: 'लक्ष्य के अंदर वाले अगले दिन से आपकी स्ट्रीक शुरू होगी।',
    weekTitle: 'यह हफ़्ता',
    weekFocusMinutes: 'फोकस मिनट',
    weekSessions: 'फोकस सेशन',
    weekDaysWithin: (within: number, checked: number) => `चेक-इन वाले ${checked} में से ${within} दिन`,
    weekDaysWithinLabel: 'लक्ष्य के अंदर वाले दिन',
    error: 'सेव नहीं हो सका। कृपया फिर से कोशिश करें।',
    notCompleted: 'यह सेशन पूरे समय तक नहीं चला, इसलिए गिना नहीं गया।',
  },
} as const

export type MobileDisciplineCopy = (typeof MOBILE_DISCIPLINE_COPY)['en'] | (typeof MOBILE_DISCIPLINE_COPY)['hi']

export function formatMinutes(minutes: number, lang: 'en' | 'hi'): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (lang === 'hi') {
    if (hours === 0) return `${rest} मिनट`
    return rest === 0 ? `${hours} घंटे` : `${hours} घंटे ${rest} मिनट`
  }
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}
