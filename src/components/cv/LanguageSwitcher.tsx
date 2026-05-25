'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useEffect, useState } from 'react'
import { locales, localeNames, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')

  useEffect(() => {
    // Read current locale from cookie or localStorage
    const cookieLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined

    const storedLocale = localStorage.getItem('locale') as Locale | null

    if (cookieLocale && locales.includes(cookieLocale)) {
      setCurrentLocale(cookieLocale)
    } else if (storedLocale && locales.includes(storedLocale)) {
      setCurrentLocale(storedLocale)
    }
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    // Store in localStorage
    localStorage.setItem('locale', newLocale)

    // Set cookie for server-side reading
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`

    setCurrentLocale(newLocale)

    // Refresh the page to apply new locale
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <span className="text-sm text-gray-600">Language:</span>
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        disabled={isPending}
        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="text-xs text-gray-500">Loading...</span>
      )}
    </div>
  )
}
