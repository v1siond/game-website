import { headingId } from '@/components/cv/sectionText'
import { COLORS } from './palette'

// Tropical Platformer: the crate panel every section is framed in.

// ============================================================================
// SECTION CARD - Wooden crate panel style with plank texture
// ============================================================================
export function CratePanel({
  children,
  title,
  titleIcon,
  variant = 'wood',
  className = '',
}: {
  children: React.ReactNode
  title: string
  titleIcon?: React.ReactNode
  variant?: 'wood' | 'tnt' | 'checkpoint' | 'temple' | 'nitro'
  className?: string
}) {
  const variants = {
    wood: {
      bg: `linear-gradient(145deg, ${COLORS.crateWood}ee, ${COLORS.crateSienna}dd)`,
      border: COLORS.cratePeru,
      titleBg: COLORS.crateWood,
      accent: COLORS.maskYellow,
    },
    tnt: {
      bg: `linear-gradient(145deg, ${COLORS.tntRed}dd, ${COLORS.tntDark}ee)`,
      border: COLORS.tntRed,
      titleBg: COLORS.tntDark,
      accent: COLORS.maskYellow,
    },
    checkpoint: {
      bg: `linear-gradient(145deg, ${COLORS.oceanBlue}30, ${COLORS.oceanRoyal}50)`,
      border: COLORS.oceanSky,
      titleBg: COLORS.oceanRoyal,
      accent: COLORS.oceanSky,
    },
    temple: {
      bg: `linear-gradient(145deg, ${COLORS.beachBrown}cc, ${COLORS.crateWood}dd)`,
      border: COLORS.maskGold,
      titleBg: COLORS.beachBrown,
      accent: COLORS.maskYellow,
    },
    nitro: {
      bg: `linear-gradient(145deg, ${COLORS.nitroGreen}30, ${COLORS.jungleDark}60)`,
      border: COLORS.nitroBright,
      titleBg: COLORS.jungleDark,
      accent: COLORS.nitroBright,
    },
  }
  const v = variants[variant]

  return (
    <section
      className={`relative ${className}`}
      aria-labelledby={headingId('section', title)}
    >
      {/* Tiki corner decorations */}
      <div
        className="absolute -top-3 -left-3 w-10 h-10"
        style={{
          borderLeft: `4px solid ${v.accent}`,
          borderTop: `4px solid ${v.accent}`,
          borderRadius: '4px 0 0 0',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-3 -right-3 w-10 h-10"
        style={{
          borderRight: `4px solid ${v.accent}`,
          borderTop: `4px solid ${v.accent}`,
          borderRadius: '0 4px 0 0',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-3 -left-3 w-10 h-10"
        style={{
          borderLeft: `4px solid ${v.accent}`,
          borderBottom: `4px solid ${v.accent}`,
          borderRadius: '0 0 0 4px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-3 -right-3 w-10 h-10"
        style={{
          borderRight: `4px solid ${v.accent}`,
          borderBottom: `4px solid ${v.accent}`,
          borderRadius: '0 0 4px 0',
        }}
        aria-hidden="true"
      />

      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: v.bg,
          border: `4px solid ${v.border}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15)`,
        }}
      >
        {/* Wood plank texture overlay */}
        {(variant === 'wood' || variant === 'temple') && (
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 60px, ${COLORS.beachBrown}40 60px, ${COLORS.beachBrown}40 62px),
                repeating-linear-gradient(0deg, transparent, transparent 40px, ${COLORS.beachBrown}30 40px, ${COLORS.beachBrown}30 41px)
              `,
            }}
            aria-hidden="true"
          />
        )}

        {/* Title bar with jungle leaf border feel */}
        <div
          className="px-6 py-4 flex items-center gap-4"
          style={{
            background: `linear-gradient(180deg, ${v.titleBg}, ${v.titleBg}cc)`,
            borderBottom: `3px solid ${v.border}`,
          }}
        >
          {titleIcon}
          <h2
            id={headingId('section', title)}
            className="text-xl font-black tracking-wider uppercase"
            style={{
              color: '#fff',
              textShadow: '3px 3px 0 rgba(0,0,0,0.6)',
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </section>
  )
}
