# Tau Website Design Specification

Extracted from https://twotimespi.dev/

---

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--ground` | `#FFFFFF` | Page background, card backgrounds |
| `--grid` | `#DCE4F2` | Grid lines, subtle borders |
| `--grid-strong` | `#C9D6EE` | Strong borders, separators, input borders |
| `--ink` | `#13213C` | Primary text, headings |
| `--ink-soft` | `#54607A` | Secondary text, captions, labels |
| `--accent` | `#1B3FA0` | Links, tau highlighting, primary brand color |
| `--red` | `#D6435B` | Eyebrow labels, section marks, terminal dots, badges |
| `--green` | `#1F8A5F` | Success states, roadmap checkmarks |
| `--paper-edge` | `#EEF2FA` | Code inline backgrounds, subtle surfaces |

Terminal dark: `#0e1a30` (hardcoded, not a variable)

Tau accent overlay: `rgba(27, 63, 160, 5%)` — used for tau column highlights

---

## Typography

### Font Families

| Token | Stack | Usage |
|-------|-------|-------|
| `--serif` | `"Spectral", Georgia, serif` | Body text, prose, docs content |
| `--grotesk` | `"Space Grotesk", ui-sans-serif, system-ui, sans-serif` | UI elements, nav, labels, buttons, sidebar |
| `--mono` | `"JetBrains Mono", ui-monospace, monospace` | Code, terminal, version badges, technical values |
| `--math` | `"STIX Two Text", "Cambria Math", "Times New Roman", serif` | Tau glyph (τ), mathematical symbols |
| `--hand` | `"Caveat", "Segoe Print", cursive` | Hero headings, section headings, eyebrow callouts, roadmap titles |

### Type Scale

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Body | Spectral | 18px | 400 | line-height: 1.6 |
| H1 (hero) | Caveat | clamp(48px, 8.5vw, 92px) | 500 | line-height: 1.02, letter-spacing: -0.005em |
| H1 compact | Caveat | clamp(48px, 7.5vw, 72px) | 500 | |
| Section H2 | Caveat | clamp(32px, 5vw, 46px) | 600 | line-height: 1 |
| Eyebrow hand | Caveat | 22px | 600 | color: red (or ink-soft in hero) |
| Eyebrow uppercase | Space Grotesk | 12.5px | 500 | letter-spacing: 0.22em, uppercase |
| Lede | Spectral | 19px | 400 | max-width: 30em |
| Small lede | Spectral | 17px | 400 | color: ink-soft |
| Nav links | Space Grotesk | 14.5px | — | color: ink-soft |
| Ghost CTA | Space Grotesk | 15px | 500 | color: accent, border-bottom: 1.5px accent |
| Figlabel | Space Grotesk | 11px | — | letter-spacing: 0.18em, uppercase |
| Strip caption | Space Grotesk | 12px | — | letter-spacing: 0.14em, uppercase |
| Mono code | JetBrains Mono | 14px | — | line-height: 1.85 (in terminal) |
| Mono badge | JetBrains Mono | 12px | — | version tags, roadmap phases |
| Table header | Space Grotesk | 12.5px | — | letter-spacing: 0.06em, uppercase |
| Docs body | Spectral | 17px | 400 | line-height: 1.7 |
| Docs H2 | Spectral | 28px | 400 | italic, border-top separator |
| Docs H3 | Space Grotesk | 19px | 600 | |

---

## Spacing

### Layout

| Token | Value |
|-------|-------|
| `--cell` | `28px` (grid unit) |
| `--maxw` | `1080px` |
| Wrap padding | `32px` (22px on mobile) |

### Vertical Rhythm

| Context | Spacing |
|---------|---------|
| Section padding | `88px` top/bottom |
| Section heading margin-bottom | `44px` |
| Hero top padding | `74px` (64px compact) |
| Hero grid gap | `48px` |
| Two-column gap | `48px` (28px mobile) |
| Footer top padding | `34px` |
| Closing section | `110px` top, `90px` bottom |

### Component Spacing

