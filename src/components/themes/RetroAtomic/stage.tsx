'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureScene, figureTransform } from '../shared/figureScene'
import { DWELLER_VIEW, DwellerFigure } from './dweller'
import { dwellerJoints, setDwellerPose } from './pose'
import { inputOf, placeScale, sceneSpot, sceneWriter, type Scene } from './scenes'
import { GROUND, PHONE_VIEW, VIEW, ZONE_ART, ZONE_FLOOR } from './zones'
import { POSTER_INK } from './palette'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the place's layers from its sky to the
// ground he stands on, the place's art round his spot and him in the figure layer. The shared engine fades
// each stage and pushes its layers in; the scene's writer plays the place and hands back his frame. Each
// plane's art sits in a group (data-fx="cam-<layer>") the targeting shot's camera pushes in on. On a phone the
// planes show a taller view from higher up the canvas, the ground half way down the screen, and the near
// plane carries the floor on below the canvas.

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.02, 1.08], lift: [0, -1] },
  mid: { zoom: [1.04, 1.12], lift: [0, -2] },
  near: { zoom: [1.06, 1.16], lift: [0, -3] },
  figure: { zoom: [1.06, 1.16], lift: [0, -3] },
}

const DWELLER_RIG = { joints: dwellerJoints, pose: setDwellerPose }

/** The scene as the shared theatre runs it: its script played by the scroll, him placed and posed each frame. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, (stage) => sceneWriter(scene)(stage), DWELLER_RIG, scene.def.script)

/** A layer's plane over the place's view, its art in the group the camera pushes in. */
const plane = (name: string, phone: boolean, children: ReactNode): ReactNode => (
  <svg viewBox={phone ? PHONE_VIEW : VIEW} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} focusable="false">
    <g data-fx={`cam-${name}`}>{children}</g>
  </svg>
)

/** Him at his first frame's place. */
function Dweller({ scene }: { scene: Scene }) {
  const first = sceneWriter(scene)(NO_NODES)(0, 0)
  return (
    <g data-fx="figure" transform={figureTransform(first)} opacity={first.opacity}>
      <svg x={-52} y={-DWELLER_VIEW.soles} width={DWELLER_VIEW.width} height={DWELLER_VIEW.height} viewBox={`0 0 ${DWELLER_VIEW.width} ${DWELLER_VIEW.height}`} overflow="visible">
        <DwellerFigure profession={scene.kit} />
      </svg>
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => {
  const { zone, back, front } = scene.def
  const { sky: Sky, far: Far, mid: Mid, near: Near } = ZONE_ART[zone]
  const { phone } = scene.layout
  const input = inputOf(scene)
  const spot = sceneSpot(scene)
  const at = `translate(${spot} ${GROUND[zone]}) scale(${placeScale(phone)})`
  return [
    { name: 'sky', node: plane('sky', phone, <Sky uid={scene.id} />) },
    { name: 'far', node: plane('far', phone, <Far />) },
    { name: 'mid', node: plane('mid', phone, <Mid />) },
    {
      name: 'near',
      node: plane(
        'near',
        phone,
        <>
          <Near uid={scene.id} />
          {phone && <rect x={-400} y={896} width={2240} height={600} fill={ZONE_FLOOR[zone]} />}
        </>,
      ),
    },
    {
      name: 'figure',
      node: plane(
        'figure',
        phone,
        <>
          <ellipse cx={spot + 60} cy={GROUND[zone] + 4} rx={300} ry={14} fill={POSTER_INK} opacity={0.12} />
          <g transform={at}>{back(input)}</g>
          <Dweller scene={scene} />
          {front && <g transform={at}>{front(input)}</g>}
        </>,
      ),
    },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const AtomicStage = memo(function AtomicStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.tube} />
})
