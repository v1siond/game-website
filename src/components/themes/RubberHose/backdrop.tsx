'use client'

import { useRef } from 'react'
import { useScrollFollow } from '@/hooks/useScrollFollow'
import { reelAt } from '@/lib/motion/filmReel'
import { MusicNote } from './art'
import world from './world.module.css'

// Rubber Hose's page backdrop, fixed behind the content: the film stock down both edges with its
// sprocket holes running, the double ink rule framing the page, the projected film's grain, vignette
// and flicker, and a few notes drifting up like a cartoon's soundtrack. The scroll plays it, never a
// clock (useScrollFollow, filmReel): the holes run and the grain jumps as the page moves, the projector
// flickers now and then, the notes rise over the first screen, and scrolling back plays it all back. The
// frame is written as CSS variables on one wrapper (display: contents) that every part reads; under
// reduced motion nothing is written and the film stands still at its rest frame (world.module.css).

function FilmStrip({ side }: { side: 'left' | 'right' }) {
  const placement = side === 'left' ? 'left-0' : 'right-0'
  const run = side === 'left' ? '' : world.sprocketsReverse

  return (
    <div className={`pointer-events-none fixed inset-y-0 z-[4] w-5 overflow-hidden sm:w-12 ${placement} ${world.filmStrip}`} aria-hidden="true">
      <div className={`${world.sprockets} ${run}`} />
    </div>
  )
}

function FilmFrame() {
  return (
    <>
      <FilmStrip side="left" />
      <FilmStrip side="right" />
      <div className={`pointer-events-none fixed inset-y-2 left-6 right-6 z-[5] sm:inset-y-4 sm:left-16 sm:right-16 ${world.frameRule}`} aria-hidden="true" />
    </>
  )
}

function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[7] overflow-hidden" aria-hidden="true">
      <div className={world.grain} />
      <div className={`absolute inset-0 ${world.vignette}`} />
      <div className={`absolute inset-0 ${world.flicker}`} />
    </div>
  )
}

// Where each note starts along the bottom edge and how far behind the first it sets off, as literal classes
// for the build.
const NOTES = [
  { place: 'left-[18%]', lag: '[--lag:0]' },
  { place: 'left-[52%]', lag: '[--lag:0.15]' },
  { place: 'left-[80%]', lag: '[--lag:0.3]' },
]

function RisingNotes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden="true">
      {NOTES.map(({ place, lag }) => (
        <div key={place} className={`absolute -bottom-10 ${place} ${world.noteRise} ${lag}`}>
          <MusicNote className="h-8 w-6" />
        </div>
      ))}
    </div>
  )
}

/** The whole projected film, played by the scroll while `playing`. */
export function FilmBackdrop({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollFollow((scroll, viewport) => {
    const node = ref.current
    if (!node) return
    const { reel, grainX, grainY, flicker, notes } = reelAt(scroll, viewport)
    node.style.setProperty('--reel', reel.toFixed(2))
    node.style.setProperty('--grain-x', String(grainX))
    node.style.setProperty('--grain-y', String(grainY))
    node.style.setProperty('--flicker', flicker.toFixed(3))
    node.style.setProperty('--notes', notes.toFixed(3))
  }, playing)
  return (
    <div ref={ref} className="contents">
      <FilmFrame />
      <FilmGrain />
      <RisingNotes />
    </div>
  )
}
