# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grow Tracker — a multi-grow SPA for tracking cannabis cultivation (autoflower + photoperiod) with extensible nutrient brands. Deployed to GitHub Pages at https://cosmonautjones.github.io/grow-tracker/.

## Running Locally

No build step. Must be served (ES modules require HTTP):
```
python -m http.server 8000
# or
npx serve
```

There is no package.json, no bundler, no linter, and no test framework.

## Architecture

Modular ES module SPA with hash-based routing. All JS lives in `js/`.

### File Structure
```
index.html                        ← Minimal shell: #app-header, #app-content, CDN imports
styles.css                        ← Unified CSS (all views + components)
script.js                         ← LEGACY — kept for reference, no longer loaded
js/
  app.js                          ← Entry point: firebase init, router setup, auth listener
  firebase.js                     ← Firebase SDK init + all CRUD helpers (auth, Firestore, Storage)
  router.js                       ← Hash-based router (#/dashboard, #/grow/:id, etc.)
  store.js                        ← Centralized localStorage wrapper with subscribe pattern
  migrate.js                      ← One-time migration from old flat data → new structure
  utils.js                        ← Shared utilities (escapeHtml, showToast, showConfirmModal, isValidGrowId, etc.)
  export-import.js                ← JSON/CSV export + JSON import with conflict strategies
  views/
    dashboard.js                  ← Grow list (active + completed), export/import buttons
    setup-wizard.js               ← Multi-step grow creation form (6 steps)
    grow-detail.js                ← Main grow dashboard (nutrients, checklist, timeline, charts, tips, env preview)
    notes.js                      ← Categorized notes list + add/edit modal
    gallery.js                    ← Photo gallery with upload, lightbox, filtering
    guides.js                     ← Cultivation guide reference (accordion layout, deep-link)
    environment.js                ← Environmental logging (temp, humidity, VPD, CO2, charts)
  components/
    header.js                     ← Persistent nav bar + auth status
    nutrient-calculator.js        ← Brand-agnostic nutrient display + Chart.js schedule/PPM charts
    checklist.js                  ← Weekly checklist rendering
    photo-upload.js               ← Client-side resize + Firebase Storage upload
  data/
    nutrient-schedules.js         ← NUTRIENT_BRANDS registry (5 brands: GH Flora Trio, Fox Farm, AN pH Perfect, GH Maxi, Canna Coco)
    cultivation-guides.js         ← 5 cultivation guides with week-relevance data
    env-ranges.js                 ← VPD calculation, optimal env ranges by stage, alert checking
    weekly-checklists.js          ← Checklist templates by week
    grow-stages.js                ← Stage descriptions by plant type
```

### Routes
- `#/dashboard` — grow list + export/import
- `#/new` — setup wizard
- `#/grow/:id` — main grow view (nutrients, checklist, tips, env preview)
- `#/grow/:id/notes` — notes for a grow
- `#/grow/:id/gallery` — photo gallery for a grow
- `#/grow/:id/guides` — cultivation guides (deep-linkable via `?guide=id`)
- `#/grow/:id/environment` — environmental logging with VPD chart

### Key Patterns

**ES modules:** `<script type="module" src="js/app.js">` — no window.* bridging, no setTimeout race conditions.

**View lifecycle:** Each view exports `render(container, params)`, `init(params)`, `destroy()`. Router calls `destroy()` on old view before rendering new one.

**Centralized store** (`store.js`): `get()`, `set()`, `subscribe()` pattern. All localStorage keys prefixed with `gt_`. Firebase module subscribes to push changes to Firestore.

**Dual-layer persistence:** Store (localStorage) is the primary layer. When signed in, Firestore subcollections sync via real-time listeners. App works fully offline.

**Firestore data model:**
```
/users/{uid}                      ← Profile + settings + activeGrowId
/users/{uid}/grows/{growId}       ← Grow config (status, plantType, medium, etc.)
/users/{uid}/grows/{growId}/weeks/{weekNum}     ← Checklist data
/users/{uid}/grows/{growId}/notes/{noteId}      ← Categorized notes
/users/{uid}/grows/{growId}/photos/{photoId}    ← Photo metadata
/users/{uid}/grows/{growId}/feedingLogs/{logId} ← Feeding log entries
/users/{uid}/grows/{growId}/envLogs/{logId}     ← Environmental readings
```

**Migration** (`migrate.js`): Runs once per user. Migrates old flat localStorage keys and Firestore doc into new multi-grow subcollection structure. Writes `migrationVersion: 1` to prevent re-runs.

**Chart.js:** Loaded via CDN UMD script (`chart.umd.min.js` + `chartjs-plugin-annotation`). Used for nutrient schedule, PPM/EC, and environment charts.

**Nutrient brands:** Brand-agnostic system in `nutrient-schedules.js`. Each brand defines `components[]` with `key`/`name`/`color`/`ppmPerUnit`, plus `unit`/`unitLabel`/`supportedMediums`/`autoPhBuffer`. Feeding forms and logs use dynamic component iteration via `getMixingOrder(brand)`.

**Export/import:** `export-import.js` supports JSON grow backup (versioned envelope) and CSV feeding log export. Import validates structure and supports skip/overwrite/duplicate conflict strategies.

## Conventions

- Vanilla JS only — no frameworks, no npm dependencies
- Native ES modules — no bundler needed
- camelCase for JS variables/functions, kebab-case for CSS classes/variables
- Views rendered via innerHTML string templates
- Event listeners attached in view `init()` functions, cleaned up in `destroy()`
- Store keys prefixed with `gt_` to avoid collisions
