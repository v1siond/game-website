'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './palette'

// === ART SECTION DIVIDERS ===

// BonfireArtSection - Central bonfire with coiled sword, embers, "REST" prompt
export function BonfireArtSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative w-full h-[150px] my-8 overflow-hidden flex items-center justify-center"
      role="img"
      aria-label="Bonfire rest point art section"
    >
      {/* Dark stone ground with cracks */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: `linear-gradient(to top, #0a0806, #151210)`,
        }}
        aria-hidden="true"
      >
        {/* Stone crack patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 60" preserveAspectRatio="none">
          <path d="M0 30 L50 25 L80 35 L120 20 L160 32 L200 28" stroke="#2a2420" strokeWidth="1" fill="none"/>
          <path d="M180 40 L220 35 L260 42 L300 30 L350 38 L400 32" stroke="#2a2420" strokeWidth="1" fill="none"/>
          <path d="M100 50 L130 45 L150 52 L180 48" stroke="#201a15" strokeWidth="0.8" fill="none"/>
          <path d="M250 55 L290 48 L320 54 L360 50" stroke="#201a15" strokeWidth="0.8" fill="none"/>
          {/* Stone tile pattern */}
          <rect x="20" y="40" width="60" height="20" fill="none" stroke="#1a1510" strokeWidth="0.5"/>
          <rect x="90" y="45" width="50" height="15" fill="none" stroke="#1a1510" strokeWidth="0.5"/>
          <rect x="160" y="38" width="70" height="22" fill="none" stroke="#1a1510" strokeWidth="0.5"/>
          <rect x="250" y="42" width="55" height="18" fill="none" stroke="#1a1510" strokeWidth="0.5"/>
          <rect x="320" y="40" width="65" height="20" fill="none" stroke="#1a1510" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Fog wisps at edges */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-full pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${COLORS.fog}15, transparent)`,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-full pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${COLORS.fog}15, transparent)`,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* Central bonfire scene */}
      <div className="relative flex flex-col items-center">
        {/* Coiled Sword */}
        <svg
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
          width="30"
          height="80"
          viewBox="0 0 30 80"
        >
          {/* Blade - twisted/coiled design */}
          <path
            d="M15 0 L17 5 L16 20 L18 25 L15 45 L12 25 L14 20 L13 5 Z"
            fill="url(#swordBlade)"
          />
          {/* Coil wrapping around blade */}
          <path
            d="M12 15 Q8 18 12 22 Q16 25 12 28 Q8 31 12 35 Q16 38 12 42"
            stroke="#555"
            strokeWidth="2"
            fill="none"
          />
          {/* Crossguard - curved like coiled sword */}
          <ellipse cx="15" cy="48" rx="12" ry="4" fill="#4a4540"/>
          <ellipse cx="15" cy="47" rx="10" ry="3" fill="#5a5550"/>
          {/* Handle */}
          <rect x="13" y="50" width="4" height="16" fill="#3a2a1a"/>
          {/* Handle wrap pattern */}
          <path d="M13 52 L17 54 M13 56 L17 58 M13 60 L17 62" stroke="#2a1a0a" strokeWidth="1"/>
          {/* Pommel */}
          <circle cx="15" cy="68" r="4" fill="#4a4540"/>
          <circle cx="15" cy="68" r="2" fill="#5a5550"/>
          <defs>
            <linearGradient id="swordBlade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#aaa"/>
              <stop offset="50%" stopColor="#888"/>
              <stop offset="100%" stopColor="#666"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Main fire */}
        <div className="relative w-24 h-16 mt-12">
          {/* Fire layers */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={prefersReducedMotion ? '' : 'animate-flame'}
              style={{
                position: 'absolute',
                bottom: '0',
                left: `${15 + i * 14}%`,
                width: `${18 + Math.sin(i) * 4}px`,
                height: `${28 + Math.cos(i * 2) * 12}px`,
                background: `linear-gradient(to top,
                  ${COLORS.darksign} 0%,
                  ${COLORS.bonfire} 35%,
                  ${COLORS.ember} 65%,
                  ${COLORS.gold} 90%,
                  transparent 100%
                )`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                animationDelay: `${i * 0.15}s`,
                filter: 'blur(0.5px)',
              }}
              aria-hidden="true"
            />
          ))}
          {/* Inner bright core */}
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-8"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${COLORS.gold}, ${COLORS.ember} 50%, transparent 80%)`,
              filter: 'blur(3px)',
            }}
            aria-hidden="true"
          />
          {/* Ambient glow */}
          <div
            className="absolute -inset-12"
            style={{
              background: `radial-gradient(ellipse at 50% 70%, ${COLORS.bonfire}50, ${COLORS.darksign}20 50%, transparent 70%)`,
              filter: 'blur(10px)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Floating embers rising */}
        {!prefersReducedMotion && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bonfire-ember"
            style={{
              bottom: '20%',
              left: `${35 + Math.random() * 30}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              borderRadius: '50%',
              background: i % 3 === 0 ? COLORS.gold : i % 2 === 0 ? COLORS.bonfire : COLORS.ember,
              boxShadow: `0 0 6px ${COLORS.bonfire}`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Coal base */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full"
          style={{
            background: `radial-gradient(ellipse, #2a1a0a, #150a05 70%, #0a0504)`,
            boxShadow: `inset 0 2px 10px ${COLORS.darksign}60`,
          }}
          aria-hidden="true"
        />

        {/* REST prompt */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span
            className={`text-sm tracking-[0.4em] ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
            style={{
              color: `${COLORS.bonfire}`,
              textShadow: `0 0 20px ${COLORS.bonfire}, 0 0 40px ${COLORS.darksign}`,
            }}
          >
            REST
          </span>
        </div>
      </div>
    </div>
  )
}

// FogGateArtSection - Dramatic misty barrier with knight silhouette
export function FogGateArtSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative w-full h-[150px] my-8 overflow-hidden flex items-center justify-center"
      role="img"
      aria-label="Fog gate barrier art section"
    >
      {/* Dark stone frames on sides */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16"
        style={{
          background: `linear-gradient(to right, #0a0808, transparent)`,
        }}
        aria-hidden="true"
      >
        {/* Gothic pillar */}
        <svg className="h-full w-full" viewBox="0 0 60 150" preserveAspectRatio="none">
          <rect x="0" y="0" width="25" height="150" fill="#151210"/>
          <rect x="5" y="10" width="15" height="130" fill="#1a1815"/>
          {/* Carved detail */}
          <path d="M8 20 L18 25 L8 30 M8 50 L18 55 L8 60 M8 80 L18 85 L8 90 M8 110 L18 115 L8 120" stroke="#252220" strokeWidth="1" fill="none"/>
        </svg>
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-16"
        style={{
          background: `linear-gradient(to left, #0a0808, transparent)`,
        }}
        aria-hidden="true"
      >
        <svg className="h-full w-full" viewBox="0 0 60 150" preserveAspectRatio="none">
          <rect x="35" y="0" width="25" height="150" fill="#151210"/>
          <rect x="40" y="10" width="15" height="130" fill="#1a1815"/>
          <path d="M52 20 L42 25 L52 30 M52 50 L42 55 L52 60 M52 80 L42 85 L52 90 M52 110 L42 115 L52 120" stroke="#252220" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Main fog barrier - multiple layers for depth */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={prefersReducedMotion ? '' : 'animate-fog-gate-drift'}
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 100% at 50% 50%,
              rgba(200, 210, 220, ${0.15 - i * 0.02}) 0%,
              rgba(160, 175, 190, ${0.12 - i * 0.015}) 30%,
              rgba(120, 140, 160, ${0.08 - i * 0.01}) 60%,
              transparent 80%
            )`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + i * 2}s`,
            filter: `blur(${4 + i * 2}px)`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Ethereal particles */}
      {!prefersReducedMotion && [...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-ethereal-particle"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
            background: `radial-gradient(circle, rgba(200, 215, 230, ${0.4 + Math.random() * 0.3}), transparent)`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Knight silhouette approaching */}
      <svg
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        width="50"
        height="70"
        viewBox="0 0 50 70"
        style={{ opacity: 0.6 }}
      >
        {/* Knight from behind, walking toward fog */}
        <g fill="#1a1a1a">
          {/* Helmet */}
          <ellipse cx="25" cy="8" rx="7" ry="8"/>
          {/* Plume */}
          <path d="M25 0 Q30 5 28 12 Q25 8 22 12 Q20 5 25 0" fill="#2a2a2a"/>
          {/* Shoulders/Cape */}
          <path d="M12 14 L25 18 L38 14 L40 40 L25 45 L10 40 Z"/>
          {/* Cape flowing */}
          <path d="M12 40 Q8 50 15 60 L25 55 L35 60 Q42 50 38 40" fill="#151515"/>
          {/* Legs */}
          <path d="M20 45 L18 68 L22 68 L24 50 L26 68 L30 68 L28 45"/>
          {/* Sword on back */}
          <rect x="30" y="5" width="3" height="35" fill="#444" transform="rotate(15, 30, 5)"/>
        </g>
      </svg>

      {/* "Traverse the fog?" prompt */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
        <span
          className={`text-xs tracking-[0.3em] ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
          style={{
            color: `${COLORS.fog}`,
            textShadow: `0 0 15px ${COLORS.fog}, 0 0 30px rgba(138, 155, 168, 0.5)`,
          }}
        >
          Traverse the fog?
        </span>
      </div>
    </div>
  )
}

// PraiseTheSunArtSection - Solaire silhouette with golden sun
export function PraiseTheSunArtSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative w-full h-[150px] my-8 overflow-hidden flex items-center justify-center"
      role="img"
      aria-label="Praise the Sun art section"
    >
      {/* Stone background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #0c0a08, #151210 30%, #1a1815 70%, #0c0a08)`,
        }}
        aria-hidden="true"
      >
        {/* Stone brick pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 150" preserveAspectRatio="none">
          <rect x="0" y="0" width="80" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="80" y="0" width="100" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="180" y="0" width="90" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="270" y="0" width="70" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="340" y="0" width="60" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="40" y="30" width="90" height="35" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="130" y="30" width="80" height="35" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="210" y="30" width="110" height="35" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="320" y="30" width="80" height="35" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="0" y="65" width="70" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="70" y="65" width="100" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="170" y="65" width="85" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="255" y="65" width="95" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
          <rect x="350" y="65" width="50" height="30" fill="none" stroke="#2a2520" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Warm golden glow background */}
      <div
        className={prefersReducedMotion ? '' : 'animate-sun-glow'}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${COLORS.gold}40 0%, ${COLORS.gold}20 30%, ${COLORS.bonfire}10 50%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />

      {/* Sun with rays */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Sun rays - 12 rays for full effect */}
          <g className={prefersReducedMotion ? '' : 'animate-sun-pulse'} style={{ transformOrigin: '40px 40px' }}>
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="40"
                y1="40"
                x2={40 + Math.cos((i * Math.PI) / 6) * 35}
                y2={40 + Math.sin((i * Math.PI) / 6) * 35}
                stroke={COLORS.gold}
                strokeWidth="2"
                opacity={0.6 + (i % 2) * 0.2}
              />
            ))}
            {/* Outer glow ring */}
            <circle cx="40" cy="40" r="28" fill="none" stroke={COLORS.gold} strokeWidth="1" opacity="0.3"/>
            {/* Main sun circle */}
            <circle cx="40" cy="40" r="18" fill={`url(#sunGradient)`}/>
            <circle cx="40" cy="40" r="14" fill={COLORS.gold} opacity="0.8"/>
            <defs>
              <radialGradient id="sunGradient">
                <stop offset="0%" stopColor="#fff8e0"/>
                <stop offset="50%" stopColor={COLORS.gold}/>
                <stop offset="100%" stopColor={COLORS.bonfire}/>
              </radialGradient>
            </defs>
          </g>
        </svg>
      </div>

      {/* Solaire silhouette doing praise gesture */}
      <svg
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        width="70"
        height="90"
        viewBox="0 0 70 90"
      >
        <g fill={COLORS.ash}>
          {/* Head with distinctive bucket helm */}
          <ellipse cx="35" cy="22" rx="8" ry="9"/>
          {/* Helm plume suggestion */}
          <path d="M35 13 Q40 8 38 15 Q35 10 32 15 Q30 8 35 13" fill="#4a4643"/>

          {/* Body - chainmail torso */}
          <path d="M25 30 L35 55 L45 30 Z"/>

          {/* Sun emblem on chest - Solaire's signature */}
          <circle cx="35" cy="38" r="5" fill={COLORS.gold} opacity="0.4"/>

          {/* Left arm - raised in praise */}
          <path d="M27 32 L8 12 L12 10 L30 28 Z"/>
          {/* Left hand spread */}
          <circle cx="10" cy="11" r="4"/>

          {/* Right arm - raised in praise */}
          <path d="M43 32 L62 12 L58 10 L40 28 Z"/>
          {/* Right hand spread */}
          <circle cx="60" cy="11" r="4"/>

          {/* Legs in wide stance */}
          <path d="M32 52 L28 85 L34 85 L35 60 L36 85 L42 85 L38 52 Z"/>

          {/* Cape flowing behind */}
          <path d="M25 30 Q20 45 22 70 L35 65 L48 70 Q50 45 45 30" fill="#3a3633" opacity="0.7"/>
        </g>
      </svg>

      {/* "If only I could be so grossly incandescent" text */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span
          className="text-[10px] tracking-[0.2em] italic"
          style={{
            color: `${COLORS.gold}`,
            textShadow: `0 0 10px ${COLORS.gold}, 0 0 20px ${COLORS.bonfire}50`,
          }}
        >
          &quot;If only I could be so grossly incandescent...&quot;
        </span>
      </div>
    </div>
  )
}

