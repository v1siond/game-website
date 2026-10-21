import { ClashEmblem } from './badges'
import { FS } from './palette'

// The art between sections: a lightning line, the clash emblem, and a band of three stars like the round
// wins of a match.

export function LightningLine() {
  return (
    <div className="my-8 h-12" aria-hidden="true">
      <svg viewBox="0 0 1000 50" preserveAspectRatio="none" className="h-full w-full" focusable="false">
        <path
          d="M0 25 H200 L220 10 L240 40 L260 10 L280 40 L300 10 L320 40 L340 25 H500 L520 10 L540 40 L560 10 L580 40 L600 10 L620 40 L640 25 H800 L820 10 L840 40 L860 10 L880 40 L900 10 L920 40 L940 25 H1000"
          fill="none"
          stroke={FS.gold}
          strokeWidth={2}
        />
      </svg>
    </div>
  )
}

export function ClashSeparator() {
  return (
    <div className="flex justify-center py-8">
      <ClashEmblem large />
    </div>
  )
}

const STAR = 'M12 0 L14.6 8.2 L24 9 L16.8 14.4 L19.4 24 L12 18.4 L4.6 24 L7.2 14.4 L0 9 L9.4 8.2 Z'

export function RoundWins() {
  return (
    <div className="my-8 flex h-16 items-center justify-center gap-8 bg-gradient-to-r from-transparent via-[#ff2e4d]/25 to-transparent" aria-hidden="true">
      {[0, 1, 2].map((win) => (
        <svg key={win} viewBox="0 0 24 24" className="h-7 w-7" focusable="false">
          <path d={STAR} fill={FS.gold} stroke={FS.ink} strokeWidth={1} />
        </svg>
      ))}
    </div>
  )
}
