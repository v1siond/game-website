'use client'

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { drawFigureStill, startFigure, type Figure, type Phase } from './figure'
import { PAD_ORDER, STAGE_LENS, padsOnScreen } from './pads'
import css from './portals.module.css'

// Him on the picked pad, in his own canvas (figure.ts): the hero's data-worlds-figure. The layer under him
// carries the pad's place on the stage as --np-pad-x and --np-pad-y, so his box stands on the pad from the
// first render, before three.js loads; a click plays his tornado spin. Without WebGL the same rig is drawn
// once into SVG inside the same box.

const PAD_PLACES = padsOnScreen(STAGE_LENS)

interface HeroFigureProps {
  profession: Profession
  phase: Phase
  still: boolean
  stage: RefObject<HTMLDivElement | null>
  spinLabel: string
}

export function HeroFigure({ profession, phase, still, stage, spinLabel }: HeroFigureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stillRef = useRef<HTMLSpanElement>(null)
  const figureRef = useRef<Figure | null>(null)
  const first = useRef({ profession, phase })
  const place = PAD_PLACES[PAD_ORDER.indexOf(profession)]

  useEffect(() => {
    const canvas = canvasRef.current
    const stageElement = stage.current
    const host = stillRef.current
    if (!canvas || !stageElement || !host) return
    const start = startFigure({ canvas, stage: stageElement }, first.current.profession, still)
    if (!start.ok) return drawFigureStill(host, stageElement, first.current.profession)
    figureRef.current = start.figure
    start.figure.setPhase(first.current.phase)
    return () => {
      start.figure.dispose()
      figureRef.current = null
    }
  }, [still, stage])

  useEffect(() => {
    first.current.phase = phase
    figureRef.current?.setPhase(phase)
  }, [phase])

  useEffect(() => {
    first.current.profession = profession
    figureRef.current?.moveTo(profession)
  }, [profession])

  return (
    <div className={css.figureLayer} style={{ '--np-pad-x': place.x, '--np-pad-y': place.y } as CSSProperties}>
      <button type="button" data-worlds-figure="" onClick={() => figureRef.current?.spin()} aria-label={spinLabel} className={css.figure}>
        <span className={css.beam} aria-hidden="true" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <span ref={stillRef} className="absolute inset-0" aria-hidden="true" />
      </button>
    </div>
  )
}
