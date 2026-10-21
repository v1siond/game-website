import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

// ============================================================================
// HERO ACTIONS - email lit orange, LinkedIn outlined blue
// ============================================================================

export const PORTAL_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider uppercase transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white'

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#FF9A00] text-[#1A1A1A]',
  linkedin: 'border-[1.5px] border-[#00A2FF] text-[#00A2FF] bg-[#00A2FF]/10',
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${PORTAL_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}
