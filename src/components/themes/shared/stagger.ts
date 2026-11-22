// The reveal step of an item in a staggered row as a Tailwind class: each class sets --i, which a world's
// keyframes multiply into the item's delay. The classes are literals so Tailwind generates all eight.
const STAGGER = ['[--i:0]', '[--i:1]', '[--i:2]', '[--i:3]', '[--i:4]', '[--i:5]', '[--i:6]', '[--i:7]']

/** The stagger class of the item at `index`; every item after the eighth shares the last step. */
export const staggerAt = (index: number) => STAGGER[Math.min(index, STAGGER.length - 1)]
