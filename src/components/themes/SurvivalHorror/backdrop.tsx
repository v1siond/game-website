import { useEffect, useState } from 'react'
import { RE } from './palette'

// The fixed layers behind the page: wallpaper, fog, moulding, stains, shadows, vignette, lights.

// Blood splatter SVG component - sepia-toned for RE
export function BloodSplatter({ position, size = 100, rotation = 0 }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', size?: number, rotation?: number }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none z-[4] opacity-40`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`bloodGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={RE.burgundy} />
            <stop offset="50%" stopColor={RE.rust} />
            <stop offset="100%" stopColor={RE.darkSepia} />
          </linearGradient>
        </defs>
        {/* Main splatter */}
        <path
          d="M20,5 Q25,20 15,35 Q5,50 20,60 Q10,75 25,85 L30,95 Q35,80 45,90 Q55,85 60,75 Q75,80 70,60 Q85,55 75,40 Q90,30 70,20 Q80,10 60,15 Q50,5 35,15 Z"
          fill={`url(#bloodGrad-${position})`}
        />
        {/* Drips */}
        <path d="M25,85 Q27,92 25,100" stroke={RE.rust} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M45,90 Q46,96 44,100" stroke={RE.burgundy} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M15,60 Q12,70 15,80" stroke={RE.rust} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Smaller splatters */}
        <circle cx="10" cy="30" r="5" fill={RE.burgundy} opacity="0.8" />
        <circle cx="85" cy="25" r="4" fill={RE.rust} />
        <ellipse cx="75" cy="70" rx="6" ry="4" fill={RE.rust} opacity="0.7" />
      </svg>
    </div>
  )
}

// Zombie silhouette component - lurking in shadows
export function ZombieSilhouettes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Left zombie */}
      <div className="absolute -left-10 bottom-0 opacity-[0.12] animate-zombie-sway">
        <svg width="150" height="300" viewBox="0 0 150 300">
          <ellipse cx="75" cy="30" rx="25" ry="30" fill={RE.shadow} />
          <path
            d="M75,60 L75,180 M60,180 L55,280 M90,180 L95,270"
            stroke={RE.shadow}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path d="M50,100 Q20,90 10,130 Q5,150 20,160" fill="none" stroke={RE.shadow} strokeWidth="15" strokeLinecap="round" />
          <path d="M100,100 Q130,90 140,130 Q145,150 130,160" fill="none" stroke={RE.shadow} strokeWidth="15" strokeLinecap="round" />
        </svg>
      </div>
      {/* Right zombie */}
      <div className="absolute -right-10 bottom-0 opacity-[0.10] animate-zombie-sway-delayed">
        <svg width="150" height="280" viewBox="0 0 150 280" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="75" cy="28" rx="23" ry="28" fill={RE.shadow} />
          <path d="M75,56 L75,180 M60,180 L55,270 M90,180 L92,265" stroke={RE.shadow} strokeWidth="28" strokeLinecap="round" />
          <path d="M50,100 Q20,110 15,145" fill="none" stroke={RE.shadow} strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>
      {/* Background lurker - further back */}
      <div className="absolute left-1/3 bottom-0 opacity-[0.06]">
        <svg width="100" height="200" viewBox="0 0 100 200">
          <ellipse cx="50" cy="20" rx="18" ry="22" fill={RE.void} />
          <path d="M50,42 L50,150" stroke={RE.void} strokeWidth="25" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

// Cracked glass overlay
export function CrackedGlassOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9] opacity-30">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
        {/* Main crack from top right */}
        <path
          d="M950,50 L850,150 L900,200 L800,300 L850,350 L750,450 L800,500 L700,600 L750,650 L650,750"
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
        />
        {/* Branch cracks */}
        <path d="M850,150 L920,180 L880,220" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        <path d="M800,300 L730,280 L760,350" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        <path d="M750,450 L680,420 L720,380" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        <path d="M700,600 L780,580 L740,630" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        {/* Bottom left cracks */}
        <path
          d="M50,900 L150,850 L100,780 L200,720 L150,650 L250,580"
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
          opacity="0.35"
        />
        <path d="M150,850 L80,810 L130,770" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.25" />
        <path d="M200,720 L270,750 L230,690" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.25" />
        {/* Spider web crack center */}
        <circle cx="300" cy="200" r="2" fill="#ffffff" opacity="0.5" />
        <path d="M300,200 L280,150 M300,200 L350,180 M300,200 L320,250 M300,200 L250,220 M300,200 L290,270" stroke="#ffffff" strokeWidth="0.4" fill="none" opacity="0.35" />
      </svg>
    </div>
  )
}

