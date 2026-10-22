import type { ReactNode } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { DwellerSprite, type DwellerMotion } from './dweller'
import { CREAM, POSTER_BLUE, POSTER_INK, SHELTER_YELLOW } from './palette'
import atomic from './atomic.module.css'

// The Muay Thai record as the perk chart: the page leaves the green tube for the printed poster (cream
// paper, flat poster blue, ink outlines, the sunburst behind). The facts are the chart's columns, each
// headed by its term on a blue band; each achievement is a perk card with him on it in the mascot style
// (the poster tone, outlined in ink), each card in its own pose: the thumbs up, the knee and kick,
// the targeting stance. The chart's title and each perk's words are cut out and pasted on tilted pastel
// blocks, the way the game prints its perk book covers (research special-chart, youre-special); the
// blocks are drawn for the eye and the plain text sits beside them for screen readers. The spar
// (spar.tsx) decides when each card shows: as his strike lands its card flips in (rotateY with
// perspective) and the star stamps down; the ring it hands over is printed just above the cards. Under
// the pointer a card lifts, he hops and the star turns.

const POSES: DwellerMotion[] = ['thumbsUp', 'strike', 'target']

function Sunburst() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
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

/** Text cut out letter by letter, each word kept on one line, every letter on its own tilted block. */
function CutOutLetters({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap gap-x-4 gap-y-2" aria-hidden="true">
      {text.split(' ').map((word, at) => (
        <span key={`${word}-${at}`} className="inline-flex whitespace-nowrap">
          {[...word].map((letter, place) => (
            <span key={place} className={atomic.cutLetter}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

/** Text cut out word by word, every word on its own tilted block. */
function CutOutWords({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap content-start gap-x-1.5 gap-y-2" aria-hidden="true">
      {text.split(' ').map((word, at) => (
        <span key={`${word}-${at}`} className={atomic.cutWord}>
          {word}
        </span>
      ))}
    </span>
  )
}

function PerkCard({ achievement, index, shown }: { achievement: string; index: number; shown: boolean }) {
  return (
    <div className={`relative flex h-full flex-col overflow-hidden ${atomic.perkCard}`} data-shown={shown || undefined}>
      <div className="relative h-44 overflow-hidden border-b-4 border-atomic-poster-ink">
        <Sunburst />
        <div className={`absolute inset-x-0 bottom-0 mx-auto h-40 w-28 ${atomic.perkHop}`}>
          <DwellerSprite profession="fighter" motion={POSES[index % POSES.length]} className="h-full w-full" />
        </div>
        <span className="absolute right-3 top-3">
          <Star />
        </span>
      </div>
      <p className="flex-1 bg-atomic-cream p-4 text-base text-atomic-poster-ink">
        <span className="sr-only">{achievement}</span>
        <CutOutWords text={achievement} />
      </p>
    </div>
  )
}

interface PerkChartProps {
  martialArts: MartialArts
  // How many achievements have been earned in the spar so far, and the ring printed above their cards.
  shown: number
  ring: ReactNode
}

export function PerkChart({ martialArts, shown, ring }: PerkChartProps) {
  const { achievements, title } = martialArts.primary

  return (
    <div className={`relative flex flex-col p-5 sm:p-8 ${atomic.posterPaper}`}>
      <h3 className="mb-8 text-xl text-atomic-poster-ink sm:text-3xl">
        <span className="sr-only">{title}</span>
        <CutOutLetters text={title} />
      </h3>
      <div className="order-1">{ring}</div>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
          fact: `overflow-hidden border-4 border-atomic-poster-ink bg-atomic-cream ${atomic.posterDrop}`,
          term: 'bg-atomic-poster-blue px-3 py-2 text-sm font-bold uppercase tracking-widest text-atomic-cream',
          value: 'px-3 py-3 text-base text-atomic-poster-ink',
          achievements: 'order-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
          achievement: 'h-full',
        }}
        renderAchievement={(achievement) => {
          const index = achievements.indexOf(achievement)
          return <PerkCard achievement={achievement} index={index} shown={index < shown} />
        }}
      />
    </div>
  )
}
