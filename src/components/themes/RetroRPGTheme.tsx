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

// =============================================================================
// UNDERTALE EXACT COLOR PALETTE
// =============================================================================
const UNDERTALE_COLORS = {
  // Core
  void: '#000000',
  white: '#FFFFFF',

  // Soul Traits
  determination: '#FF0000',
  determinationDark: '#CC0000',
  patience: '#00FFFF',
  bravery: '#FFA500',
  integrity: '#0000FF',
  perseverance: '#FF00FF',
  kindness: '#00FF00',
  justice: '#FFFF00',

  // Characters
  sansBlueEye: '#00FFFF',
  sansBlueGlow: '#0066FF',
  floweyYellow: '#FFFF00',
  papyrusOrange: '#FF6600',
}

// =============================================================================
// ACCESSIBILITY HOOKS
// =============================================================================
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

// =============================================================================
// PIXEL ART SVG COMPONENTS
// =============================================================================

// 8x8 Pixel Heart Soul (Undertale signature)
function PixelHeart({
  size = 16,
  color = UNDERTALE_COLORS.determination,
  animate = true,
  className = '',
}: {
  size?: number
  color?: string
  animate?: boolean
  className?: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !reducedMotion

  // 8x8 pixel heart - exact Undertale proportions
  const pixels = [
    '  ##  ##  ',
    ' ######## ',
    '##########',
    '##########',
    '##########',
    ' ######## ',
    '  ######  ',
    '   ####   ',
    '    ##    ',
  ]

  return (
    <span
      className={`inline-block ${className}`}
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Soul heart"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 10 9"
        style={{ imageRendering: 'pixelated' as const }}
        className={shouldAnimate ? 'animate-soul-beat' : ''}
      >
        {pixels.map((row, y) =>
          row.split('').map((char, x) =>
            char === '#' ? (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
            ) : null
          )
        )}
      </svg>
    </span>
  )
}

// 4-pointed Save Star
function SaveStar({
  size = 16,
  animate = true,
}: {
  size?: number
  animate?: boolean
}) {
  const reducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !reducedMotion

  return (
    <span
      className={`inline-block ${shouldAnimate ? 'animate-save-sparkle' : ''}`}
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Save point"
    >
      <svg width={size} height={size} viewBox="0 0 8 8">
        {/* Center cross */}
        <rect x="3" y="0" width="2" height="8" fill={UNDERTALE_COLORS.justice} />
        <rect x="0" y="3" width="8" height="2" fill={UNDERTALE_COLORS.justice} />
        {/* Corner sparkles */}
        <rect x="2" y="2" width="1" height="1" fill={UNDERTALE_COLORS.bravery} />
        <rect x="5" y="2" width="1" height="1" fill={UNDERTALE_COLORS.bravery} />
        <rect x="2" y="5" width="1" height="1" fill={UNDERTALE_COLORS.bravery} />
        <rect x="5" y="5" width="1" height="1" fill={UNDERTALE_COLORS.bravery} />
      </svg>
    </span>
  )
}

// Pixel Bone Attack
function PixelBone({
  height = 48,
  className = '',
}: {
  height?: number
  className?: string
}) {
  const boneWidth = Math.max(8, height / 6)
  const knobSize = boneWidth * 1.5

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Bone decoration"
    >
      <svg width={knobSize * 2} height={height} viewBox={`0 0 ${knobSize * 2} ${height}`}>
        {/* Top knobs */}
        <rect x={knobSize / 2 - 2} y={0} width={4} height={4} fill={UNDERTALE_COLORS.white} />
        <rect x={knobSize + knobSize / 2 - 2} y={0} width={4} height={4} fill={UNDERTALE_COLORS.white} />
        <rect x={knobSize / 2} y={4} width={knobSize} height={4} fill={UNDERTALE_COLORS.white} />
        {/* Shaft */}
        <rect x={knobSize - 2} y={8} width={4} height={height - 16} fill={UNDERTALE_COLORS.white} />
        {/* Bottom knobs */}
        <rect x={knobSize / 2} y={height - 8} width={knobSize} height={4} fill={UNDERTALE_COLORS.white} />
        <rect x={knobSize / 2 - 2} y={height - 4} width={4} height={4} fill={UNDERTALE_COLORS.white} />
        <rect x={knobSize + knobSize / 2 - 2} y={height - 4} width={4} height={4} fill={UNDERTALE_COLORS.white} />
      </svg>
    </div>
  )
}

