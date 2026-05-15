// ============================================================
// Example 4: ES6 Classes — Syntactic Sugar over Prototypes
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// PART 1: Basic Class Anatomy
// ----------------------------------------------------------

class Animal {
  // Class field (ES2022) — instance property with a default value
  isAlive = true;

  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
  }

  // Instance method — placed on Animal.prototype
  speak() {
    return `${this.name} says: ${this.sound}`;
  }

  // Getter — accessed as a property, not called as a function
  get info() {
    return `[${this.constructor.name}: ${this.name}]`;
  }

  // Static method — belongs to Animal class itself, not instances
  static compare(a, b) {
    return a.name.localeCompare(b.name);
  }
}

const cat  = new Animal('Whiskers', 'Meow');
const crow = new Animal('Shadow',   'Caw');

console.log(cat.speak());           // "Whiskers says: Meow"
console.log(cat.info);              // "[Animal: Whiskers]"
console.log(Animal.compare(cat, crow)); // positive number (W > S alphabetically)

// Class methods ARE on the prototype:
console.log(cat.speak === crow.speak); // true (shared via prototype)

// ----------------------------------------------------------
// PART 2: Inheritance with `extends` and `super`
// ----------------------------------------------------------

class Dog extends Animal {
  #tricks = []; // private field — only accessible inside Dog

  constructor(name, breed) {
    super(name, 'Woof'); // must call super before accessing `this`
    this.breed = breed;
  }

  learnTrick(trick) {
    this.#tricks.push(trick);
    return this;            // enable method chaining
  }

  perform() {
    if (this.#tricks.length === 0) return `${this.name} knows no tricks yet`;
    return `${this.name} performs: ${this.#tricks.join(', ')}`;
  }

  // Override parent's speak and extend it
  speak() {
    return `${super.speak()} (tail wagging)`;
  }

  get info() {
    return `${super.info} [${this.breed}]`;
  }
}

const rex = new Dog('Rex', 'German Shepherd');

console.log(rex.speak());    // "Rex says: Woof (tail wagging)"
console.log(rex.info);       // "[Dog: Rex] [German Shepherd]"
console.log(rex.isAlive);    // true (inherited class field)
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true

// Method chaining
rex.learnTrick('sit').learnTrick('shake').learnTrick('roll over');
console.log(rex.perform()); // "Rex performs: sit, shake, roll over"

// ----------------------------------------------------------
// PART 3: Static Methods and Properties
// ----------------------------------------------------------

class IdGenerator {
  static #counter = 0; // private static field

  static next() {
    return ++IdGenerator.#counter;
  }

  static reset() {
    IdGenerator.#counter = 0;
  }
}

console.log(IdGenerator.next()); // 1
console.log(IdGenerator.next()); // 2
console.log(IdGenerator.next()); // 3
IdGenerator.reset();
console.log(IdGenerator.next()); // 1

// ----------------------------------------------------------
// PART 4: Mixins — composing behavior without deep inheritance
// Mixins solve the "diamond problem" and encourage composition over inheritance.
// ----------------------------------------------------------

// Mixin factories — functions that extend a class with additional behavior
const Serializable = (Base) => class extends Base {
  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(json) {
    return Object.assign(new this(), JSON.parse(json));
  }
};

const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date().toISOString();
  }
};

class User extends Timestamped(Serializable(Animal)) {
  constructor(name, email) {
    super(name, 'Hello');
    this.email = email;
  }
}

const alice = new User('Alice', 'alice@example.com');
console.log(alice.speak());       // "Alice says: Hello"
console.log(alice.createdAt);     // ISO date string
console.log(alice.serialize());   // JSON string with all properties

// ----------------------------------------------------------
// PART 5: Abstract-like base class pattern
// JavaScript has no built-in `abstract` keyword, but we can enforce it.
// ----------------------------------------------------------

class Shape {
  constructor(color = 'black') {
    if (new.target === Shape) {
      throw new Error('Shape is abstract — cannot instantiate directly');
    }
    this.color = color;
  }

  // "Abstract" method — must be overridden
  area() {
    throw new Error(`${this.constructor.name} must implement area()`);
  }

  toString() {
    return `${this.constructor.name}(color=${this.color}, area=${this.area().toFixed(2)})`;
  }
}

class Circle extends Shape {
  constructor(radius, color) {
    super(color);
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(w, h, color) {
    super(color);
    this.width = w;
    this.height = h;
  }
  area() { return this.width * this.height; }
}

const shapes = [new Circle(5, 'red'), new Rectangle(4, 6, 'blue')];
shapes.forEach(s => console.log(s.toString()));
// Circle(color=red, area=78.54)
// Rectangle(color=blue, area=24.00)

try {
  new Shape(); // throws
} catch (e) {
  console.log(e.message); // "Shape is abstract..."
}
