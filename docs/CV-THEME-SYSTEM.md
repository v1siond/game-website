# CV theme system

The site shows Alexander's CV inside one of 17 game styled worlds, or as a plain page at `/cv`. Every world
reads the same CV content (Decap files in `content/cv/`) and the same shared scroll, hero and text pieces; a
world only adds its own look: its palette, its art and its scenes. The default world is Neon Cyber.

## How a visitor gets a world

- The homepage renders the world picked in the worlds menu, remembered in localStorage under
  `portfolio-theme`. `?t=<id>` opens a world directly. With nothing stored, the default `neon-cyber` opens.
- `?profession=<id>` opens a profession directly (`engineer`, `drummer`, `fighter`). With none, the world
  opens on the engineer.
- `/cv` is the plain CV in English, Spanish or Italian, with a PDF download.

## The 17 worlds

Dark Fantasy, Survival Horror, Neon Portals, Soul Map, Adventure Paths, Rubber Hose, Retro RPG, Bold Noir,
Fighter Select, Art Deco, Retro Atomic, Neon Cyber (default), Cell Shaded, Silhouette, Mythic, Tropical
Platformer, Medieval Fantasy. The worlds menu groups them in five categories: Fantasy, Retro, Neon, Action,
Artistic.

## Where the CV content comes from

- The content is Decap CMS files, `content/cv/*.json` (summary, contact, experience, projects, bands,
  martial-arts, tech-stack, companies, roles), each holding `en`, `es` and `it`. He edits them at `/admin`.
- One loader, `getAllCVData(locale)` in `src/lib/cv-data.ts`, reads the files on each render, so an edit
  shows without a code change. A key missing in a locale keeps the English value.
- No other source exists: no hand written data folder and no API. nebulith is not this site's backend.
- `node scripts/check-cv-text.mjs` fails when an English string no longer matches the job history it was
  copied from, or a project fact has no commit behind it.

## What each profession shows

There are three professions: System Engineer (`engineer`, the default), Musician (`drummer`) and Martial
Artist (`fighter`), listed in `src/lib/cv/professions.ts`.

`viewFor(cv, profession, mode)` in `src/lib/cv/cvView.ts` builds what a world renders:

| Profession | Sections it gets |
|------------|------------------|
| engineer | jobs, projects, tech stack, companies |
| drummer | the musician block and every band |
| fighter | the Muay Thai record |

In a world (`mode: 'world'`) jobs and projects are cut to the last 5 years (`RECENT_WORK_YEARS`), plus any
current entry and any entry with the `highlight` toggle on. Bands and the martial arts record are always
whole. `/cv` reads the full CV and shows everything. Worlds get their view through `useWorldView()` in
`src/components/cv/CVDataProvider.tsx`, and `ProfessionSectionsView` picks the world's section component for
the shown profession from the world's map.

## The shared pieces every world uses

| Piece | File | What it does |
|-------|------|--------------|
| ScrollScene, FadeInScene | `src/components/scroll/ScrollScene.tsx` | A section whose scene follows scroll: writes `--scene-progress` (0 to 1) so children animate with classes, no React re-render. FadeInScene is the plain fade block between levels. |
| LevelScene, LevelStrip, SceneEntry, ContactStage, atClass, LevelArt, LevelGround | `src/components/scroll/stage.tsx` | The level a profession plays on: the strip he walks, entries that arrive along it, the contact corner, positions on the track. |
| worldLane, arrivalItem | `src/components/scroll/arrivals.tsx` | Build a world's lane and its arrival kinds once; a world passes only its look. |
| Terminal, DrumKit, SoundWaves, RingCorner, DeskCorner, KitCorner and the other props | `src/components/scroll/stageProps.tsx` | The stage props, coloured by the world. |
| HeroFigure, HeroArm, HeroLeg, HERO_TORSO, HERO_SKIN_SHADE | `src/components/scroll/HeroFigure.tsx` | His figure. A world passes skin and hair colours as props. |
| HeroFist, HeroStick, HeroGlove | `src/components/scroll/heroHands.tsx` | His hands for each profession. |
| Mongkhon | `src/components/scroll/Mongkhon.tsx` | The Muay Thai headband. |
| heroScene.module.css | `src/components/scroll/heroScene.module.css` | The walk, advance, limb, stick and wave motion. A world sets only numbers (`--strides`, `--swing`, `--stick-hits`, `--walk-inset` and the others) in its `.tempo` class. |
| sectionText | `src/components/cv/sectionText.ts` | Shared text: project links, year spans, job years, Muay Thai facts, heading ids. |
| RecruiterHero, ProfessionSwitch, ProfessionSectionsView | `src/components/cv/` | The hero, the profession switch, the per profession dispatch. |
| useReducedMotion, useScrollScene, useSectionTrigger | `src/hooks/` | The one reduced motion check, the scroll progress, the one shot reveal trigger. |
| paletteVars | `src/components/themes/shared/paletteVars.ts` | Turns a palette into CSS variables (`paletteVars('tp', { leafDark })` sets `--tp-leaf-dark`). |
| GlobalProfessionStage | `src/components/themes/shared/professionStage.tsx` | A recoloured profession stage for worlds that draw none of their own. |

