// Export/import logic — JSON + CSV + Zip (with photo data)
import store from './store.js';
import * as fb from './firebase.js';
import { NUTRIENT_BRANDS, getMixingOrder } from './data/nutrient-schedules.js';
import { showToast, showProgressModal } from './utils.js';
import * as photoDb from './photo-db.js';

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
 * Fetch a photo blob — tries IndexedDB cache first, then network fetch.
 * @returns {Promise<{fullBlob: Blob|null, thumbBlob: Blob|null}>}
 */
async function fetchPhotoBlobs(photo) {
  let fullBlob = null;
  let thumbBlob = null;

  // Try IndexedDB first
  const cached = await photoDb.getPhoto(photo.id);
  if (cached) {
    fullBlob = cached.fullBlob || null;
    thumbBlob = cached.thumbnailBlob || null;
  }

  // Fallback to network fetch for missing blobs
  if (!fullBlob && photo.url) {
    try { fullBlob = await fetch(photo.url).then(r => r.ok ? r.blob() : null); } catch (e) { /* skip */ }
  }
  if (!thumbBlob && photo.thumbnailUrl) {
    try { thumbBlob = await fetch(photo.thumbnailUrl).then(r => r.ok ? r.blob() : null); } catch (e) { /* skip */ }
  }

  return { fullBlob, thumbBlob };
}

/**
 * Export a single grow as JSON and trigger download.
 */
