/* TerraPulse Forgot Password Controller */

import { showToast } from './notifications.js';

export function initForgotPasswordPage() {
  const form = document.getElementById('forgot-password-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      if (!email) {
        showToast('Please enter your registered email address.', 'error');
        return;
      }
      showToast('Password reset link has been dispatched to your email.', 'success', 5000);
    });
  }
}
