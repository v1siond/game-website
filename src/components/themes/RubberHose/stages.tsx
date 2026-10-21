'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PieEyes } from './art'
import { HeroCharacter, type HeroPose } from './cup'
import { HOSE } from './palette'
import world from './world.module.css'
import stage from './stage.module.css'

// What he does in each section, every one a different move of the game. Each plays once, when its isle
// stage first comes into view (the `on` from IsleStage), then holds its last drawing and breathes; under
// reduced motion `on` is true from the start and the scene shows its end drawing at once.
// - FlowerKnockout (about): a pie eyed flower boss rises, he finger guns it three times, it flinches on each
//   hit, goes down with a star burst, and the about text unfolds from behind it.
// - ShopCounter (tech stack): he drops a coin on the shop counter, the till rings and every item lifts off
//   the shelf one after another; hovering or focusing an item lifts it again.
// - StageCurtains (ventures): the theatre curtains part over the posters, the footlights warm up, he bows.
// - Bandstand (bands): he drums on a little bandstand while the pie eyed bass drum bounces on the beat.
// - BagFoe (muay thai): he jabs a pie eyed heavy bag, it swings back, snaps its chain and drops.
// - MapRun (between sections): a strip of the isle map, two islands and a plank bridge, that he runs across
//   as the page scrolls (the shared ScrollScene's --scene-progress, no React render per frame).

// A fixed sequence of drawings, each held for its time after `on`; the scene ends on the last one.
function useBeats<Beat extends string>(on: boolean, beats: readonly (readonly [Beat, number])[]) {
  const [beat, setBeat] = useState<Beat>(beats[0][0])
  useEffect(() => {
    if (!on) return
    const timers = beats.map(([name, at]) => setTimeout(() => setBeat(name), at))
    return () => timers.forEach(clearTimeout)
  }, [on, beats])
  return beat
}

const KO_BEATS = [
  ['wait', 0],
  ['rise', 100],
  ['shoot', 700],
  ['hit', 1000],
  ['shoot2', 1300],
  ['hit2', 1600],
  ['down', 2100],
  ['open', 2600],
] as const
type KoBeat = (typeof KO_BEATS)[number][0]

const KO_POSE: Record<KoBeat, HeroPose> = {
  wait: 'idle',
  rise: 'idle',
  shoot: 'shoot',
  hit: 'shoot',
  shoot2: 'shoot',
  hit2: 'shoot',
  down: 'cheer',
  open: 'idle',
}

const REDUCED_END = [['open', 0]] as const

export function FlowerKnockout({ on, reduced, profession, children }: { on: boolean; reduced: boolean; profession: Profession; children: ReactNode }) {
  const beat = useBeats<KoBeat>(on, reduced ? REDUCED_END : KO_BEATS)
  const opened = beat === 'open'

  return (
    <div className={stage.ko} data-beat={beat}>
      <div className="relative mx-auto flex h-36 max-w-md items-end justify-between px-4" aria-hidden="true">
        <div className="h-32 w-20">
          <HeroCharacter profession={profession} pose={KO_POSE[beat]} className="h-full w-full" />
        </div>
        <svg viewBox="0 0 80 110" className={`h-32 w-24 ${world.inked} ${stage.boss}`} focusable="false">
          <path d="M40 60 Q36 84 40 110" fill="none" stroke={HOSE.meadowDark} strokeWidth={5} />
          <path d="M40 92 Q20 78 10 88 Q24 100 40 96 M40 86 Q60 72 70 82 Q56 94 40 90" fill={HOSE.meadow} stroke={HOSE.ink} strokeWidth={2} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx={40} cy={18} rx={9} ry={15} fill={HOSE.orange} stroke={HOSE.ink} strokeWidth={2} transform={`rotate(${a} 40 36)`} />
          ))}
          <circle cx={40} cy={36} r={16} fill={HOSE.gold} stroke={HOSE.ink} strokeWidth={2.4} />
          <g className={stage.bossAngry}>
            <PieEyes cx={40} cy={33} size={18} paper={HOSE.gold} />
            <path d="M31 25 L37 28 M49 25 L43 28" stroke={HOSE.ink} strokeWidth={2} strokeLinecap="round" />
            <path d="M32 43 Q40 38 48 43" fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={1.8} />
          </g>
          <g className={stage.bossOut}>
            <path d="M31 28 l6 6 m0 -6 l-6 6 M43 28 l6 6 m0 -6 l-6 6" stroke={HOSE.ink} strokeWidth={2} strokeLinecap="round" />
            <path d="M33 44 Q40 40 47 44" fill="none" stroke={HOSE.ink} strokeWidth={1.8} />
          </g>
        </svg>
        <svg viewBox="0 0 60 60" className={`absolute right-6 top-0 h-20 w-20 ${stage.koStar}`} focusable="false">
          <path d="M30 0 L37 20 L58 16 L42 31 L56 50 L34 42 L26 60 L22 40 L2 44 L16 28 L4 10 L24 18 Z" fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={2} strokeLinejoin="round" />
        </svg>
      </div>
      <div className={`${stage.unfold} ${opened ? stage.unfoldOpen : ''}`}>{children}</div>
    </div>
  )
}

