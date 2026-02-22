// Export/import logic — JSON + CSV
import store from './store.js';
import * as fb from './firebase.js';
import { NUTRIENT_BRANDS, getMixingOrder } from './data/nutrient-schedules.js';
import { showToast } from './utils.js';

const EXPORT_VERSION = 1;

/**
 * Collect all data for a single grow.
 */
async function collectGrowData(growId) {
  const user = fb.getCurrentUser();
  let grow, notes, feedingLogs, photos, envLogs;

  if (user) {
    grow = await fb.getGrow(user.uid, growId);
    notes = await fb.getAllNotes(user.uid, growId);
    feedingLogs = await fb.getAllFeedingLogs(user.uid, growId);
    photos = await fb.getAllPhotos(user.uid, growId);
    envLogs = await fb.getAllEnvLogs(user.uid, growId);
  } else {
    const grows = store.get('grows') || {};
    grow = grows[growId] ? { ...grows[growId], id: growId } : null;
    notes = store.get(`grow_${growId}_notes`) || [];
    feedingLogs = store.get(`grow_${growId}_feedingLogs`) || [];
    photos = store.get(`grow_${growId}_photos`) || [];
    envLogs = store.get(`grow_${growId}_envLogs`) || [];
  }

  return { grow, notes, feedingLogs, photos, envLogs };
}

/**
 * Export a single grow as JSON and trigger download.
 */
export async function exportGrowAsJson(growId) {
  try {
    const data = await collectGrowData(growId);
    if (!data.grow) { showToast('Grow not found.', 'error'); return; }

    const envelope = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      type: 'single_grow',
      data: {
        [growId]: data
      }
    };

    downloadJson(envelope, `grow-${data.grow.strainName || growId}.json`);
    showToast('Grow exported successfully.', 'success');
  } catch (err) {
    console.error('Export error:', err);
    showToast('Failed to export grow.', 'error');
  }
}

/**
 * Export all grows as JSON and trigger download.
 */
export async function exportAllGrowsAsJson() {
  try {
    const user = fb.getCurrentUser();
    let growIds = [];

    if (user) {
      const grows = await fb.getAllGrows(user.uid);
      growIds = grows.map(g => g.id);
    } else {
      const grows = store.get('grows') || {};
      growIds = Object.keys(grows);
    }

    if (growIds.length === 0) {
      showToast('No grows to export.', 'error');
      return;
    }

    const allData = {};
    for (const id of growIds) {
      allData[id] = await collectGrowData(id);
    }

    const envelope = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      type: 'all_grows',
      data: allData
    };

    downloadJson(envelope, `grow-tracker-backup-${new Date().toISOString().split('T')[0]}.json`);
    showToast(`Exported ${growIds.length} grow(s).`, 'success');
  } catch (err) {
    console.error('Export all error:', err);
    showToast('Failed to export grows.', 'error');
  }
}

/**
 * Export feeding logs as CSV for a single grow.
 */
export async function exportFeedingLogsAsCsv(growId) {
  try {
    const { grow, feedingLogs } = await collectGrowData(growId);
    if (!feedingLogs || feedingLogs.length === 0) {
      showToast('No feeding logs to export.', 'error');
      return;
    }

    const brand = grow?.nutrientBrand || 'gh-flora-trio';
    const components = getMixingOrder(brand);

    // Build CSV header
    const headers = ['Date', 'Week', 'Water (gal)', ...components.map(c => c.name), 'Input PPM', 'Input pH', 'Runoff PPM', 'Runoff pH', 'Notes'];

    // Build rows
    const rows = feedingLogs
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .map(log => {
        const nutrientValues = components.map(c => log.nutrients?.[c.key] || 0);
        return [
          log.date || '',
          log.weekNumber || '',
          log.waterGallons || '',
          ...nutrientValues,
          log.inputPpm || '',
          log.inputPh || '',
          log.runoffPpm || '',
          log.runoffPh || '',
          `"${(log.notes || '').replace(/"/g, '""')}"`
        ];
      });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(csv, `feeding-log-${grow?.strainName || growId}.csv`);
    showToast('Feeding logs exported as CSV.', 'success');
  } catch (err) {
    console.error('CSV export error:', err);
    showToast('Failed to export feeding logs.', 'error');
  }
}

