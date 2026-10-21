'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { drumsSince, muayThaiFacts } from '@/components/cv/sectionText'
import { useProfession } from '@/contexts/ProfessionContext'
import type { ProfessionSections } from '@/lib/cv/cvView'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { CARVED, SOUL } from './palette'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// The profession switch is the game's class pick at the start of a new run: the list of classes on the
// left (the shared ProfessionSwitch, a radiogroup, arrows move the pick), him in the class's gear in the
// middle doing that class's work (the smith's hammer at the anvil, the mallets on a war drum, strikes at a
// wooden post), and the status sheet on the right. The sheet lists real counts from the content (how many
// jobs, projects, ventures, bands, the Muay Thai record's own facts), never a self rated number. A pick
// fades the stage to black and he gets up again in the new gear.

interface StatusRow {
  label: string
  value: string
}

const STATUS_FOR: { [Id in Profession]: (sections: Extract<ProfessionSections, { profession: Id }>, labels: Labels) => StatusRow[] } = {
  engineer: (sections, { sections: titles }) => [
    { label: titles.workExperience, value: String(sections.jobs.length) },
    { label: titles.featuredWork, value: String(sections.projects.length) },
    { label: titles.ventures, value: String(sections.companies.length) },
    { label: titles.techStack, value: String(sections.techStack.reduce((total, category) => total + category.items.length, 0)) },
  ],
  drummer: (sections, { sections: titles, professionFields, years }) => [
    { label: titles.bands, value: String(sections.bands.length) },
    { label: professionFields.drummer, value: drumsSince(sections.musician, years) },
  ],
  fighter: (sections, labels) => muayThaiFacts(sections.martialArts, labels).slice(0, 4),
}

const statusFor = (sections: ProfessionSections, labels: Labels): StatusRow[] =>
  (STATUS_FOR[sections.profession] as (sections: ProfessionSections, labels: Labels) => StatusRow[])(sections, labels)

// Each class's prop, placed in his own units (60 by 96) so it meets his hands at every size.
function Anvil() {
  return (
    <div className="absolute left-[70%] top-[50%] h-[48%] w-[42%]" aria-hidden="true">
      <svg viewBox="0 0 26 46" className="h-full w-full" focusable="false">
        <path d="M0 2 H22 Q26 2 25 6 H18 L16 12 H6 L4 6 H0 Z" fill={SOUL.steelDark} />
        <path d="M2 2 H22" stroke={SOUL.steelLight} strokeWidth={1} />
        <path d="M3 1.2 H20" stroke={SOUL.ember} strokeWidth={1.2} />
        <rect x={6} y={12} width={10} height={6} fill={SOUL.steelDark} />
        <path d="M2 18 H20 L22 46 H0 Z" fill={SOUL.leatherDark} />
        <path d="M4 24 H18 M3 34 H19" stroke={SOUL.leather} strokeWidth={1} />
        <g className={souls.forgeSparks}>
          <circle cx={4} cy={0} r={0.9} fill={SOUL.flameCore} />
          <circle cx={8} cy={-1} r={0.7} fill={SOUL.flame} />
          <circle cx={2} cy={-2} r={0.6} fill={SOUL.flameCore} />
        </g>
      </svg>
    </div>
  )
}

function WarDrum() {
  return (
    <div className="absolute left-[60%] top-[55%] h-[30%] w-[44%]" aria-hidden="true">
      <svg viewBox="0 0 26 28" className="h-full w-full" focusable="false">
        <path d="M1 4 V22 Q13 28 25 22 V4 Z" fill={SOUL.wraps} />
        <path d="M1 4 V22 Q13 28 25 22 V4" fill="none" stroke={SOUL.leatherDark} strokeWidth={1} />
        <path d="M1 6 L25 20 M25 6 L1 20" stroke={SOUL.bone} strokeWidth={0.6} opacity={0.6} />
        <ellipse cx={13} cy={4} rx={12} ry={3} fill={SOUL.bone} />
        <ellipse className={souls.drumHead} cx={13} cy={4} rx={12} ry={3} fill={SOUL.flameCore} />
      </svg>
    </div>
  )
}

function TrainingPost() {
  return (
    <div className="absolute left-[78%] top-[16%] h-[84%] w-[22%]" aria-hidden="true">
      <svg viewBox="0 0 14 80" className={`h-full w-full ${souls.post}`} focusable="false">
        <rect x={4} y={0} width={6} height={80} rx={1} fill={SOUL.leather} />
        <path d="M5 0 V80" stroke={SOUL.leatherDark} strokeWidth={0.8} />
        <rect x={0} y={20} width={14} height={2.4} fill={SOUL.leatherDark} />
        <rect x={0} y={44} width={14} height={2.4} fill={SOUL.leatherDark} />
        <rect x={3} y={8} width={8} height={10} fill={SOUL.bone} opacity={0.8} />
      </svg>
    </div>
  )
}

