# Chapter 8: Web APIs & Modern Capabilities (Advanced)

## 1. Why This Chapter Matters
Modern HTML is not limited to static markup. The browser exposes a large platform of built-in APIs that let developers:

- create reusable UI components,
- draw graphics without external plugins,
- build richer validation flows for forms,
- support offline usage and app-like installation,
- progressively enhance pages into more capable experiences.

This chapter is important because it shows how HTML connects to the rest of the browser platform. You are no longer only writing tags. You are coordinating markup, CSS, JavaScript, browser lifecycle events, storage, rendering engines, and network behavior.

This chapter focuses on:

- Web Components: Custom Elements, Shadow DOM, and HTML Templates,
- graphics APIs: Canvas API, WebGL, and SVG manipulation,
- advanced forms: Constraint Validation API and custom form controls mapping,
- offline capabilities: App Manifests and Service Worker integration.

It also adds a few practical concepts that are necessary to understand these topics correctly: progressive enhancement, browser support, accessibility, and security boundaries.

## 2. Understanding the Browser as an Application Platform
At a beginner level, a webpage often looks like a document. At an advanced level, the browser behaves more like an operating environment with multiple subsystems:

- the DOM for structure,
- CSSOM for styling,
- rendering engines for layout and painting,
- JavaScript runtime for behavior,
- networking APIs for data transfer,
- storage and caching layers for persistence and offline support.

This matters because the topics in this chapter live at different layers of the platform:

- Web Components extend the DOM itself,
- Canvas and WebGL talk to rendering systems,
- advanced form APIs coordinate DOM elements with validation logic,
- Service Workers sit between your application and the network.

Practical rule: do not treat these APIs as isolated tricks. Treat them as parts of the same browser architecture.

## 3. Web Components
Web Components are a set of standards that allow developers to create reusable, encapsulated HTML elements.

The three core pieces are:

- Custom Elements,
- Shadow DOM,
- HTML Templates.

Together, they let you define your own tags with internal structure and behavior.

### 3.1 Why Web Components Exist
Before Web Components, reusable UI was usually built with:

- framework components,
- jQuery widgets,
- naming conventions and shared CSS.

Those approaches can work, but they are not native browser primitives.

Web Components provide a standard way to:

- create custom tags such as `student-card` or `app-alert`,
- isolate internal markup and styles,
- reuse UI across projects or frameworks,
- expose a stable API through attributes, properties, events, and slots.

They are especially useful when you want reusable UI that is not tightly coupled to React, Vue, Angular, or another framework.

### 3.2 Custom Elements
Custom Elements let you define your own HTML tag names.

Example:

```html
<student-card name="Eugen" track="Frontend Engineering"></student-card>
```

To make this work, you register a class with `customElements.define()`.

```html
<script>
	class StudentCard extends HTMLElement {
		connectedCallback() {
			const name = this.getAttribute("name") ?? "Unknown student";
			const track = this.getAttribute("track") ?? "No track selected";

			this.innerHTML = `
				<article>
					<h2>${name}</h2>
					<p>${track}</p>
				</article>
			`;
		}
	}

	customElements.define("student-card", StudentCard);
</script>
```

Important idea: a custom element name must contain a hyphen, such as `student-card` or `course-badge`. This avoids conflicts with built-in HTML tags.

### 3.3 Lifecycle of a Custom Element
Custom elements follow lifecycle callbacks that run when the element is created or moved in the DOM.

Common callbacks:

- `constructor()`: initialize internal state,
- `connectedCallback()`: runs when the element is added to the document,
- `disconnectedCallback()`: runs when removed,
- `attributeChangedCallback()`: runs when watched attributes change,
- `adoptedCallback()`: runs if moved to another document.

Example with observed attributes:

```js
class StatusBadge extends HTMLElement {
	static observedAttributes = ["status"];

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback() {
		this.render();
	}

	render() {
		const status = this.getAttribute("status") ?? "unknown";
		this.textContent = `Status: ${status}`;
	}
}

customElements.define("status-badge", StatusBadge);
```

This is useful when your element should react to changes in HTML attributes.

### 3.4 Shadow DOM
Shadow DOM creates an encapsulated subtree inside an element. This lets a component manage its own internal structure and styles with reduced interference from the page.

Example:

