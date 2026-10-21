# game-website docs

This repo is the CV site: the portfolio, the world themes, and the links out to the personal
projects. Only the design docs for THAT live here.

- [`CV-THEME-SYSTEM.md`](CV-THEME-SYSTEM.md): the 17 worlds, where the CV content comes from (Decap files
  in `content/cv/`), the three professions, the shared scroll and hero kit, the palette rule, the world
  rules, and how to add a new world.
- [`CV-HOMEPAGE-SECTIONS.md`](CV-HOMEPAGE-SECTIONS.md): the page every world shows, top to bottom, and the
  sections of each profession.

**The game engine's documentation is not here any more.** The engine moved to its own deployment and
its docs went with it, as one copy rather than two that drift. They live in
[`nebulith/docs/`](../../nebulith/docs/), starting at `FRAMEWORKS.md`, and are also browsable at
`/docs` on the running engine.

The mirror that used to sit here was stale in ways nobody could see: its `GENERATION-SPEC.md` was
missing the entire layer-model section that `FRAMEWORKS.md` pointed at. One copy, in the repo that
owns the code.
