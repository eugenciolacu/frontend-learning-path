# Module 2: CSS & Styling Architecture

## Overview
This module builds a comprehensive understanding of CSS, starting from syntax and selector fundamentals, then progressing through the box model, typography, color, responsive design, modern layout systems, advanced styling effects, and finally large-scale CSS architecture and performance-aware animation. It combines visual design thinking, browser-rendering knowledge, and practical tooling so learners can move from writing basic styles to constructing maintainable, scalable, and production-ready styling systems.

## Learning Objectives
- Understand CSS syntax and select elements precisely using basic, advanced, and pseudo selectors.
- Explain how the browser calculates element size and position using the box model and normal document flow.
- Apply typography and color choices that improve readability, hierarchy, and visual accessibility.
- Build responsive interfaces using media queries, relative units, and mobile-first strategies.
- Construct one-dimensional and two-dimensional layouts with Flexbox and CSS Grid.
- Create interactive and polished styling through transitions, animations, custom properties, and visual effects.
- Use CSS frameworks such as Bootstrap and Tailwind CSS efficiently with appropriate customization.
- Understand the browser's rendering pipeline and apply advanced CSS features such as container queries, cascade layers, and modern color functions.
- Organize large CSS codebases using architectural methodologies, naming conventions, preprocessors, and design tokens.
- Build high-performance animations using compositor-friendly techniques, the FLIP method, View Transitions API, and scroll-driven animations.
- Reinforce theory through hands-on examples and mini-projects that progress from styled pages to complete design systems.

## Prerequisites
- Completion of Module 1: HTML & Web Standards, or equivalent familiarity with HTML document structure and semantic elements.
- Basic comfort using a code editor and a web browser with developer tools.

## Chapters

### Chapter 1: CSS Syntax and Selectors
Introduces the grammar of CSS and the selector system used to target HTML elements for styling.

Topics covered:
- What CSS is and the three main ways to write it: external stylesheets, internal stylesheets, and inline styles.
- CSS rule structure: selectors, declarations, properties, and values.
- Basic selectors: element, class, and id.
- Advanced selectors: descendant, child, adjacent sibling, and general sibling combinators.
- Attribute selectors and their matching operators.
- Pseudo-classes such as `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`, and form-state selectors.
- Pseudo-elements: `::before`, `::after`, `::first-line`, and `::first-letter`.
- Specificity, the cascade, and how browsers resolve conflicting styles.
- Inheritance and the `inherit`, `initial`, and `unset` keywords.

Practice assets:
- `01-rule-syntax-and-basic-selectors`
- `02-combinators`
- `03-attribute-and-pseudo-selectors`
- `04-specificity-and-cascade`
- `05-inheritance-and-currentcolor`

### Chapter 2: The Box Model and Layout
Explains how browsers calculate element size and position within normal document flow.

Topics covered:
- The four layers of the CSS box model: content, padding, border, and margin.
- How width, height, and spacing are calculated and the effect of `box-sizing: border-box`.
- Display modes: `block`, `inline`, `inline-block`, and `none`.
- The five position values: `static`, `relative`, `absolute`, `fixed`, and `sticky`, and how containing blocks are established.
- Float-based layouts, how floats affect surrounding content, and how `clear` restores flow.
- Overflow control with `overflow: visible`, `hidden`, `scroll`, and `auto`.
- Stacking context, `z-index`, and the rules that determine when `z-index` takes effect.
- Common layout bugs: margin collapsing, negative margins, and clearfix patterns.

Practice assets:
- `01-box-model-layers`
- `02-display-modes`
- `03-positioning-playground`
- `04-float-and-clear-layout`
- `05-overflow-and-z-index`

### Chapter 3: Typography and Colors
Demonstrates how CSS controls the visual tone and readability of a page through font choices and color systems.

Topics covered:
- Font properties: `font-family`, `font-size`, `font-weight`, `font-style`, `font-variant`, and `line-height`.
- Building safe font stacks with system fonts and fallback fonts.
- Loading and applying web fonts using Google Fonts via `<link>` and `@import`.
- Text alignment, decoration, transformation, spacing, and indentation.
- Color formats: named colors, hex, `rgb()`, `rgba()`, `hsl()`, and `hsla()`.
- Color contrast and accessibility implications when choosing foreground and background pairs.
- Background color, background images, `background-repeat`, `background-position`, `background-size`, and shorthand.
- Linear gradients, radial gradients, and repeating gradient patterns.

