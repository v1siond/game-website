'use client'

import { useEffect, useState } from 'react'
import { ChainLink } from './backdrop'

// Persona 5 themed decorative art break section
export function ArtSection({ variant = 1 }: { variant?: 1 | 2 | 3 }) {
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
