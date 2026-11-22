import Head from 'next/head'
import { ServerErrorScreen, useAddressLocale } from '@/components/errorScreens'
import { BUNDLED_ERROR_PAGES } from '@/lib/cv/bundledErrorPages'
import { errorTitle } from '@/lib/cv/errorPages'

/** Pages Router 500, what a visitor sees when the server render fails in production. */
export default function ServerErrorPage() {
  const { fullName, text } = BUNDLED_ERROR_PAGES[useAddressLocale()]

  return (
    <>
      <Head>
        <title>{errorTitle(text.serverErrorTitle, fullName)}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ServerErrorScreen text={text} />
    </>
  )
}
