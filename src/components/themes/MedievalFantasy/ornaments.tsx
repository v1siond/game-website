import { memo } from 'react'
import { REALM } from './palette'

// The zone ornaments set beside each section and the art dividers drawn between them.

export const RoCOrnament = memo(function RoCOrnament({ side, type }: { side: 'left' | 'right'; type: 'flag' | 'weapons' | 'shield' }) {
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    [side]: '-80px',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.25,
    pointerEvents: 'none',
  }

  if (type === 'flag') {
    return (
      <svg style={{ ...posStyle, width: '60px', height: '120px' }} viewBox="0 0 60 120">
        <line x1="15" y1="5" x2="15" y2="115" stroke={REALM.ember16c} strokeWidth="4" />
        <line x1="5" y1="20" x2="25" y2="20" stroke={REALM.ember11a} strokeWidth="3" />
        <path d="M17,8 Q45,18 42,45 Q40,60 48,75 L19,68 Q22,50 19,30 Z" fill={REALM.bloodRed} opacity="0.8" />
        <circle cx="32" cy="40" r="8" fill={REALM.goldDark} opacity="0.6" />
      </svg>
    )
  }

  if (type === 'weapons') {
    return (
      <svg style={{ ...posStyle, width: '70px', height: '80px' }} viewBox="0 0 70 80">
        {/* Broken sword */}
        <g transform="translate(15,60) rotate(-50)">
          <path d="M0,0 L3,-35 L6,-32 L4,0 Z" fill={REALM.metalLight} />
          <rect x="-3" y="0" width="10" height="4" fill={REALM.goldDark} />
          <rect x="0" y="4" width="4" height="8" fill={REALM.ember16c} />
        </g>
        {/* Broken axe */}
        <g transform="translate(45,55) rotate(40)">
          <rect x="0" y="-25" width="4" height="30" fill={REALM.ember16c} />
          <path d="M4,-25 L18,-20 L15,-10 L4,-15 Z" fill={REALM.metalLight} />
        </g>
      </svg>
    )
  }

  return (
    <svg style={{ ...posStyle, width: '60px', height: '80px' }} viewBox="0 0 60 80">
      {/* Shield with arrows */}
      <path d="M10,5 L50,15 L50,45 Q50,65 30,75 Q10,65 10,45 Z" fill={REALM.ember28a} stroke={REALM.metalMid} strokeWidth="2" />
      <circle cx="30" cy="35" r="8" fill={REALM.goldDark} opacity="0.5" />
      <line x1="20" y1="25" x2="35" y2="5" stroke={REALM.ember16c} strokeWidth="2" />
      <polygon points="35,5 40,3 37,10" fill={REALM.metalLight} />
      <line x1="38" y1="40" x2="50" y2="18" stroke={REALM.ember16c} strokeWidth="2" />
      <polygon points="50,18 55,17 51,24" fill={REALM.metalLight} />
    </svg>
  )
})

export const FTOrnament = memo(function FTOrnament({ side, type }: { side: 'left' | 'right'; type: 'shard' | 'rune' | 'frost' }) {
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    [side]: '-70px',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.2,
    pointerEvents: 'none',
  }

  if (type === 'shard') {
    return (
      <svg style={{ ...posStyle, width: '50px', height: '100px' }} viewBox="0 0 50 100">
        <polygon points="25,0 32,45 28,100 22,100 18,45" fill={REALM.frostIceMid} />
        <polygon points="25,8 29,40 25,80" fill={REALM.frostIceBright} opacity="0.5" />
        <polygon points="12,30 18,55 15,85 9,85 6,55" fill={REALM.frostIceDark} opacity="0.6" />
        <polygon points="38,35 42,58 40,82 36,82 34,58" fill={REALM.frostIceDark} opacity="0.5" />
      </svg>
    )
  }

  if (type === 'rune') {
    return (
      <svg style={{ ...posStyle, width: '45px', height: '70px' }} viewBox="0 0 45 70">
        <path d="M22,0 L42,12 L42,48 L22,60 L2,48 L2,12 Z" fill={REALM.metalDark} stroke={REALM.metalMid} strokeWidth="2" />
        <path d="M22,6 L36,15 L36,45 L22,54 L8,45 L8,15 Z" fill={REALM.bgDeep} />
        <g fill={REALM.frostIceMid} opacity="0.7">
          <path d="M22,15 L17,25 L22,32 L27,25 Z" />
          <line x1="22" y1="32" x2="22" y2="48" stroke={REALM.frostIceMid} strokeWidth="2" />
        </g>
      </svg>
    )
  }

  return (
    <svg style={{ ...posStyle, width: '60px', height: '60px' }} viewBox="0 0 60 60">
      {/* Frost pattern */}
      <circle cx="30" cy="30" r="25" fill="none" stroke={REALM.frostIceMid} strokeWidth="1" opacity="0.5" />
      <circle cx="30" cy="30" r="18" fill="none" stroke={REALM.frostIceBright} strokeWidth="1" opacity="0.4" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line key={i} x1="30" y1="30" x2={30 + 22 * Math.cos(angle * Math.PI / 180)} y2={30 + 22 * Math.sin(angle * Math.PI / 180)} stroke={REALM.frostIceMid} strokeWidth="1" opacity="0.5" />
      ))}
      <circle cx="30" cy="30" r="5" fill={REALM.frostIceBright} opacity="0.6" />
    </svg>
  )
})

