'use client'

import type { CSSProperties } from 'react'
import type { Company } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import horror from './horror.module.css'
import look from './world.module.css'

// Ventures as the wares of the travelling trader of the 2005 sequel (the Merchant, named here in code
// only), who throws open his coat by his blue fire behind the page (./props). His wares are the ventures,
// each a tag from the coat's lining that drops in once when the section comes into view and lifts toward
// the visitor when pointed at or focused, the way the trader's screen lifts the ware in view.
//
// Animated: the tags' drop (once), a ware's lift on hover or focus.

function Ware({ company }: { company: Company }) {
  const { links } = useLabels()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={newTabName(links, company.name)}
      className={`relative block p-4 ${look.file} ${look.focus} ${horror.ware}`}
    >
      <span className="absolute -top-2 left-1/2 h-4 w-1 -translate-x-1/2 bg-[color:var(--sh-brass)]" aria-hidden="true" />
      <h3 className="text-base text-[color:var(--sh-ivory)]">
        <SlashBreaks text={company.name} />
      </h3>
      <p className="mb-2 text-sm text-[color:var(--sh-brass)]">{company.tagline}</p>
      <p className="text-sm leading-relaxed text-[color:var(--sh-fog)]">{company.description}</p>
      {company.services.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {company.services.map((service) => (
            <li key={service} className="border border-[color:var(--sh-wood)] px-2 py-0.5 text-sm text-[color:var(--sh-cream)]">
              {service}
            </li>
          ))}
        </ul>
      )}
    </a>
  )
}

export function TraderWares({ companies }: { companies: Company[] }) {
  const { horror: words } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })

  return (
    <div ref={ref}>
      <p className="mb-4 text-sm italic text-[color:var(--sh-fog)]">{words.waresHint}</p>
      <ul className={`${MASONRY_LIST} pt-2`}>
        {companies.map((company, index) => (
          <li key={company.id} className={`${MASONRY_ITEM} ${horror.cellDrop} ${triggered ? horror.cellDropped : ''}`} style={{ '--i': index } as CSSProperties}>
            <Ware company={company} />
          </li>
        ))}
      </ul>
    </div>
  )
}
