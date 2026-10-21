'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Profession } from '@/lib/cv/professions'
import { marksUpTo, reached, type Beat } from './bout'
import { useBout } from './boutPlayer'
import { Ring } from './duo'
import { Fighter } from './fighter'
import { CallText, ImpactBurst } from './badges'
import { useComboLand } from './combo'
import { FS } from './palette'
import { CrowdGroup, type Zone } from './backdrop'
import living from './living.module.css'

// The stage moments the sections open with, each a different beat of an arcade match, played once when
// its section scrolls in (useZoneStage, which also hands the section's zone to the backdrop) and again
// on a tap of the ring:
// - CarSmash (About): the bonus stage. He walks up to the car and takes it apart, a jab, a jab, the
//   spinning kick, the rising uppercut; the car dents, loses its glass, then its doors and wheels fly.
// - BlastRow (Tech Stack): he throws a ki blast across the row for each category, lighting its card.
// - SuperArt (Projects): the screen goes dark, his face cuts in on a band, the white flash, and the
//   super move's hits land on the combo counter, one per project.
// - ParryRow (Ventures): his partner throws a punch per venture and he parries each with the blue
//   flash, lighting its card, then answers with the uppercut.
// - SparRing (Muay Thai): his roundhouse and jab put the partner down, K.O., then Perfect.

export function useScene(zone: Zone) {
  return useZoneStage<Zone>(zone)
}

// ---- About: the bonus stage car ----

const CAR_BOUT: Beat[] = [
  { hero: 'walk', ms: 600 },
  { hero: 'punch', ms: 420, mark: 'hit' },
  { hero: 'punch', ms: 420, mark: 'hit' },
  { hero: 'tatsumaki', ms: 1080, mark: 'hit' },
  { hero: 'shoryuken', ms: 760, mark: 'wreck' },
  { hero: 'win', ms: 0 },
]

const DEBRIS: { d: string; fill: string; vars: CSSProperties }[] = [
  {
    d: 'M70 30 H110 V52 H70 Z',
    fill: FS.p2,
    vars: {
      '--fx': '60px',
      '--fy': '-90px',
      '--fr': '140deg',
    } as CSSProperties,
  },
  {
    d: 'M112 30 H150 V52 H112 Z',
    fill: FS.p2Dark,
    vars: {
      '--fx': '120px',
      '--fy': '-50px',
      '--fr': '-120deg',
    } as CSSProperties,
  },
  {
    d: 'M60 66 a12 12 0 1 0 0.1 0 Z',
    fill: FS.ink,
    vars: {
      '--fx': '-40px',
      '--fy': '-70px',
      '--fr': '300deg',
    } as CSSProperties,
  },
  {
    d: 'M150 66 a12 12 0 1 0 0.1 0 Z',
    fill: FS.ink,
    vars: {
      '--fx': '90px',
      '--fy': '-30px',
      '--fr': '-260deg',
    } as CSSProperties,
  },
]

// The bonus stage car, side on, in four states of damage: whole, dented with the glass starred, the
// glass gone and the roof caved, and the wreck on its belly with its doors and wheels thrown off.
function Car({ damage }: { damage: number }) {
  const roofDrop = Math.min(damage, 3) * 5
  const wrecked = damage >= 3
  return (
    <svg viewBox="0 0 200 90" className="h-full w-full overflow-visible" focusable="false">
      <ellipse cx={100} cy={86} rx={90} ry={4} fill={FS.ink} opacity={0.4} />
      <path
        d={`M14 ${wrecked ? 80 : 70} L22 44 H58 L76 ${18 + roofDrop} H136 L156 44 H186 L190 ${wrecked ? 80 : 70} Z`}
        fill={FS.p2}
        stroke={FS.ink}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M22 56 H188" stroke={FS.p2Dark} strokeWidth={3} />
      {damage < 2 && (
        <path d={`M80 ${22 + roofDrop} H106 V42 H66 Z M110 ${22 + roofDrop} H132 L148 42 H110 Z`} fill={FS.parry} stroke={FS.ink} strokeWidth={2} />
      )}
      {damage === 1 && <path d="M92 26 L86 36 M92 26 L100 34 M92 26 L96 20 M124 28 L118 38 M124 28 L132 36" stroke={FS.flash} strokeWidth={2} />}
      {damage >= 1 && <path d="M40 48 Q46 58 40 66 M150 50 Q158 56 152 66" stroke={FS.p2Dark} strokeWidth={3} fill="none" />}
      {!wrecked && (
        <>
          <circle cx={52} cy={72} r={13} fill={FS.ink} />
          <circle cx={52} cy={72} r={5} fill={FS.chrome} />
          <circle cx={156} cy={72} r={13} fill={FS.ink} />
          <circle cx={156} cy={72} r={5} fill={FS.chrome} />
        </>
      )}
      <rect x={180} y={50} width={10} height={6} fill={FS.gold} stroke={FS.ink} strokeWidth={1.5} />
    </svg>
  )
}

