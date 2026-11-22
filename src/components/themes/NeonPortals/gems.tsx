'use client'

import { useRef, useState, type AnimationEvent } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { VentureList, type VentureSlot } from '@/components/cv/VentureList'
import { useProfession } from '@/contexts/ProfessionContext'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { SectionsOf } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { usePreview } from '@/themes/PreviewContext'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { BODY, CARD_LINE, CARD_TITLE, PANEL, Tags } from './cards'
import { COLLECT, GEMS_IN, collectMotion, restSpot } from './choreography'
import { findId } from './finds'
import { GEMS, PORTAL, type Era } from './palette'
import { FigureRow, Region, Rig, useScene } from './stage'
import css from './gems.module.css'

// Ventures in the deep as the gems of the game (research part 2 [8][1]): his own products first, each on a
// full width slab with a coloured gem on its corner, the other ventures in the columns with clear gems,
// in the view's order. He runs into the row above them when the section shows; pressing a venture's
// "Collect" sends him along the row to its gem, and once he is there the gem flies up into the tally,
// leaving its empty setting on the card. Each collected gem is a find.
//
// Animated: him, the flying gem.
// Reduced motion and the preview: him resting in the row, every gem already collected.

type Companies = SectionsOf<'engineer'>['companies']

type CollectMove = 'stand' | 'run'

const NO_ENTRANCE: readonly CollectMove[] = []

const FLIGHT_TIMES = cssVars({ '--glide': COLLECT.glideMs, '--flight': COLLECT.flightMs })

/** The gem flying: which venture's, and how far its centre is from the tally's, in px. */
interface Flight {
  id: string
  dx: number
  dy: number
}

const NONE: ReadonlySet<string> = new Set()

// His own products come first in the view, so a featured venture's place is its place among them.
const gemColour = (featured: boolean, index: number): string => (featured ? GEMS[index % GEMS.length] : PORTAL.GEM_CLEAR)

const centreOf = (element: Element) => {
  const { left, top, width, height } = element.getBoundingClientRect()
  return { x: left + width / 2, y: top + height / 2 }
}

function Gem({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <path d="M6 15 L13 6 H27 L34 15 L20 36 Z" fill={PORTAL.BOARD} stroke={PORTAL.INK} strokeWidth={2.4} strokeLinejoin="round" />
      <g className={css.stone} stroke={PORTAL.INK} strokeWidth={1.6} strokeLinejoin="round">
        <path d="M6 15 L13 6 H27 L34 15 L20 36 Z" fill={colour} />
        <path d="M6 15 H34 M13 6 L16 15 L20 36 L24 15 L27 6" fill="none" />
        <path d="M13 9 L15 13" stroke={PORTAL.WHITE} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </svg>
  )
}

interface GemCardProps {
  slot: VentureSlot
  colour: string
  collected: boolean
  flight: Flight | null
  canCollect: boolean
  onCollect: (gem: Element) => void
  onLanded: (event: AnimationEvent<HTMLDivElement>) => void
}

function GemCard({ slot, colour, collected, flight, canCollect, onCollect, onLanded }: GemCardProps) {
  const { actions, cards, sections } = useLabels()
  const { venture, linkProps } = slot
  const gem = useRef<HTMLDivElement>(null)
  const flying = flight?.id === venture.id
  const press = () => {
    if (!gem.current) return
    onCollect(gem.current)
  }
  const vars = flying ? cssVars({ '--dx': flight.dx, '--dy': flight.dy }) : undefined
  const name = (
    <>
      <span className="mr-2" aria-hidden="true">
        {venture.icon}
      </span>
      {venture.name}
    </>
  )

  return (
    <article className={`${PANEL} ${BODY} ${venture.featured ? 'p-6' : ''}`}>
      <div ref={gem} className={`absolute -right-4 -top-5 h-12 w-12 ${css.gem}`} data-flying={flying} data-collected={collected} style={vars} onAnimationEnd={onLanded}>
        <Gem colour={colour} />
      </div>
      {venture.featured && <p className={`${CARD_LINE} mb-1 uppercase tracking-wider text-[color:var(--np-wood-text)]`}>{cards.ownProduct}</p>}
      <h3 className={`${CARD_TITLE} pr-8 ${venture.featured ? 'text-2xl' : ''}`}>
        {linkProps ? (
          <a {...linkProps} className="underline decoration-[color:var(--np-wood)] decoration-2 underline-offset-4">
            {name}
          </a>
        ) : (
          name
        )}
      </h3>
      <p className={`${CARD_LINE} mt-1`}>{venture.tagline}</p>
      <p className="mt-2 text-sm leading-relaxed">{venture.description}</p>
      <Tags items={venture.services} label={sections.services} />
      {canCollect && (
        <SceneButton label={fillLabel(actions.collect, { name: venture.name })} onPress={press} disabled={collected || flight !== null} className="mt-4" />
      )}
    </article>
  )
}

export function GemLevel({ companies }: { companies: Companies }) {
  const { sections } = useLabels()
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced } = useZoneStage<Era>('underwater')
  const preview = usePreview()
  const still = reduced || preview
  const scene = useScene(GEMS_IN, { still })
  const collect = usePoseSequence<CollectMove>({ entrance: NO_ENTRANCE, rest: 'stand', moveMs: COLLECT.glideMs })
  const row = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ from: restSpot(GEMS_IN).x, to: restSpot(GEMS_IN).x })
  const [flight, setFlight] = useState<Flight | null>(null)
  const [collected, setCollected] = useState(NONE)
  const entered = scene.step >= GEMS_IN.beats.length
  const motion = entered ? collectMotion(spot.from, spot.to, collect.move === 'run') : scene.motion

  const startCollect = (id: string) => (gem: Element) => {
    const box = row.current?.getBoundingClientRect()
    const tally = row.current?.closest('section')?.querySelector('[data-tally]')
    if (!box || !tally) return
    const from = centreOf(gem)
    const to = centreOf(tally)
    setSpot((now) => ({ from: now.to, to: ((from.x - box.left) / box.width) * 100 }))
    collect.play('run')
    setFlight({ id, dx: to.x - from.x, dy: to.y - from.y })
  }

  const landed = (id: string) => (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    find(findId('ventures', id), active)
    setCollected((now) => new Set(now).add(id))
    setFlight(null)
  }

  return (
    <Region title={sections.ventures} stageRef={ref} on={on} tally>
      <div ref={row}>
        <FigureRow>
          <Rig motion={motion} step={scene.step + collect.take} run={on} size="row" onAnimationEnd={scene.onRigEnd} />
        </FigureRow>
      </div>
      <div className={css.gems} data-still={still || undefined} style={FLIGHT_TIMES}>
        <VentureList
          companies={companies}
          className={MASONRY_LIST}
          itemClassName={`${MASONRY_ITEM} pt-5`}
          featuredItemClassName="[column-span:all]"
          renderVenture={(slot, index) => (
            <GemCard
              slot={slot}
              colour={gemColour(Boolean(slot.venture.featured), index)}
              collected={still || collected.has(slot.venture.id)}
              flight={flight}
              canCollect={!still}
              onCollect={startCollect(slot.venture.id)}
              onLanded={landed(slot.venture.id)}
            />
          )}
        />
      </div>
    </Region>
  )
}
