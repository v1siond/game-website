import type { CSSProperties } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { DwellerSprite, type DwellerMotion } from './dweller'
import { CREAM, POSTER_BLUE, POSTER_INK, SHELTER_YELLOW } from './palette'
import atomic from './atomic.module.css'

// The Muay Thai record as the perk chart: the page leaves the green tube for the printed poster (cream
// paper, flat poster blue, ink outlines, the sunburst behind). The facts are the chart's columns, each
// headed by its term on a blue band; each achievement is a perk card with him on it in the mascot style
// (the poster tone, outlined in ink), each card in its own pose: the thumbs up, the knee and kick,
// the targeting stance. When the section's trigger fires the cards flip in one after another (rotateY with
// perspective, staggered by --i) and the star stamps down; under the pointer a card lifts, he hops and
// the star turns.

const POSES: DwellerMotion[] = ['thumbsUp', 'strike', 'target']

function Sunburst() {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width="200" height="200" fill={SHELTER_YELLOW} />
      {Array.from({ length: 16 }, (_, ray) => (
        <path key={ray} d="M100 100 L92 -40 L108 -40 Z" fill={CREAM} opacity="0.55" transform={`rotate(${ray * 22.5} 100 100)`} />
      ))}
    </svg>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 40 40" className={`h-10 w-10 ${atomic.perkStar}`} aria-hidden="true" focusable="false">
      <path d="M20 2 L25 15 L38 15 L27.5 23.5 L31.5 37 L20 29 L8.5 37 L12.5 23.5 L2 15 L15 15 Z" fill={POSTER_BLUE} stroke={POSTER_INK} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

function PerkCard({ achievement, index }: { achievement: string; index: number }) {
  return (
    <div className={`relative flex h-full flex-col overflow-hidden ${atomic.perkCard}`} style={{ '--i': index } as CSSProperties}>
      <div className="relative h-44 overflow-hidden border-b-4 border-atomic-poster-ink">
        <Sunburst />
        <div className={`absolute inset-x-0 bottom-0 mx-auto h-40 w-28 ${atomic.perkHop}`}>
          <DwellerSprite profession="fighter" motion={POSES[index % POSES.length]} className="h-full w-full" />
        </div>
        <span className="absolute right-3 top-3">
          <Star />
        </span>
      </div>
      <p className="flex-1 bg-atomic-cream p-4 text-base font-bold leading-snug text-atomic-poster-ink">{achievement}</p>
    </div>
  )
}

export function PerkChart({ martialArts }: { martialArts: MartialArts }) {
  const { achievements } = martialArts.primary

  return (
    <div className={`relative p-5 sm:p-8 ${atomic.posterPaper}`}>
      <h3 className="mb-6 text-2xl font-bold uppercase tracking-wide text-atomic-poster-ink sm:text-3xl">{martialArts.primary.title}</h3>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
          fact: `overflow-hidden border-4 border-atomic-poster-ink bg-atomic-cream ${atomic.posterDrop}`,
          term: 'bg-atomic-poster-blue px-3 py-2 text-sm font-bold uppercase tracking-widest text-atomic-cream',
          value: 'px-3 py-3 text-base text-atomic-poster-ink',
          achievements: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
          achievement: 'h-full',
        }}
        renderAchievement={(achievement) => <PerkCard achievement={achievement} index={achievements.indexOf(achievement)} />}
      />
    </div>
  )
}