// Creeping shadows at screen edges
export function CreepingShadows() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      {/* Left shadow tendrils */}
      <div className="absolute left-0 top-0 h-full w-32 animate-shadow-creep-left">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
          <defs>
            <linearGradient id="shadowGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q30,100 20,200 Q40,300 15,400 Q35,500 10,600 Q30,700 25,800 Q45,900 20,1000 L0,1000 Z"
            fill="url(#shadowGradLeft)"
          />
        </svg>
      </div>
      {/* Right shadow tendrils */}
      <div className="absolute right-0 top-0 h-full w-32 animate-shadow-creep-right">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
          <defs>
            <linearGradient id="shadowGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M100,0 Q70,100 80,200 Q60,300 85,400 Q65,500 90,600 Q70,700 75,800 Q55,900 80,1000 L100,1000 Z"
            fill="url(#shadowGradRight)"
          />
        </svg>
      </div>
    </div>
  )
}

// Sepia vignette with subtle pulse
export function SepiaVignette() {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 200)
      setTimeout(() => {
        setPulse(true)
        setTimeout(() => setPulse(false), 200)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[6] transition-opacity duration-300"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, transparent 20%, ${RE.darkSepia}90 70%, ${RE.void} 100%)`,
        opacity: pulse ? 0.95 : 0.85,
      }}
    />
  )
}

// Dripping blood effect - slow animated drip
export function BloodDrip({ side, delay = 0 }: { side: 'left' | 'right', delay?: number }) {
  return (
    <div
      className={`fixed top-0 ${side === 'left' ? 'left-8' : 'right-12'} pointer-events-none z-[8]`}
      style={{ animationDelay: `${delay}s` }}
    >
      <svg width="12" height="120" viewBox="0 0 12 120" className="animate-blood-drip">
        {/* Blood pool at top */}
        <ellipse cx="6" cy="5" rx="6" ry="5" fill={RE.blood} opacity="0.7" />
        {/* Drip stream */}
        <path
          d="M6,10 Q4,30 6,50 Q8,70 5,90 Q6,105 6,115"
          stroke={RE.blood}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Drip drop at end */}
        <ellipse cx="6" cy="118" rx="4" ry="3" fill={RE.bloodDark} opacity="0.5" />
      </svg>
    </div>
  )
}

// Biohazard symbol - Umbrella Corp style
export function BiohazardSymbol({ className = '' }: { className?: string }) {
  return (
    <div className={`opacity-15 pointer-events-none ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="none" stroke={RE.rust} strokeWidth="2" />
        {/* Biohazard trefoil */}
        <g fill={RE.rust}>
          <circle cx="40" cy="25" r="8" />
          <circle cx="27" cy="48" r="8" />
          <circle cx="53" cy="48" r="8" />
          {/* Connecting arcs */}
          <path d="M40,33 Q33,40 30,48" strokeWidth="4" fill="none" stroke={RE.rust} />
          <path d="M40,33 Q47,40 50,48" strokeWidth="4" fill="none" stroke={RE.rust} />
          <path d="M30,48 Q40,55 50,48" strokeWidth="4" fill="none" stroke={RE.rust} />
        </g>
        {/* Center ring */}
        <circle cx="40" cy="40" r="6" fill="none" stroke={RE.rust} strokeWidth="2" />
      </svg>
    </div>
  )
}

// Caution/Danger tape - diagonal stripes
export function DangerTape({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div
      className={`fixed ${position === 'top' ? 'top-24' : 'bottom-20'} left-0 right-0 h-6 pointer-events-none z-[8] opacity-30 overflow-hidden`}
      style={{ transform: `rotate(${position === 'top' ? '-2deg' : '1deg'})` }}
    >
      <div
        className="w-[200%] h-full"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            ${RE.candlelight},
            ${RE.candlelight} 20px,
            ${RE.void} 20px,
            ${RE.void} 40px
          )`,
        }}
      />
    </div>
  )
}

