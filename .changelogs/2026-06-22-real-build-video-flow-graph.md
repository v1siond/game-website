# 2026-06-22 — real multi-room build video + full Flow graph

- **Flow view shows the WHOLE level graph** (was current-room + 1-hop only): every saved
  template is a node, every connector an arrowed/labelled edge, current room glows gold.
  Shared layout for render + click hit-testing. `FlowViewOverlay` rewrite.
- **Real-build demo** (`playwright/tours/nebulith-build.spec.js`): drives the ACTUAL editor
  to make a connected game — generate each room → place entities → connector mode → wire a
  connector to a previously SAVED template (picked from the DB dropdown) → save to DB →
  repeat (Forest→Temple→Cave→Boss) → Flow view shows all four linked. Clears stale
  templates first so the graph is clean. Records to recordings/demo-nebulith-build.mp4.
- playwright.config: actionTimeout so a missing locator fails fast (not a 30-min hang).
