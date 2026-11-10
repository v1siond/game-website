import { BoxGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry, Group, IcosahedronGeometry, SphereGeometry, TorusGeometry } from 'three'
import { Batch } from './batch'
import { ERA_COLOURS } from './palette'

// The eras of the source game a level runs through (research 2026-10-21-warped-v2: the medieval village, the
// tomb, under water, the great wall, the prehistoric jungle, the future city, the Arabian rooftops, an
// oriental courtyard), each a kit for the level builder (level.ts): the ground and the path, a side prop
// repeated down both sides of the path, the key piece at the far end, and for under water the kelp that
// sways. Every part is a flat shaded primitive merged by colour (batch.ts). The sky is not here: it is the
// level window's CSS gradient, the same colours as skyTop and skyLow, so it is there before the 3D loads.

export type Era = 'medieval' | 'tomb' | 'underwater' | 'wall' | 'prehistoric' | 'future' | 'arabian' | 'courtyard'
type Gait = 'run' | 'swim'

interface EraKit {
  ground: string
  path: string
  fog: string
  gait: Gait
  /** The distance between two side props along the path. */
  spacing: number
  /** One side prop at z on the side of the path (1 right, -1 left); index varies the props. */
  side: (batch: Batch, z: number, side: 1 | -1, index: number) => void
  /** The key piece, built round its own origin; the level stands it at the end of the path. */
  piece: (batch: Batch) => void
}

const box = (x: number, y: number, z: number) => new BoxGeometry(x, y, z)
const cylinder = (top: number, bottom: number, height: number, sides = 7) => new CylinderGeometry(top, bottom, height, sides)
const cone = (radius: number, height: number, sides = 6) => new ConeGeometry(radius, height, sides)

const M = ERA_COLOURS.medieval
const T = ERA_COLOURS.tomb
const U = ERA_COLOURS.underwater
const W = ERA_COLOURS.wall
const P = ERA_COLOURS.prehistoric
const F = ERA_COLOURS.future
const A = ERA_COLOURS.arabian
const C = ERA_COLOURS.courtyard

const tent = (batch: Batch, x: number, z: number, light: boolean) => {
  const cloth = light ? M.tentLight : M.tent
  batch.add(cylinder(1.1, 1.1, 1.4, 8), cloth, { at: [x, 0.7, z] })
  batch.add(cone(1.35, 1.2, 8), M.roof, { at: [x, 2, z] })
  batch.add(box(0.05, 0.6, 0.05), M.wall, { at: [x, 2.85, z] })
  batch.add(box(0.4, 0.22, 0.03), M.flag, { at: [x + 0.2, 3, z] })
}

const column = (batch: Batch, x: number, z: number) => {
  batch.add(box(0.9, 4.2, 0.9), T.column, { at: [x, 2.1, z] })
  batch.add(box(0.95, 0.4, 0.95), T.band, { at: [x, 0.5, z] })
  batch.add(box(0.95, 0.5, 0.95), T.paint, { at: [x, 2.6, z] })
  batch.add(box(1.3, 0.3, 1.3), T.column, { at: [x, 4.3, z] })
}

const merlons = (batch: Batch, x: number, z: number) => {
  batch.add(box(0.5, 1, 2.6), W.brick, { at: [x, 0.5, z] })
  batch.add(box(0.5, 0.6, 1), W.brick, { at: [x, 1.3, z] })
}

const lantern = (batch: Batch, x: number, z: number) => {
  batch.add(box(0.08, 1.8, 0.08), W.roof, { at: [x, 1.9, z] })
  batch.add(new SphereGeometry(0.22, 6, 4), W.lantern, { at: [x, 2.9, z] }, 'glow')
}

const tower = (batch: Batch, x: number, z: number, index: number) => {
  const height = 5 + (index % 3) * 2.5
  const neon = [F.neonA, F.neonB, F.neonC][index % 3]
  batch.add(box(1.8, height, 1.8), F.tower, { at: [x, height / 2, z] })
  batch.add(box(1.86, 0.18, 1.86), neon, { at: [x, height * 0.45, z] }, 'glow')
  batch.add(box(1.86, 0.18, 1.86), neon, { at: [x, height * 0.85, z] }, 'glow')
}

