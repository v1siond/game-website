import { SH } from './palette'
import look from './world.module.css'

// The room behind the page, fixed while it scrolls: the damask wallpaper, the crown moulding along the
// top, the lamp glow that flickers, the fog lying low with a slow bank drifting through, the wall
// sconces at both sides, the fixed camera vignette and the film grain. Three loops (the lamp, the fog
// bank, the grain), all stopped under reduced motion.

const LAYER = 'pointer-events-none fixed inset-0 z-0'
const DENTILS = Array.from({ length: 50 }, (_, i) => i * 20 + 5)

function CrownMoulding() {
  return (
    <svg viewBox="0 0 1000 24" preserveAspectRatio="none" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-6 w-full opacity-40" aria-hidden="true" focusable="false">
      <rect width={1000} height={10} fill={SH.paper} />
      <rect y={10} width={1000} height={6} fill={SH.sepia} />
      {DENTILS.map((x) => (
        <rect key={x} x={x} y={16} width={8} height={6} fill={SH.wood} />
      ))}
    </svg>
  )
}

const SCONCE_SIDE = { left: 'left-2', right: 'right-2 -scale-x-100' } as const

// An oil lamp on its wall bracket, its flame lit; hidden on narrow screens where the page fills the width.
function WallSconce({ side }: { side: keyof typeof SCONCE_SIDE }) {
  return (
    <svg viewBox="0 0 36 70" className={`pointer-events-none fixed top-1/4 z-0 hidden h-[70px] w-9 opacity-50 lg:block ${SCONCE_SIDE[side]}`} aria-hidden="true" focusable="false">
      <path d="M18 0 V15 Q10 20 12 30" stroke={SH.wood} strokeWidth={4} fill="none" />
      <ellipse cx={12} cy={35} rx={8} ry={5} fill={SH.sepia} />
      <rect x={6} y={35} width={12} height={15} fill={SH.wood} />
      <ellipse cx={12} cy={50} rx={8} ry={4} fill={SH.paper} />
      <path d="M8 30 Q6 20 10 15 H14 Q18 20 16 30" fill={SH.cream} opacity={0.3} />
      <ellipse cx={12} cy={22} rx={3} ry={6} fill={SH.flame} opacity={0.9} />
      <ellipse cx={12} cy={20} rx={1.5} ry={4} fill={SH.ivory} opacity={0.8} />
      <circle cx={12} cy={22} r={14} fill={SH.flame} opacity={0.12} />
    </svg>
  )
}

export function HouseBackdrop() {
  return (
    <>
      <div className={`${LAYER} ${look.wallpaper}`} aria-hidden="true" />
      <div className={`${LAYER} ${look.lamp}`} aria-hidden="true" />
      <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-0 h-1/4 ${look.fogLow}`} aria-hidden="true" />
      <div className="pointer-events-none fixed inset-x-0 top-1/2 z-0 h-24 overflow-hidden" aria-hidden="true">
        <div className={`h-full w-full ${look.fogDrift}`} />
      </div>
      <CrownMoulding />
      <WallSconce side="left" />
      <WallSconce side="right" />
      <div className={`${LAYER} ${look.vignette}`} aria-hidden="true" />
      <div className={`${LAYER} overflow-hidden`} aria-hidden="true">
        <div className={`absolute -inset-4 ${look.grain}`} />
      </div>
    </>
  )
}