Practice assets:
- `01-font-stacks-and-scale`
- `02-google-fonts-integration`
- `03-text-formatting-and-spacing`
- `04-color-formats-and-alpha`
- `05-backgrounds-and-gradients`

### Chapter 4: Responsive Design
Teaches how to build interfaces that adapt to different screen sizes and resolutions without separate codebases.

Topics covered:
- What responsive design is and why it matters for modern web development.
- The viewport meta tag and its role in mobile rendering.
- Writing media queries with `min-width`, `max-width`, `min-height`, and `max-height`.
- Mobile-first vs desktop-first CSS strategies and their practical tradeoffs.
- Choosing breakpoints based on content needs rather than device names.
- Responsive images with percentage widths, `max-width`, and aspect-ratio control.
- Fluid typography with relative units and `clamp()`.
- Accessibility and performance considerations when building responsive interfaces.

Practice assets:
- `01-viewport-and-mobile-first`
- `02-breakpoints-and-media-queries`
- `03-min-max-width-and-height`
- `04-responsive-images`
- `05-fluid-typography`

### Chapter 5: Flexbox and Grid
Covers the two primary modern CSS layout systems and teaches when to apply each one.

Topics covered:
- The difference between one-dimensional and two-dimensional layout.
- Flex container properties: `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, and `gap`.
- Flex item properties: `order`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`.
- Common Flexbox patterns: navigation bars, card rows, and sidebar layouts.
- CSS Grid container properties: `grid-template-columns`, `grid-template-rows`, `grid-template-areas`, and `gap`.
- `fr` units, `repeat()`, `minmax()`, and auto-placement rules.
- Named grid areas for readable, explicit layouts such as dashboards.
- Responsive grids with `auto-fill`, `auto-fit`, and `minmax()`.
- Deciding when Flexbox is the right tool and when Grid is the right tool.

Practice assets:
- `01-flex-axis-alignment`
- `02-flex-navigation-and-cards`
- `03-grid-columns-and-gap`
- `04-grid-template-areas-dashboard`
- `05-responsive-grid-gallery`

### Chapter 6: Advanced Styling
Introduces state-based selectors, generated content, transitions, keyframe animations, CSS custom properties, and visual effects.

Topics covered:
- Pseudo-classes for interactive states: `:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within`.
- Structural pseudo-classes: `:nth-child`, `:first-child`, `:last-child`, `:only-child`, `:empty`.
- Form-state pseudo-classes: `:checked`, `:disabled`, `:valid`, `:invalid`.
- Pseudo-elements `::before` and `::after` for decorative content and UI patterns.
- `::first-line` and `::first-letter` for drop-cap and editorial text effects.
- CSS transitions: `transition-property`, `transition-duration`, `transition-timing-function`, and `transition-delay`.
- Keyframe animations: `@keyframes`, `animation-name`, `animation-duration`, `animation-iteration-count`, `animation-fill-mode`, and related properties.
- CSS custom properties: declaring, reading, scoping, overriding, and using fallback values.
- Visual effects: `box-shadow`, `text-shadow`, `filter`, `backdrop-filter`, `border-radius`, and `clip-path`.
- Accessibility considerations: focus ring preservation, `prefers-reduced-motion`, and decorative content.

Practice assets:
- `01-pseudo-classes-and-focus-states`
- `02-pseudo-elements-and-decorative-details`
- `03-transitions-and-state-changes`
- `04-keyframes-and-animation-sequences`
- `05-css-variables-and-theming`
- `06-shadows-filters-border-radius-and-clip-path`

### Chapter 7: CSS Frameworks & Libraries
Introduces component-oriented and utility-first CSS frameworks and explains how to choose, install, and customize them.

Topics covered:
- What CSS frameworks and styling libraries are and why teams use them.
- Installing Bootstrap via CDN and via npm, and using its responsive grid system.
- Setting up Tailwind CSS with a CDN prototype workflow and a build-based workflow.
- Applying utility classes to control spacing, color, typography, layout, and responsiveness.
- Building responsive page sections and card layouts with Bootstrap's grid and Tailwind's flex/grid utilities.
- Customizing Bootstrap with CSS variables and Sass overrides.
- Configuring Tailwind's theme with custom tokens, colors, and breakpoints.
- Comparing Bootstrap and Tailwind in terms of developer experience, bundle size, maintainability, and use cases.
- Avoiding common mistakes such as shipping unused CSS, over-nesting utility classes, or skipping accessibility considerations.

Practice assets:
- `01-bootstrap-cdn-layout`
- `02-tailwind-play-cdn-utilities`
- `03-bootstrap-theme-customization`
- `04-tailwind-build-and-theme`

