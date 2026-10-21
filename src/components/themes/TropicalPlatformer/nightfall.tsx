'use client'

import { useState, type CSSProperties } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/components/cv/sectionText'
import { useProfession } from '@/contexts/ProfessionContext'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { JungleAction, JungleCVLink } from './buttons'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import { Backdrop, NightFront, NightSky, ToneScope } from './scenery'
import { EndTarget } from './target'
import look from './jungle.module.css'
import night from './nightfall.module.css'

// Contact at the end of the level, where the source's levels end: night, in the teal the source tints
// its night jungle with, the same jungle round the section. The moon is up over his tree house, the
// window lights, fireflies drift; he rolls in along the ground as a spinning ball onto the source's end
// of level target and pops up on its pad, chest pounding, while the barrel shoots up the pole and rings
// the bell (target.tsx); the contact sign drops on two vines and swings to rest. Pointing at the sign
// rocks it; Jump again replays the finish. Pattern: CSS off one trigger (data-on), the roll 0 to 0.9 s,
// the window at 0.6 s, the target from 0.9 s, the sign from 1 s; a replay count remounts the scene's
// actors.

// The four fireflies: where each drifts from and its delay.
const FIREFLIES = [
  { left: '18%', top: '62%', delay: '0s' },
  { left: '34%', top: '40%', delay: '1.1s' },
  { left: '72%', top: '55%', delay: '0.6s' },
  { left: '86%', top: '30%', delay: '1.7s' },
]

// The tree house in teal moonlight, the way the source tints its night levels: the night sky and palms
// behind, the house on its stilts with a plank wall, a thatched roof and the lamp in the window, the
// ladder, and the night's leaves in the corners.
function NightHouse() {
  return (
    <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <NightSky />
      <path d="M-10 220 Q80 196 160 210 T420 200 V260 H-10 Z" fill={C.jungleDeep} />
      <path d="M44 132 Q40 190 48 260 H62 Q56 190 60 132 Z M122 132 Q126 190 118 260 H104 Q110 190 108 132 Z" fill={C.shadow} />
      <rect x="32" y="124" width="104" height="10" rx="3" fill={C.shadow} />
      <path d="M46 124 V84 H122 V124 Z" fill={C.shadow} />
      <path d="M50 92 H118 M50 102 H118 M50 112 H118" stroke={C.nightSky} strokeWidth="1.5" opacity="0.8" />
      <path d="M36 88 L84 50 L134 88 Z" fill={C.shadow} />
      <path d="M44 82 l-4 9 M58 76 l-3 12 M72 66 l-2 12 M96 66 l2 12 M110 76 l3 12 M124 82 l4 9" stroke={C.shadow} strokeWidth="3" />
      <path d="M84 50 L134 88 M122 84 V124 M108 132 Q110 190 104 260" fill="none" stroke={C.moon} strokeWidth="1.4" opacity="0.35" />
      <g opacity="0.14">
        <circle cx="83" cy="106" r="24" fill={C.lamp} className={night.window} />
      </g>
      <rect x="70" y="96" width="26" height="20" rx="3" fill={C.lamp} className={night.window} />
      <path d="M83 96 V116 M70 106 H96" stroke={C.shadow} strokeWidth="2.5" className={night.window} />
      <path d="M140 134 L152 260 M158 134 L170 260" stroke={C.shadow} strokeWidth="3" />
      {[156, 176, 196, 216, 236].map((y) => (
        <path key={y} d={`M${141 + (y - 134) * 0.095} ${y} H${159 + (y - 134) * 0.095}`} stroke={C.shadow} strokeWidth="3" />
      ))}
      <NightFront />
    </svg>
  )
}

export function TreehouseContact() {
  const { sections, navigation, jungle } = useLabels()
  const [finishes, setFinishes] = useState(0)
  const { active } = useProfession()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const id = headingId('jungle', sections.contact)

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={id} className={`relative z-20 px-4 pb-10 pt-16 ${night.contact}`}>
      <Backdrop kind="night" placement="band" />
      <div className="mx-auto grid max-w-6xl items-end gap-8 md:grid-cols-2">
        <div className={`relative h-72 overflow-hidden rounded-[2rem] border-4 border-[color:var(--tp-bark-dark)] sm:h-80 ${night.scene}`}>
          <ToneScope tone="night" className="absolute inset-0">
            <NightHouse />
          </ToneScope>
          {FIREFLIES.map((fly) => (
            <span
              key={fly.left}
              className={`absolute block h-2 w-2 rounded-full ${night.firefly}`}
              style={{ '--left': fly.left, '--top': fly.top, '--delay': fly.delay } as CSSProperties}
              aria-hidden="true"
            />
          ))}
          <div key={finishes} className="absolute inset-0">
            <EndTarget />
            <div className={`absolute bottom-3 left-[50%] h-28 w-20 ${night.roller}`} aria-hidden="true">
              <HeroCharacter profession={active} pose="roll" className={`absolute inset-0 h-full w-full ${night.ball}`} />
              <HeroCharacter profession={active} pose="idle" className={`absolute inset-0 h-full w-full ${night.standing}`} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFinishes((count) => count + 1)}
            className={`absolute left-3 top-3 min-h-[44px] rounded-xl px-4 text-sm ${look.button} ${look.buttonWood} ${look.focus}`}
          >
            {jungle.jumpAgain}
          </button>
        </div>

        <RecruiterHero
          render={({ line, actions }) => (
            <div className={`relative pt-10 ${night.hanger}`}>
              <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-10 w-full" aria-hidden="true" focusable="false">
                <path d="M40 0 Q34 20 40 40 M160 0 Q166 20 160 40" fill="none" stroke={C.moss} strokeWidth="4" />
              </svg>
              <div className={`rounded-3xl p-6 sm:p-8 ${look.board} ${night.sign}`}>
                <h2 id={id} className={`text-2xl uppercase text-[color:var(--tp-sun-gold)] sm:text-3xl ${look.display} ${look.outlined}`}>
                  {sections.contact}
                </h2>
                <p className="mt-4 text-base text-[color:var(--tp-parchment)]">{line}</p>
                <nav className="mt-6 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
                  {actions.map((action) => (
                    <JungleAction key={action.id} action={action} />
                  ))}
                  <JungleCVLink />
                </nav>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
