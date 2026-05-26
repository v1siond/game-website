/**
 * TOP VIEW - 2D Grid Editor
 *
 * Design levels from above, then view in isometric.
 * Each cell shows its ASCII character.
 *
 * Controls:
 * - Click to place selected tile
 * - Right-click to sample tile
 * - Scroll to zoom
 * - Middle-drag to pan
 * - Number keys 1-9 for height
 * - Ctrl+D for debug overlay
 */
import { useRef, useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { TileGrid, TILE_DEFS } from '@/engine/TileGrid'
import { createVillageGrid, VILLAGE_GRID_CONFIG } from '@/levels/village-grid'

const ASCII_FONT = '"JetBrains Mono", "Fira Code", "Consolas", monospace'

// Tile palette for selection
const PALETTE = [
  { char: '.', label: 'Grass' },
  { char: ',', label: 'Tall Grass' },
  { char: '~', label: 'Water' },
  { char: '=', label: 'Path' },
  { char: '#', label: 'Stone' },
  { char: '_', label: 'Sand' },
  { char: '█', label: 'Wall' },
  { char: '▄', label: 'Low Wall' },
  { char: '▀', label: 'Roof' },
  { char: '░', label: 'Floor' },
  { char: '▒', label: 'Stairs' },
  { char: '@', label: 'Tree' },
  { char: '*', label: 'Bush' },
  { char: 'o', label: 'Rock' },
  { char: '+', label: 'Flower' },
  { char: '$', label: 'Crate' },
  { char: '!', label: 'Lamp' },
  { char: 'X', label: 'Void' },
  { char: '?', label: 'Spawn' },
]

export default function TopView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<TileGrid | null>(null)
  const [selectedTile, setSelectedTile] = useState('.')
  const [selectedHeight, setSelectedHeight] = useState(0)
  const [showHeight, setShowHeight] = useState(false)
  const [zoom, setZoom] = useState(24)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null)
  const isPanning = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  // Initialize grid
  useEffect(() => {
    gridRef.current = createVillageGrid()
  }, [])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      const grid = gridRef.current
      if (!grid) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Clear
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cellSize = zoom
      const offsetX = canvas.width / 2 + pan.x
      const offsetY = canvas.height / 2 + pan.y

      // Calculate visible range
      const startCol = Math.floor(-offsetX / cellSize) - 1
      const endCol = Math.ceil((canvas.width - offsetX) / cellSize) + 1
      const startRow = Math.floor(-offsetY / cellSize) - 1
      const endRow = Math.ceil((canvas.height - offsetY) / cellSize) + 1

      ctx.font = `bold ${Math.max(10, cellSize * 0.6)}px ${ASCII_FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Draw cells
      for (let row = Math.max(0, startRow); row < Math.min(grid.rows, endRow); row++) {
        for (let col = Math.max(0, startCol); col < Math.min(grid.cols, endCol); col++) {
          const cell = grid.cells[row][col]
          const def = TILE_DEFS[cell.char] || TILE_DEFS['.']

          const x = offsetX + col * cellSize
          const y = offsetY + row * cellSize

          // Background - adjust brightness by height
          let bg = def.bgColor
          if (cell.height > 0) {
            // Lighter for elevated
            bg = adjustBrightness(def.bgColor, 1 + cell.height * 0.15)
          } else if (cell.height < 0) {
            // Darker for lower
            bg = adjustBrightness(def.bgColor, 1 + cell.height * 0.2)
          }

          ctx.fillStyle = bg
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1)

          // Character
          ctx.fillStyle = def.color
          ctx.fillText(cell.char, x + cellSize / 2, y + cellSize / 2)

          // Height indicator (small number in corner)
          if (showHeight && cell.height !== 0) {
            ctx.font = `bold ${Math.max(8, cellSize * 0.3)}px ${ASCII_FONT}`
            ctx.fillStyle = cell.height > 0 ? '#88ff88' : '#ff8888'
            ctx.textAlign = 'right'
            ctx.fillText(cell.height.toString(), x + cellSize - 2, y + cellSize - 4)
            ctx.font = `bold ${Math.max(10, cellSize * 0.6)}px ${ASCII_FONT}`
            ctx.textAlign = 'center'
          }

          // Hover highlight
          if (hoveredCell && hoveredCell.col === col && hoveredCell.row === row) {
            ctx.strokeStyle = '#ffff00'
            ctx.lineWidth = 2
            ctx.strokeRect(x + 1, y + 1, cellSize - 3, cellSize - 3)
          }
        }
      }

      // Grid lines (subtle)
      if (zoom > 16) {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.lineWidth = 1

        for (let col = Math.max(0, startCol); col <= Math.min(grid.cols, endCol); col++) {
          const x = offsetX + col * cellSize
          ctx.beginPath()
          ctx.moveTo(x, offsetY + Math.max(0, startRow) * cellSize)
          ctx.lineTo(x, offsetY + Math.min(grid.rows, endRow) * cellSize)
          ctx.stroke()
        }

        for (let row = Math.max(0, startRow); row <= Math.min(grid.rows, endRow); row++) {
          const y = offsetY + row * cellSize
          ctx.beginPath()
          ctx.moveTo(offsetX + Math.max(0, startCol) * cellSize, y)
          ctx.lineTo(offsetX + Math.min(grid.cols, endCol) * cellSize, y)
          ctx.stroke()
        }
      }

      // Origin marker
      ctx.fillStyle = '#ff4444'
      ctx.beginPath()
      ctx.arc(offsetX, offsetY, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    render()

    const handleResize = () => render()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [zoom, pan, hoveredCell, showHeight])

  // Mouse handlers
  const screenToGrid = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    const offsetX = canvas.width / 2 + pan.x
    const offsetY = canvas.height / 2 + pan.y

    const col = Math.floor((x - offsetX) / zoom)
    const row = Math.floor((y - offsetY) / zoom)

    return { col, row }
  }, [zoom, pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      setPan(p => ({ x: p.x + dx, y: p.y + dy }))
      lastMouse.current = { x: e.clientX, y: e.clientY }
      return
    }

    const cell = screenToGrid(e.clientX, e.clientY)
    if (cell && gridRef.current) {
      const grid = gridRef.current
      if (cell.col >= 0 && cell.col < grid.cols && cell.row >= 0 && cell.row < grid.rows) {
        setHoveredCell(cell)

        // Paint while dragging
        if (e.buttons === 1) {
          grid.setCell(cell.col, cell.row, selectedTile, selectedHeight)
        }
      } else {
        setHoveredCell(null)
      }
    }
  }, [screenToGrid, selectedTile, selectedHeight])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle button - pan
      isPanning.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    } else if (e.button === 0) {
      // Left click - place tile
      const cell = screenToGrid(e.clientX, e.clientY)
      if (cell && gridRef.current) {
        gridRef.current.setCell(cell.col, cell.row, selectedTile, selectedHeight)
      }
    } else if (e.button === 2) {
      // Right click - sample tile
      const cell = screenToGrid(e.clientX, e.clientY)
      if (cell && gridRef.current) {
        const gridCell = gridRef.current.getCell(cell.col, cell.row)
        if (gridCell) {
          setSelectedTile(gridCell.char)
          setSelectedHeight(gridCell.height)
        }
      }
    }
  }, [screenToGrid, selectedTile, selectedHeight])

  const handleMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -2 : 2
    setZoom(z => Math.max(8, Math.min(64, z + delta)))
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Height keys 0-9
      if (e.key >= '0' && e.key <= '9') {
        setSelectedHeight(parseInt(e.key))
      }
      // Negative heights with minus
      if (e.key === '-') {
        setSelectedHeight(h => Math.max(-5, h - 1))
      }
      if (e.key === '+' || e.key === '=') {
        setSelectedHeight(h => Math.min(9, h + 1))
      }
      // Toggle height display
      if (e.key === 'h' || e.key === 'H') {
        setShowHeight(s => !s)
      }
      // Reset view
      if (e.key === 'r' || e.key === 'R') {
        setPan({ x: 0, y: 0 })
        setZoom(24)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Head>
        <title>Top View - Grid Editor</title>
      </Head>
      <main className="fixed inset-0 overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="block w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
        />

        {/* Navigation */}
        <nav className="fixed top-4 left-4 bg-black/90 p-3 text-white font-mono text-sm rounded flex gap-2">
          <Link href="/top-view" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Top View</Link>
          <Link href="/village-test" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Isometric</Link>
          <Link href="/engine-test" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Engine</Link>
          <Link href="/" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Home</Link>
        </nav>

        {/* Tile Palette */}
        <div className="fixed left-4 top-20 bg-black/90 p-3 text-white font-mono text-xs rounded max-h-[70vh] overflow-y-auto">
          <h3 className="text-yellow-400 font-bold mb-2">TILES</h3>
          <div className="grid grid-cols-2 gap-1">
            {PALETTE.map(({ char, label }) => {
              const def = TILE_DEFS[char]
              const isSelected = selectedTile === char
              return (
                <button
                  key={char}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-left ${
                    isSelected ? 'bg-yellow-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedTile(char)}
                >
                  <span
                    className="w-5 h-5 flex items-center justify-center text-sm"
                    style={{ backgroundColor: def.bgColor, color: def.color }}
                  >
                    {char}
                  </span>
                  <span className="text-gray-300">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Info Panel */}
        <div className="fixed top-4 right-4 bg-black/90 p-4 text-white font-mono text-sm rounded">
          <h2 className="text-blue-400 font-bold mb-2">TOP VIEW EDITOR</h2>
          <div className="space-y-1 text-xs">
            <p>Click: Place tile</p>
            <p>Right-click: Sample tile</p>
            <p>Middle-drag: Pan</p>
            <p>Scroll: Zoom</p>
            <p>H: Toggle heights</p>
            <p>0-9/+/-: Set height</p>
            <p>R: Reset view</p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-gray-400">Selected:</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-8 h-8 flex items-center justify-center text-xl"
                style={{
                  backgroundColor: TILE_DEFS[selectedTile]?.bgColor,
                  color: TILE_DEFS[selectedTile]?.color
                }}
              >
                {selectedTile}
              </span>
              <div>
                <p className="text-yellow-400">{TILE_DEFS[selectedTile]?.name}</p>
                <p className="text-gray-500">Height: {selectedHeight}</p>
              </div>
            </div>
          </div>

          {hoveredCell && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-gray-400">Hover: {hoveredCell.col}, {hoveredCell.row}</p>
              {gridRef.current && (() => {
                const cell = gridRef.current.getCell(hoveredCell.col, hoveredCell.row)
                if (cell) {
                  return (
                    <p className="text-gray-500">
                      {TILE_DEFS[cell.char]?.name} (h={cell.height})
                    </p>
                  )
                }
                return null
              })()}
            </div>
          )}
        </div>

        {/* Height indicator */}
        {showHeight && (
          <div className="fixed bottom-4 right-4 bg-black/90 p-3 text-white font-mono text-xs rounded">
            <p className="text-green-400">Heights visible</p>
          </div>
        )}
      </main>
    </>
  )
}

// Helper to adjust color brightness
function adjustBrightness(hex: string, factor: number): string {
  // Parse hex
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!match) return hex

  let r = parseInt(match[1], 16)
  let g = parseInt(match[2], 16)
  let b = parseInt(match[3], 16)

  r = Math.min(255, Math.max(0, Math.floor(r * factor)))
  g = Math.min(255, Math.max(0, Math.floor(g * factor)))
  b = Math.min(255, Math.max(0, Math.floor(b * factor)))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
