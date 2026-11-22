import { headingId } from '@/lib/cv/sectionText'
import type { TagListLook } from '@/components/cv/TagList'
import world from './world.module.css'

// The optics HUD's controls and chips, and the id of a section's HUD title (sections.tsx). Red stays in
// the line work; the words are yellow or ice white on near black.

export const panelHeadingId = (title: string): string => headingId('nc', title)

export type HudTone = 'hud' | 'hack' | 'ice' | 'use'

// Each tone as whole class strings, so Tailwind finds every one in the source. The link tone tints a
// little deeper on hover than the button tones.
const HUD_TONE: Record<HudTone, string> = {
  hud: 'border-[color:var(--neon-hud)] text-[color:var(--neon-hud)] hover:bg-[color-mix(in_srgb,var(--neon-hud)_12%,transparent)]',
  hack: 'border-[color:var(--neon-hack)] text-[color:var(--neon-hack)] hover:bg-[color-mix(in_srgb,var(--neon-hack)_12%,transparent)]',
  ice: 'border-[color:var(--neon-ice)] text-[color:var(--neon-ice)] hover:bg-[color-mix(in_srgb,var(--neon-ice)_12%,transparent)]',
  use: 'border-[color:var(--neon-use)] text-[color:var(--neon-use)] hover:bg-[color-mix(in_srgb,var(--neon-use)_14%,transparent)]',
}

/** The HUD's outlined control in one tone: the clipped corner, a 44 px target, the tone's line and hover tint. */
export const hudButton = (tone: HudTone): string => `${world.cut} min-h-[44px] border px-3 text-sm uppercase tracking-wider ${HUD_TONE[tone]}`

/** A link out of a card (a stream, a repository, a demo), the outlined control in the use tone. */
export const HUD_LINK = `${hudButton('use')} inline-flex items-center`

/** Chips of tech, skills or services, square, the data cyan on solid ink: they sit outside the cards, over the city. */
export const DATA_CHIPS: TagListLook = {
  list: 'flex flex-wrap gap-1',
  tag: 'border border-[color-mix(in_srgb,var(--neon-data)_45%,transparent)] bg-[color-mix(in_srgb,var(--neon-data)_8%,var(--neon-ink))] px-2 py-0.5 text-sm text-[color:var(--neon-data-text)]',
}
