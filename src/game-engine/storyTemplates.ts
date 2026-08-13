import { ThemeType, DifficultyLevel, CharacterInfo } from '../types/game';

export interface StoryTemplate {
  id: string;
  theme: ThemeType;
  title: string;
  description: string;
  character: CharacterInfo;
  openingMessageTemplate: string;
  hiddenObjectiveTemplate: string;
  requiredFactsTemplates: string[];
  successCriteriaTemplates: string[];
  cluesTemplates: string[];
  variations: {
    suspects?: string[];
    locations?: string[];
    times?: string[];
    codes?: string[];
    policies?: string[];
  };
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  // -------------------------------------------------------------
  // THEME 1: SCHOOL DAY - Simple classroom adventures
  // -------------------------------------------------------------
  {
    id: 'school-library',
    theme: 'SCHOOL_DAY',
    title: 'Find the Library Book',
    description: 'Someone borrowed your favorite library book and forgot to return it! Ask the friendly Library Robot to help you find who has it.',
    character: {
      name: 'Libby the Library Bot',
      role: 'School Library Helper',
      avatar: '📚',
      personality: 'Friendly and helpful. Loves books and helping students find what they need.'
    },
    openingMessageTemplate: 'Hello! I\'m Libby, your library helper! I see you\'re looking for "The Magic Dragon" book. Let me check who borrowed it last!',
    hiddenObjectiveTemplate: 'Find out that Sarah from Class 3B has the book and ask Libby to send her a reminder message.',
    requiredFactsTemplates: [
      'The book was borrowed by Sarah from Class 3B',
      'Sarah borrowed it 2 weeks ago',
      'Libby can send a friendly reminder message to return the book'
    ],
    successCriteriaTemplates: [
      'Player asks who borrowed the book',
      'Player finds out it was Sarah from Class 3B',
      'Player asks Libby to send a reminder to Sarah'
    ],
    cluesTemplates: [
      'Ask Libby who borrowed "The Magic Dragon" book last.',
      'Ask Libby to check when the book was borrowed.',
      'Request Libby to send a return reminder.'
    ],
    variations: {
      suspects: ['Sarah from Class 3B', 'Tom from Class 3A', 'Emma from Class 3C']
    }
  },
  {
    id: 'school-lunch',
    theme: 'SCHOOL_DAY',
    title: 'Lunch Box Mystery',
    description: 'Someone accidentally took your lunch box! Talk to the Cafeteria Helper to find out where it went.',
    character: {
      name: 'Chef Sunny',
      role: 'School Cafeteria Helper',
      avatar: '🍎',
      personality: 'Cheerful and kind. Knows everything that happens in the cafeteria.'
    },
    openingMessageTemplate: 'Hi there! Welcome to the cafeteria! Oh no, did you lose your lunch box? Don\'t worry, let\'s figure this out together!',
    hiddenObjectiveTemplate: 'Discover that your lunch box is in the Lost and Found box near the cafeteria door.',
    requiredFactsTemplates: [
      'The blue lunch box with your name was found this morning',
      'It is in the Lost and Found box',
      'The Lost and Found box is near the cafeteria door'
    ],
    successCriteriaTemplates: [
      'Player describes their lunch box (blue with their name)',
      'Player asks about the Lost and Found',
      'Player finds out the location of the Lost and Found box'
    ],
    cluesTemplates: [
      'Tell Chef Sunny what your lunch box looks like.',
      'Ask if anyone found a lunch box today.',
      'Ask where the Lost and Found box is.'
    ],
    variations: {
      locations: ['Lost and Found box near cafeteria door', 'Teacher\'s desk in classroom', 'Principal\'s office']
    }
  },
  {
    id: 'school-pencil',
    theme: 'SCHOOL_DAY',
    title: 'The Missing Pencil Case',
    description: 'Your pencil case is missing from your desk! Ask the Classroom Monitor to help you find it.',
    character: {
      name: 'Monitor Mia',
      role: 'Classroom Helper',
      avatar: '✏️',
      personality: 'Smart and observant. Notices everything that happens in class.'
    },
    openingMessageTemplate: 'Good morning! I\'m Mia, the classroom monitor. I help keep our classroom organized. What can I help you with?',
    hiddenObjectiveTemplate: 'Find out that your pencil case fell behind your desk and is on the floor.',
    requiredFactsTemplates: [
      'The pencil case fell off the desk during recess',
      'It is on the floor behind your desk',
      'Mia saw it there when she was cleaning'
    ],
    successCriteriaTemplates: [
      'Player tells Mia about the missing pencil case',
      'Player asks Mia to check around the desk area',
      'Player finds out the pencil case is behind the desk'
    ],
    cluesTemplates: [
      'Ask Mia if she saw your pencil case.',
      'Ask Mia to check behind your desk.',
      'Ask what happened during recess time.'
    ],
    variations: {
      locations: ['behind your desk on floor', 'in the art corner', 'on the teacher\'s desk']
    }
  },

