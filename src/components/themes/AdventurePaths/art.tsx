import { MARIO_COLORS } from './palette'
import { BrickBlock, Coin, FireFlower, FlagPole, GreenPipe, GroundPattern, MarioBush, MarioCloud, MarioSilhouette, QuestionBlock, Starman, SuperMushroom } from './icons'

// =============================================================================
// DECORATIVE ART SECTIONS
// =============================================================================

// === ART SECTION 1: Mushroom Kingdom Scene (after About) ===
export function MushroomKingdomScene() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: MARIO_COLORS.skyBlue }}>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARIO_COLORS.skyLight} 0%, ${MARIO_COLORS.skyBlue} 100%)` }} />

      {/* Clouds */}
      <div className="absolute top-4 left-[5%]"><MarioCloud width={100} /></div>
      <div className="absolute top-8 left-[40%]"><MarioCloud width={140} /></div>
      <div className="absolute top-2 right-[10%]"><MarioCloud width={90} /></div>

      {/* Hills in background */}
      <svg className="absolute bottom-20 left-0 w-full" height="60" viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="150" cy="60" rx="120" ry="50" fill={MARIO_COLORS.bushGreen} />
        <ellipse cx="500" cy="60" rx="180" ry="60" fill={MARIO_COLORS.bushGreen} />
        <ellipse cx="720" cy="60" rx="100" ry="40" fill={MARIO_COLORS.bushGreen} />
      </svg>

      {/* Scene elements */}
      <div className="relative z-10 max-w-4xl mx-auto flex items-end justify-between px-4" style={{ height: '200px' }}>
        {/* Left: Question blocks and coins */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <Coin size={20} />
            <Coin size={20} />
            <Coin size={20} />
          </div>
          <div className="flex gap-1">
            <QuestionBlock size={40} />
            <BrickBlock size={40} />
            <QuestionBlock size={40} />
          </div>
        </div>

        {/* Center: Pipe with Piranha Plant silhouette */}
        <div className="flex flex-col items-center">
          {/* Piranha plant peeking */}
          <svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true">
            <ellipse cx="20" cy="25" rx="18" ry="12" fill={MARIO_COLORS.marioRed} />
            <ellipse cx="20" cy="15" rx="14" ry="10" fill={MARIO_COLORS.marioRed} />
            {/* White dots */}
            <circle cx="10" cy="20" r="4" fill="#FFF" />
            <circle cx="30" cy="20" r="4" fill="#FFF" />
            <circle cx="20" cy="12" r="3" fill="#FFF" />
            {/* Stem hint */}
            <rect x="16" y="26" width="8" height="4" fill={MARIO_COLORS.pipeGreen} />
          </svg>
          <GreenPipe height={100} width={64} />
        </div>

        {/* Right: Starman and mushroom */}
        <div className="flex items-end gap-4">
          <Starman size={40} />
          <SuperMushroom size={36} />
          <SuperMushroom size={36} is1UP />
          <FireFlower size={36} />
        </div>
      </div>

      {/* Bushes */}
      <div className="absolute bottom-20 left-[8%]"><MarioBush width={80} /></div>
      <div className="absolute bottom-20 right-[15%]"><MarioBush width={100} /></div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0">
        <GroundPattern />
      </div>
    </div>
  )
}

// === ART SECTION 2: Underground Level (after Experience) ===
export function UndergroundScene() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: MARIO_COLORS.undergroundBlack }}>
      {/* Dark underground gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARIO_COLORS.undergroundBlack} 0%, ${MARIO_COLORS.undergroundBlue} 50%, ${MARIO_COLORS.undergroundBlack} 100%)` }} />

      {/* Brick ceiling */}
      <svg className="absolute top-0 left-0 w-full" height="48" viewBox="0 0 800 48" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="ceilingBricks" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
            <rect width="48" height="24" fill={MARIO_COLORS.undergroundBlue} />
            <rect x="0" y="0" width="22" height="10" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="24" y="0" width="24" height="10" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="12" y="12" width="24" height="12" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="0" y="12" width="12" height="12" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="36" y="12" width="12" height="12" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="800" height="48" fill="url(#ceilingBricks)" />
      </svg>

      {/* Scene elements */}
      <div className="relative z-10 max-w-4xl mx-auto flex items-end justify-between px-4" style={{ height: '180px' }}>
        {/* Left: Pipes */}
        <div className="flex items-end gap-8">
          <GreenPipe height={120} width={56} />
          <GreenPipe height={80} width={56} />
        </div>

        {/* Center: Block formation with coins */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <Coin size={18} />
            <Coin size={18} />
            <Coin size={18} />
            <Coin size={18} />
            <Coin size={18} />
          </div>
          <div className="flex">
            <BrickBlock size={36} />
            <QuestionBlock size={36} />
            <BrickBlock size={36} />
            <BrickBlock size={36} />
            <QuestionBlock size={36} />
            <BrickBlock size={36} />
          </div>
        </div>

        {/* Right: Pipe with piranha silhouette */}
        <div className="flex items-end gap-4">
          <div className="relative">
            {/* Piranha shadow */}
            <svg className="absolute -top-8 left-1/2 -translate-x-1/2" width="50" height="40" viewBox="0 0 50 40" opacity="0.8" aria-hidden="true">
              <path d="M10,40 L10,30 Q25,20 40,30 L40,40 Z" fill={MARIO_COLORS.pipeGreen} />
              <ellipse cx="25" cy="15" rx="20" ry="15" fill={MARIO_COLORS.marioRed} />
              <circle cx="15" cy="12" r="4" fill="#FFF" />
              <circle cx="35" cy="12" r="4" fill="#FFF" />
            </svg>
            <GreenPipe height={100} width={64} />
          </div>
        </div>
      </div>

      {/* Underground floor */}
      <svg className="absolute bottom-0 left-0 w-full" height="32" viewBox="0 0 800 32" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="undergroundFloor" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
            <rect width="32" height="16" fill="#2A2A6A" />
            <rect x="0" y="0" width="15" height="7" stroke="#1A1A4A" strokeWidth="1" fill="none" />
            <rect x="16" y="0" width="16" height="7" stroke="#1A1A4A" strokeWidth="1" fill="none" />
            <rect x="8" y="8" width="16" height="8" stroke="#1A1A4A" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="800" height="32" fill="url(#undergroundFloor)" />
      </svg>
    </div>
  )
}

