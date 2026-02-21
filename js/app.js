// Entry point: imports firebase, router, auth listener, migration
import * as fb from './firebase.js';
import router from './router.js';
import store from './store.js';
import { runMigration } from './migrate.js';
import * as header from './components/header.js';

// Views
import * as dashboard from './views/dashboard.js';
import * as setupWizard from './views/setup-wizard.js';
import * as growDetail from './views/grow-detail.js';
import * as notes from './views/notes.js';
import * as gallery from './views/gallery.js';
import * as guides from './views/guides.js';
import * as environment from './views/environment.js';

// ── Initialize header ──
header.render(document.getElementById('app-header'));

// ── Register routes ──
router.addRoute('/dashboard', dashboard);
router.addRoute('/new', setupWizard);
router.addRoute('/grow/:id', growDetail);
router.addRoute('/grow/:id/notes', notes);
router.addRoute('/grow/:id/gallery', gallery);
router.addRoute('/grow/:id/guides', guides);
router.addRoute('/grow/:id/environment', environment);

// ── Auth state listener ──
fb.onAuth(async (user) => {
  header.updateAuth(user);

  if (user) {
    // Run migration for signed-in user
    await runMigration(user.uid);

    // Ensure user doc exists
    const existingDoc = await fb.getUserDoc(user.uid);
    if (!existingDoc) {
      await fb.setUserDoc(user.uid, {
        displayName: user.displayName || '',
        email: user.email || '',
        createdAt: new Date().toISOString()
      });
    }
  } else {
    // Run local-only migration
    await runMigration(null);
  }

  // Initialize router after auth resolves (only once)
  if (!router._initialized) {
    router._initialized = true;
    router.init(document.getElementById('app-content'));
  } else {
    // Re-trigger current route to refresh data
    router._handleRoute();
  }
});

// ── Update header nav on hash change ──
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  const growMatch = hash.match(/#\/grow\/([^/]+)/);
  header.updateNav(growMatch ? growMatch[1] : null);
});
