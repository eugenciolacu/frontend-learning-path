# Chapter 5: Semantic HTML & Structure

## 1. Why Semantic HTML Matters
Semantic HTML means choosing elements based on their meaning, not only on how they look.

When you use semantic elements, you help:

- browsers understand page structure,
- screen readers identify important regions,
- search engines interpret content more accurately,
- developers maintain code more easily,
- teams build more consistent interfaces.

Compare these two ideas:

- A `div` only says: "this is a generic container."
- A `nav` says: "this area contains navigation links."

That difference is important. Semantic HTML adds meaning to the document, and that meaning improves accessibility, maintainability, and clarity.

In real projects, semantic HTML is one of the first signs of professional frontend code. A page may still render if everything is built with `div` elements, but the structure becomes harder to understand for both people and assistive technologies.

## 2. Semantic vs Non-Semantic Elements
HTML elements can be grouped into two broad categories.

| Type | Examples | Meaning |
|------|----------|---------|
| Semantic elements | `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`, `button` | Describe the purpose of the content |
| Non-semantic elements | `div`, `span` | Generic containers with no built-in meaning |

### Non-semantic example

```html
<div class="page-header">
	<div class="menu">
		<a href="/">Home</a>
		<a href="/courses">Courses</a>
	</div>
</div>
```

This code can work visually, but it does not clearly explain the role of each part.

### Semantic example

```html
<header>
	<nav>
		<a href="/">Home</a>
		<a href="/courses">Courses</a>
	</nav>
</header>
```

This version is easier to understand because the element names describe the content.

Important idea: semantic HTML does not replace CSS. You still style the page with CSS, but the HTML should first describe meaning.

## 3. Main Sectioning Elements
This chapter focuses on these core sectioning and structural elements:

- `header`
- `nav`
- `main`
- `article`
- `section`
- `aside`
- `footer`

These elements create the large structural regions of a page.

### Quick reference table

| Element | Main purpose |
|---------|--------------|
| `header` | Introductory content for a page or section |
| `nav` | A region with major navigation links |
| `main` | The primary content of the page |
| `article` | A self-contained piece of content |
| `section` | A thematic grouping of related content |
| `aside` | Complementary or secondary content |
| `footer` | Closing or metadata content for a page or section |

These elements are often called landmarks because assistive technologies can jump between them.

## 4. Understanding `header`, `nav`, `main`, and `footer`

### `header`
The `header` element usually contains introductory content such as:

- a site title,
- a logo,
- navigation,
- a page heading,
- a search area.

Example:

```html
<header>
	<h1>Frontend Learning Portal</h1>
	<p>Structured lessons for HTML, CSS, and JavaScript.</p>
</header>
```

Important detail: a page can have more than one `header`.

- A site-wide `header` may appear near the top of the page.
- An `article` can also have its own `header`.

So `header` does not always mean the top of the entire website. It means introductory content for the nearest section or page region.

### `nav`
The `nav` element is used for major groups of navigation links.

Example:

```html
<nav aria-label="Primary">
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/modules">Modules</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</nav>
```

Use `nav` for important navigation areas such as:

- main site navigation,
- table of contents,
- breadcrumbs,
- pagination.

Do not wrap every small group of links in `nav`. A group of social links in the footer might be navigation, but a random set of inline links inside a paragraph usually is not.

If a page has multiple navigation regions, use `aria-label` to distinguish them.

Example:

```html
<nav aria-label="Primary">
	<!-- main site links -->
</nav>

<nav aria-label="Breadcrumb">
	<!-- breadcrumb links -->
</nav>
```

### `main`
The `main` element contains the primary content of the document.

Example:

```html
<main>
	<h1>Chapter Overview</h1>
	<p>This page explains semantic HTML.</p>
</main>
```

Best practices for `main`:

- use only one `main` element per page,
- place the most important content inside it,
- do not place repeated site-wide content such as top navigation or footers inside `main`.

Screen reader users often jump directly to `main`, so this element is extremely important.