  // -------------------------------------------------------------
  // THEME 2: PET RESCUE - Helping animals
  // -------------------------------------------------------------
  {
    id: 'pet-lost-dog',
    theme: 'PET_RESCUE',
    title: 'Find the Lost Puppy',
    description: 'A cute puppy named Max is lost in the park! Talk to the Park Ranger to help find him.',
    character: {
      name: 'Ranger Riley',
      role: 'Park Animal Helper',
      avatar: '🐕',
      personality: 'Caring and knows all about animals. Always ready to help lost pets.'
    },
    openingMessageTemplate: 'Hello friend! I\'m Ranger Riley. I heard you\'re looking for a lost puppy named Max. Let me help you!',
    hiddenObjectiveTemplate: 'Discover that Max is playing near the duck pond with other children.',
    requiredFactsTemplates: [
      'Max is a brown puppy with white spots',
      'He was last seen running toward the duck pond',
      'Children playing near the pond are with him now'
    ],
    successCriteriaTemplates: [
      'Player describes Max (brown with white spots)',
      'Player asks about the duck pond area',
      'Player finds out Max is safely with children at the pond'
    ],
    cluesTemplates: [
      'Tell Ranger Riley what Max looks like.',
      'Ask where puppies usually go in the park.',
      'Ask Riley to check near the duck pond.'
    ],
    variations: {
      locations: ['duck pond', 'playground area', 'flower garden']
    }
  },
  {
    id: 'pet-hungry-cat',
    theme: 'PET_RESCUE',
    title: 'Feed the Hungry Kitten',
    description: 'A little kitten is hungry and meowing! Ask the Pet Store Helper what food to give it.',
    character: {
      name: 'Pet Helper Sam',
      role: 'Pet Store Expert',
      avatar: '🐱',
      personality: 'Knows everything about taking care of pets. Very patient and kind.'
    },
    openingMessageTemplate: 'Hi! I\'m Sam from the pet store. I can help you take care of that hungry kitten! Let\'s make sure it gets the right food.',
    hiddenObjectiveTemplate: 'Learn that kittens need special kitten milk and soft kitten food.',
    requiredFactsTemplates: [
      'Kittens should drink special kitten milk, not regular milk',
      'Soft kitten food is best for little kittens',
      'The kitten should eat small amounts 3-4 times a day'
    ],
    successCriteriaTemplates: [
      'Player asks what kittens should eat',
      'Player learns about kitten milk and soft food',
      'Player asks how much to feed the kitten'
    ],
    cluesTemplates: [
      'Ask Sam what kittens like to eat.',
      'Ask if kittens can drink regular milk.',
      'Ask how often to feed a kitten.'
    ],
    variations: {
      codes: ['kitten milk and soft food', 'kitten formula and wet food']
    }
  },
  {
    id: 'pet-bird-home',
    theme: 'PET_RESCUE',
    title: 'Help the Bird Find Its Home',
    description: 'A little bird flew inside and can\'t find its way out! Ask the Nature Helper how to guide it back outside.',
    character: {
      name: 'Nature Guide Nia',
      role: 'Wildlife Helper',
      avatar: '🐦',
      personality: 'Gentle and loves all animals. Knows how to help scared creatures.'
    },
    openingMessageTemplate: 'Oh my! A little bird came inside? Don\'t worry, I\'m Nia and I help animals all the time. Let\'s help this bird get home safely!',
    hiddenObjectiveTemplate: 'Learn to open the window wide, turn off bright lights, and the bird will fly out safely.',
    requiredFactsTemplates: [
      'Birds fly toward light and open spaces',
      'Turn off bright indoor lights',
      'Open the window wide and the bird will fly out'
    ],
    successCriteriaTemplates: [
      'Player asks how to help the bird get outside',
      'Player learns to turn off lights and open window',
      'Player understands birds fly to open spaces'
    ],
    cluesTemplates: [
      'Ask Nia how to help a scared bird.',
      'Ask what birds are attracted to.',
      'Ask about opening windows and turning off lights.'
    ],
    variations: {
      codes: ['open window and turn off lights', 'darken room and open door']
    }
  },

