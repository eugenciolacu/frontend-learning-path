# Example 5: Sass and PostCSS Pipeline

## Purpose
This example shows a typical authoring pipeline for scalable CSS.

## Flow
1. Tokens and reusable mixins are defined in Sass partials.
2. Components import those partials into a main stylesheet.
3. PostCSS plugins transform the generated CSS for compatibility and optimization.

## What to Notice
- Sass is used for authoring convenience.
- PostCSS is used for transforms such as nesting, prefixes, and minification.
- The architecture still depends on clear tokens and component boundaries.
