# Example 4: Scroll-Driven Animations

## Purpose
This example demonstrates two modern scroll-driven animation patterns: a reading progress bar driven by page scroll, and reveal cards driven by view progress.

## What to Notice
- The progress bar uses `animation-timeline: scroll(root block)`.
- The cards use `animation-timeline: view(block)` and an `animation-range` tied to viewport entry.
- A feature query keeps the page readable even when the feature is unsupported.
- Reduced-motion handling removes the stronger movement while preserving the content.

## How to Use
Open `index.html` in a browser and scroll through the page. In browsers that support scroll-driven animations, the progress bar and reveal cards should react to scroll position. In unsupported browsers, the layout still works as a normal article.