'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// Check for reduced motion preference
function usePrefersReducedMotion(): boolean {
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

// Soul trait colors (Undertale canon)
const SOUL_COLORS = {
  red: '#ff0000',     // Determination
  cyan: '#00ffff',    // Patience
  orange: '#ffa500',  // Bravery
  blue: '#0066ff',    // Integrity
  purple: '#9900ff',  // Perseverance
  green: '#00ff00',   // Kindness
  yellow: '#ffff00',  // Justice
}

// Pixel heart soul - pure SVG, no images
function PixelHeartSoul({
  size = 16,
  color = '#ff0000',
  className = '',
  animate = true,
  ariaLabel = 'Soul heart',
}: {
  size?: number
  color?: string
  className?: string
  animate?: boolean
  ariaLabel?: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !reducedMotion

  // 8x8 pixel heart pattern (Undertale style)
  const heartPixels = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]

  return (
    <span
      className={`inline-block ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        style={{ imageRendering: 'pixelated' }}
        className={shouldAnimate ? 'animate-soul-pulse' : ''}
      >
        {heartPixels.map((row, y) =>
          row.map((pixel, x) =>
            pixel ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            ) : null
          )
        )}
      </svg>
    </span>
  )
}

// SAVE point star (golden sparkle) - pure SVG
function SavePointStar({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg'
}) {
  const reducedMotion = usePrefersReducedMotion()
  const sizeMap = { sm: 16, md: 24, lg: 32 }
  const pixelSize = sizeMap[size]

  return (
    <span
      className={`relative inline-flex items-center justify-center ${!reducedMotion ? 'animate-save-twinkle' : ''}`}
      role="img"
      aria-label="Save point star"
    >
      {/* 4-pointed star pixel art */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 8 8"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Center */}
        <rect x="3" y="3" width="2" height="2" fill="#ffff00" />
        {/* Points */}
        <rect x="3" y="0" width="2" height="3" fill="#ffff00" />
        <rect x="3" y="5" width="2" height="3" fill="#ffff00" />
        <rect x="0" y="3" width="3" height="2" fill="#ffff00" />
        <rect x="5" y="3" width="3" height="2" fill="#ffff00" />
        {/* Glow corners */}
        <rect x="2" y="2" width="1" height="1" fill="#ffa500" />
        <rect x="5" y="2" width="1" height="1" fill="#ffa500" />
        <rect x="2" y="5" width="1" height="1" fill="#ffa500" />
        <rect x="5" y="5" width="1" height="1" fill="#ffa500" />
      </svg>
    </span>
  )
}

// Flowey silhouette - pure CSS/SVG
function FloweySilhouette({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="Flowey decoration">
      <svg width="48" height="64" viewBox="0 0 48 64" style={{ imageRendering: 'pixelated' }}>
        {/* Stem */}
        <rect x="22" y="32" width="4" height="28" fill="#00aa00" />
        <rect x="18" y="40" width="4" height="4" fill="#00aa00" />
        <rect x="26" y="48" width="4" height="4" fill="#00aa00" />
        {/* Petals */}
        <rect x="12" y="8" width="8" height="8" fill="#ffff00" />
        <rect x="28" y="8" width="8" height="8" fill="#ffff00" />
        <rect x="8" y="16" width="8" height="8" fill="#ffff00" />
        <rect x="32" y="16" width="8" height="8" fill="#ffff00" />
        <rect x="12" y="24" width="8" height="8" fill="#ffff00" />
        <rect x="28" y="24" width="8" height="8" fill="#ffff00" />
        {/* Face center */}
        <rect x="16" y="12" width="16" height="20" fill="#ffff00" />
        {/* Eyes */}
        <rect x="18" y="16" width="4" height="4" fill="#000" />
        <rect x="26" y="16" width="4" height="4" fill="#000" />
        {/* Smile */}
        <rect x="20" y="24" width="2" height="2" fill="#000" />
        <rect x="26" y="24" width="2" height="2" fill="#000" />
        <rect x="22" y="26" width="4" height="2" fill="#000" />
      </svg>
    </div>
  )
}

// Sans silhouette - pure CSS/SVG
function SansSilhouette({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="Sans decoration">
      <svg width="32" height="48" viewBox="0 0 32 48" style={{ imageRendering: 'pixelated' }}>
        {/* Skull head */}
        <rect x="4" y="0" width="24" height="20" fill="#fff" />
        {/* Eye sockets */}
        <rect x="8" y="6" width="6" height="6" fill="#000" />
        <rect x="18" y="6" width="6" height="6" fill="#000" />
        {/* Left eye glow (blue) */}
        <rect x="9" y="7" width="4" height="4" fill="#00ccff" />
        {/* Nose */}
        <rect x="14" y="12" width="4" height="2" fill="#000" />
        {/* Mouth grin */}
        <rect x="8" y="14" width="16" height="4" fill="#000" />
        <rect x="8" y="14" width="2" height="2" fill="#fff" />
        <rect x="12" y="14" width="2" height="2" fill="#fff" />
        <rect x="16" y="14" width="2" height="2" fill="#fff" />
        <rect x="20" y="14" width="2" height="2" fill="#fff" />
        {/* Hoodie body */}
        <rect x="2" y="20" width="28" height="24" fill="#3355ff" />
        {/* Hoodie zipper */}
        <rect x="14" y="24" width="4" height="16" fill="#fff" />
      </svg>
    </div>
  )
}

// Papyrus silhouette - pure CSS/SVG
function PapyrusSilhouette({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="Papyrus decoration">
      <svg width="32" height="56" viewBox="0 0 32 56" style={{ imageRendering: 'pixelated' }}>
        {/* Skull head (taller) */}
        <rect x="6" y="0" width="20" height="18" fill="#fff" />
        {/* Eye sockets */}
        <rect x="8" y="4" width="5" height="6" fill="#000" />
        <rect x="19" y="4" width="5" height="6" fill="#000" />
        {/* Orange eye glow */}
        <rect x="20" y="5" width="3" height="4" fill="#ff6600" />
        {/* Nose */}
        <rect x="14" y="10" width="4" height="2" fill="#000" />
        {/* Mouth */}
        <rect x="10" y="12" width="12" height="4" fill="#000" />
        {/* Battle body armor */}
        <rect x="4" y="18" width="24" height="28" fill="#fff" />
        {/* Red scarf */}
        <rect x="0" y="18" width="4" height="20" fill="#ff0000" />
        <rect x="28" y="18" width="4" height="12" fill="#ff0000" />
        {/* Chest plate details */}
        <rect x="10" y="24" width="12" height="2" fill="#ff6600" />
        <rect x="10" y="28" width="12" height="2" fill="#ff6600" />
        {/* Legs */}
        <rect x="8" y="46" width="6" height="10" fill="#ff6600" />
        <rect x="18" y="46" width="6" height="10" fill="#ff6600" />
      </svg>
    </div>
  )
}

// Bone attack decoration - pure CSS
function BoneDecoration({ height = 60, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={`flex flex-col items-center opacity-20 ${className}`}
      role="img"
      aria-label="Bone decoration"
    >
      {/* Top knob */}
      <div className="flex gap-[1px]">
        <div className="w-[4px] h-[4px] bg-white rounded-full" />
        <div className="w-[4px] h-[4px] bg-white rounded-full" />
      </div>
      {/* Shaft */}
      <div style={{ width: '4px', height: `${height}px`, background: '#fff' }} />
      {/* Bottom knob */}
      <div className="flex gap-[1px]">
        <div className="w-[4px] h-[4px] bg-white rounded-full" />
        <div className="w-[4px] h-[4px] bg-white rounded-full" />
      </div>
    </div>
  )
}

// Undertale-style battle box UI frame
function BattleBox({
  children,
  title,
  color = '#fff',
  ariaLabel,
}: {
  children: React.ReactNode
  title?: string
  color?: string
  ariaLabel?: string
}) {
  return (
    <section
      className="relative mb-6"
      style={{
        border: `4px solid ${color}`,
        background: '#000',
        imageRendering: 'pixelated',
      }}
      role="region"
      aria-label={ariaLabel || title || 'Content section'}
    >
      {/* Corner brackets (Undertale signature) */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-white/40" aria-hidden="true" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-white/40" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-white/40" aria-hidden="true" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-white/40" aria-hidden="true" />

      {title && (
        <div
          className="px-4 py-2 border-b-2"
          style={{ borderColor: color }}
        >
          <h2 className="text-xs flex items-center gap-2" style={{ color }}>
            <PixelHeartSoul size={10} color={color} animate={false} />
            {title}
          </h2>
        </div>
      )}

      <div className="p-4">
        {children}
      </div>
    </section>
  )
}

// Determination text effect (red glowing text)
function DeterminationText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`text-red-500 ${className}`}
      style={{
        textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000',
      }}
    >
      {children}
    </span>
  )
}

// "But it refused" moment
function DeterminationMoment({ text }: { text: string }) {
  return (
    <div className="text-center py-4" role="img" aria-label="Determination moment">
      <p className="text-white/60 text-[10px] mb-2">* {text}</p>
      <p className="text-xs">
        <DeterminationText>But it refused.</DeterminationText>
      </p>
      <PixelHeartSoul size={24} color="#ff0000" className="mx-auto mt-2" />
    </div>
  )
}

// Battle menu option (FIGHT/ACT/ITEM/MERCY style)
function BattleMenuButton({
  label,
  isSelected,
  onClick,
  color,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 text-xs tracking-wider font-bold transition-all flex items-center gap-2"
      style={{
        background: isSelected ? color : '#000',
        border: `3px solid ${color}`,
        color: isSelected ? '#000' : color,
        boxShadow: isSelected ? `0 0 15px ${color}60` : 'none',
      }}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <PixelHeartSoul size={10} color="#ff0000" animate={false} ariaLabel="" />
      )}
      {label}
    </button>
  )
}

// Role card (equipped item style)
function RoleCard({ role }: { role: (typeof CURRENT_ROLES)[0] }) {
  return (
    <div
      className="flex items-start gap-3 p-3 border border-yellow-400/50 hover:bg-yellow-400/10 transition-colors"
      role="listitem"
    >
      <PixelHeartSoul size={12} color="#ff0000" animate={false} />
      <div>
        <p className="text-white text-xs">
          {role.title} @ <span className="text-cyan-400">{role.company}</span>
        </p>
        <p className="text-[9px] text-white/60 mt-1">{role.description}</p>
      </div>
    </div>
  )
}

// Company card (shop item style)
function CompanyCard({ company }: { company: (typeof COMPANIES)[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 border-2 border-white hover:bg-white hover:text-black transition-colors group"
      aria-label={`${company.name}: ${company.tagline}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-lg" aria-hidden="true">{company.icon}</span>
        <div>
          <h4 className="text-xs font-bold text-white group-hover:text-black">
            {company.name}
          </h4>
          <p className="text-[8px] text-yellow-400 group-hover:text-yellow-600">
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-[9px] text-white/80 group-hover:text-black/80">
        * {company.description}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {company.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-[7px] px-1 border border-cyan-400/50 text-cyan-400 group-hover:border-cyan-700/50 group-hover:text-cyan-700"
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Experience card (encounter log style)
function ExperienceCard({ entry }: { entry: (typeof EXPERIENCE_DATA)[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-3 border-2 border-white/40 hover:border-white hover:bg-white/5 transition-colors"
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <PixelHeartSoul size={10} color="#ff0000" animate={false} ariaLabel="" />
            {entry.title}
          </h4>
          <p className="text-[10px] text-yellow-400">
            @ {entry.organization}
          </p>
        </div>
        <span className="text-[8px] text-white/60 tabular-nums">
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-[9px] text-white/80 mb-2">
        {entry.description}
      </p>
      {/* Impact: achievements */}
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[9px] text-cyan-400 flex items-start gap-1">
              <SavePointStar size="sm" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Band card (monster encounter style)
function BandCard({ band }: { band: (typeof BANDS)[0] }) {
  const content = (
    <article
      className="p-3 border-2 border-purple-500 hover:bg-purple-500/20 transition-colors"
      aria-label={`${band.name}: ${band.genre}`}
    >
      <h4 className="text-xs font-bold text-white flex items-center gap-2">
        <PixelHeartSoul size={10} color="#9900ff" animate={false} ariaLabel="" />
        {band.name} appears!
      </h4>
      <p className="text-[8px] text-purple-400 mt-1">
        {band.genre} | {band.role}
      </p>
      <p className="text-[9px] text-white/80 mt-2">
        {band.description}
      </p>
      {!band.url && (
        <p className="text-[8px] text-yellow-400 mt-2 italic">
          * Website coming soon...
        </p>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return content
}

// Project card (CHECK stats style)
function ProjectCard({ project }: { project: (typeof PROJECTS_DATA)[0] }) {
  const linkHref = project.links?.demo || project.links?.site || '#'
  const isExternal = linkHref.startsWith('http')

  const content = (
    <article
      className="p-3 border-2 border-white hover:bg-red-600 hover:border-red-500 transition-colors group"
      aria-label={`${project.name}: ${project.tagline}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs text-white flex items-center gap-2 group-hover:text-white">
          <PixelHeartSoul size={10} color="#ff0000" animate={false} ariaLabel="" />
          {project.name}
        </span>
        {project.featured && <SavePointStar size="sm" />}
      </div>
      <p className="text-[8px] text-white/60 group-hover:text-white/80 mb-2">
        {project.tagline}
      </p>
      {/* Impact statement */}
      {project.impact && (
        <p className="text-[8px] text-cyan-400 group-hover:text-cyan-200 flex items-start gap-1 mb-2">
          <span className="text-yellow-400">*</span>
          {project.impact}
        </p>
      )}
      {/* Tech stack */}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[6px] px-1 border border-white/30 text-white/60 group-hover:border-white/50 group-hover:text-white/80"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )

  if (isExternal) {
    return (
      <a href={linkHref} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return (
    <Link href={linkHref} className="block">
      {content}
    </Link>
  )
}

// Tech inventory (Undertale item list style) - NO PROFICIENCY BARS
function TechInventory({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-4" role="list" aria-label="Tech stack inventory">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <p className="text-cyan-400 text-xs mb-2 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-1">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-[9px] px-2 py-1 border border-white/40 text-white hover:bg-white hover:text-black transition-colors cursor-default flex items-center gap-1"
              >
                <PixelHeartSoul size={6} color="#ff0000" animate={false} ariaLabel="" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skills display for drummer/fighter (achievements, NO BARS)
function SkillsDisplay({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-4" role="list" aria-label="Skills and abilities">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <p className="text-cyan-400 text-xs mb-2 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <ul className="space-y-1">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="text-[9px] text-white flex items-center gap-2"
              >
                <PixelHeartSoul size={6} color="#ff0000" animate={false} ariaLabel="" />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function RetroRPGTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = useMemo(() => getEngineerSkills(), [])
  const otherSkills = useMemo(() => getSkillsByProfession(active), [active])
  const projects = useMemo(
    () => PROJECTS_DATA.filter((p) => p.professions.includes(active) || p.featured),
    [active]
  )
  const experience = useMemo(
    () => filterExperienceByProfession(EXPERIENCE_DATA, active),
    [active]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const professionOptions = [
    { id: 'engineer' as const, label: 'ENGINEER', color: SOUL_COLORS.cyan },
    { id: 'drummer' as const, label: 'MUSICIAN', color: SOUL_COLORS.purple },
    { id: 'fighter' as const, label: 'FIGHTER', color: SOUL_COLORS.orange },
  ]

  return (
    <div
      className="min-h-screen relative bg-black text-white"
      style={{ fontFamily: '"Press Start 2P", "Courier New", monospace' }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-yellow-400 focus:text-black focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* CRT scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Decorative silhouettes (corners) */}
      <div className="fixed top-20 left-4 opacity-20 hidden lg:block" aria-hidden="true">
        <SansSilhouette />
      </div>
      <div className="fixed top-20 right-4 opacity-20 hidden lg:block" aria-hidden="true">
        <PapyrusSilhouette />
      </div>
      <div className="fixed bottom-20 left-8 opacity-15 hidden lg:block" aria-hidden="true">
        <FloweySilhouette />
      </div>

      {/* Bone decorations at bottom */}
      <div className="fixed bottom-0 left-1/4 hidden md:flex gap-8" aria-hidden="true">
        <BoneDecoration height={40} />
        <BoneDecoration height={60} />
        <BoneDecoration height={30} />
      </div>
      <div className="fixed bottom-0 right-1/4 hidden md:flex gap-8" aria-hidden="true">
        <BoneDecoration height={50} />
        <BoneDecoration height={35} />
        <BoneDecoration height={55} />
      </div>

      {/* Header */}
      <header className="relative z-30 p-4 border-b-4 border-white" role="banner">
        <div className="max-w-5xl mx-auto flex justify-between items-start">
          {/* Left: Name and info */}
          <div className="flex items-center gap-3">
            <PixelHeartSoul size={24} color="#ff0000" />
            <div>
              <h1 className="text-lg tracking-wider">
                ALEXANDER PULIDO
              </h1>
              <p className="text-yellow-400 text-[10px] tracking-wide">
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-cyan-400 text-[8px] mt-1 italic">
                * {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          {/* Right: Nav */}
          <nav className="flex gap-2 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-3 py-2 text-[9px] border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors flex items-center gap-2"
              aria-label="View CV - Save point"
            >
              <SavePointStar size="sm" />
              SAVE
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-3 py-2 text-[9px] border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
              aria-label="Play game engine demo"
            >
              GAME
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Profession selector (ACT menu) */}
      <div className="relative z-20 px-4 py-4 border-b-2 border-white/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-yellow-400 text-xs mb-3 text-center">* Choose your path</p>
          <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Profession selection">
            {professionOptions.map((opt) => (
              <BattleMenuButton
                key={opt.id}
                label={opt.label}
                isSelected={active === opt.id}
                onClick={() => setActive(opt.id)}
                color={opt.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content - ALL VISIBLE, no hidden animations */}
      <main id="main-content" className="relative z-20 px-4 py-6" role="main">
        <div className="max-w-5xl mx-auto">

          {/* Current Roles Section */}
          <BattleBox title="EQUIPPED ROLES" color="#ffff00" ariaLabel="Current professional roles">
            <div className="space-y-2" role="list">
              {CURRENT_ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </BattleBox>

          {/* About Section */}
          <BattleBox title="ABOUT" color="#9900ff" ariaLabel="About Alexander">
            <div className="mb-4 p-3 border-2 border-white/30">
              <p className="text-[10px] text-white leading-relaxed">
                {aboutData.bio}
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[9px] px-2 py-1 border border-purple-500/50 text-purple-400 flex items-center gap-1"
                  role="listitem"
                >
                  <PixelHeartSoul size={6} color="#9900ff" animate={false} ariaLabel="" />
                  {fact}
                </span>
              ))}
            </div>
          </BattleBox>

          {/* Tech/Skills Section */}
          <BattleBox
            title={active === 'engineer' ? 'TECH STACK' : 'ABILITIES'}
            color="#00ff00"
            ariaLabel={active === 'engineer' ? 'Technical skills' : 'Abilities'}
          >
            {active === 'engineer' ? (
              <TechInventory categories={engineerTech} />
            ) : (
              <SkillsDisplay categories={otherSkills} />
            )}
          </BattleBox>

          {/* Projects Section */}
          <BattleBox title="PROJECTS" color="#ff0000" ariaLabel="Featured projects">
            <div className="grid md:grid-cols-2 gap-3">
              {projects.filter((p) => p.featured).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {/* More projects */}
            {projects.filter((p) => !p.featured).length > 0 && (
              <details className="mt-4">
                <summary className="text-[9px] text-yellow-400 cursor-pointer hover:text-yellow-300">
                  * View more projects...
                </summary>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {projects.filter((p) => !p.featured).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </details>
            )}
          </BattleBox>

          {/* Companies Section (engineer only) */}
          {active === 'engineer' && (
            <BattleBox title="COMPANIES" color="#00ffff" ariaLabel="Companies">
              <div className="grid md:grid-cols-3 gap-3">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </BattleBox>
          )}

          {/* Bands Section (drummer only) */}
          {active === 'drummer' && (
            <BattleBox title="BANDS" color="#9900ff" ariaLabel="Musical projects">
              <div className="grid md:grid-cols-3 gap-3">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </BattleBox>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <BattleBox title="EXPERIENCE" color="#ffa500" ariaLabel="Work experience">
              <div className="space-y-3">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </BattleBox>
          )}

          {/* Determination moment */}
          <div className="border-4 border-red-500 bg-black p-4 text-center">
            <DeterminationMoment text="Despite everything, the deadlines kept coming..." />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-4 border-t-4 border-white text-center" role="contentinfo">
        <p className="text-[8px] tracking-widest text-white/80">
          * The power of <DeterminationText>determination</DeterminationText> shines within you.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <PixelHeartSoul size={16} color="#ff0000" />
          <span className="text-yellow-400 text-[10px]">SAVE PROGRESS</span>
          <PixelHeartSoul size={16} color="#ff0000" />
        </div>
      </footer>

      {/* CSS Animations - respects reduced motion */}
      <style jsx global>{`
        @keyframes soul-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes save-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        .animate-soul-pulse { animation: soul-pulse 2s ease-in-out infinite; }
        .animate-save-twinkle { animation: save-twinkle 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-soul-pulse,
          .animate-save-twinkle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
