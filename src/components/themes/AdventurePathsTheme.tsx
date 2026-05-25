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
// MARIO 64 / GALAXY / SUNSHINE / PAPER MARIO THEMED DECORATIVE ELEMENTS
// Featuring: Power Stars, Coins, Question Blocks, Pipes, Mushrooms, Star Bits,
// Launch Stars, cosmic backgrounds, paper-style outlines
//
// ALL CONTENT IMMEDIATELY VISIBLE - NO HIDING ANIMATIONS
// =============================================================================

// --- COLOR PALETTE (Mario Universe) ---
// Primary: Mario Red (#e52521), Blue (#049cd8), Yellow (#fbd000), Green (#43b047)
// Galaxy: Deep purple (#2d0060), Cosmic blue (#0a0a30), Star yellow (#fff200)
// Sunshine: Tropical aqua (#00c8ff), Sand (#f5e6c8), Shine gold (#ffd700)
// Paper Mario: White outlines, flat colors, slight shadows

// Power Star - iconic Mario collectible
function PowerStar({ size = 40, isShineSprite = false, spinning = false }: { size?: number; isShineSprite?: boolean; spinning?: boolean }) {
  const color = isShineSprite ? '#ffd700' : '#fff200'
  const highlightColor = isShineSprite ? '#fff8b0' : '#ffffa0'
  const shadowColor = isShineSprite ? '#cc9900' : '#cccc00'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label={isShineSprite ? "Shine Sprite" : "Power Star"}
      role="img"
      className={spinning ? 'star-spin' : ''}
    >
      <defs>
        <filter id={`starGlow${isShineSprite ? 'Shine' : ''}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`starGrad${isShineSprite ? 'Shine' : ''}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={highlightColor} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={shadowColor} />
        </linearGradient>
      </defs>
      {/* Five-pointed star shape */}
      <polygon
        points="50,5 61,40 97,40 68,62 79,97 50,75 21,97 32,62 3,40 39,40"
        fill={`url(#starGrad${isShineSprite ? 'Shine' : ''})`}
        stroke={isShineSprite ? '#e6c200' : '#dddd00'}
        strokeWidth="2"
        filter={`url(#starGlow${isShineSprite ? 'Shine' : ''})`}
      />
      {/* Eyes */}
      <ellipse cx="40" cy="45" rx="6" ry="8" fill="#111" />
      <ellipse cx="60" cy="45" rx="6" ry="8" fill="#111" />
      {/* Eye highlights */}
      <circle cx="38" cy="43" r="2" fill="#fff" />
      <circle cx="58" cy="43" r="2" fill="#fff" />
      {/* Happy smile */}
      <path d="M40,58 Q50,68 60,58" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      {/* Sparkle accents */}
      {isShineSprite && (
        <>
          <circle cx="30" cy="25" r="3" fill="#fff" opacity="0.8" />
          <circle cx="75" cy="30" r="2" fill="#fff" opacity="0.8" />
          <circle cx="85" cy="55" r="2" fill="#fff" opacity="0.8" />
        </>
      )}
    </svg>
  )
}

