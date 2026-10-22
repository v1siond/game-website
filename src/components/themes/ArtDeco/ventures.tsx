'use client'

import { useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { CVData } from '@/lib/cv/content'
import { fillLabel } from '@/lib/cv/labels'
import { DECO_COLORS as C } from './palette'
import { SurvivorSprite, type DecoMotion } from './sprite'
import v from './ventures.module.css'

// The ventures as the city's propaganda banners: red cloth with gold capitals, furled on the brass rod
// under a catwalk. He walks the catwalk to each banner's release cord, reaches up, yanks it, and the
// banner drops and unrolls under the rod (the cord jerks down with his hand), the next one only after the last has fallen. Each banner's
// tassel is a button: a press furls that banner back up and he walks over to pull it down again. Behind
// the catwalk is the lobby wall: an arched window onto the drowned city over each cord, a teal sconce
// either side.
//
// Pattern: open banners are React state; the next furled banner is the one he works. His walk is a CSS
// keyframe between two columns (--from and --to), keyed per trip, that ends on its own animationend; the
// pull ends on the sprite's. On phones the banners stack in one column, so he stays by the one cord, the
// walk plays in place and one yank drops every furled banner in a cascade down the stack (the column
// count is read from the laid out list at the pull). Reduced motion: every banner hangs open, he stands
// still, the tassels do nothing.

type Company = CVData['companies'][number]
type Act = 'rest' | 'walk' | 'pull'

const COLUMNS = 3

const MOTION: Record<Act, DecoMotion> = { rest: 'idle', walk: 'walk', pull: 'pull' }

const TOWERS =
  'M6 92 V54 H14 V40 H20 V30 H24 V40 H30 V60 H38 V46 H44 V36 H48 V20 H52 V36 H56 V50 H64 V34 H70 V58 H78 V44 H84 V62 H90 V92 Z'

// One bay of the lobby wall: an arched window onto the city in the fog, its thin neon, and two sconces.
function LobbyBay() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <path d="M32 100 V40 A48 34 0 0 1 128 40 V100 Z" fill={C.brassDark} />
      <path d="M38 100 V42 A42 30 0 0 1 122 42 V100 Z" fill={C.lobbyGlass} />
      <path d="M38 100 V70 H122 V100 Z" fill={C.abyss} opacity="0.55" />
      <g transform="translate(35 8)" fill={C.lobbyTowers}>
        <path d={TOWERS} />
      </g>
      <path d="M62 66 V80 M104 58 V74" stroke={C.neonPink} strokeWidth="1.2" opacity="0.8" />
      <path d="M50 74 H58" stroke={C.waterGlow} strokeWidth="1.2" opacity="0.8" />
      <path d="M80 12 V100 M38 56 H122" stroke={C.brassDark} strokeWidth="2.5" />
      {[16, 144].map((x) => (
        <g key={x}>
          <path d={`M${x - 4} 50 H${x + 4} L${x + 3} 68 H${x - 3} Z`} fill={C.vita} opacity="0.75" />
          <path d={`M${x - 6} 48 H${x + 6} M${x - 5} 70 H${x + 5}`} stroke={C.gold} strokeWidth="2" />
        </g>
      ))}
    </svg>
  )
}

function Banner({ company, open, wave, onTassel }: { company: Company; open: boolean; wave: number; onTassel: () => void }) {
  const { links, deco } = useLabels()
  return (
    <div className="relative">
      <div className={`relative z-10 h-3 ${v.rod}`} aria-hidden="true" />
      <span className={`absolute inset-x-3 top-1 z-10 h-5 ${v.furled}`} data-open={open || undefined} aria-hidden="true" />
      <div className="overflow-hidden">
        <div className={`relative px-5 pb-10 pt-6 ${v.cloth}`} data-open={open || undefined} style={{ '--wave': wave } as CSSProperties}>
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
        className={`absolute right-2 top-2 z-20 h-11 w-6 before:absolute before:inset-y-0 before:-inset-x-2.5 before:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--deco-gold-bright)] ${v.tassel}`}
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
  const [wave, setWave] = useState<readonly number[]>(() => companies.map(() => 0))
  const list = useRef<HTMLUListElement>(null)
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

  const stacked = () => {
    if (!list.current) return false
    return getComputedStyle(list.current).gridTemplateColumns.split(' ').length === 1
  }

  // One column: the yank drops every furled banner, each a beat after the one above it.
  const pulled = () => {
    const all = stacked()
    const dropping = open.map((isOpen, i) => !isOpen && (all || i === target))
    setWave(dropping.map((drops, i) => (drops ? dropping.slice(0, i).filter(Boolean).length : 0)))
    setOpen((now) => now.map((isOpen, i) => isOpen || dropping[i]))
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
      <div className={`relative h-36 overflow-hidden ${v.catwalk}`} aria-hidden="true">
        <div className="absolute inset-x-0 bottom-2 top-0 flex">
          {Array.from({ length: columns }, (_, column) => (
            <div key={column} className={`h-full flex-1 ${column > 0 ? 'max-md:hidden' : ''}`}>
              <LobbyBay />
            </div>
          ))}
        </div>
        {Array.from({ length: columns }, (_, column) => (
          <span
            key={column}
            data-pulling={(act === 'pull' && column === trip.to) || undefined}
            className={`absolute top-0 h-4 w-px ${v.cord} ${column > 0 ? 'max-md:hidden' : ''}`}
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
      <ul ref={list} className="grid gap-6 md:grid-cols-3">
        {companies.map((company, index) => (
          <li key={company.id}>
            <Banner company={company} open={shown(index)} wave={wave[index] ?? 0} onTassel={() => furl(index)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
