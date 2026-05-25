'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { getAchievementsByProfession, WORK_EXPERIENCE, type AchievementCategory } from '@/data/achievements'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useSmoothScroll, useScrollZones } from '@/hooks/useScrollAnimation'

// =============================================================================
// LIMBO-STYLE FOG AND ATMOSPHERIC EFFECTS
// Stark black silhouettes, grey/white backgrounds, film grain, eerie minimalism
// =============================================================================

// Fog layers with Limbo's characteristic grey mist
function FogLayers() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {/* Background fog - slowest drift - very light grey */}
      <div
        className="absolute inset-0 fog-drift-slow"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(200,200,200,0.2) 30%, rgba(220,220,220,0.25) 50%, rgba(200,200,200,0.2) 70%, transparent 100%)`,
        }}
      />
      {/* Mid fog layer - denser */}
      <div
        className="absolute inset-0 fog-drift-mid"
        style={{
          background: `linear-gradient(90deg, transparent 10%, rgba(180,180,180,0.15) 40%, rgba(200,200,200,0.2) 60%, transparent 90%)`,
        }}
      />
      {/* Foreground fog - subtle whisps */}
      <div
        className="absolute inset-0 fog-drift-fast"
        style={{
          background: `linear-gradient(90deg, transparent 20%, rgba(150,150,150,0.1) 50%, transparent 80%)`,
        }}
      />
      {/* Rising mist from bottom - Limbo's ground fog */}
      <div
        className="absolute bottom-0 left-0 right-0 h-80 mist-rise"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(180,180,180,0.4))`,
        }}
      />
      {/* Horizontal fog bands - industrial atmosphere */}
      <div
        className="absolute top-1/4 left-0 right-0 h-24 fog-drift-slow opacity-30"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(150,150,150,0.3), transparent)`,
        }}
      />
    </div>
  )
}

// Shadow realm vignette with heavy film grain - Limbo's noir aesthetic
function ShadowVignette() {
  return (
    <>
      {/* Heavy vignette - Limbo's dark edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      {/* Noir top/bottom gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      {/* Heavy film grain overlay - characteristic Limbo texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[6] opacity-30 grain mix-blend-multiply"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Secondary grain layer for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-[6] opacity-15 grain-secondary mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  )
}

// =============================================================================
// SPIDER WEB DECORATIONS - Iconic Limbo motif
// =============================================================================

function SpiderWebDecoration({ position, size = 200, opacity = 0.3 }: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number
  opacity?: number
}) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]',
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none z-[4]`}
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Radial web strands */}
        <g stroke="#000" strokeWidth="1" fill="none">
          <line x1="0" y1="0" x2="200" y2="200" />
          <line x1="0" y1="0" x2="200" y2="100" />
          <line x1="0" y1="0" x2="200" y2="50" />
          <line x1="0" y1="0" x2="100" y2="200" />
          <line x1="0" y1="0" x2="50" y2="200" />
          <line x1="0" y1="0" x2="150" y2="200" />
          <line x1="0" y1="0" x2="200" y2="150" />
        </g>
        {/* Concentric arcs - web rings */}
        <g stroke="#000" strokeWidth="0.5" fill="none">
          <path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20" />
          <path d="M40,40 Q80,25 120,40 Q135,80 120,120 Q80,135 40,120 Q25,80 40,40" />
          <path d="M60,60 Q110,40 160,60 Q180,110 160,160 Q110,180 60,160 Q40,110 60,60" />
          <path d="M80,80 Q140,55 200,80" />
          <path d="M80,80 Q55,140 80,200" />
        </g>
        {/* Dew drops - glinting highlights */}
        <g fill="#fff" opacity="0.6">
          <circle cx="30" cy="30" r="1" />
          <circle cx="60" cy="25" r="0.8" />
          <circle cx="90" cy="45" r="1" />
          <circle cx="45" cy="60" r="0.8" />
          <circle cx="120" cy="70" r="1" />
          <circle cx="70" cy="90" r="0.8" />
        </g>
      </svg>
    </div>
  )
}

