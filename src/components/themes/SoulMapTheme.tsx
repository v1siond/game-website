'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

// Undead Warrior Alexander - Dark Souls style
function UndeadWarrior({
  size = 60,
  direction = 'right',
  className = ''
}: {
  size?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 160)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Undead Warrior"
        fill
        className="object-contain"
        style={{ filter: 'brightness(0.7) contrast(1.4) sepia(0.2)' }}
      />
      {/* Ember glow effect */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,100,0,0.3) 0%, transparent 60%)',
        }}
      />
    </div>
  )
}

// Profession-specific ember ornaments
function EmberOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { icon: '⚙️', x: 5, y: 20, size: 28 },
      { icon: '💻', x: 92, y: 30, size: 26 },
      { icon: '🔧', x: 6, y: 70, size: 24 },
      { icon: '📟', x: 90, y: 75, size: 26 },
    ],
    drummer: [
      { icon: '🥁', x: 4, y: 25, size: 30 },
      { icon: '🎹', x: 90, y: 20, size: 28 },
      { icon: '🎵', x: 6, y: 65, size: 24 },
      { icon: '🎶', x: 92, y: 70, size: 26 },
    ],
    fighter: [
      { icon: '⚔️', x: 5, y: 22, size: 28 },
      { icon: '🛡️', x: 90, y: 28, size: 26 },
      { icon: '👊', x: 6, y: 68, size: 26 },
      { icon: '🔥', x: 92, y: 72, size: 28 },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-ember-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.4,
            filter: 'drop-shadow(0 0 8px rgba(255,100,0,0.6))',
            animation: `emberFloat ${12 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// Dodge roll reveal section
function DodgeRollSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'rolling' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('rolling')
      setTimeout(() => setPhase('revealed'), 700)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Dodge roll animation */}
      {phase === 'rolling' && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ animation: 'dodgeRoll 0.7s ease-out forwards' }}
          >
            <UndeadWarrior size={50} direction="right" />
          </div>
          {/* I-frame flash */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(255,200,100,0.2) 0%, transparent 50%)',
              animation: 'iframeFlash 0.3s ease-out 2',
            }}
          />
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'all 0.4s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Souls counter - floating soul particles
function SoulsCounter({ count }: { count: number }) {
  return (
    <div className="fixed top-6 right-24 z-40 flex items-center gap-2">
      {/* Soul orb */}
      <div className="relative">
        <div
          className="w-6 h-6 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #88ffff, #00aacc 50%, #006688)',
            boxShadow: '0 0 15px #00ccff, 0 0 30px #00aacc40',
          }}
        />
        {/* Soul particles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-soul-float"
            style={{
              left: '50%',
              top: '50%',
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <span className="text-sm font-bold tracking-wider" style={{ color: '#88ffff', textShadow: '0 0 10px #00ccff' }}>
        {count.toLocaleString()}
      </span>
    </div>
  )
}

// Animated Bonfire component
function Bonfire({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) {
  const scales = { small: 0.5, normal: 1, large: 1.5 }
  const scale = scales[size]

  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Sword in ground */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-1.5 h-14"
        style={{
          background: 'linear-gradient(to bottom, #888, #333)',
          boxShadow: '0 0 5px rgba(0,0,0,0.8)',
        }}
      >
        {/* Sword crossguard */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2"
          style={{ background: 'linear-gradient(to bottom, #666, #444)' }}
        />
        {/* Sword handle */}
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-4"
          style={{ background: '#553311' }}
        />
      </div>

      {/* Fire base */}
      <div className="relative w-16 h-12">
        {/* Main flames */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 animate-flame"
            style={{
              left: `${10 + i * 15}%`,
              width: `${12 + Math.random() * 8}px`,
              height: `${20 + Math.random() * 20}px`,
              background: `linear-gradient(to top, #ff4400, #ff8800 40%, #ffcc00 70%, transparent)`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animationDelay: `${i * 0.15}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Embers */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-ember"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: '30%',
              background: i % 2 === 0 ? '#ff6600' : '#ffaa00',
              animationDelay: `${i * 0.4}s`,
              boxShadow: '0 0 3px #ff6600',
            }}
          />
        ))}

        {/* Glow */}
        <div
          className="absolute inset-0 -bottom-4"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, #ff660040, transparent 70%)',
          }}
        />
      </div>

      {/* Coal base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, #442200, #221100)',
          boxShadow: 'inset 0 -2px 4px #ff330020',
        }}
      />
    </div>
  )
}

// Fog Gate - misty barrier as section divider
function FogGate() {
  return (
    <div className="relative h-16 w-full overflow-hidden my-8">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main fog layers */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 animate-fog-drift"
            style={{
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(150, 180, 200, ${0.1 - i * 0.02}) 20%,
                rgba(200, 220, 240, ${0.15 - i * 0.03}) 50%,
                rgba(150, 180, 200, ${0.1 - i * 0.02}) 80%,
                transparent 100%
              )`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        ))}

        {/* Fog particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-fog-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${10 + Math.random() * 20}px`,
              background: `radial-gradient(ellipse, rgba(200, 220, 240, ${0.1 + Math.random() * 0.1}), transparent)`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(4px)',
            }}
          />
        ))}

        {/* Interaction prompt */}
        <div className="relative z-10 text-center">
          <span
            className="text-xs tracking-widest animate-pulse"
            style={{ color: '#aabbcc80', textShadow: '0 0 10px #aabbcc40' }}
          >
            TRAVERSE THE FOG
          </span>
        </div>
      </div>
    </div>
  )
}

