// ─────────────────────────────────────────────────────────────────────────────
// Example 5 – Event Delegation
//
// Key concept: a SINGLE listener is attached to the parent (#product-list).
// It handles clicks from ALL current and future child buttons via event bubbling.
// ─────────────────────────────────────────────────────────────────────────────

// ── Utilities ────────────────────────────────────────────────────────────────
const actionLog = document.querySelector('#action-log');

function log(message, category = '') {
  const li = document.createElement('li');
  li.textContent = message;
  if (category) li.className = category;
  actionLog.prepend(li);
  console.log(message);
}

document.querySelector('#btn-clear-log').addEventListener('click', () => {
  actionLog.replaceChildren();
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Product list — delegated listener
//
//    Instead of attaching 3 listeners × N products, we attach ONE listener
//    to the <ul>. When any button inside it is clicked, the event bubbles up
//    to the <ul>, where we inspect event.target to decide what to do.
// ─────────────────────────────────────────────────────────────────────────────
const productList = document.querySelector('#product-list');
let nextProductId = 4;

productList.addEventListener('click', (event) => {
  // Use closest() to find the nearest button with a data-action attribute.
  // This is robust: clicking on text inside the button still works.
  const button = event.target.closest('button[data-action]');
  if (!button) return; // click was on the list background — ignore

  // Walk up to find the containing list item
  const item = button.closest('.product-item');
  if (!item) return;

  const productId   = item.dataset.productId;
  const productName = item.querySelector('.product-name').textContent;
  const action      = button.dataset.action;

  switch (action) {
    case 'view':
      log(`[view]   Viewing product #${productId}: "${productName}"`, 'view');
      break;

    case 'edit': {
      // Inline edit: replace span text with an input
      const nameSpan = item.querySelector('.product-name');
      const input    = document.createElement('input');
      input.type  = 'text';
      input.value = productName;
      input.style.cssText = 'padding:0.2rem 0.4rem; border:1px solid #f59e0b; border-radius:4px; font-size:0.9rem;';

      nameSpan.replaceWith(input);
      input.focus();
      input.select();

      // Save on Enter or blur
      function saveEdit() {
        const newName  = input.value.trim() || productName;
        const newSpan  = document.createElement('span');
        newSpan.className   = 'product-name';
        newSpan.textContent = newName;
        input.replaceWith(newSpan);
        log(`[edit]   Product #${productId} renamed: "${productName}" → "${newName}"`, 'edit');
      }

      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveEdit(); });
      input.addEventListener('blur', saveEdit, { once: true });
      break;
    }

    case 'delete':
      item.remove();
      log(`[delete] Product #${productId} ("${productName}") removed`, 'delete');
      break;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Adding new products dynamically
//    Notice: no new listeners are attached — the single delegated listener
//    on #product-list automatically handles the new items.
// ─────────────────────────────────────────────────────────────────────────────
const newProductInput = document.querySelector('#new-product-input');

function addProduct(name) {
  const id = nextProductId++;

  const li = document.createElement('li');
  li.className = 'product-item';
  li.dataset.productId = id;
  li.innerHTML = `
    <span class="product-name">${escapeHTML(name)}</span>
    <div class="product-actions">
      <button class="btn-view"   data-action="view">   View   </button>
      <button class="btn-edit"   data-action="edit">   Edit   </button>
      <button class="btn-delete" data-action="delete"> Delete </button>
    </div>
  `;

  productList.appendChild(li);
  log(`[add]    New product added: #${id} "${name}"`, 'add');
}

document.querySelector('#btn-add-product').addEventListener('click', () => {
  const name = newProductInput.value.trim();
  if (!name) return;
  addProduct(name);
  newProductInput.value = '';
  newProductInput.focus();
});

newProductInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.querySelector('#btn-add-product').click();
});

// Safe HTML escaping — avoids XSS when inserting user-supplied strings
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tab strip — delegated on #tabs
//    One listener activates the correct tab without looping over all buttons.
// ─────────────────────────────────────────────────────────────────────────────
const tabsContainer = document.querySelector('#tabs');
const tabPanels     = document.querySelectorAll('.tab-panel');

tabsContainer.addEventListener('click', (event) => {
  const clickedTab = event.target.closest('.tab');
  if (!clickedTab) return;

  const targetPanel = clickedTab.dataset.tab;

  // Deactivate all tabs and panels
  tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabPanels.forEach(p => p.classList.remove('active'));

  // Activate the clicked tab and matching panel
  clickedTab.classList.add('active');
  document.querySelector(`[data-panel="${targetPanel}"]`).classList.add('active');

  log(`[tab]    Switched to tab: "${targetPanel}"`, 'tab');
});
