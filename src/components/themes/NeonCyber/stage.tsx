'use client'

import { memo, type ReactNode } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { DISTRICT_ART, Far, Mid, Near, PHONE_VIEW, Rain, VIEW } from './city'
import { HeroFigure } from './figure'
import { heroJoints, setHeroPose } from './pose'
import { GROUND, type Scene, type SceneSide } from './scenes'
import { NO_NODES, figureScene, figureTransform } from '../shared/figureScene'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the city's layers from the far towers to
// the rain, the scene's props and him in the figure layer. The shared engine fades each stage and pushes
// its layers in; the scene's writer moves its props and the camera over the figure layer, and hands back his
// place and pose, written here.
//
// The sections alternate sides: a scene on the left half has its figure layer (him, his props, the camera)
// drawn on the left half from lg and its scrim under the cards on the right (stage.module.css); below md, where
// cards and picture are stacked, the figure layer leans to the half the section names. The city stays put.

/** The figure layer's place and the scrim per side; the hero keeps its own. */
const PLAYS: Record<SceneSide, { figure: string; visor: string }> = {
  right: { figure: css.leansRight, visor: '' },
  left: { figure: `${css.playsLeft} ${css.leansLeft}`, visor: css.cardsRight },
}

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.05], lift: [0, 0] },
  district: { zoom: [1.02, 1.09], lift: [0, -1] },
  mid: { zoom: [1.04, 1.13], lift: [0, -2] },
  near: { zoom: [1.06, 1.17], lift: [0, -3] },
  figure: { zoom: [1.06, 1.17], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}

const HERO_RIG = { joints: heroJoints, pose: setHeroPose }

/** The scene as the shared theatre runs it: the props' writer, then him placed and posed from what it returns. */
export const theatreScene = (scene: Scene): TheatreScene => figureScene(scene.id, scene.layout, scene.def.bind, HERO_RIG, scene.def.script)

/** A layer's picture: the whole city from its foot on a wide screen; on a phone, the view from its top that
 *  keeps the street about half way down the screen, clear of the cards (city.tsx PHONE_VIEW). */
const plane = (children: ReactNode, phone: boolean): ReactNode => (
  <svg viewBox={phone ? PHONE_VIEW : VIEW} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} focusable="false">
    {children}
  </svg>
)

/** Him at his first frame's place; the hero's group is the figure the World Select shots frame. */
function Hero({ scene }: { scene: Scene }) {
  const first = scene.def.bind(NO_NODES, scene.layout)(0, 0)
  return (
    <g data-fx="figure" data-worlds-figure={scene.id === 'hero' ? '' : undefined} transform={figureTransform(first)}>
      <svg x={-50} y={-144} width={100} height={150} viewBox="0 0 100 150" overflow="visible">
        <HeroFigure profession={scene.kit} motion="still" snare={scene.id === 'bands'} />
      </svg>
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => {
  const District = DISTRICT_ART[scene.def.district]
  const { phone } = scene.layout
  return [
    { name: 'sky', node: plane(<Far uid={scene.id} />, phone) },
    { name: 'district', node: plane(<District uid={scene.id} />, phone) },
    { name: 'mid', node: plane(<Mid />, phone) },
    { name: 'near', node: plane(<Near />, phone) },
    {
      name: 'figure',
      node: plane(
        <g className={scene.side ? PLAYS[scene.side].figure : undefined}>
          <g data-fx="camera">
            <ellipse cx={scene.layout.cx} cy={GROUND + 6} rx={360} ry={18} fill="var(--neon-magenta)" opacity={0.08} />
            {scene.def.back(scene.layout)}
            <Hero scene={scene} />
            {scene.def.front(scene.layout)}
          </g>
        </g>,
        phone,
      ),
    },
    { name: 'fg', node: plane(<Rain />, phone) },
  ]
}

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const NeonStage = memo(function NeonStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  const visor = scene.side ? PLAYS[scene.side].visor : ''
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={`${css.visor} ${visor}`} />
})
