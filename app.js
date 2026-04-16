/* ═══════════════════════════════════════════════
   Swastik Jain & Co. — Shared App Logic
   CMS: Firebase Firestore Integration
   ═══════════════════════════════════════════════ */

'use strict';

// ── Firebase Initialization ──────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAF9UoInEijb1bshvtvwNW1HX32xKNqI2k",
  authDomain: "website-6bcb7.firebaseapp.com",
  projectId: "website-6bcb7",
  storageBucket: "website-6bcb7.firebasestorage.app",
  messagingSenderId: "896028257600",
  appId: "1:896028257600:web:0ae43b78b9b136a032dea5",
  measurementId: "G-0ZK3YP8GTL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Navigation ──────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ── Utility ──────────────────────────────────────
window.formatDate = function(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

// ── Database Functions (Firebase) ────────────────

window.getArticlesDB = async function() {
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    const articles = [];
    querySnapshot.forEach((doc) => {
      articles.push(doc.data());
    });
    return articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

window.saveArticleDB = async function(articleData) {
  try {
    await setDoc(doc(db, "articles", articleData.id), articleData);
  } catch (error) {
    console.error("Error saving article: ", error);
  }
};

window.deleteArticleDB = async function(id) {
  try {
    await deleteDoc(doc(db, "articles", id));
  } catch (error) {
    console.error("Error deleting article: ", error);
  }
};

// ── UI Rendering Functions ───────────────────────

window.renderHomeArticles = async function() {
  const container = document.getElementById('homeArticles');
  if (!container) return;

  const allArticles = await window.getArticlesDB();
  const articles = allArticles.filter(a => a.status !== 'draft').slice(0, 3);

  if (articles.length === 0) {
    container.innerHTML = '<div class="article-placeholder" style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">No articles published yet.</div>';
    return;
  }

  container.innerHTML = articles.map(art => `
    <div class="article-card">
      <div class="article-card-cat">${art.category}</div>
      <h3>${art.title}</h3>
      <p>${art.summary}</p>
      <div class="article-card-meta">
        <span>${window.formatDate(art.date)}</span>
        <span>${art.author}</span>
      </div>
      <a href="article.html?id=${art.id}" class="article-card-link">Read Article →</a>
    </div>
  `).join('');
};

window.renderAllArticles = async function() {
  const container = document.getElementById('allArticles');
  const filterContainer = document.getElementById('articlesFilter');
  const noArticles = document.getElementById('noArticles');
  if (!container) return;

  const allArticles = await window.getArticlesDB();
  const all = allArticles.filter(a => a.status !== 'draft');

  if (all.length === 0) {
    container.innerHTML = '';
    if (noArticles) noArticles.style.display = 'block';
    return;
  }

  const cats = ['all', ...new Set(all.map(a => a.category))];
  if (filterContainer) {
    filterContainer.innerHTML = cats.map(c =>
      `<button class="filter-btn ${c === 'all' ? 'active' : ''}" data-cat="${c}">${c === 'all' ? 'All' : c}</button>`
    ).join('');

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        const filtered = cat === 'all' ? all : all.filter(a => a.category === cat);
        window.renderArticleCards(container, filtered);
      });
    });
  }

  window.renderArticleCards(container, all);
};

window.renderArticleCards = function(container, articles) {
  if (articles.length === 0) {
    container.innerHTML = '<div class="article-placeholder" style="grid-column:1/-1;text-align:center;padding:3rem;">No articles in this category.</div>';
    return;
  }
  container.innerHTML = articles.map(art => `
    <div class="article-card">
      <div class="article-card-cat">${art.category}</div>
      <h3>${art.title}</h3>
      <p>${art.summary}</p>
      <div class="article-card-meta">
        <span>${window.formatDate(art.date)}</span>
        <span>${art.author}</span>
      </div>
      <a href="article.html?id=${art.id}" class="article-card-link">Read Article →</a>
    </div>
  `).join('');
};

window.renderSingleArticle = async function() {
  const container = document.getElementById('articleContent');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = window.notFoundHTML();
    return;
  }

  const articles = await window.getArticlesDB();
  const art = articles.find(a => a.id === id);

  if (!art) {
    container.innerHTML = window.notFoundHTML();
    return;
  }

  document.getElementById('docTitle').textContent = `${art.title} | Swastik Jain & Co.`;

  container.innerHTML = `
    <div class="article-page-header">
      <div class="container" style="max-width:780px;">
        <span class="article-category-badge">${art.category}</span>
        <h1 class="article-page-title">${art.title}</h1>
        <div class="article-page-meta">
          ${window.formatDate(art.date)} &nbsp;·&nbsp; ${art.author}
        </div>
      </div>
    </div>
    <div class="article-body-wrap">
      <div class="article-body-inner">
        <div class="article-back">
          <a href="articles.html">← Back to Articles</a>
        </div>
        <div>${art.body}</div>
        <div class="article-disclaimer">
          <strong>Disclaimer:</strong> This article is intended solely for general informational purposes and does not constitute professional advice. 
        </div>
        <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border);display:flex;gap:1rem;">
          <a href="articles.html" class="btn btn-outline" style="font-size:0.8rem;">← All Articles</a>
          <a href="contact.html" class="btn btn-primary" style="font-size:0.8rem;">Submit an Enquiry</a>
        </div>
      </div>
    </div>
  `;
};

window.notFoundHTML = function() {
  return `
    <div style="text-align:center;padding:10rem 2rem;color:var(--text-muted);">
      <p style="font-size:3rem;margin-bottom:1rem;">◻</p>
      <h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:0.5rem;color:var(--charcoal);">Article Not Found</h2>
      <p>The article you are looking for is not available.</p>
      <a href="articles.html" class="btn btn-outline" style="margin-top:2rem;display:inline-block;">View All Articles</a>
    </div>
  `;
};