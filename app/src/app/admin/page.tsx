import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { courseLessons } from '@/lib/course-content'

function expectedSession(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
  return createHash('sha256').update(`${username}:${secret}`).digest('hex')
}

export default async function AdminPage() {
  const username = process.env.ADMIN_USERNAME
  const cookieStore = await cookies()
  const session = cookieStore.get('mhq_admin')?.value || ''
  const [sessionUser, signature] = session.split('.')

  if (!username || !signature || sessionUser !== username || signature !== expectedSession(username)) {
    redirect('/admin-login')
  }

  return (
    <main className="min-h-screen px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto max-w-6xl rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Admin</p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Masculine Heart Quest</h1>
            <p className="mt-2 text-[rgba(244,234,220,0.72)]">Signed in as {username}. Buyer access remains separate through magic-link portal authentication.</p>
          </div>
          <form action="/api/admin/logout" method="post"><button className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 font-bold text-[#f4eadc]">Sign out</button></form>
        </div>
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Course days</strong><div className="mt-2 text-3xl font-semibold">{courseLessons.length}</div></div>
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Checkout</strong><div className="mt-2 text-[rgba(244,234,220,0.72)]">Stripe route + webhook scaffold enabled</div></div>
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Portal</strong><div className="mt-2 text-[rgba(244,234,220,0.72)]">Dynamic lesson route active for all days</div></div>
        </section>
        <section className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6">
          <h2 className="mb-4 text-2xl font-semibold">Lesson map</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {courseLessons.map((lesson) => (
              <a key={lesson.id} href={`/portal/lesson/${lesson.slug}`} className="rounded-[18px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 hover:border-[#dca453]">
                <small className="text-[#efc578]">Day {lesson.dayNumber} · {lesson.arc}</small>
                <strong className="mt-1 block">{lesson.title}</strong>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
