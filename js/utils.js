// Shared utilities — escapeHtml, isValidGrowId, showToast, isValidDate, showConfirmModal

/**
 * Escape HTML special characters to prevent XSS.
 * Returns '' for null/undefined.
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate a grow ID — only alphanumeric, underscore, hyphen allowed.
 */
export function isValidGrowId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Validate a date string — must be a real date between 2020 and 30 days from now.
 */
export function isValidDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const year = d.getFullYear();
  const now = new Date();
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + 30);
  return year >= 2020 && d <= maxDate;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'info'|'success'|'error'|'warning'} type
 * @param {number} duration — ms before auto-dismiss
 */
export function showToast(message, type = 'info', duration) {
  if (duration === undefined) {
    duration = type === 'error' ? 6000 : 4000;
  }

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  if (type === 'error') {
    toast.setAttribute('role', 'alert');
  }

  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  toast.appendChild(textSpan);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Dismiss');
  closeBtn.addEventListener('click', () => dismissToast(toast));
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  // Trigger slide-in on next frame
  requestAnimationFrame(() => { toast.classList.add('toast-visible'); });

  const timer = setTimeout(() => dismissToast(toast), duration);
  toast._dismissTimer = timer;
}

function dismissToast(toast) {
  if (toast._dismissed) return;
  toast._dismissed = true;
  clearTimeout(toast._dismissTimer);
  toast.classList.add('toast-exit');
  toast.classList.remove('toast-visible');
  toast.addEventListener('transitionend', () => toast.remove());
  // Fallback removal if transitionend doesn't fire
  setTimeout(() => toast.remove(), 500);
}

/**
 * Show a styled confirmation modal. Returns a Promise<boolean>.
 * @param {string} message — the question to display
 * @param {boolean} destructive — if true, confirm button is red
 */
export function showConfirmModal(message, destructive = false) {
  return new Promise((resolve) => {
    // Remove any existing confirm modal
    const existing = document.getElementById('confirmModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'confirmModal';
    overlay.className = 'confirm-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'confirmModalMessage');

    const msg = document.createElement('p');
    msg.id = 'confirmModalMessage';
    msg.textContent = message;

    const actions = document.createElement('div');
    actions.className = 'confirm-modal-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'secondary-btn small-btn';
    cancelBtn.textContent = 'Cancel';

    const confirmBtn = document.createElement('button');
    confirmBtn.className = destructive ? 'danger-btn small-btn' : 'primary-btn small-btn';
    confirmBtn.textContent = 'Confirm';

    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    modal.appendChild(msg);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus the confirm button
    requestAnimationFrame(() => confirmBtn.focus());

    // Escape key handler — defined before cleanup so cleanup can remove it
    function onKey(e) {
      if (e.key === 'Escape') {
        cleanup(false);
      }
    }

    function cleanup(result) {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      resolve(result);
    }

    confirmBtn.addEventListener('click', () => cleanup(true));
    cancelBtn.addEventListener('click', () => cleanup(false));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup(false);
    });

    document.addEventListener('keydown', onKey);
  });
}
