import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { courseLessons } from '@/lib/course-content'
import { ADMIN_COOKIE, validateSessionCookie } from '@/lib/admin-auth'
import { getRegisteredUserSummaries } from '@/lib/admin-data'
import { SiteEditor } from '@/components/site-editor'
import { AdminUsersPanel } from '@/components/admin-users-panel'
import { getDripCadenceDescription } from '@/lib/unlock-schedule'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminEmail = validateSessionCookie(cookieStore.get(ADMIN_COOKIE)?.value)

  if (!adminEmail) {
    redirect('/admin-login')
  }

  const users = await getRegisteredUserSummaries()
  const enrolledCount = users.filter((user) => user.enrolled).length

  return (
    <main className="min-h-screen px-3 py-6 text-[#f4eadc] sm:px-4 sm:py-10">
      <div className="mx-auto max-w-[1700px] rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.34)] sm:rounded-[30px] sm:p-7">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Admin</p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#e6bd74] sm:text-4xl">Masculine Heart Quest</h1>
            <p className="mt-2 max-w-3xl text-[rgba(244,234,220,0.72)]">A streamlined site editor modeled on the Community Vector Pilot pattern: Supabase-backed copy persistence, route preview, a dedicated reference editor for agent requests, and live admin navigation into the course.</p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <a href="/portal" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 text-center font-bold text-[#f4eadc] sm:w-auto">Open live course</a>
            <form action="/api/admin/logout" method="post" className="w-full sm:w-auto"><button className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 font-bold text-[#f4eadc] sm:w-auto">Sign out</button></form>
          </div>
        </div>
        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Course days</strong><div className="mt-2 text-3xl font-semibold">{courseLessons.length}</div></div>
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Registered users</strong><div className="mt-2 text-3xl font-semibold">{users.length}</div></div>
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Enrolled users</strong><div className="mt-2 text-3xl font-semibold">{enrolledCount}</div></div>
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5"><strong className="text-[#efc578]">Drip rule</strong><div className="mt-2 text-[rgba(244,234,220,0.72)]">{getDripCadenceDescription()}</div></div>
        </section>
        <div className="grid gap-6">
          <AdminUsersPanel initialUsers={users} />
          <SiteEditor adminEmail={adminEmail} />
        </div>
      </div>
    </main>
  )
}
