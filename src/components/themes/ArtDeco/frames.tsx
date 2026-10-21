import type { CSSProperties, ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { DECO_COLORS } from './palette'
import look from './world.module.css'

// The world's gold lettering, the deco dividers between sections, and the brass frame every section
// sits in.

// Gold neon lettering. A `flicker` sign is one of the city's failing signs: it dips twice every few
// seconds, starting `delay` into its cycle (opacity only, still under reduced motion).
export function NeonSign({
  text,
  className = '',
  flicker = false,
  delay = '0s',
}: {
  text: string
  className?: string
  flicker?: boolean
  delay?: string
}) {
  return (
    <span
      className={`relative ${look.neon} ${flicker ? look.flicker : ''} ${className}`}
      style={flicker ? ({ '--delay': delay } as CSSProperties) : undefined}
    >
      {text}
    </span>
  )
}

// ============================================================================
// ART DECO SUNBURST DIVIDER - Section separator
// ============================================================================
export function ArtDecoSunburst({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`} aria-hidden="true">
      <svg width="400" height="80" viewBox="0 0 400 80" className="max-w-full">
        {/* Center Circle */}
        <circle cx="200" cy="40" r="15" fill="none" stroke={DECO_COLORS.gold} strokeWidth="2" />
        <circle cx="200" cy="40" r="10" fill={DECO_COLORS.gold} opacity="0.3" />
        <circle cx="200" cy="40" r="5" fill={DECO_COLORS.goldBright} opacity="0.6" />

        {/* Sunburst Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180
          const innerR = 20
          const outerR = 40 + (i % 2) * 15
          return (
            <line
              key={i}
              x1={200 + Math.cos(angle) * innerR}
              y1={40 + Math.sin(angle) * innerR}
              x2={200 + Math.cos(angle) * outerR}
              y2={40 + Math.sin(angle) * outerR}
              stroke={DECO_COLORS.gold}
              strokeWidth={i % 2 === 0 ? 2 : 1}
              opacity={i % 2 === 0 ? 0.8 : 0.5}
            />
          )
        })}

        {/* Horizontal Lines extending outward */}
        <line x1="0" y1="40" x2="140" y2="40" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.5" />
        <line x1="260" y1="40" x2="400" y2="40" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.5" />

        {/* Art Deco Fan Ends */}
        <path d="M0 40 L15 30 M0 40 L15 50" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.4" />
        <path d="M400 40 L385 30 M400 40 L385 50" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.4" />

        {/* Diamond Accents */}
        <path d="M80 40 L90 35 L100 40 L90 45 Z" fill={DECO_COLORS.gold} opacity="0.4" />
        <path d="M300 40 L310 35 L320 40 L310 45 Z" fill={DECO_COLORS.gold} opacity="0.4" />
      </svg>
    </div>
  )
}

// ============================================================================
// ART DECO CHEVRON DIVIDER - Alternative section separator
// ============================================================================
export function ArtDecoChevron({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-6 ${className}`} aria-hidden="true">
      <svg width="500" height="60" viewBox="0 0 500 60" className="max-w-full">
        {/* Center Chevron Stack */}
        <path d="M230 30 L250 10 L270 30" fill="none" stroke={DECO_COLORS.gold} strokeWidth="2" />
        <path d="M220 40 L250 15 L280 40" fill="none" stroke={DECO_COLORS.gold} strokeWidth="1.5" opacity="0.7" />
        <path d="M210 50 L250 20 L290 50" fill="none" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.5" />

        {/* Side Lines */}
        <line x1="0" y1="30" x2="200" y2="30" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="30" x2="500" y2="30" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.4" />

        {/* Decorative Diamonds */}
        <path d="M50 30 L55 25 L60 30 L55 35 Z" fill={DECO_COLORS.gold} opacity="0.5" />
        <path d="M440 30 L445 25 L450 30 L445 35 Z" fill={DECO_COLORS.gold} opacity="0.5" />

        {/* Small Circles */}
        <circle cx="100" cy="30" r="3" fill={DECO_COLORS.gold} opacity="0.4" />
        <circle cx="150" cy="30" r="2" fill={DECO_COLORS.gold} opacity="0.3" />
        <circle cx="350" cy="30" r="2" fill={DECO_COLORS.gold} opacity="0.3" />
        <circle cx="400" cy="30" r="3" fill={DECO_COLORS.gold} opacity="0.4" />
      </svg>
    </div>
  )
}

