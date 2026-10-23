'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { FoeFigure, type FoeName } from './foes'
import w from './wrath.module.css'

// Two sections the underworld's foes lay hands on, each the foe's own attack in the source games:
// - The gorgon's gaze (services): she rises at the services' right and fixes them with her stare; a green
//   ray crosses them, they turn to pale stone and shudder, and the stone cracks in two and falls away.
// - The cyclops stomp (bands): he lumbers in from the right, lifts a foot and stamps; the shock throws the
//   portraits up, they land with a shake and the dust line spreads under them.
//
// Pattern: the shared usePoseSequence plays in, the act (gaze or stomp) and leave once the section is in
// view (useSectionTrigger, so it plays once); every beat ends on the foe wrapper's own animationend. Each
// foe is one SVG moved whole, so the world's count of moving things grows by the foe and its two or three
// props only. The section's reaction is one CSS keyframe from the act on that ends at the section's own
// place and look (wrath.module.css). Timing: the gorgon rises 450 ms, gazes 900 ms (the stone is on 300 ms
// in, cracks off 650 to 1000 ms), sinks 450 ms; the cyclops lumbers in 600 ms, stomps 500 ms (the foot
// lands 300 ms in, the portraits are down by 800 ms), lumbers off 600 ms. Reduced motion: no foe and no
// props, the section rests in place from the start.

// Each foe's size: the gorgon at the services' head, the cyclops tall over the portraits' corner.
const FOE_SIZE = { gorgon: 'h-40 w-32', cyclops: 'h-56 w-44' } as const

type Beat = 'in' | 'act' | 'leave' | 'gone' | 'still'

const ENTRANCE: readonly Beat[] = ['in', 'act', 'leave']

interface WrathProps {
  children: ReactNode
  foe: Extract<FoeName, 'gorgon' | 'cyclops'>
  /** The section's reaction, a class of wrath.module.css. */
  reaction: string
  /** What the foe leaves on the section (the stone or the dust), drawn over it. */
  mark: ReactNode
}

function Wrath({ children, foe, reaction, mark }: WrathProps) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const { pose, onOwnAnimationEnd } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'gone', still: 'still' })
  const shown = pose === 'in' || pose === 'act' || pose === 'leave'

  return (
    <div ref={ref} className={`relative ${w.stage}`} data-on={triggered || undefined} data-beat={pose} data-foe={foe}>
      <div className={reaction}>{children}</div>
      {triggered && shown && mark}
      {triggered && shown && (
        <div className={`pointer-events-none absolute right-0 z-30 ${FOE_SIZE[foe]} ${w.foe}`} onAnimationEnd={onOwnAnimationEnd} aria-hidden="true">
          {foe === 'gorgon' && <span className={`absolute right-[78%] top-[22%] h-1 w-[min(60vw,48rem)] origin-right bg-[var(--myth-hydra-eye)] ${w.ray}`} />}
          <FoeFigure name={foe} className="h-full w-full" />
        </div>
      )}
    </div>
  )
}

// The stone the gaze lays over the services, in two halves that crack apart and fall.
const STONE = (
  <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
    <span className={`absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--myth-ink-soft)] bg-[var(--myth-bone-shade)] ${w.stone} ${w.stoneLeft}`} />
    <span className={`absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--myth-ink-soft)] bg-[var(--myth-bone-shade)] ${w.stone} ${w.stoneRight}`} />
  </div>
)

/** Services: turned to stone by the gorgon's gaze and cracked free. */
export function GorgonGaze({ children }: { children: ReactNode }) {
  return (
    <Wrath foe="gorgon" reaction={w.petrified} mark={STONE}>
      {children}
    </Wrath>
  )
}

// The dust the stamp throws along the floor under the portraits.
const DUST = <span className={`pointer-events-none absolute -bottom-2 left-0 right-0 z-20 h-2 origin-right rounded-full bg-[var(--myth-bone-shade)] ${w.dust}`} aria-hidden="true" />

/** Bands: thrown up by the cyclops stomp and shaken down. */
export function CyclopsStomp({ children }: { children: ReactNode }) {
  return (
    <Wrath foe="cyclops" reaction={w.stomped} mark={DUST}>
      {children}
    </Wrath>
  )
}
