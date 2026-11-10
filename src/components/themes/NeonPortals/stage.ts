import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
} from 'three'
import type { Profession } from '@/lib/cv/professions'
import { Batch, aim, countTriangles, release, skyTexture } from './batch'
import type { Moment, Scene3D } from './engine'
import { ERAS, type Era } from './eras'
import { PAD_ORDER, PAD_SPOTS, STAGE_LENS } from './pads'
import { ERA_COLOURS, PORTAL } from './palette'

// The warp room (the time machine's level room of the source game, research 2026-10-21-warped-v2 [1][4]):
// a round stone platform with a plank floor and low crenels floating in the navy night (the window's CSS sky, its magenta glow low on the horizon), the
// white pedestal at the back with the glass portal sphere over it, and three warp pads on an arc at the
// front, one per profession, coloured like the pads of the first three rooms (blue, red, gold). The picked
// pad glows and the sphere holds a small model of that profession's first era. He is not in this scene: he
// stands on the pad in his own canvas (figure.ts), drawn through the same lens.
//
// Ambient: the era in the sphere turns slowly while the room is on screen; a new pick pops the new era in
// over 0.4 s. The still has the picked era at rest.

const PROFESSION_ERA: Record<Profession, Era> = { engineer: 'future', drummer: 'arabian', fighter: 'courtyard' }

const PAD_TONE: Record<Profession, string> = { engineer: PORTAL.PAD_BLUE, drummer: PORTAL.PAD_RED, fighter: PORTAL.PAD_GOLD }

const ROOM = ERA_COLOURS.room
const SPHERE_AT = [0, 2.5, -1.7] as const
const SWAP_SECONDS = 0.4
const STARS = 90

function starField(): Points {
  const positions: number[] = []
  for (let index = 0; index < STARS; index += 1) {
    // a fixed spread from the golden angle, so the sky is the same on every visit and in the still
    const angle = index * 2.39996
    const height = 3 + ((index * 37) % 100) / 9
    positions.push(Math.cos(angle) * (16 + (index % 7)), height, -12 - ((index * 13) % 9) + Math.sin(angle) * 4)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return new Points(geometry, new PointsMaterial({ color: ROOM.star, size: 0.09 }))
}

function platform(): Group {
  const batch = new Batch()
  batch.add(new CylinderGeometry(4.8, 4.2, 1.1, 16), ROOM.stoneDark, { at: [0, -0.55, 0] })
  batch.add(new CylinderGeometry(4.6, 4.6, 0.12, 16), ROOM.plank, { at: [0, 0.04, 0] })
  for (let index = 0; index < 16; index += 1) {
    const angle = (index / 16) * Math.PI * 2
    if (Math.sin(angle) > 0.55) continue
    batch.add(new BoxGeometry(0.8, 0.55, 0.45), ROOM.stone, { at: [Math.cos(angle) * 4.55, 0.3, Math.sin(angle) * 4.55], turn: [0, -angle + Math.PI / 2, 0] })
  }
  batch.add(new CylinderGeometry(1, 1.15, 0.6, 12), ROOM.stone, { at: [SPHERE_AT[0], 0.3, SPHERE_AT[2]] })
  batch.add(new CylinderGeometry(0.95, 0.95, 0.08, 12), ROOM.pedestal, { at: [SPHERE_AT[0], 0.64, SPHERE_AT[2]] })
  PAD_ORDER.forEach((profession) => {
    const [x, , z] = PAD_SPOTS[profession]
    batch.add(new CylinderGeometry(0.92, 0.98, 0.16, 12), ROOM.stoneDark, { at: [x, 0.12, z] })
  })
  return batch.build()
}

function padTop(profession: Profession): Mesh {
  const [x, , z] = PAD_SPOTS[profession]
  const mesh = new Mesh(new CylinderGeometry(0.72, 0.76, 0.12, 12), new MeshLambertMaterial({ color: PAD_TONE[profession], flatShading: true, emissive: PAD_TONE[profession], emissiveIntensity: 0 }))
  mesh.position.set(x, 0.24, z)
  return mesh
}

/** The picked profession's era in small, inside the sphere. */
function miniature(era: Era): Group {
  const batch = new Batch()
  batch.add(new CylinderGeometry(4.2, 4.2, 0.4, 10), ERAS[era].ground, { at: [0, -0.2, 0] })
  ERAS[era].piece(batch)
  const group = batch.build()
  group.scale.setScalar(0.17)
  group.position.set(SPHERE_AT[0], SPHERE_AT[1] - 0.55, SPHERE_AT[2])
  return group
}

export function buildStage(picked: () => Profession): Scene3D {
  const scene = new Scene()
  const sky = skyTexture(ROOM.skyTop, ROOM.skyLow)
  scene.background = sky
  scene.add(new HemisphereLight(PORTAL.WHITE, ROOM.skyLow, 2.2))
  const sun = new DirectionalLight(PORTAL.WHITE, 2.2)
  sun.position.set(-4, 8, 7)
  scene.add(sun)
  scene.add(starField(), platform())

  const pads = new Map(PAD_ORDER.map((profession) => [profession, padTop(profession)]))
  pads.forEach((pad) => scene.add(pad))

  const glass = new Mesh(new SphereGeometry(1.15, 14, 10), new MeshLambertMaterial({ color: ROOM.glass, transparent: true, opacity: 0.28, flatShading: true, depthWrite: false }))
  glass.position.set(...SPHERE_AT)
  scene.add(glass)

  let shown: Profession | null = null
  let era = miniature(PROFESSION_ERA[picked()])
  let swappedAt = -SWAP_SECONDS
  scene.add(era)

  const camera = new PerspectiveCamera()
  const triangles = countTriangles(scene)

  const pick = (profession: Profession, seconds: number) => {
    if (shown === profession) return
    if (shown !== null) {
      scene.remove(era)
      release(era)
      era = miniature(PROFESSION_ERA[profession])
      scene.add(era)
      swappedAt = seconds
    }
    shown = profession
    pads.forEach((pad, id) => {
      ;(pad.material as MeshLambertMaterial).emissiveIntensity = id === profession ? 0.55 : 0
    })
  }

  const frame = ({ seconds, aspect, still }: Moment) => {
    pick(picked(), still ? -SWAP_SECONDS : seconds)
    const grow = Math.min(1, (seconds - swappedAt) / SWAP_SECONDS)
    era.scale.setScalar(0.17 * (still ? 1 : grow))
    era.rotation.y = still ? 0 : seconds * 0.25
    aim(camera, { ...STAGE_LENS, aspect })
  }

  const dispose = () => {
    release(scene)
    sky.dispose()
  }

  return { scene, camera, triangles, frame, dispose }
}
