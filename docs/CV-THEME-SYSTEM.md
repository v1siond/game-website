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
- Interface text (section titles, buttons, accessible names, "Released", "Since {year}") lives in
  `content/cv/labels.json` ("Site text" at `/admin`), never in a component. The same loader reads it, and a
  component reads it with `useLabels()` from `CVDataProvider`: `const { sections } = useLabels()`, then
  `title={sections.about}`. A `{slot}` is filled with `fillLabel` from `src/lib/cv/labels.ts`. A key missing
  in es or it keeps the English text. There is no next-intl and no `messages/` folder; the locale comes from
  the cookie or Accept-Language (`src/i18n/requestLocale.ts`).
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
| HERO_IDENTITY | `src/components/cv/heroIdentity.ts` | The only shared part of his character: skin, short dark hair, full dark beard, oval eyes. Each world maps these into its own palette. |
| sectionText | `src/components/cv/sectionText.ts` | Shared text: project links, year spans, job years, Muay Thai facts, heading ids. |
| RecruiterHero, ProfessionSwitch, ProfessionSectionsView | `src/components/cv/` | The hero, the profession switch, the per profession dispatch. |
| useReducedMotion, useScrollScene, useSectionTrigger, useZoneStage | `src/hooks/` | The one reduced motion check, the scroll progress, the one shot reveal trigger, the zone in view handed to a page whose backdrop follows it. |
| paletteVars | `src/components/themes/shared/paletteVars.ts` | Turns a palette into CSS variables (`paletteVars('tp', { leafDark })` sets `--tp-leaf-dark`). |
| GlobalProfessionStage | `src/components/themes/shared/professionStage.tsx` | A recoloured profession stage for worlds that draw none of their own. |

## Colours: one source per world

Each world's `palette.ts` is its only colour source. The world root sets the palette as CSS variables with
`paletteVars`, and its classes read them by name (`bg-[color:var(--tp-night)]`). The registry
`src/themes/themes.ts` imports each world's palette for the menu colours and holds no hex of its own.

## A world's folder

A world is `src/components/themes/<Name>Theme.tsx` plus a `<Name>/` folder holding only that world's look:

- `palette.ts`: its colours.
- its character file (`character.tsx`, `sprite.tsx` or a name of its own): him drawn by this world alone, see
  "His character" below.
- its scenes and their css module: the hero, the profession switch, the contact corner, with its own motion.
- `sections.tsx`, `cards.tsx`, `actions.tsx`, `backdrop.tsx` and similar: its section frames and art.

Sixteen worlds draw their own profession stages and are listed in `WORLDS_WITH_OWN_STAGE`
(`src/components/themes/shared/professionStage.tsx`). Medieval Fantasy is the one world without its own:
the shared `GlobalProfessionStage` draws its stage. Its folder `src/components/themes/MedievalFantasy/` has
no `stages.tsx` or `scenes.tsx`; its scenes are the two zone backdrops, `chaosZone.tsx` (the fel storm, the
meteors and the golem that lands) and `frostZone.tsx` (the blizzard, the frozen throne and the undead horse),
switched on scroll by `backdrop.tsx`. Him in the frost zone is `hero.tsx`; `character.tsx` holds the infernal
golem. Dark Fantasy is the oldest world and keeps its own combat files in
`DarkFantasy/`, with its reveals on the shared `ScrollScene`.

## His character

Each world draws its own character. There is no shared figure component: the old `HeroFigure` and its hands,
headband and level strip were removed. The character is him as a parody of the source game's own hero: the
hero's costume, silhouette, signature weapon, moves and frames, drawn in that game's style and size. Where the
hero shows a face it carries his traits from `HERO_IDENTITY`; a hero who wears a mask keeps the mask. It has an
idle, a walk or run, one action per profession, and a reaction to the visitor. The only thing every world shares
for him is `HERO_IDENTITY`. The bar is Dark Fantasy's `KnightCharacter.tsx` and Medieval Fantasy's
`hero.tsx`.

## Rules every world follows

- His rule: "DUPLICATION APPROACH IS PROHIBITED". One shared piece per concept. A world never copies a
  hook, a scroll scene or a text helper; it imports the shared one and passes its look. Shared means data,
  hooks and helpers only: each world's character, scenes and motion are its own. A helper two worlds need moves to `src/components/scroll/`, `src/components/cv/`, `src/hooks/` or
  `src/components/themes/shared/`.
- No source game characters, mascots, brand or game names, in art, text or file and component names. The
  character is him, with his beard.
- Tailwind classes, not inline styles, wherever Tailwind fits. A CSS variable set from a palette is the
  exception that fits.
- Animate transform and opacity only. No animated shadow or blur.
- Honour reduced motion through `useReducedMotion` (or the shared CSS), never a local media query check.
- Titles stay professional (System Engineer, Musician, Martial Artist). Content comes only from the Decap
  files through `useWorldView`, and every label through `useLabels`. A world may change a label's casing
  (uppercase, lowercase) but never writes its own copy of the text.

## How to add a new world

1. Pick an id and a name. Create `src/components/themes/<Name>/palette.ts` with its colours, the only hex
   for this world.
2. Draw his character in the world's own file, from 10 or more images of the source game's hero, reading
   his traits from `HERO_IDENTITY`. No shared figure.
3. Write the world's scenes (hero, profession switch, contact corner) with their own motion. Add the id to
   `WORLDS_WITH_OWN_STAGE`, or skip that to use the shared `GlobalProfessionStage`.
4. Load the world's lettering through `next/font/google` in `<Name>Theme.tsx`, set its `variable` class on
   the root and read the variable from the world's css.
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
