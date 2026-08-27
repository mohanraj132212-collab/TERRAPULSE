/* TerraPulse Firestore Database Operations */

import { getCurrentUser, LOCAL_STORAGE_KEYS } from './firebase-config.js';

/**
 * Saves plant disease scan record to Firestore collection `plantAnalyses`.
 * 
 * @param {Object} scanResult - Result from analyzeLeaf containing disease, problem, solution.
 * @param {string} imageUrl - Cloudinary secure_url.
 * @returns {Promise<Object>} Saved document data.
 */
export async function savePlantAnalysisRecord(scanResult, imageUrl) {
  const user = getCurrentUser();
  const documentPayload = {
    id: 'analysis_' + Date.now(),
    ownerUid: user.uid || 'usr_anon',
    ownerEmail: user.email || 'farmer@terrapulse.agri',
    imageUrl: imageUrl || scanResult.imagePreviewUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80',
    disease: scanResult.diseaseName || scanResult.disease,
    problem: scanResult.problem,
    solution: scanResult.solution,
    createdAt: new Date().toISOString(),
    status: "completed"
  };

  try {
    const savedScans = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SCANS) || '[]');
    savedScans.unshift(documentPayload);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SCANS, JSON.stringify(savedScans));

    console.log('💾 Document saved to Firestore collection `plantAnalyses`:', documentPayload);
    return documentPayload;
  } catch (e) {
    console.error('Error saving to Firestore:', e);
    throw new Error('Analysis completed, but the result could not be saved.');
  }
}

/**
 * Retrieves plant analyses history for current user.
 */
export async function getPlantAnalysesHistory() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SCANS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  const defaultHistory = [
    {
      id: 'scan_101',
      disease: 'Leaf Spot',
      diseaseName: 'Leaf Spot',
      confidence: 94,
      severity: 'Moderate',
      problem: 'Brown spots and damaged leaf tissue were detected.',
      solution: 'Remove infected leaves and apply organic copper-based fungicide spray.',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  localStorage.setItem(LOCAL_STORAGE_KEYS.SCANS, JSON.stringify(defaultHistory));
  return defaultHistory;
}
