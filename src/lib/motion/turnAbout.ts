// Turning a point about a pivot, the step every jointed figure takes to find where a hand or an elbow ends
// up once its bones are turned. Screen convention: y down, so a positive turn is clockwise on screen.

export type Point = readonly [number, number]

const DEG = Math.PI / 180

/** `point` turned by `degrees` about `pivot`. */
export function turnAbout([x, y]: Point, degrees: number, [cx, cy]: Point): [number, number] {
  return [
    cx + (x - cx) * Math.cos(degrees * DEG) - (y - cy) * Math.sin(degrees * DEG),
    cy + (x - cx) * Math.sin(degrees * DEG) + (y - cy) * Math.cos(degrees * DEG),
  ]
}
