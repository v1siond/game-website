'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY, type Theme, getThemeById } from '@/themes/themes'

/**
 * THE FAILURE SCREEN — one page behind every error the site can serve.
 *
 * Alexander, 2026-09-10: *"let's correctly handle errors in frontend, like 404, 500, etc. We need an
 * actual real page and good UX"*. Before this the site had no error page at all: `src/pages` held only
 * `_app`/`_document` and the game-engine routes, `src/app` had no `not-found`/`error`, so every miss
 * fell through to Next's own grey stock page in production and to the dev overlay in development.
 *
 * ONE component, six entry points (`app/not-found`, `app/error`, `app/global-error`, `pages/404`,
 * `pages/500`, `pages/_error`), so a 404 in the App Router and a 404 in the Pages Router are the same
 * screen rather than two that drift.
 *
 * ## Why it reads the world itself instead of `useTheme()`
 *
 * The site is a world select: the visitor picks one of 17 game worlds and the whole portfolio renders
 * in it. An error should look like the place it happened, so this screen wears the current world's
 * palette. It cannot ask the provider for it, though — `useTheme()` THROWS when no `ThemeProvider` is
 * mounted, and two of the six entry points have none: `global-error` replaces the root layout after it
 * crashed, and the Pages Router tree never had one. A screen whose job is to survive a crash must not
 * be able to cause one, so it reads the same stored world the provider reads, and starts from the
 * default world until it is mounted (the provider's own hydration dance).
 */

/** One thing the visitor can do next. A `href` navigates, an `onClick` acts in place (retry, reset). */
export interface ErrorAction {
  label: string
  href?: string
  onClick?: () => void
  /** The one action being recommended. Exactly one action should carry it. */
  primary?: boolean
}

export interface ErrorScreenProps {
  /** The HTTP status, when there is one. A client-side crash has none and shows no number. */
  status?: number
  /** What happened, in the visitor's terms. Sentence case, no apology. */
  headline: string
  /** Why it happened and what to do about it. Two short sentences at most. */
  detail: ReactNode
  actions: readonly ErrorAction[]
  /** The thrown message / digest. Collapsed: available to whoever wants it, not shouted at everyone. */
  technical?: string
}

/** The custom properties the stylesheet paints from. Typed as CSSProperties so React accepts the vars. */
function paletteVars(theme: Theme): CSSProperties {
  const { colors } = theme
  return {
    '--err-bg': colors.background,
    '--err-surface': colors.surface,
    '--err-text': colors.text,
    '--err-muted': colors.textMuted,
    '--err-accent': colors.accent,
    '--err-border': colors.border,
    '--err-font': theme.font,
  } as CSSProperties
}

/**
 * The world the visitor is in, read without the provider.
 *
 * Starts at the default world so the server render and the first client render agree, then switches
 * to the stored one after mount. `localStorage` is wrapped because a browser set to block site data
 * throws on access, and an error screen that throws is no error screen.
 */
function useStoredWorld(): Theme {
  const [theme, setTheme] = useState<Theme>(() => getThemeById(DEFAULT_THEME_ID))

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (stored) setTheme(getThemeById(stored))
    } catch {
      // no stored world available; the default one is already showing
    }
  }, [])

  return theme
}

export function ErrorScreen({ status, headline, detail, actions, technical }: ErrorScreenProps) {
  const theme = useStoredWorld()

  return (
    <main className="c-error" style={paletteVars(theme)} role="main">
      <div className="c-error__body">
        {status !== undefined && (
          <p className="c-error__status" aria-label={`HTTP status ${status}`}>
            {status}
          </p>
        )}
        <hr className="c-error__rule" />
        <h1 className="c-error__headline">{headline}</h1>
        <p className="c-error__detail">{detail}</p>

        <div className="c-error__actions">
          {actions.map(action => (
            <ErrorActionControl key={action.label} action={action} />
          ))}
        </div>

        {technical && (
          <details className="c-error__technical">
            <summary>What the code said</summary>
            <pre className="c-error__trace">{technical}</pre>
          </details>
        )}
      </div>
    </main>
  )
}

/**
 * An action renders as the element that matches what it DOES: a link when it goes somewhere, a button
 * when it acts on the page. Keyboard behaviour, middle-click and "open in new tab" all follow from
 * that, which is why a button is never dressed up as a link here.
 *
 * A plain `<a>` rather than `next/link`: this screen also renders from `global-error`, where the
 * router may be part of what broke, and a full page load is the recovery.
 */
function ErrorActionControl({ action }: { action: ErrorAction }) {
  const className = `c-error__action${action.primary ? ' c-error__action--primary' : ''}`

  if (action.href) {
    return (
      <a className={className} href={action.href}>
        {action.label}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={action.onClick}>
      {action.label}
    </button>
  )
}
