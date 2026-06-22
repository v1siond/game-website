'use client'

import { memo, useState, useEffect } from 'react'

/**
 * PIXELCUT KRATOS SVG - Vector Sprite Animation
 * ==============================================
 * Uses SVG sprites with transparent backgrounds.
 * Crisp at any scale, no pixelation.
 */

type AnimationType = 'idle' | 'walk' | 'attack' | 'jump' | 'run'

interface PixelcutKratosSVGProps {
  animation?: AnimationType
  direction?: 'left' | 'right'
  scale?: number
  frameRate?: number
  className?: string
  style?: React.CSSProperties
}

const FRAME_COUNT = 4

const DEFAULT_FRAME_RATES: Record<AnimationType, number> = {
  idle: 400,
  walk: 150,
  attack: 100,
  jump: 150,
  run: 100,
}

// Base dimensions from SVG viewBox
const BASE_WIDTH = 170
const BASE_HEIGHT = 307

function PixelcutKratosSVGComponent({
  animation = 'idle',
  direction = 'right',
  scale = 1,
  frameRate,
  className = '',
  style = {},
}: PixelcutKratosSVGProps) {
  const [frame, setFrame] = useState(0)

  const actualFrameRate = frameRate ?? DEFAULT_FRAME_RATES[animation]

  useEffect(() => {
    setFrame(0)
  }, [animation])

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAME_COUNT)
    }, actualFrameRate)

    return () => clearInterval(interval)
  }, [actualFrameRate])

  const basePath = direction === 'left'
    ? '/sprites/kratos-svg/left'
    : '/sprites/kratos-svg'

  const spriteSrc = `${basePath}/${animation}_${frame}.svg`

  return (
    <div
      className={className}
      style={{
        width: BASE_WIDTH * scale,
        height: BASE_HEIGHT * scale,
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
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export const PixelcutKratosSVG = memo(PixelcutKratosSVGComponent)

/**
 * Demo comparing PNG vs SVG sprites
 */
export function SVGvsPNGDemo() {
  const [animation, setAnimation] = useState<AnimationType>('idle')

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>SVG vs PNG Sprite Comparison</h1>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        {(['idle', 'walk', 'run', 'attack', 'jump'] as AnimationType[]).map((anim) => (
          <button
            key={anim}
            onClick={() => setAnimation(anim)}
            style={{
              padding: '0.5rem 1rem',
              background: animation === anim ? '#4a9eff' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {anim}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <div>
          <h2>SVG (Vector - Transparent BG)</h2>
          <div style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            padding: '1rem',
            borderRadius: '8px',
            display: 'inline-block',
          }}>
            <PixelcutKratosSVG animation={animation} scale={0.5} />
          </div>
          <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>
            Clean edges, any background
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Scale Comparison (SVG)</h2>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <PixelcutKratosSVG animation={animation} scale={0.25} />
            <p style={{ fontSize: '12px', opacity: 0.7 }}>0.25x</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <PixelcutKratosSVG animation={animation} scale={0.5} />
            <p style={{ fontSize: '12px', opacity: 0.7 }}>0.5x</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <PixelcutKratosSVG animation={animation} scale={1} />
            <p style={{ fontSize: '12px', opacity: 0.7 }}>1x</p>
          </div>
        </div>
      </div>
    </div>
  )
}
