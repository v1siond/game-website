'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Profession } from '@/lib/cv/professions'
import { StoneArch, StonePad, Swirl, type SwirlTone } from './art'
import { HeroCharacter } from './character'
import { ProfessionLevel } from './levels'
import { PORTAL } from './palette'
import world from './world.module.css'

// The profession switch as the platformer's warp room: a round stone hub under the night, one portal
// per profession in a carved arch, each swirling in its own colour on its own pad.
// - Pointing at (or focusing) a portal spins its swirl up and raises its hologram over the arch, the
//   profession and its field, the way the hub previews a level before you step in.
// - Stepping in (a click, Enter, or the arrows: ProfessionSwitch owns the pick and the keyboard) plays
//   the warp: the swirl of the picked portal fills the screen, he spins into it and shrinks away, a white
//   flash, and the new profession's level drops into place below the hub.
//
// The warp, phases from the pick (setTimeout, each a data-warp value the CSS keys on):
//   pull   0ms     the screen swirl grows out of the middle and turns; he spins and shrinks into it
//   flash  620ms   one white flash hides the swap
//   out    760ms   the swirl shrinks back to a point, the level below drops in with a bounce
//   off    1300ms  the overlay is gone
// The first render plays nothing; a pick replays it (derived from the pick during render, so no extra
// render runs). Reduced motion swaps the level with no warp.

const TONE: Record<Profession, SwirlTone> = { drummer: 'VIOLET', engineer: 'BLUE', fighter: 'GREEN' }
const GLOW: Record<Profession, string> = { drummer: PORTAL.VIOLET, engineer: PORTAL.BLUE, fighter: PORTAL.GREEN }
const TEXT: Record<Profession, string> = {
  drummer: 'text-[color:var(--np-violet)]',
  engineer: 'text-[color:var(--np-blue)]',
  fighter: 'text-[color:var(--np-green)]',
}

type Warp = 'off' | 'pull' | 'flash' | 'out'

const WARP_AT: ReadonlyArray<readonly [Warp, number]> = [
  ['flash', 620],
  ['out', 760],
  ['off', 1300],
]

/** The warp phase: 'pull' the moment the profession changes, then on through the timeline to 'off'. */
function useWarp(profession: Profession) {
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(profession)
  const [warp, setWarp] = useState<{ phase: Warp; from: Profession }>({ phase: 'off', from: profession })

  if (profession !== seen) {
    setSeen(profession)
    if (!reduced) setWarp({ phase: 'pull', from: seen })
  }

  useEffect(() => {
    if (warp.phase !== 'pull') return
    const timers = WARP_AT.map(([phase, at]) => window.setTimeout(() => setWarp((now) => ({ ...now, phase })), at))
    return () => timers.forEach(window.clearTimeout)
  }, [warp.phase])

  return warp
}

function PortalOption({ option }: { option: ProfessionOption }) {
  const { professionFields } = useLabels()
  const { id, label, selected, optionProps } = option

  return (
    <button
      type="button"
      {...optionProps}
      data-selected={selected || undefined}
      className={`group relative flex w-28 flex-col items-center focus:outline-none sm:w-40 ${world.portal}`}
    >
      <span className={`pointer-events-none absolute -top-14 left-1/2 z-10 w-max -translate-x-1/2 rounded-md border-2 border-current bg-[color:var(--np-void)]/90 px-3 py-1 text-center ${TEXT[id]} ${world.hologram}`}>
        <span className="block text-base font-black uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-[color:var(--np-muted)]">{professionFields[id]}</span>
      </span>
      <span className="relative block h-36 w-28 sm:h-48 sm:w-36" aria-hidden="true">
        <span className="absolute left-[18%] right-[18%] top-[22%] bottom-0 overflow-hidden rounded-t-full">
          <Swirl tone={TONE[id]} className={`h-full w-full ${world.portalSwirl}`} arms={world.swirlArms} />
        </span>
        <StoneArch glow={GLOW[id]} className="absolute inset-0 h-full w-full" />
      </span>
      <StonePad glow={GLOW[id]} className={`-mt-3 h-8 w-32 sm:w-44 ${world.pad}`} />
      <span className={`mt-2 text-sm font-black uppercase tracking-wide ${selected ? TEXT[id] : 'text-[color:var(--np-muted)]'}`} aria-hidden="true">
        {label}
      </span>
      <span className={`mt-1 h-1 w-10 rounded-full bg-current ${TEXT[id]} ${world.pickBar}`} aria-hidden="true" />
    </button>
  )
}

