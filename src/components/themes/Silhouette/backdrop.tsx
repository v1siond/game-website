import { LIMBO } from './palette'

// =============================================================================
// ATMOSPHERIC EFFECTS - Enhanced for impact
// Multiple fog layers, floating particles, strong vignette
// Uses CSS transforms only (GPU-accelerated), will-change where needed
// =============================================================================

export function LimboAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* Film grain layer - enhanced opacity */}
      <div
        className="absolute inset-0 opacity-20 grain will-change-transform"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Fog layer 1 - slow drift */}
      <div
        className="absolute inset-0 fog-drift-slow will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1}20 25%, ${LIMBO.midGrey2}15 50%, ${LIMBO.midGrey1}20 75%, transparent 100%)`,
        }}
      />

      {/* Fog layer 2 - faster counter-drift for depth */}
      <div
        className="absolute inset-0 fog-drift-fast will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${LIMBO.darkGrey3}12 35%, transparent 50%, ${LIMBO.darkGrey3}12 65%, transparent 90%)`,
        }}
      />

      {/* Fog layer 3 - vertical creep from bottom */}
      <div
        className="absolute inset-0 fog-rise will-change-transform"
        style={{
          background: `linear-gradient(0deg, ${LIMBO.midGrey1}25 0%, ${LIMBO.midGrey2}10 30%, transparent 60%)`,
        }}
      />

      {/* Floating dust particles */}
      <div className="absolute inset-0">
        <div className="particle particle-1" style={{ left: '10%', top: '20%' }} />
        <div className="particle particle-2" style={{ left: '25%', top: '60%' }} />
        <div className="particle particle-3" style={{ left: '45%', top: '35%' }} />
        <div className="particle particle-4" style={{ left: '65%', top: '70%' }} />
        <div className="particle particle-5" style={{ left: '80%', top: '25%' }} />
        <div className="particle particle-6" style={{ left: '15%', top: '80%' }} />
        <div className="particle particle-7" style={{ left: '55%', top: '15%' }} />
        <div className="particle particle-8" style={{ left: '90%', top: '55%' }} />
      </div>

      {/* HEAVY vignette - stronger for cinematic feel */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 10%, ${LIMBO.black}40 40%, ${LIMBO.black}85 70%, ${LIMBO.black} 100%)`,
        }}
      />

      {/* Top/bottom noir gradient - cinematic letterbox effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${LIMBO.black}85 0%, ${LIMBO.black}40 8%, transparent 18%, transparent 82%, ${LIMBO.black}40 92%, ${LIMBO.black}90 100%)`,
        }}
      />

      {/* Side vignettes for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${LIMBO.black}60 0%, transparent 15%, transparent 85%, ${LIMBO.black}60 100%)`,
        }}
      />
    </div>
  )
}

// =============================================================================
// LIMBO ART ELEMENTS - Spider, Gears, Forest, Boy, Bear Traps
// =============================================================================

// GIANT SPIDER - Massive 8-legged silhouette (iconic Limbo boss)
export function GiantSpiderArt() {
  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden" aria-hidden="true">
      {/* Gradient transition from content above */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.voidBlack} 0%, ${LIMBO.darkGrey2} 15%, ${LIMBO.midGrey1}30 40%, ${LIMBO.darkGrey2} 70%, ${LIMBO.voidBlack} 100%)`
      }} />
      {/* Fog overlay for depth */}
      <div className="absolute inset-0 fog-drift-slow opacity-40" style={{
        background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1}40 30%, ${LIMBO.midGrey2}30 50%, ${LIMBO.midGrey1}40 70%, transparent 100%)`
      }} />

      {/* Distant trees in fog */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="xMidYMid slice">
        {/* Background fog trees */}
        <g fill={LIMBO.darkGrey3} opacity="0.3">
          <path d="M50,256 L50,180 Q30,170 25,150 Q45,160 50,140 Q35,130 30,110 Q50,120 50,100 L50,80 L55,80 L55,256 Z" />
          <path d="M150,256 L150,160 Q130,150 125,130 Q145,140 150,120 Q135,110 130,90 Q150,100 150,80 L150,60 L155,60 L155,256 Z" />
          <path d="M700,256 L700,170 Q720,160 725,140 Q705,150 700,130 Q715,120 720,100 Q700,110 700,90 L700,70 L705,70 L705,256 Z" />
          <path d="M600,256 L600,190 Q580,180 575,160 Q595,170 600,150 Q585,140 580,120 Q600,130 600,110 L600,90 L605,90 L605,256 Z" />
        </g>

        {/* GIANT SPIDER - simplified animation */}
        <g className="spider-breathe will-change-transform" style={{ transformOrigin: '400px 180px' }}>
          {/* Spider body - large abdomen */}
          <ellipse cx="400" cy="180" rx="60" ry="40" fill={LIMBO.black} />
          {/* Spider cephalothorax */}
          <ellipse cx="400" cy="130" rx="35" ry="25" fill={LIMBO.black} />

          {/* GLOWING EYES - multiple pairs */}
          <circle cx="385" cy="120" r="6" fill={LIMBO.fogWhite3} className="spider-eye" />
          <circle cx="415" cy="120" r="6" fill={LIMBO.fogWhite3} className="spider-eye" />
          <circle cx="375" cy="130" r="4" fill={LIMBO.fogWhite2} opacity="0.7" />
          <circle cx="425" cy="130" r="4" fill={LIMBO.fogWhite2} opacity="0.7" />
          <circle cx="395" cy="112" r="3" fill={LIMBO.fogWhite1} opacity="0.5" />
          <circle cx="405" cy="112" r="3" fill={LIMBO.fogWhite1} opacity="0.5" />

          {/* Spider legs - 8 total, spindly and threatening */}
          {/* Left legs */}
          <path d="M340,140 Q280,100 220,60 Q210,50 190,30" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-1" />
          <path d="M345,155 Q290,130 230,100 Q200,80 150,50" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-2" />
          <path d="M350,170 Q300,170 250,180 Q180,200 100,220" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-3" />
          <path d="M355,190 Q310,210 260,240 Q220,256 160,256" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-4" />

          {/* Right legs */}
          <path d="M460,140 Q520,100 580,60 Q590,50 610,30" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-1" />
          <path d="M455,155 Q510,130 570,100 Q600,80 650,50" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-2" />
          <path d="M450,170 Q500,170 550,180 Q620,200 700,220" stroke={LIMBO.black} strokeWidth="7" fill="none" strokeLinecap="round" className="spider-leg-3" />
          <path d="M445,190 Q490,210 540,240 Q580,256 640,256" stroke={LIMBO.black} strokeWidth="8" fill="none" strokeLinecap="round" className="spider-leg-4" />

          {/* Fangs / pedipalps */}
          <path d="M390,145 Q385,155 380,165" stroke={LIMBO.black} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M410,145 Q415,155 420,165" stroke={LIMBO.black} strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>

        {/* Hanging web strands */}
        <path d="M400,0 Q395,60 400,130" stroke={LIMBO.lightGrey1} strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M350,0 Q360,80 370,120" stroke={LIMBO.lightGrey1} strokeWidth="1" fill="none" opacity="0.2" />
        <path d="M450,0 Q440,80 430,120" stroke={LIMBO.lightGrey1} strokeWidth="1" fill="none" opacity="0.2" />
      </svg>

      {/* Film grain overlay on art - reduced */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// INDUSTRIAL GEARS - Interlocking, rotating machinery
export function IndustrialGearsArt() {
  return (
    <div className="relative w-full h-72 md:h-80 overflow-hidden" aria-hidden="true">
      {/* Gradient transition from content */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.voidBlack} 0%, ${LIMBO.darkGrey2} 20%, ${LIMBO.darkGrey3}40 50%, ${LIMBO.darkGrey2} 80%, ${LIMBO.voidBlack} 100%)`
      }} />
      {/* Fog layer for atmosphere */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1}30 40%, ${LIMBO.midGrey2}20 60%, transparent 100%)`
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 224" preserveAspectRatio="xMidYMid slice">
        {/* Factory smokestacks in background */}
        <rect x="50" y="120" width="30" height="104" fill={LIMBO.darkGrey3} />
        <rect x="720" y="100" width="40" height="124" fill={LIMBO.darkGrey3} />
        <rect x="680" y="140" width="25" height="84" fill={LIMBO.darkGrey3} />

        {/* Smoke from stacks - static, no animation for perf */}
        <g opacity="0.1">
          <ellipse cx="65" cy="100" rx="20" ry="15" fill={LIMBO.lightGrey2} />
          <ellipse cx="740" cy="80" rx="25" ry="18" fill={LIMBO.lightGrey2} />
        </g>

        {/* Pipes */}
        <rect x="0" y="180" width="800" height="8" fill={LIMBO.black} />
        <rect x="100" y="160" width="8" height="64" fill={LIMBO.black} />
        <rect x="200" y="150" width="8" height="74" fill={LIMBO.black} />
        <rect x="600" y="155" width="8" height="69" fill={LIMBO.black} />

        {/* LARGE GEAR - main, slow rotation - GPU accelerated */}
        <g className="gear-rotate-slow will-change-transform" style={{ transformOrigin: '300px 120px' }}>
          <circle cx="300" cy="120" r="70" fill="none" stroke={LIMBO.black} strokeWidth="12" />
          <circle cx="300" cy="120" r="20" fill={LIMBO.black} />
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360 / 16) * Math.PI / 180
            return (
              <line
                key={i}
                x1={300 + 65 * Math.cos(angle)}
                y1={120 + 65 * Math.sin(angle)}
                x2={300 + 90 * Math.cos(angle)}
                y2={120 + 90 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="14"
              />
            )
          })}
        </g>

        {/* MEDIUM GEAR - interlocking, opposite rotation - GPU accelerated */}
        <g className="gear-rotate-medium will-change-transform" style={{ transformOrigin: '480px 110px' }}>
          <circle cx="480" cy="110" r="50" fill="none" stroke={LIMBO.black} strokeWidth="10" />
          <circle cx="480" cy="110" r="14" fill={LIMBO.black} />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360 / 12) * Math.PI / 180
            return (
              <line
                key={i}
                x1={480 + 46 * Math.cos(angle)}
                y1={110 + 46 * Math.sin(angle)}
                x2={480 + 65 * Math.cos(angle)}
                y2={110 + 65 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="12"
              />
            )
          })}
        </g>

        {/* SMALL GEAR - removed for performance (keep only 2 gears) */}
        <g style={{ transformOrigin: '160px 140px' }}>
          <circle cx="160" cy="140" r="30" fill="none" stroke={LIMBO.black} strokeWidth="6" />
          <circle cx="160" cy="140" r="8" fill={LIMBO.black} />
          {[...Array(10)].map((_, i) => {
            const angle = (i * 36) * Math.PI / 180
            return (
              <line
                key={i}
                x1={160 + 27 * Math.cos(angle)}
                y1={140 + 27 * Math.sin(angle)}
                x2={160 + 40 * Math.cos(angle)}
                y2={140 + 40 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="8"
              />
            )
          })}
        </g>

        {/* SAW BLADE - static for performance */}
        <g style={{ transformOrigin: '620px 170px' }}>
          <circle cx="620" cy="170" r="35" fill="none" stroke={LIMBO.black} strokeWidth="4" />
          <circle cx="620" cy="170" r="6" fill={LIMBO.black} />
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15) * Math.PI / 180
            const inner = i % 2 === 0 ? 28 : 32
            return (
              <line
                key={i}
                x1={620 + inner * Math.cos(angle)}
                y1={170 + inner * Math.sin(angle)}
                x2={620 + 42 * Math.cos(angle)}
                y2={170 + 42 * Math.sin(angle)}
                stroke={LIMBO.black}
                strokeWidth="3"
              />
            )
          })}
        </g>

        {/* BEAR TRAP - jagged teeth */}
        <g>
          <ellipse cx="550" cy="210" rx="30" ry="8" fill={LIMBO.black} />
          <path d="M520,210 L530,190 L540,210 L550,185 L560,210 L570,188 L580,210"
                stroke={LIMBO.black} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Chains hanging - static for performance */}
        <g style={{ transformOrigin: '400px 0' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ellipse key={i} cx="400" cy={i * 18 + 10} rx="6" ry="8" fill="none" stroke={LIMBO.black} strokeWidth="3" />
          ))}
        </g>
      </svg>

      {/* Film grain - reduced */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}

