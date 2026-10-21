'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { ArenaFighter } from './arena'
import { StageBackdrop } from './stages'
import { CVLink, HeroAction, PortfolioLink } from './actions'
import { ClashEmblem } from './badges'
import { Cue } from './hud'
import look from './world.module.css'
import fight from './fight.module.css'

// The hero entrance as the pre fight splash, CSS keyframes chained by delay, played once:
// 0ms the stage panel slashes in from the left and the name panel from the right (380ms),
// 260ms he slides into his corner and lands with an overshoot (420ms),
// 360ms a white flash over the stage and the clash emblem slamming onto the seam mark the moment the
// panels meet, 520ms his name slams down from 2.4x (360ms), 760ms the headline lines rise in turn.

const RISE_DELAYS = ['[--delay:760ms]', '[--delay:860ms]', '[--delay:960ms]', '[--delay:1060ms]']

export function HeroSplash({ profession }: { profession: Profession }) {
  const { navigation } = useLabels()

  return (
    <Cue>
      <RecruiterHero
        render={({ name, headline, tagline, line, actions }) => (
          <div className="relative grid gap-4 lg:grid-cols-[2fr_3fr]">
            <div className={`relative h-56 overflow-hidden border-4 border-[color:var(--fs-p1-light)] sm:h-72 ${look.splashLeft} ${fight.enter} ${fight.slashIn}`}>
              <StageBackdrop profession={profession} />
              <div className={`absolute inset-0 bg-white ${fight.enter} ${fight.flash} [--delay:360ms] opacity-0`} aria-hidden="true" />
              <ArenaFighter
                profession={profession}
                rest="stance"
                className={`absolute bottom-0 left-[12%] ${fight.enter} ${fight.portraitIn}`}
                spriteClass="h-48 w-[11.25rem] sm:h-64 sm:w-60"
              />
            </div>

            <div className="absolute left-[40%] top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block" aria-hidden="true">
              <div className={`${fight.enter} ${fight.slam} [--delay:360ms]`}>
                <ClashEmblem large />
              </div>
            </div>

            <div className={`relative p-5 sm:p-8 ${look.metal} ${look.frame} ${look.accentP2} ${look.splashRight} ${fight.enter} ${fight.slashInRight}`}>
              <h1 className={`break-words text-3xl uppercase leading-tight md:text-5xl ${look.display} ${look.marquee} ${fight.enter} ${fight.slam}`}>{name}</h1>
              <p className={`mt-4 max-w-2xl text-base md:text-lg ${fight.enter} ${fight.rise} ${RISE_DELAYS[0]}`}>{headline}</p>
              <p className={`mt-2 text-base italic text-[color:var(--fs-cyan)] ${fight.enter} ${fight.rise} ${RISE_DELAYS[1]}`}>{tagline}</p>
              <p className={`mt-2 text-sm ${fight.enter} ${fight.rise} ${RISE_DELAYS[2]}`}>{line}</p>
              <nav className={`mt-6 flex flex-wrap items-center gap-3 ${fight.enter} ${fight.rise} ${RISE_DELAYS[3]}`} aria-label={navigation.contactAndCv}>
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PortfolioLink />
              </nav>
            </div>
          </div>
        )}
      />
    </Cue>
  )
}
