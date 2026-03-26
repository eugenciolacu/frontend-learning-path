# Chapter 2: The Box Model and Layout

## Overview
This chapter explains how browsers calculate the size of elements and how those elements are placed on the page. Before learning advanced layout systems such as Flexbox and Grid, a developer needs to understand the box model, normal document flow, display behavior, positioning, float-based layouts, overflow handling, and stacking with `z-index`.

## Learning Objectives
- Explain the four parts of the CSS box model: content, padding, border, and margin.
- Predict how width, height, and spacing are calculated by the browser.
- Distinguish between `block`, `inline`, `inline-block`, and `none`.
- Use `position` values correctly and understand containing blocks.
- Explain how floats affect surrounding content and how `clear` restores layout flow.
- Control content clipping and scrolling with `overflow`.
- Understand when `z-index` works and how stacking order is created.
- Avoid common layout bugs by using `box-sizing`, understanding margin collapsing, and recognizing normal flow.

## 1. Why Layout Starts with the Box Model
Every visible HTML element is rendered as a rectangular box. Even when an element looks like text, a button, or an image, the browser still calculates its size and position using a box.

The CSS box model defines the space an element occupies and how it interacts with nearby elements.

The box has four main layers:
- Content: the actual text, image, or child elements.
- Padding: space between the content and the border.
- Border: the visible edge around the padding and content.
- Margin: outer space between the element and neighboring elements.

Example:

```css
.card {
	width: 300px;
	padding: 24px;
	border: 2px solid #1d4ed8;
	margin: 16px;
}
```

Explanation:
- The content area starts at `300px` wide by default.
- `padding` adds internal breathing room.
- `border` adds visible thickness around the element.
- `margin` pushes the element away from other boxes.

## 2. Anatomy of the Box Model

### 2.1 Content Box
The content box contains the element's actual content. By default, `width` and `height` apply to the content box only.

```css
.profile {
	width: 240px;
	height: 120px;
}
```

Explanation:
- The browser reserves `240px` for content width.
- Padding and border are added on top of this unless `box-sizing` changes the calculation.

### 2.2 Padding
Padding creates space inside the element, between content and border.

```css
.notice {
	padding: 1rem;
	background-color: #eff6ff;
}
```

Explanation:
- Padding increases the clickable and visual area of an element.
- Background colors and background images extend through padding.
- Padding cannot be negative.

### 2.3 Border
The border wraps the content and padding.

```css
.notice {
	border: 2px solid #2563eb;
}
```

Explanation:
- Border thickness contributes to the element's rendered size.
- Borders can be styled with width, style, and color.

### 2.4 Margin
Margin is the transparent space outside the border.

```css
.notice {
	margin-top: 1.5rem;
}
```

Explanation:
- Margins separate neighboring elements.
- Vertical margins between block elements can collapse in normal flow.
- Margins can be negative, but that should be used carefully because it can make layouts harder to reason about.

## 3. Width, Height, and Total Rendered Size
Students often assume that `width` means the total visible width of an element. In the default model, that is not true.

Example:

```css
.box {
	width: 200px;
	padding: 20px;
	border: 5px solid #0f172a;
	margin: 10px;
}
```

Rendered size calculation:
- Content width = `200px`
- Left and right padding = `40px`
- Left and right border = `10px`
- Total occupied width without margin = `250px`
- Total horizontal space including margin = `270px`

Explanation:
- The browser adds padding and border outside the declared content width.
- Margin affects surrounding layout, not the painted box itself.

## 4. `box-sizing` and Why It Matters
Modern projects commonly use `box-sizing: border-box` because it makes size calculations easier.

```css
* {
	box-sizing: border-box;
}

.box {
	width: 200px;
	padding: 20px;
	border: 5px solid #0f172a;
}
```

Explanation:
- With `content-box` default behavior, width excludes padding and border.
- With `border-box`, the declared width includes content, padding, and border.
- This reduces layout surprises, especially in responsive interfaces.

Comparison:
- `content-box`: declared width applies only to content.
- `border-box`: declared width applies to the full visible box.

## 5. Margin Collapsing
Vertical margins between block elements in normal flow can collapse into a single margin.

```css
h2 {
	margin-bottom: 24px;
}

p {
	margin-top: 16px;
}
```

