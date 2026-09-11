import Head from 'next/head'
import type { NextPageContext } from 'next'
import { NotFoundScreen, ServerErrorScreen } from '@/components/errorScreens'

/**
 * The Pages Router catch-all: every status that is not covered by `404.tsx` or `500.tsx`, plus any
 * client-side navigation error. Without it these fall to Next's stock grey page.
 *
 * A 404 arriving here is still a 404, so it gets the same screen rather than a second, vaguer one.
 */
function ErrorPage({ statusCode }: { statusCode?: number }) {
  const notFound = statusCode === 404

  return (
    <>
      <Head>
        <title>{notFound ? 'Page not found' : 'Something went wrong'} | Alexander Pulido</title>
        <meta name="robots" content="noindex" />
      </Head>
      {notFound ? <NotFoundScreen /> : <ServerErrorScreen status={statusCode} />}
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => ({
  statusCode: res?.statusCode ?? err?.statusCode,
})

export default ErrorPage