// Warning sign - Umbrella style
export function WarningSign() {
  return (
    <div className="fixed bottom-32 left-4 opacity-40 pointer-events-none z-[11]">
      <svg width="60" height="70" viewBox="0 0 60 70">
        {/* Sign post */}
        <rect x="28" y="35" width="4" height="35" fill={RE.midBrown} />
        {/* Sign board */}
        <rect x="5" y="5" width="50" height="30" rx="2" fill={RE.candlelight} />
        <rect x="7" y="7" width="46" height="26" rx="1" fill={RE.void} />
        {/* Skull icon */}
        <circle cx="30" cy="15" r="6" fill={RE.cream} />
        <rect x="26" cy="21" width="8" height="8" fill={RE.cream} />
        {/* Crossbones */}
        <path d="M20,28 L40,18 M20,18 L40,28" stroke={RE.cream} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// Warm isolated light source - like fireplace or oil lamp in RE
export function WarmLightSource() {
  const [flicker, setFlicker] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(0.85 + Math.random() * 0.3)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3]">
      {/* Main warm glow - upper area like RE rooms */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '40%',
          background: `radial-gradient(ellipse at 50% 30%, ${RE.candlelight}${Math.round(flicker * 25).toString(16).padStart(2, '0')} 0%, ${RE.warmGlow}15 30%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      {/* Secondary glow spots - like scattered candles */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '20%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${RE.warmGlow}${Math.round(flicker * 20).toString(16).padStart(2, '0')}, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${RE.candlelight}${Math.round(flicker * 15).toString(16).padStart(2, '0')}, transparent 70%)`,
          filter: 'blur(25px)',
        }}
      />
    </div>
  )
}

// Oil lamp wall sconce - Victorian style
export function WallSconce({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`fixed top-1/4 ${side === 'left' ? 'left-4' : 'right-4'} opacity-50 z-[11]`}
    >
      <svg width="36" height="70" viewBox="0 0 36 70">
        {/* Wall mount bracket */}
        <path d="M18,0 L18,15 Q10,20 12,30" stroke={RE.midBrown} strokeWidth="4" fill="none" />
        {/* Lamp body */}
        <ellipse cx="12" cy="35" rx="8" ry="5" fill={RE.sepia} />
        <rect x="6" y="35" width="12" height="15" fill={RE.midBrown} />
        <ellipse cx="12" cy="50" rx="8" ry="4" fill={RE.darkSepia} />
        {/* Glass chimney */}
        <path d="M8,30 Q6,20 10,15 L14,15 Q18,20 16,30" fill={RE.cream} opacity="0.3" />
        {/* Flame */}
        <ellipse cx="12" cy="22" rx="3" ry="6" fill={RE.candlelight} opacity="0.9" />
        <ellipse cx="12" cy="20" rx="1.5" ry="4" fill={RE.ivory} opacity="0.8" />
      </svg>
      {/* Warm glow */}
      <div
        className="absolute top-2 left-0 w-12 h-16"
        style={{
          background: `radial-gradient(circle, ${RE.candlelight}50, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

// Victorian damask wallpaper pattern - subtle repeating SVG
export function VictorianWallpaper() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.08]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q40 15 30 25 Q20 15 30 5 M30 35 Q40 45 30 55 Q20 45 30 35 M5 30 Q15 20 25 30 Q15 40 5 30 M35 30 Q45 20 55 30 Q45 40 35 30' stroke='%23${RE.midBrown.slice(1)}' stroke-width='1' fill='none' opacity='0.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23${RE.midBrown.slice(1)}' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

// Fog/mist layers - drifting across screen
export function FogAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Top fog layer */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(180deg, ${RE.fog}30 0%, transparent 100%)`,
        }}
      />
      {/* Bottom fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/4"
        style={{
          background: `linear-gradient(0deg, ${RE.mistDark}40 0%, transparent 100%)`,
        }}
      />
      {/* Drifting fog patches */}
      <div
        className="absolute top-1/4 left-0 w-full h-32 opacity-20 animate-fog-drift"
        style={{
          background: `linear-gradient(90deg, transparent, ${RE.fog}60, transparent)`,
          filter: 'blur(30px)',
        }}
      />
      <div
        className="absolute top-1/2 left-0 w-full h-24 opacity-15 animate-fog-drift-slow"
        style={{
          background: `linear-gradient(90deg, transparent, ${RE.fog}40, transparent)`,
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

// Mansion door frame - ornate Victorian style
export function MansionDoorFrame() {
  return (
    <div className="fixed inset-x-0 top-0 h-6 pointer-events-none z-[2] opacity-40">
      <svg viewBox="0 0 1000 24" className="w-full h-full" preserveAspectRatio="none">
        {/* Crown molding */}
        <rect x="0" y="0" width="1000" height="10" fill={RE.darkSepia} />
        <rect x="0" y="10" width="1000" height="6" fill={RE.sepia} />
        {/* Decorative dentil molding */}
        {Array.from({ length: 50 }, (_, i) => (
          <rect key={i} x={i * 20 + 5} y="16" width="8" height="6" fill={RE.midBrown} />
        ))}
      </svg>
    </div>
  )
}
