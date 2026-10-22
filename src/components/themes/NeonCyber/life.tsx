'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import type { Company, MartialArts } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { headingId, newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { District } from './city'
import { MercSprite, type MercMotion } from './merc'
import { DataChip, HudPanel } from './hud'
import { Scannable } from './scanner'
import { NEON } from './palette'
import life from './life.module.css'
import world from './world.module.css'

// The merc living in the sections, each scene its own move from the source game (research
// 2026-10-21-w4-neon-cyber, design worlds-v2/neon-cyber.md W4). Every scene is a stage of the shared
// useZoneStage: it hands its district up to the backdrop while in view and turns on the first time it
// scrolls in. About: he walks up and scans the bio, its tags pop out. Tech stack: one time slow dash with
// after images, the cards snapping in as he passes. Ventures: the fixer's contracts drop as pins on a
// district map. Muay Thai: the ripperdoc's chair installs each achievement under the clinic's green
// cross, then he stands and a gang punk steps in to take his roundhouse. Contact: his car waits at the
// kerb with him sitting on the rear deck looking at the skyline; he hops in and drives off into it.

const on = (value: boolean) => String(value)

/** A section that hands its district to the backdrop while it is in view, with no scene of its own. */
export function DistrictStage({ district, children }: { district: District; children: ReactNode }) {
  const { ref } = useZoneStage(district)
  return <div ref={ref}>{children}</div>
}

// ---------------------------------------------------------------- About

export function ScanAbout() {
  const { professionalSummary } = useCVData()
  const { sections, cyber } = useLabels()
  const { ref, on: lit, reduced } = useZoneStage<District>('japantown')
  const [arrived, setArrived] = useState(false)
  const motion: MercMotion = reduced ? 'still' : arrived ? 'scan' : 'walk'
  const tags = [
    { label: cyber.tagEducation, value: professionalSummary.education },
    { label: cyber.tagLanguages, value: professionalSummary.languages },
    ...professionalSummary.highlights.slice(0, 1).map((value) => ({ label: cyber.tagHighlight, value })),
  ].filter((tag) => tag.value)

  return (
    <div ref={ref} className={`${life.scanStage} mb-10`} data-on={on(lit)}>
      <HudPanel title={sections.about}>
        <div className="flex items-end gap-4">
          <div className={`${life.walker} hidden w-20 shrink-0 sm:block`} onAnimationEnd={(event) => event.target === event.currentTarget && setArrived(true)} aria-hidden="true">
            <MercSprite profession="engineer" motion={motion} className="h-auto w-full" />
          </div>
          <div className={`${life.scanBox} relative min-w-0 flex-1 overflow-hidden`}>
            <p className="max-w-3xl text-base leading-relaxed text-[color:var(--neon-ice)]">{professionalSummary.bio}</p>
            <span className={`${life.sweep} pointer-events-none absolute inset-y-0 left-0 w-1 bg-[color:var(--neon-hud)]`} aria-hidden="true" />
          </div>
        </div>
        <ul className="mt-5 flex flex-wrap gap-3">
          {tags.map((tag, i) => (
            <li
              key={tag.label}
              className={`${life.infoTag} ${world.cut} min-w-0 max-w-full border border-[color:var(--neon-hud)] bg-[color:var(--neon-ink)] px-3 py-2 sm:max-w-[22rem]`}
              style={{ '--i': i } as CSSProperties}
            >
              <span className="block text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">{tag.label}</span>
              <span className="block text-sm text-[color:var(--neon-ice)]">{tag.value}</span>
            </li>
          ))}
        </ul>
      </HudPanel>
    </div>
  )
}

// ---------------------------------------------------------------- Tech stack

const ECHOES = [
  { tint: life.echoCyan, lag: '0.06s', fade: 0.55 },
  { tint: life.echoPink, lag: '0.12s', fade: 0.4 },
  { tint: life.echoGreen, lag: '0.18s', fade: 0.28 },
  { tint: life.echoCyan, lag: '0.24s', fade: 0.16 },
]