### `footer`
The `footer` element contains closing or supporting information.

Common examples:

- copyright text,
- author information,
- related links,
- legal notices,
- contact details.

Example:

```html
<footer>
	<p>&copy; 2026 Frontend Learning Portal</p>
</footer>
```

Like `header`, `footer` can exist for the whole page or for a smaller section such as an `article`.

## 5. Understanding `article`, `section`, and `aside`

### `article`
An `article` represents a self-contained unit that could make sense on its own if separated from the page.

Common examples:

- a blog post,
- a news story,
- a forum post,
- a user comment,
- a product card with standalone meaning.

Example:

```html
<article>
	<header>
		<h2>Why Semantic HTML Improves Accessibility</h2>
		<p>Published on March 24, 2026</p>
	</header>

	<p>Semantic HTML provides meaningful landmarks and clearer structure.</p>

	<footer>
		<p>Author: Teaching Team</p>
	</footer>
</article>
```

Ask this question: could this content be shared, reused, or read independently? If yes, `article` may be the correct choice.

### `section`
A `section` groups related content around a common theme.

Example:

```html
<section>
	<h2>Learning Objectives</h2>
	<ul>
		<li>Understand semantic elements</li>
		<li>Build better page structure</li>
		<li>Improve accessibility</li>
	</ul>
</section>
```

Best practice: most `section` elements should have a heading, because the heading explains the theme of that section.

If you are only using a container for styling and there is no meaningful heading or thematic grouping, a `div` may be a better choice.

### `aside`
An `aside` contains complementary information related to the main content, but not part of the main flow.

Examples include:

- a sidebar,
- related articles,
- glossary notes,
- advertisements,
- author bio,
- exam tips next to a lesson.

Example:

```html
<aside>
	<h2>Study Tip</h2>
	<p>Use browser accessibility tools to inspect page landmarks.</p>
</aside>
```

The key idea is that `aside` supports the main content without being the main content itself.

## 6. A Full Semantic Page Example
The following example shows how these structural elements can work together.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Semantic HTML Example</title>
</head>
<body>
	<a href="#main-content">Skip to main content</a>

	<header>
		<h1>Frontend Learning Portal</h1>
		<nav aria-label="Primary">
			<ul>
				<li><a href="#overview">Overview</a></li>
				<li><a href="#articles">Articles</a></li>
				<li><a href="#resources">Resources</a></li>
			</ul>
		</nav>
	</header>

	<main id="main-content">
		<section id="overview">
			<h2>Overview</h2>
			<p>This page introduces semantic HTML structure.</p>
		</section>

		<section id="articles">
			<h2>Latest Articles</h2>

			<article>
				<h3>Using `main` Correctly</h3>
				<p>The `main` element should contain the unique content of the page.</p>
			</article>

			<article>
				<h3>When to Use `section`</h3>
				<p>A `section` groups related content under a common heading.</p>
			</article>
		</section>
	</main>

	<aside>
		<h2>Recommended Reading</h2>
		<p>Review heading structure and keyboard navigation after this chapter.</p>
	</aside>

	<footer>
		<p>&copy; 2026 Frontend Learning Portal</p>
	</footer>
</body>
</html>
```

Why this structure is strong:

- the page has a clear `header`, `main`, `aside`, and `footer`,
- navigation is identified with `nav`,
- content is grouped into meaningful `section` blocks,
- independent pieces of content use `article`,
- the skip link improves keyboard accessibility.

## 7. Inline vs Block Elements

### Block elements
Block elements usually start on a new line and expand to fill the available width of their container.

Common examples:

- `div`
- `p`
- `h1` to `h6`
- `section`
- `article`
- `header`
- `footer`
- `main`
- `ul`
- `ol`

Example:

```html
<p>First paragraph</p>
<p>Second paragraph</p>
```

These paragraphs appear on separate lines because `p` is a block-level element.

### Inline elements
Inline elements usually stay within the current line of text and only take up as much width as they need.

Common examples:

- `span`
- `a`
- `strong`
- `em`
- `code`
- `img`

Example:

```html
<p>
	Learn <strong>semantic HTML</strong> with the
	<a href="/roadmap">roadmap</a>.
