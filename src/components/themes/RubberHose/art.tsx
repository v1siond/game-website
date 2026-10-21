import type { ReactNode } from 'react'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Rubber Hose's art pieces, drawn in SVG in the palette's ink and paper: the pie eyes its props wear
// (never him), a music note, the ink blot a poster throws, the curled title banner, the bouncing title,
// and the three art breaks between sections (a film leader counting down, a sing along line with its
// bouncing ball, pie eyed balls bouncing in a row).

// Two pie eyes, the black ovals with the slice cut out of each, centred on (cx, cy) at width `size`.
export function PieEyes({ cx, cy, size, paper = HOSE.paper }: { cx: number; cy: number; size: number; paper?: string }) {
  const rx = size * 0.22
  const ry = size * 0.3
  const gap = size * 0.28

  return (
    <g>
      {[cx - gap, cx + gap].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill={HOSE.ink} />
          <path d={`M${x} ${cy - ry * 0.9} L${x} ${cy} L${x - rx * 0.9} ${cy} Z`} fill={paper} />
        </g>
      ))}
    </g>
  )
}

// An eighth note: the head, the stem and the flag.
export function MusicNote({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 28" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={7} cy={22} rx={6} ry={4.5} fill={HOSE.ink} transform="rotate(-20 7 22)" />
      <rect x={11.5} y={2} width={2} height={20} fill={HOSE.ink} />
      <path d="M13.5 2 Q19 6 17 13 Q16 8 13.5 7 Z" fill={HOSE.ink} />
    </svg>
  )
}

// The blot a poster throws in its corner when the pointer lands on it (world.module.css .blot).
export function InkBlot() {
  return (
    <svg viewBox="0 0 40 40" className={`pointer-events-none absolute -right-3 -top-3 h-10 w-10 ${world.blot}`} aria-hidden="true" focusable="false">
      <circle cx={22} cy={18} r={9} fill={HOSE.ink} />
      <ellipse cx={10} cy={12} rx={4} ry={3} fill={HOSE.ink} />
      <ellipse cx={33} cy={26} rx={3.5} ry={2.5} fill={HOSE.ink} />
      <circle cx={14} cy={30} r={2.5} fill={HOSE.ink} />
      <circle cx={34} cy={8} r={2} fill={HOSE.ink} />
    </svg>
  )
}

function Curl({ className }: { className: string }) {
  return (
    <svg className={`absolute top-1/2 h-20 w-10 -translate-y-1/2 ${className}`} viewBox="0 0 40 80" aria-hidden="true" focusable="false">
      <path d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18" fill="none" stroke={HOSE.ink} strokeWidth={4} strokeLinecap="round" />
      <circle cx={15} cy={18} r={3} fill={HOSE.redDark} />
    </svg>
  )
}

// A section's title on a red banner between two ink curls.
export function CurlBanner({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div className="mb-6 text-center">
      <div className="relative inline-block">
        <Curl className="-left-10 hidden sm:block" />
        <h2 id={id} className={`relative px-8 py-3 text-lg uppercase ${world.banner} ${world.lettering}`}>
          {children}
        </h2>
        <Curl className="-right-10 hidden -scale-x-100 sm:block" />
      </div>
    </div>
  )
}

