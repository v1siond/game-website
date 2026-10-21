import type { ReactNode } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { WC3 } from './palette'

// =============================================================================
// PROFESSION NODE - WC3 command card button, drawn for the shared ProfessionSwitch. The switch lays
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
  const tint = selected ? WC3.roc.felBright : WC3.textMid

  return (
    <button
      type="button"
      {...optionProps}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060608]"
      style={{
        width: size,
        height: size,
        background: selected
          ? `linear-gradient(135deg, ${WC3.metalLight} 0%, ${WC3.metalMid} 50%, ${WC3.metalDark} 100%)`
          : `linear-gradient(135deg, ${WC3.metalDark} 0%, ${WC3.bgDeep} 100%)`,
        border: `3px solid ${selected ? WC3.roc.felMid : WC3.metalMid}`,
        boxShadow: selected
          ? `0 0 20px ${WC3.roc.felGlow}, inset 0 1px 2px rgba(255,255,255,0.1)`
          : `inset 0 -2px 4px rgba(0,0,0,0.5)`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        transition: 'all 0.3s ease',
        position: 'relative',
        alignSelf: isCentre ? 'flex-start' : 'flex-end',
        marginTop: isCentre ? (isLargeScreen ? '0.5rem' : '0.25rem') : undefined,
        padding: '0.25rem',
      }}
    >
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