## Colours: one source per world

Each world's `palette.ts` is its only colour source. The world root sets the palette as CSS variables with
`paletteVars`, and its classes read them by name (`bg-[color:var(--tp-night)]`). The registry
`src/themes/themes.ts` imports each world's palette for the menu colours and holds no hex of its own.

## A world's folder

A world is `src/components/themes/<Name>Theme.tsx` plus a `<Name>/` folder holding only that world's look:

- `palette.ts`: its colours.
- `character.tsx`: his figure dressed for the world, built on `HeroFigure`.
- `scenes.tsx` and `scenes.module.css`: its contact scene and the `.tempo` numbers.
- `stages.tsx` (where present): its three profession stages, built on `stage.tsx` and `stageProps.tsx`.
- `sections.tsx`, `cards.tsx`, `actions.tsx`, `backdrop.tsx` and similar: its section frames and art.

Sixteen worlds draw their own profession stages and are listed in `WORLDS_WITH_OWN_STAGE`
(`src/components/themes/shared/professionStage.tsx`). Medieval Fantasy is the one world without its own:
its folder `src/components/themes/MedievalFantasy/` has no `stages.tsx` or `scenes.tsx`, and the shared
`GlobalProfessionStage` draws its stage. Dark Fantasy is the oldest world and keeps its own combat files in
`DarkFantasy/`, with its reveals on the shared `ScrollScene`.

## Rules every world follows

- His rule: "DUPLICATION APPROACH IS PROHIBITED". One shared piece per concept. A world never copies a
  hook, a scroll scene, the hero, a stage prop or a text helper; it imports the shared one and passes its
  look. A helper two worlds need moves to `src/components/scroll/`, `src/components/cv/`, `src/hooks/` or
  `src/components/themes/shared/`.
- No source game characters, mascots, brand or game names, in art, text or file and component names. The
  character is him, with his beard.
- Tailwind classes, not inline styles, wherever Tailwind fits. A CSS variable set from a palette is the
  exception that fits.
- Animate transform and opacity only. No animated shadow or blur.
- Honour reduced motion through `useReducedMotion` (or the shared CSS), never a local media query check.
- Titles stay professional (System Engineer, Musician, Martial Artist). Content comes only from the Decap
  files through `useWorldView`.

## How to add a new world

1. Pick an id and a name. Create `src/components/themes/<Name>/palette.ts` with its colours, the only hex
   for this world.
2. Write `character.tsx` on `HeroFigure`, `HeroArm`, `HeroLeg` and the hands in `heroHands.tsx`, passing
   skin and hair colours. No new figure.
3. Write `stages.tsx` with one `StageLook` per profession, using `stage.tsx` and the props in
   `stageProps.tsx`. Build the lane with `worldLane` and entries with `arrivalItem`. Add the id to
   `WORLDS_WITH_OWN_STAGE`. Skip this step to use the shared stage instead.
4. Write `scenes.tsx` with its `ContactStage` corner, and `scenes.module.css` with a `.tempo` class that
   sets only the numbers `heroScene.module.css` reads.
5. Write `sections.tsx`: one component per profession in a map for `ProfessionSectionsView`, text from
   `sectionText.ts`, wrapped in `ScrollScene` or `FadeInScene`.
6. Write `<Name>Theme.tsx`: read `useWorldView()`, render `RecruiterHero`, `ProfessionSwitch` and the
   sections, set the palette on the root with `paletteVars`.
7. Register it: an entry in `src/themes/themes.ts` that reads the palette, and one in `src/themes/worlds.ts`
   with its category. Add a preview image in `public/world-previews/`.
8. Run `npm run lint`, `npx tsc --noEmit -p .`, `npx jest` and `node scripts/check-cv-text.mjs`.

Any piece the new world needs that is missing from the shared folders is added there once, never in the
world folder.

## How this was worked out

Read from the code on 2026-10-21: `src/themes/themes.ts` (17 entries, `DEFAULT_THEME_ID`,
`THEME_STORAGE_KEY`), `src/themes/worlds.ts`, `src/lib/cv-data.ts`, `src/lib/cv/cvView.ts`,
`src/lib/cv/professions.ts`, `src/components/scroll/`, `src/components/cv/`,
`src/components/themes/shared/`, `src/app/(cv)/cv/page.tsx` and each world folder.
