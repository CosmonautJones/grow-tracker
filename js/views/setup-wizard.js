// Multi-step new grow creation form
import store from '../store.js';
import * as fb from '../firebase.js';
import router from '../router.js';
import { NUTRIENT_BRANDS, getTotalWeeks } from '../data/nutrient-schedules.js';

let currentStep = 1;
const TOTAL_STEPS = 6;
let formData = {
  plantType: 'autoflower',
  strainName: '',
  breeder: '',
  growMedium: 'hydro',
  containerSize: '',
  lightSetup: '',
  lightWattage: '',
  lightSchedule: '18/6',
  nutrientBrand: 'gh-flora-trio',
  gallons: 1,
  startDate: new Date().toISOString().split('T')[0],
  autoUpdateWeek: true,
  initialNote: '',
  photoperiodVegWeeks: 4
};

export function render(container) {
  container.innerHTML = `
    <section class="wizard-section">
      <h2>Start New Grow</h2>
      <div class="wizard-progress">
        <div class="wizard-progress-bar">
          <div class="wizard-progress-fill" id="wizardProgressFill"></div>
        </div>
        <span id="wizardStepText">Step 1 of ${TOTAL_STEPS}</span>
      </div>
      <div id="wizardContent" class="wizard-content"></div>
      <div class="wizard-actions">
        <button id="wizardBack" class="secondary-btn" style="visibility: hidden;">Back</button>
        <button id="wizardNext" class="primary-btn">Next</button>
      </div>
    </section>
  `;
}

export function init() {
  currentStep = 1;
  formData = {
    plantType: 'autoflower',
    strainName: '',
    breeder: '',
    growMedium: 'hydro',
    containerSize: '',
    lightSetup: '',
    lightWattage: '',
    lightSchedule: '18/6',
    nutrientBrand: 'gh-flora-trio',
    gallons: 1,
    startDate: new Date().toISOString().split('T')[0],
    autoUpdateWeek: true,
    initialNote: '',
    photoperiodVegWeeks: 4
  };

  document.getElementById('wizardBack').addEventListener('click', goBack);
  document.getElementById('wizardNext').addEventListener('click', goNext);

  renderStep();
}

function renderStep() {
  const content = document.getElementById('wizardContent');
  const backBtn = document.getElementById('wizardBack');
  const nextBtn = document.getElementById('wizardNext');
  const progressFill = document.getElementById('wizardProgressFill');
  const stepText = document.getElementById('wizardStepText');

  progressFill.style.width = (currentStep / TOTAL_STEPS * 100) + '%';
  stepText.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
  backBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
  nextBtn.textContent = currentStep === TOTAL_STEPS ? 'Start Growing!' : 'Next';

  switch (currentStep) {
    case 1: renderPlantType(content); break;
    case 2: renderStrainInfo(content); break;
    case 3: renderGrowSetup(content); break;
    case 4: renderNutrients(content); break;
    case 5: renderTimeline(content); break;
    case 6: renderReview(content); break;
  }
}

function renderPlantType(el) {
  el.innerHTML = `
    <h3>What type of plant?</h3>
    <div class="wizard-radio-group">
      <label class="wizard-radio-card ${formData.plantType === 'autoflower' ? 'selected' : ''}">
        <input type="radio" name="plantType" value="autoflower" ${formData.plantType === 'autoflower' ? 'checked' : ''}>
        <span class="radio-icon">&#x1f331;</span>
        <span class="radio-label">Autoflower</span>
        <span class="radio-desc">Fixed ~10 week lifecycle, 18/6 or 20/4 light all grow</span>
      </label>
      <label class="wizard-radio-card ${formData.plantType === 'photoperiod' ? 'selected' : ''}">
        <input type="radio" name="plantType" value="photoperiod" ${formData.plantType === 'photoperiod' ? 'checked' : ''}>
        <span class="radio-icon">&#x1f33b;</span>
        <span class="radio-label">Photoperiod</span>
        <span class="radio-desc">Flexible veg length + ~8 week flower, 18/6 veg then 12/12 flower</span>
      </label>
    </div>
    ${formData.plantType === 'photoperiod' ? `
      <div class="input-group" style="margin-top: 20px;">
        <label for="vegWeeks">Planned Veg Weeks (2-16):</label>
        <input type="number" id="vegWeeks" value="${formData.photoperiodVegWeeks}" min="2" max="16" step="1">
      </div>
    ` : ''}
  `;

  el.querySelectorAll('input[name="plantType"]').forEach(r => {
    r.addEventListener('change', (e) => {
      formData.plantType = e.target.value;
      if (formData.plantType === 'autoflower') {
        formData.lightSchedule = '18/6';
      }
      renderStep();
    });
  });

  const vegInput = el.querySelector('#vegWeeks');
  if (vegInput) {
    vegInput.addEventListener('change', (e) => {
      formData.photoperiodVegWeeks = parseInt(e.target.value) || 4;
    });
  }
}

