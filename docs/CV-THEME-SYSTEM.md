# CV theme system

The site shows Alexander's CV inside one of 18 game styled worlds, or as a plain page at `/cv`. Every world
reads the same CV content (Decap files in `content/cv/`) and the same shared scroll, hero and text pieces; a
world only adds its own look: its palette, its art and its scenes. The default world is Era Postcards.

## How a visitor gets a world

- The homepage renders the world picked in the worlds menu, remembered in localStorage under
  `portfolio-theme`. With nothing stored, the default `era-postcards` opens (`DEFAULT_THEME_ID` in
  `src/themes/themes.ts`). `?capture=<id>` forces a world for the preview screenshot script.
- The server always renders the default world, in full: its hero, sections and every CV string are in the
  HTML a fresh visitor and every crawler get, and the hub's picture (the hero stage) shows its first frame
  through CSS. Only its scroll engine starts on the client, in a layout effect, so the first paint already
  shows the stages where the scroll is; under reduced motion each section carries its own picture, still.
  The default world must never sit behind a whole page mounted gate
  (most other worlds have one, so a world becomes the default only after that gate is moved to its
  decoration), and SVG trig values go through
  `svgNumber` (`src/components/themes/shared/svgNumber.ts`) so the server and the browser print the same
  numbers.
- A returning visitor with another world stored: an inline script in `src/app/(site)/page.tsx`
  (`src/themes/worldPending.ts`) sets `data-world-pending` on `<html>` before the world markup is parsed,
  `globals.css` hides `[data-world-root]` under it, and `ThemeProvider` removes it once the stored world
  has rendered. The default never flashes for them, and the server HTML stays what a fresh visitor sees.
- `?profession=<id>` opens a profession directly (`engineer`, `drummer`, `fighter`). With none, the world
  opens on the engineer.
- `/cv` is the plain CV in English, Spanish or Italian, with a PDF download.

## The 18 worlds

Era Postcards (default), Dark Fantasy, Survival Horror, Neon Portals, Soul Map, Adventure Paths, Rubber Hose, Retro RPG,
Bold Noir, Fighter Select, Art Deco, Retro Atomic, Neon Cyber, Cell Shaded, Silhouette, Mythic, Tropical
Platformer, Medieval Fantasy. The worlds menu groups them in five categories: Fantasy, Retro, Neon, Action,
Artistic.

## The worlds launcher and its hint

- `WorldsLauncher` (`src/components/worlds/`) sits top right on every page, the homepage and `/cv`, and names
  itself with the count from the registry: "18 worlds" (stacked "18" over "worlds" under 640 px, so it
  clears a world's own top bar; Dark Fantasy keeps 64 px and 144 px free for it). It opens `WorldsModal`.
- Its colours come from the current world's palette through `launcherColors` (`src/lib/worlds/nudge.ts`):
  the fill is the world's background, the label the first of accent, highlight and text that reads at 7 to
  1 on it, and a black or white outer hairline keeps the button 3 to 1 apart from any page behind it.
  `src/styles/components/worlds-nudge.css` paints from the `--wl-*` properties the component sets.
- `WorldsHint` is a one time card under the launcher that names the next world in the tour: "Next world:
  <name>", the current world and how many the visitor has seen, "Enter <name>" (through the portal) and "All
  worlds". `useWorldsNudge` (`src/hooks/`) offers it once per visit (sessionStorage
  `portfolio-worlds-hint-offered`), only after `HINT_MIN_MS` (20000, 20 s) and one scrolled screen, never to
  a visitor who opened the picker or has seen two worlds. A page too short to scroll a screen (shorter than
  two screens) counts as scrolled once `HINT_MIN_MS` has passed, so the hint can still offer itself on
  `/blog`. It never offers itself on the CV pages, `/cv`, `/es/cv` and `/it/cv` (`hintBelongsOn` reads them
  from `CV_PATHS` in `src/i18n/config`). It then waits, rendered hidden and inert so its real box can be
  measured, and opens only where that box covers no text and no control (`coversNothing`); if no such place
  comes before the end of the page it stays closed that visit. Each measure runs only after the reveals
  running then have ended, held at most `SETTLE_CAP_MS` (1000, 1 s) so a long reveal cannot stall it, and
  text still waiting for its reveal (at opacity 0) counts as covered. Text kept for screen readers only
  (`isVisuallyHidden`) is never drawn and does not count. Once open, the
  card checks itself every frame for `HINT_WATCH_MS` (3000, 3 s) and closes for the visit if text or a
  control slides or fades in under it (`hintWatch`). Its top is fixed under the launcher's tallest face, the
  turned one: `--wl-hint-top` in `worlds-nudge.css` is the launcher's bottom (`--wl-launcher-bottom`, 70 px
  from 640 px up and 60 px below, from the same top, padding and portrait size the launcher reads) plus a
  12 px gap and the 8 px it slides in from, so 90 px and 80 px, and its covered check does not count the
  launcher, so a face turning while the card is open never closes it. It never takes focus and closes on its
  x, Escape or a tap outside.
