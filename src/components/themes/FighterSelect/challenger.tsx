'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ArenaFighter } from './arena'
import { ScreenPanel } from './frames'
import { StageBackdrop } from './stages'
import { CVLink, HeroAction } from './actions'
import { Fighter } from './fighter'
import { useScene } from './scenes'
import living from './living.module.css'
import { CallText } from './badges'
import { Cue, HudCentre, LifeBar } from './hud'
import look from './world.module.css'
import fight from './fight.module.css'

// Contact as the win quote screen after a match. He stands in his win pose, his partner flat on the
// floor across the ring, then the quote panel: his face in its frame and his line as the winner's
// quote, the buttons under it. Meanwhile the clock on player two's side counts down nine to zero like
// the arcade's continue clock, waiting for the visitor to step in as the next challenger. CSS keyframes
// chained by delay under a Cue, played once: 0ms the white flash, 200ms the red banner slashes across
// and off (900ms), 260ms he steps into his corner, 520ms the heading slams in, 760ms the quote and the
// buttons rise, 900ms the clock starts ticking. The buttons press into the panel like arcade buttons.

const CONTACT_HEADING = headingId('fighter-select', 'Contact')
const CLOCK_DIGITS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

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
  const { sections, arcade } = useLabels()
  const { ref } = useScene('temple')

  return (
    <section aria-labelledby={CONTACT_HEADING} className="relative z-20 mx-auto mb-10 max-w-6xl px-4 sm:px-6">
      <div ref={ref}>
        <Cue>
          <RecruiterHero
            render={({ name, line, actions }) => (
              <ScreenPanel accent="gold">
                <div className="mb-3 flex items-start gap-3" aria-hidden="true">
                  <LifeBar side="p1" label={name} delay="[--delay:300ms]" />
                  <span className="flex shrink-0 flex-col items-center">
                    <ChallengeClock />
                    <span className={`mt-1 text-sm uppercase text-white ${look.display} ${fight.blink}`}>{arcade.continueCall}</span>
                  </span>
                  <LifeBar side="p2" label={<span className={fight.blink}>?</span>} empty />
                </div>

                <div className="relative h-48 overflow-hidden border-2 border-white shadow-[0_0_0_2px_#000] sm:h-64" aria-hidden="true">
                  <StageBackdrop profession={profession} />
                  <ArenaFighter
                    profession={profession}
                    rest="win"
                    className={`absolute bottom-0 left-[4%] ${fight.enter} ${fight.portraitIn}`}
                    spriteClass="h-44 w-[10.25rem] sm:h-60 sm:w-[14rem]"
                  />
                  <div className={`absolute bottom-0 right-[2%] ${living.mirror}`}>
                    <Fighter profession={profession} who="partner" pose="down" className="h-36 w-[8.5rem] sm:h-52 sm:w-[12.25rem]" />
                  </div>
                  <div
                    className={`absolute inset-x-0 top-1/3 h-16 border-y-4 border-[color:var(--fs-hud-yellow)] bg-[color:var(--fs-ko)] ${fight.banner}`}
                  />
                  <div className={`absolute inset-0 bg-white opacity-0 ${fight.enter} ${fight.flash} [--delay:0ms]`} />
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
                    {actions.map((action) => (
                      <span key={action.id} className={`inline-flex justify-center ${fight.press}`}>
                        <HeroAction action={action} />
                      </span>
                    ))}
                    <span className={`inline-flex justify-center ${fight.press}`}>
                      <CVLink />
                    </span>
                  </div>
                </div>
              </ScreenPanel>
            )}
          />
        </Cue>
      </div>
    </section>
  )
}
