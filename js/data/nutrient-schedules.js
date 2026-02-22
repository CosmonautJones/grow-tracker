// Nutrient brand registry — extensible for future brands
export const NUTRIENT_BRANDS = {
  'foxfarm-trio': {
    name: 'Fox Farm Trio',
    unit: 'ml',
    unitLabel: 'ml/gal',
    notes: 'Big Bloom is organic — always add first. Fox Farm soils (Ocean Forest, Happy Frog) are pre-amended for ~30 days. Feed twice per week, alternate with plain water. Measurements: 1 tbsp = 15ml, 1 tsp = 5ml. Many growers use 50-75% strength initially.',
    supportedMediums: ['soil', 'coco', 'hydro'],
    autoPhBuffer: false,
    sources: [
      { name: 'Fox Farm Feeding Schedules', url: 'https://foxfarm.com/feeding-schedules/' }
    ],
    components: {
      bigBloom:   { name: 'Big Bloom',   color: '#e67e22', npk: { n: 0, p: 0.5, k: 0.7 }, ppmPerUnit: 8,  mixOrder: 1 },
      growBig:    { name: 'Grow Big',    color: '#27ae60', npk: { n: 6, p: 4, k: 4 },       ppmPerUnit: 55, mixOrder: 2 },
      tigerBloom: { name: 'Tiger Bloom', color: '#e74c3c', npk: { n: 2, p: 8, k: 4 },       ppmPerUnit: 50, mixOrder: 3 }
    },
    schedules: {
      autoflower: {
        soil: {
          totalWeeks: 10,
          weeks: {
            1:  { bigBloom: 30,  growBig: 0,   tigerBloom: 0,   ppm: 200,  ec: 0.4,  stage: 'Germination & Early Seedling' },
            2:  { bigBloom: 30,  growBig: 10,  tigerBloom: 0,   ppm: 500,  ec: 1.0,  stage: 'Late Seedling' },
            3:  { bigBloom: 30,  growBig: 15,  tigerBloom: 0,   ppm: 700,  ec: 1.4,  stage: 'Early Vegetative' },
            4:  { bigBloom: 0,   growBig: 15,  tigerBloom: 0,   ppm: 650,  ec: 1.3,  stage: 'Late Vegetative' },
            5:  { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Pre-Flowering / Transition' },
            6:  { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Early Flowering' },
            7:  { bigBloom: 15,  growBig: 10,  tigerBloom: 10,  ppm: 750,  ec: 1.5,  stage: 'Mid Flowering' },
            8:  { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Peak Flowering' },
            9:  { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Late Flowering / Flush' },
            10: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Harvest Preparation' }
          }
        },
        coco: {
          totalWeeks: 10,
          weeks: {
            1:  { bigBloom: 15,  growBig: 0,   tigerBloom: 0,   ppm: 200,  ec: 0.4,  stage: 'Germination & Early Seedling' },
            2:  { bigBloom: 15,  growBig: 5,   tigerBloom: 0,   ppm: 400,  ec: 0.8,  stage: 'Late Seedling' },
            3:  { bigBloom: 15,  growBig: 10,  tigerBloom: 0,   ppm: 600,  ec: 1.2,  stage: 'Early Vegetative' },
            4:  { bigBloom: 15,  growBig: 10,  tigerBloom: 0,   ppm: 650,  ec: 1.3,  stage: 'Late Vegetative' },
            5:  { bigBloom: 15,  growBig: 5,   tigerBloom: 7.5, ppm: 700,  ec: 1.4,  stage: 'Pre-Flowering / Transition' },
            6:  { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Early Flowering' },
            7:  { bigBloom: 15,  growBig: 7.5, tigerBloom: 10,  ppm: 800,  ec: 1.6,  stage: 'Mid Flowering' },
            8:  { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Peak Flowering' },
            9:  { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Late Flowering / Flush' },
            10: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Harvest Preparation' }
          }
        },
        hydro: {
          totalWeeks: 10,
          weeks: {
            1:  { bigBloom: 15,  growBig: 0,   tigerBloom: 0,   ppm: 200,  ec: 0.4,  stage: 'Germination & Early Seedling' },
            2:  { bigBloom: 15,  growBig: 5,   tigerBloom: 0,   ppm: 400,  ec: 0.8,  stage: 'Late Seedling' },
            3:  { bigBloom: 15,  growBig: 7.5, tigerBloom: 0,   ppm: 550,  ec: 1.1,  stage: 'Early Vegetative' },
            4:  { bigBloom: 15,  growBig: 10,  tigerBloom: 0,   ppm: 650,  ec: 1.3,  stage: 'Late Vegetative' },
            5:  { bigBloom: 15,  growBig: 5,   tigerBloom: 5,   ppm: 650,  ec: 1.3,  stage: 'Pre-Flowering / Transition' },
            6:  { bigBloom: 15,  growBig: 0,   tigerBloom: 7.5, ppm: 650,  ec: 1.3,  stage: 'Early Flowering' },
            7:  { bigBloom: 15,  growBig: 5,   tigerBloom: 10,  ppm: 750,  ec: 1.5,  stage: 'Mid Flowering' },
            8:  { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Peak Flowering' },
            9:  { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Late Flowering / Flush' },
            10: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Harvest Preparation' }
          }
        }
      },
      photoperiod: {
        soil: {
          vegWeeks: {
            1: { bigBloom: 30,  growBig: 0,   tigerBloom: 0,   ppm: 200,  ec: 0.4,  stage: 'Seedling' },
            2: { bigBloom: 30,  growBig: 10,  tigerBloom: 0,   ppm: 500,  ec: 1.0,  stage: 'Early Veg' },
            3: { bigBloom: 30,  growBig: 15,  tigerBloom: 0,   ppm: 700,  ec: 1.4,  stage: 'Vegetative' },
            4: { bigBloom: 0,   growBig: 15,  tigerBloom: 0,   ppm: 650,  ec: 1.3,  stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { bigBloom: 15,  growBig: 5,   tigerBloom: 10,  ppm: 750,  ec: 1.5,  stage: 'Transition' },
            2: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Early Flower' },
            3: { bigBloom: 15,  growBig: 10,  tigerBloom: 10,  ppm: 750,  ec: 1.5,  stage: 'Mid Flower' },
            4: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Mid Flower' },
            5: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Late Flower' },
            6: { bigBloom: 15,  growBig: 0,   tigerBloom: 5,   ppm: 500,  ec: 1.0,  stage: 'Late Flower' },
            7: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Flush' },
            8: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        coco: {
          vegWeeks: {
            1: { bigBloom: 15,  growBig: 0,   tigerBloom: 0,   ppm: 200,  ec: 0.4,  stage: 'Seedling' },
            2: { bigBloom: 15,  growBig: 5,   tigerBloom: 0,   ppm: 400,  ec: 0.8,  stage: 'Early Veg' },
            3: { bigBloom: 15,  growBig: 10,  tigerBloom: 0,   ppm: 650,  ec: 1.3,  stage: 'Vegetative' },
            4: { bigBloom: 15,  growBig: 10,  tigerBloom: 0,   ppm: 700,  ec: 1.4,  stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { bigBloom: 15,  growBig: 5,   tigerBloom: 7.5, ppm: 700,  ec: 1.4,  stage: 'Transition' },
            2: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Early Flower' },
            3: { bigBloom: 15,  growBig: 7.5, tigerBloom: 10,  ppm: 800,  ec: 1.6,  stage: 'Mid Flower' },
            4: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Mid Flower' },
            5: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Late Flower' },
            6: { bigBloom: 15,  growBig: 0,   tigerBloom: 5,   ppm: 500,  ec: 1.0,  stage: 'Late Flower' },
            7: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Flush' },
            8: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        hydro: {
          vegWeeks: {
            1: { bigBloom: 15,  growBig: 0,   tigerBloom: 0,   ppm: 200,  ec: 0.4,  stage: 'Seedling' },
            2: { bigBloom: 15,  growBig: 5,   tigerBloom: 0,   ppm: 400,  ec: 0.8,  stage: 'Early Veg' },
            3: { bigBloom: 15,  growBig: 7.5, tigerBloom: 0,   ppm: 550,  ec: 1.1,  stage: 'Vegetative' },
            4: { bigBloom: 15,  growBig: 10,  tigerBloom: 0,   ppm: 650,  ec: 1.3,  stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { bigBloom: 15,  growBig: 5,   tigerBloom: 7.5, ppm: 700,  ec: 1.4,  stage: 'Transition' },
            2: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Early Flower' },
            3: { bigBloom: 15,  growBig: 5,   tigerBloom: 10,  ppm: 750,  ec: 1.5,  stage: 'Mid Flower' },
            4: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 700,  ec: 1.4,  stage: 'Mid Flower' },
            5: { bigBloom: 15,  growBig: 0,   tigerBloom: 10,  ppm: 650,  ec: 1.3,  stage: 'Late Flower' },
            6: { bigBloom: 15,  growBig: 0,   tigerBloom: 5,   ppm: 500,  ec: 1.0,  stage: 'Late Flower' },
            7: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Flush' },
            8: { bigBloom: 0,   growBig: 0,   tigerBloom: 0,   ppm: 0,    ec: 0,    stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        }
      }
    }
  },
  'an-ph-perfect': {
    name: 'Advanced Nutrients pH Perfect',
    unit: 'ml',
    unitLabel: 'ml/gal',
    notes: 'Equal ratio 1:1:1 for all three components. Always add Micro first, then Grow, then Bloom. AN officially recommends the same schedule for all media — the pH Perfect technology auto-adjusts pH between 5.0-6.3.',
    supportedMediums: ['hydro', 'soil', 'coco'],
    autoPhBuffer: true,
    sources: [
      { name: 'Advanced Nutrients Calculator', url: 'https://www.advancednutrients.com/nutrient-calculator/' }
    ],
    components: {
      micro: { name: 'pH Perfect Micro', color: '#e74c3c', npk: { n: 2, p: 0, k: 0 }, ppmPerUnit: 50, mixOrder: 1 },
      grow:  { name: 'pH Perfect Grow',  color: '#27ae60', npk: { n: 1, p: 0, k: 4 }, ppmPerUnit: 45, mixOrder: 2 },
      bloom: { name: 'pH Perfect Bloom', color: '#8e44ad', npk: { n: 1, p: 3, k: 4 }, ppmPerUnit: 55, mixOrder: 3 }
    },
    schedules: {
      autoflower: {
        hydro: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 4,  grow: 4,  bloom: 4,  ppm: 350,  ec: 0.7, stage: 'Germination & Early Seedling' },
            2:  { micro: 8,  grow: 8,  bloom: 8,  ppm: 600,  ec: 1.2, stage: 'Late Seedling' },
            3:  { micro: 11, grow: 11, bloom: 11, ppm: 800,  ec: 1.6, stage: 'Early Vegetative' },
            4:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Late Vegetative' },
            5:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Early Flowering' },
            7:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flowering' },
            8:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Peak Flowering' },
            9:  { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Preparation' }
          }
        },
        soil: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 4,  grow: 4,  bloom: 4,  ppm: 350,  ec: 0.7, stage: 'Germination & Early Seedling' },
            2:  { micro: 8,  grow: 8,  bloom: 8,  ppm: 600,  ec: 1.2, stage: 'Late Seedling' },
            3:  { micro: 11, grow: 11, bloom: 11, ppm: 800,  ec: 1.6, stage: 'Early Vegetative' },
            4:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Late Vegetative' },
            5:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Early Flowering' },
            7:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flowering' },
            8:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Peak Flowering' },
            9:  { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Preparation' }
          }
        },
        coco: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 4,  grow: 4,  bloom: 4,  ppm: 350,  ec: 0.7, stage: 'Germination & Early Seedling' },
            2:  { micro: 8,  grow: 8,  bloom: 8,  ppm: 600,  ec: 1.2, stage: 'Late Seedling' },
            3:  { micro: 11, grow: 11, bloom: 11, ppm: 800,  ec: 1.6, stage: 'Early Vegetative' },
            4:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Late Vegetative' },
            5:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Early Flowering' },
            7:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flowering' },
            8:  { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Peak Flowering' },
            9:  { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Preparation' }
          }
        }
      },
      photoperiod: {
        hydro: {
          vegWeeks: {
            1: { micro: 4,  grow: 4,  bloom: 4,  ppm: 350,  ec: 0.7, stage: 'Seedling' },
            2: { micro: 8,  grow: 8,  bloom: 8,  ppm: 600,  ec: 1.2, stage: 'Early Veg' },
            3: { micro: 11, grow: 11, bloom: 11, ppm: 800,  ec: 1.6, stage: 'Vegetative' },
            4: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Transition' },
            2: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Early Flower' },
            3: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            4: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            5: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Late Flower' },
            6: { micro: 15, grow: 15, bloom: 15, ppm: 950,  ec: 1.9, stage: 'Late Flower' },
            7: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Flush' },
            8: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        soil: {
          vegWeeks: {
            1: { micro: 4,  grow: 4,  bloom: 4,  ppm: 350,  ec: 0.7, stage: 'Seedling' },
            2: { micro: 8,  grow: 8,  bloom: 8,  ppm: 600,  ec: 1.2, stage: 'Early Veg' },
            3: { micro: 11, grow: 11, bloom: 11, ppm: 800,  ec: 1.6, stage: 'Vegetative' },
            4: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Transition' },
            2: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Early Flower' },
            3: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            4: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            5: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Late Flower' },
            6: { micro: 15, grow: 15, bloom: 15, ppm: 950,  ec: 1.9, stage: 'Late Flower' },
            7: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Flush' },
            8: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        coco: {
          vegWeeks: {
            1: { micro: 4,  grow: 4,  bloom: 4,  ppm: 350,  ec: 0.7, stage: 'Seedling' },
            2: { micro: 8,  grow: 8,  bloom: 8,  ppm: 600,  ec: 1.2, stage: 'Early Veg' },
            3: { micro: 11, grow: 11, bloom: 11, ppm: 800,  ec: 1.6, stage: 'Vegetative' },
            4: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Transition' },
            2: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Early Flower' },
            3: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            4: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            5: { micro: 15, grow: 15, bloom: 15, ppm: 1000, ec: 2.0, stage: 'Late Flower' },
            6: { micro: 15, grow: 15, bloom: 15, ppm: 950,  ec: 1.9, stage: 'Late Flower' },
            7: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Flush' },
            8: { micro: 0,  grow: 0,  bloom: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        }
      }
    }
  },
  'gh-maxi': {
    name: 'GH MaxiGro / MaxiBloom',
    unit: 'g',
    unitLabel: 'g/gal',
    notes: 'Powder nutrients — MaxiGro for veg, MaxiBloom for flower. One transition week uses both products. Dissolve fully in warm water before adding to reservoir.',
    supportedMediums: ['hydro', 'soil', 'coco'],
    autoPhBuffer: false,
    sources: [
      { name: 'GH Maxi Series Guide', url: 'https://generalhydroponics.com/resources/feeding-schedules/' }
    ],
    components: {
      maxiGro:   { name: 'MaxiGro',   color: '#27ae60', npk: { n: 10, p: 5, k: 14 }, ppmPerUnit: 160, mixOrder: 1 },
      maxiBloom: { name: 'MaxiBloom', color: '#8e44ad', npk: { n: 5, p: 15, k: 14 }, ppmPerUnit: 170, mixOrder: 2 }
    },
    schedules: {
      autoflower: {
        hydro: {
          totalWeeks: 10,
          weeks: {
            1:  { maxiGro: 2.5, maxiBloom: 0,   ppm: 400, ec: 0.8, stage: 'Germination & Early Seedling' },
            2:  { maxiGro: 3.5, maxiBloom: 0,   ppm: 550, ec: 1.1, stage: 'Late Seedling' },
            3:  { maxiGro: 5,   maxiBloom: 0,   ppm: 700, ec: 1.4, stage: 'Early Vegetative' },
            4:  { maxiGro: 5,   maxiBloom: 0,   ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
            5:  { maxiGro: 2.5, maxiBloom: 3.5, ppm: 750, ec: 1.5, stage: 'Pre-Flowering / Transition' },
            6:  { maxiGro: 0,   maxiBloom: 5,   ppm: 800, ec: 1.6, stage: 'Early Flowering' },
            7:  { maxiGro: 0,   maxiBloom: 7,   ppm: 900, ec: 1.8, stage: 'Mid Flowering' },
            8:  { maxiGro: 0,   maxiBloom: 5,   ppm: 750, ec: 1.5, stage: 'Peak Flowering' },
            9:  { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        },
        soil: {
          totalWeeks: 10,
          weeks: {
            1:  { maxiGro: 1.5, maxiBloom: 0,   ppm: 250, ec: 0.5, stage: 'Germination & Early Seedling' },
            2:  { maxiGro: 2.5, maxiBloom: 0,   ppm: 400, ec: 0.8, stage: 'Late Seedling' },
            3:  { maxiGro: 3.5, maxiBloom: 0,   ppm: 550, ec: 1.1, stage: 'Early Vegetative' },
            4:  { maxiGro: 3.5, maxiBloom: 0,   ppm: 550, ec: 1.1, stage: 'Late Vegetative' },
            5:  { maxiGro: 1.5, maxiBloom: 2.5, ppm: 600, ec: 1.2, stage: 'Pre-Flowering / Transition' },
            6:  { maxiGro: 0,   maxiBloom: 3.5, ppm: 600, ec: 1.2, stage: 'Early Flowering' },
            7:  { maxiGro: 0,   maxiBloom: 5,   ppm: 750, ec: 1.5, stage: 'Mid Flowering' },
            8:  { maxiGro: 0,   maxiBloom: 3.5, ppm: 550, ec: 1.1, stage: 'Peak Flowering' },
            9:  { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        },
        coco: {
          totalWeeks: 10,
          weeks: {
            1:  { maxiGro: 2,   maxiBloom: 0,   ppm: 350, ec: 0.7, stage: 'Germination & Early Seedling' },
            2:  { maxiGro: 3,   maxiBloom: 0,   ppm: 500, ec: 1.0, stage: 'Late Seedling' },
            3:  { maxiGro: 4,   maxiBloom: 0,   ppm: 650, ec: 1.3, stage: 'Early Vegetative' },
            4:  { maxiGro: 4,   maxiBloom: 0,   ppm: 650, ec: 1.3, stage: 'Late Vegetative' },
            5:  { maxiGro: 2,   maxiBloom: 3,   ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
            6:  { maxiGro: 0,   maxiBloom: 4,   ppm: 700, ec: 1.4, stage: 'Early Flowering' },
            7:  { maxiGro: 0,   maxiBloom: 6,   ppm: 850, ec: 1.7, stage: 'Mid Flowering' },
            8:  { maxiGro: 0,   maxiBloom: 4,   ppm: 650, ec: 1.3, stage: 'Peak Flowering' },
            9:  { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        }
      },
      photoperiod: {
        hydro: {
          vegWeeks: {
            1: { maxiGro: 2.5, maxiBloom: 0,   ppm: 400, ec: 0.8, stage: 'Seedling' },
            2: { maxiGro: 3.5, maxiBloom: 0,   ppm: 550, ec: 1.1, stage: 'Early Veg' },
            3: { maxiGro: 5,   maxiBloom: 0,   ppm: 700, ec: 1.4, stage: 'Vegetative' },
            4: { maxiGro: 7,   maxiBloom: 0,   ppm: 900, ec: 1.8, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { maxiGro: 2.5, maxiBloom: 3.5, ppm: 750, ec: 1.5, stage: 'Transition' },
            2: { maxiGro: 0,   maxiBloom: 5,   ppm: 800, ec: 1.6, stage: 'Early Flower' },
            3: { maxiGro: 0,   maxiBloom: 7,   ppm: 950, ec: 1.9, stage: 'Mid Flower' },
            4: { maxiGro: 0,   maxiBloom: 7,   ppm: 950, ec: 1.9, stage: 'Mid Flower' },
            5: { maxiGro: 0,   maxiBloom: 7,   ppm: 900, ec: 1.8, stage: 'Late Flower' },
            6: { maxiGro: 0,   maxiBloom: 5,   ppm: 750, ec: 1.5, stage: 'Late Flower' },
            7: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Flush' },
            8: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        soil: {
          vegWeeks: {
            1: { maxiGro: 1.5, maxiBloom: 0,   ppm: 250, ec: 0.5, stage: 'Seedling' },
            2: { maxiGro: 2.5, maxiBloom: 0,   ppm: 400, ec: 0.8, stage: 'Early Veg' },
            3: { maxiGro: 3.5, maxiBloom: 0,   ppm: 550, ec: 1.1, stage: 'Vegetative' },
            4: { maxiGro: 5,   maxiBloom: 0,   ppm: 700, ec: 1.4, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { maxiGro: 1.5, maxiBloom: 2.5, ppm: 600, ec: 1.2, stage: 'Transition' },
            2: { maxiGro: 0,   maxiBloom: 3.5, ppm: 600, ec: 1.2, stage: 'Early Flower' },
            3: { maxiGro: 0,   maxiBloom: 5,   ppm: 750, ec: 1.5, stage: 'Mid Flower' },
            4: { maxiGro: 0,   maxiBloom: 5,   ppm: 750, ec: 1.5, stage: 'Mid Flower' },
            5: { maxiGro: 0,   maxiBloom: 5,   ppm: 700, ec: 1.4, stage: 'Late Flower' },
            6: { maxiGro: 0,   maxiBloom: 3.5, ppm: 550, ec: 1.1, stage: 'Late Flower' },
            7: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Flush' },
            8: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        },
        coco: {
          vegWeeks: {
            1: { maxiGro: 2,   maxiBloom: 0,   ppm: 350, ec: 0.7, stage: 'Seedling' },
            2: { maxiGro: 3,   maxiBloom: 0,   ppm: 500, ec: 1.0, stage: 'Early Veg' },
            3: { maxiGro: 4,   maxiBloom: 0,   ppm: 650, ec: 1.3, stage: 'Vegetative' },
            4: { maxiGro: 6,   maxiBloom: 0,   ppm: 800, ec: 1.6, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { maxiGro: 2,   maxiBloom: 3,   ppm: 700, ec: 1.4, stage: 'Transition' },
            2: { maxiGro: 0,   maxiBloom: 4,   ppm: 700, ec: 1.4, stage: 'Early Flower' },
            3: { maxiGro: 0,   maxiBloom: 6,   ppm: 850, ec: 1.7, stage: 'Mid Flower' },
            4: { maxiGro: 0,   maxiBloom: 6,   ppm: 850, ec: 1.7, stage: 'Mid Flower' },
            5: { maxiGro: 0,   maxiBloom: 6,   ppm: 800, ec: 1.6, stage: 'Late Flower' },
            6: { maxiGro: 0,   maxiBloom: 4,   ppm: 650, ec: 1.3, stage: 'Late Flower' },
            7: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Flush' },
            8: { maxiGro: 0,   maxiBloom: 0,   ppm: 0,   ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        }
      }
    }
  },
  'canna-coco': {
    name: 'Canna Coco A+B',
    unit: 'ml',
    unitLabel: 'ml/gal',
    notes: 'Always use equal parts A and B. Add A first, mix thoroughly, then add B. CalMag supplementation recommended (3-5 ml/gal), especially with RO water. EC values shown include ~0.4 EC from tap water.',
    supportedMediums: ['coco'],
    autoPhBuffer: false,
    sources: [
      { name: 'Canna Coco Grow Guide', url: 'https://www.canna.com/coco_guide' }
    ],
    components: {
      cocoA: { name: 'Coco A', color: '#e74c3c', npk: { n: 4, p: 0, k: 1 }, ppmPerUnit: 55, mixOrder: 1 },
      cocoB: { name: 'Coco B', color: '#3498db', npk: { n: 0, p: 4, k: 2 }, ppmPerUnit: 50, mixOrder: 2 }
    },
    schedules: {
      autoflower: {
        coco: {
          totalWeeks: 10,
          weeks: {
            1:  { cocoA: 4,  cocoB: 4,  ppm: 350,  ec: 0.7, stage: 'Germination & Early Seedling' },
            2:  { cocoA: 6,  cocoB: 6,  ppm: 500,  ec: 1.0, stage: 'Late Seedling' },
            3:  { cocoA: 8,  cocoB: 8,  ppm: 650,  ec: 1.3, stage: 'Early Vegetative' },
            4:  { cocoA: 10, cocoB: 10, ppm: 800,  ec: 1.6, stage: 'Late Vegetative' },
            5:  { cocoA: 12, cocoB: 12, ppm: 900,  ec: 1.8, stage: 'Pre-Flowering / Transition' },
            6:  { cocoA: 14, cocoB: 14, ppm: 1000, ec: 2.0, stage: 'Early Flowering' },
            7:  { cocoA: 15, cocoB: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flowering' },
            8:  { cocoA: 11, cocoB: 11, ppm: 800,  ec: 1.6, stage: 'Peak Flowering' },
            9:  { cocoA: 0,  cocoB: 0,  ppm: 0,    ec: 0,   stage: 'Late Flowering / Flush' },
            10: { cocoA: 0,  cocoB: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Preparation' }
          }
        }
      },
      photoperiod: {
        coco: {
          vegWeeks: {
            1: { cocoA: 4,  cocoB: 4,  ppm: 350,  ec: 0.7, stage: 'Seedling' },
            2: { cocoA: 8,  cocoB: 8,  ppm: 650,  ec: 1.3, stage: 'Early Veg' },
            3: { cocoA: 12, cocoB: 12, ppm: 900,  ec: 1.8, stage: 'Vegetative' },
            4: { cocoA: 15, cocoB: 15, ppm: 1000, ec: 2.0, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { cocoA: 12, cocoB: 12, ppm: 900,  ec: 1.8, stage: 'Transition' },
            2: { cocoA: 14, cocoB: 14, ppm: 1000, ec: 2.0, stage: 'Early Flower' },
            3: { cocoA: 15, cocoB: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            4: { cocoA: 15, cocoB: 15, ppm: 1000, ec: 2.0, stage: 'Mid Flower' },
            5: { cocoA: 12, cocoB: 12, ppm: 900,  ec: 1.8, stage: 'Late Flower' },
            6: { cocoA: 8,  cocoB: 8,  ppm: 650,  ec: 1.3, stage: 'Late Flower' },
            7: { cocoA: 0,  cocoB: 0,  ppm: 0,    ec: 0,   stage: 'Flush' },
            8: { cocoA: 0,  cocoB: 0,  ppm: 0,    ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        }
      }
    }
  },
  'gh-flora-trio': {
    name: 'General Hydroponics Flora Trio',
    unit: 'ml',
    unitLabel: 'ml/gal',
    notes: 'Always add Micro first, then Gro, then Bloom. Never mix concentrates directly. For coco coir, add CaliMagic (3-5 ml/gal) at every feeding before base nutrients.',
    supportedMediums: ['hydro', 'soil', 'coco'],
    autoPhBuffer: false,
    sources: [
      { name: 'GH Flora Series Feeding Charts', url: 'https://generalhydroponics.com/resources/feeding-schedules/' }
    ],
    components: {
      micro: { name: 'FloraMicro', color: '#e74c3c', npk: { n: 5, p: 0, k: 1 }, ppmPerUnit: 65, mixOrder: 1 },
      gro:   { name: 'FloraGro',   color: '#27ae60', npk: { n: 2, p: 1, k: 6 }, ppmPerUnit: 55, mixOrder: 2 },
      bloom: { name: 'FloraBloom',  color: '#8e44ad', npk: { n: 0, p: 5, k: 4 }, ppmPerUnit: 60, mixOrder: 3 }
    },
    schedules: {
      autoflower: {
        hydro: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 2.5, gro: 2.5,  bloom: 2.5,  ppm: 200, ec: 0.4, stage: 'Germination & Early Seedling' },
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
            1:  { micro: 2,   gro: 1,   bloom: 1,    ppm: 200, ec: 0.4, stage: 'Germination & Early Seedling' },
            2:  { micro: 2,   gro: 1,   bloom: 1,    ppm: 350, ec: 0.7, stage: 'Late Seedling' },
            3:  { micro: 5,   gro: 5,   bloom: 2.5,  ppm: 600, ec: 1.2, stage: 'Early Vegetative' },
            4:  { micro: 5,   gro: 5,   bloom: 2.5,  ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
            5:  { micro: 5,   gro: 2.5, bloom: 7.5,  ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 5,   gro: 1,   bloom: 10,   ppm: 800, ec: 1.6, stage: 'Early Flowering' },
            7:  { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flowering' },
            8:  { micro: 3.5, gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Peak Flowering' },
            9:  { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        },
        coco: {
          totalWeeks: 10,
          weeks: {
            1:  { micro: 2.5, gro: 2.5, bloom: 2.5,  ppm: 200, ec: 0.4, stage: 'Germination & Early Seedling' },
            2:  { micro: 2.5, gro: 2.5, bloom: 2.5,  ppm: 350, ec: 0.7, stage: 'Late Seedling' },
            3:  { micro: 5,   gro: 7.5, bloom: 2.5,  ppm: 600, ec: 1.2, stage: 'Early Vegetative' },
            4:  { micro: 5,   gro: 7.5, bloom: 5,    ppm: 700, ec: 1.4, stage: 'Late Vegetative' },
            5:  { micro: 5,   gro: 5,   bloom: 7.5,  ppm: 700, ec: 1.4, stage: 'Pre-Flowering / Transition' },
            6:  { micro: 5,   gro: 2.5, bloom: 10,   ppm: 800, ec: 1.6, stage: 'Early Flowering' },
            7:  { micro: 5,   gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flowering' },
            8:  { micro: 5,   gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Peak Flowering' },
            9:  { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Late Flowering / Flush' },
            10: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Preparation' }
          }
        }
      },
      photoperiod: {
        hydro: {
          vegWeeks: {
            1: { micro: 2.5, gro: 2.5,  bloom: 2.5,  ppm: 200, ec: 0.4, stage: 'Seedling' },
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
            1: { micro: 2,   gro: 1,   bloom: 1,    ppm: 200, ec: 0.4, stage: 'Seedling' },
            2: { micro: 2,   gro: 1,   bloom: 1,    ppm: 350, ec: 0.7, stage: 'Early Veg' },
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
        },
        coco: {
          vegWeeks: {
            1: { micro: 2.5, gro: 2.5, bloom: 2.5,  ppm: 200, ec: 0.4, stage: 'Seedling' },
            2: { micro: 2.5, gro: 2.5, bloom: 2.5,  ppm: 350, ec: 0.7, stage: 'Early Veg' },
            3: { micro: 5,   gro: 7.5, bloom: 2.5,  ppm: 600, ec: 1.2, stage: 'Vegetative' },
            4: { micro: 5,   gro: 7.5, bloom: 5,    ppm: 700, ec: 1.4, stage: 'Mature Veg' }
          },
          vegRepeatWeek: 4,
          flowerWeeks: {
            1: { micro: 5,   gro: 5,   bloom: 7.5,  ppm: 700, ec: 1.4, stage: 'Transition' },
            2: { micro: 5,   gro: 2.5, bloom: 10,   ppm: 800, ec: 1.6, stage: 'Early Flower' },
            3: { micro: 5,   gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flower' },
            4: { micro: 5,   gro: 0,   bloom: 12.5, ppm: 800, ec: 1.6, stage: 'Mid Flower' },
            5: { micro: 5,   gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Late Flower' },
            6: { micro: 5,   gro: 0,   bloom: 12.5, ppm: 700, ec: 1.4, stage: 'Late Flower' },
            7: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Flush' },
            8: { micro: 0,   gro: 0,   bloom: 0,    ppm: 0,   ec: 0,   stage: 'Harvest Prep' }
          },
          totalFlowerWeeks: 8
        }
      }
    }
  }
};

// Medium-specific notes for cross-brand compatibility
export const MEDIUM_NOTES = {
  'soil': {
    label: 'Soil',
    phRange: [6.0, 7.0],
    notes: 'Pre-amended soils (Fox Farm Ocean Forest, Happy Frog) contain ~30 days of nutrients. Start feeding later (week 3-4). Any liquid nutrient brand works in soil — reduce strength by 25-50% compared to hydro rates.',
    calmagNeeded: false
  },
  'coco': {
    label: 'Coco Coir',
    phRange: [5.5, 6.5],
    notes: 'Inert medium — feed at every watering. Coco naturally binds calcium, so CalMag supplementation is essential (3-5 ml/gal). Any brand works in coco but use hydro-strength rates.',
    calmagNeeded: true
  },
  'hydro': {
    label: 'Hydroponics',
    phRange: [5.5, 6.2],
    notes: 'No buffer — pH and EC control are critical. Monitor daily. Change reservoir weekly. Use full-strength manufacturer rates.',
    calmagNeeded: 'with_ro_water'
  }
};

// Cross-brand mixing guidance
export const CROSS_BRAND_NOTES = [
  {
    scenario: 'Fox Farm Soil + GH Flora Trio',
    notes: 'Common combination. Use GH Flora Trio soil/drain-to-waste rates. Start feeding week 3-4 in Ocean Forest (it has built-in nutrients). Use half-strength for the first feeding. Add CaliMagic if in coco.'
  },
  {
    scenario: 'Any Brand + CalMag in Coco',
    notes: 'Regardless of nutrient brand, coco coir growers should add CalMag (3-5 ml/gal) at every feeding. Add CalMag to water first, before base nutrients.'
  },
  {
    scenario: 'Mixing Brands (General Warning)',
    notes: 'Avoid mixing products from different brands in the same feeding — nutrient ratios and pH buffers can conflict. The exception is CalMag supplements, which are universally compatible.'
  }
];

// Resolve the schedule for a given week number, considering plant type and medium
export function getWeekSchedule(brand, plantType, medium, weekNumber, photoperiodVegWeeks) {
  const brandData = NUTRIENT_BRANDS[brand];
  if (!brandData) return null;

  const schedules = brandData.schedules[plantType];
  if (!schedules) return null;

  const mediumSchedule = schedules[medium] || schedules.coco || schedules.soil || schedules.hydro;

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
    nutrientPpm += (weekSchedule[key] || 0) * comp.ppmPerUnit;
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

  const mediumSchedule = schedules[medium] || schedules.coco || schedules.soil || schedules.hydro;

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
