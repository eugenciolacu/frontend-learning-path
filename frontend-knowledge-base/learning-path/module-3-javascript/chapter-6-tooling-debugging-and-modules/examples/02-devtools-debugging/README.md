# Example 02 — Debugging with Browser DevTools

## What This Demonstrates

Practical debugging scenarios using Chrome DevTools, including breakpoints, the `debugger` statement, async fetch inspection, and performance measurement.

## How to Run

1. Open `index.html` in a browser (Chrome recommended).
2. Open **DevTools** (`F12`).
3. Go to the **Sources** tab and find `debugging-demo.js` in the file tree.
4. Set breakpoints by clicking line numbers, then click the buttons.

## Files

| File | Purpose |
|---|---|
| `index.html` | UI with four debugging scenario buttons |
| `debugging-demo.js` | Code for each scenario with comments explaining where to set breakpoints |

## Scenarios

### Scenario 1: Shopping Cart Total Bug
- Demonstrates how string vs. number type confusion causes bugs.
- Set breakpoints inside `calculateTotal()` and inspect the `item.price` type in the Scope pane.

### Scenario 2: `debugger` Statement
- Shows how `debugger` pauses execution inside a loop.
- Use **Step Over (F10)** to walk through each iteration and watch `sum` change.

### Scenario 3: Async Fetch Debugging
- Fetches real JSON data from a public API.
- Use the **Network** tab to inspect request/response headers and body.
- Use the **Console** to see logged data.
- Try setting a **Fetch/XHR breakpoint** in DevTools → Sources → Event Listener Breakpoints.

### Scenario 4: Performance Measurement
- Uses `console.time()` and the `Performance` API to measure sorting 500,000 items.
- Open the **Performance** panel, click Record, run the demo, then Stop to view the flame chart.

## Key DevTools Shortcuts

| Action | Shortcut |
|---|---|
| Open DevTools | `F12` / `Ctrl+Shift+I` |
| Resume execution | `F8` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
