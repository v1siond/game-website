'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useProfession } from '@/contexts/ProfessionContext'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { PROFESSION_ORDER, stepProfession, type Profession } from '@/lib/cv/professions'
import type { CVData } from '@/lib/cv/content'
import { DWELLER_ACTION, DwellerSprite } from './dweller'
import { ActionMenu } from './controls'
import { sectionTabs } from './anchors'
import { BRASS, CHROME, OLIVE, OLIVE_DARK, OLIVE_LIGHT, RUBBER, STEEL_LIGHT } from './palette'
import atomic from './atomic.module.css'

// The hero and the profession switch as one device: the wrist terminal, a moulded olive slab with a
// curved green tube on the left and its hardware on the right (the rotary dial, three lamps, the tuning
// knob, the speaker grille).
//
// - Boot: once the door has rolled aside, the tube warms up (a bright line opens to the full screen),
//   then the hero types itself out character by character on a 16 ms clock (setInterval; React holds
//   only the count). Screen readers get the whole text at once; the typed copy is aria-hidden over an
//   invisible full copy that holds the layout, so nothing jumps.
// - Profession switch: the top tabs are the shared ProfessionSwitch (radio group, arrows); the dial on
//   the right turns to the picked tab with a mechanical overshoot, and clicking the dial steps to the
//   next one. A switch collapses the screen to a line and reopens it on the new profession (the screen's
//   content is keyed by profession, so the CSS power on plays per switch), and his status figure plays
//   that profession's action: typing on the wrist terminal, the drum roll, or the knee and side kick.
// - The second row of tabs jumps to the picked profession's sections.
// - The bottom bar holds the profession's field and how long he has been at it, from the CV.

const TYPE_TICK_MS = 16

/** How many characters of the text have been typed: all of it when off, counting up once started. */
function useTyped(total: number, running: boolean, instant: boolean): number {
  const [typed, setTyped] = useState(instant ? total : 0)

  useEffect(() => {
    if (instant) {
      setTyped(total)
      return
    }
    if (!running) return
    const timer = window.setInterval(() => setTyped((count) => (count >= total ? count : count + 1)), TYPE_TICK_MS)
    return () => window.clearInterval(timer)
  }, [running, instant, total])

  return typed
}

/** One line of the boot text: the full text reserves the space, the typed part sits over it. */
function TypedLine({ text, shown, className, as: Tag = 'p' }: { text: string; shown: number; className: string; as?: 'p' | 'h1' }) {
  const visible = text.slice(0, Math.max(0, shown))
  const typing = shown > 0 && shown < text.length

  return (
    <Tag className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {visible}
        {typing && <span className={atomic.cursor} />}
      </span>
    </Tag>
  )
}

function BootText({ lines, running, instant }: { lines: [string, string, string, string]; running: boolean; instant: boolean }) {
  const [name, headline, tagline, line] = lines
  const total = lines.reduce((sum, text) => sum + text.length, 0)
  const typed = useTyped(total, running, instant)
  const shownOf = (index: number) => typed - lines.slice(0, index).reduce((sum, text) => sum + text.length, 0)

  return (
    <div className="space-y-2">
      <TypedLine as="h1" text={name} shown={shownOf(0)} className={`text-2xl font-bold uppercase tracking-[0.18em] text-atomic-phosphor sm:text-4xl ${atomic.glow}`} />
      <TypedLine text={headline} shown={shownOf(1)} className="text-base text-atomic-phosphor sm:text-lg" />
      <TypedLine text={tagline} shown={shownOf(2)} className="text-base text-atomic-phosphor-dim" />
      <TypedLine text={line} shown={shownOf(3)} className="text-sm text-atomic-phosphor-dim" />
    </div>
  )
}

// The tab shape of the tube's top bar: a bracket open at the bottom round the pick, so the line under
// the bar runs into it.
function ScreenTab({ label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`relative min-h-[44px] px-2 text-sm font-bold uppercase tracking-widest sm:px-4 sm:text-base ${atomic.screenTab} ${atomic.focusRing}`}
      data-on={selected || undefined}
    >
      {label}
    </button>
  )
}