// Fog Gate - misty barrier as section divider
export function FogGate() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative h-20 w-full overflow-hidden my-8"
      role="separator"
      aria-label="Section divider - fog wall"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main fog layers */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={prefersReducedMotion ? '' : 'animate-fog-drift'}
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(138, 155, 168, ${0.08 - i * 0.015}) 15%,
                rgba(180, 195, 210, ${0.12 - i * 0.02}) 50%,
                rgba(138, 155, 168, ${0.08 - i * 0.015}) 85%,
                transparent 100%
              )`,
              animationDelay: `${i * 2.5}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Fog particles */}
        {!prefersReducedMotion && [...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-fog-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${25 + Math.random() * 50}px`,
              height: `${12 + Math.random() * 25}px`,
              background: `radial-gradient(ellipse, rgba(180, 195, 210, ${0.08 + Math.random() * 0.08}), transparent)`,
              animationDelay: `${Math.random() * 6}s`,
              filter: 'blur(6px)',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Interaction prompt */}
        <div className="relative z-10 text-center">
          <span
            className={`text-xs tracking-[0.3em] ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
            style={{ color: `${COLORS.fog}80`, textShadow: `0 0 15px ${COLORS.fog}40` }}
          >
            TRAVERSE THE WHITE LIGHT
          </span>
        </div>
      </div>
    </div>
  )
}
