# Chapter 4: The DOM and Events

## Overview

The **Document Object Model (DOM)** is the browser's live, tree-structured representation of an HTML document. JavaScript uses the DOM API to read, modify, create, and delete page content dynamically — without reloading the page. Understanding the DOM and how to respond to user events is fundamental to building interactive web applications.

---

## 1. The DOM Tree

When a browser loads an HTML page it parses the markup and builds an in-memory tree of **nodes**. Every tag, text fragment, and comment becomes a node.

### Node types you will encounter most often

| Node type      | `nodeType` | Description                              |
|----------------|------------|------------------------------------------|
| `Element`      | 1          | An HTML element (`<div>`, `<p>`, etc.)   |
| `Text`         | 3          | The text content inside an element       |
| `Comment`      | 8          | `<!-- an HTML comment -->`               |
| `Document`     | 9          | The root `document` object itself        |

### Visualising the tree

Given this HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1 id="title">Hello, World!</h1>
    <p class="intro">Welcome to the DOM.</p>
  </body>
</html>
```

The DOM tree looks like:

```
document
└── html
    ├── head
    │   └── title  →  "My Page"
    └── body
        ├── h1#title  →  "Hello, World!"
        └── p.intro   →  "Welcome to the DOM."
```

### Key node relationships

```js
// Given: const el = document.querySelector('p');
el.parentNode          // the direct parent node
el.parentElement       // the direct parent element (null if parent is not an Element)
el.childNodes          // NodeList of ALL child nodes (including Text nodes)
el.children            // HTMLCollection of child ELEMENTS only
el.firstChild          // first child node (may be a Text node)
el.firstElementChild   // first child element
el.lastChild           // last child node
el.lastElementChild    // last child element
el.nextSibling         // next sibling node
el.nextElementSibling  // next sibling element
el.previousSibling     // previous sibling node
el.previousElementSibling // previous sibling element
```

---

## 2. Selecting Elements

The DOM provides several methods to find elements in the document.

### `getElementById`

Returns the **single** element whose `id` matches, or `null`.

```js
const title = document.getElementById('title');
console.log(title); // <h1 id="title">Hello, World!</h1>
```

> **Best practice:** `id` values must be unique on a page. If duplicates exist, `getElementById` returns only the first match.

### `getElementsByClassName`

Returns a **live** `HTMLCollection` of all elements with the given class name.

```js
const cards = document.getElementsByClassName('card');
// cards[0], cards[1], ...
```

> **"Live"** means the collection updates automatically when the DOM changes. Prefer `querySelectorAll` for predictable behaviour.

### `getElementsByTagName`

Returns a **live** `HTMLCollection` of all elements with the given tag.

```js
const paragraphs = document.getElementsByTagName('p');
```

### `querySelector`

Returns the **first** element matching any valid CSS selector, or `null`.

```js
const intro = document.querySelector('.intro');
const firstInput = document.querySelector('form input[type="text"]');
```

### `querySelectorAll`

Returns a **static** `NodeList` of **all** matching elements.

```js
const allLinks = document.querySelectorAll('a[href^="https"]');
allLinks.forEach(link => console.log(link.href));
```

> **"Static"** means the NodeList is a snapshot. It does not update when the DOM changes.

### `closest`

Traverses up the DOM tree and returns the nearest **ancestor** (or the element itself) that matches the selector.

```js
const button = document.querySelector('.btn-delete');
const listItem = button.closest('li'); // finds the containing <li>
```

### `matches`

Tests whether an element matches a selector — returns `true` or `false`.

```js
if (element.matches('.active')) {
  console.log('This element is active');
}
```

### Scoping queries to a subtree

You can call `querySelector`/`querySelectorAll` on any element (not just `document`) to limit the search to its subtree:

```js
const nav = document.querySelector('nav');
const navLinks = nav.querySelectorAll('a'); // only links inside <nav>
```

---

## 3. Reading and Modifying Content and Attributes

### Text content

```js
const heading = document.querySelector('h1');

// Read
console.log(heading.textContent); // "Hello, World!"

// Write (plain text — safe, no HTML parsing)
heading.textContent = 'New Title';
```

> Use `textContent` when dealing with **plain text**. It does not parse HTML tags, which prevents **XSS (Cross-Site Scripting)** attacks.

### HTML content

```js
const container = document.querySelector('#app');

// Read the raw HTML string inside the element
console.log(container.innerHTML);

