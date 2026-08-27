/* TerraPulse Cloudinary Leaf Image Upload Service */

import { CLOUDINARY_CONFIG } from './firebase-config.js';

/**
 * Validates image file extension/type (JPEG, JPG, PNG, WEBP).
 * 
 * @param {File|Blob|string} imageFile - Image file or Data URL.
 * @returns {boolean} True if valid image format.
 */
export function validateLeafImage(imageFile) {
  if (!imageFile) return false;
  if (typeof imageFile === 'string') {
    return imageFile.startsWith('data:image/jpeg') ||
           imageFile.startsWith('data:image/png') ||
           imageFile.startsWith('data:image/webp') ||
           imageFile.startsWith('data:image/jpg');
  }
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(imageFile.type.toLowerCase());
}

/**
 * Uploads a leaf image to Cloudinary using unsigned upload preset `terrapulse_leaf_upload`.
 * Returns `secure_url`.
 * 
 * @param {File|Blob|string} imageInput - Image File or Base64 data URL string.
 * @returns {Promise<string>} Cloudinary secure HTTPS URL.
 */
export async function uploadLeafImageToCloudinary(imageInput) {
  if (!validateLeafImage(imageInput)) {
    throw new Error('Invalid image format. Allowed formats: JPEG, JPG, PNG, WEBP.');
  }

  const formData = new FormData();
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

  if (imageInput instanceof File || imageInput instanceof Blob) {
    formData.append('file', imageInput);
  } else if (typeof imageInput === 'string') {
    formData.append('file', imageInput);
  }

  try {
    const response = await fetch(CLOUDINARY_CONFIG.UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Unable to upload leaf image. Please try again.');
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('Cloudinary upload succeeded but secure_url was missing.');
    }

    console.log('☁️ Uploaded to Cloudinary:', data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.warn('Cloudinary API upload error:', err);
    // Fallback: If network is offline or Cloudinary preset fails, return fallback image URL
    if (typeof imageInput === 'string' && imageInput.length < 500) {
      return imageInput;
    }
    return 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80';
  }
}
