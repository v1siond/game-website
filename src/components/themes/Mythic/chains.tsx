'use client'

import { useRef, type ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SpartanSprite } from './sprite'
import { useSceneMove, useTrack } from './track'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The about as a slab he drags in: in the hall's band over the text he winds the blades back and flings
// them on their chains across the hall, they bite into a carved slab at the far side, and he leans back and
// hauls it towards him; the about text then slides in on its own slab under the scene. The chains and the
// slab keep to his hands through the 'haul' keys of rig.ts (hand positions read off those keys).

const SCENE = { width: 320, height: 160 }
const HIM = { x: 4, y: 4, height: 156 }

// His hands in the scene at the throw (0.28) and at the end of the haul (0.82).
const HAND_OUT = { x: 132, y: 69 }
const SLAB_X = 280
const HAUL = 70

const CHAIN_TRACK: Keyframe[] = [
  { offset: 0, opacity: 0, transform: 'scaleX(0)', transformOrigin: `${HAND_OUT.x}px ${HAND_OUT.y}px` },
  { offset: 0.14, opacity: 0, transform: 'scaleX(0)' },
  { offset: 0.2, opacity: 1 },
  { offset: 0.28, transform: 'scaleX(1)' },
  { offset: 0.5, transform: 'scaleX(1)' },
  { offset: 0.82, opacity: 1, transform: 'translate(-43px, 5px) scaleX(0.82)' },
  { offset: 0.94, opacity: 0, transform: 'translate(-43px, 5px) scaleX(0.82)', transformOrigin: `${HAND_OUT.x}px ${HAND_OUT.y}px` },
]

const SLAB_TRACK: Keyframe[] = [
  { offset: 0, transform: 'translateX(0)' },
  { offset: 0.5, transform: 'translateX(0)' },
  { offset: 0.56, transform: 'translateX(6px)' },
  { offset: 0.82, transform: `translateX(-${HAUL}px)` },
  { offset: 1, transform: `translateX(-${HAUL}px)` },
]

// A run of chain links from his hand to the slab, the near and the far one a little apart.
function Chain({ dy }: { dy: number }) {
  const y = HAND_OUT.y + dy
  return (
    <>
      <path d={`M${HAND_OUT.x} ${y} L${SLAB_X} ${y - 4}`} stroke={MYTH.inkLine} strokeWidth={4.4} strokeLinecap="round" />
      <path d={`M${HAND_OUT.x} ${y} L${SLAB_X} ${y - 4}`} stroke={MYTH.steel} strokeWidth={2.4} strokeDasharray="5 3" />
      <path d={`M${SLAB_X - 12} ${y - 9} L${SLAB_X + 2} ${y - 4} L${SLAB_X - 12} ${y + 1} Z`} fill={MYTH.steel} stroke={MYTH.inkLine} strokeWidth={1.4} />
    </>
  )
}

function Slab() {
  return (
    <>
      <path d={`M${SLAB_X} 34 L${SLAB_X + 36} 30 L${SLAB_X + 38} 154 L${SLAB_X - 2} 154 Z`} fill={MYTH.columnLight} stroke={MYTH.inkLine} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M${SLAB_X + 6} 50 L${SLAB_X + 30} 48 M${SLAB_X + 6} 64 L${SLAB_X + 30} 62 M${SLAB_X + 6} 78 L${SLAB_X + 24} 76 M${SLAB_X + 6} 92 L${SLAB_X + 30} 90`} stroke={MYTH.inkSoft} strokeWidth={2} />
      <path d={`M${SLAB_X + 10} 116 Q${SLAB_X + 18} 104 ${SLAB_X + 26} 116 Q${SLAB_X + 18} 128 ${SLAB_X + 10} 116 Z`} fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth={1.4} />
    </>
  )
}

export function ChainHaul({ children }: { children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.4 })
  const { pose, take, settle, ms } = useSceneMove('haul', triggered)
  const chainRef = useRef<SVGGElement>(null)
  const slabRef = useRef<SVGGElement>(null)
  useTrack(chainRef, CHAIN_TRACK, ms, take)
  useTrack(slabRef, SLAB_TRACK, ms, take)

  return (
    <div ref={ref} className="max-w-3xl">
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} preserveAspectRatio="xMidYMax meet" className="block h-40 w-full sm:h-48" aria-hidden="true">
        <path d={`M0 ${SCENE.height - 4} L${SCENE.width} ${SCENE.height - 4}`} stroke={MYTH.goldDeep} strokeWidth={3} />
        <g ref={slabRef} className={u.sceneProp}>
          <Slab />
        </g>
        <g ref={chainRef} opacity={0} className={u.sceneProp}>
          <Chain dy={0} />
          <Chain dy={4} />
        </g>
        <SpartanSprite key={take} profession="engineer" motion={pose} place={HIM} onDone={settle} />
      </svg>
      <div className={`p-6 ${u.panel} ${u.hauled}`}>{children}</div>
    </div>
  )
}
