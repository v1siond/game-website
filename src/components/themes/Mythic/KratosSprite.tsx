'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SPRITE SYSTEM
 * ====================
 * 3-frame run cycle + idle pose
 * Simple SVG drawings, frame-based animation
 */

const K = {
  // Latino skin tone
  skin: '#c4956a',
  skinShadow: '#9a7050',
  tattoo: '#8b1a1a',
  beard: '#1a1208',
  hair: '#1a1208',
  skirt: '#8b1a1a',
  skirtDark: '#5a0a0a',
  belt: '#5a4a2a',
  gold: '#c9a227',
  // Blades of Chaos - red and blue
  bladeRed: '#cc3333',
  bladeRedDark: '#881111',
  bladeRedGlow: '#ff6666',
  bladeBlue: '#3366cc',
  bladeBlueDark: '#112288',
  bladeBlueGlow: '#6699ff',
  chain: '#8a8a8a',
  chainDark: '#5a5a5a',
  eye: '#1a0a00',
}

// ============================================================================
// SHARED: Running head facing RIGHT in SVG (shows LEFT on screen after flip)
// All features on the RIGHT side of the face
// ============================================================================
const RunningHeadRight = memo(function RunningHeadRight() {
  return (
    <g transform="translate(0, -2)">
      <ellipse cx="35" cy="14" rx="7" ry="8" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      {/* Hair on top */}
      <path d="M28,10 Q30,4 35,3 Q40,4 42,10 Q40,7 35,6 Q30,7 28,10 Z" fill={K.hair} />
      {/* Tattoo on RIGHT side (same side as eye) */}
      <path d="M40,6 Q42,10 41,14 Q41,18 40,21" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Single eye visible - facing RIGHT */}
      <ellipse cx="39" cy="12" rx="2" ry="1.5" fill="white" />
      <circle cx="39.5" cy="12" r="1" fill={K.eye} />
      {/* Eyebrow */}
      <path d="M37,9 L42,10" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      {/* Beard profile - facing right */}
      <path d="M38,17 Q40,20 38,23 Q35,21 35,17 Z" fill={K.beard} />
      {/* Nose hint - facing right */}
      <path d="M41,13 L42,15" stroke={K.skinShadow} strokeWidth="0.5" />
    </g>
  )
})

