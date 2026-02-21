// Persistent header/nav bar + auth status
import * as fb from '../firebase.js';
import store from '../store.js';
import router from '../router.js';
import { showToast } from '../utils.js';

let headerEl = null;
let deferredInstallPrompt = null;

export function render(container) {
  headerEl = container;
  headerEl.innerHTML = `
    <header class="app-header">
      <div class="header-top">
        <a href="#/dashboard" class="header-brand">
          <h1>Grow Tracker</h1>
        </a>
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">🌙</button>
        <div class="auth-status" id="authStatus">
          <button id="signInBtn" class="auth-btn">Sign In to Sync</button>
          <div id="userInfo" class="user-info hidden">
            <span id="userEmail"></span>
            <button id="signOutBtn" class="auth-btn-small">Sign Out</button>
          </div>
        </div>
      </div>
      <nav class="header-nav" id="headerNav"></nav>
    </header>
    <div id="offlineBanner" class="offline-banner">You're offline — changes saved locally</div>
  `;

  // Auth button listeners
  document.getElementById('signInBtn').addEventListener('click', async () => {
    try {
      await fb.signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      showToast('Sign in failed: ' + error.message, 'error');
    }
  });

  document.getElementById('signOutBtn').addEventListener('click', async () => {
    try {
      await fb.signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  });

  initTheme();
  initOfflineIndicator();
  initInstallPrompt();
}

function initTheme() {
  const saved = localStorage.getItem('gt_theme');
  let theme;
  if (saved === 'dark' || saved === 'light') {
    theme = saved;
  } else {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
  updateToggleIcon(theme);

  // Click listener
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('gt_theme', next);
      updateToggleIcon(next);
    });
  }

  // System preference change listener — only apply if no explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('gt_theme')) return;
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = newTheme;
    updateToggleIcon(newTheme);
  });
}

function updateToggleIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }
}

function initOfflineIndicator() {
  const banner = document.getElementById('offlineBanner');
  if (!banner) return;

  function update() {
    const offline = !navigator.onLine;
    banner.classList.toggle('visible', offline);
    if (offline) {
      banner.setAttribute('role', 'alert');
    } else {
      banner.removeAttribute('role');
    }
  }

  update();
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
}

function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    // Show install button in header
    const headerTop = document.querySelector('.header-top');
    if (!headerTop || document.getElementById('installAppBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'installAppBtn';
    btn.className = 'auth-btn-small';
    btn.textContent = 'Install App';
    btn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      btn.remove();
    });

    headerTop.insertBefore(btn, headerTop.querySelector('.auth-status'));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('installAppBtn');
    if (btn) btn.remove();
  });
}

export function updateAuth(user) {
  const signInBtn = document.getElementById('signInBtn');
  const userInfo = document.getElementById('userInfo');
  const userEmail = document.getElementById('userEmail');

  if (!signInBtn || !userInfo) return;

  if (user) {
    signInBtn.classList.add('hidden');
    userInfo.classList.remove('hidden');
    userEmail.textContent = user.email;
  } else {
    signInBtn.classList.remove('hidden');
    userInfo.classList.add('hidden');
  }
}

export function updateNav(growId) {
  const nav = document.getElementById('headerNav');
  if (!nav) return;

  if (growId) {
    nav.innerHTML = `
      <a href="#/dashboard" class="nav-link">Dashboard</a>
      <a href="#/grow/${growId}" class="nav-link">Grow</a>
      <a href="#/grow/${growId}/notes" class="nav-link">Notes</a>
      <a href="#/grow/${growId}/gallery" class="nav-link">Gallery</a>
      <a href="#/grow/${growId}/guides" class="nav-link">Guides</a>
      <a href="#/grow/${growId}/environment" class="nav-link">Environment</a>
    `;

    // Highlight active link
    const hash = window.location.hash;
    nav.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (hash === href || (hash.startsWith(href) && href !== '#/dashboard')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  } else {
    nav.innerHTML = `
      <a href="#/dashboard" class="nav-link active" aria-current="page">Dashboard</a>
    `;
  }
}

export function destroy() {
  // Nothing to clean up
}
