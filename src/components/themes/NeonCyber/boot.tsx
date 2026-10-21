'use client'

import type { CSSProperties, KeyboardEvent } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { NameWords } from '@/components/cv/NameWords'
import { CVLink, HeroAction } from './actions'
import { MercSprite, type MercMotion } from './merc'
import { ScanToggle } from './scanner'
import world from './world.module.css'

// The recruiter first screen as the optics booting, once, about 2.4 s: a scanline sweeps the panel,
// the four brackets snap in, his name lands with its red and cyan ghosts splitting off and settling,
// the headline and the tagline type in, the HUD rail slides in under them, and his portrait builds from
// a single line. Once the frame is built he walks into it from the left on the street stride and
// settles into the idle breath. After the boot the panel leans toward the pointer (--mx, --my), the HUD
// sitting in his eyes. Every word is real text from the start; the shutters and the ghosts are drawn
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

const WALK_IN: readonly MercMotion[] = ['walk']

// The keys that press a button, so the keyboard fires the same jump as a pointer press.
const PRESS_KEYS: ReadonlySet<string> = new Set(['Enter', ' '])

/**
 * Him in the optics frame, played like the game's merc: the walk in, then the idle. Pointing at him (or
 * focusing him) pops the mantis blades for one slash, pressing him (or Enter or Space) fires the double
 * jump on the cyberlegs; each strike plays one cycle and he drops back to the idle (the first animation
 * iteration under him ends it). Under reduced motion he stands still and takes no strikes.
 */
function HeroMerc({ profession }: { profession: Profession }) {
  const { cyber } = useLabels()
  const { pose, play, settle, onOwnAnimationEnd } = usePoseSequence<MercMotion>({ entrance: WALK_IN, rest: 'idle', still: 'still' })
  const pressKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!PRESS_KEYS.has(event.key)) return
    play('jump')
  }

  return (
    <button
      type="button"
      aria-label={cyber.doubleJump}
      className={`block w-full cursor-crosshair bg-transparent p-0 ${world.walkIn}`}
      onAnimationEnd={onOwnAnimationEnd}
      onAnimationIteration={settle}
      onPointerEnter={() => play('blades')}
      onFocus={() => play('blades')}
      onPointerDown={() => play('jump')}
      onKeyDown={pressKey}
    >
      <MercSprite profession={profession} motion={pose} className="h-auto w-full" />
    </button>
  )
}

interface BootHeroProps {
  profession: Profession
  scanning: boolean
  onScan: () => void
}

export function BootHero({ profession, scanning, onScan }: BootHeroProps) {
  const { navigation, professions } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className={`relative mx-auto max-w-6xl ${world.tilt}`}>
          <div className={`${world.panel} relative overflow-hidden p-5 sm:p-8`}>
            <span className={`pointer-events-none absolute inset-0 border-t-2 border-[color:var(--neon-hud)] ${world.sweep}`} aria-hidden="true" />
            {BRACKETS.map((place) => (
              <span key={place} className={`pointer-events-none absolute h-6 w-6 border-[color:var(--neon-hud)] ${place} ${world.bracket}`} aria-hidden="true" />
            ))}

            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="min-w-0">
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
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                </nav>
                <div className={`mt-4 ${world.fadeLate}`}>
                  <ScanToggle scanning={scanning} onToggle={onScan} />
                </div>
              </div>

              {/* his portrait in the optics frame, built from one line, then he walks in */}
              <div className="relative mx-auto w-32 overflow-hidden border border-[color-mix(in_srgb,var(--neon-data)_60%,transparent)] bg-[color:var(--neon-ink)] p-2 sm:w-40">
                <div className={world.build}>
                  <HeroMerc profession={profession} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(94,242,255,0.12)_2px_3px)]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}
