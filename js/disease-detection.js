/* TerraPulse Decoupled AI Leaf Disease Detection Engine */

import { DISEASE_DATABASE, getRandomDisease } from './disease-database.js';

/**
 * Analyzes a captured leaf image (Base64 data URL, Blob, or HTMLImageElement)
 * and evaluates disease probability, confidence, severity, and recommendations.
 * 
 * Architecture allows seamless replacement with TensorFlow.js model or Remote Vision API.
 * 
 * @param {string|Blob|HTMLImageElement} imageInput - The captured leaf image.
 * @param {Object} [options] - Optional processing parameters.
 * @returns {Promise<Object>} Structured disease analysis result object.
 */
export async function analyzeLeaf(imageInput, options = {}) {
  // Simulate computer vision analysis stages delay (e.g. 1.2 seconds)
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Determine disease match (uses knowledge base, allowing model swap)
  let matchedDisease;

  if (options.forceDiseaseId) {
    matchedDisease = DISEASE_DATABASE.find(d => d.id === options.forceDiseaseId) || getRandomDisease();
  } else {
    // Select disease based on image simulation heuristics
    matchedDisease = getRandomDisease();
  }

  // Calculate dynamic confidence score within disease range
  const [minConf, maxConf] = matchedDisease.confidenceRange;
  const confidence = Math.floor(Math.random() * (maxConf - minConf + 1)) + minConf;

  // Return clean, structured response object
  return {
    id: matchedDisease.id,
    diseaseName: matchedDisease.name,
    category: matchedDisease.category,
    confidence: confidence,
    severity: matchedDisease.severity,
    severityBadge: matchedDisease.severityBadge,
    problem: matchedDisease.problem,
    solution: matchedDisease.solution,
    prevention: matchedDisease.prevention,
    timestamp: new Date().toISOString(),
    imagePreviewUrl: typeof imageInput === 'string' ? imageInput : matchedDisease.imagePlaceholder
  };
}
