// ─────────────────────────────────────────────────────────────────────────────
// Example 3 – Creating, Inserting & Removing Elements
// ─────────────────────────────────────────────────────────────────────────────

// ── Task counter (used for unique IDs) ───────────────────────────────────────
let taskCounter = 1;

// ── 1. Creating and appending a single element ───────────────────────────────
const taskInput = document.querySelector('#task-input');
const taskList  = document.querySelector('#task-list');

/**
 * Creates a <li> task element from a text string.
 * Demonstrates: createElement, textContent, classList, appendChild
 */
function createTaskItem(text) {
  // Create the <li> element
  const li = document.createElement('li');
  li.classList.add('task-item');
  li.dataset.id = taskCounter++;

  // Create the text <span>
  const span = document.createElement('span');
  span.textContent = text; // Safe: no HTML parsing

  // Create the remove button
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('btn-remove');
  removeBtn.textContent = '✕';
  removeBtn.setAttribute('aria-label', 'Remove task');

  // Remove the item when the button is clicked
  removeBtn.addEventListener('click', () => li.remove());

  // Assemble: append span and button into li
  li.append(span, removeBtn);

  return li;
}

document.querySelector('#btn-add').addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const li = createTaskItem(text);
  taskList.appendChild(li); // append as last child
  taskInput.value = '';
  taskInput.focus();
});

// Allow pressing Enter in the input to add a task
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.querySelector('#btn-add').click();
});

// ── 2. DocumentFragment – batch-insert multiple elements (single reflow) ─────
document.querySelector('#btn-add-fragment').addEventListener('click', () => {
  const tasks = ['Buy groceries', 'Read a book', 'Go for a walk'];

  // Create a fragment — it lives in memory, not in the DOM
  const fragment = document.createDocumentFragment();

  tasks.forEach(text => {
    fragment.appendChild(createTaskItem(text));
  });

  // Single DOM update: all three items are inserted at once
  taskList.appendChild(fragment);

  console.log('3 tasks added via DocumentFragment (one reflow instead of three)');
});

// ── 3. Removing all children ─────────────────────────────────────────────────
document.querySelector('#btn-clear-all').addEventListener('click', () => {
  // Modern one-liner: replaceChildren() with no arguments clears all children
  taskList.replaceChildren();

  // Legacy equivalent (also fine):
  // while (taskList.firstChild) taskList.removeChild(taskList.firstChild);

  console.log('All tasks removed with taskList.replaceChildren()');
});

// ── 4. insertAdjacentElement positions ───────────────────────────────────────
const targetEl = document.querySelector('#target-el');

document.querySelectorAll('[data-position]').forEach(btn => {
  btn.addEventListener('click', () => {
    const position = btn.dataset.position; // e.g., 'beforebegin'

    const newEl = document.createElement('div');
    newEl.classList.add('inserted');
    newEl.dataset.pos = position;
    newEl.textContent = position;

    targetEl.insertAdjacentElement(position, newEl);

    console.log(`Inserted element at position: "${position}"`);
  });
});

document.querySelector('#btn-reset-insert').addEventListener('click', () => {
  // Remove all .inserted elements
  document.querySelectorAll('.inserted').forEach(el => el.remove());
  console.log('Insert demo reset');
});

// ── 5. Cloning elements ───────────────────────────────────────────────────────
const cardTemplate = document.querySelector('#card-template');
const gallery      = document.querySelector('#clone-gallery');
let cloneCount = 0;

document.querySelector('#btn-clone').addEventListener('click', () => {
  cloneCount++;

  // Deep clone — copies all descendant nodes
  const clone = cardTemplate.cloneNode(true);

  // Remove the id to avoid duplicate ids in the DOM
  clone.removeAttribute('id');

  // Customise the clone
  clone.querySelector('strong').textContent = `Clone #${cloneCount}`;
  clone.querySelector('p').textContent = `This is clone number ${cloneCount}.`;

  gallery.appendChild(clone);

  console.log(`Card cloned (deep clone). Total clones: ${cloneCount}`);
});

document.querySelector('#btn-remove-last-clone').addEventListener('click', () => {
  const lastClone = gallery.lastElementChild;
  if (lastClone) {
    lastClone.remove(); // modern: element.remove()
    cloneCount--;
    console.log(`Last clone removed. Remaining clones: ${cloneCount}`);
  } else {
    console.log('No clones to remove');
  }
});
