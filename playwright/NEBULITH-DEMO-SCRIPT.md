# Nebulith demo — beat sheet & script (follows demo-video-playbook.md PART A)

**Format:** tutorial / workshop demo (A6) — teach the viewer to do it themselves. CTA = "try it yourself."
**Hero scenario (A2):** a solo dev builds a small **connected dungeon** from an empty grid — a forest that
leads into a temple, a cave, and a boss room — populates it, gives an NPC a quest, plays a real fight,
and opens the connected map. No engine code.
**Narrator (A3):** first person, warm + clear teacher ("let's build…"). One voice, English.
**Voice (A10):** `en-US-AndrewMultilingualNeural`, rate `+4%`, pitch `+0Hz` (natural, conversational — a
deliberate upgrade from the flat GuyNeural).
**Arc (A4):** promise → generate → populate → the work (quest) → the magic (play/fight) → the system
(connect) → payoff (the map) → CTA.

## Beat sheet (mark → on-screen action → ONE idea → line). Lines are value-first (A5), matched to action length (A9).

| # | mark | on-screen action | line (draft — flex to the recorded action length) |
|---|------|------------------|--------|
| 1 | `welcome` | intro card → empty editor | "Let's build a small game in Nebulith — a connected dungeon you can actually play, with no engine code." |
| 2 | `generate` | pick season+layout → generate a spring forest (Top) | "Start from an empty grid. Pick a season and a layout, and one click lays out a navigable forest — paths, varied trees, a lake." |
| 3 | `populate` | Enemy tool → place enemies; NPC tool → place a giver; Scatter | "Now bring it to life. Drop in a few enemies and a quest-giver — each enemy already comes with stats and a patrol of its own." |
| 4 | `quest` | select NPC → fill quest form → Link quest | "Select the villager and give them a quest — slay three goblins — right here, no scripting." |
| 5 | `play` | switch to ISO/play → attack the adjacent goblin (f) | "Press play and you're in. The same engine that built the room runs it — walk up and fight, with real combat." |
| 6 | `save` | name "Forest" → Save | "Happy with it? Save the room as a template." |
| 7 | `connect` | new template → generate temple → connector → target Forest → Save (then note: repeat for cave + boss) | "Generate a second room — a temple — then drop a doorway that links it back to the forest. Do the same for a cave and a boss room." |
| 8 | `map` | Flow view → the full graph | "Open the map: every room you built, wired together into one connected game." |
| 9 | `closing` | CTA outro card | "From an empty grid to a playable, connected game in minutes. Open the editor and build your own." |

## Golden rules applied (A5)
- One idea per beat; lead with value then mechanism; show-don't-tell (we DO each thing);
  match words to the UI labels (season, layout, Scatter, quest, Flow); quantify ("one click", "three goblins", "in minutes").
- **Sync (A11/B5):** each line must finish on its own screen — the recorder `holdAct(mark)` holds each beat
  for at least that line's spoken length (read from `narration-durations.json`). No line bleeds onto the next screen; no silent gap > 10s (B8).
