/* TerraPulse Main Application Dashboard (Ref Image 3) */

import { evaluateAllSensors } from './sensor-data.js';

export function initDashboard() {
  const tempInput = document.getElementById('manual-input-temp');
  const humInput = document.getElementById('manual-input-hum');
  const phInput = document.getElementById('manual-input-ph');
  const moistInput = document.getElementById('manual-input-moist');

  // Initial Values
  let readings = {
    temperature: tempInput ? parseFloat(tempInput.value) || 28.4 : 28.4,
    humidity: humInput ? parseFloat(humInput.value) || 67 : 67,
    soilPH: phInput ? parseFloat(phInput.value) || 6.5 : 6.5,
    soilMoisture: moistInput ? parseFloat(moistInput.value) || 54 : 54
  };

  renderDashboardState(readings);

  // Input Event Listeners for Manual Entry
  [tempInput, humInput, phInput, moistInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        readings = {
          temperature: parseFloat(tempInput.value) || 0,
          humidity: parseFloat(humInput.value) || 0,
          soilPH: parseFloat(phInput.value) || 0,
          soilMoisture: parseFloat(moistInput.value) || 0
        };
        renderDashboardState(readings);
      });
    }
  });
}

export function renderDashboardState(readings) {
  const analysis = evaluateAllSensors(readings);
  const { results, overall, score } = analysis;

  // 1. Update Gauge Percentage Text & Ring
  const gaugeVal = document.getElementById('gauge-score-val');
  const gaugeFill = document.getElementById('gauge-ring-fill');

  if (gaugeVal) gaugeVal.textContent = `${score}%`;
  if (gaugeFill) {
    const circumference = 440;
    const offset = circumference - (score / 100) * circumference;
    gaugeFill.style.strokeDashoffset = offset;
    if (score < 50) gaugeFill.style.stroke = '#ef4444';
    else if (score < 80) gaugeFill.style.stroke = '#eab308';
    else gaugeFill.style.stroke = '#16a34a';
  }

  // 2. Update Condition Badges (Good, Bad, Normal)
  const pillGood = document.getElementById('pill-good');
  const pillBad = document.getElementById('pill-bad');
  const pillNormal = document.getElementById('pill-normal');

  [pillGood, pillBad, pillNormal].forEach(p => p && p.classList.remove('active-good', 'active-bad', 'active-normal'));

  if (overall.code === 'HEALTHY') {
    if (pillGood) pillGood.classList.add('active-good');
  } else if (overall.code === 'CRITICAL') {
    if (pillBad) pillBad.classList.add('active-bad');
  } else {
    if (pillNormal) pillNormal.classList.add('active-normal');
  }
}
