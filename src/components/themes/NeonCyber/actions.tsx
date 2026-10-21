import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

// The world's three actions, in the hero and again in the contact scene: email, LinkedIn, the CV.

// Email is the lit primary action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-pink-500 text-black hover:bg-pink-400',
  linkedin: 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black',
}

// The slanted cut would clip the focus ring, so a focused button drops it and shows the ring whole.
const HUD_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0512] [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] focus-visible:[clip-path:none]'

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${HUD_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
      [{action.label.toUpperCase()}]
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={`${HUD_BUTTON} border border-white/60 text-white hover:bg-white hover:text-black`}>
      [GET_THE_CV]
    </Link>
  )
}
