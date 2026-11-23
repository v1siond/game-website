'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform, type FigureRig } from '../shared/figureScene'
import { frames } from '../shared/stageNodes'
import { StageFigure, type Frame } from './walker'
import type { Scene } from './scenes'
import { VIEW, ZONE_ART } from './zones'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the place's layers from its back wall to
// the floor he walks on, then the scene's props and him in the figure layer, all on the game's hard pixel
// grid. The shared engine fades each stage and pushes its layers in; the scene's writer lights its props
// and hands back his place and frame.

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
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, scene.def.bind, WALKER_RIG)

const plane = (children: ReactNode): ReactNode => (
  <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" focusable="false">
    {children}
  </svg>
)

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
  const { sky: Sky, far: Far, mid: Mid, near: Near } = ZONE_ART[scene.def.zone]
  return [
    { name: 'sky', node: plane(<Sky />) },
    { name: 'far', node: plane(<Far />) },
    { name: 'mid', node: plane(<Mid />) },
    { name: 'near', node: plane(<Near />) },
    {
      name: 'figure',
      node: plane(
        <>
          {scene.def.back(scene.layout)}
          <Walker scene={scene} />
        </>,
      ),
    },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const RpgStage = memo(function RpgStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.screen} />
})
