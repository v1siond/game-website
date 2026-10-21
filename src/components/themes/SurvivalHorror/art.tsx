import { useEffect, useState } from 'react'
import { RE } from './palette'

// The world's save room props and the art breaks between its sections.

// Classic typewriter save point - iconic RE element
export function TypewriterSavePoint() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-70">
      {/* Desk/table surface */}
      <rect x="10" y="55" width="100" height="8" rx="2" fill={RE.sepia} />
      <rect x="5" y="63" width="110" height="4" fill={RE.midBrown} />
      {/* Typewriter body */}
      <rect x="25" y="25" width="70" height="30" rx="3" fill={RE.darkSepia} />
      <rect x="28" y="28" width="64" height="24" rx="2" fill={RE.shadow} />
      {/* Paper */}
      <rect x="35" y="15" width="50" height="18" fill={RE.ivory} />
      <rect x="38" y="18" width="44" height="1" fill={RE.sepia} opacity="0.4" />
      <rect x="38" y="22" width="40" height="1" fill={RE.sepia} opacity="0.4" />
      <rect x="38" y="26" width="35" height="1" fill={RE.sepia} opacity="0.4" />
      {/* Platen/roller */}
      <rect x="30" y="12" width="60" height="5" rx="2" fill={RE.midBrown} />
      {/* Keys suggestion */}
      <rect x="32" y="42" width="56" height="8" rx="1" fill={RE.void} />
      {/* Carriage return lever */}
      <path d="M90,20 L100,15 L102,18 L92,23" fill={RE.midBrown} />
    </svg>
  )
}

// Ink ribbon decoration - classic RE save item
export function InkRibbon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="40" height="24" viewBox="0 0 40 24">
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={RE.darkSepia} />
            <stop offset="50%" stopColor={RE.shadow} />
            <stop offset="100%" stopColor={RE.void} />
          </linearGradient>
        </defs>
        {/* Ribbon cartridge */}
        <rect x="5" y="4" width="30" height="16" rx="2" fill="url(#ribbonGrad)" />
        {/* Spool holes */}
        <circle cx="12" cy="12" r="4" fill={RE.void} />
        <circle cx="28" cy="12" r="4" fill={RE.void} />
        {/* Ribbon visible through center */}
        <rect x="16" y="10" width="8" height="4" fill={RE.shadow} />
        {/* Metallic rim */}
        <circle cx="12" cy="12" r="2.5" fill="none" stroke={RE.warmGlow} strokeWidth="0.5" opacity="0.5" />
        <circle cx="28" cy="12" r="2.5" fill="none" stroke={RE.warmGlow} strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  )
}

// Herb icon decoration
export function HerbIcon({ color = 'green', className = '' }: { color?: 'green' | 'red' | 'blue', className?: string }) {
  const colors = {
    green: { leaf: '#2d5a27', highlight: '#4a8a42' },
    red: { leaf: '#8b2020', highlight: '#c44040' },
    blue: { leaf: '#1a4a7a', highlight: '#3070a0' },
  }

  return (
    <div className={`relative ${className}`}>
      <svg width="28" height="36" viewBox="0 0 28 36">
        {/* Pot */}
        <path d="M8,30 L8,26 Q8,24 10,24 L18,24 Q20,24 20,26 L20,30 Q20,34 14,34 Q8,34 8,30 Z" fill="#6b4423" />
        <rect x="6" y="22" width="16" height="3" rx="1" fill="#8b5a2b" />
        {/* Leaves */}
        <path d="M14,22 Q8,18 6,10 Q8,8 14,12 Q14,8 14,4 Q14,8 14,12 Q20,8 22,10 Q20,18 14,22 Z" fill={colors[color].leaf} />
        <path d="M14,20 Q10,16 9,11 Q11,10 14,13" fill={colors[color].highlight} opacity="0.6" />
        <path d="M14,20 Q18,16 19,11 Q17,10 14,13" fill={colors[color].highlight} opacity="0.4" />
        {/* Center vein */}
        <path d="M14,20 L14,6" stroke={colors[color].highlight} strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  )
}