function Runner({ motion, className = '', style }: { motion: MercMotion; className?: string; style?: CSSProperties }) {
  return (
    <div className={`${life.runner} absolute inset-y-0 left-0 w-full ${className}`} style={style}>
      <MercSprite profession="engineer" motion={motion} className="absolute bottom-0 left-0 h-full w-auto" />
    </div>
  )
}

export function SandevistanStack({ techStack }: { techStack: SectionsOf<'engineer'>['techStack'] }) {
  const { sections, cards, cyber } = useLabels()
  const { ref, on: lit, reduced } = useZoneStage<District>('megablock')
  const [take, setTake] = useState(0)
  const motion: MercMotion = reduced ? 'still' : 'dash'

  const replay = reduced ? null : (
    <button
      type="button"
      onClick={() => setTake((n) => n + 1)}
      className={`${world.cut} min-h-[44px] border border-[color:var(--neon-hack)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-hack)] hover:bg-[color-mix(in_srgb,var(--neon-hack)_12%,transparent)]`}
    >
      {cyber.replay}
    </button>
  )

  return (
    <div ref={ref} key={take} className={`${life.dashStage} relative mb-10`} data-on={on(lit)}>
      <span className={`${life.slowTint} pointer-events-none absolute inset-0 z-10 bg-[color-mix(in_srgb,var(--neon-hack)_10%,transparent)]`} aria-hidden="true" />
      <HudPanel title={sections.techStack} tools={replay}>
        <div className={`${life.dashLane} relative mb-4 overflow-hidden border-b border-[color-mix(in_srgb,var(--neon-hack)_45%,transparent)]`} aria-hidden="true">
          {ECHOES.map(({ tint, lag, fade }) => (
            <Runner key={lag} motion={motion} className={`${life.echo} ${tint}`} style={{ '--lag': lag, '--fade': fade } as CSSProperties} />
          ))}
          <Runner motion={motion} />
        </div>
        <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
          {techStack.map((category, i) => (
            <li key={category.id} className={`${MASONRY_ITEM} ${life.snapCard}`} style={{ '--i': i } as CSSProperties}>
              <section aria-labelledby={headingId('nc-tech', category.name)} className="border-l-2 border-[color:var(--neon-hack)] pl-3">
                <h3 id={headingId('nc-tech', category.name)} className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">
                  {category.name}
                </h3>
                <ul className="flex flex-wrap gap-1" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
                  {category.items.map((tech) => (
                    <DataChip key={tech}>{tech}</DataChip>
                  ))}
                </ul>
              </section>
            </li>
          ))}
        </ul>
      </HudPanel>
    </div>
  )
}

// ---------------------------------------------------------------- Ventures

// The pins' places on the map strip, spread across it from left to right.
const pinX = (i: number, count: number): number => 120 + (i * 760) / Math.max(count - 1, 1)