// === ART SECTION 3: Castle/Flag Pole Victory Scene (after Projects) ===
export function CastleVictoryScene() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: MARIO_COLORS.skyBlue }}>
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARIO_COLORS.skyLight} 0%, ${MARIO_COLORS.skyBlue} 60%, #FFB347 100%)` }} />

      {/* Clouds */}
      <div className="absolute top-6 left-[20%]"><MarioCloud width={80} /></div>
      <div className="absolute top-4 right-[25%]"><MarioCloud width={100} /></div>

      {/* Castle */}
      <svg className="absolute bottom-20 right-[15%]" width="200" height="160" viewBox="0 0 200 160" aria-label="Castle" role="img">
        <defs>
          <pattern id="castleBricks" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <rect width="20" height="10" fill={MARIO_COLORS.castleGrey} />
            <rect x="0" y="0" width="9" height="4" stroke={MARIO_COLORS.castleDark} strokeWidth="0.5" fill="none" />
            <rect x="10" y="0" width="10" height="4" stroke={MARIO_COLORS.castleDark} strokeWidth="0.5" fill="none" />
            <rect x="5" y="5" width="10" height="5" stroke={MARIO_COLORS.castleDark} strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        {/* Main castle body */}
        <rect x="20" y="60" width="160" height="100" fill="url(#castleBricks)" />
        {/* Towers */}
        <rect x="10" y="40" width="30" height="120" fill="url(#castleBricks)" />
        <rect x="160" y="40" width="30" height="120" fill="url(#castleBricks)" />
        {/* Tower tops (crenellations) */}
        <rect x="10" y="30" width="10" height="15" fill="url(#castleBricks)" />
        <rect x="30" y="30" width="10" height="15" fill="url(#castleBricks)" />
        <rect x="160" y="30" width="10" height="15" fill="url(#castleBricks)" />
        <rect x="180" y="30" width="10" height="15" fill="url(#castleBricks)" />
        {/* Center tower */}
        <rect x="70" y="20" width="60" height="80" fill="url(#castleBricks)" />
        <rect x="70" y="8" width="20" height="18" fill="url(#castleBricks)" />
        <rect x="110" y="8" width="20" height="18" fill="url(#castleBricks)" />
        {/* Door */}
        <rect x="80" y="100" width="40" height="60" fill="#1A1A1A" rx="20" />
        {/* Windows */}
        <rect x="85" y="50" width="12" height="16" fill="#1A1A1A" />
        <rect x="103" y="50" width="12" height="16" fill="#1A1A1A" />
        {/* Flag on castle */}
        <line x1="100" y1="8" x2="100" y2="-15" stroke={MARIO_COLORS.flagGrey} strokeWidth="2" />
        <polygon points="100,-15 120,-10 100,0" fill={MARIO_COLORS.marioRed} />
      </svg>

      {/* Flag pole */}
      <div className="absolute bottom-20 left-[20%]">
        <FlagPole height={140} />
      </div>

      {/* Victory coins and stars */}
      <div className="absolute bottom-32 left-[35%] flex gap-4 items-center">
        <Coin size={28} />
        <Starman size={48} />
        <Coin size={28} />
      </div>

      {/* Mario reaching flag */}
      <div className="absolute bottom-24 left-[18%]">
        <MarioSilhouette size={50} />
      </div>

      {/* Bushes */}
      <div className="absolute bottom-20 left-[5%]"><MarioBush width={70} /></div>
      <div className="absolute bottom-20 left-[45%]"><MarioBush width={90} /></div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0">
        <GroundPattern />
      </div>
    </div>
  )
}
