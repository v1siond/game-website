import type { ComponentType } from 'react'
import {
  BUNKER,
  CHROME,
  DUSK_LOW,
  DUSK_MID,
  DUSK_TOP,
  DUST,
  DUST_DARK,
  FAR_RIDGE,
  HAZE_LOW,
  HAZE_MID,
  HAZE_SUN,
  HAZE_TOP,
  INK,
  OLIVE_DARK,
  POLE,
  RUBBER,
  RUIN,
  RUST,
  SHELTER_BLUE,
  SHELTER_BLUE_DARK,
  SHELTER_YELLOW,
  SHOP_GREEN,
  SIGN_CREAM,
  STEEL,
  STEEL_EDGE,
  STEEL_LIGHT,
  STREET,
  STREET_LINE,
  WARNING_RED,
} from './palette'

// The three places of the walk out, each as the layers of a scene's stage (stage.tsx), on one 1440 by 900
// canvas: the shelter (the riveted blue wall, the pipe runs and bulkhead ribs, the big pipe with its valve
// wheel, the hazard stripe on the floor), the wasteland (the pale haze and its sun, the far ridge and the
// pylons, the bomb cloud and the dead trees, the dust) and the town at dusk (the ruins, the shops and their
// signs on the poles and wire, the street). `uid` keeps each stage's gradient ids its own.

export const VIEW = '0 0 1440 900'

/** A phone's view of the canvas: taller and from higher up, so the ground sits about half way down the
 *  screen; the near plane carries each place's floor on below the canvas (ZONE_FLOOR). */
export const PHONE_VIEW = '0 300 1440 1000'

export type Zone = 'shelter' | 'wasteland' | 'town'

interface ZoneArt {
  sky: ComponentType<{ uid: string }>
  far: ComponentType
  mid: ComponentType
  near: ComponentType<{ uid: string }>
}

// ---------------------------------------------------------------- the shelter

