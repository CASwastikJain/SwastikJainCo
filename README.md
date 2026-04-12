# Swastik Jain & Co. — Website
### Google Sheets–powered Article CMS

---

## File Structure

```
swastik-jain-co/
├── index.html              ← Home page
├── about.html              ← About the firm
├── services.html           ← Services detail
├── articles.html           ← Public articles listing
├── article.html            ← Single article reader
├── contact.html            ← Enquiry form (Formspree)
├── admin.html              ← 🔐 Article Manager (CMS)
├── style.css               ← All styles
├── app.js                  ← Shared logic + API calls
└── google-apps-script.js   ← Paste this into script.google.com
```

---

## One-Time Setup (5 steps)

### Step 1 — Create the Google Sheet
1. Go to https://sheets.google.com
2. Create a new spreadsheet, name it **"SJC Articles"**
3. The Apps Script will auto-create the `Articles` sheet with headers on first use

### Step 2 — Set up Apps Script
1. Go to https://script.google.com
2. Click **New Project**
3. Delete the default code
4. Open `google-apps-script.js` from this folder and **paste the entire contents**
5. Click 💾 Save (name the project anything, e.g. "SJC Articles API")

### Step 3 — Deploy as Web App
1. Click **Deploy** → **New Deployment**
2. Click the ⚙ gear icon → select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Authorize when prompted (click "Allow")
6. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/ABC.../exec`

### Step 4 — Paste URL into app.js
1. Open `app.js` in any text editor
2. Find line 10:
   ```
   const API_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace with your URL:
   ```
   const API_URL = 'https://script.google.com/macros/s/ABC.../exec';
   ```
4. Save the file

### Step 5 — Upload your website files
Upload all files to any static host (Netlify, GitHub Pages, Vercel).
That's it — articles now sync from Google Sheets globally.

---

## How to Add / Edit Articles

### Via Admin Panel (admin.html)
- Open `admin.html` in your browser
- Click **+ New Article**, fill in the form, click **Save Article**
- Edit any article by clicking **Edit** in the list
- Delete from the Edit screen

### Via Google Sheets directly
- Open your spreadsheet at https://sheets.google.com
- Add a row in the `Articles` sheet with columns:
  `id | title | category | summary | author | date | status | createdAt | body`
- Set `status` to `published` or `draft`
- The website picks up changes within 5 minutes (cache TTL)
- To force-refresh immediately: open `admin.html` → click **↻ Refresh**

---

## How It Works

```
Your Browser / Admin Panel
        ↓  fetch()
Google Apps Script Web App  (free, no server needed)
        ↓  read/write
Google Sheets  (your database, always accessible)
        ↓  renders on
Public Website (articles.html, article.html, index.html)
```

- Public pages cache articles for **5 minutes** to keep the site fast
- Admin panel always fetches **fresh data** from the Sheet
- No monthly cost, no database subscription, no server

---

## Hosting

Upload all `.html`, `.css`, and `.js` files to:
- **Netlify Drop** → netlify.com/drop (drag & drop)
- **GitHub Pages** → push to repo, enable Pages in Settings
- **Vercel** → connect GitHub repo

After uploading once, you never need to re-upload when adding articles —
just use the Admin panel or edit the Google Sheet directly.
