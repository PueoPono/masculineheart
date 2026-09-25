export type OverviewCard = {
  title: string
  text: string
}

export type LandingContent = {
  navEyebrow: string
  navLabel: string
  heroEyebrow: string
  heroTitle: string
  heroBody: string
  heroSupport: string
  primaryCta: string
  secondaryCta: string
  tertiaryCta: string
  purchaseHeading: string
  overviewCards: OverviewCard[]
  brandEyebrow: string
  pageTitle: string
  journeyDescription: string
  quoteLine1: string
  quoteLine2: string
  purchaseBody: string
  portalLinkLabel: string
  journeyEyebrow: string
  journeyBody: string
  previewEyebrow: string
  previewTitle: string
  previewIntroLine1: string
  previewIntroLine2: string
}

export type PortalContent = {
  eyebrow: string
  title: string
  adminUnlockedNote?: string
  progressHeading?: string
  completedLessonsLabel?: string
  dripHeading?: string
  dripBody?: string
  dripSupport?: string
  nextAvailableEyebrow: string
  nextAvailableBody: string
  nextAvailableCta?: string
  allLessonsOpenBody?: string
  mapHeading: string
  mapBody: string
  integrationHeading: string
  integrationBody: string
  integrationAdminBypass?: string
  trackLabels?: string[]
  trackTitles?: string[]
  trackDaysLabels?: string[]
  trackStatusLabel?: string
  trackNotes: string[]
}

export type StatusPageContent = {
  eyebrow: string
  title: string
  body: string
  cardHeading: string
  cardBody?: string
  backToPortalLabel?: string
  loadingDetail?: string
  missingSessionDetail?: string
  missingPreviousDetail?: string
  progressLoadErrorDetail?: string
  videoNotCompleteDetail?: string
  unlockReadyDetail?: string
  savedWithoutNextDetail?: string
  ceremonyEyebrow?: string
  ceremonyTitle?: string
  ceremonyBody?: string
}

export type QuestionnaireField = {
  id: string
  label: string
  type: 'text' | 'textarea' | 'choice'
  options?: string[]
}

export type QuestionnaireContent = {
  eyebrow: string
  title: string
  introLines: string[]
  quote: string
  fields: QuestionnaireField[]
  closingBody: string
  saveButton: string
  savingButton: string
  submitButton: string
  submitAgainButton: string
  submittingButton: string
  returnToCourseLabel: string
  choosePlaceholder: string
  progressSuffix: string
  loadingStatus: string
  localOnlyStatus: string
  draftStatus: string
  submittedStatus: string
  submittedNotifiedStatus: string
  savedStatus: string
  alreadySubmittedStatus: string
  loadErrorStatus: string
  saveErrorStatus: string
  submitErrorStatus: string
}

export type SiteShellContent = {
  homeIntroLinkLabel: string
  portalLoginTitle: string
  portalLoginCta: string
  portalNotEnrolledTitle: string
  portalBackToLandingLabel: string
  portalLoadingLabel: string
  portalSignedInPrefix: string
  portalCompletionTotalLabel: string
  portalCompletionMapLabel: string
  portalCompletionMapBody: string
  portalLessonsCompleteSuffix: string
  portalSectionCompleteSuffix: string
  portalAvailableStatus: string
  portalCompleteStatus: string
  portalLockedStatus: string
  portalAdminOpenStatus: string
  portalUnlocksPrefix: string
  lessonMissingTitle: string
  lessonMissingBody: string
  lessonMissingCta: string
  lessonRefreshLabel: string
  lessonDefaultSupportingHeading: string
  lessonDefaultVideoHeading: string
  lessonDefaultIntroVideoHeading: string
  lessonDefaultMarkVideoCompleteLabel: string
  lessonDefaultVideoCompleteSavedLabel: string
  lessonDefaultCompleteLessonLabel: string
  lessonDefaultCompleteFinalLessonLabel: string
  lessonReflectionPlaceholder: string
  lessonDefaultSaveReflectionLabel: string
  lessonSavingLabel: string
  lessonNextAvailableAfterCompletion: string
  lessonNextAvailableAfterUnlock: string
  lessonReflectionSavedStatus: string
  lessonReflectionSaveErrorStatus: string
  lessonCompletionSaveErrorStatus: string
  lessonFinalReflectionEmailErrorStatus: string
}

export type LessonContent = {
  id: string
  dayNumber: number
  arc: 'Heart Unlock' | 'Iron John / Language Of The Heart' | 'Intentions Worth Planting'
  stepLabel: string
  immediateUnlockNext?: boolean
  title: string
  slug: string
  theme: string
  rhythmHeading?: string
  adminUnlockedNote?: string
  videoLabel: string
  videoHeading?: string
  videoUrl: string
  videoSupport: string
  markVideoCompleteLabel?: string
  videoCompleteSavedLabel?: string
  completeLessonLabel?: string
  completeFinalLessonLabel?: string
  supportingTextHeading?: string
  supportingPoints: string[]
  integrationHeading: string
  integrationBody: string
  practiceHeading?: string
  practice: string
  reflectionPromptsHeading?: string
  promptLabelPrefix?: string
  prompts: string[]
  journalPromptHeading?: string
  journalPrompt: string
  previousLessonLabel?: string
  backToPortalLabel?: string
  nextLessonLabel?: string
}

export type SiteContent = {
  landing: LandingContent
  portal: PortalContent
  locked: StatusPageContent
  complete: StatusPageContent
  questionnaire: QuestionnaireContent
  shell: SiteShellContent
  lessons: LessonContent[]
}

export type CourseTrack = {
  id: string
  label: string
  title: string
  lessonIds: string[]
  daysLabel: string
  editorNote: string
}

