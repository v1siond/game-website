'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { WorldCV } from '@/lib/cv/content'
import type { Labels } from '@/lib/cv/labels'
import { viewFor, type CVView } from '@/lib/cv/cvView'
import { useProfession } from '@/contexts/ProfessionContext'
import { ServerYearProvider, useYearNow } from '@/hooks/useYearNow'

// The world's part of the CV the page loaded on the server (content/cv through getAllCVData, then
// worldCV), handed to every world and to /cv's toolbar. Nothing imports a data file: components read
// this context, what a world draws for a profession comes from viewFor, and every piece of interface
// text from useLabels. `year` is the year the page rendered in, which useYearNow serves until hydration
// is done.

const CVDataContext = createContext<WorldCV | null>(null)
const WorldViewContext = createContext<CVView | null>(null)

// The view of the profession picked now, computed once here for every component that reads useWorldView,
// so a profession switch runs viewFor once instead of once per caller.
function WorldViewProvider({ cv, children }: { cv: WorldCV; children: ReactNode }) {
  const { active } = useProfession()
  const year = useYearNow()
  const view = useMemo(() => viewFor(cv, active, 'world', year), [cv, active, year])
  return <WorldViewContext.Provider value={view}>{children}</WorldViewContext.Provider>
}

export function CVDataProvider({ cv, year, children }: { cv: WorldCV; year: number; children: ReactNode }) {
  return (
    <CVDataContext.Provider value={cv}>
      <ServerYearProvider value={year}>
        <WorldViewProvider cv={cv}>{children}</WorldViewProvider>
      </ServerYearProvider>
    </CVDataContext.Provider>
  )
}

export function useCVData(): WorldCV {
  const cv = useContext(CVDataContext)
  if (!cv) throw new Error('useCVData must be used within a CVDataProvider (the site page loads the CV and wraps the world in it)')
  return cv
}

/** The interface text of the loaded locale (content/cv/labels.json): the one way a component reads a label. */
export function useLabels(): Labels {
  return useCVData().labels
}

/** What a world draws for the profession picked now: the recruiter hero and that profession's sections. */
export function useWorldView(): CVView {
  const view = useContext(WorldViewContext)
  if (!view) throw new Error('useWorldView must be used within a CVDataProvider (the site page loads the CV and wraps the world in it)')
  return view
}
