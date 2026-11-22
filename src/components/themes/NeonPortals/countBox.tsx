'use client'

import { useMemo } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { useProfession } from '@/contexts/ProfessionContext'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import { aboutBlock } from '@/lib/cv/cvView'
import { usePreview } from '@/themes/PreviewContext'
import { staggerAt } from '../shared/stagger'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { BODY, PANEL, Points } from './cards'
import { AT_PLUNGER, COUNT_BOX, PIPS, pipAt } from './choreography'
import { findId } from './finds'
import { PORTAL, type Era } from './palette'
import { Region, Rig, Strip, useReplay, useScene } from './stage'
import css from './countBox.module.css'

// About as the count box on the hub's floor (research part 2 [13]): a crate with a round bomb glyph on its
// face and no letters, a plunger on its side and three light pips on its lid. He walks up and pulls the
// plunger, the pips blink one, two, three, and the box's front panel swings open on a warm light; the box
// stays whole. His bio, education, languages and highlights sit on the plate under the strip, readable
// before, during and after. "Again" plays it again. Opening the box is the run's first find.
//
// Animated: him, the pips (one class), the panel.
// Reduced motion and the preview: him at the plunger, the pips lit and the panel open.

// The box stands from his pulling spot: --at is AT_PLUNGER's x and the box's left edge is 10 px right of it, so
// the plunger's handle (7 px into the box) is where his front hand reaches in the pull, at the strip's fixed h-56.
const BOX_TIMES = cssVars({ '--pip-ms': pipAt(1) - pipAt(0), '--at': AT_PLUNGER.x })

function CountBoxArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <g className={css.plunger}>
        <path d="M13 78 V98" stroke={PORTAL.INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M13 78 V98" stroke={PORTAL.IRON} strokeWidth={3.5} strokeLinecap="round" />
        <rect x={1} y={74} width={24} height={9} rx={4} fill={PORTAL.PAD_RED} stroke={PORTAL.INK} strokeWidth={2.6} />
      </g>
      <rect x={2} y={96} width={22} height={20} rx={2} fill={PORTAL.IRON_DARK} stroke={PORTAL.INK} strokeWidth={2.6} />
      <rect x={24} y={30} width={90} height={86} rx={3} fill={PORTAL.WOOD} stroke={PORTAL.INK} strokeWidth={3.4} />
      <path d="M24 52 H114 M24 74 H114 M24 96 H114" stroke={PORTAL.WOOD_DARK} strokeWidth={2.4} />
      <rect x={34} y={40} width={70} height={66} fill={PORTAL.LAMP} className={css.glow} />
      <g className={css.panel}>
        <rect x={34} y={40} width={70} height={66} fill={PORTAL.WOOD_LIT} stroke={PORTAL.INK} strokeWidth={2.6} />
        <path d="M34 40 L104 106 M104 40 L34 106" stroke={PORTAL.WOOD} strokeWidth={7} />
        <circle cx={69} cy={76} r={17} fill={PORTAL.PAD_RED} stroke={PORTAL.INK} strokeWidth={2.6} />
        <circle cx={69} cy={77} r={10} fill={PORTAL.INK} />
        <path d="M74 68 Q80 60 86 62" fill="none" stroke={PORTAL.INK} strokeWidth={2.6} strokeLinecap="round" />
        <circle cx={87} cy={61} r={2.6} fill={PORTAL.ORANGE} />
        <circle cx={65} cy={73} r={2.4} fill={PORTAL.WHITE} />
      </g>
      {Array.from({ length: PIPS }, (_, index) => (
        <g key={index} className={staggerAt(index)}>
          <circle cx={46 + index * 23} cy={26} r={7} fill={PORTAL.BOARD} stroke={PORTAL.INK} strokeWidth={2.4} />
          <circle cx={46 + index * 23} cy={26} r={5} fill={PORTAL.GOLD} className={css.pip} />
        </g>
      ))}
    </svg>
  )
}

function BoxScene({ run, still, onDone }: { run: boolean; still: boolean; onDone: () => void }) {
  const scene = useScene(COUNT_BOX, { still, onDone })
  return (
    <>
      <div
        className={`absolute bottom-[9%] left-[calc(var(--at)*1%_+_10px)] aspect-square h-[30%] ${css.box}`}
        style={BOX_TIMES}
        data-pulled={scene.reached('pull')}
        data-counting={scene.reached('count')}
        data-open={scene.reached('open')}
      >
        <CountBoxArt />
      </div>
      <Rig motion={scene.motion} step={scene.step} run={run} size="strip" onAnimationEnd={scene.onRigEnd} />
    </>
  )
}

export function CountBoxLevel() {
  const { sections, actions, cvPage, about: aboutLabels } = useLabels()
  const { professionalSummary } = useCVData()
  const about = useMemo(() => aboutBlock(professionalSummary), [professionalSummary])
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced } = useZoneStage<Era>('hub')
  const preview = usePreview()
  const still = reduced || preview
  const replay = useReplay(on, still)

  const opened = () => {
    replay.end()
    find(findId('about', 'bio'), active)
  }

  return (
    <Region title={sections.about} stageRef={ref} on={on} tally>
      <Strip size="h-56">
        <div className="absolute inset-0" data-still={still || undefined}>
          <BoxScene key={replay.round} run={on} still={still} onDone={opened} />
        </div>
      </Strip>
      {!still && <SceneButton label={actions.again} onPress={replay.replay} disabled={replay.playing} className="-mt-2 mb-6" />}
      <div className={`${PANEL} ${BODY} max-w-3xl p-5 sm:p-6`}>
        <p className="text-lg leading-relaxed">{about.bio}</p>
        <p className="mt-4 text-base">
          <span className="font-bold">{cvPage.education}: </span>
          {about.education}
        </p>
        <p className="mt-1 text-base">
          <span className="font-bold">{aboutLabels.languages}: </span>
          {about.languages}
        </p>
        <Points items={about.highlights} label={cvPage.coreCompetencies} />
      </div>
    </Region>
  )
}
