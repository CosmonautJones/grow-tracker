// Persistent header/nav bar + auth status
import * as fb from '../firebase.js';
import store from '../store.js';
import router from '../router.js';

let headerEl = null;

export function render(container) {
  headerEl = container;
  headerEl.innerHTML = `
    <header class="app-header">
      <div class="header-top">
        <a href="#/dashboard" class="header-brand">
          <h1>Grow Tracker</h1>
        </a>
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
  `;

  // Auth button listeners
  document.getElementById('signInBtn').addEventListener('click', async () => {
    try {
      await fb.signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed: ' + error.message);
    }
  });

  document.getElementById('signOutBtn').addEventListener('click', async () => {
    try {
      await fb.signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
    `;

    // Highlight active link
    const hash = window.location.hash;
    nav.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (hash === href || (hash.startsWith(href) && href !== '#/dashboard')) {
        link.classList.add('active');
      }
    });
  } else {
    nav.innerHTML = `
      <a href="#/dashboard" class="nav-link active">Dashboard</a>
    `;
  }
}

export function destroy() {
  // Nothing to clean up
}
