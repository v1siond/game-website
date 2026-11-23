'use client'

import { memo } from 'react'
import { REALM } from './palette'

// The chaos realm's land, held still for the theatre (scenes.tsx): the storm sky, the olive battlefield with its
// war debris and the warband's banner. The golem that rises on it is the scene's figure (golem.tsx).

export const ChaosLand = memo(function ChaosLand() {
  return (
    <>
      {/* GREEN-BROWN tinted stormy sky - matching REALM Chaos aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          var(--realm-frost7) 0%,
          var(--realm-moss9) 10%,
          var(--realm-moss10a) 20%,
          var(--realm-moss13) 35%,
          var(--realm-moss15) 50%,
          var(--realm-moss13b) 65%,
          var(--realm-moss11a) 80%,
          var(--realm-stone8) 90%,
          var(--realm-stone5) 100%)`
      }} />

      {/* === REALM CHAOS BACKGROUND - Grassy battlefield with war debris === */}
      <svg aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 1000 850" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Grass ground gradient */}
          <linearGradient id="grassGround" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={REALM.moss15} />
            <stop offset="50%" stopColor={REALM.moss12} />
            <stop offset="100%" stopColor={REALM.moss8} />
          </linearGradient>
          {/* Water/puddle gradient */}
          <linearGradient id="waterPuddle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={REALM.night18} stopOpacity="0.6" />
            <stop offset="100%" stopColor={REALM.night9d} stopOpacity="0.8" />
          </linearGradient>
          {/* Banner red */}
          <linearGradient id="bannerRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={REALM.blood40} />
            <stop offset="50%" stopColor={REALM.blood31} />
            <stop offset="100%" stopColor={REALM.blood23a} />
          </linearGradient>
          {/* Shield orange */}
          <linearGradient id="shieldOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={REALM.ember53} />
            <stop offset="50%" stopColor={REALM.ember43} />
            <stop offset="100%" stopColor={REALM.ember33} />
          </linearGradient>
          {/* Metal */}
          <linearGradient id="metalGray" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={REALM.stone41} />
            <stop offset="50%" stopColor={REALM.stone28a} />
            <stop offset="100%" stopColor={REALM.stone22a} />
          </linearGradient>
          {/* Wood pole */}
          <linearGradient id="woodBrown" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={REALM.ember21a} />
            <stop offset="50%" stopColor={REALM.ember15} />
            <stop offset="100%" stopColor={REALM.ember10} />
          </linearGradient>
          {/* Dirt patch gradient */}
          <radialGradient id="dirtPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={REALM.ember18b} />
            <stop offset="60%" stopColor={REALM.ember13b} />
            <stop offset="100%" stopColor={REALM.stone9a} stopOpacity="0" />
          </radialGradient>
          {/* Sandy patch gradient */}
          <radialGradient id="sandPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={REALM.ember24a} />
            <stop offset="50%" stopColor={REALM.earth19} />
            <stop offset="100%" stopColor={REALM.stone15a} stopOpacity="0" />
          </radialGradient>
          {/* Dead grass gradient - brownish green */}
          <radialGradient id="deadGrass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={REALM.moss16a} />
            <stop offset="70%" stopColor={REALM.moss13d} />
            <stop offset="100%" stopColor={REALM.stone10a} stopOpacity="0" />
          </radialGradient>
          <filter id="chaosDistantBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <filter id="chaosMidBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="blightGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          {/* Ground fade - green tint to blend with sky */}
          <linearGradient id="chaosGroundFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={REALM.frost7a} stopOpacity="0.8" />
            <stop offset="40%" stopColor={REALM.frost9} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* === DENSE STORM CLOUDS - Top 15-20% only === */}
        <g opacity="0.95">
          {/* Dense cloud bank - concentrated at very top */}
          <ellipse cx="150" cy="20" rx="250" ry="50" fill={REALM.stone2a} />
          <ellipse cx="400" cy="15" rx="300" ry="45" fill={REALM.stone1b} />
          <ellipse cx="700" cy="25" rx="280" ry="55" fill={REALM.stone2a} />
          <ellipse cx="950" cy="18" rx="220" ry="48" fill={REALM.stone1b} />
          {/* Second layer - slightly lower */}
          <ellipse cx="80" cy="55" rx="180" ry="40" fill={REALM.stone2b} />
          <ellipse cx="300" cy="48" rx="200" ry="42" fill={REALM.stone3} />
          <ellipse cx="550" cy="52" rx="220" ry="45" fill={REALM.stone2b} />
          <ellipse cx="800" cy="50" rx="190" ry="40" fill={REALM.stone3} />
          {/* Bottom edge - wispy, max ~120px from top (12% of 1000) */}
          <ellipse cx="200" cy="85" rx="140" ry="30" fill={REALM.stone3a} opacity="0.7" />
          <ellipse cx="500" cy="80" rx="180" ry="35" fill={REALM.stone3} opacity="0.6" />
          <ellipse cx="750" cy="90" rx="150" ry="28" fill={REALM.stone3a} opacity="0.5" />
        </g>

        {/* === DISTANT ROCKY CLIFF SILHOUETTE - Gray, far background === */}
        <g filter="url(#chaosDistantBlur)" opacity="0.7">
          {/* Main cliff shape - like REALM reference */}
          <path d="M550,180 L600,120 L650,140 L720,80 L780,110 L850,90 L920,130 L1000,100 L1000,350 L550,350 Z" fill={REALM.chaosRockSilhouette} />
          <path d="M600,150 L640,130 L680,145 L720,100 L750,120" stroke={REALM.chaosRockDistant} strokeWidth="3" fill="none" opacity="0.4" />
        </g>

        {/* === ATMOSPHERIC FOG LAYER - Creates depth === */}
        <rect x="0" y="150" width="1000" height="200" fill="url(#chaosGroundFade)" opacity="0.5" />

        {/* === GREENISH EARTHY GROUND - Like flagpole dirt === */}
        <g>
          {/* Main ground plane - greenish earth tones */}
          <ellipse cx="500" cy="650" rx="700" ry="280" fill={REALM.chaosGroundDark} />
          <ellipse cx="500" cy="700" rx="650" ry="250" fill={REALM.chaosGroundGreen} opacity="0.9" />
          <ellipse cx="500" cy="720" rx="600" ry="220" fill={REALM.chaosGroundMid} opacity="0.7" />
          {/* Ground variation patches */}
          <ellipse cx="200" cy="550" rx="120" ry="50" fill={REALM.chaosGroundDark} opacity="0.6" />
          <ellipse cx="600" cy="520" rx="150" ry="60" fill={REALM.chaosGroundGreen} opacity="0.5" />
          <ellipse cx="850" cy="580" rx="100" ry="45" fill={REALM.chaosGroundMid} opacity="0.5" />
        </g>

        {/* === WATER PUDDLES - Reflective dark areas === */}
        <g>
          <ellipse cx="150" cy="720" rx="100" ry="40" fill={REALM.chaosWaterDark} opacity="0.7" />
          <ellipse cx="155" cy="715" rx="70" ry="25" fill={REALM.night20a} opacity="0.5" />
          <ellipse cx="400" cy="680" rx="80" ry="35" fill={REALM.chaosWaterDark} opacity="0.6" />
        </g>

        {/* === OLIVE-GREEN GRASS - REALM Style, clustered naturally === */}
        <g>
          {Array.from({ length: 80 }, (_, i) => {
            // Create natural clusters - grass grows in clumps (reduced for perf)
            const clusterIndex = Math.floor(i / 5) // 16 clusters of 5 blades
            const bladeInCluster = i % 5

            // Base cluster positions spread across foreground
            const clusterX = 30 + (clusterIndex % 8) * 115 + ((clusterIndex * 17) % 40)
            const clusterY = 640 + Math.floor(clusterIndex / 8) * 50 + ((clusterIndex * 13) % 30)

            // Individual blade offset from cluster center
            const x = clusterX + (bladeInCluster - 2) * 4 + ((i * 7) % 5)
            const baseY = clusterY + ((bladeInCluster * 3) % 8)

            // Perspective factor for size
            const perspectiveFactor = Math.max(0, (baseY - 600) / 250)

            // Taller grass in foreground, varied heights within cluster
            const baseHeight = 30 + perspectiveFactor * 50
            const heightVariation = ((bladeInCluster * 7 + i * 3) % 20) - 10
            const height = baseHeight + heightVariation

            // Stroke width - thinner far, thicker near
            const strokeW = 1.0 + perspectiveFactor * 1.5 + ((bladeInCluster % 2) * 0.3)

            // Opacity - fainter far, stronger near
            const opacity = 0.45 + perspectiveFactor * 0.45

            // Natural curve - all blades in cluster curve similarly (wind)
            const windDirection = ((clusterIndex % 3) - 1) * 0.6
            const baseCurve = windDirection * (5 + perspectiveFactor * 8)
            const bladeCurve = baseCurve + ((bladeInCluster - 2) * 2)

            // OLIVE-GREEN grass colors (like REALM reference)
            const colors = [
              REALM.chaosGrassOlive,    // main olive
              REALM.chaosGrassYellow,   // yellowish
              REALM.chaosGrassDark,     // darker
              REALM.chaosGrassLight,    // highlights
              REALM.earth26,             // mid olive
              REALM.earth30,             // yellow-olive
            ]
            const color = colors[(i + bladeInCluster) % 6]

            // Animate some foreground blades

            return (
              <path
                key={`grass${i}`}
                d={`M${x},${baseY} Q${x + bladeCurve * 0.7},${baseY - height * 0.55} ${x + bladeCurve},${baseY - height}`}
                stroke={color}
                strokeWidth={strokeW}
                fill="none"
                strokeLinecap="round"
                opacity={opacity}
              />
            )
          })}
        </g>

        {/* === CATTAILS/REEDS near water (like REALM) === */}
        <g>
          {[90, 120, 155, 190, 370, 400, 440].map((x, i) => (
            <g key={`reed${i}`}>
              {/* Stem */}
              <path
                d={`M${x},${740 - i * 6} Q${x + 1},${700 - i * 6} ${x + 2},${660 - i * 8}`}
                stroke={REALM.earth18}
                strokeWidth="2.5"
                fill="none"
              />
              {/* Brown bulrush head */}
              <ellipse cx={x + 2} cy={652 - i * 10} rx="4" ry="12" fill={REALM.ember11a} />
              <ellipse cx={x + 2} cy={650 - i * 10} rx="3" ry="10" fill={REALM.ember16b} />
            </g>
          ))}
        </g>

        {/* === MID-GROUND ELEMENTS === */}
        <g filter="url(#chaosMidBlur)" opacity="0.7">
          {/* Broken wooden structure left (like REALM banner frame) */}
          <g transform="translate(280, 380)">
            <rect x="0" y="0" width="8" height="120" fill={REALM.ember15} transform="rotate(-8)" />
            <rect x="60" y="-20" width="6" height="100" fill={REALM.ember10} transform="rotate(12)" />
            <rect x="-10" y="40" width="80" height="6" fill={REALM.ember15} transform="rotate(-5)" />
          </g>
          {/* Distant sword in ground */}
          <g transform="translate(520, 420)">
            <rect x="0" y="0" width="4" height="50" fill={REALM.stone34} transform="rotate(-10)" />
            <rect x="-8" y="45" width="20" height="4" fill={REALM.stone28a} />
          </g>
        </g>

        {/* === FOREGROUND ROCKS - Small, warmer brown === */}
        <g opacity="0.8">
          <polygon points="50,780 70,755 95,770 110,780" fill={REALM.ember25} />
          <polygon points="900,770 920,745 945,760 960,775" fill={REALM.ember25} />
          <polygon points="300,800 325,775 350,785" fill={REALM.ember19} opacity="0.7" />
        </g>

        {/* === MID LAYER - Remaining stone pillar === */}
        <g filter="url(#chaosMidBlur)" opacity="0.5">
          <g transform="translate(650, 380)">
            <rect x="0" y="0" width="30" height="100" fill={REALM.chaosRockDistant} />
          </g>
        </g>

        {/* === WAR DEBRIS - Weapons and items scattered on battlefield === */}
        <g>
          {/* === TOP-GROUND DEBRIS (y=380-450) - Distant battlefield debris === */}

          {/* Distant fallen banner - top left */}
          <g transform="translate(80, 400) rotate(12)">
            <rect x="0" y="-1" width="35" height="2" fill={REALM.ember16b} opacity="0.35" />
            <polygon points="35,-8 50,-5 48,5 35,8" fill={REALM.blood23} opacity="0.3" />
          </g>

          {/* Distant broken cart wheel - top center-left */}
          <g transform="translate(250, 420)">
            <ellipse cx="0" cy="0" rx="18" ry="7" fill={REALM.ember19a} opacity="0.35" />
            <ellipse cx="0" cy="0" rx="14" ry="5" fill="none" stroke={REALM.ember13a} strokeWidth="2" opacity="0.3" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke={REALM.ember13a} strokeWidth="1.5" opacity="0.25" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke={REALM.ember13a} strokeWidth="1.5" opacity="0.25" />
          </g>

          {/* Distant pile of bodies (shadow) - top center */}
          <ellipse cx="450" cy="390" rx="50" ry="15" fill={REALM.stone8a} opacity="0.25" />
          <ellipse cx="470" cy="385" rx="30" ry="10" fill={REALM.stone9c} opacity="0.2" />

          {/* Distant catapult wreckage - top right */}
          <g transform="translate(700, 410) rotate(-8)">
            <rect x="0" y="0" width="40" height="4" fill={REALM.ember16b} opacity="0.3" />
            <rect x="35" y="-12" width="4" height="16" fill={REALM.ember16b} opacity="0.25" />
            <polygon points="8,-3 15,-8 22,-3" fill={REALM.ember13a} opacity="0.25" />
          </g>

          {/* Distant rocks/boulders - top scattered */}
          <polygon points="150,430 168,418 185,428" fill={REALM.stone14} opacity="0.3" />
          <polygon points="550,400 570,388 590,398" fill={REALM.stone11b} opacity="0.25" />
          <polygon points="850,420 870,408 888,418" fill={REALM.stone14} opacity="0.3" />

          {/* Distant arrows in ground - top */}
          <g transform="translate(320, 395) rotate(-75)">
            <rect x="0" y="0" width="18" height="1.5" fill={REALM.ember16b} opacity="0.3" />
            <polygon points="18,-2 23,0 18,2" fill={REALM.stone28a} opacity="0.25" />
          </g>
          <g transform="translate(620, 405) rotate(-82)">
            <rect x="0" y="0" width="15" height="1.5" fill={REALM.ember16b} opacity="0.25" />
            <polygon points="15,-2 20,0 15,2" fill={REALM.stone28a} opacity="0.2" />
          </g>

          {/* === MID-GROUND DEBRIS (y=450-650) - More detailed === */}

          {/* Broken sword with blood stain - mid left */}
          <g transform="translate(180, 520) rotate(-15)">
            <ellipse cx="5" cy="5" rx="12" ry="6" fill={REALM.blood12} opacity="0.4" />
            <rect x="-2" y="-35" width="4" height="32" fill={REALM.stone34} opacity="0.75" />
            <rect x="-1" y="-33" width="2" height="28" fill={REALM.stone47} opacity="0.5" />
            <polygon points="-3,-35 0,-44 3,-35" fill={REALM.stone41} opacity="0.75" />
            <rect x="-6" y="-5" width="12" height="5" fill={REALM.stone28a} opacity="0.75" />
            <rect x="-3" y="0" width="6" height="8" fill={REALM.ember15} opacity="0.7" />
          </g>

          {/* Detailed shield lying flat - mid center-left */}
          <g transform="translate(320, 560)">
            <ellipse cx="2" cy="3" rx="38" ry="16" fill={REALM.stone9b} opacity="0.35" />
            <ellipse cx="0" cy="0" rx="38" ry="15" fill={REALM.stone27} opacity="0.65" />
            <ellipse cx="0" cy="0" rx="30" ry="12" fill={REALM.stone33} opacity="0.6" />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill={REALM.stone21} opacity="0.6" />
            <path d="M-25,-8 L22,10" stroke={REALM.stone15} strokeWidth="3" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="36" ry="14" fill="none" stroke={REALM.stone21} strokeWidth="2" opacity="0.5" />
          </g>

          {/* Broken spear with detailed shaft - mid center */}
          <g transform="translate(480, 510) rotate(25)">
            <ellipse cx="25" cy="4" rx="28" ry="5" fill={REALM.stone9b} opacity="0.25" />
            <rect x="0" y="-2" width="55" height="4" fill={REALM.ember22a} opacity="0.65" />
            <rect x="2" y="-1" width="50" height="2" fill={REALM.ember29a} opacity="0.5" />
            <polygon points="55,-4 65,0 55,4" fill={REALM.stone34} opacity="0.6" />
          </g>

          {/* War hammer - mid center-right */}
          <g transform="translate(600, 530) rotate(-20)">
            <ellipse cx="15" cy="5" rx="20" ry="5" fill={REALM.stone9b} opacity="0.25" />
            <rect x="0" y="-2" width="35" height="4" fill={REALM.ember22a} opacity="0.6" />
            <rect x="30" y="-10" width="12" height="20" fill={REALM.stone34} opacity="0.6" />
            <rect x="31" y="-8" width="10" height="16" fill={REALM.stone41} opacity="0.4" />
          </g>

          {/* Detailed axe - mid right */}
          <g transform="translate(680, 540) rotate(-35)">
            <ellipse cx="12" cy="5" rx="15" ry="4" fill={REALM.stone9b} opacity="0.25" />
            <rect x="0" y="-2" width="24" height="4" fill={REALM.ember22a} opacity="0.65" />
            <rect x="1" y="-1" width="22" height="2" fill={REALM.ember29a} opacity="0.4" />
            <path d="M22,-8 Q32,-4 30,0 Q32,4 22,8 L22,-8" fill={REALM.stone34} opacity="0.65" />
            <path d="M23,-6 Q29,-3 28,0 Q29,3 23,6" fill={REALM.stone47} opacity="0.4" />
          </g>

          {/* Detailed helmet with dent - mid far right */}
          <g transform="translate(820, 580)">
            <ellipse cx="0" cy="4" rx="18" ry="6" fill={REALM.stone9b} opacity="0.3" />
            <ellipse cx="0" cy="0" rx="18" ry="8" fill={REALM.stone34} opacity="0.55" />
            <ellipse cx="0" cy="-3" rx="14" ry="6" fill={REALM.stone41} opacity="0.5" />
            <ellipse cx="5" cy="-1" rx="5" ry="3" fill={REALM.stone28a} opacity="0.4" />
            <path d="M-8,-6 Q-5,-10 2,-8" stroke={REALM.stone22a} strokeWidth="1.5" fill="none" opacity="0.4" />
          </g>

          {/* More rocks - mid ground scattered */}
          <polygon points="250,500 268,486 288,498" fill={REALM.stone15} opacity="0.5" />
          <polygon points="252,502 266,495 275,503" fill={REALM.ember18} opacity="0.35" />
          <polygon points="420,550 440,536 460,548" fill={REALM.stone14} opacity="0.45" />
          <polygon points="580,490 598,478 618,490" fill={REALM.stone15} opacity="0.45" />
          <polygon points="750,520 765,508 782,518" fill={REALM.stone14} opacity="0.5" />
          <polygon points="900,540 918,528 935,538" fill={REALM.stone11b} opacity="0.4" />

          {/* Fallen warrior shadows with armor glint - mid ground */}
          <ellipse cx="380" cy="540" rx="40" ry="14" fill={REALM.stone8a} opacity="0.4" />
          <ellipse cx="385" cy="538" rx="8" ry="3" fill={REALM.stone22a} opacity="0.2" />
          <ellipse cx="620" cy="505" rx="35" ry="12" fill={REALM.stone8a} opacity="0.35" />
          <ellipse cx="615" cy="503" rx="6" ry="2" fill={REALM.stone28a} opacity="0.15" />

          {/* Multiple arrows stuck in ground - mid */}
          <g transform="translate(550, 530) rotate(-80)">
            <rect x="0" y="-1" width="28" height="2" fill={REALM.ember22a} opacity="0.65" />
            <polygon points="28,-3 36,0 28,3" fill={REALM.stone34} opacity="0.6" />
            <polygon points="0,-2 -4,0 0,2" fill={REALM.ember19a} opacity="0.5" />
          </g>
          <g transform="translate(530, 545) rotate(-72)">
            <rect x="0" y="-1" width="22" height="1.5" fill={REALM.ember16b} opacity="0.55" />
            <polygon points="22,-2 28,0 22,2" fill={REALM.stone28a} opacity="0.5" />
          </g>

          {/* Broken shield with emblem - mid left */}
          <g transform="translate(140, 570)">
            <ellipse cx="2" cy="3" rx="26" ry="11" fill={REALM.stone9b} opacity="0.3" />
            <ellipse cx="0" cy="0" rx="26" ry="10" fill={REALM.ember24} opacity="0.55" />
            <ellipse cx="0" cy="0" rx="20" ry="8" fill={REALM.ember30} opacity="0.5" />
            <circle cx="0" cy="0" r="6" fill={REALM.ember18a} opacity="0.5" />
            <path d="M-18,-5 L20,7" stroke={REALM.ember13a} strokeWidth="3" opacity="0.45" />
          </g>

          {/* === FOREGROUND DEBRIS (y=700-800) - Original positions === */}

          {/* === SWORD 1 - Stuck in ground at angle (left side) === */}
          <g transform="translate(120, 730) rotate(-25)">
            <rect x="-2" y="-60" width="4" height="55" fill={REALM.stone34} />
            <rect x="-1" y="-58" width="2" height="50" fill={REALM.stone47} />
            <rect x="-8" y="-8" width="16" height="6" fill={REALM.stone28a} rx="1" />
            <rect x="-3" y="-2" width="6" height="12" fill={REALM.ember15} />
            <ellipse cx="0" cy="8" rx="4" ry="2" fill={REALM.ember10} />
          </g>

          {/* === AXE 1 - Lying flat on ground (center-left) === */}
          <g transform="translate(350, 765) rotate(15)">
            <rect x="0" y="-3" width="50" height="5" fill={REALM.ember21a} rx="2" />
            <rect x="1" y="-2" width="48" height="3" fill={REALM.ember27} />
            <path d="M48,-12 Q58,-8 55,0 Q58,8 48,12 L48,-12" fill={REALM.stone34} />
            <path d="M49,-10 Q56,-6 54,0 Q56,6 49,10" fill={REALM.stone47} stroke="none" />
            <ellipse cx="25" cy="4" rx="25" ry="5" fill={REALM.stone8c} opacity="0.3" />
          </g>

          {/* === SPEAR - Broken, lying on ground (right side) === */}
          <g transform="translate(720, 750) rotate(-8)">
            <rect x="0" y="-2" width="80" height="4" fill={REALM.ember22a} />
            <rect x="1" y="-1" width="78" height="2" fill={REALM.ember29a} />
            <polygon points="80,-5 95,0 80,5" fill={REALM.stone41} />
            <polygon points="81,-3 92,0 81,3" fill={REALM.ash53} />
            <ellipse cx="40" cy="5" rx="40" ry="4" fill={REALM.stone8c} opacity="0.25" />
          </g>

          {/* === SWORD 2 - Broken blade on ground (far right) === */}
          <g transform="translate(880, 760) rotate(35)">
            <rect x="-2" y="-30" width="4" height="25" fill={REALM.stone34} />
            <polygon points="-2,-30 0,-38 2,-30" fill={REALM.stone41} />
            <rect x="-6" y="-8" width="12" height="5" fill={REALM.stone28a} />
            <ellipse cx="0" cy="3" rx="10" ry="3" fill={REALM.stone8c} opacity="0.3" />
          </g>

          {/* === AXE 2 - Small hand axe (mid ground) === */}
          <g transform="translate(480, 755) rotate(-40)">
            <rect x="0" y="-2" width="25" height="4" fill={REALM.ember21a} rx="1" />
            <path d="M24,-8 Q32,-4 30,0 Q32,4 24,8 L24,-8" fill={REALM.stone34} />
            <ellipse cx="12" cy="4" rx="12" ry="3" fill={REALM.stone8c} opacity="0.25" />
          </g>

          {/* === ORANGE SHIELD - Lying flat on ground (center-right) === */}
          <g transform="translate(620, 720)">
            <ellipse cx="0" cy="0" rx="70" ry="28" fill="url(#shieldOrange)" />
            <ellipse cx="0" cy="0" rx="60" ry="23" fill={REALM.ember50} />
            <ellipse cx="0" cy="0" rx="20" ry="9" fill={REALM.ember43} />
            <ellipse cx="-4" cy="-2" rx="12" ry="5" fill={REALM.ember57} opacity="0.6" />
            <ellipse cx="0" cy="0" rx="68" ry="27" fill="none" stroke={REALM.ember27a} strokeWidth="3" />
          </g>

          {/* === ROUND SHIELD 2 - Smaller, darker (left side) === */}
          <g transform="translate(80, 780)">
            <ellipse cx="0" cy="0" rx="45" ry="18" fill={REALM.stone27} />
            <ellipse cx="0" cy="0" rx="38" ry="15" fill={REALM.stone33} />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill={REALM.stone21} />
            <ellipse cx="0" cy="0" rx="43" ry="17" fill="none" stroke={REALM.stone21} strokeWidth="2" />
          </g>

          {/* === HELMET - Dented, on ground === */}
          <g transform="translate(550, 775)">
            <ellipse cx="0" cy="0" rx="20" ry="10" fill={REALM.stone34} />
            <ellipse cx="0" cy="-4" rx="16" ry="8" fill={REALM.stone41} />
            <ellipse cx="0" cy="3" rx="18" ry="5" fill={REALM.stone8c} opacity="0.3" />
          </g>

          {/* === FALLEN WARRIOR SILHOUETTES === */}
          <ellipse cx="280" cy="755" rx="45" ry="15" fill={REALM.stone11} opacity="0.5" />
          <ellipse cx="550" cy="740" rx="40" ry="14" fill={REALM.stone11} opacity="0.4" />

          {/* === WATER PUDDLE - Reflective blue === */}
          <g transform="translate(850, 790)">
            <ellipse cx="0" cy="0" rx="90" ry="35" fill="url(#waterPuddle)" />
            <ellipse cx="-8" cy="-4" rx="70" ry="25" fill={REALM.night18} opacity="0.4" />
            <ellipse cx="-25" cy="-8" rx="20" ry="6" fill={REALM.night21a} opacity="0.3" />
          </g>

          {/* === ROCKS - Earthy tones === */}
          <polygon points="180,795 195,780 215,792" fill={REALM.ember18} opacity="0.5" />
          <polygon points="380,798 398,785 418,795" fill={REALM.ember16} opacity="0.4" />
          <polygon points="760,796 775,783 792,794" fill={REALM.ember16} opacity="0.4" />
        </g>

        {/* Ground plane fade */}
        <rect x="0" y="200" width="1000" height="650" fill="url(#chaosGroundFade)" />

        {/* === PERSPECTIVE LINES - subtle depth like Frost === */}
        <g opacity="0.04">
          {[-60, -35, -15, 0, 15, 35, 60].map((offset, i) => (
            <line key={i} x1={500 + offset * 2} y1="180" x2={500 + Math.sign(offset) * 900} y2="850" stroke={REALM.stone11a} strokeWidth="1" />
          ))}
        </g>
      </svg>

      {/* === STORMY ATMOSPHERE GLOW - green-tinted like REALM === */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '50%',
        height: '35%',
        background: 'radial-gradient(ellipse at 30% 40%, color-mix(in srgb, var(--realm-moss16) 7%, transparent) 0%, color-mix(in srgb, var(--realm-moss10) 2%, transparent) 40%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '5%',
        width: '45%',
        height: '30%',
        background: 'radial-gradient(ellipse at 60% 50%, color-mix(in srgb, var(--realm-moss23) 6%, transparent) 0%, color-mix(in srgb, var(--realm-moss16) 2%, transparent) 50%, transparent 80%)',
        filter: 'blur(55px)',
        pointerEvents: 'none',
      }} />

      {/* Vignette - dark green edges, focused center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, transparent 35%, rgba(5,15,8,0.4) 70%, rgba(0,8,4,0.7) 100%),
          radial-gradient(ellipse 60% 40% at 50% 30%, color-mix(in srgb, var(--realm-moss10) 6%, transparent) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Volumetric storm clouds - DARK GREENISH, top 18% only */}
      <svg aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '18%' }} viewBox="0 0 1000 180" preserveAspectRatio="none">
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          <filter id="cloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <radialGradient id="cloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={REALM.moss18} />
            <stop offset="60%" stopColor={REALM.moss13a} />
            <stop offset="100%" stopColor={REALM.moss7} />
          </radialGradient>
        </defs>
        {/* Dense cloud bank - DARK GREENISH tones */}
        <g filter="url(#cloudBlur)" opacity="0.9">
          <ellipse cx="100" cy="40" rx="200" ry="60" fill={REALM.moss11} />
          <ellipse cx="350" cy="30" rx="250" ry="55" fill={REALM.moss10b} />
          <ellipse cx="600" cy="35" rx="280" ry="65" fill={REALM.moss11} />
          <ellipse cx="850" cy="40" rx="220" ry="55" fill={REALM.moss10b} />
        </g>
        {/* Secondary layer - slightly brighter green */}
        <g filter="url(#cloudBlurLight)" opacity="0.9">
          <ellipse cx="200" cy="70" rx="180" ry="45" fill="url(#cloudCore)" />
          <ellipse cx="450" cy="65" rx="200" ry="50" fill="url(#cloudCore)" />
          <ellipse cx="700" cy="72" rx="190" ry="48" fill="url(#cloudCore)" />
          <ellipse cx="950" cy="68" rx="170" ry="45" fill="url(#cloudCore)" />
        </g>
        {/* Bottom edge - wispy greenish */}
        <g opacity="0.7">
          <ellipse cx="150" cy="110" rx="120" ry="35" fill={REALM.moss13c} />
          <ellipse cx="400" cy="105" rx="140" ry="38" fill={REALM.moss11} />
          <ellipse cx="650" cy="115" rx="130" ry="35" fill={REALM.moss13c} />
          <ellipse cx="900" cy="108" rx="120" ry="32" fill={REALM.moss11} />
        </g>
        {/* Wisps trailing down */}
        <g opacity="0.5">
          <ellipse cx="250" cy="145" rx="80" ry="25" fill={REALM.moss15a} />
          <ellipse cx="550" cy="140" rx="100" ry="28" fill={REALM.moss13c} />
          <ellipse cx="800" cy="150" rx="90" ry="25" fill={REALM.moss15a} />
        </g>
      </svg>

      {/* Stormy cloud glow - BLIGHT GREEN atmospheric lighting */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20%',
        pointerEvents: 'none',
      }}>
        {/* Base green storm glow - always visible, gives clouds greenish tint */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `
            radial-gradient(ellipse at 20% 30%, ${REALM.chaosBlightMid}40 0%, ${REALM.chaosBlightDark}20 40%, transparent 70%),
            radial-gradient(ellipse at 50% 25%, ${REALM.chaosBlightBright}30 0%, ${REALM.chaosBlightMid}18 35%, transparent 65%),
            radial-gradient(ellipse at 80% 35%, ${REALM.chaosBlightMid}35 0%, ${REALM.chaosBlightDark}18 40%, transparent 70%)
          `,
        }} />

        {/* Cloud underlighting - ambient glow within clouds */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
          height: '40%',
          background: `
            radial-gradient(ellipse at 15% 60%, ${REALM.chaosBlightBright}15 0%, transparent 35%),
            radial-gradient(ellipse at 45% 50%, ${REALM.chaosBlightMid}18 0%, transparent 40%),
            radial-gradient(ellipse at 75% 55%, ${REALM.chaosBlightBright}12 0%, transparent 30%),
            radial-gradient(ellipse at 90% 65%, ${REALM.chaosBlightMid}15 0%, transparent 35%)
          `,
          }} />
      </div>

      {/* === WARBAND WAR BANNER - Positioned above infernals, scaled larger === */}
      <div
        style={{
          position: 'absolute',
          left: '8vw',
          top: '58vh',
          transform: 'rotate(-10deg) scale(1.8)',
          transformOrigin: 'bottom left',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <svg aria-hidden="true" width="120" height="300" viewBox="0 0 120 300" style={{ overflow: 'visible' }}>
          {/* Dirt mound at pole base - dark brownish, matches shadowed terrain */}
          <ellipse cx="12" cy="282" rx="28" ry="12" fill={REALM.stone5b} />
          <ellipse cx="12" cy="280" rx="22" ry="9" fill={REALM.stone7a} />
          <ellipse cx="12" cy="278" rx="14" ry="6" fill={REALM.stone9} />
          {/* Small dirt clumps */}
          <ellipse cx="-8" cy="286" rx="10" ry="5" fill={REALM.stone5b} opacity="0.8" />
          <ellipse cx="30" cy="288" rx="12" ry="6" fill={REALM.stone7a} opacity="0.7" />
          {/* Grass tufts around base - olive-green like terrain grass */}
          <path d="M-5,278 Q-8,268 -3,262" stroke={REALM.chaosGrassOlive} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M28,280 Q32,270 29,264" stroke={REALM.chaosGrassYellow} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M-12,282 Q-15,274 -10,270" stroke={REALM.chaosGrassDark} strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M35,284 Q38,276 35,272" stroke={REALM.chaosGrassOlive} strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Banner pole - Dark war totem with blood stains */}
          {/* Main pole - charred dark wood */}
          <rect x="4" y="50" width="16" height="235" fill={REALM.stone5c} />
          <rect x="6" y="50" width="12" height="235" fill={REALM.stone8b} />
          <rect x="8" y="55" width="8" height="225" fill={REALM.ember11} />
          <rect x="10" y="60" width="4" height="215" fill={REALM.ember13} opacity="0.5" />
          {/* Wood grain texture - dark */}
          <line x1="7" y1="70" x2="7" y2="270" stroke={REALM.stone3c} strokeWidth="1" opacity="0.6" />
          <line x1="17" y1="65" x2="17" y2="275" stroke={REALM.stone3c} strokeWidth="1" opacity="0.5" />

          {/* Blood stains dripping down pole */}
          <path d="M8,80 Q6,95 8,110 Q10,125 7,140" stroke={REALM.blood15a} strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M14,130 Q16,150 13,170 Q15,190 12,210" stroke={REALM.blood11} strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M10,200 Q8,220 11,240 Q9,260 10,275" stroke={REALM.blood15a} strokeWidth="2" fill="none" opacity="0.5" />
          {/* Blood splatter spots */}
          <ellipse cx="6" cy="90" rx="3" ry="2" fill={REALM.blood15} opacity="0.6" />
          <ellipse cx="16" cy="155" rx="4" ry="2" fill={REALM.blood10} opacity="0.5" />
          <ellipse cx="8" cy="220" rx="3" ry="3" fill={REALM.blood15a} opacity="0.4" />

          {/* Leather wrappings - darker, worn */}
          <rect x="3" y="110" width="18" height="8" fill={REALM.stone8b} rx="1" />
          <rect x="4" y="112" width="16" height="4" fill={REALM.ember11} />
          <rect x="3" y="180" width="18" height="8" fill={REALM.stone8b} rx="1" />
          <rect x="4" y="182" width="16" height="4" fill={REALM.ember11} />
          <rect x="3" y="240" width="18" height="8" fill={REALM.stone8b} rx="1" />
          <rect x="4" y="242" width="16" height="4" fill={REALM.ember11} />

          {/* Top section - skull mount */}
          <polygon points="12,20 0,50 24,50" fill={REALM.stone8b} />
          <polygon points="12,25 4,48 20,48" fill={REALM.ember11} />

          {/* Small skull at top - weathered bone */}
          <g transform="translate(12, 38)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill={REALM.stone21} />
            <ellipse cx="0" cy="-1" rx="6" ry="4" fill={REALM.stone27} />
            <ellipse cx="-3" cy="-1" rx="2" ry="1.5" fill={REALM.stone4a} />
            <ellipse cx="3" cy="-1" rx="2" ry="1.5" fill={REALM.stone4a} />
            <ellipse cx="0" cy="2" rx="1" ry="1.5" fill={REALM.stone4a} />
            {/* Blood on skull */}
            <path d="M-5,3 Q-3,5 -1,4" stroke={REALM.blood15a} strokeWidth="1.5" fill="none" opacity="0.6" />
          </g>

          {/* Top spike - dark iron */}
          <polygon points="12,8 8,22 16,22" fill={REALM.stone22b} />
          <polygon points="12,10 10,20 14,20" fill={REALM.chaosRockDistant} opacity="0.5" />

          {/* WAR HORNS - darker, battle-worn */}
          {/* Left horn */}
          <g transform="translate(-2, 52)">
            <path
              d="M12,0 Q-5,5 -15,25 Q-20,40 -18,50"
              fill="none"
              stroke={REALM.stone21}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M12,0 Q-5,5 -15,25 Q-20,40 -18,50"
              fill="none"
              stroke={REALM.stone27}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M10,2 Q-3,7 -12,25"
              fill="none"
              stroke={REALM.stone33}
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="-18" cy="50" r="3" fill={REALM.stone15} />
          </g>

          {/* Right horn */}
          <g transform="translate(14, 52)">
            <path
              d="M0,0 Q17,5 27,25 Q32,40 30,50"
              fill="none"
              stroke={REALM.stone21}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M0,0 Q17,5 27,25 Q32,40 30,50"
              fill="none"
              stroke={REALM.stone27}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M2,2 Q15,7 24,25"
              fill="none"
              stroke={REALM.stone33}
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="30" cy="50" r="3" fill={REALM.stone15} />
          </g>

          {/* Metal rings - rusted iron */}
          <ellipse cx="12" cy="55" rx="12" ry="4" fill="none" stroke={REALM.stone21} strokeWidth="2" />
          <ellipse cx="12" cy="55" rx="10" ry="3" fill="none" stroke={REALM.stone27} strokeWidth="1" />

          {/* Banner fabric - simplified but visible */}
          <g transform="translate(18, 55)">
            <defs>
              <clipPath id="flagBannerCol1"><rect x="0" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol2"><rect x="18" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol3"><rect x="36" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol4"><rect x="54" y="0" width="18" height="150" /></clipPath>
              <clipPath id="flagBannerCol5"><rect x="72" y="0" width="15" height="150" /></clipPath>
            </defs>

            {/* Worn, rain-soaked bloody banner - brownish red tones */}
            {[
              { id: 1, x: 0, w: 18, fill: REALM.blood19, yOff: 0 },
              { id: 2, x: 18, w: 18, fill: REALM.blood15b, yOff: 2 },
              { id: 3, x: 36, w: 18, fill: REALM.blood11a, yOff: 4 },
              { id: 4, x: 54, w: 18, fill: REALM.blood8, yOff: 6 },
              { id: 5, x: 72, w: 15, fill: REALM.blood6, yOff: 8 },
            ].map((col) => (
              <g key={col.id}>
                <rect x={col.x} y={col.yOff} width={col.w} height={150 - col.yOff} fill={col.fill} />
                <g clipPath={`url(#flagBannerCol${col.id})`}>
                  <g transform="translate(44, 70)">
                    {/* BRUTE HORNS - curved, coming from skull sides */}
                    <path d="M-18,-8 Q-28,-15 -32,-28 Q-30,-35 -25,-38" stroke={REALM.earth56} strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M-18,-8 Q-26,-14 -30,-26 Q-28,-32 -24,-35" stroke={REALM.ember71} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M18,-8 Q28,-15 32,-28 Q30,-35 25,-38" stroke={REALM.earth56} strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M18,-8 Q26,-14 30,-26 Q28,-32 24,-35" stroke={REALM.ember71} strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* Skull base - worn bone white with yellow/red tints */}
                    <ellipse cx="0" cy="-2" rx="24" ry="16" fill={REALM.ember47} />
                    <ellipse cx="0" cy="-4" rx="22" ry="14" fill={REALM.ember64} />
                    <ellipse cx="0" cy="-5" rx="19" ry="12" fill={REALM.ember71} />
                    {/* Brow ridge */}
                    <path d="M-16,-8 Q-8,-14 0,-12 Q8,-14 16,-8" stroke={REALM.earth56} strokeWidth="4" fill="none" />
                    {/* Eye sockets - deep and dark */}
                    <ellipse cx="-8" cy="-4" rx="5" ry="4" fill={REALM.blood7a} />
                    <ellipse cx="8" cy="-4" rx="5" ry="4" fill={REALM.blood7a} />
                    {/* Blight green eye glow */}
                    <ellipse cx="-8" cy="-4" rx="2.5" ry="2" fill={REALM.moss24} />
                    <ellipse cx="8" cy="-4" rx="2.5" ry="2" fill={REALM.moss24} />
                    {/* Nose hole */}
                    <path d="M-2,2 L0,6 L2,2" fill={REALM.ember11a} />
                    {/* Jaw - worn bone */}
                    <path d="M-16,6 L-14,14 L-6,16 L0,14 L6,16 L14,14 L16,6" fill={REALM.ember58} />
                    <path d="M-14,8 L-12,13 L-4,15 L0,13 L4,15 L12,13 L14,8" fill={REALM.ember64} />
                    {/* Blood stains on skull */}
                    <path d="M-10,-8 Q-12,-2 -8,4" stroke={REALM.blood27} strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M6,0 Q8,5 4,10" stroke={REALM.blood22} strokeWidth="1" fill="none" opacity="0.5" />
                    {/* Brute tusks - from jaw, pointing up and out */}
                    <path d="M-12,12 Q-18,4 -14,-4" stroke={REALM.ember71} strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M-12,12 Q-16,5 -13,-2" stroke={REALM.ember77} strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M12,12 Q18,4 14,-4" stroke={REALM.ember71} strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M12,12 Q16,5 13,-2" stroke={REALM.ember77} strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                </g>
              </g>
            ))}
            <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill={REALM.blood10} />
          </g>

          {/* Pole shadow */}
          <ellipse cx="12" cy="285" rx="15" ry="5" fill={REALM.stone4b} opacity="0.4" />

          {/* The flag's shadow on the ground */}
          <g transform="translate(45, 280)">
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={`flagShadow${i}`}
                cx={i * 15}
                cy={i * 2}
                rx={18 - i * 2}
                ry={6 - i * 0.5}
                fill={REALM.stone4b}
                opacity={0.25 - i * 0.04}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* === FOREGROUND GRASS TUFTS === */}
      <svg aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', pointerEvents: 'none' }} viewBox="0 0 1000 80" preserveAspectRatio="none">
        {/* Grass silhouettes */}
        <g opacity="0.85">
          {[30, 120, 250, 400, 550, 700, 850, 950].map((x, i) => (
            <g key={`fg-${i}`} transform={`translate(${x}, 75)`}>
              <path d={`M0,0 Q${-2},${-20} ${1},${-35 - i % 8}`} stroke={REALM.moss23a} strokeWidth="2" fill="none" />
              <path d={`M5,0 Q${7},${-25} ${4},${-40 - i % 6}`} stroke={REALM.moss28} strokeWidth="2" fill="none" />
              <path d={`M10,0 Q${8},${-15} ${12},${-28 - i % 5}`} stroke={REALM.moss23a} strokeWidth="1.5" fill="none" />
            </g>
          ))}
        </g>
        {/* Ground bar - dark grass */}
        <rect x="0" y="65" width="1000" height="15" fill={REALM.moss8} opacity="0.95" />
      </svg>

      {/* Ground mist atmosphere */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(0deg, color-mix(in srgb, var(--realm-moss8) 25%, transparent) 0%, color-mix(in srgb, var(--realm-stone6) 15%, transparent) 50%, transparent 100%)',
        filter: 'blur(15px)',
      }} />
    </>
  )
})
