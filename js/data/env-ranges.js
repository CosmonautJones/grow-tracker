// Environmental ranges by growth stage + VPD calculation

export const ENV_RANGES = {
  seedling: {
    label: 'Seedling',
    temp:     { min: 68, max: 77, unit: 'F' },
    humidity: { min: 65, max: 80 },
    vpd:      { min: 0.4, max: 0.8, unit: 'kPa' },
    co2:      { min: 400, max: 800, unit: 'ppm' }
  },
  vegetative: {
    label: 'Vegetative',
    temp:     { min: 70, max: 82, unit: 'F' },
    humidity: { min: 55, max: 70 },
    vpd:      { min: 0.8, max: 1.2, unit: 'kPa' },
    co2:      { min: 400, max: 1200, unit: 'ppm' }
  },
  flowering: {
    label: 'Flowering',
    temp:     { min: 68, max: 80, unit: 'F' },
    humidity: { min: 40, max: 55 },
    vpd:      { min: 1.0, max: 1.5, unit: 'kPa' },
    co2:      { min: 400, max: 1500, unit: 'ppm' }
  },
  lateFlowering: {
    label: 'Late Flowering',
    temp:     { min: 65, max: 78, unit: 'F' },
    humidity: { min: 35, max: 50 },
    vpd:      { min: 1.2, max: 1.6, unit: 'kPa' },
    co2:      { min: 400, max: 1200, unit: 'ppm' }
  }
};

/**
 * Calculate VPD (Vapor Pressure Deficit) in kPa using the Tetens formula.
 * @param {number} tempF - Temperature in Fahrenheit
 * @param {number} humidity - Relative humidity (0-100)
 * @returns {number} VPD in kPa
 */
export function calculateVpd(tempF, humidity) {
  const tempC = (tempF - 32) * 5 / 9;
  // Tetens formula: SVP = 0.6108 * e^((17.27 * T) / (T + 237.3))
  const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const avp = svp * (humidity / 100);
  return Math.max(0, svp - avp);
}

/**
 * Convert Fahrenheit to Celsius.
 */
export function fToC(f) {
  return ((f - 32) * 5 / 9).toFixed(1);
}

/**
 * Convert Celsius to Fahrenheit.
 */
export function cToF(c) {
  return (c * 9 / 5 + 32).toFixed(1);
}

/**
 * Map a week number to an environmental stage key.
 * @param {string} plantType - 'autoflower' or 'photoperiod'
 * @param {number} weekNumber - Current week number
 * @param {number} [photoperiodVegWeeks=4] - Veg weeks for photoperiod
 * @returns {string} Stage key from ENV_RANGES
 */
export function getEnvStageForWeek(plantType, weekNumber, photoperiodVegWeeks) {
  if (plantType === 'autoflower') {
    if (weekNumber <= 1) return 'seedling';
    if (weekNumber <= 4) return 'vegetative';
    if (weekNumber <= 8) return 'flowering';
    return 'lateFlowering';
  }

  // Photoperiod
  const vegWeeks = photoperiodVegWeeks || 4;
  if (weekNumber <= 1) return 'seedling';
  if (weekNumber <= vegWeeks) return 'vegetative';
  const flowerWeek = weekNumber - vegWeeks;
  if (flowerWeek <= 5) return 'flowering';
  return 'lateFlowering';
}

/**
 * Check environmental readings against optimal ranges for a given stage.
 * @param {{ tempF: number, humidity: number, vpd?: number, co2?: number }} reading
 * @param {string} stageKey - key from ENV_RANGES
 * @returns {{ alerts: Array<{ field: string, level: 'warn'|'alert', message: string }>, status: 'ok'|'warn'|'alert' }}
 */
export function checkEnvAlerts(reading, stageKey) {
  const ranges = ENV_RANGES[stageKey];
  if (!ranges) return { alerts: [], status: 'ok' };

  const alerts = [];

  function check(field, value, range, label, unit) {
    if (value == null || isNaN(value)) return;
    if (value < range.min) {
      const diff = range.min - value;
      const level = diff > (range.max - range.min) * 0.5 ? 'alert' : 'warn';
      alerts.push({ field, level, message: `${label} is low (${value}${unit}). Target: ${range.min}-${range.max}${unit}` });
    } else if (value > range.max) {
      const diff = value - range.max;
      const level = diff > (range.max - range.min) * 0.5 ? 'alert' : 'warn';
      alerts.push({ field, level, message: `${label} is high (${value}${unit}). Target: ${range.min}-${range.max}${unit}` });
    }
  }

  check('temp', reading.tempF, ranges.temp, 'Temperature', '\u00B0F');
  check('humidity', reading.humidity, ranges.humidity, 'Humidity', '%');

  const vpd = reading.vpd ?? calculateVpd(reading.tempF, reading.humidity);
  check('vpd', parseFloat(vpd.toFixed(2)), ranges.vpd, 'VPD', ' kPa');

  if (reading.co2 != null) {
    check('co2', reading.co2, ranges.co2, 'CO2', ' ppm');
  }

  const status = alerts.some(a => a.level === 'alert') ? 'alert' : alerts.length > 0 ? 'warn' : 'ok';
  return { alerts, status };
}
