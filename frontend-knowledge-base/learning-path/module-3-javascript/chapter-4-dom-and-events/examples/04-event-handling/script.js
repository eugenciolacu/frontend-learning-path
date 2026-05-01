// ─────────────────────────────────────────────────────────────────────────────
// Example 4 – Event Handling: addEventListener & the Event Object
// ─────────────────────────────────────────────────────────────────────────────

const logList = document.querySelector('#event-log');

/** Append an entry to the visible event log. */
function logEvent(message, category = 'info') {
  const li = document.createElement('li');
  li.textContent = message;
  li.className = category;
  logList.prepend(li); // newest on top
}

document.querySelector('#btn-clear-log').addEventListener('click', () => {
  logList.replaceChildren();
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Basic click event – inspecting the Event object
// ─────────────────────────────────────────────────────────────────────────────
document.querySelector('#btn-click').addEventListener('click', (event) => {
  logEvent(`[click] type="${event.type}" | target="${event.target.id}" | currentTarget="${event.currentTarget.id}" | button=${event.button}`, 'info');
  console.log('Full event object:', event);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. { once: true } – fires exactly one time, then auto-removes itself
// ─────────────────────────────────────────────────────────────────────────────
document.querySelector('#btn-once').addEventListener('click', (event) => {
  logEvent('[click / once] This listener fires ONCE and then removes itself.', 'info');
  event.target.disabled = true;
  event.target.textContent = 'Already fired';
}, { once: true });

// ─────────────────────────────────────────────────────────────────────────────
// 3. Adding and removing named listeners
//    removeEventListener requires the EXACT same function reference.
// ─────────────────────────────────────────────────────────────────────────────
function onToggleClick(event) {
  logEvent(`[toggleClick] Button clicked at (${event.clientX}, ${event.clientY})`, 'info');
}

const btnAdd    = document.querySelector('#btn-add-listener');
const btnRemove = document.querySelector('#btn-remove-listener');

btnAdd.addEventListener('click', () => {
  // Guard: avoid attaching the listener twice
  btnRemove.removeEventListener('click', onToggleClick); // harmless if not attached
  btnRemove.addEventListener('click', onToggleClick);
  logEvent('[info] Listener attached to "Detach" button — click it now', 'info');
});

btnRemove.addEventListener('click', () => {
  // This is the named handler we add/remove dynamically
  // Note: this default click runs even after onToggleClick is removed —
  // because this is a *different* listener on the same button.
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Keyboard events – keydown, keyup
// ─────────────────────────────────────────────────────────────────────────────
const keyInput = document.querySelector('#key-input');

keyInput.addEventListener('keydown', (event) => {
  // event.key   → logical key name: 'a', 'Enter', 'ArrowUp', 'Backspace', …
  // event.code  → physical key code: 'KeyA', 'Enter', 'ArrowUp', …
  // event.ctrlKey / .shiftKey / .altKey / .metaKey → modifier keys
  logEvent(
    `[keydown] key="${event.key}" code="${event.code}" ctrl=${event.ctrlKey} shift=${event.shiftKey}`,
    'key'
  );

  // Example: prevent typing non-numeric characters in a "digits only" field
  // if (!/^\d$/.test(event.key) && event.key !== 'Backspace') event.preventDefault();
});

keyInput.addEventListener('keyup', (event) => {
  logEvent(`[keyup] key="${event.key}"`, 'key');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Mouse events
// ─────────────────────────────────────────────────────────────────────────────
const mouseZone = document.querySelector('#mouse-zone');

mouseZone.addEventListener('mouseenter', () => {
  mouseZone.classList.add('hover');
  logEvent('[mouseenter] — does NOT bubble', 'mouse');
});

mouseZone.addEventListener('mouseleave', () => {
  mouseZone.classList.remove('hover');
  logEvent('[mouseleave] — does NOT bubble', 'mouse');
});

mouseZone.addEventListener('mousemove', (event) => {
  // clientX/Y: position relative to viewport
  // offsetX/Y: position relative to the element itself
  mouseZone.textContent = `clientX: ${event.clientX}  clientY: ${event.clientY}  |  offsetX: ${event.offsetX}  offsetY: ${event.offsetY}`;
});

mouseZone.addEventListener('click', (event) => {
  logEvent(`[click on zone] button=${event.button} (0=left, 1=middle, 2=right)`, 'mouse');
});

mouseZone.addEventListener('contextmenu', (event) => {
  event.preventDefault(); // prevent the native right-click menu
  logEvent('[contextmenu] Right-click intercepted, default menu prevented', 'mouse');
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Event bubbling & stopPropagation
// ─────────────────────────────────────────────────────────────────────────────
const stopCheckbox = document.querySelector('#stop-propagation');

['outer', 'middle', 'inner'].forEach(id => {
  document.querySelector(`#${id}`).addEventListener('click', (event) => {
    logEvent(`[bubble] "${id}" handler fired  |  target="${event.target.id}"  |  currentTarget="${event.currentTarget.id}"`, 'bubble');

    // If the user opted in AND this is the inner element, stop the bubble
    if (id === 'inner' && stopCheckbox.checked) {
      event.stopPropagation();
      logEvent('[bubble] stopPropagation() called — middle & outer will NOT fire', 'bubble');
    }
  });
});
