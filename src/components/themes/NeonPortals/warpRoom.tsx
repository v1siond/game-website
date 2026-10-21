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
import { LevelPad } from './pad'
import { PORTAL } from './palette'
import { Crystal, MaskFace } from './pickups'
import { MaskCompanion } from './scoreBar'
import { useScore } from './score'
import room from './warpRoom.module.css'
import ui from './warped.module.css'

// The profession switch as the time machine's warp room (Warped's hub, named in code only), drawn as the
// game's first room: a round tower top floating in the night over a dark sea, a stone rim round a plank
// floor, crenellated towers either side, the boss gate at the back over the room's white pedestal, and
// three glossy blue level pads in the floor, one per profession.
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
    <button type="button" {...optionProps} data-selected={selected || undefined} className={`group relative flex w-[5.25rem] flex-col items-center focus:outline-none min-[375px]:w-24 sm:w-40 ${room.button}`}>
      <span className={`pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 flex w-40 flex-col items-center sm:w-48 ${room.hologram}`}>
        <span className={`relative block aspect-square w-28 overflow-hidden rounded-full border-[3px] border-[color:var(--np-void)] sm:w-36 ${room.orb}`} aria-hidden="true">
          <EraScene era={PROFESSION_ERA[id]} className="h-full w-full" />
          <span className={`absolute inset-0 rounded-full ${room.glass}`} />
        </span>
        <span className="mt-2 block rounded-xl border-[3px] border-[color:var(--np-void)] bg-[color:var(--np-void)] px-3 pb-1.5 pt-2 text-center shadow-[inset_0_0_0_2px_var(--np-seam)]">
          <span className={`block text-xl uppercase leading-none ${ui.display}`}>{label}</span>
          <span className="mt-1 block text-sm text-[color:var(--np-white)]">{professionFields[id]}</span>
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
      <span className={`relative -mt-6 block h-11 w-[5.25rem] min-[375px]:w-24 sm:w-32 ${room.pad}`} aria-hidden="true">
        <LevelPad label={PAD_NUMBER[id]} lit={selected} topClassName={room.padTop} className="h-full w-full" />
      </span>
      <span className={`mt-2 text-sm uppercase tracking-wide ${ui.chunk} ${selected ? PAD_TONE[id] : 'text-[color:var(--np-muted)]'}`} aria-hidden="true">
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

/** The boss gate at the back of the room over the white pedestal, its lamps lit one per crystal. */
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
      <svg viewBox="0 0 120 124" className="mt-1 h-28 w-28" aria-hidden="true" focusable="false">
        <ellipse cx="60" cy="114" rx="56" ry="9" fill={PORTAL.VOID} />
        <ellipse cx="60" cy="111" rx="52" ry="7.5" fill={PORTAL.PLATINUM} stroke={PORTAL.PAD_RING} strokeWidth="2" />
        <path d="M6 108 V40 Q60 -12 114 40 V108 Z" fill={PORTAL.STONE} stroke={PORTAL.VOID} strokeWidth="3" />
        <path d="M6 60 H22 M98 60 H114 M6 84 H22 M98 84 H114 M14 60 V84 M106 60 V84 M24 22 L32 34 M96 22 L88 34 M60 4 V18" stroke={PORTAL.STONE_DARK} strokeWidth="2" />
        <path d="M18 108 V44 Q60 6 102 44 V108 Z" fill={PORTAL.VOID} />
        <g className={room.doorLeaf}>
          <path d="M22 108 V46 Q40 24 60 22 V108 Z" fill={PORTAL.PLANK} stroke={PORTAL.VOID} strokeWidth="2" />
          <path d="M98 108 V46 Q80 24 60 22 V108 Z" fill={PORTAL.PLANK} stroke={PORTAL.VOID} strokeWidth="2" />
          <path d="M34 34 V108 M46 26 V108 M74 26 V108 M86 34 V108" stroke={PORTAL.PLANK_DARK} strokeWidth="1.6" />
          <path d="M22 54 H98 M22 94 H98" stroke={PORTAL.METAL_DARK} strokeWidth="5" />
          <path d="M22 54 H98 M22 94 H98" stroke={PORTAL.METAL} strokeWidth="1.4" opacity="0.7" />
        </g>
        <path d="M44 62 Q60 50 76 62 L72 80 Q60 88 48 80 Z" fill={PORTAL.MASK_WOOD} stroke={PORTAL.VOID} strokeWidth="2" />
        <circle cx="53" cy="67" r="3.4" fill={PORTAL.MASK_LIP} stroke={PORTAL.VOID} strokeWidth="1" />
        <circle cx="67" cy="67" r="3.4" fill={PORTAL.MASK_LIP} stroke={PORTAL.VOID} strokeWidth="1" />
        <path d="M51 77 H69" stroke={PORTAL.TOOTH} strokeWidth="2.4" strokeDasharray="3 1.6" />
      </svg>
      <span className={`mt-1 text-base uppercase tracking-wide text-[color:var(--np-gold)] ${ui.chunk}`}>{warp.bossDoor}</span>
      <span className={`text-base tabular-nums text-[color:var(--np-white)] ${ui.chunk}`}>
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
    <div className={`relative mt-10 aspect-[5/2] w-full overflow-hidden rounded-[2rem] border-[3px] border-[color:var(--np-void)] shadow-[0_6px_0_var(--np-void)] ${room.period}`} data-warp={warp} key={profession} aria-hidden="true">
      <EraScene era={PROFESSION_ERA[profession]} className="absolute inset-0 h-full w-full" />
      <div className="absolute bottom-[6%] left-1/2 h-[70%] w-[18%] -translate-x-1/2">
        <Bandicoot profession={profession} pose="act" className="h-full w-full" />
      </div>
    </div>
  )
}

