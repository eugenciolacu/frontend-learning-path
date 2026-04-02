# Example 1: BEM Component Architecture

## Purpose
This example demonstrates how BEM naming makes a reusable card component easier to read and extend.

## What to Notice
- `.course-card` is the block.
- `.course-card__title` and `.course-card__meta-item` are elements inside the block.
- `.course-card--featured` is a modifier that changes the card variation without changing the component structure.
- The CSS does not depend on a page-specific parent selector, so the component remains portable.

## How to Use
Open `index.html` in a browser and inspect how the class names map directly to the component structure.
