// Hash-based router for single-page navigation
// Routes: #/dashboard, #/new, #/grow/:id, #/grow/:id/notes, #/grow/:id/gallery

const routes = [];
let currentView = null;
let contentEl = null;
let notFoundHandler = null;

// Parse hash into { path, params }
function parseHash(hash) {
  const raw = hash.replace(/^#\/?/, '') || 'dashboard';
  return '/' + raw;
}

// Match a path against a route pattern, extracting params
function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

const router = {
  init(containerEl) {
    contentEl = containerEl;
    window.addEventListener('hashchange', () => this._handleRoute());
    // Handle initial route
    this._handleRoute();
  },

  // Register a route: pattern + view module
  // View must export: render(container, params), init(params), destroy()
  addRoute(pattern, viewModule) {
    routes.push({ pattern, view: viewModule });
  },

  setNotFound(handler) {
    notFoundHandler = handler;
  },

  // Navigate programmatically
  navigate(path) {
    window.location.hash = '#' + path;
  },

  // Get current route params
  getCurrentParams() {
    const path = parseHash(window.location.hash);
    for (const route of routes) {
      const params = matchRoute(route.pattern, path);
      if (params !== null) return params;
    }
    return {};
  },

  async _handleRoute() {
    const path = parseHash(window.location.hash);

    // Find matching route
    let matched = null;
    let params = {};
    for (const route of routes) {
      const m = matchRoute(route.pattern, path);
      if (m !== null) {
        matched = route;
        params = m;
        break;
      }
    }

    // Remove transition classes from previous view
    contentEl.classList.remove('view-enter', 'view-active');

    // Destroy current view
    if (currentView && typeof currentView.destroy === 'function') {
      try { currentView.destroy(); } catch (e) { console.error('View destroy error:', e); }
    }

    if (!matched) {
      if (notFoundHandler) {
        contentEl.innerHTML = '';
        notFoundHandler(contentEl);
      } else {
        contentEl.innerHTML = '<div class="not-found"><h2>Page Not Found</h2><p><a href="#/dashboard">Go to Dashboard</a></p></div>';
      }
      currentView = null;
      return;
    }

    const view = matched.view;
    currentView = view;

    // Render, then init
    contentEl.innerHTML = '';
    if (typeof view.render === 'function') {
      view.render(contentEl, params);
    }
    if (typeof view.init === 'function') {
      try { await view.init(params); } catch (e) { console.error('View init error:', e); }
    }

    // Focus management for accessibility
    contentEl.setAttribute('tabindex', '-1');
    contentEl.focus({ preventScroll: true });

    // View transition animation
    contentEl.classList.add('view-enter');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contentEl.classList.add('view-active');
      });
    });
  }
};

export default router;
