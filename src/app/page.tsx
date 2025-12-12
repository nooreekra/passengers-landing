import LandingPage from './LandingPage'

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return <LandingPage />
}
