'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useProfession } from '@/contexts/ProfessionContext'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { fillLabel } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { NameWords } from '@/components/cv/NameWords'
import { CVLink, HeroAction, PlayLink } from './actions'
import { cssVars } from './art'
import { ARRIVAL, BRANCHES, HUB, HubCompass, HubMapArt, landmarkPoint } from './hubMap'
import { JOURNAL_SERIF } from './palette'
import { shareOf } from './trail'
import { useTrailWalker, type WalkLeg } from './walk'
import { TrailWalker } from './walker'
import map from './map.module.css'

// The recruiter first screen and the profession pick, as the overworld map he arrives on.
//
//   unroll  0ms     the rolled map slides open to the right behind its wooden roller
//   ink     950ms   the island, woods, hills and landmarks rise into place; the name plaque swings down
//   trail   1500ms  the trail dots in one dot at a time, harbour to crossroads, then out to each landmark
//   land    2700ms  he drops onto the harbour tile
//   walk    3100ms  he walks the trail to the landmark of the shown profession; arriving makes it ready
//
// Pattern: setTimeout phases as data attributes the CSS keys its transitions on (transform and opacity
// only), and one requestAnimationFrame walker (walk.ts) for his steps. The resting frame is the plain
// style, so reduced motion and a World Select preview show the finished map with him at his landmark.
//
// The pick: each landmark is a radio of the shared ProfessionSwitch laid over the map. Choosing one sends
// him back along his trail to the crossroads and out along the chosen one; on arrival the profession
// changes and the camera dives into the landmark and back, the way the map enters a level. Arrow keys
// change the profession at once and he walks after it. One walk at a time: a pick made while he walks
// waits for him to arrive.

type Step = 'unrolled' | 'inked' | 'trailed' | 'landed'

const STEPS: ReadonlyArray<readonly [Step, number]> = [
  ['unrolled', 0],
  ['inked', 950],
  ['trailed', 1500],
  ['landed', 2700],
]

const WALK_AT = 3100
const ENTER_MS = 900
// How long he plays his profession's action after arriving at its landmark.
const ACT_MS = 1800
// Map units a second. The overworld walk is a steady 0.8125 px a frame on a 256 px screen, about a fifth of
// the screen a second; the hub map is one screen wide, so a fifth of its width.
const WALK_SPEED = 200

type Reached = Record<Step, boolean>

const NONE: Reached = { unrolled: false, inked: false, trailed: false, landed: false }
const ALL: Reached = { unrolled: true, inked: true, trailed: true, landed: true }

function useEntrance() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px' })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [reached, setReached] = useState<Reached>(NONE)
  const skip = reduced || preview

  useEffect(() => {
    if (skip) {
      setReached(ALL)
      return
    }
    if (!triggered) return
    const timers = STEPS.map(([step, at]) => window.setTimeout(() => setReached((now) => ({ ...now, [step]: true })), at))
    return () => timers.forEach(window.clearTimeout)
  }, [triggered, skip])

  return { ref, reached, skip, triggered }
}

const BRANCH_COUNT = Object.keys(BRANCHES).length

const branchEnd = (profession: Profession): number => BRANCHES[profession].length

const toLandmark = (from: Profession, to: Profession): WalkLeg[] => [
  { trail: BRANCHES[from], from: branchEnd(from), to: 0 },
  { trail: BRANCHES[to], from: 0, to: branchEnd(to) },
]

const fromHarbour = (to: Profession): WalkLeg[] => [
  { trail: ARRIVAL, from: 0, to: ARRIVAL.length },
  { trail: BRANCHES[to], from: 0, to: branchEnd(to) },
]

interface Pending {
  target: Profession
  then?: () => void
}

