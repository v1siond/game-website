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
// ZELDA BREATH OF THE WILD / TEARS OF THE KINGDOM THEMED DECORATIVE ELEMENTS
// Featuring: Sheikah slate aesthetics, Triforce symbols, cel-shaded painterly style,
// Korok decorations, shrine glow effects, and Hylian-inspired patterns
//
// ALL CONTENT IMMEDIATELY VISIBLE - NO HIDING ANIMATIONS
// =============================================================================

// --- COLOR PALETTE ---
// Primary: Lush greens (#78c850, #40a060, #2a5a2a)
// Sky: (#70c8e0, #98d8f0, #88ccff)
// Gold: (#f8d030, #e8b820, #d4a020)
// Sheikah cyan: (#00d4ff, #40e8ff)
// Shrine orange: (#ff8844, #ffaa55)
// Ancient brown: (#8b7355, #5a4a3a)

// Triforce symbol - iconic Zelda element
function Triforce({ size = 40, color = '#f8d030', glowColor = '#ffe888' }: { size?: number; color?: string; glowColor?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.866}
      viewBox="0 0 100 87"
      aria-label="Triforce symbol"
      role="img"
    >
      <defs>
        <filter id="triforceGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="triforceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={glowColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Top triangle - Triforce of Power */}
      <polygon
        points="50,2 75,43 25,43"
        fill="url(#triforceGrad)"
        stroke={color}
        strokeWidth="1.5"
        filter="url(#triforceGlow)"
      />
      {/* Bottom left - Triforce of Courage */}
      <polygon
        points="25,45 50,85 0,85"
        fill="url(#triforceGrad)"
        stroke={color}
        strokeWidth="1.5"
        filter="url(#triforceGlow)"
      />
      {/* Bottom right - Triforce of Wisdom */}
      <polygon
        points="75,45 100,85 50,85"
        fill="url(#triforceGrad)"
        stroke={color}
        strokeWidth="1.5"
        filter="url(#triforceGlow)"
      />
    </svg>
  )
}

// Master Sword silhouette - legendary blade
function MasterSword({ size = 80, opacity = 0.15 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size * 0.25}
      height={size}
      viewBox="0 0 25 100"
      opacity={opacity}
      aria-label="Master Sword silhouette"
      role="img"
    >
      <defs>
        <linearGradient id="swordBlade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8f4ff" />
          <stop offset="50%" stopColor="#c0d8f0" />
          <stop offset="100%" stopColor="#a8c8e8" />
        </linearGradient>
        <linearGradient id="swordGuard" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4169E1" />
          <stop offset="50%" stopColor="#6699ff" />
          <stop offset="100%" stopColor="#4169E1" />
        </linearGradient>
      </defs>
      {/* Blade with pronounced tip */}
      <path
        d="M12.5,0 L15,55 L12.5,65 L10,55 Z"
        fill="url(#swordBlade)"
        stroke="#89b0d8"
        strokeWidth="0.5"
      />
      {/* Central groove */}
      <line x1="12.5" y1="5" x2="12.5" y2="58" stroke="#d0e8ff" strokeWidth="1" opacity="0.6" />
      {/* Crossguard - wings shape */}
      <path
        d="M2,60 Q5,58 12.5,60 Q20,58 23,60 L22,67 Q17,65 12.5,67 Q8,65 3,67 Z"
        fill="url(#swordGuard)"
        stroke="#2a4080"
        strokeWidth="1"
      />
      {/* Guard gem */}
      <ellipse cx="12.5" cy="63" rx="3" ry="2.5" fill="#f8d030" stroke="#e8b820" strokeWidth="0.5" />
      {/* Grip with wrapping */}
      <rect x="10" y="68" width="5" height="18" rx="1" fill="#5a4a3a" stroke="#3a2a1a" strokeWidth="0.5" />
      <path d="M10,70 L15,72 M10,74 L15,76 M10,78 L15,80 M10,82 L15,84" stroke="#7a6a5a" strokeWidth="1" opacity="0.6" />
      {/* Pommel with Triforce */}
      <circle cx="12.5" cy="92" r="5" fill="#f8d030" stroke="#e8b820" strokeWidth="1" />
      <polygon points="12.5,88 14.5,91 10.5,91" fill="#5a4a3a" opacity="0.6" />
    </svg>
  )
}

// Sheikah Eye symbol - ancient tech aesthetic
function SheikahEye({ size = 50, glowing = true }: { size?: number; glowing?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      aria-label="Sheikah Eye symbol"
      role="img"
    >
      <defs>
        <filter id="sheikahGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Tear drop below eye */}
      <path
        d="M50,45 Q55,55 50,70 Q45,55 50,45"
        fill={glowing ? '#00d4ff' : '#4a6a8a'}
        filter={glowing ? 'url(#sheikahGlow)' : undefined}
      />
      {/* Eye outline */}
      <path
        d="M10,30 Q50,0 90,30 Q50,60 10,30"
        fill="none"
        stroke={glowing ? '#00d4ff' : '#4a6a8a'}
        strokeWidth="4"
        filter={glowing ? 'url(#sheikahGlow)' : undefined}
      />
      {/* Pupil */}
      <circle
        cx="50"
        cy="30"
        r="12"
        fill={glowing ? '#00d4ff' : '#4a6a8a'}
        filter={glowing ? 'url(#sheikahGlow)' : undefined}
      />
      {/* Inner highlight */}
      <circle cx="46" cy="26" r="4" fill="#ffffff" opacity="0.6" />
      {/* Eyelash accents */}
      <path d="M20,18 L15,8 M35,10 L32,2 M65,10 L68,2 M80,18 L85,8"
        stroke={glowing ? '#00d4ff' : '#4a6a8a'}
        strokeWidth="2"
        strokeLinecap="round"
        filter={glowing ? 'url(#sheikahGlow)' : undefined}
      />
    </svg>
  )
}

// Korok Leaf decoration - forest spirit element
function KorokLeaf({ size = 30, rotation = 0 }: { size?: number; rotation?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 30 36"
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label="Korok leaf decoration"
      role="img"
    >
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90d860" />
          <stop offset="50%" stopColor="#60b830" />
          <stop offset="100%" stopColor="#408820" />
        </linearGradient>
      </defs>
      {/* Leaf shape */}
      <path
        d="M15,2 Q25,10 23,22 Q20,32 15,35 Q10,32 7,22 Q5,10 15,2"
        fill="url(#leafGrad)"
        stroke="#306018"
        strokeWidth="1"
      />
      {/* Central vein */}
      <path d="M15,5 L15,32" stroke="#408820" strokeWidth="1.5" opacity="0.7" />
      {/* Side veins */}
      <path d="M15,10 L20,14 M15,16 L21,19 M15,22 L19,26" stroke="#408820" strokeWidth="0.8" opacity="0.5" />
      <path d="M15,10 L10,14 M15,16 L9,19 M15,22 L11,26" stroke="#408820" strokeWidth="0.8" opacity="0.5" />
    </svg>
  )
}

// Heart Container - BotW style with cel-shaded look
function HeartContainer({ filled = true, size = 24 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.9}
      viewBox="0 0 24 22"
      aria-label={filled ? "Full heart container" : "Empty heart container"}
      role="img"
    >
      <defs>
        <linearGradient id="heartFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff5555" />
          <stop offset="40%" stopColor="#ff2222" />
          <stop offset="100%" stopColor="#cc0000" />
        </linearGradient>
        <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 21 C6 15 0 10 0 5.5 C0 2.5 2.5 0 5.5 0 C7.5 0 10 1.5 12 4 C14 1.5 16.5 0 18.5 0 C21.5 0 24 2.5 24 5.5 C24 10 18 15 12 21Z"
        fill={filled ? 'url(#heartFill)' : '#2a3a4a'}
        stroke={filled ? '#ff8888' : '#1a2a3a'}
        strokeWidth="1"
        filter={filled ? 'url(#heartGlow)' : undefined}
      />
      {filled && (
        <path
          d="M6 5 Q8 4 9 5.5"
          fill="none"
          stroke="#ffaaaa"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      )}
    </svg>
  )
}

// Heart Containers display - BotW stamina/health style
function HeartContainers({ filled = 3, max = 5 }: { filled?: number; max?: number }) {
  return (
    <div className="flex gap-1 items-center" role="img" aria-label={`${filled} of ${max} hearts filled`}>
      {Array.from({ length: max }).map((_, i) => (
        <HeartContainer key={i} filled={i < filled} size={20} />
      ))}
    </div>
  )
}

