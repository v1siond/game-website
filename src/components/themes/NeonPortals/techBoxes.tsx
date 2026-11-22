'use client'

import { useMemo } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TechList } from '@/components/cv/TechList'
import { useProfession } from '@/contexts/ProfessionContext'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { SectionsOf } from '@/lib/cv/cvView'
import { useFind } from '../shared/finds'
import { SceneButton } from './actions'
import { BODY, FACE, TAG } from './cards'
import { BOX_BREAK, techScene, techStep } from './choreography'
import { findId } from './finds'
import type { Era } from './palette'
import { FigureRow, Region, Rig, useReplay, useScene } from './stage'
import css from './techBoxes.module.css'

// The tech stack as the tomb's store of X braced wooden boxes (research part 2 [22][16], part 5 item 1):
// one box per category, the category's card its inner panel. When the section shows he spins across the
// row above them, the game's tornado spin, and each box's braced lid breaks into planks in turn, a step
// apart, while round berries fly out; the panel with every technology stays, readable from the start.
// "Spin" plays it again. Each broken box is a find. The boxes are the shared TechList's items, drawn as
// crates by this world's css (the lid and planks are the item's own pseudo elements).
//
// Animated: him, the planks (one class), the berries (one class).
// Reduced motion: the boxes already open, him resting at the row's end.

type Categories = SectionsOf<'engineer'>['techStack']

/** Box i's place, which its break waits on (--i times --step), for any number of categories. */
const boxAt = (index: number) => ({ '--i': index })

function SpinScene({ count, run, still, onDone }: { count: number; run: boolean; still: boolean; onDone: () => void }) {
  const scene = useScene(useMemo(() => techScene(count), [count]), { still, onDone })
  return <Rig motion={scene.motion} step={scene.step} run={run} size="row" onAnimationEnd={scene.onRigEnd} />
}

export function TechBoxLevel({ categories }: { categories: Categories }) {
  const { sections, actions } = useLabels()
  const { active } = useProfession()
  const find = useFind()
  const { ref, on, reduced: still } = useZoneStage<Era>('tomb')
  const replay = useReplay(on, still)
  const count = categories.length
  const vars = useMemo(() => cssVars({ '--step': techStep(count), '--lead': BOX_BREAK.leadMs, '--break': BOX_BREAK.ms }), [count])

  const spun = () => {
    replay.end()
    categories.forEach((category) => find(findId('tech', category.id), active))
  }

  return (
    <Region title={sections.techStack} stageRef={ref} on={on} tally>
      <FigureRow>
        <SpinScene key={replay.round} count={count} run={on} still={still} onDone={spun} />
      </FigureRow>
      {!still && <SceneButton label={actions.spin} onPress={replay.replay} disabled={replay.playing} className="mb-8" />}
      <div className={`${css.boxes} ${BODY}`} data-broken={on} data-round={replay.round % 2} data-still={still || undefined} style={vars}>
        <TechList
          categories={categories}
          headingClassName={`${FACE} flex items-center gap-2 text-xl leading-tight tracking-wide text-[color:var(--np-wood-text)]`}
          iconClassName="text-2xl"
          itemsClassName="mt-3 flex flex-wrap gap-1.5"
          itemClassName={TAG}
          renderItem={(tech) => tech}
          categoryStyle={boxAt}
        />
      </div>
    </Region>
  )
}
