import type { Locale } from '@/i18n/config'
import type labelsFile from '../../../content/cv/labels.json'

// The interface text of the site and /cv (section titles, buttons, accessible names, the phrases around
// the CV facts), as content/cv/labels.json holds it. The type is read off the English block, so the file
// is the one list of keys; nothing reads the JSON here at run time, the loader does (src/lib/cv-data.ts).

export type Labels = (typeof labelsFile)['en']['labels']

export type LabelGroup = keyof Labels

/** A locale block may lack a group or a key inside one; English fills the gap. */
export type PartialLabels = { [Group in LabelGroup]?: Partial<Labels[Group]> }

export type LabelsFile = { en: { labels: Labels } } & Partial<Record<Exclude<Locale, 'en'>, { labels?: PartialLabels }>>

const LABEL_GROUPS = (labels: Labels): LabelGroup[] => Object.keys(labels) as LabelGroup[]

/** The labels of one locale, key by key: a key the locale lacks keeps its English text. */
export function labelsFor(file: LabelsFile, locale: Locale): Labels {
  const english = file.en.labels
  const translated: PartialLabels = file[locale]?.labels ?? {}
  return Object.fromEntries(
    LABEL_GROUPS(english).map((group) => [group, { ...english[group], ...translated[group] }]),
  ) as Labels
}

export type LabelValues = Readonly<Record<string, string | number>>

/** Fills a label's `{name}` slots: fillLabel('Since {year}', { year: 2018 }) is "Since 2018". A slot with
 *  no value stays as written, so a missing value shows in the page instead of vanishing. */
export const fillLabel = (template: string, values: LabelValues): string =>
  template.replace(/\{(\w+)\}/g, (slot, name: string) => (name in values ? String(values[name]) : slot))
