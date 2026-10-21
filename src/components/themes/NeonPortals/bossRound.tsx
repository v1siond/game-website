'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { fillLabel } from '@/lib/cv/labels'
import type { SectionsOf } from '@/lib/cv/cvView'
import { Bandicoot, type BandicootPose } from './bandicoot'
import { Blast } from './burst'
import { PORTAL } from './palette'
import { Gem, type GemTone } from './pickups'
import { useScore } from './score'
import boss from './bossRound.module.css'
import ui from './warped.module.css'

// Muay Thai as a boss round (the time travel platformer's boss fights, Warped, named in code only): him
// in his fight gear on one side, a carved totem boss with a health bar on the other, one bar segment
// per title. Spin kick plays his spinning roundhouse, the totem flashes and shakes, a segment drops, and
// the next title's power unlocks the way a boss in the game hands over a new move: body slam, double
// jump, tornado spin, in that order. When the last segment goes the totem crumbles and leaves a mask.
// The titles are always readable in the list below the arena; each one carries its power, shown locked
// until its kick lands (text and gem together, so the state never rests on colour). Reduced motion
// lands each kick with no movement, a preview shows the boss beaten.

const POWER_KEYS = ['bodySlam', 'doubleJump', 'tornadoSpin'] as const
const POWER_GEMS: readonly GemTone[] = ['blue', 'green', 'red']
const KICK_MS = 900

/** His pose in the arena: the kick while it plays, the dance once the boss is down, else his guard. */
const fighterPose = (kicking: boolean, beaten: boolean): BandicootPose => {
  if (kicking) return 'act'
  if (beaten) return 'dance'
  return 'idle'
}

function useBoss(achievements: readonly string[]) {
  const { offer, take, has, addMask } = useScore()
  const preview = usePreview()
  const [kicking, setKicking] = useState(false)
  const landed = achievements.filter((achievement) => has('powers', achievement)).length
  const beaten = preview || landed >= achievements.length

  useEffect(() => {
    achievements.forEach((achievement) => offer('powers', achievement))
  }, [achievements, offer])

  useEffect(() => {
    if (!kicking) return
    const timer = window.setTimeout(() => setKicking(false), KICK_MS)
    return () => window.clearTimeout(timer)
  }, [kicking])

  useEffect(() => {
    if (landed > 0 && landed >= achievements.length) addMask('boss')
  }, [landed, achievements.length, addMask])

  const kick = () => {
    const next = achievements.find((achievement) => !has('powers', achievement))
    if (!next) return
    take('powers', next)
    if (!prefersReducedMotion()) setKicking(true)
  }

  return { kicking, landed: preview ? achievements.length : landed, beaten, kick }
}

function Totem({ hit, beaten }: { hit: boolean; beaten: boolean }) {
  return (
    <svg viewBox="0 0 80 120" className={`h-full w-full ${boss.totem}`} data-hit={hit || undefined} data-beaten={beaten || undefined} aria-hidden="true" focusable="false">
      {[0, 1, 2].map((tier) => {
        const y = 8 + tier * 36
        return (
          <g key={tier} className={boss.tier} style={{ '--i': tier } as CSSProperties}>
            <rect x="10" y={y} width="60" height="34" rx="6" fill={tier === 1 ? PORTAL.MASK_LIT : PORTAL.MASK_WOOD} stroke={PORTAL.VOID} strokeWidth="2" />
            <ellipse cx="28" cy={y + 13} rx="6" ry="5" fill={PORTAL.WHITE} stroke={PORTAL.VOID} strokeWidth="1.4" />
            <ellipse cx="52" cy={y + 13} rx="6" ry="5" fill={PORTAL.WHITE} stroke={PORTAL.VOID} strokeWidth="1.4" />
            <circle cx="28" cy={y + 14} r="2.4" fill={tier === 0 ? PORTAL.FRUIT_RED : PORTAL.VOID} />
            <circle cx="52" cy={y + 14} r="2.4" fill={tier === 0 ? PORTAL.FRUIT_RED : PORTAL.VOID} />
            <path d={`M22 ${y + 24} Q40 ${y + 32} 58 ${y + 24} L56 ${y + 28} Q40 ${y + 34} 24 ${y + 28} Z`} fill={PORTAL.MASK_DARK} />
            <path d={`M26 ${y + 25} H54`} stroke={PORTAL.TOOTH} strokeWidth="2" strokeDasharray="3 2" />
          </g>
        )
      })}
      <path d="M4 8 L14 -2 M76 8 L66 -2 M40 6 V-4" stroke={PORTAL.GREEN} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function HealthBar({ left, total }: { left: number; total: number }) {
  const { warp } = useLabels()
  return (
    <p className="flex items-center gap-2">
      <span className="flex gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`block h-4 w-8 rounded-sm border-2 border-[color:var(--np-void)] ${i < left ? 'bg-[color:var(--np-tnt)]' : 'bg-[color:var(--np-seam)]'}`} />
        ))}
      </span>
      <span className={`text-base tabular-nums text-[color:var(--np-white)] ${ui.chunk}`} aria-hidden="true">
        {left}/{total}
      </span>
      <span className="sr-only">{fillLabel(warp.bossHealth, { left, total })}</span>
    </p>
  )
}