// Coin - Mario currency with spinning animation
function Coin({ size = 24, isRedCoin = false, isBlueCoin = false }: { size?: number; isRedCoin?: boolean; isBlueCoin?: boolean }) {
  const color = isBlueCoin ? '#049cd8' : isRedCoin ? '#e52521' : '#fbd000'
  const highlight = isBlueCoin ? '#60c0ff' : isRedCoin ? '#ff6060' : '#ffea60'
  const shadow = isBlueCoin ? '#0266a0' : isRedCoin ? '#aa1a1a' : '#c8a000'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label={isBlueCoin ? "Blue Coin" : isRedCoin ? "Red Coin" : "Gold Coin"}
      role="img"
    >
      <defs>
        <linearGradient id={`coinGrad${isBlueCoin ? 'Blue' : isRedCoin ? 'Red' : ''}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={shadow} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={`url(#coinGrad${isBlueCoin ? 'Blue' : isRedCoin ? 'Red' : ''})`} stroke={shadow} strokeWidth="1.5" />
      {/* Star emblem in center */}
      <polygon
        points="12,5 13.5,9.5 18,9.5 14.5,12.5 16,17 12,14 8,17 9.5,12.5 6,9.5 10.5,9.5"
        fill={shadow}
        opacity="0.4"
      />
      {/* Shine effect */}
      <ellipse cx="9" cy="8" rx="2" ry="3" fill="#fff" opacity="0.6" transform="rotate(-25 9 8)" />
    </svg>
  )
}

// Question Block - iconic Mario item box
function QuestionBlock({ size = 50, isHit = false }: { size?: number; isHit?: boolean }) {
  const baseColor = isHit ? '#8b4513' : '#fbd000'
  const darkColor = isHit ? '#5a2d0a' : '#c8a000'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      aria-label={isHit ? "Empty Block" : "Question Block"}
      role="img"
    >
      <defs>
        <linearGradient id={`blockGrad${isHit ? 'Hit' : ''}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={baseColor} />
          <stop offset="100%" stopColor={darkColor} />
        </linearGradient>
      </defs>
      {/* Block base with 3D effect */}
      <rect x="2" y="2" width="46" height="46" rx="4" fill={`url(#blockGrad${isHit ? 'Hit' : ''})`} stroke={darkColor} strokeWidth="2" />
      {/* Top highlight */}
      <rect x="4" y="4" width="42" height="3" rx="1" fill="#fff" opacity="0.4" />
      {/* Side shadow */}
      <rect x="4" y="40" width="42" height="6" rx="1" fill="#000" opacity="0.2" />
      {/* Corner rivets */}
      <circle cx="8" cy="8" r="2" fill={darkColor} />
      <circle cx="42" cy="8" r="2" fill={darkColor} />
      <circle cx="8" cy="42" r="2" fill={darkColor} />
      <circle cx="42" cy="42" r="2" fill={darkColor} />
      {/* Question mark or empty */}
      {!isHit ? (
        <text x="25" y="34" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#fff" stroke={darkColor} strokeWidth="1">?</text>
      ) : (
        <rect x="18" y="22" width="14" height="6" rx="1" fill={darkColor} opacity="0.5" />
      )}
    </svg>
  )
}

// Green Pipe - classic Mario warp pipe
function GreenPipe({ size = 60, direction = 'up' }: { size?: number; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const rotation = { up: 0, down: 180, left: -90, right: 90 }[direction]

  return (
    <svg
      width={size * 0.8}
      height={size}
      viewBox="0 0 48 60"
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label="Warp Pipe"
      role="img"
    >
      <defs>
        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a5c1a" />
          <stop offset="30%" stopColor="#43b047" />
          <stop offset="70%" stopColor="#43b047" />
          <stop offset="100%" stopColor="#1a5c1a" />
        </linearGradient>
        <linearGradient id="pipeLip" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d3d0d" />
          <stop offset="30%" stopColor="#2a802a" />
          <stop offset="70%" stopColor="#2a802a" />
          <stop offset="100%" stopColor="#0d3d0d" />
        </linearGradient>
      </defs>
      {/* Pipe body */}
      <rect x="6" y="15" width="36" height="45" fill="url(#pipeGrad)" />
      {/* Pipe lip */}
      <rect x="0" y="0" width="48" height="18" rx="3" fill="url(#pipeLip)" />
      {/* Lip highlight */}
      <rect x="4" y="2" width="40" height="4" rx="2" fill="#5ac05a" opacity="0.6" />
      {/* Inner dark */}
      <ellipse cx="24" cy="9" rx="16" ry="6" fill="#0a2a0a" />
    </svg>
  )
}

// Mushroom - 1UP or Super Mushroom
function Mushroom({ size = 36, is1UP = false }: { size?: number; is1UP?: boolean }) {
  const capColor = is1UP ? '#43b047' : '#e52521'
  const spotColor = '#fff'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      aria-label={is1UP ? "1-UP Mushroom" : "Super Mushroom"}
      role="img"
    >
      <defs>
        <linearGradient id={`mushroomCap${is1UP ? '1up' : ''}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={capColor} />
          <stop offset="100%" stopColor={is1UP ? '#2a802a' : '#aa1a1a'} />
        </linearGradient>
      </defs>
      {/* Cap */}
      <ellipse cx="18" cy="14" rx="16" ry="12" fill={`url(#mushroomCap${is1UP ? '1up' : ''})`} stroke={is1UP ? '#1a5c1a' : '#8b1111'} strokeWidth="1" />
      {/* Spots */}
      <ellipse cx="10" cy="10" rx="5" ry="4" fill={spotColor} />
      <ellipse cx="26" cy="12" rx="4" ry="3" fill={spotColor} />
      <ellipse cx="18" cy="8" rx="3" ry="2" fill={spotColor} />
      {/* Stem */}
      <path d="M10,14 Q10,28 12,32 L24,32 Q26,28 26,14" fill="#f5e6c8" stroke="#d4c4a8" strokeWidth="1" />
      {/* Face */}
      <ellipse cx="14" cy="24" rx="2" ry="3" fill="#111" />
      <ellipse cx="22" cy="24" rx="2" ry="3" fill="#111" />
      <circle cx="13" cy="23" r="0.8" fill="#fff" />
      <circle cx="21" cy="23" r="0.8" fill="#fff" />
    </svg>
  )
}

// Fire Flower
function FireFlower({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      aria-label="Fire Flower"
      role="img"
    >
      {/* Stem */}
      <rect x="16" y="20" width="4" height="14" fill="#43b047" />
      {/* Leaves */}
      <ellipse cx="12" cy="28" rx="5" ry="3" fill="#43b047" transform="rotate(-20 12 28)" />
      <ellipse cx="24" cy="28" rx="5" ry="3" fill="#43b047" transform="rotate(20 24 28)" />
      {/* Flower petals */}
      <circle cx="18" cy="8" r="5" fill="#ff6600" stroke="#cc4400" strokeWidth="1" />
      <circle cx="10" cy="12" r="5" fill="#ff6600" stroke="#cc4400" strokeWidth="1" />
      <circle cx="26" cy="12" r="5" fill="#ff6600" stroke="#cc4400" strokeWidth="1" />
      <circle cx="12" cy="18" r="5" fill="#ff6600" stroke="#cc4400" strokeWidth="1" />
      <circle cx="24" cy="18" r="5" fill="#ff6600" stroke="#cc4400" strokeWidth="1" />
      {/* Center */}
      <circle cx="18" cy="13" r="5" fill="#fff" stroke="#ddd" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="16" cy="12" rx="1.5" ry="2" fill="#111" />
      <ellipse cx="20" cy="12" rx="1.5" ry="2" fill="#111" />
    </svg>
  )
}

// Star Bit - Galaxy collectible
function StarBit({ size = 16, color = 'yellow' }: { size?: number; color?: 'yellow' | 'red' | 'blue' | 'green' | 'purple' }) {
  const colors = {
    yellow: { fill: '#fff200', glow: '#ffff80' },
    red: { fill: '#e52521', glow: '#ff8080' },
    blue: { fill: '#049cd8', glow: '#80d0ff' },
    green: { fill: '#43b047', glow: '#80ff80' },
    purple: { fill: '#9b59b6', glow: '#d080ff' },
  }
  const c = colors[color]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-label={`${color} Star Bit`}
      role="img"
    >
      <defs>
        <filter id={`starBitGlow${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Crystal shape */}
      <polygon
        points="8,1 10,6 15,8 10,10 8,15 6,10 1,8 6,6"
        fill={c.fill}
        stroke={c.glow}
        strokeWidth="0.5"
        filter={`url(#starBitGlow${color})`}
      />
      {/* Inner shine */}
      <polygon
        points="8,4 9,7 12,8 9,9 8,12 7,9 4,8 7,7"
        fill="#fff"
        opacity="0.6"
      />
    </svg>
  )
}

// Launch Star - Galaxy warp star
function LaunchStar({ size = 50, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      aria-label="Launch Star"
      role="img"
      className={active ? 'launch-star-pulse' : ''}
    >
      <defs>
        <filter id="launchGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="launchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffcc00" />
          <stop offset="50%" stopColor="#ff8800" />
          <stop offset="100%" stopColor="#ff4400" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="25" cy="25" r="22" fill="none" stroke="url(#launchGrad)" strokeWidth="3" filter="url(#launchGlow)" />
      {/* Inner star */}
      <polygon
        points="25,8 28,18 38,18 30,24 33,34 25,28 17,34 20,24 12,18 22,18"
        fill="url(#launchGrad)"
        stroke="#ffaa00"
        strokeWidth="1"
        filter="url(#launchGlow)"
      />
      {/* Center sparkle */}
      {active && (
        <circle cx="25" cy="25" r="4" fill="#fff" opacity="0.9" />
      )}
    </svg>
  )
}

// Luma - Galaxy star creature
function Luma({ size = 40, color = 'yellow' }: { size?: number; color?: 'yellow' | 'blue' | 'pink' | 'green' }) {
  const colors = {
    yellow: { body: '#fff200', dark: '#cccc00' },
    blue: { body: '#049cd8', dark: '#0266a0' },
    pink: { body: '#ff69b4', dark: '#cc5090' },
    green: { body: '#43b047', dark: '#2a802a' },
  }
  const c = colors[color]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-label={`${color} Luma`}
      role="img"
    >
      <defs>
        <filter id={`lumaGlow${color}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`lumaBody${color}`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="30%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* Star-shaped body */}
      <polygon
        points="20,2 24,14 36,14 26,22 30,34 20,26 10,34 14,22 4,14 16,14"
        fill={`url(#lumaBody${color})`}
        stroke={c.dark}
        strokeWidth="1"
        filter={`url(#lumaGlow${color})`}
      />
      {/* Eyes */}
      <ellipse cx="16" cy="18" rx="3" ry="4" fill="#111" />
      <ellipse cx="24" cy="18" rx="3" ry="4" fill="#111" />
      {/* Eye highlights */}
      <circle cx="15" cy="17" r="1" fill="#fff" />
      <circle cx="23" cy="17" r="1" fill="#fff" />
    </svg>
  )
}

// === SECTION CARD TEXTURE PATTERNS (Mario-themed) ===

// Brick Block Pattern - classic Mario texture
function BrickBlockTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="brickPattern" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
          <rect width="60" height="30" fill="transparent" />
          {/* Brick rows */}
          <rect x="1" y="1" width="28" height="13" rx="1" fill="#c25c00" opacity="0.08" stroke="#8b4000" strokeWidth="0.5" />
          <rect x="31" y="1" width="28" height="13" rx="1" fill="#c25c00" opacity="0.08" stroke="#8b4000" strokeWidth="0.5" />
          <rect x="-14" y="16" width="28" height="13" rx="1" fill="#c25c00" opacity="0.08" stroke="#8b4000" strokeWidth="0.5" />
          <rect x="16" y="16" width="28" height="13" rx="1" fill="#c25c00" opacity="0.08" stroke="#8b4000" strokeWidth="0.5" />
          <rect x="46" y="16" width="28" height="13" rx="1" fill="#c25c00" opacity="0.08" stroke="#8b4000" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brickPattern)" />
    </svg>
  )
}

// Galaxy Cosmic Background - deep space with stars
function GalaxyTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="galaxyStars" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="transparent" />
          {/* Distant stars */}
          <circle cx="10" cy="20" r="0.8" fill="#fff" opacity="0.3" />
          <circle cx="45" cy="15" r="0.6" fill="#fff" opacity="0.25" />
          <circle cx="80" cy="35" r="0.7" fill="#fff" opacity="0.35" />
          <circle cx="25" cy="60" r="0.5" fill="#fff" opacity="0.2" />
          <circle cx="70" cy="75" r="0.9" fill="#fff" opacity="0.3" />
          <circle cx="55" cy="90" r="0.6" fill="#fff" opacity="0.25" />
          <circle cx="90" cy="55" r="0.7" fill="#fff" opacity="0.3" />
          <circle cx="15" cy="85" r="0.5" fill="#fff" opacity="0.2" />
          {/* Colored stars */}
          <circle cx="35" cy="40" r="1" fill="#ff69b4" opacity="0.15" />
          <circle cx="65" cy="60" r="1" fill="#049cd8" opacity="0.15" />
        </pattern>
        <radialGradient id="galaxyFade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a0040" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0a0020" stopOpacity="0.12" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#galaxyFade)" />
      <rect width="100%" height="100%" fill="url(#galaxyStars)" />
    </svg>
  )
}

// Sunshine Tropical Pattern - Isle Delfino style
function SunshineTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="sunshineWaves" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
          <rect width="80" height="40" fill="transparent" />
          {/* Wave curves */}
          <path d="M0,20 Q20,10 40,20 Q60,30 80,20" fill="none" stroke="#00c8ff" strokeWidth="1" opacity="0.08" />
          <path d="M0,35 Q20,25 40,35 Q60,45 80,35" fill="none" stroke="#00a8e0" strokeWidth="1" opacity="0.06" />
          {/* Sand dots */}
          <circle cx="15" cy="38" r="1" fill="#f5e6c8" opacity="0.1" />
          <circle cx="55" cy="36" r="1.5" fill="#f5e6c8" opacity="0.08" />
        </pattern>
        <linearGradient id="sunshineFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.03" />
          <stop offset="50%" stopColor="#87ceeb" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#f5e6c8" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sunshineFade)" />
      <rect width="100%" height="100%" fill="url(#sunshineWaves)" />
    </svg>
  )
}

