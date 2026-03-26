# Chapter 3: Typography and Colors

## Overview
This chapter explains how CSS controls the visual tone and readability of a page through typography and color. These two areas strongly influence usability, accessibility, and brand identity. A developer who understands font selection, text spacing, color formats, and backgrounds can build interfaces that are easier to read and more professional.

## Learning Objectives
- Explain the role of `font-family`, `font-size`, `font-weight`, `font-style`, and `line-height`.
- Build safe font stacks with fallback fonts.
- Load and apply web fonts with Google Fonts.
- Use text alignment, decoration, transformation, and spacing properties appropriately.
- Recognize and write colors using named values, hex, `rgb()`, `rgba()`, `hsl()`, and `hsla()`.
- Control backgrounds with colors, images, repeating patterns, positioning, sizing, and gradients.
- Apply typography and color choices that improve readability and accessibility.

## 1. Why Typography and Color Matter
HTML gives content structure, but CSS makes that content readable and visually organized. When typography and color are used well, users can quickly understand hierarchy, emphasis, and meaning.

Typography affects:
- Readability: how easily text can be read.
- Hierarchy: how headings, body text, captions, and labels are distinguished.
- Mood: whether an interface feels formal, technical, playful, or minimal.

Color affects:
- Attention: what users notice first.
- Meaning: success, warning, error, or interactive states.
- Visual identity: whether a UI feels consistent and intentional.

Example:

```css
body {
	font-family: Arial, sans-serif;
	font-size: 16px;
	line-height: 1.5;
	color: #1f2937;
	background-color: #f9fafb;
}
```

Explanation:
- `font-family` sets the typeface used for text.
- `font-size` controls the base text size.
- `line-height` adds vertical breathing room between lines.
- `color` sets the text color.
- `background-color` sets the page background.

## 2. Typography Fundamentals

### 2.1 `font-family`
The `font-family` property defines which fonts the browser should try in order. A font list is called a font stack.

```css
body {
	font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
```

Explanation:
- The browser first tries `Segoe UI`.
- If that font is not available, it tries `Tahoma`, then `Geneva`, then `Verdana`.
- If none are available, it falls back to the generic `sans-serif` family.

Common generic families:
- `serif`: fonts with small finishing strokes, often used in traditional reading layouts.
- `sans-serif`: cleaner fonts without strokes, common in interfaces.
- `monospace`: each character takes equal width, useful for code.
- `cursive`: handwriting-like fonts.
- `fantasy`: decorative fonts, used rarely.

Practical rule:
- Always end a font stack with a generic family.

### 2.2 `font-size`
The `font-size` property controls how large text appears.

```css
h1 {
	font-size: 2rem;
}

p {
	font-size: 1rem;
}
```

Common units:
- `px`: fixed-size unit, easy to reason about.
- `rem`: relative to the root font size, usually better for scalable systems.
- `em`: relative to the current element's font size.
- `%`: relative sizing, less common for main type scales.

Explanation:
- If the root font size is `16px`, then `1rem` is `16px`.
- `2rem` would be `32px`.
- Many teams prefer `rem` because it scales more predictably across components.

Extra note:
- Avoid making body text too small. For most interfaces, `16px` or `1rem` is a safe starting point.

### 2.3 `font-weight`
The `font-weight` property controls how bold text appears.

```css
h2 {
	font-weight: 700;
}

.subtitle {
	font-weight: 300;
}
```

Explanation:
- Common numeric values are `400` for regular and `700` for bold.
- Some fonts support many weights such as `300`, `500`, `600`, `800`.
- Not every font file contains every weight, so unsupported values may be approximated by the browser.

### 2.4 `font-style`
The `font-style` property is usually used for italic text.

```css
em {
	font-style: italic;
}
```

Common values:
- `normal`
- `italic`
- `oblique`

Practical note:
- Use italics for emphasis carefully. Too much italic text reduces readability.

### 2.5 `line-height`
The `line-height` property controls the vertical space between lines of text.

```css
p {
	line-height: 1.7;
}
```

Explanation:
- Unitless values such as `1.5` or `1.7` are often best because they scale with the font size.
- Small line heights make paragraphs feel cramped.
- Large line heights can make content feel disconnected.

Recommended starting ranges:
- Body text: `1.4` to `1.8`
- Headings: usually lower than body text, often `1.1` to `1.3`

## 3. Building a Readable Type System
A type system is a small set of consistent rules for headings, paragraphs, captions, labels, and code.

Example:

```css
html {
	font-size: 16px;
}

body {
	font-family: "Segoe UI", sans-serif;
	font-size: 1rem;
	line-height: 1.6;
	color: #111827;
}

h1 {
	font-size: 2.5rem;
	line-height: 1.15;
	font-weight: 700;
}

h2 {
	font-size: 2rem;
	line-height: 1.2;
	font-weight: 700;
}

small {
	font-size: 0.875rem;
}
```

Explanation:
- The body text defines the default reading experience.
- Headings become progressively larger and tighter.
- Smaller text should still remain readable.

