'use client'

import { useLayoutEffect, useMemo, useRef, type Ref } from 'react'
import { cssVars } from '@/lib/cssVars'
import { layerTransform } from '@/lib/scroll/stage'
import { LAYERS } from './eras/era'
import { LAYER_MOTION, lookVars, type Scene } from './scenes'
import css from './eras.module.css'

// One era picture: its six layers, each an SVG built once from code (eras/*), and the black veil the
// engine fades it into the dark with. In the theatre every stage is a fixed full screen picture behind the
// text, moved by the engine (engine.ts); under reduced motion each stage sits at the top of its own
// section instead, drawn once at its settled frame (the middle of its scene, every item reached).

/** The progress a settled stage is drawn at: the middle of its scene, its picture at rest. */
const SETTLED_PROGRESS = 0.5

export function Stage({ scene, settled = false }: { scene: Scene; settled?: boolean }) {
  const layers = useMemo(() => scene.era.build(scene.input), [scene])
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = ref.current
    if (!settled || !stage) return
    stage.querySelectorAll<HTMLElement>('[data-layer]').forEach((layer) => {
      layer.style.transform = layerTransform(LAYER_MOTION[layer.dataset.layer as keyof typeof LAYER_MOTION], SETTLED_PROGRESS)
    })
    scene.era.bind(stage, scene.input)(SETTLED_PROGRESS, scene.input.count)
  }, [scene, settled])

  return (
    <div ref={ref} data-stage={scene.id} className={settled ? css.settled : css.stage} style={cssVars(lookVars(scene.look))} aria-hidden="true">
      {LAYERS.map((name) => (
        <div key={name} data-layer={name} className={css.layer} dangerouslySetInnerHTML={{ __html: layers[name] }} />
      ))}
      <div data-veil="" className={css.veil} />
    </div>
  )
}

/** Every stage of the page, fixed behind the text; the engine shows the ones the scroll is in. */
export function Theatre({ scenes, theatreRef }: { scenes: readonly Scene[]; theatreRef: Ref<HTMLDivElement> }) {
  return (
    <div ref={theatreRef} className={css.theatre} aria-hidden="true">
      {scenes.map((scene) => (
        <Stage key={scene.id} scene={scene} />
      ))}
    </div>
  )
}
