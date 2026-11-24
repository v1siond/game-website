import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fxAll, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, still, stepPlace } from '../case'
import { examine, look, pick } from '../pose'

// About: the crime scene, a taped off stretch of pavement under a lamp with the chalk outline on it. The
// game's clue cue plays first: the piano note's rings pulse out of something lying by the outline and he
// turns his head down to it; then he kneels and picks it up, a red matchbook; then he turns it over in his
// hand and the notebook comes up out of his coat and takes it. Search, pick up, examine, note.

const CLUE = 110
// The rings of the cue go out this far and there are this many, one after another.
const RING_R = 70
const RINGS = 3

function Scene() {
  return (
    <>
      {/* the tape across the back on its two posts */}
      {[40, 520].map((x) => (
        <rect key={x} x={x - 5} y={-150} width={10} height={150} fill={NOIR.fog} />
      ))}
      <path d="M40 -132 Q280 -110 520 -136" stroke={NOIR.paperDim} strokeWidth="10" fill="none" />
      <path d="M60 -128 H90 M150 -122 H180 M240 -120 H270 M330 -121 H360 M420 -126 H450" stroke={NOIR.ink} strokeWidth="6" />
      {/* the chalk outline flat on the pavement */}
      <path
        d="M200 4 Q220 -8 260 -6 L300 -14 Q320 -18 330 -10 L380 -8 Q420 -14 440 -4 L470 -10 L478 2 L440 10 Q400 18 380 12 L330 14 Q310 22 300 14 L260 12 Q220 16 200 4 Z"
        fill="none"
        stroke={NOIR.paper}
        strokeWidth="4"
        opacity="0.85"
      />
      <circle cx={210} cy={2} r={14} fill="none" stroke={NOIR.paper} strokeWidth="4" opacity="0.85" />
      {/* an evidence marker */}
      <path d="M470 0 L486 -30 L502 0 Z" fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="3" />
      <g data-fx="clue">
        <rect x={CLUE - 12} y={-8} width={24} height={9} fill={NOIR.red} stroke={NOIR.ink} strokeWidth="2" />
        <path d={`M${CLUE - 12} -3 H${CLUE + 12}`} stroke={NOIR.paper} strokeWidth="2" />
      </g>
      {Array.from({ length: RINGS }, (_, i) => (
        <g key={i} data-fx={`ring-${i}`} opacity="0">
          <ellipse cx={CLUE} cy={-4} rx={RING_R} ry={RING_R * 0.3} fill="none" stroke={NOIR.paper} strokeWidth="4" />
        </g>
      ))}
      {/* the note of the cue rising off it */}
      <g data-fx="note" opacity="0">
        <path d={`M${CLUE + 30} -60 V-110 L${CLUE + 56} -118 V-70`} stroke={NOIR.paper} strokeWidth="5" fill="none" />
        <ellipse cx={CLUE + 22} cy={-60} rx={10} ry={7} fill={NOIR.paper} />
        <ellipse cx={CLUE + 48} cy={-70} rx={10} ry={7} fill={NOIR.paper} />
      </g>
    </>
  )
}

export const about = stepPlace({
  light: NOIR.paper,
  script: [1500, 1700, 1700],
  back: () => <Scene />,
  bind: (stage, { profession }) => {
    const rings = fxAll(stage, 'ring-')
    const note = fx(stage, 'note')
    const clue = fx(stage, 'clue')
    return (play) => {
      const cue = share(play, 0)
      const picked = share(play, 1)
      const noted = share(play, 2)
      // each ring swells out of the clue and fades, one after another, and the cue goes once it is picked
      rings.forEach((ring, i) => {
        const t = ramp(cue, i * 0.2, i * 0.2 + 0.6)
        transformTo(ring, `translate(${CLUE} -4) scale(${(0.2 + 0.8 * t).toFixed(3)}) translate(${-CLUE} 4)`)
        fadeTo(ring, t > 0 ? (1 - t) * (1 - picked) : 0)
      })
      fadeTo(note, Math.sin(Math.PI * ramp(cue, 0.1, 0.9)) * (1 - picked))
      transformTo(note, `translate(0 ${(-30 * ramp(cue, 0.1, 0.9)).toFixed(1)})`)
      fadeTo(clue, 1 - ramp(picked, 0.55, 0.6))
      if (noted > 0) return still(examine(noted))
      if (picked > 0) return still({ ...pick(profession, picked), head: Math.max(18 * (1 - ramp(picked, 0, 0.3)), pick(profession, picked).head) })
      return still(look(profession, ramp(cue, 0.3, 0.7)))
    }
  },
})
