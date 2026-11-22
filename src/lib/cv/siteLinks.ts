import { CV_PATHS, defaultLocale } from '@/i18n/config'
import { ENGINE_LINK } from '@/lib/engineLink'
import type { Labels } from './labels'
import { newTabName } from './sectionText'

// The two site links every world draws beside the email and LinkedIn actions: the CV and the Nebulith engine.
// A world only picks which word its engine button shows; the address, the new tab and the accessible name
// come from here, so every world says the same thing to a screen reader.

export type SiteLinkId = 'cv' | 'engine'

/** The word a world's engine button shows, a key of labels.actions. */
export type EngineWord = 'engine' | 'engineShort' | 'portfolio' | 'play' | 'enter'

export interface SiteLinkProps {
  href: string
  target?: '_blank'
  rel?: string
  'aria-label'?: string
}

export interface SiteLinkSlot {
  id: SiteLinkId
  label: string
  linkProps: SiteLinkProps
}

// The accessible name of the engine link before its new tab note. "Nebulith" and "Game" are named by
// viewEngine, which holds both words; the other words name it by themselves, so the name always holds the
// visible word (WCAG 2.5.3).
const NAME_FOR: Record<EngineWord, keyof Labels['actions']> = {
  engine: 'viewEngine',
  engineShort: 'viewEngine',
  portfolio: 'portfolio',
  play: 'play',
  enter: 'enter',
}

/** The CV and engine link slots; the CV address is the English one, the middleware sends other languages on. */
export function siteLinks({ actions, links }: Pick<Labels, 'actions' | 'links'>, word: EngineWord): Record<SiteLinkId, SiteLinkSlot> {
  return {
    cv: { id: 'cv', label: actions.cv, linkProps: { href: CV_PATHS[defaultLocale] } },
    engine: {
      id: 'engine',
      label: actions[word],
      linkProps: { ...ENGINE_LINK, 'aria-label': newTabName(links, actions[NAME_FOR[word]]) },
    },
  }
}