export function CarSmash({ profession }: { profession: Profession }) {
  const { arcade } = useLabels()
  const { ref, on, reduced } = useScene('castle')
  const { index, beat, take, started, replay } = useBout(CAR_BOUT, on, reduced)
  const wrecked = reached(CAR_BOUT, index, 'wreck')
  const damage = wrecked ? 3 : marksUpTo(CAR_BOUT, index, 'hit')

  return (
    <div ref={ref}>
      <Ring
        profession={profession}
        stage="engineer"
        beat={beat}
        take={take}
        heroAt={started ? 'mid' : 'corner'}
        solo
        replayLabel={arcade.smashAgain}
        onReplay={reduced ? undefined : replay}
      >
        <div
          key={`car-${take}`}
          className={`pointer-events-none absolute bottom-1 right-[4%] h-24 w-52 sm:h-32 sm:w-72 ${beat.mark ? living.shudder : ''}`}
          aria-hidden="true"
        >
          <Car damage={damage} />
          {wrecked && (
            <svg viewBox="0 0 200 90" className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
              {DEBRIS.map(({ d, fill, vars }) => (
                <path key={d} d={d} fill={fill} stroke={FS.ink} strokeWidth={2} className={living.debris} style={vars} />
              ))}
            </svg>
          )}
        </div>
        <span className="pointer-events-none absolute left-3 top-3 z-20 text-[clamp(1.25rem,4vw,1.75rem)] uppercase leading-none" aria-hidden="true">
          <CallText>{arcade.bonus}</CallText>
        </span>
        {wrecked && (
          <span className={`pointer-events-none absolute right-6 top-6 z-20 text-3xl ${living.call}`} aria-hidden="true">
            <CallText>{arcade.perfect}</CallText>
          </span>
        )}
      </Ring>
    </div>
  )
}

// ---- Tech Stack: a ki blast lights each card ----

const blastBout = (count: number): Beat[] => [
  { hero: 'stance', ms: 300 },
  ...Array.from({ length: count }, (): Beat => ({
    hero: 'hadouken',
    ms: 1000,
    mark: 'light',
  })),
  { hero: 'win', ms: 0 },
]

// A row of cards the bout lights in turn: renderItem draws one card, lit or not, and render wraps the
// drawn cards in the section's own list.
interface LitListProps<T> {
  items: readonly T[]
  renderItem: (item: T, lit: boolean) => ReactNode
  render: (cards: ReactNode) => ReactNode
}

export function BlastRow<T>({ profession, items, renderItem, render }: { profession: Profession } & LitListProps<T>) {
  const { arcade } = useLabels()
  const { ref, on, reduced } = useScene('market')
  const [bout] = useState(() => blastBout(items.length))
  const { index, beat, take, replay } = useBout(bout, on, reduced)
  const lit = marksUpTo(bout, index, 'light')
  const blasting = beat.hero === 'hadouken'

  return (
    <div ref={ref}>
      <Ring
        profession={profession}
        stage="engineer"
        beat={beat}
        take={take}
        solo
        className="mb-6 h-36 sm:h-44"
        replayLabel={arcade.throwAgain}
        onReplay={reduced ? undefined : replay}
      >
        {blasting && (
          <span
            key={`blast-${take}`}
            className={`pointer-events-none absolute bottom-[38%] left-[18%] z-10 block w-full ${living.blast}`}
            aria-hidden="true"
          >
            <svg viewBox="-40 -16 56 32" className="h-10 w-16 sm:h-12 sm:w-20" focusable="false">
              <path d="M-4 -9 Q-26 -5 -36 0 Q-26 5 -4 9 Z" fill={FS.cyan} opacity={0.55} />
              <circle r={12} fill={FS.p1} opacity={0.45} />
              <circle r={9} fill={FS.cyan} />
              <circle r={5} fill={FS.flash} />
            </svg>
          </span>
        )}
      </Ring>
      {render(items.map((item, i) => renderItem(item, i < lit)))}
    </div>
  )
}

