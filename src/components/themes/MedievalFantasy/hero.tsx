import type { CSSProperties } from 'react'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { REALM } from './palette'

// Him as the death knight king of the frost zone: the spiked pauldrons, the skull chest plate, the fur trimmed
// cape and the runeblade held point down. His skin, hair, beard and eyes come from HERO_IDENTITY; the armour,
// the blade and the frost come from the world's palette. The cape sways on capeWave and the frost breath on
// mf-drift, both declared by the frost zone because the horse's mane, tail and smoke use them too.

export function FrostHero() {
  return (
    <>
      <svg
        style={{
          position: 'absolute',
          left: '11%',
          bottom: '3%',
          width: '120px',
          height: '190px',
          filter: `drop-shadow(0 0 18px ${REALM.frostIceMid}50)`,
        }}
        viewBox="0 0 200 320"
      >
        <defs>
          <linearGradient id="frostmourneGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={REALM.frostIceDark} />
            <stop offset="50%" stopColor={REALM.frostIceMid} />
            <stop offset="100%" stopColor={REALM.frostIceBright} />
          </linearGradient>
          <linearGradient id="lichArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={REALM.night22} />
            <stop offset="50%" stopColor={REALM.night15a} />
            <stop offset="100%" stopColor={REALM.night9c} />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={REALM.earth56a} />
            <stop offset="50%" stopColor={REALM.earth48} />
            <stop offset="100%" stopColor={REALM.earth36} />
          </linearGradient>
          <linearGradient id="heroSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={HERO_IDENTITY.skin} />
            <stop offset="100%" stopColor={HERO_IDENTITY.skinShade} />
          </linearGradient>
          <filter id="frostGlow">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cape - dark with fur trim, wave animation */}
        <g style={{ animation: 'capeWave 3s ease-in-out infinite', transformOrigin: '100px 120px' }}>
          <path d="M55,95 Q20,150 12,240 L8,310 L192,310 L188,240 Q180,150 145,95" fill={REALM.night6} opacity="0.9" />
          <path d="M60,100 Q28,155 22,235 L18,305 L182,305 L178,235 Q172,155 140,100" fill={REALM.night7a} />
          {/* Fur trim at shoulders */}
          <ellipse cx="55" cy="98" rx="12" ry="6" fill={REALM.ember23} />
          <ellipse cx="145" cy="98" rx="12" ry="6" fill={REALM.ember23} />
        </g>

        {/* === MASSIVE LEGS - Strong warrior === */}
        <path d="M60,215 L50,265 L45,305 L75,310 L82,272 L88,220" fill="url(#lichArmor)" />
        <path d="M112,215 L118,272 L125,310 L155,305 L150,265 L140,220" fill="url(#lichArmor)" />
        {/* Gold trim on massive legs */}
        <path d="M50,265 L82,270 M150,265 L118,270" stroke="url(#goldTrim)" strokeWidth="2.5" fill="none" />
        {/* Skull knee guards - positioned for bigger legs */}
        <ellipse cx="70" cy="232" rx="14" ry="10" fill={REALM.night15a} />
        <circle cx="70" cy="230" r="5" fill={REALM.night9c} />
        <circle cx="66" cy="227" r="2" fill={REALM.frostIceMid} opacity="0.4" />
        <circle cx="74" cy="227" r="2" fill={REALM.frostIceMid} opacity="0.4" />
        <ellipse cx="130" cy="232" rx="14" ry="10" fill={REALM.night15a} />
        <circle cx="130" cy="230" r="5" fill={REALM.night9c} />
        <circle cx="126" cy="227" r="2" fill={REALM.frostIceMid} opacity="0.4" />
        <circle cx="134" cy="227" r="2" fill={REALM.frostIceMid} opacity="0.4" />
        {/* Massive boots */}
        <ellipse cx="60" cy="308" rx="18" ry="7" fill={REALM.stone7} />
        <ellipse cx="140" cy="308" rx="18" ry="7" fill={REALM.stone7} />
        <path d="M45,305 L75,305 M125,305 L155,305" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />

        {/* === TORSO with skull chest plate === */}
        <g style={{ animation: 'breathe 4s ease-in-out infinite', transformOrigin: '100px 160px' }}>
          {/* Main chest plate */}
          <path d="M60,92 L68,75 L100,68 L132,75 L140,92 L145,160 L135,200 L100,210 L65,200 L55,160 Z" fill="url(#lichArmor)" />
          {/* Gold trim on chest */}
          <path d="M60,92 L68,75 L100,68 L132,75 L140,92" stroke="url(#goldTrim)" strokeWidth="2.5" fill="none" />
          <path d="M65,200 L100,210 L135,200" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
          {/* V-shaped chest detail */}
          <path d="M75,95 L100,85 L125,95 L125,145 L100,160 L75,145 Z" fill={REALM.night12a} />
          <path d="M75,95 L100,85 L125,95" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />
          {/* SKULL on chest */}
          <ellipse cx="100" cy="125" rx="15" ry="12" fill={REALM.night22} />
          <ellipse cx="100" cy="123" rx="12" ry="10" fill={REALM.night15a} />
          <ellipse cx="94" cy="120" rx="4" ry="3" fill={REALM.night9c} />
          <ellipse cx="106" cy="120" rx="4" ry="3" fill={REALM.night9c} />
          <ellipse cx="94" cy="120" rx="2" ry="1.5" fill={REALM.frostIceMid} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="106" cy="120" rx="2" ry="1.5" fill={REALM.frostIceMid} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <path d="M100,126 L97,132 L103,132 Z" fill={REALM.night9c} />
          {/* Belt with skull buckle */}
          <rect x="60" y="175" width="80" height="15" fill={REALM.night15a} />
          <path d="M60,175 L140,175 M60,190 L140,190" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />
          <ellipse cx="100" cy="182" rx="10" ry="7" fill={REALM.night22} />
          <circle cx="96" cy="180" rx="2" fill={REALM.night9c} />
          <circle cx="104" cy="180" rx="2" fill={REALM.night9c} />
        </g>

        {/* === MASSIVE SHOULDER PAULDRONS with spikes === */}
        {/* Left pauldron */}
        <g>
          <ellipse cx="45" cy="88" rx="28" ry="18" fill="url(#lichArmor)" />
          <ellipse cx="45" cy="88" rx="24" ry="15" fill={REALM.night15a} />
          {/* Gold trim */}
          <ellipse cx="45" cy="88" rx="28" ry="18" fill="none" stroke="url(#goldTrim)" strokeWidth="2" />
          {/* Spikes */}
          <polygon points="25,82 15,55 30,78" fill={REALM.night22} />
          <polygon points="35,78 22,48 38,74" fill={REALM.night15a} />
          <polygon points="45,75 38,42 50,72" fill={REALM.night22} />
          <polygon points="55,78 58,48 52,74" fill={REALM.night15a} />
          {/* Gold tips on spikes */}
          <circle cx="15" cy="57" r="3" fill="url(#goldTrim)" />
          <circle cx="22" cy="50" r="2.5" fill="url(#goldTrim)" />
          <circle cx="38" cy="44" r="3" fill="url(#goldTrim)" />
          <circle cx="58" cy="50" r="2.5" fill="url(#goldTrim)" />
          {/* Skull ornament */}
          <circle cx="45" cy="92" r="6" fill={REALM.night9c} />
          <circle cx="42" cy="90" r="1.5" fill={REALM.frostIceMid} opacity="0.4" />
          <circle cx="48" cy="90" r="1.5" fill={REALM.frostIceMid} opacity="0.4" />
        </g>
        {/* Right pauldron */}
        <g>
          <ellipse cx="155" cy="88" rx="28" ry="18" fill="url(#lichArmor)" />
          <ellipse cx="155" cy="88" rx="24" ry="15" fill={REALM.night15a} />
          <ellipse cx="155" cy="88" rx="28" ry="18" fill="none" stroke="url(#goldTrim)" strokeWidth="2" />
          <polygon points="145,78 142,48 148,74" fill={REALM.night15a} />
          <polygon points="155,75 162,42 150,72" fill={REALM.night22} />
          <polygon points="165,78 178,48 162,74" fill={REALM.night15a} />
          <polygon points="175,82 185,55 170,78" fill={REALM.night22} />
          <circle cx="142" cy="50" r="2.5" fill="url(#goldTrim)" />
          <circle cx="162" cy="44" r="3" fill="url(#goldTrim)" />
          <circle cx="178" cy="50" r="2.5" fill="url(#goldTrim)" />
          <circle cx="185" cy="57" r="3" fill="url(#goldTrim)" />
          <circle cx="155" cy="92" r="6" fill={REALM.night9c} />
          <circle cx="152" cy="90" r="1.5" fill={REALM.frostIceMid} opacity="0.4" />
          <circle cx="158" cy="90" r="1.5" fill={REALM.frostIceMid} opacity="0.4" />
        </g>

        {/* === MASSIVE ARMS - Strong warrior, with gauntlets === */}
        {/* Left arm - raised, no weapon */}
        <path d="M32,100 L15,138 L8,180 L32,185 L42,145 L52,105" fill="url(#lichArmor)" />
        <path d="M15,138 L42,143" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
        <polygon points="8,180 0,168 18,175" fill={REALM.night15a} />
        <polygon points="15,178 5,165 22,172" fill={REALM.night15a} />

        {/* Right arm - HOLDING FROSTMOURNE */}
        <path d="M168,100 L185,138 L192,175 L168,180 L158,142 L148,105" fill="url(#lichArmor)" />
        <path d="M185,138 L158,143" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
        {/* Gauntlet holding sword handle */}
        <ellipse cx="185" cy="178" rx="12" ry="10" fill="url(#lichArmor)" />
        <ellipse cx="185" cy="178" rx="12" ry="10" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />

        {/* === FROSTMOURNE - IN HIS RIGHT HAND === */}
        <g transform="translate(185, 175) rotate(-5)">
          {/* Blade glow */}
          <ellipse cx="0" cy="90" rx="18" ry="95" fill={REALM.frostIceBright} opacity="0.15" filter="url(#frostGlow)">
            <animate attributeName="opacity" values="0.1;0.22;0.1" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Blade pointing down */}
          <path d="M0,15 L8,25 L11,70 L10,140 L7,190 L0,210 L-7,190 L-10,140 L-11,70 L-8,25 Z" fill="url(#frostmourneGlow)" />
          <path d="M0,25 L4,35 L4,135 L0,160 L-4,135 L-4,35 Z" fill={REALM.frostIceBright} opacity="0.5" />
          {/* Blade serrations */}
          <path d="M10,60 L16,55 L12,70" fill="url(#frostmourneGlow)" />
          <path d="M-10,60 L-16,55 L-12,70" fill="url(#frostmourneGlow)" />

          {/* Runes - pulsing */}
          <path d="M0,50 L3,60 L0,70 L-3,60 Z" fill={REALM.frostIceBright}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M0,95 L4,108 L0,121 L-4,108 Z" fill={REALM.frostIceBright}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
          </path>
          <path d="M0,145 L3,156 L0,167 L-3,156 Z" fill={REALM.frostIceBright}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.1s" repeatCount="indefinite" />
          </path>

          {/* Crossguard - skull motif - at hand level */}
          <path d="M-30,8 L0,15 L30,8 L24,20 L0,25 L-24,20 Z" fill={REALM.night15a} />
          <path d="M-30,8 L0,15 L30,8" stroke="url(#goldTrim)" strokeWidth="2" fill="none" />
          <ellipse cx="0" cy="12" rx="8" ry="6" fill={REALM.night9c} />
          <circle cx="-4" cy="10" r="2" fill={REALM.frostIceMid} opacity="0.6" />
          <circle cx="4" cy="10" r="2" fill={REALM.frostIceMid} opacity="0.6" />

          {/* Handle - in gauntlet */}
          <rect x="-5" y="-8" width="10" height="20" fill={REALM.night7a} rx="2" />
          <path d="M-5,-8 L5,-8 M-5,12 L5,12" stroke="url(#goldTrim)" strokeWidth="1" />
          {/* Pommel */}
          <circle cx="0" cy="-14" r="7" fill={REALM.night15a} />
          <circle cx="0" cy="-14" r="7" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />
          <circle cx="0" cy="-14" r="4" fill={REALM.night9c} />
        </g>

        {/* Neck gorget with gold trim */}
        <ellipse cx="100" cy="68" rx="18" ry="7" fill={REALM.night15a} />
        <ellipse cx="100" cy="68" rx="18" ry="7" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />

        {/* === ALEXANDER'S HEAD - Based on UXWing beard-man-face reference === */}
        {/* Face skin base - oval head shape */}
        <ellipse cx="100" cy="45" rx="24" ry="28" fill="url(#heroSkin)" />

        {/* HAIR - on top of head */}
        <path
          d="M76,32 Q76,12 100,8 Q124,12 124,32
             Q115,20 100,18 Q85,20 76,32 Z"
          fill={HERO_IDENTITY.hair}
        />

        {/* BEARD - full coverage from cheekbones down, with face opening */}
        {/* Outer beard shape */}
        <path
          d="M76,42
             C74,55 74,70 80,85
             Q90,105 100,108
             Q110,105 120,85
             C126,70 126,55 124,42
             Q118,48 112,50
             L108,52 Q100,54 92,52 L88,50
             Q82,48 76,42 Z"
          fill={HERO_IDENTITY.beard}
        />

        {/* EYEBROWS - thick, dark */}
        <path d="M84,34 Q90,31 96,34" stroke={HERO_IDENTITY.hair} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M104,34 Q110,31 116,34" stroke={HERO_IDENTITY.hair} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* EYES */}
        <ellipse cx="90" cy="40" rx="5" ry="4" fill={HERO_IDENTITY.eyes} />
        <ellipse cx="110" cy="40" rx="5" ry="4" fill={HERO_IDENTITY.eyes} />
        <ellipse cx="90" cy="40" rx="6" ry="5" fill={REALM.frostIceBright} opacity="0.2" filter="url(#frostGlow)">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="110" cy="40" rx="6" ry="5" fill={REALM.frostIceBright} opacity="0.2" filter="url(#frostGlow)">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* NOSE */}
        <path d="M100,46 L96,56 L104,56 Z" fill={HERO_IDENTITY.skinShade} />

        {/* MUSTACHE - handlebar style */}
        <path
          d="M86,60 Q90,58 100,59 Q110,58 114,60
             Q112,64 108,65 Q100,66 92,65 Q88,64 86,60 Z"
          fill={HERO_IDENTITY.beard}
        />

        {/* MOUTH - small opening in beard */}
        <ellipse cx="100" cy="70" rx="6" ry="3" fill="url(#heroSkin)" />
        <path d="M96,70 Q100,68 104,70" stroke={REALM.ember21} strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Beard texture lines */}
        <path d="M84,72 Q90,88 98,102" stroke={REALM.stone10} strokeWidth="1.5" fill="none" opacity="0.25" />
        <path d="M100,74 L100,104" stroke={REALM.stone10} strokeWidth="1.5" fill="none" opacity="0.25" />
        <path d="M116,72 Q110,88 102,102" stroke={REALM.stone10} strokeWidth="1.5" fill="none" opacity="0.25" />

        {/* Frost breath */}
        <ellipse cx="110" cy="72" rx="12" ry="6" fill={REALM.frostFrostWhite} opacity="0.15" filter="url(#frostGlow)" className="mf-drift" style={{ '--drift-dur': '3s', '--drift-sx': 1.6667 } as CSSProperties}>
          <animate attributeName="opacity" values="0.1;0.22;0.1" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Ground frost */}
        <ellipse cx="100" cy="315" rx="90" ry="12" fill={REALM.frostIceMid} opacity="0.1" filter="url(#frostGlow)" />
      </svg>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }
      `}</style>
    </>
  )
}
