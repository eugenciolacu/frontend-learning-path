# Mini-Project: Complete Design System Implementation Using Storybook

A **complete, token-driven design system visual catalog** — the "Nova Design System" — built with pure HTML, CSS, and a small amount of vanilla JavaScript. No frameworks, no build step, no external UI dependencies beyond one Google Font.

The catalog is styled to look and function like [Storybook](https://storybook.js.org/): a sidebar for navigation, a main panel that isolates each component, code snippets below each story, and a dark/light theme toggle. Every component, layout pattern, and animation in the catalog demonstrates a concept from **Module 2: CSS & Styling Architecture**.

## How to View

Open `index.html` in any modern browser. No installation or build step is needed.

- **Click** sidebar links to navigate to a section.
- **Scroll** to see scroll-reveal animations and progress-bar triggers.
- **Toggle** the ☀ / ☾ button in the header to switch between light and dark themes (uses the View Transitions API where supported).
- **Hover** over interactive cards and buttons to see transition effects.
- **Select/deselect** chips in the Chip story.
- **Resize** the window — the layout adapts from a two-column shell to a single-column view under 768 px.
- **Enable "Reduce Motion"** in OS accessibility settings to confirm that all animations are disabled respectfully.

---

## Project Structure

```
complete-design-system-implementation-using-storybook/
├── index.html              # Storybook-like visual catalog
├── script.js               # Theme switching, nav, IntersectionObserver
├── tokens.json             # Technology-agnostic design tokens (source of truth)
├── styles/
│   ├── 01-tokens.css       # ITCSS Layer 1 — Design tokens
│   ├── 02-reset.css        # ITCSS Layer 2 — Generic reset
│   ├── 03-base.css         # ITCSS Layer 3 — Element defaults
│   ├── 04-layout.css       # ITCSS Layer 4 — Layout objects
│   ├── 05-components.css   # ITCSS Layer 5 — BEM components
│   ├── 06-utilities.css    # ITCSS Layer 6 — Utility classes
│   └── 07-animations.css   # ITCSS Layer 7 — Keyframes & scroll animations
└── README.md               # This file
```

---

## Concepts Demonstrated by Chapter

### Chapter 1 — CSS Syntax and Selectors
- **BEM naming** throughout every component: `.button--primary`, `.card__header`, `.badge--dot`
- **Pseudo-classes**: `:hover`, `:active`, `:focus-visible`, `:disabled`, `:checked`
- **Pseudo-elements**: `::before` for the sidebar active indicator, `::after` for the button loading spinner and required-label asterisk
- **Combinators**: descendant (`.sidebar-nav__item a`), child (`.o-stack > * + *`), adjacent sibling
- **Attribute selectors**: `[data-theme="dark"]`, `[data-path]`

### Chapter 2 — The Box Model and Layout
- `box-sizing: border-box` applied globally in `02-reset.css`
- `overflow: hidden` on cards clips child media to rounded corners
- `position: sticky` for the sidebar and main header bars
- `position: absolute` for the active-indicator bar on sidebar links and the loading spinner
- `z-index` scale defined as tokens and used in the catalog header and sidebar
- `scroll-margin-top` on story sections to compensate for the sticky header

### Chapter 3 — Typography and Colors
- **Google Fonts** (`Inter`, `JetBrains Mono`) loaded via `<link>` with `preconnect` hints
- Full **type scale** from `--text-xs` (0.75 rem) to `--text-5xl` (3 rem)
- `font-weight`, `line-height`, `letter-spacing`, `text-transform` throughout
- **Colors in multiple formats**: `rgba()` for shadow overlays and focus rings, `hsl` equivalents via CSS custom properties
- **Linear and radial gradients**: button loading overlay, avatar backgrounds, hero accents, progress bar fill
- `background-image`, `background-position`, `background-size` for the select chevron icon

### Chapter 4 — Responsive Design
- **Viewport meta tag**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Mobile-first**: base catalog layout is single-column; the two-panel shell is added with `@media (min-width: 768px)` — actually the reverse is in this project because the catalog shell is desktop-first and collapses at `max-width: 768px`
- **Responsive form grid**: the two-column name row gracefully falls to one column on narrow viewports
- Form elements (`input`, `select`, `textarea`) inherit font via the `font: inherit` reset
- Semantic form structure with `<label>`, `<input>`, `<textarea>`, `<select>`, `<form>`

### Chapter 5 — Flexbox and Grid
- **CSS Grid named areas** for the catalog shell: `sidebar-header / main-header / sidebar / main`
- **`auto-fit` + `minmax()`** in `.o-grid` — zero media queries, fully intrinsic responsive grid
- **Flexbox** in every component: button content alignment, card header/footer, sidebar nav, avatar group overlap via `flex-direction: row-reverse` and negative margin
- **`fr` units** and `gap` throughout
- Layout objects (`.o-grid`, `.o-cluster`, `.o-stack`, `.o-split`) cover the most common patterns

### Chapter 6 — Advanced Styling
- **Transitions** on every interactive element: `background-color`, `color`, `border-color`, `box-shadow`, `transform`
- **`:hover`** on cards (`translateY(-3px)` + shadow), buttons (`translateY(-1px)`), nav links (background)
- **`:active`** on buttons — snap back to `translateY(0)`
- **`:focus-visible`** on all interactive elements — keyboard users see a clear ring; mouse users do not
- **`:disabled`** on buttons and inputs with `pointer-events: none` and reduced opacity
- **`::before`** pseudo-element: sidebar active indicator bar, badge dot indicator
- **`::after`** pseudo-element: button loading spinner, required-label asterisk
- **CSS variables** (`--space-4`, `--color-brand`, etc.) reused everywhere; the dark theme is a single token override block
- **`box-shadow`** as a design element: shadow scale, card elevation, featured card double-border trick
- **`border-radius`**: `var(--radius-full)` for pills, `var(--radius-xl)` for cards, `var(--radius-lg)` for buttons
- **`filter`**: background on the select chevron icon is achieved with an SVG data URI
- **`clip-path`**: avatar images are clipped by `overflow: hidden` on the `border-radius: full` container

### Chapter 7 — CSS Frameworks & Libraries
- **Utility-first approach** mirrors what Tailwind CSS provides: single-purpose classes like `.u-flex`, `.u-text-sm`, `.u-gap-4`, `.u-rounded-lg`
- **Layout utilities** speed up composition without writing new CSS per page
- **Naming convention** (`u-` prefix) is consistent and predictable — a reduced version of the Tailwind utility namespace

### Chapter 8 — Advanced CSS Concepts (Advanced)
- **Container queries** on `.card`: `container-type: inline-size` + `@container (min-width: 380px)` increases inner padding when the card has room, independent of viewport width
- **`clamp()`**: fluid heading in the Typography section — `clamp(1.5rem, 5vw, 3rem)`
- **`min()`**: `.o-wrapper` uses `width: min(100% - 2 * var(--space-4), 72rem)` for a fluid max-width without media queries
- **CSS custom properties architecture**: two-tier token system (primitive + semantic) so the dark theme only redefines semantic tokens
- **Dark theme**: all 40+ semantic tokens swap via a single `[data-theme="dark"]` rule — no component CSS changes

### Chapter 9 — CSS Architecture at Scale (Advanced)
- **ITCSS seven-layer structure** is the file order: `01-tokens → 02-reset → 03-base → 04-layout → 05-components → 06-utilities → 07-animations`
- **BEM** is applied consistently to all components (Block, Element, Modifier pattern)
- **Two-tier design tokens**: primitive values (`--color-teal-700`) and semantic aliases (`--color-brand`) — components only reference semantic tokens
- **`tokens.json`**: technology-agnostic token definitions that serve as the source of truth
- **Layout objects** (`.o-*`) are structure-only — no colors, shadows, or fonts leak into them
- **Utility classes** (`.u-*`) are intentionally `!important` and applied as overrides, not as primary styling
- **Component composition** in patterns: Card Grid and Form Layout compose existing components without any new CSS

### Chapter 10 — Animation and Visual Performance (Advanced)
- **Compositor-safe animations**: all hover animations use `transform` and `opacity` — no `width`, `height`, or `top`/`left` animations that cause layout recalculation
- **Skeleton loader shimmer**: the `shimmer` keyframe uses `translateX` (compositor layer) instead of changing `background-position` (paint layer)
- **View Transitions API**: the theme toggle uses `document.startViewTransition()` in `script.js` for a smooth crossfade when supported
- **Scroll-reveal**: elements with `.js-reveal` have a CSS transition fallback; browsers supporting `animation-timeline: view()` use native scroll-driven animations via `@supports`
- **Progress bar animation**: `IntersectionObserver` triggers a CSS `transition: width` when the bar enters the viewport
- **`prefers-reduced-motion`**: a global `@media (prefers-reduced-motion: reduce)` rule disables all animations; `.js-reveal` elements show immediately without the entrance effect
- **`will-change` utilities** (`.u-will-change-transform`, `.u-will-change-opacity`) are available but ship without being applied globally — documented in `07-animations.css` as a use-with-caution tool

---

## Setting Up Real Storybook

The catalog above runs in the browser without any tooling. To connect it to a real Storybook instance:

### 1. Prerequisites
- Node.js 18+ and npm installed

### 2. Initialize Storybook in an existing project

```bash
# Inside the project root or a new folder
npx storybook@latest init
```

Choose **HTML** as the project type when prompted, or use a framework adapter:

```bash
# For a plain HTML / Vite project
npm create vite@latest nova-ds -- --template vanilla
cd nova-ds
npx storybook@latest init
```

### 3. Write a Story File

Storybook stories for plain HTML components are written as JavaScript objects:

```js
// src/stories/Button.stories.js
export default {
  title: 'Components/Button',
  render: ({ label, variant }) => `
    <button class="button button--${variant}">${label}</button>
  `,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
  },
};

export const Primary = {
  args: { label: 'Primary', variant: 'primary' },
};

export const Secondary = {
  args: { label: 'Secondary', variant: 'secondary' },
};
```

### 4. Import the Design System styles in `.storybook/preview.js`

```js
// .storybook/preview.js
import '../styles/01-tokens.css';
import '../styles/02-reset.css';
import '../styles/03-base.css';
import '../styles/04-layout.css';
import '../styles/05-components.css';
import '../styles/06-utilities.css';
import '../styles/07-animations.css';

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#f8fafc' },
      { name: 'dark',  value: '#0f172a' },
    ],
  },
};
```

### 5. Run Storybook

```bash
npm run storybook
```

### Where to Go Next

- [Storybook Docs](https://storybook.js.org/docs/get-started)
- [Design Tokens community spec](https://design-tokens.github.io/community-group/format/) — the format used in `tokens.json`
- [W3C Container Queries spec](https://drafts.csswg.org/css-contain-3/)
- [MDN — View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [MDN — Scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
