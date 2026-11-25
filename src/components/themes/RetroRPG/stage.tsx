'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform, type FigureRig } from '../shared/figureScene'
import { frames } from '../shared/stageNodes'
import { StageFigure, type Frame } from './walker'
import { PHONE_PIVOT, type Scene } from './scenes'
import { PHONE_VIEW, PICTURE_BOTTOM, VIEW, ZONE_ART } from './zones'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the place's layers from its back wall to
// the floor he walks on, then the scene's cast and props, him, what stands in front of him (the marsh's tall
// grass) and over all of it the battle screen when the scene cuts to one, in the figure layer, in one camera
// group the view pushes in with, all on the genre's hard pixel grid. The shared engine fades each stage and pushes its layers in; the scene's writer moves its props at
// the playhead and hands back his place and frame.

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.03], lift: [0, 0] },
  far: { zoom: [1.02, 1.07], lift: [0, -1] },
  mid: { zoom: [1.04, 1.1], lift: [0, -2] },
  near: { zoom: [1.06, 1.14], lift: [0, -3] },
  figure: { zoom: [1.06, 1.14], lift: [0, -3] },
}

/** His frames swap the way sprite frames do: one shown at a time. */
const WALKER_RIG: FigureRig<(frame: string) => void, Frame> = {
  joints: (group) => frames(group, 'stand'),
  pose: (show, frame) => show(frame),
}

/** The scene as the shared theatre runs it: the props' writer, then him placed and framed from what it returns. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, scene.def.bind, WALKER_RIG, scene.def.script)

/** A layer's picture: the whole room from its foot on a wide screen; on a phone, the view from its top that
 *  keeps the floor half way down the screen (zones.tsx PHONE_VIEW). */
const plane = (children: ReactNode, phone: boolean): ReactNode => (
  <svg viewBox={phone ? PHONE_VIEW : VIEW} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} shapeRendering="crispEdges" focusable="false">
    {children}
  </svg>
)

/** On a phone the room is drawn at half size round the middle of its floor, so he and the one he meets both
 *  fit the narrow view whole; the battle screen over it keeps its own phone size. */
const PHONE_ROOM = `translate(${PHONE_PIVOT.x} ${PHONE_PIVOT.y}) scale(${PHONE_PIVOT.scale}) translate(${-PHONE_PIVOT.x} ${-PHONE_PIVOT.y})`

/** Him at his first frame's place. */
function Walker({ scene }: { scene: Scene }) {
  const first = scene.def.bind(NO_NODES, scene.layout)(0, 0)
  return (
    <g data-fx="figure" transform={figureTransform(first)}>
      <StageFigure profession={scene.kit} />
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => {
  const { sky: Sky, far: Far, mid: Mid, near: Near, floor } = ZONE_ART[scene.def.zone]
  const { phone } = scene.layout
  return [
    { name: 'sky', node: plane(<Sky />, phone) },
    { name: 'far', node: plane(<Far />, phone) },
    { name: 'mid', node: plane(<Mid />, phone) },
    {
      name: 'near',
      node: plane(
        <>
          <Near />
          {phone && <rect x={-200} y={PICTURE_BOTTOM} width={1840} height={400} fill={floor} />}
        </>,
        phone,
      ),
    },
    {
      name: 'figure',
      node: plane(
        <g data-fx="camera">
          <g transform={phone ? PHONE_ROOM : undefined}>
            {scene.def.back(scene.layout, scene.kit, scene.name)}
            <Walker scene={scene} />
            {scene.def.front?.(scene.layout)}
          </g>
          {scene.def.screen?.(scene.layout)}
        </g>,
        phone,
      ),
    },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const RpgStage = memo(function RpgStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.screen} />
})
