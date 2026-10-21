import { COLORS, crtScanlines, metallicTexture, screenGlow, screenVignette } from './palette'

// =============================================================================
// ARCADE CABINET FRAME SVG - WORN METAL WITH BOLTS
// =============================================================================
function ArcadeCabinetFrame({ children, color = COLORS.specialBlue }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="relative"
      style={{
        background: metallicTexture,
        border: `4px solid ${color}`,
        borderRadius: '4px',
        boxShadow: `
          0 0 20px ${color}60,
          0 0 40px ${color}30,
          inset 0 0 40px rgba(0,0,0,0.7),
          inset 2px 2px 0 rgba(255,255,255,0.05),
          inset -2px -2px 0 rgba(0,0,0,0.4)
        `,
      }}
    >
      {/* Corner bolts/rivets */}
      {[
        { top: '8px', left: '8px' },
        { top: '8px', right: '8px' },
        { bottom: '8px', left: '8px' },
        { bottom: '8px', right: '8px' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 z-20"
          aria-hidden="true"
          style={{
            ...pos,
            background: `radial-gradient(circle at 30% 30%, ${COLORS.chrome}, ${COLORS.chromeDark}, ${COLORS.chromeDarker})`,
            border: `2px solid ${COLORS.arcadeGray}`,
            borderRadius: '50%',
            boxShadow: `
              inset 0 2px 3px rgba(255,255,255,0.5),
              inset 0 -2px 3px rgba(0,0,0,0.7),
              0 2px 4px rgba(0,0,0,0.5)
            `,
          }}
        >
          {/* Phillips head screw */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '10px', height: '2px', background: COLORS.arcadeGray }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '2px', height: '10px', background: COLORS.arcadeGray }}
          />
        </div>
      ))}

      {/* Worn scratches on metal - subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          background: `
            repeating-linear-gradient(45deg, transparent 0px, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 30px, rgba(0,0,0,0.05) 30px, rgba(0,0,0,0.05) 31px)
          `,
        }}
      />

      {children}
    </div>
  )
}

// =============================================================================
// CRT SCREEN EFFECT WRAPPER
// =============================================================================
function CRTScreen({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Screen glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ background: screenGlow }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* CRT scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        aria-hidden="true"
        style={{ background: crtScanlines, opacity: 0.4 }}
      />

      {/* Screen curvature vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        aria-hidden="true"
        style={{ background: screenVignette }}
      />
    </div>
  )
}

// =============================================================================
// SECTION CARD - ARCADE PANEL WITH NEON BORDER
// =============================================================================
export function ArcadeSectionCard({
  children,
  color = COLORS.specialBlue,
  title,
  titleIcon,
  id,
}: {
  children: React.ReactNode
  color?: string
  title?: string
  titleIcon?: string
  id?: string
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative mb-10"
    >
      <ArcadeCabinetFrame color={color}>
        {/* CRT effect inside */}
        <CRTScreen>
          {/* Title bar with arcade button */}
          {title && (
            <div
              id={id}
              className="relative px-8 py-4 flex items-center gap-4"
              style={{
                background: `linear-gradient(180deg, ${color}40, ${color}15, transparent)`,
                borderBottom: `3px solid ${color}80`,
              }}
            >
              {/* Arcade button decoration */}
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${color}, ${color}99, ${color}66)`,
                  border: `4px solid ${COLORS.arcadeGray}`,
                  borderRadius: '50%',
                  boxShadow: `
                    inset 0 3px 6px rgba(255,255,255,0.5),
                    inset 0 -3px 6px rgba(0,0,0,0.5),
                    0 0 15px ${color}80,
                    0 4px 8px rgba(0,0,0,0.5)
                  `,
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{
                    color: COLORS.arcadeBlack,
                    textShadow: `0 1px 0 rgba(255,255,255,0.4)`,
                  }}
                >
                  {titleIcon}
                </span>
              </div>

              <h2
                className="text-2xl tracking-[0.2em] font-black uppercase"
                style={{
                  color,
                  textShadow: `
                    0 0 10px ${color},
                    0 0 20px ${color}80,
                    0 0 30px ${color}40,
                    3px 3px 0 ${COLORS.arcadeBlack},
                    -1px -1px 0 ${COLORS.arcadeBlack}
                  `,
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                }}
              >
                {title}
              </h2>
            </div>
          )}

          <div className="relative p-8">{children}</div>
        </CRTScreen>
      </ArcadeCabinetFrame>
    </section>
  )
}
