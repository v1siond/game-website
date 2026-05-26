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
      {/* Shoulder flame on top - layered */}
      <FelFlame cx={25} cy={25} size={2.8} delay={6} />

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
      {/* Shoulder flame on top - layered */}
      <FelFlame cx={135} cy={25} size={2.8} delay={8} />

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

        {/* ============ HEAD FLAME (top) - Layered flame tongues ============ */}
        <FelFlame cx={80} cy={5} size={3.2} delay={12} />
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
  // Infernal phases: falling meteor → explosion → crater appears → creature rises → idle
  const [infernals, setInfernals] = useState<Array<{
    id: number
    x: string
    landX: string
    landY: string
    side: 'left' | 'right'
    scale: number
    phase: 'falling' | 'explosion' | 'crater' | 'rising' | 'idle'
  }>>([])

  // Track infernal counts per side (max 1 left, 1 right = 2 total)
  const leftCountRef = useRef(0)
  const rightCountRef = useRef(0)

  useEffect(() => {
    let infernalId = 0
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const spawnInfernal = (newId: number, side: 'left' | 'right') => {
      // Land positions with perspective:
      // Left: foreground (larger, lower) - 20vw from left, 33vh from top, scale 1
      // Right: background (smaller, higher) - 18vw from right, 24vh from top, scale 0.7
      const landX = side === 'left' ? '20vw' : 'calc(100vw - 18vw)'
      const landY = side === 'left' ? '33vh' : '24vh'
      const scale = side === 'left' ? 1 : 0.7

      setInfernals(prev => [...prev, { id: newId, x: landX, landX, landY, side, scale, phase: 'falling' }])

      // Phase timeline: falling(0-4s) → explosion(4-4.6s) → crater(4.6-5s) → rising(5-6s) → idle
      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'explosion' } : inf
        ))
      }, 4000))

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'crater' } : inf
        ))
      }, 4600))

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'rising' } : inf
        ))
      }, 5000))

      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setInfernals(prev => prev.map(inf =>
          inf.id === newId ? { ...inf, phase: 'idle' } : inf
        ))
      }, 6000))
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

        {/* === DISTANT TERRAIN - Single unified ground layer === */}
        <g filter="url(#rocDistantBlur)" opacity="0.35">
          <ellipse cx="500" cy="500" rx="600" ry="200" fill="#182518" />
        </g>

        {/* === GRASS TEXTURE - Dense distribution across entire ground === */}
        {/* Expanded grass layer covering y=350 to y=840 with perspective scaling */}
        <g>
          {Array.from({ length: 600 }, (_, i) => {
            // Distribute across full width and height - 15 rows of 40
            const row = Math.floor(i / 40)
            const col = i % 40

            // X position with randomization for natural look
            const x = 5 + col * 25 + ((i * 17) % 12) - 6

            // Y position - spans from 350 to 840 (higher up for more coverage)
            const baseY = 360 + row * 32 + ((i * 23) % 18)

            // Perspective: blades get taller and thicker toward bottom
            const perspectiveFactor = Math.max(0, (baseY - 350) / 490)  // 0 at top, 1 at bottom
            const height = 6 + perspectiveFactor * 20 + ((i * 7) % 7)
            const strokeW = 0.6 + perspectiveFactor * 1.6
            const opacity = 0.2 + perspectiveFactor * 0.6

            // Curve direction varies more
            const curve = ((i % 13) - 6) * (1.2 + perspectiveFactor * 2.5)

            // Color gets brighter toward foreground
            const colors = perspectiveFactor < 0.25
              ? ['#252f22', '#283225']
              : perspectiveFactor < 0.5
                ? ['#2a3828', '#2d3a2a']
                : perspectiveFactor < 0.75
                  ? ['#354530', '#3a4a38']
                  : ['#455540', '#4a5a45']
            const color = colors[i % 2]

            // More blades animate toward the front
            const animated = i % 6 === 0 && perspectiveFactor > 0.35

            return (
              <path
                key={`grass${i}`}
                d={`M${x},${baseY} Q${x + curve},${baseY - height * 0.5} ${x + curve * 0.4},${baseY - height}`}
                stroke={color}
                strokeWidth={strokeW}
                fill="none"
                strokeLinecap="round"
                opacity={opacity}
                style={animated ? {
                  transformOrigin: `${x}px ${baseY}px`,
                  animation: `grassBlade ${2 + (i % 5) * 0.3}s ease-in-out infinite`,
                  animationDelay: `${(i % 12) * 0.15}s`
                } : undefined}
              />
            )
          })}
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

        {/* === GROUND PLANE - Single unified surface === */}
        <g>
          {/* Main ground - gradient from mid to foreground */}
          <defs>
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2518" />
              <stop offset="40%" stopColor="#182015" />
              <stop offset="100%" stopColor="#0d150f" />
            </linearGradient>
          </defs>
          <ellipse cx="500" cy="750" rx="700" ry="200" fill="url(#groundGradient)" />

          {/* Dirt and sand patches scattered across ground */}
          <ellipse cx="120" cy="720" rx="50" ry="20" fill="url(#dirtPatch)" />
          <ellipse cx="320" cy="740" rx="60" ry="25" fill="url(#sandPatch)" />
          <ellipse cx="580" cy="710" rx="45" ry="18" fill="url(#dirtPatch)" />
          <ellipse cx="750" cy="745" rx="55" ry="22" fill="url(#deadGrass)" />
          <ellipse cx="900" cy="725" rx="50" ry="20" fill="url(#dirtPatch)" />
          <ellipse cx="450" cy="760" rx="70" ry="28" fill="url(#sandPatch)" />
          <ellipse cx="200" cy="770" rx="60" ry="22" fill="url(#deadGrass)" />
          <ellipse cx="680" cy="780" rx="65" ry="25" fill="url(#dirtPatch)" />

          {/* Grass is handled by the unified grass layer above */}
        </g>

        {/* === WAR DEBRIS - Weapons and items scattered on battlefield === */}
        <g>
          {/* === MID-GROUND DEBRIS (y=450-650) - Scattered across the green floor area === */}

          {/* Broken sword - mid left */}
          <g transform="translate(180, 520) rotate(-15)">
            <rect x="-2" y="-35" width="3" height="30" fill="#4a4a45" opacity="0.7" />
            <polygon points="-2,-35 0,-42 2,-35" fill="#5a5a55" opacity="0.7" />
            <rect x="-5" y="-6" width="10" height="4" fill="#3a3a35" opacity="0.7" />
          </g>

          {/* Shield lying flat - mid center-left */}
          <g transform="translate(320, 560)">
            <ellipse cx="0" cy="0" rx="35" ry="14" fill="#3a3535" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="28" ry="11" fill="#4a4540" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="10" ry="4" fill="#2a2520" opacity="0.6" />
          </g>

          {/* Broken spear shaft - mid center */}
          <g transform="translate(480, 510) rotate(25)">
            <rect x="0" y="-2" width="50" height="3" fill="#3a2a18" opacity="0.6" />
          </g>

          {/* Small axe - mid right */}
          <g transform="translate(680, 540) rotate(-35)">
            <rect x="0" y="-2" width="20" height="3" fill="#3a2a18" opacity="0.6" />
            <path d="M19,-6 Q25,-3 24,0 Q25,3 19,6 L19,-6" fill="#4a4a45" opacity="0.6" />
          </g>

          {/* Helmet - mid far right */}
          <g transform="translate(820, 580)">
            <ellipse cx="0" cy="0" rx="15" ry="7" fill="#4a4a45" opacity="0.5" />
            <ellipse cx="0" cy="-2" rx="12" ry="5" fill="#5a5a55" opacity="0.5" />
          </g>

          {/* Rocks - mid ground scattered */}
          <polygon points="250,500 265,488 280,498" fill="#252220" opacity="0.5" />
          <polygon points="420,550 438,538 455,548" fill="#202018" opacity="0.4" />
          <polygon points="580,490 595,480 610,492" fill="#252220" opacity="0.4" />
          <polygon points="750, 520 762,510 775,518" fill="#202018" opacity="0.5" />

          {/* Fallen warrior shadows - mid ground */}
          <ellipse cx="380" cy="540" rx="35" ry="12" fill="#151812" opacity="0.35" />
          <ellipse cx="620" cy="505" rx="30" ry="10" fill="#151812" opacity="0.3" />

          {/* Arrow stuck in ground - mid */}
          <g transform="translate(550, 530) rotate(-80)">
            <rect x="0" y="-1" width="25" height="2" fill="#3a2a18" opacity="0.6" />
            <polygon points="25,-3 32,0 25,3" fill="#4a4a45" opacity="0.6" />
          </g>

          {/* Small broken shield - mid left */}
          <g transform="translate(140, 570)">
            <ellipse cx="0" cy="0" rx="22" ry="9" fill="#3a2a20" opacity="0.5" />
            <path d="M-15,-6 L18,8" stroke="#252018" strokeWidth="2" opacity="0.4" />
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
            {/* Dirt mound at pole base */}
            <ellipse cx="6" cy="235" rx="25" ry="10" fill="#3d3020" />
            <ellipse cx="6" cy="233" rx="20" ry="8" fill="#4a3a28" />
            <ellipse cx="6" cy="231" rx="12" ry="5" fill="#554535" />
            {/* Small dirt clumps around base */}
            <ellipse cx="-12" cy="238" rx="8" ry="4" fill="#3d3020" opacity="0.7" />
            <ellipse cx="22" cy="240" rx="10" ry="5" fill="#3d3020" opacity="0.6" />
            {/* Grass tufts growing from dirt */}
            <path d="M-8,232 Q-10,222 -6,218" stroke="#4a5a40" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M18,234 Q22,224 19,220" stroke="#4a5a40" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M-15,236 Q-18,228 -14,225" stroke="#455540" strokeWidth="1.2" fill="none" strokeLinecap="round" />

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
              {/* Asteroid container - glow + rock centered together */}
              <div style={{ position: 'relative', width: '30px', height: '30px' }}>
                {/* Circular glow - perfectly centered behind asteroid */}
                <div style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${WC3.roc.felBright}60 0%, ${WC3.roc.felMid}40 30%, ${WC3.roc.felDark}20 55%, transparent 75%)`,
                  filter: 'blur(8px)',
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
              </div>
              {/* Fire trail - centered on asteroid, angled based on fall direction */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                left: '15px',
                width: '20px',
                height: '120px',
                background: `linear-gradient(180deg, transparent 0%, ${WC3.roc.felDark}30 15%, ${WC3.roc.felMid}60 40%, ${WC3.roc.felBright}80 70%, ${WC3.roc.fireCore} 100%)`,
                filter: 'blur(5px)',
                transform: `translateX(-50%) rotate(${inf.side === 'left' ? '-20deg' : '20deg'})`,
                transformOrigin: 'bottom center',
              }} />
              {/* Secondary trail wisps - also centered */}
              <div style={{
                position: 'absolute',
                top: '-70px',
                left: '15px',
                width: '10px',
                height: '80px',
                background: `linear-gradient(180deg, transparent 0%, ${WC3.roc.felMid}40 50%, ${WC3.roc.felBright}70 100%)`,
                filter: 'blur(4px)',
                transform: `translateX(-50%) rotate(${inf.side === 'left' ? '-25deg' : '25deg'})`,
                transformOrigin: 'bottom center',
                opacity: 0.6,
              }} />
            </div>
          )}

          {/* PHASE 2: EXPLOSION - Dramatic fel green explosion at golem's feet */}
          {/* All phases use same center point: golem feet at landY + 200px */}
          {inf.phase === 'explosion' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: `calc(${inf.landY} + 200px)`,
                transform: `translateX(-50%) scale(${inf.scale})`,
                transformOrigin: 'center center',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {/* Shockwave ring expanding outward - at ground level */}
              <div style={{
                position: 'absolute',
                left: '-120px',
                top: '-30px',
                width: '240px',
                height: '60px',
                border: `3px solid ${WC3.roc.felBright}`,
                borderRadius: '50%',
                animation: 'shockwaveExpand 0.5s ease-out forwards',
                opacity: 0.8,
              }} />
              {/* Main explosion flash - rises from ground */}
              <div style={{
                position: 'absolute',
                left: '-100px',
                top: '-130px',
                width: '200px',
                height: '130px',
                background: `radial-gradient(ellipse at 50% 75%, ${WC3.roc.fireCore} 0%, ${WC3.roc.felBright} 15%, ${WC3.roc.felMid}90 35%, ${WC3.roc.felDark}50 60%, transparent 100%)`,
                animation: 'explosionFlash 0.7s ease-out forwards',
              }} />
              {/* Secondary flash layer */}
              <div style={{
                position: 'absolute',
                left: '-60px',
                top: '-80px',
                width: '120px',
                height: '80px',
                background: `radial-gradient(ellipse at 50% 80%, ${WC3.roc.fireCore} 0%, ${WC3.roc.fireBright}80 30%, transparent 70%)`,
                animation: 'explosionFlash 0.5s ease-out forwards',
                animationDelay: '0.1s',
              }} />
              {/* Debris particles - start at ground level, fly upward */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${-30 + (i % 6) * 12}px`,
                    top: `${-15 - (i % 3) * 5}px`,
                    width: `${6 + (i % 4) * 2}px`,
                    height: `${6 + (i % 4) * 2}px`,
                    borderRadius: '30%',
                    background: i % 3 === 0 ? WC3.roc.fireCore : i % 3 === 1 ? WC3.roc.felBright : '#3a3530',
                    animation: `debrisFly${i % 3} ${0.4 + (i % 4) * 0.1}s ease-out forwards`,
                    animationDelay: `${i * 0.02}s`,
                    opacity: 0.9,
                  }}
                />
              ))}
              {/* Smoke wisps rising from ground */}
              {[0, 1, 2].map((i) => (
                <div
                  key={`smoke${i}`}
                  style={{
                    position: 'absolute',
                    left: `${-20 + i * 20}px`,
                    top: '-70px',
                    width: '30px',
                    height: '60px',
                    background: `linear-gradient(to top, ${WC3.roc.felDark}60 0%, ${WC3.roc.felDark}20 50%, transparent 100%)`,
                    filter: 'blur(8px)',
                    animation: `smokeRise 1s ease-out forwards`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* PHASE 2.5: CRATER - Lightning bolt cracks appear and grow from center */}
          {/* Same center point as explosion: golem feet at landY + 200px */}
          {inf.phase === 'crater' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: `calc(${inf.landY} + 200px)`,
                transform: `translateX(-50%) scale(${inf.scale})`,
                transformOrigin: 'center center',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {/* Animated crater with lightning bolt cracks growing from center */}
              <svg
                width="160"
                height="40"
                viewBox="0 0 160 40"
                style={{
                  animation: 'fadeIn 0.2s ease-out forwards',
                }}
              >
                {/* Dark crater base - invisible boundary */}
                <ellipse cx="80" cy="20" rx="75" ry="18" fill="#080604" />
                {/* Lightning bolt cracks - grow from center with tremble */}
                <path d="M80,20 L78,12 L82,10 L77,4 L83,2" stroke="#0a0806" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out forwards, crackTremble 0.15s ease-in-out 0.4s 3' }} />
                <path d="M80,20 L95,14 L92,10 L108,6 L105,2" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.05s forwards, crackTremble 0.15s ease-in-out 0.45s 3' }} />
                <path d="M80,20 L100,22 L105,18 L125,23 L130,19 L150,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.1s forwards, crackTremble 0.15s ease-in-out 0.5s 3' }} />
                <path d="M80,20 L95,28 L90,32 L110,36 L105,38" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.15s forwards, crackTremble 0.15s ease-in-out 0.55s 3' }} />
                <path d="M80,20 L82,28 L78,32 L84,36 L80,38" stroke="#0a0806" strokeWidth="2" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.2s forwards, crackTremble 0.15s ease-in-out 0.6s 3' }} />
                <path d="M80,20 L65,28 L70,32 L50,36 L55,38" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.25s forwards, crackTremble 0.15s ease-in-out 0.65s 3' }} />
                <path d="M80,20 L60,22 L55,18 L35,23 L30,19 L10,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.3s forwards, crackTremble 0.15s ease-in-out 0.7s 3' }} />
                <path d="M80,20 L65,14 L68,10 L52,6 L55,2" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.35s forwards, crackTremble 0.15s ease-in-out 0.75s 3' }} />
                {/* Center glow pulsing */}
                <ellipse cx="80" cy="20" rx="12" ry="6" fill={WC3.roc.felDark} opacity="0.5" style={{ animation: 'meteorPulse 0.5s ease-in-out infinite' }} />
              </svg>
              {/* Lingering smoke */}
              {[0, 1, 2].map((i) => (
                <div
                  key={`smoke${i}`}
                  style={{
                    position: 'absolute',
                    left: `${55 + i * 25}px`,
                    top: '-30px',
                    width: '25px',
                    height: '40px',
                    background: `linear-gradient(to top, ${WC3.roc.felDark}50 0%, transparent 100%)`,
                    filter: 'blur(5px)',
                    animation: `smokeRise 1.2s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* PHASE 3: RISING - Infernal creature emerges FROM crater (grows upward from feet) */}
          {inf.phase === 'rising' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: inf.landY,
                transform: `translateX(-50%) scale(${inf.scale})`,
                transformOrigin: 'center top',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {/* Animated crater - centered at golem feet (y=200) */}
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
                {/* Dark crater base - invisible boundary circle */}
                <ellipse cx="80" cy="20" rx="75" ry="18" fill="#080604" />
                {/* Lightning bolt cracks - grow from center with tremble */}
                {/* Top crack */}
                <path d="M80,20 L78,12 L82,10 L77,4 L83,2" className="craterCrack" stroke="#0a0806" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out forwards, crackTremble 0.15s ease-in-out 0.4s 3' }} />
                {/* Top-right */}
                <path d="M80,20 L95,14 L92,10 L108,6 L105,2" className="craterCrack" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.05s forwards, crackTremble 0.15s ease-in-out 0.45s 3' }} />
                {/* Right */}
                <path d="M80,20 L100,22 L105,18 L125,23 L130,19 L150,24" className="craterCrack" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.1s forwards, crackTremble 0.15s ease-in-out 0.5s 3' }} />
                {/* Bottom-right */}
                <path d="M80,20 L95,28 L90,32 L110,36 L105,38" className="craterCrack" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.15s forwards, crackTremble 0.15s ease-in-out 0.55s 3' }} />
                {/* Bottom */}
                <path d="M80,20 L82,28 L78,32 L84,36 L80,38" className="craterCrack" stroke="#0a0806" strokeWidth="2" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.2s forwards, crackTremble 0.15s ease-in-out 0.6s 3' }} />
                {/* Bottom-left */}
                <path d="M80,20 L65,28 L70,32 L50,36 L55,38" className="craterCrack" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.25s forwards, crackTremble 0.15s ease-in-out 0.65s 3' }} />
                {/* Left */}
                <path d="M80,20 L60,22 L55,18 L35,23 L30,19 L10,24" className="craterCrack" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.3s forwards, crackTremble 0.15s ease-in-out 0.7s 3' }} />
                {/* Top-left */}
                <path d="M80,20 L65,14 L68,10 L52,6 L55,2" className="craterCrack" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: 'crackGrow 0.4s ease-out 0.35s forwards, crackTremble 0.15s ease-in-out 0.75s 3' }} />
                {/* Center glow */}
                <ellipse cx="80" cy="20" rx="12" ry="6" fill={WC3.roc.felDark} opacity="0.4" />
              </svg>
              {/* Shadow with fel glow - at golem feet level (y=200) */}
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
              {/* Golem EMERGES from crater - grows upward from feet */}
              <div style={{
                animation: 'infernalEmerge 1s ease-out forwards',
                transformOrigin: 'center bottom',
              }}>
                <InfernalGolemSVG id={inf.id} isIdle={false} />
              </div>
            </div>
          )}

          {/* PHASE 4: IDLE - Infernal with cracked ground beneath */}
          {inf.phase === 'idle' && (
            <div
              style={{
                position: 'fixed',
                left: inf.landX,
                top: inf.landY,
                transform: `translateX(-50%) scale(${inf.scale})`,
                transformOrigin: 'center top',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {/* Lightning bolt crater - centered at golem feet (y=200) */}
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
                {/* Dark crater base */}
                <ellipse cx="80" cy="20" rx="75" ry="18" fill="#080604" />
                {/* Lightning bolt cracks - static after animation */}
                <path d="M80,20 L78,12 L82,10 L77,4 L83,2" stroke="#0a0806" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M80,20 L95,14 L92,10 L108,6 L105,2" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M80,20 L100,22 L105,18 L125,23 L130,19 L150,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M80,20 L95,28 L90,32 L110,36 L105,38" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M80,20 L82,28 L78,32 L84,36 L80,38" stroke="#0a0806" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M80,20 L65,28 L70,32 L50,36 L55,38" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M80,20 L60,22 L55,18 L35,23 L30,19 L10,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M80,20 L65,14 L68,10 L52,6 L55,2" stroke="#0c0a08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Center glow */}
                <ellipse cx="80" cy="20" rx="12" ry="6" fill={WC3.roc.felDark} opacity="0.4" />
              </svg>

              {/* Shadow with fel glow - at golem feet level (y=200) */}
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
              <InfernalGolemSVG id={inf.id} isIdle={true} />
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
          {/* Dirt mound at pole base */}
          <ellipse cx="12" cy="282" rx="25" ry="10" fill="#3d3020" />
          <ellipse cx="12" cy="280" rx="20" ry="8" fill="#4a3a28" />
          <ellipse cx="12" cy="278" rx="12" ry="5" fill="#554535" />
          {/* Small dirt clumps */}
          <ellipse cx="-6" cy="285" rx="8" ry="4" fill="#3d3020" opacity="0.7" />
          <ellipse cx="28" cy="287" rx="10" ry="5" fill="#3d3020" opacity="0.6" />
          {/* Grass tufts */}
          <path d="M-2,279 Q-4,269 0,265" stroke="#4a5a40" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M24,281 Q28,271 25,267" stroke="#4a5a40" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Banner pole */}
          <rect x="6" y="40" width="12" height="245" fill="#3a2815" />
          <rect x="8" y="40" width="8" height="245" fill="#4a3520" />
          <rect x="10" y="45" width="4" height="235" fill="#5a4530" opacity="0.5" />
          {/* Pole top spike */}
          <polygon points="12,15 2,45 22,45" fill="#5a4a35" />
          <polygon points="12,20 6,43 18,43" fill="#6a5a45" />

          {/* Banner fabric - simplified but visible */}
          <g transform="translate(18, 55)">
            <defs>
              <clipPath id="flagBannerCol1"><rect x="0" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol2"><rect x="18" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol3"><rect x="36" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol4"><rect x="54" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol5"><rect x="72" y="0" width="15" height="150" /></clipPath>
            </defs>

            {[
              { id: 1, x: 0, w: 18, delay: '0s', fill: '#aa2525', yOff: 0 },
              { id: 2, x: 18, w: 18, delay: '0.12s', fill: '#992222', yOff: 2 },
              { id: 3, x: 36, w: 18, delay: '0.24s', fill: '#882020', yOff: 4 },
              { id: 4, x: 54, w: 18, delay: '0.36s', fill: '#771818', yOff: 6 },
              { id: 5, x: 72, w: 15, delay: '0.48s', fill: '#661515', yOff: 8 },
            ].map((col) => (
              <g key={col.id} style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: col.delay }}>
                <rect x={col.x} y={col.yOff} width={col.w} height={150 - col.yOff} fill={col.fill} />
                <g clipPath={`url(#flagBannerCol${col.id})`}>
                  <g transform="translate(44, 70)">
                    <ellipse cx="0" cy="-2" rx="24" ry="16" fill="#1a0808" />
                    <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#2a1010" />
                    <path d="M-18,-8 Q-10,-14 0,-12 Q10,-14 18,-8" stroke="#3a1818" strokeWidth="4" fill="none" />
                    <path d="M-12,-6 L-8,-10 L-2,-8 L-4,-2 L-10,-2 Z" fill="#0a0404" />
                    <ellipse cx="-7" cy="-5" rx="2" ry="1.5" fill="#2a3320" />
                    <path d="M12,-6 L8,-10 L2,-8 L4,-2 L10,-2 Z" fill="#0a0404" />
                    <ellipse cx="7" cy="-5" rx="2" ry="1.5" fill="#2a3320" />
                    <ellipse cx="-2" cy="2" rx="2" ry="3" fill="#0a0404" />
                    <ellipse cx="2" cy="2" rx="2" ry="3" fill="#0a0404" />
                    <path d="M-16,6 L-14,14 L-8,16 L0,14 L8,16 L14,14 L16,6" fill="#2a1010" />
                    {/* Orc tusks - horizontal from jaw corners, pointing outward */}
                    <path d="M-14,10 L-22,6 L-24,10" fill="#4a3828" stroke="#3a2818" strokeWidth="1" />
                    <path d="M14,10 L22,6 L24,10" fill="#4a3828" stroke="#3a2818" strokeWidth="1" />
                    {/* Tusk highlights */}
                    <path d="M-15,9 L-20,7" stroke="#5a4838" strokeWidth="1" fill="none" />
                    <path d="M15,9 L20,7" stroke="#5a4838" strokeWidth="1" fill="none" />
                  </g>
                </g>
              </g>
            ))}
            <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill="#661515" style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.55s' }} />
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
        /* Infernal falling from LEFT side - starts tiny and far, grows as it approaches */
        @keyframes infernalFallRight {
          0% {
            transform: translateX(-50%) translate(-12vw, -95vh) scale(0.1);
            opacity: 0;
          }
          8% {
            opacity: 0.6;
            transform: translateX(-50%) translate(-10vw, -85vh) scale(0.2);
          }
          30% {
            opacity: 0.9;
            transform: translateX(-50%) translate(-6vw, -55vh) scale(0.4);
          }
          60% {
            transform: translateX(-50%) translate(-3vw, -25vh) scale(0.65);
          }
          85% {
            transform: translateX(-50%) translate(-1vw, -8vh) scale(0.85);
          }
          100% {
            transform: translateX(-50%) translate(0, 0) scale(1);
            opacity: 1;
          }
        }
        /* Infernal falling from RIGHT side - starts tiny and far, grows as it approaches */
        @keyframes infernalFallLeft {
          0% {
            transform: translateX(-50%) translate(12vw, -95vh) scale(0.1);
            opacity: 0;
          }
          8% {
            opacity: 0.6;
            transform: translateX(-50%) translate(10vw, -85vh) scale(0.2);
          }
          30% {
            opacity: 0.9;
            transform: translateX(-50%) translate(6vw, -55vh) scale(0.4);
          }
          60% {
            transform: translateX(-50%) translate(3vw, -25vh) scale(0.65);
          }
          85% {
            transform: translateX(-50%) translate(1vw, -8vh) scale(0.85);
          }
          100% {
            transform: translateX(-50%) translate(0, 0) scale(1);
            opacity: 1;
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
        /* Infernal EMERGES from crater - grows upward from feet */
        @keyframes infernalEmerge {
          0% {
            transform: scaleY(0) scaleX(0.3);
            opacity: 0;
            filter: brightness(2);
          }
          20% {
            transform: scaleY(0.3) scaleX(0.6);
            opacity: 0.5;
            filter: brightness(1.8);
          }
          50% {
            transform: scaleY(0.7) scaleX(0.9);
            opacity: 0.8;
            filter: brightness(1.4);
          }
          80% {
            transform: scaleY(0.95) scaleX(1);
            filter: brightness(1.1);
          }
          100% {
            transform: scaleY(1) scaleX(1);
            opacity: 1;
            filter: brightness(1);
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
