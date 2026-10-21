import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { drumsSince } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import type { Band, Musician } from '@/lib/cv/content'
import { VaultSprite } from './sprite'
import { SpeedRays, Starburst } from './ink'
import { CEL } from './palette'
import cel from './cel.module.css'

// The bands as boss intro cards: the shooter stops the fight to slam a boss's name over a frozen frame
// with a line under it, and each band gets that card. Pointing at or focusing a card freezes it in the
// two tone wash behind speed rays, slams the name and slides the role and years in under it. Above
// the cards he plays the kit, a burst at each drum as the sticks land.

// Where his sticks land on the kit drawn beside him: the snare, then the cymbal.
const HITS = [
  { at: 'left-[58%] top-[62%]', tone: CEL.sun },
  { at: 'left-[78%] top-[30%]', tone: CEL.orange },
]

function Drummer() {
  return (
    <div className="relative mx-auto h-56 w-64" aria-hidden="true">
      <svg viewBox="0 0 256 224" className={`absolute inset-0 h-full w-full ${cel.inked}`}>
        <path d="M196 70 L238 62 L240 68 L198 76 Z" fill={CEL.sun} />
        <path d="M218 72 L218 200" stroke={CEL.ink} strokeWidth={4} />
        <path d="M132 150 Q170 138 208 150 L208 176 Q170 188 132 176 Z" fill={CEL.red} />
        <ellipse cx={170} cy={150} rx={38} ry={10} fill={CEL.paper} />
        <path d="M150 180 L140 214 M190 180 L200 214" stroke={CEL.ink} strokeWidth={4} />
      </svg>
      <VaultSprite profession="drummer" motion="action" className="absolute bottom-0 left-2 h-52 w-32" />
      {HITS.map((hit, index) => (
        <div key={hit.at} className={`absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 ${hit.at} ${cel.kitHit}`} style={{ ['--i' as string]: index }}>
          <Starburst fill={hit.tone} />
        </div>
      ))}
    </div>
  )
}

function BossCard({ slot, index }: { slot: BandSlot; index: number }) {
  const { links } = useLabels()
  const { band, years, linkProps } = slot

  return (
    <article className={`relative overflow-hidden ${cel.paper} ${cel.boss}`} style={{ ['--i' as string]: index }}>
      <div className={`pointer-events-none absolute inset-0 bg-[var(--cel-dusk-high)] ${cel.bossWash}`} aria-hidden="true" />
      <SpeedRays color={CEL.magenta} className={`pointer-events-none absolute inset-0 h-full w-full ${cel.bossRays}`} />
      <div className="relative p-5">
        <h3 className={`text-3xl leading-none ${cel.display} ${cel.bossLetters} ${cel.bossName}`}>{band.name}</h3>
        <p className={`mt-3 inline-block -rotate-1 border-[3px] border-[var(--cel-ink)] bg-[var(--cel-paper)] px-3 py-1 text-base font-bold ${cel.bossSub}`}>
          {band.role}
          {years && ` · ${years}`}
        </p>
        {band.release && (
          <p className="mt-3 inline-block bg-[var(--cel-ink)] px-2 py-1 text-sm font-bold text-[var(--cel-sun)]">
            {links.released}: {band.release}
          </p>
        )}
        {linkProps && (
          <p className="mt-3">
            <a {...linkProps} className="inline-block bg-[var(--cel-paper)] px-1 text-base font-bold underline decoration-[3px] underline-offset-4">
              {links.website}
            </a>
          </p>
        )}
      </div>
    </article>
  )
}

export function BossCards({ musician, bands }: { musician: Musician; bands: Band[] }) {
  const { years, hud } = useLabels()

  return (
    <>
      <div className="mb-8 grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <Drummer />
        <div>
          <p className={`text-2xl ${cel.display} [-webkit-text-stroke:0]`}>{drumsSince(musician, years)}</p>
          <p className="mt-2 text-base font-bold">{musician.line}</p>
          <p className="mt-4 inline-block bg-[var(--cel-ink)] px-3 py-1.5 text-base font-bold text-[var(--cel-paper)]">{hud.introHint}</p>
        </div>
      </div>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <BossCard slot={slot} index={bands.indexOf(slot.band)} />}
      />
    </>
  )
}
