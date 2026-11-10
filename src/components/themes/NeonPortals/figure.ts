import { DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer.js'
import type { Profession } from '@/lib/cv/professions'
import { aim, release } from './batch'
import { pixelRatioFor } from './engine'
import { applyPose, buildHero, type Rig } from './model'
import { PAD_SPOTS, STAGE_LENS } from './pads'
import { PORTAL } from './palette'
import { CLIPS, poseAt, type ClipName } from './pose'

// Him in the hero, in his own canvas: the hero's data-worlds-figure element, so the preview capture can show
// him alone for his portrait. He is drawn through the stage's own lens (pads.ts), cropped to his box with the
// camera's view offset, so he stands exactly on the 3D pad of the room behind him. The box moves between the
// pads with a CSS transform (0.6 s) while he hops in 3D over the same time.
//
// The arrival plays through the hero's phases (arrival.tsx): hidden while the beam comes down, the form spin
// (0.5 s), the landing squash (0.25 s), then the idle breath, the ambient loop, which runs only while the hero
// is on screen and the tab is visible. A click plays the tornado spin (0.8 s). In still mode (reduced motion,
// World Select preview) there is no loop: he is drawn standing on his pad when something changes.
//
// A browser with no WebGL gets the same rig drawn once into SVG by three's SVGRenderer: a still of him on
// his pad, no motion.

export type Phase = 'wait' | 'beam' | 'form' | 'land' | 'title' | 'ready'

const HIDDEN: ReadonlySet<Phase> = new Set(['wait', 'beam'])
const PHASE_CLIP: Partial<Record<Phase, ClipName>> = { form: 'form', land: 'land' }

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Box {
  stage: Rect
  figure: Rect
}

/** The stage window's box inside its border, where the shared engine draws the room. */
const innerBox = (element: HTMLElement): Rect => {
  const rect = element.getBoundingClientRect()
  return { left: rect.left + element.clientLeft, top: rect.top + element.clientTop, width: element.clientWidth, height: element.clientHeight }
}

function lights(scene: Scene): void {
  scene.add(new HemisphereLight(PORTAL.WHITE, PORTAL.CHAMBER, 2.2))
  const sun = new DirectionalLight(PORTAL.WHITE, 2.2)
  sun.position.set(-4, 8, 7)
  scene.add(sun)
}

/** The stage lens cropped to his box, so his canvas shows the part of the stage view he stands in. */
function cropTo(camera: PerspectiveCamera, { stage, figure }: Box): void {
  aim(camera, { ...STAGE_LENS, aspect: stage.width / stage.height })
  camera.setViewOffset(stage.width, stage.height, figure.left - stage.left, figure.top - stage.top, figure.width, figure.height)
}

const standOn = (rig: Rig, profession: Profession): void => {
  const [x, y, z] = PAD_SPOTS[profession]
  rig.root.position.set(x, y + 0.3, z)
  rig.root.rotation.y = -x * 0.07
}

interface FigurePlace {
  canvas: HTMLCanvasElement
  /** The stage window, whose inner box the stage lens frames. */
  stage: HTMLElement
}

type FigureStart = { ok: true; figure: Figure } | { ok: false; reason: string }

export function startFigure(place: FigurePlace, profession: Profession, still: boolean): FigureStart {
  try {
    const renderer = new WebGLRenderer({ canvas: place.canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    return { ok: true, figure: new Figure(renderer, place, profession, still) }
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) }
  }
}

export class Figure {
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera()
  private readonly started = performance.now()
  private readonly seen: IntersectionObserver
  private rig: Rig
  private profession: Profession
  private from: Profession
  private phase: Phase = 'wait'
  private clip: { name: ClipName; at: number } | null = null
  private onScreen = false
  private frameId = 0

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly place: FigurePlace,
    profession: Profession,
    private readonly still: boolean,
  ) {
    renderer.setClearColor(0x000000, 0)
    lights(this.scene)
    this.profession = profession
    this.from = profession
    this.rig = buildHero(profession)
    standOn(this.rig, profession)
    this.scene.add(this.rig.root)
    this.seen = new IntersectionObserver(([record]) => {
      this.onScreen = record.isIntersecting
      this.wake()
    })
    this.seen.observe(place.canvas)
    document.addEventListener('visibilitychange', this.wake)
    window.addEventListener('resize', this.wake)
  }

  setPhase(phase: Phase): void {
    this.phase = phase
    const clip = PHASE_CLIP[phase]
    if (clip) this.play(clip)
    this.wake()
  }

  spin(): void {
    this.play('spin')
    this.wake()
  }

  /** A new pick: he changes outfit and hops to its pad. */
  moveTo(profession: Profession): void {
    if (profession === this.profession) return
    this.from = this.profession
    this.profession = profession
    this.scene.remove(this.rig.root)
    release(this.rig.root)
    this.rig = buildHero(profession)
    this.scene.add(this.rig.root)
    this.play('hop')
    this.wake()
  }

  dispose(): void {
    cancelAnimationFrame(this.frameId)
    this.seen.disconnect()
    document.removeEventListener('visibilitychange', this.wake)
    window.removeEventListener('resize', this.wake)
    release(this.scene)
    this.renderer.dispose()
  }

  private play(name: ClipName): void {
    this.clip = { name, at: this.seconds() }
  }

  private seconds(): number {
    return (performance.now() - this.started) / 1000
  }

  private readonly wake = (): void => {
    if (this.frameId) return
    this.frameId = requestAnimationFrame(this.draw)
  }

  private readonly draw = (): void => {
    this.frameId = 0
    if (document.hidden || !this.onScreen) return
    const canvas = this.place.canvas
    this.renderer.setPixelRatio(pixelRatioFor(window.innerWidth, window.devicePixelRatio))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    const moving = this.pose(this.seconds())
    cropTo(this.camera, { stage: innerBox(this.place.stage), figure: canvas.getBoundingClientRect() })
    this.renderer.render(this.scene, this.camera)
    if (moving) this.frameId = requestAnimationFrame(this.draw)
  }

  /** Poses him for this moment; true while anything still moves, so the loop goes on. */
  private pose(seconds: number): boolean {
    this.rig.root.visible = !HIDDEN.has(this.phase)
    if (this.still) {
      standOn(this.rig, this.profession)
      applyPose(this.rig, poseAt(CLIPS.stand, 0))
      return false
    }
    const clip = this.clip && seconds - this.clip.at < CLIPS[this.clip.name].seconds ? this.clip : null
    this.hopPlace(clip, seconds)
    applyPose(this.rig, clip ? poseAt(CLIPS[clip.name], seconds - clip.at) : poseAt(CLIPS.idle, seconds))
    return true
  }

  private hopPlace(clip: { name: ClipName; at: number } | null, seconds: number): void {
    if (clip?.name !== 'hop') {
      standOn(this.rig, this.profession)
      return
    }
    const t = (seconds - clip.at) / CLIPS.hop.seconds
    const [ax, ay, az] = PAD_SPOTS[this.from]
    const [bx, , bz] = PAD_SPOTS[this.profession]
    this.rig.root.position.set(ax + (bx - ax) * t, ay + 0.3, az + (bz - az) * t)
    this.rig.root.rotation.y = -(ax + (bx - ax) * t) * 0.07
  }
}

/** Without WebGL: the rig drawn once into SVG, standing on his pad. */
export function drawFigureStill(host: HTMLElement, stage: HTMLElement, profession: Profession): () => void {
  const scene = new Scene()
  lights(scene)
  const rig = buildHero(profession)
  standOn(rig, profession)
  applyPose(rig, poseAt(CLIPS.stand, 0))
  scene.add(rig.root)
  const camera = new PerspectiveCamera()
  const box = { stage: innerBox(stage), figure: host.getBoundingClientRect() }
  cropTo(camera, box)
  const renderer = new SVGRenderer()
  renderer.setSize(box.figure.width, box.figure.height)
  renderer.render(scene, camera)
  host.appendChild(renderer.domElement)
  return () => {
    renderer.domElement.remove()
    release(scene)
  }
}
