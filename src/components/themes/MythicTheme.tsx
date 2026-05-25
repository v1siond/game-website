'use client'

import { useEffect, useState, useRef } from 'react'
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

// =============================================================================
// GREEK KEY / MEANDER PATTERN
// =============================================================================
function GreekKeyBorder({ className = '', animated = true }: { className?: string; animated?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 20"
        className="w-full h-5"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #d4af37)' }}
      >
        <defs>
          <pattern id="greekKey" patternUnits="userSpaceOnUse" width="40" height="20">
            <path
              d="M0 10 L10 10 L10 0 L30 0 L30 10 L20 10 L20 20 L40 20"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
            />
          </pattern>
          {animated && (
            <linearGradient id="keyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3">
                <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#fff" stopOpacity="0.8">
                <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3">
                <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          )}
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#greekKey)" />
        {animated && <rect x="0" y="0" width="100%" height="100%" fill="url(#keyGlow)" opacity="0.5" />}
      </svg>
    </div>
  )
}

// =============================================================================
// LAUREL WREATH
// =============================================================================
function LaurelWreath({ size = 'large' }: { size?: 'large' | 'small' }) {
  const scale = size === 'large' ? 1 : 0.5
  return (
    <svg
      viewBox="0 0 200 60"
      className="absolute"
      style={{
        width: `${200 * scale}px`,
        height: `${60 * scale}px`,
        filter: 'drop-shadow(0 0 8px #d4af3780)',
      }}
    >
      <defs>
        <linearGradient id="laurelGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0d060" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a08020" />
        </linearGradient>
      </defs>
      {/* Left branch */}
      <g transform="translate(10, 30)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={`left-${i}`}
            cx={15 + i * 12}
            cy={-5 + Math.sin(i * 0.5) * 8}
            rx="8"
            ry="4"
            fill="url(#laurelGold)"
            transform={`rotate(${-30 + i * 5}, ${15 + i * 12}, ${-5 + Math.sin(i * 0.5) * 8})`}
            style={{ animation: `laurelSway ${2 + i * 0.2}s ease-in-out infinite alternate` }}
          />
        ))}
        <path d="M10 0 Q50 -10 90 5" fill="none" stroke="#8b7020" strokeWidth="2" />
      </g>
      {/* Right branch */}
      <g transform="translate(190, 30) scale(-1, 1)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={`right-${i}`}
            cx={15 + i * 12}
            cy={-5 + Math.sin(i * 0.5) * 8}
            rx="8"
            ry="4"
            fill="url(#laurelGold)"
            transform={`rotate(${-30 + i * 5}, ${15 + i * 12}, ${-5 + Math.sin(i * 0.5) * 8})`}
            style={{ animation: `laurelSway ${2 + i * 0.2}s ease-in-out infinite alternate` }}
          />
        ))}
        <path d="M10 0 Q50 -10 90 5" fill="none" stroke="#8b7020" strokeWidth="2" />
      </g>
    </svg>
  )
}

