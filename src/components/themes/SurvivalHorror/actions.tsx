import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

export const SH_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a860]'

// Email is the lit rust action, LinkedIn the plain file one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#6b4030]/80 border-2 border-[#c49050] text-[#d8c8a8]',
  linkedin: 'bg-[#2a2018] border-2 border-[#5c4a38] text-[#d8c8a8]',
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${SH_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          [{action.label.toUpperCase()}]
        </a>
      ))}
    </>
  )
}
