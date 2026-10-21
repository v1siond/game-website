import { CT_COLORS } from './palette'

// =============================================================================
// UI COMPONENTS
// =============================================================================

// Battle Menu Frame (CT signature UI)
export function BattleFrame({
  children,
  title,
  era = 'present',
}: {
  children: React.ReactNode
  title?: string
  era?: 'prehistoric' | 'medieval' | 'present' | 'future' | 'end-of-time'
}) {
  const eraColors = {
    prehistoric: CT_COLORS.prehistoricOrange,
    medieval: CT_COLORS.medievalGreen,
    present: CT_COLORS.portalBlue,
    future: CT_COLORS.futureChrome,
    'end-of-time': CT_COLORS.portalPurple,
  }

  const accentColor = eraColors[era]

  return (
    <section
      className="relative mb-8"
      style={{
        border: `3px solid ${CT_COLORS.white}`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidDark} 0%, ${CT_COLORS.voidMid} 100%)`,
        boxShadow: `0 0 20px ${accentColor}40, inset 0 0 40px ${CT_COLORS.voidDark}`,
        imageRendering: 'pixelated' as const,
      }}
      role="region"
      aria-label={title || 'Content section'}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />
      <div className="absolute top-0 right-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />

      {/* Side bars */}
      <div className="absolute top-4 bottom-4 left-0 w-1" style={{ background: accentColor + '60' }} aria-hidden="true" />
      <div className="absolute top-4 bottom-4 right-0 w-1" style={{ background: accentColor + '60' }} aria-hidden="true" />

      {title && (
        <div
          className="px-5 py-3 border-b-2 flex items-center gap-3"
          style={{ borderColor: CT_COLORS.white + '40' }}
        >
          <span style={{ color: accentColor }}>◈</span>
          <h2 className="text-xs tracking-[0.2em]" style={{ color: CT_COLORS.white }}>
            {title}
          </h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}60, transparent)` }} />
        </div>
      )}

      <div className="p-5">{children}</div>
    </section>
  )
}
