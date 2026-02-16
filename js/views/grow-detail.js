// Main grow dashboard — current functionality enhanced with charts, feeding log, photos
import store from '../store.js';
import * as fb from '../firebase.js';
import router from '../router.js';
import { updateNav } from '../components/header.js';
import { getWeekSchedule, getTotalWeeks, getWeekLabel, NUTRIENT_BRANDS, calculateEstimatedPpm } from '../data/nutrient-schedules.js';
import { getStageInfo } from '../data/grow-stages.js';
import { renderCalculator, renderScheduleChart, renderPpmChart } from '../components/nutrient-calculator.js';
import { renderChecklist } from '../components/checklist.js';

let grow = null;
let growId = null;
let unsubGrow = null;
let unsubNotes = null;
let unsubPhotos = null;
let unsubLogs = null;
let autoUpdateInterval = null;
let scheduleChart = null;
let ppmChart = null;

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <div id="growDetailLoading" class="loading">Loading grow...</div>
    <div id="growDetailContent" class="hidden">
      <!-- Progress Section -->
      <section class="progress-section">
        <div class="section-header-row">
          <h2>Growth Progress</h2>
          <div class="grow-actions">
            <button id="completeGrowBtn" class="secondary-btn small-btn">Complete Grow</button>
          </div>
        </div>

        <div class="timeline-controls">
          <h3>Grow Timeline</h3>
          <div class="timeline-input-group">
            <div class="input-group">
              <label for="startDateInput">Start Date:</label>
              <input type="date" id="startDateInput">
            </div>
            <button id="setStartDate">Set Date</button>
          </div>
          <div class="auto-update-toggle">
            <input type="checkbox" id="toggleAutoUpdate">
            <label for="toggleAutoUpdate">Auto-update week based on start date</label>
          </div>
        </div>

        <div id="timelineInfo" class="timeline-info"></div>

        <div class="week-selector">
          <label for="currentWeek">Current Week:</label>
          <select id="currentWeek"></select>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <div class="stage-info" id="stageInfo"></div>
      </section>

      <!-- Nutrient Calculator Section -->
      <section class="nutrient-section">
        <h2>Nutrient Calculator</h2>
        <div class="calculator-inputs">
          <div class="input-group">
            <label for="gallons">Water Volume (Gallons):</label>
            <input type="number" id="gallons" value="1" min="0.25" step="0.25">
          </div>
          <div class="input-group">
            <label for="growMedium">Growing Medium:</label>
            <select id="growMedium">
              <option value="hydro">Hydroponic (DWC/Recirculating)</option>
              <option value="soil">Soil/Coco (Drain-to-Waste)</option>
            </select>
          </div>
        </div>
        <div id="nutrientSchedule"></div>

        <!-- Charts -->
        <div class="charts-row">
          <div class="chart-container">
            <canvas id="scheduleChart"></canvas>
          </div>
          <div class="chart-container">
            <canvas id="ppmChart"></canvas>
          </div>
        </div>
      </section>

      <!-- Feeding Log Section -->
      <section class="feeding-section">
        <h2>Feeding Log</h2>
        <button id="addFeedingBtn" class="primary-btn small-btn">+ Log Feeding</button>
        <div id="feedingForm" class="hidden feeding-form-container"></div>
        <div id="feedingHistory"></div>
      </section>

      <!-- Weekly Checklist Section -->
      <section class="checklist-section">
        <h2>Weekly Checklist</h2>
        <div id="weeklyChecklist"></div>
      </section>

      <!-- Target Parameters -->
      <section class="parameters-section">
        <h2>Target Parameters</h2>
        <div class="parameters-grid">
          <div class="param-card">
            <h3>pH Levels</h3>
            <p><strong>Hydro (Veg):</strong> 5.5-6.0 (5.8 optimal)</p>
            <p><strong>Hydro (Flower):</strong> 6.0-6.5 (6.2-6.3 optimal)</p>
            <p><strong>Soil/Coco:</strong> 6.0-6.5</p>
          </div>
          <div class="param-card">
            <h3>PPM/EC Targets</h3>
            <p><strong>Seedling:</strong> 400 PPM (0.8 EC)</p>
            <p><strong>Veg:</strong> 500-700 PPM (1.0-1.4 EC)</p>
            <p><strong>Flower:</strong> 600-800 PPM (1.2-1.6 EC)</p>
            <p><strong>Flush:</strong> 0 PPM</p>
          </div>
          <div class="param-card">
            <h3>Environment</h3>
            <p><strong>Temperature:</strong> 70-80&deg;F (21-27&deg;C)</p>
            <p><strong>Humidity (Veg):</strong> 60-70%</p>
            <p><strong>Humidity (Flower):</strong> 40-50%</p>
            <p><strong>Light:</strong> <span id="paramLightSchedule">18/6</span></p>
          </div>
        </div>
      </section>

      <!-- Recent Notes -->
      <section class="notes-preview-section">
        <div class="section-header-row">
          <h2>Recent Notes</h2>
          <a href="#/grow/${growId}/notes" class="view-all-link">View All &rarr;</a>
        </div>
        <div id="recentNotes"><p class="text-muted">No notes yet.</p></div>
      </section>

      <!-- Recent Photos -->
      <section class="photos-preview-section">
        <div class="section-header-row">
          <h2>Recent Photos</h2>
          <a href="#/grow/${growId}/gallery" class="view-all-link">View All &rarr;</a>
        </div>
        <div id="recentPhotos"><p class="text-muted">No photos yet.</p></div>
      </section>
    </div>
  `;
}

export async function init(params) {
  growId = params.id;
  updateNav(growId);

  const user = fb.getCurrentUser();

  if (user) {
    // Real-time Firestore listener
    unsubGrow = fb.onGrow(user.uid, growId, (data) => {
      if (!data) {
        document.getElementById('growDetailLoading').textContent = 'Grow not found.';
        return;
      }
      grow = data;
      showGrowUI();
    });

    // Listen for notes
    unsubNotes = fb.onAllNotes(user.uid, growId, (notes) => {
      renderRecentNotes(notes);
    });

    // Listen for photos
    unsubPhotos = fb.onAllPhotos(user.uid, growId, (photos) => {
      renderRecentPhotos(photos);
    });

    // Listen for feeding logs
    unsubLogs = fb.onAllFeedingLogs(user.uid, growId, (logs) => {
      renderFeedingHistory(logs);
    });
  } else {
    // Load from local store
    const grows = store.get('grows') || {};
    grow = grows[growId];
    if (!grow) {
      document.getElementById('growDetailLoading').textContent = 'Grow not found.';
      return;
    }
    grow.id = growId;
    showGrowUI();

    const notes = store.get(`grow_${growId}_notes`) || [];
    renderRecentNotes(notes);

    const photos = store.get(`grow_${growId}_photos`) || [];
    renderRecentPhotos(photos);

    const logs = store.get(`grow_${growId}_feedingLogs`) || [];
    renderFeedingHistory(logs);
  }
}

function showGrowUI() {
  document.getElementById('growDetailLoading').classList.add('hidden');
  document.getElementById('growDetailContent').classList.remove('hidden');

  populateWeekSelector();
  loadGrowValues();
  attachListeners();
  checkAutoUpdate();
  updateAll();

  // Auto-update interval
  if (autoUpdateInterval) clearInterval(autoUpdateInterval);
  autoUpdateInterval = setInterval(checkAutoUpdate, 60000);
}

function populateWeekSelector() {
  const select = document.getElementById('currentWeek');
  const medium = grow.growMedium === 'coco' ? 'soil' : (grow.growMedium || 'hydro');
  const totalWeeks = getTotalWeeks(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, grow.photoperiodVegWeeks);

  select.innerHTML = '';
  for (let w = 1; w <= totalWeeks; w++) {
    const sched = getWeekSchedule(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, w, grow.photoperiodVegWeeks);
    const label = getWeekLabel(grow.plantType || 'autoflower', w, grow.photoperiodVegWeeks, sched?.stage || '');
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = label;
    select.appendChild(opt);
  }
}

function loadGrowValues() {
  if (grow.currentWeek) document.getElementById('currentWeek').value = grow.currentWeek;
  if (grow.gallons) document.getElementById('gallons').value = grow.gallons;
  if (grow.growMedium) {
    const mediumSelect = document.getElementById('growMedium');
    mediumSelect.value = (grow.growMedium === 'coco') ? 'soil' : grow.growMedium;
  }
  if (grow.startDate) document.getElementById('startDateInput').value = grow.startDate;
  document.getElementById('toggleAutoUpdate').checked = grow.autoUpdateWeek !== false;
  if (grow.lightSchedule) document.getElementById('paramLightSchedule').textContent = grow.lightSchedule;

  if (grow.status === 'completed') {
    document.getElementById('completeGrowBtn').textContent = 'Reactivate Grow';
  }
}

function attachListeners() {
  document.getElementById('currentWeek').addEventListener('change', () => {
    updateAll();
    saveGrowField('currentWeek', parseInt(document.getElementById('currentWeek').value));
  });

  document.getElementById('gallons').addEventListener('input', () => {
    updateNutrientDisplay();
    saveGrowField('gallons', parseFloat(document.getElementById('gallons').value));
  });

  document.getElementById('growMedium').addEventListener('change', () => {
    updateAll();
    saveGrowField('growMedium', document.getElementById('growMedium').value);
  });

  document.getElementById('setStartDate').addEventListener('click', () => {
    const date = document.getElementById('startDateInput').value;
    if (!date) { alert('Please select a date.'); return; }
    saveGrowField('startDate', date);
    grow.startDate = date;
    grow.autoUpdateWeek = true;
    document.getElementById('toggleAutoUpdate').checked = true;
    saveGrowField('autoUpdateWeek', true);
    updateTimelineInfo();
    checkAutoUpdate();
  });

  document.getElementById('toggleAutoUpdate').addEventListener('change', (e) => {
    grow.autoUpdateWeek = e.target.checked;
    saveGrowField('autoUpdateWeek', e.target.checked);
    if (e.target.checked) checkAutoUpdate();
  });

  document.getElementById('completeGrowBtn').addEventListener('click', handleCompleteGrow);

  document.getElementById('addFeedingBtn').addEventListener('click', toggleFeedingForm);
}

function updateAll() {
  updateNutrientDisplay();
  updateStageInfo();
  updateChecklistDisplay();
  updateTimelineInfo();
  renderCharts();
}

function updateNutrientDisplay() {
  const week = parseInt(document.getElementById('currentWeek').value);
  const gallons = parseFloat(document.getElementById('gallons').value) || 1;
  const medium = document.getElementById('growMedium').value;

  renderCalculator(document.getElementById('nutrientSchedule'), {
    week, gallons, medium,
    brand: grow.nutrientBrand || 'gh-flora-trio',
    plantType: grow.plantType || 'autoflower',
    photoperiodVegWeeks: grow.photoperiodVegWeeks,
    waterBaselinePpm: 0
  });
}

function updateStageInfo() {
  const week = parseInt(document.getElementById('currentWeek').value);
  const medium = document.getElementById('growMedium').value;
  const totalWeeks = getTotalWeeks(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, grow.photoperiodVegWeeks);
  const progress = (week / totalWeeks) * 100;

  document.getElementById('progressFill').style.width = progress + '%';

  const stageInfo = getStageInfo(grow.plantType || 'autoflower', week, grow.photoperiodVegWeeks);
  document.getElementById('stageInfo').innerHTML = `
    <h3>${stageInfo.name}</h3>
    <p style="font-size: 1.1em; margin-bottom: 10px;">${stageInfo.description}</p>
    <p><strong>Week ${week} of ${totalWeeks}</strong> | <strong>Progress:</strong> ${progress.toFixed(0)}%</p>
  `;
}

function updateChecklistDisplay() {
  const week = parseInt(document.getElementById('currentWeek').value);
  renderChecklist(document.getElementById('weeklyChecklist'), {
    growId: growId,
    week: week,
    plantType: grow.plantType || 'autoflower',
    photoperiodVegWeeks: grow.photoperiodVegWeeks
  });
}

function updateTimelineInfo() {
  const timelineDiv = document.getElementById('timelineInfo');
  if (!grow.startDate) {
    timelineDiv.innerHTML = `
      <div class="timeline-notice">
        <p><strong>Timeline Tracking Not Set</strong></p>
        <p class="text-muted">Set your grow start date to enable automatic week tracking.</p>
      </div>
    `;
    return;
  }

  const start = new Date(grow.startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const medium = grow.growMedium === 'coco' ? 'soil' : (grow.growMedium || 'hydro');
  const totalWeeks = getTotalWeeks(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, grow.photoperiodVegWeeks);
  const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, totalWeeks);
  const dayInWeek = (daysSinceStart % 7) + 1;

  let harvestDays = totalWeeks * 7;
  const expectedHarvest = new Date(start);
  expectedHarvest.setDate(expectedHarvest.getDate() + harvestDays);

  timelineDiv.innerHTML = `
    <div class="timeline-card">
      <div class="timeline-grid">
        <div>
          <p class="timeline-label">Start Date</p>
          <p class="timeline-value">${start.toLocaleDateString()}</p>
        </div>
        <div>
          <p class="timeline-label">Days Since Start</p>
          <p class="timeline-value">${daysSinceStart} days</p>
        </div>
        <div>
          <p class="timeline-label">Calculated Week</p>
          <p class="timeline-value">Week ${currentWeek} (Day ${dayInWeek}/7)</p>
        </div>
        <div>
          <p class="timeline-label">Expected Harvest</p>
          <p class="timeline-value">${expectedHarvest.toLocaleDateString()}</p>
        </div>
      </div>
      ${grow.autoUpdateWeek ? '<p class="timeline-auto">Auto-update enabled</p>' : '<p class="text-muted">Auto-update disabled</p>'}
    </div>
  `;
}

function checkAutoUpdate() {
  if (!grow || !grow.autoUpdateWeek || !grow.startDate) return;

  const start = new Date(grow.startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const medium = grow.growMedium === 'coco' ? 'soil' : (grow.growMedium || 'hydro');
  const totalWeeks = getTotalWeeks(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, grow.photoperiodVegWeeks);
  const calculatedWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, totalWeeks);

  const currentWeekEl = document.getElementById('currentWeek');
  if (currentWeekEl && parseInt(currentWeekEl.value) !== calculatedWeek) {
    currentWeekEl.value = calculatedWeek;
    saveGrowField('currentWeek', calculatedWeek);
    updateAll();
  }

  updateTimelineInfo();
}

function renderCharts() {
  const week = parseInt(document.getElementById('currentWeek').value);
  const medium = document.getElementById('growMedium').value;

  const chartParams = {
    brand: grow.nutrientBrand || 'gh-flora-trio',
    plantType: grow.plantType || 'autoflower',
    medium: medium,
    photoperiodVegWeeks: grow.photoperiodVegWeeks,
    currentWeek: week
  };

  // Destroy old charts
  if (scheduleChart) { scheduleChart.destroy(); scheduleChart = null; }
  if (ppmChart) { ppmChart.destroy(); ppmChart = null; }

  scheduleChart = renderScheduleChart('scheduleChart', chartParams);
  ppmChart = renderPpmChart('ppmChart', chartParams);
}

// ── Feeding Log ──

function toggleFeedingForm() {
  const formDiv = document.getElementById('feedingForm');
  if (formDiv.classList.contains('hidden')) {
    showFeedingForm(formDiv);
    formDiv.classList.remove('hidden');
  } else {
    formDiv.classList.add('hidden');
  }
}

function showFeedingForm(formDiv) {
  const week = parseInt(document.getElementById('currentWeek').value);
  const medium = document.getElementById('growMedium').value;
  const schedule = getWeekSchedule(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, week, grow.photoperiodVegWeeks);

  formDiv.innerHTML = `
    <div class="feeding-form">
      <h3>Log Feeding</h3>
      <div class="wizard-form-grid">
        <div class="input-group">
          <label>Date</label>
          <input type="date" id="feedDate" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="input-group">
          <label>Week</label>
          <input type="number" id="feedWeek" value="${week}" min="1">
        </div>
        <div class="input-group">
          <label>Water (gallons)</label>
          <input type="number" id="feedGallons" value="${grow.gallons || 1}" min="0.25" step="0.25">
        </div>
        <div class="input-group">
          <label>FloraMicro (ml/gal)</label>
          <input type="number" id="feedMicro" value="${schedule?.micro || 0}" min="0" step="0.5">
        </div>
        <div class="input-group">
          <label>FloraGro (ml/gal)</label>
          <input type="number" id="feedGro" value="${schedule?.gro || 0}" min="0" step="0.5">
        </div>
        <div class="input-group">
          <label>FloraBloom (ml/gal)</label>
          <input type="number" id="feedBloom" value="${schedule?.bloom || 0}" min="0" step="0.5">
        </div>
        <div class="input-group">
          <label>Input PPM</label>
          <input type="number" id="feedInputPpm" value="${schedule?.ppm || ''}" min="0">
        </div>
        <div class="input-group">
          <label>Input pH</label>
          <input type="number" id="feedInputPh" value="" min="0" max="14" step="0.1">
        </div>
        <div class="input-group">
          <label>Runoff PPM (optional)</label>
          <input type="number" id="feedRunoffPpm" value="" min="0">
        </div>
        <div class="input-group">
          <label>Runoff pH (optional)</label>
          <input type="number" id="feedRunoffPh" value="" min="0" max="14" step="0.1">
        </div>
      </div>
      <div class="input-group" style="margin-top:10px;">
        <label>Notes</label>
        <textarea id="feedNotes" rows="2" placeholder="Optional notes..."></textarea>
      </div>
      <div class="form-actions">
        <button id="saveFeedingBtn" class="primary-btn small-btn">Save</button>
        <button id="cancelFeedingBtn" class="secondary-btn small-btn">Cancel</button>
      </div>
    </div>
  `;

  formDiv.querySelector('#saveFeedingBtn').addEventListener('click', saveFeedingLog);
  formDiv.querySelector('#cancelFeedingBtn').addEventListener('click', () => formDiv.classList.add('hidden'));
}

async function saveFeedingLog() {
  const logData = {
    date: document.getElementById('feedDate').value,
    weekNumber: parseInt(document.getElementById('feedWeek').value),
    waterGallons: parseFloat(document.getElementById('feedGallons').value),
    nutrients: {
      micro: parseFloat(document.getElementById('feedMicro').value) || 0,
      gro: parseFloat(document.getElementById('feedGro').value) || 0,
      bloom: parseFloat(document.getElementById('feedBloom').value) || 0
    },
    inputPpm: parseFloat(document.getElementById('feedInputPpm').value) || null,
    inputPh: parseFloat(document.getElementById('feedInputPh').value) || null,
    runoffPpm: parseFloat(document.getElementById('feedRunoffPpm').value) || null,
    runoffPh: parseFloat(document.getElementById('feedRunoffPh').value) || null,
    notes: document.getElementById('feedNotes').value.trim()
  };

  const user = fb.getCurrentUser();
  if (user) {
    await fb.createFeedingLog(user.uid, growId, logData);
  } else {
    const logs = store.get(`grow_${growId}_feedingLogs`) || [];
    logData.id = 'log_' + Date.now();
    logData.createdAt = new Date().toISOString();
    logs.push(logData);
    store.set(`grow_${growId}_feedingLogs`, logs);
    renderFeedingHistory(logs);
  }

  document.getElementById('feedingForm').classList.add('hidden');
}

function renderFeedingHistory(logs) {
  const container = document.getElementById('feedingHistory');
  if (!container) return;

  if (!logs || logs.length === 0) {
    container.innerHTML = '<p class="text-muted">No feeding logs yet.</p>';
    return;
  }

  const sorted = [...logs].sort((a, b) => (b.date || b.createdAt || '').localeCompare(a.date || a.createdAt || ''));

  container.innerHTML = `
    <div class="feeding-log-table">
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Wk</th><th>Gal</th><th>Micro</th><th>Gro</th><th>Bloom</th><th>PPM</th><th>pH</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(l => `
            <tr>
              <td>${l.date || '-'}</td>
              <td>${l.weekNumber || '-'}</td>
              <td>${l.waterGallons || '-'}</td>
              <td>${l.nutrients?.micro || 0}</td>
              <td>${l.nutrients?.gro || 0}</td>
              <td>${l.nutrients?.bloom || 0}</td>
              <td>${l.inputPpm || '-'}</td>
              <td>${l.inputPh || '-'}</td>
              <td>${l.notes || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Recent Notes Preview ──

function renderRecentNotes(notes) {
  const container = document.getElementById('recentNotes');
  if (!container) return;

  if (!notes || notes.length === 0) {
    container.innerHTML = '<p class="text-muted">No notes yet. <a href="#/grow/' + growId + '/notes">Add one</a></p>';
    return;
  }

  const sorted = [...notes].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const recent = sorted.slice(0, 5);

  const categoryIcons = { feeding: '&#x1f4a7;', environment: '&#x1f321;', observation: '&#x1f441;', issue: '&#x26a0;&#xfe0f;', milestone: '&#x2b50;', general: '&#x1f4dd;' };

  container.innerHTML = recent.map(n => `
    <div class="note-preview-card">
      <span class="note-icon">${categoryIcons[n.category] || '&#x1f4dd;'}</span>
      <div>
        <strong>${n.title || 'Untitled'}</strong>
        <p class="text-muted">${(n.content || '').slice(0, 100)}${(n.content || '').length > 100 ? '...' : ''}</p>
        <small class="text-muted">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''} ${n.week ? '| Week ' + n.week : ''}</small>
      </div>
    </div>
  `).join('');
}

// ── Recent Photos Preview ──

function renderRecentPhotos(photos) {
  const container = document.getElementById('recentPhotos');
  if (!container) return;

  if (!photos || photos.length === 0) {
    container.innerHTML = '<p class="text-muted">No photos yet. <a href="#/grow/' + growId + '/gallery">Upload one</a></p>';
    return;
  }

  const sorted = [...photos].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const recent = sorted.slice(0, 4);

  container.innerHTML = `
    <div class="photo-preview-grid">
      ${recent.map(p => `
        <div class="photo-thumb">
          <img src="${p.thumbnailUrl || p.url}" alt="${p.caption || 'Photo'}" loading="lazy">
        </div>
      `).join('')}
    </div>
  `;
}

// ── Complete Grow ──

async function handleCompleteGrow() {
  const isCompleted = grow.status === 'completed';
  const action = isCompleted ? 'reactivate' : 'complete';
  if (!confirm(`Are you sure you want to ${action} this grow?`)) return;

  const newStatus = isCompleted ? 'active' : 'completed';
  const updates = { status: newStatus };
  if (!isCompleted) updates.endDate = new Date().toISOString();

  const user = fb.getCurrentUser();
  if (user) {
    await fb.updateGrow(user.uid, growId, updates);
    if (!isCompleted) {
      await fb.setUserDoc(user.uid, { activeGrowId: null });
    }
  } else {
    const grows = store.get('grows') || {};
    if (grows[growId]) {
      Object.assign(grows[growId], updates);
      store.set('grows', grows);
    }
  }

  if (!isCompleted) {
    router.navigate('/dashboard');
  } else {
    grow.status = 'active';
    document.getElementById('completeGrowBtn').textContent = 'Complete Grow';
  }
}

// ── Persistence Helper ──

function saveGrowField(field, value) {
  grow[field] = value;

  const user = fb.getCurrentUser();
  if (user) {
    fb.updateGrow(user.uid, growId, { [field]: value }).catch(console.error);
  } else {
    const grows = store.get('grows') || {};
    if (grows[growId]) {
      grows[growId][field] = value;
      store.set('grows', grows);
    }
  }
}

// ── Sync checklist to Firestore ──

store.subscribe('*', (newValue, oldValue, key) => {
  if (!key || !key.startsWith(`grow_${growId}_checklist_`)) return;
  const user = fb.getCurrentUser();
  if (!user) return;
  const weekNum = key.split('_').pop();
  fb.setWeekDoc(user.uid, growId, weekNum, { checklists: newValue }).catch(console.error);
});

export function destroy() {
  if (unsubGrow) { unsubGrow(); unsubGrow = null; }
  if (unsubNotes) { unsubNotes(); unsubNotes = null; }
  if (unsubPhotos) { unsubPhotos(); unsubPhotos = null; }
  if (unsubLogs) { unsubLogs(); unsubLogs = null; }
  if (autoUpdateInterval) { clearInterval(autoUpdateInterval); autoUpdateInterval = null; }
  if (scheduleChart) { scheduleChart.destroy(); scheduleChart = null; }
  if (ppmChart) { ppmChart.destroy(); ppmChart = null; }
  grow = null;
  growId = null;
}
