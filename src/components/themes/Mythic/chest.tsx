'use client'

import { useRef } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { FigureSpace, SpartanSprite } from './sprite'
import { useSceneMove, useTrack } from './track'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The projects' chest at the volcano's foot: he crouches, grips the lid's front edge, rips it off and
// heaves it over his head ('heave' in rig.ts), and light and red orbs burst out of the open chest; the
// project cards then rise out of it (underworld.module.css, the boons). The chest and lid are drawn in
// his own units (FigureSpace), so the lid sits in his hands at the keys: under them at 0.22, over his
// head at 0.58.

const SCENE = { width: 320, height: 166 }
const HIM = { x: 40, y: 18, height: 146 }
const INK = MYTH.inkLine

const LID_TRACK: Keyframe[] = [
  { offset: 0, transform: 'none', opacity: 1 },
  { offset: 0.22, transform: 'none' },
  { offset: 0.3, transform: 'translate(2px, -4px) rotate(3deg)' },
  { offset: 0.38, transform: 'translate(-2px, -6px) rotate(-3deg)' },
  { offset: 0.58, transform: 'translate(-93px, -138px) rotate(-8deg)' },
  { offset: 0.84, transform: 'translate(-93px, -138px) rotate(-8deg)', opacity: 1 },
  { offset: 1, transform: 'translate(-190px, -70px) rotate(-120deg)', opacity: 0 },
]

const GLOW_TRACK: Keyframe[] = [
  { offset: 0, opacity: 0, transform: 'scaleY(0.2)' },
  { offset: 0.4, opacity: 0, transform: 'scaleY(0.2)' },
  { offset: 0.58, opacity: 1, transform: 'scaleY(1)' },
  { offset: 1, opacity: 0.85, transform: 'scaleY(1)' },
]

// The orbs burst out of the chest: where each one peaks, sideways and up from the chest's mouth.
const BURST = [
  { dx: -34, dy: -96 },
  { dx: -8, dy: -128 },
  { dx: 18, dy: -110 },
  { dx: 44, dy: -84 },
  { dx: 66, dy: -60 },
]

const burstTrack = ({ dx, dy }: (typeof BURST)[number]): Keyframe[] => [
  { offset: 0, opacity: 0, transform: 'translate(0, 0) scale(0.4)' },
  { offset: 0.42, opacity: 0, transform: 'translate(0, 0) scale(0.4)' },
  { offset: 0.5, opacity: 1 },
  { offset: 0.72, opacity: 1, transform: `translate(${dx}px, ${dy}px) scale(1)` },
  { offset: 0.92, opacity: 0, transform: `translate(${dx * 1.3}px, ${dy - 30}px) scale(0.6)` },
]

const BURST_TRACKS = BURST.map(burstTrack)

function Orb({ index, take, ms }: { index: number; take: number; ms: number }) {
  const ref = useRef<SVGCircleElement>(null)
  useTrack(ref, BURST_TRACKS[index], ms, take)
  return <circle ref={ref} cx={178} cy={150} r={5} fill={MYTH.orb} stroke={INK} strokeWidth={1.4} opacity={0} className={u.sceneProp} />
}

function ChestBody() {
  return (
    <>
      <path d="M142 152 L214 152 L210 192 L146 192 Z" fill={MYTH.leather} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M142 152 L214 152 M145 172 L211 172" stroke={MYTH.bronze} strokeWidth={4} />
      <path d="M160 152 L160 192 M196 152 L196 192" stroke={MYTH.bronze} strokeWidth={3} />
      <rect x={172} y={160} width={12} height={12} fill={MYTH.gold} stroke={INK} strokeWidth={1.4} />
    </>
  )
}

function Lid() {
  return (
    <>
      <path d="M138 154 Q178 124 218 154 Z" fill={MYTH.leather} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M142 150 Q178 128 214 150" fill="none" stroke={MYTH.bronze} strokeWidth={3} />
      <path d="M178 137 L178 154" stroke={MYTH.bronze} strokeWidth={3} />
    </>
  )
}

export function ChestHeave() {
  const { reduced } = useZoneStageContext()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.5 })
  const { pose, take, settle, ms } = useSceneMove('heave', triggered)
  const lidRef = useRef<SVGGElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  useTrack(lidRef, LID_TRACK, ms, take)
  useTrack(glowRef, GLOW_TRACK, ms, take)

  return (
    <div ref={ref} className="-mt-10 mb-6">
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} preserveAspectRatio="xMidYMax meet" className="block h-40 w-full sm:h-48" aria-hidden="true">
        <FigureSpace place={HIM}>
          {/* the light out of the open chest, drawn behind him */}
          <path ref={glowRef} d="M148 152 L208 152 L242 0 L114 0 Z" fill={MYTH.fireCore} opacity={reduced ? 0.85 : 0} className={`${u.sceneProp} ${u.chestGlow}`} />
          <ChestBody />
        </FigureSpace>
        <SpartanSprite key={take} profession="engineer" motion={pose} place={HIM} onDone={settle} />
        <FigureSpace place={HIM}>
          <g ref={lidRef} opacity={reduced ? 0 : 1} className={`${u.sceneProp} ${u.chestLid}`}>
            <Lid />
          </g>
          {BURST.map((_, index) => (
            <Orb key={index} index={index} take={take} ms={ms} />
          ))}
        </FigureSpace>
      </svg>
    </div>
  )
}
