'use client'

import type { ReactNode } from 'react'
import { LaneCameo } from '../shared/LaneCameo'
import { MercSprite, type MercMotion } from './merc'
import jack from './jackin.module.css'

// Services, the jack in: the source game's merc opens an access point by jacking the cable from his
// temple into it, and its screen boots. Pattern: the shared LaneCameo starts it once and walks three
// beats, each ended by its own CSS animation on his track:
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

const merc = (beat: Beat) => <MercSprite profession="engineer" motion={MOTION[beat]} className="h-full w-full" />

/** Services: the HUD panel switches on from the cable he jacks into it. */
export function JackIn({ children }: { children: ReactNode }) {
  return (
    <LaneCameo beats={BEATS} track={TRACK} lane={jack.lane} place={`h-32 w-20 ${jack.place}`} reaction={{ playing: jack.boot, idle: jack.dark }} figure={merc}>
      {children}
    </LaneCameo>
  )
}