// Art Section Divider - Zombie Silhouette Scene
export function ArtSectionZombies() {
  return (
    <div className="relative py-12 my-8 overflow-hidden" style={{ borderTop: `1px solid ${RE.midBrown}40`, borderBottom: `1px solid ${RE.midBrown}40` }}>
      {/* Blood drip decorations along top */}
      <div className="absolute top-0 left-0 right-0 flex justify-around">
        {[20, 35, 55, 70, 85].map((pos, i) => (
          <svg key={i} width="8" height="40" viewBox="0 0 8 40" style={{ marginLeft: `${pos}%`, opacity: 0.4 + (i * 0.1) }}>
            <path d={`M4,0 Q2,${10 + i * 3} 4,${20 + i * 5} Q6,${30 + i * 3} 4,40`} stroke={RE.blood} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="4" cy="38" rx="3" ry="2" fill={RE.bloodDark} />
          </svg>
        ))}
      </div>

      {/* Zombie silhouettes walking across */}
      <div className="flex justify-center items-end gap-16 opacity-40">
        {/* Left zombie - arms reaching */}
        <svg width="80" height="120" viewBox="0 0 80 120">
          <ellipse cx="40" cy="15" rx="12" ry="15" fill={RE.shadow} />
          <path d="M32,28 L28,80 L36,80 L38,50 L42,50 L44,80 L52,80 L48,28 Z" fill={RE.shadow} />
          <path d="M32,35 Q10,40 5,55" stroke={RE.shadow} strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M34,45 Q15,50 10,60" stroke={RE.shadow} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M34,80 L28,110" stroke={RE.shadow} strokeWidth="10" strokeLinecap="round" />
          <path d="M46,80 L55,105" stroke={RE.shadow} strokeWidth="10" strokeLinecap="round" />
        </svg>

        {/* Center typewriter */}
        <div className="relative">
          <TypewriterSavePoint />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm tracking-widest" style={{ color: RE.warmGlow }}>
            * * *
          </div>
        </div>

        {/* Right zombie - shambling */}
        <svg width="80" height="120" viewBox="0 0 80 120" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="40" cy="18" rx="13" ry="16" fill={RE.shadow} />
          <path d="M30,32 L25,85 L35,85 L38,55 L42,55 L45,85 L55,85 L50,32 Z" fill={RE.shadow} />
          <path d="M30,40 Q5,45 0,70" stroke={RE.shadow} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M32,82 L22,115" stroke={RE.shadow} strokeWidth="11" strokeLinecap="round" />
          <path d="M48,82 L58,110" stroke={RE.shadow} strokeWidth="11" strokeLinecap="round" />
        </svg>
      </div>

      {/* Scattered herbs */}
      <div className="absolute bottom-2 left-8 opacity-50">
        <HerbIcon color="green" />
      </div>
      <div className="absolute bottom-4 right-12 opacity-40">
        <HerbIcon color="red" />
      </div>
      <div className="absolute bottom-2 left-1/4 opacity-35">
        <HerbIcon color="blue" />
      </div>
    </div>
  )
}

