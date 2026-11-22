'use client'

import { useState, type TransitionEvent } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useProfession } from '@/contexts/ProfessionContext'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { MartialArts } from '@/lib/cv/content'
import { usePreview } from '@/themes/PreviewContext'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { BODY, CARD_TITLE, PANEL } from './cards'
import { MASK_GUARD, maskSpot, maskSteps, type Motion } from './choreography'
import { findId } from './finds'
import { ERA, PORTAL, type Era } from './palette'
import { Region, Rig, Strip } from './stage'
import css from './masks.module.css'

// Muay Thai in the lava age: an original carved mask of black rock with horns and lava eyes (not the
// source's feather face) stands at the far end of the strip. He takes his guard; when the section shows
// the mask comes one step toward him, and "Next" brings it one step more, a step per achievement, three
// at most. Each step lights that achievement's mark in the record under the strip. On the last step the
// mask covers his face in its glow and he ends on the victory knee. Each step the mask takes is a find.
//
// Animated: him (the guard's brace each step, the knee at the last), the mask's step, the glow.
// Reduced motion and the preview: the mask on his face with its glow, him on the knee, every mark lit.

const AT_GUARD = { x: MASK_GUARD.x, lift: 0 }

const RECORD_LOOK = {
  facts: 'grid gap-3 sm:grid-cols-2',
  fact: `${PANEL} p-3`,
  term: 'text-sm font-bold uppercase tracking-wider text-[color:var(--np-wood-text)]',
  value: 'mt-1 text-base',
  achievements: 'mt-6 grid gap-3 md:grid-cols-3',
  achievement: 'h-full',
}

function CarvedMask() {
  const { rock, rockLight, lava, lavaCore } = ERA.prehistoric
  return (
    <svg viewBox="0 0 80 100" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <path d="M14 30 L2 6 L24 22 M66 30 L78 6 L56 22" fill={rockLight} stroke={PORTAL.INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M10 26 Q40 6 70 26 L66 72 Q40 98 14 72 Z" fill={rock} stroke={PORTAL.INK} strokeWidth={3.4} strokeLinejoin="round" />
      <path d="M16 34 Q40 22 64 34" fill="none" stroke={rockLight} strokeWidth={5} strokeLinecap="round" />
      <path d="M20 44 L34 40 L32 52 L20 50 Z M60 44 L46 40 L48 52 L60 50 Z" fill={lava} stroke={PORTAL.INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M25 46 L30 45 M55 46 L50 45" stroke={lavaCore} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M40 50 L35 62 H45 Z" fill={rockLight} stroke={PORTAL.INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M24 70 Q40 78 56 70 L52 80 Q40 86 28 80 Z" fill={PORTAL.INK} />
      <path d="M30 72 V78 M36 74 V81 M44 74 V81 M50 72 V78" stroke={PORTAL.CREAM} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M14 58 L22 62 M66 58 L58 62" stroke={lava} strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  )
}

function Mark({ text, lit }: { text: string; lit: boolean }) {
  return (
    <p className={`${PANEL} ${BODY} flex h-full items-start gap-3 p-3 text-base font-semibold`}>
      <span className={css.mark} data-lit={lit} aria-hidden="true" />
      {text}
    </p>
  )
}

export function MaskLevel({ martialArts }: { martialArts: MartialArts }) {
  const { sections, actions } = useLabels()
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced } = useZoneStage<Era>('prehistoric')
  const preview = usePreview()
  const still = reduced || preview
  const steps = maskSteps(martialArts.primary.achievements.length)
  const [asked, setAsked] = useState(0)
  const step = still ? steps : Math.min(steps, Math.max(asked, on ? 1 : 0))
  const last = steps > 0 && step === steps
  const motion: Motion = { pose: last ? 'knee' : 'guard', from: AT_GUARD, to: AT_GUARD, ms: 0 }
  const spot = maskSpot(step, steps)

  const arrived = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
    find(findId('muayThai', String(step)), active)
  }

  return (
    <Region title={sections.muayThai} stageRef={ref} on={on} tally>
      <Strip size="h-56">
        <div className="absolute inset-0" data-still={still || undefined}>
          <div
            className={css.track}
            data-last={last}
            style={cssVars({ '--mask-x': spot.x, '--mask-lift': spot.lift, '--mask-scale': spot.scale })}
            onTransitionEnd={arrived}
          >
            <span className={css.glow} />
            <div className={css.mask}>
              <CarvedMask />
            </div>
          </div>
          <Rig motion={motion} step={step} run={on} size="strip" />
        </div>
      </Strip>
      {!still && <SceneButton label={actions.next} onPress={() => setAsked(step + 1)} disabled={step >= steps} className="-mt-2 mb-6" />}
      <h3 className={`${CARD_TITLE} mb-4 text-2xl text-[color:var(--np-gold)]`}>{martialArts.primary.title}</h3>
      <div className={BODY}>
        <MuayThaiRecord martialArts={martialArts} classNames={RECORD_LOOK} renderAchievement={(text, index) => <Mark text={text} lit={index < step} />} />
      </div>
    </Region>
  )
}
