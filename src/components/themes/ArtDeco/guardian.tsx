'use client'

import { useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useScrollScene } from '@/hooks/useScrollScene'
import { DECO_COLORS as C } from './palette'
import g from './guardian.module.css'

// The city's guardian and the little girl he keeps, walking their round down the street behind the
// theatre marquees. The diving suit giant stomps right to left, hunched under the round brass helmet
// with its ring of amber ports, the drill hanging from his right arm, his left hand holding hers; she
// skips beside him with the long needle and her glowing eyes. The visitor's scroll through the bands
// carries them along the street. A press on him provokes him: the ports flare red, he rears back and
// the drill spins, then he calms and walks on.
//
// Pattern: the shared scroll engine writes --scene-progress on the street, the pair's translate reads
// it; the stomp and the skip are CSS loops; the provoked state is React state keyed per press so the
// rear plays again. Reduced motion: they stand mid street, the legs still, a press only turns the ports.

const PORTS = [
  [48, 40],
  [56, 34],
  [56, 46],
  [64, 30],
  [64, 41],
  [64, 52],
] as const

function Guardian({ angry }: { angry: boolean }) {
  return (
    <g className={g.guardian}>
      <g className={g.legBack}>
        <path d="M78 112 L98 112 L100 146 L80 146 Z" fill={C.diverDark} />
        <path d="M76 144 H104 Q108 150 104 154 H74 Z" fill="#2a2a2a" />
      </g>
      <g className={g.body}>
        {/* the air tank on his back and the hose to the helmet */}
        <rect x="104" y="52" width="16" height="44" rx="6" fill={C.brassDark} stroke={C.sepia} strokeWidth="1" />
        <path d="M110 54 Q104 40 92 40" fill="none" stroke={C.sepia} strokeWidth="3" />
        {/* the hunched canvas and leather suit */}
        <path d="M38 64 Q70 50 108 62 L104 116 Q74 122 46 114 Z" fill={C.diver} stroke={C.sepia} strokeWidth="1.2" />
        <path d="M44 92 Q74 100 104 92" stroke={C.diverDark} strokeWidth="6" fill="none" />
        <rect x="68" y="90" width="12" height="9" fill={C.brassMid} />
        {/* the left arm reaching back for her hand */}
        <path d="M98 70 Q118 84 126 104 L118 108 Q108 92 94 82 Z" fill={C.diver} stroke={C.sepia} strokeWidth="1" />
        <circle cx="124" cy="108" r="5" fill={C.diverDark} />
        {/* the helmet, low between the shoulders, its ports ringing the front */}
        <circle cx="68" cy="46" r="24" fill={C.brassMid} stroke={C.brassDark} strokeWidth="3" />
        <path d="M46 56 Q68 70 90 56" fill="none" stroke={C.brassDark} strokeWidth="4" />
        {PORTS.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="4.2" fill={C.abyss} stroke={C.brassDark} strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r="3" fill={C.portCalm} className={g.port} />
            <circle cx={cx} cy={cy} r="3" fill={C.portAngry} className={g.portAngry} data-angry={angry || undefined} />
          </g>
        ))}
        {/* the drill arm, its cone pointing the way he walks */}
        <g className={g.drillArm}>
          <path d="M40 66 Q26 80 28 100 L42 102 Q42 86 52 76 Z" fill={C.diver} stroke={C.sepia} strokeWidth="1" />
          <rect x="22" y="96" width="24" height="14" rx="3" fill={C.steelShade} />
          <g className={g.drill} data-angry={angry || undefined}>
            <path d="M22 98 L0 103 L22 108 Z" fill={C.steel} stroke={C.steelShade} strokeWidth="1" />
            <path d="M18 99 L14 106 M12 100 L8 105" stroke={C.steelShade} strokeWidth="1.2" />
          </g>
        </g>
      </g>
      <g className={g.legFront}>
        <path d="M50 112 L72 112 L72 146 L52 146 Z" fill={C.diver} stroke={C.sepia} strokeWidth="1" />
        <path d="M46 144 H76 Q80 150 76 154 H44 Z" fill="#2a2a2a" />
      </g>
    </g>
  )
}

function Sister() {
  return (
    <g className={g.sister}>
      <path d="M140 146 L142 156 M150 146 L150 156" stroke={HAND_SKIN} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M136 112 L156 112 L162 148 L130 148 Z" fill={C.sisterDress} stroke={C.sepia} strokeWidth="1" />
      <path d="M136 112 Q128 108 126 108" stroke={HAND_SKIN} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="146" cy="102" r="9" fill={HAND_SKIN} />
      <path d="M136 102 Q136 90 146 90 Q157 90 156 102 Q152 96 146 96 Q140 96 136 102 Z" fill={C.sepia} />
      <circle cx="142" cy="102" r="1.4" fill={C.portCalm} />
      <circle cx="148" cy="102" r="1.4" fill={C.portCalm} />
      {/* the long needle held down at her side */}
      <path d="M155 113 Q160 120 159 128" fill="none" stroke={HAND_SKIN} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="159" cy="128" r="2.2" fill={HAND_SKIN} />
      <path d="M156 122 L166 142" stroke={C.steel} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M166 142 L170 150" stroke={C.ivory} strokeWidth="0.9" />
    </g>
  )
}

const HAND_SKIN = '#e9c4a4'

/** The street behind the marquees, where the guardian pair walks as the visitor scrolls. */
export function GuardianStreet({ children }: { children: ReactNode }) {
  const { deco } = useLabels()
  const { ref } = useScrollScene<HTMLDivElement>({ start: 0.95, end: 0 })
  const [provoked, setProvoked] = useState(0)

  return (
    <div ref={ref}>
      <div className={`relative h-36 sm:h-44 ${g.street}`}>
        <button
          type="button"
          onClick={() => setProvoked((n) => n + 1)}
          aria-label={deco.provoke}
          className={`absolute bottom-0 left-0 h-32 w-44 sm:h-40 sm:w-52 ${g.pair}`}
        >
          <svg key={provoked} viewBox="0 0 180 160" className={`h-full w-full ${provoked > 0 ? g.provoked : ''}`} aria-hidden="true" focusable="false">
            <ellipse cx="90" cy="155" rx="80" ry="4" fill={C.abyss} opacity="0.6" />
            <Sister />
            <Guardian angry={provoked > 0} />
          </svg>
        </button>
      </div>
      <div className="relative z-10 -mt-6 sm:-mt-10">{children}</div>
    </div>
  )
}
