/**
 * main.js — Event Delegation Todo App.
 *
 * Key concepts demonstrated:
 *  1. Single delegated listener on #todo-list handles ALL item clicks
 *  2. event.target.closest() for reliable hit detection
 *  3. data-* attributes to encode action and item id
 *  4. Dynamic content works automatically — no re-binding needed
 *  5. Filter tabs also delegated to a single parent listener
 *  6. AbortController for clean listener teardown (bonus)
 */

// ─── State ────────────────────────────────────────────────────────────────────
let todos = [
  { id: 1, text: 'Learn Web Workers',       priority: 'high',   completed: false },
  { id: 2, text: 'Build a Service Worker',  priority: 'high',   completed: false },
  { id: 3, text: 'Explore IndexedDB',       priority: 'medium', completed: false },
  { id: 4, text: 'Measure LCP and CLS',     priority: 'medium', completed: false },
  { id: 5, text: 'Implement debounce',      priority: 'low',    completed: true  },
];
let nextId      = 6;
let clickCount  = 0;
let activeFilter = 'all';

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const todoList       = document.getElementById('todo-list');
const todoInput      = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const btnAdd         = document.getElementById('btn-add');
const filterRow      = document.getElementById('filter-row');
const statTotal      = document.getElementById('stat-total');
const statActive     = document.getElementById('stat-active');
const statCompleted  = document.getElementById('stat-completed');
const itemsCount     = document.getElementById('items-count');
const clicksCount    = document.getElementById('clicks-count');
const btnClearComp   = document.getElementById('btn-clear-completed');
const eventLog       = document.getElementById('event-log');
const btnClearLog    = document.getElementById('btn-clear-log');

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  const visible = getVisibleTodos();

  if (visible.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos match this filter.</li>';
  } else {
    todoList.innerHTML = visible.map(todoTemplate).join('');
  }

  // Update stats
  statTotal.textContent    = todos.length;
  statActive.textContent   = todos.filter((t) => !t.completed).length;
  statCompleted.textContent = todos.filter((t) => t.completed).length;
  itemsCount.textContent   = todos.length;

  // Highlight active filter button
  filterRow.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === activeFilter);
  });
}

function getVisibleTodos() {
  switch (activeFilter) {
    case 'active':    return todos.filter((t) => !t.completed);
    case 'completed': return todos.filter((t) => t.completed);
    case 'high':      return todos.filter((t) => t.priority === 'high' && !t.completed);
    default:          return todos;
  }
}

function todoTemplate(todo) {
  return `
    <li class="todo-item${todo.completed ? ' completed' : ''}" data-id="${todo.id}">
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
      <div class="todo-actions">
        <button class="action-btn btn-complete" data-action="complete" data-id="${todo.id}">
          ${todo.completed ? 'Undo' : '✓'}
        </button>
        <button class="action-btn btn-edit" data-action="edit" data-id="${todo.id}">Edit</button>
        <button class="action-btn btn-delete" data-action="delete" data-id="${todo.id}">✕</button>
      </div>
    </li>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── THE KEY: Single delegated listener ───────────────────────────────────────
//
// Instead of:
//   todos.forEach(t => { document.getElementById(t.id).addEventListener(...) })
//   → N listeners, breaks on dynamic content
//
// We attach ONE listener to the PARENT and let events BUBBLE up to it.
//
todoList.addEventListener('click', (event) => {
  clickCount++;
  clicksCount.textContent = clickCount;

  // Find the closest button with a data-action attribute
  const btn = event.target.closest('[data-action]');
  if (!btn) return; // click was not on an action button

  const action = btn.dataset.action;
  const id     = Number(btn.dataset.id);

  log(`Delegated click — action: "${action}", id: ${id}`, '#86efac');

  switch (action) {
    case 'complete':
      toggleComplete(id);
      break;
    case 'delete':
      deleteTodo(id);
      break;
    case 'edit':
      editTodo(id);
      break;
  }
});

// ─── Filter delegation ────────────────────────────────────────────────────────
// One listener on the filter row handles all filter tab clicks
filterRow.addEventListener('click', (event) => {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;

  activeFilter = btn.dataset.filter;
  log(`Filter changed to: "${activeFilter}"`, '#fde68a');
  render();
});

// ─── Actions ──────────────────────────────────────────────────────────────────
function toggleComplete(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  log(`Deleted todo #${id}`, '#fca5a5');
  render();
}

function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const newText = prompt('Edit todo:', todo.text);
  if (newText !== null && newText.trim() !== '') {
    todo.text = newText.trim();
    log(`Edited todo #${id}: "${todo.text}"`, '#fde68a');
    render();
  }
}

// ─── Add new todo ─────────────────────────────────────────────────────────────
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id:        nextId++,
    text,
    priority:  prioritySelect.value,
    completed: false,
  };

  todos.push(newTodo);
  todoInput.value = '';
  todoInput.focus();

  log(`Added: "${newTodo.text}" [${newTodo.priority}] — listener count still: 1`, '#93c5fd');
  render();
}

btnAdd.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// ─── Clear completed ──────────────────────────────────────────────────────────
btnClearComp.addEventListener('click', () => {
  const removed = todos.filter((t) => t.completed).length;
  todos = todos.filter((t) => !t.completed);
  log(`Cleared ${removed} completed todos`, '#fde68a');
  render();
});

// ─── Logging ──────────────────────────────────────────────────────────────────
function log(message, color = '#86efac') {
  if (eventLog.children.length === 1 && eventLog.textContent.includes('Waiting')) {
    eventLog.innerHTML = '';
  }
  const line = document.createElement('div');
  line.style.color = color;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  eventLog.appendChild(line);
  eventLog.scrollTop = eventLog.scrollHeight;
}

btnClearLog.addEventListener('click', () => { eventLog.innerHTML = ''; });

// ─── AbortController demo (console) ──────────────────────────────────────────
// Shows how to remove multiple listeners cleanly
const controller = new AbortController();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') log('Escape pressed (keydown listener via AbortController)', '#c4b5fd');
}, { signal: controller.signal });

// Call controller.abort() in the console to remove the keydown listener
window._abortListeners = () => {
  controller.abort();
  log('All AbortController listeners removed', '#fca5a5');
};
console.log('Tip: call window._abortListeners() to abort the keydown listener cleanly.');

// ─── Initial render ───────────────────────────────────────────────────────────
render();
