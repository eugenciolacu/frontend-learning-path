/**
 * Example 04 – Destructuring
 *
 * Demonstrates:
 *  - Array destructuring (positions, skipping, swap)
 *  - Object destructuring (property names)
 *  - Default values in destructuring
 *  - Renaming destructured variables
 *  - Nested destructuring (objects and arrays)
 *  - Destructuring in for...of loops and function parameters
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

// ─── 1. Array Destructuring ───────────────────────────────────────────────────

function demoArrayDestructuring() {
  clearOutput();
  print("── 1. Array Destructuring ──");

  const rgb = [255, 128, 0];

  // Without destructuring
  const r1 = rgb[0], g1 = rgb[1], b1 = rgb[2];
  print("old way (r, g, b)", [r1, g1, b1]);

  // With destructuring — ORDER matters
  const [r, g, b] = rgb;
  print("destructured r", r);
  print("destructured g", g);
  print("destructured b", b);

  // Skip elements with commas
  const [first, , third] = rgb;
  print("skip middle [first, , third]", [first, third]);

  // Swap two variables without a temp
  let x = 10, y = 20;
  print("before swap", { x, y });
  [x, y] = [y, x];
  print("after swap", { x, y });

  // From a function that returns an array
  function getMinMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
  }
  const [min, max] = getMinMax([3, 1, 4, 1, 5, 9, 2, 6]);
  print("getMinMax result [min, max]", [min, max]);

  // Nested array destructuring
  const coords = [[10, 20], [30, 40]];
  const [[x1, y1], [x2, y2]] = coords;
  print("nested array [x1,y1] [x2,y2]", { x1, y1, x2, y2 });
}

// ─── 2. Object Destructuring ─────────────────────────────────────────────────

function demoObjectDestructuring() {
  clearOutput();
  print("── 2. Object Destructuring ──");

  const user = {
    id: 42,
    name: "Diana",
    age: 29,
    email: "diana@example.com",
    city: "Paris",
  };

  // Without destructuring
  const name1 = user.name;
  const age1  = user.age;
  print("old way", { name1, age1 });

  // With destructuring — property NAMES matter (order doesn't)
  const { name, age, city } = user;
  print("destructured", { name, age, city });

  // You don't have to extract all properties
  const { id, email } = user;
  print("only id and email", { id, email });

  // Destructure from a returned object
  function getCoords() {
    return { lat: 51.5074, lng: -0.1278, altitude: 11 };
  }
  const { lat, lng } = getCoords();
  print("destructured from return", { lat, lng });

  console.log("user:", user);
}

// ─── 3. Default Values ───────────────────────────────────────────────────────

function demoDefaults() {
  clearOutput();
  print("── 3. Default Values ──");

  // Array destructuring defaults — used when value is undefined
  const [a = 0, b = 0, c = 0] = [1, 2];
  print("array defaults [a=0, b=0, c=0] from [1, 2]", [a, b, c]);
  // c falls back to 0

  const [p = "N/A", q = "N/A"] = ["hello"];
  print("array defaults from ['hello']", [p, q]);

  // Object destructuring defaults
  const { name = "Guest", role = "user", theme = "light" } = { name: "Alice" };
  print("object defaults, only name provided", { name, role, theme });

  // Default of null does NOT trigger (only undefined does!)
  const { value = 42 } = { value: null };
  print("null does NOT trigger default", value); // null, NOT 42

  const { value2 = 42 } = {};
  print("undefined triggers default", value2); // 42

  // Practical: API response with missing fields
  const apiResponse = { data: [1, 2, 3] }; // no status or message
  const { data, status = 200, message = "OK" } = apiResponse;
  print("API response with defaults", { data, status, message });
}

// ─── 4. Renaming Variables ───────────────────────────────────────────────────

function demoRenaming() {
  clearOutput();
  print("── 4. Renaming with : ──");

  const response = { statusCode: 200, body: "Success", headers: {} };

  // Rename statusCode → status, body → message
  const { statusCode: status, body: message } = response;
  print("status (was statusCode)", status);
  print("message (was body)", message);

  // Rename AND provide a default
  const { timeout: ms = 3000, retries: maxRetries = 3 } = {};
  print("ms (renamed timeout, default 3000)", ms);
  print("maxRetries (renamed retries, default 3)", maxRetries);

  // Useful when properties conflict with existing variable names
  const a = { id: 1, name: "Alice" };
  const b = { id: 2, name: "Bob" };
  const { id: idA, name: nameA } = a;
  const { id: idB, name: nameB } = b;
  print("idA, idB", [idA, idB]);
  print("nameA, nameB", [nameA, nameB]);
}

// ─── 5. Nested Destructuring ─────────────────────────────────────────────────

function demoNested() {
  clearOutput();
  print("── 5. Nested Destructuring ──");

  const config = {
    server: {
      host: "localhost",
      port: 8080,
    },
    database: {
      name: "mydb",
      credentials: {
        user: "admin",
        password: "secret",
      },
    },
    features: ["auth", "logging", "caching"],
  };

  // Nested object destructuring
  const {
    server: { host, port },
    database: { name: dbName, credentials: { user } },
    features: [firstFeature, ...otherFeatures],
  } = config;

  print("host", host);
  print("port", port);
  print("dbName", dbName);
  print("user", user);
  print("firstFeature", firstFeature);
  print("otherFeatures", otherFeatures);

  // Note: server, database, features are NOT extracted as variables
  // They are just patterns — only the inner vars exist

  // Nested array
  const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const [[a, b], [, e], [g]] = matrix;
  print("matrix [a,b] from row 0", [a, b]);
  print("matrix e (middle)", e);
  print("matrix g from row 2", g);

  console.log("config:", config);
}

// ─── 6. Destructuring in Loops & Function Parameters ─────────────────────────

function demoLoopsAndParams() {
  clearOutput();
  print("── 6. Loops & Function Parameters ──");

  // Destructure in for...of
  const people = [
    { name: "Alice", age: 30, dept: "Engineering" },
    { name: "Bob",   age: 25, dept: "Design"      },
    { name: "Carol", age: 35, dept: "Engineering" },
  ];

  print("for...of with destructuring:");
  for (const { name, age, dept } of people) {
    print(`  ${name}`, `age ${age}, ${dept}`);
  }

  print("──");

  // Object.entries with destructuring
  const scores = { Math: 95, Science: 88, English: 92 };
  print("Object.entries loop:");
  for (const [subject, score] of Object.entries(scores)) {
    print(`  ${subject}`, score);
  }

  print("──");

  // Destructuring in function parameters
  function greet({ name, city = "Unknown", greeting = "Hello" }) {
    return `${greeting}, ${name} from ${city}!`;
  }

  print("greet with city", greet({ name: "Diana", city: "Paris" }));
  print("greet with defaults", greet({ name: "Eve" }));

  // Destructure array parameters
  function distance([x1, y1], [x2, y2]) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2).toFixed(2);
  }
  print("distance([0,0], [3,4])", distance([0, 0], [3, 4]));

  // Full option-object pattern with all defaults
  function createButton({
    label    = "Click me",
    type     = "button",
    disabled = false,
    variant  = "primary",
  } = {}) {
    return { label, type, disabled, variant };
  }

  print("createButton() all defaults", createButton());
  print("createButton with label", createButton({ label: "Submit", type: "submit" }));

  console.log("people:", people);
}
