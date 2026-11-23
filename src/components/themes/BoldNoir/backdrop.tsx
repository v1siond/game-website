import type { CSSProperties } from 'react'
import { NameWords } from '@/components/cv/NameWords'
import { NOIR } from './palette'
import page from './page.module.css'

// Bold Noir's small static art for the cards, all flat fills: the star burst, the hit star and the ransom
// note lettering. The night behind the page is the theatre's (street.tsx).

const RAYS = 18

const rayPoint = (angle: number) => `${100 + Math.cos(angle) * 140},${100 + Math.sin(angle) * 140}`

// The burst's rays as polygon points, worked out once: each ray a half step wide round the 200 by 200 box's centre.
const RAY_POINTS = Array.from({ length: RAYS }, (_, i) => `100,100 ${rayPoint((i / RAYS) * Math.PI * 2)} ${rayPoint(((i + 0.5) / RAYS) * Math.PI * 2)}`)

/** A star burst of alternating ink and red rays, drawn in a 200 by 200 box round its centre. */
export function StarBurst({ className, light = NOIR.red, dark = NOIR.ink }: { className: string; light?: string; dark?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      {RAY_POINTS.map((points, i) => (
        <polygon key={i} points={points} fill={i % 2 ? dark : light} />
      ))}
    </svg>
  )
}

/** A jagged star, the hit spark behind an achievement or a pick. */
export function HitStar({ className, fill = NOIR.red, edge = NOIR.paper }: { className: string; fill?: string; edge?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path
        d="M50 2 L60 32 L92 14 L72 44 L98 54 L68 62 L84 92 L54 72 L44 98 L38 68 L8 84 L26 56 L2 42 L32 38 L18 8 L44 30 Z"
        fill={fill}
        stroke={edge}
        strokeWidth={3}
        strokeLinejoin="miter"
      />
    </svg>
  )
}

// The cut of each letter by its place in the word: most are boxed in their own print, some are left bare
// so the word stays uneven; each sits at its own tilt, baseline and size.
const LETTER_LOOKS = [page.letterInk, page.letterPaper, page.letterRed, page.letterBare, page.letterPaper, page.letterInk, page.letterBare]
const LETTER_TILTS = [-6, 4, -3, 7, -8, 2, 5, -4, 3, -7, 6, -2]
const LETTER_DROPS = ['0em', '0.08em', '-0.06em', '0.12em', '-0.1em', '0.04em', '0.1em', '-0.04em']
const LETTER_SIZES = ['text-[1em]', 'text-[0.86em]', 'text-[1.12em]', 'text-[0.94em]', 'text-[1.06em]']

/** The star that fills a word gap in ransom lettering. */
function GapStar() {
  return (
    <svg viewBox="0 0 20 20" className="h-[0.45em] w-[0.45em] self-center" aria-hidden="true" focusable="false">
      <path d="M10 0 L12.6 7.4 L20 10 L12.6 12.6 L10 20 L7.4 12.6 L0 10 L7.4 7.4 Z" fill={NOIR.red} />
    </svg>
  )
}

/**
 * A word in ransom note lettering: letters cut from different prints, some boxed, some bare, a star in
 * each gap. Each word stays whole on its line; the row wraps only at a star. The letters are hidden from screen readers; the word is read whole.
 */
export function RansomWord({ text, className = '', letterClassName = '' }: { text: string; className?: string; letterClassName?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap items-end gap-x-[0.08em] gap-y-2">
        <NameWords
          name={text}
          gap={<GapStar />}
          wordClassName="inline-flex items-end gap-x-[0.08em]"
          letter={(char, i) => (
            <span
              className={`${page.letter} ${LETTER_LOOKS[i % LETTER_LOOKS.length]} ${LETTER_SIZES[i % LETTER_SIZES.length]} px-[0.12em] leading-none ${letterClassName}`}
              style={
                {
                  '--r': `${LETTER_TILTS[i % LETTER_TILTS.length]}deg`,
                  '--y': LETTER_DROPS[i % LETTER_DROPS.length],
                } as CSSProperties
              }
            >
              {char}
            </span>
          )}
        />
      </span>
    </span>
  )
}
