'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import type { Labels } from '@/lib/cv/labels'
import { viewFor, type CVView } from '@/lib/cv/cvView'
import { useProfession } from '@/contexts/ProfessionContext'

// The CV the page loaded on the server (content/cv through getAllCVData), handed to every world and to
// /cv. Nothing imports a data file: components read this context, what a world draws for a profession
// comes from viewFor, and every piece of interface text from useLabels.

const CVDataContext = createContext<CVData | null>(null)

export function CVDataProvider({ cv, children }: { cv: CVData; children: ReactNode }) {
  return <CVDataContext.Provider value={cv}>{children}</CVDataContext.Provider>
}

export function useCVData(): CVData {
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
  const cv = useCVData()
  const { active } = useProfession()
  return useMemo(() => viewFor(cv, active, 'world'), [cv, active])
}