/** The tower top's floor, stretched to the room's width: the stone rim, the plank floor inside it and the walkway coming in from the front. */
function Floor() {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-48 w-full sm:h-56" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="npr-floor">
          <ellipse cx="200" cy="150" rx="186" ry="46" />
        </clipPath>
      </defs>
      <ellipse cx="200" cy="168" rx="216" ry="64" fill={PORTAL.STONE_DARK} stroke={PORTAL.VOID} strokeWidth="3" />
      <ellipse cx="200" cy="152" rx="206" ry="56" fill={PORTAL.STONE} stroke={PORTAL.VOID} strokeWidth="2" />
      {[-150, -100, -50, 0, 50, 100, 150].map((dx) => (
        <path key={dx} d={`M${200 + dx * 1.3} ${206 - Math.abs(dx) * 0.12} V${190 - Math.abs(dx) * 0.2}`} stroke={PORTAL.VOID} strokeWidth="2" opacity="0.5" />
      ))}
      <ellipse cx="200" cy="150" rx="186" ry="46" fill={PORTAL.PLANK_FLOOR} stroke={PORTAL.VOID} strokeWidth="2" />
      <g clipPath="url(#npr-floor)" stroke={PORTAL.PLANK_FLOOR_DARK} strokeWidth="2">
        {[116, 128, 140, 152, 164, 176, 188].map((y) => (
          <path key={y} d={`M0 ${y} H400`} />
        ))}
      </g>
      <path d="M168 200 L176 190 H224 L232 200 Z" fill={PORTAL.PLANK_FLOOR} stroke={PORTAL.VOID} strokeWidth="2" />
      <path d="M150 200 L162 182 H172 L164 200 Z M250 200 L238 182 H228 L236 200 Z" fill={PORTAL.STONE_LIT} stroke={PORTAL.VOID} strokeWidth="2" />
    </svg>
  )
}

// One of the two crenellated stone towers at the back of the room; the right one wears the conical
// orange tile roof and the red banner, the left one a green banner with a gold crescent.
const TOWER_PLACE = { left: 'left-[1%]', right: 'right-[1%]' } as const

function Tower({ side }: { side: keyof typeof TOWER_PLACE }) {
  const roofed = side === 'right'

  return (
    <svg viewBox="0 0 80 200" preserveAspectRatio="xMidYMax meet" className={`absolute top-0 h-[62%] w-[16%] max-w-[7rem] ${TOWER_PLACE[side]}`} aria-hidden="true" focusable="false">
      {roofed ? (
        <path d="M4 58 L40 4 L76 58 Z" fill={PORTAL.ORANGE_DEEP} stroke={PORTAL.VOID} strokeWidth="2.5" strokeLinejoin="round" />
      ) : (
        <path d="M8 58 V40 H20 V50 H30 V40 H50 V50 H60 V40 H72 V58 Z" fill={PORTAL.STONE_LIT} stroke={PORTAL.VOID} strokeWidth="2.5" />
      )}
      {roofed && <path d="M16 40 H64 M26 24 H54" stroke={PORTAL.FRUIT_DEEP} strokeWidth="2" />}
      <rect x="10" y="58" width="60" height="142" fill={PORTAL.STONE} stroke={PORTAL.VOID} strokeWidth="2.5" />
      {[80, 104, 128, 152, 176].map((y, row) => (
        <path key={y} d={`M10 ${y} H70 M${row % 2 ? 30 : 40} ${y - 24} V${y} M${row % 2 ? 58 : 22} ${y - 24} V${y}`} stroke={PORTAL.STONE_DARK} strokeWidth="1.6" />
      ))}
      <path d="M37 92 H43 V100 H50 V106 H43 V122 H37 V106 H30 V100 H37 Z" fill={PORTAL.VOID} />
      <path d="M42 132 H62 V166 L52 158 L42 166 Z" fill={roofed ? PORTAL.TNT : PORTAL.LEAF_DARK} stroke={PORTAL.VOID} strokeWidth="1.6" />
      {roofed ? <path d="M46 140 H58 M46 148 H58" stroke={PORTAL.WHITE} strokeWidth="2.4" /> : <path d="M52 138 A6 6 0 1 0 52 150 A4.6 4.6 0 1 1 52 138 Z" fill={PORTAL.GOLD} />}
    </svg>
  )
}

export function WarpRoom({ profession }: { profession: Profession }) {
  const { navigation, warp: words } = useLabels()
  const warp = useEntry(profession)
  const maskOut = useHubMask(profession)

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className={`relative overflow-hidden rounded-[2rem] border-[3px] border-[color:var(--np-void)] px-2 pb-6 pt-6 ${room.room}`}>
        <Tower side="left" />
        <Tower side="right" />
        <Floor />
        <BossDoor />
        <p className={`relative mb-48 mt-3 text-center text-base uppercase tracking-[0.12em] text-[color:var(--np-gold)] sm:mb-56 ${ui.chunk}`}>{words.hubHint}</p>
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
