'use client'

import React from 'react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getEngineerSkills } from '@/data/skills'
import { getAchievementsByProfession, WORK_EXPERIENCE, type AchievementCategory } from '@/data/achievements'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// =============================================================================
// LIMBO - EXACT VISUAL RECREATION
// Pure greyscale: #000000, #1A1A1A, #2A2A2A, #4A4A4A, #5A5A5A, #8A8A8A, #9A9A9A, #CCCCCC, #DDDDDD, #EEEEEE
// NO other colors. Heavy film grain. Stark silhouettes. Fog layers.
// =============================================================================

// LIMBO COLOR PALETTE - EXACT
const LIMBO = {
  black: '#000000',
  darkGrey1: '#1A1A1A',
  darkGrey2: '#2A2A2A',
  midGrey1: '#4A4A4A',
  midGrey2: '#5A5A5A',
  lightGrey1: '#8A8A8A',
  lightGrey2: '#9A9A9A',
  fogWhite1: '#CCCCCC',
  fogWhite2: '#DDDDDD',
  fogWhite3: '#EEEEEE',
}

// =============================================================================
// ATMOSPHERIC EFFECTS - Film grain, vignette, fog, scratches
// =============================================================================

function LimboAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* HEAVY film grain - essential Limbo texture */}
      <div
        className="absolute inset-0 opacity-30 grain mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Secondary grain layer - finer texture */}
      <div
        className="absolute inset-0 opacity-20 grain-secondary mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.4' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Film scratches - vertical lines */}
      <div className="absolute inset-0 film-scratches opacity-10" />

      {/* Fog layer 1 - slow drift left to right */}
      <div
        className="absolute inset-0 fog-drift-1"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${LIMBO.fogWhite1}15 20%, ${LIMBO.fogWhite2}20 40%, ${LIMBO.fogWhite1}15 60%, transparent 80%)`,
        }}
      />
      {/* Fog layer 2 - opposite direction, slower */}
      <div
        className="absolute inset-0 fog-drift-2"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${LIMBO.fogWhite1}10 30%, ${LIMBO.fogWhite2}12 50%, ${LIMBO.fogWhite1}10 70%, transparent 90%)`,
        }}
      />

      {/* HEAVY vignette - Limbo's dark edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 20%, ${LIMBO.black}40 55%, ${LIMBO.black}75 100%)`,
        }}
      />
      {/* Top/bottom noir gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${LIMBO.black}50 0%, transparent 15%, transparent 85%, ${LIMBO.black}60 100%)`,
        }}
      />

      {/* Rain/mist - subtle vertical lines */}
      <div className="absolute inset-0 rain-mist opacity-5" />
    </div>
  )
}

// =============================================================================
// LIMBO ART ELEMENTS - Spider, Gears, Forest, Boy, Bear Traps
// =============================================================================

