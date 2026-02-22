// Test seed data — seeds localStorage with gt_ prefixed keys matching store.js format

const ACTIVE_GROW_ID = 'test_grow_active_001';
const COMPLETED_GROW_ID = 'test_grow_completed_002';

export const SEED_GROWS = {
  [ACTIVE_GROW_ID]: {
    id: ACTIVE_GROW_ID,
    status: 'active',
    plantType: 'autoflower',
    strainName: 'Northern Lights Auto',
    breeder: 'Royal Queen Seeds',
    startDate: '2026-01-15',
    endDate: '',
    growMedium: 'soil',
    nutrientBrand: 'foxfarm-trio',
    containerSize: '5 gallon',
    lightSetup: 'LED',
    lightWattage: '240W',
    lightSchedule: '18/6',
    currentWeek: 4,
    totalWeeks: 10,
    gallons: 1,
    autoUpdateWeek: false,
    photoperiodVegWeeks: 0,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  [COMPLETED_GROW_ID]: {
    id: COMPLETED_GROW_ID,
    status: 'completed',
    plantType: 'photoperiod',
    strainName: 'Blue Dream',
    breeder: 'Humboldt Seeds',
    startDate: '2025-09-01',
    endDate: '2025-12-15',
    growMedium: 'hydro',
    nutrientBrand: 'gh-flora-trio',
    containerSize: '3 gallon',
    lightSetup: 'HPS',
    lightWattage: '600W',
    lightSchedule: '12/12',
    currentWeek: 12,
    totalWeeks: 12,
    gallons: 2,
    autoUpdateWeek: false,
    photoperiodVegWeeks: 4,
    createdAt: '2025-09-01T10:00:00.000Z',
    harvest: {
      dryWeightGrams: 120,
      qualityRating: 4,
      notes: 'Great yield, dense nugs',
    },
  },
};

export const SEED_NOTES = [
  {
    id: 'note_001',
    category: 'observation',
    title: 'First true leaves',
    content: 'Plant showing healthy first true leaves. Cotyledons still green.',
    week: 1,
    tags: ['seedling', 'healthy'],
    createdAt: '2026-01-16T08:00:00.000Z',
  },
  {
    id: 'note_002',
    category: 'feeding',
    title: 'First feeding',
    content: 'Started quarter strength Big Bloom at 7.5ml per gallon.',
    week: 2,
    tags: ['nutrients', 'fox-farm'],
    createdAt: '2026-01-22T10:00:00.000Z',
  },
  {
    id: 'note_003',
    category: 'issue',
    title: 'Slight yellowing',
    content: 'Lower leaves showing slight yellowing. May need more nitrogen.',
    week: 3,
    tags: ['deficiency', 'nitrogen'],
    createdAt: '2026-01-29T12:00:00.000Z',
  },
];

export const SEED_FEEDING_LOGS = [
  {
    id: 'feed_001',
    week: 2,
    date: '2026-01-22T10:00:00.000Z',
    gallons: 1,
    components: { bigBloom: 30, growBig: 10, tigerBloom: 0 },
    ppmIn: 500,
    ppmOut: 380,
    phIn: 6.5,
    phOut: 6.3,
    notes: 'First real feeding',
  },
  {
    id: 'feed_002',
    week: 3,
    date: '2026-01-29T10:00:00.000Z',
    gallons: 1,
    components: { bigBloom: 30, growBig: 15, tigerBloom: 0 },
    ppmIn: 700,
    ppmOut: 550,
    phIn: 6.5,
    phOut: 6.2,
    notes: 'Increased Grow Big',
  },
];

export const SEED_ENV_LOGS = [
  {
    id: 'env_001',
    datetime: '2026-01-20T08:00:00.000Z',
    tempF: 75,
    humidity: 60,
    vpd: 1.05,
    co2: 400,
    week: 1,
    notes: 'Stable environment',
  },
  {
    id: 'env_002',
    datetime: '2026-01-27T08:00:00.000Z',
    tempF: 78,
    humidity: 55,
    vpd: 1.25,
    co2: 450,
    week: 2,
    notes: 'Slightly warmer',
  },
];

/**
 * Returns a flat object of { 'gt_key': JSON.stringify(value) } entries
 * ready to inject via page.evaluate / localStorage.setItem
 */
export function getSeedLocalStorage() {
  return {
    gt_grows: SEED_GROWS,
    gt_activeGrowId: ACTIVE_GROW_ID,
    [`gt_grow_${ACTIVE_GROW_ID}_notes`]: SEED_NOTES,
    [`gt_grow_${ACTIVE_GROW_ID}_feedingLogs`]: SEED_FEEDING_LOGS,
    [`gt_grow_${ACTIVE_GROW_ID}_envLogs`]: SEED_ENV_LOGS,
    [`gt_grow_${COMPLETED_GROW_ID}_notes`]: [],
    [`gt_grow_${COMPLETED_GROW_ID}_feedingLogs`]: [],
    [`gt_grow_${COMPLETED_GROW_ID}_envLogs`]: [],
  };
}

export { ACTIVE_GROW_ID, COMPLETED_GROW_ID };
