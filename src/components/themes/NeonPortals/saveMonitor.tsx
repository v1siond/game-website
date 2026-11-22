'use client'

import { useMemo, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useProfession } from '@/contexts/ProfessionContext'
import { useZoneStage } from '@/hooks/useZoneStage'
import { useFindCount } from '../shared/finds'
import { ContactActions, SceneButton } from './actions'
import { SAVE_FROM, saveScene, type Motion } from './choreography'
import { PORTAL, type Era } from './palette'
import { Region, Rig, Strip, useScene } from './stage'
import { Hologram, type HologramState } from './tally'
import css from './saveMonitor.module.css'

// Contact back on the hub as the save monitor (research part 2 [18]): a curved monitor with a floppy disk
// glyph and no letters stands on the riveted floor with the tally's hologram floating over it. "Save" walks
// him to it and he presses it. With every find found the hologram turns into the gem, a light flashes with
// no word and he dances his victory dance; otherwise the screen blinks once and the hologram stays dim. His
// email, LinkedIn, CV and engine links sit on the plate beside the strip from md up, under it on a phone.
//
// Animated: him, the hologram, the flash, the screen's blink. Each save plays once, under 3 s.
// Reduced motion: him at the monitor, the hologram as the gem (the run counts as full).

const WAITING: Motion = { pose: 'idle', from: SAVE_FROM, to: SAVE_FROM, ms: 0 }

/** The hologram before a save: lit when the run is full, dim while finds are left. */
const ready = (full: boolean): HologramState => (full ? 'box' : 'dim')

function Monitor() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <path d="M40 78 L36 94 H64 L60 78 Z" fill={PORTAL.IRON_DARK} stroke={PORTAL.INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M6 14 Q50 2 94 14 L90 74 Q50 84 10 74 Z" fill={PORTAL.IRON} stroke={PORTAL.INK} strokeWidth={3.4} strokeLinejoin="round" />
      <path className={css.screen} d="M16 22 Q50 13 84 22 L81 66 Q50 74 19 66 Z" fill={PORTAL.SCREEN} stroke={PORTAL.INK} strokeWidth={2.4} strokeLinejoin="round" />
      <g stroke={PORTAL.INK} strokeWidth={2} strokeLinejoin="round">
        <path d="M37 30 H60 L66 36 V60 H37 Z" fill={PORTAL.BLUE} />
        <rect x={43} y={30} width={15} height={10} fill={PORTAL.IRON_FACE} />
        <rect x={42} y={47} width={19} height={13} fill={PORTAL.WHITE} />
      </g>
      <circle cx={82} cy={74} r={2.6} fill={PORTAL.GOLD} />
    </svg>
  )
}

function SaveScene({ full, still, onDone }: { full: boolean; still: boolean; onDone: () => void }) {
  const scene = useScene(useMemo(() => saveScene(full), [full]), { still, onDone })
  const gem = full && scene.reached('gem')
  return (
    <>
      <MonitorStand blink={!full && scene.reached('blink')} holo={gem ? 'gem' : ready(full)} />
      <span className={css.flash} data-on={gem} />
      <Rig motion={scene.motion} step={scene.step} run size="strip" onAnimationEnd={scene.onRigEnd} />
    </>
  )
}

function MonitorStand({ blink, holo }: { blink: boolean; holo: HologramState }) {
  return (
    <div className={css.monitor} data-blink={blink}>
      <Hologram state={holo} className={css.holo} />
      <Monitor />
    </div>
  )
}

export function SaveMonitorLevel() {
  const { sections, actions, navigation } = useLabels()
  const { active } = useProfession()
  const { found, total } = useFindCount(active)
  const { ref, on, reduced: still } = useZoneStage<Era>('hub')
  const [round, setRound] = useState(0)
  const [ended, setEnded] = useState(0)
  const full = still || found >= total
  const saving = round > ended

  return (
    <Region title={sections.contact} stageRef={ref} on={on} tally>
      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
        <div>
          <Strip size="h-56">
            <div className="absolute inset-0" data-still={still || undefined}>
              {round === 0 && !still ? (
                <>
                  <MonitorStand blink={false} holo={ready(full)} />
                  <Rig motion={WAITING} step={0} run={on} size="strip" />
                </>
              ) : (
                <SaveScene key={round} full={full} still={still} onDone={() => setEnded(round)} />
              )}
            </div>
          </Strip>
          {!still && <SceneButton label={actions.save} onPress={() => setRound(round + 1)} disabled={saving} className="-mt-2" />}
        </div>
        <RecruiterHero
          render={({ actions: links }) => (
            <nav
              className="flex flex-wrap gap-3 rounded-2xl border-4 border-[color:var(--np-ink)] bg-[color:var(--np-panel)] p-5 shadow-[0_6px_0_var(--np-ink)] md:flex-col md:items-stretch"
              aria-label={navigation.contactAndCv}
            >
              <ContactActions actions={links} />
            </nav>
          )}
        />
      </div>
    </Region>
  )
}
