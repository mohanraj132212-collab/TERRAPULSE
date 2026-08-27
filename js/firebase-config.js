/* TerraPulse Centralized Service & API Configuration */

export const EMAILJS_CONFIG = {
  SERVICE_ID: "service_zcewrhw",
  OTP_TEMPLATE_ID: "template_y6azrkw",
  DISEASE_TEMPLATE_ID: "template_4bcv9ma",
  PUBLIC_KEY: "EspyJ_0UyrnoUNSW1KCH_"
};

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "u7rk5gek",
  UPLOAD_PRESET: "terrapulse_leaf_upload",
  UPLOAD_URL: "https://api.cloudinary.com/v1_1/u7rk5gek/image/upload"
};

export const firebaseConfig = {
  apiKey: "AIzaSyAjyFgkVpzS6XNWuPYwJjyPeo_CoDsoeFMM",
  authDomain: "terrapulse-6d259.firebaseapp.com",
  projectId: "terrapulse-6d259",
  storageBucket: "terrapulse-6d259.firebasestorage.app",
  messagingSenderId: "29823308168",
  appId: "1:29823308168:web:faf50686ccecc4705b6a3d",
  measurementId: "G-NF5526WLG2"
};

export const LOCAL_STORAGE_KEYS = {
  USER: 'terrapulse_auth_user',
  READINGS: 'terrapulse_sensor_readings',
  SCANS: 'terrapulse_disease_scans',
  SETTINGS: 'terrapulse_user_settings',
  PENDING_OTP: 'terrapulse_pending_otp'
};

export function getCurrentUser() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing auth user:', e);
    }
  }
  return {
    uid: 'farmer_usr_99812',
    email: 'farmer@terrapulse.agri',
    name: 'Mohan',
    mobile: '+91 98765 43210',
    emailVerified: true,
    createdAt: new Date().toISOString()
  };
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export function getUserAvatarInitial(user = getCurrentUser()) {
  if (!user || !user.name) return 'M';
  const trimmed = user.name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'M';
}
