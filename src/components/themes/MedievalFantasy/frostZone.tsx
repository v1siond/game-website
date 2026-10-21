'use client'

import { memo, useMemo, type CSSProperties } from 'react'
import { FrostHero } from './hero'
import { REALM } from './palette'

// The frost zone backdrop: snow layers, frost wind and the ice field.

export const FrostAtmosphere = memo(function FrostAtmosphere() {
  // Snow layers - reduced counts for performance
  const snowLayers = useMemo(() => ({
    // Far layer - small, slow
    far: Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -15,
      duration: 10 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    })),
    // Mid layer - medium size
    mid: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -10,
      duration: 6 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    })),
    // Near layer - large, fast
    near: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      delay: Math.random() * -5,
      duration: 3 + Math.random() * 2,
      size: 4 + Math.random() * 4,
    })),
  }), [])

  // Wind/frost streaks - reduced for performance
  const windStreaks = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      y: i * 12.5,
      delay: Math.random() * -8,
      duration: 1.5 + Math.random() * 1,
      length: 80 + Math.random() * 120,
      thickness: 1 + Math.random(),
    })),
    []
  )

  return (
    <>
      {/* Deep cold sky with depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          var(--realm-stone1) 0%,
          var(--realm-stone2) 10%,
          var(--realm-night7) 30%,
          var(--realm-night11) 50%,
          var(--realm-night8) 70%,
          var(--realm-night4) 90%,
          var(--realm-stone1a) 100%)`
      }} />

      {/* === FROZEN THRONE BACKGROUND - Animated Painting === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 1000 850" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Gradients for depth and ice effects */}
          <linearGradient id="ftGroundFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={REALM.night7} stopOpacity="0" />
            <stop offset="40%" stopColor={REALM.night9} stopOpacity="0.2" />
            <stop offset="100%" stopColor={REALM.night4} stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="throneGlow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={REALM.frostIceBright} stopOpacity="0.2" />
            <stop offset="30%" stopColor={REALM.frostIceMid} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="iceShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={REALM.frostIceBright} stopOpacity="0.3" />
            <stop offset="50%" stopColor={REALM.frostIceMid} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <filter id="ftDistantBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <filter id="ftMidBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="iceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* === THE FROZEN THRONE - HIGHLY VISIBLE in center background === */}
        {/* Massive throne glow - icy power emanating from the throne */}
        <ellipse cx="500" cy="150" rx="280" ry="180" fill={REALM.frostIceMid} filter="url(#iceGlow)" opacity="0.25" />
        <ellipse cx="500" cy="120" rx="180" ry="100" fill={REALM.frostIceBright} filter="url(#iceGlow)" opacity="0.2" />
        <ellipse cx="500" cy="100" rx="80" ry="50" fill={REALM.frostIceBright} filter="url(#iceGlow)" opacity="0.35" />

        {/* The frozen spire - NO BLUR, higher opacity */}
        <g transform="translate(500, 80)" opacity="0.75">
          {/* Throne base - massive ice platform with ice-blue tint */}
          <polygon points="-200,320 -170,220 -130,250 -80,160 -40,190 0,100 40,190 80,160 130,250 170,220 200,320" fill={REALM.night21} />
          <polygon points="-180,300 -150,240 -100,260 -50,200 50,200 100,260 150,240 180,300" fill={REALM.night17} />
          {/* Ice steps cascading down */}
          <polygon points="-220,320 -200,280 -160,295 -100,260 100,260 160,295 200,280 220,320" fill={REALM.night14} />
          <polygon points="-160,300 -120,275 -70,290 70,290 120,275 160,300" fill={REALM.night12} opacity="0.8" />

          {/* Central throne spire - Lich King's seat - PROMINENT */}
          <polygon points="-50,180 -35,100 -20,130 0,30 20,130 35,100 50,180" fill={REALM.night23} />
          <polygon points="-35,150 -20,80 0,40 20,80 35,150" fill={REALM.frostIceDark} opacity="0.8" />
          {/* Inner ice glow of throne */}
          <polygon points="-20,130 0,50 20,130" fill={REALM.frostIceMid} opacity="0.6" />
          <polygon points="-12,110 0,60 12,110" fill={REALM.frostIceBright} opacity="0.4" />

          {/* Ice crown at apex - GLOWING BRIGHTLY */}
          <polygon points="-15,70 0,20 15,70" fill={REALM.frostIceMid} opacity="0.8" />
          <polygon points="-10,60 0,25 10,60" fill={REALM.frostIceBright} opacity="0.7" />
          <polygon points="-6,50 0,30 6,50" fill={REALM.ash100} opacity="0.5" />
          {/* Crown power glow */}
          <ellipse cx="0" cy="35" rx="30" ry="25" fill={REALM.frostIceBright} opacity="0.5" filter="url(#iceGlow)" />
          <ellipse cx="0" cy="30" rx="15" ry="12" fill={REALM.ash100} opacity="0.3" filter="url(#iceGlow)" />

          {/* Flanking spires - left - taller */}
          <polygon points="-120,240 -105,140 -95,170 -80,90 -70,150 -55,240" fill={REALM.night19} />
          <polygon points="-95,120 -80,90 -70,115" fill={REALM.frostIceMid} opacity="0.5" />
          <polygon points="-150,280 -140,200 -130,280" fill={REALM.night17} />

          {/* Flanking spires - right - taller */}
          <polygon points="55,240 70,150 80,90 95,170 105,140 120,240" fill={REALM.night19} />
          <polygon points="70,115 80,90 95,120" fill={REALM.frostIceMid} opacity="0.5" />
          <polygon points="130,280 140,200 150,280" fill={REALM.night17} />

          {/* Outer tower spires */}
          <polygon points="-170,300 -155,190 -140,300" fill={REALM.night15} />
          <polygon points="140,300 155,190 170,300" fill={REALM.night15} />

          {/* Ice detail highlights */}
          <line x1="-30" y1="160" x2="0" y2="60" stroke={REALM.frostIceBright} strokeWidth="1" opacity="0.3" />
          <line x1="30" y1="160" x2="0" y2="60" stroke={REALM.frostIceBright} strokeWidth="1" opacity="0.3" />
        </g>

        {/* === FAR LAYER - Distant mountain ranges === */}
        <g filter="url(#ftDistantBlur)" opacity="0.35">
          {/* Distant mountain range - far left */}
          <polygon points="0,220 30,120 60,150 100,80 140,130 180,100 220,160 260,220" fill={REALM.night8} />
          <polygon points="80,100 100,80 120,95" fill={REALM.frostIceDark} opacity="0.4" />

          {/* Distant peaks - far right */}
          <polygon points="740,220 780,110 820,140 860,70 900,120 940,90 980,150 1000,220" fill={REALM.night8} />
          <polygon points="840,90 860,70 880,85" fill={REALM.frostIceDark} opacity="0.4" />
        </g>

        {/* === MID LAYER - Ice citadels, frozen structures === */}
        <g filter="url(#ftMidBlur)" opacity="0.4">
          {/* Ice citadel left */}
          <g transform="translate(120, 250)">
            <polygon points="0,150 20,60 40,80 60,30 80,70 100,50 120,150" fill={REALM.night11a} />
            <polygon points="50,50 60,30 70,45" fill={REALM.frostIceMid} opacity="0.25" />
            {/* Ice bridge remnant */}
            <path d="M120,100 Q180,90 200,120" stroke={REALM.frostSkyBot} strokeWidth="8" fill="none" />
          </g>

          {/* Frozen fortress ruins center-left */}
          <g transform="translate(280, 280)">
            <polygon points="0,120 15,50 35,60 50,20 65,55 85,40 100,120" fill={REALM.night9a} />
            <rect x="40" y="30" width="20" height="30" fill={REALM.frostIceDark} opacity="0.3" />
          </g>

          {/* Ice citadel right */}
          <g transform="translate(750, 260)">
            <polygon points="0,140 25,70 50,90 75,40 100,85 125,60 150,140" fill={REALM.night11a} />
            <polygon points="65,55 75,40 85,50" fill={REALM.frostIceMid} opacity="0.25" />
          </g>

          {/* Mid-range mountain ridges */}
          <polygon points="0,400 40,320 90,350 140,280 200,330 260,290 320,360 380,310 440,380 500,340 560,390 620,320 680,370 740,300 800,350 860,310 920,380 980,330 1000,400" fill={REALM.night9a} />

          {/* Ice formations on ridge */}
          <polygon points="130,300 140,280 150,295" fill={REALM.frostIceMid} opacity="0.2" />
          <polygon points="250,310 260,290 270,305" fill={REALM.frostIceMid} opacity="0.2" />
          <polygon points="730,320 740,300 750,315" fill={REALM.frostIceMid} opacity="0.2" />
        </g>

        {/* === NEAR LAYER - Foreground ice, frozen lake, spires === */}
        <g opacity="0.5">
          {/* Frozen lake surface */}
          <ellipse cx="500" cy="650" rx="400" ry="80" fill={REALM.night9b} opacity="0.4" />
          <ellipse cx="500" cy="650" rx="350" ry="60" fill={REALM.frostIceDark} opacity="0.15" />
          {/* Ice cracks on lake */}
          <path d="M200,640 L280,660 L320,645 L400,670 L450,650" stroke={REALM.frostIceMid} strokeWidth="1" opacity="0.2" fill="none" />
          <path d="M550,660 L620,640 L700,665 L780,645" stroke={REALM.frostIceMid} strokeWidth="1" opacity="0.2" fill="none" />

          {/* Large ice spire left foreground */}
          <g transform="translate(80, 500)">
            <polygon points="0,200 25,50 40,80 55,0 70,75 95,40 120,200" fill={REALM.night16} />
            <polygon points="45,30 55,0 65,25" fill={REALM.frostIceBright} opacity="0.3" />
            <polygon points="30,100 40,80 50,95" fill={REALM.frostIceMid} opacity="0.2" />
          </g>

          {/* Ice crystal cluster left */}
          <g transform="translate(200, 580)">
            <polygon points="0,120 10,40 20,120" fill={REALM.frostIceDark} opacity="0.6" />
            <polygon points="20,120 35,20 50,120" fill={REALM.frostIceMid} opacity="0.5" />
            <polygon points="40,120 50,50 60,120" fill={REALM.frostIceDark} opacity="0.5" />
          </g>

          {/* Ice spire right foreground */}
          <g transform="translate(820, 520)">
            <polygon points="0,180 30,60 50,90 70,10 90,85 120,50 150,180" fill={REALM.night16} />
            <polygon points="60,40 70,10 80,35" fill={REALM.frostIceBright} opacity="0.3" />
          </g>

          {/* Ice crystal cluster right */}
          <g transform="translate(750, 600)">
            <polygon points="0,100 12,30 24,100" fill={REALM.frostIceDark} opacity="0.5" />
            <polygon points="18,100 35,10 52,100" fill={REALM.frostIceMid} opacity="0.5" />
            <polygon points="45,100 55,45 65,100" fill={REALM.frostIceDark} opacity="0.4" />
          </g>

          {/* Scattered ice shards on ground */}
          <polygon points="350,720 360,690 370,720" fill={REALM.frostIceMid} opacity="0.25" />
          <polygon points="420,730 428,705 436,730" fill={REALM.frostIceDark} opacity="0.3" />
          <polygon points="560,725 570,695 580,725" fill={REALM.frostIceMid} opacity="0.25" />
          <polygon points="630,735 640,710 650,735" fill={REALM.frostIceDark} opacity="0.3" />

          {/* Frost mist on ground */}
          <ellipse cx="200" cy="750" rx="150" ry="30" fill={REALM.frostIceDark} opacity="0.15" />
          <ellipse cx="500" cy="780" rx="200" ry="40" fill={REALM.frostIceMid} opacity="0.1" />
          <ellipse cx="800" cy="760" rx="150" ry="30" fill={REALM.frostIceDark} opacity="0.15" />
        </g>

        {/* Ground plane fade */}
        <rect x="0" y="200" width="1000" height="650" fill="url(#ftGroundFade)" />

        {/* Perspective lines (subtle, icy) */}
        <g opacity="0.06">
          {[-50, -30, -15, 0, 15, 30, 50].map((offset, i) => (
            <line key={i} x1={500 + offset * 2} y1="150" x2={offset < 0 ? -300 : offset > 0 ? 1300 : 500} y2="850" stroke={REALM.night19a} strokeWidth="1" />
          ))}
        </g>
      </svg>

      {/* Volumetric blizzard clouds */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '45%' }} viewBox="0 0 1000 450" preserveAspectRatio="none">
        <defs>
          <filter id="iceCloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
          <filter id="iceCloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <radialGradient id="iceCloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={REALM.night15a} />
            <stop offset="60%" stopColor={REALM.night9e} />
            <stop offset="100%" stopColor={REALM.stone4} />
          </radialGradient>
        </defs>
        {/* Far background clouds - massive blizzard wall */}
        <g filter="url(#iceCloudBlur)" opacity="0.5">
          <ellipse cx="150" cy="80" rx="300" ry="100" fill={REALM.night8a} />
          <ellipse cx="500" cy="60" rx="400" ry="120" fill={REALM.night10} />
          <ellipse cx="850" cy="90" rx="320" ry="110" fill={REALM.night8a} />
        </g>
        {/* Mid clouds - storm mass */}
        <g filter="url(#iceCloudBlurLight)" opacity="0.7">
          <ellipse cx="200" cy="150" rx="250" ry="80" fill="url(#iceCloudCore)" />
          <ellipse cx="480" cy="120" rx="320" ry="100" fill="url(#iceCloudCore)" />
          <ellipse cx="780" cy="160" rx="280" ry="85" fill="url(#iceCloudCore)" />
        </g>
        {/* Front detail clouds */}
        <g opacity="0.4">
          <ellipse cx="100" cy="250" rx="150" ry="45" fill={REALM.night10a} />
          <ellipse cx="350" cy="220" rx="180" ry="55" fill={REALM.night8b} />
          <ellipse cx="600" cy="240" rx="200" ry="50" fill={REALM.night10a} />
          <ellipse cx="880" cy="230" rx="160" ry="45" fill={REALM.night8b} />
        </g>
      </svg>

      {/* === VIGNETTE LIGHTING - Icy center glow === */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 35%, ${REALM.frostIceMid}08 0%, transparent 50%),
          radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Corner frost darkening */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '35%',
        height: '45%',
        background: `radial-gradient(ellipse at 0% 0%, rgba(0,5,15,0.6) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '35%',
        height: '45%',
        background: `radial-gradient(ellipse at 100% 0%, rgba(0,5,15,0.6) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '40%',
        height: '40%',
        background: `radial-gradient(ellipse at 0% 100%, rgba(0,5,15,0.7) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '40%',
        height: '40%',
        background: `radial-gradient(ellipse at 100% 100%, rgba(0,5,15,0.7) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Icy aurora/glow bands */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '10%',
        width: '45%',
        height: '30%',
        background: `radial-gradient(ellipse at 30% 40%, ${REALM.frostIceMid}15 0%, ${REALM.frostIceDark}08 40%, transparent 70%)`,
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '8%',
        width: '40%',
        height: '25%',
        background: `radial-gradient(ellipse at 60% 50%, ${REALM.frostIceBright}12 0%, ${REALM.frostIceMid}08 50%, transparent 80%)`,
        filter: 'blur(45px)',
      }} />

      {/* === INVINCIBLE - Standing beside Lich King === */}
      <svg
        style={{
          position: 'absolute',
          left: '1%',
          bottom: '3%',
          width: '160px',
          height: '200px',
          filter: `drop-shadow(0 0 20px ${REALM.frostIceMid}50)`,
        }}
        viewBox="-40 -20 300 320"
      >
        <defs>
          <linearGradient id="horseBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={REALM.night22} />
            <stop offset="100%" stopColor={REALM.night12a} />
          </linearGradient>
          <filter id="frostGlowHorse">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="smokeBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Ghostly aura around entire horse */}
        <ellipse cx="110" cy="180" rx="100" ry="70" fill={REALM.frostIceMid} opacity="0.08" filter="url(#frostGlowHorse)">
          <animate attributeName="opacity" values="0.05;0.12;0.05" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* === BACK LEGS with SMOKE === */}
        <g>
          <polygon points="145,130 152,165 156,210 160,250 150,252 144,215 140,170 138,135" fill="url(#horseBody)" />
          <polygon points="160,250 150,252 148,260 158,262" fill={REALM.stone7} />
          {/* Blue smoke from back left hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="154" cy="255" rx="12" ry="8" fill={REALM.frostIceMid} opacity="0.25" className="mf-drift" style={{ '--drift-dur': '2s', '--drift-y': '-10px', '--drift-sy': 1.875 } as CSSProperties}>
              <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>
        <g>
          <polygon points="165,125 175,158 180,200 184,245 174,248 168,205 162,162 158,130" fill="url(#horseBody)" />
          <polygon points="184,245 174,248 172,256 182,258" fill={REALM.stone7} />
          {/* Blue smoke from back right hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="178" cy="250" rx="10" ry="7" fill={REALM.frostIceBright} opacity="0.2" className="mf-drift" style={{ '--drift-dur': '2.3s', '--drift-y': '-12px', '--drift-sy': 2 } as CSSProperties}>
              <animate attributeName="opacity" values="0.2;0.08;0.2" dur="2.3s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* === FRONT LEGS with SMOKE === */}
        <g>
          <polygon points="50,140 44,175 38,215 34,255 44,257 50,220 56,180 58,145" fill={REALM.night15a} />
          <polygon points="34,255 44,257 46,265 36,267" fill={REALM.stone7} />
          {/* Blue smoke from front left hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="40" cy="260" rx="14" ry="9" fill={REALM.frostIceMid} opacity="0.3" className="mf-drift" style={{ '--drift-dur': '1.8s', '--drift-y': '-12px', '--drift-sy': 2 } as CSSProperties}>
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>
        <g>
          <polygon points="70,135 65,170 60,210 55,250 65,252 72,215 78,175 76,140" fill="url(#horseBody)" />
          <polygon points="55,250 65,252 67,260 57,262" fill={REALM.stone7} />
          {/* Blue smoke from front right hoof */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="61" cy="255" rx="11" ry="8" fill={REALM.frostIceBright} opacity="0.22" className="mf-drift" style={{ '--drift-dur': '2.1s', '--drift-y': '-13px', '--drift-sy': 2 } as CSSProperties}>
              <animate attributeName="opacity" values="0.22;0.08;0.22" dur="2.1s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* BODY */}
        <path d="M50,115 Q30,110 35,135 L50,145 L65,120 Q95,95 125,95 Q160,95 180,115 L195,140 Q200,120 188,105 Q170,85 125,80 Q80,85 50,115 Z" fill="url(#horseBody)" />
        <path d="M50,115 L35,135 L50,145 L70,125 Z" fill={REALM.night23a} />
        <path d="M180,115 L195,140 L180,145 L165,120 Z" fill={REALM.night23a} />
        <path d="M65,140 Q120,160 175,140 L175,125 Q120,140 65,125 Z" fill={REALM.night12a} />

        {/* ARMOR PLATE */}
        <path d="M75,100 Q125,80 175,105 L168,118 Q125,100 82,118 Z" fill={REALM.night15a} />
        <path d="M85,108 Q125,95 165,110" stroke={REALM.frostIceMid} strokeWidth="2" opacity="0.3" fill="none" />
        <circle cx="125" cy="102" r="5" fill="none" stroke={REALM.frostIceMid} strokeWidth="1.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* NECK */}
        <polygon points="50,115 25,80 10,55 30,45 50,65 65,105" fill="url(#horseBody)" />
        <polygon points="50,115 25,80 38,88 58,108" fill={REALM.night23a} />

        {/* HEAD - undead horse skull */}
        <g transform="translate(5, 40)">
          <polygon points="5,20 -10,5 -25,-15 -30,-40 -22,-50 -5,-45 12,-35 20,-15 25,10" fill="url(#horseBody)" />
          <polygon points="-10,5 -25,-15 -22,-22 -5,-8 5,5" fill={REALM.night23a} />
          <polygon points="-5,-45 -22,-50 -28,-42 -12,-30 5,-35" fill={REALM.night15a} />

          {/* GLOWING EYES - intense blue */}
          <ellipse cx="0" cy="-22" rx="7" ry="5" fill={REALM.stone5a} />
          <ellipse cx="0" cy="-22" rx="5" ry="4" fill={REALM.frostIceBright} filter="url(#frostGlowHorse)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="-22" rx="2" ry="1.5" fill={REALM.ash100} opacity="0.8" />

          {/* BLUE SMOKE from eyes */}
          <g filter="url(#smokeBlur)">
            <ellipse cx="8" cy="-28" rx="10" ry="6" fill={REALM.frostIceMid} opacity="0.35" className="mf-drift" style={{ '--drift-dur': '2s', '--drift-x': '10px' } as CSSProperties}>
              <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="15" cy="-32" rx="8" ry="5" fill={REALM.frostIceBright} opacity="0.2" className="mf-drift" style={{ '--drift-dur': '2.5s', '--drift-x': '13px' } as CSSProperties}>
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* BLUE SMOKE from nostrils */}
          <ellipse cx="-28" cy="-45" rx="3" ry="4" fill={REALM.stone4a} />
          <g filter="url(#smokeBlur)">
            <ellipse cx="-32" cy="-52" rx="8" ry="5" fill={REALM.frostIceMid} opacity="0.3" className="mf-drift" style={{ '--drift-dur': '3s', '--drift-y': '-13px' } as CSSProperties}>
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur="3s" repeatCount="indefinite" />
            </ellipse>
          </g>

          <polygon points="12,-35 18,-55 26,-42 18,-32" fill="url(#horseBody)" />
          <path d="M-5,-8 L8,-28 M15,-18 L-5,-42" stroke={REALM.night15a} strokeWidth="3" fill="none" />
        </g>

        {/* MANE - ghostly ice wisps */}
        <g style={{ animation: 'capeWave 3s ease-in-out infinite' }}>
          <path d="M30,45 Q50,15 38,-15 Q65,10 58,45" fill={REALM.frostIceDark} opacity="0.4" />
          <path d="M42,55 Q68,15 62,-20" stroke={REALM.frostIceMid} strokeWidth="3" fill="none" opacity="0.35" />
          <path d="M52,70 Q78,30 72,0" stroke={REALM.frostIceBright} strokeWidth="2" fill="none" opacity="0.25" />
        </g>

        {/* TAIL - ghostly */}
        <g style={{ animation: 'capeWave 4s ease-in-out infinite reverse' }}>
          <path d="M200,120 Q225,115 245,135 Q240,160 215,155 Q222,135 200,128" fill={REALM.frostIceDark} opacity="0.35" />
          <path d="M205,128 Q230,122 242,145" stroke={REALM.frostIceMid} strokeWidth="2.5" fill="none" opacity="0.3" />
        </g>

        {/* Ground frost */}
        <ellipse cx="110" cy="265" rx="80" ry="12" fill={REALM.frostIceMid} opacity="0.15" filter="url(#frostGlowHorse)" />
      </svg>

      <FrostHero />

      <style>{`
        @keyframes capeWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
        }
        /* Smoke and breath that swell and drift: each wisp moves by --drift-x and --drift-y and stretches by
           --drift-sx and --drift-sy about its own centre, then returns, linear like the opacity beside it */
        .mf-drift {
          transform-box: fill-box;
          transform-origin: center;
          animation: mfDrift var(--drift-dur) linear infinite;
        }
        @keyframes mfDrift {
          0%, 100% { transform: translate(0, 0) scale(1, 1); }
          50% { transform: translate(var(--drift-x, 0px), var(--drift-y, 0px)) scale(var(--drift-sx, 1), var(--drift-sy, 1)); }
        }
      `}</style>

      {/* Horizontal wind/frost streaks - blow RIGHT to LEFT */}
      {windStreaks.map((streak) => (
        <div
          key={streak.id}
          style={{
            position: 'absolute',
            top: `${streak.y}%`,
            right: '-15%',
            width: streak.length,
            height: streak.thickness,
            background: `linear-gradient(270deg, transparent 0%, ${REALM.frostFrostWhite}30 30%, ${REALM.frostFrostWhite}50 50%, ${REALM.frostFrostWhite}30 70%, transparent 100%)`,
            animation: `windStreak ${streak.duration}s linear infinite`,
            animationDelay: `${streak.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Far snow layer */}
      {snowLayers.far.map((flake) => (
        <div
          key={`far-${flake.id}`}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-3%',
            width: flake.size,
            height: flake.size,
            borderRadius: '50%',
            background: REALM.frostFrostMid,
            opacity: 0.4,
            animation: `blizzardFar ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}

      {/* Mid snow layer */}
      {snowLayers.mid.map((flake) => (
        <div
          key={`mid-${flake.id}`}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-5%',
            width: flake.size,
            height: flake.size,
            borderRadius: '50%',
            background: REALM.frostFrostWhite,
            opacity: 0.6,
            animation: `blizzardMid ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}

      {/* Near snow layer - motion blur effect */}
      {snowLayers.near.map((flake) => (
        <div
          key={`near-${flake.id}`}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-8%',
            width: flake.size,
            height: flake.size * 2.5,
            borderRadius: '40%',
            background: `linear-gradient(180deg, ${REALM.frostFrostWhite}80 0%, ${REALM.frostFrostWhite}20 100%)`,
            opacity: 0.7,
            animation: `blizzardNear ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* === SEMI-BURIED SKELETONS near footer === */}
      {/* Skeleton 1 - left side, arm reaching up */}
      <svg
        style={{
          position: 'absolute',
          left: '8%',
          bottom: '2%',
          width: '60px',
          height: '80px',
          opacity: 0.35,
        }}
        viewBox="0 0 60 80"
      >
        {/* Arm bones reaching up from snow */}
        <path d="M30,80 L30,50 L25,35 L20,20" stroke={REALM.earth74} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M30,50 L35,35 L40,22" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Hand bones */}
        <path d="M20,20 L15,10" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M20,20 L18,8" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M20,20 L22,9" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Snow covering base */}
        <ellipse cx="30" cy="78" rx="18" ry="6" fill={REALM.frostFrostWhite} opacity="0.4" />
      </svg>

      {/* Skeleton 2 - right side, skull half visible */}
      <svg
        style={{
          position: 'absolute',
          right: '12%',
          bottom: '3%',
          width: '50px',
          height: '45px',
          opacity: 0.3,
        }}
        viewBox="0 0 50 45"
      >
        {/* Half-buried skull */}
        <ellipse cx="25" cy="30" rx="18" ry="15" fill={REALM.ember79} />
        <ellipse cx="25" cy="28" rx="14" ry="12" fill={REALM.earth74} />
        {/* Eye socket */}
        <ellipse cx="18" cy="25" rx="4" ry="5" fill={REALM.night14a} />
        <ellipse cx="32" cy="25" rx="4" ry="5" fill={REALM.night14a} />
        {/* Faint ice glow in sockets */}
        <ellipse cx="18" cy="25" rx="2" ry="2.5" fill={REALM.frostIceMid} opacity="0.2" />
        <ellipse cx="32" cy="25" rx="2" ry="2.5" fill={REALM.frostIceMid} opacity="0.2" />
        {/* Nose hole */}
        <path d="M25,28 L23,32 L27,32 Z" fill={REALM.night20b} />
        {/* Snow covering lower half */}
        <ellipse cx="25" cy="42" rx="22" ry="8" fill={REALM.frostFrostWhite} opacity="0.5" />
      </svg>

      {/* Skeleton 3 - center-left, ribcage visible */}
      <svg
        style={{
          position: 'absolute',
          left: '30%',
          bottom: '1%',
          width: '70px',
          height: '50px',
          opacity: 0.25,
        }}
        viewBox="0 0 70 50"
      >
        {/* Spine */}
        <path d="M35,5 L35,45" stroke={REALM.earth74} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Ribs - curved */}
        <path d="M35,12 Q20,15 15,22" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,12 Q50,15 55,22" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,20 Q22,23 18,28" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,20 Q48,23 52,28" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,28 Q25,30 22,34" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M35,28 Q45,30 48,34" stroke={REALM.earth74} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Snow covering base */}
        <ellipse cx="35" cy="48" rx="30" ry="8" fill={REALM.frostFrostWhite} opacity="0.45" />
      </svg>

      {/* Skeleton 4 - far right, another reaching arm */}
      <svg
        style={{
          position: 'absolute',
          right: '25%',
          bottom: '2%',
          width: '45px',
          height: '60px',
          opacity: 0.28,
          transform: 'scaleX(-1)',
        }}
        viewBox="0 0 45 60"
      >
        {/* Single arm reaching */}
        <path d="M22,60 L22,40 L18,25 L15,12" stroke={REALM.earth74} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Fingers */}
        <path d="M15,12 L12,5" stroke={REALM.earth74} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M15,12 L15,4" stroke={REALM.earth74} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M15,12 L18,5" stroke={REALM.earth74} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Snow base */}
        <ellipse cx="22" cy="58" rx="14" ry="5" fill={REALM.frostFrostWhite} opacity="0.4" />
      </svg>

      {/* Skeleton 5 - far background, fallen warrior */}
      <svg
        style={{
          position: 'absolute',
          left: '45%',
          bottom: '5%',
          width: '80px',
          height: '40px',
          opacity: 0.2,
        }}
        viewBox="0 0 80 40"
      >
        {/* Fallen skeleton - lying on ground */}
        <ellipse cx="40" cy="35" rx="35" ry="8" fill={REALM.frostFrostWhite} opacity="0.3" />
        {/* Skull */}
        <ellipse cx="15" cy="22" rx="8" ry="7" fill={REALM.earth74} />
        <ellipse cx="12" cy="20" rx="2" ry="2.5" fill={REALM.night14a} />
        <ellipse cx="18" cy="20" rx="2" ry="2.5" fill={REALM.night14a} />
        {/* Ribcage */}
        <path d="M25,25 L55,28" stroke={REALM.earth74} strokeWidth="3" fill="none" />
        <path d="M28,22 L35,28" stroke={REALM.earth74} strokeWidth="1.5" fill="none" />
        <path d="M35,21 L40,28" stroke={REALM.earth74} strokeWidth="1.5" fill="none" />
        <path d="M42,21 L45,28" stroke={REALM.earth74} strokeWidth="1.5" fill="none" />
        <path d="M49,22 L50,28" stroke={REALM.earth74} strokeWidth="1.5" fill="none" />
        {/* Arm bones */}
        <path d="M58,26 L72,20 L78,15" stroke={REALM.earth74} strokeWidth="2" fill="none" />
      </svg>

      {/* Skeleton 6 - background, crawling out */}
      <svg
        style={{
          position: 'absolute',
          left: '55%',
          bottom: '3%',
          width: '55px',
          height: '50px',
          opacity: 0.22,
        }}
        viewBox="0 0 55 50"
      >
        {/* Skull emerging */}
        <ellipse cx="28" cy="25" rx="12" ry="10" fill={REALM.ember79} />
        <ellipse cx="24" cy="22" rx="3" ry="3.5" fill={REALM.night14a} />
        <ellipse cx="32" cy="22" rx="3" ry="3.5" fill={REALM.night14a} />
        <path d="M28,26 L26,30 L30,30 Z" fill={REALM.night20b} />
        {/* Jaw open */}
        <path d="M20,30 Q28,38 36,30" stroke={REALM.earth74} strokeWidth="2" fill="none" />
        {/* One arm reaching forward */}
        <path d="M15,35 L5,25 L2,18" stroke={REALM.earth74} strokeWidth="2.5" fill="none" />
        <path d="M2,18 L-2,12 M2,18 L0,10 M2,18 L4,11" stroke={REALM.earth74} strokeWidth="1.5" fill="none" />
        {/* Snow covering lower body */}
        <ellipse cx="28" cy="45" rx="25" ry="10" fill={REALM.frostFrostWhite} opacity="0.5" />
      </svg>

      {/* Skeleton 7 - far right background */}
      <svg
        style={{
          position: 'absolute',
          right: '5%',
          bottom: '4%',
          width: '40px',
          height: '55px',
          opacity: 0.18,
        }}
        viewBox="0 0 40 55"
      >
        {/* Upper body emerging */}
        <path d="M20,55 L20,35" stroke={REALM.earth74} strokeWidth="3" fill="none" />
        <ellipse cx="20" cy="28" rx="10" ry="8" fill={REALM.earth74} />
        <ellipse cx="16" cy="26" rx="2.5" ry="3" fill={REALM.night14a} />
        <ellipse cx="24" cy="26" rx="2.5" ry="3" fill={REALM.night14a} />
        {/* Arms up */}
        <path d="M12,38 L5,28 L2,18" stroke={REALM.earth74} strokeWidth="2" fill="none" />
        <path d="M28,38 L35,28 L38,18" stroke={REALM.earth74} strokeWidth="2" fill="none" />
        <ellipse cx="20" cy="52" rx="15" ry="6" fill={REALM.frostFrostWhite} opacity="0.4" />
      </svg>

      {/* Undead ghoul 1 - silhouette in background */}
      <svg
        style={{
          position: 'absolute',
          left: '70%',
          bottom: '8%',
          width: '35px',
          height: '60px',
          opacity: 0.15,
        }}
        viewBox="0 0 35 60"
      >
        {/* Hunched ghoul silhouette */}
        <path d="M18,10 Q25,8 22,18 L20,25 Q25,30 23,40 L20,55 L15,55 L12,40 Q10,30 15,25 L13,18 Q10,8 18,10" fill={REALM.night15a} />
        {/* Glowing eyes */}
        <ellipse cx="14" cy="15" rx="2" ry="1.5" fill={REALM.frostIceMid} opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="20" cy="15" rx="2" ry="1.5" fill={REALM.frostIceMid} opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </svg>

      {/* Undead ghoul 2 - far background */}
      <svg
        style={{
          position: 'absolute',
          left: '38%',
          bottom: '10%',
          width: '28px',
          height: '50px',
          opacity: 0.12,
        }}
        viewBox="0 0 28 50"
      >
        <path d="M14,8 Q20,6 18,15 L16,22 Q20,26 18,35 L16,48 L12,48 L10,35 Q8,26 12,22 L10,15 Q8,6 14,8" fill={REALM.night15a} />
        <ellipse cx="11" cy="12" rx="1.5" ry="1" fill={REALM.frostIceMid} opacity="0.35" />
        <ellipse cx="17" cy="12" rx="1.5" ry="1" fill={REALM.frostIceMid} opacity="0.35" />
      </svg>

      {/* Ground frost mist */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        background: `linear-gradient(0deg, ${REALM.frostIceDark}30 0%, ${REALM.frostIceMid}15 40%, transparent 100%)`,
        filter: 'blur(15px)',
      }} />

      <style>{`
        @keyframes windStreak {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(-130vw); opacity: 0; }
        }
        @keyframes blizzardFar {
          0% { transform: translate(0, 0); opacity: 0.4; }
          100% { transform: translate(-25vw, 110vh); opacity: 0; }
        }
        @keyframes blizzardMid {
          0% { transform: translate(0, 0); opacity: 0.6; }
          100% { transform: translate(-35vw, 110vh); opacity: 0; }
        }
        @keyframes blizzardNear {
          0% { transform: translate(0, 0); opacity: 0.7; }
          100% { transform: translate(-50vw, 115vh); opacity: 0; }
        }
      `}</style>
    </>
  )
})
