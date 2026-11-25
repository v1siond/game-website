'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform, type FigureRig } from '../shared/figureScene'
import type { RigJoints } from '../shared/rig'
import { StageFigure, figureJoints, setFigurePose, type FigurePose } from './character'
import { Partner, partnerTransform } from './partner'
import { inputOf, partnerAt, placeScale, sceneSpot, sceneWriter, type Scene } from './scenes'
import { ToneScope } from './scenery'
import { GROUND, PHONE_VIEW, PhoneFloor, VIEW, ZONE_ART } from './zones'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the place's layers from its sky to the
// ground he stands on, in the place's tone, then the place's things round his spot and him in the figure
// layer. The shared engine fades each stage and pushes its layers in (the parallax of the rendered jungle);
// the scene's writer plays the place and hands back his frame. On a phone the planes show a taller view from
// higher up the canvas, the ground half way down the screen, and the mid plane carries it on below the canvas.

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

/** The scene as the shared theatre runs it: its script played by the scroll, him placed and posed each frame. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, (stage) => sceneWriter(scene)(stage), FIGURE_RIG, scene.def.script)

/** The partner at his first frame's place, where the place has him. */
function PartnerFigure({ scene }: { scene: Scene }) {
  if (!scene.def.partner) return null
  const first = partnerAt(scene, 0)
  return <Partner transform={partnerTransform(first, sceneSpot(scene), GROUND, placeScale(scene))} opacity={first.opacity ?? 1} />
}

/** One plane of the picture in the scene's tone, over the place's view. */
const plane = (scene: Scene, children: ReactNode): ReactNode => {
  const { phone } = scene.layout
  return (
    <ToneScope tone={scene.def.zone} className="h-full w-full">
      <svg viewBox={phone ? PHONE_VIEW : VIEW} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} className="h-full w-full" focusable="false">
        {children}
      </svg>
    </ToneScope>
  )
}

/** Him at his first frame's place, in the group his tumbles turn; in the hero he is the world's figure. */
function Figure({ scene }: { scene: Scene }) {
  const first = sceneWriter(scene)(NO_NODES)(0, 0)
  return (
    <g data-fx="figure" data-worlds-figure={scene.id === 'hero' ? '' : undefined} transform={figureTransform(first)} opacity={first.opacity}>
      <g data-fx="tumble">
        <StageFigure profession={scene.kit} />
      </g>
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => {
  const { zone, back, front } = scene.def
  const { sky: Sky, far: Far, mid: Mid, near: Near } = ZONE_ART[zone]
  const input = inputOf(scene)
  const at = `translate(${sceneSpot(scene)} ${GROUND}) scale(${placeScale(scene)})`
  return [
    { name: 'sky', node: plane(scene, <Sky />) },
    { name: 'far', node: plane(scene, <Far />) },
    {
      name: 'mid',
      node: plane(
        scene,
        <>
          <Mid />
          {scene.layout.phone && <PhoneFloor />}
        </>,
      ),
    },
    { name: 'near', node: plane(scene, <Near />) },
    {
      name: 'figure',
      node: plane(
        scene,
        <>
          <g transform={at}>{back(input)}</g>
          <Figure scene={scene} />
          <PartnerFigure scene={scene} />
          {front && <g transform={at}>{front(input)}</g>}
        </>,
      ),
    },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const JungleStage = memo(function JungleStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.screen} />
})
