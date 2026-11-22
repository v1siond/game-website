import type { ReactNode } from 'react'
import { Neon, type PlaneArt } from './eras'
import type { DoorState, PropState } from './motion'
import { ERAS, PORTAL, type Era, type EraLook } from './palette'
import type { PropKind } from './plan'
import type { PropMeta, Relic } from './world'

// The props that stand in the tunnel, one per CV item: a shard per highlight, a checkpoint per job, an iron
// crate per tech category, a pylon per service, a crate per project, a socket per venture, a speaker per
// band, a heavy bag per Muay Thai fact, the beacon for contact. Each is SVG in world units standing on the
// floor (its origin its bottom centre) and moves only its own parts (data-part), by transform and opacity,
// from the state the scroll gives (motion.ts PropState).

const r1 = (n: number): number => Math.round(n * 10) / 10

export const RELIC_COLOURS: Record<Relic, string> = { platinum: PORTAL.PLATINUM, gold: PORTAL.GOLD, sapphire: PORTAL.SAPPHIRE }

/** A prop's moving parts, by their data-part names. */
export type Parts = Record<string, SVGElement>

export const partsOf = (root: Element): Parts =>
  Object.fromEntries([...root.querySelectorAll<SVGElement>('[data-part]')].map((part) => [part.dataset.part, part]))

function CrateBody({ w, h, wood, edge, band }: { w: number; h: number; wood: string; edge: string; band: (flip: 1 | -1) => ReactNode }) {
  return (
    <>
      <g data-part="left" className="o-bottom">
        <rect x={r1(-w / 2)} y={r1(-h)} width={r1(w / 2)} height={r1(h)} fill={wood} />
        {band(1)}
        <Neon d={`M ${r1(-w / 2)} 0 V ${r1(-h)} H 0 V 0 Z`} color={edge} width={5} />
      </g>
      <g data-part="right" className="o-bottom">
        <rect x={0} y={r1(-h)} width={r1(w / 2)} height={r1(h)} fill={wood} />
        {band(-1)}
        <Neon d={`M 0 0 V ${r1(-h)} H ${r1(w / 2)} V 0 Z`} color={edge} width={5} />
      </g>
      <g data-part="lid" className="o-bottom">
        <rect x={r1(-w / 2 - 10)} y={r1(-h - 34)} width={r1(w + 20)} height={34} fill={wood} />
        <Neon d={`M ${r1(-w / 2 - 10)} ${r1(-h)} V ${r1(-h - 34)} H ${r1(w / 2 + 10)} V ${r1(-h)} Z`} color={edge} width={5} />
      </g>
    </>
  )
}

const RelicGem = ({ color }: { color: string }) => (
  <g data-part="gem" className="o-bottom">
    <circle cx={0} cy={-150} r={70} fill={color} opacity={0.22} />
    <polygon points="0,-215 46,-160 0,-95 -46,-160" fill={color} />
    <polygon points="0,-215 46,-160 0,-160" fill="#fff" opacity={0.55} />
  </g>
)

const setTransform = (part: SVGElement, value: string) => {
  part.style.transform = value
}

const setOpacity = (part: SVGElement, value: number) => {
  part.style.opacity = String(Math.round(value * 100) / 100)
}

// Breaking a crate: the halves fall apart, the lid flies, the relic rises. `lean` tilts the lid either way.
function crateOpen(p: Parts, s: PropState, lean: 1 | -1) {
  const o = s.open
  setTransform(p.left, `translateX(${r1(-70 * o)}px) rotate(${r1(-18 * o)}deg)`)
  setTransform(p.right, `translateX(${r1(70 * o)}px) rotate(${r1(18 * o)}deg)`)
  setTransform(p.lid, `translate(${r1(lean * 60 * o)}px, ${r1(-170 * o)}px) rotate(${r1(lean * 40 * o)}deg)`)
  setOpacity(p.lid, 1 - 0.7 * o)
  setTransform(p.gem, `translateY(${r1(-120 * o)}px) scale(${r1((0.4 + 0.6 * o) * 10) / 10})`)
  setOpacity(p.gem, o)
}

interface Kind {
  w: number
  h: number
  art: (e: EraLook, meta: PropMeta) => ReactNode
  update: (parts: Parts, state: PropState) => void
}

