// Categorized notes list + editor
import store from '../store.js';
import * as fb from '../firebase.js';
import { updateNav } from '../components/header.js';

const CATEGORIES = [
  { key: 'feeding', icon: '&#x1f4a7;', label: 'Feeding' },
  { key: 'environment', icon: '&#x1f321;', label: 'Environment' },
  { key: 'observation', icon: '&#x1f441;', label: 'Observation' },
  { key: 'issue', icon: '&#x26a0;&#xfe0f;', label: 'Issue' },
  { key: 'milestone', icon: '&#x2b50;', label: 'Milestone' },
  { key: 'general', icon: '&#x1f4dd;', label: 'General' }
];

let growId = null;
let notes = [];
let unsubNotes = null;
let editingNoteId = null;
let filterCategory = '';
let filterWeek = '';
let filterText = '';

export function render(container, params) {
  growId = params.id;
  container.innerHTML = `
    <section class="notes-section-full">
      <div class="section-header-row">
        <h2>Notes</h2>
        <button id="addNoteBtn" class="primary-btn small-btn">+ Add Note</button>
      </div>

      <div class="notes-filters">
        <select id="filterCategory">
          <option value="">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
        </select>
        <input type="number" id="filterWeek" placeholder="Week #" min="1" style="width:80px;">
        <input type="text" id="filterText" placeholder="Search notes...">
      </div>

      <div id="noteModal" class="modal-overlay hidden">
        <div class="modal-content">
          <h3 id="noteModalTitle">Add Note</h3>
          <div class="input-group">
            <label>Category</label>
            <select id="noteCategory">
              ${CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="input-group">
            <label>Title</label>
            <input type="text" id="noteTitle" placeholder="Note title">
          </div>
          <div class="input-group">
            <label>Content</label>
            <textarea id="noteContent" rows="5" placeholder="Write your note..."></textarea>
          </div>
          <div class="wizard-form-grid">
            <div class="input-group">
              <label>Week (optional)</label>
              <input type="number" id="noteWeek" min="1" placeholder="Week #">
            </div>
            <div class="input-group">
              <label>Tags (comma separated)</label>
              <input type="text" id="noteTags" placeholder="e.g., deficiency, pH">
            </div>
          </div>
          <div class="form-actions">
            <button id="saveNoteBtn" class="primary-btn small-btn">Save</button>
            <button id="cancelNoteBtn" class="secondary-btn small-btn">Cancel</button>
            <button id="deleteNoteBtn" class="danger-btn small-btn hidden">Delete</button>
          </div>
        </div>
      </div>

      <div id="notesList" class="notes-list">
        <div class="loading">Loading notes...</div>
      </div>
    </section>
  `;
}

export function init(params) {
  growId = params.id;
  updateNav(growId);

  document.getElementById('addNoteBtn').addEventListener('click', () => openModal());
  document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
  document.getElementById('cancelNoteBtn').addEventListener('click', closeModal);
  document.getElementById('deleteNoteBtn').addEventListener('click', deleteNote);

  document.getElementById('filterCategory').addEventListener('change', (e) => { filterCategory = e.target.value; renderNotes(); });
  document.getElementById('filterWeek').addEventListener('input', (e) => { filterWeek = e.target.value; renderNotes(); });
  document.getElementById('filterText').addEventListener('input', (e) => { filterText = e.target.value.toLowerCase(); renderNotes(); });

  loadNotes();
}

function loadNotes() {
  const user = fb.getCurrentUser();
  if (user) {
    unsubNotes = fb.onAllNotes(user.uid, growId, (data) => {
      notes = data;
      renderNotes();
    });
  } else {
    notes = store.get(`grow_${growId}_notes`) || [];
    renderNotes();
  }
}

