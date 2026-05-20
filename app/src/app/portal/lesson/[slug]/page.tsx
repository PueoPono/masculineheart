import { LessonClient } from './lesson-client'

export default async function LessonRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <LessonClient slug={slug} />
}
