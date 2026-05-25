'use client'

import { useState, useEffect, useRef } from 'react'

interface FPSTrackerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showGraph?: boolean
  defaultVisible?: boolean
}

export default function FPSTracker({ position = 'bottom-left', showGraph = true, defaultVisible = false }: FPSTrackerProps) {
  const [visible, setVisible] = useState(defaultVisible)
  const [fps, setFps] = useState(0)
  const [avgFps, setAvgFps] = useState(0)
  const [minFps, setMinFps] = useState(999)
  const [maxFps, setMaxFps] = useState(0)
  const [fpsHistory, setFpsHistory] = useState<number[]>([])
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsValues = useRef<number[]>([])

  // FPS measurement
  useEffect(() => {
    let animationId: number

    const measureFPS = () => {
      frameCount.current++
      const now = performance.now()
      const delta = now - lastTime.current

      if (delta >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / delta)
        setFps(currentFps)

        // Track history for graph (last 60 samples)
        setFpsHistory(prev => {
          const newHistory = [...prev, currentFps].slice(-60)
          return newHistory
        })

        // Track min/max/avg
        fpsValues.current.push(currentFps)
        if (fpsValues.current.length > 300) fpsValues.current.shift()

        const sum = fpsValues.current.reduce((a, b) => a + b, 0)
        setAvgFps(Math.round(sum / fpsValues.current.length))
        setMinFps(prev => Math.min(prev, currentFps))
        setMaxFps(prev => Math.max(prev, currentFps))

        frameCount.current = 0
        lastTime.current = now
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Reset stats when visibility changes
  useEffect(() => {
    if (visible) {
      setMinFps(999)
      setMaxFps(0)
      fpsValues.current = []
      setFpsHistory([])
    }
  }, [visible])

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  const getFpsColor = (value: number) => {
    if (value >= 55) return '#00ff00'
    if (value >= 45) return '#ffff00'
    if (value >= 30) return '#ff8800'
    return '#ff0000'
  }

  // Toggle button always visible
  const toggleButton = (
    <button
      onClick={() => setVisible(prev => !prev)}
      className={`fixed ${positionClasses[position]} z-[99999] font-mono text-xs cursor-pointer`}
      style={{
        background: visible ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        border: `1px solid ${visible ? '#00ff00' : 'rgba(255, 255, 255, 0.3)'}`,
        padding: '6px 10px',
        borderRadius: '4px',
        color: visible ? '#00ff00' : 'rgba(255, 255, 255, 0.6)',
      }}
      aria-label={visible ? 'Hide FPS tracker' : 'Show FPS tracker'}
      title={visible ? 'Hide FPS tracker' : 'Show FPS tracker'}
    >
      FPS {visible ? fps : '?'}
    </button>
  )

  if (!visible) return toggleButton

  return (
    <>
      {toggleButton}
      <div
        className={`fixed z-[99998] font-mono text-xs select-none pointer-events-none`}
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '8px 12px',
          borderRadius: '4px',
          minWidth: '130px',
          ...(position === 'bottom-left' && { bottom: '52px', left: '16px' }),
          ...(position === 'bottom-right' && { bottom: '52px', right: '16px' }),
          ...(position === 'top-left' && { top: '52px', left: '16px' }),
          ...(position === 'top-right' && { top: '52px', right: '16px' }),
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '9px' }}>PERFORMANCE</span>
        </div>

      {/* Current FPS */}
      <div className="flex items-center justify-between gap-4 mb-1">
        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>FPS</span>
        <span style={{ color: getFpsColor(fps), fontWeight: 'bold', fontSize: '16px' }}>
          {fps}
        </span>
      </div>

      {/* Stats */}
      <div className="flex justify-between gap-2 text-[10px]" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
        <span>avg: <span style={{ color: getFpsColor(avgFps) }}>{avgFps}</span></span>
        <span>min: <span style={{ color: getFpsColor(minFps === 999 ? 0 : minFps) }}>{minFps === 999 ? '-' : minFps}</span></span>
        <span>max: {maxFps}</span>
      </div>

      {/* Graph */}
      {showGraph && fpsHistory.length > 1 && (
        <div className="mt-2" style={{ height: '30px', position: 'relative' }}>
          <svg width="100%" height="30" preserveAspectRatio="none" style={{ display: 'block' }}>
            {/* 60fps target line */}
            <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(0, 255, 0, 0.2)" strokeWidth="1" />
            {/* 30fps warning line */}
            <line x1="0" y1="15" x2="100%" y2="15" stroke="rgba(255, 136, 0, 0.2)" strokeWidth="1" />

            {/* FPS area fill */}
            <polygon
              fill={`${getFpsColor(fps)}15`}
              points={`0,30 ${fpsHistory
                .map((f, i) => {
                  const x = (i / (fpsHistory.length - 1)) * 100
                  const y = 30 - (Math.min(f, 60) / 60) * 30
                  return `${x},${y}`
                })
                .join(' ')} 100,30`}
            />

            {/* FPS line */}
            <polyline
              fill="none"
              stroke={getFpsColor(fps)}
              strokeWidth="1.5"
              points={fpsHistory
                .map((f, i) => {
                  const x = (i / (fpsHistory.length - 1)) * 100
                  const y = 30 - (Math.min(f, 60) / 60) * 30
                  return `${x},${y}`
                })
                .join(' ')}
            />
          </svg>
        </div>
      )}

      {/* Performance hint */}
      <div className="mt-1 text-[9px]" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        {fps >= 55 ? '✓ Smooth' : fps >= 45 ? '~ Acceptable' : fps >= 30 ? '! Sluggish' : '✗ Poor'}
      </div>
      </div>
    </>
  )
}
