# Chapter 2: Working with Links and Images

## 1. Why Links and Images Matter
Links and images are two of the most important building blocks of the web.

- Links connect documents, sections, files, and actions.
- Images add visual meaning, explain ideas, and improve communication.
- Together, they help users navigate, understand content, and complete tasks.

This chapter is important because poor links and poor image usage create common real-world issues: confusing navigation, accessibility barriers, broken layouts, slow pages, and weak SEO.

## 2. The Anchor Tag and the `href` Attribute
The HTML anchor element, `<a>`, creates a hyperlink.

```html
<a href="https://developer.mozilla.org/">Visit MDN</a>
```

- `<a>` defines the link.
- `href` tells the browser where to go.
- The text between the opening and closing tags is the clickable content.

### Relative vs Absolute URLs
- A relative URL points to a file or page inside the same site.
- An absolute URL includes the full address, including the protocol such as `https://`.

```html
<a href="about.html">About This Site</a>
<a href="/docs/guide.html">Project Guide</a>
<a href="https://example.com/docs/guide.html">External Guide</a>
```

### Linking to a Section on the Same Page
You can link to a specific section by using an element `id` and a fragment identifier.

```html
<a href="#contact">Jump to Contact Section</a>

<h2 id="contact">Contact</h2>
<p>Email us for more information.</p>
```

This is called an internal page link or fragment link.

## 3. Common Types of Links

## 3.1 Internal Links
Internal links help users move through pages in the same website.

```html
<nav>
	<a href="index.html">Home</a>
	<a href="courses.html">Courses</a>
	<a href="contact.html">Contact</a>
</nav>
```

Use internal links for navigation menus, breadcrumbs, sidebars, and references to other sections of your project.

## 3.2 External Links
External links point to another website.

```html
<a href="https://www.w3.org/" target="_blank" rel="noopener noreferrer">
	Visit the W3C website
</a>
```

Important details:
- `target="_blank"` opens the destination in a new tab or window.
- `rel="noopener noreferrer"` improves security and privacy when opening a new tab.

### Why `noopener noreferrer` Matters
When a link opens in a new tab with `target="_blank"`, the newly opened page may get access to the page that opened it through the `window.opener` property.

Without protection, the new page can potentially do things such as:
- change the original page's location,
- redirect the user to a fake login page,
- manipulate the opener tab in misleading ways.

This kind of risk is commonly associated with reverse tabnabbing.

#### `noopener`
`noopener` tells the browser not to expose the opening page through `window.opener`.

```html
<a href="https://example.com" target="_blank" rel="noopener">
	Open example safely
</a>
```

Effectively, this means the newly opened page cannot control the original tab.

#### `noreferrer`
`noreferrer` does two things:
- it prevents the browser from sending referrer information to the destination page,
- it also disables access to `window.opener` in modern browsers.

```html
<a href="https://example.com" target="_blank" rel="noreferrer">
	Open example without sending referrer data
</a>
```

Referrer information usually tells the destination page where the visitor came from, for example which page contained the link.

#### Why both are often written together
You will frequently see both values together:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
	Open example in a new tab
</a>
```

This is common because it is:
- explicit,
- widely understood by developers,
- safe across modern usage patterns,
- clear about both security and privacy intent.

#### Tradeoff
Using `noreferrer` may prevent the destination site from seeing referral traffic in analytics tools, because the browser does not send the referring page information.

In practice:
- use `noopener` when your main goal is opener safety,
- use `noopener noreferrer` when you also want to avoid sending referrer data.

Do not open every external link in a new tab by default. Use new tabs only when there is a clear user benefit.

## 3.3 Email Links with `mailto:`
The `mailto:` protocol opens the user's default email application.

```html
<a href="mailto:student.support@example.com">Email student support</a>
```

You can prefill fields such as subject and body.

```html
<a href="mailto:student.support@example.com?subject=HTML%20Question&body=Hello%2C%20I%20need%20help%20with%20links.">
	Ask an HTML question
</a>
```

Spaces and special characters in query values should be URL-encoded.

## 3.4 Telephone Links with `tel:`
The `tel:` protocol is useful on mobile devices and communication-focused websites.

```html
<a href="tel:+40123456789">Call the admissions office</a>
```

On smartphones, this may open the phone dialer. On desktop devices, behavior depends on installed apps.

## 4. Writing Good Link Text
Link text should describe the destination or action clearly.

Good examples:

```html
<a href="course-outline.html">Read the course outline</a>
<a href="frontend-roadmap.pdf">Download the frontend roadmap PDF</a>
```

Weak examples:

```html
<a href="course-outline.html">Click here</a>
<a href="frontend-roadmap.pdf">More</a>
```

Why descriptive text matters:
- Screen reader users often navigate from link to link.
- Search engines use link text as context.
- All users scan pages faster when links describe their purpose.

## 5. The Image Tag and Its Core Attributes
The `<img>` element embeds an image into a page.

```html
<img src="images/campus.jpg" alt="University campus at sunrise">
```

Unlike `<a>`, the `<img>` tag is a void element, so it does not have a closing tag.

### Important Image Attributes

| Attribute | Purpose |
|-----------|---------|
| `src` | Path or URL to the image resource |
| `alt` | Text alternative used by screen readers and shown if the image fails to load |
| `title` | Optional advisory text, sometimes displayed as a tooltip |
| `width` / `height` | Reserve layout space and help reduce layout shifts |
| `loading` | Can be set to `lazy` for images that are not immediately needed |

Example:


```html
<img
	src="images/lab-photo.jpg"
	alt="Students working together in a computer lab"
	title="Computer lab session"
	width="800"
	height="500"
	loading="lazy"