// Paper Mario Style - white outlines, flat colors
function PaperMarioTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="paperFolds" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="transparent" />
          {/* Paper fold lines */}
          <path d="M0,60 L120,60" stroke="#fff" strokeWidth="0.5" opacity="0.05" />
          <path d="M60,0 L60,120" stroke="#fff" strokeWidth="0.5" opacity="0.05" />
          {/* Corner fold */}
          <path d="M100,0 L120,20" stroke="#fff" strokeWidth="0.3" opacity="0.08" />
          <path d="M0,100 L20,120" stroke="#fff" strokeWidth="0.3" opacity="0.08" />
          {/* Subtle crease shadows */}
          <path d="M30,30 Q60,35 90,30" stroke="#000" strokeWidth="0.3" opacity="0.03" fill="none" />
          <path d="M30,90 Q60,85 90,90" stroke="#000" strokeWidth="0.3" opacity="0.03" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#paperFolds)" />
    </svg>
  )
}

// === CONTINUOUS CSS-ANIMATED PARTICLES ===

// Coin particles - floating golden coins
function CoinParticles() {
  const [coins, setCoins] = useState<Array<{
    id: number
    x: number
    y: number
    delay: number
    duration: number
    size: number
  }>>([])

  useEffect(() => {
    const newCoins = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 3 + Math.random() * 3,
      size: 16 + Math.random() * 10,
    }))
    setCoins(newCoins)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {coins.map((c) => (
        <div
          key={c.id}
          className="absolute coin-float"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          <Coin size={c.size} />
        </div>
      ))}
    </div>
  )
}

