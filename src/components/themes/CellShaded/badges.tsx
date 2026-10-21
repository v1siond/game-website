import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import type { CVData } from '@/lib/cv/content'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { Starburst } from './ink'
import { CEL } from './palette'
import cel from './cel.module.css'

// The ventures as the wasteland's makers' plates: each company a riveted plate stamped with its mark,
// its name in the display lettering and its tagline as the maker's motto, the way every gun in the
// inked shooter carries its maker's stamp. Pointing at or focusing a plate presses the stamp in and a
// burst of its colour splats behind it; a plate with a site is the link to it.

type Company = CVData['companies'][number]

const PLATE_TONES = [CEL.orange, CEL.sun, CEL.holo]

function PlateFace({ company, tone }: { company: Company; tone: string }) {
  const { cards } = useLabels()
  return (
    <div className={`relative h-full p-5 ${cel.paper} ${cel.press}`}>
      <span className="absolute left-2 top-2 h-3 w-3 rounded-full border-2 border-[var(--cel-ink)] bg-[var(--cel-steel)]" aria-hidden="true" />
      <span className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-[var(--cel-ink)] bg-[var(--cel-steel)]" aria-hidden="true" />
      <div className="relative mb-3 h-16 w-16" aria-hidden="true">
        <div className={`absolute -inset-4 ${cel.splat}`}>
          <Starburst fill={tone} />
        </div>
        <svg viewBox="0 0 64 64" className={`relative h-full w-full ${cel.inked}`}>
          <path d="M8 14 L32 4 L56 14 L56 40 L32 60 L8 40 Z" fill={tone} />
          <path d="M32 4 L56 14 L56 40 L32 60 Z" fill={CEL.ink} opacity={0.25} data-bare />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-2xl ${cel.display} [-webkit-text-stroke:0]`}>
          {company.name.charAt(0)}
        </span>
      </div>
      <h3 className={`text-2xl leading-tight ${cel.display} [-webkit-text-stroke:0]`}>
        <SlashBreaks text={company.name} />
      </h3>
      {company.tagline && <p className={`mt-1 text-base font-bold italic ${cel.flavour}`}>{company.tagline}</p>}
      <p className="mt-2 text-base leading-relaxed">{company.description}</p>
      {company.services.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={cards.details}>
          {company.services.map((service) => (
            <li key={service} className="border-2 border-[var(--cel-ink)] bg-[var(--cel-white)] px-2 py-0.5 text-sm font-bold">
              {service}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function MakersPlates({ companies }: { companies: Company[] }) {
  const { links } = useLabels()

  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {companies.map((company, index) => {
        const tone = PLATE_TONES[index % PLATE_TONES.length]
        const style = { ['--i' as string]: index }
        return (
          <li key={company.id}>
            {company.url ? (
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={newTabName(links, company.name)}
                className={`block h-full ${cel.plate}`}
                style={style}
              >
                <PlateFace company={company} tone={tone} />
              </a>
            ) : (
              <div className={`h-full ${cel.plate}`} style={style}>
                <PlateFace company={company} tone={tone} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