// His name in hand lettered capitals, the whole name bouncing on the beat. The letters are drawn for the
// eye, a word never breaking across lines; the heading is read as the plain name.
export function CartoonTitle({ text }: { text: string }) {
  return (
    <h1 className={`text-[clamp(2rem,5vw,3.5rem)] leading-tight ${world.lettering}`}>
      <span className="sr-only">{text}</span>
      <span className={`inline-flex flex-wrap justify-center gap-x-4 ${world.title} ${world.titleBounce}`} aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={`${w}-${word}`} className="inline-flex gap-x-1 whitespace-nowrap">
            {Array.from(word).map((char, i) => (
              <span key={`${i}-${char}`} className="inline-block">
                {char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  )
}

// The iris of an old film: a ring of ink round a round hole, in a square as wide as the box it covers
// (scenes.module.css .iris). The world's iris class scales it to open or close the hole; the ring is
// a hundred units wide round a hole of radius ten, so it covers the box from a small hole to a frame.
export function IrisRing({ className }: { className: string }) {
  return (
    <div className={`pointer-events-none ${styles.iris} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" focusable="false">
        <circle cx={50} cy={50} r={60} fill="none" stroke={HOSE.ink} strokeWidth={100} />
      </svg>
    </div>
  )
}

// ---- the art breaks ----

function FilmLeader() {
  return (
    <div className="relative my-8 overflow-hidden py-12" aria-hidden="true">
      <div className={`absolute inset-x-0 top-0 h-8 overflow-hidden ${world.filmStrip}`}>
        <div className={`absolute inset-y-0 -right-8 left-0 ${world.sprocketRow}`} />
      </div>
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="h-px w-16 bg-[var(--hose-ink)]" />
        {/* the countdown leader: the crosshair rings and the sweep going round */}
        <svg viewBox="0 0 80 80" className="h-20 w-20" focusable="false">
          <circle cx={40} cy={40} r={36} fill={HOSE.paperDark} stroke={HOSE.ink} strokeWidth={4} />
          <circle cx={40} cy={40} r={26} fill="none" stroke={HOSE.ink} strokeWidth={1.5} />
          <path d="M40 4 V76 M4 40 H76" stroke={HOSE.ink} strokeWidth={1} />
          <path d="M40 40 V6 A34 34 0 0 1 64 16 Z" fill={HOSE.ink} opacity={0.35} className={world.leaderSweep} />
          <PieEyes cx={40} cy={40} size={24} paper={HOSE.paperDark} />
        </svg>
        <div className="h-px w-16 bg-[var(--hose-ink)]" />
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-8 overflow-hidden ${world.filmStrip}`}>
        <div className={`absolute inset-y-0 -right-8 left-0 ${world.sprocketRow} ${world.sprocketRowReverse}`} />
      </div>
    </div>
  )
}

const SING_ALONG_NOTES = 6

function SingAlong() {
  return (
    <div className="relative my-8 py-10" aria-hidden="true">
      <svg className="absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2" viewBox="0 0 800 40" preserveAspectRatio="none" focusable="false">
        <path d="M0,20 Q100,0 200,20 T400,20 T600,20 T800,20" fill="none" stroke={HOSE.ink} strokeWidth={3} opacity={0.4} />
      </svg>
      <div className="flex items-center justify-around px-8">
        {Array.from({ length: SING_ALONG_NOTES }, (_, i) => (
          <MusicNote key={i} className="h-8 w-6 opacity-60" />
        ))}
      </div>
      {/* the ball that follows the tune, hopping note to note */}
      <div className={`relative mx-8 mt-4 h-4 ${world.hopLane}`}>
        <div className={`absolute left-0 top-0 ${world.hop}`}>
          <span className="block h-4 w-4 rounded-full bg-[var(--hose-ink)]" />
        </div>
      </div>
    </div>
  )
}

const BALL_DELAYS = ['[--delay:0s]', '[--delay:-0.33s]', '[--delay:-0.66s]']

function BouncingBalls() {
  return (
    <div className="relative my-8 py-10" aria-hidden="true">
      <div className="absolute inset-x-8 top-1/2 h-1 -translate-y-1/2 border-t-[3px] border-dashed border-[var(--hose-ink)] opacity-30" />
      <div className="flex h-24 items-end justify-around">
        {BALL_DELAYS.map((delay) => (
          <svg key={delay} viewBox="0 0 40 40" className={`h-10 w-10 ${world.ballBounce} ${delay}`} focusable="false">
            <circle cx={20} cy={20} r={17} fill={HOSE.paper} stroke={HOSE.ink} strokeWidth={3} />
            <PieEyes cx={20} cy={16} size={12} />
            <path d="M13 26 Q20 31 27 26" fill="none" stroke={HOSE.ink} strokeWidth={2} strokeLinecap="round" />
          </svg>
        ))}
      </div>
    </div>
  )
}

export type ArtBreakKind = 'filmLeader' | 'singAlong' | 'bouncingBalls'

const ART_BREAKS: Record<ArtBreakKind, () => ReactNode> = {
  filmLeader: FilmLeader,
  singAlong: SingAlong,
  bouncingBalls: BouncingBalls,
}

export function ArtBreak({ kind }: { kind: ArtBreakKind }) {
  const Break = ART_BREAKS[kind]
  return <Break />
}
