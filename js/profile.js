/* TerraPulse Profile Controller */

import { getCurrentUser, setCurrentUser } from './firebase-config.js';
import { showToast } from './notifications.js';

export function initProfilePage() {
  const user = getCurrentUser();

  const nameInput = document.getElementById('profile-name');
  const mobileInput = document.getElementById('profile-mobile');
  const emailInput = document.getElementById('profile-email');
  const dateEl = document.getElementById('profile-created-date');
  const form = document.getElementById('profile-form');

  if (nameInput) nameInput.value = user.name || '';
  if (mobileInput) mobileInput.value = user.mobile || '';
  if (emailInput) emailInput.value = user.email || '';
  if (dateEl) dateEl.textContent = new Date(user.createdAt || Date.now()).toLocaleDateString();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      user.name = nameInput.value.trim();
      user.mobile = mobileInput.value.trim();
      setCurrentUser(user);
      showToast('Profile information updated!', 'success');
    });
  }
}
