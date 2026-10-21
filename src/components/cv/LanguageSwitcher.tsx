'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useEffect, useState, type ReactNode } from 'react'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { useLabels } from './CVDataProvider'

// The one language switcher. It owns reading and writing the locale cookie and the refresh; a world that
// wants its own look passes `render` and draws the state. The cookie is the only store: it is what the
// server renders from, so the picker can never name a language the page is not in.

export interface LocaleSwitchState {
  currentLocale: Locale
  isPending: boolean
  changeLocale: (locale: Locale) => void
}

interface LanguageSwitcherProps {
  render?: (state: LocaleSwitchState) => ReactNode
}

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function storedLocale(): Locale | null {
  const fromCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('locale='))
    ?.split('=')[1]
  return isLocale(fromCookie) ? fromCookie : null
}

function SelectSwitcher({ currentLocale, isPending, changeLocale }: LocaleSwitchState) {
  const { cvPage, languages, navigation } = useLabels()
  return (
    <div className="flex items-center gap-2 print:hidden">
      <span className="text-sm text-gray-600">{cvPage.language}</span>
      <select
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

export function LanguageSwitcher({ render = renderSelect }: LanguageSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')

  useEffect(() => {
    const stored = storedLocale()
    if (stored) setCurrentLocale(stored)
  }, [])

  const changeLocale = (newLocale: Locale) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}`
    setCurrentLocale(newLocale)
    startTransition(() => {
      router.refresh()
    })
  }

  return <>{render({ currentLocale, isPending, changeLocale })}</>
}