Best practices:
- Do not use too many font sizes without a reason.
- Keep headings visually distinct from body text.
- Use consistent spacing between headings and paragraphs.

## 4. Web Fonts and Google Fonts
System fonts are fast and reliable, but sometimes a design requires a specific web font. Google Fonts is a common way to load web fonts.

### 4.1 Loading a Google Font with `<link>`

```html
<head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
```

Then use the font in CSS:

```css
body {
	font-family: "Inter", sans-serif;
}
```

Explanation:
- The browser downloads the Inter font from Google Fonts.
- `display=swap` helps text remain visible while the custom font loads.
- If the font fails to load, `sans-serif` is still available as a fallback.

### 4.2 `@import` vs `<link>`
Both methods work, but `<link>` is generally preferred.

```css
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
```

Why `<link>` is usually better:
- It allows the browser to start downloading fonts earlier.
- It avoids some performance delays caused by CSS imports.

### 4.3 Good Web Font Habits
- Load only the weights you actually use.
- Keep a fallback font stack.
- Avoid loading many font families on the same page.
- Test whether the font remains readable on smaller screens.

## 5. Text Alignment, Decoration, Transformation, and Spacing

### 5.1 `text-align`
The `text-align` property controls horizontal alignment of inline content within a block container.

```css
.hero-title {
	text-align: center;
}

.article {
	text-align: left;
}
```

Common values:
- `left`
- `right`
- `center`
- `justify`

Practical note:
- Fully justified text can create uneven spaces between words, so use it carefully.

### 5.2 `text-decoration`
The `text-decoration` property adds or removes visual decorations like underlines.

```css
a {
	text-decoration: underline;
}

.old-price {
	text-decoration: line-through;
}
```

Explanation:
- Underlines are important for link recognition.
- Removing link underlines without another strong visual cue can reduce usability.

### 5.3 `text-transform`
The `text-transform` property changes the letter case visually.

```css
.eyebrow {
	text-transform: uppercase;
}
```

Common values:
- `uppercase`
- `lowercase`
- `capitalize`

Practical note:
- Uppercase text often needs additional letter spacing to remain readable.

### 5.4 Letter and Word Spacing
Spacing properties fine-tune readability and tone.

```css
.eyebrow {
	letter-spacing: 0.08em;
}

p {
	word-spacing: 0.05em;
}
```

Explanation:
- `letter-spacing` changes the gap between characters.
- `word-spacing` changes the gap between words.
- Small adjustments are useful; extreme values quickly make text look unnatural.

### 5.5 Combined Text Example

```css
.card-title {
	text-align: left;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	font-weight: 700;
	text-decoration: none;
}
```

Explanation:
- This combination creates a strong label-like heading.
- The uppercase transformation is balanced by slightly wider letter spacing.

## 6. Color in CSS
CSS supports several ways to represent color. Different formats are useful in different situations.

### 6.1 Named Colors

```css
.notice {
	color: navy;
	background-color: lightyellow;
}
```

Explanation:
- Named colors are easy to read.
- They are limited in variety and precision.
- They are useful for quick experiments, but many teams prefer more precise color systems.

### 6.2 Hex Colors

```css
.button {
	background-color: #2563eb;
	color: #ffffff;
}
```

Explanation:
- Hex is one of the most common CSS color formats.
- `#2563eb` represents red, green, and blue values in hexadecimal.
- Six-digit hex is the most common form, though three-digit shorthand exists for some colors.

### 6.3 `rgb()` and `rgba()`

```css
.alert {
	background-color: rgb(239, 68, 68);
	box-shadow: 0 8px 20px rgba(239, 68, 68, 0.25);
}
```

Explanation:
- `rgb()` defines red, green, and blue channels.
- `rgba()` adds an alpha channel for transparency.
- Alpha values range from `0` to `1`.

### 6.4 `hsl()` and `hsla()`

```css
.badge {
	background-color: hsl(160, 84%, 39%);
	color: hsla(0, 0%, 100%, 0.95);
}
```

Explanation:
- `hsl()` means hue, saturation, and lightness.
- Hue is the color angle on the color wheel.
- Saturation controls intensity.
- Lightness controls how light or dark the color is.
- `hsl()` is often easier than hex when adjusting themes because it matches how humans think about color.

### 6.5 Choosing a Color Format
- Use `hex` for common design tokens and compact notation.
- Use `rgba()` or `hsla()` when transparency is required.
- Use `hsl()` when you want to fine-tune hue, saturation, or lightness systematically.

## 7. Backgrounds
Background styling helps define sections, cards, banners, and page atmosphere.

### 7.1 `background-color`

```css
.panel {
	background-color: #eff6ff;
}
```

This is the simplest and most common background property.

### 7.2 `background-image`

```css
.hero {
	background-image: url("./images/grid-pattern.png");
}
```

Explanation:
- Background images are decorative layers behind the element content.
- They should not contain essential content unless there is an accessible fallback.

### 7.3 `background-repeat`

