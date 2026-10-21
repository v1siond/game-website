import { FoeSprite } from './actor'
import side from './side.module.css'

// The living world behind the page, fixed to the viewport (research notes, images 04, 06, 07, 16, 17, 19,
// 20, 33): the sky, a far range of pill hills and a near range of round hills with eyes, the
// two sliding left at two speeds as if the camera followed him running, clouds with faces drifting by,
// sparkles, and on the ground at the bottom a mushroom and a turtle walking their beat while a
// biting plant bobs in and out of its pipe. It changes with the part of the page in view, like the game's
// worlds: the root's data-zone (useZoneStage) crossfades the sky, recolours the hills and swaps them for
// the underground's teal bricks or the fortress's gold blocks. Everything here is aria-hidden art; the
// moving parts are 14 transform or opacity animations (two hill ranges, three clouds, two sparkles, the
// plant, and each walker's patrol and two step frames).

export const ZONES = ['plains', 'sky', 'underground', 'night', 'fortress', 'sunset'] as const
export type Zone = (typeof ZONES)[number]

const STRIP_WIDTH = 1600

// The far pill hills along one strip: left edge, width and height.
const PILLS: ReadonlyArray<readonly [number, number, number]> = [
  [40, 120, 260],
  [150, 150, 340],
  [420, 110, 220],
  [520, 160, 300],
  [800, 130, 380],
  [1010, 120, 250],
  [1240, 150, 320],
  [1380, 110, 210],
]

// The near round hills with eyes: centre, width and height.
const DOMES: ReadonlyArray<readonly [number, number, number]> = [
  [160, 300, 150],
  [360, 220, 110],
  [720, 340, 170],
  [1060, 260, 130],
  [1360, 320, 160],
]

function FarHills() {
  return (
    <svg viewBox={`0 0 ${STRIP_WIDTH} 400`} width={STRIP_WIDTH} height={400} className="block shrink-0">
      {PILLS.map(([x, width, height]) => (
        <g key={x}>
          <rect x={x} y={400 - height} width={width} height={height + 40} rx={width / 2} className={side.farFill} strokeWidth={5} />
          <rect x={x + width * 0.16} y={400 - height + width * 0.3} width={width * 0.1} height={height * 0.4} rx={width * 0.05} className={side.farShine} />
        </g>
      ))}
    </svg>
  )
}

function NearHills() {
  return (
    <svg viewBox={`0 0 ${STRIP_WIDTH} 200`} width={STRIP_WIDTH} height={200} className="block shrink-0">
      {DOMES.map(([cx, width, height]) => (
        <g key={cx}>
          <path d={`M${cx - width / 2} 210 V${200 - height * 0.5} A${width / 2} ${height * 0.5} 0 0 1 ${cx + width / 2} ${200 - height * 0.5} V210 Z`} className={side.nearFill} strokeWidth={5} />
          {[-1, 1].map((sideOfFace) => (
            <rect key={sideOfFace} x={cx + sideOfFace * width * 0.08 - 5} y={200 - height * 0.8} width={10} height={24} rx={5} className={side.hillEye} />
          ))}
        </g>
      ))}
    </svg>
  )
}

function Cloud() {
  return (
    <svg viewBox="0 0 96 40" className="h-10 w-24">
      <rect x={3} y={8} width={90} height={28} rx={14} className={side.cloudFill} strokeWidth={3} />
      <rect x={38} y={16} width={5} height={10} rx={2} className={side.cloudEye} />
      <rect x={52} y={16} width={5} height={10} rx={2} className={side.cloudEye} />
    </svg>
  )
}

/** A pipe standing on the ground, its rim on top. */
export function Pipe({ className = 'h-11 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" preserveAspectRatio="none" className={`block ${className}`} aria-hidden="true" focusable="false">
      <rect x={4} y={14} width={32} height={34} className={side.pipeBody} strokeWidth={3} />
      <rect x={1.5} y={2} width={37} height={14} className={side.pipeBody} strokeWidth={3} />
      <rect x={9} y={4} width={5} height={10} className={side.pipeShine} />
      <rect x={11} y={16} width={4} height={28} className={side.pipeShine} />
    </svg>
  )
}

const SPARKLES = ['left-[14%] top-[22%]', 'left-[62%] top-[34%]']
const CLOUDS = ['top-[10%]', 'top-[24%]', 'top-[38%]']

export function LivingWorld({ zone }: { zone: Zone }) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${side.world}`} data-zone={zone} aria-hidden="true">
      {ZONES.map((name) => (
        <div key={name} className={`absolute inset-0 ${side.sky}`} data-sky={name} />
      ))}

      <div className={`absolute bottom-10 left-0 flex ${side.farStrip}`}>
        <FarHills />
        <FarHills />
      </div>
      <div className={`absolute bottom-10 left-0 flex ${side.nearStrip}`}>
        <NearHills />
        <NearHills />
      </div>

      {CLOUDS.map((top, index) => (
        <div key={top} className={`absolute left-0 ${top} ${side.cloud}`} data-i={index}>
          <Cloud />
        </div>
      ))}
      {SPARKLES.map((place) => (
        <span key={place} className={`absolute h-3 w-3 ${place} ${side.sparkle}`} />
      ))}

      <div className={`absolute inset-x-0 bottom-0 h-10 ${side.worldGround}`} />
      <div className={`absolute bottom-10 right-[8%] h-[100px] w-10 ${side.plantPot}`}>
        <div className={`absolute bottom-9 left-0.5 ${side.plant}`}>
          <FoeSprite look="plantOpen" className="h-12 w-9" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <Pipe />
        </div>
      </div>
      <div className={`absolute bottom-10 left-0 w-full ${side.patrol}`} data-foe="walker">
        <div className="w-fit">
          <FoeSprite look="walker" className="h-12 w-9" />
        </div>
      </div>
      <div className={`absolute bottom-10 left-0 w-full ${side.patrol}`} data-foe="turtle">
        <div className="w-fit">
          <FoeSprite look="turtle" className="h-12 w-9" />
        </div>
      </div>
    </div>
  )
}
