/* ═══════════════════════════════════════════════
   Swastik Jain & Co. — Shared App Logic
   CMS: localStorage-based article management
   ═══════════════════════════════════════════════ */

'use strict';

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

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ── Article Storage (localStorage) ──────────────
const STORAGE_KEY = 'sjc_articles';

function getArticles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getSeedArticles();
  } catch {
    return getSeedArticles();
  }
}

function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Seed articles (shown on first visit) ────────
function getSeedArticles() {
  const seeds = [
    {
      id: 'art_seed_1',
      title: 'Understanding Input Tax Credit (ITC) Under GST: Key Provisions',
      category: 'GST',
      summary: 'An overview of the conditions and restrictions governing Input Tax Credit under the CGST Act, 2017.',
      author: 'CA Swastik Jain',
      date: '2025-04-10',
      status: 'published',
      createdAt: '2025-04-10T00:00:00Z',
      body: `<p>Input Tax Credit (ITC) is a fundamental mechanism under the Goods and Services Tax framework that allows registered persons to offset the tax paid on inputs against the GST liability on output supplies. The provisions governing ITC are contained primarily in Sections 16 to 21 of the Central Goods and Services Tax (CGST) Act, 2017.</p>

<h2>Eligibility Conditions for ITC</h2>
<p>A registered person is eligible to claim ITC subject to the fulfillment of the following conditions as prescribed under Section 16(2) of the CGST Act:</p>
<ul>
  <li>The taxpayer must be in possession of a tax invoice or debit note issued by a registered supplier.</li>
  <li>The goods or services must have been received by the registered person.</li>
  <li>The tax charged in respect of the supply has been paid to the Government.</li>
  <li>The return for the relevant tax period has been filed.</li>
</ul>

<h2>Restrictions on ITC</h2>
<p>Section 17 of the CGST Act specifies certain categories of goods and services in respect of which ITC is not available. These include, inter alia, motor vehicles (subject to specified exceptions), food and beverages, health services, and club memberships. Taxpayers must carefully evaluate the admissibility of ITC on each category of expenditure.</p>

<h2>Reconciliation Requirements</h2>
<p>With the introduction of Rule 36(4) and the linkage of ITC to GSTR-2B, taxpayers are required to ensure that the ITC claimed in GSTR-3B corresponds to the credit reflected in GSTR-2B. Regular reconciliation of purchase registers with GSTR-2B is a key compliance requirement.</p>

<h2>Important Note</h2>
<p>The provisions relating to ITC are subject to amendment and judicial interpretation. Taxpayers are advised to seek formal professional consultation with respect to specific ITC matters.</p>

<hr>

<p><em>This article is intended for general informational purposes only and does not constitute professional advice. Provisions are subject to change. Please consult a qualified professional before taking any action.</em></p>`
    },
    {
      id: 'art_seed_2',
      title: 'Annual Information Statement (AIS): What Taxpayers Should Know',
      category: 'Income Tax',
      summary: 'A brief overview of the Annual Information Statement (AIS) and its relevance to income tax compliance.',
      author: 'CA Swastik Jain',
      date: '2025-03-20',
      status: 'published',
      createdAt: '2025-03-20T00:00:00Z',
      body: `<p>The Annual Information Statement (AIS) was introduced by the Income Tax Department as a comprehensive statement providing information about various financial transactions reported in respect of a taxpayer for a given financial year.</p>

<h2>What is AIS?</h2>
<p>AIS is available on the Income Tax portal under the "Services" section. It consolidates information from multiple sources including banks, registrars, securities exchanges, and other reporting entities. It encompasses details of salary income, interest income, dividend income, securities transactions, mutual fund transactions, and more.</p>

<h2>Relevance to Tax Filing</h2>
<p>Taxpayers are required to review the information in AIS before filing their income tax returns. Any discrepancies observed between AIS data and the taxpayer's own records may be reported through the online feedback mechanism available on the portal. Unexplained omissions or discrepancies may attract scrutiny.</p>

<h2>Taxpayer Information Summary (TIS)</h2>
<p>In addition to AIS, the portal provides a Taxpayer Information Summary (TIS) which presents aggregated information for ease of reference during return filing. Pre-filled return data is increasingly being populated based on AIS and TIS data.</p>

<hr>

<p><em>This article is for general information only. Taxpayers are advised to consult their tax professional for assistance with AIS-related matters.</em></p>`
    },
    {
      id: 'art_seed_3',
      title: 'Tax Audit Under Section 44AB: Applicability and Key Requirements',
      category: 'Audit & Assurance',
      summary: 'An informational overview of the applicability of tax audit under Section 44AB of the Income Tax Act, 1961.',
      author: 'CA Swastik Jain',
      date: '2025-02-15',
      status: 'published',
      createdAt: '2025-02-15T00:00:00Z',
      body: `<p>Section 44AB of the Income Tax Act, 1961 mandates that certain categories of taxpayers are required to have their accounts audited by a Chartered Accountant and furnish a tax audit report.</p>

<h2>Who Is Required to Get Accounts Audited?</h2>
<p>As per Section 44AB, tax audit is applicable in the following circumstances:</p>
<ul>
  <li><strong>Business:</strong> Where the total sales, turnover, or gross receipts exceed ₹1 crore in a financial year. This threshold is ₹10 crore where cash receipts and payments do not exceed 5% of total receipts and payments respectively.</li>
  <li><strong>Profession:</strong> Where the gross receipts exceed ₹50 lakh in a financial year.</li>
  <li><strong>Presumptive Taxation:</strong> Where income is declared lower than the prescribed deemed profit under Sections 44AD, 44ADA, or 44AE, and total income exceeds the basic exemption limit.</li>
</ul>

<h2>Forms Applicable</h2>
<p>The tax auditor is required to furnish the audit report in Form 3CA/3CB along with Form 3CD (Statement of Particulars). The due date for filing the tax audit report is typically September 30th of the relevant assessment year, subject to any extensions notified by the CBDT.</p>

<h2>Consequences of Non-Compliance</h2>
<p>Failure to get accounts audited where required may attract a penalty under Section 271B of the Income Tax Act. The penalty may be 0.5% of turnover or ₹1,50,000, whichever is lower.</p>

<hr>
<p><em>This article is for general information only and does not constitute professional advice. Specific situations may vary. Please consult a qualified professional.</em></p>`
    }
  ];
  saveArticles(seeds);
  return seeds;
}

