'use client'

import type { CSSProperties } from 'react'
import type { Company } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// Ventures as the travelling trader of the 2005 sequel (the Merchant, named here in code only): a hooded
// figure by a brazier who throws open his long coat, its lining hung with his wares. The coat opens once,
// when the section comes into view, and the wares below are his ventures, each a tag on the lining that
// lifts toward the visitor when pointed at or focused, the way the trader's screen lifts the ware in view.
// The trader's face stays in the hood's shadow, two pale eyes and nothing more.
//
// Animated: the coat's two flaps (once), the brazier's glow, a ware's lift on hover or focus.

function Trader({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 600 220" preserveAspectRatio="xMidYMax meet" className="h-44 w-full sm:h-56" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sh-trader-fire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={SH.flame} stopOpacity={0.5} />
          <stop offset="100%" stopColor={SH.flame} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={600} height={220} fill={SH.void} />
      <rect y={196} width={600} height={24} fill={SH.shadow} />
      {/* the brazier */}
      <g>
        <circle cx={150} cy={170} r={70} fill="url(#sh-trader-fire)" className={horror.brazier} />
        <path d="M128 176 H172 L164 196 H136 Z" fill={SH.gunmetal} />
        <path d="M136 176 Q142 150 150 160 Q156 140 164 176 Z" fill={SH.flame} className={horror.brazierFlame} />
      </g>
      {/* the lining behind the coat, the wares hung on it */}
      <path d="M262 64 H338 L352 196 H248 Z" fill={SH.felt} />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => <rect key={`${row}-${col}`} x={264 + col * 24} y={86 + row * 34} width={18} height={24} rx={2} fill={SH.feltLine} />),
      )}
      {/* the hood and its shadowed face */}
      <path d="M270 70 Q270 22 300 18 Q330 22 330 70 Z" fill={SH.coat} />
      <ellipse cx={300} cy={52} rx={18} ry={20} fill={SH.void} />
      <circle cx={293} cy={50} r={2} fill={SH.moon} />
      <circle cx={307} cy={50} r={2} fill={SH.moon} />
      {/* the two coat flaps, open away from the lining */}
      <g className={`${horror.flapLeft} ${open ? horror.flapOpen : ''}`}>
        <path d="M300 64 H262 L240 196 H296 Z" fill={SH.coatLit} />
        <path d="M262 64 L240 196" stroke={SH.void} strokeWidth={2} />
      </g>
      <g className={`${horror.flapRight} ${open ? horror.flapOpen : ''}`}>
        <path d="M300 64 H338 L360 196 H304 Z" fill={SH.coatLit} />
        <path d="M338 64 L360 196" stroke={SH.void} strokeWidth={2} />
      </g>
    </svg>
  )
}

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
      <div className="mb-6 overflow-hidden border-2 border-[color:var(--sh-sepia)]">
        <Trader open={triggered} />
      </div>
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
