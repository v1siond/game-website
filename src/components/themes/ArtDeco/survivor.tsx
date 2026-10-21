'use client'

import { useState, type AnimationEvent } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PROFESSION_ACTION, SurvivorSprite, type DecoMotion } from './sprite'
import s from './sprite.module.css'

// Him in the vending machine's glass, played like the survivor of the undersea city. Each vend (the parent
// keys this on the profession) brings him back through the revival chamber, he walks in from the edge,
// does that profession's action and settles into the idle with the wrench tap. Pointing at the glass
// throws the plasmid zap; a press swings the wrench (the System Engineer's) or repeats the action. Every
// step is advanced by the end of the step before it, so there are no timers to clear.

type Step = 'revive' | 'walk' | 'act' | 'idle' | 'react'

const NEXT: Record<Step, Step> = {
  revive: 'walk',
  walk: 'act',
  act: 'idle',
  idle: 'idle',
  react: 'idle',
}

const PRESS: Record<Profession, DecoMotion> = {
  engineer: 'swing',
  drummer: 'drum',
  fighter: 'strike',
}

export function GlassSurvivor({ profession, className = '' }: { profession: Profession; className?: string }) {
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState<Step>('revive')
  const [reaction, setReaction] = useState<DecoMotion>('zap')

  const motionFor: Record<Step, DecoMotion> = {
    revive: 'revive',
    walk: 'walk',
    act: PROFESSION_ACTION[profession],
    idle: 'idle',
    react: reaction,
  }
  const advance = () => setStep(NEXT[step])
  const react = (motion: DecoMotion) => {
    if (step !== 'idle') return
    setReaction(motion)
    setStep('react')
  }
  const walkDone = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    advance()
  }

  return (
    <div
      className={`${className} ${step === 'walk' && !reducedMotion ? s.walkIn : ''}`}
      onAnimationEnd={walkDone}
      onPointerEnter={() => react('zap')}
      onPointerDown={() => react(PRESS[profession])}
    >
      <SurvivorSprite profession={profession} motion={reducedMotion ? 'still' : motionFor[step]} onDone={advance} className="h-full w-full" />
    </div>
  )
}
