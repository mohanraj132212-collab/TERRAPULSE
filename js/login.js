/* TerraPulse Real Firebase Login Controller */

import { loginFirebaseAuthUser } from './auth.js';
import { showToast } from './notifications.js';

export function initLoginPage() {
  const form = document.getElementById('login-form');
  const loginBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const pwdInput = document.getElementById('password');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = pwdInput ? pwdInput.value : '';

      if (!email) {
        showToast('Please enter your email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }
      if (!password) {
        showToast('Please enter your password.', 'error');
        if (pwdInput) pwdInput.focus();
        return;
      }

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
      }

      try {
        const user = await loginFirebaseAuthUser(email, password);
        showToast(`Welcome back, ${user.name}!`, 'success');

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (err) {
        console.error('Firebase Auth Login Error:', err);

        let userMsg = 'Login failed. Please check your credentials.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          userMsg = 'Invalid email address or password.';
        } else if (err.code === 'auth/invalid-email') {
          userMsg = 'Invalid email address format.';
        } else if (err.code === 'auth/too-many-requests') {
          userMsg = 'Access disabled due to many failed login attempts. Please try again later.';
        }

        showToast(userMsg, 'error');

        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Login';
        }
      }
    });
  }
}
