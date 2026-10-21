'use client'

import { useEffect, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { VaultSprite, type SpriteMotion } from './sprite'
import cel from './cel.module.css'

// The digistruct: how the wasteland's stations print a body. Him cut into eight horizontal slices that
// fly in from alternate sides, bottom first, under a climbing scan line, then the slices give way to
// the one live sprite. `build` is a counter: each new value plays the build again (a profession pick,
// a respawn), 0 shows him whole without one, so nothing builds on page load.

const SLICES = Array.from({ length: 8 }, (_, index) => index)
const BUILD_MS = 1100

interface DigistructProps {
  profession: Profession
  build: number
  motion?: SpriteMotion
  className?: string
}

export function Digistruct({ profession, build, motion = 'idle', className = '' }: DigistructProps) {
  const [building, setBuilding] = useState(0)

  useEffect(() => {
    if (build === 0) return
    setBuilding(build)
    const done = window.setTimeout(() => setBuilding(0), BUILD_MS)
    return () => window.clearTimeout(done)
  }, [build])

  if (building === 0) return <VaultSprite profession={profession} motion={motion} className={className} />

  return (
    <div key={building} data-play className={`relative ${cel.digi} ${cel.digiBox} ${className}`}>
      {SLICES.map((index) => (
        <div key={index} className={`absolute inset-0 ${cel.slice}`} style={{ ['--i' as string]: index }}>
          <VaultSprite profession={profession} motion="still" className="h-full w-full" />
        </div>
      ))}
      <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-[var(--cel-holo)] ${cel.scan}`} />
    </div>
  )
}
