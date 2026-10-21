'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { COLORS as C } from './palette'
import { letterCards, nameLetters } from './letters'
import look from './jungle.module.css'
import grove from './vines.module.css'

// Projects as a grove of hanging planks: each project hangs from two leafy vines and sways when pointed
// at or focused. The source hides four letters in every level; here they are the first four letters of
// his first name, spinning on four of the cards (first, last and evenly between). A click collects one:
// it flies up and its slot in the tracker under the title fills in. With all four found, a red balloon
// floats up and the status line says so (the source's extra life).
//
// Pattern: React state for the found letters, CSS for the motion. A collected letter's button is gone, so
// focus moves to the tracker, which the status line also reads out.

function Vines() {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-full h-10 w-full" aria-hidden="true" focusable="false">
      {[40, 160].map((x) => (
        <g key={x}>
          <path d={`M${x} 0 Q${x - 6} 14 ${x} 24 T${x} 40`} fill="none" stroke={C.moss} strokeWidth="4" />
          <path d={`M${x} 12 q10 -6 14 2 q-8 2 -14 -2 Z M${x} 26 q-10 -6 -14 2 q8 2 14 -2 Z`} fill={C.fern} />
        </g>
      ))}
    </svg>
  )
}

// A letter as the gold coin it spins on.
function LetterCoin({ letter }: { letter: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" fill={C.letter} stroke={C.barkDark} strokeWidth="3" />
      <circle cx="20" cy="20" r="13" fill="none" stroke={C.sunCore} strokeWidth="1.5" opacity="0.8" />
      <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="900" fill={C.barkDark} fontFamily="Arial Black, sans-serif">
        {letter}
      </text>
    </svg>
  )
}

interface HiddenLetter {
  index: number
  letter: string
}

interface CardProps {
  slot: ProjectSlot
  index: number
  letters: HiddenLetter[]
  found: ReadonlySet<number>
  onCollect: (index: number) => void
}

// The coins hang over the card's top right corner. Where the card is narrow (a phone, the two up tablet
// columns) the name starts below them; from lg up the card is wide enough to run beside them.
const CLEAR_COINS = 'pt-6 lg:pr-24 lg:pt-0'