/** His place on the hub and the walks between landmarks, plus the camera's dive on arrival. */
function useHub(active: Profession, entrance: ReturnType<typeof useEntrance>) {
  const walker = useTrailWalker({ ...HUB, speed: WALK_SPEED })
  const { place, walk } = walker
  const at = useRef<Profession | null>(null)
  const walking = useRef(false)
  const pending = useRef<Pending | null>(null)
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState<Profession | null>(null)
  const [standing, setStanding] = useState<Profession | null>(null)
  const [visited, setVisited] = useState<ReadonlySet<Profession>>(() => new Set())
  const [acting, setActing] = useState(false)
  const actTimer = useRef(0)

  /** He plays his profession's action for a moment: on arrival, and when the visitor points at him. */
  const act = useCallback(() => {
    setActing(true)
    window.clearTimeout(actTimer.current)
    actTimer.current = window.setTimeout(() => setActing(false), ACT_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(actTimer.current), [])

  const arrive = useCallback((target: Profession) => {
    at.current = target
    setStanding(target)
    setVisited((now) => (now.has(target) ? now : new Set(now).add(target)))
    act()
  }, [act])

  const enter = useCallback((target: Profession) => {
    setEntering(target)
    window.setTimeout(() => setEntering(null), ENTER_MS)
  }, [])

  const goTo = useCallback(
    function go(target: Profession, then?: () => void) {
      if (walking.current) {
        pending.current = { target, then }
        return
      }
      const from = at.current
      if (from === target) {
        then?.()
        enter(target)
        return
      }
      walking.current = true
      walk(from ? toLandmark(from, target) : fromHarbour(target), () => {
        walking.current = false
        arrive(target)
        then?.()
        enter(target)
        const next = pending.current
        pending.current = null
        if (next) go(next.target, next.then)
      })
    },
    [arrive, enter, walk],
  )

  // He waits on the harbour until the entrance lands him, then walks to the shown profession.
  useEffect(() => {
    if (entrance.skip) {
      arrive(active)
      place(landmarkPoint(active))
      setReady(true)
      return
    }
    place(ARRIVAL.samples[0])
    // Placed once per entrance; later profession changes walk through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entrance.skip, place, arrive])

  useEffect(() => {
    if (entrance.skip || !entrance.reached.landed || ready) return
    const timer = window.setTimeout(() => goTo(active, () => setReady(true)), WALK_AT - 2700)
    return () => window.clearTimeout(timer)
    // The entrance walk starts once, toward the profession shown when he lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entrance.skip, entrance.reached.landed])

  // A profession changed without a walk (arrow keys, another control): he follows it.
  useEffect(() => {
    if (!ready || at.current === active) return
    goTo(active)
  }, [active, ready, goTo])

  const season = visited.size === BRANCH_COUNT ? 'fall' : 'summer'

  return { ...walker, goTo, ready, entering, standing, season, acting, act }
}

function PlaqueRopes() {
  return (
    <div className="pointer-events-none absolute -top-10 inset-x-0 flex justify-between px-10" aria-hidden="true">
      <span className="h-10 w-1 rounded-full bg-[color:var(--ap-bark)]" />
      <span className="h-10 w-1 rounded-full bg-[color:var(--ap-bark)]" />
    </div>
  )
}

/** The name plaque: a parchment board in a wooden frame, hung from the top of the map on two ropes. */
function NamePlaque() {
  const { navigation } = useLabels()
  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className={`relative mx-auto max-w-3xl ${map.plaque}`}>
          <div className={map.plaqueSettle}>
            <PlaqueRopes />
            <div className="relative rounded-md border-[6px] border-[color:var(--ap-wood)] bg-[color:var(--ap-page)] px-5 py-5 text-center text-[color:var(--ap-ink)] shadow-[0_6px_0_var(--ap-bark)] sm:px-8">
              {(['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'] as const).map((corner) => (
                <span key={corner} className={`absolute ${corner} h-2 w-2 rounded-full bg-[color:var(--ap-bark)]`} aria-hidden="true" />
              ))}
              <h1 className={`text-[clamp(1.75rem,8vw,2.25rem)] font-bold tracking-wide ${JOURNAL_SERIF}`}>
                <NameWords name={name} />
              </h1>
              <p className="mt-2 text-base font-semibold text-[color:var(--ap-route)]">{headline}</p>
              <p className="mt-1 text-sm italic text-[color:var(--ap-ink-soft)]">{tagline}</p>
              <p className="mt-1 text-sm">{line}</p>
              <nav className="mt-4 flex flex-wrap items-center justify-center gap-3" aria-label={navigation.contactAndCv}>
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PlayLink />
              </nav>
            </div>
          </div>
        </div>
      )}
    />
  )
}

interface LandmarkProps {
  option: ProfessionOption
  onPick: (option: ProfessionOption) => void
  /** Pointing at the landmark he stands on makes him act. */
  onPoint: (option: ProfessionOption) => void
}

/** A landmark on the map as a radio of the profession switch: it lifts and rings when pointed at. */
function Landmark({ option, onPick, onPoint }: LandmarkProps) {
  const [x, y] = shareOf(landmarkPoint(option.id), HUB.width, HUB.height)
  const { optionProps } = option

  return (
    <button
      type="button"
      {...optionProps}
      onClick={() => onPick(option)}
      onPointerEnter={() => onPoint(option)}
      className={`absolute left-[var(--x)] top-[var(--y)] flex h-[30%] w-[19%] flex-col items-center justify-end rounded-full ${map.landmark}`}
      style={cssVars({ '--x': `${x}%`, '--y': `${y - 6}%` })}
    >
      <span className={`pointer-events-none absolute bottom-[14%] h-[34%] w-[56%] rounded-full border-4 border-dashed border-[color:var(--ap-gold)] ${map.ring}`} aria-hidden="true" />
      <span
        className={`relative translate-y-full rounded-sm border-2 px-2 py-0.5 text-center text-sm font-bold leading-tight sm:whitespace-nowrap ${
          option.selected
            ? 'border-[color:var(--ap-ink)] bg-[color:var(--ap-gold)] text-[color:var(--ap-ink)]'
            : 'border-[color:var(--ap-ink)] bg-[color:var(--ap-page)] text-[color:var(--ap-ink)]'
        }`}
      >
        {option.label}
      </span>
    </button>
  )
}

/** The banner over the map naming the landmark he stands on, written again each time he arrives. */
function NameBox({ place }: { place: Profession | null }) {
  const { professions, professionFields, trail } = useLabels()
  return (
    <p className="flex min-h-[3rem] flex-wrap items-baseline justify-center gap-x-3 border-b-4 border-[color:var(--ap-wood)] bg-[color:var(--ap-ink)] px-4 py-2 text-center text-[color:var(--ap-page)]" aria-live="polite">
      {place && (
        <>
          <span key={place} className={`text-base font-bold uppercase tracking-widest ${JOURNAL_SERIF} ${map.nameBox}`}>
            {professions[place]}
          </span>
          <span className="text-sm text-[color:var(--ap-lantern)]">{professionFields[place]}</span>
          <span className="sr-only">{fillLabel(trail.standingAt, { place: professions[place] })}</span>
        </>
      )}
    </p>
  )
}

export function ExpeditionHero({ name }: { name: string }) {
  const { active } = useProfession()
  const { navigation, trail } = useLabels()
  const entrance = useEntrance()
  const hub = useHub(active, entrance)
  const { reached } = entrance
  const [ox, oy] = shareOf(landmarkPoint(hub.entering ?? active), HUB.width, HUB.height)

  const pick = (option: ProfessionOption) => {
    if (!hub.ready) {
      option.optionProps.onClick()
      return
    }
    hub.goTo(option.id, option.optionProps.onClick)
  }

  const point = (option: ProfessionOption) => {
    if (hub.ready && option.id === hub.standing) hub.act()
  }

  return (
    <div
      ref={entrance.ref}
      className="relative px-4 pb-6 pt-14 sm:px-6"
      data-unrolled={reached.unrolled}
      data-inked={reached.inked}
      data-trailed={reached.trailed}
      data-landed={reached.landed}
    >
      <NamePlaque />

      <section className="relative mx-auto mt-6 max-w-5xl" aria-label={navigation.professionSelection}>
        <div className={map.mapTilt}>
          <div
            className="relative overflow-hidden rounded-md border-[6px] border-[color:var(--ap-wood)] bg-[color:var(--ap-parchment)] shadow-[0_10px_0_var(--ap-bark)]"
            data-season={hub.season}
          >
            <NameBox place={hub.standing} />
            <div className="relative" role="img" aria-label={fillLabel(trail.mapOf, { name })}>
              <div className={map.camera} data-entering={hub.entering !== null} style={cssVars({ '--ox': `${ox}%`, '--oy': `${oy}%` })}>
                <HubMapArt />
                <div ref={hub.markerRef} className={`pointer-events-none absolute inset-0 ${map.marker}`} data-acting={hub.acting} aria-hidden="true">
                  <div className={`absolute left-0 top-0 w-[5.2%] -translate-x-1/2 -translate-y-[92%] ${map.markerDrop}`}>
                    <div className={map.figure}>
                      <TrailWalker profession={active} className="h-auto w-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`pointer-events-none absolute inset-0 ${map.mosaic}`} aria-hidden="true" />
            </div>

            <ProfessionSwitch
              className="absolute inset-x-0 bottom-0 aspect-[5/3]"
              label={navigation.profession}
              renderOption={(option) => <Landmark option={option} onPick={pick} onPoint={point} />}
            />

            <div className="pointer-events-none absolute bottom-3 left-3 opacity-90" aria-hidden="true">
              <HubCompass />
            </div>

            {/* the rolled part of the map: the dark table, and the wooden roller at its edge */}
            <div className={`pointer-events-none absolute inset-0 bg-[color:var(--ap-night)] ${map.cover}`} aria-hidden="true">
              <div className="absolute inset-y-0 -left-3 w-6 rounded-full bg-[linear-gradient(90deg,var(--ap-bark),var(--ap-wood)_45%,var(--ap-bark))]" />
            </div>
          </div>
        </div>
        <p className="mx-auto mt-3 w-fit rounded-md bg-[color:var(--ap-hud)] px-3 py-1 text-center text-sm text-white">{trail.walkHint}</p>
      </section>
    </div>
  )
}
