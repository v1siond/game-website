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
// REIGN OF CHAOS ATMOSPHERE
// =============================================================================

const ReignOfChaosAtmosphere = memo(function ReignOfChaosAtmosphere() {
  const [infernalVisible, setInfernalVisible] = useState(false)
  const [infernalX, setInfernalX] = useState(50)
  const [infernalGoLeft, setInfernalGoLeft] = useState(true)

  useEffect(() => {
    const triggerInfernal = () => {
      setInfernalX(20 + Math.random() * 60)
      setInfernalGoLeft(Math.random() > 0.5)
      setInfernalVisible(true)
      setTimeout(() => setInfernalVisible(false), 3500)
    }

    triggerInfernal()
    const interval = setInterval(triggerInfernal, 12000 + Math.random() * 8000)
    return () => clearInterval(interval)
  }, [])

  const rainDrops = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      delay: Math.random() * -3,
      duration: 0.6 + Math.random() * 0.4,
      length: 20 + Math.random() * 15,
    })),
    []
  )

  return (
    <>
      {/* Green storm sky */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${WC3.roc.skyTop} 0%, ${WC3.roc.skyMid} 30%, ${WC3.roc.skyBot} 60%, #0a0c08 100%)`
      }} />

      {/* Fel glow in clouds */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        width: '35%',
        height: '30%',
        background: `radial-gradient(ellipse at 50% 30%, ${WC3.roc.felGlow} 0%, transparent 70%)`,
        filter: 'blur(30px)',
      }} />
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '15%',
        width: '30%',
        height: '25%',
        background: `radial-gradient(ellipse at 50% 40%, ${WC3.roc.felDark}40 0%, transparent 60%)`,
        filter: 'blur(25px)',
      }} />

      {/* Storm cloud silhouettes */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '35%', opacity: 0.3 }} viewBox="0 0 1000 350" preserveAspectRatio="none">
        <ellipse cx="150" cy="60" rx="200" ry="80" fill="#0f1a0f" />
        <ellipse cx="450" cy="40" rx="280" ry="100" fill="#121f12" />
        <ellipse cx="750" cy="70" rx="240" ry="90" fill="#0f1a0f" />
        <ellipse cx="300" cy="150" rx="180" ry="60" fill="#0a150a" />
        <ellipse cx="600" cy="130" rx="200" ry="70" fill="#0d180d" />
        <ellipse cx="900" cy="140" rx="150" ry="50" fill="#0a150a" />
      </svg>

      {/* Single dramatic infernal */}
      {infernalVisible && (
        <div
          style={{
            position: 'absolute',
            left: `${infernalX}%`,
            top: '-10%',
            width: '50px',
            height: '50px',
            animation: `${infernalGoLeft ? 'infernalDramaticLeft' : 'infernalDramaticRight'} 3.5s ease-in forwards`,
          }}
        >
          {/* Bright core */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 40% 40%, ${WC3.roc.fireCore} 0%, ${WC3.roc.felBright} 30%, ${WC3.roc.felMid} 60%, ${WC3.roc.fireMid} 100%)`,
            boxShadow: `0 0 40px ${WC3.roc.felBright}, 0 0 80px ${WC3.roc.felMid}, 0 0 120px ${WC3.roc.fireMid}`,
          }} />
          {/* Trail */}
          <div style={{
            position: 'absolute',
            top: '-80px',
            left: infernalGoLeft ? '35px' : '-15px',
            width: '30px',
            height: '100px',
            background: `linear-gradient(${infernalGoLeft ? '200deg' : '160deg'}, transparent 0%, ${WC3.roc.felMid}40 30%, ${WC3.roc.felBright}80 100%)`,
            filter: 'blur(8px)',
            transform: `rotate(${infernalGoLeft ? '25deg' : '-25deg'})`,
          }} />
        </div>
      )}

      {/* Diagonal rain */}
      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-5%',
            width: '1px',
            height: drop.length,
            background: `linear-gradient(180deg, transparent 0%, rgba(120,140,120,0.4) 50%, rgba(120,140,120,0.1) 100%)`,
            animation: `rainDiagonal ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes infernalDramaticLeft {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          10% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; }
          100% { transform: translate(-40vw, 120vh) scale(1.2); opacity: 0; }
        }
        @keyframes infernalDramaticRight {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          10% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; }
          100% { transform: translate(30vw, 120vh) scale(1.2); opacity: 0; }
        }
        @keyframes rainDiagonal {
          0% { transform: translate(0, 0) rotate(-12deg); opacity: 0.5; }
          100% { transform: translate(-12vw, 115vh) rotate(-12deg); opacity: 0; }
        }
      `}</style>
    </>
  )
})

// =============================================================================
// FROZEN THRONE ATMOSPHERE
// =============================================================================

const FrozenThroneAtmosphere = memo(function FrozenThroneAtmosphere() {
  const snowflakes = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * -10,
      duration: 8 + Math.random() * 6,
      size: 2 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 30,
    })),
    []
  )

  return (
    <>
      {/* Icy blue sky */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${WC3.ft.skyTop} 0%, ${WC3.ft.skyMid} 40%, ${WC3.ft.skyBot} 70%, #0a1018 100%)`
      }} />

      {/* Ice glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '40%',
        height: '30%',
        background: `radial-gradient(ellipse at 50% 50%, ${WC3.ft.iceGlow} 0%, transparent 60%)`,
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '30%',
        height: '25%',
        background: `radial-gradient(ellipse at 50% 50%, ${WC3.ft.iceDark}30 0%, transparent 70%)`,
        filter: 'blur(30px)',
      }} />

      {/* Distant ice formations */}
      <svg style={{ position: 'absolute', bottom: '5%', left: '5%', opacity: 0.15, width: '120px', height: '200px' }} viewBox="0 0 60 100">
        <polygon points="30,0 38,50 34,100 26,100 22,50" fill={WC3.ft.iceMid} />
        <polygon points="30,10 35,45 30,80" fill={WC3.ft.iceBright} opacity="0.5" />
      </svg>
      <svg style={{ position: 'absolute', bottom: '8%', right: '8%', opacity: 0.12, width: '80px', height: '150px' }} viewBox="0 0 40 75">
        <polygon points="20,0 26,35 23,75 17,75 14,35" fill={WC3.ft.iceDark} />
      </svg>
      <svg style={{ position: 'absolute', top: '15%', right: '5%', opacity: 0.08, width: '60px', height: '120px' }} viewBox="0 0 30 60">
        <polygon points="15,0 20,30 17,60 13,60 10,30" fill={WC3.ft.iceMid} />
      </svg>

      {/* Snow */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-3%',
            width: flake.size,
            height: flake.size,
            borderRadius: '50%',
            background: WC3.ft.frostWhite,
            opacity: 0.6,
            animation: `snowFall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            ['--drift' as string]: `${flake.drift}px`,
          }}
        />
      ))}

      <style>{`
        @keyframes snowFall {
          0% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(var(--drift)); opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(calc(var(--drift) * 2)); opacity: 0; }
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

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = active === 'engineer'
    ? PROJECTS_DATA.filter(p => p.professions.includes('engineer') || p.featured)
    : filterProjectsByProfession(PROJECTS_DATA, active)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)
  const workExperience = WORK_EXPERIENCE

  useEffect(() => { setMounted(true) }, [])

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
          <header style={{ marginBottom: '2rem' }}>
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
