import { SOUL } from './palette'
import world from './world.module.css'

// The cavern behind the whole page, fixed under the content: stalactites hanging from the dark above,
// the far rock walls, and soft motes of light drifting up through the blue. The motes are the one
// ambient loop (world.module.css), ten of them, each with its own place, length and delay as literal
// classes so the build generates them; reduced motion leaves them out.

const MOTES = [
  'left-[6%] bottom-[8%] [--mote-time:15s] [--mote-delay:-2s]',
  'left-[14%] bottom-[30%] [--mote-time:18s] [--mote-delay:-9s]',
  'left-[23%] bottom-[2%] [--mote-time:13s] [--mote-delay:-5s]',
  'left-[35%] bottom-[18%] [--mote-time:17s] [--mote-delay:-12s]',
  'left-[47%] bottom-[5%] [--mote-time:14s] [--mote-delay:-1s]',
  'left-[58%] bottom-[26%] [--mote-time:19s] [--mote-delay:-7s]',
  'left-[67%] bottom-[10%] [--mote-time:12s] [--mote-delay:-4s]',
  'left-[76%] bottom-[34%] [--mote-time:16s] [--mote-delay:-10s]',
  'left-[86%] bottom-[4%] [--mote-time:15s] [--mote-delay:-6s]',
  'left-[94%] bottom-[20%] [--mote-time:18s] [--mote-delay:-13s]',
]

const STALACTITES =
  'M0 0 H1200 V18 L1170 40 L1150 16 L1110 62 L1080 20 L1040 34 L1000 14 L960 70 L930 22 L880 40 L850 12 L800 52 L770 18 L720 30 L690 10 L650 66 L610 20 L570 36 L540 12 L500 58 L460 18 L420 30 L390 10 L350 74 L320 20 L280 42 L250 14 L200 56 L170 18 L130 34 L100 12 L60 60 L30 20 L0 30 Z'

const FAR_WALLS =
  'M0 200 V120 L80 96 L150 118 L230 84 L300 110 L380 90 L460 122 L540 88 L620 112 L700 80 L780 108 L860 92 L940 120 L1020 86 L1100 112 L1200 96 V200 Z'

export function CavernBackdrop() {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${world.backdrop}`} aria-hidden="true">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-20 w-full" focusable="false">
        <path d={STALACTITES} fill={SOUL.ink} opacity={0.85} />
      </svg>
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-48 w-full" focusable="false">
        <path d={FAR_WALLS} fill={SOUL.cavern} opacity={0.55} />
      </svg>
      {MOTES.map((place) => (
        <span key={place} className={`absolute block h-1.5 w-1.5 rounded-full bg-[var(--soul-glow)] ${world.mote} ${place}`} />
      ))}
    </div>
  )
}
