'use client'

import { useMemo, useReducer, useState } from 'react'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useZoneStage } from '@/hooks/useZoneStage'
import { useProfession } from '@/contexts/ProfessionContext'
import { fillLabel } from '@/lib/cv/labels'
import { ActionMenu } from './controls'
import { DwellerSprite, type DwellerMotion } from './dweller'
import { DoorArt } from './vaultDoor'
import { atomicId } from './anchors'
import { buildBoard, hackReducer, initialHack, MAX_ATTEMPTS, type HackAction, type HackBoard, type HackCell, type HackLogEntry, type HackState } from './hacking'
import { BAKELITE, DUST, DUST_DARK, RUST } from './palette'
import atomic from './atomic.module.css'

// Contact, outside: the page leaves the shelter. Behind, the wasteland at dusk (dust sky, the far ruined
// skyline and the near one sliding apart with the pointer through --mx, the door standing rolled aside
// in the rock). When the section scrolls in he walks out of the door on the jaunty poster walk, in
// the poster tone and the picked profession's kit, and stops at the post to idle (the bounce and the
// blink). In front, a public terminal on its post: the
// contact menu on the left, always open, and on the right the password game (hacking.ts holds the
// rules): his tools hidden in a memory dump, the attempts as blocks, every guess answered in the log.
// A granted password powers on the reward line and he raises his thumb; a locked terminal offers a
// reboot, which deals a fresh dump (a new seed remounts the game). The terminal powers on once when the section scrolls in.

const WALK_OUT: readonly DwellerMotion[] = ['walk']

/**
 * Him leaving the shelter: the strip he walks along spans the scene, so it starts pushed left with him
 * at the door and slides to rest with him at the post; its own animation ending turns the walk into
 * the idle. Under reduced motion he stands at the post, still.
 */
function WalkOut({ walking }: { walking: boolean }) {
  const { active } = useProfession()
  const { pose, onOwnAnimationEnd } = usePoseSequence<DwellerMotion>({ entrance: WALK_OUT, rest: 'idle', still: 'still' })

  return (
    <div className={`absolute inset-x-0 bottom-[6%] hidden lg:block ${walking ? atomic.walkOut : atomic.atDoor}`} onAnimationEnd={onOwnAnimationEnd}>
      <div className="ml-auto mr-[4%] h-40 w-28">
        <DwellerSprite profession={active} motion={pose} className="h-full w-full" />
      </div>
    </div>
  )
}