```js
class InfoBox extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					padding: 1rem;
					border: 2px solid #1d4ed8;
					border-radius: 12px;
				}

				strong {
					color: #1d4ed8;
				}
			</style>
			<p><strong>Tip:</strong> Use semantic HTML first.</p>
		`;
	}
}

customElements.define("info-box", InfoBox);
```

Benefits of Shadow DOM:

- component styles are more isolated,
- internal markup is easier to reason about,
- collisions with page CSS are reduced,
- reusable components become safer to distribute.

Important limitation: Shadow DOM is not a security boundary. It is an encapsulation feature, not a permission system.

### 3.5 `:host`, Slots, and Component APIs
When using Shadow DOM, components often expose insertion points with `slot`.

```html
<course-panel>
	<span slot="title">Web APIs</span>
	<p>This chapter introduces browser-native capabilities.</p>
</course-panel>
```

```js
class CoursePanel extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					padding: 1rem;
					border: 1px solid #cbd5e1;
				}
			</style>
			<section>
				<h2><slot name="title">Untitled</slot></h2>
				<div><slot></slot></div>
			</section>
		`;
	}
}

customElements.define("course-panel", CoursePanel);
```

Key concepts:

- `:host` styles the custom element itself,
- named slots let the parent supply content to specific regions,
- the component exposes structure without exposing all internal details.

### 3.6 HTML Templates
The `template` element stores inert HTML. The browser parses it, but it is not rendered until JavaScript clones and inserts it.

Example:

```html
<template id="lesson-card-template">
	<article class="lesson-card">
		<h2 class="lesson-title"></h2>
		<p class="lesson-summary"></p>
	</article>
</template>

<div id="lesson-list"></div>

<script>
	const template = document.getElementById("lesson-card-template");
	const list = document.getElementById("lesson-list");

	const fragment = template.content.cloneNode(true);
	fragment.querySelector(".lesson-title").textContent = "Web Components";
	fragment.querySelector(".lesson-summary").textContent = "Build reusable native UI.";

	list.append(fragment);
</script>
```

Templates are useful when:

- repeating markup patterns,
- building custom elements,
- cloning content without rendering it immediately,
- improving separation between structure and instantiation logic.

### 3.7 Best Practices for Web Components
Use Web Components carefully. They are powerful, but poor design still leads to difficult code.

Recommended practices:

- expose a clear public API with attributes, properties, methods, and custom events,
- keep internal implementation private when possible,
- use semantic HTML inside the component,
- ensure keyboard accessibility and proper focus handling,
- avoid putting business logic directly into rendering code,
- document browser support for advanced features such as form-associated custom elements.

Use cases where Web Components fit well:

- design system widgets,
- framework-independent UI libraries,
- embedded widgets across multiple applications,
- reusable educational or enterprise controls.

## 4. Canvas API, WebGL, and SVG Manipulation
The browser offers multiple ways to create graphics. They are not interchangeable, so you need to know which tool fits which problem.

### 4.1 Canvas API
The Canvas API draws pixels into a bitmap surface using JavaScript.

Example:

```html
<canvas id="chart" width="400" height="200"></canvas>

<script>
	const canvas = document.getElementById("chart");
	const context = canvas.getContext("2d");

	context.fillStyle = "#0f172a";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#38bdf8";
	context.fillRect(30, 120, 60, 50);
	context.fillRect(120, 90, 60, 80);
	context.fillRect(210, 50, 60, 120);

	context.fillStyle = "#e2e8f0";
	context.font = "16px sans-serif";
	context.fillText("Canvas bar chart", 20, 30);
</script>
```

Canvas is good for:

- charts,
- games,
- particle effects,
- dynamic drawing,
- image processing.

Important property: Canvas is immediate-mode rendering. Once pixels are drawn, the browser does not automatically keep a separate DOM representation for each shape.

That means:

- you redraw when state changes,
- accessibility requires extra planning,
- hit testing and interaction logic are usually manual.

### 4.2 SVG Manipulation
SVG is vector-based and DOM-based. Shapes are represented as elements, so they can be styled and manipulated more like normal HTML.

Example:

```html
<svg id="progress-graphic" width="240" height="120" viewBox="0 0 240 120">
	<circle id="progress-ring" cx="60" cy="60" r="40" fill="none" stroke="#38bdf8" stroke-width="12"></circle>
	<text x="120" y="68" font-size="18">Loading</text>
</svg>

<script>
	const ring = document.getElementById("progress-ring");
	ring.setAttribute("stroke", "#22c55e");
	const circumference = 2 * Math.PI * 40;
	ring.style.strokeDasharray = String(circumference);
	ring.style.strokeDashoffset = String(circumference * 0.25);
</script>
```

