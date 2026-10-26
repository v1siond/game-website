{
"title": "CSS page transition: four portals between my 17 CV worlds",
  "slug": "css-page-transition-portals",
  "date": "2026-10-26",
  "description": "How I swapped a theme dropdown for world cards and four CSS portal effects, timed by a small state machine and picked from a shuffle bag.",
  "keyword": "css page transition",
  "cover": "/blog/css-page-transition-portals/cover-swap-reveal.png",
  "coverAlt": "Timeline of the transition: cover for 720 ms, swap at the peak, reveal for 620 ms",
  "tags": [
    "css page transition",
    "portal transition",
    "page transition animation"
  ],
  "draft": true
}
## The result: one click, a portal, a new world

Clicking a world card plays a full screen portal tinted to the destination world, swaps the site at the peak and scrolls to the top.

## Why the dropdown went

Each of the 17 themes is a full alternate version of the site, so a dropdown hid them; the dropdown was removed from all 17 and every world got world cards.

## Cover, swap, reveal: the whole trick in three phases

A state machine runs cover for COVER_MS (720 ms), swaps the world, scrolls to 0 and saves the choice while the screen is fully covered, then reveals for REVEAL_MS (620 ms); those two constants are the knobs.

![Timeline of the transition: cover for 720 ms, swap at the peak, reveal for 620 ms](/blog/css-page-transition-portals/cover-swap-reveal.svg)

*The swap happens while nothing of the old page is visible.*

```ts
const t1 = window.setTimeout(() => {
  setThemeById(id)
  window.scrollTo(0, 0)
  setPhase('reveal')

  const t2 = window.setTimeout(() => {
    setPhase('idle')
    setDestId(null)
  }, REVEAL_MS)
  timers.current.push(t2)
}, COVER_MS)
timers.current.push(t1)
```

*WorldTransitionContext.tsx at 4b5d3ba*

## Why CSS keyframes over canvas

GPU composited transforms and opacity stay smooth over a full screen overlay; JS only picks the variant and times the swap.

## Four variants, picked from a shuffle bag

All four variants play once before any repeats, and the bag boundary never repeats the last one, so successive transitions feel distinct (the code comment's own reason).

## Reduced motion skips the portal

With prefers-reduced-motion the world swaps instantly with no portal, and a CSS rule hides the overlay as a backstop.

## What changed since June

The cards later moved into a picker modal and the reduced motion check became one shared hook; the bag and the three phases are the same at HEAD.
