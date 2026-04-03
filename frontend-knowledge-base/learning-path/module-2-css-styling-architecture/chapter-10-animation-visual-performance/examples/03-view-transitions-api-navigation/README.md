# Example 3: View Transitions API Navigation

## Purpose
This example demonstrates a same-document transition between a lesson gallery and a detail panel using the View Transitions API.

## What to Notice
- Clicking a card updates the detail view in the same document.
- If `document.startViewTransition()` is available, the browser creates a smoother state change.
- The DOM update is the baseline behavior, and the transition is added as progressive enhancement.
- The demo still works when the API is unsupported because the DOM update is the baseline behavior.

## How to Use
Open `index.html` in a modern browser and select different lessons. If your browser supports the API, the list-to-detail change should animate more smoothly. If not, the content still updates correctly.