// Bloodstain decoration
function Bloodstain({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" className="opacity-30">
        <ellipse cx="15" cy="18" rx="12" ry="8" fill="#660000" />
        <ellipse cx="15" cy="16" rx="8" ry="5" fill="#880000" />
        <circle cx="10" cy="10" r="3" fill="#770000" />
        <circle cx="20" cy="8" r="2" fill="#660000" />
      </svg>
    </div>
  )
}

// Estus Flask
function EstusFlask({ charges = 5, maxCharges = 5 }: { charges?: number; maxCharges?: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* Flask */}
      <div className="relative w-8 h-12">
        {/* Flask body */}
        <div
          className="absolute bottom-0 w-full h-10 rounded-b-lg"
          style={{
            background: 'linear-gradient(to right, #553300, #774411, #553300)',
            border: '2px solid #442200',
          }}
        />
        {/* Flask neck */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-4 rounded-t"
          style={{
            background: 'linear-gradient(to right, #442200, #553300, #442200)',
          }}
        />
        {/* Liquid */}
        <div
          className="absolute bottom-1 left-1 right-1 rounded-b-md animate-liquid-glow"
          style={{
            height: `${(charges / maxCharges) * 70}%`,
            background: 'linear-gradient(to top, #ff6600, #ff8800, #ffaa00)',
            boxShadow: '0 0 10px #ff6600, inset 0 0 10px #ffcc0060',
          }}
        />
      </div>
      {/* Charge count */}
      <span className="text-sm font-bold" style={{ color: '#ff8800' }}>
        {charges}/{maxCharges}
      </span>
    </div>
  )
}

// Darksign - Sun eclipse symbol
function Darksign({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer ring - dark flame */}
      <div
        className="absolute inset-0 rounded-full animate-darksign-pulse"
        style={{
          background: 'radial-gradient(circle, transparent 40%, #ff4400 50%, #cc2200 60%, #660000 70%, transparent 75%)',
          boxShadow: '0 0 20px #ff440040, inset 0 0 15px #ff440020',
        }}
      />
      {/* Inner dark circle */}
      <div
        className="absolute rounded-full"
        style={{
          top: '15%',
          left: '15%',
          right: '15%',
          bottom: '15%',
          background: 'radial-gradient(circle at 30% 30%, #1a1a1a, #000)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
        }}
      />
    </div>
  )
}

// YOU DIED text effect
function YouDied({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-you-died">
      <div
        className="text-6xl md:text-8xl font-serif tracking-[0.5em] uppercase"
        style={{
          color: '#8b0000',
          textShadow: '0 0 50px #ff0000, 0 0 100px #660000',
          filter: 'blur(0.5px)',
        }}
      >
        YOU DIED
      </div>
    </div>
  )
}

