'use client'

import type { ReactNode } from 'react'
import { LaneCameo } from '../shared/LaneCameo'
import type { FighterPose } from './poses'
import { Fighter } from './fighter'
import { ImpactBurst } from './badges'
import upper from './uppercut.module.css'

// Services, the rising uppercut: the source game's anti air special leaps straight up fist first and
// launches what it catches with a burst at the fist. Pattern: the shared LaneCameo starts it once and walks
// three beats, each ended by its own animation on his track:
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

// The burst at his fist as the uppercut rises.
const BESIDE: Partial<Record<Beat, ReactNode>> = { rise: <ImpactBurst className={`absolute -top-6 left-1/2 h-14 w-14 ${upper.burst}`} /> }

const fighter = (beat: Beat) => <Fighter profession="engineer" pose={POSE[beat]} className="h-full w-full" />

/** Services: the fight cards launched into place by his uppercut. */
export function UppercutLaunch({ children }: { children: ReactNode }) {
  return (
    <LaneCameo
      beats={BEATS}
      track={TRACK}
      lane={upper.lane}
      place={`h-28 w-[6.6rem] ${upper.place}`}
      reaction={{ playing: upper.launched, idle: upper.sunk }}
      figure={fighter}
      beside={BESIDE}
    >
      {children}
    </LaneCameo>
  )
}
