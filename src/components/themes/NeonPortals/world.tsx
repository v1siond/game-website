'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { startEngine, type Engine, type Scene3D } from './engine'
import css from './portals.module.css'

// The world's shared 3D canvas and the hook a window uses to draw through it (engine.ts). The canvas sits
// fixed behind the page; every window is a sized DOM element first, so nothing moves when three.js arrives,
// and a browser with no WebGL keeps the windows' CSS skies.

interface WorldEngine {
  engine: Engine | null
  /** True once the shared context could not open (no WebGL): the windows keep their CSS sky. */
  failed: boolean
}

const EngineContext = createContext<WorldEngine>({ engine: null, failed: false })

export function WorldCanvas({ still, children }: { still: boolean; children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [world, setWorld] = useState<WorldEngine>({ engine: null, failed: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const start = startEngine(canvas, still)
    if (!start.ok) {
      setWorld({ engine: null, failed: true })
      return
    }
    setWorld({ engine: start.engine, failed: false })
    return () => {
      start.engine.dispose()
      setWorld({ engine: null, failed: false })
    }
  }, [still])

  return (
    <EngineContext.Provider value={world}>
      <canvas ref={canvasRef} className={css.canvas} aria-hidden="true" />
      {children}
    </EngineContext.Provider>
  )
}

export const useWorldEngine = (): WorldEngine => useContext(EngineContext)

/** A window's element, drawn by the shared engine with the scene `make` builds (keep `make` stable). */
export function useSceneWindow<T extends HTMLElement>(make: () => Scene3D) {
  const { engine } = useWorldEngine()
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!engine || !element) return
    return engine.add({ element, make })
  }, [engine, make])

  return ref
}
