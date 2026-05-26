import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { GameEngine, convertLegacyAsset } from '@/engine'
import chineseTemple from '@/canvasLogic/gameAssets/chineseTemple'

// COLOR SCHEME - Improved for visual clarity
const colorMap: Record<string, string> = {
  // SKY & ATMOSPHERE
  '*': 'rgba(255, 255, 200, 0.9)',      // stars - bright yellow-white
  '8': 'rgba(220, 220, 230, 0.7)',      // clouds - soft white

  // MOUNTAINS (reddish-brown peaks)
  '/': 'rgba(180, 80, 60, 0.9)',        // mountain slope
  '\\': 'rgba(160, 70, 50, 0.9)',       // mountain slope shadow

  // GRASS & VEGETATION
  ',': 'rgba(80, 180, 80, 0.8)',        // grass - bright green
  ';': 'rgba(60, 160, 60, 0.8)',        // grass - darker green
  'g': 'rgba(180, 200, 60, 0.8)',       // grass - yellow-green
  ':': 'rgba(200, 80, 80, 0.8)',        // flowers - red accent
  '.': 'rgba(160, 140, 80, 0.6)',       // ground dots

  // TREES (layered greens)
  '&': 'rgba(40, 140, 40, 0.9)',        // tree foliage dark
  '@': 'rgba(60, 160, 60, 0.9)',        // tree foliage mid
  '(': 'rgba(50, 150, 50, 0.9)',        // tree foliage
  ')': 'rgba(50, 150, 50, 0.9)',        // tree foliage
  '[': 'rgba(30, 120, 30, 0.8)',        // tree shadow
  ']': 'rgba(30, 120, 30, 0.8)',        // tree shadow

  // CASTLE STRUCTURE
  '|': 'rgba(120, 100, 80, 0.95)',      // castle walls - stone
  'W': 'rgba(180, 140, 60, 0.9)',       // lantern post - gold
  'w': 'rgba(200, 160, 80, 0.9)',       // lantern post light
  '0': 'rgba(255, 200, 80, 0.95)',      // lantern glow
  'o': 'rgba(255, 220, 100, 0.9)',      // small lantern
  '=': 'rgba(140, 120, 100, 0.8)',      // platform - stone
  '_': 'rgba(160, 140, 110, 0.8)',      // stairs - stone
  'n': 'rgba(80, 60, 40, 0.9)',         // door/window

  // ROOF ELEMENTS
  'Y': 'rgba(180, 60, 60, 0.9)',        // roof tile
  'y': 'rgba(160, 100, 60, 0.9)',       // roof wood

  // STREET & MISC
  '-': 'rgba(100, 90, 70, 0.7)',        // street marks
  '^': 'rgba(200, 140, 200, 0.9)',      // flowers
  '+': 'rgba(200, 60, 60, 0.6)',        // decoration
  '~': 'rgba(200, 200, 210, 0.8)',      // mist
  '`': 'rgba(255, 255, 255, 0.9)',      // highlight
}

