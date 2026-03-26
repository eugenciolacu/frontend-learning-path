# Chapter 1: CSS Syntax and Selectors

## Overview
This chapter introduces the grammar of CSS and the selector system used to target HTML elements. A strong understanding of syntax and selectors is essential because every later CSS topic, from layout to animation, depends on correctly selecting elements and applying declarations predictably.

## Learning Objectives
- Understand the structure of a CSS rule and the role of selectors, properties, and values.
- Use basic selectors such as element, class, and id.
- Apply advanced selectors including combinators, attribute selectors, pseudo-classes, and pseudo-elements.
- Explain how specificity, inheritance, and the cascade determine which styles win.
- Avoid common selector mistakes and write readable, maintainable CSS.

## 1. What CSS Is
CSS stands for Cascading Style Sheets. It controls how HTML elements look in the browser, including color, spacing, typography, layout, and interaction states.

CSS does not create content. Instead, it describes presentation rules for existing elements.

You can write CSS in three main ways:

1. External stylesheet: recommended for most projects.
2. Internal stylesheet: CSS inside a `<style>` element in the HTML document.
3. Inline styles: CSS inside an element's `style` attribute.

Example:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>CSS Example</title>
		<link rel="stylesheet" href="styles.css" />
	</head>
	<body>
		<h1>Learning CSS</h1>
	</body>
</html>
```

Explanation:
- `<link rel="stylesheet">` loads an external CSS file.
- External CSS keeps structure and styling separate, which is easier to maintain.

## 2. Anatomy of a CSS Rule
A CSS rule has two main parts:
- A selector: tells the browser which element or elements to target.
- A declaration block: contains one or more declarations.

Example:

```css
p {
	color: navy;
	font-size: 18px;
}
```

Explanation:
- `p` is the selector.
- `{ ... }` is the declaration block.
- `color` and `font-size` are properties.
- `navy` and `18px` are values.
- Each declaration ends with a semicolon.

Rule breakdown:

```css
selector {
	property: value;
}
```

Important syntax rules:
- CSS ignores most extra whitespace, but punctuation still matters.
- A colon `:` separates property and value.
- A semicolon `;` ends a declaration.
- Curly braces `{}` wrap the declaration block.
- If punctuation is missing, the browser may ignore part of the rule.

## 3. CSS Comments
Comments help document the intent of a stylesheet.

```css
/* Main heading styles */
h1 {
	color: darkslateblue;
}
```

Explanation:
- CSS comments begin with `/*` and end with `*/`.
- They are useful for section labels or short notes.
- Comments should explain intent, not repeat obvious code.

## 4. Selectors, Properties, and Values
Selectors answer the question: "Which elements should receive these styles?"

Properties answer the question: "What should change?"

Values answer the question: "What should the property become?"

Example:

```css
.card-title {
	color: #1f2937;
	text-transform: uppercase;
}
```

Explanation:
- `.card-title` selects any element with class `card-title`.
- `color` changes text color.
- `text-transform: uppercase` changes how text is displayed.

CSS values can be many types:
- Keywords: `block`, `bold`, `auto`
- Lengths: `16px`, `2rem`, `50%`
- Colors: `red`, `#ff0000`, `rgb(255, 0, 0)`
- Functions: `calc(100% - 2rem)`

## 5. Basic Selectors

### 5.1 Element Selector
An element selector targets all elements of a specific HTML tag.

```css
h1 {
	color: darkgreen;
}
```

Explanation:
- This rule targets every `<h1>` element on the page.
- Element selectors are broad and useful for baseline styling.

### 5.2 Class Selector
A class selector targets elements with a specific class attribute.

```css
.highlight {
	background-color: gold;
}
```

Explanation:
- The dot `.` means "select by class".
- Any element with `class="highlight"` receives the style.
- Classes are reusable and are the most common way to style components.

HTML example:

```html
<p class="highlight">Important note</p>
<div class="highlight">Warning box</div>
```

### 5.3 ID Selector
An id selector targets a single element with a specific `id` value.

```css
#site-header {
	border-bottom: 2px solid black;
}
```

