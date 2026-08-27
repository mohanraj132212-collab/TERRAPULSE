/* TerraPulse Header & First-Letter Avatar Controller */

import { getCurrentUser, getUserAvatarInitial, LOCAL_STORAGE_KEYS } from './firebase-config.js';
import { showToast } from './notifications.js';

export function initNavigation(activePageId = 'dashboard') {
  const user = getCurrentUser();

  // Set Profile Circular Avatar Initial (e.g. "M" for "Mohan")
  const avatarElements = document.querySelectorAll('.user-avatar-circle');
  const initial = getUserAvatarInitial(user);

  avatarElements.forEach(el => {
    el.textContent = initial;
  });

  // Highlight Active Header Link
  const navLinks = document.querySelectorAll('.app-nav-link');
  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === activePageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Logout Handler
  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      showToast('Signed out successfully.', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    });
  });
}
