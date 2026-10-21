'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CUPHEAD_COLORS } from './palette'

// Rubber Hose's art pieces: the ink splash, the bouncing title, the curled banner and the art breaks
// between sections.

// ============================================================================
// COMPONENT: Ink Splash effect on hover
// ============================================================================
export function InkSplash({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[50] cuphead-ink-splash"
      style={{ left: x - 40, top: y - 40 }}
      aria-hidden="true"
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="5" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="25" cy="30" rx="8" ry="5" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="55" cy="35" rx="6" ry="4" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="35" cy="55" rx="7" ry="5" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="50" cy="50" rx="5" ry="3" fill={CUPHEAD_COLORS.inkBlack} />
        <circle cx="20" cy="45" r="3" fill={CUPHEAD_COLORS.inkBlack} />
        <circle cx="60" cy="25" r="4" fill={CUPHEAD_COLORS.inkBlack} />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Cartoon Title with bouncing letters
// ============================================================================
export function CartoonTitle({ text, subtitle }: { text: string; subtitle?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="text-center">
      <h1 className="sr-only">{text}</h1>
      <div className="flex justify-center gap-1 flex-wrap" aria-hidden="true">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block ${reducedMotion ? '' : 'cuphead-bounce-letter'}`}
            style={{
              animationDelay: reducedMotion ? '0s' : `${i * 0.05}s`,
              fontFamily: '"Abril Fatface", "Georgia", serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: CUPHEAD_COLORS.inkBlack,
              textShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}, 6px 6px 0 ${CUPHEAD_COLORS.shadowDark}`,
              // Hand-drawn wobble effect
              transform: reducedMotion ? 'none' : `rotate(${(i % 2 === 0 ? -1 : 1) * (Math.random() * 2)}deg)`,
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </div>
      {subtitle && (
        <p
          className="mt-4 text-sm tracking-[0.2em]"
          style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENT: Decorative Banner with vintage curls
// ============================================================================
export function DecorativeBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block" role="heading" aria-level={2}>
      {/* Left decorative curl */}
      <svg className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-20" viewBox="0 0 40 80" aria-hidden="true">
        <path
          d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="18" r="3" fill={CUPHEAD_COLORS.accentRedDark} />
      </svg>
      <div
        className="px-8 py-3 relative"
        style={{
          background: CUPHEAD_COLORS.accentRedDark,
          border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
          color: CUPHEAD_COLORS.paperCream,
          fontFamily: '"Abril Fatface", serif',
          boxShadow: '4px 4px 0 #5a0000',
        }}
      >
        {children}
      </div>
      {/* Right decorative curl */}
      <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-20 scale-x-[-1]" viewBox="0 0 40 80" aria-hidden="true">
        <path
          d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="18" r="3" fill={CUPHEAD_COLORS.accentRedDark} />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Art Section - Cuphead themed decorative break
// ============================================================================
export function ArtSection({ variant = 'filmReel' }: { variant?: 'filmReel' | 'musicNotes' | 'bouncingBalls' }) {
  const reducedMotion = useReducedMotion()

  if (variant === 'filmReel') {
    // Film reel with sprocket holes and vintage film elements
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        {/* Top film strip */}
        <div
          className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center"
          style={{ background: '#1a1510' }}
        >
          <div className={`flex gap-4 ${reducedMotion ? '' : 'cuphead-sprocket-scroll-horizontal'}`}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ background: CUPHEAD_COLORS.paperCream, border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            ))}
          </div>
        </div>

        {/* Center content - vintage film countdown style */}
        <div className="flex justify-center items-center gap-8 py-4">
          <div className="w-16 h-px" style={{ background: CUPHEAD_COLORS.inkBlack }} />
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center relative ${reducedMotion ? '' : 'cuphead-bob'}`}
            style={{
              border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
              background: CUPHEAD_COLORS.paperDark,
            }}
          >
            {/* Pie-cut eye design inside circle */}
            <div className="flex gap-2">
              <div className="w-4 h-5 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                <div className="absolute top-0 left-0 w-2 h-3" style={{ background: CUPHEAD_COLORS.paperDark }} />
              </div>
              <div className="w-4 h-5 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                <div className="absolute top-0 left-0 w-2 h-3" style={{ background: CUPHEAD_COLORS.paperDark }} />
              </div>
            </div>
            {/* Countdown lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={angle}
                className="absolute w-1 h-3"
                style={{
                  background: CUPHEAD_COLORS.accentRedDark,
                  transform: `rotate(${angle}deg) translateY(-32px)`,
                }}
              />
            ))}
          </div>
          <div className="w-16 h-px" style={{ background: CUPHEAD_COLORS.inkBlack }} />
        </div>

        {/* Bottom film strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center"
          style={{ background: '#1a1510' }}
        >
          <div className={`flex gap-4 ${reducedMotion ? '' : 'cuphead-sprocket-scroll-horizontal-reverse'}`}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ background: CUPHEAD_COLORS.paperCream, border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            ))}
          </div>
        </div>

        {/* Film strip perforations on sides */}
        <div className="absolute left-4 top-8 bottom-8 w-2 flex flex-col justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: CUPHEAD_COLORS.inkBlack, opacity: 0.3 }} />
          ))}
        </div>
        <div className="absolute right-4 top-8 bottom-8 w-2 flex flex-col justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: CUPHEAD_COLORS.inkBlack, opacity: 0.3 }} />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'musicNotes') {
    // Jazz-age music notes dancing across the screen
    const notes = ['\u{266A}', '\u{266B}', '\u{266C}', '\u{2669}', '\u{266D}', '\u{266F}']
    return (
      <div className="relative py-10 my-8 overflow-hidden" aria-hidden="true">
        {/* Decorative line with curls */}
        <svg className="absolute top-1/2 left-0 right-0 h-8 -translate-y-1/2" viewBox="0 0 800 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q100,0 200,20 T400,20 T600,20 T800,20"
            fill="none"
            stroke={CUPHEAD_COLORS.inkBlack}
            strokeWidth="3"
            opacity="0.4"
          />
        </svg>

        {/* Dancing music notes */}
        <div className="flex justify-around items-center px-8">
          {notes.map((note, i) => (
            <span
              key={i}
              className={`text-3xl ${reducedMotion ? '' : 'cuphead-bounce-letter'}`}
              style={{
                animationDelay: reducedMotion ? '0s' : `${i * 0.1}s`,
                color: CUPHEAD_COLORS.inkBlack,
                opacity: 0.6,
                textShadow: `2px 2px 0 ${CUPHEAD_COLORS.shadowBrown}`,
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Bouncing balls underneath notes */}
        <div className="flex justify-around mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${reducedMotion ? '' : 'cuphead-bounce-squash'}`}
              style={{
                animationDelay: reducedMotion ? '0s' : `${i * 0.2}s`,
                background: `radial-gradient(circle at 30% 30%, ${CUPHEAD_COLORS.inkSoft}, ${CUPHEAD_COLORS.inkBlack})`,
                boxShadow: '1px 1px 0 #1a1510',
              }}
            />
          ))}
        </div>

        {/* Stars decorating the sides */}
        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-xl" style={{ color: CUPHEAD_COLORS.accentGold }}>
          ✦
        </span>
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xl" style={{ color: CUPHEAD_COLORS.accentGold }}>
          ✦
        </span>
      </div>
    )
  }

  if (variant === 'bouncingBalls') {
    // Classic cartoon bouncing balls with pie-eyes
    return (
      <div className="relative py-10 my-8 overflow-hidden" aria-hidden="true">
        {/* Horizontal dashed line */}
        <div
          className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2"
          style={{ borderTop: `3px dashed ${CUPHEAD_COLORS.inkBlack}`, opacity: 0.3 }}
        />

        {/* Pie-eye characters bouncing */}
        <div className="flex justify-around items-end h-24">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`relative ${reducedMotion ? '' : 'cuphead-bounce-squash'}`}
              style={{ animationDelay: reducedMotion ? '0s' : `${i * 0.3}s` }}
            >
              {/* Ball body */}
              <div
                className="w-10 h-10 rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${CUPHEAD_COLORS.paperCream}, ${CUPHEAD_COLORS.paperDark})`,
                  border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
                  boxShadow: '2px 2px 0 #1a1510',
                }}
              >
                {/* Pie-cut eyes */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-2 h-3 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                    <div className="absolute top-0 left-0 w-1 h-1.5" style={{ background: CUPHEAD_COLORS.paperCream }} />
                  </div>
                  <div className="w-2 h-3 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                    <div className="absolute top-0 left-0 w-1 h-1.5" style={{ background: CUPHEAD_COLORS.paperCream }} />
                  </div>
                </div>
                {/* Smile */}
                <div
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full"
                  style={{ borderBottom: `2px solid ${CUPHEAD_COLORS.inkBlack}` }}
                />
              </div>
              {/* Shadow underneath */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full"
                style={{ background: CUPHEAD_COLORS.inkBlack, opacity: 0.2 }}
              />
            </div>
          ))}
        </div>

        {/* Vintage corner decorations */}
        <div className="absolute top-2 left-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark }}>❧</div>
        <div className="absolute top-2 right-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark, transform: 'scaleX(-1)' }}>❧</div>
        <div className="absolute bottom-2 left-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark, transform: 'scaleY(-1)' }}>❧</div>
        <div className="absolute bottom-2 right-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark, transform: 'scale(-1)' }}>❧</div>
      </div>
    )
  }

  return null
}
