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
    videoLabel: 'Heart Unlock · Intro',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274627/GRtZBn0eSk1cGGfksh3i',
    videoSupport: 'The First Step - Is Stepping Down To The Heart.',
    supportingPoints: [
      'Only 10-20 minutes a day for 7 days.',
      '1- Watch the Intro Video,',
      '2- Get a blank note book,',
      '3- Open your notebook and write what comes to mind,',
      '4- Proceed to Day 1 .',
      'One Day At A Time!',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Only 10-20 minutes a day for 7 days. One Day At A Time!',
    practice: 'Get a blank notebook and proceed to Day 1.',
    prompts: [
      'What does stepping down to the heart mean for me?',
      'What do I want to receive from these 7 days?',
      'Am I willing to take this one day at a time?',
    ],
    journalPrompt: 'Write what it means for you to step down to the heart.',
  },
  {
    id: 'heart-day-1',
    dayNumber: 2,
    arc: 'Heart Unlock',
    stepLabel: 'Day 1',
    title: 'There is a purpose to Emotion Pain.',
    slug: 'heart-day-1',
    theme: 'Identifying the pain is the first step to understanding the pain and relieving the pain.',
    videoLabel: 'Heart Unlock · Day 1',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274629/xyyLSPiIRAYmKJYcidt5',
    videoSupport: 'Watch the video, then complete the Heart Fitness Exercise below.',
    supportingPoints: [
      '1- Watch the video on identifying emotional pain.',
      '2- Complete the Heart Fitness Exercise for Day 1',
      '3- Please wait a day before proceeding to Day 2',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Please wait a day before proceeding to Day 2.',
    practice: 'Complete the Heart Fitness Exercise for Day 1.',
    prompts: [
      'What pain do I need to identify more clearly?',
      'What happens when I do not identify the pain?',
      'What might understanding this pain begin to relieve?',
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
    videoLabel: 'Heart Unlock · Day 2',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274630/uwXUyPPgvVqmooDz9Iaf',
    videoSupport: 'Identifying sources of Sadness is important to Life and being Human.',
    supportingPoints: [
      'Watch the video, then complete the Heart Fitness Exercise below.',
      '1- Watch the video on identifying sadness',
      '2- Complete the Heart Fitness Exercise for Day 2',
      '3- Please wait until tomorrow before proceeding to Day 3',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Please wait until tomorrow before proceeding to Day 3.',
    practice: 'Complete the Heart Fitness Exercise for Day 2.',
    prompts: [
      'What sadness have I tried to cover over?',
      'What scars has that sadness left?',
      'What source of sadness needs to be identified now?',
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
    videoLabel: 'Heart Unlock · Day 3',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274690/yxSxVfS4jmBTieY9gEVN',
    videoSupport: 'Most of us lose sovereignty of our emotional core in some way.',
    supportingPoints: [
      'Watch the video, then complete the Heart Fitness Exercise below.',
      '1- Watch the video on Anger',
      '2- Complete the Heart Fitness Exercise for Day 3',
      '3- Please wait until tomorrow before proceeding to Day 4',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Please wait until tomorrow before proceeding to Day 4.',
    practice: 'Complete the Heart Fitness Exercise for Day 3.',
    prompts: [
      'Where do I lose sovereignty of my emotional core?',
      'What is my anger defending?',
      'What would emotional sovereignty look like here?',
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
    videoLabel: 'Heart Unlock · Day 4',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274692/TkaaCNsAL3qRzumZOuCW',
    videoSupport: 'Watch the video, then complete the Heart Fitness Exercise below.',
    supportingPoints: [
      '1- Watch the video on Numbing',
      '2- Complete the Heart Fitness Exercise for Day 4',
      '3- Please wait until tomorrow before proceeding to Day 5',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Please wait until tomorrow before proceeding to Day 5.',
    practice: 'Complete the Heart Fitness Exercise for Day 4.',
    prompts: [
      'Where have I ignored pain?',
      'How has that stifled smiles and happiness?',
      'What numbing pattern do I need to notice today?',
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
    videoLabel: 'Heart Unlock · Day 5',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274697/2c8QltDrMW15Uea5sKAo',
    videoSupport: '"I see you" - Awareness is the greatest tool.',
    supportingPoints: [
      'Watch the video, then complete the Heart Fitness Exercise below.',
      '1- Watch the video on Shame',
      '2- Complete the Heart Fitness Exercise for Day 5',
      '3- For best results, wait until tomorrow before proceeding to Day 6',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'For best results, wait until tomorrow before proceeding to Day 6.',
    practice: 'Complete the Heart Fitness Exercise for Day 5.',
    prompts: [
      'Where does "I am not enough" still appear?',
      'What changes when I meet that place with awareness?',
      'What does "I see you" make possible?',
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
    videoLabel: 'Heart Unlock · Day 6',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274701/4ICvM6mXTBhb2OvvymKC',
    videoSupport: 'Watch the video, then complete the Heart Fitness Exercise below.',
    supportingPoints: [
      '1- Watch the video on Regret',
      '2- Complete the Heart Fitness Exercise for Day 6',
      '3- For best results, wait until tomorrow before proceeding to Day 7',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'For best results, wait until tomorrow before proceeding to Day 7.',
    practice: 'Complete the Heart Fitness Exercise for Day 6.',
    prompts: [
      'What are the consequences of not knowing my pain?',
      'What are the consequences of not acknowledging my pain?',
      'What regret is asking me to become more honest?',
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
    videoLabel: 'Heart Unlock · Day 7',
    videoUrl: 'https://app.groove.cm/grooveembeds/video/274702/EWzoI8gYxYKd09Fwwspw',
    videoSupport: 'A decision to allow the Heart to Feel: Will you commit to allow yourself to feel?',
    supportingPoints: [
      'Watch the video, then complete the Heart Fitness Exercise below.',
      '1- Watch the video about choosing to Feel',
      '2- Complete the Heart Fitness Exercise for Day 7',
      '3- Please fill out the short questionnaire about your experience!',
      'Form Link: https://forms.gle/xdUtZoEzd4oKdWWj6',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'Will you commit to allow yourself to feel?',
    practice: 'Complete the Heart Fitness Exercise for Day 7 and fill out the questionnaire.',
    prompts: [
      'What would it mean to live fully and feel fully?',
      'What makes this commitment difficult for me?',
      'Will I commit to allow myself to feel?',
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
    videoLabel: 'Language Of The Heart · Intro',
    videoUrl: 'https://player.vimeo.com/video/467500375?portrait=0&transparent=1',
    videoSupport: 'Listen and ENJOY this journey with the story of Iron John... allow your heart to hear it.',
    supportingPoints: [
      'We learn from stories with our heart when we enjoy them...',
      '1- Watch the Intro Video,',
      '2- Proceed to Day 1',
      'One Day At A Time Is Best :)',
    ],
    integrationHeading: 'Course rhythm',
    integrationBody: 'One Day At A Time Is Best :)',
    practice: 'Watch the intro video, then proceed to Day 1.',
    prompts: [
      'How do stories and symbols speak to my heart?',
      'What happens when I allow myself to enjoy a story?',
      'What do I want to hear in this journey with Iron John?',
    ],
    journalPrompt: 'Write about what it means to let your heart hear the story.',
  },
  {
    id: 'iron-day-1',
    dayNumber: 10,
    arc: 'Iron John / Language Of The Heart',
    stepLabel: 'Day 8',
    title: 'Iron John Beginnings',
    slug: 'iron-day-1',
    theme: 'Stories, symbols, metaphors, emotions... these are the language of the heart.',
    videoLabel: 'Iron John Beginnings',
    videoUrl: 'https://player.vimeo.com/video/467494269?portrait=0&transparent=1',
    videoSupport: 'As you allow yourselves to listen and enjoy a story, the heart is able to hear it.',
    supportingPoints: [
      'Iron John Beginnings',
      '1- Listen to the first part of the story of Iron John for 3 days (try for consecutive). First thing in the morning, or before bed is a good time to access the Heart.',
      '2- "Heart-storming"... How do you FEEL about the story? What stands out to YOU? What does it bring to mind (even if seemingly unrelated)?.',
      'Take out a notebook, set a timer for 5-10 minutes, and write anything that comes to mind. (If on the go, make a voice memo, and record thoughts aloud.)',
    ],
    integrationHeading: 'Practice',
    integrationBody: 'Listen to the first part of the story of Iron John for 3 days (try for consecutive).',
    practice: 'Set a timer for 5-10 minutes and write anything that comes to mind.',
    prompts: [
      'How do I FEEL about the story?',
      'What stands out to me?',
      'What does it bring to mind, even if seemingly unrelated?',
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
    videoLabel: 'Language Of The Heart · The Cage',
    videoUrl: 'https://player.vimeo.com/video/468344269?portrait=0&transparent=1',
    videoSupport: 'They are the things that keep me from growing and expanding.',
    supportingPoints: [
      'Watch the video, then complete the Heart Fitness Exercise below.',
      'If you like to go deep, you can spend 4 consecutive days on this exercise. You can go back to portions of the recording as desired.',
      'Set a Timer to 5-10 minutes. Ask the questions and write what comes to mind.',
      'Ask your heart as if it is REAL, and can answer....',
      'Directing the question to the heart, opens a path for information to flow between the Heart-Body and the Brain..',
    ],
    integrationHeading: 'Questions',
    integrationBody: 'You can spend 4 consecutive days on this exercise.',
    practice: 'Set a timer to 5-10 minutes. Ask the questions and write what comes to mind.',
    prompts: [
      'What is one (or more) way I was told I "should" be?',
      'What is one (or more) way I was told I "should" behave?',
      'What is one way I am telling myself I "should" be?',
      'What is one thing I lost?',
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
    videoLabel: 'Language Of The Heart · Non-Judgement',
    videoUrl: 'https://player.vimeo.com/video/469815966?portrait=0&transparent=1',
    videoSupport: 'Spend some time with the following questions...',
    supportingPoints: [
      'You can spend 5 minutes brainstorming per question, all at once, or split over 4 consecutive days. Try using a 5 minute timer.',
      'For brainstorming, touch your Heart, address your Heart, and even if you are just looking at a blank page, spend time asking and considering the question.',
      '(1) What does it mean to practice Non-Judgement?',
      '(2) Why is it important to practice Non-Judgement?',
      '(3) What is one mistake you have made?',
      '(4) And looking deeper into the mistake... can you find something innately good, some gold?',
    ],
    integrationHeading: 'Questions',
    integrationBody: 'Spend some time with the following questions...',
    practice: 'Try using a 5 minute timer for each question.',
    prompts: [
      'What does it mean to practice Non-Judgement?',
      'Why is it important to practice Non-Judgement?',
      'Looking deeper into a mistake, can I find something innately good, some gold?',
    ],
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
    videoLabel: 'Language Of The Heart · Box Breathing',
    videoUrl: 'https://player.vimeo.com/video/469578165?portrait=0&transparent=1',
    videoSupport: 'Choose one word that you want to breathe in... and connect it to your breath.',
    supportingPoints: [
      'Maybe it\'s love, or light, or courage, or inspiration. Choose your "word" or set of words. "Life" works well for many.',
      '1- Inhale (4 counts, "Breathe in with Life")',
      '2 - Hold Inhale (4 counts)',
      '3 - Exhale (4 counts, "Breathe out with Life")',
      '4 - Hold Exhale (4 counts)',
      'Practice box breathing- 8 cycles or 2 minutes, once a day for a week or month.',
      'For continual, daily, long term breathing... use a controlled long exhale.',
    ],
    integrationHeading: 'Breath practice',
    integrationBody: 'To get the practice in your memory, so it\'s there when you need it most: practice once a day for a week or month.',
    practice: 'Practice box breathing- 8 cycles or 2 minutes, once a day.',
    prompts: [
      'What word do I want to breathe in?',
      'What changes when I connect that word to my breath?',
      'How can I make this practice available when I need it most?',
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
    videoLabel: 'Language Of The Heart · Tending the Heart',
    videoUrl: 'https://player.vimeo.com/video/471745654?portrait=0&transparent=1',
    videoSupport: 'Unhappiness, anxiety, and much of our internal negative experiences are because we have not learned and taken the time to tend our hearts...',
    supportingPoints: [
      'Why is it important for you to realize that your heart exists? List at least one reason.',
      'How can you benefit by tending your heart as if it were a spring, or a fire, or a garden?',
      'What is one thing you can do to tend your heart?',
      'What are you allowing to fall in the Spring?',
      'How are you feeding the Fire?',
      'What are you growing in your Garden?',
      'Most important: What is one thing you want to plant in your inner Garden?',
    ],
    integrationHeading: 'Questions',
    integrationBody: 'Consider the spring, the fire, and the garden.',
    practice: 'Name one thing you can do to tend your heart.',
    prompts: [
      'Why is it important for me to realize that my heart exists?',
      'How am I feeding the fire or tending the garden?',
      'What is one thing I want to plant in my inner Garden?',
    ],
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
    videoLabel: 'Language Of The Heart · Father Earth',
    videoUrl: 'https://player.vimeo.com/video/471753829?portrait=0&transparent=1',
    videoSupport: 'Consider giving space in your mind/heart to the phrase "father earth"...',
    supportingPoints: [
      'Centuries of thought, passed down, may imprint and effect our thinking more than we know.',
      'Our language may even drive disconnection between Men and their Hearts.',
      'Set a timer for 5-10 minutes, and do the meditation outlined in the video.',
      'Simply visualize the string of light between yourself and the center of the earth.',
      'Do this for 10 consecutive days to start instilling the effects.',
      'Use this visualization as a way to ground yourself anytime.',
    ],
    integrationHeading: 'Meditation',
    integrationBody: 'Visualize the string of light between yourself and the center of the earth.',
    practice: 'Set a timer for 5-10 minutes and do the meditation outlined in the video.',
    prompts: [
      'What happens when I give space to the phrase "father earth"?',
      'How has language shaped my connection with masculinity and the heart?',
      'How does grounding change my state?',
    ],
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
    videoLabel: 'Language Of The Heart · Letting Go',
    videoUrl: 'https://player.vimeo.com/video/475973182?portrait=0&transparent=1',
    videoSupport: 'What do I need to let go of?',
    supportingPoints: [
      'Name 2 BIG things that you associate strongly with your identity.',
      'The actual thing may not be negative at all... but is there some shadow belief or behavior associated with it?',
      '(e.g. Pride, Guilt, Shame, ect.)',
      'Our greatest "gold" is often hidden behind our shadows... Our greatest shadow is all too often attached to our greatest gold... This is what makes it hard to see.',
    ],
    integrationHeading: 'Questions',
    integrationBody: 'Start to ask the question: What do I need to let go of?',
    practice: 'Name 2 BIG things that you associate strongly with your identity.',
    prompts: [
      'What do I need to let go of?',
      'What do I associate strongly with my identity?',
      'What shadow belief or behavior is attached to it?',
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
    videoLabel: 'Language Of The Heart · Part 2',
    videoUrl: 'https://player.vimeo.com/video/476693295?h=2bee82ac19&portrait=0&transparent=1',
    videoSupport: 'Stories impressed on the heart, give us space to learn in a different way.',
    supportingPoints: [
      'Don\'t worry about the detail. Enjoy the listen. Enjoy the story.',
      'Listen and let yourself feel.',
      'What is one feeling that you felt from the story?',
      'What is one part that stood out to you?',
    ],
    integrationHeading: 'Story reflection',
    integrationBody: 'Listen and let yourself feel.',
    practice: 'Enjoy the story and notice what feeling or part stands out to you.',
    prompts: [
      'What is one feeling that I felt from the story?',
      'What is one part that stood out to me?',
      'What did the story impress on my heart?',
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
    videoLabel: 'Intentions Worth Planting · Intro',
    videoUrl: 'https://player.vimeo.com/video/483878304?portrait=0&transparent=1',
    videoSupport: 'This is how to tap into a more meaningful life, a deeper happiness in the Heart.',
    supportingPoints: [
      'Don\'t be surprised when things just start working out more often.',
      'We ALWAYS have deeper intentions running our life, so getting conscious of the intentions that we want is KEY!',
      '1- Limit yourself to a one video per day. (May even sit with one intention video for several days)',
      '2- Take the time to ask yourself the questions.',
      '3- Incorporating the breath, with the word, is how to become a kung fu master of INTENTION.',
    ],
    integrationHeading: 'Instructions',
    integrationBody: 'Learning to set intentions... is the best tool to face life, and be prepared for EVERY situation in life.',
    practice: 'Limit yourself to one video per day and take the time to ask yourself the questions.',
    prompts: [
      'What intentions are already running my life?',
      'What intention do I want to become conscious of now?',
      'What would a more meaningful life ask me to plant?',
    ],
    journalPrompt: 'Write about the intention you most want to plant now.',
  },
  {
    id: 'intentions-1',
    dayNumber: 19,
    arc: 'Intentions Worth Planting',
    stepLabel: 'Day 16',
    title: 'Be Creative',
    slug: 'intentions-1',
    theme: 'We are always creating, so let\'s get intentional about it!',
    videoLabel: 'Intentions Worth Planting · Intention 1',
    videoUrl: 'https://player.vimeo.com/video/491451277?portrait=0&transparent=1',
    videoSupport: 'Mentioned here is one way to Be Creative, by using imagination...',
    supportingPoints: [
      'What if you took 30 seconds to imagine something incredibly good that could happen. Try it. I dare you. And notice how you feel.',
      'There are unlimited ways for you to be creative.',
      'Reflection. For 3 days, spend time on what it means to be Creative.',
      '1- What does it mean to you to Be Creative?',
      '2- Why is it important to Be Creative?',
      '3- Try connecting creativity with the breathe... "Breathe in creativity... breathe out creativity". Say to self "I am creative".',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'For 3 days, spend time on what it means to be Creative.',
    practice: 'Take 30 seconds to imagine something incredibly good that could happen.',
    prompts: [
      'What does it mean to me to Be Creative?',
      'Why is it important to Be Creative?',
      'What happens when I say to myself "I am creative"?',
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
    videoLabel: 'Intentions Worth Planting · Intention 2',
    videoUrl: 'https://player.vimeo.com/video/483727694?portrait=0&transparent=1',
    videoSupport: 'It is an intention to truly build, to truly care, rather than just being nice.',
    supportingPoints: [
      '1- What does it mean to you to Be Kind?',
      '2- Why is it important to you to Be Kind?',
      '3- Try connecting kindness with the breathe... "Breathe in kindness... breathe out kindness". Say to self "I am Kind".',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'True Kindness is Courage.',
    practice: 'Connect kindness with the breath and repeat "I am Kind" throughout the day.',
    prompts: [
      'What does it mean to me to Be Kind?',
      'Why is it important to me to Be Kind?',
      'How is kindness courage in my life?',
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
    videoLabel: 'Intentions Worth Planting · Intention 3',
    videoUrl: 'https://player.vimeo.com/video/483879872?portrait=0&transparent=1',
    videoSupport: 'The Truth, that inspires Beauty is what we are after.',
    supportingPoints: [
      'We will never know everything... but we can set the intention to look for truth, and align with it.',
      'Is there anything more beautiful than a man or woman connected deeply to the truth they carry in their soul? Maybe not.',
      '1- What does it mean to you to Be Beauty or Truth?',
      '2- Why is it important to Be Truth or Beauty?',
      '3- Try connecting truth with the breathe... "Breathe in truth... breathe out truth". Say to self "I am Beauty" or "I am Truth".',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Set the intention to look for truth, and align with it.',
    practice: 'Connect truth with the breath and repeat "I am Beauty" or "I am Truth".',
    prompts: [
      'What does it mean to me to Be Beauty or Truth?',
      'Why is it important to Be Truth or Beauty?',
      'What truth in my soul wants fuller alignment?',
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
    videoLabel: 'Intentions Worth Planting · Intention 4',
    videoUrl: 'https://player.vimeo.com/video/488237870?portrait=0&transparent=1',
    videoSupport: 'When the word lands well in the heart, it changes it.',
    supportingPoints: [
      'The type of Love we\'re talking about, is fundamental to life.',
      'Love is one of the most important words we have.',
      '1- What does it mean to you to Be Love?',
      '2- Why is it important to Be Love?',
      '3- Try connecting love with the breathe... "Breathe in love... breathe out love". Say to self "I am Love".',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'When the word lands well in the heart, it changes it.',
    practice: 'Connect love with the breath and repeat "I am Love" throughout the day.',
    prompts: [
      'What does it mean to me to Be Love?',
      'Why is it important to Be Love?',
      'How does the word land in my heart?',
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
    videoLabel: 'Intentions Worth Planting · Intention 5',
    videoUrl: 'https://player.vimeo.com/video/483880757?portrait=0&transparent=1',
    videoSupport: 'Choose to believe that abundance exists.',
    supportingPoints: [
      '1- What does Abundance mean to you?',
      '2- Why is it important to Be Abundance, or believe in abundance?',
      '3- Try connecting the idea of abundance with your breathe... "Breathe in abundance... breathe out abundance". Say to self "I am Abundant".',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Choose to believe that abundance exists.',
    practice: 'Connect abundance with the breath and repeat "I am Abundant".',
    prompts: [
      'What does Abundance mean to me?',
      'Why is it important to believe in abundance?',
      'What changes when I choose to believe abundance exists?',
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
    videoLabel: 'Intentions Worth Planting · Intention 6',
    videoUrl: 'https://player.vimeo.com/video/483881976?portrait=0&transparent=1',
    videoSupport: 'When we set the intention to be receptive, we allow the possibility to remove blinders we didn\'t know we had.',
    supportingPoints: [
      '1- What does it mean to you to Be Receptivity?',
      '2- Why is it important to Be Receptive?',
      '3- Try connecting receptivity with the breathe... "Breathe in receptivity... breathe out receptivity". Say to self "I am Receptive".',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Receptivity is key to growth, healing and change.',
    practice: 'Connect receptivity with the breath and repeat "I am Receptive".',
    prompts: [
      'What does it mean to me to Be Receptive?',
      'Why is it important to Be Receptive?',
      'What blinders might receptivity help remove?',
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
    videoLabel: 'Intentions Worth Planting · Intention 7',
    videoUrl: 'https://player.vimeo.com/video/486241765?portrait=0&transparent=1',
    videoSupport: 'Try connecting your Expansiveness/Life with the breathe...',
    supportingPoints: [
      '1- What does it mean to you to Be Ever-Expanding?',
      '2- Why is it important to Be Ever-Expansive, or Ever-Expanding?',
      '3- Say to self "I am Ever-Expansiveness" or "I am Life", throughout the day (set a reminder).',
    ],
    integrationHeading: 'Reflection',
    integrationBody: 'Life grows and is ever growing. Life is ever-expansive.',
    practice: 'Connect expansiveness with the breath and repeat "I am Life" or "I am Ever-Expansive".',
    prompts: [
      'What does it mean to me to Be Ever-Expanding?',
      'Why is it important to Be Ever-Expansive?',
      'Where is life asking me to expand?',
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
    videoLabel: 'Intentions Worth Planting · Summary',
    videoUrl: 'https://player.vimeo.com/video/486242220?portrait=0&transparent=1',
    videoSupport: 'Planting seeds, means watering and tending.',
    supportingPoints: [
      'I honor you for getting here.',
      'Keep tending these seeds by increasing your awareness of what they mean to you, and they will serve you well.',
      '1- Set a reminder on your phone to remember these 7 intentions once a day for the next 30 days.',
      '2- Meditate on these 7 intentions.',
      'Creative, Kind, Beauty/Truth, Love, Abundance, Receptive, Ever-Expanding.',
      'These intentions are an excellent way to start the day, an incredible way to end the day, and a transformational way to live.',
    ],
    integrationHeading: 'Implementation',
    integrationBody: 'Keep tending these seeds by increasing your awareness of what they mean to you.',
    practice: 'Set a reminder on your phone and meditate on these 7 intentions.',
    prompts: [
      'Which of the 7 intentions most needs watering right now?',
      'How will I remember these 7 intentions once a day for the next 30 days?',
      'How do I want these intentions to live in daily life?',
    ],
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
    mapBody: 'This 21-day path moves through Heart Unlock, Iron John / Language Of The Heart, and Intentions Worth Planting. Some days now carry two video steps so the course rhythm stays true to the original material.',
    integrationHeading: 'Pacing note',
    integrationBody: 'One day at a time is best. Intro steps open the next lesson immediately, while the rest of the path opens at your next midnight when your time zone is confirmed, or 20 hours after completion otherwise.',
    integrationAdminBypass: 'Admin view bypasses drip locks so you can inspect the full course experience.',
    trackLabels: ['Part 1', 'Part 2', 'Part 3'],
    trackTitles: ['Heart Unlock', 'Iron John / Language Of The Heart', 'Intentions Worth Planting'],
    trackDaysLabels: ['Intro + Days 1–7', 'Part 2 Intro + Days 8–14', 'Part 3 Intro + Days 15–21 + Summary'],
    trackStatusLabel: 'Admin open',
    trackNotes: [
      'Mirrors https://heartunlock.paulcropper.com/ and uses direct source language wherever possible.',
      'Mirrors https://ironjohn.paulcropper.com/ and uses direct source language wherever possible.',
      'Mirrors https://intentions.paulcropper.com/ and uses direct source language wherever possible.',
    ],
  },
  locked: {
    eyebrow: 'Quest Rhythm',
    title: 'The next lesson is still ripening.',
    body: 'Good work. Let the previous lesson settle before the next gate opens.',
    cardHeading: 'Next unlock',
    cardBody: 'The previous lesson video has not been marked complete yet.',
  },
  complete: {
    eyebrow: 'Quest Rhythm',
    title: 'Lesson complete.',
    body: 'Let it settle. Let it work on you a little before the next threshold opens.',
    cardHeading: 'Next lesson unlocks in',
    cardBody: 'Completion saved. Return to the portal to continue.',
    backToPortalLabel: 'Back to portal',
  },
  lessons,
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
    editorNote: 'Mirrors https://heartunlock.paulcropper.com/ and uses direct source language wherever possible.',
  },
  {
    id: 'course-2',
    label: 'Part 2',
    title: 'Iron John / Language Of The Heart',
    lessonIds: ['iron-intro', 'iron-day-1', 'iron-day-2', 'iron-day-3', 'iron-day-4', 'iron-day-5', 'iron-day-6', 'iron-day-7', 'iron-day-8'],
    daysLabel: 'Part 2 Intro + Days 8–14',
    editorNote: 'Mirrors https://ironjohn.paulcropper.com/ and uses direct source language wherever possible.',
  },
  {
    id: 'course-3',
    label: 'Part 3',
    title: 'Intentions Worth Planting',
    lessonIds: ['intentions-intro', 'intentions-1', 'intentions-2', 'intentions-3', 'intentions-4', 'intentions-5', 'intentions-6', 'intentions-7', 'intentions-summary'],
    daysLabel: 'Part 3 Intro + Days 15–21 + Summary',
    editorNote: 'Mirrors https://intentions.paulcropper.com/ and uses direct source language wherever possible.',
  },
]
