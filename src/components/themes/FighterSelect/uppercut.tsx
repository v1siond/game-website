'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { usePreview } from '@/themes/PreviewContext'
import type { FighterPose } from './poses'
import { Fighter } from './fighter'
import { ImpactBurst } from './badges'
import upper from './uppercut.module.css'

// Services, the rising uppercut: the source game's anti air special leaps straight up fist first and
// launches what it catches with a burst at the fist. Pattern: the shared section trigger starts it once;
// the shared pose sequence walks three beats, each ended by its own animation on his track:
//   walk   0 to 600 ms     he walks in from the left along the card grid's top edge to its middle
//   rise   600 to 1360 ms  the uppercut; at 760 ms the burst flashes at his fist and the hidden cards are
//                          launched up into place together (420 ms)
//   leave  1360 to 1660 ms he lands in his stance and fades
// Then he unmounts and the cards rest exactly as they did without him. Reduced motion and a World Select
// preview show the cards in place with no fighter. Transforms and opacity only (uppercut.module.css).

type Beat = 'walk' | 'rise' | 'leave'

const BEATS: readonly Beat[] = ['walk', 'rise', 'leave']
const POSE: Record<Beat, FighterPose> = { walk: 'walk', rise: 'shoryuken', leave: 'stance' }
const TRACK: Record<Beat, string> = { walk: upper.walkIn, rise: upper.riseHold, leave: upper.fadeOff }

function Riser() {
  const beat = usePoseSequence<Beat | 'gone'>({ entrance: BEATS, rest: 'gone' })
  const pose = beat.pose
  if (pose === 'gone') return null

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${upper.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 h-28 w-[6.6rem] ${upper.place}`}>
        <span className={`block h-full w-full ${TRACK[pose]}`} onAnimationEnd={beat.onOwnAnimationEnd}>
          <Fighter profession="engineer" pose={POSE[pose]} className="h-full w-full" />
        </span>
        {pose === 'rise' && <ImpactBurst className={`absolute -top-6 left-1/2 h-14 w-14 ${upper.burst}`} />}
      </span>
    </div>
  )
}

/** Services: the fight cards launched into place by his uppercut. */
export function UppercutLaunch({ children }: { children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const still = reduced || preview
  const playing = triggered && !still
  const reaction = playing ? upper.launched : upper.sunk

  return (
    <div ref={ref} className="relative">
      <div className={still ? '' : reaction}>{children}</div>
      {playing && <Riser />}
    </div>
  )
}