export function FixerContracts({ companies }: { companies: Company[] }) {
  const { sections, links, cyber } = useLabels()
  const { ref, on: lit } = useZoneStage<District>('badlands')
  const [hot, setHot] = useState<number | null>(null)

  return (
    <div ref={ref} className={`${life.mapStage} mb-10`} data-on={on(lit)}>
      <HudPanel title={sections.ventures}>
        <svg viewBox="0 0 1000 160" className="mb-5 h-auto w-full border border-[color-mix(in_srgb,var(--neon-chrome-red)_45%,transparent)] bg-[color:var(--neon-ink)]" aria-hidden="true" focusable="false">
          <path d="M0 40 H1000 M0 100 H1000 M180 0 V160 M420 0 V160 M650 0 V160 M860 0 V160" stroke={NEON.steel} strokeWidth={1} />
          <path d="M0 140 Q300 90 520 120 T1000 70" stroke={NEON.chromeRed} strokeWidth={3} fill="none" strokeDasharray="10 6" />
          <path d="M60 20 h90 v50 h-90 Z M460 30 h120 v40 h-120 Z M720 110 h100 v40 h-100 Z" fill={NEON.panel} />
          <g className={life.av}>
            <path d="M0 24 L14 16 H54 L70 24 L54 30 H14 Z" fill={NEON.steel} />
            <rect x={22} y={13} width={22} height={5} fill={NEON.data} fillOpacity={0.7} />
          </g>
          {companies.map((company, i) => (
            <g key={company.id} className={life.pin} data-hot={on(hot === i)} style={{ '--i': i } as CSSProperties} transform={`translate(${pinX(i, companies.length)} 0)`}>
              <circle className={life.pinRing} cx={0} cy={86} r={16} fill="none" stroke={NEON.gold} strokeWidth={3} />
              <path d="M0 96 L-12 72 A14 14 0 1 1 12 72 Z" fill={NEON.gold} stroke={NEON.ink} strokeWidth={2} />
              <text x={0} y={76} textAnchor="middle" fontSize={16} fill={NEON.ink}>
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          ))}
        </svg>
        <ul className="grid gap-5 md:grid-cols-3">
          {companies.map((company, i) => (
            <li key={company.id} className={life.contract} style={{ '--i': i } as CSSProperties} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}>
              <Scannable kind="use" title={sections.ventures} fact={company.tagline}>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={newTabName(links, `${company.name}: ${company.tagline}. ${company.description}`)}
                  className={`${world.cut} block border border-[color-mix(in_srgb,var(--neon-gold)_45%,transparent)] bg-[color:var(--neon-glass)] p-4 hover:border-[color:var(--neon-gold)]`}
                >
                  <span className="block text-sm uppercase tracking-wider text-[color:var(--neon-gold)]">
                    {fillLabel(cyber.contract, { number: String(i + 1).padStart(2, '0') })}
                  </span>
                  <span className="mt-1 block text-base text-[color:var(--neon-ice)]">
                    <SlashBreaks text={company.name} />
                  </span>
                  <span className="mt-1 block text-sm text-[color:var(--neon-use)]">{company.tagline}</span>
                  <span className="mt-2 block text-sm text-[color:var(--neon-ice)]">{company.description}</span>
                </a>
              </Scannable>
            </li>
          ))}
        </ul>
      </HudPanel>
    </div>
  )
}

// ---------------------------------------------------------------- Muay Thai

// The ripperdoc's chair seen from the side, its back on the left, the seat facing right, two clamp arms
// with their LED rows, the cable bundle down to the floor. Over it hangs the clinic's green neon cross
// (research cp20), lit while the install runs.
function RipperChair() {
  return (
    <g>
      <path className={life.clinicCross} d="M10 2 H18 V10 H26 V18 H18 V26 H10 V18 H2 V10 H10 Z" fill="none" stroke={NEON.hack} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M8 40 L22 40 L26 112 L12 112 Z" fill={NEON.steel} stroke={NEON.ink} strokeWidth={2} />
      <path d="M12 112 H80 V120 H12 Z" fill={NEON.steel} stroke={NEON.ink} strokeWidth={2} />
      <path d="M40 120 V142 M24 145 H60" stroke={NEON.chrome} strokeWidth={5} />
      <g className={life.clamp}>
        <path d="M2 30 H34 L38 38 H2 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={2} />
        <path d="M8 34 H30" stroke={NEON.hack} strokeWidth={2} strokeDasharray="3 2" />
      </g>
      <path d="M8 104 Q-6 130 10 150" stroke={NEON.data} strokeWidth={2} fill="none" />
    </g>
  )
}

