'use client'

import { ScrollScene } from '@/components/scroll/ScrollScene'
import scene from '@/components/scroll/heroScene.module.css'
import { SH } from './palette'
import styles from './scenes.module.css'

// The save room props and the two breaks between the world's sections:
// - SaveRoomBreak: the typewriter on its desk between two ink ribbons, the item chest beside it, still.
// - DoorBreak: the door transition between rooms; as it scrolls into view the two leaves swing open on
//   the lit room behind, once, and reduced motion shows it open.

export function Typewriter({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" focusable="false">
      <rect x={10} y={55} width={100} height={8} rx={2} fill={SH.sepia} />
      <rect x={5} y={63} width={110} height={4} fill={SH.wood} />
      <rect x={25} y={25} width={70} height={30} rx={3} fill={SH.paper} />
      <rect x={28} y={28} width={64} height={24} rx={2} fill={SH.shadow} />
      <rect x={35} y={15} width={50} height={18} fill={SH.ivory} />
      <path d="M38 18.5 H82 M38 22.5 H78 M38 26.5 H73" stroke={SH.sepia} strokeWidth={1} opacity={0.4} />
      <rect x={30} y={12} width={60} height={5} rx={2} fill={SH.wood} />
      <rect x={32} y={42} width={56} height={8} rx={1} fill={SH.void} />
      <path d="M90 20 L100 15 L102 18 L92 23" fill={SH.wood} />
    </svg>
  )
}

export function InkRibbon() {
  return (
    <svg viewBox="0 0 40 24" className="h-6 w-10" aria-hidden="true" focusable="false">
      <rect x={5} y={4} width={30} height={16} rx={2} fill={SH.paper} />
      <circle cx={12} cy={12} r={4} fill={SH.void} />
      <circle cx={28} cy={12} r={4} fill={SH.void} />
      <rect x={16} y={10} width={8} height={4} fill={SH.shadow} />
      <circle cx={12} cy={12} r={2.5} fill="none" stroke={SH.brass} strokeWidth={0.5} />
      <circle cx={28} cy={12} r={2.5} fill="none" stroke={SH.brass} strokeWidth={0.5} />
    </svg>
  )
}

// The wooden item chest of the save room, its lid banded in iron.
function ItemChest() {
  return (
    <svg viewBox="0 0 64 44" className="h-11 w-16" aria-hidden="true" focusable="false">
      <path d="M4 16 Q32 2 60 16 V20 H4 Z" fill={SH.rust} stroke={SH.void} strokeWidth={1} />
      <rect x={4} y={20} width={56} height={22} fill={SH.wood} stroke={SH.void} strokeWidth={1} />
      <path d="M14 10 V42 M50 10 V42" stroke={SH.steel} strokeWidth={3} />
      <rect x={28} y={18} width={8} height={9} rx={1} fill={SH.brass} />
    </svg>
  )
}

const BREAK = 'relative my-8 flex items-center justify-center gap-6 border-y border-[color:var(--sh-sepia)] py-10 sm:gap-8'

export function SaveRoomBreak() {
  return (
    <div className={BREAK} aria-hidden="true">
      <InkRibbon />
      <Typewriter className="h-20 w-28 opacity-80" />
      <ItemChest />
      <InkRibbon />
    </div>
  )
}

const DOOR_LINES = { start: 0.95, end: 0.45 }

// One door leaf: a raised panel above, a raised panel below, the brass handle on the meeting edge.
export function DoorLeaf({ side }: { side: 'left' | 'right' }) {
  const handleX = side === 'left' ? 52 : 8
  return (
    <svg
      viewBox="0 0 60 120"
      preserveAspectRatio="none"
      className={`absolute inset-y-0 h-full w-1/2 ${side === 'left' ? `left-0 ${styles.leafLeft}` : `right-0 ${styles.leafRight}`}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={60} height={120} fill={SH.wood} stroke={SH.void} strokeWidth={2} />
      <rect x={10} y={10} width={40} height={46} fill={SH.sepia} stroke={SH.void} strokeWidth={1} />
      <rect x={10} y={66} width={40} height={44} fill={SH.sepia} stroke={SH.void} strokeWidth={1} />
      <circle cx={handleX} cy={62} r={3} fill={SH.brass} />
    </svg>
  )
}

export function DoorBreak() {
  return (
    <ScrollScene reveal={false} className={`my-8 ${scene.scene}`} {...DOOR_LINES}>
      <div className="relative mx-auto h-36 w-32 border-4 border-[color:var(--sh-wood)] bg-[color:var(--sh-void)] sm:h-44 sm:w-40" aria-hidden="true">
        <div className={`absolute inset-0 ${styles.roomBeyond}`} />
        <Typewriter className="absolute inset-x-4 bottom-2 h-12" />
        <DoorLeaf side="left" />
        <DoorLeaf side="right" />
      </div>
    </ScrollScene>
  )
}
