'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { SkipLink } from './AccessibilityStyles'

// =============================================================================
// SHARED THEME LAYOUT
// Standard content order for ALL themes:
// 1. Header (name, title, tagline)
// 2. About section
// 3. ART SECTION (decorative themed break)
// 4. Work Experience
// 5. ART SECTION
// 6. Tech Stack / Skills
// 7. Featured Work (Projects)
// 8. ART SECTION
// 9. Ventures (Companies for engineer, Bands for drummer)
// 10. Posts (if any)
// 11. Footer
// =============================================================================

// Types for theme customization
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  textMuted: string
}

export interface ThemeSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export interface ThemeArtSectionProps {
  variant: 'after-about' | 'after-experience' | 'after-skills'
  className?: string
}

// Data hook - provides all CV data for themes
export function useThemeData() {
  const { active, setActive } = useProfession()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)
  const featuredProjects = projects.filter(p => p.featured)

  return {
    // Profession
    active,
    setActive,
    isEngineer: active === 'engineer',
    isDrummer: active === 'drummer',
    isFighter: active === 'fighter',

    // Data
    aboutData,
    professionalSummary: PROFESSIONAL_SUMMARY,
    currentRoles: CURRENT_ROLES,
    experience,
    engineerTech,
    otherSkills,
    projects,
    featuredProjects,
    companies: COMPANIES,
    bands: BANDS,
  }
}

// Section order enum for type safety
export enum SectionOrder {
  Header = 1,
  About = 2,
  ArtAfterAbout = 3,
  Experience = 4,
  ArtAfterExperience = 5,
  Skills = 6,
  FeaturedWork = 7,
  ArtAfterSkills = 8,
  Ventures = 9,
  Posts = 10,
  Footer = 11,
}

// Props for the main layout wrapper
export interface ThemeLayoutProps {
  children: ReactNode
  className?: string
  backgroundStyle?: React.CSSProperties
  globalStyles?: string
}

// Hook to detect reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Layout wrapper - themes use this to maintain consistent z-indexing and structure
export function ThemeLayoutWrapper({
  children,
  className = '',
  backgroundStyle,
  globalStyles,
}: ThemeLayoutProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={backgroundStyle}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
    >
      <SkipLink href="#main-content" />
      {globalStyles && (
        <style jsx global>{globalStyles}</style>
      )}
      {children}
    </div>
  )
}

// Section wrapper with consistent z-index and spacing
export function ThemeSection({
  children,
  className = '',
  order,
  id,
}: {
  children: ReactNode
  className?: string
  order?: SectionOrder
  id?: string
}) {
  return (
    <section
      id={id}
      className={`relative z-20 py-8 px-6 ${className}`}
      data-section-order={order}
    >
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </section>
  )
}

// Art section placeholder - themes override with their own decorative elements
export function ThemeArtSection({
  children,
  variant,
  className = '',
}: {
  children: ReactNode
  variant: ThemeArtSectionProps['variant']
  className?: string
}) {
  return (
    <div
      className={`relative z-10 py-6 ${className}`}
      data-art-section={variant}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

// Header section wrapper with consistent positioning
export function ThemeHeader({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <header className={`relative z-30 p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </header>
  )
}

// Footer section wrapper
export function ThemeFooter({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <footer className={`relative z-20 py-16 text-center ${className}`}>
      {children}
    </footer>
  )
}

// Profession selector props - themes implement their own visual style
export interface ProfessionSelectorProps {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (profession: 'engineer' | 'drummer' | 'fighter') => void
  reducedMotion?: boolean
}

// Navigation wrapper for consistent positioning
export function ThemeNav({
  children,
  className = '',
  position = 'header',
}: {
  children: ReactNode
  className?: string
  position?: 'header' | 'fixed' | 'sidebar'
}) {
  const positionClasses = {
    header: 'flex gap-3 items-center flex-wrap',
    fixed: 'fixed top-4 right-4 z-50 flex gap-3 items-center',
    sidebar: 'fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3',
  }

  return (
    <nav className={`${positionClasses[position]} ${className}`}>
      {children}
    </nav>
  )
}

// Export section content order as a guide
export const SECTION_ORDER = [
  'header',           // Name, title, tagline, nav
  'about',            // Bio and quick facts
  'art-1',            // Themed decorative break
  'experience',       // Work experience
  'art-2',            // Themed decorative break
  'skills',           // Tech stack or skills
  'featured-work',    // Projects
  'art-3',            // Themed decorative break
  'ventures',         // Companies (engineer) or Bands (drummer)
  'posts',            // Blog posts if any
  'footer',           // Footer with themed elements
] as const

export type SectionName = typeof SECTION_ORDER[number]

export default {
  ThemeLayoutWrapper,
  ThemeSection,
  ThemeArtSection,
  ThemeHeader,
  ThemeFooter,
  ThemeNav,
  useThemeData,
  SECTION_ORDER,
  SectionOrder,
}