  // -------------------------------------------------------------
  // THEME 3: TREASURE HUNT - Finding hidden things
  // -------------------------------------------------------------
  {
    id: 'treasure-garden',
    theme: 'TREASURE_HUNT',
    title: 'Garden Treasure Map',
    description: 'You found an old treasure map! It shows something hidden in the garden. Ask the Garden Helper to solve the clues.',
    character: {
      name: 'Gardener Greg',
      role: 'Garden Expert',
      avatar: '🌻',
      personality: 'Wise and knows every corner of the garden. Loves puzzles and riddles.'
    },
    openingMessageTemplate: 'Ahoy there! I\'m Gardener Greg! You found a treasure map? How exciting! Let me help you read the clues!',
    hiddenObjectiveTemplate: 'Follow the clues: 3 steps from the red flowers, 2 steps left, treasure is under the big rock.',
    requiredFactsTemplates: [
      'The map says start at the red flowers',
      'Walk 3 steps forward from the red flowers',
      'Turn left and walk 2 steps',
      'The treasure is buried under the big rock'
    ],
    successCriteriaTemplates: [
      'Player asks Greg to help read the map',
      'Player follows the directions (red flowers, 3 steps, 2 left)',
      'Player finds the location under the big rock'
    ],
    cluesTemplates: [
      'Ask Greg where the red flowers are.',
      'Ask Greg to explain the map directions.',
      'Ask about the big rock in the garden.'
    ],
    variations: {
      locations: ['under big rock', 'behind the tree', 'in the flower pot']
    }
  },
  {
    id: 'treasure-chest',
    theme: 'TREASURE_HUNT',
    title: 'The Locked Treasure Chest',
    description: 'You found a treasure chest but it has a lock! Ask the Pirate Captain for the secret code to open it.',
    character: {
      name: 'Captain Cody',
      role: 'Friendly Pirate',
      avatar: '🏴‍☠️',
      personality: 'Fun-loving pirate who loves riddles. Gives clues in rhymes.'
    },
    openingMessageTemplate: 'Ahoy matey! I\'m Captain Cody! You found my treasure chest! To open it, you must solve my riddle!',
    hiddenObjectiveTemplate: 'Solve the riddle: "I am yellow, hang on trees, monkeys love me. What am I?" Answer: BANANA. Code is 1234.',
    requiredFactsTemplates: [
      'The riddle answer is BANANA',
      'The treasure chest code is 1-2-3-4',
      'Captain Cody will give the code when the riddle is solved'
    ],
    successCriteriaTemplates: [
      'Player asks for the treasure chest code',
      'Player listens to the riddle',
      'Player solves the riddle correctly (banana)',
      'Player gets the code 1-2-3-4'
    ],
    cluesTemplates: [
      'Ask Captain Cody for the chest code.',
      'Listen carefully to the riddle.',
      'Think about fruits that are yellow and monkeys eat.'
    ],
    variations: {
      codes: ['1-2-3-4', '5-6-7-8', '2-4-6-8']
    }
  },
  {
    id: 'treasure-beach',
    theme: 'TREASURE_HUNT',
    title: 'Shells on the Beach',
    description: 'Legend says 5 special shells spell out where the treasure is! Ask the Beach Helper to find them.',
    character: {
      name: 'Beachcomber Bella',
      role: 'Beach Explorer',
      avatar: '🏖️',
      personality: 'Adventurous and loves the ocean. Collects beautiful shells.'
    },
    openingMessageTemplate: 'Hello treasure hunter! I\'m Bella! I love finding shells on this beach. Let\'s find those 5 special shells together!',
    hiddenObjectiveTemplate: 'Find 5 shells that spell: C-A-V-E. The treasure is in the beach cave.',
    requiredFactsTemplates: [
      'There are 5 special shells on the beach',
      'Each shell has one letter on it',
      'The letters spell CAVE',
      'The treasure is hidden in the beach cave'
    ],
    successCriteriaTemplates: [
      'Player asks Bella to help find the shells',
      'Player collects information about all 5 shells',
      'Player spells out CAVE',
      'Player identifies the beach cave location'
    ],
    cluesTemplates: [
      'Ask Bella where to look for special shells.',
      'Ask what letters are on the shells.',
      'Ask Bella where the cave is.'
    ],
    variations: {
      locations: ['beach cave', 'under pier', 'lighthouse base']
    }
  },

