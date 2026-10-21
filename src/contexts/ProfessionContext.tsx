'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  type Profession,
  DEFAULT_PROFESSION,
  PROFESSION_LABELS,
  PROFESSION_ORDER,
  professionOnLoad,
} from '@/lib/cv/professions'

export type { Profession }

export interface ProfessionConfig {
  id: Profession
  title: string
  tagline: string
  icon: string
  color: string
  years: string
}

export const PROFESSION_CONFIGS: Record<Profession, ProfessionConfig> = {
  engineer: {
    id: 'engineer',
    title: PROFESSION_LABELS.engineer,
    tagline: 'Building systems that scale',
    icon: '//--',
    color: '#41c8e8',
    years: '10+ years',
  },
  drummer: {
    id: 'drummer',
    title: PROFESSION_LABELS.drummer,
    tagline: 'Rhythm is the architecture of music',
    icon: '(O)',
    color: '#9966cc',
    years: '15 years',
  },
  fighter: {
    id: 'fighter',
    title: PROFESSION_LABELS.fighter,
    tagline: 'Discipline through combat',
    icon: '/|\\',
    color: '#ff4444',
    years: '4 years',
  },
}

interface ProfessionContextType {
  active: Profession
  setActive: (p: Profession) => void
  config: ProfessionConfig
  allProfessions: ProfessionConfig[]
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

  const value: ProfessionContextType = {
    active,
    setActive,
    config: PROFESSION_CONFIGS[active],
    allProfessions: PROFESSION_ORDER.map((id) => PROFESSION_CONFIGS[id]),
  }

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