// Write — DANGER: only use with trusted/sanitised content
container.innerHTML = '<strong>Bold text</strong>';
```

> **Security warning:** Never set `innerHTML` using unsanitised user input. This can lead to XSS vulnerabilities. Prefer `textContent` or DOM creation methods when content comes from users or external APIs.

### `innerText` vs `textContent`

| Property      | Behaviour                                           |
|---------------|-----------------------------------------------------|
| `textContent` | Returns all text, including hidden elements         |
| `innerText`   | Returns only *visible* text (respects CSS `display`) |

### Attributes

```js
const img = document.querySelector('img');

// Read an attribute
console.log(img.getAttribute('src'));  // "photo.jpg"
console.log(img.alt);                  // shorthand for standard attributes

// Set an attribute
img.setAttribute('alt', 'A scenic mountain view');
img.src = 'new-photo.jpg';            // shorthand

// Check if an attribute exists
console.log(img.hasAttribute('data-id')); // true / false

// Remove an attribute
img.removeAttribute('title');
```

### Data attributes (`data-*`)

Custom data attributes let you attach metadata to elements without using non-standard attributes.

```html
<button data-user-id="42" data-role="admin">Edit User</button>
```

```js
const btn = document.querySelector('button');

// Read via dataset (camelCase conversion: data-user-id → userId)
console.log(btn.dataset.userId); // "42"
console.log(btn.dataset.role);   // "admin"

// Write
btn.dataset.role = 'editor';

// Delete
delete btn.dataset.role;
```

### CSS classes

```js
const box = document.querySelector('.box');

box.classList.add('highlight');          // add a class
box.classList.remove('highlight');       // remove a class
box.classList.toggle('active');          // add if absent, remove if present
box.classList.replace('old', 'new');     // replace a class
console.log(box.classList.contains('active')); // true / false
```

### Inline styles

```js
const box = document.querySelector('.box');

box.style.backgroundColor = 'coral';    // camelCase property name
box.style.fontSize = '1.5rem';
box.style.display = 'none';             // hide element
box.style.display = '';                 // reset to stylesheet value
```

> Prefer toggling CSS classes over setting inline styles. It keeps style logic in CSS and behaviour logic in JavaScript.

---

## 4. Creating, Inserting, and Removing Elements

### Creating elements

```js
const newParagraph = document.createElement('p');
newParagraph.textContent = 'This paragraph was created with JavaScript.';
newParagraph.classList.add('dynamic');
```

### Inserting elements

```js
const container = document.querySelector('#container');

// Append as the last child
container.appendChild(newParagraph);

// Insert before a reference child
const reference = container.querySelector('.existing');
container.insertBefore(newParagraph, reference);

// Modern: insertAdjacentElement
// Positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
container.insertAdjacentElement('afterbegin', newParagraph);

// Modern: append / prepend (accept multiple nodes and strings)
container.append(newParagraph, 'some text');
container.prepend(newParagraph);
```

#### `insertAdjacentElement` / `insertAdjacentHTML` positions

```
<!-- beforebegin -->
<div id="container">
  <!-- afterbegin -->
  ...existing children...
  <!-- beforeend -->
</div>
<!-- afterend -->
```

### Cloning elements

```js
const original = document.querySelector('.card');

// Shallow clone (no children)
const shallowCopy = original.cloneNode(false);

// Deep clone (includes all descendants)
const deepCopy = original.cloneNode(true);

document.querySelector('#gallery').appendChild(deepCopy);
```

### Removing elements

```js
const toRemove = document.querySelector('.outdated');

// Modern: remove directly
toRemove.remove();

// Legacy: removeChild via parent
toRemove.parentNode.removeChild(toRemove);
```

### Replacing elements

```js
const oldEl = document.querySelector('.old');
const newEl = document.createElement('span');
newEl.textContent = 'Replacement';

oldEl.replaceWith(newEl);                        // modern
oldEl.parentNode.replaceChild(newEl, oldEl);     // legacy
```

### Creating text nodes and document fragments

```js
// Text node — useful when you need to insert only text safely
const textNode = document.createTextNode('Safe text without <b>HTML</b>');
container.appendChild(textNode); // renders the angle brackets literally

