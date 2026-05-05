// modules/validators.js
// ============================================================
// All named exports — imported as a namespace:
//   import * as Validators from './modules/validators.js'
//   Validators.isEmail("test@example.com")
// ============================================================

export function isEmail(value) {
  // Simple email pattern — use a proper library in production
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value) {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

export function isInRange(value, min, max) {
  return typeof value === 'number' && value >= min && value <= max;
}

export function isValidUsername(value) {
  // 3-20 characters, letters, numbers, underscores only
  return /^[a-zA-Z0-9_]{3,20}$/.test(value);
}
