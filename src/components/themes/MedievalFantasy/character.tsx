import { REALM } from './palette'

// The infernal golem, the rock creature with fel fire joints that lands in the chaos zone.

interface InfernalGolemProps {
  id: string
  isIdle?: boolean
  scale?: number
}

export function InfernalGolemSVG({ id, isIdle = false, scale = 1 }: InfernalGolemProps) {
  const suffix = isIdle ? 'Idle' : ''
  const rockId = `rock${suffix}${id}`
  const felFireId = `felFire${suffix}${id}`
  const glowId = `glow${suffix}${id}`
  const rockCrackId = `rockCrack${suffix}${id}`

  // Simplified flame using CSS animations (much faster than feTurbulence)
  const FelFlame = ({ cx, cy, size = 1, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) => {
    const w = size * 14
    const h = size * 20
    return (
      <g transform={`translate(${cx - w/2}, ${cy - h})`}>
        {/* Outer glow */}
        <ellipse
          cx={w/2} cy={h * 0.6} rx={w * 0.5} ry={h * 0.5}
          fill={REALM.chaosFelDark} opacity="0.4"
          style={isIdle ? { animation: `flameOuter ${1.8 + delay * 0.1}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.6}px` } : undefined}
        />
        {/* Middle flame */}
        <ellipse
          cx={w/2} cy={h * 0.55} rx={w * 0.35} ry={h * 0.4}
          fill={REALM.chaosFelMid} opacity="0.7"
          style={isIdle ? { animation: `flameMid ${1.5 + delay * 0.08}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.55}px` } : undefined}
        />
        {/* Inner bright core */}
        <ellipse
          cx={w/2} cy={h * 0.5} rx={w * 0.2} ry={h * 0.3}
          fill={REALM.chaosFelBright} opacity="0.85"
          style={isIdle ? { animation: `flameInner ${1.2 + delay * 0.05}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.5}px` } : undefined}
        />
      </g>
    )
  }

  // Smaller flame for joints - CSS animation based (performance optimized)
  const SmallFlame = ({ cx, cy, size = 0.6, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) => {
    const w = size * 10
    const h = size * 14
    return (
      <g transform={`translate(${cx - w/2}, ${cy - h})`}>
        {/* Outer glow */}
        <ellipse
          cx={w/2} cy={h * 0.6} rx={w * 0.45} ry={h * 0.45}
          fill={REALM.chaosFelDark} opacity="0.35"
          style={isIdle ? { animation: `flameOuter ${1.6 + delay * 0.08}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.6}px` } : undefined}
        />
        {/* Inner core */}
        <ellipse
          cx={w/2} cy={h * 0.55} rx={w * 0.25} ry={h * 0.35}
          fill={REALM.chaosFelMid} opacity="0.75"
          style={isIdle ? { animation: `flameInner ${1.3 + delay * 0.05}s ease-in-out infinite`, transformOrigin: `${w/2}px ${h * 0.55}px` } : undefined}
        />
      </g>
    )
  }

  const breathStyle: React.CSSProperties = isIdle
    ? { animation: 'infernalBreath 3s ease-in-out infinite', transformOrigin: 'center bottom' }
    : {}

  return (
    <svg
      width={160 * scale}
      height={200 * scale}
      viewBox="0 0 160 200"
      style={{ overflow: 'visible', ...breathStyle }}
    >
      <defs>
        {/* Rock gradient - dark grey with texture */}
        <linearGradient id={rockId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={REALM.stone28} />
          <stop offset="30%" stopColor={REALM.stone22} />
          <stop offset="60%" stopColor={REALM.stone15b} />
          <stop offset="100%" stopColor={REALM.stone9b} />
        </linearGradient>

        {/* Fel fire gradient */}
        <linearGradient id={felFireId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={REALM.chaosFelDark} />
          <stop offset="30%" stopColor={REALM.chaosFelMid} />
          <stop offset="60%" stopColor={REALM.chaosFelBright} />
          <stop offset="100%" stopColor={REALM.chaosFireCore} />
        </linearGradient>

        {/* Rock crack glow */}
        <linearGradient id={rockCrackId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={REALM.chaosFelDark} />
          <stop offset="50%" stopColor={REALM.chaosFelMid} />
          <stop offset="100%" stopColor={REALM.chaosFelDark} />
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Inner glow for rock cracks */}
        <filter id={`${glowId}Inner`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ============ LEFT LEG (back layer) - with idle shift ============ */}
      <g style={isIdle ? { animation: 'leftLegShift 5s ease-in-out infinite', transformOrigin: '50px 120px' } : {}}>
        {/* Thigh */}
        <polygon
          points="50,120 42,140 52,145 58,125"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="1.5"
        />
        {/* Knee fire - layered flame */}
        <SmallFlame cx={48} cy={147} size={1.6} delay={1} />
        {/* Calf - MASSIVE boulder like shoulder */}
        <polygon
          points="30,148 26,162 32,178 50,185 58,172 55,155 45,148"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="2"
        />
        {/* Calf cracks */}
        <path d="M38,155 L42,168 L38,178" stroke={REALM.chaosFelMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Foot claws - 2 large claws */}
        <polygon points="32,178 18,200 38,192" fill={REALM.chaosFelBright} />
        <polygon points="48,182 48,205 60,195" fill={REALM.chaosFelBright} />
      </g>

      {/* ============ RIGHT LEG (back layer) - with idle shift ============ */}
      <g style={isIdle ? { animation: 'rightLegShift 5s ease-in-out infinite', transformOrigin: '110px 120px' } : {}}>
        {/* Thigh */}
        <polygon
          points="110,120 102,125 108,145 118,140"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="1.5"
        />
        {/* Knee fire - layered flame */}
        <SmallFlame cx={112} cy={147} size={1.6} delay={2} />
        {/* Calf - MASSIVE boulder like shoulder */}
        <polygon
          points="102,148 105,155 102,172 110,185 128,178 134,162 130,148 115,148"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="2"
        />
        {/* Calf cracks */}
        <path d="M122,155 L118,168 L122,178" stroke={REALM.chaosFelMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Foot claws - 2 large claws */}
        <polygon points="128,178 142,200 122,192" fill={REALM.chaosFelBright} />
        <polygon points="112,182 112,205 100,195" fill={REALM.chaosFelBright} />
      </g>

      {/* ============ HIP FIRE (connecting legs to torso) ============ */}
      <FelFlame cx={55} cy={115} size={2.7} delay={3} />
      <FelFlame cx={105} cy={115} size={2.7} delay={4} />

      {/* ============ TORSO - with idle sway ============ */}
      <g style={isIdle ? { animation: 'torsoSway 7s ease-in-out infinite', transformOrigin: '80px 115px' } : {}}>
        {/* Main torso rock plates */}
        <polygon
          points="45,60 38,90 50,115 80,122 110,115 122,90 115,60 95,50 65,50"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="2"
        />
        {/* Green crack lines on torso */}
        <path d="M65,55 L60,75 L70,95 L80,115" stroke={`url(#${rockCrackId})`} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M95,55 L100,75 L90,95 L80,115" stroke={`url(#${rockCrackId})`} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M55,70 L80,80 L105,70" stroke={`url(#${rockCrackId})`} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Core fire visible through center - layered */}
        <FelFlame cx={80} cy={85} size={2.6} delay={0} />
      </g>

      {/* ============ MASSIVE LEFT SHOULDER (iconic REALM feature) ============ */}
      {/* Shoulder fire base - layered flame */}
      <FelFlame cx={35} cy={55} size={2.2} delay={5} />
      {/* Hexagonal boulder shoulder */}
      <polygon
        points="5,35 0,55 10,75 35,80 55,65 50,40 30,25 10,30"
        fill={`url(#${rockId})`}
        stroke={REALM.stone9b}
        strokeWidth="2"
      />
      {/* Shoulder cracks */}
      <path d="M15,40 L25,55 L20,70" stroke={REALM.chaosFelMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
      <path d="M40,35 L35,55 L45,70" stroke={REALM.chaosFelMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />

      {/* ============ MASSIVE RIGHT SHOULDER ============ */}
      {/* Shoulder fire base - layered flame */}
      <FelFlame cx={125} cy={55} size={2.2} delay={7} />
      {/* Hexagonal boulder shoulder */}
      <polygon
        points="155,35 160,55 150,75 125,80 105,65 110,40 130,25 150,30"
        fill={`url(#${rockId})`}
        stroke={REALM.stone9b}
        strokeWidth="2"
      />
      {/* Shoulder cracks */}
      <path d="M145,40 L135,55 L140,70" stroke={REALM.chaosFelMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />
      <path d="M120,35 L125,55 L115,70" stroke={REALM.chaosFelMid} strokeWidth="2" fill="none" filter={`url(#${glowId}Inner)`} />

      {/* ============ LEFT ARM - with idle sway ============ */}
      <g style={isIdle ? { animation: 'leftArmSway 6s ease-in-out infinite', transformOrigin: '25px 78px' } : {}}>
        {/* Upper arm */}
        <polygon
          points="20,78 12,95 22,105 32,90"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="1.5"
        />
        {/* Elbow fire - layered */}
        <SmallFlame cx={18} cy={108} size={1.6} delay={9} />
        {/* Forearm - MASSIVE boulder like shoulder */}
        <polygon
          points="0,108 -5,125 2,145 22,150 32,138 30,118 18,108"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="2"
        />
        {/* Forearm cracks */}
        <path d="M8,115 L12,130 L8,142" stroke={REALM.chaosFelMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M22,115 L18,130 L24,142" stroke={REALM.chaosFelMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Hand claws - 2 large claws */}
        <polygon points="4,145 -14,175 12,162" fill={REALM.chaosFelBright} />
        <polygon points="20,148 18,180 32,165" fill={REALM.chaosFelBright} />
      </g>

      {/* ============ RIGHT ARM - with idle sway ============ */}
      <g style={isIdle ? { animation: 'rightArmSway 6s ease-in-out infinite', transformOrigin: '135px 78px' } : {}}>
        {/* Upper arm */}
        <polygon
          points="140,78 148,90 138,105 128,95"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="1.5"
        />
        {/* Elbow fire - layered */}
        <SmallFlame cx={142} cy={108} size={1.6} delay={10} />
        {/* Forearm - MASSIVE boulder like shoulder */}
        <polygon
          points="128,108 130,118 128,138 138,150 158,145 165,125 160,108 142,108"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="2"
        />
        {/* Forearm cracks */}
        <path d="M152,115 L148,130 L152,142" stroke={REALM.chaosFelMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M138,115 L142,130 L136,142" stroke={REALM.chaosFelMid} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        {/* Hand claws - 2 large claws */}
        <polygon points="156,145 174,175 148,162" fill={REALM.chaosFelBright} />
        <polygon points="140,148 142,180 128,165" fill={REALM.chaosFelBright} />
      </g>

      {/* ============ NECK FIRE ============ */}
      <FelFlame cx={80} cy={48} size={2.4} delay={11} />

      {/* ============ HEAD (Menacing Skull) - with idle look animation ============ */}
      <g style={isIdle ? { animation: 'headLook 8s ease-in-out infinite', transformOrigin: '80px 50px' } : {}}>
        {/* Skull base shape */}
        <polygon
          points="58,48 52,35 55,18 65,8 80,5 95,8 105,18 108,35 102,48 92,50 68,50"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="2"
        />
        {/* Forehead plate */}
        <polygon
          points="60,20 65,10 80,7 95,10 100,20 95,22 65,22"
          fill={REALM.stone15b}
          stroke={REALM.stone9b}
          strokeWidth="1"
        />
        {/* Heavy brow ridge - creates menacing shadow */}
        <polygon
          points="55,28 62,22 80,20 98,22 105,28 100,32 60,32"
          fill={REALM.stone9b}
          stroke={REALM.stone4b}
          strokeWidth="1"
        />

        {/* LEFT EYE SOCKET - Dark hole with fire from within */}
        {/* Socket (dark recess) */}
        <polygon
          points="62,32 68,28 76,32 76,40 68,43 62,38"
          fill={REALM.stone4a}
          stroke={REALM.stone9b}
          strokeWidth="1"
        />
        {/* Fire glow from deep inside */}
        <ellipse cx="69" cy="36" rx="4" ry="3" fill={REALM.chaosFelDark} opacity="0.8" />
        <ellipse cx="69" cy="35" rx="2.5" ry="2" fill={REALM.chaosFelMid} opacity="0.9" style={isIdle ? { animation: 'eyeGlow 2s ease-in-out infinite' } : {}} />
        {isIdle && <ellipse cx="69" cy="35" rx="2.5" ry="2" fill={REALM.chaosFelBright} opacity="0" style={{ animation: 'eyeFlare 2s ease-in-out infinite' }} />}
        <ellipse cx="69" cy="34" rx="1.5" ry="1" fill={REALM.chaosFelBright} opacity="0.7" filter={`url(#${glowId})`} />

        {/* RIGHT EYE SOCKET - Dark hole with fire from within */}
        <polygon
          points="84,32 92,28 98,32 98,38 92,43 84,40"
          fill={REALM.stone4a}
          stroke={REALM.stone9b}
          strokeWidth="1"
        />
        <ellipse cx="91" cy="36" rx="4" ry="3" fill={REALM.chaosFelDark} opacity="0.8" />
        <ellipse cx="91" cy="35" rx="2.5" ry="2" fill={REALM.chaosFelMid} opacity="0.9" style={isIdle ? { animation: 'eyeGlow 2s ease-in-out infinite' } : {}} />
        {isIdle && <ellipse cx="91" cy="35" rx="2.5" ry="2" fill={REALM.chaosFelBright} opacity="0" style={{ animation: 'eyeFlare 2s ease-in-out infinite' }} />}
        <ellipse cx="91" cy="34" rx="1.5" ry="1" fill={REALM.chaosFelBright} opacity="0.7" filter={`url(#${glowId})`} />

        {/* NASAL CAVITY - Dark triangular hole */}
        <polygon
          points="76,38 80,34 84,38 80,46"
          fill={REALM.stone4a}
          stroke={REALM.stone9b}
          strokeWidth="1"
        />
        {/* Glow from within nasal cavity */}
        <ellipse cx="80" cy="40" rx="2" ry="3" fill={REALM.chaosFelDark} opacity="0.6" />

        {/* JAW/TEETH AREA */}
        {/* Lower jaw structure */}
        <polygon
          points="65,46 70,42 80,41 90,42 95,46 92,52 68,52"
          fill={`url(#${rockId})`}
          stroke={REALM.stone9b}
          strokeWidth="1"
        />
        {/* Teeth - dark gaps between rock teeth */}
        <line x1="72" y1="46" x2="72" y2="50" stroke={REALM.stone4a} strokeWidth="2" />
        <line x1="77" y1="45" x2="77" y2="50" stroke={REALM.stone4a} strokeWidth="2" />
        <line x1="83" y1="45" x2="83" y2="50" stroke={REALM.stone4a} strokeWidth="2" />
        <line x1="88" y1="46" x2="88" y2="50" stroke={REALM.stone4a} strokeWidth="2" />
        {/* Glow between teeth */}
        <ellipse cx="80" cy="48" rx="8" ry="2" fill={REALM.chaosFelDark} opacity="0.4" filter={`url(#${glowId}Inner)`} />

        {/* Cheekbone cracks */}
        <path d="M58,35 L65,40" stroke={REALM.chaosFelDark} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
        <path d="M102,35 L95,40" stroke={REALM.chaosFelDark} strokeWidth="1.5" fill="none" filter={`url(#${glowId}Inner)`} />
      </g>
    </svg>
  )
}
