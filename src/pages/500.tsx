import Head from 'next/head'
import { ServerErrorScreen } from '@/components/errorScreens'

/** Pages Router 500 — what a visitor sees when the server render fails in production. */
export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Server error | Alexander Pulido</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ServerErrorScreen />
    </>
  )
}
