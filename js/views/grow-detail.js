// Main grow dashboard — current functionality enhanced with charts, feeding log, photos
import store from '../store.js';
import * as fb from '../firebase.js';
import router from '../router.js';
import { updateNav } from '../components/header.js';
import { getWeekSchedule, getTotalWeeks, getWeekLabel, NUTRIENT_BRANDS, calculateEstimatedPpm, getMixingOrder } from '../data/nutrient-schedules.js';
import { getStageInfo } from '../data/grow-stages.js';
import { renderCalculator, renderScheduleChart, renderPpmChart } from '../components/nutrient-calculator.js';
import { renderChecklist } from '../components/checklist.js';
import { escapeHtml, isValidDate, isValidGrowId, showConfirmModal, showToast } from '../utils.js';
import { getRelevantGuides } from '../data/cultivation-guides.js';
import { getEnvStageForWeek, checkEnvAlerts, ENV_RANGES } from '../data/env-ranges.js';
import { exportGrowAsJson, exportFeedingLogsAsCsv } from '../export-import.js';

let grow = null;
let growId = null;
let unsubGrow = null;
let unsubNotes = null;
let unsubPhotos = null;
let unsubLogs = null;
let unsubStore = null;
let autoUpdateInterval = null;
let scheduleChart = null;
let ppmChart = null;
let listenersAttached = false;
let unsubEnvLogs = null;
let editingFeedingLogId = null;
let feedingLogsData = [];
let feedingChart = null;

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <div id="growDetailLoading" class="loading-spinner-container"><div class="spinner"></div><span>Loading grow...</span></div>
    <div id="growDetailContent" class="hidden">
      <!-- Progress Section -->
      <section class="progress-section">
        <div class="section-header-row">
          <h2>Growth Progress</h2>
          <div class="grow-actions">
            <button id="editGrowBtn" class="secondary-btn small-btn">Edit Grow</button>
            <button id="completeGrowBtn" class="secondary-btn small-btn">Complete Grow</button>
            <button id="exportGrowBtn" class="secondary-btn small-btn">Export Grow</button>
            <button id="exportCsvBtn" class="secondary-btn small-btn">Export CSV</button>
            <button id="deleteGrowBtn" class="danger-btn small-btn">Delete Grow</button>
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
              <option value="soil">Soil (Drain-to-Waste)</option>
              <option value="coco">Coco Coir</option>
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
        <div class="chart-container" style="margin-top:20px;">
          <canvas id="feedingChart"></canvas>
        </div>
      </section>

      <!-- Weekly Checklist Section -->
      <section class="checklist-section">
        <h2>Weekly Checklist</h2>
        <div id="weeklyChecklist"></div>
      </section>

      <!-- Cultivation Tips Section -->
      <section class="tips-section" id="tipsSection">
        <h2>Cultivation Tips</h2>
        <div id="cultivationTips"></div>
      </section>

      <!-- Recent Environment Section -->
      <section class="env-preview-section">
        <div class="section-header-row">
          <h2>Recent Environment</h2>
          <a href="#/grow/${escapeHtml(growId)}/environment" class="view-all-link">View All &rarr;</a>
        </div>
        <div id="recentEnvLogs"><p class="text-muted">No readings yet.</p></div>
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
          <a href="#/grow/${escapeHtml(growId)}/notes" class="view-all-link">View All &rarr;</a>
        </div>
        <div id="recentNotes"><p class="text-muted">No notes yet.</p></div>
      </section>

      <!-- Recent Photos -->
      <section class="photos-preview-section">
        <div class="section-header-row">
          <h2>Recent Photos</h2>
          <a href="#/grow/${escapeHtml(growId)}/gallery" class="view-all-link">View All &rarr;</a>
        </div>
        <div id="recentPhotos"><p class="text-muted">No photos yet.</p></div>
      </section>
    </div>
  `;
}

export async function init(params) {
  growId = params.id;

  // Validate grow ID
  if (!isValidGrowId(growId)) {
    router.navigate('/dashboard');
    return;
  }

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
      feedingLogsData = logs;
      renderFeedingHistory(logs);
      renderFeedingChart(logs);
    });

    // Listen for env logs
    unsubEnvLogs = fb.onAllEnvLogs(user.uid, growId, (logs) => {
      renderRecentEnvLogs(logs);
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
    feedingLogsData = logs;
    renderFeedingHistory(logs);
    renderFeedingChart(logs);

    const envLogs = store.get(`grow_${growId}_envLogs`) || [];
    renderRecentEnvLogs(envLogs);
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
  renderHarvestSummary();

  // Store subscription for checklist sync — captured for cleanup
  if (unsubStore) { unsubStore(); unsubStore = null; }
  unsubStore = store.subscribe('*', (newValue, oldValue, key) => {
    if (!key || !key.startsWith(`grow_${growId}_checklist_`)) return;
    const user = fb.getCurrentUser();
    if (!user) return;
    const weekNum = key.split('_').pop();
    fb.setWeekDoc(user.uid, growId, weekNum, { checklists: newValue }).catch((err) => {
      console.error('Checklist sync error:', err);
      showToast('Failed to sync checklist.', 'error');
    });
  });

  // Auto-update interval
  if (autoUpdateInterval) clearInterval(autoUpdateInterval);
  autoUpdateInterval = setInterval(checkAutoUpdate, 60000);
}

function populateWeekSelector() {
  const select = document.getElementById('currentWeek');
  const medium = grow.growMedium || 'hydro';
  const totalWeeks = getTotalWeeks(grow.nutrientBrand || 'gh-flora-trio', grow.plantType || 'autoflower', medium, grow.photoperiodVegWeeks);

  select.innerHTML = '';
  for (let w = 1; w <= totalWeeks; w++) {
    const brand = grow.nutrientBrand || 'gh-flora-trio';
    const sched = getWeekSchedule(brand, grow.plantType || 'autoflower', medium, w, grow.photoperiodVegWeeks);
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
    mediumSelect.value = grow.growMedium;
  }
  if (grow.startDate) document.getElementById('startDateInput').value = grow.startDate;
  document.getElementById('toggleAutoUpdate').checked = grow.autoUpdateWeek !== false;
  if (grow.lightSchedule) document.getElementById('paramLightSchedule').textContent = grow.lightSchedule;

  if (grow.status === 'completed') {
    document.getElementById('completeGrowBtn').textContent = 'Reactivate Grow';
  }
}

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  function listen(id, event, fn) { const el = document.getElementById(id); if (el) el.addEventListener(event, fn); }

  listen('currentWeek', 'change', () => {
    updateAll();
    saveGrowField('currentWeek', parseInt(document.getElementById('currentWeek').value));
  });

  listen('gallons', 'input', () => {
    updateNutrientDisplay();
    saveGrowField('gallons', parseFloat(document.getElementById('gallons').value));
  });

  listen('growMedium', 'change', () => {
    updateAll();
    saveGrowField('growMedium', document.getElementById('growMedium').value);
  });

  listen('setStartDate', 'click', () => {
    const date = document.getElementById('startDateInput').value;
    if (!date) { showToast('Please select a date.', 'error'); return; }
    if (!isValidDate(date)) {
      showToast('Please enter a valid date between 2020 and 30 days from now.', 'error');
      return;
    }
    saveGrowField('startDate', date);
    grow.startDate = date;
    grow.autoUpdateWeek = true;
    document.getElementById('toggleAutoUpdate').checked = true;
    saveGrowField('autoUpdateWeek', true);
    updateTimelineInfo();
    checkAutoUpdate();
  });

  listen('toggleAutoUpdate', 'change', (e) => {
    grow.autoUpdateWeek = e.target.checked;
    saveGrowField('autoUpdateWeek', e.target.checked);
    if (e.target.checked) checkAutoUpdate();
  });

  listen('completeGrowBtn', 'click', handleCompleteGrow);
  listen('deleteGrowBtn', 'click', handleDeleteGrow);
  listen('editGrowBtn', 'click', showEditGrowModal);

  listen('addFeedingBtn', 'click', toggleFeedingForm);

  listen('exportGrowBtn', 'click', () => exportGrowAsJson(growId));
  listen('exportCsvBtn', 'click', () => exportFeedingLogsAsCsv(growId));

  // Delegated click for feeding log edit/delete
  const feedingHistoryEl = document.getElementById('feedingHistory');
  if (feedingHistoryEl) {
    feedingHistoryEl.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.feed-edit-btn');
      const deleteBtn = e.target.closest('.feed-delete-btn');
      if (editBtn) editFeedingLog(editBtn.dataset.logId);
      if (deleteBtn) deleteFeedingLogEntry(deleteBtn.dataset.logId);
    });
  }
}

function updateAll() {
  updateNutrientDisplay();
  updateStageInfo();
  updateChecklistDisplay();
  updateTimelineInfo();
  updateCultivationTips();
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
    <h3>${escapeHtml(stageInfo.name)}</h3>
    <p style="font-size: 1.1em; margin-bottom: 10px;">${escapeHtml(stageInfo.description)}</p>
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
  const medium = grow.growMedium || 'hydro';
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
  const medium = grow.growMedium || 'hydro';
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

function getChartColors() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  return {
    textColor: isDark ? '#e0e8e0' : '#2c3e2c',
    gridColor: isDark ? '#3a4a3a' : '#d4e4d4',
    bgColor: isDark ? '#252a25' : '#ffffff'
  };
}

function renderCharts() {
  if (typeof Chart === 'undefined') { console.warn('Chart.js not loaded'); return; }

  // Set Chart.js global defaults for current theme
  const colors = getChartColors();
  Chart.defaults.color = colors.textColor;
  Chart.defaults.borderColor = colors.gridColor;

  const week = parseInt(document.getElementById('currentWeek').value);
  const medium = document.getElementById('growMedium').value;

  const chartParams = {
    brand: grow.nutrientBrand || 'gh-flora-trio',
    plantType: grow.plantType || 'autoflower',
    medium: medium,
    photoperiodVegWeeks: grow.photoperiodVegWeeks,
    currentWeek: week
  };

  // Destroy old charts safely
  if (scheduleChart) {
    try { scheduleChart.destroy(); } catch (e) { /* ignore */ }
    scheduleChart = null;
  }
  if (ppmChart) {
    try { ppmChart.destroy(); } catch (e) { /* ignore */ }
    ppmChart = null;
  }

  try {
    scheduleChart = renderScheduleChart('scheduleChart', chartParams);
  } catch (err) {
    console.error('Schedule chart error:', err);
  }

  try {
    ppmChart = renderPpmChart('ppmChart', chartParams);
  } catch (err) {
    console.error('PPM chart error:', err);
  }
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

function showFeedingForm(formDiv, prefill) {
  const week = parseInt(document.getElementById('currentWeek').value);
  const medium = document.getElementById('growMedium').value;
  const brand = grow.nutrientBrand || 'gh-flora-trio';
  const brandData = NUTRIENT_BRANDS[brand];
  const schedule = getWeekSchedule(brand, grow.plantType || 'autoflower', medium, week, grow.photoperiodVegWeeks);
  const components = getMixingOrder(brand);
  const unitLabel = brandData?.unitLabel || 'ml/gal';
  const isEditing = !!editingFeedingLogId;

  const nutrientInputsHtml = components.map(comp => `
    <div class="input-group">
      <label>${comp.name} (${unitLabel})</label>
      <input type="number" id="feed_${comp.key}" data-nutrient-key="${comp.key}" value="${prefill?.nutrients?.[comp.key] ?? (schedule?.[comp.key] || 0)}" min="0" step="0.5" class="feed-nutrient-input">
    </div>
  `).join('');

  formDiv.innerHTML = `
    <div class="feeding-form">
      <h3>${isEditing ? 'Edit Feeding Log' : 'Log Feeding'}</h3>
      <div class="wizard-form-grid">
        <div class="input-group">
          <label>Date</label>
          <input type="date" id="feedDate" value="${prefill?.date || new Date().toISOString().split('T')[0]}">
        </div>
        <div class="input-group">
          <label>Week</label>
          <input type="number" id="feedWeek" value="${prefill?.weekNumber || week}" min="1">
        </div>
        <div class="input-group">
          <label>Water (gallons)</label>
          <input type="number" id="feedGallons" value="${prefill?.waterGallons || grow.gallons || 1}" min="0.25" step="0.25">
        </div>
        ${nutrientInputsHtml}
        <div class="input-group">
          <label>Input PPM</label>
          <input type="number" id="feedInputPpm" value="${prefill?.inputPpm || schedule?.ppm || ''}" min="0">
        </div>
        <div class="input-group">
          <label>Input pH</label>
          <input type="number" id="feedInputPh" value="${prefill?.inputPh || ''}" min="0" max="14" step="0.1">
        </div>
        <div class="input-group">
          <label>Runoff PPM (optional)</label>
          <input type="number" id="feedRunoffPpm" value="${prefill?.runoffPpm || ''}" min="0">
        </div>
        <div class="input-group">
          <label>Runoff pH (optional)</label>
          <input type="number" id="feedRunoffPh" value="${prefill?.runoffPh || ''}" min="0" max="14" step="0.1">
        </div>
      </div>
      <div class="input-group" style="margin-top:10px;">
        <label>Notes</label>
        <textarea id="feedNotes" rows="2" placeholder="Optional notes...">${escapeHtml(prefill?.notes || '')}</textarea>
      </div>
      <div class="form-actions">
        <button id="saveFeedingBtn" class="primary-btn small-btn">${isEditing ? 'Update' : 'Save'}</button>
        <button id="cancelFeedingBtn" class="secondary-btn small-btn">Cancel</button>
      </div>
    </div>
  `;

  formDiv.querySelector('#saveFeedingBtn').addEventListener('click', saveFeedingLog);
  formDiv.querySelector('#cancelFeedingBtn').addEventListener('click', () => {
    editingFeedingLogId = null;
    formDiv.classList.add('hidden');
  });
}

function validateFeedingForm() {
  const errors = [];
  const date = document.getElementById('feedDate').value;
  const ph = parseFloat(document.getElementById('feedInputPh').value);
  const gallons = parseFloat(document.getElementById('feedGallons').value);
  const week = parseInt(document.getElementById('feedWeek').value);

  if (date && new Date(date) > new Date()) {
    errors.push({ field: 'feedDate', msg: 'Date cannot be in the future.' });
  }
  if (!isNaN(ph) && (ph < 0 || ph > 14)) {
    errors.push({ field: 'feedInputPh', msg: 'pH must be between 0 and 14.' });
  }
  if (!gallons || gallons <= 0) {
    errors.push({ field: 'feedGallons', msg: 'Water volume must be greater than 0.' });
  }
  if (!week || week < 1 || !Number.isInteger(week)) {
    errors.push({ field: 'feedWeek', msg: 'Week must be a positive whole number.' });
  }

  // Clear previous errors
  document.querySelectorAll('#feedingForm .input-error').forEach(el => {
    el.classList.remove('input-error');
    el.removeAttribute('aria-describedby');
  });
  document.querySelectorAll('#feedingForm .feed-error-msg').forEach(el => el.remove());

  if (errors.length > 0) {
    errors.forEach(e => {
      const field = document.getElementById(e.field);
      if (field) {
        field.classList.add('input-error');
        const errId = e.field + '_error';
        const errEl = document.createElement('div');
        errEl.className = 'feed-error-msg input-error-message';
        errEl.id = errId;
        errEl.setAttribute('role', 'alert');
        errEl.textContent = e.msg;
        field.setAttribute('aria-describedby', errId);
        field.parentNode.appendChild(errEl);
      }
    });
    showToast(errors[0].msg, 'error');
    return false;
  }
  return true;
}

async function saveFeedingLog() {
  if (!validateFeedingForm()) return;

  const btn = document.getElementById('saveFeedingBtn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Saving...';

  // Dynamically collect nutrient values from all brand component inputs
  const nutrients = {};
  document.querySelectorAll('#feedingForm .feed-nutrient-input').forEach(input => {
    const key = input.dataset.nutrientKey;
    if (key) nutrients[key] = parseFloat(input.value) || 0;
  });

  const logData = {
    date: document.getElementById('feedDate').value,
    weekNumber: parseInt(document.getElementById('feedWeek').value),
    waterGallons: parseFloat(document.getElementById('feedGallons').value),
    nutrientBrand: grow.nutrientBrand || 'gh-flora-trio',
    nutrients,
    inputPpm: parseFloat(document.getElementById('feedInputPpm').value) || null,
    inputPh: parseFloat(document.getElementById('feedInputPh').value) || null,
    runoffPpm: parseFloat(document.getElementById('feedRunoffPpm').value) || null,
    runoffPh: parseFloat(document.getElementById('feedRunoffPh').value) || null,
    notes: document.getElementById('feedNotes').value.trim()
  };

  try {
    const user = fb.getCurrentUser();
    if (editingFeedingLogId) {
      // Update existing log
      if (user) {
        await fb.updateFeedingLog(user.uid, growId, editingFeedingLogId, logData);
      } else {
        const logs = store.get(`grow_${growId}_feedingLogs`) || [];
        const idx = logs.findIndex(l => l.id === editingFeedingLogId);
        if (idx !== -1) { Object.assign(logs[idx], logData, { updatedAt: new Date().toISOString() }); }
        store.set(`grow_${growId}_feedingLogs`, logs);
        feedingLogsData = logs;
        renderFeedingHistory(logs);
        renderFeedingChart(logs);
      }
      editingFeedingLogId = null;
    } else {
      // Create new log
      if (user) {
        await fb.createFeedingLog(user.uid, growId, logData);
      } else {
        const logs = store.get(`grow_${growId}_feedingLogs`) || [];
        logData.id = 'log_' + Date.now();
        logData.createdAt = new Date().toISOString();
        logs.push(logData);
        store.set(`grow_${growId}_feedingLogs`, logs);
        feedingLogsData = logs;
        renderFeedingHistory(logs);
        renderFeedingChart(logs);
      }
    }

    document.getElementById('feedingForm').classList.add('hidden');
  } catch (err) {
    console.error('Save feeding log error:', err);
    showToast('Failed to save feeding log.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function renderFeedingHistory(logs) {
  const container = document.getElementById('feedingHistory');
  if (!container) return;

  if (!logs || logs.length === 0) {
    container.innerHTML = '<p class="text-muted">No feeding logs yet.</p>';
    return;
  }

  const brand = grow?.nutrientBrand || 'gh-flora-trio';
  const components = getMixingOrder(brand);
  const sorted = [...logs].sort((a, b) => (b.date || b.createdAt || '').localeCompare(a.date || a.createdAt || ''));

  container.innerHTML = `
    <div class="feeding-log-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Date</th><th scope="col">Wk</th><th scope="col">Gal</th>
            ${components.map(c => `<th scope="col">${escapeHtml(c.name)}</th>`).join('')}
            <th scope="col">PPM</th><th scope="col">pH</th><th scope="col">Notes</th><th scope="col" class="log-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(l => `
            <tr>
              <td>${escapeHtml(l.date || '-')}</td>
              <td>${l.weekNumber || '-'}</td>
              <td>${l.waterGallons || '-'}</td>
              ${components.map(c => `<td>${l.nutrients?.[c.key] || 0}</td>`).join('')}
              <td>${l.inputPpm || '-'}</td>
              <td>${l.inputPh || '-'}</td>
              <td>${escapeHtml(l.notes || '')}</td>
              <td class="log-actions">
                <button class="icon-btn feed-edit-btn" data-log-id="${escapeHtml(l.id)}" title="Edit" aria-label="Edit log">&#9998;</button>
                <button class="icon-btn feed-delete-btn" data-log-id="${escapeHtml(l.id)}" title="Delete" aria-label="Delete log">&#128465;</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  checkTableOverflow(container.querySelector('.feeding-log-table'));
}

