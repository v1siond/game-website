'use client'

import { useEffect, useMemo, useReducer, useState } from 'react'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ActionMenu, PHOSPHOR_BUTTON } from './controls'
import { DwellerSprite } from './dweller'
import { KEYS, pose } from './pose'
import type { Scene } from './scenes'
import { READS_BESIDE } from './sections'
import { AtomicStage } from './stage'
import { atomicId } from './anchors'
import { buildBoard, hackReducer, initialHack, MAX_ATTEMPTS, type HackAction, type HackBoard, type HackCell, type HackLogEntry, type HackState } from './hacking'
import atomic from './atomic.module.css'

// Contact, outside in the town at dusk: on the stage he and his three dogs walk out to a public terminal on its
// post (scenes.tsx). Over it, the terminal itself: the contact menu on the left, always open, and on the
// right the password game (hacking.ts holds the rules): his tools hidden in a memory dump, the attempts as
// blocks, every guess answered in the log. A granted password powers on the reward line and he raises his
// thumb; a locked terminal offers a reboot, which deals a fresh dump (a new seed remounts the game).

const cellText = (cell: HackCell, removed: string[]): string => {
  if (cell.kind === 'word') return removed.includes(cell.word) ? '.'.repeat(cell.word.length) : cell.word
  return cell.text
}

// What a click on a cell does while the game runs: a live word guesses it, an unused bracket pair
// spends it, anything else is junk.
const pickOf = (cell: HackCell, state: HackState): HackAction | null => {
  if (state.status !== 'playing') return null
  if (cell.kind === 'word' && !state.removed.includes(cell.word)) return { type: 'guess', word: cell.word }
  if (cell.kind === 'bracket' && !state.usedBrackets.includes(cell.id)) return { type: 'bracket', id: cell.id }
  return null
}

function DumpRow({ address, cells, state, onPick }: { address: string; cells: HackCell[]; state: HackState; onPick: (pick: HackAction) => void }) {
  return (
    <p className="flex gap-3 whitespace-pre text-sm leading-[2.75rem]">
      <span className="text-atomic-phosphor-dim-text" aria-hidden="true">
        {address}
      </span>
      <span>
        {cells.map((cell, index) => {
          const text = cellText(cell, state.removed)
          const pick = pickOf(cell, state)
          if (!pick) {
            return (
              <span key={index} aria-hidden="true">
                {text}
              </span>
            )
          }
          return (
            // each dump line is 44px tall and the pick fills it, so picks on lines above and below never share a
            // pixel; a pick under 44px wide grows an invisible band each side to 44px, a wider one keeps its width
            <button key={index} type="button" onClick={() => onPick(pick)} className={`relative inline-block h-11 leading-[2.75rem] before:absolute before:inset-y-0 before:left-[min(0px,calc((100%-44px)/2))] before:right-[min(0px,calc((100%-44px)/2))] before:content-[''] ${atomic.dumpPick}`}>
              <span className="relative">{text}</span>
            </button>
          )
        })}
      </span>
    </p>
  )
}

