'use client'

import { useLayoutEffect, useRef, type ReactNode, type Ref } from 'react'
import { layerTransform } from '@/lib/scroll/stage'
import { SETTLED_PROGRESS, movingLayers, type LayerMotions, type TheatreScene } from './useTheatre'
import css from './theatre.module.css'

// One scene's picture: its layers, back to front, and the black veil the engine fades it into. In the
// theatre every stage is a fixed full screen picture behind the text, moved by the engine (useTheatre);
// under reduced motion a stage sits at the top of its own section instead, drawn once at its settled frame
// (the middle of its scene, every card reached). The markup is the picture's first frame, so the server
// drawn hero already shows.

export interface StageLayer {
  name: string
  node: ReactNode
}

interface StageProps {
  scene: TheatreScene
  layers: readonly StageLayer[]
  motion: LayerMotions
  settled?: boolean
  /** The world's own look for the stage: its scrim, its backdrop colour. */
  className?: string
}

export function Stage({ scene, layers, motion, settled = false, className = '' }: StageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = ref.current
    if (!settled || !stage) return
    for (const layer of movingLayers(stage, motion)) layer.el.style.transform = layerTransform(layer.motion, SETTLED_PROGRESS)
    scene.bind(stage)(SETTLED_PROGRESS, scene.count)
  }, [scene, motion, settled])

  return (
    <div ref={ref} data-stage={scene.id} className={`${settled ? css.settled : css.stage} ${className}`} aria-hidden="true">
      {layers.map(({ name, node }) => (
        <div key={name} data-layer={name} className={css.layer}>
          {node}
        </div>
      ))}
      <div data-veil="" className={css.veil} />
    </div>
  )
}

/** Every stage of the page, fixed behind the text; the engine shows the ones the scroll is in. */
export function Theatre({ theatreRef, className = '', children }: { theatreRef: Ref<HTMLDivElement>; className?: string; children: ReactNode }) {
  return (
    <div ref={theatreRef} className={`${css.theatre} ${className}`} aria-hidden="true">
      {children}
    </div>
  )
}
