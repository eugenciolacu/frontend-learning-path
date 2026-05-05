# Example 03 — ESLint + Prettier Setup

## What This Demonstrates

A complete ESLint and Prettier configuration for a JavaScript project, including:
- `eslint.config.js` using the modern flat config format (ESLint v9+)
- `.prettierrc` with common settings
- A VS Code workspace configuration for format-on-save
- A `bad-code.js` file with intentional violations for you to lint/fix
- A `good-code.js` file showing the corrected version

## Project Structure

```
03-eslint-prettier-setup/
├── .prettierrc             # Prettier formatting rules
├── .prettierignore         # Files to skip formatting
├── eslint.config.js        # ESLint rules (flat config)
├── package.json            # npm scripts: lint, format, check
├── .vscode/
│   ├── extensions.json     # Recommended VS Code extensions
│   └── settings.json       # Format on save settings
└── src/
    ├── bad-code.js         # Code with intentional ESLint/Prettier violations
    └── good-code.js        # The same code, correctly fixed
```

## How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Lint the Source Files

```bash
npm run lint
```

You will see ESLint warnings and errors from `bad-code.js`.

### 3. Auto-Fix Lint Issues

```bash
npm run lint:fix
```

ESLint will automatically fix issues it knows how to resolve.

### 4. Format with Prettier

```bash
npm run format
```

### 5. Check Formatting Without Changing Files

```bash
npm run format:check
```

### 6. Run All Checks

```bash
npm run check
```

## VS Code Integration

Install the recommended extensions when prompted. With `.vscode/settings.json` in place:

- **Format on Save**: Prettier automatically formats your file each time you save.
- **Lint on Save**: ESLint auto-fixes fixable issues on each save.

## Key Files Explained

### `eslint.config.js`

Uses the new **flat config** format (ESLint v9+). Applies:
1. `js.configs.recommended` — ESLint's built-in ruleset.
2. `eslint-config-prettier` — Disables formatting rules that conflict with Prettier.
3. Custom rules — Project-specific overrides.

### `.prettierrc`

| Option | Value | Meaning |
|---|---|---|
| `semi` | `true` | Always add semicolons |
| `singleQuote` | `true` | Use `'` instead of `"` |
| `trailingComma` | `"es5"` | Add trailing commas where valid in ES5 |
| `tabWidth` | `2` | 2 spaces per indent level |
| `printWidth` | `80` | Wrap lines longer than 80 characters |
| `arrowParens` | `"always"` | Always parenthesize arrow function args |
