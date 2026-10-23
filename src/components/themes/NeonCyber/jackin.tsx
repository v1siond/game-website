'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { usePreview } from '@/themes/PreviewContext'
import { MercSprite, type MercMotion } from './merc'
import jack from './jackin.module.css'

// Services, the jack in: the source game's merc opens an access point by jacking the cable from his
// temple into it, and its screen boots. Pattern: the shared section trigger starts it once; the shared
// pose sequence walks three beats, each ended by its own CSS animation on his track:
//   land   0 to 700 ms     he double jumps in from the right onto the panel's top edge, at its right
//                          where the panel above has no words (the rig's jump)
//   jack   700 to 1400 ms  the hack pose, cable out; the panel boots from its top line at 760 ms with
//                          two flickers and is whole at 1160 ms
//   leave  1400 to 1800 ms he hops off up and right and fades
// Then he unmounts and the panel rests exactly as it did without him. Reduced motion and a World Select
// preview show the panel in place with no figure. Transforms and opacity only (jackin.module.css).

type Beat = 'land' | 'jack' | 'leave'

const BEATS: readonly Beat[] = ['land', 'jack', 'leave']
const MOTION: Record<Beat, MercMotion> = { land: 'jump', jack: 'hack', leave: 'jump' }
const TRACK: Record<Beat, string> = { land: jack.landIn, jack: jack.jackHold, leave: jack.hopOff }

function Jacker() {
  const beat = usePoseSequence<Beat | 'gone'>({ entrance: BEATS, rest: 'gone' })
  const pose = beat.pose
  if (pose === 'gone') return null

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${jack.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 h-32 w-20 ${jack.place}`}>
        <span className={`block h-full w-full ${TRACK[pose]}`} onAnimationEnd={beat.onOwnAnimationEnd}>
          <MercSprite profession="engineer" motion={MOTION[pose]} className="h-full w-full" />
        </span>
      </span>
    </div>
  )
}

/** Services: the HUD panel switches on from the cable he jacks into it. */
export function JackIn({ children }: { children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const still = reduced || preview
  const playing = triggered && !still
  const reaction = playing ? jack.boot : jack.dark

  return (
    <div ref={ref} className="relative">
      <div className={still ? '' : reaction}>{children}</div>
      {playing && <Jacker />}
    </div>
  )
}
