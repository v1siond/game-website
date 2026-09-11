import type { Metadata } from 'next'
import { NotFoundScreen } from '@/components/errorScreens'

export const metadata: Metadata = {
  title: 'Page not found | Alexander Pulido',
  robots: { index: false, follow: false },
}

/** App Router 404. Renders inside the root layout, so the world's providers are still around it. */
export default function NotFound() {
  return <NotFoundScreen />
}
