'use client'

import { useEffect, useState, useRef, useMemo, memo, type ComponentType } from 'react'
import Link from 'next/link'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks } from '@/components/cv/SiteLinks'
import type { SiteLinkId } from '@/lib/cv/siteLinks'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job, Service } from '@/lib/cv/content'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import type { SectionFrames } from '@/components/cv/SectionPlanView'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { DiamondIcon, GearIcon, WaveIcon } from '@/components/themes/shared/professionIcons'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { Theatre } from '@/components/themes/shared/theatre/Stage'
import { useTheatre } from '@/components/themes/shared/theatre/useTheatre'
import { CursorTrail, ParallaxLayers } from './DarkFantasy/InteractiveElements'
import { SpiritWisp } from './DarkFantasy/relics'
import { DarkStage, HALL_MOTION, scenesOf, type DarkScene } from './DarkFantasy/scenes'
import { drumsSince, headingId, newTabHint } from '@/lib/cv/sectionText'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { NameWords } from '@/components/cv/NameWords'
import { CopyrightLine } from './shared/CopyrightLine'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { DARK_FANTASY, DARK_FANTASY_VARS } from './DarkFantasy/palette'
import world from './DarkFantasy/world.module.css'
import { slice } from '@/components/themes/shared/loops'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'

// The lines of a card or the About frame, each behind the spirit gold asterisk.
const SPIRIT_LINES: MarkedLinesLook = {
  list: 'space-y-1',
  line: 'text-sm flex items-start gap-2 text-[color:var(--df-bone)]',
  marker: (
    <span className="text-[color:var(--df-spirit-gold)]" aria-hidden="true">
      *
    </span>
  ),
}

// His education and languages under the highlights, each label in the spirit gold.
const SPIRIT_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-1',
  fact: 'max-w-prose mx-auto text-sm text-[color:var(--df-silver-text)]',
  term: 'inline text-[color:var(--df-spirit-gold)]',
  value: 'inline',
  termEnd: ': ',
}

// His outfit plate: a cavern shard with bone lettering, rimmed in the soul light.
const OUTFIT_LOOK: WardrobeLook = { plate: DARK_FANTASY.voidDeep, text: DARK_FANTASY.bone, ring: DARK_FANTASY.ethereal }

