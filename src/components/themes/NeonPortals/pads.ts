import type { Profession } from '@/lib/cv/professions'
import { project, type FramePoint, type Lens, type Vec3 } from './lens'

// The warp room's three pads, one per profession in the switch's order, on an arc at the front of the round
// platform, and the stage camera that looks at them. The figure canvas (his own, the hero's
// data-worlds-figure) stands on the picked pad: its place on the stage comes from projecting the pad through
// this same lens, so the DOM can place him before three.js has loaded and the 3D pad sits under his feet.

export const PAD_SPOTS: Readonly<Record<Profession, Vec3>> = {
  engineer: [-2.3, 0, 1.3],
  drummer: [0, 0, 2.1],
  fighter: [2.3, 0, 1.3],
}

export const PAD_ORDER: readonly Profession[] = ['engineer', 'drummer', 'fighter']

/** The stage window is 5 by 4 at every width. */
const STAGE_ASPECT = 5 / 4

export const STAGE_LENS: Lens = { position: [0, 5.4, 9.2], target: [0, 1.3, 0], fov: 42, aspect: STAGE_ASPECT }

export const padsOnScreen = (lens: Lens): FramePoint[] => PAD_ORDER.map((profession) => project(PAD_SPOTS[profession], lens))
