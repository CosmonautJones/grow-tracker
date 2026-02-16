// Nutrient brand registry — extensible for future brands
export const NUTRIENT_BRANDS = {
  'gh-flora-trio': {
    name: 'General Hydroponics Flora Trio',
    components: {
      micro: { name: 'FloraMicro', color: '#e74c3c', npk: { n: 5, p: 0, k: 1 }, ppmPerMl: 65, mixOrder: 1 },
      gro:   { name: 'FloraGro',   color: '#27ae60', npk: { n: 2, p: 1, k: 6 }, ppmPerMl: 55, mixOrder: 2 },
      bloom: { name: 'FloraBloom',  color: '#8e44ad', npk: { n: 0, p: 5, k: 4 }, ppmPerMl: 60, mixOrder: 3 }
    },
    schedules: {
      autoflower: {
        hydro: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 5,   gro: 5,    bloom: 5,    ppm: 400, ec: 0.8, stage: 'Germination & Early Seedling' },
            2:  { micro: 5,   gro: 5,    bloom: 5,    ppm: 500, ec: 1.0, stage: 'Late Seedling' },
            3:  { micro: 5,   gro: 10,   bloom: 5,    ppm: 600, ec: 1.2, stage: 'Early Vegetative' },
            4:  { micro: 7.5, gro: 10,   bloom: 5,    ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
            5:  { micro: 7.5, gro: 5,    bloom: 10,   ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 7.5, gro: 2.5,  bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Early Flowering' },
            7:  { micro: 5,   gro: 0,    bloom: 15,   ppm: 800, ec: 1.6, stage: 'Mid Flowering' },
            8:  { micro: 5,   gro: 0,    bloom: 15,   ppm: 700, ec: 1.4, stage: 'Peak Flowering' },
            9:  { micro: 0,   gro: 0,    bloom: 0,    ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,   gro: 0,    bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        },
        soil: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 2,   gro: 1,   bloom: 1,    ppm: 400, ec: 0.8, stage: 'Germination & Early Seedling' },
            2:  { micro: 2,   gro: 1,   bloom: 1,    ppm: 500, ec: 1.0, stage: 'Late Seedling' },
            3:  { micro: 5,   gro: 5,   bloom: 2.5,  ppm: 600, ec: 1.2, stage: 'Early Vegetative' },
            4:  { micro: 5,   gro: 5,   bloom: 2.5,  ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
            5:  { micro: 5,   gro: 2.5, bloom: 7.5,  ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 5,   gro: 1,   bloom: 10,   ppm: 800, ec: 1.6, stage: 'Early Flowering' },
            7:  { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flowering' },
            8:  { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Peak Flowering' },
            9:  { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        }
      },
      photoperiod: {
        hydro: {
          vegWeeks: {
            1: { micro: 5,   gro: 5,    bloom: 5,    ppm: 400, ec: 0.8, stage: 'Seedling' },
            2: { micro: 5,   gro: 5,    bloom: 5,    ppm: 500, ec: 1.0, stage: 'Early Veg' },
            3: { micro: 5,   gro: 10,   bloom: 5,    ppm: 600, ec: 1.2, stage: 'Vegetative' },
            4: { micro: 7.5, gro: 10,   bloom: 5,    ppm: 700, ec: 1.4, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { micro: 7.5, gro: 5,    bloom: 10,   ppm: 700, ec: 1.4, stage: 'Transition' },
            2: { micro: 7.5, gro: 2.5,  bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Early Flower' },
            3: { micro: 5,   gro: 0,    bloom: 15,   ppm: 800, ec: 1.6, stage: 'Mid Flower' },
            4: { micro: 5,   gro: 0,    bloom: 15,   ppm: 800, ec: 1.6, stage: 'Mid Flower' },
            5: { micro: 5,   gro: 0,    bloom: 15,   ppm: 700, ec: 1.4, stage: 'Late Flower' },
            6: { micro: 5,   gro: 0,    bloom: 15,   ppm: 700, ec: 1.4, stage: 'Late Flower' },
            7: { micro: 0,   gro: 0,    bloom: 0,    ppm: 0,   ec: 0,   stage: 'Flush' },
            8: { micro: 0,   gro: 0,    bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        soil: {
          vegWeeks: {
            1: { micro: 2,   gro: 1,   bloom: 1,    ppm: 400, ec: 0.8, stage: 'Seedling' },
            2: { micro: 2,   gro: 1,   bloom: 1,    ppm: 500, ec: 1.0, stage: 'Early Veg' },
            3: { micro: 5,   gro: 5,   bloom: 2.5,  ppm: 600, ec: 1.2, stage: 'Vegetative' },
            4: { micro: 5,   gro: 5,   bloom: 2.5,  ppm: 700, ec: 1.4, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { micro: 5,   gro: 2.5, bloom: 7.5,  ppm: 700, ec: 1.4, stage: 'Transition' },
            2: { micro: 5,   gro: 1,   bloom: 10,   ppm: 800, ec: 1.6, stage: 'Early Flower' },
            3: { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flower' },
            4: { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flower' },
            5: { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Late Flower' },
            6: { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Late Flower' },
            7: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Flush' },
            8: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        }
      }
    }
  }
};

// Resolve the schedule for a given week number, considering plant type and medium
export function getWeekSchedule(brand, plantType, medium, weekNumber, photoperiodVegWeeks) {
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData) return null;

  const schedules = brandData.schedules[plantType];
  if (!schedules) return null;

  const mediumSchedule = schedules[medium] || schedules.hydro;

  if (plantType === 'autoflower') {
    return mediumSchedule.weeks[weekNumber] || null;
  }

  // Photoperiod: resolve veg vs flower week
  const vegWeeks = photoperiodVegWeeks || 4;
  if (weekNumber <= vegWeeks) {
    const vegWeekKey = Math.min(weekNumber, mediumSchedule.vegRepeatWeek);
    return mediumSchedule.vegWeeks[vegWeekKey] || null;
  }

  const flowerWeek = weekNumber - vegWeeks;
  return mediumSchedule.flowerWeeks[flowerWeek] || null;
}

// Calculate estimated PPM from a week's nutrient schedule
export function calculateEstimatedPpm(weekSchedule, brand, waterBaselinePpm = 0) {
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData || !weekSchedule) return { nutrientPpm: 0, totalPpm: waterBaselinePpm, totalEc: waterBaselinePpm / 500 };

  let nutrientPpm = 0;
  for (const [key, comp] of Object.entries(brandData.components)) {
    nutrientPpm += (weekSchedule[key] || 0) * comp.ppmPerMl;
  }

  const totalPpm = nutrientPpm + waterBaselinePpm;
  return {
    nutrientPpm,
    totalPpm,
    totalEc: totalPpm / 500
  };
}

// Get total weeks for a grow configuration
export function getTotalWeeks(brand, plantType, medium, photoperiodVegWeeks) {
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData) return 10;

  const schedules = brandData.schedules[plantType];
  if (!schedules) return 10;

  const mediumSchedule = schedules[medium] || schedules.hydro;

  if (plantType === 'autoflower') {
    return mediumSchedule.totalWeeks;
  }

  return (photoperiodVegWeeks || 4) + mediumSchedule.totalFlowerWeeks;
}

// Get week label for display
export function getWeekLabel(plantType, weekNumber, photoperiodVegWeeks, stageName) {
  if (plantType === 'autoflower') {
    return `Week ${weekNumber} - ${stageName || ''}`;
  }

  const vegWeeks = photoperiodVegWeeks || 4;
  if (weekNumber <= vegWeeks) {
    return `Week ${weekNumber} (Veg ${weekNumber}) - ${stageName || ''}`;
  }

  const flowerWeek = weekNumber - vegWeeks;
  return `Week ${weekNumber} (Flower ${flowerWeek}) - ${stageName || ''}`;
}

// Get mixing order sorted components for a brand
export function getMixingOrder(brand) {
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData) return [];

  return Object.entries(brandData.components)
    .sort(([, a], [, b]) => a.mixOrder - b.mixOrder)
    .map(([key, comp]) => ({ key, ...comp }));
}
