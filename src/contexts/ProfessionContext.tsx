'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Profession = 'engineer' | 'drummer' | 'fighter'

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
    title: 'System Engineer',
    tagline: 'Building systems that scale',
    icon: '//--',
    color: '#41c8e8',
    years: '10+ years',
  },
  drummer: {
    id: 'drummer',
    title: 'Professional Drummer',
    tagline: 'Rhythm is the architecture of music',
    icon: '(O)',
    color: '#9966cc',
    years: '15 years',
  },
  fighter: {
    id: 'fighter',
    title: 'Martial Arts Instructor',
    tagline: 'Discipline through combat',
    icon: '/|\\',
    color: '#ff4444',
    years: '6 years',
  },
}

interface ProfessionContextType {
  active: Profession
  setActive: (p: Profession) => void
  config: ProfessionConfig
  allProfessions: ProfessionConfig[]
}

const ProfessionContext = createContext<ProfessionContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-profession'

export function ProfessionProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<Profession>('engineer')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // `?profession=<id>` forces a profession on load (used by the preview screenshot /
    // ornament audit script). Harmless otherwise.
    const param = new URLSearchParams(window.location.search).get('profession') as Profession | null
    if (param && PROFESSION_CONFIGS[param]) {
      setActiveState(param)
      return
    }
    const stored = localStorage.getItem(STORAGE_KEY) as Profession | null
    if (stored && PROFESSION_CONFIGS[stored]) {
      setActiveState(stored)
    }
  }, [])

  const setActive = (p: Profession) => {
    setActiveState(p)
    localStorage.setItem(STORAGE_KEY, p)
  }

  const value: ProfessionContextType = {
    active: mounted ? active : 'engineer',
    setActive,
    config: PROFESSION_CONFIGS[mounted ? active : 'engineer'],
    allProfessions: Object.values(PROFESSION_CONFIGS),
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
