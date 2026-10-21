'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './palette'

// Praise the Sun gesture silhouette
export function PraiseTheSun({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Praise the Sun gesture - iconic Dark Souls pose"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sun rays */}
        <g className="animate-sun-pulse" style={{ transformOrigin: '50px 25px' }}>
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="25"
              x2={50 + Math.cos((i * Math.PI) / 4) * 18}
              y2={25 + Math.sin((i * Math.PI) / 4) * 18}
              stroke={COLORS.gold}
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
          <circle cx="50" cy="25" r="10" fill={COLORS.gold} opacity="0.8" />
        </g>
        {/* Knight silhouette - arms raised */}
        <g fill={COLORS.ash}>
          {/* Head */}
          <ellipse cx="50" cy="45" rx="6" ry="7" />
          {/* Body */}
          <path d="M42 52 L50 75 L58 52 Z" />
          {/* Left arm raised */}
          <path d="M43 55 L28 35 L32 33 L45 50 Z" />
          {/* Right arm raised */}
          <path d="M57 55 L72 35 L68 33 L55 50 Z" />
          {/* Legs */}
          <path d="M46 72 L44 95 L48 95 L50 78 L52 95 L56 95 L54 72 Z" />
        </g>
      </svg>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${COLORS.gold}40 0%, transparent 50%)`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// Animated Bonfire component - enhanced with more realistic flames
export function Bonfire({ size = 'normal', label }: { size?: 'small' | 'normal' | 'large'; label?: string }) {
  const scales = { small: 0.5, normal: 1, large: 1.5 }
  const scale = scales[size]
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative"
      style={{ transform: `scale(${scale})` }}
      role="img"
      aria-label={label || 'Bonfire checkpoint'}
    >
      {/* Coiled sword in ground */}
      <div
        className="absolute -top-14 left-1/2 -translate-x-1/2 w-2 h-16"
        style={{
          background: `linear-gradient(to bottom, #aaa, #666 30%, #444)`,
          boxShadow: '0 0 5px rgba(0,0,0,0.8)',
          clipPath: 'polygon(30% 0, 70% 0, 60% 100%, 40% 100%)',
        }}
        aria-hidden="true"
      >
        {/* Sword crossguard - curved like coiled sword */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3"
          style={{
            background: `linear-gradient(to bottom, #777, #555)`,
            borderRadius: '0 0 50% 50%',
          }}
        />
        {/* Sword handle wrap */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-5"
          style={{ background: '#442211' }}
        />
      </div>

      {/* Fire base container */}
      <div className="relative w-20 h-16">
        {/* Main flames - more organic shapes */}
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={prefersReducedMotion ? '' : 'animate-flame'}
            style={{
              position: 'absolute',
              bottom: '8px',
              left: `${5 + i * 12}%`,
              width: `${14 + Math.sin(i) * 6}px`,
              height: `${24 + Math.cos(i * 2) * 16}px`,
              background: `linear-gradient(to top,
                ${COLORS.darksign} 0%,
                ${COLORS.bonfire} 30%,
                ${COLORS.ember} 60%,
                ${COLORS.gold} 85%,
                transparent 100%
              )`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animationDelay: `${i * 0.12}s`,
              filter: 'blur(0.5px)',
              opacity: 0.95,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Inner bright core */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-6"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${COLORS.gold}, ${COLORS.ember} 50%, transparent 80%)`,
            filter: 'blur(2px)',
          }}
          aria-hidden="true"
        />

        {/* Rising embers */}
        {!prefersReducedMotion && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-ember"
            style={{
              left: `${25 + Math.random() * 50}%`,
              bottom: '40%',
              background: i % 3 === 0 ? COLORS.gold : i % 2 === 0 ? COLORS.bonfire : COLORS.ember,
              animationDelay: `${i * 0.25}s`,
              boxShadow: `0 0 4px ${COLORS.bonfire}`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Ambient glow */}
        <div
          className="absolute -inset-8"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${COLORS.bonfire}60, ${COLORS.darksign}30 40%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Coal/ash base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full"
        style={{
          background: `radial-gradient(ellipse, #331100, #1a0800 60%, #0a0400)`,
          boxShadow: `inset 0 2px 8px ${COLORS.darksign}40`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// Estus Flask - enhanced
export function EstusFlask({ charges = 5, maxCharges = 5 }: { charges?: number; maxCharges?: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label={`Estus Flask: ${charges} of ${maxCharges} charges`}
    >
      <div className="relative w-8 h-14">
        {/* Flask body - more rounded like actual Estus */}
        <div
          className="absolute bottom-0 w-full h-11 rounded-b-xl rounded-t-lg"
          style={{
            background: `linear-gradient(to right, #4a3520, #6b4c30, #4a3520)`,
            border: '2px solid #3a2810',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)',
          }}
          aria-hidden="true"
        />
        {/* Flask neck */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-5 rounded-t-lg"
          style={{
            background: `linear-gradient(to right, #3a2810, #4a3520, #3a2810)`,
          }}
          aria-hidden="true"
        />
        {/* Cork */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 rounded-t"
          style={{ background: '#2a1808' }}
          aria-hidden="true"
        />
        {/* Liquid */}
        <div
          className={`absolute bottom-1 left-1 right-1 rounded-b-lg ${!prefersReducedMotion ? 'animate-liquid-glow' : ''}`}
          style={{
            height: `${(charges / maxCharges) * 75}%`,
            background: `linear-gradient(to top, ${COLORS.darksign}, ${COLORS.bonfire}, ${COLORS.ember})`,
            boxShadow: `0 0 12px ${COLORS.bonfire}, inset 0 0 12px ${COLORS.gold}80`,
          }}
          aria-hidden="true"
        />
      </div>
      <span className="text-sm font-bold" style={{ color: COLORS.bonfire }}>
        {charges}/{maxCharges}
      </span>
    </div>
  )
}

// Darksign - Sun eclipse symbol - enhanced
export function Darksign({ size = 40 }: { size?: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Darksign - mark of the undead"
    >
      {/* Outer ring - dark flame corona */}
      <div
        className={prefersReducedMotion ? '' : 'animate-darksign-pulse'}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle,
            transparent 35%,
            ${COLORS.darksign} 45%,
            ${COLORS.bonfire} 50%,
            ${COLORS.blood} 60%,
            #330000 70%,
            transparent 78%
          )`,
          boxShadow: `0 0 25px ${COLORS.darksign}50, inset 0 0 20px ${COLORS.darksign}30`,
        }}
        aria-hidden="true"
      />
      {/* Inner dark circle - the hollow sun */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          right: '20%',
          bottom: '20%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #1a1a1a, ${COLORS.humanity})`,
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
// Sword stuck in ground - rest point marker
export function SwordMarker() {
  return (
    <div className="relative w-6 h-16" role="img" aria-label="Bonfire sword marker">
      {/* Blade */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-10"
        style={{
          background: `linear-gradient(to bottom, #ddd, #999 20%, #777)`,
          boxShadow: '0 0 5px rgba(0,0,0,0.5)',
          clipPath: 'polygon(30% 0, 70% 0, 55% 100%, 45% 100%)',
        }}
        aria-hidden="true"
      />
      {/* Crossguard */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded"
        style={{ background: `linear-gradient(to bottom, #666, ${COLORS.ash})` }}
        aria-hidden="true"
      />
      {/* Handle */}
      <div
        className="absolute top-9 left-1/2 -translate-x-1/2 w-1.5 h-4"
        style={{ background: '#3a2211' }}
        aria-hidden="true"
      />
      {/* Pommel */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
        style={{ background: `linear-gradient(135deg, #444, #222)` }}
        aria-hidden="true"
      />
    </div>
  )
}
