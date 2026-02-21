// Environmental logging view — log temp, humidity, VPD, CO2
import store from '../store.js';
import * as fb from '../firebase.js';
import { updateNav } from '../components/header.js';
import { escapeHtml, isValidGrowId, showConfirmModal, showToast } from '../utils.js';
import { ENV_RANGES, calculateVpd, fToC, cToF, getEnvStageForWeek, checkEnvAlerts } from '../data/env-ranges.js';

let growId = null;
let grow = null;
let envLogs = [];
let unsubEnvLogs = null;
let envChart = null;
let useCelsius = false;
let editingEnvLogId = null;

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <section class="env-section">
      <div class="section-header-row">
        <h2>Environment Log</h2>
        <a href="#/grow/${escapeHtml(growId)}" class="view-all-link">&larr; Back to Grow</a>
      </div>

      <!-- Optimal Ranges Card -->
      <div id="envRangesCard" class="env-ranges-card"></div>

      <!-- Entry Form -->
      <div class="env-form-container">
        <h3>Log Reading</h3>
        <div class="wizard-form-grid">
          <div class="input-group">
            <label>Date & Time</label>
            <input type="datetime-local" id="envDatetime" value="${new Date().toISOString().slice(0, 16)}">
          </div>
          <div class="input-group">
            <label>Temperature
              <button type="button" id="tempUnitToggle" class="unit-toggle-btn">°F</button>
            </label>
            <input type="number" id="envTemp" step="0.1" placeholder="75">
          </div>
          <div class="input-group">
            <label>Humidity (%)</label>
            <input type="number" id="envHumidity" step="1" min="0" max="100" placeholder="55">
          </div>
          <div class="input-group">
            <label>VPD (kPa) — auto-calculated</label>
            <input type="number" id="envVpd" step="0.01" readonly tabindex="-1" class="vpd-readonly" aria-description="Auto-calculated from temperature and humidity">
          </div>
          <div class="input-group">
            <label>CO2 (ppm, optional)</label>
            <input type="number" id="envCo2" step="1" min="0" placeholder="400">
          </div>
          <div class="input-group">
            <label>Week</label>
            <input type="number" id="envWeek" min="1" value="1">
          </div>
        </div>
        <div id="envAlerts" class="env-alerts"></div>
        <div class="input-group" style="margin-top:10px;">
          <label>Notes (optional)</label>
          <textarea id="envNotes" rows="2" placeholder="Any observations..."></textarea>
        </div>
        <div class="form-actions">
          <button id="saveEnvBtn" class="primary-btn small-btn">Save Reading</button>
        </div>
      </div>

      <!-- Chart -->
      <div class="env-chart-section">
        <h3>Environment Over Time</h3>
        <div class="chart-container" style="height: 350px;">
          <canvas id="envChart"></canvas>
        </div>
      </div>

      <!-- History Table -->
      <h3>Reading History</h3>
      <div id="envHistory"></div>
    </section>
  `;
}

export async function init(params) {
  growId = params.id;

  if (!isValidGrowId(growId)) {
    const router = (await import('../router.js')).default;
    router.navigate('/dashboard');
    return;
  }

  updateNav(growId);

  // Load grow data
  const user = fb.getCurrentUser();
  if (user) {
    const growData = await fb.getGrow(user.uid, growId);
    grow = growData;
  } else {
    const grows = store.get('grows') || {};
    grow = grows[growId] ? { ...grows[growId], id: growId } : null;
  }

  if (grow?.currentWeek) {
    document.getElementById('envWeek').value = grow.currentWeek;
  }

  renderRangesCard();
  attachListeners();
  loadEnvLogs();
}

function attachListeners() {
  document.getElementById('saveEnvBtn').addEventListener('click', saveEnvLog);

  // Auto-calculate VPD on temp/humidity change
  document.getElementById('envTemp').addEventListener('input', updateVpdPreview);
  document.getElementById('envHumidity').addEventListener('input', updateVpdPreview);

  // Week change updates ranges card
  document.getElementById('envWeek').addEventListener('change', renderRangesCard);

  // Temp unit toggle
  document.getElementById('tempUnitToggle').addEventListener('click', () => {
    const tempInput = document.getElementById('envTemp');
    const currentVal = parseFloat(tempInput.value);
    useCelsius = !useCelsius;
    document.getElementById('tempUnitToggle').textContent = useCelsius ? '\u00B0C' : '\u00B0F';
    if (!isNaN(currentVal)) {
      tempInput.value = useCelsius ? fToC(currentVal) : cToF(currentVal);
    }
    updateVpdPreview();
  });

  // Delegated edit/delete for env history
  const historyEl = document.getElementById('envHistory');
  if (historyEl) {
    historyEl.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.env-edit-btn');
      const deleteBtn = e.target.closest('.env-delete-btn');
      if (editBtn) editEnvLog(editBtn.dataset.logId);
      if (deleteBtn) deleteEnvLogEntry(deleteBtn.dataset.logId);
    });
  }
}

function updateVpdPreview() {
  let tempF;
  const tempVal = parseFloat(document.getElementById('envTemp').value);
  if (isNaN(tempVal)) return;

  tempF = useCelsius ? parseFloat(cToF(tempVal)) : tempVal;
  const humidity = parseFloat(document.getElementById('envHumidity').value);
  if (isNaN(humidity)) return;

  const vpd = calculateVpd(tempF, humidity);
  document.getElementById('envVpd').value = vpd.toFixed(2);

  // Show inline alerts
  const week = parseInt(document.getElementById('envWeek').value) || 1;
  const stageKey = getEnvStageForWeek(grow?.plantType || 'autoflower', week, grow?.photoperiodVegWeeks);
  const result = checkEnvAlerts({ tempF, humidity, vpd }, stageKey);

  const alertsDiv = document.getElementById('envAlerts');
  if (result.alerts.length > 0) {
    alertsDiv.innerHTML = result.alerts.map(a => `
      <div class="env-alert env-alert-${a.level}">
        ${a.level === 'alert' ? '&#x1f6a8;' : '&#x26a0;&#xfe0f;'} ${escapeHtml(a.message)}
      </div>
    `).join('');
  } else {
    alertsDiv.innerHTML = '<div class="env-alert env-alert-ok">&#x2705; All values within optimal range</div>';
  }
}

function renderRangesCard() {
  const container = document.getElementById('envRangesCard');
  if (!container) return;

  const week = parseInt(document.getElementById('envWeek')?.value) || grow?.currentWeek || 1;
  const stageKey = getEnvStageForWeek(grow?.plantType || 'autoflower', week, grow?.photoperiodVegWeeks);
  const ranges = ENV_RANGES[stageKey];

  if (!ranges) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <h3>Optimal Ranges — ${escapeHtml(ranges.label)} Stage</h3>
    <div class="env-ranges-grid">
      <div class="env-range-item">
        <span class="env-range-label">Temperature</span>
        <span class="env-range-value">${ranges.temp.min}-${ranges.temp.max}\u00B0F</span>
      </div>
      <div class="env-range-item">
        <span class="env-range-label">Humidity</span>
        <span class="env-range-value">${ranges.humidity.min}-${ranges.humidity.max}%</span>
      </div>
      <div class="env-range-item">
        <span class="env-range-label">VPD</span>
        <span class="env-range-value">${ranges.vpd.min}-${ranges.vpd.max} kPa</span>
      </div>
      <div class="env-range-item">
        <span class="env-range-label">CO2</span>
        <span class="env-range-value">${ranges.co2.min}-${ranges.co2.max} ppm</span>
      </div>
    </div>
  `;
}

