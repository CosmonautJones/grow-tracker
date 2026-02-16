// Stage descriptions by plant type and week

const autoflowerStages = {
  1: {
    name: 'Germination & Early Seedling',
    description: 'Germination phase. Keep seeds moist and warm (75-80\u00b0F). Once sprouted, provide gentle light. Cotyledons will appear first.'
  },
  2: {
    name: 'Late Seedling',
    description: 'Seedling stage. First true leaves developing. Keep humidity high (60-70%). Begin very light feeding. Handle seedlings gently.'
  },
  3: {
    name: 'Early Vegetative',
    description: 'Vegetative growth. Rapid leaf and stem development. Increase feeding gradually. Good time for LST. Watch for pre-flowers.'
  },
  4: {
    name: 'Late Vegetative',
    description: 'Vegetative growth. Rapid leaf and stem development. Increase feeding gradually. Good time for LST. Watch for pre-flowers.'
  },
  5: {
    name: 'Pre-Flowering / Transition',
    description: 'Pre-flowering transition. Stretch phase begins. First flower sites appearing. Transition to bloom nutrients. Lower humidity to 50%.'
  },
  6: {
    name: 'Early Flowering',
    description: 'Early flowering. Buds forming at nodes. Increase P and K. Monitor humidity (40-50%). Ensure good airflow. Defoliate lightly if needed.'
  },
  7: {
    name: 'Mid Flowering',
    description: 'Mid flowering. Rapid bud development and swelling. Heavy feeding period. Monitor trichomes starting now. Check for pests/mold regularly.'
  },
  8: {
    name: 'Peak Flowering',
    description: 'Peak flowering. Maximum bud density. Check trichomes daily. Look for milky trichomes with some amber. Prepare for flush timing.'
  },
  9: {
    name: 'Late Flowering / Flush',
    description: 'Late flowering / Flush. Plain water only! Trichomes should be mostly milky with 10-30% amber. Pistils 70-90% brown. Leaves may yellow (normal).'
  },
  10: {
    name: 'Harvest Preparation',
    description: 'Harvest preparation. Final checks of trichomes and pistils. Stop watering 1-2 days before harvest. Prepare drying space (60\u00b0F/60% RH). Clean trimming tools.'
  }
};

// Get stage info for a given configuration
export function getStageInfo(plantType, weekNumber, photoperiodVegWeeks) {
  if (plantType === 'autoflower') {
    return autoflowerStages[weekNumber] || autoflowerStages[10];
  }

  // Photoperiod: derive stage from veg/flower position
  const vegWeeks = photoperiodVegWeeks || 4;

  if (weekNumber <= 1) {
    return { name: 'Seedling', description: 'Germination phase. Keep seeds moist and warm (75-80\u00b0F). Once sprouted, provide gentle light. Cotyledons will appear first.' };
  }
  if (weekNumber <= 2) {
    return { name: 'Early Veg', description: 'Seedling stage. First true leaves developing. Keep humidity high (60-70%). Begin very light feeding.' };
  }
  if (weekNumber < vegWeeks) {
    return { name: 'Vegetative', description: 'Vegetative growth. Rapid leaf and stem development. Increase feeding gradually. Good time for LST and topping.' };
  }
  if (weekNumber === vegWeeks) {
    return { name: 'Mature Veg', description: 'Mature vegetative growth. Plant is well established. Consider flipping to 12/12 when desired size is reached.' };
  }

  const flowerWeek = weekNumber - vegWeeks;
  if (flowerWeek <= 1) {
    return { name: 'Transition', description: 'Transition to flower. Stretch phase begins. Switch to 12/12 light schedule. First pistils appearing. Transition nutrients.' };
  }
  if (flowerWeek <= 2) {
    return { name: 'Early Flower', description: 'Early flowering. Buds forming at nodes. Increase P and K. Monitor humidity (40-50%). Ensure good airflow.' };
  }
  if (flowerWeek <= 4) {
    return { name: 'Mid Flower', description: 'Mid flowering. Rapid bud development and swelling. Heavy feeding period. Monitor trichomes. Check for pests/mold regularly.' };
  }
  if (flowerWeek <= 6) {
    return { name: 'Late Flower', description: 'Late flowering. Maximum bud density. Check trichomes daily. Look for milky trichomes with some amber. Begin planning flush.' };
  }
  if (flowerWeek <= 7) {
    return { name: 'Flush', description: 'Flush. Plain water only! Trichomes should be mostly milky with 10-30% amber. Pistils 70-90% brown. Leaves may yellow (normal).' };
  }
  return { name: 'Harvest Prep', description: 'Harvest preparation. Final checks of trichomes and pistils. Stop watering 1-2 days before harvest. Prepare drying space.' };
}
