import type { DailyRsvpPassage } from './passages'

// Daily Speed Read — English passages, one per plan day. Days 1–10 ≈ 110
// words, 11–20 ≈ 130, 21–30 ≈ 150. Well-established facts, told simply; every
// question needs the passage (not general knowledge). The Hindi file has the
// same passages in Hindi, so a day is equally hard in both languages.
export const DAILY_RSVP_PASSAGES_EN: readonly DailyRsvpPassage[] = [
  {
    day: 1,
    title: 'The lotus',
    text: 'The lotus is the national flower of India. It grows in ponds and lakes, with its roots deep in the mud at the bottom. Its large round leaves float on the water. They are covered with a waxy layer, so drops of water roll off them like little pearls and carry dust away. This keeps the leaf clean. The flower opens in the morning and often closes again in the evening. Lotus seeds are very tough. Scientists in China once grew a plant from a lotus seed that was about thirteen hundred years old.',
    questions: [
      { q: 'Where are the roots of the lotus?', options: ['In the mud at the bottom', 'Floating on the water', 'On nearby rocks'], answer: 0 },
      { q: 'Why does water roll off the leaves?', options: ['The leaves are tilted', 'A waxy layer covers them', 'The leaves are very hot'], answer: 1 },
      { q: 'How old was the seed that scientists grew?', options: ['About thirty years', 'About three hundred years', 'About thirteen hundred years'], answer: 2 },
    ],
  },
  {
    day: 2,
    title: 'Camels in the desert',
    text: 'Camels are well made for life in the desert. Many people think a camel stores water in its hump, but the hump is mostly fat. When food is hard to find, the camel lives on this fat. A thirsty camel can drink more than one hundred litres of water in about ten minutes. Thick eyelashes and nostrils that can close keep sand out during storms. Wide, padded feet stop the camel from sinking into soft sand. In Rajasthan, camels have carried people and goods across the Thar Desert for hundreds of years.',
    questions: [
      { q: 'What is the hump mostly made of?', options: ['Water', 'Fat', 'Muscle'], answer: 1 },
      { q: 'How much can a thirsty camel drink in about ten minutes?', options: ['More than one hundred litres', 'About five litres', 'About twenty litres'], answer: 0 },
      { q: 'What stops a camel from sinking into sand?', options: ['Its long legs', 'Its thick eyelashes', 'Wide, padded feet'], answer: 2 },
    ],
  },
  {
    day: 3,
    title: 'How bats find food',
    text: 'Bats fly and hunt at night, when it is too dark to see well. Many bats find their way with sound. A bat makes very high squeaks, often too high for people to hear. The sound hits an insect or a tree and bounces back. By listening to the echo, the bat can tell where the object is, how big it is and how fast it is moving. This is called echolocation. Some bats can catch more than a thousand mosquitoes in one hour. Fruit bats are different: many of them use their large eyes and sharp sense of smell instead.',
    questions: [
      { q: 'What is finding things by echo called?', options: ['Navigation', 'Echolocation', 'Hibernation'], answer: 1 },
      { q: 'How many mosquitoes can some bats catch in an hour?', options: ['About ten', 'About one hundred', 'More than a thousand'], answer: 2 },
      { q: 'What do many fruit bats use instead of echoes?', options: ['Large eyes and smell', 'Their long tails', 'Sounds from other animals'], answer: 0 },
    ],
  },
  {
    day: 4,
    title: 'The Grand Anicut',
    text: 'Nearly two thousand years ago, a Chola king named Karikalan built a dam across the river Kaveri in Tamil Nadu. It is called the Kallanai, or Grand Anicut. The builders used huge, uncut stones and placed them in the flowing river. Sand and water settled between the stones and helped hold them in place. The dam sent the river water into channels so that farmers could grow crops on much more land. The Kallanai is one of the oldest dams in the world that is still in use today, and it still helps farmers in the Kaveri delta.',
    questions: [
      { q: 'Which king built the Kallanai?', options: ['Ashoka', 'Karikalan', 'Akbar'], answer: 1 },
      { q: 'Which river is the dam built across?', options: ['Kaveri', 'Ganga', 'Narmada'], answer: 0 },
      { q: 'What kind of stones did the builders use?', options: ['Small polished stones', 'Bricks made of clay', 'Huge, uncut stones'], answer: 2 },
    ],
  },
  {
    day: 5,
    title: 'The octopus',
    text: 'The octopus is one of the cleverest animals in the sea. It has eight arms, and each arm is lined with suckers that can taste and feel what they touch. An octopus has three hearts and blue blood. It can change the colour and even the texture of its skin in less than a second, to hide against rocks or coral. If it is attacked, it can squirt a cloud of dark ink and swim away. In aquariums, octopuses have learned to open jars to reach the food inside, and some have even escaped from their tanks at night.',
    questions: [
      { q: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three'], answer: 2 },
      { q: 'What can the suckers on its arms do?', options: ['Taste and feel', 'See in the dark', 'Make sounds'], answer: 0 },
      { q: 'What have octopuses learned to open in aquariums?', options: ['Doors', 'Jars', 'Shells'], answer: 1 },
    ],
  },
  {
    day: 6,
    title: 'Why we sleep',
    text: 'Sleep is not just rest. While we sleep, the brain is busy. It sorts the day’s experiences and stores the important ones as long-term memories. That is why students who sleep well after studying usually remember more the next day. During deep sleep, the brain also clears away waste that builds up while we are awake. Most adults need seven to nine hours of sleep each night, and teenagers need even more. Using a phone in bed can make sleep harder, because the bright screen tells the brain that it is still daytime.',
    questions: [
      { q: 'What does the brain store during sleep?', options: ['New muscles', 'Long-term memories', 'Extra energy for eyes'], answer: 1 },
      { q: 'How many hours do most adults need?', options: ['Four to five', 'Seven to nine', 'Ten to twelve'], answer: 1 },
      { q: 'Why can a phone in bed make sleep harder?', options: ['The screen tells the brain it is daytime', 'It is too heavy', 'It makes the room cold'], answer: 0 },
    ],
  },
  {
    day: 7,
    title: 'The Sundarbans',
    text: 'The Sundarbans is the largest mangrove forest in the world. It lies where the Ganga, the Brahmaputra and the Meghna rivers meet the sea, and it is shared by India and Bangladesh. Mangrove trees can grow in salty water. Some of their roots stick up out of the mud like pencils, so that the trees can take in air. The forest protects villages from cyclones by slowing down strong winds and waves. It is also home to the Royal Bengal tiger. Tigers here are good swimmers and often cross the wide rivers between islands.',
    questions: [
      { q: 'Which two countries share the Sundarbans?', options: ['India and Nepal', 'India and Bangladesh', 'India and Sri Lanka'], answer: 1 },
      { q: 'Why do some mangrove roots stick up out of the mud?', options: ['To take in air', 'To catch fish', 'To store salt'], answer: 0 },
      { q: 'How does the forest protect villages?', options: ['By giving them fruit', 'By keeping tigers away', 'By slowing winds and waves'], answer: 2 },
    ],
  },
  {
    day: 8,
    title: 'Honey that lasts',
    text: 'Honey is one of the few foods that almost never spoils. Bees make it from the nectar of flowers. They add special substances from their bodies and fan the nectar with their wings until most of the water dries out. Because honey has very little water and is slightly acidic, germs cannot grow in it. Archaeologists have found pots of honey in ancient Egyptian tombs that were thousands of years old, and the honey was still safe to eat. To make one kilogram of honey, bees together must visit millions of flowers.',
    questions: [
      { q: 'What do bees make honey from?', options: ['Tree sap', 'The nectar of flowers', 'Rain water'], answer: 1 },
      { q: 'How do bees dry out the nectar?', options: ['By fanning it with their wings', 'By leaving it in the sun', 'By mixing it with sand'], answer: 0 },
      { q: 'Where was very old honey found?', options: ['In Roman ships', 'In Indian temples', 'In ancient Egyptian tombs'], answer: 2 },
    ],
  },
  {
    day: 9,
    title: 'Kalpana Chawla',
    text: 'Kalpana Chawla was born in Karnal, Haryana, in 1962. As a child she loved watching aeroplanes and drawing them. She studied aeronautical engineering in Chandigarh, then moved to the United States for higher studies and later joined NASA. In 1997 she flew on the space shuttle Columbia and became the first woman of Indian origin to go to space. On that mission she travelled more than ten million kilometres around the Earth. She died in 2003, when Columbia broke apart on its return. Today many schools and awards in India carry her name.',
    questions: [
      { q: 'Where was Kalpana Chawla born?', options: ['Karnal', 'Chandigarh', 'Mumbai'], answer: 0 },
      { q: 'What did she love as a child?', options: ['Ships', 'Aeroplanes', 'Trains'], answer: 1 },
      { q: 'In which year did she first fly to space?', options: ['1982', '2003', '1997'], answer: 2 },
    ],
  },
  {
    day: 10,
    title: 'The tallest grass',
    text: 'Bamboo looks like a tree, but it is actually a kind of grass. It is one of the fastest-growing plants on Earth. Some kinds can grow almost one metre in a single day. Bamboo is very strong for its weight, so it is used to build houses, bridges and scaffolding, especially in north-east India. Its young shoots are cooked as food. Many bamboo plants flower only once in several decades, and then all the plants of that kind in an area flower together. In Mizoram, this mass flowering has led to sudden increases in the number of rats.',
    questions: [
      { q: 'What kind of plant is bamboo?', options: ['A tree', 'A grass', 'A vine'], answer: 1 },
      { q: 'How much can some bamboo grow in one day?', options: ['Almost one metre', 'About one centimetre', 'About ten metres'], answer: 0 },
      { q: 'What happened in Mizoram after mass flowering?', options: ['Floods', 'A shortage of water', 'More rats'], answer: 2 },
    ],
  },
  {
    day: 11,
    title: 'The stepwell of Patan',
    text: 'In dry parts of western India, people once built stepwells to store rain water. A stepwell is a deep well with long flights of stairs going down to the water. As the water level rose and fell with the seasons, people could walk down as far as they needed. One of the most beautiful is Rani ki Vav in Patan, Gujarat. It was built in the eleventh century by Queen Udayamati in memory of her husband. Its walls are covered with more than five hundred large carved figures. For centuries it lay buried under silt from a flooded river, which protected the carvings. It is now a World Heritage Site.',
    questions: [
      { q: 'Who built Rani ki Vav?', options: ['Queen Udayamati', 'King Ashoka', 'Queen Lakshmibai'], answer: 0 },
      { q: 'Why did people walk down the stairs?', options: ['To pray in a temple', 'To reach the water as its level changed', 'To hide from enemies'], answer: 1 },
      { q: 'What protected the carvings for centuries?', options: ['A roof of iron', 'Guards who lived there', 'Silt from a flooded river'], answer: 2 },
    ],
  },
  {
    day: 12,
    title: 'How plants talk',
    text: 'Plants cannot move or make sounds we can hear, but they still send signals. When caterpillars start eating a tomato plant, the leaves release certain smells into the air. Nearby tomato plants detect these smells and begin making chemicals that make their leaves taste bad, before the caterpillars even reach them. Some of the smells also attract wasps, which hunt the caterpillars. Under the ground, the roots of many trees are joined by thin threads of fungus. Through this network, trees can pass water, sugar and warning signals to one another. Scientists sometimes call it the wood wide web.',
    questions: [
      { q: 'What do tomato leaves release when caterpillars eat them?', options: ['Sounds', 'Smells into the air', 'Bright colours'], answer: 1 },
      { q: 'Which insects are attracted and hunt the caterpillars?', options: ['Wasps', 'Ants', 'Bees'], answer: 0 },
      { q: 'What joins the roots of many trees under the ground?', options: ['Worms', 'Rain water', 'Threads of fungus'], answer: 2 },
    ],
  },
  {
    day: 13,
    title: 'The dabbawalas of Mumbai',
    text: 'Every working day, about five thousand dabbawalas in Mumbai deliver around two lakh lunch boxes. They collect each box from a home in the morning, carry it by bicycle, handcart and local train, and hand it to the right person at an office before lunch. In the afternoon, the empty box goes back home the same way. Most dabbawalas did not study beyond school, and the system does not use computers. Instead, each box is marked with a simple code of colours, numbers and letters that shows where it must go. Business experts from around the world have studied them, because mistakes are extremely rare.',
    questions: [
      { q: 'About how many lunch boxes are delivered each day?', options: ['Around two thousand', 'Around twenty thousand', 'Around two lakh'], answer: 2 },
      { q: 'How is each box marked?', options: ['With a code of colours, numbers and letters', 'With a barcode', 'With the person’s photo'], answer: 0 },
      { q: 'Why have business experts studied the dabbawalas?', options: ['They are very fast cyclists', 'Mistakes are extremely rare', 'They use the newest computers'], answer: 1 },
    ],
  },
  {
    day: 14,
    title: 'The monarch butterfly',
    text: 'Every autumn, millions of monarch butterflies in Canada and the United States fly south to the mountains of Mexico, a journey of up to four thousand kilometres. They spend the winter there, packed together on fir trees. The surprising part is that no single butterfly makes the whole return trip. In spring, the monarchs fly north, lay eggs and die. Their children and grandchildren continue the journey, and it takes about four generations to reach Canada again. Yet the butterflies that fly south the next autumn find the same forests in Mexico, even though they have never been there. Scientists think they use the sun as a compass.',
    questions: [
      { q: 'Where do the monarchs spend the winter?', options: ['In Canada', 'In the mountains of Mexico', 'In Brazil'], answer: 1 },
      { q: 'How many generations does it take to reach Canada again?', options: ['About four', 'One', 'About ten'], answer: 0 },
      { q: 'What do scientists think the butterflies use as a compass?', options: ['The moon', 'The wind', 'The sun'], answer: 2 },
    ],
  },
  {
    day: 15,
    title: 'Zero',
    text: 'Using zero as a number, not just as an empty space, is one of India’s great gifts to the world. In 628 CE, the mathematician Brahmagupta wrote rules for working with zero, such as the rule that any number minus itself equals zero. Indian mathematicians also used a place-value system with only ten digits, where the position of a digit shows whether it means units, tens or hundreds. This made large numbers easy to write and calculate. The system travelled to the Arab world and then to Europe, where people had been using Roman numerals. Today, every computer works with numbers built from just two digits, zero and one.',
    questions: [
      { q: 'Who wrote rules for working with zero in 628 CE?', options: ['Aryabhata', 'Brahmagupta', 'Bhaskara'], answer: 1 },
      { q: 'What does the position of a digit show?', options: ['Its colour', 'Whether it means units, tens or hundreds', 'Whether it is even or odd'], answer: 1 },
      { q: 'Which two digits do computers work with?', options: ['Zero and one', 'One and two', 'Zero and nine'], answer: 0 },
    ],
  },
  {
    day: 16,
    title: 'The power of a short walk',
    text: 'Scientists at Stanford University tested people’s creative thinking while they sat at a desk and while they walked. In one task, people had to think of new uses for an everyday object, such as a tyre. While walking, most people came up with about sixty percent more ideas than while sitting. It did not matter much whether they walked outside or on a treadmill facing a blank wall. The effect also lasted for a short while after the walk ended. Other studies show that even ten minutes of brisk walking can improve mood and attention. So when you feel stuck on a problem, a short walk may help more than staring at it.',
    questions: [
      { q: 'Which university did the study?', options: ['Oxford', 'Harvard', 'Stanford'], answer: 2 },
      { q: 'About how many more ideas did people have while walking?', options: ['Ten percent', 'Sixty percent', 'Two hundred percent'], answer: 1 },
      { q: 'How much brisk walking can improve mood and attention?', options: ['Even ten minutes', 'At least two hours', 'Only a full day'], answer: 0 },
    ],
  },
  {
    day: 17,
    title: 'The iron pillar of Delhi',
    text: 'In the Qutub complex in Delhi stands an iron pillar more than seven metres tall. It was made about sixteen hundred years ago, in the time of the Gupta kings, and it weighs over six tonnes. Iron usually rusts quickly in rain and damp air, yet this pillar has stood in the open for centuries with very little rust. Scientists who studied it found that the iron contains a high amount of phosphorus. Over time, this helped form a thin protective layer on the surface that stops rust from eating deeper into the metal. The pillar shows how skilled ancient Indian metal workers were.',
    questions: [
      { q: 'In which period was the pillar made?', options: ['The Mughal period', 'The time of the Gupta kings', 'The British period'], answer: 1 },
      { q: 'What did scientists find in the iron?', options: ['A high amount of phosphorus', 'A lot of gold', 'Pieces of glass'], answer: 0 },
      { q: 'What stops the rust from going deeper?', options: ['A coat of paint', 'A roof above the pillar', 'A thin protective layer'], answer: 2 },
    ],
  },
  {
    day: 18,
    title: 'Elephants remember',
    text: 'Elephants have the largest brain of any land animal, and they are known for their long memory. In a herd, the oldest female, called the matriarch, leads the group. She remembers where to find water and food, even in places the herd has not visited for many years. During droughts in Africa, herds with older matriarchs were more likely to survive, because they led their families to distant water holes they remembered from long before. Elephants also recognise the calls of dozens of other elephants. They touch and stay with family members who are sick or dying, and they seem to recognise the bones of dead elephants.',
    questions: [
      { q: 'Who leads an elephant herd?', options: ['The oldest female', 'The strongest male', 'The youngest calf'], answer: 0 },
      { q: 'Which herds were more likely to survive droughts?', options: ['Herds with many calves', 'Herds with older matriarchs', 'The largest herds'], answer: 1 },
      { q: 'What do elephants recognise, according to the passage?', options: ['Human faces only', 'The colour of rivers', 'The calls of dozens of elephants'], answer: 2 },
    ],
  },
  {
    day: 19,
    title: 'Chandrayaan-3',
    text: 'On 23 August 2023, India’s Chandrayaan-3 mission landed gently near the south pole of the Moon. India became the first country to land there, and the fourth country to land on the Moon at all. The lander was named Vikram, after Vikram Sarabhai, the father of India’s space programme. It carried a small six-wheeled rover called Pragyan. Pragyan drove about one hundred metres over the surface and studied the soil, finding sulphur and other elements. The south pole interests scientists because some of its deep craters never see sunlight and may hold ice. The day of the landing is now celebrated as National Space Day.',
    questions: [
      { q: 'Where on the Moon did Chandrayaan-3 land?', options: ['Near the north pole', 'Near the south pole', 'At the equator'], answer: 1 },
      { q: 'What was the name of the rover?', options: ['Vikram', 'Mangal', 'Pragyan'], answer: 2 },
      { q: 'Why does the south pole interest scientists?', options: ['Deep craters may hold ice', 'It is the hottest place', 'It has tall mountains of gold'], answer: 0 },
    ],
  },
  {
    day: 20,
    title: 'The forgetting curve',
    text: 'More than a hundred years ago, the German scientist Hermann Ebbinghaus tested his own memory. He learned long lists of nonsense syllables and checked how much he remembered after different amounts of time. He found that memory fades fastest right after learning. Within a day, he had forgotten more than half of what he learned. But each time he reviewed the list, he forgot it more slowly than before. This idea is called spaced repetition. Reviewing new material after one day, then after three days, then after a week, helps it stay in memory far longer than reading it many times in one sitting.',
    questions: [
      { q: 'What did Ebbinghaus learn to test his memory?', options: ['Poems', 'Lists of nonsense syllables', 'Phone numbers'], answer: 1 },
      { q: 'When does memory fade fastest?', options: ['Right after learning', 'After one year', 'During sleep'], answer: 0 },
      { q: 'What is reviewing after growing gaps called?', options: ['Speed reading', 'Deep focus', 'Spaced repetition'], answer: 2 },
    ],
  },
  {
    day: 21,
    title: 'The Konark Sun Temple',
    text: 'On the coast of Odisha stands the Konark Sun Temple, built in the thirteenth century by King Narasimhadeva the First. The whole temple was designed as a giant stone chariot for the Sun god. It has twenty-four huge carved wheels and is pulled by seven stone horses, one for each day of the week. The wheels are not only decoration. Each has eight wide spokes and eight thin spokes, and the shadow cast by the spokes can be used to tell the time of day, like a sundial. Sailors once called the temple the Black Pagoda, because its tall dark tower helped them find their way along the coast. Today, a picture of one of its wheels appears on the Indian ten-rupee note.',
    questions: [
      { q: 'How many horses pull the stone chariot?', options: ['Four', 'Twelve', 'Seven'], answer: 2 },
      { q: 'What can the shadow of the spokes be used for?', options: ['Telling the time of day', 'Predicting rain', 'Finding north'], answer: 0 },
      { q: 'What did sailors call the temple?', options: ['The White Tower', 'The Black Pagoda', 'The Sun Gate'], answer: 1 },
    ],
  },
  {
    day: 22,
    title: 'Tardigrades',
    text: 'Tardigrades, also called water bears, are tiny animals usually less than one millimetre long. They have eight stubby legs with claws and live almost everywhere: in moss, in soil, at the bottom of the sea and high in the mountains. What makes them famous is how much they can survive. When their home dries out, a tardigrade pulls in its legs, loses almost all its water and curls into a dry ball called a tun. In this state it can survive freezing cold, boiling heat and very strong radiation. In 2007, scientists sent tardigrades into space and exposed them to the vacuum outside the spacecraft. After returning to Earth, many of them were given water, woke up and even laid eggs.',
    questions: [
      { q: 'What are tardigrades also called?', options: ['Water bears', 'Moss mice', 'Sea spiders'], answer: 0 },
      { q: 'What is the dry ball a tardigrade curls into called?', options: ['A shell', 'A tun', 'A pod'], answer: 1 },
      { q: 'What happened to many tardigrades after the space trip?', options: ['They grew much bigger', 'They changed colour', 'They woke up and laid eggs'], answer: 2 },
    ],
  },
  {
    day: 23,
    title: 'Srinivasa Ramanujan',
    text: 'Srinivasa Ramanujan was born in 1887 in Erode, Tamil Nadu, and grew up in Kumbakonam. He had almost no formal training in advanced mathematics, but he filled notebooks with remarkable formulas that he discovered on his own. While working as a clerk in Madras, he wrote a letter to the British mathematician G. H. Hardy, containing pages of his results. Hardy was amazed and invited him to Cambridge. There, Ramanujan produced important work on numbers and infinite series. He was elected a Fellow of the Royal Society at just thirty. He fell ill in England and died in 1920, at the age of thirty-two. Mathematicians are still studying his notebooks today. His birthday, 22 December, is celebrated in India as National Mathematics Day.',
    questions: [
      { q: 'To whom did Ramanujan write his famous letter?', options: ['Isaac Newton', 'G. H. Hardy', 'Albert Einstein'], answer: 1 },
      { q: 'What job did he have in Madras?', options: ['Teacher', 'Clerk', 'Doctor'], answer: 1 },
      { q: 'Which day is National Mathematics Day?', options: ['22 December', '15 August', '5 September'], answer: 0 },
    ],
  },
  {
    day: 24,
    title: 'The attention of a goldfish',
    text: 'You may have heard that people today have shorter attention spans than goldfish. This claim spread widely, but researchers could not find any real study behind it. Attention is not a single number. A person who cannot focus on a boring lecture for five minutes may play a game or read an exciting story for two hours. What does change our focus is the environment. Studies show that simply having a smartphone on the desk, even turned face down, can reduce performance on memory and problem-solving tasks, because part of the mind keeps thinking about it. When the phone was in another room, people did better. Focus is less a fixed ability and more a habit we can protect and train.',
    questions: [
      { q: 'What did researchers find about the goldfish claim?', options: ['It was proven true', 'No real study was behind it', 'Goldfish have no attention'], answer: 1 },
      { q: 'When did people do better on the tasks?', options: ['When the phone was in another room', 'When the phone was face down on the desk', 'When they held the phone'], answer: 0 },
      { q: 'According to the passage, what is focus more like?', options: ['A fixed number', 'A gift some people have', 'A habit we can protect and train'], answer: 2 },
    ],
  },
  {
    day: 25,
    title: 'Living root bridges',
    text: 'In the wet hills of Meghalaya, rivers swell so much in the monsoon that wooden bridges rot or wash away. The Khasi and Jaintia people found a remarkable solution. They guide the roots of the rubber fig tree across a stream, often using hollow bamboo or palm trunks as a frame. Over many years, the roots grow longer and thicker and twist together until they form a bridge strong enough for people to walk on. Some of these bridges are over fifty metres long, and some can hold dozens of people at once. Unlike other bridges, a living root bridge grows stronger with age. The famous double-decker bridge near the village of Nongriat has two levels, one above the other. Building such a bridge can take fifteen years or more, so each one is a gift from one generation to the next.',
    questions: [
      { q: 'Which tree’s roots are used for the bridges?', options: ['Banyan', 'Rubber fig', 'Mango'], answer: 1 },
      { q: 'What happens to a living root bridge with age?', options: ['It grows stronger', 'It slowly rots', 'It sinks into the river'], answer: 0 },
      { q: 'Near which village is the double-decker bridge?', options: ['Cherrapunji', 'Shillong', 'Nongriat'], answer: 2 },
    ],
  },
  {
    day: 26,
    title: 'How the brain learns',
    text: 'The brain has about eighty-six billion nerve cells called neurons. Each neuron connects to thousands of others through tiny links called synapses. When you learn something new, such as a word in another language, a group of neurons fires together. Each time you practise, the links between those neurons become stronger and the signal travels more easily. Scientists sum this up as neurons that fire together wire together. The brain can also build new connections and change old ones throughout life. This ability is called neuroplasticity. Studies of London taxi drivers, who must learn thousands of streets, found that a part of the brain linked to memory and navigation, the hippocampus, grew larger as they learned. Practice really does change the shape of the brain.',
    questions: [
      { q: 'What are the tiny links between neurons called?', options: ['Synapses', 'Axons', 'Cells'], answer: 0 },
      { q: 'What is the brain’s ability to change called?', options: ['Concentration', 'Neuroplasticity', 'Reflection'], answer: 1 },
      { q: 'Which group of people was studied in London?', options: ['Musicians', 'Teachers', 'Taxi drivers'], answer: 2 },
    ],
  },
  {
    day: 27,
    title: 'The Great Indian Hornbill',
    text: 'The Great Indian Hornbill lives in the tall forests of the Western Ghats and the north-east. It is a large bird, more than a metre long, with a huge yellow beak topped by a hollow casque. Its nesting habit is unusual. The female enters a hole high in a tree trunk, and the pair seals the entrance with mud, droppings and fruit pulp, leaving only a narrow slit. The female stays inside for weeks, laying eggs and caring for the chick, while the male brings her fruit through the slit, sometimes many times a day. Because hornbills eat many fruits and drop the seeds far away, they help new trees grow, and they are often called the farmers of the forest. They need large old trees to nest, so cutting forests puts them in danger.',
    questions: [
      { q: 'How does the male feed the female?', options: ['He brings fruit through the slit', 'He opens the nest each day', 'She leaves to eat at night'], answer: 0 },
      { q: 'What are hornbills often called?', options: ['Kings of the sky', 'Guards of the river', 'Farmers of the forest'], answer: 2 },
      { q: 'What puts hornbills in danger?', options: ['Too much rain', 'Cutting forests', 'Other birds'], answer: 1 },
    ],
  },
  {
    day: 28,
    title: 'The marshmallow test',
    text: 'In the 1960s, psychologist Walter Mischel offered young children a choice. They could eat one marshmallow right away, or wait alone in a room for about fifteen minutes and then get two. Some children ate it at once. Others covered their eyes, sang songs or looked away to distract themselves, and managed to wait. Years later, the children who waited longer tended, on average, to do better in school. Later research added an important point. When children were first let down by an adult who broke a promise, they waited much less, because they had learned that waiting might not pay off. So self-control depends not only on willpower, but also on trust and on clever strategies, such as moving temptations out of sight.',
    questions: [
      { q: 'Who carried out the marshmallow test?', options: ['Walter Mischel', 'Hermann Ebbinghaus', 'Sigmund Freud'], answer: 0 },
      { q: 'What did some children do to manage the wait?', options: ['Ate half the marshmallow', 'Distracted themselves', 'Asked their parents for help'], answer: 1 },
      { q: 'What happened after an adult broke a promise?', options: ['Children waited longer', 'Children asked for three', 'Children waited much less'], answer: 2 },
    ],
  },
  {
    day: 29,
    title: 'The Kumbh Mela from space',
    text: 'The Kumbh Mela is one of the largest gatherings of people on Earth. It takes place at four holy river sites in India, in a cycle of about twelve years at each place. At the Maha Kumbh in Prayagraj, where the Ganga, the Yamuna and the mythical Saraswati are said to meet, crores of pilgrims come to bathe over several weeks. For the festival, a temporary city is built on the sandy river banks, with roads, pontoon bridges, hospitals, police stations and electricity. Once the festival ends, it is taken down again. The crowd and the tent city are so large that they can be seen in photographs taken by satellites in space. Organising food, water, safety and clean toilets for so many people has been studied by planners from many countries.',
    questions: [
      { q: 'At how many river sites does the Kumbh Mela take place?', options: ['Two', 'Four', 'Twelve'], answer: 1 },
      { q: 'What happens to the temporary city after the festival?', options: ['It becomes a new town', 'It is taken down', 'It is moved to Delhi'], answer: 1 },
      { q: 'From where can the crowd and tent city be seen?', options: ['Satellites in space', 'The top of Mount Everest', 'Ships at sea'], answer: 0 },
    ],
  },
  {
    day: 30,
    title: 'What makes an expert',
    text: 'People often believe that experts are simply born with talent. Research by the psychologist Anders Ericsson tells a different story. He studied violin students at a music academy in Berlin and found that the best players had not just played more. They had spent more hours in a special kind of practice he called deliberate practice. This means working on the hardest parts just beyond your current skill, getting quick feedback, and focusing fully, instead of repeating what is already easy. Playing a piece you know well for an hour feels pleasant but builds little. Slowly fixing the four bars you keep getting wrong is tiring, yet it is exactly what improves skill. The same is true for reading, sport or any skill: steady, focused practice with clear feedback, day after day, is what turns a beginner into an expert. That is what you have been doing for thirty days.',
    questions: [
      { q: 'Whom did Anders Ericsson study in Berlin?', options: ['Football players', 'Violin students', 'Chess players'], answer: 1 },
      { q: 'What does deliberate practice focus on?', options: ['What is already easy', 'Playing for fun', 'The hardest parts just beyond your skill'], answer: 2 },
      { q: 'What turns a beginner into an expert, according to the passage?', options: ['Steady, focused practice with feedback', 'Being born with talent', 'Practising only before exams'], answer: 0 },
    ],
  },
]
