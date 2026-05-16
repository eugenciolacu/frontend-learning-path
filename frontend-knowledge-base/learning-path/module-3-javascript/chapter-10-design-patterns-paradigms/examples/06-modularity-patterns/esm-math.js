// ============================================================
// ESM — ES Modules: Math utility module
// ============================================================
// ESM exports: named exports and a default export.
// This file is imported by esm-main.js.
// ============================================================

// Named exports — individual functions consumers can import selectively
export const PI = 3.14159265358979;

export function add(a, b)      { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) {
  if (b === 0) throw new RangeError('Division by zero');
  return a / b;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export const MathUtils = {
  average: (nums) => nums.reduce((s, n) => s + n, 0) / nums.length,
  max:     (nums) => Math.max(...nums),
  min:     (nums) => Math.min(...nums),
  sum:     (nums) => nums.reduce((s, n) => s + n, 0),
};

// Default export — the "main" thing this module provides
// (only one default export per module)
export default function formatNumber(n, decimals = 2) {
  return n.toFixed(decimals);
}
