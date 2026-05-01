// ─────────────────────────────────────────────────────────────────────────────
// Example 2 – Reading & Modifying Content and Attributes
// ─────────────────────────────────────────────────────────────────────────────

const output = document.querySelector('#output');

/** Append a line to the on-page output and the browser console. */
function log(msg) {
  console.log(msg);
  output.textContent += msg + '\n';
}

function separator(title) {
  output.textContent += `\n── ${title} ──────────────────────\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 – textContent & innerHTML
// ─────────────────────────────────────────────────────────────────────────────
const greeting = document.querySelector('#greeting');
const originalHTML = greeting.innerHTML;

document.querySelector('#btn-read-text').addEventListener('click', () => {
  separator('textContent');
  // Returns plain text; HTML tags are stripped
  log(`textContent → "${greeting.textContent}"`);
  // Note: textContent returns "Hello, World!" — the <strong> tags are absent
});

document.querySelector('#btn-read-html').addEventListener('click', () => {
  separator('innerHTML');
  // Returns the raw HTML string including tags
  log(`innerHTML → "${greeting.innerHTML}"`);
});

document.querySelector('#btn-set-text').addEventListener('click', () => {
  separator('Set textContent');
  // Safe: treats the string as plain text, no HTML parsing
  greeting.textContent = 'Updated with textContent (no HTML)';
  log('greeting.textContent set to: "Updated with textContent (no HTML)"');
  log('Note: <strong> is gone — textContent replaces the whole content');
});

document.querySelector('#btn-set-html').addEventListener('click', () => {
  separator('Set innerHTML');
  // Only use innerHTML with trusted content — never with user input
  greeting.innerHTML = 'Updated with <em>innerHTML</em>!';
  log('greeting.innerHTML set (contains HTML tags)');
});

document.querySelector('#btn-reset-content').addEventListener('click', () => {
  greeting.innerHTML = originalHTML;
  log('Content reset to original');
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 – Attributes & data-* attributes
// ─────────────────────────────────────────────────────────────────────────────
const img = document.querySelector('#demo-img');
const originalSrc = img.src;

document.querySelector('#btn-read-attr').addEventListener('click', () => {
  separator('Read Attributes');
  log(`img.src          → "${img.getAttribute('src')}"`);
  log(`img.alt          → "${img.alt}"`);            // shorthand
  log(`img.dataset.category → "${img.dataset.category}"`);
  log(`img.dataset.rating   → "${img.dataset.rating}"`);
  log(`img.hasAttribute('data-featured') → ${img.hasAttribute('data-featured')}`);
});

document.querySelector('#btn-change-src').addEventListener('click', () => {
  separator('Change src via setAttribute');
  img.setAttribute('src', 'https://via.placeholder.com/200x100/0070f3/fff?text=Changed');
  log('img src changed via setAttribute()');
});

document.querySelector('#btn-change-alt').addEventListener('click', () => {
  separator('Change alt via property shorthand');
  img.alt = 'Updated alt text – now descriptive';
  log(`img.alt now → "${img.alt}"`);
});

document.querySelector('#btn-toggle-attr').addEventListener('click', () => {
  separator('Toggle data-featured');
  if (img.hasAttribute('data-featured')) {
    img.removeAttribute('data-featured');
    log('data-featured attribute removed');
  } else {
    img.setAttribute('data-featured', 'true');
    log('data-featured="true" attribute added');
  }
  log(`img.hasAttribute('data-featured') → ${img.hasAttribute('data-featured')}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 – classList & Inline Styles
// ─────────────────────────────────────────────────────────────────────────────
const box = document.querySelector('#style-box');

document.querySelector('#btn-add-class').addEventListener('click', () => {
  separator('classList.add');
  box.classList.add('highlight');
  log(`box.classList → "${box.className}"`);
});

document.querySelector('#btn-remove-class').addEventListener('click', () => {
  separator('classList.remove');
  box.classList.remove('highlight');
  log(`box.classList → "${box.className}"`);
});

document.querySelector('#btn-toggle-class').addEventListener('click', () => {
  separator('classList.toggle');
  const added = box.classList.toggle('highlight');
  log(`.highlight was ${added ? 'added' : 'removed'}`);
  log(`box.classList.contains('highlight') → ${box.classList.contains('highlight')}`);
});

document.querySelector('#btn-add-inline').addEventListener('click', () => {
  separator('Set inline style');
  box.style.backgroundColor = 'coral';
  box.style.color = '#fff';
  box.style.transform = 'scale(1.1)';
  log('Inline styles set: backgroundColor=coral, color=#fff, transform=scale(1.1)');
});

document.querySelector('#btn-clear-inline').addEventListener('click', () => {
  separator('Clear inline styles');
  // Setting to empty string removes the inline style, restoring the stylesheet value
  box.style.backgroundColor = '';
  box.style.color = '';
  box.style.transform = '';
  log('Inline styles cleared — styles revert to stylesheet values');
});
