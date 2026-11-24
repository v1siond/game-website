import type { StageItems } from '@/lib/cv/stageItems'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import type { TheatreScene } from './theatre/useTheatre'
import { fadeTo, fx, r1, spread, transformTo } from './stageNodes'

// A theatre scene with one jointed figure walking a row of props, one prop per card its section counts
// (Neon Cyber's merc, Retro Atomic's dweller): the props spread over the band of the stage beside the text
// column, the world's writer moving them and handing back the figure's place and pose each frame, and the
// figure's group (data-fx="figure") placed from that. The pose itself is the world's (on rigPose and rig.ts).

/** What a writer reads its nodes from: a stage, or NO_NODES to work out the figure's place alone. */
export type StageNodes = Pick<ParentNode, 'querySelector'>

export const NO_NODES: StageNodes = { querySelector: () => null }

/** The props `name-0` to `name-(count - 1)` of a stage. */
export const fxs = (stage: StageNodes, name: string, count: number): Array<Element | null> => Array.from({ length: count }, (_, i) => fx(stage, `${name}-${i}`))

/** Where a scene's props stand: one x per prop over the band, `cx` its middle. */
export interface PropLayout {
  /** The props, one per card after the lead. */
  count: number
  /** The cards counted before the props (the Muay Thai record's facts), taken off before a writer reads them. */
  lead: number
  xs: number[]
  cx: number
  phone: boolean
}

/** The props of `items` spread over `band`, the stretch of the stage the screen shows beside the text. */
export const propLayout = ({ lead, count }: StageItems, band: readonly [number, number], phone: boolean): PropLayout => ({
  count,
  lead,
  xs: spread(Math.max(count, 1), band[0], band[1]),
  cx: (band[0] + band[1]) / 2,
  phone,
})

/** The figure in a frame: where its feet are, its size, its pose and how visible it is. */
export interface FigureState<Pose> {
  x: number
  y: number
  k: number
  pose: Pose
  opacity: number
}

/** A scene's frame at progress p with f props' cards reached and its script at `play`; it moves the props
 *  (none: its first frame) and returns the figure. */
export type FigureWriter<Pose> = (p: number, f: number, play?: Playhead) => FigureState<Pose>

/** How a world finds its figure's joints in the figure group and writes a pose on them. */
export interface FigureRig<Joints, Pose> {
  joints: (group: Element) => Joints
  pose: (joints: Joints, pose: Pose) => void
}

/** The figure's place and size as its group's transform: the one string the first paint and every frame write. */
export const figureTransform = ({ x, y, k }: Pick<FigureState<unknown>, 'x' | 'y' | 'k'>): string => `translate(${r1(x)} ${r1(y)}) scale(${k})`

/**
 * The scene as the theatre runs it: the world's writer, bound to the stage, then the figure placed and
 * posed from what it returns. The lead cards are taken off `reached` before the writer reads it. A scene
 * with a `script` plays it on time from its arrival (src/lib/scroll/player.ts).
 */
export function figureScene<Pose, Joints>(
  id: string,
  layout: PropLayout,
  bind: (stage: StageNodes, layout: PropLayout) => FigureWriter<Pose>,
  rig: FigureRig<Joints, Pose>,
  script?: SceneScript,
): TheatreScene {
  return {
    id,
    count: layout.lead + layout.count,
    script,
    bind: (stage) => {
      const group = fx(stage, 'figure')
      const joints = group && rig.joints(group)
      const write = bind(stage, layout)
      return (progress, reached, play) => {
        const state = write(progress, reached - layout.lead, play)
        if (!group || !joints) return
        transformTo(group, figureTransform(state))
        fadeTo(group, state.opacity)
        rig.pose(joints, state.pose)
      }
    },
  }
}
