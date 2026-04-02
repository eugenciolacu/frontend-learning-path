# Example 6: Design Tokens and Component Library

## Purpose
This example demonstrates a small token-driven component library structure.

## Architecture
- `tokens.json` stores design decisions in a technology-agnostic format.
- `theme.css` maps tokens into CSS custom properties.
- `components/` contains reusable component styles that consume semantic variables.
- `index.html` shows how the components render together.

## What to Notice
- Components reference semantic variables rather than hardcoded colors.
- The same token system can support multiple themes.
- A component library becomes easier to maintain when the token layer is stable.
