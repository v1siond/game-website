'use client'

import { memo, useEffect, useState, useMemo, useCallback, useRef, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { locales, localeNames, type Locale } from '@/i18n/config'
import { useProfession } from '@/contexts/ProfessionContext'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA, filterProjectsByProfession, getFeaturedProjects } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { WORK_EXPERIENCE } from '@/data/achievements'

// =============================================================================
// WARCRAFT 3 DUAL PALETTE - Reign of Chaos + Frozen Throne
// =============================================================================

const WC3 = {
  // === REIGN OF CHAOS (demonic, war, plague) ===
  roc: {
    skyTop: '#050805',
    skyMid: '#081008',
    skyBot: '#0c150c',
    // Olive-green fel tones - muddy, worn, rain-soaked battlefield
    felBright: '#5a6a3a',
    felMid: '#3a4a28',
    felDark: '#2a3518',
    felGlow: '#4a5a3080',
    fireBright: '#ffaa44',
    fireMid: '#dd6622',
    fireCore: '#ffff88',
    // Terrain - WC3 RoC style: olive-green grass, earthy ground
    grassOlive: '#5a5a30',       // olive-green grass (main)
    grassYellow: '#6a6535',      // yellowish green
    grassDark: '#4a4a28',        // darker grass shadow
    grassLight: '#7a7040',       // lighter grass highlights
    groundGreen: '#1a2518',      // greenish ground (from flagpole)
    groundMid: '#253020',        // mid-tone ground
    groundDark: '#2a2518',       // darker areas
    waterDark: '#1a2a30',        // puddle water
    rockDistant: '#4a4a48',      // distant gray cliffs
    rockSilhouette: '#2a2a28',   // very distant rock shapes
  },

  // === FROZEN THRONE (ice, frost, Northrend) ===
  ft: {
    skyTop: '#080a10',
    skyMid: '#0a1420',
    skyBot: '#102030',
    iceBright: '#c8e8ff',
    iceMid: '#6eb5ff',
    iceDark: '#3a7fba',
    iceGlow: '#6eb5ff60',
    frostWhite: '#e8f4ff',
    frostMid: '#a0c8e8',
  },

  // === SHARED ===
  bgVoid: '#060608',
  bgDeep: '#0a0c0e',

  metalDark: '#2a2428',
  metalMid: '#3a3438',
  metalLight: '#5a5458',
  metalHighlight: '#6a6468',

  goldBright: '#d4a017',
  goldMid: '#b8860b',
  goldDark: '#8b6914',
  goldDeep: '#5f4c0c',

  bloodRed: '#8b0000',
  hordeRed: '#5a1a1a',
  allianceBlue: '#1e3a5f',
  elfPurple: '#4a2a6a',

  textBright: '#e8dcc8',  // ~14:1 contrast on dark bg ✓
  textMid: '#b09878',     // bumped from #a08868 for ~7:1 contrast ✓
  textDim: '#8a7860',     // bumped from #685840 for ~4.5:1 contrast ✓ WCAG AA
}

// =============================================================================
// FADE IN SECTION
// =============================================================================

const FadeInSection = memo(function FadeInSection({
  children,
  delay = 0
}: {
  children: React.ReactNode
  delay?: number
}) {
  // Trigger when 20% of element is visible, with -20% margin so it triggers when well into viewport
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2, rootMargin: '0px 0px -20% 0px' })
  return (
    <div
      ref={ref}
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  )
})

// =============================================================================
// WC3 FRAME - Heavy metal with bevels
// =============================================================================

