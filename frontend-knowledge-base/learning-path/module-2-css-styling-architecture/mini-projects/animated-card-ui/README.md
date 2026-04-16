# Mini-Project: Animated Card UI

A card gallery showcasing every animation and interactivity technique from **Module 2: CSS & Styling Architecture**. Built with pure HTML, CSS, and a small amount of vanilla JavaScript for progressive enhancement — no frameworks, no build step, no external dependencies beyond a single Google Font.

The fictional theme is a **Frontend Learning Path dashboard** — a set of cards representing module chapters and skill metrics, styled to feel like a real product UI.

## Project Structure

```
animated-card-ui/
├── index.html      # Semantic HTML5 markup with ARIA labels and comments
├── style.css       # All styles — BEM naming, CSS custom properties, animations
├── script.js       # Progressive enhancement only (scroll fallback + keyboard flip)
└── README.md       # This file
```

## How to View

Open `index.html` in any modern browser. No build step is needed.

- **Hover** over each card in the first section to see different hover interaction styles.
- **Hover or press Enter** on the flip cards to reveal the back face.
- **Scroll down** to see the scroll-driven reveal animation in section four (Chrome 115+) or the IntersectionObserver fallback in older browsers.
- **Resize the window** to confirm responsive layouts adapt at every width.
- **Enable "Reduce Motion"** in OS accessibility settings to verify that all animations are disabled respectfully.

---

## Concepts Demonstrated by Chapter

### Chapter 1 – CSS Syntax and Selectors
- BEM naming throughout (`.flip-card__inner`, `.stat-card__bar--cyan`, `.reveal-card__accent--3`)
- Descendant selectors (`.card--reveal:hover .card__reveal-panel`)
- Child combinators (`.flip-card:hover .flip-card__inner`)
- Pseudo-classes `:hover`, `:focus-visible`, `:not()`, and modifier class variants
- Attribute selector on `[style]` implicit targeting via CSS custom properties

### Chapter 2 – The Box Model and Layout
- `box-sizing: border-box` applied globally via `*, *::before, *::after`
- `padding`, `margin`, and `border` used intentionally on every component
- `position: absolute` to layer the flip card front/back halves and the slide-reveal overlay
- `position: relative` and `overflow: hidden` to clip the slide-reveal panel and skeleton shimmer
- `z-index` for page header decoration and skip-link overlay

### Chapter 3 – Typography and Colors
- Google Fonts (`Inter`) loaded via `<link>` in the document head, using `preconnect` hints
- `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform` throughout
- Fluid type sizing with `clamp()`
- Colors in `rgba()` for shadows and overlays, `linear-gradient()` for card fronts and accent strips
- `radial-gradient()` for the page header background decoration
- Text gradient effect using `background-clip: text` and `color: transparent`

### Chapter 4 – Responsive Design
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- All grids use `repeat(auto-fit, minmax(min(100%, …), 1fr))` — one-column on mobile, multi-column on wider screens
- Section padding scales with `clamp()` rather than breakpoints
- Explicit breakpoint at `640px` to lock flip cards to a single column on small screens

### Chapter 5 – Flexbox and Grid
- **CSS Grid**: `card-grid` section layouts using `auto-fit` and `fr` units
- **Flexbox**: internal card layouts — header rows, progress bar containers, list items, button groups
- `gap` for spacing in both grid and flex contexts
- `align-items`, `justify-content`, `flex-direction: column`, and `flex: 1` throughout
- `min(100% - 2rem, 72rem)` container pattern for responsive max-width

### Chapter 6 – Advanced Styling
- **Pseudo-classes**: `:hover`, `:focus-visible` (not `:focus`, to respect browser intent), combinators with state
- **Pseudo-elements**: `::before` on `.badge` for the animated dot indicator; `::before` on `.flip-card__list li` for checkmark icons; `::before` on `.page-header` for the radial decoration; `::before` on `.card--border-trace` for the gradient border glow
- **Transitions**: `transform`, `box-shadow`, `border-color`, `opacity`, `background-color` with different durations and timing functions per variant
- **Animations**: `@keyframes card-entrance` (fade + slide up), `@keyframes bar-fill` (scaleX progress bar), `@keyframes card-reveal` (scroll-driven), `@keyframes shimmer` (loading skeleton), `@keyframes pulse` (badge dot)
- **CSS custom properties**: Full design token system in `:root` for colors, spacing, radii, shadows, and transitions
- **`box-shadow`**: Layered shadows on cards; glow variant with colored spread; lifted shadow on hover
- **`border-radius`**: `var(--radius-lg)` on cards, `var(--radius-full)` on tags and badges
- **`filter`**: Mentioned in comments; `backdrop-filter: blur()` on the slide-reveal overlay
- **`clip-path`**: Not used directly, but the gradient-border trace effect uses the same positioning technique

### Chapter 7 – CSS Frameworks & Libraries
- Google Fonts loaded via `<link>` — the same CDN loading pattern used with Bootstrap and Tailwind
- `preconnect` resource hints are included, matching the recommended setup from framework CDN docs
- The project uses no utility framework but follows a utility-friendly naming convention that could extend with Tailwind classes

### Chapter 8 – Advanced CSS Concepts
- `clamp(min, preferred, max)` on all major font sizes and section padding
- `min(100% - 2rem, 72rem)` for the fluid-but-capped container
- `calc()` for staggered `animation-delay`: `calc(var(--stagger, 0) * 80ms)`
- CSS custom properties (`--bar-width`, `--stagger`) passed inline from HTML to CSS, demonstrating the token architecture pattern
- `animation-fill-mode: both` (written as the shorthand keyword `both`) ensures animations respect their start and end states

### Chapter 9 – CSS Architecture at Scale
- Strict BEM semantics: Block (`.flip-card`), Element (`__inner`, `__front`, `__back`, `__title`), Modifier (`--cyan`, `--emerald`, `--lift`, `--glow`)
- All design values live in `:root` custom properties — a minimal design token system
- CSS is organized by component section with clear comment headers, mirroring ITCSS layer thinking
- No selector specificity higher than a single class; all overrides use BEM modifiers

### Chapter 10 – Animation and Visual Performance
- **Compositor-friendly properties**: all hover, flip, and entrance animations use only `transform` and `opacity` — no layout-triggering properties such as `width`, `height`, `top`, or `margin`
- **Progress bar**: uses `transform: scaleX()` with `transform-origin: left center` instead of animating `width`
- **3D flip**: `transform: rotateY(180deg)`, `transform-style: preserve-3d`, `backface-visibility: hidden` — all compositor-handled
- **Scroll-driven animations**: `animation-timeline: view()` with `animation-range: entry 0% entry 40%` for the reveal cards; wrapped in `@supports` for progressive enhancement
- **IntersectionObserver fallback**: `script.js` detects when `animation-timeline` is unsupported and applies `.is-visible` class-based transitions instead
- **`prefers-reduced-motion`**: global `@media (prefers-reduced-motion: reduce)` block sets all animation durations to `0.01ms`, keeping transitions instant without removing interactivity
- **`will-change`**: intentionally omitted — the project relies on browser heuristics for layer promotion rather than forcing it
