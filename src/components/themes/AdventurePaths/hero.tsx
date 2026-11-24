'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLatest } from '@/hooks/useLatest'
import { fillLabel } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { cssVars } from '@/lib/cssVars'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { Stage } from '../shared/theatre/Stage'
import { ContactSigns } from './actions'
import { BRANCHES, HUB, HubCompass, HubMapArt, landmarkPoint } from './hubMap'
import { JOURNAL_SERIF, TRAIL } from './palette'
import { LAYER_MOTION, type TrailScene } from './scenes'
import { shareOf } from './trail'
import { useTrailWalker, type WalkLeg } from './walk'
import { TrailWalker } from './walker'
import map from './map.module.css'
import page from './page.module.css'

// The hero: a big first screen over his house at the head of the path (scenes/hub.tsx), his name plaque
// and the world map he picks a profession on. He stands on the place of the shown profession. Each place
// is a radio of the shared ProfessionSwitch laid over the map; choosing one sends him back along his path
// to the crossroads and out along the chosen one, and on arrival the profession changes and the camera
// dives into the place and back, the way the map enters a level. Arrow keys change the profession at once
// and he walks after it. One walk at a time: a pick made while he walks waits for him to arrive. His
// outfit plate sits under the plaque from lg, its fan opening down into the free sky, and under the map
// below lg, its fan opening up into a band of open sky.

// The wardrobe's journal plate: ink on the page, 14.8 to 1, edged in bark.
const OUTFIT_LOOK: WardrobeLook = { plate: TRAIL.PAGE, text: TRAIL.INK, ring: TRAIL.BARK }

// Map units a second: about a third of the hub map's width a second.
const WALK_SPEED = 345
// How long he plays his profession's action after arriving at its landmark.
const ACT_MS = 1800
// The camera's dive into the landmark he arrives at (camera-enter and mosaic-in in map.module.css).
const ENTER_MS = 900

const BRANCH_COUNT = Object.keys(BRANCHES).length

const branchEnd = (profession: Profession): number => BRANCHES[profession].length

const toLandmark = (from: Profession, to: Profession): WalkLeg[] => [
  { trail: BRANCHES[from], from: branchEnd(from), to: 0 },
  { trail: BRANCHES[to], from: 0, to: branchEnd(to) },
]

interface Pending {
  target: Profession
  then?: () => void
}

/** His place on the hub and the walks between landmarks, plus the camera's dive on arrival. */
function useHub(active: Profession) {
  const walker = useTrailWalker({ ...HUB, speed: WALK_SPEED })
  const { place, walk } = walker
  const at = useRef<Profession | null>(null)
  const walking = useRef(false)
  const pending = useRef<Pending | null>(null)
  const [entering, setEntering] = useState<Profession | null>(null)
  const [standing, setStanding] = useState<Profession | null>(null)
  const [visited, setVisited] = useState<ReadonlySet<Profession>>(() => new Set())
  const [acting, setActing] = useState(false)
  const actTimer = useRef(0)
  const enterTimer = useRef(0)

  /** He plays his profession's action for a moment: on arrival, and when the visitor points at him. */
  const act = useCallback(() => {
    setActing(true)
    window.clearTimeout(actTimer.current)
    actTimer.current = window.setTimeout(() => setActing(false), ACT_MS)
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(actTimer.current)
      window.clearTimeout(enterTimer.current)
    },
    [],
  )

  const arrive = useCallback((target: Profession) => {
    at.current = target
    setStanding(target)
    setVisited((now) => (now.has(target) ? now : new Set(now).add(target)))
  }, [])

  const enter = useCallback((target: Profession) => {
    // A second pick inside the dive restarts it, so the first pick's timer never cuts the new dive short.
    window.clearTimeout(enterTimer.current)
    setEntering(target)
    enterTimer.current = window.setTimeout(() => setEntering(null), ENTER_MS)
  }, [])

  const goTo = useCallback(
    function go(target: Profession, then?: () => void) {
      if (walking.current) {
        pending.current = { target, then }
        return
      }
      const from = at.current ?? target
      if (from === target) {
        then?.()
        enter(target)
        return
      }
      walking.current = true
      walk(toLandmark(from, target), () => {
        walking.current = false
        arrive(target)
        act()
        then?.()
        enter(target)
        const next = pending.current
        pending.current = null
        if (next) go(next.target, next.then)
      })
    },
    [act, arrive, enter, walk],
  )

  // He starts on the landmark of the profession shown when the page opens.
  const shown = useLatest(active)
  useEffect(() => {
    arrive(shown.current)
    place(landmarkPoint(shown.current))
  }, [arrive, place, shown])

  // A profession changed without a walk (arrow keys, another control): he follows it.
  useEffect(() => {
    if (at.current === null || at.current === active) return
    goTo(active)
  }, [active, goTo])

  const season = visited.size === BRANCH_COUNT ? 'fall' : 'summer'

  return { ...walker, goTo, entering, standing, season, acting, act }
}

