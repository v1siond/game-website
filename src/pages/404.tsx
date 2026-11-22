import Head from 'next/head'
import { NotFoundScreen, useAddressLocale } from '@/components/errorScreens'
import { BUNDLED_ERROR_PAGES } from '@/lib/cv/bundledErrorPages'
import { errorTitle } from '@/lib/cv/errorPages'

/** Pages Router 404. Same screen the App Router serves, so the two halves of the site agree. */
export default function NotFoundPage() {
  const { fullName, text } = BUNDLED_ERROR_PAGES[useAddressLocale()]

  return (
    <>
      <Head>
        <title>{errorTitle(text.notFoundTitle, fullName)}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <NotFoundScreen text={text} />
    </>
  )
}
