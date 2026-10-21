'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { Survivor, type SurvivorPose } from './survivor'
import { Stalker } from './stalker'
import { useDoor } from './door'
import { CARD_BUTTON, CVLink, HeroAction } from './actions'
import { PANEL_HEADING, sectionHeadingId } from './panels'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// Contact as the last corridor and the safe room past it. Go to the safe room starts the crossing, and the
// stalker comes through the corridor wall; he raises the handgun, and the genre's action prompts appear one
// at a time: Kick (the roundhouse that staggers it), then Suplex (that throws it back through the wall).
// The door (./door) then opens on the safe room: the typewriter types his line on the paper, and Save
// spends one of three ink ribbons, the genre's limited save. The ways to reach him are on the page in every
// phase, under the scene. Reduced motion and the World Select preview open straight on the safe room.
//
// Phases by setTimeout after each prompt, once each: corridor, burst, threat (Kick), kicked,
// staggered (Suplex), thrown, then the door to safe.
//
// Animated: him, the stalker's burst, stagger and throw, the wall's pieces, the corridor bulb, the typing.

type Phase = 'corridor' | 'burst' | 'threat' | 'kicked' | 'staggered' | 'thrown' | 'safe'

const BURST_MS = 900
const KICK_MS = 800
const THROW_MS = 1000
const RIBBONS = 3

const HIS_POSE: Record<Exclude<Phase, 'safe'>, SurvivorPose> = {
  corridor: 'idle',
  burst: 'aim',
  threat: 'aim',
  kicked: 'kick',
  staggered: 'aim',
  thrown: 'suplex',
}

const STALKER_LOOK: Record<Exclude<Phase, 'safe'>, string> = {
  corridor: horror.stalkerHidden,
  burst: horror.stalkerBurst,
  threat: horror.stalkerLoom,
  kicked: horror.stalkerStagger,
  staggered: horror.stalkerStaggered,
  thrown: horror.stalkerThrown,
}

// The wall section he comes through, in four pieces that fly out toward the camera.
const PIECES = [
  { x: 404, y: 70, dx: -40, dy: -30 },
  { x: 436, y: 70, dx: 30, dy: -40 },
  { x: 404, y: 130, dx: -50, dy: 30 },
  { x: 436, y: 130, dx: 40, dy: 20 },
]

function Corridor({ profession, phase }: { profession: Profession; phase: Exclude<Phase, 'safe'> }) {
  const broken = phase !== 'corridor'

  return (
    <div className={`relative aspect-[600/220] w-full overflow-hidden border-2 border-[color:var(--sh-sepia)] ${horror.cameraFrame}`} aria-hidden="true">
      <svg viewBox="0 0 600 220" className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          <linearGradient id="sh-corridor-depth" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={SH.panel} />
            <stop offset="100%" stopColor={SH.void} />
          </linearGradient>
        </defs>
        <rect width={600} height={206} fill="url(#sh-corridor-depth)" />
        <path d="M0 120 H600" stroke={SH.wood} strokeWidth={3} />
        {[60, 180, 300, 520].map((x) => (
          <rect key={x} x={x} y={40} width={50} height={70} fill="none" stroke={SH.sepia} strokeWidth={2} />
        ))}
        <rect y={206} width={600} height={14} fill={SH.shadow} />
        <path d="M0 206 H600" stroke={SH.sepia} strokeWidth={2} />
        <g className={horror.bulb}>
          <line x1={250} y1={0} x2={250} y2={26} stroke={SH.ash} strokeWidth={1.2} />
          <circle cx={250} cy={30} r={4} fill={SH.flame} />
          <circle cx={250} cy={30} r={40} fill={SH.flame} opacity={0.08} />
        </g>
        {/* the hole in the wall behind the pieces */}
        <rect x={404} y={70} width={64} height={120} fill={SH.void} opacity={broken ? 1 : 0} />
        {PIECES.map((piece) => (
          <rect
            key={`${piece.x}-${piece.y}`}
            x={piece.x}
            y={piece.y}
            width={32}
            height={60}
            fill={SH.wood}
            stroke={SH.sepia}
            strokeWidth={2}
            className={`${horror.wallPiece} ${broken ? horror.wallPieceOut : ''}`}
            style={{ '--dx': `${piece.dx}px`, '--dy': `${piece.dy}px` } as CSSProperties}
          />
        ))}
        <Survivor profession={profession} pose={HIS_POSE[phase]} place={{ x: 150, y: 206, height: 118 }} />
      </svg>
      <div className={`absolute bottom-[6%] left-[64%] h-[74%] ${STALKER_LOOK[phase]}`}>
        <Stalker className="h-full w-auto" />
      </div>
    </div>
  )
}

