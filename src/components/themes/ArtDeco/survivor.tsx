'use client'

import type { Profession } from '@/lib/cv/professions'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { PROFESSION_ACTION, SurvivorSprite, type DecoMotion } from './sprite'
import s from './sprite.module.css'

// Him in the vending machine's glass, played like the survivor of the undersea city. Each vend (the parent
// keys this on the profession) brings him back through the revival chamber, he walks in from the edge,
// does that profession's action and settles into the idle with the wrench tap. Pointing at the glass
// throws the plasmid zap; a press swings the wrench (the System Engineer's) or repeats the action. Every
// pose is advanced by the end of the pose before it (usePoseSequence), so there are no timers to clear.

const PRESS: Record<Profession, DecoMotion> = {
  engineer: 'swing',
  drummer: 'drum',
  fighter: 'strike',
}

export function GlassSurvivor({ profession, className = '' }: { profession: Profession; className?: string }) {
  const entrance: readonly DecoMotion[] = ['revive', 'walk', PROFESSION_ACTION[profession]]
  const { pose, play, advance, onOwnAnimationEnd } = usePoseSequence<DecoMotion>({ entrance, rest: 'idle', still: 'still', policy: 'rest' })

  return (
    <div
      className={`${className} ${pose === 'walk' ? s.walkIn : ''}`}
      onAnimationEnd={onOwnAnimationEnd}
      onPointerEnter={() => play('zap')}
      onPointerDown={() => play(PRESS[profession])}
    >
      <SurvivorSprite profession={profession} motion={pose} onDone={advance} className="h-full w-full" />
    </div>
  )
}
