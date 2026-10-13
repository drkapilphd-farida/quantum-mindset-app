import type { LibraryPassage } from './library'

// Smart Reader library — English (written for the app, 13 Oct 2026). Each
// passage has 3 sections with 2 questions each. Facts are well established.
const q = (question: string, options: [string, string, string, string], correctIndex: number): { question: string; options: string[]; correctIndex: number } => ({ question, options, correctIndex })

export const LIBRARY_EN: readonly LibraryPassage[] = [
  {
    id: 'en-sleep-memory',
    lang: 'en',
    title: 'How Sleep Builds Your Memory',
    sections: [
      {
        heading: 'The busy night',
        text: `When you fall asleep, your body rests, but your brain does not switch off. For many hours it keeps working, quietly sorting what happened during the day.

Scientists who record brain waves during the night see a clear pattern. Sleep moves through cycles of about ninety minutes. In each cycle the brain passes from light sleep into deep, slow-wave sleep, and then into a lively stage called REM sleep, when the eyes move quickly under closed lids and most dreams happen.

Each of these stages seems to have its own job. Deep sleep comes mostly in the first half of the night; REM sleep grows longer towards the morning. A full night therefore gives the brain several chances to do its work.`,
        questions: [q('About how long is one sleep cycle?', ['Thirty minutes', 'Ninety minutes', 'Three hours', 'Five hours'], 1), q('When do most dreams happen?', ['During REM sleep', 'Just before falling asleep', 'During deep sleep only', 'Only in the afternoon'], 0)],
      },
      {
        heading: 'Moving memories to safety',
        text: `During the day, new facts are held for a short time in a small, curved part of the brain called the hippocampus. It works like a notebook: quick to write in, but with little space.

In deep sleep, the hippocampus "replays" the day's important events, often many times faster than they really happened. With each replay, the memory is copied into the cortex, the large outer layer of the brain, where it can last for years. Researchers have watched this happen: the same pattern of brain cells that fired while an animal learned a maze fired again while it slept.

REM sleep seems to help in a different way. It links new memories with old ones, which is why a problem that seemed hard in the evening can feel clearer the next morning.`,
        questions: [q('What does the hippocampus do with new facts?', ['Deletes them at once', 'Holds them for a short time', 'Turns them into dreams', 'Sends them to the eyes'], 1), q('According to the passage, how does REM sleep help?', ['It links new memories with old ones', 'It stops all brain activity', 'It makes the body grow taller', 'It removes old memories'], 0)],
      },
      {
        heading: 'What this means for students',
        text: `Studies with students show the effect clearly. Those who sleep after learning a list of words remember more of them the next day than those who stay awake for the same number of hours. Staying up all night before an exam does the opposite: the brain loses the very sleep it needs to keep what was studied.

A few simple habits help. Study the most important material in the evening and then sleep a full night. Keep a regular bedtime, because the brain sleeps best on a steady rhythm. Put screens away a little before bed; bright light tells the brain it is still daytime.

Even a short nap of twenty minutes can refresh attention. But nothing replaces a full night — it is when the day's learning becomes tomorrow's knowledge.`,
        questions: [q('What happens to students who sleep after learning a word list?', ['They forget more words', 'They remember more words the next day', 'They cannot learn new words', 'They need no more practice'], 1), q('Why should screens be put away before bed?', ['They are too heavy', 'Bright light tells the brain it is still daytime', 'They make the room cold', 'They use up memory space'], 1)],
      },
    ],
  },
  {
    id: 'en-story-of-zero',
    lang: 'en',
    title: 'The Story of Zero',
    sections: [
      {
        heading: 'A number for nothing',
        text: `Try to imagine counting without the number zero. How would you write ten, or a hundred, or the year two thousand? For most of human history, people faced exactly this problem.

Ancient civilisations were clever with numbers. The Egyptians built huge pyramids, and the Babylonians tracked the movements of the planets. Yet their number systems had no true zero. The Romans wrote numbers with letters such as X, L and C, which made even simple sums slow and awkward.

Some peoples used an empty space, or a small mark, to show that a place in a number was empty. But this mark was only a gap-filler. Nobody yet treated "nothing" as a number in its own right, something you could add, subtract or multiply.`,
        questions: [q('How did the Romans write numbers?', ['With dots and lines', 'With letters such as X, L and C', 'With pictures of animals', 'With the digits 0 to 9'], 1), q('What was the problem with the early "gap-filler" marks?', ['They were too colourful', 'Nobody treated nothing as a number of its own', 'They were only used for money', 'They could only show the number one'], 1)],
      },
      {
        heading: 'India gives zero its place',
        text: `The big step was taken in India. Indian mathematicians used a place-value system, in which the position of a digit tells its value: the 3 in 300 means three hundreds. To make this work, they needed a symbol for an empty place, and they began writing it as a small dot or circle.

In the year 628, the mathematician Brahmagupta went further. In his book, the Brahmasphutasiddhanta, he wrote down rules for working with zero as a number: a number plus zero is the same number; a number minus itself is zero; a number multiplied by zero is zero.

For the first time, zero was not just an empty space. It was a number with its own rules, and with nine other digits it could write any number at all.`,
        questions: [q('In a place-value system, what tells the value of a digit?', ['Its colour', 'Its position in the number', 'Its size on the page', 'The day it was written'], 1), q('Which mathematician wrote rules for zero in the year 628?', ['Brahmagupta', 'Euclid', 'Newton', 'Pythagoras'], 0)],
      },
      {
        heading: 'Zero travels the world',
        text: `From India, the new numbers travelled west. Scholars in Baghdad translated Indian books into Arabic, and the mathematician al-Khwarizmi explained how to calculate with the ten digits. The word "algorithm" comes from his name.

Around the year 1200, an Italian named Fibonacci learned these numbers in North Africa and wrote a book praising them for Europe. Merchants slowly found that they could add up accounts far faster than with Roman numerals, and the new system spread.

Today the ten digits, often called Hindu-Arabic numerals, are used everywhere. Every computer depends on zero, because it stores all information as patterns of zeros and ones. A simple idea from Indian mathematics now runs the modern world.`,
        questions: [q('Where does the word "algorithm" come from?', ['The name al-Khwarizmi', 'An old Roman number', 'The Italian word for zero', 'A Greek city'], 0), q('Why does every computer depend on zero?', ['It stores information as patterns of zeros and ones', 'It was invented in a computer', 'It is the largest number', 'Computers cannot count past zero'], 0)],
      },
    ],
  },
  {
    id: 'en-how-eyes-read',
    lang: 'en',
    title: 'How Your Eyes Read',
    sections: [
      {
        heading: 'Jumps, not a smooth glide',
        text: `It feels as if your eyes slide smoothly along a line of text. In fact, they do not. They move in quick jumps called saccades, and between the jumps they stop for a moment. These stops are called fixations.

A fixation usually lasts about a quarter of a second. Almost all the reading happens during these stops; during the jumps themselves, the eyes take in very little. A reader may make three or four fixations on a single line of a book.

Scientists discovered this more than a hundred years ago by watching readers' eyes closely. Today, eye-tracking cameras can record every jump and stop, and they show that good readers and struggling readers move their eyes in quite different ways.`,
        questions: [q('What are the quick jumps of the eyes called?', ['Fixations', 'Saccades', 'Blinks', 'Glances'], 1), q('When does almost all the reading happen?', ['During the jumps', 'During the stops, called fixations', 'Only while blinking', 'After the page is closed'], 1)],
      },
      {
        heading: 'How much can one look take in?',
        text: `At each fixation, only a small area is perfectly sharp. This area, the fovea, covers just a few letters. A little further out, words are blurred but still useful: the brain uses their shape and length to plan the next jump.

Skilled readers make fewer fixations per line and spend less time going back over words they have already passed. Going back is called regression. Some regression is normal and helps understanding, but frequent regressions often happen when attention wanders.

Training cannot make the sharp area of the eye bigger. What it can do is help the brain recognise familiar words and phrases faster, so each stop is used well and the eyes move on with confidence.`,
        questions: [q('What is the small, perfectly sharp area of vision called?', ['The fovea', 'The pupil', 'The lens', 'The margin'], 0), q('What is going back over words already read called?', ['Skimming', 'Regression', 'Fixation', 'Scanning'], 1)],
      },
      {
        heading: 'Reading faster without losing meaning',
        text: `If you read faster than you can understand, the words pass by but nothing stays. Real reading speed is therefore about two things together: how fast you move and how much you understand.

A guide, such as a finger or a moving highlight, can help. It keeps the eyes moving forward steadily and reduces unnecessary regressions. Reading in meaningful groups of words — "in the morning", "a cup of tea" — also helps, because the brain thinks in ideas, not single words.

Rest matters too. The eye muscles tire after long reading, and tired eyes make more mistakes. Every fifteen minutes or so, look into the distance for a short while. Then come back, and the words will feel clearer again.`,
        questions: [q('According to the passage, real reading speed is about what?', ['Only how fast the eyes move', 'How fast you move and how much you understand', 'How many pages a book has', 'How loudly you read'], 1), q('What does the passage suggest doing every fifteen minutes or so?', ['Read even faster', 'Look into the distance for a short while', 'Close the book for the day', 'Start the chapter again'], 1)],
      },
    ],
  },
  {
    id: 'en-honeybee-dance',
    lang: 'en',
    title: "The Honeybee's Dance",
    sections: [
      {
        heading: 'A message without words',
        text: `A honeybee that finds a good patch of food faces a problem. How can it tell thousands of sisters in the hive where to go? Bees cannot speak, and inside the hive it is almost completely dark.

The answer is a dance. Back in the hive, the forager bee moves across the honeycomb in a special pattern while other bees crowd around and follow it with their antennae. They feel the dance rather than see it.

This behaviour was decoded by the Austrian scientist Karl von Frisch, who spent many years watching bees and later received the Nobel Prize for his work. He showed that the dance carries two pieces of information: which direction to fly, and how far.`,
        questions: [q('Why can bees not see the dance clearly inside the hive?', ['They have no eyes', 'It is almost completely dark', 'They are always asleep', 'The dance is too fast'], 1), q('Who decoded the honeybee dance?', ['Charles Darwin', 'Karl von Frisch', 'Marie Curie', 'Isaac Newton'], 1)],
      },
      {
        heading: 'Direction and distance',
        text: `For food that is far away, the bee performs a "waggle dance". It runs in a straight line while shaking its body from side to side, then loops back and repeats the run again and again.

The direction of the straight run gives the direction of the food. Bees use the sun as their reference: if the run points straight up the honeycomb, the food lies towards the sun. If it points a little to the right of straight up, the food lies the same angle to the right of the sun.

The length of the waggle run tells the distance. A longer waggle means a longer flight. In this way a tiny insect shares a map that can guide its sisters to flowers a few kilometres away.`,
        questions: [q('What does the direction of the waggle run show?', ['The colour of the flowers', 'The direction of the food', 'The age of the bee', 'The size of the hive'], 1), q('What does a longer waggle mean?', ['The food is farther away', 'The bee is tired', 'The food is sweeter', 'It is about to rain'], 0)],
      },
      {
        heading: 'Why it matters to us',
        text: `Bees do much more than make honey. As they move from flower to flower, they carry pollen, which plants need to make fruit and seeds. A large share of the food crops we eat depends on pollinators such as bees.

In many parts of the world, bee numbers have fallen. Loss of wild flowers, some pesticides and diseases all play a part. Farmers and gardeners can help by planting a variety of flowers that bloom at different times and by using chemicals carefully.

The bee dance also teaches a wider lesson. Communication does not always need words. With a simple, shared code, even a small creature can pass on precise information that helps the whole community survive.`,
        questions: [q('Why are bees important for many food crops?', ['They carry pollen between flowers', 'They water the plants', 'They keep birds away', 'They make the soil soft'], 0), q('Which of these is mentioned as a reason bee numbers have fallen?', ['Too many wild flowers', 'Loss of wild flowers', 'Cold winters only', 'Too much honey'], 1)],
      },
    ],
  },
  {
    id: 'en-plastic',
    lang: 'en',
    title: 'Where Does Plastic Go?',
    sections: [
      {
        heading: 'A material that lasts too long',
        text: `Plastic is light, cheap and strong, which is why it is everywhere: in packets, toys, pens, phones and clothes. The same qualities that make it useful also make it a problem. Most plastic does not rot away like paper or food. It can last for hundreds of years.

Only a small part of all the plastic ever made has been recycled. Much of the rest has been burned or buried, or has escaped into the environment. Light plastic bags and wrappers are easily carried by wind and water into drains, canals and finally the ocean.

Once in the sea, plastic is broken by sunlight and waves into smaller and smaller pieces. Pieces smaller than five millimetres are called microplastics.`,
        questions: [q('Why is plastic a problem in the environment?', ['It rots too quickly', 'It can last for hundreds of years', 'It is too heavy to move', 'It is always recycled'], 1), q('What are microplastics?', ['Plastic pieces smaller than five millimetres', 'Very large plastic bottles', 'A kind of fish', 'Plastic made from plants'], 0)],
      },
      {
        heading: 'From the ocean to our plates',
        text: `Sea animals often mistake plastic for food. Turtles swallow floating bags that look like jellyfish, and seabirds feed bits of plastic to their chicks. Large pieces can block an animal's stomach, and nets and rings can trap fins and beaks.

Microplastics are harder to see but spread even further. Scientists have found them in sea salt, in drinking water and in fish that people eat. They have even been found in the snow of high mountains and in the deepest parts of the ocean.

Researchers are still studying what microplastics do inside the human body. What is already clear is that they have reached almost every corner of the planet, carried by rivers, winds and ocean currents.`,
        questions: [q('Why do turtles swallow floating bags?', ['The bags look like jellyfish', 'They like the colour', 'They want to clean the sea', 'The bags taste sweet'], 0), q('Where have microplastics been found, according to the passage?', ['Only in factories', 'In sea salt, drinking water and fish', 'Only on beaches in summer', 'Nowhere outside the ocean'], 1)],
      },
      {
        heading: 'What we can do',
        text: `The most powerful step is simply to use less plastic, especially items used once and thrown away. A cloth bag, a steel water bottle and a lunch box can replace hundreds of plastic items in a single year.

When plastic is used, sorting it helps. Clean, separated plastic is much easier to recycle than plastic mixed with food and other rubbish. Many Indian cities now ask families to keep dry waste apart from wet waste for this reason.

Change also comes from groups. Schools have organised beach and river clean-ups, and some towns have banned thin carry bags. Each small action matters, because the plastic that never reaches the sea is the plastic that never needs to be removed from it.`,
        questions: [q('What does the passage call the most powerful step?', ['Burning plastic at home', 'Using less plastic', 'Making plastic stronger', 'Buying more bags'], 1), q('Why should dry waste be kept apart from wet waste?', ['Clean, separated plastic is easier to recycle', 'Wet waste is heavier', 'It looks tidier', 'Dry waste can be eaten'], 0)],
      },
    ],
  },
  {
    id: 'en-changing-brain',
    lang: 'en',
    title: 'The Brain That Changes',
    sections: [
      {
        heading: 'Not fixed after all',
        text: `For a long time, many scientists believed that the adult brain was fixed: you were born with a certain brain, and after childhood it could not really change. Today we know this is not true.

The brain is made of billions of nerve cells, called neurons, linked by trillions of connections. Every time you learn something, some of these connections become stronger and new ones can form. Connections that are not used become weaker. This ability of the brain to change itself is called neuroplasticity.

You can think of it like a path across a field of grass. The first time you walk across, the path is hard to see. Walk the same way every day, and it becomes clear and easy to follow.`,
        questions: [q('What is the brain’s ability to change itself called?', ['Neuroplasticity', 'Photosynthesis', 'Gravity', 'Evaporation'], 0), q('What happens to connections that are not used?', ['They become stronger', 'They become weaker', 'They turn into new neurons', 'Nothing at all'], 1)],
      },
      {
        heading: 'Seeing change in real brains',
        text: `Brain scans have shown neuroplasticity at work. In a well-known study in London, taxi drivers who spent years learning the city's thousands of streets had a larger hippocampus, the brain area linked to memory and navigation, than people in other jobs.

Musicians show similar changes. Areas of the brain that control their fingers and process sound are often more developed than in non-musicians. Even a few weeks of practising a new skill, such as juggling, can lead to measurable changes in the brain.

Change works in both directions. When a skill is not practised for a long time, the brain areas that supported it can shrink back. In the brain, as in sport, "use it or lose it" is close to the truth.`,
        questions: [q('What did the London taxi driver study find?', ['They had a larger hippocampus', 'They could not remember streets', 'Their brains stopped changing', 'They slept more than others'], 0), q('What does "use it or lose it" mean in the passage?', ['Skills not practised can fade', 'You must buy new things often', 'The brain never changes', 'Only children can learn'], 0)],
      },
      {
        heading: 'Training your own brain',
        text: `Neuroplasticity is good news for every learner. It means ability is not only something you are born with; it grows with the right kind of practice.

Practice works best when it is a little difficult — just beyond what is easy. Short, regular sessions are better than one long session, because the brain strengthens connections between sessions, especially during sleep. Mistakes are useful too: they show the brain where to adjust.

Attention also matters. The brain changes most when you are focused on what you are doing, not when your mind is elsewhere. So when you practise, practise with full attention, rest well, and come back tomorrow. Day by day, the path across the field becomes a road.`,
        questions: [q('According to the passage, when does practice work best?', ['When it is far too easy', 'When it is a little difficult', 'Only once a month', 'When you are very sleepy'], 1), q('Why are short, regular sessions better than one long session?', ['The brain strengthens connections between sessions', 'Long sessions are not allowed', 'Short sessions need no attention', 'The brain only works in the morning'], 0)],
      },
    ],
  },
]
