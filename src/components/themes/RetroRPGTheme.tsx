'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

// Check for reduced motion preference
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Undertale-style pixel heart soul
function PixelHeartSoul({
  size = 16,
  color = '#ff0000',
  className = '',
  animate = true,
  ariaLabel = 'Soul heart',
}: {
  size?: number
  color?: string
  className?: string
  animate?: boolean
  ariaLabel?: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !reducedMotion

  // 8x8 pixel heart pattern (Undertale style)
  const heartPixels = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]

  const pixelSize = size / 8

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        style={{ imageRendering: 'pixelated' }}
        className={shouldAnimate ? 'animate-soul-pulse' : ''}
      >
        {heartPixels.map((row, y) =>
          row.map((pixel, x) =>
            pixel ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  )
}

// Pixel Alexander soul - the protagonist
function PixelSoulCharacter({
  size = 40,
  color = '#ff0000',
  className = ''
}: {
  size?: number
  color?: string
  className?: string
}) {
  const [frame, setFrame] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 200)
    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
      role="img"
      aria-label="Character soul"
    >
      <Image
        src={frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png'}
        alt="Soul"
        fill
        className="object-contain"
        style={{
          filter: `brightness(1.2) contrast(1.3) saturate(0.8)`,
          imageRendering: 'pixelated',
        }}
      />
      {/* Soul heart glow around character */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Battle reveal section with soul animation
function BattleRevealSection({
  children,
  className = '',
  sectionLabel = 'Content section',
}: {
  children: React.ReactNode
  className?: string
  sectionLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.2 })
  const [phase, setPhase] = useState<'hidden' | 'battle' | 'revealed'>('hidden')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      if (reducedMotion) {
        setPhase('revealed')
      } else {
        setPhase('battle')
        setTimeout(() => setPhase('revealed'), 800)
      }
    }
  }, [hasEntered, phase, reducedMotion])

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      aria-label={sectionLabel}
    >
      {/* Battle animation overlay */}
      {phase === 'battle' && !reducedMotion && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          aria-hidden="true"
        >
          <div className="text-center animate-battle-flash">
            <PixelSoulCharacter size={60} className="mx-auto mb-2" />
            <p className="text-white text-xs tracking-[0.3em]">* ENCOUNTER!</p>
          </div>
        </div>
      )}

      {/* Content with battle box appearance */}
      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'scale(1)' : 'scale(0.9)',
          transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
        }}
      >
        {children}
      </div>
    </section>
  )
}

// Soul heart types with colors (Undertale canon)
const SOUL_COLORS = {
  red: '#ff0000',     // Determination
  cyan: '#00ffff',    // Patience
  orange: '#ffa500',  // Bravery
  blue: '#0066ff',    // Integrity
  purple: '#9900ff',  // Perseverance
  green: '#00ff00',   // Kindness
  yellow: '#ffff00',  // Justice
}

// Floating soul hearts animation (subtle background)
function FloatingSoulHearts() {
  const reducedMotion = usePrefersReducedMotion()
  const [hearts, setHearts] = useState<Array<{
    id: number
    x: number
    y: number
    color: string
    size: number
    speed: number
    wobble: number
  }>>([])

  useEffect(() => {
    if (reducedMotion) return
    const colors = Object.values(SOUL_COLORS)
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 8,
      speed: Math.random() * 15 + 10,
      wobble: Math.random() * 30 + 20,
    }))
    setHearts(newHearts)
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            animation: `soulFloat ${h.speed}s ease-in-out infinite, soulWobble ${h.wobble / 10}s ease-in-out infinite`,
            animationDelay: `${-h.speed * Math.random()}s`,
          }}
        >
          <PixelHeartSoul size={h.size} color={h.color} animate={false} />
        </div>
      ))}
    </div>
  )
}

