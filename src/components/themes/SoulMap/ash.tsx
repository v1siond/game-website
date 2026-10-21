import ashen from './ashen.module.css'

// Behind the whole page: ash drifting down through the dark (eight flakes, each on its own slow fall) and
// the vignette that darkens the edges of the screen, fixed so they stay while the page scrolls.

const FLAKES = 8

export function AshFall() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: FLAKES }, (_, index) => (
        <span key={index} className={ashen.flake} />
      ))}
      <div className={`absolute inset-0 ${ashen.vignette}`} />
    </div>
  )
}
