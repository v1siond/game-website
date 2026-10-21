import type { ReactNode } from 'react'
import type { WorldCategory } from '@/themes/worlds'

// The World Select filter chips' icons, line drawings in currentColor so the chip's own colour (the
// hosting world's accent or muted text) tints them, the same style as the shared profession icons.

export type WorldFilter = 'All' | WorldCategory

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const CATEGORY_ICONS: Record<WorldFilter, () => ReactNode> = {
  // four tiles: every world
  All: () => (
    <Icon>
      <rect x={4} y={4} width={6} height={6} />
      <rect x={14} y={4} width={6} height={6} />
      <rect x={4} y={14} width={6} height={6} />
      <rect x={14} y={14} width={6} height={6} />
    </Icon>
  ),
  // a sword, point up
  Fantasy: () => (
    <Icon>
      <path d="M12 2 L14 5 V15 H10 V5 Z" />
      <path d="M7 15 H17 M12 15 V22" />
    </Icon>
  ),
  // an arcade joystick
  Retro: () => (
    <Icon>
      <circle cx={12} cy={6} r={3} />
      <path d="M12 9 V16" />
      <rect x={4} y={16} width={16} height={5} rx={1} />
    </Icon>
  ),
  // a four point spark
  Neon: () => (
    <Icon>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </Icon>
  ),
  // a gamepad
  Action: () => (
    <Icon>
      <rect x={2} y={7} width={20} height={11} rx={5} />
      <path d="M7 10 V15 M4.5 12.5 H9.5" />
      <circle cx={16} cy={11} r={1} />
      <circle cx={18} cy={14} r={1} />
    </Icon>
  ),
  // a brush stroke and its brush
  Artistic: () => (
    <Icon>
      <path d="M20 3 L10 13" />
      <path d="M10 13 C6 13 6 17 4 20 C8 20 11 19 11 15" />
    </Icon>
  ),
}