Explanation:
- The space between the two elements is not `40px`.
- The browser uses the larger of the two overlapping vertical margins, so the result is `24px`.
- Margin collapsing usually happens between block elements in the normal flow, not with flex or grid items.

Practical note:
- Margin collapsing is one reason many teams prefer consistent spacing systems or container padding.

## 6. Normal Document Flow
Before positioning or floating elements, the browser places them in normal flow.

In normal flow:
- Block elements usually start on a new line and expand to the available width.
- Inline elements sit within a line of text.
- Elements appear in source order unless CSS changes the layout.

Understanding normal flow is important because many layout techniques work by partially or fully removing elements from it.

## 7. Display and Layout Behavior
The `display` property controls how an element participates in layout.

### 7.1 `display: block`
Block-level elements typically start on a new line and take up the available horizontal space.

```css
.panel {
	display: block;
	width: 100%;
}
```

Common examples:
- `<div>`
- `<section>`
- `<article>`
- `<p>`

### 7.2 `display: inline`
Inline elements flow inside text and do not start on a new line.

```css
.label {
	display: inline;
	background-color: #fef3c7;
}
```

Explanation:
- Inline elements ignore explicit `width` and `height` in most cases.
- Top and bottom margins generally do not affect surrounding layout the same way block elements do.

Common examples:
- `<span>`
- `<a>`
- `<strong>`

### 7.3 `display: inline-block`
`inline-block` combines inline placement with block-like sizing.

```css
.tag {
	display: inline-block;
	width: 140px;
	padding: 0.5rem 0.75rem;
}
```

Explanation:
- The element stays in the text flow like an inline element.
- It can still receive width, height, padding, and margin more predictably.
- This is useful for badges, buttons, and small aligned UI pieces.

### 7.4 `display: none`
An element with `display: none` is removed from layout entirely.

```css
.is-hidden {
	display: none;
}
```

Explanation:
- The element does not occupy space.
- It is not rendered visually.
- This differs from `visibility: hidden`, which hides the element but keeps its layout space.

## 8. Positioning
The `position` property changes how an element is placed and whether offsets such as `top`, `right`, `bottom`, and `left` apply.

### 8.1 `position: static`
This is the default for most elements.

```css
.item {
	position: static;
}
```

Explanation:
- The element remains in normal flow.
- Offset properties do not affect it.

### 8.2 `position: relative`
Relative positioning keeps the element in normal flow but lets it shift visually from its original position.

```css
.badge {
	position: relative;
	top: 6px;
	left: 10px;
}
```

Explanation:
- The element still occupies its original space.
- It moves visually relative to where it would normally appear.
- A relatively positioned element often acts as the containing block for absolutely positioned children.

### 8.3 `position: absolute`
Absolutely positioned elements are removed from normal flow and positioned relative to the nearest positioned ancestor.

```css
.card {
	position: relative;
}

.card-badge {
	position: absolute;
	top: 12px;
	right: 12px;
}
```

Explanation:
- The `.card-badge` no longer reserves space in the normal document flow.
- Because `.card` is positioned, the badge uses the card as its containing block.
- If no positioned ancestor exists, the element may position itself relative to the initial containing block, often the viewport.

### 8.4 `position: fixed`
Fixed elements are positioned relative to the viewport.

```css
.help-button {
	position: fixed;
	bottom: 20px;
	right: 20px;
}
```

Explanation:
- The element stays in the same viewport position during scrolling.
- This is useful for sticky action buttons, back-to-top controls, and floating support widgets.

### 8.5 `position: sticky`
Sticky positioning behaves like relative positioning until a scroll threshold is reached.

```css
.section-nav {
	position: sticky;
	top: 0;
}
```

Explanation:
- The element behaves normally until it reaches the specified offset.
- After that, it sticks to the edge of its scroll container.
- Sticky positioning is useful for headers, sidebars, and table headings.

Important note:
- Sticky elements require a scrollable context and enough available space to stick.

## 9. Float and Clear
Before Flexbox and Grid, floats were widely used to create column layouts. Today, they are mostly used to wrap text around images or for legacy code maintenance.

### 9.1 `float`
Floating an element moves it to the left or right side of its container, allowing inline content to wrap around it.

```css
.article-image {
	float: left;
	margin-right: 1rem;
	margin-bottom: 0.5rem;
}
```

