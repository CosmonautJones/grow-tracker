// Dedicated guides view — cultivation technique reference
import store from '../store.js';
import * as fb from '../firebase.js';
import { updateNav } from '../components/header.js';
import { escapeHtml, isValidGrowId } from '../utils.js';
import { getAllGuides, CULTIVATION_GUIDES } from '../data/cultivation-guides.js';

let growId = null;
let grow = null;

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <section class="guides-section">
      <div class="section-header-row">
        <h2>Cultivation Guides</h2>
        <a href="#/grow/${escapeHtml(growId)}" class="view-all-link">&larr; Back to Grow</a>
      </div>
      <div id="guidesContent">
        <div class="loading-spinner-container"><div class="spinner"></div><span>Loading guides...</span></div>
      </div>
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

  // Load grow data to determine plant type
  const user = fb.getCurrentUser();
  if (user) {
    const growData = await fb.getGrow(user.uid, growId);
    grow = growData;
  } else {
    const grows = store.get('grows') || {};
    grow = grows[growId];
  }

  renderGuides();

  // Handle deep link via query param
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const guideId = urlParams.get('guide');
  if (guideId) {
    requestAnimationFrame(() => {
      const el = document.getElementById(`guide-${guideId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.querySelector('.guide-accordion-toggle')?.click();
      }
    });
  }
}

function renderGuides() {
  const container = document.getElementById('guidesContent');
  if (!container) return;

  const plantType = grow?.plantType || 'autoflower';
  const guides = getAllGuides(plantType);

  if (guides.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No guides available.</p></div>';
    return;
  }

  container.innerHTML = guides.map(guide => {
    const weekRange = guide.relevantWeeks[plantType];
    const weekInfo = weekRange ? `Best during weeks ${weekRange.start}-${weekRange.end}` : '';

    return `
      <div class="guide-card" id="guide-${escapeHtml(guide.id)}">
        <button class="guide-accordion-toggle" aria-expanded="false" aria-controls="guide-body-${escapeHtml(guide.id)}">
          <div class="guide-card-header">
            <span class="guide-icon">${guide.icon}</span>
            <div class="guide-header-text">
              <h3>${escapeHtml(guide.title)}</h3>
              <p class="guide-summary">${escapeHtml(guide.summary)}</p>
              ${weekInfo ? `<span class="guide-week-range">${escapeHtml(weekInfo)}</span>` : ''}
            </div>
            <span class="guide-chevron">&#x25BC;</span>
          </div>
        </button>
        <div class="guide-body hidden" id="guide-body-${escapeHtml(guide.id)}">
          ${guide.sections.map(section => renderSection(section)).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Accordion toggle handlers
  container.querySelectorAll('.guide-accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      const bodyId = btn.getAttribute('aria-controls');
      const body = document.getElementById(bodyId);
      if (body) body.classList.toggle('hidden', expanded);
    });
  });
}

function renderSection(section) {
  let contentHtml = '';

  switch (section.type) {
    case 'paragraphs':
      contentHtml = section.content.map(p => `<p>${escapeHtml(p)}</p>`).join('');
      break;
    case 'steps':
      contentHtml = `<ol class="guide-steps">${section.content.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`;
      break;
    case 'warnings':
      contentHtml = section.content.map(w => `
        <div class="guide-warning">
          <span class="guide-warning-icon">&#x26a0;&#xfe0f;</span>
          <span>${escapeHtml(w)}</span>
        </div>
      `).join('');
      break;
    case 'deficiency':
      contentHtml = section.content.map(line => `<p class="guide-deficiency-line">${escapeHtml(line)}</p>`).join('');
      break;
    case 'table':
      contentHtml = `<div class="guide-table-wrapper"><table class="guide-table">
        <thead><tr>${section.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
        <tbody>${section.rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;
      break;
    case 'ph-range':
      contentHtml = `<div class="ph-range-visual">
        ${section.ranges.map(r => `
          <div class="ph-range-row">
            <span class="ph-range-label">${escapeHtml(r.medium)}</span>
            <div class="ph-range-bar-track">
              <div class="ph-range-bar-fill" style="left:${((r.min - 4.5) / 3.5) * 100}%;width:${((r.max - r.min) / 3.5) * 100}%"></div>
            </div>
            <span class="ph-range-values">${r.min} — ${r.max}</span>
          </div>
        `).join('')}
        <div class="ph-range-axis">
          ${[4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map(v => `<span>${v}</span>`).join('')}
        </div>
      </div>`;
      break;
    default:
      contentHtml = section.content.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  }

  return `
    <div class="guide-section">
      <h4>${escapeHtml(section.title)}</h4>
      ${contentHtml}
    </div>
  `;
}

export function destroy() {
  grow = null;
  growId = null;
}
