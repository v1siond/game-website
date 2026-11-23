import type { Company } from '@/lib/cv/content'
import { MASONRY_ITEM } from '@/lib/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { newTabHint } from '@/lib/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { COLUMN_LIST } from './cards'
import look from './world.module.css'

// Ventures as notices pinned on the board, each a link named by its visible text (the tag, name, tagline,
// description and services), so a screen reader reaches every field, then hears that it opens a new tab.
// His own products (featured) carry a flame lit tag over the name.

const SERVICE_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: 'border border-[color:var(--sh-wood)] px-2 py-0.5 text-sm text-[color:var(--sh-cream)]',
}

function Notice({ company }: { company: Company }) {
  const { links, cards, sections } = useLabels()

  return (
    <a href={company.url} target="_blank" rel="noopener noreferrer" className={`relative block p-4 hover:border-[color:var(--sh-brass)] ${look.file}`}>
      <span className="absolute -top-2 left-1/2 h-4 w-1 -translate-x-1/2 bg-[color:var(--sh-brass)]" aria-hidden="true" />
      {company.featured && <p className="mb-2 inline-block bg-[color:var(--sh-flame)] px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-[color:var(--sh-void)]">{cards.ownProduct}</p>}
      <h3 className={`${company.featured ? 'text-lg' : 'text-base'} text-[color:var(--sh-ivory)]`}>
        <SlashBreaks text={company.name} />
      </h3>
      <p className="mb-2 text-sm text-[color:var(--sh-brass-text)]">{company.tagline}</p>
      <p className="text-sm leading-relaxed text-[color:var(--sh-fog-text)]">{company.description}</p>
      <TagList items={company.services} label={sections.services} look={SERVICE_TAGS} />
      <span className="sr-only"> {newTabHint(links)}</span>
    </a>
  )
}

export function VentureBoard({ companies }: { companies: Company[] }) {
  return (
    <div data-stage-items="">
      <ul className={`${COLUMN_LIST} pt-2`}>
        {companies.map((company) => (
          <li key={company.id} className={MASONRY_ITEM}>
            <Notice company={company} />
          </li>
        ))}
      </ul>
    </div>
  )
}
