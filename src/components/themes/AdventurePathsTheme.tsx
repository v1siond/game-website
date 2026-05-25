'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
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
import { useSmoothScroll, useScrollZones, useInViewTrigger } from '@/hooks/useScrollAnimation'

// =============================================================================
// DECORATIVE ELEMENTS - Forest/Adventure themed (no game-specific references)
// =============================================================================

// Generic adventurer silhouette with sword - Alexander warrior
function AdventurerSilhouette({ size = 60 }: { size?: number }) {
  return (
    <svg width={size * 0.5} height={size} viewBox="0 0 30 60" opacity="0.2">
      {/* Head */}
      <ellipse cx="15" cy="8" rx="6" ry="7" fill="currentColor" />
      {/* Cape flowing behind */}
      <path d="M12,15 Q5,25 8,45 L18,40 Q15,25 12,15" fill="currentColor" opacity="0.7" />
      {/* Body/torso */}
      <path d="M10,15 L20,15 L22,35 L8,35 Z" fill="currentColor" />
      {/* Legs */}
      <path d="M10,35 L8,55 M20,35 L22,55" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Sword arm raised */}
      <path d="M20,18 L28,12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Sword blade */}
      <path d="M28,12 L32,2 M30,8 L32,6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Shield arm */}
      <path d="M10,18 L4,22" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Shield */}
      <ellipse cx="2" cy="24" rx="4" ry="5" fill="currentColor" />
    </svg>
  )
}

// Simple compass rose decoration
function CompassRose({ size = 40, color = '#8b7355' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
      {/* Cardinal directions */}
      <path d="M50,5 L55,45 L50,50 L45,45 Z" fill={color} opacity="0.8" />
      <path d="M95,50 L55,55 L50,50 L55,45 Z" fill={color} opacity="0.6" />
      <path d="M50,95 L45,55 L50,50 L55,55 Z" fill={color} opacity="0.6" />
      <path d="M5,50 L45,45 L50,50 L45,55 Z" fill={color} opacity="0.6" />
      <circle cx="50" cy="50" r="5" fill={color} opacity="0.8" />
    </svg>
  )
}

// Heart container display
function HeartContainers({ filled = 3, max = 5 }: { filled?: number; max?: number }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="20" height="18" viewBox="0 0 20 18">
          <path
            d="M10 17 C5 12 0 8 0 5 C0 2 2 0 5 0 C7 0 9 1.5 10 3 C11 1.5 13 0 15 0 C18 0 20 2 20 5 C20 8 15 12 10 17Z"
            fill={i < filled ? '#ff3333' : '#333322'}
            stroke={i < filled ? '#cc0000' : '#222211'}
            strokeWidth="1"
          />
          {i < filled && (
            <path
              d="M5 4 Q6 3 7 4"
              fill="none"
              stroke="#ff9999"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          )}
        </svg>
      ))}
    </div>
  )
}

