'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform } from '../shared/figureScene'
import { SurvivorFigure } from './figure'
import { setSurvivorPose, survivorJoints } from './pose'
import { RoomArt } from './rooms'
import { VIEW, type Scene } from './scenes'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the room as the fixed camera sees it, then
// the scene's props and him in the figure layer over it. The shared engine fades each stage in and out; the
// room and the figure layer move together and barely at all, the genre's fixed camera, and the scene's
// writer moves its props and, in two scenes, the camera over the figure layer, handing back his place and
// pose, written here.

/** Each layer's push in across its scene: the room and its figures together, a slow breath. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  room: { zoom: [1.0, 1.03], lift: [0, 0] },
  figure: { zoom: [1.0, 1.03], lift: [0, 0] },
}

const SURVIVOR_RIG = { joints: survivorJoints, pose: setSurvivorPose }

/** The scene as the shared theatre runs it: the props' writer, then him placed and posed from what it returns. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, scene.def.bind, SURVIVOR_RIG)

const plane = (scene: Scene, children: ReactNode): ReactNode => (
  <svg viewBox={VIEW[scene.layout.phone ? 'phone' : 'wide']} preserveAspectRatio="xMidYMax slice" focusable="false">
    {children}
  </svg>
)

/** Him at his first frame's place; the hero's group is the figure the World Select shots frame. */
function Survivor({ scene }: { scene: Scene }) {
  const first = scene.def.bind(NO_NODES, scene.layout)(0, 0)
  return (
    <g data-fx="figure" data-worlds-figure={scene.id === 'hero' ? '' : undefined} transform={figureTransform(first)}>
      <svg x={-50} y={-144} width={100} height={150} viewBox="0 0 100 150" overflow="visible">
        <SurvivorFigure profession={scene.kit} />
      </svg>
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => [
  { name: 'room', node: plane(scene, <RoomArt room={scene.def.room} uid={scene.id} />) },
  {
    name: 'figure',
    node: plane(
      scene,
      <g data-fx="camera">
        {scene.def.back(scene.layout)}
        <Survivor scene={scene} />
        {scene.def.front(scene.layout)}
      </g>,
    ),
  },
]

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const SurvivorStage = memo(function SurvivorStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.camera} />
})