Explanation:
- The `#` means "select by id".
- An `id` should be unique within a page.
- IDs are valid in CSS, but overusing them can make styles harder to override because ids have high specificity.

HTML example:

```html
<header id="site-header">Frontend Learning Path</header>
```

### 5.4 Universal Selector
The universal selector matches all elements.

```css
* {
	box-sizing: border-box;
}
```

Explanation:
- `*` means "every element".
- It is commonly used for foundational resets or shared defaults.

### 5.5 Grouping Selectors
You can target multiple selectors in one rule by separating them with commas.

```css
h1,
h2,
h3 {
	font-family: Georgia, serif;
}
```

Explanation:
- This rule applies the same declaration block to all listed selectors.
- Grouping reduces repetition.

## 6. Combining Selectors
Selectors can be combined to target elements more precisely.

```css
p.notice {
	color: crimson;
}
```

Explanation:
- This rule targets only `<p>` elements that also have class `notice`.
- It does not target a `<div class="notice">`.

This is more specific than using `p` or `.notice` alone.

## 7. Advanced Selectors

### 7.1 Descendant Selector
A descendant selector targets elements nested anywhere inside another element.

```css
article p {
	line-height: 1.7;
}
```

Explanation:
- This targets all `<p>` elements inside an `<article>`.
- The paragraph can be deeply nested.

HTML example:

```html
<article>
	<section>
		<p>This paragraph is selected.</p>
	</section>
</article>
```

### 7.2 Child Selector
A child selector targets only direct children.

```css
nav > a {
	text-decoration: none;
}
```

Explanation:
- `>` means "direct child".
- Only `<a>` elements that are immediate children of `<nav>` are selected.

### 7.3 Adjacent Sibling Selector
An adjacent sibling selector targets the next sibling element.

```css
h2 + p {
	margin-top: 0;
}
```

Explanation:
- `+` means "the first next sibling".
- This selects a paragraph only if it comes immediately after an `<h2>`.

### 7.4 General Sibling Selector
A general sibling selector targets all later siblings of the same parent.

```css
h2 ~ p {
	color: slategray;
}
```

Explanation:
- `~` means "any following sibling".
- Every later `<p>` sharing the same parent as the `<h2>` can match.

## 8. Attribute Selectors
Attribute selectors target elements based on the presence or value of attributes.

### 8.1 Attribute Exists

```css
[disabled] {
	opacity: 0.5;
}
```

Explanation:
- This selects any element that has a `disabled` attribute.

### 8.2 Exact Attribute Value

```css
input[type="email"] {
	border-color: steelblue;
}
```

Explanation:
- This selects `<input>` elements whose `type` is exactly `email`.

### 8.3 Attribute Starts With, Ends With, or Contains

```css
a[href^="https"] {
	color: seagreen;
}

img[src$=".svg"] {
	outline: 1px solid #999;
}

[class*="card"] {
	padding: 1rem;
}
```

Explanation:
- `^=` means "starts with".
- `$=` means "ends with".
- `*=` means "contains this substring".

Attribute selectors are useful when styling form fields, external links, downloadable files, or repeated naming patterns.

## 9. Pseudo-Classes
A pseudo-class styles an element in a particular state.

Common pseudo-classes:
- `:hover` when the pointer is over an element
- `:focus` when an element receives keyboard or programmatic focus
- `:active` while an element is being activated
- `:first-child` when an element is the first child of its parent
- `:nth-child()` when an element matches a numeric pattern

Example:

```css
button:hover {
	background-color: royalblue;
}

input:focus {
	outline: 2px solid orange;
}

li:nth-child(odd) {
	background-color: #f3f4f6;
}
```

Explanation:
- `:hover` improves interactive feedback.
- `:focus` is important for keyboard accessibility.
- `:nth-child(odd)` selects the 1st, 3rd, 5th, and other odd list items.

Accessibility note:
- Do not remove focus styles unless you replace them with a clear visible alternative.

## 10. Pseudo-Elements
A pseudo-element styles part of an element rather than the whole element.

Common pseudo-elements:
- `::before`
- `::after`
- `::first-line`
- `::first-letter`
- `::selection`

