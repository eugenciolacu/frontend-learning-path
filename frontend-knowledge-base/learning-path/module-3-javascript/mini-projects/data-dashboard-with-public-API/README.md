# Mini-Project: Data Dashboard with Public API

A client-side data dashboard that fetches live country data from the [REST Countries API](https://restcountries.com/) and presents it as a searchable, filterable, and sortable dashboard with an interactive detail modal.

## Project Structure

```
data-dashboard-with-public-API/
├── index.html      # Page markup: header, stats, controls, card grid, modal
├── style.css       # All styles: CSS variables, layout, cards, modal, responsive
├── README.md       # This file
└── js/
    ├── api.js      # Fetch logic               (Chapter 5)
    ├── utils.js    # Pure helper functions      (Chapters 2 & 3)
    ├── render.js   # DOM manipulation           (Chapter 4)
    └── main.js     # App orchestration, events  (Chapters 1–6)
```

## How to Run

This project uses **ES Modules** (`<script type="module">`). Browsers block module imports over the `file://` protocol, so you must serve the folder through a local HTTP server.

**Option A – VS Code Live Server extension**  
Right-click `index.html` → *Open with Live Server*.

**Option B – Node.js one-liner**
```bash
npx http-server .
```
Then open `http://localhost:8080`.

> An active internet connection is required — the app fetches data from `https://restcountries.com/v3.1/`.

---

## Features

| Feature | Description |
|---|---|
| Live data | ~250 countries fetched once on load |
| Stats row | Total countries, world population, region count, most-populous country |
| Search | Real-time filter by country name |
| Region filter | Dropdown populated from the data itself |
| Sort | By name (A → Z), population (highest first), or area (largest first) |
| Card grid | Flag, name, capital, region, population, area |
| Detail modal | Click any card — shows full detail: languages, currency, subregion |
| Error handling | Network failures and HTTP errors surface a friendly banner |
| Loading state | Full-page spinner while the initial fetch is in flight |

---

## Concepts Demonstrated by Chapter

### Chapter 1 – JS Basics
- `const` for module-level constants and immutable references (`BASE_URL`, `filterState`)
- `let` for mutable application state (`allCountries`)
- String, number, boolean, null, and undefined data types throughout
- Template literals for URL construction and HTML generation
- Ternary operator: `countries.length === 1 ? 'country' : 'countries'`
- Logical `||` / `??` for fallback values: `capital?.[0] ?? '—'`

### Chapter 2 – Control Flow and Functions
- Arrow function syntax (`=>`) throughout the codebase
- `if / else` for error and loading-state guards
- `for...of` loop in `populateRegionFilter()` to iterate regions and build `<option>` elements
- Default function parameter: `formatNumber(value, fallback = 'N/A')`
- Named function declarations for top-level handlers (`init`, `update`)
- Rest/spread used with `Set` to derive unique values

### Chapter 3 – Objects and Arrays
- **Object destructuring** in every `renderCards` card template: `const { name, flags, capital, region, subregion, population, area } = country`
- `Array.prototype.filter()` — search query + region filter in `applyFilters()`
- `Array.prototype.map()` — transform country objects → HTML card strings in `renderCards()`
- `Array.prototype.reduce()` — sum total world population in `computeStats()`
- `Array.prototype.sort()` — three sort modes (name, population, area) in `applyFilters()`
- `Array.prototype.find()` — locate a country by name on card click in `main.js`
- `Object.values()` — extract language names and currency info in `openModal()`
- Spread + `Set`: `[...new Set(countries.map(c => c.region).filter(Boolean))].sort()` in `getUniqueRegions()`

### Chapter 4 – The DOM and Events
- `document.getElementById` and `document.querySelector` for element selection
- `element.innerHTML` with template literals for batch DOM updates (`renderStats`, `renderCards`, `openModal`)
- `document.createElement` + `element.appendChild` in `populateRegionFilter()`
- `element.textContent` for safe plain-text updates (`resultsCount`, `errorBanner`)
- `element.classList.toggle` / `.add` / `.remove` for CSS state classes
- `element.setAttribute` for `aria-hidden` state management
- `addEventListener` on `<input>` (`input` event), `<select>` (`change` event), `<button>` (`click` event), and `document` (`keydown` event)
- **Event delegation**: a single `click` listener on `#cards-grid` handles all card clicks via `event.target.closest('.country-card')`

### Chapter 5 – Asynchronous JavaScript
- `async` / `await` for readable, sequential-looking async code in `fetchAllCountries()` and `init()`
- `try / catch / finally` for complete error lifecycle: catch surfaces the error banner, finally always hides the spinner
- `fetch()` with a full URL and query-string parameters
- `Response.ok` check before calling `.json()` — catches 4xx/5xx HTTP errors that `fetch()` does not reject on
- `Promise.all()` in `fetchRegionComparison()` to issue two region requests concurrently

### Chapter 6 – Tooling, Debugging, and Modules
- **ES Modules**: `export` in `api.js`, `utils.js`, and `render.js`; named `import` in `main.js`
- `<script type="module" src="js/main.js">` in `index.html`
- `console.log` for fetch lifecycle messages and card-click debugging
- `console.error` in error handlers
- `console.table` on app init to inspect a sample slice of the fetched data
