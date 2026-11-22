import { KEYSTONE } from '../palette'
import { defs, fade, fx, glow, lerp, linear, rect, r1, skyline, spread, stars, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { clamp01, reached, type Era } from './era'

// Ventures: the keystone, year 3000. A neon city under a guardian's shadow; he rises on a hover disc and a
// shard per venture leaves its orbit and docks in the pedestal while the guardian's eyes go dark. Cars
// cross, rain falls. His own products, first in the list, carry pink shards, the rest cyan.

const socketsAt = (count: number): number[] => spread(count, 990, 1310)

// His hover disc, left of the pedestal: he faces right, so he faces the sockets the shards dock in. At 850
// he is clear of the text column on a desktop and inside the picture's middle a phone shows.
const DISC_X = 850

const reachPose = (p: number, f: number): Partial<Pose> => {
  const reach = Math.sin(clamp01(f - Math.floor(f)) * Math.PI)
  return { x: DISC_X, y: 842, scale: 1.15, shF: 30 + reach * 120, elF: 10, shB: -10, head: -10 - reach * 10, lean: -6, scarf: Math.sin(p * 20) * 10 }
}

// Where shard i circles before it is reached: an ellipse round the guardian, turning with the scene.
const orbit = (i: number, count: number, p: number): readonly [number, number] => {
  const angle = (i / count) * Math.PI * 2 + p * Math.PI * 1.5
  return [800 + Math.cos(angle) * 300, 420 + Math.sin(angle) * 110]
}

const shardAt = (sockets: readonly number[], i: number, p: number, f: number): string => {
  const [ox, oy] = orbit(i, sockets.length, p)
  const t = reached(f, i)
  const eased = t * t * (3 - 2 * t)
  return `translate(${r1(lerp(ox, sockets[i], eased))} ${r1(lerp(oy, 856, eased))}) scale(${r1(lerp(0.8, 1.1, eased))})`
}

export const keystone: Era = {
  build: ({ count, featured }) => {
    const sockets = socketsAt(count)
    const shards = sockets
      .map((_, i) => {
        const tint = i < featured ? KEYSTONE.trailPink : KEYSTONE.trailCyan
        return `<g data-fx="shard-${i}" transform="${shardAt(sockets, i, 0, 0)}">
    ${defs(linear(`vn-s-${i}`, [[0, KEYSTONE.shardCore], [1, tint]]))}${glow(`vn-sg-${i}`, 0, 0, 56, tint, 0.7)}
    <path d="M0,-34 L18,-6 L0,34 L-18,-6 Z" fill="url(#vn-s-${i})" stroke="${KEYSTONE.shardEdge}" stroke-width="2"/></g>`
      })
      .join('')
    const cars = Array.from({ length: 6 }, (_, i) => `<g transform="translate(${i * 420} ${200 + (i % 3) * 70})"><rect x="0" y="0" width="46" height="10" rx="5" fill="${KEYSTONE.car}"/><rect x="-160" y="3" width="160" height="3" fill="${i % 2 ? KEYSTONE.trailCyan : KEYSTONE.trailPink}" opacity="0.6"/><circle cx="44" cy="5" r="3" fill="${KEYSTONE.carLight}"/></g>`).join('')
    return {
      sky: svg(`${defs(linear('vn-sky', [[0, KEYSTONE.skyTop], [0.4, KEYSTONE.skyMid], [0.7, KEYSTONE.skyLow], [1, KEYSTONE.skyHorizon]]))}${rect('url(#vn-sky)')}${stars(71, 220, 520, KEYSTONE.star)}
        <ellipse cx="800" cy="200" rx="1100" ry="120" fill="none" stroke="${KEYSTONE.orbit}" stroke-width="2" opacity="0.35" transform="rotate(-6 800 200)"/>
        <circle cx="1320" cy="150" r="60" fill="${KEYSTONE.moon}"/><circle cx="1300" cy="140" r="60" fill="${KEYSTONE.moonLit}" opacity="0.6"/>`),
      far: svg(`<g fill="${KEYSTONE.guardian}" stroke="${KEYSTONE.guardianEdge}" stroke-width="2" stroke-opacity="0.55"><path d="M380,700 L420,380 Q520,240 800,220 Q1080,240 1180,380 L1220,700 Z"/><path d="M500,330 L800,290 L1100,330 L1060,380 L540,380 Z" fill="${KEYSTONE.guardianBrow}"/>
        <path d="M760,220 L800,120 L840,220 Z"/><path d="M420,380 L300,330 L330,460 Z M1180,380 L1300,330 L1270,460 Z"/></g>
        <g data-fx="eyes">${glow('vn-eye-l', 680, 355, 90, KEYSTONE.eye, 0.9)}${glow('vn-eye-r', 920, 355, 90, KEYSTONE.eye, 0.9)}<path d="M630,350 h100 l-14,14 h-86 Z M970,350 h-100 l14,14 h86 Z" fill="${KEYSTONE.eyeSlit}"/></g>
        ${skyline(72, { base: 760, hMin: 120, hMax: 300, fill: KEYSTONE.cityFar, lit: KEYSTONE.cityFarLit, density: 0.18, spires: 0.3 })}`),
      mid: svg(`<g data-fx="cars" transform="translate(-400 0)">${cars}</g>${skyline(73, { base: 860, hMin: 160, hMax: 420, wMin: 60, wMax: 140, fill: KEYSTONE.cityNear, lit: KEYSTONE.cityNearLit, density: 0.22, spires: 0.25 })}
        <g fill="none" stroke-width="5"><rect x="120" y="520" width="80" height="26" rx="6" stroke="${KEYSTONE.trailCyan}"/><rect x="1380" y="470" width="110" height="30" rx="6" stroke="${KEYSTONE.signLime}"/></g>`),
      near: svg(`${defs(linear('vn-ped', [[0, KEYSTONE.pedestalTop], [1, KEYSTONE.pedestalBottom]]))}<path d="M890,1000 L950,880 L1350,880 L1410,1000 Z" fill="url(#vn-ped)"/><path d="M950,880 L1350,880" stroke="${KEYSTONE.trailCyan}" stroke-width="4"/>
        ${sockets.map((x) => `<ellipse cx="${r1(x)}" cy="896" rx="26" ry="7" fill="${KEYSTONE.socket}" stroke="${KEYSTONE.trailPink}" stroke-width="2"/>`).join('')}`),
      figure: svg(`<g data-fx="hover"><ellipse cx="${DISC_X}" cy="842" rx="80" ry="14" fill="${KEYSTONE.disc}" stroke="${KEYSTONE.signLime}" stroke-width="3"/>${glow('vn-hov', DISC_X, 858, 80, KEYSTONE.signLime, 0.5)}${courier(reachPose(0, 0))}</g>${shards}`),
      fg: svg(`<g data-fx="rain" stroke="${KEYSTONE.rain}" stroke-width="1.5" opacity="0.35">${Array.from({ length: 60 }, (_, i) => `<path d="M${((i * 97) % 1800) - 100},${((i * 53) % 1600) - 1200} l-10,50"/>`).join('')}</g>
        <path d="M-200,1000 L-200,950 L1800,950 L1800,1000 Z" fill="${KEYSTONE.rail}"/><path d="M-200,950 L1800,950" stroke="${KEYSTONE.trailPink}" stroke-width="3"/>
        ${Array.from({ length: 20 }, (_, i) => `<rect x="${-200 + i * 100}" y="905" width="6" height="45" fill="${KEYSTONE.rail}"/>`).join('')}<rect x="-200" y="905" width="2000" height="5" fill="${KEYSTONE.rail}"/>`),
    }
  },
  bind: (stage, { count }) => {
    const sockets = socketsAt(count)
    const j = joints(stage)
    const shards = Array.from({ length: count }, (_, i) => fx(stage, `shard-${i}`))
    const [eyes, cars, rain, hover] = ['eyes', 'cars', 'rain', 'hover'].map((name) => fx(stage, name))
    return (p, f) => {
      fade(eyes, 1 - clamp01(f / Math.max(1, count)) * 0.9)
      tf(cars, `translate(${r1(-400 + p * 1400)} 0)`)
      tf(rain, `translate(0 ${r1(p * 1200)})`)
      tf(hover, `translate(0 ${r1(-p * 90)})`)
      shards.forEach((shard, i) => tf(shard, shardAt(sockets, i, p, f)))
      setPose(j, reachPose(p, f))
    }
  },
}
