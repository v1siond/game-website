'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { DECO_COLORS as C } from './palette'
import camera from './camera.module.css'

// Projects as the research board: every project a photograph pinned up, its plate still half developed.
// Over the board a camera viewfinder follows the pointer (fixed to the viewport, moved by --mx and --my
// from the root), and the brass corner brackets lock onto the photograph under it. Snap fires the flash,
// the plate develops to full colour and the print is stamped developed.
//
// Pattern: CSS off one shared section trigger for the arrival (each print swings in on its pin, tilted
// by its place), React state per print for the snap (the flash and the stamp remount under a key, so a
// keyframe plays once a snap). Reduced motion: no swing, no flash, the plate develops at once.

type Plate = (id: string) => ReactNode

// Three plates the camera can find in the city, each a 160 by 90 scene; a project takes one by its place.
const PLATES: Plate[] = [
  // the skyline: stepped towers against the water
  (id) => (
    <>
      <rect width="160" height="90" fill={`url(#${id})`} />
      {[
        [10, 40],
        [36, 62],
        [70, 74],
        [104, 56],
        [130, 44],
      ].map(([x, h]) => (
        <path key={x} d={`M${x} 90 V${90 - h + 10} H${x + 4} V${90 - h} H${x + 16} V${90 - h + 10} H${x + 20} V90 Z`} fill="#0e2c44" stroke={C.gold} strokeWidth="0.8" />
      ))}
      {[18, 44, 78, 112].map((x) => (
        <rect key={x} x={x} y="60" width="3" height="4" fill={C.goldBright} />
      ))}
    </>
  ),
  // the sunburst over a theatre door
  (id) => (
    <>
      <rect width="160" height="90" fill={`url(#${id})`} />
      {Array.from({ length: 11 }, (_, i) => -75 + i * 15).map((angle) => (
        <path key={angle} d="M80 90 L80 10" stroke={C.gold} strokeWidth="2" opacity="0.7" transform={`rotate(${angle} 80 90)`} />
      ))}
      <path d="M60 90 V56 A20 20 0 0 1 100 56 V90 Z" fill={C.bloodDark} stroke={C.goldBright} strokeWidth="2" />
    </>
  ),
  // the glass tunnel with the sea outside
  (id) => (
    <>
      <rect width="160" height="90" fill={`url(#${id})`} />
      <path d="M0 90 V40 Q80 -10 160 40 V90" fill="none" stroke={C.brassMid} strokeWidth="4" />
      {[30, 55, 80, 105, 130].map((x) => (
        <path key={x} d={`M${x} 90 V${30 - Math.abs(80 - x) * 0.2}`} stroke={C.brassDark} strokeWidth="2" />
      ))}
      <path d="M20 80 H140" stroke={C.waterGlow} strokeWidth="1.5" opacity="0.6" />
    </>
  ),
]

function PlateArt({ index, projectId }: { index: number; projectId: Project['id'] }) {
  const gradient = `deco-plate-${projectId}`
  return (
    <svg viewBox="0 0 160 90" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.tealDark} />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
      </defs>
      {PLATES[index % PLATES.length](gradient)}
    </svg>
  )
}

const BRACKETS = ['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2']

