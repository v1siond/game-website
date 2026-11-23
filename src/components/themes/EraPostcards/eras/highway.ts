import { HIGHWAY } from '../palette'
import { defs, fx, fxAll, glow, linear, rect, r1, stars, stripedSun, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import type { Era } from './era'

// Work: the desert highway, 1957. A time trial on a hover bike: a mile sign per job carries the year it
// started and passes by as its card is read; the stopwatch hand runs, the mesas, the poles and the road
// slide at three speeds, a tumbleweed rolls across. He sits on the bike's saddle with both hands on its
// steering wheel: the saddle and the wheel are drawn behind him, the hull in front of his legs.

const poles = Array.from({ length: 16 }, (_, i) => {
  const x = -200 + i * 260
  return `<rect x="${x}" y="520" width="8" height="240" fill="${HIGHWAY.pole}"/><rect x="${x - 26}" y="540" width="60" height="6" fill="${HIGHWAY.pole}"/>
    <path d="M${x - 22},546 Q${x + 110},600 ${x + 238},546" stroke="${HIGHWAY.pole}" stroke-width="2" fill="none"/>`
}).join('')

const cacti = Array.from({ length: 10 }, (_, i) => {
  const x = 60 + i * 360 + (i % 3) * 40
  return `<g fill="${HIGHWAY.cactus}" transform="translate(${x} 790)"><rect x="-10" y="-110" width="20" height="110" rx="10"/><path d="M-10,-60 h-22 v-30 a8,8 0 0 1 16,0 v18 h6 Z M10,-70 h22 v-26 a8,8 0 0 0 -16,0 v14 h-6 Z"/></g>`
}).join('')

const dashes = Array.from({ length: 40 }, (_, i) => `<rect x="${i * 160}" y="872" width="80" height="8" rx="3" fill="${HIGHWAY.roadDash}"/>`).join('')

// The saddle under his hips (about 838,768) and the wheel at his hands (about 930,747) for the RIDE pose.
export const cockpit = `<g data-fx="bike-cockpit">
  <path d="M942,750 L984,810" stroke="${HIGHWAY.wheel}" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="934" cy="744" rx="8" ry="25" transform="rotate(-24 934 744)" fill="none" stroke="${HIGHWAY.wheel}" stroke-width="7"/>
  <ellipse cx="934" cy="744" rx="8" ry="25" transform="rotate(-24 934 744)" fill="none" stroke="${HIGHWAY.bikeShine}" stroke-width="1.5" opacity="0.6"/>
  <path d="M796,808 L804,780 Q810,766 836,766 L866,768 Q878,770 876,782 L870,808 Z" fill="${HIGHWAY.seat}" stroke="${HIGHWAY.bikeEdge}" stroke-width="3"/>
  <path d="M812,772 Q836,768 864,772" stroke="${HIGHWAY.seatShine}" stroke-width="3" stroke-linecap="round" fill="none"/></g>`

export const bike = `<g data-fx="bike-hull">
  ${glow('wk-thrust', 690, 860, 90, HIGHWAY.thrust, 0.8)}
  <path d="M700,850 Q720,810 790,806 L930,800 Q990,800 1010,830 L1000,856 Q900,868 760,866 Z" fill="${HIGHWAY.bike}" stroke="${HIGHWAY.bikeEdge}" stroke-width="4"/>
  <path d="M780,812 L900,806" stroke="${HIGHWAY.bikeShine}" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="760" cy="872" rx="44" ry="8" fill="${HIGHWAY.thrust}" opacity="0.7"/><ellipse cx="960" cy="868" rx="44" ry="8" fill="${HIGHWAY.thrust}" opacity="0.7"/></g>`

export const RIDE: Partial<Pose> = { x: 850, scale: 1.15, lean: 18, hipF: 88, hipB: 80, kneeF: -96, kneeB: -100, shF: 72, shB: 66, elF: 18, elB: 22, head: -6 }

// The bob of the bike and its rider on the air cushion.
const bob = (p: number): number => Math.sin(p * 60) * 3

const ridePose = (p: number): Partial<Pose> => ({ ...RIDE, y: 870 + bob(p), scarf: -16 + Math.sin(p * 40) * 8 })

export const highway: Era = {
  build: ({ years }) => {
    const signs = years
      .map(
        (year, i) => `
    <g data-fx="sign-${i}" transform="translate(2000 0)">
      <rect x="-4" y="700" width="8" height="130" fill="${HIGHWAY.signPost}"/>
      <rect x="-62" y="640" width="124" height="70" rx="8" fill="${HIGHWAY.sign}" stroke="${HIGHWAY.signEdge}" stroke-width="4"/>
      <text x="0" y="688" text-anchor="middle" font-family="var(--ep-face), sans-serif" font-weight="900" font-size="40" fill="${HIGHWAY.signText}">${year}</text>
    </g>`,
      )
      .join('')
    return {
      sky: svg(`${defs(linear('wk-sky', [[0, HIGHWAY.skyTop], [0.35, HIGHWAY.skyMid], [0.62, HIGHWAY.skyLow], [0.8, HIGHWAY.skyDusk], [1, HIGHWAY.skyHorizon]]))}${rect('url(#wk-sky)')}${stars(31, 70, 300, HIGHWAY.star)}
        ${glow('wk-halo', 800, 600, 380, HIGHWAY.halo, 0.6)}${stripedSun('wk-sun', 800, 600, 220, [[0, HIGHWAY.sunTop], [1, HIGHWAY.sunBottom]])}
        <g transform="translate(1330 170)"><circle r="68" fill="${HIGHWAY.dial}" stroke="${HIGHWAY.sunTop}" stroke-width="6"/><circle r="56" fill="none" stroke="${HIGHWAY.sunTop}" stroke-width="2" stroke-dasharray="3 11.6"/>
          <rect x="-10" y="-90" width="20" height="16" rx="3" fill="${HIGHWAY.sunTop}"/><g data-fx="hand"><rect x="-3" y="-52" width="6" height="56" rx="3" fill="${HIGHWAY.dialHand}"/></g><circle r="7" fill="${HIGHWAY.sunTop}"/></g>`),
      far: svg(`<g data-fx="mesas"><path d="M-300,650 L-200,560 L40,560 L90,650 L300,650 L360,520 L560,520 L620,650 L900,650 L960,580 L1100,580 L1140,650 L1400,650 L1460,540 L1700,540 L1760,650 L2100,650 L2150,590 L2320,590 L2360,650 L2400,1000 L-300,1000 Z" fill="${HIGHWAY.mesa}"/>
        <path d="M-200,560 L40,560 M360,520 L560,520 M1460,540 L1700,540" stroke="${HIGHWAY.mesaLit}" stroke-width="3"/></g>`),
      mid: svg(`${defs(linear('wk-ground', [[0, HIGHWAY.groundTop], [1, HIGHWAY.groundBottom]]))}<rect x="-200" y="650" width="2000" height="400" fill="url(#wk-ground)"/>
        <g data-fx="poles">${poles}${cacti}</g>`),
      near: svg(`<rect x="-200" y="820" width="2000" height="120" fill="${HIGHWAY.road}"/><rect x="-200" y="820" width="2000" height="5" fill="${HIGHWAY.roadEdge}"/><rect x="-200" y="932" width="2000" height="4" fill="${HIGHWAY.roadEdge}" opacity="0.6"/>
        <g data-fx="dashes">${dashes}</g><rect x="-200" y="936" width="2000" height="80" fill="${HIGHWAY.shoulder}"/>${signs}`),
      figure: svg(`${cockpit}${courier(ridePose(0))}${bike}`),
      fg: svg(`<g data-fx="dust" opacity="0.6">${Array.from({ length: 30 }, (_, i) => `<rect x="${(i * 211) % 4800}" y="${600 + ((i * 97) % 380)}" width="${60 + (i % 5) * 30}" height="2" fill="${HIGHWAY.dust}"/>`).join('')}</g>
        <g data-fx="weed" transform="translate(1700 960)"><circle r="34" fill="none" stroke="${HIGHWAY.weed}" stroke-width="5" stroke-dasharray="12 6"/><circle r="20" fill="none" stroke="${HIGHWAY.weed}" stroke-width="4" stroke-dasharray="8 5"/></g>`),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const signs = Array.from({ length: count }, (_, i) => fx(stage, `sign-${i}`))
    const [mesas, polesNode, dashNode, dust, weed, hand] = ['mesas', 'poles', 'dashes', 'dust', 'weed', 'hand'].map((name) => fx(stage, name))
    const bikeParts = fxAll(stage, 'bike-')
    return (p, f) => {
      const travel = p + f * 0.25
      tf(mesas, `translate(${r1(-travel * 160)} 0)`)
      tf(polesNode, `translate(${r1(-travel * 900)} 0)`)
      tf(dashNode, `translate(${r1(-((travel * 3200) % 160) - 160)} 0)`)
      tf(dust, `translate(${r1(-travel * 2600)} 0)`)
      tf(weed, `translate(${r1(1700 - travel * 2200)} ${r1(960 - Math.abs(Math.sin(travel * 18)) * 30)}) rotate(${r1(-travel * 1400)})`)
      tf(hand, `rotate(${r1(f * 90 + p * 360)})`)
      signs.forEach((sign, i) => tf(sign, `translate(${r1(1180 - (f - i) * 820)} 0)`))
      bikeParts.forEach((part) => tf(part, `translate(0 ${r1(bob(p))})`))
      setPose(j, ridePose(p))
    }
  },
}
