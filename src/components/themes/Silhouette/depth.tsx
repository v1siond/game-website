import type { ReactNode } from 'react'
import shade from './shade.module.css'

// The depth of a silhouette scene: every scene is the same four planes, a lit sky, a far layer pale with
// fog, a mid layer a shade darker, his plane, and a near layer of soft black shapes out of focus. Focus is
// faked with light, not blur: the far layer is pale and low in contrast, the near one dim and soft edged.
// Each layer leans against the pointer by its depth (--mx and --my from usePointerVars on the world root),
// the near one most, so the scene opens up as the visitor moves.

export type Depth = 'far' | 'mid' | 'plane' | 'near'

const LEAN: Record<Depth, string> = {
  far: shade.leanFar,
  mid: shade.leanMid,
  plane: shade.leanPlane,
  near: shade.leanNear,
}

// Wider than the scene so a lean never shows an edge.
const LAYER = 'pointer-events-none absolute inset-y-0 -left-[4%] h-full w-[108%]'

/** One plane of a scene, drawn on a 600 by 200 canvas anchored to the ground line. */
export function Layer({ depth, children, className = '' }: { depth: Depth; children: ReactNode; className?: string }) {
  return (
    <div className={`${LAYER} ${LEAN[depth]} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMax slice" className="h-full w-full" focusable="false">
        {children}
      </svg>
    </div>
  )
}

/** A gear outline for the machinery: `teeth` square teeth round a ring of radius r, with a hub hole. */
export function gearPath(cx: number, cy: number, r: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth
  const outer = r * 1.16
  const points = Array.from({ length: teeth }, (_, index) => {
    const a = index * step
    const corners = [
      [a - step * 0.25, r],
      [a - step * 0.16, outer],
      [a + step * 0.16, outer],
      [a + step * 0.25, r],
    ]
    return corners.map(([angle, radius]) => `${(cx + Math.cos(angle) * radius).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`).join(' L')
  })
  const hub = r * 0.32
  return `M${points.join(' L')} Z M${cx - hub} ${cy} A${hub} ${hub} 0 1 0 ${cx + hub} ${cy} A${hub} ${hub} 0 1 0 ${cx - hub} ${cy} Z`
}

/** A two tier pine with its foot on the ground line at y. */
export function pinePath(x: number, height: number, y = 200): string {
  const top = y - height
  const trunk = Math.max(1.2, height * 0.025)
  return `M${x - trunk} ${y} H${x + trunk} V${top + height * 0.7} H${x - trunk} Z M${x - height * 0.16} ${top + height * 0.5} L${x} ${top} L${x + height * 0.16} ${top + height * 0.5} Z M${x - height * 0.24} ${top + height * 0.82} L${x} ${top + height * 0.28} L${x + height * 0.24} ${top + height * 0.82} Z`
}
