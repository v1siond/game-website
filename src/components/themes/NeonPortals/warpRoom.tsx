'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { Bandicoot } from './bandicoot'
import { Blast, Planks, PopUp } from './burst'
import { CrateArt } from './crateArt'
import { EraScene, PROFESSION_ERA } from './eras'
import { PORTAL } from './palette'
import { Crystal, MaskFace } from './pickups'
import { MaskCompanion } from './scoreBar'
import { useScore } from './score'
import room from './warpRoom.module.css'

// The profession switch as the time machine's warp room (Warped's hub, named in code only): a round
// plated floor under the great clock, three level buttons set into it, one per profession, and the
// boss door at the back.
// - Each level button carries a round hologram above it showing the time period it warps to (the
//   engineer's neon future city, the musician's Arabian night, the fighter's great wall). Pointing at
//   or focusing a button opens its hologram with the profession and its field, the way the game shows a
//   level's preview before you step in.
// - He stands on the picked button. Picking another (a click, Enter, or the arrows: ProfessionSwitch
//   owns the pick and the keyboard) plays the game's level entry: he double jumps across and body slams
//   the new button, which breaks the mask crate by it the first time (the second mask), then the warp
//   tunnel fills the screen, a white flash, and the new period opens below the room with him at work in
//   it (typing, drumming, kicking).
// - The boss door at the back links to the contact; one lamp over it lights per crystal taken from the
//   job levels, so the door shows how far through the warp room the visitor is.
//
// The entry, phases from the pick (setTimeout, each a data-warp value the CSS keys on):
//   slam   0ms     he lands on the new button with a slam and a shockwave
//   pull   560ms   the tunnel's rings stream out toward the camera
//   flash  1150ms  one white flash hides the swap
//   out    1280ms  the tunnel thins away, the new period drops in below with a bounce
//   off    1700ms  the overlay is gone
// The first render plays nothing; reduced motion swaps with no entry.

type Warp = 'off' | 'slam' | 'pull' | 'flash' | 'out'

const WARP_AT: ReadonlyArray<readonly [Warp, number]> = [
  ['pull', 560],
  ['flash', 1150],
  ['out', 1280],
  ['off', 1700],
]

const PAD_TONE: Record<Profession, string> = {
  engineer: 'text-[color:var(--np-teal)]',
  drummer: 'text-[color:var(--np-violet)]',
  fighter: 'text-[color:var(--np-green)]',
}

// The pad's number, in the switch's order, painted on the pad as the hub's level pads carry theirs.
const PAD_NUMBER: Record<Profession, number> = { engineer: 1, drummer: 2, fighter: 3 }

/** The entry phase: 'slam' the moment the profession changes, then on through the timeline to 'off'. */
function useEntry(profession: Profession) {
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(profession)
  const [warp, setWarp] = useState<Warp>('off')

  if (profession !== seen) {
    setSeen(profession)
    if (!reduced) setWarp('slam')
  }

  useEffect(() => {
    if (warp !== 'slam') return
    const timers = WARP_AT.map(([phase, at]) => window.setTimeout(() => setWarp(phase), at))
    return () => timers.forEach(window.clearTimeout)
  }, [warp])

  return warp
}

/** The mask crate by the buttons: the first slam onto a new button breaks it, and the mask is his. */
function useHubMask(profession: Profession) {
  const { addMask } = useScore()
  const [start] = useState(profession)
  const [broken, setBroken] = useState(false)

  if (profession !== start && !broken) setBroken(true)

  useEffect(() => {
    if (broken) addMask('hub')
  }, [broken, addMask])

  return broken
}

