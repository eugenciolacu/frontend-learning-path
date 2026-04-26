/**
 * Example 01 – Objects
 *
 * Demonstrates:
 *  - Object literals and property access (dot & bracket notation)
 *  - Adding, updating, and deleting properties
 *  - Optional chaining (?.)
 *  - Computed property names and ES6 shorthand
 *  - Object methods and the 'this' keyword
 *  - Object.keys(), Object.values(), Object.entries(), Object.assign(), Object.freeze()
 *
 * Open DevTools (F12) → Console to see all console.log outputs.
 */

// ─── Helper ──────────────────────────────────────────────────────────────────

function print(label, value) {
  const output = document.getElementById("output");
  const line =
    value !== undefined
      ? `${label}: ${JSON.stringify(value, null, 2)}`
      : label;
  output.textContent += line + "\n";
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

// ─── 1. Object Literals & Property Access ────────────────────────────────────

function demoLiterals() {
  clearOutput();
  print("── 1. Object Literals & Property Access ──");

  const user = {
    name: "Alice",
    age: 30,
    isAdmin: false,
    address: { city: "London", postcode: "EC1A" },
  };

  // Dot notation
  print("user.name", user.name);
  print("user.age", user.age);

  // Bracket notation — useful for dynamic keys
  const prop = "isAdmin";
  print(`user["${prop}"]`, user[prop]);

  // Nested access
  print("user.address.city", user.address.city);

  // Property with spaces or special chars needs bracket notation
  const weirdObj = { "first name": "Bob", "2fast": true };
  print('weirdObj["first name"]', weirdObj["first name"]);

  // Checking existence
  print('"name" in user', "name" in user);
  print('"phone" in user', "phone" in user);
  print("user.hasOwnProperty('age')", user.hasOwnProperty("age"));

  console.log("user object:", user);
}

// ─── 2. Mutating Object Properties ───────────────────────────────────────────

function demoMutation() {
  clearOutput();
  print("── 2. Adding / Updating / Deleting Properties ──");

  const person = { name: "Carlos", age: 25 };
  print("initial", person);

  // Add
  person.email = "carlos@example.com";
  print("after adding email", person);

  // Update
  person.age = 26;
  print("after updating age", person);

  // Delete
  delete person.email;
  print("after deleting email", person);
  print('"email" in person', "email" in person);

  console.log("person after mutations:", person);
}

// ─── 3. Optional Chaining ────────────────────────────────────────────────────

function demoOptionalChaining() {
  clearOutput();
  print("── 3. Optional Chaining (?.) ──");

  const user1 = { name: "Alice", address: { city: "London" } };
  const user2 = { name: "Bob" }; // no address

  // Without optional chaining this would throw TypeError on user2
  print("user1 city", user1.address?.city);
  print("user2 city (missing address)", user2.address?.city);
  print("user2 postcode (deeply missing)", user2.address?.postcode);

  // Calling an optional method
  const obj = {
    greet: function () {
      return "Hello!";
    },
  };
  const obj2 = {};
  print("obj.greet?.()", obj.greet?.());
  print("obj2.greet?.() — method missing", obj2.greet?.());

  // Nullish coalescing combined with optional chaining
  const city = user2.address?.city ?? "Unknown city";
  print("city with fallback", city);
}

// ─── 4. Computed Property Names & Shorthand ──────────────────────────────────

function demoDynamic() {
  clearOutput();
  print("── 4. Computed Names & Property Shorthand ──");

  // Read values from inputs
  const key = document.getElementById("dynKey").value || "key";
  const val = document.getElementById("dynVal").value || "value";

  // Computed property name — key is a variable
  const dynamic = { [key]: val, [`max_${key}`]: Number(val) * 10 };
  print("dynamic object", dynamic);

  // Property shorthand — when variable name === property name
  const firstName = "Diana";
  const lastName = "Prince";
  const age = 28;

  // Old way
  const userOld = { firstName: firstName, lastName: lastName, age: age };
  // New shorthand
  const userNew = { firstName, lastName, age };

  print("userOld (verbose)", userOld);
  print("userNew (shorthand)", userNew);
  print("equal?", JSON.stringify(userOld) === JSON.stringify(userNew));
}

// ─── 5. Object Methods & this ────────────────────────────────────────────────

function demoMethods() {
  clearOutput();
  print("── 5. Object Methods & 'this' ──");

  const counter = {
    value: 0,

    // ES6 shorthand method syntax
    increment(amount = 1) {
      this.value += amount;
      return this; // enables chaining
    },

    decrement(amount = 1) {
      this.value -= amount;
      return this;
    },

    reset() {
      this.value = 0;
      return this;
    },

    valueOf() {
      return this.value;
    },
  };

  counter.increment().increment(5).decrement(2);
  print("after increment().increment(5).decrement(2)", counter.value);

  counter.reset();
  print("after reset", counter.value);

  // Arrow function inside a method — inherits 'this'
  const logger = {
    prefix: "[LOG]",
    messages: [],

    log(msg) {
      // Arrow function inherits 'this' from log() — refers to logger
      setTimeout(() => {
        this.messages.push(msg);
        print(`${this.prefix} message stored`, this.messages);
      }, 0);
    },
  };

  logger.log("Hello from arrow callback");
  logger.log("Second message");

  console.log("counter:", counter);
  console.log("logger:", logger);
}

// ─── 6. Object Utility Methods ───────────────────────────────────────────────

function demoUtilities() {
  clearOutput();
  print("── 6. Object Utility Methods ──");

  const scores = { Alice: 95, Bob: 82, Carol: 88 };

  print("Object.keys(scores)", Object.keys(scores));
  print("Object.values(scores)", Object.values(scores));
  print("Object.entries(scores)", Object.entries(scores));

  // Object.assign — merge into a new object
  const defaults = { theme: "light", lang: "en", notifications: true };
  const userPrefs = { theme: "dark" };
  const settings = Object.assign({}, defaults, userPrefs);
  print("Object.assign result", settings);

  // Object.freeze — immutable object
  const config = Object.freeze({ apiUrl: "https://api.example.com", timeout: 5000 });
  config.timeout = 9000; // silently ignored
  print("config after attempted mutation", config);

  // Object.fromEntries — reverse of entries
  const doubled = Object.fromEntries(
    Object.entries(scores).map(([name, score]) => [name, score * 2])
  );
  print("doubled scores", doubled);

  // Iterate with entries
  print("──");
  for (const [name, score] of Object.entries(scores)) {
    print(`  ${name}`, score);
  }

  console.log("scores:", scores);
  console.log("settings:", settings);
  console.log("config (frozen):", config);
  console.log("doubled:", doubled);
}