// Flowey Pixel Art
function FloweyPixelArt({
  size = 64,
  expression = 'neutral',
}: {
  size?: number
  expression?: 'neutral' | 'evil' | 'friendly'
}) {
  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Flowey the flower"
    >
      <svg width={size} height={size * 1.2} viewBox="0 0 32 40">
        {/* Stem */}
        <rect x="14" y="20" width="4" height="18" fill="#00AA00" />
        <rect x="10" y="28" width="4" height="4" fill="#00AA00" />
        <rect x="18" y="32" width="4" height="4" fill="#00AA00" />
        {/* Petals */}
        <rect x="6" y="4" width="6" height="6" fill={UNDERTALE_COLORS.floweyYellow} />
        <rect x="20" y="4" width="6" height="6" fill={UNDERTALE_COLORS.floweyYellow} />
        <rect x="2" y="10" width="6" height="6" fill={UNDERTALE_COLORS.floweyYellow} />
        <rect x="24" y="10" width="6" height="6" fill={UNDERTALE_COLORS.floweyYellow} />
        <rect x="6" y="16" width="6" height="6" fill={UNDERTALE_COLORS.floweyYellow} />
        <rect x="20" y="16" width="6" height="6" fill={UNDERTALE_COLORS.floweyYellow} />
        {/* Face center */}
        <rect x="10" y="8" width="12" height="14" fill={UNDERTALE_COLORS.floweyYellow} />
        {/* Eyes */}
        {expression === 'evil' ? (
          <>
            <rect x="12" y="10" width="2" height="4" fill={UNDERTALE_COLORS.void} />
            <rect x="18" y="10" width="2" height="4" fill={UNDERTALE_COLORS.void} />
            <rect x="11" y="11" width="1" height="2" fill={UNDERTALE_COLORS.determination} />
            <rect x="20" y="11" width="1" height="2" fill={UNDERTALE_COLORS.determination} />
          </>
        ) : (
          <>
            <rect x="12" y="11" width="2" height="2" fill={UNDERTALE_COLORS.void} />
            <rect x="18" y="11" width="2" height="2" fill={UNDERTALE_COLORS.void} />
          </>
        )}
        {/* Mouth */}
        {expression === 'evil' ? (
          <>
            <rect x="13" y="16" width="6" height="2" fill={UNDERTALE_COLORS.void} />
            <rect x="12" y="15" width="2" height="1" fill={UNDERTALE_COLORS.void} />
            <rect x="18" y="15" width="2" height="1" fill={UNDERTALE_COLORS.void} />
          </>
        ) : (
          <>
            <rect x="14" y="16" width="1" height="2" fill={UNDERTALE_COLORS.void} />
            <rect x="17" y="16" width="1" height="2" fill={UNDERTALE_COLORS.void} />
            <rect x="15" y="17" width="2" height="1" fill={UNDERTALE_COLORS.void} />
          </>
        )}
      </svg>
    </div>
  )
}

// Sans Pixel Silhouette
function SansPixelArt({ size = 48 }: { size?: number }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Sans"
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 24 36">
        {/* Skull */}
        <rect x="4" y="0" width="16" height="14" fill={UNDERTALE_COLORS.white} />
        {/* Eye sockets */}
        <rect x="6" y="4" width="4" height="4" fill={UNDERTALE_COLORS.void} />
        <rect x="14" y="4" width="4" height="4" fill={UNDERTALE_COLORS.void} />
        {/* Left eye glow */}
        <rect
          x="7"
          y="5"
          width="2"
          height="2"
          fill={UNDERTALE_COLORS.sansBlueEye}
          className={!reducedMotion ? 'animate-sans-eye' : ''}
        />
        {/* Nose */}
        <rect x="10" y="8" width="4" height="2" fill={UNDERTALE_COLORS.void} />
        {/* Grin */}
        <rect x="6" y="10" width="12" height="3" fill={UNDERTALE_COLORS.void} />
        <rect x="7" y="10" width="2" height="2" fill={UNDERTALE_COLORS.white} />
        <rect x="11" y="10" width="2" height="2" fill={UNDERTALE_COLORS.white} />
        <rect x="15" y="10" width="2" height="2" fill={UNDERTALE_COLORS.white} />
        {/* Hoodie */}
        <rect x="2" y="14" width="20" height="18" fill="#3355FF" />
        {/* Hood shadow */}
        <rect x="4" y="14" width="16" height="2" fill="#2244CC" />
        {/* Zipper */}
        <rect x="10" y="18" width="4" height="12" fill={UNDERTALE_COLORS.white} />
        {/* Hands in pockets */}
        <rect x="4" y="26" width="4" height="4" fill={UNDERTALE_COLORS.white} />
        <rect x="16" y="26" width="4" height="4" fill={UNDERTALE_COLORS.white} />
      </svg>
    </div>
  )
}