const SHOP_BEATS = [
  ['wait', 0],
  ['coin', 200],
  ['ring', 800],
  ['lift', 1100],
] as const
type ShopBeat = (typeof SHOP_BEATS)[number][0]
const SHOP_END = [['lift', 0]] as const

export function ShopCounter({ on, reduced, profession, children }: { on: boolean; reduced: boolean; profession: Profession; children: ReactNode }) {
  const beat = useBeats<ShopBeat>(on, reduced ? SHOP_END : SHOP_BEATS)

  return (
    <div className={`relative ${stage.shop}`} data-beat={beat}>
      <div className="relative flex h-28 items-end gap-4 px-4" aria-hidden="true">
        <div className="h-28 w-16 shrink-0">
          <HeroCharacter profession={profession} pose={beat === 'lift' ? 'cheer' : 'idle'} className="h-full w-full" />
        </div>
        <svg viewBox="0 0 40 40" className={`absolute left-20 top-0 h-8 w-8 ${stage.coin}`} focusable="false">
          <circle cx={20} cy={20} r={16} fill={HOSE.gold} stroke={HOSE.ink} strokeWidth={2.4} />
          <path d="M20 10 V30 M15 14 H23 Q26 14 26 18 Q26 21 20 21 Q14 21 14 25 Q14 28 18 28 H25" fill="none" stroke={HOSE.ink} strokeWidth={2} />
        </svg>
        <svg viewBox="0 0 60 50" className={`h-14 w-16 shrink-0 ${world.inked} ${stage.till}`} focusable="false">
          <rect x={4} y={14} width={52} height={34} rx={4} fill={HOSE.red} stroke={HOSE.ink} strokeWidth={2.4} />
          <rect x={14} y={4} width={32} height={14} rx={2} fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={2} />
          <PieEyes cx={30} cy={28} size={16} paper={HOSE.red} />
          <path d="M22 38 Q30 44 38 38" fill="none" stroke={HOSE.ink} strokeWidth={2} />
        </svg>
      </div>
      <div className={`h-3 rounded-sm bg-[var(--hose-shadowDark)] ${world.inked}`} aria-hidden="true" />
      <div className={`p-4 sm:p-6 ${world.poster} ${world.posterWide} ${stage.shelf}`}>{children}</div>
    </div>
  )
}

export function StageCurtains({ on, profession, children }: { on: boolean; profession: Profession; children: ReactNode }) {
  return (
    <div className={`relative overflow-clip px-2 pb-10 pt-4 ${stage.theatre}`} data-open={on || undefined}>
      {children}
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 ${stage.curtain} ${stage.curtainLeft}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-1/2 ${stage.curtain} ${stage.curtainRight}`} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-8 items-center justify-around" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-3 w-6 rounded-t-full bg-[var(--hose-gold)] ${stage.footlight}`} />
        ))}
      </div>
      <div className={`pointer-events-none absolute -bottom-1 right-2 h-24 w-14 ${stage.bow}`} aria-hidden="true">
        <HeroCharacter profession={profession} pose="cheer" className="h-full w-full" />
      </div>
    </div>
  )
}