// DocumentFragment — batch DOM updates for better performance
const fragment = document.createDocumentFragment();
for (let i = 1; i <= 5; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
document.querySelector('ul').appendChild(fragment); // single reflow
```

> **Performance tip:** Multiple individual `appendChild` calls trigger a layout reflow each time. Collecting nodes in a `DocumentFragment` first and appending once minimises reflows.

---

## 5. Event Handling

Events are signals that something has happened — a click, a key press, a page load. JavaScript lets you listen for and respond to these signals.

### `addEventListener`

```js
const button = document.querySelector('#submit-btn');

button.addEventListener('click', function (event) {
  console.log('Button clicked!', event);
});
```

**Syntax:** `element.addEventListener(type, listener, options)`

| Parameter  | Description                                                         |
|------------|---------------------------------------------------------------------|
| `type`     | Event type string: `'click'`, `'keydown'`, `'input'`, etc.         |
| `listener` | Function to call when the event fires                               |
| `options`  | Optional object or boolean — `{ once, capture, passive }`          |

### Using named functions (recommended for removal)

```js
function handleClick(event) {
  console.log('Clicked:', event.target);
}

button.addEventListener('click', handleClick);

// Later — remove the exact same listener reference
button.removeEventListener('click', handleClick);
```

> **Important:** `removeEventListener` only works when you pass the **same function reference**. Anonymous functions cannot be removed this way.

### `once` option

```js
button.addEventListener('click', handleClick, { once: true });
// The listener fires once, then removes itself automatically
```

### The Event Object

Every listener receives an **Event** object as its first argument.

```js
document.querySelector('a').addEventListener('click', function (event) {
  event.preventDefault();            // prevent the default action (navigation)
  console.log(event.type);          // "click"
  console.log(event.target);        // the element that was actually clicked
  console.log(event.currentTarget); // the element the listener is attached to
  console.log(event.timeStamp);     // when the event fired (ms since page load)
});
```

#### Commonly used Event properties & methods

| Property / Method       | Description                                                     |
|-------------------------|-----------------------------------------------------------------|
| `event.type`            | Type of event (`'click'`, `'keydown'`, etc.)                    |
| `event.target`          | The element that *triggered* the event                          |
| `event.currentTarget`   | The element the listener is *attached to*                       |
| `event.preventDefault()`| Cancels the browser's default behaviour                         |
| `event.stopPropagation()`| Stops the event from bubbling up the DOM tree                  |
| `event.bubbles`         | `true` if the event bubbles                                     |
| `event.key`             | The key pressed (keyboard events)                               |
| `event.clientX/Y`       | Mouse position relative to the viewport                         |
| `event.pageX/Y`         | Mouse position relative to the document                         |

### Event flow: Capturing and Bubbling

When an event fires it travels in two phases:

1. **Capture phase** — from `window` down to the target element
2. **Bubble phase** — from the target element back up to `window`

```
window → document → html → body → section → ul → li  (capture ↓)
window ← document ← html ← body ← section ← ul ← li  (bubble ↑)
```

By default, `addEventListener` listens in the **bubble phase**. Pass `{ capture: true }` (or just `true`) as the third argument to listen in the capture phase instead.

```js
// Capture phase listener
document.addEventListener('click', handler, { capture: true });
```

### Common event types

```js
// Mouse
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mouseenter', handler);  // does not bubble
element.addEventListener('mouseleave', handler);  // does not bubble
element.addEventListener('mouseover', handler);   // bubbles
element.addEventListener('mouseout', handler);    // bubbles
element.addEventListener('contextmenu', handler); // right-click

// Keyboard
document.addEventListener('keydown', (e) => console.log(e.key));
document.addEventListener('keyup', handler);

// Window / Document
window.addEventListener('load', handler);          // everything loaded (images, etc.)
document.addEventListener('DOMContentLoaded', handler); // HTML parsed, no images
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);

// Clipboard
element.addEventListener('copy', handler);
element.addEventListener('paste', handler);
```

---

## 6. Event Delegation

**Event delegation** is the practice of attaching a **single event listener to a parent element** to handle events from many child elements, exploiting event bubbling.

### Why use it?

- Handles dynamic elements (added after page load) without re-attaching listeners
- Reduces the number of listeners → better memory performance
- Simplifies code for lists, tables, and repeating patterns

### Pattern

```js
const list = document.querySelector('#task-list');

list.addEventListener('click', function (event) {
  // Check which child was actually clicked
  const item = event.target.closest('li');
  if (!item) return; // click was not on or inside a list item

  console.log('Task clicked:', item.textContent);
});
```

### Using `dataset` with delegation

```html
<ul id="product-list">
  <li data-product-id="1">
    Apple
    <button data-action="edit">Edit</button>
    <button data-action="delete">Delete</button>
  </li>
  <li data-product-id="2">
    Banana
    <button data-action="edit">Edit</button>
    <button data-action="delete">Delete</button>
  </li>
</ul>
```

```js
document.querySelector('#product-list').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const productId = button.closest('li').dataset.productId;

  if (action === 'edit') editProduct(productId);
  if (action === 'delete') deleteProduct(productId);
});
```

### `event.target` vs `event.currentTarget`

```
#task-list  ← currentTarget (where listener is attached)
  └── li
        └── button  ← target (what was actually clicked)