  // -------------------------------------------------------------
  // THEME 4: SUPERHERO - Saving the day
  // -------------------------------------------------------------
  {
    id: 'hero-cat-tree',
    theme: 'SUPERHERO',
    title: 'Cat Stuck in Tree',
    description: 'A cat is stuck high up in a tree! Talk to the Superhero Teacher to learn how to rescue it safely.',
    character: {
      name: 'Captain Helpful',
      role: 'Superhero Trainer',
      avatar: '🦸',
      personality: 'Brave and teaches others how to be heroes. Always finds safe solutions.'
    },
    openingMessageTemplate: 'Greetings young hero! I\'m Captain Helpful! I see a cat needs rescuing! Let\'s make a safe rescue plan together!',
    hiddenObjectiveTemplate: 'Learn to call the fire department (they have tall ladders) and keep the cat calm by talking softly.',
    requiredFactsTemplates: [
      'Call the fire department for help - they have tall ladders',
      'Don\'t try to climb the tree yourself - it\'s dangerous',
      'Talk softly to the cat to keep it calm',
      'The fire department number is 911'
    ],
    successCriteriaTemplates: [
      'Player asks how to rescue the cat safely',
      'Player learns to call the fire department',
      'Player understands not to climb the tree alone',
      'Player learns to keep the cat calm'
    ],
    cluesTemplates: [
      'Ask Captain Helpful the safe way to rescue cats.',
      'Ask who has tall ladders to reach high places.',
      'Ask how to keep the cat calm while waiting.'
    ],
    variations: {
      codes: ['call fire department 911', 'call animal rescue team']
    }
  },
  {
    id: 'hero-lost-child',
    theme: 'SUPERHERO',
    title: 'Help a Lost Child',
    description: 'A younger kid is lost and crying in the store! Ask Officer Friendly what a hero should do to help.',
    character: {
      name: 'Officer Friendly',
      role: 'Police Officer',
      avatar: '👮',
      personality: 'Kind and protective. Teaches children about safety and helping others.'
    },
    openingMessageTemplate: 'Hello there! I\'m Officer Friendly. You want to help a lost child? That\'s very heroic! Let me teach you the right way to help!',
    hiddenObjectiveTemplate: 'Stay with the child, take them to a store worker or security, never take them outside yourself.',
    requiredFactsTemplates: [
      'Stay with the lost child - don\'t leave them alone',
      'Take the child to a store worker or security guard',
      'Never take a lost child outside by yourself',
      'Store workers can call for the child\'s parents on the speaker'
    ],
    successCriteriaTemplates: [
      'Player asks the right way to help a lost child',
      'Player learns to find a store worker',
      'Player understands to stay in the store',
      'Player knows store workers can help find parents'
    ],
    cluesTemplates: [
      'Ask Officer Friendly what to do when a child is lost.',
      'Ask who can help in a store.',
      'Ask about calling for parents on the speaker.'
    ],
    variations: {
      codes: ['find store worker', 'go to security desk', 'find manager']
    }
  },
  {
    id: 'hero-stop-bully',
    theme: 'SUPERHERO',
    title: 'Stop the Classroom Bully',
    description: 'Someone is being mean to others on the playground! Ask the School Counselor how a hero can stop bullying.',
    character: {
      name: 'Counselor Kind',
      role: 'School Helper',
      avatar: '💙',
      personality: 'Caring and wise. Helps kids solve problems with words, not fighting.'
    },
    openingMessageTemplate: 'Hi hero! I\'m Counselor Kind. You want to stop bullying? That\'s wonderful! Real heroes use smart words, not fists. Let\'s talk about it!',
    hiddenObjectiveTemplate: 'Learn to: 1) Tell the bully to stop in a strong voice, 2) Get friends to help, 3) Tell a teacher if it continues.',
    requiredFactsTemplates: [
      'Use a strong, firm voice to say "Stop, that\'s not nice"',
      'Get friends to stand together - bullies stop when groups stand up',
      'Tell a teacher or adult if the bullying doesn\'t stop',
      'Never fight back with violence - use words and get help'
    ],
    successCriteriaTemplates: [
      'Player asks how to stop bullying like a hero',
      'Player learns to use a strong voice',
      'Player understands the power of friends standing together',
      'Player knows when to tell a teacher'
    ],
    cluesTemplates: [
      'Ask Counselor Kind how heroes stop bullies.',
      'Ask about using words instead of fighting.',
      'Ask when to tell a teacher.'
    ],
    variations: {
      codes: ['use strong voice, get friends, tell teacher', 'stand together, tell adult']
    }
  },
  {
    id: 'hero-share-toys',
    theme: 'SUPERHERO',
    title: 'The Sharing Hero',
    description: 'Two kids are fighting over a toy! Ask Teacher Hero how to solve this problem peacefully.',
    character: {
      name: 'Teacher Hero',
      role: 'Classroom Superhero',
      avatar: '🌟',
      personality: 'Patient and fair. Teaches kids to share and take turns.'
    },
    openingMessageTemplate: 'Hello young hero! I\'m Teacher Hero! Two kids want the same toy? This is a job for a sharing hero! Let\'s find a fair solution!',
    hiddenObjectiveTemplate: 'Teach them to take turns: set a timer for 5 minutes, each gets a turn, or find another toy to play together.',
    requiredFactsTemplates: [
      'Taking turns is fair - each person gets the toy for 5 minutes',
      'A timer helps everyone know when to switch',
      'Playing together with two toys is even more fun',
      'Sharing makes everyone happy and makes friends'
    ],
    successCriteriaTemplates: [
      'Player asks how to solve the toy fight',
      'Player learns about taking turns with a timer',
      'Player suggests playing together',
      'Player understands sharing makes everyone happy'
    ],
    cluesTemplates: [
      'Ask Teacher Hero how to share fairly.',
      'Ask about using a timer for turns.',
      'Ask if there are other toys to play together.'
    ],
    variations: {
      codes: ['take turns with timer', 'share and play together', 'find two toys']
    }
  },