// Stamina Wheel segment - BotW climbing/swimming stamina
function StaminaWheel({ segments = 3, maxSegments = 5, size = 60 }: { segments?: number; maxSegments?: number; size?: number }) {
  const segmentAngle = 360 / maxSegments
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      aria-label={`Stamina wheel: ${segments} of ${maxSegments} segments`}
      role="img"
    >
      <defs>
        <linearGradient id="staminaFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#40e8a0" />
          <stop offset="100%" stopColor="#20c880" />
        </linearGradient>
        <filter id="staminaGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="30" cy="30" r="28" fill="none" stroke="#1a3a2a" strokeWidth="4" />
      {Array.from({ length: maxSegments }).map((_, i) => {
        const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
        const endAngle = ((i + 1) * segmentAngle - 90 - 5) * (Math.PI / 180)
        const x1 = 30 + 26 * Math.cos(startAngle)
        const y1 = 30 + 26 * Math.sin(startAngle)
        const x2 = 30 + 26 * Math.cos(endAngle)
        const y2 = 30 + 26 * Math.sin(endAngle)
        return (
          <path
            key={i}
            d={`M30,30 L${x1},${y1} A26,26 0 0,1 ${x2},${y2} Z`}
            fill={i < segments ? 'url(#staminaFill)' : '#1a3a2a'}
            stroke={i < segments ? '#60ffc0' : '#0a2a1a'}
            strokeWidth="1"
            filter={i < segments ? 'url(#staminaGlow)' : undefined}
            opacity={i < segments ? 1 : 0.5}
          />
        )
      })}
      <circle cx="30" cy="30" r="18" fill="#0a1a0a" stroke="#2a4a3a" strokeWidth="1" />
    </svg>
  )
}

// Shrine Tower - ancient tech waypoint
function ShrineTower({ size = 60, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size * 0.6}
      height={size}
      viewBox="0 0 36 60"
      aria-label={`Shrine tower ${active ? '(active)' : '(inactive)'}`}
      role="img"
    >
      <defs>
        <linearGradient id="towerBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4a3a2a" />
          <stop offset="50%" stopColor="#6a5a4a" />
          <stop offset="100%" stopColor="#4a3a2a" />
        </linearGradient>
        <filter id="shrineGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Base platform */}
      <rect x="4" y="50" width="28" height="8" rx="2" fill="#3a2a1a" stroke="#2a1a0a" strokeWidth="1" />
      {/* Tower body */}
      <path d="M10,50 L8,25 L14,10 L18,5 L22,10 L28,25 L26,50 Z" fill="url(#towerBody)" stroke="#2a1a0a" strokeWidth="1" />
      {/* Ancient patterns */}
      <path d="M14,45 L14,30 M22,45 L22,30" stroke={active ? '#ff8844' : '#5a4a3a'} strokeWidth="2" />
      <circle cx="18" cy="22" r="4" fill={active ? '#ff8844' : '#3a2a1a'} stroke={active ? '#ffaa66' : '#2a1a0a'} strokeWidth="1" filter={active ? 'url(#shrineGlow)' : undefined} />
      {/* Top beacon */}
      {active && (
        <>
          <circle cx="18" cy="5" r="4" fill="#ff8844" filter="url(#shrineGlow)" />
          <path d="M18,0 L18,-15" stroke="#ff8844" strokeWidth="2" opacity="0.6" filter="url(#shrineGlow)" />
        </>
      )}
      {/* Sheikah patterns on tower */}
      <path d="M15,35 L18,30 L21,35" stroke={active ? '#ff8844' : '#4a3a2a'} strokeWidth="1" fill="none" />
      <circle cx="18" cy="40" r="2" fill={active ? '#ff8844' : '#3a2a1a'} />
    </svg>
  )
}

// Rupee - Zelda currency with cel-shaded look
function Rupee({ color = 'green', size = 20 }: { color?: 'green' | 'blue' | 'red' | 'gold' | 'silver'; size?: number }) {
  const colors = {
    green: { fill: '#40d040', highlight: '#80ff80', shadow: '#208020', value: '1' },
    blue: { fill: '#4080ff', highlight: '#80c0ff', shadow: '#2040aa', value: '5' },
    red: { fill: '#ff4040', highlight: '#ff8080', shadow: '#aa2020', value: '20' },
    gold: { fill: '#f8d030', highlight: '#ffe878', shadow: '#c8a020', value: '300' },
    silver: { fill: '#c0c0c0', highlight: '#ffffff', shadow: '#808080', value: '100' },
  }
  const c = colors[color]

  return (
    <svg
      width={size * 0.6}
      height={size}
      viewBox="0 0 12 20"
      aria-label={`${color} rupee worth ${c.value}`}
      role="img"
    >
      <defs>
        <linearGradient id={`rupee-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="50%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.shadow} />
        </linearGradient>
      </defs>
      {/* Gem shape */}
      <polygon points="6,0 12,5 12,15 6,20 0,15 0,5" fill={`url(#rupee-${color})`} stroke={c.shadow} strokeWidth="0.5" />
      {/* Facets */}
      <polygon points="6,0 12,5 6,10 0,5" fill={c.highlight} opacity="0.4" />
      <polygon points="6,10 12,15 6,20 0,15" fill={c.shadow} opacity="0.4" />
      {/* Central line */}
      <line x1="6" y1="0" x2="6" y2="20" stroke={c.highlight} strokeWidth="0.8" opacity="0.3" />
    </svg>
  )
}

// === SECTION CARD TEXTURE PATTERNS (Hyrule-themed) ===

// Sheikah Slate Tech Pattern - circuit-like patterns with cyan glow
function SheikahSlateTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="sheikahCircuits" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="transparent" />
          {/* Circuit lines */}
          <path d="M0,30 L15,30 L20,25 L30,25" stroke="#00d4ff" strokeWidth="0.5" fill="none" opacity="0.15" />
          <path d="M30,25 L30,10 L40,10" stroke="#00d4ff" strokeWidth="0.5" fill="none" opacity="0.15" />
          <path d="M45,30 L60,30" stroke="#00d4ff" strokeWidth="0.5" fill="none" opacity="0.15" />
          <path d="M30,35 L30,50 L20,50" stroke="#00d4ff" strokeWidth="0.5" fill="none" opacity="0.15" />
          {/* Sheikah eye mini */}
          <circle cx="30" cy="30" r="4" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" />
          <circle cx="30" cy="30" r="1.5" fill="#00d4ff" opacity="0.15" />
          {/* Connection nodes */}
          <circle cx="15" cy="30" r="1" fill="#00d4ff" opacity="0.2" />
          <circle cx="45" cy="30" r="1" fill="#00d4ff" opacity="0.2" />
          <circle cx="30" cy="10" r="1" fill="#00d4ff" opacity="0.2" />
          <circle cx="30" cy="50" r="1" fill="#00d4ff" opacity="0.2" />
        </pattern>
        <linearGradient id="sheikahFade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.03" />
          <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sheikahFade)" />
      <rect width="100%" height="100%" fill="url(#sheikahCircuits)" />
    </svg>
  )
}

// Ancient Stone Shrine Texture - weathered stone with cracks
function ShrineStoneTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="stoneTexture" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="transparent" />
          {/* Stone block outlines */}
          <rect x="2" y="2" width="36" height="24" fill="none" stroke="#5a4a3a" strokeWidth="0.5" opacity="0.15" rx="1" />
          <rect x="42" y="2" width="36" height="24" fill="none" stroke="#5a4a3a" strokeWidth="0.5" opacity="0.15" rx="1" />
          <rect x="2" y="30" width="28" height="22" fill="none" stroke="#5a4a3a" strokeWidth="0.5" opacity="0.15" rx="1" />
          <rect x="34" y="30" width="44" height="22" fill="none" stroke="#5a4a3a" strokeWidth="0.5" opacity="0.15" rx="1" />
          <rect x="2" y="56" width="46" height="22" fill="none" stroke="#5a4a3a" strokeWidth="0.5" opacity="0.15" rx="1" />
          <rect x="52" y="56" width="26" height="22" fill="none" stroke="#5a4a3a" strokeWidth="0.5" opacity="0.15" rx="1" />
          {/* Cracks */}
          <path d="M25,8 L28,15 L24,20" stroke="#3a2a1a" strokeWidth="0.3" fill="none" opacity="0.2" />
          <path d="M60,35 L58,42 L62,48" stroke="#3a2a1a" strokeWidth="0.3" fill="none" opacity="0.2" />
          {/* Ancient rune marks */}
          <path d="M15,40 L15,48 L12,45" stroke="#ff8844" strokeWidth="0.5" fill="none" opacity="0.1" />
          <circle cx="70" cy="14" r="3" fill="none" stroke="#ff8844" strokeWidth="0.5" opacity="0.1" />
        </pattern>
        <linearGradient id="stoneFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b7355" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#6a5a4a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5a4a3a" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#stoneFade)" />
      <rect width="100%" height="100%" fill="url(#stoneTexture)" />
    </svg>
  )
}

