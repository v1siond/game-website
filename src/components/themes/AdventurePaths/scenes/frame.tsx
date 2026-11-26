import type { ReactNode } from 'react'
import type { StageLayer } from '../../shared/theatre/Stage'
import { fadeTo, frames, fx, r1, transformTo } from '../../shared/stageNodes'
import type { FoeFrame } from '../side'
import { CRITTER_FRAMES, Canvas, FOE_TALL, FoeRig, GROUND, HeroRig } from './kit'
import type { LevelInput } from './level'
import { WorldMap } from './worldMap'

// The layers every level stacks on the shared canvas, back to front: its sky, far and mid hills, the
// ground, the things he plays with and him (in one camera group, drawn the other way round in a level a phone
// turns), the foreground, and the world map the level opens from. A foe is a FoeRig facing him, placed and framed by its writer.

export interface LevelArt {
  sky: ReactNode
  far?: ReactNode
  mid?: ReactNode
  near: ReactNode
  /** The things behind him. */
  things: ReactNode
  /** The things in front of him. */
  front?: ReactNode
  fg?: ReactNode
}

/** The middle of a phone's view of the canvas (x 570 to 1030), the line a turned level is drawn round. */
export const PHONE_MIDDLE = 800

const TURN = `translate(${2 * PHONE_MIDDLE} 0) scale(-1 1)`

export function levelLayers(art: LevelArt, input: LevelInput, map = true): StageLayer[] {
  const layers: StageLayer[] = [
    { name: 'sky', node: <Canvas>{art.sky}</Canvas> },
    { name: 'far', node: <Canvas>{art.far}</Canvas> },
    { name: 'mid', node: <Canvas>{art.mid}</Canvas> },
    { name: 'near', node: <Canvas>{art.near}</Canvas> },
    {
      name: 'figure',
      node: (
        <Canvas>
          <g transform={input.turned ? TURN : undefined}>
            <g data-fx="camera">
              {art.things}
              <HeroRig profession={input.profession} />
              {art.front}
            </g>
          </g>
        </Canvas>
      ),
    },
    { name: 'fg', node: <Canvas>{art.fg}</Canvas> },
  ]
  return map ? [...layers, { name: 'map', node: <WorldMap phone={input.phone} left={input.left} profession={input.profession} at={input.at} /> }] : layers
}

interface FoeProps {
  name: string
  x: number
  y?: number
  kinds?: readonly FoeFrame[]
  /** Its size against a walker's. */
  size?: number
  /** What rides with it, in its own units: a helmet, spikes. */
  children?: ReactNode
}

/** A foe facing left at him, its feet at (x, y). */
export function Foe({ name, x, y = GROUND, kinds = CRITTER_FRAMES, size = 1, children }: FoeProps) {
  return (
    <g data-fx={`${name}-at`} transform={`translate(${x} ${y})`}>
      <g transform={`scale(${size})`}>
        <g transform="scale(-1 1)">
          <FoeRig name={name} kinds={kinds} />
        </g>
        {children}
      </g>
    </g>
  )
}

/** A foe's writer: where its feet are, which frame shows, how far it is turned and how visible it is. */
export function foeOf(stage: ParentNode, name: string, first: FoeFrame = 'critterA'): (x: number, y: number, frame: FoeFrame, spin?: number, opacity?: number) => void {
  const at = fx(stage, `${name}-at`)
  const show = frames(fx(stage, name), first)
  return (x, y, frame, spin = 0, opacity = 1) => {
    transformTo(at, `translate(${r1(x)} ${r1(y)})${spin ? ` rotate(${r1(spin)} 0 ${-FOE_TALL / 2})` : ''}`)
    show(frame)
    fadeTo(at, opacity)
  }
}
