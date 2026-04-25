/**
 * Example 02 – Loops
 *
 * Demonstrates:
 *  - for loop (classic, index-based)
 *  - while loop (condition-based)
 *  - do...while loop (runs at least once)
 *  - for...of (iterate array / iterable values)
 *  - for...in (iterate object keys)
 *  - break and continue
 *
 * Open DevTools (F12) → Console for additional console.log output.
 */

// ─── Helper ───────────────────────────────────────────────────────────────────

function print(label, value) {
  const output = document.getElementById("output");
  const line = value !== undefined ? `${label}: ${value}` : label;
  output.textContent += line + "\n";
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

// ─── 1. for loop ──────────────────────────────────────────────────────────────

function demoFor() {
  const n = Number(document.getElementById("countTo").value);
  print(`── for loop: count 1 to ${n} ──`);

  // Basic counter
  for (let i = 1; i <= n; i++) {
    print(`  i = ${i}`);
  }

  // Iterate an array by index
  const fruits = ["apple", "banana", "cherry", "date", "elderberry"];
  print("  —");
  print(`  Array iteration (first ${Math.min(n, fruits.length)} items):`);
  for (let i = 0; i < Math.min(n, fruits.length); i++) {
    print(`  [${i}]`, fruits[i]);
  }

  print("");
}

// ─── 2. while loop ────────────────────────────────────────────────────────────

function demoWhile() {
  const start = Number(document.getElementById("countDown").value);
  print(`── while loop: countdown from ${start} ──`);

  let count = start;
  while (count > 0) {
    print(`  count = ${count}`);
    count--; // don't forget to update — otherwise infinite loop!
  }
  print("  🚀 Liftoff!");
  print("");
}

// ─── 3. do...while ────────────────────────────────────────────────────────────

function demoDoWhile() {
  print("── do...while loop ──");

  // Simulated input validation (body always runs at least once)
  const attempts = [15, 3, 8, 7, 12]; // simulated user inputs
  let i = 0;
  let value;

  do {
    value = attempts[i++];
    print(`  Attempt ${i}: value = ${value}`);
  } while (value < 10 && i < attempts.length);

  if (value >= 10) {
    print(`  ✅ Accepted value: ${value}`);
  } else {
    print("  ❌ Never found a value >= 10 in the simulated inputs");
  }

  print("");
}

// ─── 4. for...of ──────────────────────────────────────────────────────────────

function demoForOf() {
  print("── for...of (array values) ──");

  const colors = ["red", "green", "blue", "yellow", "purple"];

  // Basic: iterate values
  for (const color of colors) {
    print(`  color`, color);
  }

  print("  —");
  // With entries() to get index + value
  print("  With entries():");
  for (const [index, color] of colors.entries()) {
    print(`  [${index}]`, color);
  }

  print("  —");
  // Works on strings (iterates characters)
  print("  Iterating a string:");
  for (const char of "hello") {
    print(`  char`, char);
  }

  print("  —");
  // Works on Sets
  const uniqueNums = new Set([1, 2, 2, 3, 3, 3]);
  print("  Iterating a Set([1,2,2,3,3,3]):");
  for (const num of uniqueNums) {
    print(`  num`, num);
  }

  print("");
}

// ─── 5. for...in ──────────────────────────────────────────────────────────────

function demoForIn() {
  print("── for...in (object keys) ──");

  const person = {
    name: "Alice",
    age: 30,
    city: "Bucharest",
    role: "Developer",
  };

  print("  Object: person");
  for (const key in person) {
    // Good practice: guard against inherited properties
    if (Object.hasOwn(person, key)) {
      print(`  ${key}`, person[key]);
    }
  }

  print("  —");
  print("  ⚠️  Don't use for...in on arrays:");
  const arr = ["a", "b", "c"];
  for (const key in arr) {
    print(`  key = "${key}"`, `(type: ${typeof key})`); // keys are strings "0","1","2"
  }
  print("  → Keys are strings! Use for...of for arrays instead.");

  print("");
}

// ─── 6. break & continue ──────────────────────────────────────────────────────

function demoBreakContinue() {
  print("── break ──");
  // Stop the loop when we find 5
  const data = [1, 3, 5, 7, 9, 11];
  print("  Array:", data.join(", "));
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 7) {
      print(`  Found 7 at index ${i} — breaking!`);
      break;
    }
    print(`  Checked [${i}]`, data[i]);
  }

  print("");
  print("── continue ──");
  // Skip even numbers
  print("  Numbers 0–9 (skipping evens):");
  const odds = [];
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue; // skip even
    odds.push(i);
    print(`  ${i}`);
  }

  print("");
  print("── Nested loops with labels (bonus) ──");
  // Labels allow break/continue to target an outer loop
  outer: for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 1 && col === 1) {
        print(`  Hit (1,1) — breaking outer loop`);
        break outer; // breaks out of the outer for loop entirely
      }
      print(`  (${row}, ${col})`);
    }
  }

  print("");
}

// ─── Run all ──────────────────────────────────────────────────────────────────

function runAllLoops() {
  clearOutput();

  print("=== 1. for loop ===");
  for (let i = 1; i <= 5; i++) {
    print(`  i`, i);
  }
  print("");

  print("=== 2. while loop ===");
  let w = 3;
  while (w > 0) {
    print(`  w`, w--);
  }
  print("");

  print("=== 3. do...while ===");
  let d = 0;
  do {
    print(`  d`, d++);
  } while (d < 3);
  print("");

  print("=== 4. for...of ===");
  for (const fruit of ["apple", "banana", "cherry"]) {
    print(`  fruit`, fruit);
  }
  print("");

  print("=== 5. for...in ===");
  const obj = { a: 1, b: 2, c: 3 };
  for (const key in obj) {
    print(`  ${key}`, obj[key]);
  }
  print("");

  print("=== 6. break & continue ===");
  print("  Break at 4:");
  for (let i = 0; i < 8; i++) {
    if (i === 4) { print("  — break —"); break; }
    print(`  i`, i);
  }
  print("  Continue (skip 3):");
  for (let i = 0; i < 6; i++) {
    if (i === 3) continue;
    print(`  i`, i);
  }
}