```

---

## 7. Forms and Input Events

### Listening for input changes

```js
const input = document.querySelector('#search');

// Fires on every keystroke (character added/removed)
input.addEventListener('input', (event) => {
  console.log('Current value:', event.target.value);
});

// Fires when the element loses focus AND value has changed
input.addEventListener('change', (event) => {
  console.log('Committed value:', event.target.value);
});

// Fires when the element gains focus
input.addEventListener('focus', () => input.classList.add('focused'));

// Fires when the element loses focus (does not bubble)
input.addEventListener('blur', () => input.classList.remove('focused'));

// focusin / focusout bubble
input.addEventListener('focusin', handler);
input.addEventListener('focusout', handler);
```

### Reading form values

```js
const form = document.querySelector('#registration-form');

// Text, email, password, number, date inputs
const username = form.querySelector('[name="username"]').value;

// Checkbox
const agreed = form.querySelector('[name="agree"]').checked;

// Radio buttons — find the checked one
const gender = form.querySelector('[name="gender"]:checked')?.value;

// Select (single)
const country = form.querySelector('[name="country"]').value;

// Select (multiple)
const selectedOptions = [...form.querySelector('[name="skills"]').selectedOptions]
  .map(option => option.value);

// Textarea
const bio = form.querySelector('textarea[name="bio"]').value;
```

### The `submit` event

```js
const form = document.querySelector('#login-form');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the browser from navigating/reloading

  const data = {
    email: form.querySelector('[name="email"]').value.trim(),
    password: form.querySelector('[name="password"]').value,
  };

  // Validate
  if (!data.email) {
    showError('Email is required');
    return;
  }

  // Send data to server
  submitLogin(data);
});
```

### `FormData` — collecting all field values at once

```js
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  // Read individual fields
  console.log(formData.get('username'));

  // Iterate all fields
  for (const [name, value] of formData.entries()) {
    console.log(name, value);
  }

  // Convert to a plain object
  const data = Object.fromEntries(formData.entries());
  console.log(data);
});
```

### Preventing default and validating

```js
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = form.querySelector('[name="email"]');
  const password = form.querySelector('[name="password"]');

  // Simple manual validation
  let valid = true;

  if (!email.value.includes('@')) {
    email.setCustomValidity('Please enter a valid email address.');
    email.reportValidity();
    valid = false;
  } else {
    email.setCustomValidity('');
  }

  if (password.value.length < 8) {
    password.setCustomValidity('Password must be at least 8 characters.');
    password.reportValidity();
    valid = false;
  } else {
    password.setCustomValidity('');
  }

  if (!valid) return;

  // Proceed with form submission
});
```

### `reset` event

```js
form.addEventListener('reset', () => {
  console.log('Form was reset');
  clearAllErrors(); // custom cleanup
});
```

---

## 8. Extra: Performance Considerations

### Debounce input events

The `input` event fires on every keystroke. For expensive operations (search queries, resize calculations) debouncing reduces the call frequency:

```js
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = document.querySelector('#search');

search.addEventListener('input', debounce((event) => {
  fetchResults(event.target.value); // called at most once per 300ms
}, 300));
```

### Passive event listeners

For `scroll` and `touch` events, marking listeners as `passive` signals to the browser that `preventDefault()` will never be called, allowing it to start scrolling immediately without waiting for the listener to finish:

```js
window.addEventListener('scroll', onScroll, { passive: true });
```

---

## Summary

| Topic                     | Key API / Concept                                         |
|---------------------------|-----------------------------------------------------------|
| DOM tree                  | Nodes, parent/child/sibling relationships                 |
| Selecting elements        | `getElementById`, `querySelector`, `querySelectorAll`     |
| Modifying content         | `textContent`, `innerHTML`, `classList`, `style`          |
| Attributes                | `getAttribute/setAttribute`, `dataset`                    |
| Creating / inserting      | `createElement`, `appendChild`, `append`, `fragment`      |
| Removing                  | `remove()`, `removeChild()`                               |
| Event handling            | `addEventListener`, `removeEventListener`, event object   |
| Event flow                | Capture → target → bubble                                 |
| Event delegation          | One listener on a parent, `event.target.closest()`        |
| Forms                     | `input`, `change`, `submit`, `FormData`, `preventDefault` |

---

## Further Reading

- [MDN: Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [MDN: Locating DOM elements using selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors)
- [MDN: EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: Event delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- [MDN: FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [javascript.info: The DOM](https://javascript.info/document)
- [javascript.info: Events](https://javascript.info/events)
