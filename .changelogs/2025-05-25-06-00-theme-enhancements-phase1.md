# Theme Enhancements - Phase 1

**Date:** 2025-05-25
**Session:** Theme character animations and scroll reveals

## Original Prompts

```
"in all themes I want to have characters showing up and animating, maybe on scroll
Like we can show a person running from a few zombies as we scroll down on the survival horror theme"

"we need to make sure animations aren't completely linked to scrolling wheel or bar, we need to make sure they're smooth"

"all animations should be behind content... I'd rather have 16 alternative versions of myself, my character"

"for the character inspiration we can use the sprite folder images"
```

## Summary

Added Alexander character sprites and scroll-triggered section reveal animations to multiple themes, using the existing sprite assets (`/assets/sprites/`).

## Changes Made

### New Shared Components
| File | Lines | Description |
|------|-------|-------------|
| `src/components/themes/shared/CharacterSprite.tsx` | 128 | Base character sprite with theme-specific variants (Survivor, Shadow, Pixel, Neon, etc.) |
| `src/components/themes/shared/AnimatedSection.tsx` | 130 | Scroll-triggered section reveal with multiple animation types |
| `src/components/themes/shared/index.ts` | 2 | Export barrel file |

### SurvivalHorrorTheme.tsx
- **Before:** 951 lines
- **After:** ~1050 lines
- **Added:**
  - `SurvivorSprite` - Alexander with flashlight effect
  - `ZombieChaser` - SVG zombie with reaching arms animation
  - `ZombieChaseSection` - Scroll-triggered reveal where survivor runs from zombie
  - `ContentOverlay` - Dark overlay for better readability
  - Chase animation keyframes (`survivor-run-left/right`, `zombie-chase-left/right`)
- **Fixed:** Unescaped `>` characters in JSX (6 instances)

### RetroRPGTheme.tsx  
- **Before:** 967 lines
- **After:** ~1060 lines
- **Added:**
  - `PixelSoulCharacter` - Alexander sprite with soul heart glow
  - `BattleRevealSection` - Section reveal with "ENCOUNTER!" flash
  - `battle-flash` animation keyframes
- **Imports:** Added `useInViewTrigger` hook, `Image` component

### NeonPortalsTheme.tsx
- **Before:** 1026 lines
- **After:** ~1080 lines
- **Added:**
  - `TestSubjectAlexander` - Alexander sprite with portal gun glow effect
  - Updated `ScrollPortalScene` to use real character instead of silhouette
- **Imports:** Added `Image` component

## Animation Approach

1. **Smooth scroll tracking:** Using `useSmoothScroll` with lerp interpolation (not direct scroll binding)
2. **One-time triggers:** `useInViewTrigger` fires once on scroll down only
3. **CSS transitions:** All movements use CSS transitions for GPU acceleration
4. **Layering:** Animations at z-index 10-50, content at z-index 20-30

## Hooks Used
- `useSmoothScroll(smoothing)` - Interpolated scroll position
- `useInViewTrigger(ref, options)` - One-time viewport entry detection
- `useScrollZones(zones)` - Multiple trigger points

## Character Styling Per Theme
| Theme | Filter/Style |
|-------|-------------|
| SurvivalHorror | `contrast(1.1) brightness(0.85)` + flashlight |
| RetroRPG | `brightness(1.2) contrast(1.3) saturate(0.8)` + pixelated |
| NeonPortals | `brightness(1.1) contrast(1.2)` + portal gun glow |

## Remaining Themes to Enhance
- [ ] DarkFantasyTheme (Hollow Knight) - Knight with nail
- [ ] SilhouetteTheme (Limbo) - Already has good animations
- [ ] BoldNoirTheme (Persona 5) - Phantom thief with mask
- [ ] SoulMapTheme (Dark Souls) - Undead warrior
- [ ] MythicTheme (Hades) - Greek warrior
- [ ] ArtDecoTheme (Bioshock) - 1920s diver
- [ ] RetroAtomicTheme (Fallout) - Vault dweller
- [ ] RubberHoseTheme (Cuphead) - 1930s cartoon
- [ ] PainterlyTheme (Okami) - Ink brush warrior
- [ ] CellShadedTheme (Borderlands) - Vault hunter
- [ ] FighterSelectTheme (Street Fighter) - Fighting stance
- [ ] AdventurePathsTheme (Zelda) - Green tunic hero
- [ ] NeonCyberTheme (Cyberpunk) - Netrunner

## Verification
- Dev server compiles successfully
- No JSX parsing errors
- Animations use CSS transitions (performant)
