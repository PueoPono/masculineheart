import { HomePage } from '@/components/home-page'
import { AdminMenu } from '@/components/admin-menu'
import { getLandingPrice } from '@/lib/landing-data'

export default async function Page() {
  const price = await getLandingPrice()

  return (
    <>
      <AdminMenu portalHref="/portal" adminHref="/admin" extraLinks={[{ href: '/portal/lesson/heart-intro', label: 'Open intro lesson' }]} />
      <HomePage price={price} />
    </>
  )
}
