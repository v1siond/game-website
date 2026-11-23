import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { SurvivorSprite, type SurvivorMotion } from './survivor'
import { CREAM, POSTER_BLUE, POSTER_INK, SHELTER_YELLOW } from './palette'
import atomic from './atomic.module.css'

// The Muay Thai record as the badge chart: the page leaves the green tube for the printed poster (cream
// paper, flat poster blue, ink outlines, the sunburst behind). The facts are the chart's columns, each
// headed by its term on a blue band; each achievement is a badge card with him on it in the mascot style
// (the poster tone, outlined in ink), each card in its own pose: the thumbs up, the knee and kick,
// the targeting stance. The chart's title and each badge's words are cut out and pasted on tilted pastel
// blocks, the way atomic age posters print them; the blocks are drawn for the eye and the plain text sits beside them for screen readers. The facts and the
// badges are the cards the Muay Thai scene counts: on the stage the mutant takes a strike per badge
// (scenes.tsx). Under the pointer a card lifts, he hops and the star turns.

const POSES: SurvivorMotion[] = ['thumbsUp', 'strike', 'target']

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
    <svg viewBox="0 0 40 40" className={`h-10 w-10 ${atomic.badgeStar}`} aria-hidden="true" focusable="false">
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

function BadgeCard({ achievement, index }: { achievement: string; index: number }) {
  return (
    <div className={`relative flex h-full flex-col overflow-hidden ${atomic.badgeCard}`}>
      <div className="relative h-44 overflow-hidden border-b-4 border-atomic-poster-ink">
        <Sunburst />
        <div className={`absolute inset-x-0 bottom-0 mx-auto h-40 w-28 ${atomic.badgeHop}`}>
          <SurvivorSprite profession="fighter" motion={POSES[index % POSES.length]} className="h-full w-full" />
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

export function BadgeChart({ martialArts }: { martialArts: MartialArts }) {
  const { title } = martialArts.primary

  return (
    <div className={`relative flex flex-col p-5 sm:p-8 ${atomic.posterPaper}`}>
      <h3 className="mb-8 text-xl text-atomic-poster-ink sm:text-3xl">
        <span className="sr-only">{title}</span>
        <CutOutLetters text={title} />
      </h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
            fact: `overflow-hidden border-4 border-atomic-poster-ink bg-atomic-cream ${atomic.posterDrop}`,
            term: 'bg-atomic-blue-dark px-3 py-2 text-sm font-bold uppercase tracking-widest text-atomic-cream',
            value: 'px-3 py-3 text-base text-atomic-poster-ink',
            achievements: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
            achievement: 'h-full',
          }}
          renderAchievement={(achievement, index) => <BadgeCard achievement={achievement} index={index} />}
        />
      </div>
    </div>
  )
}
