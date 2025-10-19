// Nutrient schedules based on research
const nutrientSchedule = {
    hydro: {
        1: { micro: 5, gro: 5, bloom: 5, ppm: 400, ec: 0.8, stage: 'Germination & Early Seedling' },
        2: { micro: 5, gro: 5, bloom: 5, ppm: 500, ec: 1.0, stage: 'Late Seedling' },
        3: { micro: 5, gro: 10, bloom: 5, ppm: 600, ec: 1.2, stage: 'Early Vegetative' },
        4: { micro: 7.5, gro: 10, bloom: 5, ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
        5: { micro: 7.5, gro: 5, bloom: 10, ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
        6: { micro: 7.5, gro: 2.5, bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Early Flowering' },
        7: { micro: 5, gro: 0, bloom: 15, ppm: 800, ec: 1.6, stage: 'Mid Flowering' },
        8: { micro: 5, gro: 0, bloom: 15, ppm: 700, ec: 1.4, stage: 'Peak Flowering' },
        9: { micro: 0, gro: 0, bloom: 0, ppm: 0, ec: 0, stage: 'Late Flowering / Flush' },
        10: { micro: 0, gro: 0, bloom: 0, ppm: 0, ec: 0, stage: 'Harvest Preparation' }
    },
    soil: {
        1: { micro: 2, gro: 1, bloom: 1, ppm: 400, ec: 0.8, stage: 'Germination & Early Seedling' },
        2: { micro: 2, gro: 1, bloom: 1, ppm: 500, ec: 1.0, stage: 'Late Seedling' },
        3: { micro: 5, gro: 5, bloom: 2.5, ppm: 600, ec: 1.2, stage: 'Early Vegetative' },
        4: { micro: 5, gro: 5, bloom: 2.5, ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
        5: { micro: 5, gro: 2.5, bloom: 7.5, ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
        6: { micro: 5, gro: 1, bloom: 10, ppm: 800, ec: 1.6, stage: 'Early Flowering' },
        7: { micro: 3.5, gro: 0, bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flowering' },
        8: { micro: 3.5, gro: 0, bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Peak Flowering' },
        9: { micro: 0, gro: 0, bloom: 0, ppm: 0, ec: 0, stage: 'Late Flowering / Flush' },
        10: { micro: 0, gro: 0, bloom: 0, ppm: 0, ec: 0, stage: 'Harvest Preparation' }
    }
};

// Weekly checklist templates
const weeklyChecklists = {
    1: {
        daily: [
            'Check soil moisture - keep moist but not waterlogged',
            'Monitor temperature (70-80°F / 21-27°C)',
            'Ensure proper humidity (60-70%)',
            'Check for seed germination progress'
        ],
        weekly: [
            'Verify light schedule is consistent (18/6 or 20/4)',
            'Prepare first nutrient solution at 1/4 strength',
            'Take photos to track growth',
            'Record germination date and progress'
        ]
    },
    2: {
        daily: [
            'Water when top inch of soil is dry',
            'Check for first true leaves development',
            'Monitor for damping off or fungal issues',
            'Maintain proper temperature and humidity'
        ],
        weekly: [
            'Begin light feeding at seedling strength',
            'Check pH of water/nutrient solution (6.0-6.5)',
            'Monitor for nutrient deficiencies',
            'Take weekly progress photos',
            'Record plant height and leaf count'
        ]
    },
    3: {
        daily: [
            'Check soil moisture and water as needed',
            'Monitor plant growth rate',
            'Look for signs of nutrient deficiency/excess',
            'Check for pests (underside of leaves)'
        ],
        weekly: [
            'Feed with vegetative nutrient ratio',
            'Check and adjust pH (5.8 hydro / 6.0-6.5 soil)',
            'Measure PPM/EC of nutrient solution and runoff',
            'Begin light LST if desired',
            'Take weekly photos',
            'Clean grow space and equipment'
        ]
    },
    4: {
        daily: [
            'Water/feed as needed - plants drinking more now',
            'Monitor for pre-flowers',
            'Check canopy development',
            'Continue pest inspection'
        ],
        weekly: [
            'Continue vegetative feeding',
            'Check pH and PPM/EC levels',
            'Adjust LST if being used',
            'Defoliate if necessary (light)',
            'Monitor for start of flowering',
            'Take weekly photos and measurements'
        ]
    },
    5: {
        daily: [
            'Water/feed regularly - increased consumption',
            'Watch for flower site development',
            'Monitor stretch phase',
            'Check humidity levels (begin lowering to 50%)'
        ],
        weekly: [
            'Transition to early flowering nutrients',
            'Check pH (6.2-6.3 optimal for flower)',
            'Measure PPM/EC (700-800 target)',
            'Final LST adjustments',
            'Increase air circulation',
            'Take weekly photos - document flower sites'
        ]
    },
    6: {
        daily: [
            'Feed/water regularly - high consumption period',
            'Monitor bud development',
            'Check for signs of stress',
            'Maintain lower humidity (40-50%)'
        ],
        weekly: [
            'Feed with early flowering nutrients',
            'Check pH and PPM/EC of solution and runoff',
            'Inspect for mold/mildew in developing buds',
            'Light defoliation if needed for airflow',
            'Monitor trichome development',
            'Take detailed bud photos'
        ]
    },
    7: {
        daily: [
            'Heavy feeding period - monitor nutrient uptake',
            'Check buds for density and size',
            'Inspect for bud rot or mold',
            'Maintain optimal environment'
        ],
        weekly: [
            'Feed with peak flowering nutrients',
            'Check pH and PPM/EC carefully',
            'Monitor trichome development with jeweler\'s loupe',
            'Remove any dying/yellowing leaves',
            'Check support for heavy buds',
            'Take detailed photos of trichomes and buds'
        ]
    },
    8: {
        daily: [
            'Continue feeding schedule',
            'Inspect trichomes daily for ripeness',
            'Check for amber trichomes (10-30%)',
            'Monitor for nanners or hermaphroditism',
            'Maintain stable environment'
        ],
        weekly: [
            'Feed with peak flowering nutrients',
            'Begin reducing nitrogen if showing excess',
            'Check trichome color ratio',
            'Plan for flush timing',
            'Take macro photos of trichomes',
            'Prepare drying space'
        ]
    },
    9: {
        daily: [
            'Flush with plain pH\'d water only',
            'Monitor trichome ripeness (daily checks)',
            'Watch for majority milky/some amber trichomes',
            'Check pistil color (70-90% brown)',
            'Ensure proper environment for final swell'
        ],
        weekly: [
            'Continue flushing - no nutrients',
            'Check pH of flush water (6.0-6.5)',
            'Inspect trichomes multiple times',
            'Look for fading fan leaves (good sign)',
            'Finalize drying and curing setup',
            'Document harvest indicators'
        ]
    },
    10: {
        daily: [
            'Final flush continues if needed',
            'Monitor trichome/pistil readiness',
            'Prepare harvest tools (scissors, gloves, etc.)',
            'Check drying space (60°F/60% RH ideal)'
        ],
        weekly: [
            'Make final harvest decision',
            'Stop watering 1-2 days before harvest',
            'Prepare trimming station',
            'Set up drying racks/lines',
            'Plan wet or dry trim method',
            'Review curing jar preparation'
        ]
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    checkAutoUpdate();
    updateNutrientSchedule();
    updateStageInfo();
    updateChecklist();
    updateTimelineInfo();

    // Event listeners
    document.getElementById('currentWeek').addEventListener('change', function() {
        updateNutrientSchedule();
        updateStageInfo();
        updateChecklist();
        saveCurrentWeek();
    });

    document.getElementById('gallons').addEventListener('input', updateNutrientSchedule);
    document.getElementById('growMedium').addEventListener('change', function() {
        updateNutrientSchedule();
        saveMedium();
    });

    document.getElementById('saveNotes').addEventListener('click', saveNotes);
    document.getElementById('setStartDate').addEventListener('click', setStartDate);
    document.getElementById('resetGrow').addEventListener('click', resetGrow);
    document.getElementById('toggleAutoUpdate').addEventListener('change', toggleAutoUpdate);

    // Load notes from localStorage
    const savedNotes = localStorage.getItem('growNotes');
    if (savedNotes) {
        document.getElementById('growNotes').value = savedNotes;
    }

    // Update timeline info daily
    setInterval(checkAutoUpdate, 60000); // Check every minute
});

// Update nutrient schedule display
function updateNutrientSchedule() {
    const week = parseInt(document.getElementById('currentWeek').value);
    const gallons = parseFloat(document.getElementById('gallons').value);
    const medium = document.getElementById('growMedium').value;

    const schedule = nutrientSchedule[medium][week];
    const scheduleDiv = document.getElementById('nutrientSchedule');

    if (week >= 9) {
        scheduleDiv.innerHTML = `
            <div class="nutrient-card">
                <h3>🚿 Flushing Period - Week ${week}</h3>
                <p style="font-size: 1.2em; color: var(--text-dark); margin-top: 10px;">
                    <strong>Use plain pH-adjusted water only (no nutrients)</strong>
                </p>
                <p style="margin-top: 15px; color: var(--text-light);">
                    Flush your plants with pure water to remove excess nutrients and improve final taste and smoothness.
                    Target pH: 6.0-6.5 for all mediums.
                </p>
            </div>
        `;
    } else {
        scheduleDiv.innerHTML = `
            <div class="nutrient-card">
                <h3>📊 Nutrient Mix for ${gallons} Gallon(s) - Week ${week}</h3>
                <div class="nutrient-grid">
                    <div class="nutrient-item">
                        <h4>FloraMicro</h4>
                        <div class="nutrient-amount">${(schedule.micro * gallons).toFixed(2)} ml</div>
                        <p>${schedule.micro} ml per gallon</p>
                    </div>
                    <div class="nutrient-item">
                        <h4>FloraGro</h4>
                        <div class="nutrient-amount">${(schedule.gro * gallons).toFixed(2)} ml</div>
                        <p>${schedule.gro} ml per gallon</p>
                    </div>
                    <div class="nutrient-item">
                        <h4>FloraBloom</h4>
                        <div class="nutrient-amount">${(schedule.bloom * gallons).toFixed(2)} ml</div>
                        <p>${schedule.bloom} ml per gallon</p>
                    </div>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px;">
                    <p><strong>Target PPM:</strong> ${schedule.ppm} | <strong>Target EC:</strong> ${schedule.ec}</p>
                    <p style="margin-top: 8px;"><strong>pH Target:</strong> ${medium === 'hydro' ? '5.8 (Veg) / 6.2-6.3 (Flower)' : '6.0-6.5'}</p>
                </div>
            </div>
        `;
    }
}

// Update stage information
function updateStageInfo() {
    const week = parseInt(document.getElementById('currentWeek').value);
    const medium = document.getElementById('growMedium').value;
    const schedule = nutrientSchedule[medium][week];

    const stageInfoDiv = document.getElementById('stageInfo');
    const progressFill = document.getElementById('progressFill');

    const progress = (week / 10) * 100;
    progressFill.style.width = progress + '%';

    let stageDescription = '';

    switch(week) {
        case 1:
            stageDescription = 'Germination phase. Keep seeds moist and warm (75-80°F). Once sprouted, provide gentle light. Cotyledons will appear first.';
            break;
        case 2:
            stageDescription = 'Seedling stage. First true leaves developing. Keep humidity high (60-70%). Begin very light feeding. Handle seedlings gently.';
            break;
        case 3:
        case 4:
            stageDescription = 'Vegetative growth. Rapid leaf and stem development. Increase feeding gradually. Good time for LST. Watch for pre-flowers.';
            break;
        case 5:
            stageDescription = 'Pre-flowering transition. Stretch phase begins. First flower sites appearing. Transition to bloom nutrients. Lower humidity to 50%.';
            break;
        case 6:
            stageDescription = 'Early flowering. Buds forming at nodes. Increase P and K. Monitor humidity (40-50%). Ensure good airflow. Defoliate lightly if needed.';
            break;
        case 7:
            stageDescription = 'Mid flowering. Rapid bud development and swelling. Heavy feeding period. Monitor trichomes starting now. Check for pests/mold regularly.';
            break;
        case 8:
            stageDescription = 'Peak flowering. Maximum bud density. Check trichomes daily. Look for milky trichomes with some amber. Prepare for flush timing.';
            break;
        case 9:
            stageDescription = 'Late flowering / Flush. Plain water only! Trichomes should be mostly milky with 10-30% amber. Pistils 70-90% brown. Leaves may yellow (normal).';
            break;
        case 10:
            stageDescription = 'Harvest preparation. Final checks of trichomes and pistils. Stop watering 1-2 days before harvest. Prepare drying space (60°F/60% RH). Clean trimming tools.';
            break;
    }

    stageInfoDiv.innerHTML = `
        <h3>${schedule.stage}</h3>
        <p style="font-size: 1.1em; margin-bottom: 10px;">${stageDescription}</p>
        <p><strong>Week ${week} of 10</strong> | <strong>Progress:</strong> ${progress.toFixed(0)}%</p>
    `;
}

// Update weekly checklist
function updateChecklist() {
    const week = parseInt(document.getElementById('currentWeek').value);
    const checklist = weeklyChecklists[week];
    const checklistDiv = document.getElementById('weeklyChecklist');

    const savedChecklist = JSON.parse(localStorage.getItem(`checklist_week_${week}`)) || {};

    let html = '';

    // Daily tasks
    html += '<div class="checklist-category">';
    html += '<h3>📅 Daily Tasks</h3>';
    html += '<div class="checklist-items">';
    checklist.daily.forEach((task, index) => {
        const id = `daily_${index}`;
        const checked = savedChecklist[id] ? 'checked' : '';
        const completedClass = savedChecklist[id] ? 'completed' : '';
        html += `
            <div class="checklist-item ${completedClass}">
                <input type="checkbox" id="${id}" ${checked} onchange="saveChecklistItem('${id}', ${week})">
                <label for="${id}">${task}</label>
            </div>
        `;
    });
    html += '</div></div>';

    // Weekly tasks
    html += '<div class="checklist-category">';
    html += '<h3>📋 Weekly Tasks</h3>';
    html += '<div class="checklist-items">';
    checklist.weekly.forEach((task, index) => {
        const id = `weekly_${index}`;
        const checked = savedChecklist[id] ? 'checked' : '';
        const completedClass = savedChecklist[id] ? 'completed' : '';
        html += `
            <div class="checklist-item ${completedClass}">
                <input type="checkbox" id="${id}" ${checked} onchange="saveChecklistItem('${id}', ${week})">
                <label for="${id}">${task}</label>
            </div>
        `;
    });
    html += '</div></div>';

    checklistDiv.innerHTML = html;
}

// Save checklist item state
function saveChecklistItem(id, week) {
    const checkbox = document.getElementById(id);
    const item = checkbox.closest('.checklist-item');

    let savedChecklist = JSON.parse(localStorage.getItem(`checklist_week_${week}`)) || {};
    savedChecklist[id] = checkbox.checked;
    localStorage.setItem(`checklist_week_${week}`, JSON.stringify(savedChecklist));

    if (checkbox.checked) {
        item.classList.add('completed');
    } else {
        item.classList.remove('completed');
    }
}

// Save notes
function saveNotes() {
    const notes = document.getElementById('growNotes').value;
    localStorage.setItem('growNotes', notes);

    // Visual feedback
    const button = document.getElementById('saveNotes');
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.style.background = 'var(--success-color)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Save current week
function saveCurrentWeek() {
    const week = document.getElementById('currentWeek').value;
    localStorage.setItem('currentWeek', week);
}

// Save medium selection
function saveMedium() {
    const medium = document.getElementById('growMedium').value;
    localStorage.setItem('growMedium', medium);
}

// Load saved data
function loadSavedData() {
    const savedWeek = localStorage.getItem('currentWeek');
    if (savedWeek) {
        document.getElementById('currentWeek').value = savedWeek;
    }

    const savedMedium = localStorage.getItem('growMedium');
    if (savedMedium) {
        document.getElementById('growMedium').value = savedMedium;
    }

    // Load start date if exists
    const startDate = localStorage.getItem('growStartDate');
    if (startDate) {
        document.getElementById('startDateInput').value = startDate;
    }

    // Load auto-update preference
    const autoUpdate = localStorage.getItem('autoUpdateWeek');
    if (autoUpdate !== null) {
        document.getElementById('toggleAutoUpdate').checked = autoUpdate === 'true';
    }
}

// Timeline tracking functions
function setStartDate() {
    const dateInput = document.getElementById('startDateInput').value;
    if (!dateInput) {
        alert('Please select a start date');
        return;
    }

    localStorage.setItem('growStartDate', dateInput);
    localStorage.setItem('autoUpdateWeek', 'true');
    document.getElementById('toggleAutoUpdate').checked = true;

    updateTimelineInfo();
    checkAutoUpdate();

    // Visual feedback
    const button = document.getElementById('setStartDate');
    const originalText = button.textContent;
    button.textContent = '✓ Start Date Set!';
    button.style.background = 'var(--success-color)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function resetGrow() {
    if (confirm('Are you sure you want to reset your grow? This will clear the start date and timeline tracking.')) {
        localStorage.removeItem('growStartDate');
        document.getElementById('startDateInput').value = '';
        updateTimelineInfo();
    }
}

function toggleAutoUpdate() {
    const autoUpdate = document.getElementById('toggleAutoUpdate').checked;
    localStorage.setItem('autoUpdateWeek', autoUpdate.toString());

    if (autoUpdate) {
        checkAutoUpdate();
    }
}

function checkAutoUpdate() {
    const autoUpdate = localStorage.getItem('autoUpdateWeek') === 'true';
    const startDate = localStorage.getItem('growStartDate');

    if (!autoUpdate || !startDate) {
        return;
    }

    const start = new Date(startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const calculatedWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 10);

    const currentWeek = parseInt(document.getElementById('currentWeek').value);

    if (calculatedWeek !== currentWeek) {
        document.getElementById('currentWeek').value = calculatedWeek;
        saveCurrentWeek();
        updateNutrientSchedule();
        updateStageInfo();
        updateChecklist();
    }

    updateTimelineInfo();
}

function updateTimelineInfo() {
    const startDate = localStorage.getItem('growStartDate');
    const timelineDiv = document.getElementById('timelineInfo');

    if (!startDate) {
        timelineDiv.innerHTML = `
            <div style="padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid var(--warning-color);">
                <p><strong>⏰ Timeline Tracking Not Set</strong></p>
                <p style="margin-top: 8px; color: var(--text-light);">Set your grow start date below to enable automatic week tracking and see your expected harvest date.</p>
            </div>
        `;
        return;
    }

    const start = new Date(startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 10);
    const dayInCurrentWeek = daysSinceStart % 7 + 1;
    const expectedHarvest = new Date(start);
    expectedHarvest.setDate(expectedHarvest.getDate() + 70); // Average 10 weeks

    const autoUpdate = localStorage.getItem('autoUpdateWeek') === 'true';

    timelineDiv.innerHTML = `
        <div style="padding: 20px; background: linear-gradient(135deg, #f0f8f0, #e0f0e0); border-radius: 8px; border-left: 4px solid var(--accent-color);">
            <h4 style="color: var(--primary-color); margin-bottom: 15px;">📅 Grow Timeline</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <p style="color: var(--text-light); font-size: 0.9em;">Start Date</p>
                    <p style="font-size: 1.2em; font-weight: 600; color: var(--text-dark);">${start.toLocaleDateString()}</p>
                </div>
                <div>
                    <p style="color: var(--text-light); font-size: 0.9em;">Days Since Start</p>
                    <p style="font-size: 1.2em; font-weight: 600; color: var(--text-dark);">${daysSinceStart} days</p>
                </div>
                <div>
                    <p style="color: var(--text-light); font-size: 0.9em;">${autoUpdate ? 'Auto Week' : 'Calculated Week'}</p>
                    <p style="font-size: 1.2em; font-weight: 600; color: var(--text-dark);">Week ${currentWeek} (Day ${dayInCurrentWeek}/7)</p>
                </div>
                <div>
                    <p style="color: var(--text-light); font-size: 0.9em;">Expected Harvest</p>
                    <p style="font-size: 1.2em; font-weight: 600; color: var(--text-dark);">${expectedHarvest.toLocaleDateString()}</p>
                </div>
            </div>
            ${autoUpdate ? '<p style="margin-top: 15px; color: var(--success-color); font-weight: 600;">✓ Auto-update enabled - Week will advance automatically</p>' : '<p style="margin-top: 15px; color: var(--text-light);">Auto-update disabled - Manual week selection active</p>'}
        </div>
    `;
}

// ============================================
// FIREBASE INTEGRATION
// ============================================

let currentUser = null;
let unsubscribeFirestore = null;

// Initialize Firebase authentication
function initFirebaseAuth() {
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');

    // Sign in with Google
    if (signInBtn) {
        signInBtn.addEventListener('click', async () => {
            try {
                const result = await window.firebaseSignInWithPopup(window.firebaseAuth, window.firebaseGoogleProvider);
                currentUser = result.user;
                console.log('Signed in:', currentUser.email);
            } catch (error) {
                console.error('Sign in error:', error);
                alert('Sign in failed: ' + error.message);
            }
        });
    }

    // Sign out
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                await window.firebaseSignOut(window.firebaseAuth);
                console.log('Signed out');
            } catch (error) {
                console.error('Sign out error:', error);
            }
        });
    }

    // Auth state observer
    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
        currentUser = user;

        if (user) {
            // User is signed in
            signInBtn.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userEmail.textContent = user.email;

            // Load data from Firestore
            loadFromFirestore();
            // Set up real-time sync
            setupFirestoreSync();
        } else {
            // User is signed out
            signInBtn.classList.remove('hidden');
            userInfo.classList.add('hidden');

            // Clean up listener
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
                unsubscribeFirestore = null;
            }
        }
    });
}

// Save data to Firestore
async function saveToFirestore(data) {
    if (!currentUser) return;

    try {
        const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', currentUser.uid);
        await window.firebaseSetDoc(userDocRef, {
            ...data,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log('Data saved to Firestore');
    } catch (error) {
        console.error('Error saving to Firestore:', error);
    }
}

// Load data from Firestore
async function loadFromFirestore() {
    if (!currentUser) return;

    try {
        const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', currentUser.uid);
        const docSnap = await window.firebaseGetDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Data loaded from Firestore:', data);

            // Apply data to UI and localStorage
            if (data.currentWeek) {
                localStorage.setItem('currentWeek', data.currentWeek);
                document.getElementById('currentWeek').value = data.currentWeek;
            }
            if (data.growMedium) {
                localStorage.setItem('growMedium', data.growMedium);
                document.getElementById('growMedium').value = data.growMedium;
            }
            if (data.growStartDate) {
                localStorage.setItem('growStartDate', data.growStartDate);
                document.getElementById('startDateInput').value = data.growStartDate;
            }
            if (data.autoUpdateWeek !== undefined) {
                localStorage.setItem('autoUpdateWeek', data.autoUpdateWeek);
                document.getElementById('toggleAutoUpdate').checked = data.autoUpdateWeek === 'true';
            }
            if (data.growNotes) {
                localStorage.setItem('growNotes', data.growNotes);
                document.getElementById('growNotes').value = data.growNotes;
            }
            if (data.gallons) {
                document.getElementById('gallons').value = data.gallons;
            }

            // Load checklists
            if (data.checklists) {
                Object.keys(data.checklists).forEach(week => {
                    localStorage.setItem(`checklist_week_${week}`, JSON.stringify(data.checklists[week]));
                });
            }

            // Refresh UI
            updateNutrientSchedule();
            updateStageInfo();
            updateChecklist();
            updateTimelineInfo();
        }
    } catch (error) {
        console.error('Error loading from Firestore:', error);
    }
}

// Set up real-time Firestore sync
function setupFirestoreSync() {
    if (!currentUser) return;

    const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', currentUser.uid);

    unsubscribeFirestore = window.firebaseOnSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            console.log('Real-time update from Firestore');

            // Only update if data is newer (to avoid loops)
            const localLastUpdate = localStorage.getItem('lastLocalUpdate');
            const firestoreLastUpdate = data.lastUpdated;

            if (!localLastUpdate || new Date(firestoreLastUpdate) > new Date(localLastUpdate)) {
                // Apply updates from other devices
                if (data.currentWeek && document.getElementById('currentWeek').value !== data.currentWeek) {
                    document.getElementById('currentWeek').value = data.currentWeek;
                    localStorage.setItem('currentWeek', data.currentWeek);
                    updateNutrientSchedule();
                    updateStageInfo();
                    updateChecklist();
                }

                if (data.growNotes && document.getElementById('growNotes').value !== data.growNotes) {
                    document.getElementById('growNotes').value = data.growNotes;
                    localStorage.setItem('growNotes', data.growNotes);
                }
            }
        }
    });
}

