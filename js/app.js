/* TerraPulse Application Entry Bootstrap Script */

import { initNavigation } from './navigation.js';
import { checkAuthGuard } from './auth.js';
import { initRegisterPage } from './register.js';
import { initLoginPage } from './login.js';
import { initDashboard } from './dashboard.js';
import { initCameraPage } from './camera.js';
import { initHistoryPage } from './history.js';

document.addEventListener('DOMContentLoaded', () => {
  const pageId = document.body.getAttribute('data-page') || 'landing';

  // Public Unauthenticated Pages
  const publicPages = ['landing', 'login', 'register'];

  if (!publicPages.includes(pageId)) {
    checkAuthGuard(true);
    initNavigation(pageId);
  } else {
    initNavigation(pageId);
  }

  // Page Specific Initializers
  switch (pageId) {
    case 'register':
      initRegisterPage();
      break;
    case 'login':
      initLoginPage();
      break;
    case 'dashboard':
      initDashboard();
      break;
    case 'camera':
      initCameraPage();
      break;
    case 'history':
      initHistoryPage();
      break;
  }
});
