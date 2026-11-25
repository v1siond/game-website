'use client'

import { useMemo } from 'react'
import { Atkinson_Hyperlegible, Bungee } from 'next/font/google'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { BODY } from './NeonPortals/cards'
import { CorridorWorld } from './NeonPortals/corridor'
import { PORTAL_VARS } from './NeonPortals/palette'
import { ROOM_ERA, roomAnchor, type RoomId } from './NeonPortals/plan'
import { HubHero, Room, roomCount } from './NeonPortals/rooms'
import type { SceneSpec } from './NeonPortals/scenes'
import { SETS } from './NeonPortals/sets'
import type { RoomSpec } from './NeonPortals/world'

// Neon Portals: his CV as one run through time, in the order of the time travelling platformer it comes
// from. A mad clockmaker's sky fortress breaks up and crashes, the living storm locked in it pours into the
// clockmaker's time machine, and he jumps in after it (the hero). Each section of the shown profession is
// one portal of the machine and the era behind it, with its own body and camera: a village run into the
// screen past a knight and two crates, the horned beast he runs from at the camera over the lava, the
// little sub under the sea, the motorbike race, the hammer guard in the arena, the time trial on the
// village road, the biplane among the blimps, the clockmaker at the machine's core, and at the end the
// machine imploding on the villains while he dances at the save screen (the contact). The firefly guardian
// joins him in the village and rides at his shoulder from then on.
//
// Between eras the camera flies down the machine's passage, the tunnel he approved, the runner ahead of it
// from behind; each era's set piece zooms in as its gate comes up and out past the camera as its section
// ends, and plays its one to three actions on the shared scene player (NeonPortals/corridor.tsx, sets/).
// The text is plain normal flow on opaque panels, readable from its first frame.

const face = Bungee({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--np-face' })
const body = Atkinson_Hyperlegible({ weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--np-body' })

interface PlannedRoom {
  id: RoomId
  slot: SectionSlot | null
  title: string
}

/** The map of the rooms: a disclosure in the top left corner, out of the launcher's way. */
function RoomMap({ rooms }: { rooms: readonly PlannedRoom[] }) {
  const { hud } = useLabels()
  return (
    <nav className="fixed left-4 top-4 z-20" aria-label={hud.sectionTabs}>
      <details>
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center border-2 border-[color:var(--a1)] bg-[color:var(--np-panel)] px-4 py-1.5 font-bold [&::-webkit-details-marker]:hidden">
          {hud.sectionTabs}
        </summary>
        <ul className="mt-2 border border-[color:var(--np-seam)] bg-[color:var(--np-panel)] py-2">
          {rooms.map((room) => (
            <li key={room.id}>
              <a href={`#${roomAnchor(room.id)}`} className="block px-[1.1rem] py-2 no-underline hover:bg-[color:var(--np-raised)]">
                {room.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  )
}

export default function NeonPortalsTheme() {
  const view = useWorldView()
  const labels = useLabels()
  const { professionalSummary } = useCVData()
  const { highlights } = useAboutBlock()

  const rooms: PlannedRoom[] = useMemo(
    () => [
      ...sectionPlan(view.sections, professionalSummary.bio).map((slot) => ({ id: slot.id, slot, title: labels.sections[slot.titleKey] })),
      { id: 'contact', slot: null, title: labels.sections.contact },
    ],
    [view.sections, professionalSummary.bio, labels.sections],
  )
  const specs: RoomSpec[] = useMemo(() => rooms.map(({ id, slot }) => ({ id, era: ROOM_ERA[id], items: roomCount(slot, labels, highlights) })), [rooms, labels, highlights])
  const scenes: SceneSpec[] = useMemo(
    () => [
      { id: 'hero', set: SETS.hero, input: { profession: view.profession, count: 0 } },
      ...specs.map(({ id, items }) => ({ id, set: SETS[id], input: { profession: view.profession, count: items } })),
    ],
    [specs, view.profession],
  )
  const sections = rooms.slice(0, -1)
  const contact = rooms[rooms.length - 1]

  return (
    <CorridorWorld
      specs={specs}
      scenes={scenes}
      style={PORTAL_VARS}
      className={`relative min-h-screen overflow-x-clip bg-[color:var(--np-void)] text-[1.0625rem] leading-relaxed text-[color:var(--np-ink)] [--focus-ring:var(--np-white)] [--focus-halo:var(--np-void)] ${BODY} ${face.variable} ${body.variable}`}
    >
      <SkipLink />
      <RoomMap rooms={rooms} />
      <div className="relative z-[1]">
        <HubHero />
        <main id="main-content" tabIndex={-1}>
          <ProfessionRegion>
            {sections.map((room, index) => (
              <Room key={room.id} id={room.id} slot={room.slot} title={room.title} wing={index === 0 ? labels.professions[view.profession] : null} last={false} />
            ))}
          </ProfessionRegion>
          <Room id={contact.id} slot={null} title={contact.title} wing={null} last />
        </main>
        <footer className="pb-20 text-center">
          <p className="inline-block bg-[color:var(--np-panel)] px-4 py-1.5 text-sm text-[color:var(--np-muted)]">
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </CorridorWorld>
  )
}
