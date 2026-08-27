/* TerraPulse Environmental Sensor Threshold Engine */

export const SENSOR_THRESHOLDS = {
  temperature: {
    criticalLow: 15.0,
    warningLow: 20.0,
    goodHigh: 30.0,
    warningHigh: 35.0,
    unit: '°C',
    idealRange: '20°C – 30°C'
  },
  humidity: {
    criticalLow: 35.0,
    warningLow: 50.0,
    goodHigh: 75.0,
    warningHigh: 85.0,
    unit: '%',
    idealRange: '50% – 75%'
  },
  soilPH: {
    criticalLow: 5.0,
    warningLow: 5.8,
    goodHigh: 7.0,
    warningHigh: 7.5,
    unit: 'pH',
    idealRange: '5.8 – 7.0'
  },
  soilMoisture: {
    criticalLow: 25.0,
    warningLow: 40.0,
    goodHigh: 70.0,
    warningHigh: 85.0,
    unit: '%',
    idealRange: '40% – 70%'
  }
};

export function evaluateTemperature(val) {
  const value = parseFloat(val);
  if (isNaN(value)) return { status: 'critical', label: 'CRITICAL', score: 30, message: 'Invalid sensor reading.' };

  if (value < SENSOR_THRESHOLDS.temperature.criticalLow) {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Temperature is critically low (below 15°C). Plant growth is severely retarded. Provide cold protection immediately.'
    };
  } else if (value < SENSOR_THRESHOLDS.temperature.warningLow) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Temperature is below preferred range (15°C – 19.9°C). Consider insulating roots or shielding from chill.'
    };
  } else if (value <= SENSOR_THRESHOLDS.temperature.goodHigh) {
    return {
      status: 'good',
      label: 'GOOD',
      score: 100,
      message: 'Temperature is within the optimal range (20°C – 30°C) for healthy plant photosynthesis.'
    };
  } else if (value <= SENSOR_THRESHOLDS.temperature.warningHigh) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Temperature is above preferred range (30.1°C – 35°C). Ensure adequate shading and irrigation.'
    };
  } else {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Temperature is critically high (above 35°C). Severe heat stress detected. Mist foliage and increase watering.'
    };
  }
}

export function evaluateHumidity(val) {
  const value = parseFloat(val);
  if (isNaN(value)) return { status: 'critical', label: 'CRITICAL', score: 30, message: 'Invalid sensor reading.' };

  if (value < SENSOR_THRESHOLDS.humidity.criticalLow) {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Humidity is critically dry (below 35%). Severe transpiration stress. Increase ambient moisture immediately.'
    };
  } else if (value < SENSOR_THRESHOLDS.humidity.warningLow) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Low humidity detected (35% – 49.9%). Monitor leaf wilting and apply light misting.'
    };
  } else if (value <= SENSOR_THRESHOLDS.humidity.goodHigh) {
    return {
      status: 'good',
      label: 'GOOD',
      score: 100,
      message: 'Humidity is optimal (50% – 75%) for balanced plant transpiration.'
    };
  } else if (value <= SENSOR_THRESHOLDS.humidity.warningHigh) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'High humidity detected (75.1% – 85%). Increase airflow to prevent fungal proliferation.'
    };
  } else {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Humidity is critically excessive (above 85%). High fungal infection outbreak risk. Ventilate area immediately.'
    };
  }
}

export function evaluateSoilPH(val) {
  const value = parseFloat(val);
  if (isNaN(value)) return { status: 'critical', label: 'CRITICAL', score: 30, message: 'Invalid sensor reading.' };

  if (value < SENSOR_THRESHOLDS.soilPH.criticalLow) {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Soil is highly acidic (below pH 5.0). Nutrient toxicity and blockage risk. Apply agricultural lime.'
    };
  } else if (value < SENSOR_THRESHOLDS.soilPH.warningLow) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Soil is moderately acidic (pH 5.0 – 5.79). Monitor nutrient intake.'
    };
  } else if (value <= SENSOR_THRESHOLDS.soilPH.goodHigh) {
    return {
      status: 'good',
      label: 'GOOD',
      score: 100,
      message: 'Soil pH is in the preferred range (5.8 – 7.0) for optimal nutrient bioavailability.'
    };
  } else if (value <= SENSOR_THRESHOLDS.soilPH.warningHigh) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Soil is slightly alkaline (pH 7.01 – 7.5). Micronutrient uptake may slow down.'
    };
  } else {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Soil is highly alkaline (above pH 7.5). Iron and phosphorus lockup risk. Add elemental sulfur or organic compost.'
    };
  }
}

