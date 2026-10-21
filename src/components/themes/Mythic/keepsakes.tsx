import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import type { CVData } from '@/lib/cv/content'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The ventures as keepsakes in the cabinet: each company a gold token resting on its velvet slot, its
// name and motto on the plaque under it. Pointing at or focusing a keepsake lifts it out of its slot; a
// keepsake with a site is the link to it.

type Company = CVData['companies'][number]

// The token's shape changes along the shelf, the way each keepsake is a different object.
const TOKENS = [
  'M32 6 L54 18 L54 46 L32 58 L10 46 L10 18 Z',
  'M32 4 A28 28 0 1 1 31.9 4 Z',
  'M32 4 L58 32 L32 60 L6 32 Z',
]

function Keepsake({ company, index }: { company: Company; index: number }) {
  const { cards } = useLabels()

  return (
    <div className="flex h-full flex-col">
      <div className={`relative flex h-36 items-center justify-center ${u.slot}`} aria-hidden="true">
        <div className={`relative h-20 w-20 ${u.keepsake}`}>
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
            <path d={TOKENS[index % TOKENS.length]} fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth={3} />
            <path d={TOKENS[index % TOKENS.length]} fill="none" stroke={MYTH.goldPale} strokeWidth={1.5} transform="translate(32 32) scale(0.78) translate(-32 -32)" />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-2xl text-[var(--myth-ink)] ${u.display}`}>{company.name.charAt(0)}</span>
        </div>
      </div>
      <div className="flex-1 border-x-2 border-b-2 border-[var(--myth-gold-deep)] bg-[var(--myth-panel)] p-5">
        <h3 className={`text-lg text-[var(--myth-gold)] ${u.display}`}>{company.name}</h3>
        {company.tagline && <p className="mt-1 text-base italic text-[var(--myth-gold-pale)]">{company.tagline}</p>}
        <p className="mt-2 text-base leading-relaxed">{company.description}</p>
        {company.services.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={cards.details}>
            {company.services.map((service) => (
              <li key={service} className="border border-[var(--myth-gold-deep)] px-2 py-0.5 text-sm">
                {service}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function Keepsakes({ companies }: { companies: Company[] }) {
  const { links, myth } = useLabels()

  return (
    <>
      <p className={`mb-6 ${u.hint}`}>{myth.keepsakeHint}</p>
      <ul className={`grid gap-6 border-4 border-[var(--myth-gold-deep)] bg-[var(--myth-ink)] p-4 sm:p-6 md:grid-cols-3`}>
        {companies.map((company, index) => (
          <li key={company.id} className={`${u.cabinetItem} ${u.reveal}`} style={{ ['--i' as string]: index }}>
            {company.url ? (
              <a href={company.url} target="_blank" rel="noopener noreferrer" aria-label={newTabName(links, company.name)} className="block h-full">
                <Keepsake company={company} index={index} />
              </a>
            ) : (
              <Keepsake company={company} index={index} />
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
