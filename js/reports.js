/* TerraPulse Analytics Reports Controller */

import { getDiseaseScansHistory } from './firestore.js';
import { showToast } from './notifications.js';

export async function initReportsPage() {
  const scans = await getDiseaseScansHistory();

  // Calculate Metrics
  const totalScans = scans.length;
  const healthyScans = scans.filter(s => s.diseaseName.toLowerCase().includes('healthy')).length;
  const diseasedScans = totalScans - healthyScans;
  const healthyRate = totalScans > 0 ? Math.round((healthyScans / totalScans) * 100) : 100;

  const totalEl = document.getElementById('report-total-scans');
  const healthyEl = document.getElementById('report-healthy-scans');
  const diseaseEl = document.getElementById('report-diseased-scans');
  const rateEl = document.getElementById('report-healthy-rate');

  if (totalEl) totalEl.textContent = totalScans;
  if (healthyEl) healthyEl.textContent = healthyScans;
  if (diseaseEl) diseaseEl.textContent = diseasedScans;
  if (rateEl) rateEl.textContent = `${healthyRate}%`;

  // Draw HTML5 Canvas Visualizations
  renderDiseaseDistributionChart('disease-pie-canvas', scans);
  renderHealthTrendChart('trend-bar-canvas');

  // Export Report Button
  const exportBtn = document.getElementById('btn-export-pdf');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const csvBtn = document.getElementById('btn-export-csv');
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      downloadCSVReport(scans);
    });
  }
}

function renderDiseaseDistributionChart(canvasId, scans) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 240;

  // Disease frequency count
  const counts = {};
  scans.forEach(s => {
    counts[s.diseaseName] = (counts[s.diseaseName] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const colors = ['#16A34A', '#EAB308', '#EF4444', '#3B82F6', '#8B5CF6'];

  let total = data.reduce((a, b) => a + b, 0);
  if (total === 0) total = 1;

  let startAngle = 0;
  const centerX = 150;
  const centerY = 120;
  const radius = 80;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < data.length; i++) {
    const sliceAngle = (data[i] / total) * 2 * Math.PI;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    startAngle += sliceAngle;
  }

  // Inner Donut Hole
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-card').trim() || '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
  ctx.fill();
}

function renderHealthTrendChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 240;

  const scores = [88, 92, 85, 96, 91, 94, 98];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = 24;
  const gap = 14;
  const startX = 20;

  for (let i = 0; i < scores.length; i++) {
    const h = (scores[i] / 100) * 160;
    const x = startX + i * (barWidth + gap);
    const y = 200 - h;

    ctx.fillStyle = '#16A34A';
    ctx.fillRect(x, y, barWidth, h);

    ctx.fillStyle = '#6B7280';
    ctx.font = '10px sans-serif';
    ctx.fillText(labels[i], x + 2, 215);
  }
}

function downloadCSVReport(scans) {
  let csv = 'Scan ID,Disease Name,Confidence %,Severity,Date\n';
  scans.forEach(s => {
    csv += `"${s.id}","${s.diseaseName}","${s.confidence}%","${s.severity}","${new Date(s.timestamp).toLocaleDateString()}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TerraPulse_Health_Report_${Date.now()}.csv`;
  a.click();
  showToast('Report CSV downloaded successfully.', 'success');
}
