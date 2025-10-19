# Firebase Setup Guide

This guide will help you set up Firebase to enable cross-device data syncing for your Autoflower Grow Tracker.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `grow-tracker` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Enter app nickname: `Grow Tracker Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration** - you'll need this in Step 4

The config looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click on **Google** provider
5. Toggle "Enable"
6. Select a support email (your email)
7. Click "Save"

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select "Start in **production mode**"
4. Choose your region (closest to you)
5. Click "Enable"

### Set Up Security Rules

1. In Firestore, go to the **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

**What this does:** Users can only read/write their own data when authenticated.

## Step 5: Configure Your App

1. Open `index.html` in your project
2. Find the Firebase configuration section (around line 150)
3. Replace the placeholder values with YOUR Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // ← Replace
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // ← Replace
    projectId: "YOUR_PROJECT_ID",        // ← Replace
    storageBucket: "YOUR_PROJECT_ID.appspot.com",   // ← Replace
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Replace
    appId: "YOUR_APP_ID"                 // ← Replace
};
```

## Step 6: Add Authorized Domain

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your GitHub Pages domain: `cosmonautjones.github.io`
3. Click "Add"

## Step 7: Deploy

1. Commit your changes:
```bash
git add index.html
git commit -m "Configure Firebase for cross-device sync"
git push origin main
```

2. Your updated app will be live at: `https://cosmonautjones.github.io/grow-tracker/`

## How It Works

### Sign In
- Click "🔐 Sign In to Sync Data" button in the header
- Sign in with your Google account
- Your data will automatically load from Firestore

### Automatic Sync
- All changes (week, notes, checklists, etc.) save automatically to Firestore
- Changes sync in real-time across all your devices
- Open the app on your phone and laptop - they stay in sync!

### Privacy
- Your data is private - only YOU can access it (enforced by Firestore security rules)
- Data is encrypted in transit and at rest
- No one else can see your grow data

## Fallback to LocalStorage

If you don't set up Firebase (or aren't signed in):
- The app still works perfectly!
- Data saves to browser localStorage (device-specific)
- No cross-device sync without Firebase

## Troubleshooting

### "Permission denied" errors
- Check that Firestore security rules are set correctly
- Make sure you're signed in with Google

### "Domain not authorized"
- Add `cosmonautjones.github.io` to authorized domains in Firebase Console

### Sign-in popup blocked
- Allow popups for GitHub Pages domain in your browser
- Try signing in again

### Data not syncing
- Check browser console (F12) for errors
- Verify Firebase config values are correct
- Ensure you're signed in on both devices

## Firebase Free Tier Limits

The free "Spark" plan includes:
- **Firestore:** 50,000 reads/day, 20,000 writes/day
- **Authentication:** Unlimited users
- **Storage:** 1 GB

This is MORE than enough for personal use! You'd need to check your app hundreds of times per day to hit limits.

## Optional: Test Locally

To test before deploying:
1. Open `index.html` locally in your browser
2. You may need to run a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```
3. Visit `http://localhost:8000`

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or open an issue on GitHub.