function WC3Frame({ children, title, zone = 'roc' }: { children: React.ReactNode; title?: string; zone?: 'roc' | 'ft' }) {
  const accentColor = zone === 'ft' ? WC3.ft.iceMid : WC3.roc.felMid

  return (
    <div style={{ position: 'relative' }}>
      {/* Corner ornaments */}
      {['tl', 'tr', 'bl', 'br'].map((pos) => (
        <svg
          key={pos}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            zIndex: 10,
            ...(pos.includes('t') ? { top: '-2px' } : { bottom: '-2px' }),
            ...(pos.includes('l') ? { left: '-2px' } : { right: '-2px' }),
            transform: `rotate(${pos === 'tl' ? 0 : pos === 'tr' ? 90 : pos === 'bl' ? 270 : 180}deg)`,
          }}
        >
          <path d="M0 0 L24 0 L24 6 L6 6 L6 24 L0 24 Z" fill={WC3.metalMid} />
          <path d="M2 2 L20 2 L20 4 L4 4 L4 20 L2 20 Z" fill={WC3.metalLight} />
          <circle cx="4" cy="4" r="2" fill={WC3.metalHighlight} />
        </svg>
      ))}

      <div style={{
        background: `linear-gradient(135deg, ${WC3.metalLight} 0%, ${WC3.metalMid} 30%, ${WC3.metalDark} 100%)`,
        padding: '5px',
        boxShadow: `inset 1px 1px 3px rgba(100,100,100,0.3), inset -1px -1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.6)`,
      }}>
        <div style={{ background: `linear-gradient(180deg, ${WC3.goldDark} 0%, ${WC3.goldDeep} 100%)`, padding: '2px' }}>
          <div style={{ background: WC3.metalDark, padding: '2px' }}>
            <div style={{
              background: `radial-gradient(ellipse at 50% 0%, ${WC3.bgDeep} 0%, ${WC3.bgVoid} 100%)`,
              padding: '1.5rem 1.75rem',
              boxShadow: `inset 0 2px 12px rgba(0,0,0,0.8)`,
            }}>
              {title && (
                <div style={{
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: `1px solid ${WC3.metalDark}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{ width: '8px', height: '8px', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                  <h2 style={{
                    color: WC3.goldBright,
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    textShadow: `1px 1px 3px ${WC3.bgVoid}`,
                    margin: 0
                  }}>
                    {title}
                  </h2>
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// WC3 BUTTON
// =============================================================================

function WC3Button({
  children,
  onClick,
  active,
  href,
  variant = 'default',
  zone = 'roc'
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  href?: string
  variant?: 'default' | 'primary'
  zone?: 'roc' | 'ft'
}) {
  const accentColor = zone === 'ft' ? WC3.ft.iceMid : WC3.roc.felMid
  const accentBright = zone === 'ft' ? WC3.ft.iceBright : WC3.roc.felBright

  const style: React.CSSProperties = {
    background: variant === 'primary'
      ? `linear-gradient(180deg, ${WC3.goldMid} 0%, ${WC3.goldDark} 50%, ${WC3.goldDeep} 100%)`
      : active
        ? `linear-gradient(180deg, ${WC3.metalLight} 0%, ${WC3.metalMid} 100%)`
        : `linear-gradient(180deg, ${WC3.metalMid} 0%, ${WC3.metalDark} 100%)`,
    border: `2px solid ${active ? accentColor : variant === 'primary' ? WC3.goldBright : WC3.metalDark}`,
    boxShadow: active
      ? `0 0 10px ${accentColor}, inset 1px 1px 0 ${WC3.metalHighlight}`
      : `inset 1px 1px 2px ${WC3.metalLight}, inset -1px -1px 2px ${WC3.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
    color: variant === 'primary' ? WC3.bgVoid : active ? accentBright : WC3.textBright,
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: '1.125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  }

  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button onClick={onClick} style={style}>{children}</button>
}

// =============================================================================
// WC3 LANGUAGE SWITCHER - Themed dropdown
// =============================================================================

function WC3LanguageSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined

    const storedLocale = localStorage.getItem('locale') as Locale | null

    if (cookieLocale && locales.includes(cookieLocale)) {
      setCurrentLocale(cookieLocale)
    } else if (storedLocale && locales.includes(storedLocale)) {
      setCurrentLocale(storedLocale)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale)
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`
    setCurrentLocale(newLocale)
    setIsOpen(false)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        style={{
          background: `linear-gradient(180deg, ${WC3.metalMid} 0%, ${WC3.metalDark} 100%)`,
          border: `2px solid ${WC3.metalDark}`,
          boxShadow: `inset 1px 1px 2px ${WC3.metalLight}, inset -1px -1px 2px ${WC3.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
          color: WC3.textBright,
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0.5rem 0.75rem',
          cursor: isPending ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <span style={{ fontSize: '0.75rem' }}>🌐</span>
        <span>{currentLocale.toUpperCase()}</span>
        <span style={{ fontSize: '0.625rem', marginLeft: '0.125rem' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          background: `linear-gradient(180deg, ${WC3.bgDeep} 0%, ${WC3.bgVoid} 100%)`,
          border: `2px solid ${WC3.metalDark}`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 ${WC3.metalLight}`,
          minWidth: '120px',
          zIndex: 1000,
        }}>
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: currentLocale === locale ? `${WC3.roc.felDark}40` : 'transparent',
                border: 'none',
                borderBottom: locale !== locales[locales.length - 1] ? `1px solid ${WC3.metalDark}50` : 'none',
                color: currentLocale === locale ? WC3.roc.felBright : WC3.textMid,
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.875rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                if (currentLocale !== locale) {
                  e.currentTarget.style.background = `${WC3.metalMid}30`
                  e.currentTarget.style.color = WC3.textBright
                }
              }}
              onMouseLeave={(e) => {
                if (currentLocale !== locale) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = WC3.textMid
                }
              }}
            >
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && <span style={{ color: WC3.roc.felBright }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// INNER CARD
// =============================================================================

function InnerCard({ children, highlight, zone = 'roc' }: { children: React.ReactNode; highlight?: boolean; zone?: 'roc' | 'ft' }) {
  const accentColor = zone === 'ft' ? WC3.ft.iceDark : WC3.roc.felDark

  return (
    <div style={{
      background: `linear-gradient(180deg, ${WC3.bgDeep} 0%, ${WC3.bgVoid} 100%)`,
      border: `1px solid ${highlight ? WC3.goldDark : WC3.metalDark}`,
      borderLeft: highlight ? `3px solid ${accentColor}` : `1px solid ${WC3.metalDark}`,
      padding: '1rem',
      boxShadow: `inset 0 1px 6px rgba(0,0,0,0.5)`,
    }}>
      {children}
    </div>
  )
}

// =============================================================================
// INFERNAL GOLEM SVG - WC3-style rock golem with fel fire joints
// =============================================================================

interface InfernalGolemProps {
  id: string
  isIdle?: boolean
  scale?: number
}

function InfernalGolemSVG({ id, isIdle = false, scale = 1 }: InfernalGolemProps) {
  const suffix = isIdle ? 'Idle' : ''
  const rockId = `rock${suffix}${id}`
  const felFireId = `felFire${suffix}${id}`
  const glowId = `glow${suffix}${id}`
  const rockCrackId = `rockCrack${suffix}${id}`
  const fireFilterId = `fireFilter${suffix}${id}`

  // Simplified flame using CSS animations (much faster than feTurbulence)
  const FelFlame = ({ cx, cy, size = 1, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) => {
    const w = size * 14
    const h = size * 20
    return (
      <g transform={`translate(${cx - w/2}, ${cy - h})`}>
        {/* Outer glow */}
        <ellipse
          cx={w/2} cy={h * 0.6} rx={w * 0.5} ry={h * 0.5}
          fill={WC3.roc.felDark} opacity="0.4"
          style={isIdle ? { animation: `flameOuter ${1.8 + delay * 0.1}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.6}px` } : undefined}
        />
        {/* Middle flame */}
        <ellipse
          cx={w/2} cy={h * 0.55} rx={w * 0.35} ry={h * 0.4}
          fill={WC3.roc.felMid} opacity="0.7"
          style={isIdle ? { animation: `flameMid ${1.5 + delay * 0.08}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.55}px` } : undefined}
        />
        {/* Inner bright core */}
        <ellipse
          cx={w/2} cy={h * 0.5} rx={w * 0.2} ry={h * 0.3}
          fill={WC3.roc.felBright} opacity="0.85"
          style={isIdle ? { animation: `flameInner ${1.2 + delay * 0.05}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.5}px` } : undefined}
        />
      </g>
    )
  }

  // Smaller flame for joints - CSS animation based (performance optimized)
  const SmallFlame = ({ cx, cy, size = 0.6, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) => {
    const w = size * 10
    const h = size * 14
    return (
      <g transform={`translate(${cx - w/2}, ${cy - h})`}>
        {/* Outer glow */}
        <ellipse
          cx={w/2} cy={h * 0.6} rx={w * 0.45} ry={h * 0.45}
          fill={WC3.roc.felDark} opacity="0.35"
          style={isIdle ? { animation: `flameOuter ${1.6 + delay * 0.08}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.6}px` } : undefined}
        />
        {/* Inner core */}
        <ellipse
          cx={w/2} cy={h * 0.55} rx={w * 0.25} ry={h * 0.35}
          fill={WC3.roc.felMid} opacity="0.75"
          style={isIdle ? { animation: `flameInner ${1.3 + delay * 0.05}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.55}px` } : undefined}
        />
      </g>
    )
  }

  const breathStyle: React.CSSProperties = isIdle
    ? { animation: 'infernalBreath 3s ease-in-out infinite', transformOrigin: 'center bottom' }
    : {}

  return (
    <svg
      width={160 * scale}
      height={200 * scale}
      viewBox="0 0 160 200"
      style={{ overflow: 'visible', ...breathStyle }}
    >
      <defs>
        {/* Rock gradient - dark grey with texture */}
        <linearGradient id={rockId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4845" />
          <stop offset="30%" stopColor="#3a3835" />
          <stop offset="60%" stopColor="#2a2825" />
          <stop offset="100%" stopColor="#1a1815" />
        </linearGradient>

        {/* Fel fire gradient */}
        <linearGradient id={felFireId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={WC3.roc.felDark} />
          <stop offset="30%" stopColor={WC3.roc.felMid} />
          <stop offset="60%" stopColor={WC3.roc.felBright} />
          <stop offset="100%" stopColor="#ffff88" />
        </linearGradient>

        {/* Rock crack glow */}
        <linearGradient id={rockCrackId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={WC3.roc.felDark} />
          <stop offset="50%" stopColor={WC3.roc.felMid} />
          <stop offset="100%" stopColor={WC3.roc.felDark} />
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Inner glow for rock cracks */}
        <filter id={`${glowId}Inner`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ============ LEFT LEG (back layer) - with idle shift ============ */}
      <g style={isIdle ? { animation: 'leftLegShift 5s ease-in-out infinite', transformOrigin: '50px 120px' } : {}}>
        {/* Thigh */}
        <polygon
          points="50,120 42,140 52,145 58,125"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="1.5"
        />
        {/* Knee fire - layered flame */}
        <SmallFlame cx={48} cy={147} size={1.6} delay={1} />
        {/* Calf - MASSIVE boulder like shoulder */}
        <polygon
          points="30,148 26,162 32,178 50,185 58,172 55,155 45,148"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="2"
        />
        {/* Calf cracks */}
        <path d="M38,155 L42,168 L38,178" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Foot claws - 2 large claws */}
        <polygon points="32,178 18,200 38,192" fill={WC3.roc.felBright} />
        <polygon points="48,182 48,205 60,195" fill={WC3.roc.felBright} />
      </g>

      {/* ============ RIGHT LEG (back layer) - with idle shift ============ */}
      <g style={isIdle ? { animation: 'rightLegShift 5s ease-in-out infinite', transformOrigin: '110px 120px' } : {}}>
        {/* Thigh */}
        <polygon
          points="110,120 102,125 108,145 118,140"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="1.5"
        />
        {/* Knee fire - layered flame */}
        <SmallFlame cx={112} cy={147} size={1.6} delay={2} />
        {/* Calf - MASSIVE boulder like shoulder */}
        <polygon
          points="102,148 105,155 102,172 110,185 128,178 134,162 130,148 115,148"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="2"
        />
        {/* Calf cracks */}
        <path d="M122,155 L118,168 L122,178" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Foot claws - 2 large claws */}
        <polygon points="128,178 142,200 122,192" fill={WC3.roc.felBright} />
        <polygon points="112,182 112,205 100,195" fill={WC3.roc.felBright} />
      </g>

      {/* ============ HIP FIRE (connecting legs to torso) ============ */}
      <FelFlame cx={55} cy={115} size={2.7} delay={3} />
      <FelFlame cx={105} cy={115} size={2.7} delay={4} />

      {/* ============ TORSO - with idle sway ============ */}
      <g style={isIdle ? { animation: 'torsoSway 7s ease-in-out infinite', transformOrigin: '80px 115px' } : {}}>
        {/* Main torso rock plates */}
        <polygon
          points="45,60 38,90 50,115 80,122 110,115 122,90 115,60 95,50 65,50"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="2"
        />
        {/* Green crack lines on torso */}
        <path d="M65,55 L60,75 L70,95 L80,115" stroke={`url(#${rockCrackId})`} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M95,55 L100,75 L90,95 L80,115" stroke={`url(#${rockCrackId})`} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M55,70 L80,80 L105,70" stroke={`url(#${rockCrackId})`} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Core fire visible through center - layered */}
        <FelFlame cx={80} cy={85} size={2.6} delay={0} />
      </g>

      {/* ============ MASSIVE LEFT SHOULDER (iconic WC3 feature) ============ */}
      {/* Shoulder fire base - layered flame */}
      <FelFlame cx={35} cy={55} size={2.2} delay={5} />
      {/* Hexagonal boulder shoulder */}
      <polygon
        points="5,35 0,55 10,75 35,80 55,65 50,40 30,25 10,30"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="2"
      />
      {/* Shoulder cracks */}
      <path d="M15,40 L25,55 L20,70" stroke={WC3.roc.felMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
      <path d="M40,35 L35,55 L45,70" stroke={WC3.roc.felMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />

      {/* ============ MASSIVE RIGHT SHOULDER ============ */}
      {/* Shoulder fire base - layered flame */}
      <FelFlame cx={125} cy={55} size={2.2} delay={7} />
      {/* Hexagonal boulder shoulder */}
      <polygon
        points="155,35 160,55 150,75 125,80 105,65 110,40 130,25 150,30"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="2"
      />
      {/* Shoulder cracks */}
      <path d="M145,40 L135,55 L140,70" stroke={WC3.roc.felMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
      <path d="M120,35 L125,55 L115,70" stroke={WC3.roc.felMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />

      {/* ============ LEFT ARM - with idle sway ============ */}
      <g style={isIdle ? { animation: 'leftArmSway 6s ease-in-out infinite', transformOrigin: '25px 78px' } : {}}>
        {/* Upper arm */}
        <polygon
          points="20,78 12,95 22,105 32,90"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="1.5"
        />
        {/* Elbow fire - layered */}
        <SmallFlame cx={18} cy={108} size={1.6} delay={9} />
        {/* Forearm - MASSIVE boulder like shoulder */}
        <polygon
          points="0,108 -5,125 2,145 22,150 32,138 30,118 18,108"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="2"
        />
        {/* Forearm cracks */}
        <path d="M8,115 L12,130 L8,142" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M22,115 L18,130 L24,142" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Hand claws - 2 large claws */}
        <polygon points="4,145 -14,175 12,162" fill={WC3.roc.felBright} />
        <polygon points="20,148 18,180 32,165" fill={WC3.roc.felBright} />
      </g>

      {/* ============ RIGHT ARM - with idle sway ============ */}
      <g style={isIdle ? { animation: 'rightArmSway 6s ease-in-out infinite', transformOrigin: '135px 78px' } : {}}>
        {/* Upper arm */}
        <polygon
          points="140,78 148,90 138,105 128,95"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="1.5"
        />
        {/* Elbow fire - layered */}
        <SmallFlame cx={142} cy={108} size={1.6} delay={10} />
        {/* Forearm - MASSIVE boulder like shoulder */}
        <polygon
          points="128,108 130,118 128,138 138,150 158,145 165,125 160,108 142,108"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="2"
        />
        {/* Forearm cracks */}
        <path d="M152,115 L148,130 L152,142" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M138,115 L142,130 L136,142" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Hand claws - 2 large claws */}
        <polygon points="156,145 174,175 148,162" fill={WC3.roc.felBright} />
        <polygon points="140,148 142,180 128,165" fill={WC3.roc.felBright} />
      </g>

      {/* ============ NECK FIRE ============ */}
      <FelFlame cx={80} cy={48} size={2.4} delay={11} />

      {/* ============ HEAD (Menacing Skull) - with idle look animation ============ */}
      <g style={isIdle ? { animation: 'headLook 8s ease-in-out infinite', transformOrigin: '80px 50px' } : {}}>
        {/* Skull base shape */}
        <polygon
          points="58,48 52,35 55,18 65,8 80,5 95,8 105,18 108,35 102,48 92,50 68,50"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="2"
        />
        {/* Forehead plate */}
        <polygon
          points="60,20 65,10 80,7 95,10 100,20 95,22 65,22"
          fill="#2a2825"
          stroke="#1a1815"
          strokeWidth="1"
        />
        {/* Heavy brow ridge - creates menacing shadow */}
        <polygon
          points="55,28 62,22 80,20 98,22 105,28 100,32 60,32"
          fill="#1a1815"
          stroke="#0a0a08"
          strokeWidth="1"
        />

        {/* LEFT EYE SOCKET - Dark hole with fire from within */}
        {/* Socket (dark recess) */}
        <polygon
          points="62,32 68,28 76,32 76,40 68,43 62,38"
          fill="#0a0808"
          stroke="#1a1815"
          strokeWidth="1"
        />
        {/* Fire glow from deep inside */}
        <ellipse cx="69" cy="36" rx="4" ry="3" fill={WC3.roc.felDark} opacity="0.8" />
        <ellipse cx="69" cy="35" rx="2.5" ry="2" fill={WC3.roc.felMid} opacity="0.9" style={isIdle ? { animation: 'eyeGlow 2s ease-in-out infinite' } : {}} />
        <ellipse cx="69" cy="34" rx="1.5" ry="1" fill={WC3.roc.felBright} opacity="0.7" filter={`url(#${glowId})`} />

        {/* RIGHT EYE SOCKET - Dark hole with fire from within */}
        <polygon
          points="84,32 92,28 98,32 98,38 92,43 84,40"
          fill="#0a0808"
          stroke="#1a1815"
          strokeWidth="1"
        />
        <ellipse cx="91" cy="36" rx="4" ry="3" fill={WC3.roc.felDark} opacity="0.8" />
        <ellipse cx="91" cy="35" rx="2.5" ry="2" fill={WC3.roc.felMid} opacity="0.9" style={isIdle ? { animation: 'eyeGlow 2s ease-in-out infinite' } : {}} />
        <ellipse cx="91" cy="34" rx="1.5" ry="1" fill={WC3.roc.felBright} opacity="0.7" filter={`url(#${glowId})`} />

        {/* NASAL CAVITY - Dark triangular hole */}
        <polygon
          points="76,38 80,34 84,38 80,46"
          fill="#0a0808"
          stroke="#1a1815"
          strokeWidth="1"
        />
        {/* Glow from within nasal cavity */}
        <ellipse cx="80" cy="40" rx="2" ry="3" fill={WC3.roc.felDark} opacity="0.6" />

        {/* JAW/TEETH AREA */}
        {/* Lower jaw structure */}
        <polygon
          points="65,46 70,42 80,41 90,42 95,46 92,52 68,52"
          fill={`url(#${rockId})`}
          stroke="#1a1815"
          strokeWidth="1"
        />
        {/* Teeth - dark gaps between rock teeth */}
        <line x1="72" y1="46" x2="72" y2="50" stroke="#0a0808" strokeWidth="2" />
        <line x1="77" y1="45" x2="77" y2="50" stroke="#0a0808" strokeWidth="2" />
        <line x1="83" y1="45" x2="83" y2="50" stroke="#0a0808" strokeWidth="2" />
        <line x1="88" y1="46" x2="88" y2="50" stroke="#0a0808" strokeWidth="2" />
        {/* Glow between teeth */}
        <ellipse cx="80" cy="48" rx="8" ry="2" fill={WC3.roc.felDark} opacity="0.4" filter={`url(#${glowId}Inner)`} />

        {/* Cheekbone cracks */}
        <path d="M58,35 L65,40" stroke={WC3.roc.felDark} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M102,35 L95,40" stroke={WC3.roc.felDark} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
      </g>
    </svg>
  )
}

// =============================================================================
// DUAL ZONE ATMOSPHERE - RoC transitions to FT based on scroll
// =============================================================================

const DualZoneAtmosphere = memo(function DualZoneAtmosphere() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const progress = Math.min(window.scrollY / maxScroll, 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const transitionPoint = 0.4
  const rocOpacity = scrollProgress < transitionPoint ? 1 : Math.max(0, 1 - (scrollProgress - transitionPoint) / 0.2)
  const ftOpacity = scrollProgress < transitionPoint ? 0 : Math.min(1, (scrollProgress - transitionPoint) / 0.2)

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Base dark */}
      <div style={{ position: 'absolute', inset: 0, background: WC3.bgVoid }} />

      {/* REIGN OF CHAOS atmosphere */}
      <div style={{ position: 'absolute', inset: 0, opacity: rocOpacity, transition: 'opacity 0.5s ease' }}>
        <ReignOfChaosAtmosphere />
      </div>

      {/* FROZEN THRONE atmosphere */}
      <div style={{ position: 'absolute', inset: 0, opacity: ftOpacity, transition: 'opacity 0.5s ease' }}>
        <FrozenThroneAtmosphere />
      </div>

      {/* Vignette (always visible) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
})

// =============================================================================
// REIGN OF CHAOS ATMOSPHERE - Dark apocalyptic sky with infernals raining down
// =============================================================================

const ReignOfChaosAtmosphere = memo(function ReignOfChaosAtmosphere() {
  const [lightningActive, setLightningActive] = useState(false)
  const [lightningX, setLightningX] = useState(50)
  const [cloudGlow, setCloudGlow] = useState(0)
  const [ambientFlash, setAmbientFlash] = useState(false)
  const [ambientFlashX, setAmbientFlashX] = useState(30)
  // Cloud zones for realistic sequential flashing (left, center-left, center, center-right, right)
  const cloudZones = useMemo(() => [
    { x: 12, y: 25, spread: 15 },   // left
    { x: 30, y: 35, spread: 18 },   // center-left
    { x: 50, y: 28, spread: 20 },   // center
    { x: 70, y: 32, spread: 18 },   // center-right
    { x: 88, y: 30, spread: 15 },   // right
  ], [])
  const [activeZone, setActiveZone] = useState(0)
  const lastZoneRef = useRef(-1)
  // Occasional falling meteor (every 8-15 seconds, like old golem spawn cadence)
  const [fallingMeteor, setFallingMeteor] = useState<{
    id: number
    startX: number
    direction: 'left' | 'right'
    active: boolean
  } | null>(null)

  // Right-side golem spawn sequence: meteor → explosion → assembly → final
  const [golemPhase, setGolemPhase] = useState<'waiting' | 'meteor' | 'explosion' | 'assembling' | 'final'>('waiting')
  const [hideAssembly, setHideAssembly] = useState(false)

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    // Phase 1: Meteor falls (starts after 2s, lasts 1.5s)
    timeouts.push(setTimeout(() => setGolemPhase('meteor'), 2000))

    // Phase 2: Explosion on impact (after meteor lands)
    timeouts.push(setTimeout(() => setGolemPhase('explosion'), 3500))

    // Phase 3: Rocks start assembling (after explosion)
    timeouts.push(setTimeout(() => setGolemPhase('assembling'), 4200))

    // Phase 4: Final detailed golem appears (assembly stays visible)
    timeouts.push(setTimeout(() => setGolemPhase('final'), 6500))

    // Phase 5: Hide assembly after final is fully visible (0.5s overlap)
    timeouts.push(setTimeout(() => setHideAssembly(true), 7000))

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [])

  // Occasional meteor spawn (every 8-15 seconds)
  useEffect(() => {
    let meteorId = 0
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const spawnMeteor = () => {
      if (!isActive) return
      const id = meteorId++
      const startX = 15 + Math.random() * 70
      const direction = Math.random() > 0.5 ? 'left' : 'right'

      setFallingMeteor({ id, startX, direction: direction as 'left' | 'right', active: true })

      // Clear meteor after animation (4s)
      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setFallingMeteor(null)
      }, 4000))
    }

    const scheduleNext = () => {
      if (!isActive) return
      // Every 8-15 seconds (like old golem cadence)
      const delay = 8000 + Math.random() * 7000
      timeouts.push(setTimeout(() => {
        spawnMeteor()
        scheduleNext()
      }, delay))
    }

    // First meteor after 2 seconds
    timeouts.push(setTimeout(spawnMeteor, 2000))
    scheduleNext()

    return () => {
      isActive = false
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [])

  // Ambient thunder flashes - realistic sequential cloud zone flashing
  useEffect(() => {
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const triggerAmbientFlash = () => {
      if (!isActive) return

      // Pick a cloud zone different from the last one
      let newZone = Math.floor(Math.random() * cloudZones.length)
      while (newZone === lastZoneRef.current && cloudZones.length > 1) {
        newZone = Math.floor(Math.random() * cloudZones.length)
      }
      lastZoneRef.current = newZone

      const zone = cloudZones[newZone]
      // Add slight variation within the zone
      const flashX = zone.x + (Math.random() - 0.5) * zone.spread * 0.5
      setAmbientFlashX(flashX)
      setActiveZone(newZone)
      setAmbientFlash(true)

      // Quick double-flash effect (realistic lightning flicker)
      timeouts.push(setTimeout(() => setAmbientFlash(false), 80))
      timeouts.push(setTimeout(() => setAmbientFlash(true), 120))
      timeouts.push(setTimeout(() => setAmbientFlash(false), 200))

      // Sometimes chain to adjacent zone (30% chance)
      if (Math.random() > 0.7) {
        const adjacentZone = newZone + (Math.random() > 0.5 ? 1 : -1)
        if (adjacentZone >= 0 && adjacentZone < cloudZones.length) {
          const adjZone = cloudZones[adjacentZone]
          timeouts.push(setTimeout(() => {
            setAmbientFlashX(adjZone.x + (Math.random() - 0.5) * 8)
            setActiveZone(adjacentZone)
            setAmbientFlash(true)
          }, 300))
          timeouts.push(setTimeout(() => setAmbientFlash(false), 400))
        }
      }
    }

    const scheduleAmbientFlash = () => {
      if (!isActive) return
      // Flash every 2-5 seconds for frequent storm effect
      const delay = 2000 + Math.random() * 3000
      timeouts.push(setTimeout(() => {
        triggerAmbientFlash()
        scheduleAmbientFlash()
      }, delay))
    }

    // Start after a short delay
    timeouts.push(setTimeout(scheduleAmbientFlash, 800))

    return () => {
      isActive = false
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [cloudZones])

  // Rain drops - longer animation cycles = fewer repaints = better performance
  // Reduced particle counts for performance
  const raindrops = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 130 - 15,
      delay: Math.random() * -4,
      duration: 2.5 + Math.random() * 1.5, // 2.5-4s (was 0.6-0.9s) - much fewer repaints
      length: 25 + Math.random() * 30,
    })),
    []
  )

  // Wind streaks - reduced for performance
  const rainWindStreaks = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      y: 15 + i * 16,
      delay: Math.random() * -6,
      duration: 2 + Math.random() * 1.5,
      length: 100 + Math.random() * 150,
      thickness: 1 + Math.random() * 0.5,
    })),
    []
  )

  return (
    <>
      {/* GREEN-BROWN tinted stormy sky - matching WC3 RoC aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          #0a1812 0%,
          #0d1f15 10%,
          #102518 20%,
          #152d1c 35%,
          #1a3520 50%,
          #182a1a 65%,
          #152518 80%,
          #101a12 90%,
          #080f0a 100%)`
      }} />

      {/* === WC3 ROC MENU BACKGROUND - Grassy battlefield with war debris === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 1000 850" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Grass ground gradient */}
          <linearGradient id="grassGround" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3520" />
            <stop offset="50%" stopColor="#152a18" />
            <stop offset="100%" stopColor="#0d1a0f" />
          </linearGradient>
          {/* Water/puddle gradient */}
          <linearGradient id="waterPuddle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3040" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d1820" stopOpacity="0.8" />
          </linearGradient>
          {/* Banner red */}
          <linearGradient id="bannerRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa2020" />
            <stop offset="50%" stopColor="#881515" />
            <stop offset="100%" stopColor="#661010" />
          </linearGradient>
          {/* Shield orange */}
          <linearGradient id="shieldOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cc8844" />
            <stop offset="50%" stopColor="#aa6633" />
            <stop offset="100%" stopColor="#885522" />
          </linearGradient>
          {/* Metal */}
          <linearGradient id="metalGray" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a6a65" />
            <stop offset="50%" stopColor="#4a4a45" />
            <stop offset="100%" stopColor="#3a3a35" />
          </linearGradient>
          {/* Wood pole */}
          <linearGradient id="woodBrown" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a3520" />
            <stop offset="50%" stopColor="#3a2815" />
            <stop offset="100%" stopColor="#2a1a0a" />
          </linearGradient>
          {/* Dirt patch gradient */}
          <radialGradient id="dirtPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d3020" />
            <stop offset="60%" stopColor="#2a2218" />
            <stop offset="100%" stopColor="#1a1812" stopOpacity="0" />
          </radialGradient>
          {/* Sandy patch gradient */}
          <radialGradient id="sandPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a4030" />
            <stop offset="50%" stopColor="#3a3528" />
            <stop offset="100%" stopColor="#2a2820" stopOpacity="0" />
          </radialGradient>
          {/* Dead grass gradient - brownish green */}
          <radialGradient id="deadGrass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3020" />
            <stop offset="70%" stopColor="#252818" />
            <stop offset="100%" stopColor="#1a2015" stopOpacity="0" />
          </radialGradient>
          <filter id="rocDistantBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <filter id="rocMidBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="felGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          {/* Ground fade - green tint to blend with sky */}
          <linearGradient id="rocGroundFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1a15" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#0d2018" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* === DENSE STORM CLOUDS - Top 15-20% only === */}
        <g opacity="0.95">
          {/* Dense cloud bank - concentrated at very top */}
          <ellipse cx="150" cy="20" rx="250" ry="50" fill="#030603" />
          <ellipse cx="400" cy="15" rx="300" ry="45" fill="#020502" />
          <ellipse cx="700" cy="25" rx="280" ry="55" fill="#030603" />
          <ellipse cx="950" cy="18" rx="220" ry="48" fill="#020502" />
          {/* Second layer - slightly lower */}
          <ellipse cx="80" cy="55" rx="180" ry="40" fill="#040804" />
          <ellipse cx="300" cy="48" rx="200" ry="42" fill="#050a05" />
          <ellipse cx="550" cy="52" rx="220" ry="45" fill="#040804" />
          <ellipse cx="800" cy="50" rx="190" ry="40" fill="#050a05" />
          {/* Bottom edge - wispy, max ~120px from top (12% of 1000) */}
          <ellipse cx="200" cy="85" rx="140" ry="30" fill="#060b06" opacity="0.7" />
          <ellipse cx="500" cy="80" rx="180" ry="35" fill="#050a05" opacity="0.6" />
          <ellipse cx="750" cy="90" rx="150" ry="28" fill="#060b06" opacity="0.5" />
        </g>

        {/* === DISTANT ROCKY CLIFF SILHOUETTE - Gray, far background === */}
        <g filter="url(#rocDistantBlur)" opacity="0.7">
          {/* Main cliff shape - like WC3 reference */}
          <path d="M550,180 L600,120 L650,140 L720,80 L780,110 L850,90 L920,130 L1000,100 L1000,350 L550,350 Z" fill={WC3.roc.rockSilhouette} />
          <path d="M600,150 L640,130 L680,145 L720,100 L750,120" stroke={WC3.roc.rockDistant} strokeWidth="3" fill="none" opacity="0.4" />
        </g>

        {/* === ATMOSPHERIC FOG LAYER - Creates depth === */}
        <rect x="0" y="150" width="1000" height="200" fill="url(#rocGroundFade)" opacity="0.5" />

        {/* === GREENISH EARTHY GROUND - Like flagpole dirt === */}
        <g>
          {/* Main ground plane - greenish earth tones */}
          <ellipse cx="500" cy="650" rx="700" ry="280" fill={WC3.roc.groundDark} />
          <ellipse cx="500" cy="700" rx="650" ry="250" fill={WC3.roc.groundGreen} opacity="0.9" />
          <ellipse cx="500" cy="720" rx="600" ry="220" fill={WC3.roc.groundMid} opacity="0.7" />
          {/* Ground variation patches */}
          <ellipse cx="200" cy="550" rx="120" ry="50" fill={WC3.roc.groundDark} opacity="0.6" />
          <ellipse cx="600" cy="520" rx="150" ry="60" fill={WC3.roc.groundGreen} opacity="0.5" />
          <ellipse cx="850" cy="580" rx="100" ry="45" fill={WC3.roc.groundMid} opacity="0.5" />
        </g>

        {/* === WATER PUDDLES - Reflective dark areas === */}
        <g>
          <ellipse cx="150" cy="720" rx="100" ry="40" fill={WC3.roc.waterDark} opacity="0.7" />
          <ellipse cx="155" cy="715" rx="70" ry="25" fill="#253540" opacity="0.5" />
          <ellipse cx="400" cy="680" rx="80" ry="35" fill={WC3.roc.waterDark} opacity="0.6" />
        </g>

        {/* === OLIVE-GREEN GRASS - WC3 Style, clustered naturally === */}
        <g>
          {Array.from({ length: 80 }, (_, i) => {
            // Create natural clusters - grass grows in clumps (reduced for perf)
            const clusterIndex = Math.floor(i / 5) // 16 clusters of 5 blades
            const bladeInCluster = i % 5

            // Base cluster positions spread across foreground
            const clusterX = 30 + (clusterIndex % 8) * 115 + ((clusterIndex * 17) % 40)
            const clusterY = 640 + Math.floor(clusterIndex / 8) * 50 + ((clusterIndex * 13) % 30)

            // Individual blade offset from cluster center
            const x = clusterX + (bladeInCluster - 2) * 4 + ((i * 7) % 5)
            const baseY = clusterY + ((bladeInCluster * 3) % 8)

            // Perspective factor for size
            const perspectiveFactor = Math.max(0, (baseY - 600) / 250)

            // Taller grass in foreground, varied heights within cluster
            const baseHeight = 30 + perspectiveFactor * 50
            const heightVariation = ((bladeInCluster * 7 + i * 3) % 20) - 10
            const height = baseHeight + heightVariation

            // Stroke width - thinner far, thicker near
            const strokeW = 1.0 + perspectiveFactor * 1.5 + ((bladeInCluster % 2) * 0.3)

            // Opacity - fainter far, stronger near
            const opacity = 0.45 + perspectiveFactor * 0.45

            // Natural curve - all blades in cluster curve similarly (wind)
            const windDirection = ((clusterIndex % 3) - 1) * 0.6
            const baseCurve = windDirection * (5 + perspectiveFactor * 8)
            const bladeCurve = baseCurve + ((bladeInCluster - 2) * 2)

            // OLIVE-GREEN grass colors (like WC3 reference)
            const colors = [
              WC3.roc.grassOlive,    // #5a5a30 - main olive
              WC3.roc.grassYellow,   // #6a6535 - yellowish
              WC3.roc.grassDark,     // #4a4a28 - darker
              WC3.roc.grassLight,    // #7a7040 - highlights
              '#555530',             // mid olive
              '#656535',             // yellow-olive
            ]
            const color = colors[(i + bladeInCluster) % 6]

            // Animate some foreground blades
            const animated = bladeInCluster === 2 && perspectiveFactor > 0.6 && clusterIndex % 4 === 0

            return (
              <path
                key={`grass${i}`}
                d={`M${x},${baseY} Q${x + bladeCurve * 0.7},${baseY - height * 0.55} ${x + bladeCurve},${baseY - height}`}
                stroke={color}
                strokeWidth={strokeW}
                fill="none"
                strokeLinecap="round"
                opacity={opacity}
                style={animated ? {
                  transformOrigin: `${x}px ${baseY}px`,
                  animation: `grassBlade ${2.0 + (clusterIndex % 3) * 0.4}s ease-in-out infinite`,
                } : undefined}
              />
            )
          })}
        </g>

        {/* === CATTAILS/REEDS near water (like WC3) === */}
        <g>
          {[90, 120, 155, 190, 370, 400, 440].map((x, i) => (
            <g key={`reed${i}`}>
              {/* Stem */}
              <path
                d={`M${x},${740 - i * 6} Q${x + 1},${700 - i * 6} ${x + 2},${660 - i * 8}`}
                stroke="#3a3520"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Brown bulrush head */}
              <ellipse cx={x + 2} cy={652 - i * 10} rx="4" ry="12" fill="#2a1a10" />
              <ellipse cx={x + 2} cy={650 - i * 10} rx="3" ry="10" fill="#3a2a18" />
            </g>
          ))}
        </g>

        {/* === MID-GROUND ELEMENTS === */}
        <g filter="url(#rocMidBlur)" opacity="0.7">
          {/* Broken wooden structure left (like WC3 banner frame) */}
          <g transform="translate(280, 380)">
            <rect x="0" y="0" width="8" height="120" fill="#3a2815" transform="rotate(-8)" />
            <rect x="60" y="-20" width="6" height="100" fill="#2a1a0a" transform="rotate(12)" />
            <rect x="-10" y="40" width="80" height="6" fill="#3a2815" transform="rotate(-5)" />
          </g>
          {/* Distant sword in ground */}
          <g transform="translate(520, 420)">
            <rect x="0" y="0" width="4" height="50" fill="#5a5a55" transform="rotate(-10)" />
            <rect x="-8" y="45" width="20" height="4" fill="#4a4a45" />
          </g>
        </g>

        {/* === FOREGROUND ROCKS - Small, warmer brown === */}
        <g opacity="0.8">
          <polygon points="50,780 70,755 95,770 110,780" fill="#4a4035" />
          <polygon points="900,770 920,745 945,760 960,775" fill="#4a4035" />
          <polygon points="300,800 325,775 350,785" fill="#3a3025" opacity="0.7" />
        </g>

        {/* === MID LAYER - Remaining stone pillar === */}
        <g filter="url(#rocMidBlur)" opacity="0.5">
          <g transform="translate(650, 380)">
            <rect x="0" y="0" width="30" height="100" fill={WC3.roc.rockDistant} />
          </g>
        </g>

        {/* === WAR DEBRIS - Weapons and items scattered on battlefield === */}
        <g>
          {/* === TOP-GROUND DEBRIS (y=380-450) - Distant battlefield debris === */}

          {/* Distant fallen banner - top left */}
          <g transform="translate(80, 400) rotate(12)">
            <rect x="0" y="-1" width="35" height="2" fill="#3a2a18" opacity="0.35" />
            <polygon points="35,-8 50,-5 48,5 35,8" fill="#552222" opacity="0.3" />
          </g>

          {/* Distant broken cart wheel - top center-left */}
          <g transform="translate(250, 420)">
            <ellipse cx="0" cy="0" rx="18" ry="7" fill="#3a3028" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="14" ry="5" fill="none" stroke="#2a2018" strokeWidth="2" opacity="0.3" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#2a2018" strokeWidth="1.5" opacity="0.25" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#2a2018" strokeWidth="1.5" opacity="0.25" />
          </g>

          {/* Distant pile of bodies (shadow) - top center */}
          <ellipse cx="450" cy="390" rx="50" ry="15" fill="#151812" opacity="0.25" />
          <ellipse cx="470" cy="385" rx="30" ry="10" fill="#1a1a15" opacity="0.2" />

          {/* Distant catapult wreckage - top right */}
          <g transform="translate(700, 410) rotate(-8)">
            <rect x="0" y="0" width="40" height="4" fill="#3a2a18" opacity="0.3" />
            <rect x="35" y="-12" width="4" height="16" fill="#3a2a18" opacity="0.25" />
            <polygon points="8,-3 15,-8 22,-3" fill="#2a2018" opacity="0.25" />
          </g>

          {/* Distant rocks/boulders - top scattered */}
          <polygon points="150,430 168,418 185,428" fill="#252220" opacity="0.3" />
          <polygon points="550,400 570,388 590,398" fill="#202018" opacity="0.25" />
          <polygon points="850,420 870,408 888,418" fill="#252220" opacity="0.3" />

          {/* Distant arrows in ground - top */}
          <g transform="translate(320, 395) rotate(-75)">
            <rect x="0" y="0" width="18" height="1.5" fill="#3a2a18" opacity="0.3" />
            <polygon points="18,-2 23,0 18,2" fill="#4a4a45" opacity="0.25" />
          </g>
          <g transform="translate(620, 405) rotate(-82)">
            <rect x="0" y="0" width="15" height="1.5" fill="#3a2a18" opacity="0.25" />
            <polygon points="15,-2 20,0 15,2" fill="#4a4a45" opacity="0.2" />
          </g>

          {/* === MID-GROUND DEBRIS (y=450-650) - More detailed === */}

          {/* Broken sword with blood stain - mid left */}
          <g transform="translate(180, 520) rotate(-15)">
            <ellipse cx="5" cy="5" rx="12" ry="6" fill="#2a1515" opacity="0.4" />
            <rect x="-2" y="-35" width="4" height="32" fill="#5a5a55" opacity="0.75" />
            <rect x="-1" y="-33" width="2" height="28" fill="#7a7a75" opacity="0.5" />
            <polygon points="-3,-35 0,-44 3,-35" fill="#6a6a65" opacity="0.75" />
            <rect x="-6" y="-5" width="12" height="5" fill="#4a4a45" opacity="0.75" />
            <rect x="-3" y="0" width="6" height="8" fill="#3a2815" opacity="0.7" />
          </g>

          {/* Detailed shield lying flat - mid center-left */}
          <g transform="translate(320, 560)">
            <ellipse cx="2" cy="3" rx="38" ry="16" fill="#1a1815" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="38" ry="15" fill="#4a4540" opacity="0.65" />
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="#5a5550" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill="#3a3530" opacity="0.6" />
            <path d="M-25,-8 L22,10" stroke="#2a2520" strokeWidth="3" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="36" ry="14" fill="none" stroke="#3a3530" strokeWidth="2" opacity="0.5" />
          </g>

          {/* Broken spear with detailed shaft - mid center */}
          <g transform="translate(480, 510) rotate(25)">
            <ellipse cx="25" cy="4" rx="28" ry="5" fill="#1a1815" opacity="0.25" />
            <rect x="0" y="-2" width="55" height="4" fill="#4a3a28" opacity="0.65" />
            <rect x="2" y="-1" width="50" height="2" fill="#5a4a38" opacity="0.5" />
            <polygon points="55,-4 65,0 55,4" fill="#5a5a55" opacity="0.6" />
          </g>

          {/* War hammer - mid center-right */}
          <g transform="translate(600, 530) rotate(-20)">
            <ellipse cx="15" cy="5" rx="20" ry="5" fill="#1a1815" opacity="0.25" />
            <rect x="0" y="-2" width="35" height="4" fill="#4a3a28" opacity="0.6" />
            <rect x="30" y="-10" width="12" height="20" fill="#5a5a55" opacity="0.6" />
            <rect x="31" y="-8" width="10" height="16" fill="#6a6a65" opacity="0.4" />
          </g>

          {/* Detailed axe - mid right */}
          <g transform="translate(680, 540) rotate(-35)">
            <ellipse cx="12" cy="5" rx="15" ry="4" fill="#1a1815" opacity="0.25" />
            <rect x="0" y="-2" width="24" height="4" fill="#4a3a28" opacity="0.65" />
            <rect x="1" y="-1" width="22" height="2" fill="#5a4a38" opacity="0.4" />
            <path d="M22,-8 Q32,-4 30,0 Q32,4 22,8 L22,-8" fill="#5a5a55" opacity="0.65" />
            <path d="M23,-6 Q29,-3 28,0 Q29,3 23,6" fill="#7a7a75" opacity="0.4" />
          </g>

          {/* Detailed helmet with dent - mid far right */}
          <g transform="translate(820, 580)">
            <ellipse cx="0" cy="4" rx="18" ry="6" fill="#1a1815" opacity="0.3" />
            <ellipse cx="0" cy="0" rx="18" ry="8" fill="#5a5a55" opacity="0.55" />
            <ellipse cx="0" cy="-3" rx="14" ry="6" fill="#6a6a65" opacity="0.5" />
            <ellipse cx="5" cy="-1" rx="5" ry="3" fill="#4a4a45" opacity="0.4" />
            <path d="M-8,-6 Q-5,-10 2,-8" stroke="#3a3a35" strokeWidth="1.5" fill="none" opacity="0.4" />
          </g>

          {/* More rocks - mid ground scattered */}
          <polygon points="250,500 268,486 288,498" fill="#2a2520" opacity="0.5" />
          <polygon points="252,502 266,495 275,503" fill="#353028" opacity="0.35" />
          <polygon points="420,550 440,536 460,548" fill="#252220" opacity="0.45" />
          <polygon points="580,490 598,478 618,490" fill="#2a2520" opacity="0.45" />
          <polygon points="750,520 765,508 782,518" fill="#252220" opacity="0.5" />
          <polygon points="900,540 918,528 935,538" fill="#202018" opacity="0.4" />

          {/* Fallen warrior shadows with armor glint - mid ground */}
          <ellipse cx="380" cy="540" rx="40" ry="14" fill="#151812" opacity="0.4" />
          <ellipse cx="385" cy="538" rx="8" ry="3" fill="#3a3a35" opacity="0.2" />
          <ellipse cx="620" cy="505" rx="35" ry="12" fill="#151812" opacity="0.35" />
          <ellipse cx="615" cy="503" rx="6" ry="2" fill="#4a4a45" opacity="0.15" />

          {/* Multiple arrows stuck in ground - mid */}
          <g transform="translate(550, 530) rotate(-80)">
            <rect x="0" y="-1" width="28" height="2" fill="#4a3a28" opacity="0.65" />
            <polygon points="28,-3 36,0 28,3" fill="#5a5a55" opacity="0.6" />
            <polygon points="0,-2 -4,0 0,2" fill="#3a3028" opacity="0.5" />
          </g>
          <g transform="translate(530, 545) rotate(-72)">
            <rect x="0" y="-1" width="22" height="1.5" fill="#3a2a18" opacity="0.55" />
            <polygon points="22,-2 28,0 22,2" fill="#4a4a45" opacity="0.5" />
          </g>

          {/* Broken shield with emblem - mid left */}
          <g transform="translate(140, 570)">
            <ellipse cx="2" cy="3" rx="26" ry="11" fill="#1a1815" opacity="0.3" />
            <ellipse cx="0" cy="0" rx="26" ry="10" fill="#4a3a30" opacity="0.55" />
            <ellipse cx="0" cy="0" rx="20" ry="8" fill="#5a4a40" opacity="0.5" />
            <circle cx="0" cy="0" r="6" fill="#3a2a20" opacity="0.5" />
            <path d="M-18,-5 L20,7" stroke="#2a2018" strokeWidth="3" opacity="0.45" />
          </g>

          {/* === FOREGROUND DEBRIS (y=700-800) - Original positions === */}

          {/* === SWORD 1 - Stuck in ground at angle (left side) === */}
          <g transform="translate(120, 730) rotate(-25)">
            <rect x="-2" y="-60" width="4" height="55" fill="#5a5a55" />
            <rect x="-1" y="-58" width="2" height="50" fill="#7a7a75" />
            <rect x="-8" y="-8" width="16" height="6" fill="#4a4a45" rx="1" />
            <rect x="-3" y="-2" width="6" height="12" fill="#3a2815" />
            <ellipse cx="0" cy="8" rx="4" ry="2" fill="#2a1a0a" />
          </g>

          {/* === AXE 1 - Lying flat on ground (center-left) === */}
          <g transform="translate(350, 765) rotate(15)">
            <rect x="0" y="-3" width="50" height="5" fill="#4a3520" rx="2" />
            <rect x="1" y="-2" width="48" height="3" fill="#5a4530" />
            <path d="M48,-12 Q58,-8 55,0 Q58,8 48,12 L48,-12" fill="#5a5a55" />
            <path d="M49,-10 Q56,-6 54,0 Q56,6 49,10" fill="#7a7a75" stroke="none" />
            <ellipse cx="25" cy="4" rx="25" ry="5" fill="#1a1510" opacity="0.3" />
          </g>

          {/* === SPEAR - Broken, lying on ground (right side) === */}
          <g transform="translate(720, 750) rotate(-8)">
            <rect x="0" y="-2" width="80" height="4" fill="#4a3a28" />
            <rect x="1" y="-1" width="78" height="2" fill="#5a4a38" />
            <polygon points="80,-5 95,0 80,5" fill="#6a6a65" />
            <polygon points="81,-3 92,0 81,3" fill="#8a8a85" />
            <ellipse cx="40" cy="5" rx="40" ry="4" fill="#1a1510" opacity="0.25" />
          </g>

          {/* === SWORD 2 - Broken blade on ground (far right) === */}
          <g transform="translate(880, 760) rotate(35)">
            <rect x="-2" y="-30" width="4" height="25" fill="#5a5a55" />
            <polygon points="-2,-30 0,-38 2,-30" fill="#6a6a65" />
            <rect x="-6" y="-8" width="12" height="5" fill="#4a4a45" />
            <ellipse cx="0" cy="3" rx="10" ry="3" fill="#1a1510" opacity="0.3" />
          </g>

          {/* === AXE 2 - Small hand axe (mid ground) === */}
          <g transform="translate(480, 755) rotate(-40)">
            <rect x="0" y="-2" width="25" height="4" fill="#4a3520" rx="1" />
            <path d="M24,-8 Q32,-4 30,0 Q32,4 24,8 L24,-8" fill="#5a5a55" />
            <ellipse cx="12" cy="4" rx="12" ry="3" fill="#1a1510" opacity="0.25" />
          </g>

          {/* === ORANGE SHIELD - Lying flat on ground (center-right) === */}
          <g transform="translate(620, 720)">
            <ellipse cx="0" cy="0" rx="70" ry="28" fill="url(#shieldOrange)" />
            <ellipse cx="0" cy="0" rx="60" ry="23" fill="#bb7744" />
            <ellipse cx="0" cy="0" rx="20" ry="9" fill="#aa6633" />
            <ellipse cx="-4" cy="-2" rx="12" ry="5" fill="#cc9955" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="68" ry="27" fill="none" stroke="#664422" strokeWidth="3" />
          </g>

          {/* === ROUND SHIELD 2 - Smaller, darker (left side) === */}
          <g transform="translate(80, 780)">
            <ellipse cx="0" cy="0" rx="45" ry="18" fill="#4a4540" />
            <ellipse cx="0" cy="0" rx="38" ry="15" fill="#5a5550" />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill="#3a3530" />
            <ellipse cx="0" cy="0" rx="43" ry="17" fill="none" stroke="#3a3530" strokeWidth="2" />
          </g>

          {/* === HELMET - Dented, on ground === */}
          <g transform="translate(550, 775)">
            <ellipse cx="0" cy="0" rx="20" ry="10" fill="#5a5a55" />
            <ellipse cx="0" cy="-4" rx="16" ry="8" fill="#6a6a65" />
            <ellipse cx="0" cy="3" rx="18" ry="5" fill="#1a1510" opacity="0.3" />
          </g>

          {/* === FALLEN WARRIOR SILHOUETTES === */}
          <ellipse cx="280" cy="755" rx="45" ry="15" fill="#1a2018" opacity="0.5" />
          <ellipse cx="550" cy="740" rx="40" ry="14" fill="#1a2018" opacity="0.4" />

          {/* === WATER PUDDLE - Reflective blue === */}
          <g transform="translate(850, 790)">
            <ellipse cx="0" cy="0" rx="90" ry="35" fill="url(#waterPuddle)" />
            <ellipse cx="-8" cy="-4" rx="70" ry="25" fill="#1a3040" opacity="0.4" />
            <ellipse cx="-25" cy="-8" rx="20" ry="6" fill="#253545" opacity="0.3" />
          </g>

          {/* === ROCKS - Earthy tones === */}
          <polygon points="180,795 195,780 215,792" fill="#353028" opacity="0.5" />
          <polygon points="380,798 398,785 418,795" fill="#302a22" opacity="0.4" />
          <polygon points="760,796 775,783 792,794" fill="#302a22" opacity="0.4" />

          {/* === HORDE WAR BANNER - Hidden here, rendered as fixed element above infernals === */}
          <g transform="translate(200, 520) rotate(-10)" className="war-banner" opacity="0">
            {/* Dirt mound at pole base - dark brownish like visible flagpole */}
            <ellipse cx="6" cy="235" rx="25" ry="10" fill="#0c0f0a" />
            <ellipse cx="6" cy="233" rx="20" ry="8" fill="#12150f" />
            <ellipse cx="6" cy="231" rx="12" ry="5" fill="#181a14" />
            {/* Small dirt clumps around base */}
            <ellipse cx="-12" cy="238" rx="8" ry="4" fill="#0c0f0a" opacity="0.7" />
            <ellipse cx="22" cy="240" rx="10" ry="5" fill="#12150f" opacity="0.6" />
            {/* Grass tufts growing from dirt - olive-green */}
            <path d="M-8,232 Q-10,222 -6,218" stroke="#5a5a30" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M18,234 Q22,224 19,220" stroke="#6a6535" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M-15,236 Q-18,228 -14,225" stroke="#4a4a28" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Banner pole */}
            <rect x="0" y="0" width="12" height="230" fill="#3a2815" />
            <rect x="2" y="0" width="8" height="230" fill="#4a3520" />
            <rect x="4" y="5" width="4" height="220" fill="#5a4530" opacity="0.5" />
            {/* Pole top spike */}
            <polygon points="6,-30 -4,5 16,5" fill="#5a4a35" />
            <polygon points="6,-25 0,3 12,3" fill="#6a5a45" />
            {/* Banner fabric with wave columns - Horde skull centered and sliced across columns */}
            <g transform="translate(12, 15)" className="banner-fabric">
              {/* Define clipping regions for skull parts - skull centered at x=44 */}
              <defs>
                <clipPath id="bannerCol1"><rect x="0" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol2"><rect x="18" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol3"><rect x="36" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol4"><rect x="54" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol5"><rect x="72" y="0" width="18" height="150" /></clipPath>
              </defs>

              {/* Horde skull definition - complete skull to be clipped by each column */}
              {/* Skull is centered at x=44, y=70 relative to banner-fabric */}
              {[
                { id: 1, x: 0, w: 18, delay: '0s', fill: '#aa2525', yOff: 0 },
                { id: 2, x: 18, w: 18, delay: '0.12s', fill: '#992222', yOff: 2 },
                { id: 3, x: 36, w: 18, delay: '0.24s', fill: '#882020', yOff: 4 },
                { id: 4, x: 54, w: 18, delay: '0.36s', fill: '#771818', yOff: 6 },
                { id: 5, x: 72, w: 15, delay: '0.48s', fill: '#661515', yOff: 8 },
              ].map((col) => (
                <g key={col.id} style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: col.delay }}>
                  {/* Fabric column */}
                  <rect x={col.x} y={col.yOff} width={col.w} height={150 - col.yOff} fill={col.fill} />
                  {/* Skull slice - clipped to this column */}
                  <g clipPath={`url(#bannerCol${col.id})`}>
                    <g transform="translate(44, 70)">
                      {/* Orc skull - brutish with lower jaw tusks */}
                      {/* Skull outline - dark embossed */}
                      <ellipse cx="0" cy="-2" rx="24" ry="16" fill="#1a0808" />
                      {/* Skull main shape - wider, flatter */}
                      <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#2a1010" />
                      {/* Brow ridge - pronounced */}
                      <path d="M-18,-8 Q-10,-14 0,-12 Q10,-14 18,-8" stroke="#3a1818" strokeWidth="4" fill="none" />
                      {/* Left eye socket - angular, deep */}
                      <path d="M-12,-6 L-8,-10 L-2,-8 L-4,-2 L-10,-2 Z" fill="#0a0404" />
                      {/* Left eye glow - fel green hint */}
                      <ellipse cx="-7" cy="-5" rx="2" ry="1.5" fill="#2a3320" />
                      {/* Right eye socket - angular, deep */}
                      <path d="M12,-6 L8,-10 L2,-8 L4,-2 L10,-2 Z" fill="#0a0404" />
                      {/* Right eye glow - fel green hint */}
                      <ellipse cx="7" cy="-5" rx="2" ry="1.5" fill="#2a3320" />
                      {/* Nose - just two holes */}
                      <ellipse cx="-2" cy="2" rx="2" ry="3" fill="#0a0404" />
                      <ellipse cx="2" cy="2" rx="2" ry="3" fill="#0a0404" />
                      {/* Jaw - heavy, angular */}
                      <path d="M-16,6 L-14,14 L-8,16 L0,14 L8,16 L14,14 L16,6" fill="#2a1010" />
                      {/* Lower tusks - pointing UP from jaw, darker bone color */}
                      <path d="M-12,12 Q-14,4 -10,-2" stroke="#4a3828" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      <path d="M12,12 Q14,4 10,-2" stroke="#4a3828" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      {/* Tusk highlights */}
                      <path d="M-11,10 Q-13,5 -10,0" stroke="#5a4838" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M11,10 Q13,5 10,0" stroke="#5a4838" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </g>
                  </g>
                </g>
              ))}
              {/* Banner edge fraying */}
              <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill="#2a0a0a" style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.55s' }} />
            </g>
            {/* Pole shadow */}
            <ellipse cx="6" cy="235" rx="15" ry="5" fill="#0a0a08" opacity="0.4" />
          </g>
        </g>

        {/* Ground plane fade */}
        <rect x="0" y="200" width="1000" height="650" fill="url(#rocGroundFade)" />

        {/* === PERSPECTIVE LINES - subtle depth like FT === */}
        <g opacity="0.04">
          {[-60, -35, -15, 0, 15, 35, 60].map((offset, i) => (
            <line key={i} x1={500 + offset * 2} y1="180" x2={offset < 0 ? -400 : offset > 0 ? 1400 : 500} y2="850" stroke="#201820" strokeWidth="1" />
          ))}
        </g>
      </svg>

      {/* === STORMY ATMOSPHERE GLOW - green-tinted like WC3 === */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '50%',
        height: '35%',
        background: 'radial-gradient(ellipse at 30% 40%, #1a3a2512 0%, #0d251806 40%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '5%',
        width: '45%',
        height: '30%',
        background: 'radial-gradient(ellipse at 60% 50%, #2a4a3010 0%, #1a3a2506 50%, transparent 80%)',
        filter: 'blur(55px)',
        pointerEvents: 'none',
      }} />

      {/* Vignette - dark green edges, focused center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, transparent 35%, rgba(5,15,8,0.4) 70%, rgba(0,8,4,0.7) 100%),
          radial-gradient(ellipse 60% 40% at 50% 30%, #0d251810 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Volumetric storm clouds - DARK GREENISH, top 18% only */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '18%' }} viewBox="0 0 1000 180" preserveAspectRatio="none">
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          <filter id="cloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <radialGradient id="cloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#253525" />
            <stop offset="60%" stopColor="#182818" />
            <stop offset="100%" stopColor="#0c1a0c" />
          </radialGradient>
        </defs>
        {/* Dense cloud bank - DARK GREENISH tones */}
        <g filter="url(#cloudBlur)" opacity="0.9">
          <ellipse cx="100" cy="40" rx="200" ry="60" fill="#152515" />
          <ellipse cx="350" cy="30" rx="250" ry="55" fill="#122012" />
          <ellipse cx="600" cy="35" rx="280" ry="65" fill="#152515" />
          <ellipse cx="850" cy="40" rx="220" ry="55" fill="#122012" />
        </g>
        {/* Secondary layer - slightly brighter green */}
        <g filter="url(#cloudBlurLight)" opacity="0.9">
          <ellipse cx="200" cy="70" rx="180" ry="45" fill="url(#cloudCore)" />
          <ellipse cx="450" cy="65" rx="200" ry="50" fill="url(#cloudCore)" />
          <ellipse cx="700" cy="72" rx="190" ry="48" fill="url(#cloudCore)" />
          <ellipse cx="950" cy="68" rx="170" ry="45" fill="url(#cloudCore)" />
        </g>
        {/* Bottom edge - wispy greenish */}
        <g opacity="0.7">
          <ellipse cx="150" cy="110" rx="120" ry="35" fill="#1a2a1a" />
          <ellipse cx="400" cy="105" rx="140" ry="38" fill="#152515" />
          <ellipse cx="650" cy="115" rx="130" ry="35" fill="#1a2a1a" />
          <ellipse cx="900" cy="108" rx="120" ry="32" fill="#152515" />
        </g>
        {/* Wisps trailing down */}
        <g opacity="0.5">
          <ellipse cx="250" cy="145" rx="80" ry="25" fill="#1f2f1f" />
          <ellipse cx="550" cy="140" rx="100" ry="28" fill="#1a2a1a" />
          <ellipse cx="800" cy="150" rx="90" ry="25" fill="#1f2f1f" />
        </g>
      </svg>

      {/* Stormy cloud glow - FEL GREEN atmospheric lighting */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20%',
        pointerEvents: 'none',
      }}>
        {/* Base green storm glow - always visible, gives clouds greenish tint */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `
            radial-gradient(ellipse at 20% 30%, ${WC3.roc.felMid}40 0%, ${WC3.roc.felDark}20 40%, transparent 70%),
            radial-gradient(ellipse at 50% 25%, ${WC3.roc.felBright}30 0%, ${WC3.roc.felMid}18 35%, transparent 65%),
            radial-gradient(ellipse at 80% 35%, ${WC3.roc.felMid}35 0%, ${WC3.roc.felDark}18 40%, transparent 70%)
          `,
        }} />

        {/* === THUNDER FLASH - Dramatic cloud illumination (infernal spawn) === */}
        {lightningActive && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `
              radial-gradient(ellipse at ${lightningX}% 25%, ${WC3.roc.felBright}95 0%, ${WC3.roc.felBright}60 15%, ${WC3.roc.felMid}35 35%, transparent 60%),
              radial-gradient(ellipse at ${lightningX + 10}% 40%, ${WC3.roc.felBright}70 0%, ${WC3.roc.felMid}40 25%, transparent 50%),
              radial-gradient(ellipse at ${lightningX - 15}% 35%, ${WC3.roc.felMid}55 0%, transparent 40%)
            `,
            animation: 'thunderFlash 0.15s ease-out',
          }} />
        )}

        {/* === AMBIENT THUNDER FLASH - Localized to specific cloud zones === */}
        {ambientFlash && (() => {
          const zone = cloudZones[activeZone] || { x: 50, y: 30, spread: 18 }
          return (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: `
                radial-gradient(ellipse at ${ambientFlashX}% ${zone.y}%, ${WC3.roc.felBright}80 0%, ${WC3.roc.felBright}45 15%, ${WC3.roc.felMid}25 30%, transparent ${zone.spread + 45}%),
                radial-gradient(ellipse at ${ambientFlashX + 8}% ${zone.y + 12}%, ${WC3.roc.felMid}40 0%, transparent 25%)
              `,
              transition: 'opacity 0.05s ease-out',
            }} />
          )
        })()}

        {/* Pulsing storm glow - subtle ambient with cloudGlow intensity */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `
            radial-gradient(ellipse at ${lightningX}% 30%, ${WC3.roc.felBright}${Math.floor(cloudGlow * 40).toString(16).padStart(2, '0')} 0%, ${WC3.roc.felMid}${Math.floor(cloudGlow * 22).toString(16).padStart(2, '0')} 30%, transparent 55%),
            radial-gradient(ellipse at ${100 - lightningX}% 40%, ${WC3.roc.felMid}${Math.floor(cloudGlow * 25).toString(16).padStart(2, '0')} 0%, transparent 40%)
          `,
          transition: 'background 0.2s ease',
        }} />

        {/* Cloud underlighting - ambient glow within clouds */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
          height: '40%',
          background: `
            radial-gradient(ellipse at 15% 60%, ${WC3.roc.felBright}15 0%, transparent 35%),
            radial-gradient(ellipse at 45% 50%, ${WC3.roc.felMid}18 0%, transparent 40%),
            radial-gradient(ellipse at 75% 55%, ${WC3.roc.felBright}12 0%, transparent 30%),
            radial-gradient(ellipse at 90% 65%, ${WC3.roc.felMid}15 0%, transparent 35%)
          `,
          animation: 'stormPulse 6s ease-in-out infinite',
        }} />

        {/* Secondary flash echo - follows main flash */}
        {lightningActive && (
          <div style={{
            position: 'absolute',
            top: '10%',
            left: 0,
            right: 0,
            height: '50%',
            background: `
              radial-gradient(ellipse at ${100 - lightningX}% 50%, ${WC3.roc.felBright}40 0%, transparent 45%)
            `,
            animation: 'thunderFlash 0.2s ease-out 0.08s',
            opacity: 0.6,
          }} />
        )}
      </div>

      <style>{`
        @keyframes stormPulse {
          0%, 100% { opacity: 0.5; }
          30% { opacity: 0.8; }
          60% { opacity: 0.4; }
          80% { opacity: 0.7; }
        }
        @keyframes thunderFlash {
          0% { opacity: 1; }
          30% { opacity: 0.9; }
          60% { opacity: 0.4; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* === OCCASIONAL FALLING METEOR - Every 8-15 seconds === */}
      {fallingMeteor && fallingMeteor.active && (
        <div
          key={`meteor-${fallingMeteor.id}`}
          style={{
            position: 'absolute',
            left: `${fallingMeteor.startX}%`,
            top: '-5%',
            width: '25px',
            height: '25px',
            animation: `meteorRain${fallingMeteor.direction === 'left' ? 'Left' : 'Right'} 4s ease-in forwards`,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          {/* Meteor glow */}
          <div style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${WC3.roc.felBright}60 0%, ${WC3.roc.felMid}35 35%, ${WC3.roc.felDark}20 60%, transparent 80%)`,
            filter: 'blur(8px)',
          }} />
          {/* Meteor body */}
          <svg width="25" height="25" viewBox="0 0 30 30" style={{ position: 'relative', zIndex: 2 }}>
            <defs>
              <radialGradient id={`meteor${fallingMeteor.id}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor={WC3.roc.fireCore} />
                <stop offset="35%" stopColor={WC3.roc.fireBright} />
                <stop offset="70%" stopColor={WC3.roc.felMid} />
                <stop offset="100%" stopColor="#2a1a0a" />
              </radialGradient>
            </defs>
            <path
              d="M15,2 L22,6 L26,12 L28,18 L24,24 L18,28 L10,26 L4,22 L2,14 L6,8 L12,4 Z"
              fill={`url(#meteor${fallingMeteor.id})`}
            />
            <path d="M10,8 L15,15 L12,22" stroke={WC3.roc.felBright} strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="12" cy="12" r="3" fill={WC3.roc.fireCore} opacity="0.7" />
          </svg>
          {/* Fire trail */}
          <div style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            width: '15px',
            height: '90px',
            background: `linear-gradient(180deg, transparent 0%, ${WC3.roc.felDark}30 15%, ${WC3.roc.felMid}55 45%, ${WC3.roc.felBright}80 75%, ${WC3.roc.fireCore} 100%)`,
            filter: 'blur(5px)',
            transform: `translateX(-50%) rotate(${fallingMeteor.direction === 'left' ? '25deg' : '-25deg'})`,
            transformOrigin: 'bottom center',
          }} />
        </div>
      )}

      {/* === SINGLE RIGHT-SIDE INFERNAL GOLEM - Full spawn sequence === */}
      {golemPhase !== 'waiting' && (
        <div
          style={{
            position: 'fixed',
            right: '15%',
            top: '25vh',
            transform: 'scale(0.6)',
            transformOrigin: 'center top',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {/* PHASE 1: METEOR FALLING - diagonal, starts small and grows */}
          {golemPhase === 'meteor' && (
            <div
              style={{
                position: 'absolute',
                left: '-50px',
                top: '-200px',
                animation: 'golemMeteorFall 1.5s ease-in forwards',
              }}
            >
              {/* Meteor core - scales up during animation */}
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${WC3.roc.fireCore} 0%, ${WC3.roc.fireBright} 30%, ${WC3.roc.fireMid} 60%, ${WC3.roc.felMid} 85%, #1a1510 100%)`,
                boxShadow: `0 0 15px ${WC3.roc.felBright}, 0 0 30px ${WC3.roc.fireMid}`,
                animation: 'meteorGrow 1.5s ease-in forwards',
              }} />
              {/* Meteor trail - diagonal, grows with meteor */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                width: '4px',
                height: '50px',
                background: `linear-gradient(180deg, transparent 0%, ${WC3.roc.felDark}40 30%, ${WC3.roc.felMid}70 60%, ${WC3.roc.felBright}95 85%, ${WC3.roc.fireCore} 100%)`,
                filter: 'blur(3px)',
                transform: 'translateX(-50%) rotate(-25deg)',
                transformOrigin: 'bottom center',
                animation: 'meteorTrailGrow 1.5s ease-in forwards',
              }} />
            </div>
          )}

          {/* PHASE 2: EXPLOSION */}
          {(golemPhase === 'explosion' || golemPhase === 'assembling' || golemPhase === 'final') && (
            <>
              {/* Explosion flash - only during explosion phase */}
              {golemPhase === 'explosion' && (
                <div style={{
                  position: 'absolute',
                  left: '80px',
                  top: '200px',
                  transform: 'translate(-50%, -50%)',
                  width: '250px',
                  height: '250px',
                  background: `radial-gradient(circle, ${WC3.roc.felBright}90 0%, ${WC3.roc.felMid}60 30%, ${WC3.roc.felDark}30 60%, transparent 80%)`,
                  animation: 'explosionFlash 0.6s ease-out forwards',
                }} />
              )}

              {/* Crater - appears after explosion */}
              <svg
                width="160"
                height="40"
                viewBox="0 0 160 40"
                style={{
                  position: 'absolute',
                  left: '0px',
                  top: '200px',
                  transform: 'translateY(-50%)',
                  zIndex: -1,
                }}
              >
                <ellipse cx="80" cy="20" rx="75" ry="18" fill="#080604" />
                <path d="M80,20 L100,22 L105,18 L125,23 L130,19 L150,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ strokeDasharray: 200, animation: 'crackGrow 0.8s ease-out forwards' }} />
                <path d="M80,20 L60,22 L55,18 L35,23 L30,19 L10,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ strokeDasharray: 200, animation: 'crackGrow 0.8s ease-out 0.1s forwards' }} />
                <ellipse cx="80" cy="20" rx="12" ry="6" fill={WC3.roc.felDark} opacity="0.4" />
              </svg>

              {/* Shadow */}
              <div style={{
                position: 'absolute',
                left: '80px',
                transform: 'translateX(-50%) translateY(-50%)',
                top: '200px',
                width: '120px',
                height: '25px',
                background: `radial-gradient(ellipse, ${WC3.roc.felDark}60 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
                borderRadius: '50%',
              }} />
            </>
          )}

          {/* PHASE 3: ROCK ASSEMBLY - stays visible until final golem fades in */}
          {(golemPhase === 'assembling' || golemPhase === 'explosion' || (golemPhase === 'final' && !hideAssembly)) && (
            <>
              {/* Emergence glow */}
              <div style={{
                position: 'absolute',
                left: '80px',
                top: '200px',
                transform: 'translateX(-50%) translateY(-50%)',
                width: '150px',
                height: '200px',
                background: `radial-gradient(ellipse at 50% 90%, ${WC3.roc.felBright}60 0%, ${WC3.roc.felMid}30 30%, transparent 70%)`,
                animation: 'emergeGlow 2.5s ease-out forwards',
                pointerEvents: 'none',
              }} />

              {/* Assembling rocks */}
              <svg
                width="160"
                height="200"
                viewBox="0 0 160 200"
                style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '0px',
                  overflow: 'visible',
                  opacity: (golemPhase === 'assembling' || golemPhase === 'final') ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              >
                {/* HEAD rock */}
                <g style={{ animation: 'assembleHead 1.8s ease-out forwards' }}>
                  <ellipse cx="80" cy="25" rx="22" ry="18" fill="#3a3835" />
                  <ellipse cx="80" cy="24" rx="18" ry="14" fill="#4a4845" />
                  <ellipse cx="70" cy="24" rx="4" ry="3" fill={WC3.roc.felMid} />
                  <ellipse cx="90" cy="24" rx="4" ry="3" fill={WC3.roc.felMid} />
                </g>
                {/* LEFT SHOULDER */}
                <g style={{ animation: 'assembleLeftShoulder 1.5s ease-out 0.2s forwards', opacity: 0 }}>
                  <polygon points="20,50 15,65 30,72 45,68 42,52 30,45" fill="#3a3835" />
                  <polygon points="25,52 22,62 32,66 40,63 38,55 30,50" fill="#4a4845" />
                </g>
                {/* RIGHT SHOULDER */}
                <g style={{ animation: 'assembleRightShoulder 1.6s ease-out 0.15s forwards', opacity: 0 }}>
                  <polygon points="140,50 145,65 130,72 115,68 118,52 130,45" fill="#3a3835" />
                  <polygon points="135,52 138,62 128,66 120,63 122,55 130,50" fill="#4a4845" />
                </g>
                {/* TORSO */}
                <g style={{ animation: 'assembleTorso 1.4s ease-out 0.3s forwards', opacity: 0 }}>
                  <polygon points="55,55 50,90 55,115 105,115 110,90 105,55" fill="#2a2825" />
                  <polygon points="60,58 58,88 62,110 98,110 102,88 100,58" fill="#3a3835" />
                  <path d="M80,65 L75,85 L82,105" stroke={WC3.roc.felMid} strokeWidth="2" fill="none" />
                </g>
                {/* LEFT ARM */}
                <g style={{ animation: 'assembleLeftArm 1.7s ease-out 0.4s forwards', opacity: 0 }}>
                  <polygon points="15,72 8,100 18,115 30,108 28,78" fill="#3a3835" />
                </g>
                {/* RIGHT ARM */}
                <g style={{ animation: 'assembleRightArm 1.65s ease-out 0.35s forwards', opacity: 0 }}>
                  <polygon points="145,72 152,100 142,115 130,108 132,78" fill="#3a3835" />
                </g>
                {/* LEFT LEG */}
                <g style={{ animation: 'assembleLeftLeg 1.3s ease-out 0.5s forwards', opacity: 0 }}>
                  <polygon points="50,120 42,160 55,185 68,175 62,125" fill="#3a3835" />
                </g>
                {/* RIGHT LEG */}
                <g style={{ animation: 'assembleRightLeg 1.35s ease-out 0.45s forwards', opacity: 0 }}>
                  <polygon points="110,120 118,160 105,185 92,175 98,125" fill="#3a3835" />
                </g>
              </svg>
            </>
          )}

          {/* PHASE 4: FINAL DETAILED GOLEM - only visible in final phase */}
          {golemPhase === 'final' && (
            <div style={{ position: 'absolute', left: '-10px', top: '0px', animation: 'golemFadeIn 1s ease-out forwards' }}>
              <InfernalGolemSVG id={999} isIdle={true} />
            </div>
          )}
        </div>
      )}

      {/* === WIND STREAKS - Horizontal gusts across battlefield === */}
      {rainWindStreaks.map((streak) => (
        <div
          key={`wind-${streak.id}`}
          style={{
            position: 'absolute',
            top: `${streak.y}%`,
            left: '-15%',
            width: streak.length,
            height: streak.thickness,
            background: `linear-gradient(90deg, transparent 0%, #9ab0b830 30%, #b0c5cc40 50%, #9ab0b830 70%, transparent 100%)`,
            animation: `rainWindGust ${streak.duration}s linear infinite`,
            animationDelay: `${streak.delay}s`,
          }}
        />
      ))}

      {/* === RAIN - Falling diagonally with wind === */}
      {raindrops.map((drop) => (
        <div
          key={`rain-${drop.id}`}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-5%',
            width: '2px',
            height: `${drop.length}px`,
            background: 'linear-gradient(180deg, transparent 0%, #9ab0b8aa 20%, #c0d5ddcc 50%, #9ab0b8aa 80%, transparent 100%)',
            animation: `rainFallWindy ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}

      {/* === HORDE WAR BANNER - Positioned above infernals, scaled larger === */}
      <div
        style={{
          position: 'fixed',
          left: '8vw',
          top: '58vh',
          transform: 'rotate(-10deg) scale(1.8)',
          transformOrigin: 'bottom left',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <svg width="120" height="300" viewBox="0 0 120 300" style={{ overflow: 'visible' }}>
          {/* Dirt mound at pole base - dark brownish, matches shadowed terrain */}
          <ellipse cx="12" cy="282" rx="28" ry="12" fill="#0c0f0a" />
          <ellipse cx="12" cy="280" rx="22" ry="9" fill="#12150f" />
          <ellipse cx="12" cy="278" rx="14" ry="6" fill="#181a14" />
          {/* Small dirt clumps */}
          <ellipse cx="-8" cy="286" rx="10" ry="5" fill="#0c0f0a" opacity="0.8" />
          <ellipse cx="30" cy="288" rx="12" ry="6" fill="#12150f" opacity="0.7" />
          {/* Grass tufts around base - olive-green like terrain grass */}
          <path d="M-5,278 Q-8,268 -3,262" stroke="#5a5a30" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M28,280 Q32,270 29,264" stroke="#6a6535" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M-12,282 Q-15,274 -10,270" stroke="#4a4a28" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M35,284 Q38,276 35,272" stroke="#5a5a30" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Banner pole - Dark war totem with blood stains */}
          {/* Main pole - charred dark wood */}
          <rect x="4" y="50" width="16" height="235" fill="#0f0a08" />
          <rect x="6" y="50" width="12" height="235" fill="#1a1210" />
          <rect x="8" y="55" width="8" height="225" fill="#251a15" />
          <rect x="10" y="60" width="4" height="215" fill="#2a1f18" opacity="0.5" />
          {/* Wood grain texture - dark */}
          <line x1="7" y1="70" x2="7" y2="270" stroke="#0a0806" strokeWidth="1" opacity="0.6" />
          <line x1="17" y1="65" x2="17" y2="275" stroke="#0a0806" strokeWidth="1" opacity="0.5" />

          {/* Blood stains dripping down pole */}
          <path d="M8,80 Q6,95 8,110 Q10,125 7,140" stroke="#3a1515" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M14,130 Q16,150 13,170 Q15,190 12,210" stroke="#2a1010" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M10,200 Q8,220 11,240 Q9,260 10,275" stroke="#3a1515" strokeWidth="2" fill="none" opacity="0.5" />
          {/* Blood splatter spots */}
          <ellipse cx="6" cy="90" rx="3" ry="2" fill="#3a1010" opacity="0.6" />
          <ellipse cx="16" cy="155" rx="4" ry="2" fill="#2a0a0a" opacity="0.5" />
          <ellipse cx="8" cy="220" rx="3" ry="3" fill="#3a1515" opacity="0.4" />

          {/* Leather wrappings - darker, worn */}
          <rect x="3" y="110" width="18" height="8" fill="#1a1210" rx="1" />
          <rect x="4" y="112" width="16" height="4" fill="#251a15" />
          <rect x="3" y="180" width="18" height="8" fill="#1a1210" rx="1" />
          <rect x="4" y="182" width="16" height="4" fill="#251a15" />
          <rect x="3" y="240" width="18" height="8" fill="#1a1210" rx="1" />
          <rect x="4" y="242" width="16" height="4" fill="#251a15" />

          {/* Top section - skull mount */}
          <polygon points="12,20 0,50 24,50" fill="#1a1210" />
          <polygon points="12,25 4,48 20,48" fill="#251a15" />

          {/* Small skull at top - weathered bone */}
          <g transform="translate(12, 38)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#3a3530" />
            <ellipse cx="0" cy="-1" rx="6" ry="4" fill="#4a4540" />
            <ellipse cx="-3" cy="-1" rx="2" ry="1.5" fill="#0a0808" />
            <ellipse cx="3" cy="-1" rx="2" ry="1.5" fill="#0a0808" />
            <ellipse cx="0" cy="2" rx="1" ry="1.5" fill="#0a0808" />
            {/* Blood on skull */}
            <path d="M-5,3 Q-3,5 -1,4" stroke="#3a1515" strokeWidth="1.5" fill="none" opacity="0.6" />
          </g>

          {/* Top spike - dark iron */}
          <polygon points="12,8 8,22 16,22" fill="#3a3a38" />
          <polygon points="12,10 10,20 14,20" fill="#4a4a48" opacity="0.5" />

          {/* WAR HORNS - darker, battle-worn */}
          {/* Left horn */}
          <g transform="translate(-2, 52)">
            <path
              d="M12,0 Q-5,5 -15,25 Q-20,40 -18,50"
              fill="none"
              stroke="#3a3530"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M12,0 Q-5,5 -15,25 Q-20,40 -18,50"
              fill="none"
              stroke="#4a4540"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M10,2 Q-3,7 -12,25"
              fill="none"
              stroke="#5a5550"
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="-18" cy="50" r="3" fill="#2a2520" />
          </g>

          {/* Right horn */}
          <g transform="translate(14, 52)">
            <path
              d="M0,0 Q17,5 27,25 Q32,40 30,50"
              fill="none"
              stroke="#3a3530"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M0,0 Q17,5 27,25 Q32,40 30,50"
              fill="none"
              stroke="#4a4540"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M2,2 Q15,7 24,25"
              fill="none"
              stroke="#5a5550"
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="30" cy="50" r="3" fill="#2a2520" />
          </g>

          {/* Metal rings - rusted iron */}
          <ellipse cx="12" cy="55" rx="12" ry="4" fill="none" stroke="#3a3530" strokeWidth="2" />
          <ellipse cx="12" cy="55" rx="10" ry="3" fill="none" stroke="#4a4540" strokeWidth="1" />

          {/* Banner fabric - simplified but visible */}
          <g transform="translate(18, 55)">
            <defs>
              <clipPath id="flagBannerCol1"><rect x="0" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol2"><rect x="18" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol3"><rect x="36" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol4"><rect x="54" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol5"><rect x="72" y="0" width="15" height="150" /></clipPath>
            </defs>

            {/* Worn, rain-soaked bloody banner - brownish red tones */}
            {[
              { id: 1, x: 0, w: 18, delay: '0s', fill: '#4a2018', yOff: 0 },
              { id: 2, x: 18, w: 18, delay: '0.12s', fill: '#3a1812', yOff: 2 },
              { id: 3, x: 36, w: 18, delay: '0.24s', fill: '#2a1210', yOff: 4 },
              { id: 4, x: 54, w: 18, delay: '0.36s', fill: '#1f0c0a', yOff: 6 },
              { id: 5, x: 72, w: 15, delay: '0.48s', fill: '#150808', yOff: 8 },
            ].map((col) => (
              <g key={col.id} style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: col.delay }}>
                <rect x={col.x} y={col.yOff} width={col.w} height={150 - col.yOff} fill={col.fill} />
                <g clipPath={`url(#flagBannerCol${col.id})`}>
                  <g transform="translate(44, 70)">
                    {/* ORC HORNS - curved, coming from skull sides */}
                    <path d="M-18,-8 Q-28,-15 -32,-28 Q-30,-35 -25,-38" stroke="#a89878" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M-18,-8 Q-26,-14 -30,-26 Q-28,-32 -24,-35" stroke="#c8b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M18,-8 Q28,-15 32,-28 Q30,-35 25,-38" stroke="#a89878" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M18,-8 Q26,-14 30,-26 Q28,-32 24,-35" stroke="#c8b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* Skull base - worn bone white with yellow/red tints */}
                    <ellipse cx="0" cy="-2" rx="24" ry="16" fill="#8a7a68" />
                    <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#b8a890" />
                    <ellipse cx="0" cy="-5" rx="19" ry="12" fill="#c8b8a0" />
                    {/* Brow ridge */}
                    <path d="M-16,-8 Q-8,-14 0,-12 Q8,-14 16,-8" stroke="#a89878" strokeWidth="4" fill="none" />
                    {/* Eye sockets - deep and dark */}
                    <ellipse cx="-8" cy="-4" rx="5" ry="4" fill="#1a0a08" />
                    <ellipse cx="8" cy="-4" rx="5" ry="4" fill="#1a0a08" />
                    {/* Fel green eye glow */}
                    <ellipse cx="-8" cy="-4" rx="2.5" ry="2" fill="#3a4a30" />
                    <ellipse cx="8" cy="-4" rx="2.5" ry="2" fill="#3a4a30" />
                    {/* Nose hole */}
                    <path d="M-2,2 L0,6 L2,2" fill="#2a1a10" />
                    {/* Jaw - worn bone */}
                    <path d="M-16,6 L-14,14 L-6,16 L0,14 L6,16 L14,14 L16,6" fill="#a89880" />
                    <path d="M-14,8 L-12,13 L-4,15 L0,13 L4,15 L12,13 L14,8" fill="#b8a890" />
                    {/* Blood stains on skull */}
                    <path d="M-10,-8 Q-12,-2 -8,4" stroke="#6a2a20" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M6,0 Q8,5 4,10" stroke="#5a2018" strokeWidth="1" fill="none" opacity="0.5" />
                    {/* Orc tusks - from jaw, pointing up and out */}
                    <path d="M-12,12 Q-18,4 -14,-4" stroke="#c8b8a0" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M-12,12 Q-16,5 -13,-2" stroke="#d8c8b0" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M12,12 Q18,4 14,-4" stroke="#c8b8a0" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M12,12 Q16,5 13,-2" stroke="#d8c8b0" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                </g>
              </g>
            ))}
            <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill="#2a0a0a" style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.55s' }} />
          </g>

          {/* Pole shadow */}
          <ellipse cx="12" cy="285" rx="15" ry="5" fill="#0a0a08" opacity="0.4" />

          {/* Animated flag shadow on ground - sways with banner */}
          <g transform="translate(45, 280)">
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={`flagShadow${i}`}
                cx={i * 15}
                cy={i * 2}
                rx={18 - i * 2}
                ry={6 - i * 0.5}
                fill="#0a0a08"
                opacity={0.25 - i * 0.04}
                style={{
                  animation: 'bannerWave 1.4s ease-in-out infinite alternate',
                  animationDelay: `${i * 0.12}s`,
                  transformOrigin: `${i * 15}px ${i * 2}px`,
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* === FOREGROUND GRASS TUFTS === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', pointerEvents: 'none' }} viewBox="0 0 1000 80" preserveAspectRatio="none">
        {/* Grass silhouettes */}
        <g opacity="0.85">
          {[30, 120, 250, 400, 550, 700, 850, 950].map((x, i) => (
            <g key={`fg-${i}`} transform={`translate(${x}, 75)`}>
              <path d={`M0,0 Q${-2},${-20} ${1},${-35 - i % 8}`} stroke="#3a4530" strokeWidth="2" fill="none" />
              <path d={`M5,0 Q${7},${-25} ${4},${-40 - i % 6}`} stroke="#4a5538" strokeWidth="2" fill="none" />
              <path d={`M10,0 Q${8},${-15} ${12},${-28 - i % 5}`} stroke="#3a4530" strokeWidth="1.5" fill="none" />
            </g>
          ))}
        </g>
        {/* Ground bar - dark grass */}
        <rect x="0" y="65" width="1000" height="15" fill="#0d1a0f" opacity="0.95" />
      </svg>

      {/* Ground mist atmosphere */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(0deg, #0d1a0f40 0%, #0a150a25 50%, transparent 100%)',
        filter: 'blur(15px)',
      }} />

      <style>{`
        /* Meteor rain - diagonal left (moves down and left) */
        @keyframes meteorRainLeft {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(-40vw, 120vh);
            opacity: 0;
          }
        }
        /* Meteor rain - diagonal right (moves down and right) */
        @keyframes meteorRainRight {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(40vw, 120vh);
            opacity: 0;
          }
        }
        /* Meteor glow pulsing while falling - must include translate to maintain centering */
        @keyframes meteorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.9;
          }
        }
        /* Explosion flash on impact */
        @keyframes explosionFlash {
          0% {
            transform: scale(0.2);
            opacity: 1;
            filter: brightness(2.5);
          }
          20% {
            transform: scale(1.3);
            opacity: 1;
            filter: brightness(2);
          }
          50% {
            transform: scale(1.6);
            opacity: 0.7;
            filter: brightness(1.3);
          }
          100% {
            transform: scale(2);
            opacity: 0;
            filter: brightness(0.3);
          }
        }
        /* Shockwave ring expanding */
        @keyframes shockwaveExpand {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        /* Smoke rising from impact */
        @keyframes smokeRise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-80px) scale(1.5);
            opacity: 0;
          }
        }
        /* Debris particles flying outward */
        @keyframes debrisFly0 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-40px, -60px) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes debrisFly1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(10px, -70px) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes debrisFly2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(50px, -50px) scale(0.4);
            opacity: 0;
          }
        }
        /* Infernal creature rising from impact (legacy) */
        @keyframes infernalRise {
          0% {
            transform: translateY(30px) scale(0.5);
            opacity: 0;
          }
          40% {
            transform: translateY(10px) scale(0.9);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        /* === GOLEM ASSEMBLY ANIMATIONS - rocks fly from scattered to final position === */
        /* HEAD - starts scattered left, flies to top center */
        @keyframes assembleHead {
          0% {
            transform: translate(-60px, 150px) rotate(-30deg) scale(0.6);
            opacity: 0.3;
            filter: brightness(1.5);
          }
          20% {
            opacity: 1;
            filter: brightness(1.3);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* LEFT SHOULDER - starts bottom left of crater */
        @keyframes assembleLeftShoulder {
          0% {
            transform: translate(-40px, 130px) rotate(20deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.4);
          }
          15% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* RIGHT SHOULDER - starts bottom right of crater */
        @keyframes assembleRightShoulder {
          0% {
            transform: translate(40px, 130px) rotate(-25deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.4);
          }
          15% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* TORSO - starts at crater center, rises up */
        @keyframes assembleTorso {
          0% {
            transform: translate(0, 100px) scale(0.4);
            opacity: 0;
            filter: brightness(1.6);
          }
          20% { opacity: 1; }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* LEFT ARM - starts far left */
        @keyframes assembleLeftArm {
          0% {
            transform: translate(-50px, 60px) rotate(45deg) scale(0.4);
            opacity: 0;
            filter: brightness(1.3);
          }
          20% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* RIGHT ARM - starts far right */
        @keyframes assembleRightArm {
          0% {
            transform: translate(50px, 60px) rotate(-45deg) scale(0.4);
            opacity: 0;
            filter: brightness(1.3);
          }
          20% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* LEFT LEG - starts left of crater */
        @keyframes assembleLeftLeg {
          0% {
            transform: translate(-30px, 70px) rotate(15deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.2);
          }
          25% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* RIGHT LEG - starts right of crater */
        @keyframes assembleRightLeg {
          0% {
            transform: translate(30px, 70px) rotate(-15deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.2);
          }
          25% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* Glow during assembly */
        @keyframes emergeGlow {
          0% { opacity: 0.8; transform: translateY(80px); }
          50% { opacity: 0.6; transform: translateY(30px); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        /* Rock parts glow during assembly */
        @keyframes rockGlowPulse {
          0% { opacity: 0.2; filter: brightness(2); }
          50% { opacity: 0.8; filter: brightness(1.5); }
          100% { opacity: 1; filter: brightness(1); }
        }
        /* Detailed golem fades in on top of assembled rocks */
        @keyframes golemFadeIn {
          0% { opacity: 0; filter: brightness(1.3); }
          100% { opacity: 1; filter: brightness(1); }
        }
        /* Meteor falls diagonally from sky for golem spawn */
        @keyframes golemMeteorFall {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          100% {
            transform: translate(130px, 400px);
            opacity: 1;
          }
        }
        /* Meteor grows as it approaches (perspective effect) */
        @keyframes meteorGrow {
          0% {
            width: 8px;
            height: 8px;
            box-shadow: 0 0 8px ${WC3.roc.felBright}, 0 0 15px ${WC3.roc.fireMid};
          }
          50% {
            width: 20px;
            height: 20px;
            box-shadow: 0 0 20px ${WC3.roc.felBright}, 0 0 40px ${WC3.roc.fireMid};
          }
          100% {
            width: 40px;
            height: 40px;
            box-shadow: 0 0 35px ${WC3.roc.felBright}, 0 0 70px ${WC3.roc.fireMid};
          }
        }
        /* Trail grows with meteor */
        @keyframes meteorTrailGrow {
          0% {
            width: 3px;
            height: 30px;
            filter: blur(2px);
          }
          50% {
            width: 8px;
            height: 70px;
            filter: blur(3px);
          }
          100% {
            width: 14px;
            height: 120px;
            filter: blur(5px);
          }
        }
        /* Explosion flash on meteor impact */
        @keyframes explosionFlash {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        /* Crater crack grows from center outward */
        @keyframes crackGrow {
          0% {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        /* Crack trembles/shakes after growing */
        @keyframes crackTremble {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-1px, 1px);
          }
          50% {
            transform: translate(1px, -1px);
          }
          75% {
            transform: translate(-1px, -1px);
          }
        }
        /* Idle breathing animation - SVG only, no translateX (that's on container) */
        @keyframes infernalBreath {
          0%, 100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.02) translateY(-1px);
          }
        }
        /* Head looks around - left, center, right, center (more dramatic) */
        @keyframes headLook {
          0%, 20%, 80%, 100% {
            transform: rotate(0deg);
          }
          30%, 40% {
            transform: rotate(-12deg);
          }
          55%, 70% {
            transform: rotate(12deg);
          }
        }
        /* Left arm sway - muscle flex effect */
        @keyframes leftArmSway {
          0%, 100% {
            transform: rotate(0deg) scaleX(1);
          }
          25% {
            transform: rotate(-8deg) scaleX(1.05);
          }
          50% {
            transform: rotate(-3deg) scaleX(1);
          }
          75% {
            transform: rotate(5deg) scaleX(0.98);
          }
        }
        /* Right arm sway - opposite phase muscle flex */
        @keyframes rightArmSway {
          0%, 100% {
            transform: rotate(0deg) scaleX(1);
          }
          25% {
            transform: rotate(8deg) scaleX(1.05);
          }
          50% {
            transform: rotate(3deg) scaleX(1);
          }
          75% {
            transform: rotate(-5deg) scaleX(0.98);
          }
        }
        /* Left leg weight shift */
        @keyframes leftLegShift {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          50% {
            transform: rotate(-2deg) translateX(-1px);
          }
        }
        /* Right leg weight shift - opposite phase */
        @keyframes rightLegShift {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          50% {
            transform: rotate(2deg) translateX(1px);
          }
        }
        /* Torso subtle sway */
        @keyframes torsoSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-1deg);
          }
          75% {
            transform: rotate(1deg);
          }
        }
        /* Body glow pulse */
        @keyframes felPulse {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.08);
          }
        }
        /* Layered flame animations - outer layer (slowest, largest movement) */
        @keyframes flameOuter {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(0);
            opacity: 0.8;
          }
          25% {
            transform: scaleY(1.15) scaleX(0.9) translateX(-1px);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1.05) scaleX(1.05) translateX(1px);
            opacity: 0.85;
          }
          75% {
            transform: scaleY(1.12) scaleX(0.95) translateX(-0.5px);
            opacity: 0.75;
          }
        }
        /* Middle flame layer */
        @keyframes flameMid {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(0);
            opacity: 0.9;
          }
          20% {
            transform: scaleY(1.12) scaleX(0.92) translateX(0.5px);
            opacity: 0.85;
          }
          45% {
            transform: scaleY(1.08) scaleX(1.03) translateX(-0.8px);
            opacity: 0.95;
          }
          70% {
            transform: scaleY(1.18) scaleX(0.88) translateX(0.3px);
            opacity: 0.88;
          }
        }
        /* Inner flame layer (faster, more erratic) */
        @keyframes flameInner {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(0);
            opacity: 0.85;
          }
          15% {
            transform: scaleY(1.2) scaleX(0.85) translateX(-0.5px);
            opacity: 0.9;
          }
          35% {
            transform: scaleY(1.05) scaleX(1.08) translateX(0.8px);
            opacity: 0.8;
          }
          55% {
            transform: scaleY(1.25) scaleX(0.82) translateX(-0.3px);
            opacity: 0.92;
          }
          80% {
            transform: scaleY(1.1) scaleX(0.95) translateX(0.4px);
            opacity: 0.85;
          }
        }
        /* Core flame (hottest, fastest flicker) */
        @keyframes flameCore {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
            opacity: 0.7;
          }
          20% {
            transform: scaleY(1.3) scaleX(0.8);
            opacity: 0.8;
          }
          40% {
            transform: scaleY(0.9) scaleX(1.1);
            opacity: 0.65;
          }
          60% {
            transform: scaleY(1.25) scaleX(0.85);
            opacity: 0.75;
          }
          80% {
            transform: scaleY(1.05) scaleX(0.95);
            opacity: 0.7;
          }
        }
        /* Eye glow intensity variation */
        @keyframes eyeGlow {
          0%, 100% {
            opacity: 0.9;
            filter: brightness(1);
          }
          25% {
            opacity: 1;
            filter: brightness(1.3);
          }
          75% {
            opacity: 0.7;
            filter: brightness(0.8);
          }
        }
        /* Wind gusts blowing across battlefield */
        @keyframes rainWindGust {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateX(130vw); opacity: 0; }
        }
        /* Rain falling with wind - uses translate only (no rotate) for performance */
        @keyframes rainFallWindy {
          0% { transform: translate(0, 0) rotate(-25deg); opacity: 0.6; }
          100% { transform: translate(25vw, 115vh) rotate(-25deg); opacity: 0; }
        }
        /* Grass blade wind - ondulating wave to the right, anchored at base */
        @keyframes grassBlade {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(6deg); }
          50% { transform: rotate(12deg); }
          75% { transform: rotate(6deg); }
        }
        /* Banner wave - staggered columns create ripple effect */
        @keyframes bannerWave {
          0% {
            transform: translateY(0) skewX(0deg);
          }
          100% {
            transform: translateY(-6px) skewX(3deg);
          }
        }
      `}</style>
    </>
  )
})

// =============================================================================
// FROZEN THRONE ATMOSPHERE - Heavy blizzard/ice storm
// =============================================================================

const FrozenThroneAtmosphere = memo(function FrozenThroneAtmosphere() {
  // Snow layers - reduced counts for performance
  const snowLayers = useMemo(() => ({
    // Far layer - small, slow
    far: Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -15,
      duration: 10 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    })),
    // Mid layer - medium size
    mid: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -10,
      duration: 6 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    })),
    // Near layer - large, fast
    near: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -5,
      duration: 3 + Math.random() * 2,
      size: 4 + Math.random() * 4,
    })),
  }), [])

  // Wind/frost streaks - reduced for performance
  const windStreaks = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      y: i * 12.5,
      delay: Math.random() * -8,
      duration: 1.5 + Math.random() * 1,
      length: 80 + Math.random() * 120,
      thickness: 1 + Math.random(),
    })),
    []
  )

  return (
    <>
      {/* Deep cold sky with depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          #010203 0%,
          #030508 10%,
          #061020 30%,
          #081830 50%,
          #061525 70%,
          #030810 90%,
          #020305 100%)`
      }} />

      {/* === FROZEN THRONE BACKGROUND - Animated Painting === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 1000 850" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Gradients for depth and ice effects */}
          <linearGradient id="ftGroundFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#061020" stopOpacity="0" />
            <stop offset="40%" stopColor="#081525" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#030810" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="throneGlow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={WC3.ft.iceBright} stopOpacity="0.2" />
            <stop offset="30%" stopColor={WC3.ft.iceMid} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="iceShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={WC3.ft.iceBright} stopOpacity="0.3" />
            <stop offset="50%" stopColor={WC3.ft.iceMid} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <filter id="ftDistantBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <filter id="ftMidBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="iceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* === THE FROZEN THRONE - HIGHLY VISIBLE in center background === */}
        {/* Massive throne glow - icy power emanating from the throne */}
        <ellipse cx="500" cy="150" rx="280" ry="180" fill={WC3.ft.iceMid} filter="url(#iceGlow)" opacity="0.25" />
        <ellipse cx="500" cy="120" rx="180" ry="100" fill={WC3.ft.iceBright} filter="url(#iceGlow)" opacity="0.2" />
        <ellipse cx="500" cy="100" rx="80" ry="50" fill={WC3.ft.iceBright} filter="url(#iceGlow)" opacity="0.35" />

        {/* The Frozen Throne structure - NO BLUR, higher opacity */}
        <g transform="translate(500, 80)" opacity="0.75">
          {/* Throne base - massive ice platform with ice-blue tint */}
          <polygon points="-200,320 -170,220 -130,250 -80,160 -40,190 0,100 40,190 80,160 130,250 170,220 200,320" fill="#1a3050" />
          <polygon points="-180,300 -150,240 -100,260 -50,200 50,200 100,260 150,240 180,300" fill="#152840" />
          {/* Ice steps cascading down */}
          <polygon points="-220,320 -200,280 -160,295 -100,260 100,260 160,295 200,280 220,320" fill="#102538" />
          <polygon points="-160,300 -120,275 -70,290 70,290 120,275 160,300" fill="#0d2030" opacity="0.8" />

          {/* Central throne spire - Lich King's seat - PROMINENT */}
          <polygon points="-50,180 -35,100 -20,130 0,30 20,130 35,100 50,180" fill="#1e3855" />
          <polygon points="-35,150 -20,80 0,40 20,80 35,150" fill={WC3.ft.iceDark} opacity="0.8" />
          {/* Inner ice glow of throne */}
          <polygon points="-20,130 0,50 20,130" fill={WC3.ft.iceMid} opacity="0.6" />
          <polygon points="-12,110 0,60 12,110" fill={WC3.ft.iceBright} opacity="0.4" />

          {/* Ice crown at apex - GLOWING BRIGHTLY */}
          <polygon points="-15,70 0,20 15,70" fill={WC3.ft.iceMid} opacity="0.8" />
          <polygon points="-10,60 0,25 10,60" fill={WC3.ft.iceBright} opacity="0.7" />
          <polygon points="-6,50 0,30 6,50" fill="#ffffff" opacity="0.5" />
          {/* Crown power glow */}
          <ellipse cx="0" cy="35" rx="30" ry="25" fill={WC3.ft.iceBright} opacity="0.5" filter="url(#iceGlow)" />
          <ellipse cx="0" cy="30" rx="15" ry="12" fill="#ffffff" opacity="0.3" filter="url(#iceGlow)" />

          {/* Flanking spires - left - taller */}
          <polygon points="-120,240 -105,140 -95,170 -80,90 -70,150 -55,240" fill="#1a3048" />
          <polygon points="-95,120 -80,90 -70,115" fill={WC3.ft.iceMid} opacity="0.5" />
          <polygon points="-150,280 -140,200 -130,280" fill="#152840" />

          {/* Flanking spires - right - taller */}
          <polygon points="55,240 70,150 80,90 95,170 105,140 120,240" fill="#1a3048" />
          <polygon points="70,115 80,90 95,120" fill={WC3.ft.iceMid} opacity="0.5" />
          <polygon points="130,280 140,200 150,280" fill="#152840" />

          {/* Outer tower spires */}
          <polygon points="-170,300 -155,190 -140,300" fill="#12253a" />
          <polygon points="140,300 155,190 170,300" fill="#12253a" />

          {/* Ice detail highlights */}
          <line x1="-30" y1="160" x2="0" y2="60" stroke={WC3.ft.iceBright} strokeWidth="1" opacity="0.3" />
          <line x1="30" y1="160" x2="0" y2="60" stroke={WC3.ft.iceBright} strokeWidth="1" opacity="0.3" />
        </g>

        {/* === FAR LAYER - Distant mountain ranges === */}
        <g filter="url(#ftDistantBlur)" opacity="0.35">
          {/* Distant mountain range - far left */}
          <polygon points="0,220 30,120 60,150 100,80 140,130 180,100 220,160 260,220" fill="#061525" />
          <polygon points="80,100 100,80 120,95" fill={WC3.ft.iceDark} opacity="0.4" />

          {/* Distant peaks - far right */}
          <polygon points="740,220 780,110 820,140 860,70 900,120 940,90 980,150 1000,220" fill="#061525" />
          <polygon points="840,90 860,70 880,85" fill={WC3.ft.iceDark} opacity="0.4" />
        </g>

        {/* === MID LAYER - Ice citadels, frozen structures === */}
        <g filter="url(#ftMidBlur)" opacity="0.4">
          {/* Ice citadel left */}
          <g transform="translate(120, 250)">
            <polygon points="0,150 20,60 40,80 60,30 80,70 100,50 120,150" fill="#0a1a30" />
            <polygon points="50,50 60,30 70,45" fill={WC3.ft.iceMid} opacity="0.25" />
            {/* Ice bridge remnant */}
            <path d="M120,100 Q180,90 200,120" stroke="#102030" strokeWidth="8" fill="none" />
          </g>

          {/* Frozen fortress ruins center-left */}
          <g transform="translate(280, 280)">
            <polygon points="0,120 15,50 35,60 50,20 65,55 85,40 100,120" fill="#081828" />
            <rect x="40" y="30" width="20" height="30" fill={WC3.ft.iceDark} opacity="0.3" />
          </g>

          {/* Ice citadel right */}
          <g transform="translate(750, 260)">
            <polygon points="0,140 25,70 50,90 75,40 100,85 125,60 150,140" fill="#0a1a30" />
            <polygon points="65,55 75,40 85,50" fill={WC3.ft.iceMid} opacity="0.25" />
          </g>

          {/* Mid-range mountain ridges */}
          <polygon points="0,400 40,320 90,350 140,280 200,330 260,290 320,360 380,310 440,380 500,340 560,390 620,320 680,370 740,300 800,350 860,310 920,380 980,330 1000,400" fill="#081828" />

          {/* Ice formations on ridge */}
          <polygon points="130,300 140,280 150,295" fill={WC3.ft.iceMid} opacity="0.2" />
          <polygon points="250,310 260,290 270,305" fill={WC3.ft.iceMid} opacity="0.2" />
          <polygon points="730,320 740,300 750,315" fill={WC3.ft.iceMid} opacity="0.2" />
        </g>

        {/* === NEAR LAYER - Foreground ice, frozen lake, spires === */}
        <g opacity="0.5">
          {/* Frozen lake surface */}
          <ellipse cx="500" cy="650" rx="400" ry="80" fill="#0a1525" opacity="0.4" />
          <ellipse cx="500" cy="650" rx="350" ry="60" fill={WC3.ft.iceDark} opacity="0.15" />
          {/* Ice cracks on lake */}
          <path d="M200,640 L280,660 L320,645 L400,670 L450,650" stroke={WC3.ft.iceMid} strokeWidth="1" opacity="0.2" fill="none" />
          <path d="M550,660 L620,640 L700,665 L780,645" stroke={WC3.ft.iceMid} strokeWidth="1" opacity="0.2" fill="none" />

          {/* Large ice spire left foreground */}
          <g transform="translate(80, 500)">
            <polygon points="0,200 25,50 40,80 55,0 70,75 95,40 120,200" fill="#102540" />
            <polygon points="45,30 55,0 65,25" fill={WC3.ft.iceBright} opacity="0.3" />
            <polygon points="30,100 40,80 50,95" fill={WC3.ft.iceMid} opacity="0.2" />
          </g>

          {/* Ice crystal cluster left */}
          <g transform="translate(200, 580)">
            <polygon points="0,120 10,40 20,120" fill={WC3.ft.iceDark} opacity="0.6" />
            <polygon points="20,120 35,20 50,120" fill={WC3.ft.iceMid} opacity="0.5" />
            <polygon points="40,120 50,50 60,120" fill={WC3.ft.iceDark} opacity="0.5" />
          </g>

          {/* Ice spire right foreground */}
          <g transform="translate(820, 520)">
            <polygon points="0,180 30,60 50,90 70,10 90,85 120,50 150,180" fill="#102540" />
            <polygon points="60,40 70,10 80,35" fill={WC3.ft.iceBright} opacity="0.3" />
          </g>

          {/* Ice crystal cluster right */}
          <g transform="translate(750, 600)">
            <polygon points="0,100 12,30 24,100" fill={WC3.ft.iceDark} opacity="0.5" />
            <polygon points="18,100 35,10 52,100" fill={WC3.ft.iceMid} opacity="0.5" />
            <polygon points="45,100 55,45 65,100" fill={WC3.ft.iceDark} opacity="0.4" />
          </g>

          {/* Scattered ice shards on ground */}
          <polygon points="350,720 360,690 370,720" fill={WC3.ft.iceMid} opacity="0.25" />
          <polygon points="420,730 428,705 436,730" fill={WC3.ft.iceDark} opacity="0.3" />
          <polygon points="560,725 570,695 580,725" fill={WC3.ft.iceMid} opacity="0.25" />
          <polygon points="630,735 640,710 650,735" fill={WC3.ft.iceDark} opacity="0.3" />

          {/* Frost mist on ground */}
          <ellipse cx="200" cy="750" rx="150" ry="30" fill={WC3.ft.iceDark} opacity="0.15" />
          <ellipse cx="500" cy="780" rx="200" ry="40" fill={WC3.ft.iceMid} opacity="0.1" />
          <ellipse cx="800" cy="760" rx="150" ry="30" fill={WC3.ft.iceDark} opacity="0.15" />
        </g>

        {/* Ground plane fade */}
        <rect x="0" y="200" width="1000" height="650" fill="url(#ftGroundFade)" />

        {/* Perspective lines (subtle, icy) */}
        <g opacity="0.06">
          {[-50, -30, -15, 0, 15, 30, 50].map((offset, i) => (
            <line key={i} x1={500 + offset * 2} y1="150" x2={offset < 0 ? -300 : offset > 0 ? 1300 : 500} y2="850" stroke="#203040" strokeWidth="1" />
          ))}
        </g>
      </svg>

      {/* Volumetric blizzard clouds */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '45%' }} viewBox="0 0 1000 450" preserveAspectRatio="none">
        <defs>
          <filter id="iceCloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
          <filter id="iceCloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <radialGradient id="iceCloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1a2535" />
            <stop offset="60%" stopColor="#0d1822" />
            <stop offset="100%" stopColor="#060a10" />
          </radialGradient>
        </defs>
        {/* Far background clouds - massive blizzard wall */}
        <g filter="url(#iceCloudBlur)" opacity="0.5">
          <ellipse cx="150" cy="80" rx="300" ry="100" fill="#081420" />
          <ellipse cx="500" cy="60" rx="400" ry="120" fill="#0a1828" />
          <ellipse cx="850" cy="90" rx="320" ry="110" fill="#081420" />
        </g>
        {/* Mid clouds - storm mass */}
        <g filter="url(#iceCloudBlurLight)" opacity="0.7">
          <ellipse cx="200" cy="150" rx="250" ry="80" fill="url(#iceCloudCore)" />
          <ellipse cx="480" cy="120" rx="320" ry="100" fill="url(#iceCloudCore)" />
          <ellipse cx="780" cy="160" rx="280" ry="85" fill="url(#iceCloudCore)" />
        </g>
        {/* Front detail clouds */}
        <g opacity="0.4">
          <ellipse cx="100" cy="250" rx="150" ry="45" fill="#0d1a25" />
          <ellipse cx="350" cy="220" rx="180" ry="55" fill="#081520" />
          <ellipse cx="600" cy="240" rx="200" ry="50" fill="#0d1a25" />
          <ellipse cx="880" cy="230" rx="160" ry="45" fill="#081520" />
        </g>
      </svg>

      {/* === VIGNETTE LIGHTING - Icy center glow === */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 35%, ${WC3.ft.iceMid}08 0%, transparent 50%),
          radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Corner frost darkening */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '35%',
        height: '45%',
        background: `radial-gradient(ellipse at 0% 0%, rgba(0,5,15,0.6) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '35%',
        height: '45%',
        background: `radial-gradient(ellipse at 100% 0%, rgba(0,5,15,0.6) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '40%',
        height: '40%',
        background: `radial-gradient(ellipse at 0% 100%, rgba(0,5,15,0.7) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '40%',
        height: '40%',
        background: `radial-gradient(ellipse at 100% 100%, rgba(0,5,15,0.7) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Icy aurora/glow bands */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '10%',
        width: '45%',
        height: '30%',
        background: `radial-gradient(ellipse at 30% 40%, ${WC3.ft.iceMid}15 0%, ${WC3.ft.iceDark}08 40%, transparent 70%)`,
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '8%',
        width: '40%',
        height: '25%',
        background: `radial-gradient(ellipse at 60% 50%, ${WC3.ft.iceBright}12 0%, ${WC3.ft.iceMid}08 50%, transparent 80%)`,
        filter: 'blur(45px)',
      }} />

      {/* === INVINCIBLE - Standing beside Lich King === */}
      <svg
        style={{
          position: 'absolute',
          left: '1%',
          bottom: '3%',
          width: '160px',
          height: '200px',
          filter: `drop-shadow(0 0 20px ${WC3.ft.iceMid}50)`,
        }}
        viewBox="-40 -20 300 320"
      >
        <defs>
          <linearGradient id="horseBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a3545" />
            <stop offset="100%" stopColor="#151d28" />
          </linearGradient>
          <filter id="frostGlowHorse">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="smokeBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Ghostly aura around entire horse */}
        <ellipse cx="110" cy="180" rx="100" ry="70" fill={WC3.ft.iceMid} opacity="0.08" filter="url(#frostGlowHorse)">
          <animate attributeName="opacity" values="0.05;0.12;0.05" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* === BACK LEGS with SMOKE === */}
        <g>
          <polygon points="145,130 152,165 156,210 160,250 150,252 144,215 140,170 138,135" fill="url(#horseBody)" />
          <polygon points="160,250 150,252 148,260 158,262" fill="#0d1218" />
          {/* Blue smoke from back left hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="154" cy="255" rx="12" ry="8" fill={WC3.ft.iceMid} opacity="0.25">
              <animate attributeName="ry" values="8;15;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2s" repeatCount="indefinite" />
              <animate attributeName="cy" values="255;245;255" dur="2s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>
        <g>
          <polygon points="165,125 175,158 180,200 184,245 174,248 168,205 162,162 158,130" fill="url(#horseBody)" />
          <polygon points="184,245 174,248 172,256 182,258" fill="#0d1218" />
          {/* Blue smoke from back right hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="178" cy="250" rx="10" ry="7" fill={WC3.ft.iceBright} opacity="0.2">
              <animate attributeName="ry" values="7;14;7" dur="2.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.08;0.2" dur="2.3s" repeatCount="indefinite" />
              <animate attributeName="cy" values="250;238;250" dur="2.3s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* === FRONT LEGS with SMOKE === */}
        <g>
          <polygon points="50,140 44,175 38,215 34,255 44,257 50,220 56,180 58,145" fill="#1a2535" />
          <polygon points="34,255 44,257 46,265 36,267" fill="#0d1218" />
          {/* Blue smoke from front left hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="40" cy="260" rx="14" ry="9" fill={WC3.ft.iceMid} opacity="0.3">
              <animate attributeName="ry" values="9;18;9" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="cy" values="260;248;260" dur="1.8s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>
        <g>
          <polygon points="70,135 65,170 60,210 55,250 65,252 72,215 78,175 76,140" fill="url(#horseBody)" />
          <polygon points="55,250 65,252 67,260 57,262" fill="#0d1218" />
          {/* Blue smoke from front right hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="61" cy="255" rx="11" ry="8" fill={WC3.ft.iceBright} opacity="0.22">
              <animate attributeName="ry" values="8;16;8" dur="2.1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.22;0.08;0.22" dur="2.1s" repeatCount="indefinite" />
              <animate attributeName="cy" values="255;242;255" dur="2.1s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* BODY */}
        <path d="M50,115 Q30,110 35,135 L50,145 L65,120 Q95,95 125,95 Q160,95 180,115 L195,140 Q200,120 188,105 Q170,85 125,80 Q80,85 50,115 Z" fill="url(#horseBody)" />
        <path d="M50,115 L35,135 L50,145 L70,125 Z" fill="#2a3a4d" />
        <path d="M180,115 L195,140 L180,145 L165,120 Z" fill="#2a3a4d" />
        <path d="M65,140 Q120,160 175,140 L175,125 Q120,140 65,125 Z" fill="#151d28" />

        {/* ARMOR PLATE */}
        <path d="M75,100 Q125,80 175,105 L168,118 Q125,100 82,118 Z" fill="#1a2535" />
        <path d="M85,108 Q125,95 165,110" stroke={WC3.ft.iceMid} strokeWidth="2" opacity="0.3" fill="none" />
        <circle cx="125" cy="102" r="5" fill="none" stroke={WC3.ft.iceMid} strokeWidth="1.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* NECK */}
        <polygon points="50,115 25,80 10,55 30,45 50,65 65,105" fill="url(#horseBody)" />
        <polygon points="50,115 25,80 38,88 58,108" fill="#2a3a4d" />

        {/* HEAD - undead horse skull */}
        <g transform="translate(5, 40)">
          <polygon points="5,20 -10,5 -25,-15 -30,-40 -22,-50 -5,-45 12,-35 20,-15 25,10" fill="url(#horseBody)" />
          <polygon points="-10,5 -25,-15 -22,-22 -5,-8 5,5" fill="#2a3a4d" />
          <polygon points="-5,-45 -22,-50 -28,-42 -12,-30 5,-35" fill="#1a2535" />

          {/* GLOWING EYES - intense blue */}
          <ellipse cx="0" cy="-22" rx="7" ry="5" fill="#0a0a12" />
          <ellipse cx="0" cy="-22" rx="5" ry="4" fill={WC3.ft.iceBright} filter="url(#frostGlowHorse)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="-22" rx="2" ry="1.5" fill="#ffffff" opacity="0.8" />

          {/* BLUE SMOKE from eyes */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="8" cy="-28" rx="10" ry="6" fill={WC3.ft.iceMid} opacity="0.35">
              <animate attributeName="cx" values="8;18;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="15" cy="-32" rx="8" ry="5" fill={WC3.ft.iceBright} opacity="0.2">
              <animate attributeName="cx" values="15;28;15" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* BLUE SMOKE from nostrils */}
          <ellipse cx="-28" cy="-45" rx="3" ry="4" fill="#0a0808" />
          <g filter="url(#smokeBlur)">
            <ellipse cx="-32" cy="-52" rx="8" ry="5" fill={WC3.ft.iceMid} opacity="0.3">
              <animate attributeName="cy" values="-52;-65;-52" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur="3s" repeatCount="indefinite" />
            </ellipse>
          </g>

          <polygon points="12,-35 18,-55 26,-42 18,-32" fill="url(#horseBody)" />
          <path d="M-5,-8 L8,-28 M15,-18 L-5,-42" stroke="#1a2535" strokeWidth="3" fill="none" />
        </g>

        {/* MANE - ghostly ice wisps */}
        <g style={{ animation: 'capeWave 3s ease-in-out infinite' }}>
          <path d="M30,45 Q50,15 38,-15 Q65,10 58,45" fill={WC3.ft.iceDark} opacity="0.4" />
          <path d="M42,55 Q68,15 62,-20" stroke={WC3.ft.iceMid} strokeWidth="3" fill="none" opacity="0.35" />
          <path d="M52,70 Q78,30 72,0" stroke={WC3.ft.iceBright} strokeWidth="2" fill="none" opacity="0.25" />
        </g>

        {/* TAIL - ghostly */}
        <g style={{ animation: 'capeWave 4s ease-in-out infinite reverse' }}>
          <path d="M200,120 Q225,115 245,135 Q240,160 215,155 Q222,135 200,128" fill={WC3.ft.iceDark} opacity="0.35" />
          <path d="M205,128 Q230,122 242,145" stroke={WC3.ft.iceMid} strokeWidth="2.5" fill="none" opacity="0.3" />
        </g>

        {/* Ground frost */}
        <ellipse cx="110" cy="265" rx="80" ry="12" fill={WC3.ft.iceMid} opacity="0.15" filter="url(#frostGlowHorse)" />
      </svg>

      {/* === ALEXANDER AS LICH KING - WC3 Style Armor === */}
      <svg
        style={{
          position: 'absolute',
          left: '11%',
          bottom: '3%',
          width: '120px',
          height: '190px',
          filter: `drop-shadow(0 0 18px ${WC3.ft.iceMid}50)`,
        }}
        viewBox="0 0 200 320"
      >
        <defs>
          <linearGradient id="frostmourneGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={WC3.ft.iceDark} />
            <stop offset="50%" stopColor={WC3.ft.iceMid} />
            <stop offset="100%" stopColor={WC3.ft.iceBright} />
          </linearGradient>
          <linearGradient id="lichArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a3545" />
            <stop offset="50%" stopColor="#1a2535" />
            <stop offset="100%" stopColor="#0d1520" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a84b" />
            <stop offset="50%" stopColor="#b8923e" />
            <stop offset="100%" stopColor="#8a6d2f" />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1515" />
            <stop offset="40%" stopColor="#4a4545" />
            <stop offset="70%" stopColor="#8a8585" />
            <stop offset="100%" stopColor="#d0d0d5" />
          </linearGradient>
          <linearGradient id="undeadSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a5a4a" />
            <stop offset="100%" stopColor="#5a4a3a" />
          </linearGradient>
          <filter id="frostGlow">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cape - dark with fur trim, wave animation */}
        <g style={{ animation: 'capeWave 3s ease-in-out infinite', transformOrigin: '100px 120px' }}>
          <path d="M55,95 Q20,150 12,240 L8,310 L192,310 L188,240 Q180,150 145,95" fill="#080c15" opacity="0.9" />
          <path d="M60,100 Q28,155 22,235 L18,305 L182,305 L178,235 Q172,155 140,100" fill="#0a1018" />
          {/* Fur trim at shoulders */}
          <ellipse cx="55" cy="98" rx="12" ry="6" fill="#4a3a2a" />
          <ellipse cx="145" cy="98" rx="12" ry="6" fill="#4a3a2a" />
        </g>

        {/* === MASSIVE LEGS - Strong warrior === */}
        <path d="M60,215 L50,265 L45,305 L75,310 L82,272 L88,220" fill="url(#lichArmor)" />
        <path d="M112,215 L118,272 L125,310 L155,305 L150,265 L140,220" fill="url(#lichArmor)" />
        {/* Gold trim on massive legs */}
        <path d="M50,265 L82,270 M150,265 L118,270" stroke="url(#goldTrim)" strokeWidth="2.5" fill="none" />
        {/* Skull knee guards - positioned for bigger legs */}
        <ellipse cx="70" cy="232" rx="14" ry="10" fill="#1a2535" />
        <circle cx="70" cy="230" r="5" fill="#0d1520" />
        <circle cx="66" cy="227" r="2" fill={WC3.ft.iceMid} opacity="0.4" />
        <circle cx="74" cy="227" r="2" fill={WC3.ft.iceMid} opacity="0.4" />
        <ellipse cx="130" cy="232" rx="14" ry="10" fill="#1a2535" />
        <circle cx="130" cy="230" r="5" fill="#0d1520" />
        <circle cx="126" cy="227" r="2" fill={WC3.ft.iceMid} opacity="0.4" />
        <circle cx="134" cy="227" r="2" fill={WC3.ft.iceMid} opacity="0.4" />
        {/* Massive boots */}
        <ellipse cx="60" cy="308" rx="18" ry="7" fill="#0d1218" />
        <ellipse cx="140" cy="308" rx="18" ry="7" fill="#0d1218" />
        <path d="M45,305 L75,305 M125,305 L155,305" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />

        {/* === TORSO with skull chest plate === */}
        <g style={{ animation: 'breathe 4s ease-in-out infinite', transformOrigin: '100px 160px' }}>
          {/* Main chest plate */}
          <path d="M60,92 L68,75 L100,68 L132,75 L140,92 L145,160 L135,200 L100,210 L65,200 L55,160 Z" fill="url(#lichArmor)" />
          {/* Gold trim on chest */}
          <path d="M60,92 L68,75 L100,68 L132,75 L140,92" stroke="url(#goldTrim)" strokeWidth="2.5" fill="none" />
          <path d="M65,200 L100,210 L135,200" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
          {/* V-shaped chest detail */}
          <path d="M75,95 L100,85 L125,95 L125,145 L100,160 L75,145 Z" fill="#151d28" />
          <path d="M75,95 L100,85 L125,95" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />
          {/* SKULL on chest */}
          <ellipse cx="100" cy="125" rx="15" ry="12" fill="#2a3545" />
          <ellipse cx="100" cy="123" rx="12" ry="10" fill="#1a2535" />
          <ellipse cx="94" cy="120" rx="4" ry="3" fill="#0d1520" />
          <ellipse cx="106" cy="120" rx="4" ry="3" fill="#0d1520" />
          <ellipse cx="94" cy="120" rx="2" ry="1.5" fill={WC3.ft.iceMid} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="106" cy="120" rx="2" ry="1.5" fill={WC3.ft.iceMid} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <path d="M100,126 L97,132 L103,132 Z" fill="#0d1520" />
          {/* Belt with skull buckle */}
          <rect x="60" y="175" width="80" height="15" fill="#1a2535" />
          <path d="M60,175 L140,175 M60,190 L140,190" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />
          <ellipse cx="100" cy="182" rx="10" ry="7" fill="#2a3545" />
          <circle cx="96" cy="180" rx="2" fill="#0d1520" />
          <circle cx="104" cy="180" rx="2" fill="#0d1520" />
        </g>

        {/* === MASSIVE SHOULDER PAULDRONS with spikes === */}
        {/* Left pauldron */}
        <g>
          <ellipse cx="45" cy="88" rx="28" ry="18" fill="url(#lichArmor)" />
          <ellipse cx="45" cy="88" rx="24" ry="15" fill="#1a2535" />
          {/* Gold trim */}
          <ellipse cx="45" cy="88" rx="28" ry="18" fill="none" stroke="url(#goldTrim)" strokeWidth="2" />
          {/* Spikes */}
          <polygon points="25,82 15,55 30,78" fill="#2a3545" />
          <polygon points="35,78 22,48 38,74" fill="#1a2535" />
          <polygon points="45,75 38,42 50,72" fill="#2a3545" />
          <polygon points="55,78 58,48 52,74" fill="#1a2535" />
          {/* Gold tips on spikes */}
          <circle cx="15" cy="57" r="3" fill="url(#goldTrim)" />
          <circle cx="22" cy="50" r="2.5" fill="url(#goldTrim)" />
          <circle cx="38" cy="44" r="3" fill="url(#goldTrim)" />
          <circle cx="58" cy="50" r="2.5" fill="url(#goldTrim)" />
          {/* Skull ornament */}
          <circle cx="45" cy="92" r="6" fill="#0d1520" />
          <circle cx="42" cy="90" r="1.5" fill={WC3.ft.iceMid} opacity="0.4" />
          <circle cx="48" cy="90" r="1.5" fill={WC3.ft.iceMid} opacity="0.4" />
        </g>
        {/* Right pauldron */}
        <g>
          <ellipse cx="155" cy="88" rx="28" ry="18" fill="url(#lichArmor)" />
          <ellipse cx="155" cy="88" rx="24" ry="15" fill="#1a2535" />
          <ellipse cx="155" cy="88" rx="28" ry="18" fill="none" stroke="url(#goldTrim)" strokeWidth="2" />
          <polygon points="145,78 142,48 148,74" fill="#1a2535" />
          <polygon points="155,75 162,42 150,72" fill="#2a3545" />
          <polygon points="165,78 178,48 162,74" fill="#1a2535" />
          <polygon points="175,82 185,55 170,78" fill="#2a3545" />
          <circle cx="142" cy="50" r="2.5" fill="url(#goldTrim)" />
          <circle cx="162" cy="44" r="3" fill="url(#goldTrim)" />
          <circle cx="178" cy="50" r="2.5" fill="url(#goldTrim)" />
          <circle cx="185" cy="57" r="3" fill="url(#goldTrim)" />
          <circle cx="155" cy="92" r="6" fill="#0d1520" />
          <circle cx="152" cy="90" r="1.5" fill={WC3.ft.iceMid} opacity="0.4" />
          <circle cx="158" cy="90" r="1.5" fill={WC3.ft.iceMid} opacity="0.4" />
        </g>

        {/* === MASSIVE ARMS - Strong warrior, with gauntlets === */}
        {/* Left arm - raised, no weapon */}
        <path d="M32,100 L15,138 L8,180 L32,185 L42,145 L52,105" fill="url(#lichArmor)" />
        <path d="M15,138 L42,143" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
        <polygon points="8,180 0,168 18,175" fill="#1a2535" />
        <polygon points="15,178 5,165 22,172" fill="#1a2535" />

        {/* Right arm - HOLDING FROSTMOURNE */}
        <path d="M168,100 L185,138 L192,175 L168,180 L158,142 L148,105" fill="url(#lichArmor)" />
        <path d="M185,138 L158,143" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
        {/* Gauntlet holding sword handle */}
        <ellipse cx="185" cy="178" rx="12" ry="10" fill="url(#lichArmor)" />
        <ellipse cx="185" cy="178" rx="12" ry="10" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />

        {/* === FROSTMOURNE - IN HIS RIGHT HAND === */}
        <g transform="translate(185, 175) rotate(-5)">
          {/* Blade glow */}
          <ellipse cx="0" cy="90" rx="18" ry="95" fill={WC3.ft.iceBright} opacity="0.15" filter="url(#frostGlow)">
            <animate attributeName="opacity" values="0.1;0.22;0.1" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Blade pointing down */}
          <path d="M0,15 L8,25 L11,70 L10,140 L7,190 L0,210 L-7,190 L-10,140 L-11,70 L-8,25 Z" fill="url(#frostmourneGlow)" />
          <path d="M0,25 L4,35 L4,135 L0,160 L-4,135 L-4,35 Z" fill={WC3.ft.iceBright} opacity="0.5" />
          {/* Blade serrations */}
          <path d="M10,60 L16,55 L12,70" fill="url(#frostmourneGlow)" />
          <path d="M-10,60 L-16,55 L-12,70" fill="url(#frostmourneGlow)" />

          {/* Runes - pulsing */}
          <path d="M0,50 L3,60 L0,70 L-3,60 Z" fill={WC3.ft.iceBright}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M0,95 L4,108 L0,121 L-4,108 Z" fill={WC3.ft.iceBright}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
          </path>
          <path d="M0,145 L3,156 L0,167 L-3,156 Z" fill={WC3.ft.iceBright}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.1s" repeatCount="indefinite" />
          </path>

          {/* Crossguard - skull motif - at hand level */}
          <path d="M-30,8 L0,15 L30,8 L24,20 L0,25 L-24,20 Z" fill="#1a2535" />
          <path d="M-30,8 L0,15 L30,8" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
          <ellipse cx="0" cy="12" rx="8" ry="6" fill="#0d1520" />
          <circle cx="-4" cy="10" r="2" fill={WC3.ft.iceMid} opacity="0.6" />
          <circle cx="4" cy="10" r="2" fill={WC3.ft.iceMid} opacity="0.6" />

          {/* Handle - in gauntlet */}
          <rect x="-5" y="-8" width="10" height="20" fill="#0a1018" rx="2" />
          <path d="M-5,-8 L5,-8 M-5,12 L5,12" stroke="url(#goldTrim)" strokeWidth="1" />
          {/* Pommel */}
          <circle cx="0" cy="-14" r="7" fill="#1a2535" />
          <circle cx="0" cy="-14" r="7" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />
          <circle cx="0" cy="-14" r="4" fill="#0d1520" />
        </g>

        {/* Neck gorget with gold trim */}
        <ellipse cx="100" cy="68" rx="18" ry="7" fill="#1a2535" />
        <ellipse cx="100" cy="68" rx="18" ry="7" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />

        {/* === ALEXANDER'S HEAD - DARKER UNDEAD SKIN === */}
        <ellipse cx="100" cy="58" rx="10" ry="6" fill="url(#undeadSkin)" />
        <ellipse cx="100" cy="40" rx="20" ry="24" fill="url(#undeadSkin)" />

        {/* LONG FLOWING HAIR - Arthas style, white/silver flowing down */}
        {/* Hair mass at top of head */}
        <path d="M80,38 Q75,18 88,10 Q100,5 112,10 Q125,18 120,38 L116,32 Q108,24 100,24 Q92,24 84,32 Z" fill="#1a1515" />

        {/* Left side hair - flows DOWN naturally alongside face/armor */}
        <g opacity="0.95">
          {/* Back layer - darkest */}
          <path d="M82,35 Q78,50 75,80 Q72,120 70,160 Q68,190 65,220" stroke="#2a2525" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M84,38 Q80,55 77,90 Q74,130 72,170 Q70,200 68,230" stroke="#4a4545" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Mid layer */}
          <path d="M85,40 Q82,60 80,100 Q78,140 76,180 Q74,210 72,240" stroke="#7a7575" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Front layer - lightest (white tips) */}
          <path d="M86,42 Q84,65 82,105 Q80,145 78,185 Q76,215 75,245" stroke="#a8a8a8" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M87,45 Q85,70 84,110 Q82,150 80,190 Q78,220 78,250" stroke="#c8c8c8" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Right side hair - flows DOWN naturally alongside face/armor */}
        <g opacity="0.95">
          {/* Back layer - darkest */}
          <path d="M118,35 Q122,50 125,80 Q128,120 130,160 Q132,190 135,220" stroke="#2a2525" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M116,38 Q120,55 123,90 Q126,130 128,170 Q130,200 132,230" stroke="#4a4545" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Mid layer */}
          <path d="M115,40 Q118,60 120,100 Q122,140 124,180 Q126,210 128,240" stroke="#7a7575" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Front layer - lightest (white tips) */}
          <path d="M114,42 Q116,65 118,105 Q120,145 122,185 Q124,215 125,245" stroke="#a8a8a8" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M113,45 Q115,70 116,110 Q118,150 120,190 Q122,220 122,250" stroke="#c8c8c8" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Ears - small, covered by hair */}
        <ellipse cx="80" cy="44" rx="4" ry="5" fill="url(#undeadSkin)" />
        <ellipse cx="120" cy="44" rx="4" ry="5" fill="url(#undeadSkin)" />

        {/* NOSE */}
        <path d="M100,45 L95,55 L105,55 Z" fill="#5a4a3a" />

        {/* MOUTH - stern frown */}
        <path d="M92,60 Q100,58 108,60" stroke="#3a2a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Beard - BLACK */}
        <path d="M84,58 Q78,70 84,82 Q92,92 100,94 Q108,92 116,82 Q122,70 116,58 Q108,68 100,70 Q92,68 84,58" fill="#0a0808" />

        {/* EYES - dark ovals with ice glow */}
        <ellipse cx="90" cy="42" rx="4.5" ry="3.5" fill="#1a1210" />
        <ellipse cx="110" cy="42" rx="4.5" ry="3.5" fill="#1a1210" />
        <ellipse cx="90" cy="42" rx="6.5" ry="5" fill={WC3.ft.iceBright} opacity="0.2" filter="url(#frostGlow)">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="110" cy="42" rx="6.5" ry="5" fill={WC3.ft.iceBright} opacity="0.2" filter="url(#frostGlow)">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Angry eyebrows - dark */}
        <path d="M82,35 L92,40" stroke="#1a1515" strokeWidth="3" strokeLinecap="round" />
        <path d="M108,40 L118,35" stroke="#1a1515" strokeWidth="3" strokeLinecap="round" />

        {/* Frost breath */}
        <ellipse cx="110" cy="72" rx="12" ry="6" fill={WC3.ft.frostWhite} opacity="0.15" filter="url(#frostGlow)">
          <animate attributeName="opacity" values="0.1;0.22;0.1" dur="3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="12;20;12" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Ground frost */}
        <ellipse cx="100" cy="315" rx="90" ry="12" fill={WC3.ft.iceMid} opacity="0.1" filter="url(#frostGlow)" />
      </svg>

      <style>{`
        @keyframes capeWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }
      `}</style>

      {/* Horizontal wind/frost streaks - blow RIGHT to LEFT */}
      {windStreaks.map((streak) => (
        <div
          key={streak.id}
          style={{
            position: 'absolute',
            top: `${streak.y}%`,
            right: '-15%',
            width: streak.length,
            height: streak.thickness,
            background: `linear-gradient(270deg, transparent 0%, ${WC3.ft.frostWhite}30 30%, ${WC3.ft.frostWhite}50 50%, ${WC3.ft.frostWhite}30 70%, transparent 100%)`,
            animation: `windStreak ${streak.duration}s linear infinite`,
            animationDelay: `${streak.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Far snow layer */}
      {snowLayers.far.map((flake) => (
        <div
          key={`far-${flake.id}`}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-3%',
            width: flake.size,
            height: flake.size,
            borderRadius: '50%',
            background: WC3.ft.frostMid,
            opacity: 0.4,
            animation: `blizzardFar ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}

      {/* Mid snow layer */}
      {snowLayers.mid.map((flake) => (
        <div
          key={`mid-${flake.id}`}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-5%',
            width: flake.size,
            height: flake.size,
            borderRadius: '50%',
            background: WC3.ft.frostWhite,
            opacity: 0.6,
            animation: `blizzardMid ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}

      {/* Near snow layer - motion blur effect */}
      {snowLayers.near.map((flake) => (
        <div
          key={`near-${flake.id}`}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-8%',
            width: flake.size,
            height: flake.size * 2.5,
            borderRadius: '40%',
            background: `linear-gradient(180deg, ${WC3.ft.frostWhite}80 0%, ${WC3.ft.frostWhite}20 100%)`,
            opacity: 0.7,
            animation: `blizzardNear ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* === SEMI-BURIED SKELETONS near footer === */}
      {/* Skeleton 1 - left side, arm reaching up */}
      <svg
        style={{
          position: 'absolute',
          left: '8%',
          bottom: '2%',
          width: '60px',
          height: '80px',
          opacity: 0.35,
        }}
        viewBox="0 0 60 80"
      >
        {/* Arm bones reaching up from snow */}
        <path d="M30,80 L30,50 L25,35 L20,20" stroke="#c8c0b0" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M30,50 L35,35 L40,22" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Hand bones */}
        <path d="M20,20 L15,10" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M20,20 L18,8" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M20,20 L22,9" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Snow covering base */}
        <ellipse cx="30" cy="78" rx="18" ry="6" fill={WC3.ft.frostWhite} opacity="0.4" />
      </svg>

      {/* Skeleton 2 - right side, skull half visible */}
      <svg
        style={{
          position: 'absolute',
          right: '12%',
          bottom: '3%',
          width: '50px',
          height: '45px',
          opacity: 0.3,
        }}
        viewBox="0 0 50 45"
      >
        {/* Half-buried skull */}
        <ellipse cx="25" cy="30" rx="18" ry="15" fill="#d4ccc0" />
        <ellipse cx="25" cy="28" rx="14" ry="12" fill="#c8c0b0" />
        {/* Eye socket */}
        <ellipse cx="18" cy="25" rx="4" ry="5" fill="#1a1a2e" />
        <ellipse cx="32" cy="25" rx="4" ry="5" fill="#1a1a2e" />
        {/* Faint ice glow in sockets */}
        <ellipse cx="18" cy="25" rx="2" ry="2.5" fill={WC3.ft.iceMid} opacity="0.2" />
        <ellipse cx="32" cy="25" rx="2" ry="2.5" fill={WC3.ft.iceMid} opacity="0.2" />
        {/* Nose hole */}
        <path d="M25,28 L23,32 L27,32 Z" fill="#2a2a3e" />
        {/* Snow covering lower half */}
        <ellipse cx="25" cy="42" rx="22" ry="8" fill={WC3.ft.frostWhite} opacity="0.5" />
      </svg>

      {/* Skeleton 3 - center-left, ribcage visible */}
      <svg
        style={{
          position: 'absolute',
          left: '30%',
          bottom: '1%',
          width: '70px',
          height: '50px',
          opacity: 0.25,
        }}
        viewBox="0 0 70 50"
      >
        {/* Spine */}
        <path d="M35,5 L35,45" stroke="#c8c0b0" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Ribs - curved */}
        <path d="M35,12 Q20,15 15,22" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,12 Q50,15 55,22" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,20 Q22,23 18,28" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,20 Q48,23 52,28" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,28 Q25,30 22,34" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,28 Q45,30 48,34" stroke="#c8c0b0" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Snow covering base */}
        <ellipse cx="35" cy="48" rx="30" ry="8" fill={WC3.ft.frostWhite} opacity="0.45" />
      </svg>

      {/* Skeleton 4 - far right, another reaching arm */}
      <svg
        style={{
          position: 'absolute',
          right: '25%',
          bottom: '2%',
          width: '45px',
          height: '60px',
          opacity: 0.28,
          transform: 'scaleX(-1)',
        }}
        viewBox="0 0 45 60"
      >
        {/* Single arm reaching */}
        <path d="M22,60 L22,40 L18,25 L15,12" stroke="#c8c0b0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Fingers */}
        <path d="M15,12 L12,5" stroke="#c8c0b0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M15,12 L15,4" stroke="#c8c0b0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M15,12 L18,5" stroke="#c8c0b0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Snow base */}
        <ellipse cx="22" cy="58" rx="14" ry="5" fill={WC3.ft.frostWhite} opacity="0.4" />
      </svg>

      {/* Skeleton 5 - far background, fallen warrior */}
      <svg
        style={{
          position: 'absolute',
          left: '45%',
          bottom: '5%',
          width: '80px',
          height: '40px',
          opacity: 0.2,
        }}
        viewBox="0 0 80 40"
      >
        {/* Fallen skeleton - lying on ground */}
        <ellipse cx="40" cy="35" rx="35" ry="8" fill={WC3.ft.frostWhite} opacity="0.3" />
        {/* Skull */}
        <ellipse cx="15" cy="22" rx="8" ry="7" fill="#c8c0b0" />
        <ellipse cx="12" cy="20" rx="2" ry="2.5" fill="#1a1a2e" />
        <ellipse cx="18" cy="20" rx="2" ry="2.5" fill="#1a1a2e" />
        {/* Ribcage */}
        <path d="M25,25 L55,28" stroke="#c8c0b0" strokeWidth="3" fill="none" />
        <path d="M28,22 L35,28" stroke="#c8c0b0" strokeWidth="1.5" fill="none" />
        <path d="M35,21 L40,28" stroke="#c8c0b0" strokeWidth="1.5" fill="none" />
        <path d="M42,21 L45,28" stroke="#c8c0b0" strokeWidth="1.5" fill="none" />
        <path d="M49,22 L50,28" stroke="#c8c0b0" strokeWidth="1.5" fill="none" />
        {/* Arm bones */}
        <path d="M58,26 L72,20 L78,15" stroke="#c8c0b0" strokeWidth="2" fill="none" />
      </svg>

      {/* Skeleton 6 - background, crawling out */}
      <svg
        style={{
          position: 'absolute',
          left: '55%',
          bottom: '3%',
          width: '55px',
          height: '50px',
          opacity: 0.22,
        }}
        viewBox="0 0 55 50"
      >
        {/* Skull emerging */}
        <ellipse cx="28" cy="25" rx="12" ry="10" fill="#d4ccc0" />
        <ellipse cx="24" cy="22" rx="3" ry="3.5" fill="#1a1a2e" />
        <ellipse cx="32" cy="22" rx="3" ry="3.5" fill="#1a1a2e" />
        <path d="M28,26 L26,30 L30,30 Z" fill="#2a2a3e" />
        {/* Jaw open */}
        <path d="M20,30 Q28,38 36,30" stroke="#c8c0b0" strokeWidth="2" fill="none" />
        {/* One arm reaching forward */}
        <path d="M15,35 L5,25 L2,18" stroke="#c8c0b0" strokeWidth="2.5" fill="none" />
        <path d="M2,18 L-2,12 M2,18 L0,10 M2,18 L4,11" stroke="#c8c0b0" strokeWidth="1.5" fill="none" />
        {/* Snow covering lower body */}
        <ellipse cx="28" cy="45" rx="25" ry="10" fill={WC3.ft.frostWhite} opacity="0.5" />
      </svg>

      {/* Skeleton 7 - far right background */}
      <svg
        style={{
          position: 'absolute',
          right: '5%',
          bottom: '4%',
          width: '40px',
          height: '55px',
          opacity: 0.18,
        }}
        viewBox="0 0 40 55"
      >
        {/* Upper body emerging */}
        <path d="M20,55 L20,35" stroke="#c8c0b0" strokeWidth="3" fill="none" />
        <ellipse cx="20" cy="28" rx="10" ry="8" fill="#c8c0b0" />
        <ellipse cx="16" cy="26" rx="2.5" ry="3" fill="#1a1a2e" />
        <ellipse cx="24" cy="26" rx="2.5" ry="3" fill="#1a1a2e" />
        {/* Arms up */}
        <path d="M12,38 L5,28 L2,18" stroke="#c8c0b0" strokeWidth="2" fill="none" />
        <path d="M28,38 L35,28 L38,18" stroke="#c8c0b0" strokeWidth="2" fill="none" />
        <ellipse cx="20" cy="52" rx="15" ry="6" fill={WC3.ft.frostWhite} opacity="0.4" />
      </svg>

      {/* Undead ghoul 1 - silhouette in background */}
      <svg
        style={{
          position: 'absolute',
          left: '70%',
          bottom: '8%',
          width: '35px',
          height: '60px',
          opacity: 0.15,
        }}
        viewBox="0 0 35 60"
      >
        {/* Hunched ghoul silhouette */}
        <path d="M18,10 Q25,8 22,18 L20,25 Q25,30 23,40 L20,55 L15,55 L12,40 Q10,30 15,25 L13,18 Q10,8 18,10" fill="#1a2535" />
        {/* Glowing eyes */}
        <ellipse cx="14" cy="15" rx="2" ry="1.5" fill={WC3.ft.iceMid} opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="20" cy="15" rx="2" ry="1.5" fill={WC3.ft.iceMid} opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </svg>

      {/* Undead ghoul 2 - far background */}
      <svg
        style={{
          position: 'absolute',
          left: '38%',
          bottom: '10%',
          width: '28px',
          height: '50px',
          opacity: 0.12,
        }}
        viewBox="0 0 28 50"
      >
        <path d="M14,8 Q20,6 18,15 L16,22 Q20,26 18,35 L16,48 L12,48 L10,35 Q8,26 12,22 L10,15 Q8,6 14,8" fill="#1a2535" />
        <ellipse cx="11" cy="12" rx="1.5" ry="1" fill={WC3.ft.iceMid} opacity="0.35" />
        <ellipse cx="17" cy="12" rx="1.5" ry="1" fill={WC3.ft.iceMid} opacity="0.35" />
      </svg>

      {/* Ground frost mist */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        background: `linear-gradient(0deg, ${WC3.ft.iceDark}30 0%, ${WC3.ft.iceMid}15 40%, transparent 100%)`,
        filter: 'blur(15px)',
      }} />

      <style>{`
        @keyframes windStreak {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(-130vw); opacity: 0; }
        }
        @keyframes blizzardFar {
          0% { transform: translate(0, 0); opacity: 0.4; }
          100% { transform: translate(-25vw, 110vh); opacity: 0; }
        }
        @keyframes blizzardMid {
          0% { transform: translate(0, 0); opacity: 0.6; }
          100% { transform: translate(-35vw, 110vh); opacity: 0; }
        }
        @keyframes blizzardNear {
          0% { transform: translate(0, 0); opacity: 0.7; }
          100% { transform: translate(-50vw, 115vh); opacity: 0; }
        }
      `}</style>
    </>
  )
})

