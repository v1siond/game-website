import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { LIMBO } from './palette'

// The three figures are the profession switch's options: ProfessionSwitch owns the order (Musician,
// System Engineer, Martial Artist), the pick and the keyboard; each figure only draws itself.
export function SilhouetteFigure({ option }: { option: ProfessionOption }) {
  const { id: profession, label, selected: isActive, optionProps } = option

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative transition-all duration-300 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
        isActive ? 'scale-110' : 'opacity-30 hover:opacity-50'
      }`}
    >
      <div className="relative w-16 h-24 mx-auto">
        <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
          {profession === 'engineer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill={LIMBO.black} />
              {/* GLOWING WHITE EYES */}
              <ellipse cx="27" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <ellipse cx="33" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <rect x="15" y="23" width="30" height="35" fill={LIMBO.black} rx="3" />
              <rect x="10" y="58" width="10" height="20" fill={LIMBO.black} />
              <rect x="40" y="58" width="10" height="20" fill={LIMBO.black} />
              <rect x="20" y="28" width="20" height="12" fill={isActive ? LIMBO.midGrey1 : LIMBO.darkGrey2} rx="1" />
            </>
          )}
          {profession === 'drummer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill={LIMBO.black} />
              <ellipse cx="27" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <ellipse cx="33" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <path d="M20,23 L40,23 L38,50 L22,50 Z" fill={LIMBO.black} />
              <rect x="12" y="50" width="8" height="20" fill={LIMBO.black} />
              <rect x="40" y="50" width="8" height="20" fill={LIMBO.black} />
              {/* Drumsticks */}
              <line x1="8" y1="18" x2="2" y2="38" stroke={LIMBO.black} strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="18" x2="58" y2="38" stroke={LIMBO.black} strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {profession === 'fighter' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill={LIMBO.black} />
              <ellipse cx="27" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <ellipse cx="33" cy="11" rx="1.8" ry="1.2" fill={isActive ? LIMBO.fogWhite3 : LIMBO.midGrey2} className={isActive ? 'figure-eye' : ''} />
              <path d="M18,23 L42,23 L40,50 L20,50 Z" fill={LIMBO.black} />
              <rect x="14" y="50" width="10" height="22" fill={LIMBO.black} />
              <rect x="36" y="50" width="10" height="22" fill={LIMBO.black} />
              {/* Fighting stance arms */}
              <path d="M4,28 L18,24 L20,34 L6,36 Z" fill={LIMBO.black} />
              <path d="M56,28 L42,24 L40,34 L54,36 Z" fill={LIMBO.black} />
            </>
          )}
        </svg>
      </div>

      {isActive && (
        <div
          className="absolute inset-0 -z-10 blur-xl"
          style={{ background: `radial-gradient(circle, ${LIMBO.fogWhite1}30, transparent 50%)` }}
          aria-hidden="true"
        />
      )}

      <span
        className={`block mt-1.5 text-sm tracking-[0.2em] lowercase ${isActive ? 'text-[#CCCCCC]' : 'text-[#888888]'}`}
        aria-hidden="true"
      >
        {label}
      </span>
    </button>
  )
}