// Attack pattern: Bones (Papyrus/Sans style)
function BoneAttackPattern() {
  const reducedMotion = usePrefersReducedMotion()
  const [bones, setBones] = useState<Array<{
    id: number
    x: number
    y: number
    rotation: number
    height: number
    delay: number
  }>>([])

  useEffect(() => {
    if (reducedMotion) return
    const newBones = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + i * 12,
      y: Math.random() * 20 + 85,
      rotation: Math.random() * 30 - 15,
      height: Math.random() * 40 + 30,
      delay: i * 0.3,
    }))
    setBones(newBones)
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[3] overflow-hidden"
      aria-hidden="true"
    >
      {bones.map((b) => (
        <div
          key={b.id}
          className="absolute animate-bone-rise"
          style={{
            left: `${b.x}%`,
            bottom: 0,
            transform: `rotate(${b.rotation}deg)`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {/* Pixel bone using boxes */}
          <div
            className="flex flex-col items-center"
            style={{
              color: '#ffffff',
              opacity: 0.15,
            }}
          >
            {/* Top knob */}
            <div className="flex gap-[1px]">
              <div className="w-[4px] h-[4px] bg-white rounded-full" />
              <div className="w-[4px] h-[4px] bg-white rounded-full" />
            </div>
            {/* Bone shaft */}
            <div
              style={{
                width: '4px',
                height: `${b.height}px`,
                background: '#fff',
              }}
            />
            {/* Bottom knob */}
            <div className="flex gap-[1px]">
              <div className="w-[4px] h-[4px] bg-white rounded-full" />
              <div className="w-[4px] h-[4px] bg-white rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// SAVE point star (golden sparkle)
function SavePointStar({
  isNearby = false,
  size = 'md',
}: {
  isNearby?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const reducedMotion = usePrefersReducedMotion()
  const sizeMap = { sm: 16, md: 24, lg: 32 }
  const pixelSize = sizeMap[size]

  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        isNearby && !reducedMotion ? 'animate-save-glow' : ''
      }`}
      role="img"
      aria-label="Save point"
    >
      {/* 4-pointed star pixel art */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 8 8"
        style={{ imageRendering: 'pixelated' }}
        className={!reducedMotion ? 'animate-save-twinkle' : ''}
      >
        {/* Center */}
        <rect x="3" y="3" width="2" height="2" fill="#ffff00" />
        {/* Points */}
        <rect x="3" y="0" width="2" height="3" fill="#ffff00" />
        <rect x="3" y="5" width="2" height="3" fill="#ffff00" />
        <rect x="0" y="3" width="3" height="2" fill="#ffff00" />
        <rect x="5" y="3" width="3" height="2" fill="#ffff00" />
        {/* Glow corners */}
        <rect x="2" y="2" width="1" height="1" fill="#ffa500" />
        <rect x="5" y="2" width="1" height="1" fill="#ffa500" />
        <rect x="2" y="5" width="1" height="1" fill="#ffa500" />
        <rect x="5" y="5" width="1" height="1" fill="#ffa500" />
      </svg>
      {isNearby && !reducedMotion && (
        <div
          className="absolute inset-0 animate-save-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Undertale-style battle box UI frame
function BattleBox({
  children,
  isActive = false,
  color = '#fff',
  ariaLabel = 'Battle box content',
}: {
  children: React.ReactNode
  isActive?: boolean
  color?: string
  ariaLabel?: string
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div
      className={`relative p-1 ${isActive && !reducedMotion ? 'animate-battle-pulse' : ''}`}
      style={{
        border: `4px solid ${color}`,
        boxShadow: isActive ? `0 0 20px ${color}40, inset 0 0 10px ${color}20` : 'none',
        imageRendering: 'pixelated',
      }}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="p-4 bg-black min-h-[200px] relative overflow-hidden">
        {/* Battle box corner brackets (Undertale signature) */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30" aria-hidden="true" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30" aria-hidden="true" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/30" aria-hidden="true" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/30" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}

// Screen flash effect (battle transitions)
function ScreenFlash({ trigger }: { trigger: number }) {
  const [flash, setFlash] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (trigger > 0 && !reducedMotion) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 100)
      return () => clearTimeout(timer)
    }
  }, [trigger, reducedMotion])

  if (!flash) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 bg-white"
      style={{ opacity: 0.3 }}
      aria-hidden="true"
    />
  )
}

// Battle menu option (FIGHT/ACT/ITEM/MERCY style)
function BattleOption({
  icon,
  label,
  isSelected,
  onClick,
  color,
}: {
  icon: string
  label: string
  isSelected: boolean
  onClick: () => void
  color: string
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 transition-all ${!reducedMotion ? 'hover:scale-105' : ''}`}
      style={{
        background: isSelected ? color : 'transparent',
        border: `4px solid ${color}`,
        color: isSelected ? '#000' : color,
        boxShadow: isSelected ? `0 0 15px ${color}60` : 'none',
        imageRendering: 'pixelated',
      }}
      aria-pressed={isSelected}
      aria-label={`${label} menu option`}
    >
      {isSelected && (
        <span className={`absolute left-2 ${!reducedMotion ? 'animate-bounce-slow' : ''}`} aria-hidden="true">
          <PixelHeartSoul size={12} color="#ff0000" animate={false} />
        </span>
      )}
      <span className="text-sm tracking-wider font-bold ml-4">
        {icon} {label}
      </span>
    </button>
  )
}

// Dialogue box with typing effect (Undertale signature)
function DialogueBox({ text, speaker }: { text: string; speaker: string }) {
  const [displayed, setDisplayed] = useState('')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text)
      return
    }

    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [text, reducedMotion])

  return (
    <div
      className="relative p-1"
      style={{ border: '4px solid #fff' }}
      role="dialog"
      aria-label={`${speaker} says`}
    >
      <div className="p-4 bg-black">
        <span className="text-yellow-400 text-sm">* {speaker}</span>
        <p className="text-white text-sm mt-2 leading-relaxed min-h-[60px]">
          {displayed}
          {!reducedMotion && displayed.length < text.length && (
            <span className="animate-blink" aria-hidden="true">|</span>
          )}
        </p>
      </div>
    </div>
  )
}

