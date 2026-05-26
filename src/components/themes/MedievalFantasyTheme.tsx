'use client'

import { memo, useEffect, useState, useMemo, useCallback, useRef } from 'react'
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

  // feTurbulence-based fire using displacement mapping (leimapapa technique)
  const FelFlame = ({ cx, cy, size = 1, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) => {
    const w = size * 16
    const h = size * 22
    const filterId = `${fireFilterId}_${cx}_${cy}`
    const gradId = `fireGrad_${suffix}${id}_${cx}_${cy}`

    return (
      <g transform={`translate(${cx - w/2}, ${cy - h})`}>
        <defs>
          <radialGradient id={gradId} cx="50%" cy="90%" r="60%" fx="50%" fy="85%">
            <stop offset="0%" stopColor="#ffffcc" stopOpacity="0.9" />
            <stop offset="25%" stopColor={WC3.roc.felBright} stopOpacity="0.85" />
            <stop offset="50%" stopColor={WC3.roc.felMid} stopOpacity="0.8" />
            <stop offset="75%" stopColor={WC3.roc.felDark} stopOpacity="0.6" />
            <stop offset="100%" stopColor={WC3.roc.felDark} stopOpacity="0" />
          </radialGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="3" seed={delay} result="noise">
              {isIdle && <animate attributeName="baseFrequency" values="0.03 0.06;0.04 0.08;0.03 0.06" dur={`${2 + delay * 0.3}s`} repeatCount="indefinite" />}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={size * 8} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
        <ellipse cx={w/2} cy={h * 0.7} rx={w * 0.4} ry={h * 0.55} fill={`url(#${gradId})`} filter={`url(#${filterId})`} />
      </g>
    )
  }

  // Smaller flame for joints - same technique, smaller scale
  const SmallFlame = ({ cx, cy, size = 0.6, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) => {
    const w = size * 12
    const h = size * 16
    const filterId = `${fireFilterId}S_${cx}_${cy}`
    const gradId = `fireGradS_${suffix}${id}_${cx}_${cy}`

    return (
      <g transform={`translate(${cx - w/2}, ${cy - h})`}>
        <defs>
          <radialGradient id={gradId} cx="50%" cy="85%" r="55%" fx="50%" fy="80%">
            <stop offset="0%" stopColor="#ffffaa" stopOpacity="0.85" />
            <stop offset="30%" stopColor={WC3.roc.felBright} stopOpacity="0.8" />
            <stop offset="60%" stopColor={WC3.roc.felMid} stopOpacity="0.7" />
            <stop offset="100%" stopColor={WC3.roc.felDark} stopOpacity="0" />
          </radialGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" seed={delay * 3} result="noise">
              {isIdle && <animate attributeName="baseFrequency" values="0.04 0.08;0.05 0.1;0.04 0.08" dur={`${1.5 + delay * 0.2}s`} repeatCount="indefinite" />}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={size * 6} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
        <ellipse cx={w/2} cy={h * 0.65} rx={w * 0.4} ry={h * 0.5} fill={`url(#${gradId})`} filter={`url(#${filterId})`} />
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

      {/* ============ LEFT LEG (back layer) ============ */}
      {/* Thigh */}
      <polygon
        points="50,120 42,140 52,145 58,125"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Knee fire - layered flame */}
      <SmallFlame cx={48} cy={147} size={0.7} delay={1} />
      {/* Calf */}
      <polygon
        points="44,152 36,178 48,182 54,158"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Foot claws */}
      <polygon points="36,178 26,192 36,188" fill={WC3.roc.felBright} />
      <polygon points="40,180 34,196 44,190" fill={WC3.roc.felBright} />
      <polygon points="46,182 44,198 52,192" fill={WC3.roc.felMid} />

      {/* ============ RIGHT LEG (back layer) ============ */}
      {/* Thigh */}
      <polygon
        points="110,120 102,125 108,145 118,140"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Knee fire - layered flame */}
      <SmallFlame cx={112} cy={147} size={0.7} delay={2} />
      {/* Calf */}
      <polygon
        points="106,152 106,158 112,182 124,178"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Foot claws */}
      <polygon points="124,178 134,192 124,188" fill={WC3.roc.felBright} />
      <polygon points="120,180 126,196 116,190" fill={WC3.roc.felBright} />
      <polygon points="114,182 116,198 108,192" fill={WC3.roc.felMid} />

      {/* ============ HIP FIRE (connecting legs to torso) ============ */}
      <FelFlame cx={55} cy={115} size={0.9} delay={3} />
      <FelFlame cx={105} cy={115} size={0.9} delay={4} />

      {/* ============ TORSO ============ */}
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
      <FelFlame cx={80} cy={85} size={1.2} delay={0} />

      {/* ============ MASSIVE LEFT SHOULDER (iconic WC3 feature) ============ */}
      {/* Shoulder fire base - layered flame */}
      <FelFlame cx={35} cy={55} size={1} delay={5} />
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
      {/* Shoulder flame on top - layered */}
      <FelFlame cx={25} cy={25} size={1.3} delay={6} />

      {/* ============ MASSIVE RIGHT SHOULDER ============ */}
      {/* Shoulder fire base - layered flame */}
      <FelFlame cx={125} cy={55} size={1} delay={7} />
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
      {/* Shoulder flame on top - layered */}
      <FelFlame cx={135} cy={25} size={1.3} delay={8} />

      {/* ============ LEFT ARM ============ */}
      {/* Upper arm */}
      <polygon
        points="20,78 12,95 22,105 32,90"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Elbow fire - layered */}
      <SmallFlame cx={18} cy={108} size={0.7} delay={9} />
      {/* Forearm */}
      <polygon
        points="14,112 6,135 18,142 26,120"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Forearm cracks */}
      <path d="M18,115 L12,130" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
      {/* Hand claws */}
      <polygon points="6,135 -4,155 8,148" fill={WC3.roc.felBright} />
      <polygon points="10,138 4,162 16,152" fill={WC3.roc.felBright} />
      <polygon points="16,140 14,165 24,155" fill={WC3.roc.felBright} />
      <polygon points="20,142 22,160 28,150" fill={WC3.roc.felMid} />

      {/* ============ RIGHT ARM ============ */}
      {/* Upper arm */}
      <polygon
        points="140,78 148,90 138,105 128,95"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Elbow fire - layered */}
      <SmallFlame cx={142} cy={108} size={0.7} delay={10} />
      {/* Forearm */}
      <polygon
        points="134,112 134,120 142,142 154,135"
        fill={`url(#${rockId})`}
        stroke="#1a1815"
        strokeWidth="1.5"
      />
      {/* Forearm cracks */}
      <path d="M142,115 L148,130" stroke={WC3.roc.felMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
      {/* Hand claws */}
      <polygon points="154,135 164,155 152,148" fill={WC3.roc.felBright} />
      <polygon points="150,138 156,162 144,152" fill={WC3.roc.felBright} />
      <polygon points="144,140 146,165 136,155" fill={WC3.roc.felBright} />
      <polygon points="140,142 138,160 132,150" fill={WC3.roc.felMid} />

      {/* ============ NECK FIRE ============ */}
      <FelFlame cx={80} cy={48} size={1.1} delay={11} />

      {/* ============ HEAD (Menacing Skull) ============ */}
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

      {/* ============ HEAD FLAME (top) - Layered flame tongues ============ */}
      <FelFlame cx={80} cy={5} size={1.5} delay={12} />
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
  // Infernal phases: falling meteor → explosion → creature rises → idle
  const [infernals, setInfernals] = useState<Array<{
    id: number
    x: string
    landX: string
    landY: string
    side: 'left' | 'right'
    phase: 'falling' | 'explosion' | 'rising' | 'idle'
  }>>([])

  // Track infernal counts per side (max 1 left, 1 right = 2 total)
  const leftCountRef = useRef(0)
  const rightCountRef = useRef(0)

  useEffect(() => {
    let infernalId = 0
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const spawnInfernal = (newId: number, side: 'left' | 'right') => {
      // Land positions - golems in background, higher up on screen
      // Left: 8vw from left, 32vh from top | Right: 12vw from right, 28vh from top
      const landX = side === 'left' ? '8vw' : 'calc(100vw - 12vw)'
      const landY = side === 'left' ? '32vh' : '28vh'

      setInfernals(prev => [...prev, { id: newId, x: landX, landX, landY, side, phase: 'falling' }])

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'explosion' } : inf
        ))
      }, 4000))

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'rising' } : inf
        ))
      }, 4600))

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'idle' } : inf
        ))
      }, 5600))
    }

    const triggerLightningStorm = () => {
      if (!isActive) return

      const canSpawnLeft = leftCountRef.current < 1
      const canSpawnRight = rightCountRef.current < 1

      if (!canSpawnLeft && !canSpawnRight) return

      let side: 'left' | 'right'
      if (canSpawnLeft && canSpawnRight) {
        side = Math.random() > 0.6 ? 'left' : 'right'
      } else if (canSpawnLeft) {
        side = 'left'
      } else {
        side = 'right'
      }

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

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        if (side === 'left' && leftCountRef.current >= 2) return
        if (side === 'right' && rightCountRef.current >= 1) return

        if (side === 'left') leftCountRef.current++
        else rightCountRef.current++

        spawnInfernal(infernalId++, side)
      }, 200))
    }

    const scheduleNext = () => {
      if (!isActive) return
      const delay = 6000 + Math.random() * 8000
      timeouts.push(setTimeout(() => {
        triggerLightningStorm()
        scheduleNext()
      }, delay))
    }

    timeouts.push(setTimeout(triggerLightningStorm, 1500))
    scheduleNext()

    return () => {
      isActive = false
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [])

  // Rain drops falling - stormy battlefield, diagonal to right
  const raindrops = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 20,  // Start off-screen left
      delay: Math.random() * -2,
      duration: 0.6 + Math.random() * 0.3,
      length: 20 + Math.random() * 25,
    })),
    []
  )

  return (
    <>
      {/* GREEN-tinted stormy sky - matching WC3 RoC menu aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          #0a1a15 0%,
          #0d2018 10%,
          #0f2a1c 20%,
          #123520 35%,
          #154025 50%,
          #123018 65%,
          #0d2515 80%,
          #081a10 90%,
          #050f08 100%)`
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

        {/* === DARK STORM CLOUDS at top === */}
        <g opacity="0.8">
          <ellipse cx="200" cy="80" rx="300" ry="120" fill="#0a1810" />
          <ellipse cx="500" cy="60" rx="350" ry="100" fill="#081510" />
          <ellipse cx="800" cy="90" rx="280" ry="110" fill="#0a1810" />
          <ellipse cx="350" cy="150" rx="200" ry="80" fill="#0d1a12" />
          <ellipse cx="700" cy="140" rx="220" ry="85" fill="#0d1a12" />
        </g>

        {/* === FAR LAYER - Ruined stone structures silhouettes === */}
        <g filter="url(#rocDistantBlur)" opacity="0.5">
          {/* Ruined tower left */}
          <g transform="translate(80, 200)">
            <polygon points="0,200 30,80 60,120 90,40 120,100 150,200" fill="#1a2518" />
            <rect x="55" y="60" width="30" height="50" fill="#152015" />
          </g>
          {/* Ruined wall center */}
          <polygon points="350,350 400,250 450,280 500,200 550,260 600,230 650,350" fill="#182318" />
          {/* Ruined fortress right */}
          <g transform="translate(750, 220)">
            <polygon points="0,180 40,70 80,110 120,30 160,90 200,180" fill="#1a2518" />
            <polygon points="100,50 120,30 140,45" fill="#253020" opacity="0.5" />
          </g>
        </g>

        {/* === DISTANT HILLS - Grassy depth perception === */}
        <g filter="url(#rocDistantBlur)" opacity="0.4">
          {/* Far hill left */}
          <ellipse cx="150" cy="450" rx="250" ry="80" fill="#1a2a1a" />
          {/* Far hill center */}
          <ellipse cx="500" cy="420" rx="350" ry="100" fill="#182818" />
          {/* Far hill right */}
          <ellipse cx="850" cy="460" rx="280" ry="90" fill="#1a2a1a" />
        </g>

        {/* === MID HILLS - More defined grassy rolling hills === */}
        <g filter="url(#rocMidBlur)" opacity="0.5">
          {/* Mid hill left */}
          <ellipse cx="100" cy="550" rx="200" ry="60" fill="#223820" />
          <ellipse cx="100" cy="560" rx="180" ry="50" fill="#1a3018" />
          {/* Mid hill center-left */}
          <ellipse cx="350" cy="520" rx="220" ry="70" fill="#203520" />
          {/* Mid hill center-right */}
          <ellipse cx="650" cy="540" rx="200" ry="65" fill="#223820" />
          {/* Mid hill right */}
          <ellipse cx="900" cy="560" rx="180" ry="55" fill="#203520" />
        </g>

        {/* === GRASS TEXTURE ACROSS ENTIRE BACKGROUND === */}

        {/* VERY DISTANT GRASS (y=320-400) - tiny, sparse, faded */}
        <g opacity="0.2" filter="url(#rocDistantBlur)">
          {Array.from({ length: 60 }, (_, i) => 15 + i * 17).map((x, i) => (
            <g key={`vdg${i}`}>
              <line x1={x} y1={350 + (i % 7) * 8} x2={x + 0.5} y2={346 + (i % 7) * 8} stroke="#2a3a25" strokeWidth="0.8" />
              <line x1={x + 5} y1={355 + (i % 5) * 6} x2={x + 5.5} y2={351 + (i % 5) * 6} stroke="#253520" strokeWidth="0.8" />
            </g>
          ))}
        </g>

        {/* FAR GRASS (y=400-500) - small, sparse */}
        <g opacity="0.25">
          {Array.from({ length: 70 }, (_, i) => 10 + i * 15).map((x, i) => (
            <g key={`fg${i}`}>
              <line x1={x} y1={440 + (i % 6) * 10} x2={x + 0.8} y2={435 + (i % 6) * 10 - (i % 3)} stroke="#2a3a28" strokeWidth="0.8" />
              <line x1={x + 4} y1={445 + (i % 5) * 8} x2={x + 4.5} y2={440 + (i % 5) * 8 - (i % 4)} stroke="#354530" strokeWidth="0.8" />
              <line x1={x + 8} y1={442 + (i % 7) * 9} x2={x + 8.5} y2={438 + (i % 7) * 9} stroke="#2a3a28" strokeWidth="0.7" />
            </g>
          ))}
        </g>

        {/* MID-FAR GRASS (y=500-580) - growing larger */}
        <g opacity="0.35">
          {Array.from({ length: 80 }, (_, i) => 5 + i * 13).map((x, i) => (
            <g key={`mfg${i}`}>
              <line x1={x} y1={530 + (i % 5) * 10} x2={x + 1} y2={523 + (i % 5) * 10 - (i % 3) * 2} stroke="#3a4a30" strokeWidth="1" />
              <line x1={x + 5} y1={535 + (i % 6) * 8} x2={x + 5.5} y2={528 + (i % 6) * 8 - (i % 4)} stroke="#4a5a38" strokeWidth="1" />
              <line x1={x + 9} y1={532 + (i % 4) * 12} x2={x + 9.5} y2={526 + (i % 4) * 12 - (i % 3)} stroke="#3a4a30" strokeWidth="0.9" />
            </g>
          ))}
        </g>

        {/* MID GRASS (y=580-660) - medium density */}
        <g opacity="0.45">
          {Array.from({ length: 85 }, (_, i) => 3 + i * 12).map((x, i) => (
            <g key={`mg${i}`}>
              <line x1={x} y1={610 + (i % 5) * 10} x2={x + 1} y2={600 + (i % 5) * 10 - (i % 4) * 2} stroke="#3a4a30" strokeWidth="1.1" />
              <line x1={x + 4} y1={615 + (i % 6) * 8} x2={x + 4.8} y2={606 + (i % 6) * 8 - (i % 3) * 2} stroke="#4a5a38" strokeWidth="1.1" />
              <line x1={x + 8} y1={612 + (i % 4) * 12} x2={x + 8.5} y2={604 + (i % 4) * 12 - (i % 5)} stroke="#455535" strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* NEAR-MID GRASS (y=660-720) - denser */}
        <g opacity="0.55">
          {Array.from({ length: 90 }, (_, i) => i * 11).map((x, i) => (
            <g key={`nmg${i}`}>
              <line x1={x} y1={690 + (i % 4) * 8} x2={x + 1.2} y2={679 + (i % 4) * 8 - (i % 3) * 2} stroke="#4a5a38" strokeWidth="1.2" />
              <line x1={x + 4} y1={695 + (i % 5) * 6} x2={x + 5} y2={685 + (i % 5) * 6 - (i % 4) * 2} stroke="#556640" strokeWidth="1.2" />
              <line x1={x + 8} y1={692 + (i % 3) * 10} x2={x + 8.8} y2={682 + (i % 3) * 10 - (i % 5)} stroke="#4a5a38" strokeWidth="1.1" />
            </g>
          ))}
        </g>

        {/* === MID LAYER - Stone pillars, broken walls === */}
        <g filter="url(#rocMidBlur)" opacity="0.6">
          {/* Stone pillar left */}
          <g transform="translate(120, 320)">
            <rect x="0" y="0" width="40" height="180" fill="#2a3528" />
            <rect x="5" y="0" width="30" height="180" fill="#354530" />
            <polygon points="0,0 20,-30 40,0" fill="#2a3528" />
          </g>
          {/* Broken wall segment center-left */}
          <polygon points="280,500 320,380 360,420 400,350 440,400 480,500" fill="#253020" />
          {/* Stone pillar center-right */}
          <g transform="translate(650, 350)">
            <rect x="0" y="0" width="35" height="150" fill="#2a3528" />
            <polygon points="0,0 17,-25 35,0" fill="#2a3528" />
          </g>
          {/* Broken arch right */}
          <g transform="translate(800, 380)">
            <polygon points="0,120 20,40 50,60 80,20 110,50 140,120" fill="#253020" />
          </g>
        </g>

        {/* === NEAR HILLS - Foreground grassy terrain === */}
        <g opacity="0.6">
          {/* Near hill left */}
          <ellipse cx="50" cy="680" rx="180" ry="60" fill="#253518" />
          {/* Near hill center */}
          <ellipse cx="500" cy="650" rx="400" ry="80" fill="#203015" />
          {/* Near hill right */}
          <ellipse cx="950" cy="680" rx="170" ry="55" fill="#253518" />
        </g>

        {/* === GRASS GROUND - Dense grass across full battlefield === */}
        <g>
          {/* Base ground plane - extends full width */}
          <ellipse cx="500" cy="780" rx="650" ry="120" fill="#1a2a18" />
          <ellipse cx="500" cy="800" rx="600" ry="90" fill="#152215" />
          <ellipse cx="500" cy="815" rx="580" ry="70" fill="#0d1a0f" />

          {/* === DENSE GRASS COVERAGE - Full battlefield width === */}
          {/* Far back grass - tiny, sparse (y=745-755) */}
          {Array.from({ length: 50 }, (_, i) => 10 + i * 20).map((x, i) => (
            <g key={`gb${i}`}>
              <line x1={x} y1="750" x2={x + 1} y2={743 - (i % 3)} stroke="#3a4a30" strokeWidth="1"
                style={i % 7 === 0 ? { transformOrigin: `${x}px 750px`, animation: `grassBlade ${2.5 + (i % 3) * 0.3}s ease-in-out infinite`, animationDelay: `${(i % 8) * 0.35}s` } : undefined} />
              <line x1={x + 6} y1="750" x2={x + 5} y2={742 - (i % 4)} stroke="#445535" strokeWidth="1"
                style={i % 8 === 0 ? { transformOrigin: `${x + 6}px 750px`, animation: `grassBlade ${2.8 + (i % 4) * 0.2}s ease-in-out infinite`, animationDelay: `${(i % 6) * 0.4}s` } : undefined} />
            </g>
          ))}

          {/* Mid-back grass (y=765-775) */}
          {Array.from({ length: 55 }, (_, i) => 5 + i * 18).map((x, i) => (
            <g key={`gmb${i}`}>
              <line x1={x} y1="770" x2={x + 1} y2={760 - (i % 3)} stroke="#4a5a38" strokeWidth="1.2"
                style={i % 5 === 0 ? { transformOrigin: `${x}px 770px`, animation: `grassBlade ${2.3 + (i % 4) * 0.3}s ease-in-out infinite`, animationDelay: `${(i % 7) * 0.3}s` } : undefined} />
              <line x1={x + 5} y1="770" x2={x + 4} y2={759 - (i % 4)} stroke="#506040" strokeWidth="1.2" />
              <line x1={x + 10} y1="770" x2={x + 11} y2={761 - (i % 3)} stroke="#4a5a38" strokeWidth="1" />
            </g>
          ))}

          {/* Mid grass - more dense (y=780-795) */}
          {Array.from({ length: 60 }, (_, i) => 3 + i * 17).map((x, i) => (
            <g key={`gm${i}`}>
              <line x1={x} y1="790" x2={x + 1} y2={778 - (i % 4)} stroke="#4a5a38" strokeWidth="1.5"
                style={i % 4 === 0 ? { transformOrigin: `${x}px 790px`, animation: `grassBlade ${2.2 + (i % 5) * 0.25}s ease-in-out infinite`, animationDelay: `${(i % 6) * 0.28}s` } : undefined} />
              <line x1={x + 5} y1="790" x2={x + 4} y2={777 - (i % 3)} stroke="#556640" strokeWidth="1.5"
                style={i % 5 === 0 ? { transformOrigin: `${x + 5}px 790px`, animation: `grassBlade ${2.5 + (i % 4) * 0.2}s ease-in-out infinite`, animationDelay: `${(i % 5) * 0.35}s` } : undefined} />
              <line x1={x + 10} y1="790" x2={x + 11} y2={779 - (i % 4)} stroke="#4a5a38" strokeWidth="1.2" />
            </g>
          ))}

          {/* Front grass - taller, brighter (y=805-820) */}
          {Array.from({ length: 65 }, (_, i) => i * 16).map((x, i) => (
            <g key={`gf${i}`}>
              <line x1={x} y1="810" x2={x + 1} y2={795 - (i % 4)} stroke="#5a6a45" strokeWidth="1.8"
                style={i % 3 === 0 ? { transformOrigin: `${x}px 810px`, animation: `grassBlade ${2.1 + (i % 6) * 0.2}s ease-in-out infinite`, animationDelay: `${(i % 8) * 0.22}s` } : undefined} />
              <line x1={x + 6} y1="810" x2={x + 5} y2={794 - (i % 3) * 2} stroke="#6a7a50" strokeWidth="1.8"
                style={i % 4 === 0 ? { transformOrigin: `${x + 6}px 810px`, animation: `grassBlade ${2.4 + (i % 5) * 0.18}s ease-in-out infinite`, animationDelay: `${(i % 7) * 0.3}s` } : undefined} />
              <line x1={x + 11} y1="810" x2={x + 12} y2={796 - (i % 4)} stroke="#5a6a45" strokeWidth="1.3" />
            </g>
          ))}

          {/* Foreground grass - tallest, brightest (y=825-845) */}
          {Array.from({ length: 70 }, (_, i) => i * 15).map((x, i) => (
            <g key={`gff${i}`}>
              <line x1={x} y1="830" x2={x + 1} y2={812 - (i % 5)} stroke="#6a7a50" strokeWidth="2"
                style={i % 3 === 0 ? { transformOrigin: `${x}px 830px`, animation: `grassBlade ${2 + (i % 7) * 0.18}s ease-in-out infinite`, animationDelay: `${(i % 9) * 0.18}s` } : undefined} />
              <line x1={x + 6} y1="830" x2={x + 5} y2={811 - (i % 4) * 2} stroke="#7a8a58" strokeWidth="2"
                style={i % 4 === 0 ? { transformOrigin: `${x + 6}px 830px`, animation: `grassBlade ${2.2 + (i % 6) * 0.15}s ease-in-out infinite`, animationDelay: `${(i % 8) * 0.25}s` } : undefined} />
              <line x1={x + 11} y1="830" x2={x + 12} y2={813 - (i % 5)} stroke="#6a7a50" strokeWidth="1.6" />
              <line x1={x + 15} y1="830" x2={x + 14} y2={814 - (i % 4)} stroke="#7a8a58" strokeWidth="1.3" />
            </g>
          ))}
        </g>

        {/* === WAR DEBRIS - Colorful, visible like WC3 reference === */}
        <g>
          {/* === WEAPONS LYING FLAT ON GROUND (back layer) === */}
          {/* Broken sword lying flat - far left */}
          <g transform="translate(80, 760) rotate(85)">
            <polygon points="-3,-45 3,-45 4,-5 -4,-5" fill="url(#metalGray)" />
            <rect x="-7" y="-5" width="14" height="5" fill="#4a3a25" />
          </g>
          {/* Dagger lying flat - center */}
          <g transform="translate(480, 780) rotate(-70)">
            <polygon points="-2,-30 2,-30 3,-5 -3,-5" fill="#5a5a55" />
            <rect x="-4" y="-5" width="8" height="4" fill="#3a2a1a" />
          </g>
          {/* Mace lying flat - right side */}
          <g transform="translate(720, 770) rotate(75)">
            <rect x="-3" y="-60" width="6" height="60" fill="url(#woodBrown)" />
            <ellipse cx="0" cy="-65" rx="12" ry="10" fill="url(#metalGray)" />
            <ellipse cx="0" cy="-65" rx="8" ry="7" fill="#4a4a45" />
          </g>

          {/* === ORANGE SHIELD - Lying on ground (center-right) === */}
          <g transform="translate(620, 720)">
            <ellipse cx="0" cy="0" rx="70" ry="28" fill="url(#shieldOrange)" />
            <ellipse cx="0" cy="0" rx="60" ry="23" fill="#bb7744" />
            <ellipse cx="0" cy="0" rx="20" ry="9" fill="#aa6633" />
            <ellipse cx="-4" cy="-2" rx="12" ry="5" fill="#cc9955" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="68" ry="27" fill="none" stroke="#664422" strokeWidth="3" />
          </g>

          {/* === FALLEN WARRIOR SILHOUETTES === */}
          <ellipse cx="280" cy="755" rx="45" ry="15" fill="#1a2515" opacity="0.6" />
          <ellipse cx="550" cy="740" rx="40" ry="14" fill="#1a2515" opacity="0.5" />

          {/* === WATER PUDDLE - Reflective blue === */}
          <g transform="translate(850, 790)">
            <ellipse cx="0" cy="0" rx="90" ry="35" fill="url(#waterPuddle)" />
            <ellipse cx="-8" cy="-4" rx="70" ry="25" fill="#1a3545" opacity="0.5" />
            <ellipse cx="-25" cy="-8" rx="20" ry="6" fill="#2a4555" opacity="0.4" />
          </g>

          {/* === ROCKS AND DEBRIS (scattered) === */}
          <polygon points="180,785 195,760 215,780" fill="#3a4530" opacity="0.7" />
          <polygon points="380,775 398,745 418,770 408,785" fill="#354028" opacity="0.6" />
          <polygon points="580,790 595,770 612,788" fill="#3a4530" opacity="0.5" />
          <polygon points="760,785 775,765 792,782" fill="#354028" opacity="0.6" />

          {/* === WEAPONS STUCK IN GROUND (mid layer) === */}
          {/* Axe anchored - left */}
          <g transform="translate(320, 695) rotate(-18)">
            <rect x="-4" y="-90" width="8" height="90" fill="url(#woodBrown)" />
            <path d="M-4,-90 Q-32,-77 -28,-58 L4,-68 Z" fill="url(#metalGray)" />
            <path d="M-4,-88 Q-28,-77 -24,-60 L2,-69 Z" fill="#5a5a55" />
          </g>
          {/* Sword anchored - center-left */}
          <g transform="translate(440, 730) rotate(15)">
            <rect x="-3" y="-85" width="6" height="85" fill="url(#metalGray)" />
            <rect x="-9" y="-5" width="18" height="7" fill="#4a3a25" />
            <rect x="-2" y="0" width="4" height="12" fill="#3a2a1a" />
            <polygon points="0,-95 -5,-83 5,-83" fill="#6a6a65" />
          </g>
          {/* Spear anchored - right */}
          <g transform="translate(780, 705) rotate(-12)">
            <rect x="-3" y="-120" width="6" height="120" fill="url(#woodBrown)" />
            <polygon points="0,-135 -7,-118 7,-118" fill="url(#metalGray)" />
          </g>
          {/* Halberd anchored - far right */}
          <g transform="translate(920, 700) rotate(8)">
            <rect x="-3" y="-130" width="6" height="130" fill="url(#woodBrown)" />
            <polygon points="0,-145 -10,-125 10,-125" fill="url(#metalGray)" />
            <path d="M-10,-125 Q-15,-135 -5,-145" fill="url(#metalGray)" />
          </g>
          {/* Broken spear - left side */}
          <g transform="translate(130, 740) rotate(35)">
            <rect x="-2" y="-70" width="5" height="70" fill="url(#woodBrown)" />
          </g>

          {/* === HORDE WAR BANNER - On TOP of weapons with wind animation === */}
          <g transform="translate(200, 520) rotate(-10)" className="war-banner">
            {/* Banner pole */}
            <rect x="0" y="0" width="12" height="230" fill="#3a2815" />
            <rect x="2" y="0" width="8" height="230" fill="#4a3520" />
            <rect x="4" y="5" width="4" height="220" fill="#5a4530" opacity="0.5" />
            {/* Pole top spike */}
            <polygon points="6,-30 -4,5 16,5" fill="#5a4a35" />
            <polygon points="6,-25 0,3 12,3" fill="#6a5a45" />
            {/* Banner fabric with wave columns - skull integrated INTO each column */}
            <g transform="translate(12, 15)" className="banner-fabric">
              {/* Define clipping regions for skull parts */}
              <defs>
                <clipPath id="bannerCol1"><rect x="0" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol2"><rect x="18" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol3"><rect x="36" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol4"><rect x="54" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol5"><rect x="72" y="0" width="18" height="150" /></clipPath>
              </defs>

              {/* Column 1 with skull slice */}
              <g style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0s' }}>
                <rect x="0" y="0" width="18" height="150" fill="#aa2525" />
                <g clipPath="url(#bannerCol1)"><g transform="translate(44, 75)">{/* Skull left edge - partial tusk */}<path d="M-10,-6 Q-16,5 -12,14" stroke="#ccbb99" strokeWidth="2" fill="none" opacity="0.7" /></g></g>
              </g>
              {/* Column 2 with skull slice */}
              <g style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.12s' }}>
                <rect x="18" y="2" width="18" height="148" fill="#992222" />
                <g clipPath="url(#bannerCol2)"><g transform="translate(44, 75)">{/* Skull left part */}<ellipse cx="0" cy="-12" rx="16" ry="12" fill="#441212" opacity="0.8" /><ellipse cx="-6" cy="-12" rx="3.5" ry="2.5" fill="#220606" /><path d="M-10,-6 Q-16,5 -12,14" stroke="#ccbb99" strokeWidth="2" fill="none" /></g></g>
              </g>
              {/* Column 3 with skull slice - CENTER */}
              <g style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.24s' }}>
                <rect x="36" y="4" width="18" height="146" fill="#882020" />
                <g clipPath="url(#bannerCol3)"><g transform="translate(44, 75)">{/* Skull center */}<ellipse cx="0" cy="-12" rx="16" ry="12" fill="#441212" opacity="0.8" /><ellipse cx="0" cy="-10" rx="10" ry="7" fill="#551515" opacity="0.6" /><rect x="-7" y="-3" width="14" height="7" fill="#441212" opacity="0.8" /><line x1="-5" y1="-3" x2="-5" y2="4" stroke="#220606" strokeWidth="2" /><line x1="0" y1="-3" x2="0" y2="4" stroke="#220606" strokeWidth="2" /><line x1="5" y1="-3" x2="5" y2="4" stroke="#220606" strokeWidth="2" /></g></g>
              </g>
              {/* Column 4 with skull slice */}
              <g style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.36s' }}>
                <rect x="54" y="6" width="18" height="144" fill="#771818" />
                <g clipPath="url(#bannerCol4)"><g transform="translate(44, 75)">{/* Skull right part */}<ellipse cx="0" cy="-12" rx="16" ry="12" fill="#441212" opacity="0.8" /><ellipse cx="6" cy="-12" rx="3.5" ry="2.5" fill="#220606" /><path d="M10,-6 Q16,5 12,14" stroke="#ccbb99" strokeWidth="2" fill="none" /></g></g>
              </g>
              {/* Column 5 (edge) with skull slice */}
              <g style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.48s' }}>
                <rect x="72" y="8" width="15" height="142" fill="#661515" />
                <g clipPath="url(#bannerCol5)"><g transform="translate(44, 75)">{/* Skull right edge - partial tusk */}<path d="M10,-6 Q16,5 12,14" stroke="#ccbb99" strokeWidth="2" fill="none" opacity="0.7" /></g></g>
              </g>
              {/* Banner edge fraying */}
              <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill="#661515" style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.55s' }} />
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

      {/* Volumetric storm clouds - green-tinted */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '45%' }} viewBox="0 0 1000 450" preserveAspectRatio="none">
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
          <filter id="cloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <radialGradient id="cloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1a2518" />
            <stop offset="60%" stopColor="#0d1a0f" />
            <stop offset="100%" stopColor="#05100a" />
          </radialGradient>
        </defs>
        {/* Far clouds - massive storm wall */}
        <g filter="url(#cloudBlur)" opacity="0.6">
          <ellipse cx="150" cy="100" rx="300" ry="120" fill="#0a1510" />
          <ellipse cx="500" cy="80" rx="400" ry="150" fill="#0d1a12" />
          <ellipse cx="850" cy="110" rx="320" ry="130" fill="#0a1510" />
        </g>
        {/* Mid clouds - storm core */}
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
        {/* Wispy tendrils */}
        <g opacity="0.25">
          <path d="M0,320 Q150,300 300,330 Q450,310 500,340" stroke="#1a2515" strokeWidth="20" fill="none" />
          <path d="M500,310 Q650,330 800,300 Q900,320 1000,310" stroke="#1a2515" strokeWidth="15" fill="none" />
        </g>
      </svg>

      {/* Cloud glow when lightning strikes - white/pale blue */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: `radial-gradient(ellipse at ${lightningX}% 35%, #ddffff${Math.floor(cloudGlow * 50).toString(16).padStart(2, '0')} 0%, #aaddee${Math.floor(cloudGlow * 25).toString(16).padStart(2, '0')} 25%, transparent 60%)`,
        transition: 'background 0.15s ease',
        pointerEvents: 'none',
      }} />

      {/* Lightning bolt - natural storm lightning */}
      {lightningActive && (
        <svg
          style={{
            position: 'absolute',
            top: '8%',
            left: `${lightningX - 4}%`,
            width: '8%',
            height: '45%',
            opacity: 0.85,
            filter: 'drop-shadow(0 0 15px #ccffff) drop-shadow(0 0 30px #88ccdd)',
          }}
          viewBox="0 0 80 450"
        >
          <path
            d="M40 0 L35 70 L55 80 L30 160 L48 170 L22 270 L42 280 L15 380 L50 290 L32 280 L58 180 L40 170 L65 90 L45 80 Z"
            fill="#ddffff"
          />
          <path
            d="M40 5 L37 65 L52 75 L32 150 L47 160 L26 250 L44 260 L22 360 L48 275 L34 268 L56 172 L42 165 L62 88 L46 82 Z"
            fill="#ffffff"
            opacity="0.7"
          />
        </svg>
      )}

      {/* === WC3 INFERNAL - Fixed positioned relative to viewport === */}
      {infernals.map((inf) => (
        <div key={inf.id}>
          {/* PHASE 1: FALLING ASTEROID - Falls to the landing point */}
          {inf.phase === 'falling' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: inf.landY,
                transform: 'translateX(-50%)',
                animation: `infernalFall${inf.side === 'left' ? 'Right' : 'Left'} 4s ease-in forwards`,
                zIndex: 5,
                pointerEvents: 'none',
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
              {/* Fire trail - direction based on fall side */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                left: inf.side === 'left' ? '25px' : '-15px',
                width: '20px',
                height: '120px',
                background: `linear-gradient(${inf.side === 'left' ? '160deg' : '200deg'}, transparent 0%, ${WC3.roc.felDark}30 15%, ${WC3.roc.felMid}60 40%, ${WC3.roc.felBright}80 70%, ${WC3.roc.fireCore} 100%)`,
                filter: 'blur(5px)',
                transform: `rotate(${inf.side === 'left' ? '-20deg' : '20deg'})`,
                transformOrigin: 'bottom center',
              }} />
              {/* Secondary trail wisps */}
              <div style={{
                position: 'absolute',
                top: '-70px',
                left: inf.side === 'left' ? '35px' : '-25px',
                width: '10px',
                height: '80px',
                background: `linear-gradient(${inf.side === 'left' ? '155deg' : '205deg'}, transparent 0%, ${WC3.roc.felMid}40 50%, ${WC3.roc.felBright}70 100%)`,
                filter: 'blur(4px)',
                transform: `rotate(${inf.side === 'left' ? '-25deg' : '25deg'})`,
                transformOrigin: 'bottom center',
                opacity: 0.6,
              }} />
            </div>
          )}

          {/* PHASE 2: EXPLOSION - Fel green explosion */}
          {inf.phase === 'explosion' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: inf.landY,
                transform: 'translateX(-50%)',
                zIndex: 5,
                pointerEvents: 'none',
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
                position: 'fixed',
                left: inf.landX,
                top: inf.landY,
                transform: 'translateX(-40%)',
                animation: 'infernalRise 1s ease-out forwards',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {/* Shadow FIRST - golem renders on top of shadow */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-10px',
                width: '200px',
                height: '40px',
                background: `radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 45%, ${WC3.roc.felDark}15 75%, transparent 100%)`,
                borderRadius: '50%',
              }} />
              <InfernalGolemSVG id={inf.id} isIdle={false} scale={1} />
            </div>
          )}

          {/* PHASE 4: IDLE - Same infernal design as rising, with subtle idle animations */}
          {inf.phase === 'idle' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: inf.landY,
                transform: 'translateX(-40%)',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {/* Shadow FIRST - golem renders on top of shadow */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-10px',
                width: '200px',
                height: '40px',
                background: `radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 45%, ${WC3.roc.felDark}15 75%, transparent 100%)`,
                borderRadius: '50%',
              }} />
              <InfernalGolemSVG id={inf.id} isIdle={true} scale={1} />
            </div>
          )}
        </div>
      ))}

      {/* === RAIN - Falling diagonally to the right === */}
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
            transform: 'rotate(-20deg)',
            animation: `rainFallDiagonal ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
            opacity: 0,
          }}
        />
      ))}

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
        /* Infernal falling from LEFT side - starts above, drifts right as it falls */
        @keyframes infernalFallRight {
          0% {
            transform: translateX(-50%) translate(-8vw, -90vh) scale(0.4);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateX(-50%) translate(-7vw, -85vh) scale(0.5);
          }
          100% {
            transform: translateX(-50%) translate(0, 0) scale(1);
            opacity: 1;
          }
        }
        /* Infernal falling from RIGHT side - starts above, drifts left as it falls */
        @keyframes infernalFallLeft {
          0% {
            transform: translateX(-50%) translate(8vw, -90vh) scale(0.4);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateX(-50%) translate(7vw, -85vh) scale(0.5);
          }
          100% {
            transform: translateX(-50%) translate(0, 0) scale(1);
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
        /* Infernal creature rising from impact - must preserve translateX(-50%) */
        @keyframes infernalRise {
          0% {
            transform: translateX(-40%) translateY(30px) scale(0.5);
            opacity: 0;
          }
          40% {
            transform: translateX(-40%) translateY(10px) scale(0.9);
            opacity: 0.7;
          }
          100% {
            transform: translateX(-40%) translateY(0) scale(1);
            opacity: 1;
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
        /* Head looks around - left, center, right, center */
        @keyframes headLook {
          0%, 15%, 85%, 100% {
            transform: rotate(0deg);
          }
          25%, 35% {
            transform: rotate(-8deg);
          }
          55%, 65% {
            transform: rotate(8deg);
          }
        }
        /* Left arm sway */
        @keyframes leftArmSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(-5deg);
          }
          70% {
            transform: rotate(3deg);
          }
        }
        /* Right arm sway - opposite phase */
        @keyframes rightArmSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(5deg);
          }
          70% {
            transform: rotate(-3deg);
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
        /* Rain falling diagonally to the right (\ shape) */
        @keyframes rainFallDiagonal {
          0% {
            transform: rotate(-20deg) translateY(0);
            opacity: 0;
          }
          5% {
            opacity: 0.7;
          }
          95% {
            opacity: 0.7;
          }
          100% {
            transform: rotate(-20deg) translateY(115vh);
            opacity: 0;
          }
        }
        /* Grass blade wind - rotates from bottom anchor point */
        @keyframes grassBlade {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(4deg); }
          75% { transform: rotate(-3deg); }
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
      height: `${60 * scale}px`,
      margin: `${1 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      opacity: 0.6,
    }}>
      {/* Subtle green glow behind */}
      <div style={{
        position: 'absolute',
        width: '180px',
        height: '40px',
        background: `radial-gradient(ellipse, ${WC3.roc.felDark}20 0%, transparent 70%)`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal line - very subtle, grassy green */}
      <div style={{
        position: 'absolute',
        left: '15%',
        right: '15%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, #2a3a25 20%, ${WC3.roc.felDark}50 50%, #2a3a25 80%, transparent 100%)`,
      }} />

      {/* Grass tuft decorations on left - very subtle */}
      <svg width="30" height="20" viewBox="0 0 30 20" style={{ position: 'absolute', left: '12%', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}>
        <line x1="5" y1="20" x2="6" y2="8" stroke="#3a4a30" strokeWidth="1" />
        <line x1="12" y1="20" x2="13" y2="5" stroke="#4a5a38" strokeWidth="1" />
        <line x1="19" y1="20" x2="18" y2="7" stroke="#3a4a30" strokeWidth="1" />
        <line x1="25" y1="20" x2="26" y2="10" stroke="#4a5a38" strokeWidth="1" />
      </svg>

      {/* Grass tuft decorations on right */}
      <svg width="30" height="20" viewBox="0 0 30 20" style={{ position: 'absolute', right: '12%', top: '50%', transform: 'translateY(-50%) scaleX(-1)', opacity: 0.35 }}>
        <line x1="5" y1="20" x2="6" y2="8" stroke="#3a4a30" strokeWidth="1" />
        <line x1="12" y1="20" x2="13" y2="5" stroke="#4a5a38" strokeWidth="1" />
        <line x1="19" y1="20" x2="18" y2="7" stroke="#3a4a30" strokeWidth="1" />
        <line x1="25" y1="20" x2="26" y2="10" stroke="#4a5a38" strokeWidth="1" />
      </svg>

      {/* Center element - minimal fel rune, not weapons */}
      <svg width="60" height="40" viewBox="0 0 60 40" style={{ position: 'relative', zIndex: 2, opacity: 0.7 }}>
        {/* Simple fel glow dot */}
        <ellipse cx="30" cy="20" rx="15" ry="12" fill={WC3.roc.felDark} opacity="0.15" />
        <circle cx="30" cy="20" r="6" fill={WC3.roc.felDark} opacity="0.3" />
        <circle cx="30" cy="20" r="3" fill={WC3.roc.felMid} opacity="0.4" />
        {/* Subtle side lines */}
        <line x1="5" y1="20" x2="18" y2="20" stroke={WC3.roc.felDark} strokeWidth="1" opacity="0.4" />
        <line x1="42" y1="20" x2="55" y2="20" stroke={WC3.roc.felDark} strokeWidth="1" opacity="0.4" />
      </svg>
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
                  <p style={{ color: WC3.textMid, fontSize: '0.75rem', fontStyle: 'italic' }}>{PROFESSIONAL_SUMMARY.tagline}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
        </div>

        {/* Profession Selector */}
        <FadeInSection delay={100}>
          <nav style={{ marginBottom: sectionSpacing, display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <WC3Button onClick={() => setActive('engineer')} active={active === 'engineer'} zone="roc">Engineer</WC3Button>
            <WC3Button onClick={() => setActive('drummer')} active={active === 'drummer'} zone="roc">Musician</WC3Button>
            <WC3Button onClick={() => setActive('fighter')} active={active === 'fighter'} zone="roc">Muay Thai</WC3Button>
          </nav>
        </FadeInSection>

        {/* About */}
        <FadeInSection>
          <section style={{ marginBottom: sectionSpacing }}>
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
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <RoCArtDivider variant="weapons" scale={artDividerScale} />
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
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <RoCArtDivider variant="banner" scale={artDividerScale} />
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
              <section style={{ marginBottom: sectionSpacing }}>
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
          <div style={{ margin: `${artDividerMargin} 0` }}>
            <FTArtDivider variant="throne" scale={artDividerScale} />
          </div>
        </FadeInSection>

        {/* Contact */}
        <FadeInSection>
          <SectionWithOrnament
            rightOrnament={<FTOrnament side="right" type="shard" />}
          >
            <section style={{ marginBottom: sectionSpacing }}>
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