- The next world is `nextInTour` (`src/lib/worlds/nudge.ts`): the first world of `TOUR_ORDER` that is not
  seen and not the current one, so a first visitor in the default world is offered Medieval Fantasy. With
  every world seen it offers the one after the current world.
- Seen worlds are kept in localStorage under `portfolio-worlds-seen` and this visit's in sessionStorage
  under `portfolio-worlds-visit` (a world counts after 1.5 s on screen).
- The picker (`WorldsModal`) remembers them: "You have seen n of 18 worlds" over 18 dots (at 1 the singular label `pickerProgressOne`, and the hint's
  count likewise `hintBodyOne`, picked by `countTemplate`), then the worlds in
  `orderForPicker` order: the next unseen world first as the wide up next card (`WorldCard`), then the
  other unseen worlds, the seen ones in grey and the current one, "You are here". On open the focus goes
  to the up next "Enter <name>" button, Tab stays inside, and on close it goes back to the control that
  opened it (the opener is held in `WorldTransitionContext`). It paints from the same `--wl-*` properties.
- Focus rings: the launcher sets `--focus-ring` to the fill and `--focus-halo` to the black or white edge,
  so ring or halo reads 3 to 1 or more on any page behind it; the hint and picker set the halo to the label
  colour, 7 to 1 or more on their own fill.
- The wardrobe (`src/components/worlds/Wardrobe.tsx`, `src/styles/components/wardrobe.css`): in every hero his
  figure wears a name plate in that world's idiom naming the outfit he wears (the world), 14 px or more, with
  a previous and a next arrow of 44 by 44 px or more. Next, a swipe across him to the left or ArrowRight on the
  plate go to the next world through the portal; previous, a swipe to the right or ArrowLeft to the one
  before. Both step around `TOUR_ORDER` in a circle (`followingInTour` and `previousInTour` in
  `src/lib/worlds/nudge.ts`), so previous then next comes back. On the first visit (sessionStorage
  `portfolio-worlds-wardrobe-fan`) his previous and next outfits, each his full figure in that world, fan out
  of the plate for `WARDROBE_FAN_MS` (2750, 2.75 s) and settle back; never under reduced motion. Dark Fantasy
  and Medieval Fantasy get the plate beside the figure and keep their own look. Each hero marks
  his figure `data-worlds-figure` (the capture crops it) and its hero section `data-worlds-hero` (the
  launcher watches it).
- The launcher's face (`useWorldsNudge`, `launcherFace` in `src/lib/worlds/lens.ts`): while the hero is in
  view it reads "18 worlds". Once the `data-worlds-hero` element has left the screen (an
  IntersectionObserver; a page with none, such as the blog, counts as scrolled 1.5 s after it opened, so a
  world still loading its chunk does not) the face shows him in the `nextInTour` world, the world the hint
  names, with that world's name, and the button's name becomes "Next world: <name>. Open all 18 worlds". The
  first time in a visit (sessionStorage `portfolio-worlds-face-turned`) it turns over in `FACE_TURN_MS` (2600,
  2.6 s: 0.3 s over, 2 s lifted, 0.3 s settled), rotateX, scale and opacity only; on a phone, where the button
  holds only the portrait, a 172 px face with the name grows left from it for those 2.6 s and folds back.
  Under reduced motion it swaps with no turn. Back at the hero it reads "18 worlds" again with no
  animation. The first turn waits while the hint card is open, so the two never meet. A click or a tap
  still opens the picker.
