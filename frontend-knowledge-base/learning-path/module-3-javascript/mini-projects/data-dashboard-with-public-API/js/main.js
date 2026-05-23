/**
 * js/main.js
 *
 * Application entry point.
 * Orchestrates data fetching, state management, and event handling.
 *
 * Concepts from the module:
 *  Chapter 1 – Variables: const, let; data types; operators
 *  Chapter 2 – Functions (declarations + arrow), conditionals
 *  Chapter 4 – addEventListener, event delegation via closest()
 *  Chapter 5 – async/await, try/catch/finally
 *  Chapter 6 – ES Modules (import), console.log, console.error, console.table
 */

// ─── Chapter 6: Named imports from sibling modules ───────────────────────────
import { fetchAllCountries } from './api.js';
import { getUniqueRegions, computeStats, applyFilters } from './utils.js';
import {
  showLoading,
  showError,
  hideError,
  renderStats,
  populateRegionFilter,
  renderCards,
  openModal,
} from './render.js';

// ─── Application state ────────────────────────────────────────────────────────

// Chapter 1: let — will be reassigned once the fetch resolves
let allCountries = [];

// Chapter 1: const — the object reference never changes; its properties do
const filterState = {
  search: '',
  region: '',
  sortBy: 'name',
};

// ─── Core update function ─────────────────────────────────────────────────────

/**
 * Re-filter and re-sort allCountries, then update the card grid.
 * Called every time a filter control changes.
 *
 * Chapter 2: named function declaration.
 * Chapter 3: applyFilters() uses filter() + sort() internally.
 */
function update() {
  const visible = applyFilters(allCountries, filterState);
  renderCards(visible);
}

// ─── Initialisation ───────────────────────────────────────────────────────────

/**
 * Bootstrap the application:
 *  1. Show the loading overlay.
 *  2. Fetch all countries from the API.
 *  3. Compute stats, populate controls, render cards.
 *  4. Hide the overlay regardless of success or failure.
 *
 * Chapter 5: async function, await, try / catch / finally.
 */
async function init() {
  showLoading(true);
  hideError();

  try {
    // Chapter 5: await suspends this function until the Promise settles.
    // If the Promise rejects (network error or non-2xx), execution jumps
    // to the catch block.
    allCountries = await fetchAllCountries();

    // Chapter 3: computeStats uses reduce() and find() internally
    const stats = computeStats(allCountries);
    renderStats(stats);

    // Chapter 3: getUniqueRegions uses map + filter + Set + spread
    const regions = getUniqueRegions(allCountries);
    populateRegionFilter(regions);

    // Initial card render, sorted alphabetically by default
    update();

    // Chapter 6: console.table — display a formatted sample in DevTools
    // to make it easy to inspect the data shape during development.
    console.table(
      allCountries.slice(0, 5).map(({ name, region, population, area }) => ({
        name: name.common,
        region,
        population,
        area,
      }))
    );

  } catch (err) {
    // Chapter 5: catch handles both rejected Promises (network failures)
    // and Error objects thrown explicitly by api.js (HTTP errors).
    console.error('[main] Initialisation error:', err);
    showError(
      `Could not load data: ${err.message}. ` +
      'Please check your internet connection and refresh the page.'
    );

  } finally {
    // Chapter 5: finally always runs — spinner is hidden whether the fetch
    // succeeded or failed, so the user is never stuck staring at it.
    showLoading(false);
  }
}

// ─── Filter control events ────────────────────────────────────────────────────
// Chapter 4: addEventListener — attach handlers to the three control elements.

// Search input — fires on every keystroke
document.getElementById('search').addEventListener('input', (e) => {
  filterState.search = e.target.value;
  update();
});

// Region dropdown — fires when a new option is selected
document.getElementById('region-filter').addEventListener('change', (e) => {
  filterState.region = e.target.value;
  update();
});

// Sort dropdown — fires when a new option is selected
document.getElementById('sort-by').addEventListener('change', (e) => {
  filterState.sortBy = e.target.value;
  update();
});

// Clear-filters button — resets all controls and state
document.getElementById('clear-filters').addEventListener('click', () => {
  // Chapter 1: reset all properties of filterState
  filterState.search = '';
  filterState.region = '';
  filterState.sortBy = 'name';

  // Chapter 4: update DOM control values to reflect the reset
  document.getElementById('search').value          = '';
  document.getElementById('region-filter').value   = '';
  document.getElementById('sort-by').value         = 'name';

  update();
});

// ─── Card-grid event delegation ───────────────────────────────────────────────

/**
 * A single listener on the grid handles clicks on every card inside it.
 *
 * Chapter 4: Event delegation — instead of attaching one listener per card
 * (which would require re-attaching every time renderCards() runs), we
 * attach one listener to the stable parent container.  When a click
 * bubbles up, event.target.closest() walks up the DOM tree from the
 * actual clicked element and returns the first ancestor that matches
 * the '.country-card' selector, or null if there isn't one.
 */
document.getElementById('cards-grid').addEventListener('click', (e) => {
  // Chapter 4: closest() — find the card ancestor (or null)
  const card = e.target.closest('.country-card');
  if (!card) return; // click was on the grid background

  const countryName = card.dataset.name; // Chapter 4: dataset

  // Chapter 3: find() — locate the matching object in allCountries
  const country = allCountries.find((c) => c.name.common === countryName);
  if (!country) return;

  openModal(country);
  console.log('[main] Opened detail for:', countryName); // Chapter 6
});

/**
 * Keyboard support for card grid — Enter or Space opens the modal.
 *
 * Chapter 4: keydown event listener; e.key for key identification.
 */
document.getElementById('cards-grid').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;

  const card = e.target.closest('.country-card');
  if (!card) return;

  e.preventDefault(); // prevent Space from scrolling the page

  const country = allCountries.find(
    (c) => c.name.common === card.dataset.name
  );
  if (country) openModal(country);
});

// ─── Start the application ────────────────────────────────────────────────────
init();
