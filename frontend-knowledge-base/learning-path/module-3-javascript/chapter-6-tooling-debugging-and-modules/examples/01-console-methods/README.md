# Example 01 — Console Methods

## What This Demonstrates

All major methods of the browser `console` API, with interactive buttons in the browser that trigger each method so you can see the output in DevTools.

## How to Run

1. Open `index.html` directly in a browser (double-click or use a local dev server).
2. Open **DevTools** (`F12`) and go to the **Console** tab.
3. Click each button to see the corresponding output.

## Files

| File | Purpose |
|---|---|
| `index.html` | UI with buttons, one per console method group |
| `console-demo.js` | Implementation of each demo function |

## Methods Covered

| Method | Use Case |
|---|---|
| `console.log()` | General output and styled messages (`%c`) |
| `console.warn()` | Non-critical warnings |
| `console.error()` | Error messages and caught exceptions |
| `console.table()` | Display arrays of objects as a formatted table |
| `console.group()` | Group related log lines (expanded by default) |
| `console.groupCollapsed()` | Group log lines (collapsed by default) |
| `console.time()` / `timeEnd()` | Measure elapsed execution time |
| `console.count()` / `countReset()` | Count how often a label is logged |
| `console.assert()` | Log only when a condition is false |
| `console.trace()` | Print the current call stack |
| `console.dir()` | Inspect all properties of an object/DOM node |
