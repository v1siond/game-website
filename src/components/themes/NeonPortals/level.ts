import { BoxGeometry, DirectionalLight, Fog, Group, HemisphereLight, IcosahedronGeometry, Mesh, PerspectiveCamera, Scene, TorusGeometry } from 'three'
import type { Profession } from '@/lib/cv/professions'
import { Batch, aim, countTriangles, part, release, skyTexture } from './batch'
import type { Moment, Scene3D } from './engine'
import { ERAS, kelp, type Era } from './eras'
import { applyPose, buildHero } from './model'
import { ERA_COLOURS, PORTAL } from './palette'
import { CLIPS, poseAt, type ClipName } from './pose'
import { END_PIECE_Z, RUN_END_Z, levelLens, runAt } from './run'

// A level: the era's path running into the screen, its props down both sides, its key piece at the end, and
// him. The window's scroll progress moves him down the path with the camera trailing (run.ts); each frame
// he takes the run stride for the distance covered, or stands breathing once the scroll stops. At the end he
// plays the level's moment once: the tornado spin into the crate, two beats on the drum crates, the kick on
// the gong. On the projects level a crate waits on the path for each project and breaks as he passes it.
//
// A crate break, the drum, the kick and the gong's ring are one shot moments under 1 s (pose.ts); the kelp
// sway and his breathing are the ambient loops, and the engine only calls frame while the window is on
// screen. The still (reduced motion, World Select preview) is the level at mid run with him standing and
// every crate whole.

export type Ending = 'crate' | 'crates' | 'drum' | 'gong'

interface LevelPlan {
  era: Era
  ending: Ending
  profession: Profession
  /** The crates on the path, for the crates ending (one per project). */
  crates?: number
}

const STILL_PROGRESS = 0.5
const BREAK_SECONDS = 0.8
const RING_SECONDS = 0.9
/** How long after the scroll stops he keeps the run stride before he stands. */
const RUN_HOLD_SECONDS = 0.15
const MOVED = 0.0004
const WOOD = ERA_COLOURS.crate

interface Crate {
  group: Group
  box: Mesh
  fruit: Mesh[]
  z: number
  brokeAt: number | null
}

function buildCrate(x: number, z: number): Crate {
  const group = new Group()
  const box = part(new BoxGeometry(0.7, 0.7, 0.7), WOOD.wood)
  box.add(part(new BoxGeometry(0.74, 0.12, 0.74), WOOD.woodDark, { at: [0, 0.26, 0] }))
  box.add(part(new BoxGeometry(0.74, 0.12, 0.74), WOOD.woodDark, { at: [0, -0.26, 0] }))
  box.add(part(new BoxGeometry(0.06, 0.86, 0.74), WOOD.woodDark, { turn: [0, 0, 0.8] }))
  box.add(part(new BoxGeometry(0.06, 0.86, 0.74), WOOD.woodDark, { turn: [0, 0, -0.8] }))
  box.position.y = 0.35
  const fruit = [-0.25, 0, 0.25].map((dx) => {
    const piece = part(new IcosahedronGeometry(0.13, 0), WOOD.fruit, { at: [dx, 0.35, 0] })
    piece.visible = false
    return piece
  })
  group.add(box, ...fruit)
  group.position.set(x, 0, z)
  return { group, box, fruit, z, brokeAt: null }
}

/** The crate's break at a time since it broke: the crate shrinks away, the fruit rises and fades out. */
function showBreak(crate: Crate, since: number): void {
  const t = Math.min(1, since / BREAK_SECONDS)
  crate.box.scale.setScalar(Math.max(0, 1 - t * 4))
  crate.box.visible = t < 0.25
  crate.fruit.forEach((piece, index) => {
    piece.visible = t < 1
    piece.position.y = 0.35 + t * (1.1 + index * 0.2)
    piece.scale.setScalar(1 - t * 0.8)
  })
}

const cratePlaces = (plan: LevelPlan): ReadonlyArray<readonly [number, number]> => {
  const { ending, crates = 0 } = plan
  if (ending === 'crate') return [[0, RUN_END_Z - 1.1]]
  if (ending === 'drum') return [[-0.55, RUN_END_Z - 0.9], [0.55, RUN_END_Z - 0.9]]
  if (ending !== 'crates' || crates === 0) return []
  const gap = (-RUN_END_Z - 4) / crates
  return Array.from({ length: crates }, (_, index) => [index % 2 === 0 ? 0.9 : -0.9, -3 - index * gap] as const)
}

const ENDING_CLIP: Record<Ending, ClipName> = { crate: 'spin', crates: 'spin', drum: 'drum', gong: 'kick' }

function buildGong(): { group: Group; ring: Mesh } {
  const colours = ERA_COLOURS.courtyard
  const group = new Batch()
    .add(new BoxGeometry(0.16, 2.6, 0.16), colours.pillar, { at: [-1.1, 1.3, 0] })
    .add(new BoxGeometry(0.16, 2.6, 0.16), colours.pillar, { at: [1.1, 1.3, 0] })
    .add(new BoxGeometry(2.5, 0.16, 0.16), colours.pillar, { at: [0, 2.55, 0] })
    .add(new TorusGeometry(0.8, 0.12, 5, 14), colours.gongDark, { at: [0, 1.5, 0] })
    .build()
  group.add(part(new IcosahedronGeometry(0.78, 1), colours.gong, { at: [0, 1.5, 0], size: [1, 1, 0.15] }))
  const ring = part(new TorusGeometry(0.85, 0.05, 4, 20), PORTAL.GOLD, { at: [0, 1.5, 0.12] }, 'glow')
  ring.visible = false
  group.add(ring)
  group.position.set(0, 0, RUN_END_Z - 1.4)
  return { group, ring }
}

