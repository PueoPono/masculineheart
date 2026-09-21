import { courseLessons } from '@/lib/course-content'

export type AdminEditorField = {
  key: string
  label: string
  kind: 'text' | 'textarea' | 'list'
  textValue: string
  referenceValue?: string
}

export type AdminEditorPage = {
  slug: string
  label: string
  path: string
  fields: AdminEditorField[]
}

function f(key: string, label: string, textValue: string, kind: AdminEditorField['kind'] = 'textarea'): AdminEditorField {
  return { key, label, textValue, kind, referenceValue: '' }
}

export function getAdminEditorDefaults(): AdminEditorPage[] {
  return [
    {
      slug: 'home',
      label: 'Landing page',
      path: '/',
      fields: [
        f('eyebrow', 'Hero eyebrow', 'Enter the forest deliberately', 'text'),
        f('title', 'Hero title', 'Masculine\nHeart Quest', 'textarea'),
        f('intro', 'Hero intro', 'A 21-day guided descent into heart, symbol, masculinity, intention, and lived vitality — designed with more space, more gravity, and a cleaner threshold into the work.'),
        f('supporting_text', 'Hero supporting text', 'The opening now gives the symbol and title room to breathe before the practical path begins.'),
        f('purchase_label', 'Purchase box label', 'Begin the 21-day quest', 'text'),
        f('purchase_button', 'Purchase button text', 'Purchase course access', 'text'),
        f('portal_button', 'Portal button text', 'Already purchased? Open the portal', 'text'),
        f('preview_button', 'Preview button text', 'Preview day 1', 'text'),
        f('card_1_title', 'Overview card 1 title', 'Quest atmosphere', 'text'),
        f('card_1_text', 'Overview card 1 text', 'Deep forest greens, restrained gold, and grounded shadow give the opening a more premium masculine presence.'),
        f('card_2_title', 'Overview card 2 title', 'Embodied pacing', 'text'),
        f('card_2_text', 'Overview card 2 text', 'The threshold opens wide first. The supporting cards wait lower so the title and symbol can lead the experience.'),
        f('card_3_title', 'Overview card 3 title', 'Brand continuity', 'text'),
        f('card_3_text', 'Overview card 3 text', 'The hand-drawn heart-with-arrow mark now carries through the landing, portal, lesson, completion, and locked states.'),
      ],
    },
    {
      slug: 'portal',
      label: 'Portal / quest map',
      path: '/portal',
      fields: [
        f('eyebrow', 'Portal eyebrow', 'Quest Dashboard', 'text'),
        f('title', 'Portal title', 'Portal', 'text'),
        f('progress_label', 'Progress label', 'Progress', 'text'),
        f('next_available_label', 'Next available label', 'Next available', 'text'),
        f('next_available_text', 'Next available description', 'Continue the quest where it is currently open.'),
        f('open_lesson_button', 'Open lesson button', 'Open current lesson', 'text'),
        f('map_title', 'Quest map title', 'Quest map', 'text'),
        f('map_description', 'Quest map description', 'Live lessons + progress state. Locked lessons open as unlock times are reached.'),
      ],
    },
    {
      slug: 'lesson-template',
      label: 'Lesson page template',
      path: '/portal/lesson/day-1',
      fields: [
        f('video_complete_button', 'Video complete button', 'Video complete', 'text'),
        f('video_complete_done', 'Video complete done label', 'Video complete ✓', 'text'),
        f('task_toggle_show', 'Reflection reveal button', 'Reveal reflection/task', 'text'),
        f('task_toggle_hide', 'Reflection hide button', 'Hide reflection/task', 'text'),
        f('reflection_heading', 'Reflection heading', 'Reflect on these questions', 'text'),
        f('best_practice_label', 'Best practice label', 'Best practice', 'text'),
        f('journal_button', 'Digital journal button', 'Digital journal', 'text'),
        f('journal_description', 'Journal description', 'For your convenience, you can write here and sync your notes to your portal progress.'),
        f('journal_placeholder', 'Journal placeholder', 'Write what comes...', 'text'),
        f('journal_save_button', 'Journal save button', 'Save journal', 'text'),
        f('complete_button', 'Complete button', 'Mark day complete', 'text'),
        f('complete_done_button', 'Complete done button', 'Mark day complete ✓', 'text'),
      ],
    },
    ...courseLessons.map((lesson) => ({
      slug: `lesson-${lesson.slug}`,
      label: `Day ${lesson.dayNumber}: ${lesson.title}`,
      path: `/portal/lesson/${lesson.slug}`,
      fields: [
        f('arc', 'Arc', lesson.arc, 'text'),
        f('title', 'Lesson title', lesson.title, 'text'),
        f('theme', 'Lesson theme', lesson.theme),
        f('video_label', 'Video label', lesson.videoLabel, 'text'),
        f('practice', 'Best practice', lesson.practice),
        f('prompts', 'Reflection prompts', lesson.prompts.join('\n'), 'list'),
      ],
    })),
    {
      slug: 'complete',
      label: 'Completion / next unlock page',
      path: '/portal/complete',
      fields: [
        f('eyebrow', 'Eyebrow', 'Quest Rhythm', 'text'),
        f('title', 'Title', 'Day complete.', 'text'),
        f('description', 'Description', 'You’ve taken the first step into the quest. Let it settle. Let it work on you a little.'),
        f('unlock_heading', 'Unlock heading', 'Next lesson unlocks in 16 hours', 'text'),
      ],
    },
    {
      slug: 'locked',
      label: 'Locked lesson page',
      path: '/portal/locked',
      fields: [
        f('eyebrow', 'Eyebrow', 'Quest Rhythm', 'text'),
        f('title', 'Title', 'The next lesson is still ripening.', 'text'),
        f('description', 'Description', 'Good work. The pacing is intentional. Let today settle before the next gate opens.'),
        f('unlock_heading', 'Unlock heading', 'Next unlock: 16 hours', 'text'),
      ],
    },
    {
      slug: 'auth',
      label: 'Magic-link access page',
      path: '/auth',
      fields: [
        f('eyebrow', 'Eyebrow', 'Access', 'text'),
        f('title', 'Title', 'Enter the Quest', 'text'),
        f('description', 'Description', 'Use your email to receive a magic link. Once authenticated, the portal will load your progress and quest state.'),
        f('email_placeholder', 'Email placeholder', 'you@example.com', 'text'),
        f('button', 'Button text', 'Send magic link', 'text'),
        f('sent_status', 'Sent status', 'Magic link sent. Check your email and return through the link.'),
      ],
    },
  ]
}