SVG is good for:

- diagrams,
- icons,
- responsive charts,
- logos,
- accessible graphics with meaningful structure.

Because SVG elements are part of the DOM, you can:

- style them with CSS,
- attach events,
- animate attributes,
- inspect them with dev tools more easily than Canvas pixels.

### 4.3 WebGL
WebGL is a low-level graphics API for rendering 2D and 3D graphics using the GPU through JavaScript.

Basic setup:

```html
<canvas id="gl-canvas" width="320" height="200"></canvas>

<script>
	const glCanvas = document.getElementById("gl-canvas");
	const gl = glCanvas.getContext("webgl");

	if (!gl) {
		console.log("WebGL is not available in this browser.");
	} else {
		gl.viewport(0, 0, glCanvas.width, glCanvas.height);
		gl.clearColor(0.1, 0.2, 0.35, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}
</script>
```

WebGL is useful when you need:

- 3D scenes,
- hardware-accelerated effects,
- large visualizations,
- advanced rendering pipelines,
- game-like performance.

Important note: WebGL is much lower-level than Canvas 2D. It usually requires understanding:

- shaders,
- buffers,
- coordinate systems,
- GPU pipelines,
- performance tradeoffs.

In real projects, developers often use libraries such as Three.js on top of WebGL.

### 4.4 Canvas vs SVG vs WebGL

| Technology | Rendering Model | Best For | Main Tradeoff |
|-----------|-----------------|----------|---------------|
| Canvas 2D | Pixel-based bitmap | Games, custom drawing, image manipulation | Harder accessibility and object-level interactivity |
| SVG | DOM-based vector graphics | Icons, diagrams, interactive charts | Large scenes can become DOM-heavy |
| WebGL | GPU-accelerated pipeline | 3D, simulations, heavy visual effects | Much more complex implementation |

Practical rule:

- choose SVG for structured, scalable graphics,
- choose Canvas for dynamic drawing surfaces,
- choose WebGL when GPU rendering is actually required.

### 4.5 Accessibility Considerations for Graphics
Graphics are not automatically accessible.

For Canvas:

- provide surrounding text that explains the visual meaning,
- avoid making critical information available only as pixels,
- provide alternative tables or summaries for charts.

For SVG:

- use `title` and `desc` when useful,
- ensure meaningful labels for interactive shapes,
- preserve contrast and keyboard support for interactive controls.

Example accessible SVG metadata:

```html
<svg role="img" aria-labelledby="chart-title chart-desc" viewBox="0 0 200 100">
	<title id="chart-title">Quarterly enrollment growth</title>
	<desc id="chart-desc">A line chart showing steady growth from Q1 to Q4.</desc>
	<!-- shapes -->
</svg>
```

## 5. Advanced Forms: Validation API and Custom Form Controls
Basic HTML validation uses attributes such as `required`, `minlength`, `pattern`, and input types like `email`.

Advanced form work goes further. It coordinates:

- browser constraint validation,
- custom validation logic,
- accessible error messages,
- custom components that still participate in form submission.

### 5.1 The Constraint Validation API
Browsers expose a built-in validation system through the Constraint Validation API.

Useful methods:

- `checkValidity()`: returns `true` or `false`,
- `reportValidity()`: shows validation UI and returns validity status,
- `setCustomValidity(message)`: defines a custom error message,
- `validationMessage`: returns the current message,
- `validity`: exposes detailed validation state.

Example:

```html
<form id="signup-form" novalidate>
	<label for="student-email">Student email</label>
	<input id="student-email" name="email" type="email" required>

	<label for="study-hours">Weekly study hours</label>
	<input id="study-hours" name="studyHours" type="number" min="1" max="40" required>

	<button type="submit">Submit</button>
</form>

<script>
	const form = document.getElementById("signup-form");
	const hoursInput = document.getElementById("study-hours");

	hoursInput.addEventListener("input", () => {
		const value = Number(hoursInput.value);

		if (value > 20) {
			hoursInput.setCustomValidity("For this course, weekly study hours must be 20 or less.");
		} else {
			hoursInput.setCustomValidity("");
		}
	});

	form.addEventListener("submit", (event) => {
		if (!form.checkValidity()) {
			event.preventDefault();
			form.reportValidity();
		}
	});
</script>
```

