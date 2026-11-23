'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform, type FigureRig } from '../shared/figureScene'
import type { RigJoints } from '../shared/rig'
import { StageFigure, figureJoints, setFigurePose, type FigurePose } from './character'
import type { Scene } from './scenes'
import { ToneScope } from './scenery'
import { VIEW, ZONE_ART } from './zones'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the place's layers from its sky to the
// ground he stands on, in the place's tone, then the scene's stops, him and what stands in front of him in
// the figure layer, in one camera group the view pushes in on at a big hit. The shared engine fades each
// stage and pushes its layers in; the scene's writer plays its stops' answers and hands back his place and
// pose.

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.02, 1.08], lift: [0, -1] },
  mid: { zoom: [1.04, 1.12], lift: [0, -2] },
  near: { zoom: [1.06, 1.16], lift: [0, -3] },
  figure: { zoom: [1.06, 1.16], lift: [0, -3] },
}

/** His limbs turn on the shared rig. */
const FIGURE_RIG: FigureRig<RigJoints, FigurePose> = { joints: figureJoints, pose: setFigurePose }

/** The scene as the shared theatre runs it: the stops' writer, then him placed and posed from what it returns. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, scene.def.bind, FIGURE_RIG)

/** One plane of the picture in the scene's tone. */
const plane = (scene: Scene, children: ReactNode): ReactNode => (
  <ToneScope tone={scene.def.zone} className="h-full w-full">
    <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" className="h-full w-full" focusable="false">
      {children}
    </svg>
  </ToneScope>
)

/** Him at his first frame's place. */
function Figure({ scene }: { scene: Scene }) {
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
    { name: 'sky', node: plane(scene, <Sky />) },
    { name: 'far', node: plane(scene, <Far />) },
    { name: 'mid', node: plane(scene, <Mid />) },
    { name: 'near', node: plane(scene, <Near />) },
    {
      name: 'figure',
      node: plane(
        scene,
        <g data-fx="camera">
          {scene.def.back(scene.layout)}
          <Figure scene={scene} />
          {scene.def.front?.(scene.layout)}
        </g>,
      ),
    },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const JungleStage = memo(function JungleStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.screen} />
})