function renderStrainInfo(el) {
  el.innerHTML = `
    <h3>Strain Information</h3>
    <div class="input-group">
      <label for="strainName">Strain Name *</label>
      <input type="text" id="strainName" value="${formData.strainName}" placeholder="e.g., Northern Lights Auto" required>
      <span id="strainNameError" class="field-error" style="display:none;color:#e74c3c;font-size:0.85em;">Strain name is required.</span>
    </div>
    <div class="input-group" style="margin-top: 15px;">
      <label for="breeder">Breeder (optional)</label>
      <input type="text" id="breeder" value="${formData.breeder}" placeholder="e.g., Royal Queen Seeds">
    </div>
  `;

  el.querySelector('#strainName').addEventListener('input', e => { formData.strainName = e.target.value; });
  el.querySelector('#breeder').addEventListener('input', e => { formData.breeder = e.target.value; });
}

function renderGrowSetup(el) {
  el.innerHTML = `
    <h3>Growing Setup</h3>
    <div class="wizard-form-grid">
      <div class="input-group">
        <label for="growMedium">Growing Medium</label>
        <select id="growMedium">
          <option value="hydro" ${formData.growMedium === 'hydro' ? 'selected' : ''}>Hydroponic (DWC/Recirculating)</option>
          <option value="soil" ${formData.growMedium === 'soil' ? 'selected' : ''}>Soil</option>
          <option value="coco" ${formData.growMedium === 'coco' ? 'selected' : ''}>Coco Coir</option>
        </select>
      </div>
      <div class="input-group">
        <label for="containerSize">Container Size (optional)</label>
        <input type="text" id="containerSize" value="${formData.containerSize}" placeholder="e.g., 5 gallon, 3 gallon">
      </div>
      <div class="input-group">
        <label for="lightSetup">Light Type (optional)</label>
        <input type="text" id="lightSetup" value="${formData.lightSetup}" placeholder="e.g., LED, HPS, CMH">
      </div>
      <div class="input-group">
        <label for="lightWattage">Light Wattage (optional)</label>
        <input type="text" id="lightWattage" value="${formData.lightWattage}" placeholder="e.g., 240W">
      </div>
      <div class="input-group">
        <label for="lightSchedule">Light Schedule</label>
        <select id="lightSchedule">
          <option value="18/6" ${formData.lightSchedule === '18/6' ? 'selected' : ''}>18/6</option>
          <option value="20/4" ${formData.lightSchedule === '20/4' ? 'selected' : ''}>20/4</option>
          <option value="12/12" ${formData.lightSchedule === '12/12' ? 'selected' : ''}>12/12</option>
          <option value="24/0" ${formData.lightSchedule === '24/0' ? 'selected' : ''}>24/0</option>
        </select>
      </div>
    </div>
  `;

  el.querySelector('#growMedium').addEventListener('change', e => { formData.growMedium = e.target.value; });
  el.querySelector('#containerSize').addEventListener('input', e => { formData.containerSize = e.target.value; });
  el.querySelector('#lightSetup').addEventListener('input', e => { formData.lightSetup = e.target.value; });
  el.querySelector('#lightWattage').addEventListener('input', e => { formData.lightWattage = e.target.value; });
  el.querySelector('#lightSchedule').addEventListener('change', e => { formData.lightSchedule = e.target.value; });
}

