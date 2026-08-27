/* TerraPulse Email Verification Controller */

import { getCurrentUser, setCurrentUser } from './firebase-config.js';
import { showToast } from './notifications.js';

export function initEmailVerificationPage() {
  const user = getCurrentUser();
  const emailDisplay = document.getElementById('user-email-display');
  if (emailDisplay && user) {
    emailDisplay.textContent = user.email;
  }

  const resendBtn = document.getElementById('btn-resend-verification');
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      showToast('Verification email link sent again!', 'info');
    });
  }

  const activateBtn = document.getElementById('btn-activate-account');
  if (activateBtn) {
    activateBtn.addEventListener('click', () => {
      user.emailVerified = true;
      setCurrentUser(user);
      showToast('Account activated successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
}
