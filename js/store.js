// Centralized state store — replaces scattered localStorage calls
// Writes to localStorage + notifies subscribers

const PREFIX = 'gt_';
const listeners = new Map();

// Internal: get raw value from localStorage
function rawGet(key) {
  try {
    const val = localStorage.getItem(PREFIX + key);
    if (val === null) return undefined;
    return JSON.parse(val);
  } catch {
    return localStorage.getItem(PREFIX + key);
  }
}

// Internal: set raw value to localStorage
function rawSet(key, value) {
  if (value === undefined || value === null) {
    localStorage.removeItem(PREFIX + key);
  } else {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }
}

const store = {
  get(key) {
    return rawGet(key);
  },

  set(key, value) {
    const oldValue = rawGet(key);
    rawSet(key, value);
    notify(key, value, oldValue);
  },

  // Get a nested path like 'grow.abc123.currentWeek'
  getPath(path) {
    const parts = path.split('.');
    return rawGet(parts.join('.'));
  },

  setPath(path, value) {
    const oldValue = rawGet(path);
    rawSet(path, value);
    notify(path, value, oldValue);
  },

  // Subscribe to changes on a key (or '*' for all changes)
  subscribe(keyOrPattern, callback) {
    if (!listeners.has(keyOrPattern)) {
      listeners.set(keyOrPattern, new Set());
    }
    listeners.get(keyOrPattern).add(callback);

    // Return unsubscribe function
    return () => {
      const set = listeners.get(keyOrPattern);
      if (set) {
        set.delete(callback);
        if (set.size === 0) listeners.delete(keyOrPattern);
      }
    };
  },

  // Remove a key
  remove(key) {
    const oldValue = rawGet(key);
    localStorage.removeItem(PREFIX + key);
    notify(key, undefined, oldValue);
  },

  // Batch update — sets multiple keys, fires one notification per key
  batch(updates) {
    for (const [key, value] of Object.entries(updates)) {
      this.set(key, value);
    }
  },

  // Clear all store data
  clear() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    notify('*', null, null);
  }
};

function notify(key, newValue, oldValue) {
  // Notify exact-match listeners
  const exact = listeners.get(key);
  if (exact) {
    exact.forEach(cb => {
      try { cb(newValue, oldValue, key); } catch (e) { console.error('Store listener error:', e); }
    });
  }

  // Notify wildcard listeners
  const wildcard = listeners.get('*');
  if (wildcard) {
    wildcard.forEach(cb => {
      try { cb(newValue, oldValue, key); } catch (e) { console.error('Store listener error:', e); }
    });
  }
}

export default store;
