# Chapter 5: Flexbox and Grid

## Overview
Flexbox and CSS Grid are the two main modern layout systems in CSS. They solve different layout problems. Flexbox is best when content should flow in one direction, either in a row or a column. Grid is best when the layout needs both rows and columns at the same time.

These tools replaced many older layout tricks based on floats, tables, and complicated positioning. Learning them well is essential because they are used in navigation bars, card layouts, dashboards, galleries, sidebars, pricing sections, and complete page layouts.

## Learning Objectives
- Explain the difference between one-dimensional and two-dimensional layout.
- Build flex containers and control spacing, direction, wrapping, and alignment.
- Use `flex-grow`, `flex-shrink`, and `flex-basis` to control how flex items size themselves.
- Create practical Flexbox layouts such as navbars, card rows, and sidebars.
- Build grid containers with rows, columns, gaps, and responsive tracks.
- Use `fr` units, `repeat()`, `minmax()`, and named grid areas effectively.
- Decide when Flexbox is the better tool and when Grid is the better tool.
- Avoid common layout mistakes related to overflow, stretching, and misused alignment.

## 1. Why Modern Layout Systems Matter
Before Flexbox and Grid, CSS layouts often depended on `float`, `clear`, or manual positioning. Those approaches were hard to maintain because they were not designed for full page layout.

Modern layout systems improve this by giving the browser explicit layout rules:
- how items should line up
- how extra space should be distributed
- whether items should wrap onto new lines
- how rows and columns should be sized
- how layouts should adapt when the screen becomes narrower or wider

Simple rule:
- use Flexbox for layouts in one direction
- use Grid for layouts in two directions

## 2. Flexbox Fundamentals
Flexbox is a one-dimensional layout model. This means it handles items along one main axis at a time.

Basic example:

```css
.container {
	display: flex;
}
```

When `display: flex` is applied:
- the element becomes a flex container
- its direct children become flex items
- those items begin following flex layout rules instead of normal block layout rules

Example HTML:

```html
<div class="container">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
</div>
```

By default, the items appear in a row.

### 2.1 Main Axis and Cross Axis
Understanding Flexbox becomes much easier when you understand its two axes.

- Main axis: the primary direction in which items are laid out
- Cross axis: the direction perpendicular to the main axis

If `flex-direction: row`, then:
- main axis is horizontal
- cross axis is vertical

If `flex-direction: column`, then:
- main axis is vertical
- cross axis is horizontal

This matters because properties such as `justify-content` and `align-items` work relative to these axes, not always left/right or top/bottom.

### 2.2 `flex-direction`
`flex-direction` decides how items flow.

```css
.row-layout {
	display: flex;
	flex-direction: row;
}

.column-layout {
	display: flex;
	flex-direction: column;
}
```

Common values:
- `row`: left to right in most writing modes
- `row-reverse`: right to left visual order
- `column`: top to bottom
- `column-reverse`: bottom to top visual order

Important note:
- `reverse` changes visual order, but it does not change the underlying HTML order in the most semantically meaningful way for accessibility and keyboard flow. Use it carefully.

### 2.3 `flex-wrap`
By default, flex items try to stay on one line.

```css
.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}
```

Explanation:
- `nowrap` keeps everything on one line, even if items become cramped
- `wrap` allows items to move onto a new line
- `wrap-reverse` wraps in the opposite cross-axis direction

Wrapping is useful for buttons, tags, small cards, and navigation links on narrower screens.

### 2.4 `justify-content`
`justify-content` aligns items along the main axis.

```css
.toolbar {
	display: flex;
	justify-content: space-between;
}
```

Common values:
- `flex-start`: pack items at the start
- `center`: center items
- `flex-end`: pack items at the end
- `space-between`: first and last item touch opposite edges, remaining space is distributed between items
- `space-around`: each item gets equal space around it
- `space-evenly`: all gaps become equal

If the container does not have extra free space, this property may appear to do nothing.

### 2.5 `align-items`
`align-items` aligns items along the cross axis.

```css
.profile-row {
	display: flex;
	align-items: center;
	gap: 1rem;
}
```

Common values:
- `stretch`: default, items stretch to fill the cross-axis size if possible
- `flex-start`: align items to the start of the cross axis
- `center`: center them on the cross axis
- `flex-end`: align them to the end
- `baseline`: align text baselines, useful for mixed font sizes

### 2.6 `align-content`
`align-content` is often misunderstood. It only affects multi-line flex containers when there is extra space across the cross axis.

```css
.chip-list {
	display: flex;
	flex-wrap: wrap;
	height: 16rem;
	align-content: space-between;
}
```

If items do not wrap into multiple lines, `align-content` has no visible effect.