async function saveEnvLog() {
  let tempF;
  const tempVal = parseFloat(document.getElementById('envTemp').value);
  if (isNaN(tempVal)) { showToast('Please enter a temperature.', 'error'); return; }
  tempF = useCelsius ? parseFloat(cToF(tempVal)) : tempVal;

  const humidity = parseFloat(document.getElementById('envHumidity').value);
  if (isNaN(humidity)) { showToast('Please enter humidity.', 'error'); return; }

  const btn = document.getElementById('saveEnvBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  const vpd = calculateVpd(tempF, humidity);
  const logData = {
    datetime: document.getElementById('envDatetime').value,
    tempF: parseFloat(tempF.toFixed(1)),
    humidity: parseFloat(humidity.toFixed(1)),
    vpd: parseFloat(vpd.toFixed(2)),
    co2: parseInt(document.getElementById('envCo2').value) || null,
    weekNumber: parseInt(document.getElementById('envWeek').value) || 1,
    notes: document.getElementById('envNotes').value.trim()
  };

  try {
    const user = fb.getCurrentUser();
    if (editingEnvLogId) {
      if (user) {
        await fb.updateEnvLog(user.uid, growId, editingEnvLogId, logData);
      } else {
        const logs = store.get(`grow_${growId}_envLogs`) || [];
        const idx = logs.findIndex(l => l.id === editingEnvLogId);
        if (idx !== -1) Object.assign(logs[idx], logData, { updatedAt: new Date().toISOString() });
        store.set(`grow_${growId}_envLogs`, logs);
        envLogs = logs;
        renderHistory();
        renderEnvChart();
      }
      editingEnvLogId = null;
      showToast('Reading updated.', 'success');
    } else {
      if (user) {
        await fb.createEnvLog(user.uid, growId, logData);
      } else {
        const logs = store.get(`grow_${growId}_envLogs`) || [];
        logData.id = 'env_' + Date.now();
        logData.createdAt = new Date().toISOString();
        logs.push(logData);
        store.set(`grow_${growId}_envLogs`, logs);
        envLogs = logs;
        renderHistory();
        renderEnvChart();
      }
      showToast('Reading saved.', 'success');
    }
    // Reset form
    document.getElementById('envNotes').value = '';
    document.getElementById('envAlerts').innerHTML = '';
    const saveBtn = document.getElementById('saveEnvBtn');
    saveBtn.textContent = 'Save Reading';
  } catch (err) {
    console.error('Save env log error:', err);
    showToast('Failed to save reading.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Reading';
  }
}

function loadEnvLogs() {
  const user = fb.getCurrentUser();
  if (user) {
    unsubEnvLogs = fb.onAllEnvLogs(user.uid, growId, (logs) => {
      envLogs = logs;
      renderHistory();
      renderEnvChart();
    });
  } else {
    envLogs = store.get(`grow_${growId}_envLogs`) || [];
    renderHistory();
    renderEnvChart();
  }
}

function renderHistory() {
  const container = document.getElementById('envHistory');
  if (!container) return;

  if (!envLogs || envLogs.length === 0) {
    container.innerHTML = '<p class="text-muted">No readings yet.</p>';
    return;
  }

  const sorted = [...envLogs].sort((a, b) => (b.datetime || b.createdAt || '').localeCompare(a.datetime || a.createdAt || ''));

  container.innerHTML = `
    <div class="feeding-log-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Date/Time</th><th scope="col">Wk</th><th scope="col">Temp (\u00B0F)</th><th scope="col">Humidity</th><th scope="col">VPD</th><th scope="col">CO2</th><th scope="col">Status</th><th scope="col">Notes</th><th scope="col" class="log-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(l => {
            const stageKey = getEnvStageForWeek(grow?.plantType || 'autoflower', l.weekNumber || 1, grow?.photoperiodVegWeeks);
            const result = checkEnvAlerts({ tempF: l.tempF, humidity: l.humidity, vpd: l.vpd, co2: l.co2 }, stageKey);
            const statusBadge = result.status === 'ok'
              ? '<span class="env-status-badge env-status-ok">OK</span>'
              : result.status === 'alert'
              ? '<span class="env-status-badge env-status-alert">ALERT</span>'
              : '<span class="env-status-badge env-status-warn">WARN</span>';

            const dt = l.datetime ? new Date(l.datetime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
            return `
              <tr>
                <td>${escapeHtml(dt)}</td>
                <td>${l.weekNumber || '-'}</td>
                <td>${l.tempF || '-'}</td>
                <td>${l.humidity || '-'}%</td>
                <td>${l.vpd || '-'}</td>
                <td>${l.co2 || '-'}</td>
                <td>${statusBadge}</td>
                <td>${escapeHtml(l.notes || '')}</td>
                <td class="log-actions">
                  <button class="icon-btn env-edit-btn" data-log-id="${escapeHtml(l.id)}" title="Edit" aria-label="Edit reading">&#9998;</button>
                  <button class="icon-btn env-delete-btn" data-log-id="${escapeHtml(l.id)}" title="Delete" aria-label="Delete reading">&#128465;</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function editEnvLog(logId) {
  const log = envLogs.find(l => l.id === logId);
  if (!log) return;
  editingEnvLogId = logId;

  // Pre-populate form
  if (log.datetime) document.getElementById('envDatetime').value = log.datetime;
  const tempVal = useCelsius && log.tempF ? fToC(log.tempF) : log.tempF;
  if (tempVal != null) document.getElementById('envTemp').value = tempVal;
  if (log.humidity != null) document.getElementById('envHumidity').value = log.humidity;
  if (log.co2 != null) document.getElementById('envCo2').value = log.co2;
  if (log.weekNumber) document.getElementById('envWeek').value = log.weekNumber;
  if (log.notes) document.getElementById('envNotes').value = log.notes;
  updateVpdPreview();

  document.getElementById('saveEnvBtn').textContent = 'Update Reading';
  document.querySelector('.env-form-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function deleteEnvLogEntry(logId) {
  if (!(await showConfirmModal('Delete this environment reading?', true))) return;
  try {
    const user = fb.getCurrentUser();
    if (user) {
      await fb.deleteEnvLog(user.uid, growId, logId);
    } else {
      envLogs = envLogs.filter(l => l.id !== logId);
      store.set(`grow_${growId}_envLogs`, envLogs);
      renderHistory();
      renderEnvChart();
    }
    showToast('Reading deleted.', 'success');
  } catch (err) {
    console.error('Delete env log error:', err);
    showToast('Failed to delete reading.', 'error');
  }
}

function renderEnvChart() {
  if (typeof Chart === 'undefined' || !envLogs || envLogs.length === 0) return;

  const canvas = document.getElementById('envChart');
  if (!canvas) return;

  if (envChart) {
    try { envChart.destroy(); } catch (e) { /* ignore */ }
    envChart = null;
  }

  const sorted = [...envLogs].sort((a, b) => (a.datetime || a.createdAt || '').localeCompare(b.datetime || b.createdAt || ''));

  const labels = sorted.map(l => {
    if (!l.datetime) return '';
    return new Date(l.datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });

  const ctx = canvas.getContext('2d');
  envChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temp (\u00B0F)',
          data: sorted.map(l => l.tempF),
          borderColor: '#e74c3c',
          backgroundColor: '#e74c3c33',
          yAxisID: 'y',
          tension: 0.3
        },
        {
          label: 'Humidity (%)',
          data: sorted.map(l => l.humidity),
          borderColor: '#3498db',
          backgroundColor: '#3498db33',
          yAxisID: 'y',
          tension: 0.3
        },
        {
          label: 'VPD (kPa)',
          data: sorted.map(l => l.vpd),
          borderColor: '#27ae60',
          backgroundColor: '#27ae6033',
          yAxisID: 'y1',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Environment Over Time' }
      },
      scales: {
        y: { beginAtZero: false, title: { display: true, text: 'Temp (\u00B0F) / Humidity (%)' }, position: 'left' },
        y1: { beginAtZero: true, title: { display: true, text: 'VPD (kPa)' }, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  });
}

export function destroy() {
  if (unsubEnvLogs) { unsubEnvLogs(); unsubEnvLogs = null; }
  if (envChart) {
    try { envChart.destroy(); } catch (e) { /* ignore */ }
    envChart = null;
  }
  grow = null;
  growId = null;
  envLogs = [];
  editingEnvLogId = null;
}
