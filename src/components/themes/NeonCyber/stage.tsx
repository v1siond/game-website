'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { DISTRICT_ART, Far, Mid, Near, Rain, VIEW } from './city'
import { MercFigure } from './merc'
import { mercJoints, setMercPose, type MercJoints } from './pose'
import { GROUND, NO_NODES, type MercState, type Scene } from './scenes'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the city's layers from the far towers to
// the rain, the scene's props and him in the figure layer. The shared engine fades each stage and pushes
// its layers in; the scene's writer moves its props and hands back his place and pose, written here.

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.05], lift: [0, 0] },
  district: { zoom: [1.02, 1.09], lift: [0, -1] },
  mid: { zoom: [1.04, 1.13], lift: [0, -2] },
  near: { zoom: [1.06, 1.17], lift: [0, -3] },
  figure: { zoom: [1.06, 1.17], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}

/** His place and pose written on his group; transforms and opacity only. */
function placeMerc(group: SVGGElement | null, joints: MercJoints | null, { x, y, k, pose, opacity }: MercState): void {
  if (!group || !joints) return
  group.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k})`)
  group.setAttribute('opacity', opacity.toFixed(3))
  setMercPose(joints, pose)
}

/** The scene as the shared theatre runs it: its props' writer, then him placed from what it returns. The
 *  cards it counts before its props (the record's facts) are taken off before the writer reads them. */
export const theatreScene = (scene: Scene): TheatreScene => ({
  id: scene.id,
  count: scene.layout.lead + scene.layout.count,
  bind: (stage) => {
    const group = stage.querySelector<SVGGElement>('[data-fx="merc"]')
    const joints = group && mercJoints(group)
    const write = scene.def.bind(stage, scene.layout)
    return (progress, reached) => placeMerc(group, joints, write(progress, reached - scene.layout.lead))
  },
})

const plane = (children: ReactNode): ReactNode => (
  <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" focusable="false">
    {children}
  </svg>
)

/** Him at his first frame's place; the hero's group is the figure the World Select shots frame. */
function Merc({ scene }: { scene: Scene }) {
  const first = scene.def.bind(NO_NODES, scene.layout)(0, 0)
  return (
    <g data-fx="merc" data-worlds-figure={scene.id === 'hero' ? '' : undefined} transform={`translate(${first.x.toFixed(1)} ${first.y.toFixed(1)}) scale(${first.k})`}>
      <svg id={`nc-merc-${scene.id}`} x={-50} y={-144} width={100} height={150} viewBox="0 0 100 150" overflow="visible">
        <MercFigure profession={scene.kit} motion="still" />
      </svg>
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => {
  const District = DISTRICT_ART[scene.def.district]
  return [
    { name: 'sky', node: plane(<Far uid={scene.id} />) },
    { name: 'district', node: plane(<District uid={scene.id} />) },
    { name: 'mid', node: plane(<Mid />) },
    { name: 'near', node: plane(<Near />) },
    {
      name: 'figure',
      node: plane(
        <>
          <ellipse cx={scene.layout.cx} cy={GROUND + 6} rx={360} ry={18} fill="var(--neon-magenta)" opacity={0.08} />
          {scene.def.back(scene.layout)}
          <Merc scene={scene} />
          {scene.def.front(scene.layout)}
        </>,
      ),
    },
    { name: 'fg', node: plane(<Rain />) },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const NeonStage = memo(function NeonStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.optics} />
})
