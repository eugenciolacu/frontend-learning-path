# Example 1: Compositor-Friendly Motion

## Purpose
This example compares two common animation strategies: a layout-heavy movement and a compositor-friendly movement.

## What to Notice
- The left card animates `left`, which is more likely to trigger layout work.
- The right card animates `transform`, which is usually the safer default for motion.
- Both interactions look similar, but the implementation cost is different.
- `prefers-reduced-motion` reduces the movement instead of forcing a large animation.

## How to Use
Open `index.html` in a browser and press the replay button. Compare the two panels and inspect the CSS to see how similar visual results can have different rendering costs.