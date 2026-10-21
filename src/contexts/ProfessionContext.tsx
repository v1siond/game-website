'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type Profession, DEFAULT_PROFESSION, professionOnLoad } from '@/lib/cv/professions'

export type { Profession }

interface ProfessionContextType {
  active: Profession
  setActive: (p: Profession) => void
}

const ProfessionContext = createContext<ProfessionContextType | undefined>(undefined)

// Every visit opens on the default profession: a pick lasts for the visit and is never restored, so a
// recruiter coming back always lands on System Engineer. The visit is the tab's sessionStorage, which a
// new visit starts empty; it carries the pick across the reload between the site and the CV, which are
// separate root layouts. `?profession=` overrides it.
const VISIT_PROFESSION_KEY = 'portfolio-visit-profession'

// Storage can be blocked (private mode, disabled site data); the pick then lasts for the page only.
function readVisitPick(): string | null {
  try {
    return sessionStorage.getItem(VISIT_PROFESSION_KEY)
  } catch {
    return null
  }
}

function writeVisitPick(profession: Profession) {
  try {
    sessionStorage.setItem(VISIT_PROFESSION_KEY, profession)
  } catch {
    // Blocked storage only shortens the pick to this page; nothing to recover.
  }
}

export function ProfessionProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<Profession>(DEFAULT_PROFESSION)

  // Read after mount so the server render and the first client render agree.
  useEffect(() => {
    const onLoad = professionOnLoad(window.location.search, readVisitPick())
    if (onLoad) setActiveState(onLoad)
  }, [])

  const setActive = (profession: Profession) => {
    writeVisitPick(profession)
    setActiveState(profession)
  }

  const value: ProfessionContextType = { active, setActive }

  return (
    <ProfessionContext.Provider value={value}>
      {children}
    </ProfessionContext.Provider>
  )
}

export function useProfession(): ProfessionContextType {
  const context = useContext(ProfessionContext)
  if (context === undefined) {
    throw new Error('useProfession must be used within a ProfessionProvider')
  }
  return context
}
