import {
  BufferGeometry,
  DataTexture,
  Euler,
  LinearFilter,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Points,
  Quaternion,
  SRGBColorSpace,
  Vector3,
  type Material,
  type Object3D,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Lens, Vec3 } from './lens'

// The low poly kit every scene is built with. A Batch takes a scene's static parts (a primitive, its colour
// and where it stands) and merges them into one mesh per colour, so an era of a hundred props draws in a
// handful of calls. Every material is flat shaded Lambert, the look of the source game: one colour per face
// under one light. A glowing part (neon, lava, a lantern) is unlit Basic, so it reads as light at night.

export interface Place {
  at?: Vec3
  turn?: Vec3
  size?: Vec3
}

type Finish = 'lit' | 'glow'

const FINISH_MATERIAL: Record<Finish, (colour: string) => Material> = {
  lit: (colour) => new MeshLambertMaterial({ color: colour, flatShading: true }),
  glow: (colour) => new MeshBasicMaterial({ color: colour }),
}

export const material = (colour: string, finish: Finish = 'lit'): Material => FINISH_MATERIAL[finish](colour)

const matrixOf = ({ at = [0, 0, 0], turn = [0, 0, 0], size = [1, 1, 1] }: Place): Matrix4 =>
  new Matrix4().compose(new Vector3(...at), new Quaternion().setFromEuler(new Euler(...turn)), new Vector3(...size))

/** A primitive as a plain triangle list, so primitives of every kind merge (merging needs one layout). */
const triangles = (geometry: BufferGeometry): BufferGeometry => {
  const flat = geometry.index ? geometry.toNonIndexed() : geometry
  if (flat !== geometry) geometry.dispose()
  flat.deleteAttribute('uv')
  return flat
}

export class Batch {
  private readonly buckets = new Map<string, BufferGeometry[]>()

  add(geometry: BufferGeometry, colour: string, place: Place = {}, finish: Finish = 'lit'): this {
    const part = triangles(geometry)
    part.applyMatrix4(matrixOf(place))
    const key = `${finish}:${colour}`
    this.buckets.set(key, [...(this.buckets.get(key) ?? []), part])
    return this
  }

  /** One mesh per colour; the parts are merged and their own geometries released. */
  build(): Group {
    const group = new Group()
    this.buckets.forEach((parts, key) => {
      const [finish, colour] = key.split(':') as [Finish, string]
      const merged = mergeGeometries(parts)
      parts.forEach((part) => part.dispose())
      group.add(new Mesh(merged, material(colour, finish)))
    })
    this.buckets.clear()
    return group
  }
}

/** One part placed alone, for the parts that move (his joints, a crate, the sphere's era). */
export function part(geometry: BufferGeometry, colour: string, place: Place = {}, finish: Finish = 'lit'): Mesh {
  const mesh = new Mesh(triangles(geometry), material(colour, finish))
  mesh.applyMatrix4(matrixOf(place))
  return mesh
}

export function countTriangles(root: Object3D): number {
  let count = 0
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return
    const geometry: BufferGeometry = node.geometry
    count += (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3
  })
  return count
}

/** Releases every geometry and material under a root; a world switch unmounts the scenes. */
export function release(root: Object3D): void {
  root.traverse((node) => {
    if (!(node instanceof Mesh || node instanceof Points)) return
    node.geometry.dispose()
    const materials: Material[] = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((each) => each.dispose())
  })
}

export function aim(camera: PerspectiveCamera, lens: Lens): void {
  camera.position.set(...lens.position)
  camera.fov = lens.fov
  camera.aspect = lens.aspect
  camera.lookAt(...lens.target)
  camera.updateProjectionMatrix()
}

/**
 * A window's sky as the scene background: two texels, the top colour over the low one, stretched over the
 * window by the GPU's linear filter. The DOM window holds the same gradient in CSS until the 3D draws, and
 * keeps it when WebGL is missing; once the engine runs the window's CSS sky is cleared and this one shows.
 */
export function skyTexture(top: string, low: string): DataTexture {
  const texels = [low, top].flatMap((colour) => {
    const value = Number.parseInt(colour.slice(1), 16)
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 255]
  })
  const texture = new DataTexture(new Uint8Array(texels), 1, 2)
  texture.colorSpace = SRGBColorSpace
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}