// Ethereal rain effect - optimized with fewer elements
const EtherealRain = memo(function EtherealRain() {
  const drops = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: Math.random() * 20 + 10,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 1.5 + 0.8,
      delay: Math.random() * -3,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
      role="presentation"
    >
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-px"
          style={{
            left: `${d.x}%`,
            top: '-30px',
            height: d.height,
            background: `linear-gradient(180deg, transparent, ${DARK_FANTASY.ethereal}${Math.round(d.opacity * 255).toString(16).padStart(2, '0')})`,
            animation: slice(world.etherealRain, d.speed, 'linear', d.delay),
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// Spirit particles - optimized: no box-shadow, fewer elements
const SPIRIT_COLORS = [DARK_FANTASY.spiritGold, DARK_FANTASY.ethereal, DARK_FANTASY.forestGreen]
const SpiritParticles = memo(function SpiritParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 3,
      opacity: Math.random() * 0.4 + 0.2,
      speed: Math.random() * 30 + 20,
      delay: Math.random() * -25,
      color: SPIRIT_COLORS[i % SPIRIT_COLORS.length],
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
      role="presentation"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2.5,
            height: p.size * 2.5,
            background: `radial-gradient(circle, ${p.color} 20%, ${p.color}40 50%, transparent 70%)`,
            animation: slice(world.spiritFloat, p.speed, 'ease-in-out', p.delay),
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// The spirit light hanging over every scene, under the chandelier.
const DarkFantasyAtmosphere = memo(function DarkFantasyAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3] contain-strict" aria-hidden="true" role="presentation">
      {/* Central ethereal glow - no blur filter for performance */}
      <div
        className="absolute top-[15%] left-1/2 w-[800px] h-[500px]"
        style={{
          background: `radial-gradient(ellipse at center top, ${DARK_FANTASY.spiritGold}10 0%, ${DARK_FANTASY.spiritGold}05 20%, ${DARK_FANTASY.ethereal}04 50%, transparent 80%)`,
          transform: 'translateX(-50%) translateZ(0)',
        }}
      />
    </div>
  )
})

// A pick sends the soul light along the wire from the station he left to the one he picked (WireGlow, 300ms,
// 450ms through the hub) while the picked station pulses (nodeArrival, energyArrival). The wire runs musician,
// engineer, martial artist, the order ProfessionSwitch lays the stations out, so a pick between the two outer
// stations runs through the engineer's, the raised hub.
// The side stations sit near the edges so the three cards never overlap on a 320px phone.
const WAYSTATION_POSITIONS: Record<Profession, { x: number; y: number }> = {
  drummer: { x: 17, y: 55 },
  engineer: { x: 50, y: 30 },
  fighter: { x: 83, y: 55 },
}

// Calculate the wire path segments between two professions
function getWirePath(from: Profession, to: Profession): Array<{ x: number; y: number }> {
  const throughHub = from !== 'engineer' && to !== 'engineer'
  return throughHub
    ? [WAYSTATION_POSITIONS[from], WAYSTATION_POSITIONS.engineer, WAYSTATION_POSITIONS[to]]
    : [WAYSTATION_POSITIONS[from], WAYSTATION_POSITIONS[to]]
}

// Wire glow effect that shows the path lighting up
const WireGlow = memo(function WireGlow({
  pathPoints,
  duration,
  color,
}: {
  pathPoints: Array<{ x: number; y: number }>
  duration: number
  color: string
}) {
  // Create SVG path for the glow effect
  const pathD = pathPoints.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`
  ).join(' ')

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        filter="url(#wireGlow)"
        style={{
          strokeDasharray: '100',
          strokeDashoffset: '100',
          animation: `${world.wireStroke} ${duration}ms ease-out forwards`,
        }}
      />
    </svg>
  )
})

// Energy flow container that manages the animation state
const EnergyFlowAnimation = memo(function EnergyFlowAnimation({
  fromProfession,
  toProfession,
  isAnimating,
}: {
  fromProfession: Profession | null
  toProfession: Profession
  isAnimating: boolean
}) {
  if (!isAnimating || !fromProfession || fromProfession === toProfession) {
    return null
  }

  const pathPoints = getWirePath(fromProfession, toProfession)
  const totalDuration = pathPoints.length > 2 ? 450 : 300

  const energyColor = DARK_FANTASY.soulBlue

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Wire glow effect */}
      <WireGlow pathPoints={pathPoints} duration={totalDuration} color={energyColor} />
    </div>
  )
})

// Waystation node for profession selection (generic rest point, not HK bench)
function WaystationNode({
  option,
  isReceivingEnergy,
}: {
  option: ProfessionOption
  isReceivingEnergy?: boolean
}) {
  const { id, label, selected: isActive, optionProps } = option
  const { professionFields } = useLabels()
  const { icon, color } = WAYSTATIONS[id]
  const sublabel = professionFields[id]
  const position = WAYSTATION_POSITIONS[id]

  return (
    <button
      type="button"
      {...optionProps}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group min-w-[70px] md:min-w-[100px] min-h-[70px] md:min-h-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ['--tw-ring-color' as string]: color,
        ['--tw-ring-offset-color' as string]: DARK_FANTASY.void,
      }}
    >
      {/* Energy arrival burst - shows when this node receives energy */}
      {isReceivingEnergy && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, color-mix(in srgb, ${DARK_FANTASY.soulBlue} 38%, transparent) 0%, color-mix(in srgb, ${DARK_FANTASY.soulBlue} 19%, transparent) 40%, transparent 70%)`,
            animation: `${world.energyArrival} 400ms ease-out forwards`,
          }}
          aria-hidden="true"
        />
      )}
      {/* Active glow - rectangular to match VoidFrame */}
      <div
        className={`absolute inset-0 transition-[transform,opacity] duration-500 ${
          isActive ? 'opacity-50 scale-110' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(ellipse, ${color}60 0%, ${color}30 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {/* Main container - VoidFrame style with decorative elements */}
      <div
        className={`df-card bg-[color:var(--df-panel)] relative z-0 w-[5.5rem] h-20 md:w-32 md:h-28 px-1 flex flex-col items-center justify-center transition-transform duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{ animation: isReceivingEnergy ? `${world.nodeArrival} 400ms ease-out` : undefined }}
      >
        {/* Active border and glow: the active card drawn under the content, fading in by opacity */}
        <div
          className={`df-card df-card--active absolute -inset-px -z-10 pointer-events-none transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ ['--df-accent' as string]: color }}
          aria-hidden="true"
        />
        {/* Top flourish - mini version */}
        <svg
          className="absolute -top-2 left-1/2 -translate-x-1/2"
          width="50"
          height="8"
          viewBox="0 0 50 8"
          aria-hidden="true"
        >
          <path
            d="M25,4 L27,2 L25,0 L23,2 Z"
            fill={isActive ? color : DARK_FANTASY.bone}
            opacity={isActive ? 0.8 : 0.4}
          />
          <path
            d="M23,4 Q15,3 5,5"
            fill="none"
            stroke={isActive ? color : DARK_FANTASY.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.6 : 0.3}
          />
          <path
            d="M27,4 Q35,3 45,5"
            fill="none"
            stroke={isActive ? color : DARK_FANTASY.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.6 : 0.3}
          />
        </svg>

        {/* Abstract icon */}
        <div className="mb-0.5 md:mb-1 scale-75 md:scale-100" style={{ color: isActive ? color : DARK_FANTASY.silver }}>
          {icon}
        </div>
        <span
          className="text-sm tracking-[0.05em] md:tracking-[0.1em] uppercase font-medium text-center leading-tight"
          style={{
            color: isActive ? color : DARK_FANTASY.silverText,
          }}
        >
          {label}
        </span>
        <span
          className="text-sm tracking-wider text-center leading-tight hidden md:block"
          style={{
            color: isActive ? color : DARK_FANTASY.silverText,
          }}
        >
          {sublabel}
        </span>

        {/* Bottom flourish - mini version */}
        <svg
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          width="40"
          height="6"
          viewBox="0 0 40 6"
          aria-hidden="true"
        >
          <path
            d="M20,2 L22,4 L20,6 L18,4 Z"
            fill={isActive ? color : DARK_FANTASY.bone}
            opacity={isActive ? 0.6 : 0.3}
          />
          <path
            d="M18,4 Q10,4 2,3"
            fill="none"
            stroke={isActive ? color : DARK_FANTASY.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.4 : 0.2}
          />
          <path
            d="M22,4 Q30,4 38,3"
            fill="none"
            stroke={isActive ? color : DARK_FANTASY.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.4 : 0.2}
          />
        </svg>
      </div>
    </button>
  )
}

const WAYSTATIONS: Record<Profession, { icon: React.ReactNode; color: string }> = {
  drummer: { icon: <WaveIcon />, color: DARK_FANTASY.lavender },
  engineer: { icon: <GearIcon />, color: DARK_FANTASY.ethereal },
  fighter: { icon: <DiamondIcon />, color: DARK_FANTASY.spiritGold },
}

// The vine flourish on a frame's top or bottom edge, drawn flipped for the bottom.
const DialogueFlourish = memo(function DialogueFlourish({
  position,
  width = 200
}: {
  position: 'top' | 'bottom'
  width?: number
}) {
  const isTop = position === 'top'
  // Flip the SVG for bottom position
  const transform = isTop ? '' : 'scale(1, -1)'

  return (
    <svg
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        [isTop ? 'top' : 'bottom']: '-12px',
        width: width,
        height: 24,
      }}
      viewBox="0 0 200 24"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={transform} style={{ transformOrigin: 'center' }}>
        {/* Central diamond ornament */}
        <path
          d="M100,4 L104,10 L100,16 L96,10 Z"
          fill={DARK_FANTASY.bone}
          opacity="0.7"
        />
        <path
          d="M100,6 L102,10 L100,14 L98,10 Z"
          fill={DARK_FANTASY.ethereal}
          opacity="0.4"
        />

        {/* Left curved vine */}
        <path
          d="M96,10 Q80,8 65,12 Q50,16 35,10 Q25,6 15,10"
          fill="none"
          stroke={DARK_FANTASY.bone}
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Left inner curve */}
        <path
          d="M90,10 Q75,6 60,10 Q48,14 38,8"
          fill="none"
          stroke={DARK_FANTASY.bone}
          strokeWidth="0.8"
          opacity="0.3"
          strokeLinecap="round"
        />
        {/* Left small curl accent */}
        <path
          d="M35,10 Q32,6 28,8 Q26,10 28,12"
          fill="none"
          stroke={DARK_FANTASY.bone}
          strokeWidth="0.8"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Right curved vine (mirrored) */}
        <path
          d="M104,10 Q120,8 135,12 Q150,16 165,10 Q175,6 185,10"
          fill="none"
          stroke={DARK_FANTASY.bone}
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Right inner curve */}
        <path
          d="M110,10 Q125,6 140,10 Q152,14 162,8"
          fill="none"
          stroke={DARK_FANTASY.bone}
          strokeWidth="0.8"
          opacity="0.3"
          strokeLinecap="round"
        />
        {/* Right small curl accent */}
        <path
          d="M165,10 Q168,6 172,8 Q174,10 172,12"
          fill="none"
          stroke={DARK_FANTASY.bone}
          strokeWidth="0.8"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Small dot accents along the vines */}
        <circle cx="50" cy="14" r="1.5" fill={DARK_FANTASY.bone} opacity="0.3" />
        <circle cx="70" cy="10" r="1" fill={DARK_FANTASY.bone} opacity="0.4" />
        <circle cx="150" cy="14" r="1.5" fill={DARK_FANTASY.bone} opacity="0.3" />
        <circle cx="130" cy="10" r="1" fill={DARK_FANTASY.bone} opacity="0.4" />
      </g>
    </svg>
  )
})

// How far inside its box the section frame draws its border.
const FRAME_INSET_REM = 1

// The section frame, after the game's dialogue boxes: an opaque panel (.df-panel, so the stage behind never
// shows through), a vine flourish on its top and bottom edges and the title centred over a short rule.
const VoidFrame = memo(function VoidFrame({
  children,
  title,
  headingLevel = 'h2',
}: {
  children: React.ReactNode
  title: string
  headingLevel?: 'h2' | 'h3'
}) {
  const HeadingTag = headingLevel
  const sectionHeadingId = headingId('section', title)

  return (
    <div
      className="relative py-[var(--frame-inset)]"
      style={{ '--frame-inset': `${FRAME_INSET_REM}rem` } as React.CSSProperties}
      role="region"
      aria-labelledby={sectionHeadingId}
    >
      {/* Main dialogue box container */}
      <div className="df-panel bg-[color:var(--df-panel)] relative">
        {/* Top decorative flourish - elegant vine-like pattern */}
        <DialogueFlourish position="top" width={220} />

        {/* Title header - elegant centered text like HK dialogue speaker name */}
        <div className="pt-6 pb-4 px-6 text-center">
          <HeadingTag
            id={sectionHeadingId}
            className="text-sm uppercase inline-block"
            style={{
              color: DARK_FANTASY.bone,
              fontWeight: 400,
              letterSpacing: '0.25em',
              // Subtle text shadow for readability on dark background
              textShadow: `0 2px 8px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {title}
          </HeadingTag>
          {/* Subtle underline accent below title */}
          <div
            className="mt-2 mx-auto"
            style={{
              width: '40px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${DARK_FANTASY.bone}40, transparent)`,
            }}
          />
        </div>

        {/* Content area - clean white text */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Bottom decorative flourish - slightly smaller than top */}
        <DialogueFlourish position="bottom" width={180} />
      </div>
    </div>
  )
})

