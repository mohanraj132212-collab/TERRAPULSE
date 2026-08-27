/* TerraPulse Real-Time Continuous Monitoring Controller */

import { evaluateAllSensors } from './sensor-data.js';

let monitoringInterval = null;

export function initMonitoringPage() {
  let currentReadings = {
    temperature: 28.4,
    humidity: 67,
    soilPH: 6.5,
    soilMoisture: 54
  };

  renderMonitoringStream(currentReadings);

  // Live Stream Toggle Switch
  const streamToggle = document.getElementById('toggle-live-stream');
  if (streamToggle) {
    streamToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        startLiveSimulatedStream(currentReadings);
      } else {
        stopLiveStream();
      }
    });
  }

  // Preset quick parameter testing buttons
  const btnNormal = document.getElementById('btn-preset-normal');
  const btnWarning = document.getElementById('btn-preset-warning');
  const btnCritical = document.getElementById('btn-preset-critical');

  if (btnNormal) {
    btnNormal.addEventListener('click', () => {
      currentReadings = { temperature: 26.5, humidity: 65, soilPH: 6.4, soilMoisture: 55 };
      renderMonitoringStream(currentReadings);
      addTimelineEntry('System Preset: Optimal environmental parameters loaded.');
    });
  }
  if (btnWarning) {
    btnWarning.addEventListener('click', () => {
      currentReadings = { temperature: 18.2, humidity: 78, soilPH: 5.4, soilMoisture: 35 };
      renderMonitoringStream(currentReadings);
      addTimelineEntry('System Preset: Warning condition simulated (Low temp & pH).');
    });
  }
  if (btnCritical) {
    btnCritical.addEventListener('click', () => {
      currentReadings = { temperature: 38.5, humidity: 92, soilPH: 4.6, soilMoisture: 18 };
      renderMonitoringStream(currentReadings);
      addTimelineEntry('System Preset: Critical condition simulated (Heat & drought stress).');
    });
  }
}

function renderMonitoringStream(readings) {
  const analysis = evaluateAllSensors(readings);
  const { results, overall } = analysis;

  updateProgressCard('temp', readings.temperature, '°C', results.temperature, 0, 45);
  updateProgressCard('hum', readings.humidity, '%', results.humidity, 0, 100);
  updateProgressCard('ph', readings.soilPH, ' pH', results.soilPH, 0, 14);
  updateProgressCard('moist', readings.soilMoisture, '%', results.soilMoisture, 0, 100);

  const statusHeader = document.getElementById('monitoring-live-status');
  if (statusHeader) {
    statusHeader.className = `badge ${overall.badgeClass}`;
    statusHeader.innerHTML = `${overall.icon} ${overall.title}`;
  }

  const lastScanEl = document.getElementById('last-updated-time');
  if (lastScanEl) {
    lastScanEl.textContent = new Date().toLocaleTimeString();
  }
}

function updateProgressCard(id, val, unit, evalRes, minVal, maxVal) {
  const valEl = document.getElementById(`mon-val-${id}`);
  const fillEl = document.getElementById(`mon-fill-${id}`);
  const badgeEl = document.getElementById(`mon-badge-${id}`);

  if (valEl) valEl.textContent = `${val}${unit}`;
  if (fillEl) {
    const percent = Math.min(Math.max(((val - minVal) / (maxVal - minVal)) * 100, 5), 100);
    fillEl.style.width = `${percent}%`;
    if (evalRes.status === 'critical') fillEl.style.backgroundColor = 'var(--color-status-critical)';
    else if (evalRes.status === 'warning') fillEl.style.backgroundColor = 'var(--color-status-warning)';
    else fillEl.style.backgroundColor = 'var(--color-primary)';
  }
  if (badgeEl) {
    badgeEl.className = `badge ${evalRes.status === 'good' ? 'badge-good' : (evalRes.status === 'warning' ? 'badge-warning' : 'badge-critical')}`;
    badgeEl.textContent = evalRes.label;
  }
}

function startLiveSimulatedStream(currentReadings) {
  if (monitoringInterval) clearInterval(monitoringInterval);
  monitoringInterval = setInterval(() => {
    // Apply small random sensor variance
    currentReadings.temperature = +(currentReadings.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1);
    currentReadings.humidity = Math.min(100, Math.max(20, +(currentReadings.humidity + (Math.random() * 1.0 - 0.5)).toFixed(1)));
    currentReadings.soilMoisture = Math.min(100, Math.max(10, +(currentReadings.soilMoisture + (Math.random() * 0.8 - 0.4)).toFixed(1)));

    renderMonitoringStream(currentReadings);
    if (Math.random() > 0.7) {
      addTimelineEntry(`Live Telemetry: Sensor update logged. Temp: ${currentReadings.temperature}°C, Hum: ${currentReadings.humidity}%`);
    }
  }, 3000);
}

function stopLiveStream() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
}

function addTimelineEntry(text) {
  const timeline = document.getElementById('activity-timeline-list');
  if (!timeline) return;
  const item = document.createElement('div');
  item.className = 'timeline-item';
  item.innerHTML = `
    <div class="timeline-node"></div>
    <div class="timeline-time">${new Date().toLocaleTimeString()}</div>
    <div class="timeline-text">${text}</div>
  `;
  timeline.insertBefore(item, timeline.firstChild);
}
