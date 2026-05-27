'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS PIXEL ART SPRITE SYSTEM
 * ==============================
 * True pixel art using grid-based <rect> elements
 * Multiple frames per animation for authentic sprite feel
 *
 * Grid: 32x48 pixels (can scale to any size)
 * Animations: idle, run (4 frames), throw (3 frames), pull (3 frames)
 */

const PIXEL_SIZE = 4 // Each "pixel" is 4x4 SVG units (scales to 128x192 viewBox)
const GRID_WIDTH = 32
const GRID_HEIGHT = 48

// Color palette - matches God of War aesthetic
const C = {
  _: null,           // transparent
  S: '#d4c8b8',      // skin
  s: '#a89880',      // skin shadow
  R: '#8b1a1a',      // red (tattoo/skirt)
  r: '#5a0a0a',      // red dark
  B: '#2a1a0a',      // beard/dark brown
  G: '#c9a227',      // gold
  g: '#8a6a10',      // gold dark
  L: '#5a4a2a',      // leather (belt)
  W: '#ffffff',      // white (eyes)
  K: '#1a0a00',      // black
  C: '#888888',      // chain grey
}

type PixelColor = keyof typeof C

// Pixel grid type - 2D array of color keys
type PixelGrid = (PixelColor | null)[][]

// Shorthand for null/transparent
const _ = null

// ============================================================================
// KRATOS FRAMES - Each frame is a 32x48 pixel grid
// ============================================================================

