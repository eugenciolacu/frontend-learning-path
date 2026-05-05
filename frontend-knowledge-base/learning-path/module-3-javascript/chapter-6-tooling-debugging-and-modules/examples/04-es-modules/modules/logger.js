// modules/logger.js
// ============================================================
// Mixed exports: a named export (LOG_LEVEL) and a default export (Logger class).
// Import with:
//   import Logger, { LOG_LEVEL } from './modules/logger.js'
// ============================================================

// Named export: an enum-like constant object
export const LOG_LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

// Default export: the main class of this module
export default class Logger {
  #history = []; // Private class field (ES2022)

  constructor(level = LOG_LEVEL.INFO, prefix = '') {
    this.level = level;
    this.prefix = prefix;
  }

  #format(level, message) {
    const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
    const tag = `[${level.toUpperCase()}]`;
    return this.prefix
      ? `${timestamp} ${tag} [${this.prefix}] ${message}`
      : `${timestamp} ${tag} ${message}`;
  }

  log(message) {
    const formatted = this.#format(this.level, message);
    this.#history.push(formatted);
    return formatted;
  }

  getHistory() {
    return [...this.#history]; // Return a copy to prevent external mutation
  }

  clearHistory() {
    this.#history = [];
  }
}