>
```

## 6. The `alt` Attribute and Accessibility
The `alt` attribute is one of the most important parts of an image.

### Informative Images
If the image adds meaning, describe that meaning.

```html
<img src="chart.png" alt="Bar chart showing JavaScript as the most popular language in the class survey">
```

### Decorative Images
If the image is purely decorative, use an empty `alt` value.

```html
<img src="divider.svg" alt="">
```

This tells assistive technologies to ignore the image.

### Functional Images
If an image acts like a button or a link, the `alt` text should describe the action or destination.

```html
<a href="dashboard.html">
	<img src="dashboard-icon.png" alt="Open student dashboard">
</a>
```

Avoid using file names or vague labels such as `alt="image"` or `alt="photo"`.

## 7. Responsive Images with `srcset` and `sizes`
Responsive images help the browser choose the best image for the user's screen size and resolution.

### Basic `srcset` Example

```html
<img
	src="images/team-800.jpg"
	srcset="images/team-400.jpg 400w,
					images/team-800.jpg 800w,
					images/team-1200.jpg 1200w"
	sizes="(max-width: 600px) 100vw, 800px"
	alt="Development team collaborating around a desk"
>
```

How it works:
- `src` provides a default image.
- `srcset` lists candidate images and their widths.
- `sizes` tells the browser how much space the image will likely occupy.

The browser then selects the most appropriate source.

### Pixel Density Example
For icons or simple images, you may also see density descriptors such as `1x` and `2x`.

```html
<img
	src="images/logo-1x.png"
	srcset="images/logo-1x.png 1x, images/logo-2x.png 2x"
	alt="Frontend Learning Path logo"
>
```

## 8. Linking Images
An image can be placed inside an anchor tag so the image itself becomes clickable.

```html
<a href="project-details.html">
	<img src="images/project-card.jpg" alt="Open the student portfolio project details page">
</a>
```

This is common for product cards, gallery items, logos, and article previews.

If the image is the only content inside the link, the `alt` text must communicate the link destination clearly.

## 9. Opening Links in New Tabs
To open a link in a new tab, use `target="_blank"`.

```html
<a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">
	Open MDN in a new tab
</a>
```

Best practices:
- Use `rel="noopener noreferrer"` with `target="_blank"`.
- Consider informing users when a link opens in a new tab.
- Do not overuse this behavior.
- If referral analytics are important, understand that `noreferrer` hides the referring page from the destination site.

Example with visible context:

```html
<a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">
	MDN HTML Reference (opens in a new tab)
</a>
```

## 10. Accessibility for Links and Images

### Links
- Use meaningful text instead of generic labels.
- Make sure links are keyboard accessible.
- Ensure sufficient color contrast.
- Do not rely only on color to show a link.

### Images
- Always decide whether the image is informative, decorative, or functional.
- Write `alt` text based on purpose, not only appearance.
- Avoid placing important text inside images when normal HTML text would work better.
- Provide captions when they help users understand context.

### Figure and Figcaption
For images that need a visible caption, use `<figure>` and `<figcaption>`.

```html
<figure>
	<img src="images/network-topology.png" alt="Simple network topology with router, switch, and three computers">
	<figcaption>Figure 1: A basic local network diagram.</figcaption>
</figure>
```

## 11. Common Mistakes to Avoid
- Using `href="#"` as a real navigation link.
- Writing vague link text such as `here`, `more`, or `read more` without context.
- Omitting the `alt` attribute on images.
- Using the same oversized image for all devices.
- Opening every external link in a new tab.
- Forgetting `rel="noopener noreferrer"` when using `target="_blank"`.
- Using images to display critical text that should be real HTML text.
- Leaving broken relative paths such as `images/photo.jpg` when the actual folder structure is different.

## 12. Browser and Performance Notes
- If an image fails to load, the browser may display the `alt` text.
- Defining `width` and `height` helps the browser reserve space before the image loads.
- Large images slow down pages, so resize and compress them before use.
- `loading="lazy"` can improve performance for images lower on the page.

Example:

```html
<img
	src="images/article-preview.jpg"
	alt="Preview image for the HTML accessibility article"
	width="960"
	height="540"
	loading="lazy"
>
```

## 13. Real-World Example: Navigation Card with an Image

```html
<article>
	<h2>Frontend Learning Resources</h2>

	<a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer">
		<img
			src="images/html-reference-preview.jpg"
			alt="Open the MDN HTML reference in a new tab"
			width="640"
			height="360"
		>
	</a>

	<p>
		Explore the HTML reference for element definitions, attributes, and browser compatibility.
	</p>

	<p>
		<a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer">
			Read the HTML reference (opens in a new tab)
		</a>
	</p>
</article>
```

This example combines:
- an external link,
- a linked image,
- accessible `alt` text,
- explicit new-tab behavior.

## 14. Further Reading
- [MDN: The anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [MDN: The img element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
