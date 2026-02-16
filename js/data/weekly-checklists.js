// Weekly checklist templates extracted from original script.js
// Keys are week numbers; each has daily and weekly task arrays

export const weeklyChecklists = {
  1: {
    daily: [
      'Check soil moisture - keep moist but not waterlogged',
      'Monitor temperature (70-80\u00b0F / 21-27\u00b0C)',
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
      "Monitor trichome development with jeweler's loupe",
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
      "Flush with plain pH'd water only",
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
      'Check drying space (60\u00b0F/60% RH ideal)'
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

// Get checklist for a specific week, with fallback for photoperiod grows
// that extend beyond 10 weeks
export function getChecklistForWeek(weekNumber, plantType, photoperiodVegWeeks) {
  if (plantType === 'autoflower') {
    return weeklyChecklists[weekNumber] || weeklyChecklists[10];
  }

  // Photoperiod: map to phase-based checklists
  const vegWeeks = photoperiodVegWeeks || 4;

  if (weekNumber <= 1) return weeklyChecklists[1]; // Seedling
  if (weekNumber <= 2) return weeklyChecklists[2]; // Late seedling
  if (weekNumber <= vegWeeks) return weeklyChecklists[3]; // Veg (use week 3-4 tasks)

  const flowerWeek = weekNumber - vegWeeks;
  if (flowerWeek <= 1) return weeklyChecklists[5]; // Transition
  if (flowerWeek <= 2) return weeklyChecklists[6]; // Early flower
  if (flowerWeek <= 4) return weeklyChecklists[7]; // Mid flower
  if (flowerWeek <= 6) return weeklyChecklists[8]; // Peak flower
  if (flowerWeek <= 7) return weeklyChecklists[9]; // Flush
  return weeklyChecklists[10]; // Harvest
}