// =============================================================================
// ZONE ORNAMENTS - Positioned beside content sections
// =============================================================================

const RoCOrnament = memo(function RoCOrnament({ side, type }: { side: 'left' | 'right'; type: 'flag' | 'weapons' | 'shield' }) {
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    [side]: '-80px',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.25,
    pointerEvents: 'none',
  }

  if (type === 'flag') {
    return (
      <svg style={{ ...posStyle, width: '60px', height: '120px' }} viewBox="0 0 60 120">
        <line x1="15" y1="5" x2="15" y2="115" stroke="#3a2a1a" strokeWidth="4" />
        <line x1="5" y1="20" x2="25" y2="20" stroke="#2a1a10" strokeWidth="3" />
        <path d="M17,8 Q45,18 42,45 Q40,60 48,75 L19,68 Q22,50 19,30 Z" fill={WC3.bloodRed} opacity="0.8" />
        <circle cx="32" cy="40" r="8" fill={WC3.goldDark} opacity="0.6" />
      </svg>
    )
  }

  if (type === 'weapons') {
    return (
      <svg style={{ ...posStyle, width: '70px', height: '80px' }} viewBox="0 0 70 80">
        {/* Broken sword */}
        <g transform="translate(15,60) rotate(-50)">
          <path d="M0,0 L3,-35 L6,-32 L4,0 Z" fill={WC3.metalLight} />
          <rect x="-3" y="0" width="10" height="4" fill={WC3.goldDark} />
          <rect x="0" y="4" width="4" height="8" fill="#3a2a1a" />
        </g>
        {/* Broken axe */}
        <g transform="translate(45,55) rotate(40)">
          <rect x="0" y="-25" width="4" height="30" fill="#3a2a1a" />
          <path d="M4,-25 L18,-20 L15,-10 L4,-15 Z" fill={WC3.metalLight} />
        </g>
      </svg>
    )
  }

  return (
    <svg style={{ ...posStyle, width: '60px', height: '80px' }} viewBox="0 0 60 80">
      {/* Shield with arrows */}
      <path d="M10,5 L50,15 L50,45 Q50,65 30,75 Q10,65 10,45 Z" fill="#6a4a25" stroke={WC3.metalMid} strokeWidth="2" />
      <circle cx="30" cy="35" r="8" fill={WC3.goldDark} opacity="0.5" />
      <line x1="20" y1="25" x2="35" y2="5" stroke="#3a2a1a" strokeWidth="2" />
      <polygon points="35,5 40,3 37,10" fill={WC3.metalLight} />
      <line x1="38" y1="40" x2="50" y2="18" stroke="#3a2a1a" strokeWidth="2" />
      <polygon points="50,18 55,17 51,24" fill={WC3.metalLight} />
    </svg>
  )
})

