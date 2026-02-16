// Photo gallery with upload, lightbox, filtering
import store from '../store.js';
import * as fb from '../firebase.js';
import { updateNav } from '../components/header.js';
import { processImage, renderUploadButton } from '../components/photo-upload.js';

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

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <section class="gallery-section">
      <div class="section-header-row">
        <h2>Photo Gallery</h2>
        <div id="uploadArea"></div>
      </div>

      <div class="gallery-upload-meta hidden" id="uploadMeta">
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
        <div class="loading">Loading photos...</div>
      </div>

      <!-- Lightbox -->
      <div id="lightbox" class="lightbox-overlay hidden">
        <div class="lightbox-content">
          <button id="lightboxClose" class="lightbox-close">&times;</button>
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
  updateNav(growId);

  // Upload button
  renderUploadButton(document.getElementById('uploadArea'), {
    onUpload: handleUpload
  });

  // Filters
  document.getElementById('galleryFilterCategory').addEventListener('change', (e) => { filterCategory = e.target.value; renderPhotos(); });
  document.getElementById('galleryFilterWeek').addEventListener('input', (e) => { filterWeek = e.target.value; renderPhotos(); });

  // Lightbox close
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  loadPhotos();
}

function loadPhotos() {
  const user = fb.getCurrentUser();
  if (user) {
    unsubPhotos = fb.onAllPhotos(user.uid, growId, (data) => {
      photos = data;
      renderPhotos();
    });
  } else {
    photos = store.get(`grow_${growId}_photos`) || [];
    renderPhotos();
  }
}

async function handleUpload(file, onProgress) {
  const user = fb.getCurrentUser();
  if (!user) {
    alert('Please sign in to upload photos.');
    return;
  }

  // Show meta fields
  document.getElementById('uploadMeta').classList.remove('hidden');

  // Process image (resize)
  const { fullBlob } = await processImage(file);

  // Upload to Firebase Storage
  const fullFile = new File([fullBlob], file.name, { type: 'image/jpeg' });
  const { url, storagePath } = await fb.uploadPhoto(user.uid, growId, fullFile, onProgress);

  // Create photo document
  const caption = document.getElementById('photoCaption').value.trim();
  const week = parseInt(document.getElementById('photoWeek').value) || null;
  const category = document.getElementById('photoCategory').value;

  await fb.createPhotoDoc(user.uid, growId, {
    storagePath,
    url,
    thumbnailUrl: url, // Using same URL since we resize client-side
    caption,
    week,
    category
  });

  // Reset meta fields
  document.getElementById('photoCaption').value = '';
  document.getElementById('photoWeek').value = '';
  document.getElementById('uploadMeta').classList.add('hidden');
}

function renderPhotos() {
  const container = document.getElementById('photoGrid');
  if (!container) return;

  let filtered = [...photos];
  if (filterCategory) {
    filtered = filtered.filter(p => p.category === filterCategory);
  }
  if (filterWeek) {
    filtered = filtered.filter(p => String(p.week) === filterWeek);
  }

  filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No photos yet. Upload one above!</p></div>';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="photo-grid-item" data-photo-id="${p.id}">
      <img src="${p.thumbnailUrl || p.url}" alt="${p.caption || 'Photo'}" loading="lazy">
      <div class="photo-grid-overlay">
        <span>${p.caption || ''}</span>
        ${p.week ? `<span>Week ${p.week}</span>` : ''}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.photo-grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const photoId = item.dataset.photoId;
      const photo = photos.find(p => p.id === photoId);
      if (photo) openLightbox(photo);
    });
  });
}

function openLightbox(photo) {
  document.getElementById('lightboxImage').src = photo.url;
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
  if (!confirm('Delete this photo?')) return;

  const user = fb.getCurrentUser();
  if (user) {
    // Delete from Storage
    if (photo.storagePath) {
      try { await fb.deleteStorageFile(photo.storagePath); } catch (e) { console.error('Storage delete error:', e); }
    }
    // Delete Firestore doc
    await fb.deletePhotoDoc(user.uid, growId, photo.id);
  } else {
    photos = photos.filter(p => p.id !== photo.id);
    store.set(`grow_${growId}_photos`, photos);
    renderPhotos();
  }

  closeLightbox();
}

export function destroy() {
  if (unsubPhotos) { unsubPhotos(); unsubPhotos = null; }
  photos = [];
  filterWeek = '';
  filterCategory = '';
}