This combines native validation with custom rules rather than replacing the browser completely.

### 5.2 Reading the `validity` Object
The `validity` object explains why a field is invalid.

Examples of useful flags:

- `valueMissing`,
- `typeMismatch`,
- `patternMismatch`,
- `rangeUnderflow`,
- `rangeOverflow`,
- `tooShort`,
- `customError`.

Example:

```js
if (emailInput.validity.valueMissing) {
	console.log("The user did not fill in the field.");
}

if (emailInput.validity.typeMismatch) {
	console.log("The value is not a valid email address.");
}
```

This is useful when you want to show more precise feedback in your own UI.

### 5.3 Accessible Error Handling
Custom validation is not only about JavaScript logic. It must also be understandable.

Recommended practices:

- keep labels visible,
- describe the expected format before the user fails,
- place error text near the related field,
- connect error text with `aria-describedby` when appropriate,
- do not rely on color alone,
- preserve keyboard usability.

Example:

```html
<label for="username">Username</label>
<input id="username" name="username" aria-describedby="username-help username-error">
<p id="username-help">Use 4 to 12 letters or numbers.</p>
<p id="username-error" role="alert"></p>
```

### 5.4 Custom Form Controls Mapping
Sometimes built-in form controls are not enough. You may want a custom rating control, tag selector, date widget, or design system component.

The problem is not only visual. The real challenge is making the custom control behave like a form control.

That means it should ideally support:

- a form value,
- validation state,
- disabled state,
- form reset behavior,
- label association,
- accessibility.

### 5.5 Form-Associated Custom Elements
Modern browsers support form-associated custom elements through `ElementInternals`.

Example:

```js
class SkillRating extends HTMLElement {
	static formAssociated = true;

	constructor() {
		super();
		this._internals = this.attachInternals();
		this._value = "3";
	}

	connectedCallback() {
		this._internals.setFormValue(this._value);
	}

	set value(newValue) {
		this._value = newValue;
		this._internals.setFormValue(newValue);
	}

	get value() {
		return this._value;
	}
}

customElements.define("skill-rating", SkillRating);
```

This means a custom element can participate in form submission similarly to native inputs.

Important note: this area still requires browser support checks and fallbacks.

### 5.6 When to Use Native Controls Instead of Custom Ones
Use native controls when possible because they already provide:

- accessibility defaults,
- keyboard behavior,
- mobile input support,
- browser validation integration,
- less code to maintain.

Create a custom control only when there is a strong reason such as:

- domain-specific behavior,
- a reusable design system requirement,
- interaction patterns that native controls cannot express adequately.

## 6. Offline Capabilities: App Manifests and Service Workers
Offline support allows a web app to keep working partially or fully when the network is slow, unstable, or unavailable.

This is a major step toward Progressive Web App behavior.

The roadmap mentions two key parts:

- App Manifests,
- integration with Service Workers.

### 6.1 Web App Manifest
A web app manifest is a JSON file that describes how an application should look and behave when installed or launched like an app.

Example:

```json
{
	"name": "Frontend Learning Path",
	"short_name": "FLP",
	"start_url": "/",
	"display": "standalone",
	"background_color": "#ffffff",
	"theme_color": "#0f172a",
	"icons": [
		{
			"src": "/icons/icon-192.png",
			"sizes": "192x192",
			"type": "image/png"
		}
	]
}
```

Common manifest fields:

- `name`: full application name,
- `short_name`: shorter version for limited spaces,
- `start_url`: launch entry point,
- `display`: browser UI mode such as `standalone`,
- `theme_color`: UI theming hint,
- `background_color`: splash background,
- `icons`: app icons.

The manifest does not itself provide offline behavior. It describes install and launch metadata.

### 6.2 Service Workers
A Service Worker is a JavaScript file that runs separately from the page and can intercept network requests.

Key capabilities:

- cache files for offline use,
- control fetch behavior,
- enable background strategies,
- support update flows,
- work as the foundation for many PWA features.

Basic registration:

```js
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/sw.js")
		.then((registration) => {
			console.log("Service Worker registered:", registration.scope);
		})
		.catch((error) => {
			console.error("Registration failed:", error);
		});
}
```