// Grass/Nature Watercolor Wash - soft green gradients with organic shapes
function GrassWatercolorTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="grassTexture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="transparent" />
          {/* Grass blades */}
          <path d="M10,100 Q12,85 8,70" stroke="#60b830" strokeWidth="1" fill="none" opacity="0.08" />
          <path d="M15,100 Q18,80 14,65" stroke="#40a060" strokeWidth="1" fill="none" opacity="0.08" />
          <path d="M45,100 Q48,82 43,68" stroke="#60b830" strokeWidth="1" fill="none" opacity="0.08" />
          <path d="M50,100 Q53,78 48,62" stroke="#78c850" strokeWidth="1" fill="none" opacity="0.08" />
          <path d="M80,100 Q83,85 78,72" stroke="#40a060" strokeWidth="1" fill="none" opacity="0.08" />
          <path d="M85,100 Q88,80 82,65" stroke="#60b830" strokeWidth="1" fill="none" opacity="0.08" />
          {/* Flower dots */}
          <circle cx="25" cy="88" r="2" fill="#ffaa55" opacity="0.1" />
          <circle cx="68" cy="92" r="1.5" fill="#ff8888" opacity="0.1" />
          {/* Leaf shapes */}
          <ellipse cx="35" cy="75" rx="4" ry="8" fill="#60b830" opacity="0.05" transform="rotate(-15 35 75)" />
          <ellipse cx="90" cy="80" rx="3" ry="6" fill="#78c850" opacity="0.05" transform="rotate(10 90 80)" />
        </pattern>
        <linearGradient id="grassFade" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#60b830" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#40a060" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#78c850" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grassFade)" />
      <rect width="100%" height="100%" fill="url(#grassTexture)" />
    </svg>
  )
}

// Korok Leaf Paper Texture - natural paper with leaf veins
function KorokPaperTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="korokPaper" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="transparent" />
          {/* Large leaf veins */}
          <path d="M0,60 Q30,50 60,60 Q90,70 120,60" stroke="#90d860" strokeWidth="0.8" fill="none" opacity="0.06" />
          <path d="M60,0 Q50,30 60,60 Q70,90 60,120" stroke="#60b830" strokeWidth="0.8" fill="none" opacity="0.06" />
          {/* Secondary veins */}
          <path d="M30,30 Q45,40 60,30" stroke="#90d860" strokeWidth="0.4" fill="none" opacity="0.05" />
          <path d="M60,90 Q75,80 90,90" stroke="#60b830" strokeWidth="0.4" fill="none" opacity="0.05" />
          <path d="M90,30 Q80,45 90,60" stroke="#78c850" strokeWidth="0.4" fill="none" opacity="0.05" />
          <path d="M30,60 Q40,75 30,90" stroke="#408820" strokeWidth="0.4" fill="none" opacity="0.05" />
          {/* Korok mask hints */}
          <ellipse cx="60" cy="60" rx="8" ry="10" fill="none" stroke="#408820" strokeWidth="0.3" opacity="0.04" />
          <circle cx="57" cy="57" r="1.5" fill="#408820" opacity="0.04" />
          <circle cx="63" cy="57" r="1.5" fill="#408820" opacity="0.04" />
          {/* Paper fibers */}
          <path d="M20,15 L25,18" stroke="#c8daa8" strokeWidth="0.3" opacity="0.1" />
          <path d="M85,95 L92,98" stroke="#c8daa8" strokeWidth="0.3" opacity="0.1" />
          <path d="M15,80 L20,82" stroke="#c8daa8" strokeWidth="0.3" opacity="0.1" />
        </pattern>
        <linearGradient id="korokFade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8f0b0" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#c8e0a0" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#b8d890" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#korokFade)" />
      <rect width="100%" height="100%" fill="url(#korokPaper)" />
    </svg>
  )
}

// === CONTINUOUS CSS-ANIMATED PARTICLES (z-[3-4], pointer-events-none) ===

// Sparkle particles - magical Korok/fairy style
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
    const newSparkles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 2,
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute sparkle-particle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, #ffffff, #ffe888 40%, #40e8a0 70%, transparent 80%)',
            borderRadius: '50%',
            boxShadow: '0 0 10px #ffe888, 0 0 20px #40e8a0',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// Korok leaf particles - floating leaves
function LeafParticles() {
  const [leaves, setLeaves] = useState<Array<{
    id: number
    x: number
    y: number
    rotation: number
    delay: number
    duration: number
    size: number
  }>>([])

  useEffect(() => {
    const newLeaves = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 80 + Math.random() * 20,
      rotation: Math.random() * 360,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 5,
      size: 15 + Math.random() * 10,
    }))
    setLeaves(newLeaves)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {leaves.map((l) => (
        <div
          key={l.id}
          className="absolute leaf-particle"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
          }}
        >
          <KorokLeaf size={l.size} rotation={l.rotation} />
        </div>
      ))}
    </div>
  )
}

// Floating clouds - painterly cel-shaded style
function FloatingClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute cloud-float"
          style={{
            top: `${5 + i * 10}%`,
            left: '-150px',
            animationDelay: `${i * 5}s`,
            animationDuration: `${30 + i * 8}s`,
          }}
        >
          <svg width="150" height="70" viewBox="0 0 150 70" opacity="0.85">
            <defs>
              <linearGradient id={`cloud${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e8f4ff" />
              </linearGradient>
            </defs>
            {/* Cel-shaded cloud with hard edges */}
            <ellipse cx="75" cy="50" rx="60" ry="20" fill={`url(#cloud${i})`} stroke="#d0e0f0" strokeWidth="1" />
            <ellipse cx="45" cy="40" rx="35" ry="22" fill={`url(#cloud${i})`} stroke="#d0e0f0" strokeWidth="1" />
            <ellipse cx="100" cy="42" rx="40" ry="20" fill={`url(#cloud${i})`} stroke="#d0e0f0" strokeWidth="1" />
            <ellipse cx="70" cy="32" rx="30" ry="18" fill={`url(#cloud${i})`} stroke="#d0e0f0" strokeWidth="1" />
            <ellipse cx="55" cy="28" rx="25" ry="15" fill="#ffffff" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Guardian laser particles - Sheikah tech aesthetic
function GuardianParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    startY: number
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + (i * 12),
      startY: 100,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 3,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute guardian-particle"
          style={{
            left: `${p.x}%`,
            bottom: '0',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <div
            className="w-1 h-20 rounded-full"
            style={{
              background: 'linear-gradient(to top, #ff8844, #ffaa66 50%, transparent)',
              boxShadow: '0 0 8px #ff8844, 0 0 16px #ff6622',
            }}
          />
        </div>
      ))}
    </div>
  )
}

// === LINK-STYLE ADVENTURER CHARACTER (Hyrule hero) ===

