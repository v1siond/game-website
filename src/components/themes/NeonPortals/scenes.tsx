import { memo } from 'react'
import type { SceneId } from './plan'
import type { SetInput, SetPiece } from './sets/kit'
import css from './corridor.module.css'

// The set pieces over the machine's passage: one fixed full screen picture per scene (the hero's fall, then
// each room's era), each its sky and its box of place and cast (sets/). The corridor (corridor.tsx) zooms
// each in and out over the tunnel (cover.ts), places its box on the screen and plays its script. Before the
// first draw only the hero's shows, so the server drawn page already has him.

export interface SceneSpec {
  id: SceneId
  set: SetPiece
  input: SetInput
}

/** One scene's picture. */
export const SceneView = memo(function SceneView({ spec, first }: { spec: SceneSpec; first: boolean }) {
  const { id, set, input } = spec
  const sky = `np-sky-${id}`
  return (
    <div data-np-scene={id} className={`${css.scene} ${first ? css.sceneFirst : ''}`}>
      <svg className={css.sceneArt} focusable="false">
        <defs>
          <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={set.sky[0]} />
            <stop offset="1" stopColor={set.sky[1]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${sky})`} />
        <g data-np="box">{set.art(input)}</g>
      </svg>
    </div>
  )
})
