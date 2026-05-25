'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { TECH_STACK } from '@/data/techStack'

// =============================================================================
// OKAMI COLOR PALETTE - Traditional Japanese ink painting (Sumi-e)
// =============================================================================
const COLORS = {
  // Paper & Background
  cream: '#f5f0e1',           // Washi rice paper
  darkCream: '#e8dcc8',       // Aged parchment
  parchment: '#f0e6d2',       // Fresh rice paper

  // Ink (Sumi)
  ink: '#1a1a1a',             // Pure sumi black
  inkWash: '#3a3a3a',         // Diluted ink wash
  inkLight: '#5a5a5a',        // Very diluted
  inkFaint: '#8a8a8a',        // Faintest wash

  // Vermillion (Shu)
  red: '#c41e3a',             // Vermillion red - Amaterasu markings
  darkRed: '#8b0000',         // Deep vermillion
  redFaint: '#c41e3a20',      // Red wash

  // Accents
  gold: '#c9a227',            // Gold leaf accents
  goldFaint: '#c9a22730',     // Gold wash
  sakura: '#ffb7c5',          // Cherry blossom pink
  sakuraDark: '#d4768b',      // Deep sakura
  wave: '#264653',            // Ocean wave blue-green
  celestial: '#7eb8da',       // Divine brush trail glow
}

// =============================================================================
// ACCESSIBILITY: Reduced motion detection
// =============================================================================
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// SVG FILTER DEFINITIONS (Shared across components)
// =============================================================================
function SvgFilters() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Washi paper grain texture */}
        <filter id="washiGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="5" result="noise" />
          <feDiffuseLighting in="noise" lightingColor={COLORS.cream} surfaceScale="1.2">
            <feDistantLight azimuth="45" elevation="55" />
          </feDiffuseLighting>
        </filter>

        {/* Ink brush texture - organic edges */}
        <filter id="brushTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Watercolor bleed effect */}
        <filter id="watercolorBleed" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>

        {/* Soft glow for celestial elements */}
        <filter id="celestialGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ink wash gradient for section cards */}
        <linearGradient id="inkWashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.ink} stopOpacity="0.03" />
          <stop offset="50%" stopColor={COLORS.ink} stopOpacity="0.06" />
          <stop offset="100%" stopColor={COLORS.ink} stopOpacity="0.02" />
        </linearGradient>

        {/* Red sun radial gradient */}
        <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.red} />
          <stop offset="70%" stopColor={COLORS.red} stopOpacity="0.9" />
          <stop offset="100%" stopColor={COLORS.darkRed} stopOpacity="0.3" />
        </radialGradient>

        {/* Celestial brush stroke gradient */}
        <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.celestial} stopOpacity="0" />
          <stop offset="50%" stopColor={COLORS.celestial} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.celestial} stopOpacity="0" />
        </linearGradient>

        {/* Wave pattern gradient */}
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.wave} stopOpacity="0.3" />
          <stop offset="50%" stopColor={COLORS.wave} stopOpacity="0.6" />
          <stop offset="100%" stopColor={COLORS.wave} stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// =============================================================================
// RICE PAPER BACKGROUND with washi grain texture
// =============================================================================
function RicePaperBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      role="presentation"
      aria-hidden="true"
    >
      {/* Base paper gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.parchment} 30%, ${COLORS.darkCream} 100%)`,
        }}
      />

      {/* Washi paper grain texture overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]">
        <rect width="100%" height="100%" filter="url(#washiGrain)" />
      </svg>

      {/* Subtle fiber lines (like real washi paper) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        <pattern id="washiFibers" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <line x1="0" y1="20" x2="100" y2="25" stroke={COLORS.ink} strokeWidth="0.3" />
          <line x1="10" y1="50" x2="90" y2="48" stroke={COLORS.ink} strokeWidth="0.2" />
          <line x1="5" y1="80" x2="95" y2="82" stroke={COLORS.ink} strokeWidth="0.25" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#washiFibers)" />
      </svg>

      {/* Aged scroll edge shadows */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: `
            inset 0 0 150px rgba(0,0,0,0.12),
            inset 0 50px 100px -50px rgba(0,0,0,0.08)
          `,
        }}
      />
    </div>
  )
}

