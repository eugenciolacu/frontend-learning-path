# Example 1: CSSOM and Critical Rendering Path

This example demonstrates:
- reading computed styles through `getComputedStyle()`
- updating custom properties with JavaScript
- using the CSSOM without rewriting the stylesheet by hand
- a simple way to connect browser rendering concepts to a visible demo

Open `index.html` in a browser, press the action buttons, and inspect the text in the debug panel. The example is intentionally small so the CSSOM interaction is easy to follow.

*** Add File: c:\Eugen Files\Projects\frontend-learning-path\frontend-knowledge-base\learning-path\module-2-css-styling-architecture\chapter-8-advanced-css-concepts\examples\01-cssom-and-critical-rendering-path\index.html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Example 1 - CSSOM and Critical Rendering Path</title>
	<link rel="stylesheet" href="styles.css">
	<script src="script.js" defer></script>
</head>
<body>
	<main class="page-shell">
		<header class="hero">
			<p class="eyebrow">CSSOM Demo</p>
			<h1>Reading and changing CSS through browser APIs.</h1>
			<p>The card below uses CSS custom properties. JavaScript reads the computed styles and updates the accent token without touching every rule manually.</p>
		</header>

		<section class="playground">
			<article class="preview-card" id="preview-card">
				<h2>Rendering Pipeline Card</h2>
				<p>DOM and CSSOM are combined into a render tree before layout and paint happen.</p>
				<div class="badge-row">
					<span class="badge">DOM</span>
					<span class="badge">CSSOM</span>
					<span class="badge">Paint</span>
				</div>
			</article>

			<aside class="control-panel">
				<h2>Controls</h2>
				<button type="button" id="inspect-button">Inspect computed styles</button>
				<button type="button" id="accent-button">Change accent token</button>
				<pre class="output" id="output" aria-live="polite">Press a button to inspect the card.</pre>
			</aside>
		</section>
	</main>
</body>
</html>

*** Add File: c:\Eugen Files\Projects\frontend-learning-path\frontend-knowledge-base\learning-path\module-2-css-styling-architecture\chapter-8-advanced-css-concepts\examples\01-cssom-and-critical-rendering-path\styles.css
:root {
	--page-bg: #eef6f5;
	--surface: #ffffff;
	--surface-strong: #d9f2ee;
	--text: #14323a;
	--muted: #45626a;
	--accent: #0f766e;
	--line: #b9d8d3;
	--shadow: 0 1.2rem 2.8rem rgba(20, 50, 58, 0.12);
	--radius: 1.4rem;
}

* {
	box-sizing: border-box;
}

body {
	margin: 0;
	font-family: Georgia, "Times New Roman", serif;
	background:
		radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 28%),
		linear-gradient(180deg, #f5fbfa 0%, var(--page-bg) 100%);
	color: var(--text);
}

.page-shell {
	width: min(100% - 2rem, 72rem);
	margin: 0 auto;
	padding: 2.5rem 0 3rem;
}

.hero {
	max-width: 46rem;
	margin-bottom: 1.75rem;
}

.eyebrow {
	margin: 0 0 0.75rem;
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--accent);
}

.hero h1 {
	margin: 0 0 0.75rem;
	font-size: clamp(2rem, 4vw, 3.5rem);
}

.hero p {
	margin: 0;
	line-height: 1.7;
	color: var(--muted);
}

.playground {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	gap: 1rem;
}

.preview-card,
.control-panel {
	padding: 1.5rem;
	background: var(--surface);
	border: 1px solid var(--line);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
}

.preview-card {
	background: linear-gradient(180deg, var(--surface) 0%, var(--surface-strong) 100%);
	border-top: 0.45rem solid var(--accent);
}

.preview-card h2,
.control-panel h2 {
	margin-top: 0;
	margin-bottom: 0.75rem;
}

.preview-card p {
	margin-top: 0;
	line-height: 1.7;
	color: var(--muted);
}

.badge-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 1rem;
}

.badge {
	padding: 0.45rem 0.75rem;
	border-radius: 999px;
	background: rgba(15, 118, 110, 0.12);
	color: var(--accent);
	font-weight: 700;
}