function renderNutrients(el) {
  const brandOptions = Object.entries(NUTRIENT_BRANDS).map(([key, b]) =>
    `<option value="${key}" ${formData.nutrientBrand === key ? 'selected' : ''}>${b.name}</option>`
  ).join('');

  el.innerHTML = `
    <h3>Nutrient Configuration</h3>
    <div class="wizard-form-grid">
      <div class="input-group">
        <label for="nutrientBrand">Nutrient Brand</label>
        <select id="nutrientBrand">${brandOptions}</select>
      </div>
      <div class="input-group">
        <label for="defaultGallons">Default Water Volume (gallons)</label>
        <input type="number" id="defaultGallons" value="${formData.gallons}" min="0.25" step="0.25">
      </div>
    </div>
  `;

  el.querySelector('#nutrientBrand').addEventListener('change', e => { formData.nutrientBrand = e.target.value; });
  el.querySelector('#defaultGallons').addEventListener('input', e => { formData.gallons = parseFloat(e.target.value) || 1; });
}

function renderTimeline(el) {
  el.innerHTML = `
    <h3>Timeline</h3>
    <div class="wizard-form-grid">
      <div class="input-group">
        <label for="startDate">Start Date</label>
        <input type="date" id="startDate" value="${formData.startDate}">
      </div>
      <div class="auto-update-toggle" style="margin-top: 15px;">
        <input type="checkbox" id="autoUpdate" ${formData.autoUpdateWeek ? 'checked' : ''}>
        <label for="autoUpdate">Auto-update week based on start date</label>
      </div>
    </div>
    <div class="input-group" style="margin-top: 20px;">
      <label for="initialNote">Initial Observation Note (optional)</label>
      <textarea id="initialNote" rows="3" placeholder="Any initial notes about your grow...">${formData.initialNote}</textarea>
    </div>
  `;

  el.querySelector('#startDate').addEventListener('change', e => { formData.startDate = e.target.value; });
  el.querySelector('#autoUpdate').addEventListener('change', e => { formData.autoUpdateWeek = e.target.checked; });
  el.querySelector('#initialNote').addEventListener('input', e => { formData.initialNote = e.target.value; });
}

function renderReview(el) {
  const totalWeeks = getTotalWeeks(formData.nutrientBrand, formData.plantType,
    formData.growMedium === 'coco' ? 'soil' : formData.growMedium, formData.photoperiodVegWeeks);
  const brandName = NUTRIENT_BRANDS[formData.nutrientBrand]?.name || formData.nutrientBrand;

  el.innerHTML = `
    <h3>Review Your Grow</h3>
    <div class="review-card">
      <div class="review-row"><strong>Plant Type:</strong> ${formData.plantType === 'autoflower' ? 'Autoflower' : 'Photoperiod'}</div>
      <div class="review-row"><strong>Strain:</strong> ${formData.strainName || 'Not specified'} ${formData.breeder ? `(${formData.breeder})` : ''}</div>
      <div class="review-row"><strong>Medium:</strong> ${formData.growMedium}</div>
      ${formData.containerSize ? `<div class="review-row"><strong>Container:</strong> ${formData.containerSize}</div>` : ''}
      ${formData.lightSetup ? `<div class="review-row"><strong>Light:</strong> ${formData.lightSetup} ${formData.lightWattage}</div>` : ''}
      <div class="review-row"><strong>Light Schedule:</strong> ${formData.lightSchedule}</div>
      <div class="review-row"><strong>Nutrients:</strong> ${brandName}</div>
      <div class="review-row"><strong>Water Volume:</strong> ${formData.gallons} gallon(s)</div>
      <div class="review-row"><strong>Start Date:</strong> ${formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}</div>
      <div class="review-row"><strong>Total Weeks:</strong> ${totalWeeks}</div>
      <div class="review-row"><strong>Auto-update Week:</strong> ${formData.autoUpdateWeek ? 'Yes' : 'No'}</div>
      ${formData.plantType === 'photoperiod' ? `<div class="review-row"><strong>Veg Weeks:</strong> ${formData.photoperiodVegWeeks}</div>` : ''}
      ${formData.initialNote ? `<div class="review-row"><strong>Initial Note:</strong> ${formData.initialNote}</div>` : ''}
    </div>
  `;
}

