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
import { Gem, MaskFace, type GemTone } from './pickups'
import { useScore } from './score'
import boss from './bossRound.module.css'
import ui from './warped.module.css'

// Muay Thai as a boss round (the time travel platformer's boss fights, Warped, named in code only), on
// the great wall era: him in his fight gear and guard on one side, the game's time foe (the clock in his
// chest, the gold horned headpiece, the green lens, the tuning fork staff) with a health bar on the
// other, one bar segment per title. Spin kick plays his roundhouse, the foe staggers back, a segment
// drops, and the next title's power unlocks the way a boss in the game hands over a new move: body slam,
// double jump, tornado spin, in that order. When the last segment goes the foe warps out (squeezed thin
// and gone, the way he leaves at the end of each boss) and a mask drops where he stood.
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
  return 'guard'
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

/** The time foe: a lanky villain with a clock set in his chest, a gold horned headpiece, a green lens over
 * one eye and a tuning fork staff. A kick makes him stagger; beaten, he warps out and leaves a mask. */
function TimeFoe({ hit, beaten }: { hit: boolean; beaten: boolean }) {
  return (
    <span className={`relative block h-full w-full ${boss.foe}`} data-hit={hit || undefined} data-beaten={beaten || undefined}>
      <svg viewBox="0 0 80 120" className={`h-full w-full ${boss.body}`} aria-hidden="true" focusable="false">
        <path d="M66 112 V20" stroke={PORTAL.METAL_DARK} strokeWidth="3" />
        <path d="M60 22 V6 M72 22 V6 M60 22 Q66 30 72 22" fill="none" stroke={PORTAL.METAL} strokeWidth="3" strokeLinecap="round" />
        <path d="M32 116 L30 84 M46 116 L48 84" stroke={PORTAL.CRYSTAL_DEEP} strokeWidth="7" strokeLinecap="round" />
        <path d="M26 118 h10 M44 118 h10" stroke={PORTAL.VOID} strokeWidth="5" strokeLinecap="round" />
        <path d="M22 44 Q40 36 58 44 L54 88 H26 Z" fill={PORTAL.CRYSTAL_DEEP} stroke={PORTAL.VOID} strokeWidth="2" />
        <path d="M26 44 L40 90 L54 44" fill="none" stroke={PORTAL.GOLD} strokeWidth="2" />
        <circle cx="40" cy="60" r="10" fill={PORTAL.WHITE} stroke={PORTAL.GOLD} strokeWidth="3" />
        <path d="M40 60 V53 M40 60 L45 63" stroke={PORTAL.VOID} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 48 Q14 60 18 72 L62 60" fill="none" stroke={PORTAL.CRYSTAL_DEEP} strokeWidth="6" strokeLinecap="round" />
        <path d="M56 48 Q64 56 64 66" fill="none" stroke={PORTAL.CRYSTAL_DEEP} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="40" cy="30" rx="11" ry="13" fill="#7fae9a" stroke={PORTAL.VOID} strokeWidth="2" />
        <path d="M28 22 Q40 10 52 22 L56 8 L48 16 Q40 6 32 16 L24 8 Z" fill={PORTAL.GOLD} stroke={PORTAL.VOID} strokeWidth="1.6" />
        <circle cx="45" cy="29" r="5" fill={PORTAL.GREEN} stroke={PORTAL.METAL_DARK} strokeWidth="2" />
        <circle cx="35" cy="29" r="2" fill={PORTAL.VOID} />
        <path d="M34 38 Q40 42 46 38" fill="none" stroke={PORTAL.VOID} strokeWidth="1.6" />
      </svg>
      {beaten && (
        <span className={`absolute bottom-0 left-1/4 block h-1/3 w-1/2 ${boss.leftMask}`}>
          <MaskFace className="h-full w-full" />
        </span>
      )}
    </span>
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
            <TimeFoe hit={kicking} beaten={beaten} />
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