function Wasteland({ walking }: { walking: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${atomic.dusk}`} aria-hidden="true">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className={`absolute inset-x-[-4%] bottom-[18%] h-[45%] w-[108%] ${atomic.farLayer}`} focusable="false">
        <path d="M0 300 V220 L60 220 L60 170 L95 170 L95 200 L150 200 L150 120 L170 110 L190 120 L190 210 L260 210 L260 160 L300 140 L340 160 L340 230 L420 230 L420 90 L440 70 L460 90 L460 220 L560 220 L560 180 L640 180 L640 140 L655 60 L670 140 L670 210 L780 210 L780 150 L830 150 L830 230 L930 230 L930 110 L960 100 L990 110 L990 200 L1080 200 L1080 170 L1200 170 V300 Z" fill={RUST} opacity="0.7" />
      </svg>
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className={`absolute inset-x-[-6%] bottom-0 h-[38%] w-[112%] ${atomic.nearLayer}`} focusable="false">
        <path d="M0 300 V180 Q150 120 300 170 T620 160 Q800 110 950 170 T1200 150 V300 Z" fill={DUST_DARK} />
        <path d="M0 300 V240 Q200 200 420 236 T860 226 Q1040 200 1200 230 V300 Z" fill={BAKELITE} />
        <path d="M560 300 L600 236 L640 236 L700 300 Z" fill={DUST} opacity="0.35" />
      </svg>
      <div className="absolute bottom-[8%] left-[2%] hidden w-[18%] max-w-[220px] lg:block">
        <DoorArt className={`h-auto w-full ${atomic.doorAside}`} />
      </div>
      <WalkOut walking={walking} />
      <span className="absolute inset-x-0 bottom-0 h-2 bg-atomic-ink" />
    </div>
  )
}

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
    <p className="flex gap-3 whitespace-pre text-sm leading-7">
      <span className="text-atomic-phosphor-dim" aria-hidden="true">
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
            // the word sits on a dump line under 44px tall, so an invisible band above and below it carries the tap
            <button key={index} type="button" onClick={() => onPick(pick)} className={`relative before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] ${atomic.dumpPick} ${atomic.focusRing}`}>
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
    denied: [`> ${entry.word}`, hud.entryDenied, fillLabel(hud.likeness, { count: entry.likeness })],
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

function PasswordGame({ board, onReboot }: { board: HackBoard; onReboot: () => void }) {
  const { hud } = useLabels()
  const reducer = useMemo(() => hackReducer(board), [board])
  const [state, dispatch] = useReducer(reducer, undefined, initialHack)
  const half = Math.ceil(board.rows.length / 2)
  const columns = [board.rows.slice(0, half), board.rows.slice(half)]

  return (
    <div className={atomic.hackScreen} data-status={state.status}>
      <h3 className="text-base font-bold uppercase tracking-widest text-atomic-phosphor">{hud.hackTitle}</h3>
      <p className="mt-1 max-w-prose text-sm text-atomic-phosphor-dim">{hud.hackHint}</p>

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
            {state.log.slice(-4).map((entry, index) => (
              <LogLine key={`${state.log.length}-${index}`} entry={entry} />
            ))}
          </ol>
          {state.status === 'locked' && (
            <div className="mt-3">
              <p className="text-base font-bold uppercase tracking-widest text-atomic-red-light">{hud.terminalLocked}</p>
              <button type="button" onClick={onReboot} className={`relative mt-2 min-h-[44px] border-2 border-atomic-phosphor px-3 text-sm font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow} ${atomic.focusRing}`}>
                <span className="relative">{hud.reboot}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {state.status === 'granted' && (
        <div className={`mt-4 flex items-center gap-4 border-2 border-atomic-phosphor p-3 ${atomic.powerOn}`}>
          <div className="h-24 w-16 shrink-0">
            <DwellerSprite profession="engineer" tone="phosphor" motion="thumbsUp" className="h-full w-full" />
          </div>
          <p className={`text-xl font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.glow}`}>{hud.accessGranted}</p>
        </div>
      )}
    </div>
  )
}

export function ContactTerminal() {
  const { sections } = useLabels()
  const { hero } = useWorldView()
  const { techStack } = useCVData()
  const { ref, on } = useZoneStage('town')
  const tools = useMemo(() => techStack.flatMap((category) => category.items), [techStack])
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 2 ** 31))
  const board = useMemo(() => buildBoard(tools, seed), [tools, seed])
  const title = sections.contact

  return (
    <section ref={ref} aria-labelledby={atomicId(title)} className="relative z-20 overflow-hidden px-4 pb-48 pt-16 sm:px-6 lg:pb-56">
      <Wasteland walking={on} />
      <div className={`relative mx-auto max-w-6xl p-3 sm:p-5 ${atomic.device}`} data-on={on || undefined}>
        <div className={`relative overflow-hidden rounded-[1.4rem] p-5 sm:p-8 ${atomic.tube}`}>
          <div className={`grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ${atomic.sectionPower}`}>
            <div>
              <h2 id={atomicId(title)} className={`text-3xl font-bold uppercase tracking-[0.2em] text-atomic-phosphor ${atomic.glow}`}>
                {title}
              </h2>
              <p className="mt-3 text-base text-atomic-phosphor-dim">{hero.line}</p>
              <ActionMenu className="mt-6" />
            </div>
            {board && <PasswordGame key={seed} board={board} onReboot={() => setSeed((current) => current + 1)} />}
          </div>
          <span className={`pointer-events-none absolute inset-0 ${atomic.scanlines}`} aria-hidden="true" />
          <span className={`pointer-events-none absolute inset-0 ${atomic.vignette}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
