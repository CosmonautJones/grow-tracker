// Dashboard view — grow list (active + completed), "New Grow" button
import store from '../store.js';
import * as fb from '../firebase.js';
import router from '../router.js';
import { updateNav } from '../components/header.js';
import { escapeHtml, showToast, showConfirmModal } from '../utils.js';
import { exportAllGrowsAsJson, importFromFile, applyImport } from '../export-import.js';
import { showProgressModal } from '../utils.js';

// Pi camera server — self-hosted via DuckDNS + Caddy (HTTPS, no auth proxy).
// Stream is protected by Firebase ID tokens — the signed-in Google user's token
// is passed as ?token= in the img src and refreshed every 55 min.
// Local fallback: http://192.168.1.88:8000
const CAMERA_URL = 'https://cosmonaut-tent.duckdns.org';

let unsubGrows = null;
let streamTokenInterval = null;

export function render(container) {
  container.innerHTML = `
    <section class="live-feed-section">
      <div class="feed-header">
        <h2>&#x1f4f7; Live Tent Feed</h2>
        <span class="feed-status" id="feedStatus">Connecting...</span>
      </div>
      <div class="live-feed-container" id="feedContainer">
        <img id="tentStream"
             alt="Live tent camera"
             class="live-feed-img">
        <div class="feed-offline-placeholder" id="feedOfflinePlaceholder">
          <span class="feed-offline-icon">&#x1f4f7;</span>
          <p id="feedOfflineMsg">Live feed offline</p>
          <p class="feed-offline-hint" id="feedOfflineHint">Camera server may be sleeping.</p>
          <button class="feed-auth-btn hidden" id="feedSignInBtn">&#x1f511; Sign in to view live feed</button>
        </div>
      </div>
    </section>
    <section class="dashboard-section">
      <div class="dashboard-header">
        <h2>Your Grows</h2>
        <div class="dashboard-actions">
          <button id="newGrowBtn" class="primary-btn">+ Start New Grow</button>
          <button id="exportAllBtn" class="secondary-btn small-btn">Export All</button>
          <button id="importBtn" class="secondary-btn small-btn">Import Backup</button>
          <input type="file" id="importFileInput" accept=".json,.zip" class="hidden">
        </div>
      </div>
      <div id="activeGrows" class="grow-grid">
        <div class="loading-spinner-container"><div class="spinner"></div><span>Loading grows...</span></div>
      </div>
      <div id="completedGrowsSection" class="hidden">
        <h3 class="section-subtitle">Completed / Archived</h3>
        <div id="completedGrows" class="grow-grid"></div>
      </div>
    </section>
  `;
}

export function init() {
  updateNav(null);

  // Camera feed — protected by Firebase ID token
  const stream = document.getElementById('tentStream');
  const feedStatus = document.getElementById('feedStatus');
  const placeholder = document.getElementById('feedOfflinePlaceholder');
  if (stream) {
    const user = fb.getCurrentUser();
    if (!user) {
      // Not signed in — show prompt, hide stream
      stream.style.display = 'none';
      placeholder.style.display = 'flex';
      feedStatus.textContent = 'Sign in required';
      feedStatus.className = 'feed-status offline';
      document.getElementById('feedOfflineMsg').textContent = 'Sign in to view the live feed.';
      document.getElementById('feedOfflineHint').textContent = 'Use the Sign In button in the header.';
      const signInBtn = document.getElementById('feedSignInBtn');
      signInBtn.classList.remove('hidden');
      signInBtn.addEventListener('click', () => {
        fb.signInWithGoogle().catch(err => showToast('Sign in failed: ' + err.message, 'error'));
      });
    } else {
      // Signed in — load stream with Firebase token
      stream.addEventListener('load', () => {
        feedStatus.textContent = 'Live';
        feedStatus.className = 'feed-status online';
        stream.style.display = 'block';
        placeholder.style.display = 'none';
      });
      stream.addEventListener('error', () => {
        feedStatus.textContent = 'Offline';
        feedStatus.className = 'feed-status offline';
        stream.style.display = 'none';
        placeholder.style.display = 'flex';
      });
      _loadStream(user, stream);
      // Refresh token every 55 min (Firebase tokens expire after 1 h)
      streamTokenInterval = setInterval(() => {
        const u = fb.getCurrentUser();
        if (u) _loadStream(u, stream);
      }, 55 * 60 * 1000);
    }
  }

  document.getElementById('newGrowBtn').addEventListener('click', () => {
    router.navigate('/new');
  });

  document.getElementById('exportAllBtn').addEventListener('click', () => {
    exportAllGrowsAsJson();
  });

  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
  });

  document.getElementById('importFileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { summary, growCount, parsed, photoBlobs } = await importFromFile(file);
      const totalPhotos = summary.reduce((sum, s) => sum + s.photosCount, 0);
      const photoInfo = totalPhotos > 0 ? `, ${totalPhotos} photo(s)` : '';
      const summaryText = summary.map(s => `${s.strainName} (${s.notesCount} notes, ${s.logsCount} logs${s.photosCount ? ', ' + s.photosCount + ' photos' : ''})`).join('\n');
      const confirmed = await showConfirmModal(`Import ${growCount} grow(s)${photoInfo}?\n\n${summaryText}\n\nExisting grows with the same ID will be skipped.`);
      if (!confirmed) return;

      let progress = null;
      if (photoBlobs && photoBlobs.size > 0) {
        progress = showProgressModal('Importing Grows');
      }

      const imported = await applyImport(parsed, 'skip', photoBlobs, progress ? (pct, msg) => progress.update(pct, msg) : null);

      if (progress) {
        progress.update(100, 'Done!');
        setTimeout(() => progress.close(), 500);
      }

      showToast(`Imported ${imported} grow(s).`, 'success');
      // Reload grows
      loadGrows();
    } catch (err) {
      console.error('Import error:', err);
      showToast(err.message || 'Failed to import.', 'error');
    }

    // Reset file input
    e.target.value = '';
  });

  // Delegated click handlers for grow cards
  document.getElementById('activeGrows').addEventListener('click', (e) => {
    const card = e.target.closest('.grow-card');
    if (!card) return;
    const growId = card.dataset.growId;
    store.set('activeGrowId', growId);
    router.navigate(`/grow/${growId}`);
  });

  document.getElementById('completedGrows').addEventListener('click', (e) => {
    const card = e.target.closest('.grow-card');
    if (!card) return;
    router.navigate(`/grow/${card.dataset.growId}`);
  });

  // Keyboard navigation for grow cards
  function handleCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.grow-card');
      if (card) {
        e.preventDefault();
        card.click();
      }
    }
  }
  document.getElementById('activeGrows').addEventListener('keydown', handleCardKeydown);
  document.getElementById('completedGrows').addEventListener('keydown', handleCardKeydown);

  loadGrows();
}

