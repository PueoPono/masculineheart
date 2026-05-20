export type CourseLesson = {
  id: string
  dayNumber: number
  arc: 'Heart Unlock' | 'Iron John / Language of the Heart' | 'Intentions Worth Planting'
  title: string
  slug: string
  theme: string
  videoLabel: string
  practice: string
  prompts: string[]
}

export const courseLessons: CourseLesson[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    arc: 'Heart Unlock',
    title: 'Welcome to the Heart',
    slug: 'day-1',
    theme: 'Begin by stepping beneath performance and into an honest first meeting with the masculine heart.',
    videoLabel: 'Intro + Day 1 lesson',
    practice: 'Find a quiet place. Put one hand on the chest, breathe slowly, and write without trying to sound wise.',
    prompts: ['What pain am I carrying now?', 'Where do I already know I am defended?', 'What would it mean to step down into the heart honestly?'],
  },
  {
    id: 'day-2', dayNumber: 2, arc: 'Heart Unlock', title: 'Sadness and Scars', slug: 'day-2',
    theme: 'Let sadness become information instead of evidence that something is wrong with you.',
    videoLabel: 'Heart Unlock · Sadness', practice: 'Name one old scar without explaining it away. Let the body tell the truth before the mind edits it.',
    prompts: ['What sadness have I trained myself to minimize?', 'Where did I first learn to hide this feeling?', 'What tenderness is still alive beneath the scar?'],
  },
  {
    id: 'day-3', dayNumber: 3, arc: 'Heart Unlock', title: 'Anger and Defenses', slug: 'day-3',
    theme: 'Meet anger as boundary, protection, and sometimes as the guard standing in front of grief.',
    videoLabel: 'Heart Unlock · Anger', practice: 'Write the sentence “I am angry because…” ten times and let each ending be different.',
    prompts: ['What anger in me is asking for clean expression?', 'What does this anger protect?', 'Where can I set a boundary without becoming cruel?'],
  },
  {
    id: 'day-4', dayNumber: 4, arc: 'Heart Unlock', title: 'Numbing and Disconnection', slug: 'day-4',
    theme: 'Notice where the heart goes offline, and return with patience rather than force.',
    videoLabel: 'Heart Unlock · Numbing', practice: 'Choose one numbing habit to pause for one evening. Replace it with walking, writing, or silence.',
    prompts: ['When do I most often leave myself?', 'What am I trying not to feel in those moments?', 'What would a gentle return look like today?'],
  },
  {
    id: 'day-5', dayNumber: 5, arc: 'Heart Unlock', title: 'Shame and Not-Enoughness', slug: 'day-5',
    theme: 'Separate the original self from the shame story that has been laid over it.',
    videoLabel: 'Heart Unlock · Shame', practice: 'Write a compassionate letter to the part of you that still believes it is not enough.',
    prompts: ['What shame story has shaped my identity?', 'Whose voice does it sound like?', 'What truth about me existed before that story?'],
  },
  {
    id: 'day-6', dayNumber: 6, arc: 'Heart Unlock', title: 'Regret and Consequence', slug: 'day-6',
    theme: 'Let regret mature into responsibility without collapsing into self-punishment.',
    videoLabel: 'Heart Unlock · Regret', practice: 'Choose one regret and write the clean lesson it is asking you to carry forward.',
    prompts: ['What consequence am I ready to stop avoiding?', 'What can be repaired, even in a small way?', 'What would responsibility look like without self-hatred?'],
  },
  {
    id: 'day-7', dayNumber: 7, arc: 'Heart Unlock', title: 'Choosing to Feel', slug: 'day-7',
    theme: 'Close the first arc by choosing feeling as strength, not weakness.',
    videoLabel: 'Heart Unlock · Integration', practice: 'Review the week. Circle the feeling you most resisted and the truth it carried.',
    prompts: ['What has opened in me this week?', 'What feeling do I need to keep welcoming?', 'How will I practice emotional honesty tomorrow?'],
  },
  {
    id: 'day-8', dayNumber: 8, arc: 'Iron John / Language of the Heart', title: 'Entering the Story', slug: 'day-8',
    theme: 'Step into story as a symbolic mirror for masculine development.',
    videoLabel: 'Iron John · Entering story', practice: 'Read or listen as if the story is happening inside you, not outside you.',
    prompts: ['What part of the story feels uncomfortably familiar?', 'Where am I being invited below the surface?', 'What image or symbol stays with me?'],
  },
  {
    id: 'day-9', dayNumber: 9, arc: 'Iron John / Language of the Heart', title: 'The Cage and the False Self', slug: 'day-9',
    theme: 'Look at the places where wildness, vitality, and truth have been caged for approval.',
    videoLabel: 'Iron John · The cage', practice: 'Draw or describe the cage: its bars, its keeper, and what it claims to protect you from.',
    prompts: ['Where do I perform a safer version of myself?', 'What part of me has been caged?', 'What would respectful wildness look like?'],
  },
  {
    id: 'day-10', dayNumber: 10, arc: 'Iron John / Language of the Heart', title: 'Non-Judgement and Inner Gold', slug: 'day-10',
    theme: 'Recover attention from judgement so inner gold can be noticed again.',
    videoLabel: 'Iron John · Inner gold', practice: 'For one day, when judgement appears, ask what value or wound it is protecting.',
    prompts: ['What do I judge most harshly in myself?', 'What gold might be hidden near that wound?', 'How can I look without immediately condemning?'],
  },
  {
    id: 'day-11', dayNumber: 11, arc: 'Iron John / Language of the Heart', title: 'Breath and State Change', slug: 'day-11',
    theme: 'Use breath as an immediate doorway from reaction into presence.',
    videoLabel: 'Language of the Heart · Breath', practice: 'Practice five slow breaths before any important reply today.',
    prompts: ['What changes in my body when I slow the breath?', 'Where do I confuse urgency with truth?', 'What response becomes available after breathing?'],
  },
  {
    id: 'day-12', dayNumber: 12, arc: 'Iron John / Language of the Heart', title: 'Tending the Inner Garden', slug: 'day-12',
    theme: 'Treat the inner life as something cultivated, not conquered.',
    videoLabel: 'Language of the Heart · Garden', practice: 'Name one weed, one seed, and one living thing in the inner garden today.',
    prompts: ['What inner pattern needs less feeding?', 'What quality needs deliberate cultivation?', 'What has quietly been growing in me already?'],
  },
  {
    id: 'day-13', dayNumber: 13, arc: 'Iron John / Language of the Heart', title: 'The Earth and the Masculine Heart', slug: 'day-13',
    theme: 'Ground masculinity in body, earth, humility, and contact with what is real.',
    videoLabel: 'Language of the Heart · Earth', practice: 'Spend time outside without headphones. Let the natural world set the pace.',
    prompts: ['Where does my body ask for more groundedness?', 'What does the earth teach me about strength?', 'How can I be more rooted in daily life?'],
  },
  {
    id: 'day-14', dayNumber: 14, arc: 'Iron John / Language of the Heart', title: 'Identity, Shadow, and the Rest of the Story', slug: 'day-14',
    theme: 'Allow shadow to become part of the story without letting it become the whole identity.',
    videoLabel: 'Iron John · Shadow integration', practice: 'Write about one disowned trait as if it had an honorable purpose before it became distorted.',
    prompts: ['What part of me have I refused to include?', 'How has this shadow tried to help me survive?', 'What fuller identity is becoming possible?'],
  },
  {
    id: 'day-15', dayNumber: 15, arc: 'Intentions Worth Planting', title: 'Intention as Practice', slug: 'day-15',
    theme: 'Move from insight into deliberate planting: what you practice, you become.',
    videoLabel: 'Intentions · Practice', practice: 'Choose one simple intention and connect it to an action you can repeat daily.',
    prompts: ['What intention feels alive rather than performative?', 'What daily action can carry it?', 'What will remind me when I forget?'],
  },
  {
    id: 'day-16', dayNumber: 16, arc: 'Intentions Worth Planting', title: 'Be Kind', slug: 'day-16',
    theme: 'Practice kindness as strength with warmth, clarity, and boundaries.',
    videoLabel: 'Intentions · Be Kind', practice: 'Offer one concrete kindness today without abandoning yourself.',
    prompts: ['Where can kindness become more active in my life?', 'Where does kindness need a boundary?', 'How can I speak to myself with less violence?'],
  },
  {
    id: 'day-17', dayNumber: 17, arc: 'Intentions Worth Planting', title: 'Be Beauty', slug: 'day-17',
    theme: 'Recover beauty as a lived quality that refines attention and conduct.',
    videoLabel: 'Intentions · Be Beauty', practice: 'Make one small part of your environment more beautiful and notice what changes inside.',
    prompts: ['What kind of beauty restores me?', 'Where have I tolerated ugliness in my habits?', 'How can beauty guide action today?'],
  },
  {
    id: 'day-18', dayNumber: 18, arc: 'Intentions Worth Planting', title: 'Be Love', slug: 'day-18',
    theme: 'Let love become practice, not only feeling or longing.',
    videoLabel: 'Intentions · Be Love', practice: 'Choose one relationship or part of yourself and act from love in a visible way.',
    prompts: ['Where is love asking for courage?', 'What does love require beyond sentiment?', 'How can I become more loving without losing truth?'],
  },
  {
    id: 'day-19', dayNumber: 19, arc: 'Intentions Worth Planting', title: 'Be Abundance', slug: 'day-19',
    theme: 'Meet abundance as inner overflow, gratitude, generosity, and trust in participation.',
    videoLabel: 'Intentions · Be Abundance', practice: 'Give, appreciate, or create from enoughness rather than lack.',
    prompts: ['Where do I live from scarcity by default?', 'What abundance is already present?', 'What generous action can I take from enoughness?'],
  },
  {
    id: 'day-20', dayNumber: 20, arc: 'Intentions Worth Planting', title: 'Be Receptive', slug: 'day-20',
    theme: 'Practice receptivity as masculine maturity: listening, receiving, and allowing life to touch you.',
    videoLabel: 'Intentions · Be Receptive', practice: 'Receive one compliment, offer, emotion, or moment of beauty without deflecting it.',
    prompts: ['What do I have difficulty receiving?', 'What defense appears when something good arrives?', 'How can receptivity become strength?'],
  },
  {
    id: 'day-21', dayNumber: 21, arc: 'Intentions Worth Planting', title: 'Be Ever-Expansive', slug: 'day-21',
    theme: 'Complete the quest by orienting toward an ever-expanding life rooted in the heart.',
    videoLabel: 'Intentions · Integration', practice: 'Write your next 21-day commitment and the kind of man it serves.',
    prompts: ['What has expanded through this quest?', 'What is the next honest edge of growth?', 'How will I keep the heart involved in the path ahead?'],
  },
]

export function getLessonBySlug(slug: string) {
  return courseLessons.find((lesson) => lesson.slug === slug)
}

export function getPreviousLesson(lesson: CourseLesson) {
  return courseLessons.find((candidate) => candidate.dayNumber === lesson.dayNumber - 1) || null
}

export function getNextLesson(lesson: CourseLesson) {
  return courseLessons.find((candidate) => candidate.dayNumber === lesson.dayNumber + 1) || null
}
