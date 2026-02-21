// Client-side image resize + Firebase Storage upload
import { showToast } from '../utils.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FULL_SIZE = 1920;
const MAX_THUMB_SIZE = 400;
const JPEG_QUALITY = 0.85;
const THUMB_QUALITY = 0.7;

// Load an image from a File into an HTMLImageElement
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };

    img.src = url;
  });
}

// Resize an already-loaded image using canvas, returns a Blob
function resizeFromImage(img, maxSize, quality) {
  return new Promise((resolve, reject) => {
    let { width, height } = img;
    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = Math.round(height * maxSize / width);
        width = maxSize;
      } else {
        width = Math.round(width * maxSize / height);
        height = maxSize;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/jpeg',
      quality
    );
  });
}

// Process an image: return { fullBlob, thumbnailBlob }
// Decodes the image once and generates both sizes in parallel
export async function processImage(file) {
  const img = await loadImage(file);
  const [fullBlob, thumbnailBlob] = await Promise.all([
    resizeFromImage(img, MAX_FULL_SIZE, JPEG_QUALITY),
    resizeFromImage(img, MAX_THUMB_SIZE, THUMB_QUALITY)
  ]);
  return { fullBlob, thumbnailBlob };
}

// Render the two-phase upload UI into a container
// onFileSelected(file) — called after validation, caller shows metadata form
// onConfirm(file, onProgress) — called when user clicks Confirm Upload
// onCancel() — called when user clicks Cancel
export function renderUploadButton(container, { onFileSelected, onConfirm, onCancel }) {
  container.innerHTML = `
    <div class="photo-upload-area">
      <input type="file" id="photoFileInput" accept="image/*" class="hidden">
      <button type="button" id="photoUploadBtn" class="upload-btn">Upload Photo</button>
      <div id="uploadPreview" class="upload-preview-area hidden">
        <img id="uploadPreviewImg" src="" alt="Upload preview" class="upload-preview-img">
        <div class="upload-preview-actions">
          <button type="button" id="uploadConfirmBtn" class="small-btn">Confirm Upload</button>
          <button type="button" id="uploadCancelBtn" class="secondary-btn small-btn">Cancel</button>
        </div>
      </div>
      <div id="uploadProgress" class="upload-progress hidden">
        <div class="progress-bar">
          <div class="progress-fill" id="uploadProgressFill"></div>
        </div>
        <span id="uploadProgressText">0%</span>
      </div>
    </div>
  `;

  const fileInput = container.querySelector('#photoFileInput');
  const uploadBtn = container.querySelector('#photoUploadBtn');
  const previewArea = container.querySelector('#uploadPreview');
  const previewImg = container.querySelector('#uploadPreviewImg');
  const confirmBtn = container.querySelector('#uploadConfirmBtn');
  const cancelBtn = container.querySelector('#uploadCancelBtn');
  const progressDiv = container.querySelector('#uploadProgress');
  const progressFill = container.querySelector('#uploadProgressFill');
  const progressText = container.querySelector('#uploadProgressText');

  let selectedFile = null;

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.', 'error');
      fileInput.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast('File is too large. Maximum size is 20 MB.', 'error');
      fileInput.value = '';
      return;
    }

    selectedFile = file;

    // Show preview thumbnail
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.onload = () => URL.revokeObjectURL(url);

    previewArea.classList.remove('hidden');
    uploadBtn.classList.add('hidden');

    if (onFileSelected) onFileSelected(file);
  });

  confirmBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    previewArea.classList.add('hidden');
    progressDiv.classList.remove('hidden');

    try {
      await onConfirm(selectedFile, (progress) => {
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
      });

      progressFill.style.width = '100%';
      progressText.textContent = 'Done!';
      setTimeout(() => resetUploadUI(), 1500);
    } catch (err) {
      console.error('Upload error:', err);
      progressText.textContent = 'Error!';
      setTimeout(() => resetUploadUI(), 2000);
    }
  });

  cancelBtn.addEventListener('click', () => {
    resetUploadUI();
    if (onCancel) onCancel();
  });

  function resetUploadUI() {
    selectedFile = null;
    fileInput.value = '';
    previewArea.classList.add('hidden');
    progressDiv.classList.add('hidden');
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    uploadBtn.classList.remove('hidden');
    uploadBtn.disabled = false;
    confirmBtn.disabled = false;
    cancelBtn.disabled = false;
  }
}
