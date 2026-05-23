/**
 * js/api.js
 *
 * Responsible for all communication with the REST Countries API.
 *
 * Concepts from the module:
 *  Chapter 5 – Fetch API, async/await, Response.ok, Promise.all
 *  Chapter 6 – ES Modules (export), console.log
 */

// ─── Constants (Chapter 1: const) ────────────────────────────────────────────

const BASE_URL = 'https://restcountries.com/v3.1';

/**
 * Fields to request from the API.
 * Limiting fields reduces the response payload from ~3 MB to ~400 KB.
 */
const FIELDS = [
  'name',
  'population',
  'area',
  'region',
  'subregion',
  'flags',
  'capital',
  'languages',
  'currencies',
].join(',');

// ─── Public API functions ─────────────────────────────────────────────────────

/**
 * Fetch every country from the REST Countries API.
 *
 * Chapter 5: async function, await, fetch(), Response.ok check.
 *
 * @returns {Promise<object[]>} Array of country objects.
 * @throws  {Error}            If the network request fails or the server
 *                             returns a non-2xx status code.
 */
export async function fetchAllCountries() {
  const url = `${BASE_URL}/all?fields=${FIELDS}`;

  // Chapter 6: console.log — trace the outgoing request URL
  console.log('[api] GET', url);

  // Chapter 5: await a Promise; execution is suspended here until the
  // network response arrives, then resumes on the next line.
  const response = await fetch(url);

  // Chapter 5: fetch() only rejects on network failure.
  // A 404 or 500 still "succeeds" from fetch's point of view, so we must
  // check response.ok ourselves and throw manually.
  if (!response.ok) {
    throw new Error(
      `Request failed — HTTP ${response.status}: ${response.statusText}`
    );
  }

  // Chapter 5: .json() is itself a Promise, so we await it too.
  const data = await response.json();

  // Chapter 6: log how many records arrived
  console.log(`[api] Received ${data.length} countries`);

  return data;
}

/**
 * Fetch countries for two regions concurrently and return both arrays.
 *
 * Chapter 5: Promise.all — fire both requests at the same time instead of
 * awaiting them sequentially, cutting total wait time roughly in half.
 *
 * @param {string} regionA  e.g. 'Europe'
 * @param {string} regionB  e.g. 'Asia'
 * @returns {Promise<{regionA: object[], regionB: object[]}>}
 */
export async function fetchRegionComparison(regionA, regionB) {
  console.log(`[api] Comparing regions: "${regionA}" vs "${regionB}"`);

  // Chapter 5: Promise.all accepts an array of Promises and resolves with
  // an array of their results once every Promise has fulfilled.
  const [responseA, responseB] = await Promise.all([
    fetch(
      `${BASE_URL}/region/${encodeURIComponent(regionA)}?fields=name,population`
    ),
    fetch(
      `${BASE_URL}/region/${encodeURIComponent(regionB)}?fields=name,population`
    ),
  ]);

  if (!responseA.ok || !responseB.ok) {
    throw new Error('Failed to fetch one or both regions from the API');
  }

  // Chapter 5: resolve both .json() Promises concurrently too
  const [countriesA, countriesB] = await Promise.all([
    responseA.json(),
    responseB.json(),
  ]);

  return { regionA: countriesA, regionB: countriesB };
}
