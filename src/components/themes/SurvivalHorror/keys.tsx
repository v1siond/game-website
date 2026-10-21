'use client'

import { useState, type ReactNode } from 'react'
import type { Musician } from '@/lib/cv/content'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { drumsSince } from '@/components/cv/sectionText'
import { CARD_BUTTON } from './actions'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// Bands as the house's locked doors, each with the suit of the key that opens it engraved over the lock
// (spade, heart, diamond, club, in turn), the genre's suit keys. The plate on the door always carries the
// band's name, his role and the years; Use the key turns the key in the lock and the door swings open on
// what is behind it, the release and the band's link. A door stays open once unlocked.
//
// Animated: the key's turn and the door's swing, once per door.

type Suit = keyof Pick<Labels['horror'], 'spade' | 'heart' | 'diamond' | 'club'>

const SUITS: readonly Suit[] = ['spade', 'heart', 'diamond', 'club']

const SUIT_ART: Record<Suit, ReactNode> = {
  spade: <path d="M12 2 C4 10 2 13 4 16 C6 19 10 18 11 16 L9 22 H15 L13 16 C14 18 18 19 20 16 C22 13 20 10 12 2 Z" />,
  heart: <path d="M12 21 C4 14 2 10 4 6 C6 3 10 3 12 7 C14 3 18 3 20 6 C22 10 20 14 12 21 Z" />,
  diamond: <path d="M12 2 L20 12 L12 22 L4 12 Z" />,
  club: (
    <>
      <circle cx={12} cy={7} r={4.6} />
      <circle cx={7} cy={13} r={4.6} />
      <circle cx={17} cy={13} r={4.6} />
      <path d="M11 13 H13 L15 22 H9 Z" />
    </>
  ),
}

function SuitMark({ suit, className }: { suit: Suit; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      {SUIT_ART[suit]}
    </svg>
  )
}

function Key({ suit, turned }: { suit: Suit; turned: boolean }) {
  return (
    <svg viewBox="0 0 60 24" className={`h-6 w-16 ${horror.key} ${turned ? horror.keyTurned : ''}`} aria-hidden="true" focusable="false">
      <circle cx={10} cy={12} r={8} fill="none" stroke={SH.brass} strokeWidth={3} />
      <g transform="translate(3 5) scale(0.58)" fill={SH.brass}>
        {SUIT_ART[suit]}
      </g>
      <path d="M18 12 H56 M48 12 V19 M54 12 V18" stroke={SH.brass} strokeWidth={3} />
    </svg>
  )
}

function DoorLeafArt({ suit }: { suit: Suit }) {
  return (
    <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width={100} height={140} fill={SH.wood} />
      <rect x={10} y={10} width={80} height={52} fill="none" stroke={SH.sepia} strokeWidth={3} />
      <rect x={10} y={74} width={80} height={56} fill="none" stroke={SH.sepia} strokeWidth={3} />
      <g transform="translate(38 24) scale(1)" fill={SH.brass}>
        {SUIT_ART[suit]}
      </g>
      <circle cx={86} cy={70} r={4} fill={SH.brass} />
      <rect x={83.5} y={76} width={5} height={8} rx={1} fill={SH.void} />
    </svg>
  )
}

function SuitDoor({ slot, suit }: { slot: BandSlot; suit: Suit }) {
  const { horror: words, links } = useLabels()
  const [unlocked, setUnlocked] = useState(false)
  const { band, years, linkProps } = slot
  const suitName = words[suit]
  const behindId = `survival-horror-band-${band.id}`

  return (
    <article className={`p-4 ${look.file}`}>
      <div className="flex items-start gap-3">
        <SuitMark suit={suit} className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--sh-brass)]" />
        <div className="min-w-0">
          <h3 className="text-base text-[color:var(--sh-ivory)]">{band.name}</h3>
          <p className="text-sm text-[color:var(--sh-brass)]">
            {band.role}
            {years && <span aria-hidden="true"> | </span>}
            {years}
          </p>
        </div>
      </div>

      <div className={`relative mt-4 h-40 overflow-hidden border-4 border-[color:var(--sh-sepia)] bg-[color:var(--sh-void)] ${horror.doorFrame}`}>
        <div id={behindId} className="absolute inset-0 flex flex-col justify-center gap-3 p-4" inert={!unlocked}>
          {band.release && (
            <p className="text-sm text-[color:var(--sh-cream)]">
              {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
            </p>
          )}
          {linkProps && (
            <a {...linkProps} className={`${CARD_BUTTON} self-start border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame)] hover:border-[color:var(--sh-flame)]`}>
              {band.name}
            </a>
          )}
        </div>
        <div className={`absolute inset-0 ${horror.bandDoor} ${unlocked ? horror.bandDoorOpen : ''}`} aria-hidden="true">
          <DoorLeafArt suit={suit} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setUnlocked(true)}
          disabled={unlocked}
          aria-controls={behindId}
          aria-label={unlocked ? undefined : fillLabel(words.useKeyOn, { suit: suitName, band: band.name })}
          className={`${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-ivory)] enabled:hover:border-[color:var(--sh-flame)] disabled:cursor-default`}
        >
          <Key suit={suit} turned={unlocked} />
          {unlocked ? words.unlocked : fillLabel(words.useKey, { suit: suitName })}
        </button>
      </div>
    </article>
  )
}

export function SuitDoors({ musician, bands }: { musician: Musician; bands: BandSlot['band'][] }) {
  const { horror: words, years } = useLabels()
  const suitOf = new Map(bands.map((band, index) => [band.id, SUITS[index % SUITS.length]]))

  return (
    <>
      <p className="mb-2 text-base leading-relaxed text-[color:var(--sh-cream)]">{drumsSince(musician, years)}</p>
      <p className="mb-6 text-sm italic text-[color:var(--sh-fog)]">{words.keyHint}</p>
      <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <SuitDoor slot={slot} suit={suitOf.get(slot.band.id) ?? 'spade'} />} />
      <p className="mt-2 text-sm italic text-[color:var(--sh-cream)]">{musician.line}</p>
    </>
  )
}
