# Example 01 – What is TypeScript?

Demonstrates how TypeScript extends JavaScript with static typing, and how the TypeScript compiler catches errors before your code ever runs.

## Files

| File | Description |
|---|---|
| `javascript-comparison.js` | The same logic written in plain JavaScript — no type safety |
| `typescript-version.ts` | The TypeScript equivalent — errors caught at compile time |
| `tsconfig.json` | TypeScript compiler configuration |

## How to Run

### Prerequisites

```bash
node --version   # requires Node.js
npm install -g typescript
```

### Compile and run the TypeScript file

```bash
# Compile (this will show type errors if any)
tsc typescript-version.ts

# Run the compiled output
node typescript-version.js
```

### Or use ts-node for a one-step run

```bash
npm install -g ts-node
ts-node typescript-version.ts
```

## Key Concepts Illustrated

- TypeScript is a superset of JavaScript
- Type annotations add safety without changing runtime behaviour
- TypeScript compiler (`tsc`) catches type errors before execution
- Compiled output is plain JavaScript — no TypeScript at runtime
