import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

// The limbo button look, shared by the hero actions, the CV link and the closing call to action.
export const LIMBO_BUTTON =
  'limbo-btn inline-flex items-center justify-center min-h-[44px] px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

// Email is the lit primary action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#CCCCCC] text-black hover:opacity-90',
  linkedin: 'border-2 border-[#CCCCCC] text-[#CCCCCC] hover:bg-white hover:text-black',
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${LIMBO_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}
