// Live/Instructor Mode™ pinned passage (see the "Speed Test — Live Class
// + Public Standalone Ready" task) — a single fixed ~285-word passage
// with 5 fact-based questions, used only by QsrSpeedTestLiveExperience
// (the ?mode=live flow), never the random 24-passage pool in
// speedTestPassagePool.ts. Deliberately separate from SpeedTestPassage's
// 2-question type (speedTestContent.ts) rather than widening that type —
// the public marketing flow's 2-question shape is unchanged, everywhere
// it's already linked from (homepage, QSR hero, QSR page inline CTAs).
//
// Original content, written for this tool specifically — none of the 24
// existing passages reach the requested 250-300 word range (all are
// 80-135 words), so pinning one of them wasn't possible without either
// concatenating unrelated passages or authoring new, correctly-sized
// content. Every question below is answerable strictly from this
// passage's own text, same discipline speedTestPassagePool.ts's own
// questions follow.

export type LiveDemoQuestion = {
  question: string
  options: readonly string[]
  correctIndex: number
}

export type LiveDemoPassage = {
  title: string
  text: string
  questions: readonly LiveDemoQuestion[]
}

export const LIVE_DEMO_PASSAGE: LiveDemoPassage = {
  title: 'How Sleep Consolidates Memory',
  text: "Memory doesn't finish forming the moment you stop studying — a large part of the real work happens later, while you sleep. Scientists divide sleep into several stages, and two of them matter most for learning: slow-wave sleep and REM sleep. During slow-wave sleep, which dominates the first half of the night, the brain replays the day's new information in fast, compressed bursts. This replay strengthens the connections between neurons that encoded the memory in the first place, essentially copying it from short-term storage in the hippocampus into longer-term storage spread across the cortex.\n\nREM sleep, which becomes more frequent in the second half of the night, plays a different role. Instead of simply strengthening individual memories, it appears to help the brain find patterns and connections between them, linking new information to things you already know. This is one reason people sometimes wake up with a solution to a problem they couldn't solve the night before; the brain kept working on it, just not consciously.\n\nBoth stages depend on getting enough total sleep, not just falling asleep at some point. Studies that compare a full night of sleep to a shortened one consistently find that the group with less sleep remembers less the next day, even when both groups studied the same material for the same length of time. Interestingly, a short nap taken a few hours after learning something new can produce a smaller version of the same benefit, though it does not fully replace a full night's sleep.\n\nThis is part of why cramming late into the night is such an inefficient strategy: it sacrifices exactly the window of time your brain needs to lock in everything you just tried to learn.",
  questions: [
    {
      question: 'According to the passage, when during the night does slow-wave sleep dominate?',
      options: ['The first half of the night', 'The second half of the night', 'Only during short naps'],
      correctIndex: 0,
    },
    {
      question: 'What does the brain do during slow-wave sleep, per the passage?',
      options: [
        'It suppresses newly formed memories',
        "It replays the day's new information in fast, compressed bursts",
        'It stops encoding in the hippocampus entirely',
      ],
      correctIndex: 1,
    },
    {
      question: "What is REM sleep's main role, according to the passage?",
      options: [
        'Strengthening individual memories one at a time',
        'Finding patterns and connections between memories',
        'Preventing the hippocampus from storing new information',
      ],
      correctIndex: 1,
    },
    {
      question: 'What did studies comparing a full night of sleep to a shortened one find?',
      options: [
        'Sleep duration made no difference to next-day memory',
        'The shortened-sleep group remembered less the next day',
        'The shortened-sleep group remembered more the next day',
      ],
      correctIndex: 1,
    },
    {
      question: "Per the passage, can a short nap after learning something new fully replace a full night's sleep?",
      options: [
        'Yes, completely',
        'No, but it can produce a smaller version of the same benefit',
        'The passage says naps have no effect at all',
      ],
      correctIndex: 1,
    },
  ],
}
