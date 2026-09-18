# Homepage Sections Design Specification

**Date**: 2026-05-24  
**Project**: Alexander Pulido Portfolio (game-website)  
**Purpose**: Full section structure for multi-profession portfolio homepage

---

## Table of Contents
1. [Overview](#overview)
2. [Profession System](#profession-system)
3. [Section Specifications](#section-specifications)
4. [Data Structures](#data-structures)
5. [Component Architecture](#component-architecture)
6. [Implementation Order](#implementation-order)

---

## Overview

The homepage serves as a dynamic portfolio that adapts based on the visitor's selected profession focus. Alexander has four distinct professional identities:

| Profession | Years | Highlights |
|------------|-------|------------|
| **System Engineer** | 10+ years | Full-stack, DevOps, Systems Architecture |
| **Drummer** | 15 years (7 professional) | Touring, studio recording, multiple genres |
| **Martial Artist** | 6 years | Muay Thai (3y), MMA (1y), BJJ (2y), Instructor |
| **Gamer/Game Dev** | Ongoing | Nebulith ASCII engine, game prototypes |

### Design Philosophy
- Each section either adapts content per-profession OR is profession-specific
- Survival Horror theme is default (see theme-system-design.md)
- Mobile-first responsive design
- Sections lazy-load as user scrolls

---

## Profession System

### Profession Context
A React context tracks the currently selected profession. Selecting "Engineer" in the hero changes what content appears throughout the page.

```typescript
type Profession = 'engineer' | 'drummer' | 'fighter' | 'gamer';

interface ProfessionContext {
  active: Profession;
  setActive: (p: Profession) => void;
}
```

### Section Visibility Rules

| Section | Always Visible | Profession-Specific |
|---------|---------------|---------------------|
| Hero/Header | Yes | Content adapts |
| About Me | Yes | Content adapts |
| Experience Timeline | Yes | Filterable |
| Projects | Yes | Tagged, filterable |
| Collaborations | Yes | Content adapts |
| Blog | Yes | Featured post adapts |
| Certificates | Yes | Filterable |
| Gallery | Yes | Filterable |
| Contact/Social | Yes | Static |
| Interactive CV Games | Yes | Links adapt |
| Skills/Tech Stack | Yes | Content adapts |
| Testimonials | Yes | Filterable |
| Upcoming Shows | **Only Drummer** | - |
| Competition Record | **Only Fighter** | - |
| Discography | **Only Drummer** | - |
| Store (dev-only) | Yes | Static |
| Download CV | Yes | Static |

---

## Section Specifications

### 1. Hero/Header

**Purpose**: Name, role, profession switcher, navigation

#### Layout

```
DESKTOP (≥1024px)
┌─────────────────────────────────────────────────────────────┐
│  ALEXANDER PULIDO                          [CV] [Themes] [≡]│
│  ────────────────                                            │
│  [ Engineer | Drummer | Fighter | Gamer ]  <── pill tabs    │
│                                                              │
│  "Building systems that scale"  <── tagline (changes)        │
│                      ↓                                       │
│                [EXPLORE]                                     │
└─────────────────────────────────────────────────────────────┘

MOBILE (<640px)
┌───────────────────────────┐
│  [≡]            [Themes]  │
│                           │
│    ALEXANDER PULIDO       │
│    ─────────────────      │
│                           │
│  [ 💻 | 🥁 | 🥋 | 🎮 ]   │  <── icon tabs, selected shows text
│                           │
│  System Engineer          │
│  "Building systems..."    │
│                           │
│       [EXPLORE ↓]         │
└───────────────────────────┘
```

#### Profession-Specific Content

| Profession | Title | Tagline |
|------------|-------|---------|
| Engineer | System Engineer | "Building systems that scale" |
| Drummer | Professional Drummer | "Rhythm is the architecture of music" |
| Fighter | Martial Arts Instructor | "Discipline through combat" |
| Gamer | Game Developer | "Crafting worlds in ASCII" |

#### Data Structure

```typescript
interface HeroConfig {
  professionId: Profession;
  title: string;
  tagline: string;
  icon: string;       // emoji or ascii art
  accentColor: string; // CSS color
}

const HERO_CONFIGS: Record<Profession, HeroConfig> = {
  engineer: {
    professionId: 'engineer',
    title: 'System Engineer',
    tagline: 'Building systems that scale',
    icon: '💻',
    accentColor: '#00ffff', // cyan
  },
  // ... etc
};
```

---

### 2. About Me

**Purpose**: Dynamic bio that changes based on selected profession

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                │
│  │         │   ABOUT ME                                     │
│  │  Photo  │   ─────────                                    │
│  │         │   [Bio text that changes per profession]       │
│  └─────────┘   [Bio text continued...]                      │
│                                                              │
│                Quick Facts:                                  │
│                • Venezuelan                                  │
│                • Based in [Location]                         │
│                • [Profession-specific facts]                 │
└─────────────────────────────────────────────────────────────┘

MOBILE
┌───────────────────────────┐
│       ┌─────────┐         │
│       │  Photo  │         │
│       └─────────┘         │
│                           │
│       ABOUT ME            │
│       ─────────           │
│  [Bio paragraph...]       │
│  [Bio continued...]       │
│                           │
│  Quick Facts:             │
│  • Fact 1                 │
│  • Fact 2                 │
└───────────────────────────┘
```

#### Profession-Specific Content

**Engineer**:
> 10+ years building robust systems from backend to infrastructure. Started with PHP, evolved through Python, fell in love with Elixir. Now architecting distributed systems with Phoenix, PostgreSQL, and Kubernetes. Obsessed with clean code, testing, and automation.

**Drummer**:
> 15 years behind the kit, 7 of those professional. Trained across rock, metal, latin, and jazz fusion. Session work, live touring, studio recording. Music is mathematics made visceral.

**Fighter**:
> 6 years of martial arts across Muay Thai (3y), MMA (1y), and Brazilian Jiu-Jitsu (2y). Now instructing - passing on what the mat taught me about discipline, ego, and growth.

**Gamer**:
> Lifelong gamer, now building games. Working on Nebulith - an ASCII tile-based engine inspired by classic RPGs and roguelikes. Combining my engineering background with my love for pixel art and procedural generation.

#### Data Structure

```typescript
interface AboutMe {
  professionId: Profession;
  bio: string;
  quickFacts: string[];
}
```

---

### 3. Experience Timeline

**Purpose**: LinkedIn-style work history, filterable by profession

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  EXPERIENCE                                                  │
│  ──────────                                                  │
│  Filter: [All] [Engineer] [Drummer] [Fighter] [Gamer]       │
│                                                              │
│  2024 ── ● ─── AgencyRocket - Principal Engineer            │
│          │     Phoenix/Elixir, Vue, Kubernetes              │
│          │     Leading API architecture for insurance tech   │
│          │                                                   │
│  2020 ── ● ─── Quility - Senior Engineer                    │
│          │     Full-stack development, migrations            │
│          │                                                   │
│  2019 ── ● ─── Band Name - Touring Drummer         [Drummer]│
│          │     National tour, 30+ cities                     │
│          │                                                   │
│  2018 ── ● ─── Gym Name - BJJ Instructor           [Fighter]│
│          │     Teaching fundamentals to beginners            │
└─────────────────────────────────────────────────────────────┘

MOBILE (compact accordion)
┌───────────────────────────┐
│  EXPERIENCE               │
│  [Filter ▼]               │
│                           │
│  ▸ 2024 - AgencyRocket    │
│  ▸ 2020 - Quility         │
│  ▸ 2019 - Band Name       │
│  ▾ 2018 - Gym Name        │
│    ├─ BJJ Instructor      │
│    ├─ Teaching beginners  │
│    └─ [tags: fighter]     │
└───────────────────────────┘
```

#### Data Structure

```typescript
interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  startDate: string;          // YYYY-MM
  endDate: string | null;     // null = present
  description: string;
  skills: string[];
  professions: Profession[];  // which filters show this entry
  highlights?: string[];
  links?: {
    label: string;
    url: string;
  }[];
}

type ExperienceTimeline = ExperienceEntry[];
```

---

### 4. Projects Portfolio

**Purpose**: Grid of projects, tagged and filterable

#### Layout

```
DESKTOP (3-4 column grid)
┌─────────────────────────────────────────────────────────────┐
│  PROJECTS                                                    │
│  ────────                                                    │
│  Filter: [All] [Work] [Personal] [Open Source]              │
│          [Engineer] [Gamer]                                  │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Thumb    │ │ Thumb    │ │ Thumb    │ │ Thumb    │       │
│  │          │ │          │ │          │ │          │       │
│  │ Nebulith │ │ AR API   │ │ PMX      │ │ Plugin   │       │
│  │ [gamer]  │ │ [eng]    │ │ [eng]    │ │ [eng]    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌──────────┐ ┌──────────┐                                  │
│  │ Thumb    │ │ Thumb    │                                  │
│  │          │ │          │                                  │
│  │ Project  │ │ Project  │                                  │
│  │ [tags]   │ │ [tags]   │                                  │
│  └──────────┘ └──────────┘                                  │
└─────────────────────────────────────────────────────────────┘

MOBILE (2 column grid, cards expand on tap)
┌───────────────────────────┐
│  PROJECTS      [Filter ▼] │
│                           │
│  ┌────────┐ ┌────────┐   │
│  │ Thumb  │ │ Thumb  │   │
│  │Nebulith│ │ AR API │   │
│  └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐   │
│  │ Thumb  │ │ Thumb  │   │
│  │ PMX    │ │ Plugin │   │
│  └────────┘ └────────┘   │
└───────────────────────────┘
```

#### Data Structure

```typescript
interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  thumbnail: string;        // image path
  professions: Profession[];
  tags: ('work' | 'personal' | 'open-source')[];
  techStack: string[];
  status: 'active' | 'completed' | 'archived';
  links?: {
    demo?: string;
    github?: string;
    case_study?: string;
  };
  featured: boolean;
  startDate: string;
  endDate?: string;
}
```

---

### 5. Collaborations

**Purpose**: Bands, teams, companies worked with

#### Layout

```
DESKTOP (logo grid + list)
┌─────────────────────────────────────────────────────────────┐
│  COLLABORATIONS                                              │
│  ──────────────                                              │
│                                                              │
│  [Logo] [Logo] [Logo] [Logo] [Logo] [Logo]                  │
│                                                              │
│  Teams & Bands:                                              │
│  • AgencyRocket - Insurance Tech (2024-present)             │
│  • Quility - InsurTech Platform (2020-2024)                 │
│  • [Band Name] - Metal/Rock (2019-2022)                     │
│  • [Gym Name] - BJJ Academy (2018-present)                  │
└─────────────────────────────────────────────────────────────┘

MOBILE (horizontal scroll logos + compact list)
┌───────────────────────────┐
│  COLLABORATIONS           │
│                           │
│  ←[Logo][Logo][Logo]...→  │ <── horizontal scroll
│                           │
│  • AgencyRocket (2024+)   │
│  • Quility (2020-24)      │
│  • Band Name (2019-22)    │
└───────────────────────────┘
```

#### Data Structure

```typescript
interface Collaboration {
  id: string;
  name: string;
  type: 'company' | 'band' | 'gym' | 'team' | 'organization';
  logo?: string;              // image path
  professions: Profession[];
  startYear: number;
  endYear: number | null;     // null = ongoing
  role: string;
  description?: string;
  url?: string;
}
```

---

### 6. Blog Preview

**Purpose**: Featured post preview, link to full blog

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  BLOG                                                        │
│  ────                                                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Featured Post                                        │    │
│  │ ────────────────                                     │    │
│  │                                                      │    │
│  │ Title of the Featured Blog Post                     │    │
│  │                                                      │    │
│  │ Preview text of the post, first 150 characters...   │    │
│  │                                                      │    │
│  │ [Read More →]                    May 20, 2026       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Recent:                                                     │
│  • Post Title 2 - May 15, 2026                              │
│  • Post Title 3 - May 10, 2026                              │
│                                                              │
│                              [View All Posts →]             │
└─────────────────────────────────────────────────────────────┘

MOBILE
┌───────────────────────────┐
│  BLOG                     │
│                           │
│  ┌─────────────────────┐  │
│  │ Featured Post       │  │
│  │ Post Title Here     │  │
│  │ Preview text...     │  │
│  │ [Read More]         │  │
│  └─────────────────────┘  │
│                           │
│  [View All Posts →]       │
└───────────────────────────┘
```

#### Profession-Specific Featured Post
The featured post rotates based on selected profession:
- **Engineer**: Technical posts (architecture, Elixir, etc.)
- **Drummer**: Music posts (gear, technique, shows)
- **Fighter**: Training posts (conditioning, mental game)
- **Gamer**: Game dev posts (engine updates, design)

#### Data Structure

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;          // markdown
  publishedAt: string;      // ISO date
  professions: Profession[];
  tags: string[];
  featured: boolean;
  coverImage?: string;
}
```

---

### 7. Certificates & Credentials

**Purpose**: Certifications, achievements, licenses

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  CERTIFICATES & CREDENTIALS                                  │
│  ──────────────────────────                                  │
│  Filter: [All] [Engineering] [Music] [Martial Arts]         │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ 🏆          │ │ 📜          │ │ 🥋          │           │
│  │ AWS Cloud   │ │ Elixir Cert │ │ BJJ Purple  │           │
│  │ Practitioner│ │             │ │ Belt        │           │
│  │ 2023        │ │ 2022        │ │ 2024        │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐                            │
│  │ 🎵          │ │ 🎓          │                            │
│  │ Berklee     │ │ K8s Admin   │                            │
│  │ Percussion  │ │ (CKA)       │                            │
│  │ 2020        │ │ 2023        │                            │
│  └─────────────┘ └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

#### Data Structure

```typescript
interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  professions: Profession[];
  icon: string;              // emoji or icon name
  verified: boolean;
}
```

---

### 8. Gallery / Media

**Purpose**: Photos, videos, embedded media

#### Layout

```
DESKTOP (masonry grid with lightbox)
┌─────────────────────────────────────────────────────────────┐
│  GALLERY                                                     │
│  ───────                                                     │
│  Filter: [All] [Photos] [Videos] [Performance] [Code]       │
│                                                              │
│  ┌────────────────┐ ┌────────┐ ┌────────┐                  │
│  │                │ │        │ │        │                  │
│  │   Large Img    │ │  Img   │ │  ▶     │ <-- video       │
│  │                │ │        │ │  Vid   │                  │
│  │                │ └────────┘ └────────┘                  │
│  │                │ ┌────────┐ ┌────────┐                  │
│  │                │ │        │ │        │                  │
│  └────────────────┘ │  Img   │ │  Img   │                  │
│  ┌────────┐ ┌──────┤        │ │        │                  │
│  │        │ │      └────────┘ └────────┘                  │
│  │  Img   │ │ Img  │                                       │
│  └────────┘ └──────┘                                       │
└─────────────────────────────────────────────────────────────┘

MOBILE (2-column grid)
┌───────────────────────────┐
│  GALLERY      [Filter ▼]  │
│                           │
│  ┌────────┐ ┌────────┐   │
│  │        │ │        │   │
│  │  Img   │ │  Img   │   │
│  └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐   │
│  │  ▶ Vid │ │        │   │
│  │        │ │  Img   │   │
│  └────────┘ └────────┘   │
└───────────────────────────┘
```

#### Data Structure

```typescript
type MediaType = 'photo' | 'video' | 'embed';

interface GalleryItem {
  id: string;
  type: MediaType;
  title: string;
  description?: string;
  src: string;               // image URL or video embed URL
  thumbnail: string;
  professions: Profession[];
  tags: string[];
  date: string;
  width?: number;            // for masonry layout
  height?: number;
  embedHtml?: string;        // for YouTube/Vimeo embeds
}
```

---

### 9. Contact / Social

**Purpose**: Contact info and social links

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  GET IN TOUCH                                                │
│  ────────────                                                │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │                                                  │        │
│  │  Email: contact@alexanderpulido.com             │        │
│  │                                                  │        │
│  │  [GitHub] [LinkedIn] [Twitter/X] [Instagram]    │        │
│  │                                                  │        │
│  │  Based in: [Location]                           │        │
│  │  Available for: Freelance, Consulting           │        │
│  │                                                  │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  Or send a message:                                          │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Name: [____________]                             │        │
│  │ Email: [____________]                            │        │
│  │ Message: [_____________________________]         │        │
│  │          [_____________________________]         │        │
│  │                              [Send Message]      │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘

MOBILE (stacked)
┌───────────────────────────┐
│  GET IN TOUCH             │
│                           │
│  📧 Email                 │
│  contact@example.com      │
│                           │
│  [GH] [LI] [X] [IG]      │
│                           │
│  [Send Message ▼]         │  <-- expands to form
└───────────────────────────┘
```

#### Data Structure

```typescript
interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  handle?: string;
}

interface ContactInfo {
  email: string;
  location?: string;
  availableFor: string[];
  socials: SocialLink[];
}
```

---

### 10. Interactive CV Games

**Purpose**: Link to playable game versions of CV

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  INTERACTIVE CV                                              │
│  ──────────────                                              │
│  Experience my journey through play                          │
│                                                              │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐      │
│  │  ╔═══════╗    │ │   /\    /\    │ │    ♪ ♫ ♪     │      │
│  │  ║ ◊  ◊ ║    │ │  |  |--|  |   │ │   ┌─────┐    │      │
│  │  ║      ║    │ │   \|    |/    │ │   │     │    │      │
│  │  ╚══════╝    │ │    |    |     │ │   └─────┘    │      │
│  │              │ │               │ │              │      │
│  │  NEBULITH    │ │  FIGHTER CV   │ │  MUSICIAN    │      │
│  │  Isometric   │ │  2D Platformer│ │  3/4 RPG     │      │
│  │              │ │               │ │              │      │
│  │ [PLAY →]     │ │ [PLAY →]      │ │ [PLAY →]     │      │
│  └───────────────┘ └───────────────┘ └───────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### Game Descriptions

| Game | Profession Focus | Style | Description |
|------|-----------------|-------|-------------|
| **Nebulith** | Engineer | Isometric ASCII | Explore a village where each building represents a project/skill |
| **Fighter CV** | Martial Arts | 2D Platformer | Fight through levels representing different disciplines |
| **Musician CV** | Drummer | 3/4 2D RPG | Musical journey RPG with rhythm elements |

#### Data Structure

```typescript
interface GameCV {
  id: string;
  name: string;
  profession: Profession;
  style: string;
  description: string;
  thumbnail: string;       // ASCII art preview or screenshot
  playUrl: string;
  status: 'playable' | 'in-development' | 'planned';
}
```

---

### 11. Upcoming Shows (Drummer Only)

**Purpose**: Calendar of upcoming music performances

#### Visibility
**Only visible when `profession === 'drummer'`**

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  UPCOMING SHOWS 🎵                                           │
│  ──────────────                                              │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ JUN 15  │  Band Name - Venue Name, City              │  │
│  │ 2026    │  Supporting: Other Band                     │  │
│  │         │  Doors: 8pm | [Tickets]                     │  │
│  ├─────────┼────────────────────────────────────────────┤  │
│  │ JUL 03  │  Festival Name - Location                  │  │
│  │ 2026    │  Main Stage, 6:30pm                        │  │
│  │         │  [Festival Site]                            │  │
│  └─────────┴────────────────────────────────────────────┘  │
│                                                              │
│  Past shows: [View Archive]                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Data Structure

```typescript
interface Show {
  id: string;
  date: string;            // ISO date
  time?: string;
  band: string;
  venue: string;
  city: string;
  country?: string;
  eventName?: string;      // festival name
  supportingActs?: string[];
  ticketUrl?: string;
  eventUrl?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}
```

---

### 12. Competition Record (Fighter Only)

**Purpose**: Fight record and tournament results

#### Visibility
**Only visible when `profession === 'fighter'`**

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  COMPETITION RECORD 🥋                                       │
│  ──────────────────                                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  BJJ Tournaments                                     │    │
│  │  ─────────────────                                   │    │
│  │  W: 5  |  L: 2  |  Submissions: 3                   │    │
│  │                                                      │    │
│  │  • 2024 Open - Gold (Purple Belt)                   │    │
│  │  • 2023 Regional - Silver                           │    │
│  │  • 2023 Local - Gold                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Muay Thai / MMA                                     │    │
│  │  ──────────────                                      │    │
│  │  Fights: 3  |  W: 2  |  L: 1                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Data Structure

```typescript
interface Competition {
  id: string;
  discipline: 'bjj' | 'muay-thai' | 'mma';
  eventName: string;
  date: string;
  location: string;
  result: 'gold' | 'silver' | 'bronze' | 'win' | 'loss' | 'draw';
  method?: string;          // submission, KO, decision
  division?: string;        // weight class, belt level
  notes?: string;
}

interface FightRecord {
  discipline: string;
  wins: number;
  losses: number;
  draws: number;
  submissions?: number;
  knockouts?: number;
}
```

---

### 13. Discography (Drummer Only)

**Purpose**: Albums, singles, recordings

#### Visibility
**Only visible when `profession === 'drummer'`**

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  DISCOGRAPHY 🎵                                              │
│  ──────────────                                              │
│                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ [Album    │ │ [Album    │ │ [Album    │ │ [Album    │   │
│  │  Cover]   │ │  Cover]   │ │  Cover]   │ │  Cover]   │   │
│  │           │ │           │ │           │ │           │   │
│  │ Album Name│ │ Album 2   │ │ Single    │ │ EP Name   │   │
│  │ Band Name │ │ Band Name │ │ Collab    │ │ Band      │   │
│  │ 2024      │ │ 2023      │ │ 2022      │ │ 2021      │   │
│  │           │ │           │ │           │ │           │   │
│  │ [Spotify] │ │ [Spotify] │ │ [YouTube] │ │ [BandCamp]│   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Data Structure

```typescript
type ReleaseType = 'album' | 'ep' | 'single' | 'compilation' | 'live';

interface Release {
  id: string;
  title: string;
  artist: string;           // band name
  type: ReleaseType;
  releaseDate: string;
  coverArt: string;
  tracks?: number;
  role: string;             // "Drums", "Drums & Percussion"
  genre: string[];
  links: {
    spotify?: string;
    youtube?: string;
    bandcamp?: string;
    appleMusic?: string;
  };
}
```

---

### 14. Skills / Tech Stack

**Purpose**: Visual representation of skills

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  SKILLS & TOOLS                                              │
│  ─────────────                                               │
│                                                              │
│  Languages:                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Elixir │ │ TypeS. │ │ Python │ │ Rust   │ │ SQL    │    │
│  │ ████░  │ │ █████  │ │ ███░░  │ │ ██░░░  │ │ ████░  │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                              │
│  Frameworks:                                                 │
│  [Phoenix] [React] [Vue] [Next.js] [Tailwind]               │
│                                                              │
│  Infrastructure:                                             │
│  [Kubernetes] [Docker] [Terraform] [ArgoCD] [PostgreSQL]    │
│                                                              │
│  Concepts:                                                   │
│  [Distributed Systems] [Event Sourcing] [CQRS] [CI/CD]      │
└─────────────────────────────────────────────────────────────┘
```

#### Profession-Specific Skills

| Profession | Skill Categories |
|------------|------------------|
| Engineer | Languages, Frameworks, Infrastructure, Concepts |
| Drummer | Genres, Techniques, Equipment, Software |
| Fighter | Disciplines, Techniques, Teaching Areas |
| Gamer | Engines, Languages, Tools, Genres |

#### Data Structure

```typescript
interface Skill {
  name: string;
  category: string;
  proficiency?: number;      // 1-5 for bar display
  icon?: string;
  years?: number;
}

interface SkillCategory {
  name: string;
  profession: Profession;
  skills: Skill[];
}
```

---

### 15. Testimonials / References

**Purpose**: Quotes from colleagues, bandmates, students

#### Layout

```
DESKTOP (carousel or grid)
┌─────────────────────────────────────────────────────────────┐
│  TESTIMONIALS                                                │
│  ────────────                                                │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  "Alexander is one of the most thorough engineers     │  │
│  │   I've worked with. His attention to testing and      │  │
│  │   documentation is exceptional."                       │  │
│  │                                                        │  │
│  │   — John Doe, CTO at Company                          │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  [◀]  1 / 5  [▶]                                            │
└─────────────────────────────────────────────────────────────┘
```

#### Data Structure

```typescript
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  relationship: string;      // "Former Manager", "Bandmate", "Student"
  professions: Profession[];
  date?: string;
  avatar?: string;
}
```

---

### 16. Download CV

**Purpose**: Quick link to download PDF resume

#### Layout

```
DESKTOP (can be in header, footer, or floating)
┌─────────────────────────────────────────────────────────────┐
│  DOWNLOAD CV                                                 │
│  ───────────                                                 │
│                                                              │
│  Get a traditional PDF resume:                               │
│                                                              │
│  [📄 Full CV (All Professions)]                             │
│  [💻 Engineering Focus]                                      │
│  [🥁 Music Focus]                                            │
│  [🥋 Martial Arts Focus]                                     │
│                                                              │
│  Last updated: May 2026                                      │
└─────────────────────────────────────────────────────────────┘
```

#### Data Structure

```typescript
interface CVDownload {
  type: 'full' | Profession;
  label: string;
  pdfUrl: string;
  lastUpdated: string;
}
```

---

### 17. Store (Dev-Only Placeholder)

**Purpose**: Placeholder for future courses, merch, digital products

#### Visibility
**Only visible in development mode**

#### Layout

```
DESKTOP
┌─────────────────────────────────────────────────────────────┐
│  STORE (Coming Soon)                    [DEV ONLY - Hidden] │
│  ──────                                                      │
│                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                 │
│  │ [Product] │ │ [Product] │ │ [Product] │                 │
│  │           │ │           │ │           │                 │
│  │ Course 1  │ │ Merch     │ │ Beats     │                 │
│  │ $XX       │ │ $XX       │ │ $XX       │                 │
│  └───────────┘ └───────────┘ └───────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Structures

### Master Data File Structure

```
src/
├── data/
│   ├── index.ts             # Re-exports all data
│   ├── professions.ts       # Profession configs
│   ├── experience.ts        # Timeline entries
│   ├── projects.ts          # Portfolio items
│   ├── collaborations.ts    # Teams, bands, companies
│   ├── certificates.ts      # Credentials
│   ├── gallery.ts           # Media items
│   ├── skills.ts            # Skills by category
│   ├── testimonials.ts      # Quotes
│   ├── shows.ts             # Upcoming/past shows
│   ├── competitions.ts      # Fight record
│   ├── discography.ts       # Music releases
│   ├── games.ts             # Interactive CV games
│   └── contact.ts           # Contact info, socials
```

### Prisma Schema Additions (if using DB)

```prisma
model Experience {
  id           String   @id @default(cuid())
  title        String
  organization String
  startDate    DateTime
  endDate      DateTime?
  description  String
  skills       String[]
  professions  String[]
  highlights   String[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  tagline     String
  description String
  thumbnail   String?
  professions String[]
  tags        String[]
  techStack   String[]
  status      String
  featured    Boolean  @default(false)
  demoUrl     String?
  githubUrl   String?
  startDate   DateTime
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ... etc for other entities
```

---

## Component Architecture

### File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── SectionWrapper.tsx
│   │
│   ├── sections/
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── ProfessionSwitcher.tsx
│   │   │   └── TitleSwitcher.tsx
│   │   │
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── QuickFacts.tsx
│   │   │
│   │   ├── Experience/
│   │   │   ├── Timeline.tsx
│   │   │   ├── TimelineEntry.tsx
│   │   │   └── TimelineFilter.tsx
│   │   │
│   │   ├── Projects/
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectFilter.tsx
│   │   │   └── ProjectModal.tsx
│   │   │
│   │   ├── Collaborations/
│   │   │   ├── Collaborations.tsx
│   │   │   └── CollabLogo.tsx
│   │   │
│   │   ├── Blog/
│   │   │   ├── BlogPreview.tsx
│   │   │   └── FeaturedPost.tsx
│   │   │
│   │   ├── Certificates/
│   │   │   ├── Certificates.tsx
│   │   │   └── CertCard.tsx
│   │   │
│   │   ├── Gallery/
│   │   │   ├── Gallery.tsx
│   │   │   ├── GalleryItem.tsx
│   │   │   └── Lightbox.tsx
│   │   │
│   │   ├── Contact/
│   │   │   ├── Contact.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   ├── InteractiveCV/
│   │   │   ├── GameCards.tsx
│   │   │   └── GameCard.tsx
│   │   │
│   │   ├── Skills/
│   │   │   ├── Skills.tsx
│   │   │   ├── SkillBar.tsx
│   │   │   └── SkillTags.tsx
│   │   │
│   │   ├── Testimonials/
│   │   │   ├── Testimonials.tsx
│   │   │   └── TestimonialCard.tsx
│   │   │
│   │   ├── UpcomingShows/
│   │   │   ├── Shows.tsx
│   │   │   └── ShowCard.tsx
│   │   │
│   │   ├── Competitions/
│   │   │   ├── FightRecord.tsx
│   │   │   └── CompetitionEntry.tsx
│   │   │
│   │   ├── Discography/
│   │   │   ├── Discography.tsx
│   │   │   └── ReleaseCard.tsx
│   │   │
│   │   └── DownloadCV/
│   │       └── DownloadCV.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Filter.tsx
│       ├── Carousel.tsx
│       └── Tag.tsx
│
├── contexts/
│   └── ProfessionContext.tsx
│
├── hooks/
│   ├── useProfession.ts
│   ├── useIntersection.ts      # for lazy loading
│   └── useMediaQuery.ts
│
└── lib/
    └── filterByProfession.ts
```

### Shared Hooks

```typescript
// useProfession.ts
export function useProfession() {
  const context = useContext(ProfessionContext);
  if (!context) throw new Error('useProfession must be used within ProfessionProvider');
  return context;
}

// useIntersection.ts - for lazy loading sections
export function useIntersection(ref: RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  // ... implementation
  return isIntersecting;
}
```

---

## Implementation Order

### Phase 1: Core Structure (Priority: High)
1. **ProfessionContext** - State management for profession switching
2. **Hero/Header** - Name, profession switcher, navigation
3. **About Me** - Dynamic bio per profession
4. **SectionWrapper** - Reusable section container with lazy loading

### Phase 2: Experience & Projects (Priority: High)
5. **Experience Timeline** - Work history with filters
6. **Projects Portfolio** - Grid with cards and filters
7. **Skills/Tech Stack** - Visual skills representation

### Phase 3: Social Proof (Priority: Medium)
8. **Collaborations** - Logos and list
9. **Testimonials** - Carousel of quotes
10. **Certificates** - Credential cards

### Phase 4: Content Sections (Priority: Medium)
11. **Blog Preview** - Featured post + recent list
12. **Gallery** - Media grid with lightbox
13. **Contact/Social** - Form and social links

### Phase 5: Interactive Features (Priority: Medium)
14. **Interactive CV Games** - Links to playable experiences
15. **Download CV** - PDF downloads

### Phase 6: Profession-Specific (Priority: Lower)
16. **Upcoming Shows** - Drummer only
17. **Competition Record** - Fighter only
18. **Discography** - Drummer only

### Phase 7: Future (Priority: Backlog)
19. **Store** - Placeholder, dev-only

---

## Mobile Considerations

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: >= 1024px

### Mobile-Specific Patterns
- Hero: Stacked layout, icon tabs instead of text tabs
- Experience: Accordion instead of visible timeline
- Projects: 2-column grid, tap to expand
- Gallery: 2-column, swipe gestures
- Testimonials: Single card, swipe navigation
- Contact: Form hidden by default, "Send Message" button reveals

### Touch Interactions
- Swipe carousel for testimonials, gallery
- Tap to expand project cards
- Pull-to-refresh for dynamic content
- Floating "Back to Top" button

---

## Performance Notes

- **Lazy load sections** using Intersection Observer
- **Image optimization** with Next.js Image component
- **Static data** for most sections (no API calls)
- **Dynamic data** only for: Blog (latest posts), Shows (if external calendar)
- **Above-the-fold priority**: Hero, About
- **Defer loading**: Gallery, Blog, Store

---

## Integration with Theme System

All sections should respect the current theme from `ThemeProvider`. Each section component receives theme context and applies:

- Background colors
- Text colors  
- Accent colors
- Border styles
- Font family
- Section-specific effects (vignette, grain, etc.)

See `2026-05-24-homepage-theme-system-design.md` for theme details.

---

## Next Steps

1. Create `ProfessionContext.tsx`
2. Build `Hero` section with profession switcher
3. Set up data files structure in `src/data/`
4. Build section components one by one per implementation order
5. Wire up filters to profession context
6. Add responsive breakpoints
7. Integrate with theme system
