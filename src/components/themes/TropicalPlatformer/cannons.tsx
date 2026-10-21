'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { jobYears } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { BarrelArt } from './barrel'
import { HeroCharacter } from './character'
import { ExtraLifeBalloon, HiddenCoin, LetterTracker } from './letterCoin'
import { letterCards, nameLetters } from './letters'
import look from './jungle.module.css'
import run from './cannons.module.css'

// Work Experience as a run of blast barrels: every job is a wooden platform with a barrel cannon on its
// corner. The empty barrels turn slowly, as the source's auto barrels do; he sits in one, peeking out of
// its mouth, and only that barrel is a button. Blast turns it to aim at the next job's barrel, fires
// with a recoil, and he flies there rolled into a ball in an arc; the platform he lands on bounces and
// its barrel takes him. The status line says where he landed and focus moves to his new barrel, so a
// keyboard visitor can keep blasting through the jobs. The source hides four letters along every level;
// here the first four letters of his first name spin over the jobs (first, last and evenly between) and
// each is collected when he lands on its job (the first when the run opens), flying up into the tracker
// over the run; all four float up the extra life balloon.
//
// Pattern: measured flight. A click reads the two barrels' boxes, sets the aim angle (--aim) and the
// flight offsets (--dx, --dy, --peak) as CSS variables, and two timers end the aim and the flight; the
// arc itself is CSS (a linear horizontal layer over an eased vertical one). Reduced motion moves him at
// once.

const AIM_MS = 280
const FLIGHT_MS = 820
// How far above the higher barrel the arc peaks, in px.
const ARC_LIFT = 110

interface Flight {
  to: number
  dx: number
  dy: number
  peak: number
}

const jobName = (entry: Job, labels: Labels): string => {
  const { start, end } = jobYears(entry, labels.years.present)
  return fillLabel(labels.cards.jobSpan, { title: entry.title, company: entry.company, start, end })
}

const centre = (element: HTMLElement) => {
  const box = element.getBoundingClientRect()
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}

interface Coin {
  index: number
  letter: string
  found: boolean
}

interface PlatformProps {
  entry: Job
  coins: Coin[]
  index: number
  occupied: boolean
  landed: number
  aim: number | null
  nextName: string
  onBlast: () => void
  barrelRef: (element: HTMLElement | null) => void
}

