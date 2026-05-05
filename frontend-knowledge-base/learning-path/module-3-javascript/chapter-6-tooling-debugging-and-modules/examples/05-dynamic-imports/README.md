# Example 05 — Dynamic Imports

## What This Demonstrates

How to use `import()` as a function to load ES modules on demand (lazily), enabling:
- Lazy feature loading (load code only when a user needs it)
- Conditional module loading (load different modules based on runtime state)
- Route-based code splitting (the pattern used by React Router, Vue Router, etc.)
- Using `import()` with `.then()` instead of `async/await`

## Project Structure

```
05-dynamic-imports/
├── index.html                  # UI (must be served over HTTP)
├── app.js                      # Entry point with all dynamic import() calls
└── modules/
    ├── heavy-chart.js          # Lazily loaded "heavy" chart module
    ├── utils.js                # Utility functions (loaded with .then())
    ├── themes/
    │   ├── default.js          # Loaded when "Default" theme is selected
    │   ├── dark.js             # Loaded when "Dark" theme is selected
    │   └── high-contrast.js    # Loaded when "High Contrast" is selected
    └── pages/
        ├── home.js             # Loaded when user navigates to /home
        ├── about.js            # Loaded when user navigates to /about
        └── contact.js          # Loaded when user navigates to /contact
```

## How to Run

Must be served over HTTP (ES Modules require CORS).

```bash
npx serve .
# Open http://localhost:3000
```

## Scenarios

### Scenario 1: Lazy Feature Load
Open the **Network tab** in DevTools before clicking "Load Chart Feature". Notice that `heavy-chart.js` only appears in the network requests **after** you click the button — not on initial page load.

### Scenario 2: Conditional Module Loading
Each theme is a separate module. Selecting "Dark" loads `dark.js`; selecting "High Contrast" loads `high-contrast.js`. Only the selected module is fetched.

Note the security pattern in `app.js` — a whitelist (`ALLOWED_THEMES`) validates the user-controlled `themeName` before using it in a template literal `import()`. This prevents path traversal attacks.

### Scenario 3: Route-Based Code Splitting
Each simulated "page" is a separate JS file. Clicking "About" fetches `about.js` — but only if it hasn't been loaded before (it's cached after first load).

### Scenario 4: `.then()` Style
Shows that `import()` returns a `Promise`, so `.then()` / `.catch()` chains work just like any other Promise.

## Key Concepts

### Static vs Dynamic Import

```js
// Static import — resolved at parse time, always loaded
import { add } from './math.js';

// Dynamic import — returns a Promise, loaded on demand
const { add } = await import('./math.js');
```

### Common Use Cases

| Pattern | Description |
|---|---|
| Lazy loading | Load a heavy module only when needed |
| Code splitting | Split routes/features into separate chunks |
| Conditional loading | Load different modules based on runtime conditions |
| Progressive enhancement | Load polyfills only in browsers that need them |

### Security Note

When using template literals in `import()`:

```js
// UNSAFE — if themeName comes from user input without validation
await import(`./themes/${themeName}.js`);

// SAFE — validate against an allowlist first
const ALLOWED = ['dark', 'light'];
if (!ALLOWED.includes(themeName)) throw new Error('Invalid theme');
await import(`./themes/${themeName}.js`);
```