// ── Home page: 3 recent published articles ───────
function renderHomeArticles() {
  const container = document.getElementById('homeArticles');
  if (!container) return;

  const articles = getArticles().filter(a => a.status !== 'draft').slice(0, 3);

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
        <span>${formatDate(art.date)}</span>
        <span>${art.author}</span>
      </div>
      <a href="article.html?id=${art.id}" class="article-card-link">Read Article →</a>
    </div>
  `).join('');
}

// ── Articles listing page ────────────────────────
function renderAllArticles() {
  const container = document.getElementById('allArticles');
  const filterContainer = document.getElementById('articlesFilter');
  const noArticles = document.getElementById('noArticles');
  if (!container) return;

  const all = getArticles().filter(a => a.status !== 'draft');

  if (all.length === 0) {
    container.innerHTML = '';
    if (noArticles) noArticles.style.display = 'block';
    return;
  }

  // Build category filters
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
        renderArticleCards(container, filtered);
      });
    });
  }

  renderArticleCards(container, all);
}

function renderArticleCards(container, articles) {
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
        <span>${formatDate(art.date)}</span>
        <span>${art.author}</span>
      </div>
      <a href="article.html?id=${art.id}" class="article-card-link">Read Article →</a>
    </div>
  `).join('');
}

// ── Single article view ──────────────────────────
function renderSingleArticle() {
  const container = document.getElementById('articleContent');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = notFoundHTML();
    return;
  }

  const articles = getArticles();
  const art = articles.find(a => a.id === id);

  if (!art) {
    container.innerHTML = notFoundHTML();
    return;
  }

  document.getElementById('docTitle').textContent = `${art.title} | Swastik Jain & Co.`;

  container.innerHTML = `
    <div class="article-page-header">
      <div class="container" style="max-width:780px;">
        <span class="article-category-badge">${art.category}</span>
        <h1 class="article-page-title">${art.title}</h1>
        <div class="article-page-meta">
          ${formatDate(art.date)} &nbsp;·&nbsp; ${art.author}
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
          <strong>Disclaimer:</strong> This article is intended solely for general informational purposes and does not constitute professional advice. The information may not reflect the most recent legal or regulatory developments. Readers are advised to seek formal professional consultation before acting on any information contained herein. Swastik Jain & Co. shall not be liable for any decisions taken based on this article.
        </div>
        <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border);display:flex;gap:1rem;">
          <a href="articles.html" class="btn btn-outline" style="font-size:0.8rem;">← All Articles</a>
          <a href="contact.html" class="btn btn-primary" style="font-size:0.8rem;">Submit an Enquiry</a>
        </div>
      </div>
    </div>
  `;
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
