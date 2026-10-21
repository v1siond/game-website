'use client'

import { useEffect, useState, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CUPHEAD_COLORS } from './palette'

// Rubber Hose's page backdrop: the film reel borders, the film effects, the floating notes and the
// decorations fixed behind the content.

// ============================================================================
// COMPONENT: Vintage Ornaments (profession-specific decorations)
// ============================================================================
export function VintageOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const reducedMotion = useReducedMotion()

  const ornamentsByProfession = {
    engineer: [
      { icon: '⚙', x: 4, y: 22, size: 32 },
      { icon: '💡', x: 92, y: 26, size: 28 },
      { icon: '🔧', x: 5, y: 70, size: 26 },
      { icon: '⚡', x: 91, y: 74, size: 30 },
    ],
    drummer: [
      { icon: '♪', x: 4, y: 24, size: 34 },
      { icon: '♫', x: 93, y: 22, size: 32 },
      { icon: '🎹', x: 5, y: 72, size: 28 },
      { icon: '🎵', x: 91, y: 76, size: 30 },
    ],
    fighter: [
      { icon: '💪', x: 4, y: 22, size: 30 },
      { icon: '⭐', x: 92, y: 26, size: 32 },
      { icon: '🥊', x: 5, y: 74, size: 28 },
      { icon: '✨', x: 91, y: 70, size: 30 },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <div
          key={i}
          className={`absolute ${reducedMotion ? '' : 'cuphead-bob'}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.35,
            filter: 'sepia(0.8) contrast(1.2)',
            animationDelay: reducedMotion ? '0s' : `${-i * 0.5}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Film Reel Border with animated sprocket holes
// ============================================================================
export function FilmReelBorder() {
  const reducedMotion = useReducedMotion()

  return (
    <>
      {/* Left film strip */}
      <div
        className="fixed left-0 top-0 bottom-0 w-12 z-[4] pointer-events-none"
        style={{ background: '#1a1510' }}
        role="presentation"
        aria-hidden="true"
      >
        <div className={`absolute inset-0 flex flex-col justify-start ${reducedMotion ? '' : 'cuphead-sprocket-scroll'}`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 flex items-center justify-center">
              <div
                className="w-6 h-4 rounded-sm"
                style={{ background: '#0a0805', border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Right film strip */}
      <div
        className="fixed right-0 top-0 bottom-0 w-12 z-[4] pointer-events-none"
        style={{ background: '#1a1510' }}
        role="presentation"
        aria-hidden="true"
      >
        <div className={`absolute inset-0 flex flex-col justify-start ${reducedMotion ? '' : 'cuphead-sprocket-scroll-reverse'}`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 flex items-center justify-center">
              <div
                className="w-6 h-4 rounded-sm"
                style={{ background: '#0a0805', border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ============================================================================
// COMPONENT: Film Effects (grain, scratches, vignette, flicker)
// ============================================================================
export function FilmEffects() {
  const [scratches, setScratches] = useState<Array<{ id: number; x: number; height: number; opacity: number }>>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const newScratches = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          height: 20 + Math.random() * 80,
          opacity: 0.1 + Math.random() * 0.3,
        }))
        setScratches(newScratches)
        setTimeout(() => setScratches([]), 80)
      }
    }, 150)
    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <div aria-hidden="true">
      {/* Heavy film grain - authentic vintage look */}
      <div
        className={`fixed inset-0 pointer-events-none z-[8] opacity-[0.15] ${reducedMotion ? '' : 'cuphead-grain'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Watercolor paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[6] opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting in='noise' lighting-color='white' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sepia vignette - darker edges like old film */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(42, 32, 21, 0.5) 80%, rgba(42, 32, 21, 0.8) 100%)`,
        }}
      />

      {/* Film scratches */}
      {!reducedMotion && scratches.map((scratch) => (
        <div
          key={scratch.id}
          className="fixed top-0 pointer-events-none z-[9]"
          style={{
            left: `${scratch.x}%`,
            width: '2px',
            height: `${scratch.height}%`,
            background: `rgba(255, 255, 255, ${scratch.opacity})`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Dust particles floating */}
      {!reducedMotion && (
        <div className="fixed inset-0 pointer-events-none z-[8] cuphead-dust">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${Math.random() * 100}%`,
                width: '3px',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.15)',
              }}
            />
          ))}
        </div>
      )}

      {/* Frame flicker - subtle brightness variation */}
      {!reducedMotion && (
        <div
          className="fixed inset-0 pointer-events-none z-[6] cuphead-flicker"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        />
      )}
    </div>
  )
}

// ============================================================================
// COMPONENT: Floating Music Notes (jazz age decoration)
// ============================================================================
export function FloatingMusicNotes() {
  const reducedMotion = useReducedMotion()

  const notes = useMemo(() => {
    const noteTypes = ['\u{266A}', '\u{266B}', '\u{266C}', '\u{2669}']
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 100 + Math.random() * 20,
      type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 6,
    }))
  }, [])

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute text-2xl cuphead-float-up"
          style={{
            left: `${note.x}%`,
            bottom: `-${note.y}px`,
            color: CUPHEAD_COLORS.inkBlack,
            opacity: 0.3,
            animationDelay: `${note.delay}s`,
            animationDuration: `${note.duration}s`,
            textShadow: `1px 1px 0 ${CUPHEAD_COLORS.shadowBrown}`,
          }}
        >
          {note.type}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Pie-Eye Blinking Face (classic 1930s cartoon character)
// ============================================================================
export function PieEyeFace({ position, size = 60 }: { position: { x: number; y: number }; size?: number }) {
  const [isBlinking, setIsBlinking] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [reducedMotion])

  return (
    <div
      className={`absolute pointer-events-none ${reducedMotion ? '' : 'cuphead-bob'}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size,
        height: size,
      }}
      role="img"
      aria-label="Decorative cartoon face with pie-cut eyes"
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {/* Face circle with hand-drawn wobble effect */}
        <circle
          cx="30"
          cy="30"
          r="28"
          fill={CUPHEAD_COLORS.paperCream}
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="3"
          className={reducedMotion ? '' : 'cuphead-wobble-path'}
        />
        {/* Pie eyes - the signature 1930s look */}
        <ellipse
          cx="20"
          cy="25"
          rx="8"
          ry={isBlinking ? 1 : 10}
          fill={CUPHEAD_COLORS.inkBlack}
          className="transition-all duration-75"
        />
        <ellipse
          cx="40"
          cy="25"
          rx="8"
          ry={isBlinking ? 1 : 10}
          fill={CUPHEAD_COLORS.inkBlack}
          className="transition-all duration-75"
        />
        {/* Pie slices in eyes (the "pie-cut" look) */}
        {!isBlinking && (
          <>
            <path d="M20,15 L20,25 L12,25 Z" fill={CUPHEAD_COLORS.paperCream} />
            <path d="M40,15 L40,25 L32,25 Z" fill={CUPHEAD_COLORS.paperCream} />
          </>
        )}
        {/* Cheerful smile */}
        <path
          d="M15,40 Q30,50 45,40"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Rosy cheeks (subtle) */}
        <circle cx="12" cy="35" r="4" fill={CUPHEAD_COLORS.accentRed} opacity="0.2" />
        <circle cx="48" cy="35" r="4" fill={CUPHEAD_COLORS.accentRed} opacity="0.2" />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Bouncing Ball with squash and stretch
// ============================================================================
export function BouncingBall({ initialX, delay }: { initialX: number; delay: number }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className="absolute bottom-0 w-8 h-8 cuphead-bounce-squash pointer-events-none z-[2]"
      style={{
        left: `${initialX}%`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${CUPHEAD_COLORS.inkSoft}, ${CUPHEAD_COLORS.inkBlack})`,
          boxShadow: `2px 2px 0 #1a1510`,
        }}
      />
    </div>
  )
}

// ============================================================================
// COMPONENT: Rubber Hose Arm decoration
// ============================================================================
export function RubberHoseArm({ side, y }: { side: 'left' | 'right'; y: number }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className={`fixed ${side === 'left' ? 'left-16' : 'right-16'} pointer-events-none z-[2] cuphead-wave-arm`}
      style={{ top: `${y}%` }}
      aria-hidden="true"
    >
      <svg width="80" height="120" viewBox="0 0 80 120" className={side === 'right' ? 'scale-x-[-1]' : ''}>
        {/* Upper arm - rubber hose style (no joints, smooth curves) */}
        <path
          d="M10,0 Q30,20 20,40 Q10,60 25,80"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* White glove - signature 1930s cartoon */}
        <circle cx="25" cy="90" r="20" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="3" />
        {/* Glove fingers */}
        <ellipse cx="15" cy="105" rx="6" ry="10" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="2" />
        <ellipse cx="30" cy="108" rx="6" ry="10" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="2" />
        <ellipse cx="42" cy="100" rx="6" ry="10" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="2" />
      </svg>
    </div>
  )
}
