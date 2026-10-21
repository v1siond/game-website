'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { WC3 } from './palette'
import { InfernalGolemSVG } from './character'

// The Reign of Chaos backdrop: storm clouds and lightning, rain, the olive battlefield and the golem's fall.

export const ReignOfChaosAtmosphere = memo(function ReignOfChaosAtmosphere() {
  const lightningActive = false
  const lightningX = 50
  const cloudGlow = 0
  const [ambientFlash, setAmbientFlash] = useState(false)
  const [ambientFlashX, setAmbientFlashX] = useState(30)
  // Cloud zones for realistic sequential flashing (left, center-left, center, center-right, right)
  const cloudZones = useMemo(() => [
    { x: 12, y: 25, spread: 15 },   // left
    { x: 30, y: 35, spread: 18 },   // center-left
    { x: 50, y: 28, spread: 20 },   // center
    { x: 70, y: 32, spread: 18 },   // center-right
    { x: 88, y: 30, spread: 15 },   // right
  ], [])
  const [activeZone, setActiveZone] = useState(0)
  const lastZoneRef = useRef(-1)
  // Occasional falling meteor (every 8-15 seconds, like old golem spawn cadence)
  const [fallingMeteor, setFallingMeteor] = useState<{
    id: number
    startX: number
    direction: 'left' | 'right'
    active: boolean
  } | null>(null)

  // Right-side golem spawn sequence: meteor → explosion → assembly → final
  const [golemPhase, setGolemPhase] = useState<'waiting' | 'meteor' | 'explosion' | 'assembling' | 'final'>('waiting')
  const [hideAssembly, setHideAssembly] = useState(false)

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    // Phase 1: Meteor falls (starts after 2s, lasts 1.5s)
    timeouts.push(setTimeout(() => setGolemPhase('meteor'), 2000))

    // Phase 2: Explosion on impact (after meteor lands)
    timeouts.push(setTimeout(() => setGolemPhase('explosion'), 3500))

    // Phase 3: Rocks start assembling (after explosion)
    timeouts.push(setTimeout(() => setGolemPhase('assembling'), 4200))

    // Phase 4: Final detailed golem appears (assembly stays visible)
    timeouts.push(setTimeout(() => setGolemPhase('final'), 6500))

    // Phase 5: Hide assembly after final is fully visible (0.5s overlap)
    timeouts.push(setTimeout(() => setHideAssembly(true), 7000))

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [])

  // Occasional meteor spawn (every 8-15 seconds)
  useEffect(() => {
    let meteorId = 0
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const spawnMeteor = () => {
      if (!isActive) return
      const id = meteorId++
      const startX = 15 + Math.random() * 70
      const direction = Math.random() > 0.5 ? 'left' : 'right'

      setFallingMeteor({ id, startX, direction: direction as 'left' | 'right', active: true })

      // Clear meteor after animation (4s)
      timeouts.push(setTimeout(() => {
        if (!isActive) return
        setFallingMeteor(null)
      }, 4000))
    }

    const scheduleNext = () => {
      if (!isActive) return
      // Every 8-15 seconds (like old golem cadence)
      const delay = 8000 + Math.random() * 7000
      timeouts.push(setTimeout(() => {
        spawnMeteor()
        scheduleNext()
      }, delay))
    }

    // First meteor after 2 seconds
    timeouts.push(setTimeout(spawnMeteor, 2000))
    scheduleNext()

    return () => {
      isActive = false
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [])

  // Ambient thunder flashes - realistic sequential cloud zone flashing
  useEffect(() => {
    let isActive = true
    const timeouts: NodeJS.Timeout[] = []

    const triggerAmbientFlash = () => {
      if (!isActive) return

      // Pick a cloud zone different from the last one
      let newZone = Math.floor(Math.random() * cloudZones.length)
      while (newZone === lastZoneRef.current && cloudZones.length > 1) {
        newZone = Math.floor(Math.random() * cloudZones.length)
      }
      lastZoneRef.current = newZone

      const zone = cloudZones[newZone]
      // Add slight variation within the zone
      const flashX = zone.x + (Math.random() - 0.5) * zone.spread * 0.5
      setAmbientFlashX(flashX)
      setActiveZone(newZone)
      setAmbientFlash(true)

      // Quick double-flash effect (realistic lightning flicker)
      timeouts.push(setTimeout(() => setAmbientFlash(false), 80))
      timeouts.push(setTimeout(() => setAmbientFlash(true), 120))
      timeouts.push(setTimeout(() => setAmbientFlash(false), 200))

      // Sometimes chain to adjacent zone (30% chance)
      if (Math.random() > 0.7) {
        const adjacentZone = newZone + (Math.random() > 0.5 ? 1 : -1)
        if (adjacentZone >= 0 && adjacentZone < cloudZones.length) {
          const adjZone = cloudZones[adjacentZone]
          timeouts.push(setTimeout(() => {
            setAmbientFlashX(adjZone.x + (Math.random() - 0.5) * 8)
            setActiveZone(adjacentZone)
            setAmbientFlash(true)
          }, 300))
          timeouts.push(setTimeout(() => setAmbientFlash(false), 400))
        }
      }
    }

    const scheduleAmbientFlash = () => {
      if (!isActive) return
      // Flash every 2-5 seconds for frequent storm effect
      const delay = 2000 + Math.random() * 3000
      timeouts.push(setTimeout(() => {
        triggerAmbientFlash()
        scheduleAmbientFlash()
      }, delay))
    }

    // Start after a short delay
    timeouts.push(setTimeout(scheduleAmbientFlash, 800))

    return () => {
      isActive = false
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [cloudZones])

  // Rain drops - longer animation cycles = fewer repaints = better performance
  // Reduced particle counts for performance
  const raindrops = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 130 - 15,
      delay: Math.random() * -4,
      duration: 2.5 + Math.random() * 1.5, // 2.5-4s (was 0.6-0.9s) - much fewer repaints
      length: 25 + Math.random() * 30,
    })),
    []
  )

  // Wind streaks - reduced for performance
  const rainWindStreaks = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      y: 15 + i * 16,
      delay: Math.random() * -6,
      duration: 2 + Math.random() * 1.5,
      length: 100 + Math.random() * 150,
      thickness: 1 + Math.random() * 0.5,
    })),
    []
  )

  return (
    <>
      {/* GREEN-BROWN tinted stormy sky - matching WC3 RoC aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          #0a1812 0%,
          #0d1f15 10%,
          #102518 20%,
          #152d1c 35%,
          #1a3520 50%,
          #182a1a 65%,
          #152518 80%,
          #101a12 90%,
          #080f0a 100%)`
      }} />

      {/* === WC3 ROC MENU BACKGROUND - Grassy battlefield with war debris === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 1000 850" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Grass ground gradient */}
          <linearGradient id="grassGround" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3520" />
            <stop offset="50%" stopColor="#152a18" />
            <stop offset="100%" stopColor="#0d1a0f" />
          </linearGradient>
          {/* Water/puddle gradient */}
          <linearGradient id="waterPuddle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3040" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d1820" stopOpacity="0.8" />
          </linearGradient>
          {/* Banner red */}
          <linearGradient id="bannerRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa2020" />
            <stop offset="50%" stopColor="#881515" />
            <stop offset="100%" stopColor="#661010" />
          </linearGradient>
          {/* Shield orange */}
          <linearGradient id="shieldOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cc8844" />
            <stop offset="50%" stopColor="#aa6633" />
            <stop offset="100%" stopColor="#885522" />
          </linearGradient>
          {/* Metal */}
          <linearGradient id="metalGray" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a6a65" />
            <stop offset="50%" stopColor="#4a4a45" />
            <stop offset="100%" stopColor="#3a3a35" />
          </linearGradient>
          {/* Wood pole */}
          <linearGradient id="woodBrown" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a3520" />
            <stop offset="50%" stopColor="#3a2815" />
            <stop offset="100%" stopColor="#2a1a0a" />
          </linearGradient>
          {/* Dirt patch gradient */}
          <radialGradient id="dirtPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d3020" />
            <stop offset="60%" stopColor="#2a2218" />
            <stop offset="100%" stopColor="#1a1812" stopOpacity="0" />
          </radialGradient>
          {/* Sandy patch gradient */}
          <radialGradient id="sandPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a4030" />
            <stop offset="50%" stopColor="#3a3528" />
            <stop offset="100%" stopColor="#2a2820" stopOpacity="0" />
          </radialGradient>
          {/* Dead grass gradient - brownish green */}
          <radialGradient id="deadGrass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3020" />
            <stop offset="70%" stopColor="#252818" />
            <stop offset="100%" stopColor="#1a2015" stopOpacity="0" />
          </radialGradient>
          <filter id="rocDistantBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <filter id="rocMidBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="felGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          {/* Ground fade - green tint to blend with sky */}
          <linearGradient id="rocGroundFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1a15" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#0d2018" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* === DENSE STORM CLOUDS - Top 15-20% only === */}
        <g opacity="0.95">
          {/* Dense cloud bank - concentrated at very top */}
          <ellipse cx="150" cy="20" rx="250" ry="50" fill="#030603" />
          <ellipse cx="400" cy="15" rx="300" ry="45" fill="#020502" />
          <ellipse cx="700" cy="25" rx="280" ry="55" fill="#030603" />
          <ellipse cx="950" cy="18" rx="220" ry="48" fill="#020502" />
          {/* Second layer - slightly lower */}
          <ellipse cx="80" cy="55" rx="180" ry="40" fill="#040804" />
          <ellipse cx="300" cy="48" rx="200" ry="42" fill="#050a05" />
          <ellipse cx="550" cy="52" rx="220" ry="45" fill="#040804" />
          <ellipse cx="800" cy="50" rx="190" ry="40" fill="#050a05" />
          {/* Bottom edge - wispy, max ~120px from top (12% of 1000) */}
          <ellipse cx="200" cy="85" rx="140" ry="30" fill="#060b06" opacity="0.7" />
          <ellipse cx="500" cy="80" rx="180" ry="35" fill="#050a05" opacity="0.6" />
          <ellipse cx="750" cy="90" rx="150" ry="28" fill="#060b06" opacity="0.5" />
        </g>

        {/* === DISTANT ROCKY CLIFF SILHOUETTE - Gray, far background === */}
        <g filter="url(#rocDistantBlur)" opacity="0.7">
          {/* Main cliff shape - like WC3 reference */}
          <path d="M550,180 L600,120 L650,140 L720,80 L780,110 L850,90 L920,130 L1000,100 L1000,350 L550,350 Z" fill={WC3.roc.rockSilhouette} />
          <path d="M600,150 L640,130 L680,145 L720,100 L750,120" stroke={WC3.roc.rockDistant} strokeWidth="3" fill="none" opacity="0.4" />
        </g>

        {/* === ATMOSPHERIC FOG LAYER - Creates depth === */}
        <rect x="0" y="150" width="1000" height="200" fill="url(#rocGroundFade)" opacity="0.5" />

        {/* === GREENISH EARTHY GROUND - Like flagpole dirt === */}
        <g>
          {/* Main ground plane - greenish earth tones */}
          <ellipse cx="500" cy="650" rx="700" ry="280" fill={WC3.roc.groundDark} />
          <ellipse cx="500" cy="700" rx="650" ry="250" fill={WC3.roc.groundGreen} opacity="0.9" />
          <ellipse cx="500" cy="720" rx="600" ry="220" fill={WC3.roc.groundMid} opacity="0.7" />
          {/* Ground variation patches */}
          <ellipse cx="200" cy="550" rx="120" ry="50" fill={WC3.roc.groundDark} opacity="0.6" />
          <ellipse cx="600" cy="520" rx="150" ry="60" fill={WC3.roc.groundGreen} opacity="0.5" />
          <ellipse cx="850" cy="580" rx="100" ry="45" fill={WC3.roc.groundMid} opacity="0.5" />
        </g>

        {/* === WATER PUDDLES - Reflective dark areas === */}
        <g>
          <ellipse cx="150" cy="720" rx="100" ry="40" fill={WC3.roc.waterDark} opacity="0.7" />
          <ellipse cx="155" cy="715" rx="70" ry="25" fill="#253540" opacity="0.5" />
          <ellipse cx="400" cy="680" rx="80" ry="35" fill={WC3.roc.waterDark} opacity="0.6" />
        </g>

        {/* === OLIVE-GREEN GRASS - WC3 Style, clustered naturally === */}
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

            // OLIVE-GREEN grass colors (like WC3 reference)
            const colors = [
              WC3.roc.grassOlive,    // #5a5a30 - main olive
              WC3.roc.grassYellow,   // #6a6535 - yellowish
              WC3.roc.grassDark,     // #4a4a28 - darker
              WC3.roc.grassLight,    // #7a7040 - highlights
              '#555530',             // mid olive
              '#656535',             // yellow-olive
            ]
            const color = colors[(i + bladeInCluster) % 6]

            // Animate some foreground blades
            const animated = bladeInCluster === 2 && perspectiveFactor > 0.6 && clusterIndex % 4 === 0

            return (
              <path
                key={`grass${i}`}
                d={`M${x},${baseY} Q${x + bladeCurve * 0.7},${baseY - height * 0.55} ${x + bladeCurve},${baseY - height}`}
                stroke={color}
                strokeWidth={strokeW}
                fill="none"
                strokeLinecap="round"
                opacity={opacity}
                style={animated ? {
                  transformOrigin: `${x}px ${baseY}px`,
                  animation: `grassBlade ${2.0 + (clusterIndex % 3) * 0.4}s ease-in-out infinite`,
                } : undefined}
              />
            )
          })}
        </g>

        {/* === CATTAILS/REEDS near water (like WC3) === */}
        <g>
          {[90, 120, 155, 190, 370, 400, 440].map((x, i) => (
            <g key={`reed${i}`}>
              {/* Stem */}
              <path
                d={`M${x},${740 - i * 6} Q${x + 1},${700 - i * 6} ${x + 2},${660 - i * 8}`}
                stroke="#3a3520"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Brown bulrush head */}
              <ellipse cx={x + 2} cy={652 - i * 10} rx="4" ry="12" fill="#2a1a10" />
              <ellipse cx={x + 2} cy={650 - i * 10} rx="3" ry="10" fill="#3a2a18" />
            </g>
          ))}
        </g>

        {/* === MID-GROUND ELEMENTS === */}
        <g filter="url(#rocMidBlur)" opacity="0.7">
          {/* Broken wooden structure left (like WC3 banner frame) */}
          <g transform="translate(280, 380)">
            <rect x="0" y="0" width="8" height="120" fill="#3a2815" transform="rotate(-8)" />
            <rect x="60" y="-20" width="6" height="100" fill="#2a1a0a" transform="rotate(12)" />
            <rect x="-10" y="40" width="80" height="6" fill="#3a2815" transform="rotate(-5)" />
          </g>
          {/* Distant sword in ground */}
          <g transform="translate(520, 420)">
            <rect x="0" y="0" width="4" height="50" fill="#5a5a55" transform="rotate(-10)" />
            <rect x="-8" y="45" width="20" height="4" fill="#4a4a45" />
          </g>
        </g>

        {/* === FOREGROUND ROCKS - Small, warmer brown === */}
        <g opacity="0.8">
          <polygon points="50,780 70,755 95,770 110,780" fill="#4a4035" />
          <polygon points="900,770 920,745 945,760 960,775" fill="#4a4035" />
          <polygon points="300,800 325,775 350,785" fill="#3a3025" opacity="0.7" />
        </g>

        {/* === MID LAYER - Remaining stone pillar === */}
        <g filter="url(#rocMidBlur)" opacity="0.5">
          <g transform="translate(650, 380)">
            <rect x="0" y="0" width="30" height="100" fill={WC3.roc.rockDistant} />
          </g>
        </g>

        {/* === WAR DEBRIS - Weapons and items scattered on battlefield === */}
        <g>
          {/* === TOP-GROUND DEBRIS (y=380-450) - Distant battlefield debris === */}

          {/* Distant fallen banner - top left */}
          <g transform="translate(80, 400) rotate(12)">
            <rect x="0" y="-1" width="35" height="2" fill="#3a2a18" opacity="0.35" />
            <polygon points="35,-8 50,-5 48,5 35,8" fill="#552222" opacity="0.3" />
          </g>

          {/* Distant broken cart wheel - top center-left */}
          <g transform="translate(250, 420)">
            <ellipse cx="0" cy="0" rx="18" ry="7" fill="#3a3028" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="14" ry="5" fill="none" stroke="#2a2018" strokeWidth="2" opacity="0.3" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#2a2018" strokeWidth="1.5" opacity="0.25" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#2a2018" strokeWidth="1.5" opacity="0.25" />
          </g>

          {/* Distant pile of bodies (shadow) - top center */}
          <ellipse cx="450" cy="390" rx="50" ry="15" fill="#151812" opacity="0.25" />
          <ellipse cx="470" cy="385" rx="30" ry="10" fill="#1a1a15" opacity="0.2" />

          {/* Distant catapult wreckage - top right */}
          <g transform="translate(700, 410) rotate(-8)">
            <rect x="0" y="0" width="40" height="4" fill="#3a2a18" opacity="0.3" />
            <rect x="35" y="-12" width="4" height="16" fill="#3a2a18" opacity="0.25" />
            <polygon points="8,-3 15,-8 22,-3" fill="#2a2018" opacity="0.25" />
          </g>

          {/* Distant rocks/boulders - top scattered */}
          <polygon points="150,430 168,418 185,428" fill="#252220" opacity="0.3" />
          <polygon points="550,400 570,388 590,398" fill="#202018" opacity="0.25" />
          <polygon points="850,420 870,408 888,418" fill="#252220" opacity="0.3" />

          {/* Distant arrows in ground - top */}
          <g transform="translate(320, 395) rotate(-75)">
            <rect x="0" y="0" width="18" height="1.5" fill="#3a2a18" opacity="0.3" />
            <polygon points="18,-2 23,0 18,2" fill="#4a4a45" opacity="0.25" />
          </g>
          <g transform="translate(620, 405) rotate(-82)">
            <rect x="0" y="0" width="15" height="1.5" fill="#3a2a18" opacity="0.25" />
            <polygon points="15,-2 20,0 15,2" fill="#4a4a45" opacity="0.2" />
          </g>

          {/* === MID-GROUND DEBRIS (y=450-650) - More detailed === */}

          {/* Broken sword with blood stain - mid left */}
          <g transform="translate(180, 520) rotate(-15)">
            <ellipse cx="5" cy="5" rx="12" ry="6" fill="#2a1515" opacity="0.4" />
            <rect x="-2" y="-35" width="4" height="32" fill="#5a5a55" opacity="0.75" />
            <rect x="-1" y="-33" width="2" height="28" fill="#7a7a75" opacity="0.5" />
            <polygon points="-3,-35 0,-44 3,-35" fill="#6a6a65" opacity="0.75" />
            <rect x="-6" y="-5" width="12" height="5" fill="#4a4a45" opacity="0.75" />
            <rect x="-3" y="0" width="6" height="8" fill="#3a2815" opacity="0.7" />
          </g>

          {/* Detailed shield lying flat - mid center-left */}
          <g transform="translate(320, 560)">
            <ellipse cx="2" cy="3" rx="38" ry="16" fill="#1a1815" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="38" ry="15" fill="#4a4540" opacity="0.65" />
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="#5a5550" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill="#3a3530" opacity="0.6" />
            <path d="M-25,-8 L22,10" stroke="#2a2520" strokeWidth="3" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="36" ry="14" fill="none" stroke="#3a3530" strokeWidth="2" opacity="0.5" />
          </g>

          {/* Broken spear with detailed shaft - mid center */}
          <g transform="translate(480, 510) rotate(25)">
            <ellipse cx="25" cy="4" rx="28" ry="5" fill="#1a1815" opacity="0.25" />
            <rect x="0" y="-2" width="55" height="4" fill="#4a3a28" opacity="0.65" />
            <rect x="2" y="-1" width="50" height="2" fill="#5a4a38" opacity="0.5" />
            <polygon points="55,-4 65,0 55,4" fill="#5a5a55" opacity="0.6" />
          </g>

          {/* War hammer - mid center-right */}
          <g transform="translate(600, 530) rotate(-20)">
            <ellipse cx="15" cy="5" rx="20" ry="5" fill="#1a1815" opacity="0.25" />
            <rect x="0" y="-2" width="35" height="4" fill="#4a3a28" opacity="0.6" />
            <rect x="30" y="-10" width="12" height="20" fill="#5a5a55" opacity="0.6" />
            <rect x="31" y="-8" width="10" height="16" fill="#6a6a65" opacity="0.4" />
          </g>

          {/* Detailed axe - mid right */}
          <g transform="translate(680, 540) rotate(-35)">
            <ellipse cx="12" cy="5" rx="15" ry="4" fill="#1a1815" opacity="0.25" />
            <rect x="0" y="-2" width="24" height="4" fill="#4a3a28" opacity="0.65" />
            <rect x="1" y="-1" width="22" height="2" fill="#5a4a38" opacity="0.4" />
            <path d="M22,-8 Q32,-4 30,0 Q32,4 22,8 L22,-8" fill="#5a5a55" opacity="0.65" />
            <path d="M23,-6 Q29,-3 28,0 Q29,3 23,6" fill="#7a7a75" opacity="0.4" />
          </g>

          {/* Detailed helmet with dent - mid far right */}
          <g transform="translate(820, 580)">
            <ellipse cx="0" cy="4" rx="18" ry="6" fill="#1a1815" opacity="0.3" />
            <ellipse cx="0" cy="0" rx="18" ry="8" fill="#5a5a55" opacity="0.55" />
            <ellipse cx="0" cy="-3" rx="14" ry="6" fill="#6a6a65" opacity="0.5" />
            <ellipse cx="5" cy="-1" rx="5" ry="3" fill="#4a4a45" opacity="0.4" />
            <path d="M-8,-6 Q-5,-10 2,-8" stroke="#3a3a35" strokeWidth="1.5" fill="none" opacity="0.4" />
          </g>

          {/* More rocks - mid ground scattered */}
          <polygon points="250,500 268,486 288,498" fill="#2a2520" opacity="0.5" />
          <polygon points="252,502 266,495 275,503" fill="#353028" opacity="0.35" />
          <polygon points="420,550 440,536 460,548" fill="#252220" opacity="0.45" />
          <polygon points="580,490 598,478 618,490" fill="#2a2520" opacity="0.45" />
          <polygon points="750,520 765,508 782,518" fill="#252220" opacity="0.5" />
          <polygon points="900,540 918,528 935,538" fill="#202018" opacity="0.4" />

          {/* Fallen warrior shadows with armor glint - mid ground */}
          <ellipse cx="380" cy="540" rx="40" ry="14" fill="#151812" opacity="0.4" />
          <ellipse cx="385" cy="538" rx="8" ry="3" fill="#3a3a35" opacity="0.2" />
          <ellipse cx="620" cy="505" rx="35" ry="12" fill="#151812" opacity="0.35" />
          <ellipse cx="615" cy="503" rx="6" ry="2" fill="#4a4a45" opacity="0.15" />

          {/* Multiple arrows stuck in ground - mid */}
          <g transform="translate(550, 530) rotate(-80)">
            <rect x="0" y="-1" width="28" height="2" fill="#4a3a28" opacity="0.65" />
            <polygon points="28,-3 36,0 28,3" fill="#5a5a55" opacity="0.6" />
            <polygon points="0,-2 -4,0 0,2" fill="#3a3028" opacity="0.5" />
          </g>
          <g transform="translate(530, 545) rotate(-72)">
            <rect x="0" y="-1" width="22" height="1.5" fill="#3a2a18" opacity="0.55" />
            <polygon points="22,-2 28,0 22,2" fill="#4a4a45" opacity="0.5" />
          </g>

          {/* Broken shield with emblem - mid left */}
          <g transform="translate(140, 570)">
            <ellipse cx="2" cy="3" rx="26" ry="11" fill="#1a1815" opacity="0.3" />
            <ellipse cx="0" cy="0" rx="26" ry="10" fill="#4a3a30" opacity="0.55" />
            <ellipse cx="0" cy="0" rx="20" ry="8" fill="#5a4a40" opacity="0.5" />
            <circle cx="0" cy="0" r="6" fill="#3a2a20" opacity="0.5" />
            <path d="M-18,-5 L20,7" stroke="#2a2018" strokeWidth="3" opacity="0.45" />
          </g>

          {/* === FOREGROUND DEBRIS (y=700-800) - Original positions === */}

          {/* === SWORD 1 - Stuck in ground at angle (left side) === */}
          <g transform="translate(120, 730) rotate(-25)">
            <rect x="-2" y="-60" width="4" height="55" fill="#5a5a55" />
            <rect x="-1" y="-58" width="2" height="50" fill="#7a7a75" />
            <rect x="-8" y="-8" width="16" height="6" fill="#4a4a45" rx="1" />
            <rect x="-3" y="-2" width="6" height="12" fill="#3a2815" />
            <ellipse cx="0" cy="8" rx="4" ry="2" fill="#2a1a0a" />
          </g>

          {/* === AXE 1 - Lying flat on ground (center-left) === */}
          <g transform="translate(350, 765) rotate(15)">
            <rect x="0" y="-3" width="50" height="5" fill="#4a3520" rx="2" />
            <rect x="1" y="-2" width="48" height="3" fill="#5a4530" />
            <path d="M48,-12 Q58,-8 55,0 Q58,8 48,12 L48,-12" fill="#5a5a55" />
            <path d="M49,-10 Q56,-6 54,0 Q56,6 49,10" fill="#7a7a75" stroke="none" />
            <ellipse cx="25" cy="4" rx="25" ry="5" fill="#1a1510" opacity="0.3" />
          </g>

          {/* === SPEAR - Broken, lying on ground (right side) === */}
          <g transform="translate(720, 750) rotate(-8)">
            <rect x="0" y="-2" width="80" height="4" fill="#4a3a28" />
            <rect x="1" y="-1" width="78" height="2" fill="#5a4a38" />
            <polygon points="80,-5 95,0 80,5" fill="#6a6a65" />
            <polygon points="81,-3 92,0 81,3" fill="#8a8a85" />
            <ellipse cx="40" cy="5" rx="40" ry="4" fill="#1a1510" opacity="0.25" />
          </g>

          {/* === SWORD 2 - Broken blade on ground (far right) === */}
          <g transform="translate(880, 760) rotate(35)">
            <rect x="-2" y="-30" width="4" height="25" fill="#5a5a55" />
            <polygon points="-2,-30 0,-38 2,-30" fill="#6a6a65" />
            <rect x="-6" y="-8" width="12" height="5" fill="#4a4a45" />
            <ellipse cx="0" cy="3" rx="10" ry="3" fill="#1a1510" opacity="0.3" />
          </g>

          {/* === AXE 2 - Small hand axe (mid ground) === */}
          <g transform="translate(480, 755) rotate(-40)">
            <rect x="0" y="-2" width="25" height="4" fill="#4a3520" rx="1" />
            <path d="M24,-8 Q32,-4 30,0 Q32,4 24,8 L24,-8" fill="#5a5a55" />
            <ellipse cx="12" cy="4" rx="12" ry="3" fill="#1a1510" opacity="0.25" />
          </g>

          {/* === ORANGE SHIELD - Lying flat on ground (center-right) === */}
          <g transform="translate(620, 720)">
            <ellipse cx="0" cy="0" rx="70" ry="28" fill="url(#shieldOrange)" />
            <ellipse cx="0" cy="0" rx="60" ry="23" fill="#bb7744" />
            <ellipse cx="0" cy="0" rx="20" ry="9" fill="#aa6633" />
            <ellipse cx="-4" cy="-2" rx="12" ry="5" fill="#cc9955" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="68" ry="27" fill="none" stroke="#664422" strokeWidth="3" />
          </g>

          {/* === ROUND SHIELD 2 - Smaller, darker (left side) === */}
          <g transform="translate(80, 780)">
            <ellipse cx="0" cy="0" rx="45" ry="18" fill="#4a4540" />
            <ellipse cx="0" cy="0" rx="38" ry="15" fill="#5a5550" />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill="#3a3530" />
            <ellipse cx="0" cy="0" rx="43" ry="17" fill="none" stroke="#3a3530" strokeWidth="2" />
          </g>

          {/* === HELMET - Dented, on ground === */}
          <g transform="translate(550, 775)">
            <ellipse cx="0" cy="0" rx="20" ry="10" fill="#5a5a55" />
            <ellipse cx="0" cy="-4" rx="16" ry="8" fill="#6a6a65" />
            <ellipse cx="0" cy="3" rx="18" ry="5" fill="#1a1510" opacity="0.3" />
          </g>

          {/* === FALLEN WARRIOR SILHOUETTES === */}
          <ellipse cx="280" cy="755" rx="45" ry="15" fill="#1a2018" opacity="0.5" />
          <ellipse cx="550" cy="740" rx="40" ry="14" fill="#1a2018" opacity="0.4" />

          {/* === WATER PUDDLE - Reflective blue === */}
          <g transform="translate(850, 790)">
            <ellipse cx="0" cy="0" rx="90" ry="35" fill="url(#waterPuddle)" />
            <ellipse cx="-8" cy="-4" rx="70" ry="25" fill="#1a3040" opacity="0.4" />
            <ellipse cx="-25" cy="-8" rx="20" ry="6" fill="#253545" opacity="0.3" />
          </g>

          {/* === ROCKS - Earthy tones === */}
          <polygon points="180,795 195,780 215,792" fill="#353028" opacity="0.5" />
          <polygon points="380,798 398,785 418,795" fill="#302a22" opacity="0.4" />
          <polygon points="760,796 775,783 792,794" fill="#302a22" opacity="0.4" />

          {/* === HORDE WAR BANNER - Hidden here, rendered as fixed element above infernals === */}
          <g transform="translate(200, 520) rotate(-10)" className="war-banner" opacity="0">
            {/* Dirt mound at pole base - dark brownish like visible flagpole */}
            <ellipse cx="6" cy="235" rx="25" ry="10" fill="#0c0f0a" />
            <ellipse cx="6" cy="233" rx="20" ry="8" fill="#12150f" />
            <ellipse cx="6" cy="231" rx="12" ry="5" fill="#181a14" />
            {/* Small dirt clumps around base */}
            <ellipse cx="-12" cy="238" rx="8" ry="4" fill="#0c0f0a" opacity="0.7" />
            <ellipse cx="22" cy="240" rx="10" ry="5" fill="#12150f" opacity="0.6" />
            {/* Grass tufts growing from dirt - olive-green */}
            <path d="M-8,232 Q-10,222 -6,218" stroke="#5a5a30" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M18,234 Q22,224 19,220" stroke="#6a6535" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M-15,236 Q-18,228 -14,225" stroke="#4a4a28" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Banner pole */}
            <rect x="0" y="0" width="12" height="230" fill="#3a2815" />
            <rect x="2" y="0" width="8" height="230" fill="#4a3520" />
            <rect x="4" y="5" width="4" height="220" fill="#5a4530" opacity="0.5" />
            {/* Pole top spike */}
            <polygon points="6,-30 -4,5 16,5" fill="#5a4a35" />
            <polygon points="6,-25 0,3 12,3" fill="#6a5a45" />
            {/* Banner fabric with wave columns - Horde skull centered and sliced across columns */}
            <g transform="translate(12, 15)" className="banner-fabric">
              {/* Define clipping regions for skull parts - skull centered at x=44 */}
              <defs>
                <clipPath id="bannerCol1"><rect x="0" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol2"><rect x="18" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol3"><rect x="36" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol4"><rect x="54" y="0" width="18" height="150" /></clipPath>
                <clipPath id="bannerCol5"><rect x="72" y="0" width="18" height="150" /></clipPath>
              </defs>

              {/* Horde skull definition - complete skull to be clipped by each column */}
              {/* Skull is centered at x=44, y=70 relative to banner-fabric */}
              {[
                { id: 1, x: 0, w: 18, delay: '0s', fill: '#aa2525', yOff: 0 },
                { id: 2, x: 18, w: 18, delay: '0.12s', fill: '#992222', yOff: 2 },
                { id: 3, x: 36, w: 18, delay: '0.24s', fill: '#882020', yOff: 4 },
                { id: 4, x: 54, w: 18, delay: '0.36s', fill: '#771818', yOff: 6 },
                { id: 5, x: 72, w: 15, delay: '0.48s', fill: '#661515', yOff: 8 },
              ].map((col) => (
                <g key={col.id} style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: col.delay }}>
                  {/* Fabric column */}
                  <rect x={col.x} y={col.yOff} width={col.w} height={150 - col.yOff} fill={col.fill} />
                  {/* Skull slice - clipped to this column */}
                  <g clipPath={`url(#bannerCol${col.id})`}>
                    <g transform="translate(44, 70)">
                      {/* Orc skull - brutish with lower jaw tusks */}
                      {/* Skull outline - dark embossed */}
                      <ellipse cx="0" cy="-2" rx="24" ry="16" fill="#1a0808" />
                      {/* Skull main shape - wider, flatter */}
                      <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#2a1010" />
                      {/* Brow ridge - pronounced */}
                      <path d="M-18,-8 Q-10,-14 0,-12 Q10,-14 18,-8" stroke="#3a1818" strokeWidth="4" fill="none" />
                      {/* Left eye socket - angular, deep */}
                      <path d="M-12,-6 L-8,-10 L-2,-8 L-4,-2 L-10,-2 Z" fill="#0a0404" />
                      {/* Left eye glow - fel green hint */}
                      <ellipse cx="-7" cy="-5" rx="2" ry="1.5" fill="#2a3320" />
                      {/* Right eye socket - angular, deep */}
                      <path d="M12,-6 L8,-10 L2,-8 L4,-2 L10,-2 Z" fill="#0a0404" />
                      {/* Right eye glow - fel green hint */}
                      <ellipse cx="7" cy="-5" rx="2" ry="1.5" fill="#2a3320" />
                      {/* Nose - just two holes */}
                      <ellipse cx="-2" cy="2" rx="2" ry="3" fill="#0a0404" />
                      <ellipse cx="2" cy="2" rx="2" ry="3" fill="#0a0404" />
                      {/* Jaw - heavy, angular */}
                      <path d="M-16,6 L-14,14 L-8,16 L0,14 L8,16 L14,14 L16,6" fill="#2a1010" />
                      {/* Lower tusks - pointing UP from jaw, darker bone color */}
                      <path d="M-12,12 Q-14,4 -10,-2" stroke="#4a3828" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      <path d="M12,12 Q14,4 10,-2" stroke="#4a3828" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      {/* Tusk highlights */}
                      <path d="M-11,10 Q-13,5 -10,0" stroke="#5a4838" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M11,10 Q13,5 10,0" stroke="#5a4838" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </g>
                  </g>
                </g>
              ))}
              {/* Banner edge fraying */}
              <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill="#2a0a0a" style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.55s' }} />
            </g>
            {/* Pole shadow */}
            <ellipse cx="6" cy="235" rx="15" ry="5" fill="#0a0a08" opacity="0.4" />
          </g>
        </g>

        {/* Ground plane fade */}
        <rect x="0" y="200" width="1000" height="650" fill="url(#rocGroundFade)" />

        {/* === PERSPECTIVE LINES - subtle depth like FT === */}
        <g opacity="0.04">
          {[-60, -35, -15, 0, 15, 35, 60].map((offset, i) => (
            <line key={i} x1={500 + offset * 2} y1="180" x2={offset < 0 ? -400 : offset > 0 ? 1400 : 500} y2="850" stroke="#201820" strokeWidth="1" />
          ))}
        </g>
      </svg>

      {/* === STORMY ATMOSPHERE GLOW - green-tinted like WC3 === */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '50%',
        height: '35%',
        background: 'radial-gradient(ellipse at 30% 40%, #1a3a2512 0%, #0d251806 40%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '5%',
        width: '45%',
        height: '30%',
        background: 'radial-gradient(ellipse at 60% 50%, #2a4a3010 0%, #1a3a2506 50%, transparent 80%)',
        filter: 'blur(55px)',
        pointerEvents: 'none',
      }} />

      {/* Vignette - dark green edges, focused center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, transparent 35%, rgba(5,15,8,0.4) 70%, rgba(0,8,4,0.7) 100%),
          radial-gradient(ellipse 60% 40% at 50% 30%, #0d251810 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Volumetric storm clouds - DARK GREENISH, top 18% only */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '18%' }} viewBox="0 0 1000 180" preserveAspectRatio="none">
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          <filter id="cloudBlurLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <radialGradient id="cloudCore" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#253525" />
            <stop offset="60%" stopColor="#182818" />
            <stop offset="100%" stopColor="#0c1a0c" />
          </radialGradient>
        </defs>
        {/* Dense cloud bank - DARK GREENISH tones */}
        <g filter="url(#cloudBlur)" opacity="0.9">
          <ellipse cx="100" cy="40" rx="200" ry="60" fill="#152515" />
          <ellipse cx="350" cy="30" rx="250" ry="55" fill="#122012" />
          <ellipse cx="600" cy="35" rx="280" ry="65" fill="#152515" />
          <ellipse cx="850" cy="40" rx="220" ry="55" fill="#122012" />
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
          <ellipse cx="150" cy="110" rx="120" ry="35" fill="#1a2a1a" />
          <ellipse cx="400" cy="105" rx="140" ry="38" fill="#152515" />
          <ellipse cx="650" cy="115" rx="130" ry="35" fill="#1a2a1a" />
          <ellipse cx="900" cy="108" rx="120" ry="32" fill="#152515" />
        </g>
        {/* Wisps trailing down */}
        <g opacity="0.5">
          <ellipse cx="250" cy="145" rx="80" ry="25" fill="#1f2f1f" />
          <ellipse cx="550" cy="140" rx="100" ry="28" fill="#1a2a1a" />
          <ellipse cx="800" cy="150" rx="90" ry="25" fill="#1f2f1f" />
        </g>
      </svg>

      {/* Stormy cloud glow - FEL GREEN atmospheric lighting */}
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
            radial-gradient(ellipse at 20% 30%, ${WC3.roc.felMid}40 0%, ${WC3.roc.felDark}20 40%, transparent 70%),
            radial-gradient(ellipse at 50% 25%, ${WC3.roc.felBright}30 0%, ${WC3.roc.felMid}18 35%, transparent 65%),
            radial-gradient(ellipse at 80% 35%, ${WC3.roc.felMid}35 0%, ${WC3.roc.felDark}18 40%, transparent 70%)
          `,
        }} />

        {/* === THUNDER FLASH - Dramatic cloud illumination (infernal spawn) === */}
        {lightningActive && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `
              radial-gradient(ellipse at ${lightningX}% 25%, ${WC3.roc.felBright}95 0%, ${WC3.roc.felBright}60 15%, ${WC3.roc.felMid}35 35%, transparent 60%),
              radial-gradient(ellipse at ${lightningX + 10}% 40%, ${WC3.roc.felBright}70 0%, ${WC3.roc.felMid}40 25%, transparent 50%),
              radial-gradient(ellipse at ${lightningX - 15}% 35%, ${WC3.roc.felMid}55 0%, transparent 40%)
            `,
            animation: 'thunderFlash 0.15s ease-out',
          }} />
        )}

        {/* === AMBIENT THUNDER FLASH - Localized to specific cloud zones === */}
        {ambientFlash && (() => {
          const zone = cloudZones[activeZone] || { x: 50, y: 30, spread: 18 }
          return (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: `
                radial-gradient(ellipse at ${ambientFlashX}% ${zone.y}%, ${WC3.roc.felBright}80 0%, ${WC3.roc.felBright}45 15%, ${WC3.roc.felMid}25 30%, transparent ${zone.spread + 45}%),
                radial-gradient(ellipse at ${ambientFlashX + 8}% ${zone.y + 12}%, ${WC3.roc.felMid}40 0%, transparent 25%)
              `,
              transition: 'opacity 0.05s ease-out',
            }} />
          )
        })()}

        {/* Pulsing storm glow - subtle ambient with cloudGlow intensity */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `
            radial-gradient(ellipse at ${lightningX}% 30%, ${WC3.roc.felBright}${Math.floor(cloudGlow * 40).toString(16).padStart(2, '0')} 0%, ${WC3.roc.felMid}${Math.floor(cloudGlow * 22).toString(16).padStart(2, '0')} 30%, transparent 55%),
            radial-gradient(ellipse at ${100 - lightningX}% 40%, ${WC3.roc.felMid}${Math.floor(cloudGlow * 25).toString(16).padStart(2, '0')} 0%, transparent 40%)
          `,
          transition: 'background 0.2s ease',
        }} />

        {/* Cloud underlighting - ambient glow within clouds */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
          height: '40%',
          background: `
            radial-gradient(ellipse at 15% 60%, ${WC3.roc.felBright}15 0%, transparent 35%),
            radial-gradient(ellipse at 45% 50%, ${WC3.roc.felMid}18 0%, transparent 40%),
            radial-gradient(ellipse at 75% 55%, ${WC3.roc.felBright}12 0%, transparent 30%),
            radial-gradient(ellipse at 90% 65%, ${WC3.roc.felMid}15 0%, transparent 35%)
          `,
          animation: 'stormPulse 6s ease-in-out infinite',
        }} />

        {/* Secondary flash echo - follows main flash */}
        {lightningActive && (
          <div style={{
            position: 'absolute',
            top: '10%',
            left: 0,
            right: 0,
            height: '50%',
            background: `
              radial-gradient(ellipse at ${100 - lightningX}% 50%, ${WC3.roc.felBright}40 0%, transparent 45%)
            `,
            animation: 'thunderFlash 0.2s ease-out 0.08s',
            opacity: 0.6,
          }} />
        )}
      </div>

      <style>{`
        @keyframes stormPulse {
          0%, 100% { opacity: 0.5; }
          30% { opacity: 0.8; }
          60% { opacity: 0.4; }
          80% { opacity: 0.7; }
        }
        @keyframes thunderFlash {
          0% { opacity: 1; }
          30% { opacity: 0.9; }
          60% { opacity: 0.4; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* === OCCASIONAL FALLING METEOR - Every 8-15 seconds === */}
      {fallingMeteor && fallingMeteor.active && (
        <div
          key={`meteor-${fallingMeteor.id}`}
          style={{
            position: 'absolute',
            left: `${fallingMeteor.startX}%`,
            top: '-5%',
            width: '25px',
            height: '25px',
            animation: `meteorRain${fallingMeteor.direction === 'left' ? 'Left' : 'Right'} 4s ease-in forwards`,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          {/* Meteor glow */}
          <div style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${WC3.roc.felBright}60 0%, ${WC3.roc.felMid}35 35%, ${WC3.roc.felDark}20 60%, transparent 80%)`,
            filter: 'blur(8px)',
          }} />
          {/* Meteor body */}
          <svg width="25" height="25" viewBox="0 0 30 30" style={{ position: 'relative', zIndex: 2 }}>
            <defs>
              <radialGradient id={`meteor${fallingMeteor.id}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor={WC3.roc.fireCore} />
                <stop offset="35%" stopColor={WC3.roc.fireBright} />
                <stop offset="70%" stopColor={WC3.roc.felMid} />
                <stop offset="100%" stopColor="#2a1a0a" />
              </radialGradient>
            </defs>
            <path
              d="M15,2 L22,6 L26,12 L28,18 L24,24 L18,28 L10,26 L4,22 L2,14 L6,8 L12,4 Z"
              fill={`url(#meteor${fallingMeteor.id})`}
            />
            <path d="M10,8 L15,15 L12,22" stroke={WC3.roc.felBright} strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="12" cy="12" r="3" fill={WC3.roc.fireCore} opacity="0.7" />
          </svg>
          {/* Fire trail */}
          <div style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            width: '15px',
            height: '90px',
            background: `linear-gradient(180deg, transparent 0%, ${WC3.roc.felDark}30 15%, ${WC3.roc.felMid}55 45%, ${WC3.roc.felBright}80 75%, ${WC3.roc.fireCore} 100%)`,
            filter: 'blur(5px)',
            transform: `translateX(-50%) rotate(${fallingMeteor.direction === 'left' ? '25deg' : '-25deg'})`,
            transformOrigin: 'bottom center',
          }} />
        </div>
      )}

      {/* === SINGLE RIGHT-SIDE INFERNAL GOLEM - Full spawn sequence === */}
      {golemPhase !== 'waiting' && (
        <div
          style={{
            position: 'fixed',
            right: '15%',
            top: '25vh',
            transform: 'scale(0.6)',
            transformOrigin: 'center top',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {/* PHASE 1: METEOR FALLING - diagonal, starts small and grows */}
          {golemPhase === 'meteor' && (
            <div
              style={{
                position: 'absolute',
                left: '-50px',
                top: '-200px',
                animation: 'golemMeteorFall 1.5s ease-in forwards',
              }}
            >
              {/* Meteor core - scales up during animation */}
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${WC3.roc.fireCore} 0%, ${WC3.roc.fireBright} 30%, ${WC3.roc.fireMid} 60%, ${WC3.roc.felMid} 85%, #1a1510 100%)`,
                boxShadow: `0 0 15px ${WC3.roc.felBright}, 0 0 30px ${WC3.roc.fireMid}`,
                animation: 'meteorGrow 1.5s ease-in forwards',
              }} />
              {/* Meteor trail - diagonal, grows with meteor */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                width: '4px',
                height: '50px',
                background: `linear-gradient(180deg, transparent 0%, ${WC3.roc.felDark}40 30%, ${WC3.roc.felMid}70 60%, ${WC3.roc.felBright}95 85%, ${WC3.roc.fireCore} 100%)`,
                filter: 'blur(3px)',
                transform: 'translateX(-50%) rotate(-25deg)',
                transformOrigin: 'bottom center',
                animation: 'meteorTrailGrow 1.5s ease-in forwards',
              }} />
            </div>
          )}

          {/* PHASE 2: EXPLOSION */}
          {(golemPhase === 'explosion' || golemPhase === 'assembling' || golemPhase === 'final') && (
            <>
              {/* Explosion flash - only during explosion phase */}
              {golemPhase === 'explosion' && (
                <div style={{
                  position: 'absolute',
                  left: '80px',
                  top: '200px',
                  transform: 'translate(-50%, -50%)',
                  width: '250px',
                  height: '250px',
                  background: `radial-gradient(circle, ${WC3.roc.felBright}90 0%, ${WC3.roc.felMid}60 30%, ${WC3.roc.felDark}30 60%, transparent 80%)`,
                  animation: 'explosionFlash 0.6s ease-out forwards',
                }} />
              )}

              {/* Crater - appears after explosion */}
              <svg
                width="160"
                height="40"
                viewBox="0 0 160 40"
                style={{
                  position: 'absolute',
                  left: '0px',
                  top: '200px',
                  transform: 'translateY(-50%)',
                  zIndex: -1,
                }}
              >
                <ellipse cx="80" cy="20" rx="75" ry="18" fill="#080604" />
                <path d="M80,20 L100,22 L105,18 L125,23 L130,19 L150,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ strokeDasharray: 200, animation: 'crackGrow 0.8s ease-out forwards' }} />
                <path d="M80,20 L60,22 L55,18 L35,23 L30,19 L10,24" stroke="#0a0806" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ strokeDasharray: 200, animation: 'crackGrow 0.8s ease-out 0.1s forwards' }} />
                <ellipse cx="80" cy="20" rx="12" ry="6" fill={WC3.roc.felDark} opacity="0.4" />
              </svg>

              {/* Shadow */}
              <div style={{
                position: 'absolute',
                left: '80px',
                transform: 'translateX(-50%) translateY(-50%)',
                top: '200px',
                width: '120px',
                height: '25px',
                background: `radial-gradient(ellipse, ${WC3.roc.felDark}60 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
                borderRadius: '50%',
              }} />
            </>
          )}

          {/* PHASE 3: ROCK ASSEMBLY - stays visible until final golem fades in */}
          {(golemPhase === 'assembling' || golemPhase === 'explosion' || (golemPhase === 'final' && !hideAssembly)) && (
            <>
              {/* Emergence glow */}
              <div style={{
                position: 'absolute',
                left: '80px',
                top: '200px',
                transform: 'translateX(-50%) translateY(-50%)',
                width: '150px',
                height: '200px',
                background: `radial-gradient(ellipse at 50% 90%, ${WC3.roc.felBright}60 0%, ${WC3.roc.felMid}30 30%, transparent 70%)`,
                animation: 'emergeGlow 2.5s ease-out forwards',
                pointerEvents: 'none',
              }} />

              {/* Assembling rocks */}
              <svg
                width="160"
                height="200"
                viewBox="0 0 160 200"
                style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '0px',
                  overflow: 'visible',
                  opacity: (golemPhase === 'assembling' || golemPhase === 'final') ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              >
                {/* HEAD rock */}
                <g style={{ animation: 'assembleHead 1.8s ease-out forwards' }}>
                  <ellipse cx="80" cy="25" rx="22" ry="18" fill="#3a3835" />
                  <ellipse cx="80" cy="24" rx="18" ry="14" fill="#4a4845" />
                  <ellipse cx="70" cy="24" rx="4" ry="3" fill={WC3.roc.felMid} />
                  <ellipse cx="90" cy="24" rx="4" ry="3" fill={WC3.roc.felMid} />
                </g>
                {/* LEFT SHOULDER */}
                <g style={{ animation: 'assembleLeftShoulder 1.5s ease-out 0.2s forwards', opacity: 0 }}>
                  <polygon points="20,50 15,65 30,72 45,68 42,52 30,45" fill="#3a3835" />
                  <polygon points="25,52 22,62 32,66 40,63 38,55 30,50" fill="#4a4845" />
                </g>
                {/* RIGHT SHOULDER */}
                <g style={{ animation: 'assembleRightShoulder 1.6s ease-out 0.15s forwards', opacity: 0 }}>
                  <polygon points="140,50 145,65 130,72 115,68 118,52 130,45" fill="#3a3835" />
                  <polygon points="135,52 138,62 128,66 120,63 122,55 130,50" fill="#4a4845" />
                </g>
                {/* TORSO */}
                <g style={{ animation: 'assembleTorso 1.4s ease-out 0.3s forwards', opacity: 0 }}>
                  <polygon points="55,55 50,90 55,115 105,115 110,90 105,55" fill="#2a2825" />
                  <polygon points="60,58 58,88 62,110 98,110 102,88 100,58" fill="#3a3835" />
                  <path d="M80,65 L75,85 L82,105" stroke={WC3.roc.felMid} strokeWidth="2" fill="none" />
                </g>
                {/* LEFT ARM */}
                <g style={{ animation: 'assembleLeftArm 1.7s ease-out 0.4s forwards', opacity: 0 }}>
                  <polygon points="15,72 8,100 18,115 30,108 28,78" fill="#3a3835" />
                </g>
                {/* RIGHT ARM */}
                <g style={{ animation: 'assembleRightArm 1.65s ease-out 0.35s forwards', opacity: 0 }}>
                  <polygon points="145,72 152,100 142,115 130,108 132,78" fill="#3a3835" />
                </g>
                {/* LEFT LEG */}
                <g style={{ animation: 'assembleLeftLeg 1.3s ease-out 0.5s forwards', opacity: 0 }}>
                  <polygon points="50,120 42,160 55,185 68,175 62,125" fill="#3a3835" />
                </g>
                {/* RIGHT LEG */}
                <g style={{ animation: 'assembleRightLeg 1.35s ease-out 0.45s forwards', opacity: 0 }}>
                  <polygon points="110,120 118,160 105,185 92,175 98,125" fill="#3a3835" />
                </g>
              </svg>
            </>
          )}

          {/* PHASE 4: FINAL DETAILED GOLEM - only visible in final phase */}
          {golemPhase === 'final' && (
            <div style={{ position: 'absolute', left: '-10px', top: '0px', animation: 'golemFadeIn 1s ease-out forwards' }}>
              <InfernalGolemSVG id="final" isIdle={true} />
            </div>
          )}
        </div>
      )}

      {/* === WIND STREAKS - Horizontal gusts across battlefield === */}
      {rainWindStreaks.map((streak) => (
        <div
          key={`wind-${streak.id}`}
          style={{
            position: 'absolute',
            top: `${streak.y}%`,
            left: '-15%',
            width: streak.length,
            height: streak.thickness,
            background: `linear-gradient(90deg, transparent 0%, #9ab0b830 30%, #b0c5cc40 50%, #9ab0b830 70%, transparent 100%)`,
            animation: `rainWindGust ${streak.duration}s linear infinite`,
            animationDelay: `${streak.delay}s`,
          }}
        />
      ))}

      {/* === RAIN - Falling diagonally with wind === */}
      {raindrops.map((drop) => (
        <div
          key={`rain-${drop.id}`}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-5%',
            width: '2px',
            height: `${drop.length}px`,
            background: 'linear-gradient(180deg, transparent 0%, #9ab0b8aa 20%, #c0d5ddcc 50%, #9ab0b8aa 80%, transparent 100%)',
            animation: `rainFallWindy ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}

      {/* === HORDE WAR BANNER - Positioned above infernals, scaled larger === */}
      <div
        style={{
          position: 'fixed',
          left: '8vw',
          top: '58vh',
          transform: 'rotate(-10deg) scale(1.8)',
          transformOrigin: 'bottom left',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <svg width="120" height="300" viewBox="0 0 120 300" style={{ overflow: 'visible' }}>
          {/* Dirt mound at pole base - dark brownish, matches shadowed terrain */}
          <ellipse cx="12" cy="282" rx="28" ry="12" fill="#0c0f0a" />
          <ellipse cx="12" cy="280" rx="22" ry="9" fill="#12150f" />
          <ellipse cx="12" cy="278" rx="14" ry="6" fill="#181a14" />
          {/* Small dirt clumps */}
          <ellipse cx="-8" cy="286" rx="10" ry="5" fill="#0c0f0a" opacity="0.8" />
          <ellipse cx="30" cy="288" rx="12" ry="6" fill="#12150f" opacity="0.7" />
          {/* Grass tufts around base - olive-green like terrain grass */}
          <path d="M-5,278 Q-8,268 -3,262" stroke="#5a5a30" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M28,280 Q32,270 29,264" stroke="#6a6535" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M-12,282 Q-15,274 -10,270" stroke="#4a4a28" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M35,284 Q38,276 35,272" stroke="#5a5a30" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Banner pole - Dark war totem with blood stains */}
          {/* Main pole - charred dark wood */}
          <rect x="4" y="50" width="16" height="235" fill="#0f0a08" />
          <rect x="6" y="50" width="12" height="235" fill="#1a1210" />
          <rect x="8" y="55" width="8" height="225" fill="#251a15" />
          <rect x="10" y="60" width="4" height="215" fill="#2a1f18" opacity="0.5" />
          {/* Wood grain texture - dark */}
          <line x1="7" y1="70" x2="7" y2="270" stroke="#0a0806" strokeWidth="1" opacity="0.6" />
          <line x1="17" y1="65" x2="17" y2="275" stroke="#0a0806" strokeWidth="1" opacity="0.5" />

          {/* Blood stains dripping down pole */}
          <path d="M8,80 Q6,95 8,110 Q10,125 7,140" stroke="#3a1515" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M14,130 Q16,150 13,170 Q15,190 12,210" stroke="#2a1010" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M10,200 Q8,220 11,240 Q9,260 10,275" stroke="#3a1515" strokeWidth="2" fill="none" opacity="0.5" />
          {/* Blood splatter spots */}
          <ellipse cx="6" cy="90" rx="3" ry="2" fill="#3a1010" opacity="0.6" />
          <ellipse cx="16" cy="155" rx="4" ry="2" fill="#2a0a0a" opacity="0.5" />
          <ellipse cx="8" cy="220" rx="3" ry="3" fill="#3a1515" opacity="0.4" />

          {/* Leather wrappings - darker, worn */}
          <rect x="3" y="110" width="18" height="8" fill="#1a1210" rx="1" />
          <rect x="4" y="112" width="16" height="4" fill="#251a15" />
          <rect x="3" y="180" width="18" height="8" fill="#1a1210" rx="1" />
          <rect x="4" y="182" width="16" height="4" fill="#251a15" />
          <rect x="3" y="240" width="18" height="8" fill="#1a1210" rx="1" />
          <rect x="4" y="242" width="16" height="4" fill="#251a15" />

          {/* Top section - skull mount */}
          <polygon points="12,20 0,50 24,50" fill="#1a1210" />
          <polygon points="12,25 4,48 20,48" fill="#251a15" />

          {/* Small skull at top - weathered bone */}
          <g transform="translate(12, 38)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#3a3530" />
            <ellipse cx="0" cy="-1" rx="6" ry="4" fill="#4a4540" />
            <ellipse cx="-3" cy="-1" rx="2" ry="1.5" fill="#0a0808" />
            <ellipse cx="3" cy="-1" rx="2" ry="1.5" fill="#0a0808" />
            <ellipse cx="0" cy="2" rx="1" ry="1.5" fill="#0a0808" />
            {/* Blood on skull */}
            <path d="M-5,3 Q-3,5 -1,4" stroke="#3a1515" strokeWidth="1.5" fill="none" opacity="0.6" />
          </g>

          {/* Top spike - dark iron */}
          <polygon points="12,8 8,22 16,22" fill="#3a3a38" />
          <polygon points="12,10 10,20 14,20" fill="#4a4a48" opacity="0.5" />

          {/* WAR HORNS - darker, battle-worn */}
          {/* Left horn */}
          <g transform="translate(-2, 52)">
            <path
              d="M12,0 Q-5,5 -15,25 Q-20,40 -18,50"
              fill="none"
              stroke="#3a3530"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M12,0 Q-5,5 -15,25 Q-20,40 -18,50"
              fill="none"
              stroke="#4a4540"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M10,2 Q-3,7 -12,25"
              fill="none"
              stroke="#5a5550"
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="-18" cy="50" r="3" fill="#2a2520" />
          </g>

          {/* Right horn */}
          <g transform="translate(14, 52)">
            <path
              d="M0,0 Q17,5 27,25 Q32,40 30,50"
              fill="none"
              stroke="#3a3530"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M0,0 Q17,5 27,25 Q32,40 30,50"
              fill="none"
              stroke="#4a4540"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M2,2 Q15,7 24,25"
              fill="none"
              stroke="#5a5550"
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="30" cy="50" r="3" fill="#2a2520" />
          </g>

          {/* Metal rings - rusted iron */}
          <ellipse cx="12" cy="55" rx="12" ry="4" fill="none" stroke="#3a3530" strokeWidth="2" />
          <ellipse cx="12" cy="55" rx="10" ry="3" fill="none" stroke="#4a4540" strokeWidth="1" />

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
              { id: 1, x: 0, w: 18, delay: '0s', fill: '#4a2018', yOff: 0 },
              { id: 2, x: 18, w: 18, delay: '0.12s', fill: '#3a1812', yOff: 2 },
              { id: 3, x: 36, w: 18, delay: '0.24s', fill: '#2a1210', yOff: 4 },
              { id: 4, x: 54, w: 18, delay: '0.36s', fill: '#1f0c0a', yOff: 6 },
              { id: 5, x: 72, w: 15, delay: '0.48s', fill: '#150808', yOff: 8 },
            ].map((col) => (
              <g key={col.id} style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: col.delay }}>
                <rect x={col.x} y={col.yOff} width={col.w} height={150 - col.yOff} fill={col.fill} />
                <g clipPath={`url(#flagBannerCol${col.id})`}>
                  <g transform="translate(44, 70)">
                    {/* ORC HORNS - curved, coming from skull sides */}
                    <path d="M-18,-8 Q-28,-15 -32,-28 Q-30,-35 -25,-38" stroke="#a89878" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M-18,-8 Q-26,-14 -30,-26 Q-28,-32 -24,-35" stroke="#c8b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M18,-8 Q28,-15 32,-28 Q30,-35 25,-38" stroke="#a89878" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M18,-8 Q26,-14 30,-26 Q28,-32 24,-35" stroke="#c8b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* Skull base - worn bone white with yellow/red tints */}
                    <ellipse cx="0" cy="-2" rx="24" ry="16" fill="#8a7a68" />
                    <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#b8a890" />
                    <ellipse cx="0" cy="-5" rx="19" ry="12" fill="#c8b8a0" />
                    {/* Brow ridge */}
                    <path d="M-16,-8 Q-8,-14 0,-12 Q8,-14 16,-8" stroke="#a89878" strokeWidth="4" fill="none" />
                    {/* Eye sockets - deep and dark */}
                    <ellipse cx="-8" cy="-4" rx="5" ry="4" fill="#1a0a08" />
                    <ellipse cx="8" cy="-4" rx="5" ry="4" fill="#1a0a08" />
                    {/* Fel green eye glow */}
                    <ellipse cx="-8" cy="-4" rx="2.5" ry="2" fill="#3a4a30" />
                    <ellipse cx="8" cy="-4" rx="2.5" ry="2" fill="#3a4a30" />
                    {/* Nose hole */}
                    <path d="M-2,2 L0,6 L2,2" fill="#2a1a10" />
                    {/* Jaw - worn bone */}
                    <path d="M-16,6 L-14,14 L-6,16 L0,14 L6,16 L14,14 L16,6" fill="#a89880" />
                    <path d="M-14,8 L-12,13 L-4,15 L0,13 L4,15 L12,13 L14,8" fill="#b8a890" />
                    {/* Blood stains on skull */}
                    <path d="M-10,-8 Q-12,-2 -8,4" stroke="#6a2a20" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M6,0 Q8,5 4,10" stroke="#5a2018" strokeWidth="1" fill="none" opacity="0.5" />
                    {/* Orc tusks - from jaw, pointing up and out */}
                    <path d="M-12,12 Q-18,4 -14,-4" stroke="#c8b8a0" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M-12,12 Q-16,5 -13,-2" stroke="#d8c8b0" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M12,12 Q18,4 14,-4" stroke="#c8b8a0" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M12,12 Q16,5 13,-2" stroke="#d8c8b0" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                </g>
              </g>
            ))}
            <polygon points="87,20 92,25 87,30 93,35 87,45 92,50 87,60 93,70 87,80 92,90 87,100 93,110 87,120 92,130 87,140 93,145 87,150" fill="#2a0a0a" style={{ animation: 'bannerWave 1.4s ease-in-out infinite alternate', animationDelay: '0.55s' }} />
          </g>

          {/* Pole shadow */}
          <ellipse cx="12" cy="285" rx="15" ry="5" fill="#0a0a08" opacity="0.4" />

          {/* Animated flag shadow on ground - sways with banner */}
          <g transform="translate(45, 280)">
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={`flagShadow${i}`}
                cx={i * 15}
                cy={i * 2}
                rx={18 - i * 2}
                ry={6 - i * 0.5}
                fill="#0a0a08"
                opacity={0.25 - i * 0.04}
                style={{
                  animation: 'bannerWave 1.4s ease-in-out infinite alternate',
                  animationDelay: `${i * 0.12}s`,
                  transformOrigin: `${i * 15}px ${i * 2}px`,
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* === FOREGROUND GRASS TUFTS === */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', pointerEvents: 'none' }} viewBox="0 0 1000 80" preserveAspectRatio="none">
        {/* Grass silhouettes */}
        <g opacity="0.85">
          {[30, 120, 250, 400, 550, 700, 850, 950].map((x, i) => (
            <g key={`fg-${i}`} transform={`translate(${x}, 75)`}>
              <path d={`M0,0 Q${-2},${-20} ${1},${-35 - i % 8}`} stroke="#3a4530" strokeWidth="2" fill="none" />
              <path d={`M5,0 Q${7},${-25} ${4},${-40 - i % 6}`} stroke="#4a5538" strokeWidth="2" fill="none" />
              <path d={`M10,0 Q${8},${-15} ${12},${-28 - i % 5}`} stroke="#3a4530" strokeWidth="1.5" fill="none" />
            </g>
          ))}
        </g>
        {/* Ground bar - dark grass */}
        <rect x="0" y="65" width="1000" height="15" fill="#0d1a0f" opacity="0.95" />
      </svg>

      {/* Ground mist atmosphere */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(0deg, #0d1a0f40 0%, #0a150a25 50%, transparent 100%)',
        filter: 'blur(15px)',
      }} />

      <style>{`
        /* Meteor rain - diagonal left (moves down and left) */
        @keyframes meteorRainLeft {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(-40vw, 120vh);
            opacity: 0;
          }
        }
        /* Meteor rain - diagonal right (moves down and right) */
        @keyframes meteorRainRight {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(40vw, 120vh);
            opacity: 0;
          }
        }
        /* Meteor glow pulsing while falling - must include translate to maintain centering */
        @keyframes meteorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.9;
          }
        }
        /* Explosion flash on impact */
        @keyframes explosionFlash {
          0% {
            transform: scale(0.2);
            opacity: 1;
            filter: brightness(2.5);
          }
          20% {
            transform: scale(1.3);
            opacity: 1;
            filter: brightness(2);
          }
          50% {
            transform: scale(1.6);
            opacity: 0.7;
            filter: brightness(1.3);
          }
          100% {
            transform: scale(2);
            opacity: 0;
            filter: brightness(0.3);
          }
        }
        /* Shockwave ring expanding */
        @keyframes shockwaveExpand {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        /* Smoke rising from impact */
        @keyframes smokeRise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-80px) scale(1.5);
            opacity: 0;
          }
        }
        /* Debris particles flying outward */
        @keyframes debrisFly0 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-40px, -60px) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes debrisFly1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(10px, -70px) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes debrisFly2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(50px, -50px) scale(0.4);
            opacity: 0;
          }
        }
        /* Infernal creature rising from impact (legacy) */
        @keyframes infernalRise {
          0% {
            transform: translateY(30px) scale(0.5);
            opacity: 0;
          }
          40% {
            transform: translateY(10px) scale(0.9);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        /* === GOLEM ASSEMBLY ANIMATIONS - rocks fly from scattered to final position === */
        /* HEAD - starts scattered left, flies to top center */
        @keyframes assembleHead {
          0% {
            transform: translate(-60px, 150px) rotate(-30deg) scale(0.6);
            opacity: 0.3;
            filter: brightness(1.5);
          }
          20% {
            opacity: 1;
            filter: brightness(1.3);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* LEFT SHOULDER - starts bottom left of crater */
        @keyframes assembleLeftShoulder {
          0% {
            transform: translate(-40px, 130px) rotate(20deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.4);
          }
          15% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* RIGHT SHOULDER - starts bottom right of crater */
        @keyframes assembleRightShoulder {
          0% {
            transform: translate(40px, 130px) rotate(-25deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.4);
          }
          15% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* TORSO - starts at crater center, rises up */
        @keyframes assembleTorso {
          0% {
            transform: translate(0, 100px) scale(0.4);
            opacity: 0;
            filter: brightness(1.6);
          }
          20% { opacity: 1; }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* LEFT ARM - starts far left */
        @keyframes assembleLeftArm {
          0% {
            transform: translate(-50px, 60px) rotate(45deg) scale(0.4);
            opacity: 0;
            filter: brightness(1.3);
          }
          20% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* RIGHT ARM - starts far right */
        @keyframes assembleRightArm {
          0% {
            transform: translate(50px, 60px) rotate(-45deg) scale(0.4);
            opacity: 0;
            filter: brightness(1.3);
          }
          20% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* LEFT LEG - starts left of crater */
        @keyframes assembleLeftLeg {
          0% {
            transform: translate(-30px, 70px) rotate(15deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.2);
          }
          25% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* RIGHT LEG - starts right of crater */
        @keyframes assembleRightLeg {
          0% {
            transform: translate(30px, 70px) rotate(-15deg) scale(0.5);
            opacity: 0;
            filter: brightness(1.2);
          }
          25% { opacity: 1; }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(1);
          }
        }
        /* Glow during assembly */
        @keyframes emergeGlow {
          0% { opacity: 0.8; transform: translateY(80px); }
          50% { opacity: 0.6; transform: translateY(30px); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        /* Rock parts glow during assembly */
        @keyframes rockGlowPulse {
          0% { opacity: 0.2; filter: brightness(2); }
          50% { opacity: 0.8; filter: brightness(1.5); }
          100% { opacity: 1; filter: brightness(1); }
        }
        /* Detailed golem fades in on top of assembled rocks */
        @keyframes golemFadeIn {
          0% { opacity: 0; filter: brightness(1.3); }
          100% { opacity: 1; filter: brightness(1); }
        }
        /* Meteor falls diagonally from sky for golem spawn */
        @keyframes golemMeteorFall {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          100% {
            transform: translate(130px, 400px);
            opacity: 1;
          }
        }
        /* Meteor grows as it approaches (perspective effect) */
        @keyframes meteorGrow {
          0% {
            width: 8px;
            height: 8px;
            box-shadow: 0 0 8px ${WC3.roc.felBright}, 0 0 15px ${WC3.roc.fireMid};
          }
          50% {
            width: 20px;
            height: 20px;
            box-shadow: 0 0 20px ${WC3.roc.felBright}, 0 0 40px ${WC3.roc.fireMid};
          }
          100% {
            width: 40px;
            height: 40px;
            box-shadow: 0 0 35px ${WC3.roc.felBright}, 0 0 70px ${WC3.roc.fireMid};
          }
        }
        /* Trail grows with meteor */
        @keyframes meteorTrailGrow {
          0% {
            width: 3px;
            height: 30px;
            filter: blur(2px);
          }
          50% {
            width: 8px;
            height: 70px;
            filter: blur(3px);
          }
          100% {
            width: 14px;
            height: 120px;
            filter: blur(5px);
          }
        }
        /* Explosion flash on meteor impact */
        @keyframes explosionFlash {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        /* Crater crack grows from center outward */
        @keyframes crackGrow {
          0% {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        /* Crack trembles/shakes after growing */
        @keyframes crackTremble {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-1px, 1px);
          }
          50% {
            transform: translate(1px, -1px);
          }
          75% {
            transform: translate(-1px, -1px);
          }
        }
        /* Idle breathing animation - SVG only, no translateX (that's on container) */
        @keyframes infernalBreath {
          0%, 100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.02) translateY(-1px);
          }
        }
        /* Head looks around - left, center, right, center (more dramatic) */
        @keyframes headLook {
          0%, 20%, 80%, 100% {
            transform: rotate(0deg);
          }
          30%, 40% {
            transform: rotate(-12deg);
          }
          55%, 70% {
            transform: rotate(12deg);
          }
        }
        /* Left arm sway - muscle flex effect */
        @keyframes leftArmSway {
          0%, 100% {
            transform: rotate(0deg) scaleX(1);
          }
          25% {
            transform: rotate(-8deg) scaleX(1.05);
          }
          50% {
            transform: rotate(-3deg) scaleX(1);
          }
          75% {
            transform: rotate(5deg) scaleX(0.98);
          }
        }
        /* Right arm sway - opposite phase muscle flex */
        @keyframes rightArmSway {
          0%, 100% {
            transform: rotate(0deg) scaleX(1);
          }
          25% {
            transform: rotate(8deg) scaleX(1.05);
          }
          50% {
            transform: rotate(3deg) scaleX(1);
          }
          75% {
            transform: rotate(-5deg) scaleX(0.98);
          }
        }
        /* Left leg weight shift */
        @keyframes leftLegShift {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          50% {
            transform: rotate(-2deg) translateX(-1px);
          }
        }
        /* Right leg weight shift - opposite phase */
        @keyframes rightLegShift {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          50% {
            transform: rotate(2deg) translateX(1px);
          }
        }
        /* Torso subtle sway */
        @keyframes torsoSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-1deg);
          }
          75% {
            transform: rotate(1deg);
          }
        }
        /* Body glow pulse */
        @keyframes felPulse {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.08);
          }
        }
        /* Layered flame animations - outer layer (slowest, largest movement) */
        @keyframes flameOuter {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(0);
            opacity: 0.8;
          }
          25% {
            transform: scaleY(1.15) scaleX(0.9) translateX(-1px);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1.05) scaleX(1.05) translateX(1px);
            opacity: 0.85;
          }
          75% {
            transform: scaleY(1.12) scaleX(0.95) translateX(-0.5px);
            opacity: 0.75;
          }
        }
        /* Middle flame layer */
        @keyframes flameMid {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(0);
            opacity: 0.9;
          }
          20% {
            transform: scaleY(1.12) scaleX(0.92) translateX(0.5px);
            opacity: 0.85;
          }
          45% {
            transform: scaleY(1.08) scaleX(1.03) translateX(-0.8px);
            opacity: 0.95;
          }
          70% {
            transform: scaleY(1.18) scaleX(0.88) translateX(0.3px);
            opacity: 0.88;
          }
        }
        /* Inner flame layer (faster, more erratic) */
        @keyframes flameInner {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(0);
            opacity: 0.85;
          }
          15% {
            transform: scaleY(1.2) scaleX(0.85) translateX(-0.5px);
            opacity: 0.9;
          }
          35% {
            transform: scaleY(1.05) scaleX(1.08) translateX(0.8px);
            opacity: 0.8;
          }
          55% {
            transform: scaleY(1.25) scaleX(0.82) translateX(-0.3px);
            opacity: 0.92;
          }
          80% {
            transform: scaleY(1.1) scaleX(0.95) translateX(0.4px);
            opacity: 0.85;
          }
        }
        /* Core flame (hottest, fastest flicker) */
        @keyframes flameCore {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
            opacity: 0.7;
          }
          20% {
            transform: scaleY(1.3) scaleX(0.8);
            opacity: 0.8;
          }
          40% {
            transform: scaleY(0.9) scaleX(1.1);
            opacity: 0.65;
          }
          60% {
            transform: scaleY(1.25) scaleX(0.85);
            opacity: 0.75;
          }
          80% {
            transform: scaleY(1.05) scaleX(0.95);
            opacity: 0.7;
          }
        }
        /* Eye glow intensity variation */
        @keyframes eyeGlow {
          0%, 100% {
            opacity: 0.9;
            filter: brightness(1);
          }
          25% {
            opacity: 1;
            filter: brightness(1.3);
          }
          75% {
            opacity: 0.7;
            filter: brightness(0.8);
          }
        }
        /* Wind gusts blowing across battlefield */
        @keyframes rainWindGust {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateX(130vw); opacity: 0; }
        }
        /* Rain falling with wind - uses translate only (no rotate) for performance */
        @keyframes rainFallWindy {
          0% { transform: translate(0, 0) rotate(-25deg); opacity: 0.6; }
          100% { transform: translate(25vw, 115vh) rotate(-25deg); opacity: 0; }
        }
        /* Grass blade wind - ondulating wave to the right, anchored at base */
        @keyframes grassBlade {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(6deg); }
          50% { transform: rotate(12deg); }
          75% { transform: rotate(6deg); }
        }
        /* Banner wave - staggered columns create ripple effect */
        @keyframes bannerWave {
          0% {
            transform: translateY(0) skewX(0deg);
          }
          100% {
            transform: translateY(-6px) skewX(3deg);
          }
        }
      `}</style>
    </>
  )
})
