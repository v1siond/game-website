'use client'

import { useState, type CSSProperties } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useProfession } from '@/contexts/ProfessionContext'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { BarrelArt, MuzzleBurst } from './barrel'
import { JungleAction, JungleCVLink, JunglePortfolioLink } from './buttons'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import sunset from './sunset.module.css'

// The recruiter first screen as the opening of the level: a sunset drawn in five planes, the sky and the
// sun at the back, then a hazy ridge, the palms, his tree house on stilts and the near fronds, every
// plane but the sky a black shape against the light. The tree house barrel shakes, recoils with a white
// flash and blasts him out in an arc; he flies rolled into a spinning ball, lands with a squash in silhouette
// (only his clothes keep their colour), hoists a barrel and throws it off the scene, then his name drops onto the plank letter by letter and the headline
// and the actions rise beside it.
//
// Pattern: CSS off one trigger. useSectionTrigger sets data-on once; every phase is a delay off --fire
// (sunset.module.css: sun 0 to 1.4 s, shake from 0.3 s, fire at 0.9 s, flight 0.9 s, landing at 1.8 s,
// letters from 2 s 45 ms apart, the rest at 2.4 s). The barrel is a button: each click remounts the
// flight under a new key with data-again, which pulls --fire to 0.6 s, so the shake starts at once.
// The planes part with the pointer (--mx, --my from the world's root). Reduced motion shows him landed
// and the name in place.

// The scene is a 400 by 300 box drawn at 4:3, so a place in the drawing is the same percentage of the
// frame at every width.
const VIEW = '0 0 400 300'

function Sky() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill="url(#tp-sky)" />
      <g className={sunset.sun}>
        <circle cx="255" cy="196" r="130" fill="url(#tp-sun)" />
        <circle cx="255" cy="196" r="44" fill={C.sunCore} />
      </g>
      <path d="M60 70 q6 -5 12 0 q6 -5 12 0 M96 52 q4 -4 8 0 q4 -4 8 0 M318 64 q5 -4 10 0 q5 -4 10 0" fill="none" stroke={C.shadowSoft} strokeWidth="2" />
    </svg>
  )
}

function Ridge() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M-30 236 Q30 196 90 214 T200 202 T300 222 T430 196 V300 H-30 Z" fill={C.dusk} />
      <path d="M-30 250 Q60 228 140 240 T300 236 T430 230 V300 H-30 Z" fill={C.duskDeep} />
    </svg>
  )
}

// A palm: a bent trunk and a crown of drooping fronds, all one shape.
function Palm({ x, lean, height }: { x: number; lean: number; height: number }) {
  const top = 262 - height
  const crownX = x + lean
  return (
    <g>
      <path d={`M${x} 264 Q${x + lean * 0.2} ${top + height * 0.4} ${crownX} ${top}`} fill="none" stroke={C.shadowSoft} strokeWidth="7" strokeLinecap="round" />
      {[-150, -110, -60, -20, 25].map((angle) => (
        <path
          key={angle}
          d={`M${crownX} ${top} q22 -14 46 6 q-22 -6 -46 4 Z`}
          fill={C.shadowSoft}
          transform={`rotate(${angle} ${crownX} ${top})`}
        />
      ))}
    </g>
  )
}

function Palms() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <Palm x={318} lean={-24} height={150} />
      <Palm x={360} lean={18} height={118} />
      <Palm x={200} lean={14} height={96} />
      <path d="M-30 262 Q100 250 200 258 T430 254 V300 H-30 Z" fill={C.shadowSoft} />
    </svg>
  )
}

// His tree house on four stilts, a thatched roof, the doorway and the ladder; the barrel cannon stands on
// the platform's edge (drawn in the HTML layer above, so it can be a button).
function TreeHouse() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M30 160 Q24 220 34 300 H52 Q44 220 48 160 Z M118 160 Q124 220 116 300 H98 Q106 220 104 160 Z" fill={C.shadow} />
      <rect x="18" y="150" width="122" height="12" rx="3" fill={C.shadow} />
      <path d="M34 150 V104 H118 V150 Z" fill={C.shadow} />
      <path d="M22 108 L76 66 L132 108 Z" fill={C.shadow} />
      <path d="M26 108 l-6 8 M44 108 l-4 9 M62 108 l-3 9 M90 108 l3 9 M108 108 l4 9 M126 108 l6 8" stroke={C.shadow} strokeWidth="3" />
      <path d="M62 150 V120 Q62 112 70 112 H80 Q88 112 88 120 V150 Z" fill={C.dusk} opacity="0.55" />
      <path d="M130 162 L144 300 M150 162 L164 300" stroke={C.shadow} strokeWidth="3" />
      {[180, 200, 220, 240, 260, 280].map((y) => (
        <path key={y} d={`M${132 + (y - 162) * 0.1} ${y} H${152 + (y - 162) * 0.1}`} stroke={C.shadow} strokeWidth="3" />
      ))}
    </svg>
  )
}

