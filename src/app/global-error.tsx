'use client'

import { useEffect } from 'react'
import { CrashScreen } from '@/components/errorScreens'

/**
 * The root layout itself threw.
 *
 * This one REPLACES the layout, providers and all, so it has to render its own `<html>`/`<body>`.
 * Nothing here may depend on a context: `ErrorScreen` reads the world straight from storage for
 * exactly this case. Global styles are imported directly because the layout that used to do it is
 * the thing that failed.
 */
import '../styles/globals.css'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error('[app] the root layout crashed:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <CrashScreen error={error} />
      </body>
    </html>
  )
}
