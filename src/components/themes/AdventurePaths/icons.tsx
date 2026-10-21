import { MARIO_COLORS } from './palette'

// Adventure Paths' small sprites: blocks, pipes, coins, power ups, the flag, clouds, bushes and ground.

// === QUESTION BLOCK - Iconic "?" Block with bounce animation ===
export function QuestionBlock({ size = 48, hit = false }: { size?: number; hit?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label={hit ? "Empty Block" : "Question Block"}
      role="img"
      className={hit ? '' : 'question-bounce'}
    >
      <defs>
        <linearGradient id="questionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={MARIO_COLORS.questionYellow} />
          <stop offset="50%" stopColor={MARIO_COLORS.questionOrange} />
          <stop offset="100%" stopColor={MARIO_COLORS.questionDark} />
        </linearGradient>
      </defs>
      {/* Block body */}
      <rect x="2" y="2" width="44" height="44" rx="2" fill={hit ? MARIO_COLORS.brickDark : 'url(#questionGrad)'} stroke={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} strokeWidth="3" />
      {/* 3D edge - top/left highlight */}
      <path d="M4,4 L44,4 L44,6 L6,6 L6,44 L4,44 Z" fill={hit ? MARIO_COLORS.brickRed : '#FFEC80'} opacity="0.6" />
      {/* 3D edge - bottom/right shadow */}
      <path d="M44,6 L44,44 L42,44 L42,6 Z" fill="#000" opacity="0.3" />
      <path d="M6,44 L44,44 L44,42 L6,42 Z" fill="#000" opacity="0.3" />
      {/* Corner rivets */}
      <circle cx="10" cy="10" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      <circle cx="38" cy="10" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      <circle cx="10" cy="38" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      <circle cx="38" cy="38" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      {/* Question mark or empty */}
      {!hit ? (
        <>
          <text x="24" y="32" textAnchor="middle" fontSize="22" fontWeight="bold" fill={MARIO_COLORS.groundBrown} fontFamily="Arial Black, sans-serif">?</text>
          <text x="24" y="31" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#FFF" fontFamily="Arial Black, sans-serif">?</text>
        </>
      ) : (
        <rect x="18" y="20" width="12" height="8" fill={MARIO_COLORS.groundDarkest} opacity="0.5" />
      )}
    </svg>
  )
}

// === BRICK BLOCK - Breakable brick pattern ===
export function BrickBlock({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Brick Block"
      role="img"
    >
      <rect width="48" height="48" fill={MARIO_COLORS.brickRed} />
      {/* Brick pattern - mortar lines */}
      <rect x="0" y="0" width="22" height="14" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="24" y="0" width="24" height="14" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="0" y="16" width="48" height="14" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="0" y="32" width="22" height="16" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="24" y="32" width="24" height="16" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      {/* Highlight on bricks */}
      <rect x="2" y="2" width="18" height="3" fill="#D08040" opacity="0.5" />
      <rect x="26" y="2" width="20" height="3" fill="#D08040" opacity="0.5" />
      <rect x="2" y="18" width="44" height="3" fill="#D08040" opacity="0.5" />
      <rect x="2" y="34" width="18" height="3" fill="#D08040" opacity="0.5" />
      <rect x="26" y="34" width="20" height="3" fill="#D08040" opacity="0.5" />
    </svg>
  )
}

