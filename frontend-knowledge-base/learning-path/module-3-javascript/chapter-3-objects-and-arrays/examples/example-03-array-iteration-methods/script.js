/**
 * Example 03 – Array Iteration Methods
 *
 * Demonstrates:
 *  - forEach   — side effects, no return value
 *  - map       — transform each element into a new array
 *  - filter    — keep elements that pass a test
 *  - reduce    — accumulate to a single value
 *  - find      — first matching element
 *  - findIndex — index of first matching element
 *  - some      — true if at least one element passes
 *  - every     — true if all elements pass
 *  - flat      — flatten nested arrays
 *  - flatMap   — map + flatten in one step
 *  - Chaining multiple methods into a data pipeline
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

// ─── Shared dataset ──────────────────────────────────────────────────────────

const employees = [
  { id: 1, name: "Alice",   dept: "Engineering", salary: 90000, active: true  },
  { id: 2, name: "Bob",     dept: "Design",      salary: 75000, active: true  },
  { id: 3, name: "Carol",   dept: "Engineering", salary: 110000, active: true  },
  { id: 4, name: "Dave",    dept: "Engineering", salary: 85000, active: false },
  { id: 5, name: "Eve",     dept: "Design",      salary: 80000, active: true  },
  { id: 6, name: "Frank",   dept: "HR",          salary: 65000, active: true  },
];

// ─── 1. forEach ──────────────────────────────────────────────────────────────

function demoForEach() {
  clearOutput();
  print("── 1. forEach ──");
  print("(forEach returns undefined — used for side effects only)");
  print("──");

  const prices = [10, 25, 50, 75, 100];

  prices.forEach((price, index) => {
    print(`  item ${index + 1}`, `$${price}`);
  });

  // forEach does NOT return a new array
  const result = prices.forEach(p => p * 2);
  print("return value of forEach", result); // undefined

  console.log("prices (unchanged):", prices);
}

// ─── 2. map ──────────────────────────────────────────────────────────────────

function demoMap() {
  clearOutput();
  print("── 2. map ──");

  const numbers = [1, 2, 3, 4, 5];

  // Simple transform
  const doubled = numbers.map(n => n * 2);
  print("doubled", doubled);
  print("original unchanged", numbers);

  // Transform objects
  const names = employees.map(e => e.name);
  print("extract names", names);

  // Add computed property
  const withBonus = employees.map(e => ({
    name: e.name,
    salary: e.salary,
    bonus: Math.round(e.salary * 0.1),
  }));
  print("with 10% bonus calculated", withBonus.map(e => `${e.name}: $${e.bonus}`));

  // map index usage
  const indexed = ["a", "b", "c"].map((val, i) => `${i + 1}. ${val}`);
  print("indexed", indexed);

  console.log("withBonus:", withBonus);
}

// ─── 3. filter ───────────────────────────────────────────────────────────────

function demoFilter() {
  clearOutput();
  print("── 3. filter ──");

  const scores = [45, 72, 88, 30, 95, 61, 58, 77];

  const passing = scores.filter(s => s >= 60);
  print("scores >= 60", passing);

  const engineering = employees.filter(e => e.dept === "Engineering");
  print("Engineering employees", engineering.map(e => e.name));

  const activeHighEarners = employees.filter(e => e.active && e.salary >= 85000);
  print("active & salary >= 85k", activeHighEarners.map(e => e.name));

  // filter to remove falsy values from an array
  const mixed = [0, "hello", null, 42, "", undefined, true, false, "world"];
  const truthy = mixed.filter(Boolean);
  print("filter(Boolean) — remove falsy", truthy);

  console.log("passing scores:", passing);
}

// ─── 4. reduce ───────────────────────────────────────────────────────────────

function demoReduce() {
  clearOutput();
  print("── 4. reduce ──");

  const nums = [1, 2, 3, 4, 5];

  // Sum
  const sum = nums.reduce((acc, n) => acc + n, 0);
  print("sum", sum);

  // Product
  const product = nums.reduce((acc, n) => acc * n, 1);
  print("product", product);

  // Max
  const max = nums.reduce((acc, n) => (n > acc ? n : acc), -Infinity);
  print("max", max);

  // Count occurrences
  const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];
  const count = fruits.reduce((acc, fruit) => {
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
  }, {});
  print("count occurrences", count);

  // Total salary by department
  const salaryByDept = employees.reduce((acc, e) => {
    acc[e.dept] = (acc[e.dept] || 0) + e.salary;
    return acc;
  }, {});
  print("total salary by dept", salaryByDept);

  // Flatten with reduce (illustrative — use flat() in practice)
  const nested = [[1, 2], [3, 4], [5, 6]];
  const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
  print("flatten with reduce", flat);

  console.log("salaryByDept:", salaryByDept);
}

// ─── 5. find & findIndex ─────────────────────────────────────────────────────

function demoFind() {
  clearOutput();
  print("── 5. find & findIndex ──");

  // find — returns first matching element (or undefined)
  const found = employees.find(e => e.id === 3);
  print("find id === 3", found ? found.name : "not found");

  const notFound = employees.find(e => e.id === 99);
  print("find id === 99", notFound); // undefined

  // findIndex — returns first matching index (or -1)
  const idx = employees.findIndex(e => e.name === "Carol");
  print("findIndex name === Carol", idx);

  const notFoundIdx = employees.findIndex(e => e.name === "Zara");
  print("findIndex name === Zara", notFoundIdx); // -1

  // Practical: update an item in an array immutably
  const idx2 = employees.findIndex(e => e.id === 2);
  const updated = [
    ...employees.slice(0, idx2),
    { ...employees[idx2], salary: 80000 },
    ...employees.slice(idx2 + 1),
  ];
  print("Bob's salary after update", updated[idx2].salary);

  console.log("found employee:", found);
}

// ─── 6. some & every ─────────────────────────────────────────────────────────

function demoSomeEvery() {
  clearOutput();
  print("── 6. some & every ──");

  const ages = [16, 22, 30, 14, 25];

  // some — at least one
  print("some >= 18 (has adult)?", ages.some(a => a >= 18));
  print("some > 50?", ages.some(a => a > 50));

  // every — all
  print("every >= 18 (all adults)?", ages.every(a => a >= 18));
  print("every > 0?", ages.every(a => a > 0));

  // Practical: form validation
  const formFields = [
    { name: "email",    value: "alice@example.com" },
    { name: "password", value: "s3cr3t!" },
    { name: "username", value: "" }, // empty
  ];

  const allFilled = formFields.every(f => f.value.trim() !== "");
  print("all form fields filled?", allFilled);

  const hasEmpty = formFields.some(f => f.value.trim() === "");
  print("any empty fields?", hasEmpty);

  // Check if any employee is inactive
  print("any inactive employees?", employees.some(e => !e.active));
  print("all employees active?", employees.every(e => e.active));

  console.log("formFields:", formFields);
}

// ─── 7. flat & flatMap ───────────────────────────────────────────────────────

function demoFlat() {
  clearOutput();
  print("── 7. flat & flatMap ──");

  const nested = [1, [2, 3], [4, [5, 6]], [[[7]]]];

  print("flat() depth 1 (default)", nested.flat());
  print("flat(2)", nested.flat(2));
  print("flat(Infinity)", nested.flat(Infinity));
  print("original unchanged", nested);

  // flatMap — map then flatten by 1 level
  const sentences = ["Hello World", "Foo Bar", "Baz Qux"];
  const words = sentences.flatMap(s => s.split(" "));
  print("flatMap split sentences into words", words);

  // flatMap vs map — difference
  const withMap    = sentences.map(s => s.split(" "));
  const withFlatMap = sentences.flatMap(s => s.split(" "));
  print("map result (nested)", withMap);
  print("flatMap result (flat)", withFlatMap);

  // Remove elements with flatMap — return [] to skip
  const nums = [1, 2, 3, 4, 5, 6];
  const evenDoubled = nums.flatMap(n => (n % 2 === 0 ? [n * 2] : []));
  print("flatMap even & double", evenDoubled);

  console.log("words:", words);
}

// ─── 8. Chaining ─────────────────────────────────────────────────────────────

function demoPipeline() {
  clearOutput();
  print("── 8. Method Chaining (Pipeline) ──");
  print("Dataset: active Engineering employees, salary > 85k, sorted by name");
  print("──");

  const result = employees
    .filter(e => e.active)                          // step 1: only active
    .filter(e => e.dept === "Engineering")           // step 2: Engineering dept
    .filter(e => e.salary > 85000)                  // step 3: high earners
    .map(e => ({ name: e.name, salary: e.salary })) // step 4: pick fields
    .sort((a, b) => a.name.localeCompare(b.name));  // step 5: sort by name

  result.forEach(e => print(`  ${e.name}`, `$${e.salary.toLocaleString()}`));

  print("──");

  // Another pipeline: total payroll for active employees
  const totalPayroll = employees
    .filter(e => e.active)
    .reduce((sum, e) => sum + e.salary, 0);

  print("Total active payroll", `$${totalPayroll.toLocaleString()}`);

  // Department summary
  const deptSummary = Object.fromEntries(
    Object.entries(
      employees.reduce((acc, e) => {
        if (!acc[e.dept]) acc[e.dept] = { count: 0, total: 0 };
        acc[e.dept].count += 1;
        acc[e.dept].total += e.salary;
        return acc;
      }, {})
    ).map(([dept, data]) => [dept, { ...data, avg: Math.round(data.total / data.count) }])
  );

  print("──");
  print("Department summary", deptSummary);

  console.log("pipeline result:", result);
  console.log("deptSummary:", deptSummary);
}