function Photograph({ slot, index }: { slot: ProjectSlot; index: number }) {
  const { project, years, links } = slot
  const labels = useLabels()
  const [snaps, setSnaps] = useState(0)
  const developed = snaps > 0

  return (
    <article data-developed={developed || undefined} className={`group relative ${camera.print}`} style={{ '--i': index } as CSSProperties}>
      <span className={`absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full ${camera.pin}`} aria-hidden="true" />
      <div className={`relative p-3 pb-5 ${camera.paper}`}>
        <div className="relative overflow-hidden">
          <PlateArt index={index} projectId={project.id} />
          <span className={`pointer-events-none absolute inset-0 ${camera.veil}`} aria-hidden="true" />
          {snaps > 0 && <span key={snaps} className={`pointer-events-none absolute inset-0 bg-white ${camera.flash}`} aria-hidden="true" />}
          {developed && (
            <span className={`absolute bottom-2 right-2 px-2 py-0.5 text-sm uppercase tracking-[0.15em] ${camera.stamp}`}>{labels.deco.developed}</span>
          )}
        </div>

        <div className="mt-4 px-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`text-lg leading-snug ${camera.title}`}>{project.name}</h3>
            {years && <span className="whitespace-nowrap text-sm text-[color:var(--deco-sepia)]">{years}</span>}
          </div>
          <p className="mt-1 text-sm font-bold text-[color:var(--deco-blood)]">{project.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--deco-abyss)]">{project.tagline}</p>
          {project.impact && (
            <p className={`mt-3 px-3 py-2 text-sm italic ${camera.impact}`}>
              <span className="mr-2 not-italic uppercase tracking-[0.12em]">{labels.cards.impact}</span>
              {project.impact}
            </p>
          )}
          {project.techStack.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={labels.cards.technologiesUsed}>
              {project.techStack.slice(0, 4).map((tech) => (
                <li key={tech} className={`px-2 py-0.5 text-sm ${camera.tech}`}>
                  {tech}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {links.length > 0 ? (
              links.map(({ kind, label, linkProps }) => (
                <a key={kind} {...linkProps} className={`inline-flex min-h-[44px] items-center px-3 text-sm uppercase tracking-[0.12em] ${camera.link}`}>
                  {label}
                </a>
              ))
            ) : (
              <p className="text-sm text-[color:var(--deco-sepia)]">{labels.links.noPublicLink}</p>
            )}
            <button
              type="button"
              onClick={() => setSnaps((count) => count + 1)}
              aria-label={fillLabel(labels.deco.snapOf, { project: project.name })}
              className={`ml-auto inline-flex min-h-[44px] items-center gap-2 px-3 text-sm uppercase tracking-[0.12em] ${camera.snap}`}
            >
              <svg viewBox="0 0 20 16" className="h-4 w-5" aria-hidden="true" focusable="false">
                <path d="M1 4 H6 L8 1 H12 L14 4 H19 V15 H1 Z" fill="currentColor" />
                <circle cx="10" cy="9" r="3.5" fill="none" stroke={C.cream} strokeWidth="1.5" />
              </svg>
              {labels.deco.snap}
            </button>
          </div>
        </div>
      </div>

      {BRACKETS.map((place) => (
        <span key={place} className={`pointer-events-none absolute h-6 w-6 border-[color:var(--deco-gold-bright)] ${place} ${camera.bracket}`} aria-hidden="true" />
      ))}
    </article>
  )
}

// The viewfinder that follows the pointer over the board: a focus ring, the crosshair, the frame corners.
function Viewfinder() {
  return (
    <div className={`pointer-events-none fixed left-1/2 top-1/2 z-40 h-28 w-40 ${camera.finder}`} aria-hidden="true">
      <svg viewBox="0 0 160 112" className="h-full w-full" focusable="false">
        <path d="M2 22 V2 H22 M138 2 H158 V22 M158 90 V110 H138 M22 110 H2 V90" fill="none" stroke={C.goldBright} strokeWidth="3" />
        <circle cx="80" cy="56" r="18" fill="none" stroke={C.goldBright} strokeWidth="1.5" />
        <path d="M80 30 V44 M80 68 V82 M54 56 H68 M92 56 H106" stroke={C.goldBright} strokeWidth="1.5" />
      </svg>
    </div>
  )
}

/** The projects as a masonry research board under the viewfinder. */
export function ResearchBoard({ projects }: { projects: Project[] }) {
  const { ref, triggered } = useSectionTrigger()

  return (
    <div ref={ref} data-on={triggered || undefined} className={`relative ${camera.board}`}>
      <Viewfinder />
      <ProjectList
        projects={projects}
        className={`pt-3 ${MASONRY_LIST}`}
        itemClassName={`${MASONRY_ITEM} pt-2`}
        renderProject={(slot) => <Photograph slot={slot} index={projects.indexOf(slot.project)} />}
      />
    </div>
  )
}
