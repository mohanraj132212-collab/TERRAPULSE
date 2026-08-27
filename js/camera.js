/* TerraPulse Camera & Leaf Analysis Pipeline Controller (Ref Image 4) */

import { validateLeafImage, uploadLeafImageToCloudinary } from './storage.js';
import { analyzeLeaf } from './disease-detection.js';
import { savePlantAnalysisRecord } from './firestore.js';
import { sendDiseaseAlertEmail } from './email-service.js';
import { showToast } from './notifications.js';
import { getCurrentUser } from './firebase-config.js';

let mediaStream = null;
let capturedImageInput = null;
let isProcessing = false;

export async function initCameraPage() {
  const videoEl = document.getElementById('camera-video');
  const previewImgEl = document.getElementById('camera-preview-img');
  const placeholderEl = document.getElementById('preview-placeholder');
  const previewBox = document.getElementById('camera-preview-box');
  const fileInputEl = document.getElementById('camera-file-input');
  const analyzeBtn = document.getElementById('btn-analyze-camera');
  const statusEl = document.getElementById('scan-status-text');

  const resultContainer = document.getElementById('camera-disease-result');
  const diseaseText = document.getElementById('res-disease');
  const problemText = document.getElementById('res-problem');
  const solutionText = document.getElementById('res-solution');

  // Start Camera Stream Immediately
  await startCameraStream(videoEl);

  // Click on Preview Box to Capture or Trigger File Input
  if (previewBox) {
    previewBox.addEventListener('click', () => {
      if (isProcessing) return;
      if (videoEl && videoEl.style.display !== 'none') {
        // Capture frame from active camera
        capturedImageInput = captureVideoFrame(videoEl);
        if (capturedImageInput) {
          videoEl.style.display = 'none';
          if (placeholderEl) placeholderEl.style.display = 'none';
          if (previewImgEl) {
            previewImgEl.src = capturedImageInput;
            previewImgEl.style.display = 'block';
          }
          stopCameraStream();
          if (analyzeBtn) analyzeBtn.style.display = 'inline-block';
        }
      } else if (fileInputEl) {
        fileInputEl.click();
      }
    });
  }

  // File Picker Selection
  if (fileInputEl) {
    fileInputEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!validateLeafImage(file)) {
          showToast('Invalid file format. Allowed formats: JPEG, JPG, PNG, WEBP.', 'error');
          return;
        }
        capturedImageInput = file;
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (videoEl) videoEl.style.display = 'none';
          if (placeholderEl) placeholderEl.style.display = 'none';
          if (previewImgEl) {
            previewImgEl.src = evt.target.result;
            previewImgEl.style.display = 'block';
          }
          stopCameraStream();
          if (analyzeBtn) analyzeBtn.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Analyze Button Handler
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      if (isProcessing) return;
      if (!capturedImageInput) {
        showToast('Please tap the box to capture a photo or upload an image file.', 'error');
        return;
      }

      isProcessing = true;
      analyzeBtn.disabled = true;

      try {
        // STEP 1: Uploading image to Cloudinary
        updateStatus(statusEl, 'Uploading image to Cloudinary...');
        const imageUrl = await uploadLeafImageToCloudinary(capturedImageInput);

        // STEP 2: Running AI disease prediction
        updateStatus(statusEl, 'Analyzing leaf patterns...');
        const prediction = await analyzeLeaf(capturedImageInput);

        // Extract disease, problem, solution
        const disease = prediction.diseaseName || prediction.disease || 'Leaf Spot';
        const problem = prediction.problem || 'Damaged leaf tissue detected.';
        const solution = prediction.solution || 'Remove infected leaves and apply treatment.';

        // STEP 3: Saving result to Firestore collection `plantAnalyses`
        updateStatus(statusEl, 'Saving result to database...');
        await savePlantAnalysisRecord({ disease, problem, solution }, imageUrl);

        // STEP 4: Sending automatic EmailJS disease email
        updateStatus(statusEl, 'Sending email notification...');
        const user = getCurrentUser();
        await sendDiseaseAlertEmail({
          email: user.email,
          imageUrl: imageUrl,
          disease: disease,
          problem: problem,
          solution: solution
        });

        // STEP 5: Display result in UI matching Reference Image 4
        updateStatus(statusEl, 'Analysis completed successfully.');
        if (diseaseText) diseaseText.textContent = disease;
        if (problemText) problemText.textContent = problem;
        if (solutionText) solutionText.textContent = solution;
        if (resultContainer) resultContainer.style.display = 'flex';

        showToast('Analysis completed. Results sent to your email.', 'success', 5000);
      } catch (err) {
        console.error('Analysis Pipeline Error:', err);
        showToast(err.message || 'Unable to complete leaf analysis. Please try again.', 'error');
        updateStatus(statusEl, 'Analysis failed. Please try again.');
      } finally {
        isProcessing = false;
        analyzeBtn.disabled = false;
      }
    });
  }
}

async function startCameraStream(videoEl) {
  stopCameraStream();
  if (!videoEl) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }
    });
    mediaStream = stream;
    videoEl.srcObject = stream;
    await videoEl.play();
    videoEl.style.display = 'block';
  } catch (err) {
    console.warn('Camera stream unavailable, switching to tap-to-upload mode:', err);
    videoEl.style.display = 'none';
  }
}

function stopCameraStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
}

function captureVideoFrame(videoEl) {
  if (!videoEl || videoEl.videoWidth === 0) return null;
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.9);
}

function updateStatus(el, text) {
  if (el) {
    el.textContent = text;
    el.style.display = 'inline-block';
  }
}