// Star Bit particles - Galaxy style colorful bits
function StarBitParticles() {
  const [bits, setBits] = useState<Array<{
    id: number
    x: number
    y: number
    color: 'yellow' | 'red' | 'blue' | 'green' | 'purple'
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    const colors: Array<'yellow' | 'red' | 'blue' | 'green' | 'purple'> = ['yellow', 'red', 'blue', 'green', 'purple']
    const newBits = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 6,
      duration: 2 + Math.random() * 2,
    }))
    setBits(newBits)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {bits.map((b) => (
        <div
          key={b.id}
          className="absolute starbit-twinkle"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        >
          <StarBit size={14} color={b.color} />
        </div>
      ))}
    </div>
  )
}

// Floating clouds - Mario sky style
function MarioClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute cloud-drift"
          style={{
            top: `${8 + i * 12}%`,
            left: '-200px',
            animationDelay: `${i * 6}s`,
            animationDuration: `${35 + i * 10}s`,
          }}
        >
          <svg width="180" height="80" viewBox="0 0 180 80" opacity="0.9">
            <defs>
              <linearGradient id={`cloudGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e8f0ff" />
              </linearGradient>
            </defs>
            {/* Fluffy Mario-style cloud */}
            <ellipse cx="90" cy="55" rx="80" ry="25" fill={`url(#cloudGrad${i})`} />
            <ellipse cx="55" cy="45" rx="45" ry="30" fill={`url(#cloudGrad${i})`} />
            <ellipse cx="125" cy="45" rx="50" ry="28" fill={`url(#cloudGrad${i})`} />
            <ellipse cx="85" cy="35" rx="40" ry="25" fill="#fff" />
            <ellipse cx="65" cy="30" rx="30" ry="20" fill="#fff" />
            <ellipse cx="110" cy="32" rx="35" ry="22" fill="#fff" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Rainbow ring particles - Galaxy style
function RainbowRings() {
  const [rings, setRings] = useState<Array<{
    id: number
    x: number
    y: number
    delay: number
    size: number
  }>>([])

  useEffect(() => {
    const newRings = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 15 + i * 18,
      y: 75 + Math.random() * 15,
      delay: Math.random() * 4,
      size: 30 + Math.random() * 20,
    }))
    setRings(newRings)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {rings.map((r) => (
        <div
          key={r.id}
          className="absolute rainbow-pulse"
          style={{
            left: `${r.x}%`,
            bottom: '10%',
            animationDelay: `${r.delay}s`,
          }}
        >
          <svg width={r.size} height={r.size * 0.6} viewBox="0 0 50 30">
            <defs>
              <linearGradient id={`rainbow${r.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e52521" />
                <stop offset="20%" stopColor="#ff8800" />
                <stop offset="40%" stopColor="#fbd000" />
                <stop offset="60%" stopColor="#43b047" />
                <stop offset="80%" stopColor="#049cd8" />
                <stop offset="100%" stopColor="#9b59b6" />
              </linearGradient>
            </defs>
            <path
              d="M5,28 Q25,0 45,28"
              fill="none"
              stroke={`url(#rainbow${r.id})`}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

// === UI COMPONENTS ===

// Profession selector node - styled as Power Star / Shine Sprite / Launch Star
function ProfessionNode({
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
    engineer: <PowerStar size={50} isShineSprite={isActive} spinning={isActive} />,
    drummer: <Luma size={50} color={isActive ? 'pink' : 'yellow'} />,
    fighter: <LaunchStar size={50} active={isActive} />,
  }
  const labels = {
    engineer: 'TECH GALAXY',
    drummer: 'RHYTHM COMET',
    fighter: 'POWER PLANET'
  }
  const colors = {
    engineer: '#ffd700',
    drummer: '#ff69b4',
    fighter: '#ff6600'
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className={`absolute transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 cursor-pointer ${
        isActive ? 'scale-125 z-30' : 'hover:scale-110 z-20'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.25)' : ''}`,
      }}
      aria-label={`Select ${labels[profession]} profession ${isActive ? '(currently selected)' : ''}`}
      aria-pressed={isActive}
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-full blur-xl pulse-glow"
          style={{
            background: colors[profession],
            opacity: 0.5,
            transform: 'scale(2.5)',
          }}
          aria-hidden="true"
        />
      )}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: isActive
            ? `radial-gradient(circle, ${colors[profession]}60, #1a0040)`
            : 'radial-gradient(circle, #2a0060, #0a0020)',
          border: `3px solid ${isActive ? colors[profession] : '#4a2080'}`,
          boxShadow: isActive
            ? `0 0 30px ${colors[profession]}, 0 0 60px ${colors[profession]}60, inset 0 0 20px rgba(255,255,255,0.2)`
            : '0 4px 15px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.1)',
        }}
      >
        {icons[profession]}
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-white opacity-30 ping-slow" aria-hidden="true" />
        )}
      </div>
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider"
        style={{
          background: isActive ? 'linear-gradient(180deg, #2a0060, #1a0040)' : 'rgba(26,0,64,0.95)',
          color: isActive ? colors[profession] : '#a080c0',
          border: `2px solid ${isActive ? colors[profession] : '#4a2080'}`,
          boxShadow: isActive ? `0 0 15px ${colors[profession]}60` : '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {labels[profession]}
      </div>
    </button>
  )
}

// Mario Frame - styled card container with Paper Mario aesthetic
function MarioFrame({ children, title, icon, textureType = 'brick' }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
  textureType?: 'brick' | 'galaxy' | 'sunshine' | 'paper'
}) {
  const TextureComponent = {
    brick: BrickBlockTexture,
    galaxy: GalaxyTexture,
    sunshine: SunshineTexture,
    paper: PaperMarioTexture,
  }[textureType]

  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner decorations - Question Blocks */}
      <div className="absolute -top-3 -left-3" aria-hidden="true">
        <QuestionBlock size={28} />
      </div>
      <div className="absolute -top-3 -right-3" aria-hidden="true">
        <QuestionBlock size={28} />
      </div>
      <div className="absolute -bottom-3 -left-3" aria-hidden="true">
        <PowerStar size={25} />
      </div>
      <div className="absolute -bottom-3 -right-3" aria-hidden="true">
        <PowerStar size={25} />
      </div>

      {/* Header bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, transparent, #fbd00080, #fbd000)' }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: 'linear-gradient(180deg, #e52521, #aa1a1a)',
            border: '3px solid #fbd000',
            borderRadius: '8px',
            boxShadow: '0 4px 0 #8b1111, 0 6px 15px rgba(0,0,0,0.4)',
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, #fbd000, #fbd00080, transparent)' }} aria-hidden="true" />
      </div>

      {/* Content area with texture */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(26,0,64,0.95), rgba(10,0,30,0.98))',
          border: '3px solid #4a2080',
          borderRadius: '12px',
          boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.4), 0 0 40px #4a208020',
        }}
      >
        <TextureComponent />
        <div
          className="absolute inset-3 pointer-events-none rounded-lg"
          style={{ border: '1px solid #6a4090' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// Tech Stack display - Mario inventory style
function TechInventory({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 7).map((category, catIdx) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2 text-yellow-300">
            <Coin size={18} isRedCoin={catIdx % 3 === 0} isBlueCoin={catIdx % 3 === 1} />
            <span style={{ textShadow: '0 0 8px #fbd00060' }}>{category.name.toUpperCase()}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: 'linear-gradient(180deg, rgba(74,32,128,0.9), rgba(42,0,96,0.9))',
                  border: '2px solid #6a4090',
                  color: '#e0c0ff',
                  borderRadius: '6px',
                  boxShadow: '0 2px 0 #2a0060, 0 3px 6px rgba(0,0,0,0.3)',
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

// Project card - Star Quest style
function StarQuestCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="relative p-4 cursor-pointer transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(180deg, rgba(74,32,128,0.95), rgba(42,0,96,0.98))',
        border: '3px solid #6a4090',
        borderRadius: '10px',
        boxShadow: '0 4px 0 #2a0060, 0 6px 16px rgba(0,0,0,0.4)',
      }}
      tabIndex={0}
      role="article"
      aria-label={`Project: ${project.name}`}
    >
      <GalaxyTexture />

      <div className="relative z-10">
        <div className="absolute -top-3 -right-3" aria-hidden="true">
          <PowerStar size={30} isShineSprite={project.featured} />
        </div>
        {project.featured && (
          <div className="flex items-center gap-1 mb-2">
            <StarBit size={12} color="yellow" />
            <span className="text-[8px] tracking-wider text-yellow-300" style={{ textShadow: '0 0 8px #fbd00080' }}>GRAND STAR PROJECT</span>
          </div>
        )}
        <h3 className="text-sm font-bold mb-1 text-white">
          {project.name}
        </h3>
        <p className="text-[10px] mb-2 text-purple-200">
          {project.tagline}
        </p>
        {project.impact && (
          <p className="text-[10px] mb-2 italic flex items-center gap-1 text-yellow-300">
            <Coin size={12} /> {project.impact}
          </p>
        )}
        <div className="flex gap-1 flex-wrap">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[8px] px-2 py-0.5 rounded"
              style={{
                background: 'rgba(106,64,144,0.6)',
                color: '#c0a0e0',
                border: '1px solid #8a60b0',
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

// Company card - Warp Pipe destination style
function WarpPipeCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(26,92,26,0.95), rgba(13,61,13,0.98))',
        border: '3px solid #43b047',
        borderRadius: '10px',
      }}
    >
      <SunshineTexture />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <GreenPipe size={35} />
          <div>
            <h4 className="text-sm group-hover:text-green-300 transition-colors text-white">
              {company.name}
            </h4>
            <p className="text-[10px] text-yellow-300">{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs text-green-200">{company.description}</p>
      </div>
    </a>
  )
}

