'use client'

import { memo } from 'react'
import type { LayerMotion } from '@/lib/scroll/stage'
import { Stage, type StageLayer } from '../shared/theatre/Stage'
import type { TheatreScene } from '../shared/theatre/useTheatre'
import { NO_NODES, figureTransform } from '../shared/figureScene'
import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import { ARENA_LAYERS, GROUND, arenaPlane } from './arena'
import { Calliope } from './boss'
import { sceneEnd, stubPlay, type Playhead, type SceneScript } from './playStub'
import { Effects, type Scene } from './scenes'
import { StageToon, setToonPose, toonJoints } from './toon'
import css from './stage.module.css'

// One scene's picture on the shared theatre (../shared/theatre): the big top's layers (arena.tsx), then the
// fight in the figure layer, in one camera group the writer pushes in on at a big hit: the scene's floor,
// the calliope, him, the effects and the scene's own front (the map of the hero, the knockout lettering).
// The scene's writer plays its script and hands back his place and pose.

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Readonly<Record<string, LayerMotion>> = {
  sky: { zoom: [1.0, 1.02], lift: [0, 0] },
  far: { zoom: [1.0, 1.03], lift: [0, -0.5] },
  mid: { zoom: [1.0, 1.04], lift: [0, -1] },
  near: { zoom: [1.0, 1.05], lift: [0, -1.5] },
  figure: { zoom: [1.0, 1.04], lift: [0, -1] },
}

/** A theatre scene that plays a script on time from its arrival. */
export type PlayedScene = TheatreScene & { script: SceneScript }

/** The scene as the shared theatre runs it: the writer on the playhead, then him placed and posed. */
export const theatreScene = (scene: Scene): PlayedScene => ({
  id: scene.id,
  count: 0,
  script: scene.def.script,
  bind: (stage) => {
    const group = fx(stage, 'figure')
    const joints = group && toonJoints(group)
    const write = scene.def.bind(stage, scene.layout)
    return (progress: number, _reached: number, play?: Playhead) => {
      const state = write(play ?? stubPlay(scene.def.script, progress))
      if (!group || !joints) return
      transformTo(group, figureTransform(state))
      fadeTo(group, state.opacity)
      setToonPose(joints, state.pose)
    }
  },
})

/** Him at the scene's last frame, the one the server draws and reduced motion keeps. */
function Toon({ scene }: { scene: Scene }) {
  const end = scene.def.bind(NO_NODES, scene.layout)(sceneEnd(scene.def.script))
  return (
    <g data-fx="figure" transform={figureTransform(end)}>
      <StageToon profession={scene.kit} turned />
    </g>
  )
}

const layersOf = (scene: Scene): StageLayer[] => [
  ...ARENA_LAYERS,
  {
    name: 'figure',
    node: arenaPlane(
      <g data-fx="camera">
        {scene.def.back(scene.layout, scene.kit)}
        <g data-fx="boss" transform={`translate(${scene.layout.boss} ${GROUND}) scale(${scene.layout.bossK})`}>
          <Calliope kit={scene.def.kit} />
        </g>
        {scene.def.him && <Toon scene={scene} />}
        <Effects kit={scene.kit} />
        {scene.def.front?.(scene.layout)}
      </g>,
    ),
  },
]

/** A scene's stage in the theatre or, `settled`, still at the top of its own section under reduced motion. */
export const HoseStage = memo(function HoseStage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  return <Stage scene={theatreScene(scene)} layers={layersOf(scene)} motion={LAYER_MOTION} settled={settled} className={css.reel} />
})
