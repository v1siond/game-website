// Holds every animation inside an element on its first frame until its section shows, as a Tailwind class:
// the class pauses them (important, so a world's own `animation` shorthand cannot set them running), and
// dropping it on the section trigger plays each one from its start, once. A world puts it on the element
// whose useSectionTrigger ref says the section is on screen. The class is a literal so Tailwind generates it.
const HELD = '[&_*]:![animation-play-state:paused]'

/** The class that holds an element's animations until `shown` turns true, then nothing. */
export const heldUntil = (shown: boolean) => (shown ? '' : HELD)
