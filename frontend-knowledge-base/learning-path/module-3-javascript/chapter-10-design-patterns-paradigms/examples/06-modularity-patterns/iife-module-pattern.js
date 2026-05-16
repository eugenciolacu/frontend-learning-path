// ============================================================
// IIFE & MODULE PATTERN
// ============================================================
// An IIFE runs immediately, creating a private scope.
// The Module Pattern uses an IIFE to expose a public API
// while keeping internal state and helpers private.
// ============================================================


// ─────────────────────────────────────────────
// 1. BASIC IIFE EXAMPLES
// ─────────────────────────────────────────────

// Standard IIFE (function expression wrapped and invoked)
const iifeResult = (function () {
  const privateMessage = 'I am private!';
  const version = '1.0.0';

  function greet(name) {
    return `Hello, ${name}! [version: ${version}]`;
  }

  return {
    greet,
    version,
  };
})();

// Arrow function IIFE
const arrowIIFE = (() => {
  const PI = 3.14159265358979;
  return {
    circleArea:        (r) => +(PI * r * r).toFixed(4),
    circumference:     (r) => +(2 * PI * r).toFixed(4),
    sphereVolume:      (r) => +((4 / 3) * PI * r * r * r).toFixed(4),
  };
})();

// IIFE used for initialization with side effects
(function initApp() {
  // This runs once immediately — useful for bootstrapping
  const startTime = new Date().toISOString();
  console.log(`[IIFE] App initialized at ${startTime}`);
  // Could set up event listeners, global state, etc.
})();

const iifeDemo = {
  run() {
    const lines = [];

    lines.push('--- Basic IIFE result ---');
    lines.push(iifeResult.greet('Student'));         // Hello, Student! [version: 1.0.0]
    lines.push(`Version: ${iifeResult.version}`);    // 1.0.0
    // iifeResult.privateMessage is not accessible:
    lines.push(`Access private? ${typeof iifeResult.privateMessage === 'undefined' ? 'undefined (hidden ✓)' : 'EXPOSED!'}`);

    lines.push('\n--- Arrow IIFE (Math utilities) ---');
    lines.push(`Circle area (r=5):      ${arrowIIFE.circleArea(5)}`);
    lines.push(`Circumference (r=5):    ${arrowIIFE.circumference(5)}`);
    lines.push(`Sphere volume (r=3):    ${arrowIIFE.sphereVolume(3)}`);

    lines.push('\n--- IIFE for name collision avoidance ---');
    const module1 = (function() {
      const name = 'Module One';
      return { getName: () => name };
    })();

    const module2 = (function() {
      const name = 'Module Two';  // same variable name — no conflict!
      return { getName: () => name };
    })();

    lines.push(`Module 1: ${module1.getName()}`);  // Module One
    lines.push(`Module 2: ${module2.getName()}`);  // Module Two

    document.getElementById('iife-output').textContent = lines.join('\n');
    console.log('[IIFE]\n' + lines.join('\n'));
  }
};


// ─────────────────────────────────────────────
// 2. MODULE PATTERN (IIFE returning public API)
//
// Private: `_count`, `_validate`, `_history`
// Public:  increment, decrement, reset, getCount, getHistory, setCount
// ─────────────────────────────────────────────

const counterModule = (function () {
  // ── PRIVATE ──
  let _count = 0;
  const _history = [];

  function _log(action) {
    _history.push({ action, value: _count, time: new Date().toLocaleTimeString() });
  }

  function _validate(n) {
    return Number.isInteger(n);
  }

  function _updateUI() {
    const lines = [
      `Count: ${_count}`,
      '',
      '--- History ---',
      ..._history.map(e => `[${e.time}] ${e.action.padEnd(10)} → ${e.value}`),
      '',
      `Private _history is accessible from outside? ${typeof window._history === 'undefined' ? 'No (hidden ✓)' : 'Yes (exposed!)'}`,
    ];
    document.getElementById('module-output').textContent = lines.join('\n');
  }

  // ── PUBLIC API ──
  return {
    increment(step = 1) {
      _count += step;
      _log(`increment(${step})`);
      _updateUI();
      return _count;
    },
    decrement(step = 1) {
      _count -= step;
      _log(`decrement(${step})`);
      _updateUI();
      return _count;
    },
    reset() {
      _count = 0;
      _log('reset');
      _updateUI();
    },
    setCount(n) {
      if (!_validate(n)) throw new TypeError(`Expected integer, got ${typeof n}`);
      _count = n;
      _log(`setCount(${n})`);
      _updateUI();
    },
    getCount() { return _count; },
    getHistory() { return [..._history]; }, // return copy, not reference
  };
})();
