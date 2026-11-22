'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ErrorScreen, type ErrorStatus } from './ErrorScreen'
import { ENGINE_URL } from '@/lib/engineLink'
import { fillLabel } from '@/lib/cv/labels'
import { errorTitle, localeOfPath, type ErrorPages, type ErrorText } from '@/lib/cv/errorPages'
import { defaultLocale, type Locale } from '@/i18n/config'

/**
 * The three failures the site can actually show, written once.
 *
 * Both routers are live here (`src/app` and `src/pages`), so each failure has two entry points and
 * they must not drift into two different pages. The route files are one line each; the words and the
 * pathways out live here.
 *
 * The copy follows one rule: say what happened, then say what to do about it. No apology, no "oops",
 * nothing vague. A person who lands on one of these wants out of it, and the fastest way out is the
 * primary action. The 404 and 500 words come from labels.json (errors), in the language of the address.
 */

/** Where every screen can always send someone. Absolute paths: a failed page may have a broken router. */
const HOME = '/'

const statusOf = (code: number, text: ErrorText): ErrorStatus => ({ code, label: fillLabel(text.status, { status: code }) })

/** The language of the address an App Router error renders at, known on the server render too. */
function usePathLocale(): Locale {
  return localeOfPath(usePathname())
}

/**
 * The language of the address a Pages Router error page is shown at. Those pages are built once, so the
 * first render is the built English one (hydration matches it) and the address is read after mount.
 */
export function useAddressLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    setLocale(localeOfPath(window.location.pathname))
  }, [])

  return locale
}

/** 404, the address matches nothing. */
export function NotFoundScreen({ text }: { text: ErrorText }) {
  return (
    <ErrorScreen
      status={statusOf(404, text)}
      headline={text.notFoundHeadline}
      detail={text.notFoundDetail}
      actions={[
        { label: text.goHome, href: HOME, primary: true },
        { label: text.openEngine, href: ENGINE_URL },
      ]}
    />
  )
}

/** The App Router 404 with its tab title, in the language of the address (/es/old-link reads Spanish). */
export function NotFoundAtPath({ pages }: { pages: ErrorPages }) {
  const { fullName, text } = pages[usePathLocale()]
  return (
    <>
      <title>{errorTitle(text.notFoundTitle, fullName)}</title>
      <NotFoundScreen text={text} />
    </>
  )
}

/** 5xx, the server broke. Retrying is honest advice here, so it leads. */
export function ServerErrorScreen({ text, status = 500, technical }: { text: ErrorText; status?: number; technical?: string }) {
  return (
    <ErrorScreen
      status={statusOf(status, text)}
      headline={text.serverErrorHeadline}
      detail={text.serverErrorDetail}
      actions={[
        { label: text.reload, onClick: () => window.location.reload(), primary: true },
        { label: text.goHome, href: HOME },
      ]}
      technical={technical}
    />
  )
}

/**
 * A page that threw while rendering. No status: nothing failed over the wire, the page itself did.
 *
 * `reset` is React's own retry, it re-renders the segment that threw. It is the primary action
 * because a crash from a one-off state (a half-loaded catalog, a stale prop) survives a reload but
 * not a re-render, and a reload is one click further along anyway.
 */
export function CrashScreen({ error, reset }: { error: Error & { digest?: string }; reset?: () => void }) {
  const retry = reset ?? (() => window.location.reload())

  return (
    <ErrorScreen
      headline="This page stopped running"
      detail="Something in the page threw an error before it finished drawing."
      actions={[
        { label: 'Try again', onClick: retry, primary: true },
        { label: 'Go to the home page', href: HOME },
      ]}
      technical={error.digest ? `${error.message}\n\ndigest: ${error.digest}` : error.message}
    />
  )
}
