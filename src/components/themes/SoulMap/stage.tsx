'use client'

import { useEffect, useRef } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { newTabName } from '@/components/cv/sectionText'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Band } from '@/lib/cv/content'
import { Knight } from './knight'
import { usePoseScript, type PoseStep } from './poses'
import { useRun } from './run'
import { BUTTON, BUTTON_LIT } from './links'
import { CARD_META, CARD_TITLE, Hint } from './menu'
import { SOUL } from './palette'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// The bands play in the light: each card is a dark stage under a broken roof, and as the visitor
// reaches it a shaft of sun falls through the gap onto the stage, he walks into it with his mallets
// (two strides) and plays a war drum in the light, then rests his mallets. Encore is the visitor's: it
// cuts in on whatever he is doing, he plays again and then
// throws both arms up into the sun, the game's own gesture of praise, the banner names the band and the
// first encore of each band gives souls. Under reduced motion the light is on and he stands at the drum.

const ENCORE_SOULS = 200
const WALK_IN: PoseStep[] = [
  { pose: 'walk', ms: 2400 },
  { pose: 'act', ms: 4200 },
]
const ENCORE: PoseStep[] = [
  { pose: 'act', ms: 2600 },
  { pose: 'praise', ms: 1800 },
]

function WarDrum() {
  return (
    <svg viewBox="0 0 40 30" className="absolute bottom-3 left-[58%] h-9 w-12" aria-hidden="true" focusable="false">
      <ellipse cx={20} cy={7} rx={16} ry={4.5} fill={SOUL.bone} />
      <path d="M4 7 V24 Q20 30 36 24 V7 Q20 13 4 7 Z" fill={SOUL.leather} />
      <path d="M4 10 L12 25 L20 11 L28 25 L36 10" fill="none" stroke={SOUL.leatherDark} strokeWidth={1.2} />
    </svg>
  )
}

function Stage({ slot: { band, years, linkProps } }: { slot: BandSlot }) {
  const run = useRun()
  const reduced = useReducedMotion()
  const { souls: words, links } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.35 })
  const script = usePoseScript('idle')
  const { play, replay } = script
  const rewarded = useRef(false)
  const lit = triggered || reduced

  useEffect(() => {
    if (!triggered || reduced) return
    play(WALK_IN)
  }, [triggered, reduced, play])

  const encore = (playing: Band) => {
    replay(ENCORE)
    run.announce('summoned', fillLabel(words.encored, { band: playing.name }))
    if (rewarded.current) return
    rewarded.current = true
    run.earn(ENCORE_SOULS)
  }

  return (
    <article ref={ref} className={`${ashen.panel} overflow-hidden`}>
      <div className="relative h-36 overflow-hidden bg-gradient-to-b from-[color:var(--soul-abyss)] to-[color:var(--soul-rock)]">
        <span className={`absolute -top-4 left-[38%] h-44 w-24 ${souls.sunShaft} ${lit ? souls.sunShaftOn : ''}`} aria-hidden="true" />
        <WarDrum />
        <div className={`absolute bottom-2 left-[8%] h-28 w-[4.4rem] ${lit ? souls.onStage : ''}`}>
          <Knight key={script.key} gear="drummer" pose={script.pose} className="h-full w-full" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={CARD_TITLE}>{band.name}</h3>
          {years && <span className={`whitespace-nowrap ${CARD_META}`}>{years}</span>}
        </div>
        <p className="mt-1 text-sm text-[color:var(--soul-glow)]">{band.role}</p>
        {band.release && (
          <p className={`mt-1 ${CARD_META}`}>
            {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => encore(band)} aria-label={fillLabel(words.encoreOf, { band: band.name })} className={BUTTON_LIT}>
            {words.encore}
          </button>
          {linkProps && (
            <a {...linkProps} aria-label={newTabName(links, fillLabel(links.linkOf, { link: links.website, project: band.name }))} className={BUTTON}>
              {links.website}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function SunStages({ bands }: { bands: Band[] }) {
  const { souls: words } = useLabels()
  return (
    <>
      <Hint>{words.stageHint}</Hint>
      <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <Stage slot={slot} />} />
    </>
  )
}
