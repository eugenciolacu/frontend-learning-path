// ============================================================
// CREATIONAL DESIGN PATTERNS
// ============================================================
// Patterns that deal with object creation mechanisms.
// Goal: create objects in a manner suitable to the situation.
// ============================================================

// ─────────────────────────────────────────────
// 1. SINGLETON
// Ensures a class has only ONE instance.
// ─────────────────────────────────────────────

class AppConfig {
  constructor() {
    if (AppConfig._instance) {
      // Return the existing instance instead of creating a new one
      return AppConfig._instance;
    }
    this.theme = 'light';
    this.language = 'en';
    this.apiBaseUrl = 'https://api.example.com';
    AppConfig._instance = this;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  getTheme() {
    return this.theme;
  }
}

console.group('1. SINGLETON');

const config1 = new AppConfig();
const config2 = new AppConfig();

config1.setTheme('dark');

console.log('config1 === config2:', config1 === config2); // true — same instance
console.log('config2.theme via config1.setTheme:', config2.getTheme()); // 'dark'
console.log('Initial language:', config1.language); // 'en'

console.groupEnd();

// Display result
document.getElementById('singleton-output').textContent =
  `config1 === config2: ${config1 === config2}\n` +
  `config2.theme (set via config1): ${config2.getTheme()}\n` +
  `Both point to the same object in memory.`;


// ─────────────────────────────────────────────
// 2. FACTORY
// Creates objects without specifying exact class.
// ─────────────────────────────────────────────

class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'Car';
    this.doors = 4;
  }
  describe() {
    return `${this.type}: ${this.make} ${this.model} (${this.doors} doors)`;
  }
}

class Truck {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'Truck';
    this.hasCargoBed = true;
  }
  describe() {
    return `${this.type}: ${this.make} ${this.model} (cargo bed: ${this.hasCargoBed})`;
  }
}

class Motorcycle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'Motorcycle';
    this.wheels = 2;
  }
  describe() {
    return `${this.type}: ${this.make} ${this.model} (${this.wheels} wheels)`;
  }
}

// The Factory function — centralizes creation logic
function VehicleFactory(type, make, model) {
  const vehicleMap = { Car, Truck, Motorcycle };
  const VehicleClass = vehicleMap[type];
  if (!VehicleClass) {
    throw new Error(`Unknown vehicle type: "${type}". Valid types: ${Object.keys(vehicleMap).join(', ')}`);
  }
  return new VehicleClass(make, model);
}

console.group('2. FACTORY');

const vehicles = [
  VehicleFactory('Car', 'Toyota', 'Corolla'),
  VehicleFactory('Truck', 'Ford', 'F-150'),
  VehicleFactory('Motorcycle', 'Honda', 'CBR600'),
];

vehicles.forEach(v => console.log(v.describe()));

try {
  VehicleFactory('Spaceship', 'NASA', 'Apollo'); // should throw
} catch (e) {
  console.error('Error caught:', e.message);
}

console.groupEnd();

document.getElementById('factory-output').textContent =
  vehicles.map(v => v.describe()).join('\n') +
  '\n\nTrying unknown type "Spaceship" → throws Error (check console)';


// ─────────────────────────────────────────────
// 3. BUILDER
// Constructs complex objects step by step.
// Enables method chaining (fluent interface).
// ─────────────────────────────────────────────

class PizzaBuilder {
  constructor(size) {
    this.size = size;
    this.crust = 'thin';
    this.sauce = 'tomato';
    this.toppings = [];
    this.extraCheese = false;
  }

  withCrust(crust) {
    this.crust = crust;
    return this; // returns `this` for chaining
  }

  withSauce(sauce) {
    this.sauce = sauce;
    return this;
  }

  addTopping(topping) {
    this.toppings.push(topping);
    return this;
  }

  withExtraCheese() {
    this.extraCheese = true;
    return this;
  }

  build() {
    return {
      size: this.size,
      crust: this.crust,
      sauce: this.sauce,
      toppings: this.toppings,
      extraCheese: this.extraCheese,
      toString() {
        return (
          `🍕 ${this.size.toUpperCase()} pizza\n` +
          `   Crust: ${this.crust}\n` +
          `   Sauce: ${this.sauce}\n` +
          `   Toppings: ${this.toppings.join(', ') || 'plain'}\n` +
          `   Extra cheese: ${this.extraCheese ? 'Yes' : 'No'}`
        );
      }
    };
  }
}

console.group('3. BUILDER');

const veggiePizza = new PizzaBuilder('medium')
  .withCrust('thick')
  .withSauce('pesto')
  .addTopping('mushrooms')
  .addTopping('bell peppers')
  .addTopping('olives')
  .build();

const meatLoversPizza = new PizzaBuilder('large')
  .withCrust('stuffed')
  .withSauce('tomato')
  .addTopping('pepperoni')
  .addTopping('bacon')
  .addTopping('sausage')
  .withExtraCheese()
  .build();

console.log(veggiePizza.toString());
console.log(meatLoversPizza.toString());

console.groupEnd();

document.getElementById('builder-output').textContent =
  veggiePizza.toString() + '\n\n' + meatLoversPizza.toString();


// ─────────────────────────────────────────────
// 4. PROTOTYPE
// Creates new objects by cloning an existing one.
// JavaScript's native inheritance IS prototype-based.
// ─────────────────────────────────────────────

const shapePrototype = {
  getArea() {
    throw new Error('getArea() must be implemented');
  },
  describe() {
    return `I am a ${this.name} with area = ${this.getArea().toFixed(2)}`;
  },
  clone() {
    return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
  }
};

const circleProto = Object.create(shapePrototype);
circleProto.name = 'Circle';
circleProto.getArea = function () {
  return Math.PI * this.radius ** 2;
};

const rectangleProto = Object.create(shapePrototype);
rectangleProto.name = 'Rectangle';
rectangleProto.getArea = function () {
  return this.width * this.height;
};

// Factory using prototypes
function createCircle(radius) {
  const circle = Object.create(circleProto);
  circle.radius = radius;
  return circle;
}

function createRectangle(width, height) {
  const rect = Object.create(rectangleProto);
  rect.width = width;
  rect.height = height;
  return rect;
}

console.group('4. PROTOTYPE');

const c1 = createCircle(5);
const c2 = createCircle(10);
const r1 = createRectangle(4, 6);
const c1Clone = c1.clone();
c1Clone.radius = 7; // modify the clone

console.log(c1.describe());     // Circle, area = 78.54
console.log(c2.describe());     // Circle, area = 314.16
console.log(r1.describe());     // Rectangle, area = 24.00
console.log(c1Clone.describe()); // Circle, area = 153.94 (clone with new radius)
console.log('c1 radius unchanged:', c1.radius); // 5 — original untouched

// Verify prototype chain
console.log('c1 proto === circleProto:', Object.getPrototypeOf(c1) === circleProto);
console.log('circleProto proto === shapePrototype:', Object.getPrototypeOf(circleProto) === shapePrototype);

console.groupEnd();

document.getElementById('prototype-output').textContent =
  [c1, c2, r1, c1Clone].map(s => s.describe()).join('\n') +
  `\n\nOriginal c1.radius: ${c1.radius} (unchanged after clone mutation)` +
  `\nc1Clone.radius: ${c1Clone.radius} (modified on clone)`;
