import { useEffect, useState, useMemo, memo } from 'react'
import { GOW } from './palette'

// The fixed layers behind the page: the parallax ornaments per profession, the storm with its
// lightning, the ash and embers, the volcano, the light rays, the banner and the splash accent.

// =============================================================================
// PARALLAX LAYERS - Profession-specific background ornaments
// 3 layers: Far (0.15x), Mid (0.35x), Near (0.6x) scroll speed
// =============================================================================
export const ParallaxLayers = memo(function ParallaxLayers({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Profession-specific ornament sets
  const ornaments = {
    engineer: {
      far: [
        { x: 5, y: 20, element: <GearSVG size={40} />, },
        { x: 92, y: 35, element: <GearSVG size={35} />, },
        { x: 8, y: 60, element: <CircuitSVG size={50} />, },
        { x: 88, y: 75, element: <GearSVG size={45} />, },
      ],
      mid: [
        { x: 3, y: 40, element: <GearSVG size={55} />, },
        { x: 95, y: 55, element: <CircuitSVG size={60} />, },
        { x: 6, y: 85, element: <GearSVG size={50} />, },
      ],
      near: [
        { x: 2, y: 30, element: <GearSVG size={70} />, },
        { x: 96, y: 65, element: <CircuitSVG size={80} />, },
      ],
    },
    drummer: {
      far: [
        { x: 5, y: 25, element: <DrumSVG size={40} />, },
        { x: 90, y: 40, element: <WaveSVG size={50} />, },
        { x: 8, y: 65, element: <DrumSVG size={35} />, },
        { x: 88, y: 80, element: <WaveSVG size={45} />, },
      ],
      mid: [
        { x: 4, y: 45, element: <WaveSVG size={60} />, },
        { x: 94, y: 60, element: <DrumSVG size={55} />, },
        { x: 6, y: 90, element: <WaveSVG size={50} />, },
      ],
      near: [
        { x: 2, y: 35, element: <DrumSVG size={75} />, },
        { x: 95, y: 70, element: <WaveSVG size={80} />, },
      ],
    },
    fighter: {
      far: [
        { x: 6, y: 20, element: <SwordSVG size={45} />, },
        { x: 91, y: 35, element: <ShieldSVG size={40} />, },
        { x: 7, y: 60, element: <SwordSVG size={35} />, },
        { x: 89, y: 80, element: <ShieldSVG size={50} />, },
      ],
      mid: [
        { x: 4, y: 40, element: <ShieldSVG size={55} />, },
        { x: 94, y: 55, element: <SwordSVG size={60} />, },
        { x: 5, y: 85, element: <ShieldSVG size={50} />, },
      ],
      near: [
        { x: 2, y: 30, element: <SwordSVG size={70} />, },
        { x: 96, y: 65, element: <ShieldSVG size={80} />, },
      ],
    },
  }

  const layers = ornaments[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {/* Far layer - 0.15x speed */}
      {layers.far.map((item, i) => (
        <div
          key={`far-${i}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 0.35,
          }}
        >
          {item.element}
        </div>
      ))}

      {/* Mid layer - 0.35x speed */}
      {layers.mid.map((item, i) => (
        <div
          key={`mid-${i}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translateY(${scrollY * 0.35}px)`,
            opacity: 0.45,
          }}
        >
          {item.element}
        </div>
      ))}

      {/* Near layer - 0.6x speed, most visible */}
      {layers.near.map((item, i) => (
        <div
          key={`near-${i}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translateY(${scrollY * 0.6}px)`,
            opacity: 0.55,
          }}
        >
          {item.element}
        </div>
      ))}
    </div>
  )
})

// Ornament SVGs for parallax layers
const GearSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill={GOW.gold} opacity="0.6">
    <path d="M20,8 L22,4 L18,4 Z M20,32 L22,36 L18,36 Z M8,20 L4,22 L4,18 Z M32,20 L36,22 L36,18 Z" />
    <circle cx="20" cy="20" r="8" fill="none" stroke={GOW.gold} strokeWidth="2" />
    <circle cx="20" cy="20" r="4" fill={GOW.gold} />
  </svg>
)

const CircuitSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" stroke={GOW.gold} strokeWidth="1.5" opacity="0.5">
    <path d="M10,25 L20,25 L25,15 L30,35 L35,25 L45,25" />
    <circle cx="10" cy="25" r="3" fill={GOW.gold} />
    <circle cx="45" cy="25" r="3" fill={GOW.gold} />
  </svg>
)

const DrumSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill={GOW.fire} opacity="0.6">
    <ellipse cx="20" cy="30" rx="15" ry="6" fill="none" stroke={GOW.fire} strokeWidth="2" />
    <path d="M5,15 L5,30 M35,15 L35,30" stroke={GOW.fire} strokeWidth="2" />
    <ellipse cx="20" cy="15" rx="15" ry="6" fill={GOW.fire} opacity="0.3" />
    <line x1="10" y1="8" x2="20" y2="15" stroke={GOW.fireGlow} strokeWidth="2" />
    <line x1="30" y1="8" x2="20" y2="15" stroke={GOW.fireGlow} strokeWidth="2" />
  </svg>
)

const WaveSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 50 30" fill="none" stroke={GOW.fire} strokeWidth="2" opacity="0.5">
    <path d="M5,15 Q12,5 20,15 Q28,25 35,15 Q42,5 50,15" />
    <path d="M5,20 Q12,10 20,20 Q28,30 35,20 Q42,10 50,20" opacity="0.5" />
  </svg>
)

const SwordSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 50" fill={GOW.blood} opacity="0.6">
    <path d="M10,0 L12,35 L10,38 L8,35 Z" fill={GOW.ashLight} />
    <rect x="6" y="35" width="8" height="4" fill={GOW.gold} />
    <rect x="8" y="39" width="4" height="8" fill={GOW.goldDark} />
  </svg>
)

const ShieldSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 50" fill={GOW.blood} opacity="0.5">
    <path d="M20,5 L35,12 L35,30 L20,45 L5,30 L5,12 Z" fill={GOW.ashDark} stroke={GOW.gold} strokeWidth="2" />
    <path d="M20,12 L28,16 L28,28 L20,38 L12,28 L12,16 Z" fill={GOW.blood} opacity="0.5" />
  </svg>
)

// =============================================================================
// GOW3 BLOOD BANNER - The iconic dripping blood frame from GOW3 menu
// =============================================================================
export const BloodBanner = memo(function BloodBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 h-24 z-[45] pointer-events-none" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 1920 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bloodBannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={GOW.bloodBright} stopOpacity="0.9" />
            <stop offset="40%" stopColor={GOW.blood} stopOpacity="0.8" />
            <stop offset="100%" stopColor={GOW.bloodDark} stopOpacity="0.3" />
          </linearGradient>
          <filter id="bloodDrip">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </defs>
        {/* Main blood splash shape - jagged, dripping */}
        <path
          d="M0,0 L0,35
             Q50,40 80,55 Q100,70 120,45 Q150,60 180,50
             Q220,75 260,40 Q300,55 340,35 Q380,60 420,45
             Q480,70 540,35 Q600,50 660,40 Q720,65 780,35
             Q840,55 900,45 Q960,70 1020,40 Q1080,55 1140,35
             Q1200,60 1260,45 Q1320,70 1380,40 Q1440,55 1500,35
             Q1560,65 1620,45 Q1680,60 1740,40 Q1800,55 1860,50
             Q1890,65 1920,40 L1920,0 Z"
          fill="url(#bloodBannerGrad)"
        />
        {/* Blood drips */}
        {[120, 340, 560, 780, 1000, 1220, 1440, 1660, 1800].map((x, i) => (
          <path
            key={i}
            d={`M${x},${45 + (i % 3) * 10} Q${x - 3},${60 + (i % 4) * 15} ${x},${75 + (i % 3) * 20} Q${x + 3},${60 + (i % 4) * 15} ${x},${45 + (i % 3) * 10}`}
            fill={GOW.blood}
            opacity={0.6 + (i % 3) * 0.1}
          />
        ))}
      </svg>
    </div>
  )
})

// =============================================================================
// STORMY CLOUDS WITH LIGHTNING - Parallax background
// =============================================================================
export const StormyClouds = memo(function StormyClouds() {
  const [lightning, setLightning] = useState(false)
  const [lightningPos, setLightningPos] = useState({ x: 50, y: 30 })

  useEffect(() => {
    const flashLightning = () => {
      setLightningPos({ x: 20 + Math.random() * 60, y: 10 + Math.random() * 30 })
      setLightning(true)
      setTimeout(() => setLightning(false), 150)
      setTimeout(() => {
        setLightning(true)
        setTimeout(() => setLightning(false), 100)
      }, 200)
    }

    const interval = setInterval(flashLightning, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Cloud layers */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, ${GOW.stormGrey}40 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 70% 15%, ${GOW.stormBrown}50 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 30%, ${GOW.stormGrey}30 0%, transparent 50%),
            radial-gradient(ellipse 90% 50% at 85% 25%, ${GOW.stormBrown}40 0%, transparent 55%)
          `,
        }}
      />

      {/* Lightning flash */}
      {lightning && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${lightningPos.x}% ${lightningPos.y}%, ${GOW.lightning}30 0%, transparent 40%)`,
            }}
          />
          <svg
            className="absolute w-32 h-64"
            style={{ left: `${lightningPos.x}%`, top: `${lightningPos.y - 5}%` }}
            viewBox="0 0 100 200"
          >
            <path
              d="M50,0 L45,50 L60,45 L40,120 L55,115 L30,200"
              fill="none"
              stroke={GOW.lightning}
              strokeWidth="3"
              opacity="0.8"
            />
            <path
              d="M50,0 L45,50 L60,45 L40,120 L55,115 L30,200"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.9"
            />
          </svg>
        </>
      )}

      {/* Distant mountains silhouette */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-48 opacity-30"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,150 L200,80 L400,120 L600,60 L800,100 L1000,40 L1200,90 L1400,50 L1600,110 L1800,70 L1920,130 L1920,200 Z"
          fill={GOW.ashDark}
        />
      </svg>
    </div>
  )
})

// =============================================================================
// BLOOD SPLASH DECORATION (smaller accents)
// =============================================================================
export const BloodSplash = memo(function BloodSplash({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`absolute top-24 ${side === 'left' ? 'left-0' : 'right-0'} w-32 h-24 opacity-30`}
      viewBox="0 0 200 120"
      aria-hidden="true"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id={`bloodGrad-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOW.bloodBright} stopOpacity="0.8" />
          <stop offset="50%" stopColor={GOW.blood} stopOpacity="0.6" />
          <stop offset="100%" stopColor={GOW.bloodDark} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Dripping blood effect */}
      <path
        d="M0,0 L80,0 Q90,20 70,40 Q60,60 75,80 L60,120 Q40,100 50,70 Q55,40 30,30 L0,40 Z"
        fill={`url(#bloodGrad-${side})`}
      />
      <path
        d="M40,0 L60,0 Q50,30 55,50 L45,80 Q35,60 40,40 Q45,20 40,0 Z"
        fill={GOW.blood}
        opacity="0.5"
      />
    </svg>
  )
})

// =============================================================================
// FLOATING ASH PARTICLES - GOW3 volcanic atmosphere (replaces rain)
// =============================================================================
export const FloatingAsh = memo(function FloatingAsh() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 20 + 15,
      delay: Math.random() * -15,
      drift: (Math.random() - 0.5) * 40,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: GOW.ashLight,
            opacity: p.opacity,
            animation: `ashFloat ${p.speed}s ease-out infinite`,
            animationDelay: `${p.delay}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
})

// =============================================================================
// VOLCANO WITH LAVA - Bottom left corner, phased animation
// Pattern 2: Multi-Phase Reveal Sequences (from animation-patterns memory)
// Phases: idle → eruption → flowing → complete
// =============================================================================
export const Volcano = memo(function Volcano() {
  const [phase, setPhase] = useState<'idle' | 'trembling' | 'eruption' | 'flowing' | 'complete'>('idle')

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('trembling'), 1500),  // Start trembling after 1.5s
      setTimeout(() => setPhase('eruption'), 2500),   // Explosion at 2.5s
      setTimeout(() => setPhase('flowing'), 3000),    // Lava starts flowing at 3s
      setTimeout(() => setPhase('complete'), 7000),   // Animation complete at 7s
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const lavaPathLength = 400

  return (
    <div
      className="fixed bottom-0 left-0 pointer-events-none z-[1]"
      style={{
        width: 'clamp(300px, 40vw, 500px)',
        height: 'clamp(350px, 50vh, 550px)',
        animation: phase === 'trembling'
          ? 'volcanoTremble 0.08s ease-in-out infinite'
          : phase === 'eruption'
            ? 'volcanoErupt 0.05s ease-in-out infinite'
            : 'none',
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes volcanoTremble {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          75% { transform: translate(2px, -1px); }
        }
        @keyframes volcanoErupt {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, 0); }
          75% { transform: translate(-1px, -1px); }
        }
        @keyframes lavaRock1 {
          0% { transform: translate(0, 0); opacity: 1; }
          40% { transform: translate(-30px, -90px); opacity: 1; }
          100% { transform: translate(-50px, 40px); opacity: 0; }
        }
        @keyframes lavaRock2 {
          0% { transform: translate(0, 0); opacity: 1; }
          45% { transform: translate(10px, -110px); opacity: 1; }
          100% { transform: translate(15px, 30px); opacity: 0; }
        }
        @keyframes lavaRock3 {
          0% { transform: translate(0, 0); opacity: 1; }
          40% { transform: translate(35px, -80px); opacity: 1; }
          100% { transform: translate(55px, 50px); opacity: 0; }
        }
        @keyframes lavaRock4 {
          0% { transform: translate(0, 0); opacity: 1; }
          50% { transform: translate(-15px, -120px); opacity: 1; }
          100% { transform: translate(-25px, 20px); opacity: 0; }
        }
        @keyframes lavaRock5 {
          0% { transform: translate(0, 0); opacity: 1; }
          45% { transform: translate(25px, -100px); opacity: 1; }
          100% { transform: translate(40px, 35px); opacity: 0; }
        }
        @keyframes eruptionBurst {
          0% { transform: scaleY(0.3); opacity: 0.9; }
          30% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0.5); opacity: 0; }
        }
      `}</style>
      <svg
        className="w-full h-full"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMinYMax slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Turbulence filter for organic lava movement - SLOW for viscous lava */}
          <filter id="lavaTurbulence" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.012 0.03"
              numOctaves="2"
              seed="5"
              result="turbulence"
            >
              <animate
                attributeName="seed"
                values="5;12;5"
                dur="18s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Glow filter for lava */}
          <filter id="lavaGlow2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1.5 0 0 0 0  0 0.5 0 0 0  0 0 0.2 0 0  0 0 0 1 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Volcano silhouette gradient - visible against lit background */}
          <linearGradient id="volcanoFade" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1a1512" stopOpacity="1" />
            <stop offset="50%" stopColor="#0f0c0a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0a0806" stopOpacity="0.9" />
          </linearGradient>

          {/* Lava gradient - bright core to dark edges */}
          <linearGradient id="lavaCore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffcc00" stopOpacity="1" />
            <stop offset="20%" stopColor={GOW.fireBright} stopOpacity="0.95" />
            <stop offset="50%" stopColor={GOW.fire} stopOpacity="0.85" />
            <stop offset="80%" stopColor="#aa2200" stopOpacity="0.7" />
            <stop offset="100%" stopColor={GOW.bloodDark} stopOpacity="0.5" />
          </linearGradient>

          {/* Radial glow for crater */}
          <radialGradient id="craterGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffdd44" stopOpacity="0.9" />
            <stop offset="30%" stopColor={GOW.fireBright} stopOpacity="0.6" />
            <stop offset="60%" stopColor={GOW.fire} stopOpacity="0.3" />
            <stop offset="100%" stopColor={GOW.fire} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Volcano silhouette - flat caldera from ea9c5fc */}
        <path
          d="M-80,500
             L30,320 L50,340 L80,280 L100,300
             L130,200 L150,180
             L160,140 L240,140
             L250,180 L270,200
             L300,300 L320,280 L400,450
             L420,500 Z"
          fill="url(#volcanoFade)"
        />

        {/* Lava flows - hidden until flowing phase, then grow top to bottom */}
        <g
          filter="url(#lavaTurbulence)"
          style={{
            opacity: phase === 'flowing' || phase === 'complete' ? 0.85 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          {/* Center flow */}
          <path
            d="M200,160 Q205,240 200,340 Q195,440 200,520"
            fill="none"
            stroke="url(#lavaCore)"
            strokeWidth="20"
            strokeLinecap="round"
            pathLength={lavaPathLength}
            style={{
              strokeDasharray: lavaPathLength,
              strokeDashoffset: (phase === 'flowing' || phase === 'complete') ? 0 : lavaPathLength,
              transition: 'stroke-dashoffset 4s ease-out',
            }}
          />

          {/* Left flow */}
          <path
            d="M160,150 Q130,250 100,370 Q80,460 60,520"
            fill="none"
            stroke="url(#lavaCore)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
            pathLength={lavaPathLength}
            style={{
              strokeDasharray: lavaPathLength,
              strokeDashoffset: (phase === 'flowing' || phase === 'complete') ? 0 : lavaPathLength,
              transition: 'stroke-dashoffset 4s ease-out 0.3s',
            }}
          />

          {/* Right flow */}
          <path
            d="M235,150 Q275,270 305,410 Q325,480 345,520"
            fill="none"
            stroke="url(#lavaCore)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.7"
            pathLength={lavaPathLength}
            style={{
              strokeDasharray: lavaPathLength,
              strokeDashoffset: (phase === 'flowing' || phase === 'complete') ? 0 : lavaPathLength,
              transition: 'stroke-dashoffset 4s ease-out 0.5s',
            }}
          />
        </g>

        {/* Eruption effects */}
        <g>
          {/* Vertical burst of light from crater */}
          <ellipse
            cx="200"
            cy="100"
            rx="25"
            ry="50"
            fill={GOW.fireBright}
            style={{
              mixBlendMode: 'screen',
              transformOrigin: '200px 140px',
              opacity: phase === 'eruption' ? 1 : 0,
              animation: phase === 'eruption' ? 'eruptionBurst 0.5s ease-out forwards' : 'none',
            }}
          />

          {/* Bright flash at crater */}
          <ellipse
            cx="200"
            cy="130"
            rx="45"
            ry="25"
            fill={GOW.fireBright}
            style={{
              mixBlendMode: 'screen',
              opacity: phase === 'eruption' ? 0.9 : phase === 'flowing' ? 0.15 : 0,
              transition: 'opacity 0.3s ease-out',
            }}
          />

          {/* Lava rocks - shoot up then fall with gravity */}
          {phase === 'eruption' && (
            <>
              <circle cx="195" cy="130" r="6" fill="#ff6600" style={{ animation: 'lavaRock1 0.8s ease-out forwards' }} />
              <circle cx="200" cy="130" r="8" fill="#ff8800" style={{ animation: 'lavaRock2 0.9s ease-out forwards' }} />
              <circle cx="205" cy="130" r="5" fill="#ff5500" style={{ animation: 'lavaRock3 0.75s ease-out forwards' }} />
              <circle cx="192" cy="130" r="4" fill="#ffaa00" style={{ animation: 'lavaRock4 0.95s ease-out forwards' }} />
              <circle cx="208" cy="130" r="5" fill="#ff7700" style={{ animation: 'lavaRock5 0.85s ease-out forwards' }} />
            </>
          )}
        </g>

        {/* Crater glow - renders on top of lava, pulses bigger during eruption */}
        <ellipse
          cx="200"
          cy="140"
          rx="38"
          ry="14"
          fill="url(#craterGlow)"
          filter="url(#lavaGlow2)"
          style={{
            transform: phase === 'eruption' ? 'scale(1.5)' : 'scale(1)',
            transformOrigin: '200px 140px',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <animate attributeName="opacity" values="0.7;0.95;0.7" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  )
})

// =============================================================================
// DIVINE LIGHT RAYS - Olympus god rays from above
// =============================================================================
export const DivineLightRays = memo(function DivineLightRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      <svg className="w-full h-full opacity-20" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <linearGradient id="divineRay" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={GOW.goldBright} stopOpacity="0.4" />
            <stop offset="30%" stopColor={GOW.gold} stopOpacity="0.2" />
            <stop offset="100%" stopColor={GOW.gold} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Angled light rays from top */}
        <polygon points="400,0 500,0 700,1080 550,1080" fill="url(#divineRay)" opacity="0.3" />
        <polygon points="900,0 980,0 1100,1080 980,1080" fill="url(#divineRay)" opacity="0.4" />
        <polygon points="1400,0 1520,0 1350,1080 1200,1080" fill="url(#divineRay)" opacity="0.3" />
      </svg>
    </div>
  )
})

// =============================================================================
// EMBER PARTICLES (from Blades of Chaos)
// =============================================================================
export const EmberParticles = memo(function EmberParticles() {
  const embers = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 80 + Math.random() * 20,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 15 + 10,
      delay: Math.random() * -10,
      color: i % 2 === 0 ? GOW.fire : GOW.fireBright,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
    >
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.x}%`,
            bottom: `${100 - e.y}%`,
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, ${e.color} 30%, ${e.color}60 60%, transparent 80%)`,
            animation: `emberRise ${e.speed}s ease-out infinite`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  )
})
