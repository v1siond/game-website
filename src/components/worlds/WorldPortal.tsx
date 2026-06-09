'use client'

import type { CSSProperties } from 'react'

export type PortalVariant = 'vortex' | 'wormhole' | 'hyperspace' | 'glitch'

export const PORTAL_VARIANTS: PortalVariant[] = ['vortex', 'wormhole', 'hyperspace', 'glitch']

interface WorldPortalProps {
  variant: PortalVariant
  phase: 'cover' | 'reveal'
  /** Destination world colors — the portal is tinted to where you're going. */
  accent: string
  secondary: string
  background: string
  worldName: string
  coverMs: number
  revealMs: number
}

/**
 * Full-screen "gamy" world-transition overlay. The WorldTransitionProvider mounts this
 * during a switch and picks one of four variants at random. All four share the same DOM;
 * CSS keyed on `data-variant` / `data-phase` drives which layers animate. Purely
 * decorative + GPU transforms; the provider skips it entirely for reduced-motion.
 */
export default function WorldPortal({
  variant,
  phase,
  accent,
  secondary,
  background,
  worldName,
  coverMs,
  revealMs,
}: WorldPortalProps) {
  const style = {
    ['--wp-accent']: accent,
    ['--wp-secondary']: secondary,
    ['--wp-bg']: background,
    ['--wp-cover']: `${coverMs}ms`,
    ['--wp-reveal']: `${revealMs}ms`,
  } as CSSProperties

  return (
    <div className="wp-root" data-variant={variant} data-phase={phase} style={style}>
      <div className="wp-backdrop" aria-hidden="true" />
      <div className="wp-fx" aria-hidden="true" />
      <div className="wp-fx wp-fx2" aria-hidden="true" />
      <div className="wp-ring" aria-hidden="true" />
      <div className="wp-grid" aria-hidden="true" />
      <div className="wp-flash" aria-hidden="true" />
      <div className="wp-label">
        <span className="wp-label-text" role="status" aria-live="polite">
          Entering {worldName}
        </span>
      </div>
    </div>
  )
}