// ---- Projects: the super art ----

const superBout = (count: number): Beat[] => [
  { hero: 'stance', ms: 200 },
  { hero: 'hadouken', ms: 1100, mark: 'flash' },
  ...Array.from({ length: count }, (): Beat => ({
    hero: 'tatsumaki',
    ms: 360,
    mark: 'hit',
  })),
  { hero: 'win', ms: 0 },
]

export function SuperArt({ profession, count }: { profession: Profession; count: number }) {
  const { arcade } = useLabels()
  const land = useComboLand()
  const { ref, on, reduced } = useScene('harbour')
  const [bout] = useState(() => superBout(count))
  const { beat, take, started, replay } = useBout(bout, on, reduced)
  const flashing = !reduced && started && beat.mark === 'flash'
  const hitBeat = !reduced && beat.mark === 'hit'

  // Every hit of the super lands on the combo counter, once per beat.
  useEffect(() => {
    if (hitBeat) land()
  }, [hitBeat, take, land])

  return (
    <div ref={ref}>
      <Ring
        profession={profession}
        stage="engineer"
        beat={beat}
        take={take}
        solo
        className="mb-6 h-40 sm:h-52"
        replayLabel={arcade.superAgain}
        onReplay={reduced ? undefined : replay}
      >
        {flashing && (
          <div key={`super-${take}`} className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,#1530b8_0%,#000_60%)] ${living.dim}`} />
            <div
              className={`absolute inset-x-0 top-[18%] flex h-20 items-center gap-4 overflow-hidden border-y-4 border-[color:var(--fs-gold)] bg-[color:var(--fs-ko)] px-4 sm:h-24 ${living.cutIn}`}
            >
              <span className="relative h-full w-24 shrink-0 overflow-hidden sm:w-32">
                <Fighter
                  profession={profession}
                  pose="stance"
                  still
                  className="absolute -left-10 -top-4 h-56 w-[13rem] sm:-top-6 sm:h-72 sm:w-[17rem]"
                />
              </span>
              <span className="text-[clamp(1.5rem,6vw,2.5rem)] uppercase leading-none">
                <CallText>{arcade.superMove}</CallText>
              </span>
            </div>
            <div className={`absolute inset-0 bg-white ${living.superFlash}`} />
          </div>
        )}
        {hitBeat && (
          <span key={`hit-${take}`} className={`pointer-events-none absolute right-[18%] top-[30%] z-10 ${living.popScore}`} aria-hidden="true">
            <ImpactBurst className="h-16 w-16" />
          </span>
        )}
      </Ring>
    </div>
  )
}

// ---- Ventures: the parry ----

const parryBout = (count: number): Beat[] => [
  { hero: 'stance', partner: 'walk', ms: 600 },
  ...Array.from({ length: count }, (): Beat => ({
    hero: 'parry',
    partner: 'punch',
    ms: 700,
    mark: 'light',
  })),
  { hero: 'shoryuken', partner: 'hurt', ms: 760, mark: 'hit' },
  { hero: 'win', partner: 'stance', ms: 0 },
]

