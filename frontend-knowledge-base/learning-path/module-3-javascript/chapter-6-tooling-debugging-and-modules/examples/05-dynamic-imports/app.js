// app.js — Entry point for dynamic imports demo
// type="module" in index.html enables import() syntax.
// ============================================================

// ---- Scenario 1: Load a heavy feature on demand ----

let chartLoaded = false;

window.loadChartFeature = async function () {
  const btn = document.getElementById('load-chart-btn');
  const container = document.getElementById('chart-container');
  const output = document.getElementById('chart-output');

  if (chartLoaded) {
    output.textContent = 'Chart module was already loaded — not fetched again.';
    return;
  }

  btn.disabled = true;
  container.textContent = 'Loading module...';

  console.time('chart-module-load');

  try {
    // Dynamic import — the module is fetched NOW (not at page load)
    // Open the Network tab to see the request happen here
    const { renderChart } = await import('./modules/heavy-chart.js');

    console.timeEnd('chart-module-load');
    chartLoaded = true;

    // Render the chart into the container
    renderChart(container);

    output.style.display = 'block';
    output.textContent =
      'heavy-chart.js was loaded lazily.\n' +
      'On subsequent clicks it would NOT be fetched again\n' +
      '(browser caches the module).';
  } catch (err) {
    container.textContent = `Failed to load: ${err.message}`;
    console.error('Dynamic import failed:', err);
    btn.disabled = false;
  }
};

// ---- Scenario 2: Conditional module loading by theme name ----

const loadedThemes = {};

window.applyTheme = async function () {
  const select = document.getElementById('theme-select');
  const output = document.getElementById('theme-output');
  const themeName = select.value;

  output.textContent = `Loading theme: ${themeName}...`;

  try {
    // Guard against path traversal if this were user input:
    // In a real app, always validate against an allowlist.
    const ALLOWED_THEMES = ['default', 'dark', 'high-contrast'];
    if (!ALLOWED_THEMES.includes(themeName)) {
      throw new Error('Invalid theme name');
    }

    // Only load each theme once — cache the module reference
    if (!loadedThemes[themeName]) {
      // Template literal in import() — module path is computed at runtime
      loadedThemes[themeName] = await import(`./modules/themes/${themeName}.js`);
      console.log(`Fetched theme module: ${themeName}.js`);
    } else {
      console.log(`Using cached theme module: ${themeName}`);
    }

    const theme = loadedThemes[themeName];
    theme.apply();

    output.textContent =
      `Theme "${themeName}" applied.\n` +
      `Colors: bg=${theme.colors.background}, text=${theme.colors.text}`;
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
    output.style.color = '#f38ba8';
    console.error('Theme load error:', err);
  }
};

// ---- Scenario 3: Route-based code splitting ----

const loadedPages = {};

window.navigateTo = async function (route) {
  const output = document.getElementById('route-output');
  output.textContent = `Navigating to "${route}"...`;
  output.style.color = '#f9e2af';

  const ROUTES = {
    home: './modules/pages/home.js',
    about: './modules/pages/about.js',
    contact: './modules/pages/contact.js',
  };

  const modulePath = ROUTES[route];
  if (!modulePath) {
    output.textContent = '404 — Page not found';
    output.style.color = '#f38ba8';
    return;
  }

  try {
    // Load the page module on demand — only when the user navigates to it
    if (!loadedPages[route]) {
      loadedPages[route] = await import(modulePath);
      console.log(`Loaded page module: ${route}`);
    }

    const page = loadedPages[route];
    const content = page.render();
    output.textContent = content;
    output.style.color = '#a6e3a1';
  } catch (err) {
    output.textContent = `Error loading page: ${err.message}`;
    output.style.color = '#f38ba8';
    console.error('Route load error:', err);
  }
};

// ---- Scenario 4: import() with .then() (Promise style) ----

window.runPromiseStyle = function () {
  const output = document.getElementById('promise-output');
  output.textContent = 'Loading...';

  // import() returns a Promise — you can chain .then() and .catch()
  import('./modules/utils.js')
    .then((module) => {
      const result = module.formatCurrency(1234567.89, 'USD');
      const words = module.wordCount('Hello world, this is a test sentence.');

      output.textContent =
        `formatCurrency(1234567.89, 'USD') → ${result}\n` +
        `wordCount('Hello world, this is a test sentence.') → ${words} words`;
    })
    .catch((err) => {
      output.textContent = `Import failed: ${err.message}`;
      output.style.color = '#f38ba8';
    });
};