// Papyrus Pixel Silhouette
function PapyrusPixelArt({ size = 48 }: { size?: number }) {
  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Papyrus"
    >
      <svg width={size} height={size * 1.8} viewBox="0 0 24 44">
        {/* Skull (taller) */}
        <rect x="6" y="0" width="12" height="12" fill={UNDERTALE_COLORS.white} />
        {/* Eye sockets (tall) */}
        <rect x="7" y="2" width="3" height="4" fill={UNDERTALE_COLORS.void} />
        <rect x="14" y="2" width="3" height="4" fill={UNDERTALE_COLORS.void} />
        {/* Orange glow in eye */}
        <rect x="14" y="3" width="2" height="2" fill={UNDERTALE_COLORS.papyrusOrange} />
        {/* Nose */}
        <rect x="10" y="6" width="4" height="2" fill={UNDERTALE_COLORS.void} />
        {/* Mouth */}
        <rect x="8" y="8" width="8" height="3" fill={UNDERTALE_COLORS.void} />
        {/* Battle body */}
        <rect x="4" y="12" width="16" height="20" fill={UNDERTALE_COLORS.white} />
        {/* Orange chest details */}
        <rect x="8" y="16" width="8" height="2" fill={UNDERTALE_COLORS.papyrusOrange} />
        <rect x="8" y="20" width="8" height="2" fill={UNDERTALE_COLORS.papyrusOrange} />
        {/* Red scarf */}
        <rect x="0" y="12" width="4" height="16" fill={UNDERTALE_COLORS.determination} />
        <rect x="20" y="12" width="4" height="10" fill={UNDERTALE_COLORS.determination} />
        {/* Boots */}
        <rect x="6" y="32" width="4" height="12" fill={UNDERTALE_COLORS.papyrusOrange} />
        <rect x="14" y="32" width="4" height="12" fill={UNDERTALE_COLORS.papyrusOrange} />
      </svg>
    </div>
  )
}