// ── Feeding Log Edit/Delete ──

function editFeedingLog(logId) {
  const log = feedingLogsData.find(l => l.id === logId);
  if (!log) return;
  editingFeedingLogId = logId;
  const formDiv = document.getElementById('feedingForm');
  showFeedingForm(formDiv, log);
  formDiv.classList.remove('hidden');
  formDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function deleteFeedingLogEntry(logId) {
  if (!(await showConfirmModal('Delete this feeding log entry?', true))) return;
  try {
    const user = fb.getCurrentUser();
    if (user) {
      await fb.deleteFeedingLog(user.uid, growId, logId);
    } else {
      let logs = store.get(`grow_${growId}_feedingLogs`) || [];
      logs = logs.filter(l => l.id !== logId);
      store.set(`grow_${growId}_feedingLogs`, logs);
      feedingLogsData = logs;
      renderFeedingHistory(logs);
      renderFeedingChart(logs);
    }
    showToast('Feeding log deleted.', 'success');
  } catch (err) {
    console.error('Delete feeding log error:', err);
    showToast('Failed to delete feeding log.', 'error');
  }
}

// ── Feeding Log Chart ──

function renderFeedingChart(logs) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('feedingChart');
  if (!canvas) return;

  if (feedingChart) {
    try { feedingChart.destroy(); } catch (e) { /* ignore */ }
    feedingChart = null;
  }

  if (!logs || logs.length < 2) return;

  const dated = logs.filter(l => l.date).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (dated.length < 2) return;

  const brand = grow?.nutrientBrand || 'gh-flora-trio';
  const components = getMixingOrder(brand);
  const labels = dated.map(l => l.date);

  const colors = getChartColors();
  Chart.defaults.color = colors.textColor;
  Chart.defaults.borderColor = colors.gridColor;

  const datasets = components.map(comp => ({
    label: comp.name,
    data: dated.map(l => l.nutrients?.[comp.key] || 0),
    borderColor: comp.color,
    backgroundColor: comp.color + '33',
    fill: false,
    tension: 0.3,
    yAxisID: 'y'
  }));

  // PPM datasets
  if (dated.some(l => l.inputPpm)) {
    datasets.push({
      label: 'Input PPM',
      data: dated.map(l => l.inputPpm || null),
      borderColor: '#8e44ad',
      borderDash: [5, 5],
      fill: false,
      tension: 0.3,
      yAxisID: 'y1'
    });
  }
  if (dated.some(l => l.runoffPpm)) {
    datasets.push({
      label: 'Runoff PPM',
      data: dated.map(l => l.runoffPpm || null),
      borderColor: '#e67e22',
      borderDash: [5, 5],
      fill: false,
      tension: 0.3,
      yAxisID: 'y1'
    });
  }
  // pH dataset (hidden by default)
  if (dated.some(l => l.inputPh)) {
    datasets.push({
      label: 'Input pH',
      data: dated.map(l => l.inputPh || null),
      borderColor: '#1abc9c',
      borderDash: [3, 3],
      fill: false,
      tension: 0.3,
      yAxisID: 'y1',
      hidden: true
    });
  }

  const ctx = canvas.getContext('2d');
  feedingChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Feeding Log Over Time' }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Amount per gal' }, position: 'left' },
        y1: { beginAtZero: true, title: { display: true, text: 'PPM / pH' }, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  });
}