### 2.7 `gap`
Use `gap` instead of manually adding margins between items when possible.

```css
.actions {
	display: flex;
	gap: 0.75rem;
}
```

Benefits:
- cleaner spacing logic
- no extra margin on the last item
- works in both Flexbox and Grid

## 3. Flex Item Sizing
Flexbox becomes much more powerful when you control item sizing.

### 3.1 `flex-grow`
`flex-grow` decides how much an item can grow when free space is available.

```css
.item-a {
	flex-grow: 1;
}

.item-b {
	flex-grow: 2;
}
```

Explanation:
- if both items can grow, item B receives twice as much extra space as item A
- `0` means the item will not grow to absorb extra space

### 3.2 `flex-shrink`
`flex-shrink` decides how much an item may shrink when there is not enough space.

```css
.sidebar {
	flex-shrink: 0;
}
```

Useful case:
- a sidebar, avatar, or button group that should not become too narrow

### 3.3 `flex-basis`
`flex-basis` defines the starting size of a flex item before grow and shrink calculations happen.

```css
.card {
	flex-basis: 18rem;
}
```

Think of it as the preferred initial width in a row layout or preferred initial height in a column layout.

### 3.4 The `flex` Shorthand
These three properties are often written together using the `flex` shorthand.

```css
.content {
	flex: 1 1 20rem;
}
```

This means:
- `flex-grow: 1`
- `flex-shrink: 1`
- `flex-basis: 20rem`

Common patterns:
- `flex: 1` means items can grow and shrink evenly
- `flex: 0 0 auto` means fixed to its content or explicit size
- `flex: 1 1 16rem` is a common responsive card rule

### 3.5 `order`
`order` changes the visual order of a flex item.

```css
.featured {
	order: -1;
}
```

Use this carefully:
- visual order and document order can become inconsistent
- screen readers and keyboard navigation still follow the HTML source order in important ways
- prefer changing the HTML when semantic order matters

## 4. Common Flexbox Layouts

### 4.1 Navbar
Flexbox is excellent for a navigation bar because items flow naturally in one row.

```css
.nav {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.nav-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}
```

Why it works:
- logo and link group sit on the same main axis
- links can wrap when space becomes tight
- vertical centering stays simple

### 4.2 Card Row

```css
.cards {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.card {
	flex: 1 1 16rem;
}
```

Why it works:
- cards share available space
- each card has a comfortable minimum width
- wrapping prevents squashed content on small screens

### 4.3 Sidebar Layout

```css
.layout {
	display: flex;
	gap: 1.5rem;
}

.sidebar {
	flex: 0 0 16rem;
}

.main {
	flex: 1;
}
```

Why it works:
- the sidebar keeps a stable width
- the main content uses the remaining horizontal space

On narrow screens, this usually changes to a column layout:

```css
@media (max-width: 48rem) {
	.layout {
		flex-direction: column;
	}

	.sidebar {
		flex-basis: auto;
	}
}
```

## 5. CSS Grid Fundamentals
CSS Grid is a two-dimensional layout system. It controls columns and rows together, which makes it ideal for page sections that need stronger structure.

Basic example:

```css
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 1rem;
}
```

This creates three equal-width columns.

Important concepts:
- grid container: the parent with `display: grid`
- grid items: its direct children
- tracks: the rows and columns
- lines: the boundaries around tracks
- cells: the individual spaces where rows and columns intersect

### 5.1 `grid-template-columns` and `grid-template-rows`
These properties define the structure of the grid.

```css
.dashboard {
	display: grid;
	grid-template-columns: 16rem 1fr;
	grid-template-rows: auto 1fr auto;
	gap: 1rem;
}
```

Explanation:
- first column is fixed at `16rem`
- second column takes remaining space
- rows are sized independently

### 5.2 The `fr` Unit
The `fr` unit means fraction of available space.

```css
.columns {
	display: grid;
	grid-template-columns: 1fr 2fr 1fr;
}
```

Explanation:
- the middle column receives twice as much free space as the two outer columns
- `fr` is usually easier to reason about than percentages in many grid layouts

### 5.3 `gap`
Grid also uses `gap` for spacing.

```css
.gallery {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1.25rem;
}
```

Grid gap controls both row and column spacing without requiring margins on individual items.

### 5.4 `repeat()`
`repeat()` reduces repetition.

```css
.cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
```

This is equivalent to writing `1fr` four times.

### 5.5 `minmax()`
`minmax()` is one of the most useful responsive Grid functions.

```css
.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	gap: 1rem;
}
```

Explanation:
- each column should be at least `16rem`
- if more space exists, columns can expand up to `1fr`
- the browser automatically chooses how many columns fit

This creates responsive grids with fewer media queries.