function HyruleHero({
  pose = 'running',
  direction = 'right',
  isPanicked = false,
}: {
  pose?: 'running' | 'idle' | 'gliding'
  direction?: 'left' | 'right'
  isPanicked?: boolean
}) {
  const flipStyle = direction === 'left' ? { transform: 'scaleX(-1)' } : {}

  return (
    <svg
      width="52"
      height="68"
      viewBox="0 0 52 68"
      style={flipStyle}
      aria-label={`Hero character ${pose}`}
      role="img"
    >
      {/* Champion's tunic - blue */}
      <defs>
        <linearGradient id="tunicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4080c0" />
          <stop offset="50%" stopColor="#3070b0" />
          <stop offset="100%" stopColor="#2060a0" />
        </linearGradient>
      </defs>

      {/* Hair - golden blonde */}
      <path
        d="M20,8 Q15,5 18,2 Q22,0 28,0 Q34,0 38,3 Q40,6 38,10 L35,14 L22,14 L20,8"
        fill="#e8c840"
        stroke="#c8a830"
        strokeWidth="1"
      />
      {/* Hair strands */}
      <path d="M22,4 Q20,2 21,0 M30,3 Q32,1 30,0 M36,6 Q38,4 36,2" stroke="#d8b838" strokeWidth="1" fill="none" />

      {/* Face - cel-shaded skin */}
      <ellipse cx="28" cy="16" rx="10" ry="11" fill="#f0d8b8" stroke="#d8c0a0" strokeWidth="1" />

      {/* Eyes - large anime style */}
      {isPanicked ? (
        <>
          <ellipse cx="24" cy="15" rx="3" ry="4" fill="#ffffff" stroke="#333" strokeWidth="0.5" />
          <ellipse cx="32" cy="15" rx="3" ry="4" fill="#ffffff" stroke="#333" strokeWidth="0.5" />
          <circle cx="24" cy="16" r="1.5" fill="#3388cc" />
          <circle cx="32" cy="16" r="1.5" fill="#3388cc" />
        </>
      ) : (
        <>
          <ellipse cx="24" cy="15" rx="2.5" ry="3" fill="#ffffff" stroke="#333" strokeWidth="0.5" />
          <ellipse cx="32" cy="15" rx="2.5" ry="3" fill="#ffffff" stroke="#333" strokeWidth="0.5" />
          <circle cx="24" cy="15" r="1.5" fill="#3388cc" />
          <circle cx="32" cy="15" r="1.5" fill="#3388cc" />
          <circle cx="23" cy="14" r="0.5" fill="#ffffff" />
          <circle cx="31" cy="14" r="0.5" fill="#ffffff" />
        </>
      )}

      {/* Eyebrows */}
      <path d={isPanicked ? "M21,11 L27,13 M29,13 L35,11" : "M22,12 L26,11 M30,11 L34,12"} stroke="#c8a830" strokeWidth="1.5" fill="none" />

      {/* Nose and mouth */}
      <path d="M28,17 L27,19" stroke="#d8b898" strokeWidth="1" fill="none" />
      <path d={isPanicked ? "M25,22 Q28,20 31,22" : "M25,21 Q28,23 31,21"} stroke="#c8a888" strokeWidth="1" fill="none" />

      {/* Pointed ears - Hylian */}
      <path d="M17,14 Q12,10 10,16 Q14,18 18,16" fill="#f0d8b8" stroke="#d8c0a0" strokeWidth="0.5" />
      <path d="M39,14 Q44,10 46,16 Q42,18 38,16" fill="#f0d8b8" stroke="#d8c0a0" strokeWidth="0.5" />
      {/* Earrings */}
      <circle cx="11" cy="17" r="1.5" fill="#40a0e0" stroke="#2080c0" strokeWidth="0.5" />

      {/* Tunic body */}
      <path
        d="M20,26 L36,26 L38,48 L28,52 L18,48 Z"
        fill="url(#tunicGrad)"
        stroke="#2060a0"
        strokeWidth="1"
      />
      {/* Tunic detail - diagonal pattern */}
      <path d="M22,32 L28,38 M28,32 L34,38" stroke="#5090c8" strokeWidth="1" opacity="0.5" />

      {/* Belt */}
      <rect x="19" y="44" width="18" height="4" rx="1" fill="#5a4030" stroke="#3a2010" strokeWidth="0.5" />
      <rect x="26" y="43" width="4" height="6" rx="1" fill="#f8d030" stroke="#d8b020" strokeWidth="0.5" />

      {/* Sheikah Slate on hip */}
      <rect x="36" y="42" width="6" height="8" rx="1" fill="#2a3a4a" stroke="#1a2a3a" strokeWidth="0.5" />
      <rect x="37" y="43" width="4" height="5" fill="#00d4ff" opacity="0.6" />

      {/* Arms */}
      <path
        d={pose === 'gliding' ? "M18,30 L8,25 M38,30 L48,25" : "M18,30 L12,40 M38,30 L44,40"}
        stroke="#f0d8b8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Gloves */}
      <circle cx={pose === 'gliding' ? 8 : 12} cy={pose === 'gliding' ? 25 : 40} r="3" fill="#3a4a3a" stroke="#2a3a2a" strokeWidth="0.5" />
      <circle cx={pose === 'gliding' ? 48 : 44} cy={pose === 'gliding' ? 25 : 40} r="3" fill="#3a4a3a" stroke="#2a3a2a" strokeWidth="0.5" />

      {/* Master Sword on back (when not attacking) */}
      <path d="M14,28 L10,50" stroke="#c0d0e0" strokeWidth="2" />
      <rect x="8" y="50" width="4" height="8" rx="1" fill="#5a4030" />
      <ellipse cx="10" cy="28" rx="2" ry="3" fill="#4080c0" stroke="#2060a0" strokeWidth="0.5" />

      {/* Hylian Shield on back */}
      <ellipse cx="16" cy="38" rx="5" ry="7" fill="#3050a0" stroke="#2040 80" strokeWidth="1" opacity="0.8" />
      <path d="M16,33 L16,43 M13,38 L19,38" stroke="#f8d030" strokeWidth="1" opacity="0.8" />

      {/* Legs */}
      <path
        d={pose === 'running' ? "M22,48 L18,58 L16,66 M34,48 L36,56 L38,66" : "M22,48 L20,58 L20,66 M34,48 L36,58 L36,66"}
        stroke="#4a5a4a"
        strokeWidth="4"
        strokeLinecap="round"
        className={pose === 'running' ? 'hero-legs' : ''}
      />

      {/* Boots */}
      <ellipse cx="16" cy="65" rx="4" ry="2" fill="#4a3020" stroke="#3a2010" strokeWidth="0.5" />
      <ellipse cx="38" cy="65" rx="4" ry="2" fill="#4a3020" stroke="#3a2010" strokeWidth="0.5" />

      {/* Paraglider (when gliding) */}
      {pose === 'gliding' && (
        <path
          d="M8,15 Q28,-5 48,15 L45,20 Q28,5 11,20 Z"
          fill="#ff6644"
          stroke="#cc4422"
          strokeWidth="1"
          opacity="0.9"
        />
      )}
    </svg>
  )
}

