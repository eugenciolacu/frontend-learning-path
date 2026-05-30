# Example 04 – Type Inference and Type Annotations

Demonstrates how TypeScript's type inference works, when to write explicit annotations, and the important distinction between `let` (type widening) and `const` (literal type narrowing).

## Files

| File | Description |
|---|---|
| `inference.ts` | How TypeScript infers types automatically |
| `annotations.ts` | When and how to write explicit type annotations |
| `tsconfig.json` | TypeScript compiler configuration |

## How to Run

```bash
npx ts-node inference.ts
npx ts-node annotations.ts
```

## Key Concepts Illustrated

- Type inference from initial value assignment
- `let` vs `const` and how they affect inferred types (widening vs literal types)
- When type annotations are required (uninitialized variables, function parameters)
- When annotations are redundant (obvious initializers)
- Implicit `any` and how `noImplicitAny` protects you
- Annotating function parameters and return types
- Complex cases where annotations add clarity