## 6. Positioning in Grid

### 6.1 Line-Based Placement
Items can be placed using grid lines.

```css
.feature {
	grid-column: 1 / 3;
	grid-row: 1 / 2;
}
```

Explanation:
- the item starts at column line 1 and ends at column line 3
- it spans two columns

Shorthand examples:
- `grid-column: span 2` means span two columns from the current start line
- `grid-row: span 3` means span three rows

### 6.2 `grid-template-areas`
Named areas make a layout easier to read.

```css
.page {
	display: grid;
	grid-template-columns: 16rem 1fr;
	grid-template-areas:
		"header header"
		"sidebar main"
		"footer footer";
	gap: 1rem;
}

.header {
	grid-area: header;
}

.sidebar {
	grid-area: sidebar;
}

.main {
	grid-area: main;
}

.footer {
	grid-area: footer;
}
```

Advantages:
- visual mapping is easier to understand
- page structure becomes more maintainable
- responsive rearrangement is simpler inside media queries

## 7. Responsive Grids
Grid is especially powerful in responsive design.

### 7.1 Fixed Breakpoint Approach

```css
.products {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
}

@media (min-width: 40rem) {
	.products {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 64rem) {
	.products {
		grid-template-columns: repeat(4, 1fr);
	}
}
```

This is simple and explicit, so it is good for beginners.

### 7.2 Auto-Fitting Approach

```css
.products {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	gap: 1rem;
}
```

This is often more flexible because the browser decides how many columns fit without hard-coding several breakpoints.

### 7.3 `auto-fit` vs `auto-fill`
These two values are similar but not identical.

- `auto-fit` collapses empty tracks so used items stretch to fill space
- `auto-fill` keeps the potential empty tracks in the grid

For beginner-friendly responsive card layouts, `auto-fit` is usually the better starting point.

## 8. Flexbox vs Grid
These systems are not competitors. They complement each other.

Use Flexbox when:
- items move in one direction only
- content size should strongly influence layout
- you are aligning buttons, menus, toolbars, or small component internals

Use Grid when:
- you need rows and columns together
- the layout structure should be controlled more explicitly
- you are building galleries, dashboards, full page sections, or repeated card systems

Very common real-world pattern:
- use Grid for the outer page section
- use Flexbox inside individual components

Example:

```css
.section {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	gap: 1.5rem;
}

.card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
```

Grid arranges the cards. Flexbox organizes the content inside each card.

## 9. Common Mistakes and Best Practices

### 9.1 Confusing Axes in Flexbox
Many learners think:
- `justify-content` always means horizontal alignment
- `align-items` always means vertical alignment

That is only true when the flex direction is `row`. Always think in terms of main axis and cross axis.

### 9.2 Forgetting That Grid and Flexbox Only Affect Direct Children
If layout rules appear not to work, check whether you are styling the correct parent-child level.

### 9.3 Overusing `order`
If visual order is changed too much, the interface can become confusing for keyboard and assistive technology users.

### 9.4 Ignoring Content Size
Layout should serve content. If cards become too narrow for readable text, increase the minimum width or change the number of columns.

### 9.5 Using Margins Instead of `gap`
`gap` usually leads to more predictable spacing in modern layouts.

### 9.6 Stretching Images Unintentionally
If a flex or grid item stretches oddly, check whether media elements need:

```css
img {
	max-width: 100%;
	height: auto;
	display: block;
}
```

### 9.7 Start Simple
Begin with the smallest layout that works, then add media queries or `minmax()` logic only when needed.

## 10. Practical Workflow for Choosing a Layout
When you begin a layout, ask these questions:

1. Is the content mainly flowing in one direction or two?
2. Should items size themselves based on content, or should the layout impose stronger structure?
3. Will items wrap naturally, or do I need defined rows and columns?
4. Does the layout need named areas for readability?
5. Could `repeat(auto-fit, minmax(...))` remove the need for multiple breakpoints?

Decision shortcut:
- one row or one column of items: Flexbox
- cards, galleries, dashboards, page shells: Grid
- component internals inside a grid card: often Flexbox

## 11. Summary
Flexbox and Grid are the foundation of modern CSS layout.

Key points to remember:
- Flexbox is one-dimensional and great for alignment and component-level layout.
- Grid is two-dimensional and great for larger structural layout.
- `gap` is preferred for spacing in both systems.
- `flex`, `fr`, `repeat()`, and `minmax()` are core tools for practical responsive layouts.
- The best layouts often combine both systems instead of choosing only one.

## Further Reading
- [MDN: Basic Concepts of Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
- [MDN: Basic Concepts of Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)
- [MDN: `gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
- [MDN: `minmax()`](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax)

