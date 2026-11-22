'use client'

import { useEffect, useMemo, type AnimationEvent } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useProfession } from '@/contexts/ProfessionContext'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { MartialArts } from '@/lib/cv/content'
import { usePreview } from '@/themes/PreviewContext'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { ART_PLATE, BODY, FACE, PANEL } from './cards'
import { MASK_STEP_MS, maskMotion, maskScene, maskSpot, maskSteps } from './choreography'
import { findId } from './finds'
import { ERA, PORTAL, type Era } from './palette'
import { Region, Rig, Strip } from './stage'
import css from './masks.module.css'

// Muay Thai in the lava age: an original carved mask of black rock with horns and lava eyes (not the
// source's feather face) stands at the far end of the strip. He takes his guard; when the section shows
// the mask comes one step toward him, and "Next" brings it one step more once the last has landed, a step per achievement, three
// at most. Each step lights that achievement's mark in the record under the strip. On the last step the
// mask covers his face in its glow and he ends on the victory knee. Each step the mask takes is a find.
//
// Animated: him (the guard's brace each step, the knee at the last), the mask's step, the glow.
// Reduced motion and the preview: the mask on his face with its glow, him on the knee, every mark lit.

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

const NO_ENTRANCE: readonly string[] = []
const REST = 'rest'

export function MaskLevel({ martialArts }: { martialArts: MartialArts }) {
  const { sections, actions } = useLabels()
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced } = useZoneStage<Era>('prehistoric')
  const preview = usePreview()
  const still = reduced || preview
  const steps = maskSteps(martialArts.primary.achievements.length)
  const scene = useMemo(() => maskScene(steps), [steps])
  // Each step is a one shot move of the shared sequence, taken only at rest; the takes count the steps.
  const sequence = usePoseSequence<string>({ entrance: NO_ENTRANCE, rest: REST, policy: 'rest' })
  const { play, take } = sequence
  const step = still ? steps : Math.min(steps, take)
  const moving = !still && sequence.move !== null
  const spot = maskSpot(step, steps)
  const playNext = () => {
    const next = scene.legs[step]
    if (!next) return
    play(next.name)
  }

  // The first step plays once, when the section shows.
  useEffect(() => {
    if (!on || still || steps === 0 || take > 0) return
    play('step-1')
  }, [on, still, steps, take, play])

  // A step counts the moment it starts, so no later press or scroll can lose it.
  useEffect(() => {
    if (step === 0 || still) return
    find(findId('muayThai', String(step)), active)
  }, [step, still, find, active])

  const stepped = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    sequence.settle()
  }

  return (
    <Region title={sections.muayThai} stageRef={ref} on={on} tally>
      <Strip size="h-56">
        <div className="absolute inset-0" data-still={still || undefined}>
          <div className={css.track} data-last={steps > 0 && step === steps} style={cssVars({ '--mask-x': spot.x, '--mask-lift': spot.lift, '--mask-scale': spot.scale, '--step-ms': MASK_STEP_MS })}>
            <span className={css.glow} />
            <div className={css.mask}>
              <CarvedMask />
            </div>
          </div>
          <Rig motion={maskMotion(scene, step, moving)} step={step} run={on} size="strip" onAnimationEnd={stepped} />
        </div>
      </Strip>
      {!still && <SceneButton label={actions.next} onPress={playNext} disabled={moving || step >= steps} className="-mt-2 mb-6" />}
      <h3 className={`${FACE} ${ART_PLATE} mb-4 inline-block text-2xl leading-tight tracking-wide text-[color:var(--np-gold)]`}>{martialArts.primary.title}</h3>
      <div className={BODY}>
        <MuayThaiRecord martialArts={martialArts} classNames={RECORD_LOOK} renderAchievement={(text, index) => <Mark text={text} lit={index < step} />} />
      </div>
    </Region>
  )
}
