'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform } from '../shared/figureScene'
import { DwellerFigure } from './dweller'
import { dwellerJoints, setDwellerPose } from './pose'
import type { Scene } from './scenes'
import { GROUND, VIEW, ZONE_ART } from './zones'
import { POSTER_INK } from './palette'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the place's layers from its sky to the
// ground he walks on, the scene's props and him in the figure layer. The shared engine fades each stage
// and pushes its layers in; the scene's writer moves its props and hands back his place and pose.

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.02, 1.08], lift: [0, -1] },
  mid: { zoom: [1.04, 1.12], lift: [0, -2] },
  near: { zoom: [1.06, 1.16], lift: [0, -3] },
  figure: { zoom: [1.06, 1.16], lift: [0, -3] },
}

const DWELLER_RIG = { joints: dwellerJoints, pose: setDwellerPose }

/** The scene as the shared theatre runs it: the props' writer, then him placed and posed from what it returns. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, scene.def.bind, DWELLER_RIG)

const plane = (children: ReactNode): ReactNode => (
  <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" focusable="false">
    {children}
  </svg>
)

/** Him at his first frame's place. */
function Dweller({ scene }: { scene: Scene }) {
  const first = scene.def.bind(NO_NODES, scene.layout)(0, 0)
  return (
    <g data-fx="figure" transform={figureTransform(first)}>
      <svg x={-50} y={-144} width={100} height={150} viewBox="0 0 100 150" overflow="visible">
        <DwellerFigure profession={scene.kit} motion="still" radio={scene.def.radio ?? false} />
      </svg>
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => {
  const { sky: Sky, far: Far, mid: Mid, near: Near } = ZONE_ART[scene.def.zone]
  return [
    { name: 'sky', node: plane(<Sky uid={scene.id} />) },
    { name: 'far', node: plane(<Far />) },
    { name: 'mid', node: plane(<Mid />) },
    { name: 'near', node: plane(<Near uid={scene.id} />) },
    {
      name: 'figure',
      node: plane(
        <>
          <ellipse cx={scene.layout.cx} cy={GROUND[scene.def.zone] + 4} rx={340} ry={14} fill={POSTER_INK} opacity={0.12} />
          {scene.def.back(scene.layout)}
          <Dweller scene={scene} />
          {scene.def.front(scene.layout)}
        </>,
      ),
    },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const AtomicStage = memo(function AtomicStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.tube} />
})