function PowerLine({ achievement, index, unlocked }: { achievement: string; index: number; unlocked: boolean }) {
  const { warp } = useLabels()
  const power = warp[POWER_KEYS[index % POWER_KEYS.length]]

  return (
    <span className={`flex items-center gap-4 ${ui.rise}`} style={{ '--i': index } as CSSProperties}>
      <span className={`block h-12 w-10 shrink-0 ${unlocked ? boss.gemOn : 'opacity-40'}`} aria-hidden="true">
        <Gem className="h-full w-full" tone={POWER_GEMS[index % POWER_GEMS.length]} />
      </span>
      <span className={`block flex-1 px-4 py-3 ${ui.panel}`}>
        <span className="block text-base text-[color:var(--np-white)]">{achievement}</span>
        <span className={`mt-1 block text-sm uppercase tracking-wide ${ui.chunk} ${unlocked ? 'text-[color:var(--np-gold)]' : 'text-[color:var(--np-muted)]'}`}>
          {unlocked ? fillLabel(warp.powerUnlocked, { power }) : power}
        </span>
      </span>
    </span>
  )
}

export function BossRound({ martialArts }: { martialArts: SectionsOf<'fighter'>['martialArts'] }) {
  const { warp } = useLabels()
  const { achievements } = martialArts.primary
  const { kicking, landed, beaten, kick } = useBoss(achievements)
  const total = achievements.length

  return (
    <>
      <div className={`relative mb-8 overflow-hidden p-5 ${ui.panel} ${boss.arena}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <HealthBar left={total - landed} total={total} />
          <button type="button" onClick={kick} disabled={beaten} className={`${ui.button} ${ui.lit}`}>
            {warp.kick}
          </button>
        </div>
        <div className="relative mt-4 flex h-56 items-end justify-around sm:h-64" aria-hidden="true">
          <span className={`relative block h-[88%] w-[22%] max-w-[9rem] ${kicking ? boss.lunge : ''}`}>
            <Bandicoot profession="fighter" pose={fighterPose(kicking, beaten)} className="h-full w-full" />
          </span>
          <span className="relative block h-full w-[22%] max-w-[9rem]">
            {kicking && <Blast tone="tnt" />}
            <Totem hit={kicking} beaten={beaten} />
          </span>
        </div>
        <p className="mt-3 text-base text-[color:var(--np-muted)]">{warp.bossHint}</p>
      </div>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-8 grid gap-4 sm:grid-cols-2',
          fact: `${ui.panel} p-4`,
          term: 'text-sm font-black uppercase tracking-wide text-[color:var(--np-gold)]',
          value: 'mt-1 text-base text-[color:var(--np-white)]',
          achievements: 'space-y-4',
        }}
        renderAchievement={(achievement) => {
          const index = achievements.indexOf(achievement)
          return <PowerLine achievement={achievement} index={index} unlocked={index < landed} />
        }}
      />
    </>
  )
}
