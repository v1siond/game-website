import { HIM } from './palette'
import { r1 } from './draw'

// Him as the time courier, the one figure of every era: his own head (his skin, the spiky dark hair, the
// thick dark brows, the black oval eye and the short boxed black beard, from HERO_IDENTITY) on the
// courier's coat with the satchel strap, the long orange scarf and the boots. Seen from the side, facing
// right, feet at 0,0, about 200 high. Built from jointed groups (data-j) so each era poses him from the
// scroll: the hips, knees, shoulders and elbows turn on their pivots, the body leans, the head tilts and the
// scarf flies. The markup carries the pose it is built with, so the server drawn picture already shows him
// standing where his era puts him; setPose then rewrites only the transforms.

/** The angles are in degrees, positive swings a limb forward (+x); x, y and scale place him in the layer. */
export interface Pose {
  x: number
  y: number
  scale: number
  lean: number
  hipB: number
  hipF: number
  kneeB: number
  kneeF: number
  shB: number
  shF: number
  elB: number
  elF: number
  head: number
  scarf: number
  lift: number
}

export const STAND: Pose = { x: 0, y: 0, scale: 1, lean: 0, hipB: -4, hipF: 6, kneeB: -4, kneeF: -2, shB: -10, shF: 12, elB: 10, elF: 14, head: 0, scarf: 0, lift: 0 }

type Limb = 'hipB' | 'hipF' | 'kneeB' | 'kneeF' | 'shB' | 'shF' | 'elB' | 'elF'

// Each limb joint's pivot in figure space.
const PIVOTS: Record<Limb, readonly [number, number]> = {
  hipB: [-3, -90],
  hipF: [4, -90],
  kneeB: [0, 46],
  kneeF: [0, 46],
  shB: [-6, -138],
  shF: [6, -138],
  elB: [0, 30],
  elF: [0, 30],
}

const LIMBS = Object.keys(PIVOTS) as Limb[]

export type Joint = Limb | 'root' | 'shadow' | 'body' | 'head' | 'scarf'

/** The transform of every joint for a pose, the one place a pose becomes SVG. */
export function poseTransforms(partial: Partial<Pose>): Record<Joint, string> {
  const pose = { ...STAND, ...partial }
  const limbs = Object.fromEntries(
    LIMBS.map((key) => {
      const [px, py] = PIVOTS[key]
      return [key, `translate(${px} ${py}) rotate(${r1(-pose[key])})`]
    }),
  ) as Record<Limb, string>
  return {
    ...limbs,
    root: `translate(${r1(pose.x)} ${r1(pose.y - pose.lift)}) scale(${pose.scale})`,
    shadow: `translate(${r1(pose.x)} ${r1(pose.y)}) scale(${r1(pose.scale * (1 - Math.min(pose.lift, 120) / 200))} ${pose.scale})`,
    body: `rotate(${r1(pose.lean)} 0 -88)`,
    head: `rotate(${r1(pose.head)} 2 -150)`,
    scarf: `rotate(${r1(pose.scarf)} -6 -146)`,
  }
}

const limb = (width: number, length: number, fill: string): string =>
  `<rect x="${-width / 2}" y="0" width="${width}" height="${length + width / 2}" rx="${width / 2}" fill="${fill}" class="rim"/>`

const leg = (key: 'B' | 'F', fill: string, boot: string, at: Record<Joint, string>): string => `
  <g data-j="hip${key}" transform="${at[`hip${key}`]}"><g>${limb(19, 46, fill)}</g>
    <g data-j="knee${key}" transform="${at[`knee${key}`]}">${limb(16, 40, fill)}
      <path d="M-9,34 h14 q14,0 16,12 h-30 Z" fill="${boot}"/></g></g>`

const arm = (key: 'B' | 'F', fill: string, held: string, at: Record<Joint, string>): string => `
  <g data-j="sh${key}" transform="${at[`sh${key}`]}">${limb(14, 30, fill)}
    <g data-j="el${key}" transform="${at[`el${key}`]}">${limb(12, 28, fill)}<circle cx="0" cy="31" r="8.5" fill="${HIM.skin}"/>${held}</g></g>`

