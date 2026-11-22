import { ARENA } from '../palette'
import { defs, fade, fx, fxAll, glow, linear, rect, r1, spread, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { reached, type Era } from './era'

// Bands: the neon arena, 1985. He drums: the sticks, the cymbal and the hi hat follow the scroll; a screen
// per band lights on the back wall; the beams sweep, the crowd jumps, confetti falls.

const SCREEN_TINTS = [ARENA.pink, ARENA.cyan, ARENA.gold, ARENA.lime] as const
const BEAMS = [260, 520, 800, 1080, 1340] as const

const stick = `<rect x="-2.5" y="20" width="5" height="62" rx="2.5" fill="${ARENA.stick}" transform="rotate(-70 0 31)"/>`

const beat = (p: number): number => p * 48

const drumPose = (p: number): Partial<Pose> => {
  const hitF = Math.max(0, Math.sin(beat(p)))
  const hitB = Math.max(0, Math.sin(beat(p) + Math.PI))
  return { x: 870, y: 800, scale: 1.25, hipF: 84, hipB: 78, kneeF: -84, kneeB: -90, lift: 0, shF: 60 + hitF * 40, elF: 40 - hitF * 40, shB: 50 + hitB * 40, elB: 40 - hitB * 40, head: Math.sin(beat(p)) * 6, lean: 4 }
}

export const arena: Era = {
  build: ({ count }) => {
    const screens = spread(count, 560, 1040)
      .map(
        (x, i) => `<g transform="translate(${r1(x)} 300)"><rect x="-56" y="-80" width="112" height="140" rx="6" fill="${ARENA.screen}" stroke="${ARENA.screenEdge}" stroke-width="4"/>
    <g data-fx="screen-${i}" opacity="0.08">${defs(linear(`bd-s-${i}`, [[0, SCREEN_TINTS[i % 4]], [1, ARENA.screenDeep]]))}<rect x="-50" y="-74" width="100" height="128" rx="4" fill="url(#bd-s-${i})"/>
    ${[0, 1, 2, 3, 4].map((k) => `<rect x="${-40 + k * 18}" y="${30 - (k % 3) * 22 - 20}" width="12" height="${(k % 3) * 22 + 30}" fill="${ARENA.screenBar}" opacity="0.5"/>`).join('')}</g></g>`,
      )
      .join('')
    const beams = BEAMS.map((x, i) => `<g data-fx="beam-${i}"><path d="M${x},130 L${x - 120},1000 L${x + 120},1000 Z" fill="url(#bd-beam-${i % 2})"/></g><rect x="${x - 16}" y="112" width="32" height="26" rx="4" fill="${ARENA.lamp}"/>`).join('')
    const kit = `<g transform="translate(940 0)">
      <ellipse cx="0" cy="760" rx="70" ry="70" fill="${ARENA.drum}" stroke="${ARENA.drumEdge}" stroke-width="5"/><ellipse cx="0" cy="760" rx="44" ry="44" fill="${ARENA.drumSkin}"/><circle cx="0" cy="760" r="18" fill="${ARENA.drumBadge}"/>
      <ellipse cx="-90" cy="700" rx="30" ry="12" fill="${ARENA.drum}" stroke="${ARENA.drumEdge}" stroke-width="3"/><rect x="-118" y="700" width="56" height="34" fill="${ARENA.tom}"/>
      <g data-fx="cymbal"><ellipse cx="110" cy="630" rx="56" ry="9" fill="${ARENA.brass}" stroke="${ARENA.brassEdge}" stroke-width="2"/></g><rect x="108" y="630" width="4" height="200" fill="${ARENA.stand}"/>
      <g data-fx="hat"><ellipse cx="-150" cy="660" rx="40" ry="7" fill="${ARENA.brass}" stroke="${ARENA.brassEdge}" stroke-width="2"/></g><rect x="-152" y="660" width="4" height="170" fill="${ARENA.stand}"/></g>`
    const crowd = Array.from({ length: 22 }, (_, i) => {
      const x = -160 + i * 88 + (i % 3) * 10
      const raised = i % 2 ? `<path d="M${x + 14},930 l20,-90" stroke="${ARENA.crowd}" stroke-width="12" stroke-linecap="round"/>` : ''
      return `<g data-fx="fan-${i}"><circle cx="${x}" cy="${900 - (i % 4) * 8}" r="26" fill="${ARENA.crowd}"/><rect x="${x - 34}" y="${920 - (i % 4) * 8}" width="68" height="120" rx="26" fill="${ARENA.crowd}"/>${raised}</g>`
    }).join('')
    return {
      sky: svg(`${defs(linear('bd-sky', [[0, ARENA.skyTop], [1, ARENA.skyBottom]]))}${rect('url(#bd-sky)')}${glow('bd-back', 800, 460, 520, ARENA.backGlow, 0.45)}${screens}`),
      far: svg(`${defs(linear('bd-beam-0', [[0, ARENA.cyan, 0.55], [1, ARENA.cyan, 0]]), linear('bd-beam-1', [[0, ARENA.pink, 0.5], [1, ARENA.pink, 0]]))}
        <g stroke="${ARENA.truss}" stroke-width="4" fill="none"><path d="M-200,110 H1800 M-200,140 H1800"/>${Array.from({ length: 40 }, (_, i) => `<path d="M${-200 + i * 50},110 l25,30 l25,-30"/>`).join('')}</g>${beams}`),
      mid: svg(`<rect x="-200" y="820" width="2000" height="200" fill="${ARENA.stage}"/><rect x="-200" y="812" width="2000" height="10" fill="${ARENA.stageEdge}"/>
        ${[200, 1340].map((x) => `<g transform="translate(${x} 0)"><rect x="0" y="560" width="120" height="252" fill="${ARENA.speaker}" stroke="${ARENA.speakerEdge}" stroke-width="4"/>${[600, 690, 760].map((y) => `<circle cx="60" cy="${y}" r="${y === 760 ? 34 : 26}" fill="${ARENA.cone}" stroke="${ARENA.coneEdge}" stroke-width="4"/>`).join('')}</g>`).join('')}`),
      near: svg(`<g data-fx="confetti">${Array.from({ length: 50 }, (_, i) => `<rect x="${((i * 131) % 1700) - 50}" y="${((i * 71) % 1400) - 900}" width="8" height="14" fill="${SCREEN_TINTS[i % 4]}" transform="rotate(${i * 33} ${((i * 131) % 1700) - 50} ${((i * 71) % 1400) - 900})"/>`).join('')}</g>`),
      figure: svg(`${courier(drumPose(0), { held: stick, heldBack: stick })}${kit}`),
      fg: svg(crowd),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const screens = Array.from({ length: count }, (_, i) => fx(stage, `screen-${i}`))
    const beams = fxAll(stage, 'beam-')
    const fans = fxAll(stage, 'fan-')
    const [cymbal, hat, confetti] = ['cymbal', 'hat', 'confetti'].map((name) => fx(stage, name))
    return (p, f) => {
      screens.forEach((screen, i) => fade(screen, 0.08 + reached(f, i) * 0.92))
      beams.forEach((beam, i) => tf(beam, `rotate(${r1(Math.sin(p * 8 + i * 1.3) * 22)} ${BEAMS[i]} 130)`))
      fans.forEach((fan, i) => tf(fan, `translate(0 ${r1(-Math.max(0, Math.sin(beat(p) * 0.5 + i * 0.9)) * 22)})`))
      tf(confetti, `translate(0 ${r1(p * 1100)})`)
      tf(cymbal, `rotate(${r1(Math.max(0, Math.sin(beat(p))) * 10)} 110 630)`)
      tf(hat, `rotate(${r1(-Math.max(0, Math.sin(beat(p) + Math.PI)) * 8)} -150 660)`)
      setPose(j, drumPose(p))
    }
  },
}
