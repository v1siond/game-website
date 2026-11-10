import { CylinderGeometry, DirectionalLight, HemisphereLight, PerspectiveCamera, Scene } from 'three'
import type { Profession } from '@/lib/cv/professions'
import { Batch, aim, countTriangles, release } from './batch'
import type { Moment, Scene3D } from './engine'
import { applyPose, buildHero } from './model'
import { ERA_COLOURS, PORTAL } from './palette'
import { CLIPS, poseAt } from './pose'

// Back at the hub for the contact: him on a pad beside the save monitor. The first time his window is drawn
// he throws the ta da (1.2 s), then breathes; the still has him standing.

const LENS = { position: [0, 1.7, 5.2], target: [0, 1.1, 0], fov: 34 } as const

export function buildPodium(profession: Profession): Scene3D {
  const scene = new Scene()
  scene.add(new HemisphereLight(PORTAL.WHITE, PORTAL.CHAMBER, 2.2))
  const sun = new DirectionalLight(PORTAL.WHITE, 2.2)
  sun.position.set(-4, 8, 7)
  scene.add(sun)
  scene.add(
    new Batch()
      .add(new CylinderGeometry(1, 1.06, 0.2, 12), ERA_COLOURS.room.stoneDark, { at: [0, -0.1, 0] })
      .add(new CylinderGeometry(0.8, 0.84, 0.14, 12), PORTAL.PAD_BLUE, { at: [0, 0.07, 0] })
      .build(),
  )
  const rig = buildHero(profession)
  rig.root.position.y = 0.14
  scene.add(rig.root)
  const camera = new PerspectiveCamera()
  let firstAt: number | null = null

  const frame = ({ seconds, aspect, still }: Moment) => {
    aim(camera, { ...LENS, aspect })
    if (still) {
      applyPose(rig, poseAt(CLIPS.stand, 0))
      return
    }
    firstAt ??= seconds
    const since = seconds - firstAt
    applyPose(rig, since < CLIPS.tada.seconds ? poseAt(CLIPS.tada, since) : poseAt(CLIPS.idle, since))
  }

  return { scene, camera, triangles: countTriangles(scene), frame, dispose: () => release(scene) }
}