function SafeRoomArt() {
  return (
    <div className={`relative aspect-[600/220] w-full overflow-hidden border-2 border-[color:var(--sh-sepia)] ${horror.cameraFrame}`} aria-hidden="true">
      <svg viewBox="0 0 600 220" className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          <radialGradient id="sh-safe-lamp" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={SH.flame} stopOpacity={0.4} />
            <stop offset="100%" stopColor={SH.flame} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={600} height={180} fill={SH.paper} />
        <rect y={180} width={600} height={40} fill={SH.sepia} />
        <circle cx={300} cy={120} r={150} fill="url(#sh-safe-lamp)" className={horror.hallPool} />
        {/* the item box, a chest against the wall */}
        <rect x={60} y={130} width={120} height={60} fill={SH.wood} />
        <path d="M60 130 Q120 104 180 130 Z" fill={SH.rust} />
        <rect x={114} y={140} width={12} height={14} fill={SH.brass} />
        {/* the desk, the typewriter on it, the ribbon tins beside it */}
        <rect x={250} y={140} width={180} height={10} fill={SH.wood} />
        <path d="M262 150 V196 M418 150 V196" stroke={SH.wood} strokeWidth={6} />
        <path d="M296 140 L304 112 H376 L384 140 Z" fill={SH.gunmetal} />
        <rect x={312} y={96} width={56} height={18} fill={SH.ivory} />
        <path d="M318 102 H350 M318 108 H340" stroke={SH.ash} strokeWidth={1} />
        <g className={horror.typeBar}>
          <rect x={336} y={112} width={8} height={6} fill={SH.steel} />
        </g>
        {[400, 412].map((x) => (
          <rect key={x} x={x} y={130} width={10} height={10} rx={1} fill={SH.leather} />
        ))}
        {/* the lamp on the desk */}
        <path d="M268 140 V112 M256 112 H280 L272 96 H264 Z" stroke={SH.brass} strokeWidth={2} fill={SH.brass} />
        <circle cx={268} cy={108} r={3} fill={SH.flame} />
      </svg>
    </div>
  )
}

function SaveDesk({ line }: { line: string }) {
  const { horror: words } = useLabels()
  const [ribbons, setRibbons] = useState(RIBBONS)
  const saved = ribbons < RIBBONS

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
      <div className="relative overflow-hidden bg-[color:var(--sh-ivory)] p-4">
        <p className={`text-base text-[color:var(--sh-void)] ${look.typed}`}>{line}</p>
        <span className={`${horror.typeCover} ${horror.typeCoverPaper} ${horror.typeIn}`} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setRibbons((left) => Math.max(left - 1, 0))}
          disabled={ribbons === 0}
          title={words.saveHint}
          className={`${CARD_BUTTON} justify-center border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame)] enabled:hover:border-[color:var(--sh-flame)] disabled:opacity-60`}
        >
          {words.save}
        </button>
        <p className={`text-sm text-[color:var(--sh-cream)] ${look.typed}`}>{fillLabel(words.inkRibbons, { count: ribbons })}</p>
        <p className={`text-sm text-[color:var(--sh-fine)] ${look.typed}`} role="status">
          {saved ? words.saved : ''}
        </p>
        <p className="text-sm italic text-[color:var(--sh-fog)]">{words.saveHint}</p>
      </div>
    </div>
  )
}

const PROMPT = `${CARD_BUTTON} border-[color:var(--sh-flame)] bg-[color:var(--sh-void)] text-[color:var(--sh-ivory)] hover:border-[color:var(--sh-ivory)] ${horror.prompt}`

const HEADING = sectionHeadingId('Contact')

export function SafeRoom({ profession }: { profession: Profession }) {
  const { sections, horror: words, navigation } = useLabels()
  const preview = usePreview()
  const door = useDoor()
  const [phase, setPhase] = useState<Phase>('corridor')
  const prompt = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)

  useEffect(() => {
    if (preview || prefersReducedMotion()) setPhase('safe')
  }, [preview])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // A prompt that appears takes the focus, so the keyboard answers it the moment it is on screen.
  useEffect(() => {
    if (phase === 'threat' || phase === 'staggered') prompt.current?.focus()
  }, [phase])

  const after = (next: Phase, ms: number) => {
    timer.current = window.setTimeout(() => setPhase(next), ms)
  }

  const cross = () => {
    if (prefersReducedMotion()) {
      setPhase('safe')
      return
    }
    setPhase('burst')
    after('threat', BURST_MS)
  }

  const kick = () => {
    setPhase('kicked')
    after('staggered', KICK_MS)
  }

  const suplex = () => {
    setPhase('thrown')
    timer.current = window.setTimeout(() => door(() => setPhase('safe')), THROW_MS)
  }

  return (
    <section aria-labelledby={HEADING} className="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
      <div className={`p-4 sm:p-6 ${look.panel}`}>
        <h2 id={HEADING} className={PANEL_HEADING}>
          {sections.contact}
        </h2>
        <p className={`mb-3 text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`}>{phase === 'safe' ? words.safeRoom : words.corridorHint}</p>

        {phase === 'safe' ? <SafeRoomArt /> : <Corridor profession={profession} phase={phase} />}

        <div className="mt-4 flex min-h-[44px] flex-wrap items-center gap-3">
          {phase === 'corridor' && (
            <button type="button" onClick={cross} className={PROMPT}>
              {words.toSafeRoom}
            </button>
          )}
          {phase === 'threat' && (
            <button ref={prompt} type="button" onClick={kick} className={PROMPT}>
              {words.kick}
            </button>
          )}
          {phase === 'staggered' && (
            <button ref={prompt} type="button" onClick={suplex} className={PROMPT}>
              {words.suplex}
            </button>
          )}
        </div>

        <RecruiterHero
          render={({ line, actions }) => (
            <>
              {phase === 'safe' ? <SaveDesk line={line} /> : <p className="mt-4 text-base text-[color:var(--sh-cream)]">{line}</p>}
              <nav className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap" aria-label={navigation.contactAndCv}>
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </nav>
            </>
          )}
        />
      </div>
    </section>
  )
}
