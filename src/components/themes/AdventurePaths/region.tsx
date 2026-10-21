import type { ReactNode, Ref } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { JOURNAL_SERIF } from './palette'
import side from './side.module.css'

// A region of the adventure: one CV section as one level. Its title sits on the black HUD bar of the
// 16 bit games (white type, so it reads over any zone of the living backdrop), with a one line hint of
// what the visitor can do; then the level's playfield, where he does his part, and the section's cards.
// The section is the zone stage: `stageRef` and `on` come from useZoneStage, and every entrance inside
// starts off data-on.

interface RegionProps {
  title: string
  hint?: string
  stageRef?: Ref<HTMLElement>
  on?: boolean
  children: ReactNode
}

export function Region({ title, hint, stageRef, on = true, children }: RegionProps) {
  const id = headingId('trail', title)
  return (
    <section ref={stageRef} data-on={on} aria-labelledby={id} className="relative z-20 mx-auto max-w-6xl scroll-mt-8 px-4 py-10 sm:px-6">
      <header className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id={id} className={`rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] px-4 py-1.5 text-2xl font-bold tracking-wide text-white sm:text-3xl ${JOURNAL_SERIF}`}>
          {title}
        </h2>
        {hint && <p className="rounded-md bg-[color:var(--ap-hud)] px-3 py-1.5 text-sm text-[color:var(--ap-coin)]">{hint}</p>}
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
