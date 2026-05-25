# Homepage Theme System Design

## Overview
Multi-theme portfolio homepage where visitors experience Alexander's CV through different game aesthetics. Default theme: **Survival Horror**.

## Core Concept
- 4 career paths displayed as interactive zones: Engineer, Drummer, Fighter, Gamer
- 16 visual themes that can be switched (persisted in localStorage)
- Plain CV always accessible as quick-exit option
- Keyboard navigation (WASD/arrows)

## Confirmed Themes (16)
1. **Survival Horror** (DEFAULT) - Dark mansion, inventory grid, typewriter text
2. Dark Fantasy Hub - Hero center, options around edges
3. Neon Portals - Circular glowing portals, walk to enter
4. Soul Map - Interconnected dark zones
5. Adventure Paths - Path nodes, landmarks
6. Rubber Hose - 1930s cartoon, sepia, film grain
7. Retro RPG - Black/white/yellow, battle menu
8. Bold Noir - Red/black, skewed angles
9. Fighter Select - Character grid, VS screen
10. Art Deco - 1920s gold filigree
11. Retro Atomic - 1950s terminal, S.P.E.C.I.A.L. stats
12. Neon Cyber - Magenta/cyan glitch
13. Painterly - Oil painting, thought cabinet
14. Cell Shaded - Comic book outlines
15. Silhouette - Pure black shapes, fog
16. Mythic - Greek/Roman, warm gradients

## Career Zones Content
| Zone | Experience | Color | Details |
|------|------------|-------|---------|
| Engineer | 10+ years | Cyan | Backend, Frontend, DevOps, Systems |
| Drummer | 15y (7 pro) | Purple | Touring, studio, multiple genres |
| Fighter | 6 years | Red | Muay Thai (3y), MMA (1y), BJJ (2y), Instructor |
| Gamer | ∞ | Green | Nebulith engine, game dev projects |

## Technical Architecture

### Components
- `ThemeProvider` - React context for current theme
- `ThemeSwitcher` - Dropdown component
- `CareerCard` - Displays single career zone
- `HomePage` - Main orchestrator
- Theme CSS variables system

### File Structure
```
src/
├── app/
│   └── page.tsx          # Homepage (survival horror default)
├── components/
│   ├── themes/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── themes.ts     # Theme definitions
│   └── home/
│       ├── CareerCard.tsx
│       └── HomePage.tsx
└── styles/
    └── themes/           # Theme-specific CSS
```

### Survival Horror Theme Specifics
- Background: Dark brown/black gradient (#1a1510 → #0a0805)
- Accent: Blood red (#8b0000)
- Text: Parchment (#998866)
- Font: Courier New (typewriter)
- Effects: Vignette overlay, inventory grid layout
- Interaction: "EXAMINE" to view career details
- Copy: "You have found: Engineer's Journal"

## Implementation Phases
1. **Phase 1**: Survival Horror homepage (base layout)
2. **Phase 2**: Theme switching system + 3 more themes
3. **Phase 3**: Remaining themes + animations
4. **Phase 4**: Career detail pages
5. **Phase 5**: Plain CV + mobile

## User Info
- Alexander Pulido
- Venezuelan
- System Engineer 10+ years
- Drummer 15 years (7 professional)
- Martial Artist/Instructor 6 years (Muay Thai 3y, MMA 1y, BJJ 2y)
- Gamer/Game Dev (Nebulith ASCII engine)
