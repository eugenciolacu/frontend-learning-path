// modules/index.js — Barrel file
// ============================================================
// A barrel file re-exports from multiple modules in one place.
// Consumers can import everything from a single path:
//   import { add, Logger, LOG_LEVEL, isEmail } from './modules/index.js'
//
// This is the most common pattern in larger JavaScript projects.
// ============================================================

// Re-export named exports from math.js
export { add, subtract, multiply, divide, circleArea, PI } from './math.js';

// Re-export the default export of logger.js as a named export
export { default as Logger, LOG_LEVEL } from './logger.js';

// Re-export all named exports from validators.js
export * from './validators.js';