// =============================================================================
// ANIMATED FLAMES
// =============================================================================
function AnimatedFlames({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`fixed top-0 bottom-0 w-20 pointer-events-none z-[4] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      {/* Multiple flame layers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: side === 'left' ? `${10 + i * 15}px` : 'auto',
            right: side === 'right' ? `${10 + i * 15}px` : 'auto',
            width: '30px',
            height: '150px',
            background: `linear-gradient(to top,
              #ff3344 0%,
              #ff6633 30%,
              #ffaa33 60%,
              #ffdd66 80%,
              transparent 100%)`,
            borderRadius: '50% 50% 20% 20%',
            filter: 'blur(3px)',
            animation: `flameFlicker ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.15}s`,
            opacity: 0.7,
          }}
        />
      ))}
      {/* Core bright flame */}
      <div
        className="absolute bottom-0"
        style={{
          left: side === 'left' ? '25px' : 'auto',
          right: side === 'right' ? '25px' : 'auto',
          width: '20px',
          height: '100px',
          background: 'linear-gradient(to top, #fff 0%, #ffee88 50%, transparent 100%)',
          borderRadius: '50% 50% 20% 20%',
          filter: 'blur(2px)',
          animation: 'flameCoreFlicker 0.3s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}

// =============================================================================
// GOD SILHOUETTES
// =============================================================================
function GodSilhouette({ god, position }: { god: 'zeus' | 'athena' | 'ares' | 'hades'; position: string }) {
  const paths = {
    zeus: 'M50 10 L55 25 L70 30 L55 35 L60 50 L50 40 L40 50 L45 35 L30 30 L45 25 Z M50 50 L45 80 L40 100 L50 90 L60 100 L55 80 Z', // Lightning bolt figure
    athena: 'M50 5 L50 15 L40 15 L35 25 L40 25 L35 30 L45 30 L45 50 L40 50 L40 100 L60 100 L60 50 L55 50 L55 30 L65 30 L60 25 L65 25 L60 15 L50 15 M45 55 L45 70 L55 70 L55 55 Z', // Helmeted figure with shield
    ares: 'M50 5 L45 20 L30 25 L45 30 L40 40 L50 35 L60 40 L55 30 L70 25 L55 20 Z M45 45 L35 100 M55 45 L65 100 M50 45 L50 80 M30 60 L70 60', // Warrior with spear
    hades: 'M50 5 L35 25 L40 25 L35 40 L45 35 L40 50 L50 45 L60 50 L55 35 L65 40 L60 25 L65 25 L50 5 M40 55 L35 100 L50 85 L65 100 L60 55 Z', // Dark crowned figure
  }

  const colors = {
    zeus: '#5588ff',
    athena: '#44dd88',
    ares: '#ff3344',
    hades: '#8844ff',
  }

  return (
    <div className={`fixed ${position} pointer-events-none z-[3] opacity-20 hover:opacity-40 transition-opacity`}>
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <path
          d={paths[god]}
          fill={colors[god]}
          stroke={colors[god]}
          strokeWidth="1"
          style={{ filter: `drop-shadow(0 0 10px ${colors[god]})` }}
        />
      </svg>
    </div>
  )
}

// =============================================================================
// SKULLS AND BONES
// =============================================================================
function SkullDecoration({ position, size = 40 }: { position: string; size?: number }) {
  return (
    <div className={`absolute ${position} pointer-events-none`}>
      <svg viewBox="0 0 50 60" width={size} height={size * 1.2} style={{ filter: 'drop-shadow(0 0 5px #ff334480)' }}>
        {/* Skull */}
        <ellipse cx="25" cy="20" rx="18" ry="16" fill="#e8ddd0" />
        <ellipse cx="25" cy="25" rx="14" ry="10" fill="#d4c8b8" />
        {/* Eye sockets */}
        <ellipse cx="18" cy="18" rx="5" ry="6" fill="#1a0a10" />
        <ellipse cx="32" cy="18" rx="5" ry="6" fill="#1a0a10" />
        {/* Eye glow */}
        <ellipse cx="18" cy="18" rx="2" ry="3" fill="#ff3344" opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="32" cy="18" rx="2" ry="3" fill="#ff3344" opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Nose */}
        <path d="M25 22 L23 28 L27 28 Z" fill="#1a0a10" />
        {/* Teeth */}
        <rect x="17" y="32" width="16" height="6" fill="#e8ddd0" rx="1" />
        <line x1="20" y1="32" x2="20" y2="38" stroke="#1a0a10" strokeWidth="1" />
        <line x1="23" y1="32" x2="23" y2="38" stroke="#1a0a10" strokeWidth="1" />
        <line x1="27" y1="32" x2="27" y2="38" stroke="#1a0a10" strokeWidth="1" />
        <line x1="30" y1="32" x2="30" y2="38" stroke="#1a0a10" strokeWidth="1" />
        {/* Jaw */}
        <path d="M12 30 Q25 45 38 30" fill="none" stroke="#d4c8b8" strokeWidth="3" />
      </svg>
    </div>
  )
}

function BoneDecoration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 20" className={`h-4 ${className}`} style={{ filter: 'drop-shadow(0 0 3px #a0908080)' }}>
      <ellipse cx="8" cy="5" rx="6" ry="4" fill="#e8ddd0" />
      <ellipse cx="8" cy="15" rx="6" ry="4" fill="#e8ddd0" />
      <rect x="6" y="5" width="68" height="10" fill="#d4c8b8" rx="3" />
      <ellipse cx="72" cy="5" rx="6" ry="4" fill="#e8ddd0" />
      <ellipse cx="72" cy="15" rx="6" ry="4" fill="#e8ddd0" />
    </svg>
  )
}

// =============================================================================
// BLOOD / ICHOR DRIPS
// =============================================================================
function IchorDrips() {
  const [drips, setDrips] = useState<Array<{ id: number; x: number; delay: number; duration: number; isIchor: boolean }>>([])

  useEffect(() => {
    setDrips(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 4,
        isIchor: Math.random() > 0.7, // 30% golden ichor, 70% blood
      }))
    )
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-full pointer-events-none z-[6] overflow-hidden">
      {drips.map((drip) => (
        <div
          key={drip.id}
          className="absolute top-0 animate-drip"
          style={{
            left: `${drip.x}%`,
            width: '4px',
            height: '30px',
            background: drip.isIchor
              ? 'linear-gradient(180deg, #d4af37, #ffdd88)'
              : 'linear-gradient(180deg, #ff3344, #880022)',
            borderRadius: '0 0 50% 50%',
            boxShadow: drip.isIchor
              ? '0 0 10px #d4af37, 0 5px 15px #d4af3780'
              : '0 0 10px #ff3344, 0 5px 15px #ff334480',
            animationDelay: `${drip.delay}s`,
            animationDuration: `${drip.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// SHIELD AND SPEAR
// =============================================================================
function ShieldOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" className={`w-12 h-14 ${className}`}>
      <defs>
        <radialGradient id="shieldGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#c4a030" />
          <stop offset="50%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#5a4510" />
        </radialGradient>
      </defs>
      {/* Shield body */}
      <path
        d="M30 5 L55 15 L55 40 Q55 60 30 68 Q5 60 5 40 L5 15 Z"
        fill="url(#shieldGrad)"
        stroke="#d4af37"
        strokeWidth="2"
      />
      {/* Shield pattern - Greek lambda */}
      <path d="M30 20 L22 50 M30 20 L38 50 M24 40 L36 40" stroke="#1a0a10" strokeWidth="3" fill="none" />
      {/* Shield boss */}
      <circle cx="30" cy="35" r="8" fill="#d4af37" stroke="#8b6914" strokeWidth="2" />
    </svg>
  )
}

