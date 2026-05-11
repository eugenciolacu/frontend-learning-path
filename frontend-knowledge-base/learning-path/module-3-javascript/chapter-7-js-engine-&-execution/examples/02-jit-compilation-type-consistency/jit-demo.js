/**
 * Example 02: JIT Compilation & Type Consistency
 *
 * Demonstrates:
 * - How type-consistent functions run faster (JIT-optimizable)
 * - How type changes cause deoptimization and slower execution
 * - Best practices for writing JIT-friendly code
 *
 * NOTE: Browser JIT behavior varies. This benchmark is illustrative.
 * In modern V8, the speedup may be subtle due to advanced speculative
 * optimization, but type consistency still matters at scale.
 */

const btnRun = document.getElementById("btn-run");
const resultsEl = document.getElementById("results");
const timeConsistentEl = document.getElementById("time-consistent");
const timeMixedEl = document.getElementById("time-mixed");
const speedupEl = document.getElementById("speedup");
const iterationsInput = document.getElementById("iterations");

// ─── Type-Consistent Function ─────────────────────────────────────────────────

/**
 * Always receives two numbers.
 * V8 can generate optimized machine code: fast numeric addition.
 */
function addNumbers(a, b) {
  return a + b;
}

// ─── Type-Mixed Function ──────────────────────────────────────────────────────

/**
 * Same logic, but called with both numbers AND a string at the end.
 * V8 optimizes for numbers, then encounters a string → deoptimizes.
 */
function addAny(a, b) {
  return a + b;
}

// ─── Warm-Up ──────────────────────────────────────────────────────────────────

/**
 * Warm up V8 by pre-running functions before measuring.
 * This gives JIT a chance to compile hot paths before the timed benchmark.
 */
function warmUp() {
  for (let i = 0; i < 10_000; i++) {
    addNumbers(i, i + 1);
    addAny(i, i + 1);
  }
}

// ─── Benchmark Runners ────────────────────────────────────────────────────────

/**
 * Benchmark 1: Type-Consistent
 * All calls use numbers → V8 keeps its number-optimized machine code.
 */
function benchConsistent(iterations) {
  let sum = 0;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    sum += addNumbers(i, i + 1); // always: number + number
  }

  const elapsed = performance.now() - start;

  // Prevent dead-code elimination (use 'sum' so V8 doesn't skip the loop)
  if (sum < 0) console.log("never"); // unreachable, but keeps 'sum' alive

  return elapsed;
}

/**
 * Benchmark 2: Type-Mixed (triggers deoptimization)
 * Almost all calls use numbers, but the last call uses a string,
 * which can cause V8 to bail out from optimized code.
 */
function benchMixed(iterations) {
  let result = 0;
  const start = performance.now();

  for (let i = 0; i < iterations - 1; i++) {
    result += addAny(i, i + 1); // numbers: V8 optimizes...
  }
  // The last call with strings may trigger deoptimization feedback
  addAny("trigger", " deopt"); // string! → may deoptimize addAny

  const elapsed = performance.now() - start;
  if (result < 0) console.log("never");
  return elapsed;
}

// ─── Run Benchmark ────────────────────────────────────────────────────────────

btnRun.addEventListener("click", async () => {
  const iterations = parseInt(iterationsInput.value, 10);
  if (isNaN(iterations) || iterations < 1000) {
    alert("Please enter at least 1,000 iterations.");
    return;
  }

  btnRun.disabled = true;
  btnRun.textContent = "Running...";
  resultsEl.hidden = false;
  timeConsistentEl.textContent = "…";
  timeMixedEl.textContent = "…";
  speedupEl.textContent = "…";

  // Warm up before measuring
  warmUp();

  // Yield to browser to allow UI update
  await new Promise(resolve => setTimeout(resolve, 50));

  const t1 = benchConsistent(iterations);

  // Yield again
  await new Promise(resolve => setTimeout(resolve, 50));

  const t2 = benchMixed(iterations);

  // Display results
  timeConsistentEl.textContent = `${t1.toFixed(2)} ms`;
  timeMixedEl.textContent = `${t2.toFixed(2)} ms`;

  const ratio = t2 / t1;
  speedupEl.textContent = ratio >= 1
    ? `${ratio.toFixed(2)}×`
    : `(mixed was faster — JIT heuristics vary by run)`;

  btnRun.disabled = false;
  btnRun.textContent = "Run Benchmark";
});

// ─── Concept Demonstrations (console) ────────────────────────────────────────

console.group("🔍 Type Consistency Concepts");

// Monomorphic (one type) — fast
function monomorphicAdd(a, b) { return a + b; }
monomorphicAdd(1, 2);
monomorphicAdd(3, 4);
monomorphicAdd(5, 6);
console.log("Monomorphic (number): always optimized");

// Polymorphic (few types) — slower
function polymorphicAdd(a, b) { return a + b; }
polymorphicAdd(1, 2);       // number
polymorphicAdd("a", "b");   // string
polymorphicAdd(1.5, 2.5);   // float
console.log("Polymorphic (mixed types): harder to optimize");

// Megamorphic (many types) — slowest
function megamorphicAdd(a, b) { return a + b; }
megamorphicAdd(1, 2);
megamorphicAdd("a", "b");
megamorphicAdd(true, false);
megamorphicAdd(1n, 2n);    // BigInt
console.log("Megamorphic (many types): V8 gives up optimizing");

// Object shapes: consistent is faster
function consistentShape(name, age) {
  return { name, age }; // always same order → same hidden class
}
const obj1 = consistentShape("Alice", 30);
const obj2 = consistentShape("Bob", 25);
console.log("Consistent object shape:", obj1, obj2);

// Inconsistent shape: slower
const bad1 = { x: 1, y: 2 };
const bad2 = { y: 2, x: 1 }; // different hidden class
console.log("Inconsistent object shapes:", bad1, bad2);

console.groupEnd();
