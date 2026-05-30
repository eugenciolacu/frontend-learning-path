# Example 03 – Basic Types

Demonstrates all of TypeScript's fundamental built-in types: `string`, `number`, `boolean`, `any`, `unknown`, `void`, and `never`.

## Files

| File | Description |
|---|---|
| `basic-types.ts` | Examples of `string`, `number`, and `boolean` |
| `special-types.ts` | Examples of `any`, `unknown`, `void`, and `never` |
| `tsconfig.json` | TypeScript compiler configuration |

## How to Run

```bash
# Option A — compile then run
tsc basic-types.ts --target ES2020
node basic-types.js

tsc special-types.ts --target ES2020
node special-types.js

# Option B — use ts-node
npx ts-node basic-types.ts
npx ts-node special-types.ts
```

## Key Concepts Illustrated

- `string` — text values and template literals
- `number` — all numeric values (int, float, hex, binary, NaN, Infinity)
- `boolean` — `true` / `false` only
- `any` — disables type checking (escape hatch, use sparingly)
- `unknown` — type-safe alternative to `any` (requires narrowing)
- `void` — no return value (used for functions)
- `never` — unreachable code, exhaustive checks, always-throwing functions