function SpearDivider() {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      <svg viewBox="0 0 100 20" className="w-20 h-5 mx-2">
        {/* Spear tip */}
        <polygon points="0,10 15,5 15,15" fill="#d4af37" />
        {/* Shaft */}
        <rect x="15" y="8" width="70" height="4" fill="#8b6914" />
        {/* End decoration */}
        <polygon points="85,10 100,5 100,15" fill="#d4af37" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
    </div>
  )
}

// =============================================================================
// CERBERUS
// =============================================================================
function CerberusSilhouette() {
  return (
    <div className="relative w-full flex justify-center">
      <svg viewBox="0 0 200 80" className="w-48 h-20" style={{ filter: 'drop-shadow(0 0 15px #ff334480)' }}>
        <defs>
          <linearGradient id="cerberusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a2020" />
            <stop offset="100%" stopColor="#1a0a10" />
          </linearGradient>
        </defs>
        {/* Body */}
        <ellipse cx="100" cy="60" rx="50" ry="20" fill="url(#cerberusGrad)" />
        {/* Left head */}
        <g transform="translate(50, 30)">
          <ellipse cx="0" cy="0" rx="15" ry="12" fill="url(#cerberusGrad)" />
          <ellipse cx="-5" cy="-3" rx="2" ry="2" fill="#ff3344">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M-10 5 Q0 15 10 5" fill="none" stroke="#ff3344" strokeWidth="1" /> {/* Snarl */}
          <polygon points="-8,-10 -5,-15 -2,-10" fill="url(#cerberusGrad)" /> {/* Ear */}
        </g>
        {/* Center head (larger) */}
        <g transform="translate(100, 20)">
          <ellipse cx="0" cy="0" rx="18" ry="15" fill="url(#cerberusGrad)" />
          <ellipse cx="-6" cy="-4" rx="3" ry="3" fill="#ff3344">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="6" cy="-4" rx="3" ry="3" fill="#ff3344">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <path d="M-12 8 Q0 20 12 8" fill="none" stroke="#ff3344" strokeWidth="2" />
          <polygon points="-12,-12 -8,-20 -4,-12" fill="url(#cerberusGrad)" />
          <polygon points="4,-12 8,-20 12,-12" fill="url(#cerberusGrad)" />
        </g>
        {/* Right head */}
        <g transform="translate(150, 30)">
          <ellipse cx="0" cy="0" rx="15" ry="12" fill="url(#cerberusGrad)" />
          <ellipse cx="5" cy="-3" rx="2" ry="2" fill="#ff3344">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
          <path d="M-10 5 Q0 15 10 5" fill="none" stroke="#ff3344" strokeWidth="1" />
          <polygon points="2,-10 5,-15 8,-10" fill="url(#cerberusGrad)" />
        </g>
        {/* Legs */}
        <rect x="60" y="55" width="8" height="20" fill="url(#cerberusGrad)" rx="3" />
        <rect x="80" y="55" width="8" height="22" fill="url(#cerberusGrad)" rx="3" />
        <rect x="112" y="55" width="8" height="22" fill="url(#cerberusGrad)" rx="3" />
        <rect x="132" y="55" width="8" height="20" fill="url(#cerberusGrad)" rx="3" />
      </svg>
    </div>
  )
}

