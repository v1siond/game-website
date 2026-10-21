'use client'

import React from 'react'
import Link from 'next/link'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionSections } from '@/lib/cv/cvView'

// =============================================================================
// LIMBO - DARKER, PERFORMANCE-OPTIMIZED
// True Limbo aesthetic: almost pure black with grey fog
// Background: very dark grey/black (#0A0A0A to #1A1A1A)
// Text: light grey (#CCCCCC to #FFFFFF), Silhouettes: pure black
// Fog effects: the only lighter elements
// =============================================================================

// LIMBO COLOR PALETTE - DARKER
const LIMBO = {
  black: '#000000',
  voidBlack: '#050505',     // Deepest background
  darkGrey1: '#0A0A0A',     // Primary background
  darkGrey2: '#121212',     // Secondary background
  darkGrey3: '#1A1A1A',     // Card backgrounds
  midGrey1: '#2A2A2A',      // Borders, muted elements
  midGrey2: '#3A3A3A',      // Decorative elements
  lightGrey1: '#888888',    // Secondary text
  lightGrey2: '#AAAAAA',    // Body text (WCAG AA on dark)
  fogWhite1: '#CCCCCC',     // Primary text
  fogWhite2: '#DDDDDD',     // Headings
  fogWhite3: '#EEEEEE',     // Glowing elements, emphasis
}

// =============================================================================
// ATMOSPHERIC EFFECTS - Enhanced for impact
// Multiple fog layers, floating particles, strong vignette
// Uses CSS transforms only (GPU-accelerated), will-change where needed
// =============================================================================

function LimboAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* Film grain layer - enhanced opacity */}
      <div
        className="absolute inset-0 opacity-20 grain will-change-transform"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Fog layer 1 - slow drift */}
      <div
        className="absolute inset-0 fog-drift-slow will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1}20 25%, ${LIMBO.midGrey2}15 50%, ${LIMBO.midGrey1}20 75%, transparent 100%)`,
        }}
      />

      {/* Fog layer 2 - faster counter-drift for depth */}
      <div
        className="absolute inset-0 fog-drift-fast will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${LIMBO.darkGrey3}12 35%, transparent 50%, ${LIMBO.darkGrey3}12 65%, transparent 90%)`,
        }}
      />

      {/* Fog layer 3 - vertical creep from bottom */}
      <div
        className="absolute inset-0 fog-rise will-change-transform"
        style={{
          background: `linear-gradient(0deg, ${LIMBO.midGrey1}25 0%, ${LIMBO.midGrey2}10 30%, transparent 60%)`,
        }}
      />

      {/* Floating dust particles */}
      <div className="absolute inset-0">
        <div className="particle particle-1" style={{ left: '10%', top: '20%' }} />
        <div className="particle particle-2" style={{ left: '25%', top: '60%' }} />
        <div className="particle particle-3" style={{ left: '45%', top: '35%' }} />
        <div className="particle particle-4" style={{ left: '65%', top: '70%' }} />
        <div className="particle particle-5" style={{ left: '80%', top: '25%' }} />
        <div className="particle particle-6" style={{ left: '15%', top: '80%' }} />
        <div className="particle particle-7" style={{ left: '55%', top: '15%' }} />
        <div className="particle particle-8" style={{ left: '90%', top: '55%' }} />
      </div>

      {/* HEAVY vignette - stronger for cinematic feel */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 10%, ${LIMBO.black}40 40%, ${LIMBO.black}85 70%, ${LIMBO.black} 100%)`,
        }}
      />

      {/* Top/bottom noir gradient - cinematic letterbox effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${LIMBO.black}85 0%, ${LIMBO.black}40 8%, transparent 18%, transparent 82%, ${LIMBO.black}40 92%, ${LIMBO.black}90 100%)`,
        }}
      />

      {/* Side vignettes for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${LIMBO.black}60 0%, transparent 15%, transparent 85%, ${LIMBO.black}60 100%)`,
        }}
      />
    </div>
  )
}

// =============================================================================
// LIMBO ART ELEMENTS - Spider, Gears, Forest, Boy, Bear Traps
// =============================================================================

// GIANT SPIDER - Massive 8-legged silhouette (iconic Limbo boss)
function GiantSpiderArt() {
  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden" aria-hidden="true">
      {/* Gradient transition from content above */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.voidBlack} 0%, ${LIMBO.darkGrey2} 15%, ${LIMBO.midGrey1}30 40%, ${LIMBO.darkGrey2} 70%, ${LIMBO.voidBlack} 100%)`
      }} />
      {/* Fog overlay for depth */}
      <div className="absolute inset-0 fog-drift-slow opacity-40" style={{
        background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1}40 30%, ${LIMBO.midGrey2}30 50%, ${LIMBO.midGrey1}40 70%, transparent 100%)`
      }} />

      {/* Distant trees in fog */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="xMidYMid slice">
        {/* Background fog trees */}
        <g fill={LIMBO.darkGrey3} opacity="0.3">
          <path d="M50,256 L50,180 Q30,170 25,150 Q45,160 50,140 Q35,130 30,110 Q50,120 50,100 L50,80 L55,80 L55,256 Z" />
          <path d="M150,256 L150,160 Q130,150 125,130 Q145,140 150,120 Q135,110 130,90 Q150,100 150,80 L150,60 L155,60 L155,256 Z" />
          <path d="M700,256 L700,170 Q720,160 725,140 Q705,150 700,130 Q715,120 720,100 Q700,110 700,90 L700,70 L705,70 L705,256 Z" />
          <path d="M600,256 L600,190 Q580,180 575,160 Q595,170 600,150 Q585,140 580,120 Q600,130 600,110 L600,90 L605,90 L605,256 Z" />
        </g>

        {/* GIANT SPIDER - simplified animation */}
        <g className="spider-breathe will-change-transform" style={{ transformOrigin: '400px 180px' }}>
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

      {/* Film grain overlay on art - reduced */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// INDUSTRIAL GEARS - Interlocking, rotating machinery
function IndustrialGearsArt() {
  return (
    <div className="relative w-full h-72 md:h-80 overflow-hidden" aria-hidden="true">
      {/* Gradient transition from content */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.voidBlack} 0%, ${LIMBO.darkGrey2} 20%, ${LIMBO.darkGrey3}40 50%, ${LIMBO.darkGrey2} 80%, ${LIMBO.voidBlack} 100%)`
      }} />
      {/* Fog layer for atmosphere */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1}30 40%, ${LIMBO.midGrey2}20 60%, transparent 100%)`
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 224" preserveAspectRatio="xMidYMid slice">
        {/* Factory smokestacks in background */}
        <rect x="50" y="120" width="30" height="104" fill={LIMBO.darkGrey3} />
        <rect x="720" y="100" width="40" height="124" fill={LIMBO.darkGrey3} />
        <rect x="680" y="140" width="25" height="84" fill={LIMBO.darkGrey3} />

        {/* Smoke from stacks - static, no animation for perf */}
        <g opacity="0.1">
          <ellipse cx="65" cy="100" rx="20" ry="15" fill={LIMBO.lightGrey2} />
          <ellipse cx="740" cy="80" rx="25" ry="18" fill={LIMBO.lightGrey2} />
        </g>

        {/* Pipes */}
        <rect x="0" y="180" width="800" height="8" fill={LIMBO.black} />
        <rect x="100" y="160" width="8" height="64" fill={LIMBO.black} />
        <rect x="200" y="150" width="8" height="74" fill={LIMBO.black} />
        <rect x="600" y="155" width="8" height="69" fill={LIMBO.black} />

        {/* LARGE GEAR - main, slow rotation - GPU accelerated */}
        <g className="gear-rotate-slow will-change-transform" style={{ transformOrigin: '300px 120px' }}>
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

        {/* MEDIUM GEAR - interlocking, opposite rotation - GPU accelerated */}
        <g className="gear-rotate-medium will-change-transform" style={{ transformOrigin: '480px 110px' }}>
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

        {/* SMALL GEAR - removed for performance (keep only 2 gears) */}
        <g style={{ transformOrigin: '160px 140px' }}>
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

        {/* SAW BLADE - static for performance */}
        <g style={{ transformOrigin: '620px 170px' }}>
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

        {/* Chains hanging - static for performance */}
        <g style={{ transformOrigin: '400px 0' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ellipse key={i} cx="400" cy={i * 18 + 10} rx="6" ry="8" fill="none" stroke={LIMBO.black} strokeWidth="3" />
          ))}
        </g>
      </svg>

      {/* Film grain - reduced */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// FOREST - Bare, twisted branches, fog, hanging silhouettes
function ForestArt() {
  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden" aria-hidden="true">
      {/* Gradient transition from content */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.voidBlack} 0%, ${LIMBO.darkGrey2} 10%, ${LIMBO.midGrey2}30 35%, ${LIMBO.darkGrey3} 60%, ${LIMBO.darkGrey2} 85%, ${LIMBO.voidBlack} 100%)`
      }} />
      {/* Rising fog from bottom */}
      <div className="absolute inset-0 fog-rise opacity-40" style={{
        background: `linear-gradient(0deg, ${LIMBO.midGrey1}40 0%, ${LIMBO.midGrey2}20 25%, transparent 50%)`
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

        {/* Rope/hanging element - static for performance */}
        <g style={{ transformOrigin: '400px 0' }}>
          <path d="M400,0 Q398,60 400,100 Q402,140 398,180" stroke={LIMBO.darkGrey1} strokeWidth="2" fill="none" />
          {/* Subtle hanging figure silhouette - abstract */}
          <ellipse cx="400" cy="200" rx="8" ry="10" fill={LIMBO.darkGrey1} opacity="0.4" />
          <line x1="400" y1="210" x2="400" y2="240" stroke={LIMBO.darkGrey1} strokeWidth="2" opacity="0.4" />
        </g>

        {/* BOY SILHOUETTE - small figure with GLOWING WHITE EYES - static */}
        <g>
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

      {/* Fog overlay - simplified */}
      <div className="absolute inset-0 opacity-15" style={{
        background: `linear-gradient(180deg, ${LIMBO.midGrey2}20 0%, transparent 50%, ${LIMBO.midGrey1}15 100%)`
      }} />

      {/* Film grain - reduced */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
        background: `linear-gradient(135deg, ${LIMBO.darkGrey2} 0%, ${LIMBO.darkGrey3} 50%, ${LIMBO.darkGrey2} 100%)`,
        borderLeft: `4px solid ${LIMBO.black}`,
        boxShadow: `6px 6px 0 ${LIMBO.black}, inset 0 0 30px ${LIMBO.black}60`,
      }}
    >
      {/* Film grain overlay - static for performance */}
      <div
        className="absolute inset-0 pointer-events-none opacity-8"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
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
    background: `linear-gradient(145deg, ${LIMBO.darkGrey2} 0%, ${LIMBO.darkGrey3} 100%)`,
    border: `2px solid ${LIMBO.black}`,
    boxShadow: `4px 4px 0 ${LIMBO.black}, inset 0 0 20px ${LIMBO.black}70`,
  }

  const content = (
    <div className="relative" style={cardStyle}>
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

// The three figures are the profession switch's options: ProfessionSwitch owns the order (Musician,
// System Engineer, Martial Artist), the pick and the keyboard; each figure only draws itself.
function SilhouetteFigure({ option }: { option: ProfessionOption }) {
  const { id: profession, label, selected: isActive, optionProps } = option

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative transition-all duration-300 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
        isActive ? 'scale-110' : 'opacity-30 hover:opacity-50'
      }`}
    >
      <div className="relative w-16 h-24 mx-auto">
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

      <span
        className={`block mt-1.5 text-sm tracking-[0.2em] lowercase ${isActive ? 'text-[#CCCCCC]' : 'text-[#888888]'}`}
        aria-hidden="true"
      >
        {label}
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

function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technical skills by category">
      {categories.map((category) => (
        <div key={category.id} role="listitem">
          <h3 className="text-xs tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: LIMBO.lightGrey1 }}>
            <span className="text-sm grayscale" aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px" style={{ background: `${LIMBO.midGrey2}40` }} aria-hidden="true" />
      <h2 className="text-xs tracking-[0.4em] uppercase" style={{ color: LIMBO.lightGrey1 }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${LIMBO.midGrey2}40` }} aria-hidden="true" />
    </div>
  )
}

// Dates are date only strings (UTC midnight), so the year is read in UTC: a January start keeps its
// own year west of UTC.
function ExperienceCard({ entry }: { entry: Job }) {
  const startYear = entry.startDate.getUTCFullYear()
  const endYear = entry.endDate ? entry.endDate.getUTCFullYear() : 'Present'

  return (
    <article className="p-4" style={{
      background: `${LIMBO.darkGrey2}`,
      borderLeft: `3px solid ${LIMBO.black}`,
      boxShadow: `4px 4px 0 ${LIMBO.black}`,
    }}>
      <div className="flex justify-between items-start gap-3 mb-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{entry.title}</h3>
          <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{entry.company}</p>
        </div>
        <span className="text-xs tracking-wider uppercase whitespace-nowrap" style={{ color: LIMBO.lightGrey1 }}>{startYear} - {endYear}</span>
      </div>
      {entry.description && (
        <p className="text-sm leading-relaxed mt-2" style={{ color: LIMBO.lightGrey2 }}>{entry.description}</p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-xs flex items-start gap-1.5" style={{ color: LIMBO.lightGrey2 }}>
              <span style={{ color: LIMBO.midGrey2 }} aria-hidden="true">-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-2">
          {entry.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs px-1 py-0.5 uppercase" style={{ border: `1px solid ${LIMBO.midGrey1}`, color: LIMBO.lightGrey1 }}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <LimboItemCard>
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{project.name}</h3>
        {years && <span className="text-xs tracking-wider whitespace-nowrap text-[#888888]">{years}</span>}
      </div>
      <p className="text-xs mt-0.5 text-[#CCCCCC]">{project.role}</p>
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
      {links.length > 0 ? (
        <div className="flex gap-2 flex-wrap mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-xs tracking-[0.2em] uppercase border-2 border-[#CCCCCC] text-[#CCCCCC] transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs mt-3 uppercase tracking-wider text-[#888888]">[ no public link ]</p>
      )}
    </LimboItemCard>
  )
}

function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <LimboItemCard href={company.url || undefined}>
      <div className="flex items-start gap-2 mb-1">
        <span className="text-base grayscale contrast-200" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: LIMBO.fogWhite1 }}>{company.name}</h3>
          <p className="text-xs tracking-wider" style={{ color: LIMBO.lightGrey1 }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: LIMBO.lightGrey2 }}>{company.description}</p>
    </LimboItemCard>
  )
}

function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <LimboItemCard>
      <h3 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: LIMBO.fogWhite1 }}>{band.name}</h3>
      <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm leading-relaxed mt-1.5" style={{ color: LIMBO.lightGrey2 }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </LimboItemCard>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block transition-transform hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group"
    >
      {content}
    </a>
  )
}

// The limbo button look, shared by the hero actions, the CV link and the closing call to action.
const LIMBO_BUTTON =
  'limbo-btn inline-flex items-center justify-center min-h-[44px] px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

// Email is the lit primary action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#CCCCCC] text-black hover:opacity-90',
  linkedin: 'border-2 border-[#CCCCCC] text-[#CCCCCC] hover:bg-white hover:text-black',
}

function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${LIMBO_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      {/* ========== ABOUT ========== */}
      <section className="px-6 py-8" aria-label="About">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="about" />
          <LimboCard>
            <p className="text-sm leading-relaxed" style={{ color: LIMBO.lightGrey2 }}>{professionalSummary.bio}</p>
          </LimboCard>
        </div>
      </section>

      {/* ========== ART: GIANT SPIDER ========== */}
      <GiantSpiderArt />

      {/* ========== EXPERIENCE ========== */}
      {sections.jobs.length > 0 && (
        <section className="px-6 py-8" aria-label="Work experience">
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="work experience" />
            <div className="space-y-3">
              {sections.jobs.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== ART: INDUSTRIAL GEARS ========== */}
      <IndustrialGearsArt />

      {/* ========== TECH STACK ========== */}
      <section className="px-6 py-8" aria-label="Tech stack">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="tech stack" />
          <LimboCard>
            <TechCloud categories={sections.techStack} />
          </LimboCard>
        </div>
      </section>

      {/* ========== PROJECTS ========== */}
      <section className="px-6 py-8" aria-label="Projects">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="featured work" />
          <ProjectList
            projects={sections.projects}
            className="grid md:grid-cols-2 gap-4"
            renderProject={(slot) => <ProjectCard {...slot} />}
          />
        </div>
      </section>

      {/* ========== ART: FOREST ========== */}
      <ForestArt />

      {/* ========== VENTURES ========== */}
      <section className="px-6 py-8" aria-label="Ventures">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="ventures" />
          <div className="grid md:grid-cols-3 gap-3">
            {sections.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <GiantSpiderArt />

      <section className="px-6 py-8" aria-label="Bands">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="bands" />
          <p className="text-sm mb-4 text-center" style={{ color: LIMBO.lightGrey2 }}>
            Drums since {musician.since}, {musician.yearsPlaying} years
          </p>
          <BandList
            bands={bands}
            className="grid md:grid-cols-3 gap-3"
            renderBand={(slot) => <BandCard {...slot} />}
          />
          <p className="text-sm mt-4 italic text-center" style={{ color: LIMBO.lightGrey2 }}>{musician.line}</p>
        </div>
      </section>

      <ForestArt />
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <IndustrialGearsArt />

      <section className="px-6 py-8" aria-label="Muay Thai">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="muay thai" />
          <LimboCard>
            <h3 className="text-sm tracking-[0.2em] uppercase mb-4 text-[#DDDDDD]">{martialArts.primary.title}</h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                fact: 'p-3 border-l-2 border-black bg-[#121212]',
                term: 'text-xs tracking-[0.25em] uppercase text-[#888888]',
                value: 'text-sm mt-1 text-[#CCCCCC]',
                achievements: 'space-y-1',
                achievement: 'text-sm flex items-start gap-1.5 text-[#AAAAAA]',
              }}
              renderAchievement={(achievement) => (
                <>
                  <span className="text-[#888888]" aria-hidden="true">-</span>
                  {achievement}
                </>
              )}
            />
          </LimboCard>
        </div>
      </section>

      <ForestArt />
    </>
  )
}

function ProfessionSectionsFor({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianSections sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistSections sections={sections} />
  return <EngineerSections sections={sections} />
}

// =============================================================================
// MAIN THEME COMPONENT
// Layout: Header -> Profession figures -> the profession's sections with the limbo art between them
// -> Posts -> Contact
// =============================================================================

export default function SilhouetteTheme() {
  const view = useWorldView()

  return (
    <div
      className="min-h-screen relative"
      style={{
        // DARK like actual Limbo - almost pure black with slight gradient
        background: `linear-gradient(180deg, ${LIMBO.darkGrey1} 0%, ${LIMBO.voidBlack} 30%, ${LIMBO.voidBlack} 70%, ${LIMBO.darkGrey1} 100%)`,
        fontFamily: '"Courier New", Consolas, monospace',
        overflowX: 'hidden',
      }}
    >
      {/* Limbo atmospheric effects */}
      <LimboAtmosphere />

      {/* ========== HEADER - the recruiter first screen ========== */}
      <header className="relative z-30 p-6" role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-start gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] font-normal uppercase" style={{ color: LIMBO.fogWhite2 }}>
                  {name}
                </h1>
                <p className="text-sm tracking-[0.2em] mt-2" style={{ color: LIMBO.fogWhite1 }}>{headline}</p>
                <p className="text-sm tracking-wider mt-1 italic text-[#AAAAAA]">{tagline}</p>
                <p className="text-sm tracking-wider mt-2 text-[#CCCCCC]">{line}</p>
              </div>

              <nav className="flex flex-wrap gap-3 items-center" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${LIMBO_BUTTON} border-2 border-[#CCCCCC] text-[#CCCCCC] hover:bg-white hover:text-black`}>
                  resume
                </Link>
                <Link href="/personal-projects/game-engine" className={`${LIMBO_BUTTON} bg-[#CCCCCC] text-black hover:opacity-80`}>
                  enter
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Profession Selection */}
      <section className="relative z-20 py-8" aria-label="Select profession view">
        <ProfessionSwitch
          className="flex justify-center gap-8 sm:gap-14"
          label="Select profession view"
          renderOption={(option) => <SilhouetteFigure key={option.id} option={option} />}
        />
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <main className="relative z-20" role="main">
        <ProfessionSectionsFor sections={view.sections} />

        {/* ========== POSTS ========== */}
        <section className="px-6 py-8" aria-label="Posts">
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="posts" />
            <LimboCard>
              <div className="text-center py-6">
                <p className="text-sm" style={{ color: LIMBO.lightGrey2 }}>
                  Writings and thoughts coming soon...
                </p>
                <p className="text-xs mt-2 italic" style={{ color: LIMBO.lightGrey1 }}>
                  [ emerging from the void ]
                </p>
              </div>
            </LimboCard>
          </div>
        </section>

      </main>

      {/* ========== CONTACT CTA ========== */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-xl tracking-[0.3em] font-normal mb-3" style={{ color: LIMBO.fogWhite2 }}>
                  READY TO WORK TOGETHER?
                </h2>
                <p className="text-sm" style={{ color: LIMBO.lightGrey2 }}>{line}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${LIMBO_BUTTON} border-2 border-[#CCCCCC] text-[#CCCCCC] hover:bg-white hover:text-black`}>
                  Get the CV
                </Link>
              </div>
            </div>
          )}
        />
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-10 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
          <div className="w-6 h-px" style={{ background: `${LIMBO.midGrey1}` }} />
          <p className="text-xs tracking-[0.5em]" style={{ color: LIMBO.lightGrey1 }}>. . .</p>
          <div className="w-6 h-px" style={{ background: `${LIMBO.midGrey1}` }} />
        </div>
        <p className="text-xs" style={{ color: LIMBO.midGrey2 }}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>

      {/* =================================================================
          LIMBO CSS - OPTIMIZED FOR PERFORMANCE
          Only essential animations, using CSS transforms only (GPU accelerated)
          ================================================================= */}
      <style jsx global>{`
        /* ============ FOG DRIFT - Multiple layers ============ */
        @keyframes fog-drift-slow {
          0% { transform: translateX(-15%); }
          100% { transform: translateX(15%); }
        }
        .fog-drift-slow {
          animation: fog-drift-slow 90s ease-in-out infinite alternate;
        }

        @keyframes fog-drift-fast {
          0% { transform: translateX(10%); }
          100% { transform: translateX(-10%); }
        }
        .fog-drift-fast {
          animation: fog-drift-fast 60s ease-in-out infinite alternate;
        }

        @keyframes fog-rise {
          0% { transform: translateY(5%); opacity: 0.25; }
          50% { transform: translateY(-3%); opacity: 0.4; }
          100% { transform: translateY(5%); opacity: 0.25; }
        }
        .fog-rise {
          animation: fog-rise 40s ease-in-out infinite;
        }

        /* ============ FLOATING PARTICLES ============ */
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: ${LIMBO.lightGrey1};
          border-radius: 50%;
          opacity: 0;
        }
        @keyframes particle-float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .particle-1 { animation: particle-float 25s linear infinite; animation-delay: 0s; }
        .particle-2 { animation: particle-float 30s linear infinite; animation-delay: 4s; }
        .particle-3 { animation: particle-float 28s linear infinite; animation-delay: 8s; }
        .particle-4 { animation: particle-float 32s linear infinite; animation-delay: 12s; }
        .particle-5 { animation: particle-float 26s linear infinite; animation-delay: 2s; }
        .particle-6 { animation: particle-float 35s linear infinite; animation-delay: 6s; }
        .particle-7 { animation: particle-float 22s linear infinite; animation-delay: 10s; }
        .particle-8 { animation: particle-float 29s linear infinite; animation-delay: 14s; }

        /* ============ FILM GRAIN ============ */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-0.5%, 0.5%); }
          50% { transform: translate(0.5%, -0.5%); }
          75% { transform: translate(-0.5%, -0.5%); }
        }
        .grain {
          animation: grain 0.4s steps(4) infinite;
        }

        /* ============ SPIDER BREATHING - Subtle ============ */
        @keyframes spider-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .spider-breathe {
          animation: spider-breathe 4s ease-in-out infinite;
        }

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
          animation: gear-rotate 60s linear infinite;
        }
        .gear-rotate-medium {
          animation: gear-rotate-reverse 40s linear infinite;
        }

        /* ============ FIGURE EYE GLOW - For profession selector ============ */
        @keyframes figure-eye-glow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
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
          background: ${LIMBO.midGrey1};
          z-index: -1;
          transition: transform 0.15s ease;
          transform: translate(0, 0);
        }
        .limbo-btn:hover::after {
          transform: translate(2px, 2px);
        }
        .limbo-btn:hover {
          transform: translate(-1px, -1px);
        }
        .limbo-btn:active::after {
          transform: translate(-2px, -2px);
        }
        .limbo-btn:active {
          transform: translate(1px, 1px);
        }

        /* ============ ACCESSIBILITY - REDUCED MOTION ============ */
        @media (prefers-reduced-motion: reduce) {
          .fog-drift-slow,
          .fog-drift-fast,
          .fog-rise,
          .grain,
          .spider-breathe,
          .gear-rotate-slow,
          .gear-rotate-medium,
          .figure-eye,
          .particle,
          .particle-1, .particle-2, .particle-3, .particle-4,
          .particle-5, .particle-6, .particle-7, .particle-8 {
            animation: none !important;
          }
          .limbo-btn::after {
            transition: none !important;
          }
          .limbo-btn:hover,
          .limbo-btn:active {
            transform: none !important;
          }
          .limbo-btn:hover::after,
          .limbo-btn:active::after {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
