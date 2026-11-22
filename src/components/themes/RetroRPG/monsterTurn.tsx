'use client'

import type { ReactNode } from 'react'
import { SectionCameo, type CameoMark } from '../shared/SectionCameo'
import { MONSTER } from './npcs'
import { Box } from './panels'
import { PixelArt } from './walker'
import turn from './monsterTurn.module.css'
import world from './world.module.css'

// Services, the monster's turn: the source game's monster attacks by landing in the battle box, and a
// hit shakes the box in hard steps. Pattern: the shared SectionCameo starts it once and walks three beats,
// each ended by its own steps() animation on the monster:
//   hop    0 to 600 ms     three stepped hops in from the right along the box's top edge
//   sit    600 to 1100 ms  it sits on the box: the box opens from its line under it (the world's own
//                          boxOpen, 420 ms) and shakes two steps as it finishes (160 ms)
//   off    1100 to 1400 ms it hops off up and right and is gone
// The box reads the beat from the stage's data-beat: closed to its line, held at its top edge where the
// monster lands, until the landing (hop), opening down while it sits and leaves, at rest after, which is
// today's box at rest. Reduced motion shows the box open with no monster. Transforms and opacity only,
// every move in steps (monsterTurn.module.css, and world.module.css for the box's opening).

type Beat = 'hop' | 'sit' | 'off'

const BEATS: readonly Beat[] = ['hop', 'sit', 'off']

// The stage carries no mark of its own: the beat alone drives every keyframe.
const NO_MARK: CameoMark = {}

function Monster() {
  return (
    <svg viewBox="0 0 16 12" className="block h-full w-full" shapeRendering="crispEdges" focusable="false">
      <PixelArt sprite={MONSTER} />
    </svg>
  )
}

const drawMonster = () => <Monster />

/** The services box, opened and shaken by the monster landing on it. */
export function MonsterTurnBox({ children }: { children: ReactNode }) {
  return (
    <SectionCameo
      beats={BEATS}
      threshold={0.3}
      stage={turn.stage}
      mark={NO_MARK}
      reaction={turn.box}
      place={`bottom-full h-12 w-16 ${turn.monster}`}
      figure={drawMonster}
    >
      <Box className={`${world.opens} ${turn.fromTop}`}>{children}</Box>
    </SectionCameo>
  )
}