// =============================================================================
// ART SECTION DIVIDERS - Decorative breaks between content
// =============================================================================

export const RoCArtDivider = memo(function RoCArtDivider({ variant = 'horde', scale = 1 }: { variant?: 'horde' | 'alliance' | 'weapons'; scale?: number }) {
  return (
    <div style={{
      position: 'relative',
      height: `${120 * scale}px`,
      margin: `${2 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Subtle glow behind center - no solid background */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '60px',
        background: `radial-gradient(ellipse, ${REALM.chaosFelDark}20 0%, transparent 70%)`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      {/* Single horizontal line - subtle metal */}
      <div style={{
        position: 'absolute',
        left: '10%',
        right: '10%',
        height: '1px',
        background: `linear-gradient(90deg,
          transparent 0%,
          ${REALM.metalDark}40 20%,
          ${REALM.metalMid}60 50%,
          ${REALM.metalDark}40 80%,
          transparent 100%
        )`,
      }} />

      {/* Center shield ornament */}
      <svg width="140" height="100" viewBox="0 0 140 100" style={{ position: 'relative', zIndex: 2 }}>
        {variant === 'horde' && (
          <g transform="translate(70,50)">
            {/* Horde shield shape - pointed bottom */}
            <path
              d="M0,-38 L32,-28 L35,5 L20,32 L0,42 L-20,32 L-35,5 L-32,-28 Z"
              fill={REALM.hordeRed}
              stroke={REALM.metalDark}
              strokeWidth="3"
            />
            {/* Shield rim highlight */}
            <path
              d="M0,-35 L28,-26 L30,3 L18,27 L0,36"
              fill="none"
              stroke={REALM.bloodRed}
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Orc skull emblem */}
            <g transform="translate(0,-2)">
              {/* Skull base */}
              <ellipse cx="0" cy="0" rx="16" ry="14" fill={REALM.ember19a} />
              {/* Jaw */}
              <path d="M-12,8 Q-8,18 0,20 Q8,18 12,8" fill={REALM.ember13a} />
              {/* Eye sockets */}
              <ellipse cx="-6" cy="-2" rx="5" ry="4" fill={REALM.ember7} />
              <ellipse cx="6" cy="-2" rx="5" ry="4" fill={REALM.ember7} />
              {/* Nose hole */}
              <ellipse cx="0" cy="6" rx="3" ry="4" fill={REALM.ember7} />
              {/* Tusks - horizontal orc style */}
              <path d="M-12,8 L-22,5 L-20,10 Z" fill={REALM.ember22} stroke={REALM.ember16a} strokeWidth="1" />
              <path d="M12,8 L22,5 L20,10 Z" fill={REALM.ember22} stroke={REALM.ember16a} strokeWidth="1" />
              {/* Brow ridge */}
              <path d="M-14,-6 Q0,-12 14,-6" fill="none" stroke={REALM.ember13a} strokeWidth="2" />
            </g>
            {/* Corner spikes */}
            <polygon points="-32,-28 -40,-25 -35,-18" fill={REALM.metalDark} />
            <polygon points="32,-28 40,-25 35,-18" fill={REALM.metalDark} />
          </g>
        )}
        {variant === 'alliance' && (
          <g transform="translate(70,50)">
            {/* Alliance shield shape - rounded bottom */}
            <path
              d="M0,-38 L30,-30 L35,-5 L30,20 L0,38 L-30,20 L-35,-5 L-30,-30 Z"
              fill={REALM.allianceBlue}
              stroke={REALM.goldDark}
              strokeWidth="3"
            />
            {/* Gold trim */}
            <path
              d="M0,-32 L24,-25 L28,-5 L24,16 L0,30"
              fill="none"
              stroke={REALM.goldMid}
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Lion head silhouette */}
            <g transform="translate(0,0)">
              {/* Mane */}
              <circle cx="0" cy="-5" r="18" fill={REALM.goldDark} opacity="0.8" />
              {/* Face */}
              <ellipse cx="0" cy="-2" rx="12" ry="10" fill={REALM.goldMid} />
              {/* Eyes */}
              <ellipse cx="-4" cy="-5" rx="2" ry="1.5" fill={REALM.night20} />
              <ellipse cx="4" cy="-5" rx="2" ry="1.5" fill={REALM.night20} />
              {/* Nose */}
              <ellipse cx="0" cy="0" rx="3" ry="2" fill={REALM.goldDark} />
              {/* Mouth */}
              <path d="M-5,4 Q0,8 5,4" fill="none" stroke={REALM.goldDark} strokeWidth="1.5" />
            </g>
          </g>
        )}
        {variant === 'weapons' && (
          <g transform="translate(70,50)">
            {/* Crossed axes - more orc-like */}
            <g transform="rotate(-35)">
              <rect x="-3" y="-35" width="6" height="55" fill={REALM.metalMid} rx="2" />
              {/* Axe head */}
              <path d="M-3,-30 Q-18,-25 -20,-15 Q-15,-5 -3,-8 Z" fill={REALM.metalLight} stroke={REALM.metalDark} strokeWidth="1" />
            </g>
            <g transform="rotate(35)">
              <rect x="-3" y="-35" width="6" height="55" fill={REALM.metalMid} rx="2" />
              {/* Axe head */}
              <path d="M3,-30 Q18,-25 20,-15 Q15,-5 3,-8 Z" fill={REALM.metalLight} stroke={REALM.metalDark} strokeWidth="1" />
            </g>
            {/* Center boss */}
            <circle cx="0" cy="0" r="10" fill={REALM.metalDark} stroke={REALM.metalMid} strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill={REALM.chaosFelMid} style={{ filter: `drop-shadow(0 0 4px ${`${REALM.moss27}80`})` }} />
          </g>
        )}
      </svg>

      {/* Side accent lines */}
      <div style={{
        position: 'absolute',
        left: '5%',
        width: '15%',
        height: '1px',
        top: '50%',
        background: `linear-gradient(90deg, transparent 0%, ${REALM.metalDark}50 100%)`,
      }} />
      <div style={{
        position: 'absolute',
        right: '5%',
        width: '15%',
        height: '1px',
        top: '50%',
        background: `linear-gradient(270deg, transparent 0%, ${REALM.metalDark}50 100%)`,
      }} />
    </div>
  )
})

export const FTArtDivider = memo(function FTArtDivider({ variant = 'crystals', scale = 1 }: { variant?: 'crystals' | 'rune' | 'throne'; scale?: number }) {
  return (
    <div style={{
      position: 'relative',
      height: `${140 * scale}px`,
      margin: `${2 * scale}rem 0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background gradient fade - blends with frozen landscape */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          transparent 0%,
          ${REALM.frostIceDark}08 20%,
          ${`${REALM.frostIceMid}60`}12 50%,
          ${REALM.frostIceDark}08 80%,
          transparent 100%
        )`,
        pointerEvents: 'none',
      }} />

      {/* Ice glow behind center */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '80px',
        background: `radial-gradient(ellipse, ${`${REALM.frostIceMid}60`}30 0%, transparent 70%)`,
        filter: 'blur(25px)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal decorative lines - icy */}
      <div style={{
        position: 'absolute',
        left: '5%',
        right: '5%',
        height: '2px',
        background: `linear-gradient(90deg,
          transparent 0%,
          ${REALM.frostIceDark}50 15%,
          ${REALM.frostIceMid}80 50%,
          ${REALM.frostIceDark}50 85%,
          transparent 100%
        )`,
        boxShadow: `0 0 10px ${`${REALM.frostIceMid}60`}`,
      }} />

      {/* Frost lines above and below */}
      <div style={{
        position: 'absolute',
        left: '15%',
        right: '15%',
        top: '35%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${REALM.frostIceDark}40 30%, ${REALM.frostIceDark}50 50%, ${REALM.frostIceDark}40 70%, transparent 100%)`,
      }} />
      <div style={{
        position: 'absolute',
        left: '15%',
        right: '15%',
        bottom: '35%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${REALM.frostIceDark}40 30%, ${REALM.frostIceDark}50 50%, ${REALM.frostIceDark}40 70%, transparent 100%)`,
      }} />

      {/* Center art piece - larger */}
      <svg width="200" height="110" viewBox="0 0 200 110" style={{ position: 'relative', zIndex: 2 }}>
        {variant === 'crystals' && (
          <>
            {/* Ice crystal cluster - more elaborate */}
            <g transform="translate(100,55)">
              {/* Center large crystal */}
              <polygon points="0,-45 10,-15 7,25 -7,25 -10,-15" fill={REALM.frostIceMid} opacity="0.9" />
              <polygon points="0,-42 6,-18 5,20" fill={REALM.frostIceBright} opacity="0.5" />
              {/* Left crystals */}
              <polygon points="-20,-32 -12,-12 -15,22 -25,22 -28,-12" fill={REALM.frostIceDark} opacity="0.8" transform="rotate(-18)" />
              <polygon points="-35,-22 -30,-5 -33,18 -40,18 -42,-5" fill={REALM.frostIceMid} opacity="0.6" transform="rotate(-30)" />
              <polygon points="-48,-12 -45,0 -47,12 -52,12 -52,0" fill={REALM.frostIceDark} opacity="0.4" transform="rotate(-40)" />
              {/* Right crystals */}
              <polygon points="20,-32 28,-12 25,22 15,22 12,-12" fill={REALM.frostIceDark} opacity="0.8" transform="rotate(18)" />
              <polygon points="35,-22 40,-5 37,18 30,18 28,-5" fill={REALM.frostIceMid} opacity="0.6" transform="rotate(30)" />
              <polygon points="48,-12 52,0 50,12 45,12 45,0" fill={REALM.frostIceDark} opacity="0.4" transform="rotate(40)" />
              {/* Inner glow */}
              <ellipse cx="0" cy="0" rx="12" ry="20" fill={REALM.frostIceBright} opacity="0.15" style={{ filter: `blur(4px)` }} />
            </g>
          </>
        )}
        {variant === 'rune' && (
          <>
            {/* Frost rune */}
            <g transform="translate(70,35)">
              <circle cx="0" cy="0" r="26" fill="none" stroke={REALM.frostIceDark} strokeWidth="2" opacity="0.5" />
              <circle cx="0" cy="0" r="20" fill="none" stroke={REALM.frostIceMid} strokeWidth="1" opacity="0.4" />
              {/* Hexagonal frost pattern */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <g key={i}>
                  <line x1={Math.cos(angle * Math.PI / 180) * 8} y1={Math.sin(angle * Math.PI / 180) * 8} x2={Math.cos(angle * Math.PI / 180) * 24} y2={Math.sin(angle * Math.PI / 180) * 24} stroke={REALM.frostIceBright} strokeWidth="1.5" opacity="0.6" />
                  <circle cx={Math.cos(angle * Math.PI / 180) * 24} cy={Math.sin(angle * Math.PI / 180) * 24} r="2" fill={REALM.frostIceBright} opacity="0.5" />
                </g>
              ))}
              <circle cx="0" cy="0" r="6" fill={REALM.frostIceBright} opacity="0.3" />
            </g>
          </>
        )}
        {variant === 'throne' && (
          <>
            {/* Ice throne silhouette hint */}
            <g transform="translate(70,55)">
              {/* Throne base */}
              <polygon points="-35,0 -30,-15 -15,-12 0,-35 15,-12 30,-15 35,0" fill={REALM.frostIceDark} opacity="0.6" />
              <polygon points="-25,-5 -20,-18 -8,-15 0,-40 8,-15 20,-18 25,-5" fill={REALM.frostIceMid} opacity="0.4" />
              {/* Central spire glow */}
              <polygon points="-5,-20 0,-45 5,-20" fill={REALM.frostIceBright} opacity="0.3" />
            </g>
          </>
        )}
        {/* Side ice shards */}
        <polygon points="8,35 12,25 14,35 10,38" fill={REALM.frostIceMid} opacity="0.4" />
        <polygon points="126,35 130,28 132,35 128,37" fill={REALM.frostIceMid} opacity="0.4" />
      </svg>

      {/* Frost glow */}
      <div style={{
        position: 'absolute',
        inset: '20%',
        background: `radial-gradient(ellipse at center, ${`${REALM.frostIceMid}60`} 0%, transparent 70%)`,
        opacity: 0.25,
        filter: 'blur(15px)',
        pointerEvents: 'none',
      }} />

      {/* Floating ice particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`ice-${i}`}
          style={{
            position: 'absolute',
            left: `${8 + (i % 4) * 22 + (i > 3 ? 3 : 0)}%`,
            top: `${15 + (i % 2) * 50}%`,
            width: i % 2 === 0 ? '3px' : '5px',
            height: i % 2 === 0 ? '3px' : '5px',
            background: REALM.frostIceBright,
            boxShadow: `0 0 6px ${`${REALM.frostIceMid}60`}`,
            opacity: 0.3 + (i % 4) * 0.1,
            borderRadius: '1px',
            transform: `rotate(${i * 15}deg)`,
            animation: `felPulse ${2.5 + i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
})