// Creeping dark tendrils in corners - organic horror element
function CornerTendrils() {
  return (
    <>
      {/* Top left tendrils - gnarled branches */}
      <div
        className="fixed top-0 left-0 w-72 h-72 pointer-events-none z-[4] opacity-50"
        aria-hidden="true"
      >
        <svg viewBox="0 0 220 220" className="w-full h-full">
          <path
            d="M0,0 Q40,100 15,180 M0,20 Q60,110 35,200 M25,0 Q80,70 70,160 M0,50 Q50,130 20,220 M50,0 Q100,80 90,170"
            stroke="#000"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Smaller branches */}
          <path
            d="M30,80 Q45,90 35,110 M60,60 Q80,75 70,95 M40,120 Q55,135 45,155"
            stroke="#000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Top right tendrils */}
      <div
        className="fixed top-0 right-0 w-72 h-72 pointer-events-none z-[4] opacity-50 transform scale-x-[-1]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 220 220" className="w-full h-full">
          <path
            d="M0,0 Q40,100 15,180 M0,20 Q60,110 35,200 M25,0 Q80,70 70,160"
            stroke="#000"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  )
}

// =============================================================================
// INDUSTRIAL MACHINERY - Limbo's mechanical hazards
// =============================================================================

// Industrial gear decoration - slow rotating machinery
function IndustrialGear({ className, size = 60 }: { className?: string; size?: number }) {
  const teeth = 16
  return (
    <svg
      viewBox="0 0 100 100"
      className={`slow-rotate ${className || ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="30" fill="none" stroke="#000" strokeWidth="4" />
      <circle cx="50" cy="50" r="10" fill="#000" />
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i * 360 / teeth) * Math.PI / 180
        const x1 = 50 + 28 * Math.cos(angle)
        const y1 = 50 + 28 * Math.sin(angle)
        const x2 = 50 + 42 * Math.cos(angle)
        const y2 = 50 + 42 * Math.sin(angle)
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#000"
            strokeWidth="6"
            strokeLinecap="square"
          />
        )
      })}
    </svg>
  )
}

// Industrial machinery cluster
function IndustrialMachinery() {
  return (
    <div className="fixed bottom-0 right-0 pointer-events-none z-[3] opacity-20" aria-hidden="true">
      <div className="relative w-64 h-48">
        <div className="absolute bottom-4 right-4">
          <IndustrialGear size={80} />
        </div>
        <div className="absolute bottom-12 right-20 slow-rotate-reverse">
          <IndustrialGear size={50} />
        </div>
        <div className="absolute bottom-8 right-32">
          <IndustrialGear size={35} />
        </div>
        {/* Pipes and beams */}
        <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full">
          <rect x="150" y="0" width="8" height="150" fill="#000" />
          <rect x="120" y="80" width="50" height="6" fill="#000" />
          <rect x="100" y="120" width="80" height="8" fill="#000" />
        </svg>
      </div>
    </div>
  )
}

// Watching eyes in darkness - eerie ambient element
const EYES_DATA = [
  { id: 0, x: 12, y: 22, size: 2, delay: 0 },
  { id: 1, x: 88, y: 18, size: 2.5, delay: 1.5 },
  { id: 2, x: 8, y: 55, size: 1.8, delay: 3 },
  { id: 3, x: 92, y: 48, size: 2.2, delay: 2 },
  { id: 4, x: 15, y: 78, size: 2, delay: 4 },
  { id: 5, x: 85, y: 72, size: 2.3, delay: 1 },
]

function WatchingEyesDecoration() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3]" aria-hidden="true">
      {EYES_DATA.map((eye) => (
        <div
          key={eye.id}
          className="absolute eyes-fade"
          style={{
            left: `${eye.x}%`,
            top: `${eye.y}%`,
            animationDelay: `${eye.delay}s`,
          }}
        >
          <div className="flex gap-2">
            <div
              className="rounded-full"
              style={{
                width: eye.size,
                height: eye.size,
                backgroundColor: '#fff',
                boxShadow: '0 0 6px #fff, 0 0 12px rgba(255,255,255,0.4)',
              }}
            />
            <div
              className="rounded-full"
              style={{
                width: eye.size,
                height: eye.size,
                backgroundColor: '#fff',
                boxShadow: '0 0 6px #fff, 0 0 12px rgba(255,255,255,0.4)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Static boy silhouette decoration - the iconic Limbo protagonist
function BoySilhouetteDecoration() {
  return (
    <div
      className="fixed bottom-28 left-[12%] w-10 h-16 pointer-events-none z-[4] opacity-30 boy-walk"
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 70" className="w-full h-full">
        {/* Limbo boy - simple, iconic silhouette */}
        <ellipse cx="20" cy="10" rx="8" ry="9" fill="#000" />
        {/* Glowing eyes - the signature look */}
        <ellipse cx="17" cy="9" rx="1.5" ry="1" fill="#fff" />
        <ellipse cx="23" cy="9" rx="1.5" ry="1" fill="#fff" />
        {/* Body */}
        <path
          d="M20,19 L20,38 M20,24 L12,32 M20,24 L28,30 M20,38 L14,56 M20,38 L26,54"
          stroke="#000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

// =============================================================================
// SCROLL-TRIGGERED SHADOW SCENE - Limbo chase sequence
// =============================================================================

// Running figure silhouette - Limbo protagonist
function RunningFigure({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 70"
      className={`w-14 h-20 ${className || ''}`}
      aria-hidden="true"
      role="img"
    >
      <ellipse cx="20" cy="10" rx="7" ry="8" fill="#000" />
      {/* Glowing eyes */}
      <ellipse cx="17" cy="9" rx="1.2" ry="0.8" fill="#fff" />
      <ellipse cx="23" cy="9" rx="1.2" ry="0.8" fill="#fff" />
      {/* Body */}
      <path d="M20,18 L20,38" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M20,23 L11,29 M20,23 L27,33" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M20,38 L13,56" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M20,38 L27,54" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Giant spider - Limbo's iconic enemy
function ChasingSpider({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`transition-opacity duration-1000 ${isActive ? 'opacity-90 spider-crawl' : 'opacity-0'}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 150" className="w-44 h-32">
        {/* Spider body - menacing oval */}
        <ellipse cx="100" cy="75" rx="32" ry="22" fill="#000" />
        <ellipse cx="100" cy="55" rx="18" ry="13" fill="#000" />
        {/* Fangs - sharp, threatening */}
        <path d="M88,62 L82,78 M112,62 L118,78" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Eyes - multiple, glowing */}
        <circle cx="92" cy="50" r="3" fill="#fff" opacity="0.9" />
        <circle cx="108" cy="50" r="3" fill="#fff" opacity="0.9" />
        <circle cx="95" cy="44" r="1.5" fill="#fff" opacity="0.6" />
        <circle cx="105" cy="44" r="1.5" fill="#fff" opacity="0.6" />
        <circle cx="100" cy="47" r="2" fill="#fff" opacity="0.7" />
        {/* Legs - articulated, menacing */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`legs-${i}`}>
            <path
              d={`M68,${58 + i * 10} Q${36 - i * 5},${48 + i * 15} ${16 - i * 3},${98 + i * 12}`}
              stroke="#000"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              className="spider-leg"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
            <path
              d={`M132,${58 + i * 10} Q${164 + i * 5},${48 + i * 15} ${184 + i * 3},${98 + i * 12}`}
              stroke="#000"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              className="spider-leg"
              style={{ animationDelay: `${(i + 4) * 0.08}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

// Swinging saw blade trap
function SwingingTrap({ isActive, delay = 0 }: { isActive: boolean; delay?: number }) {
  return (
    <div
      className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <div className={`origin-top ${isActive ? 'pendulum-swing' : ''}`}>
        <div className="w-1 h-14 bg-black mx-auto" />
        <svg viewBox="0 0 60 60" className="w-10 h-10 slow-rotate">
          <circle cx="30" cy="30" r="18" fill="none" stroke="#000" strokeWidth="3" />
          <circle cx="30" cy="30" r="6" fill="#000" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            return (
              <path
                key={i}
                d={`M${30 + 16 * Math.cos(angle)},${30 + 16 * Math.sin(angle)} L${30 + 26 * Math.cos(angle + 0.15)},${30 + 26 * Math.sin(angle + 0.15)} L${30 + 16 * Math.cos(angle + 0.3)},${30 + 16 * Math.sin(angle + 0.3)}`}
                fill="#000"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// Bear trap - snapping hazard
function SnappingHazard({ isTriggered }: { isTriggered: boolean }) {
  return (
    <div className="transition-transform duration-200" aria-hidden="true">
      <svg viewBox="0 0 50 40" className="w-8 h-6">
        <rect x="12" y="32" width="26" height="4" fill="#000" />
        <path
          d={`M25,32 L12,${isTriggered ? 32 : 14} L8,${isTriggered ? 32 : 10} L18,32`}
          fill="#000"
          className="transition-all duration-200"
        />
        <path
          d={`M25,32 L38,${isTriggered ? 32 : 14} L42,${isTriggered ? 32 : 10} L32,32`}
          fill="#000"
          className="transition-all duration-200"
        />
      </svg>
    </div>
  )
}

// Scene eyes that fade in/out
function SceneEyes() {
  const eyePositions = [
    { x: 8, y: 18 }, { x: 88, y: 12 }, { x: 22, y: 68 },
    { x: 78, y: 62 }, { x: 48, y: 8 }, { x: 12, y: 42 },
    { x: 32, y: 32 }, { x: 68, y: 48 }, { x: 18, y: 52 },
    { x: 82, y: 38 },
  ]

  return (
    <>
      {eyePositions.map((pos, i) => (
        <div
          key={i}
          className="absolute z-[22] eyes-fade pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animationDelay: `${i * 0.6}s`,
          }}
          aria-hidden="true"
        >
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: '0 0 8px #fff, 0 0 16px rgba(255,255,255,0.4)' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: '0 0 8px #fff, 0 0 16px rgba(255,255,255,0.4)' }} />
          </div>
        </div>
      ))}
    </>
  )
}

// Main scroll scene - Limbo chase sequence
function ScrollShadowScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollProgress } = useSmoothScroll(0.08)

  // One-time triggers for scroll zones
  const triggeredZones = useScrollZones([0.1, 0.25, 0.4, 0.55, 0.7])

  // Calculate boy position with CSS transition for smoothness
  const boyPosition = Math.min(85, 10 + scrollProgress * 75)

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: '120vh',
        background: 'linear-gradient(180deg, #9a9a9a 0%, #6a6a6a 20%, #454545 50%, #2a2a2a 80%, #1a1a1a 100%)',
      }}
      aria-label="Interactive scroll scene inspired by Limbo game"
    >
      {/* Scene title - fades out */}
      <div
        className="sticky top-4 left-0 right-0 text-center z-30 pointer-events-none transition-opacity duration-500"
        style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
      >
        <span className="text-sm tracking-[0.5em] uppercase" style={{ color: '#888' }}>
          [ scroll to explore ]
        </span>
      </div>

      {/* Heavy scene vignette */}
      <div
        className="sticky top-0 left-0 right-0 h-screen pointer-events-none z-[15]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 15%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.75) 90%)',
        }}
        aria-hidden="true"
      />

      {/* The scene - sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ground line */}
        <div
          className="absolute left-0 right-0 h-px bottom-1/4 z-[21]"
          style={{ background: 'rgba(200,200,200,0.25)' }}
          aria-hidden="true"
        />

        {/* Eyes - CSS animation fade in/out */}
        <SceneEyes />

        {/* Trap hazards */}
        <div className="absolute bottom-1/4 left-0 right-0 h-20 z-[23]" aria-hidden="true">
          <div className="absolute" style={{ left: '25%', top: '-20px' }}>
            <SwingingTrap isActive={triggeredZones.has(0.25)} delay={0} />
          </div>
          <div className="absolute" style={{ left: '50%', top: '-20px' }}>
            <SwingingTrap isActive={triggeredZones.has(0.4)} delay={200} />
          </div>
          <div className="absolute" style={{ left: '75%', top: '-20px' }}>
            <SwingingTrap isActive={triggeredZones.has(0.55)} delay={400} />
          </div>

          {/* Snapping hazards on ground */}
          <div className="absolute bottom-0" style={{ left: '20%' }}>
            <SnappingHazard isTriggered={triggeredZones.has(0.25)} />
          </div>
          <div className="absolute bottom-0" style={{ left: '45%' }}>
            <SnappingHazard isTriggered={triggeredZones.has(0.4)} />
          </div>
          <div className="absolute bottom-0" style={{ left: '70%' }}>
            <SnappingHazard isTriggered={triggeredZones.has(0.55)} />
          </div>
        </div>

        {/* Running figure */}
        <div
          className="absolute bottom-1/4 z-[25] transition-all duration-300 ease-out"
          style={{
            left: `${boyPosition}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <RunningFigure className="figure-run" />
        </div>

        {/* Giant spider */}
        <div
          className="absolute bottom-1/4 z-[24] transition-all duration-500 ease-out"
          style={{
            left: `${Math.max(5, boyPosition - 18)}%`,
          }}
        >
          <ChasingSpider isActive={triggeredZones.has(0.1)} />
        </div>

        {/* Edge tendrils */}
        <div className="absolute top-0 left-0 w-44 h-56 opacity-60 z-[21] tendril-sway" aria-hidden="true">
          <svg viewBox="0 0 150 200" className="w-full h-full">
            <path d="M0,0 Q45,110 25,200" stroke="#000" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M0,35 Q65,130 45,200" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-44 h-56 opacity-60 transform scale-x-[-1] tendril-sway-reverse" aria-hidden="true">
          <svg viewBox="0 0 150 200" className="w-full h-full">
            <path d="M0,0 Q45,110 25,200" stroke="#000" strokeWidth="7" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-3 transition-colors duration-300"
              style={{
                background: scrollProgress > (i + 1) / 5 ? '#666' : '#333',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// CV CONTENT COMPONENTS - Styled for Limbo's noir aesthetic
// =============================================================================

// Silhouette figure for profession selection
function SilhouetteFigure({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const figures = {
    engineer: { hint: 'the architect', ariaLabel: 'Select engineer profession' },
    drummer: { hint: 'the artist', ariaLabel: 'Select drummer profession' },
    fighter: { hint: 'the warrior', ariaLabel: 'Select fighter profession' },
  }
  const figure = figures[profession]

  return (
    <button
      onClick={onClick}
      aria-label={figure.ariaLabel}
      aria-pressed={isActive}
      className={`relative transition-all duration-500 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
        isActive ? 'scale-110' : 'opacity-35 hover:opacity-60'
      }`}
    >
      {/* Silhouette figure */}
      <div className="relative w-20 h-28">
        <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
          {profession === 'engineer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              {/* Eyes */}
              <ellipse cx="27" cy="11" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="33" cy="11" rx="1.5" ry="1" fill="#fff" />
              <rect x="15" y="23" width="30" height="35" fill="#000" rx="3" />
              <rect x="10" y="58" width="10" height="20" fill="#000" />
              <rect x="40" y="58" width="10" height="20" fill="#000" />
              {/* Laptop */}
              <rect x="20" y="28" width="20" height="12" fill={isActive ? '#444' : '#222'} rx="1" />
              <rect x="18" y="40" width="24" height="3" fill={isActive ? '#333' : '#111'} />
            </>
          )}
          {profession === 'drummer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              {/* Eyes */}
              <ellipse cx="27" cy="11" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="33" cy="11" rx="1.5" ry="1" fill="#fff" />
              <path d="M20,23 L40,23 L38,50 L22,50 Z" fill="#000" />
              <rect x="12" y="50" width="8" height="20" fill="#000" />
              <rect x="40" y="50" width="8" height="20" fill="#000" />
              {/* Drumsticks */}
              <line x1="8" y1="18" x2="2" y2="38" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="18" x2="58" y2="38" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {profession === 'fighter' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              {/* Eyes */}
              <ellipse cx="27" cy="11" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="33" cy="11" rx="1.5" ry="1" fill="#fff" />
              <path d="M18,23 L42,23 L40,50 L20,50 Z" fill="#000" />
              <rect x="14" y="50" width="10" height="22" fill="#000" />
              <rect x="36" y="50" width="10" height="22" fill="#000" />
              {/* Fighting stance fists */}
              <path d="M4,28 L18,24 L20,34 L6,36 Z" fill="#000" />
              <path d="M56,28 L42,24 L40,34 L54,36 Z" fill="#000" />
            </>
          )}
        </svg>
      </div>

      {/* Spotlight glow behind active */}
      {isActive && (
        <div
          className="absolute inset-0 -z-10 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.35), transparent 55%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Label */}
      <span
        className="block mt-2 text-xs tracking-[0.3em] uppercase"
        style={{ color: isActive ? '#e0e0e0' : '#666' }}
      >
        {figure.hint}
      </span>
    </button>
  )
}

// Minimal text block with stark noir border
function TextBlock({ children, ariaLabel }: { children: React.ReactNode; ariaLabel?: string }) {
  return (
    <div
      className="p-6 relative"
      style={{
        background: 'rgba(30,30,30,0.85)',
        borderLeft: '3px solid #000',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
      }}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20" aria-hidden="true" />
      {children}
    </div>
  )
}

// Tech tag in stark monochrome
function TechTag({ name }: { name: string }) {
  return (
    <span
      className="inline-block px-2 py-1 text-xs tracking-wider uppercase transition-all hover:bg-white hover:text-black"
      style={{
        background: 'transparent',
        border: '1px solid #888',
        color: '#c0c0c0',
      }}
    >
      {name}
    </span>
  )
}

// Tech Cloud for engineer - all technologies (no skill bars)
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-5" role="list" aria-label="Technical skills by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-[0.3em] uppercase mb-2 flex items-center gap-2"
            style={{ color: '#888' }}
          >
            <span className="text-sm grayscale">{category.icon}</span>
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

// Achievement-based list for drummer/fighter - NO meaningless skill bars
function AchievementsList({ categories }: { categories: AchievementCategory[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6" role="list" aria-label="Achievements by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-2"
            style={{ color: '#888' }}
          >
            <span className="text-sm grayscale">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2">
            {category.achievements.map((achievement) => (
              <li key={achievement.title} style={{ color: '#c0c0c0' }}>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: '#666' }} aria-hidden="true">-</span>
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
                    <span className="text-xs" style={{ color: '#666' }}>
                      {achievement.metric}
                    </span>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-xs ml-3 mt-0.5" style={{ color: '#777' }}>
                    {achievement.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Company card - stark noir style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      style={{
        background: '#1a1a1a',
        border: '2px solid #000',
        boxShadow: '3px 3px 0 #000',
      }}
    >
      <div className="flex items-start gap-2 mb-1.5">
        <span className="text-lg grayscale contrast-200">{company.icon}</span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: '#d0d0d0' }}>
            {company.name}
          </h4>
          <p className="text-xs tracking-wider" style={{ color: '#888' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#a0a0a0' }}>{company.description}</p>
    </a>
  )
}

// Band card - stark noir style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 group"
      style={{
        background: '#1a1a1a',
        border: '2px solid #000',
        boxShadow: '3px 3px 0 #000',
      }}
    >
      <h4 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: '#d0d0d0' }}>
        {band.name}
      </h4>
      <p className="text-xs tracking-wider mt-0.5" style={{ color: '#888' }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-sm leading-relaxed mt-1.5" style={{ color: '#a0a0a0' }}>{band.description}</p>
      {!band.url && (
        <p className="text-xs mt-1.5 uppercase tracking-wider" style={{ color: '#555' }}>
          [ website coming ]
        </p>
      )}
    </div>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {content}
      </a>
    )
  }
  return content
}

// Experience card - stark minimalist style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4"
      style={{
        background: 'rgba(30,30,30,0.85)',
        borderLeft: '3px solid #000',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h4
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: '#d0d0d0' }}
          >
            {entry.title}
          </h4>
          <p
            className="text-xs tracking-wider mt-0.5"
            style={{ color: '#999' }}
          >
            {entry.organization}
          </p>
        </div>
        <span
          className="text-xs tracking-wider uppercase"
          style={{ color: '#777' }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p
        className="text-sm leading-relaxed mt-2"
        style={{ color: '#a0a0a0' }}
      >
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-1.5"
              style={{ color: '#b0b0b0' }}
            >
              <span style={{ color: '#666' }} aria-hidden="true">-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project shadow box - memoized to prevent unnecessary re-renders
const ShadowBox = React.memo(function ShadowBox({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), 300 + index * 150)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [index])

  return (
    <article
      className={`p-4 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        background: '#1a1a1a',
        border: '2px solid #000',
        boxShadow: '5px 5px 0 #000',
      }}
    >
      {project.featured && (
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#666' }}>
          [ featured ]
        </span>
      )}
      <h3 className="text-xs font-bold mt-0.5 uppercase tracking-wider" style={{ color: '#d0d0d0' }}>
        {project.name}
      </h3>
      <p className="text-xs mt-0.5" style={{ color: '#888' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-xs mt-1.5 italic" style={{ color: '#a0a0a0' }}>
          {'->'} {project.impact}
        </p>
      )}
      <div className="flex gap-1.5 flex-wrap mt-2">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-1.5 py-0.5 uppercase tracking-wider"
            style={{
              background: '#000',
              color: '#aaa',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
})

// Floating text that appears mysteriously - memoized
const FloatingText = React.memo(function FloatingText({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [delay])

  return (
    <span
      className={`inline-block transition-all duration-1000 ${
        visible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
      }`}
    >
      {text}
    </span>
  )
})

// Section header with divider lines
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-white/20" aria-hidden="true" />
      <h2
        className="text-xs tracking-[0.4em] uppercase"
        style={{ color: '#999' }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px bg-white/20" aria-hidden="true" />
    </div>
  )
}

// =============================================================================
// MAIN THEME COMPONENT
// =============================================================================

export default function SilhouetteTheme() {
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerSkills = getEngineerSkills()
  const achievements = getAchievementsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #b8b8b8 0%, #909090 30%, #787878 60%, #606060 100%)',
        fontFamily: '"Courier New", Consolas, monospace',
        overflowX: 'hidden',
      }}
    >
      {/* Limbo atmospheric effects */}
      <FogLayers />
      <ShadowVignette />
      <SpiderWebDecoration position="top-left" size={180} opacity={0.25} />
      <SpiderWebDecoration position="top-right" size={160} opacity={0.2} />
      <CornerTendrils />
      <IndustrialMachinery />
      <WatchingEyesDecoration />
      <BoySilhouetteDecoration />

      {/* Dark content overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.2) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-3xl mx-auto flex justify-between items-start">
          <div>
            {/* Name */}
            <h1 className="text-2xl tracking-[0.5em] font-normal" style={{ color: '#1a1a1a' }}>
              <FloatingText text="ALEXANDER" delay={0} />
              <FloatingText text=" " delay={400} />
              <FloatingText text="PULIDO" delay={600} />
            </h1>
            {/* Professional headline from PROFESSIONAL_SUMMARY */}
            <p className="text-xs tracking-[0.2em] mt-2" style={{ color: '#333' }}>
              <FloatingText text={PROFESSIONAL_SUMMARY.headline} delay={1000} />
            </p>
            {/* Tagline */}
            <p className="text-xs tracking-wider mt-1 italic" style={{ color: '#555' }}>
              <FloatingText text={PROFESSIONAL_SUMMARY.tagline} delay={1400} />
            </p>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="limbo-btn px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-all hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              style={{
                background: 'transparent',
                border: '2px solid #000',
                color: '#1a1a1a',
              }}
            >
              resume
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="limbo-btn limbo-btn-solid px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-all hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                background: '#000',
                color: '#ccc',
              }}
            >
              enter
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Current Roles Section */}
      <section className="relative z-20 py-4 px-6" aria-label="Current professional roles">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role, i) => (
              <div
                key={role.id}
                className="text-center fade-in"
                style={{ animationDelay: `${1600 + i * 200}ms` }}
              >
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#1a1a1a' }}>
                  {role.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#555' }}>
                  {role.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Selection */}
      <section className="relative z-20 py-10" aria-label="Select profession view">
        <div className="flex justify-center gap-16">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <SilhouetteFigure
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
            />
          ))}
        </div>
        <p className="text-center mt-4 text-xs tracking-[0.3em] uppercase" style={{ color: '#666' }}>
          {config.title.toLowerCase()}
        </p>
      </section>

      {/* Scroll-triggered shadow realm scene */}
      <ScrollShadowScene />

      {/* Main content */}
      <main className="relative z-20 px-6 py-6" role="main">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* About Section */}
          <section aria-label="About">
            <SectionHeader title="about" />
            <TextBlock ariaLabel="Biography">
              <p className="text-sm leading-relaxed" style={{ color: '#c0c0c0' }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-xs tracking-wider uppercase"
                    style={{ color: '#999' }}
                  >
                    - {fact}
                  </span>
                ))}
              </div>
            </TextBlock>
          </section>

          {/* Work Experience Section */}
          {experience.length > 0 && (
            <section aria-label="Work experience">
              <SectionHeader title="work experience" />
              <div className="space-y-3">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack / Skills Section */}
          <section aria-label={active === 'engineer' ? 'Technical skills' : 'Skills and achievements'}>
            <SectionHeader title={active === 'engineer' ? 'tech stack' : 'skills'} />
            <TextBlock>
              {active === 'engineer' ? (
                <TechCloud categories={engineerSkills} />
              ) : (
                <AchievementsList categories={achievements} />
              )}
            </TextBlock>
          </section>

          {/* Projects Section */}
          <section aria-label="Featured projects">
            <SectionHeader title="featured work" />
            <div className="grid md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project, i) => (
                <ShadowBox key={project.id} project={project} index={i} />
              ))}
            </div>
          </section>

          {/* Companies Section (Engineer mode) */}
          {active === 'engineer' && (
            <section aria-label="Companies">
              <SectionHeader title="companies" />
              <div className="grid md:grid-cols-3 gap-3">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {/* Bands Section (Drummer mode) */}
          {active === 'drummer' && (
            <section aria-label="Musical projects">
              <SectionHeader title="bands" />
              <div className="grid md:grid-cols-3 gap-3">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          <div className="w-6 h-px bg-black/30" />
          <p className="text-xs tracking-[0.5em]" style={{ color: '#777' }}>
            . . .
          </p>
          <div className="w-6 h-px bg-black/30" />
        </div>
      </footer>

      {/* =================================================================
          LIMBO-STYLE CSS ANIMATIONS
          Pure black/white/grey, film grain, fog, eerie minimalism
          ================================================================= */}
      <style jsx global>{`
        /* =================================================================
           FOG AND MIST - Limbo's atmospheric drifting
           ================================================================= */
        @keyframes fog-drift-slow {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        @keyframes fog-drift-mid {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        @keyframes fog-drift-fast {
          0% { transform: translateX(-70%); }
          100% { transform: translateX(70%); }
        }
        @keyframes mist-rise {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 0.55; transform: translateY(-25px); }
        }
        .fog-drift-slow {
          animation: fog-drift-slow 65s ease-in-out infinite alternate;
        }
        .fog-drift-mid {
          animation: fog-drift-mid 45s ease-in-out infinite alternate;
        }
        .fog-drift-fast {
          animation: fog-drift-fast 28s ease-in-out infinite alternate;
        }
        .mist-rise {
          animation: mist-rise 10s ease-in-out infinite;
        }

        /* =================================================================
           FILM GRAIN - Heavy Limbo texture
           ================================================================= */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(1%, 2%); }
          30% { transform: translate(-1%, -1%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(1%, -1%); }
          70% { transform: translate(-1%, 2%); }
          80% { transform: translate(2%, 1%); }
          90% { transform: translate(-2%, -1%); }
        }
        @keyframes grain-secondary {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          25% { transform: translate(1%, -1%) scale(1.1); }
          50% { transform: translate(-1%, 1%) scale(1.1); }
          75% { transform: translate(1%, 1%) scale(1.1); }
        }
        .grain {
          animation: grain 0.35s steps(10) infinite;
        }
        .grain-secondary {
          animation: grain-secondary 0.5s steps(8) infinite;
        }

        /* =================================================================
           EYES - Eerie watching presence
           ================================================================= */
        @keyframes eyes-fade {
          0%, 100% { opacity: 0; }
          15%, 85% { opacity: 0.5; }
          50% { opacity: 0.25; }
        }
        .eyes-fade {
          animation: eyes-fade 7s ease-in-out infinite;
        }

        /* =================================================================
           MECHANICAL ELEMENTS - Industrial machinery
           ================================================================= */
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slow-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .slow-rotate {
          animation: slow-rotate 35s linear infinite;
        }
        .slow-rotate-reverse {
          animation: slow-rotate-reverse 25s linear infinite;
        }

        /* =================================================================
           BOY SILHOUETTE - Limbo protagonist wandering
           ================================================================= */
        @keyframes boy-walk {
          0%, 100% { transform: translateX(0) scaleX(1); }
          49% { transform: translateX(25px) scaleX(1); }
          50% { transform: translateX(25px) scaleX(-1); }
          99% { transform: translateX(0) scaleX(-1); }
        }
        .boy-walk {
          animation: boy-walk 14s ease-in-out infinite;
        }

        /* =================================================================
           FADE IN - Mysterious appearance
           ================================================================= */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        /* =================================================================
           SCROLL SCENE ANIMATIONS
           ================================================================= */

        /* Running figure - continuous run cycle */
        @keyframes figure-run {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-2px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-1px); }
        }
        .figure-run {
          animation: figure-run 0.25s ease-in-out infinite;
        }

        /* Spider crawl - menacing idle */
        @keyframes spider-crawl {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.015); }
        }
        .spider-crawl {
          animation: spider-crawl 2.5s ease-in-out infinite;
        }

        /* Spider leg movement */
        @keyframes spider-leg {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .spider-leg {
          animation: spider-leg 0.4s ease-in-out infinite;
        }

        /* Pendulum swing - ominous swinging traps */
        @keyframes pendulum-swing {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
        .pendulum-swing {
          animation: pendulum-swing 2.2s ease-in-out infinite;
        }

        /* Tendril sway - organic horror */
        @keyframes tendril-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(1.5deg); }
        }
        @keyframes tendril-sway-reverse {
          0%, 100% { transform: scaleX(-1) translateX(0) rotate(0deg); }
          50% { transform: scaleX(-1) translateX(-8px) rotate(-1.5deg); }
        }
        .tendril-sway {
          animation: tendril-sway 4.5s ease-in-out infinite;
        }
        .tendril-sway-reverse {
          animation: tendril-sway-reverse 5s ease-in-out infinite;
        }

        /* =================================================================
           BUTTON EFFECTS - Noir shadow style
           ================================================================= */
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
          background: #000;
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

        .limbo-btn-solid::after {
          background: #444;
        }

        /* =================================================================
           ACCESSIBILITY - Reduced motion support
           ================================================================= */
        @media (prefers-reduced-motion: reduce) {
          .fade-in,
          .figure-run,
          .spider-crawl,
          .spider-leg,
          .pendulum-swing,
          .tendril-sway,
          .tendril-sway-reverse,
          .fog-drift-slow,
          .fog-drift-mid,
          .fog-drift-fast,
          .mist-rise,
          .eyes-fade,
          .slow-rotate,
          .slow-rotate-reverse,
          .boy-walk,
          .grain,
          .grain-secondary,
          .limbo-btn {
            animation: none !important;
          }
          .fade-in {
            opacity: 1;
          }
          .limbo-btn::after {
            transition: none;
          }
          /* Keep elements visible but static */
          .eyes-fade {
            opacity: 0.4;
          }
          .spider-crawl {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  )
}