// === GREEN PIPE - Classic warp pipe with rim ===
export function GreenPipe({ height = 80, width = 64 }: { height?: number; width?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 64 ${height}`}
      aria-label="Warp Pipe"
      role="img"
    >
      <defs>
        <linearGradient id="pipeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MARIO_COLORS.pipeDark} />
          <stop offset="20%" stopColor={MARIO_COLORS.pipeMid} />
          <stop offset="50%" stopColor={MARIO_COLORS.pipeGreen} />
          <stop offset="80%" stopColor={MARIO_COLORS.pipeMid} />
          <stop offset="100%" stopColor={MARIO_COLORS.pipeDark} />
        </linearGradient>
        <linearGradient id="pipeLipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MARIO_COLORS.pipeDark} />
          <stop offset="15%" stopColor={MARIO_COLORS.pipeGreen} />
          <stop offset="50%" stopColor="#7BC847" />
          <stop offset="85%" stopColor={MARIO_COLORS.pipeGreen} />
          <stop offset="100%" stopColor={MARIO_COLORS.pipeDark} />
        </linearGradient>
      </defs>
      {/* Pipe body */}
      <rect x="8" y="20" width="48" height={height - 20} fill="url(#pipeBodyGrad)" />
      {/* Pipe rim/lip */}
      <rect x="0" y="0" width="64" height="24" rx="2" fill="url(#pipeLipGrad)" />
      {/* Rim top highlight */}
      <rect x="4" y="2" width="56" height="4" rx="1" fill="#8FD860" opacity="0.6" />
      {/* Inner darkness */}
      <ellipse cx="32" cy="10" rx="20" ry="6" fill={MARIO_COLORS.pipeDark} />
      {/* Body vertical lines */}
      <line x1="20" y1="24" x2="20" y2={height} stroke={MARIO_COLORS.pipeDark} strokeWidth="1" opacity="0.3" />
      <line x1="44" y1="24" x2="44" y2={height} stroke={MARIO_COLORS.pipeDark} strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

// === SPINNING COIN - Golden coin with spin animation ===
export function Coin({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Gold Coin"
      role="img"
      className="coin-spin"
    >
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEC80" />
          <stop offset="30%" stopColor={MARIO_COLORS.coinGold} />
          <stop offset="70%" stopColor={MARIO_COLORS.coinOrange} />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
      </defs>
      <ellipse cx="12" cy="12" rx="10" ry="10" fill="url(#coinGrad)" stroke="#CC9900" strokeWidth="1.5" />
      {/* Inner circle */}
      <ellipse cx="12" cy="12" rx="7" ry="7" fill="none" stroke="#CC9900" strokeWidth="1" opacity="0.5" />
      {/* Shine */}
      <ellipse cx="8" cy="8" rx="3" ry="4" fill="#FFF" opacity="0.5" transform="rotate(-30 8 8)" />
    </svg>
  )
}

// === MARIO SILHOUETTE - Iconic cap and mustache ===
export function MarioSilhouette({ size = 60, color = MARIO_COLORS.marioRed }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      aria-label="Mario"
      role="img"
    >
      {/* Cap */}
      <ellipse cx="30" cy="18" rx="22" ry="12" fill={color} />
      <rect x="8" y="14" width="44" height="8" fill={color} />
      {/* Cap bill */}
      <ellipse cx="42" cy="22" rx="12" ry="4" fill={color} />
      {/* Face circle */}
      <circle cx="30" cy="35" r="16" fill="#FFD8B0" />
      {/* Mustache */}
      <path d="M18,38 Q22,42 30,40 Q38,42 42,38 Q40,46 30,44 Q20,46 18,38" fill="#3D2314" />
      {/* Nose */}
      <ellipse cx="30" cy="36" rx="6" ry="5" fill="#FFD8B0" stroke="#E8C090" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="24" cy="32" rx="3" ry="4" fill="#000" />
      <ellipse cx="36" cy="32" rx="3" ry="4" fill="#000" />
      <circle cx="23" cy="31" r="1" fill="#FFF" />
      <circle cx="35" cy="31" r="1" fill="#FFF" />
      {/* Cap "M" emblem */}
      <circle cx="30" cy="12" r="6" fill="#FFF" />
      <text x="30" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill={color} fontFamily="Arial Black">M</text>
    </svg>
  )
}

// === SUPER MUSHROOM - Red cap with white dots ===
export function SuperMushroom({ size = 40, is1UP = false }: { size?: number; is1UP?: boolean }) {
  const capColor = is1UP ? MARIO_COLORS.luigiGreen : MARIO_COLORS.marioRed
  const capDark = is1UP ? MARIO_COLORS.pipeMid : MARIO_COLORS.marioDarkRed

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-label={is1UP ? "1-UP Mushroom" : "Super Mushroom"}
      role="img"
    >
      {/* Cap */}
      <ellipse cx="20" cy="14" rx="18" ry="12" fill={capColor} stroke={capDark} strokeWidth="2" />
      {/* White spots */}
      <ellipse cx="10" cy="10" rx="5" ry="4" fill="#FFF" />
      <ellipse cx="28" cy="12" rx="4" ry="3" fill="#FFF" />
      <ellipse cx="20" cy="6" rx="3" ry="2" fill="#FFF" />
      {/* Stem */}
      <path d="M10,16 Q8,28 12,36 L28,36 Q32,28 30,16" fill="#F5E6C8" stroke="#D4C4A8" strokeWidth="1" />
      {/* Face */}
      <ellipse cx="15" cy="26" rx="2.5" ry="3.5" fill="#000" />
      <ellipse cx="25" cy="26" rx="2.5" ry="3.5" fill="#000" />
      <circle cx="14" cy="25" r="1" fill="#FFF" />
      <circle cx="24" cy="25" r="1" fill="#FFF" />
    </svg>
  )
}

// === FIRE FLOWER - White and red flower ===
export function FireFlower({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-label="Fire Flower"
      role="img"
    >
      {/* Stem */}
      <rect x="18" y="22" width="4" height="16" fill={MARIO_COLORS.pipeGreen} />
      {/* Leaves */}
      <ellipse cx="12" cy="32" rx="6" ry="3" fill={MARIO_COLORS.pipeGreen} transform="rotate(-20 12 32)" />
      <ellipse cx="28" cy="32" rx="6" ry="3" fill={MARIO_COLORS.pipeGreen} transform="rotate(20 28 32)" />
      {/* Petals - orange/red */}
      <circle cx="20" cy="8" r="6" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="10" cy="14" r="6" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="30" cy="14" r="6" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="12" cy="22" r="5" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="28" cy="22" r="5" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      {/* Center - white face */}
      <circle cx="20" cy="15" r="6" fill="#FFF" stroke="#DDD" strokeWidth="1" />
      <ellipse cx="18" cy="14" rx="1.5" ry="2" fill="#000" />
      <ellipse cx="22" cy="14" rx="1.5" ry="2" fill="#000" />
    </svg>
  )
}

// === STARMAN - Five-pointed star with eyes ===
export function Starman({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-label="Starman"
      role="img"
      className="starman-flash"
    >
      <defs>
        <linearGradient id="starmanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFF80" />
          <stop offset="50%" stopColor={MARIO_COLORS.coinGold} />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
      </defs>
      {/* Five-pointed star */}
      <polygon
        points="22,2 27,16 42,16 30,26 35,40 22,32 9,40 14,26 2,16 17,16"
        fill="url(#starmanGrad)"
        stroke="#CC9900"
        strokeWidth="2"
      />
      {/* Eyes */}
      <ellipse cx="17" cy="20" rx="3" ry="4" fill="#000" />
      <ellipse cx="27" cy="20" rx="3" ry="4" fill="#000" />
      <circle cx="16" cy="19" r="1" fill="#FFF" />
      <circle cx="26" cy="19" r="1" fill="#FFF" />
      {/* Smile */}
      <path d="M17,26 Q22,30 27,26" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// === FLAG POLE with Flag ===
export function FlagPole({ height = 160 }: { height?: number }) {
  return (
    <svg
      width={40}
      height={height}
      viewBox={`0 0 40 ${height}`}
      aria-label="Goal Flag Pole"
      role="img"
    >
      {/* Pole */}
      <rect x="18" y="0" width="4" height={height} fill={MARIO_COLORS.flagGrey} />
      <rect x="19" y="0" width="1" height={height} fill={MARIO_COLORS.flagLight} />
      {/* Top ball */}
      <circle cx="20" cy="6" r="6" fill={MARIO_COLORS.coinGold} stroke="#CC9900" strokeWidth="1" />
      {/* Flag */}
      <polygon
        points={`22,10 40,18 40,34 22,26`}
        fill={MARIO_COLORS.pipeGreen}
        stroke={MARIO_COLORS.pipeDark}
        strokeWidth="1"
      />
      {/* Base */}
      <rect x="10" y={height - 16} width="20" height="16" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="2" />
    </svg>
  )
}

// === CLOUD (same shape as bush, different colors) ===
export function MarioCloud({ width = 120 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 120 60"
      aria-label="Cloud"
      role="img"
      className="cloud-float"
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={MARIO_COLORS.cloudWhite} />
          <stop offset="100%" stopColor={MARIO_COLORS.cloudGrey} />
        </linearGradient>
      </defs>
      {/* Triple-bump shape */}
      <ellipse cx="60" cy="40" rx="55" ry="18" fill="url(#cloudGrad)" />
      <ellipse cx="35" cy="30" rx="30" ry="22" fill="url(#cloudGrad)" />
      <ellipse cx="85" cy="30" rx="30" ry="22" fill="url(#cloudGrad)" />
      <ellipse cx="60" cy="22" rx="25" ry="18" fill={MARIO_COLORS.cloudWhite} />
      {/* Eyes and smile (clouds have faces in Mario!) */}
      <ellipse cx="45" cy="32" rx="4" ry="5" fill="#000" />
      <ellipse cx="75" cy="32" rx="4" ry="5" fill="#000" />
      <circle cx="43" cy="30" r="1.5" fill="#FFF" />
      <circle cx="73" cy="30" r="1.5" fill="#FFF" />
      <path d="M50,42 Q60,48 70,42" fill="none" stroke="#AAA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// === BUSH (same shape as cloud, green colors) ===
export function MarioBush({ width = 100 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 100 50"
      aria-label="Bush"
      role="img"
    >
      <defs>
        <linearGradient id="bushGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={MARIO_COLORS.bushLight} />
          <stop offset="100%" stopColor={MARIO_COLORS.bushGreen} />
        </linearGradient>
      </defs>
      {/* Triple-bump shape */}
      <ellipse cx="50" cy="38" rx="48" ry="12" fill="url(#bushGrad)" />
      <ellipse cx="28" cy="28" rx="26" ry="20" fill="url(#bushGrad)" />
      <ellipse cx="72" cy="28" rx="26" ry="20" fill="url(#bushGrad)" />
      <ellipse cx="50" cy="20" rx="22" ry="16" fill={MARIO_COLORS.bushLight} />
    </svg>
  )
}

// === GROUND/FLOOR PATTERN ===
export function GroundPattern() {
  return (
    <svg className="w-full h-20" viewBox="0 0 800 80" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="groundBricks" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
          <rect width="32" height="16" fill={MARIO_COLORS.groundBrown} />
          <rect x="0" y="0" width="15" height="7" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="16" y="0" width="16" height="7" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="8" y="8" width="16" height="8" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="0" y="8" width="8" height="8" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="24" y="8" width="8" height="8" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
        </pattern>
      </defs>
      {/* Top grass strip */}
      <rect x="0" y="0" width="800" height="8" fill={MARIO_COLORS.pipeGreen} />
      {/* Ground bricks */}
      <rect x="0" y="8" width="800" height="72" fill="url(#groundBricks)" />
    </svg>
  )
}