| Component | Padding |
|-----------|---------|
| Figure/card | `14px` |
| Layer cards | `30px 26px 34px` |
| Terminal | `24px 22px` pre, `12px 16px` bar |
| Release card head | `22px 32px` |
| Release sections | `4px 32px 32px` |
| Docs sidebar sticky offset | `top: 28px` |

---

## Layout Patterns

### Background Grid
- 28px cell grid rendered as `linear-gradient` on `body`
- Colors: `var(--grid)` lines, `var(--ground)` fill
- Fixed red vertical line: `1.5px` wide, positioned at `3 * cell + 1px` from left, opacity 0.45
- Radial white gradient overlay at top for hero readability

### Grid Systems
- **Hero:** `grid-template-columns: 1.02fr .98fr` (near-equal 2-col)
- **Two-column:** `.85fr 1.15fr` (text narrower, figure wider)
- **Boundary two:** `.78fr 1.22fr` (text even narrower)
- **Three-col layers:** `repeat(3, 1fr)` with 1px grid-strong gap
- **Strip:** `repeat(3, 1fr)` horizontal cells with dividers
- **Docs layout:** `240px sidebar + minmax(0, 1fr)` content

### Border Radius
- Cards/figures: `6px`
- Terminal: `8px`
- Badges/pills: `999px` (full round)
- Phase badges: `10px` (pill-ish)
- Search modal: `10px`

---

## Components

### Buttons & Links
- **Install button:** dark bg (`var(--ink)`), white text, mono font, `border-radius: 4px`
- **Ghost link:** accent color, 1.5px bottom border, Space Grotesk 15px/500, opacity transition on hover
- **Star CTA:** pill shape, 1px border grid-strong, transitions to accent on hover

### Cards & Figures
- 1px `var(--grid-strong)` border
- `border-radius: 6px`
- Semi-transparent white background: `rgba(255,255,255,.6)`
- Backdrop blur: 1px
- Shadow: `0 1px rgba(19,33,60,4%), 0 24px 48px -28px rgba(19,33,60,.28)`

### Terminal Window
- Dark background: `#0e1a30`
- Title bar with 3 colored dots (red first at 0.8 opacity, rest white at 0.18)
- Mono text, colored syntax: prompt=red, command=white, output=#7f8caa, key=#8fb4ff

### Table/Turns Grid
- 1px grid-strong borders
- Alternating column highlights (tau column gets `rgba(27,63,160,5%)`)
- Header row: lighter background, uppercase grotesk labels

### Equation Comparison
- Two-column grid with 1px gap
- Tau column highlighted with accent background tint
- Labels uppercase grotesk 11px, formulas 19px

### Admonitions
- Left border: 3px solid (accent for default, green for tip, red for caution)
- Background: tinted with corresponding color at 5-7% opacity
- Title: grotesk 13px, uppercase, colored

### Release Cards
- Expandable `<details>` pattern
- Version in accent color (serif)
- Badge pills (red for "Latest")
- 3-column inner grid for New/Changed/Fixed sections

### Roadmap Timeline
- Vertical dashed line at left (`1.5px dashed grid-strong`)
- Circular markers: green filled for shipped, red dot for in-progress, hollow for planned
- Phase numbers in mono badges

---

## Responsive Breakpoints

| Width | Changes |
|-------|---------|
| 860px | Hero goes single-column, docs sidebar collapses |
| 820px | Two-column layouts go single-column |
| 760px | Layers go single-column |
| 720px | Wrap padding shrinks, nav adjusts, red line repositions |
| 680px | Principles grid goes single-column |
| 640px | Eq-cols go single-column, release meta stacks |
| 620px | Family grid goes 2-col |
| 560px | Mobile nav toggle, strip goes single-col, flow-split single-col |
| 480px | Brand-by text hides |

---

## Interactions & Transitions

- Color transitions: `0.2s` (links, buttons, ghost hover)
- Chevron rotation: `0.2s ease`
- Star icon: always red (`var(--red)`)
- Focus visible: `outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px`
- Reduced motion: `scroll-behavior: auto` (no smooth scroll)
