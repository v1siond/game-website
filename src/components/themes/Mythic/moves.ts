'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SpriteMotion } from './sprite'

// Plays one of his moves and returns him to his rest motion when it ends. Each play is a new take: the
// caller keys the sprite on it, so the same one shot move can be thrown again and restarts from its first
// frame. The lengths are the cycle lengths in sprite.module.css; the drum hit loops there, so its play is
// two hits long.

const MOVE_MS: Record<Exclude<SpriteMotion, 'still' | 'idle' | 'walk'>, number> = {
  action: 1600,
  roar: 1300,
  knee: 750,
  elbow: 700,
  kick: 850,
}

const ACTION_MS: Record<Profession, number> = {
  engineer: 1600,
  drummer: 1280,
  fighter: 2100,
}

export type Move = keyof typeof MOVE_MS

export const moveLength = (move: Move, profession: Profession): number =>
  move === 'action' ? ACTION_MS[profession] : MOVE_MS[move]

export function useMove(profession: Profession, rest: SpriteMotion = 'idle') {
  const [playing, setPlaying] = useState<{ move: Move; take: number } | null>(null)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const play = useCallback(
    (move: Move) => {
      window.clearTimeout(timer.current)
      setPlaying((current) => ({ move, take: (current?.take ?? 0) + 1 }))
      timer.current = window.setTimeout(() => setPlaying(null), moveLength(move, profession))
    },
    [profession],
  )

  return { motion: playing?.move ?? rest, take: playing?.take ?? 0, playing: playing !== null, play }
}
