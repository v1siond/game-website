import { FS } from './palette'
import look from './world.module.css'

// The versus screen's art: the clash emblem (two lightning bolts striking at one point, the moment two
// fighters meet), the round call band, and the hit spark that marks a highlight on a card.

export function ClashEmblem({ large = false }: { large?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${large ? 'h-28 w-28' : 'h-20 w-20'} ${look.pulse}`}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx={50} cy={86} rx={34} ry={8} fill={FS.p2} opacity={0.45} />
      <ellipse cx={50} cy={86} rx={20} ry={5} fill={FS.orange} opacity={0.6} />
      <path d="M14 4 L36 34 L26 36 L46 62 L34 62 L50 92 L40 56 L50 56 L34 30 L44 30 Z" fill={FS.p1Light} stroke={FS.ink} strokeWidth={2} />
      <path d="M86 4 L64 34 L74 36 L54 62 L66 62 L50 92 L60 56 L50 56 L66 30 L56 30 Z" fill={FS.p2} stroke={FS.ink} strokeWidth={2} />
      <path d="M50 40 L56 50 L50 60 L44 50 Z" fill={FS.gold} stroke={FS.ink} strokeWidth={1.5} />
    </svg>
  )
}

// The picked profession called across the stage, like the round call before a fight.
export function RoundCall({ text }: { text: string }) {
  return (
    <div className={`relative overflow-hidden py-5 text-center ${look.roundBand}`} role="status" aria-live="polite">
      <span className={`text-3xl uppercase sm:text-5xl ${look.display} ${look.roundCall}`}>{text}</span>
    </div>
  )
}

// The star of a landed hit, the bullet of a highlight or an achievement.
export function HitSpark({ color = FS.gold }: { color?: string }) {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" focusable="false">
      <path d="M8 0 L9.6 5.4 L16 6 L10.8 9.4 L12.6 16 L8 12 L3.4 16 L5.2 9.4 L0 6 L6.4 5.4 Z" fill={color} stroke={FS.ink} strokeWidth={0.8} />
    </svg>
  )
}
