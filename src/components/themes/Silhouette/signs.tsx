'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { PROFESSION_SKY } from './places'
import { SHADE, type SkyLight } from './palette'
import shade from './shade.module.css'

// The ventures as lit signs in one row over the rooftops of the black city against the dawn, the
// broken hotel sign of a silhouette platformer's town: when the section comes into view each sign
// stutters on in turn (once), and a sign the visitor touches or tabs to shorts out and comes back:
// the short is on the sign's light only, its words stay readable. One row from a tablet up, the
// signs side by side on their posts; stacked on a phone.
//
// Animated: one sign per entry (once), the one being touched.

const LINK_FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)]'
const TITLE = 'text-sm font-bold uppercase tracking-[0.25em] text-[color:var(--sh-heading)]'
const META = 'text-sm tracking-wider text-[color:var(--sh-muted)]'

const ROOFTOPS =
  'M0 60 V34 H40 V22 H58 V34 H96 V14 H104 V6 H110 V14 H122 V30 H170 V18 H210 V40 H250 V26 H262 V10 H270 V26 H300 V36 H350 V20 H392 V44 H430 V28 H470 V16 H486 V28 H520 V38 H560 V24 H600 V60 Z'

interface SignLink {
  href: string
  target: '_blank'
  rel: string
  'aria-label': string
}

function Sign({ index, lit, href, children }: { index: number; lit: boolean; href?: SignLink; children: ReactNode }) {
  const board = (
    <>
      <div
        className={`relative border-2 border-[color:var(--sh-black)] bg-[color:var(--sh-panel)] p-4 ${lit ? shade.signOn : shade.signOff}`}
        style={{ '--i': index } as CSSProperties}
      >
        <div
          className={`pointer-events-none absolute inset-1 border border-[color:var(--sh-rim)] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--sh-rim)_14%,transparent),transparent)] ${shade.glow}`}
          aria-hidden="true"
        />
        <div className="relative">{children}</div>
      </div>
      <div className="flex justify-between px-6" aria-hidden="true">
        <span className="h-5 w-1 bg-[color:var(--sh-black)]" />
        <span className="h-5 w-1 bg-[color:var(--sh-black)]" />
      </div>
    </>
  )

  if (!href) return <div className={shade.sign}>{board}</div>
  return (
    <a {...href} className={`group block ${shade.sign} ${LINK_FOCUS}`}>
      {board}
    </a>
  )
}

function Rooftops({ light, children }: { light: SkyLight; children: ReactNode }) {
  return (
    <div className={`relative overflow-hidden border-y-2 border-[color:var(--sh-black)] bg-gradient-to-b px-4 pb-10 pt-8 sm:px-6 ${light.sky}`}>
      <div className="relative z-10">{children}</div>
      <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-14 w-full" aria-hidden="true" focusable="false">
        <path d={ROOFTOPS} fill={SHADE.black} />
      </svg>
    </div>
  )
}

export function VentureSigns({ companies }: { companies: CVData['companies'] }) {
  const { links } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.15 })

  return (
    <div ref={ref}>
      <Rooftops light={PROFESSION_SKY.engineer}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <li key={company.id}>
              <Sign
                index={index}
                lit={triggered}
                href={
                  company.url
                    ? {
                        href: company.url,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-label': newTabName(links, company.name),
                      }
                    : undefined
                }
              >
                <h3 className={`${TITLE} group-hover:underline`}>
                  <span className="mr-2 grayscale" aria-hidden="true">
                    {company.icon}
                  </span>
                  <SlashBreaks text={company.name} />
                </h3>
                <p className={`mt-1 ${META}`}>{company.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--sh-text)]">{company.description}</p>
              </Sign>
            </li>
          ))}
        </ul>
      </Rooftops>
    </div>
  )
}