// GIANT SPIDER - Massive 8-legged silhouette (iconic Limbo boss)
function GiantSpiderArt() {
  return (
    <div className="relative w-full h-64 overflow-hidden" aria-hidden="true">
      {/* Fog background */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.midGrey1} 0%, ${LIMBO.darkGrey2} 50%, ${LIMBO.darkGrey1} 100%)`
      }} />

      {/* Distant trees in fog */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="xMidYMid slice">
        {/* Background fog trees */}
        <g fill={LIMBO.darkGrey2} opacity="0.3">
          <path d="M50,256 L50,180 Q30,170 25,150 Q45,160 50,140 Q35,130 30,110 Q50,120 50,100 L50,80 L55,80 L55,256 Z" />
          <path d="M150,256 L150,160 Q130,150 125,130 Q145,140 150,120 Q135,110 130,90 Q150,100 150,80 L150,60 L155,60 L155,256 Z" />
          <path d="M700,256 L700,170 Q720,160 725,140 Q705,150 700,130 Q715,120 720,100 Q700,110 700,90 L700,70 L705,70 L705,256 Z" />
          <path d="M600,256 L600,190 Q580,180 575,160 Q595,170 600,150 Q585,140 580,120 Q600,130 600,110 L600,90 L605,90 L605,256 Z" />
        </g>

        {/* GIANT SPIDER */}
        <g className="spider-breathe" style={{ transformOrigin: '400px 180px' }}>
          {/* Spider body - large abdomen */}
          <ellipse cx="400" cy="180" rx="60" ry="40" fill={LIMBO.black} />
          {/* Spider cephalothorax */}
          <ellipse cx="400" cy="130" rx="35" ry="25" fill={LIMBO.black} />

          {/* GLOWING EYES - multiple pairs */}
          <circle cx="385" cy="120" r="6" fill={LIMBO.fogWhite3} className="spider-eye" />
          <circle cx="415" cy="120" r="6" fill={LIMBO.fogWhite3} className="spider-eye" />
          <circle cx="375" cy="130" r="4" fill={LIMBO.fogWhite2} opacity="0.7" />
          <circle cx="425" cy="130" r="4" fill={LIMBO.fogWhite2} opacity="0.7" />
          <circle cx="395" cy="112" r="3" fill={LIMBO.fogWhite1} opacity="0.5" />
          <circle cx="405" cy="112" r="3" fill={LIMBO.fogWhite1} opacity="0.5" />

          {/* Spider legs - 8 total, spindly and threatening */}
          {/* Left legs */}
          <path d="M340,140 Q280,100 220,60 Q210,50 190,30" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-1" />
          <path d="M345,155 Q290,130 230,100 Q200,80 150,50" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-2" />
          <path d="M350,170 Q300,170 250,180 Q180,200 100,220" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-3" />
          <path d="M355,190 Q310,210 260,240 Q220,256 160,256" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-4" />

          {/* Right legs */}
          <path d="M460,140 Q520,100 580,60 Q590,50 610,30" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-1" />
          <path d="M455,155 Q510,130 570,100 Q600,80 650,50" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-2" />
          <path d="M450,170 Q500,170 550,180 Q620,200 700,220" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-3" />
          <path d="M445,190 Q490,210 540,240 Q580,256 640,256" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-4" />

          {/* Fangs / pedipalps */}
          <path d="M390,145 Q385,155 380,165" stroke={LIMBO.black} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M410,145 Q415,155 420,165" stroke={LIMBO.black} strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>

        {/* Hanging web strands */}
        <path d="M400,0 Q395,60 400,130" stroke={LIMBO.lightGrey1} strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M350,0 Q360,80 370,120" stroke={LIMBO.lightGrey1} strokeWidth="1" fill="none" opacity="0.2" />
        <path d="M450,0 Q440,80 430,120" stroke={LIMBO.lightGrey1} strokeWidth="1" fill="none" opacity="0.2" />
      </svg>

      {/* Film grain overlay on art */}
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// INDUSTRIAL GEARS - Interlocking, rotating machinery
function IndustrialGearsArt() {
  return (
    <div className="relative w-full h-56 overflow-hidden" aria-hidden="true">
      {/* Industrial background */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.darkGrey1} 0%, ${LIMBO.darkGrey2} 40%, ${LIMBO.midGrey1} 100%)`
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 224" preserveAspectRatio="xMidYMid slice">
        {/* Factory smokestacks in background */}
        <rect x="50" y="120" width="30" height="104" fill={LIMBO.darkGrey2} />
        <rect x="720" y="100" width="40" height="124" fill={LIMBO.darkGrey2} />
        <rect x="680" y="140" width="25" height="84" fill={LIMBO.darkGrey2} />

        {/* Smoke from stacks */}
        <g className="smoke-rise" opacity="0.15">
          <ellipse cx="65" cy="100" rx="20" ry="15" fill={LIMBO.lightGrey2} />
          <ellipse cx="740" cy="80" rx="25" ry="18" fill={LIMBO.lightGrey2} />
        </g>

        {/* Pipes */}
        <rect x="0" y="180" width="800" height="8" fill={LIMBO.black} />
        <rect x="100" y="160" width="8" height="64" fill={LIMBO.black} />
        <rect x="200" y="150" width="8" height="74" fill={LIMBO.black} />
        <rect x="600" y="155" width="8" height="69" fill={LIMBO.black} />

        {/* LARGE GEAR - main, slow rotation */}
        <g className="gear-rotate-slow" style={{ transformOrigin: '300px 120px' }}>
          <circle cx="300" cy="120" r="70" fill="none" stroke={LIMBO.black} strokeWidth="12" />
          <circle cx="300" cy="120" r="20" fill={LIMBO.black} />
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360 / 16) * Math.PI / 180
            return (
              <line
                key={i}
                x1={300 + 65 * Math.cos(angle)}
                y1={120 + 65 * Math.sin(angle)}
                x2={300 + 90 * Math.cos(angle)}
                y2={120 + 90 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="14"
              />
            )
          })}
        </g>

        {/* MEDIUM GEAR - interlocking, opposite rotation */}
        <g className="gear-rotate-medium" style={{ transformOrigin: '480px 110px' }}>
          <circle cx="480" cy="110" r="50" fill="none" stroke={LIMBO.black} strokeWidth="10" />
          <circle cx="480" cy="110" r="14" fill={LIMBO.black} />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360 / 12) * Math.PI / 180
            return (
              <line
                key={i}
                x1={480 + 46 * Math.cos(angle)}
                y1={110 + 46 * Math.sin(angle)}
                x2={480 + 65 * Math.cos(angle)}
                y2={110 + 65 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="12"
              />
            )
          })}
        </g>

        {/* SMALL GEAR - fast rotation */}
        <g className="gear-rotate-fast" style={{ transformOrigin: '160px 140px' }}>
          <circle cx="160" cy="140" r="30" fill="none" stroke={LIMBO.black} strokeWidth="6" />
          <circle cx="160" cy="140" r="8" fill={LIMBO.black} />
          {[...Array(10)].map((_, i) => {
            const angle = (i * 36) * Math.PI / 180
            return (
              <line
                key={i}
                x1={160 + 27 * Math.cos(angle)}
                y1={140 + 27 * Math.sin(angle)}
                x2={160 + 40 * Math.cos(angle)}
                y2={140 + 40 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="8"
              />
            )
          })}
        </g>

        {/* SAW BLADE - spinning danger */}
        <g className="saw-spin" style={{ transformOrigin: '620px 170px' }}>
          <circle cx="620" cy="170" r="35" fill="none" stroke={LIMBO.black} strokeWidth="4" />
          <circle cx="620" cy="170" r="6" fill={LIMBO.black} />
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15) * Math.PI / 180
            const inner = i % 2 === 0 ? 28 : 32
            return (
              <line
                key={i}
                x1={620 + inner * Math.cos(angle)}
                y1={170 + inner * Math.sin(angle)}
                x2={620 + 42 * Math.cos(angle)}
                y2={170 + 42 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="3"
              />
            )
          })}
        </g>

        {/* BEAR TRAP - jagged teeth */}
        <g>
          <ellipse cx="550" cy="210" rx="30" ry="8" fill={LIMBO.black} />
          <path d="M520,210 L530,190 L540,210 L550,185 L560,210 L570,188 L580,210"
                stroke={LIMBO.black} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Chains hanging */}
        <g className="chain-swing" style={{ transformOrigin: '400px 0' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ellipse key={i} cx="400" cy={i * 18 + 10} rx="6" ry="8" fill="none" stroke={LIMBO.black} strokeWidth="3" />
          ))}
        </g>
      </svg>

      {/* Film grain */}
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// FOREST - Bare, twisted branches, fog, hanging silhouettes
function ForestArt() {
  return (
    <div className="relative w-full h-64 overflow-hidden" aria-hidden="true">
      {/* Foggy forest background */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.lightGrey1} 0%, ${LIMBO.midGrey2} 30%, ${LIMBO.darkGrey2} 70%, ${LIMBO.darkGrey1} 100%)`
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="xMidYMid slice">
        {/* Far background trees - very faded */}
        <g fill={LIMBO.midGrey1} opacity="0.2">
          <path d="M100,256 L100,80 Q80,70 75,50 Q95,60 100,40 Q85,30 80,10 Q100,20 100,0 L105,0 L105,256 Z" />
          <path d="M250,256 L250,100 Q230,90 225,70 Q245,80 250,60 Q235,50 230,30 Q250,40 250,20 L255,20 L255,256 Z" />
          <path d="M550,256 L550,90 Q570,80 575,60 Q555,70 550,50 Q565,40 570,20 Q550,30 550,10 L555,10 L555,256 Z" />
          <path d="M700,256 L700,110 Q720,100 725,80 Q705,90 700,70 Q715,60 720,40 Q700,50 700,30 L705,30 L705,256 Z" />
        </g>

        {/* Mid-ground trees - medium opacity */}
        <g fill={LIMBO.darkGrey1} opacity="0.5">
          <path d="M50,256 L50,120 Q30,110 25,90 Q45,100 50,80 Q35,70 30,50 Q50,60 50,40 L55,40 L55,256 Z" />
          <path d="M180,256 L180,140 Q160,130 155,110 Q175,120 180,100 Q165,90 160,70 Q180,80 180,60 L185,60 L185,256 Z" />
          <path d="M620,256 L620,130 Q640,120 645,100 Q625,110 620,90 Q635,80 640,60 Q620,70 620,50 L625,50 L625,256 Z" />
          <path d="M750,256 L750,150 Q770,140 775,120 Q755,130 750,110 Q765,100 770,80 Q750,90 750,70 L755,70 L755,256 Z" />
        </g>

        {/* Foreground trees - solid black */}
        <g fill={LIMBO.black}>
          {/* Large gnarled tree left */}
          <path d="M120,256 L120,100 Q90,90 85,60 Q110,75 115,50 Q95,40 90,20 Q115,30 120,10 Q125,30 145,15 Q140,40 125,45 Q150,60 145,80 Q125,75 120,100 Z" />
          <path d="M115,80 Q80,50 60,30" stroke={LIMBO.black} strokeWidth="6" fill="none" />
          <path d="M125,70 Q160,40 180,20" stroke={LIMBO.black} strokeWidth="5" fill="none" />

          {/* Large tree right */}
          <path d="M680,256 L680,90 Q710,80 715,50 Q690,65 685,40 Q705,30 710,10 Q685,20 680,5 Q675,20 650,10 Q660,30 675,35 Q650,50 655,70 Q675,65 680,90 Z" />
          <path d="M685,60 Q720,30 740,10" stroke={LIMBO.black} strokeWidth="6" fill="none" />
          <path d="M675,70 Q640,40 620,20" stroke={LIMBO.black} strokeWidth="5" fill="none" />
        </g>

        {/* Rope/hanging element - subtle */}
        <g className="rope-swing" style={{ transformOrigin: '400px 0' }}>
          <path d="M400,0 Q398,60 400,100 Q402,140 398,180" stroke={LIMBO.darkGrey1} strokeWidth="2" fill="none" />
          {/* Subtle hanging figure silhouette - abstract */}
          <ellipse cx="400" cy="200" rx="8" ry="10" fill={LIMBO.darkGrey1} opacity="0.4" />
          <line x1="400" y1="210" x2="400" y2="240" stroke={LIMBO.darkGrey1} strokeWidth="2" opacity="0.4" />
        </g>

        {/* BOY SILHOUETTE - small figure with GLOWING WHITE EYES */}
        <g className="boy-walk">
          {/* Head */}
          <ellipse cx="400" cy="230" rx="6" ry="7" fill={LIMBO.black} />
          {/* GLOWING WHITE EYES */}
          <ellipse cx="398" cy="229" rx="1.5" ry="1" fill={LIMBO.fogWhite3} className="boy-eye" />
          <ellipse cx="402" cy="229" rx="1.5" ry="1" fill={LIMBO.fogWhite3} className="boy-eye" />
          {/* Body */}
          <line x1="400" y1="237" x2="400" y2="248" stroke={LIMBO.black} strokeWidth="3" strokeLinecap="round" />
          {/* Arms */}
          <line x1="400" y1="240" x2="394" y2="246" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="400" y2="244" x2="406" y1="240" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
          {/* Legs */}
          <line x1="400" y1="248" x2="396" y2="256" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="400" y1="248" x2="404" y2="256" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Ground line */}
        <line x1="0" y1="256" x2="800" y2="256" stroke={LIMBO.black} strokeWidth="4" />
      </svg>

      {/* Fog overlay */}
      <div className="absolute inset-0 fog-layer opacity-20" style={{
        background: `linear-gradient(180deg, ${LIMBO.fogWhite2}30 0%, transparent 50%, ${LIMBO.fogWhite1}20 100%)`
      }} />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// =============================================================================
// LIMBO-STYLE SECTION CARDS - Film grain, fog gradients, industrial textures
// =============================================================================

function LimboCard({ children, className = '', ariaLabel }: {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
      style={{
        background: `linear-gradient(135deg, ${LIMBO.darkGrey1} 0%, ${LIMBO.darkGrey2} 50%, ${LIMBO.darkGrey1} 100%)`,
        borderLeft: `4px solid ${LIMBO.black}`,
        boxShadow: `6px 6px 0 ${LIMBO.black}80, inset 0 0 30px ${LIMBO.black}40`,
      }}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay grain-card"
        aria-hidden="true"
      />
      {/* Torn edge effect - top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1} 10%, transparent 15%, ${LIMBO.darkGrey2} 25%, transparent 30%, ${LIMBO.midGrey1} 40%, transparent 50%, ${LIMBO.darkGrey2} 60%, transparent 70%, ${LIMBO.midGrey1} 80%, transparent 90%)`,
        }}
        aria-hidden="true"
      />
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10" aria-hidden="true" />
      {/* Content */}
      <div className="relative z-10 p-5">
        {children}
      </div>
    </div>
  )
}