.control-panel button {
	display: block;
	width: 100%;
	margin-bottom: 0.75rem;
	padding: 0.9rem 1rem;
	border: none;
	border-radius: 0.95rem;
	background: var(--accent);
	color: #ffffff;
	font: inherit;
	font-weight: 700;
	cursor: pointer;
}

.output {
	margin: 0.5rem 0 0;
	padding: 1rem;
	min-height: 12rem;
	overflow: auto;
	border-radius: 1rem;
	background: #0f172a;
	color: #d1fae5;
	line-height: 1.6;
	white-space: pre-wrap;
}

*** Add File: c:\Eugen Files\Projects\frontend-learning-path\frontend-knowledge-base\learning-path\module-2-css-styling-architecture\chapter-8-advanced-css-concepts\examples\01-cssom-and-critical-rendering-path\script.js
const previewCard = document.getElementById("preview-card");
const output = document.getElementById("output");
const inspectButton = document.getElementById("inspect-button");
const accentButton = document.getElementById("accent-button");

const accentPalette = ["#0f766e", "#b45309", "#1d4ed8", "#7c3aed"];
let accentIndex = 0;

inspectButton.addEventListener("click", () => {
	const computed = getComputedStyle(previewCard);
	output.textContent = [
		"Computed styles for .preview-card",
		`background-color: ${computed.backgroundColor}`,
		`border-top-color: ${computed.borderTopColor}`,
		`border-radius: ${computed.borderTopLeftRadius}`,
		`box-shadow: ${computed.boxShadow}`,
		"",
		"This data comes from the computed style stage after the browser has matched selectors and resolved variables."
	].join("\n");
});

accentButton.addEventListener("click", () => {
	accentIndex = (accentIndex + 1) % accentPalette.length;
	const nextAccent = accentPalette[accentIndex];
	document.documentElement.style.setProperty("--accent", nextAccent);
	output.textContent = [
		`Updated --accent to ${nextAccent}.`,
		"The browser recalculates the affected styles and repaints the changed elements.",
		"This is a practical CSSOM pattern for theming and interactive tools."
	].join("\n");
});

*** Add File: c:\Eugen Files\Projects\frontend-learning-path\frontend-knowledge-base\learning-path\module-2-css-styling-architecture\chapter-8-advanced-css-concepts\examples\02-advanced-grid-subgrid-and-progressive-masonry\README.md
# Example 2: Advanced Grid, Subgrid, and Progressive Masonry

This example demonstrates:
- a parent grid used for repeated lesson cards
- `subgrid` so card sections align across cards
- a masonry enhancement block inside `@supports`
- a safe fallback when experimental layout behavior is unavailable

Open `index.html` and compare the aligned lesson cards with the gallery beneath them. If your browser supports masonry Grid, the lower section will pack items more tightly.

*** Add File: c:\Eugen Files\Projects\frontend-learning-path\frontend-knowledge-base\learning-path\module-2-css-styling-architecture\chapter-8-advanced-css-concepts\examples\02-advanced-grid-subgrid-and-progressive-masonry\index.html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Example 2 - Advanced Grid</title>
	<link rel="stylesheet" href="styles.css">
</head>
<body>
	<main class="page-shell">
		<header class="intro">
			<p class="eyebrow">Advanced Grid</p>
			<h1>Subgrid keeps repeated card content aligned.</h1>
			<p>The first section uses a parent grid with cards that inherit the row tracks. The second section shows a masonry-style enhancement with a regular grid fallback.</p>
		</header>

		<section class="lesson-grid" aria-label="Subgrid lesson cards">
			<article class="lesson-card">
				<p class="card-kicker">Module</p>
				<h2>Layout Systems</h2>
				<p>Subgrid lets the title, summary, and action row line up across a set of cards.</p>
				<a href="#">Open module</a>
			</article>
			<article class="lesson-card">
				<p class="card-kicker">Module</p>
				<h2>Nested Dashboards</h2>
				<p>Without subgrid, repeated cards often look uneven because their internal rows are sized independently.</p>
				<a href="#">Open module</a>
			</article>
			<article class="lesson-card">
				<p class="card-kicker">Module</p>
				<h2>Editorial Interfaces</h2>
				<p>Shared row tracks make scanning easier because important content starts and ends at the same visual points.</p>
				<a href="#">Open module</a>
			</article>
		</section>

		<section class="masonry-section">
			<h2>Masonry enhancement</h2>
			<div class="gallery">
				<article class="tile tall"><h3>Performance</h3><p>Large stylesheets and expensive paint effects can slow rendering.</p></article>
				<article class="tile"><h3>Fallbacks</h3><p>Build a strong baseline before enabling newer features.</p></article>
				<article class="tile tall"><h3>Design Tokens</h3><p>Component, semantic, and raw tokens help teams manage scale.</p></article>
				<article class="tile"><h3>Query Containers</h3><p>Components can react to container width, not only viewport width.</p></article>
				<article class="tile"><h3>Functions</h3><p>`clamp()` and `minmax()` reduce breakpoint-heavy code.</p></article>
			</div>
		</section>
	</main>