/**
 * Read and validate an import file. Returns parsed data for preview.
 */
export function importFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        // Validate structure
        if (!parsed.version || !parsed.data || typeof parsed.data !== 'object') {
          reject(new Error('Invalid export file format.'));
          return;
        }

        if (parsed.version > EXPORT_VERSION) {
          reject(new Error(`Export version ${parsed.version} is newer than supported (${EXPORT_VERSION}).`));
          return;
        }

        const growCount = Object.keys(parsed.data).length;
        const summary = Object.entries(parsed.data).map(([id, d]) => ({
          id,
          strainName: d.grow?.strainName || 'Unknown',
          plantType: d.grow?.plantType || 'unknown',
          notesCount: d.notes?.length || 0,
          logsCount: d.feedingLogs?.length || 0,
          envLogsCount: d.envLogs?.length || 0,
          photosCount: d.photos?.length || 0
        }));

        resolve({ parsed, summary, growCount });
      } catch (err) {
        reject(new Error('Invalid JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

/**
 * Apply imported data. strategy: 'skip' | 'overwrite' | 'duplicate'
 */
export async function applyImport(parsedData, strategy = 'skip') {
  const user = fb.getCurrentUser();
  let imported = 0;

  for (const [originalId, growData] of Object.entries(parsedData.data)) {
    if (!growData.grow) continue;

    let targetId = originalId;
    let shouldImport = true;

    // Check for existing grow
    let exists = false;
    if (user) {
      const existing = await fb.getGrow(user.uid, originalId);
      exists = !!existing;
    } else {
      const grows = store.get('grows') || {};
      exists = !!grows[originalId];
    }

    if (exists) {
      if (strategy === 'skip') {
        continue;
      } else if (strategy === 'duplicate') {
        targetId = 'import_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      }
      // 'overwrite' uses the same targetId
    }

    try {
      if (user) {
        if (strategy === 'duplicate' || !exists) {
          // Create new grow
          const { id, ...growConfig } = growData.grow;
          targetId = await fb.createGrow(user.uid, growConfig);
        } else {
          // Overwrite
          const { id, ...growConfig } = growData.grow;
          await fb.updateGrow(user.uid, targetId, growConfig);
        }

        // Import subcollections
        if (growData.notes) {
          for (const note of growData.notes) {
            const { id, ...noteData } = note;
            await fb.createNote(user.uid, targetId, noteData);
          }
        }
        if (growData.feedingLogs) {
          for (const log of growData.feedingLogs) {
            const { id, ...logData } = log;
            await fb.createFeedingLog(user.uid, targetId, logData);
          }
        }
        if (growData.envLogs) {
          for (const log of growData.envLogs) {
            const { id, ...logData } = log;
            await fb.createEnvLog(user.uid, targetId, logData);
          }
        }
        if (growData.photos) {
          for (const photo of growData.photos) {
            const { id, ...photoData } = photo;
            await fb.createPhotoDoc(user.uid, targetId, photoData);
          }
        }
      } else {
        // Local storage import
        const grows = store.get('grows') || {};
        const growConfig = { ...growData.grow, id: targetId };
        grows[targetId] = growConfig;
        store.set('grows', grows);

        if (growData.notes) {
          store.set(`grow_${targetId}_notes`, growData.notes.map(n => ({ ...n, id: n.id || 'note_' + Date.now() + Math.random() })));
        }
        if (growData.feedingLogs) {
          store.set(`grow_${targetId}_feedingLogs`, growData.feedingLogs.map(l => ({ ...l, id: l.id || 'log_' + Date.now() + Math.random() })));
        }
        if (growData.envLogs) {
          store.set(`grow_${targetId}_envLogs`, growData.envLogs.map(l => ({ ...l, id: l.id || 'env_' + Date.now() + Math.random() })));
        }
        if (growData.photos) {
          store.set(`grow_${targetId}_photos`, growData.photos.map(p => ({ ...p, id: p.id || 'photo_' + Date.now() + Math.random() })));
        }
      }
      imported++;
    } catch (err) {
      console.error(`Import error for grow ${originalId}:`, err);
    }
  }

  return imported;
}

// ── Download Helpers ──

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, filename);
}

function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
