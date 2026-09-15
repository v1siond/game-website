'use client'

import { ErrorScreen } from './ErrorScreen'

/**
 * The three failures the site can actually show, written once.
 *
 * Both routers are live here (`src/app` and `src/pages`), so each failure has two entry points and
 * they must not drift into two different pages. The route files are one line each; the words and the
 * pathways out live here.
 *
 * The copy follows one rule: say what happened, then say what to do about it. No apology, no "oops",
 * nothing vague. A person who lands on one of these wants out of it, and the fastest way out is the
 * primary action.
 */

/** Where every screen can always send someone. Absolute paths: a failed page may have a broken router. */
const HOME = '/'
const GAME_ENGINE = '/personal-projects/game-engine'

/** 404 — the address matches nothing. */
export function NotFoundScreen() {
  return (
    <ErrorScreen
      status={404}
      headline="This page is not on the map"
      detail="The address does not match anything on the site. It is usually an old link, or a typo in the URL."
      actions={[
        { label: 'Go to the home page', href: HOME, primary: true },
        { label: 'Open the game engine', href: GAME_ENGINE },
      ]}
    />
  )
}

/** 5xx — the server broke. Retrying is honest advice here, so it leads. */
export function ServerErrorScreen({ status = 500, technical }: { status?: number; technical?: string }) {
  return (
    <ErrorScreen
      status={status}
      headline="The server could not finish this request"
      detail="This one is on the server, not on your connection. Loading the page again usually clears it."
      actions={[
        { label: 'Reload this page', onClick: () => window.location.reload(), primary: true },
        { label: 'Go to the home page', href: HOME },
      ]}
      technical={technical}
    />
  )
}

/**
 * A page that threw while rendering. No status: nothing failed over the wire, the page itself did.
 *
 * `reset` is React's own retry — it re-renders the segment that threw. It is the primary action
 * because a crash from a one-off state (a half-loaded catalog, a stale prop) survives a reload but
 * not a re-render, and a reload is one click further along anyway.
 */
export function CrashScreen({ error, reset }: { error: Error & { digest?: string }; reset?: () => void }) {
  const retry = reset ?? (() => window.location.reload())

  return (
    <ErrorScreen
      headline="This page stopped running"
      detail="Something in the page threw an error before it finished drawing. Try it again, and if it keeps happening the home page is a clean start."
      actions={[
        { label: 'Try again', onClick: retry, primary: true },
        { label: 'Go to the home page', href: HOME },
      ]}
      technical={error.digest ? `${error.message}\n\ndigest: ${error.digest}` : error.message}
    />
  )
}
