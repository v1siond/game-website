'use client'

import { useEffect, useRef, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLabels } from '@/components/cv/CVDataProvider'
import { PIXEL, RPG } from './palette'
import { Soul, SoulHalves } from './soul'
import world from './world.module.css'

// The bullet box: the game's dodging turn, played by the visitor above each profession's main list. Each
// profession plays one of the game's soul modes, in its own box shape:
// - System Engineer, the red free mode: the heart follows the pointer (or a finger) anywhere in the box,
//   white pellets fall as code rain in columns at their own speeds.
// - Musician, the purple line mode: the heart rides three strings, the pointer picks the string and the
//   place on it; purple pellets run along the strings and hop forward on every beat.
// - Martial Artist, the green shield mode: the heart stays in the middle, a green shield turns to the side
//   the pointer is on, and strikes fly in from the four sides; one that reaches an unguarded side hits.
//
// A hit costs 4 of 20 HP: the box shakes and the heart flickers for its invincible second. At 0 HP the
// heart splits in two, then the HP refills and the turn goes on. The HP line under the box shows the bar
// with its number.
//
// Pattern: one requestAnimationFrame loop, only while the box is on screen, writes --x, --y and --r on
// the pellets, the heart and the shield (transform only, no React render per frame). Pellet positions
// are pure functions of time; the loop keeps only the HP, the invincible timer and, for the shield mode,
// each strike's last progress to see it arrive. React renders only on a hit and on the recovery.
// Reduced motion shows the first frame, still, with the heart in the middle.

const PELLETS = 10
const HEART = 16
const PELLET = 8
const HIT_RADIUS = 10
const HURT_MS = 1000
const BROKEN_MS = 1400
const MAX_HP = 20
const HIT_COST = 4
const BEAT_MS = 500
const STRINGS = 3
const SIDES = 4

type Point = { x: number; y: number }
type Side = 0 | 1 | 2 | 3 // up, right, down, left

const wrap = (value: number, size: number) => ((value % size) + size) % size
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const stringY = (row: number, h: number) => ((row + 1) / (STRINGS + 1)) * h

// Where a strike of the shield mode is, at progress p (0 at its edge, 1 at the heart), on its side.
const STRIKE_FROM: Record<Side, (p: number, w: number, h: number) => Point> = {
  0: (p, w, h) => ({ x: w / 2, y: (h / 2) * p }),
  1: (p, w, h) => ({ x: w - (w / 2) * p, y: h / 2 }),
  2: (p, w, h) => ({ x: w / 2, y: h - (h / 2) * p }),
  3: (p, w, h) => ({ x: (w / 2) * p, y: h / 2 }),
}

const strikeProgress = (i: number, t: number) => wrap(t * 0.00045 + i * 0.37, 1)

interface Mode {
  /** Each pellet's place at time t (ms) in a w by h box. */
  pellet: (i: number, t: number, w: number, h: number) => Point
  /** Where the heart goes for a pointer at p. */
  soul: (p: Point, w: number, h: number) => Point
  box: string
  pelletClass: string
  soulColor: string
}

const MODES: Record<Profession, Mode> = {
  engineer: {
    pellet: (i, t, w, h) => ({
      x: ((i + 0.5) / PELLETS) * w,
      y: wrap(t * (0.06 + (i % 3) * 0.025) + i * 37, h + 40) - 20,
    }),
    soul: (p, w, h) => ({ x: clamp(p.x, HEART / 2, w - HEART / 2), y: clamp(p.y, HEART / 2, h - HEART / 2) }),
    box: 'h-44 max-w-sm sm:h-52',
    pelletClass: 'bg-[color:var(--rpg-pellet)]',
    soulColor: RPG.soul,
  },
  drummer: {
    pellet: (i, t, w, h) => {
      const row = i % STRINGS
      const dir = row % 2 === 0 ? 1 : -1
      const travel = wrap(t * 0.05 + Math.floor(t / BEAT_MS) * 24 + i * 83, w + 40) - 20
      return { x: dir === 1 ? travel : w - travel, y: stringY(row, h) }
    },
    soul: (p, w, h) => {
      const row = clamp(Math.round((p.y / h) * (STRINGS + 1)) - 1, 0, STRINGS - 1)
      return { x: clamp(p.x, HEART / 2, w - HEART / 2), y: stringY(row, h) }
    },
    box: 'h-36 max-w-lg sm:h-40',
    pelletClass: 'rounded-full bg-[color:var(--rpg-purple)]',
    soulColor: RPG.purple,
  },
  fighter: {
    pellet: (i, t, w, h) => STRIKE_FROM[(i % SIDES) as Side](strikeProgress(i, t), w, h),
    soul: (_p, w, h) => ({ x: w / 2, y: h / 2 }),
    box: 'h-48 max-w-[12rem] sm:h-56 sm:max-w-[14rem]',
    pelletClass: 'bg-[color:var(--rpg-gold)]',
    soulColor: RPG.green,
  },
}

/** The side of the box's middle the pointer is on. */
const sideOf = (p: Point, w: number, h: number): Side => {
  const dx = (p.x - w / 2) / w
  const dy = (p.y - h / 2) / h
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 1 : 3
  return dy > 0 ? 2 : 0
}

const SHIELD_REACH = 14

const place = (el: HTMLElement | null, { x, y }: Point, size: number, turn = 0) => {
  el?.style.setProperty('--x', `${x - size / 2}px`)
  el?.style.setProperty('--y', `${y - size / 2}px`)
  el?.style.setProperty('--r', `${turn}deg`)
}