function HangingCard({ slot, index, letters, found, onCollect }: CardProps) {
  const labels = useLabels()
  const { project, years, links } = slot

  return (
    <div className={`relative pt-10 ${grove.hang}`} style={{ '--i': index } as CSSProperties}>
      <article className={`relative rounded-3xl p-5 ${look.board} ${grove.card}`}>
        <Vines />
        {letters.length > 0 && (
          <div className="absolute -top-5 right-4 flex gap-2">
            {letters.map(({ index: letterIndex, letter }) =>
              found.has(letterIndex) ? (
                <span key={letterIndex} className={`block h-11 w-11 ${grove.flown}`} aria-hidden="true">
                  <LetterCoin letter={letter} />
                </span>
              ) : (
                <button
                  key={letterIndex}
                  type="button"
                  onClick={() => onCollect(letterIndex)}
                  aria-label={fillLabel(labels.jungle.collectLetter, { letter })}
                  className={`block h-11 w-11 rounded-full ${look.focus} ${grove.coin}`}
                >
                  <LetterCoin letter={letter} />
                </button>
              ),
            )}
          </div>
        )}

        <h3 className={`text-lg leading-snug text-[color:var(--tp-sun-gold)] ${look.display} ${letters.length > 0 ? CLEAR_COINS : ''}`}>
          <SlashBreaks text={project.name} />
        </h3>
        {project.role && <p className="mt-1 text-sm font-bold text-[color:var(--tp-plank-light)]">{project.role}</p>}
        {years && <p className="mt-1 text-sm text-[color:var(--tp-plank-light)]">{years}</p>}
        {project.tagline && <p className="mt-3 text-base leading-relaxed text-[color:var(--tp-parchment)]">{project.tagline}</p>}
        {project.impact && (
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--tp-parchment)]">
            <span className="font-bold text-[color:var(--tp-sun-gold)]">{labels.cards.impact}: </span>
            {project.impact}
          </p>
        )}
        {project.techStack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={labels.cards.technologiesUsed}>
            {project.techStack.map((tech) => (
              <li key={tech} className={`rounded-lg px-2 py-1 text-sm ${look.tag}`}>
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {links.length > 0 ? (
            links.map(({ kind, label, linkProps }) => (
              <a key={kind} {...linkProps} className={`inline-flex min-h-[44px] items-center rounded-xl px-4 text-sm ${look.button} ${look.buttonWood} ${look.focus}`}>
                {label}
              </a>
            ))
          ) : (
            <p className="text-sm italic text-[color:var(--tp-plank-light)]">{labels.links.noPublicLink}</p>
          )}
        </div>
      </article>
    </div>
  )
}

function Tracker({ letters, found }: { letters: string[]; found: ReadonlySet<number> }) {
  return (
    <ol className="flex justify-center gap-3" aria-hidden="true">
      {letters.map((letter, index) => (
        <li key={index} data-found={found.has(index) || undefined} className={`flex h-12 w-12 items-center justify-center rounded-full ${grove.slot}`}>
          {found.has(index) && (
            <span className={`block h-full w-full ${grove.landed}`}>
              <LetterCoin letter={letter} />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

/** The projects hanging from vines, with his name's letters hidden on four of them. */
export function VineGrove({ projects }: { projects: Project[] }) {
  const labels = useLabels()
  const { hero } = useWorldView()
  const { ref, triggered } = useSectionTrigger()
  const letters = nameLetters(hero.name)
  const holders = letterCards(letters.length, projects.length)
  const [found, setFound] = useState<ReadonlySet<number>>(() => new Set())
  const tracker = useRef<HTMLDivElement>(null)
  const complete = letters.length > 0 && found.size === letters.length

  const collect = (index: number) => {
    setFound((current) => new Set(current).add(index))
    tracker.current?.focus()
  }

  const lettersOn = (card: number): HiddenLetter[] =>
    holders.flatMap((holder, index) => (holder === card ? [{ index, letter: letters[index] }] : []))

  const count = fillLabel(labels.jungle.lettersFound, { count: found.size, total: letters.length })

  return (
    <div ref={ref} data-on={triggered || undefined} className={grove.grove}>
      <div ref={tracker} tabIndex={-1} className={`relative mx-auto mb-10 max-w-md rounded-3xl px-5 py-4 text-center ${look.board} ${look.focus}`}>
        <p className="mb-3 text-base text-[color:var(--tp-parchment)]">{labels.jungle.lettersHint}</p>
        <Tracker letters={letters} found={found} />
        <p role="status" className="mt-3 text-base text-[color:var(--tp-sun-gold)]">
          {complete ? labels.jungle.extraLife : count}
        </p>
        {complete && (
          <svg viewBox="0 0 40 60" className={`pointer-events-none absolute -top-4 right-6 h-16 w-10 ${grove.balloon}`} aria-hidden="true" focusable="false">
            <path d="M20 2 C31 2 37 11 37 20 C37 31 28 39 20 40 C12 39 3 31 3 20 C3 11 9 2 20 2 Z" fill={C.target} />
            <ellipse cx="13" cy="13" rx="4" ry="6" fill={C.burst} opacity="0.5" />
            <path d="M17 40 L23 40 L20 44 Z M20 44 Q16 50 20 54 T20 60" fill="none" stroke={C.parchment} strokeWidth="1.5" />
          </svg>
        )}
      </div>

      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => {
          const card = projects.indexOf(slot.project)
          return <HangingCard slot={slot} index={card} letters={lettersOn(card)} found={found} onCollect={collect} />
        }}
      />
    </div>
  )
}
