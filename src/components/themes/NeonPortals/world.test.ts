import { camAt, cameraPath, eraSwitchAt, layoutCorridor, planeView, settledCam, troughAt, type RoomMarks, type RoomSpec } from './world'

// The corridor's depth model and its camera path: what the scroll turns into, so it must hold at each card,
// play backwards on the way up and dip to dark only between eras.

const rooms: RoomSpec[] = [
  { id: 'about', era: 'observatory', prop: 'shard', action: 'smash', door: false, metas: [{}, {}, {}] },
  { id: 'ventures', era: 'keystone', prop: 'socket', action: 'bounce', door: true, metas: [{ featured: true }, {}] },
  { id: 'contact', era: 'beacon', prop: 'beacon', action: 'dance', door: false, metas: [{}] },
]

const marksFor = (top: number, items: number): RoomMarks => ({
  top,
  transitEnd: top + 900,
  gateTop: top + 900,
  gateBottom: top + 1500,
  items: Array.from({ length: items }, (_, i) => top + 1800 + i * 500),
  bottom: top + 1800 + items * 500 + 300,
})

describe('layoutCorridor', () => {
  const corridor = layoutCorridor(rooms, false)

  it('lays the planes far first, so the DOM order is the depth order', () => {
    const depths = corridor.planes.map((plane) => plane.z)
    expect(depths).toEqual([...depths].sort((a, b) => b - a))
  })

  it('puts one prop per item after its room gate, the lanes alternating, and the vista after the last', () => {
    corridor.rooms.forEach((room, r) => {
      expect(room.items).toHaveLength(rooms[r].metas.length)
      room.items.forEach((item, i) => {
        expect(item.z).toBeGreaterThan(room.gate)
        expect(item.side).toBe(i % 2 ? -1 : 1)
      })
      expect(room.vista).toBeGreaterThan(room.items[room.items.length - 1].z)
    })
  })

  it('draws the keystone door only in the room that asks for it', () => {
    expect(corridor.rooms.map((room) => room.door !== null)).toEqual([false, true, false])
  })

  it('narrows the tunnel on a phone', () => {
    expect(layoutCorridor(rooms, true).tw).toBeLessThan(corridor.tw)
  })
})

describe('cameraPath and camAt', () => {
  const corridor = layoutCorridor(rooms, false)
  const marks = [marksFor(1000, 3), marksFor(5000, 2), marksFor(8000, 1)]
  const { keyframes, roomTops } = cameraPath(corridor, marks, { heroHeight: 900, reading: 400, maxScroll: 9000 })

  it('keeps the path strictly increasing in scroll', () => {
    keyframes.slice(1).forEach(([y], i) => expect(y).toBeGreaterThan(keyframes[i][0]))
  })

  it('holds the camera at each card: its prop is at the runner when the card is on the reading line', () => {
    const [room] = corridor.rooms
    marks[0].items.forEach((centre, i) => expect(camAt(keyframes, centre - 400)).toBeCloseTo(room.items[i].z - 520))
  })

  it('is a pure function of the scroll, so scrolling up plays the same frames backwards', () => {
    const ys = [0, 700, 2300, 4100, 6600, 8800]
    const down = ys.map((y) => camAt(keyframes, y))
    const up = [...ys].reverse().map((y) => camAt(keyframes, y)).reverse()
    expect(up).toEqual(down)
    down.slice(1).forEach((z, i) => expect(z).toBeGreaterThanOrEqual(down[i]))
  })

  it('clamps before the first and after the last keyframe', () => {
    expect(camAt(keyframes, -50)).toBe(0)
    expect(camAt(keyframes, 1e7)).toBe(keyframes[keyframes.length - 1][1])
  })

  it('marks where each room is read from, for the settled frames', () => {
    expect(roomTops).toEqual(marks.map((mark) => mark.transitEnd - 400))
  })
})

describe('troughAt', () => {
  const corridor = layoutCorridor(rooms, false)

  it('is dark at the era switch and lit at each gate', () => {
    corridor.rooms.forEach((room) => {
      expect(troughAt(corridor.rooms, eraSwitchAt(room))).toBeCloseTo(1)
      expect(troughAt(corridor.rooms, room.gate)).toBe(0)
    })
  })
})

describe('settledCam', () => {
  const corridor = layoutCorridor(rooms, false)

  it('shows the hub above the first room, then the inside of the room being read', () => {
    const tops = [2000, 6000, 9000]
    expect(settledCam(corridor, tops, 100)).toBe(0)
    expect(settledCam(corridor, tops, 6500)).toBe(corridor.rooms[1].gate + 260)
  })
})

describe('planeView', () => {
  const corridor = layoutCorridor(rooms, false)
  const view = { vw: 1440, vh: 900, vpx: 920, vpy: 380, unit: 0.9 }

  it('hides a plane behind the camera and beyond the far fade', () => {
    const [far] = corridor.planes
    expect(planeView(far, view, far.z + 10).opacity).toBe(0)
    expect(planeView(far, view, far.z - 100000).opacity).toBe(0)
  })

  it('grows a plane as the camera comes nearer', () => {
    const gate = corridor.planes.find((plane) => plane.kind === 'gate')!
    const scale = (camZ: number) => Number(/scale\(([\d.]+)\)/.exec(planeView(gate, view, camZ).transform)![1])
    expect(scale(gate.z - 1000)).toBeGreaterThan(scale(gate.z - 3000))
  })
})
