// ============================================================
// BEHAVIORAL DESIGN PATTERNS
// ============================================================
// Patterns focused on communication and responsibility between
// objects — how they interact and distribute work.
// ============================================================

const behavioralDemo = (() => {

  // ─────────────────────────────────────────────
  // 1. OBSERVER (Publish/Subscribe)
  // Defines a one-to-many dependency. When the subject
  // changes, all registered observers are notified.
  // ─────────────────────────────────────────────

  class EventEmitter {
    constructor() {
      this._events = {};
    }

    on(event, listener) {
      if (!this._events[event]) this._events[event] = [];
      this._events[event].push(listener);
      // Returns an unsubscribe function
      return () => this.off(event, listener);
    }

    off(event, listener) {
      if (!this._events[event]) return;
      this._events[event] = this._events[event].filter(l => l !== listener);
    }

    emit(event, ...args) {
      const listeners = this._events[event] ?? [];
      listeners.forEach(listener => listener(...args));
      return listeners.length; // number of notified listeners
    }

    listenerCount(event) {
      return (this._events[event] ?? []).length;
    }
  }

  const emitter = new EventEmitter();
  const observerLog = [];
  let unsubscribeLogger = null;

  const analyticsListener = (data) => {
    const msg = `[Analytics] User "${data.username}" logged in at ${new Date().toLocaleTimeString()}`;
    observerLog.push(msg);
    console.log(msg);
  };

  // Always active
  emitter.on('login', analyticsListener);

  let loggerActive = false;
  const observerDemo = {
    subscribe() {
      if (!loggerActive) {
        unsubscribeLogger = emitter.on('login', (data) => {
          const msg = `[Logger] Login event received for: ${data.username}`;
          observerLog.push(msg);
          console.log(msg);
        });
        loggerActive = true;
        observerLog.push('Logger subscribed.');
      } else {
        observerLog.push('Logger already subscribed.');
      }
      document.getElementById('observer-output').textContent = observerLog.join('\n');
    },
    unsubscribeLogger() {
      if (loggerActive && unsubscribeLogger) {
        unsubscribeLogger();
        loggerActive = false;
        observerLog.push('Logger unsubscribed.');
      } else {
        observerLog.push('Logger was not subscribed.');
      }
      document.getElementById('observer-output').textContent = observerLog.join('\n');
    },
    emit() {
      const user = { username: `user_${Math.floor(Math.random() * 1000)}`, id: Date.now() };
      const count = emitter.emit('login', user);
      observerLog.push(`--- Emitted "login" → ${count} listener(s) notified ---`);
      document.getElementById('observer-output').textContent = observerLog.join('\n');
    },
  };


  // ─────────────────────────────────────────────
  // 2. STRATEGY
  // Defines a family of algorithms, encapsulates each,
  // and makes them interchangeable at runtime.
  // ─────────────────────────────────────────────

  // Each strategy is a pure function: (array) => sortedArray
  const sortingStrategies = {
    bubble(arr) {
      const a = [...arr];
      let swaps = 0;
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            swaps++;
          }
        }
      }
      return { result: a, info: `Bubble Sort (${swaps} swaps)` };
    },

    quick(arr) {
      function qs(a) {
        if (a.length <= 1) return a;
        const pivot = a[Math.floor(a.length / 2)];
        const left  = a.filter(x => x < pivot);
        const mid   = a.filter(x => x === pivot);
        const right = a.filter(x => x > pivot);
        return [...qs(left), ...mid, ...qs(right)];
      }
      return { result: qs(arr), info: 'Quick Sort (divide & conquer, pivot = middle)' };
    },

    native(arr) {
      return { result: [...arr].sort((a, b) => a - b), info: 'Native Array.sort (TimSort in V8)' };
    },
  };

  // Context — uses whichever strategy is injected
  class Sorter {
    constructor(strategy) {
      this._strategy = strategy;
    }
    setStrategy(strategy) {
      this._strategy = strategy;
    }
    sort(data) {
      const t0 = performance.now();
      const { result, info } = this._strategy(data);
      const t1 = performance.now();
      return { result, info, timeMs: (t1 - t0).toFixed(3) };
    }
  }

  const sorter = new Sorter(sortingStrategies.native);
  const DATA = [38, 27, 43, 3, 9, 82, 10, 1, 55, 17, 64, 2];

  const strategyDemo = {
    run(name) {
      sorter.setStrategy(sortingStrategies[name]);
      const { result, info, timeMs } = sorter.sort(DATA);
      const out =
        `Input:  [${DATA.join(', ')}]\n` +
        `Output: [${result.join(', ')}]\n` +
        `\nStrategy: ${info}\n` +
        `Time: ${timeMs}ms`;
      document.getElementById('strategy-output').textContent = out;
      console.log('[Strategy]', out);
    },
  };


  // ─────────────────────────────────────────────
  // 3. COMMAND
  // Encapsulates a request as an object. Supports
  // undo/redo, logging, and queuing of operations.
  // ─────────────────────────────────────────────

  class TextBuffer {
    constructor() {
      this.content = '';
      this._history = [];  // executed commands
      this._redoStack = [];
    }

    execute(command) {
      command.execute();
      this._history.push(command);
      this._redoStack = []; // new action clears redo stack
    }

    undo() {
      const cmd = this._history.pop();
      if (cmd) {
        cmd.undo();
        this._redoStack.push(cmd);
        return true;
      }
      return false;
    }

    redo() {
      const cmd = this._redoStack.pop();
      if (cmd) {
        cmd.execute();
        this._history.push(cmd);
        return true;
      }
      return false;
    }

    getState() {
      return {
        content: this.content,
        historyLen: this._history.length,
        redoLen: this._redoStack.length,
      };
    }
  }

  class InsertCommand {
    constructor(buffer, text) {
      this._buf = buffer;
      this._text = text;
    }
    execute() { this._buf.content += this._text; }
    undo()    { this._buf.content = this._buf.content.slice(0, -this._text.length); }
    toString() { return `Insert("${this._text}")`; }
  }

  class DeleteCommand {
    constructor(buffer, count) {
      this._buf = buffer;
      this._count = count;
      this._deleted = '';
    }
    execute() {
      this._deleted = this._buf.content.slice(-this._count);
      this._buf.content = this._buf.content.slice(0, -this._count);
    }
    undo() { this._buf.content += this._deleted; }
    toString() { return `Delete(${this._count} chars → "${this._deleted}")`; }
  }

  const buffer = new TextBuffer();
  const cmdLog = [];

  function updateCommandOutput() {
    const { content, historyLen, redoLen } = buffer.getState();
    document.getElementById('command-output').textContent =
      `Content: "${content}"\n` +
      `History depth: ${historyLen}  |  Redo stack: ${redoLen}\n\n` +
      `--- Command Log ---\n${cmdLog.join('\n')}`;
  }

  const commandDemo = {
    insert() {
      const text = document.getElementById('insert-text').value || 'text';
      const cmd = new InsertCommand(buffer, text);
      buffer.execute(cmd);
      cmdLog.push(`EXECUTE: ${cmd}`);
      updateCommandOutput();
    },
    deleteChars(n) {
      const cmd = new DeleteCommand(buffer, n);
      buffer.execute(cmd);
      cmdLog.push(`EXECUTE: ${cmd}`);
      updateCommandOutput();
    },
    undo() {
      const ok = buffer.undo();
      cmdLog.push(ok ? 'UNDO ↩' : 'Nothing to undo');
      updateCommandOutput();
    },
    redo() {
      const ok = buffer.redo();
      cmdLog.push(ok ? 'REDO ↪' : 'Nothing to redo');
      updateCommandOutput();
    },
  };


  // ─────────────────────────────────────────────
  // 4. ITERATOR
  // Provides a unified way to traverse a collection
  // without exposing its internal structure.
  // JavaScript has a built-in iterator protocol:
  // objects with [Symbol.iterator]() are iterable.
  // ─────────────────────────────────────────────

  // Custom range iterable
  function createRange(start, end, step = 1) {
    return {
      [Symbol.iterator]() {
        let current = start;
        return {
          next() {
            if ((step > 0 && current <= end) || (step < 0 && current >= end)) {
              const value = current;
              current += step;
              return { value, done: false };
            }
            return { value: undefined, done: true };
          },
          [Symbol.iterator]() { return this; } // make iterator itself iterable
        };
      }
    };
  }

  // Infinite Fibonacci generator (using Generator function)
  function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  const iteratorDemo = {
    run() {
      const lines = [];

      // Range iterator
      lines.push('--- Range(1 to 10, step 2) ---');
      lines.push([...createRange(1, 10, 2)].join(', ')); // 1 3 5 7 9

      lines.push('\n--- Range(10 to 1, step -3) ---');
      lines.push([...createRange(10, 1, -3)].join(', ')); // 10 7 4 1

      // Fibonacci generator — take first 10
      lines.push('\n--- First 10 Fibonacci numbers ---');
      const fib = fibonacci();
      const first10 = Array.from({ length: 10 }, () => fib.next().value);
      lines.push(first10.join(', ')); // 0 1 1 2 3 5 8 13 21 34

      // for...of with range
      lines.push('\n--- for...of Range(0, 8, 4) ---');
      const forOfResult = [];
      for (const n of createRange(0, 8, 4)) {
        forOfResult.push(n);
      }
      lines.push(forOfResult.join(', ')); // 0 4 8

      // Destructuring with range
      lines.push('\n--- Destructuring Range(1,5) ---');
      const [first, second, ...rest] = createRange(1, 5);
      lines.push(`first=${first}, second=${second}, rest=[${rest}]`);

      document.getElementById('iterator-output').textContent = lines.join('\n');
      console.log('[Iterator]', lines.join('\n'));
    },
  };


  // Public API
  return { observerDemo, strategyDemo, commandDemo, iteratorDemo };

})();
