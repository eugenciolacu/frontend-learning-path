/**
 * Example 05 – Spread and Rest
 *
 * Demonstrates:
 *  - Spread with arrays: clone, merge, insert, spread into function args
 *  - Spread with objects: clone, merge, override properties
 *  - Shallow copy limitation of spread
 *  - Rest in array destructuring: head/tail pattern
 *  - Rest in object destructuring: pick/omit pattern
 *  - Rest parameters in functions
 *  - Practical patterns: immutable updates, removing properties, data pipelines
 *
 * Open DevTools (F12) → Console to see all console.log outputs.
 */

// ─── Helper ──────────────────────────────────────────────────────────────────

function print(label, value) {
  const output = document.getElementById("output");
  const line =
    value !== undefined
      ? `${label}: ${JSON.stringify(value)}`
      : label;
  output.textContent += line + "\n";
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

// ─── 1. Spread with Arrays ───────────────────────────────────────────────────

function demoSpreadArrays() {
  clearOutput();
  print("── 1. Spread with Arrays ──");

  const a = [1, 2, 3];
  const b = [4, 5, 6];

  // Clone — completely independent copy
  const clone = [...a];
  clone.push(99);
  print("original a (unchanged)", a);
  print("clone after push(99)", clone);

  // Merge arrays
  const merged = [...a, ...b];
  print("[...a, ...b]", merged);

  // Insert elements at specific positions
  const inserted = [...a, 99, 100, ...b];
  print("[...a, 99, 100, ...b]", inserted);

  // Spread into function arguments
  function sum(x, y, z) { return x + y + z; }
  const nums = [10, 20, 30];
  print("sum(...[10,20,30])", sum(...nums));

  // Math functions that don't accept arrays
  const values = [3, 1, 4, 1, 5, 9, 2, 6];
  print("Math.max(...values)", Math.max(...values));
  print("Math.min(...values)", Math.min(...values));

  // Spread a string into characters
  const chars = [..."JavaScript"];
  print("[...'JavaScript']", chars);

  // Spread a Set (unique values)
  const withDupes = [1, 2, 2, 3, 3, 3, 4];
  const unique = [...new Set(withDupes)];
  print("[...new Set(withDupes)]", unique);

  console.log("a:", a, "b:", b);
}

// ─── 2. Spread with Objects ───────────────────────────────────────────────────

function demoSpreadObjects() {
  clearOutput();
  print("── 2. Spread with Objects ──");

  const defaults = { theme: "light", lang: "en", fontSize: 14, notifications: true };
  const userPrefs = { theme: "dark", fontSize: 16 };

  // Clone
  const copy = { ...defaults };
  copy.lang = "fr"; // modifying copy doesn't affect original
  print("original defaults.lang", defaults.lang);
  print("copy.lang after mutation", copy.lang);

  // Merge — later properties WIN
  const merged = { ...defaults, ...userPrefs };
  print("[...defaults, ...userPrefs]", merged);

  // Override a single property
  const withExtraLang = { ...defaults, lang: "de" };
  print("override lang to 'de'", withExtraLang);

  // Add new properties
  const extended = { ...defaults, version: "2.0", beta: true };
  print("add version and beta", extended);

  // ORDER matters — userPrefs AFTER defaults so it wins
  const wrong = { ...userPrefs, ...defaults }; // defaults win here
  print("WRONG order (defaults win)", wrong);
  print("correct order (userPrefs win)", merged);

  console.log("defaults:", defaults);
}

// ─── 3. Shallow Copy Gotcha ───────────────────────────────────────────────────

function demoShallowCopy() {
  clearOutput();
  print("── 3. Shallow Copy Gotcha ──");
  print("Spread only copies ONE level deep. Nested objects are shared references.");
  print("──");

  const original = {
    name: "Alice",
    score: 42,
    address: { city: "London", postcode: "EC1" }, // nested object
    tags: ["admin", "user"],                        // nested array
  };

  const copy = { ...original };

  // Primitive property — safe to mutate in copy
  copy.name = "Bob";
  print("original.name (unchanged)", original.name);
  print("copy.name", copy.name);

  // Nested object — shared reference!
  copy.address.city = "Paris";
  print("original.address.city (MUTATED!)", original.address.city);

  // Nested array — also shared
  copy.tags.push("superuser");
  print("original.tags (MUTATED!)", original.tags);

  print("──");
  print("To deeply clone, use structuredClone() or JSON.parse(JSON.stringify())");

  // Deep clone with structuredClone (modern, recommended)
  const original2 = { name: "Alice", address: { city: "London" } };
  const deepCopy = structuredClone(original2);
  deepCopy.address.city = "Paris";
  print("original2.address.city after deepCopy mutation", original2.address.city); // unchanged

  console.log("original:", original);
  console.log("copy:", copy);
}

// ─── 4. Rest in Array Destructuring ──────────────────────────────────────────

function demoRestArray() {
  clearOutput();
  print("── 4. Rest in Array Destructuring ──");

  // Head/tail pattern
  const [head, ...tail] = [1, 2, 3, 4, 5];
  print("head", head);
  print("tail", tail);

  // Skip the first two, gather the rest
  const [, , ...remaining] = ["a", "b", "c", "d", "e"];
  print("skip first two, ...remaining", remaining);

  // Process a CSV-like row
  const [date, category, ...values] = ["2024-01-15", "Sales", 100, 200, 300, 400];
  print("date", date);
  print("category", category);
  print("values", values);

  // Can combine with defaults (rest cannot have a default)
  const [first = 0, second = 0, ...extras] = [42];
  print("first (with default)", first);
  print("second (default used)", second);
  print("extras", extras);

  console.log("tail:", tail);
}

// ─── 5. Rest in Object Destructuring ─────────────────────────────────────────

function demoRestObject() {
  clearOutput();
  print("── 5. Rest in Object Destructuring ──");

  const user = { id: 1, name: "Alice", password: "secret", role: "admin", city: "London" };

  // Extract some, gather rest
  const { id, name, ...others } = user;
  print("id", id);
  print("name", name);
  print("...others", others);

  // Remove sensitive fields (omit pattern)
  const { password, ...safeUser } = user;
  print("safeUser (password removed)", safeUser);

  // Pick only what you need, ignore the rest
  const { role, ..._ } = user; // _ is a convention for "unused"
  print("role", role);

  // Useful in API handlers — separate known params from unknown extra fields
  function createUser({ name: userName, email, ...metadata }) {
    print(`  createUser: ${userName} (${email})`, null);
    print("  extra metadata", metadata);
    return { userName, email, metadata };
  }

  print("──");
  createUser({ name: "Bob", email: "bob@example.com", referral: "friend", plan: "pro" });

  console.log("safeUser:", safeUser);
}

// ─── 6. Rest Parameters in Functions ─────────────────────────────────────────

function demoRestParams() {
  clearOutput();
  print("── 6. Rest Parameters in Functions ──");

  // Collect ALL arguments
  function logAll(...args) {
    print("args", args);
    print("type", Array.isArray(args) ? "real Array" : "not an array");
  }
  logAll(1, 2, 3, "four", true);

  // Fixed params + rest
  function createTag(tag, ...classes) {
    return `<${tag} class="${classes.join(" ")}">`;
  }
  print("createTag('div', 'card', 'featured')", createTag("div", "card", "featured"));
  print("createTag('span')", createTag("span")); // no classes

  // Variadic sum
  function sum(...nums) {
    return nums.reduce((acc, n) => acc + n, 0);
  }
  print("sum(1,2,3)", sum(1, 2, 3));
  print("sum(10,20,30,40)", sum(10, 20, 30, 40));

  // First arg is multiplier, rest are values
  function multiplyAll(multiplier, ...nums) {
    return nums.map(n => n * multiplier);
  }
  print("multiplyAll(3, 1,2,3,4)", multiplyAll(3, 1, 2, 3, 4));

  // Compare with old arguments object
  function oldWay(a, b) {
    // arguments is array-like — no .map(), .filter(), etc.
    const argsArray = Array.from(arguments); // must convert
    print("arguments converted", argsArray);
  }
  oldWay(10, 20);
  print("(rest params are always real arrays — prefer them over arguments)");

  console.log("sum(1..5):", sum(1, 2, 3, 4, 5));
}

// ─── 7. Practical Patterns ────────────────────────────────────────────────────

function demoPractical() {
  clearOutput();
  print("── 7. Practical Patterns ──");

  // ── Immutable state updates (React-style) ──
  const state = { user: "Alice", count: 0, active: true };

  // ❌ Mutation
  // state.count = 1;

  // ✅ Immutable update — spread creates a new object
  const newState = { ...state, count: state.count + 1 };
  print("original state.count", state.count);
  print("newState.count", newState.count);

  print("──");

  // ── Update an item in an array immutably ──
  const todos = [
    { id: 1, text: "Learn JS",        done: false },
    { id: 2, text: "Practice arrays", done: false },
    { id: 3, text: "Build a project", done: false },
  ];

  // Mark todo id=2 as done — without mutating the array
  const updatedTodos = todos.map(t =>
    t.id === 2 ? { ...t, done: true } : t
  );
  print("original todos[1].done", todos[1].done);
  print("updatedTodos[1].done", updatedTodos[1].done);

  print("──");

  // ── Remove an item from an array immutably ──
  const withoutSecond = todos.filter(t => t.id !== 2);
  print("todos without id=2", withoutSecond.map(t => t.text));

  print("──");

  // ── Merge arrays and remove duplicates ──
  const list1 = [1, 2, 3, 4];
  const list2 = [3, 4, 5, 6];
  const unique = [...new Set([...list1, ...list2])];
  print("merge + deduplicate", unique);

  print("──");

  // ── Build a query string from an object ──
  const params = { page: 1, limit: 20, sort: "name", order: "asc" };
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  print("query string", `?${query}`);

  console.log("newState:", newState);
  console.log("updatedTodos:", updatedTodos);
}
