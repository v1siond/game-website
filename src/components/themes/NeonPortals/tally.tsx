'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { useFindCount, useRolling } from '../shared/finds'
import { PORTAL } from './palette'
import { FACE } from './cards'
import stage from './stage.module.css'

// The thread of the run, the game's box counter (research part 2 [8]): a spinning crate hologram with
// "found of total" beside it, the finds the visitor has opened on this profession's run against all it
// holds. It shows in the hero, beside each section that holds finds, and at the save monitor, where it
// turns into the gem once the count is full. The glyph is aria-hidden art; the count is HTML text. The
// finds are counted per profession (the shared find counter, one group per profession), so a switch keeps
// them and the tally shows only the active profession's.
//
// Animated: the count climbing (useRolling), the glyph turning to the gem once full.
// Reduced motion: the count shows full and the glyph is the gem (the world draws its last frame).

export type HologramState = 'dim' | 'box' | 'gem'

/** The crate hologram as a wireframe box, or the gem it turns into. */
export function Hologram({ state, className = '' }: { state: HologramState; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`${stage.hologram} ${className}`} data-state={state} aria-hidden="true" focusable="false">
      <g className={stage.holoBox} fill="none" stroke={PORTAL.ARC} strokeWidth={2} strokeLinejoin="round">
        <path d="M8 14 L20 8 L32 14 L32 28 L20 34 L8 28 Z" fill={PORTAL.BLUE} fillOpacity={0.18} />
        <path d="M8 14 L20 20 L32 14 M20 20 V34 M11 16 L20 30 M29 16 L20 30" />
      </g>
      <g className={stage.holoGem} stroke={PORTAL.INK} strokeWidth={1.4} strokeLinejoin="round">
        <path d="M8 15 L14 8 H26 L32 15 L20 34 Z" fill={PORTAL.GEM_BLUE} />
        <path d="M8 15 H32 M14 8 L17 15 L20 34 L23 15 L26 8" fill="none" />
        <path d="M14 10 L16 14" stroke={PORTAL.WHITE} strokeWidth={2} strokeLinecap="round" />
      </g>
    </svg>
  )
}

/** The tally: the hologram glyph and "{found} of {total}" for the active profession. */
export function Tally({ className = '' }: { className?: string }) {
  const { active } = useProfession()
  const { navigation } = useLabels()
  const { found, total } = useFindCount(active)
  const shown = useRolling(found)

  return (
    <p data-tally="" className={`inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--np-seam)] bg-[color:var(--np-board)] py-1 pl-1.5 pr-4 ${className}`}>
      <Hologram state={found >= total ? 'gem' : 'box'} className="h-8 w-8 shrink-0" />
      <span className={`${FACE} text-lg tracking-wide text-[color:var(--np-gold)]`}>{fillLabel(navigation.findTally, { found: shown, total })}</span>
    </p>
  )
}
