import type { ReactNode } from 'react'
import { NameWords } from '@/components/cv/NameWords'
import { HOSE } from './palette'
import world from './world.module.css'

// Rubber Hose's art pieces, drawn in SVG in the palette's ink and paper: the pie eyes its props wear, a
// music note, the ink blot a poster throws, the curled title banner and the bouncing title.

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

// His name in hand lettered capitals (the letters' uppercase class, so the text stays as written), the whole
// name bouncing on the beat. The letters are drawn for the eye, a word never breaking across lines; the
// heading is read as the plain name.
export function CartoonTitle({ text }: { text: string }) {
  return (
    <h1 className={`text-[clamp(1.5rem,7.5vw,2rem)] leading-tight sm:text-[clamp(2rem,5vw,3.5rem)] ${world.lettering}`}>
      <span className="sr-only">{text}</span>
      <span className={`inline-flex flex-wrap justify-center gap-x-4 uppercase ${world.title} ${world.titleBounce}`} aria-hidden="true">
        <NameWords name={text} wordClassName="inline-flex gap-x-1" letter={(char) => <span className="inline-block">{char}</span>} />
      </span>
    </h1>
  )
}