function LogLine({ entry }: { entry: HackLogEntry }) {
  const { hud } = useLabels()
  const lines: Record<HackLogEntry['kind'], string[]> = {
    denied: [`> ${entry.word}`, hud.entryDenied, fillLabel(hud.inPlace, { count: entry.inPlace })],
    granted: [`> ${entry.word}`, hud.accessGranted],
    dud: [hud.dudRemoved],
    reset: [hud.attemptsRestored],
  }
  return (
    <li className="text-sm">
      {lines[entry.kind].map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </li>
  )
}

// Him at the keys on the access screen once the password matches.
const AT_KEYS = pose(KEYS)

function PasswordGame({ board, onReboot }: { board: HackBoard; onReboot: () => void }) {
  const { hud } = useLabels()
  const reducer = useMemo(() => hackReducer(board), [board])
  const [state, dispatch] = useReducer(reducer, undefined, initialHack)
  const half = Math.ceil(board.rows.length / 2)
  const columns = [board.rows.slice(0, half), board.rows.slice(half)]
  // The last four log entries, each keyed by its place in the whole log, so the live region gets only the new line.
  const shown = state.log.slice(-4)
  const firstShown = state.log.length - shown.length

  return (
    <div className={atomic.hackScreen} data-status={state.status}>
      <h3 className="text-base font-bold uppercase tracking-widest text-atomic-phosphor">{hud.hackTitle}</h3>
      <p className="mt-1 max-w-prose text-sm text-atomic-phosphor-dim-text">{hud.hackHint}</p>

      <div className="mt-3 flex items-center gap-3 text-sm uppercase tracking-widest text-atomic-phosphor">
        <span>{hud.attemptsLeft}</span>
        <span className="flex gap-1" aria-hidden="true">
          {Array.from({ length: MAX_ATTEMPTS }, (_, attempt) => (
            <span key={attempt} className={`h-4 w-3 ${atomic.attempt}`} data-on={attempt < state.attempts || undefined} />
          ))}
        </span>
        <span>{state.attempts}</span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
        <div className="grid gap-x-6 overflow-x-auto sm:grid-cols-2">
          {columns.map((rows, column) => (
            <div key={column}>
              {rows.map((row) => (
                <DumpRow key={row.address} {...row} state={state} onPick={dispatch} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex min-h-[8rem] flex-col justify-end border-t border-atomic-phosphor/30 pt-3 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
          <ol className="space-y-2 text-atomic-phosphor" aria-live="polite">
            {shown.map((entry, index) => (
              <LogLine key={firstShown + index} entry={entry} />
            ))}
          </ol>
          {state.status === 'locked' && (
            <div className="mt-3">
              <p className="text-base font-bold uppercase tracking-widest text-atomic-red-light">{hud.terminalLocked}</p>
              <button type="button" onClick={onReboot} className={`${PHOSPHOR_BUTTON} mt-2`}>
                <span className="relative">{hud.reboot}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {state.status === 'granted' && (
        <div className={`mt-4 flex items-center gap-4 border-2 border-atomic-phosphor p-3 ${atomic.powerOn}`}>
          <div className="h-24 w-16 shrink-0">
            <DwellerSprite profession="engineer" pose={AT_KEYS} className="h-full w-full" />
          </div>
          <p className={`text-xl font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.glow}`}>{hud.accessGranted}</p>
        </div>
      )}
    </div>
  )
}

export function ContactTerminal({ scene, still }: { scene: Scene; still: boolean }) {
  const { sections } = useLabels()
  const { hero } = useWorldView()
  const { techStack } = useCVData()
  const tools = useMemo(() => techStack.flatMap((category) => category.items), [techStack])
  // The board's random seed is drawn in an effect, so a render stays pure and draws no board until it is set.
  const [seed, setSeed] = useState<number | null>(null)
  useEffect(() => setSeed(Math.floor(Math.random() * 2 ** 31)), [])
  const board = useMemo(() => (seed === null ? null : buildBoard(tools, seed)), [tools, seed])
  const title = sections.contact

  return (
    <section data-scene="contact" aria-labelledby={atomicId(title)} className="relative scroll-mt-24 px-4 pb-[110svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]">
      {still && <AtomicStage scene={scene} settled />}
      <div className="min-h-[60svh] motion-reduce:min-h-[50svh]" />
      <div className={`relative max-w-5xl p-3 sm:p-5 lg:max-w-[min(56rem,62vw)] ${READS_BESIDE[scene.side].column} ${atomic.device}`} data-on="">
        <div className={`relative overflow-hidden rounded-[1.4rem] p-5 sm:p-8 ${atomic.tube}`}>
          <span className={`pointer-events-none absolute inset-0 ${atomic.vignette}`} aria-hidden="true" />
          <div className={`relative grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ${atomic.sectionPower}`}>
            <div>
              <h2 id={atomicId(title)} className={`text-3xl font-bold uppercase tracking-[0.2em] text-atomic-phosphor ${atomic.glow}`}>
                {title}
              </h2>
              <p className="mt-3 text-base text-atomic-phosphor-dim-text">{hero.line}</p>
              <ActionMenu className="mt-6" label={sections.contact} />
            </div>
            {board && <PasswordGame key={seed} board={board} onReboot={() => setSeed((current) => (current ?? 0) + 1)} />}
          </div>
          <span className={`pointer-events-none absolute inset-0 ${atomic.scanlines}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
