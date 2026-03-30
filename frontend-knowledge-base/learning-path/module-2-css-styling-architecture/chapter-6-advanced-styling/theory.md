# Chapter 6: Advanced Styling

## Overview
This chapter moves from basic styling into effects and behaviors that make interfaces feel interactive and polished. Advanced styling in CSS includes state-based selectors, generated decorative content, smooth transitions, reusable animation sequences, design tokens with custom properties, and visual effects such as shadows, filters, rounded corners, and clipping.

These tools are powerful, but they should be used with purpose. Good advanced styling improves usability, communicates interaction clearly, and supports a visual system. Poor advanced styling adds noise, hurts performance, or creates accessibility problems. A strong frontend developer learns both how to use these features and when to use them carefully.

## Learning Objectives
- Explain what pseudo-classes are and use them for interactive, structural, and form-related states.
- Use pseudo-elements such as `::before`, `::after`, `::first-line`, and `::first-letter` appropriately.
- Build smooth state changes with `transition` and understand duration, timing, delay, and transitioned properties.
- Create reusable motion with `@keyframes` and the `animation` family of properties.
- Define and reuse CSS variables with custom properties and understand scope, inheritance, and fallbacks.
- Apply visual effects such as `box-shadow`, `filter`, `border-radius`, and `clip-path` in practical UI patterns.
- Recognize accessibility and performance concerns related to focus styling, motion, and decorative effects.

## 1. Why Advanced Styling Matters
Basic CSS makes a page readable and structured. Advanced styling helps users understand what is interactive, where they are focusing, and how interface parts relate to each other.

Examples of what advanced styling adds:
- A button changes appearance when hovered or focused.
- A card smoothly lifts when the pointer moves over it.
- A reusable color token updates many components at once.
- A notification fades in instead of appearing abruptly.
- A decorative ribbon or highlight is added without extra HTML.

Important principle:
- Styling should support meaning. Do not add effects only because CSS makes them possible.

## 2. Pseudo-Classes
Pseudo-classes target an element when it is in a particular state or matches a certain condition. They begin with a single colon, such as `:hover` or `:nth-child(2)`.

## 2.1 Interactive State Pseudo-Classes
Interactive state pseudo-classes are used heavily in real interfaces.

```css
.button {
	background-color: #2563eb;
	color: white;
	border-radius: 0.75rem;
	padding: 0.75rem 1rem;
	transition: background-color 180ms ease, transform 180ms ease;
}

.button:hover {
	background-color: #1d4ed8;
	transform: translateY(-2px);
}

.button:active {
	transform: translateY(0);
}

.button:focus-visible {
	outline: 3px solid #93c5fd;
	outline-offset: 3px;
}
```

Explanation:
- `:hover` applies when a pointing device is over the element.
- `:active` applies during the press interaction.
- `:focus-visible` applies when the browser decides a visible focus ring is useful, usually for keyboard users.
- `transition` makes the hover and press changes feel smooth.

Practical rule:
- Prefer `:focus-visible` over removing outlines entirely. Keyboard users need a strong focus indicator.

## 2.2 `:focus` vs `:focus-visible` vs `:focus-within`
These selectors are related but serve different purposes.

```css
input:focus {
	border-color: #2563eb;
}

.form-group:focus-within {
	box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
	border-radius: 1rem;
}
```

Explanation:
- `:focus` matches the element that currently has focus.
- `:focus-visible` is a more user-friendly focus styling option for many controls.
- `:focus-within` matches a parent when any descendant inside it has focus.

Why `:focus-within` is useful:
- It lets you highlight an entire search bar, form row, or card when the input inside it becomes active.

## 2.3 Structural Pseudo-Classes
Structural pseudo-classes match elements by position.

```css
.feature-list li:nth-child(odd) {
	background-color: #eff6ff;
}

.feature-list li:nth-child(even) {
	background-color: #dbeafe;
}

.feature-list li:first-child {
	font-weight: 700;
}

.feature-list li:last-child {
	border-bottom: none;
}
```

Explanation:
- `:nth-child()` matches based on position among siblings.
- `odd` and `even` are common shortcuts.
- `:first-child` and `:last-child` are useful for removing extra separators or emphasizing boundaries.

Important distinction:
- `:nth-child()` counts all element siblings.
- `:nth-of-type()` counts only siblings of the same element type.

## 2.4 Useful Functional Pseudo-Classes
Modern CSS includes several pseudo-classes that help reduce repetition.

