'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { NameWords } from '@/components/cv/NameWords'
import { ArenaFighter } from './arena'
import { StageBackdrop } from './stages'
import { ArcadeLinks } from './actions'
import { ClashEmblem } from './badges'
import { Cue } from './hud'
import look from './world.module.css'
import fight from './fight.module.css'
import { FS } from './palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'

// The hero entrance as the versus screen before a fight: his stage portrait in a white frame on the left
// with the 1P tag, the VS burst on the seam, his name on the black on the right in the round call
// lettering. CSS keyframes chained by delay, played once:
// 0ms the stage panel slashes in from the left and the name panel from the right (380ms), the wardrobe in its
// place from the first frame, seen and focusable,
// 260ms he slides into his corner and lands with an overshoot (420ms),
// 360ms a white flash over the stage and the VS burst slamming onto the seam mark the moment the
// panels meet, the clash jolting the wardrobe a few pixels and back (300ms), 520ms his name slams down
// from 1.5x (360ms), 760ms the headline lines rise in turn.
// The name panel and its words are opaque from the first frame; their entrance only moves them.

const HERO_SITES = ['cv', 'engine'] as const

const RISE_DELAYS = ['[--delay:760ms]', '[--delay:860ms]', '[--delay:960ms]', '[--delay:1060ms]']

// The VS burst sits on the seam: between the two stacked panels on a phone and a tablet (the left panel
// is h-56, sm:h-72, the gap 1rem), on the diagonal cut at lg where the panels stand side by side.
const SEAM = 'left-1/2 top-[14.5rem] sm:top-[18.5rem] lg:left-[40%] lg:top-1/2'

// His outfit plate: the versus screen's name bar, gold call lettering on the select navy with a white frame.
const OUTFIT_LOOK: WardrobeLook = { plate: FS.navy, text: FS.gold, ring: FS.flash }

export function HeroSplash({ profession }: { profession: Profession }) {
  const { navigation, hud } = useLabels()

  return (
    <Cue>
      <RecruiterHero
        render={({ name, headline, tagline, line, actions }) => (
          <div data-worlds-hero="" className="relative grid gap-4 lg:grid-cols-[2fr_3fr]">
            <div className="relative flex flex-col gap-3">
              {/* out of the flow, slim while the panels stack: as the name bar across the portrait's lower edge on a phone,
                  above the VS emblem; in the stage's free right side from sm; under the stage panel (sm:h-72) from lg */}
              <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--slim-below-lg sm:max-lg:[--wd-fan-gap:-143px] absolute bottom-[22px] right-2 z-10 sm:bottom-auto sm:top-[100px] lg:left-0 lg:right-0 lg:top-[calc(18rem_+_0.75rem)] ${look.display} ${fight.clashJolt}`} />
              <div className={`relative h-56 overflow-hidden border-4 border-white bg-black shadow-[inset_0_0_0_2px_#000] sm:h-72 ${look.splashLeft} ${fight.enter} ${fight.slashIn}`}>
                <StageBackdrop profession={profession} />
                <div className={`absolute inset-0 bg-white ${fight.enter} ${fight.flash} [--delay:360ms] opacity-0`} aria-hidden="true" />
                <ArenaFighter
                  profession={profession}
                  rest="stance"
                  figure
                  className={`absolute bottom-0 left-[12%] ${fight.enter} ${fight.portraitIn}`}
                  spriteClass="h-48 w-[11.25rem] sm:h-64 sm:w-60"
                />
                <span className={`pointer-events-none absolute left-3 top-3 z-20 bg-[color:var(--fs-p1-light)] px-2 text-base leading-6 text-[color:var(--fs-ink)] shadow-[2px_2px_0_#000] ${look.display}`} aria-hidden="true">
                  {hud.playerOne}
                </span>
              </div>
            </div>

            <div className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 ${SEAM}`} aria-hidden="true">
              <div className={`${fight.enter} ${fight.slam} [--delay:360ms]`}>
                <ClashEmblem large />
              </div>
            </div>

            <div className={`relative border-4 border-[color:var(--fs-p2)] bg-black px-5 pb-6 pt-14 sm:px-8 sm:pt-16 lg:pt-8 ${look.splashRight} ${fight.panelInRight}`}>
              <h1 className={`text-[clamp(1.75rem,8vw,3rem)] uppercase leading-tight ${fight.nameSlam}`}>
                <NameWords name={name} wordClassName={`inline-block ${look.call}`} />
              </h1>
              <p className={`mt-4 max-w-2xl text-base text-white md:text-lg ${fight.wordRise} ${RISE_DELAYS[0]}`}>{headline}</p>
              <p className={`mt-2 text-base text-[color:var(--fs-hud-yellow)] ${fight.wordRise} ${RISE_DELAYS[1]}`}>{tagline}</p>
              <p className={`mt-2 text-sm ${fight.wordRise} ${RISE_DELAYS[2]}`}>{line}</p>
              <nav className={`mt-6 flex flex-wrap items-center gap-3 ${fight.wordRise} ${RISE_DELAYS[3]}`} aria-label={navigation.contactAndCv}>
                <ArcadeLinks actions={actions} sites={HERO_SITES} />
              </nav>
            </div>
          </div>
        )}
      />
    </Cue>
  )
}
