/* TerraPulse Authentication Controller */

import { getCurrentUser, setCurrentUser } from './firebase-config.js';
import { showToast } from './notifications.js';

export function checkAuthGuard(requireAuth = true) {
  const user = getCurrentUser();
  const path = window.location.pathname;

  if (requireAuth && !user) {
    window.location.href = 'login.html';
  }
}

export function handleLogin(email, password, rememberMe = true) {
  if (!email || !password) {
    showToast('Please enter both email and password.', 'error');
    return false;
  }

  const user = {
    uid: 'usr_' + Math.random().toString(36).substring(2, 9),
    email: email,
    name: email.split('@')[0].replace('.', ' '),
    mobile: '+91 98765 43210',
    emailVerified: true,
    createdAt: new Date().toISOString()
  };

  setCurrentUser(user);
  showToast('Signed in successfully! Redirecting...', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);

  return true;
}
