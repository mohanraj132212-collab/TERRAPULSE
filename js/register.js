/* TerraPulse Real Registration & OTP Controller */

import { sendEmailOTP, verifyEmailOTP } from './email-service.js';
import { createFirebaseAuthAccount } from './auth.js';
import { getUserAvatarInitial } from './firebase-config.js';
import { showToast } from './notifications.js';

let isEmailOTPVerified = false;

function validateEmailFormat(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

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

  // STEP 1: Click "Send OTP"
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      const name = nameInput ? nameInput.value.trim() : '';
      const mobile = mobileInput ? mobileInput.value.trim() : '';

      if (!name) {
        showToast('Please enter your name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }
      if (!mobile) {
        showToast('Please enter your mobile number.', 'error');
        if (mobileInput) mobileInput.focus();
        return;
      }
      if (!email) {
        showToast('Please enter your email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }
      if (!validateEmailFormat(email)) {
        showToast('Please enter a valid email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      sendOtpBtn.disabled = true;
      const originalText = sendOtpBtn.textContent;
      sendOtpBtn.textContent = 'Sending OTP...';

      try {
        const result = await sendEmailOTP(email);
        showToast(result.message || 'OTP sent to your email.', 'success');

        if (otpGroup) otpGroup.style.display = 'block';
        sendOtpBtn.textContent = 'Resend OTP';
        sendOtpBtn.disabled = false;
      } catch (err) {
        console.error('Send OTP Error:', err);
        showToast(err.message || 'Unable to send OTP. Please check your network connection.', 'error');
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = originalText;
      }
    });
  }

  // STEP 2: Click "Verify OTP"
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const enteredOtp = otpInput ? otpInput.value.trim() : '';

      if (!enteredOtp) {
        showToast('Please enter the 6-digit OTP code sent to your email.', 'error');
        if (otpInput) otpInput.focus();
        return;
      }

      verifyOtpBtn.disabled = true;
      const origText = verifyOtpBtn.textContent;
      verifyOtpBtn.textContent = 'Verifying...';

      const res = verifyEmailOTP(enteredOtp);

      if (res.success) {
        isEmailOTPVerified = true;
        showToast('Email verified successfully.', 'success');

        // Unlock password section
        if (passwordSection) passwordSection.style.display = 'block';
        if (createAccountBtn) createAccountBtn.disabled = false;

        // Freeze fields & set verified button state
        if (nameInput) nameInput.disabled = true;
        if (mobileInput) mobileInput.disabled = true;
        if (emailInput) emailInput.disabled = true;
        if (otpInput) otpInput.disabled = true;
        if (sendOtpBtn) sendOtpBtn.disabled = true;

        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = '✓ Email Verified';
        verifyOtpBtn.style.backgroundColor = '#16a34a';
      } else {
        showToast(res.message || 'Invalid or expired OTP.', 'error');
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = origText;
      }
    });
  }

  // STEP 3: Click "Create Account"
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!isEmailOTPVerified) {
        showToast('You must verify your email OTP before creating an account.', 'warning');
        return;
      }

      const fullName = nameInput ? nameInput.value.trim() : '';
      const mobile = mobileInput ? mobileInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = pwdInput ? pwdInput.value : '';
      const confirmPassword = confirmPwdInput ? confirmPwdInput.value : '';

      if (!password) {
        showToast('Please enter your password.', 'error');
        if (pwdInput) pwdInput.focus();
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'warning');
        if (pwdInput) pwdInput.focus();
        return;
      }
      if (!confirmPassword) {
        showToast('Please confirm your password.', 'error');
        if (confirmPwdInput) confirmPwdInput.focus();
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      // Visual feedback: Disable button and show "Creating account..."
      if (createAccountBtn) {
        createAccountBtn.disabled = true;
        createAccountBtn.textContent = 'Creating account...';
      }

      try {
        const userProfile = await createFirebaseAuthAccount(fullName, mobile, email, password);
        const avatarLetter = getUserAvatarInitial(userProfile);

        showToast(`Account created successfully! Welcome, ${fullName}.`, 'success');

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (err) {
        console.error('Firebase Auth Create Account Error:', err);

        let userMsg = 'Unable to create account. Please try again.';
        if (err.code === 'auth/email-already-in-use') {
          userMsg = 'This email address is already registered. Please login.';
        } else if (err.code === 'auth/invalid-email') {
          userMsg = 'Invalid email address format.';
        } else if (err.code === 'auth/weak-password') {
          userMsg = 'Password is too weak. Please use at least 6 characters.';
        }

        showToast(userMsg, 'error');

        if (createAccountBtn) {
          createAccountBtn.disabled = false;
          createAccountBtn.textContent = 'Create Account';
        }
      }
    });
  }
}
