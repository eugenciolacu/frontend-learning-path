/**
 * js/utils.js
 *
 * Pure helper functions with no side-effects.
 * All functions are exported so they can be imported wherever needed.
 *
 * Concepts from the module:
 *  Chapter 2 – Arrow functions, default parameters
 *  Chapter 3 – Array methods: map, filter, reduce, sort; spread + Set
 */

// ─── Formatting helpers ───────────────────────────────────────────────────────

/**
 * Format a number with locale-aware thousands separators.
 *
 * Chapter 2: default parameter — if value is null/undefined the caller
 * gets the fallback string instead of "undefined" or "NaN".
 *
 * @param {number|null|undefined} value
 * @param {string} fallback  Default: 'N/A'
 * @returns {string}
 */
export const formatNumber = (value, fallback = 'N/A') =>
  value != null ? value.toLocaleString() : fallback;

/**
 * Format an area value with a km² suffix.
 *
 * Chapter 2: default parameter for fallback.
 *
 * @param {number|null|undefined} area
 * @param {string} fallback  Default: 'N/A'
 * @returns {string}
 */
export const formatArea = (area, fallback = 'N/A') =>
  area != null ? `${area.toLocaleString()} km²` : fallback;

// ─── Data helpers ─────────────────────────────────────────────────────────────

/**
 * Derive a unique, sorted list of non-empty region names from an array
 * of country objects.
 *
 * Chapter 3:
 *  - map()   — extract the region string from each country
 *  - filter()— remove falsy values (countries with no region)
 *  - Set     — collect only unique values (no duplicates)
 *  - spread  — convert the Set back to an array so .sort() is available
 *
 * @param {object[]} countries
 * @returns {string[]}
 */
export const getUniqueRegions = (countries) =>
  [...new Set(countries.map((c) => c.region).filter(Boolean))].sort();

/**
 * Compute aggregate statistics from a full countries array.
 *
 * Chapter 3:
 *  - reduce() — accumulate total population across every country
 *  - reduce() (second call) — find the country with the highest population
 *  - getUniqueRegions uses map + filter + Set (see above)
 *
 * @param {object[]} countries
 * @returns {{ total: number, totalPopulation: number, regions: number, mostPopulous: object }}
 */
export const computeStats = (countries) => {
  if (countries.length === 0) {
    return { total: 0, totalPopulation: 0, regions: 0, mostPopulous: null };
  }

  // Chapter 3: reduce() — sum all population values
  const totalPopulation = countries.reduce(
    (sum, c) => sum + (c.population || 0),
    0
  );

  // Chapter 3: reduce() — keep whichever country has the larger population
  const mostPopulous = countries.reduce(
    (champion, c) => (c.population > champion.population ? c : champion),
    countries[0]
  );

  const regions = getUniqueRegions(countries).length;

  return {
    total: countries.length,
    totalPopulation,
    regions,
    mostPopulous,
  };
};

/**
 * Filter and sort a countries array according to the current filter state.
 *
 * Chapter 3:
 *  - filter() — keep only countries that match the search text AND region
 *  - sort()   — reorder the filtered results by the chosen sort key
 *
 * @param {object[]} countries      Full unfiltered array.
 * @param {{ search: string, region: string, sortBy: string }} filterState
 * @returns {object[]}              New array — original is not mutated.
 */
export const applyFilters = (countries, { search, region, sortBy }) => {
  // Chapter 1: convert once, reuse in the filter callback
  const query = search.toLowerCase().trim();

  // Chapter 3: filter() — both predicates must pass
  const filtered = countries.filter((c) => {
    const matchesSearch =
      query === '' || c.name.common.toLowerCase().includes(query);
    const matchesRegion = region === '' || c.region === region;
    return matchesSearch && matchesRegion;
  });

  // Chapter 3: sort() — uses a comparator function (returns negative / 0 / positive)
  // Note: sort() mutates in place, but filtered is already a new array from filter(),
  // so the original `countries` array is never modified.
  return filtered.sort((a, b) => {
    if (sortBy === 'name') {
      // localeCompare produces a consistent alphabetical order across locales
      return a.name.common.localeCompare(b.name.common);
    }
    if (sortBy === 'population') {
      return (b.population || 0) - (a.population || 0); // descending
    }
    if (sortBy === 'area') {
      return (b.area || 0) - (a.area || 0); // descending
    }
    return 0;
  });
};
