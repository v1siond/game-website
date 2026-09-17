'use client'

import { useEffect } from 'react'
import { CrashScreen } from '@/components/errorScreens'

/**
 * App Router segment error boundary, a page under `src/app` that threw while rendering.
 *
 * Next hands us `reset`, which re-renders the segment. It is logged first: a crash the visitor
 * recovers from with one click still has to be findable afterwards.
 */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app] a page crashed while rendering:', error)
  }, [error])

  return <CrashScreen error={error} reset={reset} />
}
