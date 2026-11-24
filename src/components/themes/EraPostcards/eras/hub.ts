import { HUB } from '../palette'
import { clouds, defs, fx, fxAll, glow, linear, radial, rect, ridge, r1, stars, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { share, type Era } from './era'
import type { Playhead } from '@/lib/scroll/player'

// The Chronoport, the hub of every era (the hero), and its night twin, the beacon (contact): the ring of
// the time portal over its platform, between floating isles; the swirl turns with the scroll. The hero plays
// two actions as the page opens: three crates float up off the platform and spin, then he looks up at the
// ring and reaches for it. The beacon plays two: a beam of light climbs out of the open ring, then he raises
// a hand to signal.

const ring = (id: string, open: boolean): string => `
  ${defs(
    linear(`${id}-ring`, [[0, HUB.ringCyan], [0.5, HUB.ringViolet], [1, HUB.ringOrange]], [0, 0, 1, 1]),
    radial(
      `${id}-core`,
      open
        ? [[0, HUB.coreOpen], [0.25, HUB.coreOpenMid], [0.6, HUB.coreOpenDeep, 0.85], [1, HUB.coreOpenEdge, 0.2]]
        : [[0, HUB.coreShut, 0.9], [0.3, HUB.coreShutMid, 0.8], [0.75, HUB.coreShutDeep, 0.7], [1, HUB.coreShutEdge, 0.2]],
    ),
  )}
  <circle cx="800" cy="470" r="280" fill="url(#${id}-core)"/>
  <g data-fx="swirl">${[0, 1, 2, 3, 4].map((i) => `<circle cx="800" cy="470" r="${60 + i * 46}" fill="none" stroke="${i % 2 ? HUB.ringCyan : HUB.swirlPink}" stroke-width="${3 + (i % 3)}" stroke-dasharray="${40 + i * 30} ${30 + i * 18}" opacity="${r1(0.75 - i * 0.1)}"/>`).join('')}</g>
  <circle cx="800" cy="470" r="292" fill="none" stroke="${HUB.ringShadow}" stroke-width="54"/>
  <circle cx="800" cy="470" r="292" fill="none" stroke="url(#${id}-ring)" stroke-width="20"/>
  <circle cx="800" cy="470" r="318" fill="none" stroke="${HUB.ringCyan}" stroke-width="2" opacity="0.6" stroke-dasharray="4 14"/>
  ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="788" y="160" width="24" height="34" rx="4" fill="${HUB.pod}" stroke="${HUB.swirlPink}" stroke-width="2" transform="rotate(${a} 800 470)"/>`).join('')}
  <path d="M560,640 Q520,760 470,850 L560,850 Q600,760 620,690 Z M1040,640 Q1080,760 1130,850 L1040,850 Q1000,760 980,690 Z" fill="${HUB.leg}"/>`

const PADS = [
  [HUB.ringCyan, 560],
  [HUB.swirlPink, 800],
  [HUB.isleLit, 1040],
] as const

const platform = (id: string): string => `
  ${defs(linear(`${id}-plat`, [[0, HUB.platTop], [1, HUB.platBottom]]))}
  <ellipse cx="800" cy="905" rx="640" ry="92" fill="url(#${id}-plat)"/>
  <ellipse cx="800" cy="880" rx="600" ry="70" fill="${HUB.platFace}" stroke="${HUB.ringCyan}" stroke-width="3"/>
  <ellipse cx="800" cy="880" rx="520" ry="56" fill="none" stroke="${HUB.swirlPink}" stroke-width="1.5" stroke-dasharray="10 10" opacity="0.7"/>
  ${PADS.map(([c, x]) => `<ellipse cx="${x}" cy="890" rx="70" ry="14" fill="${c}" opacity="0.25"/><ellipse cx="${x}" cy="888" rx="58" ry="10" fill="none" stroke="${c}" stroke-width="3"/>`).join('')}`

const isles = (fill: string, lit: string): string => `
  <g fill="${fill}"><path d="M120,420 h230 l-40,40 l-60,70 l-40,-60 Z"/><rect x="190" y="360" width="26" height="60"/><rect x="232" y="330" width="18" height="90"/><path d="M180,360 l23,-30 l23,30 Z"/>
  <path d="M1250,350 h260 l-50,50 l-70,80 l-40,-70 Z"/><rect x="1300" y="290" width="34" height="60"/><rect x="1350" y="260" width="20" height="90"/><circle cx="1440" cy="330" r="22"/></g>
  <g fill="${lit}"><rect x="196" y="372" width="5" height="7"/><rect x="238" y="345" width="5" height="7"/><rect x="1310" y="305" width="6" height="8"/><rect x="1355" y="280" width="5" height="7"/></g>`

const crate = (id: string, x: number, y: number, size: number): string => `
  <g data-fx="${id}" transform="translate(${x} ${y})">
    <rect x="${-size / 2}" y="${-size}" width="${size}" height="${size}" rx="3" fill="${HUB.crate}" stroke="${HUB.crateEdge}" stroke-width="3"/>
    <path d="M${-size / 2 + 5},${-size + 5} L${size / 2 - 5},-5 M${size / 2 - 5},${-size + 5} L${-size / 2 + 5},-5" stroke="${HUB.crateBrace}" stroke-width="5"/>
    <rect x="${-size / 2}" y="${-size}" width="${size}" height="${size}" rx="3" fill="none" stroke="${HUB.crateLight}" stroke-width="1.5" opacity="0.6"/>
  </g>`

const CRATES = [
  { id: 'bob-0', x: 430, y: 690, size: 56 },
  { id: 'bob-1', x: 1180, y: 640, size: 48 },
  { id: 'bob-2', x: 1300, y: 760, size: 40 },
] as const

// He stands on the middle pad, under the ring, and reaches up `t` of the way.
const heroPose = (t: number): Partial<Pose> => ({ x: 800, y: 878, scale: 1.4, head: -8 - t * 14, lean: -t * 6, shF: 12 + t * 120, elF: 14 + t * 20, scarf: t * 14 })

/** Crate i floated up `t` of the way. */
const bobOf = (i: number, t: number): string => `translate(${CRATES[i].x} ${CRATES[i].y}) translate(0 ${r1(-t * (60 + i * 40))}) rotate(${r1(t * (i % 2 ? 30 : -24))})`

export const hero: Era = {
  script: [1600, 2000],
  build: () => ({
    sky: svg(`${defs(linear('h-sky', [[0, HUB.skyTop], [0.45, HUB.skyMid], [0.75, HUB.skyLow], [1, HUB.skyHorizon]]))}${rect('url(#h-sky)')}${stars(11, 160, 520, HUB.star)}
      ${glow('h-sun', 800, 720, 520, HUB.sun, 0.7)}
      <g><circle cx="300" cy="190" r="64" fill="${HUB.planet}"/><circle cx="286" cy="176" r="64" fill="${HUB.planetLit}" opacity="0.55"/><ellipse cx="300" cy="190" rx="130" ry="20" fill="none" stroke="${HUB.planetRing}" stroke-width="5" transform="rotate(-18 300 190)" opacity="0.8"/></g>
      ${clouds(12, 7, [520, 660], HUB.cloud, 0.35)}`),
    far: svg(`${ridge(13, { y: 700, amp: 70, fill: HUB.ridgeFar })}${ridge(14, { y: 760, amp: 50, fill: HUB.ridgeNear })}${isles(HUB.isle, HUB.isleLit)}`),
    mid: svg(ring('h', false)),
    near: svg(`${platform('h')}${CRATES.map(({ id, x, y, size }) => crate(id, x, y, size)).join('')}`),
    figure: svg(`<g data-worlds-figure="">${courier(heroPose(1))}</g>`),
    fg: svg(`<path d="M-200,1000 L-200,820 Q60,800 180,880 Q260,940 360,1000 Z" fill="${HUB.ground}"/><path d="M1800,1000 L1800,800 Q1500,820 1420,900 Q1360,960 1300,1000 Z" fill="${HUB.ground}"/>
      <path d="M-200,860 Q300,990 700,1010" stroke="${HUB.ringCyan}" stroke-width="3" fill="none" opacity="0.5"/>`),
  }),
  bind: (stage) => {
    const j = joints(stage)
    const swirl = fx(stage, 'swirl')
    const bobs = fxAll(stage, 'bob-')
    return (p, play) => {
      tf(swirl, `rotate(${r1(p * 220)} 800 470)`)
      bobs.forEach((node, i) => tf(node, bobOf(i, share(play, 0))))
      setPose(j, heroPose(share(play, 1)))
    }
  },
}

// He raises a hand to signal, `raise` of the way.
const beaconPose = (raise: number): Partial<Pose> => ({ x: 800, y: 878, scale: 1.4, shF: 12 + raise * 160, elF: 14 - raise * 10, head: -raise * 14, scarf: raise * 20 })

/** The beam out of the ring, climbed `t` of the way. */
const beamOf = (t: number): string => `translate(800 880) scale(${r1(0.4 + t * 0.6)} ${r1(t)}) translate(-800 -880)`

const beaconAt = (play: Playhead): { beam: number; raise: number } => ({ beam: share(play, 0), raise: share(play, 1) })

export const beacon: Era = {
  script: [1800, 1600],
  build: () => ({
    sky: svg(`${defs(linear('bc-sky', [[0, HUB.nightTop], [0.6, HUB.nightMid], [1, HUB.nightLow]]), linear('bc-aur', [[0, HUB.aurora, 0], [0.5, HUB.aurora, 0.32], [1, HUB.ringCyan, 0]], [0, 0, 1, 0]))}${rect('url(#bc-sky)')}${stars(91, 300, 700, HUB.nightStar)}
      <g data-fx="aurora"><path d="M-400,260 Q0,140 400,240 T1200,220 T2000,240 L2000,320 Q1600,300 1200,320 T400,330 T-400,340 Z" fill="url(#bc-aur)"/></g>`),
    far: svg(`${ridge(92, { y: 760, amp: 60, fill: HUB.nightRidge })}${isles(HUB.nightIsle, HUB.ringCyan)}`),
    mid: svg(`${defs(linear('bc-beam', [[0, HUB.beam, 0], [0.5, HUB.beamCore, 0.75], [1, HUB.beam, 0]], [0, 0, 1, 0]))}<g data-fx="beam" transform="${beamOf(1)}"><rect x="660" y="-200" width="280" height="1080" fill="url(#bc-beam)" opacity="0.7"/><rect x="760" y="-200" width="80" height="1080" fill="url(#bc-beam)"/></g>${ring('bc', true)}`),
    near: svg(platform('bc')),
    figure: svg(courier(beaconPose(1))),
    fg: svg(`<path d="M-200,1000 L-200,840 Q80,820 200,900 Q260,950 320,1000 Z" fill="${HUB.nightGround}"/><path d="M1800,1000 L1800,820 Q1500,840 1420,910 Q1370,960 1330,1000 Z" fill="${HUB.nightGround}"/>`),
  }),
  bind: (stage) => {
    const j = joints(stage)
    const [beam, aurora, swirl] = ['beam', 'aurora', 'swirl'].map((name) => fx(stage, name))
    return (p, play) => {
      const { beam: climbed, raise } = beaconAt(play)
      tf(beam, beamOf(climbed))
      tf(aurora, `translate(${r1(-p * 300)} 0)`)
      tf(swirl, `rotate(${r1(-p * 260)} 800 470)`)
      setPose(j, beaconPose(raise))
    }
  },
}
