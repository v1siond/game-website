import { memo } from 'react'
import { CHROME, OLIVE_DARK, RUBBER, SHELTER_BLUE_DARK, STEEL, STEEL_EDGE, STEEL_LIGHT, WARNING_RED } from './palette'
import atomic from './atomic.module.css'

// Inside the shelter, behind the page: the riveted steel wall (CSS, atomic.module.css .shelterWall), the
// far layer of pipe runs and bulkhead ribs, the near layer of the big pipe with its valve wheel and the
// cable tray, the hazard stripe along the floor. The far and near layers slide apart with the pointer
// (--mx and --my from usePointerVars on the root) for depth; the one lamp pulses. All of it is
// decoration, aria-hidden and fixed, under the content; the contact section leaves it for the outside.

function FarLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={`absolute inset-[-3%] h-[106%] w-[106%] ${atomic.backFar}`} focusable="false">
      {[120, 480, 840, 1200].map((x) => (
        <g key={x}>
          <rect x={x} y="0" width="46" height="900" fill={STEEL} />
          <rect x={x + 6} y="0" width="6" height="900" fill={STEEL_EDGE} opacity="0.35" />
          {[140, 420, 700].map((y) => (
            <circle key={y} cx={x + 23} cy={y} r="5" fill={STEEL_LIGHT} />
          ))}
        </g>
      ))}
      <rect x="0" y="70" width="1440" height="22" fill={STEEL_LIGHT} />
      <rect x="0" y="74" width="1440" height="4" fill={CHROME} opacity="0.25" />
      <rect x="0" y="110" width="1440" height="12" fill={SHELTER_BLUE_DARK} />
    </svg>
  )
}

function NearLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={`absolute inset-[-5%] h-[110%] w-[110%] ${atomic.backNear}`} focusable="false">
      <defs>
        <linearGradient id="atomic-pipe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={STEEL_EDGE} />
          <stop offset="35%" stopColor={CHROME} />
          <stop offset="100%" stopColor={STEEL} />
        </linearGradient>
      </defs>
      <rect x="0" y="12" width="1440" height="40" fill="url(#atomic-pipe)" />
      {[200, 640, 1100].map((x) => (
        <rect key={x} x={x} y="6" width="24" height="52" rx="3" fill={STEEL_LIGHT} stroke={RUBBER} strokeWidth="2" />
      ))}
      <g transform="translate(1320 32)">
        <circle r="34" fill="none" stroke={WARNING_RED} strokeWidth="8" />
        <path d="M-34 0 H34 M0 -34 V34" stroke={WARNING_RED} strokeWidth="6" />
        <circle r="8" fill={RUBBER} />
      </g>
      <rect x="1380" y="40" width="34" height="860" fill="url(#atomic-pipe)" />
      <path d="M0 860 H1440 V900 H0 Z" fill={OLIVE_DARK} />
    </svg>
  )
}

export const ShelterBackdrop = memo(function ShelterBackdrop() {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${atomic.shelterWall}`} aria-hidden="true">
      <FarLayer />
      <NearLayer />
      <span className={`absolute left-[8%] top-[18%] h-3 w-3 rounded-full ${atomic.wallLamp} ${atomic.ambient}`} />
      <span className={`absolute inset-x-0 bottom-0 h-6 ${atomic.hazardStripe}`} />
      <span className={`absolute inset-0 ${atomic.wallShade}`} />
    </div>
  )
})