export function buildLevel(plan: LevelPlan): Scene3D {
  const kit = ERAS[plan.era]
  const scene = new Scene()
  const sky = skyTexture(ERA_COLOURS[plan.era].skyTop, ERA_COLOURS[plan.era].skyLow)
  scene.background = sky
  scene.fog = new Fog(kit.fog, 14, 52)
  scene.add(new HemisphereLight(PORTAL.WHITE, kit.ground, 2.2))
  const sun = new DirectionalLight(PORTAL.WHITE, 2)
  sun.position.set(-4, 8, 6)
  scene.add(sun)

  const world = new Batch()
  // the ground and the path in segments, so the fog and the light shade them along their length
  world.add(new BoxGeometry(70, 0.4, 80, 14, 1, 20), kit.ground, { at: [0, -0.2, -22] })
  world.add(new BoxGeometry(3.2, 0.06, 40, 1, 1, 20), kit.path, { at: [0, 0.03, -14] })
  for (let index = 0, z = 5; z > END_PIECE_Z - 6; index += 1, z -= kit.spacing) {
    kit.side(world, z, 1, index)
    kit.side(world, z - kit.spacing / 2, -1, index + 1)
  }
  scene.add(world.build())

  const piece = new Batch()
  kit.piece(piece)
  const pieceGroup = piece.build()
  pieceGroup.position.z = END_PIECE_Z
  scene.add(pieceGroup)

  const swaying = plan.era === 'underwater' ? kelp(-END_PIECE_Z + 6) : null
  if (swaying) scene.add(swaying)

  const crates = cratePlaces(plan).map(([x, z]) => buildCrate(x, z))
  crates.forEach((crate) => scene.add(crate.group))
  const gong = plan.ending === 'gong' ? buildGong() : null
  if (gong) scene.add(gong.group)

  const rig = buildHero(plan.profession)
  rig.root.rotation.y = Math.PI
  scene.add(rig.root)
  const floatY = kit.gait === 'swim' ? 0.9 : 0

  const camera = new PerspectiveCamera(40, 2, 0.1, 80)
  const triangles = countTriangles(scene)
  let lastProgress = -1
  let runningUntil = -1
  let endedAt: number | null = null
  let spinAt: number | null = null

  const still = (aspect: number) => {
    const { heroZ } = runAt(STILL_PROGRESS)
    rig.root.position.set(0, floatY, heroZ)
    applyPose(rig, poseAt(CLIPS[kit.gait === 'swim' ? 'swim' : 'stand'], 0))
    aim(camera, levelLens(STILL_PROGRESS, aspect))
  }

  const play = ({ seconds, progress, aspect }: Moment) => {
    const run = runAt(progress)
    const moved = lastProgress >= 0 && Math.abs(progress - lastProgress) > MOVED
    lastProgress = progress
    if (moved) runningUntil = seconds + RUN_HOLD_SECONDS
    rig.root.position.set(0, floatY, run.heroZ)

    crates.forEach((crate) => {
      if (crate.brokeAt === null && plan.ending === 'crates' && run.heroZ <= crate.z + 0.6) {
        crate.brokeAt = seconds
        spinAt = seconds
      }
    })
    if (run.arrived && endedAt === null && plan.ending !== 'crates') {
      endedAt = seconds
      if (plan.ending === 'crate') crates.forEach((crate) => (crate.brokeAt = seconds + 0.3))
    }
    crates.forEach((crate) => {
      if (crate.brokeAt !== null && seconds >= crate.brokeAt) showBreak(crate, seconds - crate.brokeAt)
    })

    if (gong && endedAt !== null) {
      const since = seconds - endedAt - CLIPS.kick.seconds * 0.5
      gong.ring.visible = since >= 0 && since < RING_SECONDS
      gong.ring.scale.setScalar(1 + Math.max(0, since) * 2.4)
    }
    swaying?.children.forEach((stalk, index) => {
      stalk.rotation.z = Math.sin(seconds * 1.4 + index) * 0.12
    })

    applyPose(rig, poseFor(seconds, run.stride))
    aim(camera, levelLens(progress, aspect))
  }

  const poseFor = (seconds: number, stride: number) => {
    const gait = CLIPS[kit.gait]
    if (spinAt !== null && seconds - spinAt < CLIPS.spin.seconds) return poseAt(CLIPS.spin, seconds - spinAt)
    if (endedAt !== null && seconds - endedAt < CLIPS[ENDING_CLIP[plan.ending]].seconds) return poseAt(CLIPS[ENDING_CLIP[plan.ending]], seconds - endedAt)
    if (seconds < runningUntil) return poseAt(gait, stride * gait.seconds)
    if (kit.gait === 'swim') return poseAt(gait, seconds * 0.4)
    return poseAt(CLIPS.idle, seconds)
  }

  return {
    scene,
    camera,
    triangles,
    frame: (moment) => (moment.still ? still(moment.aspect) : play(moment)),
    dispose: () => {
      release(scene)
      sky.dispose()
    },
  }
}
