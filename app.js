/* ═══════════════════════════════════════════════
   Swastik Jain & Co. — Shared App Logic
   Backend: Google Sheets via Apps Script API
   ═══════════════════════════════════════════════

   ⚠️  PASTE YOUR APPS SCRIPT WEB APP URL BELOW:
   ════════════════════════════════════════════════ */

const API_URL = 'https://script.google.com/macros/s/AKfycbw6pL_ec3OMGpztkbAvEDiguMIeOMQn2P-1DwAAap1AVg6-0izrh7pFa6rZklq5imjqfQ/exec';

// ── Navigation ──────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (toggle) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ── Helpers ─────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function showToast(msg, type = 'success') {
  const existing = document.getElementById('sjc-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'sjc-toast';
  t.style.cssText = `
    position:fixed;bottom:2rem;right:2rem;z-index:9999;
    padding:1rem 1.5rem;border-radius:4px;font-family:var(--font-sans);
    font-size:0.88rem;box-shadow:0 8px 30px rgba(0,0,0,0.15);
    background:${type === 'error' ? '#c0392b' : '#2a7c76'};color:#fff;
    animation:fadeUp 0.3s ease;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── API Calls ────────────────────────────────────
async function apiGet(params = {}) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

async function apiPost(body) {
  // Apps Script requires no-cors workaround: use fetch with text mode
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── 5-minute client-side cache ───────────────────
const CACHE_KEY = 'sjc_articles_cache';
const CACHE_TTL = 5 * 60 * 1000;

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, articles } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return articles;
  } catch { return null; }
}

function setCache(articles) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), articles })); } catch {}
}

function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

async function fetchArticles(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = getCached();
    if (cached) return cached;
  }
  const data = await apiGet({ action: 'list' });
  const articles = data.articles || [];
  setCache(articles);
  return articles;
}

// ── Article card HTML ────────────────────────────
function articleCardHTML(art) {
  return `
    <div class="article-card">
      <div class="article-card-cat">${art.category}</div>
      <h3>${art.title}</h3>
      <p>${art.summary}</p>
      <div class="article-card-meta">
        <span>${formatDate(art.date)}</span>
        <span>${art.author}</span>
      </div>
      <a href="article.html?id=${art.id}" class="article-card-link">Read Article →</a>
    </div>
  `;
}

// ── Home: 3 recent published articles ────────────
async function renderHomeArticles() {
  const container = document.getElementById('homeArticles');
  if (!container) return;
  container.innerHTML = '<div class="article-placeholder">Loading articles…</div>';
  try {
    const all = await fetchArticles();
    const articles = all.filter(a => a.status !== 'draft').slice(0, 3);
    container.innerHTML = articles.length
      ? articles.map(articleCardHTML).join('')
      : '<div class="article-placeholder">No articles published yet.</div>';
  } catch {
    container.innerHTML = '<div class="article-placeholder">Unable to load articles at this time.</div>';
  }
}

// ── Articles listing page ─────────────────────────
async function renderAllArticles() {
  const container = document.getElementById('allArticles');
  const filterContainer = document.getElementById('articlesFilter');
  const noArticles = document.getElementById('noArticles');
  if (!container) return;

  container.innerHTML = '<div class="article-placeholder" style="grid-column:1/-1">Loading articles…</div>';

  try {
    const all = await fetchArticles();
    const published = all.filter(a => a.status !== 'draft');

    if (published.length === 0) {
      container.innerHTML = '';
      if (noArticles) noArticles.style.display = 'block';
      return;
    }

    const cats = ['all', ...new Set(published.map(a => a.category))];
    if (filterContainer) {
      filterContainer.innerHTML = cats.map(c =>
        `<button class="filter-btn ${c === 'all' ? 'active' : ''}" data-cat="${c}">${c === 'all' ? 'All' : c}</button>`
      ).join('');
      filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          renderArticleCards(container, cat === 'all' ? published : published.filter(a => a.category === cat));
        });
      });
    }
    renderArticleCards(container, published);
  } catch {
    container.innerHTML = '<div class="article-placeholder" style="grid-column:1/-1">Unable to load articles. Please try again later.</div>';
  }
}

function renderArticleCards(container, articles) {
  container.innerHTML = articles.length
    ? articles.map(articleCardHTML).join('')
    : '<div class="article-placeholder" style="grid-column:1/-1">No articles in this category.</div>';
}

// ── Single article view ──────────────────────────
async function renderSingleArticle() {
  const container = document.getElementById('articleContent');
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { container.innerHTML = notFoundHTML(); return; }

  container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:60vh;"><p style="color:var(--text-muted)">Loading…</p></div>';

  try {
    let art = null;
    const cached = getCached();
    if (cached) art = cached.find(a => a.id === id);
    if (!art) {
      const data = await apiGet({ action: 'get', id });
      art = data.article;
    }
    if (!art) { container.innerHTML = notFoundHTML(); return; }

    document.getElementById('docTitle').textContent = `${art.title} | Swastik Jain & Co.`;
    container.innerHTML = `
      <div class="article-page-header">
        <div class="container" style="max-width:780px;">
          <span class="article-category-badge">${art.category}</span>
          <h1 class="article-page-title">${art.title}</h1>
          <div class="article-page-meta">${formatDate(art.date)} &nbsp;·&nbsp; ${art.author}</div>
        </div>
      </div>
      <div class="article-body-wrap">
        <div class="article-body-inner">
          <div class="article-back"><a href="articles.html">← Back to Articles</a></div>
          <div>${art.body}</div>
          <div class="article-disclaimer">
            <strong>Disclaimer:</strong> This article is intended solely for general informational purposes and does not constitute professional advice. The information may not reflect the most recent legal or regulatory developments. Readers are advised to seek formal professional consultation before acting on any information contained herein. Swastik Jain & Co. shall not be liable for any decisions taken based on this article.
          </div>
          <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border);display:flex;gap:1rem;">
            <a href="articles.html" class="btn btn-outline" style="font-size:0.8rem;">← All Articles</a>
            <a href="contact.html" class="btn btn-primary" style="font-size:0.8rem;">Submit an Enquiry</a>
          </div>
        </div>
      </div>
    `;
  } catch {
    container.innerHTML = notFoundHTML();
  }
}

function notFoundHTML() {
  return `
    <div style="text-align:center;padding:10rem 2rem;color:var(--text-muted);">
      <p style="font-size:3rem;margin-bottom:1rem;">◻</p>
      <h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:0.5rem;color:var(--charcoal);">Article Not Found</h2>
      <p>The article you are looking for is not available.</p>
      <a href="articles.html" class="btn btn-outline" style="margin-top:2rem;display:inline-block;">View All Articles</a>
    </div>
  `;
}