// His head in profile, facing right: the ear, the face, the short boxed beard along the jaw with the
// moustache over the lip, the spiky hair, the thick brow and the black oval eye under it.
const HEAD = `
  <rect x="-6" y="-158" width="12" height="14" fill="${HIM.skinShade}"/>
  <path d="M-15,-176 Q-16,-196 2,-197 Q20,-196 21,-178 L22,-170 Q25,-166 21,-163 L20,-150 Q8,-146 -6,-151 Q-16,-158 -15,-176 Z" fill="${HIM.skin}" class="rim"/>
  <ellipse cx="-6" cy="-170" rx="4.5" ry="6.5" fill="${HIM.skinShade}"/>
  <path d="M-6,-172 L-3,-157 Q4,-149 13,-149 L20,-151 Q22,-156 21,-161 L14,-161 Q9,-159 5,-162 L1,-172 Z" fill="${HIM.beard}"/>
  <path d="M12,-164 Q17,-166 21,-164 L21,-162 Q17,-163 12,-162 Z" fill="${HIM.beard}"/>
  <path d="M13,-159 Q16,-158 19,-159" stroke="${HIM.lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M-17,-176 L-20,-188 L-12,-186 L-11,-199 L-3,-192 L1,-205 L7,-194 L14,-203 L16,-191 L24,-195 L21,-182 Q10,-188 -2,-186 Q-10,-184 -14,-174 Z" fill="${HIM.hair}"/>
  <path d="M8,-180 L21,-182" stroke="${HIM.hair}" stroke-width="4.5" stroke-linecap="round"/>
  <ellipse cx="15" cy="-174" rx="2.3" ry="3.4" fill="${HIM.eyes}"/>`

/** His markup in a pose. `held` is drawn in the front hand (a torch, a drumstick), `heldBack` in the back one. */
export function courier(pose: Partial<Pose> = {}, { held = '', heldBack = '' } = {}): string {
  const at = poseTransforms(pose)
  return `
<g data-fig="">
  <ellipse cx="4" cy="2" rx="46" ry="8" fill="${HIM.shadow}" opacity="0.35" data-j="shadow" transform="${at.shadow}"/>
  <g data-j="root" transform="${at.root}"><g data-j="body" transform="${at.body}">
    ${arm('B', HIM.coatBack, heldBack, at)}
    ${leg('B', HIM.legBack, HIM.bootBack, at)}
    <g data-j="scarf" transform="${at.scarf}"><path d="M-6,-146 C-40,-150 -60,-136 -92,-142 C-80,-128 -58,-128 -40,-124 C-58,-118 -78,-112 -96,-116 C-70,-102 -30,-120 -4,-132 Z" fill="${HIM.scarf}"/>
      <path d="M-6,-146 C-40,-150 -60,-136 -92,-142" stroke="${HIM.scarfEdge}" stroke-width="2" fill="none" opacity="0.8"/></g>
    <path d="M-17,-90 L-19,-142 Q0,-152 19,-143 L17,-90 Q0,-84 -17,-90 Z" fill="${HIM.coat}" class="rim"/>
    <path d="M-6,-140 L14,-96" stroke="${HIM.strap}" stroke-width="5"/>
    <path d="M-17,-98 Q0,-92 17,-98" stroke="${HIM.belt}" stroke-width="6" fill="none"/>
    <rect x="-24" y="-112" width="16" height="20" rx="4" fill="${HIM.pouch}" class="rim"/>
    <rect x="8" y="-134" width="7" height="7" rx="1.5" fill="${HIM.badge}"/>
    ${leg('F', HIM.legFront, HIM.bootFront, at)}
    <g data-j="head" transform="${at.head}">${HEAD}</g>
    ${arm('F', HIM.coatFront, held, at)}
  </g></g>
</g>`
}

export type Joints = Record<Joint, Element>

/** His joint nodes inside a stage, cached once. */
export const joints = (root: ParentNode): Joints =>
  Object.fromEntries(Array.from(root.querySelectorAll<SVGElement>('[data-fig] [data-j]'), (node) => [node.dataset.j, node])) as Joints

/** Writes a pose onto cached joints: transforms only. */
export function setPose(j: Joints, pose: Partial<Pose>): void {
  const at = poseTransforms(pose)
  for (const key of Object.keys(at) as Joint[]) j[key].setAttribute('transform', at[key])
}

/** A walk or run cycle at a phase in turns (1 is one full stride). */
export function stride(phase: number, size = 1): Partial<Pose> {
  const a = Math.sin(phase * Math.PI * 2)
  const b = Math.cos(phase * Math.PI * 2)
  return {
    hipF: 28 * a * size,
    hipB: -28 * a * size,
    kneeF: -Math.max(0, -b) * 50 * size - 6,
    kneeB: -Math.max(0, b) * 50 * size - 6,
    shF: -30 * a * size,
    shB: 30 * a * size,
    elF: 30,
    elB: 30,
    lift: Math.abs(b) * 5 * size,
    scarf: Math.sin(phase * Math.PI * 4) * 6,
  }
}