// The gang punk who steps in when he leaves the chair (research cp12, cp18): a dark silhouette facing
// left with a hot pink mohawk, three red optic dots for eyes, a studded jacket lit along its edge and a
// chrome fist up. viewBox 50 by 150 at the chair's scale, feet on y 144; he takes the roundhouse.
function GangFoe() {
  return (
    <svg viewBox="0 0 50 150" className={`${life.foe} absolute bottom-0 h-auto overflow-visible`} focusable="false">
      <g className={life.foeBody}>
        <path d="M14 96 L24 96 L22 144 L12 144 Z M27 96 L37 96 L39 144 L29 144 Z" fill={NEON.ink} stroke={NEON.steel} strokeWidth={1.4} />
        <path d="M10 48 Q25 42 40 48 L42 98 L8 98 Z" fill={NEON.alley} stroke={NEON.steel} strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M9 50 L8 96" stroke={NEON.chromeRed} strokeWidth={1.4} />
        <path d="M18 58 h2 M18 66 h2 M18 74 h2" stroke={NEON.chrome} strokeWidth={2} />
        <path d="M14 24 Q14 12 25 12 Q36 12 36 25 Q36 38 25 41 Q14 38 14 24 Z" fill={NEON.surface} stroke={NEON.steel} strokeWidth={1.4} />
        <path d="M20 13 Q24 0 28 2 Q29 8 30 13 Z" fill={NEON.hotPink} />
        <g className={life.foeOptics} fill={NEON.chromeRed}>
          <circle cx={17} cy={23} r={1.6} />
          <circle cx={21} cy={21.5} r={1.6} />
          <circle cx={20} cy={26} r={1.3} />
        </g>
        <path d="M10 50 L2 64 L6 74" fill="none" stroke={NEON.chrome} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={6} cy={76} r={4} fill={NEON.chrome} stroke={NEON.ink} strokeWidth={1.2} />
      </g>
      <path className={life.impact} d="M2 74 L-6 66 M0 82 L-9 82 M2 90 L-6 98" stroke={NEON.hud} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

export function RipperdocRecord({ martialArts }: { martialArts: MartialArts }) {
  const { cyber, sections } = useLabels()
  const { ref, on: lit, reduced } = useZoneStage<District>('megablock')
  const [done, setDone] = useState(false)
  const { achievements } = martialArts.primary
  const last = achievements.length - 1
  const standing = done || reduced
  const motion: MercMotion = reduced ? 'still' : standing ? 'kick' : 'sit'

  return (
    <div ref={ref} className={`${life.ripStage} mb-10`} data-on={on(lit)} data-done={on(standing)}>
      <HudPanel title={sections.muayThai}>
        <p className="mb-4 text-base text-[color:var(--neon-hud)]">{martialArts.primary.title}</p>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
          <div className="relative w-1/2 max-w-[11rem]" aria-hidden="true">
            <svg viewBox="0 0 100 150" className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
              <RipperChair />
            </svg>
            <div className={life.patient}>
              <MercSprite profession="fighter" motion={motion} className="relative h-auto w-full" />
            </div>
            <GangFoe />
          </div>
          <Scannable kind="record" title={sections.muayThai} fact={martialArts.primary.rank}>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'mb-5 grid gap-3 border border-[color-mix(in_srgb,var(--neon-data)_45%,transparent)] bg-[color:var(--neon-ink)] p-4 sm:grid-cols-2',
                fact: 'border-l-2 border-[color:var(--neon-data)] pl-3',
                term: 'text-sm uppercase tracking-wider text-[color:var(--neon-data)]',
                value: 'mt-1 text-sm text-[color:var(--neon-ice)]',
                achievements: 'space-y-3',
              }}
              renderAchievement={(achievement) => {
                const i = achievements.indexOf(achievement)
                return (
                  <span className={`${life.installRow} block border border-[color-mix(in_srgb,var(--neon-gold)_40%,transparent)] bg-[color:var(--neon-glass)] p-3`} style={{ '--i': i } as CSSProperties}>
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0 text-sm text-[color:var(--neon-ice)]">{achievement}</span>
                      <span className={`${life.installed} shrink-0 text-sm uppercase tracking-wider text-[color:var(--neon-hack)]`}>{cyber.installed}</span>
                    </span>
                    <span className="mt-2 block h-1.5 bg-[color:var(--neon-ink)]" aria-hidden="true">
                      <span className={`${life.installBar} block h-full bg-[color:var(--neon-gold)]`} onAnimationEnd={i === last ? () => setDone(true) : undefined} />
                    </span>
                  </span>
                )
              }}
            />
          </Scannable>
        </div>
      </HudPanel>
    </div>
  )
}

