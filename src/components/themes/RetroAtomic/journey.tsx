'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ShelterBackdrop } from './backdrop'
import { DwellerSprite } from './dweller'
import { DogSprite } from './dog'
import { DUST, DUST_DARK, INK, OLIVE_DARK, RUST, STEEL, WARNING_RED } from './palette'
import j from './journey.module.css'

// The walk out of the shelter, behind the whole page. The page keeps one zone (shelter, wasteland,
// town); every section stage hands its zone up through the shared useZoneStage while it is in view. The
// fixed backdrop crossfades to that zone (opacity only), and on the ground strip at the foot of the screen
// he walks to the zone's spot (left by the door, the middle of the wasteland, right at the town), the dog
// trotting a step behind; when he arrives he stands and the dog sits. Under reduced motion the move and
// the crossfade are instant (journey.module.css).

export type Zone = 'shelter' | 'wasteland' | 'town'

const WALK_MS = 2400

function WastelandLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" focusable="false">
      <defs>
        <linearGradient id="atomic-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a9a6a" />
          <stop offset="55%" stopColor="#d9d099" />
          <stop offset="100%" stopColor="#dec284" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#atomic-haze)" />
      <circle cx="1060" cy="300" r="70" fill="#fff0a6" opacity="0.55" />
      <path d="M0 640 L120 600 L260 625 L420 585 L600 620 L780 590 L980 615 L1180 580 L1440 610 V900 H0 Z" fill="#a4986a" />
      {[180, 520, 1260].map((x) => (
        <path key={x} d={`M${x} 620 L${x + 14} 470 L${x + 28} 620 M${x + 4} 520 H${x + 24} M${x + 8} 490 H${x + 20}`} stroke={STEEL} strokeWidth="5" fill="none" />
      ))}
      <g transform="translate(860 560)" fill={DUST_DARK}>
        <path d="M0 50 Q30 -10 60 50 Z" />
        <rect x="27" y="40" width="6" height="30" />
      </g>
      {[80, 330, 700, 1000, 1380].map((x) => (
        <path key={x} d={`M${x} 700 V600 M${x} 640 L${x - 18} 618 M${x} 625 L${x + 16} 605`} stroke={INK} strokeWidth="4" fill="none" opacity="0.7" />
      ))}
      <path d="M0 720 Q360 690 720 715 T1440 705 V900 H0 Z" fill={DUST} />
      <path d="M0 800 Q400 770 800 790 T1440 785 V900 H0 Z" fill={DUST_DARK} />
    </svg>
  )
}

function TownLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" focusable="false">
      <defs>
        <linearGradient id="atomic-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1626" />
          <stop offset="60%" stopColor="#7a3a2a" />
          <stop offset="100%" stopColor="#d8843f" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#atomic-dusk)" />
      {[[60, 380, 120], [220, 420, 80], [1180, 340, 110], [1320, 400, 90]].map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height={900 - y} fill="#2a1e22" />
      ))}
      <g fill={OLIVE_DARK} stroke={INK} strokeWidth="3">
        <path d="M380 560 H600 V520 H560 V500 H420 V520 H380 Z" />
        <rect x="380" y="560" width="220" height="180" />
        <path d="M660 540 H860 V740 H660 Z" fill={RUST} />
        <path d="M900 520 L960 480 L1020 520 V740 H900 Z" fill="#4b7a5a" />
      </g>
      <rect x="430" y="510" width="120" height="30" fill="#e6d7a8" />
      <rect x="700" y="580" width="120" height="16" fill={WARNING_RED} className={j.neon} />
      <path d="M948 560 L960 548 L972 560 L960 572 Z" fill="#e6d7a8" />
      {[340, 640, 1080].map((x) => (
        <path key={x} d={`M${x} 760 V470 M${x - 20} 490 H${x + 20}`} stroke="#3a2a1c" strokeWidth="6" />
      ))}
      <path d="M340 490 Q490 530 640 490 Q860 530 1080 490" stroke={INK} strokeWidth="2" fill="none" />
      <path d="M0 740 H1440 V900 H0 Z" fill="#3a2f26" />
      <path d="M0 760 H1440" stroke="#5e5040" strokeWidth="3" strokeDasharray="40 30" />
    </svg>
  )
}

/** The fixed backdrop: the shelter, the wasteland and the town, the zone in view shown. */
export const JourneyBackdrop = memo(function JourneyBackdrop({ zone }: { zone: Zone }) {
  return (
    <>
      <ShelterBackdrop />
      <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${j.zone}`} data-shown={zone === 'wasteland' || undefined} aria-hidden="true">
        <WastelandLayer />
      </div>
      <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${j.zone}`} data-shown={zone === 'town' || undefined} aria-hidden="true">
        <TownLayer />
      </div>
    </>
  )
})

/** He and the dog on the ground strip, walking to the zone in view. */
export function Wanderer({ zone }: { zone: Zone }) {
  const { active } = useProfession()
  const [walking, setWalking] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setWalking(true)
    const timer = window.setTimeout(() => setWalking(false), WALK_MS)
    return () => window.clearTimeout(timer)
  }, [zone])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-24 sm:h-28" aria-hidden="true">
      <div className={j.walker} data-zone={zone}>
        <DogSprite motion={walking ? 'trot' : 'sit'} className={`absolute bottom-1 left-0 h-10 w-14 sm:h-12 sm:w-[4.5rem] ${j.follower}`} />
        <DwellerSprite profession={active} motion={walking ? 'walk' : 'idle'} className="absolute bottom-0 left-12 h-20 w-14 sm:left-16 sm:h-24 sm:w-16" />
      </div>
    </div>
  )
}
