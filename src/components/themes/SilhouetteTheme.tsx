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
// FOG AND ATMOSPHERIC EFFECTS - CSS animation loops (no scroll binding)
// =============================================================================

// Fog layers that loop continuously via CSS keyframes
function FogLayers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Background fog - slowest drift */}
      <div
        className="absolute inset-0 animate-fog-drift-slow"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(180,180,180,0.15) 30%, rgba(200,200,200,0.2) 50%, rgba(180,180,180,0.15) 70%, transparent 100%)`,
        }}
      />
      {/* Mid fog layer */}
      <div
        className="absolute inset-0 animate-fog-drift-mid"
        style={{
          background: `linear-gradient(90deg, transparent 10%, rgba(150,150,150,0.1) 40%, rgba(170,170,170,0.15) 60%, transparent 90%)`,
        }}
      />
      {/* Foreground fog - fastest */}
      <div
        className="absolute inset-0 animate-fog-drift-fast"
        style={{
          background: `linear-gradient(90deg, transparent 20%, rgba(100,100,100,0.08) 50%, transparent 80%)`,
        }}
      />
      {/* Rising mist from bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 animate-mist-rise"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(200,200,200,0.3))`,
        }}
      />
    </div>
  )
}

// Shadow realm vignette with film grain - CSS animation loops
// Reduced opacity so content is readable
function ShadowVignette() {
  return (
    <>
      {/* Soft vignette - light edges only */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      {/* Very subtle top/bottom fade */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)',
        }}
      />
      {/* Film grain overlay - reduced opacity */}
      <div
        className="fixed inset-0 pointer-events-none z-[6] opacity-20 animate-grain mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  )
}

// =============================================================================
// DECORATIVE SILHOUETTES - Static or CSS-animated elements
// =============================================================================

// Creeping tendrils in corners (generic, not game-specific)
function CornerTendrils() {
  return (
    <>
      {/* Top left tendrils */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-[4] opacity-60">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M0,0 Q30,80 10,150 M0,20 Q50,90 30,180 M20,0 Q70,60 60,140"
            stroke="#000"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Top right tendrils */}
      <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none z-[4] opacity-60 transform scale-x-[-1]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M0,0 Q30,80 10,150 M0,20 Q50,90 30,180 M20,0 Q70,60 60,140"
            stroke="#000"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Bottom tendril hint */}
      <div className="fixed bottom-0 left-1/4 w-32 h-48 pointer-events-none z-[4] opacity-40">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <path
            d="M50,150 Q30,100 40,50 M50,150 Q70,90 60,30"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  )
}

// Danger decorations - subtle hazard hints (generic)
function DangerDecorations() {
  return (
    <>
      {/* Jagged shape - bottom left */}
      <div className="fixed bottom-8 left-8 w-24 h-16 pointer-events-none z-[3] opacity-30">
        <svg viewBox="0 0 80 50" className="w-full h-full">
          <path
            d="M10,25 L0,10 L10,25 L10,40 M70,25 L80,10 L70,25 L70,40 M10,25 L30,15 L40,25 L50,15 L70,25"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15,40 L65,40"
            stroke="#000"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
      {/* Rotating gear/blade - bottom right - CSS animation loop */}
      <div className="fixed bottom-16 right-16 w-20 h-20 pointer-events-none z-[3] opacity-25 animate-slow-rotate">
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <circle cx="30" cy="30" r="20" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="30" cy="30" r="8" fill="#000" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d={`M30,30 L${30 + 25 * Math.cos((i * 30 * Math.PI) / 180)},${30 + 25 * Math.sin((i * 30 * Math.PI) / 180)}`}
              stroke="#000"
              strokeWidth="3"
              fill="none"
              transform={`rotate(${i * 30} 30 30)`}
            />
          ))}
        </svg>
      </div>
    </>
  )
}

