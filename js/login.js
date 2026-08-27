/* TerraPulse Login Controller */

import { handleLogin } from './auth.js';

export function initLoginPage() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : true;

      handleLogin(email, password, remember);
    });
  }
}
