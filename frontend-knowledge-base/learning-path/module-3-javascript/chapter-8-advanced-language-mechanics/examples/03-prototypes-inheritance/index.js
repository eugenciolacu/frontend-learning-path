// ============================================================
// Example 3: Prototypes and Prototypal Inheritance
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// PART 1: The Prototype Chain
// Every object has an internal [[Prototype]] link.
// Property lookups climb this chain until found or null reached.
// ----------------------------------------------------------

const animal = {
  type: 'Animal',
  breathe() {
    console.log(`${this.name || this.type} is breathing`);
  }
};

// Create `dog` with `animal` as its prototype
const dog = Object.create(animal);
dog.name = 'Rex';
dog.bark = function() {
  console.log(`${this.name} says: Woof!`);
};

dog.bark();    // "Rex says: Woof!"  — own property
dog.breathe(); // "Rex is breathing" — from prototype (animal)

// Inspecting the chain
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty('name'));             // true
console.log(dog.hasOwnProperty('breathe'));          // false (inherited)
console.log('breathe' in dog);                       // true (in chain)

// ----------------------------------------------------------
// PART 2: Constructor Functions (pre-ES6 style)
// Demonstrates that classes are just syntactic sugar.
// ----------------------------------------------------------

function Vehicle(make, model, year) {
  this.make  = make;
  this.model = model;
  this.year  = year;
}

// Methods on the prototype — shared across ALL instances (memory-efficient)
Vehicle.prototype.describe = function() {
  return `${this.year} ${this.make} ${this.model}`;
};

Vehicle.prototype.toString = function() {
  return `[Vehicle: ${this.describe()}]`;
};

function Car(make, model, year, doors) {
  Vehicle.call(this, make, model, year); // call parent constructor
  this.doors = doors;
}

// Set up inheritance: Car.prototype → Vehicle.prototype
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car; // repair constructor reference

Car.prototype.describe = function() {
  // Call parent's describe via the prototype chain
  const base = Vehicle.prototype.describe.call(this);
  return `${base} (${this.doors}-door)`;
};

const myCar = new Car('Toyota', 'Camry', 2023, 4);

console.log(myCar.describe());           // "2023 Toyota Camry (4-door)"
console.log(myCar instanceof Car);       // true
console.log(myCar instanceof Vehicle);   // true
console.log(myCar.constructor === Car);  // true

// ----------------------------------------------------------
// PART 3: Object.create() patterns
// ----------------------------------------------------------

const baseRepo = {
  find(id) { return `Finding ${this.name} #${id}`; },
  save(entity) { return `Saving ${this.name}: ${JSON.stringify(entity)}`; }
};

const userRepo = Object.create(baseRepo);
userRepo.name = 'User';
userRepo.findByEmail = function(email) {
  return `Finding user by email: ${email}`;
};

console.log(userRepo.find(42));                  // "Finding User #42"
console.log(userRepo.findByEmail('a@b.com'));    // "Finding user by email: a@b.com"

// ----------------------------------------------------------
// PART 4: Prototype chain inspection utilities
// ----------------------------------------------------------

function printChain(obj, label = 'obj') {
  let current = obj;
  let depth = 0;
  while (current !== null) {
    const name = current.constructor?.name || 'null';
    const ownKeys = Object.getOwnPropertyNames(current).join(', ');
    console.log(`  [${'→'.repeat(depth || 1)} depth ${depth}] ${name} — own props: [${ownKeys}]`);
    current = Object.getPrototypeOf(current);
    depth++;
  }
}

console.log('\nPrototype chain of myCar:');
printChain(myCar, 'myCar');
// Car (own: make, model, year, doors)
// → Vehicle.prototype (own: describe, toString)
// → Object.prototype (own: hasOwnProperty, ...)
// → null