// Soul Collection Display
function SoulCollection() {
  const souls = [
    { color: UNDERTALE_COLORS.patience, trait: 'Patience', delay: '0s' },
    { color: UNDERTALE_COLORS.bravery, trait: 'Bravery', delay: '0.2s' },
    { color: UNDERTALE_COLORS.integrity, trait: 'Integrity', delay: '0.4s' },
    { color: UNDERTALE_COLORS.perseverance, trait: 'Perseverance', delay: '0.6s' },
    { color: UNDERTALE_COLORS.kindness, trait: 'Kindness', delay: '0.8s' },
    { color: UNDERTALE_COLORS.justice, trait: 'Justice', delay: '1s' },
  ]

  return (
    <div className="py-8 border-t-4 border-b-4 border-white/20 my-8">
      <p className="text-center text-xs text-white/60 mb-6 tracking-widest">
        * The human SOULS...
      </p>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {souls.map((soul) => (
          <div key={soul.trait} className="text-center">
            <PixelHeart size={32} color={soul.color} />
            <p
              className="text-[8px] mt-2 tracking-wider"
              style={{ color: soul.color }}
            >
              {soul.trait.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <PixelHeart size={40} color={UNDERTALE_COLORS.determination} />
        <p className="text-xs mt-2 text-red-500 tracking-widest animate-determination-glow">
          DETERMINATION
        </p>
      </div>
    </div>
  )
}

// Bone Attack Pattern Decoration
function BoneAttackSection() {
  return (
    <div className="py-6 border-t-2 border-b-2 border-white/10 my-6 overflow-hidden">
      <div className="flex justify-center items-end gap-3 opacity-30">
        <PixelBone height={24} />
        <PixelBone height={40} />
        <PixelBone height={56} />
        <PixelBone height={72} />
        <PixelBone height={56} />
        <PixelBone height={40} />
        <PixelBone height={24} />
      </div>
      <p className="text-center text-[8px] text-white/40 mt-4 tracking-widest">
        * Papyrus is preparing a bone attack...
      </p>
    </div>
  )
}

// Character Gallery Section
function CharacterGallery() {
  return (
    <div className="py-8 border-t-4 border-b-4 border-white/20 my-8">
      <p className="text-center text-xs text-white/60 mb-8 tracking-widest">
        * You encountered some familiar faces...
      </p>
      <div className="flex justify-center items-end gap-12 flex-wrap">
        <div className="text-center">
          <FloweyPixelArt size={48} expression="neutral" />
          <p className="text-[8px] mt-3 text-yellow-400 tracking-wider">FLOWEY</p>
          <p className="text-[6px] text-white/40 mt-1">In this world...</p>
        </div>
        <div className="text-center">
          <SansPixelArt size={40} />
          <p className="text-[8px] mt-3 text-cyan-400 tracking-wider">SANS</p>
          <p className="text-[6px] text-white/40 mt-1">*wink*</p>
        </div>
        <div className="text-center">
          <PapyrusPixelArt size={40} />
          <p className="text-[8px] mt-3 text-orange-400 tracking-wider">PAPYRUS</p>
          <p className="text-[6px] text-white/40 mt-1">NYEH HEH HEH!</p>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

// Battle Box Frame (Undertale signature UI)
function BattleBox({
  children,
  title,
  borderColor = UNDERTALE_COLORS.white,
  accentColor = UNDERTALE_COLORS.determination,
}: {
  children: React.ReactNode
  title?: string
  borderColor?: string
  accentColor?: string
}) {
  return (
    <section
      className="relative mb-8"
      style={{
        border: `4px solid ${borderColor}`,
        background: UNDERTALE_COLORS.void,
        imageRendering: 'pixelated' as const,
      }}
      role="region"
      aria-label={title || 'Content section'}
    >
      {/* Red corner accents (determination) */}
      <div
        className="absolute top-0 left-0 w-3 h-3"
        style={{ background: accentColor }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-3 h-3"
        style={{ background: accentColor }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3"
        style={{ background: accentColor }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3"
        style={{ background: accentColor }}
        aria-hidden="true"
      />

      {title && (
        <div
          className="px-4 py-3 border-b-4 flex items-center gap-3"
          style={{ borderColor }}
        >
          <PixelHeart size={12} color={accentColor} animate={false} />
          <h2 className="text-xs tracking-widest" style={{ color: borderColor }}>
            {title}
          </h2>
        </div>
      )}

      <div className="p-4">{children}</div>
    </section>
  )
}

// Determination Text (red glow)
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
        textShadow: `0 0 8px ${UNDERTALE_COLORS.determination}, 0 0 16px ${UNDERTALE_COLORS.determinationDark}`,
      }}
    >
      {children}
    </span>
  )
}

// "But it refused" Moment
function DeterminationMoment({ text }: { text: string }) {
  return (
    <div className="text-center py-6" role="img" aria-label="Determination moment">
      <p className="text-white/60 text-xs mb-3">* {text}</p>
      <p className="text-sm tracking-widest">
        <DeterminationText>But it refused.</DeterminationText>
      </p>
      <PixelHeart size={32} color={UNDERTALE_COLORS.determination} className="mx-auto mt-4" />
    </div>
  )
}

// Battle Menu Button (FIGHT/ACT/ITEM/MERCY style)
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
      className="relative px-6 py-3 text-xs tracking-widest font-bold transition-all flex items-center gap-2"
      style={{
        background: isSelected ? color : UNDERTALE_COLORS.void,
        border: `4px solid ${color}`,
        color: isSelected ? UNDERTALE_COLORS.void : color,
        boxShadow: isSelected ? `0 0 20px ${color}80` : 'none',
        imageRendering: 'pixelated' as const,
      }}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <PixelHeart size={12} color={UNDERTALE_COLORS.determination} animate={false} />
      )}
      {label}
    </button>
  )
}

// =============================================================================
// CONTENT CARDS
// =============================================================================

// Role Card
function RoleCard({ role }: { role: (typeof CURRENT_ROLES)[0] }) {
  return (
    <div
      className="flex items-start gap-3 p-4 border-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/5 transition-all"
      role="listitem"
    >
      <PixelHeart size={14} color={UNDERTALE_COLORS.determination} animate={false} />
      <div>
        <p className="text-white text-xs tracking-wide">
          {role.title} @ <span className="text-cyan-400">{role.company}</span>
        </p>
        <p className="text-[9px] text-white/60 mt-1 leading-relaxed">{role.description}</p>
      </div>
    </div>
  )
}

// Experience Card
function ExperienceCard({ entry }: { entry: (typeof EXPERIENCE_DATA)[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4 border-2 border-white/30 hover:border-orange-400 hover:bg-orange-400/5 transition-all"
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xs tracking-wide text-white flex items-center gap-2">
            <PixelHeart size={10} color={UNDERTALE_COLORS.bravery} animate={false} />
            {entry.title}
          </h4>
          <p className="text-sm text-yellow-400 mt-1">@ {entry.organization}</p>
        </div>
        <span className="text-sm text-white/50 tabular-nums tracking-wider">
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-[9px] text-white/70 mb-3 leading-relaxed">{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[9px] text-cyan-400 flex items-start gap-2">
              <SaveStar size={10} animate={false} />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project Card
function ProjectCard({ project }: { project: (typeof PROJECTS_DATA)[0] }) {
  const linkHref = project.links?.demo || project.links?.site || '#'
  const isExternal = linkHref.startsWith('http')

  const content = (
    <article
      className="p-4 border-2 border-white hover:bg-red-600 hover:border-red-500 transition-all group"
      aria-label={`${project.name}: ${project.tagline}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-white flex items-center gap-2 tracking-wide group-hover:text-white">
          <PixelHeart size={10} color={UNDERTALE_COLORS.determination} animate={false} />
          {project.name}
        </span>
        {project.featured && <SaveStar size={14} />}
      </div>
      <p className="text-sm text-white/60 group-hover:text-white/80 mb-2">{project.tagline}</p>
      {project.impact && (
        <p className="text-sm text-cyan-400 group-hover:text-cyan-200 flex items-start gap-2 mb-3">
          <span className="text-yellow-400">*</span>
          {project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[7px] px-2 py-1 border border-white/30 text-white/60 group-hover:border-white/50 group-hover:text-white/80"
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

// Company Card (Ventures)
function CompanyCard({ company }: { company: (typeof COMPANIES)[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group"
      aria-label={`${company.name}: ${company.tagline}`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4 className="text-xs tracking-wide text-white group-hover:text-black">
            {company.name}
          </h4>
          <p className="text-sm text-yellow-400 group-hover:text-yellow-600 mt-1">
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-[9px] text-white/70 group-hover:text-black/70 mb-3">
        * {company.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {company.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-[7px] px-2 py-1 border border-cyan-400/50 text-cyan-400 group-hover:border-black/50 group-hover:text-black"
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Band Card
function BandCard({ band }: { band: (typeof BANDS)[0] }) {
  const content = (
    <article
      className="p-4 border-2 border-purple-500 hover:bg-purple-500/20 transition-all"
      aria-label={`${band.name}: ${band.genre}`}
    >
      <h4 className="text-xs tracking-wide text-white flex items-center gap-2">
        <PixelHeart size={10} color={UNDERTALE_COLORS.perseverance} animate={false} />
        {band.name} appears!
      </h4>
      <p className="text-sm text-purple-400 mt-2">
        {band.genre} | {band.role}
      </p>
      <p className="text-[9px] text-white/70 mt-2">{band.description}</p>
      {!band.url && (
        <p className="text-sm text-yellow-400 mt-3 italic">* Website coming soon...</p>
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

// Tech Inventory (Engineer Skills)
function TechInventory({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6" role="list" aria-label="Tech stack">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <p className="text-cyan-400 text-xs mb-3 flex items-center gap-2 tracking-widest">
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-[9px] px-3 py-2 border border-white/40 text-white hover:bg-white hover:text-black transition-all cursor-default flex items-center gap-2"
              >
                <PixelHeart size={6} color={UNDERTALE_COLORS.determination} animate={false} />
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skills Display (Drummer/Fighter)
function SkillsDisplay({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6" role="list" aria-label="Skills">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <p className="text-cyan-400 text-xs mb-3 flex items-center gap-2 tracking-widest">
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="text-[9px] text-white flex items-center gap-2"
              >
                <PixelHeart size={6} color={UNDERTALE_COLORS.determination} animate={false} />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
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
    { id: 'engineer' as const, label: 'ENGINEER', color: UNDERTALE_COLORS.patience },
    { id: 'drummer' as const, label: 'MUSICIAN', color: UNDERTALE_COLORS.perseverance },
    { id: 'fighter' as const, label: 'FIGHTER', color: UNDERTALE_COLORS.bravery },
  ]

  return (
    <div
      className="min-h-screen relative text-white"
      style={{
        background: UNDERTALE_COLORS.void,
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        imageRendering: 'pixelated' as const,
      }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-yellow-400 focus:text-black focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* CRT Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.08]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Decorative Characters (fixed position) */}
      <div className="fixed top-24 left-4 opacity-15 hidden xl:block" aria-hidden="true">
        <SansPixelArt size={32} />
      </div>
      <div className="fixed top-24 right-4 opacity-15 hidden xl:block" aria-hidden="true">
        <PapyrusPixelArt size={32} />
      </div>
      <div className="fixed bottom-24 left-8 opacity-10 hidden xl:block" aria-hidden="true">
        <FloweyPixelArt size={40} expression="neutral" />
      </div>

      {/* Bone decorations at edges */}
      <div className="fixed bottom-0 left-1/4 hidden lg:flex gap-4 opacity-15" aria-hidden="true">
        <PixelBone height={32} />
        <PixelBone height={48} />
        <PixelBone height={24} />
      </div>
      <div className="fixed bottom-0 right-1/4 hidden lg:flex gap-4 opacity-15" aria-hidden="true">
        <PixelBone height={40} />
        <PixelBone height={28} />
        <PixelBone height={44} />
      </div>

      {/* ========== HEADER ========== */}
      <header className="relative z-30 p-6 border-b-4 border-white" role="banner">
        <div className="max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <PixelHeart size={32} color={UNDERTALE_COLORS.determination} />
            <div>
              <h1 className="text-lg tracking-widest">ALEXANDER PULIDO</h1>
              <p className="text-yellow-400 text-sm tracking-wide mt-1">
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-cyan-400 text-xs mt-2 italic">
                * {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center flex-wrap" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-4 py-2 text-[9px] border-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-2 tracking-widest"
              aria-label="View CV - Save point"
            >
              <SaveStar size={12} />
              SAVE
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-[9px] border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all tracking-widest"
              aria-label="Play game engine demo"
            >
              GAME
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Profession Selector (ACT Menu) */}
      <div className="relative z-20 px-6 py-6 border-b-2 border-white/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-yellow-400 text-xs mb-4 text-center tracking-widest">
            * Choose your path
          </p>
          <div
            className="flex flex-wrap justify-center gap-4"
            role="radiogroup"
            aria-label="Profession selection"
          >
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

      {/* ========== MAIN CONTENT ========== */}
      <main id="main-content" className="relative z-20 px-6 py-8" role="main">
        <div className="max-w-5xl mx-auto">

          {/* ABOUT Section */}
          <BattleBox
            title="ABOUT"
            borderColor={UNDERTALE_COLORS.perseverance}
            accentColor={UNDERTALE_COLORS.determination}
          >
            <div className="mb-4 p-4 border-2 border-white/20">
              <p className="text-sm text-white leading-relaxed tracking-wide">
                {aboutData.bio}
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[9px] px-3 py-2 border border-purple-500/50 text-purple-400 flex items-center gap-2"
                  role="listitem"
                >
                  <PixelHeart size={6} color={UNDERTALE_COLORS.perseverance} animate={false} />
                  {fact}
                </span>
              ))}
            </div>
          </BattleBox>

          {/* ART Section: Soul Collection */}
          <SoulCollection />

          {/* EXPERIENCE Section */}
          {experience.length > 0 && (
            <BattleBox
              title="EXPERIENCE"
              borderColor={UNDERTALE_COLORS.bravery}
              accentColor={UNDERTALE_COLORS.determination}
            >
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </BattleBox>
          )}

          {/* ART Section: Bone Attack */}
          <BoneAttackSection />

          {/* SKILLS Section */}
          <BattleBox
            title={active === 'engineer' ? 'TECH STACK' : 'ABILITIES'}
            borderColor={UNDERTALE_COLORS.kindness}
            accentColor={UNDERTALE_COLORS.determination}
          >
            {active === 'engineer' ? (
              <TechInventory categories={engineerTech} />
            ) : (
              <SkillsDisplay categories={otherSkills} />
            )}
          </BattleBox>

          {/* PROJECTS Section */}
          <BattleBox
            title="PROJECTS"
            borderColor={UNDERTALE_COLORS.determination}
            accentColor={UNDERTALE_COLORS.determination}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter((p) => p.featured).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {projects.filter((p) => !p.featured).length > 0 && (
              <details className="mt-6">
                <summary className="text-[9px] text-yellow-400 cursor-pointer hover:text-yellow-300 tracking-widest">
                  * View more projects...
                </summary>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {projects.filter((p) => !p.featured).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </details>
            )}
          </BattleBox>

          {/* ART Section: Characters */}
          <CharacterGallery />

          {/* VENTURES Section (engineer only) */}
          {active === 'engineer' && (
            <BattleBox
              title="VENTURES"
              borderColor={UNDERTALE_COLORS.patience}
              accentColor={UNDERTALE_COLORS.determination}
            >
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </BattleBox>
          )}

          {/* BANDS Section (drummer only) */}
          {active === 'drummer' && (
            <BattleBox
              title="BANDS"
              borderColor={UNDERTALE_COLORS.perseverance}
              accentColor={UNDERTALE_COLORS.determination}
            >
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </BattleBox>
          )}

          {/* CURRENT ROLES Section */}
          <BattleBox
            title="EQUIPPED ROLES"
            borderColor={UNDERTALE_COLORS.justice}
            accentColor={UNDERTALE_COLORS.determination}
          >
            <div className="space-y-3" role="list">
              {CURRENT_ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </BattleBox>

          {/* Determination Moment */}
          <div className="border-4 border-red-500 bg-black p-6">
            <DeterminationMoment text="Despite everything, the deadlines kept coming..." />
          </div>

        </div>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-10 px-6 border-t-4 border-white text-center" role="contentinfo">
        <p className="text-xs tracking-widest text-white/80">
          * The power of <DeterminationText>determination</DeterminationText> shines within you.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <PixelHeart size={20} color={UNDERTALE_COLORS.determination} />
          <span className="text-yellow-400 text-xs tracking-widest">SAVE PROGRESS</span>
          <PixelHeart size={20} color={UNDERTALE_COLORS.determination} />
        </div>
      </footer>

      {/* ========== CSS ANIMATIONS ========== */}
      <style jsx global>{`
        @keyframes soul-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes save-sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.8; transform: scale(1.1) rotate(5deg); }
          50% { opacity: 0.6; transform: scale(1.2) rotate(0deg); }
          75% { opacity: 0.8; transform: scale(1.1) rotate(-5deg); }
        }
        @keyframes sans-eye {
          0%, 90%, 100% { opacity: 1; }
          92%, 98% { opacity: 0.3; }
        }
        @keyframes determination-glow {
          0%, 100% {
            text-shadow: 0 0 8px ${UNDERTALE_COLORS.determination}, 0 0 16px ${UNDERTALE_COLORS.determinationDark};
          }
          50% {
            text-shadow: 0 0 16px ${UNDERTALE_COLORS.determination}, 0 0 32px ${UNDERTALE_COLORS.determinationDark}, 0 0 48px ${UNDERTALE_COLORS.determination};
          }
        }

        .animate-soul-beat { animation: soul-beat 1.5s ease-in-out infinite; }
        .animate-save-sparkle { animation: save-sparkle 3s ease-in-out infinite; }
        .animate-sans-eye { animation: sans-eye 4s ease-in-out infinite; }
        .animate-determination-glow { animation: determination-glow 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-soul-beat,
          .animate-save-sparkle,
          .animate-sans-eye,
          .animate-determination-glow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
