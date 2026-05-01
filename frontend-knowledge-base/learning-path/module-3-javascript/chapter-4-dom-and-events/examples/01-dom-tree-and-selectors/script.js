// ─────────────────────────────────────────────────────────────────────────────
// Example 1 – DOM Tree & Selectors
// Open the browser console (F12) and the page to see the results.
// ─────────────────────────────────────────────────────────────────────────────

const results = [];

// ── 1. getElementById ────────────────────────────────────────────────────────
const nav = document.getElementById('main-nav');
results.push(`getElementById('main-nav') → ${nav.tagName}#${nav.id}`);

// ── 2. querySelector (first match) ───────────────────────────────────────────
const firstCard = document.querySelector('.card');
results.push(`querySelector('.card') → first card title: "${firstCard.querySelector('h2').textContent}"`);

// ── 3. querySelectorAll (all matches) ────────────────────────────────────────
const allCards = document.querySelectorAll('.card');
results.push(`querySelectorAll('.card') → ${allCards.length} cards found`);

// ── 4. CSS attribute selector ────────────────────────────────────────────────
const externalLinks = document.querySelectorAll('a[href^="https"]');
results.push(`querySelectorAll('a[href^="https"]') → ${externalLinks.length} external link(s)`);

// ── 5. Compound selector ──────────────────────────────────────────────────────
const featuredTitle = document.querySelector('.card.featured .card-title');
results.push(`querySelector('.card.featured .card-title') → "${featuredTitle.textContent}"`);

// ── 6. Scoped query (search inside a specific element) ───────────────────────
const section = document.querySelector('#articles');
const titlesInSection = section.querySelectorAll('.card-title');
const titleTexts = [...titlesInSection].map(t => t.textContent).join(', ');
results.push(`section.querySelectorAll('.card-title') → [${titleTexts}]`);

// ── 7. closest() – walk up the tree ─────────────────────────────────────────
const readMoreLink = document.querySelector('.card-link');
const containingCard = readMoreLink.closest('[data-id]');
results.push(`link.closest('[data-id]') → article with data-id="${containingCard.dataset.id}"`);

// ── 8. matches() ─────────────────────────────────────────────────────────────
const firstNav = document.querySelector('.nav-link');
results.push(`first nav link matches('.active'): ${firstNav.matches('.active')}`);

// ── 9. Node relationships ─────────────────────────────────────────────────────
const articles = document.querySelector('#articles');
results.push(`articles.children.length → ${articles.children.length} (child elements)`);
results.push(`articles.firstElementChild.className → "${articles.firstElementChild.className}"`);
results.push(`articles.lastElementChild.className  → "${articles.lastElementChild.className}"`);

// ── 10. Render results into the page ─────────────────────────────────────────
const list = document.querySelector('#results-list');
results.forEach(text => {
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
});

// Also log everything to the console for inspection
console.group('DOM Selectors Demo');
results.forEach(r => console.log(r));
console.groupEnd();
