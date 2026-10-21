'use client'

import type { CSSProperties } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter } from './character'
import { GiantSpider, TORN_SHIN, type SpiderPose } from './spider'
import { pinePath } from './depth'
import { BRUSH, Sky } from './places'
import { SHADE, SKY } from './palette'
import shade from './shade.module.css'

// The trap line, a strip of forest between his tech stack and his projects, where the chase from his
// about pays off: a row of open bear traps lies in the grass and he stands his ground behind them,
// facing the dark. When the strip comes into view the spider stalks out of the brush after him, rears,
// and drives its foreleg down into the nearest trap; the jaws bite, it tears itself free and drags back
// into the dark without the leg, which stays standing in the shut jaws. From here on it is lame.
// Reduced motion shows the end: the shut trap holding the leg, the lame spider at the dark edge.
//
// Animated: the spider's legs and body, its walk (one moved group), the biting trap's two jaws, the torn
// leg's fade, his idle, one beat timer.

type Beat = 'wait' | 'approach' | 'rear' | 'bite' | 'tear' | 'lost'

interface Stage {
  ms: number
  x: number
  pose: SpiderPose
  lame: boolean
  shut: boolean
}

// The biting trap's hinge sits at x 330; the foreleg tip lands 208 right of the spider's box, so the
// spider stops with its box at 122 to step in it.
const STAGE: Record<Beat, Stage> = {
  wait: { ms: 500, x: -240, pose: 'lurk', lame: false, shut: false },
  approach: { ms: 1600, x: 122, pose: 'stalk', lame: false, shut: false },
  rear: { ms: 420, x: 122, pose: 'stab', lame: false, shut: false },
  bite: { ms: 500, x: 122, pose: 'stab', lame: false, shut: true },
  tear: { ms: 1300, x: 0, pose: 'flinch', lame: true, shut: true },
  lost: { ms: 0, x: 0, pose: 'lurk', lame: true, shut: true },
}

const ENTRANCE: readonly Beat[] = ['wait', 'approach', 'rear', 'bite', 'tear']

const GROUND_Y = 190
const HINGE = '330px 190px'
const JAW_BACK = 'M330 190 H306 L309 180 L314 183 L315 174 L320 177 L323 168 L330 172 Z'
const JAW_FRONT = 'M330 190 H354 L351 180 L346 183 L345 174 L340 177 L337 168 L330 172 Z'
// The other traps in the row, open and still: their hinges on the ground line.
const SPARE_TRAPS = [250, 410]
const THICKET = [200, 290, 500, 560]

function OpenTrap({ x }: { x: number }) {
  return (
    <g transform={`translate(${x - 330} 0)`}>
      <rect x={302} y={189} width={56} height={3} fill={SHADE.black} />
      <path d={JAW_BACK} fill={SHADE.black} transform="rotate(-70 330 190)" />
      <path d={JAW_FRONT} fill={SHADE.black} transform="rotate(70 330 190)" />
    </g>
  )
}

function TrapScene() {
  const { pose: beat, arrived, advance } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'lost', still: 'lost' })
  const stage = STAGE[beat]
  const shut = stage.shut ? shade.jawShut : ''
  const hinge = { '--pivot': HINGE } as CSSProperties

  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" focusable="false">
      {THICKET.map((x) => (
        <path key={x} d={pinePath(x, 140, 192)} fill={SKY.dawn.far} />
      ))}
      <path d={`M-10 ${GROUND_Y} Q240 186 360 190 T610 188 V210 H-10 Z`} fill={SHADE.black} />
      {SPARE_TRAPS.map((x) => (
        <OpenTrap key={x} x={x} />
      ))}
      <g className={stage.lame ? shade.tornIn : shade.tornOut}>
        <g transform="translate(326 186) scale(0.94) rotate(-40)">
          <path d={TORN_SHIN} fill={SHADE.black} />
        </g>
      </g>
      <g className={shade.walker} style={{ '--x': stage.x, '--ms': `${stage.ms}ms` } as CSSProperties}>
        <GiantSpider pose={stage.pose} lame={stage.lame} place={{ x: 0, y: GROUND_Y + 2, height: 150 }} />
      </g>
      <rect x={302} y={189} width={56} height={3} fill={SHADE.black} />
      <path d={JAW_BACK} fill={SHADE.black} className={`${shade.jawBack} ${shut}`} style={hinge} />
      <path d={JAW_FRONT} fill={SHADE.black} className={`${shade.jawFront} ${shut}`} style={hinge} />
      <g transform="translate(500 0) scale(-1 1)">
        <HeroCharacter profession="engineer" pose="idle" place={{ x: 0, y: GROUND_Y, height: 48 }} />
      </g>
      <path d={BRUSH} fill={SHADE.black} />
      {!arrived && <rect key={beat} width={0} height={0} className={shade.beat} style={{ '--ms': `${stage.ms}ms` } as CSSProperties} onAnimationEnd={advance} />}
    </svg>
  )
}

export function TrapLine() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.6 })

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative aspect-[3/1] overflow-hidden border-y-2 border-[color:var(--sh-black)]" aria-hidden="true">
        <Sky light={SKY.dawn} />
        {triggered && <TrapScene />}
      </div>
    </div>
  )
}