// ============================================================================
// ART DECO FAN DIVIDER - Third section separator style
// ============================================================================
export function ArtDecoFan({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`} aria-hidden="true">
      <svg width="300" height="80" viewBox="0 0 300 80" className="max-w-full">
        {/* Central Fan */}
        <path d="M150 70 L150 40" stroke={DECO_COLORS.gold} strokeWidth="2" />
        <path d="M150 70 L130 30" stroke={DECO_COLORS.gold} strokeWidth="1.5" opacity="0.8" />
        <path d="M150 70 L170 30" stroke={DECO_COLORS.gold} strokeWidth="1.5" opacity="0.8" />
        <path d="M150 70 L110 40" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.6" />
        <path d="M150 70 L190 40" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.6" />
        <path d="M150 70 L95 55" stroke={DECO_COLORS.gold} strokeWidth="0.8" opacity="0.4" />
        <path d="M150 70 L205 55" stroke={DECO_COLORS.gold} strokeWidth="0.8" opacity="0.4" />

        {/* Fan Arc */}
        <path d="M95 55 Q150 20 205 55" fill="none" stroke={DECO_COLORS.gold} strokeWidth="1.5" />

        {/* Base */}
        <circle cx="150" cy="70" r="8" fill="none" stroke={DECO_COLORS.gold} strokeWidth="2" />
        <circle cx="150" cy="70" r="4" fill={DECO_COLORS.gold} opacity="0.5" />

        {/* Side Lines */}
        <line x1="0" y1="70" x2="130" y2="70" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.4" />
        <line x1="170" y1="70" x2="300" y2="70" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.4" />

        {/* End Accents */}
        <circle cx="20" cy="70" r="3" fill={DECO_COLORS.gold} opacity="0.4" />
        <circle cx="280" cy="70" r="3" fill={DECO_COLORS.gold} opacity="0.4" />
      </svg>
    </div>
  )
}

// The brass L bracket with its fan motif and rivets, drawn for the top left corner and mirrored into
// the other three.
const CORNER_PLACE = {
  tl: '-top-1 -left-1',
  tr: '-top-1 -right-1 -scale-x-100',
  bl: '-bottom-1 -left-1 -scale-y-100',
  br: '-bottom-1 -right-1 rotate-180',
} as const

const RIVETS = [
  { at: 20, r: 2.5, opacity: 0.6 },
  { at: 40, r: 2, opacity: 0.4 },
  { at: 60, r: 1.5, opacity: 0.3 },
]

export function BrassCornerFiligree({ position }: { position: keyof typeof CORNER_PLACE }) {
  return (
    <svg className={`pointer-events-none absolute h-20 w-20 ${CORNER_PLACE[position]}`} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <path d="M5,75 L5,5 L75,5" fill="none" stroke="url(#brass-gradient)" strokeWidth="3" />
      <path d="M12,68 L12,12 L68,12" fill="none" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.5" />
      <path d="M5,5 L25,25 M5,5 L30,15 M5,5 L15,30" stroke={DECO_COLORS.gold} strokeWidth="0.8" opacity="0.55" />
      <path d="M5,5 L12,-2 L19,5 L12,12 Z" fill={DECO_COLORS.gold} opacity="0.7" />
      {RIVETS.map(({ at, r, opacity }) => (
        <g key={at} fill={DECO_COLORS.gold} opacity={opacity}>
          <circle cx={at} cy={5} r={r} />
          <circle cx={5} cy={at} r={r} />
        </g>
      ))}
      <circle cx="15" cy="15" r="2" fill={DECO_COLORS.goldBright} opacity="0.4" />
    </svg>
  )
}

// The brass frame a section sits in. With a title it is a labelled section whose heading is gold neon
// between two deco rules; without one (the contact panel) it is a plain framed block.
export function GoldFrame({ children, title }: { children: ReactNode; title?: string }) {
  const id = title ? headingId('deco', title) : undefined
  const Tag = title ? 'section' : 'div'

  return (
    <Tag className="relative" aria-labelledby={id}>
      <BrassCornerFiligree position="tl" />
      <BrassCornerFiligree position="tr" />
      <BrassCornerFiligree position="bl" />
      <BrassCornerFiligree position="br" />

      <div className={`relative overflow-hidden border-[3px] border-[#D4AF37] p-5 sm:p-8 ${look.frame}`}>
        <div className={`pointer-events-none absolute inset-0 ${look.frameLight}`} aria-hidden="true" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <rect width="100%" height="100%" fill="url(#deco-diamonds)" />
        </svg>
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" aria-hidden="true" focusable="false">
          <rect width="100%" height="100%" fill="url(#pressure-cracks)" />
        </svg>
        <div className="pointer-events-none absolute inset-[3px] border border-[#D4AF37]/20" aria-hidden="true" />

        {title && (
          <div className="relative z-10 mb-6 border-b border-[#D4AF37]/25 pb-4 text-center">
            <h2 id={id} className="relative inline-block text-lg uppercase tracking-[0.4em]">
              <span className="absolute left-0 top-1/2 hidden h-px w-12 -translate-x-[calc(100%_+_1rem)] -translate-y-1/2 bg-gradient-to-r from-transparent to-[#D4AF37] sm:block" aria-hidden="true" />
              <NeonSign text={title} />
              <span className="absolute right-0 top-1/2 hidden h-px w-12 -translate-y-1/2 translate-x-[calc(100%_+_1rem)] bg-gradient-to-r from-[#D4AF37] to-transparent sm:block" aria-hidden="true" />
            </h2>
            <svg className="mx-auto mt-2" width="60" height="15" viewBox="0 0 60 15" aria-hidden="true" focusable="false">
              <path d="M0 7.5 L20 7.5 L25 2 L30 7.5 L35 2 L40 7.5 L60 7.5" fill="none" stroke={DECO_COLORS.gold} strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </div>
    </Tag>
  )
}
