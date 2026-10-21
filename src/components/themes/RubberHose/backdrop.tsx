import { MusicNote } from './art'
import world from './world.module.css'

// Rubber Hose's page backdrop, fixed behind the content: the film stock down both edges with its
// sprocket holes running, the double ink rule framing the page, the projected film's grain, vignette
// and flicker, and a few notes drifting up like a cartoon's soundtrack. Seven animated elements in all,
// each a single transform or opacity loop that stops under reduced motion (world.module.css).

function FilmStrip({ side }: { side: 'left' | 'right' }) {
  const placement = side === 'left' ? 'left-0' : 'right-0'
  const run = side === 'left' ? '' : world.sprocketsReverse

  return (
    <div className={`pointer-events-none fixed inset-y-0 z-[4] w-5 overflow-hidden sm:w-12 ${placement} ${world.filmStrip}`} aria-hidden="true">
      <div className={`${world.sprockets} ${run}`} />
    </div>
  )
}

export function FilmFrame() {
  return (
    <>
      <FilmStrip side="left" />
      <FilmStrip side="right" />
      <div className={`pointer-events-none fixed inset-y-2 left-6 right-6 z-[5] sm:inset-y-4 sm:left-16 sm:right-16 ${world.frameRule}`} aria-hidden="true" />
    </>
  )
}

export function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[7] overflow-hidden" aria-hidden="true">
      <div className={world.grain} />
      <div className={`absolute inset-0 ${world.vignette}`} />
      <div className={`absolute inset-0 ${world.flicker}`} />
    </div>
  )
}

// Where each note starts along the bottom edge and when it sets off, as literal classes for the build.
const NOTES = [
  { place: 'left-[18%]', delay: '[--delay:0s]' },
  { place: 'left-[52%]', delay: '[--delay:-5s]' },
  { place: 'left-[80%]', delay: '[--delay:-9s]' },
]

export function RisingNotes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden="true">
      {NOTES.map(({ place, delay }) => (
        <div key={place} className={`absolute -bottom-10 ${place} ${world.noteRise} ${delay}`}>
          <MusicNote className="h-8 w-6" />
        </div>
      ))}
    </div>
  )
}