// ---------------------------------------------------------------- Contact

// His car in profile, low and long: the black body, the cabin glass with him at the wheel (the beard
// and the cyan optic), the wheels lit at the rims, the headlight ahead and the tail light streaks behind.
function Car() {
  return (
    <svg viewBox="0 0 240 80" className="h-full w-auto overflow-visible" aria-hidden="true" focusable="false">
      <rect className={life.streak} x={-160} y={44} width={160} height={4} fill={NEON.chromeRed} />
      <rect className={life.streak} x={-110} y={52} width={110} height={3} fill={NEON.hotPink} />
      <path d="M6 58 L14 40 L70 34 L104 16 H160 L196 34 L232 40 L236 58 Z" fill={NEON.ink} stroke={NEON.data} strokeWidth={2} />
      <path d="M110 20 H156 L184 34 H96 Z" fill={NEON.data} fillOpacity={0.3} />
      <g className={life.driver}>
        <circle cx={140} cy={26} r={6} fill={HERO_IDENTITY.hair} />
        <path d="M135 29 Q140 36 145 29" fill={HERO_IDENTITY.hair} />
        <rect x={140} y={24} width={5} height={2} fill={NEON.data} />
      </g>
      <rect x={6} y={44} width={8} height={5} fill={NEON.chromeRed} />
      <rect className={life.headlight} x={226} y={42} width={10} height={5} fill={NEON.ice} />
      {[52, 190].map((x) => (
        <g key={x}>
          <circle cx={x} cy={60} r={14} fill={NEON.ink} stroke={NEON.chrome} strokeWidth={3} />
          <circle cx={x} cy={60} r={8} fill="none" stroke={NEON.hack} strokeWidth={2} />
        </g>
      ))}
    </svg>
  )
}

// Him on the car's rear deck before he drives (research cp21): sitting with his back to the cabin, legs
// over the tail, looking out at the skyline. The sprite is flipped so the sit pose faces left.
function DeckRider() {
  return (
    <div className={`${life.rider} absolute bottom-[0.9rem] left-0 w-[3.4rem]`}>
      <div className="-scale-x-100">
        <MercSprite profession="engineer" motion="sit" className="h-auto w-full" />
      </div>
    </div>
  )
}

export function DriveOff() {
  const { ref, on: lit } = useZoneStage<District>('badlands')
  return (
    <div ref={ref} className={`${life.driveStage} relative mx-auto max-w-4xl overflow-hidden`} data-on={on(lit)} aria-hidden="true">
      <div className={`${life.driveLane} relative`}>
        <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" focusable="false">
          <path d="M0 96 V60 H40 V30 H70 V70 H120 V20 H150 V64 H220 V44 H260 V80 H330 V10 H350 V70 H420 V50 H470 V76 H540 V26 H570 V66 H640 V40 H690 V80 H760 V56 H800 V96 Z" fill={NEON.alley} />
          <rect y={96} width={800} height={24} fill={NEON.ink} />
          <path d="M0 108 H800" stroke={NEON.hud} strokeWidth={2} strokeDasharray="24 16" />
        </svg>
        <div className={`${life.car} absolute bottom-1 left-0 h-[4.5rem]`}>
          <Car />
          <DeckRider />
        </div>
      </div>
    </div>
  )
}
