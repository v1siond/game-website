'use client'

import { memo, useId } from 'react'
import bugMotion from './bug.module.css'
import { DARK_FANTASY } from './palette'

// The infected bug, alive and dead, drawn as SVG elements so a scene places it inside its own picture. Its
// hit flash ([data-bug-hit]) is written by the scene from the scroll.

/** The bug's height over its width. */
export const BUG_ASPECT = 0.85

/** How strongly the bone silhouette covers the bug on a hit: enough to read as the bug bleaching white. */
export const HIT_FLASH_OPACITY = 0.75

/**
 * BATTLE BUG - HK BOSS STYLE
 * ==========================
 * Based on actual HK boss designs (chunky, armored, threatening):
 * - Segmented armored body
 * - Void-black eyes with orange infection glow
 * - Curved mandibles
 * - Thick segmented legs
 * - Orange infection growths
 */
export const BattleBug = memo(function BattleBug({ size = 120, legPhase = 0, antennaPhase = 0, x = 0, y = 0 }: { size?: number; legPhase?: number; antennaPhase?: number; x?: number; y?: number }) {
  const shell = DARK_FANTASY.shell
  const shellMid = DARK_FANTASY.shellMid
  const shellDark = DARK_FANTASY.shellDark
  const mask = DARK_FANTASY.bugMask
  const maskLight = DARK_FANTASY.bugMaskLight
  const infected = DARK_FANTASY.infected
  const infectedBright = DARK_FANTASY.infectedBright
  // Ids of this bug's own filter and gradients: two bugs on a page never resolve url(#id) into each other's,
  // or into one a hidden copy holds.
  const uid = useId()
  const glowId = `${uid}glow`
  const shellGradId = `${uid}shell`
  const maskGradId = `${uid}mask`

  const getLegY = (index: number) => {
    const offset = index % 2 === 0 ? 0 : 0.5
    return Math.sin((legPhase + offset) * Math.PI * 2) * 4
  }

  const antennaWiggle = Math.sin(antennaPhase * Math.PI * 2) * 6

  const legs = [
    `M28,45 Q18,${50 + getLegY(0)} 10,${58 + getLegY(0)} Q6,${62 + getLegY(0)} 4,${68 + getLegY(0)}`,
    `M25,52 Q15,${56 + getLegY(1)} 8,${64 + getLegY(1)} Q4,${68 + getLegY(1)} 2,${74 + getLegY(1)}`,
    `M26,58 Q18,${62 + getLegY(2)} 12,${70 + getLegY(2)} Q8,${74 + getLegY(2)} 6,${80 + getLegY(2)}`,
    `M30,62 Q24,${66 + getLegY(3)} 18,${74 + getLegY(3)}`,
    `M72,45 Q82,${50 + getLegY(4)} 90,${58 + getLegY(4)} Q94,${62 + getLegY(4)} 96,${68 + getLegY(4)}`,
    `M75,52 Q85,${56 + getLegY(5)} 92,${64 + getLegY(5)} Q96,${68 + getLegY(5)} 98,${74 + getLegY(5)}`,
    `M74,58 Q82,${62 + getLegY(6)} 88,${70 + getLegY(6)} Q92,${74 + getLegY(6)} 94,${80 + getLegY(6)}`,
    `M70,62 Q76,${66 + getLegY(7)} 82,${74 + getLegY(7)}`,
  ]
  const mandibles = [
    `M36,32 Q${28 + antennaWiggle * 0.3},38 ${24 + antennaWiggle * 0.5},45`,
    `M64,32 Q${72 - antennaWiggle * 0.3},38 ${76 - antennaWiggle * 0.5},45`,
  ]
  const horns = [
    `M38,14 Q${30 + antennaWiggle},6 ${26 + antennaWiggle},0`,
    `M62,14 Q${70 - antennaWiggle},6 ${74 - antennaWiggle},0`,
  ]

  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size * BUG_ASPECT}
      viewBox="0 0 100 85"
      overflow="visible"
      className="[filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--df-infected-glow)_38%,transparent))_drop-shadow(0_0_6px_color-mix(in_srgb,var(--df-infected)_50%,transparent))]"
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={shellGradId} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="70%" stopColor={shellMid} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
        <radialGradient id={maskGradId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={maskLight} />
          <stop offset="100%" stopColor={mask} />
        </radialGradient>
      </defs>

      {/* LEGS - thick, segmented, 4 per side */}
      <g stroke={shellDark} strokeWidth="4" strokeLinecap="round" fill="none">
        {legs.map((d, i) => <path key={i} d={d} />)}
      </g>
      {/* Leg joints */}
      <g fill={shellMid}>
        <circle cx="18" cy={50 + getLegY(0)} r="3" />
        <circle cx="15" cy={56 + getLegY(1)} r="3" />
        <circle cx="82" cy={50 + getLegY(4)} r="3" />
        <circle cx="85" cy={56 + getLegY(5)} r="3" />
      </g>

      {/* BODY - chunky segmented shell */}
      <ellipse cx="50" cy="55" rx="28" ry="20" fill={`url(#${shellGradId})`} stroke={DARK_FANTASY.void} strokeWidth="1.5" />
      <path d="M30,50 Q50,45 70,50" fill="none" stroke={shellDark} strokeWidth="2" opacity="0.6" />
      <path d="M32,58 Q50,54 68,58" fill="none" stroke={shellDark} strokeWidth="1.5" opacity="0.4" />

      {/* Middle segment */}
      <ellipse cx="50" cy="40" rx="22" ry="14" fill={shellMid} stroke={DARK_FANTASY.void} strokeWidth="1" />

      {/* HEAD/MASK */}
      <ellipse cx="50" cy="26" rx="18" ry="15" fill={`url(#${maskGradId})`} stroke={DARK_FANTASY.void} strokeWidth="1" />
      <path d="M35,22 Q50,16 65,22" fill="none" stroke={maskLight} strokeWidth="2" opacity="0.5" />

      {/* MANDIBLES */}
      {mandibles.map((d, i) => <path key={i} d={d} fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" />)}
      <circle cx={24 + antennaWiggle * 0.5} cy="45" r="3" fill={shellDark} />
      <circle cx={76 - antennaWiggle * 0.5} cy="45" r="3" fill={shellDark} />

      {/* HORNS */}
      {horns.map((d, i) => <path key={i} d={d} fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" />)}

      {/* EYES - void black with orange glow */}
      <g filter={`url(#${glowId})`}>
        <ellipse cx="40" cy="24" rx="6" ry="8" fill={DARK_FANTASY.void} />
        <ellipse cx="60" cy="24" rx="6" ry="8" fill={DARK_FANTASY.void} />
        <ellipse cx="40" cy="24" rx="4" ry="5" fill={infected} opacity="0.7" />
        <ellipse cx="60" cy="24" rx="4" ry="5" fill={infected} opacity="0.7" />
        <ellipse cx="38" cy="22" rx="2" ry="2.5" fill={infectedBright} opacity="0.8" />
        <ellipse cx="58" cy="22" rx="2" ry="2.5" fill={infectedBright} opacity="0.8" />
      </g>

      {/* INFECTION GROWTHS */}
      <g filter={`url(#${glowId})`}>
        <ellipse className={`${bugMotion.shape} ${bugMotion.swellWide}`} cx="50" cy="50" rx="10" ry="8" fill={infected} opacity="0.85" />
        <ellipse className={`${bugMotion.shape} ${bugMotion.swellTall}`} cx="35" cy="56" rx="7" ry="5" fill={infected} opacity="0.75" />
        <ellipse className={`${bugMotion.shape} ${bugMotion.swellTallSlow}`} cx="65" cy="56" rx="7" ry="5" fill={infected} opacity="0.75" />
        <circle cx="42" cy="60" r="4" fill={infected} opacity="0.5" />
        <circle cx="58" cy="62" r="3" fill={infected} opacity="0.45" />
        <circle cx="50" cy="38" r="5" fill={infected} opacity="0.6" />
      </g>

      <ellipse cx="48" cy="47" rx="3" ry="2" fill={infectedBright} opacity="0.35" />

      {/* HIT FLASH - the bug's silhouette in bone, drawn over it; the scene writes its opacity on a hit */}
      <g data-bug-hit="" fill={DARK_FANTASY.bone} stroke={DARK_FANTASY.bone} strokeLinecap="round" opacity="0">
        <g fill="none" strokeWidth="4">
          {legs.map((d, i) => <path key={i} d={d} />)}
        </g>
        <ellipse cx="50" cy="55" rx="28" ry="20" strokeWidth="1.5" />
        <ellipse cx="50" cy="40" rx="22" ry="14" strokeWidth="1" />
        <ellipse cx="50" cy="26" rx="18" ry="15" strokeWidth="1" />
        <g fill="none" strokeWidth="5">
          {mandibles.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="none" strokeWidth="3">
          {horns.map((d, i) => <path key={i} d={d} />)}
        </g>
      </g>
    </svg>
  )
})

/**
 * DEAD BUG - HK Boss style corpse
 * ================================
 * Matches the BattleBug design but:
 * - Flipped/rotated
 * - Curled legs
 * - Dimmed colors
 * - Dripping blood animation
 * - Exhaling smoke
 */
export const DeadBugCreature = memo(function DeadBugCreature({ size = 120, x = 0, y = 0 }: { size?: number; x?: number; y?: number }) {
  const shell = DARK_FANTASY.shell
  const shellMid = DARK_FANTASY.shellMid
  const shellDark = DARK_FANTASY.shellDark
  const mask = DARK_FANTASY.bugMask
  const infected = DARK_FANTASY.infected
  const infectedDim = DARK_FANTASY.infectedDark
  const shellGradId = `${useId()}deadShell`

  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size * BUG_ASPECT}
      viewBox="0 0 100 85"
      overflow="visible"
      opacity="0.85"
      className="[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--df-infected)_25%,transparent))]"
    >
      <g transform="rotate(180 50 42.5)">
      <defs>
        <radialGradient id={shellGradId} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="70%" stopColor={shellMid} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
      </defs>

      {/* CURLED LEGS - dead, pointing inward */}
      <g stroke={shellDark} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6">
        <path d="M28,45 Q22,38 26,30" />
        <path d="M25,52 Q18,44 22,36" />
        <path d="M26,58 Q20,50 24,42" />
        <path d="M30,62 Q26,56 28,50" />
        <path d="M72,45 Q78,38 74,30" />
        <path d="M75,52 Q82,44 78,36" />
        <path d="M74,58 Q80,50 76,42" />
        <path d="M70,62 Q74,56 72,50" />
      </g>

      {/* BODY - dimmed */}
      <ellipse cx="50" cy="55" rx="28" ry="20" fill={`url(#${shellGradId})`} stroke={DARK_FANTASY.void} strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="50" cy="40" rx="22" ry="14" fill={shellMid} stroke={DARK_FANTASY.void} strokeWidth="1" opacity="0.8" />

      {/* HEAD/MASK */}
      <ellipse cx="50" cy="26" rx="18" ry="15" fill={mask} stroke={DARK_FANTASY.void} strokeWidth="1" opacity="0.8" />

      {/* MANDIBLES - drooped */}
      <path d="M36,32 Q30,42 28,52" fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M64,32 Q70,42 72,52" fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* HORNS - drooped */}
      <path d="M38,14 Q30,20 24,28" fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M62,14 Q70,20 76,28" fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* CLOSED EYES - dimmed */}
      <ellipse cx="40" cy="24" rx="5" ry="4" fill={DARK_FANTASY.void} opacity="0.8" />
      <ellipse cx="60" cy="24" rx="5" ry="4" fill={DARK_FANTASY.void} opacity="0.8" />
      <ellipse cx="40" cy="24" rx="3" ry="2" fill={infectedDim} opacity="0.4" />
      <ellipse cx="60" cy="24" rx="3" ry="2" fill={infectedDim} opacity="0.4" />

      {/* Dimmed infection - leaking */}
      <ellipse cx="50" cy="50" rx="8" ry="6" fill={infectedDim} opacity="0.35" />
      <ellipse cx="38" cy="56" rx="5" ry="4" fill={infectedDim} opacity="0.25" />
      <ellipse cx="62" cy="56" rx="5" ry="4" fill={infectedDim} opacity="0.25" />

      {/* DRIPPING BLOOD - animated */}
      <g>
        <ellipse cx="50" cy="72" rx="12" ry="4" fill={infected} opacity="0.5" />
        {/* Drip 1 */}
        <ellipse className={`${bugMotion.shape} ${bugMotion.drip} ${bugMotion.dripA}`} cx="46" cy="60" rx="2" ry="3" fill={infected} opacity="0.6" />
        {/* Drip 2 */}
        <ellipse className={`${bugMotion.shape} ${bugMotion.drip} ${bugMotion.dripB}`} cx="54" cy="58" rx="1.5" ry="2.5" fill={infected} opacity="0.5" />
        {/* Drip 3 */}
        <ellipse className={`${bugMotion.shape} ${bugMotion.drip} ${bugMotion.dripC}`} cx="50" cy="62" rx="2.5" ry="4" fill={infected} opacity="0.55" />
      </g>

      {/* SMOKE/STEAM - rising from body */}
      <g opacity="0.4">
        <ellipse className={`${bugMotion.shape} ${bugMotion.smoke} ${bugMotion.smokeA}`} cx="45" cy="40" rx="3" ry="2" fill={DARK_FANTASY.dust} opacity="0.4" />
        <ellipse className={`${bugMotion.shape} ${bugMotion.smoke} ${bugMotion.smokeB}`} cx="55" cy="42" rx="2.5" ry="1.5" fill={DARK_FANTASY.dustDark} opacity="0.35" />
        <ellipse className={`${bugMotion.shape} ${bugMotion.smoke} ${bugMotion.smokeC}`} cx="50" cy="36" rx="2" ry="1.5" fill={DARK_FANTASY.dustLight} opacity="0.3" />
      </g>
      </g>
    </svg>
  )
})