- The lens (`src/components/worlds/WorldLens.tsx`): a mouse over the launcher, the keyboard's focus on it, or
  a press held 0.45 s on a touch screen opens a round lens under it onto a still of the next world's hero,
  centred on his figure, with the world's name inside its lower edge in the launcher's colours (15 px). Under
  the name a second line says what to do, 14 px in the launcher's body colour: "Click to go" (`lensClick`)
  under the mouse and "Let go, then tap Go" (`lensHold`) while a finger holds it. A click inside the lens
  goes there through the portal. The keyboard gets a "Go to <name>" button, the next Tab stop after the
  launcher, and so does a finger once it lifts; the button takes the second line's place, and a tap
  elsewhere closes it. The lens's top is `--wl-lens-top` in `worlds-nudge.css`: the launcher's bottom
  (`--wl-launcher-bottom`) plus 6 px under 640 px and 2 px from 640 px up, so 66 px and 72 px. Escape closes
  it and leaves the focus on the launcher; the mouse leaving the launcher and the lens closes it too. Enter
  on the launcher opens the picker as before. The lens fades and grows in for 0.18 s (no growth under
  reduced motion). It reads the 1440 still on a screen 640 px wide or more and the 390 one below. The still
  and `focus.json` load on the first opening only, never with the page.
- Neither the face nor the lens ever shows on the CV pages (`hintBelongsOn`): there the launcher reads "18
  worlds" and opens the picker, nothing else.
- The previews in `public/world-previews/`, all made by `node scripts/capture-world-previews.mjs [base]`
  (default `http://localhost:4100`, the site running; `npm run capture:previews`) with the project's
  Playwright, one fresh page per world and width with the launcher hidden: `<id>.webp` the picker card
  (`WorldCard`, 1280 by 800 resized to 720 wide), `<id>-1440.webp` and `<id>-390.webp` the lens stills (1440
  by 900 and 390 by 844), `portraits/<id>.webp` his figure (the `data-worlds-figure` box at 1440, 160 px at
  most, drawn alone on a transparent ground; a figure that shows only further down, Dark Fantasy's knights
  or Medieval Fantasy's frost figure, is scrolled to first), and `focus.json`, the centre of that figure in
  each still, where the lens looks. Every lens still shows him drawn: at first paint when he is drawn there,
  else where the capture's scroll first finds him drawn (Dark Fantasy's knight shows only while Work
  Experience is in view, Medieval Fantasy's frost figure fades in as the page scrolls, Survival Horror's panel
  covers him on the first screen). Below opacity 1 the capture then scrolls on half a screen at a time
  while his settled opacity keeps rising, and takes the still where it was highest and he still shows
  (Medieval Fantasy's frost figure brightens with the scroll; Dark Fantasy's knight rests at 0.7 and stays
  where he was found). A width that lays out no figure at all (Rubber Hose at 390) is shot at the
  top, with the lens on the middle of the hero's upper part; a figure laid out but never drawn makes the
  capture name the world, write no stamp and exit 1. Drawn, for every world, the portrait and `focus.json`
  alike, means his opacity is settled (the same on two reads 0.6 s apart, nothing running on him or around
  him) and above 0, and at least 30% of his own pixels (those he paints drawn alone) change when he alone is
  hidden, so a figure fading in or painted under a panel is not drawn. The worlds hint is hidden in every
  shot like the launcher.
  Once every world's shots are written it writes `stamp.json`, per world a sha256 of its hero
  sources; a run that exits 1 leaves it as it was. It refuses to start while another headless Chromium
  runs, closes its own, and exits 1 naming any world with no figure to crop. It takes about 6 minutes for
  the 18 worlds.
- Refresh them after changing a hero: run the capture and commit the previews and `stamp.json` with the
  hero. `node scripts/check-world-previews.mjs` (`npm run check:previews`, run as `prebuild`) hashes each
  world's hero sources again (everything under `src/components/themes/<World>/`, its `<World>Theme.tsx` and
  module CSS, `src/styles/themes/<id>.css`, and the files every hero shares: `Wardrobe.tsx`,
  `wardrobe.css` and `content/cv/labels.json`, whose plate words show in every still) and compares them with the stamp the capture wrote, by
  content: it fails the build and names the world whose hash is missing or differs, or that has no
  `<id>-1440.webp` still. It reads files only, so any clone or copy (Netlify) reads the same, and it never
  launches a browser.
