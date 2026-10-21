import world from './world.module.css'

// Silhouette's fixed atmosphere behind the page: film grain, three fog layers drifting at their own
// speeds (the slow and fast ones sideways, the low one creeping up) and the heavy vignette with its
// letterbox. The looks and drifts live in world.module.css.

const LAYER = 'absolute inset-0 will-change-transform'

export function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${world.grain}`} />
      <div className={`${LAYER} ${world.fogSlow}`} />
      <div className={`${LAYER} ${world.fogFast}`} />
      <div className={`${LAYER} ${world.fogRise}`} />
      <div className={`absolute inset-0 ${world.vignette}`} />
    </div>
  )
}