```css
.pattern {
	background-image: url("./images/dot.png");
	background-repeat: repeat;
}
```

Common values:
- `repeat`
- `repeat-x`
- `repeat-y`
- `no-repeat`

### 7.4 `background-position`

```css
.hero {
	background-position: center top;
}
```

Explanation:
- This places the image horizontally in the center and vertically at the top.

### 7.5 `background-size`

```css
.hero {
	background-size: cover;
}
```

Common values:
- `cover`: fills the container, may crop the image.
- `contain`: fits the whole image inside the container.
- explicit sizes such as `300px 200px`

### 7.6 Gradients
Gradients are generated by CSS, so they do not require an image file.

```css
.banner {
	background: linear-gradient(135deg, #1d4ed8, #06b6d4);
}
```

Explanation:
- `linear-gradient()` blends colors along a direction.
- Gradients are useful for hero sections, buttons, and subtle visual depth.

Another example:

```css
.spotlight {
	background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
}
```

### 7.7 Layered Backgrounds
CSS allows multiple backgrounds on the same element.

```css
.hero {
	background-image: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("./images/campus.jpg");
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
```

Explanation:
- The gradient darkens the photo.
- The image sits underneath the gradient.
- This is a common technique for readable text over photography.

## 8. Readability and Accessibility Best Practices
Typography and color are not only design choices. They are also usability and accessibility choices.

### 8.1 Color Contrast
Text must have enough contrast against its background.

Poor example:

```css
.caption {
	color: #9ca3af;
	background-color: #f3f4f6;
}
```

Better example:

```css
.caption {
	color: #374151;
	background-color: #f3f4f6;
}
```

Why it matters:
- Low contrast makes text difficult to read.
- Contrast is especially important for users with low vision or when screens are used in bright environments.

### 8.2 Avoid Using Color Alone
Color should not be the only way to communicate meaning.

Example:

```css
.status-error {
	color: #b91c1c;
	font-weight: 700;
}
```

Better UI practice:
- Pair color with text labels, icons, or border styles.
- Example message: `Error: Email address is required`.

### 8.3 Comfortable Paragraph Width
Very long lines reduce readability.

```css
.article {
	max-width: 65ch;
}
```

Explanation:
- The `ch` unit is based on character width.
- Around `45ch` to `75ch` is a common readable range for paragraphs.

### 8.4 Prefer Scalable Units
For typography systems, `rem` is usually better than hardcoding every size in pixels.

```css
:root {
	font-size: 16px;
}

body {
	font-size: 1rem;
}

h1 {
	font-size: 2.5rem;
}
```

### 8.5 Keep Decoration Intentional
- Do not underline text that is not a link unless there is a clear reason.
- Avoid excessive uppercase text in long paragraphs.
- Avoid extreme letter spacing or very light font weights for important content.

## 9. Practical Design Patterns

### 9.1 Simple Interface Theme with Variables
Even before advanced CSS architecture, it is useful to centralize repeated color and font values.

```css
:root {
	--font-body: "Inter", sans-serif;
	--font-code: "Courier New", monospace;
	--color-text: #111827;
	--color-muted: #6b7280;
	--color-surface: #ffffff;
	--color-page: #f8fafc;
	--color-primary: #2563eb;
	--color-accent: #0ea5e9;
}

body {
	font-family: var(--font-body);
	color: var(--color-text);
	background-color: var(--color-page);
}

.button-primary {
	background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
	color: #ffffff;
}
```

Explanation:
- Variables reduce repetition.
- Changing one value updates many parts of the interface.

### 9.2 Styling Code Snippets

```css
code {
	font-family: "Courier New", monospace;
	background-color: #e5e7eb;
	padding: 0.15rem 0.35rem;
	border-radius: 4px;
}
```

Explanation:
- Code looks more readable when it uses a monospace font.
- A subtle background helps distinguish inline code from surrounding text.

## 10. Common Mistakes
- Using too many font families on one page.
- Choosing body text colors with low contrast.
- Setting a large heading size but forgetting to adjust `line-height`.
- Removing link underlines without providing another clear visual cue.
- Loading unnecessary font weights from Google Fonts.
- Using background images that make text hard to read.
- Applying decorative fonts to body paragraphs instead of short headings or accents.

## 11. Summary
Typography controls how text looks and feels, while color controls visual meaning and atmosphere. In CSS, the core typography properties are `font-family`, `font-size`, `font-weight`, `font-style`, and `line-height`. Web fonts can extend design choices, but they should be loaded carefully and backed up with fallbacks.

Text styling properties such as `text-align`, `text-decoration`, `text-transform`, and spacing controls help refine presentation. CSS colors can be written in several formats, each with different strengths. Background properties and gradients help shape the overall look of a page.

Strong CSS work is not only attractive. It is readable, maintainable, and accessible.

## Further Reading
- [MDN: font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
- [MDN: color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)
- [MDN: background](https://developer.mozilla.org/en-US/docs/Web/CSS/background)
- [Google Fonts Knowledge](https://fonts.google.com/knowledge)