function PlaqueRopes() {
  return (
    <div className="pointer-events-none absolute -top-8 inset-x-0 flex justify-between px-10" aria-hidden="true">
      <span className="h-8 w-1 rounded-full bg-[color:var(--ap-bark)]" />
      <span className="h-8 w-1 rounded-full bg-[color:var(--ap-bark)]" />
    </div>
  )
}

/** The name plaque: a parchment board in a wooden frame, hung on two ropes. */
function NamePlaque() {
  const { navigation } = useLabels()
  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className="relative">
          <PlaqueRopes />
          <div className="relative rounded-md border-[6px] border-[color:var(--ap-wood)] bg-[color:var(--ap-page)] px-4 py-4 text-center text-[color:var(--ap-ink)] shadow-[0_6px_0_var(--ap-bark)] sm:px-6">
            {(['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'] as const).map((corner) => (
              <span key={corner} className={`absolute ${corner} h-2 w-2 rounded-full bg-[color:var(--ap-bark)]`} aria-hidden="true" />
            ))}
            <h1 id="trail-hero" className={`text-[clamp(1.6rem,7vw,2.4rem)] font-bold leading-tight tracking-wide ${JOURNAL_SERIF}`}>
              <NameWords name={name} />
            </h1>
            <p className="mt-1 text-base font-semibold text-[color:var(--ap-route-text)]">{headline}</p>
            <p className="mt-1 text-sm italic text-[color:var(--ap-ink-soft)]">{tagline}</p>
            <p className="mt-1 text-sm">{line}</p>
            <nav className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label={navigation.contactAndCv}>
              <ContactSigns actions={actions} />
            </nav>
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
        className={`relative translate-y-full rounded-sm border-2 border-[color:var(--ap-ink)] px-2 py-0.5 text-center text-sm font-bold leading-tight text-[color:var(--ap-ink)] sm:whitespace-nowrap ${
          option.selected ? 'bg-[color:var(--ap-gold)]' : 'bg-[color:var(--ap-page)]'
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
    <p className="flex min-h-[2.75rem] flex-wrap items-baseline justify-center gap-x-3 border-b-4 border-[color:var(--ap-wood)] bg-[color:var(--ap-ink)] px-4 py-2 text-center text-[color:var(--ap-page)]" aria-live="polite">
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

function HubMap({ name }: { name: string }) {
  const { active } = useProfession()
  const { navigation, trail } = useLabels()
  const hub = useHub(active)
  const [ox, oy] = shareOf(landmarkPoint(hub.entering ?? active), HUB.width, HUB.height)

  const pick = (option: ProfessionOption) => hub.goTo(option.id, option.optionProps.onClick)

  const point = (option: ProfessionOption) => {
    if (option.id === hub.standing) hub.act()
  }

  return (
    <section className={page.map} aria-label={navigation.professionSelection}>
      <div className={map.mapTilt}>
        <div className="relative overflow-hidden rounded-md border-[6px] border-[color:var(--ap-wood)] bg-[color:var(--ap-parchment)] shadow-[0_10px_0_var(--ap-bark)]" data-season={hub.season}>
          <NameBox place={hub.standing} />
          <div className="relative" role="img" aria-label={fillLabel(trail.mapOf, { name })}>
            <div className={map.camera} data-entering={hub.entering !== null} style={cssVars({ '--ox': `${ox}%`, '--oy': `${oy}%` })}>
              <HubMapArt />
              <div ref={hub.markerRef} className={`pointer-events-none absolute inset-0 ${map.marker}`} data-acting={hub.acting} aria-hidden="true">
                <div className="absolute left-0 top-0 w-[5.2%] -translate-x-1/2 -translate-y-[92%]">
                  <div data-worlds-figure="" className={map.figure}>
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

          {/* a phone map is too small for the compass beside the low landmark labels, so it shows from sm up */}
          <div className="pointer-events-none absolute bottom-3 left-3 hidden opacity-90 sm:block" aria-hidden="true">
            <HubCompass />
          </div>
        </div>
      </div>
    </section>
  )
}

export function ExpeditionHero({ scene, name, still }: { scene: TrailScene; name: string; still: boolean }) {
  return (
    <section id={scene.anchor} data-scene={scene.id} data-worlds-hero="" aria-labelledby="trail-hero" className={page.hero}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <div className={page.plaque}>
        <NamePlaque />
      </div>
      <HubMap name={name} />
      <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-from-lg ${page.wardrobe}`} />
    </section>
  )
}