// Sword stuck in ground - rest point marker
function SwordMarker() {
  return (
    <div className="relative w-6 h-16">
      {/* Blade */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-10"
        style={{
          background: 'linear-gradient(to bottom, #ccc, #888 30%, #666)',
          boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        }}
      />
      {/* Crossguard */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded"
        style={{ background: 'linear-gradient(to bottom, #555, #333)' }}
      />
      {/* Handle */}
      <div
        className="absolute top-9 left-1/2 -translate-x-1/2 w-1.5 h-4"
        style={{ background: '#442211' }}
      />
      {/* Pommel */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
        style={{ background: '#333' }}
      />
    </div>
  )
}

// Map fog/unexplored area effect - Dark Souls style
function MapFog() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2]">
      {/* Dark vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 30%, rgba(5, 5, 8, 0.9) 100%)
          `,
        }}
      />
      {/* Ash particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gray-400 animate-ash-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Zone/Room node on the map - Dark Souls bonfire style
function ZoneNode({
  profession,
  isActive,
  isExplored,
  onClick,
  connections,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  isExplored: boolean
  onClick: () => void
  connections: Array<{ direction: 'up' | 'down' | 'left' | 'right' }>
}) {
  const zones = {
    engineer: { name: 'FIRELINK CORE', icon: null, color: '#ff8800', description: 'System Architecture' },
    drummer: { name: 'DEPTHS OF RHYTHM', icon: null, color: '#9966ff', description: 'Musical Prowess' },
    fighter: { name: 'ARENA OF DUELS', icon: null, color: '#ff4444', description: 'Combat Mastery' },
  }
  const zone = zones[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-500 ${
        isActive ? 'scale-110 z-20' : 'hover:scale-105 opacity-70 hover:opacity-100'
      }`}
    >
      {/* Connection lines - ancient stone paths */}
      {connections.map((conn, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...(conn.direction === 'up' && { top: '-30px', left: '50%', width: '3px', height: '30px', transform: 'translateX(-50%)' }),
            ...(conn.direction === 'down' && { bottom: '-30px', left: '50%', width: '3px', height: '30px', transform: 'translateX(-50%)' }),
            ...(conn.direction === 'left' && { left: '-30px', top: '50%', width: '30px', height: '3px', transform: 'translateY(-50%)' }),
            ...(conn.direction === 'right' && { right: '-30px', top: '50%', width: '30px', height: '3px', transform: 'translateY(-50%)' }),
            background: `linear-gradient(${conn.direction === 'left' || conn.direction === 'right' ? '90deg' : '180deg'}, transparent, #33221180, transparent)`,
          }}
        />
      ))}

      {/* Zone container */}
      <div
        className="w-32 h-24 flex flex-col items-center justify-center relative"
        style={{
          background: isActive
            ? `radial-gradient(ellipse at 50% 80%, ${zone.color}30, #0d0a0f 70%)`
            : isExplored
            ? 'linear-gradient(180deg, #0d0a0f, #151015)'
            : '#0a0808',
          border: `2px solid ${isActive ? zone.color : isExplored ? '#2a2025' : '#151015'}`,
          boxShadow: isActive
            ? `0 0 40px ${zone.color}30, inset 0 0 30px ${zone.color}15`
            : 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Mini bonfire when active */}
        {isActive && (
          <div className="absolute -top-8">
            <Bonfire size="small" />
          </div>
        )}

        {/* Zone icon - sword marker when not active */}
        {!isActive && isExplored && (
          <div className="absolute -top-10 scale-50">
            <SwordMarker />
          </div>
        )}

        <span
          className="text-[9px] tracking-[0.3em] font-bold mt-2"
          style={{ color: isActive ? zone.color : '#555045' }}
        >
          {zone.name}
        </span>
        <span
          className="text-[8px] tracking-wider mt-1"
          style={{ color: isActive ? '#aaa' : '#444' }}
        >
          {zone.description}
        </span>
      </div>

      {/* Rest at bonfire prompt */}
      {isActive && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[8px] tracking-widest animate-pulse" style={{ color: '#ff880080' }}>
            BONFIRE LIT
          </span>
        </div>
      )}
    </button>
  )
}

