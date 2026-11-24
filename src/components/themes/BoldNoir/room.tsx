import { NOIR } from './palette'
import { Canvas, FLOOR, H, W } from './street'

// An inside of the case, in place of the street's wall and pavement: a plain wall up to the ceiling with its
// rail and skirting, and the floor boards. The interrogation room, the club and the precinct each stand
// their own things in front of it.

/** The wall: smoke over coal, the rail across it and the skirting at its foot. */
export function RoomWall({ tone = NOIR.coal }: { tone?: string }) {
  return (
    <Canvas>
      <rect x={-200} y={0} width={W + 400} height={FLOOR} fill={tone} />
      <rect x={-200} y={FLOOR - 300} width={W + 400} height={300} fill={NOIR.ink} opacity="0.35" />
      <path d={`M-200 ${FLOOR - 300} H${W + 200}`} stroke={NOIR.smoke} strokeWidth="6" />
      <path d={`M-200 ${FLOOR - 24} H${W + 200}`} stroke={NOIR.smoke} strokeWidth="10" />
    </Canvas>
  )
}

/** The floor boards, their joints running toward the viewer. */
export function RoomFloor() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={H - FLOOR} fill={NOIR.smoke} />
      {Array.from({ length: 16 }, (_, i) => -200 + i * 130).map((x) => (
        <path key={x} d={`M${x} ${FLOOR} L${x - 40} ${H}`} stroke={NOIR.coal} strokeWidth="3" />
      ))}
      <path d={`M-200 ${FLOOR} H${W + 200}`} stroke={NOIR.ash} strokeWidth="3" />
    </Canvas>
  )
}
