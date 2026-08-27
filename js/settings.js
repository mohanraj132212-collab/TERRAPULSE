/* TerraPulse Settings Page Controller */

import { LOCAL_STORAGE_KEYS } from './firebase-config.js';
import { showToast } from './notifications.js';

export function initSettingsPage() {
  const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS) || '{}');

  const emailToggle = document.getElementById('setting-email-alerts');
  const cropSelect = document.getElementById('setting-crop-profile');

  if (emailToggle) {
    emailToggle.checked = settings.emailAlerts !== false;
    emailToggle.addEventListener('change', (e) => {
      settings.emailAlerts = e.target.checked;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      showToast(`Automated email alerts ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
    });
  }

  if (cropSelect) {
    cropSelect.value = settings.cropProfile || 'general';
    cropSelect.addEventListener('change', (e) => {
      settings.cropProfile = e.target.value;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      showToast(`Threshold configuration profile set to: ${e.target.options[e.target.selectedIndex].text}`, 'success');
    });
  }
}
