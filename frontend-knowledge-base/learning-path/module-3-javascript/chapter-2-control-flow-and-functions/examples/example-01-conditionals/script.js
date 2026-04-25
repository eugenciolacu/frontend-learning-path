/**
 * Example 01 – Conditionals
 *
 * Demonstrates:
 *  - if / else if / else
 *  - Ternary operator
 *  - switch statement
 *  - Short-circuit evaluation (&&, ||, ??)
 *
 * Open DevTools (F12) → Console to see all console.log outputs as well.
 */

// ─── Helper: write to the on-page output box ─────────────────────────────────

function print(label, value) {
  const output = document.getElementById("output");
  const line = value !== undefined ? `${label}: ${value}` : label;
  output.textContent += line + "\n";
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

// ─── 1. if / else if / else ───────────────────────────────────────────────────

function checkTemperature() {
  const temperature = Number(document.getElementById("temp").value);
  print("── Temperature check ──");
  print("Input", `${temperature}°C`);

  let message;

  if (temperature > 35) {
    message = "🥵 It's very hot outside!";
  } else if (temperature > 20) {
    message = "😊 It's a pleasant day.";
  } else if (temperature > 10) {
    message = "🧥 It's a bit cool.";
  } else if (temperature > 0) {
    message = "❄️ It's cold — grab a jacket!";
  } else {
    message = "🥶 It's freezing!";
  }

  print("Result", message);
  print(""); // blank line
}

// ─── 2. Ternary operator ──────────────────────────────────────────────────────

function checkAge() {
  const age = Number(document.getElementById("age").value);
  print("── Ternary operator ──");
  print("Age", age);

  // Compact inline conditional
  const status = age >= 18 ? "adult" : "minor";
  print("Status", status);

  // Nested ternary (use sparingly — can hurt readability)
  const category =
    age < 13
      ? "child"
      : age < 18
      ? "teenager"
      : age < 65
      ? "adult"
      : "senior";
  print("Category", category);

  print("");
}

// ─── 3. switch ────────────────────────────────────────────────────────────────

function checkDay() {
  const day = document.getElementById("day").value;
  print("── switch ──");
  print("Day", day);

  let type;

  switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      type = "Weekday 💼";
      break;
    case "Saturday":
    case "Sunday":
      type = "Weekend 🎉";
      break;
    default:
      type = "Unknown day";
  }

  print("Type", type);
  print("");
}

// ─── 4. Short-circuit evaluation ─────────────────────────────────────────────

function checkUsername() {
  const rawInput = document.getElementById("username").value;
  print("── Short-circuit evaluation ──");
  print("Raw input", `"${rawInput}"`);

  // || returns the first truthy value (fallback pattern)
  const displayName = rawInput || "Guest";
  print("|| result (displayName)", displayName);

  // ?? (nullish coalescing) only falls back for null/undefined (not "" or 0)
  const orNull = rawInput === "" ? null : rawInput;
  const displayName2 = orNull ?? "Guest";
  print("?? result (displayName2)", displayName2);

  // && short-circuits: right side only runs if left is truthy
  const greeting = rawInput && `Welcome back, ${rawInput}!`;
  print("&& result (greeting)", greeting || "(falsy — no greeting)");

  print("");
}

// ─── Run all examples with fixed data ────────────────────────────────────────

function runAllExamples() {
  clearOutput();

  // Demonstrate various temperatures
  const temps = [-5, 5, 15, 25, 40];
  print("=== if / else if / else — Temperature ===");
  temps.forEach((t) => {
    let msg;
    if (t > 35)      msg = "Very hot";
    else if (t > 20) msg = "Pleasant";
    else if (t > 10) msg = "Cool";
    else if (t > 0)  msg = "Cold";
    else             msg = "Freezing";
    print(`  ${t}°C`, msg);
  });
  print("");

  // Ternary examples
  print("=== Ternary Operator — Age ===");
  [5, 15, 30, 70].forEach((age) => {
    const s = age >= 18 ? "adult" : "minor";
    print(`  Age ${age}`, s);
  });
  print("");

  // Switch examples
  print("=== switch — Day ===");
  ["Monday", "Friday", "Saturday", "Sunday"].forEach((d) => {
    let type;
    switch (d) {
      case "Monday": case "Tuesday": case "Wednesday":
      case "Thursday": case "Friday":
        type = "Weekday"; break;
      case "Saturday": case "Sunday":
        type = "Weekend"; break;
      default:
        type = "Unknown";
    }
    print(`  ${d}`, type);
  });
  print("");

  // Short-circuit
  print("=== Short-circuit &&, ||, ?? ===");
  const inputs = ["Alice", "", null, 0, "Bob"];
  inputs.forEach((v) => {
    const orResult  = v || "Guest";
    const nullResult = v ?? "Guest";
    print(`  Input "${v}"`, `|| → "${orResult}"  | ?? → "${nullResult}"`);
  });
  print("");

  // Truthy / falsy reference
  print("=== Truthy / Falsy Reference ===");
  const values = [0, "", null, undefined, NaN, false, 1, "hello", [], {}];
  values.forEach((v) => {
    print(`  ${String(v)}`, v ? "truthy" : "falsy");
  });
}
