import { useEffect, useState } from 'react'

// Bold Noir's fixed background layers and ornaments.

// Profession-specific ornaments in Persona 5 bold style
export function StylishOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { text: 'CODE', x: 3, y: 15, rotation: -15, size: 32 },
      { text: '{ }', x: 90, y: 20, rotation: 12, size: 40 },
      { text: '<>', x: 5, y: 75, rotation: 8, size: 36 },
      { text: '//', x: 88, y: 80, rotation: -10, size: 34 },
      { text: '01', x: 8, y: 45, rotation: -5, size: 28 },
    ],
    drummer: [
      { text: '♪', x: 5, y: 18, rotation: -12, size: 44 },
      { text: '🥁', x: 92, y: 25, rotation: 15, size: 38 },
      { text: '🎹', x: 4, y: 70, rotation: 8, size: 36 },
      { text: '♫', x: 90, y: 75, rotation: -8, size: 40 },
      { text: 'BEAT', x: 6, y: 45, rotation: -5, size: 26 },
    ],
    fighter: [
      { text: '拳', x: 5, y: 20, rotation: -10, size: 40 },
      { text: '👊', x: 90, y: 25, rotation: 12, size: 38 },
      { text: '⚔️', x: 4, y: 72, rotation: 8, size: 36 },
      { text: 'KO', x: 88, y: 78, rotation: -15, size: 32 },
      { text: '💥', x: 8, y: 48, rotation: 5, size: 34 },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute font-black tracking-tighter animate-stylish-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            transform: `rotate(${item.rotation}deg)`,
            color: '#ff0033',
            textShadow: '3px 3px 0 #000, -1px -1px 0 #000',
            opacity: 0.25,
            animation: `stylishFloat ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 1.5}s`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  )
}

// Phantom thief mask SVG - floating decoration
export function PhantomMask({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 50"
      className="absolute pointer-events-none opacity-20"
      style={{ width: '120px', ...style }}
    >
      <path
        d="M10,25 Q15,10 30,15 L50,10 L70,15 Q85,10 90,25 Q85,35 70,30 L50,35 L30,30 Q15,35 10,25 Z"
        fill="none"
        stroke="#ff0033"
        strokeWidth="2"
      />
      <ellipse cx="30" cy="22" rx="12" ry="8" fill="#ff0033" opacity="0.3" />
      <ellipse cx="70" cy="22" rx="12" ry="8" fill="#ff0033" opacity="0.3" />
    </svg>
  )
}

// Floating phantom masks
export function FloatingMasks() {
  const [masks, setMasks] = useState<Array<{
    id: number
    x: number
    y: number
    rotation: number
    scale: number
    delay: number
  }>>([])

  useEffect(() => {
    const newMasks = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 40 - 20,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 5,
    }))
    setMasks(newMasks)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {masks.map((m) => (
        <PhantomMask
          key={m.id}
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: `rotate(${m.rotation}deg) scale(${m.scale})`,
            animation: `float-mask 10s ease-in-out infinite`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Card suit symbols scattered background
export function CardSuits() {
  const suits = ['♠', '♥', '♦', '♣']
  const [scattered, setScattered] = useState<Array<{
    id: number
    suit: string
    x: number
    y: number
    rotation: number
    opacity: number
  }>>([])

  useEffect(() => {
    const newScattered = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      suit: suits[i % 4],
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: 0.05 + Math.random() * 0.1,
    }))
    setScattered(newScattered)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {scattered.map((s) => (
        <span
          key={s.id}
          className="absolute text-4xl select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `rotate(${s.rotation}deg)`,
            opacity: s.opacity,
            color: s.suit === '♥' || s.suit === '♦' ? '#ff0033' : '#333',
          }}
        >
          {s.suit}
        </span>
      ))}
    </div>
  )
}

// Chain link decoration
export function ChainLink({ broken = false }: { broken?: boolean }) {
  return (
    <svg viewBox="0 0 40 20" className="w-10 h-5">
      <ellipse
        cx="10"
        cy="10"
        rx="8"
        ry="6"
        fill="none"
        stroke={broken ? '#ff0033' : '#333'}
        strokeWidth="2"
        className={broken ? 'animate-pulse' : ''}
      />
      {!broken && (
        <ellipse
          cx="30"
          cy="10"
          rx="8"
          ry="6"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
      )}
      {broken && (
        <>
          <line x1="18" y1="5" x2="25" y2="3" stroke="#ff0033" strokeWidth="2" />
          <line x1="18" y1="15" x2="25" y2="17" stroke="#ff0033" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

// Breaking chains animation
export function BreakingChains() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[3] overflow-hidden flex justify-center gap-2 opacity-30">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center" style={{ animationDelay: `${i * 0.1}s` }}>
          <ChainLink broken={i === 3 || i === 4} />
        </div>
      ))}
    </div>
  )
}

// Red paint stroke background
export function PaintStroke({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) {
  const positions = {
    top: 'top-0 left-0 right-0 h-32',
    bottom: 'bottom-0 left-0 right-0 h-32',
    left: 'left-0 top-0 bottom-0 w-32',
    right: 'right-0 top-0 bottom-0 w-32',
  }

  const gradients = {
    top: 'linear-gradient(180deg, rgba(255,0,51,0.15), transparent)',
    bottom: 'linear-gradient(0deg, rgba(255,0,51,0.15), transparent)',
    left: 'linear-gradient(90deg, rgba(255,0,51,0.15), transparent)',
    right: 'linear-gradient(270deg, rgba(255,0,51,0.15), transparent)',
  }

  return (
    <div
      className={`fixed pointer-events-none z-[4] ${positions[position]}`}
      style={{
        background: gradients[position],
        maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
      }}
    />
  )
}

// Halftone overlay for comic book effect
export function HalftoneOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle, #ff0033 1px, transparent 1px)`,
        backgroundSize: '8px 8px',
      }}
    />
  )
}

// Animated diagonal lines background
export function DiagonalLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 bg-red-600 animate-slide-diagonal"
          style={{
            height: '200%',
            left: `${i * 5}%`,
            top: '-50%',
            transform: 'rotate(45deg)',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}