</p>
```

In this case, `strong` and `a` remain inside the paragraph line flow.

### Why this difference matters
Knowing whether an element is inline or block helps you:

- predict layout behavior,
- choose better HTML structure,
- understand why elements stack or flow side by side,
- apply CSS more effectively.

Important note: CSS can change layout behavior with the `display` property, but semantic meaning should still guide your choice of element.

For example, you can visually style a `span` as a block, but that does not make it a meaningful section of the page.

## 8. When to Use `div` and `span`
Semantic HTML is important, but `div` and `span` are still valid and useful.

Use `div` when:

- you need a generic block container,
- no semantic element matches the purpose,
- you are grouping content for layout or styling only.

Use `span` when:

- you need a generic inline container,
- you want to style or target a small part of text,
- no semantic inline element is appropriate.

Example:

```html
<p>
	The next exam is on <span class="highlight">Friday</span>.
</p>
```

This is a good use of `span` because the highlighted word is still part of the sentence, not a new structural section.

Important rule: do not avoid `div` and `span` completely. Use them when needed, but do not use them as replacements for more meaningful elements.

## 9. Accessibility and Landmarks
Semantic HTML and accessibility are closely connected.

Many semantic elements create landmarks that assistive technologies can use for navigation. A screen reader user may move directly to:

- the banner area,
- navigation,
- main content,
- complementary content,
- content info.

In practice, this means a well-structured page is easier to explore without seeing the screen.

### Landmark-related elements

| Element | Common landmark meaning |
|---------|-------------------------|
| `header` | Often treated as banner when it is page-level |
| `nav` | Navigation |
| `main` | Main content |
| `aside` | Complementary content |
| `footer` | Often treated as content info when page-level |

Landmarks work best when the page structure is clean and intentional.

### Headings also matter
Semantic structure is not only about sectioning elements. Good heading order is also essential.

Example:

```html
<main>
	<h1>Semantic HTML & Structure</h1>

	<section>
		<h2>Sectioning Elements</h2>
		<p>These elements divide a page into meaningful regions.</p>
	</section>

	<section>
		<h2>Accessibility</h2>
		<p>Landmarks and headings help users navigate faster.</p>
	</section>
</main>
```

If headings are out of order or missing, the page becomes harder to navigate.

## 10. ARIA Roles: Use Native HTML First
ARIA stands for Accessible Rich Internet Applications. ARIA provides additional roles, states, and properties that can help assistive technologies understand complex interfaces.

Examples include:

- `role`
- `aria-label`
- `aria-expanded`
- `aria-hidden`
- `aria-describedby`

However, a critical best practice is this:

Use native semantic HTML first. Add ARIA only when necessary.

Good example:

```html
<nav aria-label="Primary">
	<ul>
		<li><a href="/html">HTML</a></li>
		<li><a href="/css">CSS</a></li>
	</ul>
</nav>
```

Why this is good:

- `nav` already provides semantic meaning,
- `aria-label` only adds clarity because there could be more than one navigation area.

Less ideal example:

```html
<div role="navigation">
	<a href="/html">HTML</a>
	<a href="/css">CSS</a>