const SHIELD_AT: Record<Side, (w: number, h: number) => Point> = {
  0: (w, h) => ({ x: w / 2, y: h / 2 - SHIELD_REACH }),
  1: (w, h) => ({ x: w / 2 + SHIELD_REACH, y: h / 2 }),
  2: (w, h) => ({ x: w / 2, y: h / 2 + SHIELD_REACH }),
  3: (w, h) => ({ x: w / 2 - SHIELD_REACH, y: h / 2 }),
}

const SHIELD_SIZE = 20

// The drawn strings, at the heights stringY gives for three strings.
const STRING_TOPS = ['top-1/4', 'top-1/2', 'top-3/4']

export function BulletBox({ profession }: { profession: Profession }) {
  const { ref: watch, inView } = useSectionTrigger({ threshold: 0, triggerOnce: false })
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const heart = useRef<HTMLDivElement>(null)
  const shield = useRef<HTMLSpanElement>(null)
  const pellets = useRef<(HTMLSpanElement | null)[]>([])
  const pointer = useRef<Point | null>(null)
  const life = useRef(MAX_HP)
  const [hp, setHp] = useState(MAX_HP)
  const [hurt, setHurt] = useState(false)
  const broken = hp === 0
  const mode = MODES[profession]
  const { hud } = useLabels()

  useEffect(() => {
    const el = box.current
    if (!el) return
    const { width: w, height: h } = el.getBoundingClientRect()
    pointer.current = { x: w / 2, y: h / 2 }
    const soulAt = () => mode.soul(pointer.current ?? { x: w / 2, y: h / 2 }, w, h)
    const guard = () => sideOf(pointer.current ?? { x: w / 2, y: 0 }, w, h)
    const drawShield = () => {
      const side = guard()
      place(shield.current, SHIELD_AT[side](w, h), SHIELD_SIZE, side * 90)
    }

    place(heart.current, soulAt(), HEART)
    drawShield()
    pellets.current.forEach((p, i) => place(p, mode.pellet(i, 0, w, h), PELLET))
    if (reduced || !inView) return

    let frame = 0
    let safeUntil = 0
    // A split heart left by an earlier run of the loop recovers on the first frame.
    let flickering = life.current === 0
    const last = new Array<number>(PELLETS).fill(0)
    const start = performance.now()

    // A hit takes HP and starts the invincible flicker; the last one splits the heart until the refill.
    const landed = (now: number) => {
      life.current = Math.max(life.current - HIT_COST, 0)
      safeUntil = now + (life.current === 0 ? BROKEN_MS : HURT_MS)
      flickering = true
      setHp(life.current)
      setHurt(true)
    }

    const recover = (now: number) => {
      if (!flickering || now <= safeUntil) return
      flickering = false
      setHurt(false)
      if (life.current > 0) return
      life.current = MAX_HP
      setHp(MAX_HP)
    }

    // The shield mode hits on arrival at an unguarded side; the other modes hit on touch.
    const check: (i: number, t: number, at: Point, now: number) => void =
      profession === 'fighter'
        ? (i, t, _at, now) => {
            const p = strikeProgress(i, t)
            const arrived = p < last[i]
            last[i] = p
            if (arrived && now > safeUntil && guard() !== i % SIDES) landed(now)
          }
        : (_i, _t, at, now) => {
            const soul = soulAt()
            if (now > safeUntil && Math.hypot(at.x - soul.x, at.y - soul.y) < HIT_RADIUS) landed(now)
          }

    const tick = (now: number) => {
      const t = now - start
      recover(now)
      place(heart.current, soulAt(), HEART)
      drawShield()
      pellets.current.forEach((p, i) => {
        const at = mode.pellet(i, t, w, h)
        place(p, at, PELLET)
        check(i, t, at, now)
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [profession, mode, inView, reduced])

  const follow = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  return (
    <div ref={watch} className="mx-auto mb-10 w-full" aria-hidden="true">
      <div
        key={profession}
        ref={box}
        data-hit={hurt}
        onPointerMove={follow}
        onPointerDown={follow}
        className={`relative mx-auto w-full cursor-none touch-none overflow-hidden ${mode.box} ${world.box} ${world.resize} ${world.hitBox}`}
      >
        {profession === 'drummer' &&
          STRING_TOPS.map((top) => <span key={top} className={`absolute inset-x-0 h-px bg-[color:var(--rpg-purple)] opacity-60 ${top}`} />)}
        {Array.from({ length: PELLETS }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              pellets.current[i] = el
            }}
            className={`absolute left-0 top-0 h-2 w-2 ${mode.pelletClass} ${world.placed}`}
          />
        ))}
        {profession === 'fighter' && <span ref={shield} className={`absolute left-0 top-0 h-5 w-5 border-t-4 border-[color:var(--rpg-green)] ${world.placed}`} />}
        <div ref={heart} className={`absolute left-0 top-0 h-4 w-4 ${world.placed}`}>
          {broken ? (
            <SoulHalves className="h-4 w-4" color={mode.soulColor} leftClass={world.splitLeft} rightClass={world.splitRight} />
          ) : (
            <Soul className={`h-4 w-4 ${world.hurt}`} color={mode.soulColor} />
          )}
        </div>
      </div>

      <div className={`mx-auto mt-3 flex w-full items-center justify-center gap-3 text-sm text-[color:var(--rpg-text)] ${PIXEL}`}>
        <span>{hud.hp}</span>
        <span className="relative h-4 w-24 bg-[color:var(--rpg-hp-back)]">
          <span className={`absolute inset-0 origin-left bg-[color:var(--rpg-gold)] ${world.hpFill}`} style={{ '--hp': hp / MAX_HP } as React.CSSProperties} />
        </span>
        <span className="tabular-nums">
          {hp} / {MAX_HP}
        </span>
      </div>
    </div>
  )
}
