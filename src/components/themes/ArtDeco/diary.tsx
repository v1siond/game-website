'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { jobYears } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { DECO_COLORS as C } from './palette'
import diary from './diary.module.css'

// Work Experience as the city's audio diaries: each job is a reel to reel recorder left behind, arriving
// with the gold glow the city gives the diaries that matter. Play runs the tape: the reels turn, the tape
// counter runs and the highlights light one after another, a line every LINE_MS, then the tape stops.
// One diary plays at a time; playing another stops the first.
//
// Pattern: hybrid. The arrival is CSS off one shared section trigger (data-on, staggered by --i); the
// playback is one setTimeout per line in the shelf, so React renders once a line. Reduced motion keeps
// the reels still and the arrival instant; the lines still light, that is the content, not motion.

const LINE_MS = 2200

interface Playing {
  id: string
  line: number
}

// The recorder: a brass case, two reels with the tape between them, a speaker grille.
function Recorder() {
  return (
    <svg viewBox="0 0 120 64" className="h-14 w-28 flex-shrink-0" aria-hidden="true" focusable="false">
      <rect x="2" y="6" width="116" height="56" rx="6" fill="#2a1d0c" stroke={C.brassMid} strokeWidth="2" />
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

function DiaryCard({ entry, index, playing, onToggle }: { entry: Job; index: number; playing: number | null; onToggle: () => void }) {
  const { years, cards, deco, actions } = useLabels()
  const { start, end } = jobYears(entry, years.present)
  const job = fillLabel(cards.jobSpan, { title: entry.title, company: entry.company, start, end })
  const lines = Math.max(entry.highlights.length, 1)
  const isPlaying = playing !== null

  return (
    <article
      data-playing={isPlaying || undefined}
      className={`relative p-5 ${diary.card}`}
      style={{ '--i': index, '--tape': `${lines * LINE_MS}ms` } as CSSProperties}
    >
      <span className={`pointer-events-none absolute inset-0 ${diary.glow}`} aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-4 min-[375px]:flex-row">
        <Recorder />
        <div className="min-w-0">
          <h3 className={`text-lg leading-snug ${diary.title}`}>{entry.title}</h3>
          <p className="mt-1 text-sm text-[color:var(--deco-cream)]">
            <SlashBreaks text={entry.company} />
          </p>
          <p className="mt-1 text-sm text-[color:var(--deco-gold)]">{fillLabel(years.range, { start, end })}</p>
        </div>
      </div>

      <div className="relative mt-4 h-1.5 overflow-hidden bg-[color:var(--deco-abyss)]" aria-hidden="true">
        <span className={`absolute inset-0 origin-left bg-[color:var(--deco-gold)] ${diary.counter}`} />
      </div>

      {entry.description && <p className="relative mt-4 text-sm leading-relaxed text-[color:var(--deco-mist)]">{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="relative mt-4 space-y-2" aria-label={cards.keyAchievements}>
          {entry.highlights.map((highlight, line) => (
            <li key={highlight} data-lit={(isPlaying && line <= playing) || undefined} className={`flex items-start gap-2 text-sm ${diary.line}`}>
              <svg viewBox="0 0 10 10" className="mt-1 h-3 w-3 flex-shrink-0" aria-hidden="true" focusable="false">
                <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
              </svg>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        {entry.skills.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label={cards.skillsUsed}>
            {entry.skills.slice(0, 4).map((skill) => (
              <li key={skill} className={`px-2 py-1 text-sm ${diary.skill}`}>
                {skill}
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onToggle}
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
}

/** The jobs as a masonry shelf of diaries, one playing at a time. */
export function DiaryShelf({ jobs }: { jobs: Job[] }) {
  const { ref, triggered } = useSectionTrigger()
  const [playing, setPlaying] = useState<Playing | null>(null)

  useEffect(() => {
    if (!playing) return
    const lines = Math.max(jobs.find((job) => job.id === playing.id)?.highlights.length ?? 1, 1)
    const next = playing.line + 1 < lines ? { id: playing.id, line: playing.line + 1 } : null
    const timer = window.setTimeout(() => setPlaying(next), LINE_MS)
    return () => window.clearTimeout(timer)
  }, [playing, jobs])

  const toggle = (id: string) => setPlaying((current) => (current?.id === id ? null : { id, line: 0 }))

  return (
    <ul ref={ref} data-on={triggered || undefined} className={`${MASONRY_LIST} ${diary.shelf}`}>
      {jobs.map((entry, index) => (
        <li key={entry.id} className={MASONRY_ITEM}>
          <DiaryCard entry={entry} index={index} playing={playing?.id === entry.id ? playing.line : null} onToggle={() => toggle(entry.id)} />
        </li>
      ))}
    </ul>
  )
}