// FOREST - Bare, twisted branches, fog, hanging silhouettes
export function ForestArt() {
  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden" aria-hidden="true">
      {/* Gradient transition from content */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${LIMBO.voidBlack} 0%, ${LIMBO.darkGrey2} 10%, ${LIMBO.midGrey2}30 35%, ${LIMBO.darkGrey3} 60%, ${LIMBO.darkGrey2} 85%, ${LIMBO.voidBlack} 100%)`
      }} />
      {/* Rising fog from bottom */}
      <div className="absolute inset-0 fog-rise opacity-40" style={{
        background: `linear-gradient(0deg, ${LIMBO.midGrey1}40 0%, ${LIMBO.midGrey2}20 25%, transparent 50%)`
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="xMidYMid slice">
        {/* Far background trees - very faded */}
        <g fill={LIMBO.midGrey1} opacity="0.2">
          <path d="M100,256 L100,80 Q80,70 75,50 Q95,60 100,40 Q85,30 80,10 Q100,20 100,0 L105,0 L105,256 Z" />
          <path d="M250,256 L250,100 Q230,90 225,70 Q245,80 250,60 Q235,50 230,30 Q250,40 250,20 L255,20 L255,256 Z" />
          <path d="M550,256 L550,90 Q570,80 575,60 Q555,70 550,50 Q565,40 570,20 Q550,30 550,10 L555,10 L555,256 Z" />
          <path d="M700,256 L700,110 Q720,100 725,80 Q705,90 700,70 Q715,60 720,40 Q700,50 700,30 L705,30 L705,256 Z" />
        </g>

        {/* Mid-ground trees - medium opacity */}
        <g fill={LIMBO.darkGrey1} opacity="0.5">
          <path d="M50,256 L50,120 Q30,110 25,90 Q45,100 50,80 Q35,70 30,50 Q50,60 50,40 L55,40 L55,256 Z" />
          <path d="M180,256 L180,140 Q160,130 155,110 Q175,120 180,100 Q165,90 160,70 Q180,80 180,60 L185,60 L185,256 Z" />
          <path d="M620,256 L620,130 Q640,120 645,100 Q625,110 620,90 Q635,80 640,60 Q620,70 620,50 L625,50 L625,256 Z" />
          <path d="M750,256 L750,150 Q770,140 775,120 Q755,130 750,110 Q765,100 770,80 Q750,90 750,70 L755,70 L755,256 Z" />
        </g>

        {/* Foreground trees - solid black */}
        <g fill={LIMBO.black}>
          {/* Large gnarled tree left */}
          <path d="M120,256 L120,100 Q90,90 85,60 Q110,75 115,50 Q95,40 90,20 Q115,30 120,10 Q125,30 145,15 Q140,40 125,45 Q150,60 145,80 Q125,75 120,100 Z" />
          <path d="M115,80 Q80,50 60,30" stroke={LIMBO.black} strokeWidth="6" fill="none" />
          <path d="M125,70 Q160,40 180,20" stroke={LIMBO.black} strokeWidth="5" fill="none" />

          {/* Large tree right */}
          <path d="M680,256 L680,90 Q710,80 715,50 Q690,65 685,40 Q705,30 710,10 Q685,20 680,5 Q675,20 650,10 Q660,30 675,35 Q650,50 655,70 Q675,65 680,90 Z" />
          <path d="M685,60 Q720,30 740,10" stroke={LIMBO.black} strokeWidth="6" fill="none" />
          <path d="M675,70 Q640,40 620,20" stroke={LIMBO.black} strokeWidth="5" fill="none" />
        </g>

        {/* Rope/hanging element - static for performance */}
        <g style={{ transformOrigin: '400px 0' }}>
          <path d="M400,0 Q398,60 400,100 Q402,140 398,180" stroke={LIMBO.darkGrey1} strokeWidth="2" fill="none" />
          {/* Subtle hanging figure silhouette - abstract */}
          <ellipse cx="400" cy="200" rx="8" ry="10" fill={LIMBO.darkGrey1} opacity="0.4" />
          <line x1="400" y1="210" x2="400" y2="240" stroke={LIMBO.darkGrey1} strokeWidth="2" opacity="0.4" />
        </g>

        {/* BOY SILHOUETTE - small figure with GLOWING WHITE EYES - static */}
        <g>
          {/* Head */}
          <ellipse cx="400" cy="230" rx="6" ry="7" fill={LIMBO.black} />
          {/* GLOWING WHITE EYES */}
          <ellipse cx="398" cy="229" rx="1.5" ry="1" fill={LIMBO.fogWhite3} className="boy-eye" />
          <ellipse cx="402" cy="229" rx="1.5" ry="1" fill={LIMBO.fogWhite3} className="boy-eye" />
          {/* Body */}
          <line x1="400" y1="237" x2="400" y2="248" stroke={LIMBO.black} strokeWidth="3" strokeLinecap="round" />
          {/* Arms */}
          <line x1="400" y1="240" x2="394" y2="246" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="400" y2="244" x2="406" y1="240" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
          {/* Legs */}
          <line x1="400" y1="248" x2="396" y2="256" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="400" y1="248" x2="404" y2="256" stroke={LIMBO.black} strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Ground line */}
        <line x1="0" y1="256" x2="800" y2="256" stroke={LIMBO.black} strokeWidth="4" />
      </svg>

      {/* Fog overlay - simplified */}
      <div className="absolute inset-0 opacity-15" style={{
        background: `linear-gradient(180deg, ${LIMBO.midGrey2}20 0%, transparent 50%, ${LIMBO.midGrey1}15 100%)`
      }} />

      {/* Film grain - reduced */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}
