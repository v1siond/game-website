// The cursor arrow: the solid pixel triangle pointing right that steps in beside the line a window has
// picked, the genre's menu cursor. Drawn on a 4 by 7 grid in currentColor, so it takes the line's yellow.

const ARROW = 'M0 0 H1 V1 H2 V2 H3 V3 H4 V4 H3 V5 H2 V6 H1 V7 H0 Z'

export function Cursor({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 4 7" className={className} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <path d={ARROW} fill="currentColor" />
    </svg>
  )
}