// =============================================================================
// RED SUN (Amaterasu's divine symbol - Japanese flag style)
// =============================================================================
function RedSun({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed top-[-5%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] pointer-events-none z-[2]"
      role="presentation"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Main sun circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#sunGradient)"
          filter={reducedMotion ? undefined : "url(#celestialGlow)"}
          opacity="0.85"
        />

        {/* Sun rays - subtle ink strokes radiating out */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + Math.cos((i * 30 * Math.PI) / 180) * 95}
            y2={100 + Math.sin((i * 30 * Math.PI) / 180) * 95}
            stroke={COLORS.red}
            strokeWidth="1"
            strokeOpacity="0.25"
            strokeDasharray="5,10"
          />
        ))}

        {/* Divine ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke={COLORS.red}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          strokeDasharray="2,8"
        />
      </svg>
    </div>
  )
}

// =============================================================================
// CHERRY BLOSSOM PETALS (Static decorative - no animation hiding content)
// =============================================================================
function CherryBlossomPetals({ reducedMotion = false }: { reducedMotion?: boolean }) {
  // Static petal positions - visible immediately
  const petals = [
    { x: 5, y: 15, size: 12, rotation: 45 },
    { x: 15, y: 8, size: 10, rotation: 120 },
    { x: 25, y: 20, size: 8, rotation: 200 },
    { x: 85, y: 10, size: 11, rotation: 80 },
    { x: 92, y: 18, size: 9, rotation: 160 },
    { x: 78, y: 5, size: 10, rotation: 280 },
    { x: 8, y: 85, size: 10, rotation: 30 },
    { x: 18, y: 92, size: 8, rotation: 150 },
    { x: 88, y: 88, size: 11, rotation: 220 },
    { x: 95, y: 82, size: 9, rotation: 310 },
  ]

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[3] overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {petals.map((petal, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            width: petal.size,
            height: petal.size * 0.7,
            background: `radial-gradient(ellipse at 30% 30%, ${COLORS.sakura}, ${COLORS.sakuraDark})`,
            borderRadius: '50% 0 50% 0',
            transform: `rotate(${petal.rotation}deg)`,
            boxShadow: `0 1px 3px rgba(0,0,0,0.1)`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// CELESTIAL BRUSH TRAIL (Divine brush strokes in background)
// =============================================================================
function CelestialBrushTrail({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {/* Flowing brush strokes */}
        <path
          d="M-100,200 Q200,100 400,300 T800,200 T1100,350"
          fill="none"
          stroke="url(#brushGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#celestialGlow)"
          opacity="0.35"
        />
        <path
          d="M-100,600 Q300,500 500,650 T900,550 T1100,700"
          fill="none"
          stroke="url(#brushGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#celestialGlow)"
          opacity="0.25"
        />
        {/* Subtle divine swirl */}
        <path
          d="M50,400 Q150,350 200,450 Q250,550 350,500"
          fill="none"
          stroke={COLORS.celestial}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.15"
        />
      </svg>
    </div>
  )
}

