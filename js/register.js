/* TerraPulse Step-by-Step Registration & EmailJS OTP Controller */

import { sendEmailOTP, verifyEmailOTP } from './email-service.js';
import { setCurrentUser, getUserAvatarInitial } from './firebase-config.js';
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
        showToast('Please enter a valid email address (e.g., name@example.com).', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      // Visual feedback: Disable button and show "Sending OTP..."
      sendOtpBtn.disabled = true;
      const originalText = sendOtpBtn.textContent;
      sendOtpBtn.textContent = 'Sending OTP...';

      try {
        const result = await sendEmailOTP(email);

        if (result.success) {
          showToast('OTP sent to your email.', 'success');
          if (otpGroup) otpGroup.style.display = 'block';
          sendOtpBtn.textContent = 'Resend OTP';
          sendOtpBtn.disabled = false;
        } else {
          showToast(result.message || 'Failed to send OTP. Please try again.', 'error');
          sendOtpBtn.disabled = false;
          sendOtpBtn.textContent = originalText;
        }
      } catch (err) {
        console.error('Send OTP Error:', err);
        showToast('Unable to send OTP email. Please try again.', 'error');
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
        showToast('Email verified successfully!', 'success');

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
        showToast(res.message || 'Invalid OTP code. Please try again.', 'error');
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = origText;
      }
    });
  }

  // STEP 3: Click "Create Account"
  if (form) {
    form.addEventListener('submit', (e) => {
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
      if (!confirmPassword) {
        showToast('Please confirm your password.', 'error');
        if (confirmPwdInput) confirmPwdInput.focus();
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      // Visual feedback: Disable button and show "Creating Account..."
      if (createAccountBtn) {
        createAccountBtn.disabled = true;
        createAccountBtn.textContent = 'Creating Account...';
      }

      try {
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
        }, 800);
      } catch (err) {
        console.error('Account Creation Error:', err);
        showToast('Unable to create account. Please try again.', 'error');
        if (createAccountBtn) {
          createAccountBtn.disabled = false;
          createAccountBtn.textContent = 'Create Account';
        }
      }
    });
  }
}