// ── Delete Grow ──

async function handleDeleteGrow() {
  const name = grow?.strainName || 'this grow';
  if (!(await showConfirmModal(`Permanently delete "${name}" and ALL its data (notes, logs, photos)? This cannot be undone.`, true))) return;

  const btn = document.getElementById('deleteGrowBtn');
  btn.disabled = true;
  btn.textContent = 'Deleting...';

  try {
    const user = fb.getCurrentUser();
    if (user) {
      await fb.deleteGrowWithSubcollections(user.uid, growId);
    }
    // Clear localStorage keys for this grow
    const grows = store.get('grows') || {};
    delete grows[growId];
    store.set('grows', grows);
    // Clear subcollection keys
    for (const suffix of ['notes', 'feedingLogs', 'envLogs', 'photos']) {
      store.set(`grow_${growId}_${suffix}`, undefined);
    }
    // Clear checklist keys
    const totalWeeks = getTotalWeeks(grow?.nutrientBrand || 'gh-flora-trio', grow?.plantType || 'autoflower', grow?.growMedium || 'hydro', grow?.photoperiodVegWeeks);
    for (let w = 1; w <= totalWeeks; w++) {
      store.set(`grow_${growId}_checklist_${w}`, undefined);
    }

    showToast('Grow deleted.', 'success');
    router.navigate('/dashboard');
  } catch (err) {
    console.error('Delete grow error:', err);
    showToast('Failed to delete grow.', 'error');
    btn.disabled = false;
    btn.textContent = 'Delete Grow';
  }
}

