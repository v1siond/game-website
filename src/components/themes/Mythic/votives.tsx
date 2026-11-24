import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { cssVars } from '@/lib/cssVars'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { newTabHint } from '@/lib/cv/sectionText'
import type { CVData } from '@/lib/cv/content'
import { MYTH } from './palette'
import { IRON_TAGS } from './stage'
import u from './underworld.module.css'

// The ventures as runestones on the shelf of offerings: each company a carved stone resting in its iron
// slot, its name and motto on the plaque under it. Pointing at or focusing a token lifts it out of its slot;
// a token with a site is the link to it. His own products (featured) rest in the two wide slots of the top
// shelf, a larger stone and a frost plate over the name; the other ventures fill the shelf below. The token's
// shape changes along the shelf, the way each offering is a different object.

type Company = CVData['companies'][number]

// The token's shape changes along the shelf, so each offering is a different object.
const TOKENS = [
  'M32 6 L54 18 L54 46 L32 58 L10 46 L10 18 Z',
  'M32 4 A28 28 0 1 1 31.9 4 Z',
  'M32 4 L58 32 L32 60 L6 32 Z',
]

function Votive({ company, index }: { company: Company; index: number }) {
  const { cards, sections } = useLabels()

  return (
    <div className="flex h-full flex-col">
      <div className={`relative flex h-36 items-center justify-center ${u.slot}`} aria-hidden="true">
        <div className={`relative ${company.featured ? 'h-24 w-24' : 'h-20 w-20'} ${u.votive}`}>
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
            <path d={TOKENS[index % TOKENS.length]} fill={MYTH.stone} stroke={MYTH.inkLine} strokeWidth={3} />
            <path d={TOKENS[index % TOKENS.length]} fill="none" stroke={MYTH.iron} strokeWidth={1.5} transform="translate(32 32) scale(0.78) translate(-32 -32)" />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-2xl text-[var(--myth-ink)] ${u.display}`}>{company.name.charAt(0)}</span>
        </div>
      </div>
      <div className="flex-1 border-x-2 border-b-2 border-[var(--myth-iron)] bg-[var(--myth-panel)] p-5">
        {company.featured && (
          <p className={`mb-2 inline-block bg-[var(--myth-frost)] px-2 py-0.5 text-sm uppercase tracking-widest text-[var(--myth-ink)] ${u.display}`}>
            {cards.ownProduct}
          </p>
        )}
        <h3 className={`${company.featured ? 'text-xl' : 'text-lg'} text-[var(--myth-frost)] ${u.display}`}>
          <SlashBreaks text={company.name} />
        </h3>
        {company.tagline && <p className="mt-1 text-base italic text-[var(--myth-frost-core)]">{company.tagline}</p>}
        <p className="mt-2 text-base leading-relaxed">{company.description}</p>
        <TagList items={company.services} label={sections.services} look={{ ...IRON_TAGS, tag: 'border border-[var(--myth-iron)] px-2 py-0.5 text-sm' }} />
      </div>
    </div>
  )
}

export function Votives({ companies }: { companies: Company[] }) {
  const { links } = useLabels()

  return (
    <>
      <ul data-stage-items="" className={`grid gap-6 border-4 border-[var(--myth-iron)] bg-[var(--myth-ink)] p-4 sm:p-6 md:grid-cols-6`}>
        {companies.map((company, index) => (
          <li key={company.id} className={`${u.shelfItem} ${u.reveal} ${company.featured ? 'md:col-span-3' : 'md:col-span-2'}`} style={cssVars({ '--i': index })}>
            {company.url ? (
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Votive company={company} index={index} />
                <span className="sr-only"> {newTabHint(links)}</span>
              </a>
            ) : (
              <Votive company={company} index={index} />
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
