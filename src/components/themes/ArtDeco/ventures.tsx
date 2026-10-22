'use client'

import { useEffect, useState, type AnimationEvent, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { CVData } from '@/lib/cv/content'
import { fillLabel } from '@/lib/cv/labels'
import { SurvivorSprite, type DecoMotion } from './sprite'
import v from './ventures.module.css'

// The ventures as the city's propaganda banners: red cloth with gold capitals, furled on the brass rod
// under a catwalk. He walks the catwalk to each banner's release cord, reaches up, yanks it, and the
// banner drops and unrolls under the rod (the cord jerks down with his hand), the next one only after the last has fallen. Each banner's
// tassel is a button: a press furls that banner back up and he walks over to pull it down again.
//
// Pattern: open banners are React state; the next furled banner is the one he works. His walk is a CSS
// keyframe between two columns (--from and --to), keyed per trip, that ends on its own animationend; the
// pull ends on the sprite's. On phones the banners stack in one column, so he stays by the one cord and
// the walk plays in place. Reduced motion: every banner hangs open, he stands still, the tassels do
// nothing.

type Company = CVData['companies'][number]
type Act = 'rest' | 'walk' | 'pull'

const COLUMNS = 3

const MOTION: Record<Act, DecoMotion> = { rest: 'idle', walk: 'walk', pull: 'pull' }

function Banner({ company, open, onTassel }: { company: Company; open: boolean; onTassel: () => void }) {
  const { links, deco } = useLabels()
  return (
    <div className="relative">
      <div className={`relative z-10 h-3 ${v.rod}`} aria-hidden="true" />
      <span className={`absolute inset-x-3 top-1 z-10 h-5 ${v.furled}`} data-open={open || undefined} aria-hidden="true" />
      <div className="overflow-hidden">
        <div className={`relative px-5 pb-10 pt-6 ${v.cloth}`} data-open={open || undefined}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? undefined : -1}
            aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
            className="block text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--deco-gold-bright)]"
          >
            <span className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center text-3xl ${v.medal}`} aria-hidden="true">
              {company.icon}
            </span>
            <h3 className={`text-lg uppercase tracking-[0.12em] ${v.title}`}>
              <SlashBreaks text={company.name} />
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[color:var(--deco-gold-bright)]">{company.tagline}</p>
            <p className="mt-4 text-base text-[color:var(--deco-cream)]">{company.description}</p>
          </a>
          <span className={`absolute inset-x-0 bottom-0 h-4 ${v.roll}`} aria-hidden="true" />
        </div>
      </div>
      <button
        type="button"
        onClick={onTassel}
        aria-label={fillLabel(deco.pullCord, { venture: company.name })}
        className={`absolute right-2 top-2 z-20 h-11 w-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--deco-gold-bright)] ${v.tassel}`}
      />
    </div>
  )
}

/** The ventures section: banners he releases one after another from the catwalk. */
export function PropagandaBanners({ companies }: { companies: Company[] }) {
  const reduced = useReducedMotion()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const [open, setOpen] = useState<boolean[]>(() => companies.map(() => false))
  const [trip, setTrip] = useState({ from: -1, to: -1, count: 0 })
  const [act, setAct] = useState<Act>('rest')
  const [target, setTarget] = useState(-1)
  const columns = Math.min(companies.length, COLUMNS)
  const next = open.indexOf(false)

  useEffect(() => {
    if (!triggered || reduced || act !== 'rest' || next < 0) return
    const column = next % columns
    setTarget(next)
    if (column === trip.to) {
      setAct('pull')
      return
    }
    setTrip((now) => ({ from: now.to, to: column, count: now.count + 1 }))
    setAct('walk')
  }, [triggered, reduced, act, next, columns, trip.to])

  const walked = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || act !== 'walk') return
    setAct('pull')
  }

  const pulled = () => {
    setOpen((now) => now.map((isOpen, i) => isOpen || i === target))
    setAct('rest')
  }

  const furl = (index: number) => {
    if (reduced) return
    setOpen((now) => now.map((isOpen, i) => isOpen && i !== index))
  }

  const shown = (index: number) => reduced || open[index]
  const walkVars = { '--from': trip.from, '--to': trip.to, '--span': Math.abs(trip.to - trip.from), '--columns': columns } as CSSProperties

  return (
    <div ref={ref}>
      <div className={`relative h-40 overflow-hidden ${v.catwalk}`} aria-hidden="true">
        {Array.from({ length: columns }, (_, column) => (
          <span
            key={column}
            data-pulling={(act === 'pull' && column === trip.to) || undefined}
            className={`absolute top-0 h-8 w-px ${v.cord} ${column > 0 ? 'max-md:hidden' : ''}`}
            style={{ '--column': column, '--columns': columns } as CSSProperties}
          />
        ))}
        {triggered && (
          <div key={trip.count} className={`absolute bottom-2 left-0 ${v.lane} ${reduced ? '' : v.walker}`} style={walkVars} onAnimationEnd={walked}>
            <SurvivorSprite
              profession="engineer"
              motion={reduced ? 'still' : MOTION[act]}
              onDone={act === 'pull' ? pulled : undefined}
              className={`mx-auto block h-32 w-20 ${act === 'walk' && trip.to < trip.from ? v.back : ''}`}
            />
          </div>
        )}
        <div className={`absolute inset-x-0 bottom-0 h-2 ${v.rail}`} />
      </div>
      <ul className="grid gap-6 md:grid-cols-3">
        {companies.map((company, index) => (
          <li key={company.id}>
            <Banner company={company} open={shown(index)} onTassel={() => furl(index)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
