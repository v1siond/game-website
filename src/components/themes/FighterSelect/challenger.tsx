'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/lib/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ScreenPanel } from './frames'
import { ArcadeLinks } from './actions'
import { Fighter } from './fighter'
import { CallText } from './badges'
import { Cue, HudCentre, LifeBar } from './hud'
import look from './world.module.css'
import fight from './fight.module.css'

// Contact as the win quote screen after a match, over the temple scene where he stands in his win pose and
// his partner lies flat (theatre.tsx): the quote panel, his face in its frame and his line as the winner's
// quote, the buttons under it. Meanwhile the clock on player two's side counts down nine to zero like
// the arcade's continue clock, waiting for the visitor to step in as the next challenger. CSS keyframes
// chained by delay under a Cue, played once: 520ms the heading slams in, 760ms the quote and the
// buttons rise, 900ms the clock starts ticking. The buttons press into the panel like arcade buttons.

const CONTACT_HEADING = headingId('fighter-select', 'Contact')
const CLOCK_DIGITS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
// The win screen offers the CV beside the hero's actions; the portfolio stays on the versus screen.
const CONTACT_SITES = ['cv'] as const

// The clock under the KO badge, two digits wide in the round call lettering: the tens stay at zero
// while the units strip ticks down.
function ChallengeClock() {
  return (
    <HudCentre>
      <span className={`flex h-9 items-start text-3xl leading-9 ${look.face}`}>
        <CallText>0</CallText>
        <span className="relative h-9 w-[1ch] overflow-hidden">
          <span className={`absolute inset-x-0 top-0 ${fight.countdown}`}>
            {CLOCK_DIGITS.map((digit) => (
              <span key={digit} className="block h-9 text-center">
                <CallText>{digit}</CallText>
              </span>
            ))}
          </span>
        </span>
      </span>
    </HudCentre>
  )
}

export function ChallengerScene({ profession }: { profession: Profession }) {
  const { sections } = useLabels()

  return (
    <section aria-labelledby={CONTACT_HEADING} className="relative z-20 mx-auto mb-10 max-w-6xl px-4 sm:px-6">
      <Cue>
        <RecruiterHero
          render={({ name, line, actions }) => (
            <ScreenPanel accent="gold">
              <div className="mb-3 flex items-start gap-3" aria-hidden="true">
                <LifeBar side="p1" label={name} delay="[--delay:300ms]" />
                <ChallengeClock />
                <LifeBar side="p2" label={<span className={fight.blink}>?</span>} empty />
              </div>

              <div className="mt-6 text-center sm:text-left">
                <h2 id={CONTACT_HEADING} className={`mb-3 text-[clamp(1.75rem,6vw,2.5rem)] uppercase leading-tight ${fight.enter} ${fight.slam}`}>
                  <CallText>{sections.contact}</CallText>
                </h2>
                <figure
                  className={`mb-6 flex items-stretch gap-4 border-4 border-white bg-black p-3 shadow-[0_0_0_2px_#000,6px_6px_0_2px_#000] ${fight.enter} ${fight.rise}`}
                >
                  <span
                    className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-[color:var(--fs-p1-light)] bg-[color:var(--fs-select)] sm:h-24 sm:w-24"
                    aria-hidden="true"
                  >
                    <Fighter
                      profession={profession}
                      pose="win"
                      still
                      className="absolute -left-8 -top-3 h-52 w-[12.25rem] sm:-left-10 sm:h-64 sm:w-[15rem]"
                    />
                  </span>
                  <blockquote className="min-w-0 self-center text-left">
                    <p className="text-base text-white md:text-lg">{line}</p>
                    <footer className={`mt-2 text-sm uppercase text-[color:var(--fs-hud-yellow)] ${look.display}`}>{name}</footer>
                  </blockquote>
                </figure>
                <div
                  className={`flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start ${fight.enter} ${fight.rise} [--delay:860ms]`}
                >
                  <ArcadeLinks actions={actions} sites={CONTACT_SITES} frame={`inline-flex justify-center ${fight.press}`} />
                </div>
              </div>
            </ScreenPanel>
          )}
        />
      </Cue>
    </section>
  )
}
