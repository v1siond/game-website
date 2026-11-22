import type { AboutFactsLook } from '@/components/cv/AboutFacts'
import type { MarkedLinesLook } from '@/components/cv/MarkedLines'
import type { TagListLook } from '@/components/cv/TagList'
import type { ContactLinkId } from '@/components/cv/SiteLinks'

// The text layer's faces. Every line of text sits on an opaque panel (--np-panel), never on the tunnel's
// art, so it reads from its first frame. Names and titles are the corridor's square display capitals
// (Bungee, --np-face); the reading text is Atkinson Hyperlegible (--np-body). A room's own colours are
// --ra1 (its edge and markers) and --ra-text (its small coloured text, the era tint), set on the section.

export const FACE = 'font-[family-name:var(--np-face)] font-normal'
export const BODY = 'font-[family-name:var(--np-body)]'

const CUT = '[clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]'

/** A card: the panel with its cut corners and the room's neon edge down the left. */
export const CARD = `relative w-full max-w-[35rem] bg-[color:var(--np-panel)] py-5 pl-[1.85rem] pr-6 max-md:py-[1.15rem] max-md:pl-[1.45rem] max-md:pr-[1.15rem] ${CUT} before:absolute before:bottom-[18px] before:left-0 before:top-[18px] before:w-1 before:bg-[color:var(--ra1)] before:content-[''] [&>*+*]:mt-2.5`

export const CARD_WIDE = 'max-w-[39rem]'

export const CARD_TITLE = 'text-[1.3rem] font-bold leading-tight'

export const CARD_TITLE_BIG = 'text-[1.6rem] font-bold leading-tight'

export const TINT = 'font-bold text-[color:var(--ra-text)]'

export const MUTED = 'text-[color:var(--np-muted)]'

export const TAGS: TagListLook = {
  list: 'flex flex-wrap gap-1.5 pt-1',
  tag: 'border border-[color:color-mix(in_srgb,var(--ra1)_50%,transparent)] bg-[color:var(--np-raised)] px-2.5 py-0.5 text-[0.92rem]',
}

export const POINTS: MarkedLinesLook = {
  list: 'space-y-1.5',
  line: 'flex items-start gap-2.5',
  marker: <span className="mt-[0.45rem] h-2.5 w-2 shrink-0 bg-[color:var(--ra1)] [clip-path:polygon(50%_0,100%_40%,50%_100%,0_40%)]" aria-hidden="true" />,
}

export const FACTS: AboutFactsLook = { list: 'space-y-2.5', fact: '', term: TINT, value: '' }

const BUTTON = `inline-flex min-h-[44px] items-center px-[1.15rem] py-2 font-bold no-underline [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] focus-visible:[clip-path:none]`

/** The outlined button: the room's tint on the panel. */
export const BUTTON_LINE = `${BUTTON} border-2 border-[color:var(--ra-text)] bg-[color:var(--np-panel)] text-[color:var(--ra-text)] hover:bg-[color:var(--np-raised)]`

/** The one lit button (Email): the panel on the room's tint. */
export const BUTTON_LIT = `${BUTTON} border-2 border-[color:var(--ra-text)] bg-[color:var(--ra-text)] text-[color:var(--np-panel)] hover:bg-[color:var(--np-white)]`

export const BUTTON_SMALL = 'min-h-[40px] px-[0.9rem] py-1.5 text-[0.95rem]'

export const CONTACT_LOOK: Record<ContactLinkId, string> = { email: BUTTON_LIT, linkedin: BUTTON_LINE, cv: BUTTON_LINE, engine: BUTTON_LINE }
