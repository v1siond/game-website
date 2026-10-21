import type { AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

// Retro RPG's buttons are menu commands: a white bordered box, the gold cursor stepping in beside the
// one under the pointer or the keyboard. Email is the lit command (gold), the rest are plain.

export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--rpg-gold)]'

type CommandLook = 'lit' | 'plain'

const LOOK: Record<CommandLook, string> = {
  lit: 'bg-[color:var(--rpg-gold)] text-[color:var(--rpg-void)]',
  plain: 'bg-[color:var(--rpg-window-low)] text-[color:var(--rpg-text)]',
}

const CURSOR_LOOK: Record<CommandLook, string> = {
  lit: 'text-[color:var(--rpg-void)]',
  plain: 'text-[color:var(--rpg-gold)]',
}

const commandClass = (look: CommandLook) =>
  `group inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-[color:var(--rpg-border)] px-3 py-2 text-sm uppercase tracking-wider ${LOOK[look]} ${FOCUS}`

function Cursor({ look }: { look: CommandLook }) {
  return (
    <span className={`opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${CURSOR_LOOK[look]}`} aria-hidden="true">
      ▶
    </span>
  )
}

interface CommandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  look?: CommandLook
  children: ReactNode
}

export function Command({ look = 'plain', children, ...linkProps }: CommandProps) {
  return (
    <a {...linkProps} className={commandClass(look)}>
      <Cursor look={look} />
      {children}
    </a>
  )
}

const ACTION_LOOK: Record<HeroActionSlot['id'], CommandLook> = {
  email: 'lit',
  linkedin: 'plain',
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <Command key={action.id} look={ACTION_LOOK[action.id]} {...action.linkProps}>
          {action.label}
        </Command>
      ))}
    </>
  )
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={commandClass('plain')}>
      <Cursor look="plain" />
      {label}
    </Link>
  )
}

export function CVLink() {
  return <PageLink href="/cv" label="CV" />
}

export function PlayLink() {
  return <PageLink href="/personal-projects/game-engine" label="Game" />
}
