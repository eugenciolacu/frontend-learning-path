/**
 * main.js — UI controller for the IndexedDB Contact Manager.
 */

let db          = null;
let editingId   = null;
let allContacts = [];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const fieldName    = document.getElementById('field-name');
const fieldEmail   = document.getElementById('field-email');
const fieldPhone   = document.getElementById('field-phone');
const fieldCompany = document.getElementById('field-company');
const fieldId      = document.getElementById('field-id');
const formTitle    = document.getElementById('form-title');
const btnSave      = document.getElementById('btn-save');
const btnCancel    = document.getElementById('btn-cancel');
const btnSeed      = document.getElementById('btn-seed');
const btnClearDb   = document.getElementById('btn-clear-db');
const searchInput  = document.getElementById('search-input');
const container    = document.getElementById('contacts-container');
const contactsTitle= document.getElementById('contacts-title');
const toast        = document.getElementById('toast');

// ─── Toast helper ─────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  toast.textContent  = message;
  toast.className    = `show ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.className = ''; }, 3000);
}

// ─── Initialise DB ────────────────────────────────────────────────────────────
(async () => {
  try {
    db = await openDB();
    showToast('IndexedDB opened successfully', 'success');
    await refreshList();
  } catch (err) {
    showToast('Failed to open IndexedDB: ' + err.message, 'error');
  }
})();

// ─── Render contacts table ────────────────────────────────────────────────────
async function refreshList(filter = '') {
  allContacts = await getAllContacts(db);
  renderContacts(allContacts, filter);
}

function renderContacts(contacts, filter = '') {
  const visible = filter
    ? contacts.filter(
        (c) =>
          c.name?.toLowerCase().includes(filter.toLowerCase()) ||
          c.email?.toLowerCase().includes(filter.toLowerCase())
      )
    : contacts;

  contactsTitle.textContent = `Contacts (${visible.length})`;

  if (visible.length === 0) {
    container.innerHTML = `<p class="empty-state">No contacts found. Add one above!</p>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Company</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${visible
          .map(
            (c) => `
          <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone || '—'}</td>
            <td>${c.company || '—'}</td>
            <td>
              <span class="tag ${c.syncStatus === 'synced' ? 'tag-synced' : 'tag-pending'}">
                ${c.syncStatus}
              </span>
            </td>
            <td>
              <button class="action-btn edit-btn"   data-id="${c.id}">Edit</button>
              <button class="action-btn delete-btn" data-id="${c.id}">Delete</button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  // Delegate click events on table actions
  container.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => startEdit(Number(btn.dataset.id)));
  });
  container.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleDelete(Number(btn.dataset.id)));
  });
}

// ─── Save (add or update) ─────────────────────────────────────────────────────
btnSave.addEventListener('click', async () => {
  const name    = fieldName.value.trim();
  const email   = fieldEmail.value.trim();

  if (!name || !email) {
    showToast('Name and Email are required', 'error');
    return;
  }

  const contact = {
    name,
    email,
    phone:   fieldPhone.value.trim(),
    company: fieldCompany.value.trim(),
  };

  try {
    if (editingId !== null) {
      // UPDATE — preserve the id
      await updateContact(db, { ...contact, id: editingId });
      showToast(`Contact #${editingId} updated`, 'success');
      cancelEdit();
    } else {
      // ADD
      const newId = await addContact(db, contact);
      showToast(`Contact added with ID ${newId}`, 'success');
      clearForm();
    }
    await refreshList(searchInput.value);
  } catch (err) {
    if (err.name === 'ConstraintError') {
      showToast('A contact with that email already exists', 'error');
    } else {
      showToast('Error saving contact: ' + err.message, 'error');
    }
  }
});

// ─── Edit ─────────────────────────────────────────────────────────────────────
async function startEdit(id) {
  const contact = await getContact(db, id);
  if (!contact) return;

  editingId          = id;
  fieldId.value      = id;
  fieldName.value    = contact.name;
  fieldEmail.value   = contact.email;
  fieldPhone.value   = contact.phone   || '';
  fieldCompany.value = contact.company || '';
  formTitle.textContent = `Edit Contact #${id}`;
  btnCancel.style.display = 'inline-block';
  fieldName.focus();
}

function cancelEdit() {
  editingId = null;
  clearForm();
  formTitle.textContent   = 'Add Contact';
  btnCancel.style.display = 'none';
}

btnCancel.addEventListener('click', cancelEdit);

function clearForm() {
  [fieldName, fieldEmail, fieldPhone, fieldCompany, fieldId].forEach(
    (f) => (f.value = '')
  );
}

// ─── Delete ───────────────────────────────────────────────────────────────────
async function handleDelete(id) {
  await deleteContact(db, id);
  showToast(`Contact #${id} deleted`, 'info');
  if (editingId === id) cancelEdit();
  await refreshList(searchInput.value);
}

// ─── Seed sample data ─────────────────────────────────────────────────────────
const SEED_DATA = [
  { name: 'Alice Smith',   email: 'alice@example.com',   phone: '+1 555-0100', company: 'Acme Corp' },
  { name: 'Bob Johnson',   email: 'bob@example.com',     phone: '+1 555-0101', company: 'Globex' },
  { name: 'Carol Williams',email: 'carol@example.com',   phone: '+1 555-0102', company: 'Initech' },
  { name: 'David Brown',   email: 'david@example.com',   phone: '+1 555-0103', company: 'Umbrella' },
  { name: 'Eva Davis',     email: 'eva@example.com',     phone: '',            company: 'Soylent' },
];

btnSeed.addEventListener('click', async () => {
  let added = 0;
  for (const contact of SEED_DATA) {
    try {
      await addContact(db, contact);
      added++;
    } catch {
      // Skip duplicates (ConstraintError on email index)
    }
  }
  showToast(`Seeded ${added} new contacts`, 'success');
  await refreshList(searchInput.value);
});

// ─── Clear database ───────────────────────────────────────────────────────────
btnClearDb.addEventListener('click', async () => {
  await clearContacts(db);
  showToast('All contacts deleted', 'info');
  cancelEdit();
  await refreshList();
});

// ─── Search ───────────────────────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  renderContacts(allContacts, searchInput.value);
});
