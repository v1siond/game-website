'use client'

import { useState, type CSSProperties } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useProfession } from '@/contexts/ProfessionContext'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { NameWords } from '@/components/cv/NameWords'
import { BarrelArt, MuzzleBurst } from './barrel'
import { JungleAction, JungleCVLink, JunglePortfolioLink } from './buttons'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import { ToneScope } from './scenery'
import look from './jungle.module.css'
import scenery from './scenery.module.css'
import sunset from './sunset.module.css'

// The recruiter first screen as the opening of the level: a sunset drawn in five planes, the stepped sky
// and the sun at the back, then the banded treeline in haze, the palms, his tree house on stilts and the
// near fronds, every plane but the sky a black shape against the light with its sunward edges lit
// (the scenery's shapes in the sunset tone). The tree house barrel shakes, recoils with a white
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

// The sky in the flat steps the source's sunsets are painted in, the sun swelling behind streaks of
// cloud, and birds.
const SKY_STEPS = [0, 24, 48, 72, 96, 120, 144, 168, 192, 216]
const CLOUD_STREAKS: ReadonlyArray<readonly [number, number, number]> = [
  // x, y, width
  [170, 168, 150],
  [210, 182, 120],
  [150, 214, 190],
]

function Sky() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill="url(#tp-sky)" />
      {SKY_STEPS.map((y) => (
        <rect key={y} y={y + 12} width="400" height="12" fill={C.shadow} opacity="0.07" />
      ))}
      <g className={sunset.sun}>
        <circle cx="255" cy="196" r="130" fill="url(#tp-sun)" />
        <circle cx="255" cy="196" r="44" fill={C.sunCore} />
      </g>
      {CLOUD_STREAKS.map(([x, y, width]) => (
        <rect key={y} x={x} y={y} width={width} height="5" rx="2.5" fill={C.dusk} opacity="0.55" />
      ))}
      <path d="M60 70 q6 -5 12 0 q6 -5 12 0 M96 52 q4 -4 8 0 q4 -4 8 0 M318 64 q5 -4 10 0 q5 -4 10 0" fill="none" stroke={C.shadowSoft} strokeWidth="2" />
    </svg>
  )
}

// The far jungle: the banded treeline in the dusk's purple haze over a low ridge.
function Ridge() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <use href="#tp-treeline" transform="translate(-20 178) scale(1.1 0.9)" />
      <path d="M-30 250 Q60 228 140 240 T300 236 T430 230 V300 H-30 Z" fill={C.duskDeep} />
    </svg>
  )
}

// The palms, black against the light with the sun catching their edges; the one furthest off in haze.
function Palms() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <use href="#tp-palm" transform="translate(200 262) rotate(5) scale(0.55)" className={scenery.haze} />
      <use href="#tp-palm" transform="translate(318 266) rotate(-9) scale(0.86)" />
      <use href="#tp-palm" transform="translate(362 266) rotate(7) scale(0.68)" />
      <path d="M-30 262 Q100 250 200 258 T430 254 V300 H-30 Z" fill={C.shadowSoft} />
    </svg>
  )
}

// His tree house on four stilts: a plank wall, a thatched roof, the doorway and the ladder, every edge
// that faces the sun lit; the barrel cannon stands on the platform's edge (drawn in the HTML layer above,
// so it can be a button).
function TreeHouse() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M30 160 Q24 220 34 300 H52 Q44 220 48 160 Z M118 160 Q124 220 116 300 H98 Q106 220 104 160 Z" fill={C.shadow} />
      <rect x="18" y="150" width="122" height="12" rx="3" fill={C.shadow} />
      <path d="M34 150 V104 H118 V150 Z" fill={C.shadow} />
      <path d="M38 114 H114 M38 126 H114 M38 138 H114" stroke={C.shadowSoft} strokeWidth="2" />
      <path d="M22 108 L76 66 L132 108 Z" fill={C.shadow} />
      <path d="M40 98 L50 90 M56 86 L64 80 M88 80 L96 86 M104 90 L114 98" stroke={C.shadowSoft} strokeWidth="2" />
      <path d="M26 108 l-6 8 M44 108 l-4 9 M62 108 l-3 9 M90 108 l3 9 M108 108 l4 9 M126 108 l6 8" stroke={C.shadow} strokeWidth="3" />
      <path d="M62 150 V120 Q62 112 70 112 H80 Q88 112 88 120 V150 Z" fill={C.dusk} opacity="0.55" />
      <path d="M76 66 L132 108 M118 104 V150 M18 150 H140 M118 160 Q124 220 116 300" fill="none" stroke={C.sunsetOrange} strokeWidth="1.6" opacity="0.6" />
      <path d="M130 162 L144 300 M150 162 L164 300" stroke={C.shadow} strokeWidth="3" />
      {[180, 200, 220, 240, 260, 280].map((y) => (
        <path key={y} d={`M${132 + (y - 162) * 0.1} ${y} H${152 + (y - 162) * 0.1}`} stroke={C.shadow} strokeWidth="3" />
      ))}
    </svg>
  )
}

// The leaves right in front, out of the light: fronds and round leaves in the corners, a fern tuft,
// fronds hanging into the top corners.
function NearFronds() {
  return (
    <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <use href="#tp-frond" transform="translate(-10 300) rotate(-40) scale(1.1)" />
      <use href="#tp-broad" transform="translate(34 286) rotate(10) scale(0.9)" />
      <use href="#tp-frond" transform="translate(410 300) scale(-1 1) rotate(-40)" />
      <use href="#tp-broad" transform="translate(378 290) rotate(-12) scale(0.7)" />
      <use href="#tp-fern" transform="translate(210 300) scale(0.45)" />
      <use href="#tp-frond" transform="translate(-10 -4) rotate(24) scale(0.85)" />
      <use href="#tp-frond" transform="translate(410 -4) scale(-1 1) rotate(28) scale(0.75)" />
    </svg>
  )
}

function SunsetScene({ shot, onBlast, blastLabel }: { shot: number; onBlast: () => void; blastLabel: string }) {
  const { active } = useProfession()

  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-[color:var(--tp-bark-dark)] ${sunset.frame}`}>
      <ToneScope tone="sunset" className="absolute inset-0">
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
      </ToneScope>
    </div>
  )
}

/** His name on the plank, each letter dropping onto it; screen readers read it whole. */
function PlankName({ name }: { name: string }) {
  return (
    <>
      <span className="sr-only">{name}</span>
      <span aria-hidden="true">
        <NameWords
          name={name}
          letter={(letter, i) => (
            <span className={sunset.letter} style={{ '--i': i } as CSSProperties}>
              {letter}
            </span>
          )}
        />
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
            <h1 className={`inline-block rounded-2xl px-6 pb-4 pt-6 text-[clamp(1.5rem,7.5vw,3rem)] uppercase text-[color:var(--tp-sun-gold)] md:text-[clamp(1.75rem,3.75vw,3rem)] ${look.board} ${look.display} ${look.outlined} ${sunset.plank}`}>
              <PlankName name={name} />
            </h1>
            <div className={`mt-6 rounded-3xl px-5 pb-6 pt-1 ${look.board} ${sunset.after}`}>
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
