/**
 * Example 04 – Operators
 *
 * Covers:
 *  - Arithmetic: + - * / % ** ++ --
 *  - Assignment: = += -= *= /= %= **= ??= ||= &&=
 *  - Comparison: == === != !== < > <= >=
 *  - Logical: && || ! ?? ?.
 *  - Ternary: condition ? a : b
 *  - Other: typeof, instanceof, in, delete, optional chaining
 *  - Operator precedence
 */

// ─── Utility ──────────────────────────────────────────────────────────────────

function log(label, value) {
  const out = document.getElementById("output");
  const line = value !== undefined
    ? `${label}: ${JSON.stringify(value) ?? String(value)}`
    : String(label);
  out.textContent += line + "\n";
  console.log(line);
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

function heading(text) {
  log(`\n── ${text} ──`);
}

// ─── Arithmetic Operators ─────────────────────────────────────────────────────

function demoArithmetic() {
  clearOutput();
  heading("Arithmetic Operators");

  const a = 10;
  const b = 3;

  log("a", a);
  log("b", b);
  log("a + b  (addition)", a + b);       // 13
  log("a - b  (subtraction)", a - b);    // 7
  log("a * b  (multiplication)", a * b); // 30
  log("a / b  (division)", a / b);       // 3.333...
  log("a % b  (modulus/remainder)", a % b); // 1
  log("a ** b (exponentiation)", a ** b); // 1000

  heading("Increment & Decrement");

  let x = 5;
  log("x = 5 initial", x);
  log("x++ (post-increment: return THEN increment)", x++); // returns 5
  log("x after x++", x);                                   // 6
  log("++x (pre-increment: increment THEN return)", ++x);  // 7
  log("x after ++x", x);                                   // 7
  log("x-- (post-decrement: return THEN decrement)", x--); // 7
  log("x after x--", x);                                   // 6
  log("--x (pre-decrement: decrement THEN return)", --x);  // 5
  log("x after --x", x);                                   // 5

  heading("String + (concatenation)");
  log('"Hello" + " " + "World"', "Hello" + " " + "World"); // "Hello World"
  log('"Value: " + 42', "Value: " + 42);                   // "Value: 42"
  log('"3" + 2 + 1', "3" + 2 + 1);                        // "321" — left-to-right
  log('1 + 2 + "3"', 1 + 2 + "3");                        // "33" — 3 then concat

  heading("Unary Operators");
  log("+('42') — converts to number", +"42");   // 42
  log("+true — converts to number", +true);     // 1
  log("-(-5) — negation", -(-5));               // 5
  log("typeof 42", typeof 42);                  // "number"
  log("void 0", void 0);                        // undefined (rarely used)
}

// ─── Assignment Operators ─────────────────────────────────────────────────────

function demoAssignment() {
  clearOutput();
  heading("Assignment Operators");

  let n = 10;
  log("n = 10", n);

  n += 5; log("n += 5  (n = n + 5)", n);   // 15
  n -= 3; log("n -= 3  (n = n - 3)", n);   // 12
  n *= 2; log("n *= 2  (n = n * 2)", n);   // 24
  n /= 4; log("n /= 4  (n = n / 4)", n);   // 6
  n %= 4; log("n %= 4  (n = n % 4)", n);   // 2
  n **= 3; log("n **= 3 (n = n ** 3)", n); // 8

  heading("Logical Assignment Operators (ES2021)");

  // ??= assigns only if the current value is null or undefined
  let a = null;
  a ??= "default";
  log("null ??= 'default'", a); // "default"

  let b = "existing";
  b ??= "default";
  log("'existing' ??= 'default'", b); // "existing" — not null/undefined, skip

  let c = 0;
  c ??= 99;
  log("0 ??= 99", c); // 0 — 0 is not null/undefined, so skip

  // ||= assigns only if the current value is falsy
  let d = "";
  d ||= "fallback";
  log("'' ||= 'fallback'", d); // "fallback" — "" is falsy

  let e = "value";
  e ||= "fallback";
  log("'value' ||= 'fallback'", e); // "value" — already truthy

  // &&= assigns only if the current value is truthy
  let f = "truthy";
  f &&= "updated";
  log("'truthy' &&= 'updated'", f); // "updated"

  let g = "";
  g &&= "updated";
  log("'' &&= 'updated'", g); // "" — falsy, skip assignment

  heading("Destructuring Assignment");
  // Covered deeply in Chapter 3, but a quick preview:
  const [first, second, ...rest] = [1, 2, 3, 4, 5];
  log("const [first, second, ...rest] = [1,2,3,4,5]");
  log("first", first);   // 1
  log("second", second); // 2
  log("rest", rest);     // [3, 4, 5]

  const { name, age = 0 } = { name: "Alice" };
  log("name (from destructuring)", name); // "Alice"
  log("age (default value)", age);        // 0
}

// ─── Comparison Operators ─────────────────────────────────────────────────────

function demoComparison() {
  clearOutput();
  heading("Comparison Operators — always return boolean");

  heading("Loose vs Strict Equality");
  log("5 == '5'  (loose — coerces)", 5 == "5");    // true ⚠️
  log("5 === '5' (strict — no coercion)", 5 === "5"); // false ✅
  log("0 == false (loose)", 0 == false);             // true ⚠️
  log("0 === false (strict)", 0 === false);           // false ✅
  log("null == undefined (loose)", null == undefined); // true
  log("null === undefined (strict)", null === undefined); // false

  heading("Relational Operators");
  log("5 > 3", 5 > 3);   // true
  log("5 < 3", 5 < 3);   // false
  log("5 >= 5", 5 >= 5); // true
  log("5 <= 4", 5 <= 4); // false

  heading("String Comparison (lexicographic order)");
  log('"apple" < "banana"', "apple" < "banana"); // true — 'a' < 'b'
  log('"b" > "a"', "b" > "a");                  // true
  log('"10" < "9"', "10" < "9");                // true ⚠️ — compares chars, not numbers
  log('10 < 9', 10 < 9);                        // false — numeric comparison

  heading("Inequality");
  log("5 != '5'  (loose)", 5 != "5");   // false (they are equal with coercion)
  log("5 !== '5' (strict)", 5 !== "5"); // true ✅

  heading("Common pitfalls with null and undefined");
  log("null > 0", null > 0);   // false
  log("null == 0", null == 0); // false — null only == undefined (special rule)
  log("null >= 0", null >= 0); // true ⚠️ — null converts to 0 for relational ops
  log("null < 1", null < 1);   // true ⚠️
  log("undefined > 0", undefined > 0);  // false
  log("undefined < 0", undefined < 0);  // false
  log("undefined == 0", undefined == 0); // false — undefined only == null

  heading("Golden Rule: Always use === and !==");
  log("Always prefer strict equality to avoid unexpected coercion.");
}

// ─── Logical Operators ────────────────────────────────────────────────────────

function demoLogical() {
  clearOutput();
  heading("Logical Operators");

  heading("AND (&&) — returns first falsy OR last value");
  log("true && true", true && true);     // true
  log("true && false", true && false);   // false
  log("false && true", false && true);   // false
  log('"hello" && 42', "hello" && 42);   // 42  — both truthy, returns last
  log('0 && "hello"', 0 && "hello");     // 0   — short-circuits at falsy 0
  log('"a" && "b" && "c"', "a" && "b" && "c"); // "c" — all truthy, returns last
  log('null && "value"', null && "value"); // null — short-circuits

  heading("OR (||) — returns first truthy OR last value");
  log("true || false", true || false);   // true
  log("false || false", false || false); // false
  log('"hello" || "other"', "hello" || "other"); // "hello" — first truthy
  log('0 || "default"', 0 || "default"); // "default" — 0 is falsy
  log('null || undefined', null || undefined); // undefined — both falsy, returns last
  log('"" || false || 0 || "found"', "" || false || 0 || "found"); // "found"

  heading("NOT (!) — inverts truthiness");
  log("!true", !true);      // false
  log("!false", !false);    // true
  log("!0", !0);            // true  (0 is falsy)
  log("!''", !"");          // true  (empty string is falsy)
  log("![]", ![]);          // false (arrays are truthy!)
  log("!null", !null);      // true

  heading("Nullish Coalescing (??) — ES2020");
  log("null ?? 'default'", null ?? "default");         // "default"
  log("undefined ?? 'default'", undefined ?? "default"); // "default"
  log("0 ?? 'default'", 0 ?? "default");               // 0 ← key difference from ||
  log("'' ?? 'default'", "" ?? "default");             // "" ← key difference from ||
  log("false ?? 'default'", false ?? "default");       // false ← key difference from ||
  log("'value' ?? 'default'", "value" ?? "default");  // "value"

  heading("Practical Examples of Short-Circuit Evaluation");

  // Default value pattern
  function greet(name) {
    const displayName = name || "Anonymous";
    log(`greet('') → displayName`, displayName); // "Anonymous"
  }
  greet("");

  // Safer with ??  when 0 or "" is a valid value
  function getCount(count) {
    const display = count ?? "No count";
    log(`getCount(0) → display`, display); // 0 (correct!)
  }
  getCount(0);

  // Conditional execution
  const isAdmin = true;
  isAdmin && log("Admin message", "Access granted to admin panel");

  // Guard clause
  const user = null;
  const name = user && user.name; // undefined (no crash)
  log("user && user.name (safe access)", name);
}

// ─── Ternary Operator ─────────────────────────────────────────────────────────

function demoTernary() {
  clearOutput();
  heading("Ternary Operator: condition ? valueIfTrue : valueIfFalse");

  const age = 20;
  const status = age >= 18 ? "adult" : "minor";
  log("age >= 18 ? 'adult' : 'minor'", status); // "adult"

  // Equivalent if-else:
  let status2;
  if (age >= 18) {
    status2 = "adult";
  } else {
    status2 = "minor";
  }
  log("if-else equivalent result", status2); // "adult"

  heading("Ternary in template literals");
  const score = 75;
  log("score", score);
  log(`You ${score >= 50 ? "passed" : "failed"} the exam.`);

  heading("Ternary for conditional function calls");
  function handlePremium() { return "Premium content unlocked"; }
  function handleFree() { return "Upgrade to access"; }
  const isPremium = true;
  log("isPremium result", isPremium ? handlePremium() : handleFree());

  heading("Nested ternary (use sparingly — prefer if-else for complex logic)");
  const grade = score >= 90 ? "A"
              : score >= 80 ? "B"
              : score >= 70 ? "C"
              : score >= 60 ? "D"
              : "F";
  log("grade for score 75", grade); // "C"

  heading("Ternary for conditional rendering (common in React)");
  const isLoggedIn = true;
  // This pattern is used heavily in React JSX:
  const message = isLoggedIn
    ? "Welcome back!"
    : "Please sign in.";
  log("message", message);

  heading("When NOT to use ternary");
  log("Avoid ternary when:");
  log("  1. Logic is complex (multiple conditions/actions)");
  log("  2. Either branch performs side effects (use if-else for clarity)");
  log("  3. Nesting is more than 2 levels deep");
}

// ─── Other Operators ─────────────────────────────────────────────────────────

function demoOther() {
  clearOutput();
  heading("typeof");
  log("typeof 'string'", typeof "string");       // "string"
  log("typeof 42", typeof 42);                   // "number"
  log("typeof true", typeof true);               // "boolean"
  log("typeof undefined", typeof undefined);     // "undefined"
  log("typeof null", typeof null);               // "object" ⚠️ bug
  log("typeof Symbol()", typeof Symbol());       // "symbol"
  log("typeof 42n", typeof 42n);                 // "bigint"
  log("typeof {}", typeof {});                   // "object"
  log("typeof []", typeof []);                   // "object"
  log("typeof function(){}", typeof function(){}); // "function"

  heading("instanceof — checks prototype chain");
  log("[] instanceof Array", [] instanceof Array);   // true
  log("[] instanceof Object", [] instanceof Object); // true (arrays are objects)
  log("{} instanceof Object", ({}) instanceof Object); // true
  log("'hello' instanceof String", "hello" instanceof String); // false (primitive!)
  log("new String('hello') instanceof String", new String("hello") instanceof String); // true

  heading("in — checks if property exists in object");
  const car = { brand: "Toyota", year: 2022 };
  log("'brand' in car", "brand" in car);     // true
  log("'year' in car", "year" in car);       // true
  log("'price' in car", "price" in car);     // false
  log("'toString' in car", "toString" in car); // true — inherited from Object.prototype

  heading("delete — removes a property");
  const obj = { x: 1, y: 2, z: 3 };
  log("obj before delete", JSON.stringify(obj));
  delete obj.y;
  log("obj after delete obj.y", JSON.stringify(obj));
  log("'y' in obj after delete", "y" in obj); // false

  heading("Optional Chaining (?.) — ES2020");
  const user = null;
  log("user?.name (user is null)", user?.name);            // undefined (no error!)
  log("user?.address?.city", user?.address?.city);         // undefined

  const profile = { name: "Alice", address: { city: "Berlin" } };
  log("profile?.address?.city", profile?.address?.city);   // "Berlin"
  log("profile?.phone?.number", profile?.phone?.number);   // undefined

  // Optional chaining with method calls
  const arr = null;
  log("arr?.map(x => x)", arr?.map(x => x));               // undefined

  // Optional chaining with bracket notation
  const key = "name";
  log("profile?.[key]", profile?.[key]);                   // "Alice"

  heading("Spread Operator (...) — preview, more in Ch.3");
  const nums = [1, 2, 3];
  const more = [...nums, 4, 5];
  log("[...nums, 4, 5]", more); // [1, 2, 3, 4, 5]

  const original = { a: 1, b: 2 };
  const copy = { ...original, c: 3 };
  log("{ ...original, c: 3 }", copy); // { a: 1, b: 2, c: 3 }
}

// ─── Operator Precedence ──────────────────────────────────────────────────────

function demoPrecedence() {
  clearOutput();
  heading("Operator Precedence");

  log("Higher precedence evaluates first (like PEMDAS in math)");

  heading("Arithmetic precedence");
  log("2 + 3 * 4", 2 + 3 * 4);       // 14 — * before +
  log("(2 + 3) * 4", (2 + 3) * 4);   // 20 — () overrides
  log("2 ** 3 ** 2", 2 ** 3 ** 2);   // 512 — ** is right-to-left: 2 ** (3**2) = 2**9
  log("(2 ** 3) ** 2", (2 ** 3) ** 2); // 64 — grouped left

  heading("Mixed precedence");
  let x = 2 + 3 > 4 && true;
  // Step 1: 2 + 3 = 5     (+ before >)
  // Step 2: 5 > 4 = true  (> before &&)
  // Step 3: true && true = true
  log("2 + 3 > 4 && true", x); // true

  let y = !false || true && false;
  // Step 1: !false = true       (! highest among these)
  // Step 2: true && false = false  (&& before ||)
  // Step 3: true || false = true
  log("!false || true && false", y); // true

  heading("Assignment is right-to-left");
  let a, b, c;
  a = b = c = 5; // right-to-left: c=5, b=5, a=5
  log("a = b = c = 5  → a", a); // 5
  log("a = b = c = 5  → b", b); // 5
  log("a = b = c = 5  → c", c); // 5

  heading("Ternary precedence (lower than most operators)");
  let result = 1 + 2 === 3 ? "correct" : "wrong";
  // (1 + 2) === 3 → true → "correct"
  log("1 + 2 === 3 ? 'correct' : 'wrong'", result);

  heading("Precedence Table (highest → lowest, simplified)");
  log("18: () grouping");
  log("17: . [] () — member access, function call");
  log("16: ++ -- (postfix)");
  log("15: ++ -- ! ~ typeof void delete (prefix)");
  log("14: ** (right-to-left)");
  log("13: * / %");
  log("12: + -");
  log("11: < > <= >= instanceof in");
  log("10: == != === !==");
  log(" 6: &&");
  log(" 5: ||");
  log(" 4: ??");
  log(" 3: ? : (ternary)");
  log(" 2: = += -= etc. (assignment, right-to-left)");
  log(" 1: , (comma)");
  log("");
  log("Tip: When in doubt, use parentheses () to make intent explicit.");
}
