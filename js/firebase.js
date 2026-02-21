// Firebase SDK init + all CRUD helpers
// Replaces the window.* bridging hack from the old architecture

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  collection, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
  getStorage, ref as storageRef, uploadBytesResumable, uploadBytes, getDownloadURL, deleteObject
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyAxaxToDIEwcz2XD0SKXbgflliJr2MLJrk",
  authDomain: "grow-tracker-3fef2.firebaseapp.com",
  projectId: "grow-tracker-3fef2",
  storageBucket: "grow-tracker-3fef2.firebasestorage.app",
  messagingSenderId: "779471922609",
  appId: "1:779471922609:web:d2b31b7a09552eea4e4990"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ── Auth ──

export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}

// ── User doc ──

function userDocRef(uid) {
  return doc(db, 'users', uid);
}

export async function getUserDoc(uid) {
  const snap = await getDoc(userDocRef(uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function setUserDoc(uid, data) {
  return setDoc(userDocRef(uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export function onUserDoc(uid, callback) {
  return onSnapshot(userDocRef(uid), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

// ── Grows ──

function growsCol(uid) {
  return collection(db, 'users', uid, 'grows');
}

function growDocRef(uid, growId) {
  return doc(db, 'users', uid, 'grows', growId);
}

export async function createGrow(uid, data) {
  const docRef = await addDoc(growsCol(uid), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function getGrow(uid, growId) {
  const snap = await getDoc(growDocRef(uid, growId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateGrow(uid, growId, data) {
  return updateDoc(growDocRef(uid, growId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteGrow(uid, growId) {
  return deleteDoc(growDocRef(uid, growId));
}

export async function getAllGrows(uid) {
  const snap = await getDocs(growsCol(uid));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function onGrow(uid, growId, callback) {
  return onSnapshot(growDocRef(uid, growId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export function onAllGrows(uid, callback) {
  return onSnapshot(growsCol(uid), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ── Weeks (checklists) ──

function weeksCol(uid, growId) {
  return collection(db, 'users', uid, 'grows', growId, 'weeks');
}

function weekDocRef(uid, growId, weekNum) {
  return doc(db, 'users', uid, 'grows', growId, 'weeks', String(weekNum));
}

export async function getWeekDoc(uid, growId, weekNum) {
  const snap = await getDoc(weekDocRef(uid, growId, weekNum));
  return snap.exists() ? snap.data() : null;
}

export async function setWeekDoc(uid, growId, weekNum, data) {
  return setDoc(weekDocRef(uid, growId, weekNum), data, { merge: true });
}

// ── Notes ──

function notesCol(uid, growId) {
  return collection(db, 'users', uid, 'grows', growId, 'notes');
}

function noteDocRef(uid, growId, noteId) {
  return doc(db, 'users', uid, 'grows', growId, 'notes', noteId);
}

export async function createNote(uid, growId, data) {
  const docRef = await addDoc(notesCol(uid, growId), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateNote(uid, growId, noteId, data) {
  return updateDoc(noteDocRef(uid, growId, noteId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteNote(uid, growId, noteId) {
  return deleteDoc(noteDocRef(uid, growId, noteId));
}

export async function getAllNotes(uid, growId) {
  const snap = await getDocs(notesCol(uid, growId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function onAllNotes(uid, growId, callback) {
  return onSnapshot(notesCol(uid, growId), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ── Photos ──

function photosCol(uid, growId) {
  return collection(db, 'users', uid, 'grows', growId, 'photos');
}

function photoDocRef(uid, growId, photoId) {
  return doc(db, 'users', uid, 'grows', growId, 'photos', photoId);
}

export async function createPhotoDoc(uid, growId, data) {
  const docRef = await addDoc(photosCol(uid, growId), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function deletePhotoDoc(uid, growId, photoId) {
  return deleteDoc(photoDocRef(uid, growId, photoId));
}

export async function getAllPhotos(uid, growId) {
  const snap = await getDocs(photosCol(uid, growId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function onAllPhotos(uid, growId, callback) {
  return onSnapshot(photosCol(uid, growId), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ── Feeding Logs ──

function feedingLogsCol(uid, growId) {
  return collection(db, 'users', uid, 'grows', growId, 'feedingLogs');
}

function feedingLogDocRef(uid, growId, logId) {
  return doc(db, 'users', uid, 'grows', growId, 'feedingLogs', logId);
}

export async function createFeedingLog(uid, growId, data) {
  const docRef = await addDoc(feedingLogsCol(uid, growId), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function getAllFeedingLogs(uid, growId) {
  const snap = await getDocs(feedingLogsCol(uid, growId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateFeedingLog(uid, growId, logId, data) {
  return updateDoc(feedingLogDocRef(uid, growId, logId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteFeedingLog(uid, growId, logId) {
  return deleteDoc(feedingLogDocRef(uid, growId, logId));
}

export function onAllFeedingLogs(uid, growId, callback) {
  return onSnapshot(feedingLogsCol(uid, growId), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ── Environment Logs ──

function envLogsCol(uid, growId) {
  return collection(db, 'users', uid, 'grows', growId, 'envLogs');
}

function envLogDocRef(uid, growId, logId) {
  return doc(db, 'users', uid, 'grows', growId, 'envLogs', logId);
}

export async function createEnvLog(uid, growId, data) {
  const docRef = await addDoc(envLogsCol(uid, growId), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function getAllEnvLogs(uid, growId) {
  const snap = await getDocs(envLogsCol(uid, growId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateEnvLog(uid, growId, logId, data) {
  return updateDoc(envLogDocRef(uid, growId, logId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteEnvLog(uid, growId, logId) {
  return deleteDoc(envLogDocRef(uid, growId, logId));
}

export function onAllEnvLogs(uid, growId, callback) {
  return onSnapshot(envLogsCol(uid, growId), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ── Weeks (getAllWeeks export) ──

export async function getAllWeeks(uid, growId) {
  const snap = await getDocs(weeksCol(uid, growId));
  return snap.docs.map(d => ({ weekNum: d.id, ...d.data() }));
}

// ── Firebase Storage (photos) ──

export function uploadPhoto(uid, growId, file, onProgress) {
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `users/${uid}/grows/${growId}/photos/${timestamp}_${rand}.${ext}`;
  const sRef = storageRef(storage, path);

  const uploadTask = uploadBytesResumable(sRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, storagePath: path });
      }
    );
  });
}

export async function uploadThumbnail(uid, growId, blob) {
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `users/${uid}/grows/${growId}/thumbs/${timestamp}_${rand}.jpg`;
  const sRef = storageRef(storage, path);

  const snapshot = await uploadBytes(sRef, blob, { contentType: 'image/jpeg' });
  const url = await getDownloadURL(snapshot.ref);
  return { url, storagePath: path };
}

export async function deleteStorageFile(path) {
  const sRef = storageRef(storage, path);
  return deleteObject(sRef);
}

// ── Delete Grow + All Subcollections ──

export async function deleteGrowWithSubcollections(uid, growId) {
  // Delete all subcollection docs
  const subcollections = [
    { col: notesCol(uid, growId) },
    { col: feedingLogsCol(uid, growId) },
    { col: envLogsCol(uid, growId) },
    { col: weeksCol(uid, growId) },
    { col: photosCol(uid, growId), hasStorage: true }
  ];

  for (const sub of subcollections) {
    const snap = await getDocs(sub.col);
    for (const d of snap.docs) {
      if (sub.hasStorage) {
        const data = d.data();
        if (data.storagePath) {
          try { await deleteStorageFile(data.storagePath); } catch (e) { /* ignore missing files */ }
        }
        if (data.thumbStoragePath) {
          try { await deleteStorageFile(data.thumbStoragePath); } catch (e) { /* ignore missing files */ }
        }
      }
      await deleteDoc(d.ref);
    }
  }

  // Delete the grow doc itself
  await deleteDoc(growDocRef(uid, growId));
}

// ── Legacy support: get old flat user doc (for migration) ──

export async function getOldUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