const FTOrnament = memo(function FTOrnament({ side, type }: { side: 'left' | 'right'; type: 'shard' | 'rune' | 'frost' }) {
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    [side]: '-70px',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.2,
    pointerEvents: 'none',
  }

  if (type === 'shard') {
    return (
      <svg style={{ ...posStyle, width: '50px', height: '100px' }} viewBox="0 0 50 100">
        <polygon points="25,0 32,45 28,100 22,100 18,45" fill={WC3.ft.iceMid} />
        <polygon points="25,8 29,40 25,80" fill={WC3.ft.iceBright} opacity="0.5" />
        <polygon points="12,30 18,55 15,85 9,85 6,55" fill={WC3.ft.iceDark} opacity="0.6" />
        <polygon points="38,35 42,58 40,82 36,82 34,58" fill={WC3.ft.iceDark} opacity="0.5" />
      </svg>
    )
  }

  if (type === 'rune') {
    return (
      <svg style={{ ...posStyle, width: '45px', height: '70px' }} viewBox="0 0 45 70">
        <path d="M22,0 L42,12 L42,48 L22,60 L2,48 L2,12 Z" fill={WC3.metalDark} stroke={WC3.metalMid} strokeWidth="2" />
        <path d="M22,6 L36,15 L36,45 L22,54 L8,45 L8,15 Z" fill={WC3.bgDeep} />
        <g fill={WC3.ft.iceMid} opacity="0.7">
          <path d="M22,15 L17,25 L22,32 L27,25 Z" />
          <line x1="22" y1="32" x2="22" y2="48" stroke={WC3.ft.iceMid} strokeWidth="2" />
        </g>
      </svg>
    )
  }

  return (
    <svg style={{ ...posStyle, width: '60px', height: '60px' }} viewBox="0 0 60 60">
      {/* Frost pattern */}
      <circle cx="30" cy="30" r="25" fill="none" stroke={WC3.ft.iceMid} strokeWidth="1" opacity="0.5" />
      <circle cx="30" cy="30" r="18" fill="none" stroke={WC3.ft.iceBright} strokeWidth="1" opacity="0.4" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line key={i} x1="30" y1="30" x2={30 + 22 * Math.cos(angle * Math.PI / 180)} y2={30 + 22 * Math.sin(angle * Math.PI / 180)} stroke={WC3.ft.iceMid} strokeWidth="1" opacity="0.5" />
      ))}
      <circle cx="30" cy="30" r="5" fill={WC3.ft.iceBright} opacity="0.6" />
    </svg>
  )
})

