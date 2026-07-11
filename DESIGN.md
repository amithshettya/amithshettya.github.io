# Design Specification — amithshettya.github.io

Personal portfolio and blog for Amith Shetty, Software Engineer.

---

## Design Principles

- **Content-first**: typography and spacing optimized for readability
- **Clean workspace aesthetic**: subtle grid background suggests an engineering notebook without overwhelming content
- **Low visual noise**: restrained color palette, minimal decorative elements
- **Dark mode native**: designed for both light and dark themes from the start

---

## Colors

### Light Theme

| Token | Value | Usage |
|---|---|---|
| `--color-ground` | `#FFFFFF` | Page background, card backgrounds |
| `--color-grid-line` | `#DCE4F2` | Background grid lines, subtle borders |
| `--color-grid-strong` | `#C9D6EE` | Borders, separators, input borders |
| `--color-ink` | `#13213C` | Primary text, headings |
| `--color-ink-soft` | `#54607A` | Secondary text, captions, sidebar links, metadata |
| `--color-accent` | `#1B3FA0` | Links, active states, brand color |
| `--color-red` | `#D6435B` | Eyebrow labels, badges, CTAs |
| `--color-paper-edge` | `#EEF2FA` | Inline code backgrounds, subtle surfaces |
| `--color-terminal` | `#0e1a30` | Code block backgrounds |

### Dark Theme

| Token | Value | Usage |
|---|---|---|
| `--color-dark-ground` | `#0f172a` | Page background, card backgrounds |
| `--color-dark-grid-line` | `#1e293b` | Background grid lines |
| `--color-dark-grid-strong` | `#334155` | Borders, separators |
| `--color-dark-ink` | `#f1f5f9` | Primary text, headings |
| `--color-dark-ink-soft` | `#94a3b8` | Secondary text, captions |
| `--color-dark-accent` | `#60a5fa` | Links, active states |
| `--color-dark-red` | `#fb7185` | Eyebrow labels, badges |
| `--color-dark-paper-edge` | `#1e293b` | Inline code backgrounds |

### Color Semantics

| Color | Semantic Meaning |
|---|---|
| Accent (blue) | Interactive elements, links, active/selected states |
| Red | Decorative emphasis (eyebrow labels, badges, star icon) |
| Ink | Primary content |
| Ink-soft | Supporting content, metadata |

---

## Typography

### Font Families

| Token | Stack | Usage |
|---|---|---|
| `--font-serif` | `"Satoshi", ui-sans-serif, system-ui, sans-serif` | Body text, prose, headings (despite the token name, Satoshi is a clean sans-serif chosen for readability) |
| `--font-grotesk` | `"Space Grotesk", ui-sans-serif, system-ui, sans-serif` | UI elements, nav, labels, buttons, sidebar |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` | Code, reading time, version badges, marquee tags |
| `--font-hand` | `"Caveat", "Segoe Print", cursive` | Hero heading, page headings, eyebrow callouts |

### Type Scale

| Element | Font | Size | Weight | Line-height | Notes |
|---|---|---|---|---|---|
| Body | Satoshi | 18px | 400 | 1.6 | |
| Hero heading | Caveat | `clamp(48px, 8.5vw, 92px)` | 500 | 1.02 | letter-spacing: -0.005em |
| Page heading | Caveat | `clamp(48px, 7.5vw, 72px)` | 500 | 1.02 | |
| Section heading | Caveat | `clamp(32px, 5vw, 46px)` | 500 | 1 | |
| Section number | Space Grotesk | `clamp(64px, 10vw, 96px)` | 300 | 1 | color: grid-strong, decorative |
| Eyebrow (hand) | Caveat | 22px | 600 | — | color: red, letter-spacing: 0.01em |
| Eyebrow (small) | Caveat | 18px | 600 | — | color: red |
| Lede | Satoshi | 19px | 400 | 1.6 | max-width: 30em |
| Nav links | Space Grotesk | 14.5px | 400 | — | color: ink-soft |
| Sidebar group label | Space Grotesk | 12.5px | 500 | — | uppercase, letter-spacing: 0.06em |
| Category name | Space Grotesk | 13.5px | 400 | — | |
| Subpost link | Space Grotesk | 13px | 400 | 1.4 | |
| Ghost CTA | Space Grotesk | 15px | 500 | — | color: accent, border-bottom: 1.5px |
| Badge | Space Grotesk | 11px | 500 | — | uppercase, letter-spacing: 0.1em |
| Pill | Space Grotesk | 13px | 500 | — | |
| Pill count | JetBrains Mono | 11px | 400 | — | opacity: 0.65 |
| Star CTA | Space Grotesk | 14px | 500 | — | |
| Reading time | JetBrains Mono | 12px | 400 | — | |
| Prose body | Satoshi | 17px | 400 | 1.7 | |
| Prose h2 | Satoshi | 28px | 400 | — | italic, border-top separator, letter-spacing: -0.01em |
| Prose h3 | Space Grotesk | 19px | 600 | — | |
| Inline code | JetBrains Mono | 0.85em | — | — | |
| Code block | JetBrains Mono | 14px | — | 1.7 | |
| Marquee tag | JetBrains Mono | 14px | — | — | |

---

## Spacing

### Layout Tokens

| Token | Value |
|---|---|
| Grid unit (`--cell`) | 28px |
| Content max-width | 1080px |
| Wrap padding (desktop) | 32px |
| Wrap padding (mobile ≤720px) | 22px |
| Sidebar width | 256px |

### Section Spacing

| Context | Value |
|---|---|
| Hero bottom margin | 64px |
| Section vertical margin | 80px top, 64px bottom |
| Section heading bottom margin | 24px |
| Card grid gap | 16px |
| CTA row gap | 12px |
| Main content padding | 32px |
| Sidebar padding | 24px |

---

## Background

### Grid Pattern

- 28px × 28px grid rendered as `linear-gradient` on `body`
- Light theme: `#DCE4F2` lines on `#FFFFFF` fill
- Dark theme: `#1e293b` lines on `#0f172a` fill
- Radial gradient overlay at top for hero readability