/** The screen sized warp: the picked portal's swirl, him spinning into it, the flash. */
function WarpOverlay({ warp, profession }: { warp: { phase: Warp; from: Profession }; profession: Profession }) {
  if (warp.phase === 'off') return null
  return (
    <div className={`pointer-events-none fixed inset-0 z-40 ${world.warp}`} data-warp={warp.phase} aria-hidden="true">
      <div className={`absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 ${world.warpSwirl}`}>
        <Swirl tone={TONE[profession]} className="h-full w-full" arms={world.swirlFast} />
      </div>
      <div className={`absolute left-1/2 top-1/2 h-48 w-32 -translate-x-1/2 -translate-y-1/2 ${world.warpHero}`}>
        <HeroCharacter profession={warp.from} className="h-full w-full" />
      </div>
      <div className={`absolute inset-0 bg-[color:var(--np-white)] ${world.warpFlash}`} />
    </div>
  )
}

const STARS = [
  [6, 12], [14, 30], [22, 8], [31, 22], [40, 6], [52, 18], [61, 9], [70, 26], [78, 5], [86, 16], [94, 28], [48, 32],
] as const

/** The hub floor: a round stone platform in depth, the portal pads set into it, the night above. */
function HubFloor() {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-40 w-full sm:h-48" aria-hidden="true" focusable="false">
      <ellipse cx="200" cy="96" rx="210" ry="40" fill={PORTAL.STONE_DARK} />
      <ellipse cx="200" cy="88" rx="200" ry="36" fill="url(#np-pad)" />
      {[150, 112, 74].map((rx) => (
        <ellipse key={rx} cx="200" cy="88" rx={rx} ry={rx * 0.18} fill="none" stroke={PORTAL.STONE_DARK} strokeWidth="1.5" />
      ))}
      {[-60, -30, 0, 30, 60].map((k) => (
        <line key={k} x1={200 + k * 0.6} y1="62" x2={200 + k * 3.2} y2="122" stroke={PORTAL.STONE_DARK} strokeWidth="1.2" />
      ))}
    </svg>
  )
}

export function WarpHub({ profession }: { profession: Profession }) {
  const { navigation, hud } = useLabels()
  const warp = useWarp(profession)

  return (
    <div className="relative">
      <div className={`relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border-4 border-[color:var(--np-stone-dark)] px-2 pb-6 pt-24 sm:pt-28 ${world.hub}`}>
        <div className={`pointer-events-none absolute inset-0 ${world.hubSky}`} aria-hidden="true">
          {STARS.map(([x, y], i) => (
            <span
              key={`${x}-${y}`}
              className={`absolute left-[var(--x)] top-[var(--y)] h-1 w-1 rounded-full bg-[color:var(--np-white)] ${i % 3 === 0 ? world.twinkle : ''}`}
              style={{ '--x': `${x}%`, '--y': `${y}%`, '--i': i } as CSSProperties}
            />
          ))}
        </div>
        <HubFloor />
        <p className="relative mb-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[color:var(--np-gold)]">{hud.hubHint}</p>
        <ProfessionSwitch
          className="relative flex items-end justify-center gap-1 sm:gap-10"
          label={navigation.profession}
          renderOption={(option) => <PortalOption option={option} />}
        />
      </div>
      <div className={`mt-10 ${world.levelDrop}`} data-warp={warp.phase} key={profession}>
        <ProfessionLevel profession={profession} />
      </div>
      <WarpOverlay warp={warp} profession={profession} />
    </div>
  )
}