function LimboItemCard({ children, href, className = '' }: {
  children: React.ReactNode
  href?: string
  className?: string
}) {
  const cardStyle = {
    background: `linear-gradient(145deg, ${LIMBO.darkGrey1} 0%, ${LIMBO.darkGrey2} 100%)`,
    border: `2px solid ${LIMBO.black}`,
    boxShadow: `4px 4px 0 ${LIMBO.black}, inset 0 0 20px ${LIMBO.black}50`,
  }

  const content = (
    <div className="relative" style={cardStyle}>
      <div
        className="absolute inset-0 pointer-events-none opacity-12 mix-blend-overlay grain-card"
        aria-hidden="true"
      />
      <div className={`relative z-10 p-4 ${className}`}>
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group"
      >
        {content}
      </a>
    )
  }
  return content
}

// =============================================================================
// CV CONTENT COMPONENTS - All content immediately visible
// =============================================================================

function SilhouetteFigure({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const labels = {
    engineer: 'the architect',
    drummer: 'the artist',
    fighter: 'the warrior',
  }

  return (
    <button
      onClick={onClick}
      aria-label={`Select ${profession} profession`}
      aria-pressed={isActive}
      className={`relative transition-all duration-300 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
        isActive ? 'scale-110' : 'opacity-30 hover:opacity-50'
      }`}
    >
      <div className="relative w-16 h-24">
        <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
          {profession === 'engineer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill={LIMBO.black} />
              {/* GLOWING WHITE EYES */}
              <ellipse cx="27" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <ellipse cx="33" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <rect x="15" y="23" width="30" height="35" fill={LIMBO.black} rx="3" />
              <rect x="10" y="58" width="10" height="20" fill={LIMBO.black} />
              <rect x="40" y="58" width="10" height="20" fill={LIMBO.black} />
              <rect x="20" y="28" width="20" height="12" fill={isActive ? LIMBO.midGrey1 : LIMBO.darkGrey2} rx="1" />
            </>
          )}
          {profession === 'drummer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill={LIMBO.black} />
              <ellipse cx="27" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <ellipse cx="33" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <path d="M20,23 L40,23 L38,50 L22,50 Z" fill={LIMBO.black} />
              <rect x="12" y="50" width="8" height="20" fill={LIMBO.black} />
              <rect x="40" y="50" width="8" height="20" fill={LIMBO.black} />
              {/* Drumsticks */}
              <line x1="8" y1="18" x2="2" y2="38" stroke={LIMBO.black} strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="18" x2="58" y2="38" stroke={LIMBO.black} strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {profession === 'fighter' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill={LIMBO.black} />
              <ellipse cx="27" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <ellipse cx="33" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <path d="M18,23 L42,23 L40,50 L20,50 Z" fill={LIMBO.black} />
              <rect x="14" y="50" width="10" height="22" fill={LIMBO.black} />
              <rect x="36" y="50" width="10" height="22" fill={LIMBO.black} />
              {/* Fighting stance arms */}
              <path d="M4,28 L18,24 L20,34 L6,36 Z" fill={LIMBO.black} />
              <path d="M56,28 L42,24 L40,34 L54,36 Z" fill={LIMBO.black} />
            </>
          )}
        </svg>
      </div>

      {isActive && (
        <div
          className="absolute inset-0 -z-10 blur-xl"
          style={{ background: `radial-gradient(circle, ${LIMBO.fogWhite1}30, transparent 50%)` }}
          aria-hidden="true"
        />
      )}

      <span className="block mt-1.5 text-xs tracking-[0.25em] uppercase" style={{ color: isActive ? LIMBO.fogWhite1 : LIMBO.midGrey2 }}>
        {labels[profession]}
      </span>
    </button>
  )
}

