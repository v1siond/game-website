import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import { FACE } from './cards'

// The world's buttons: chunky rounded crate plates in the game's capitals. Email is the gold of the title,
// LinkedIn the blue pad, the CV and the engine are wood plates. A scene's button is the same plate, 44 px
// tall, aria-disabled while its scene plays.

const PLATE =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-[3px] px-5 py-2 text-base tracking-wide shadow-[0_4px_0_var(--np-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 motion-reduce:transition-none'

const WOOD = 'border-[color:var(--np-ink)] bg-[color:var(--np-wood-deep)] text-[color:var(--np-gold)]'

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: `${PLATE} ${FACE} border-[color:var(--np-ink)] bg-[color:var(--np-gold)] text-[color:var(--np-ink)]`,
  linkedin: `${PLATE} ${FACE} border-[color:var(--np-ink)] bg-[color:var(--np-glass-text)] text-[color:var(--np-ink)]`,
  cv: `${PLATE} ${FACE} ${WOOD}`,
  engine: `${PLATE} ${FACE} ${WOOD}`,
}

/** The hero's two actions, then the CV and the engine plates. */
export function ContactActions({ actions }: { actions: readonly HeroActionSlot[] }) {
  const { cv, engine } = useSiteLinks('engine')
  return (
    <>
      {[...actions, cv, engine].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={CONTACT_LOOK[slot.id]} />
      ))}
    </>
  )
}

interface SceneButtonProps {
  label: string
  onPress: () => void
  disabled?: boolean
  className?: string
}

/** A scene's own button: replays it or plays its next step. While it cannot be pressed it says so
 *  (aria-disabled) and refuses the press, but keeps keyboard focus, so Tab goes on from it. */
export function SceneButton({ label, onPress, disabled = false, className = '' }: SceneButtonProps) {
  const press = () => {
    if (disabled) return
    onPress()
  }
  return (
    <button type="button" onClick={press} aria-disabled={disabled} className={`${PLATE} ${FACE} ${WOOD} aria-disabled:cursor-default aria-disabled:opacity-60 ${className}`}>
      {label}
    </button>
  )
}