// =============================================================================
// POMEGRANATE SEEDS
// =============================================================================
function PomegranateSeeds() {
  const [seeds, setSeeds] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    setSeeds(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {seeds.map((seed) => (
        <div
          key={seed.id}
          className="absolute animate-seed-glow"
          style={{
            left: `${seed.x}%`,
            top: `${seed.y}%`,
            width: `${seed.size}px`,
            height: `${seed.size * 1.3}px`,
            background: 'radial-gradient(ellipse at 30% 30%, #ff6688, #cc2244, #880022)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            boxShadow: '0 0 10px #ff334480, inset 0 -2px 4px #440011',
            animationDelay: `${seed.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// STYX RIVER
// =============================================================================
function StyxRiver() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[7] overflow-hidden">
      {/* River base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #0a151a 30%, #051015 100%)',
        }}
      />
      {/* Flowing water effect */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="styxWater" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a2030">
              <animate attributeName="stop-color" values="#0a2030;#102840;#0a2030" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#153050">
              <animate attributeName="stop-color" values="#153050;#204060;#153050" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#0a2030">
              <animate attributeName="stop-color" values="#0a2030;#102840;#0a2030" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <rect x="0" y="40" width="100%" height="100" fill="url(#styxWater)" opacity="0.8" />
      </svg>
      {/* Floating souls */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-soul-drift"
          style={{
            bottom: `${20 + Math.random() * 30}px`,
            left: `${-10 + i * 15}%`,
            width: '20px',
            height: '30px',
            background: 'radial-gradient(ellipse at 50% 30%, #88aacc40, #44668820, transparent)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            filter: 'blur(2px)',
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
      {/* Green glow from depths */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8"
        style={{
          background: 'linear-gradient(180deg, transparent, #22886620)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  )
}

// =============================================================================
// FLOATING EMBERS (enhanced)
// =============================================================================
function EmberParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number; size: number }>>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 animate-ember-rise"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.size > 4 ? '#ffaa33' : '#ff6655',
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size * 2}px ${p.size > 4 ? '#ffaa33' : '#ff6655'}, 0 0 ${p.size * 4}px ${p.size > 4 ? '#ff8800' : '#ff3344'}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// GREEK COLUMN (enhanced with flames)
// =============================================================================
function GreekColumn({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`fixed top-0 bottom-0 w-20 pointer-events-none z-[3] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      style={{
        background: 'linear-gradient(180deg, #4a2020, #251518, #1a0a10)',
        borderRight: side === 'left' ? '3px solid #d4af37' : 'none',
        borderLeft: side === 'right' ? '3px solid #d4af37' : 'none',
      }}
    >
      {/* Column top - Ionic capital */}
      <div className="absolute top-0 w-full h-32">
        <svg viewBox="0 0 80 120" className="w-full h-full">
          <defs>
            <linearGradient id="columnGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0d060" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>
          </defs>
          {/* Volutes (scrolls) */}
          <circle cx="15" cy="30" r="12" fill="none" stroke="url(#columnGold)" strokeWidth="3" />
          <circle cx="65" cy="30" r="12" fill="none" stroke="url(#columnGold)" strokeWidth="3" />
          <circle cx="15" cy="30" r="6" fill="url(#columnGold)" />
          <circle cx="65" cy="30" r="6" fill="url(#columnGold)" />
          {/* Connecting band */}
          <rect x="15" y="24" width="50" height="12" fill="url(#columnGold)" />
          {/* Echinus */}
          <ellipse cx="40" cy="50" rx="35" ry="8" fill="url(#columnGold)" />
          {/* Abacus */}
          <rect x="5" y="55" width="70" height="10" fill="url(#columnGold)" />
        </svg>
      </div>

      {/* Column fluting pattern */}
      <div
        className="absolute top-32 bottom-32 w-full"
        style={{
          background: `repeating-linear-gradient(90deg,
            #3a1818 0px,
            #4a2020 5px,
            #3a1818 10px)`,
        }}
      />

      {/* Column base */}
      <div className="absolute bottom-0 w-full h-32">
        <svg viewBox="0 0 80 120" className="w-full h-full">
          <rect x="5" y="0" width="70" height="10" fill="url(#columnGold)" />
          <ellipse cx="40" cy="20" rx="35" ry="8" fill="url(#columnGold)" />
          <rect x="10" y="25" width="60" height="40" fill="#4a2020" />
          <ellipse cx="40" cy="70" rx="38" ry="10" fill="url(#columnGold)" />
          <rect x="2" y="75" width="76" height="45" fill="#3a1818" />
        </svg>
      </div>

      {/* Skull on column */}
      {side === 'left' && <SkullDecoration position="top-40 left-2" size={35} />}
      {side === 'right' && <SkullDecoration position="top-40 right-2" size={35} />}
    </div>
  )
}

// =============================================================================
// BOON CARD (profession selector)
// =============================================================================
function BoonCard({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const gods = {
    engineer: { name: 'ATHENA', color: '#44dd88', title: 'Goddess of Wisdom' },
    drummer: { name: 'APOLLO', color: '#ffaa33', title: 'God of Music' },
    fighter: { name: 'ARES', color: '#ff3344', title: 'God of War' },
  }
  const god = gods[profession]

  return (
    <button
      onClick={onClick}
      className={`relative p-6 transition-all duration-300 group ${
        isActive ? 'scale-110 z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'
      }`}
      style={{
        background: isActive
          ? `linear-gradient(180deg, ${god.color}40, #1a0a10)`
          : 'linear-gradient(180deg, #301a20, #1a0a10)',
        border: `3px solid ${isActive ? god.color : '#4a2020'}`,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        minWidth: '140px',
      }}
    >
      {/* Animated glow */}
      {isActive && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${god.color}40, transparent 70%)`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      )}

      <div className="relative z-10 text-center">
        {/* God silhouette icon */}
        <div
          className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${god.color}30, transparent)`,
            border: `2px solid ${god.color}60`,
          }}
        >
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            {profession === 'engineer' && (
              // Athena - owl/helmet
              <g fill={god.color}>
                <circle cx="20" cy="15" r="8" />
                <path d="M12 13 L8 8 L12 10 M28 13 L32 8 L28 10" />
                <rect x="15" y="22" width="10" height="15" rx="2" />
                <path d="M10 25 L15 22 L15 37 L10 35 Z" />
                <path d="M30 25 L25 22 L25 37 L30 35 Z" />
              </g>
            )}
            {profession === 'drummer' && (
              // Apollo - lyre/sun
              <g fill={god.color}>
                <circle cx="20" cy="12" r="8" />
                <path d="M12 12 L5 5 M28 12 L35 5 M20 4 L20 -2 M14 6 L10 0 M26 6 L30 0" stroke={god.color} strokeWidth="2" />
                <path d="M12 20 Q12 35 20 38 Q28 35 28 20 Z" />
                <line x1="14" y1="22" x2="14" y2="34" stroke="#1a0a10" strokeWidth="1" />
                <line x1="17" y1="22" x2="17" y2="36" stroke="#1a0a10" strokeWidth="1" />
                <line x1="20" y1="22" x2="20" y2="37" stroke="#1a0a10" strokeWidth="1" />
                <line x1="23" y1="22" x2="23" y2="36" stroke="#1a0a10" strokeWidth="1" />
                <line x1="26" y1="22" x2="26" y2="34" stroke="#1a0a10" strokeWidth="1" />
              </g>
            )}
            {profession === 'fighter' && (
              // Ares - helmet/spear
              <g fill={god.color}>
                <path d="M20 5 L10 15 L10 25 L20 20 L30 25 L30 15 Z" />
                <rect x="18" y="3" width="4" height="8" />
                <circle cx="20" cy="28" r="6" />
                <rect x="18" y="32" width="4" height="8" />
                <line x1="32" y1="5" x2="32" y2="40" stroke={god.color} strokeWidth="2" />
                <polygon points="32,2 28,8 36,8" />
              </g>
            )}
          </svg>
        </div>
        <span
          className="text-lg font-bold tracking-wider block"
          style={{ color: god.color, textShadow: `0 0 10px ${god.color}60` }}
        >
          {god.name}
        </span>
        <span className="text-[10px] block mt-1" style={{ color: '#a08888' }}>
          {god.title}
        </span>
      </div>

      {/* Laurel selection indicator */}
      {isActive && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <svg viewBox="0 0 60 20" className="w-12 h-4">
            <path d="M5 15 Q15 5 30 10 Q45 5 55 15" fill="none" stroke="#d4af37" strokeWidth="2" />
            {[0, 1, 2, 3, 4].map(i => (
              <ellipse key={i} cx={10 + i * 10} cy={12 - Math.abs(2 - i) * 2} rx="4" ry="2" fill="#d4af37" transform={`rotate(${-20 + i * 10}, ${10 + i * 10}, ${12 - Math.abs(2 - i) * 2})`} />
            ))}
          </svg>
        </div>
      )}
    </button>
  )
}

// =============================================================================
// BLESSING SKILL
// =============================================================================
function BlessingSkill({ name, level, color }: { name: string; level: number; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2 group cursor-pointer hover:bg-[#ffffff08] px-2 rounded transition-colors">
      {/* Shield icon */}
      <div className="w-8 h-9 relative">
        <svg viewBox="0 0 30 36" className="w-full h-full">
          <path
            d="M15 2 L28 8 L28 20 Q28 32 15 35 Q2 32 2 20 L2 8 Z"
            fill={`${color}30`}
            stroke={color}
            strokeWidth="2"
          />
          <text x="15" y="22" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">
            {level}
          </text>
        </svg>
      </div>
      <span className="text-xs flex-1" style={{ color: '#f0e8e0' }}>
        {name}
      </span>
      {/* Gem indicators */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-4"
            style={{
              background: i < level
                ? `linear-gradient(180deg, ${color}, ${color}80)`
                : '#2a1518',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: i < level ? `0 0 5px ${color}60` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// KEEPSAKE PROJECT CARD
// =============================================================================
function KeepsakeCard({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 300 + index * 150)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <div
      className={`relative p-4 transition-all duration-500 group cursor-pointer ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, #301a20, #1a0a10)',
        border: '2px solid #ff334480',
        borderRadius: '8px',
      }}
    >
      {/* Blood drip accent */}
      <div
        className="absolute top-0 left-4 w-1 h-6"
        style={{
          background: 'linear-gradient(180deg, #ff3344, transparent)',
          borderRadius: '0 0 50% 50%',
        }}
      />
      <div
        className="absolute top-0 right-8 w-1 h-4"
        style={{
          background: 'linear-gradient(180deg, #ff3344, transparent)',
          borderRadius: '0 0 50% 50%',
        }}
      />

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold" style={{ color: '#ff3344' }}>
          {project.name}
        </h3>
        {project.featured && (
          <ShieldOrnament className="w-6 h-7 -mt-1" />
        )}
      </div>
      <p className="text-[10px] mb-3" style={{ color: '#a08888' }}>
        {project.tagline}
      </p>
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5"
            style={{
              background: '#ff334420',
              color: '#ff6655',
              border: '1px solid #ff334440',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Bone decoration */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-30">
        <BoneDecoration className="w-16" />
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px #ff334430, 0 0 20px #ff334420',
        }}
      />
    </div>
  )
}

// =============================================================================
// EXPERIENCE CARD (Work Experience)
// =============================================================================
function ExperienceCard({ entry, index }: { entry: typeof EXPERIENCE_DATA[0]; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 200 + index * 100)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <div
      className={`relative p-4 transition-all duration-500 ${
        revealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, #251518, #1a0a10)',
        border: '1px solid #d4af3760',
        borderLeft: '3px solid #d4af37',
      }}
    >
      {/* Golden accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, #d4af37, transparent)',
        }}
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: '#f0e8e0' }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color: '#d4af37' }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            background: '#ff334420',
            border: '1px solid #ff334440',
            color: '#ff6655',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      <p className="text-xs mb-2" style={{ color: '#a08888' }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: '#f0e8e0' }}
            >
              <span style={{ color: '#d4af37' }}>&#9670;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Subtle skull decoration for larger entries */}
      {entry.highlights && entry.highlights.length > 0 && (
        <div className="absolute -right-2 -bottom-2 opacity-10">
          <SkullDecoration position="" size={20} />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// ZAGREUS-STYLE ALEXANDER CHARACTER
// =============================================================================
function ZagGreusCharacter({
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
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 140)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Prince of the Underworld"
        fill
        className="object-contain"
        style={{ filter: 'brightness(1.1) contrast(1.3) hue-rotate(-10deg) saturate(1.2)' }}
      />
      {/* Laurel crown glow */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4"
        style={{
          background: 'radial-gradient(ellipse, #d4af3780 0%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />
      {/* Blood foot effect */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-3"
        style={{
          background: 'radial-gradient(ellipse, #ff334450 0%, transparent 70%)',
          animation: 'bloodPulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  )
}

// =============================================================================
// OLYMPIAN PROFESSION ORNAMENTS
// =============================================================================
function OlympianOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { icon: '🦉', x: 5, y: 25, size: 32, god: 'athena' },
      { icon: '⚡', x: 90, y: 30, size: 28, god: 'zeus' },
      { icon: '🔱', x: 7, y: 70, size: 26, god: 'poseidon' },
      { icon: '🌿', x: 88, y: 75, size: 28, god: 'demeter' },
    ],
    drummer: [
      { icon: '🎸', x: 4, y: 22, size: 30, god: 'apollo' },
      { icon: '☀️', x: 92, y: 28, size: 32, god: 'apollo' },
      { icon: '🍇', x: 5, y: 68, size: 26, god: 'dionysus' },
      { icon: '🌙', x: 90, y: 72, size: 28, god: 'artemis' },
    ],
    fighter: [
      { icon: '⚔️', x: 5, y: 24, size: 30, god: 'ares' },
      { icon: '🛡️', x: 91, y: 26, size: 28, god: 'athena' },
      { icon: '💀', x: 6, y: 70, size: 26, god: 'hades' },
      { icon: '🔥', x: 89, y: 74, size: 30, god: 'ares' },
    ],
  }

  const godColors: Record<string, string> = {
    athena: '#44dd88',
    zeus: '#5588ff',
    poseidon: '#44aaff',
    demeter: '#88cc44',
    apollo: '#ffaa33',
    dionysus: '#aa44ff',
    artemis: '#88ff88',
    ares: '#ff3344',
    hades: '#8844ff',
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.35,
            filter: `drop-shadow(0 0 12px ${godColors[item.god]})`,
            animation: `olympianFloat ${14 + i * 4}s ease-in-out infinite`,
            animationDelay: `${-i * 3}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// DASH REVEAL SECTION (Zagreus dash animation)
// =============================================================================
function DashRevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'dashing' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('dashing')
      setTimeout(() => setPhase('revealed'), 600)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Dash animation */}
      {phase === 'dashing' && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ animation: 'zagDash 0.6s ease-out forwards' }}
          >
            <ZagGreusCharacter size={45} direction="right" />
          </div>
          {/* Dash trail */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-8"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, transparent 0%, #ff334460 50%, transparent 100%)',
              animation: 'dashTrail 0.4s ease-out forwards',
            }}
          />
          {/* Blood splatter */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #ff334420 0%, transparent 40%)',
              animation: 'bloodFlash 0.3s ease-out',
            }}
          />
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateX(0)' : 'translateX(-15px)',
          transition: 'all 0.5s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MythicTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const godColors = {
    engineer: '#44dd88',
    drummer: '#ffaa33',
    fighter: '#ff3344',
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #2a1520, #1a0a10, #0a0508)',
        fontFamily: '"Cinzel", "Georgia", serif',
      }}
    >
      {/* Background layers */}
      <PomegranateSeeds />
      <EmberParticles />
      <IchorDrips />

      {/* Profession ornaments */}
      <OlympianOrnaments profession={active} />

      {/* Side decorations */}
      <GreekColumn side="left" />
      <GreekColumn side="right" />
      <AnimatedFlames side="left" />
      <AnimatedFlames side="right" />

      {/* God silhouettes in corners */}
      <GodSilhouette god="zeus" position="top-40 left-24" />
      <GodSilhouette god="athena" position="top-40 right-24" />
      <GodSilhouette god="ares" position="bottom-40 left-24" />
      <GodSilhouette god="hades" position="bottom-40 right-24" />

      {/* Blood vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #ff334415, transparent 50%), radial-gradient(ellipse at 50% 100%, #ff334420, transparent 50%)',
        }}
      />

      {/* Styx river at bottom */}
      <StyxRiver />

      {/* Header */}
      <header className="relative z-30 pt-8 pb-4 text-center">
        <div className="max-w-4xl mx-auto px-24">
          {/* Greek key top border */}
          <GreekKeyBorder className="mb-4" />

          {/* Laurel wreath with title */}
          <div className="relative flex justify-center items-center mb-2">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2">
              <LaurelWreath size="large" />
            </div>
            <h1
              className="text-4xl tracking-[0.2em] relative z-10 px-8"
              style={{
                color: '#d4af37',
                textShadow: '0 0 30px #d4af3760, 0 2px 4px #000',
              }}
            >
              ALEXANDER PULIDO
            </h1>
          </div>

          <p className="text-sm tracking-widest mb-2" style={{ color: '#a08888' }}>
            {config.title.toUpperCase()}
          </p>
          <p className="text-xs tracking-[0.3em]" style={{ color: '#ff6655' }}>
            ESCAPE FROM THE UNDERWORLD
          </p>

          <SpearDivider />

          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/cv"
              className="px-6 py-2 text-sm tracking-wider transition-all hover:scale-105 relative group"
              style={{
                background: 'transparent',
                border: '2px solid #d4af37',
                color: '#d4af37',
              }}
            >
              <span className="relative z-10">CODEX</span>
              <div className="absolute inset-0 bg-[#d4af3720] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-6 py-2 text-sm tracking-wider transition-all hover:scale-105 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(180deg, #ff3344, #aa1122)',
                color: '#fff',
                boxShadow: '0 0 20px #ff334480, inset 0 1px 0 #ff6655',
              }}
            >
              <span className="relative z-10">ENTER TARTARUS</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(180deg, #ff4455, #cc2233)',
                }}
              />
            </Link>
            <ThemeSwitcher />
          </div>

          <GreekKeyBorder className="mt-4" />
        </div>
      </header>

      {/* Boon selection */}
      <section className="relative z-20 py-8">
        <div className="text-center mb-4">
          <span className="text-xs tracking-[0.3em]" style={{ color: '#d4af37' }}>
            CHOOSE YOUR PATRON
          </span>
        </div>
        <div className="flex justify-center gap-8">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <BoonCard
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
            />
          ))}
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-20 px-24 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bio as prophecy */}
          <DashRevealSection>
          <section
            className="relative p-8 mb-8 text-center"
            style={{
              background: 'linear-gradient(180deg, #301a2080, #1a0a1080)',
              border: '1px solid #d4af3740',
            }}
          >
            {/* Corner skulls */}
            <SkullDecoration position="top-2 left-2" size={30} />
            <SkullDecoration position="top-2 right-2" size={30} />

            {/* Greek key borders */}
            <div className="absolute top-0 left-8 right-8">
              <GreekKeyBorder animated={false} />
            </div>
            <div className="absolute bottom-0 left-8 right-8 rotate-180">
              <GreekKeyBorder animated={false} />
            </div>

            <h2 className="text-lg mb-4 flex items-center justify-center gap-3" style={{ color: '#d4af37' }}>
              <ShieldOrnament className="w-8 h-10" />
              About
              <ShieldOrnament className="w-8 h-10 scale-x-[-1]" />
            </h2>
            <p
              className="text-sm leading-relaxed italic max-w-2xl mx-auto"
              style={{ color: '#f0e8e0' }}
            >
              &ldquo;{aboutData.bio}&rdquo;
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-4 py-1 relative"
                  style={{
                    background: '#ff334420',
                    border: '1px solid #ff334480',
                    color: '#ff6655',
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </section>
          </DashRevealSection>

          <SpearDivider />

          {/* Work Experience */}
          {experience.length > 0 && (
            <DashRevealSection>
              <section
                className="relative p-6 mb-8"
                style={{
                  background: 'linear-gradient(180deg, #251518, #1a0a10)',
                  border: '1px solid #d4af3740',
                }}
              >
                {/* Greek key borders */}
                <div className="absolute top-0 left-4 right-4">
                  <GreekKeyBorder animated={false} />
                </div>

                <h2 className="text-lg mb-6 mt-4 flex items-center gap-3" style={{ color: '#d4af37' }}>
                  <svg viewBox="0 0 20 20" className="w-5 h-5">
                    <polygon points="10,0 20,7 17,20 3,20 0,7" fill="#d4af37" />
                  </svg>
                  Work Experience
                  <div className="flex-1 h-px ml-3" style={{ background: 'linear-gradient(90deg, #d4af3760, transparent)' }} />
                </h2>

                <div className="space-y-4">
                  {experience.map((entry, i) => (
                    <ExperienceCard key={entry.id} entry={entry} index={i} />
                  ))}
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <BoneDecoration className="w-20 opacity-40" />
                </div>
              </section>
            </DashRevealSection>
          )}

          <SpearDivider />

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Tech Stack / Skills */}
            <section
              className="relative p-6"
              style={{
                background: 'linear-gradient(180deg, #251518, #1a0a10)',
                border: '1px solid #4a2020',
              }}
            >
              <BoneDecoration className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 opacity-50" />

              <h2 className="text-lg mb-4 flex items-center gap-2" style={{ color: godColors[active] }}>
                <svg viewBox="0 0 20 20" className="w-5 h-5">
                  <polygon points="10,0 20,7 17,20 3,20 0,7" fill={godColors[active]} />
                </svg>
                {active === 'engineer' ? 'Tech Stack' : 'Skills'}
              </h2>
              {otherSkills.map((category) => (
                <div key={category.name} className="mb-4 last:mb-0">
                  <h3
                    className="text-xs tracking-widest mb-2 pb-1 border-b flex items-center gap-2"
                    style={{ color: '#d4af37', borderColor: '#d4af3740' }}
                  >
                    <span className="text-[8px]">&#9670;</span>
                    {category.name.toUpperCase()}
                    <span className="text-[8px]">&#9670;</span>
                  </h3>
                  {category.skills.map((skill) => (
                    <BlessingSkill
                      key={skill.name}
                      name={skill.name}
                      level={skill.proficiency}
                      color={godColors[active]}
                    />
                  ))}
                </div>
              ))}
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-lg mb-4 flex items-center gap-2" style={{ color: '#ff3344' }}>
                <svg viewBox="0 0 20 20" className="w-5 h-5">
                  <polygon points="10,0 20,7 17,20 3,20 0,7" fill="#ff3344" />
                </svg>
                Featured Work
              </h2>
              <div className="space-y-4">
                {projects.slice(0, 4).map((project, i) => (
                  <KeepsakeCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Cerberus guardian */}
      <div className="relative z-20 py-8">
        <CerberusSilhouette />
      </div>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center pb-36">
        <GreekKeyBorder className="max-w-md mx-auto mb-4" />
        <p className="text-xs tracking-widest flex items-center justify-center gap-4" style={{ color: '#a08888' }}>
          <span className="text-[#d4af37]">&#9670;</span>
          DEATH IS NOT THE END
          <span className="text-[#d4af37]">&#9670;</span>
          MMXXVI
          <span className="text-[#d4af37]">&#9670;</span>
        </p>
        <GreekKeyBorder className="max-w-md mx-auto mt-4" />
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

        @keyframes ember-rise {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0.3);
          }
        }
        .animate-ember-rise {
          animation: ember-rise linear infinite;
        }

        @keyframes flameFlicker {
          0% {
            transform: scaleY(1) scaleX(1) translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.1) scaleX(0.95) translateY(-5px);
            opacity: 0.8;
          }
          100% {
            transform: scaleY(0.9) scaleX(1.05) translateY(2px);
            opacity: 0.7;
          }
        }

        @keyframes flameCoreFlicker {
          0% {
            transform: scaleY(1) translateY(0);
            opacity: 0.9;
          }
          100% {
            transform: scaleY(1.15) translateY(-3px);
            opacity: 1;
          }
        }

        @keyframes drip {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        .animate-drip {
          animation: drip ease-in infinite;
        }

        @keyframes laurelSway {
          0% {
            transform: rotate(-2deg);
          }
          100% {
            transform: rotate(2deg);
          }
        }

        @keyframes seed-glow {
          0%, 100% {
            opacity: 0.4;
            filter: brightness(0.8);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.2);
          }
        }
        .animate-seed-glow {
          animation: seed-glow 3s ease-in-out infinite;
        }

        @keyframes soul-drift {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(120vw) translateY(-10px);
            opacity: 0;
          }
        }
        .animate-soul-drift {
          animation: soul-drift linear infinite;
        }

        @keyframes olympianFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
          25% { transform: translateY(-12px) rotate(5deg); opacity: 0.45; }
          50% { transform: translateY(-5px) rotate(-3deg); opacity: 0.3; }
          75% { transform: translateY(-15px) rotate(3deg); opacity: 0.4; }
        }

        @keyframes zagDash {
          0% { left: -60px; opacity: 1; }
          70% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        @keyframes dashTrail {
          0% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 0.6; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(1.2); }
        }

        @keyframes bloodFlash {
          0%, 100% { opacity: 0; }
          30% { opacity: 0.4; }
        }

        @keyframes bloodPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
