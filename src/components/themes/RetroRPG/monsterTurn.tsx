'use client'

import type { AnimationEvent, ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { usePreview } from '@/themes/PreviewContext'
import { MONSTER } from './npcs'
import { Box } from './panels'
import { PixelArt } from './walker'
import turn from './monsterTurn.module.css'
import world from './world.module.css'

// Services, the monster's turn: the source game's monster attacks by landing in the battle box, and a
// hit shakes the box in hard steps. Pattern: the shared section trigger starts it once; the shared pose
// sequence walks three beats, each ended by its own steps() animation on the monster's track:
//   hop    0 to 600 ms     three stepped hops in from the right along the box's top edge
//   sit    600 to 1100 ms  it sits on the box: the box opens from its line under it (the world's own
//                          boxOpen, 420 ms) and shakes two steps as it finishes (160 ms)
//   off    1100 to 1400 ms it hops off up and right and is gone
// The box's state is the world's data-play: idle (closed to its line, held at its top edge where the
// monster lands) until the landing, on while it opens down, done after, which is today's box at rest. Reduced motion and a World Select preview show the
// box open with no monster. Transforms and opacity only, every move in steps (monsterTurn.module.css).

type Beat = 'hop' | 'sit' | 'off'

const BEATS: readonly Beat[] = ['hop', 'sit', 'off']
const TRACK: Record<Beat, string> = { hop: turn.hopIn, sit: turn.sit, off: turn.hopOff }
const PLAY: Record<Beat | 'gone', string> = { hop: 'idle', sit: 'on', off: 'on', gone: 'done' }

function Monster({ beat, onStep }: { beat: Beat; onStep: (event: AnimationEvent<Element>) => void }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${turn.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 h-12 w-16 ${turn.place}`}>
        <span className={`block h-full w-full ${TRACK[beat]}`} onAnimationEnd={onStep}>
          <svg viewBox="0 0 16 12" className="block h-full w-full" shapeRendering="crispEdges" focusable="false">
            <PixelArt sprite={MONSTER} />
          </svg>
        </span>
      </span>
    </div>
  )
}

/** The services box, opened and shaken by the monster landing on it. */
export function MonsterTurnBox({ children }: { children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const still = reduced || preview
  const box = (play: string) => (
    <div data-play={play} className={play === 'on' ? turn.shake : ''}>
      <Box className={`${world.opens} ${turn.fromTop}`}>{children}</Box>
    </div>
  )

  if (still) return <div ref={ref}>{box('done')}</div>

  return (
    <div ref={ref} className="relative">
      {triggered ? <TurnBox box={box} /> : box('idle')}
    </div>
  )
}

function TurnBox({ box }: { box: (play: string) => ReactNode }) {
  const beat = usePoseSequence<Beat | 'gone'>({ entrance: BEATS, rest: 'gone' })
  const pose = beat.pose

  return (
    <>
      {box(PLAY[pose])}
      {pose !== 'gone' && <Monster beat={pose} onStep={beat.onOwnAnimationEnd} />}
    </>
  )
}