const houseWithArch = (batch: Batch, x: number, z: number, index: number) => {
  batch.add(box(2, 2.4, 2), A.wall, { at: [x, 1.2, z] })
  batch.add(box(0.7, 1.2, 0.1), A.arch, { at: [x - Math.sign(x) * 1.02, 0.9, z], turn: [0, Math.PI / 2, 0] })
  if (index % 2 === 0) batch.add(new SphereGeometry(0.9, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), A.dome, { at: [x, 2.4, z] })
}

const pillarPair = (batch: Batch, x: number, z: number) => {
  batch.add(cylinder(0.22, 0.22, 3.2, 8), C.pillar, { at: [x, 1.6, z] })
  batch.add(box(1.6, 0.3, 1.6), C.roof, { at: [x, 3.3, z] })
  batch.add(cone(1.3, 0.7, 4), C.roof, { at: [x, 3.8, z], turn: [0, Math.PI / 4, 0] })
}

export const ERAS: Record<Era, EraKit> = {
  medieval: {
    ground: M.ground,
    path: M.path,
    fog: M.skyLow,
    gait: 'run',
    spacing: 6,
    side: (batch, z, side, index) => tent(batch, side * (4.4 + (index % 2) * 0.8), z, index % 2 === 0),
    piece: (batch) => {
      batch.add(box(4, 3, 1.4), M.wall, { at: [0, 1.5, 0] })
      ;[-1.8, 1.8].forEach((x) => {
        batch.add(cylinder(0.8, 0.8, 4.4, 8), M.wall, { at: [x, 2.2, 0] })
        batch.add(cone(1, 1.6, 8), M.roof, { at: [x, 5.2, 0] })
      })
      batch.add(box(1.2, 1.8, 0.2), M.roof, { at: [0, 0.9, 0.72] })
    },
  },
  tomb: {
    ground: T.ground,
    path: T.path,
    fog: T.skyLow,
    gait: 'run',
    spacing: 4,
    side: (batch, z, side) => column(batch, side * 3, z),
    piece: (batch) => {
      batch.add(box(2.4, 1.2, 3), T.sphinx, { at: [0, 0.6, -0.6] })
      batch.add(box(1.5, 1.7, 1.4), T.sphinx, { at: [0, 2, 0.4] })
      batch.add(box(2.2, 1.6, 0.9), T.band, { at: [0, 2.2, 0] })
      batch.add(box(0.5, 0.25, 0.3), T.paint, { at: [0, 1.6, 1.15] })
    },
  },
  underwater: {
    ground: U.ground,
    path: U.path,
    fog: U.skyLow,
    gait: 'swim',
    spacing: 5,
    side: (batch, z, side, index) => {
      batch.add(new DodecahedronGeometry(0.9 + (index % 3) * 0.3, 0), U.rock, { at: [side * (3.4 + (index % 2)), 0.5, z], turn: [index, index * 2, 0] })
      batch.add(new IcosahedronGeometry(0.35, 0), U.coral, { at: [side * 2.6, 0.3, z - 1.6] })
    },
    piece: (batch) => {
      ;[-1.6, 1.6].forEach((x) => batch.add(cylinder(0.45, 0.6, 3.4, 7), U.coral, { at: [x, 1.7, 0] }))
      batch.add(new TorusGeometry(1.6, 0.4, 5, 10, Math.PI), U.coral, { at: [0, 3.2, 0] })
    },
  },
  wall: {
    ground: W.ground,
    path: W.path,
    fog: W.skyLow,
    gait: 'run',
    spacing: 3.6,
    side: (batch, z, side, index) => {
      merlons(batch, side * 1.9, z)
      if (index % 2 === 0) lantern(batch, side * 2.4, z - 1.8)
    },
    piece: (batch) => {
      batch.add(box(3.4, 3.2, 3), W.brick, { at: [0, 1.6, 0] })
      batch.add(box(1.2, 1.8, 0.2), W.roof, { at: [0, 0.9, 1.52] })
      batch.add(cone(3, 1.4, 4), W.roof, { at: [0, 3.9, 0], turn: [0, Math.PI / 4, 0] })
      batch.add(cone(1.8, 1.2, 4), W.roof, { at: [0, 5, 0], turn: [0, Math.PI / 4, 0] })
    },
  },
  prehistoric: {
    ground: P.ground,
    path: P.path,
    fog: P.skyLow,
    gait: 'run',
    spacing: 3.2,
    side: (batch, z, side, index) => {
      const x = side * (2.8 + (index % 3) * 0.7)
      ;[-0.5, 0, 0.5].forEach((lean) => batch.add(cone(0.35, 1.8, 4), P.fern, { at: [x, 0.8, z], turn: [lean, index, lean * side] }))
      if (index % 3 === 1) batch.add(new DodecahedronGeometry(0.6, 0), P.rock, { at: [x + side, 0.4, z - 1.2] })
    },
    piece: (batch) => {
      batch.add(cone(6, 6, 7), P.volcano, { at: [0, 3, -12] })
      batch.add(cylinder(1.2, 1.4, 0.3, 7), P.lava, { at: [0, 6, -12] }, 'glow')
      ;[-1.7, 1.7].forEach((x) => batch.add(new DodecahedronGeometry(1.1, 0), P.rock, { at: [x, 1, 0] }))
      batch.add(box(4.6, 0.9, 1.2), P.rock, { at: [0, 2.3, 0] })
    },
  },
  future: {
    ground: F.ground,
    path: F.path,
    fog: F.skyLow,
    gait: 'run',
    spacing: 4.5,
    side: (batch, z, side, index) => {
      tower(batch, side * (4 + (index % 2) * 1.4), z, index)
      batch.add(box(0.1, 0.04, 3), F.neonB, { at: [side * 1.62, 0.07, z] }, 'glow')
    },
    piece: (batch) => {
      ;[-2, 2].forEach((x) => batch.add(box(0.7, 4.4, 0.7), F.tower, { at: [x, 2.2, 0] }))
      batch.add(box(4.7, 0.5, 0.7), F.tower, { at: [0, 4.4, 0] })
      batch.add(box(3.6, 0.16, 0.2), F.neonA, { at: [0, 4.05, 0.38] }, 'glow')
    },
  },
  arabian: {
    ground: A.ground,
    path: A.path,
    fog: A.skyLow,
    gait: 'run',
    spacing: 4.4,
    side: (batch, z, side, index) => houseWithArch(batch, side * 3.4, z, index),
    piece: (batch) => {
      batch.add(box(4, 3, 2.6), A.wall, { at: [0, 1.5, 0] })
      batch.add(new SphereGeometry(1.6, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), A.dome, { at: [0, 3, 0] })
      batch.add(cone(0.18, 1.2, 6), A.gold, { at: [0, 5.1, 0] })
      batch.add(box(1.2, 1.9, 0.1), A.arch, { at: [0, 0.95, 1.31] })
    },
  },
  courtyard: {
    ground: C.ground,
    path: C.path,
    fog: C.skyLow,
    gait: 'run',
    spacing: 4,
    side: (batch, z, side) => pillarPair(batch, side * 3.2, z),
    piece: (batch) => {
      ;[-2.2, 2.2].forEach((x) => batch.add(cylinder(0.3, 0.3, 4, 8), C.pillar, { at: [x, 2, 0] }))
      batch.add(box(5.6, 0.5, 1.4), C.roof, { at: [0, 4.2, 0] })
      batch.add(cone(4, 1.4, 4), C.roof, { at: [0, 5.1, 0], turn: [0, Math.PI / 4, 0] })
    },
  },
}

/** The kelp of the underwater level, apart from the merged scene so each stalk can sway. */
export function kelp(length: number): Group {
  const group = new Group()
  for (let index = 0; index * 2.6 < length; index += 1) {
    const side = index % 2 === 0 ? 1 : -1
    const stalk = new Batch().add(box(0.12, 2.6, 0.12), U.kelp, { at: [0, 1.3, 0] }).add(box(0.3, 0.5, 0.06), U.kelp, { at: [0.12, 1.9, 0], turn: [0, 0, 0.5] }).build()
    stalk.position.set(side * (2.2 + (index % 3) * 0.5), 0, 2 - index * 2.6)
    group.add(stalk)
  }
  return group
}
