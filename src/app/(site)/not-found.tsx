import type { Metadata } from 'next'
import { NotFoundAtPath } from '@/components/errorScreens'
import { getErrorPages } from '@/lib/cv-data'

// The tab title is the screen's own <title>: it is in the language of the address, which only the screen
// can read (a not-found page gets no params).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/** App Router 404 for every unknown URL (see `[...missing]`). Renders inside the site layout, so the world's providers are still around it. */
export default async function NotFound() {
  return <NotFoundAtPath pages={await getErrorPages()} />
}
