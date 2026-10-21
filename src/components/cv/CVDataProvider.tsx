'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { viewFor, type CVView } from '@/lib/cv/cvView'
import { useProfession } from '@/contexts/ProfessionContext'

// The CV the site page loaded on the server (content/cv through getAllCVData), handed to every world.
// The worlds never import a data file: they read this context, and what they draw for a profession
// comes from viewFor.

const CVDataContext = createContext<CVData | null>(null)

export function CVDataProvider({ cv, children }: { cv: CVData; children: ReactNode }) {
  return <CVDataContext.Provider value={cv}>{children}</CVDataContext.Provider>
}

export function useCVData(): CVData {
  const cv = useContext(CVDataContext)
  if (!cv) throw new Error('useCVData must be used within a CVDataProvider (the site page loads the CV and wraps the world in it)')
  return cv
}

/** What a world draws for the profession picked now: the recruiter hero and that profession's sections. */
export function useWorldView(): CVView {
  const cv = useCVData()
  const { active } = useProfession()
  return useMemo(() => viewFor(cv, active, 'world'), [cv, active])
}
