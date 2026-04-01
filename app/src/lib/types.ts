export type Profile = {
  id: string
  email: string
  full_name: string | null
  enrolled: boolean
  reminder_email_opt_in: boolean
  reminder_sms_opt_in: boolean
}

export type Lesson = {
  id: string
  day_number: number
  arc: string
  title: string
  slug: string
  is_published: boolean
}

export type LessonProgress = {
  id: string
  user_id: string
  lesson_id: string
  status: string
  completed_at: string | null
  unlock_at: string | null
  journal_text: string | null
}