export function ParryRow<T>({ profession, items, renderItem, render }: { profession: Profession } & LitListProps<T>) {
  const { arcade } = useLabels()
  const { ref, on, reduced } = useScene('harbour')
  const [bout] = useState(() => parryBout(items.length))
  const { index, beat, take, started, replay } = useBout(bout, on, reduced)
  const lit = marksUpTo(bout, index, 'light')

  return (
    <div ref={ref}>
      <Ring
        profession={profession}
        stage="engineer"
        beat={beat}
        take={take}
        heroAt={started ? 'mid' : 'corner'}
        partnerAt={started ? 'close' : 'corner'}
        className="mb-6 h-40 sm:h-52"
        replayLabel={arcade.parryAgain}
        onReplay={reduced ? undefined : replay}
      />
      {render(items.map((item, i) => renderItem(item, i < lit)))}
    </div>
  )
}

// ---- Muay Thai: the sparring round, K.O. and Perfect ----

const SPAR_BOUT: Beat[] = [
  { hero: 'stance', partner: 'walk', ms: 600 },
  { hero: 'act', partner: 'hurt', ms: 1300, mark: 'hit' },
  { hero: 'punch', partner: 'hurt', ms: 480, mark: 'hit' },
  { hero: 'act', partner: 'down', ms: 1300, mark: 'ko' },
  { hero: 'win', partner: 'down', ms: 900 },
  { hero: 'win', partner: 'down', ms: 0, mark: 'perfect' },
]

export function SparRing({ profession }: { profession: Profession }) {
  const { arcade } = useLabels()
  const { ref, on, reduced } = useScene('temple')
  const { index, beat, take, started, replay } = useBout(SPAR_BOUT, on, reduced)
  const ko = reached(SPAR_BOUT, index, 'ko')
  const perfect = reached(SPAR_BOUT, index, 'perfect')

  return (
    <div ref={ref}>
      <Ring
        profession={profession}
        stage="fighter"
        beat={beat}
        take={take}
        heroAt={started ? 'mid' : 'corner'}
        partnerAt={started ? 'close' : 'corner'}
        className="mb-6 h-44 sm:h-60"
        replayLabel={arcade.sparAgain}
        onReplay={reduced ? undefined : replay}
      >
        {ko && (
          <span
            key={`ko-${take}`}
            className={`pointer-events-none absolute left-1/2 top-[18%] z-20 -ml-12 grid h-16 w-24 place-items-center border-4 border-white bg-[color:var(--fs-ko)] text-4xl shadow-[0_0_0_3px_#000] ${living.call}`}
            aria-hidden="true"
          >
            <CallText>{arcade.ko}</CallText>
          </span>
        )}
        {perfect && (
          <span
            key={`perfect-${take}`}
            className={`pointer-events-none absolute inset-x-0 top-[48%] z-20 text-center text-[clamp(1.75rem,7vw,3rem)] uppercase leading-none ${living.call}`}
            aria-hidden="true"
          >
            <CallText>{arcade.perfect}</CallText>
          </span>
        )}
      </Ring>
    </div>
  )
}

// ---- Bands: the show on the yacht's deck ----

const DECK_BOUT: Beat[] = [{ hero: 'act', partner: 'win', ms: 0 }]

// He plays his flurry on the kit while his partner dances on the deck and the crowd along the rail
// bobs; a pointer on a band's card makes them cheer, jumping higher and faster.
export function DeckShow({ children }: { children: (cheer: (on: boolean) => void) => ReactNode }) {
  const { ref, on, reduced } = useScene('harbour')
  const { beat, take } = useBout(DECK_BOUT, on, reduced)
  const [cheering, setCheering] = useState(false)

  return (
    <div ref={ref}>
      <div data-cheer={cheering || undefined}>
        <Ring profession="drummer" stage="drummer" beat={beat} take={take} partnerAt="mid" className="mb-6 h-40 sm:h-52">
          <svg
            viewBox="0 0 640 60"
            preserveAspectRatio="xMidYMax slice"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 w-full sm:h-14"
            aria-hidden="true"
            focusable="false"
          >
            <CrowdGroup x={20} base={60} count={5} gap={22} scale={0.9} i={0} />
            <CrowdGroup x={250} base={60} count={4} gap={22} scale={0.9} i={1} />
            <CrowdGroup x={460} base={60} count={6} gap={22} scale={0.9} i={2} />
          </svg>
        </Ring>
      </div>
      {children(setCheering)}
    </div>
  )
}
