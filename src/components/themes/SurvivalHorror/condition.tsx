'use client'

import type { CSSProperties } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ConditionMonitor } from './ecg'
import { conditionAfter, useStageState } from './stage'
import { CORNER_MARKS } from './panels'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// The Muay Thai record as the genre's recovery: behind the page he comes into the gym hurt, in Danger,
// limping with a hand pressed to his side (./stage). The visitor uses the herbs from the inventory, the
// green herb first (Caution, he straightens), then the red one mixed into it (Fine), and once he is fine he
// takes his guard and kicks the pursuer back out of the gym, and his achievements are stamped into the
// record one after another. The red herb does nothing alone in
// the genre, so its slot waits for the green one, and its hint says so. The facts and the achievements are
// always on the page to read; the herbs decide only his condition and the stamps.
//
// Animated: the ECG, the stamps (once, at Fine).

type Herb = 'green' | 'red'

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
  const { herbs, takeHerbs } = useStageState()
  const condition = conditionAfter(herbs)
  const fine = condition === 'fine'

  return (
    <>
      <div className="mb-6 max-w-xl">
        <div className="flex flex-col gap-3">
          <ConditionMonitor condition={condition} />
          <div className="flex flex-wrap gap-3">
            <HerbSlot herb="green" label={words.greenHerb} used={herbs >= 1} waiting={false} onUse={() => takeHerbs(1)} />
            <HerbSlot herb="red" label={herbs >= 1 ? words.mixedHerb : words.redHerb} used={herbs >= 2} waiting={herbs < 1} onUse={() => takeHerbs(2)} />
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
