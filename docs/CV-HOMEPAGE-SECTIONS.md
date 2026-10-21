# CV homepage sections

Every world shows the same page in the same order: his hero, the profession switch, then the sections of the
picked profession, then a contact corner. What the sections hold comes from `viewFor` in
`src/lib/cv/cvView.ts`; how they look is the world's own. The theme system around this is in
[`CV-THEME-SYSTEM.md`](CV-THEME-SYSTEM.md).

## The page, top to bottom

1. **Hero** (`RecruiterHero`, `src/components/cv/RecruiterHero.tsx`): his name, the headline and tagline from
   the summary file, his contact line, and the email and LinkedIn actions. The world adds its links to `/cv`
   and to the engine.
2. **Profession switch** (`ProfessionSwitch`, `src/components/cv/ProfessionSwitch.tsx`): Musician, System
   Engineer, Martial Artist, in that order, the engineer in the centre and opened by default.
3. **Profession sections** (`ProfessionSectionsView`, `src/components/cv/ProfessionSectionsView.tsx`): the
   world's component for the shown profession, from its `SECTION_VIEWS` map in `<Name>/sections.tsx`.
4. **Contact**: the world's closing corner, drawn in its own folder.

## Sections per profession

| Profession | Sections, in the order worlds show them | Data from `viewFor` |
|------------|------------------------------------------|---------------------|
| System Engineer | About, Work Experience, Tech Stack, Projects, Ventures | `jobs`, `projects`, `techStack`, `companies` |
| Musician | Bands, opened by how long he has played drums | `musician`, `bands` |
| Martial Artist | Muay Thai record: primary title, training, background | `martialArts` |

The titles a world prints may wear its look, but stay plain and professional. Section text that every world
formats the same way (year spans, job years, project links, the Muay Thai facts, heading ids) comes from
`src/components/cv/sectionText.ts`.

## What is cut in a world

- Jobs and projects older than 5 years are left out, unless current or marked `highlight` in Decap.
- A project with no years recorded is kept.
- Jobs sort newest first; projects keep the order he set in Decap.
- Bands and the Muay Thai record are always shown whole.
- `/cv` shows everything, in English, Spanish or Italian.

## How a section moves

Each world moves its sections with its own scenes on the shared `useScrollScene` and `useSectionTrigger`;
plain blocks between levels (About, Tech Stack, Ventures) sit in `FadeInScene`. Both read
`--scene-progress` and animate transform and opacity only. With reduced motion (or in a World Select preview) every scene starts done, so each section shows in place.

## How this was worked out

Read from the code on 2026-10-21: `src/lib/cv/cvView.ts`, `src/lib/cv/professions.ts`,
`src/components/cv/`, `src/components/scroll/`, and `TropicalPlatformerTheme.tsx` with its
`TropicalPlatformer/sections.tsx` as the example world. This file replaces an older plan that listed
sections the site never built (blog, gallery, certificates, store, testimonials).
