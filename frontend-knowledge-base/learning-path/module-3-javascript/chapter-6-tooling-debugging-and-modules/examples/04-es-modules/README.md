# Example 04 — ES Modules: import / export

## What This Demonstrates

All major ES Module patterns: named exports, default exports, namespace imports, mixed imports, and barrel files (re-exports via `index.js`).

## Project Structure

```
04-es-modules/
├── index.html          # UI — must be served via HTTP (not file://)
├── app.js              # Entry point (loaded with type="module")
└── modules/
    ├── math.js         # Named exports: add, subtract, PI, etc.
    ├── logger.js       # Default export (Logger class) + named (LOG_LEVEL)
    ├── validators.js   # Named exports: isEmail, isValidUsername, etc.
    └── index.js        # Barrel file — re-exports everything from above
```

## How to Run

ES Modules require HTTP (browsers block them on `file://` due to CORS).

**Option 1 — `serve` (recommended):**

```bash
npx serve .
# Open http://localhost:3000
```

**Option 2 — VS Code Live Server:**

Install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

**Option 3 — Node.js (no browser needed):**

```bash
# Add "type": "module" to a package.json, then:
node app.js
# Note: window.runMathDemo etc. won't work in Node (no DOM), but the imports will.
```

## Import Patterns Demonstrated

### Named Import
```js
import { add, PI } from './modules/math.js';
```
Import specific named exports by their exact name.

### Default Import
```js
import Logger from './modules/logger.js';
```
Import the single default export — you can name it anything.

### Mixed Import
```js
import Logger, { LOG_LEVEL } from './modules/logger.js';
```
Default and named imports in one statement.

### Namespace Import
```js
import * as Validators from './modules/validators.js';
Validators.isEmail('test@example.com');
```
Import all exports into a single namespace object.

### Barrel Import
```js
import { add, Logger, isEmail } from './modules/index.js';
```
`index.js` re-exports from multiple modules — one import path for everything.

## Key Rules for Browser ES Modules

| Rule | Reason |
|---|---|
| Use `type="module"` on `<script>` | Enables `import`/`export` syntax |
| Must be served via HTTP, not `file://` | Browser CORS policy |
| File extensions (`.js`) are required in import paths | No bundler to resolve them |
| Always strict mode | Modules are always strict |
| Variables are module-scoped | Not accessible on `window` |
