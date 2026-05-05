// modules/utils.js
// ============================================================
// Utility functions — loaded via import().then() in Scenario 4
// ============================================================

export function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function wordCount(text) {
  if (typeof text !== 'string' || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