const KINDS: Record<PropKind, Kind> = {
  shard: {
    w: 220,
    h: 420,
    art: (e) => (
      <>
        <polygon points="-90,0 90,0 60,-110 -60,-110" fill="#24170a" />
        <Neon d="M -90 0 L -60 -110 H 60 L 90 0" color={e.a2} width={5} />
        <g data-part="crystal" className="o-bottom">
          <polygon points="0,-400 50,-280 0,-150 -50,-280" fill="#3a2a12" />
          <Neon d="M 0 -400 L 50 -280 L 0 -150 L -50 -280 Z M -50 -280 H 50" color={e.a1} width={4} />
          <g data-part="lit">
            <circle cx={0} cy={-275} r={110} fill={e.a1} opacity={0.25} />
            <polygon points="0,-400 50,-280 0,-150 -50,-280" fill={e.a1} />
            <polygon points="0,-400 50,-280 0,-280" fill="#fff" opacity={0.6} />
          </g>
        </g>
      </>
    ),
    update: (p, s) => {
      setTransform(p.crystal, `translateY(${r1(-30 * s.open - 12 * s.amount)}px)`)
      setOpacity(p.lit, s.open)
    },
  },
  checkpoint: {
    w: 620,
    h: 560,
    art: (e, meta) => (
      <>
        <Neon d="M -260 0 V -540 M 260 0 V -540" color={e.a2} width={9} />
        <g data-part="banner" className="o-top">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={-240 + i * 40} y={i % 2 ? -540 : -500} width={40} height={40} fill={i % 2 ? '#fff' : '#1e0716'} />
          ))}
          <Neon d="M -240 -540 H 240 V -460 H -240 Z" color={e.a1} width={5} />
        </g>
        <g data-part="medal" className="o-center">
          <circle cx={0} cy={-380} r={52} fill={RELIC_COLOURS[meta.relic ?? 'gold']} />
          <circle cx={0} cy={-380} r={34} fill="none" stroke="#1e0716" strokeWidth={8} />
          <path d="M -30 -440 L 0 -420 L 30 -440" stroke={e.a1} strokeWidth={10} fill="none" />
        </g>
      </>
    ),
    update: (p, s) => {
      setTransform(p.banner, `scaleY(${r1(1 - 2 * s.open)})`)
      setTransform(p.medal, `translateY(${r1(80 * (1 - s.open))}px) scale(${r1((0.3 + 0.7 * s.open) * 10) / 10}) rotate(${r1(360 * s.open)}deg)`)
      setOpacity(p.medal, s.open)
    },
  },
  ironCrate: {
    w: 260,
    h: 520,
    art: (e) => (
      <>
        <RelicGem color={e.a1} />
        <CrateBody w={240} h={240} wood="#2b1208" edge={e.a1} band={(flip) => <path d="M -120 -240 L 0 0 M -120 0 L 0 -240" stroke={e.a2} strokeWidth={10} transform={`scale(${flip} 1)`} />} />
      </>
    ),
    update: (p, s) => crateOpen(p, s, 1),
  },
  crate: {
    w: 260,
    h: 520,
    art: (e) => (
      <>
        <RelicGem color={e.a2} />
        <CrateBody
          w={230}
          h={230}
          wood="#10302f"
          edge={e.a1}
          band={(flip) => (
            <g transform={`scale(${flip} 1)`}>
              <rect x={-115} y={-160} width={115} height={16} fill={e.a2} opacity={0.8} />
              <rect x={-115} y={-86} width={115} height={16} fill={e.a2} opacity={0.8} />
            </g>
          )}
        />
      </>
    ),
    update: (p, s) => crateOpen(p, s, -1),
  },
  pylon: {
    w: 220,
    h: 900,
    art: (e) => (
      <>
        <polygon points="-40,0 40,0 18,-620 -18,-620" fill="#0b2014" />
        <Neon d="M -40 0 L -18 -620 M 40 0 L 18 -620" color={e.a2} width={5} />
        <g data-part="ring" className="o-center">
          <Neon d="M -90 -700 A 90 36 0 1 1 90 -700 A 90 36 0 1 1 -90 -700" color={e.a2} width={5} />
        </g>
        <circle cx={0} cy={-700} r={40} fill="#0b2014" stroke={e.a1} strokeWidth={6} />
        <g data-part="lit">
          <rect x={-10} y={-900} width={20} height={200} fill={e.a1} opacity={0.5} />
          <circle cx={0} cy={-700} r={100} fill={e.a1} opacity={0.2} />
          <circle cx={0} cy={-700} r={40} fill={e.a1} />
          <circle cx={-12} cy={-712} r={12} fill="#fff" />
        </g>
      </>
    ),
    update: (p, s) => {
      setOpacity(p.lit, s.open)
      setTransform(p.ring, `scale(${r1((1 + 0.5 * s.open + 0.2 * s.amount) * 10) / 10})`)
    },
  },
  socket: {
    w: 300,
    h: 640,
    art: (e, meta) => {
      const color = meta.featured ? PORTAL.GOLD : e.a2
      return (
        <>
          <polygon points="-130,0 130,0 100,-200 -100,-200" fill="#20060f" />
          <Neon d="M -130 0 L -100 -200 H 100 L 130 0" color={e.a1} width={6} />
          <Neon d="M -70 -200 A 70 30 0 1 1 70 -200 A 70 30 0 1 1 -70 -200" color={e.a1} width={5} />
          <g data-part="gem" className="o-bottom">
            <circle cx={0} cy={-330} r={110} fill={color} opacity={0.2} />
            <polygon points="0,-470 70,-330 0,-215 -70,-330" fill={color} />
            <polygon points="0,-470 70,-330 0,-330" fill="#fff" opacity={0.55} />
          </g>
        </>
      )
    },
    update: (p, s) => {
      setTransform(p.gem, `translateY(${r1(-260 * (1 - s.open))}px) rotate(${r1(180 * (1 - s.open))}deg)`)
      setOpacity(p.gem, s.open)
    },
  },
  speaker: {
    w: 360,
    h: 760,
    art: (e) => (
      <>
        <rect x={-170} y={-600} width={340} height={600} rx={18} fill="#1d0833" />
        <Neon d="M -170 0 V -600 H 170 V 0" color={e.a2} width={5} />
        <g data-part="coneTop" className="o-center">
          <circle cx={0} cy={-440} r={110} fill="#0b0216" stroke={e.a1} strokeWidth={12} />
          <circle cx={0} cy={-440} r={40} fill={e.a1} />
        </g>
        <g data-part="coneLow" className="o-center">
          <circle cx={0} cy={-170} r={110} fill="#0b0216" stroke={e.a1} strokeWidth={12} />
          <circle cx={0} cy={-170} r={40} fill={e.a2} />
        </g>
        <g data-part="lit">
          <rect x={-150} y={-750} width={300} height={110} rx={16} fill="#2b0a4a" />
          <Neon d="M -150 -750 h 300 v 110 h -300 Z" color={e.a1} width={6} />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx={-120 + i * 40} cy={-695} r={12} fill={i % 2 ? e.a2 : '#fff'} />
          ))}
        </g>
      </>
    ),
    update: (p, s) => {
      const pump = 1 + 0.14 * s.beat * Math.max(s.open, s.amount)
      setTransform(p.coneTop, `scale(${Math.round(pump * 100) / 100})`)
      setTransform(p.coneLow, `scale(${Math.round((2 - pump + 0.14 * s.open) * 100) / 100})`)
      setOpacity(p.lit, 0.25 + 0.75 * s.open)
    },
  },
  bag: {
    w: 240,
    h: 1500,
    art: (e) => (
      <g data-part="bag" className="o-top">
        <path d="M 0 -1500 V -620" stroke="#c9b48a" strokeWidth={8} />
        <rect x={-80} y={-620} width={160} height={420} rx={70} fill="#3b0d08" />
        <Neon d="M -80 -550 Q -80 -620 0 -620 Q 80 -620 80 -550 V -270 Q 80 -200 0 -200 Q -80 -200 -80 -270 Z" color={e.a1} width={5} />
        <rect x={-80} y={-470} width={160} height={22} fill={e.a2} />
        <g data-part="lit">
          <circle cx={0} cy={-410} r={120} fill="#fff" opacity={0.35} />
        </g>
      </g>
    ),
    update: (p, s) => {
      setTransform(p.bag, `rotate(${r1(-26 * s.swing)}deg)`)
      setOpacity(p.lit, s.amount > 0.85 ? (s.amount - 0.85) / 0.15 : 0)
    },
  },
  beacon: {
    w: 420,
    h: 1300,
    art: (e) => (
      <>
        <polygon points="-120,0 120,0 40,-900 -40,-900" fill="#0a2230" />
        <Neon d="M -120 0 L -40 -900 H 40 L 120 0" color={e.a2} width={6} />
        <Neon d="M -100 -300 H 100 M -80 -560 H 80" color={e.a2} width={4} />
        <g data-part="lit">
          <polygon points="-40,-960 40,-960 200,-1300 -200,-1300" fill={e.a1} opacity={0.35} />
          <circle cx={0} cy={-950} r={150} fill={e.a1} opacity={0.3} />
          <circle cx={0} cy={-950} r={60} fill="#fff" />
        </g>
      </>
    ),
    update: (p, s) => setOpacity(p.lit, 0.2 + 0.8 * s.open),
  },
}

/** A prop's art standing on the floor: its origin is its bottom centre. */
export function propArt(kind: PropKind, era: Era, meta: PropMeta): PlaneArt {
  const { w, h, art } = KINDS[kind]
  return { w, h, viewBox: `${r1(-w / 2)} ${-h} ${w} ${h}`, art: art(ERAS[era], meta) }
}

export const updateProp = (kind: PropKind, parts: Parts, state: PropState): void => KINDS[kind].update(parts, state)

/** The keystone door: the halves slide apart, a lamp lights per venture found. */
export function updateDoor(parts: Parts, { slide, lamps }: DoorState): void {
  parts.doorL.setAttribute('transform', `translate(${r1(-slide * 900)} 0)`)
  parts.doorR.setAttribute('transform', `translate(${r1(slide * 900)} 0)`)
  for (let i = 0; i < 5; i += 1) parts[`lamp${i}`].setAttribute('opacity', i < lamps ? '1' : '0.15')
}