// Ability unlock display - Dark Souls stat style
function AbilityUnlock({ name, level, unlocked }: { name: string; level: number; unlocked: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 py-2 transition-all border-b ${
        unlocked ? '' : 'opacity-30'
      }`}
      style={{ borderColor: '#1a1518' }}
    >
      <div
        className="w-8 h-8 flex items-center justify-center"
        style={{
          background: unlocked ? '#ff660015' : '#0a0808',
          border: `1px solid ${unlocked ? '#ff660040' : '#1a1518'}`,
        }}
      >
        {unlocked ? (
          <Darksign size={16} />
        ) : (
          <span className="text-sm" style={{ color: '#333' }}>?</span>
        )}
      </div>
      <span className="text-xs flex-1 tracking-wide" style={{ color: unlocked ? '#c0b0a0' : '#444' }}>
        {unlocked ? name : '???'}
      </span>
      {/* Level bar - souls style */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-4"
            style={{
              background: i < level
                ? 'linear-gradient(to top, #ff6600, #ff8800)'
                : '#151015',
              boxShadow: i < level ? '0 0 5px #ff660040' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Save room style project card - Bonfire checkpoint
function SaveRoomCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="p-4 group cursor-pointer transition-all relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #12100f, #0a0908)',
        border: '1px solid #2a2520',
      }}
    >
      {/* Ember glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #ff660010, transparent 70%)',
        }}
      />

      {/* Save point indicator - small ember */}
      <div className="flex items-center gap-2 mb-2 relative">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: project.featured
              ? 'radial-gradient(circle, #ffaa00, #ff6600)'
              : 'radial-gradient(circle, #666, #333)',
            boxShadow: project.featured ? '0 0 10px #ff660060' : 'none',
          }}
        />
        <h3 className="text-sm tracking-wide" style={{ color: project.featured ? '#ffaa66' : '#8a8070' }}>
          {project.name}
        </h3>
      </div>
      <p className="text-[10px] mb-3 leading-relaxed" style={{ color: '#666050' }}>
        {project.tagline}
      </p>
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5 tracking-wide"
            style={{
              background: '#1a1815',
              color: '#887860',
              border: '1px solid #2a2520',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Company card - Dark Souls merchant style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 group transition-all relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #12100f, #0a0908)',
        border: '1px solid #2a2520',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #ff880010, transparent 70%)',
        }}
      />

      <div className="flex items-center gap-3 mb-2 relative">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm tracking-wide group-hover:text-orange-300 transition-colors" style={{ color: '#c0a080' }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: '#ff8800' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#666050' }}>{company.description}</p>

      {/* External link indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px]" style={{ color: '#ff880060' }}>TRAVEL</span>
      </div>
    </a>
  )
}

// Band card - Dark Souls covenant style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 group transition-all relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #12100f, #0a0908)',
        border: '1px solid #2a2520',
      }}
    >
      {/* Hover glow - purple for music */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #9966ff10, transparent 70%)',
        }}
      />

      <h4 className="text-sm tracking-wide group-hover:text-purple-300 transition-colors" style={{ color: '#b090d0' }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: '#9966ff' }}>{band.genre} - {band.role}</p>
      <p className="text-xs mt-2 leading-relaxed" style={{ color: '#666050' }}>{band.description}</p>
      {!band.url && (
        <p className="text-[10px] mt-2 italic" style={{ color: '#444' }}>Covenant forming...</p>
      )}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Work experience card - Dark Souls item description style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4 relative"
      style={{
        background: 'linear-gradient(180deg, #12100f, #0a0908)',
        border: '1px solid #2a2520',
      }}
    >
      {/* Ember accent on left */}
      <div
        className="absolute left-0 top-4 bottom-4 w-1"
        style={{
          background: 'linear-gradient(to bottom, #ff660000, #ff6600, #ff660000)',
          boxShadow: '0 0 8px #ff660040',
        }}
      />

      <div className="flex justify-between items-start mb-2 pl-3">
        <div>
          <h4 className="text-sm tracking-wide" style={{ color: '#c0a080' }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: '#ff8800' }}>{entry.organization}</p>
        </div>
        <span className="text-[10px] tracking-wide" style={{ color: '#666050' }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2 pl-3 leading-relaxed" style={{ color: '#807060' }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="pl-3 space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#a09080' }}>
              <span style={{ color: '#ff660080' }}>◆</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Tech stack for engineer - Dark Souls attribute style
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: '#886640' }}>
            <Darksign size={12} />
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: '#12100f',
                  border: '1px solid #2a2520',
                  color: '#a09080',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Mini-map component - Dark Souls style
function MiniMap({ active }: { active: string }) {
  const positions = {
    engineer: { x: 1, y: 1 },
    drummer: { x: 2, y: 0 },
    fighter: { x: 0, y: 2 },
  }
  const pos = positions[active as keyof typeof positions]

  return (
    <div
      className="fixed bottom-6 right-6 p-3 z-30"
      style={{
        background: 'linear-gradient(180deg, #0d0a0fee, #05050899)',
        border: '2px solid #2a2520',
        boxShadow: '0 0 20px rgba(0,0,0,0.8)',
      }}
    >
      <div className="text-[8px] tracking-widest mb-2 text-center" style={{ color: '#666050' }}>
        LORDRAN
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = i % 3
          const y = Math.floor(i / 3)
          const isCurrent = pos.x === x && pos.y === y
          return (
            <div
              key={i}
              className="w-4 h-4 relative"
              style={{
                background: isCurrent
                  ? 'radial-gradient(circle, #ff8800, #ff440080)'
                  : '#1a1815',
                boxShadow: isCurrent ? '0 0 10px #ff880060' : 'none',
                border: '1px solid #2a2520',
              }}
            >
              {isCurrent && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Current roles - Dark Souls covenant ranks
function RolesDisplay() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {CURRENT_ROLES.map((role) => (
        <div
          key={role.id}
          className="text-center px-4 py-2 relative"
          style={{
            background: 'linear-gradient(180deg, transparent, #ff880008)',
            borderBottom: '1px solid #ff880040',
          }}
        >
          <p className="text-xs tracking-[0.2em]" style={{ color: '#ff8800' }}>{role.title}</p>
          <p className="text-sm mt-1" style={{ color: '#c0b0a0' }}>{role.company}</p>
        </div>
      ))}
    </div>
  )
}

export default function SoulMapTheme() {
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [explored, setExplored] = useState<Set<string>>(new Set(['engineer']))
  const [souls, setSouls] = useState(125890)
  const [showDeath, setShowDeath] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const skills = getSkillsByProfession(active)
  const otherSkills = getSkillsByProfession(active)
  const engineerTech = getEngineerSkills()
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
    // Increment souls slowly for effect
    const interval = setInterval(() => {
      setSouls(s => s + Math.floor(Math.random() * 10))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleZoneClick = (prof: 'engineer' | 'drummer' | 'fighter') => {
    setActive(prof)
    setExplored(prev => new Set([...prev, prof]))
  }

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0808, #050505)',
        fontFamily: '"Cinzel", "Times New Roman", serif',
      }}
    >
      {/* Map effects */}
      <MapFog />

      {/* Profession ornaments */}
      <EmberOrnaments profession={active} />

      {/* Souls counter */}
      <SoulsCounter count={souls} />

      {/* YOU DIED overlay */}
      <YouDied show={showDeath} />

      {/* Scattered bloodstains */}
      <Bloodstain className="fixed top-32 left-[10%] z-[1]" />
      <Bloodstain className="fixed top-[60%] right-[15%] z-[1] rotate-45" />
      <Bloodstain className="fixed bottom-40 left-[30%] z-[1] -rotate-12" />

      {/* Header with Darksign */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Darksign size={50} />
            <div>
              <h1
                className="text-3xl tracking-[0.4em]"
                style={{
                  color: '#c0a060',
                  textShadow: '0 0 30px #ff880030',
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm mt-1 tracking-wider" style={{ color: '#888060' }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs mt-1 italic tracking-wide" style={{ color: '#ff8800' }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <EstusFlask charges={5} maxCharges={5} />
            <Link
              href="/cv"
              className="px-4 py-2 text-xs tracking-[0.2em] transition-all hover:bg-[#1a1815]"
              style={{
                background: '#0d0a0f',
                border: '1px solid #ff880040',
                color: '#ff8800',
              }}
            >
              REST
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-xs tracking-[0.2em] transition-all"
              style={{
                background: 'linear-gradient(180deg, #ff8800, #cc6600)',
                color: '#0a0808',
              }}
            >
              EXPLORE
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles / Covenants */}
      <section className="relative z-20 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <RolesDisplay />
        </div>
      </section>

      {/* Fog Gate divider */}
      <FogGate />

      {/* Map navigation with bonfire */}
      <section className="relative z-20 py-8">
        <div className="flex justify-center items-center gap-8">
          <ZoneNode
            profession="drummer"
            isActive={active === 'drummer'}
            isExplored={explored.has('drummer')}
            onClick={() => handleZoneClick('drummer')}
            connections={[{ direction: 'down' }]}
          />
        </div>
        <div className="flex justify-center items-center gap-12 mt-12">
          <ZoneNode
            profession="fighter"
            isActive={active === 'fighter'}
            isExplored={explored.has('fighter')}
            onClick={() => handleZoneClick('fighter')}
            connections={[{ direction: 'right' }]}
          />
          <div className="w-24 flex justify-center">
            <Bonfire size="normal" />
          </div>
          <ZoneNode
            profession="engineer"
            isActive={active === 'engineer'}
            isExplored={explored.has('engineer')}
            onClick={() => handleZoneClick('engineer')}
            connections={[{ direction: 'left' }, { direction: 'up' }]}
          />
        </div>
      </section>

      {/* Fog Gate divider */}
      <FogGate />

      {/* Zone info */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bio panel - item description style */}
          <DodgeRollSection>
          <section
            className="p-6 mb-8 relative"
            style={{
              background: 'linear-gradient(180deg, #12100fee, #0a0908ee)',
              border: '1px solid #2a2520',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Corner ornaments */}
            {['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-[-1]'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6`}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M0 0 L24 0 L24 4 L4 4 L4 24 L0 24 Z" fill="#2a2520" />
                </svg>
              </div>
            ))}

            <div className="flex items-center gap-2 mb-4">
              <SwordMarker />
              <h2 className="text-sm tracking-[0.3em]" style={{ color: '#ff8800' }}>
                ABOUT
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#a09080' }}>
              {aboutData.bio}
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-3 py-1 tracking-wide"
                  style={{
                    background: '#1a1815',
                    color: '#887860',
                    border: '1px solid #2a2520',
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </section>
          </DodgeRollSection>

          {/* Work Experience Section */}
          {experience.length > 0 && (
            <DodgeRollSection>
              <section
                className="p-6 mb-8 relative"
                style={{
                  background: 'linear-gradient(180deg, #12100fee, #0a0908ee)',
                  border: '1px solid #2a2520',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
                }}
              >
                {/* Corner ornaments */}
                {['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-[-1]'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6`}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M0 0 L24 0 L24 4 L4 4 L4 24 L0 24 Z" fill="#2a2520" />
                    </svg>
                  </div>
                ))}

                <div className="flex items-center gap-2 mb-4">
                  <SwordMarker />
                  <h2 className="text-sm tracking-[0.3em]" style={{ color: '#ff8800' }}>
                    WORK EXPERIENCE
                  </h2>
                </div>
                <div className="space-y-3">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            </DodgeRollSection>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Abilities / Tech Stack */}
            <section
              className="p-6 relative"
              style={{
                background: 'linear-gradient(180deg, #12100fee, #0a0908ee)',
                border: '1px solid #2a2520',
              }}
            >
              <h2 className="text-sm tracking-[0.3em] mb-4 flex items-center gap-2" style={{ color: '#ff8800' }}>
                <Darksign size={16} />
                {active === 'engineer' ? 'TECH STACK' : 'SKILLS'}
              </h2>

              {active === 'engineer' ? (
                <TechCloud categories={engineerTech} />
              ) : (
                <div>
                  {skills.map((category) => (
                    <div key={category.name} className="mb-4 last:mb-0">
                      <h3 className="text-[10px] tracking-[0.2em] mb-2" style={{ color: '#886640' }}>
                        {category.name.toUpperCase()}
                      </h3>
                      {category.skills.map((skill, i) => (
                        <AbilityUnlock
                          key={skill.name}
                          name={skill.name}
                          level={skill.proficiency}
                          unlocked={i < 4 || explored.size > 1}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Save rooms / Projects */}
            <section>
              <h2 className="text-sm tracking-[0.3em] mb-4 flex items-center gap-2" style={{ color: '#88cc55' }}>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 10px #88cc55' }} />
                PROJECTS
              </h2>
              <div className="space-y-2">
                {projects.slice(0, 4).map((project) => (
                  <SaveRoomCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          </div>

          {/* Companies (Engineer) */}
          {active === 'engineer' && (
            <section className="mt-8">
              <FogGate />
              <h2 className="text-sm tracking-[0.3em] mb-4 text-center" style={{ color: '#ff8800' }}>
                COMPANIES
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <section className="mt-8">
              <FogGate />
              <h2 className="text-sm tracking-[0.3em] mb-4 text-center" style={{ color: '#9966ff' }}>
                BANDS
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mini-map */}
      <MiniMap active={active} />

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, #2a2520)' }} />
          <Bonfire size="small" />
          <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, #2a2520, transparent)' }} />
        </div>
        <p className="text-[10px] tracking-[0.4em] mt-4" style={{ color: '#444030' }}>
          EXPLORATION: {Math.round((explored.size / 3) * 100)}% • MMXXVI
        </p>
      </footer>

      {/* Dark Souls animations */}
      <style jsx global>{`
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
          50% { transform: scaleY(1.2) scaleX(0.9); opacity: 0.8; }
        }
        @keyframes ember {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-40px) translateX(10px); opacity: 0; }
        }
        @keyframes soul-float {
          0% { transform: translate(-50%, -50%) translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(-30px) rotate(360deg); opacity: 0; }
        }
        @keyframes fog-drift {
          0%, 100% { transform: translateX(-10%); opacity: 0.5; }
          50% { transform: translateX(10%); opacity: 0.8; }
        }
        @keyframes fog-particle {
          0%, 100% { transform: translateX(0) scale(1); opacity: 0.3; }
          50% { transform: translateX(20px) scale(1.2); opacity: 0.5; }
        }
        @keyframes ash-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes darksign-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
        }
        @keyframes liquid-glow {
          0%, 100% { box-shadow: 0 0 10px #ff6600, inset 0 0 10px #ffcc0060; }
          50% { box-shadow: 0 0 20px #ff8800, inset 0 0 15px #ffcc0080; }
        }
        @keyframes you-died {
          0% { opacity: 0; transform: scale(1.5); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        @keyframes emberFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-8px) rotate(5deg); opacity: 0.5; }
          50% { transform: translateY(-3px) rotate(-3deg); opacity: 0.35; }
          75% { transform: translateY(-10px) rotate(3deg); opacity: 0.45; }
        }
        @keyframes dodgeRoll {
          0% { left: -60px; transform: rotate(0deg); }
          50% { transform: rotate(360deg); }
          100% { left: 110%; transform: rotate(720deg); }
        }
        @keyframes iframeFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        .animate-flame { animation: flame 0.3s ease-in-out infinite; }
        .animate-ember-float { animation: emberFloat 12s ease-in-out infinite; }
        .animate-ember { animation: ember 2s ease-out infinite; }
        .animate-soul-float { animation: soul-float 2s ease-out infinite; }
        .animate-fog-drift { animation: fog-drift 10s ease-in-out infinite; }
        .animate-fog-particle { animation: fog-particle 8s ease-in-out infinite; }
        .animate-ash-fall { animation: ash-fall 15s linear infinite; }
        .animate-darksign-pulse { animation: darksign-pulse 3s ease-in-out infinite; }
        .animate-liquid-glow { animation: liquid-glow 2s ease-in-out infinite; }
        .animate-you-died { animation: you-died 4s ease-in-out forwards; }
      `}</style>
    </div>
  )
}
