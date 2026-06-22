# 2026-06-22 — attack animations + collision-paint tool

- **attack animations** (`engine/attackAnimations.ts`, 8 tests): slash (sword/axe), shot
  (ranged, travels from→to), lightning (staff), block. The play loop spawns one on a
  landed hit (kind from the weapon, or 'block' when the defender blocks) and renders it
  in iso space; finished anims are pruned each frame.
- **collision-paint tool**: a "Collision" entity tool — click a cell in Top view to
  toggle it blocked/walkable (`grid.setCollision`), giving direct manual control over
  what blocks the player.
