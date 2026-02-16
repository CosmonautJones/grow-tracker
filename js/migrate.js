// One-time migration from old flat data to new multi-grow structure
import * as fb from './firebase.js';
import store from './store.js';

// Migrate old localStorage keys (unprefixed) to new gt_ prefixed store
function migrateLocalStorage() {
  const oldKeys = ['currentWeek', 'growMedium', 'growStartDate', 'autoUpdateWeek', 'growNotes', 'lastLocalUpdate'];
  let hasOldData = false;

  for (const key of oldKeys) {
    const val = localStorage.getItem(key);
    if (val !== null) {
      hasOldData = true;
      // Store under new prefix via store.set
      try {
        store.set(key, JSON.parse(val));
      } catch {
        store.set(key, val);
      }
      localStorage.removeItem(key);
    }
  }

  // Migrate checklist keys
  for (let w = 1; w <= 10; w++) {
    const ck = localStorage.getItem(`checklist_week_${w}`);
    if (ck !== null) {
      hasOldData = true;
      try {
        store.set(`checklist_week_${w}`, JSON.parse(ck));
      } catch {
        store.set(`checklist_week_${w}`, ck);
      }
      localStorage.removeItem(`checklist_week_${w}`);
    }
  }

  return hasOldData;
}

// Migrate old flat Firestore doc to new subcollection structure
async function migrateFirestore(uid) {
  const userDoc = await fb.getOldUserDoc(uid);
  if (!userDoc) return false;

  // Check if already migrated
  if (userDoc.migrationVersion >= 1) return false;

  // Check if grows subcollection already exists
  const existingGrows = await fb.getAllGrows(uid);
  if (existingGrows.length > 0) {
    // Already has grows, just mark as migrated
    await fb.setUserDoc(uid, { migrationVersion: 1 });
    return false;
  }

  // Check for old flat data fields
  const hasOldData = userDoc.currentWeek || userDoc.growMedium || userDoc.growStartDate || userDoc.growNotes;
  if (!hasOldData) return false;

  console.log('Migrating old Firestore data to new structure...');

  // Create a grow doc from old flat fields
  const growData = {
    status: 'active',
    plantType: 'autoflower',
    strainName: 'Migrated Grow',
    startDate: userDoc.growStartDate || '',
    endDate: '',
    growMedium: userDoc.growMedium || 'hydro',
    nutrientBrand: 'gh-flora-trio',
    containerSize: '',
    lightSetup: '',
    lightSchedule: '18/6',
    currentWeek: parseInt(userDoc.currentWeek) || 1,
    totalWeeks: 10,
    gallons: parseFloat(userDoc.gallons) || 1,
    autoUpdateWeek: userDoc.autoUpdateWeek === 'true',
    photoperiodVegWeeks: 4
  };

  const growId = await fb.createGrow(uid, growData);

  // Migrate checklists to week sub-docs
  if (userDoc.checklists) {
    for (const [week, data] of Object.entries(userDoc.checklists)) {
      await fb.setWeekDoc(uid, growId, week, { checklists: data });
    }
  }

  // Migrate growNotes as a single general note
  if (userDoc.growNotes && userDoc.growNotes.trim()) {
    await fb.createNote(uid, growId, {
      category: 'general',
      title: 'Migrated Notes',
      content: userDoc.growNotes,
      tags: ['migrated']
    });
  }

  // Update user doc with activeGrowId and migration version
  await fb.setUserDoc(uid, {
    activeGrowId: growId,
    migrationVersion: 1
  });

  // Also update local store
  store.set('activeGrowId', growId);

  console.log('Migration complete. New grow ID:', growId);
  return true;
}

// Also migrate local-only data into a local grow structure
function migrateLocalToGrow() {
  // Check if we already have local grows
  const existingGrows = store.get('grows');
  if (existingGrows && Object.keys(existingGrows).length > 0) return false;

  const currentWeek = store.get('currentWeek');
  const growMedium = store.get('growMedium');
  const startDate = store.get('growStartDate');
  const notes = store.get('growNotes');

  if (!currentWeek && !growMedium && !startDate) return false;

  const growId = 'local_' + Date.now();
  const grow = {
    id: growId,
    status: 'active',
    plantType: 'autoflower',
    strainName: 'Migrated Grow',
    startDate: startDate || '',
    growMedium: growMedium || 'hydro',
    nutrientBrand: 'gh-flora-trio',
    currentWeek: parseInt(currentWeek) || 1,
    totalWeeks: 10,
    gallons: 1,
    autoUpdateWeek: store.get('autoUpdateWeek') === true || store.get('autoUpdateWeek') === 'true',
    photoperiodVegWeeks: 4,
    createdAt: new Date().toISOString()
  };

  const grows = {};
  grows[growId] = grow;
  store.set('grows', grows);
  store.set('activeGrowId', growId);

  // Migrate checklist data under grow-specific keys
  for (let w = 1; w <= 10; w++) {
    const ck = store.get(`checklist_week_${w}`);
    if (ck) {
      store.set(`grow_${growId}_checklist_${w}`, ck);
    }
  }

  // Migrate notes
  if (notes && typeof notes === 'string' && notes.trim()) {
    const noteId = 'note_' + Date.now();
    const notesList = [{
      id: noteId,
      category: 'general',
      title: 'Migrated Notes',
      content: notes,
      tags: ['migrated'],
      createdAt: new Date().toISOString()
    }];
    store.set(`grow_${growId}_notes`, notesList);
  }

  return true;
}

export async function runMigration(uid) {
  // Step 1: Migrate old unprefixed localStorage keys to prefixed store
  migrateLocalStorage();

  // Step 2: Migrate local data into grow structure (for offline users)
  migrateLocalToGrow();

  // Step 3: If signed in, migrate Firestore
  if (uid) {
    const didMigrate = await migrateFirestore(uid);
    return didMigrate;
  }

  return false;
}
