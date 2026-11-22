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
## Clicking a world card opens a portal to it

Clicking a world card plays a full screen portal tinted to the destination world, swaps the site at the peak and scrolls to the top.

## Why the dropdown went

Each of the 17 themes is a full version of the site, and a dropdown hid them. I removed it from all 17 and gave every world its world cards.

## The swap happens while the screen is covered

A small state machine covers the screen for COVER_MS (720 ms). While it is fully covered, it swaps the world, scrolls to the top and saves the choice. Then it reveals for REVEAL_MS (620 ms). Those two constants are the only knobs.

![Timeline of the transition: cover for 720 ms, swap at the peak, reveal for 620 ms](/blog/css-page-transition-portals/cover-swap-reveal.svg)

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

*From WorldTransitionContext.tsx*

## Why CSS keyframes over canvas

I animate only transform and opacity, which the GPU composites, so a full screen overlay stays smooth. JavaScript only picks the variant and times the swap.

## Four variants, picked from a shuffle bag

Each of the four variants plays once before any repeats, and a new bag never opens with the last one played, so two transitions in a row never look the same.

## Reduced motion skips the portal

With prefers-reduced-motion the world swaps instantly with no portal, and a CSS rule hides the overlay as a backstop.

## What changed since June

The cards later moved into a picker, and the reduced motion check became one shared hook. The bag and the three phases are the same today.
