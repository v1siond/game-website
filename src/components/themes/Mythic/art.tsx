import { memo } from 'react'
import { GOW } from './palette'

// The art breaks between sections and the Greek key border they share with the frames.

// =============================================================================
// GREEK MEANDER PATTERN - Classic Greek key border
// =============================================================================
export const GreekMeander = memo(function GreekMeander({ color = GOW.gold, opacity = 0.3 }: { color?: string; opacity?: number }) {
  return (
    <svg className="w-full h-4" viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="meander" patternUnits="userSpaceOnUse" width="32" height="16">
          <path
            d="M0,8 L4,8 L4,4 L8,4 L8,12 L12,12 L12,0 L16,0 L16,16 L20,16 L20,4 L24,4 L24,12 L28,12 L28,8 L32,8"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="400" height="16" fill="url(#meander)" />
    </svg>
  )
})

// =============================================================================
// ART SECTION 1 - Blades of Chaos with Chains
// =============================================================================
export const ArtSectionWeapons = memo(function ArtSectionWeapons() {
  return (
    <div className="relative z-20 py-12 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-40 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 800 140" preserveAspectRatio="xMidYMid meet">
          {/* Left chain */}
          <g opacity="0.6">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse
                key={`left-chain-${i}`}
                cx={80 + i * 25}
                cy={70 + Math.sin(i * 0.8) * 8}
                rx="8"
                ry="12"
                fill="none"
                stroke={GOW.goldDark}
                strokeWidth="3"
                transform={`rotate(${i * 15}, ${80 + i * 25}, ${70 + Math.sin(i * 0.8) * 8})`}
              />
            ))}
          </g>

          {/* Left Blade */}
          <g transform="translate(320, 70)">
            <path d="M-60,-8 L0,-20 L10,0 L0,20 L-60,8 Z" fill={GOW.ashLight} />
            <path d="M-55,-5 L-5,-15 L5,0 L-5,15 L-55,5 Z" fill={GOW.fire} opacity="0.5" />
            <path d="M-50,0 L-10,0" stroke={GOW.fireBright} strokeWidth="2" opacity="0.8" />
            {/* Blood drip */}
            <path d="M5,0 Q8,10 5,20 Q2,10 5,0" fill={GOW.blood} opacity="0.6" />
          </g>

          {/* Central Omega */}
          <g transform="translate(400, 70)">
            <path
              d="M0,-30 C-20,-30 -35,-10 -35,15 L-25,15 C-25,-5 -15,-20 0,-20 C15,-20 25,-5 25,15 L35,15 C35,-10 20,-30 0,-30"
              fill={GOW.gold}
              opacity="0.8"
            />
            <path d="M0,15 Q-2,25 0,35 Q2,25 0,15" fill={GOW.blood} opacity="0.7" />
          </g>

          {/* Right Blade */}
          <g transform="translate(480, 70)">
            <path d="M60,-8 L0,-20 L-10,0 L0,20 L60,8 Z" fill={GOW.ashLight} />
            <path d="M55,-5 L5,-15 L-5,0 L5,15 L55,5 Z" fill={GOW.fire} opacity="0.5" />
            <path d="M50,0 L10,0" stroke={GOW.fireBright} strokeWidth="2" opacity="0.8" />
            {/* Blood drip */}
            <path d="M-5,0 Q-8,10 -5,20 Q-2,10 -5,0" fill={GOW.blood} opacity="0.6" />
          </g>

          {/* Right chain */}
          <g opacity="0.6">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse
                key={`right-chain-${i}`}
                cx={720 - i * 25}
                cy={70 + Math.sin(i * 0.8) * 8}
                rx="8"
                ry="12"
                fill="none"
                stroke={GOW.goldDark}
                strokeWidth="3"
                transform={`rotate(${-i * 15}, ${720 - i * 25}, ${70 + Math.sin(i * 0.8) * 8})`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Greek meander divider */}
      <div className="max-w-md mx-auto">
        <GreekMeander color={GOW.blood} opacity={0.4} />
      </div>
    </div>
  )
})