// Gem decoration
function Gem({ color = 'green', size = 20 }: { color?: 'green' | 'blue' | 'red' | 'gold'; size?: number }) {
  const colors = {
    green: { fill: '#00cc44', highlight: '#66ff99', shadow: '#006622' },
    blue: { fill: '#3399ff', highlight: '#99ccff', shadow: '#0044aa' },
    red: { fill: '#ff3355', highlight: '#ff99aa', shadow: '#aa0022' },
    gold: { fill: '#ffd700', highlight: '#ffee88', shadow: '#cc9900' },
  }
  const c = colors[color]

  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 12 20">
      <polygon points="6,0 12,5 12,15 6,20 0,15 0,5" fill={c.fill} />
      <polygon points="6,0 12,5 6,10 0,5" fill={c.highlight} opacity="0.6" />
      <polygon points="6,10 12,15 6,20 0,15" fill={c.shadow} opacity="0.6" />
      <line x1="6" y1="0" x2="6" y2="20" stroke={c.highlight} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// === CONTINUOUS CSS-ANIMATED PARTICLES (z-[3-4], pointer-events-none) ===

// Sparkle particles - loop continuously via CSS
function SparkleParticles() {
  const [sparkles, setSparkles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute sparkle-particle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, #ffffaa, #ffcc00 50%, transparent 70%)',
            borderRadius: '50%',
            boxShadow: '0 0 8px #ffcc00, 0 0 16px #ffaa00',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// Grass particles - continuous CSS loop
function GrassParticles() {
  const [blades, setBlades] = useState<Array<{
    id: number
    x: number
    y: number
    rotation: number
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    const newBlades = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 85 + Math.random() * 15,
      rotation: Math.random() * 360,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
    }))
    setBlades(newBlades)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {blades.map((b) => (
        <div
          key={b.id}
          className="absolute grass-particle"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        >
          <svg width="12" height="20" viewBox="0 0 12 20" style={{ transform: `rotate(${b.rotation}deg)` }}>
            <path
              d="M6,20 Q3,10 6,0 Q9,10 6,20"
              fill="#44aa44"
              stroke="#226622"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Floating clouds - continuous CSS loop (z-[1])
function FloatingClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute cloud-float"
          style={{
            top: `${10 + i * 12}%`,
            left: '-100px',
            animationDelay: `${i * 4}s`,
            animationDuration: `${25 + i * 5}s`,
          }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="rgba(255,255,255,0.7)">
            <ellipse cx="60" cy="40" rx="50" ry="20" />
            <ellipse cx="35" cy="30" rx="30" ry="20" />
            <ellipse cx="80" cy="32" rx="35" ry="18" />
            <ellipse cx="55" cy="25" rx="25" ry="15" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Treasure chest decoration
function TreasureChest({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28">
      <rect x="2" y="14" width="28" height="12" rx="2" fill="#8B4513" stroke="#5D2E0C" strokeWidth="1" />
      <rect x="4" y="16" width="24" height="8" fill="#A0522D" />
      <rect x="2" y="18" width="28" height="4" fill="#ffd700" opacity="0.6" />
      <path
        d={isOpen ? "M2,14 Q2,4 16,2 Q30,4 30,14 L30,10 Q30,0 16,-2 Q2,0 2,10 Z" : "M2,14 Q2,4 16,2 Q30,4 30,14 Z"}
        fill="#A0522D"
        stroke="#5D2E0C"
        strokeWidth="1"
        className={isOpen ? 'chest-lid-open' : ''}
      />
      <circle cx="16" cy="20" r="3" fill="#ffd700" stroke="#cc9900" strokeWidth="1" />
      <rect x="15" y="20" width="2" height="4" fill="#ffd700" />
      {isOpen && (
        <ellipse cx="16" cy="10" rx="8" ry="4" fill="#ffd700" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
        </ellipse>
      )}
    </svg>
  )
}

// Legendary sword silhouette
function LegendarySword({ size = 60 }: { size?: number }) {
  return (
    <svg width={size * 0.3} height={size} viewBox="0 0 30 100" opacity="0.15">
      <path d="M15,0 L20,60 L15,70 L10,60 Z" fill="#c0c0c0" />
      <path d="M15,0 L15,70" stroke="#e0e0e0" strokeWidth="2" />
      <path d="M5,65 L25,65 L23,72 L7,72 Z" fill="#4169E1" />
      <rect x="12" y="72" width="6" height="18" fill="#8B4513" />
      <circle cx="15" cy="95" r="5" fill="#ffd700" />
    </svg>
  )
}

// === ALEXANDER WARRIOR CHARACTER (replaces Link/Navi) ===

// Generic adventurer/warrior character SVG
function WarriorCharacter({
  pose = 'running',
  direction = 'right',
  isPanicked = false,
}: {
  pose?: 'running' | 'idle' | 'attacking'
  direction?: 'left' | 'right'
  isPanicked?: boolean
}) {
  const flipStyle = direction === 'left' ? { transform: 'scaleX(-1)' } : {}

  return (
    <svg width="48" height="64" viewBox="0 0 48 64" style={flipStyle}>
      {/* Cape flowing behind */}
      <path
        d="M20,22 Q10,35 15,55 Q18,52 22,50 Q18,35 20,22"
        fill="#8B0000"
        stroke="#5a0000"
        strokeWidth="1"
        opacity="0.9"
        className={pose === 'running' ? 'warrior-cape' : ''}
      />

      {/* Body/armor */}
      <path
        d="M24,24 L32,30 L30,48 L24,52 L18,48 L16,30 Z"
        fill="#4a4a4a"
        stroke="#333"
        strokeWidth="1.5"
      />
      {/* Chest plate detail */}
      <path d="M20,32 L24,38 L28,32" fill="none" stroke="#666" strokeWidth="1" />

      {/* Belt */}
      <rect x="17" y="42" width="14" height="4" rx="1" fill="#5D2E0C" stroke="#3a1a00" strokeWidth="0.5" />
      <rect x="22" y="41" width="4" height="6" fill="#ffd700" stroke="#cc9900" strokeWidth="0.5" />

      {/* Head */}
      <circle cx="24" cy="16" r="10" fill="#DEB887" stroke="#C4A370" strokeWidth="1" />

      {/* Helmet/hair */}
      <path
        d="M14,16 Q14,8 24,6 Q34,8 34,16 L34,14 Q34,6 24,4 Q14,6 14,14 Z"
        fill="#3a3a3a"
        stroke="#222"
        strokeWidth="1"
      />
      {/* Helmet crest */}
      <path d="M24,4 L24,0 L26,2 L24,4" fill="#8B0000" stroke="#5a0000" strokeWidth="0.5" />

      {/* Face */}
      <ellipse cx="20" cy="15" rx="2" ry="2.5" fill="#5a4a3a" />
      <ellipse cx="28" cy="15" rx="2" ry="2.5" fill="#5a4a3a" />
      {isPanicked ? (
        <>
          <ellipse cx="20" cy="15" rx="1" ry="1.5" fill="#fff" />
          <ellipse cx="28" cy="15" rx="1" ry="1.5" fill="#fff" />
          <path d="M19,20 Q24,24 29,20" fill="none" stroke="#5D2E0C" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <circle cx="20" cy="15" r="1" fill="#111" />
          <circle cx="28" cy="15" r="1" fill="#111" />
          <path d="M21,20 Q24,22 27,20" fill="none" stroke="#5D2E0C" strokeWidth="1" />
        </>
      )}

      {/* Sword arm */}
      <path
        d={pose === 'attacking' ? "M32,32 L44,24" : "M32,32 L38,40"}
        stroke="#DEB887"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Sword */}
      <path
        d={pose === 'attacking' ? "M44,24 L52,14 M48,20 L52,16" : "M38,40 L42,34 L50,26 M46,30 L50,26"}
        stroke="#c0c0c0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sword pommel */}
      <circle
        cx={pose === 'attacking' ? 52 : 50}
        cy={pose === 'attacking' ? 14 : 26}
        r="2"
        fill="#ffd700"
      />

      {/* Shield arm */}
      <path d="M16,32 L10,38" stroke="#DEB887" strokeWidth="4" strokeLinecap="round" />
      {/* Shield */}
      <ellipse cx="8" cy="40" rx="6" ry="8" fill="#4169E1" stroke="#2a4080" strokeWidth="1.5" />
      <path d="M8,34 L8,46 M4,40 L12,40" stroke="#ffd700" strokeWidth="1.5" />

      {/* Legs */}
      <path
        d={pose === 'running' ? "M20,48 L16,58 L14,64 M28,48 L30,56 L32,64" : "M20,48 L18,58 L18,64 M28,48 L30,58 L30,64"}
        stroke="#3a3a3a"
        strokeWidth="4"
        strokeLinecap="round"
        className={pose === 'running' ? 'warrior-legs' : ''}
      />
      {/* Boots */}
      <ellipse cx="14" cy="63" rx="4" ry="2" fill="#3a2a1a" />
      <ellipse cx="32" cy="63" rx="4" ry="2" fill="#3a2a1a" />
    </svg>
  )
}

// Angry chicken (generic forest creature)
function AngryChicken({ isAngry = false, size = 32 }: { isAngry?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <ellipse cx="16" cy="20" rx="10" ry="8" fill={isAngry ? '#fff5f5' : '#fff'} stroke="#ddd" strokeWidth="1" />
      <ellipse cx="10" cy="20" rx="4" ry="5" fill={isAngry ? '#ffeeee' : '#f8f8f8'} stroke="#ddd" strokeWidth="0.5" />
      <circle cx="22" cy="12" r="6" fill={isAngry ? '#fff5f5' : '#fff'} stroke="#ddd" strokeWidth="1" />
      <path
        d="M20,6 Q22,3 24,6 Q26,3 28,6 Q26,8 24,8 Q22,8 20,6"
        fill={isAngry ? '#ff3333' : '#cc3333'}
      />
      <path d="M26,12 L32,12 L28,15 Z" fill="#ffaa00" stroke="#cc8800" strokeWidth="0.5" />
      {isAngry ? (
        <>
          <circle cx="22" cy="11" r="3" fill="#fff" stroke="#ff0000" strokeWidth="1" />
          <circle cx="22" cy="11" r="1.5" fill="#ff0000" />
          <path d="M19,8 L25,10" stroke="#333" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <circle cx="22" cy="11" r="2" fill="#111" />
          <circle cx="21.5" cy="10.5" r="0.5" fill="#fff" />
        </>
      )}
      <ellipse cx="26" cy="15" rx="2" ry="3" fill={isAngry ? '#ff4444' : '#cc4444'} />
      <path d="M12,28 L10,32 M14,28 L14,32 M16,28 L18,32" stroke="#ffaa00" strokeWidth="1.5" />
      <path d="M18,28 L16,32 M20,28 L20,32 M22,28 L24,32" stroke="#ffaa00" strokeWidth="1.5" />
      <path d="M6,18 Q2,14 4,10 M6,20 Q1,18 2,14 M6,22 Q0,22 1,18" stroke="#eee" strokeWidth="2" fill="none" />
      {isAngry && (
        <>
          <path d="M28,6 L30,4" stroke="#ff3333" strokeWidth="1.5" />
          <path d="M30,8 L33,6" stroke="#ff3333" strokeWidth="1.5" />
          <path d="M30,10 L33,10" stroke="#ff3333" strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

// Goblin enemy
function GoblinEnemy({ isDead = false, size = 40 }: { isDead?: boolean; size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 48" className={isDead ? 'enemy-death' : ''}>
      {isDead ? (
        <>
          <circle cx="20" cy="24" r="4" fill="#ff6600" opacity="0.8">
            <animate attributeName="r" values="4;20;25" dur="0.3s" fill="freeze" />
            <animate attributeName="opacity" values="0.8;0.4;0" dur="0.3s" fill="freeze" />
          </circle>
          <circle cx="20" cy="24" r="2" fill="#ffff00">
            <animate attributeName="r" values="2;15;20" dur="0.3s" fill="freeze" />
            <animate attributeName="opacity" values="1;0.5;0" dur="0.3s" fill="freeze" />
          </circle>
        </>
      ) : (
        <>
          <ellipse cx="20" cy="30" rx="12" ry="10" fill="#c97040" stroke="#8b4513" strokeWidth="1.5" />
          <ellipse cx="20" cy="32" rx="8" ry="6" fill="#e8a060" />
          <circle cx="20" cy="14" r="10" fill="#c97040" stroke="#8b4513" strokeWidth="1.5" />
          <ellipse cx="20" cy="18" rx="6" ry="4" fill="#d48050" />
          <circle cx="17" cy="17" r="1.5" fill="#333" />
          <circle cx="23" cy="17" r="1.5" fill="#333" />
          <circle cx="15" cy="12" r="3" fill="#fff" stroke="#333" strokeWidth="0.5" />
          <circle cx="25" cy="12" r="3" fill="#fff" stroke="#333" strokeWidth="0.5" />
          <circle cx="15" cy="12" r="1.5" fill="#ff3300" />
          <circle cx="25" cy="12" r="1.5" fill="#ff3300" />
          <ellipse cx="8" cy="8" rx="4" ry="6" fill="#c97040" stroke="#8b4513" strokeWidth="1" />
          <ellipse cx="32" cy="8" rx="4" ry="6" fill="#c97040" stroke="#8b4513" strokeWidth="1" />
          <path d="M20,4 L22,0 L18,0 Z" fill="#8B4513" />
          <path d="M8,28 L2,36" stroke="#c97040" strokeWidth="4" strokeLinecap="round" />
          <path d="M32,28 L38,36" stroke="#c97040" strokeWidth="4" strokeLinecap="round" />
          <path d="M36,34 L42,28 L48,30 L44,36 Z" fill="#5a4030" stroke="#3a2010" strokeWidth="1" />
          <path d="M14,38 L12,48" stroke="#c97040" strokeWidth="4" strokeLinecap="round" />
          <path d="M26,38 L28,48" stroke="#c97040" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// === SIMPLIFIED SCROLL SCENE WITH CSS TRANSITIONS ===

function ScrollAdventureScene() {
  const [mounted, setMounted] = useState(false)
  const { smoothScrollY, scrollProgress, isScrollingDown } = useSmoothScroll(0.15)
  const triggeredZones = useScrollZones([0.2, 0.4, 0.6, 0.8])

  const [chickenRevenge, setChickenRevenge] = useState(false)
  const [enemies, setEnemies] = useState<Array<{ id: number; x: number; visible: boolean; defeated: boolean }>>([])

  const chickenTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const enemyIdRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Spawn enemies at zone triggers (one-time)
  useEffect(() => {
    const zones = [0.2, 0.4, 0.6, 0.8]
    zones.forEach((zone, idx) => {
      if (triggeredZones.has(zone) && !enemies.find(e => e.id === idx)) {
        setEnemies(prev => [...prev, {
          id: idx,
          x: 55 + idx * 8,
          visible: true,
          defeated: false,
        }])
      }
    })
  }, [triggeredZones, enemies])

  // Fast scroll detection for chicken revenge (one-time per session)
  useEffect(() => {
    if (!mounted) return

    let lastY = 0
    let lastTime = Date.now()

    const handleScroll = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      const deltaY = Math.abs(window.scrollY - lastY)
      const speed = deltaTime > 0 ? deltaY / deltaTime : 0

      if (speed > 4 && !chickenRevenge) {
        setChickenRevenge(true)
        clearTimeout(chickenTimeout.current)
        chickenTimeout.current = setTimeout(() => setChickenRevenge(false), 5000)
      }

      lastY = window.scrollY
      lastTime = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(chickenTimeout.current)
    }
  }, [mounted, chickenRevenge])

  // Defeat enemies when warrior passes them
  useEffect(() => {
    const warriorX = 15 + (scrollProgress * 50)
    setEnemies(prev => prev.map(enemy => {
      if (enemy.visible && !enemy.defeated && Math.abs(enemy.x - warriorX) < 15) {
        return { ...enemy, defeated: true }
      }
      return enemy
    }))
  }, [scrollProgress])

  if (!mounted) return null

  // Warrior position based on smooth scroll
  const warriorX = 15 + (scrollProgress * 50)
  const pose = isScrollingDown && scrollProgress > 0.01 ? 'running' : 'idle'

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {/* Warrior - CSS transition for smooth movement */}
      <div
        className="absolute bottom-20 warrior-smooth"
        style={{
          left: `${warriorX}%`,
          transform: `translateX(-50%) ${chickenRevenge ? 'translateX(-15px)' : ''}`,
        }}
      >
        <WarriorCharacter
          pose={chickenRevenge ? 'running' : pose}
          direction={isScrollingDown ? 'right' : 'left'}
          isPanicked={chickenRevenge}
        />
      </div>

      {/* Direction indicator */}
      {!chickenRevenge && scrollProgress < 0.9 && (
        <div
          className="absolute direction-indicator"
          style={{
            left: `calc(${warriorX}% + 50px)`,
            bottom: '160px',
            opacity: pose === 'idle' ? 0.8 : 0.3,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="bounce-arrow">
            <path d="M12,2 L20,14 L16,14 L16,22 L8,22 L8,14 L4,14 Z" fill="#ffd700" stroke="#cc9900" strokeWidth="1" transform="rotate(180 12 12)" />
          </svg>
        </div>
      )}

      {/* Angry chicken flock - triggered by fast scrolling */}
      {chickenRevenge && (
        <div className="absolute bottom-16 right-0 flex gap-3 chicken-chase">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="chicken-bob"
              style={{
                animationDelay: `${i * 0.08}s`,
                transform: `translateY(${Math.sin(i * 1.5) * 12}px) rotate(${Math.sin(i) * 15}deg)`,
              }}
            >
              <AngryChicken isAngry size={28 + (i % 3) * 4} />
            </div>
          ))}
        </div>
      )}

      {/* Enemies - appear once per zone */}
      {enemies.map(enemy => (
        <div
          key={enemy.id}
          className="absolute bottom-24 enemy-appear"
          style={{
            left: `${enemy.x}%`,
            transform: 'translateX(-50%)',
            opacity: enemy.visible ? 1 : 0,
          }}
        >
          <GoblinEnemy isDead={enemy.defeated} size={40} />
        </div>
      ))}

      {/* Warning indicator */}
      {chickenRevenge && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-sm font-bold bounce-warning flex items-center gap-3"
          style={{
            background: 'linear-gradient(180deg, #ff3322, #aa1100)',
            color: '#fff',
            border: '3px solid #ff6644',
            boxShadow: '0 0 30px rgba(255,50,0,0.7)',
          }}
        >
          <span className="text-lg">ANGRY CHICKENS!</span>
          <span className="text-xs opacity-80">(scroll slower next time!)</span>
        </div>
      )}
    </div>
  )
}

// === UI COMPONENTS ===

// Compass/Map marker
function MapMarker({ active = false }: { active?: boolean }) {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32">
      <path
        d="M12,0 C18,0 24,6 24,12 C24,20 12,32 12,32 C12,32 0,20 0,12 C0,6 6,0 12,0"
        fill={active ? '#ff6b35' : '#226633'}
        stroke={active ? '#ffd700' : '#114411'}
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" fill={active ? '#ffd700' : '#44aa44'} />
      {active && (
        <circle cx="12" cy="12" r="6" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.5">
          <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}

// World map node
function MapNode({
  profession,
  isActive,
  onClick,
  position,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  const icons = { engineer: '`', drummer: '~', fighter: '*' }
  const labels = { engineer: 'CODE CASTLE', drummer: 'RHYTHM RANCH', fighter: 'BATTLE TOWER' }
  const colors = { engineer: '#44aaff', drummer: '#cc66ff', fighter: '#ff6655' }

  return (
    <button
      onClick={onClick}
      className={`absolute transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 ${
        isActive ? 'scale-125 z-20' : 'hover:scale-110'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.25)' : ''}`,
      }}
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-full blur-xl pulse-glow"
          style={{
            background: colors[profession],
            opacity: 0.4,
            transform: 'scale(2)',
          }}
        />
      )}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: isActive
            ? `linear-gradient(180deg, #ffd700, ${colors[profession]})`
            : 'linear-gradient(180deg, #3a5a3a, #1a3a1a)',
          border: `4px solid ${isActive ? '#ffd700' : '#4a6a4a'}`,
          boxShadow: isActive
            ? `0 0 20px ${colors[profession]}, 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
            : '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
        }}
      >
        <span className="text-4xl" style={{ fontFamily: 'monospace' }}>{icons[profession]}</span>
        {isActive && (
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 ping-slow opacity-50" />
        )}
      </div>
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider"
        style={{
          background: isActive ? 'linear-gradient(180deg, #ffd700, #ffaa00)' : 'rgba(30,50,30,0.95)',
          color: isActive ? '#3a2000' : '#c0e0c0',
          border: `2px solid ${isActive ? '#cc9900' : '#4a6a4a'}`,
          boxShadow: isActive ? '0 2px 8px rgba(255,200,0,0.4)' : '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {labels[profession]}
      </div>
    </button>
  )
}

// Skill rating with hearts
function SkillRating({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
        style={{
          background: `linear-gradient(180deg, ${color}, ${color}88)`,
          border: '2px solid rgba(255,255,255,0.3)',
          color: '#fff',
          boxShadow: `0 2px 0 ${color}66`,
        }}
      >
        <Gem color="gold" size={14} />
      </div>
      <span className="text-xs flex-1" style={{ color: '#f0e8d0' }}>
        {label}
      </span>
      <HeartContainers filled={value} max={5} />
    </div>
  )
}

// Ornate frame
function AdventureFrame({ children, title, icon }: { children: React.ReactNode; title: string; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4">
        <CompassRose size={30} />
      </div>
      <div className="absolute -top-4 -right-4" style={{ transform: 'scaleX(-1)' }}>
        <CompassRose size={30} />
      </div>
      <div className="absolute -bottom-4 -left-4" style={{ transform: 'scaleY(-1)' }}>
        <CompassRose size={30} />
      </div>
      <div className="absolute -bottom-4 -right-4" style={{ transform: 'scale(-1)' }}>
        <CompassRose size={30} />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, transparent, #8b7355, #ffd700)' }} />
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'linear-gradient(180deg, #4a3a2a, #2a1a0a)', border: '2px solid #8b7355', borderRadius: '4px' }}>
          {icon}
          <h2 className="text-sm tracking-[0.2em] uppercase font-bold" style={{ color: '#ffd700', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, #ffd700, #8b7355, transparent)' }} />
      </div>
      <div
        className="p-6 relative"
        style={{
          background: 'linear-gradient(180deg, rgba(42,58,42,0.98), rgba(26,42,26,0.98))',
          border: '3px solid #5a4a3a',
          borderRadius: '8px',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="absolute inset-2 pointer-events-none"
          style={{
            border: '1px solid #8b735540',
            borderRadius: '4px',
          }}
        />
        {children}
      </div>
    </div>
  )
}

// Treasure chest that opens on scroll (one-time trigger)
function ScrollTreasureChest({ item }: { item: React.ReactNode }) {
  const chestRef = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(chestRef, { threshold: 0.7 })
  const [showItem, setShowItem] = useState(false)

  useEffect(() => {
    if (hasEntered) {
      setTimeout(() => setShowItem(true), 300)
    }
  }, [hasEntered])

  return (
    <div ref={chestRef} className="relative inline-block">
      <div className={hasEntered ? 'chest-bounce' : ''}>
        <svg width="48" height="42" viewBox="0 0 48 42">
          <rect x="3" y="21" width="42" height="18" rx="3" fill="#8B4513" stroke="#5D2E0C" strokeWidth="2" />
          <rect x="6" y="24" width="36" height="12" fill="#A0522D" />
          <rect x="3" y="27" width="42" height="6" fill="#ffd700" opacity="0.6" />
          <path
            d={hasEntered ? "M3,21 Q3,6 24,3 Q45,6 45,21 L45,15 Q45,0 24,-3 Q3,0 3,15 Z" : "M3,21 Q3,6 24,3 Q45,6 45,21 Z"}
            fill="#A0522D"
            stroke="#5D2E0C"
            strokeWidth="2"
            className={hasEntered ? 'lid-open' : ''}
          />
          <circle cx="24" cy="30" r="4.5" fill="#ffd700" stroke="#cc9900" strokeWidth="1.5" />
          <rect x="22.5" y="30" width="3" height="6" fill="#ffd700" />
          {hasEntered && (
            <ellipse cx="24" cy="15" rx="12" ry="6" fill="#ffd700" opacity="0.7">
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
          )}
        </svg>
      </div>
      {showItem && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 treasure-item">
          {item}
        </div>
      )}
    </div>
  )
}

// Tech treasure display
function TechTreasure({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category, catIdx) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: '#c0e0c0' }}>
            <Gem color={['green', 'blue', 'red', 'gold', 'green'][catIdx % 5] as 'green' | 'blue' | 'red' | 'gold'} size={16} />
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: 'linear-gradient(180deg, rgba(58,74,58,0.95), rgba(42,58,42,0.95))',
                  border: '1px solid #5a6a5a',
                  color: '#f0e8d0',
                  borderRadius: '4px',
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

// Quest card
function QuestCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className={`relative p-4 cursor-pointer transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${revealed ? 'chest-open' : ''}`}
      style={{
        background: 'linear-gradient(180deg, rgba(90,74,58,0.98), rgba(58,42,26,0.98))',
        border: '3px solid #8b7355',
        borderRadius: '8px',
        boxShadow: '0 4px 0 #2a1a0a, 0 6px 12px rgba(0,0,0,0.4)',
      }}
      onClick={() => {
        setRevealed(true)
        setTimeout(() => setRevealed(false), 500)
      }}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(true); setTimeout(() => setRevealed(false), 500); } }}
      role="button"
    >
      <div className="absolute -top-3 -right-3">
        <TreasureChest isOpen={revealed} />
      </div>
      {project.featured && (
        <div className="flex items-center gap-1 mb-2">
          <CompassRose size={12} />
          <span className="text-[8px] tracking-wider" style={{ color: '#ffd700' }}>LEGENDARY</span>
        </div>
      )}
      <h3 className="text-sm font-bold mb-1" style={{ color: '#f0e8d0' }}>
        {project.name}
      </h3>
      <p className="text-[10px] mb-2" style={{ color: '#c0e0c0' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-[10px] mb-2 italic" style={{ color: '#ffd700' }}>
          <Gem color="gold" size={10} /> {project.impact}
        </p>
      )}
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5 rounded"
            style={{
              background: 'rgba(42,74,42,0.95)',
              color: '#c0e0c0',
              border: '1px solid #4a6a4a',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      {revealed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl item-get">
            <Gem color="gold" size={40} />
          </div>
        </div>
      )}
    </div>
  )
}

// Location card
function LocationCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
      style={{
        background: 'linear-gradient(180deg, rgba(58,74,58,0.98), rgba(42,58,42,0.98))',
        border: '2px solid #5a6a5a',
        borderRadius: '8px',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <MapMarker active />
        <div>
          <h4 className="text-sm group-hover:text-yellow-400 transition-colors" style={{ color: '#f0e8d0' }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: '#ffd700' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#c0d8c0' }}>{company.description}</p>
    </a>
  )
}

// Side quest card
function SideQuestCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: 'linear-gradient(180deg, rgba(58,58,74,0.98), rgba(42,42,58,0.98))',
        border: '2px solid #6a5a7a',
        borderRadius: '8px',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">~</span>
        <h4 className="text-sm group-hover:text-purple-400 transition-colors" style={{ color: '#f0e8d0' }}>
          {band.name}
        </h4>
      </div>
      <p className="text-[10px] mt-1" style={{ color: '#ddaaff' }}>{band.genre} | {band.role}</p>
      <p className="text-xs mt-2" style={{ color: '#c0c0d8' }}>{band.description}</p>
      {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: '#a0a0b0' }}>Quest unlocking soon...</p>}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400">{content}</a>
  }
  return content
}

// Experience card - styled for adventure theme
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4 transition-all hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(180deg, rgba(58,74,58,0.98), rgba(42,58,42,0.98))',
        border: '2px solid #5a6a5a',
        borderRadius: '8px',
        boxShadow: '0 2px 0 #2a1a0a, 0 4px 8px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2">
          <Gem color="gold" size={16} />
          <div>
            <h4 className="text-sm font-bold" style={{ color: '#f0e8d0' }}>{entry.title}</h4>
            <p className="text-xs" style={{ color: '#ffd700' }}>{entry.organization}</p>
          </div>
        </div>
        <span
          className="text-[10px] px-2 py-1 rounded"
          style={{
            background: 'rgba(42,74,42,0.95)',
            color: '#c0e0c0',
            border: '1px solid #4a6a4a',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: '#c0d8c0' }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#f0e8d0' }}>
              <span style={{ color: '#44aa44' }}>&#9830;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Dark content overlay for Adventure (z-[8])
function AdventureContentOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[8]"
      style={{
        background: 'linear-gradient(180deg, rgba(26, 58, 26, 0.15) 0%, rgba(20, 42, 20, 0.22) 50%, rgba(26, 58, 26, 0.18) 100%)',
      }}
    />
  )
}

// Sword divider
function SwordDivider() {
  return (
    <div className="flex justify-center items-center py-6 gap-4">
      <LegendarySword size={40} />
      <div className="flex gap-2">
        <Gem color="green" size={16} />
        <Gem color="blue" size={18} />
        <Gem color="red" size={16} />
      </div>
      <LegendarySword size={40} />
    </div>
  )
}

// === MAIN COMPONENT ===

export default function AdventurePathsTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  const nodePositions = {
    engineer: { x: 150, y: 100 },
    drummer: { x: 350, y: 80 },
    fighter: { x: 550, y: 120 },
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #88ccff, #55aadd 25%, #3a6a3a 25%, #2a5a2a 50%, #1a4a1a)',
        fontFamily: '"Fredoka One", "Comic Sans MS", sans-serif',
      }}
    >
      {/* Background layers - continuous CSS animations (z-[1-4], pointer-events-none) */}
      <FloatingClouds />
      <SparkleParticles />
      <GrassParticles />

      {/* Simplified scroll adventure scene (z-[4]) */}
      <ScrollAdventureScene />

      {/* Dark content overlay (z-[8]) */}
      <AdventureContentOverlay />

      {/* Kingdom hills (z-[2]) */}
      <div className="fixed bottom-0 left-0 right-0 h-[45%] pointer-events-none z-[2]">
        <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <ellipse cx="200" cy="400" rx="350" ry="180" fill="#2a6a3a" />
          <ellipse cx="600" cy="400" rx="450" ry="200" fill="#1a5a2a" />
          <ellipse cx="1000" cy="400" rx="400" ry="170" fill="#2a6a3a" />
          <ellipse cx="100" cy="350" rx="40" ry="60" fill="#1a4a1a" />
          <ellipse cx="300" cy="360" rx="50" ry="70" fill="#1a3a1a" />
          <ellipse cx="900" cy="350" rx="45" ry="65" fill="#1a4a1a" />
          <ellipse cx="1100" cy="360" rx="55" ry="75" fill="#1a3a1a" />
        </svg>
      </div>

      {/* Header (z-[30] - above overlay) */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="fade-in-down">
            <div className="flex items-center gap-3 mb-2">
              <AdventurerSilhouette size={32} />
              <h1 className="text-2xl tracking-wider" style={{ color: '#ffd700', textShadow: '2px 2px 0 #5a3000, -1px -1px 0 #5a3000, 1px -1px 0 #5a3000, -1px 1px 0 #5a3000, 0 0 20px #ffd70060' }}>
                ALEXANDER PULIDO
              </h1>
            </div>
            <p className="text-sm tracking-wide" style={{ color: '#1a3a1a', textShadow: '0 0 8px rgba(255,255,255,0.8), 1px 1px 0 rgba(255,255,255,0.6)' }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs tracking-wide mt-1 italic" style={{ color: '#5a3000', textShadow: '0 0 8px rgba(255,255,255,0.8)' }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
              <HeartContainers filled={5} max={5} />
              <div className="flex items-center gap-1 px-3 py-1 rounded" style={{ background: '#1a3a1a', border: '2px solid #4a6a4a' }}>
                <Gem color="green" size={16} />
                <span className="text-sm font-bold" style={{ color: '#44dd44' }}>999</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Link
                href="/cv"
                className="adventure-button px-4 py-2 text-xs tracking-wider transition-all hover:scale-105 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                style={{
                  background: 'linear-gradient(180deg, #5a4a3a, #3a2a1a)',
                  border: '2px solid #8b7355',
                  color: '#f0e8d0',
                }}
              >
                <span className="flex items-center gap-2">
                  <TreasureChest />
                  CV
                </span>
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="adventure-button px-4 py-2 text-xs tracking-wider transition-all hover:scale-105 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                style={{
                  background: 'linear-gradient(180deg, #ffd700, #cc9900)',
                  border: '2px solid #ffee88',
                  color: '#3a2000',
                }}
              >
                <span className="flex items-center gap-2">
                  <CompassRose size={16} />
                  PLAY
                </span>
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Current Roles (z-[20]) */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role, idx) => (
              <div
                key={role.id}
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, rgba(30,50,30,0.95), rgba(20,40,20,0.95))',
                  border: '2px solid #5a6a5a',
                }}
              >
                <MapMarker active={idx === 0} />
                <div>
                  <p className="text-xs tracking-wider" style={{ color: '#ffd700' }}>{role.title}</p>
                  <p className="text-sm" style={{ color: '#f0e8d0' }}>{role.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Map (z-[20]) */}
      <section className="relative z-20 h-[260px]">
        <div className="relative max-w-3xl mx-auto h-full">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffaa00" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 150 100 Q 250 60 350 80"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="6"
              strokeDasharray="12 8"
              strokeLinecap="round"
            />
            <path
              d="M 350 80 Q 450 100 550 120"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="6"
              strokeDasharray="12 8"
              strokeLinecap="round"
            />
          </svg>
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <MapNode
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
              position={nodePositions[prof]}
            />
          ))}
        </div>
      </section>

      {/* Main content (z-[20]) */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* About treasure chest */}
          <div className="flex justify-center mb-4">
            <ScrollTreasureChest
              item={
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">[=]</span>
                  <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: '#ffd700' }}>ABOUT</span>
                </div>
              }
            />
          </div>

          {/* About panel */}
          <section className="mb-8">
            <AdventureFrame title="About" icon={<span className="text-lg">[=]</span>}>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#f0e8d0' }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded flex items-center gap-2"
                    style={{
                      background: ['rgba(106,58,58,0.95)', 'rgba(58,106,58,0.95)', 'rgba(58,58,106,0.95)', 'rgba(106,106,58,0.95)'][i % 4],
                      border: '2px solid rgba(255,255,255,0.2)',
                      color: '#f0e8d0',
                    }}
                  >
                    <Gem color={['red', 'green', 'blue', 'gold'][i % 4] as 'red' | 'green' | 'blue' | 'gold'} size={12} />
                    {fact}
                  </span>
                ))}
              </div>
            </AdventureFrame>
          </section>

          {/* Work Experience */}
          {experience.length > 0 && (
            <>
              <SwordDivider />

              {/* Work Experience treasure chest */}
              <div className="flex justify-center mb-4">
                <ScrollTreasureChest
                  item={
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">&</span>
                      <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: '#ffd700' }}>WORK EXPERIENCE</span>
                    </div>
                  }
                />
              </div>

              <section className="mb-8">
                <AdventureFrame title="Work Experience" icon={<span className="text-lg">&</span>}>
                  <div className="space-y-4">
                    {experience.map((entry) => (
                      <ExperienceCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                </AdventureFrame>
              </section>
            </>
          )}

          <SwordDivider />

          {/* Skills treasure chest */}
          <div className="flex justify-center mb-4">
            <ScrollTreasureChest
              item={
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{active === 'engineer' ? '+' : '#'}</span>
                  <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: '#ffd700' }}>
                    {active === 'engineer' ? 'TECH STACK' : 'SKILLS'}
                  </span>
                </div>
              }
            />
          </div>

          {/* Tech Stack / Skills */}
          <section className="mb-8">
            <AdventureFrame
              title={active === 'engineer' ? 'Tech Stack' : 'Skills'}
              icon={<span className="text-lg">{active === 'engineer' ? '+' : '#'}</span>}
            >
              {active === 'engineer' ? (
                <TechTreasure categories={engineerTech} />
              ) : (
                <div className="space-y-6">
                  {otherSkills.map((category, catIndex) => (
                    <div key={category.name}>
                      <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: '#aaccaa' }}>
                        <span>{category.icon}</span>
                        {category.name.toUpperCase()}
                      </h3>
                      {category.skills.map((skill) => (
                        <SkillRating
                          key={skill.name}
                          label={skill.name}
                          value={skill.proficiency}
                          color={['#cc3333', '#33cc33', '#3333cc'][catIndex % 3]}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </AdventureFrame>
          </section>

          <SwordDivider />

          {/* Projects treasure chest */}
          <div className="flex justify-center mb-4">
            <ScrollTreasureChest
              item={
                <div className="flex flex-col items-center gap-1">
                  <CompassRose size={32} />
                  <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: '#ffd700' }}>PROJECTS</span>
                </div>
              }
            />
          </div>

          {/* Projects */}
          <section className="mb-8">
            <AdventureFrame title="Projects" icon={<TreasureChest isOpen />}>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <QuestCard key={project.id} project={project} />
                ))}
              </div>
            </AdventureFrame>
          </section>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <>
              <SwordDivider />
              <section className="mb-8">
                <AdventureFrame title="Ventures" icon={<MapMarker active />}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {COMPANIES.map((company) => (
                      <LocationCard key={company.id} company={company} />
                    ))}
                  </div>
                </AdventureFrame>
              </section>
            </>
          )}

          {active === 'drummer' && (
            <>
              <SwordDivider />
              <section className="mb-8">
                <AdventureFrame title="Bands" icon={<span className="text-lg">~</span>}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {BANDS.map((band) => (
                      <SideQuestCard key={band.id} band={band} />
                    ))}
                  </div>
                </AdventureFrame>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Footer (z-[20]) */}
      <footer className="relative z-20 py-8 text-center">
        <div className="flex items-center justify-center gap-4 px-4 py-2 rounded-lg" style={{ background: 'rgba(26,42,26,0.9)' }}>
          <LegendarySword size={30} />
          <div className="flex items-center gap-2" style={{ color: '#c0e0c0' }}>
            <CompassRose size={20} />
            <span className="text-xs tracking-widest">ADVENTURER SINCE 2014</span>
            <CompassRose size={20} />
          </div>
          <LegendarySword size={30} />
        </div>
        <p className="text-xs mt-2 px-3 py-1 rounded" style={{ color: '#a0c0a0', background: 'rgba(26,42,26,0.8)' }}>
          SAVE FILE 01 | TIME PLAYED: 10+ YEARS
        </p>
      </footer>

      {/* CSS Animations */}
      <style jsx global>{`
        /* === CONTINUOUS PARTICLE ANIMATIONS === */

        @keyframes sparkle-loop {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes grass-loop {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-50px) rotate(360deg); }
        }

        @keyframes cloud-loop {
          from { transform: translateX(-150px); }
          to { transform: translateX(calc(100vw + 150px)); }
        }

        .sparkle-particle {
          animation: sparkle-loop ease-in-out infinite;
        }

        .grass-particle {
          animation: grass-loop ease-out infinite;
        }

        .cloud-float {
          animation: cloud-loop linear infinite;
        }

        /* === SMOOTH SCROLL TRANSITIONS === */

        .warrior-smooth {
          transition: left 0.3s ease-out, transform 0.3s ease-out;
        }

        .direction-indicator {
          transition: left 0.3s ease-out, opacity 0.3s ease-out;
        }

        .enemy-appear {
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        /* === WARRIOR ANIMATIONS === */

        @keyframes warrior-cape-flow {
          0%, 100% { d: path("M20,22 Q10,35 15,55 Q18,52 22,50 Q18,35 20,22"); }
          50% { d: path("M20,22 Q8,38 12,55 Q16,52 20,50 Q16,38 20,22"); }
        }

        .warrior-cape {
          animation: warrior-cape-flow 0.4s ease-in-out infinite;
        }

        @keyframes warrior-legs-run {
          0%, 100% { d: path("M20,48 L16,58 L14,64 M28,48 L30,56 L32,64"); }
          50% { d: path("M20,48 L24,56 L26,64 M28,48 L24,58 L22,64"); }
        }

        .warrior-legs {
          animation: warrior-legs-run 0.3s ease-in-out infinite;
        }

        /* === CHICKEN CHASE (one-time trigger) === */

        @keyframes chicken-chase-run {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-150%); }
        }

        @keyframes chicken-bob-walk {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }

        .chicken-chase {
          animation: chicken-chase-run 4s linear forwards;
        }

        .chicken-bob {
          animation: chicken-bob-walk 0.3s ease-in-out infinite;
        }

        /* === ENEMY DEATH === */

        @keyframes enemy-death-explode {
          0% { opacity: 1; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0) rotate(180deg); }
        }

        .enemy-death {
          animation: enemy-death-explode 0.4s ease-out forwards;
        }

        /* === TREASURE CHEST === */

        @keyframes chest-bounce-open {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-15px); }
          40% { transform: translateY(0); }
          60% { transform: translateY(-8px); }
          80% { transform: translateY(0); }
        }

        @keyframes treasure-item-float {
          0% { opacity: 0; transform: translateY(30px) scale(0) rotate(-20deg); }
          30% { opacity: 1; transform: translateY(0) scale(1.3) rotate(0deg); }
          50% { transform: translateY(-10px) scale(1.1) rotate(5deg); }
          70% { transform: translateY(-5px) scale(1) rotate(-3deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }

        @keyframes item-get-float {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.5) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg) translateY(-20px); opacity: 0; }
        }

        .chest-bounce {
          animation: chest-bounce-open 0.6s ease-out;
        }

        .treasure-item {
          animation: treasure-item-float 0.8s ease-out forwards;
        }

        .item-get {
          animation: item-get-float 0.6s ease-out forwards;
        }

        .chest-open {
          animation: chest-bounce-open 0.3s ease-out;
        }

        /* === UI ANIMATIONS === */

        @keyframes ping-slow-anim {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes pulse-glow-anim {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes fade-in-down-anim {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-anim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .ping-slow {
          animation: ping-slow-anim 1.5s ease-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow-anim 2s ease-in-out infinite;
        }

        .fade-in-down {
          animation: fade-in-down-anim 0.6s ease-out;
        }

        .bounce-arrow {
          animation: bounce-anim 1s ease-in-out infinite;
        }

        .bounce-warning {
          animation: bounce-anim 0.5s ease-in-out infinite;
        }

        /* ========================================
           ADVENTURE BUTTON - Treasure Sparkle
           ======================================== */
        .adventure-button {
          position: relative;
          overflow: hidden;
        }
        .adventure-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 50%);
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .adventure-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 200, 0.3) 45%,
            rgba(255, 255, 200, 0.5) 50%,
            rgba(255, 255, 200, 0.3) 55%,
            transparent 70%
          );
          background-size: 200% 200%;
          background-position: 100% 100%;
          transition: background-position 0.4s ease;
          pointer-events: none;
        }
        .adventure-button:hover::before {
          opacity: 1;
          transform: scale(1);
          animation: sparkle-burst 0.4s ease-out;
        }
        .adventure-button:hover::after {
          background-position: 0% 0%;
        }
        @keyframes sparkle-burst {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        /* ===== REDUCED MOTION SUPPORT ===== */
        @media (prefers-reduced-motion: reduce) {
          .sparkle-particle,
          .grass-particle,
          .cloud-float,
          .warrior-cape,
          .warrior-legs,
          .chicken-chase,
          .chicken-bob,
          .enemy-death,
          .chest-bounce,
          .treasure-item,
          .item-get,
          .chest-open,
          .ping-slow,
          .pulse-glow,
          .fade-in-down,
          .bounce-arrow,
          .bounce-warning,
          .warrior-smooth,
          .direction-indicator,
          .enemy-appear,
          .adventure-button::before,
          .adventure-button::after {
            animation: none !important;
            transition: none !important;
          }
          .warrior-smooth,
          .enemy-appear {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