// Watching eyes in darkness - CSS animation loops for fade/blink
// Pre-defined positions to avoid hydration mismatch
const EYES_DATA = [
  { id: 0, x: 15, y: 25, size: 2.5, delay: 0 },
  { id: 1, x: 35, y: 45, size: 3, delay: 1.2 },
  { id: 2, x: 55, y: 30, size: 2.8, delay: 2.5 },
  { id: 3, x: 75, y: 50, size: 3.5, delay: 0.8 },
  { id: 4, x: 25, y: 65, size: 2.2, delay: 3.1 },
  { id: 5, x: 65, y: 70, size: 3.2, delay: 1.8 },
  { id: 6, x: 45, y: 35, size: 2.6, delay: 4.2 },
  { id: 7, x: 85, y: 55, size: 2.9, delay: 2.0 },
]

function WatchingEyesDecoration() {
  const eyes = EYES_DATA

  return (
    <div className="fixed inset-0 pointer-events-none z-[3]">
      {eyes.map((eye) => (
        <div
          key={eye.id}
          className="absolute animate-eyes-fade"
          style={{
            left: `${eye.x}%`,
            top: `${eye.y}%`,
            animationDelay: `${eye.delay}s`,
          }}
        >
          <div className="flex gap-3">
            <div
              className="rounded-full"
              style={{
                width: eye.size,
                height: eye.size,
                backgroundColor: '#fff',
                boxShadow: '0 0 8px #fff, 0 0 16px rgba(255,255,255,0.5)',
              }}
            />
            <div
              className="rounded-full"
              style={{
                width: eye.size,
                height: eye.size,
                backgroundColor: '#fff',
                boxShadow: '0 0 8px #fff, 0 0 16px rgba(255,255,255,0.5)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Static boy silhouette decoration - CSS walk animation
function BoySilhouetteDecoration() {
  return (
    <div className="fixed bottom-32 left-[15%] w-12 h-20 pointer-events-none z-[4] opacity-40 animate-boy-walk">
      <svg viewBox="0 0 40 70" className="w-full h-full">
        {/* Simple running figure silhouette */}
        <ellipse cx="20" cy="10" rx="8" ry="9" fill="#000" />
        <path
          d="M20,19 L20,40 M20,25 L10,35 M20,25 L30,32 M20,40 L12,60 M20,40 L28,58"
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
// SCROLL SHADOW SCENE - Simplified chase sequence with smooth CSS transitions
// =============================================================================

// Running figure silhouette with CSS animation for run cycle
function RunningFigure({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 70" className={`w-16 h-24 ${className || ''}`} aria-hidden="true">
      <ellipse cx="20" cy="10" rx="7" ry="8" fill="#000" />
      <path d="M20,18 L20,40" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M20,24 L10,30 M20,24 L28,35" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M20,40 L12,60" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M20,40 L28,58" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Giant spider with CSS idle animation (triggered once, then loops)
function ChasingSpider({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`transition-opacity duration-1000 ${isActive ? 'opacity-90 animate-spider-crawl' : 'opacity-0'}`}
    >
      <svg viewBox="0 0 200 150" className="w-48 h-36">
        {/* Spider body */}
        <ellipse cx="100" cy="75" rx="35" ry="25" fill="#000" />
        <ellipse cx="100" cy="55" rx="20" ry="15" fill="#000" />
        {/* Fangs */}
        <path d="M90,65 L85,80 M110,65 L115,80" stroke="#000" strokeWidth="4" fill="none" />
        {/* Eyes */}
        <circle cx="92" cy="50" r="4" fill="#fff" opacity="0.8" />
        <circle cx="108" cy="50" r="4" fill="#fff" opacity="0.8" />
        <circle cx="95" cy="45" r="2" fill="#fff" opacity="0.6" />
        <circle cx="105" cy="45" r="2" fill="#fff" opacity="0.6" />
        {/* Legs - animated via CSS */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`legs-${i}`}>
            <path
              d={`M70,${60 + i * 10} Q${40 - i * 5},${50 + i * 15} ${20 - i * 3},${100 + i * 15}`}
              stroke="#000"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="animate-spider-leg"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
            <path
              d={`M130,${60 + i * 10} Q${160 + i * 5},${50 + i * 15} ${180 + i * 3},${100 + i * 15}`}
              stroke="#000"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="animate-spider-leg"
              style={{ animationDelay: `${(i + 4) * 0.1}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

// Swinging pendulum trap - CSS animation loop once triggered
function SwingingTrap({ isActive, delay = 0 }: { isActive: boolean; delay?: number }) {
  return (
    <div
      className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`origin-top ${isActive ? 'animate-pendulum-swing' : ''}`}>
        <div className="w-1 h-16 bg-black mx-auto" />
        <svg viewBox="0 0 60 60" className="w-12 h-12 animate-slow-rotate">
          <circle cx="30" cy="30" r="20" fill="none" stroke="#000" strokeWidth="3" />
          <circle cx="30" cy="30" r="8" fill="#000" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            return (
              <path
                key={i}
                d={`M${30 + 18 * Math.cos(angle)},${30 + 18 * Math.sin(angle)} L${30 + 28 * Math.cos(angle + 0.15)},${30 + 28 * Math.sin(angle + 0.15)} L${30 + 18 * Math.cos(angle + 0.3)},${30 + 18 * Math.sin(angle + 0.3)}`}
                fill="#000"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// Snapping hazard - triggered once then stays closed
function SnappingHazard({ isTriggered }: { isTriggered: boolean }) {
  return (
    <div className="transition-transform duration-200">
      <svg viewBox="0 0 50 40" className="w-10 h-8">
        <rect x="10" y="30" width="30" height="5" fill="#000" />
        <path
          d={`M25,30 L10,${isTriggered ? 30 : 12} L5,${isTriggered ? 30 : 10} L15,30`}
          fill="#000"
          className="transition-all duration-200"
        />
        <path
          d={`M25,30 L40,${isTriggered ? 30 : 12} L45,${isTriggered ? 30 : 10} L35,30`}
          fill="#000"
          className="transition-all duration-200"
        />
      </svg>
    </div>
  )
}

// Scene eyes that fade in/out via CSS animation (not scroll-bound)
// Added z-[22] to appear above the scene vignette (z-20)
function SceneEyes() {
  const eyePositions = [
    { x: 10, y: 20 }, { x: 85, y: 15 }, { x: 25, y: 70 },
    { x: 75, y: 65 }, { x: 50, y: 10 }, { x: 15, y: 45 },
    { x: 35, y: 35 }, { x: 65, y: 50 }, { x: 20, y: 55 },
    { x: 80, y: 40 }, { x: 45, y: 80 }, { x: 55, y: 25 },
  ]

  return (
    <>
      {eyePositions.map((pos, i) => (
        <div
          key={i}
          className="absolute z-[22] animate-eyes-fade pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-white" style={{ boxShadow: '0 0 12px #fff, 0 0 24px rgba(255,255,255,0.5)' }} />
            <div className="w-2 h-2 rounded-full bg-white" style={{ boxShadow: '0 0 12px #fff, 0 0 24px rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      ))}
    </>
  )
}

// Main simplified scroll scene
function ScrollShadowScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { smoothScrollY, scrollProgress } = useSmoothScroll(0.08)

  // One-time triggers for scroll zones (only trigger on scroll DOWN)
  const triggeredZones = useScrollZones([0.1, 0.25, 0.4, 0.55, 0.7])

  // Calculate boy position with CSS transition for smoothness
  const boyPosition = Math.min(85, 10 + scrollProgress * 75)

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: '120vh',
        background: 'linear-gradient(180deg, #888 0%, #555 20%, #333 50%, #222 80%, #111 100%)',
      }}
    >
      {/* Scene title - fades out */}
      <div
        className="sticky top-4 left-0 right-0 text-center z-30 pointer-events-none transition-opacity duration-500"
        style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
      >
        <span className="text-base tracking-[0.5em] uppercase" style={{ color: '#a0a0a0' }}>
          [ scroll to explore ]
        </span>
      </div>

      {/* Scene vignette - reduced opacity so characters are visible */}
      <div
        className="sticky top-0 left-0 right-0 h-screen pointer-events-none z-[15]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 90%)',
        }}
      />

      {/* The scene - sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ground line */}
        <div
          className="absolute left-0 right-0 h-px bottom-1/4 z-[21]"
          style={{ background: 'rgba(255,255,255,0.3)' }}
        />

        {/* Eyes - CSS animation fade in/out */}
        <SceneEyes />

        {/* Trap hazards - triggered once at specific zones */}
        <div className="absolute bottom-1/4 left-0 right-0 h-20 z-[23]">
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

        {/* Running figure - smooth CSS transition for position */}
        <div
          className="absolute bottom-1/4 z-[25] transition-all duration-300 ease-out"
          style={{
            left: `${boyPosition}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <RunningFigure className="animate-figure-run" />
        </div>

        {/* Giant spider - triggered once, then idles */}
        <div
          className="absolute bottom-1/4 z-[24] transition-all duration-500 ease-out"
          style={{
            left: `${Math.max(5, boyPosition - 20)}%`,
          }}
        >
          <ChasingSpider isActive={triggeredZones.has(0.1)} />
        </div>

        {/* Edge tendrils - static with CSS idle animation */}
        <div className="absolute top-0 left-0 w-48 h-64 opacity-70 z-[21] animate-tendril-sway">
          <svg viewBox="0 0 150 200" className="w-full h-full">
            <path d="M0,0 Q40,100 20,200" stroke="#000" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M0,30 Q60,120 40,200" stroke="#000" strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-48 h-64 opacity-70 transform scale-x-[-1] animate-tendril-sway-reverse">
          <svg viewBox="0 0 150 200" className="w-full h-full">
            <path d="M0,0 Q40,100 20,200" stroke="#000" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-4 transition-colors duration-300"
              style={{
                background: scrollProgress > (i + 1) / 5 ? '#555' : '#222',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

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
    engineer: { hint: 'the thinker' },
    drummer: { hint: 'the artist' },
    fighter: { hint: 'the warrior' },
  }
  const figure = figures[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-500 group ${
        isActive ? 'scale-110' : 'opacity-40 hover:opacity-70'
      }`}
    >
      {/* Silhouette figure */}
      <div className="relative w-24 h-32">
        <svg viewBox="0 0 60 80" className="w-full h-full">
          {profession === 'engineer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              <rect x="15" y="23" width="30" height="35" fill="#000" rx="3" />
              <rect x="10" y="58" width="10" height="20" fill="#000" />
              <rect x="40" y="58" width="10" height="20" fill="#000" />
              <rect x="22" y="30" width="16" height="10" fill={isActive ? '#333' : '#111'} rx="1" /> {/* laptop screen */}
            </>
          )}
          {profession === 'drummer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              <path d="M20,23 L40,23 L38,50 L22,50 Z" fill="#000" />
              <rect x="12" y="50" width="8" height="20" fill="#000" />
              <rect x="40" y="50" width="8" height="20" fill="#000" />
              <line x1="10" y1="20" x2="5" y2="40" stroke="#000" strokeWidth="3" /> {/* drumstick */}
              <line x1="50" y1="20" x2="55" y2="40" stroke="#000" strokeWidth="3" /> {/* drumstick */}
            </>
          )}
          {profession === 'fighter' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              <path d="M18,23 L42,23 L40,50 L20,50 Z" fill="#000" />
              <rect x="14" y="50" width="10" height="22" fill="#000" />
              <rect x="36" y="50" width="10" height="22" fill="#000" />
              <path d="M5,30 L18,25 L20,35 L8,38 Z" fill="#000" /> {/* fist */}
              <path d="M55,30 L42,25 L40,35 L52,38 Z" fill="#000" /> {/* fist */}
            </>
          )}
        </svg>
      </div>

      {/* Glow behind active */}
      {isActive && (
        <div
          className="absolute inset-0 -z-10 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 60%)',
          }}
        />
      )}

      {/* Label */}
      <span
        className="block mt-2 text-base tracking-[0.3em] uppercase"
        style={{ color: isActive ? '#000' : '#666' }}
      >
        {figure.hint}
      </span>
    </button>
  )
}

// Minimal text block with stark border
function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-8 relative"
      style={{
        background: 'rgba(240,240,240,0.9)',
        borderLeft: '3px solid #000',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black" />
      {children}
    </div>
  )
}

// Tech tag in stark monochrome
function TechTag({ name }: { name: string }) {
  return (
    <span
      className="inline-block px-2 py-1 text-base tracking-wider uppercase transition-all hover:bg-black hover:text-white"
      style={{
        background: 'transparent',
        border: '1px solid #000',
        color: '#f0f0f0',
      }}
    >
      {name}
    </span>
  )
}

// Tech Cloud for engineer - all technologies
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-base tracking-[0.3em] uppercase mb-3 flex items-center gap-2"
            style={{ color: '#b0b0b0' }}
          >
            <span className="text-base">{category.icon}</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Achievement-based list for drummer/fighter - no meaningless skill bars
function AchievementsList({ categories }: { categories: AchievementCategory[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-base tracking-[0.3em] uppercase mb-4 flex items-center gap-2"
            style={{ color: '#b0b0b0' }}
          >
            <span className="text-base">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-3">
            {category.achievements.map((achievement) => (
              <li key={achievement.title} style={{ color: '#e0e0e0' }}>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: '#f0f0f0' }}>-</span>
                  {achievement.link ? (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      {achievement.title}
                    </a>
                  ) : (
                    <span>{achievement.title}</span>
                  )}
                  {achievement.metric && (
                    <span className="text-sm" style={{ color: '#888' }}>
                      {achievement.metric}
                    </span>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-sm ml-4 mt-1" style={{ color: '#999' }}>
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

// Legacy skills list kept for backwards compatibility
function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-base tracking-[0.3em] uppercase mb-4 flex items-center gap-2"
            style={{ color: '#b0b0b0' }}
          >
            <span className="text-base">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="text-base flex items-center gap-2"
                style={{ color: '#e0e0e0' }}
              >
                <span style={{ color: '#f0f0f0' }}>-</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Company card - stark minimalist
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:translate-x-1 hover:translate-y-1 group"
      style={{
        background: '#f0f0f0',
        border: '2px solid #000',
        boxShadow: '4px 4px 0 #000',
      }}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl" style={{ filter: 'grayscale(100%) contrast(200%)' }}>{company.icon}</span>
        <div>
          <h4 className="text-base font-bold uppercase tracking-wider group-hover:underline" style={{ color: '#f0f0f0' }}>
            {company.name}
          </h4>
          <p className="text-base tracking-wider" style={{ color: '#b0b0b0' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-lg leading-relaxed" style={{ color: '#d8d8d8' }}>{company.description}</p>
    </a>
  )
}

// Band card - stark minimalist
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:translate-x-1 hover:translate-y-1 group"
      style={{
        background: '#f0f0f0',
        border: '2px solid #000',
        boxShadow: '4px 4px 0 #000',
      }}
    >
      <h4 className="text-base font-bold uppercase tracking-wider group-hover:underline" style={{ color: '#f0f0f0' }}>
        {band.name}
      </h4>
      <p className="text-base tracking-wider mt-1" style={{ color: '#b0b0b0' }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-lg leading-relaxed mt-2" style={{ color: '#d8d8d8' }}>{band.description}</p>
      {!band.url && (
        <p className="text-base mt-2 uppercase tracking-wider" style={{ color: '#888' }}>
          [ website coming ]
        </p>
      )}
    </div>
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

// Experience card - stark minimalist style matching theme
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-5"
      style={{
        background: 'rgba(240,240,240,0.9)',
        borderLeft: '3px solid #000',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4
            className="text-base font-bold uppercase tracking-wider"
            style={{ color: '#f0f0f0' }}
          >
            {entry.title}
          </h4>
          <p
            className="text-base tracking-wider mt-1"
            style={{ color: '#c8c8c8' }}
          >
            {entry.organization}
          </p>
        </div>
        <span
          className="text-base tracking-wider uppercase"
          style={{ color: '#a0a0a0' }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p
        className="text-lg leading-relaxed mt-3"
        style={{ color: '#d8d8d8' }}
      >
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-base flex items-start gap-2"
              style={{ color: '#e0e0e0' }}
            >
              <span style={{ color: '#f0f0f0' }}>-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
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
    <div
      className={`p-5 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        background: '#e8e8e8',
        border: '2px solid #000',
        boxShadow: '6px 6px 0 #000',
      }}
    >
      {project.featured && (
        <span className="text-base tracking-[0.2em] uppercase" style={{ color: '#b0b0b0' }}>
          [ featured ]
        </span>
      )}
      <h3 className="text-base font-bold mt-1 uppercase tracking-wider" style={{ color: '#f0f0f0' }}>
        {project.name}
      </h3>
      <p className="text-base mt-1" style={{ color: '#b0b0b0' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-base mt-2 italic" style={{ color: '#d8d8d8' }}>
          {'->'} {project.impact}
        </p>
      )}
      <div className="flex gap-2 flex-wrap mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-base px-2 py-0.5 uppercase tracking-wider"
            style={{
              background: '#000',
              color: '#e8e8e8',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
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

export default function SilhouetteTheme() {
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerSkills = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
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
        background: 'linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 30%, #d0d0d0 60%, #e0e0e0 100%)',
        fontFamily: '"Courier New", monospace',
        overflowX: 'hidden',
      }}
    >
      {/* Shadow realm atmospheric effects - CSS animation loops */}
      <FogLayers />
      <ShadowVignette />
      <CornerTendrils />
      <DangerDecorations />
      <WatchingEyesDecoration />
      <BoySilhouetteDecoration />

      {/* Dark content overlay with silhouette tint */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.15) 0%, rgba(15, 15, 15, 0.25) 50%, rgba(20, 20, 20, 0.2) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-30 p-8">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div>
            {/* Name */}
            <h1 className="text-3xl tracking-[0.5em] font-normal" style={{ color: '#f0f0f0' }}>
              <FloatingText text="ALEXANDER" delay={0} />
              <FloatingText text=" " delay={400} />
              <FloatingText text="PULIDO" delay={600} />
            </h1>
            {/* Professional headline */}
            <p className="text-base tracking-[0.2em] mt-3" style={{ color: '#d8d8d8' }}>
              <FloatingText text={PROFESSIONAL_SUMMARY.headline} delay={1000} />
            </p>
            {/* Tagline */}
            <p className="text-base tracking-wider mt-1 italic" style={{ color: '#b0b0b0' }}>
              <FloatingText text={PROFESSIONAL_SUMMARY.tagline} delay={1400} />
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              href="/cv"
              className="sil-button px-4 py-2 text-base tracking-[0.2em] uppercase transition-all hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              style={{
                background: 'transparent',
                border: '2px solid #000',
                color: '#f0f0f0',
              }}
            >
              resume
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="sil-button sil-button-solid px-4 py-2 text-base tracking-[0.2em] uppercase transition-all hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              style={{
                background: '#000',
                color: '#e8e8e8',
              }}
            >
              enter
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-6 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role, i) => (
              <div
                key={role.id}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${1600 + i * 200}ms` }}
              >
                <p className="text-base tracking-[0.3em] uppercase" style={{ color: '#f0f0f0' }}>
                  {role.title}
                </p>
                <p className="text-base mt-1" style={{ color: '#b0b0b0' }}>
                  {role.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Selection */}
      <section className="relative z-20 py-12">
        <div className="flex justify-center gap-20">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <SilhouetteFigure
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
            />
          ))}
        </div>
        <p className="text-center mt-6 text-base tracking-[0.3em] uppercase" style={{ color: '#a0a0a0' }}>
          {config.title.toLowerCase()}
        </p>
      </section>

      {/* Scroll-triggered shadow realm scene */}
      <ScrollShadowScene />

      {/* Main content */}
      <main className="relative z-20 px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* About */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-black opacity-30" />
              <h2
                className="text-base tracking-[0.4em] uppercase"
                style={{ color: '#d8d8d8' }}
              >
                about
              </h2>
              <div className="flex-1 h-px bg-black opacity-30" />
            </div>
            <TextBlock>
              <p className="text-lg leading-loose" style={{ color: '#e0e0e0' }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-base tracking-wider uppercase"
                    style={{ color: '#c8c8c8' }}
                  >
                    - {fact}
                  </span>
                ))}
              </div>
            </TextBlock>
          </section>

          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-black opacity-30" />
                <h2
                  className="text-base tracking-[0.4em] uppercase"
                  style={{ color: '#d8d8d8' }}
                >
                  work experience
                </h2>
                <div className="flex-1 h-px bg-black opacity-30" />
              </div>
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack / Skills */}
          <section className="mt-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-black opacity-30" />
              <h2
                className="text-base tracking-[0.4em] uppercase"
                style={{ color: '#d8d8d8' }}
              >
                {active === 'engineer' ? 'tech stack' : 'skills'}
              </h2>
              <div className="flex-1 h-px bg-black opacity-30" />
            </div>
            <TextBlock>
              {active === 'engineer' ? (
                <TechCloud categories={engineerSkills} />
              ) : (
                <AchievementsList categories={achievements} />
              )}
            </TextBlock>
          </section>

          {/* Projects */}
          <section className="mt-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-black opacity-30" />
              <h2
                className="text-base tracking-[0.4em] uppercase"
                style={{ color: '#d8d8d8' }}
              >
                featured work
              </h2>
              <div className="flex-1 h-px bg-black opacity-30" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.slice(0, 6).map((project, i) => (
                <ShadowBox key={project.id} project={project} index={i} />
              ))}
            </div>
          </section>

          {/* Companies (Engineer) */}
          {active === 'engineer' && (
            <section className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-black opacity-30" />
                <h2
                  className="text-base tracking-[0.4em] uppercase"
                  style={{ color: '#d8d8d8' }}
                >
                  companies
                </h2>
                <div className="flex-1 h-px bg-black opacity-30" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <section className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-black opacity-30" />
                <h2
                  className="text-base tracking-[0.4em] uppercase"
                  style={{ color: '#d8d8d8' }}
                >
                  bands
                </h2>
                <div className="flex-1 h-px bg-black opacity-30" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-16 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="w-8 h-px bg-black opacity-40" />
          <p className="text-base tracking-[0.5em]" style={{ color: '#a0a0a0' }}>
            . . .
          </p>
          <div className="w-8 h-px bg-black opacity-40" />
        </div>
      </footer>

      {/* Shadow realm animations - CSS loops, not scroll-bound */}
      <style jsx global>{`
        /* =================================================================
           FOG AND MIST - Continuous CSS loops
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
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(-20px); }
        }
        .animate-fog-drift-slow {
          animation: fog-drift-slow 60s ease-in-out infinite alternate;
        }
        .animate-fog-drift-mid {
          animation: fog-drift-mid 40s ease-in-out infinite alternate;
        }
        .animate-fog-drift-fast {
          animation: fog-drift-fast 25s ease-in-out infinite alternate;
        }
        .animate-mist-rise {
          animation: mist-rise 8s ease-in-out infinite;
        }

        /* =================================================================
           FILM GRAIN - Continuous CSS loop
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
        .animate-grain {
          animation: grain 0.4s steps(8) infinite;
        }

        /* =================================================================
           EYES - CSS fade in/out loop (not scroll-bound)
           ================================================================= */
        @keyframes eyes-fade {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        .animate-eyes-fade {
          animation: eyes-fade 6s ease-in-out infinite;
        }

        /* =================================================================
           DECORATIVE ELEMENTS - CSS loops
           ================================================================= */
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-rotate {
          animation: slow-rotate 30s linear infinite;
        }

        @keyframes boy-walk {
          0%, 100% { transform: translateX(0) scaleX(1); }
          49% { transform: translateX(30px) scaleX(1); }
          50% { transform: translateX(30px) scaleX(-1); }
          99% { transform: translateX(0) scaleX(-1); }
        }
        .animate-boy-walk {
          animation: boy-walk 12s ease-in-out infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        /* =================================================================
           SCROLL SCENE - One-time triggered + CSS idle loops
           ================================================================= */

        /* Running figure - continuous run cycle */
        @keyframes figure-run {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-2px); }
        }
        .animate-figure-run {
          animation: figure-run 0.3s ease-in-out infinite;
        }

        /* Spider crawl - idle loop after trigger */
        @keyframes spider-crawl {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }
        .animate-spider-crawl {
          animation: spider-crawl 2s ease-in-out infinite;
        }

        /* Spider leg wiggle - continuous */
        @keyframes spider-leg {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        .animate-spider-leg {
          animation: spider-leg 0.5s ease-in-out infinite;
        }

        /* Pendulum swing - triggered then loops */
        @keyframes pendulum-swing {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        .animate-pendulum-swing {
          animation: pendulum-swing 2s ease-in-out infinite;
        }

        /* Tendril sway - continuous idle */
        @keyframes tendril-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(10px) rotate(2deg); }
        }
        @keyframes tendril-sway-reverse {
          0%, 100% { transform: scaleX(-1) translateX(0) rotate(0deg); }
          50% { transform: scaleX(-1) translateX(-10px) rotate(-2deg); }
        }
        .animate-tendril-sway {
          animation: tendril-sway 4s ease-in-out infinite;
        }
        .animate-tendril-sway-reverse {
          animation: tendril-sway-reverse 4.5s ease-in-out infinite;
        }

        /* ========================================
           SILHOUETTE BUTTON EFFECTS
           Invert colors, shadow extends
           ======================================== */

        .sil-button {
          position: relative;
          overflow: visible;
        }

        .sil-button::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          width: 100%;
          height: 100%;
          background: #000;
          z-index: -1;
          transition: top 0.2s ease, left 0.2s ease;
        }

        .sil-button:hover::after {
          top: 6px;
          left: 6px;
        }

        .sil-button:hover {
          transform: translate(-1px, -1px);
        }

        .sil-button:active::after {
          top: 2px;
          left: 2px;
        }

        .sil-button:active {
          transform: translate(1px, 1px);
        }

        .sil-button-solid::after {
          background: #555;
        }

        /* === REDUCED MOTION SUPPORT === */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-figure-run,
          .animate-spider-crawl,
          .animate-spider-leg,
          .animate-pendulum-swing,
          .animate-tendril-sway,
          .animate-tendril-sway-reverse,
          .animate-fog-drift,
          .animate-eye-blink,
          .sil-button {
            animation: none !important;
          }
          .animate-fade-in {
            opacity: 1;
          }
          .sil-button::after {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}

