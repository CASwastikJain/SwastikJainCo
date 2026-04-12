# Swastik Jain & Co. — Website

A complete, ICAI-compliant multi-page website with a built-in dynamic article/blog CMS.

---

## File Structure

```
swastik-jain-co/
├── index.html       ← Home page
├── about.html       ← About the firm & CA
├── services.html    ← Detailed services page
├── articles.html    ← Public articles listing
├── article.html     ← Single article view
├── contact.html     ← Contact + Formspree enquiry form
├── admin.html       ← 🔐 Article Manager (CMS)
├── style.css        ← All styles
└── app.js           ← Shared JS (CMS, nav, article rendering)
```

---

## How to Use the CMS (Article Manager)

1. Open **`admin.html`** in your browser
2. Click **"+ New Article"**
3. Fill in: Title, Category, Summary, Author, Body (rich editor), Date, Status
4. Click **"Save Article"**
5. The article appears instantly on `articles.html` and `index.html`

### Editing Articles
- Go to `admin.html`
- Click **"Edit"** next to any article
- Make changes and click **"Save Article"**

### Deleting Articles
- Open any article in the editor (click Edit)
- Click the red **"Delete Article"** button

### Rich Text Editor
The editor supports: **Bold**, *Italic*, Underline, H2/H3 headings, ordered and unordered lists, horizontal rules.

### Draft vs Published
Set Status to "Draft" to save without publishing publicly.

---

## Article Storage

Articles are stored in **localStorage** in the visitor's browser. This means:
- ✅ No server or database required — works on any static host
- ✅ Articles persist across sessions on the same browser
- ⚠️ Articles are per-browser — use the export feature or a backend (Firebase/Supabase) for multi-device use

**3 sample articles are pre-loaded on first visit.**

---

## Contact Form

The enquiry form (contact.html) submits to **Formspree** endpoint:
`https://formspree.io/f/xjgjbeqy`

To change: edit the `action` attribute of `<form>` in `contact.html`.

---

## Hosting

Upload all files to any static host:
- **Netlify Drop** — drag & drop folder at netlify.com/drop
- **GitHub Pages** — push to a repo and enable Pages
- **Vercel** — connect repo or upload folder

---

## Upgrading to a Real CMS

For multi-user or multi-device article management, replace `localStorage` in `app.js` with:
- **Firebase Firestore** (free tier, no server needed)
- **Supabase** (PostgreSQL, free tier)
- Any headless CMS (Contentful, Sanity, etc.)

The `getArticles()` and `saveArticles()` functions in `app.js` are the only functions that need to change.

---

## ICAI Compliance

- No testimonials, client names, or comparative claims
- All content is informational only
- Mandatory disclaimer in footer of all pages and on each article
- Contact form note clarifies no professional relationship is created