function renderNotes() {
  const container = document.getElementById('notesList');
  if (!container) return;

  let filtered = [...notes];

  if (filterCategory) {
    filtered = filtered.filter(n => n.category === filterCategory);
  }
  if (filterWeek) {
    filtered = filtered.filter(n => String(n.week) === filterWeek);
  }
  if (filterText) {
    filtered = filtered.filter(n =>
      (n.title || '').toLowerCase().includes(filterText) ||
      (n.content || '').toLowerCase().includes(filterText) ||
      (n.tags || []).some(t => t.toLowerCase().includes(filterText))
    );
  }

  filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No notes found.</p></div>';
    return;
  }

  const iconMap = {};
  CATEGORIES.forEach(c => { iconMap[c.key] = c.icon; });

  container.innerHTML = filtered.map(n => `
    <div class="note-card" data-note-id="${n.id}">
      <div class="note-card-header">
        <span class="note-icon">${iconMap[n.category] || '&#x1f4dd;'}</span>
        <span class="note-category-badge">${n.category || 'general'}</span>
        ${n.week ? `<span class="note-week-badge">Week ${n.week}</span>` : ''}
        <span class="note-date">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</span>
      </div>
      <h3 class="note-card-title">${n.title || 'Untitled'}</h3>
      <p class="note-card-content">${(n.content || '').slice(0, 200)}${(n.content || '').length > 200 ? '...' : ''}</p>
      ${n.tags && n.tags.length ? `<div class="note-tags">${n.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');

  container.querySelectorAll('.note-card').forEach(card => {
    card.addEventListener('click', () => {
      const noteId = card.dataset.noteId;
      const note = notes.find(n => n.id === noteId);
      if (note) openModal(note);
    });
  });
}

function openModal(note) {
  editingNoteId = note ? note.id : null;
  document.getElementById('noteModalTitle').textContent = note ? 'Edit Note' : 'Add Note';
  document.getElementById('noteCategory').value = note ? note.category || 'general' : 'general';
  document.getElementById('noteTitle').value = note ? note.title || '' : '';
  document.getElementById('noteContent').value = note ? note.content || '' : '';
  document.getElementById('noteWeek').value = note ? note.week || '' : '';
  document.getElementById('noteTags').value = note ? (note.tags || []).join(', ') : '';
  document.getElementById('deleteNoteBtn').classList.toggle('hidden', !note);
  document.getElementById('noteModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('noteModal').classList.add('hidden');
  editingNoteId = null;
}

async function saveNote() {
  const data = {
    category: document.getElementById('noteCategory').value,
    title: document.getElementById('noteTitle').value.trim(),
    content: document.getElementById('noteContent').value.trim(),
    week: parseInt(document.getElementById('noteWeek').value) || null,
    tags: document.getElementById('noteTags').value.split(',').map(t => t.trim()).filter(Boolean)
  };

  if (!data.title && !data.content) {
    alert('Please enter a title or content.');
    return;
  }

  const user = fb.getCurrentUser();

  if (editingNoteId) {
    // Update
    if (user) {
      await fb.updateNote(user.uid, growId, editingNoteId, data);
    } else {
      const idx = notes.findIndex(n => n.id === editingNoteId);
      if (idx >= 0) {
        Object.assign(notes[idx], data, { updatedAt: new Date().toISOString() });
        store.set(`grow_${growId}_notes`, notes);
        renderNotes();
      }
    }
  } else {
    // Create
    if (user) {
      await fb.createNote(user.uid, growId, data);
    } else {
      data.id = 'note_' + Date.now();
      data.createdAt = new Date().toISOString();
      notes.push(data);
      store.set(`grow_${growId}_notes`, notes);
      renderNotes();
    }
  }

  closeModal();
}

async function deleteNote() {
  if (!editingNoteId) return;
  if (!confirm('Delete this note?')) return;

  const user = fb.getCurrentUser();
  if (user) {
    await fb.deleteNote(user.uid, growId, editingNoteId);
  } else {
    notes = notes.filter(n => n.id !== editingNoteId);
    store.set(`grow_${growId}_notes`, notes);
    renderNotes();
  }

  closeModal();
}

export function destroy() {
  if (unsubNotes) { unsubNotes(); unsubNotes = null; }
  notes = [];
  editingNoteId = null;
  filterCategory = '';
  filterWeek = '';
  filterText = '';
}
