import { VSBadge } from './badges'
import { COLORS } from './palette'

// =============================================================================
// ART SEPARATOR - ARCADE DECORATIVE ELEMENT
// =============================================================================
export function ArtSeparator({ type = 'lightning' }: { type?: 'lightning' | 'versus' | 'flames' }) {
  if (type === 'versus') {
    return (
      <div className="flex justify-center items-center py-8">
        <VSBadge large />
      </div>
    )
  }

  if (type === 'flames') {
    return (
      <div
        className="h-16 my-8 relative overflow-hidden"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(90deg, transparent, ${COLORS.p2Red}30, ${COLORS.orange}30, ${COLORS.electricYellow}30, ${COLORS.orange}30, ${COLORS.p2Red}30, transparent)
          `,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(90deg,
                transparent 0px,
                transparent 40px,
                ${COLORS.p2Red}20 40px,
                ${COLORS.p2Red}20 42px
              )
            `,
          }}
        />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <span
            className="text-2xl tracking-[1em]"
            style={{
              color: COLORS.electricYellow,
              textShadow: `0 0 20px ${COLORS.orange}`,
            }}
          >
            ★ ★ ★
          </span>
        </div>
      </div>
    )
  }

  // Default: lightning
  return (
    <div
      className="h-12 my-8 relative"
      aria-hidden="true"
      style={{
        background: `linear-gradient(90deg, transparent, ${COLORS.electricYellow}20, transparent)`,
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 50"
        preserveAspectRatio="none"
      >
        <path
          d="M0 25 L200 25 L220 10 L240 40 L260 10 L280 40 L300 10 L320 40 L340 25 L500 25 L520 10 L540 40 L560 10 L580 40 L600 10 L620 40 L640 25 L800 25 L820 10 L840 40 L860 10 L880 40 L900 10 L920 40 L940 25 L1000 25"
          fill="none"
          stroke={COLORS.electricYellow}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 8px ${COLORS.electricYellow})` }}
        />
      </svg>
    </div>
  )
}
