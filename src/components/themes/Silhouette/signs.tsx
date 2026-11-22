'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { ventureCard } from '@/lib/cv/cvView'
import { newTabHint } from '@/lib/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter } from './character'
import { PROFESSION_SKY } from './places'
import { SHADE, type SkyLight } from './palette'
import shade from './shade.module.css'

// The ventures as lit signs in one row over the rooftops of the black city against the dawn, the
// broken hotel sign of a silhouette platformer's town: when the section comes into view each sign
// stutters on in turn (once), and a sign the visitor touches or tabs to shorts out and comes back:
// the short is on the sign's light only, its words stay readable. One row from a tablet up, the
// signs side by side on their posts; stacked on a phone. A power cable runs over the signs, and as
// they light he crosses it hand over hand from one end to the other, once, and hangs there.
//
// His own products (featured) hang first, two wide signs to a row from a laptop up, each with a small
// plate over the name; the other ventures follow three to a row.
//
// Animated: one sign per entry (once), the one being touched, him on the cable (once) and his parts.

const TITLE = 'text-sm font-bold uppercase tracking-[0.25em] text-[color:var(--sh-heading)]'
const META = 'text-sm tracking-wider text-[color:var(--sh-muted-text)]'

// A sign's services, ruled in the rim grey in the meta type.
const SERVICE_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: `border border-[color:var(--sh-rim)] px-1.5 py-0.5 uppercase ${META}`,
}

const ROOFTOPS =
  'M0 60 V34 H40 V22 H58 V34 H96 V14 H104 V6 H110 V14 H122 V30 H170 V18 H210 V40 H250 V26 H262 V10 H270 V26 H300 V36 H350 V20 H392 V44 H430 V28 H470 V16 H486 V28 H520 V38 H560 V24 H600 V60 Z'

// A sign's link is named by its visible text (the plate, name, tagline, description and services), so a
// screen reader reaches every field of the card, then hears that it opens a new tab.
interface SignLink {
  href: string
  target: '_blank'
  rel: string
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
    <a {...href} className={`group block ${shade.sign}`}>
      {board}
    </a>
  )
}

// The cable over the signs, and him on it: he rides a track one hand span short of the cable, so moving
// the track by its own width brings him to the far end.
function Cable({ crossing }: { crossing: boolean }) {
  return (
    <div className="relative mb-6 h-20" aria-hidden="true">
      <div className="absolute inset-x-0 top-1 h-0.5 bg-[color:var(--sh-black)]" />
      <div className={`absolute left-0 right-12 top-0 ${shade.cableCross} ${crossing ? shade.cableCrossed : ''}`}>
        <HeroCharacter profession="engineer" pose="hang" className="block h-16 w-10" />
      </div>
    </div>
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

export function VentureSigns({ companies: entries }: { companies: CVData['companies'] }) {
  const { links, cards, sections } = useLabels()
  const companies = useMemo(() => entries.map(ventureCard), [entries])
  const { ref, triggered } = useSectionTrigger({ threshold: 0.15 })

  return (
    <div ref={ref}>
      <Rooftops light={PROFESSION_SKY.engineer}>
        <Cable crossing={triggered} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {companies.map((company, index) => (
            <li key={company.id} className={company.featured ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <Sign
                index={index}
                lit={triggered}
                href={
                  company.url
                    ? {
                        href: company.url,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : undefined
                }
              >
                {company.featured && (
                  <p className="mb-3 inline-block border border-[color:var(--sh-rim)] px-2 py-0.5 text-sm uppercase tracking-[0.25em] text-[color:var(--sh-heading)]">
                    {cards.ownProduct}
                  </p>
                )}
                <h3 className={`${TITLE} group-hover:underline`}>
                  <span className="mr-2 grayscale" aria-hidden="true">
                    {company.icon}
                  </span>
                  <SlashBreaks text={company.name} />
                </h3>
                <p className={`mt-1 ${META}`}>{company.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--sh-text)]">{company.description}</p>
                <TagList items={company.services} label={sections.services} look={SERVICE_TAGS} />
                {company.url && <span className="sr-only"> {newTabHint(links)}</span>}
              </Sign>
            </li>
          ))}
        </ul>
      </Rooftops>
    </div>
  )
}
