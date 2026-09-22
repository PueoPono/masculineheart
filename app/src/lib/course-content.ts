export {
  defaultSiteContent,
  getLessonBySlug,
  getNextLesson,
  getPreviousLesson,
} from '@/lib/site-content'

export type { LessonContent as CourseLesson } from '@/lib/site-content'

import { defaultSiteContent } from '@/lib/site-content'

export const courseLessons = defaultSiteContent.lessons
