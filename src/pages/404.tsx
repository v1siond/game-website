import Head from 'next/head'
import { NotFoundScreen } from '@/components/errorScreens'

/** Pages Router 404. Same screen the App Router serves, so the two halves of the site agree. */
export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page not found | Alexander Pulido</title>
        <meta name="robots" content="noindex" />
      </Head>
      <NotFoundScreen />
    </>
  )
}