// =============================================================================
// AMATERASU WOLF SILHOUETTE (Divine wolf - Okami's protagonist)
// =============================================================================
function AmaterasuSilhouette({ position = 'bottom-left' }: { position?: 'bottom-left' | 'bottom-right' }) {
  const isLeft = position === 'bottom-left'

  return (
    <div
      className={`fixed ${isLeft ? 'bottom-8 left-8' : 'bottom-8 right-8'} pointer-events-none z-[4] opacity-[0.12]`}
      role="presentation"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 150 100"
        className={`w-32 h-20 ${isLeft ? '' : 'scale-x-[-1]'}`}
        fill={COLORS.ink}
      >
        {/* Wolf body silhouette */}
        <path d="M20,70 Q30,50 45,55 L55,45 Q60,35 70,40 L85,35 Q95,30 100,35 L110,30 Q120,25 125,30 L130,40 Q135,50 130,60 L125,70 Q120,80 110,80 L40,80 Q25,80 20,70 Z" />
        {/* Head */}
        <circle cx="125" cy="45" r="12" />
        {/* Ears */}
        <path d="M118,35 L115,22 L122,30 Z" />
        <path d="M132,35 L135,22 L128,30 Z" />
        {/* Tail with divine swirl */}
        <path d="M20,60 Q5,40 15,25 Q20,20 25,25 Q30,35 20,50" fill="none" stroke={COLORS.ink} strokeWidth="4" />
        {/* Divine red markings */}
        <path d="M60,55 Q70,50 75,60 Q80,70 70,65" fill="none" stroke={COLORS.red} strokeWidth="2" opacity="0.4" />
        <path d="M90,50 Q95,45 100,50" fill="none" stroke={COLORS.red} strokeWidth="2" opacity="0.4" />
      </svg>
    </div>
  )
}

