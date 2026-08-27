/* TerraPulse Real Firebase Authentication & Firestore Profile Controller */

import { auth, db, setCurrentUser, getCurrentUser } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { showToast } from './notifications.js';

/**
 * Auth guard checking for signed-in user session.
 */
export function checkAuthGuard(requireAuth = true) {
  const user = getCurrentUser();
  if (requireAuth && !user) {
    window.location.href = 'login.html';
  }
}

/**
 * Creates a real Firebase Authentication account and saves user profile to Firestore `users/{uid}`.
 * 
 * @param {string} name - User full name.
 * @param {string} mobile - Mobile number.
 * @param {string} email - Verified email address.
 * @param {string} password - User password.
 * @returns {Promise<Object>} Created user profile.
 */
export async function createFirebaseAuthAccount(name, mobile, email, password) {
  // 1. Create real Firebase Auth Account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Prepare user profile payload for Firestore (NEVER store plain-text password)
  const profileData = {
    uid: user.uid,
    name: name,
    mobile: mobile,
    email: email,
    createdAt: serverTimestamp()
  };

  // 3. Save profile document in Firestore collection `users`
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, profileData);
    console.log('👤 Saved user profile to Firestore `users` collection:', user.uid);
  } catch (err) {
    console.warn('Firestore user profile save error:', err);
  }

  // 4. Save local session
  const sessionUser = {
    uid: user.uid,
    name: name,
    mobile: mobile,
    email: email,
    createdAt: new Date().toISOString()
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Authenticates user via real Firebase Authentication and fetches profile from Firestore.
 * 
 * @param {string} email - Email address.
 * @param {string} password - Password.
 * @returns {Promise<Object>} Logged in user profile.
 */
export async function loginFirebaseAuthUser(email, password) {
  // 1. Sign in via Firebase Auth SDK
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  let userName = email.split('@')[0];
  let userMobile = '';

  // 2. Fetch user profile from Firestore `users/{uid}`
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.name) userName = data.name;
      if (data.mobile) userMobile = data.mobile;
    }
  } catch (err) {
    console.warn('Firestore user doc fetch error:', err);
  }

  const sessionUser = {
    uid: user.uid,
    name: userName,
    mobile: userMobile,
    email: email,
    createdAt: new Date().toISOString()
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Sign out user from Firebase Auth and clear session.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Firebase signOut error:', e);
  }
  setCurrentUser(null);
  showToast('Signed out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}