// ── Edit Grow Settings ──

function showEditGrowModal() {
  const existing = document.getElementById('editGrowModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'editGrowModal';
  overlay.className = 'modal-overlay';

  const brandOptions = Object.entries(NUTRIENT_BRANDS).map(([key, b]) =>
    `<option value="${key}" ${key === (grow.nutrientBrand || 'gh-flora-trio') ? 'selected' : ''}>${escapeHtml(b.name)}</option>`
  ).join('');

  overlay.innerHTML = `
    <div class="modal-content">
      <h3>Edit Grow Settings</h3>
      <div class="wizard-form-grid">
        <div class="input-group">
          <label>Strain Name</label>
          <input type="text" id="editStrainName" value="${escapeHtml(grow.strainName || '')}">
        </div>
        <div class="input-group">
          <label>Breeder</label>
          <input type="text" id="editBreeder" value="${escapeHtml(grow.breeder || '')}">
        </div>
        <div class="input-group">
          <label>Growing Medium</label>
          <select id="editMedium">
            <option value="hydro" ${grow.growMedium === 'hydro' ? 'selected' : ''}>Hydroponic</option>
            <option value="soil" ${grow.growMedium === 'soil' ? 'selected' : ''}>Soil</option>
            <option value="coco" ${grow.growMedium === 'coco' ? 'selected' : ''}>Coco Coir</option>
          </select>
        </div>
        <div class="input-group">
          <label>Nutrient Brand</label>
          <select id="editNutrientBrand">${brandOptions}</select>
        </div>
        <div class="input-group">
          <label>Light Schedule</label>
          <input type="text" id="editLightSchedule" value="${escapeHtml(grow.lightSchedule || '18/6')}" placeholder="e.g. 18/6">
        </div>
        ${grow.plantType === 'photoperiod' ? `
        <div class="input-group">
          <label>Veg Weeks</label>
          <input type="number" id="editVegWeeks" value="${grow.photoperiodVegWeeks || 4}" min="2" max="12">
        </div>
        ` : ''}
      </div>
      <div class="form-actions">
        <button id="saveEditGrowBtn" class="primary-btn small-btn">Save Changes</button>
        <button id="cancelEditGrowBtn" class="secondary-btn small-btn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#cancelEditGrowBtn').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#saveEditGrowBtn').addEventListener('click', async () => {
    const updates = {
      strainName: document.getElementById('editStrainName').value.trim(),
      breeder: document.getElementById('editBreeder').value.trim(),
      growMedium: document.getElementById('editMedium').value,
      nutrientBrand: document.getElementById('editNutrientBrand').value,
      lightSchedule: document.getElementById('editLightSchedule').value.trim()
    };
    if (grow.plantType === 'photoperiod') {
      updates.photoperiodVegWeeks = parseInt(document.getElementById('editVegWeeks').value) || 4;
    }

    try {
      const user = fb.getCurrentUser();
      if (user) {
        await fb.updateGrow(user.uid, growId, updates);
      } else {
        const grows = store.get('grows') || {};
        if (grows[growId]) { Object.assign(grows[growId], updates); store.set('grows', grows); }
      }
      Object.assign(grow, updates);
      populateWeekSelector();
      loadGrowValues();
      updateAll();
      overlay.remove();
      showToast('Grow settings updated.', 'success');
    } catch (err) {
      console.error('Edit grow error:', err);
      showToast('Failed to save changes.', 'error');
    }
  });
}

// ── Table Scroll Overflow Check ──

function checkTableOverflow(tableWrapper) {
  if (!tableWrapper) return;
  const check = () => {
    tableWrapper.classList.toggle('has-overflow', tableWrapper.scrollWidth > tableWrapper.clientWidth);
  };
  check();
  window.addEventListener('resize', check);
}

// ── Recent Notes Preview ──

function renderRecentNotes(notes) {
  const container = document.getElementById('recentNotes');
  if (!container) return;

  if (!notes || notes.length === 0) {
    container.innerHTML = '<p class="text-muted">No notes yet. <a href="#/grow/' + escapeHtml(growId) + '/notes">Add one</a></p>';
    return;
  }

  const sorted = [...notes].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const recent = sorted.slice(0, 5);

  const categoryIcons = { feeding: '&#x1f4a7;', environment: '&#x1f321;', observation: '&#x1f441;', issue: '&#x26a0;&#xfe0f;', milestone: '&#x2b50;', general: '&#x1f4dd;' };

  container.innerHTML = recent.map(n => `
    <div class="note-preview-card">
      <span class="note-icon">${categoryIcons[n.category] || '&#x1f4dd;'}</span>
      <div>
        <strong>${escapeHtml(n.title || 'Untitled')}</strong>
        <p class="text-muted">${escapeHtml((n.content || '').slice(0, 100))}${(n.content || '').length > 100 ? '...' : ''}</p>
        <small class="text-muted">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''} ${n.week ? '| Week ' + escapeHtml(String(n.week)) : ''}</small>
      </div>
    </div>
  `).join('');
}

// ── Recent Photos Preview ──

function renderRecentPhotos(photos) {
  const container = document.getElementById('recentPhotos');
  if (!container) return;

  if (!photos || photos.length === 0) {
    container.innerHTML = '<p class="text-muted">No photos yet. <a href="#/grow/' + escapeHtml(growId) + '/gallery">Upload one</a></p>';
    return;
  }

  const sorted = [...photos].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const recent = sorted.slice(0, 4);

  container.innerHTML = `
    <div class="photo-preview-grid">
      ${recent.map(p => {
        const alt = p.caption || `${p.category || 'plant'} photo${p.week ? ', week ' + p.week : ''}`;
        return `
        <div class="photo-thumb">
          <img src="${p.thumbnailUrl || p.url}" alt="${escapeHtml(alt)}" loading="lazy">
        </div>
      `; }).join('')}
    </div>
  `;
}

// ── Cultivation Tips ──

function updateCultivationTips() {
  const container = document.getElementById('cultivationTips');
  const section = document.getElementById('tipsSection');
  if (!container || !section) return;

  const week = parseInt(document.getElementById('currentWeek').value);
  const plantType = grow?.plantType || 'autoflower';
  const guides = getRelevantGuides(plantType, week);

  if (guides.length === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  container.innerHTML = guides.map(g => `
    <div class="tip-card">
      <div class="tip-header">
        <span class="tip-icon">${g.icon}</span>
        <strong>${escapeHtml(g.title)}</strong>
        ${g.isPeak ? '<span class="tip-peak-badge">Best time!</span>' : ''}
      </div>
      <p class="text-muted">${escapeHtml(g.summary)}</p>
      <a href="#/grow/${escapeHtml(growId)}/guides?guide=${escapeHtml(g.id)}" class="view-all-link">Read full guide &rarr;</a>
    </div>
  `).join('');
}

// ── Recent Environment Logs ──

function renderRecentEnvLogs(logs) {
  const container = document.getElementById('recentEnvLogs');
  if (!container) return;

  if (!logs || logs.length === 0) {
    container.innerHTML = '<p class="text-muted">No readings yet. <a href="#/grow/' + escapeHtml(growId) + '/environment">Log one</a></p>';
    return;
  }

  const sorted = [...logs].sort((a, b) => (b.datetime || b.createdAt || '').localeCompare(a.datetime || a.createdAt || ''));
  const recent = sorted.slice(0, 5);

  container.innerHTML = `<div class="env-preview-cards">${recent.map(l => {
    const stageKey = getEnvStageForWeek(grow?.plantType || 'autoflower', l.weekNumber || 1, grow?.photoperiodVegWeeks);
    const result = checkEnvAlerts({ tempF: l.tempF, humidity: l.humidity, vpd: l.vpd, co2: l.co2 }, stageKey);
    const statusClass = result.status === 'ok' ? 'env-status-ok' : result.status === 'alert' ? 'env-status-alert' : 'env-status-warn';
    const dt = l.datetime ? new Date(l.datetime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

    return `
      <div class="env-preview-card ${statusClass}">
        <div class="env-preview-time">${escapeHtml(dt)}</div>
        <div class="env-preview-values">
          <span>${l.tempF}\u00B0F</span>
          <span>${l.humidity}% RH</span>
          <span>VPD ${l.vpd}</span>
          ${l.co2 ? `<span>${l.co2} ppm CO2</span>` : ''}
        </div>
      </div>
    `;
  }).join('')}</div>`;
}

// ── Complete Grow ──

async function handleCompleteGrow() {
  const isCompleted = grow.status === 'completed';
  const action = isCompleted ? 'reactivate' : 'complete';
  if (!(await showConfirmModal(`Are you sure you want to ${action} this grow?`, !isCompleted))) return;

  const btn = document.getElementById('completeGrowBtn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = isCompleted ? 'Reactivating...' : 'Completing...';

  const newStatus = isCompleted ? 'active' : 'completed';
  const updates = { status: newStatus };
  if (!isCompleted) {
    updates.endDate = new Date().toISOString();
    // Prompt for harvest data
    const harvestData = await showHarvestForm();
    if (harvestData) updates.harvest = harvestData;
  }

  try {
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
      delete grow.harvest;
      btn.textContent = 'Complete Grow';
      renderHarvestSummary();
    }
  } catch (err) {
    console.error('Complete grow error:', err);
    showToast(`Failed to ${action} grow.`, 'error');
  } finally {
    btn.disabled = false;
    if (document.getElementById('completeGrowBtn')) {
      btn.textContent = grow?.status === 'completed' ? 'Reactivate Grow' : originalText;
    }
  }
}

// ── Harvest Form ──

function showHarvestForm() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h3>Harvest Data (Optional)</h3>
        <p class="text-muted" style="margin-bottom:15px;">Record your harvest details. You can skip this step.</p>
        <div class="wizard-form-grid">
          <div class="input-group">
            <label>Dry Weight (grams)</label>
            <input type="number" id="harvestWeight" min="0" step="0.1" placeholder="0">
          </div>
          <div class="input-group">
            <label>Quality Rating</label>
            <select id="harvestQuality">
              <option value="">-- Select --</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>
        <div class="input-group" style="margin-top:10px;">
          <label>Harvest Notes</label>
          <textarea id="harvestNotes" rows="3" placeholder="Observations about the harvest..."></textarea>
        </div>
        <div class="form-actions">
          <button id="saveHarvestBtn" class="primary-btn small-btn">Save Harvest Data</button>
          <button id="skipHarvestBtn" class="secondary-btn small-btn">Skip</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#skipHarvestBtn').addEventListener('click', () => { overlay.remove(); resolve(null); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.remove(); resolve(null); } });
    overlay.querySelector('#saveHarvestBtn').addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('harvestWeight').value);
      const quality = parseInt(document.getElementById('harvestQuality').value);
      const notes = document.getElementById('harvestNotes').value.trim();
      const data = {};
      if (!isNaN(weight) && weight > 0) data.dryWeightGrams = weight;
      if (!isNaN(quality) && quality >= 1 && quality <= 5) data.qualityRating = quality;
      if (notes) data.harvestNotes = notes;
      overlay.remove();
      resolve(Object.keys(data).length > 0 ? data : null);
    });
  });
}

// ── Harvest Summary ──

function renderHarvestSummary() {
  const existing = document.getElementById('harvestSummarySection');
  if (existing) existing.remove();

  if (!grow || grow.status !== 'completed' || !grow.harvest) return;

  const content = document.getElementById('growDetailContent');
  if (!content) return;

  const h = grow.harvest;
  const stars = h.qualityRating ? Array.from({ length: 5 }, (_, i) => i < h.qualityRating ? '&#9733;' : '&#9734;').join('') : '';

  const section = document.createElement('section');
  section.id = 'harvestSummarySection';
  section.className = 'harvest-summary-section';
  section.innerHTML = `
    <h2>Harvest Summary</h2>
    <div class="harvest-summary-grid">
      ${h.dryWeightGrams ? `
      <div class="harvest-stat">
        <span class="harvest-stat-label">Dry Weight</span>
        <span class="harvest-stat-value">${h.dryWeightGrams}g</span>
      </div>` : ''}
      ${h.qualityRating ? `
      <div class="harvest-stat">
        <span class="harvest-stat-label">Quality</span>
        <span class="harvest-stat-value harvest-stars">${stars}</span>
      </div>` : ''}
      ${grow.endDate ? `
      <div class="harvest-stat">
        <span class="harvest-stat-label">Completed</span>
        <span class="harvest-stat-value">${new Date(grow.endDate).toLocaleDateString()}</span>
      </div>` : ''}
    </div>
    ${h.harvestNotes ? `<p class="harvest-notes">${escapeHtml(h.harvestNotes)}</p>` : ''}
  `;

  content.insertBefore(section, content.firstChild);
}

// ── Persistence Helper ──

function saveGrowField(field, value) {
  grow[field] = value;

  const user = fb.getCurrentUser();
  if (user) {
    fb.updateGrow(user.uid, growId, { [field]: value }).catch((err) => {
      console.error('Save field error:', err);
      showToast('Failed to save changes.', 'error');
    });
  } else {
    const grows = store.get('grows') || {};
    if (grows[growId]) {
      grows[growId][field] = value;
      store.set('grows', grows);
    }
  }
}

export function destroy() {
  if (unsubGrow) { unsubGrow(); unsubGrow = null; }
  if (unsubNotes) { unsubNotes(); unsubNotes = null; }
  if (unsubPhotos) { unsubPhotos(); unsubPhotos = null; }
  if (unsubLogs) { unsubLogs(); unsubLogs = null; }
  if (unsubEnvLogs) { unsubEnvLogs(); unsubEnvLogs = null; }
  if (unsubStore) { unsubStore(); unsubStore = null; }
  if (autoUpdateInterval) { clearInterval(autoUpdateInterval); autoUpdateInterval = null; }
  if (scheduleChart) {
    try { scheduleChart.destroy(); } catch (e) { /* ignore */ }
    scheduleChart = null;
  }
  if (ppmChart) {
    try { ppmChart.destroy(); } catch (e) { /* ignore */ }
    ppmChart = null;
  }
  if (feedingChart) {
    try { feedingChart.destroy(); } catch (e) { /* ignore */ }
    feedingChart = null;
  }
  grow = null;
  growId = null;
  listenersAttached = false;
  editingFeedingLogId = null;
  feedingLogsData = [];
}
