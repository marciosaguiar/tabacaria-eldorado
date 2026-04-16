import CockpitClient from '@/components/CockpitClient'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { getSettings } from '@/lib/settings'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()])

  return (
    <>
      <AnalyticsTracker page="home" />
      <CockpitClient settings={settings} products={products} />
    </>
  )
}
