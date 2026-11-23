// The node writers a theatre scene's binder uses (shared/theatre): find a marked node once, then per frame
// write only an SVG transform, opacity or shown frame on it. They print what Era Postcards' draw.ts prints
// (one decimal for a translate, three for an opacity), so that world can move onto them unchanged.

/** One decimal, so the server and the browser print the same numbers. */
export const r1 = (n: number): number => Math.round(n * 10) / 10

export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t))

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t

/** The share of item i reached, 0 to 1, from the fractional count of reached items. */
export const reached = (count: number, i: number): number => clamp01(count - i)

/** `count` places spread evenly from `from` to `to`; one sits in the middle. */
export const spread = (count: number, from: number, to: number): number[] =>
  Array.from({ length: count }, (_, i) => (count === 1 ? (from + to) / 2 : from + ((to - from) * i) / (count - 1)))

/** The node marked data-fx="name" inside the stage. */
export const fx = (stage: Pick<ParentNode, 'querySelector'>, name: string): Element | null => stage.querySelector(`[data-fx="${name}"]`)

/** Every node whose data-fx name starts with a prefix, in document order. */
export const fxAll = (stage: Pick<ParentNode, 'querySelectorAll'>, prefix: string): Element[] => Array.from(stage.querySelectorAll(`[data-fx^="${prefix}"]`))

export const transformTo = (node: Element | null, transform: string): void => node?.setAttribute('transform', transform)

export const translateTo = (node: Element | null, x: number, y: number): void => transformTo(node, `translate(${r1(x)} ${r1(y)})`)

/** The caller passes an opacity from 0 to 1. */
export const fadeTo = (node: Element | null, opacity: number): void => node?.setAttribute('opacity', opacity.toFixed(3))

/** Shows one of a node's frames (children marked data-frame) and hides the one shown before. */
export function frames(node: Element | null, first: string): (frame: string) => void {
  const all = new Map(Array.from(node?.querySelectorAll('[data-frame]') ?? [], (el) => [el.getAttribute('data-frame') ?? '', el]))
  let shown = first
  return (frame) => {
    if (frame === shown || !all.has(frame)) return
    all.get(shown)?.setAttribute('visibility', 'hidden')
    all.get(frame)?.setAttribute('visibility', 'visible')
    shown = frame
  }
}

/**
 * The camera pushed in `zoom` times on the canvas point (x, y), as an SVG transform for a group that holds a
 * plane's art: that point stays where it is on screen and the rest of the picture grows away from it.
 */
export const focusOn = (x: number, y: number, zoom: number): string => `translate(${r1(x * (1 - zoom))} ${r1(y * (1 - zoom))}) scale(${zoom.toFixed(3)})`