---

## Layout System

### Root Layout

- **Flexbox row**: sidebar (256px, shrink-0) + main content (flex-1, max-width 1080px)
- Sidebar: sticky left panel with navigation, blog categories, expandable subposts
- Main: centered content area with padding

### Page Templates

- **Home**: hero section, "What I Do" 2-column card grid, featured blog posts list
- **About**: prose content with tech skills marquee
- **Blog index**: category filter pills, post card list
- **Blog post**: prose content with prev/next navigation

---

## Components

### Cards

- Semi-transparent white background: `rgba(255,255,255,0.6)`
- 1px `grid-strong` border, 6px border radius
- Backdrop blur: 1px
- Box shadow: layered (near + far)
- Hover: border turns accent, slight lift (translateY(-1px))
- Dark theme: `rgba(30,41,59,0.8)` background

### Featured Card

- Padding: 24px (1.5rem)
- Same styling as regular cards with larger presence

### Sidebar

- Width: 256px
- Right border (grid-strong)
- Semi-transparent background with backdrop blur
- Expandable blog categories with chevron rotation
- Active state highlighting

### Category Pills

- Rounded pill shape (999px radius)
- 1px grid-strong border
- Transition border/accent color on hover
- Active state: accent background, white text
- Pill count in mono font

### Ghost CTA

- Accent color text
- 1.5px bottom border (grid-strong, turns accent on hover)
- Hover opacity transition

### Star CTA

- Pill shape (20px radius)
- 1px grid-strong border
- Star icon in red
- Hover: border turns accent, background tint

### Badge

- Red background, white text
- Full round (999px radius)
- Uppercase Space Grotesk, 11px

### Code (Prose)

- **Inline**: paper-edge background, 1px grid-strong border, 3px radius
- **Block**: terminal-dark background (`#0e1a30`), light text (`#c9d1d9`), 6px radius

### Marquee (About Page)

- Auto-scrolling horizontal track of tech tags
- Mono font, accent color
- Pauses on hover
- Gradient fade edges

### Dark Mode Toggle

- Fixed position: top-right (desktop), top-right (mobile)
- Sun/moon icon swap
- Transitions background on hover

### Mobile Menu

- Hamburger button: fixed top-left, visible only ≤768px
- Sidebar becomes slide-in drawer (translateX transition)
- Dark overlay backdrop with blur

### Skip to Content

- Hidden by default, visible on focus
- Accent background, white text
- For keyboard accessibility

---

## Responsive Breakpoints

| Width | Changes |
|---|---|
| 768px | Sidebar becomes fixed overlay drawer. Mobile menu button appears. Main content gets top padding. Dark mode toggle repositions. Pills get larger. Headings center-align. |
| 720px | Content wrap padding reduces from 32px to 22px. |
| 560px | Grid unit variable explicitly set (preserves grid rendering at small sizes). |
| 640px (sm) | "What I Do" cards switch to 2-column grid. |

---

## Interactions & Transitions

| Element | Duration | Property |
|---|---|---|
| Links, buttons, ghost hover | 0.2s | color |
| Cards hover | 0.2s | border-color, box-shadow, transform |
| Pills hover | 0.2s | color, border-color, background-color |
| Chevron rotation | 0.2s ease | transform |
| Sidebar open/close | 0.3s ease | transform |
| Sidebar subposts | 0.2s ease | max-height |
| Star CTA hover | 0.15s | color, border-color, background-color |
| Marquee | 25s linear infinite | transform (translateX) |
| Backdrop filter | 0.2s | — |

### Accessibility

| Concern | Implementation |
|---|---|
| Focus visible | `outline: 2px solid var(--color-accent); outline-offset: 3px; border-radius: 2px` |
| Skip link | Hidden `.skip-to-content` anchor, visible on focus |
| Reduced motion | `prefers-reduced-motion: reduce` disables smooth scroll and marquee animation |
| Keyboard nav | All interactive elements are links/buttons with focus styles |

---

## State Management

### Dark Mode (Zustand + localStorage)

- Defaults to OS preference (`prefers-color-scheme`)
- Persisted to `localStorage` key `"dark-mode"`
- Toggles `class="dark"` on `<html>` element
- All color tokens switch via CSS `@custom-variant`

### Sidebar (Zustand)

- `isOpen: false` by default
- Toggle and close actions
- Auto-closes on navigation link click
- Mobile overlay backdrop closes sidebar on click

---

## Content Structure

### Blog Categories (8)

1. Scalable System Design
2. Distributed Systems
3. Databases
4. Computer Networks
5. Software Architecture
6. Computer Architecture
7. Parallel Programming
8. Large Language Models

### Navigation

- Home (`/`)
- About (`/about`)
- Blog (`/blog`)
  - `/blog/:category` (filtered listing)
  - `/blog/:category/:slug` (individual post)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 with custom `@theme` tokens |
| State | Zustand |
| Markdown | Marked (blog posts) |
| Build | Vite 8 |
| Deploy | Cloudflare Workers |
