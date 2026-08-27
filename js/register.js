/* TerraPulse Step-by-Step Registration & EmailJS OTP Controller */

import { sendEmailOTP, verifyEmailOTP } from './email-service.js';
import { setCurrentUser, getUserAvatarInitial } from './firebase-config.js';
import { showToast } from './notifications.js';

let isEmailOTPVerified = false;

export function initRegisterPage() {
  const form = document.getElementById('register-form');
  const sendOtpBtn = document.getElementById('btn-send-otp');
  const verifyOtpBtn = document.getElementById('btn-verify-otp');
  const createAccountBtn = document.getElementById('btn-create-account');

  const otpGroup = document.getElementById('otp-group');
  const passwordSection = document.getElementById('password-section');

  const nameInput = document.getElementById('full-name');
  const mobileInput = document.getElementById('mobile');
  const emailInput = document.getElementById('email');
  const otpInput = document.getElementById('otp-input');

  const pwdInput = document.getElementById('password');
  const confirmPwdInput = document.getElementById('confirm-password');

  // Step 1: Click "Send OTP"
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const name = nameInput.value.trim();
      const mobile = mobileInput.value.trim();

      if (!name || !mobile || !email) {
        showToast('Please enter Name, Mobile Number, and Email first.', 'error');
        return;
      }

      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = 'Sending OTP...';

      const result = await sendEmailOTP(email);

      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Resend OTP';

      if (result.success) {
        showToast(result.message, 'success');
        if (otpGroup) otpGroup.style.display = 'flex';
      } else {
        showToast(result.message, 'error');
      }
    });
  }

  // Step 2: Click "Verify OTP"
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const enteredOtp = otpInput.value.trim();

      if (!enteredOtp) {
        showToast('Please enter the 6-digit OTP code sent to your email.', 'error');
        return;
      }

      const res = verifyEmailOTP(enteredOtp);

      if (res.success) {
        isEmailOTPVerified = true;
        showToast(res.message, 'success');

        // Unlock password section
        if (passwordSection) passwordSection.style.display = 'block';
        if (createAccountBtn) createAccountBtn.disabled = false;

        // Freeze email & OTP inputs
        emailInput.disabled = true;
        otpInput.disabled = true;
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = '✓ Verified';
      } else {
        showToast(res.message, 'error');
      }
    });
  }

  // Step 3: Click "Create Account"
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!isEmailOTPVerified) {
        showToast('You must verify your email OTP before creating an account.', 'warning');
        return;
      }

      const fullName = nameInput.value.trim();
      const mobile = mobileInput.value.trim();
      const email = emailInput.value.trim();
      const password = pwdInput.value;
      const confirmPassword = confirmPwdInput.value;

      if (!password || !confirmPassword) {
        showToast('Please enter and confirm your password.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      const user = {
        uid: 'usr_' + Date.now(),
        name: fullName,
        email: email,
        mobile: mobile,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };

      setCurrentUser(user);
      const initial = getUserAvatarInitial(user);

      showToast(`Account created successfully! Welcome, ${fullName}.`, 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
}
