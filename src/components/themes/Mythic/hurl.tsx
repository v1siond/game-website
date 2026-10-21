'use client'

import { useRef } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { SpartanSprite } from './sprite'
import { useSceneMove, useTrack } from './track'
import { SlabButton } from './buttons'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The ventures' throw: a keepsake is frozen in a block of ice across the magma; he winds his blade up
// behind his head and throws it ('hurl' in rig.ts), it spins across and splits the ice, the shards fly and
// the gold keepsake rises free; he holds his hand out and the blade spins back into it. Throw again plays
// it once more. The blade's path runs from his hand at the release (0.24) to the ice and back to his hand
// at the catch (0.76), read off the hurl keys.

const SCENE = { width: 320, height: 150 }
const HIM = { x: 6, y: 4, height: 146 }
const INK = MYTH.inkLine
const RELEASE = { x: 115, y: 90 }
const HIT = { x: 258, y: 92 }
const CATCH = { x: 87, y: 19 }
const ICE = { x: 244, y: 56, width: 56, height: 82 }

const at = (point: { x: number; y: number }, spin: number) => `translate(${point.x}px, ${point.y}px) rotate(${spin}deg)`

const BLADE_TRACK: Keyframe[] = [
  { offset: 0, opacity: 0, transform: at(RELEASE, 0) },
  { offset: 0.23, opacity: 0, transform: at(RELEASE, 0) },
  { offset: 0.24, opacity: 1 },
  { offset: 0.36, transform: at(HIT, 720) },
  { offset: 0.6, transform: at(HIT, 720) },
  { offset: 0.76, opacity: 1, transform: at(CATCH, 0) },
  { offset: 0.77, opacity: 0, transform: at(CATCH, 0) },
]

const ICE_TRACK: Keyframe[] = [
  { offset: 0, opacity: 1 },
  { offset: 0.36, opacity: 1 },
  { offset: 0.38, opacity: 0 },
  { offset: 1, opacity: 0 },
]

const TOKEN_TRACK: Keyframe[] = [
  { offset: 0, transform: 'translateY(0) scale(1)' },
  { offset: 0.36, transform: 'translateY(0) scale(1)' },
  { offset: 0.5, transform: 'translateY(-26px) scale(1.25)' },
  { offset: 1, transform: 'translateY(-20px) scale(1.15)' },
]

// Each shard: its outline in the block and where it flies, with its turn.
const SHARDS = [
  { d: 'M244 56 L272 56 L262 92 L244 84 Z', dx: -26, dy: -40, spin: -140 },
  { d: 'M272 56 L300 56 L300 88 L262 92 Z', dx: 30, dy: -46, spin: 160 },
  { d: 'M244 84 L262 92 L254 138 L244 138 Z', dx: -34, dy: 6, spin: -90 },
  { d: 'M262 92 L300 88 L300 138 L254 138 Z', dx: 36, dy: 10, spin: 110 },
]

const shardTrack = ({ dx, dy, spin }: (typeof SHARDS)[number]): Keyframe[] => [
  { offset: 0, opacity: 0, transform: 'none' },
  { offset: 0.36, opacity: 0, transform: 'none' },
  { offset: 0.37, opacity: 1, transform: 'none' },
  { offset: 0.6, opacity: 0, transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg)` },
  { offset: 1, opacity: 0, transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg)` },
]

const SHARD_TRACKS = SHARDS.map(shardTrack)

function Shard({ index, take, ms }: { index: number; take: number; ms: number }) {
  const ref = useRef<SVGPathElement>(null)
  useTrack(ref, SHARD_TRACKS[index], ms, take)
  return <path ref={ref} d={SHARDS[index].d} fill={MYTH.frost} stroke={MYTH.frostDeep} strokeWidth={1.6} opacity={0} className={`${u.sceneProp} ${u.shard}`} />
}

// The blade on its chain, drawn about its own middle so the track can spin it.
function Blade() {
  return (
    <>
      <path d="M-12 4 Q-2 -14 14 -10 Q2 -6 -2 6 Z" fill={MYTH.steel} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-2 6 L-8 12" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M-2 6 L-8 12" stroke={MYTH.leather} strokeWidth={1.8} strokeLinecap="round" />
    </>
  )
}

export function BladeThrow() {
  const { myth } = useLabels()
  const { reduced } = useZoneStageContext()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.5 })
  const { pose, take, settle, replay, ms } = useSceneMove('hurl', triggered)
  const bladeRef = useRef<SVGGElement>(null)
  const iceRef = useRef<SVGGElement>(null)
  const tokenRef = useRef<SVGGElement>(null)
  useTrack(bladeRef, BLADE_TRACK, ms, take)
  useTrack(iceRef, ICE_TRACK, ms, take)
  useTrack(tokenRef, TOKEN_TRACK, ms, take)

  return (
    <div ref={ref} className="mb-6">
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} preserveAspectRatio="xMidYMax meet" className="block h-40 w-full sm:h-48" aria-hidden="true">
        <path d={`M0 ${SCENE.height - 12} L${SCENE.width} ${SCENE.height - 12}`} stroke={MYTH.goldDeep} strokeWidth={3} />
        <g ref={tokenRef} className={`${u.sceneProp} ${u.freed}`}>
          <path d="M272 92 L288 102 L288 120 L272 130 L256 120 L256 102 Z" fill={MYTH.gold} stroke={INK} strokeWidth={2} />
          <path d="M272 98 L283 105 L283 117 L272 124 L261 117 L261 105 Z" fill="none" stroke={MYTH.goldPale} strokeWidth={1.2} />
        </g>
        <g ref={iceRef} opacity={reduced ? 0 : 1} className={u.sceneProp}>
          <rect x={ICE.x} y={ICE.y} width={ICE.width} height={ICE.height} fill={MYTH.frost} fillOpacity={0.55} stroke={MYTH.frostDeep} strokeWidth={2.4} />
          <path d="M252 64 L266 70 M286 66 L294 80 M250 118 L262 126" stroke={MYTH.frost} strokeWidth={2} />
        </g>
        {SHARDS.map((_, index) => (
          <Shard key={index} index={index} take={take} ms={ms} />
        ))}
        <SpartanSprite key={take} profession="engineer" motion={pose} place={HIM} onDone={settle} />
        <g ref={bladeRef} opacity={0} className={u.sceneProp}>
          <Blade />
        </g>
      </svg>
      <div className="mt-3 flex justify-end">
        <SlabButton tone="stone" onClick={replay}>
          {myth.throwAgain}
        </SlabButton>
      </div>
    </div>
  )
}