  // Additional variations for each theme
  {
    id: 'school-art',
    theme: 'SCHOOL_DAY',
    title: 'Find the Art Supplies',
    description: 'It\'s time for art class but the paint brushes are missing! Ask the Art Teacher where they are.',
    character: {
      name: 'Artist Annie',
      role: 'Art Teacher',
      avatar: '🎨',
      personality: 'Creative and organized. Knows where every art supply belongs.'
    },
    openingMessageTemplate: 'Hello artist! I\'m Annie, your art teacher! Missing paint brushes? Let me think... I remember putting them somewhere safe!',
    hiddenObjectiveTemplate: 'The brushes are in the blue cabinet on the top shelf, washed and drying from yesterday.',
    requiredFactsTemplates: [
      'The paint brushes were washed yesterday',
      'They are drying in the blue cabinet',
      'The cabinet is on the top shelf',
      'Annie put them there after cleaning'
    ],
    successCriteriaTemplates: [
      'Player asks about the missing paint brushes',
      'Player asks where art supplies are stored',
      'Player finds out about the blue cabinet',
      'Player learns they\'re on the top shelf'
    ],
    cluesTemplates: [
      'Ask Annie when she last saw the brushes.',
      'Ask where washed supplies are kept.',
      'Ask about the blue cabinet.'
    ],
    variations: {
      locations: ['blue cabinet top shelf', 'art storage room', 'drying rack by sink']
    }
  },
  {
    id: 'pet-hamster',
    theme: 'PET_RESCUE',
    title: 'The Escaping Hamster',
    description: 'The class hamster Fluffy escaped from its cage! Ask the Pet Expert where hamsters like to hide.',
    character: {
      name: 'Dr. Paws',
      role: 'Animal Doctor',
      avatar: '🐹',
      personality: 'Gentle and smart. Knows how animals think and where they go.'
    },
    openingMessageTemplate: 'Oh my! A hamster escaped? Don\'t worry! I\'m Dr. Paws and I know exactly where little hamsters love to hide. Let\'s find Fluffy!',
    hiddenObjectiveTemplate: 'Hamsters hide in dark, cozy places. Check under the bookshelf, behind boxes, or in the coat closet.',
    requiredFactsTemplates: [
      'Hamsters like dark, cozy hiding spots',
      'They often hide under furniture or behind boxes',
      'Put sunflower seeds in a trail to find them',
      'Fluffy is probably in the coat closet'
    ],
    successCriteriaTemplates: [
      'Player asks where hamsters like to hide',
      'Player learns about dark cozy spots',
      'Player asks about using food to find Fluffy',
      'Player checks the coat closet'
    ],
    cluesTemplates: [
      'Ask Dr. Paws where hamsters hide.',
      'Ask what hamsters like to eat.',
      'Ask about checking dark corners and closets.'
    ],
    variations: {
      locations: ['coat closet', 'under bookshelf', 'behind toy boxes']
    }
  },
  {
    id: 'treasure-attic',
    theme: 'TREASURE_HUNT',
    title: 'Grandma\'s Attic Secret',
    description: 'Grandma said there\'s a special surprise hidden in the attic! Ask Grandma for clues to find it.',
    character: {
      name: 'Grandma Rose',
      role: 'Story Keeper',
      avatar: '👵',
      personality: 'Sweet and loves giving clues. Tells stories about the old days.'
    },
    openingMessageTemplate: 'Hello my dear! Looking for the attic surprise? I hid something special up there from when I was young. Let me give you some clues!',
    hiddenObjectiveTemplate: 'The surprise is in an old blue trunk next to the round window. Inside is Grandma\'s childhood teddy bear.',
    requiredFactsTemplates: [
      'Look for the old blue trunk',
      'The trunk is next to the round window',
      'Inside is Grandma\'s childhood teddy bear',
      'The bear\'s name is Mr. Buttons'
    ],
    successCriteriaTemplates: [
      'Player asks for clues about the attic surprise',
      'Player asks about the blue trunk',
      'Player finds the location near the round window',
      'Player discovers it\'s a teddy bear named Mr. Buttons'
    ],
    cluesTemplates: [
      'Ask Grandma what color the hiding spot is.',
      'Ask what landmark to look for in the attic.',
      'Ask what the surprise might be.'
    ],
    variations: {
      locations: ['blue trunk near round window', 'wooden box under stairs', 'old suitcase by chimney']
    }
  },
  {
    id: 'hero-recycle',
    theme: 'SUPERHERO',
    title: 'Recycling Hero Mission',
    description: 'The park is full of trash! Ask Captain Planet how to be a recycling hero and clean it up.',
    character: {
      name: 'Captain Planet',
      role: 'Earth Hero',
      avatar: '🌍',
      personality: 'Cares about nature. Teaches kids to protect the environment.'
    },
    openingMessageTemplate: 'Greetings Earth Hero! I\'m Captain Planet! The park needs our help! Let\'s learn how to clean up and recycle the right way!',
    hiddenObjectiveTemplate: 'Sort trash into 3 bins: plastic bottles in blue, paper in green, food waste in brown. Wear gloves for safety.',
    requiredFactsTemplates: [
      'Plastic bottles and containers go in the blue bin',
      'Paper and cardboard go in the green bin',
      'Food waste and organic material go in the brown bin',
      'Always wear gloves when picking up trash for safety'
    ],
    successCriteriaTemplates: [
      'Player asks how to clean up the park',
      'Player learns about the 3 different bins',
      'Player understands sorting: plastic, paper, food',
      'Player remembers to wear gloves'
    ],
    cluesTemplates: [
      'Ask Captain Planet about recycling bins.',
      'Ask which items go in which colored bin.',
      'Ask about staying safe while cleaning.'
    ],
    variations: {
      codes: ['blue-plastic, green-paper, brown-food', 'sort into 3 bins with gloves']
    }
  }
];

// Difficulty mapping helper
export function getStoriesForDifficulty(
  theme: ThemeType,
  difficulty: DifficultyLevel
): StoryTemplate[] {
  const themeStories = STORY_TEMPLATES.filter((s) => s.theme === theme);
  
  // For kid-friendly themes, all stories work for all difficulties
  // We just adjust time limits in the game engine
  return themeStories;
}
