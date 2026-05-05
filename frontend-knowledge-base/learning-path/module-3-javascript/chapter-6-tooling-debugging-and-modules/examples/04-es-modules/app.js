// app.js — Entry point, loaded with type="module" in index.html
// ============================================================
// Demonstrates different import styles:
//   1. Named imports
//   2. Default + named imports (mixed)
//   3. Namespace import (import *)
//   4. Barrel file import
// ============================================================

// 1. Named imports from math.js
import { PI, add, subtract, multiply, divide, circleArea } from './modules/math.js';

// 2. Default import (Logger) + named import (LOG_LEVEL) from logger.js
import Logger, { LOG_LEVEL } from './modules/logger.js';

// 3. Namespace import — everything under the Validators object
import * as Validators from './modules/validators.js';

// 4. Barrel import — one path, multiple modules
import { Logger as BarrelLogger, LOG_LEVEL as LEVEL, isEmail, isValidUsername } from './modules/index.js';

// ---- Demo functions called from HTML buttons ----

window.runMathDemo = function () {
  const output = document.getElementById('math-output');
  const lines = [
    `PI = ${PI}`,
    `add(7, 3) = ${add(7, 3)}`,
    `subtract(10, 4) = ${subtract(10, 4)}`,
    `multiply(6, 7) = ${multiply(6, 7)}`,
    `divide(15, 3) = ${divide(15, 3)}`,
    `circleArea(5) = ${circleArea(5).toFixed(4)}`,
  ];
  output.textContent = lines.join('\n');
};

window.runLoggerDemo = function () {
  const output = document.getElementById('logger-output');
  const logger = new Logger(LOG_LEVEL.INFO, 'AppDemo');

  const entries = [
    logger.log('Application started'),
    logger.log('Loading user preferences'),
    logger.log('All systems ready'),
  ];

  // Also show the history API
  const history = logger.getHistory();

  output.textContent =
    entries.join('\n') +
    `\n\n--- History (${history.length} entries) ---\n` +
    history.join('\n');
};

window.runValidatorDemo = function () {
  const output = document.getElementById('validator-output');

  const testCases = [
    { fn: 'isEmail', value: 'user@example.com', result: Validators.isEmail('user@example.com') },
    { fn: 'isEmail', value: 'not-an-email', result: Validators.isEmail('not-an-email') },
    { fn: 'isNonEmptyString', value: '"  "', result: Validators.isNonEmptyString('  ') },
    { fn: 'isNonEmptyString', value: '"hello"', result: Validators.isNonEmptyString('hello') },
    { fn: 'isPositiveNumber', value: '42', result: Validators.isPositiveNumber(42) },
    { fn: 'isPositiveNumber', value: '-5', result: Validators.isPositiveNumber(-5) },
    { fn: 'isInRange', value: '7 in [1,10]', result: Validators.isInRange(7, 1, 10) },
    { fn: 'isValidUsername', value: '"alice_99"', result: Validators.isValidUsername('alice_99') },
    { fn: 'isValidUsername', value: '"ab"', result: Validators.isValidUsername('ab') },
  ];

  output.textContent = testCases
    .map(({ fn, value, result }) => `Validators.${fn}(${value}) → ${result}`)
    .join('\n');
};

window.runBarrelDemo = function () {
  const output = document.getElementById('barrel-output');

  // Everything imported from a single './modules/index.js' path
  const logger = new BarrelLogger(LEVEL.WARN, 'Barrel');

  const lines = [
    '// All imports come from a single barrel path: ./modules/index.js',
    '',
    `isEmail("admin@site.io") → ${isEmail('admin@site.io')}`,
    `isValidUsername("dev_42") → ${isValidUsername('dev_42')}`,
    `isValidUsername("x") → ${isValidUsername('x')}`,
    '',
    '// Logger from barrel:',
    logger.log('Barrel import works correctly'),
  ];

  output.textContent = lines.join('\n');
};
