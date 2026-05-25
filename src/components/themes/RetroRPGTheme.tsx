'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
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
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// Battle reveal section with soul animation
function BattleRevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.2 })
  const [phase, setPhase] = useState<'hidden' | 'battle' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('battle')
      setTimeout(() => setPhase('revealed'), 800)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Battle animation overlay */}
      {phase === 'battle' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
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
          transition: 'all 0.4s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Soul heart types with colors
const SOUL_COLORS = {
  red: '#ff0000',     // Determination
  cyan: '#00ffff',    // Patience
  orange: '#ffa500',  // Bravery
  blue: '#0066ff',    // Integrity
  purple: '#9900ff',  // Perseverance
  green: '#00ff00',   // Kindness
  yellow: '#ffff00',  // Justice
}

// Floating soul hearts animation
function FloatingSoulHearts() {
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
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-soul-float"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            fontSize: h.size,
            color: h.color,
            filter: `drop-shadow(0 0 ${h.size / 2}px ${h.color})`,
            animation: `soulFloat ${h.speed}s ease-in-out infinite, soulWobble ${h.wobble / 10}s ease-in-out infinite`,
            animationDelay: `${-h.speed * Math.random()}s`,
          }}
        >
          ❤
        </div>
      ))}
    </div>
  )
}

// Attack pattern: Bones
function BoneAttackPattern() {
  const [bones, setBones] = useState<Array<{
    id: number
    x: number
    y: number
    rotation: number
    height: number
    delay: number
  }>>([])

  useEffect(() => {
    const newBones = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + i * 12,
      y: Math.random() * 20 + 85,
      rotation: Math.random() * 30 - 15,
      height: Math.random() * 40 + 30,
      delay: i * 0.3,
    }))
    setBones(newBones)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
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
          {/* Bone shape using unicode and CSS */}
          <div
            className="flex flex-col items-center"
            style={{
              color: '#ffffff',
              textShadow: '0 0 5px #fff',
              opacity: 0.15,
            }}
          >
            <span style={{ fontSize: '12px' }}>●</span>
            <div
              style={{
                width: '6px',
                height: `${b.height}px`,
                background: 'linear-gradient(90deg, #ccc, #fff, #ccc)',
                borderRadius: '3px',
              }}
            />
            <span style={{ fontSize: '12px' }}>●</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Golden flowers (Flowey's flowers)
function GoldenFlowers() {
  return (
    <>
      {/* Top left flower cluster */}
      <div className="fixed top-4 left-4 pointer-events-none z-[4] opacity-40">
        <div className="animate-flower-sway" style={{ animationDelay: '0s' }}>
          <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px #ffd700)' }}>🌻</span>
        </div>
        <div className="absolute -top-2 left-6 animate-flower-sway" style={{ animationDelay: '0.5s' }}>
          <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 6px #ffd700)' }}>🌻</span>
        </div>
      </div>
      {/* Bottom right flower cluster */}
      <div className="fixed bottom-4 right-4 pointer-events-none z-[4] opacity-40">
        <div className="animate-flower-sway" style={{ animationDelay: '0.3s' }}>
          <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px #ffd700)' }}>🌻</span>
        </div>
        <div className="absolute -bottom-2 right-6 animate-flower-sway" style={{ animationDelay: '0.8s' }}>
          <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 6px #ffd700)' }}>🌻</span>
        </div>
      </div>
      {/* Top right single flower */}
      <div className="fixed top-8 right-8 pointer-events-none z-[4] opacity-30">
        <div className="animate-flower-sway" style={{ animationDelay: '1s' }}>
          <span style={{ fontSize: '20px', filter: 'drop-shadow(0 0 6px #ffd700)' }}>🌻</span>
        </div>
      </div>
    </>
  )
}

// SAVE point star
function SavePointStar({ isNearby = false }: { isNearby?: boolean }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${isNearby ? 'animate-save-glow' : ''}`}
    >
      <span
        className="text-2xl animate-save-twinkle"
        style={{
          color: '#ffff00',
          filter: 'drop-shadow(0 0 10px #ffff00) drop-shadow(0 0 20px #ffa500)',
          textShadow: '0 0 10px #ffff00, 0 0 20px #ffa500',
        }}
      >
        ★
      </span>
      {isNearby && (
        <div
          className="absolute inset-0 animate-save-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
        />
      )}
    </div>
  )
}

// Battle box with pulsing border
function BattleBox({
  children,
  isActive = false,
  color = '#fff',
}: {
  children: React.ReactNode
  isActive?: boolean
  color?: string
}) {
  return (
    <div
      className={`relative p-1 ${isActive ? 'animate-battle-pulse' : ''}`}
      style={{
        border: `4px solid ${color}`,
        boxShadow: isActive ? `0 0 20px ${color}40, inset 0 0 10px ${color}20` : 'none',
      }}
    >
      <div className="p-4 bg-black min-h-[200px] relative overflow-hidden">
        {/* Battle box corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/30" />
        {children}
      </div>
    </div>
  )
}

// Screen flash effect
function ScreenFlash({ trigger }: { trigger: number }) {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (trigger > 0) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 100)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  if (!flash) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 bg-white"
      style={{ opacity: 0.3 }}
    />
  )
}

// Battle menu option
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
  return (
    <button
      onClick={onClick}
      className="relative px-6 py-3 transition-all hover:scale-105"
      style={{
        background: isSelected ? color : 'transparent',
        border: `4px solid ${color}`,
        color: isSelected ? '#000' : color,
        boxShadow: isSelected ? `0 0 15px ${color}60` : 'none',
      }}
    >
      {isSelected && (
        <span className="absolute left-2 animate-bounce-slow">❤</span>
      )}
      <span className="text-sm tracking-wider font-bold ml-4">
        {icon} {label}
      </span>
    </button>
  )
}

// Dialogue box with typing effect
function DialogueBox({ text, speaker }: { text: string; speaker: string }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
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
  }, [text])

  return (
    <div className="relative p-1" style={{ border: '4px solid #fff' }}>
      <div className="p-4 bg-black">
        <span className="text-yellow-400 text-sm">* {speaker}</span>
        <p className="text-white text-sm mt-2 leading-relaxed min-h-[60px]">
          {displayed}
          <span className="animate-blink">|</span>
        </p>
      </div>
    </div>
  )
}

// Stat bar (HP style)
function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-20 text-white">{label}</span>
      <div className="flex-1 h-4 bg-[#333] border-2 border-white">
        <div
          className="h-full transition-all"
          style={{
            width: `${(value / max) * 100}%`,
            background: color,
          }}
        />
      </div>
      <span className="text-xs text-white w-12 text-right">
        {value}/{max}
      </span>
    </div>
  )
}

// Tech stack display (Undertale item inventory style)
function TechInventory({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="border-4 border-white p-4 bg-black max-h-[400px] overflow-y-auto">
      <p className="text-yellow-400 text-xs mb-4">TECH STACK</p>
      {categories.map((category) => (
        <div key={category.name} className="mb-6">
          <p className="text-green-400 text-xs mb-2 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {category.items.map((tech) => (
              <div
                key={tech}
                className="text-[10px] px-2 py-1 border border-white/30 text-white hover:bg-white hover:text-black transition-colors cursor-default"
              >
                * {tech}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skills display for drummer/fighter
function SkillsDisplay({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="border-4 border-white p-4 bg-black">
      <p className="text-yellow-400 text-xs mb-4">SKILLS</p>
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.name}>
            <p className="text-green-400 text-xs mb-2 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name.toUpperCase()}
            </p>
            <ul className="space-y-1">
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="text-[10px] text-white flex items-center gap-2"
                >
                  <span className="text-red-500">❤</span>
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

// Company card (Undertale shop style)
function CompanyShopItem({ company }: { company: (typeof COMPANIES)[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 border-2 border-white hover:bg-white hover:text-black transition-colors group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{company.icon}</span>
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
    </a>
  )
}

// Work experience card (Undertale style)
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div className="p-3 border-2 border-white mb-2 hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xs font-bold text-white">
            * {entry.title}
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
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[9px] text-cyan-400 flex items-start gap-1">
              <span className="text-red-500">❤</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Band card (Undertale encounter style)
function BandEncounter({ band }: { band: (typeof BANDS)[0] }) {
  const content = (
    <div className="p-3 border-2 border-purple-500 hover:bg-purple-500 hover:text-black transition-colors group">
      <h4 className="text-xs font-bold text-white group-hover:text-black">
        * {band.name} appears!
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

// Current roles display
function RolesDisplay() {
  return (
    <div className="border-4 border-yellow-400 p-4 bg-black">
      <p className="text-yellow-400 text-xs mb-4 flex items-center gap-2">
        <span className="animate-pulse">★</span>
        CURRENT ROLES
        <span className="animate-pulse">★</span>
      </p>
      <div className="space-y-3">
        {CURRENT_ROLES.map((role) => (
          <div key={role.id} className="flex items-center gap-3">
            <span className="text-red-500 animate-pulse">❤</span>
            <div>
              <p className="text-white text-xs">
                {role.title} @ <span className="text-cyan-400">{role.company}</span>
              </p>
              <p className="text-[8px] text-white/60">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RetroRPGTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>('act')
  const [flashTrigger, setFlashTrigger] = useState(0)
  const [screenShake, setScreenShake] = useState(false)

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
    setFlashTrigger((prev) => prev + 1)
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 150)
    setSelectedAction(action)
  }, [])

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
        screenShake ? 'animate-screen-shake' : ''
      }`}
      style={{ fontFamily: '"Press Start 2P", "Courier New", monospace' }}
    >
      {/* Screen flash effect */}
      <ScreenFlash trigger={flashTrigger} />

      {/* Visual decorations */}
      <FloatingSoulHearts />
      <BoneAttackPattern />
      <GoldenFlowers />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
      />

      {/* Header */}
      <header className="relative z-30 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Professional headline */}
          <div className="text-center mb-4">
            <h1 className="text-white text-xl tracking-wider mb-2">ALEXANDER PULIDO</h1>
            <p className="text-yellow-400 text-[10px] tracking-wide">
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-cyan-400 text-[8px] mt-1 italic">
              * {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-2xl text-red-500 animate-pulse">❤</span>
              <div>
                <p className="text-white text-sm">LV 35</p>
                <p className="text-yellow-400 text-xs">{config.title.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Link
                href="/cv"
                className="px-3 py-2 text-[10px] bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors flex items-center gap-2"
              >
                <SavePointStar isNearby />
                SAVE
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-3 py-2 text-[10px] bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
              >
                ◆ GAME
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Current Roles section */}
      <section className="relative z-20 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <RolesDisplay />
        </div>
      </section>

      {/* Main battle area */}
      <main className="relative z-20 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats bar */}
          <div className="mb-8 p-4 border-4 border-white bg-black">
            <div className="grid grid-cols-3 gap-4">
              <StatBar label="HP" value={92} max={100} color="#00ff00" />
              <StatBar label="EXP" value={350} max={500} color="#ffff00" />
              <StatBar label="GOLD" value={999} max={999} color="#ffa500" />
            </div>
          </div>

          {/* Battle box / main content */}
          <div className="mb-8">
            <BattleBox isActive={!!selectedAction} color="#fff">
              {/* "Enemy" display - Profile */}
              <div className="text-center mb-8">
                <div
                  className="inline-block w-32 h-32 mb-4 border-4 border-white relative overflow-hidden"
                  style={{ background: 'linear-gradient(180deg, #222, #000)' }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-5xl animate-float">
                    {active === 'engineer'
                      ? '💻'
                      : active === 'drummer'
                      ? '🥁'
                      : '🥋'}
                  </span>
                  {/* Spear attack decoration around portrait */}
                  <div className="absolute -top-2 -left-2 text-white opacity-30 rotate-45">
                    |
                  </div>
                  <div className="absolute -top-2 -right-2 text-white opacity-30 -rotate-45">
                    |
                  </div>
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
                  <div className="grid grid-cols-3 gap-2">
                    {professionOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActive(opt.id as 'engineer' | 'drummer' | 'fighter')
                          setFlashTrigger((prev) => prev + 1)
                        }}
                        className={`p-3 text-left transition-colors border-2 ${
                          active === opt.id
                            ? 'border-yellow-400 bg-yellow-400 text-black'
                            : 'border-white text-white hover:bg-white hover:text-black'
                        }`}
                      >
                        <div className="text-xs flex items-center gap-2">
                          {active === opt.id && (
                            <span className="text-red-500">❤</span>
                          )}
                          <span>{opt.label}</span>
                        </div>
                        <div className="text-[8px] mt-1 opacity-60">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech/Skills display (ITEM menu style) */}
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
                  <p className="text-red-400 text-xs mb-4">PROJECTS</p>

                  {/* Featured Projects */}
                  <div className="mb-6">
                    <p className="text-white text-xs mb-2">FEATURED WORK:</p>
                    <div className="space-y-2">
                      {projects
                        .filter((p) => p.featured)
                        .slice(0, 4)
                        .map((project) => (
                          <Link
                            key={project.id}
                            href={project.links?.demo || '#'}
                            className="block p-3 text-white text-xs border-2 border-white hover:bg-red-500 hover:border-red-500 transition-colors"
                          >
                            <div className="flex justify-between">
                              <span>* {project.name}</span>
                              {project.featured && (
                                <span className="text-yellow-400">★</span>
                              )}
                            </div>
                            <p className="text-[8px] mt-1 opacity-60">
                              {project.tagline}
                            </p>
                            {project.impact && (
                              <p className="text-[8px] mt-1 text-cyan-400">
                                → {project.impact}
                              </p>
                            )}
                          </Link>
                        ))}
                    </div>
                  </div>

                  {/* Companies for engineer */}
                  {active === 'engineer' && (
                    <div className="mb-6">
                      <p className="text-white text-xs mb-2">COMPANIES:</p>
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
                      <p className="text-white text-xs mb-2">BANDS:</p>
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
                  <p className="text-purple-400 text-xs mb-2">ABOUT</p>
                  <DialogueBox speaker="ALEXANDER" text={aboutData.bio} />
                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {aboutData.quickFacts.map((fact, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 border border-purple-500 text-purple-400"
                      >
                        * {fact}
                      </span>
                    ))}
                  </div>

                  {/* Work Experience section */}
                  {experience.length > 0 && (
                    <>
                      <p className="text-purple-400 text-xs mb-2 mt-4 border-t border-purple-500/30 pt-4">WORK EXPERIENCE</p>
                      <div className="space-y-2">
                        {experience.map((entry) => (
                          <ExperienceCard key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </BattleBox>
          </div>

          {/* Battle menu */}
          <div className="grid grid-cols-4 gap-2">
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <p className="text-white text-[8px] tracking-widest">
          * The power of coding shines within you.
        </p>
        <p className="text-yellow-400 text-[8px] mt-2 flex items-center justify-center gap-2">
          <span className="text-red-500">❤</span>
          DETERMINATION
          <span className="text-red-500">❤</span>
        </p>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes soulFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-30px) scale(1.1);
          }
          50% {
            transform: translateY(-15px) scale(0.95);
          }
          75% {
            transform: translateY(-40px) scale(1.05);
          }
        }
        @keyframes soulWobble {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(10px) rotate(5deg);
          }
          75% {
            transform: translateX(-10px) rotate(-5deg);
          }
        }
        @keyframes bone-rise {
          0% {
            transform: translateY(100%) rotate(var(--rotation, 0deg));
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
            opacity: 0.15;
          }
          100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
            opacity: 0.15;
          }
        }
        @keyframes flower-sway {
          0%,
          100% {
            transform: rotate(-5deg) scale(1);
          }
          50% {
            transform: rotate(5deg) scale(1.05);
          }
        }
        @keyframes save-twinkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        @keyframes save-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 10px #ffff00);
          }
          50% {
            filter: drop-shadow(0 0 20px #ffff00) drop-shadow(0 0 30px #ffa500);
          }
        }
        @keyframes save-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(2);
          }
          50% {
            opacity: 0.6;
            transform: scale(2.5);
          }
        }
        @keyframes battle-pulse {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
              inset 0 0 10px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.4),
              inset 0 0 15px rgba(255, 255, 255, 0.2);
          }
        }
        @keyframes battle-flash {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1.1); }
          50% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        .animate-battle-flash {
          animation: battle-flash 0.8s ease-out forwards;
        }
        @keyframes screen-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 0.5s infinite;
        }
        .animate-soul-float {
          animation: soulFloat 15s ease-in-out infinite;
        }
        .animate-bone-rise {
          animation: bone-rise 3s ease-out forwards;
        }
        .animate-flower-sway {
          animation: flower-sway 4s ease-in-out infinite;
        }
        .animate-save-twinkle {
          animation: save-twinkle 2s ease-in-out infinite;
        }
        .animate-save-glow {
          animation: save-glow 2s ease-in-out infinite;
        }
        .animate-save-pulse {
          animation: save-pulse 2s ease-in-out infinite;
        }
        .animate-battle-pulse {
          animation: battle-pulse 2s ease-in-out infinite;
        }
        .animate-screen-shake {
          animation: screen-shake 0.15s ease-in-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