</body>
</html>

*** Add File: c:\Eugen Files\Projects\frontend-learning-path\frontend-knowledge-base\learning-path\module-2-css-styling-architecture\chapter-8-advanced-css-concepts\examples\02-advanced-grid-subgrid-and-progressive-masonry\styles.css
:root {
	--bg: #f7f3ec;
	--surface: #fffdf9;
	--surface-alt: #efe1ca;
	--line: #d7c3a2;
	--text: #2f2414;
	--muted: #6a5738;
	--accent: #9a3412;
	--shadow: 0 1rem 2.5rem rgba(47, 36, 20, 0.12);
}

* {
	box-sizing: border-box;
}

body {
	margin: 0;
	font-family: Cambria, Georgia, serif;
	background:
		radial-gradient(circle at top left, rgba(154, 52, 18, 0.14), transparent 30%),
		linear-gradient(180deg, #fffaf2 0%, var(--bg) 100%);
	color: var(--text);
}

.page-shell {
	width: min(100% - 2rem, 74rem);
	margin-inline: auto;
	padding-block: 2.25rem 3rem;
}

.intro {
	max-width: 48rem;
	margin-bottom: 1.5rem;
}

.eyebrow {
	margin: 0 0 0.75rem;
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--accent);
}

.intro h1,
.masonry-section h2 {
	margin: 0 0 0.75rem;
	font-size: clamp(2rem, 4vw, 3.3rem);
}

.intro p,
.masonry-section p {
	margin: 0;
	line-height: 1.7;
	color: var(--muted);
}

.lesson-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	grid-auto-rows: auto auto 1fr auto;
	gap: 1rem;
	margin-bottom: 2rem;
}

.lesson-card {
	display: grid;
	grid-template-rows: subgrid;
	grid-row: span 4;
	padding: 1.35rem;
	border: 1px solid var(--line);
	border-radius: 1.35rem;
	background: linear-gradient(180deg, var(--surface) 0%, var(--surface-alt) 100%);
	box-shadow: var(--shadow);
}

.card-kicker {
	margin: 0;
	font-size: 0.82rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--accent);
}

.lesson-card h2 {
	margin: 0;
	font-size: 1.5rem;
}

.lesson-card p {
	margin: 0;
	line-height: 1.7;
	color: var(--muted);
}

.lesson-card a {
	align-self: end;
	justify-self: start;
	padding: 0.75rem 1rem;
	border-radius: 0.9rem;
	background: var(--accent);
	color: #ffffff;
	font-weight: 700;
	text-decoration: none;
}

.masonry-section {
	padding: 1.5rem;
	border: 1px solid var(--line);
	border-radius: 1.35rem;
	background: rgba(255, 255, 255, 0.78);
	box-shadow: var(--shadow);
}

.gallery {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	gap: 1rem;
	margin-top: 1rem;
}

.tile {
	padding: 1rem;
	border-radius: 1.1rem;
	background: #fff7ed;
	border: 1px solid #fed7aa;
	min-height: 10rem;
}

.tile.tall {
	min-height: 14rem;
}

.tile h3 {
	margin-top: 0;
	margin-bottom: 0.6rem;
}

.tile p {
	margin: 0;
	line-height: 1.6;
	color: var(--muted);
}

@supports (grid-template-rows: masonry) {
	.gallery {
		grid-template-rows: masonry;
		align-tracks: start;
	}
}