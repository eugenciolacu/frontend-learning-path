/**
 * Example 03 – Data Types
 *
 * Covers all 7 primitive types and the Object non-primitive:
 *   string, number, boolean, null, undefined, symbol, bigint, object
 *
 * Also demonstrates typeof, type coercion, and explicit conversion.
 */

// ─── Utility ──────────────────────────────────────────────────────────────────

function log(label, value) {
  const out = document.getElementById("output");
  const formatted = value !== undefined
    ? `${String(label)}: ${JSON.stringify(value) ?? String(value)}`
    : String(label);
  out.textContent += formatted + "\n";
  console.log(formatted);
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

function heading(text) {
  log(`\n── ${text} ──`);
}

// ─── Strings ─────────────────────────────────────────────────────────────────

function demoStrings() {
  clearOutput();
  heading("String");

  // Creating strings — three quote styles
  const single = 'Hello, World!';
  const double = "Hello, World!";
  const backtick = `Hello, World!`;

  log("single === double", single === double); // true — same content

  // Template literals (backticks)
  const name = "Alice";
  const age = 25;
  const greeting = `My name is ${name} and I am ${age} years old.`;
  log("template literal", greeting);

  // Multi-line template literal
  const multiline = `Line 1
Line 2
Line 3`;
  log("multiline (newlines included)", multiline);

  // Expression evaluation inside template literal
  log("2 + 2 in template", `Result: ${2 + 2}`); // "Result: 4"

  heading("Common String Properties & Methods");

  const str = "JavaScript";
  log("str.length", str.length);            // 10
  log("str[0]", str[0]);                    // "J" (index access)
  log("str.toUpperCase()", str.toUpperCase());
  log("str.toLowerCase()", str.toLowerCase());
  log("str.includes('Script')", str.includes("Script")); // true
  log("str.startsWith('Java')", str.startsWith("Java")); // true
  log("str.endsWith('pt')", str.endsWith("pt"));         // true
  log("str.indexOf('a')", str.indexOf("a"));             // 1
  log("str.lastIndexOf('a')", str.lastIndexOf("a"));     // 3
  log("str.slice(0, 4)", str.slice(0, 4));               // "Java"
  log("str.slice(-6)", str.slice(-6));                   // "Script"
  log("str.replace('Java', 'Type')", str.replace("Java", "Type")); // "TypeScript"
  log("'  hello  '.trim()", "  hello  ".trim());         // "hello"
  log("str.split('a')", JSON.stringify(str.split("a"))); // ["J","v","Script"]
  log("'a,b,c'.split(',')", JSON.stringify("a,b,c".split(","))); // ["a","b","c"]
  log("str.padStart(15, '*')", str.padStart(15, "*"));   // "*****JavaScript"
  log("str.repeat(2)", "JS ".repeat(2));                 // "JS JS "

  heading("Strings are immutable");
  let s = "hello";
  s.toUpperCase(); // returns new string — does NOT modify s
  log("s after .toUpperCase() (immutable)", s); // still "hello"
  s = s.toUpperCase(); // must reassign
  log("s after reassignment", s); // "HELLO"
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

function demoNumbers() {
  clearOutput();
  heading("Number — 64-bit IEEE 754 float");

  log("Integer", 42);
  log("Float", 3.14);
  log("Negative", -7);
  log("Scientific notation", 1.5e6);          // 1500000
  log("Hex literal", 0xFF);                   // 255
  log("Octal literal", 0o17);                 // 15
  log("Binary literal", 0b1010);              // 10

  heading("Special Values");
  log("1 / 0", 1 / 0);                        // Infinity
  log("-1 / 0", -1 / 0);                      // -Infinity
  log("0 / 0", 0 / 0);                        // NaN
  log("Infinity + 1", Infinity + 1);           // Infinity
  log("typeof NaN", typeof NaN);               // "number" — counterintuitive!

  heading("NaN Checks");
  log("isNaN('hello')", isNaN("hello"));           // true (coerces to NaN)
  log("isNaN(undefined)", isNaN(undefined));       // true (coerces to NaN)
  log("isNaN(42)", isNaN(42));                     // false
  log("Number.isNaN('hello')", Number.isNaN("hello")); // false (no coercion)
  log("Number.isNaN(NaN)", Number.isNaN(NaN));     // true ← more reliable
  log("NaN === NaN", NaN === NaN);                 // false! NaN is never equal to itself

  heading("Floating Point Precision (IEEE 754 quirk)");
  log("0.1 + 0.2", 0.1 + 0.2);                   // 0.30000000000000004
  log("0.1 + 0.2 === 0.3", 0.1 + 0.2 === 0.3);   // false!
  log("(0.1+0.2).toFixed(2)", (0.1 + 0.2).toFixed(2)); // "0.30" (string)
  // Rounding workaround:
  log("Math.round((0.1+0.2)*100)/100", Math.round((0.1 + 0.2) * 100) / 100); // 0.3

  heading("Number Methods");
  log("Number.MAX_SAFE_INTEGER", Number.MAX_SAFE_INTEGER); // 9007199254740991
  log("Number.MIN_SAFE_INTEGER", Number.MIN_SAFE_INTEGER);
  log("Number.isInteger(42)", Number.isInteger(42));         // true
  log("Number.isInteger(3.14)", Number.isInteger(3.14));     // false
  log("Number.isFinite(Infinity)", Number.isFinite(Infinity)); // false
  log("parseInt('42px')", parseInt("42px"));                 // 42
  log("parseInt('0xFF', 16)", parseInt("0xFF", 16));         // 255
  log("parseFloat('3.14abc')", parseFloat("3.14abc"));       // 3.14
  log("(1234.5678).toFixed(2)", (1234.5678).toFixed(2));     // "1234.57"
  log("(1000000).toLocaleString()", (1000000).toLocaleString()); // "1,000,000"

  heading("Math Object (common operations)");
  log("Math.round(4.6)", Math.round(4.6));   // 5
  log("Math.floor(4.9)", Math.floor(4.9));   // 4
  log("Math.ceil(4.1)", Math.ceil(4.1));     // 5
  log("Math.abs(-7)", Math.abs(-7));         // 7
  log("Math.max(1,5,3)", Math.max(1, 5, 3)); // 5
  log("Math.min(1,5,3)", Math.min(1, 5, 3)); // 1
  log("Math.sqrt(16)", Math.sqrt(16));       // 4
  log("Math.pow(2, 10)", Math.pow(2, 10));   // 1024
  log("Math.PI", Math.PI);
  log("Math.random() (0–1)", Math.random()); // varies
}

// ─── Booleans ─────────────────────────────────────────────────────────────────

function demoBooleans() {
  clearOutput();
  heading("Boolean — true or false");

  log("true", true);
  log("false", false);
  log("typeof true", typeof true);

  heading("Falsy Values — treated as false in boolean context");
  const falsyValues = [false, 0, -0, 0n, "", '', ``, null, undefined, NaN];
  falsyValues.forEach(v => {
    log(`Boolean(${String(v) || "''"})`, Boolean(v));
  });

  heading("Truthy Values — everything else");
  const truthyValues = ["hello", 42, -1, [], {}, function(){}, true, "false", "0"];
  truthyValues.forEach(v => {
    log(`Boolean(${JSON.stringify(v)})`, Boolean(v));
  });

  heading("Common Boolean usage in conditions");
  let username = "";
  if (!username) {
    log("username is empty (falsy), showing fallback", "Anonymous");
  }

  let items = [];
  log("Empty array is truthy", Boolean(items)); // true ⚠️
  log("items.length is falsy when empty", Boolean(items.length)); // false

  // Double negation !! — shorthand for Boolean()
  log("!!0", !!0);        // false
  log("!!'hello'", !!"hello"); // true
}

// ─── null and undefined ───────────────────────────────────────────────────────

function demoNullUndefined() {
  clearOutput();
  heading("null — intentional absence of value");

  let selectedUser = null;
  log("selectedUser", selectedUser);
  log("typeof null", typeof null); // "object" — famous JS bug!
  log("selectedUser === null", selectedUser === null); // true
  log("selectedUser == undefined", selectedUser == undefined); // true (loose)
  log("selectedUser === undefined", selectedUser === undefined); // false (strict)

  heading("undefined — declared but not assigned");

  let x;
  log("declared let x (not assigned)", x); // undefined
  log("typeof x", typeof x);               // "undefined"

  function noReturn() {} // functions with no return statement return undefined
  log("noReturn()", noReturn());

  const obj = { name: "Alice" };
  log("obj.missingProp", obj.missingProp); // undefined — property doesn't exist

  heading("null vs undefined — when to use each");
  log("Use null: intentional 'no value' (e.g., empty cart, no user selected)");
  log("Use undefined: JS's default for uninitialized variables/missing properties");
  log("");
  log("Checking for both at once (loose equality trick):");
  log("null == undefined", null == undefined);   // true
  log("null == 0", null == 0);                   // false
  log("null == ''", null == "");                 // false
  log("undefined == false", undefined == false); // false
}

// ─── Symbol ───────────────────────────────────────────────────────────────────

function demoSymbol() {
  clearOutput();
  heading("Symbol — guaranteed unique identifier");

  const sym1 = Symbol("description");
  const sym2 = Symbol("description");

  log("typeof sym1", typeof sym1);           // "symbol"
  log("sym1 === sym2", sym1 === sym2);       // false — every Symbol is unique!
  log("sym1.toString()", sym1.toString());   // "Symbol(description)"
  log("sym1.description", sym1.description); // "description"

  heading("Symbol as object property key");
  const ID_KEY = Symbol("id");
  const user = {
    name: "Alice",
    [ID_KEY]: 12345, // computed property with Symbol key
  };

  log("user.name", user.name);
  log("user[ID_KEY]", user[ID_KEY]);

  // Symbol keys are NOT enumerable — they're hidden from regular loops
  log("Object.keys(user)", JSON.stringify(Object.keys(user))); // ["name"] only
  log("JSON.stringify(user)", JSON.stringify(user));            // {"name":"Alice"} only

  // To get symbol keys:
  log("Object.getOwnPropertySymbols(user) length",
    Object.getOwnPropertySymbols(user).length); // 1

  heading("Symbol.for — shared global symbols");
  const globalSym1 = Symbol.for("shared");
  const globalSym2 = Symbol.for("shared");
  log("Symbol.for('shared') === Symbol.for('shared')", globalSym1 === globalSym2); // true

  heading("Well-Known Symbols (used by JS internals)");
  log("Symbol.iterator exists", typeof Symbol.iterator);     // "symbol"
  log("Symbol.toPrimitive exists", typeof Symbol.toPrimitive); // "symbol"
  log("Use case: customise how an object behaves in for...of, +, comparisons, etc.");
}

// ─── BigInt ───────────────────────────────────────────────────────────────────

function demoBigInt() {
  clearOutput();
  heading("BigInt — arbitrary precision integers");

  const big1 = 9007199254740991n;  // Number.MAX_SAFE_INTEGER as BigInt
  const big2 = BigInt("9007199254740992"); // one more than max safe integer

  log("typeof 42n", typeof 42n);    // "bigint"
  log("big1", big1.toString());
  log("big2", big2.toString());

  heading("Arithmetic");
  log("10n + 20n", (10n + 20n).toString());   // 30n
  log("10n * 3n", (10n * 3n).toString());     // 30n
  log("7n / 2n", (7n / 2n).toString());       // 3n — integer division (truncates)
  log("7n % 2n", (7n % 2n).toString());       // 1n
  log("2n ** 64n", (2n ** 64n).toString());   // a very large number

  heading("Cannot mix BigInt and Number");
  try {
    eval("10n + 10");
  } catch (e) {
    log("10n + 10 → TypeError", e.message);
  }

  // Explicit conversion to mix types
  log("Number(10n) + 10", Number(10n) + 10); // 20 ✅
  log("10n + BigInt(10)", (10n + BigInt(10)).toString()); // 20n ✅

  heading("Comparison with Number");
  log("1n == 1", 1n == 1);   // true  (loose — cross-type comparison)
  log("1n === 1", 1n === 1); // false (strict — different types)
  log("1n < 2", 1n < 2);     // true  (relational works cross-type)

  heading("When to use BigInt");
  log("Use when working with integers > Number.MAX_SAFE_INTEGER (2^53 - 1)");
  log("Examples: cryptography, large IDs, financial calculations with integer math");
}

// ─── typeof ───────────────────────────────────────────────────────────────────

function demoTypeof() {
  clearOutput();
  heading("typeof operator");

  const examples = [
    ["'hello'",     "hello"],
    ["42",          42],
    ["3.14",        3.14],
    ["true",        true],
    ["undefined",   undefined],
    ["null",        null],
    ["Symbol()",    Symbol()],
    ["42n",         42n],
    ["{}",          {}],
    ["[]",          []],
    ["function(){}", function(){}],
  ];

  examples.forEach(([label, value]) => {
    log(`typeof ${label}`, typeof value);
  });

  heading("typeof gotchas");
  log("typeof null === 'object'  ← famous historical bug in JS");
  log("typeof [] === 'object'    ← use Array.isArray() to check for arrays");
  log("typeof function(){} === 'function' ← functions are objects, but get special typeof");

  log("\nChecking for arrays correctly:");
  log("Array.isArray([])", Array.isArray([]));         // true
  log("Array.isArray({})", Array.isArray({}));         // false
  log("Array.isArray('hello')", Array.isArray("hello")); // false

  log("\ntypeof is safe for undeclared variables:");
  log("typeof undeclaredVariable", typeof undeclaredVariable); // "undefined" (no error)
  // console.log(undeclaredVariable); // ← this WOULD throw ReferenceError
}

// ─── Type Coercion ────────────────────────────────────────────────────────────

function demoCoercion() {
  clearOutput();
  heading("Implicit Type Coercion");

  heading("+ operator: addition vs concatenation");
  log('"5" + 3', "5" + 3);        // "53" — number coerced to string
  log('3 + "5"', 3 + "5");        // "35" — number coerced to string
  log('true + 1', true + 1);      // 2 — true → 1
  log('false + 1', false + 1);    // 1 — false → 0
  log('null + 1', null + 1);      // 1 — null → 0
  log('undefined + 1', undefined + 1); // NaN — undefined → NaN
  log('"" + 0', "" + 0);          // "0"
  log('[] + []', [] + []);        // "" — both coerced to ""
  log('{} + []', ({}) + []);      // "[object Object]"

  heading("- * / % — always numeric coercion");
  log('"5" - 3', "5" - 3);        // 2 — string "5" → number 5
  log('"6" * "2"', "6" * "2");    // 12
  log('"10" / "2"', "10" / "2");  // 5
  log('"abc" - 1', "abc" - 1);    // NaN — "abc" → NaN

  heading("Loose Equality (==) coercion — AVOID THIS");
  log('0 == false', 0 == false);     // true ⚠️
  log('"" == false', "" == false);   // true ⚠️
  log('"1" == 1', "1" == 1);         // true ⚠️
  log('null == undefined', null == undefined); // true ⚠️ (only exception that's "useful")
  log('null == 0', null == 0);       // false
  log('[] == false', [] == false);   // true ⚠️
  log('[] == ![]', [] == ![]);       // true ⚠️ — mind-bending!

  heading("Strict Equality (===) — NO coercion — ALWAYS USE THIS");
  log('0 === false', 0 === false);   // false ✅
  log('"1" === 1', "1" === 1);       // false ✅
  log('null === undefined', null === undefined); // false ✅
}

// ─── Explicit Conversion ──────────────────────────────────────────────────────

function demoExplicitConversion() {
  clearOutput();
  heading("Explicit Type Conversion");

  heading("To Number");
  log("Number('42')", Number("42"));           // 42
  log("Number('3.14')", Number("3.14"));       // 3.14
  log("Number('')", Number(""));               // 0
  log("Number('  ')", Number("  "));           // 0
  log("Number('abc')", Number("abc"));         // NaN
  log("Number(true)", Number(true));           // 1
  log("Number(false)", Number(false));         // 0
  log("Number(null)", Number(null));           // 0
  log("Number(undefined)", Number(undefined)); // NaN
  log("Number([])", Number([]));               // 0 ([] → "" → 0)
  log("Number([3])", Number([3]));             // 3 ([3] → "3" → 3)
  log("parseInt('42px')", parseInt("42px"));   // 42 (stops at non-numeric)
  log("parseFloat('3.14abc')", parseFloat("3.14abc")); // 3.14
  log("+'42' (unary +)", +"42");               // 42 — shorthand for Number()

  heading("To String");
  log("String(42)", String(42));               // "42"
  log("String(3.14)", String(3.14));           // "3.14"
  log("String(true)", String(true));           // "true"
  log("String(null)", String(null));           // "null"
  log("String(undefined)", String(undefined)); // "undefined"
  log("(42).toString()", (42).toString());     // "42"
  log("(255).toString(16)", (255).toString(16)); // "ff" (hex)
  log("(10).toString(2)", (10).toString(2));   // "1010" (binary)

  heading("To Boolean");
  log("Boolean(0)", Boolean(0));               // false
  log("Boolean('')", Boolean(""));             // false
  log("Boolean(null)", Boolean(null));         // false
  log("Boolean(undefined)", Boolean(undefined)); // false
  log("Boolean(NaN)", Boolean(NaN));           // false
  log("Boolean(1)", Boolean(1));               // true
  log("Boolean('hello')", Boolean("hello"));   // true
  log("Boolean([])", Boolean([]));             // true ⚠️ empty array is truthy
  log("Boolean({})", Boolean({}));             // true ⚠️ empty object is truthy
  log("!!0 (double negation)", !!0);           // false
  log("!!'hello'", !!"hello");                 // true
}