function NearFronds() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M-10 300 Q30 250 90 262 Q60 270 40 300 Z M-10 300 Q10 230 60 214 Q30 250 24 300 Z" fill={C.shadow} />
      <path d="M410 300 Q360 240 300 256 Q340 266 356 300 Z M410 300 Q396 226 346 206 Q378 248 380 300 Z" fill={C.shadow} />
      <path d="M150 300 l6 -18 l4 18 M240 300 l5 -14 l5 14 M268 300 l3 -10 l4 10" fill={C.shadow} />
      <path d="M-10 0 Q40 20 70 0 Z M410 0 Q350 26 330 0 Z" fill={C.shadow} />
    </svg>
  )
}

function SunsetScene({ shot, onBlast, blastLabel }: { shot: number; onBlast: () => void; blastLabel: string }) {
  const { active } = useProfession()

  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-[color:var(--tp-bark-dark)] ${sunset.frame}`}>
      <Sky />
      <div className={`absolute inset-0 ${sunset.far}`}>
        <Ridge />
      </div>
      <div className={`absolute inset-0 ${sunset.mid}`}>
        <Palms />
      </div>
      <div className={`absolute inset-0 ${sunset.house}`}>
        <TreeHouse />
        <button
          type="button"
          onClick={onBlast}
          aria-label={blastLabel}
          className={`absolute left-[25%] top-[26%] w-[12%] rounded-full ${look.focus} ${sunset.cannon}`}
        >
          <span key={shot} className={`block ${sunset.recoil}`}>
            <BarrelArt mark="burst" className="block h-auto w-full" />
            <MuzzleBurst className={`absolute -top-[30%] left-1/2 w-[70%] ${sunset.burst}`} />
          </span>
        </button>
      </div>

      <div key={shot} className={`pointer-events-none absolute left-[62%] top-[62%] h-[24%] w-[12%] ${sunset.flightX}`} aria-hidden="true">
        <div className={`relative h-full w-full ${sunset.flightY}`}>
          <HeroCharacter profession={active} pose="roll" silhouette className={`absolute inset-0 h-full w-full ${sunset.inAir}`} />
          <div className={`absolute inset-0 ${sunset.land}`}>
            <HeroCharacter profession={active} pose="throw" delay="calc(var(--fire) + 1.3s)" silhouette className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className={`pointer-events-none absolute inset-0 ${sunset.near}`}>
        <NearFronds />
      </div>
    </div>
  )
}

/** His name on the plank, each letter dropping onto it; screen readers read it whole. */
function PlankName({ name }: { name: string }) {
  return (
    <>
      <span className="sr-only">{name}</span>
      <span aria-hidden="true">
        {Array.from(name).map((letter, i) => (
          <span key={i} className={sunset.letter} style={{ '--i': i } as CSSProperties}>
            {letter === ' ' ? ' ' : letter}
          </span>
        ))}
      </span>
    </>
  )
}

export function SunsetHero() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px' })
  const { navigation, jungle } = useLabels()
  const [shot, setShot] = useState(0)

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div
          ref={ref}
          data-on={triggered || undefined}
          data-again={shot > 0 || undefined}
          className={`mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12 ${sunset.hero}`}
        >
          <SunsetScene shot={shot} onBlast={() => setShot((count) => count + 1)} blastLabel={jungle.blastAgain} />

          <div className="text-center md:text-left">
            <h1 className={`inline-block rounded-2xl px-6 pb-4 pt-6 text-3xl uppercase text-[color:var(--tp-sun-gold)] sm:text-5xl ${look.board} ${look.display} ${look.outlined} ${sunset.plank}`}>
              <PlankName name={name} />
            </h1>
            <div className={sunset.after}>
              <p className={`mt-5 text-xl text-[color:var(--tp-parchment)] ${look.display}`}>{headline}</p>
              <p className="mt-2 text-base italic text-[color:var(--tp-sun-gold)]">{tagline}</p>
              <p className="mt-2 text-base text-[color:var(--tp-parchment)]">{line}</p>
              <nav className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start" aria-label={navigation.contactAndCv}>
                {actions.map((action) => (
                  <JungleAction key={action.id} action={action} />
                ))}
                <JungleCVLink />
                <JunglePortfolioLink />
              </nav>
            </div>
          </div>
        </div>
      )}
    />
  )
}