// Determination text effect (red glowing text)
function DeterminationText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`text-red-500 ${className}`}
      style={{
        textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000',
      }}
    >
      {children}
    </span>
  )
}

// HP bar (classic Undertale style)
function HPBar({
  label,
  current,
  max,
  color = '#ffff00',
}: {
  label: string
  current: number
  max: number
  color?: string
}) {
  return (
    <div className="flex items-center gap-2" role="meter" aria-label={`${label}: ${current} of ${max}`}>
      <span className="text-xs w-8 text-yellow-400">{label}</span>
      <div className="flex-1 h-5 bg-[#440000] border-2 border-white relative">
        <div
          className="h-full transition-all"
          style={{
            width: `${(current / max) * 100}%`,
            background: color,
          }}
        />
        {/* Pixel grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent 3px, rgba(0,0,0,0.2) 3px)',
            backgroundSize: '4px 100%',
          }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs text-white w-14 text-right tabular-nums">
        {current} / {max}
      </span>
    </div>
  )
}

// Tech stack display (Undertale inventory style - NO BARS)
function TechInventory({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div
      className="border-4 border-white p-4 bg-black max-h-[400px] overflow-y-auto"
      role="list"
      aria-label="Tech stack inventory"
    >
      <p className="text-yellow-400 text-xs mb-4 flex items-center gap-2">
        <SavePointStar size="sm" />
        TECH STACK
        <span className="text-white/60 text-[8px] ml-2">* Your equipped abilities</span>
      </p>
      {categories.map((category) => (
        <div key={category.name} className="mb-6" role="listitem">
          <p className="text-cyan-400 text-xs mb-2 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {category.items.map((tech) => (
              <div
                key={tech}
                className="text-[10px] px-2 py-1 border border-white/30 text-white hover:bg-white hover:text-black transition-colors cursor-default flex items-center gap-1"
              >
                <PixelHeartSoul size={8} color="#ff0000" animate={false} />
                {tech}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skills display for drummer/fighter (achievements, NO BARS)
function SkillsDisplay({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div
      className="border-4 border-white p-4 bg-black"
      role="list"
      aria-label="Skills and abilities"
    >
      <p className="text-yellow-400 text-xs mb-4 flex items-center gap-2">
        <SavePointStar size="sm" />
        ABILITIES
        <span className="text-white/60 text-[8px] ml-2">* What you've mastered</span>
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.name} role="listitem">
            <p className="text-cyan-400 text-xs mb-2 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name.toUpperCase()}
            </p>
            <ul className="space-y-1">
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="text-[10px] text-white flex items-center gap-2"
                >
                  <PixelHeartSoul size={8} color="#ff0000" animate={false} />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// Company card (Undertale shop item style)
function CompanyShopItem({ company }: { company: (typeof COMPANIES)[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 border-2 border-white hover:bg-white hover:text-black transition-colors group"
      aria-label={`${company.name}: ${company.tagline}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4 className="text-xs font-bold group-hover:text-black text-white">
            {company.name}
          </h4>
          <p className="text-[8px] text-yellow-400 group-hover:text-yellow-600">
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-[9px] text-white/80 group-hover:text-black/80">
        * {company.description}
      </p>
      {/* Impact: Services offered */}
      <div className="mt-2 flex flex-wrap gap-1">
        {company.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-[7px] px-1 border border-cyan-400/50 text-cyan-400 group-hover:text-cyan-700 group-hover:border-cyan-700/50"
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Work experience card (encounter log style)
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-3 border-2 border-white mb-2 hover:bg-white/10 transition-colors"
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <PixelHeartSoul size={10} color="#ff0000" animate={false} />
            {entry.title}
          </h4>
          <p className="text-[10px] text-yellow-400">
            @ {entry.organization}
          </p>
        </div>
        <span className="text-[8px] text-white/60">
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-[9px] text-white/80 mb-2">
        {entry.description}
      </p>
      {/* Impact statements - achievements */}
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[9px] text-cyan-400 flex items-start gap-1">
              <SavePointStar size="sm" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Band card (monster encounter style)
function BandEncounter({ band }: { band: (typeof BANDS)[0] }) {
  const content = (
    <article
      className="p-3 border-2 border-purple-500 hover:bg-purple-500 hover:text-black transition-colors group"
      aria-label={`${band.name}: ${band.genre}`}
    >
      <h4 className="text-xs font-bold text-white group-hover:text-black flex items-center gap-2">
        <PixelHeartSoul size={10} color="#9900ff" animate={false} />
        {band.name} appears!
      </h4>
      <p className="text-[8px] text-purple-400 group-hover:text-purple-900 mt-1">
        {band.genre} | {band.role}
      </p>
      <p className="text-[9px] text-white/80 group-hover:text-black/80 mt-2">
        {band.description}
      </p>
      {!band.url && (
        <p className="text-[8px] text-yellow-400 group-hover:text-yellow-600 mt-2 italic">
          * Website coming soon...
        </p>
      )}
    </article>
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

// Current roles display (equipped items style)
function RolesDisplay() {
  return (
    <section
      className="border-4 border-yellow-400 p-4 bg-black"
      aria-labelledby="roles-heading"
    >
      <h2
        id="roles-heading"
        className="text-yellow-400 text-xs mb-4 flex items-center gap-2"
      >
        <SavePointStar isNearby size="sm" />
        EQUIPPED ROLES
        <SavePointStar isNearby size="sm" />
      </h2>
      <div className="space-y-3" role="list">
        {CURRENT_ROLES.map((role) => (
          <div key={role.id} className="flex items-center gap-3" role="listitem">
            <PixelHeartSoul size={12} color="#ff0000" />
            <div>
              <p className="text-white text-xs">
                {role.title} @ <span className="text-cyan-400">{role.company}</span>
              </p>
              <p className="text-[8px] text-white/60">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Project card with impact (Undertale check stats style)
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <Link
      href={project.links?.demo || project.links?.site || '#'}
      className="block p-3 text-white text-xs border-2 border-white hover:bg-red-500 hover:border-red-500 transition-colors group"
      aria-label={`${project.name}: ${project.tagline}`}
    >
      <div className="flex justify-between items-start">
        <span className="flex items-center gap-2">
          <PixelHeartSoul size={10} color="#ff0000" animate={false} />
          {project.name}
        </span>
        {project.featured && (
          <SavePointStar size="sm" />
        )}
      </div>
      <p className="text-[8px] mt-1 opacity-60 group-hover:opacity-80">
        {project.tagline}
      </p>
      {/* Impact statement - the key achievement */}
      {project.impact && (
        <p className="text-[8px] mt-2 text-cyan-400 group-hover:text-cyan-200 flex items-start gap-1">
          <span className="text-yellow-400">*</span>
          {project.impact}
        </p>
      )}
      {/* Tech stack */}
      <div className="mt-2 flex flex-wrap gap-1">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[6px] px-1 border border-white/30 text-white/60 group-hover:text-black/60 group-hover:border-black/30"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default function RetroRPGTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>('act')
  const [flashTrigger, setFlashTrigger] = useState(0)
  const [screenShake, setScreenShake] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(
    (p) => p.professions.includes(active) || p.featured
  )
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Screen shake on action change
  const handleActionChange = useCallback((action: string) => {
    if (!reducedMotion) {
      setFlashTrigger((prev) => prev + 1)
      setScreenShake(true)
      setTimeout(() => setScreenShake(false), 150)
    }
    setSelectedAction(action)
  }, [reducedMotion])

  if (!mounted) return null

  const battleActions = [
    { id: 'fight', icon: '⚔', label: 'FIGHT', color: '#ff0000' },
    { id: 'act', icon: '★', label: 'ACT', color: '#ffff00' },
    { id: 'item', icon: '◆', label: 'ITEM', color: '#00ff00' },
    { id: 'mercy', icon: '♥', label: 'MERCY', color: '#ff00ff' },
  ]

  const professionOptions = [
    { id: 'engineer', label: '* Engineer', desc: 'Check stats' },
    { id: 'drummer', label: '* Musician', desc: 'Play a tune' },
    { id: 'fighter', label: '* Fighter', desc: 'Flex muscles' },
  ]

  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-black ${
        screenShake && !reducedMotion ? 'animate-screen-shake' : ''
      }`}
      style={{ fontFamily: '"Press Start 2P", "Courier New", monospace' }}
    >
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-yellow-400 focus:text-black focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* Screen flash effect */}
      <ScreenFlash trigger={flashTrigger} />

      {/* Visual decorations (hidden from screen readers) */}
      <FloatingSoulHearts />
      <BoneAttackPattern />

      {/* CRT scanlines effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Header with professional summary */}
      <header className="relative z-30 p-4" role="banner">
        <div className="max-w-4xl mx-auto">
          {/* Professional headline */}
          <div className="text-center mb-4">
            <h1 className="text-white text-xl tracking-wider mb-2">
              ALEXANDER PULIDO
            </h1>
            <p className="text-yellow-400 text-[10px] tracking-wide">
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-cyan-400 text-[8px] mt-1 italic">
              * {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <nav className="flex justify-between items-center" aria-label="Main navigation">
            <div className="flex items-center gap-4">
              <PixelHeartSoul size={24} color="#ff0000" ariaLabel="Determination soul" />
              <div>
                <p className="text-white text-sm">LV 35</p>
                <p className="text-yellow-400 text-xs">{config.title.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Link
                href="/cv"
                className="px-3 py-2 text-[10px] bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors flex items-center gap-2"
                aria-label="View CV - Save point"
              >
                <SavePointStar isNearby />
                SAVE
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-3 py-2 text-[10px] bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
                aria-label="Play game engine demo"
              >
                ◆ GAME
              </Link>
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      </header>

      {/* Current Roles section */}
      <div className="relative z-20 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <RolesDisplay />
        </div>
      </div>

      {/* Main battle area */}
      <main id="main-content" className="relative z-20 px-4 py-8" role="main">
        <div className="max-w-4xl mx-auto">
          {/* Stats bar (HP/EXP/GOLD style) */}
          <section
            className="mb-8 p-4 border-4 border-white bg-black"
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className="sr-only">Character Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <HPBar label="HP" current={92} max={100} color="#00ff00" />
              <HPBar label="EXP" current={350} max={500} color="#ffff00" />
              <HPBar label="GOLD" current={999} max={999} color="#ffa500" />
            </div>
          </section>

          {/* Battle box / main content */}
          <div className="mb-8">
            <BattleBox isActive={!!selectedAction} color="#fff" ariaLabel="Main content area">
              {/* "Enemy" display - Profile */}
              <div className="text-center mb-8">
                <div
                  className="inline-block w-32 h-32 mb-4 border-4 border-white relative overflow-hidden"
                  style={{ background: 'linear-gradient(180deg, #222, #000)' }}
                  role="img"
                  aria-label={`${config.title} character portrait`}
                >
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-5xl ${
                      !reducedMotion ? 'animate-float' : ''
                    }`}
                  >
                    {active === 'engineer'
                      ? '💻'
                      : active === 'drummer'
                      ? '🥁'
                      : '🥋'}
                  </span>
                </div>
                <h2 className="text-white text-xl mb-2">
                  {config.title.toUpperCase()}
                </h2>
                <p className="text-yellow-400 text-xs">* {config.tagline}</p>
              </div>

              {/* Profession select (ACT menu style) */}
              {selectedAction === 'act' && (
                <div className="border-4 border-yellow-400 p-4 bg-black">
                  <p className="text-yellow-400 text-xs mb-4">* Choose your path</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Profession selection">
                    {professionOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActive(opt.id as 'engineer' | 'drummer' | 'fighter')
                          if (!reducedMotion) {
                            setFlashTrigger((prev) => prev + 1)
                          }
                        }}
                        className={`p-3 text-left transition-colors border-2 ${
                          active === opt.id
                            ? 'border-yellow-400 bg-yellow-400 text-black'
                            : 'border-white text-white hover:bg-white hover:text-black'
                        }`}
                        role="radio"
                        aria-checked={active === opt.id}
                      >
                        <div className="text-xs flex items-center gap-2">
                          {active === opt.id && (
                            <PixelHeartSoul size={10} color="#ff0000" animate={false} />
                          )}
                          <span>{opt.label}</span>
                        </div>
                        <div className="text-[8px] mt-1 opacity-60">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech/Skills display (ITEM menu style) - NO PROFICIENCY BARS */}
              {selectedAction === 'item' && (
                <>
                  {active === 'engineer' ? (
                    <TechInventory categories={engineerTech} />
                  ) : (
                    <SkillsDisplay categories={otherSkills} />
                  )}
                </>
              )}

              {/* Projects / Companies / Bands (FIGHT menu style) */}
              {selectedAction === 'fight' && (
                <div className="border-4 border-red-500 p-4 bg-black">
                  <p className="text-red-400 text-xs mb-4 flex items-center gap-2">
                    <PixelHeartSoul size={12} color="#ff0000" animate={false} />
                    PROJECTS & ACHIEVEMENTS
                  </p>

                  {/* Featured Projects with impact */}
                  <div className="mb-6">
                    <p className="text-white text-xs mb-2">FEATURED WORK:</p>
                    <div className="space-y-2">
                      {projects
                        .filter((p) => p.featured)
                        .slice(0, 4)
                        .map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                  </div>

                  {/* Companies for engineer */}
                  {active === 'engineer' && (
                    <div className="mb-6">
                      <p className="text-white text-xs mb-2 flex items-center gap-2">
                        <SavePointStar size="sm" />
                        COMPANIES:
                      </p>
                      <div className="grid md:grid-cols-3 gap-2">
                        {COMPANIES.map((company) => (
                          <CompanyShopItem key={company.id} company={company} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bands for drummer */}
                  {active === 'drummer' && (
                    <div>
                      <p className="text-white text-xs mb-2 flex items-center gap-2">
                        <PixelHeartSoul size={10} color="#9900ff" animate={false} />
                        BANDS:
                      </p>
                      <div className="grid md:grid-cols-3 gap-2">
                        {BANDS.map((band) => (
                          <BandEncounter key={band.id} band={band} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* About (MERCY menu style) */}
              {selectedAction === 'mercy' && (
                <div className="border-4 border-purple-500 p-4 bg-black max-h-[500px] overflow-y-auto">
                  {/* About section */}
                  <p className="text-purple-400 text-xs mb-2 flex items-center gap-2">
                    <PixelHeartSoul size={12} color="#9900ff" animate={false} />
                    ABOUT
                  </p>
                  <DialogueBox speaker="ALEXANDER" text={aboutData.bio} />
                  <div className="flex flex-wrap gap-2 mt-4 mb-6" role="list" aria-label="Quick facts">
                    {aboutData.quickFacts.map((fact, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 border border-purple-500 text-purple-400 flex items-center gap-1"
                        role="listitem"
                      >
                        <PixelHeartSoul size={6} color="#9900ff" animate={false} />
                        {fact}
                      </span>
                    ))}
                  </div>

                  {/* Work Experience section */}
                  {experience.length > 0 && (
                    <section aria-labelledby="experience-heading">
                      <h3
                        id="experience-heading"
                        className="text-purple-400 text-xs mb-2 mt-4 border-t border-purple-500/30 pt-4 flex items-center gap-2"
                      >
                        <SavePointStar size="sm" />
                        WORK EXPERIENCE
                      </h3>
                      <div className="space-y-2">
                        {experience.map((entry) => (
                          <ExperienceCard key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </BattleBox>
          </div>

          {/* Battle menu */}
          <nav
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            aria-label="Battle menu"
          >
            {battleActions.map((action) => (
              <BattleOption
                key={action.id}
                icon={action.icon}
                label={action.label}
                isSelected={selectedAction === action.id}
                onClick={() => handleActionChange(action.id)}
                color={action.color}
              />
            ))}
          </nav>
        </div>
      </main>

      {/* Footer with determination */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <p className="text-white text-[8px] tracking-widest">
          * The power of <DeterminationText>coding</DeterminationText> shines within you.
        </p>
        <p className="text-yellow-400 text-[8px] mt-2 flex items-center justify-center gap-2">
          <PixelHeartSoul size={12} color="#ff0000" />
          <DeterminationText>DETERMINATION</DeterminationText>
          <PixelHeartSoul size={12} color="#ff0000" />
        </p>
      </footer>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes soul-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes soulFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-30px) scale(1.1); }
          50% { transform: translateY(-15px) scale(0.95); }
          75% { transform: translateY(-40px) scale(1.05); }
        }
        @keyframes soulWobble {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(10px) rotate(5deg); }
          75% { transform: translateX(-10px) rotate(-5deg); }
        }
        @keyframes bone-rise {
          0% { transform: translateY(100%); opacity: 0; }
          50% { transform: translateY(-20px); opacity: 0.15; }
          100% { transform: translateY(0); opacity: 0.15; }
        }
        @keyframes save-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes save-glow {
          0%, 100% { filter: drop-shadow(0 0 10px #ffff00); }
          50% { filter: drop-shadow(0 0 20px #ffff00) drop-shadow(0 0 30px #ffa500); }
        }
        @keyframes save-pulse {
          0%, 100% { opacity: 0.3; transform: scale(2); }
          50% { opacity: 0.6; transform: scale(2.5); }
        }
        @keyframes battle-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2);
          }
        }
        @keyframes battle-flash {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1.1); }
          50% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-blink { animation: blink 1s infinite; }
        .animate-bounce-slow { animation: bounce-slow 0.5s infinite; }
        .animate-soul-pulse { animation: soul-pulse 2s ease-in-out infinite; }
        .animate-soul-float { animation: soulFloat 15s ease-in-out infinite; }
        .animate-bone-rise { animation: bone-rise 3s ease-out forwards; }
        .animate-save-twinkle { animation: save-twinkle 2s ease-in-out infinite; }
        .animate-save-glow { animation: save-glow 2s ease-in-out infinite; }
        .animate-save-pulse { animation: save-pulse 2s ease-in-out infinite; }
        .animate-battle-pulse { animation: battle-pulse 2s ease-in-out infinite; }
        .animate-battle-flash { animation: battle-flash 0.8s ease-out forwards; }
        .animate-screen-shake { animation: screen-shake 0.15s ease-in-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }

        /* Reduced motion: disable all animations */
        @media (prefers-reduced-motion: reduce) {
          .animate-blink,
          .animate-bounce-slow,
          .animate-soul-pulse,
          .animate-soul-float,
          .animate-bone-rise,
          .animate-save-twinkle,
          .animate-save-glow,
          .animate-save-pulse,
          .animate-battle-pulse,
          .animate-battle-flash,
          .animate-screen-shake,
          .animate-float {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
