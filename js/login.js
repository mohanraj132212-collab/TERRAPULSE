/* TerraPulse Simple Login Controller */

import { handleLogin } from './auth.js';

export function initLoginPage() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const pwdInput = document.getElementById('password');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = pwdInput ? pwdInput.value : '';

      handleLogin(email, password, true);
    });
  }
}
