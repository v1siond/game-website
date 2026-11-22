'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { useProfession } from '@/contexts/ProfessionContext'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { Service } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { usePreview } from '@/themes/PreviewContext'
import { staggerAt } from '../shared/stagger'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { BODY, CARD_TITLE } from './cards'
import { IRON_BOX, frameAt } from './choreography'
import { findId } from './finds'
import { PORTAL, type Era } from './palette'
import { FigureRow, Region, Rig, useReplay, useScene } from './stage'
import css from './ironBox.module.css'

// Services on the great wall, where the riveted ! iron box hangs over the row (research part 2 [21]: the
// ! box turns the outline boxes into real ones). When the section shows he runs under it and jumps head
// first into it from below; the box rings and every service card's dashed outline frame turns into a
// solid riveted iron frame, one after the other. The words are full contrast in both states. "Hit" plays
// it again. Hitting the box is a find.
//
// Animated: him, the box's ring, the card frames (one class, staggered).
// Reduced motion and the preview: him under the box, every frame solid.

const FRAME_TIMES = cssVars({ '--land': frameAt(0), '--frame-step': frameAt(1) - frameAt(0) })

function IronBoxArt() {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <g className={css.rays} stroke={PORTAL.GOLD} strokeWidth={4} strokeLinecap="round">
        <path d="M30 -8 V-18 M-6 10 L-14 4 M66 10 L74 4 M-6 46 L-14 52 M66 46 L74 52" />
      </g>
      <g className={css.bump}>
        <rect x={2} y={2} width={56} height={56} rx={4} fill={PORTAL.IRON} stroke={PORTAL.INK} strokeWidth={3.4} />
        <rect x={8} y={8} width={44} height={44} rx={2} fill={PORTAL.IRON_DARK} />
        {[
          [7, 7],
          [53, 7],
          [7, 53],
          [53, 53],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.6} fill={PORTAL.IRON_FACE} stroke={PORTAL.INK} strokeWidth={1.2} />
        ))}
        <path d="M26 14 H34 L32 36 H28 Z" fill={PORTAL.GOLD} stroke={PORTAL.INK} strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={30} cy={44} r={4} fill={PORTAL.GOLD} stroke={PORTAL.INK} strokeWidth={2.4} />
      </g>
    </svg>
  )
}

function HitScene({ run, still, onDone }: { run: boolean; still: boolean; onDone: () => void }) {
  const scene = useScene(IRON_BOX, { still, onDone })
  return (
    <>
      <div className={`absolute bottom-[calc(100%+8px)] left-1/2 h-14 w-14 -translate-x-1/2 ${css.box}`} data-hit={scene.reached('land')}>
        <IronBoxArt />
      </div>
      <Rig motion={scene.motion} step={scene.step} run={run} size="row" onAnimationEnd={scene.onRigEnd} />
    </>
  )
}

export function IronBoxLevel({ services }: { services: Service[] }) {
  const { sections, actions } = useLabels()
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced } = useZoneStage<Era>('wall')
  const preview = usePreview()
  const still = reduced || preview
  const replay = useReplay(on, still)

  const hit = () => {
    replay.end()
    find(findId('services', 'box'), active)
  }

  return (
    <Region title={sections.services} stageRef={ref} on={on} tally>
      <FigureRow className="mt-20">
        <div className="absolute inset-0" data-still={still || undefined}>
          <HitScene key={replay.round} run={on} still={still} onDone={hit} />
        </div>
      </FigureRow>
      {!still && <SceneButton label={actions.hit} onPress={replay.replay} disabled={replay.playing} className="mb-8" />}
      <ul className={`${MASONRY_LIST} ${css.cards} ${BODY}`} data-solid={on} data-round={replay.round % 2} data-still={still || undefined} style={FRAME_TIMES}>
        {services.map((service, index) => (
          <li key={service.id} className={`${MASONRY_ITEM} ${staggerAt(index)}`}>
            <article className="relative rounded-md bg-[color:var(--np-iron-face)] p-5 text-[color:var(--np-ink)]">
              <span className={css.ghost} aria-hidden="true" />
              <span className={css.solid} aria-hidden="true" />
              <h3 className={CARD_TITLE}>{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{service.line}</p>
            </article>
          </li>
        ))}
      </ul>
    </Region>
  )
}
