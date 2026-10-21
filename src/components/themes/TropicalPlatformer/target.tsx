'use client'

import { BarrelArt } from './barrel'
import { COLORS as C } from './palette'
import rig from './target.module.css'

// The source's end of level target at the foot of the night scene (nightfall.tsx): a red and white pad on
// the ground and a pole beside it with a barrel at its foot. He rolls in onto the pad; it squashes, the
// barrel shoots up the pole and rings the bell at the top with a starburst, the level won. The parent's
// data-on starts it (CSS only, from 0.9 s, after the roll).

export function EndTarget() {
  return (
    <>
      <svg viewBox="0 0 120 30" className={`absolute bottom-1 left-[calc(50%-1.5rem)] w-32 ${rig.pad}`} aria-hidden="true" focusable="false">
        <ellipse cx="60" cy="18" rx="58" ry="11" fill={C.barkDark} />
        <ellipse cx="60" cy="15" rx="56" ry="11" fill={C.target} />
        <ellipse cx="60" cy="15" rx="40" ry="8" fill={C.burst} />
        <ellipse cx="60" cy="15" rx="24" ry="5" fill={C.target} />
        <ellipse cx="60" cy="15" rx="9" ry="2.2" fill={C.burst} />
      </svg>
      <div className="absolute bottom-3 right-[8%] h-52 w-10" aria-hidden="true">
        <span className={`absolute bottom-0 left-1/2 top-4 block w-2.5 -translate-x-1/2 rounded ${rig.pole}`} />
        <span className="absolute left-1/2 top-0 block h-5 w-5 -translate-x-1/2 rounded-full bg-[color:var(--tp-sun-gold)]" />
        <span className={`absolute -top-5 left-1/2 -ml-8 block h-16 w-16 ${rig.star}`} />
        <div className={`absolute bottom-0 left-0 w-10 ${rig.marker}`}>
          <BarrelArt mark="plain" className="block h-auto w-full" />
        </div>
      </div>
    </>
  )
}
