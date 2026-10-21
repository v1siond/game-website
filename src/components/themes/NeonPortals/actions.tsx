import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'

// The world's actions, in the hero and again in the contact scene: email lit orange (the way in),
// LinkedIn outlined blue (the way out), the CV outlined white.

const PORTAL_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07060f]'

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#ff9a00] text-[#07060f] hover:bg-[#ffb340]',
  linkedin: 'border-[1.5px] border-[#00a2ff] text-[#00a2ff] hover:bg-[#00a2ff]/15',
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

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${PORTAL_BUTTON} border-[1.5px] border-[#edebe4] text-[#edebe4] hover:bg-white/10`}>
      {actions.getCv}
    </Link>
  )
}

export function DemoLink() {
  const { actions } = useLabels()
  return (
    <Link
      href="/personal-projects/game-engine"
      className={`${PORTAL_BUTTON} border-[1.5px] border-[#b57bff] text-[#b57bff] hover:bg-[#b57bff]/15`}
    >
      {actions.playDemo}
    </Link>
  )
}
