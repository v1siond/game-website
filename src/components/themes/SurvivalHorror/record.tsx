import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import look from './world.module.css'

// The Muay Thai record on paper, for the fight behind the page (./scenes), one block and kick per line: the
// facts, then each achievement on its own slip behind a brass mark.

export function FightRecord({ martialArts }: { martialArts: MartialArts }) {
  return (
    <>
      <h3 className={`mb-4 text-base text-[color:var(--sh-flame-text)] ${look.typed}`}>{martialArts.primary.title}</h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-4 grid gap-3 sm:grid-cols-2',
            fact: 'border border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] p-3',
            term: `text-sm uppercase text-[color:var(--sh-brass-text)] ${look.typed}`,
            value: 'mt-1 text-sm text-[color:var(--sh-cream)]',
            achievements: 'grid gap-3',
            achievement: 'text-sm text-[color:var(--sh-cream)]',
          }}
          renderAchievement={(achievement) => (
            <p className={`flex items-start gap-2 p-3 ${look.file}`}>
              <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-[color:var(--sh-brass)]" aria-hidden="true" />
              <span>{achievement}</span>
            </p>
          )}
        />
      </div>
    </>
  )
}
