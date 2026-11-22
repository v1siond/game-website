'use client'

import { memo, useCallback, useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { jobYears } from '@/lib/cv/sectionText'
import { jobCard } from '@/lib/cv/cvView'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import { cssVars } from '@/lib/cssVars'
import type { Job } from '@/lib/cv/content'
import { DECO_COLORS as C } from './palette'
import { SurvivorSprite } from './sprite'
import diary from './diary.module.css'

// Work Experience as the city's audio diaries: each job is a reel to reel recorder left behind, arriving
// with the gold glow the city gives the diaries that matter. Play runs the tape: the reels turn, the tape
// counter runs and the highlights light one after another, a line every LINE_MS (quicker on a long diary,
// so the whole tape runs inside TAPE_MS), then the tape stops.
// One diary plays at a time; playing another stops the first. While a diary plays he steps up in
// the card's corner and holds it by his face, listening, nodding with the voice; when the tape ends he is gone.
// The newest diary starts on its own once a quarter of it is in view, so he is there as the visitor arrives.
//
// Pattern: hybrid. The arrival is CSS off one shared section trigger (data-on, staggered by --i); the
// playback is one setTimeout per line in the shelf, so React renders once a line. Reduced motion keeps
// the reels still and the arrival instant and plays nothing on its own; the lines still light on Play,
// that is the content, not motion.

const LINE_MS = 2200
const TAPE_MS = 4800

/** How long each line of a diary plays, so its whole tape ends inside TAPE_MS. */
const lineMsFor = (lines: number) => Math.min(LINE_MS, TAPE_MS / lines)

const SKILL_TAGS: TagListLook = { list: 'flex flex-wrap gap-2', tag: `px-2 py-1 text-sm ${diary.skill}` }

// A job's highlights, each behind a diamond in the line's own colour, lit one by one as the diary plays.
const DIARY_LINES: MarkedLinesLook = {
  list: 'relative mt-4 space-y-2',
  line: `flex items-start gap-2 text-sm ${diary.line}`,
  marker: (
    <svg viewBox="0 0 10 10" className="mt-1 h-3 w-3 flex-shrink-0" aria-hidden="true" focusable="false">
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
    </svg>
  ),
}

interface Playing {
  id: string
  line: number
}

// The recorder: a brass case, two reels with the tape between them, a speaker grille.
function Recorder() {
  return (
    <svg viewBox="0 0 120 64" className="h-14 w-28 flex-shrink-0" aria-hidden="true" focusable="false">
      <rect x="2" y="6" width="116" height="56" rx="6" fill={C.recorderCase} stroke={C.brassMid} strokeWidth="2" />
      <path d="M8 50 H112" stroke={C.brassDark} strokeWidth="1" />
      <path d="M30 34 L60 44 L90 34" fill="none" stroke={C.sepia} strokeWidth="2" />
      {[30, 90].map((cx) => (
        <g key={cx} className={diary.reel} style={{ '--cx': `${cx}px` } as CSSProperties}>
          <circle cx={cx} cy="28" r="17" fill={C.sepia} stroke={C.gold} strokeWidth="2" />
          <circle cx={cx} cy="28" r="5" fill={C.gold} />
          {[0, 120, 240].map((angle) => (
            <path key={angle} d={`M${cx} 28 L${cx} 14`} stroke={C.gold} strokeWidth="3" strokeLinecap="round" transform={`rotate(${angle} ${cx} 28)`} />
          ))}
        </g>
      ))}
      {[52, 57, 62, 67].map((x) => (
        <path key={x} d={`M${x} 54 V60`} stroke={C.gold} strokeWidth="1.5" />
      ))}
    </svg>
  )
}

interface DiaryCardProps {
  entry: Job
  index: number
  /** The line playing on this card's tape, or null while it is stopped. */
  playing: number | null
  onToggle: (id: string) => void
}

// Memoised: a line ticking on one tape renders only that card, the shelf hands the rest the same props.
const DiaryCard = memo(function DiaryCard({ entry, index, playing, onToggle }: DiaryCardProps) {
  const { years, cards, deco, actions } = useLabels()
  const { start, end } = jobYears(entry, years.present)
  const job = fillLabel(cards.jobSpan, { title: entry.title, company: entry.company, start, end })
  const card = jobCard(entry, years)
  const lines = Math.max(entry.highlights.length, 1)
  const isPlaying = playing !== null
  const reduced = useReducedMotion()

  return (
    <article
      data-playing={isPlaying || undefined}
      className={`relative p-5 ${diary.card}`}
      style={cssVars({ '--i': index, '--tape': `${lines * lineMsFor(lines)}ms` })}
    >
      <span className={`pointer-events-none absolute inset-0 ${diary.glow}`} aria-hidden="true" />
      {isPlaying && (
        <div className={`pointer-events-none absolute right-2 top-2 h-24 w-16 ${diary.listener}`} aria-hidden="true">
          <SurvivorSprite profession="engineer" motion={reduced ? 'still' : 'listen'} className="h-full w-full" />
        </div>
      )}
      <div className="relative flex flex-col items-start gap-4 min-[375px]:flex-row">
        <Recorder />
        <div className="min-w-0 min-[375px]:pr-14">
          <h3 className={`text-lg leading-snug ${diary.title}`}>{card.title}</h3>
          <p className="mt-1 text-sm text-[color:var(--deco-cream)]">
            <SlashBreaks text={card.company} />
          </p>
          <p className="mt-1 text-sm text-[color:var(--deco-gold)]">{card.years}</p>
          {card.location && <p className="mt-1 text-sm text-[color:var(--deco-mist)]">{card.location}</p>}
        </div>
      </div>

      <div className="relative mt-4 h-1.5 overflow-hidden bg-[color:var(--deco-abyss)]" aria-hidden="true">
        <span className={`absolute inset-0 origin-left bg-[color:var(--deco-gold)] ${diary.counter}`} />
      </div>

      {card.description && <p className="relative mt-4 text-sm leading-relaxed text-[color:var(--deco-mist)]">{card.description}</p>}

      <MarkedLines
        items={card.highlights}
        label={cards.keyAchievements}
        look={DIARY_LINES}
        lineProps={(line) => ({ 'data-lit': (isPlaying && line <= playing) || undefined })}
      />

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        <TagList items={card.skills} label={cards.skillsUsed} look={SKILL_TAGS} />
        <button
          type="button"
          onClick={() => onToggle(entry.id)}
          aria-pressed={isPlaying}
          aria-label={fillLabel(isPlaying ? deco.stopDiary : deco.playDiary, { job })}
          className={`inline-flex min-h-[44px] items-center gap-2 px-4 text-sm uppercase tracking-[0.15em] ${diary.play}`}
        >
          <svg viewBox="0 0 10 10" className="h-3 w-3" aria-hidden="true" focusable="false">
            {isPlaying ? <rect width="10" height="10" fill="currentColor" /> : <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />}
          </svg>
          {isPlaying ? deco.stop : actions.play}
        </button>
      </div>
    </article>
  )
})

/** The jobs as a masonry shelf of diaries, one playing at a time. */
export function DiaryShelf({ jobs }: { jobs: Job[] }) {
  // A low threshold: on a phone the stacked shelf is several screens tall.
  const { ref, triggered } = useSectionTrigger({ threshold: 0.05 })
  // The autoplay waits for the newest diary itself, so he steps in where the visitor is looking.
  const { ref: newestRef, triggered: newestInView } = useSectionTrigger({ threshold: 0.25 })
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState<Playing | null>(null)
  const newest = jobs[0]?.id

  useEffect(() => {
    if (!newestInView || reduced || !newest) return
    setPlaying({ id: newest, line: 0 })
  }, [newestInView, reduced, newest])

  useEffect(() => {
    if (!playing) return
    const lines = Math.max(jobs.find((job) => job.id === playing.id)?.highlights.length ?? 1, 1)
    const next = playing.line + 1 < lines ? { id: playing.id, line: playing.line + 1 } : null
    const timer = window.setTimeout(() => setPlaying(next), lineMsFor(lines))
    return () => window.clearTimeout(timer)
  }, [playing, jobs])

  const toggle = useCallback((id: string) => setPlaying((current) => (current?.id === id ? null : { id, line: 0 })), [])

  return (
    <ul ref={ref} data-on={triggered || undefined} className={`${MASONRY_LIST} ${diary.shelf}`}>
      {jobs.map((entry, index) => (
        <li key={entry.id} ref={index === 0 ? newestRef : undefined} className={MASONRY_ITEM}>
          <DiaryCard entry={entry} index={index} playing={playing?.id === entry.id ? playing.line : null} onToggle={toggle} />
        </li>
      ))}
    </ul>
  )
}