function TechTag({ name }: { name: string }) {
  return (
    <span
      className="inline-block px-2 py-1 text-xs tracking-wider uppercase transition-colors hover:bg-white hover:text-black"
      style={{ background: 'transparent', border: `1px solid ${LIMBO.midGrey2}`, color: LIMBO.lightGrey2 }}
    >
      {name}
    </span>
  )
}

function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technical skills by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h4 className="text-xs tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: LIMBO.lightGrey1 }}>
            <span className="text-sm grayscale">{category.icon}</span>
            {category.name}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AchievementsList({ categories }: { categories: AchievementCategory[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-5" role="list" aria-label="Achievements by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h4 className="text-xs tracking-[0.25em] uppercase mb-3 flex items-center gap-2" style={{ color: LIMBO.lightGrey1 }}>
            <span className="text-sm grayscale">{category.icon}</span>
            {category.name}
          </h4>
          <ul className="space-y-2">
            {category.achievements.map((achievement) => (
              <li key={achievement.title} style={{ color: LIMBO.lightGrey2 }}>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: LIMBO.midGrey2 }} aria-hidden="true">-</span>
                  {achievement.link ? (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                    >
                      {achievement.title}
                    </a>
                  ) : (
                    <span>{achievement.title}</span>
                  )}
                  {achievement.metric && (
                    <span className="text-xs" style={{ color: LIMBO.midGrey2 }}>{achievement.metric}</span>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-xs ml-3 mt-0.5" style={{ color: LIMBO.midGrey2 }}>{achievement.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px" style={{ background: `${LIMBO.midGrey2}40` }} aria-hidden="true" />
      <h2 className="text-xs tracking-[0.4em] uppercase" style={{ color: LIMBO.lightGrey1 }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${LIMBO.midGrey2}40` }} aria-hidden="true" />
    </div>
  )
}

function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const startYear = new Date(entry.startDate).getFullYear()
  const endYear = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'

  return (
    <article className="p-4" style={{
      background: `${LIMBO.darkGrey1}E6`,
      borderLeft: `3px solid ${LIMBO.black}`,
      boxShadow: `4px 4px 0 ${LIMBO.black}80`,
    }}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{entry.title}</h4>
          <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{entry.organization}</p>
        </div>
        <span className="text-xs tracking-wider uppercase" style={{ color: LIMBO.midGrey2 }}>{startYear} - {endYear}</span>
      </div>
      <p className="text-sm leading-relaxed mt-2" style={{ color: LIMBO.lightGrey2 }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: LIMBO.lightGrey2 }}>
              <span style={{ color: LIMBO.midGrey2 }} aria-hidden="true">-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <LimboItemCard>
      {project.featured && (
        <span className="text-xs tracking-[0.15em] uppercase" style={{ color: LIMBO.midGrey2 }}>[ featured ]</span>
      )}
      <h4 className="text-xs font-bold mt-0.5 uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{project.name}</h4>
      <p className="text-xs mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-1.5 italic" style={{ color: LIMBO.lightGrey2 }}>{'-> '}{project.impact}</p>
      )}
      <div className="flex gap-1.5 flex-wrap mt-2">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs px-1.5 py-0.5 uppercase tracking-wider" style={{ background: LIMBO.black, color: LIMBO.lightGrey2 }}>
            {tech}
          </span>
        ))}
      </div>
    </LimboItemCard>
  )
}

function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <LimboItemCard href={company.url}>
      <div className="flex items-start gap-2 mb-1">
        <span className="text-base grayscale contrast-200">{company.icon}</span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: LIMBO.fogWhite1 }}>{company.name}</h4>
          <p className="text-xs tracking-wider" style={{ color: LIMBO.lightGrey1 }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: LIMBO.lightGrey2 }}>{company.description}</p>
    </LimboItemCard>
  )
}

function BandCard({ band }: { band: typeof BANDS[0] }) {
  return (
    <LimboItemCard href={band.url || undefined}>
      <h4 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: LIMBO.fogWhite1 }}>{band.name}</h4>
      <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{band.genre} | {band.role}</p>
      <p className="text-sm leading-relaxed mt-1.5" style={{ color: LIMBO.lightGrey2 }}>{band.description}</p>
      {!band.url && (
        <p className="text-xs mt-1.5 uppercase tracking-wider" style={{ color: LIMBO.midGrey1 }}>[ website coming ]</p>
      )}
    </LimboItemCard>
  )
}

function WorkCard({ work }: { work: typeof WORK_EXPERIENCE[0] }) {
  return (
    <article className="p-4" style={{
      background: `${LIMBO.darkGrey1}E6`,
      borderLeft: `3px solid ${LIMBO.black}`,
      boxShadow: `4px 4px 0 ${LIMBO.black}80`,
    }}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{work.title}</h4>
          <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{work.company}</p>
        </div>
        <span className="text-xs tracking-wider uppercase" style={{ color: work.current ? LIMBO.lightGrey1 : LIMBO.midGrey2 }}>{work.period}</span>
      </div>
      <ul className="mt-2 space-y-1">
        {work.highlights.map((highlight, i) => (
          <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: LIMBO.lightGrey2 }}>
            <span style={{ color: LIMBO.midGrey2 }} aria-hidden="true">-</span>
            {highlight}
          </li>
        ))}
      </ul>
      {work.technologies && (
        <div className="flex gap-1.5 flex-wrap mt-2">
          {work.technologies.map((tech) => (
            <span key={tech} className="text-xs px-1 py-0.5 uppercase" style={{ border: `1px solid ${LIMBO.midGrey1}`, color: LIMBO.lightGrey1 }}>
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

// =============================================================================
// MAIN THEME COMPONENT
// Layout: Header -> About -> ART (spider) -> Experience -> ART (gears) -> Skills -> Projects -> ART (forest) -> Ventures -> Posts
// =============================================================================

export default function SilhouetteTheme() {
  const { active, setActive, config } = useProfession()

  const aboutData = ABOUT_DATA[active]
  const engineerSkills = getEngineerSkills()
  const achievements = getAchievementsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(180deg, ${LIMBO.lightGrey2} 0%, ${LIMBO.lightGrey1} 15%, ${LIMBO.midGrey2} 40%, ${LIMBO.midGrey1} 70%, ${LIMBO.darkGrey2} 100%)`,
        fontFamily: '"Courier New", Consolas, monospace',
        overflowX: 'hidden',
      }}
    >
      {/* Limbo atmospheric effects */}
      <LimboAtmosphere />

      {/* ========== HEADER ========== */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-3xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl tracking-[0.5em] font-normal" style={{ color: LIMBO.darkGrey1 }}>
              ALEXANDER PULIDO
            </h1>
            <p className="text-xs tracking-[0.2em] mt-2" style={{ color: LIMBO.darkGrey2 }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs tracking-wider mt-1 italic" style={{ color: LIMBO.midGrey1 }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="limbo-btn px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              style={{ background: 'transparent', border: `2px solid ${LIMBO.black}`, color: LIMBO.darkGrey1 }}
            >
              resume
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="limbo-btn px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: LIMBO.black, color: LIMBO.fogWhite1 }}
            >
              enter
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6" aria-label="Current professional roles">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center">
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: LIMBO.darkGrey1 }}>{role.title}</p>
                <p className="text-xs mt-0.5" style={{ color: LIMBO.midGrey1 }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Selection */}
      <section className="relative z-20 py-8" aria-label="Select profession view">
        <div className="flex justify-center gap-14">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <SilhouetteFigure key={prof} profession={prof} isActive={active === prof} onClick={() => setActive(prof)} />
          ))}
        </div>
        <p className="text-center mt-3 text-xs tracking-[0.3em] uppercase" style={{ color: LIMBO.midGrey1 }}>
          {config.title.toLowerCase()}
        </p>
      </section>

      {/* ========== MAIN CONTENT - NEW LAYOUT ORDER ========== */}
      <main className="relative z-20" role="main">

        {/* ========== ABOUT ========== */}
        <section className="px-6 py-8" aria-label="About">
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="about" />
            <LimboCard ariaLabel="Biography">
              <p className="text-sm leading-relaxed" style={{ color: LIMBO.lightGrey2 }}>{aboutData.bio}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {aboutData.quickFacts.map((fact, i) => (
                  <span key={i} className="text-xs tracking-wider uppercase" style={{ color: LIMBO.lightGrey1 }}>- {fact}</span>
                ))}
              </div>
            </LimboCard>
          </div>
        </section>

        {/* ========== ART: GIANT SPIDER ========== */}
        <GiantSpiderArt />

        {/* ========== EXPERIENCE ========== */}
        <section className="px-6 py-8" aria-label="Work experience">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Work Experience */}
            <div>
              <SectionHeader title="work experience" />
              <div className="space-y-3">
                {WORK_EXPERIENCE.map((work) => (
                  <WorkCard key={work.company} work={work} />
                ))}
              </div>
            </div>

            {/* Professional Timeline */}
            {experience.length > 0 && (
              <div>
                <SectionHeader title="timeline" />
                <div className="space-y-3">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== ART: INDUSTRIAL GEARS ========== */}
        <IndustrialGearsArt />

        {/* ========== SKILLS ========== */}
        <section className="px-6 py-8" aria-label={active === 'engineer' ? 'Technical skills' : 'Skills and achievements'}>
          <div className="max-w-2xl mx-auto">
            <SectionHeader title={active === 'engineer' ? 'tech stack' : 'skills'} />
            <LimboCard>
              {active === 'engineer' ? (
                <TechCloud categories={engineerSkills} />
              ) : (
                <AchievementsList categories={achievements} />
              )}
            </LimboCard>
          </div>
        </section>

        {/* ========== PROJECTS ========== */}
        <section className="px-6 py-8" aria-label="Featured projects">
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="featured work" />
            <div className="grid md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== ART: FOREST ========== */}
        <ForestArt />

        {/* ========== VENTURES (Companies/Bands) ========== */}
        <section className="px-6 py-8" aria-label="Ventures">
          <div className="max-w-2xl mx-auto">
            {active === 'engineer' && (
              <>
                <SectionHeader title="companies" />
                <div className="grid md:grid-cols-3 gap-3">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </>
            )}
            {active === 'drummer' && (
              <>
                <SectionHeader title="bands" />
                <div className="grid md:grid-cols-3 gap-3">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

      </main>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-10 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          <div className="w-6 h-px" style={{ background: `${LIMBO.black}40` }} />
          <p className="text-xs tracking-[0.5em]" style={{ color: LIMBO.midGrey2 }}>. . .</p>
          <div className="w-6 h-px" style={{ background: `${LIMBO.black}40` }} />
        </div>
      </footer>

      {/* =================================================================
          LIMBO CSS - PURE GREYSCALE, HEAVY FILM GRAIN, FOG, MACHINERY
          ================================================================= */}
      <style jsx global>{`
        /* ============ FOG DRIFT ============ */
        @keyframes fog-drift-1 {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        @keyframes fog-drift-2 {
          0% { transform: translateX(20%); }
          100% { transform: translateX(-20%); }
        }
        .fog-drift-1 {
          animation: fog-drift-1 60s ease-in-out infinite alternate;
        }
        .fog-drift-2 {
          animation: fog-drift-2 80s ease-in-out infinite alternate;
        }
        .fog-layer {
          animation: fog-drift-1 40s ease-in-out infinite alternate;
        }

        /* ============ HEAVY FILM GRAIN ============ */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(0.5%, 1%); }
          30% { transform: translate(-0.5%, -0.5%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0.5%); }
          60% { transform: translate(0.5%, -0.5%); }
          70% { transform: translate(-0.5%, 1%); }
          80% { transform: translate(1%, 0.5%); }
          90% { transform: translate(-1%, -0.5%); }
        }
        @keyframes grain-secondary {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-0.5%, 0.5%) scale(1.05); }
        }
        .grain {
          animation: grain 0.3s steps(10) infinite;
        }
        .grain-secondary {
          animation: grain-secondary 0.5s steps(6) infinite;
        }
        .grain-card {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: grain 0.4s steps(8) infinite;
        }

        /* ============ FILM SCRATCHES ============ */
        @keyframes film-scratch {
          0% { opacity: 0.05; }
          10% { opacity: 0.12; }
          20% { opacity: 0.05; }
          100% { opacity: 0.05; }
        }
        .film-scratches {
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 100px,
            ${LIMBO.fogWhite3}10 100px,
            ${LIMBO.fogWhite3}10 101px,
            transparent 101px,
            transparent 300px,
            ${LIMBO.fogWhite2}08 300px,
            ${LIMBO.fogWhite2}08 301px
          );
          animation: film-scratch 3s linear infinite;
        }

        /* ============ RAIN / MIST ============ */
        @keyframes rain-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .rain-mist {
          background: repeating-linear-gradient(
            180deg,
            transparent 0px,
            transparent 10px,
            ${LIMBO.fogWhite2}05 10px,
            ${LIMBO.fogWhite2}05 11px,
            transparent 11px,
            transparent 25px,
            ${LIMBO.fogWhite1}03 25px,
            ${LIMBO.fogWhite1}03 26px
          );
          animation: rain-fall 15s linear infinite;
        }

        /* ============ SPIDER ANIMATIONS ============ */
        @keyframes spider-breathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-2px); }
        }
        .spider-breathe {
          animation: spider-breathe 4s ease-in-out infinite;
        }
        @keyframes spider-eye-glow {
          0%, 100% { filter: drop-shadow(0 0 4px ${LIMBO.fogWhite3}) drop-shadow(0 0 8px ${LIMBO.fogWhite2}); }
          50% { filter: drop-shadow(0 0 6px ${LIMBO.fogWhite3}) drop-shadow(0 0 12px ${LIMBO.fogWhite2}); }
        }
        .spider-eye {
          animation: spider-eye-glow 2s ease-in-out infinite;
        }
        @keyframes leg-twitch {
          0%, 95%, 100% { transform: rotate(0deg); }
          97% { transform: rotate(1deg); }
        }
        .spider-leg-1, .spider-leg-2, .spider-leg-3, .spider-leg-4 {
          transform-origin: center;
          animation: leg-twitch 8s ease-in-out infinite;
        }
        .spider-leg-2 { animation-delay: 0.5s; }
        .spider-leg-3 { animation-delay: 1s; }
        .spider-leg-4 { animation-delay: 1.5s; }

        /* ============ GEAR ROTATIONS ============ */
        @keyframes gear-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gear-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .gear-rotate-slow {
          animation: gear-rotate 50s linear infinite;
        }
        .gear-rotate-medium {
          animation: gear-rotate-reverse 35s linear infinite;
        }
        .gear-rotate-fast {
          animation: gear-rotate 20s linear infinite;
        }
        .saw-spin {
          animation: gear-rotate 8s linear infinite;
        }

        /* ============ SMOKE RISE ============ */
        @keyframes smoke-rise {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 0.1; }
        }
        .smoke-rise {
          animation: smoke-rise 6s ease-in-out infinite;
        }

        /* ============ CHAIN SWING ============ */
        @keyframes chain-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        .chain-swing {
          animation: chain-swing 5s ease-in-out infinite;
        }

        /* ============ BOY WALK ============ */
        @keyframes boy-walk {
          0%, 100% { transform: translateX(0) scaleX(1); }
          49% { transform: translateX(25px) scaleX(1); }
          50% { transform: translateX(25px) scaleX(-1); }
          99% { transform: translateX(0) scaleX(-1); }
        }
        .boy-walk {
          animation: boy-walk 20s ease-in-out infinite;
        }
        @keyframes boy-eye-glow {
          0%, 100% { filter: drop-shadow(0 0 2px ${LIMBO.fogWhite3}) drop-shadow(0 0 4px ${LIMBO.fogWhite2}); }
          50% { filter: drop-shadow(0 0 3px ${LIMBO.fogWhite3}) drop-shadow(0 0 6px ${LIMBO.fogWhite2}); }
        }
        .boy-eye {
          animation: boy-eye-glow 2s ease-in-out infinite;
        }

        /* ============ ROPE SWING ============ */
        @keyframes rope-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        .rope-swing {
          animation: rope-swing 4s ease-in-out infinite;
        }

        /* ============ FIGURE EYE GLOW ============ */
        @keyframes figure-eye-glow {
          0%, 100% { filter: drop-shadow(0 0 3px ${LIMBO.fogWhite3}); }
          50% { filter: drop-shadow(0 0 6px ${LIMBO.fogWhite3}); }
        }
        .figure-eye {
          animation: figure-eye-glow 2s ease-in-out infinite;
        }

        /* ============ BUTTON EFFECTS ============ */
        .limbo-btn {
          position: relative;
          overflow: visible;
        }
        .limbo-btn::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 100%;
          height: 100%;
          background: ${LIMBO.black};
          z-index: -1;
          transition: top 0.15s ease, left 0.15s ease;
        }
        .limbo-btn:hover::after {
          top: 5px;
          left: 5px;
        }
        .limbo-btn:hover {
          transform: translate(-1px, -1px);
        }
        .limbo-btn:active::after {
          top: 1px;
          left: 1px;
        }
        .limbo-btn:active {
          transform: translate(1px, 1px);
        }

        /* ============ ACCESSIBILITY - REDUCED MOTION ============ */
        @media (prefers-reduced-motion: reduce) {
          .fog-drift-1,
          .fog-drift-2,
          .fog-layer,
          .grain,
          .grain-secondary,
          .grain-card,
          .film-scratches,
          .rain-mist,
          .spider-breathe,
          .spider-eye,
          .spider-leg-1,
          .spider-leg-2,
          .spider-leg-3,
          .spider-leg-4,
          .gear-rotate-slow,
          .gear-rotate-medium,
          .gear-rotate-fast,
          .saw-spin,
          .smoke-rise,
          .chain-swing,
          .boy-walk,
          .boy-eye,
          .rope-swing,
          .figure-eye,
          .limbo-btn {
            animation: none !important;
          }
          .limbo-btn::after {
            transition: none;
          }
          .spider-eye,
          .boy-eye,
          .figure-eye {
            filter: drop-shadow(0 0 4px ${LIMBO.fogWhite3});
          }
        }
      `}</style>
    </div>
  )
}
