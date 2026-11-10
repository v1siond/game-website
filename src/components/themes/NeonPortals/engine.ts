import { WebGLRenderer, type PerspectiveCamera, type Scene } from 'three'
import { sectionProgress } from '@/lib/scroll/progress'

// The one WebGL context every window of the world draws through (the stage and each level): a canvas fixed
// over the screen behind the page, and each window's scene drawn into the rectangle of its placeholder
// element with the scissor test, the pattern of the three.js manual; a browser keeps about 8 contexts, so one
// canvas per window would lose them on a long page (research 2026-11-09-c44-neon-portals-r2 [2][3]).
//
// What it costs, and when:
//   - a window's scene is built the first time the window comes within one screen of the viewport, never at
//     load, and released when the world unmounts;
//   - the render loop runs only while at least one window is on screen and the tab is visible, and draws only
//     the windows on screen (both read from IntersectionObservers); with none, the canvas is cleared and the
//     loop stops;
//   - the pixel ratio is at most 2, and 1.5 under 640 px;
//   - still mode (reduced motion, World Select preview) runs no loop: it draws each window's still once, and
//     again only when the page scrolls or resizes, so the stills stay inside their windows.

export interface Moment {
  /** Seconds since the engine started, the clock of every one shot moment and ambient loop. */
  seconds: number
  /** The window's scroll progress, 0 entering from the bottom of the screen to 1 near the top. */
  progress: number
  /** The window's width over its height. */
  aspect: number
  still: boolean
}

export interface Scene3D {
  scene: Scene
  camera: PerspectiveCamera
  triangles: number
  frame: (moment: Moment) => void
  dispose: () => void
}

interface View {
  element: HTMLElement
  make: () => Scene3D
}

interface Entry {
  view: View
  built: Scene3D | null
  onScreen: boolean
}

// The run plays from the window's top entering at the bottom of the screen until it is 15 percent from the
// top, so it ends while the window is still in view.
const RUN_LINES = { start: 1, end: 0.15 }
const NEAR = '100% 0px 100% 0px'

export const pixelRatioFor = (width: number, deviceRatio: number): number => Math.min(deviceRatio, width < 640 ? 1.5 : 2)

type EngineStart = { ok: true; engine: Engine } | { ok: false; reason: string }

/** Opens the shared context on the canvas; a browser with no WebGL gets the reason back, never a throw. */
export function startEngine(canvas: HTMLCanvasElement, still: boolean): EngineStart {
  try {
    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    return { ok: true, engine: new Engine(renderer, still) }
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) }
  }
}

export class Engine {
  private readonly entries = new Map<Element, Entry>()
  private readonly near: IntersectionObserver
  private readonly seen: IntersectionObserver
  private readonly started = performance.now()
  private frameId = 0
  private disposed = false

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly still: boolean,
  ) {
    renderer.setClearColor(0x000000, 0)
    renderer.autoClear = false
    this.near = new IntersectionObserver((records) => this.onNear(records), { rootMargin: NEAR })
    this.seen = new IntersectionObserver((records) => this.onSeen(records))
    document.addEventListener('visibilitychange', this.wake)
    if (!still) return
    window.addEventListener('scroll', this.wake, { passive: true })
    window.addEventListener('resize', this.wake)
  }

  /** Adds a window; the returned function removes it and releases its scene. */
  add(view: View): () => void {
    this.entries.set(view.element, { view, built: null, onScreen: false })
    this.near.observe(view.element)
    this.seen.observe(view.element)
    return () => {
      this.near.unobserve(view.element)
      this.seen.unobserve(view.element)
      this.entries.get(view.element)?.built?.dispose()
      this.entries.delete(view.element)
      this.wake()
    }
  }

  /** Something a scene shows changed outside the clock (a profession picked): draw again. */
  readonly wake = (): void => {
    if (this.frameId || this.disposed) return
    this.frameId = requestAnimationFrame(this.draw)
  }

  dispose(): void {
    this.disposed = true
    cancelAnimationFrame(this.frameId)
    this.near.disconnect()
    this.seen.disconnect()
    document.removeEventListener('visibilitychange', this.wake)
    window.removeEventListener('scroll', this.wake)
    window.removeEventListener('resize', this.wake)
    this.entries.forEach((entry) => entry.built?.dispose())
    this.entries.clear()
    this.renderer.dispose()
  }

  private build(element: Element): void {
    const entry = this.entries.get(element)
    if (!entry || entry.built) return
    entry.built = entry.view.make()
    this.near.unobserve(element)
  }

  private onNear(records: IntersectionObserverEntry[]): void {
    records.forEach((record) => {
      if (record.isIntersecting) this.build(record.target)
    })
  }

  private onSeen(records: IntersectionObserverEntry[]): void {
    records.forEach((record) => {
      const entry = this.entries.get(record.target)
      if (!entry) return
      entry.onScreen = record.isIntersecting
      if (record.isIntersecting) this.build(record.target)
    })
    this.wake()
  }

  private readonly draw = (now: number): void => {
    this.frameId = 0
    if (document.hidden) return
    const canvas = this.renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    this.renderer.setPixelRatio(pixelRatioFor(width, window.devicePixelRatio))
    this.renderer.setSize(width, height, false)
    this.renderer.setScissorTest(false)
    this.renderer.clear()
    this.renderer.setScissorTest(true)

    const shown = [...this.entries.values()].filter((entry) => entry.onScreen && entry.built)
    const seconds = (now - this.started) / 1000
    shown.forEach((entry) => this.drawWindow(entry, seconds, height))
    if (!this.still && shown.length > 0) this.frameId = requestAnimationFrame(this.draw)
  }

  private drawWindow({ view, built }: Entry, seconds: number, height: number): void {
    if (!built) return
    // inside the window's border, so the square scissor never shows past its rounded corners
    const element = view.element
    const rect = element.getBoundingClientRect()
    const width = element.clientWidth
    const tall = element.clientHeight
    if (width === 0 || tall === 0) return
    const left = rect.left + element.clientLeft
    const bottom = height - (rect.top + element.clientTop + tall)
    this.renderer.setViewport(left, bottom, width, tall)
    this.renderer.setScissor(left, bottom, width, tall)
    built.frame({ seconds, progress: sectionProgress(rect.top, window.innerHeight, RUN_LINES), aspect: width / tall, still: this.still })
    this.renderer.render(built.scene, built.camera)
  }
}