```css
.card :is(h2, h3, h4) {
	line-height: 1.2;
}

.nav-link:not(.is-current) {
	opacity: 0.75;
}
```

Explanation:
- `:is()` groups related selectors and can simplify repeated patterns.
- `:not()` excludes matches.

Note:
- These selectors are helpful, but do not write selectors so clever that they become hard to read.

## 2.5 Form and Validation States
Pseudo-classes are very important in forms.

```css
input:required {
	border-left: 4px solid #f59e0b;
}

input:invalid {
	border-color: #dc2626;
	background-color: #fef2f2;
}

input:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
```

Explanation:
- `:required` helps identify mandatory fields.
- `:invalid` provides instant visual feedback when browser validation fails.
- `:disabled` indicates a non-interactive control.

Accessibility note:
- Do not rely on color alone to communicate errors. Pair color with text or icons.

## 3. Pseudo-Elements
Pseudo-elements style a virtual part of an element or insert generated content. They usually use a double colon, such as `::before` and `::after`.

## 3.1 `::before` and `::after`
These are commonly used for decorative shapes, icons, overlays, and extra visual markers.

```css
.tag {
	position: relative;
	padding-inline: 1rem;
	background-color: #ecfeff;
	color: #155e75;
	border-radius: 999px;
}

.tag::before {
	content: "";
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 999px;
	background-color: currentColor;
	display: inline-block;
	margin-right: 0.5rem;
}
```

Explanation:
- `content` is required for `::before` and `::after` to render.
- Generated content can be purely decorative or can add small labels.
- `currentColor` reuses the element's text color.

Best practice:
- Use pseudo-elements for decoration, not for essential information that assistive technologies must reliably understand.

## 3.2 `::first-line` and `::first-letter`
These pseudo-elements style part of text content.

```css
.article-intro::first-line {
	font-weight: 600;
	letter-spacing: 0.02em;
}

.article-intro::first-letter {
	font-size: 2.75rem;
	font-weight: 700;
	float: left;
	line-height: 1;
	padding-right: 0.4rem;
}
```

Explanation:
- `::first-line` affects only the first rendered line, which can change with screen width.
- `::first-letter` is often used for editorial drop caps.

Warning:
- Because the first line depends on layout, avoid using `::first-line` for something that must remain visually consistent at every viewport size.

## 3.3 Other Common Pseudo-Elements

```css
::selection {
	background-color: #bfdbfe;
	color: #0f172a;
}

input::placeholder {
	color: #94a3b8;
}
```

Explanation:
- `::selection` styles the highlighted text selected by the user.
- `::placeholder` styles placeholder text inside form controls.

## 4. Transitions
Transitions animate the change from one state to another. They are most useful for hover, focus, open, selected, or theme changes.

## 4.1 Transition Basics

```css
.card {
	transition-property: transform, box-shadow, border-color;
	transition-duration: 220ms;
	transition-timing-function: ease;
	transition-delay: 0ms;
}

.card:hover {
	transform: translateY(-6px);
	box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
	border-color: #93c5fd;
}
```

Explanation:
- `transition-property` lists which properties should animate.
- `transition-duration` sets how long the animation takes.
- `transition-timing-function` controls the speed curve.
- `transition-delay` postpones the start.

Equivalent shorthand:

```css
.card {
	transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}
```

## 4.2 Choosing Properties Carefully
Not every CSS property transitions well.

Good choices for smooth transitions:
- `opacity`
- `transform`
- `background-color`
- `color`
- `box-shadow`

More risky choices:
- `width`
- `height`
- `left`
- `top`

Reason:
- Layout-changing properties can trigger more browser work and may feel less smooth.
- `transform` and `opacity` are often more performant because they can avoid full layout recalculations.

## 4.3 Timing Functions
Timing functions affect the character of motion.

```css
.chip {
	transition: transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Common timing functions:
- `linear`: constant speed
- `ease`: slow-fast-slow, general default
- `ease-in`: starts slowly
- `ease-out`: ends slowly
- `ease-in-out`: slow at both ends

Practical advice:
- Buttons and hover effects often feel good with `ease-out` or a soft cubic-bezier curve.

## 4.4 When to Use a Transition
Transitions are best when a user causes the state change.

Good use cases:
- button hover or press feedback
- input focus styles
- card lift or highlight
- menu open and close states
- theme switching

Poor use cases:
- animating every property on every element
- long delays that make the interface feel slow

## 5. Animations and `@keyframes`
Transitions animate between two states. Animations are better when you need a sequence with more than one step or when motion happens automatically.

## 5.1 Writing a Keyframes Animation

```css
@keyframes float-up {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
	100% {
		transform: translateY(0);
	}
}

