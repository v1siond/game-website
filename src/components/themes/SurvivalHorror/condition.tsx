'use client'

import { useState, type CSSProperties } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useLabels } from '@/components/cv/CVDataProvider'
import { Survivor, type SurvivorPose } from './survivor'
import { ConditionMonitor, type Condition } from './ecg'
import { CORNER_MARKS } from './panels'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// The Muay Thai record as the genre's recovery: he comes into the gym hurt, in Danger, limping with a hand
// pressed to his side. The visitor uses the herbs from the inventory, the green herb first (Caution, he
// straightens), then the red one mixed into it (Fine), and once he is fine he goes to work on the heavy bag
// and his achievements are stamped into the record one after another. The red herb does nothing alone in
// the genre, so its slot waits for the green one, and its hint says so. The facts and the achievements are
// always on the page to read; the herbs decide only his condition and the stamps.
//
// Animated: him, the ECG, the bag, the stamps (once, at Fine).

type Herb = 'green' | 'red'

const CONDITION_AFTER: Record<number, Condition> = { 0: 'danger', 1: 'caution', 2: 'fine' }
const POSE: Record<Condition, SurvivorPose> = { danger: 'limp', caution: 'idle', fine: 'act' }

function HerbPot({ herb }: { herb: Herb }) {
  const leaf = herb === 'green' ? SH.herbGreen : SH.herbRed
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true" focusable="false">
      <path d="M12 26 H28 L26 38 H14 Z" fill={SH.pot} />
      <path d="M20 26 Q10 18 12 8 Q20 12 20 26 Q22 10 30 8 Q32 18 20 26 Z" fill={leaf} />
      <path d="M20 26 V14" stroke={SH.void} strokeWidth={0.8} opacity={0.5} />
    </svg>
  )
}

function Gym({ condition }: { condition: Condition }) {
  return (
    <svg viewBox="0 0 600 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width={600} height={180} fill={SH.void} />
      <path d="M0 30 H600 M0 42 H600" stroke={SH.rust} strokeWidth={5} opacity={0.5} />
      <rect y={180} width={600} height={40} fill={SH.olive} opacity={0.5} />
      <g className={horror.bulb}>
        <line x1={260} y1={0} x2={260} y2={50} stroke={SH.ash} strokeWidth={1.2} />
        <circle cx={260} cy={56} r={5} fill={SH.flame} />
        <circle cx={260} cy={56} r={50} fill={SH.flame} opacity={0.09} />
      </g>
      <Survivor profession="fighter" pose={POSE[condition]} place={{ x: 236, y: 206, height: 124 }} />
      <g className={condition === 'fine' ? horror.heavyBag : ''}>
        <line x1={336} y1={0} x2={336} y2={60} stroke={SH.steel} strokeWidth={2} strokeDasharray="4 2" />
        <rect x={314} y={60} width={44} height={112} rx={14} fill={SH.leather} />
        <rect x={314} y={78} width={44} height={6} fill={SH.void} opacity={0.4} />
        <rect x={320} y={66} width={8} height={96} rx={4} fill={SH.rust} opacity={0.6} />
      </g>
    </svg>
  )
}

function HerbSlot({ herb, label, used, waiting, onUse }: { herb: Herb; label: string; used: boolean; waiting: boolean; onUse: () => void }) {
  const { horror: words } = useLabels()
  return (
    <button
      type="button"
      onClick={onUse}
      disabled={used || waiting}
      title={waiting ? words.herbHint : undefined}
      className={`relative flex min-h-[44px] items-center gap-3 border-2 p-2 pr-4 text-sm ${look.slot} ${look.focus} ${used ? 'border-[color:var(--sh-wood)] opacity-60' : 'border-[color:var(--sh-brass)] enabled:hover:border-[color:var(--sh-flame)]'} disabled:cursor-default`}
    >
      {CORNER_MARKS.map((place) => (
        <span key={place} className={`absolute h-2.5 w-2.5 border-[color:var(--sh-brass)] ${place}`} aria-hidden="true" />
      ))}
      <HerbPot herb={herb} />
      <span className="text-[color:var(--sh-ivory)]">{label}</span>
    </button>
  )
}

export function HerbRecovery({ martialArts }: { martialArts: MartialArts }) {
  const { horror: words } = useLabels()
  const [herbs, setHerbs] = useState(0)
  const condition = CONDITION_AFTER[herbs]
  const fine = condition === 'fine'

  return (
    <>
      <div className="mb-6 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className={`relative h-56 overflow-hidden border-2 border-[color:var(--sh-sepia)] sm:h-64 ${horror.cameraFrame}`}>
          <Gym condition={condition} />
        </div>
        <div className="flex flex-col gap-3">
          <ConditionMonitor condition={condition} />
          <div className="flex flex-wrap gap-3">
            <HerbSlot herb="green" label={words.greenHerb} used={herbs >= 1} waiting={false} onUse={() => setHerbs(1)} />
            <HerbSlot herb="red" label={herbs >= 1 ? words.mixedHerb : words.redHerb} used={herbs >= 2} waiting={herbs < 1} onUse={() => setHerbs(2)} />
          </div>
          <p className="text-sm italic text-[color:var(--sh-fog)]">{words.herbHint}</p>
        </div>
      </div>

      <h3 className={`mb-4 text-base text-[color:var(--sh-flame)] ${look.typed}`}>{martialArts.primary.title}</h3>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-4 grid gap-3 sm:grid-cols-2',
          fact: 'border border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] p-3',
          term: `text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`,
          value: 'mt-1 text-sm text-[color:var(--sh-cream)]',
          achievements: 'grid gap-3 md:grid-cols-2',
          achievement: 'text-sm text-[color:var(--sh-cream)]',
        }}
        renderAchievement={(achievement) => (
          <p
            className={`relative flex items-start gap-2 p-3 ${look.file} ${horror.stamp} ${fine ? horror.stamped : ''}`}
            style={{ '--i': martialArts.primary.achievements.indexOf(achievement) } as CSSProperties}
          >
            <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-[color:var(--sh-herb-green)]" aria-hidden="true" />
            <span>{achievement}</span>
          </p>
        )}
      />
    </>
  )
}
