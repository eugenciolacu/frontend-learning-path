# Mini-Project: Responsive Landing Page

A responsive product landing page for **Horizon**, a fictional project management SaaS. Built with pure HTML and CSS — no frameworks, no JavaScript — demonstrating the complete set of styling techniques from Module 2: CSS & Styling Architecture.

## Project Structure

```
responsive-landing-page/
├── index.html      # Semantic HTML5 page markup
├── style.css       # All styles (mobile-first, BEM-style naming)
└── README.md       # This file
```

## How to View

Open `index.html` in any modern browser. No build step needed.

Resize the browser window to explore the responsive layout — the navigation, grid sections, and typography all adapt from mobile to desktop.

---

## Concepts Demonstrated by Chapter

### Chapter 1 – CSS Syntax and Selectors
- BEM-style class naming (`.feature-card__title`, `.pricing-card--featured`)
- Combinators: descendant (` `), child (`>`), adjacent sibling (`+`)
- Pseudo-classes: `:hover`, `:focus-visible`, `:nth-child()`, `:not()`, `:first-child`, `:last-child`
- Pseudo-elements: `::before` for step counters, checkmarks, decorative shapes

### Chapter 2 – The Box Model and Layout
- `box-sizing: border-box` applied globally via `*`
- `padding`, `margin`, and `border` used intentionally on every component
- `position: sticky` for the site header
- `position: absolute` for badge labels and decorative elements
- `overflow: hidden` on card and mockup containers
- `z-index` for the layered navigation and decorative circles

### Chapter 3 – Typography and Colors
- Google Fonts (`Inter`) loaded via `<link>` in the document head
- `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`
- Fluid type sizing with `clamp()`
- Colors in hex (`#2563eb`), `rgb()`, `rgba()`, and `hsl()`
- Linear gradients: hero background, CTA section, text gradient on the hero heading
- Radial gradients for decorative background circles
- `background-size`, `background-position`, and layered backgrounds

### Chapter 4 – Responsive Design
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Mobile-first** strategy: base styles target narrow screens, `@media (min-width: ...)` adds complexity
- Breakpoints at `640px`, `768px`, and `1024px`
- `clamp()` for fluid font sizes and spacing that work across all widths without breakpoints
- `width: min(100% - 2rem, 72rem)` container pattern for responsive max-width
- Responsive grid: 1 → 2 → 3 columns for the features and pricing sections

### Chapter 5 – Flexbox and Grid
- **Flexbox**: navigation bar, hero actions row, logos strip, stats row, testimonials, CTA buttons
- **CSS Grid**: features section, pricing cards, "how it works" steps, footer columns
- `gap`, `justify-content`, `align-items`, and `align-self` throughout
- `flex-wrap: wrap` for natural reflowing of nav links and action buttons
- `fr` units and `repeat(auto-fit, minmax())` for intrinsically responsive grids

### Chapter 6 – Advanced Styling
- **Pseudo-classes**: `:hover`, `:focus-visible`, `:nth-child(2)`, `:first-child`, `:last-child`, `:not()`
- **Pseudo-elements**: `::before` for CSS counters in steps, checkmarks/crosses in pricing, hero decoration
- **Transitions**: `background-color`, `transform`, `box-shadow`, `opacity`, `color` on all interactive elements
- **Animations**: `@keyframes fadeInUp` for hero content entrance; `@keyframes float` for the hero visual
- **CSS custom properties**: full design token system defined in `:root`
- **box-shadow**: layered shadows on cards, buttons, and the featured pricing card
- **border-radius**: rounded cards, pill-shaped badges, circular avatars
- **filter**: `grayscale(1)` on logo items, removed to full color on `:hover`
- **clip-path**: diagonal cut applied to the stats section background strip

### Chapter 7 – CSS Frameworks & Libraries
- Google Fonts loaded via `<link>` — the same CDN loading pattern used with Bootstrap and Tailwind
- The project uses no utility framework but is structured so a framework could replace or extend its classes

### Chapter 8 – Advanced CSS Concepts
- `clamp(min, preferred, max)` on all heading font sizes and the container's padding
- `min(100% - 2rem, 72rem)` for the fluid-but-capped container
- `calc()` for fine spacing adjustments
- Custom properties organized as a scalable token architecture with semantic naming

### Chapter 9 – CSS Architecture at Scale
- Design tokens defined in `:root` for colors, spacing, typography, shadows, radii, and transitions
- BEM-style naming keeps selectors flat (no deep nesting, no ID selectors) and predictable
- File organized in named layers: tokens → reset → base → utilities → components → responsive → animations → accessibility

### Chapter 10 – Animation and Visual Performance
- All animations use `transform` and `opacity` (GPU-composited, no layout or paint triggers)
- `@keyframes float` uses `translateY` — hardware-accelerated
- `@media (prefers-reduced-motion: reduce)` disables non-essential animations and transitions

---

## Learning Checkpoints

After studying this project, you should be able to:

- [ ] Explain how the design tokens in `:root` make it easy to retheme the entire page by changing a few values
- [ ] Identify every place `Flexbox` is used versus `CSS Grid`, and explain why each was chosen
- [ ] Trace the mobile-first breakpoints and describe what changes at `640px`, `768px`, and `1024px`
- [ ] Explain how the `.step__number::before` rule uses CSS counters to auto-number the steps
- [ ] Find every `clamp()` call and state what the minimum, preferred, and maximum values represent
- [ ] Describe why the animated elements use `transform` and `opacity` rather than `width`, `top`, or `margin`
- [ ] Locate the `prefers-reduced-motion` rule and explain why it is important
