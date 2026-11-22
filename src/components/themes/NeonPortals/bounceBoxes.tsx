'use client'

import { useMemo, type AnimationEvent } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { useProfession } from '@/contexts/ProfessionContext'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { Band, Musician } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { drumsSince } from '@/lib/cv/sectionText'
import { usePreview } from '@/themes/PreviewContext'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { ART_PLATE, BODY, CARD_LINE, CARD_TITLE, FACE, PANEL } from './cards'
import { bandScene, bandTiming, boxX, lidAt } from './choreography'
import { findId } from './finds'
import { ERA, PORTAL, type Era } from './palette'
import { Region, Rig, Strip, useReplay, useScene } from './stage'
import css from './bounceBoxes.module.css'

// The bands on an Arabian night's stage as the game's bounce boxes (research part 2 [7], part 5 item 11):
// one box per band, the current band first, as the view orders them. When the section shows he runs to
// each box in turn and drums a roll of five beats on its lid with his sticks; on the fifth the lid
// springs open and that band's card jumps on the spring. "Play" plays the set again. Each opened lid is a
// find. The cards sit under the strip, readable before, during and after.
//
// Animated: him, the lids (one class, each at its own --lid), the cards' jump (one class, same times).
// Reduced motion and the preview: every lid open and the cards at rest, him resting after the last box.

function BandBox() {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <rect x={4} y={18} width={52} height={40} rx={3} fill={PORTAL.WOOD} stroke={PORTAL.INK} strokeWidth={3} />
      <path d="M4 32 H56 M4 45 H56" stroke={PORTAL.WOOD_DARK} strokeWidth={2} />
      <path d="M16 26 Q30 18 44 26 Q30 34 16 26 Z" fill={ERA.arabian.lamp} stroke={PORTAL.INK} strokeWidth={2} />
      <g className={css.lid}>
        <rect x={1} y={9} width={58} height={11} rx={3} fill={PORTAL.WOOD_LIT} stroke={PORTAL.INK} strokeWidth={3} />
        <path d="M10 14 H50" stroke={PORTAL.WOOD} strokeWidth={2} strokeDasharray="6 4" />
      </g>
      <circle className={css.burst} cx={30} cy={14} r={10} fill={ERA.arabian.lampCore} />
    </svg>
  )
}

function SetScene({ bands, run, still, onDone, onLid }: { bands: Band[]; run: boolean; still: boolean; onDone: () => void; onLid: (id: string) => void }) {
  const count = bands.length
  const scene = useScene(useMemo(() => bandScene(count), [count]), { still, onDone })
  const opened = (id: string) => (event: AnimationEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element) || !event.target.classList.contains(css.lid)) return
    onLid(id)
  }
  return (
    <>
      {bands.map((band, index) => (
        <div
          key={band.id}
          className={css.box}
          style={cssVars({ '--x': boxX(index, count), '--lid': lidAt(index, count) })}
          onAnimationEnd={opened(band.id)}
        >
          <BandBox />
        </div>
      ))}
      <Rig motion={scene.motion} step={scene.step} run={run} size="strip" onAnimationEnd={scene.onRigEnd} />
    </>
  )
}

function BandCard({ slot, lid }: { slot: BandSlot; lid: number }) {
  const { band, years, linkProps, release } = slot
  return (
    <article className={`${PANEL} ${BODY} ${css.card}`} style={cssVars({ '--lid': lid })}>
      <h3 className={CARD_TITLE}>
        {linkProps ? (
          <a {...linkProps} className="underline decoration-[color:var(--np-wood)] decoration-2 underline-offset-4">
            {band.name}
          </a>
        ) : (
          band.name
        )}
      </h3>
      <p className={CARD_LINE}>{band.role}</p>
      {years && <p className="mt-1 text-sm">{years}</p>}
      {release && (
        <p className="mt-2 text-sm">
          {release.label}: <cite className="font-semibold">{release.title}</cite>
        </p>
      )}
    </article>
  )
}

export function BounceBoxLevel({ bands, musician }: { bands: Band[]; musician: Musician }) {
  const { sections, actions, years } = useLabels()
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced } = useZoneStage<Era>('arabian')
  const preview = usePreview()
  const still = reduced || preview
  const replay = useReplay(on, still)
  const count = bands.length
  const hit = useMemo(() => cssVars({ '--hit': `${bandTiming(count).beatMs}ms` }), [count])

  return (
    <Region title={sections.bands} stageRef={ref} on={on} tally>
      <p className={`${FACE} mb-4 inline-block rounded-full bg-[color:var(--np-board)] px-4 py-1.5 text-lg tracking-wide text-[color:var(--np-gold)]`}>{drumsSince(musician, years)}</p>
      <Strip size="aspect-[3/1]">
        <div className="absolute inset-0" data-run={on} data-still={still || undefined} style={hit}>
          <SetScene key={replay.round} bands={bands} run={on} still={still} onDone={replay.end} onLid={(id) => find(findId('bands', id), active)} />
        </div>
      </Strip>
      {!still && <SceneButton label={actions.play} onPress={replay.replay} disabled={replay.playing} className="-mt-2 mb-6" />}
      <div className={css.cards} data-run={on} data-round={replay.round % 2} data-still={still || undefined}>
        <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot, index) => <BandCard slot={slot} lid={lidAt(index, count)} />} />
      </div>
      {musician.line && <p className={`${BODY} ${ART_PLATE} mt-4 max-w-3xl py-2 text-base italic text-[color:var(--np-muted)]`}>{musician.line}</p>}
    </Region>
  )
}