async function _loadStream(user, streamEl) {
  try {
    const token = await user.getIdToken(false);
    streamEl.src = `${CAMERA_URL}/stream?token=${encodeURIComponent(token)}`;
  } catch (err) {
    console.error('Failed to get Firebase ID token for stream:', err);
  }
}

async function loadGrows() {
  const user = fb.getCurrentUser();

  if (user) {
    // Load from Firestore with real-time updates
    unsubGrows = fb.onAllGrows(user.uid, (grows) => {
      renderGrows(grows);
      // Also cache locally
      const growMap = {};
      grows.forEach(g => { growMap[g.id] = g; });
      store.set('grows', growMap);
    });
  } else {
    // Load from local store
    const grows = store.get('grows') || {};
    const growList = Object.values(grows);
    renderGrows(growList);
  }
}

function renderGrows(grows) {
  const activeContainer = document.getElementById('activeGrows');
  const completedSection = document.getElementById('completedGrowsSection');
  const completedContainer = document.getElementById('completedGrows');

  if (!activeContainer) return;

  const active = grows.filter(g => g.status === 'active');
  const completed = grows.filter(g => g.status === 'completed' || g.status === 'archived');

  if (active.length === 0 && completed.length === 0) {
    activeContainer.innerHTML = `
      <div class="empty-state">
        <h3>No grows yet</h3>
        <p>Start your first grow to begin tracking!</p>
      </div>
    `;
  } else if (active.length === 0) {
    activeContainer.innerHTML = `
      <div class="empty-state">
        <p>No active grows. Start a new one!</p>
      </div>
    `;
  } else {
    activeContainer.innerHTML = active.map(g => renderGrowCard(g)).join('');
  }

  if (completed.length > 0) {
    completedSection.classList.remove('hidden');
    completedContainer.innerHTML = completed.map(g => renderGrowCard(g)).join('');
  } else {
    completedSection.classList.add('hidden');
  }
}

function renderGrowCard(grow) {
  const plantIcon = grow.plantType === 'photoperiod' ? '&#x1f33b;' : '&#x1f331;';
  const statusClass = grow.status === 'active' ? 'status-active' : 'status-completed';
  const statusText = grow.status === 'active' ? 'Active' : grow.status === 'completed' ? 'Completed' : 'Archived';
  const weekText = grow.currentWeek ? `Week ${grow.currentWeek}/${grow.totalWeeks || 10}` : '';
  const startText = grow.startDate ? new Date(grow.startDate).toLocaleDateString() : 'No start date';

  let harvestHtml = '';
  if (grow.status === 'completed' && grow.harvest) {
    const h = grow.harvest;
    const parts = [];
    if (h.dryWeightGrams) parts.push(`${h.dryWeightGrams}g yield`);
    if (h.qualityRating) {
      const stars = Array.from({ length: 5 }, (_, i) => i < h.qualityRating ? '&#9733;' : '&#9734;').join('');
      parts.push(stars);
    }
    if (parts.length > 0) {
      harvestHtml = `<div class="grow-card-harvest">${parts.join(' &middot; ')}</div>`;
    }
  }

  return `
    <div class="grow-card grow-card--${grow.status}" data-grow-id="${escapeHtml(grow.id)}" role="link" tabindex="0">
      <div class="grow-card-header">
        <span class="grow-card-icon">${plantIcon}</span>
        <span class="grow-card-status ${statusClass}">${statusText}</span>
      </div>
      <h3 class="grow-card-name">${escapeHtml(grow.strainName || 'Unnamed Grow')}</h3>
      <div class="grow-card-details">
        <span>${weekText}</span>
        <span>${escapeHtml(grow.growMedium || 'hydro')}</span>
      </div>
      ${harvestHtml}
      <div class="grow-card-footer">
        <span>Started: ${startText}</span>
      </div>
    </div>
  `;
}

export function destroy() {
  if (unsubGrows) {
    unsubGrows();
    unsubGrows = null;
  }
  if (streamTokenInterval) {
    clearInterval(streamTokenInterval);
    streamTokenInterval = null;
  }
}
