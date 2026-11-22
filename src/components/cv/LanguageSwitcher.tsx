'use client'

import { useRouter } from 'next/navigation'
import { useId, useTransition, useEffect, useState, type ReactNode } from 'react'
import { LOCALE_COOKIE, cvPath, defaultLocale, isLocale, locales, type Locale } from '@/i18n/config'
import { useLabels } from './CVDataProvider'

// The one language switcher. It owns the locale cookie and what a pick does; a world that wants its own
// look passes `render` and draws the state. On a CV page (`locale` given, the language of its address) a
// pick opens the CV at that language's address, so the picker always names the language the page is in.
// Elsewhere it starts from the cookie and refreshes; the cookie is also what sends /cv to the picked
// language (src/middleware.ts).

export interface LocaleSwitchState {
  currentLocale: Locale
  isPending: boolean
  changeLocale: (locale: Locale) => void
}

interface LanguageSwitcherProps {
  render?: (state: LocaleSwitchState) => ReactNode
  /** The language of the CV page the switcher sits on. */
  locale?: Locale
}

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const COOKIE_PREFIX = `${LOCALE_COOKIE}=`

function storedLocale(): Locale | null {
  const fromCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(COOKIE_PREFIX))
    ?.slice(COOKIE_PREFIX.length)
  return isLocale(fromCookie) ? fromCookie : null
}

type Placement = 'cvPage' | 'elsewhere'
type Router = ReturnType<typeof useRouter>

// What a pick does after the cookie is written: a CV page opens the CV at the picked language's address,
// any other page re-renders in place with the new cookie.
const AFTER_PICK: Record<Placement, (router: Router, picked: Locale) => void> = {
  cvPage: (router, picked) => router.push(cvPath(picked)),
  elsewhere: (router) => router.refresh(),
}

function SelectSwitcher({ currentLocale, isPending, changeLocale }: LocaleSwitchState) {
  const { cvPage, languages, navigation } = useLabels()
  const selectId = useId()
  return (
    <div className="flex items-center gap-2 print:hidden">
      <label htmlFor={selectId} className="text-sm text-gray-600">
        {cvPage.language}
      </label>
      <select
        id={selectId}
        value={currentLocale}
        onChange={(e) => changeLocale(e.target.value as Locale)}
        disabled={isPending}
        className="min-h-11 text-sm border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {languages[locale]}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="text-sm text-gray-600">{navigation.loading}</span>
      )}
    </div>
  )
}

const renderSelect = (state: LocaleSwitchState) => <SelectSwitcher {...state} />

export function LanguageSwitcher({ render = renderSelect, locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale ?? defaultLocale)

  useEffect(() => {
    if (locale) return
    const stored = storedLocale()
    if (stored) setCurrentLocale(stored)
  }, [locale])

  const changeLocale = (newLocale: Locale) => {
    document.cookie = `${COOKIE_PREFIX}${newLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
    setCurrentLocale(newLocale)
    const placement: Placement = locale ? 'cvPage' : 'elsewhere'
    startTransition(() => AFTER_PICK[placement](router, newLocale))
  }

  return <>{render({ currentLocale, isPending, changeLocale })}</>
}
