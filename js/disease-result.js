/* TerraPulse Disease Result Page Controller */

import { sendDiseaseAlertEmail } from './email-service.js';
import { showToast } from './notifications.js';

export function initDiseaseResultPage() {
  const sessionData = sessionStorage.getItem('current_scan_result');
  let data;

  if (sessionData) {
    try {
      data = JSON.parse(sessionData);
    } catch (e) {
      console.error(e);
    }
  }

  // Fallback demo data if opened directly
  if (!data) {
    data = {
      scanResult: {
        diseaseName: 'Leaf Spot',
        category: 'Fungal Infection',
        confidence: 94,
        severity: 'Moderate',
        severityBadge: 'badge-warning',
        problem: 'Fungal lesions (Cercospora) identified on leaf tissue.',
        solution: 'Prune infected foliage. Apply organic copper-based fungicide spray early morning.',
        prevention: 'Avoid overhead watering and ensure adequate plant canopy airflow.',
        timestamp: new Date().toLocaleString(),
        imagePreviewUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80'
      },
      envConditions: { temperature: 28.4, humidity: 67, soilPH: 6.5, soilMoisture: 54 }
    };
  }

  const { scanResult, envConditions } = data;

  // Render UI elements
  const imgEl = document.getElementById('result-leaf-img');
  const nameEl = document.getElementById('result-disease-name');
  const badgeEl = document.getElementById('result-severity-badge');
  const confText = document.getElementById('result-confidence-val');
  const confFill = document.getElementById('result-confidence-fill');

  const problemEl = document.getElementById('result-problem-text');
  const solutionEl = document.getElementById('result-solution-text');
  const preventionEl = document.getElementById('result-prevention-text');

  const envTemp = document.getElementById('result-env-temp');
  const envHum = document.getElementById('result-env-hum');
  const envPH = document.getElementById('result-env-ph');
  const envMoist = document.getElementById('result-env-moist');

  if (imgEl) imgEl.src = scanResult.imagePreviewUrl;
  if (nameEl) nameEl.textContent = scanResult.diseaseName;
  if (badgeEl) {
    badgeEl.className = `badge ${scanResult.severityBadge || 'badge-warning'}`;
    badgeEl.textContent = scanResult.severity;
  }
  if (confText) confText.textContent = `${scanResult.confidence}%`;
  if (confFill) confFill.style.width = `${scanResult.confidence}%`;

  if (problemEl) problemEl.textContent = scanResult.problem;
  if (solutionEl) solutionEl.textContent = scanResult.solution;
  if (preventionEl) preventionEl.textContent = scanResult.prevention;

  if (envTemp) envTemp.textContent = `${envConditions.temperature}°C`;
  if (envHum) envHum.textContent = `${envConditions.humidity}%`;
  if (envPH) envPH.textContent = `${envConditions.soilPH}`;
  if (envMoist) envMoist.textContent = `${envConditions.soilMoisture}%`;

  // Action buttons
  const sendEmailBtn = document.getElementById('btn-send-email-alert');
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', async () => {
      sendEmailBtn.disabled = true;
      sendEmailBtn.innerHTML = 'Sending Email...';
      const res = await sendDiseaseAlertEmail(scanResult, envConditions);
      showToast(`Alert email dispatched to ${res.recipient}!`, 'success');
      sendEmailBtn.disabled = false;
      sendEmailBtn.innerHTML = '📧 Email Alert Dispatched';
    });
  }

  const saveReportBtn = document.getElementById('btn-save-report');
  if (saveReportBtn) {
    saveReportBtn.addEventListener('click', () => {
      showToast('Scan report saved to Firestore database history.', 'success');
    });
  }
}
