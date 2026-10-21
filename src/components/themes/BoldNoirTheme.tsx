'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { useInViewTrigger } from '@/hooks/useScrollAnimation'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Phantom Thief Alexander - stylish masked figure
function PhantomThiefCharacter({
  size = 60,
  direction = 'right',
  className = ''
}: {
  size?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 140)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Phantom Thief"
        fill
        className="object-contain"
        style={{ filter: 'contrast(1.3) brightness(1.1)' }}
      />
      {/* Mask effect on face */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[20%]"
        style={{
          background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
          opacity: 0.8,
        }}
      />
      {/* Stylish trail */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: direction === 'right'
            ? 'linear-gradient(90deg, rgba(255,0,51,0.4), transparent 30%)'
            : 'linear-gradient(270deg, rgba(255,0,51,0.4), transparent 30%)',
        }}
      />
    </div>
  )
}

// Profession-specific ornaments in Persona 5 bold style
function StylishOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
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

// ALL OUT ATTACK reveal section
function AllOutAttackSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'attack' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('attack')
      setTimeout(() => setPhase('revealed'), 800)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* ALL OUT ATTACK animation */}
      {phase === 'attack' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 animate-attack-flash">
          <div className="relative">
            <PhantomThiefCharacter size={80} className="absolute left-1/2 -translate-x-1/2 -top-20" />
            <div
              className="text-5xl font-black tracking-tighter text-center"
              style={{
                color: '#ff0033',
                textShadow: '4px 4px 0 #000, -2px -2px 0 #fff',
                transform: 'skewX(-10deg)',
              }}
            >
              REVEAL!
            </div>
          </div>
        </div>
      )}

      <div
        className="transition-all duration-500"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'skewX(0deg) translateX(0)' : 'skewX(-20deg) translateX(-30px)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Phantom thief mask SVG - floating decoration