### Chapter 8: Advanced CSS Concepts (Advanced)
Examines browser rendering internals and modern CSS features required for scalable and performant stylesheets.

Topics covered:
- The CSS Object Model (CSSOM), render tree construction, layout, paint, and the critical rendering path.
- How render-blocking CSS works and practical strategies to reduce unnecessary rendering cost.
- Advanced CSS Grid: subgrid for aligned nested components and progressive enhancement for masonry-style layouts.
- Flexbox mastery: axis reasoning, intrinsic sizing, wrapping behavior, alignment edge cases, and common overflow problems.
- Container queries: how they differ from viewport media queries and how to build component-driven responsive layouts.
- Cascade layers with `@layer` for managing stylesheet priority intentionally.
- Organizing CSS custom properties into a scalable token architecture supporting themes and dark mode.
- Advanced CSS functions: `calc()`, `min()`, `max()`, and `clamp()` for fluid and constrained sizing.
- Perceptual color spaces: `lch()` and `oklab()` with `@supports` fallbacks for progressive enhancement.

Practice assets:
- `01-cssom-and-critical-rendering-path`
- `02-advanced-grid-subgrid-and-progressive-masonry`
- `03-flexbox-mastery-patterns`
- `04-container-queries-and-cascade-layers`
- `05-custom-properties-architecture-and-theming`
- `06-css-functions-and-modern-color-spaces`

### Chapter 9: CSS Architecture at Scale (Advanced)
Explains how to organize, maintain, and scale CSS across large codebases using methodologies, tooling, and design token systems.

Topics covered:
- Why CSS becomes difficult to manage at scale and common failure modes in large stylesheets.
- BEM: block, element, and modifier naming for conflict-free component styles.
- ITCSS: organizing CSS by specificity layer from settings to utilities.
- CUBE CSS: composition, utility, block, and exception as an architectural model.
- CSS Modules: file-scoped class names for component-based projects.
- CSS-in-JS with Styled Components and Emotion: dynamic styles, theming, and runtime trade-offs.
- Utility-first CSS with Tailwind: design constraints, purge configuration, and maintainability patterns.
- Sass advanced tooling: partials, mixins, functions, loops, and map-based token management.
- PostCSS ecosystem: autoprefixer, postcss-preset-env, and plugin-based transformations.
- Design tokens: what they are, how they connect design decisions to code, and their role in component libraries.

Practice assets:
- `01-bem-component-architecture`
- `02-itcss-layered-styles`
- `03-cube-css-composition-and-utilities`
- `04-scope-strategies-css-modules-css-in-js-and-utilities`
- `05-sass-and-postcss-pipeline`
- `06-design-tokens-and-component-library`

### Chapter 10: Animation and Visual Performance (Advanced)
Focuses on rendering-pipeline reasoning, high-performance animation techniques, modern animation APIs, and accessible motion.

Topics covered:
- How style recalculation, layout, paint, and compositing affect animation performance.
- Which CSS properties are safe to animate on the compositor thread and which ones trigger expensive layout or paint.
- The FLIP technique: First, Last, Invert, Play for animating layout changes efficiently.
- Hardware acceleration through `will-change` and transform-based motion, used carefully rather than as a default.
- The View Transitions API for animating same-document and cross-document state changes, with graceful fallbacks.
- Scroll-driven animations with `animation-timeline: scroll()` and `view()` for scroll-linked and scroll-revealed effects.
- Respecting `prefers-reduced-motion` and providing accessible alternatives to motion-heavy interfaces.
- Measuring animation performance using browser DevTools flame charts, the Layers panel, and frame rate monitoring.

Practice assets:
- `01-compositor-friendly-motion`
- `02-flip-technique-layout-transitions`
- `03-view-transitions-api-navigation`
- `04-scroll-driven-animations`

## Mini-Projects
The module concludes with larger practice exercises that combine multiple chapter concepts:

- `responsive-landing-page`: responsive layout, Flexbox or Grid, media queries, typography, color, and visual polish.
- `animated-card-ui`: advanced styling effects, CSS transitions, keyframe animations, and pseudo-element decoration.
- `complete-design-system-implementation-using-storybook`: CSS architecture, design tokens, component library patterns, and Storybook integration.

## Module Outcomes
By the end of this module, learners should be able to write precise and maintainable CSS for real-world interfaces, build fully responsive layouts using Flexbox and Grid, understand how the browser renders styles and where performance is won or lost, apply advanced styling techniques with purpose and accessibility in mind, and organize large CSS codebases using proven architectural patterns and modern tooling.