// =============================================================================
// OKAMI CHARACTER (CSS/SVG divine wolf sprite)
// =============================================================================
function OkamiCharacter({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="Divine spirit guide">
      <svg viewBox="0 0 60 72" className="w-[60px] h-[72px]">
        {/* Body */}
        <ellipse cx="30" cy="50" rx="18" ry="14" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth="1.5" />

        {/* Head */}
        <circle cx="30" cy="28" r="16" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth="1.5" />

        {/* Ears */}
        <path d="M18,18 L14,6 L22,14 Z" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth="1" />
        <path d="M42,18 L46,6 L38,14 Z" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth="1" />

        {/* Divine red markings - Amaterasu style */}
        <path d="M22,24 Q26,22 28,26" fill="none" stroke={COLORS.red} strokeWidth="2" strokeLinecap="round" />
        <path d="M38,24 Q34,22 32,26" fill="none" stroke={COLORS.red} strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="20" r="3" fill={COLORS.red} opacity="0.6" />

        {/* Eyes */}
        <circle cx="24" cy="28" r="2.5" fill={COLORS.ink} />
        <circle cx="36" cy="28" r="2.5" fill={COLORS.ink} />
        <circle cx="25" cy="27" r="1" fill={COLORS.cream} />
        <circle cx="37" cy="27" r="1" fill={COLORS.cream} />

        {/* Nose */}
        <ellipse cx="30" cy="34" rx="2" ry="1.5" fill={COLORS.ink} />

        {/* Tail with divine flame */}
        <path d="M48,50 Q58,40 52,28 Q50,24 54,20" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M54,20 Q56,16 52,14 Q50,16 52,20" fill={COLORS.red} opacity="0.7" />

        {/* Legs */}
        <rect x="20" y="58" width="5" height="10" rx="2" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth="1" />
        <rect x="35" y="58" width="5" height="10" rx="2" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth="1" />

        {/* Body markings */}
        <path d="M24,45 Q30,42 36,45" fill="none" stroke={COLORS.red} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>

      {/* Divine glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse, ${COLORS.celestial}25 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// =============================================================================
// WAVE PATTERN (Great Wave of Kanagawa inspired)
// =============================================================================
function WavePattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 30"
      className={`w-full h-8 ${className}`}
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M0,15 Q25,5 50,15 T100,15 T150,15 T200,15"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0,22 Q25,12 50,22 T100,22 T150,22 T200,22"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

// =============================================================================
// INK BRUSH STROKE DIVIDER
// =============================================================================
function InkBrushDivider({ withCircle = false }: { withCircle?: boolean }) {
  return (
    <div
      className="flex items-center justify-center my-8"
      role="separator"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 40" className="w-full max-w-xl h-10">
        {/* Left brush stroke */}
        <path
          d="M10,20 Q50,15 100,20 T180,20"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#brushTexture)"
          opacity="0.6"
        />
        {/* Center element */}
        {withCircle ? (
          <circle cx="200" cy="20" r="8" fill={COLORS.red} opacity="0.7" />
        ) : (
          <text x="200" y="25" textAnchor="middle" fill={COLORS.ink} fontSize="16" fontFamily="serif" opacity="0.5">
            -
          </text>
        )}
        {/* Right brush stroke */}
        <path
          d="M220,20 Q260,15 300,20 T390,20"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#brushTexture)"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

// =============================================================================
// SCROLL SECTION WRAPPER (Okami-style parchment card)
// Rice paper texture + ink brush borders + watercolor wash
// =============================================================================
function ScrollSection({
  children,
  className = '',
  title,
  titleIcon,
}: {
  children: React.ReactNode
  className?: string
  title?: string
  titleIcon?: React.ReactNode
}) {
  return (
    <section
      className={`relative p-6 mb-8 ${className}`}
      style={{
        // Multi-layered parchment background
        background: `
          linear-gradient(135deg, ${COLORS.cream}f8 0%, ${COLORS.parchment}f0 50%, ${COLORS.darkCream}e8 100%)
        `,
        // Ink brush stroke border effect
        borderRadius: '2px',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.6),
          inset 0 -1px 0 rgba(0,0,0,0.05),
          0 4px 20px rgba(0,0,0,0.08),
          0 1px 3px rgba(0,0,0,0.1)
        `,
      }}
      aria-label={title}
    >
      {/* Rice paper grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] rounded-sm overflow-hidden"
        aria-hidden="true"
      >
        <svg className="w-full h-full">
          <rect width="100%" height="100%" filter="url(#washiGrain)" />
        </svg>
      </div>

      {/* Ink wash overlay - watercolor effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-sm overflow-hidden"
        aria-hidden="true"
      >
        <svg className="w-full h-full opacity-40">
          <rect width="100%" height="100%" fill="url(#inkWashGradient)" />
        </svg>
      </div>

      {/* Brush stroke border - top edge */}
      <div
        className="absolute top-0 left-4 right-4 h-1 overflow-hidden"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 4" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,2 Q100,0 200,2 T400,2"
            fill="none"
            stroke={COLORS.ink}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#brushTexture)"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Brush stroke border - left edge (vermillion accent) */}
      <div
        className="absolute top-4 bottom-4 left-0 w-1 overflow-hidden"
        aria-hidden="true"
      >
        <svg viewBox="0 0 4 100" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M2,0 Q0,25 2,50 T2,100"
            fill="none"
            stroke={COLORS.red}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#brushTexture)"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Corner brush flourishes */}
      <div className="absolute top-2 right-2 w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-full h-full opacity-20">
          <path d="M20,4 Q16,8 12,6 Q8,4 4,8" fill="none" stroke={COLORS.ink} strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-2 left-2 w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-full h-full opacity-20">
          <path d="M4,20 Q8,16 12,18 Q16,20 20,16" fill="none" stroke={COLORS.ink} strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Title with brush stroke underline */}
      {title && (
        <h2
          className="relative text-xl mb-6 flex items-center gap-3 z-10"
          style={{
            color: COLORS.ink,
            fontFamily: '"Noto Serif JP", serif',
          }}
        >
          {titleIcon}
          <span>{title}</span>
          {/* Brush stroke underline extending from title */}
          <div className="flex-1 h-2 ml-4 overflow-hidden">
            <svg viewBox="0 0 200 8" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,4 Q50,2 100,4 T200,4"
                fill="none"
                stroke={COLORS.ink}
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#brushTexture)"
                opacity="0.25"
              />
            </svg>
          </div>
        </h2>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}

// =============================================================================
// ROLE CARDS (Current Roles)
// =============================================================================
function RoleCard({ role }: { role: typeof CURRENT_ROLES[0] }) {
  return (
    <div
      className="relative p-4"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
      }}
    >
      {/* Brush stroke left border */}
      <div className="absolute top-2 bottom-2 left-0 w-1" aria-hidden="true">
        <svg viewBox="0 0 4 50" className="w-full h-full" preserveAspectRatio="none">
          <path d="M2,0 Q1,12 2,25 T2,50" fill="none" stroke={COLORS.red} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex justify-between items-start pl-2">
        <div>
          <h4 className="text-sm font-semibold" style={{ color: COLORS.ink }}>
            {role.title}
          </h4>
          <p className="text-xs" style={{ color: COLORS.red }}>
            {role.company}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            background: COLORS.redFaint,
            color: COLORS.red,
          }}
        >
          {role.type === 'leadership' ? 'Leadership' : 'Current'}
        </span>
      </div>
      <p className="text-xs mt-2 pl-2" style={{ color: COLORS.inkWash }}>
        {role.description}
      </p>
    </div>
  )
}

// =============================================================================
// COMPANY CARD
// =============================================================================
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative p-4 group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
      }}
      aria-label={`Visit ${company.name} website`}
    >
      {/* Ink wash hover effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `${COLORS.ink}05` }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-3">
        <span className="text-2xl">{company.icon}</span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold group-hover:underline" style={{ color: COLORS.ink }}>
            {company.name}
          </h4>
          <p className="text-xs" style={{ color: COLORS.red }}>
            {company.tagline}
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.inkWash }}>
            {company.description}
          </p>
        </div>
      </div>
    </a>
  )
}

// =============================================================================
// BAND CARD
// =============================================================================
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="relative p-4 group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
      }}
    >
      {/* Brush stroke left border - gold for active */}
      <div className="absolute top-2 bottom-2 left-0 w-1" aria-hidden="true">
        <svg viewBox="0 0 4 50" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M2,0 Q1,12 2,25 T2,50"
            fill="none"
            stroke={band.active ? COLORS.gold : COLORS.inkFaint}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex justify-between items-start pl-2">
        <div>
          <h4
            className={`text-sm font-semibold ${band.url ? 'group-hover:underline' : ''}`}
            style={{ color: COLORS.ink }}
          >
            {band.name}
          </h4>
          <p className="text-xs" style={{ color: COLORS.gold }}>
            {band.genre}
          </p>
        </div>
        {band.active && (
          <span
            className="text-[10px] px-2 py-0.5"
            style={{
              background: COLORS.goldFaint,
              color: COLORS.gold,
            }}
          >
            Active
          </span>
        )}
      </div>
      <p className="text-xs mt-2 pl-2" style={{ color: COLORS.inkWash }}>
        {band.description}
      </p>
    </div>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${band.name} website`}>
        {content}
      </a>
    )
  }

  return content
}

// =============================================================================
// TECH STACK DISPLAY (Categories with tags - no skill bars)
// =============================================================================
function TechStackDisplay() {
  const techStack = TECH_STACK

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {techStack.map((category) => (
        <div
          key={category.name}
          className="relative p-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
          }}
        >
          <h4
            className="text-xs tracking-wider mb-3 pb-2 flex items-center gap-2"
            style={{
              color: COLORS.ink,
              borderBottom: `1px solid ${COLORS.ink}15`,
            }}
          >
            <span>{category.icon}</span>
            <span style={{ fontFamily: '"Noto Serif JP", serif' }}>{category.name}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((item) => (
              <span
                key={item}
                className="text-[11px] px-2 py-1"
                style={{
                  background: `${COLORS.ink}06`,
                  border: `1px solid ${COLORS.ink}12`,
                  color: COLORS.inkWash,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// SKILLS DISPLAY (For drummer/fighter - NO skill bars, just tags)
// =============================================================================
function SkillsDisplay({ profession }: { profession: 'drummer' | 'fighter' }) {
  const skills = getSkillsByProfession(profession)

  return (
    <div className="space-y-4">
      {skills.map((category) => (
        <div
          key={category.name}
          className="relative p-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
          }}
        >
          <h4
            className="text-xs tracking-wider mb-3 pb-2 flex items-center gap-2"
            style={{
              color: COLORS.ink,
              borderBottom: `1px solid ${COLORS.ink}15`,
            }}
          >
            <span>{category.icon}</span>
            <span style={{ fontFamily: '"Noto Serif JP", serif' }}>{category.name}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill.name}
                className="text-[11px] px-3 py-1.5"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.red}08, ${COLORS.red}04)`,
                  border: `1px solid ${COLORS.red}20`,
                  color: COLORS.ink,
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// PROJECT CARD (With impact statements)
// =============================================================================
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="relative p-4"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
      }}
    >
      {/* Brush stroke left border */}
      <div className="absolute top-2 bottom-2 left-0 w-1" aria-hidden="true">
        <svg viewBox="0 0 4 80" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M2,0 Q1,20 2,40 T2,80"
            fill="none"
            stroke={project.featured ? COLORS.red : COLORS.inkFaint}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="pl-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-semibold" style={{ color: COLORS.ink }}>
            {project.name}
          </h4>
          {project.featured && (
            <span
              className="text-[10px] px-2 py-0.5"
              style={{
                background: COLORS.redFaint,
                color: COLORS.red,
              }}
            >
              Featured
            </span>
          )}
        </div>
        <p className="text-xs mb-2" style={{ color: COLORS.red }}>
          {project.tagline}
        </p>
        <p className="text-xs mb-3" style={{ color: COLORS.inkWash }}>
          {project.description}
        </p>

        {/* Impact statement */}
        {project.impact && (
          <div
            className="text-xs p-2 mb-3"
            style={{
              background: COLORS.goldFaint,
              borderLeft: `2px solid ${COLORS.gold}`,
              color: COLORS.ink,
            }}
          >
            <strong>Impact:</strong> {project.impact}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-2 py-0.5"
              style={{
                background: `${COLORS.ink}06`,
                color: COLORS.inkWash,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {project.links?.site && (
          <a
            href={project.links.site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs underline"
            style={{ color: COLORS.red }}
            aria-label={`Visit ${project.name} website`}
          >
            View Project
          </a>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// EXPERIENCE CARD
// =============================================================================
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const startDate = new Date(entry.startDate)
  const endDate = entry.endDate ? new Date(entry.endDate) : null
  const startDisplay = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const endDisplay = endDate ? endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

  return (
    <div
      className="relative p-4"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.parchment}e0)`,
      }}
    >
      {/* Brush stroke left border */}
      <div className="absolute top-2 bottom-2 left-0 w-1" aria-hidden="true">
        <svg viewBox="0 0 4 80" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M2,0 Q1,20 2,40 T2,80"
            fill="none"
            stroke={entry.endDate ? COLORS.inkFaint : COLORS.red}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="pl-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-sm font-semibold" style={{ color: COLORS.ink }}>
              {entry.title}
            </h4>
            <p className="text-xs" style={{ color: COLORS.red }}>
              {entry.organization}
            </p>
          </div>
          <span
            className="text-[10px] px-2 py-0.5"
            style={{
              background: `${COLORS.ink}08`,
              color: COLORS.inkWash,
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>
        <p className="text-xs mb-2" style={{ color: COLORS.inkWash }}>
          {entry.description}
        </p>
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-1 mt-2">
            {entry.highlights.map((highlight, i) => (
              <li
                key={i}
                className="text-xs flex items-start gap-2"
                style={{ color: COLORS.ink }}
              >
                <span style={{ color: COLORS.red }}>&#9670;</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// PROFESSION SELECTOR (Brush stroke style buttons)
// =============================================================================
function ProfessionBrushButton({
  profession,
  isActive,
  onClick,
  label,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  label: string
}) {
  const icons = {
    engineer: '筆', // Brush (fude)
    drummer: '鼓', // Drum (tsuzumi)
    fighter: '武', // Martial (bu)
  }

  return (
    <button
      onClick={onClick}
      className="relative px-6 py-3"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`
          : `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `2px solid ${isActive ? COLORS.red : COLORS.ink}30`,
        color: isActive ? COLORS.cream : COLORS.ink,
        fontFamily: '"Noto Serif JP", serif',
      }}
      aria-label={`Switch to ${label} mode`}
      aria-pressed={isActive}
    >
      <span className="text-xl mr-2">{icons[profession]}</span>
      <span className="text-sm tracking-wider">{label}</span>

      {/* Brush stroke underline when active */}
      {isActive && (
        <svg
          viewBox="0 0 100 10"
          className="absolute -bottom-1 left-2 right-2 h-2"
          aria-hidden="true"
        >
          <path
            d="M5,5 Q25,2 50,5 T95,5"
            fill="none"
            stroke={COLORS.cream}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function PainterlyTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show immediately - no loading state that hides content
  if (!mounted) {
    return (
      <div
        className="min-h-screen"
        style={{ background: COLORS.cream }}
        aria-busy="true"
        aria-label="Loading..."
      />
    )
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: '"Noto Serif JP", "Georgia", serif',
      }}
    >
      {/* SVG Filter Definitions */}
      <SvgFilters />

      {/* Background layers */}
      <RicePaperBackground />
      <RedSun reducedMotion={reducedMotion} />
      <CelestialBrushTrail reducedMotion={reducedMotion} />
      <CherryBlossomPetals reducedMotion={reducedMotion} />

      {/* Decorative wolf silhouette */}
      <AmaterasuSilhouette position="bottom-left" />

      {/* Header */}
      <header className="relative z-30 pt-12 pb-8 text-center" role="banner">
        <div className="max-w-4xl mx-auto px-6">
          <WavePattern className="mb-6 opacity-50" />

          <h1
            className="text-3xl md:text-4xl tracking-[0.15em] mb-2"
            style={{
              color: COLORS.ink,
              textShadow: `2px 2px 0 ${COLORS.cream}`,
              fontFamily: '"Noto Serif JP", serif',
            }}
          >
            ALEXANDER PULIDO
          </h1>

          <p
            className="text-base tracking-widest mb-1"
            style={{ color: COLORS.red }}
          >
            {PROFESSIONAL_SUMMARY.headline}
          </p>

          <p
            className="text-sm tracking-wider mb-6"
            style={{ color: COLORS.inkWash }}
          >
            {PROFESSIONAL_SUMMARY.tagline}
          </p>

          {/* Navigation with character */}
          <div className="flex justify-center items-center gap-8 mb-6 flex-wrap">
            <Link
              href="/cv"
              className="px-5 py-2 text-sm tracking-wider"
              style={{
                background: 'transparent',
                border: `2px solid ${COLORS.ink}`,
                color: COLORS.ink,
              }}
              aria-label="View full CV"
            >
              View Scroll
            </Link>

            <OkamiCharacter />

            <Link
              href="/personal-projects/game-engine"
              className="px-5 py-2 text-sm tracking-wider"
              style={{
                background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`,
                color: COLORS.cream,
                boxShadow: `0 4px 15px ${COLORS.red}40`,
              }}
              aria-label="Enter the game engine project"
            >
              Enter Realm
            </Link>

            <ThemeSwitcher />
          </div>

          <InkBrushDivider withCircle />
        </div>
      </header>

      {/* Profession selector */}
      <section className="relative z-20 py-4" aria-label="Select profession view">
        <div className="text-center mb-4">
          <span
            className="text-xs tracking-[0.3em]"
            style={{ color: COLORS.inkWash }}
          >
            CHOOSE YOUR PATH
          </span>
        </div>
        <div className="flex justify-center gap-4 flex-wrap px-4">
          <ProfessionBrushButton
            profession="engineer"
            isActive={active === 'engineer'}
            onClick={() => setActive('engineer')}
            label="Engineer"
          />
          <ProfessionBrushButton
            profession="drummer"
            isActive={active === 'drummer'}
            onClick={() => setActive('drummer')}
            label="Drummer"
          />
          <ProfessionBrushButton
            profession="fighter"
            isActive={active === 'fighter'}
            onClick={() => setActive('fighter')}
            label="Fighter"
          />
        </div>
      </section>

      {/* Main content - ALL VISIBLE IMMEDIATELY */}
      <main className="relative z-20 px-6 py-8" role="main">
        <div className="max-w-4xl mx-auto">

          {/* About / Bio Section */}
          <ScrollSection
            title="About"
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            <div className="text-center max-w-2xl mx-auto">
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: COLORS.ink }}
              >
                &ldquo;{aboutData.bio}&rdquo;
              </p>
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-4 py-1.5"
                    style={{
                      background: COLORS.redFaint,
                      border: `1px solid ${COLORS.red}25`,
                      color: COLORS.red,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </ScrollSection>

          <InkBrushDivider />

          {/* Current Roles Section */}
          <ScrollSection
            title="Current Roles"
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <rect x="3" y="3" width="14" height="14" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CURRENT_ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </ScrollSection>

          <InkBrushDivider />

          {/* Tech Stack / Skills Section */}
          <ScrollSection
            title={active === 'engineer' ? 'Tech Stack' : 'Skills & Abilities'}
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <polygon points="10,0 20,10 10,20 0,10" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            {active === 'engineer' ? (
              <TechStackDisplay />
            ) : (
              <SkillsDisplay profession={active} />
            )}
          </ScrollSection>

          <InkBrushDivider />

          {/* Companies Section (Engineer mode) */}
          {active === 'engineer' && (
            <>
              <ScrollSection
                title="Companies & Ventures"
                titleIcon={
                  <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill={COLORS.gold} opacity="0.8" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </ScrollSection>
              <InkBrushDivider />
            </>
          )}

          {/* Bands Section (Drummer mode) */}
          {active === 'drummer' && (
            <>
              <ScrollSection
                title="Musical Projects"
                titleIcon={
                  <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill={COLORS.gold} opacity="0.8" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </ScrollSection>
              <InkBrushDivider />
            </>
          )}

          {/* Projects Section */}
          <ScrollSection
            title="Featured Work"
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </ScrollSection>

          <InkBrushDivider />

          {/* Work Experience Section */}
          {experience.length > 0 && (
            <ScrollSection
              title="Journey"
              titleIcon={
                <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                  <path d="M2,10 Q10,2 18,10 Q10,18 2,10" fill={COLORS.red} opacity="0.8" />
                </svg>
              }
            >
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </ScrollSection>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <WavePattern className="max-w-md mx-auto mb-4" />
        <p
          className="text-xs tracking-widest flex items-center justify-center gap-4"
          style={{ color: COLORS.inkWash }}
        >
          <span style={{ color: COLORS.red }}>&#9670;</span>
          DIVINE BRUSH GUIDES THE WAY
          <span style={{ color: COLORS.red }}>&#9670;</span>
          MMXXVI
          <span style={{ color: COLORS.red }}>&#9670;</span>
        </p>
        <WavePattern className="max-w-md mx-auto mt-4 rotate-180" />
      </footer>

      {/* Minimal CSS - font import only, no hiding animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap');
      `}</style>
    </div>
  )
}
