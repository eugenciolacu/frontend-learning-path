# Example 2: FLIP Technique for Layout Transitions

## Purpose
This example demonstrates how to animate card reordering with the FLIP technique.

## What to Notice
- The DOM order changes immediately when the sort button is pressed.
- JavaScript measures the first and last positions of each card.
- The visible motion is performed with `transform`, not by animating layout properties directly.
- This is a practical pattern for sorting, filtering, and rearranging UI blocks.

## How to Use
Open `index.html` in a browser and press the reorder button several times. Watch how the cards appear to glide into their new positions even though the layout change happens instantly in the DOM.