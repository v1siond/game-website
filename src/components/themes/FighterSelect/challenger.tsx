'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ArenaFighter } from './arena'
import { CabinetPanel } from './frames'
import { StageBackdrop } from './stages'
import { CVLink, HeroAction } from './actions'
import { FS } from './palette'
import { Cue, LifeBar } from './hud'
import look from './world.module.css'
import fight from './fight.module.css'

// Contact as a challenger stepping in. In the arcade a second player's coin stops the fight, the screen
// flashes, and while player two's side stands empty a short clock on the right waits for someone to
// take it. Here the visitor is that challenger. CSS keyframes chained by delay under a Cue, played once:
// 0ms the white flash, 200ms the red banner slashes across the arena and off (900ms), 260ms he steps
// into his corner, 520ms the heading slams in, 760ms the line and the buttons rise, 900ms the clock on
// player two's side starts ticking nine to zero. Player two's slot blinks the whole time. The buttons
// press into the panel like arcade buttons.

const CONTACT_HEADING = headingId('fighter-select', 'Contact')
const CLOCK_DIGITS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

// Player two's empty slot: a dark figure behind a blinking red cursor frame.
function OpenSlot() {
  return (
    <div className="relative h-36 w-24 sm:h-52 sm:w-36">
      <div className={`absolute inset-0 border-4 border-[color:var(--fs-p2)] ${fight.blink}`} />
      <svg viewBox="0 0 60 100" className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]" focusable="false">
        <circle cx={30} cy={22} r={12} fill={FS.ink} stroke={FS.p2Dark} strokeWidth={2} />
        <path d="M10 98 L14 50 Q16 38 30 37 Q44 38 46 50 L50 98 Z" fill={FS.ink} stroke={FS.p2Dark} strokeWidth={2} />
        <text x={30} y={78} textAnchor="middle" fontSize={26} fontFamily="Impact, 'Arial Black', sans-serif" fill={FS.p2}>
          ?
        </text>
      </svg>
    </div>
  )
}

function ChallengeClock() {
  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden border-2 border-[color:var(--fs-gold)] bg-[color:var(--fs-ink)]" aria-hidden="true">
      <div className={fight.countdown}>
        {CLOCK_DIGITS.map((digit) => (
          <span key={digit} className={`block h-9 text-center text-3xl leading-9 text-[color:var(--fs-gold)] ${look.display}`}>
            {digit}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ChallengerScene({ profession }: { profession: Profession }) {
  const { sections } = useLabels()

  return (
    <section aria-labelledby={CONTACT_HEADING} className="relative z-20 mx-auto mb-10 max-w-6xl px-4 sm:px-6">
      <Cue>
        <RecruiterHero
          render={({ name, line, actions }) => (
            <CabinetPanel accent="gold">
              <div className="mb-3 flex items-start gap-3" aria-hidden="true">
                <LifeBar side="p1" label={name} delay="[--delay:300ms]" />
                <ChallengeClock />
                <LifeBar side="p2" label={<span className={fight.blink}>?</span>} empty />
              </div>

              <div className="relative h-48 overflow-hidden border-4 border-[color:var(--fs-gold)] sm:h-64" aria-hidden="true">
                <StageBackdrop profession={profession} />
                <ArenaFighter
                  profession={profession}
                  rest="win"
                  className={`absolute bottom-0 left-[4%] ${fight.enter} ${fight.portraitIn}`}
                  spriteClass="h-44 w-[10.25rem] sm:h-60 sm:w-[14rem]"
                />
                <div className="absolute bottom-2 right-[8%]">
                  <OpenSlot />
                </div>
                <div className={`absolute inset-x-0 top-1/3 h-16 bg-gradient-to-r from-transparent via-[color:var(--fs-p2)] to-transparent ${fight.banner}`} />
                <div className={`absolute inset-0 bg-white opacity-0 ${fight.enter} ${fight.flash} [--delay:0ms]`} />
              </div>

              <div className="mt-6 text-center sm:text-left">
                <h2 id={CONTACT_HEADING} className={`mb-3 text-2xl uppercase sm:text-3xl ${look.display} ${look.roundCall} ${fight.enter} ${fight.slam}`}>
                  {sections.contact}
                </h2>
                <p className={`mb-6 text-base ${fight.enter} ${fight.rise}`}>{line}</p>
                <div className={`flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start ${fight.enter} ${fight.rise} [--delay:860ms]`}>
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
            </CabinetPanel>
          )}
        />
      </Cue>
    </section>
  )
}
