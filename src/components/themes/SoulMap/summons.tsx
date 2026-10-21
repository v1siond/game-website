'use client'

import { useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { newTabName } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { Band } from '@/lib/cv/content'
import { Knight } from './knight'
import { useRun } from './run'
import { BUTTON, BUTTON_LIT } from './links'
import { CARD_META, CARD_TITLE, Hint } from './menu'
import { SOUL } from './palette'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// The bands are the game's summon signs: a golden sigil burnt into the floor of each card. Summon is the
// game's own act: the sign flares, his phantom gathers out of its gold light on the spot, drumming, the
// sign keeps glowing while he is there, and the banner names the band. One phantom walks the world at a
// time, the way the game allows, so a new summon sends the last one home: it fades out off its sign. The
// first summon of each band gives souls.

const SUMMON_SOULS = 200
// The fade of a phantom sent home (.phantomLeave in souls.module.css).
const LEAVE_MS = 900

type Phantom = 'here' | 'leaving' | 'none'

const PHANTOM_CLASS: Record<Exclude<Phantom, 'none'>, string> = {
  here: souls.phantomRise,
  leaving: souls.phantomLeave,
}

function Sigil({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 120 40" className={`absolute inset-x-0 bottom-0 h-10 w-full ${souls.sigil} ${lit ? souls.sigilLit : ''}`} aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={26} rx={44} ry={10} fill="none" stroke={SOUL.glow} strokeWidth={1.4} />
      <ellipse cx={60} cy={26} rx={30} ry={6.6} fill="none" stroke={SOUL.glowDeep} strokeWidth={1} />
      <path d="M22 26 Q40 14 60 26 Q80 38 98 26 M60 16 V36 M44 20 L76 32 M76 20 L44 32" fill="none" stroke={SOUL.glow} strokeWidth={0.9} opacity={0.8} />
    </svg>
  )
}

interface SummonCardProps {
  slot: BandSlot
  phantom: Phantom
  onSummon: (band: Band) => void
}

function SummonCard({ slot: { band, years, linkProps }, phantom, onSummon }: SummonCardProps) {
  const { souls: words, links } = useLabels()
  const summoned = phantom === 'here'

  return (
    <article className={`${ashen.panel} overflow-hidden`}>
      <div className="relative h-36 bg-gradient-to-b from-[color:var(--soul-abyss)] to-[color:var(--soul-rock)]">
        <Sigil lit={summoned} />
        {phantom !== 'none' && (
          <div className={`absolute bottom-3 left-1/2 h-28 w-[4.4rem] -ml-[2.2rem] ${PHANTOM_CLASS[phantom]}`}>
            <Knight gear="drummer" pose="act" spirit="summon" className="h-full w-full" />
          </div>
        )}
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
          <button
            type="button"
            onClick={() => onSummon(band)}
            aria-pressed={summoned}
            aria-label={fillLabel(words.summonOf, { band: band.name })}
            className={summoned ? BUTTON : BUTTON_LIT}
          >
            {words.summon}
          </button>
          {linkProps && (
            <a
              {...linkProps}
              aria-label={newTabName(links, fillLabel(links.linkOf, { link: links.website, project: band.name }))}
              className={BUTTON}
            >
              {links.website}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function SummonSigns({ bands }: { bands: Band[] }) {
  const run = useRun()
  const { souls: words } = useLabels()
  const [summonedId, setSummonedId] = useState<string | null>(null)
  const [leavingId, setLeavingId] = useState<string | null>(null)
  const leaveTimer = useRef(0)
  const rewarded = useRef(new Set<string>())

  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  const sendHome = (id: string | null) => {
    if (!id) return
    window.clearTimeout(leaveTimer.current)
    setLeavingId(id)
    leaveTimer.current = window.setTimeout(() => setLeavingId(null), LEAVE_MS)
  }

  const phantomOf = (id: string): Phantom => {
    if (id === summonedId) return 'here'
    return id === leavingId ? 'leaving' : 'none'
  }

  const summon = (band: Band) => {
    if (summonedId !== band.id) sendHome(summonedId)
    setSummonedId(band.id)
    run.announce('summoned', fillLabel(words.summoned, { band: band.name }))
    if (rewarded.current.has(band.id)) return
    rewarded.current.add(band.id)
    run.earn(SUMMON_SOULS)
  }

  return (
    <>
      <Hint>{words.summonHint}</Hint>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <SummonCard slot={slot} phantom={phantomOf(slot.band.id)} onSummon={summon} />}
      />
    </>
  )
}