export async function exportGrowAsJson(growId) {
  try {
    const data = await collectGrowData(growId);
    if (!data.grow) { showToast('Grow not found.', 'error'); return; }

    // If photos exist and JSZip is available, use zip export
    if (data.photos && data.photos.length > 0 && typeof JSZip !== 'undefined') {
      await exportGrowAsZip(growId);
      return;
    }

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
 * Export a single grow as a zip file with embedded photo data.
 */
export async function exportGrowAsZip(growId) {
  const progress = showProgressModal('Exporting Grow');
  try {
    progress.update(5, 'Collecting grow data...');
    const data = await collectGrowData(growId);
    if (!data.grow) { progress.close(); showToast('Grow not found.', 'error'); return; }

    const zip = new JSZip();
    const photos = data.photos || [];
    let photosWithFiles = [];

    // Fetch and add photo blobs
    for (let i = 0; i < photos.length; i++) {
      const pct = 10 + (i / Math.max(photos.length, 1)) * 70;
      progress.update(pct, `Packing photo ${i + 1} of ${photos.length}...`);

      const { fullBlob, thumbBlob } = await fetchPhotoBlobs(photos[i]);
      const photoMeta = { ...photos[i] };

      if (fullBlob) {
        const filename = `photos/${photos[i].id}.jpg`;
        zip.file(filename, fullBlob);
        photoMeta.localFile = filename;
      }
      if (thumbBlob) {
        const thumbname = `thumbs/${photos[i].id}.jpg`;
        zip.file(thumbname, thumbBlob);
        photoMeta.localThumb = thumbname;
      }
      photosWithFiles.push(photoMeta);
    }

    // Build metadata
    const metaData = { ...data, photos: photosWithFiles };
    const envelope = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      type: 'single_grow',
      data: { [growId]: metaData }
    };

    zip.file('metadata.json', JSON.stringify(envelope, null, 2));

    progress.update(85, 'Generating zip file...');
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });

    triggerDownload(blob, `grow-${data.grow.strainName || growId}.zip`);
    progress.update(100, 'Done!');
    setTimeout(() => progress.close(), 500);
    showToast('Grow exported as zip with photos.', 'success');
  } catch (err) {
    progress.close();
    console.error('Zip export error:', err);
    showToast('Failed to export grow as zip.', 'error');
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

    // Check if any grow has photos and JSZip is available
    let hasPhotos = false;
    const allData = {};
    for (const id of growIds) {
      allData[id] = await collectGrowData(id);
      if (allData[id].photos && allData[id].photos.length > 0) hasPhotos = true;
    }

    if (hasPhotos && typeof JSZip !== 'undefined') {
      await exportAllGrowsAsZip(allData, growIds);
      return;
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
 * Export all grows as a zip with embedded photos.
 */
async function exportAllGrowsAsZip(allData, growIds) {
  const progress = showProgressModal('Exporting All Grows');
  try {
    const zip = new JSZip();
    let totalPhotos = 0;
    let processedPhotos = 0;

    for (const id of growIds) {
      totalPhotos += (allData[id].photos || []).length;
    }

    progress.update(5, `Packing ${growIds.length} grow(s) with ${totalPhotos} photo(s)...`);

    for (const growId of growIds) {
      const data = allData[growId];
      const photos = data.photos || [];
      let photosWithFiles = [];

      for (const photo of photos) {
        processedPhotos++;
        const pct = 10 + (processedPhotos / Math.max(totalPhotos, 1)) * 70;
        progress.update(pct, `Photo ${processedPhotos} of ${totalPhotos}...`);

        const { fullBlob, thumbBlob } = await fetchPhotoBlobs(photo);
        const photoMeta = { ...photo };

        if (fullBlob) {
          const filename = `${growId}/photos/${photo.id}.jpg`;
          zip.file(filename, fullBlob);
          photoMeta.localFile = filename;
        }
        if (thumbBlob) {
          const thumbname = `${growId}/thumbs/${photo.id}.jpg`;
          zip.file(thumbname, thumbBlob);
          photoMeta.localThumb = thumbname;
        }
        photosWithFiles.push(photoMeta);
      }

      allData[growId] = { ...data, photos: photosWithFiles };
    }

    const envelope = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      type: 'all_grows',
      data: allData
    };

    zip.file('metadata.json', JSON.stringify(envelope, null, 2));

    progress.update(85, 'Generating zip file...');
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });

    triggerDownload(blob, `grow-tracker-backup-${new Date().toISOString().split('T')[0]}.zip`);
    progress.update(100, 'Done!');
    setTimeout(() => progress.close(), 500);
    showToast(`Exported ${growIds.length} grow(s) with photos.`, 'success');
  } catch (err) {
    progress.close();
    console.error('Zip export all error:', err);
    showToast('Failed to export grows as zip.', 'error');
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
 * Read and validate an import file (JSON or Zip).
 * Returns parsed data for preview + optional photoBlobs map.
 */
export async function importFromFile(file) {
  const isZip = file.name.endsWith('.zip') || await isZipFile(file);

  if (isZip && typeof JSZip !== 'undefined') {
    return importFromZip(file);
  }
  return importFromJson(file);
}

/**
 * Check if a file is a zip by reading magic bytes.
 */
async function isZipFile(file) {
  try {
    const header = await file.slice(0, 4).arrayBuffer();
    const view = new DataView(header);
    return view.getUint32(0, false) === 0x504B0304; // PK\x03\x04
  } catch (e) {
    return false;
  }
}

/**
 * Import from a zip file — extracts metadata.json + builds photoBlobs map.
 */
async function importFromZip(file) {
  const zip = await JSZip.loadAsync(file);
  const metaFile = zip.file('metadata.json');
  if (!metaFile) throw new Error('Invalid zip: missing metadata.json');

  const metaText = await metaFile.async('text');
  const parsed = JSON.parse(metaText);

  if (!parsed.version || !parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Invalid export file format.');
  }
  if (parsed.version > EXPORT_VERSION) {
    throw new Error(`Export version ${parsed.version} is newer than supported (${EXPORT_VERSION}).`);
  }

  // Build photoBlobs map: key = "growId/photoId" → {fullBlob, thumbBlob}
  const photoBlobs = new Map();
  for (const [growId, growData] of Object.entries(parsed.data)) {
    if (!growData.photos) continue;
    for (const photo of growData.photos) {
      const entry = {};
      if (photo.localFile) {
        const f = zip.file(photo.localFile);
        if (f) entry.fullBlob = await f.async('blob');
      }
      if (photo.localThumb) {
        const t = zip.file(photo.localThumb);
        if (t) entry.thumbBlob = await t.async('blob');
      }
      if (entry.fullBlob || entry.thumbBlob) {
        photoBlobs.set(`${growId}/${photo.id}`, entry);
      }
    }
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

  return { parsed, summary, growCount, photoBlobs };
}

/**
 * Read and validate a JSON import file. Returns parsed data for preview.
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

        resolve({ parsed, summary, growCount, photoBlobs: null });
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
 * @param {object} parsedData
 * @param {string} strategy
 * @param {Map|null} photoBlobs — from zip import
 * @param {function|null} onProgress — (pct, msg) callback
 */
export async function applyImport(parsedData, strategy = 'skip', photoBlobs = null, onProgress = null) {
  const user = fb.getCurrentUser();
  let imported = 0;
  const entries = Object.entries(parsedData.data);
  const totalEntries = entries.length;

  for (let gi = 0; gi < entries.length; gi++) {
    const [originalId, growData] = entries[gi];
    if (!growData.grow) continue;

    if (onProgress) {
      const basePct = (gi / totalEntries) * 100;
      onProgress(basePct, `Importing grow ${gi + 1} of ${totalEntries}...`);
    }

    let targetId = originalId;

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
          const { id, ...growConfig } = growData.grow;
          targetId = await fb.createGrow(user.uid, growConfig);
        } else {
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

        // Import photos — with blob re-upload if available
        if (growData.photos) {
          const photos = growData.photos;
          // Process in batches of 3 for concurrency
          for (let i = 0; i < photos.length; i += 3) {
            const batch = photos.slice(i, i + 3);
            await Promise.all(batch.map(async (photo) => {
              const blobKey = `${originalId}/${photo.id}`;
              const blobs = photoBlobs ? photoBlobs.get(blobKey) : null;

              if (blobs && blobs.fullBlob) {
                // Re-upload photo to new user's Storage
                try {
                  const fullFile = new File([blobs.fullBlob], `${photo.id}.jpg`, { type: 'image/jpeg' });
                  const { url, storagePath } = await fb.uploadPhoto(user.uid, targetId, fullFile);

                  let thumbnailUrl = photo.thumbnailUrl || '';
                  let thumbStoragePath = photo.thumbStoragePath || '';
                  if (blobs.thumbBlob) {
                    const thumbResult = await fb.uploadThumbnail(user.uid, targetId, blobs.thumbBlob);
                    thumbnailUrl = thumbResult.url;
                    thumbStoragePath = thumbResult.storagePath;
                  }

                  const { id: _id, localFile, localThumb, url: _oldUrl, thumbnailUrl: _oldThumb, storagePath: _oldPath, thumbStoragePath: _oldThumbPath, ...restPhoto } = photo;
                  await fb.createPhotoDoc(user.uid, targetId, {
                    ...restPhoto,
                    url,
                    storagePath,
                    thumbnailUrl,
                    thumbStoragePath
                  });

                  // Cache in IndexedDB
                  const newPhotoId = photo.id || 'photo_' + Date.now();
                  await photoDb.savePhoto(newPhotoId, targetId, blobs.fullBlob, blobs.thumbBlob);
                } catch (uploadErr) {
                  console.error('Photo re-upload error:', uploadErr);
                  // Fallback: import metadata only
                  const { id: _id, localFile, localThumb, ...photoData } = photo;
                  await fb.createPhotoDoc(user.uid, targetId, photoData);
                }
              } else {
                // No blobs — metadata-only import
                const { id: _id, localFile, localThumb, ...photoData } = photo;
                await fb.createPhotoDoc(user.uid, targetId, photoData);
              }
            }));

            if (onProgress) {
              const basePct = (gi / totalEntries) * 100;
              const photoPct = ((i + batch.length) / photos.length) * (100 / totalEntries);
              onProgress(basePct + photoPct, `Uploading photos...`);
            }
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
          const cleanPhotos = growData.photos.map(p => {
            const { localFile, localThumb, ...rest } = p;
            return { ...rest, id: p.id || 'photo_' + Date.now() + Math.random() };
          });
          store.set(`grow_${targetId}_photos`, cleanPhotos);
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