Example:

```css
.tag::before {
	content: "#";
	color: gray;
}

p::first-line {
	font-weight: bold;
}
```

Explanation:
- `::before` inserts generated content before the element's content.
- `::first-line` styles only the first rendered line of a paragraph.

Important note:
- `::before` and `::after` usually need the `content` property to appear.
- Modern CSS uses the double-colon form for pseudo-elements.

## 11. Specificity
Specificity is the scoring system browsers use when multiple selectors target the same element.

General priority from lower to higher:
1. Element selectors and pseudo-elements
2. Class selectors, attribute selectors, and pseudo-classes
3. ID selectors
4. Inline styles

Example:

```css
p {
	color: black;
}

.intro {
	color: blue;
}

#welcome {
	color: red;
}
```

```html
<p id="welcome" class="intro">Hello</p>
```

Explanation:
- All three selectors match the same paragraph.
- The id selector has the highest specificity here, so the text becomes red.

Useful mental model:
- Element selector roughly equals `0-0-1`
- Class, attribute, or pseudo-class roughly equals `0-1-0`
- ID roughly equals `1-0-0`

Specificity tips:
- Prefer classes for most styling.
- Avoid long selector chains unless necessary.
- Avoid relying on ids for reusable component styling.

## 12. The Cascade and Source Order
The word "cascading" in CSS means that several rules may apply to the same element, and the browser decides which one wins.

The browser considers:
1. Importance (`!important`)
2. Origin (browser defaults, user styles, author styles)
3. Specificity
4. Source order

Example:

```css
.message {
	color: gray;
}

.message {
	color: green;
}
```

Explanation:
- Both selectors have the same specificity.
- The later rule wins because it appears later in the stylesheet.

About `!important`:

```css
.warning {
	color: red !important;
}
```

Explanation:
- `!important` can override normal rules.
- It should be used sparingly because it makes styles harder to maintain and debug.

## 13. Inheritance
Inheritance means some CSS properties automatically pass from a parent element to its children.

Common inherited properties:
- `color`
- `font-family`
- `font-size`
- `line-height`
- `text-align`

Common non-inherited properties:
- `margin`
- `padding`
- `border`
- `width`
- `background`

Example:

```css
body {
	color: #1f2937;
	font-family: Arial, sans-serif;
}
```

```html
<body>
	<main>
		<p>This paragraph inherits color and font-family from body.</p>
	</main>
</body>
```

Explanation:
- The paragraph inherits text-related styles from the body.
- It does not automatically inherit layout properties like margin or border.

Useful keyword:

```css
a {
	color: inherit;
}
```

Explanation:
- `inherit` tells the element to explicitly use the parent's computed value.

## 14. Common Mistakes and Best Practices

### Common Mistakes
- Forgetting a semicolon or closing brace.
- Using ids when a reusable class would be better.
- Writing selectors that are more complex than needed.
- Removing focus outlines without replacing them.
- Confusing descendant selectors with child selectors.

### Best Practices
- Use external stylesheets for maintainability.
- Prefer class selectors for reusable UI patterns.
- Keep selectors short and readable.
- Use meaningful class names such as `.product-card` instead of `.blue-box`.
- Check specificity before reaching for `!important`.
- Include interactive states such as `:hover` and `:focus` for controls.

## 15. Quick Comparison Table

| Selector Type | Example | What It Targets |
| --- | --- | --- |
| Element | `p` | All `<p>` elements |
| Class | `.card` | Elements with class `card` |
| ID | `#hero` | Element with id `hero` |
| Descendant | `article p` | Paragraphs inside `article` |
| Child | `nav > a` | Direct child links of `nav` |
| Adjacent sibling | `h2 + p` | First paragraph after `h2` |
| General sibling | `h2 ~ p` | All later paragraph siblings after `h2` |
| Attribute | `input[type="text"]` | Text inputs |
| Pseudo-class | `button:hover` | Button in hover state |
| Pseudo-element | `p::first-line` | First rendered line of paragraph |

## Further Reading
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [MDN CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [MDN Cascade and Inheritance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts)
