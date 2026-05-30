# Example 02 – Installing and Configuring TypeScript (tsconfig.json)

Demonstrates how to set up a TypeScript project from scratch, the role of `tsconfig.json`, and how different compiler options affect the output.

## Files

| File | Description |
|---|---|
| `tsconfig.json` | Fully annotated TypeScript project configuration |
| `tsconfig.strict.json` | A strict configuration recommended for new projects |
| `tsconfig.browser.json` | A configuration for browser/bundler projects |
| `src/index.ts` | Simple entry point to compile and run |

## How to Run

### Prerequisites

```bash
# Install Node.js from https://nodejs.org, then:
npm install -g typescript
tsc --version  # e.g. Version 5.4.5
```

### Set up and compile
cd -LiteralPath 'D:\[ Eugen ]\Repos\frontend-learning-path\frontend-knowledge-base\learning-path\module-4-typescript\chapter-1-typescript-fundamentals\examples\example-02-tsconfig-setup'

```bash
# Install TypeScript locally (recommended per project)
npm init -y
npm install --save-dev typescript

# Generate a default tsconfig.json
npx tsc --init

# Compile using the project tsconfig.json
npx tsc

# Run the compiled output
node dist/index.js
```

### Watch mode (auto-recompile on save)

```bash
npx tsc --watch
```

## Key Concepts Illustrated

- How `tsconfig.json` controls compilation behaviour
- The `target` option (which JS version to output)
- The `strict` flag and why it matters
- `rootDir` / `outDir` for organising source vs compiled files
- `sourceMap` for debugging TypeScript in browser DevTools