// Cucco (Zelda chicken) - angry flock style
function Cucco({ isAngry = false, size = 32 }: { isAngry?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-label={`Cucco ${isAngry ? '(angry)' : ''}`}
      role="img"
    >
      {/* Body */}
      <ellipse cx="16" cy="20" rx="10" ry="8" fill={isAngry ? '#fff8f0' : '#ffffff'} stroke="#e8e0d8" strokeWidth="1" />
      {/* Wing */}
      <ellipse cx="10" cy="20" rx="4" ry="5" fill="#f8f0e8" stroke="#e0d8d0" strokeWidth="0.5" />
      {/* Head */}
      <circle cx="22" cy="12" r="6" fill={isAngry ? '#fff8f0' : '#ffffff'} stroke="#e8e0d8" strokeWidth="1" />
      {/* Comb */}
      <path
        d="M20,6 Q22,3 24,6 Q26,3 28,6 Q26,8 24,8 Q22,8 20,6"
        fill={isAngry ? '#ff4444' : '#cc4444'}
      />
      {/* Beak */}
      <path d="M26,12 L32,12 L28,15 Z" fill="#ffaa44" stroke="#cc8822" strokeWidth="0.5" />
      {/* Eye */}
      {isAngry ? (
        <>
          <circle cx="22" cy="11" r="3" fill="#ffffff" stroke="#ff0000" strokeWidth="1.5" />
          <circle cx="22" cy="11" r="1.5" fill="#ff0000" />
          <path d="M19,8 L25,10" stroke="#444" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="22" cy="11" r="2" fill="#222" />
          <circle cx="21.5" cy="10.5" r="0.6" fill="#fff" />
        </>
      )}
      {/* Wattle */}
      <ellipse cx="26" cy="15" rx="2" ry="3" fill={isAngry ? '#ff5555' : '#cc5555'} />
      {/* Feet */}
      <path d="M12,28 L10,32 M14,28 L14,32 M16,28 L18,32" stroke="#ffaa44" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18,28 L16,32 M20,28 L20,32 M22,28 L24,32" stroke="#ffaa44" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tail feathers */}
      <path d="M6,18 Q2,14 4,10 M6,20 Q1,18 2,14 M6,22 Q0,22 1,18" stroke="#f0e8e0" strokeWidth="2" fill="none" />
      {/* Anger marks */}
      {isAngry && (
        <>
          <path d="M28,6 L30,4" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M30,8 L33,6" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M30,10 L33,10" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// Bokoblin enemy - common Zelda enemy
function Bokoblin({ isDead = false, size = 44 }: { isDead?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 44 53"
      className={isDead ? 'enemy-death' : ''}
      aria-label={`Bokoblin enemy ${isDead ? '(defeated)' : ''}`}
      role="img"
    >
      {isDead ? (
        <>
          {/* Death poof - purple smoke */}
          <circle cx="22" cy="26" r="4" fill="#8844aa" opacity="0.8" />
          <circle cx="22" cy="26" r="2" fill="#aa66cc" />
        </>
      ) : (
        <>
          {/* Body */}
          <ellipse cx="22" cy="32" rx="12" ry="10" fill="#d86040" stroke="#a84830" strokeWidth="1.5" />
          {/* Belly */}
          <ellipse cx="22" cy="34" rx="8" ry="6" fill="#e88060" />
          {/* Head */}
          <ellipse cx="22" cy="16" rx="11" ry="10" fill="#d86040" stroke="#a84830" strokeWidth="1.5" />
          {/* Snout */}
          <ellipse cx="22" cy="20" rx="6" ry="4" fill="#e07050" />
          {/* Nostrils */}
          <circle cx="19" cy="20" r="1.5" fill="#883820" />
          <circle cx="25" cy="20" r="1.5" fill="#883820" />
          {/* Eyes - menacing */}
          <circle cx="16" cy="13" r="3.5" fill="#ffffcc" stroke="#444" strokeWidth="0.5" />
          <circle cx="28" cy="13" r="3.5" fill="#ffffcc" stroke="#444" strokeWidth="0.5" />
          <circle cx="16" cy="13" r="2" fill="#880000" />
          <circle cx="28" cy="13" r="2" fill="#880000" />
          <circle cx="15" cy="12" r="0.8" fill="#ffffff" />
          <circle cx="27" cy="12" r="0.8" fill="#ffffff" />
          {/* Ears - pointed */}
          <ellipse cx="9" cy="10" rx="4" ry="6" fill="#d86040" stroke="#a84830" strokeWidth="1" transform="rotate(-15 9 10)" />
          <ellipse cx="35" cy="10" rx="4" ry="6" fill="#d86040" stroke="#a84830" strokeWidth="1" transform="rotate(15 35 10)" />
          {/* Horn */}
          <path d="M22,6 L24,0 L20,0 Z" fill="#c8b8a0" stroke="#a8987" strokeWidth="0.5" />
          {/* Arms */}
          <path d="M10,30 L4,38" stroke="#d86040" strokeWidth="4" strokeLinecap="round" />
          <path d="M34,30 L40,38" stroke="#d86040" strokeWidth="4" strokeLinecap="round" />
          {/* Weapon - club */}
          <path d="M38,36 L48,30 L52,34 L46,42 Z" fill="#6a5040" stroke="#4a3020" strokeWidth="1" />
          {/* Legs */}
          <path d="M16,40 L14,52" stroke="#d86040" strokeWidth="4" strokeLinecap="round" />
          <path d="M28,40 L30,52" stroke="#d86040" strokeWidth="4" strokeLinecap="round" />
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

  const [cuccoRevenge, setCuccoRevenge] = useState(false)
  const [enemies, setEnemies] = useState<Array<{ id: number; x: number; visible: boolean; defeated: boolean }>>([])

  const cuccoTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
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

  // Fast scroll detection for cucco revenge (one-time per session)
  useEffect(() => {
    if (!mounted) return

    let lastY = 0
    let lastTime = Date.now()

    const handleScroll = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      const deltaY = Math.abs(window.scrollY - lastY)
      const speed = deltaTime > 0 ? deltaY / deltaTime : 0

      if (speed > 4 && !cuccoRevenge) {
        setCuccoRevenge(true)
        clearTimeout(cuccoTimeout.current)
        cuccoTimeout.current = setTimeout(() => setCuccoRevenge(false), 5000)
      }

      lastY = window.scrollY
      lastTime = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(cuccoTimeout.current)
    }
  }, [mounted, cuccoRevenge])

  // Defeat enemies when hero passes them
  useEffect(() => {
    const heroX = 15 + (scrollProgress * 50)
    setEnemies(prev => prev.map(enemy => {
      if (enemy.visible && !enemy.defeated && Math.abs(enemy.x - heroX) < 15) {
        return { ...enemy, defeated: true }
      }
      return enemy
    }))
  }, [scrollProgress])

  if (!mounted) return null

  // Hero position based on smooth scroll
  const heroX = 15 + (scrollProgress * 50)
  const pose = isScrollingDown && scrollProgress > 0.01 ? 'running' : 'idle'

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {/* Hero - CSS transition for smooth movement */}
      <div
        className="absolute bottom-20 hero-smooth"
        style={{
          left: `${heroX}%`,
          transform: `translateX(-50%) ${cuccoRevenge ? 'translateX(-15px)' : ''}`,
        }}
      >
        <HyruleHero
          pose={cuccoRevenge ? 'running' : pose}
          direction={isScrollingDown ? 'right' : 'left'}
          isPanicked={cuccoRevenge}
        />
      </div>

      {/* Direction indicator - Sheikah waypoint style */}
      {!cuccoRevenge && scrollProgress < 0.9 && (
        <div
          className="absolute direction-indicator"
          style={{
            left: `calc(${heroX}% + 55px)`,
            bottom: '165px',
            opacity: pose === 'idle' ? 0.8 : 0.3,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" className="bounce-arrow">
            <defs>
              <filter id="arrowGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M14,4 L22,16 L18,16 L18,24 L10,24 L10,16 L6,16 Z"
              fill="#00d4ff"
              stroke="#40e8ff"
              strokeWidth="1"
              filter="url(#arrowGlow)"
              transform="rotate(180 14 14)"
            />
          </svg>
        </div>
      )}

      {/* Angry cucco flock - triggered by fast scrolling */}
      {cuccoRevenge && (
        <div className="absolute bottom-16 right-0 flex gap-3 cucco-chase">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="cucco-bob"
              style={{
                animationDelay: `${i * 0.06}s`,
                transform: `translateY(${Math.sin(i * 1.5) * 12}px) rotate(${Math.sin(i) * 15}deg)`,
              }}
            >
              <Cucco isAngry size={26 + (i % 3) * 4} />
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
          <Bokoblin isDead={enemy.defeated} size={44} />
        </div>
      ))}

      {/* Warning indicator - Sheikah slate alert style */}
      {cuccoRevenge && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-sm font-bold bounce-warning flex items-center gap-3"
          style={{
            background: 'linear-gradient(180deg, #ff4422, #cc2200)',
            color: '#fff',
            border: '3px solid #ff6644',
            boxShadow: '0 0 30px rgba(255,68,34,0.7), inset 0 0 20px rgba(255,100,68,0.3)',
          }}
          role="alert"
        >
          <span className="text-lg">CUCCO ATTACK!</span>
          <span className="text-xs opacity-80">(you should not have done that...)</span>
        </div>
      )}
    </div>
  )
}

// === UI COMPONENTS ===

// Shrine waypoint marker
function ShrineMarker({ active = false }: { active?: boolean }) {
  return (
    <svg
      width="28"
      height="36"
      viewBox="0 0 28 36"
      aria-label={`Shrine marker ${active ? '(active)' : ''}`}
      role="img"
    >
      <defs>
        <filter id="markerGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M14,0 C20,0 28,7 28,14 C28,23 14,36 14,36 C14,36 0,23 0,14 C0,7 8,0 14,0"
        fill={active ? '#ff8844' : '#2a4a6a'}
        stroke={active ? '#ffaa66' : '#1a3a5a'}
        strokeWidth="2"
        filter={active ? 'url(#markerGlow)' : undefined}
      />
      <circle cx="14" cy="14" r="5" fill={active ? '#ffe888' : '#3a5a7a'} />
    </svg>
  )
}

// World map node - Sheikah Tower style
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
  const icons = {
    engineer: <ShrineTower size={50} active={isActive} />,
    drummer: <StaminaWheel segments={4} maxSegments={5} size={50} />,
    fighter: <MasterSword size={50} opacity={0.8} />
  }
  const labels = { engineer: 'HATENO TECH LAB', drummer: 'RITO VILLAGE', fighter: 'HYRULE CASTLE' }
  const colors = { engineer: '#00d4ff', drummer: '#40e8a0', fighter: '#ff8844' }

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
      aria-label={`Select ${labels[profession]} ${isActive ? '(currently selected)' : ''}`}
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-full blur-xl pulse-glow"
          style={{
            background: colors[profession],
            opacity: 0.4,
            transform: 'scale(2.5)',
          }}
          aria-hidden="true"
        />
      )}
      <div
        className="relative w-20 h-20 rounded-lg flex items-center justify-center"
        style={{
          background: isActive
            ? `linear-gradient(180deg, ${colors[profession]}40, #1a2a3a)`
            : 'linear-gradient(180deg, #2a3a4a, #1a2a3a)',
          border: `3px solid ${isActive ? colors[profession] : '#3a4a5a'}`,
          boxShadow: isActive
            ? `0 0 25px ${colors[profession]}, 0 4px 12px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.1)`
            : '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.05)',
        }}
      >
        {icons[profession]}
        {isActive && (
          <div className="absolute inset-0 rounded-lg border-2 border-white opacity-20 ping-slow" aria-hidden="true" />
        )}
      </div>
      <div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider"
        style={{
          background: isActive ? 'linear-gradient(180deg, #2a3a4a, #1a2a3a)' : 'rgba(26,42,58,0.95)',
          color: isActive ? colors[profession] : '#8a9aaa',
          border: `2px solid ${isActive ? colors[profession] : '#3a4a5a'}`,
          boxShadow: isActive ? `0 0 15px ${colors[profession]}40` : '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        {labels[profession]}
      </div>
    </button>
  )
}

// Sheikah Frame - ancient tech border with texture
function SheikahFrame({ children, title, icon, textureType = 'sheikah' }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
  textureType?: 'sheikah' | 'stone' | 'grass' | 'korok'
}) {
  const TextureComponent = {
    sheikah: SheikahSlateTexture,
    stone: ShrineStoneTexture,
    grass: GrassWatercolorTexture,
    korok: KorokPaperTexture,
  }[textureType]

  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner decorations - Sheikah patterns */}
      <div className="absolute -top-3 -left-3" aria-hidden="true">
        <SheikahEye size={30} glowing />
      </div>
      <div className="absolute -top-3 -right-3" style={{ transform: 'scaleX(-1)' }} aria-hidden="true">
        <SheikahEye size={30} glowing />
      </div>
      <div className="absolute -bottom-3 -left-3" style={{ transform: 'scaleY(-1)' }} aria-hidden="true">
        <Triforce size={25} />
      </div>
      <div className="absolute -bottom-3 -right-3" style={{ transform: 'scale(-1)' }} aria-hidden="true">
        <Triforce size={25} />
      </div>

      {/* Header bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff80, #00d4ff)' }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: 'linear-gradient(180deg, #2a3a4a, #1a2a3a)',
            border: '2px solid #00d4ff60',
            borderRadius: '8px',
            boxShadow: '0 0 20px #00d4ff30, inset 0 1px 3px rgba(255,255,255,0.1)'
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.2em] uppercase font-bold" style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ff80' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, #00d4ff, #00d4ff80, transparent)' }} aria-hidden="true" />
      </div>

      {/* Content area with texture */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(26,42,58,0.98), rgba(18,30,42,0.98))',
          border: '2px solid #00d4ff40',
          borderRadius: '12px',
          boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3), 0 0 40px #00d4ff10',
        }}
      >
        {/* Texture layer */}
        <TextureComponent />

        <div
          className="absolute inset-3 pointer-events-none rounded-lg"
          style={{
            border: '1px solid #00d4ff20',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// Tech Stack treasure - Sheikah Compendium style
function TechCompendium({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 7).map((category, catIdx) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: '#40e8ff' }}>
            <Rupee color={['green', 'blue', 'red', 'gold', 'silver', 'green', 'blue'][catIdx % 7] as 'green' | 'blue' | 'red' | 'gold' | 'silver'} size={18} />
            <span style={{ textShadow: '0 0 8px #00d4ff60' }}>{category.name.toUpperCase()}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: 'linear-gradient(180deg, rgba(42,58,74,0.95), rgba(26,42,58,0.95))',
                  border: '1px solid #00d4ff40',
                  color: '#c0e8ff',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.05)',
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

// Shrine Quest card
function ShrineQuestCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="relative p-4 cursor-pointer transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(180deg, rgba(42,58,74,0.98), rgba(26,42,58,0.98))',
        border: '2px solid #00d4ff50',
        borderRadius: '10px',
        boxShadow: '0 4px 0 #1a2a3a, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.05)',
      }}
      tabIndex={0}
      role="article"
      aria-label={`Project: ${project.name}`}
    >
      {/* Stone texture overlay */}
      <ShrineStoneTexture />

      <div className="relative z-10">
        <div className="absolute -top-3 -right-3" aria-hidden="true">
          <ShrineTower size={35} active />
        </div>
        {project.featured && (
          <div className="flex items-center gap-1 mb-2">
            <Triforce size={14} />
            <span className="text-[8px] tracking-wider" style={{ color: '#f8d030', textShadow: '0 0 8px #f8d03080' }}>LEGENDARY SHRINE</span>
          </div>
        )}
        <h3 className="text-sm font-bold mb-1" style={{ color: '#e0f0ff' }}>
          {project.name}
        </h3>
        <p className="text-[10px] mb-2" style={{ color: '#8ac0e0' }}>
          {project.tagline}
        </p>
        {project.impact && (
          <p className="text-[10px] mb-2 italic flex items-center gap-1" style={{ color: '#ff8844' }}>
            <Rupee color="gold" size={12} /> {project.impact}
          </p>
        )}
        <div className="flex gap-1 flex-wrap">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[8px] px-2 py-0.5 rounded"
              style={{
                background: 'rgba(0,212,255,0.15)',
                color: '#60c8e8',
                border: '1px solid #00d4ff30',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Tech Lab location card
function TechLabCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(42,58,74,0.98), rgba(26,42,58,0.98))',
        border: '2px solid #00d4ff40',
        borderRadius: '10px',
      }}
    >
      <SheikahSlateTexture />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <ShrineMarker active />
          <div>
            <h4 className="text-sm group-hover:text-cyan-300 transition-colors" style={{ color: '#e0f0ff' }}>
              {company.name}
            </h4>
            <p className="text-[10px]" style={{ color: '#ff8844' }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs" style={{ color: '#8ac0e0' }}>{company.description}</p>
      </div>
    </a>
  )
}

