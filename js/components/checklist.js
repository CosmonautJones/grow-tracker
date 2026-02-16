// Weekly checklist rendering
import { getChecklistForWeek } from '../data/weekly-checklists.js';
import store from '../store.js';

let currentGrowId = null;
let currentWeek = null;

export function renderChecklist(container, { growId, week, plantType, photoperiodVegWeeks }) {
  currentGrowId = growId;
  currentWeek = week;

  const checklist = getChecklistForWeek(week, plantType, photoperiodVegWeeks);
  if (!checklist) {
    container.innerHTML = '<p>No checklist available for this week.</p>';
    return;
  }

  const savedChecklist = store.get(`grow_${growId}_checklist_${week}`) || {};

  let html = '';

  // Daily tasks
  html += '<div class="checklist-category">';
  html += '<h3 class="checklist-heading">Daily Tasks</h3>';
  html += '<div class="checklist-items">';
  checklist.daily.forEach((task, index) => {
    const id = `daily_${index}`;
    const checked = savedChecklist[id] ? 'checked' : '';
    const completedClass = savedChecklist[id] ? 'completed' : '';
    html += `
      <div class="checklist-item ${completedClass}">
        <input type="checkbox" id="cl_${id}" data-task-id="${id}" ${checked}>
        <label for="cl_${id}">${task}</label>
      </div>
    `;
  });
  html += '</div></div>';

  // Weekly tasks
  html += '<div class="checklist-category">';
  html += '<h3 class="checklist-heading">Weekly Tasks</h3>';
  html += '<div class="checklist-items">';
  checklist.weekly.forEach((task, index) => {
    const id = `weekly_${index}`;
    const checked = savedChecklist[id] ? 'checked' : '';
    const completedClass = savedChecklist[id] ? 'completed' : '';
    html += `
      <div class="checklist-item ${completedClass}">
        <input type="checkbox" id="cl_${id}" data-task-id="${id}" ${checked}>
        <label for="cl_${id}">${task}</label>
      </div>
    `;
  });
  html += '</div></div>';

  container.innerHTML = html;

  // Attach event listeners
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', handleCheckboxChange);
  });
}

function handleCheckboxChange(e) {
  const checkbox = e.target;
  const taskId = checkbox.dataset.taskId;
  const item = checkbox.closest('.checklist-item');

  let saved = store.get(`grow_${currentGrowId}_checklist_${currentWeek}`) || {};
  saved[taskId] = checkbox.checked;
  store.set(`grow_${currentGrowId}_checklist_${currentWeek}`, saved);

  if (checkbox.checked) {
    item.classList.add('completed');
  } else {
    item.classList.remove('completed');
  }
}

export function getCompletionStats(growId, week) {
  const saved = store.get(`grow_${growId}_checklist_${week}`) || {};
  const total = Object.keys(saved).length;
  const completed = Object.values(saved).filter(Boolean).length;
  return { total, completed };
}
