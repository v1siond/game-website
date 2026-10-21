import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { Darksign } from './art'

export const SM_BUTTON =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm tracking-[0.2em] uppercase transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8c42]'

// Email is the lit bonfire action, LinkedIn the stone one.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-gradient-to-b from-[#ff6a00] to-[#cc6600] text-[#0a0808] border-2 border-[#ff8c42] hover:scale-105',
  linkedin: 'bg-[#252321] border border-[#ff6a00]/40 text-[#ff8c42] hover:bg-[#1a1815]',
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${SM_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.id === 'email' && <Darksign size={14} />}
          {action.label}
        </a>
      ))}
    </>
  )
}
