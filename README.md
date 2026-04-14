# Swastik Jain & Co. — Website v2

## What's Changed in This Version

- **Color scheme**: Updated to Grant Thornton-inspired Deep Purple (#4B1C6E) + Magenta (#C0009B)
- **Contact details updated**: caswastikjain11@gmail.com | +91 79996 64769 | 51A Sainath Colony, Indore 452001
- **Approach strip removed**: The 4-point numbered strip has been removed from the homepage
- **Service icons removed**: Service cards now show only title and description
- **Service detail modals**: Clicking any service tile opens a pop-up with full description and CTA
- **3 new services added**: Virtual CFO Services, Business Finance, Core Litigation (Indirect & Direct Taxes)
- **Careers page**: New page with job openings and resume upload form (careers.html)
- **Useful Websites section**: Added on homepage – GST, Income Tax, CBIC, MCA, PF (EPFO), ESIC
- **Profile photo placeholder**: "SJ" initials shown on About page – replace with real photo later
- **Admin portal**: admin.html for managing blogs and viewing resume submissions
- **Navigation updated**: All pages now include Careers tab

---

## Admin Portal – Setup Instructions

### Accessing the Admin Panel
Navigate to: `yourwebsite.com/admin.html`  
Default credentials (MUST be changed before going live):
- Username: `swastikjain`
- Password: `SJCAdmin@2025`

**⚠️ SECURITY WARNING**: The current admin panel uses client-side credential checking (localStorage-based). This is fine for a static site, but for production security, you should:

---

## Step-by-Step: Production Admin Setup

### Option A — Simple Static Site (Netlify / GitHub Pages)
The admin.html works as-is with client-side auth for a basic, functional admin panel.

**Step 1**: Change credentials in admin.html:
```javascript
const ADMIN_USER = 'your_chosen_username';
const ADMIN_PASS = 'Your_Strong_Password@2025';
```

**Step 2**: Protect the admin URL using Netlify's `_redirects`:
```
/admin.html  200  Role=admin
```
Or simply use **Netlify Identity** (free tier) to gate access.

**Step 3**: Blog articles are stored in the browser's **localStorage**. They persist across sessions on the same browser/device. Articles can be published/unpublished/deleted from the admin panel.

---

### Option B — Resume Submission Backend (Recommended for real file storage)

Currently, the resume upload form submits to **Formspree** (free tier), which emails you the form data. Since Formspree's free tier doesn't store file attachments permanently, here are better options:

#### Option B1: Formspree Pro ($10/month)
1. Go to https://formspree.io and upgrade to a paid plan
2. Paste your Formspree endpoint in `careers.html` (`action="https://formspree.io/f/YOUR_ID"`)
3. File attachments will appear in your Formspree dashboard and emailed to you

#### Option B2: EmailJS (Free – 200 emails/month)
1. Sign up at https://www.emailjs.com
2. Connect your Gmail account
3. Replace the Formspree fetch in `careers.html` with EmailJS SDK call
4. All submissions including file attachments will be emailed to caswastikjain11@gmail.com

#### Option B3: Netlify Forms (Free – 100 submissions/month)
1. Deploy the site on Netlify
2. Add `data-netlify="true"` attribute to the form in careers.html
3. Remove the custom fetch script — Netlify handles submission automatically
4. View submissions in your Netlify dashboard at app.netlify.com

---

### Option C — Full Backend (Node.js / PHP) for Database Storage

If you want a proper database for resumes and articles:

**Tech Stack**: Node.js + Express + MongoDB Atlas (free tier) + Cloudinary (file storage)

**Step 1**: Create a MongoDB Atlas account at https://cloud.mongodb.com (free 512MB cluster)

**Step 2**: Install Node.js (https://nodejs.org)

**Step 3**: Set up a minimal Express server:
```bash
npm init -y
npm install express mongoose multer cloudinary cors
```

**Step 4**: Create `server.js`:
```javascript
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const app = express();

// Connect MongoDB
mongoose.connect('YOUR_MONGODB_URI');

// Resume Schema
const Resume = mongoose.model('Resume', {
  name: String, email: String, role: String,
  resumeUrl: String, submittedAt: { type: Date, default: Date.now }
});

// Upload route
const upload = multer({ dest: 'uploads/' });
app.post('/api/resume', upload.single('resume'), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  await Resume.create({ ...req.body, resumeUrl: result.secure_url });
  res.json({ success: true });
});

// List resumes (admin only - add auth middleware)
app.get('/api/resumes', async (req, res) => {
  const resumes = await Resume.find().sort('-submittedAt');
  res.json(resumes);
});

app.listen(3000);
```

**Step 5**: Deploy on Railway.app or Render.com (free tier available)

---

### Adding a Profile Photo

In `about.html`, find:
```html
<div class="profile-photo-placeholder">SJ</div>
```

Replace with:
```html
<img src="images/ca-swastik-jain.jpg" alt="CA Swastik Jain" style="width:140px;height:140px;border-radius:50%;border:3px solid var(--gt-purple);object-fit:cover;margin-bottom:1.2rem;">
```

Create an `images/` folder and place your photo there.

---

### Deploying the Website

**Recommended: Netlify (Free)**
1. Go to https://netlify.com and sign up
2. Drag and drop the entire `SwastikJainCo_v2` folder to Netlify
3. Your site will be live at `https://random-name.netlify.app`
4. Add custom domain in Netlify settings (buy domain from GoDaddy/Namecheap)

**Alternative: GitHub Pages**
1. Create a GitHub account and new repository
2. Upload all files
3. Go to Settings → Pages → Enable GitHub Pages
4. Site will be live at `https://yourusername.github.io/reponame`

---

## File Structure
```
SwastikJainCo_v2/
├── index.html          ← Homepage (modified)
├── about.html          ← About the firm (modified)
├── services.html       ← All services (9 services now)
├── careers.html        ← NEW: Careers + Resume upload
├── articles.html       ← Articles listing
├── article.html        ← Single article view
├── contact.html        ← Contact form (updated details)
├── admin.html          ← SECRET admin portal
├── style.css           ← Updated with GT colour palette
├── app.js              ← Shared JS (articles CMS)
└── README.md           ← This file
```