const fillColorMap: Record<string, string> = {
  // SKY & ATMOSPHERE
  '*': 'rgba(255, 255, 220, 1)',        // stars fill
  '8': 'rgba(240, 245, 255, 0.9)',      // clouds fill - white

  // MOUNTAINS (warm terracotta/red-brown)
  '/': 'rgba(200, 100, 70, 1)',         // mountain fill
  '\\': 'rgba(180, 90, 60, 1)',         // mountain shadow fill

  // GRASS & VEGETATION
  ',': 'rgba(100, 200, 100, 1)',        // grass fill
  ';': 'rgba(80, 180, 80, 1)',          // grass dark fill
  'g': 'rgba(200, 220, 80, 1)',         // yellow-green grass
  ':': 'rgba(220, 100, 100, 1)',        // red flowers
  '.': 'rgba(180, 160, 100, 0.8)',      // ground

  // TREES
  '&': 'rgba(50, 160, 50, 1)',          // tree dark
  '@': 'rgba(70, 180, 70, 1)',          // tree mid
  '(': 'rgba(60, 170, 60, 1)',          // tree
  ')': 'rgba(60, 170, 60, 1)',          // tree
  '[': 'rgba(40, 140, 40, 1)',          // tree shadow
  ']': 'rgba(40, 140, 40, 1)',          // tree shadow

  // CASTLE STRUCTURE (stone gray-brown)
  '|': 'rgba(160, 140, 120, 1)',        // walls - warm stone
  'W': 'rgba(220, 180, 100, 1)',        // lantern post gold
  'w': 'rgba(240, 200, 120, 1)',        // lantern glow
  '0': 'rgba(255, 230, 120, 1)',        // lantern bright
  'o': 'rgba(255, 240, 150, 1)',        // small lantern
  '=': 'rgba(180, 160, 140, 1)',        // platform stone
  '_': 'rgba(200, 180, 150, 1)',        // stairs
  'n': 'rgba(100, 80, 60, 1)',          // door

  // ROOF
  'Y': 'rgba(200, 80, 80, 1)',          // roof red
  'y': 'rgba(180, 120, 80, 1)',         // roof wood

  // STREET & MISC
  '-': 'rgba(120, 110, 90, 1)',         // street
  '^': 'rgba(220, 160, 220, 1)',        // flowers
  '+': 'rgba(220, 80, 80, 1)',          // decoration
  '~': 'rgba(220, 220, 230, 1)',        // mist
  '`': 'rgba(255, 255, 255, 1)',        // highlight
}

const shouldAnimate = (char: string) => {
  return ['(', ')', '&', '@', ';', ',', 'o', 'g', '8'].includes(char)
}

const animationByChar = (char: string): 'move' | 'brightup' | 'move_brightup' | null => {
  if (['g', ':', ',', ';'].includes(char)) return 'move'
  if (['@', '(', ')', '&'].includes(char)) return 'move_brightup'
  if (['o', '-', '8'].includes(char)) return 'brightup'
  return null
}

const intervalByChar = (char: string) => {
  const randomBase = Math.floor(Math.random() * 9) + 2
  switch(char) {
    case 'g': return randomBase * 50
    case '0': return randomBase * 250
    case '[': return randomBase * 200
    case ']': return randomBase * 50
    case '&': return randomBase * 50
    case '@': return randomBase * 70
    case '8': return 350
    default: return randomBase * 100
  }
}

const shouldBlock = (char: string) => {
  // Structural elements that block movement:
  // | = walls/pillars (castle walls, the door has gaps as spaces)
  // W, w = wood structure (central pillar)
  // 0 = lanterns on central pillar
  // = = floor platforms (decorative, not blocking)
  // _ = stairs (walkable!)
  return ['|', 'W', 'w', '0'].includes(char)
}

const EngineTest = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const levelData = convertLegacyAsset(
      chineseTemple,
      colorMap,
      fillColorMap,
      { shouldAnimate, animationByChar, intervalByChar, shouldBlock }
    )

    const engine = new GameEngine(canvasRef.current, {
      tileSize: 24,
      debug: true,
      camera: {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        smoothing: 0.08
      }
    })

    engine.loadLevel(levelData)
    // Start at far left, near bottom of level
    const tileSize = 24
    engine.createPlayer(tileSize * 3, tileSize * 62)
    engine.start()
    engineRef.current = engine

    return () => {
      engine.destroy()
    }
  }, [])

  return (
    <main className="fixed inset-0 overflow-hidden bg-black">
      {/* Navigation */}
      <nav className="fixed top-4 left-4 z-10 bg-black/90 p-3 text-white font-mono text-sm rounded flex gap-2">
        <Link href="/village-test" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Village</Link>
        <Link href="/engine-test" className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-500">Engine</Link>
        <Link href="/" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Home</Link>
      </nav>

      <div className="fixed top-4 right-4 z-10 bg-gray-900/90 p-4 rounded text-white font-mono text-sm">
        <h2 className="text-yellow-400 font-bold mb-2">ENGINE v2</h2>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>Arrow keys: Move</li>
          <li>Camera follows player</li>
          <li>Collision detection ON</li>
        </ul>
      </div>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </main>
  )
}

export default EngineTest
