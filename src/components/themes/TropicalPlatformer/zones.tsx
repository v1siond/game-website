import { memo, useId, type ComponentType } from 'react'
import { COLORS as C, type Tone } from './palette'
import paint from './scenery.module.css'

// The jungle's places on the stages, one per light of the run: the sunset, the day jungle, the misty giant
// tree, the dusk and the night. Each is four planes on a 1440 by 1080 canvas, painted from the scenery's
// shapes (scenery.tsx) in the place's tone: the sky, the banded treeline far off, the palms and the ground
// he stands on, the leaves in front. The scene's own stops stand on the ground in the figure plane.

export const VIEW = '0 0 1440 1080'

/** The ground line he stands on. */
export const GROUND = 900

export type Zone = Tone

export interface ZoneArt {
  sky: ComponentType
  far: ComponentType
  mid: ComponentType
  near: ComponentType
}

/** The sky, its tone's high colour down to the horizon, with the zone's light in it. */
function skyOf(light: 'sun' | 'moon' | null): ComponentType {
  return memo(function Sky() {
    const id = useId()
    return (
      <>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={paint.skyHigh} />
            <stop offset="0.75" className={paint.skyLow} />
          </linearGradient>
        </defs>
        <rect width={1440} height={1080} fill={`url(#${id})`} />
        {light === 'sun' && <circle cx={980} cy={700} r={170} fill={C.sunCore} opacity={0.6} />}
        {light === 'moon' && <circle cx={1120} cy={200} r={60} fill={C.moon} />}
      </>
    )
  })
}

const Far = memo(function Far() {
  return (
    <>
      {[0, 400, 800, 1200].map((x) => (
        <use key={x} href="#tp-treeline" transform={`translate(${x - 120} 560) scale(1.1 3.6)`} />
      ))}
    </>
  )
})

// The palms at both sides and the ground band: the stage's middle stays open for the stops.
const PALMS: ReadonlyArray<readonly [number, number, number]> = [
  // x, scale, lean
  [90, 2.4, -6],
  [260, 1.6, 5],
  [1240, 1.9, 6],
  [1390, 2.6, -4],
]

const Mid = memo(function Mid() {
  return (
    <>
      {PALMS.map(([x, scale, lean]) => (
        <use key={x} href="#tp-palm" transform={`translate(${x} ${GROUND + 6}) rotate(${lean}) scale(${scale})`} className={scale < 2 ? paint.haze : undefined} />
      ))}
      <path d={`M0 ${GROUND - 6} Q360 ${GROUND - 22} 720 ${GROUND - 4} T1440 ${GROUND - 8} V1080 H0 Z`} className={paint.leafShade} />
      <path d={`M0 ${GROUND - 6} Q360 ${GROUND - 22} 720 ${GROUND - 4} T1440 ${GROUND - 8}`} className={paint.rim} strokeWidth={4} opacity={0.5} />
    </>
  )
})

const Near = memo(function Near() {
  return (
    <>
      <use href="#tp-frond" transform="translate(-30 1080) rotate(-40) scale(3)" />
      <use href="#tp-broad" transform="translate(110 1060) rotate(10) scale(2.4)" />
      <use href="#tp-frond" transform="translate(1470 1080) scale(-1 1) rotate(-40) scale(3)" />
      <use href="#tp-fern" transform="translate(1330 1080) scale(1.2)" />
      <use href="#tp-frond" transform="translate(-30 -10) rotate(30) scale(2.4)" />
      <use href="#tp-frond" transform="translate(1470 -10) scale(-1 1) rotate(32) scale(2.2)" />
    </>
  )
})

const SKY: Record<Zone, 'sun' | 'moon' | null> = { sunset: 'sun', dusk: 'sun', jungle: null, treetop: null, night: 'moon' }

const zoneArt = (zone: Zone): ZoneArt => ({ sky: skyOf(SKY[zone]), far: Far, mid: Mid, near: Near })

export const ZONE_ART: Record<Zone, ZoneArt> = {
  sunset: zoneArt('sunset'),
  dusk: zoneArt('dusk'),
  jungle: zoneArt('jungle'),
  treetop: zoneArt('treetop'),
  night: zoneArt('night'),
}