function collectStepData() {
  // Collect any current form values before navigating
  const strainInput = document.querySelector('#strainName');
  if (strainInput) formData.strainName = strainInput.value;

  const breederInput = document.querySelector('#breeder');
  if (breederInput) formData.breeder = breederInput.value;

  const vegInput = document.querySelector('#vegWeeks');
  if (vegInput) formData.photoperiodVegWeeks = parseInt(vegInput.value) || 4;
}

function goBack() {
  if (currentStep > 1) {
    collectStepData();
    currentStep--;
    renderStep();
  }
}

async function goNext() {
  collectStepData();

  // Validation
  if (currentStep === 2 && !formData.strainName.trim()) {
    const errorEl = document.getElementById('strainNameError');
    if (errorEl) errorEl.style.display = 'block';
    return;
  }

  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    renderStep();
    return;
  }

  // Final step — create the grow
  await createGrow();
}

async function createGrow() {
  const nextBtn = document.getElementById('wizardNext');
  nextBtn.disabled = true;
  nextBtn.textContent = 'Creating...';

  const mediumForSchedule = formData.growMedium === 'coco' ? 'soil' : formData.growMedium;
  const totalWeeks = getTotalWeeks(formData.nutrientBrand, formData.plantType, mediumForSchedule, formData.photoperiodVegWeeks);

  const growData = {
    status: 'active',
    plantType: formData.plantType,
    strainName: formData.strainName.trim(),
    breeder: formData.breeder.trim(),
    startDate: formData.startDate,
    endDate: '',
    growMedium: formData.growMedium,
    nutrientBrand: formData.nutrientBrand,
    containerSize: formData.containerSize,
    lightSetup: formData.lightSetup,
    lightWattage: formData.lightWattage,
    lightSchedule: formData.lightSchedule,
    currentWeek: 1,
    totalWeeks: totalWeeks,
    gallons: formData.gallons,
    autoUpdateWeek: formData.autoUpdateWeek,
    photoperiodVegWeeks: formData.plantType === 'photoperiod' ? formData.photoperiodVegWeeks : 0
  };

  let growId;
  const user = fb.getCurrentUser();

  if (user) {
    try {
      // Save to Firestore
      growId = await fb.createGrow(user.uid, growData);

      // Create initial note if provided
      if (formData.initialNote.trim()) {
        await fb.createNote(user.uid, growId, {
          category: 'general',
          title: 'Initial Observation',
          content: formData.initialNote.trim(),
          week: 1,
          tags: []
        });
      }

      // Set as active grow
      await fb.setUserDoc(user.uid, { activeGrowId: growId });
    } catch (err) {
      console.error('Firestore write failed, falling back to local storage:', err);
      // Fall back to local storage
      growId = null;
    }
  }

  if (!growId) {
    // Save locally (either not signed in, or Firestore failed)
    growId = 'local_' + Date.now();
    growData.id = growId;
    growData.createdAt = new Date().toISOString();

    const grows = store.get('grows') || {};
    grows[growId] = growData;
    store.set('grows', grows);

    if (formData.initialNote.trim()) {
      const noteId = 'note_' + Date.now();
      store.set(`grow_${growId}_notes`, [{
        id: noteId,
        category: 'general',
        title: 'Initial Observation',
        content: formData.initialNote.trim(),
        week: 1,
        tags: [],
        createdAt: new Date().toISOString()
      }]);
    }
  }

  store.set('activeGrowId', growId);
  router.navigate(`/grow/${growId}`);
}

export function destroy() {
  currentStep = 1;
}