export function evaluateSoilMoisture(val) {
  const value = parseFloat(val);
  if (isNaN(value)) return { status: 'critical', label: 'CRITICAL', score: 30, message: 'Invalid sensor reading.' };

  if (value < SENSOR_THRESHOLDS.soilMoisture.criticalLow) {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Soil is severely dry (below 25%). Plant is experiencing root dehydration. Irrigate thoroughly now.'
    };
  } else if (value < SENSOR_THRESHOLDS.soilMoisture.warningLow) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Low soil moisture detected (25% – 39.9%). Water supply needed soon.'
    };
  } else if (value <= SENSOR_THRESHOLDS.soilMoisture.goodHigh) {
    return {
      status: 'good',
      label: 'GOOD',
      score: 100,
      message: 'Soil moisture is optimal (40% – 70%) for healthy root respiration.'
    };
  } else if (value <= SENSOR_THRESHOLDS.soilMoisture.warningHigh) {
    return {
      status: 'warning',
      label: 'WARNING',
      score: 65,
      message: 'Soil moisture is elevated (70.1% – 85%). Hold off further irrigation.'
    };
  } else {
    return {
      status: 'critical',
      label: 'CRITICAL',
      score: 30,
      message: 'Soil is waterlogged (above 85%). Root hypoxia and rot hazard. Improve drainage immediately.'
    };
  }
}

export function evaluateAllSensors(reading) {
  const temp = evaluateTemperature(reading.temperature);
  const hum = evaluateHumidity(reading.humidity);
  const ph = evaluateSoilPH(reading.soilPH);
  const moisture = evaluateSoilMoisture(reading.soilMoisture);

  const results = { temperature: temp, humidity: hum, soilPH: ph, soilMoisture: moisture };
  const overall = calculateOverallHealth(results);
  const score = calculateHealthScore(results);

  return {
    results,
    overall,
    score,
    recommendations: generateRecommendations(results)
  };
}

export function calculateOverallHealth(results) {
  const statuses = [results.temperature.status, results.humidity.status, results.soilPH.status, results.soilMoisture.status];

  if (statuses.includes('critical')) {
    return {
      code: 'CRITICAL',
      title: 'CRITICAL CONDITION',
      badgeClass: 'badge-critical',
      icon: '🔴',
      description: 'Immediate corrective action required. One or more environmental parameters have breached critical thresholds.'
    };
  } else if (statuses.includes('warning')) {
    return {
      code: 'WARNING',
      title: 'ATTENTION REQUIRED',
      badgeClass: 'badge-warning',
      icon: '🟡',
      description: 'Environmental parameters require adjustment to restore optimal crop growing conditions.'
    };
  } else {
    return {
      code: 'HEALTHY',
      title: 'HEALTHY',
      badgeClass: 'badge-good',
      icon: '🟢',
      description: 'Environmental conditions are currently favorable for healthy plant growth and maximum yield potential.'
    };
  }
}

export function calculateHealthScore(results) {
  const scores = [results.temperature.score, results.humidity.score, results.soilPH.score, results.soilMoisture.score];
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / scores.length);
}

function generateRecommendations(results) {
  const list = [];
  Object.keys(results).forEach(key => {
    if (results[key].status !== 'good') {
      list.push(results[key].message);
    }
  });
  if (list.length === 0) {
    list.push('All environmental metrics are optimal. Continue standard monitoring and care routine.');
  }
  return list;
}
