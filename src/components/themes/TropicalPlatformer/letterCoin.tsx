'use client'

import { COLORS as C } from './palette'
import coins from './letters.module.css'

// The letters of his first name as the source's gold letter pickups (letters.ts says where they hide):
// the coin a letter spins on, the tracker of slots that fill as they are found, and the red balloon,
// the extra life, that floats up when all four are in.

export function LetterCoin({ letter }: { letter: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" fill={C.letter} stroke={C.barkDark} strokeWidth="3" />
      <circle cx="20" cy="20" r="13" fill="none" stroke={C.sunCore} strokeWidth="1.5" opacity="0.8" />
      <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="900" fill={C.barkDark} fontFamily="Arial Black, sans-serif">
        {letter}
      </text>
    </svg>
  )
}

/** A letter waiting on its card, spinning; once found it flies up and fades. */
export function HiddenCoin({ letter, found }: { letter: string; found: boolean }) {
  return (
    <span className={`block h-11 w-11 ${found ? coins.flown : coins.coin}`} aria-hidden="true">
      <LetterCoin letter={letter} />
    </span>
  )
}

export function LetterTracker({ letters, found }: { letters: string[]; found: ReadonlySet<number> }) {
  return (
    <ol className="flex justify-center gap-3" aria-hidden="true">
      {letters.map((letter, index) => (
        <li key={index} data-found={found.has(index) || undefined} className={`flex h-12 w-12 items-center justify-center rounded-full ${coins.slot}`}>
          {found.has(index) && (
            <span className={`block h-full w-full ${coins.landed}`}>
              <LetterCoin letter={letter} />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

export function ExtraLifeBalloon() {
  return (
    <svg viewBox="0 0 40 60" className={`pointer-events-none absolute -top-4 right-6 h-16 w-10 ${coins.balloon}`} aria-hidden="true" focusable="false">
      <path d="M20 2 C31 2 37 11 37 20 C37 31 28 39 20 40 C12 39 3 31 3 20 C3 11 9 2 20 2 Z" fill={C.target} />
      <ellipse cx="13" cy="13" rx="4" ry="6" fill={C.burst} opacity="0.5" />
      <path d="M17 40 L23 40 L20 44 Z M20 44 Q16 50 20 54 T20 60" fill="none" stroke={C.parchment} strokeWidth="1.5" />
    </svg>
  )
}
