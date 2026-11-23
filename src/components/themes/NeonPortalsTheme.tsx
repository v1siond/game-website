'use client'

import { useMemo } from 'react'
import { Atkinson_Hyperlegible, Bungee } from 'next/font/google'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useYearNow } from '@/hooks/useYearNow'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { BODY } from './NeonPortals/cards'
import { CorridorWorld } from './NeonPortals/corridor'
import { PORTAL_VARS } from './NeonPortals/palette'
import { ROOM_PLAN, roomAnchor, type RoomId } from './NeonPortals/plan'
import { HubHero, Room, roomMetas } from './NeonPortals/rooms'
import type { RoomSpec } from './NeonPortals/world'

// Neon Portals: his CV as one neon tunnel through time, seen head on. Scrolling moves the camera forward.
// He arrives at the Chronoport hub, the time ring turning behind him, his name and the three profession
// wings (the shared switch) on the hub's panels. Each section of the active profession is a room of its
// own era: the camera approaches its gate, flies through it, passes one prop per item while that item's
// card scrolls by, and flies into the era's vista; the tunnel dips to dark with warp sparks streaming past
// and the next era's gate comes up out of the dark. Contact is the beacon at the end. He runs ahead of the
// camera, seen from behind, and at each prop he acts (reaches for a shard, cheers a checkpoint, spins a
// crate open, jumps on a crate, drums, kicks a bag, waves) and turns to the camera with his own face.
//
// The stage (NeonPortals/corridor.tsx) is drawn by the shared scroll stage engine with its settle; the
// text is plain normal flow on opaque panels, readable from its first frame.

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
  const year = useYearNow()

  const rooms: PlannedRoom[] = useMemo(
    () => [
      ...sectionPlan(view.sections, professionalSummary.bio).map((slot) => ({ id: slot.id, slot, title: labels.sections[slot.titleKey] })),
      { id: 'contact', slot: null, title: labels.sections.contact },
    ],
    [view.sections, professionalSummary.bio, labels.sections],
  )
  const specs: RoomSpec[] = useMemo(
    () => rooms.map(({ id, slot }) => ({ id, ...ROOM_PLAN[id], metas: roomMetas(slot, labels, year, highlights) })),
    [rooms, labels, year, highlights],
  )
  const sections = rooms.slice(0, -1)
  const contact = rooms[rooms.length - 1]

  return (
    <CorridorWorld
      specs={specs}
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
