import type { ReactNode } from 'react'
import { BORDERLANDS_COLORS } from './palette'

// Comic panel style container with heavy outlines - Borderlands UI panel
export function ComicPanel({
  children,
  rotation = 0,
  accentColor = BORDERLANDS_COLORS.legendary,
  title,
  ariaLabel,
}: {
  children: ReactNode
  rotation?: number
  accentColor?: string
  title?: string
  ariaLabel?: string
}) {
  return (
    <section
      className="relative p-6"
      aria-label={ariaLabel || title}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, #ebe5d5 100%)`,
        border: `6px solid ${BORDERLANDS_COLORS.ink}`,
        boxShadow: `8px 8px 0 ${BORDERLANDS_COLORS.ink}, inset 0 0 30px rgba(0,0,0,0.05)`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Heavy corner marks - cel-shaded */}
      <div className="absolute -top-2 -left-2 w-7 h-7" style={{ background: accentColor, border: `3px solid ${BORDERLANDS_COLORS.ink}`, boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}` }} aria-hidden="true" />
      <div className="absolute -bottom-2 -right-2 w-7 h-7" style={{ background: accentColor, border: `3px solid ${BORDERLANDS_COLORS.ink}`, boxShadow: `-2px -2px 0 ${BORDERLANDS_COLORS.ink}` }} aria-hidden="true" />
      <div className="absolute -top-2 -right-2 w-4 h-4" style={{ background: BORDERLANDS_COLORS.ink }} aria-hidden="true" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4" style={{ background: BORDERLANDS_COLORS.ink }} aria-hidden="true" />

      {/* Cel-shading edge highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)`,
        }}
      />

      {/* Title banner - loot rarity style */}
      {title && (
        <div
          className="absolute -top-5 left-1/2 px-6 py-1"
          style={{
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
            border: `4px solid ${BORDERLANDS_COLORS.ink}`,
            transform: 'translateX(-50%) rotate(-2deg)',
            boxShadow: `3px 3px 0 ${BORDERLANDS_COLORS.ink}`,
          }}
        >
          <span className="text-sm tracking-wider font-black" style={{ color: BORDERLANDS_COLORS.ink, textShadow: `1px 1px 0 ${accentColor}` }}>
            {title}
          </span>
        </div>
      )}

      {children}
    </section>
  )
}

// Speech bubble for bio - comic book style with heavy cel-shaded outlines
export function SpeechBubble({ children, ariaLabel }: { children: ReactNode; ariaLabel?: string }) {
  return (
    <div className="relative" role="region" aria-label={ariaLabel || 'About me'}>
      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(135deg, #fff 0%, ${BORDERLANDS_COLORS.paper} 100%)`,
          border: `5px solid ${BORDERLANDS_COLORS.ink}`,
          borderRadius: '20px',
          boxShadow: `6px 6px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {/* Inner cel-shading highlight */}
        <div
          className="absolute top-2 left-2 right-2 h-4 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            borderRadius: '15px 15px 0 0',
          }}
        />
        {children}
      </div>
      {/* Tail - outer border */}
      <div
        className="absolute -bottom-5 left-16 w-0 h-0"
        aria-hidden="true"
        style={{
          borderLeft: '18px solid transparent',
          borderRight: '18px solid transparent',
          borderTop: `24px solid ${BORDERLANDS_COLORS.ink}`,
        }}
      />
      {/* Tail - inner fill */}
      <div
        className="absolute -bottom-2 left-16 w-0 h-0"
        aria-hidden="true"
        style={{
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: `18px solid ${BORDERLANDS_COLORS.paper}`,
          marginLeft: '4px',
        }}
      />
    </div>
  )
}

export const HEADING_BANNER = 'text-2xl inline-block px-6 py-2 border-[5px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a]'
