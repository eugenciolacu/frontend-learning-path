/**
 * js/render.js
 *
 * All DOM read/write operations live here — no fetch logic, no business logic.
 * Keeping DOM code in one place makes it easy to update the UI independently
 * of how data is fetched or transformed.
 *
 * Concepts from the module:
 *  Chapter 4 – DOM selection, createElement, appendChild, innerHTML,
 *              textContent, classList, setAttribute, addEventListener
 *  Chapter 3 – map() to transform data arrays into HTML strings,
 *              Object.values() to extract object entries
 *  Chapter 6 – ES Modules (export), console.error
 */

import { formatNumber, formatArea } from './utils.js';

// ─── Element references ───────────────────────────────────────────────────────
// Chapter 4: query and cache elements once at module load time rather than
// querying the DOM on every render call.

const loadingOverlay = document.getElementById('loading-overlay');
const errorBanner    = document.getElementById('error-banner');
const statsGrid      = document.getElementById('stats-grid');
const cardsGrid      = document.getElementById('cards-grid');
const resultsCount   = document.getElementById('results-count');
const modal          = document.getElementById('detail-modal');
const modalBody      = document.getElementById('modal-body');
const modalClose     = document.getElementById('modal-close');

// ─── Loading state ────────────────────────────────────────────────────────────

/**
 * Show or hide the full-page loading overlay.
 *
 * Chapter 4: classList.toggle — adds 'hidden' when visible=false,
 *            removes it when visible=true.
 *
 * @param {boolean} visible
 */
export function showLoading(visible) {
  loadingOverlay.classList.toggle('hidden', !visible);
}

// ─── Error banner ─────────────────────────────────────────────────────────────

/**
 * Display an error message in the error banner.
 *
 * Chapter 4: element.textContent — safer than innerHTML for user-facing
 *            strings because it never interprets HTML tags.
 * Chapter 6: console.error for developer visibility.
 *
 * @param {string} message
 */
export function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove('hidden');
  console.error('[render] Error displayed to user:', message);
}

/**
 * Hide the error banner.
 * Chapter 4: classList.add
 */
export function hideError() {
  errorBanner.classList.add('hidden');
}

// ─── Stats row ────────────────────────────────────────────────────────────────

/**
 * Render the four summary stat cards.
 *
 * Chapter 4: element.innerHTML + template literal — write a block of HTML
 *            in one assignment instead of creating four elements individually.
 *
 * @param {{ total: number, totalPopulation: number, regions: number, mostPopulous: object }} stats
 */
export function renderStats({ total, totalPopulation, regions, mostPopulous }) {
  // Chapter 1: ternary + nullish coalescing for safe access
  const mostPopulousName = mostPopulous?.name?.common ?? '—';

  statsGrid.innerHTML = `
    <div class="stat-card">
      <span class="stat-value">${total.toLocaleString()}</span>
      <span class="stat-label">Countries</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${formatNumber(totalPopulation)}</span>
      <span class="stat-label">World Population</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${regions}</span>
      <span class="stat-label">Regions</span>
    </div>
    <div class="stat-card">
      <span class="stat-value" title="${mostPopulousName}">${mostPopulousName}</span>
      <span class="stat-label">Most Populous</span>
    </div>
  `;
}

// ─── Region filter ────────────────────────────────────────────────────────────

/**
 * Populate the region <select> with one <option> per region.
 *
 * Chapter 2: for...of loop to iterate over the regions array.
 * Chapter 4: createElement + appendChild — build each <option> node and
 *            attach it to the existing <select> element.
 *
 * @param {string[]} regions  Sorted array of unique region names.
 */
export function populateRegionFilter(regions) {
  const select = document.getElementById('region-filter');

  // Chapter 2: for...of — iterate over the array one item at a time
  for (const region of regions) {
    // Chapter 4: createElement — create a new DOM node
    const option = document.createElement('option');
    option.value       = region;
    option.textContent = region;

    // Chapter 4: appendChild — attach the new node to the <select>
    select.appendChild(option);
  }
}

// ─── Cards grid ───────────────────────────────────────────────────────────────

/**
 * Render an array of country objects as card elements in the grid.
 *
 * Chapter 3: map() — transform each country object into an HTML string,
 *            then join all strings into one large HTML block.
 * Chapter 4: element.innerHTML — replace the grid's entire content at once.
 * Chapter 3: object destructuring in the map callback parameter list.
 *
 * @param {object[]} countries
 */