// Art Section Divider - Blood Splatter and Typewriter
export function ArtSectionTypewriter() {
  return (
    <div className="relative py-10 my-8" style={{ borderTop: `1px solid ${RE.midBrown}40`, borderBottom: `1px solid ${RE.midBrown}40` }}>
      {/* Blood splatter background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 100">
          <defs>
            <linearGradient id="artBloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={RE.burgundy} />
              <stop offset="100%" stopColor={RE.bloodDark} />
            </linearGradient>
          </defs>
          {/* Large splatter left */}
          <path d="M30,20 Q40,35 25,50 Q15,65 35,75 L45,85 Q55,70 65,80 Q80,75 75,55 Q95,50 80,35 Q90,20 70,25 Q60,10 45,20 Z" fill="url(#artBloodGrad)" />
          {/* Drips */}
          <path d="M35,75 Q33,85 36,95" stroke={RE.blood} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M55,80 Q54,88 56,95" stroke={RE.bloodDark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Right splatter */}
          <path d="M320,15 Q335,25 325,45 Q340,55 330,70 L340,80 Q360,75 355,50 Q375,45 360,30 Q365,15 345,20 Z" fill="url(#artBloodGrad)" />
        </svg>
      </div>

      {/* Center content - typewriter with ink ribbons */}
      <div className="flex justify-center items-center gap-8">
        <InkRibbon />
        <div className="flex flex-col items-center">
          <TypewriterSavePoint />
          <p className="mt-2 text-sm tracking-[0.5em] uppercase" style={{ color: RE.fog }}>
            SAVE YOUR PROGRESS
          </p>
        </div>
        <InkRibbon />
      </div>

      {/* Biohazard symbols in corners */}
      <div className="absolute top-2 left-4 opacity-15">
        <svg width="30" height="30" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke={RE.rust} strokeWidth="2" />
          <g fill={RE.rust}>
            <circle cx="40" cy="25" r="8" />
            <circle cx="27" cy="48" r="8" />
            <circle cx="53" cy="48" r="8" />
          </g>
        </svg>
      </div>
      <div className="absolute top-2 right-4 opacity-15">
        <svg width="30" height="30" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke={RE.rust} strokeWidth="2" />
          <g fill={RE.rust}>
            <circle cx="40" cy="25" r="8" />
            <circle cx="27" cy="48" r="8" />
            <circle cx="53" cy="48" r="8" />
          </g>
        </svg>
      </div>
    </div>
  )
}

// Art Section Divider - Herb Garden Scene
export function ArtSectionHerbs() {
  return (
    <div className="relative py-10 my-8" style={{ borderTop: `1px solid ${RE.midBrown}40`, borderBottom: `1px solid ${RE.midBrown}40` }}>
      {/* Fog effect */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${RE.fog}40, transparent)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Herb collection display */}
      <div className="flex justify-center items-end gap-6">
        {/* Green herb x3 */}
        <div className="flex gap-1">
          <HerbIcon color="green" />
          <HerbIcon color="green" />
          <HerbIcon color="green" />
        </div>

        {/* Divider */}
        <div className="h-12 w-px" style={{ background: `linear-gradient(180deg, transparent, ${RE.midBrown}, transparent)` }} />

        {/* Mixed herbs */}
        <div className="flex gap-2 items-end">
          <HerbIcon color="green" />
          <HerbIcon color="red" />
        </div>

        {/* Center typewriter icon */}
        <div className="px-4">
          <svg width="60" height="40" viewBox="0 0 120 80" className="opacity-50">
            <rect x="25" y="25" width="70" height="30" rx="3" fill={RE.darkSepia} />
            <rect x="35" y="15" width="50" height="18" fill={RE.ivory} />
            <rect x="30" y="12" width="60" height="5" rx="2" fill={RE.midBrown} />
          </svg>
        </div>

        {/* Divider */}
        <div className="h-12 w-px" style={{ background: `linear-gradient(180deg, transparent, ${RE.midBrown}, transparent)` }} />

        {/* Blue + green mix */}
        <div className="flex gap-2 items-end">
          <HerbIcon color="blue" />
          <HerbIcon color="green" />
        </div>

        {/* Divider */}
        <div className="h-12 w-px" style={{ background: `linear-gradient(180deg, transparent, ${RE.midBrown}, transparent)` }} />

        {/* Red herb solo */}
        <div className="flex gap-1">
          <HerbIcon color="red" />
          <HerbIcon color="red" />
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center mt-4">
        <p className="text-sm tracking-[0.3em]" style={{ color: RE.warmGlow }}>
          - - - ITEM BOX - - -
        </p>
      </div>

      {/* Blood drip accents */}
      <div className="absolute bottom-0 left-1/4">
        <svg width="4" height="20" viewBox="0 0 4 20" style={{ opacity: 0.3 }}>
          <path d="M2,0 Q1,10 2,20" stroke={RE.blood} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-1/3">
        <svg width="4" height="25" viewBox="0 0 4 25" style={{ opacity: 0.25 }}>
          <path d="M2,0 Q3,12 2,25" stroke={RE.bloodDark} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

// Typewriter text effect
export function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  useEffect(() => {
    const cursorInterval = setInterval(() => setCursor(c => !c), 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span>
      {displayed}
      <span className={cursor ? 'opacity-100' : 'opacity-0'}>|</span>
    </span>
  )
}
