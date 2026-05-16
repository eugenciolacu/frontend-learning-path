/**
 * db.js — IndexedDB abstraction layer.
 *
 * Demonstrates:
 *  - Opening / versioning a database
 *  - Creating object stores and indexes in onupgradeneeded
 *  - Promise-wrapped CRUD helpers (add, get, getAll, getByIndex, put, delete)
 *  - Cursor iteration
 *  - Transactions (readwrite vs readonly)
 */

const DB_NAME    = 'ContactsDB';
const DB_VERSION = 1;
const STORE_NAME = 'contacts';

// ─── Open the database ────────────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Called when database is created for the first time or version changes
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create the "contacts" object store if it doesn't already exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,   // IDB generates the primary key
        });

        // Secondary indexes allow efficient lookup by non-key fields
        store.createIndex('email',   'email',   { unique: true  });
        store.createIndex('name',    'name',    { unique: false });
        store.createIndex('company', 'company', { unique: false });

        console.log('[DB] Object store and indexes created');
      }
    };

    request.onsuccess = (event) => {
      console.log('[DB] Opened successfully');
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('[DB] Open error:', event.target.error);
      reject(event.target.error);
    };

    request.onblocked = () => {
      // Another tab has the DB open with an older version
      console.warn('[DB] Upgrade blocked — close other tabs');
    };
  });
}

// ─── ADD ──────────────────────────────────────────────────────────────────────
function addContact(db, contact) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readwrite');
    const store   = tx.objectStore(STORE_NAME);
    const request = store.add({
      ...contact,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    });

    request.onsuccess = () => resolve(request.result); // Generated id
    request.onerror   = () => reject(request.error);
  });
}

// ─── GET by primary key ───────────────────────────────────────────────────────
function getContact(db, id) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readonly');
    const store   = tx.objectStore(STORE_NAME);
    const request = store.get(Number(id));

    request.onsuccess = () => resolve(request.result);
    request.onerror   = () => reject(request.error);
  });
}

// ─── GET by index ─────────────────────────────────────────────────────────────
function getContactByEmail(db, email) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readonly');
    const index   = tx.objectStore(STORE_NAME).index('email');
    const request = index.get(email);

    request.onsuccess = () => resolve(request.result);
    request.onerror   = () => reject(request.error);
  });
}

// ─── GET ALL (via cursor) ─────────────────────────────────────────────────────
function getAllContacts(db) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readonly');
    const store   = tx.objectStore(STORE_NAME);
    const results = [];

    // openCursor iterates over every record
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue(); // advance to next record
      } else {
        resolve(results); // null cursor = no more records
      }
    };

    request.onerror = () => reject(request.error);
  });
}

// ─── UPDATE (put = insert or replace) ────────────────────────────────────────
function updateContact(db, contact) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readwrite');
    const store   = tx.objectStore(STORE_NAME);
    const request = store.put({
      ...contact,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    });

    request.onsuccess = () => resolve();
    request.onerror   = () => reject(request.error);
  });
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
function deleteContact(db, id) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readwrite');
    const store   = tx.objectStore(STORE_NAME);
    const request = store.delete(Number(id));

    request.onsuccess = () => resolve();
    request.onerror   = () => reject(request.error);
  });
}

// ─── CLEAR all records ────────────────────────────────────────────────────────
function clearContacts(db) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE_NAME, 'readwrite');
    const store   = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror   = () => reject(request.error);
  });
}

// ─── MARK AS SYNCED (batch update example) ───────────────────────────────────
function markAllSynced(db) {
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.syncStatus === 'pending') {
          cursor.update({ ...cursor.value, syncStatus: 'synced' });
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}