function LevelButton({ option, warp }: { option: ProfessionOption; warp: Warp }) {
  const { professionFields } = useLabels()
  const { id, label, selected, optionProps } = option

  return (
    <button type="button" {...optionProps} data-selected={selected || undefined} className={`group relative flex w-24 flex-col items-center focus:outline-none sm:w-40 ${room.button}`}>
      <span className={`pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 flex w-40 flex-col items-center sm:w-48 ${room.hologram}`}>
        <span className={`block aspect-square w-28 overflow-hidden rounded-full border-4 border-current sm:w-36 ${PAD_TONE[id]} ${room.orb}`} aria-hidden="true">
          <EraScene era={PROFESSION_ERA[id]} className="h-full w-full" />
        </span>
        <span className={`mt-2 block rounded-md border-2 border-current bg-[color:var(--np-void)] px-3 py-1 text-center ${PAD_TONE[id]}`}>
          <span className="block text-base font-black uppercase tracking-wide">{label}</span>
          <span className="block text-sm text-[color:var(--np-white)]">{professionFields[id]}</span>
        </span>
      </span>
      <span className="relative block h-28 w-full sm:h-36" aria-hidden="true">
        {selected && (
          <span className={`absolute bottom-[18%] left-1/2 block h-full w-[70%] -translate-x-1/2 ${room.standing}`} data-warp={warp}>
            {warp === 'slam' && <Blast tone="slam" />}
            <Bandicoot profession={id} pose={warp === 'slam' ? 'slam' : 'idle'} className="h-full w-full" />
            <MaskCompanion />
          </span>
        )}
      </span>
      <span className={`relative -mt-6 block h-10 w-24 sm:w-32 ${room.pad}`} aria-hidden="true">
        <svg viewBox="0 0 120 40" className="h-full w-full" focusable="false">
          <ellipse cx="60" cy="26" rx="58" ry="13" fill={PORTAL.BRASS_DARK} />
          <g className={room.padTop}>
            <ellipse cx="60" cy="20" rx="54" ry="12" fill={PORTAL.PAD} stroke={selected ? PORTAL.GOLD : PORTAL.VOID} strokeWidth={selected ? 3 : 2} />
            <ellipse cx="60" cy="18" rx="36" ry="7" fill="none" stroke={PORTAL.WHITE} strokeWidth="1.5" opacity="0.5" />
            <text x="60" y="25" textAnchor="middle" fontFamily="'Arial Black', system-ui, sans-serif" fontSize="15" fontStyle="italic" fontWeight="900" fill={PORTAL.WHITE}>
              {PAD_NUMBER[id]}
            </text>
          </g>
        </svg>
      </span>
      <span className={`mt-2 text-sm font-black uppercase tracking-wide ${selected ? PAD_TONE[id] : 'text-[color:var(--np-muted)]'}`} aria-hidden="true">
        {label}
      </span>
    </button>
  )
}

/** The screen sized warp tunnel: rings streaming toward the camera, then the flash. */
function Tunnel({ warp }: { warp: Warp }) {
  if (warp === 'off' || warp === 'slam') return null
  return (
    <div className={`pointer-events-none fixed inset-0 z-40 ${room.tunnel}`} data-warp={warp} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`absolute left-1/2 top-1/2 h-[30vmax] w-[30vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5vmax] ${i % 2 ? 'border-[color:var(--np-blue)]' : 'border-[color:var(--np-teal)]'} ${room.tunnelRing}`}
          style={{ '--i': i } as CSSProperties}
        />
      ))}
      <div className={`absolute inset-0 bg-[color:var(--np-white)] ${room.flash}`} />
    </div>
  )
}

