// ============================================================
// STRUCTURAL DESIGN PATTERNS
// ============================================================
// Patterns about composing objects/classes into larger structures
// while keeping them flexible and efficient.
// ============================================================


// ─────────────────────────────────────────────
// 1. DECORATOR
// Dynamically adds behavior to an object without
// altering its class.
// ─────────────────────────────────────────────

class Coffee {
  cost()        { return 2.00; }
  description() { return 'Basic Coffee'; }
}

class MilkDecorator {
  constructor(coffee) { this._coffee = coffee; }
  cost()        { return this._coffee.cost() + 0.50; }
  description() { return this._coffee.description() + ', Milk'; }
}

class SyrupDecorator {
  constructor(coffee) { this._coffee = coffee; }
  cost()        { return this._coffee.cost() + 0.75; }
  description() { return this._coffee.description() + ', Caramel Syrup'; }
}

class WhipDecorator {
  constructor(coffee) { this._coffee = coffee; }
  cost()        { return this._coffee.cost() + 0.60; }
  description() { return this._coffee.description() + ', Whipped Cream'; }
}

class VanillaDecorator {
  constructor(coffee) { this._coffee = coffee; }
  cost()        { return this._coffee.cost() + 0.50; }
  description() { return this._coffee.description() + ', Vanilla'; }
}

// Exposed to HTML buttons
function orderCoffee(type) {
  let drink = new Coffee();

  if (type === 'milk')       drink = new MilkDecorator(drink);
  if (type === 'syrup-milk') { drink = new SyrupDecorator(drink); drink = new MilkDecorator(drink); }
  if (type === 'full')       {
    drink = new MilkDecorator(drink);
    drink = new SyrupDecorator(drink);
    drink = new WhipDecorator(drink);
    drink = new VanillaDecorator(drink);
  }

  const result = `${drink.description()}\nTotal: $${drink.cost().toFixed(2)}`;
  document.getElementById('decorator-output').textContent = result;
  console.log('[Decorator]', result);
}


// ─────────────────────────────────────────────
// 2. ADAPTER
// Translates one interface into another that
// a client expects. Bridges incompatible interfaces.
// ─────────────────────────────────────────────

// Existing (legacy) system — cannot be changed
class LegacyPaymentGateway {
  processTransaction(amountInCents, cardToken) {
    // Simulates legacy API
    console.log(`[Legacy] Processing ${amountInCents} cents with token: ${cardToken}`);
    return {
      status: 'OK',
      legacyRef: `LEG-${Math.floor(Math.random() * 100000)}`,
      amountProcessed: amountInCents,
    };
  }
}

// New system expects: pay({ amount (dollars), currency, card })
class ModernPaymentAdapter {
  constructor(legacyGateway) {
    this._gateway = legacyGateway;
  }

  // Modern interface — adapts to legacy internally
  pay({ amount, currency, card }) {
    const rates = { USD: 1, EUR: 1.10, GBP: 1.27 };
    const rate = rates[currency] ?? 1;
    const amountInUSD = amount * rate;
    const amountInCents = Math.round(amountInUSD * 100);

    const result = this._gateway.processTransaction(amountInCents, card);

    return {
      transactionId: result.legacyRef,
      status: result.status === 'OK' ? 'success' : 'failed',
      chargedAmount: `$${(result.amountProcessed / 100).toFixed(2)}`,
    };
  }
}

function runAdapter() {
  const legacy = new LegacyPaymentGateway();
  const adapter = new ModernPaymentAdapter(legacy);

  const result = adapter.pay({ amount: 49.99, currency: 'EUR', card: 'tok_abc123' });

  const output =
    `Payment via Adapter:\n` +
    `  Transaction ID: ${result.transactionId}\n` +
    `  Status: ${result.status}\n` +
    `  Charged: ${result.chargedAmount} (EUR converted to USD)`;

  document.getElementById('adapter-output').textContent = output;
  console.log('[Adapter] Result:', result);
}


// ─────────────────────────────────────────────
// 3. FACADE
// Provides a simple interface to a complex subsystem.
// Hides the complexity behind a single easy-to-use API.
// ─────────────────────────────────────────────

