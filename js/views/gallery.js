// Photo gallery with upload, lightbox, filtering — IndexedDB cache + offline support
import store from '../store.js';
import * as fb from '../firebase.js';
import { updateNav } from '../components/header.js';
import { processImage, renderUploadButton } from '../components/photo-upload.js';
import { escapeHtml, isValidGrowId, showConfirmModal, showToast } from '../utils.js';
import * as photoDb from '../photo-db.js';

const PHOTO_CATEGORIES = [
  { key: 'plant', label: 'Plant' },
  { key: 'trichome', label: 'Trichome' },
  { key: 'setup', label: 'Setup' },
  { key: 'issue', label: 'Issue' },
  { key: 'harvest', label: 'Harvest' }
];

let growId = null;
let photos = [];
let unsubPhotos = null;
let filterWeek = '';
let filterCategory = '';
let pendingProcessResult = null;
let activeObjectURLs = [];

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <section class="gallery-section">
      <div class="section-header-row">
        <h2>Photo Gallery</h2>
        <div id="uploadArea"></div>
      </div>

      <div class="gallery-upload-meta hidden" id="uploadMeta">
        <p class="upload-meta-hint">Add details before confirming the upload.</p>
        <div class="wizard-form-grid">
          <div class="input-group">
            <label>Caption</label>
            <input type="text" id="photoCaption" placeholder="Photo caption">
          </div>
          <div class="input-group">
            <label>Week</label>
            <input type="number" id="photoWeek" min="1" placeholder="Week #">
          </div>
          <div class="input-group">
            <label>Category</label>
            <select id="photoCategory">
              ${PHOTO_CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="gallery-filters">
        <select id="galleryFilterCategory">
          <option value="">All Categories</option>
          ${PHOTO_CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
        </select>
        <input type="number" id="galleryFilterWeek" placeholder="Week #" min="1" style="width:80px;">
      </div>

      <div id="photoGrid" class="photo-grid">
        <div class="loading-spinner-container"><div class="spinner"></div><span>Loading photos...</span></div>
      </div>

      <!-- Lightbox -->
      <div id="lightbox" class="lightbox-overlay hidden" role="dialog" aria-modal="true" aria-label="Photo lightbox">
        <div class="lightbox-content">
          <button id="lightboxClose" class="lightbox-close" aria-label="Close lightbox">&times;</button>
          <img id="lightboxImage" src="" alt="">
          <div class="lightbox-info">
            <p id="lightboxCaption"></p>
            <p id="lightboxMeta" class="text-muted"></p>
            <button id="lightboxDelete" class="danger-btn small-btn">Delete Photo</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function init(params) {
  growId = params.id;

  // Validate grow ID
  if (!isValidGrowId(growId)) {
    import('../router.js').then(m => m.default.navigate('/dashboard'));
    return;
  }

  updateNav(growId);

  // Upload button — two-phase: select file, then confirm
  renderUploadButton(document.getElementById('uploadArea'), {
    onFileSelected: handleFileSelected,
    onConfirm: handleConfirmUpload,
    onCancel: handleUploadCancel
  });

  // Filters
  document.getElementById('galleryFilterCategory').addEventListener('change', (e) => { filterCategory = e.target.value; renderPhotos(); });
  document.getElementById('galleryFilterWeek').addEventListener('input', (e) => { filterWeek = e.target.value; renderPhotos(); });

  // Lightbox close
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  // Delegated click handler for photo grid
  document.getElementById('photoGrid').addEventListener('click', (e) => {
    const item = e.target.closest('.photo-grid-item');
    if (!item) return;
    const photoId = item.dataset.photoId;
    const photo = photos.find(p => p.id === photoId);
    if (photo) openLightbox(photo);
  });

  loadPhotos();
}

function loadPhotos() {
  const user = fb.getCurrentUser();
  if (user) {
    unsubPhotos = fb.onAllPhotos(user.uid, growId, (data) => {
      photos = data;
      renderPhotos();
      warmPhotoCache(data);
    });
  } else {
    photos = store.get(`grow_${growId}_photos`) || [];
    renderPhotos();
  }
}

function handleFileSelected(file) {
  const user = fb.getCurrentUser();
  if (!user) {
    showToast('Please sign in to upload photos.', 'error');
    return;
  }

  // Show metadata form
  document.getElementById('uploadMeta').classList.remove('hidden');

  // Start image processing optimistically in background
  pendingProcessResult = processImage(file);
}

async function handleConfirmUpload(file, onProgress) {
  const user = fb.getCurrentUser();
  if (!user) {
    showToast('Please sign in to upload photos.', 'error');
    return;
  }

  try {
    // Read metadata from form before upload
    const caption = document.getElementById('photoCaption').value.trim();
    const week = parseInt(document.getElementById('photoWeek').value) || null;
    const category = document.getElementById('photoCategory').value;

    // Await the pre-started image processing
    const { fullBlob, thumbnailBlob } = await pendingProcessResult;

    // Upload full-size image
    const fullFile = new File([fullBlob], file.name, { type: 'image/jpeg' });
    const { url, storagePath } = await fb.uploadPhoto(user.uid, growId, fullFile, onProgress);

    // Upload thumbnail (small, no progress tracking needed)
    const { url: thumbnailUrl, storagePath: thumbStoragePath } = await fb.uploadThumbnail(user.uid, growId, thumbnailBlob);

    // Create photo document with both URLs
    const photoDocId = await fb.createPhotoDoc(user.uid, growId, {
      storagePath,
      url,
      thumbnailUrl,
      thumbStoragePath,
      caption,
      week,
      category
    });

    // Cache blobs in IndexedDB (write-through)
    if (photoDocId) {
      photoDb.savePhoto(photoDocId, growId, fullBlob, thumbnailBlob).catch(e => {
        console.warn('IndexedDB cache write failed:', e);
      });
    }

    // Reset meta fields
    document.getElementById('photoCaption').value = '';
    document.getElementById('photoWeek').value = '';
    document.getElementById('uploadMeta').classList.add('hidden');
    pendingProcessResult = null;
  } catch (err) {
    console.error('Photo upload error:', err);
    showToast(getUploadErrorMessage(err), 'error');
    pendingProcessResult = null;
    throw err; // Re-throw so the upload button shows error state
  }
}

function handleUploadCancel() {
  document.getElementById('photoCaption').value = '';
  document.getElementById('photoWeek').value = '';
  document.getElementById('uploadMeta').classList.add('hidden');
  pendingProcessResult = null;
}

function getUploadErrorMessage(err) {
  if (err && err.code) {
    switch (err.code) {
      case 'storage/unauthorized':
        return 'Permission denied. Please check that Firebase Storage is enabled and security rules are configured.';
      case 'storage/canceled':
        return 'Upload was cancelled.';
      case 'storage/quota-exceeded':
        return 'Storage quota exceeded. Please free up space or upgrade your plan.';
      case 'storage/unauthenticated':
        return 'Please sign in to upload photos.';
      case 'storage/retry-limit-exceeded':
        return 'Upload timed out. Please check your connection and try again.';
      case 'storage/invalid-checksum':
        return 'File was corrupted during upload. Please try again.';
      default:
        return 'Failed to upload photo. Please try again.';
    }
  }
  return 'Failed to upload photo. Please try again.';
}

function renderPhotos() {
  const container = document.getElementById('photoGrid');
  if (!container) return;

  let filtered = [...photos];
  if (filterCategory) {
    filtered = filtered.filter(p => p.category === filterCategory);
  }
  if (filterWeek !== '' && filterWeek !== undefined) {
    filtered = filtered.filter(p => p.week != null && String(p.week) === filterWeek);
  }

  filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No photos yet. Upload one above!</p></div>';
    return;
  }

  // Revoke old object URLs
  revokeObjectURLs();

  // Render skeleton placeholders first
  container.innerHTML = filtered.map(p => {
    const alt = p.caption || `${p.category || 'plant'} photo${p.week ? ', week ' + p.week : ''}`;
    return `
    <div class="photo-grid-item" data-photo-id="${escapeHtml(p.id)}">
      <div class="photo-skeleton"></div>
      <img data-photo-id="${escapeHtml(p.id)}"
           data-thumb-url="${escapeHtml(p.thumbnailUrl || p.url || '')}"
           alt="${escapeHtml(alt)}"
           loading="lazy"
           style="display:none;">
      <div class="photo-grid-overlay">
        <span>${escapeHtml(p.caption || '')}</span>
        ${p.week ? `<span>Week ${escapeHtml(String(p.week))}</span>` : ''}
      </div>
    </div>
  `; }).join('');

  // Load thumbnails — IndexedDB first, then URL fallback
  container.querySelectorAll('img[data-photo-id]').forEach(img => {
    const photoId = img.dataset.photoId;
    const thumbUrl = img.dataset.thumbUrl;
    const skeleton = img.previousElementSibling;

    loadThumbnail(img, skeleton, photoId, thumbUrl);
  });
}

async function loadThumbnail(img, skeleton, photoId, fallbackUrl) {
  // Try IndexedDB first
  const objectUrl = await photoDb.getPhotoObjectURL(photoId, 'thumbnail');
  if (objectUrl) {
    activeObjectURLs.push(objectUrl);
    img.src = objectUrl;
    img.onload = () => { skeleton.style.display = 'none'; img.style.display = ''; };
    img.onerror = () => showBrokenPlaceholder(img, skeleton);
    return;
  }

  // Fallback to URL
  if (fallbackUrl) {
    img.src = fallbackUrl;
    img.onload = () => { skeleton.style.display = 'none'; img.style.display = ''; };
    img.onerror = () => showBrokenPlaceholder(img, skeleton);
  } else {
    showBrokenPlaceholder(img, skeleton);
  }
}

function showBrokenPlaceholder(img, skeleton) {
  if (skeleton) skeleton.style.display = 'none';
  img.style.display = 'none';
  const placeholder = document.createElement('div');
  placeholder.className = 'photo-broken';
  placeholder.innerHTML = '<span class="broken-photo-icon">&#x1f5bc;</span>';
  img.parentElement.insertBefore(placeholder, img);
}

async function openLightbox(photo) {
  const lightboxImg = document.getElementById('lightboxImage');
  lightboxImg.alt = photo.caption || 'Grow photo';

  // Try IndexedDB full-size first
  const objectUrl = await photoDb.getPhotoObjectURL(photo.id, 'full');
  if (objectUrl) {
    activeObjectURLs.push(objectUrl);
    lightboxImg.src = objectUrl;
  } else {
    lightboxImg.src = photo.url || '';
  }

  lightboxImg.onerror = () => {
    lightboxImg.style.display = 'none';
    // Show fallback text
    const info = document.getElementById('lightboxCaption');
    if (info) info.textContent = (photo.caption || '') + ' (Image unavailable)';
  };
  lightboxImg.onload = () => { lightboxImg.style.display = ''; };

  document.getElementById('lightboxCaption').textContent = photo.caption || '';
  document.getElementById('lightboxMeta').textContent =
    `${photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : ''} ${photo.week ? '| Week ' + photo.week : ''} ${photo.category ? '| ' + photo.category : ''}`;

  const deleteBtn = document.getElementById('lightboxDelete');
  deleteBtn.onclick = () => deletePhoto(photo);

  document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
}

async function deletePhoto(photo) {
  if (!(await showConfirmModal('Delete this photo?', true))) return;

  try {
    const user = fb.getCurrentUser();
    if (user) {
      // Delete full-size image from Storage
      if (photo.storagePath) {
        try { await fb.deleteStorageFile(photo.storagePath); } catch (e) { console.error('Storage delete error:', e); }
      }
      // Delete thumbnail from Storage
      if (photo.thumbStoragePath) {
        try { await fb.deleteStorageFile(photo.thumbStoragePath); } catch (e) { console.error('Thumbnail delete error:', e); }
      }
      // Delete Firestore doc
      await fb.deletePhotoDoc(user.uid, growId, photo.id);
    } else {
      photos = photos.filter(p => p.id !== photo.id);
      store.set(`grow_${growId}_photos`, photos);
      renderPhotos();
    }

    // Clean up IndexedDB cache
    photoDb.deletePhoto(photo.id).catch(e => console.warn('IndexedDB delete error:', e));

    closeLightbox();
  } catch (err) {
    console.error('Delete photo error:', err);
    showToast('Failed to delete photo.', 'error');
  }
}

/**
 * Background cache warming — fetch and cache any un-cached photos to IndexedDB.
 */
async function warmPhotoCache(photosList) {
  for (const photo of photosList) {
    try {
      const exists = await photoDb.hasPhoto(photo.id);
      if (exists) continue;

      let fullBlob = null;
      let thumbBlob = null;

      if (photo.url) {
        try { fullBlob = await fetch(photo.url).then(r => r.ok ? r.blob() : null); } catch (e) { /* skip */ }
      }
      if (photo.thumbnailUrl) {
        try { thumbBlob = await fetch(photo.thumbnailUrl).then(r => r.ok ? r.blob() : null); } catch (e) { /* skip */ }
      }

      if (fullBlob || thumbBlob) {
        await photoDb.savePhoto(photo.id, growId, fullBlob, thumbBlob);
      }
    } catch (e) {
      // Non-critical — don't block on cache failures
    }
  }
}

function revokeObjectURLs() {
  for (const url of activeObjectURLs) {
    URL.revokeObjectURL(url);
  }
  activeObjectURLs = [];
}

export function destroy() {
  if (unsubPhotos) { unsubPhotos(); unsubPhotos = null; }
  revokeObjectURLs();
  photos = [];
  filterWeek = '';
  filterCategory = '';
  pendingProcessResult = null;
}
