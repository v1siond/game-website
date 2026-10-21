import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

export const COMIC_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider font-black border-[5px] border-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a] focus:outline-none focus:ring-4 focus:ring-yellow-400'

// Email is the loud orange action, LinkedIn the white one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-gradient-to-br from-[#ff9500] to-[#d4763d] text-white [text-shadow:2px_2px_0_#1a1a1a]',
  linkedin: 'bg-white text-[#1a1a1a]',
}

export function HeroActions({ actions, reducedMotion }: { actions: HeroActionSlot[]; reducedMotion: boolean }) {
  return (
    <>
      {actions.map((action) => (
        <a
          key={action.id}
          {...action.linkProps}
          className={`${COMIC_BUTTON} ${HERO_ACTION_LOOK[action.id]} ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:-rotate-2'}`}
        >
          {action.label.toUpperCase()}
        </a>
      ))}
    </>
  )
}
