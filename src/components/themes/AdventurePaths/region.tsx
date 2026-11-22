import type { ReactNode, Ref } from 'react'
import { cssVars } from '@/lib/cssVars'
import { headingId } from '@/lib/cv/sectionText'
import { FoeSprite } from './actor'
import { JOURNAL_SERIF } from './palette'
import side from './side.module.css'

// A region of the adventure: one CV section as one level. Its title sits on the black HUD bar of the
// 16 bit games (white type, so it reads over any zone of the living backdrop); then the level's
// playfield, where he does his part, and the section's cards.
// The section is the zone stage: `stageRef` and `on` come from useZoneStage, and every entrance inside
// starts off data-on.

interface RegionProps {
  title: string
  stageRef?: Ref<HTMLElement>
  on?: boolean
  children: ReactNode
}

export function Region({ title, stageRef, on = true, children }: RegionProps) {
  const id = headingId('trail', title)
  return (
    <section ref={stageRef} data-on={on} aria-labelledby={id} className="relative z-20 mx-auto max-w-6xl scroll-mt-8 px-4 py-10 sm:px-6">
      <header className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id={id} className={`rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] px-4 py-1.5 text-2xl font-bold tracking-wide text-white sm:text-3xl ${JOURNAL_SERIF}`}>
          {title}
        </h2>
      </header>
      {children}
    </section>
  )
}

/** The level strip he plays his part on: clear over the living backdrop, with its own ground row. Its art
 *  is aria-hidden piece by piece, so a button in it (a block, a platform) stays reachable. */
export function Playfield({ children, height = 'h-56', ground = 'grass' }: { children: ReactNode; height?: string; ground?: 'grass' | 'brick' | 'gold' }) {
  return (
    <div className={`relative mb-6 overflow-hidden ${height} ${side.playfield}`}>
      {children}
      <div className={side.ground} data-ground={ground} aria-hidden="true" />
    </div>
  )
}

/** The black HUD line naming where he stands, read out when it changes. */
export function Banner({ children }: { children: ReactNode }) {
  return (
    <p
      className={`mb-6 flex min-h-[2.75rem] items-center justify-center rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] px-4 py-2 text-center text-base font-bold tracking-wide text-white [overflow-wrap:anywhere] ${JOURNAL_SERIF}`}
      aria-live="polite"
    >
      {children}
    </p>
  )
}

/** A card: the message window's white page with the black outline and a hard drop. */
export const PAPER_CARD = 'rounded-md border-[3px] border-[color:var(--ap-hud)] bg-[color:var(--ap-page)] p-4 text-[color:var(--ap-ink)] shadow-[0_5px_0_var(--ap-hud)]'

/** A card that pops in once the level's action reaches it: hidden until then, `--delay` is its moment. */
export const POP_CARD = side.popCard

/** A mushroom foe in his way at `x` (% of the playfield): walking, then flat under his feet once `scored`,
 *  its score popping up over it. */
export function StompFoe({ x, scored, score }: { x: number; scored: boolean; score: number }) {
  return (
    <div className={side.foe} data-scored={scored} style={cssVars({ '--x': x })} aria-hidden="true">
      <span className={`absolute inset-0 ${side.foeLive}`}>
        <FoeSprite look="walker" className="h-full w-full" />
      </span>
      <span className={`absolute inset-0 ${side.foeFlat}`}>
        <FoeSprite look="walkerFlat" className="h-full w-full" />
      </span>
      <span className={`absolute bottom-14 left-1/2 rounded-sm bg-[color:var(--ap-hud)] px-1.5 text-sm font-bold text-white ${side.score}`}>{score}</span>
    </div>
  )
}

/** The HUD button under a playfield that runs the level's action again, once it has played. */
export function AgainButton({ onAgain, ready, children }: { onAgain: () => void; ready: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onAgain}
      disabled={!ready}
      className={`-mt-3 mb-6 min-h-[44px] rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] px-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:transition-none ${JOURNAL_SERIF}`}
    >
      {children}
    </button>
  )
}
