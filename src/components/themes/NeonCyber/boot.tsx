'use client'

import type { CSSProperties } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import { ContactActions } from './actions'
import { ProfessionMenu } from './menu'
import type { Scene } from './scenes'
import { NeonStage } from './stage'
import world from './world.module.css'
import { NEON } from './palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'

// His outfit plate: a visor readout in HUD yellow on ink, ringed in data cyan.
const OUTFIT_LOOK: WardrobeLook = { plate: NEON.ink, text: NEON.hud, ring: NEON.data }

// The recruiter first screen as his visor booting, once, about 2.4 s: a scanline sweeps the panel,
// the four brackets snap in, his name lands with its red and cyan ghosts splitting off and settling,
// the headline and the tagline type in and the HUD rail slides in under them. He stands in the city
// behind the panel, the hero's stage. After the boot the panel leans toward the pointer (--mx, --my), the
// HUD sitting in his eyes. Every word is real text from the start; the shutters and the ghosts are drawn
// over it.

// How a typed line runs: its length sets the steps, its start follows the line before it.
function Typed({ text, at, className = '' }: { text: string; at: number; className?: string }) {
  const time = Math.min(1.1, 0.02 * text.length + 0.2)
  return (
    <span className={`${world.typed} ${className}`}>
      {text}
      <span
        className={world.shutter}
        style={{ '--chars': Math.max(4, Math.round(text.length / 2)), '--type-at': `${at}s`, '--type-time': `${time}s` } as CSSProperties}
        aria-hidden="true"
      />
    </span>
  )
}

const BRACKETS = [
  'left-0 top-0 border-l-2 border-t-2 origin-top-left',
  'right-0 top-0 border-r-2 border-t-2 origin-top-right',
  'left-0 bottom-0 border-l-2 border-b-2 origin-bottom-left',
  'right-0 bottom-0 border-r-2 border-b-2 origin-bottom-right',
]

// The ghosts of his name: the colour, the slice it keeps and the way it throws.
const GHOSTS = [
  { color: 'text-[color:var(--neon-chrome-red)]', slice: '[clip-path:inset(0_0_55%_0)]', x: '-14px' },
  { color: 'text-[color:var(--neon-data)]', slice: '[clip-path:inset(45%_0_0_0)]', x: '12px' },
]

interface BootHeroProps {
  profession: Profession
}

function BootHero({ profession }: BootHeroProps) {
  const { navigation, professions } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className={world.tilt}>
          <div className={`${world.panel} relative overflow-hidden p-5 sm:p-8`}>
            <span className={`pointer-events-none absolute inset-0 border-t-2 border-[color:var(--neon-hud)] ${world.sweep}`} aria-hidden="true" />
            {BRACKETS.map((place) => (
              <span key={place} className={`pointer-events-none absolute h-6 w-6 border-[color:var(--neon-hud)] ${place} ${world.bracket}`} aria-hidden="true" />
            ))}

            <h1 className="relative text-[clamp(1.75rem,8vw,3rem)] font-bold uppercase leading-tight tracking-[0.12em] text-[color:var(--neon-ice)]">
              <span className={`block ${world.nameIn}`}>
                <NameWords name={name} />
              </span>
              {GHOSTS.map(({ color, slice, x }) => (
                <span
                  key={x}
                  className={`absolute inset-0 ${color} ${slice} ${world.ghost}`}
                  style={{ '--ghost-x': x } as CSSProperties}
                  aria-hidden="true"
                >
                  <NameWords name={name} />
                </span>
              ))}
            </h1>

            <p className="mt-4 text-base text-[color:var(--neon-hud)] sm:text-lg">
              <Typed text={headline} at={1.1} />
            </p>
            <p className="mt-2 text-sm text-[color:var(--neon-ice)]">
              <span className="text-[color:var(--neon-data)]" aria-hidden="true">
                {'> '}
              </span>
              <Typed text={tagline} at={1.5} />
            </p>
            <p className={`mt-2 text-sm text-[color:var(--neon-ash)] ${world.fadeLate}`}>{line}</p>

            <div className={`mt-5 ${world.rail}`}>
              <div className={world.ticks} aria-hidden="true" />
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[color:var(--neon-ash)]">
                {navigation.profession} <span className="text-[color:var(--neon-hud)]">{professions[profession]}</span>
              </p>
            </div>

            <nav className={`mt-5 flex flex-wrap gap-3 ${world.fadeLate}`} aria-label={navigation.contactAndCv}>
              <ContactActions actions={actions} />
            </nav>
          </div>
        </div>
      )}
    />
  )
}

interface HeroSectionProps extends BootHeroProps {
  scene: Scene
  still: boolean
}

/**
 * The first screen: the booting visor panel and the profession menu over the street, him under the overpass to
 * the right. His outfit plate sits beside him from lg, its fan opening down over the street; below lg it
 * sits under the menu, clear of every control: on a phone its fan opens down into the hero's own bottom
 * space, which the visitor scrolls to; from md to lg the plate is on the first screen, so the fan opens up.
 * Under reduced motion the hero's picture sits still behind it.
 */
export function HeroSection({ scene, still, profession }: HeroSectionProps) {
  const { navigation } = useLabels()
  return (
    <section data-scene="hero" data-worlds-hero="" className="relative min-h-[100svh] px-4 pb-[14rem] pt-8 sm:px-6 sm:pt-16 lg:px-[6vw] lg:pb-16">
      {still && <NeonStage scene={scene} settled />}
      {/* on a phone the first half screen is his: up on the fire escape landing over the street (scenes.tsx) */}
      <div className="h-[44svh] md:hidden" aria-hidden="true" />
      <div className="max-w-[44rem] lg:max-w-[min(40rem,56vw)]">
        <BootHero profession={profession} />
        <section className="mt-6" aria-label={navigation.professionSelection}>
          <ProfessionMenu active={profession} />
        </section>
      </div>
      <Wardrobe
        look={OUTFIT_LOOK}
        className={`c-wardrobe--fan-down-below-md c-wardrobe--fan-down-from-lg absolute bottom-[8.5rem] left-1/2 z-10 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-[4vw] lg:top-24 lg:translate-x-0 ${world.fadeLate}`}
      />
    </section>
  )
}
