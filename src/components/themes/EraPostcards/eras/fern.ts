import { FERN, HIM } from '../palette'
import { clouds, defs, fade, frond, fx, glow, lerp, linear, radial, rect, ridge, r1, stars, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { ease, peakOf, reached, type Era } from './era'

// About: the fern age at dawn. The volcano smokes, the long neck raises its head, pterosaurs cross the sun.
// He stands on a rock with his phone: per highlight he frames a shot, the flash goes and the photo, him in
// the era, drops onto a stack at his feet. On the last one he turns the phone on himself for a selfie with
// the long neck behind him, and the neck turns to the flash.

// Right of the cards' column at 1440, so no card covers him.
const AT = { x: 900, y: 884, scale: 1.25 } as const

// Where the phone is at the top of the aim, and the stack the photos land on, in the layer.
const PHONE_AT = [AT.x + 76, 716] as const
const stackAt = (i: number): readonly [number, number, number] => [AT.x + 140 + (i % 3) * 14, 900 - i * 5, ((i * 37) % 15) - 7]

const STANDING: Partial<Pose> = { ...AT, shF: 14, elF: 30, shB: -8, elB: 12, head: 0 }
const AIM: Partial<Pose> = { ...AT, shF: 96, elF: 18, shB: 8, elB: 26, head: -4, lean: 2 }
const SELFIE: Partial<Pose> = { ...AT, shF: 150, elF: -24, shB: 12, elB: 30, head: -16, lean: -6, scarf: 10 }

const KEYS = ['shF', 'elF', 'shB', 'elB', 'head', 'lean', 'scarf'] as const

const blend = (from: Partial<Pose>, to: Partial<Pose>, t: number): Partial<Pose> => ({
  ...AT,
  ...Object.fromEntries(KEYS.map((key) => [key, lerp(from[key] ?? 0, to[key] ?? 0, t)])),
})

// The card being read and how far into it the scroll is; past the last card it holds the last at its end.
const cardOf = (f: number, count: number): { i: number; u: number } => {
  const i = Math.min(count - 1, Math.max(0, Math.floor(f)))
  return { i, u: reached(f, i) }
}

// Each photo: rises with the aim, holds while the card is read (the flash in the first part of the hold),
// lowers at the card's end. The last card's selfie holds to the end.
const shotPose = (f: number, count: number): Partial<Pose> => {
  if (count === 0) return STANDING
  const { i, u } = cardOf(f, count)
  const last = i === count - 1
  return blend(STANDING, last ? SELFIE : AIM, peakOf(u, 0.2, last ? 1 : 0.88))
}

const flashOf = (u: number): number => Math.max(0, 1 - Math.abs(u - 0.32) / 0.08)

// The photo leaves the phone this far into its card, just after the flash.
const DROP_FROM = 0.4

// How far photo i has dropped from the phone to the stack, 0 before its flash.
const dropOf = (f: number, i: number): number => ease((reached(f, i) - DROP_FROM) / 0.3)

// The phone in his front hand, its screen toward the shot, and the flash on its back.
const PHONE = `<g transform="translate(0 34) rotate(-90)"><rect x="-7" y="-12" width="14" height="24" rx="3" fill="${FERN.phone}"/>
  <rect x="-5" y="-9" width="10" height="16" rx="1.5" fill="${FERN.screen}"/>
  <g data-fx="flash" opacity="0">${defs(radial('ab-flash', [[0, FERN.flash, 1], [1, FERN.flash, 0]]))}<circle cx="0" cy="-16" r="46" fill="url(#ab-flash)"/></g></g>`

// Him in a photo: a small figure with the scarf, the head, the hair.
const tinyHim = (x: number, y: number, size: number): string => `<g transform="translate(${x} ${y}) scale(${size})">
  <path d="M-3,0 L-4,-11 Q0,-13 4,-11 L3,0 Z" fill="${HIM.coat}"/><path d="M-1,-11 q-5,1 -8,4" stroke="${HIM.scarf}" stroke-width="2" fill="none"/>
  <circle cx="0" cy="-15" r="3.6" fill="${HIM.skin}"/><path d="M-3.6,-16 l1,-3 l2,1 l1,-3 l2,2 l2,-1 l0,4 Z" fill="${HIM.hair}"/></g>`

// What each photo shows behind him, in turn: the volcano, the sun, the pterosaur.
const MOTIF = [
  `<path d="M-26,8 L-14,-12 L-8,-12 L4,8 Z" fill="${FERN.volcano}"/><circle cx="-11" cy="-13" r="2.4" fill="${FERN.lava}"/>`,
  `<circle cx="-12" cy="-6" r="9" fill="${FERN.sun}"/>`,
  `<path transform="translate(-18 -10) scale(0.18)" d="M0,0 q30,-22 60,-6 q10,-4 14,4 q4,-8 14,-4 q30,-16 60,6 q-40,-6 -70,10 q-4,8 -10,0 q-30,-16 -68,-10 Z" fill="${FERN.ptero}"/>`,
]

// The selfie: his face close, the long neck rising behind him.
const SELFIE_SHOT = `<path d="M10,14 q4,-16 2,-30 q0,-4 4,-4 q6,0 6,4 q-2,2 -6,2 q0,14 -2,28 Z" fill="${FERN.beast}"/>
  <circle cx="-8" cy="0" r="10" fill="${HIM.skin}"/><path d="M-18,-2 l2,-8 l4,2 l2,-7 l4,4 l4,-4 l2,6 l4,-1 l-2,8 Z" fill="${HIM.hair}"/>
  <path d="M-16,4 q8,10 16,2 l0,-4 q-8,4 -16,2 Z" fill="${HIM.beard}"/><ellipse cx="-4" cy="-2" rx="1.4" ry="2" fill="${HIM.eyes}"/>`

const photo = (i: number, selfie: boolean, opacity: number, [x, y, rot]: readonly [number, number, number]): string => `
    <g data-fx="photo-${i}" opacity="${opacity}" transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="-34" y="-26" width="68" height="52" rx="2" fill="${FERN.postcard}" stroke="${FERN.postcardEdge}" stroke-width="1.5"/>
      <rect x="-28" y="-20" width="56" height="34" fill="${FERN.skyLow}"/><rect x="-28" y="6" width="56" height="8" fill="${FERN.hills}"/>
      ${selfie ? SELFIE_SHOT : `${MOTIF[i % MOTIF.length]}${tinyHim(10, 8, 1)}`}
    </g>`

const photoAt = (f: number, i: number): readonly [number, number, number] => {
  const d = dropOf(f, i)
  const [sx, sy, sr] = stackAt(i)
  return [lerp(PHONE_AT[0], sx, d), lerp(PHONE_AT[1], sy, d) - Math.sin(d * Math.PI) * 40, lerp(0, sr, d)]
}

// The rock he stands on.
const ROCK = `<path d="M${AT.x - 70},${AT.y + 26} Q${AT.x - 60},${AT.y - 6} ${AT.x},${AT.y - 4} Q${AT.x + 62},${AT.y - 8} ${AT.x + 76},${AT.y + 26} Z" fill="${FERN.rock}" stroke="${FERN.rockEdge}" stroke-width="3"/>`

export const fern: Era = {
  build: ({ count }) => {
    const smoke = Array.from({ length: 9 }, (_, i) => `<circle cx="${r1(330 + Math.sin(i) * 30 + i * 12)}" cy="${330 - i * 42}" r="${30 + i * 9}" fill="${FERN.smoke}" opacity="${r1(0.55 - i * 0.04)}"/>`).join('')
    const pteros = [0, 1, 2]
      .map((i) => `<path transform="translate(${i * 140} ${i * 40}) scale(${r1(1 - i * 0.2)})" d="M0,0 q30,-22 60,-6 q10,-4 14,4 q4,-8 14,-4 q30,-16 60,6 q-40,-6 -70,10 q-4,8 -10,0 q-30,-16 -68,-10 Z" fill="${FERN.ptero}"/>`)
      .join('')
    // The settled frame (reduced motion, and the picture before the first scroll): the selfie at its peak,
    // every photo on the stack.
    const photos = Array.from({ length: count }, (_, i) => photo(i, i === count - 1, 1, stackAt(i))).join('')
    return {
      sky: svg(`${defs(linear('ab-sky', [[0, FERN.skyTop], [0.4, FERN.skyMid], [0.7, FERN.skyLow], [1, FERN.skyHorizon]]))}${rect('url(#ab-sky)')}${stars(21, 60, 260, FERN.star)}
        ${glow('ab-sun-g', 1120, 600, 420, FERN.sunGlow, 0.85)}<circle cx="1120" cy="600" r="130" fill="${FERN.sun}"/>
        ${clouds(22, 8, [380, 560], FERN.cloud, 0.45)}<g data-fx="ptero" transform="translate(-300 220)">${pteros}</g>`),
      far: svg(`${ridge(23, { y: 640, amp: 50, fill: FERN.ridge, sharp: 6 })}
        <g data-fx="smoke">${smoke}</g>
        <path d="M80,700 L280,350 Q330,330 380,350 L600,700 Z" fill="${FERN.volcano}"/><path d="M290,352 Q330,372 372,352 L360,400 Q330,385 300,400 Z" fill="${FERN.lava}"/>
        ${glow('ab-lava', 330, 360, 120, FERN.lavaGlow, 0.8)}<path d="M330,360 q-20,80 -60,140 q30,-40 70,-130 Z" fill="${FERN.lavaFlow}" opacity="0.7"/>`),
      mid: svg(`${ridge(24, { y: 760, amp: 40, fill: FERN.hills })}
        <g fill="${FERN.beast}"><ellipse cx="1300" cy="700" rx="140" ry="60"/><path d="M1180,700 q-160,10 -260,-30 q120,50 270,60 Z"/>
          ${[1220, 1260, 1340, 1380].map((x) => `<rect x="${x}" y="720" width="26" height="70" rx="8"/>`).join('')}
          <g data-fx="neck"><path d="M1400,690 q40,-120 30,-240 q0,-30 26,-34 q40,-2 48,22 q-6,14 -40,14 q4,110 -34,250 Z"/><circle cx="1470" cy="430" r="5" fill="${FERN.beastEye}"/></g></g>
        ${[140, 1500].map((x) => `<rect x="${x}" y="520" width="22" height="260" fill="${FERN.palm}"/>${frond(x + 10, 520, 160, -150, FERN.palm)}${frond(x + 10, 520, 160, -30, FERN.palm)}${frond(x + 10, 520, 120, -90, FERN.palm)}`).join('')}`),
      near: svg(`<path d="M-200,1000 L-200,880 Q400,850 800,880 Q1200,910 1800,860 L1800,1000 Z" fill="${FERN.ground}"/>
        <path d="M-200,880 Q400,850 800,880 Q1200,910 1800,860" stroke="${FERN.groundEdge}" stroke-width="3" fill="none" opacity="0.6"/>`),
      figure: svg(`${ROCK}${photos}${courier(shotPose(count, count), { held: PHONE })}`),
      fg: svg(`<g data-fx="sway-l">${frond(-60, 1010, 420, -40, FERN.fern)}${frond(-40, 1010, 360, -70, FERN.fern)}</g>
        <g data-fx="sway-r">${frond(1660, 1010, 420, -140, FERN.fern)}${frond(1640, 1010, 330, -110, FERN.fern)}</g>`),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const photos = Array.from({ length: count }, (_, i) => fx(stage, `photo-${i}`))
    const [smoke, neck, ptero, swayL, swayR, flash] = ['smoke', 'neck', 'ptero', 'sway-l', 'sway-r', 'flash'].map((name) => fx(stage, name))
    return (p, f) => {
      const { i: at, u } = cardOf(f, count)
      const selfie = count > 0 && at === count - 1 ? peakOf(u, 0.2, 1) : 0
      tf(smoke, `translate(330 700) scale(1 ${r1(0.6 + p * 0.8)}) translate(-330 -700)`)
      tf(neck, `rotate(${r1(20 - p * 34 - selfie * 18)} 1410 690)`)
      tf(ptero, `translate(${r1(-300 + p * 1500)} ${r1(220 - p * 90)})`)
      tf(swayL, `rotate(${r1(Math.sin(p * 9) * 4)} 0 1000)`)
      tf(swayR, `rotate(${r1(-Math.sin(p * 9 + 1) * 4)} 1600 1000)`)
      fade(flash, count > 0 ? flashOf(u) : 0)
      photos.forEach((node, i) => {
        const [x, y, rot] = photoAt(f, i)
        fade(node, reached(f, i) > DROP_FROM ? 1 : 0)
        tf(node, `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})`)
      })
      setPose(j, shotPose(f, count))
    }
  },
}
