// ============================================================
// FUNCTIONAL PROGRAMMING IN JAVASCRIPT
// ============================================================
// FP is a paradigm that treats computation as the evaluation
// of mathematical functions. Key principles:
//  - Pure functions (no side effects, deterministic)
//  - Immutability (never mutate data)
//  - Higher-order functions (functions as values)
//  - Currying (partial application)
//  - Composition (build complexity from simplicity)
// ============================================================

const fpDemo = (() => {

  // ─────────────────────────────────────────────
  // UTILITIES (used throughout this module)
  // ─────────────────────────────────────────────

  // pipe: left-to-right composition
  const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

  // compose: right-to-left composition (mathematical convention)
  const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

  // Generic curry
  function curry(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) return fn.apply(this, args);
      return (...rest) => curried.apply(this, [...args, ...rest]);
    };
  }


  // ─────────────────────────────────────────────
  // 1. PURE FUNCTIONS vs IMPURE FUNCTIONS
  // Pure: same input → same output, no side effects
  // Impure: depends on/changes external state
  // ─────────────────────────────────────────────

  // ❌ IMPURE — depends on external state
  let taxRate = 0.2;
  function calculateTaxImpure(price) {
    return price * taxRate; // depends on external `taxRate`
  }

  // ✅ PURE — all inputs are explicit parameters
  function calculateTax(price, rate) {
    return price * rate;
  }

  // ❌ IMPURE — mutates its argument
  function addItemImpure(cart, item) {
    cart.push(item); // mutates original array!
    return cart;
  }

  // ✅ PURE — returns new array, original unchanged
  function addItem(cart, item) {
    return [...cart, item];
  }

  // ❌ IMPURE — has a side effect (writes to DOM / console)
  function logAndDouble(n) {
    console.log('Doubling:', n); // side effect!
    return n * 2;
  }

  // ✅ PURE — returns value, no side effects
  const double = (n) => n * 2;

  function runPureFunctions() {
    const lines = [];

    lines.push('--- Impure vs Pure Tax Calculation ---');
    taxRate = 0.2;
    lines.push(`Impure (taxRate=0.2): ${calculateTaxImpure(100)}`); // 20
    taxRate = 0.35; // external change!
    lines.push(`Impure (taxRate changed to 0.35): ${calculateTaxImpure(100)}`); // 35 — different result!
    lines.push(`Pure (always consistent): ${calculateTax(100, 0.2)}`); // always 20

    lines.push('\n--- Impure vs Pure Cart ---');
    const cart = ['apple', 'banana'];
    const impureCart = addItemImpure(cart, 'cherry');
    lines.push(`Original cart after impure add: [${cart}]`); // mutated!
    lines.push(`Returned from impure: [${impureCart}]`);

    const cart2 = ['apple', 'banana'];
    const pureCart = addItem(cart2, 'cherry');
    lines.push(`\nOriginal cart2 after pure add: [${cart2}]`); // unchanged
    lines.push(`Returned from pure: [${pureCart}]`);

    lines.push('\n--- Memoization (only works with pure functions) ---');
    function memoize(fn) {
      const cache = new Map();
      return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
          return `[CACHED] ${cache.get(key)}`;
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
      };
    }

    const memoizedTax = memoize(calculateTax);
    lines.push(`First call:  ${memoizedTax(500, 0.2)}`);  // computed
    lines.push(`Second call: ${memoizedTax(500, 0.2)}`);  // from cache
    lines.push(`New args:    ${memoizedTax(300, 0.15)}`); // computed

    document.getElementById('pure-output').textContent = lines.join('\n');
    console.log('[Pure Functions]\n' + lines.join('\n'));
  }


  // ─────────────────────────────────────────────
  // 2. IMMUTABILITY
  // Never change data in place. Create new structures
  // with the desired changes.
  // ─────────────────────────────────────────────

  function runImmutability() {
    const lines = [];

    // Object immutability with spread
    lines.push('--- Object Immutability ---');
    const user = { id: 1, name: 'Alice', age: 25, role: 'user' };
    const updatedUser = { ...user, age: 26, role: 'admin' };
    lines.push(`Original: ${JSON.stringify(user)}`);
    lines.push(`Updated:  ${JSON.stringify(updatedUser)}`);
    lines.push(`Same reference? ${user === updatedUser}`); // false

    // Nested object update (deep spread)
    lines.push('\n--- Nested Object Update ---');
    const state = {
      user: { name: 'Bob', preferences: { theme: 'light', lang: 'en' } },
      cart: [],
    };
    const newState = {
      ...state,
      user: {
        ...state.user,
        preferences: { ...state.user.preferences, theme: 'dark' },
      },
    };
    lines.push(`Original theme: ${state.user.preferences.theme}`);       // light
    lines.push(`New theme:      ${newState.user.preferences.theme}`);     // dark
    lines.push(`state.user untouched: ${state.user === newState.user}`);  // false

    // Array immutability
    lines.push('\n--- Array Immutability ---');
    const fruits = ['apple', 'banana', 'cherry'];

    const withMango    = [...fruits, 'mango'];                          // add
    const withoutBanana = fruits.filter((_, i) => i !== 1);            // remove
    const withAvocado  = fruits.map((f, i) => i === 0 ? 'avocado' : f); // update

    lines.push(`Original:       [${fruits}]`);
    lines.push(`+ mango:        [${withMango}]`);
    lines.push(`- banana:       [${withoutBanana}]`);
    lines.push(`apple→avocado:  [${withAvocado}]`);
    lines.push(`Original still: [${fruits}]`); // unchanged

    // Object.freeze — shallow freeze
    lines.push('\n--- Object.freeze ---');
    const config = Object.freeze({ version: '1.0', debug: false });
    try {
      config.version = '2.0'; // fails silently (throws in strict mode)
    } catch (e) {
      lines.push(`Freeze error: ${e.message}`);
    }
    lines.push(`config.version after attempted mutation: ${config.version}`); // still '1.0'

    document.getElementById('immutability-output').textContent = lines.join('\n');
    console.log('[Immutability]\n' + lines.join('\n'));
  }


  // ─────────────────────────────────────────────
  // 3. HIGHER-ORDER FUNCTIONS (HOF)
  // Functions that take or return other functions.
  // map, filter, reduce are the classic trio.
  // ─────────────────────────────────────────────

  function runHOF() {
    const lines = [];

    const products = [
      { name: 'Laptop',  price: 999,  category: 'Electronics', inStock: true  },
      { name: 'Phone',   price: 699,  category: 'Electronics', inStock: false },
      { name: 'Book',    price: 15,   category: 'Education',   inStock: true  },
      { name: 'Tablet',  price: 499,  category: 'Electronics', inStock: true  },
      { name: 'Course',  price: 49,   category: 'Education',   inStock: true  },
    ];

    lines.push('--- map: extract names ---');
    const names = products.map(p => p.name);
    lines.push(names.join(', '));

    lines.push('\n--- filter: only in-stock Electronics ---');
    const available = products.filter(p => p.inStock && p.category === 'Electronics');
    lines.push(available.map(p => `${p.name} ($${p.price})`).join(', '));

    lines.push('\n--- reduce: total price of in-stock items ---');
    const total = products
      .filter(p => p.inStock)
      .reduce((sum, p) => sum + p.price, 0);
    lines.push(`Total (in-stock): $${total}`);

    lines.push('\n--- reduce: group by category ---');
    const grouped = products.reduce((groups, p) => {
      const key = p.category;
      return { ...groups, [key]: [...(groups[key] ?? []), p.name] };
    }, {});
    Object.entries(grouped).forEach(([cat, items]) => {
      lines.push(`  ${cat}: ${items.join(', ')}`);
    });

    lines.push('\n--- HOF as function factory ---');
    const createDiscount = (rate) => (price) => +(price * (1 - rate)).toFixed(2);
    const student10  = createDiscount(0.10); // 10% off
    const vip25      = createDiscount(0.25); // 25% off

    lines.push(`Laptop at 10% off: $${student10(999)}`);
    lines.push(`Laptop at 25% off: $${vip25(999)}`);
    lines.push(`Phone  at 10% off: $${student10(699)}`);

    document.getElementById('hof-output').textContent = lines.join('\n');
    console.log('[HOF]\n' + lines.join('\n'));
  }


  // ─────────────────────────────────────────────
  // 4. CURRYING & PARTIAL APPLICATION
  // Currying transforms f(a, b, c) into f(a)(b)(c).
  // Partial application fixes some arguments, returns
  // a function waiting for the remaining ones.
  // ─────────────────────────────────────────────

  function runCurrying() {
    const lines = [];

    // Manual currying
    const add = a => b => a + b;
    const add10 = add(10);
    lines.push('--- Manual Currying ---');
    lines.push(`add(3)(4) = ${add(3)(4)}`);
    lines.push(`add10(5)  = ${add10(5)}`);   // partial application
    lines.push(`add10(20) = ${add10(20)}`);

    // Generic curry utility
    lines.push('\n--- Generic curry() ---');
    const multiply = curry((a, b, c) => a * b * c);
    lines.push(`multiply(2)(3)(4)   = ${multiply(2)(3)(4)}`);
    lines.push(`multiply(2, 3)(4)   = ${multiply(2, 3)(4)}`);
    lines.push(`multiply(2)(3, 4)   = ${multiply(2)(3, 4)}`);
    lines.push(`multiply(2, 3, 4)   = ${multiply(2, 3, 4)}`);

    // Practical: curried validators
    lines.push('\n--- Curried Validators ---');
    const isLongerThan = curry((min, str) => str.length > min);
    const isShorterThan = curry((max, str) => str.length < max);
    const includes = curry((sub, str) => str.includes(sub));

    const isValidPassword = (pwd) =>
      isLongerThan(7)(pwd) &&
      isShorterThan(64)(pwd) &&
      includes('@')(pwd);  // pretend '@' means special char check

    lines.push(`"pass": valid? ${isValidPassword('pass')}`);           // false (too short)
    lines.push(`"mySecretP@ss": valid? ${isValidPassword('mySecretP@ss')}`); // true

    // Curried URL builder
    lines.push('\n--- Curried API Client ---');
    const buildUrl = curry((base, version, resource, id) =>
      `${base}/api/${version}/${resource}${id ? `/${id}` : ''}`
    );
    const v1Api    = buildUrl('https://api.example.com')('v1');
    const usersApi = v1Api('users');
    lines.push(`Get all users:    ${usersApi(null)}`);
    lines.push(`Get user 42:      ${usersApi(42)}`);
    lines.push(`Get user 99:      ${usersApi(99)}`);
    lines.push(`Products endpoint: ${v1Api('products')(null)}`);

    document.getElementById('currying-output').textContent = lines.join('\n');
    console.log('[Currying]\n' + lines.join('\n'));
  }


  // ─────────────────────────────────────────────
  // 5. FUNCTION COMPOSITION & PIPE
  // Compose small, focused functions into a data
  // transformation pipeline.
  // compose: right → left (f(g(x)))
  // pipe:    left → right (more readable)
  // ─────────────────────────────────────────────

  function runComposition() {
    const lines = [];

    // String transformation functions (each pure, single-purpose)
    const trim        = str => str.trim();
    const toLowerCase = str => str.toLowerCase();
    const toUpperCase = str => str.toUpperCase();
    const removeSpaces = str => str.replace(/\s+/g, '_');
    const capitalize  = str => str.charAt(0).toUpperCase() + str.slice(1);
    const addExcl     = str => `${str}!`;
    const wrapInBrackets = str => `[${str}]`;

    lines.push('--- compose (right-to-left) ---');
    // shout = addExcl(toUpperCase(trim(str)))
    const shout = compose(addExcl, toUpperCase, trim);
    lines.push(`shout("  hello world  ") → "${shout('  hello world  ')}"`);

    lines.push('\n--- pipe (left-to-right) ---');
    // formatSlug: trim → lowercase → replace spaces with hyphens
    const toSlug = pipe(
      trim,
      toLowerCase,
      str => str.replace(/\s+/g, '-'),
      str => str.replace(/[^a-z0-9-]/g, ''),
    );
    lines.push(`toSlug("  Hello World!  ")    → "${toSlug('  Hello World!  ')}"`);
    lines.push(`toSlug(" My Article #1 ")     → "${toSlug(' My Article #1 ')}"`);

    lines.push('\n--- pipe: username formatter ---');
    const formatUsername = pipe(trim, toUpperCase, removeSpaces, wrapInBrackets);
    lines.push(`formatUsername("  john doe  ") → "${formatUsername('  john doe  ')}"`);

    lines.push('\n--- Comparing compose vs pipe ---');
    const process1 = compose(addExcl, capitalize, toLowerCase, trim);
    const process2 = pipe(trim, toLowerCase, capitalize, addExcl);
    const input = '  hELLO WORLD  ';
    lines.push(`compose (R→L): "${process1(input)}"`);
    lines.push(`pipe    (L→R): "${process2(input)}"`);
    lines.push(`Same result? ${process1(input) === process2(input)}`);

    document.getElementById('composition-output').textContent = lines.join('\n');
    console.log('[Composition]\n' + lines.join('\n'));
  }


  // ─────────────────────────────────────────────
  // 6. REAL-WORLD PIPELINE
  // Combining all FP concepts in a realistic scenario:
  // process raw API-like data into a formatted report.
  // ─────────────────────────────────────────────

  function runPipeline() {
    const lines = [];

    // Simulated raw API data (as if returned from a server)
    const rawData = JSON.stringify({
      timestamp: '2026-05-16T12:00:00Z',
      orders: [
        { id: 1, customer: '  Alice Johnson ', status: 'COMPLETED', items: [{ price: 29.99 }, { price: 9.99 }] },
        { id: 2, customer: 'Bob Smith', status: 'PENDING',   items: [{ price: 149.99 }] },
        { id: 3, customer: 'Charlie Brown', status: 'COMPLETED', items: [{ price: 5.00 }, { price: 75.00 }] },
        { id: 4, customer: '  Diana Prince  ', status: 'CANCELLED', items: [{ price: 300 }] },
        { id: 5, customer: 'Eve Williams', status: 'COMPLETED', items: [{ price: 19.99 }, { price: 4.99 }, { price: 12.50 }] },
      ]
    });

    // Pure transformation functions
    const parseJSON          = (str) => JSON.parse(str);
    const extractOrders      = (data) => data.orders;
    const filterCompleted    = (orders) => orders.filter(o => o.status === 'COMPLETED');
    const normalizeCustomer  = (orders) => orders.map(o => ({ ...o, customer: o.customer.trim() }));
    const calculateTotal     = (orders) => orders.map(o => ({
      ...o,
      total: +o.items.reduce((sum, item) => sum + item.price, 0).toFixed(2),
    }));
    const sortByTotal        = (orders) => [...orders].sort((a, b) => b.total - a.total);
    const formatReport       = (orders) => orders.map((o, i) =>
      `  ${i + 1}. ${o.customer.padEnd(18)} | Order #${o.id} | $${o.total.toFixed(2)}`
    );

    // Build the pipeline using pipe
    const processOrders = pipe(
      parseJSON,
      extractOrders,
      filterCompleted,
      normalizeCustomer,
      calculateTotal,
      sortByTotal,
      formatReport,
    );

    const report = processOrders(rawData);

    lines.push('=== Completed Orders Report (sorted by total) ===\n');
    lines.push(...report);

    // Also compute summary using pure reduce
    const completedOrders = pipe(
      parseJSON,
      extractOrders,
      filterCompleted,
      calculateTotal,
    )(rawData);

    const grandTotal = completedOrders.reduce((sum, o) => sum + o.total, 0);
    lines.push(`\nTotal Revenue (completed): $${grandTotal.toFixed(2)}`);
    lines.push(`Number of completed orders: ${completedOrders.length}`);

    document.getElementById('pipeline-output').textContent = lines.join('\n');
    console.log('[Pipeline]\n' + lines.join('\n'));
  }


  return { runPureFunctions, runImmutability, runHOF, runCurrying, runComposition, runPipeline };

})();