.badge {
	animation: float-up 2.4s ease-in-out infinite;
}
```

Explanation:
- `@keyframes` defines the stages of the animation.
- `0%` is the starting point and `100%` is the end point.
- `infinite` repeats the animation forever.

## 5.2 Animation Properties

```css
.notification {
	animation-name: slide-fade-in;
	animation-duration: 400ms;
	animation-timing-function: ease-out;
	animation-delay: 100ms;
	animation-fill-mode: both;
	animation-iteration-count: 1;
}

@keyframes slide-fade-in {
	from {
		opacity: 0;
		transform: translateY(12px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
```

Explanation:
- `animation-fill-mode: both` lets the animation apply styles before and after it runs when useful.
- `animation-iteration-count: 1` means it plays once.
- `from` and `to` are shortcuts for `0%` and `100%`.

## 5.3 Helpful Animation Properties
- `animation-direction`: controls whether the animation reverses.
- `animation-play-state`: can pause or resume motion.
- `animation-delay`: staggers elements.
- `animation-iteration-count`: repeats a chosen number of times or forever.

## 5.4 Motion Accessibility
Some users are sensitive to motion, especially large movement, parallax, or endless animated effects.

```css
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
```

Explanation:
- This media query respects the user's operating system motion preference.
- It reduces or effectively disables motion-heavy effects.

Best practice:
- Decorative animation should never be more important than readability and comfort.

## 5.5 Performance Guidance for Motion
Prefer animating:
- `transform`
- `opacity`

Be more careful with:
- large `box-shadow` animations
- big `filter` animations such as `blur()`
- layout-related properties such as `width`, `height`, and `margin`

## 6. CSS Variables (Custom Properties)
CSS variables let you define reusable values and reference them with `var()`. They are excellent for design systems, themes, spacing scales, and component customization.

## 6.1 Defining Variables

```css
:root {
	--color-surface: #ffffff;
	--color-page: #f8fafc;
	--color-text: #0f172a;
	--color-primary: #2563eb;
	--radius-card: 1.25rem;
	--shadow-card: 0 18px 45px rgba(15, 23, 42, 0.12);
}

body {
	background-color: var(--color-page);
	color: var(--color-text);
}

.panel {
	background-color: var(--color-surface);
	border-radius: var(--radius-card);
	box-shadow: var(--shadow-card);
}
```

Explanation:
- Variables are often placed on `:root` when they should be global.
- `var(--name)` reads the stored value.
- This makes the stylesheet easier to update and maintain.

## 6.2 Local Scope and Overrides
Variables can be redefined inside a component or theme section.

```css
.promo-card {
	--color-surface: #0f172a;
	--color-text: #e2e8f0;
	background-color: var(--color-surface);
	color: var(--color-text);
}
```

Explanation:
- Custom properties inherit, so nested elements can use the new values.
- This is very useful for dark sections, emphasized cards, or themed components.

## 6.3 Fallback Values

```css
.badge {
	background-color: var(--badge-color, #dbeafe);
}
```

Explanation:
- If `--badge-color` is not defined, the fallback `#dbeafe` is used.

## 6.4 Variables with Calculations

```css
:root {
	--space-unit: 0.5rem;
}

.stack {
	gap: calc(var(--space-unit) * 3);
}
```

Explanation:
- Variables work well with `calc()`.
- This helps build spacing and sizing systems with fewer magic numbers.

## 6.5 Theme Switching Pattern

```css
:root {
	--page-bg: #f8fafc;
	--text-color: #0f172a;
	--accent: #2563eb;
}

[data-theme="dark"] {
	--page-bg: #0f172a;
	--text-color: #e2e8f0;
	--accent: #38bdf8;
}
```

Explanation:
- A parent attribute can swap variable values without rewriting every component rule.
- This is one of the cleanest ways to build light and dark themes.

## 7. Visual Effects: Shadows, Filters, Border Radius, and Clip Path
These properties shape the visual identity of a UI. They should support hierarchy and emphasis rather than overpower content.

## 7.1 `box-shadow`

```css
.card {
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

.card:hover {
	box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
}
```

Explanation:
- The values are horizontal offset, vertical offset, blur radius, spread radius, and color.
- The spread radius can be omitted.
- Larger, softer shadows usually suggest a higher visual elevation.

Practical advice:
- Keep a small shadow scale instead of inventing random values for every component.

## 7.2 `filter`

```css
.thumbnail {
	filter: grayscale(100%);
	transition: filter 200ms ease;
}

.thumbnail:hover {
	filter: grayscale(0%);
}
```

Explanation:
- `filter` applies visual processing such as `blur()`, `brightness()`, `contrast()`, `grayscale()`, and `drop-shadow()`.
- Filters are useful for images, icons, or special effects.

Important distinction:
- `box-shadow` shadows the rectangular box.
- `filter: drop-shadow()` shadows the visible pixels of the element, which is useful for transparent PNGs or SVG shapes.

## 7.3 `border-radius`

```css
.avatar {
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
}

.panel {
	border-radius: 1rem;
}
```

Explanation:
- `border-radius: 50%` commonly creates circles from square boxes.
- Rounded corners can make interfaces feel softer and more modern.

Note:
- Use radius consistently. If every component has a different radius, the design can feel unstructured.

## 7.4 `clip-path`
`clip-path` changes the visible shape of an element.

```css
.ribbon {
	clip-path: polygon(0 0, 100% 0, 100% 75%, 82% 100%, 0 100%);
}
```

Explanation:
- `polygon()` creates a custom shape using points.
- `clip-path` is useful for badges, angled sections, hero shapes, or decorative cut corners.

Practical caution:
- Complex clipping is decorative. Do not let unusual shapes reduce readability or make clickable areas confusing.

## 7.5 Combining Effects Responsibly

```css
.media-card {
	border-radius: 1.25rem;
	overflow: hidden;
	box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
	transition: transform 220ms ease, box-shadow 220ms ease;
}

.media-card img {
	filter: saturate(0.9);
	transition: filter 220ms ease, transform 220ms ease;
}

.media-card:hover {
	transform: translateY(-6px);
	box-shadow: 0 26px 55px rgba(15, 23, 42, 0.18);
}

.media-card:hover img {
	filter: saturate(1.05);
	transform: scale(1.03);
}
```

Explanation:
- This combines shadows, rounded corners, transitions, and filters into a single pattern.
- The effect is subtle enough to feel responsive without distracting from content.

## 8. Practical Styling Workflow
When building advanced styling, a useful workflow is:

1. Start with the base, readable design.
2. Add state styles for hover, focus, active, and disabled behavior.
3. Add transitions only where a state change needs smoothing.
4. Introduce animations only when motion communicates something useful.
5. Extract repeated values into variables.
6. Add shadows, filters, clipping, or decorative pseudo-elements only if they improve hierarchy or clarity.
7. Test keyboard focus, reduced motion, and readability before considering the work finished.

## 9. Common Mistakes and Best Practices

### 9.1 Common Mistakes
- Removing focus outlines without replacing them.
- Using `:hover` as the only interaction cue on a control.
- Adding essential text with `::before` or `::after` instead of real HTML content.
- Animating too many properties or using long durations for simple UI actions.
- Creating dozens of unrelated custom properties with unclear names.
- Using heavy shadows and filters everywhere so nothing stands out.
- Applying `clip-path` to important content without checking readability and touch targets.

### 9.2 Best Practices
- Always include visible keyboard focus states.
- Prefer subtle motion for everyday UI interactions.
- Use `transform` and `opacity` for higher-performance animations when possible.
- Keep animation durations short for interface feedback, often around `150ms` to `300ms`.
- Name custom properties by role, such as `--color-primary` or `--radius-card`, not by a one-off appearance.
- Keep decorative effects consistent with the rest of the visual system.
- Respect `prefers-reduced-motion`.

## 10. Summary
Advanced styling gives CSS much of its expressive power. Pseudo-classes respond to user and document state. Pseudo-elements create decorative or partial-element styling. Transitions smooth state changes, while keyframe animations create more complex motion. CSS variables make large stylesheets easier to maintain and theme. Visual effects such as shadows, filters, rounded corners, and clipping help create hierarchy and personality.

Used well, these features make interfaces clearer and more polished. Used carelessly, they create confusion, motion fatigue, or maintainability problems. The goal is not maximum decoration. The goal is controlled, meaningful styling.

## Further Reading
- [MDN: Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- [MDN: Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [MDN: Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions)
- [MDN: Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
- [MDN: Custom properties (`--*`)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [MDN: box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [MDN: filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [MDN: clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