</div>
```

This can work, but `nav` is better because HTML already has a dedicated element for this purpose.

Important rule:

- prefer `button` over `div role="button"`,
- prefer `nav` over `div role="navigation"`,
- prefer `main` over `div role="main"`.

ARIA is powerful, but it should enhance semantics, not replace correct HTML.

## 11. Alt Text and Images in Semantic Content
Alt text is important because accessibility is part of semantic structure.

The `alt` attribute describes the meaning or purpose of an image.

Informative image example:

```html
<img src="student-dashboard.png" alt="Dashboard showing completed HTML modules and progress bars">
```

Decorative image example:

```html
<img src="divider-pattern.png" alt="">
```

Rules for `alt` text:

- describe the image when it provides useful information,
- keep it concise and meaningful,
- use empty `alt=""` for decorative images,
- do not write "image of" or "picture of" unless that detail is important.

Poor alt text example:

```html
<img src="chart.png" alt="image">
```

Better alt text example:

```html
<img src="chart.png" alt="Bar chart showing HTML quiz scores increasing over three weeks">
```

## 12. Tab Order and Keyboard Navigation
Keyboard accessibility is part of semantic page structure because users should be able to move through the interface in a logical order.

By default, browsers create a focus order based on the HTML source order.

That is why semantic and well-organized HTML matters: the structure often becomes the navigation order.

### Good practice

```html
<header>
	<a href="#main-content">Skip to main content</a>
	<nav aria-label="Primary">
		<a href="/">Home</a>
		<a href="/modules">Modules</a>
	</nav>
</header>

<main id="main-content">
	<button type="button">Start lesson</button>
</main>
```

This creates a logical keyboard flow:

1. Skip link
2. Navigation links
3. Main content controls

### Avoid positive `tabindex`
Devs sometimes try to control keyboard order with values like `tabindex="3"` or `tabindex="8"`.

Example to avoid:

```html
<input type="text" tabindex="3">
<button type="submit" tabindex="1">Submit</button>
<a href="/help" tabindex="2">Help</a>
```

This usually creates confusion because the keyboard order no longer matches the visual or document order.

Better practice:

- keep the DOM order logical,
- use native interactive elements,
- avoid positive `tabindex` values,
- use `tabindex="0"` only when a non-focusable custom component truly needs to become focusable,
- use `tabindex="-1"` only when an element should be focusable by script but skipped in normal tab order.

## 13. Common Mistakes to Avoid

### Using `div` everywhere

```html
<div class="header"></div>
<div class="menu"></div>
<div class="content"></div>
<div class="sidebar"></div>
<div class="footer"></div>
```

This structure hides meaning that semantic elements could provide.

### Using `section` without a heading
A `section` usually needs a heading so users understand what the section is about.

Weak example:

```html
<section>
	<p>Some content</p>
</section>
```

Better example:

```html
<section>
	<h2>Course Summary</h2>
	<p>Some content</p>
</section>
```

### Using `article` for content that is not standalone
If the content only makes sense as part of the surrounding page, it may not be an `article`.

### Adding ARIA when native HTML already solves the problem
Too much ARIA can make markup harder to maintain and sometimes less accessible when used incorrectly.

### Breaking keyboard navigation
If you change focus order carelessly, keyboard users may struggle to use the page.

## 14. Practical Decision Guide
When choosing an element, ask these questions:

1. Is this the main content of the page?
	Use `main`.
2. Is this introductory content for a page or section?
	Use `header`.
3. Is this a major set of navigation links?
	Use `nav`.
4. Can this content stand on its own?
	Use `article`.
5. Is this a themed grouping with its own heading?
	Use `section`.
6. Is this related but secondary content?
	Use `aside`.
7. Is this ending or metadata content?
	Use `footer`.
8. Is there no semantic element that fits?
	Use `div` or `span`.

This simple decision process helps you avoid choosing elements only for appearance.

## 15. Summary
Semantic HTML improves the meaning and structure of a document.

In this chapter, the key ideas are:

- semantic elements describe purpose,
- sectioning elements create meaningful page regions,
- `article`, `section`, and `aside` have different roles,
- inline and block elements behave differently in layout,
- accessibility improves when HTML structure is clear,
- ARIA should support semantic HTML, not replace it,
- alt text and keyboard order are part of good structure.

If you build the habit of choosing elements by meaning, your HTML will be easier to understand, easier to maintain, and more accessible.

## Further Reading
- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [MDN: Using HTML sections and outlines](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
- [MDN: ARIA landmark roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)