export function renderCards(countries) {
  // Chapter 4: textContent — update the result count safely
  // Chapter 1: ternary operator for singular / plural
  resultsCount.textContent = `Showing ${countries.length.toLocaleString()} ${
    countries.length === 1 ? 'country' : 'countries'
  }`;

  if (countries.length === 0) {
    cardsGrid.innerHTML =
      '<p class="no-results">No countries match your search.</p>';
    return;
  }

  // Chapter 3: map() — produce one HTML string per country, then join them.
  // Chapter 3: object destructuring — unpack the properties we need from
  //            each country object directly in the parameter list.
  cardsGrid.innerHTML = countries
    .map(
      ({ name, flags, capital, region, subregion, population, area }) => `
        <article
          class="country-card"
          role="listitem"
          tabindex="0"
          data-name="${name.common}"
          aria-label="${name.common}"
        >
          <img
            class="card-flag"
            src="${flags.svg || flags.png}"
            alt="${flags.alt || `Flag of ${name.common}`}"
            loading="lazy"
            width="320"
            height="138"
          />
          <div class="card-body">
            <h3 class="card-name">${name.common}</h3>
            <dl class="card-details">
              <div class="detail-row">
                <dt>Capital</dt>
                <dd>${capital?.[0] ?? '—'}</dd>
              </div>
              <div class="detail-row">
                <dt>Region</dt>
                <dd>${region || '—'}${subregion ? ` / ${subregion}` : ''}</dd>
              </div>
              <div class="detail-row">
                <dt>Population</dt>
                <dd>${formatNumber(population)}</dd>
              </div>
              <div class="detail-row">
                <dt>Area</dt>
                <dd>${formatArea(area)}</dd>
              </div>
            </dl>
          </div>
        </article>
      `
    )
    .join('');
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

/**
 * Populate and open the country detail modal.
 *
 * Chapter 3: object destructuring — unpack all needed fields from country.
 * Chapter 3: Object.values() — extract language names from the languages
 *            object (whose keys are ISO 639-3 codes we do not need).
 * Chapter 3: map() on Object.values() to format currency strings.
 * Chapter 4: classList.remove, setAttribute — make the modal visible and
 *            announce it to assistive technology.
 *
 * @param {object} country
 */
export function openModal(country) {
  // Chapter 3: object destructuring
  const {
    name,
    flags,
    capital,
    region,
    subregion,
    population,
    area,
    languages,
    currencies,
  } = country;

  // Chapter 3: Object.values() — get an array of language name strings
  const languageList = languages
    ? Object.values(languages).join(', ')
    : '—';

  // Chapter 3: Object.values() + map() — build "Euro (€)" strings
  const currencyList = currencies
    ? Object.values(currencies)
        .map((c) => `${c.name} (${c.symbol || '?'})`)
        .join(', ')
    : '—';

  // Chapter 4: innerHTML — render the full detail view in one operation
  modalBody.innerHTML = `
    <div class="modal-header">
      <img
        class="modal-flag"
        src="${flags.svg || flags.png}"
        alt="${flags.alt || `Flag of ${name.common}`}"
        width="192"
        height="124"
      />
      <div>
        <h2 class="modal-country-name" id="modal-country-name">
          ${name.common}
        </h2>
        <p class="modal-official-name">${name.official}</p>
      </div>
    </div>

    <dl class="modal-details">
      <div class="detail-row">
        <dt>Capital</dt>
        <dd>${capital?.[0] ?? '—'}</dd>
      </div>
      <div class="detail-row">
        <dt>Region</dt>
        <dd>${region || '—'}</dd>
      </div>
      <div class="detail-row">
        <dt>Subregion</dt>
        <dd>${subregion || '—'}</dd>
      </div>
      <div class="detail-row">
        <dt>Population</dt>
        <dd>${formatNumber(population)}</dd>
      </div>
      <div class="detail-row">
        <dt>Area</dt>
        <dd>${formatArea(area)}</dd>
      </div>
      <div class="detail-row">
        <dt>Languages</dt>
        <dd>${languageList}</dd>
      </div>
      <div class="detail-row">
        <dt>Currencies</dt>
        <dd>${currencyList}</dd>
      </div>
    </dl>
  `;

  // Chapter 4: classList + setAttribute — show modal, tell screen readers
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  // Move focus to the close button so keyboard users can dismiss immediately
  modalClose.focus();
}

/**
 * Hide the detail modal.
 * Chapter 4: classList.add, setAttribute
 */
export function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

// ─── Modal event listeners ────────────────────────────────────────────────────
// Registered here rather than in main.js because they relate purely to
// opening/closing the modal — a render concern.

// Chapter 4: click on the backdrop (the overlay itself, not the panel)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Chapter 4: keyboard event — Escape closes the modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Chapter 4: close button click
modalClose.addEventListener('click', closeModal);