function SectionTabs({ profession }: { profession: Profession }) {
  const { sections, hud } = useLabels()

  return (
    <nav aria-label={hud.sectionTabs} className="mt-2">
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {sectionTabs(profession, sections).map((tab) => (
          <li key={tab.href}>
            <a href={tab.href} className={`inline-flex min-h-[44px] items-center px-1 text-sm uppercase tracking-widest text-atomic-phosphor-dim hover:text-atomic-phosphor ${atomic.focusRing}`}>
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** His figure on the tube, in the green line tone, at the picked profession's work as the screen comes on. */
function StatusFigure({ profession }: { profession: Profession }) {
  return (
    <div className={`relative mx-auto aspect-[2/3] w-28 sm:w-36 ${atomic.statusBox}`}>
      <span className={atomic.statusBrackets} aria-hidden="true" />
      <div className={`absolute inset-3 ${atomic.statusFigure}`}>
        <DwellerSprite key={profession} profession={profession} tone="phosphor" motion={DWELLER_ACTION[profession]} className="h-full w-full" />
      </div>
    </div>
  )
}

const firstJobYear = (jobs: CVData['workExperience']): number | null =>
  jobs.length > 0 ? Math.min(...jobs.map((job) => job.startDate.getUTCFullYear())) : null

// How long he has been at each profession, written from the CV with the shared year labels.
const TENURE: Record<Profession, (cv: CVData, years: Labels['years']) => string> = {
  engineer: (cv, years) => {
    const year = firstJobYear(cv.workExperience)
    return year === null ? '' : fillLabel(years.since, { year })
  },
  drummer: (cv, years) => fillLabel(years.since, { year: cv.musician.since }),
  fighter: (cv, years) => fillLabel(years.yearMany, { count: cv.martialArts.primary.yearsTraining }),
}

function StatusBar({ profession }: { profession: Profession }) {
  const cv = useCVData()
  const { professionFields, years } = useLabels()

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-sm uppercase tracking-widest">
      <p className={`px-3 py-2 ${atomic.statusCell}`}>{professionFields[profession]}</p>
      <p className={`px-3 py-2 text-right ${atomic.statusCell}`}>{TENURE[profession](cv, years)}</p>
    </div>
  )
}

// The dial's pointer angle for each tab, left to right.
const DIAL_ANGLE: Record<Profession, number> = Object.fromEntries(PROFESSION_ORDER.map((id, index) => [id, (index - 1) * 50])) as Record<Profession, number>

function SelectorDial() {
  const { active, setActive } = useProfession()
  const { hud } = useLabels()

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setActive(stepProfession(active, 1))}
        aria-label={hud.dialHint}
        title={hud.dialHint}
        className={`relative h-24 w-24 rounded-full sm:h-28 sm:w-28 ${atomic.focusRing}`}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="atomic-dial-cap" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor={CHROME} />
              <stop offset="70%" stopColor={STEEL_LIGHT} />
              <stop offset="100%" stopColor={RUBBER} />
            </radialGradient>
          </defs>
          {PROFESSION_ORDER.map((id) => (
            <rect key={id} x="48" y="2" width="4" height="9" fill={id === active ? BRASS : OLIVE_LIGHT} transform={`rotate(${DIAL_ANGLE[id]} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="38" fill={OLIVE_DARK} stroke={RUBBER} strokeWidth="3" />
        </svg>
        <span className={`absolute inset-[14%] rounded-full ${atomic.dialKnob}`} data-angle={active} aria-hidden="true">
          <svg viewBox="0 0 100 100" className="h-full w-full" focusable="false">
            {Array.from({ length: 18 }, (_, notch) => (
              <rect key={notch} x="48" y="1" width="4" height="8" fill={RUBBER} transform={`rotate(${notch * 20} 50 50)`} />
            ))}
            <circle cx="50" cy="50" r="40" fill="url(#atomic-dial-cap)" />
            <rect x="46" y="12" width="8" height="30" rx="3" fill={BRASS} stroke={RUBBER} strokeWidth="2" />
          </svg>
        </span>
      </button>
      <div className="flex gap-3" aria-hidden="true">
        {PROFESSION_ORDER.map((id) => (
          <span key={id} className={`h-3 w-3 rounded-full ${atomic.lamp}`} data-on={id === active || undefined} />
        ))}
      </div>
    </div>
  )
}

/** The device's right side: dial, lamps, tuning knob and grille; under the tube on narrow screens. */
function Hardware() {
  return (
    <div className="flex items-center justify-around gap-6 px-4 py-5 lg:flex-col lg:justify-start lg:px-6 lg:py-8">
      <SelectorDial />
      <svg viewBox="0 0 60 60" className="h-12 w-12 lg:h-14 lg:w-14" aria-hidden="true" focusable="false">
        <circle cx="30" cy="30" r="26" fill={OLIVE_DARK} stroke={RUBBER} strokeWidth="3" />
        <circle cx="30" cy="30" r="17" fill={OLIVE} stroke={OLIVE_LIGHT} strokeWidth="2" />
        <rect x="28" y="9" width="4" height="12" fill={CHROME} />
      </svg>
      <div className={`hidden h-24 w-20 rounded-md lg:block ${atomic.grille}`} aria-hidden="true" />
    </div>
  )
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.6rem] p-4 sm:p-6 ${atomic.tube}`}>
      {children}
      <span className={`pointer-events-none absolute inset-0 ${atomic.scanlines}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute inset-x-0 top-0 h-16 ${atomic.refreshBar} ${atomic.ambient}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute inset-0 ${atomic.vignette}`} aria-hidden="true" />
    </div>
  )
}

interface WristComputerProps {
  booted: boolean
  instant: boolean
}

export function WristComputer({ booted, instant }: WristComputerProps) {
  const { active } = useProfession()
  const { hud, navigation } = useLabels()

  return (
    <section aria-label={hud.wristTerminal} className={`relative mx-auto max-w-6xl ${atomic.device}`} data-booted={booted || instant || undefined}>
      <span className={atomic.deviceScrews} aria-hidden="true" />
      <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
        <div className="p-3 sm:p-5">
          <Screen>
            <div className={atomic.tubeWarm}>
              <ProfessionSwitch className={`flex justify-center gap-1 sm:gap-4 ${atomic.tabRail}`} label={navigation.profession} renderOption={(option) => <ScreenTab {...option} />} />
              <SectionTabs profession={active} />

              <div key={active} className={`mt-5 grid items-center gap-6 md:grid-cols-[auto_1fr] ${atomic.powerOn}`}>
                <StatusFigure profession={active} />
                <RecruiterHero
                  render={({ name, headline, tagline, line }) => <BootText lines={[name, headline, tagline, line]} running={booted} instant={instant} />}
                />
              </div>

              <ActionMenu className="mt-6 max-w-md" />
              <StatusBar profession={active} />
            </div>
          </Screen>
        </div>
        <Hardware />
      </div>
    </section>
  )
}
