import Head from 'next/head'
import type { NextPageContext } from 'next'
import { NotFoundScreen, ServerErrorScreen } from '@/components/errorScreens'
import { BUNDLED_ERROR_PAGES } from '@/lib/cv/bundledErrorPages'
import { errorTitle, localeOfPath } from '@/lib/cv/errorPages'
import type { Locale } from '@/i18n/config'

/**
 * The Pages Router catch-all: every status that is not covered by `404.tsx` or `500.tsx`, plus any
 * client-side navigation error. Without it these fall to Next's stock grey page.
 *
 * A 404 arriving here is still a 404, so it gets the same screen rather than a second, vaguer one. The
 * language is the address's, read where the status is (getInitialProps has the path on both sides).
 */
function ErrorPage({ statusCode, locale }: { statusCode?: number; locale: Locale }) {
  const notFound = statusCode === 404
  const { fullName, text } = BUNDLED_ERROR_PAGES[locale]

  return (
    <>
      <Head>
        <title>{errorTitle(notFound ? text.notFoundTitle : text.otherErrorTitle, fullName)}</title>
        <meta name="robots" content="noindex" />
      </Head>
      {notFound ? <NotFoundScreen text={text} /> : <ServerErrorScreen text={text} status={statusCode} />}
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err, asPath }: NextPageContext) => ({
  statusCode: res?.statusCode ?? err?.statusCode,
  locale: localeOfPath(asPath),
})

export default ErrorPage
