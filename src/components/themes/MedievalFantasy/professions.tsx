import type { ReactNode } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { REALM } from './palette'

// =============================================================================
// PROFESSION NODE - REALM command card button, drawn for the shared ProfessionSwitch. The switch lays
// the nodes out Musician, System Engineer, Martial Artist, so the engineer node is the raised centre.
// =============================================================================

const PROFESSION_NODE_ICONS: Record<Profession, (color: string) => ReactNode> = {
  drummer: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" fill={color}/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2"/>
    </svg>
  ),
  engineer: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  fighter: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4l7.07 17.57 2.51-7.39 7.39-2.51L4 4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

export function ProfessionNode({ option, isLargeScreen }: { option: ProfessionOption; isLargeScreen: boolean }) {
  const { id, label, selected, optionProps } = option
  const isCentre = id === 'engineer'
  const size = isCentre ? (isLargeScreen ? '8rem' : '6rem') : (isLargeScreen ? '7rem' : '5.5rem')
  const tint = selected ? REALM.chaosFelBright : REALM.textMid

  return (
    <button
      type="button"
      {...optionProps}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--realm-gold-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--realm-bg-void)]"
      style={{
        width: size,
        height: size,
        background: selected
          ? `linear-gradient(135deg, ${REALM.metalLight} 0%, ${REALM.metalMid} 50%, ${REALM.metalDark} 100%)`
          : `linear-gradient(135deg, ${REALM.metalDark} 0%, ${REALM.bgDeep} 100%)`,
        border: `3px solid ${REALM.metalMid}`,
        boxShadow: selected ? 'inset 0 1px 2px rgba(255,255,255,0.1)' : 'inset 0 -2px 4px rgba(0,0,0,0.5)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        position: 'relative',
        alignSelf: isCentre ? 'flex-start' : 'flex-end',
        marginTop: isCentre ? (isLargeScreen ? '0.5rem' : '0.25rem') : undefined,
        padding: '0.25rem',
      }}
    >
      {/* The selected rim and its fel glow are drawn once over the border and fade in, so selecting a node
          animates opacity only */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[3px]"
        style={{
          border: `3px solid ${REALM.chaosFelMid}`,
          boxShadow: `0 0 20px ${REALM.moss27}80`,
          opacity: selected ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      {PROFESSION_NODE_ICONS[id](tint)}
      <span
        aria-hidden="true"
        style={{
          color: tint,
          fontSize: '0.875rem',
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 1.15,
          textAlign: 'center',
        }}
      >
        {label}
      </span>
    </button>
  )
}

// =============================================================================
// FEL PATHS - the trails from the engineer node out to the musician and the martial artist. They are drawn
// in a 0 to 100 box stretched over the row of nodes, so each curve runs from the centre of a side node (low,
// near the row's edge) up to the raised centre node at any width; the stroke keeps its pixel width. The trail
// of the chosen profession is lit: its solid line and a pre-drawn blurred glow fade in over the dashed line,
// and the glow pulses on opacity.
// =============================================================================

type FelPathProfession = Extract<Profession, 'drummer' | 'fighter'>

const FEL_PATHS: Record<FelPathProfession, { large: string; small: string }> = {
  drummer: { large: 'M 10 67 Q 30 40 50 42', small: 'M 12 64 Q 31 40 50 42' },
  fighter: { large: 'M 50 42 Q 70 40 90 67', small: 'M 50 42 Q 69 40 88 64' },
}

const FEL_PATH_IDS = Object.keys(FEL_PATHS) as FelPathProfession[]

export function FelPaths({ active, isLargeScreen }: { active: Profession; isLargeScreen: boolean }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="felPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={REALM.chaosFelDark} stopOpacity="0.3" />
          <stop offset="50%" stopColor={REALM.chaosFelMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={REALM.chaosFelDark} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {FEL_PATH_IDS.map((id) => {
        const d = isLargeScreen ? FEL_PATHS[id].large : FEL_PATHS[id].small
        const lit = active === id
        return (
          <g key={id} fill="none">
            <path
              d={d}
              stroke="url(#felPathGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              className={`transition-opacity duration-300 ${lit ? 'opacity-0' : 'opacity-100'}`}
            />
            <g className={`transition-opacity duration-300 ${lit ? 'opacity-100' : 'opacity-0'}`}>
              <path
                d={d}
                stroke={REALM.chaosFelMid}
                strokeWidth="8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={`blur-[3px] ${lit ? 'motion-safe:animate-pulse' : ''}`}
              />
              <path d={d} stroke="url(#felPathGradient)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
