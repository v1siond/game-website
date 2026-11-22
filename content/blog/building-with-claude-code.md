{
  "title": "Building with Claude Code: a game engine in 3,703 commits",
  "slug": "building-with-claude-code",
  "date": "2026-11-21",
  "description": "The real numbers of building my game engine Nebulith with Claude Code: commits per month, the gaps, 25 reverts, the hard weeks and what shipped.",
  "keyword": "building with claude code",
  "cover": "/blog/building-with-claude-code/commits-per-month.png",
  "coverAlt": "Bar chart of Nebulith commits per month in 2026: 5, 243, 442, none in August, 526, 774 and 1,713, with reverts per month below",
  "tags": [
    "building with claude code",
    "solo developer success stories",
    "game engine built with ai"
  ],
  "draft": true
}
From 2026-05-24 to 2026-11-13 Nebulith, my game engine and map editor, got 3,703 commits, every one of them made in a Claude Code session that I directed. That is 5 commits in May, none in August, 1,713 in the first 13 days of November, and 25 reverts along the way. Here are the numbers month by month, the gaps, what got thrown away and what shipped.

![Bar chart of Nebulith commits per month in 2026: 5, 243, 442, none in August, 526, 774 and 1,713, with reverts per month below](/blog/building-with-claude-code/commits-per-month.png)

*Commits per month on the staging branch. November stops at the 13th.*

## Where it started: a randomizer inside my CV

The first commit, `4fe61c70` on 2026-05-24, is a template editor with a randomizer and isometric rendering. It lived inside the repo of my CV site and stayed there for four months, and only on 2026-09-18 did the engine move to its own repo with Phoenix serving the React app (`49f0ecf5`). Its whole history came along, so every count below is one branch of one repo.

## The numbers, month by month

The chart comes from one line of git, which you can run on any repo of yours.

Output of the count per month, run on 2026-11-21:

```text
$ git log staging --format=%ad --date=format:%Y-%m | sort | uniq -c
      5 2026-05
    243 2026-06
    442 2026-07
    526 2026-09
    774 2026-10
   1713 2026-11
```

There were commits on 76 days. The busiest was 2026-11-05 with 333, then 2026-10-21 with 264.

Every one of those commits carries my name. Claude Code sessions wrote the code and the commits; I decide what gets built, read what comes back, test it in the browser and say what is wrong.

## The gaps

Three stretches have no commits at all:

- 23 days, from 05-29 to 06-21, between the first editor and the RPG engine;
- 44 days, from 07-27 to 09-09, all of August, in every repo of the project;
- 19 days, from 09-25 to 10-14, when the work moved to a laptop and the ticket doc was lost in the handoff. The first commit after it, `1e177ef2`, is the first commit of a rebuilt plan, phase A.

So the 3,703 commits sit on 76 days out of the 174 between the first and the last.

## What got thrown away

Output of the revert count:

```text
$ git log staging --format=%s | grep -ci "^revert"
25
```

The messiest day was 2026-06-24. Five ways of drawing the isometric buildings went in and out that day: cubes, billboards, boxes, tiles and voxel houses, with reverts of reverts in between. On 06-25 all five were discarded in one commit (`29e39ee2`) back to the known good state of `aa8a34f`. The real cause turned up a commit later (`a44b8d0a`): building cells lost their label in `placeAsset`, so every cell fell through to the voxel house renderer.

On 06-23, the day before the messiest day, I started a prompt log with one rule at the top: write down every prompt, validate a solution before calling it done, and work surgically. That log is 3,931 lines today, and it is where most of the June and July story is kept.

Two more from September:

- On 09-13 the agent had added exit gates to the generator that I never asked for, while the meadow already had the entrance I had approved. Its own revert message reads "remove the exit gates I invented" (`ba4c7ccc`).
- On 09-15 a rewrite of the forest entrance went back out, keeping only the canopy art (`f9abb657`).

## What shipped, phase by phase

| Dates | What landed | Commit |
|---|---|---|
| 05-24 | template editor with a randomizer and an iso view | `4fe61c70` |
| 06-21 to 06-30 | RPG engine: combat, quests, inventory, a two sidebar editor | `b6f8cb8d` |
| 06-30 | one art style model that draws a map as ASCII or emoji | `5e8844b6` |
| 07-02 to 07-14 | a Phoenix and Ecto backend, Prisma removed, tile data in tables | `c0c82a37`, `b8f0ae11`, `0282ecb5` |
| 09-18 to 09-20 | its own repo, a Railway deploy that booted, CI on every push | `49f0ecf5`, `5d35a6af`, `8d47c1e5` |
| 10-16 to 10-19 | terrain from formulas, tileset pack imports, every unit animation | `ff5e4aa4`, `381af29c` |
| 10-21 | the server decides every result of play; a dungeon generator | `032ae2ca`, `d3a8e376` |

## Why November is taller than the rest

November has 1,713 commits in 13 days. From 11-05 on, commits name the ticket they serve, like `fix(#250.11)`: 810 of them, across 118 tickets from #14 to #253. By type, November is 566 fixes, 257 performance changes and 240 features, and the rest are tests, docs and plain sentence subjects.

That is the month the agent workflow in [my Claude Code skills](/blog/claude-code-skills) ran the work: a director agent sizes each ticket and other agents build, test and review it. The commits also got smaller than in the autumn before it: the median commit changed 152 lines in September, 95 in October and 70 in November. June and July sat at 83 and 84, so September was the peak and November the low, and part of the taller bar is smaller commits.

## Where it stands

Nebulith runs on Railway at [nebulith-production.up.railway.app](https://nebulith-production.up.railway.app), on Phoenix, LiveView, Ecto and React. My CV lists it as my own game engine and map editor, launching soon. The Nebulith series goes back to the start, one phase at a time, beginning with the randomizer inside my CV.