- Every launcher, hint and picker word is Site text in Decap (`content/cv/labels.json` `labels.worlds`, in
  English, Spanish and Italian). `RootShell` reads it with `getLabels` (`src/lib/cv-data.ts`) on the server
  and hands it down through `WorldsLabelsProvider` (`src/components/worlds/WorldsLabels.tsx`), since the
  launcher renders above the CV data provider.

## Where the CV content comes from

- The content is Decap CMS files, `content/cv/*.json` (summary, contact, experience, projects, bands,
  martial-arts, tech-stack, services, companies, roles), each holding `en`, `es` and `it`. He edits them at `/admin`.
- One loader, `getAllCVData(locale)` in `src/lib/cv-data.ts`, reads the files on each render, so an edit
  shows without a code change. A key missing in a locale keeps the English value.
- Interface text (section titles, buttons, accessible names, "Released", "Since {year}") lives in
  `content/cv/labels.json` ("Site text" at `/admin`), never in a component. The same loader reads it, and a
  component reads it with `useLabels()` from `CVDataProvider`: `const { sections } = useLabels()`, then
  `title={sections.about}`. A `{slot}` is filled with `fillLabel` from `src/lib/cv/labels.ts`. A key missing
  in es or it keeps the English text. There is no next-intl and no `messages/` folder; the locale comes from
  the CV's address, /cv English, /es/cv and /it/cv (`src/app/(cv)`); `src/middleware.ts` sends /cv to the
  cookie's or Accept-Language's locale.
- No other source exists: no hand written data folder and no API. nebulith is not this site's backend.
- `node scripts/check-cv-text.mjs` fails when an English string no longer matches the job history it was
  copied from, or a project fact has no commit behind it.

## What each profession shows

There are three professions: System Engineer (`engineer`, the default), Musician (`drummer`) and Martial
Artist (`fighter`), listed in `src/lib/cv/professions.ts`.

`viewFor(cv, profession, mode, year)` in `src/lib/cv/cvView.ts` builds what a world renders:

| Profession | Sections it gets |
|------------|------------------|
| engineer | jobs, projects, tech stack, services, companies |
| drummer | the musician block and every band |
| fighter | the Muay Thai record |

In a world (`mode: 'world'`) jobs and projects are cut to the last 5 years (`RECENT_WORK_YEARS`) counted back
from `year`, plus any current entry and any entry with the `highlight` toggle on. Bands and the martial arts
record are always whole. `/cv` reads the full CV on the server and shows everything. A world reads
`WorldCV` (`worldCV` in `src/lib/cv/content.ts`: the CV without what only `/cv` prints) through
`useCVData()`, and its view through `useWorldView()`, both from `src/components/cv/CVDataProvider.tsx`,
which runs `viewFor` once for the picked profession and the year from `useYearNow`. `ProfessionSectionsView`
picks the world's section component for the shown profession from the world's map.

The ventures (`companies`) come in one order everywhere: `venturesFor` in `cvView.ts` puts his own products
first (the `featured` toggle in companies.json, Nebulith and Sillabo), then the rest, each group in file
order. `/cv` calls the same helper; no world sorts on its own. A featured venture carries the badge
`labels.cards.ownProduct` ("My product") and reads larger in each world's own card parts: two wide cards
over a row of three in the grid worlds (`grid-cols-6`, `col-span-3` and `col-span-2`), the full width
slabs above the columns in the masonry worlds (Soul Map, Survival Horror), the first banners with a larger
medal in Art Deco.

## The shared pieces every world uses

