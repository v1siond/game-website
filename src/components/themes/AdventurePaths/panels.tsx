import { MARIO_COLORS } from './palette'
import { Coin, QuestionBlock, Starman } from './icons'

// =============================================================================
// SECTION CARD STYLES
// =============================================================================

// Question Block Panel Style
export function QuestionBlockPanel({ children, title, icon }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner question blocks */}
      <div className="absolute -top-4 -left-4 z-10" aria-hidden="true"><QuestionBlock size={32} /></div>
      <div className="absolute -top-4 -right-4 z-10" aria-hidden="true"><QuestionBlock size={32} /></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, transparent, ${MARIO_COLORS.questionYellow}80, ${MARIO_COLORS.questionYellow})` }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`,
            border: `3px solid ${MARIO_COLORS.questionYellow}`,
            borderRadius: '4px',
            boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionYellow}80, transparent)` }} aria-hidden="true" />
      </div>

      {/* Content with brick texture */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #FFF9E6 0%, #FFF3CC 100%)`,
          border: `4px solid ${MARIO_COLORS.groundBrown}`,
          borderRadius: '4px',
          boxShadow: `inset 0 2px 0 #FFECB3, 0 4px 0 ${MARIO_COLORS.groundDarkest}`,
        }}
      >
        {/* Subtle brick texture overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5" aria-hidden="true">
          <defs>
            <pattern id="subtleBrick" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="28" height="13" stroke={MARIO_COLORS.brickDark} strokeWidth="0.5" fill="none" />
              <rect x="30" y="0" width="30" height="13" stroke={MARIO_COLORS.brickDark} strokeWidth="0.5" fill="none" />
              <rect x="15" y="15" width="30" height="15" stroke={MARIO_COLORS.brickDark} strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtleBrick)" />
        </svg>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// Underground/Castle variant panel
export function UndergroundPanel({ children, title, icon }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner coins */}
      <div className="absolute -top-3 -left-3 z-10" aria-hidden="true"><Coin size={24} /></div>
      <div className="absolute -top-3 -right-3 z-10" aria-hidden="true"><Coin size={24} /></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, transparent, ${MARIO_COLORS.coinGold}60, ${MARIO_COLORS.coinGold})` }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
            border: `3px solid ${MARIO_COLORS.coinGold}`,
            borderRadius: '4px',
            boxShadow: `0 4px 0 ${MARIO_COLORS.pipeDark}`,
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, ${MARIO_COLORS.coinGold}, ${MARIO_COLORS.coinGold}60, transparent)` }} aria-hidden="true" />
      </div>

      {/* Dark content area */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${MARIO_COLORS.undergroundBlue} 0%, ${MARIO_COLORS.undergroundBlack} 100%)`,
          border: `4px solid #3A3A8A`,
          borderRadius: '4px',
          boxShadow: `inset 0 2px 0 #4A4A9A, 0 4px 0 #0A0A20`,
        }}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// Castle variant panel
export function CastlePanel({ children, title, icon }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner stars */}
      <div className="absolute -top-4 -left-4 z-10" aria-hidden="true"><Starman size={32} /></div>
      <div className="absolute -top-4 -right-4 z-10" aria-hidden="true"><Starman size={32} /></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, transparent, ${MARIO_COLORS.flagLight}80, ${MARIO_COLORS.flagLight})` }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: `linear-gradient(180deg, ${MARIO_COLORS.castleGrey}, ${MARIO_COLORS.castleDark})`,
            border: `3px solid ${MARIO_COLORS.flagLight}`,
            borderRadius: '4px',
            boxShadow: `0 4px 0 #2A2A2A`,
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, ${MARIO_COLORS.flagLight}, ${MARIO_COLORS.flagLight}80, transparent)` }} aria-hidden="true" />
      </div>

      {/* Stone content area */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${MARIO_COLORS.castleGrey} 0%, ${MARIO_COLORS.castleDark} 100%)`,
          border: `4px solid #5A5A5A`,
          borderRadius: '4px',
          boxShadow: `inset 0 2px 0 #8A8A8A, 0 4px 0 #2A2A2A`,
        }}
      >
        {/* Castle brick texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" aria-hidden="true">
          <defs>
            <pattern id="castleBrickBg" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="18" height="9" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
              <rect x="20" y="0" width="20" height="9" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
              <rect x="10" y="10" width="20" height="10" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#castleBrickBg)" />
        </svg>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}