Basic worker file:

```js
const CACHE_NAME = "chapter-8-cache-v1";
const ASSETS = ["/", "/index.html", "/style.css", "/app.js"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			return cachedResponse ?? fetch(event.request);
		})
	);
});
```

### 6.3 Service Worker Lifecycle
Service Workers have a lifecycle that often confuses developers.

Important phases:

- registration,
- installation,
- activation,
- fetch handling,
- updates when a new worker version is detected.

Why this matters:

- users may still be controlled by an old worker,
- cache versions must be managed carefully,
- stale assets can survive if cleanup is wrong.

Example cache cleanup during activation:

```js
self.addEventListener("activate", (event) => {
	const allowedCaches = ["chapter-8-cache-v2"];

	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((key) => {
					if (!allowedCaches.includes(key)) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});
```

### 6.4 Common Offline Caching Strategies
Different types of resources need different strategies.

Common patterns:

- cache first: prefer cached asset, then network,
- network first: prefer fresh content, fallback to cache,
- stale while revalidate: return cache quickly, update in background,
- offline fallback page: return a stored offline page when navigation fails.

Example reasoning:

- CSS and JavaScript bundles often work well with cache-first or stale-while-revalidate,
- API data may need network-first,
- important navigation requests benefit from an offline fallback document.

### 6.5 Secure Context Requirement
Service Workers only work in secure contexts, usually:

- `https://` origins,
- `http://localhost` during development.

This is important because the worker can intercept network requests. The browser therefore restricts its use for security reasons.

### 6.6 Progressive Web Apps and Installability
When manifest support, HTTPS, and a suitable Service Worker are combined, the app can behave more like an installable application.

Possible benefits:

- launch from the home screen,
- app-like window display,
- offline access,
- better resilience on unreliable networks.

But a PWA is not just a checklist. It should still provide:

- useful offline behavior,
- good performance,
- meaningful content when connectivity changes,
- predictable update behavior.

## 7. Progressive Enhancement and Browser Support
Advanced web APIs should not become barriers for users.

Progressive enhancement means:

- start with a working baseline,
- add enhanced behavior only where supported,
- avoid breaking core content if an API is missing.

Examples:

- a custom element should degrade to understandable markup when possible,
- a Canvas chart should have a text summary,
- a custom form control should have a fallback or a native equivalent,
- offline support should improve resilience, not create new failure states.

Feature detection example:

```js
if ("customElements" in window) {
	console.log("Custom Elements are supported.");
}

if ("serviceWorker" in navigator) {
	console.log("Service Workers are supported.");
}

if (HTMLCanvasElement.prototype.getContext) {
	console.log("Canvas is supported.");
}
```

Avoid using user-agent strings for capability detection when feature detection is sufficient.

## 8. Security, Performance, and Maintainability Notes
These APIs are powerful, but they introduce real engineering concerns.

### 8.1 Security
- Service Workers can affect every request in their scope, so incorrect logic can break an application broadly.
- Custom elements that inject unsanitized HTML can create XSS risks.
- Offline caching may keep sensitive or outdated content longer than intended.

### 8.2 Performance
- badly designed Web Components can rerender too often,
- Canvas redraw loops can be expensive,
- SVG scenes with too many nodes can become slow,
- aggressive precaching can waste bandwidth and storage,
- Service Worker strategies should match real usage patterns.

### 8.3 Maintainability
- document the API of every reusable custom element,
- keep Service Worker versions explicit,
- prefer simple cache strategies before complex ones,
- use native browser behavior unless a custom solution is clearly necessary.

## 9. Summary
In this chapter, HTML becomes the entry point to a broader browser platform.

You learned that:

- Web Components allow native reusable UI with Custom Elements, Shadow DOM, and Templates,
- Canvas, SVG, and WebGL solve different graphics problems,
- advanced form handling combines browser validation with custom logic,
- form-associated custom elements connect design-system components to real form behavior,
- App Manifests describe installable app metadata,
- Service Workers enable caching and offline strategies,
- progressive enhancement and accessibility remain essential even when using advanced APIs.

The most important professional lesson is this: advanced browser APIs are not useful just because they exist. They are useful when they improve reliability, reuse, clarity, accessibility, and user experience without making the application harder to reason about.

## Further Reading
- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [MDN Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [MDN WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [MDN Constraint validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)
- [MDN ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
