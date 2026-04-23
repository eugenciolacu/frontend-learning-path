/**
 * Example 01 – What is JavaScript?
 *
 * This script demonstrates the fundamentals of where and how JS runs:
 *  - It runs in the browser (this file!)
 *  - It can manipulate the DOM (HTML elements)
 *  - It responds to user events
 *  - It can log information to the developer console
 *
 * Open DevTools (F12) → Console to see the console.log outputs.
 */

// ─── Runs immediately when the script loads ───────────────────────────────────

console.log("✅ script.js loaded — JavaScript is running in the browser!");
console.log("JS engine:", navigator.userAgent);

// ─── Helper: write to the on-page output box ─────────────────────────────────

function print(text) {
  const output = document.getElementById("output");
  output.textContent += text + "\n";
}

// ─── Button handler: alert ────────────────────────────────────────────────────

function showAlert() {
  // alert() is a browser API — not part of the JS language itself
  alert("👋 Hello from JavaScript!\n\nThis dialog is shown via the browser's alert() API.");
}

// ─── Button handler: DOM manipulation ────────────────────────────────────────

function modifyDOM() {
  // Select the output element and change its content
  const output = document.getElementById("output");
  output.textContent = ""; // clear previous content

  // Create a new element dynamically
  const heading = document.createElement("strong");
  heading.textContent = "JavaScript modified this page! 🎉\n";
  output.appendChild(heading);

  print("We used document.createElement() to build a <strong> element.");
  print("Then appendChild() inserted it into the DOM.");
  print("HTML is now different from what was in the .html file — JS changed it!");
}

// ─── Button handler: console examples ────────────────────────────────────────

function runConsoleExamples() {
  // The console object is a browser / Node.js API with many useful methods
  console.log("console.log  — standard information");
  console.warn("console.warn — yellow warning");
  console.error("console.error — red error message");
  console.info("console.info — informational (same as log in most browsers)");

  // console.table renders arrays/objects as a table — very useful for debugging
  const languages = [
    { name: "HTML",       role: "Structure" },
    { name: "CSS",        role: "Presentation" },
    { name: "JavaScript", role: "Behavior" },
  ];
  console.table(languages);

  // console.group / groupEnd organises related logs
  console.group("Web Stack");
  console.log("HTML  → Structure");
  console.log("CSS   → Presentation");
  console.log("JS    → Behavior");
  console.groupEnd();

  // console.time / timeEnd measures execution time
  console.time("loop");
  let sum = 0;
  for (let i = 0; i < 1_000_000; i++) sum += i;
  console.timeEnd("loop");

  print("✅ Console examples logged! Open DevTools (F12 → Console) to see them.");
}

// ─── Button handler: environment info ────────────────────────────────────────

function showEnvironmentInfo() {
  const output = document.getElementById("output");
  output.textContent = "";

  // The 'window' object is the global object in browsers
  // It contains all Browser APIs (document, navigator, location, history, etc.)
  print("=== Browser Environment ===");
  print(`window exists:          ${typeof window !== "undefined"}`);
  print(`document exists:        ${typeof document !== "undefined"}`);
  print(`navigator.language:     ${navigator.language}`);
  print(`window.innerWidth:      ${window.innerWidth}px`);
  print(`window.innerHeight:     ${window.innerHeight}px`);
  print(`location.href:          ${location.href}`);
  print(`typeof globalThis:      ${typeof globalThis}`); // works in browser & Node.js
  print("");
  print("Note: In Node.js there is NO 'window' or 'document'.");
  print("Instead, Node.js has 'process', 'require', '__dirname', etc.");
}

// ─── Running JS without a browser: Node.js ───────────────────────────────────
//
// To run JS outside the browser, install Node.js (https://nodejs.org) and run:
//
//   node script.js
//
// In Node.js:
//   - console.log() still works
//   - There is NO window, document, or DOM
//   - You can access the filesystem, network, environment variables, etc.
//   - Commonly used for backend services, build tools, scripts

// ─── Inline script vs external script ────────────────────────────────────────
//
// In HTML you can include JS in three ways:
//
//  1. Inline (inside the HTML file):
//     <script> alert("hello"); </script>
//
//  2. External file (preferred — separation of concerns):
//     <script src="script.js" defer></script>
//
//  3. ES Module (modern — enables import/export):
//     <script type="module" src="app.mjs"></script>
//
// The 'defer' attribute lets the browser parse HTML first,
// then run the script — preventing "element not found" errors.