export function Bandstand({ profession }: { profession: Profession }) {
  return (
    <div className="mx-auto mb-6 flex h-32 max-w-sm items-end justify-center gap-1" aria-hidden="true">
      <div className="h-32 w-20">
        <HeroCharacter profession={profession} pose="drum" className="h-full w-full" />
      </div>
      <svg viewBox="0 0 60 60" className={`h-20 w-20 ${world.inked} ${stage.bassDrum}`} focusable="false">
        <ellipse cx={30} cy={30} rx={26} ry={26} fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={3} />
        <ellipse cx={30} cy={30} rx={20} ry={20} fill="none" stroke={HOSE.red} strokeWidth={3} />
        <PieEyes cx={30} cy={27} size={20} paper={HOSE.highlight} />
        <path d="M21 37 Q30 45 39 37" fill={HOSE.red} stroke={HOSE.ink} strokeWidth={2} />
      </svg>
    </div>
  )
}

export function BagFoe({ on, profession }: { on: boolean; profession: Profession }) {
  return (
    <div className={`relative mx-auto mb-4 flex h-32 max-w-xs items-end justify-center gap-0 ${stage.bagScene}`} data-on={on || undefined} aria-hidden="true">
      <div className="h-32 w-20">
        <HeroCharacter profession={profession} pose={on ? 'jab' : 'idle'} className="h-full w-full" />
      </div>
      <svg viewBox="0 0 40 120" className={`h-32 w-12 ${world.inked} ${stage.bag}`} focusable="false">
        <path d="M20 0 V24" stroke={HOSE.ink} strokeWidth={2} strokeDasharray="3 2" />
        <rect x={6} y={24} width={28} height={80} rx={12} fill={HOSE.red} stroke={HOSE.ink} strokeWidth={2.6} />
        <rect x={6} y={40} width={28} height={6} fill={HOSE.redDark} />
        <PieEyes cx={20} cy={60} size={18} paper={HOSE.red} />
        <path d="M14 74 Q20 70 26 74" fill="none" stroke={HOSE.ink} strokeWidth={2} />
      </svg>
    </div>
  )
}

export function MapRun({ profession }: { profession: Profession }) {
  return (
    <div className="relative mx-auto my-6 h-24 max-w-4xl" aria-hidden="true">
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${world.inked}`} focusable="false">
        <rect width={400} height={60} fill="#7fa6bf" opacity={0.6} rx={6} />
        <path d="M0 40 Q30 18 90 22 Q140 24 150 44 L150 54 Q80 60 0 54 Z" fill={HOSE.meadow} stroke={HOSE.ink} strokeWidth={2} />
        <path d="M250 44 Q262 22 320 20 Q380 20 400 36 V54 Q330 60 250 54 Z" fill={HOSE.meadow} stroke={HOSE.ink} strokeWidth={2} />
        <path d="M146 40 Q200 50 254 40" fill="none" stroke={HOSE.shadowDark} strokeWidth={6} />
        {[160, 175, 190, 205, 220, 235].map((x) => (
          <path key={x} d={`M${x} 38 V48`} stroke={HOSE.ink} strokeWidth={1.4} />
        ))}
        <circle cx={60} cy={30} r={10} fill={HOSE.paperSepia} stroke={HOSE.ink} strokeWidth={1.6} />
        <circle cx={340} cy={30} r={10} fill={HOSE.paperSepia} stroke={HOSE.ink} strokeWidth={1.6} />
      </svg>
      <div className={`absolute inset-x-4 bottom-2 top-0 ${stage.mapLane}`}>
        <div className={`absolute bottom-0 left-0 h-16 w-10 ${stage.mapRunner}`}>
          <HeroCharacter profession={profession} pose="run" className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