// Complex subsystems (clients shouldn't need to know these)
class AudioEngine {
  initialize(sampleRate) { return `Audio @ ${sampleRate}Hz initialized`; }
  setVolume(level)       { return `Volume → ${level}%`; }
  loadAudioTrack(file)   { return `Audio track loaded: ${file}`; }
}

class VideoEngine {
  initialize(resolution) { return `Video @ ${resolution} initialized`; }
  applyColorProfile(p)   { return `Color profile applied: ${p}`; }
  loadVideoFile(file)    { return `Video file loaded: ${file}`; }
}

class SubtitleEngine {
  load(file)   { return `Subtitles loaded: ${file}`; }
  enable()     { return `Subtitles: ON`; }
}

class BufferingSystem {
  setBufferSize(mb) { return `Buffer set: ${mb}MB`; }
  startPreload()    { return `Preloading stream...`; }
}

// FACADE — single simple interface to all subsystems
class MediaPlayer {
  constructor() {
    this._audio    = new AudioEngine();
    this._video    = new VideoEngine();
    this._subtitle = new SubtitleEngine();
    this._buffer   = new BufferingSystem();
    this._logs     = [];
  }

  _log(msg) { this._logs.push(msg); console.log('[Facade]', msg); }

  play(videoFile, { subtitles = null, volume = 80, resolution = '1080p' } = {}) {
    this._logs = [];
    this._log(this._buffer.setBufferSize(32));
    this._log(this._buffer.startPreload());
    this._log(this._audio.initialize(48000));
    this._log(this._video.initialize(resolution));
    this._log(this._audio.setVolume(volume));
    this._log(this._video.applyColorProfile('sRGB'));
    this._log(this._video.loadVideoFile(videoFile));
    this._log(this._audio.loadAudioTrack(videoFile));
    if (subtitles) {
      this._log(this._subtitle.load(subtitles));
      this._log(this._subtitle.enable());
    }
    this._log(`▶ Playing: ${videoFile}`);
    return this._logs;
  }
}

function playMedia() {
  const player = new MediaPlayer();
  const logs = player.play('inception.mp4', { subtitles: 'inception.srt', volume: 90 });
  document.getElementById('facade-output').textContent = logs.join('\n');
}


// ─────────────────────────────────────────────
// 4. PROXY
// A proxy intercepts operations (get, set, call, etc.)
// on a target object. Used for validation, caching,
// logging, access control, lazy initialization.
// ─────────────────────────────────────────────

function createValidatedInventory(initialStock) {
  const logs = [];

  const handler = {
    get(target, prop) {
      if (prop === 'getLogs') return () => logs;
      if (!(prop in target)) {
        throw new ReferenceError(`Product "${prop}" does not exist in inventory`);
      }
      logs.push(`[GET] ${prop} = ${target[prop]}`);
      return target[prop];
    },
    set(target, prop, value) {
      if (typeof value !== 'number') {
        throw new TypeError(`Stock for "${prop}" must be a number, got ${typeof value}`);
      }
      if (value < 0) {
        throw new RangeError(`Stock for "${prop}" cannot be negative (got ${value})`);
      }
      logs.push(`[SET] ${prop}: ${target[prop] ?? 'NEW'} → ${value}`);
      target[prop] = value;
      return true;
    }
  };

  return new Proxy({ ...initialStock }, handler);
}

function runProxy() {
  const inventory = createValidatedInventory({ apples: 10, oranges: 5, bananas: 8 });
  const results = [];

  // Valid reads
  results.push(`apples: ${inventory.apples}`);
  results.push(`oranges: ${inventory.oranges}`);

  // Valid update
  inventory.bananas = 20;
  results.push(`bananas after update: ${inventory.bananas}`);

  // Add new item
  inventory.grapes = 15;
  results.push(`grapes (new): ${inventory.grapes}`);

  // Invalid operations (caught)
  try {
    inventory.apples = -5;
  } catch (e) {
    results.push(`Error: ${e.message}`);
  }

  try {
    inventory.mangoes; // doesn't exist
  } catch (e) {
    results.push(`Error: ${e.message}`);
  }

  results.push('\n--- Proxy Access Log ---');
  results.push(...inventory.getLogs());

  document.getElementById('proxy-output').textContent = results.join('\n');
  console.log('[Proxy] Operations logged:', inventory.getLogs());
}