| Piece | File | What it does |
|-------|------|--------------|
| ScrollScene, FadeInScene | `src/components/scroll/ScrollScene.tsx` | A section whose scene follows scroll: writes `--scene-progress` (0 to 1) so children animate with classes, no React re-render. FadeInScene is the plain fade block between levels. |
| HERO_IDENTITY | `src/lib/cv/heroIdentity.ts` | The only shared part of his character: skin, short dark hair, full dark beard, oval eyes. Each world maps these into its own palette. |
| sectionText | `src/lib/cv/sectionText.ts` | Shared text: project links, year spans, job years, `jobSpan` ("2019 to 2022") and `jobSpanCompact` ("2019 - 2022"), a link's address as it reads (`shownUrl`, no scheme or trailing slash), Muay Thai facts, heading ids. |
| jobCard, projectCard, ventureCard, aboutBlock | `src/lib/cv/cvView.ts` | The card view models: every field of a job, project, venture or the About block whole, with its strings formatted, so each world renders the same content in its own look. |
| VentureList | `src/components/cv/VentureList.tsx` | The ventures without a look, in `viewFor`'s order, each with its link props (address, new tab, rel) and `nameFor(word)` for a link that reads a word ("Website of Lumi"). A link that wraps the card or reads the venture's name carries no `aria-label`: it is named by its own text plus `newTabHint` in an sr-only span. A featured venture's item takes `featuredItemClassName` in place of `itemClassName`, so it carries one column span. |
| TechList | `src/components/cv/TechList.tsx` | The tech stack without a look: one masonry item per category with its heading, icon and named list; the world passes its classes and draws each technology with `renderItem`, and may time each category with `categoryStyle(index)`, CSS variables only, which the list writes through `cssVars`. |
| MarkedLines | `src/components/cv/MarkedLines.tsx` | A job's highlights, a project's details and the About highlights without a look: nothing when the list is empty, one named list (`cards.keyAchievements` or `cards.details`), each line behind the world's marker. The world passes a `MarkedLinesLook` (list, line and text classes, its marker, a heading class when it titles the list with the label) and may add a class, a CSS variable or a data flag per line with `lineProps(index)` (Retro RPG's spoken delay). All 18 worlds use it; a world never maps a highlight or detail list itself. |
| useAboutBlock, AboutFacts, aboutFacts | `src/components/cv/AboutFacts.tsx`, `src/lib/cv/cvView.ts` | The About block every About frame reads: `useAboutBlock()` gives the bio, the summary highlights and the facts, his education then his languages, each under its `labels.about` label, one Decap stores empty left out (`aboutFacts`). `AboutFacts` draws the facts as one description list in the world's `AboutFactsLook` (list, fact, term and value classes, and `termEnd: ': '` for a world that runs the value on after its label). Adventure Paths, Art Deco, Bold Noir, Cell Shaded, Dark Fantasy, Fighter Select, Medieval Fantasy, Mythic, Neon Portals, Retro Atomic, Retro RPG, Rubber Hose, Silhouette, Soul Map, Survival Horror and Tropical Platformer draw their facts with it; Neon Cyber reads the facts for its scan tags. A world never reads `professionalSummary` for its About frame or writes an education or languages label itself. |
| ImpactLabel | `src/components/cv/ImpactLabel.tsx` | The "Impact: " a screen reader hears before a project's impact line where the card shows the impact with no visible label (`cards.impact`, kept for screen readers only). Adventure Paths, Bold Noir, Cell Shaded, Dark Fantasy, Fighter Select, Medieval Fantasy, Mythic, Neon Cyber, Retro Atomic, Retro RPG, Rubber Hose, Silhouette, Soul Map and Survival Horror put it first in their impact line; Art Deco, Neon Portals and Tropical Platformer show the label. A world never types the hidden impact label itself. |
| TagList | `src/components/cv/TagList.tsx` | A card's tags without a look: a job's skills (`cards.skillsUsed`), a project's technologies (`cards.technologiesUsed`), a venture's services (`sections.services`), every one, nothing when the list is empty, the list named by its label. The world passes a `TagListLook` (list and tag classes, and a marker for a world whose tags carry one, Adventure Paths' coin). All 18 worlds use it; a world never maps a skill, technology or service tag list itself. |
| ContactLink, useSiteLinks, siteLinks | `src/components/cv/SiteLinks.tsx`, `src/lib/cv/siteLinks.ts` | The contact links without a look: the hero's email and LinkedIn slots and the CV and engine slots. `useSiteLinks(word)` gives the CV link (`/cv`) and the engine link (new tab, an accessible name that holds the visible word); the world picks the engine word (`engine`, `engineShort`, `portfolio`, `play`, `enter`) and passes `ContactLink` its class per link id. |
| sectionViews, SectionFrames, sectionPlan | `src/components/cv/SectionPlanView.tsx`, `src/lib/cv/sectionPlan.ts` | The section plan: `sectionPlan` decides which sections a profession shows and in which order (about, work, tech, services, projects, ventures for the engineer, each left out when empty; bands; Muay Thai). A world writes one frame per section id and exports `SECTION_VIEWS = sectionViews(FRAMES)` for `ProfessionSectionsView`. |
| RecruiterHero, ProfessionSwitch, ProfessionSectionsView | `src/components/cv/` | The hero, the profession switch, the per profession dispatch. |
| useReducedMotion, useScrollScene, useSectionTrigger, useZoneStage, useYearNow | `src/hooks/` | The one reduced motion check, the scroll progress, the one shot reveal trigger, the zone in view handed to a page whose backdrop follows it, the year a footer prints (the server's until hydration, then the visitor's, in UTC). The zone lives in a store outside React state: the page makes it with `useZoneStore`, the backdrop that draws the zone reads it with `useStoreValue`, and a root that only needs `data-zone` writes it with `useZoneAttribute`, so a zone crossing re-renders nothing else. |
| useScrollStage, stage math | `src/hooks/useScrollStage.ts`, `src/lib/scroll/stage.ts` | The scroll stage engine: full screen stages that rise from dark, hold while their section's text scrolls over them and sink again, every value a function of the scroll so they play backwards on the way up. One passive scroll listener and one requestAnimationFrame loop that runs only while the drawn position settles towards the scroll (`SETTLE_TAU_MS`, 100 ms: within a few pixels half a second after the scroll stops) and stops at rest; `measure` reads the layout on mount, resize and font load, `draw(position, lag)` only writes transforms and opacity. The math (`stageState`, `heroState`, `itemsReached`, `settleStep`, `jumpStart`, `HANDOVER`) is pure and tested. Era Postcards runs on it. |
| everySection | `src/lib/cv/sectionPlan.ts` | Every profession's sections on one page, each profession's world view of the year, in reading order (engineer, musician, martial artist), for a world that shows all three at once (Era Postcards). |
| useOnChange | `src/hooks/` | A call on each change of a value after the first render, before or after paint. |
| useLatest | `src/hooks/useLatest.ts` | The latest value of a render held in a ref, which a layout effect writes (never the render itself), so a callback, timer, observer or effect reads the newest one without rerunning when it changes. Next 15's own React has no useEffectEvent, so this is the pattern it stands for. `useSectionTrigger`, `useOnChange`, the Adventure Paths hero, the Mythic sprite and turn queue and the Fighter Select bout read their callbacks through it. A component that needs the latest callback calls `useLatest`; it never writes its own ref and layout effect. |
| usePointerVars | `src/hooks/usePointerVars.ts` | The one pointer follower: it writes `--mx` and `--my` (-1 to 1 from the viewport centre) on the element its ref is set on, from one passive listener and at most one write a frame, while `enabled` is true. `mouseOnly: true` follows a mouse only, so a finger or a pen dragging across a tablet leaves the vars where they are (Dark Fantasy's interactive layer). Most worlds use it for their parallax; each passes `!reducedMotion` and decides its motion from the vars in CSS. |
| ProfessionRegion | `src/components/cv/ProfessionRegion.tsx` | The shown profession's sections as one labelled region ("System Engineer details", from `navigation.professionDetails`), so a screen reader's landmark list reads the same in every world. Adventure Paths, Art Deco, Bold Noir, Cell Shaded, Dark Fantasy, Fighter Select, Medieval Fantasy, Mythic, Neon Cyber, Neon Portals, Retro Atomic, Retro RPG, Rubber Hose, Silhouette, Soul Map, Survival Horror and Tropical Platformer wrap their sections in it, each with its own class or none. A world names its profession sections through it and never builds that label itself. |
| turnAbout | `src/lib/motion/turnAbout.ts` | A point turned by some degrees about a pivot, y down, so a positive turn is clockwise on screen: the step a jointed figure takes to find where a hand or an elbow ends up. Mythic's rig and Survival Horror's gait and survivor use it. A world with a jointed figure turns its points with it and keeps no rotation math of its own. |
| nextIn | `src/lib/nextIn.ts` | The item after the last one in a list, wrapping round, and the first when nothing came before: the way a combo or a strike order cycles. Mythic's fates and Fighter Select's moves use it. A cycle through a list reads its next item from here. |
| mix | `src/lib/color.ts` | One colour moved toward another by a share from 0 to 1, each channel rounded on its own, as `#rrggbb`. The shared profession stage mixes its palette with it and Tropical Platformer shades its character with it. A colour a world derives in code comes from `mix`, never from a local copy. |
| cssVars | `src/lib/cssVars.ts` | CSS custom properties for an element's `style`, the one inline style the site writes, with the one cast to `CSSProperties`. |
| InView, heldUntil | `src/components/themes/shared/held.tsx` | The one wait for a section: every animation on an element and inside it holds on its first frame (an important pause, so no world rule can set it running) until the flag turns true, then plays from its start. `InView` is a block with its own section trigger (`threshold`, 0.15 when left out); `heldUntil(flag)` is the class for a scene whose wait reads a flag of its own (a zone stage's `on`, a boot, a phase, the zone on show). A scene that waits for its section uses one of these two; a world never writes its own `:not([data-on]) *` pause or cue wrapper. |
| PixelRuns | `src/components/themes/shared/PixelRuns.tsx` | A pixel sprite's runs (`src/lib/pixelRuns.ts`) drawn as 1 px tall rects, coloured by key; the world wraps them in its own svg. |
| staggerAt | `src/components/themes/shared/stagger.ts` | The stagger class of the item at an index (`[--i:0]` to `[--i:7]`), which a world's keyframes turn into a delay. |
| SkipLink | `src/components/themes/shared/SkipLink.tsx` | The first Tab stop of a world, "Skip to content" (`navigation.skipToContent`), to the `main-content` main every world root marks. It wears the shared `skip-link` look (globals.css); Adventure Paths, Retro RPG and Rubber Hose pass their own focused look as `className`. A world never writes its own skip link. |
| CopyrightLine | `src/components/themes/shared/CopyrightLine.tsx` | The footer's copyright line: the sign, the year from `useYearNow` and his name; the world keeps its own footer around it. |
| paletteVars | `src/components/themes/shared/paletteVars.ts` | Turns a palette into CSS variables (`paletteVars('tp', { leafDark })` sets `--tp-leaf-dark`). |
| GlobalProfessionStage, ProfessionStage | `src/components/themes/shared/professionStage.tsx`, `src/components/themes/shared/professionStage.module.css` | A recoloured profession stage for worlds that draw none of their own. `ClientProviders` loads the global stage in its own chunk for the one world that uses the shared set (`SHARED_STAGE_WORLD_ID`, Medieval Fantasy), and Dark Fantasy draws `ProfessionStage` with its own palette. The module CSS holds the stage's idle loops (notes, thumps, bag swings), GPU only, each started at its `--stage-delay` so the loops of one kind run out of step, and hides the layer below 1024px where the gutters are gone. A world that draws this stage takes its motion from this file and never copies the keyframes. |

## The blog and a world's posts section

The posts are Markdown files in `content/blog/<slug>.md`, written in Decap (collection `blog`, a JSON front
matter block and the body) with their images in `public/blog/<slug>/`. `src/lib/blog/posts.ts` is the one
loader: `listPosts`, `getPost` and `latestPosts` read the folder, newest first, and show drafts only when
`NODE_ENV` is `development`. The pages are `/blog` and `/blog/<slug>` in `src/app/(blog)/`, built
statically, the body rendered to HTML at build time by `src/lib/blog/markdown.ts` (raw HTML in a post is
dropped) and styled by `src/styles/blog.css`. Any other `/blog/<slug>` shows the blog's own 404
(`src/app/(blog)/not-found.tsx`).

The home page reads the newest 3 posts and hands them to `BlogProvider` (`src/components/blog/`). A world
reads them with `usePosts()` and turns them into links with `postLinks` (`src/lib/blog/links.ts`), which
returns null when there is no post. `PostsGate` (`src/components/cv/PostsGate.tsx`) uses the same rule, so a
world wraps its posts section in it and the section disappears with 0 posts; a world never counts posts
or builds a `/blog` address itself.

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
- A front facing figure walks by shortening the stepping leg (scaleY from the hip) with the opposite arm,
  never by rotating the legs past each other; a second limb pair plays the same keyframes in the same
  direction with a delay of one iteration, never alternate-reverse.
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
5. Write `sections.tsx`: one frame per section id and `SECTION_VIEWS = sectionViews(FRAMES)` for
   `ProfessionSectionsView`, text from `sectionText.ts`, wrapped in `ScrollScene` or `FadeInScene`.
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