// IDLE FRAME 1 - Standing neutral
const KRATOS_IDLE_1: PixelGrid = [
  // Row 0-5: Top of head
  [_,_,_,_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','W','W','K','S','S','K','W','W','S','S',_,_,_,_,_,_,_,_,_,_],
  // Row 6-10: Face
  [_,_,_,_,_,_,_,_,_,'R','S','S','W','K','K','S','S','K','K','W','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','s','S','S','s','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','s','s','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','B','B','B','B','B','B','B','B','S','S',_,_,_,_,_,_,_,_,_,_,_],
  // Row 11-15: Neck and shoulders
  [_,_,_,_,_,_,_,_,_,_,_,'S','B','B','B','B','B','B','B','B','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,'S','S','S','R','S','S','S','s','s','S','S','s','s','S','S','S','S','S','S',_,_,_,_,_,_,_],
  // Row 16-22: Torso
  [_,_,_,_,_,_,'S','S','S','R','S','S','S','s','S','s','S','s','S','S','S','S','S','S','S',_,_,_,_,_,_,_],
  [_,_,_,_,_,_,'S','S','S','R','S','S','S','s','S','s','S','s','S','S','S','S','S','S','S',_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'S','S','R','S','S','s','s','S','s','S','s','s','S','S','S','S','S',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'S','S','R','S','S','s','s','S','s','S','s','s','S','S','S','S','S',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'S','R','S','S','S','s','S','s','S','s','S','S','S','S','S',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'S','R','S','S','S','s','S','s','S','s','S','S','S','S','S',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'L','L','L','L','L','L','G','G','L','L','L','L','L','L','L',_,_,_,_,_,_,_,_,_],
  // Row 23-30: Skirt and upper legs
  [_,_,_,_,_,_,_,_,'R','R','R','R','R','R','R','R','R','R','R','R','R','R','R',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'R','R','r','R','R','r','R','r','R','R','r','R','R','R','R',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'R','r','r','R','r','r','R','r','r','R','r','r','R','R','R',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'r','R','R','r',_,'R',_,'r','R','R','r',_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S',_,'S',_,'S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S',_,'S',_,'S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S',_,'S',_,'S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S',_,'S',_,'S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  // Row 31-40: Lower legs
  [_,_,_,_,_,_,_,_,_,_,'S','s','S',_,'S',_,'S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','s','S',_,'S',_,'S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','s','S',_,'S',_,'S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','s','S',_,'S',_,'S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'s','S','s',_,'s',_,'s','S','s',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'s','S','s',_,'s',_,'s','S','s',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'s','S','s',_,'s',_,'s','S','s',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'s','S','s',_,'s',_,'s','S','s',_,_,_,_,_,_,_,_,_,_,_,_,_],
  // Row 41-47: Feet
  [_,_,_,_,_,_,_,_,_,_,'s','s','s',_,'s',_,'s','s','s',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'s','s','s',_,'s',_,'s','s','s',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'B','B','B','B',_,_,_,'B','B','B','B',_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'B','B','B','B',_,_,_,'B','B','B','B',_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

// RUN FRAME 1 - Left leg forward
const KRATOS_RUN_1: PixelGrid = [
  // Head (same as idle but shifted for movement)
  [_,_,_,_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','W','W','K','S','S','K','W','W','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','W','K','K','S','S','K','K','W','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'R','S','S','S','S','s','S','S','s','S','S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','s','s','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,'S','S','B','B','B','B','B','B','B','B','S','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,'S','B','B','B','B','B','B','B','B','S',_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,'S','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_],
  // Torso leaning forward, arms in motion
  [_,_,_,_,_,'S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_],
  [_,_,_,_,'S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S',_,_,_,_,_],
  [_,_,_,_,'S','S','S','R','S','S','S','S','s','s','S','S','s','s','S','S','S','S','S','S','S','S','S',_,_,_,_,_],
  [_,_,_,_,_,'S','S','R','S','S','S','S','s','S','s','S','s','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_],
  [_,_,_,_,_,'S','S','R','S','S','S','S','s','S','s','S','s','S','S','S','S','S','S','S','S','S',_,_,_,_,_,_],
  [_,_,_,_,_,_,'S','R','S','S','S','s','s','S','s','S','s','s','S','S','S','S','S','S','S',_,_,_,_,_,_,_],
  [_,_,_,_,_,_,'S','R','S','S','S','s','s','S','s','S','s','s','S','S','S','S','S','S','S',_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'R','S','S','S','S','s','S','s','S','s','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'R','S','S','S','S','s','S','s','S','s','S','S','S','S','S','S','S',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'L','L','L','L','L','L','L','G','G','L','L','L','L','L','L','L','L',_,_,_,_,_,_,_,_],
  // Skirt flowing back
  [_,_,_,_,_,_,_,_,'R','R','R','R','R','R','R','R','R','R','R','R','R','R','R','R',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,'R','R','r','R','R','r','R','r','R','R','r','R','R','r','R','R',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,'r','r','R','r','r','R','r','r','R','r','r','R','r','R',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,'R','r',_,'R',_,'r','R','r',_,'R',_,_,_,_,_,_,_,_,_,_,_],
  // Legs - left forward, right back
  [_,_,_,_,_,_,_,_,'S','S','S',_,_,_,_,_,_,_,_,'S','S','S',_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,'S','S','S','S',_,_,_,_,_,_,_,_,_,'S','S','S',_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,'S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,'S','S','S',_,_,_,_,_,_,_,_],
  [_,_,_,_,_,'S','S','S','S',_,_,_,_,_,_,_,_,_,_,_,_,_,'S','S','S',_,_,_,_,_,_,_],
  [_,_,_,_,'S','S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'S','S','S',_,_,_,_,_,_],
  [_,_,_,'S','S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'S','s','S',_,_,_,_,_],
  [_,_,_,'S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'S','s','S',_,_,_,_],
  [_,_,'S','s','S',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'S','s','S',_,_,_],
  [_,_,'s','S',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'s','S',_,_,_],
  [_,_,'s','S',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'S','s',_,_],
  [_,_,'s','s',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'s','s',_,_],
  [_,_,'s','s',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'s','s',_,_],
  [_,'B','B','B',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'B','B','B',_],
  [_,'B','B','B',_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,'B','B','B',_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

// RUN FRAME 2 - Right leg forward (mirror of frame 1 legs)
const KRATOS_RUN_2: PixelGrid = KRATOS_RUN_1.map((row, y) => {
  // Mirror legs portion (rows 27-40)
  if (y >= 27 && y <= 40) {
    return [...row].reverse() as (PixelColor | null)[]
  }
  return row
})

// Animation frames collection
const FRAMES = {
  idle: [KRATOS_IDLE_1],
  run: [KRATOS_RUN_1, KRATOS_RUN_2],
}

// ============================================================================
// PIXEL SPRITE RENDERER
// ============================================================================

interface PixelSpriteProps {
  grid: PixelGrid
  pixelSize?: number
  className?: string
}

const PixelSprite = memo(function PixelSprite({
  grid,
  pixelSize = PIXEL_SIZE,
  className = '',
}: PixelSpriteProps) {
  const width = GRID_WIDTH * pixelSize
  const height = GRID_HEIGHT * pixelSize

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((row, y) =>
        row.map((colorKey, x) => {
          if (!colorKey || colorKey === '_') return null
          const color = C[colorKey as keyof typeof C]
          if (!color) return null
          return (
            <rect
              key={`${x}-${y}`}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={color}
            />
          )
        })
      )}
    </svg>
  )
})

// ============================================================================
// KRATOS CHARACTER COMPONENT
// ============================================================================

type KratosAnimation = 'idle' | 'running' | 'throwing' | 'pulling' | 'breathing'

interface KratosCharacterProps {
  scale?: number
  animation?: KratosAnimation
  facingDirection?: 'left' | 'right'
  className?: string
}

export const KratosCharacter = memo(function KratosCharacter({
  scale = 1,
  animation = 'idle',
  facingDirection = 'left',
  className = '',
}: KratosCharacterProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const isLeft = facingDirection === 'left'

  // Get frames for current animation
  const frames = animation === 'running' ? FRAMES.run : FRAMES.idle
  const frameCount = frames.length

  // Animate through frames
  useEffect(() => {
    if (frameCount <= 1) return

    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frameCount)
    }, animation === 'running' ? 150 : 500)

    return () => clearInterval(interval)
  }, [animation, frameCount])

  const currentFrame = frames[frameIndex % frameCount]

  return (
    <div
      className={className}
      style={{
        transform: `scale(${scale}) ${isLeft ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'center',
      }}
    >
      <PixelSprite grid={currentFrame} pixelSize={PIXEL_SIZE} />
    </div>
  )
})

// ============================================================================
// KRATOS CHAIN PULL REVEAL
// ============================================================================

interface KratosChainPullRevealProps {
  children: React.ReactNode
  triggered: boolean
  className?: string
}

type Phase = 'waiting' | 'running' | 'throwing' | 'pulling' | 'done'

export const KratosChainPullReveal = memo(function KratosChainPullReveal({
  children,
  triggered,
  className = '',
}: KratosChainPullRevealProps) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const [kratosX, setKratosX] = useState(-500)
  const [contentX, setContentX] = useState(-400)
  const didAnimate = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || didAnimate.current) return
    didAnimate.current = true

    // Phase 1: Run in
    setPhase('running')
    const runStart = performance.now()
    const runDuration = 800
    const startX = -500
    const stopX = -100

    const animateRun = (now: number) => {
      const elapsed = now - runStart
      const progress = Math.min(elapsed / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setKratosX(startX + (stopX - startX) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    // Phase 2: Throw
    const t1 = setTimeout(() => setPhase('throwing'), 850)

    // Phase 3: Pull content
    const t2 = setTimeout(() => {
      setPhase('pulling')
      const pullStart = performance.now()
      const pullDuration = 600

      const animatePull = (now: number) => {
        const elapsed = now - pullStart
        const progress = Math.min(elapsed / pullDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 2)
        setContentX(-400 + 400 * eased)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animatePull)
        }
      }
      rafRef.current = requestAnimationFrame(animatePull)
    }, 1200)

    // Phase 4: Done
    const t3 = setTimeout(() => setPhase('done'), 1900)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered])

  const kratosAnim: KratosAnimation =
    phase === 'running' ? 'running' :
    phase === 'done' ? 'breathing' : 'idle'

  return (
    <div className={`relative ${className}`}>
      {/* Kratos */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          right: kratosX,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: phase !== 'waiting' ? 1 : 0,
        }}
      >
        <KratosCharacter
          scale={1.5}
          animation={kratosAnim}
          facingDirection="left"
        />
      </div>

      {/* Content */}
      <div
        style={{
          opacity: phase === 'waiting' ? 0 : 1,
          transform: `translateX(${contentX}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
})