function PhantomMask({ style }: { style: React.CSSProperties }) {
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
function FloatingMasks() {
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
function CardSuits() {
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
function ChainLink({ broken = false }: { broken?: boolean }) {
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
function BreakingChains() {
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

// Persona 5 themed decorative art break section
function ArtSection({ variant = 1 }: { variant?: 1 | 2 | 3 }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Variant 1: Phantom masks + action lines (ALL OUT ATTACK style)
  if (variant === 1) {
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        {/* Diagonal action lines */}
        <div className="absolute inset-0 flex justify-center items-center">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#ff0033' : '#330011'}, transparent)`,
                transform: `rotate(${-30 + i * 4}deg) translateY(${(i - 7) * 15}px)`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Center mask with splatter */}
        <div className="relative flex justify-center items-center">
          {/* Paint splatter behind */}
          <div
            className="absolute w-64 h-32 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,0,51,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Phantom mask - large centered */}
          <svg viewBox="0 0 200 100" className="w-48 h-24 relative z-10">
            <defs>
              <linearGradient id="maskGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0033" />
                <stop offset="100%" stopColor="#990022" />
              </linearGradient>
            </defs>
            {/* Mask shape */}
            <path
              d="M20,50 Q30,20 60,30 L100,20 L140,30 Q170,20 180,50 Q170,70 140,60 L100,70 L60,60 Q30,70 20,50 Z"
              fill="none"
              stroke="url(#maskGrad1)"
              strokeWidth="3"
              className={mounted ? 'animate-pulse' : ''}
            />
            {/* Eye holes */}
            <ellipse cx="60" cy="45" rx="20" ry="12" fill="#ff0033" opacity="0.4" />
            <ellipse cx="140" cy="45" rx="20" ry="12" fill="#ff0033" opacity="0.4" />
            {/* Inner eye detail */}
            <ellipse cx="60" cy="45" rx="10" ry="6" fill="#330011" />
            <ellipse cx="140" cy="45" rx="10" ry="6" fill="#330011" />
          </svg>

          {/* Card suits on sides */}
          <span
            className="absolute left-1/4 text-4xl opacity-30"
            style={{ color: '#ff0033', transform: 'rotate(-15deg)' }}
          >
            ♠
          </span>
          <span
            className="absolute right-1/4 text-4xl opacity-30"
            style={{ color: '#ff0033', transform: 'rotate(15deg)' }}
          >
            ♥
          </span>
        </div>

        {/* ALL OUT text hints */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <span
            className="text-xs tracking-[0.3em] font-black opacity-20"
            style={{ color: '#ff0033' }}
          >
            ALL OUT ATTACK
          </span>
        </div>
      </div>
    )
  }

  // Variant 2: Paint splatters + card suits cascade
  if (variant === 2) {
    const suits = ['♠', '♦', '♣', '♥']
    return (
      <div className="relative py-16 my-8 overflow-hidden" aria-hidden="true">
        {/* Large paint splatter background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 h-32"
            style={{
              background: 'radial-gradient(circle, rgba(255,0,51,0.4) 0%, transparent 60%)',
              filter: 'blur(15px)',
              borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-24 h-24"
            style={{
              background: 'radial-gradient(circle, rgba(255,0,51,0.3) 0%, transparent 60%)',
              filter: 'blur(12px)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-20 h-20"
            style={{
              background: 'radial-gradient(circle, rgba(153,0,34,0.4) 0%, transparent 60%)',
              filter: 'blur(10px)',
              borderRadius: '30% 70% 40% 60% / 50% 60% 40% 50%',
            }}
          />
        </div>

        {/* Card suits cascade */}
        <div className="relative flex justify-center items-center gap-8">
          {suits.map((suit, i) => (
            <span
              key={i}
              className="text-5xl transition-transform duration-300 hover:scale-125"
              style={{
                color: suit === '♥' || suit === '♦' ? '#ff0033' : '#222',
                textShadow: suit === '♥' || suit === '♦' ? '0 0 20px rgba(255,0,51,0.5)' : 'none',
                transform: `rotate(${-10 + i * 7}deg) translateY(${Math.sin(i) * 10}px)`,
                opacity: 0.6 + i * 0.1,
              }}
            >
              {suit}
            </span>
          ))}
        </div>

        {/* Dripping paint effect */}
        <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center gap-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: `${12 + i * 4}px`,
                background: 'linear-gradient(180deg, #ff0033, transparent)',
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Variant 3: Speed lines + chain break (SHOWTIME style)
  return (
    <div className="relative py-14 my-8 overflow-hidden" aria-hidden="true">
      {/* Radial speed lines emanating from center */}
      <div className="absolute inset-0 flex justify-center items-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 origin-center"
            style={{
              width: '150%',
              background: `linear-gradient(90deg, transparent 40%, ${i % 3 === 0 ? '#ff0033' : '#220011'} 50%, transparent 60%)`,
              transform: `rotate(${i * 15}deg)`,
              opacity: 0.2 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Center burst */}
      <div className="relative flex justify-center items-center">
        <div
          className="w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ff0033 0%, #990022 40%, transparent 70%)',
            boxShadow: '0 0 40px rgba(255,0,51,0.5)',
          }}
        />

        {/* Broken chain across */}
        <div className="absolute flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              <ChainLink broken={i === 1} />
            </div>
          ))}
        </div>
      </div>

      {/* SHOWTIME text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <span
          className="text-lg tracking-[0.5em] font-black"
          style={{
            color: '#ff0033',
            textShadow: '2px 2px 0 #000, -1px -1px 0 #330011',
            opacity: 0.3,
          }}
        >
          SHOWTIME
        </span>
      </div>

      {/* Corner decorations */}
      <span
        className="absolute top-2 left-8 text-2xl opacity-25"
        style={{ color: '#ff0033' }}
      >
        ♣
      </span>
      <span
        className="absolute top-2 right-8 text-2xl opacity-25"
        style={{ color: '#ff0033' }}
      >
        ♦
      </span>
    </div>
  )
}

// Red paint stroke background
function PaintStroke({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) {
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
function HalftoneOverlay() {
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
function DiagonalLines() {
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

// Persona-style skewed panel
function SkewedPanel({
  children,
  color = '#ff0033',
  direction = 'right',
  delay = 0,
}: {
  children: React.ReactNode
  color?: string
  direction?: 'left' | 'right'
  delay?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div
      className={`relative transition-all duration-500 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
      }`}
      style={{
        transform: `skewX(${direction === 'right' ? '-3' : '3'}deg) ${visible ? '' : 'translateX(50px)'}`,
      }}
    >
      {/* Red accent bar */}
      <div
        className="absolute top-0 left-0 w-2 h-full"
        style={{ background: color }}
      />
      {/* Content */}
      <div
        className="pl-6 pr-4 py-4"
        style={{
          background: 'linear-gradient(90deg, rgba(26, 10, 10, 0.95), rgba(10, 10, 10, 0.8))',
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div style={{ transform: `skewX(${direction === 'right' ? '3' : '-3'}deg)` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ALL OUT ATTACK splash for featured items
function AllOutAttackSplash({ children, featured = false }: { children: React.ReactNode; featured?: boolean }) {
  if (!featured) return <>{children}</>

  return (
    <div className="relative group">
      {/* Splash background */}
      <div
        className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,0,51,0.4) 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      {/* Speed lines */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{
              top: `${10 + i * 12}%`,
              left: '-20%',
              right: '-20%',
              transform: `rotate(${-5 + Math.random() * 10}deg)`,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  )
}

// Tarot card art per profession: the glyph and the arcana under the label.
const TAROT: Record<Profession, { icon: string; arcana: string }> = {
  drummer: { icon: '🥁', arcana: 'V - THE HIEROPHANT' },
  engineer: { icon: '💻', arcana: 'XII - THE HANGED MAN' },
  fighter: { icon: '🥊', arcana: 'XI - STRENGTH' },
}

// Persona-style character portrait with Tarot card motif, one option of the shared profession switch
function CharacterCard({
  id,
  label,
  selected,
  optionProps,
  prefersReducedMotion = false,
}: ProfessionOption & { prefersReducedMotion?: boolean }) {
  const { icon, arcana } = TAROT[id]
  const numeral = arcana.split(' - ')[0]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
        selected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        transform: prefersReducedMotion
          ? selected ? 'scale(1.05)' : 'none'
          : `skewX(-5deg) ${selected ? 'scale(1.05)' : ''}`,
      }}
    >
      {/* Card background with Tarot styling */}
      <div
        className="px-4 py-5 sm:p-6 relative overflow-hidden"
        style={{
          background: selected
            ? 'linear-gradient(135deg, #ff0033, #990022)'
            : 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
          border: `3px solid ${selected ? '#ff0033' : '#333'}`,
        }}
      >
        {/* Diagonal stripes - Persona 5 pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
          }}
          aria-hidden="true"
        />

        {/* Corner Tarot decorations */}
        <div
          className="absolute top-1 left-1 text-[8px] font-bold"
          style={{ color: selected ? '#000' : '#ff6666' }}
          aria-hidden="true"
        >
          {numeral}
        </div>
        <div
          className="absolute bottom-1 right-1 text-[8px] font-bold rotate-180"
          style={{ color: selected ? '#000' : '#ff6666' }}
          aria-hidden="true"
        >
          {numeral}
        </div>

        {/* Content - counter-skew */}
        <div
          className="relative z-10"
          style={{ transform: prefersReducedMotion ? 'none' : 'skewX(5deg)' }}
        >
          <span className="text-4xl sm:text-5xl block mb-3" aria-hidden="true">{icon}</span>
          <span
            className="text-base sm:text-lg font-black tracking-wider block uppercase"
            style={{ color: selected ? '#000' : '#fff' }}
          >
            {label}
          </span>
          <span
            className="text-sm tracking-widest block mt-1"
            style={{ color: selected ? '#1a0000' : '#ff6666' }}
            aria-hidden="true"
          >
            {arcana}
          </span>
        </div>

        {/* Selection indicator */}
        {selected && !prefersReducedMotion && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2" aria-hidden="true">
            <span className="text-2xl animate-pulse">◀</span>
          </div>
        )}
      </div>
    </button>
  )
}

// Tech stack display for engineer (ALL OUT ATTACK style)
function TechStackDisplay({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => (
        <div key={category.id} className="relative">
          {/* Category header */}
          <div
            className="flex items-center gap-3 mb-3"
            style={{ transform: 'skewX(-3deg)' }}
          >
            <span className="text-xl" aria-hidden="true">{category.icon}</span>
            <h3
              className="text-sm font-black tracking-wider"
              style={{ color: '#ff0033' }}
            >
              {category.name.toUpperCase()}
            </h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #ff0033, transparent)' }} aria-hidden="true" />
          </div>

          {/* Tech items */}
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech, techIndex) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm transition-all hover:scale-105 cursor-default"
                style={{
                  background: `rgba(255,0,51,${0.05 + (techIndex % 3) * 0.05})`,
                  border: '1px solid #ff003340',
                  color: '#fff',
                  transform: 'skewX(-3deg)',
                  animationDelay: `${catIndex * 100 + techIndex * 50}ms`,
                }}
              >
                <span style={{ display: 'inline-block', transform: 'skewX(3deg)' }}>
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Company card with Persona flair
function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <AllOutAttackSplash featured>
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
        className="block relative overflow-hidden group h-full"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
          border: '2px solid #330011',
          transform: 'skewX(-2deg)',
        }}
      >
        {/* Hover effect line */}
        <div
          className="absolute top-0 left-0 w-full h-1 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
          style={{ background: '#ff0033' }}
          aria-hidden="true"
        />

        <div className="p-4" style={{ transform: 'skewX(2deg)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl" aria-hidden="true">{company.icon}</span>
            <div>
              <h3 className="text-base font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
                {company.name}
              </h3>
              <p className="text-sm" style={{ color: '#ff6666' }}>{company.tagline}</p>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#b8b8b8' }}>{company.description}</p>
        </div>
      </a>
    </AllOutAttackSplash>
  )
}

// Band card with musical flair: his role, the years and the release
function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <div
      className="p-4 relative overflow-hidden group h-full"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
        border: '2px solid #330011',
        transform: 'skewX(-2deg)',
      }}
    >
      {/* Musical note decoration */}
      <div
        className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ color: '#ff0033' }}
        aria-hidden="true"
      >
        ♪
      </div>

      <div style={{ transform: 'skewX(2deg)' }}>
        <h3 className="text-base font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
          {band.name}
        </h3>
        <p className="text-sm mt-1" style={{ color: '#ff6666' }}>
          {band.role}
          {years && <span aria-hidden="true"> | </span>}
          {years && <span>{years}</span>}
        </p>
        {band.release && (
          <p className="text-sm mt-2" style={{ color: '#b8b8b8' }}>
            Released <cite>&ldquo;{band.release}&rdquo;</cite>
          </p>
        )}
      </div>
    </div>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full">
      {content}
    </a>
  )
}

// Work experience card with Persona 5 styling. Dates are date only strings (UTC midnight), so the year is read in UTC.
function ExperienceCard({ entry }: { entry: Job }) {
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'Present'
  const startDisplay = entry.startDate.getUTCFullYear()

  return (
    <article
      className="relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
        border: '2px solid #330011',
        transform: 'skewX(-2deg)',
      }}
    >
      {/* Red accent line */}
      <div
        className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
        style={{ background: '#ff0033' }}
        aria-hidden="true"
      />

      <div className="p-4 pl-5" style={{ transform: 'skewX(2deg)' }}>
        <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
          <div>
            <h3 className="text-base font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
              {entry.title}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: '#ff6666' }}>
              {entry.company}
            </p>
          </div>
          <span
            className="text-sm px-2 py-1"
            style={{
              background: '#ff003330',
              border: '1px solid #ff003350',
              color: '#fff',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        {entry.description && (
          <p className="text-sm mb-3" style={{ color: '#b8b8b8' }}>
            {entry.description}
          </p>
        )}

        {entry.highlights.length > 0 && (
          <ul className="space-y-1.5" aria-label="Key achievements">
            {entry.highlights.map((highlight) => (
              <li
                key={highlight}
                className="text-sm flex items-start gap-2"
                style={{ color: '#e0e0e0' }}
              >
                <span style={{ color: '#ff6666' }} aria-hidden="true">▸</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {entry.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1 mt-3" aria-label="Skills used">
            {entry.skills.slice(0, 4).map((skill) => (
              <li
                key={skill}
                className="text-sm px-2 py-0.5"
                style={{ background: '#ff003330', color: '#fff' }}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// Project card with reveal effect: his role, the result line and the links
function ProjectCard({ project, years, links, index }: ProjectSlot & { index: number }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 500 + index * 150)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <AllOutAttackSplash featured={project.highlight}>
      <div
        className={`relative h-full transition-all duration-500 ${
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transform: `skewX(-2deg)`,
        }}
      >
        <article
          className="p-4 relative overflow-hidden group h-full"
          style={{
            background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
            border: `2px solid ${project.highlight ? '#ff0033' : '#330011'}`,
          }}
        >
          {/* Red reveal line */}
          <div
            className="absolute top-0 left-0 w-full h-1 transition-transform duration-300 group-hover:scale-x-100"
            style={{
              background: '#ff0033',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
            aria-hidden="true"
          />

          <div style={{ transform: 'skewX(2deg)' }}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-base font-bold" style={{ color: '#ff0033' }}>
                {project.name}
              </h3>
              {years && (
                <span className="text-sm px-2 py-1 font-bold whitespace-nowrap" style={{ background: '#ff0033', color: '#000' }}>
                  {years}
                </span>
              )}
            </div>
            <p className="text-sm font-bold" style={{ color: '#fff' }}>
              {project.role}
            </p>
            <p className="text-sm mt-1" style={{ color: '#b8b8b8' }}>
              {project.tagline}
            </p>
            {project.impact && (
              <p className="text-sm mt-2 italic" style={{ color: '#ff6666' }}>
                <span aria-hidden="true">→ </span>
                {project.impact}
              </p>
            )}
            {project.techStack.length > 0 && (
              <ul className="flex gap-2 mt-2 flex-wrap" aria-label="Technologies used">
                {project.techStack.slice(0, 4).map((tech) => (
                  <li
                    key={tech}
                    className="text-sm px-2 py-0.5"
                    style={{ background: '#ff003330', color: '#fff' }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-4">
                {links.map(({ kind, label, linkProps }) => (
                  <a
                    key={kind}
                    {...linkProps}
                    className="inline-flex items-center min-h-[44px] px-4 text-sm font-bold tracking-wider transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={{ border: '3px solid #ff0033', color: '#ff0033' }}
                  >
                    {label.toUpperCase()}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm mt-4" style={{ color: '#999' }}>No public link</p>
            )}
          </div>
        </article>
      </div>
    </AllOutAttackSplash>
  )
}
// Dramatic TAKE YOUR TIME - iconic Persona 5 loading screen text
function TakeYourTime({ prefersReducedMotion = false }: { prefersReducedMotion?: boolean }) {
  const [phase, setPhase] = useState(prefersReducedMotion ? 3 : 0)

  useEffect(() => {
    if (prefersReducedMotion) return

    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  return (
    <div
      className="relative h-32 flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Take Your Time - Persona 5 style welcome message"
    >
      {/* Background splash with paint splatter effect */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,0,51,0.2) 0%, transparent 70%),
                       radial-gradient(circle at 20% 60%, rgba(255,0,51,0.15) 0%, transparent 30%),
                       radial-gradient(circle at 80% 40%, rgba(255,0,51,0.1) 0%, transparent 25%)`,
        }}
        aria-hidden="true"
      />

      {/* Speed lines - manga action effect */}
      {!prefersReducedMotion && (
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
          aria-hidden="true"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 animate-speed-line"
              style={{
                top: `${5 + i * 8}%`,
                left: '-100%',
                right: '-100%',
                background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main text - ALL CAPS bold Persona style */}
      <div
        className={`relative transition-all duration-700 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}
        style={{ transform: prefersReducedMotion ? 'none' : 'skewX(-5deg)' }}
      >
        <span
          className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-widest ${prefersReducedMotion ? '' : 'animate-pulse'}`}
          style={{
            color: '#ff0033',
            textShadow: '4px 4px 0 #000, 8px 8px 0 #330011, -2px -2px 0 #ff003380',
            WebkitTextStroke: '2px #330011',
          }}
        >
          TAKE YOUR TIME
        </span>

        {/* Brush stroke underline */}
        <div
          className="absolute -bottom-2 left-1/4 right-1/4 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
          }}
          aria-hidden="true"
        />

        {/* Ink splatter accents */}
        <div
          className="absolute -top-4 -left-8 w-6 h-6 rounded-full opacity-40"
          style={{ background: '#ff0033', filter: 'blur(3px)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-4 -right-6 w-4 h-4 rounded-full opacity-30"
          style={{ background: '#ff0033', filter: 'blur(2px)' }}
          aria-hidden="true"
        />
      </div>

      {/* Card suits decoration - Persona 5 motif */}
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
        style={{ color: '#ff0033' }}
        aria-hidden="true"
      >
        ♠
      </span>
      <span
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
        style={{ color: '#ff0033' }}
        aria-hidden="true"
      >
        ♥
      </span>
    </div>
  )
}

const SKEW_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm tracking-wider font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black'

// Email is the solid red primary action, LinkedIn and the CV the outlined ones.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: { background: '#ff0033', color: '#000', border: '3px solid #ff0033' },
  linkedin: { background: 'transparent', border: '3px solid #ff0033', color: '#ff0033' },
}

function skew(prefersReducedMotion: boolean, deg: number): string {
  return prefersReducedMotion ? 'none' : `skewX(${deg}deg)`
}

function HeroAction({ action, prefersReducedMotion }: { action: HeroActionSlot; prefersReducedMotion: boolean }) {
  return (
    <a
      {...action.linkProps}
      className={SKEW_BUTTON}
      style={{ ...HERO_ACTION_LOOK[action.id], transform: skew(prefersReducedMotion, -5) }}
    >
      <span style={{ display: 'inline-block', transform: skew(prefersReducedMotion, 5) }}>
        {action.label.toUpperCase()}
      </span>
    </a>
  )
}

function CVLink({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <Link
      href="/cv"
      className={`${SKEW_BUTTON} hover:bg-red-900/20`}
      style={{ ...HERO_ACTION_LOOK.linkedin, transform: skew(prefersReducedMotion, -5) }}
    >
      <span style={{ display: 'inline-block', transform: skew(prefersReducedMotion, 5) }}>CV</span>
    </Link>
  )
}

function SectionHeading({ children, prefersReducedMotion }: { children: React.ReactNode; prefersReducedMotion: boolean }) {
  return (
    <h2
      className="mb-4 text-xl font-black"
      style={{ color: '#ff0033', transform: skew(prefersReducedMotion, -3) }}
    >
      {children}
    </h2>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerSections({ sections, prefersReducedMotion }: { sections: SectionsOf<'engineer'>; prefersReducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <section aria-label="About">
        <SkewedPanel color="#ff0033" direction="right" delay={200}>
          <h2 className="text-xl font-black mb-3" style={{ color: '#ff0033' }}>
            ABOUT
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#ccc' }}>
            {professionalSummary.bio}
          </p>
        </SkewedPanel>
      </section>

      {/* ART SECTION 1: Phantom masks + action lines */}
      {!prefersReducedMotion && <ArtSection variant={1} />}

      {sections.jobs.length > 0 && (
        <section className="mt-8" aria-label="Work experience">
          <SkewedPanel color="#ff0033" direction="left" delay={300}>
            <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {sections.jobs.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} />
              ))}
            </div>
          </SkewedPanel>
        </section>
      )}

      {/* ART SECTION 2: Paint splatters + card suits */}
      {!prefersReducedMotion && <ArtSection variant={2} />}

      <section className="mt-8" aria-label="Tech stack">
        <SkewedPanel color="#ff0033" direction="left" delay={400}>
          <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
            TECH STACK
          </h2>
          <TechStackDisplay categories={sections.techStack} />
        </SkewedPanel>
      </section>

      <section className="mt-8" aria-label="Projects">
        <SectionHeading prefersReducedMotion={prefersReducedMotion}>PROJECTS</SectionHeading>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <ProjectCard {...slot} index={sections.projects.indexOf(slot.project)} />}
        />
      </section>

      {/* ART SECTION 3: Speed lines + chain break */}
      {!prefersReducedMotion && <ArtSection variant={3} />}

      <section className="mt-8" aria-label="Ventures">
        <SectionHeading prefersReducedMotion={prefersReducedMotion}>VENTURES</SectionHeading>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>
    </>
  )
}

function MusicianSections({ sections, prefersReducedMotion }: { sections: SectionsOf<'drummer'>; prefersReducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      {!prefersReducedMotion && <ArtSection variant={2} />}
      <section className="mt-8" aria-label="Bands">
        <SectionHeading prefersReducedMotion={prefersReducedMotion}>BANDS</SectionHeading>
        <p className="text-base mb-4" style={{ color: '#ccc' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-3 gap-4"
          renderBand={(slot) => <BandCard {...slot} />}
        />
        <p className="text-sm mt-4 italic" style={{ color: '#ff6666' }}>
          {musician.line}
        </p>
      </section>
    </>
  )
}

function MartialArtistSections({ sections, prefersReducedMotion }: { sections: SectionsOf<'fighter'>; prefersReducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      {!prefersReducedMotion && <ArtSection variant={3} />}
      <section className="mt-8" aria-label="Muay Thai">
        <SkewedPanel color="#ff0033" direction="right" delay={200}>
          <h2 className="text-xl font-black mb-2" style={{ color: '#ff0033' }}>
            MUAY THAI
          </h2>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#fff' }}>
            {martialArts.primary.title}
          </h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-3 mb-5',
              fact: 'px-4 py-3 border-l-4 border-[#ff0033] bg-[#ff0033]/10',
              term: 'text-sm tracking-widest uppercase font-bold text-[#ff6666]',
              value: 'text-sm mt-1 text-white',
              achievements: 'space-y-2',
              achievement: 'text-sm flex items-start gap-2 text-[#e0e0e0]',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[#ff6666]" aria-hidden="true">▸</span>
                <span>{achievement}</span>
              </>
            )}
          />
        </SkewedPanel>
      </section>
    </>
  )
}

function ProfessionDetails(props: { sections: ProfessionSections; prefersReducedMotion: boolean }) {
  const { sections, prefersReducedMotion } = props
  if (sections.profession === 'drummer') return <MusicianSections sections={sections} prefersReducedMotion={prefersReducedMotion} />
  if (sections.profession === 'fighter') return <MartialArtistSections sections={sections} prefersReducedMotion={prefersReducedMotion} />
  return <EngineerSections sections={sections} prefersReducedMotion={prefersReducedMotion} />
}

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: '"Bebas Neue", "Impact", sans-serif',
      }}
    >
      {/* Background layers - disabled when user prefers reduced motion */}
      {!prefersReducedMotion && (
        <>
          <DiagonalLines />
          <FloatingMasks />
          <StylishOrnaments profession={active} />
        </>
      )}
      <CardSuits />
      <HalftoneOverlay />
      <PaintStroke position="top" />
      <PaintStroke position="right" />
      {!prefersReducedMotion && <BreakingChains />}

      {/* Red corner accent */}
      <div
        className="fixed top-0 right-0 w-96 h-96 pointer-events-none z-[6]"
        style={{
          background: 'linear-gradient(225deg, rgba(255, 0, 51, 0.3), transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 py-6 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-6">
              <div style={{ transform: skew(prefersReducedMotion, -3) }}>
                {/* Persona 5 style name with paint splatter accent */}
                <div className="relative inline-block">
                  <h1
                    className="text-3xl md:text-5xl font-black tracking-wider uppercase relative z-10"
                    style={{
                      color: '#ff0033',
                      textShadow: '3px 3px 0 #000, 6px 6px 0 #330011',
                    }}
                  >
                    {name}
                  </h1>
                  {/* Paint splatter decoration behind name */}
                  <div
                    className="absolute -inset-4 -z-10 opacity-20"
                    style={{
                      background: `radial-gradient(ellipse at 20% 50%, #ff0033 0%, transparent 50%),
                                   radial-gradient(ellipse at 80% 30%, #ff0033 0%, transparent 40%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-base tracking-wider mt-2 font-medium" style={{ color: '#ccc' }}>
                  {headline}
                </p>
                <p className="text-sm md:text-base tracking-wider mt-1 italic" style={{ color: '#ff3355' }}>
                  {tagline}
                </p>
                <p className="text-sm tracking-wider mt-1" style={{ color: '#e0e0e0' }}>
                  {line}
                </p>
              </div>

              <nav
                className="flex gap-3 items-center flex-wrap"
                aria-label="Contact and CV"
              >
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} prefersReducedMotion={prefersReducedMotion} />
                ))}
                <CVLink prefersReducedMotion={prefersReducedMotion} />
                <Link
                  href="/personal-projects/game-engine"
                  className={SKEW_BUTTON}
                  style={{ ...HERO_ACTION_LOOK.email, transform: skew(prefersReducedMotion, -5) }}
                  aria-label="Play the game engine demo"
                >
                  <span style={{ display: 'inline-block', transform: skew(prefersReducedMotion, 5) }}>PLAY</span>
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Main content */}
      <main className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Take Your Time message - iconic Persona 5 loading screen */}
          <TakeYourTime prefersReducedMotion={prefersReducedMotion} />

          {/* Character selection - Persona 5 party member selection, System Engineer in the centre */}
          <section className="mb-12 mt-8" aria-label="Profession selection">
            <ProfessionSwitch
              className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-6"
              label="Profession"
              renderOption={(option) => <CharacterCard {...option} prefersReducedMotion={prefersReducedMotion} />}
            />
          </section>

          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionDetails sections={view.sections} prefersReducedMotion={prefersReducedMotion} />
          </div>
        </div>
      </main>

      {/* Contact CTA - Persona 5 style */}
      <section className="relative z-20 py-16 px-4 sm:px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <SkewedPanel color="#ff0033" direction="right" delay={0}>
                <div className="py-4">
                  <h2
                    className="text-xl font-black mb-3"
                    style={{ color: '#ff0033', transform: skew(prefersReducedMotion, -3) }}
                  >
                    READY TO WORK TOGETHER?
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#ccc' }}>
                    {line}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions.map((action) => (
                      <HeroAction key={action.id} action={action} prefersReducedMotion={prefersReducedMotion} />
                    ))}
                    <CVLink prefersReducedMotion={prefersReducedMotion} />
                  </div>
                </div>
              </SkewedPanel>
            </div>
          )}
        />
      </section>

      

      {/* Footer - Persona 5 style */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-4">
          <span style={{ color: '#ff0033' }} aria-hidden="true">♠</span>
          <p
            className="text-xs tracking-widest"
            style={{
              color: '#666',
              transform: prefersReducedMotion ? 'none' : 'skewX(-3deg)',
            }}
          >
            THE PHANTOM THIEVES OF CODE
            <span aria-hidden="true"> • </span>
            <time dateTime="2026">2026</time>
          </p>
          <span style={{ color: '#ff0033' }} aria-hidden="true">♥</span>
        </div>

        {/* Phantom mask silhouette accent */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, #ff0033 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      </footer>

      {/* Animations - Persona 5 gameplay style effects */}
      <style jsx global>{`
        /* Diagonal sliding lines for background */
        @keyframes slide-diagonal {
          0% { transform: rotate(45deg) translateY(-100%); }
          100% { transform: rotate(45deg) translateY(100%); }
        }
        .animate-slide-diagonal {
          animation: slide-diagonal 3s linear infinite;
        }

        /* Floating mask animation */
        @keyframes float-mask {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) scale(var(--scale, 1)) translateY(0); }
          50% { transform: rotate(var(--rotation, 0deg)) scale(var(--scale, 1)) translateY(-10px); }
        }

        /* Speed lines - manga action effect */
        @keyframes speed-line {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-speed-line {
          animation: speed-line 2s ease-in-out infinite;
        }

        /* Floating text/ornament animation */
        @keyframes stylishFloat {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(0) translateX(0); }
          25% { transform: rotate(var(--rotation, 0deg)) translateY(-12px) translateX(8px); }
          75% { transform: rotate(var(--rotation, 0deg)) translateY(-6px) translateX(-6px); }
        }

        /* ALL OUT ATTACK flash effect */
        @keyframes attack-flash {
          0% { opacity: 0; transform: scale(0.5) skewX(-30deg); }
          30% { opacity: 1; transform: scale(1.1) skewX(-5deg); }
          70% { opacity: 1; transform: scale(1) skewX(0deg); }
          100% { opacity: 0; transform: scale(1.2) skewX(10deg); }
        }
        .animate-attack-flash { animation: attack-flash 0.8s ease-out forwards; }

        /* Paint splatter pulse */
        @keyframes splatter-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }

        /* Cut-in slide animation */
        @keyframes cut-in-slide {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { transform: translateX(5%) skewX(-5deg); opacity: 1; }
          100% { transform: translateX(0) skewX(0deg); opacity: 1; }
        }

        /* Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Respect user's reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-diagonal,
          .animate-speed-line,
          .animate-attack-flash,
          .animate-pulse {
            animation: none !important;
          }

          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid #ff0033;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
