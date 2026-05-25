'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type CharacterAction = 'run' | 'jump' | 'stop'
type CharacterDirection = 'left' | 'right' | 'front' | 'down'

interface CharacterSpriteProps {
  action?: CharacterAction
  direction?: CharacterDirection
  className?: string
  style?: React.CSSProperties
  filter?: string // CSS filter for theme styling (grayscale, sepia, hue-rotate, etc.)
  overlay?: React.ReactNode // Theme-specific overlay (flashlight, sword, etc.)
  size?: number
  animated?: boolean
}

const spriteMap: Record<string, string> = {
  'run-right': '/assets/sprites/run_right.png',
  'run-right-1': '/assets/sprites/run_right_1.png',
  'run-left': '/assets/sprites/run_left.png',
  'run-left-1': '/assets/sprites/run_left_1.png',
  'run-down': '/assets/sprites/run_down.png',
  'run-down-1': '/assets/sprites/run_down_1.png',
  'jump-right': '/assets/sprites/jump_right.png',
  'jump-left': '/assets/sprites/jump_left.png',
  'stop-front': '/assets/sprites/stop_front.png',
  'stop-right': '/assets/sprites/stop.png',
}

export function CharacterSprite({
  action = 'run',
  direction = 'right',
  className = '',
  style = {},
  filter = '',
  overlay,
  size = 80,
  animated = true,
}: CharacterSpriteProps) {
  const [frame, setFrame] = useState(0)

  // Animate between frames for running
  useEffect(() => {
    if (!animated || action !== 'run') return
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 2)
    }, 150)
    return () => clearInterval(interval)
  }, [animated, action])

  const spriteKey = action === 'run' && frame === 1
    ? `${action}-${direction}-1`
    : `${action}-${direction}`

  const spriteSrc = spriteMap[spriteKey] || spriteMap['stop-front']

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size * 1.2,
        ...style
      }}
    >
      <Image
        src={spriteSrc}
        alt="Character"
        fill
        className="object-contain"
        style={{ filter }}
        priority
      />
      {overlay && (
        <div className="absolute inset-0 pointer-events-none">
          {overlay}
        </div>
      )}
    </div>
  )
}

// Pre-styled character variants for each theme
export function SurvivorCharacter(props: Omit<CharacterSpriteProps, 'filter' | 'overlay'>) {
  return (
    <CharacterSprite
      {...props}
      filter="contrast(1.1) brightness(0.9)"
      overlay={
        <div className="absolute -right-4 top-1/4 w-8 h-3 bg-yellow-300/60 blur-sm rounded-full"
             style={{ transform: 'rotate(-15deg)' }} />
      }
    />
  )
}

export function ShadowCharacter(props: Omit<CharacterSpriteProps, 'filter'>) {
  return (
    <CharacterSprite
      {...props}
      filter="brightness(0) contrast(1)"
    />
  )
}

export function PixelCharacter(props: Omit<CharacterSpriteProps, 'filter'>) {
  return (
    <CharacterSprite
      {...props}
      filter="contrast(1.3) saturate(0.8)"
      style={{ imageRendering: 'pixelated', ...props.style }}
    />
  )
}

export function NeonCharacter(props: Omit<CharacterSpriteProps, 'filter'> & { glowColor?: string }) {
  const glowColor = props.glowColor || '#0ff'
  return (
    <CharacterSprite
      {...props}
      filter={`brightness(1.2) contrast(1.1) drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`}
    />
  )
}

export function VintageCharacter(props: Omit<CharacterSpriteProps, 'filter'>) {
  return (
    <CharacterSprite
      {...props}
      filter="sepia(0.6) contrast(1.1) brightness(0.95)"
    />
  )
}

export function InkCharacter(props: Omit<CharacterSpriteProps, 'filter'>) {
  return (
    <CharacterSprite
      {...props}
      filter="grayscale(1) contrast(2) brightness(1.2)"
    />
  )
}

export default CharacterSprite
