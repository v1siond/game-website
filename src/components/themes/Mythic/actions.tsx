import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

// The world's buttons: email, LinkedIn and the CV link share one shape.

export const MY_BUTTON =
  'inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c040] focus-visible:ring-offset-2 focus-visible:ring-offset-black'

// Email is the gold action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#c9a227] text-black',
  linkedin: 'bg-transparent border-2 border-[#c9a227] text-[#c9a227]',
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${MY_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}
