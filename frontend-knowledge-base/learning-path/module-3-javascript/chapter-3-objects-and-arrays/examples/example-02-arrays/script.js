/**
 * Example 02 – Arrays
 *
 * Demonstrates:
 *  - Creating arrays (literal, Array.from, Array.of)
 *  - Accessing elements and using at()
 *  - Mutating methods: push, pop, shift, unshift, splice, sort, reverse, fill
 *  - Non-mutating methods: slice, concat, join, indexOf, includes
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

// ─── 1. Creating Arrays ───────────────────────────────────────────────────────

function demoCreation() {
  clearOutput();
  print("── 1. Creating Arrays ──");

  // Literal
  const fruits = ["apple", "banana", "cherry"];
  print("literal", fruits);

  // Array.from — from iterable
  const chars = Array.from("hello");
  print("Array.from('hello')", chars);

  // Array.from — with map function to generate a range
  const range = Array.from({ length: 5 }, (_, i) => i + 1);
  print("Array.from range 1-5", range);

  // Array.from — from a Set (removes duplicates)
  const unique = Array.from(new Set([1, 2, 2, 3, 3, 4]));
  print("Array.from(Set)", unique);

  // Array.of
  const trio = Array.of(10, 20, 30);
  print("Array.of(10, 20, 30)", trio);

  // new Array with fill
  const zeros = new Array(5).fill(0);
  print("new Array(5).fill(0)", zeros);

  console.log("fruits:", fruits);
}

// ─── 2. Accessing Elements ────────────────────────────────────────────────────

function demoAccess() {
  clearOutput();
  print("── 2. Accessing Elements ──");

  const colors = ["red", "green", "blue", "yellow", "purple"];
  print("array", colors);

  print("colors[0]", colors[0]);
  print("colors[2]", colors[2]);
  print("colors[colors.length - 1] (last)", colors[colors.length - 1]);

  // at() — supports negative indices
  print("colors.at(0)", colors.at(0));
  print("colors.at(-1) (last)", colors.at(-1));
  print("colors.at(-2) (second to last)", colors.at(-2));

  // Out-of-bounds
  print("colors[99] (out of bounds)", colors[99]);

  print("length", colors.length);

  console.log("colors:", colors);
}

// ─── 3. push / pop ────────────────────────────────────────────────────────────

function demoPushPop() {
  clearOutput();
  const val = document.getElementById("pushVal").value || "new item";
  print("── 3. push / pop ──");

  const arr = ["a", "b", "c"];
  print("initial", arr);

  // push — adds to end, returns new length
  const newLen = arr.push(val);
  print(`after push("${val}") — length returned`, newLen);
  print("array now", arr);

  // push multiple
  arr.push("x", "y");
  print("after push('x', 'y')", arr);

  // pop — removes last, returns it
  const popped = arr.pop();
  print("pop() returned", popped);
  print("array now", arr);

  console.log("arr after push/pop:", arr);
}

// ─── 4. shift / unshift ───────────────────────────────────────────────────────

function demoShiftUnshift() {
  clearOutput();
  const val = document.getElementById("pushVal").value || "new item";
  print("── 3. shift / unshift ──");

  const arr = ["b", "c", "d"];
  print("initial", arr);

  // unshift — adds to beginning, returns new length
  const newLen = arr.unshift(val);
  print(`after unshift("${val}") — length returned`, newLen);
  print("array now", arr);

  // shift — removes first, returns it
  const shifted = arr.shift();
  print("shift() returned", shifted);
  print("array now", arr);

  console.log("arr after shift/unshift:", arr);
}

// ─── 5. splice ────────────────────────────────────────────────────────────────

function demoSplice() {
  clearOutput();
  print("── 4. splice ──");

  // splice(startIndex, deleteCount, ...itemsToInsert)

  // Remove elements
  let arr = ["a", "b", "c", "d", "e"];
  print("initial", arr);
  const removed = arr.splice(1, 2); // remove 2 from index 1
  print("splice(1, 2) removed", removed);
  print("array now", arr);

  // Insert without removing
  arr = ["a", "d", "e"];
  arr.splice(1, 0, "b", "c"); // insert at index 1, remove nothing
  print("splice(1, 0, 'b', 'c') array now", arr);

  // Replace
  arr = ["a", "b", "OLD", "d"];
  arr.splice(2, 1, "c"); // replace index 2
  print("splice(2, 1, 'c') array now", arr);

  // Negative index — count from end
  arr = [1, 2, 3, 4, 5];
  arr.splice(-2, 1); // remove 1 element, 2nd from end
  print("splice(-2, 1) array now", arr);

  console.log("arr after splice demos:", arr);
}

// ─── 6. sort & reverse ────────────────────────────────────────────────────────

function demoSort() {
  clearOutput();
  print("── 5. sort & reverse ──");

  // Alphabetical sort (default)
  const fruits = ["banana", "apple", "cherry", "date", "avocado"];
  fruits.sort();
  print("fruits.sort() (alphabetical)", fruits);

  // WRONG numeric sort — do not use default for numbers!
  const numsBad = [10, 1, 21, 100, 2];
  numsBad.sort();
  print("nums.sort() WITHOUT comparator (WRONG!)", numsBad);

  // Correct ascending numeric sort
  const nums = [10, 1, 21, 100, 2];
  nums.sort((a, b) => a - b);
  print("nums.sort((a, b) => a - b) ascending", nums);

  // Descending
  nums.sort((a, b) => b - a);
  print("nums.sort((a, b) => b - a) descending", nums);

  // Sort objects by property
  const people = [
    { name: "Carol", age: 32 },
    { name: "Alice", age: 28 },
    { name: "Bob",   age: 25 },
  ];
  people.sort((a, b) => a.age - b.age);
  print("sorted by age asc", people.map(p => `${p.name}(${p.age})`));

  // reverse
  const letters = ["a", "b", "c", "d"];
  letters.reverse();
  print("letters.reverse()", letters);

  console.log("people sorted:", people);
}

// ─── 7. Non-Mutating Methods ──────────────────────────────────────────────────

function demoNonMutating() {
  clearOutput();
  print("── 6. Non-mutating: slice, concat, join, indexOf, includes ──");

  const nums = [10, 20, 30, 40, 50];
  print("original array", nums);

  // slice
  print("slice(1, 3)", nums.slice(1, 3));
  print("slice(2)", nums.slice(2));
  print("slice(-2) (last two)", nums.slice(-2));
  print("slice() (full copy)", nums.slice());
  print("original after slice", nums); // unchanged

  // concat
  const a = [1, 2, 3];
  const b = [4, 5, 6];
  print("concat", a.concat(b));
  print("concat multiple", a.concat(b, [7, 8], 9));
  print("original a after concat", a); // unchanged

  // join
  const words = ["Hello", "world", "from", "JS"];
  print('join(" ")', words.join(" "));
  print('join(", ")', words.join(", "));
  print('join("-")', words.join("-"));

  // indexOf / lastIndexOf
  const arr = [10, 20, 30, 20, 10];
  print("indexOf(20)", arr.indexOf(20));
  print("lastIndexOf(20)", arr.lastIndexOf(20));
  print("indexOf(99) — not found", arr.indexOf(99));

  // includes
  const fruits = ["apple", "banana", "cherry"];
  print('includes("banana")', fruits.includes("banana"));
  print('includes("grape")', fruits.includes("grape"));

  console.log("nums (unchanged):", nums);
}
