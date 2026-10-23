'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { DwellerSprite, type DwellerMotion } from './dweller'
import r from './repairs.module.css'

// Two sections the dweller gets working himself, the wasteland's own fixes:
// - Percussive maintenance (services): the services sit on a dead tube, a cold line of light. He walks in
//   and boots the panel; it jumps, shakes and the tube turns on, opening from the line to the full panels.
// - Quest updated (work experience): he walks in, raises the wrist terminal and keys it; a phosphor beam
//   shoots from his wrist across the log and the log is written onto the tube from the top, with a jolt.
//
// Pattern: the shared usePoseSequence plays walk, the act (kick or type) and leave once the section is in
// view (useSectionTrigger, so it plays once); every beat ends on the figure wrapper's own animationend.
// The section's reaction is one CSS keyframe from the act on that ends at the section's own place and
// look (repairs.module.css). Timing: walk 550 ms; the kick 1200 ms (the boot lands 380 ms in, the tube is
// on 760 ms in) or the type 750 ms (the beam fires 450 ms in, the log is written by 850 ms); leave 500 ms.
// Reduced motion: no figure and no beam, the section rests in place from the start.

type Beat = 'walk' | 'act' | 'leave' | 'gone' | 'still'

const ENTRANCE: readonly Beat[] = ['walk', 'act', 'leave']

interface RepairProps {
  children: ReactNode
  act: Extract<DwellerMotion, 'kick' | 'type'>
  /** The section's reaction, a class of repairs.module.css. */
  reaction: string
}

function Repair({ children, act, reaction }: RepairProps) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const { pose, onOwnAnimationEnd } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'gone', still: 'still' })
  const shown = pose === 'walk' || pose === 'act' || pose === 'leave'
  const motion: DwellerMotion = pose === 'act' ? act : 'walk'

  return (
    <div ref={ref} className={`relative ${r.stage}`} data-on={triggered || undefined} data-beat={pose} data-act={act}>
      <div className={`relative ${reaction}`}>{children}</div>
      {triggered && shown && (
        <>
          <div className={`pointer-events-none absolute bottom-0 left-0 z-30 h-32 w-24 ${r.figure}`} onAnimationEnd={onOwnAnimationEnd} aria-hidden="true">
            <DwellerSprite profession="engineer" motion={motion} className="h-full w-full" />
          </div>
          {act === 'type' && <span className={`pointer-events-none absolute bottom-20 left-16 right-0 z-30 h-1 bg-atomic-phosphor ${r.beam}`} aria-hidden="true" />}
        </>
      )}
    </div>
  )
}

/** Services: booted until the dead tube turns on. */
export function BootedTube({ children }: { children: ReactNode }) {
  return (
    <Repair act="kick" reaction={r.booted}>
      {children}
    </Repair>
  )
}

/** Work Experience: written onto the tube by his wrist terminal's beam. */
export function BeamedLog({ children }: { children: ReactNode }) {
  return (
    <Repair act="type" reaction={r.beamed}>
      {children}
    </Repair>
  )
}