// Band card - Music Note style
function MusicWorldCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(155,89,182,0.95), rgba(100,50,130,0.98))',
        border: '3px solid #d080ff',
        borderRadius: '10px',
      }}
    >
      <PaperMarioTexture />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Luma size={24} color="pink" />
          <h4 className="text-sm group-hover:text-pink-200 transition-colors text-white">
            {band.name}
          </h4>
        </div>
        <p className="text-[10px] mt-1 text-purple-200">{band.genre} | {band.role}</p>
        <p className="text-xs mt-2 text-pink-100">{band.description}</p>
        {!band.url && <p className="text-[10px] mt-2 italic text-purple-300">World not yet unlocked...</p>}
      </div>
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">{content}</a>
  }
  return content
}

// Experience entry - Power Star Quest Log
function QuestLogEntry({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4 transition-all hover:scale-[1.01] relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(74,32,128,0.95), rgba(42,0,96,0.98))',
        border: '3px solid #6a4090',
        borderRadius: '10px',
        boxShadow: '0 3px 0 #2a0060, 0 5px 12px rgba(0,0,0,0.3)',
      }}
    >
      <GalaxyTexture />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-2">
            <PowerStar size={22} />
            <div>
              <h4 className="text-sm font-bold text-white">{entry.title}</h4>
              <p className="text-xs text-yellow-300">{entry.organization}</p>
            </div>
          </div>
          <span
            className="text-[10px] px-2 py-1 rounded"
            style={{
              background: 'rgba(106,64,144,0.8)',
              color: '#e0c0ff',
              border: '1px solid #8a60b0',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>
        <p className="text-xs mb-2 text-purple-200">{entry.description}</p>
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-1 mt-2">
            {entry.highlights.map((highlight, i) => (
              <li key={i} className="text-xs flex items-start gap-2 text-purple-100">
                <StarBit size={10} color={(['yellow', 'red', 'blue', 'green', 'purple'] as const)[i % 5]} />
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// Skill display - Power-Up style
function SkillDisplay({ category }: { category: ReturnType<typeof getSkillsByProfession>[0] }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2 text-yellow-300">
        <span>{category.icon}</span>
        <span style={{ textShadow: '0 0 8px #fbd00060' }}>{category.name.toUpperCase()}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill.name}
            className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
            style={{
              background: 'linear-gradient(180deg, rgba(74,32,128,0.9), rgba(42,0,96,0.9))',
              border: '2px solid #6a4090',
              color: '#e0c0ff',
              borderRadius: '6px',
              boxShadow: '0 2px 0 #2a0060',
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}

// Content overlay
function CosmicOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[8]"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,0,30,0.15) 70%, rgba(10,0,30,0.25) 100%)',
      }}
      aria-hidden="true"
    />
  )
}

// Divider - Mario style
function MarioDivider() {
  return (
    <div className="flex justify-center items-center py-8 gap-4" aria-hidden="true">
      <Coin size={24} />
      <QuestionBlock size={35} />
      <div className="flex gap-1">
        <StarBit size={16} color="yellow" />
        <StarBit size={16} color="red" />
        <StarBit size={16} color="blue" />
      </div>
      <PowerStar size={40} />
      <div className="flex gap-1">
        <StarBit size={16} color="green" />
        <StarBit size={16} color="purple" />
        <StarBit size={16} color="yellow" />
      </div>
      <QuestionBlock size={35} />
      <Coin size={24} />
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

  // Position nodes with enough spacing for clickability
  const nodePositions = {
    engineer: { x: 120, y: 100 },
    drummer: { x: 350, y: 80 },
    fighter: { x: 580, y: 100 },
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        // Mario Galaxy cosmic background
        background: 'linear-gradient(180deg, #0a0030 0%, #1a0050 20%, #2d0060 40%, #1a0050 60%, #0a0030 80%, #050020 100%)',
        fontFamily: '"Nunito", "Quicksand", "Segoe UI", sans-serif',
      }}
    >
      {/* Background layers - continuous CSS animations */}
      <MarioClouds />
      <RainbowRings />
      <CoinParticles />
      <StarBitParticles />

      {/* Cosmic content overlay */}
      <CosmicOverlay />

      {/* Galaxy star field background (z-[0]) */}
      <div className="fixed inset-0 pointer-events-none z-[0]" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <radialGradient id="galaxyCore" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#4a2080" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#galaxyCore)" />
          {/* Distant stars */}
          {Array.from({ length: 100 }).map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5 + 0.3}
              fill="#fff"
              opacity={Math.random() * 0.5 + 0.2}
            />
          ))}
        </svg>
      </div>

      {/* Header - ALL CONTENT IMMEDIATELY VISIBLE */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <PowerStar size={45} isShineSprite />
              <h1
                className="text-3xl tracking-wider font-bold text-white"
                style={{
                  textShadow: '3px 3px 0 #e52521, 6px 6px 0 #000, 0 0 30px #ffd70080'
                }}
              >
                ALEXANDER PULIDO
              </h1>
            </div>
            <p
              className="text-sm tracking-wide font-medium text-yellow-200"
              style={{ textShadow: '0 0 15px rgba(251,208,0,0.6)' }}
            >
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p
              className="text-xs tracking-wide mt-1 italic text-purple-200"
              style={{ textShadow: '0 0 10px rgba(155,89,182,0.5)' }}
            >
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-5">
              {/* Coin counter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, #2a0060, #1a0040)',
                  border: '3px solid #6a4090',
                  boxShadow: '0 3px 0 #0a0020, 0 0 15px #4a208040'
                }}
              >
                <Coin size={22} />
                <span className="text-sm font-bold text-yellow-300" style={{ textShadow: '0 0 8px #fbd00060' }}>99,999</span>
              </div>
              {/* Star counter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, #2a0060, #1a0040)',
                  border: '3px solid #6a4090',
                  boxShadow: '0 3px 0 #0a0020, 0 0 15px #4a208040'
                }}
              >
                <PowerStar size={22} />
                <span className="text-sm font-bold text-yellow-300" style={{ textShadow: '0 0 8px #fbd00060' }}>120</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Link
                href="/cv"
                className="mario-button px-5 py-2.5 text-xs tracking-wider transition-all hover:scale-105 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                style={{
                  background: 'linear-gradient(180deg, #049cd8, #0266a0)',
                  border: '3px solid #60c0ff',
                  color: '#fff',
                  boxShadow: '0 4px 0 #024080',
                }}
              >
                <span className="flex items-center gap-2">
                  <QuestionBlock size={18} />
                  INVENTORY
                </span>
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="mario-button px-5 py-2.5 text-xs tracking-wider transition-all hover:scale-105 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                style={{
                  background: 'linear-gradient(180deg, #fbd000, #c8a000)',
                  border: '3px solid #ffe860',
                  color: '#3a2a00',
                  boxShadow: '0 4px 0 #8b6914',
                }}
              >
                <span className="flex items-center gap-2">
                  <PowerStar size={18} />
                  ADVENTURE
                </span>
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Current Roles - Power-Up style */}
      <section className="relative z-20 py-4 px-6" aria-label="Current Roles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role, idx) => (
              <div
                key={role.id}
                className="flex items-center gap-3 px-5 py-2.5 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, rgba(42,0,96,0.95), rgba(26,0,64,0.95))',
                  border: '3px solid #6a4090',
                  boxShadow: '0 3px 0 #2a0060, 0 0 20px #4a208030',
                }}
              >
                {idx === 0 ? <Mushroom size={28} /> : <Mushroom size={28} is1UP />}
                <div>
                  <p className="text-xs tracking-wider text-yellow-300" style={{ textShadow: '0 0 8px #fbd00060' }}>{role.title}</p>
                  <p className="text-sm font-medium text-white">{role.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Map - Galaxy Observatory style profession selector */}
      <section className="relative z-20 h-[280px]" aria-label="Profession Selection">
        <div className="relative max-w-3xl mx-auto h-full">
          {/* Galaxy orbital paths */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} aria-hidden="true">
            <defs>
              <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#ffd700" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff6600" stopOpacity="0.6" />
              </linearGradient>
              <filter id="orbitBlur">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            {/* Curved orbital paths */}
            <path
              d="M 120 100 Q 235 50 350 80"
              fill="none"
              stroke="url(#orbitGlow)"
              strokeWidth="4"
              strokeDasharray="12 8"
              strokeLinecap="round"
              filter="url(#orbitBlur)"
            />
            <path
              d="M 350 80 Q 465 110 580 100"
              fill="none"
              stroke="url(#orbitGlow)"
              strokeWidth="4"
              strokeDasharray="12 8"
              strokeLinecap="round"
              filter="url(#orbitBlur)"
            />
          </svg>

          {/* Profession nodes - ensure they're above orbital paths */}
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <ProfessionNode
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
              position={nodePositions[prof]}
            />
          ))}
        </div>
      </section>

      {/* Main content - ALL CONTENT IMMEDIATELY VISIBLE */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* About panel */}
          <section className="mb-8">
            <MarioFrame title="About" icon={<Luma size={24} color="yellow" />} textureType="galaxy">
              <p className="text-sm leading-relaxed mb-4 text-purple-100">
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-xs px-4 py-1.5 rounded-lg flex items-center gap-2"
                    style={{
                      background: [
                        'rgba(229,37,33,0.2)',
                        'rgba(4,156,216,0.2)',
                        'rgba(67,176,71,0.2)',
                        'rgba(251,208,0,0.2)'
                      ][i % 4],
                      border: `2px solid ${['#e52521', '#049cd8', '#43b047', '#fbd000'][i % 4]}50`,
                      color: '#e0c0ff',
                    }}
                  >
                    <StarBit size={12} color={(['red', 'blue', 'green', 'yellow'] as const)[i % 4]} />
                    {fact}
                  </span>
                ))}
              </div>
            </MarioFrame>
          </section>

          {/* Work Experience */}
          {experience.length > 0 && (
            <>
              <MarioDivider />

              <section className="mb-8">
                <MarioFrame title="Star Log" icon={<PowerStar size={24} />} textureType="galaxy">
                  <div className="space-y-4">
                    {experience.map((entry) => (
                      <QuestLogEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                </MarioFrame>
              </section>
            </>
          )}

          <MarioDivider />

          {/* Tech Stack / Skills */}
          <section className="mb-8">
            <MarioFrame
              title={active === 'engineer' ? 'Power-Up Inventory' : 'Special Abilities'}
              icon={active === 'engineer' ? <FireFlower size={28} /> : <Mushroom size={28} />}
              textureType="paper"
            >
              {active === 'engineer' ? (
                <TechInventory categories={engineerTech} />
              ) : (
                <div className="space-y-4">
                  {otherSkills.map((category) => (
                    <SkillDisplay key={category.name} category={category} />
                  ))}
                </div>
              )}
            </MarioFrame>
          </section>

          <MarioDivider />

          {/* Projects */}
          <section className="mb-8">
            <MarioFrame title="Grand Star Quests" icon={<PowerStar size={28} isShineSprite />} textureType="galaxy">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <StarQuestCard key={project.id} project={project} />
                ))}
              </div>
            </MarioFrame>
          </section>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <>
              <MarioDivider />
              <section className="mb-8">
                <MarioFrame title="Warp Zones" icon={<GreenPipe size={30} />} textureType="sunshine">
                  <div className="grid md:grid-cols-3 gap-4">
                    {COMPANIES.map((company) => (
                      <WarpPipeCard key={company.id} company={company} />
                    ))}
                  </div>
                </MarioFrame>
              </section>
            </>
          )}

          {active === 'drummer' && (
            <>
              <MarioDivider />
              <section className="mb-8">
                <MarioFrame title="Music Worlds" icon={<Luma size={28} color="pink" />} textureType="paper">
                  <div className="grid md:grid-cols-3 gap-4">
                    {BANDS.map((band) => (
                      <MusicWorldCard key={band.id} band={band} />
                    ))}
                  </div>
                </MarioFrame>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-10 text-center">
        <div
          className="inline-flex items-center justify-center gap-6 px-8 py-4 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(42,0,96,0.95), rgba(26,0,64,0.95))',
            border: '3px solid #6a4090',
            boxShadow: '0 4px 0 #2a0060, 0 0 30px #4a208030'
          }}
        >
          <GreenPipe size={40} />
          <div className="flex items-center gap-3 text-purple-200">
            <PowerStar size={28} />
            <span className="text-sm tracking-[0.25em] font-medium">GALAXY EXPLORER SINCE 2014</span>
            <PowerStar size={28} />
          </div>
          <GreenPipe size={40} />
        </div>
        <p
          className="text-xs mt-3 px-4 py-2 rounded-lg inline-block"
          style={{
            color: '#a080c0',
            background: 'rgba(26,0,64,0.9)',
            border: '2px solid #4a2080'
          }}
        >
          SAVE FILE 01 | STARS: 120/120 | SHINE SPRITES: 120/120
        </p>
      </footer>

      {/* CSS Animations - ALL NON-HIDING, DECORATIVE ONLY */}
      <style jsx global>{`
        /* === CONTINUOUS PARTICLE ANIMATIONS === */

        @keyframes coin-float-anim {
          0%, 100% { opacity: 0.6; transform: translateY(0) rotateY(0deg); }
          25% { opacity: 0.9; transform: translateY(-15px) rotateY(90deg); }
          50% { opacity: 0.7; transform: translateY(-8px) rotateY(180deg); }
          75% { opacity: 0.9; transform: translateY(-20px) rotateY(270deg); }
        }

        @keyframes starbit-twinkle-anim {
          0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes cloud-drift-anim {
          from { transform: translateX(-200px); }
          to { transform: translateX(calc(100vw + 200px)); }
        }

        @keyframes rainbow-pulse-anim {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .coin-float {
          animation: coin-float-anim ease-in-out infinite;
        }

        .starbit-twinkle {
          animation: starbit-twinkle-anim ease-in-out infinite;
        }

        .cloud-drift {
          animation: cloud-drift-anim linear infinite;
        }

        .rainbow-pulse {
          animation: rainbow-pulse-anim ease-in-out infinite 3s;
        }

        /* === UI ANIMATIONS === */

        @keyframes star-spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes launch-star-pulse-anim {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.3); }
        }

        @keyframes ping-slow-anim {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes pulse-glow-anim {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .star-spin {
          animation: star-spin-anim 4s linear infinite;
        }

        .launch-star-pulse {
          animation: launch-star-pulse-anim 1.5s ease-in-out infinite;
        }

        .ping-slow {
          animation: ping-slow-anim 2s ease-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow-anim 2.5s ease-in-out infinite;
        }

        /* ========================================
           MARIO BUTTON - Power-Up Press Effect
           ======================================== */
        .mario-button {
          position: relative;
          overflow: hidden;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .mario-button:active {
          transform: translateY(4px) scale(0.98);
          box-shadow: none !important;
        }
        .mario-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          pointer-events: none;
        }

        /* ===== REDUCED MOTION SUPPORT ===== */
        @media (prefers-reduced-motion: reduce) {
          .coin-float,
          .starbit-twinkle,
          .cloud-drift,
          .rainbow-pulse,
          .star-spin,
          .launch-star-pulse,
          .ping-slow,
          .pulse-glow,
          .mario-button {
            animation: none !important;
            transition: none !important;
          }
          .coin-float,
          .starbit-twinkle {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
