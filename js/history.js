/* TerraPulse Scan History Controller */

import { getDiseaseScansHistory } from './firestore.js';

export async function initHistoryPage() {
  const historyGrid = document.getElementById('history-cards-grid');
  const searchInput = document.getElementById('history-search-input');
  const filterSelect = document.getElementById('history-filter-select');

  const history = await getDiseaseScansHistory();

  renderHistoryCards(history, historyGrid);

  if (searchInput) {
    searchInput.addEventListener('input', () => filterAndRenderHistory(history, searchInput.value, filterSelect.value, historyGrid));
  }
  if (filterSelect) {
    filterSelect.addEventListener('change', () => filterAndRenderHistory(history, searchInput.value, filterSelect.value, historyGrid));
  }
}

function renderHistoryCards(items, container) {
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">No disease scans found. Scan a leaf to get started!</div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="history-card" onclick="viewHistoryDetail('${item.id}')">
      <img src="${item.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80'}" class="history-card-img" alt="${item.diseaseName}" />
      <div class="history-card-body">
        <div class="history-card-date">${new Date(item.timestamp).toLocaleDateString()} ${new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div class="history-card-title">${item.diseaseName}</div>
        <div class="history-card-meta">
          <span class="badge ${item.severityBadge || 'badge-warning'}">${item.severity || 'Moderate'}</span>
          <span style="font-weight: 700; color: var(--color-primary);">${item.confidence}% Conf.</span>
        </div>
      </div>
    </div>
  `).join('');
}

function filterAndRenderHistory(allHistory, query, filterVal, container) {
  let filtered = allHistory;
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(item => item.diseaseName.toLowerCase().includes(q) || item.problem.toLowerCase().includes(q));
  }
  if (filterVal && filterVal !== 'all') {
    filtered = filtered.filter(item => item.severity.toLowerCase() === filterVal.toLowerCase() || item.diseaseName.toLowerCase() === filterVal.toLowerCase());
  }
  renderHistoryCards(filtered, container);
}

window.viewHistoryDetail = function(id) {
  getDiseaseScansHistory().then(scans => {
    const found = scans.find(s => s.id === id);
    if (found) {
      sessionStorage.setItem('current_scan_result', JSON.stringify({
        scanResult: found,
        envConditions: { temperature: found.temperature, humidity: found.humidity, soilPH: found.soilPH, soilMoisture: found.soilMoisture }
      }));
      window.location.href = 'disease-result.html';
    }
  });
};