/** The boss door at the back of the room, its lamps lit one per crystal. */
function BossDoor() {
  const { warp } = useLabels()
  const { score } = useScore()
  const { crystals } = score.counts
  const total = score.totals.crystals

  return (
    <a href="#contact" className={`group relative mx-auto flex w-36 flex-col items-center focus:outline-none ${room.door}`}>
      <span className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`block h-5 w-4 ${i < crystals ? '' : 'opacity-30'}`}>
            <Crystal className="h-full w-full" />
          </span>
        ))}
      </span>
      <svg viewBox="0 0 120 110" className="mt-1 h-24 w-28" aria-hidden="true" focusable="false">
        <path d="M10 108 V40 Q60 -8 110 40 V108 Z" fill={PORTAL.STONE_DARK} stroke={PORTAL.VOID} strokeWidth="3" />
        <g className={room.doorLeaf}>
          <path d="M22 108 V44 Q40 22 60 20 V108 Z" fill={PORTAL.PLATE} stroke={PORTAL.BRASS} strokeWidth="2" />
          <path d="M98 108 V44 Q80 22 60 20 V108 Z" fill={PORTAL.PLATE} stroke={PORTAL.BRASS} strokeWidth="2" />
        </g>
        <path d="M44 60 Q60 48 76 60 L72 78 Q60 86 48 78 Z" fill={PORTAL.MASK_DARK} stroke={PORTAL.BRASS} strokeWidth="2" />
        <circle cx="53" cy="65" r="3" fill={PORTAL.FRUIT_RED} />
        <circle cx="67" cy="65" r="3" fill={PORTAL.FRUIT_RED} />
      </svg>
      <span className="mt-1 text-sm font-black uppercase tracking-wide text-[color:var(--np-gold)]">{warp.bossDoor}</span>
      <span className="text-sm tabular-nums text-[color:var(--np-white)]">
        {crystals}/{total}
      </span>
      <span className="sr-only">
        {warp.toContact}, {fillLabel(warp.crystalScore, { count: crystals, total })}
      </span>
    </a>
  )
}

/** The period the picked button warps to, opened below the room, him at work in it. */
function Period({ profession, warp }: { profession: Profession; warp: Warp }) {
  return (
    <div className={`relative mt-10 aspect-[5/2] w-full overflow-hidden rounded-[2rem] border-4 border-[color:var(--np-plate)] ${room.period}`} data-warp={warp} key={profession} aria-hidden="true">
      <EraScene era={PROFESSION_ERA[profession]} className="absolute inset-0 h-full w-full" />
      <div className="absolute bottom-[6%] left-1/2 h-[70%] w-[18%] -translate-x-1/2">
        <Bandicoot profession={profession} pose="act" className="h-full w-full" />
      </div>
    </div>
  )
}

export function WarpRoom({ profession }: { profession: Profession }) {
  const { navigation, warp: words } = useLabels()
  const warp = useEntry(profession)
  const maskOut = useHubMask(profession)

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className={`relative overflow-hidden rounded-[2rem] border-4 border-[color:var(--np-plate)] px-2 pb-6 pt-6 ${room.room}`}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-44 w-full sm:h-52" aria-hidden="true" focusable="false">
          <ellipse cx="200" cy="170" rx="220" ry="60" fill={PORTAL.STONE_DARK} />
          <ellipse cx="200" cy="160" rx="205" ry="54" fill={PORTAL.PLATE} />
          {[160, 120, 80].map((rx) => (
            <ellipse key={rx} cx="200" cy="160" rx={rx} ry={rx * 0.26} fill="none" stroke={PORTAL.TEAL_DEEP} strokeWidth="2" />
          ))}
        </svg>
        <BossDoor />
        <p className="relative mb-48 mt-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[color:var(--np-gold)] sm:mb-56">{words.hubHint}</p>
        <ProfessionSwitch
          className="relative flex items-end justify-center gap-1 sm:gap-10"
          label={navigation.profession}
          renderOption={(option) => <LevelButton option={option} warp={warp} />}
        />
        <div className="absolute bottom-[10%] right-[6%] h-14 w-14 sm:h-16 sm:w-16" aria-hidden="true">
          {maskOut ? (
            <>
              <Planks />
              <PopUp className="inset-0">
                <MaskFace className="h-full w-full" feathers={4} />
              </PopUp>
            </>
          ) : (
            <CrateArt kind="mask" className="h-full w-full" />
          )}
        </div>
      </div>
      <Period profession={profession} warp={warp} />
      <Tunnel warp={warp} />
    </div>
  )
}
