import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { REALM } from './palette'

// Him as the warden, the hero unit of every scene: a grey hooded cloak over mail, the hood down so his face
// shows, and a long staff. His skin, hair, beard and eyes come from HERO_IDENTITY. The Musician wears the same
// cloak and mail with a drumstick in each hand in place of the staff; the Martial Artist fights in his gold
// shorts with the maroon band, the red prajioud on his arms, wrapped hands and his own mongkhon. Drawn in a
// 200 by 320 box facing right, his feet at WARDEN_FEET.
//
// The scenes move his parts by data-fx name, each turning about its own joint: his staff arm ("warden-staff",
// about STAFF_AT), his free arm ("warden-hand", about HAND_AT), and each leg ("warden-leg-front",
// "warden-leg-back", about HIP_AT); and show what his free hand holds, each at rest hidden: a torch
// ("warden-torch") and a horn ("warden-horn"). `figure` marks him as the world's figure, on the hero's stage
// only, the one the preview capture reads.

export const WARDEN_FEET = { x: 100, y: 312 }
export const STAFF_AT = { x: 124, y: 112 }
export const HAND_AT = { x: 80, y: 112 }
export const HIP_AT = { x: 100, y: 205 }

const LINE = REALM.stone8

function Head({ profession }: { profession: Profession }) {
  return (
    <g>
      <rect x={94} y={84} width={16} height={18} fill={HERO_IDENTITY.skinShade} />
      <path d="M80 62 Q80 38 102 38 Q124 38 124 62 L124 72 Q120 88 104 92 L96 92 Q82 86 80 72 Z" fill={HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
      <path d="M78 64 Q74 32 102 33 Q128 33 127 58 Q118 46 104 46 Q90 46 84 66 Z" fill={HERO_IDENTITY.hair} />
      <path d="M81 68 Q83 94 98 102 Q112 106 122 96 Q128 86 126 70 Q120 80 110 80 Q100 82 90 76 Q85 73 81 68 Z" fill={HERO_IDENTITY.beard} />
      <path d="M104 86 Q112 88 118 85" stroke={LINE} strokeWidth="2" fill="none" />
      <path d="M104 56 L116 54 M119 55 L124 56" stroke={HERO_IDENTITY.hair} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx={111} cy={63} rx={3} ry={4} fill={HERO_IDENTITY.eyes} />
      <ellipse cx={122} cy={63.5} rx={2} ry={3.6} fill={HERO_IDENTITY.eyes} />
      {profession === 'fighter' && (
        <>
          <path d="M78 50 Q102 40 127 48" fill="none" stroke={REALM.blood33} strokeWidth="7" strokeLinecap="round" />
          <path d="M80 50 Q66 36 70 18 Q74 34 86 46" fill={REALM.blood33} />
        </>
      )}
    </g>
  )
}

/** The cloak behind him, the hood thrown back over his shoulders. */
function Cloak() {
  return (
    <g>
      <path d="M72 104 Q44 170 40 300 L160 300 Q156 170 128 104 Z" fill={REALM.cloakShade} />
      <path d="M70 100 Q100 116 130 100 Q138 84 124 80 Q100 92 76 80 Q62 84 70 100 Z" fill={REALM.cloak} stroke={LINE} strokeWidth="2" />
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <path d="M76 104 Q100 96 124 104 L122 196 Q100 202 78 196 Z" fill={HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
        <path d="M86 130 Q94 136 100 130 Q106 136 114 130 M100 140 V186" stroke={HERO_IDENTITY.skinShade} strokeWidth="2" fill="none" />
        <path d="M76 190 L124 190 L128 228 L102 228 L100 214 L98 228 L72 228 Z" fill={REALM.princeGold} stroke={LINE} strokeWidth="2" />
        <rect x={76} y={188} width={48} height={9} fill={REALM.blood33} />
      </g>
    )
  }
  return (
    <g>
      <path d="M76 104 Q100 96 124 104 L128 214 Q100 222 72 214 Z" fill={REALM.mail} stroke={LINE} strokeWidth="2" />
      {Array.from({ length: 6 }, (_, row) => (
        <path key={row} d={`M78 ${118 + row * 16} Q100 ${124 + row * 16} 124 ${118 + row * 16}`} fill="none" stroke={REALM.mailShade} strokeWidth="2" strokeDasharray="3 3" />
      ))}
      <rect x={74} y={176} width={52} height={10} fill={REALM.staff} />
      <rect x={96} y={175} width={10} height={12} fill={REALM.goldMid} />
      <path d="M76 104 L68 150 L80 150 Z M124 104 L132 150 L120 150 Z" fill={REALM.cloak} />
    </g>
  )
}

function Leg({ side, profession }: { side: 'front' | 'back'; profession: Profession }) {
  const x = side === 'front' ? 104 : 84
  const bare = profession === 'fighter'
  return (
    <g data-fx={`warden-leg-${side}`}>
      <rect x={x} y={200} width={16} height={60} rx={5} fill={bare ? HERO_IDENTITY.skin : REALM.stone22} stroke={LINE} strokeWidth="2" />
      <rect x={x} y={256} width={16} height={52} rx={5} fill={bare ? HERO_IDENTITY.skin : REALM.stone22} stroke={LINE} strokeWidth="2" />
      <path d={`M${x - 2} 290 H${x + 18} Q${x + 30} 296 ${x + 30} 310 H${x - 2} Z`} fill={bare ? HERO_IDENTITY.skinShade : REALM.ember23} stroke={LINE} strokeWidth="2" />
    </g>
  )
}

function Fist({ x, y, profession }: { x: number; y: number; profession: Profession }) {
  return <circle cx={x} cy={y} r={profession === 'fighter' ? 10 : 8} fill={profession === 'fighter' ? REALM.riverCream : HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
}

function Sleeve({ x, profession }: { x: number; profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <>
        <rect x={x} y={104} width={16} height={84} rx={7} fill={HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
        <rect x={x} y={124} width={16} height={6} fill={REALM.blood33} />
      </>
    )
  }
  return <rect x={x} y={104} width={16} height={84} rx={7} fill={REALM.cloak} stroke={LINE} strokeWidth="2" />
}

/** His free arm (the back one), with the torch and the horn its hand can show. */
function FreeArm({ profession }: { profession: Profession }) {
  return (
    <g data-fx="warden-hand">
      <Sleeve x={72} profession={profession} />
      {profession === 'drummer' && <path d="M80 192 L68 236" stroke={REALM.goldBright} strokeWidth="5" strokeLinecap="round" />}
      <Fist x={80} y={192} profession={profession} />
      <g data-fx="warden-torch" opacity="0">
        <rect x={76} y={150} width={8} height={56} fill={REALM.staff} />
        <path d="M70 152 Q80 112 90 152 Z" fill={REALM.chaosFireMid} />
        <path d="M75 150 Q80 128 85 150 Z" fill={REALM.chaosFireCore} />
        <circle cx={80} cy={140} r={30} fill={REALM.chaosFireBright} opacity="0.25" />
      </g>
      <g data-fx="warden-horn" opacity="0">
        <path d="M80 194 Q70 164 90 150 L98 156 Q84 170 90 196 Z" fill={REALM.horn} stroke={LINE} strokeWidth="2" />
        <path d="M86 150 L100 144 L102 160 Z" fill={REALM.goldMid} />
      </g>
    </g>
  )
}

/** His staff arm (the front one): the long staff, or a drumstick for the Musician, or the bare wrapped fist. */
function StaffArm({ profession }: { profession: Profession }) {
  return (
    <g data-fx="warden-staff">
      {profession === 'engineer' && (
        <g>
          <rect x={128} y={0} width={9} height={300} rx={4} fill={REALM.staff} stroke={LINE} strokeWidth="2" />
          <path d="M126 4 Q132 -14 140 4 Q146 16 132 24 Q120 16 126 4 Z" fill={REALM.staff} stroke={LINE} strokeWidth="2" />
          <circle cx={133} cy={10} r={5} fill={REALM.gateLight} />
        </g>
      )}
      <Sleeve x={116} profession={profession} />
      {profession === 'drummer' && <path d="M124 192 L150 150" stroke={REALM.goldBright} strokeWidth="5" strokeLinecap="round" />}
      <Fist x={124} y={192} profession={profession} />
    </g>
  )
}

/** Him as the warden in a profession's kit. */
export function Warden({ profession, figure = false }: { profession: Profession; figure?: boolean }) {
  const cloaked = profession !== 'fighter'
  return (
    <g data-worlds-figure={figure ? '' : undefined}>
      {cloaked && <Cloak />}
      <Leg side="back" profession={profession} />
      <FreeArm profession={profession} />
      <Leg side="front" profession={profession} />
      <Torso profession={profession} />
      <Head profession={profession} />
      <StaffArm profession={profession} />
    </g>
  )
}
