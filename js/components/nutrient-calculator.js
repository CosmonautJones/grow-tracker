// Nutrient display + Chart.js charts
import { NUTRIENT_BRANDS, getWeekSchedule, calculateEstimatedPpm, getTotalWeeks, getMixingOrder } from '../data/nutrient-schedules.js';

export function renderCalculator(container, { week, gallons, medium, brand, plantType, photoperiodVegWeeks, waterBaselinePpm }) {
  brand = brand || 'gh-flora-trio';
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData) {
    container.innerHTML = '<p>Unknown nutrient brand.</p>';
    return;
  }

  const schedule = getWeekSchedule(brand, plantType, medium, week, photoperiodVegWeeks);
  if (!schedule) {
    container.innerHTML = '<p>No schedule data for this week.</p>';
    return;
  }

  const isFlush = !schedule.micro && !schedule.gro && !schedule.bloom;
  const ppmData = calculateEstimatedPpm(schedule, brand, waterBaselinePpm || 0);
  const mixOrder = getMixingOrder(brand);

  if (isFlush) {
    container.innerHTML = `
      <div class="nutrient-card">
        <h3>Flushing Period - Week ${week}</h3>
        <p style="font-size: 1.2em; color: var(--text-dark); margin-top: 10px;">
          <strong>Use plain pH-adjusted water only (no nutrients)</strong>
        </p>
        <p style="margin-top: 15px; color: var(--text-light);">
          Flush your plants with pure water to remove excess nutrients and improve final taste and smoothness.
          Target pH: 6.0-6.5 for all mediums.
        </p>
      </div>
    `;
    return;
  }

  let componentsHtml = '';
  for (const comp of mixOrder) {
    const mlPerGal = schedule[comp.key] || 0;
    const totalMl = (mlPerGal * gallons).toFixed(2);
    componentsHtml += `
      <div class="nutrient-item" style="border-top: 3px solid ${comp.color}">
        <h4>${comp.name}</h4>
        <div class="nutrient-amount">${totalMl} ml</div>
        <p>${mlPerGal} ml per gallon</p>
      </div>
    `;
  }

  const phTarget = medium === 'hydro'
    ? (week <= 4 ? '5.5-6.0 (5.8 optimal)' : '6.0-6.5 (6.2-6.3 optimal)')
    : '6.0-6.5';

  container.innerHTML = `
    <div class="nutrient-card">
      <h3>Nutrient Mix for ${gallons} Gallon(s) - Week ${week}</h3>
      <div class="nutrient-grid">${componentsHtml}</div>
      <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px;">
        <p><strong>Target PPM:</strong> ${schedule.ppm}
        ${waterBaselinePpm ? ` (${ppmData.totalPpm} with tap water)` : ''}
         | <strong>Target EC:</strong> ${schedule.ec}</p>
        <p style="margin-top: 8px;"><strong>pH Target:</strong> ${phTarget}</p>
        ${waterBaselinePpm ? `<p style="margin-top: 8px; color: var(--text-light);"><strong>Tap water baseline:</strong> ${waterBaselinePpm} PPM</p>` : ''}
      </div>
    </div>

    <div class="mixing-instructions">
      <h3>Mixing Order (Important!)</h3>
      <ol>
        <li>Start with water</li>
        ${mixOrder.map(c => `<li>Add <strong>${c.name}</strong> and stir</li>`).join('')}
        <li>Check pH and adjust to target range</li>
      </ol>
    </div>
  `;
}

// Render nutrient schedule chart (ml/gal per component across all weeks)
export function renderScheduleChart(canvasId, { brand, plantType, medium, photoperiodVegWeeks, currentWeek }) {
  brand = brand || 'gh-flora-trio';
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData || typeof Chart === 'undefined') return;

  const totalWeeks = getTotalWeeks(brand, plantType, medium, photoperiodVegWeeks);
  const weeks = [];
  const datasets = {};

  // Initialize datasets for each component
  for (const [key, comp] of Object.entries(brandData.components)) {
    datasets[key] = { label: comp.name, data: [], borderColor: comp.color, backgroundColor: comp.color + '33', fill: false, tension: 0.3 };
  }

  for (let w = 1; w <= totalWeeks; w++) {
    weeks.push(`W${w}`);
    const sched = getWeekSchedule(brand, plantType, medium, w, photoperiodVegWeeks);
    for (const key of Object.keys(datasets)) {
      datasets[key].data.push(sched ? sched[key] || 0 : 0);
    }
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks,
      datasets: Object.values(datasets)
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Nutrient Schedule (ml/gal)' },
        annotation: currentWeek ? {
          annotations: {
            currentLine: {
              type: 'line', xMin: currentWeek - 1, xMax: currentWeek - 1,
              borderColor: '#333', borderWidth: 2, borderDash: [5, 5],
              label: { display: true, content: 'Current', position: 'start' }
            }
          }
        } : undefined
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'ml/gal' } }
      }
    }
  });
}

// Render PPM/EC target chart
export function renderPpmChart(canvasId, { brand, plantType, medium, photoperiodVegWeeks, currentWeek, waterBaselinePpm }) {
  brand = brand || 'gh-flora-trio';
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData || typeof Chart === 'undefined') return;

  const totalWeeks = getTotalWeeks(brand, plantType, medium, photoperiodVegWeeks);
  const weeks = [];
  const ppmData = [];
  const ecData = [];

  for (let w = 1; w <= totalWeeks; w++) {
    weeks.push(`W${w}`);
    const sched = getWeekSchedule(brand, plantType, medium, w, photoperiodVegWeeks);
    ppmData.push(sched ? sched.ppm : 0);
    ecData.push(sched ? sched.ec : 0);
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeks,
      datasets: [
        {
          label: 'Target PPM',
          data: ppmData,
          backgroundColor: ppmData.map((_, i) => i === (currentWeek - 1) ? '#27ae60' : '#27ae6066'),
          yAxisID: 'y'
        },
        {
          label: 'Target EC',
          data: ecData,
          type: 'line',
          borderColor: '#e74c3c',
          backgroundColor: 'transparent',
          yAxisID: 'y1',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'PPM / EC Targets by Week' }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'PPM' }, position: 'left' },
        y1: { beginAtZero: true, title: { display: true, text: 'EC' }, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  });
}
