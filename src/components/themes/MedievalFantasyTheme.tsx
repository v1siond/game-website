'use client'

import { memo, useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
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
    skyTop: '#0a1208',
    skyMid: '#0f1a10',
    skyBot: '#152518',
    felBright: '#66ff66',
    felMid: '#33cc33',
    felDark: '#1a8a1a',
    felGlow: '#44ff4480',
    fireBright: '#ffaa44',
    fireMid: '#dd6622',
    fireCore: '#ffff88',
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

  textBright: '#e8dcc8',
  textMid: '#a08868',
  textDim: '#685840',
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
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px 0px -5% 0px' })
  return (
    <div
      ref={ref}
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
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
              padding: '1.25rem',
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
                    fontSize: '1rem',
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
    fontSize: '0.8125rem',
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
// REIGN OF CHAOS ATMOSPHERE - Storm with perspective depth
// =============================================================================

const ReignOfChaosAtmosphere = memo(function ReignOfChaosAtmosphere() {
  const [lightningActive, setLightningActive] = useState(false)
  const [lightningX, setLightningX] = useState(50)
  const [cloudGlow, setCloudGlow] = useState(0)
  // Infernal phases: falling meteor → explosion → creature rises → idle
  const [infernals, setInfernals] = useState<Array<{
    id: number
    x: number
    landX: number
    side: 'left' | 'right'
    phase: 'falling' | 'explosion' | 'rising' | 'idle'
  }>>([])

  useEffect(() => {
    let infernalId = 0
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const triggerLightningStorm = () => {
      if (!isActive) return

      // Lightning in the sky area
      const lightX = 20 + Math.random() * 60
      setLightningX(lightX)
      setLightningActive(true)
      setCloudGlow(1)

      timeouts.push(setTimeout(() => setCloudGlow(0.6), 100))
      timeouts.push(setTimeout(() => setCloudGlow(0.25), 200))
      timeouts.push(setTimeout(() => {
        setLightningActive(false)
        setCloudGlow(0)
      }, 400))

      // Spawn infernal on LEFT or RIGHT side of content (not middle)
      timeouts.push(setTimeout(() => {
        if (!isActive) return
        const newId = infernalId++
        const side: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right'
        // Left side: 5-18%, Right side: 82-95% - beside the content card
        const startX = side === 'left' ? (5 + Math.random() * 13) : (82 + Math.random() * 13)
        // Diagonal drift toward center
        const drift = side === 'left' ? (5 + Math.random() * 8) : -(5 + Math.random() * 8)
        const landX = startX + drift

        // Phase 1: Falling (4s slow diagonal descent)
        setInfernals(prev => [...prev, { id: newId, x: startX, landX, side, phase: 'falling' }])

        // Phase 2: Explosion (after 4s fall)
        timeouts.push(setTimeout(() => {
          if (!isActive) return
          setInfernals(prev => prev.map(inf =>
            inf.id === newId ? { ...inf, phase: 'explosion' } : inf
          ))
        }, 4000))

        // Phase 3: Rising (after 0.6s explosion)
        timeouts.push(setTimeout(() => {
          if (!isActive) return
          setInfernals(prev => prev.map(inf =>
            inf.id === newId ? { ...inf, phase: 'rising' } : inf
          ))
        }, 4600))

        // Phase 4: Idle (after 1s rising)
        timeouts.push(setTimeout(() => {
          if (!isActive) return
          setInfernals(prev => prev.map(inf =>
            inf.id === newId ? { ...inf, phase: 'idle' } : inf
          ))
        }, 5600))

        // Remove after 12s total
        timeouts.push(setTimeout(() => {
          if (!isActive) return
          setInfernals(prev => prev.filter(inf => inf.id !== newId))
        }, 12000))
      }, 200))
    }

    const scheduleNext = () => {
      if (!isActive) return
      const delay = 6000 + Math.random() * 8000 // 6-14s between infernals
      timeouts.push(setTimeout(() => {
        triggerLightningStorm()
        scheduleNext()
      }, delay))
    }

    // Start first infernal quickly
    timeouts.push(setTimeout(triggerLightningStorm, 1500))
    scheduleNext()

    return () => {
      isActive = false
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [])

  // Heavy storm rain - 3 layers for depth
  const rainDrops = useMemo(() => ({
    // Back layer - faint, slow
    back: Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 130 - 15,
      delay: Math.random() * -4,
      duration: 1.0 + Math.random() * 0.3,
      length: 15 + Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.1,
    })),
    // Mid layer - medium
    mid: Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 125 - 12,
      delay: Math.random() * -3,
      duration: 0.7 + Math.random() * 0.25,
      length: 25 + Math.random() * 15,
      opacity: 0.35 + Math.random() * 0.15,
    })),
    // Front layer - bright, fast
    front: Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -2,
      duration: 0.5 + Math.random() * 0.2,
      length: 35 + Math.random() * 20,
      opacity: 0.5 + Math.random() * 0.2,
    })),
  }), [])

  return (
    <>
      {/* Sky gradient with depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          #020302 0%,
          #040604 10%,
          #0a120a 25%,
          #0d180d 45%,
          #0a140a 65%,
          #060a06 85%,
          #030403 100%)`
      }} />

      {/* === BATTLEFIELD BACKGROUND - Animated Painting === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '75%' }} viewBox="0 0 1000 750" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Gradients for depth */}
          <linearGradient id="battlefieldFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a150a" stopOpacity="0" />
            <stop offset="30%" stopColor="#0a150a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#060806" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={WC3.roc.felMid} stopOpacity="0.15" />
            <stop offset="50%" stopColor={WC3.roc.fireMid} stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <filter id="distantBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <filter id="midBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Horizon glow - distant fires */}
        <rect x="0" y="0" width="1000" height="200" fill="url(#horizonGlow)" />

        {/* FAR LAYER - Distant citadels and towers (silhouettes) */}
        <g filter="url(#distantBlur)" opacity="0.25">
          {/* Ruined tower left */}
          <polygon points="80,180 95,80 105,85 115,60 125,90 140,180" fill="#0a120a" />
          <rect x="90" y="100" width="30" height="6" fill={WC3.roc.fireMid} opacity="0.4" />

          {/* Burning fortress center-left */}
          <polygon points="250,180 260,100 280,110 295,50 310,105 330,120 340,180" fill="#0d150d" />
          <polygon points="290,55 295,50 300,55 300,70 290,70" fill={WC3.roc.fireBright} opacity="0.5" />

          {/* Massive ruined gate center */}
          <polygon points="450,180 460,90 480,100 500,40 520,100 540,90 550,180" fill="#0a130a" />
          <polygon points="470,180 480,130 495,135 500,110 505,135 520,130 530,180" fill="#060906" />
          <rect x="490" y="60" width="20" height="40" fill={WC3.roc.fireMid} opacity="0.3" />

          {/* Watchtower right */}
          <polygon points="720,180 730,100 745,70 760,100 770,180" fill="#0d150d" />

          {/* Ruined wall far right */}
          <polygon points="850,180 860,140 880,150 900,120 920,145 940,130 960,180" fill="#0a120a" />
        </g>

        {/* MID LAYER - Battlefield debris, siege weapons */}
        <g filter="url(#midBlur)" opacity="0.35">
          {/* Broken siege tower left */}
          <polygon points="60,350 80,200 120,210 140,350" fill="#1a2518" />
          <polygon points="70,280 85,230 115,235 130,280" fill="#0d150d" />
          <line x1="90" y1="220" x2="70" y2="300" stroke="#2a3525" strokeWidth="3" />

          {/* Fallen catapult */}
          <g transform="translate(200, 300) rotate(-15)">
            <rect x="0" y="0" width="80" height="15" fill="#2a2015" />
            <polygon points="60,-30 70,0 80,-30 85,0 90,-25" fill="#3a3020" />
            <circle cx="10" cy="20" r="12" fill="#1a1510" stroke="#2a2520" strokeWidth="2" />
            <circle cx="70" cy="20" r="12" fill="#1a1510" stroke="#2a2520" strokeWidth="2" />
          </g>

          {/* War banners - tattered */}
          <g transform="translate(380, 280)">
            <line x1="0" y1="0" x2="0" y2="80" stroke="#3a2a1a" strokeWidth="4" />
            <path d="M2,10 Q30,20 25,45 Q20,60 35,75 L5,70 Q10,55 5,40 Z" fill={WC3.bloodRed} opacity="0.6" />
          </g>

          {/* Broken ballista */}
          <g transform="translate(550, 320)">
            <rect x="0" y="0" width="60" height="10" fill="#2a2015" transform="rotate(-8)" />
            <line x1="30" y1="-5" x2="70" y2="-40" stroke="#3a3025" strokeWidth="4" />
            <line x1="30" y1="-5" x2="-10" y2="-30" stroke="#3a3025" strokeWidth="3" />
          </g>

          {/* Ruined wall segment */}
          <polygon points="700,350 710,280 730,290 750,260 770,285 790,270 820,350" fill="#1a2518" />
          <polygon points="740,280 750,260 760,275" fill={WC3.roc.felDark} opacity="0.3" />
        </g>

        {/* NEAR LAYER - Foreground debris, bodies, weapons */}
        <g opacity="0.45">
          {/* Fallen soldier silhouettes - left */}
          <ellipse cx="50" cy="550" rx="40" ry="12" fill="#0d150d" />
          <polygon points="30,540 45,520 60,530 70,545 50,555 25,550" fill="#1a2218" />
          <line x1="70" y1="540" x2="95" y2="510" stroke="#3a3a35" strokeWidth="2" />

          {/* Broken sword and shield */}
          <g transform="translate(150, 520)">
            <polygon points="0,0 5,-40 10,-38 12,0 8,5 4,5" fill="#4a4a45" />
            <ellipse cx="30" cy="15" rx="20" ry="25" fill="#3a2a1a" transform="rotate(-20)" />
            <ellipse cx="30" cy="15" rx="12" ry="15" fill="#2a1a10" transform="rotate(-20)" />
          </g>

          {/* Bodies mid */}
          <ellipse cx="320" cy="600" rx="35" ry="10" fill="#0d150d" />
          <ellipse cx="450" cy="580" rx="30" ry="8" fill="#0d150d" />

          {/* Embedded weapons */}
          <line x1="400" y1="620" x2="420" y2="560" stroke="#4a4a45" strokeWidth="3" />
          <polygon points="418,565 420,555 425,560 422,570" fill="#5a5a55" />

          {/* War banner fallen */}
          <g transform="translate(550, 580)">
            <line x1="0" y1="0" x2="60" y2="-15" stroke="#3a2a1a" strokeWidth="5" />
            <path d="M60,-15 Q90,-5 85,20 Q80,35 100,45 L65,40 Q70,30 65,15 Z" fill={WC3.hordeRed} opacity="0.5" />
          </g>

          {/* More fallen warriors - right */}
          <ellipse cx="700" cy="620" rx="45" ry="12" fill="#0d150d" />
          <polygon points="680,610 695,590 720,600 740,615 710,625 675,620" fill="#1a2218" />

          {/* Spear cluster */}
          <line x1="800" y1="650" x2="820" y2="550" stroke="#3a3a35" strokeWidth="2" />
          <line x1="815" y1="655" x2="840" y2="560" stroke="#3a3a35" strokeWidth="2" />
          <line x1="830" y1="660" x2="845" y2="580" stroke="#3a3a35" strokeWidth="2" />

          {/* Skull */}
          <circle cx="900" cy="630" r="12" fill="#8a8a80" opacity="0.3" />
          <ellipse cx="895" cy="628" rx="3" ry="4" fill="#1a1a18" />
          <ellipse cx="905" cy="628" rx="3" ry="4" fill="#1a1a18" />
        </g>

        {/* Ground plane fade */}
        <rect x="0" y="100" width="1000" height="650" fill="url(#battlefieldFade)" />

        {/* Perspective lines (subtle) */}
        <g opacity="0.08">
          {[-50, -30, -15, 0, 15, 30, 50].map((offset, i) => (
            <line key={i} x1={500 + offset * 3} y1="100" x2={offset < 0 ? -300 : offset > 0 ? 1300 : 500} y2="750" stroke="#1a2a1a" strokeWidth="1" />
          ))}
        </g>
      </svg>

      {/* === VIGNETTE LIGHTING - Dark edges, lit center === */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%),
          radial-gradient(ellipse 80% 50% at 50% 50%, ${WC3.roc.felDark}15 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Corner darkening */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '30%',
        height: '40%',
        background: `radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.5) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '40%',
        background: `radial-gradient(ellipse at 100% 0%, rgba(0,0,0,0.5) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '35%',
        height: '35%',
        background: `radial-gradient(ellipse at 0% 100%, rgba(0,0,0,0.6) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '35%',
        height: '35%',
        background: `radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.6) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Volumetric cloud layers */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%' }} viewBox="0 0 1000 500" preserveAspectRatio="none">
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
          <filter id="cloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <radialGradient id="cloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1a2818" />
            <stop offset="60%" stopColor="#0f1a0d" />
            <stop offset="100%" stopColor="#080c08" />
          </radialGradient>
        </defs>
        {/* Far background clouds - massive, blurred */}
        <g filter="url(#cloudBlur)" opacity="0.6">
          <ellipse cx="150" cy="100" rx="300" ry="120" fill="#0a120a" />
          <ellipse cx="500" cy="80" rx="400" ry="150" fill="#0d150d" />
          <ellipse cx="850" cy="110" rx="320" ry="130" fill="#0a120a" />
        </g>
        {/* Mid clouds - storm mass */}
        <g filter="url(#cloudBlurLight)" opacity="0.8">
          <ellipse cx="200" cy="180" rx="250" ry="90" fill="url(#cloudCore)" />
          <ellipse cx="480" cy="150" rx="320" ry="110" fill="url(#cloudCore)" />
          <ellipse cx="780" cy="190" rx="280" ry="95" fill="url(#cloudCore)" />
        </g>
        {/* Front detail clouds */}
        <g opacity="0.5">
          <ellipse cx="100" cy="280" rx="150" ry="50" fill="#0d180d" />
          <ellipse cx="350" cy="250" rx="180" ry="60" fill="#0a150a" />
          <ellipse cx="600" cy="270" rx="200" ry="55" fill="#0d180d" />
          <ellipse cx="880" cy="260" rx="160" ry="50" fill="#0a150a" />
        </g>
        {/* Wispy cloud tendrils */}
        <g opacity="0.25">
          <path d="M0,320 Q150,300 300,330 Q450,310 500,340" stroke="#1a2518" strokeWidth="20" fill="none" />
          <path d="M500,310 Q650,330 800,300 Q900,320 1000,310" stroke="#1a2518" strokeWidth="15" fill="none" />
        </g>
      </svg>

      {/* Cloud glow when lightning strikes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: `radial-gradient(ellipse at ${lightningX}% 35%, ${WC3.roc.felBright}${Math.floor(cloudGlow * 50).toString(16).padStart(2, '0')} 0%, ${WC3.roc.felMid}${Math.floor(cloudGlow * 25).toString(16).padStart(2, '0')} 25%, transparent 60%)`,
        transition: 'background 0.15s ease',
        pointerEvents: 'none',
      }} />

      {/* Lightning bolt */}
      {lightningActive && (
        <svg
          style={{
            position: 'absolute',
            top: '8%',
            left: `${lightningX - 4}%`,
            width: '8%',
            height: '45%',
            opacity: 0.85,
            filter: `drop-shadow(0 0 15px ${WC3.roc.felBright}) drop-shadow(0 0 30px ${WC3.roc.felMid})`,
          }}
          viewBox="0 0 80 450"
        >
          <path
            d="M40 0 L35 70 L55 80 L30 160 L48 170 L22 270 L42 280 L15 380 L50 290 L32 280 L58 180 L40 170 L65 90 L45 80 Z"
            fill={WC3.roc.felBright}
          />
          <path
            d="M40 5 L37 65 L52 75 L32 150 L47 160 L26 250 L44 260 L22 360 L48 275 L34 268 L56 172 L42 165 L62 88 L46 82 Z"
            fill="#aaffaa"
            opacity="0.7"
          />
        </svg>
      )}

      {/* === WC3 INFERNAL - Slow diagonal fall → Explosion → Creature rises === */}
      {infernals.map((inf) => (
        <div key={inf.id}>
          {/* PHASE 1: FALLING ASTEROID - Slow diagonal descent */}
          {inf.phase === 'falling' && (
            <div
              style={{
                position: 'absolute',
                left: `${inf.x}%`,
                top: '-8%',
                animation: `infernalFall${inf.side === 'left' ? 'Right' : 'Left'} 4s ease-in forwards`,
              }}
            >
              {/* Outer glow - large atmospheric */}
              <div style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                left: '-25px',
                top: '-25px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${WC3.roc.felBright}40 0%, ${WC3.roc.felMid}20 40%, transparent 70%)`,
                filter: 'blur(12px)',
                animation: 'meteorPulse 0.8s ease-in-out infinite',
              }} />
              {/* Asteroid body - rocky irregular shape */}
              <svg width="30" height="30" viewBox="0 0 30 30" style={{ position: 'relative', zIndex: 2 }}>
                <defs>
                  <radialGradient id={`asteroidGrad${inf.id}`} cx="30%" cy="30%">
                    <stop offset="0%" stopColor={WC3.roc.fireCore} />
                    <stop offset="30%" stopColor={WC3.roc.fireBright} />
                    <stop offset="60%" stopColor={WC3.roc.felMid} />
                    <stop offset="100%" stopColor="#2a1a0a" />
                  </radialGradient>
                  <filter id={`asteroidGlow${inf.id}`}>
                    <feGaussianBlur stdDeviation="2" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Rocky irregular shape */}
                <path
                  d="M15,2 L22,6 L26,12 L28,18 L24,24 L18,28 L10,26 L4,22 L2,14 L6,8 L12,4 Z"
                  fill={`url(#asteroidGrad${inf.id})`}
                  filter={`url(#asteroidGlow${inf.id})`}
                />
                {/* Surface cracks glowing */}
                <path d="M10,8 L15,15 L12,22" stroke={WC3.roc.felBright} strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M20,10 L15,15 L22,20" stroke={WC3.roc.fireBright} strokeWidth="1" fill="none" opacity="0.5" />
                {/* Hot spots */}
                <circle cx="12" cy="12" r="3" fill={WC3.roc.fireCore} opacity="0.7" />
                <circle cx="18" cy="16" r="2" fill={WC3.roc.fireBright} opacity="0.5" />
              </svg>
              {/* Fire trail - diagonal */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                left: '25px',
                width: '20px',
                height: '120px',
                background: `linear-gradient(160deg, transparent 0%, ${WC3.roc.felDark}30 15%, ${WC3.roc.felMid}60 40%, ${WC3.roc.felBright}80 70%, ${WC3.roc.fireCore} 100%)`,
                filter: 'blur(5px)',
                transform: 'rotate(-20deg)',
                transformOrigin: 'bottom center',
              }} />
              {/* Secondary trail wisps */}
              <div style={{
                position: 'absolute',
                top: '-70px',
                left: '35px',
                width: '10px',
                height: '80px',
                background: `linear-gradient(155deg, transparent 0%, ${WC3.roc.felMid}40 50%, ${WC3.roc.felBright}70 100%)`,
                filter: 'blur(4px)',
                transform: 'rotate(-25deg)',
                transformOrigin: 'bottom center',
                opacity: 0.6,
              }} />
            </div>
          )}

          {/* PHASE 2: EXPLOSION - Fel green explosion */}
          {inf.phase === 'explosion' && (
            <div
              style={{
                position: 'absolute',
                left: `${inf.landX}%`,
                top: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {/* Main explosion flash */}
              <div style={{
                position: 'absolute',
                left: '-80px',
                bottom: '-40px',
                width: '160px',
                height: '100px',
                background: `radial-gradient(ellipse at 50% 80%, ${WC3.roc.fireCore} 0%, ${WC3.roc.felBright}90 20%, ${WC3.roc.felMid}60 45%, ${WC3.roc.felDark}30 70%, transparent 100%)`,
                animation: 'explosionFlash 0.6s ease-out forwards',
              }} />
              {/* Debris particles */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${-20 + i * 10}px`,
                    bottom: '0px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '30%',
                    background: i % 2 === 0 ? WC3.roc.felBright : WC3.roc.fireBright,
                    animation: `debrisFly${i % 3} 0.5s ease-out forwards`,
                    opacity: 0.8,
                  }}
                />
              ))}
              {/* Ground scorch mark */}
              <div style={{
                position: 'absolute',
                left: '-50px',
                bottom: '-10px',
                width: '100px',
                height: '25px',
                background: `radial-gradient(ellipse, ${WC3.roc.felDark} 0%, ${WC3.roc.felDark}60 40%, transparent 80%)`,
                borderRadius: '50%',
              }} />
            </div>
          )}

          {/* PHASE 3: RISING - Infernal creature emerges */}
          {inf.phase === 'rising' && (
            <div
              style={{
                position: 'absolute',
                left: `${inf.landX}%`,
                top: '50%',
                transform: 'translateX(-50%)',
                animation: 'infernalRise 1s ease-out forwards',
              }}
            >
              {/* Infernal creature SVG - rock golem with fel flames */}
              <svg width="50" height="70" viewBox="0 0 50 70" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id={`rockBody${inf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3a3530" />
                    <stop offset="50%" stopColor="#252220" />
                    <stop offset="100%" stopColor="#1a1815" />
                  </linearGradient>
                </defs>
                {/* Body glow */}
                <ellipse cx="25" cy="45" rx="30" ry="35" fill={WC3.roc.felMid} opacity="0.2" filter="url(#asteroidGlow0)" />
                {/* Legs */}
                <path d="M15,55 L10,70 L18,68 L20,55" fill={`url(#rockBody${inf.id})`} />
                <path d="M35,55 L40,70 L32,68 L30,55" fill={`url(#rockBody${inf.id})`} />
                {/* Torso */}
                <path d="M12,35 L10,55 L40,55 L38,35 L32,25 L18,25 Z" fill={`url(#rockBody${inf.id})`} />
                {/* Arms */}
                <path d="M12,35 L2,45 L5,50 L15,42" fill={`url(#rockBody${inf.id})`} />
                <path d="M38,35 L48,45 L45,50 L35,42" fill={`url(#rockBody${inf.id})`} />
                {/* Head */}
                <path d="M18,25 L15,12 L22,5 L28,5 L35,12 L32,25 Z" fill={`url(#rockBody${inf.id})`} />
                {/* Fel flame joints */}
                <ellipse cx="25" cy="40" rx="8" ry="6" fill={WC3.roc.felBright} opacity="0.7" />
                <ellipse cx="12" cy="40" rx="4" ry="3" fill={WC3.roc.felMid} opacity="0.6" />
                <ellipse cx="38" cy="40" rx="4" ry="3" fill={WC3.roc.felMid} opacity="0.6" />
                {/* Eyes - glowing fel */}
                <ellipse cx="20" cy="14" rx="3" ry="2" fill={WC3.roc.felBright} />
                <ellipse cx="30" cy="14" rx="3" ry="2" fill={WC3.roc.felBright} />
              </svg>
              {/* Ground scorch persists */}
              <div style={{
                position: 'absolute',
                left: '-25px',
                bottom: '-15px',
                width: '100px',
                height: '25px',
                background: `radial-gradient(ellipse, ${WC3.roc.felDark}80 0%, ${WC3.roc.felDark}40 50%, transparent 80%)`,
                borderRadius: '50%',
              }} />
            </div>
          )}

          {/* PHASE 4: IDLE - Infernal stands with breathing animation */}
          {inf.phase === 'idle' && (
            <div
              style={{
                position: 'absolute',
                left: `${inf.landX}%`,
                top: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {/* Infernal creature with idle animation */}
              <svg width="50" height="70" viewBox="0 0 50 70" style={{ overflow: 'visible', animation: 'infernalBreath 2s ease-in-out infinite' }}>
                <defs>
                  <linearGradient id={`rockBodyIdle${inf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3a3530" />
                    <stop offset="50%" stopColor="#252220" />
                    <stop offset="100%" stopColor="#1a1815" />
                  </linearGradient>
                  <filter id={`felGlow${inf.id}`}>
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Body glow - pulsing */}
                <ellipse cx="25" cy="45" rx="28" ry="32" fill={WC3.roc.felMid} opacity="0.15" style={{ animation: 'felPulse 1.5s ease-in-out infinite' }} />
                {/* Legs */}
                <path d="M15,55 L10,70 L18,68 L20,55" fill={`url(#rockBodyIdle${inf.id})`} />
                <path d="M35,55 L40,70 L32,68 L30,55" fill={`url(#rockBodyIdle${inf.id})`} />
                {/* Torso */}
                <path d="M12,35 L10,55 L40,55 L38,35 L32,25 L18,25 Z" fill={`url(#rockBodyIdle${inf.id})`} />
                {/* Arms */}
                <path d="M12,35 L2,45 L5,50 L15,42" fill={`url(#rockBodyIdle${inf.id})`} />
                <path d="M38,35 L48,45 L45,50 L35,42" fill={`url(#rockBodyIdle${inf.id})`} />
                {/* Head */}
                <path d="M18,25 L15,12 L22,5 L28,5 L35,12 L32,25 Z" fill={`url(#rockBodyIdle${inf.id})`} />
                {/* Fel flame joints - flickering */}
                <ellipse cx="25" cy="40" rx="8" ry="6" fill={WC3.roc.felBright} opacity="0.8" filter={`url(#felGlow${inf.id})`} style={{ animation: 'flameFlicker 0.3s ease-in-out infinite alternate' }} />
                <ellipse cx="12" cy="40" rx="4" ry="3" fill={WC3.roc.felMid} opacity="0.7" style={{ animation: 'flameFlicker 0.4s ease-in-out infinite alternate' }} />
                <ellipse cx="38" cy="40" rx="4" ry="3" fill={WC3.roc.felMid} opacity="0.7" style={{ animation: 'flameFlicker 0.35s ease-in-out infinite alternate' }} />
                {/* Knee flames */}
                <ellipse cx="15" cy="58" rx="3" ry="2" fill={WC3.roc.felDark} opacity="0.5" />
                <ellipse cx="35" cy="58" rx="3" ry="2" fill={WC3.roc.felDark} opacity="0.5" />
                {/* Eyes - glowing fel */}
                <ellipse cx="20" cy="14" rx="3" ry="2" fill={WC3.roc.felBright} style={{ animation: 'eyeGlow 2s ease-in-out infinite' }} />
                <ellipse cx="30" cy="14" rx="3" ry="2" fill={WC3.roc.felBright} style={{ animation: 'eyeGlow 2s ease-in-out infinite' }} />
              </svg>
              {/* Ground scorch persists */}
              <div style={{
                position: 'absolute',
                left: '-25px',
                bottom: '-15px',
                width: '100px',
                height: '25px',
                background: `radial-gradient(ellipse, ${WC3.roc.felDark}80 0%, ${WC3.roc.felDark}40 50%, transparent 80%)`,
                borderRadius: '50%',
              }} />
            </div>
          )}
        </div>
      ))}

      {/* === HEAVY STORM RAIN - 3 depth layers === */}
      {/* Back layer - distant, faint */}
      {rainDrops.back.map((drop) => (
        <div
          key={`rain-b-${drop.id}`}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-5%',
            width: '1px',
            height: drop.length,
            background: `linear-gradient(180deg, transparent 0%, rgba(80,100,80,${drop.opacity}) 50%, rgba(80,100,80,${drop.opacity * 0.3}) 100%)`,
            animation: `rainStorm ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
      {/* Mid layer - medium prominence */}
      {rainDrops.mid.map((drop) => (
        <div
          key={`rain-m-${drop.id}`}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-5%',
            width: '1px',
            height: drop.length,
            background: `linear-gradient(180deg, transparent 0%, rgba(100,120,100,${drop.opacity}) 40%, rgba(100,120,100,${drop.opacity * 0.4}) 100%)`,
            animation: `rainStorm ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
      {/* Front layer - bright, prominent */}
      {rainDrops.front.map((drop) => (
        <div
          key={`rain-f-${drop.id}`}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-5%',
            width: '1.5px',
            height: drop.length,
            background: `linear-gradient(180deg, transparent 0%, rgba(140,160,140,${drop.opacity}) 30%, rgba(120,140,120,${drop.opacity * 0.5}) 100%)`,
            animation: `rainStorm ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
            filter: 'blur(0.3px)',
          }}
        />
      ))}

      {/* Ground mist */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        background: `linear-gradient(0deg, #0a0f0a50 0%, #0a0f0a20 50%, transparent 100%)`,
        filter: 'blur(10px)',
      }} />

      <style>{`
        /* Infernal falling from LEFT side - drifts RIGHT toward content */
        @keyframes infernalFallRight {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translate(1vw, 3vh) scale(0.6);
          }
          100% {
            transform: translate(8vw, 55vh) scale(1);
            opacity: 1;
          }
        }
        /* Infernal falling from RIGHT side - drifts LEFT toward content */
        @keyframes infernalFallLeft {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translate(-1vw, 3vh) scale(0.6);
          }
          100% {
            transform: translate(-8vw, 55vh) scale(1);
            opacity: 1;
          }
        }
        /* Meteor glow pulsing while falling */
        @keyframes meteorPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
        }
        /* Explosion flash on impact */
        @keyframes explosionFlash {
          0% {
            transform: scale(0.3);
            opacity: 1;
            filter: brightness(2);
          }
          30% {
            transform: scale(1.2);
            opacity: 0.9;
            filter: brightness(1.5);
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
            filter: brightness(0.5);
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
        /* Infernal creature rising from impact */
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
        /* Idle breathing animation */
        @keyframes infernalBreath {
          0%, 100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.03) translateY(-2px);
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
        /* Joint flame flicker */
        @keyframes flameFlicker {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 0.9;
            transform: scale(1.1);
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
        /* Rain storm */
        @keyframes rainStorm {
          0% { transform: translate(0, 0) rotate(-12deg); opacity: 0.5; }
          100% { transform: translate(18vw, 120vh) rotate(-12deg); opacity: 0; }
        }
      `}</style>
    </>
  )
})

// =============================================================================
// FROZEN THRONE ATMOSPHERE - Heavy blizzard/ice storm
// =============================================================================

const FrozenThroneAtmosphere = memo(function FrozenThroneAtmosphere() {
  // Dense snow layers
  const snowLayers = useMemo(() => ({
    // Far layer - small, slow, many
    far: Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -15,
      duration: 10 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    })),
    // Mid layer - medium size and speed
    mid: Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -10,
      duration: 6 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    })),
    // Near layer - large, fast, few
    near: Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -5,
      duration: 3 + Math.random() * 2,
      size: 4 + Math.random() * 4,
    })),
  }), [])

  // Wind/frost streaks
  const windStreaks = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      y: Math.random() * 100,
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

      {/* Horizontal wind/frost streaks */}
      {windStreaks.map((streak) => (
        <div
          key={streak.id}
          style={{
            position: 'absolute',
            top: `${streak.y}%`,
            left: '-15%',
            width: streak.length,
            height: streak.thickness,
            background: `linear-gradient(90deg, transparent 0%, ${WC3.ft.frostWhite}30 30%, ${WC3.ft.frostWhite}50 50%, ${WC3.ft.frostWhite}30 70%, transparent 100%)`,
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
          100% { transform: translateX(130vw); opacity: 0; }
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

const RoCArtDivider = memo(function RoCArtDivider({ variant = 'weapons', scale = 1 }: { variant?: 'weapons' | 'banner' | 'rune'; scale?: number }) {
  return (
    <div style={{
      position: 'relative',
      height: `${80 * scale}px`,
      margin: `${1.5 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {/* Horizontal line base */}
      <div style={{
        position: 'absolute',
        left: '10%',
        right: '10%',
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${WC3.metalDark} 20%, ${WC3.metalMid} 50%, ${WC3.metalDark} 80%, transparent 100%)`,
      }} />

      {/* Center art piece */}
      <svg width="120" height="70" viewBox="0 0 120 70" style={{ position: 'relative', zIndex: 2 }}>
        {variant === 'weapons' && (
          <>
            {/* Crossed broken swords */}
            <g transform="translate(60,35)">
              {/* Left sword */}
              <g transform="rotate(-30)">
                <path d="M-5,-30 L0,-28 L3,0 L-3,0 Z" fill={WC3.metalLight} />
                <path d="M-2,-25 L0,-24 L1,-5" fill="none" stroke={WC3.metalHighlight} strokeWidth="1" opacity="0.6" />
                <rect x="-5" y="0" width="10" height="4" fill={WC3.goldDark} />
                <rect x="-2" y="4" width="4" height="8" fill="#3a2a1a" />
              </g>
              {/* Right sword */}
              <g transform="rotate(30)">
                <path d="M-5,-30 L0,-28 L3,0 L-3,0 Z" fill={WC3.metalLight} />
                <path d="M-2,-25 L0,-24 L1,-5" fill="none" stroke={WC3.metalHighlight} strokeWidth="1" opacity="0.6" />
                <rect x="-5" y="0" width="10" height="4" fill={WC3.goldDark} />
                <rect x="-2" y="4" width="4" height="8" fill="#3a2a1a" />
              </g>
              {/* Shield in center */}
              <ellipse cx="0" cy="5" rx="12" ry="14" fill="#4a3525" stroke={WC3.metalMid} strokeWidth="2" />
              <ellipse cx="0" cy="5" rx="6" ry="8" fill="none" stroke={WC3.goldDark} strokeWidth="1" opacity="0.6" />
              <circle cx="0" cy="5" r="3" fill={WC3.roc.felDark} opacity="0.8" />
            </g>
          </>
        )}
        {variant === 'banner' && (
          <>
            {/* War banner */}
            <g transform="translate(60,10)">
              {/* Pole */}
              <rect x="-2" y="0" width="4" height="55" fill="#3a2a1a" />
              <circle cx="0" cy="2" r="4" fill={WC3.goldDark} />
              {/* Banner fabric */}
              <path d="M2,8 Q30,18 25,35 Q22,48 35,55 L4,50 Q8,40 5,28 Z" fill={WC3.bloodRed} opacity="0.9" />
              <path d="M-2,8 Q-28,20 -24,38 Q-20,50 -32,55 L-4,50 Q-6,42 -4,30 Z" fill={WC3.hordeRed} opacity="0.85" />
              {/* Emblem hint */}
              <circle cx="15" cy="30" r="8" fill={WC3.goldDark} opacity="0.5" />
            </g>
          </>
        )}
        {variant === 'rune' && (
          <>
            {/* Demonic rune circle */}
            <g transform="translate(60,35)">
              <circle cx="0" cy="0" r="28" fill="none" stroke={WC3.roc.felDark} strokeWidth="2" opacity="0.6" />
              <circle cx="0" cy="0" r="22" fill="none" stroke={WC3.roc.felMid} strokeWidth="1" opacity="0.5" />
              {/* Rune spokes */}
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <line key={i} x1={Math.cos(angle * Math.PI / 180) * 10} y1={Math.sin(angle * Math.PI / 180) * 10} x2={Math.cos(angle * Math.PI / 180) * 26} y2={Math.sin(angle * Math.PI / 180) * 26} stroke={WC3.roc.felMid} strokeWidth="2" opacity="0.7" />
              ))}
              {/* Inner glow */}
              <circle cx="0" cy="0" r="8" fill={WC3.roc.felDark} opacity="0.4" />
              <circle cx="0" cy="0" r="4" fill={WC3.roc.felBright} opacity="0.3" />
            </g>
          </>
        )}
        {/* Side decorations */}
        <circle cx="15" cy="35" r="3" fill={WC3.metalMid} />
        <circle cx="105" cy="35" r="3" fill={WC3.metalMid} />
      </svg>

      {/* Subtle glow */}
      <div style={{
        position: 'absolute',
        inset: '20%',
        background: `radial-gradient(ellipse at center, ${WC3.roc.felGlow} 0%, transparent 70%)`,
        opacity: 0.3,
        filter: 'blur(15px)',
        pointerEvents: 'none',
      }} />
    </div>
  )
})

const FTArtDivider = memo(function FTArtDivider({ variant = 'crystals', scale = 1 }: { variant?: 'crystals' | 'rune' | 'throne'; scale?: number }) {
  return (
    <div style={{
      position: 'relative',
      height: `${80 * scale}px`,
      margin: `${1.5 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {/* Horizontal line base - icy */}
      <div style={{
        position: 'absolute',
        left: '10%',
        right: '10%',
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${WC3.ft.iceDark}60 20%, ${WC3.ft.iceMid}80 50%, ${WC3.ft.iceDark}60 80%, transparent 100%)`,
      }} />

      {/* Center art piece */}
      <svg width="140" height="70" viewBox="0 0 140 70" style={{ position: 'relative', zIndex: 2 }}>
        {variant === 'crystals' && (
          <>
            {/* Ice crystal cluster */}
            <g transform="translate(70,35)">
              {/* Center large crystal */}
              <polygon points="0,-30 6,-10 4,15 -4,15 -6,-10" fill={WC3.ft.iceMid} opacity="0.8" />
              <polygon points="0,-28 4,-12 3,10" fill={WC3.ft.iceBright} opacity="0.4" />
              {/* Left crystals */}
              <polygon points="-15,-20 -10,-8 -12,15 -18,15 -20,-8" fill={WC3.ft.iceDark} opacity="0.7" transform="rotate(-15)" />
              <polygon points="-25,-12 -22,-2 -24,12 -28,12 -28,-2" fill={WC3.ft.iceMid} opacity="0.5" transform="rotate(-25)" />
              {/* Right crystals */}
              <polygon points="15,-20 20,-8 18,15 12,15 10,-8" fill={WC3.ft.iceDark} opacity="0.7" transform="rotate(15)" />
              <polygon points="25,-12 28,-2 26,12 22,12 22,-2" fill={WC3.ft.iceMid} opacity="0.5" transform="rotate(25)" />
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

  // Calculate available space and whether to show extra content
  const isLargeScreen = viewportHeight >= 800
  const isExtraLargeScreen = viewportHeight >= 1000
  const sectionSpacing = isExtraLargeScreen ? '3rem' : isLargeScreen ? '2.5rem' : '2rem'
  const artDividerScale = isExtraLargeScreen ? 1.2 : isLargeScreen ? 1 : 0.85

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

      <div style={{ position: 'relative', zIndex: 2, padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* ============ REIGN OF CHAOS ZONE ============ */}

        {/* Header */}
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
                  <p style={{ color: WC3.textMid, fontSize: '0.75rem', fontStyle: 'italic' }}>{PROFESSIONAL_SUMMARY.tagline}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <WC3Button href="/cv" zone="roc">Scroll</WC3Button>
                  <WC3Button href="/personal-projects/game-engine" zone="roc">Nebulith</WC3Button>
                  <ThemeSwitcher />
                </div>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${WC3.metalDark}`, display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {CURRENT_ROLES.map((role) => (
                  <div key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', background: WC3.roc.felMid, boxShadow: `0 0 6px ${WC3.roc.felMid}` }} />
                    <div>
                      <p style={{ color: WC3.roc.felBright, fontSize: '0.75rem', fontWeight: 600 }}>{role.title}</p>
                      <p style={{ color: WC3.textDim, fontSize: '0.625rem' }}>{role.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </WC3Frame>
          </header>
        </FadeInSection>

        {/* Profession Selector */}
        <FadeInSection delay={100}>
          <nav style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <WC3Button onClick={() => setActive('engineer')} active={active === 'engineer'} zone="roc">Engineer</WC3Button>
            <WC3Button onClick={() => setActive('drummer')} active={active === 'drummer'} zone="roc">Musician</WC3Button>
            <WC3Button onClick={() => setActive('fighter')} active={active === 'fighter'} zone="roc">Muay Thai</WC3Button>
          </nav>
        </FadeInSection>

        {/* About */}
        <FadeInSection>
          <section style={{ marginBottom: '2rem' }}>
            <WC3Frame title="About" zone="roc">
              <p style={{ color: WC3.textBright, lineHeight: 1.7, marginBottom: '0.75rem', fontSize: '0.875rem' }}>{aboutData.bio}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {aboutData.quickFacts.map((fact, i) => (
                  <span key={i} style={{
                    background: WC3.metalDark,
                    border: `1px solid ${WC3.metalMid}`,
                    color: WC3.textMid,
                    fontSize: '0.625rem',
                    padding: '0.25rem 0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
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
          <RoCArtDivider variant="weapons" scale={artDividerScale} />
        </FadeInSection>

        {/* Work Experience - with RoC ornaments */}
        <FadeInSection>
          <SectionWithOrnament
            leftOrnament={<RoCOrnament side="left" type="flag" />}
            rightOrnament={<RoCOrnament side="right" type="weapons" />}
          >
            <section style={{ marginBottom: '2rem' }}>
              <WC3Frame title="Work Experience" zone="roc">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {active === 'engineer' ? workExperience.map((job) => (
                    <InnerCard key={job.company} highlight={job.current} zone="roc">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                        <div>
                          <h3 style={{ color: WC3.textBright, fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.125rem' }}>{job.title}</h3>
                          <p style={{ color: WC3.goldMid, fontSize: '0.75rem' }}>{job.company}</p>
                        </div>
                        <span style={{ color: WC3.textDim, fontSize: '0.625rem' }}>{job.period}</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0.375rem 0 0 0' }}>
                        {job.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} style={{ color: WC3.textMid, fontSize: '0.75rem', paddingLeft: '0.75rem', position: 'relative', marginBottom: '0.125rem' }}>
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
                              fontSize: '0.5rem',
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
                      <p style={{ color: WC3.goldMid, fontSize: '0.75rem', marginBottom: '0.25rem' }}>{entry.organization}</p>
                      <p style={{ color: WC3.textMid, fontSize: '0.75rem' }}>{entry.description}</p>
                    </InnerCard>
                  ))}
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </FadeInSection>

        {/* === RoC Art Divider: War Banner === */}
        <FadeInSection>
          <RoCArtDivider variant="banner" scale={artDividerScale} />
        </FadeInSection>

        {/* Skills - with shield ornament */}
        <FadeInSection>
          <SectionWithOrnament
            rightOrnament={<RoCOrnament side="right" type="shield" />}
          >
            <section style={{ marginBottom: '2rem' }}>
              <WC3Frame title={active === 'engineer' ? 'Tech Stack' : 'Skills'} zone="roc">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  {active === 'engineer' ? engineerTech.map((category) => (
                    <div key={category.name}>
                      <h3 style={{ color: WC3.goldMid, fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem', borderBottom: `1px solid ${WC3.metalDark}`, paddingBottom: '0.25rem' }}>
                        {category.name}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {category.items.slice(0, 5).map((tech) => (
                          <li key={tech} style={{ color: WC3.textMid, fontSize: '0.6875rem', marginBottom: '0.125rem' }}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  )) : otherSkills.map((category) => (
                    <div key={category.name}>
                      <h3 style={{ color: WC3.goldMid, fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.375rem', borderBottom: `1px solid ${WC3.metalDark}`, paddingBottom: '0.25rem' }}>
                        {category.name}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {category.skills.slice(0, 5).map((skill) => (
                          <li key={skill.name} style={{ color: WC3.textMid, fontSize: '0.6875rem', marginBottom: '0.125rem' }}>{skill.name}</li>
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
          <FTArtDivider variant="crystals" scale={artDividerScale} />
        </FadeInSection>

        {/* Projects - FT zone begins */}
        <FadeInSection>
          <SectionWithOrnament
            leftOrnament={<FTOrnament side="left" type="shard" />}
            rightOrnament={<FTOrnament side="right" type="rune" />}
          >
            <section style={{ marginBottom: '2rem' }}>
              <WC3Frame title="Projects" zone="ft">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {(active === 'engineer' ? getFeaturedProjects(projects) : projects).slice(0, 6).map((project) => (
                    <InnerCard key={project.id} zone="ft">
                      <h3 style={{ color: WC3.textBright, fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{project.title}</h3>
                      <p style={{ color: WC3.textMid, fontSize: '0.6875rem', marginBottom: '0.25rem' }}>{project.description}</p>
                      {project.impact && <p style={{ color: WC3.ft.iceMid, fontSize: '0.6875rem', fontWeight: 500 }}>{project.impact}</p>}
                    </InnerCard>
                  ))}
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </FadeInSection>

        {/* === FT Art Divider: Frost Rune === */}
        <FadeInSection>
          <FTArtDivider variant="rune" scale={artDividerScale} />
        </FadeInSection>

        {/* Companies / Bands */}
        <FadeInSection>
          <SectionWithOrnament
            leftOrnament={<FTOrnament side="left" type="frost" />}
          >
            {active === 'engineer' && (
              <section style={{ marginBottom: '2rem' }}>
                <WC3Frame title="Companies" zone="ft">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {COMPANIES.map((company) => (
                      <InnerCard key={company.id} zone="ft">
                        <h3 style={{ color: WC3.textBright, fontSize: '0.8125rem', fontWeight: 600 }}>{company.name}</h3>
                        <p style={{ color: WC3.goldMid, fontSize: '0.6875rem', marginBottom: '0.125rem' }}>{company.role}</p>
                        <p style={{ color: WC3.textMid, fontSize: '0.6875rem', marginBottom: '0.25rem' }}>{company.description}</p>
                        {company.url && <a href={company.url} target="_blank" rel="noopener noreferrer" style={{ color: WC3.ft.iceMid, fontSize: '0.625rem', textDecoration: 'none' }}>{company.url}</a>}
                      </InnerCard>
                    ))}
                  </div>
                </WC3Frame>
              </section>
            )}
            {active === 'drummer' && (
              <section style={{ marginBottom: '2rem' }}>
                <WC3Frame title="Bands" zone="ft">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {BANDS.map((band) => (
                      <InnerCard key={band.id} zone="ft">
                        <h3 style={{ color: WC3.textBright, fontSize: '0.8125rem', fontWeight: 600 }}>{band.name}</h3>
                        <p style={{ color: WC3.goldMid, fontSize: '0.6875rem', marginBottom: '0.125rem' }}>{band.role}</p>
                        <p style={{ color: WC3.textMid, fontSize: '0.6875rem' }}>{band.description}</p>
                      </InnerCard>
                    ))}
                  </div>
                </WC3Frame>
              </section>
            )}
          </SectionWithOrnament>
        </FadeInSection>

        {/* === FT Art Divider: Ice Throne === */}
        <FadeInSection>
          <FTArtDivider variant="throne" scale={artDividerScale} />
        </FadeInSection>

        {/* Contact */}
        <FadeInSection>
          <SectionWithOrnament
            rightOrnament={<FTOrnament side="right" type="shard" />}
          >
            <section style={{ marginBottom: '2rem' }}>
              <WC3Frame title="Contact" zone="ft">
                <p style={{ color: WC3.textMid, marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
                  10+ years delivering production systems. Let&apos;s build something.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <WC3Button variant="primary" href="mailto:alexanderpulido81@gmail.com" zone="ft">Send Message</WC3Button>
                  <WC3Button href="/cv" zone="ft">Download CV</WC3Button>
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </FadeInSection>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: '0.75rem' }}>
          <p style={{ color: WC3.textDim, fontSize: '0.625rem', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} ALEXANDER PULIDO
          </p>
        </footer>
      </div>
    </div>
  )
}