const lessonHeaderBackgrounds: Record<LessonContent['arc'], string> = {
  'Heart Unlock': "linear-gradient(135deg,rgba(7,12,20,0.74),rgba(12,10,9,0.58) 42%,rgba(12,10,9,0.9)),url('/images/part-one-heart-locks-fence.jpg')",
  'Iron John / Language Of The Heart': "linear-gradient(135deg,rgba(5,18,22,0.76),rgba(11,23,24,0.58) 42%,rgba(9,12,10,0.93)),url('/images/part-two-golden-pond.jpg')",
  'Intentions Worth Planting': "linear-gradient(135deg,rgba(9,15,10,0.76),rgba(31,20,12,0.6) 42%,rgba(9,10,7,0.93)),url('/images/part-three-intentions-planting.jpg')",
}

export function getLessonHeaderBackgroundStyle(arc: LessonContent['arc']) {
  return {
    backgroundImage: lessonHeaderBackgrounds[arc],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

const lessons: LessonContent[] = [
  {
    id: 'heart-intro',
    dayNumber: 1,
    arc: 'Heart Unlock',
    stepLabel: 'Intro',
    immediateUnlockNext: true,
    title: 'Introduction',
    slug: 'heart-intro',
    theme: 'Welcome... To your Heart 🫶',
    videoLabel: 'Heart Unlock · Intro · Introduction',
    videoHeading: 'Intro video',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274627/GRtZBn0eSk1cGGfksh3i',
    videoSupport: "",
    markVideoCompleteLabel: 'Go to Lesson 1',
    videoCompleteSavedLabel: 'Lesson 1 is open',
    supportingPoints: [
      "Only 10-20 minutes a day for 7 days.",
      "1- Watch the intro video.",
      "2- Watch Lesson 1 video.",
      "One Day At A Time!",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Only 10-20 minutes a day for 7 days. One Day At A Time!',
    practice: "",
    prompts: [],
    journalPrompt: '',
  },
  {
    id: 'heart-day-1',
    dayNumber: 2,
    arc: 'Heart Unlock',
    stepLabel: 'Day 1',
    title: 'Purpose to Pain',
    slug: 'heart-day-1',
    theme: 'Identifying the pain is the first step to understanding the pain and relieving the pain.',
    videoLabel: 'Heart Unlock · Day 1 · Purpose to Pain',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274629/xyyLSPiIRAYmKJYcidt5',
    videoSupport: "",
    supportingPoints: [
      "1- Watch the video on identifying emotional pain.",
      "2- Complete the Heart Fitness Exercise for Day 1",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Complete today’s Heart Fitness Exercise before continuing.',
    practice: "Watch the video, then write on the top of a page: What is my pain? Use this page, or another notebook. Write down pain you feel, or have felt and know of. Even if it's just one thing. Then practice the acceptance tool, like a rep for a dumbbell curl, but for your Heart. Add to the list through the week, as you notice other pains in your life.",
    prompts: [
      "What is my pain?",
    ],
    journalPrompt: 'Identify the pain as clearly as you can and write what you understand about it.',
  },
  {
    id: 'heart-day-2',
    dayNumber: 3,
    arc: 'Heart Unlock',
    stepLabel: 'Day 2',
    title: 'On Scars',
    slug: 'heart-day-2',
    theme: 'Sadness may be one of the first wounds we try to cover over... and it leaves scars.',
    videoLabel: 'Heart Unlock · Day 2 · On Scars',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274630/uwXUyPPgvVqmooDz9Iaf',
    videoSupport: "",
    supportingPoints: [
      "Watch the video, then complete the Heart Fitness Exercise below.",
      "1- Watch the video on identifying sadness",
      "2- Complete the Heart Fitness Exercise for Day 2",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Complete today’s Heart Fitness Exercise before continuing.',
    practice: "Watch the video for Day 2. Take time and ask yourself what brings you sadness. Write the question and list/write about everything that comes to mind. Give yourself permission to feel. Then write and answer why it is important for you to know and acknowledge your pain.",
    prompts: [
      "What sadness exists within me?",
      "Have I tried to avoid my sadness in any way?",
      "What scars (or resentments) has my sadness left?",
      "As you prause and take a few breaths, Is there any other sadness I can identify?",
      "What are the things that bring me sadness?",
      "Why is it important for me, to know and acknowledge my Pain?",
    ],
    journalPrompt: 'Write about one sadness and the scar it has left.',
  },
  {
    id: 'heart-day-3',
    dayNumber: 4,
    arc: 'Heart Unlock',
    stepLabel: 'Day 3',
    title: 'Anger and Defenses.',
    slug: 'heart-day-3',
    theme: 'Emotional sovereignty is having the power and skill to maintain my own emotional state.',
    videoLabel: 'Heart Unlock · Day 3 · Anger and Defenses.',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274690/yxSxVfS4jmBTieY9gEVN',
    videoSupport: "",
    supportingPoints: [
      "Watch the video, then complete the Heart Fitness Exercise below.",
      "1- Watch the video on Anger",
      "2- Complete the Heart Fitness Exercise for Day 3",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Complete today’s Heart Fitness Exercise before continuing.',
    practice: "Write at least one thing for each question, without judgement — just recognize what happened and why it matters.",
    prompts: [
      "What is one instance when your pain drove your action in any way?",
      "Why is what I do with my pain important?",
    ],
    journalPrompt: 'Write about anger, defenses, and what sovereignty would require of you.',
  },
  {
    id: 'heart-day-4',
    dayNumber: 5,
    arc: 'Heart Unlock',
    stepLabel: 'Day 4',
    title: 'Numbing',
    slug: 'heart-day-4',
    theme: 'Stifled tears & pain ignored, means stifled smiles and stunted happiness.',
    videoLabel: 'Heart Unlock · Day 4 · Numbing',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274692/TkaaCNsAL3qRzumZOuCW',
    videoSupport: "",
    supportingPoints: [
      "1- Watch the video on Numbing",
      "2- Complete the Heart Fitness Exercise for Day 4",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Complete today’s Heart Fitness Exercise before continuing.',
    practice: "Write the word NUMBING at the top of a page. Name at least one time that you have avoided feeling your pain — a time you escaped feeling.",
    prompts: [
      "When have you avoided feeling your pain?",
      "What are your strategies for avoiding personal emotional pain?",
      "How does that make you Feel?",
      "Where has numbed or avoided pain also meant numbed happiness?",
    ],
    journalPrompt: 'Write about where pain ignored has also reduced your happiness.',
  },
  {
    id: 'heart-day-5',
    dayNumber: 6,
    arc: 'Heart Unlock',
    stepLabel: 'Day 5',
    title: 'Shame',
    slug: 'heart-day-5',
    theme: '"I am not enough" is never true, but recognize when it\'s there.',
    videoLabel: 'Heart Unlock · Day 5 · Shame',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274697/2c8QltDrMW15Uea5sKAo',
    videoSupport: "",
    supportingPoints: [
      "Watch the video, then complete the Heart Fitness Exercise below.",
      "1- Watch the video on Shame",
      "2- Complete the Heart Fitness Exercise for Day 5",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Complete today’s Heart Fitness Exercise before continuing.',
    practice: "Name at least one thing you have shame about. Write it down. Allow yourself to Feel it. See it. Accept it — accept that it exists, not that it's true. Emotional Fitness comes in the form of holding no judgement about shortcomings. The first step is simply understanding and acceptance.",
    prompts: [
      "What is at least one thing I have shame about?",
    ],
    journalPrompt: 'Write about the place where "I am not enough" appears and what awareness reveals there.',
  },
  {
    id: 'heart-day-6',
    dayNumber: 7,
    arc: 'Heart Unlock',
    stepLabel: 'Day 6',
    title: 'Regret',
    slug: 'heart-day-6',
    theme: 'What are the consequences of not knowing or acknowledging your pain?',
    videoLabel: 'Heart Unlock · Day 6 · Regret',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274701/4ICvM6mXTBhb2OvvymKC',
    videoSupport: "",
    supportingPoints: [
      "1- Watch the video on Regret",
      "2- Complete the Heart Fitness Exercise for Day 6",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Complete today’s Heart Fitness Exercise before continuing.',
    practice: "Write down at least one consequence for YOU, of not knowing or acknowledging emotional pain.",
    prompts: [
      "What is one consequence for me, of not knowing or acknowledging emotional pain?",
    ],
    journalPrompt: 'Write about the consequences of not knowing or acknowledging your pain.',
  },
  {
    id: 'heart-day-7',
    dayNumber: 8,
    arc: 'Heart Unlock',
    stepLabel: 'Day 7',
    title: 'Choosing to Feel',
    slug: 'heart-day-7',
    theme: 'To live fully I need to FEEL fully as well!',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Heart Unlock · Day 7 · Choosing to Feel',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274702/EWzoI8gYxYKd09Fwwspw',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
      '3- Complete the Part 1 - Heart Unlock - Questionnaire.',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Will you commit to allow yourself to feel?',
    practice: "Write down at least one thing you can do to give your heart the freedom it needs to feel. Make the commitment within yourself to allow yourself to FEEL, no matter what.",
    prompts: [
      "What will you do to give your heart the freedom it needs to feel?",
      "Will you commit to allow yourself to feel?",
    ],
    journalPrompt: 'Write your answer to the question: Will you commit to allow yourself to feel?',
  },
  {
    id: 'iron-intro',
    dayNumber: 9,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Part 2 Intro',
    immediateUnlockNext: true,
    title: 'Introduction',
    slug: 'iron-intro',
    theme: 'Our Hearts, our imaginations, and our subconscious- these are all deeply connected- these use the language of stories and symbols.',
    videoLabel: 'Iron John / Language Of The Heart · Part 2 Intro · Introduction',
    videoHeading: 'Intro video',
    videoUrl: 'https://player.vimeo.com/video/467500375?portrait=0&transparent=1',
    videoSupport: "We learn from stories with our heart when we enjoy them...",
    markVideoCompleteLabel: 'Go to Lesson 1',
    videoCompleteSavedLabel: 'Lesson 1 is open',
    supportingPoints: [
      "1- Watch the intro video.",
      "2- Watch Lesson 1 video.",
      "3- Let the story work on you through imagination, symbols, and felt sense.",
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'One Day At A Time Is Best :)',
    practice: "",
    prompts: [],
    journalPrompt: '',
  },
  {
    id: 'iron-day-1',
    dayNumber: 10,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 8',
    title: 'Iron John Beginnings',
    slug: 'iron-day-1',
    theme: 'Stories, symbols, metaphors, emotions... these are the language of the heart.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 8 · Iron John Beginnings',
    videoUrl: 'https://player.vimeo.com/video/467494269?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Practice',
    integrationBody: 'Listen to the first part of the story of Iron John for 3 days (try for consecutive).',
    practice: "Listen to the first part of the story of Iron John for 3 days (try for consecutive). First thing in the morning, or before bed is a good time to access the Heart. Set a timer for 5-10 minutes and write anything that comes to mind.",
    prompts: [
      "2- \"Heart-storming\"... How do you FEEL about the story? What stands out to YOU? What does it bring to mind (even if seemingly unrelated)?.",
    ],
    journalPrompt: 'Write anything that comes to mind after listening.',
  },
  {
    id: 'iron-day-2',
    dayNumber: 11,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 9',
    title: 'The Cage',
    slug: 'iron-day-2',
    theme: 'The cage I build, is all the stories and beliefs that keep me from being my authentic self.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 9 · The Cage',
    videoUrl: 'https://player.vimeo.com/video/468344269?portrait=0&transparent=1',
    videoSupport: "If you like to go deep, you can spend 4 consecutive days on this exercise. You can go back to portions of the recording as desired.\n\nAsk your heart as if it is REAL, and can answer....\n\nDirecting the question to the heart, opens a path for information to flow between the Heart-Body and the Brain..",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Questions',
    integrationBody: 'You can spend 4 consecutive days on this exercise.',
    practice: "If you like to go deep, you can spend 4 consecutive days on this exercise. Set a Timer to 5-10 minutes. Ask the questions and write what comes to mind. Ask your heart as if it is REAL, and can answer. Directing the question to the heart opens a path for information to flow between the Heart-Body and the Brain.",
    prompts: [
      "What is one (more more) way(s) you were told you \"should\" be?",
      "What is one (or more) way you were told you \"should\" behave?",
      "What is one way you are you telling yourself you \"should\" be?",
      "What is one thing you lost? (i.e. a piece of your personality, or something that made you happy...)",
    ],
    journalPrompt: 'Write about the cage built by stories and beliefs and what it has cost you.',
  },
  {
    id: 'iron-day-3',
    dayNumber: 12,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 10',
    title: 'Non-Judgement',
    slug: 'iron-day-3',
    theme: 'Non-Judgement, practiced with honesty, is KEY to emotional freedom.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 10 · Non-Judgement',
    videoUrl: 'https://player.vimeo.com/video/469815966?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Practice non-judgement with honesty.',
    practice: 'Non-Judgement, practiced with honesty, is KEY to emotional freedom. Bring one mistake or hard memory to mind and notice what gold, learning, or freedom may be hidden within it.',
    prompts: [],
    journalPrompt: 'Write about one mistake and the gold you can find within it.',
  },
  {
    id: 'iron-day-4',
    dayNumber: 13,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 11',
    title: 'Box Breathing',
    slug: 'iron-day-4',
    theme: 'Box Breathing- As a tool to Change, Shift, and Heal The Heart',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 11 · Box Breathing',
    videoUrl: 'https://player.vimeo.com/video/469578165?portrait=0&transparent=1',
    videoSupport: "Maybe it's love, or light, or courage, or inspiration. Choose your \"word\" or set of words. \"Life\" works well for many.\n\nFor continual, daily, long term breathing... use a controlled long exhale.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Breath practice',
    integrationBody: 'To get the practice in your memory, so it\'s there when you need it most: practice once a day for a week or month.',
    practice: "Choose one word that you want to breathe in and connect it to your breath. Maybe it's love, or light, or courage, or inspiration. Choose your word or set of words. \"Life\" works well for many. Practice box breathing — 8 cycles or 2 minutes, once a day for a week or month. Try setting a daily reminder on your calendar for the next several days at least. Use box breathing when you need it, not necessarily all the time. For continual, daily, long-term breathing, use a controlled long exhale: breathe in deep for 3-5 seconds, then control the slow exhale about 7-8 seconds.",
    prompts: [
      "Inhale for 4 counts: breathe in with your chosen word.",
      "Hold inhale for 4 counts.",
      "Exhale for 4 counts: breathe out with your chosen word.",
      "Hold exhale for 4 counts.",
    ],
    journalPrompt: 'Write about the word you chose and what happens when you breathe with it.',
  },
  {
    id: 'iron-day-5',
    dayNumber: 14,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 12',
    title: 'Tending the Heart',
    slug: 'iron-day-5',
    theme: 'How do we tend our Hearts?',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 12 · Tending the Heart',
    videoUrl: 'https://player.vimeo.com/video/471745654?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'How do we tend our Hearts?',
    practice: 'Reflect on the spring, fire, or garden image from the lesson. Notice what image best describes your heart right now, and what kind of tending it needs.',
    prompts: [],
    journalPrompt: 'Write about the spring, fire, or garden image that best describes your heart right now.',
  },
  {
    id: 'iron-day-6',
    dayNumber: 15,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 13',
    title: 'Father Earth',
    slug: 'iron-day-6',
    theme: 'The Earth and The Masculine Heart',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 13 · Father Earth',
    videoUrl: 'https://player.vimeo.com/video/471753829?portrait=0&transparent=1',
    videoSupport: "Centuries of thought, passed down, may imprint and effect our thinking more than we know.\n\nOur language may even drive disconnection between Men and their Hearts.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Meditation',
    integrationBody: 'Visualize the string of light between yourself and the center of the earth.',
    practice: '1- Set a timer for 5-10 minutes and do the meditation outlined in the video.\n\n2- Simply visualize the string of light between yourself and the center of the earth. Follow it up as you inhale, follow it down as you exhale.\n\n3- Do this for 10 consecutive days to start instilling the effects.\n\n4- Use this visualization as a way to ground yourself anytime.',
    prompts: [],
    journalPrompt: 'Write about the effect of the grounding visualization.',
  },
  {
    id: 'iron-day-7',
    dayNumber: 16,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 14',
    immediateUnlockNext: true,
    title: 'Letting Go',
    slug: 'iron-day-7',
    theme: 'Finding the big beliefs in life that you may need to let go of, may not happen in this sitting... But start to ask the question.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 14 · Letting Go',
    videoUrl: 'https://player.vimeo.com/video/475973182?portrait=0&transparent=1',
    videoSupport: "Our greatest \"gold\" is often hidden behind our shadows... Our greatest shadow is all too often attached to our greatest gold... This is what makes it hard to see.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Questions',
    integrationBody: 'Start to ask the question: What do I need to let go of?',
    practice: 'Finding the big beliefs in life that you may need to let go of may not happen in this sitting. But start to ask the question.\n\n1- Name 2 BIG things that you associate strongly with your identity.\n\n2- For each one, ask what belief or behavior may need to be released.\n\nExample: Pride, guilt, shame, singing, being a good listener, being kind, being likeable, being thrifty, being productive, or being hard working.',
    prompts: [
      "What do I need to let go of?",
      "Name 2 BIG things that you associate strongly with your identity. Singing was one of mine... what is one of yours?",
      "The actual thing may not be negative at all (you're a good listener, kind, likeable, thrifty, productive or hard working...), but is there some shadow belief or behavior associated with it?",
    ],
    journalPrompt: 'Write about one identity attachment and the shadow attached to it.',
  },
  {
    id: 'iron-day-8',
    dayNumber: 17,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 15',
    title: 'Part 2/2 of the Story of Iron John',
    slug: 'iron-day-8',
    theme: 'We left off, with the boy being sent to work in the garden... here is the rest of the story.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Iron John / Language Of The Heart · Day 15 · Part 2/2 of the Story of Iron John',
    videoUrl: 'https://player.vimeo.com/video/476693295?h=2bee82ac19&portrait=0&transparent=1',
    videoSupport: "Don't worry about the detail. Enjoy the listen. Enjoy the story.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Story reflection',
    integrationBody: 'Listen and let yourself feel.',
    practice: "Enjoy the story and notice what feeling or part stands out to you.",
    prompts: [
      "What is one feeling that you felt from the story?",
      "What is one part that stood out to you?",
    ],
    journalPrompt: 'Write what stood out and what the story left in you.',
  },
  {
    id: 'intentions-intro',
    dayNumber: 18,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Part 3 Intro',
    immediateUnlockNext: true,
    title: 'Introduction',
    slug: 'intentions-intro',
    theme: 'Setting these intentions heals the heart... As we plant them, and nurture them, they grow deep into the Heart and subconscious.',
    videoLabel: 'Intentions Worth Planting · Part 3 Intro · Introduction',
    videoHeading: 'Intro video',
    videoUrl: 'https://player.vimeo.com/video/483878304?portrait=0&transparent=1',
    videoSupport: "Don't be surprised when things just start working out more often.\n\nWe ALWAYS have deeper intentions running our life, so getting conscious of the intentions that we want is KEY!",
    markVideoCompleteLabel: 'Go to Lesson 1',
    videoCompleteSavedLabel: 'Lesson 1 is open',
    supportingPoints: [
      "1- Watch the intro video.",
      "2- Watch Lesson 1 video.",
      "3- Watch the videos in order and let each intention build on the last.",
    ],
    integrationHeading: 'Instructions',
    integrationBody: 'Learning to set intentions... is the best tool to face life, and be prepared for EVERY situation in life.',
    practice: "",
    prompts: [],
    journalPrompt: '',
  },
  {
    id: 'intentions-1',
    dayNumber: 19,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 16',
    title: 'Be Creative',
    slug: 'intentions-1',
    theme: 'We are always creating, so let\'s get intentional about it!',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 16 · Be Creative',
    videoUrl: 'https://player.vimeo.com/video/491451277?portrait=0&transparent=1',
    videoSupport: "There are unlimited ways for you to be creative.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'For 1-3 days, spend time on what it means to be Creative.',
    practice: 'Reflection. For 1-3 days, spend time on what it means to be Creative. The more time you spend consistently over days, the deeper it goes...\n\nTry connecting creativity with the breathe... "Breathe in creativity... breathe out creativity". Say to self "I am Creative", throughout the day (set a reminder).',
    prompts: [
      '1- What does it mean to you to Be Creative?',
      '2- Why is it important to Be Creative?',
    ],
    journalPrompt: 'Write what creativity means to you and how you want to practice it.',
  },
  {
    id: 'intentions-2',
    dayNumber: 20,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 17',
    title: 'Be Kind',
    slug: 'intentions-2',
    theme: 'True Kindness is Courage.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 17 · Be Kind',
    videoUrl: 'https://player.vimeo.com/video/483727694?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'True Kindness is Courage.',
    practice: "Try connecting kindness with the breathe... \"Breathe in kindness... breathe out kindness\". Say to self \"I am Kind\", throughout the day (set a reminder).",
    prompts: [
      "1- What does it mean to you to Be Kind?",
      "2- Why is it important to you to Be Kind?",
    ],
    journalPrompt: 'Write about kindness as courage.',
  },
  {
    id: 'intentions-3',
    dayNumber: 21,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 18',
    title: 'Be Beauty',
    slug: 'intentions-3',
    theme: '"Truth is Beauty... Beauty is Truth" - Keats.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 18 · Be Beauty',
    videoUrl: 'https://player.vimeo.com/video/483879872?portrait=0&transparent=1',
    videoSupport: "We will never know everything... but we can set the intention to look for truth, and align with it.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Set the intention to look for truth, and align with it.',
    practice: "Try connecting truth with the breathe... \"Breathe in truth... breathe out truth\". Say to self \"I am Beauty\" or \"I am Truth\", throughout the day (set a reminder).",
    prompts: [
      "Is there anything more beautiful than a man or woman connected deeply to the truth they carry in their soul? Maybe not.",
      "1- What does it mean to you to Be Beauty or Truth?",
      "2- Why is it important to Be Truth or Beauty?",
    ],
    journalPrompt: 'Write about beauty, truth, and what alignment would look like.',
  },
  {
    id: 'intentions-4',
    dayNumber: 22,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 19',
    title: 'Be Love',
    slug: 'intentions-4',
    theme: 'Love... is a lousy word. But we use it anyway. :)',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 19 · Be Love',
    videoUrl: 'https://player.vimeo.com/video/488237870?portrait=0&transparent=1',
    videoSupport: "The type of Love we're talking about, is fundamental to life.\n\nLove is one of the most important words we have.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'When the word lands well in the heart, it changes it.',
    practice: "Try connecting love with the breathe... \"Breathe in love... breathe out love\". Say to self \"I am Love\", throughout the day (set a reminder).",
    prompts: [
      "1- What does it mean to you to Be Love?",
      "2- Why is it important to Be Love?",
    ],
    journalPrompt: 'Write about what love means when it lands well in the heart.',
  },
  {
    id: 'intentions-5',
    dayNumber: 23,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 20',
    title: 'Be Abundance',
    slug: 'intentions-5',
    theme: 'Abundance is a belief... and this belief can change everything.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 20 · Be Abundance',
    videoUrl: 'https://player.vimeo.com/video/483880757?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Choose to believe that abundance exists.',
    practice: "Try connecting the idea of abundance with your breathe... \"Breathe in abundance... breathe out abundance\". Say to self \"I am Abundant\", throughout the day (set a reminder).",
    prompts: [
      "1- What does Abundance mean to you?",
      "2- Why is it important to Be Abundance, or believe in abundance?",
    ],
    journalPrompt: 'Write about abundance as a belief and what it changes for you.',
  },
  {
    id: 'intentions-6',
    dayNumber: 24,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 21',
    title: 'Be Receptive',
    slug: 'intentions-6',
    theme: 'Receptivity is key to growth, healing and change.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 21 · Be Receptive',
    videoUrl: 'https://player.vimeo.com/video/483881976?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Receptivity is key to growth, healing and change.',
    practice: "Try connecting receptivity with the breathe... \"Breathe in receptivity... breathe out receptivity\". Say to self \"I am Receptive\", throughout the day (set a reminder).",
    prompts: [
      "1- What does it mean to you to Be Receptivity?",
      "2- Why is it important to Be Receptive?",
    ],
    journalPrompt: 'Write about what receptivity opens in you.',
  },
  {
    id: 'intentions-7',
    dayNumber: 25,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 22',
    immediateUnlockNext: true,
    title: 'Be Ever-Expansive',
    slug: 'intentions-7',
    theme: 'Life grows and is ever growing. Life is ever-expansive.',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Day 22 · Be Ever-Expansive',
    videoUrl: 'https://player.vimeo.com/video/486241765?portrait=0&transparent=1',
    videoSupport: "",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Life grows and is ever growing. Life is ever-expansive.',
    practice: "Try connecting your Expansiveness/Life with the breathe... \"Breathe in expansiveness... breathe out expensiveness\". Say to self \"I am Ever-Expansiveness\" or \"I am Life\", throughout the day (set a reminder).",
    prompts: [
      "1- What does it mean to you to Be Ever-Expanding?",
      "2- Why is it important to Be Ever-Expansive, or Ever-Expanding?",
    ],
    journalPrompt: 'Write about expansiveness, growth, and where life is calling you outward.',
  },
  {
    id: 'intentions-summary',
    dayNumber: 26,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Summary',
    title: 'Summary',
    slug: 'intentions-summary',
    theme: 'Planting these 7 intentions is finished... but you\'re not done yet...',
    supportingTextHeading: "Today's Steps",
    videoLabel: 'Intentions Worth Planting · Summary · Summary',
    videoUrl: 'https://player.vimeo.com/video/486242220?portrait=0&transparent=1',
    videoSupport: "Keep tending these seeds by increasing your awareness of what they mean to you, and they will serve you well.\n\nCreative, Kind, Beauty/Truth, Love, Abundance, Receptive, Ever-Expanding.\n\nThese intentions are an excellent way to start the day, an incredible way to end the day, and a transformational way to live.",
    supportingPoints: [
      '1- Watch the video.',
      '2- Complete the Heart Fitness Exercise.',
    ],
    integrationHeading: 'Implementation',
    integrationBody: 'Keep tending these seeds by increasing your awareness of what they mean to you.',
    practice: "Set a reminder on your phone to remember these 7 intentions once a day for the next 30 days. Meditate on these 7 intentions as you inhale and exhale each one: I Am Creative, I Am Kind, I Am Beauty/Truth, I Am Love, I Am Abundance, I Am Receptive, I Am Ever-Expanding.",
    prompts: [],
    journalPrompt: 'Write how you will keep tending these 7 intentions from here.',
  },
]

export const defaultSiteContent: SiteContent = {
  landing: {
    navEyebrow: 'Archetypal Masculine Heart',
    navLabel: 'Step One · Heart Unlock · Iron John · Intentions Worth Planting',
    heroEyebrow: 'This is about YOU feeling deeply GOOD',
    heroTitle: 'Masculine\nHeart Quest',
    heroBody: 'The path moves through Step One - Unlock The Heart, Language Of The Heart, and Intentions Worth Planting.',
    heroSupport: 'One Day At A Time Is Best.',
    primaryCta: 'Purchase course access',
    secondaryCta: 'Already purchased? Open the portal',
    tertiaryCta: 'Preview the first lesson',
    purchaseHeading: 'Enter the heart deliberately',
    overviewCards: [
      {
        title: 'Heart Unlock',
        text: 'The First Step - Is Stepping Down To The Heart.',
      },
      {
        title: 'Language Of The Heart',
        text: 'Our Hearts, our imaginations, and our subconscious use the language of stories and symbols.',
      },
      {
        title: 'Intentions Worth Planting',
        text: 'Deep intentions grow roots, deep into the Heart, and become powerful- benefiting each aspect of life.',
      },
    ],
    brandEyebrow: 'Masculine Heart Quest',
    pageTitle: 'Sovereignty of heart and mind',
    journeyDescription: 'A 21-day journey to go within, see what\'s there, and cultivate the way you want to be.',
    quoteLine1: 'as within so without...',
    quoteLine2: 'so we must go within...',
    purchaseBody: 'A 21-day practice of self inquiry, supported through Paul\'s own experience, as well as story, and intention. A little each day, really can go a long way.',
    portalLinkLabel: 'Already purchased? Open the portal',
    journeyEyebrow: 'The journey',
    journeyBody: 'We start with the descent. We deepen through story. And we grow with cultivating intention.',
    previewEyebrow: '21-day preview',
    previewTitle: 'The shape of the path',
    previewIntroLine1: '21 days. About 7–10 minutes a day.',
    previewIntroLine2: 'The next lesson unlocks at your next midnight when your time zone is confirmed, or 20 hours after completion otherwise, because a little reflection each day is more significant than a binge. Give your heart time to speak up.',
  },
  portal: {
    eyebrow: 'Quest Dashboard',
    title: 'Portal',
    adminUnlockedNote: 'Admin unlocked view: all course pages are navigable from here.',
    progressHeading: 'Progress',
    completedLessonsLabel: 'Completed lessons',
    dripHeading: 'Drip cadence',
    dripBody: 'Midnight in the buyer\'s confirmed time zone, otherwise 16 hours after video completion.',
    dripSupport: 'Your reflection can continue after the next lesson opens.',
    nextAvailableEyebrow: 'Next available',
    nextAvailableBody: 'Continue the quest where it is currently open.',
    nextAvailableCta: 'Open lesson',
    allLessonsOpenBody: 'All available lessons are open. Continue from your lesson map below.',
    mapHeading: 'Quest map',
    mapBody: 'A daily path through feeling, story, and intention — the art and exercise of sovereignty of your Heart.',
    integrationHeading: 'Pacing note',
    integrationBody: 'One day at a time is best. Intro steps open the next lesson immediately, while the rest of the path opens at your next midnight when your time zone is confirmed, or 20 hours after completion otherwise.',
    integrationAdminBypass: 'Admin view bypasses drip locks so you can inspect the full course experience.',
    trackLabels: ['Part 1', 'Part 2', 'Part 3'],
    trackTitles: ['Heart Unlock', 'Iron John / Language Of The Heart', 'Intentions Worth Planting'],
    trackDaysLabels: ['Intro + Days 1–7', 'Part 2 Intro + Days 8–14', 'Part 3 Intro + Days 15–21 + Summary'],
    trackStatusLabel: 'Admin open',
    trackNotes: [
      'Descend into the heart, meet pain honestly, and reopen the capacity to feel.',
      'Learn the heart’s language through story, symbol, breath, and emotional sovereignty.',
      'Plant seven living intentions — creative, kind, beauty, love, abundance, receptivity, and expansion.',
    ],
  },
  locked: {
    eyebrow: 'Quest Rhythm',
    title: 'The next lesson is still ripening.',
    body: 'Good work. Let the previous lesson settle before the next gate opens.',
    cardHeading: 'Next unlock',
    cardBody: 'The previous lesson video has not been marked complete yet.',
    loadingDetail: 'Checking your unlock time…',
    missingSessionDetail: 'Sign in to see when your next lesson unlocks.',
    missingPreviousDetail: 'We could not find the previous lesson for this unlock gate.',
    progressLoadErrorDetail: 'We could not load your unlock time yet. Please return to the portal and try again.',
    videoNotCompleteDetail: 'The previous lesson video has not been marked complete yet.',
    unlockReadyDetail: 'Your next lesson is ready now. Return to the portal and open it.',
  },
  complete: {
    eyebrow: 'Quest Rhythm',
    title: 'Lesson complete.',
    body: 'Let it settle. Let it work on you a little before the next threshold opens.',
    cardHeading: 'Next lesson unlocks in',
    cardBody: 'Completion saved. Return to the portal to continue.',
    backToPortalLabel: 'Back to portal',
  },

  questionnaire: {
    eyebrow: 'Heart Unlock',
    title: 'Part 1 - Heart Unlock - Questionnaire',
    introLines: [
      "Congratulations, on taking a few days, to step down into your Heart. The things we avoid, end up being the things that control our life... so we have to take time to see what we've been avoiding.",
      "Heart work doesn't stop here, this is just the first step. There is so much more we can do to create a Healthy, Thriving, Heart.",
      'Please take a minute for these questions!',
    ],
    quote: '“The privilege of a lifetime is to become who you truly are” - Carl Jung.',
    fields: [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'completedSevenDays', label: 'Did you complete the 7-days, stepping down into the Heart?', type: 'choice', options: ['Yes', 'No'] },
      { id: 'daysFromStartToFinish', label: 'How many days did you take from start to finish?', type: 'text' },
      { id: 'learnedAboutSelf', label: 'What did you learn about yourself during the course?', type: 'textarea' },
      { id: 'confusingOrSuggestions', label: 'Was there anything confusing about the course, or any suggestion you would have that could have made it better?', type: 'textarea' },
      { id: 'nextStep', label: 'What do you think the next step is for you, in understanding your Heart?', type: 'text' },
      { id: 'emotionsOpened', label: 'Did you feel your emotions open up in new ways? If so, how?', type: 'textarea' },
      { id: 'criticalToFeel', label: "Why do you think it's critical to allow yourself to feel?", type: 'textarea' },
      { id: 'mostImportantTakeaway', label: 'What is your most important take away from this mini-course?', type: 'textarea' },
    ],
    closingBody: "As we step down into our Hearts, we step into newness in life - we learn how to feel again, and with that how to play again, how to have fun - we gain skills to create life more consciously and intentionally, and tools to thrive. We start with Heart so we can thrive in the ways that matter most. I'm here, as your advocate for your Heart. -Paul",
    saveButton: 'Save answers',
    savingButton: 'Saving…',
    submitButton: 'Submit questionnaire',
    submitAgainButton: 'Submit again',
    submittingButton: 'Submitting…',
    returnToCourseLabel: 'Return to course',
    choosePlaceholder: 'Choose…',
    progressSuffix: 'answers started.',
    loadingStatus: 'Loading your saved answers…',
    localOnlyStatus: 'Answers saved on this device. Sign in to save them to your course account and submit.',
    draftStatus: 'You can draft answers here. Sign in to save them to your course account and submit.',
    submittedStatus: 'Questionnaire submitted.',
    submittedNotifiedStatus: 'Questionnaire submitted. Paul has been notified.',
    savedStatus: 'Answers saved to your course account.',
    alreadySubmittedStatus: 'Questionnaire already submitted. You can still review your answers.',
    loadErrorStatus: 'Could not load account answers yet. You can keep writing; this device will remember your answers.',
    saveErrorStatus: 'Could not save answers yet.',
    submitErrorStatus: 'Could not submit questionnaire yet.',
  },
  shell: {
    homeIntroLinkLabel: 'Open intro lesson',
    portalLoginTitle: 'Login required',
    portalLoginCta: 'Go to login',
    portalNotEnrolledTitle: 'Course access pending',
    portalBackToLandingLabel: 'Back to landing page',
    portalLoadingLabel: 'Loading your portal…',
    portalSignedInPrefix: 'Signed in as',
    portalCompletionTotalLabel: 'Total course',
    portalCompletionMapLabel: 'Completion map',
    portalCompletionMapBody: 'A small view of the whole path and each section of the Quest.',
    portalLessonsCompleteSuffix: 'lessons complete',
    portalSectionCompleteSuffix: 'complete',
    portalAvailableStatus: 'Available',
    portalCompleteStatus: 'Complete',
    portalLockedStatus: 'Locked',
    portalAdminOpenStatus: 'Admin open',
    portalUnlocksPrefix: 'Unlocks',
    lessonMissingTitle: 'Lesson not found',
    lessonMissingBody: 'This lesson is not available yet.',
    lessonMissingCta: 'Back to portal',
    lessonRefreshLabel: 'Refresh this lesson',
    lessonDefaultSupportingHeading: 'Todays Steps',
    lessonDefaultVideoHeading: 'Lesson video',
    lessonDefaultIntroVideoHeading: 'Intro video',
    lessonDefaultMarkVideoCompleteLabel: 'Mark video complete',
    lessonDefaultVideoCompleteSavedLabel: 'Video completion saved',
    lessonDefaultCompleteLessonLabel: 'Complete lesson',
    lessonDefaultCompleteFinalLessonLabel: 'Complete final lesson',
    lessonReflectionPlaceholder: 'Type your reflection here...',
    lessonDefaultSaveReflectionLabel: 'Save reflection',
    lessonSavingLabel: 'Saving…',
    lessonNextAvailableAfterCompletion: 'is available after you complete this lesson.',
    lessonNextAvailableAfterUnlock: 'Next lesson available after you complete this lesson at your account unlock time.',
    lessonReflectionSavedStatus: 'Reflection saved to your account. Your saved reflections will be emailed to you after you complete the full course.',
    lessonReflectionSaveErrorStatus: 'Could not save your reflection yet.',
    lessonCompletionSaveErrorStatus: 'Could not save completion yet. Please try again.',
    lessonFinalReflectionEmailErrorStatus: 'Course completion saved, but your reflection email could not be queued yet. Please try completing the final lesson again in a moment.',
  },
  lessons: lessons.map((lesson) => ({
    ...lesson,
    supportingTextHeading: lesson.supportingTextHeading || 'Todays Steps',
    reflectionPromptsHeading: lesson.reflectionPromptsHeading || 'Heart Fitness Exercise',
    promptLabelPrefix: lesson.promptLabelPrefix || 'Reflection',
  })),
}

export function getLessonBySlug(slug: string, content: SiteContent = defaultSiteContent) {
  return content.lessons.find((lesson) => lesson.slug === slug)
}

export function getPreviousLesson(lesson: LessonContent, content: SiteContent = defaultSiteContent) {
  const index = content.lessons.findIndex((candidate) => candidate.id === lesson.id)
  return index > 0 ? content.lessons[index - 1] : null
}

export function getNextLesson(lesson: LessonContent, content: SiteContent = defaultSiteContent) {
  const index = content.lessons.findIndex((candidate) => candidate.id === lesson.id)
  return index >= 0 && index < content.lessons.length - 1 ? content.lessons[index + 1] : null
}

export function shouldUnlockNextImmediately(lesson: LessonContent) {
  return !!lesson.immediateUnlockNext
}

export const courseTracks: CourseTrack[] = [
  {
    id: 'course-1',
    label: 'Part 1',
    title: 'Heart Unlock',
    lessonIds: ['heart-intro', 'heart-day-1', 'heart-day-2', 'heart-day-3', 'heart-day-4', 'heart-day-5', 'heart-day-6', 'heart-day-7'],
    daysLabel: 'Intro + Days 1–7',
    editorNote: 'Descend into the heart, meet pain honestly, and reopen the capacity to feel.',
  },
  {
    id: 'course-2',
    label: 'Part 2',
    title: 'Iron John / Language Of The Heart',
    lessonIds: ['iron-intro', 'iron-day-1', 'iron-day-2', 'iron-day-3', 'iron-day-4', 'iron-day-5', 'iron-day-6', 'iron-day-7', 'iron-day-8'],
    daysLabel: 'Part 2 Intro + Days 8–14',
    editorNote: 'Learn the heart’s language through story, symbol, breath, and emotional sovereignty.',
  },
  {
    id: 'course-3',
    label: 'Part 3',
    title: 'Intentions Worth Planting',
    lessonIds: ['intentions-intro', 'intentions-1', 'intentions-2', 'intentions-3', 'intentions-4', 'intentions-5', 'intentions-6', 'intentions-7', 'intentions-summary'],
    daysLabel: 'Part 3 Intro + Days 15–21 + Summary',
    editorNote: 'Plant seven living intentions — creative, kind, beauty, love, abundance, receptivity, and expansion.',
  },
]
