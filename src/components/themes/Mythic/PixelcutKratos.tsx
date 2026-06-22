'use client'

import { memo, useState, useEffect, useCallback } from 'react'

/**
 * PIXELCUT KRATOS - AI-Generated Sprite Animation
 * ================================================
 * Uses extracted frames from Pixelcut sprite sheet.
 * Supports: idle, walk, attack, jump, run
 * Direction: right (default) or left (mirrored)
 */

type AnimationType = 'idle' | 'walk' | 'attack' | 'jump' | 'run'

interface PixelcutKratosProps {
  animation?: AnimationType
  direction?: 'left' | 'right'
  scale?: number
  frameRate?: number
  className?: string
  style?: React.CSSProperties
}

const FRAME_COUNTS: Record<AnimationType, number> = {
  idle: 4,
  walk: 4,
  attack: 4,
  jump: 4,
  run: 4,
}

const DEFAULT_FRAME_RATES: Record<AnimationType, number> = {
  idle: 400,
  walk: 150,
  attack: 100,
  jump: 150,
  run: 100,
}

function PixelcutKratosComponent({
  animation = 'idle',
  direction = 'right',
  scale = 1,
  frameRate,
  className = '',
  style = {},
}: PixelcutKratosProps) {
  const [frame, setFrame] = useState(0)

  const actualFrameRate = frameRate ?? DEFAULT_FRAME_RATES[animation]
  const frameCount = FRAME_COUNTS[animation]

  useEffect(() => {
    setFrame(0)
  }, [animation])

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frameCount)
    }, actualFrameRate)

    return () => clearInterval(interval)
  }, [frameCount, actualFrameRate])

  const basePath = direction === 'left'
    ? '/sprites/kratos/left'
    : '/sprites/kratos'

  const spriteSrc = `${basePath}/${animation}_${frame}.png`

  return (
    <div
      className={className}
      style={{
        width: 100 * scale,
        height: 180 * scale,
        position: 'relative',
        ...style,
      }}
    >
      <img
        src={spriteSrc}
        alt={`Kratos ${animation} frame ${frame}`}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export const PixelcutKratos = memo(PixelcutKratosComponent)

/**
 * Demo component showing all animations
 */
export function PixelcutKratosDemo() {
  const [activeAnimation, setActiveAnimation] = useState<AnimationType>('idle')
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const animations: AnimationType[] = ['idle', 'walk', 'run', 'attack', 'jump']

  return (
    <div style={{
      padding: '2rem',
      background: '#1a1a2e',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>Pixelcut Kratos Sprite Test</h1>

      {/* Controls */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {animations.map((anim) => (
          <button
            key={anim}
            onClick={() => setActiveAnimation(anim)}
            style={{
              padding: '0.5rem 1rem',
              background: activeAnimation === anim ? '#4a9eff' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            {anim}
          </button>
        ))}
        <button
          onClick={() => setDirection(d => d === 'left' ? 'right' : 'left')}
          style={{
            padding: '0.5rem 1rem',
            background: '#666',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Direction: {direction.toUpperCase()}
        </button>
      </div>

      {/* Main preview */}
      <div style={{
        marginBottom: '2rem',
        padding: '2rem',
        background: '#0a0a14',
        borderRadius: '8px',
        display: 'inline-block',
      }}>
        <PixelcutKratos
          animation={activeAnimation}
          direction={direction}
          scale={2}
        />
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>
          {activeAnimation.toUpperCase()} - {direction}
        </p>
      </div>

      {/* All animations at once */}
      <h2 style={{ marginBottom: '1rem' }}>All Animations (right)</h2>
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem'
      }}>
        {animations.map((anim) => (
          <div key={anim} style={{ textAlign: 'center' }}>
            <PixelcutKratos animation={anim} direction="right" scale={1} />
            <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '12px' }}>
              {anim.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: '1rem' }}>All Animations (left - mirrored)</h2>
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        {animations.map((anim) => (
          <div key={anim} style={{ textAlign: 'center' }}>
            <PixelcutKratos animation={anim} direction="left" scale={1} />
            <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '12px' }}>
              {anim.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