// Services: a title and its line each, read in the same frame as the tech stack.
function ServiceList({ services }: { services: Service[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {services.map((service) => (
        <li key={service.id} className={MASONRY_ITEM}>
          <h3 className="text-sm tracking-[0.15em] mb-2 uppercase text-[color:var(--df-silver-text)]">
            {service.title}
          </h3>
          <p className="text-base leading-relaxed text-[color:var(--df-bone)]">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}

// Tech stack display
const TechCloud = memo(function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: DARK_FANTASY.silverText }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `${DARK_FANTASY.ethereal}12`,
                  border: `1px solid ${DARK_FANTASY.ethereal}30`,
                  color: DARK_FANTASY.bone,
                  borderRadius: '3px',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
})

// Project card: every field of the project's card, and the links with their names from the slot.
const ProjectCard = memo(function ProjectCard({ slot: { project: entry, links } }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const { cards } = labels
  const project = projectCard(entry, labels)
  return (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${DARK_FANTASY.void}, ${DARK_FANTASY.voidPurple})`,
        border: `1px solid ${entry.featured ? DARK_FANTASY.spiritGold : DARK_FANTASY.stoneDark}`,
        borderRadius: '4px',
      }}
    >
      {entry.featured && (
        <span className="text-sm tracking-[0.15em] uppercase" style={{ color: DARK_FANTASY.spiritGold }}>
          <span aria-hidden="true">* </span>{cards.featured}
        </span>
      )}
      <h3 className="text-lg mt-1 transition-colors" style={{ color: DARK_FANTASY.bone }}>
        <SlashBreaks text={project.name} />
      </h3>
      <p className="text-sm mt-1" style={{ color: DARK_FANTASY.ethereal }}>
        {project.role}
        {project.years && <span aria-hidden="true"> | </span>}
        {project.years}
      </p>
      <p className="text-sm mt-2" style={{ color: DARK_FANTASY.silverText }}>{project.tagline}</p>
      {project.description && <p className="text-sm mt-2 text-[color:var(--df-silver-text)]">{project.description}</p>}
      <MarkedLines items={project.details} label={cards.details} look={{ ...SPIRIT_LINES, list: 'space-y-1 mt-2' }} />
      {project.impact && (
        <p className="text-sm mt-2 italic" style={{ color: DARK_FANTASY.bone }}>
          <span aria-hidden="true">- </span>
          <ImpactLabel />{project.impact}
        </p>
      )}
      <TagList items={project.techStack} label={cards.technologiesUsed} look={SOUL_TAGS} />
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-[0.1em] uppercase transition-transform hover:scale-105 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--df-spirit-gold)] border border-[color:var(--df-ethereal)] text-[color:var(--df-ethereal)] bg-[color-mix(in_srgb,var(--df-ethereal)_10%,transparent)]"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
})

// Company card. The link is named by its visible text (the plate, name, tagline, description and services),
// so a screen reader reaches every field of the card, then hears that it opens a new tab.
// His own products (featured) take the first row two to a row, a wider card with a gold plaque over
// the name; the other ventures follow three to a row.
const CompanyCard = memo(function CompanyCard({ company: entry }: { company: CVData['companies'][number] }) {
  const { links, cards, sections } = useLabels()
  const company = ventureCard(entry)
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block h-full p-4 transition-transform hover:scale-[1.02] group min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--df-spirit-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--df-void)]`}
      style={{
        background: `linear-gradient(135deg, ${DARK_FANTASY.void}, ${DARK_FANTASY.voidPurple})`,
        border: `1px solid ${DARK_FANTASY.stoneDark}`,
        borderRadius: '4px',
      }}
    >
      {company.featured && (
        <span className="mb-3 inline-block border border-[color:var(--df-spirit-gold)] px-2 py-0.5 text-sm uppercase tracking-widest text-[color:var(--df-spirit-gold)]">
          {cards.ownProduct}
        </span>
      )}
      <div className="flex items-center gap-3 mb-2">
        <span className={company.featured ? 'text-3xl' : 'text-2xl'} aria-hidden="true">{company.icon}</span>
        <div className="min-w-0">
          <h3 className={`${company.featured ? 'text-xl' : 'text-lg'} transition-colors`} style={{ color: DARK_FANTASY.bone }}>
            <SlashBreaks text={company.name} />
          </h3>
          <p className="text-sm" style={{ color: DARK_FANTASY.spiritGold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: DARK_FANTASY.silverText }}>{company.description}</p>
      <TagList items={company.services} label={sections.services} look={SOUL_TAGS} />
      <span className="sr-only"> {newTabHint(links)}</span>
    </a>
  )
})

// Band card
const BandCard = memo(function BandCard({ band, years, linkProps, release }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${DARK_FANTASY.void}, ${DARK_FANTASY.voidDeep})`,
        border: `1px solid ${DARK_FANTASY.lavender}60`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-lg transition-colors" style={{ color: DARK_FANTASY.bone }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: DARK_FANTASY.lavender }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {release && (
        <p className="text-sm mt-2" style={{ color: DARK_FANTASY.silverText }}>
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block h-full min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--df-lavender)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--df-void)]"
    >
      {content}
    </a>
  )
})

// A row of tags in the soul light, the look the project cards give their technologies (the ethereal at alpha
// 0x12, 18 of 255).
const SOUL_TAGS: TagListLook = {
  list: 'flex flex-wrap gap-1 mt-3',
  tag: 'text-sm px-1 py-0.5 bg-[color-mix(in_srgb,var(--df-ethereal)_7.0588%,transparent)] text-[color:var(--df-silver-text)]',
}

// Work experience card: every field of the job's card, the years in the label ("2019 to 2022").
const ExperienceCard = memo(function ExperienceCard({ entry, isLast }: { entry: Job; isLast?: boolean }) {
  const { years, cards } = useLabels()
  const job = jobCard(entry, years)

  return (
    <article className="py-4">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-medium" style={{ color: DARK_FANTASY.bone }}>{job.title}</h3>
          <p className="text-sm" style={{ color: DARK_FANTASY.ethereal }}><SlashBreaks text={job.company} /></p>
          {job.location && <p className="text-sm text-[color:var(--df-silver-text)]">{job.location}</p>}
        </div>
        <span
          className="text-sm"
          style={{ color: DARK_FANTASY.spiritGold }}
        >
          {job.years}
        </span>
      </div>
      {job.description && <p className="text-sm mb-2" style={{ color: DARK_FANTASY.silverText }}>{job.description}</p>}
      <MarkedLines items={job.highlights} label={cards.keyAchievements} look={SPIRIT_LINES} />
      <TagList items={job.skills} label={cards.skillsUsed} look={SOUL_TAGS} />
      {!isLast && (
        <div
          className="mt-4"
          style={{
            borderBottom: `1px solid ${DARK_FANTASY.stoneDark}40`,
          }}
        />
      )}
    </article>
  )
})

// The profession selector: the waystations on their wire and, for 500ms after each pick, the energy running
// along it from the station he left to the one he picked. The selector keeps the station the energy leaves
// from, so a pick and the energy's end re-render it alone, not the whole world.
const ENERGY_FLOW_MS = 500

function WaystationSelector({ active }: { active: Profession }) {
  const { navigation } = useLabels()
  const previous = useRef(active)
  const [from, setFrom] = useState<Profession | null>(null)
  const flowing = from !== null

  useEffect(() => {
    const left = previous.current
    previous.current = active
    if (left === active) return
    setFrom(left)
    const timer = setTimeout(() => setFrom(null), ENERGY_FLOW_MS)
    return () => clearTimeout(timer)
  }, [active])

  return (
    <section className="relative z-20 py-6 md:py-8" aria-labelledby="profession-heading">
      <h2 id="profession-heading" className="sr-only">{navigation.selectYourProfession}</h2>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div
          className={`relative h-40 md:h-56 overflow-hidden ${world.selector}`}
          style={{
            background: `linear-gradient(180deg, transparent, ${DARK_FANTASY.voidPurple}30)`,
            borderRadius: '4px',
          }}
        >
          {/* Connection paths */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={DARK_FANTASY.brass} stopOpacity="0" />
                <stop offset="50%" stopColor={DARK_FANTASY.brass} stopOpacity="0.4" />
                <stop offset="100%" stopColor={DARK_FANTASY.brass} stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="17%" y1="55%" x2="50%" y2="30%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="50%" y1="30%" x2="83%" y2="55%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
            {/* Gear decorations at intersections */}
            <circle cx="33.5%" cy="42.5%" r="3" fill={DARK_FANTASY.copper} opacity="0.3" />
            <circle cx="66.5%" cy="42.5%" r="3" fill={DARK_FANTASY.copper} opacity="0.3" />
          </svg>

          {/* Energy flow animation between nodes */}
          <EnergyFlowAnimation
            fromProfession={from}
            toProfession={active}
            isAnimating={flowing}
          />

          <ProfessionSwitch
            className="absolute inset-0"
            label={navigation.professionSelection}
            renderOption={(option) => (
              <WaystationNode option={option} isReceivingEnergy={flowing && option.selected} />
            )}
          />
        </div>
      </div>
    </section>
  )
}

// The hero and contact buttons.
const DF_BUTTON =
  'inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-transform hover:scale-105 min-h-[44px] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--df-spirit-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--df-void)]'

// Email is the brass action, LinkedIn and the CV in the contact row the outlined ones.
const DF_OUTLINED = 'bg-transparent border-2 border-[color:var(--df-brass)] text-[color:var(--df-brass-text)]'
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: `${DF_BUTTON} bg-[color:var(--df-brass-plate)] text-[color:var(--df-void)]`,
  linkedin: `${DF_BUTTON} ${DF_OUTLINED}`,
}

// The nav's CV and engine links: small framed tabs, the CV in stone, the engine in the soul light.
const NAV_LINK =
  'px-2 md:px-3 py-1.5 md:py-2 min-h-[44px] min-w-[44px] justify-center text-sm tracking-[0.1em] uppercase transition-transform hover:scale-105 flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--df-spirit-gold)]'
const NAV_LOOK: Record<SiteLinkId, string> = {
  cv: `${NAV_LINK} border border-[color:var(--df-stone-dark)] text-[color:var(--df-silver-text)] bg-[color-mix(in_srgb,var(--df-void)_80%,transparent)]`,
  engine: `${NAV_LINK} border border-[color:var(--df-ethereal)] text-[color:var(--df-ethereal)] bg-[color-mix(in_srgb,var(--df-ethereal)_10%,transparent)]`,
}

function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <ContactLink key={action.id} slot={action} className={HERO_ACTION_LOOK[action.id]} />
      ))}
    </>
  )
}

// What each section shows inside its frame, every field from the shared lists and the card view models. The
// cards a scene counts (one relic each) sit inside [data-stage-items].
const CARDS: SectionFrames = {
  about: function AboutCards({ slot }) {
    const { cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <>
        <p className="max-w-prose mx-auto leading-relaxed text-[color:var(--df-bone)]">{slot.bio}</p>
        <div data-stage-items="">
          <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...SPIRIT_LINES, list: 'max-w-prose mx-auto mt-4 space-y-1' }} />
        </div>
        <AboutFacts look={SPIRIT_FACTS} />
      </>
    )
  },
  work: function WorkCards({ slot: { jobs } }) {
    return (
      <ul data-stage-items="">
        {jobs.map((entry, index) => (
          <li key={entry.id}>
            <ExperienceCard entry={entry} isLast={index === jobs.length - 1} />
          </li>
        ))}
      </ul>
    )
  },
  tech: function TechCards({ slot }) {
    return (
      <div data-stage-items="">
        <TechCloud categories={slot.categories} />
      </div>
    )
  },
  services: function ServiceCards({ slot }) {
    return (
      <div data-stage-items="">
        <ServiceList services={slot.services} />
      </div>
    )
  },
  projects: function ProjectCards({ slot }) {
    return (
      <div data-stage-items="">
        <ProjectList projects={slot.projects} className="grid md:grid-cols-2 gap-3 md:gap-4" renderProject={(projectSlot) => <ProjectCard slot={projectSlot} />} />
      </div>
    )
  },
  ventures: function VentureCards({ slot }) {
    return (
      <ul data-stage-items="" className="grid md:grid-cols-6 gap-3 md:gap-4">
        {slot.companies.map((company) => (
          <li key={company.id} className={company.featured ? 'md:col-span-3' : 'md:col-span-2'}>
            <CompanyCard company={company} />
          </li>
        ))}
      </ul>
    )
  },
  bands: function BandCards({ slot: { musician, bands } }) {
    const { years } = useLabels()
    return (
      <>
        <p className="text-sm mb-4 text-center text-[color:var(--df-bone)]">{drumsSince(musician, years)}</p>
        <div data-stage-items="">
          <BandList bands={bands} className="grid md:grid-cols-3 gap-3 md:gap-4" renderBand={(bandSlot) => <BandCard {...bandSlot} />} />
        </div>
        <p className="text-sm mt-4 italic text-center text-[color:var(--df-lavender)]">{musician.line}</p>
      </>
    )
  },
  muayThai: function MuayThaiCards({ slot: { martialArts } }) {
    return (
      <>
        <h3 className="text-lg font-medium mb-4 text-[color:var(--df-bone)]">{martialArts.primary.title}</h3>
        <div data-stage-items="">
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-3 mb-4',
              fact: 'p-3 rounded bg-gradient-to-br from-[color:var(--df-void)] to-[color:var(--df-void-purple)] border border-[color:var(--df-stone-dark)]',
              term: 'text-sm tracking-[0.15em] uppercase text-[color:var(--df-spirit-gold)]',
              value: 'text-sm mt-1 text-[color:var(--df-bone)]',
              achievements: 'space-y-1',
              achievement: 'text-sm flex items-start gap-2 text-[color:var(--df-bone)]',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[color:var(--df-spirit-gold)]" aria-hidden="true">*</span>
                {achievement}
              </>
            )}
          />
        </div>
      </>
    )
  },
}

// The column a frame reads in: beside the scene from lg, the knight and his relics on its right; below lg the
// whole width, the scene showing in the screens of picture alone above and below it.
const COLUMN = 'relative mx-auto max-w-4xl lg:mx-0 lg:w-[min(46rem,50vw)]'
const SIDE = 'px-4 md:px-6 lg:pl-[clamp(1.5rem,4vw,4rem)]'

/** One section: a screen of its scene alone, then its frame over the held scene, then the scene again
 *  before it sinks. Under reduced motion its own scene sits still behind the first screen. */
function SceneSection({ scene, profession, still }: { scene: DarkScene & { slot: SectionSlot }; profession: Profession; still: boolean }) {
  const { sections } = useLabels()
  const Cards = CARDS[scene.slot.id] as ComponentType<{ slot: SectionSlot }>
  return (
    <div data-scene={scene.id} className={`relative z-20 pb-[70svh] ${SIDE}`}>
      {still && <DarkStage scene={scene} profession={profession} settled />}
      <div className="min-h-[100svh]" />
      <div className={COLUMN}>
        <VoidFrame title={sections[scene.slot.titleKey]}>
          <Cards slot={scene.slot} />
        </VoidFrame>
      </div>
    </div>
  )
}

// Dark Fantasy: his CV as a knight's descent through a gothic cavern arena. The hero shows the arena and the
// profession's boss stage; then every section is a full screen scene that rises from the dark, holds while
// its frame scrolls over it and sinks as the next rises (the shared theatre on the scroll stage engine). In
// each scene the knight frees one relic per card as that card scrolls up; in projects he fights the bug and
// at the contact he ends it. Under reduced motion every section carries its own scene, still.
export default function DarkFantasyTheme() {
  const view = useWorldView()
  const labels = useLabels()
  const { navigation, actions: actionLabels, sections } = labels
  const { professionalSummary } = useCVData()
  const { highlights } = useAboutBlock()
  const siteLinks = useSiteLinks('engine')
  const active = view.profession
  // The rain and the spirits are placed by Math.random and the cursor trail and parallax follow the pointer,
  // so they wait for the mount: a server render and the hydrating client never disagree on them.
  const [mounted, setMounted] = useState(false)
  // The cursor trail and the parallax follow the pointer, motion a reduced motion visitor asked not to get.
  const reduced = useReducedMotion()
  const pointerMotion = mounted && !reduced

  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), labels, highlights),
    [view.sections, professionalSummary.bio, labels, highlights],
  )
  const { theatreRef, textRef } = useTheatre(scenes, HALL_MOTION, reduced)
  const gates = scenes.filter((scene): scene is DarkScene & { slot: SectionSlot } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      style={DARK_FANTASY_VARS}
      className={`${world.root} min-h-screen relative overflow-x-clip [--focus-ring:var(--df-spirit-gold)] [--focus-halo:var(--df-void)] bg-[color:var(--df-void)] font-['Comic_Sans_MS','Comic_Sans',cursive]`}
    >
      <SkipLink />

      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <DarkStage key={scene.id} scene={scene} profession={active} />
          ))}
        </Theatre>
      )}
      {mounted && <EtherealRain />}
      <DarkFantasyAtmosphere />
      {mounted && <SpiritParticles />}

      {/* Interactive Elements - desktop only */}
      {pointerMotion && <ParallaxLayers />}
      {pointerMotion && <CursorTrail />}

      {/* Vignette overlay - optimized: no box-shadow */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 30%, rgba(15,10,26,0.4) 60%, rgba(15,10,26,0.8) 100%),
            linear-gradient(180deg, transparent 60%, ${DARK_FANTASY.void}90 100%)
          `,
        }}
      />

      {/* Bottom obscure overlay - content fades into darkness */}
      <div
        className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-[7]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${DARK_FANTASY.void}40 30%, ${DARK_FANTASY.void}90 70%, ${DARK_FANTASY.void} 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Fixed Navigation Bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[50] pl-4 pr-16 py-3 sm:pr-36 md:pl-6 md:py-4"
        style={{
          background: `linear-gradient(180deg, ${DARK_FANTASY.void}f5 0%, ${DARK_FANTASY.void}e0 70%, transparent 100%)`,
        }}
        aria-label={navigation.primaryNavigation}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 md:gap-4">
          {/* Name - compact on mobile */}
          <Link href="/" className="flex min-h-[44px] min-w-0 items-center gap-2 md:gap-3 group">
            <div aria-hidden="true" className="hidden sm:block">
              <SpiritWisp size={32} color={DARK_FANTASY.spiritGold} />
            </div>
            <span
              className="text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] font-normal uppercase"
              style={{
                color: DARK_FANTASY.bone,
                textShadow: `0 0 20px ${DARK_FANTASY.ethereal}30`,
              }}
            >
              <NameWords name={view.hero.name} />
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex gap-2 md:gap-3 items-center">
            <ContactLink slot={siteLinks.cv} className={NAV_LOOK.cv} />
            <ContactLink slot={siteLinks.engine} className={NAV_LOOK.engine}>
              {(label) => (
                <>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{actionLabels.engineShort}</span>
                </>
              )}
            </ContactLink>
          </div>
        </div>
      </nav>

      {/* The text layer: every word of the page, drawn by the theatre at the settled scroll so it rests with the art */}
      <div ref={textRef}>
      {/* Hero Section - below fixed nav, the recruiter first screen */}
      {/* one step over the next section below lg, so the plate hanging into its top padding takes the clicks */}
      <header data-worlds-hero="" className="relative z-20 max-lg:z-[21] pt-20 md:pt-24 pb-6 px-4 md:px-6">
        {reduced && <DarkStage scene={scenes[0]} profession={active} settled />}
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-[clamp(1.25rem,7vw,2.25rem)] tracking-[0.15em] uppercase mb-3"
                style={{ color: DARK_FANTASY.bone, textShadow: `0 0 20px ${DARK_FANTASY.ethereal}30` }}
              >
                <NameWords name={name} />
              </h1>
              <p className="text-sm md:text-lg tracking-wider mb-2" style={{ color: DARK_FANTASY.silverText }}>
                {headline}
              </p>
              <p
                className="text-sm tracking-wider italic"
                style={{ color: DARK_FANTASY.spiritGold, textShadow: `0 0 10px ${DARK_FANTASY.spiritGold}40` }}
              >
                {tagline}
              </p>
              <p className="text-sm mt-2" style={{ color: DARK_FANTASY.bone }}>{line}</p>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                <HeroActions actions={actions} />
                {/* out of the page flow so the hero keeps its places. From lg a zero size item at the end of the
                    actions row (its gap taken back) hangs the plate 30px right of the last action, on the row's
                    centre line; below lg the slim plate sits between the actions and the profession nodes, in
                    the header's bottom padding and the gap under it */}
                <Wardrobe
                  look={OUTFIT_LOOK}
                  className="c-wardrobe--slim-below-lg c-wardrobe--fan-down-below-lg max-sm:[--wd-fan-gap:145px] sm:max-lg:[--wd-fan-gap:155px] c-wardrobe--fan-right-from-lg c-wardrobe--fan-down-from-lg absolute inset-x-0 top-[calc(100%_-_22px)] lg:relative lg:inset-x-auto lg:top-auto lg:-ml-3 lg:h-0 lg:w-0 lg:translate-x-[30px] lg:items-center lg:justify-start lg:self-center"
                />
              </div>
            </div>
          )}
        />
      </header>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <WaystationSelector active={active} />

        <ProfessionRegion>
          {gates.map((scene) => (
            <SceneSection key={scene.id} scene={scene} profession={active} still={reduced} />
          ))}
        </ProfessionRegion>

        {/* Contact: the knight ends the bug on the scene behind it */}
        <div data-scene="contact" className={`relative z-20 pt-[60svh] pb-[40svh] ${SIDE}`}>
          {reduced && <DarkStage scene={contact} profession={active} settled />}
          <section className="df-panel relative mx-auto max-w-2xl bg-[color:var(--df-panel)] px-6 py-10" aria-label={sections.contact}>
            <RecruiterHero
              render={({ line, actions }) => (
                <div className="text-center">
                  <div className="mb-8">
                    <h2 className="text-xl tracking-[0.15em] mb-3 text-[color:var(--df-brass-text)]">{actionLabels.emailMe}</h2>
                    <p className="text-sm text-[color:var(--df-silver-text)]">{line}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <HeroActions actions={actions} />
                    <ContactLink slot={siteLinks.cv} className={`${DF_BUTTON} ${DF_OUTLINED}`} />
                  </div>
                </div>
              )}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center">
        <div className="inline-flex items-center gap-4" style={{ color: DARK_FANTASY.silverText }}>
          <div className="w-12 h-px" style={{ background: DARK_FANTASY.brass }} aria-hidden="true" />
          <span className="text-sm tracking-[0.2em]">
            <CopyrightLine srPrefix={navigation.copyright} />
          </span>
          <div className="w-12 h-px" style={{ background: DARK_FANTASY.brass }} aria-hidden="true" />
        </div>
      </footer>
      </div>
    </div>
  )
}
