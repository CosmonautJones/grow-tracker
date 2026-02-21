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

// Render the upload UI into a container
export function renderUploadButton(container, { onUpload }) {
  container.innerHTML = `
    <div class="photo-upload-area">
      <input type="file" id="photoFileInput" accept="image/*" class="hidden">
      <button type="button" id="photoUploadBtn" class="upload-btn">Upload Photo</button>
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
  const progressDiv = container.querySelector('#uploadProgress');
  const progressFill = container.querySelector('#uploadProgressFill');
  const progressText = container.querySelector('#uploadProgressText');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
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

    progressDiv.classList.remove('hidden');
    uploadBtn.disabled = true;

    try {
      await onUpload(file, (progress) => {
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
      });

      progressFill.style.width = '100%';
      progressText.textContent = 'Done!';
      setTimeout(() => {
        progressDiv.classList.add('hidden');
        progressFill.style.width = '0%';
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      progressText.textContent = 'Error!';
      setTimeout(() => progressDiv.classList.add('hidden'), 2000);
    } finally {
      uploadBtn.disabled = false;
      fileInput.value = '';
    }
  });
}