// =============================================================================
// ART SECTION 2 - Greek Pillars with Blood
// =============================================================================
export const ArtSectionPillars = memo(function ArtSectionPillars() {
  return (
    <div className="relative z-20 py-12 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-5xl mx-auto relative h-32 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 700 120" preserveAspectRatio="xMidYMid meet">
          {/* Left pillar */}
          <g transform="translate(100, 10)">
            {/* Capital */}
            <rect x="-25" y="0" width="50" height="8" fill={GOW.ashLight} />
            <rect x="-20" y="8" width="40" height="4" fill={GOW.ash} />
            {/* Shaft with flutes */}
            <rect x="-15" y="12" width="30" height="85" fill={GOW.ash} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-12 + i * 6} y="15" width="2" height="80" fill={GOW.ashDark} opacity="0.4" />
            ))}
            {/* Base */}
            <rect x="-20" y="97" width="40" height="6" fill={GOW.ashLight} />
            {/* Blood drip */}
            <path d="M5,0 Q3,25 8,50 Q4,70 6,95" fill="none" stroke={GOW.blood} strokeWidth="3" opacity="0.5" />
          </g>

          {/* Center - Spartan helmet silhouette */}
          <g transform="translate(350, 60)">
            <path
              d="M0,-45 C-30,-45 -45,-25 -45,5 L-45,35 L-35,40 L-35,15 C-35,-15 -20,-35 0,-35 C20,-35 35,-15 35,15 L35,40 L45,35 L45,5 C45,-25 30,-45 0,-45"
              fill={GOW.gold}
              opacity="0.7"
            />
            {/* Crest */}
            <path
              d="M0,-45 Q-5,-55 0,-60 Q5,-55 0,-45"
              fill={GOW.blood}
              opacity="0.8"
            />
            {/* Eye slit */}
            <rect x="-30" y="0" width="60" height="6" fill={GOW.voidDeep} opacity="0.8" />
          </g>

          {/* Right pillar */}
          <g transform="translate(600, 10)">
            {/* Capital */}
            <rect x="-25" y="0" width="50" height="8" fill={GOW.ashLight} />
            <rect x="-20" y="8" width="40" height="4" fill={GOW.ash} />
            {/* Shaft with flutes */}
            <rect x="-15" y="12" width="30" height="85" fill={GOW.ash} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-12 + i * 6} y="15" width="2" height="80" fill={GOW.ashDark} opacity="0.4" />
            ))}
            {/* Base */}
            <rect x="-20" y="97" width="40" height="6" fill={GOW.ashLight} />
            {/* Blood drip */}
            <path d="M-5,0 Q-3,30 -8,60 Q-4,80 -6,95" fill="none" stroke={GOW.blood} strokeWidth="3" opacity="0.5" />
          </g>

          {/* Connecting laurel wreath hints */}
          <path d="M145,50 Q200,30 280,50" fill="none" stroke={GOW.gold} strokeWidth="1" opacity="0.3" />
          <path d="M420,50 Q500,30 555,50" fill="none" stroke={GOW.gold} strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* Divider */}
      <div className="max-w-xs mx-auto flex items-center gap-3 mt-4">
        <div className="flex-1 h-px" style={{ background: GOW.gold, opacity: 0.3 }} />
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10,2 L18,10 L10,18 L2,10 Z" fill={GOW.blood} opacity="0.5" />
        </svg>
        <div className="flex-1 h-px" style={{ background: GOW.gold, opacity: 0.3 }} />
      </div>
    </div>
  )
})

// =============================================================================
// ART SECTION 3 - Mount Olympus / Tartarus
// =============================================================================
export const ArtSectionOlympus = memo(function ArtSectionOlympus() {
  return (
    <div className="relative z-20 py-12 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-36">
        <svg className="w-full h-full" viewBox="0 0 1000 140" preserveAspectRatio="xMidYMid meet">
          {/* Tartarus flames at bottom */}
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={`flame-${i}`}
              d={`M${50 + i * 65},140 Q${45 + i * 65},${120 - (i % 3) * 10} ${55 + i * 65},${100 - (i % 4) * 8} Q${50 + i * 65},${115 - (i % 3) * 5} ${50 + i * 65},140`}
              fill={i % 2 === 0 ? GOW.fire : GOW.fireBright}
              opacity={0.3 + (i % 3) * 0.1}
            />
          ))}

          {/* Mount Olympus silhouette */}
          <path
            d="M300,140 L350,90 L400,100 L450,50 L500,30 L550,50 L600,100 L650,90 L700,140"
            fill={GOW.ashDark}
            opacity="0.7"
          />

          {/* Temple at peak */}
          <g transform="translate(500, 30)">
            {/* Roof */}
            <path d="M-30,0 L0,-20 L30,0 Z" fill={GOW.gold} opacity="0.6" />
            {/* Columns */}
            <rect x="-25" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            <rect x="-10" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            <rect x="6" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            <rect x="21" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            {/* Divine glow */}
            <ellipse cx="0" cy="10" rx="40" ry="30" fill={GOW.gold} opacity="0.15" />
          </g>

          {/* Blood rivers */}
          <path
            d="M100,140 Q200,120 300,130 Q400,110 500,125"
            fill="none"
            stroke={GOW.blood}
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M500,125 Q600,115 700,130 Q800,120 900,140"
            fill="none"
            stroke={GOW.blood}
            strokeWidth="3"
            opacity="0.3"
          />

          {/* Chains hanging from sky */}
          {[150, 400, 600, 850].map((x, i) => (
            <g key={`chain-${i}`} opacity="0.4">
              {Array.from({ length: 4 }, (_, j) => (
                <ellipse
                  key={j}
                  cx={x}
                  cy={j * 15}
                  rx="4"
                  ry="8"
                  fill="none"
                  stroke={GOW.goldDark}
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Fire glow at bottom */}
        <div
          className="absolute left-0 right-0 bottom-0 h-16"
          style={{
            background: `linear-gradient(180deg, transparent, ${GOW.fire}15)`,
          }}
        />
      </div>

      {/* Greek meander divider */}
      <div className="max-w-sm mx-auto mt-4">
        <GreekMeander color={GOW.gold} opacity={0.25} />
      </div>
    </div>
  )
})
