// Abstract profession icons (not character silhouettes), drawn in currentColor so each world tints
// them with its own palette.

export const GearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12,8 L14,4 L10,4 Z M12,16 L14,20 L10,20 Z M8,12 L4,14 L4,10 Z M16,12 L20,14 L20,10 Z" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
)

export const WaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4,12 Q7,8 10,12 Q13,16 16,12 Q19,8 22,12" strokeLinecap="round" />
    <path d="M4,16 Q7,12 10,16 Q13,20 16,16 Q19,12 22,16" strokeLinecap="round" opacity="0.5" />
  </svg>
)

export const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12,2 L22,12 L12,22 L2,12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12,6 L18,12 L12,18 L6,12 Z" opacity="0.3" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)