// Rito Village band card
function RitoVillageCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(58,74,58,0.98), rgba(42,58,42,0.98))',
        border: '2px solid #40e8a060',
        borderRadius: '10px',
      }}
    >
      <KorokPaperTexture />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <KorokLeaf size={20} />
          <h4 className="text-sm group-hover:text-green-300 transition-colors" style={{ color: '#c0ffc0' }}>
            {band.name}
          </h4>
        </div>
        <p className="text-[10px] mt-1" style={{ color: '#80e080' }}>{band.genre} | {band.role}</p>
        <p className="text-xs mt-2" style={{ color: '#a0d8a0' }}>{band.description}</p>
        {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: '#60a060' }}>Quest not yet discovered...</p>}
      </div>
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400">{content}</a>
  }
  return content
}

// Experience Quest Log entry
function QuestLogEntry({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4 transition-all hover:scale-[1.01] relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(42,58,74,0.98), rgba(26,42,58,0.98))',
        border: '2px solid #00d4ff30',
        borderRadius: '10px',
        boxShadow: '0 2px 0 #1a2a3a, 0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <ShrineStoneTexture />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-2">
            <Rupee color="gold" size={18} />
            <div>
              <h4 className="text-sm font-bold" style={{ color: '#e0f0ff' }}>{entry.title}</h4>
              <p className="text-xs" style={{ color: '#ff8844' }}>{entry.organization}</p>
            </div>
          </div>
          <span
            className="text-[10px] px-2 py-1 rounded"
            style={{
              background: 'rgba(0,212,255,0.15)',
              color: '#60c8e8',
              border: '1px solid #00d4ff30',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>
        <p className="text-xs mb-2" style={{ color: '#8ac0e0' }}>{entry.description}</p>
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-1 mt-2">
            {entry.highlights.map((highlight, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#c0e8ff' }}>
                <span style={{ color: '#00d4ff' }}>&#9830;</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// Skill display without bars - impact/achievement focused
function SkillDisplay({ category }: { category: ReturnType<typeof getSkillsByProfession>[0] }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: '#40e8ff' }}>
        <span>{category.icon}</span>
        <span style={{ textShadow: '0 0 8px #00d4ff60' }}>{category.name.toUpperCase()}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill.name}
            className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
            style={{
              background: 'linear-gradient(180deg, rgba(42,58,74,0.95), rgba(26,42,58,0.95))',
              border: '1px solid #00d4ff40',
              color: '#c0e8ff',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.05)',
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}

// Sheikah content overlay (z-[8])
function SheikahContentOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[8]"
      style={{
        background: 'linear-gradient(180deg, rgba(18, 30, 42, 0.12) 0%, rgba(26, 42, 58, 0.18) 50%, rgba(18, 30, 42, 0.15) 100%)',
      }}
      aria-hidden="true"
    />
  )
}

// Master Sword divider
function MasterSwordDivider() {
  return (
    <div className="flex justify-center items-center py-8 gap-6" aria-hidden="true">
      <Triforce size={30} />
      <MasterSword size={60} opacity={0.4} />
      <div className="flex gap-2">
        <Rupee color="green" size={18} />
        <Rupee color="blue" size={20} />
        <Rupee color="red" size={18} />
      </div>
      <MasterSword size={60} opacity={0.4} />
      <Triforce size={30} />
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
        // BotW-style gradient: sky blue to lush green
        background: 'linear-gradient(180deg, #70c8e0 0%, #98d8f0 15%, #60b830 25%, #40a060 50%, #2a6a3a 75%, #1a4a2a 100%)',
        fontFamily: '"Quicksand", "Segoe UI", sans-serif',
      }}
    >
      {/* Background layers - continuous CSS animations (z-[1-4], pointer-events-none) */}
      <FloatingClouds />
      <GuardianParticles />
      <SparkleParticles />
      <LeafParticles />

      {/* Simplified scroll adventure scene (z-[4]) */}
      <ScrollAdventureScene />

      {/* Sheikah content overlay (z-[8]) */}
      <SheikahContentOverlay />

      {/* Hyrule landscape hills (z-[2]) */}
      <div className="fixed bottom-0 left-0 right-0 h-[45%] pointer-events-none z-[2]" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#50a850" />
              <stop offset="100%" stopColor="#308030" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#408040" />
              <stop offset="100%" stopColor="#206020" />
            </linearGradient>
          </defs>
          {/* Rolling hills - BotW cel-shaded look */}
          <ellipse cx="200" cy="400" rx="400" ry="200" fill="url(#hillGrad1)" />
          <ellipse cx="650" cy="400" rx="500" ry="220" fill="url(#hillGrad2)" />
          <ellipse cx="1050" cy="400" rx="450" ry="190" fill="url(#hillGrad1)" />
          {/* Trees - simplified painterly */}
          <ellipse cx="100" cy="350" rx="35" ry="55" fill="#206020" />
          <ellipse cx="100" cy="340" rx="30" ry="45" fill="#308030" />
          <ellipse cx="320" cy="360" rx="45" ry="65" fill="#206020" />
          <ellipse cx="320" cy="348" rx="38" ry="52" fill="#308030" />
          <ellipse cx="850" cy="355" rx="40" ry="60" fill="#206020" />
          <ellipse cx="850" cy="343" rx="34" ry="48" fill="#308030" />
          <ellipse cx="1100" cy="362" rx="50" ry="70" fill="#206020" />
          <ellipse cx="1100" cy="348" rx="42" ry="55" fill="#308030" />
        </svg>
      </div>

      {/* Header (z-[30] - above overlay) - ALL CONTENT IMMEDIATELY VISIBLE */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Triforce size={36} />
              <h1
                className="text-3xl tracking-wider font-bold"
                style={{
                  color: '#f8d030',
                  textShadow: '3px 3px 0 #1a4a2a, -1px -1px 0 #1a4a2a, 1px -1px 0 #1a4a2a, -1px 1px 0 #1a4a2a, 0 0 30px #f8d03080'
                }}
              >
                ALEXANDER PULIDO
              </h1>
            </div>
            <p
              className="text-sm tracking-wide font-medium"
              style={{
                color: '#1a3a2a',
                textShadow: '0 0 12px rgba(255,255,255,0.9), 1px 1px 0 rgba(255,255,255,0.7)'
              }}
            >
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p
              className="text-xs tracking-wide mt-1 italic"
              style={{
                color: '#3a5a3a',
                textShadow: '0 0 10px rgba(255,255,255,0.8)'
              }}
            >
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-5">
              <HeartContainers filled={5} max={5} />
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, #2a3a4a, #1a2a3a)',
                  border: '2px solid #00d4ff50',
                  boxShadow: '0 0 15px #00d4ff30'
                }}
              >
                <Rupee color="gold" size={18} />
                <span className="text-sm font-bold" style={{ color: '#f8d030', textShadow: '0 0 8px #f8d03060' }}>99,999</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Link
                href="/cv"
                className="sheikah-button px-5 py-2.5 text-xs tracking-wider transition-all hover:scale-105 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                style={{
                  background: 'linear-gradient(180deg, #2a3a4a, #1a2a3a)',
                  border: '2px solid #00d4ff60',
                  color: '#c0e8ff',
                }}
              >
                <span className="flex items-center gap-2">
                  <SheikahEye size={18} glowing={false} />
                  COMPENDIUM
                </span>
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="sheikah-button px-5 py-2.5 text-xs tracking-wider transition-all hover:scale-105 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                style={{
                  background: 'linear-gradient(180deg, #f8d030, #e8b020)',
                  border: '2px solid #ffe888',
                  color: '#3a2a00',
                }}
              >
                <span className="flex items-center gap-2">
                  <Triforce size={16} color="#3a2a00" glowColor="#5a4a00" />
                  ADVENTURE
                </span>
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Current Roles - Champion abilities style (z-[20]) */}
      <section className="relative z-20 py-4 px-6" aria-label="Current Roles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role, idx) => (
              <div
                key={role.id}
                className="flex items-center gap-3 px-5 py-2.5 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, rgba(26,42,58,0.95), rgba(18,30,42,0.95))',
                  border: '2px solid #00d4ff40',
                  boxShadow: '0 0 20px #00d4ff20',
                }}
              >
                <ShrineMarker active={idx === 0} />
                <div>
                  <p className="text-xs tracking-wider" style={{ color: '#ff8844', textShadow: '0 0 8px #ff884460' }}>{role.title}</p>
                  <p className="text-sm font-medium" style={{ color: '#e0f0ff' }}>{role.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Map - Sheikah Tower style (z-[20]) */}
      <section className="relative z-20 h-[280px]" aria-label="Profession Selection">
        <div className="relative max-w-3xl mx-auto h-full">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} aria-hidden="true">
            <defs>
              <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#40e8ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.8" />
              </linearGradient>
              <filter id="pathBlur">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            {/* Glowing paths between towers */}
            <path
              d="M 150 100 Q 250 60 350 80"
              fill="none"
              stroke="url(#pathGlow)"
              strokeWidth="4"
              strokeDasharray="15 10"
              strokeLinecap="round"
              filter="url(#pathBlur)"
            />
            <path
              d="M 350 80 Q 450 100 550 120"
              fill="none"
              stroke="url(#pathGlow)"
              strokeWidth="4"
              strokeDasharray="15 10"
              strokeLinecap="round"
              filter="url(#pathBlur)"
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

      {/* Main content (z-[20]) - ALL CONTENT IMMEDIATELY VISIBLE */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* About panel - with grass texture */}
          <section className="mb-8">
            <SheikahFrame title="About" icon={<SheikahEye size={20} glowing />} textureType="grass">
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#c0e8ff' }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-xs px-4 py-1.5 rounded-lg flex items-center gap-2"
                    style={{
                      background: [
                        'rgba(255,136,68,0.2)',
                        'rgba(0,212,255,0.2)',
                        'rgba(64,232,160,0.2)',
                        'rgba(248,208,48,0.2)'
                      ][i % 4],
                      border: `1px solid ${['#ff8844', '#00d4ff', '#40e8a0', '#f8d030'][i % 4]}50`,
                      color: '#e0f0ff',
                    }}
                  >
                    <Rupee color={['red', 'blue', 'green', 'gold'][i % 4] as 'red' | 'blue' | 'green' | 'gold'} size={14} />
                    {fact}
                  </span>
                ))}
              </div>
            </SheikahFrame>
          </section>

          {/* Work Experience - with stone texture */}
          {experience.length > 0 && (
            <>
              <MasterSwordDivider />

              <section className="mb-8">
                <SheikahFrame title="Quest Log" icon={<Triforce size={18} />} textureType="stone">
                  <div className="space-y-4">
                    {experience.map((entry) => (
                      <QuestLogEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                </SheikahFrame>
              </section>
            </>
          )}

          <MasterSwordDivider />

          {/* Tech Stack / Skills - with sheikah texture */}
          <section className="mb-8">
            <SheikahFrame
              title={active === 'engineer' ? 'Sheikah Compendium' : 'Champion Abilities'}
              icon={active === 'engineer' ? <SheikahEye size={20} glowing /> : <StaminaWheel segments={3} maxSegments={4} size={24} />}
              textureType="sheikah"
            >
              {active === 'engineer' ? (
                <TechCompendium categories={engineerTech} />
              ) : (
                <div className="space-y-4">
                  {otherSkills.map((category) => (
                    <SkillDisplay key={category.name} category={category} />
                  ))}
                </div>
              )}
            </SheikahFrame>
          </section>

          <MasterSwordDivider />

          {/* Projects - with stone texture */}
          <section className="mb-8">
            <SheikahFrame title="Ancient Shrines" icon={<ShrineTower size={24} active />} textureType="stone">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <ShrineQuestCard key={project.id} project={project} />
                ))}
              </div>
            </SheikahFrame>
          </section>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <>
              <MasterSwordDivider />
              <section className="mb-8">
                <SheikahFrame title="Tech Labs" icon={<ShrineMarker active />} textureType="sheikah">
                  <div className="grid md:grid-cols-3 gap-4">
                    {COMPANIES.map((company) => (
                      <TechLabCard key={company.id} company={company} />
                    ))}
                  </div>
                </SheikahFrame>
              </section>
            </>
          )}

          {active === 'drummer' && (
            <>
              <MasterSwordDivider />
              <section className="mb-8">
                <SheikahFrame title="Rito Village" icon={<KorokLeaf size={24} />} textureType="korok">
                  <div className="grid md:grid-cols-3 gap-4">
                    {BANDS.map((band) => (
                      <RitoVillageCard key={band.id} band={band} />
                    ))}
                  </div>
                </SheikahFrame>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Footer (z-[20]) */}
      <footer className="relative z-20 py-10 text-center">
        <div
          className="inline-flex items-center justify-center gap-6 px-8 py-4 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(26,42,58,0.95), rgba(18,30,42,0.95))',
            border: '2px solid #00d4ff40',
            boxShadow: '0 0 30px #00d4ff20'
          }}
        >
          <MasterSword size={45} opacity={0.6} />
          <div className="flex items-center gap-3" style={{ color: '#8ac0e0' }}>
            <Triforce size={24} />
            <span className="text-sm tracking-[0.3em] font-medium">HERO OF HYRULE SINCE 2014</span>
            <Triforce size={24} />
          </div>
          <MasterSword size={45} opacity={0.6} />
        </div>
        <p
          className="text-xs mt-3 px-4 py-2 rounded-lg inline-block"
          style={{
            color: '#60a0c0',
            background: 'rgba(26,42,58,0.9)',
            border: '1px solid #00d4ff30'
          }}
        >
          SAVE FILE 01 | SHRINES COMPLETED: 120+ | KOROKS: 900/900
        </p>
      </footer>

      {/* CSS Animations - ALL NON-HIDING, DECORATIVE ONLY */}
      <style jsx global>{`
        /* === CONTINUOUS PARTICLE ANIMATIONS (decorative, never hides content) === */

        @keyframes sparkle-loop {
          0%, 100% { opacity: 0; transform: scale(0.5) translateY(0); }
          50% { opacity: 1; transform: scale(1.2) translateY(-20px); }
        }

        @keyframes leaf-loop {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-80px) translateX(30px) rotate(360deg); }
        }

        @keyframes cloud-loop {
          from { transform: translateX(-180px); }
          to { transform: translateX(calc(100vw + 180px)); }
        }

        @keyframes guardian-loop {
          0% { opacity: 0; transform: translateY(0) scaleY(0.5); }
          20% { opacity: 1; transform: translateY(-30px) scaleY(1); }
          100% { opacity: 0; transform: translateY(-150px) scaleY(1.5); }
        }

        .sparkle-particle {
          animation: sparkle-loop ease-in-out infinite;
        }

        .leaf-particle {
          animation: leaf-loop ease-out infinite;
        }

        .cloud-float {
          animation: cloud-loop linear infinite;
        }

        .guardian-particle {
          animation: guardian-loop ease-out infinite;
        }

        /* === SMOOTH SCROLL TRANSITIONS === */

        .hero-smooth {
          transition: left 0.3s ease-out, transform 0.3s ease-out;
        }

        .direction-indicator {
          transition: left 0.3s ease-out, opacity 0.3s ease-out;
        }

        .enemy-appear {
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        /* === HERO ANIMATIONS === */

        @keyframes hero-legs-run {
          0%, 100% { d: path("M22,48 L18,58 L16,66 M34,48 L36,56 L38,66"); }
          50% { d: path("M22,48 L26,56 L28,66 M34,48 L30,58 L28,66"); }
        }

        .hero-legs {
          animation: hero-legs-run 0.3s ease-in-out infinite;
        }

        /* === CUCCO CHASE (one-time trigger, decorative) === */

        @keyframes cucco-chase-run {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-180%); }
        }

        @keyframes cucco-bob-walk {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }

        .cucco-chase {
          animation: cucco-chase-run 4.5s linear forwards;
        }

        .cucco-bob {
          animation: cucco-bob-walk 0.25s ease-in-out infinite;
        }

        /* === ENEMY DEATH (decorative feedback) === */

        @keyframes enemy-death-poof {
          0% { opacity: 1; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.3); }
          100% { opacity: 0; transform: scale(0) rotate(180deg); }
        }

        .enemy-death {
          animation: enemy-death-poof 0.5s ease-out forwards;
        }

        /* === UI ANIMATIONS (decorative accents, no content hiding) === */

        @keyframes ping-slow-anim {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes pulse-glow-anim {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes bounce-anim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .ping-slow {
          animation: ping-slow-anim 1.8s ease-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow-anim 2.5s ease-in-out infinite;
        }

        .bounce-arrow {
          animation: bounce-anim 1.2s ease-in-out infinite;
        }

        .bounce-warning {
          animation: bounce-anim 0.4s ease-in-out infinite;
        }

        /* ========================================
           SHEIKAH BUTTON - Ancient Tech Glow
           ======================================== */
        .sheikah-button {
          position: relative;
          overflow: hidden;
        }
        .sheikah-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 50%);
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .sheikah-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent 25%,
            rgba(0, 212, 255, 0.2) 40%,
            rgba(0, 212, 255, 0.4) 50%,
            rgba(0, 212, 255, 0.2) 60%,
            transparent 75%
          );
          background-size: 200% 200%;
          background-position: 100% 100%;
          transition: background-position 0.5s ease;
          pointer-events: none;
        }
        .sheikah-button:hover::before {
          opacity: 1;
          transform: scale(1);
          animation: sheikah-burst 0.5s ease-out;
        }
        .sheikah-button:hover::after {
          background-position: 0% 0%;
        }
        @keyframes sheikah-burst {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }

        /* ===== REDUCED MOTION SUPPORT ===== */
        @media (prefers-reduced-motion: reduce) {
          .sparkle-particle,
          .leaf-particle,
          .cloud-float,
          .guardian-particle,
          .hero-legs,
          .cucco-chase,
          .cucco-bob,
          .enemy-death,
          .ping-slow,
          .pulse-glow,
          .bounce-arrow,
          .bounce-warning,
          .hero-smooth,
          .direction-indicator,
          .enemy-appear,
          .sheikah-button::before,
          .sheikah-button::after {
            animation: none !important;
            transition: none !important;
          }
          .hero-smooth,
          .enemy-appear {
            opacity: 1;
          }
          /* Hide decorative particles entirely for reduced motion */
          .sparkle-particle,
          .leaf-particle,
          .cloud-float,
          .guardian-particle {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
