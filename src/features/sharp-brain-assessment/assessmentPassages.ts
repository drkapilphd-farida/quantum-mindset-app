// Day 1 / Day 30 assessment passages (Phase 8, Item 11). Two parallel
// forms of the same length and reading level, each with five questions
// (three about what the text says, two that need a small inference).
// Day 30 always uses the form that was NOT used on Day 1, so the result is
// not memory of the same text. Content is in English only for now.
// Review: Dr. Kapil Dev Sharma to approve before switch-on (see docs).

export type AssessmentQuestion = {
  question: string
  options: readonly [string, string, string]
  correctIndex: 0 | 1 | 2
}

export type AssessmentPassage = {
  id: 'form-a' | 'form-b'
  title: string
  paragraphs: readonly string[]
  questions: readonly AssessmentQuestion[]
}

export const ASSESSMENT_PASSAGES: readonly [AssessmentPassage, AssessmentPassage] = [
  {
    id: 'form-a',
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
] as const

export function countWords(passage: AssessmentPassage): number {
  return passage.paragraphs.join(' ').split(/\s+/).filter((word) => word.length > 0).length
}

export function getAssessmentPassage(id: string): AssessmentPassage | null {
  return ASSESSMENT_PASSAGES.find((passage) => passage.id === id) ?? null
}

/** Day 1 uses Form A; Day 30 uses whichever form Day 1 did not. */
export function passageForStage(stage: 'day1' | 'day30', day1PassageId: string | null): AssessmentPassage {
  const [formA, formB] = ASSESSMENT_PASSAGES
  if (stage === 'day1') return formA
  return day1PassageId === formB.id ? formA : formB
}
