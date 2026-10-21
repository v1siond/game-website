import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { headingId } from '@/components/cv/sectionText'

// The wrist terminal's second row of tabs: the picked profession's sections, in page order, each a jump
// to its heading. The sections file builds each heading's id with the same atomicId, so a tab and its
// section always agree.

export const atomicId = (title: string): string => headingId('atomic', title)

type SectionKey = keyof Labels['sections']

const SECTIONS_OF: Record<Profession, SectionKey[]> = {
  engineer: ['about', 'workExperience', 'techStack', 'projects', 'ventures', 'contact'],
  drummer: ['bands', 'contact'],
  fighter: ['muayThai', 'contact'],
}

export interface SectionTab {
  title: string
  href: string
}

export const sectionTabs = (profession: Profession, sections: Labels['sections']): SectionTab[] =>
  SECTIONS_OF[profession].map((key) => ({ title: sections[key], href: `#${atomicId(sections[key])}` }))