function Platform({ entry, coins, index, occupied, landed, aim, nextName, onBlast, barrelRef }: PlatformProps) {
  const { years, cards, jungle } = useLabels()
  const { start, end } = jobYears(entry, years.present)
  const cannon = (
    <span className={`relative block ${run.cannon}`} data-aim={aim !== null || undefined} style={{ '--aim': `${aim ?? 0}deg` } as CSSProperties}>
      {occupied && <HeroCharacter profession="engineer" pose="idle" className={`absolute bottom-[58%] left-[10%] w-[80%] ${run.peek}`} />}
      <BarrelArt mark="burst" className="relative block h-auto w-full" />
    </span>
  )

  return (
    <article key={landed} data-landed={landed > 0 || undefined} className={`relative rounded-3xl p-5 pt-6 ${look.board} ${run.platform}`} style={{ '--i': index } as CSSProperties}>
      <span className={`absolute inset-x-0 top-0 h-3 rounded-t-3xl ${run.grass}`} aria-hidden="true" />
      {coins.length > 0 && (
        <div className="absolute -top-5 left-4 flex gap-2">
          {coins.map((coin) => (
            <HiddenCoin key={coin.index} letter={coin.letter} found={coin.found} />
          ))}
        </div>
      )}
      <div className="absolute -top-6 right-4 w-14">
        {occupied ? (
          <button ref={barrelRef} type="button" onClick={onBlast} aria-label={fillLabel(jungle.blastTo, { job: nextName })} className={`block w-full rounded-full ${look.focus}`}>
            {cannon}
          </button>
        ) : (
          <span ref={barrelRef} className={`block ${run.idle}`} aria-hidden="true">
            {cannon}
          </span>
        )}
      </div>

      <div className={`pr-16 ${coins.length > 0 ? 'pt-6' : ''}`}>
        <h3 className={`text-lg leading-snug text-[color:var(--tp-sun-gold)] ${look.display}`}>{entry.title}</h3>
        <p className="mt-1 text-base text-[color:var(--tp-parchment)]">
          <SlashBreaks text={entry.company} />
        </p>
        <p className="mt-1 text-sm text-[color:var(--tp-plank-light)]">{fillLabel(years.range, { start, end })}</p>
      </div>

      {entry.description && <p className="mt-4 text-sm leading-relaxed text-[color:var(--tp-parchment)]">{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="mt-4 space-y-2" aria-label={cards.keyAchievements}>
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm text-[color:var(--tp-parchment)]">
              <svg viewBox="0 0 10 10" className="mt-1 h-3 w-3 flex-shrink-0" aria-hidden="true" focusable="false">
                <circle cx="5" cy="5" r="4" fill="var(--tp-sun-gold)" />
              </svg>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={cards.skillsUsed}>
          {entry.skills.map((skill) => (
            <li key={skill} className={`rounded-lg px-2 py-1 text-sm ${look.tag}`}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

/** The jobs as a masonry run of platforms and barrel cannons; he blasts from one job to the next. */
export function CannonRun({ jobs }: { jobs: Job[] }) {
  const labels = useLabels()
  const { hero } = useWorldView()
  const { ref, triggered } = useSectionTrigger()
  const letters = nameLetters(hero.name)
  const holders = letterCards(letters.length, jobs.length)
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set())
  const [at, setAt] = useState(0)
  const [aim, setAim] = useState<number | null>(null)
  const [flight, setFlight] = useState<Flight | null>(null)
  const [landings, setLandings] = useState<Record<number, number>>({})
  const [status, setStatus] = useState('')
  const stage = useRef<HTMLDivElement>(null)
  const barrels = useRef<Array<HTMLElement | null>>([])
  const timers = useRef<number[]>([])
  const focusAfterLanding = useRef(false)

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  // He starts in the first job's barrel, so its letter is found as the run opens.
  useEffect(() => {
    if (triggered) setVisited((current) => (current.has(0) ? current : new Set(current).add(0)))
  }, [triggered])

  useEffect(() => {
    if (!focusAfterLanding.current) return
    focusAfterLanding.current = false
    barrels.current[at]?.focus()
  }, [at])

  const land = (to: number) => {
    setAt(to)
    setVisited((current) => new Set(current).add(to))
    setAim(null)
    setFlight(null)
    setLandings((count) => ({ ...count, [to]: (count[to] ?? 0) + 1 }))
    setStatus(fillLabel(labels.jungle.landedAt, { job: jobName(jobs[to], labels) }))
    focusAfterLanding.current = true
  }

  const blast = () => {
    if (flight || aim !== null) return
    const to = (at + 1) % jobs.length
    const from = barrels.current[at]
    const target = barrels.current[to]
    const box = stage.current
    if (prefersReducedMotion() || !from || !target || !box) {
      land(to)
      return
    }
    const start = centre(from)
    const end = centre(target)
    const origin = box.getBoundingClientRect()
    const dx = end.x - start.x
    const dy = end.y - start.y
    setAim((Math.atan2(dy - ARC_LIFT, dx) * 180) / Math.PI + 90)
    timers.current.push(
      window.setTimeout(() => {
        setFlight({ to, dx, dy, peak: Math.min(0, dy) - ARC_LIFT })
        // The flight is drawn from the stage's corner, so its start is the barrel's place in the stage.
        stage.current?.style.setProperty('--sx', `${start.x - origin.left}px`)
        stage.current?.style.setProperty('--sy', `${start.y - origin.top}px`)
      }, AIM_MS),
      window.setTimeout(() => land(to), AIM_MS + FLIGHT_MS),
    )
  }

  if (jobs.length === 0) return null
  const nextName = jobName(jobs[(at + 1) % jobs.length], labels)
  const found = new Set(holders.flatMap((holder, index) => (visited.has(holder) ? [index] : [])))
  const complete = letters.length > 0 && found.size === letters.length
  const coinsOn = (job: number): Coin[] =>
    holders.flatMap((holder, index) => (holder === job ? [{ index, letter: letters[index], found: found.has(index) }] : []))

  return (
    <div ref={ref} data-on={triggered || undefined} className={run.run}>
      <div className={`relative mx-auto mb-6 max-w-md rounded-3xl px-5 py-4 text-center ${look.board}`}>
        <p className="mb-3 text-base text-[color:var(--tp-parchment)]">{labels.jungle.lettersHint}</p>
        <LetterTracker letters={letters} found={found} />
        <p className="mt-3 text-base text-[color:var(--tp-sun-gold)]">
          {complete ? labels.jungle.extraLife : fillLabel(labels.jungle.lettersFound, { count: found.size, total: letters.length })}
        </p>
        {complete && <ExtraLifeBalloon />}
      </div>
      <p className={`mb-8 text-center text-base text-[color:var(--tp-parchment)] ${look.caption}`}>{labels.jungle.cannonHint}</p>
      <div ref={stage} className="relative">
        <ul className={MASONRY_LIST}>
          {jobs.map((entry, index) => (
            <li key={entry.id} className={`${MASONRY_ITEM} pt-6`}>
              <Platform
                entry={entry}
                coins={coinsOn(index)}
                index={index}
                occupied={index === at && !flight}
                landed={landings[index] ?? 0}
                aim={index === at ? aim : null}
                nextName={nextName}
                onBlast={blast}
                barrelRef={(element) => {
                  barrels.current[index] = element
                }}
              />
            </li>
          ))}
        </ul>
        {flight && (
          <div
            className={`pointer-events-none absolute left-0 top-0 z-20 h-16 w-12 ${run.flyX}`}
            style={{ '--dx': `${flight.dx}px`, '--dy': `${flight.dy}px`, '--peak': `${flight.peak}px` } as CSSProperties}
            aria-hidden="true"
          >
            <div className={`h-full w-full ${run.flyY}`}>
              <HeroCharacter profession="engineer" pose="roll" className="h-full w-full" />
            </div>
          </div>
        )}
      </div>
      <p role="status" className={`mt-2 min-h-[1.5rem] text-center text-base text-[color:var(--tp-sun-gold)] ${look.caption}`}>
        {status}
      </p>
    </div>
  )
}