// ============================================================================
// FRAME 1: Blue arm forward (more extended), red arm back
// Legs: /\ spread - left forward, right back
// ============================================================================
const KratosRunFrame1 = memo(function KratosRunFrame1() {
  return (
    <g>
      {/* Chains to blades */}
      <path d="M35,32 Q44,42 52,54" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,32 Q24,42 16,54" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* RED arm BEHIND - more extended back */}
      <g>
        <ellipse cx="34" cy="27" rx="2.5" ry="2.5" fill={K.skinShadow} />
        <path d="M32,29 Q26,38 20,50 L23,52 Q28,42 33,31 Z" fill={K.skinShadow} />
        <ellipse cx="21" cy="51" rx="2" ry="1.5" fill={K.skinShadow} />
        <path d="M19,52 L10,68 Q7,73 10,75 L21,58 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* BACK leg - right leg back */}
      <g>
        <path d="M35,46 Q39,56 42,66 Q43,70 42,72" fill="none" stroke={K.skinShadow} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="42" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Torso - SIDE PROFILE */}
      <g transform="rotate(-5, 35, 34)">
        <ellipse cx="35" cy="34" rx="5" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <rect x="31" y="42" width="8" height="2" fill={K.belt} />
      </g>

      {/* FRONT leg - left leg forward */}
      <g>
        <path d="M35,46 Q31,56 28,66 Q27,70 28,72" fill="none" stroke={K.skin} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="28" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - SIDE VIEW */}
      <path d="M32,44 L30,54 L35,55 L40,54 L38,44 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* BLUE arm FRONT - more extended forward */}
      <g>
        <ellipse cx="36" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M38,28 Q46,38 52,50 L49,52 Q44,42 37,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="51" cy="51" rx="2.5" ry="2" fill={K.skin} />
        <path d="M53,52 L62,68 Q65,73 62,75 L51,58 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 1B: Transition from F1 to neutral
// ============================================================================
const KratosRunFrame1B = memo(function KratosRunFrame1B() {
  return (
    <g>
      {/* Chains */}
      <path d="M35,32 Q40,44 46,56" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,32 Q28,44 22,56" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* RED arm - halfway back */}
      <g>
        <ellipse cx="34" cy="27" rx="2.5" ry="2.5" fill={K.skinShadow} />
        <path d="M33,29 Q28,40 24,52 L27,53 Q30,42 34,31 Z" fill={K.skinShadow} />
        <ellipse cx="25" cy="53" rx="2" ry="1.5" fill={K.skinShadow} />
        <path d="M23,54 L16,70 Q13,75 16,77 L25,60 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Legs - coming together */}
      <g>
        <path d="M35,46 Q37,56 38,66 Q38,70 37,72" fill="none" stroke={K.skinShadow} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="37" cy="72" rx="5" ry="2" fill={K.beard} />
        <path d="M35,46 Q33,56 32,66 Q32,70 33,72" fill="none" stroke={K.skin} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="33" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Torso */}
      <g transform="rotate(-4, 35, 34)">
        <ellipse cx="35" cy="34" rx="5" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <rect x="31" y="42" width="8" height="2" fill={K.belt} />
      </g>

      {/* Skirt */}
      <path d="M32,44 L31,54 L35,55 L39,54 L38,44 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* BLUE arm - halfway forward */}
      <g>
        <ellipse cx="36" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M37,28 Q42,40 46,52 L43,53 Q40,42 36,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="45" cy="53" rx="2.5" ry="2" fill={K.skin} />
        <path d="M47,54 L54,70 Q57,75 54,77 L45,60 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 2: NEUTRAL - Both arms at sides, legs together
// ============================================================================
const KratosRunFrame2 = memo(function KratosRunFrame2() {
  return (
    <g>
      {/* Chains */}
      <path d="M35,32 Q38,46 40,58" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,32 Q32,46 30,58" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* RED arm - at side */}
      <g>
        <ellipse cx="34" cy="27" rx="2.5" ry="2.5" fill={K.skinShadow} />
        <path d="M33,29 Q32,42 31,54 L34,55 Q34,43 34,31 Z" fill={K.skinShadow} />
        <ellipse cx="32" cy="55" rx="2" ry="1.5" fill={K.skinShadow} />
        <path d="M30,56 L26,72 Q24,77 27,79 L33,62 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Legs - together */}
      <g>
        <path d="M35,46 Q35,56 35,66 Q35,70 35,72" fill="none" stroke={K.skin} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="35" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Torso */}
      <g transform="rotate(-3, 35, 34)">
        <ellipse cx="35" cy="34" rx="5" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <rect x="31" y="42" width="8" height="2" fill={K.belt} />
      </g>

      {/* Skirt */}
      <path d="M32,44 L31,54 L35,55 L39,54 L38,44 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* BLUE arm - at side */}
      <g>
        <ellipse cx="36" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M37,28 Q38,42 39,54 L36,55 Q36,43 36,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="38" cy="55" rx="2.5" ry="2" fill={K.skin} />
        <path d="M40,56 L44,72 Q46,77 43,79 L37,62 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 2B: Transition from neutral to F3
// ============================================================================
const KratosRunFrame2B = memo(function KratosRunFrame2B() {
  return (
    <g>
      {/* Chains */}
      <path d="M35,32 Q28,44 22,56" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,32 Q40,44 46,56" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* BLUE arm - halfway back */}
      <g>
        <ellipse cx="36" cy="27" rx="2.5" ry="2.5" fill={K.skinShadow} />
        <path d="M37,29 Q42,40 46,52 L43,53 Q40,42 36,31 Z" fill={K.skinShadow} />
        <ellipse cx="45" cy="53" rx="2" ry="1.5" fill={K.skinShadow} />
        <path d="M47,54 L54,70 Q57,75 54,77 L45,60 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Legs - starting to spread opposite */}
      <g>
        <path d="M35,46 Q33,56 32,66 Q32,70 33,72" fill="none" stroke={K.skinShadow} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="33" cy="72" rx="5" ry="2" fill={K.beard} />
        <path d="M35,46 Q37,56 38,66 Q38,70 37,72" fill="none" stroke={K.skin} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="37" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Torso */}
      <g transform="rotate(-4, 35, 34)">
        <ellipse cx="35" cy="34" rx="5" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <rect x="31" y="42" width="8" height="2" fill={K.belt} />
      </g>

      {/* Skirt */}
      <path d="M32,44 L31,54 L35,55 L39,54 L38,44 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* RED arm - halfway forward */}
      <g>
        <ellipse cx="34" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M33,28 Q28,40 24,52 L27,53 Q30,42 34,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="25" cy="53" rx="2.5" ry="2" fill={K.skin} />
        <path d="M23,54 L16,70 Q13,75 16,77 L25,60 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Head */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 3: Red arm forward (more extended), blue arm back - OPPOSITE of F1
// Legs: /\ spread - right forward, left back
// ============================================================================
const KratosRunFrame3 = memo(function KratosRunFrame3() {
  return (
    <g>
      {/* Chains */}
      <path d="M35,32 Q24,42 16,54" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,32 Q44,42 52,54" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* BLUE arm BEHIND - more extended back */}
      <g>
        <ellipse cx="36" cy="27" rx="2.5" ry="2.5" fill={K.skinShadow} />
        <path d="M38,29 Q44,38 50,50 L47,52 Q42,42 37,31 Z" fill={K.skinShadow} />
        <ellipse cx="49" cy="51" rx="2" ry="1.5" fill={K.skinShadow} />
        <path d="M51,52 L60,68 Q63,73 60,75 L49,58 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* BACK leg - left leg back */}
      <g>
        <path d="M35,46 Q31,56 28,66 Q27,70 28,72" fill="none" stroke={K.skinShadow} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="28" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Torso */}
      <g transform="rotate(-5, 35, 34)">
        <ellipse cx="35" cy="34" rx="5" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <rect x="31" y="42" width="8" height="2" fill={K.belt} />
      </g>

      {/* FRONT leg - right leg forward */}
      <g>
        <path d="M35,46 Q39,56 42,66 Q43,70 42,72" fill="none" stroke={K.skin} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="42" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt */}
      <path d="M32,44 L30,54 L35,55 L40,54 L38,44 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* RED arm FRONT - more extended forward */}
      <g>
        <ellipse cx="34" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M32,28 Q24,38 18,50 L21,52 Q26,42 33,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="19" cy="51" rx="2.5" ry="2" fill={K.skin} />
        <path d="M17,52 L8,68 Q5,73 8,75 L19,58 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Head */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 3B: Transition from F3 back to neutral
// ============================================================================
const KratosRunFrame3B = memo(function KratosRunFrame3B() {
  return (
    <g>
      {/* Chains */}
      <path d="M35,32 Q28,44 22,56" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,32 Q40,44 46,56" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* BLUE arm - halfway */}
      <g>
        <ellipse cx="36" cy="27" rx="2.5" ry="2.5" fill={K.skinShadow} />
        <path d="M37,29 Q42,40 46,52 L43,53 Q40,42 36,31 Z" fill={K.skinShadow} />
        <ellipse cx="45" cy="53" rx="2" ry="1.5" fill={K.skinShadow} />
        <path d="M47,54 L54,70 Q57,75 54,77 L45,60 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Legs - coming together */}
      <g>
        <path d="M35,46 Q33,56 32,66 Q32,70 33,72" fill="none" stroke={K.skinShadow} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="33" cy="72" rx="5" ry="2" fill={K.beard} />
        <path d="M35,46 Q37,56 38,66 Q38,70 37,72" fill="none" stroke={K.skin} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="37" cy="72" rx="5" ry="2" fill={K.beard} />
      </g>

      {/* Torso */}
      <g transform="rotate(-4, 35, 34)">
        <ellipse cx="35" cy="34" rx="5" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <rect x="31" y="42" width="8" height="2" fill={K.belt} />
      </g>

      {/* Skirt */}
      <path d="M32,44 L31,54 L35,55 L39,54 L38,44 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* RED arm - halfway */}
      <g>
        <ellipse cx="34" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M33,28 Q28,40 24,52 L27,53 Q30,42 34,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="25" cy="53" rx="2.5" ry="2" fill={K.skin} />
        <path d="M23,54 L16,70 Q13,75 16,77 L25,60 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Head */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// IDLE FRAME - Standing, breathing
// ============================================================================
const KratosIdle = memo(function KratosIdle() {
  return (
    <g>
      {/* Chains from back to blades */}
      <path d="M35,42 Q28,48 22,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,42 Q42,48 48,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - smaller */}
      <path
        d="M29,26 Q26,29 27,36 L30,42 L40,42 L43,36 Q44,29 41,26 L38,24 L35,23 L32,24 Z"
        fill={K.skin}
        stroke={K.skinShadow}
        strokeWidth="0.5"
      />
      <path d="M31,29 Q33,31 35,29 Q37,31 39,29" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M35,30 L35,40" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
      <path d="M33,26 Q31,32 32,40" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="29" y="40" width="12" height="3" rx="1" fill={K.belt} />
      <circle cx="35" cy="41.5" r="1.5" fill={K.gold} />

      {/* Left leg - thinner, longer */}
      <path d="M31,46 Q26,52 25,60 Q25,68 27,72 L31,72 Q32,68 32,60 Q33,52 33,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="29" cy="73" rx="3.5" ry="2" fill={K.beard} />

      {/* Right leg - thinner, longer */}
      <path d="M37,46 Q42,52 43,60 Q43,68 41,72 L37,72 Q36,68 36,60 Q35,52 35,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="39" cy="73" rx="3.5" ry="2" fill={K.beard} />

      {/* Skirt */}
      <path
        d="M28,43 L25,54 L30,55 L33,53 L35,55 L37,53 L40,55 L45,54 L42,43 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Left arm + RED blade - more muscular */}
      <ellipse cx="27" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M25,28 Q22,34 20,42 L24,44 Q26,36 27,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="22" cy="44" rx="3" ry="2.5" fill={K.skin} />
      <path d="M19,44 L12,58 Q9,62 12,64 L22,50 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />

      {/* Right arm + BLUE blade - more muscular */}
      <ellipse cx="43" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M45,28 Q48,34 50,42 L46,44 Q44,36 43,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="48" cy="44" rx="3" ry="2.5" fill={K.skin} />
      <path d="M51,44 L58,58 Q61,62 58,64 L48,50 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />

      {/* Head - front facing for idle (looks good) */}
      <ellipse cx="35" cy="14" rx="8" ry="9" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      {/* Hair on top */}
      <path d="M27,10 Q29,3 35,2 Q41,3 43,10 Q41,6 35,5 Q29,6 27,10 Z" fill={K.hair} />
      <path d="M32,6 Q30,10 31,14 Q31,18 32,22" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="12" rx="2" ry="1.5" fill="white" />
      <ellipse cx="38" cy="12" rx="2" ry="1.5" fill="white" />
      <circle cx="32.5" cy="12" r="1" fill={K.eye} />
      <circle cx="38.5" cy="12" r="1" fill={K.eye} />
      <path d="M29,9 L34,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M41,9 L36,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32,17 Q32,22 35,24 Q38,22 38,17 Z" fill={K.beard} />
    </g>
  )
})

// ============================================================================
// MAIN CHARACTER COMPONENT - Cycles through frames
// ============================================================================

const RUN_FRAMES = [KratosRunFrame1, KratosRunFrame1B, KratosRunFrame2, KratosRunFrame2B, KratosRunFrame3, KratosRunFrame3B]

type KratosAnimation = 'idle' | 'running'

interface KratosCharacterProps {
  scale?: number
  animation?: KratosAnimation
  facingDirection?: 'left' | 'right'
  className?: string
}

export const KratosCharacter = memo(function KratosCharacter({
  scale = 1,
  animation = 'idle',
  facingDirection = 'left',
  className = '',
}: KratosCharacterProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const isLeft = facingDirection === 'left'

  useEffect(() => {
    if (animation !== 'running') {
      setFrameIndex(0)
      return
    }

    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % RUN_FRAMES.length)
    }, 180)

    return () => clearInterval(interval)
  }, [animation])

  const CurrentFrame = animation === 'running' ? RUN_FRAMES[frameIndex] : KratosIdle

  return (
    <svg
      width={70 * scale}
      height={75 * scale}
      viewBox="0 0 70 75"
      className={className}
      style={{
        overflow: 'visible',
        transform: isLeft ? 'scaleX(-1)' : 'none',
      }}
    >
      <defs>
        {/* Ground shadow */}
        <radialGradient id="kratosGroundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#8b7319" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a4a10" stopOpacity="0" />
        </radialGradient>
        {/* Red blade glow */}
        <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#ff4444" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Blue blade glow */}
        <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#4488ff" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="35" cy="70" rx="14" ry="3" fill="url(#kratosGroundShadow)" />

      <CurrentFrame />
    </svg>
  )
})

// ============================================================================
// CHAIN PULL REVEAL - Animation sequence
// ============================================================================

interface KratosChainPullRevealProps {
  children: React.ReactNode
  triggered: boolean
  className?: string
}

type Phase = 'waiting' | 'running' | 'pulling' | 'done'

export const KratosChainPullReveal = memo(function KratosChainPullReveal({
  children,
  triggered,
  className = '',
}: KratosChainPullRevealProps) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const [kratosX, setKratosX] = useState(-500)
  const [contentX, setContentX] = useState(-350)
  const didAnimate = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || didAnimate.current) return
    didAnimate.current = true

    // Phase 1: Kratos runs in
    setPhase('running')
    const runStart = performance.now()
    const runDuration = 900

    const animateRun = (now: number) => {
      const elapsed = now - runStart
      const progress = Math.min(elapsed / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      // End at -200 (further right from content, closer to screen edge)
      setKratosX(-500 + (300) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    // Phase 2: Pull content
    const t1 = setTimeout(() => {
      setPhase('pulling')
      const pullStart = performance.now()
      const pullDuration = 600

      const animatePull = (now: number) => {
        const elapsed = now - pullStart
        const progress = Math.min(elapsed / pullDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 2)
        setContentX(-350 + 350 * eased)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animatePull)
        }
      }
      rafRef.current = requestAnimationFrame(animatePull)
    }, 950)

    // Phase 3: Done
    const t2 = setTimeout(() => setPhase('done'), 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered])

  return (
    <div className={`relative ${className}`}>
      {/* Kratos */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          right: kratosX,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: phase !== 'waiting' ? 1 : 0,
        }}
      >
        <KratosCharacter
          scale={2}
          animation={phase === 'running' ? 'running' : 'idle'}
          facingDirection="left"
        />
      </div>

      {/* Content */}
      <div
        style={{
          opacity: phase === 'waiting' ? 0 : 1,
          transform: `translateX(${contentX}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
})
