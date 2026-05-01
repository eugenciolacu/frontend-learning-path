// ─────────────────────────────────────────────────────────────────────────────
// Example 6 – Forms & Input Events
// Covers: input, change, focus, blur, submit, reset, FormData, validation
// ─────────────────────────────────────────────────────────────────────────────

const form          = document.querySelector('#registration-form');
const usernameInput = form.querySelector('#username');
const emailInput    = form.querySelector('#email');
const passwordInput = form.querySelector('#password');
const roleSelect    = form.querySelector('#role');
const skillsSelect  = form.querySelector('#skills');
const subscribeBox  = form.querySelector('#subscribe');
const bioTextarea   = form.querySelector('#bio');

// ─────────────────────────────────────────────────────────────────────────────
// 1. Character counter — fires on every keystroke (input event)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Updates a character counter element.
 * The `input` event fires synchronously after the value changes.
 */
function attachCharCounter(inputEl, counterId, max) {
  const counter = document.querySelector(`#${counterId}`);

  inputEl.addEventListener('input', () => {
    const len = inputEl.value.length;
    counter.textContent = `${len} / ${max}`;
    counter.style.color = len >= max ? '#ef4444' : '#888';
  });
}

attachCharCounter(usernameInput, 'username-count', 20);
attachCharCounter(bioTextarea,   'bio-count',      200);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Password strength indicator — uses `input` event
// ─────────────────────────────────────────────────────────────────────────────
const strengthFill  = document.querySelector('#strength-fill');
const strengthLabel = document.querySelector('#strength-label');

function measureStrength(password) {
  let score = 0;
  if (password.length >= 8)              score++;
  if (password.length >= 12)             score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))   score++;
  return score; // 0–5
}

passwordInput.addEventListener('input', () => {
  const score = measureStrength(passwordInput.value);
  const pct   = (score / 5) * 100;

  strengthFill.style.width = `${pct}%`;

  const colors  = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
  const labels  = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  if (passwordInput.value.length === 0) {
    strengthFill.style.width = '0%';
    strengthLabel.textContent = '';
  } else {
    const idx = Math.max(0, score - 1);
    strengthFill.style.background = colors[idx];
    strengthLabel.textContent = labels[idx];
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. focus / blur — visual feedback + live validation on blur
// ─────────────────────────────────────────────────────────────────────────────

/** Show an error message under a field. Pass '' to clear. */
function setFieldError(inputEl, errorId, message) {
  const errorEl = document.querySelector(`#${errorId}`);
  errorEl.textContent = message;
  inputEl.classList.toggle('invalid', Boolean(message));
  inputEl.classList.toggle('valid',   !message && inputEl.value.length > 0);
}

// Username: validate on blur (when user leaves the field)
usernameInput.addEventListener('blur', () => {
  const val = usernameInput.value.trim();

  if (val.length === 0) {
    setFieldError(usernameInput, 'username-error', 'Username is required.');
  } else if (val.length < 3) {
    setFieldError(usernameInput, 'username-error', 'Must be at least 3 characters.');
  } else if (/[^a-zA-Z0-9_]/.test(val)) {
    setFieldError(usernameInput, 'username-error', 'Only letters, digits, and underscores allowed.');
  } else {
    setFieldError(usernameInput, 'username-error', '');
  }
});

// Clear error while the user is actively typing
usernameInput.addEventListener('input', () => {
  if (usernameInput.classList.contains('invalid')) {
    setFieldError(usernameInput, 'username-error', '');
  }
});

// Email: validate on blur
emailInput.addEventListener('blur', () => {
  const val = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  if (!val) {
    setFieldError(emailInput, 'email-error', 'Email is required.');
  } else if (!valid) {
    setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
  } else {
    setFieldError(emailInput, 'email-error', '');
  }
});

// Password: validate on blur
passwordInput.addEventListener('blur', () => {
  if (passwordInput.value.length < 8 && passwordInput.value.length > 0) {
    setFieldError(passwordInput, 'password-error', 'Password must be at least 8 characters.');
  } else if (passwordInput.value.length === 0) {
    setFieldError(passwordInput, 'password-error', 'Password is required.');
  } else {
    setFieldError(passwordInput, 'password-error', '');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. change event — fires when value commits (on select, checkbox, and when
//    text input loses focus with a modified value)
// ─────────────────────────────────────────────────────────────────────────────
roleSelect.addEventListener('change', () => {
  console.log('Role selected (change):', roleSelect.value);
});

skillsSelect.addEventListener('change', () => {
  const selected = [...skillsSelect.selectedOptions].map(o => o.value);
  console.log('Skills selected (change):', selected);
});

subscribeBox.addEventListener('change', () => {
  console.log('Newsletter subscribe:', subscribeBox.checked);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. submit event — collect values, validate, and display FormData
// ─────────────────────────────────────────────────────────────────────────────
form.addEventListener('submit', (event) => {
  // ALWAYS prevent default first to stop the page from refreshing
  event.preventDefault();

  // Run validation
  let valid = true;

  const username = usernameInput.value.trim();
  if (!username || username.length < 3) {
    setFieldError(usernameInput, 'username-error', 'Username must be at least 3 characters.');
    valid = false;
  }

  const email = emailInput.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
    valid = false;
  }

  const password = passwordInput.value;
  if (password.length < 8) {
    setFieldError(passwordInput, 'password-error', 'Password must be at least 8 characters.');
    valid = false;
  }

  if (!valid) {
    console.warn('Form is invalid — not submitting');
    return;
  }

  // ── Collect values using FormData ──────────────────────────────────────
  // FormData automatically picks up all named form fields.
  const formData = new FormData(event.target);

  // For multi-select, getAll() returns an array of all selected values
  const selectedSkills = formData.getAll('skills');

  // Build a plain object for display (Object.fromEntries gives only the last
  // value for repeated keys, so we handle skills separately)
  const data = Object.fromEntries(formData.entries());
  data.skills    = selectedSkills;
  data.subscribe = subscribeBox.checked; // checkbox: .get() gives the value, not a boolean

  // Display submitted data
  const previewSection = document.querySelector('#preview-section');
  const previewOutput  = document.querySelector('#preview-output');

  previewSection.hidden = false;
  previewOutput.textContent = JSON.stringify(data, null, 2);

  console.log('Form submitted successfully:', data);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. reset event — clean up custom UI state when the form is reset
// ─────────────────────────────────────────────────────────────────────────────
form.addEventListener('reset', () => {
  // Clear all error messages
  document.querySelectorAll('.error-msg').forEach(el => (el.textContent = ''));

  // Clear valid/invalid classes
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.classList.remove('valid', 'invalid');
  });

  // Reset char counters
  document.querySelector('#username-count').textContent = '0 / 20';
  document.querySelector('#bio-count').textContent      = '0 / 200';

  // Reset strength bar
  strengthFill.style.width      = '0%';
  strengthFill.style.background = '';
  strengthLabel.textContent     = '';

  // Hide preview
  document.querySelector('#preview-section').hidden = true;

  console.log('Form reset — UI state cleared');
});