Explanation:
- The image is taken out of the normal block flow.
- Text content wraps around the floated element.
- Parent containers may collapse in height if they only contain floated children.

### 9.2 `clear`
The `clear` property prevents an element from sitting next to floated elements.

```css
.footer {
	clear: both;
}
```

Explanation:
- `clear: left` avoids left floats.
- `clear: right` avoids right floats.
- `clear: both` moves below floats on either side.

Practical note:
- For modern layouts, prefer Flexbox or Grid over float-based columns.
- Floats are still relevant because you will encounter them in articles, legacy systems, and interview questions.

## 10. Overflow
Overflow describes what happens when content is larger than its box.

### 10.1 `overflow: visible`
This is the default for many elements.

```css
.box {
	overflow: visible;
}
```

Explanation:
- Content can spill outside the element.

### 10.2 `overflow: hidden`
Clips content that extends beyond the box.

```css
.card {
	overflow: hidden;
	border-radius: 1rem;
}
```

Explanation:
- Useful when rounded corners should also clip child content.
- Hidden overflow can accidentally hide important content, so use it carefully.

### 10.3 `overflow: scroll`
Always shows scrollbars, even when content fits.

```css
.code-sample {
	overflow: scroll;
}
```

### 10.4 `overflow: auto`
Shows scrollbars only when needed.

```css
.code-sample {
	max-height: 200px;
	overflow: auto;
}
```

Explanation:
- `auto` is common for code blocks, panels, and tables.
- It helps preserve layout while still giving access to content.

## 11. `z-index` and Stacking Order
When elements overlap, the browser decides which one appears on top by using stacking order.

```css
.modal {
	position: fixed;
	z-index: 1000;
}

.page-banner {
	position: sticky;
	top: 0;
	z-index: 100;
}
```

Explanation:
- `z-index` only works on positioned elements and some other stacking-context participants.
- Larger `z-index` values appear above smaller ones within the same stacking context.
- A child with a high `z-index` cannot escape its parent's stacking context.

Practical rule:
- Do not treat `z-index` as a random number contest.
- Use a small, intentional scale such as base content, sticky UI, dropdowns, modals, and overlays.

## 12. Stacking Context Basics
A stacking context is a self-contained layering environment.

Common ways to create one include:
- A positioned element with a non-auto `z-index`
- `opacity` less than `1`
- `transform`
- `filter`
- `isolation: isolate`

Explanation:
- Stacking context is a frequent source of confusion when `z-index` seems to "not work".
- Often the issue is not the number itself, but the fact that two elements are in different stacking contexts.

## 13. Common Beginner Mistakes

### 13.1 Forgetting `box-sizing`
Without `border-box`, a declared width may become larger than expected once padding and border are added.

### 13.2 Using `inline` when width is needed
Inline elements usually do not respect `width` and `height` like block-level boxes do.

### 13.3 Absolutely positioning without a containing block
If the parent is not positioned, the child may align relative to the viewport or another ancestor.

### 13.4 Using floats for all layouts
Floats solve specific problems, but modern page layouts should generally use Flexbox or Grid.

### 13.5 Increasing `z-index` blindly
If stacking contexts differ, increasing the number may not solve the problem.

## 14. Best Practices
- Start by understanding normal flow before introducing positioning.
- Prefer `box-sizing: border-box` for predictable sizing.
- Use margins for separation between siblings and padding for space inside a component.
- Use `position: relative` on a parent when placing absolute children.
- Prefer Flexbox or Grid for major layout systems.
- Use `overflow` intentionally so content is not clipped unexpectedly.
- Define a small, consistent `z-index` scale instead of arbitrary large values.

## 15. Summary
The box model is the foundation of CSS layout. Once you understand how content, padding, border, and margin combine into a rendered box, the rest of layout becomes much easier to reason about. `display` determines how elements participate in flow, `position` changes how they are placed, floats alter text wrapping and legacy layouts, `overflow` controls clipping and scrolling, and `z-index` manages layering.

These concepts are essential because more advanced layout tools build on them rather than replace them.

## Further Reading
- [MDN: Introduction to the CSS box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)
- [MDN: display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [MDN: float](https://developer.mozilla.org/en-US/docs/Web/CSS/float)
- [MDN: overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [MDN: z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