const PROP: Record<Profession, () => ReactNode> = {
  engineer: () => <Anvil />,
  drummer: () => <WarDrum />,
  fighter: () => <TrainingPost />,
}

function ClassStage({ profession }: { profession: Profession }) {
  const script = usePoseScript('act')
  const { hold, play } = script
  const previous = useRef(profession)

  // A new class: he lies down under the black and gets up in its gear.
  useEffect(() => {
    if (previous.current === profession) return
    previous.current = profession
    hold('down')
    play([{ pose: 'rise', ms: 1200 }])
  }, [profession, hold, play])

  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${ashen.panel}`}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="class-light" cx="0.5" cy="0.35" r="0.7">
            <stop offset="0" stopColor={SOUL.skyLow} stopOpacity={0.45} />
            <stop offset="1" stopColor={SOUL.ink} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={400} height={300} fill={SOUL.abyss} />
        <rect width={400} height={300} fill="url(#class-light)" />
        <path d="M110 300 V110 Q200 30 290 110 V300 H262 V124 Q200 66 138 124 V300 Z" fill={SOUL.rock} />
        <rect y={252} width={400} height={48} fill={SOUL.cavern} />
        <path d="M0 252 H400" stroke={SOUL.ridge} strokeWidth={2} />
        <path d="M40 270 H130 M180 280 H300 M330 266 H390" stroke={SOUL.rock} strokeWidth={2} />
      </svg>
      <div className="absolute bottom-[14%] left-[26%] aspect-[60/96] h-[66%]">
        <Knight key={script.key} gear={profession} pose={script.pose} className="absolute inset-0 h-full w-full" />
        {PROP[profession]()}
      </div>
      {script.key > 0 && (
        <div key={profession} className={`pointer-events-none absolute inset-0 bg-[color:var(--soul-ink)] ${souls.blackout}`} aria-hidden="true" />
      )}
    </div>
  )
}

export function ClassSelect() {
  const { active } = useProfession()
  const view = useWorldView()
  const labels = useLabels()
  const { navigation, professionFields, souls: words } = labels
  const rows = statusFor(view.sections, labels)

  return (
    <section className="relative px-4 py-12 sm:px-6" aria-labelledby="soul-class-select">
      <div className="mx-auto max-w-6xl">
        <h2 id="soul-class-select" className={`${CARVED} mb-2 text-center text-2xl uppercase tracking-[0.3em] text-[color:var(--soul-text)]`}>
          {navigation.selectYourProfession}
        </h2>
        <p className="mb-8 text-center text-sm italic text-[color:var(--soul-text-soft)]">{words.classHint}</p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,17rem)]">
          <ProfessionSwitch
            className={`${ashen.panel} flex flex-col p-2`}
            renderOption={({ id, label, selected, optionProps }) => (
              <div
                {...optionProps}
                className={`${ashen.highlight} ${selected ? ashen.highlightOn : ''} flex min-h-[56px] cursor-pointer flex-col justify-center px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[color:var(--soul-glow)]`}
              >
                <span className={`${CARVED} text-base uppercase tracking-[0.18em] ${selected ? 'text-[color:var(--soul-glow)]' : 'text-[color:var(--soul-text)]'}`}>
                  {label}
                </span>
                <span className="text-sm text-[color:var(--soul-text-soft)]">{professionFields[id]}</span>
              </div>
            )}
          />

          <ClassStage profession={active} />

          <div className={`${ashen.panel} p-5`}>
            <h3 className={`${CARVED} border-b border-[color:var(--soul-ridge)] pb-2 text-base uppercase tracking-[0.24em] text-[color:var(--soul-glow)]`}>
              {words.status}
            </h3>
            <p className={`${CARVED} mt-3 text-lg text-[color:var(--soul-text)]`}>{labels.professions[active]}</p>
            <dl className="mt-3 space-y-2">
              {rows.map((row) => (
                <div key={`${row.label}-${row.value}`} className="flex items-baseline justify-between gap-3 border-b border-[color:var(--soul-rock)] pb-1">
                  <dt className="text-sm text-[color:var(--soul-text-soft)]">{row.label}</dt>
                  <dd className="text-right text-sm tabular-nums text-[color:var(--soul-text)]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