// =============================================================================
// ART SECTION DIVIDERS - Decorative breaks between content
// =============================================================================

const RoCArtDivider = memo(function RoCArtDivider({ variant = 'horde', scale = 1 }: { variant?: 'horde' | 'alliance' | 'weapons'; scale?: number }) {
  return (
    <div style={{
      position: 'relative',
      height: `${120 * scale}px`,
      margin: `${2 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Subtle glow behind center - no solid background */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '60px',
        background: `radial-gradient(ellipse, ${WC3.roc.felDark}20 0%, transparent 70%)`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      {/* Single horizontal line - subtle metal */}
      <div style={{
        position: 'absolute',
        left: '10%',
        right: '10%',
        height: '1px',
        background: `linear-gradient(90deg,
          transparent 0%,
          ${WC3.metalDark}40 20%,
          ${WC3.metalMid}60 50%,
          ${WC3.metalDark}40 80%,
          transparent 100%
        )`,
      }} />

      {/* Center shield ornament */}
      <svg width="140" height="100" viewBox="0 0 140 100" style={{ position: 'relative', zIndex: 2 }}>
        {variant === 'horde' && (
          <g transform="translate(70,50)">
            {/* Horde shield shape - pointed bottom */}
            <path
              d="M0,-38 L32,-28 L35,5 L20,32 L0,42 L-20,32 L-35,5 L-32,-28 Z"
              fill={WC3.hordeRed}
              stroke={WC3.metalDark}
              strokeWidth="3"
            />
            {/* Shield rim highlight */}
            <path
              d="M0,-35 L28,-26 L30,3 L18,27 L0,36"
              fill="none"
              stroke={WC3.bloodRed}
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Orc skull emblem */}
            <g transform="translate(0,-2)">
              {/* Skull base */}
              <ellipse cx="0" cy="0" rx="16" ry="14" fill="#3a3028" />
              {/* Jaw */}
              <path d="M-12,8 Q-8,18 0,20 Q8,18 12,8" fill="#2a2018" />
              {/* Eye sockets */}
              <ellipse cx="-6" cy="-2" rx="5" ry="4" fill="#1a1008" />
              <ellipse cx="6" cy="-2" rx="5" ry="4" fill="#1a1008" />
              {/* Nose hole */}
              <ellipse cx="0" cy="6" rx="3" ry="4" fill="#1a1008" />
              {/* Tusks - horizontal orc style */}
              <path d="M-12,8 L-22,5 L-20,10 Z" fill="#4a3828" stroke="#3a2818" strokeWidth="1" />
              <path d="M12,8 L22,5 L20,10 Z" fill="#4a3828" stroke="#3a2818" strokeWidth="1" />
              {/* Brow ridge */}
              <path d="M-14,-6 Q0,-12 14,-6" fill="none" stroke="#2a2018" strokeWidth="2" />
            </g>
            {/* Corner spikes */}
            <polygon points="-32,-28 -40,-25 -35,-18" fill={WC3.metalDark} />
            <polygon points="32,-28 40,-25 35,-18" fill={WC3.metalDark} />
          </g>
        )}
        {variant === 'alliance' && (
          <g transform="translate(70,50)">
            {/* Alliance shield shape - rounded bottom */}
            <path
              d="M0,-38 L30,-30 L35,-5 L30,20 L0,38 L-30,20 L-35,-5 L-30,-30 Z"
              fill={WC3.allianceBlue}
              stroke={WC3.goldDark}
              strokeWidth="3"
            />
            {/* Gold trim */}
            <path
              d="M0,-32 L24,-25 L28,-5 L24,16 L0,30"
              fill="none"
              stroke={WC3.goldMid}
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Lion head silhouette */}
            <g transform="translate(0,0)">
              {/* Mane */}
              <circle cx="0" cy="-5" r="18" fill={WC3.goldDark} opacity="0.8" />
              {/* Face */}
              <ellipse cx="0" cy="-2" rx="12" ry="10" fill={WC3.goldMid} />
              {/* Eyes */}
              <ellipse cx="-4" cy="-5" rx="2" ry="1.5" fill="#1a2a4a" />
              <ellipse cx="4" cy="-5" rx="2" ry="1.5" fill="#1a2a4a" />
              {/* Nose */}
              <ellipse cx="0" cy="0" rx="3" ry="2" fill={WC3.goldDark} />
              {/* Mouth */}
              <path d="M-5,4 Q0,8 5,4" fill="none" stroke={WC3.goldDark} strokeWidth="1.5" />
            </g>
          </g>
        )}
        {variant === 'weapons' && (
          <g transform="translate(70,50)">
            {/* Crossed axes - more orc-like */}
            <g transform="rotate(-35)">
              <rect x="-3" y="-35" width="6" height="55" fill={WC3.metalMid} rx="2" />
              {/* Axe head */}
              <path d="M-3,-30 Q-18,-25 -20,-15 Q-15,-5 -3,-8 Z" fill={WC3.metalLight} stroke={WC3.metalDark} strokeWidth="1" />
            </g>
            <g transform="rotate(35)">
              <rect x="-3" y="-35" width="6" height="55" fill={WC3.metalMid} rx="2" />
              {/* Axe head */}
              <path d="M3,-30 Q18,-25 20,-15 Q15,-5 3,-8 Z" fill={WC3.metalLight} stroke={WC3.metalDark} strokeWidth="1" />
            </g>
            {/* Center boss */}
            <circle cx="0" cy="0" r="10" fill={WC3.metalDark} stroke={WC3.metalMid} strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill={WC3.roc.felMid} style={{ filter: `drop-shadow(0 0 4px ${WC3.roc.felGlow})` }} />
          </g>
        )}
      </svg>

      {/* Side accent lines */}
      <div style={{
        position: 'absolute',
        left: '5%',
        width: '15%',
        height: '1px',
        top: '50%',
        background: `linear-gradient(90deg, transparent 0%, ${WC3.metalDark}50 100%)`,
      }} />
      <div style={{
        position: 'absolute',
        right: '5%',
        width: '15%',
        height: '1px',
        top: '50%',
        background: `linear-gradient(270deg, transparent 0%, ${WC3.metalDark}50 100%)`,
      }} />
    </div>
  )
})

const FTArtDivider = memo(function FTArtDivider({ variant = 'crystals', scale = 1 }: { variant?: 'crystals' | 'rune' | 'throne'; scale?: number }) {
  return (
    <div style={{
      position: 'relative',
      height: `${140 * scale}px`,
      margin: `${2 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background gradient fade - blends with frozen landscape */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          transparent 0%,
          ${WC3.ft.iceDark}08 20%,
          ${WC3.ft.iceGlow}12 50%,
          ${WC3.ft.iceDark}08 80%,
          transparent 100%
        )`,
        pointerEvents: 'none',
      }} />

      {/* Ice glow behind center */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '80px',
        background: `radial-gradient(ellipse, ${WC3.ft.iceGlow}30 0%, transparent 70%)`,
        filter: 'blur(25px)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal decorative lines - icy */}
      <div style={{
        position: 'absolute',
        left: '5%',
        right: '5%',
        height: '2px',
        background: `linear-gradient(90deg,
          transparent 0%,
          ${WC3.ft.iceDark}50 15%,
          ${WC3.ft.iceMid}80 50%,
          ${WC3.ft.iceDark}50 85%,
          transparent 100%
        )`,
        boxShadow: `0 0 10px ${WC3.ft.iceGlow}`,
      }} />

      {/* Frost lines above and below */}
      <div style={{
        position: 'absolute',
        left: '15%',
        right: '15%',
        top: '35%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${WC3.ft.iceDark}40 30%, ${WC3.ft.iceDark}50 50%, ${WC3.ft.iceDark}40 70%, transparent 100%)`,
      }} />
      <div style={{
        position: 'absolute',
        left: '15%',
        right: '15%',
        bottom: '35%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${WC3.ft.iceDark}40 30%, ${WC3.ft.iceDark}50 50%, ${WC3.ft.iceDark}40 70%, transparent 100%)`,
      }} />

      {/* Center art piece - larger */}
      <svg width="200" height="110" viewBox="0 0 200 110" style={{ position: 'relative', zIndex: 2 }}>
        {variant === 'crystals' && (
          <>
            {/* Ice crystal cluster - more elaborate */}
            <g transform="translate(100,55)">
              {/* Center large crystal */}
              <polygon points="0,-45 10,-15 7,25 -7,25 -10,-15" fill={WC3.ft.iceMid} opacity="0.9" />
              <polygon points="0,-42 6,-18 5,20" fill={WC3.ft.iceBright} opacity="0.5" />
              {/* Left crystals */}
              <polygon points="-20,-32 -12,-12 -15,22 -25,22 -28,-12" fill={WC3.ft.iceDark} opacity="0.8" transform="rotate(-18)" />
              <polygon points="-35,-22 -30,-5 -33,18 -40,18 -42,-5" fill={WC3.ft.iceMid} opacity="0.6" transform="rotate(-30)" />
              <polygon points="-48,-12 -45,0 -47,12 -52,12 -52,0" fill={WC3.ft.iceDark} opacity="0.4" transform="rotate(-40)" />
              {/* Right crystals */}
              <polygon points="20,-32 28,-12 25,22 15,22 12,-12" fill={WC3.ft.iceDark} opacity="0.8" transform="rotate(18)" />
              <polygon points="35,-22 40,-5 37,18 30,18 28,-5" fill={WC3.ft.iceMid} opacity="0.6" transform="rotate(30)" />
              <polygon points="48,-12 52,0 50,12 45,12 45,0" fill={WC3.ft.iceDark} opacity="0.4" transform="rotate(40)" />
              {/* Inner glow */}
              <ellipse cx="0" cy="0" rx="12" ry="20" fill={WC3.ft.iceBright} opacity="0.15" style={{ filter: `blur(4px)` }} />
            </g>
          </>
        )}
        {variant === 'rune' && (
          <>
            {/* Frost rune */}
            <g transform="translate(70,35)">
              <circle cx="0" cy="0" r="26" fill="none" stroke={WC3.ft.iceDark} strokeWidth="2" opacity="0.5" />
              <circle cx="0" cy="0" r="20" fill="none" stroke={WC3.ft.iceMid} strokeWidth="1" opacity="0.4" />
              {/* Hexagonal frost pattern */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <g key={i}>
                  <line x1={Math.cos(angle * Math.PI / 180) * 8} y1={Math.sin(angle * Math.PI / 180) * 8} x2={Math.cos(angle * Math.PI / 180) * 24} y2={Math.sin(angle * Math.PI / 180) * 24} stroke={WC3.ft.iceBright} strokeWidth="1.5" opacity="0.6" />
                  <circle cx={Math.cos(angle * Math.PI / 180) * 24} cy={Math.sin(angle * Math.PI / 180) * 24} r="2" fill={WC3.ft.iceBright} opacity="0.5" />
                </g>
              ))}
              <circle cx="0" cy="0" r="6" fill={WC3.ft.iceBright} opacity="0.3" />
            </g>
          </>
        )}
        {variant === 'throne' && (
          <>
            {/* Ice throne silhouette hint */}
            <g transform="translate(70,55)">
              {/* Throne base */}
              <polygon points="-35,0 -30,-15 -15,-12 0,-35 15,-12 30,-15 35,0" fill={WC3.ft.iceDark} opacity="0.6" />
              <polygon points="-25,-5 -20,-18 -8,-15 0,-40 8,-15 20,-18 25,-5" fill={WC3.ft.iceMid} opacity="0.4" />
              {/* Central spire glow */}
              <polygon points="-5,-20 0,-45 5,-20" fill={WC3.ft.iceBright} opacity="0.3" />
            </g>
          </>
        )}
        {/* Side ice shards */}
        <polygon points="8,35 12,25 14,35 10,38" fill={WC3.ft.iceMid} opacity="0.4" />
        <polygon points="126,35 130,28 132,35 128,37" fill={WC3.ft.iceMid} opacity="0.4" />
      </svg>

      {/* Frost glow */}
      <div style={{
        position: 'absolute',
        inset: '20%',
        background: `radial-gradient(ellipse at center, ${WC3.ft.iceGlow} 0%, transparent 70%)`,
        opacity: 0.25,
        filter: 'blur(15px)',
        pointerEvents: 'none',
      }} />

      {/* Floating ice particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`ice-${i}`}
          style={{
            position: 'absolute',
            left: `${8 + (i % 4) * 22 + (i > 3 ? 3 : 0)}%`,
            top: `${15 + (i % 2) * 50}%`,
            width: i % 2 === 0 ? '3px' : '5px',
            height: i % 2 === 0 ? '3px' : '5px',
            background: WC3.ft.iceBright,
            boxShadow: `0 0 6px ${WC3.ft.iceGlow}`,
            opacity: 0.3 + (i % 4) * 0.1,
            borderRadius: '1px',
            transform: `rotate(${i * 15}deg)`,
            animation: `felPulse ${2.5 + i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
})

// =============================================================================
// SECTION WITH ORNAMENT WRAPPER
// =============================================================================

function SectionWithOrnament({
  children,
  leftOrnament,
  rightOrnament
}: {
  children: React.ReactNode
  leftOrnament?: React.ReactNode
  rightOrnament?: React.ReactNode
}) {
  return (
    <div style={{ position: 'relative' }}>
      {leftOrnament}
      {rightOrnament}
      {children}
    </div>
  )
}

// =============================================================================
// MAIN THEME
// =============================================================================

export default function MedievalFantasyTheme() {
  useTheme()
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(800)
  const [scrollY, setScrollY] = useState(0)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = active === 'engineer'
    ? PROJECTS_DATA.filter(p => p.professions.includes('engineer') || p.featured)
    : filterProjectsByProfession(PROJECTS_DATA, active)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)
  const workExperience = WORK_EXPERIENCE

  // Track viewport height for content visibility and animation spacing
  useEffect(() => {
    setMounted(true)
    setViewportHeight(window.innerHeight)

    const handleResize = () => setViewportHeight(window.innerHeight)
    const handleScroll = () => setScrollY(window.scrollY)

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Calculate available space - EXACT match to Dark Fantasy spacing
  // Dark Fantasy uses: py-6 md:py-8 (1.5rem/2rem padding) for sections, py-16 (4rem) for art dividers
  // Section gap in DF = bottom padding + top padding of next = 3rem (small) / 4rem (md+)
  // Art divider total padding = 8rem (4rem top + 4rem bottom), but we use margin so just 4rem each side
  const isLargeScreen = viewportHeight >= 800
  const sectionSpacing = isLargeScreen ? '4rem' : '3rem'  // gap between content sections
  const artDividerMargin = isLargeScreen ? '4rem' : '3rem'  // margin around art dividers
  const artDividerScale = isLargeScreen ? 1.3 : 1.1

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: WC3.bgVoid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: WC3.textDim, fontFamily: '"Cinzel", Georgia, serif', letterSpacing: '0.2em' }}>LOADING...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: WC3.bgVoid, fontFamily: '"Cinzel", Georgia, serif', color: WC3.textBright }}>
      <DualZoneAtmosphere />

      {/* ============ MAIN CONTENT - Starts at top like Dark Fantasy ============ */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* ============ REIGN OF CHAOS ZONE ============ */}

        {/* Header - wrapped in high z-index container for ThemeSwitcher dropdown */}
        <div style={{ position: 'relative', zIndex: 100 }}>
        <FadeInSection>
          <header style={{ marginBottom: sectionSpacing }}>
            <WC3Frame zone="roc">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <h1 style={{
                    color: WC3.goldBright,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textShadow: `2px 2px 4px ${WC3.bgVoid}`,
                    marginBottom: '0.375rem'
                  }}>
                    Alexander Pulido
                  </h1>
                  <p style={{ color: WC3.textBright, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{PROFESSIONAL_SUMMARY.headline}</p>
                  <p style={{ color: WC3.textMid, fontSize: '0.875rem', fontStyle: 'italic' }}>{PROFESSIONAL_SUMMARY.tagline}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <WC3Button href="/cv" zone="roc">CV</WC3Button>
                  <WC3Button href="/personal-projects/game-engine" zone="roc">Nebulith</WC3Button>
                  <WC3LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${WC3.metalDark}`, display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {CURRENT_ROLES.map((role) => (
                  <div key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', background: WC3.roc.felMid, boxShadow: `0 0 6px ${WC3.roc.felMid}` }} />
                    <div>
                      <p style={{ color: WC3.roc.felBright, fontSize: '0.875rem', fontWeight: 600 }}>{role.title}</p>
                      <p style={{ color: WC3.textDim, fontSize: '0.875rem' }}>{role.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </WC3Frame>
          </header>
        </FadeInSection>
        </div>

        {/* Profession Selector - WC3 Style Command Card */}
        <FadeInSection delay={100}>
          <nav style={{
            marginBottom: sectionSpacing,
            position: 'relative',
            height: isLargeScreen ? '12rem' : '9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${WC3.roc.felDark}15 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Connecting paths SVG */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="felPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={WC3.roc.felDark} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={WC3.roc.felMid} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={WC3.roc.felDark} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Left to center path */}
              <path
                d={isLargeScreen ? "M 20% 70% Q 35% 40%, 50% 50%" : "M 15% 75% Q 32% 45%, 50% 55%"}
                stroke="url(#felPathGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={active === 'engineer' ? "none" : "4 4"}
                style={{
                  filter: active === 'engineer' ? `drop-shadow(0 0 4px ${WC3.roc.felMid})` : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              {/* Center to right path */}
              <path
                d={isLargeScreen ? "M 50% 50% Q 65% 40%, 80% 70%" : "M 50% 55% Q 68% 45%, 85% 75%"}
                stroke="url(#felPathGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={active === 'fighter' ? "none" : "4 4"}
                style={{
                  filter: active === 'fighter' ? `drop-shadow(0 0 4px ${WC3.roc.felMid})` : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </svg>

            {/* Profession nodes */}
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: isLargeScreen ? '700px' : '500px',
              padding: '0 1rem',
            }}>
              {/* Engineer Node - Left */}
              <button
                onClick={() => setActive('engineer')}
                style={{
                  width: isLargeScreen ? '6rem' : '4.5rem',
                  height: isLargeScreen ? '6rem' : '4.5rem',
                  background: active === 'engineer'
                    ? `linear-gradient(135deg, ${WC3.metalLight} 0%, ${WC3.metalMid} 50%, ${WC3.metalDark} 100%)`
                    : `linear-gradient(135deg, ${WC3.metalDark} 0%, ${WC3.bgDeep} 100%)`,
                  border: `3px solid ${active === 'engineer' ? WC3.roc.felMid : WC3.metalMid}`,
                  boxShadow: active === 'engineer'
                    ? `0 0 20px ${WC3.roc.felGlow}, inset 0 1px 2px rgba(255,255,255,0.1)`
                    : `inset 0 -2px 4px rgba(0,0,0,0.5)`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  alignSelf: 'flex-end',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={active === 'engineer' ? WC3.roc.felBright : WC3.textMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  color: active === 'engineer' ? WC3.roc.felBright : WC3.textMid,
                  fontSize: isLargeScreen ? '1rem' : '0.875rem',
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>System</span>
              </button>

              {/* Musician Node - Center (elevated) */}
              <button
                onClick={() => setActive('drummer')}
                style={{
                  width: isLargeScreen ? '7rem' : '5rem',
                  height: isLargeScreen ? '7rem' : '5rem',
                  background: active === 'drummer'
                    ? `linear-gradient(135deg, ${WC3.metalLight} 0%, ${WC3.metalMid} 50%, ${WC3.metalDark} 100%)`
                    : `linear-gradient(135deg, ${WC3.metalDark} 0%, ${WC3.bgDeep} 100%)`,
                  border: `3px solid ${active === 'drummer' ? WC3.roc.felMid : WC3.metalMid}`,
                  boxShadow: active === 'drummer'
                    ? `0 0 25px ${WC3.roc.felGlow}, inset 0 1px 2px rgba(255,255,255,0.1)`
                    : `inset 0 -2px 4px rgba(0,0,0,0.5)`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.3s ease',
                  alignSelf: 'flex-start',
                  marginTop: isLargeScreen ? '0.5rem' : '0.25rem',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={active === 'drummer' ? WC3.roc.felBright : WC3.textMid} strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill={active === 'drummer' ? WC3.roc.felBright : WC3.textMid}/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={active === 'drummer' ? WC3.roc.felBright : WC3.textMid} strokeWidth="2"/>
                </svg>
                <span style={{
                  color: active === 'drummer' ? WC3.roc.felBright : WC3.textMid,
                  fontSize: isLargeScreen ? '1rem' : '0.875rem',
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Drummer</span>
              </button>

              {/* Fighter Node - Right */}
              <button
                onClick={() => setActive('fighter')}
                style={{
                  width: isLargeScreen ? '6rem' : '4.5rem',
                  height: isLargeScreen ? '6rem' : '4.5rem',
                  background: active === 'fighter'
                    ? `linear-gradient(135deg, ${WC3.metalLight} 0%, ${WC3.metalMid} 50%, ${WC3.metalDark} 100%)`
                    : `linear-gradient(135deg, ${WC3.metalDark} 0%, ${WC3.bgDeep} 100%)`,
                  border: `3px solid ${active === 'fighter' ? WC3.roc.felMid : WC3.metalMid}`,
                  boxShadow: active === 'fighter'
                    ? `0 0 20px ${WC3.roc.felGlow}, inset 0 1px 2px rgba(255,255,255,0.1)`
                    : `inset 0 -2px 4px rgba(0,0,0,0.5)`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.3s ease',
                  alignSelf: 'flex-end',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4l7.07 17.57 2.51-7.39 7.39-2.51L4 4z" stroke={active === 'fighter' ? WC3.roc.felBright : WC3.textMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  color: active === 'fighter' ? WC3.roc.felBright : WC3.textMid,
                  fontSize: isLargeScreen ? '1rem' : '0.875rem',
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Muay Thai</span>
              </button>
            </div>
          </nav>
        </FadeInSection>

        {/* About - More breathing room */}
        <FadeInSection>
          <section style={{ marginBottom: sectionSpacing, marginTop: '1rem' }}>
            <WC3Frame title="About" zone="roc">
              <p style={{
                color: WC3.textBright,
                lineHeight: 1.8,
                marginBottom: '1.25rem',
                fontSize: isLargeScreen ? '1.125rem' : '1rem',
                padding: isLargeScreen ? '0.5rem 0' : '0.25rem 0',
              }}>{aboutData.bio}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: isLargeScreen ? '0.625rem' : '0.5rem' }}>
                {aboutData.quickFacts.map((fact, i) => (
                  <span key={i} style={{
                    background: `linear-gradient(135deg, ${WC3.metalDark} 0%, ${WC3.bgDeep} 100%)`,
                    border: `1px solid ${WC3.metalMid}`,
                    color: WC3.textMid,
                    fontSize: isLargeScreen ? '1rem' : '0.875rem',
                    padding: isLargeScreen ? '0.5rem 0.875rem' : '0.375rem 0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: `inset 0 1px 2px rgba(0,0,0,0.3)`,
                  }}>
                    {fact}
                  </span>
                ))}
              </div>
            </WC3Frame>
          </section>
        </FadeInSection>

        {/* === RoC Art Divider: Crossed Weapons === */}
        <FadeInSection>
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <RoCArtDivider variant="horde" scale={artDividerScale} />
          </div>
        </FadeInSection>

        {/* Work Experience - subtle, faded like fog of war */}
        <FadeInSection>
          <SectionWithOrnament
            leftOrnament={<RoCOrnament side="left" type="flag" />}
            rightOrnament={<RoCOrnament side="right" type="weapons" />}
          >
            <section style={{ marginBottom: sectionSpacing, opacity: 0.7, filter: 'brightness(0.85)' }}>
              <WC3Frame title="Work Experience" zone="roc">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {active === 'engineer' ? workExperience.map((job) => (
                    <InnerCard key={job.company} highlight={job.current} zone="roc">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                        <div>
                          <h3 style={{ color: WC3.textBright, fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.125rem' }}>{job.title}</h3>
                          <p style={{ color: WC3.goldMid, fontSize: '0.875rem' }}>{job.company}</p>
                        </div>
                        <span style={{ color: WC3.textDim, fontSize: '0.875rem' }}>{job.period}</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0.375rem 0 0 0' }}>
                        {job.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} style={{ color: WC3.textMid, fontSize: '0.875rem', paddingLeft: '0.75rem', position: 'relative', marginBottom: '0.125rem' }}>
                            <span style={{ position: 'absolute', left: 0, color: WC3.goldDark }}>›</span>{h}
                          </li>
                        ))}
                      </ul>
                      {job.technologies && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                          {job.technologies.slice(0, 5).map((tech) => (
                            <span key={tech} style={{
                              background: WC3.roc.felDark + '40',
                              color: WC3.roc.felBright,
                              fontSize: '0.875rem',
                              padding: '0.125rem 0.25rem',
                              textTransform: 'uppercase'
                            }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </InnerCard>
                  )) : experience.map((entry) => (
                    <InnerCard key={entry.id} zone="roc">
                      <h3 style={{ color: WC3.textBright, fontSize: '0.875rem', fontWeight: 600 }}>{entry.title}</h3>
                      <p style={{ color: WC3.goldMid, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{entry.organization}</p>
                      <p style={{ color: WC3.textMid, fontSize: '0.875rem' }}>{entry.description}</p>
                    </InnerCard>
                  ))}
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </FadeInSection>

        {/* === RoC Art Divider: War Banner === */}
        <FadeInSection>
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <RoCArtDivider variant="alliance" scale={artDividerScale} />
          </div>
        </FadeInSection>

        {/* Skills - with shield ornament */}
        <FadeInSection>
          <SectionWithOrnament
            rightOrnament={<RoCOrnament side="right" type="shield" />}
          >
            <section style={{ marginBottom: sectionSpacing }}>
              <WC3Frame title={active === 'engineer' ? 'Tech Stack' : 'Skills'} zone="roc">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  {active === 'engineer' ? engineerTech.map((category) => (
                    <div key={category.name}>
                      <h3 style={{ color: WC3.goldMid, fontSize: '1.125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem', borderBottom: `1px solid ${WC3.metalDark}`, paddingBottom: '0.25rem' }}>
                        {category.name}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {category.items.slice(0, 5).map((tech) => (
                          <li key={tech} style={{ color: WC3.textMid, fontSize: '1.125rem', marginBottom: '0.125rem' }}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  )) : otherSkills.map((category) => (
                    <div key={category.name}>
                      <h3 style={{ color: WC3.goldMid, fontSize: '1.125rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.375rem', borderBottom: `1px solid ${WC3.metalDark}`, paddingBottom: '0.25rem' }}>
                        {category.name}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {category.skills.slice(0, 5).map((skill) => (
                          <li key={skill.name} style={{ color: WC3.textMid, fontSize: '1.125rem', marginBottom: '0.125rem' }}>{skill.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </FadeInSection>

        {/* ============ TRANSITION - FROZEN THRONE ZONE ============ */}

        {/* === Transition Art Divider: Ice Crystals === */}
        <FadeInSection>
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <FTArtDivider variant="crystals" scale={artDividerScale} />
          </div>
        </FadeInSection>

        {/* Projects - FT zone begins */}
        <FadeInSection>
          <SectionWithOrnament
            leftOrnament={<FTOrnament side="left" type="shard" />}
            rightOrnament={<FTOrnament side="right" type="rune" />}
          >
            <section style={{ marginBottom: sectionSpacing }}>
              <WC3Frame title="Featured Work" zone="ft">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {(active === 'engineer' ? getFeaturedProjects(projects) : projects).slice(0, 6).map((project) => (
                    <InnerCard key={project.id} zone="ft">
                      <h3 style={{ color: WC3.textBright, fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{project.title}</h3>
                      <p style={{ color: WC3.textMid, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{project.description}</p>
                      {project.impact && <p style={{ color: WC3.ft.iceMid, fontSize: '1.125rem', fontWeight: 500 }}>{project.impact}</p>}
                    </InnerCard>
                  ))}
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </FadeInSection>

        {/* === FT Art Divider: Frost Rune === */}
        <FadeInSection>
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <FTArtDivider variant="rune" scale={artDividerScale} />
          </div>
        </FadeInSection>

        {/* Companies / Bands */}
        <FadeInSection>
          <SectionWithOrnament
            leftOrnament={<FTOrnament side="left" type="frost" />}
          >
            {active === 'engineer' && (
              <section style={{ marginBottom: sectionSpacing }}>
                <WC3Frame title="Ventures" zone="ft">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {COMPANIES.map((company) => (
                      <InnerCard key={company.id} zone="ft">
                        <h3 style={{ color: WC3.textBright, fontSize: '1.125rem', fontWeight: 600 }}>{company.name}</h3>
                        <p style={{ color: WC3.goldMid, fontSize: '1.125rem', marginBottom: '0.125rem' }}>{company.role}</p>
                        <p style={{ color: WC3.textMid, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{company.description}</p>
                        {company.url && <a href={company.url} target="_blank" rel="noopener noreferrer" style={{ color: WC3.ft.iceMid, fontSize: '0.875rem', textDecoration: 'none' }}>{company.url}</a>}
                      </InnerCard>
                    ))}
                  </div>
                </WC3Frame>
              </section>
            )}
            {active === 'drummer' && (
              <section style={{ marginBottom: sectionSpacing }}>
                <WC3Frame title="Bands" zone="ft">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {BANDS.map((band) => (
                      <InnerCard key={band.id} zone="ft">
                        <h3 style={{ color: WC3.textBright, fontSize: '1.125rem', fontWeight: 600 }}>{band.name}</h3>
                        <p style={{ color: WC3.goldMid, fontSize: '1.125rem', marginBottom: '0.125rem' }}>{band.role}</p>
                        <p style={{ color: WC3.textMid, fontSize: '1.125rem' }}>{band.description}</p>
                      </InnerCard>
                    ))}
                  </div>
                </WC3Frame>
              </section>
            )}
          </SectionWithOrnament>
        </FadeInSection>

        {/* Posts */}
        <FadeInSection>
          <section style={{ marginBottom: sectionSpacing }}>
            <WC3Frame title="Posts" zone="ft">
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: WC3.textMid, marginBottom: '0.5rem' }}>
                  Writings and thoughts coming soon...
                </p>
                <p style={{ color: WC3.ft.iceMid, fontSize: '0.875rem', fontStyle: 'italic' }}>
                  * Check back for updates on development, music, and martial arts
                </p>
              </div>
            </WC3Frame>
          </section>
        </FadeInSection>

        {/* === FT Art Divider: Ice Throne === */}
        <FadeInSection>
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <FTArtDivider variant="throne" scale={artDividerScale} />
          </div>
        </FadeInSection>

        {/* Contact - no card, floating text like Dark Fantasy */}
        <FadeInSection>
          <section style={{ marginBottom: sectionSpacing, textAlign: 'center', padding: '2rem 0', marginTop: '-10vh' }}>
            <h2 style={{
              color: WC3.ft.iceBright,
              fontSize: '1.125rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              textShadow: `0 0 20px ${WC3.ft.iceMid}40`,
            }}>
              Ready to Work Together?
            </h2>
            <p style={{ color: WC3.textMid, marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              10+ years delivering production systems. Let&apos;s build something.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <WC3Button variant="primary" href="mailto:alexanderpulido81@gmail.com" zone="ft">Send Message</WC3Button>
              <WC3Button href="/cv" zone="ft">Download CV</WC3Button>
            </div>
          </section>
        </FadeInSection>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: '0.75rem' }}>
          <p style={{ color: WC3.textDim, fontSize: '0.875rem', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} ALEXANDER PULIDO
          </p>
        </footer>
      </div>
    </div>
  )
}
