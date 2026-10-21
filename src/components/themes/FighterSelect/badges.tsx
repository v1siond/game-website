import { useId, type ReactNode } from 'react'
import { FS } from './palette'
import look from './world.module.css'

// The versus screen's art: the VS burst (a red jagged blast with the two letters lit yellow to orange,
// the mark between the two portraits before a fight), the call lettering, the KO badge at the centre of
// the HUD, the round win orb, the round call band, the hit spark that marks a highlight on a card and the
// impact burst of a landed hit.

// Any call in the round call lettering, on an inline span so it lights line by line (world.module.css).
export function CallText({ children }: { children: ReactNode }) {
  return <span className={look.call}>{children}</span>
}

// Sixteen points round the blast, long and short in turn, a little uneven like a hand cut sticker.
const BLAST = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2
  const radius = i % 2 === 0 ? 48 - (i % 3) * 3 : 30
  return `${(50 + Math.cos(angle) * radius).toFixed(1)} ${(50 + Math.sin(angle) * radius * 0.78).toFixed(1)}`
}).join(' L')

export function ClashEmblem({ large = false }: { large?: boolean }) {
  const letters = `${useId()}-vs`

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${large ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-20 w-20'} ${look.pulse}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={letters} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={FS.callTop} />
          <stop offset="45%" stopColor={FS.hudYellow} />
          <stop offset="100%" stopColor={FS.callBottom} />
        </linearGradient>
      </defs>
      <path d={`M${BLAST} Z`} fill={FS.hudRed} stroke={FS.ink} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${BLAST} Z`} fill={FS.ko} transform="translate(50 50) scale(0.7) translate(-50 -50)" />
      <text
        x={50}
        y={63}
        textAnchor="middle"
        fontSize={38}
        fontStyle="italic"
        className={look.face}
        fill={`url(#${letters})`}
        stroke={FS.navy}
        strokeWidth={3}
        paintOrder="stroke"
      >
        VS
      </text>
    </svg>
  )
}

// The KO badge at the heart of the fight HUD: red, ruled white, the two letters in white over navy.
export function KoBadge() {
  return (
    <span className={`inline-grid h-7 w-11 place-items-center border-2 border-white bg-[color:var(--fs-ko)] text-base leading-none text-white shadow-[0_0_0_2px_#000] ${look.display}`} aria-hidden="true">
      KO
    </span>
  )
}

// A round won: the glossy orb lit beside the life bar.
export function WinOrb({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <circle cx={12} cy={12} r={10.5} fill={FS.callBottom} stroke={FS.ink} strokeWidth={1.5} />
      <circle cx={12} cy={12} r={7.5} fill={FS.hudYellow} />
      <ellipse cx={9.5} cy={8.5} rx={3.2} ry={2.2} fill={FS.flash} opacity={0.9} />
    </svg>
  )
}

// The picked profession called across the stage, like the round call before a fight.
export function RoundCall({ text }: { text: string }) {
  return (
    <div className={`relative overflow-hidden px-3 py-4 text-center ${look.roundBand}`} role="status" aria-live="polite">
      <span className="text-[clamp(1.75rem,7vw,3rem)] uppercase leading-tight">
        <CallText>{text}</CallText>
      </span>
    </div>
  )
}

// The star of a landed hit, the bullet of a highlight or an achievement.
export function HitSpark({ color = FS.hudYellow }: { color?: string }) {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" focusable="false">
      <path d="M8 0 L9.6 5.4 L16 6 L10.8 9.4 L12.6 16 L8 12 L3.4 16 L5.2 9.4 L0 6 L6.4 5.4 Z" fill={color} stroke={FS.ink} strokeWidth={0.8} />
    </svg>
  )
}

// The burst where a hit lands: twelve rays, long and short in turn, round a white hot core, the shape a
// fighting game paints for a frame or two at the point of contact (a sharp starburst, not a star).
const RAYS = Array.from({ length: 12 }, (_, i) => ({ angle: i * 30, long: i % 2 === 0 }))

export function ImpactBurst({ className }: { className: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true" focusable="false">
      {RAYS.map(({ angle, long }) => (
        <path
          key={angle}
          d={long ? 'M-5 -12 L0 -50 L5 -12 Z' : 'M-4 -10 L0 -32 L4 -10 Z'}
          fill={long ? FS.hudYellow : FS.orange}
          stroke={FS.ink}
          strokeWidth={1.5}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r={15} fill={FS.orange} />
      <circle r={9} fill={FS.flash} />
    </svg>
  )
}
