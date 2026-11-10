// A camera as plain numbers, and where a world point lands in its frame. It is the same perspective a
// three.js PerspectiveCamera with lookAt draws (vertical field of view, y up), kept free of three.js so the
// framing of the stage and of each level can be checked without a browser and the pads can be placed by
// the DOM before the 3D has loaded.

export type Vec3 = readonly [number, number, number]

export interface Lens {
  position: Vec3
  target: Vec3
  /** Vertical field of view in degrees. */
  fov: number
  /** Frame width over height. */
  aspect: number
}

/** A point in the frame: x and y from 0 to 1 (0, 0 top left), depth along the view. */
export interface FramePoint {
  x: number
  y: number
  depth: number
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const normalize = (a: Vec3): Vec3 => {
  const length = Math.hypot(a[0], a[1], a[2])
  return [a[0] / length, a[1] / length, a[2] / length]
}

const UP: Vec3 = [0, 1, 0]

export function project(point: Vec3, lens: Lens): FramePoint {
  const forward = normalize(sub(lens.target, lens.position))
  const right = normalize(cross(forward, UP))
  const up = cross(right, forward)
  const offset = sub(point, lens.position)
  const depth = dot(offset, forward)
  const halfHeight = Math.tan((lens.fov * Math.PI) / 360) * depth
  const ndcX = dot(offset, right) / (halfHeight * lens.aspect)
  const ndcY = dot(offset, up) / halfHeight
  return { x: (ndcX + 1) / 2, y: (1 - ndcY) / 2, depth }
}
