import LandingPageClient from './LandingPageClient'

// Отключаем статическую генерацию (работает только в серверных компонентах)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  return <LandingPageClient />
}