// Sync all data to Firestore
function syncAllDataToFirestore() {
    if (!currentUser) return;

    // Collect all checklists
    const checklists = {};
    for (let week = 1; week <= 10; week++) {
        const checklistData = localStorage.getItem(`checklist_week_${week}`);
        if (checklistData) {
            checklists[week] = JSON.parse(checklistData);
        }
    }

    const data = {
        currentWeek: document.getElementById('currentWeek').value,
        growMedium: document.getElementById('growMedium').value,
        growStartDate: localStorage.getItem('growStartDate') || '',
        autoUpdateWeek: localStorage.getItem('autoUpdateWeek') || 'false',
        growNotes: document.getElementById('growNotes').value,
        gallons: document.getElementById('gallons').value,
        checklists: checklists
    };

    localStorage.setItem('lastLocalUpdate', new Date().toISOString());
    saveToFirestore(data);
}

// Override save functions to also sync to Firestore
const originalSaveCurrentWeek = saveCurrentWeek;
saveCurrentWeek = function() {
    originalSaveCurrentWeek();
    syncAllDataToFirestore();
};

const originalSaveMedium = saveMedium;
saveMedium = function() {
    originalSaveMedium();
    syncAllDataToFirestore();
};

const originalSaveNotes = saveNotes;
saveNotes = function() {
    originalSaveNotes();
    syncAllDataToFirestore();
};

const originalSaveChecklistItem = saveChecklistItem;
saveChecklistItem = function(id, week) {
    originalSaveChecklistItem(id, week);
    syncAllDataToFirestore();
};

const originalSetStartDate = setStartDate;
setStartDate = function() {
    originalSetStartDate();
    syncAllDataToFirestore();
};

const originalToggleAutoUpdate = toggleAutoUpdate;
toggleAutoUpdate = function() {
    originalToggleAutoUpdate();
    syncAllDataToFirestore();
};

// Initialize Firebase when available
setTimeout(() => {
    if (window.firebaseAuth) {
        initFirebaseAuth();
    }
}, 100);
