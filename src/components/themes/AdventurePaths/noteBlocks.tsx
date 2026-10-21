'use client'

import { useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince } from '@/components/cv/sectionText'
import { useZoneStage } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import type { Band, Musician } from '@/lib/cv/content'
import { Actor, useCourse } from './actor'
import { cssVars } from './art'
import { Note, NoteBlock } from './blocks'
import type { Course, Motion } from './course'
import { JOURNAL_SERIF } from './palette'
import { Banner, PAPER_CARD, Playfield, Region } from './region'
import type { Zone } from './world'
import side from './side.module.css'

// The bands as a night stretch of note blocks (research images 11, 23): one block per band, the current
// band first. He drops onto the first block and keeps bouncing on it to the beat, the block squashing
// under him and a note flying up each time. Pointing at a band card, or pressing a block, sends him
// over to that band's block, and the HUD line names the band he plays with. Under reduced motion he
// stands on the block.

// The top of a note block over the ground (side.module.css: 24px up, 52px tall).
const LIFT = 76

/** A note block's place: x in % along the row. */
const blockX = (index: number, count: number) => (count === 1 ? 44 : 12 + (index * 68) / (count - 1))

const dropCourse = (x: number): Course<'drop' | 'bounce'> => ({
  start: { x, lift: 260 },
  legs: [{ pose: 'drop', frame: 'jump', path: 'line', to: { x, lift: LIFT }, ms: 480, ease: 'ease-in' }],
  rest: { pose: 'bounce', frame: 'jump' },
})

function BandCard({ slot, onPoint }: { slot: BandSlot; onPoint: () => void }) {
  const { band, years, linkProps } = slot
  const { links } = useLabels()
  const body = (
    <article className={`${PAPER_CARD} h-full`}>
      <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{band.name}</h3>
      <p className="mt-1 text-sm text-[color:var(--ap-ink-soft)]">
        {band.role}
        {years && <span> · {years}</span>}
      </p>
      {band.release && (
        <p className="mt-2 text-sm">
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )
  const handlers = { onPointerEnter: onPoint, onFocus: onPoint }

  if (!linkProps) {
    return (
      <div id={`trail-band-${band.id}`} tabIndex={-1} {...handlers}>
        {body}
      </div>
    )
  }
  return (
    <a id={`trail-band-${band.id}`} {...linkProps} {...handlers} className="block transition-transform hover:-translate-y-1 motion-reduce:transition-none">
      {body}
    </a>
  )
}

export function NoteBlockLevel({ bands, musician }: { bands: Band[]; musician: Musician }) {
  const { sections, trail, years } = useLabels()
  const { ref, on, reduced } = useZoneStage<Zone>('night')
  const [at, setAt] = useState(0)
  const count = bands.length
  const course = useCourse(dropCourse(blockX(0, count)))
  const bouncing = course.arrived && !reduced
  const spot = { x: blockX(at, count), lift: LIFT }
  // Once he has landed he glides from block to block; the drop is the course's one leg.
  const motion: Motion = course.arrived ? { pose: 'bounce', frame: reduced ? 'stand' : 'jump', path: 'glide', from: spot, to: spot, ms: 0 } : course.motion
  const standing = bands[at]

  const show = (band: Band, index: number) => {
    setAt(index)
    document.getElementById(`trail-band-${band.id}`)?.focus()
  }

  return (
    <Region title={sections.bands} hint={trail.bandHint} stageRef={ref} on={on}>
      <p className={`mb-4 inline-block rounded-md bg-[color:var(--ap-hud)] px-3 py-1.5 text-lg text-white ${JOURNAL_SERIF}`}>{drumsSince(musician, years)}</p>
      <Banner>{standing ? fillLabel(trail.playingWith, { name: standing.name }) : sections.bands}</Banner>
      <Playfield height="h-64">
        {bands.map((band, index) => (
          <button
            key={band.id}
            type="button"
            aria-label={fillLabel(trail.bounceTo, { name: band.name })}
            aria-current={bouncing && index === at}
            onClick={() => show(band, index)}
            className={`${side.noteBlock} rounded-sm`}
            style={cssVars({ '--x': blockX(index, count) })}
          >
            <span key={index === at ? `on-${at}` : 'off'} className={side.noteFace}>
              <NoteBlock />
            </span>
          </button>
        ))}
        {on && (
          <Actor motion={motion} profession="drummer" onAnimationEnd={course.onOwnAnimationEnd} hopClassName={bouncing ? side.bounce : ''} hopKey={at}>
            {bouncing && (
              <span key={at} className={side.note}>
                <Note />
              </span>
            )}
          </Actor>
        )}
      </Playfield>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <BandCard slot={slot} onPoint={() => setAt(bands.indexOf(slot.band))} />}
      />
      {musician.line && <p className="mt-6 inline-block rounded-md bg-[color:var(--ap-hud)] px-3 py-1.5 text-base italic text-[color:var(--ap-coin)]">{musician.line}</p>}
    </Region>
  )
}
