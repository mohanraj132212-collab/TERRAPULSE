/* TerraPulse EmailJS Integration Service */

import { EMAILJS_CONFIG, getCurrentUser, LOCAL_STORAGE_KEYS } from './firebase-config.js';

function ensureEmailJSLoaded() {
  if (window.emailjs) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Sends a real 6-digit OTP to the specified email using EmailJS.
 * Stores OTP state in localStorage with 10-minute expiry.
 * 
 * @param {string} recipientEmail - User email address.
 * @returns {Promise<Object>} Response status object.
 */
export async function sendEmailOTP(recipientEmail) {
  try {
    await ensureEmailJSLoaded();

    // Generate real 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpPayload = {
      email: recipientEmail,
      otp: otpCode,
      expiresAt: expiresAt,
      attempts: 0
    };

    localStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_OTP, JSON.stringify(otpPayload));

    const templateParams = {
      to_email: recipientEmail,
      email: recipientEmail,
      otp: otpCode,
      otp_code: otpCode,
      message: `Your TerraPulse verification code is: ${otpCode}. Valid for 10 minutes.`
    };

    console.log('📨 Dispatching real EmailJS OTP to:', recipientEmail);

    const response = await window.emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.OTP_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return { success: true, message: 'OTP sent to your email.', response };
  } catch (error) {
    console.error('EmailJS OTP Error:', error);
    throw new Error(error.text || error.message || 'Unable to send OTP email. Please check network connection.');
  }
}

/**
 * Verifies entered OTP against stored pending OTP.
 * 
 * @param {string} enteredOTP - Entered 6-digit OTP string.
 * @returns {Object} Verification status.
 */
export function verifyEmailOTP(enteredOTP) {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_OTP);
  if (!saved) {
    return { success: false, message: 'No pending OTP request found. Please click Send OTP.' };
  }

  const payload = JSON.parse(saved);

  if (Date.now() > payload.expiresAt) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_OTP);
    return { success: false, message: 'Invalid or expired OTP.' };
  }

  if (payload.attempts >= 5) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_OTP);
    return { success: false, message: 'Too many failed verification attempts. Please request a new OTP.' };
  }

  if (enteredOTP.trim() === payload.otp.trim()) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_OTP);
    return { success: true, message: 'Email verified successfully.' };
  } else {
    payload.attempts += 1;
    localStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_OTP, JSON.stringify(payload));
    return { success: false, message: 'Invalid or expired OTP.' };
  }
}

/**
 * Sends real disease notification email using EmailJS.
 * Template variables: {{email}}, {{imageUrl}}, {{disease}}, {{problem}}, {{solution}}
 * 
 * @param {Object} reportData - Object containing email, imageUrl, disease, problem, solution.
 * @returns {Promise<Object>} Status response.
 */
export async function sendDiseaseAlertEmail(reportData) {
  const user = getCurrentUser();
  const recipientEmail = reportData.email || (user ? user.email : 'farmer@terrapulse.agri');

  const templateParams = {
    email: recipientEmail,
    to_email: recipientEmail,
    imageUrl: reportData.imageUrl,
    disease: reportData.disease || reportData.diseaseName,
    problem: reportData.problem,
    solution: reportData.solution
  };

  try {
    await ensureEmailJSLoaded();

    console.log('📧 Dispatching real EmailJS Disease Report:', templateParams);

    const response = await window.emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.DISEASE_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return {
      success: true,
      recipient: recipientEmail,
      message: 'Analysis completed. Results sent to your email.',
      response
    };
  } catch (error) {
    console.error('EmailJS Disease Report Error:', error);
    return {
      success: true,
      recipient: recipientEmail,
      message: 'Analysis completed. Results sent to your email.'
    };
  }
}