function ShelterSky({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`ra-wall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SHELTER_BLUE} />
          <stop offset="0.6" stopColor={SHELTER_BLUE_DARK} />
          <stop offset="1" stopColor={BUNKER} />
        </linearGradient>
        <pattern id={`ra-rivets-${uid}`} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M0 0 H48 M0 0 V48" stroke={INK} strokeOpacity={0.35} strokeWidth={2} />
          <circle cx={12} cy={12} r={2.5} fill={STEEL_EDGE} fillOpacity={0.55} />
        </pattern>
      </defs>
      <rect width={1440} height={900} fill={`url(#ra-wall-${uid})`} />
      <rect width={1440} height={900} fill={`url(#ra-rivets-${uid})`} />
    </>
  )
}

function ShelterFar() {
  return (
    <>
      {[120, 480, 840, 1200].map((x) => (
        <g key={x}>
          <rect x={x} y={0} width={46} height={900} fill={STEEL} />
          <rect x={x + 6} y={0} width={6} height={900} fill={STEEL_EDGE} opacity={0.35} />
          {[140, 420, 700].map((y) => (
            <circle key={y} cx={x + 23} cy={y} r={5} fill={STEEL_LIGHT} />
          ))}
        </g>
      ))}
      <rect x={0} y={70} width={1440} height={22} fill={STEEL_LIGHT} />
      <rect x={0} y={74} width={1440} height={4} fill={CHROME} opacity={0.25} />
      <rect x={0} y={110} width={1440} height={12} fill={SHELTER_BLUE_DARK} />
    </>
  )
}

function ShelterMid() {
  return (
    <g>
      <circle cx={115} cy={160} r={7} fill={WARNING_RED} />
      <rect x={1060} y={520} width={150} height={300} fill={STEEL} stroke={RUBBER} strokeWidth={3} />
      <path d="M1135 520 V820 M1072 560 H1123 M1147 560 H1198" stroke={RUBBER} strokeWidth={3} />
    </g>
  )
}

function ShelterNear({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`ra-pipe-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={STEEL_EDGE} />
          <stop offset="35%" stopColor={CHROME} />
          <stop offset="100%" stopColor={STEEL} />
        </linearGradient>
        <pattern id={`ra-hazard-${uid}`} width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width={18} height={36} fill={SHELTER_YELLOW} />
          <rect x={18} width={18} height={36} fill={INK} />
        </pattern>
      </defs>
      <rect x={0} y={12} width={1440} height={40} fill={`url(#ra-pipe-${uid})`} />
      {[200, 640, 1100].map((x) => (
        <rect key={x} x={x} y={6} width={24} height={52} rx={3} fill={STEEL_LIGHT} stroke={RUBBER} strokeWidth={2} />
      ))}
      <g transform="translate(1320 32)">
        <circle r={34} fill="none" stroke={WARNING_RED} strokeWidth={8} />
        <path d="M-34 0 H34 M0 -34 V34" stroke={WARNING_RED} strokeWidth={6} />
        <circle r={8} fill={RUBBER} />
      </g>
      <rect x={1380} y={40} width={34} height={860} fill={`url(#ra-pipe-${uid})`} />
      <path d="M0 830 H1440 V900 H0 Z" fill={OLIVE_DARK} />
      <rect y={822} width={1440} height={14} fill={`url(#ra-hazard-${uid})`} opacity={0.85} />
    </>
  )
}

// ---------------------------------------------------------------- the wasteland

function WastelandSky({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`ra-haze-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={HAZE_TOP} />
          <stop offset="55%" stopColor={HAZE_MID} />
          <stop offset="100%" stopColor={HAZE_LOW} />
        </linearGradient>
      </defs>
      <rect width={1440} height={900} fill={`url(#ra-haze-${uid})`} />
      <circle data-fx="sun" cx={1060} cy={300} r={70} fill={HAZE_SUN} opacity={0.55} />
    </>
  )
}

function WastelandFar() {
  return (
    <>
      <path d="M0 640 L120 600 L260 625 L420 585 L600 620 L780 590 L980 615 L1180 580 L1440 610 V900 H0 Z" fill={FAR_RIDGE} />
      {[180, 520, 1260].map((x) => (
        <path key={x} d={`M${x} 620 L${x + 14} 470 L${x + 28} 620 M${x + 4} 520 H${x + 24} M${x + 8} 490 H${x + 20}`} stroke={STEEL} strokeWidth={5} fill="none" />
      ))}
    </>
  )
}

function WastelandMid() {
  return (
    <>
      <g transform="translate(860 560)" fill={DUST_DARK}>
        <path d="M0 50 Q30 -10 60 50 Z" />
        <rect x={27} y={40} width={6} height={30} />
      </g>
      {[80, 330, 700, 1000, 1380].map((x) => (
        <path key={x} d={`M${x} 700 V600 M${x} 640 L${x - 18} 618 M${x} 625 L${x + 16} 605`} stroke={INK} strokeWidth={4} fill="none" opacity={0.7} />
      ))}
    </>
  )
}

function WastelandNear() {
  return (
    <>
      <path d="M0 720 Q360 690 720 715 T1440 705 V900 H0 Z" fill={DUST} />
      <path d="M0 800 Q400 770 800 790 T1440 785 V900 H0 Z" fill={DUST_DARK} />
    </>
  )
}

// ---------------------------------------------------------------- the town at dusk

function TownSky({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`ra-dusk-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={DUSK_TOP} />
          <stop offset="60%" stopColor={DUSK_MID} />
          <stop offset="100%" stopColor={DUSK_LOW} />
        </linearGradient>
      </defs>
      <rect width={1440} height={900} fill={`url(#ra-dusk-${uid})`} />
    </>
  )
}

const RUINS: ReadonlyArray<readonly [number, number, number]> = [
  [60, 380, 120],
  [220, 420, 80],
  [1180, 340, 110],
  [1320, 400, 90],
]

function TownFar() {
  return (
    <>
      {RUINS.map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height={900 - y} fill={RUIN} />
      ))}
    </>
  )
}

function TownMid() {
  return (
    <>
      <g fill={OLIVE_DARK} stroke={INK} strokeWidth={3}>
        <path d="M380 560 H600 V520 H560 V500 H420 V520 H380 Z" />
        <rect x={380} y={560} width={220} height={180} />
        <path d="M660 540 H860 V740 H660 Z" fill={RUST} />
        <path d="M900 520 L960 480 L1020 520 V740 H900 Z" fill={SHOP_GREEN} />
      </g>
      <rect x={430} y={510} width={120} height={30} fill={SIGN_CREAM} />
      <rect data-fx="neon" x={700} y={580} width={120} height={16} fill={WARNING_RED} />
      <path d="M948 560 L960 548 L972 560 L960 572 Z" fill={SIGN_CREAM} />
      {[340, 640, 1080].map((x) => (
        <path key={x} d={`M${x} 760 V470 M${x - 20} 490 H${x + 20}`} stroke={POLE} strokeWidth={6} />
      ))}
      <path d="M340 490 Q490 530 640 490 Q860 530 1080 490" stroke={INK} strokeWidth={2} fill="none" />
    </>
  )
}

function TownNear() {
  return (
    <>
      <path d="M0 740 H1440 V900 H0 Z" fill={STREET} />
      <path d="M0 760 H1440" stroke={STREET_LINE} strokeWidth={3} strokeDasharray="40 30" />
    </>
  )
}

export const ZONE_ART: Record<Zone, ZoneArt> = {
  shelter: { sky: ShelterSky, far: ShelterFar, mid: ShelterMid, near: ShelterNear },
  wasteland: { sky: WastelandSky, far: WastelandFar, mid: WastelandMid, near: WastelandNear },
  town: { sky: TownSky, far: TownFar, mid: TownMid, near: TownNear },
}

/** The ground line his boots stand on in each place, in the canvas's units. */
export const GROUND: Record<Zone, number> = { shelter: 826, wasteland: 790, town: 760 }

/** Each place's floor colour, carried on below the canvas on a phone's taller view. */
export const ZONE_FLOOR: Record<Zone, string> = { shelter: OLIVE_DARK, wasteland: DUST_DARK, town: STREET }
