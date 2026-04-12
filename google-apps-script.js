// ═══════════════════════════════════════════════════════════════
//  Swastik Jain & Co. — Google Apps Script Backend
//  Paste this entire file into script.google.com
//  Set up: See SETUP INSTRUCTIONS below
// ═══════════════════════════════════════════════════════════════

// ── SETUP INSTRUCTIONS ──────────────────────────────────────────
// 1. Go to https://sheets.google.com → create a new spreadsheet
// 2. Name it: "SJC Articles"
// 3. In Row 1, add these exact column headers (A to I):
//    id | title | category | summary | author | date | status | createdAt | body
// 4. Go to https://script.google.com → New Project → paste this file
// 5. Click "Save", then "Deploy" → "New Deployment"
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Click Deploy → Copy the Web App URL
// 7. Paste that URL into your website's app.js as API_URL
// ────────────────────────────────────────────────────────────────

const SHEET_NAME = 'Articles';
const SPREADSHEET_ID = ''; // Optional: leave blank to use the active spreadsheet

function getSheet() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Write headers
    sheet.appendRow(['id', 'title', 'category', 'summary', 'author', 'date', 'status', 'createdAt', 'body']);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#1e2022').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(9, 600); // body column wider
  }
  return sheet;
}

function rowToArticle(row) {
  return {
    id:        row[0],
    title:     row[1],
    category:  row[2],
    summary:   row[3],
    author:    row[4],
    date:      row[5],
    status:    row[6],
    createdAt: row[7],
    body:      row[8]
  };
}

// ── GET handler ──────────────────────────────────────────────────
function doGet(e) {
  const action = e.parameter.action || 'list';
  const id = e.parameter.id || '';

  try {
    if (action === 'list') {
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return jsonResponse({ articles: [] });
      const articles = data.slice(1)
        .filter(row => row[0]) // skip empty rows
        .map(rowToArticle);
      return jsonResponse({ articles });
    }

    if (action === 'get' && id) {
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      const row = data.slice(1).find(r => r[0] === id);
      if (!row) return jsonResponse({ error: 'Not found' }, 404);
      return jsonResponse({ article: rowToArticle(row) });
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ── POST handler ─────────────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { action } = payload;
    const sheet = getSheet();

    // CREATE
    if (action === 'create') {
      const art = payload.article;
      art.id = art.id || 'art_' + Date.now();
      art.createdAt = art.createdAt || new Date().toISOString();
      sheet.appendRow([
        art.id, art.title, art.category, art.summary,
        art.author, art.date, art.status, art.createdAt, art.body
      ]);
      return jsonResponse({ success: true, id: art.id });
    }

    // UPDATE
    if (action === 'update') {
      const art = payload.article;
      const data = sheet.getDataRange().getValues();
      const rowIndex = data.findIndex(r => r[0] === art.id);
      if (rowIndex < 1) return jsonResponse({ error: 'Not found' }, 404);
      const sheetRow = rowIndex + 1;
      sheet.getRange(sheetRow, 1, 1, 9).setValues([[
        art.id, art.title, art.category, art.summary,
        art.author, art.date, art.status, art.createdAt || data[rowIndex][7], art.body
      ]]);
      return jsonResponse({ success: true });
    }

    // DELETE
    if (action === 'delete') {
      const { id } = payload;
      const data = sheet.getDataRange().getValues();
      const rowIndex = data.findIndex(r => r[0] === id);
      if (rowIndex < 1) return jsonResponse({ error: 'Not found' }, 404);
      sheet.deleteRow(rowIndex + 1);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(data, code) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
