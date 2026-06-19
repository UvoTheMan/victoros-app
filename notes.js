// ============================================================
// notes.js — VictorOS Note Storage
// Uses IndexedDB for persistent, offline-capable note saving
// One note entry per day (keyed by day ID e.g. "W1D1")
// ============================================================

const Notes = (() => {

  const DB_NAME    = 'victoros_db';
  const DB_VERSION = 1;
  const STORE_NAME = 'notes';

  let _db = null;

  // ─── Open / initialize the database ───
  function openDB() {
    return new Promise((resolve, reject) => {
      if (_db) return resolve(_db);

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const db    = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'dayId' });
          store.createIndex('week',  'week',  { unique: false });
          store.createIndex('phase', 'phase', { unique: false });
        }
      };

      request.onsuccess = event => {
        _db = event.target.result;
        resolve(_db);
      };

      request.onerror = event => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // ─── Save or update a note ───
  async function saveNote(dayId, content, meta = {}) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const entry = {
        dayId,
        content,
        savedAt: new Date().toISOString(),
        week:    meta.week  || null,
        phase:   meta.phase || null,
        topic:   meta.topic || null,
        date:    meta.date  || null,
      };

      const req = store.put(entry);
      req.onsuccess = () => resolve(true);
      req.onerror   = () => reject(req.error);
    });
  }

  // ─── Load a single note by day ID ───
  async function loadNote(dayId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.get(dayId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => reject(req.error);
    });
  }

  // ─── Load ALL notes (for the notes archive view) ───
  async function loadAllNotes() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.getAll();
      req.onsuccess = () => {
        // Sort by savedAt descending (most recent first)
        const sorted = (req.result || []).sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
        );
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // ─── Search notes by keyword ───
  async function searchNotes(query) {
    const all = await loadAllNotes();
    if (!query || !query.trim()) return all;

    const q = query.toLowerCase();
    return all.filter(note =>
      (note.content && note.content.toLowerCase().includes(q)) ||
      (note.topic   && note.topic.toLowerCase().includes(q))
    );
  }

  // ─── Delete a note ───
  async function deleteNote(dayId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.delete(dayId);
      req.onsuccess = () => resolve(true);
      req.onerror   = () => reject(req.error);
    });
  }

  // ─── Export all notes as JSON string ───
  async function exportNotes() {
    const all = await loadAllNotes();
    return JSON.stringify(all, null, 2);
  }

  // ─── Public API ───
  return {
    save:       saveNote,
    load:       loadNote,
    loadAll:    loadAllNotes,
    search:     searchNotes,
    delete:     deleteNote,
    export:     exportNotes,
  };

})();
