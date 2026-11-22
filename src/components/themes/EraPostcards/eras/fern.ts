import { gaitAt, walkOn } from '@/lib/motion/gait'
import { FERN } from '../palette'
import { clouds, defs, fade, frond, fx, glow, lerp, linear, radial, rect, ridge, r1, spread, stars, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { reached, type Era } from './era'

// About: the fern age at dawn. The volcano smokes, the long neck raises its head, pterosaurs cross the sun;
// he walks a row of rune stones, one per highlight, and each lights as its highlight is read.

const stonesAt = (count: number): number[] => spread(count, 560, 1040)

// He walks in as the scene rises, stops at each stone as its highlight is read and never steps back.
const walkPose = (xs: readonly number[], p: number, f: number): Partial<Pose> => {
  const last = xs.length - 1
  const at = Math.min(last, Math.max(0, f - 0.5))
  const x = walkOn(lerp(xs[Math.floor(at)], xs[Math.min(last, Math.floor(at) + 1)], at % 1) + 34, p)
  return { x, y: 902, scale: 1.25, ...gaitAt(x, 1.25, 0.8) }
}

export const fern: Era = {
  build: ({ count }) => {
    const xs = stonesAt(count)
    const smoke = Array.from({ length: 9 }, (_, i) => `<circle cx="${r1(330 + Math.sin(i) * 30 + i * 12)}" cy="${330 - i * 42}" r="${30 + i * 9}" fill="${FERN.smoke}" opacity="${r1(0.55 - i * 0.04)}"/>`).join('')
    const pteros = [0, 1, 2]
      .map((i) => `<path transform="translate(${i * 140} ${i * 40}) scale(${r1(1 - i * 0.2)})" d="M0,0 q30,-22 60,-6 q10,-4 14,4 q4,-8 14,-4 q30,-16 60,6 q-40,-6 -70,10 q-4,8 -10,0 q-30,-16 -68,-10 Z" fill="${FERN.ptero}"/>`)
      .join('')
    const stones = xs
      .map(
        (x, i) => `
    <g transform="translate(${r1(x)} 900)">
      <g data-fx="lit-${i}" opacity="0">${defs(radial(`ab-lit-${i}`, [[0, FERN.runeGlow, 0.9], [1, FERN.runeGlowEdge, 0]]))}<circle cx="0" cy="-48" r="70" fill="url(#ab-lit-${i})"/></g>
      <path d="M-22,0 L-26,-70 Q0,-92 26,-72 L22,0 Z" fill="${FERN.stone}" stroke="${FERN.stoneEdge}" stroke-width="3"/>
      <path d="M-10,-58 l10,-10 l10,10 M-8,-40 h16 M0,-40 v18" stroke="${FERN.rune}" stroke-width="3" fill="none" data-fx="rune-${i}" opacity="0.15"/>
    </g>`,
      )
      .join('')
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
      figure: svg(`${stones}${courier(walkPose(xs, 0, 0))}`),
      fg: svg(`<g data-fx="sway-l">${frond(-60, 1010, 420, -40, FERN.fern)}${frond(-40, 1010, 360, -70, FERN.fern)}</g>
        <g data-fx="sway-r">${frond(1660, 1010, 420, -140, FERN.fern)}${frond(1640, 1010, 330, -110, FERN.fern)}</g>`),
    }
  },
  bind: (stage, { count }) => {
    const xs = stonesAt(count)
    const j = joints(stage)
    const lits = Array.from({ length: count }, (_, i) => [fx(stage, `lit-${i}`), fx(stage, `rune-${i}`)] as const)
    const [smoke, neck, ptero, swayL, swayR] = ['smoke', 'neck', 'ptero', 'sway-l', 'sway-r'].map((name) => fx(stage, name))
    return (p, f) => {
      tf(smoke, `translate(330 700) scale(1 ${r1(0.6 + p * 0.8)}) translate(-330 -700)`)
      tf(neck, `rotate(${r1(20 - p * 34)} 1410 690)`)
      tf(ptero, `translate(${r1(-300 + p * 1500)} ${r1(220 - p * 90)})`)
      tf(swayL, `rotate(${r1(Math.sin(p * 9) * 4)} 0 1000)`)
      tf(swayR, `rotate(${r1(-Math.sin(p * 9 + 1) * 4)} 1600 1000)`)
      lits.forEach(([glowNode, rune], i) => {
        fade(glowNode, reached(f, i))
        fade(rune, 0.15 + reached(f, i) * 0.85)
      })
      setPose(j, walkPose(xs, p, f))
    }
  },
}
