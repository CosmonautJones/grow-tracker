// IndexedDB wrapper for local photo caching
// Database: GrowTrackerPhotos, store: photos (keyPath: id, index: growId)

const DB_NAME = 'GrowTrackerPhotos';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('growId', 'growId', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open failed:', request.error);
        dbPromise = null;
        reject(request.error);
      };
    } catch (e) {
      console.warn('IndexedDB unavailable:', e);
      dbPromise = null;
      reject(e);
    }
  });
  return dbPromise;
}

/**
 * Save (upsert) a photo's blobs to IndexedDB.
 */
export async function savePhoto(id, growId, fullBlob, thumbnailBlob) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({
        id,
        growId,
        fullBlob,
        thumbnailBlob,
        cachedAt: Date.now()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('savePhoto failed:', e);
  }
}

/**
 * Get a photo record by ID.
 * @returns {Promise<{id, growId, fullBlob, thumbnailBlob, cachedAt}|null>}
 */
export async function getPhoto(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

/**
 * Get all photo records for a grow.
 * @returns {Promise<Array>}
 */
export async function getPhotosByGrow(growId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const index = tx.objectStore(STORE_NAME).index('growId');
      const req = index.getAll(growId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return [];
  }
}

/**
 * Delete a single photo from IndexedDB.
 */
export async function deletePhoto(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('deletePhoto failed:', e);
  }
}

/**
 * Remove all cached photos for a grow.
 */
export async function clearGrowPhotos(growId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('growId');
      const req = index.openCursor(growId);
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('clearGrowPhotos failed:', e);
  }
}

/**
 * Check if a photo exists in IndexedDB.
 * @returns {Promise<boolean>}
 */
export async function hasPhoto(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).count(id);
      req.onsuccess = () => resolve(req.result > 0);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return false;
  }
}

/**
 * Get an object URL for a cached photo blob.
 * Caller is responsible for revoking the URL when done.
 * @param {string} id
 * @param {'full'|'thumbnail'} size
 * @returns {Promise<string|null>}
 */
export async function getPhotoObjectURL(id, size = 'thumbnail') {
  try {
    const record = await getPhoto(id);
    if (!record) return null;
    const blob = size === 'full' ? record.fullBlob : record.thumbnailBlob;
    if (!blob) return null;
    return URL.createObjectURL(blob);
  } catch (e) {
    return null;
  }
}
