// ============================================
//   DZ PROMO v2.0 — Smart Search & Autocomplete
// ============================================

let searchTimeout = null;

/* ══ AUTOCOMPLETE ENGINE ═══════════════════════ */
function buildSearchIndex() {
  const idx = new Set(DZ.searchIndex);
  // Add product names, categories, store names dynamically
  DZ.products.forEach(p => {
    const words = p.name.toLowerCase().split(/\s+/);
    words.forEach(w => { if (w.length > 1) idx.add(w); });
    idx.add(p.name.toLowerCase());
    idx.add(p.category.toLowerCase());
    p.tags.forEach(t => idx.add(t.toLowerCase()));
  });
  DZ.stores.forEach(s => {
    idx.add(s.name.toLowerCase());
    idx.add(s.type.toLowerCase());
  });
  return Array.from(idx).sort();
}

let _searchIndex = null;

function getSuggestions(query) {
  if (!_searchIndex) _searchIndex = buildSearchIndex();
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  const exact = [], starts = [], contains = [];
  _searchIndex.forEach(term => {
    if (term === q)                     exact.push(term);
    else if (term.startsWith(q))        starts.push(term);
    else if (term.includes(q))          contains.push(term);
  });
  return [...exact, ...starts, ...contains].slice(0, 8);
}

/* ══ SEARCH INPUT HANDLER ══════════════════════ */
function handleSearchInput(val) {
  const q = val.trim();
  const clearBtn     = document.getElementById('search-clear');
  const suggestBox   = document.getElementById('search-suggestions');
  const defaultEl    = document.getElementById('search-default');
  const resultsEl    = document.getElementById('search-results');

  if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

  clearTimeout(searchTimeout);

  if (!q) {
    if (suggestBox) suggestBox.style.display = 'none';
    if (defaultEl) defaultEl.style.display = 'block';
    if (resultsEl) resultsEl.style.display = 'none';
    return;
  }

  // Show suggestions immediately
  const suggestions = getSuggestions(q);
  renderSuggestions(suggestions, q, suggestBox);

  // Debounce actual search
  searchTimeout = setTimeout(() => {
    if (suggestBox) suggestBox.style.display = 'none';
    if (defaultEl) defaultEl.style.display = 'none';
    if (resultsEl) resultsEl.style.display = 'block';
    runSearch(q);
  }, 400);
}

function renderSuggestions(suggestions, query, box) {
  if (!box || suggestions.length === 0) {
    if (box) box.style.display = 'none';
    return;
  }
  box.style.display = 'block';
  box.innerHTML = suggestions.map(s => {
    const hi = s.replace(new RegExp(`(${query})`, 'gi'), '<strong style="color:#00A651;">$1</strong>');
    return `<div class="suggestion-item" onclick="pickSuggestion('${s}')">
      <i class="ti ti-search" style="font-size:14px; color:var(--dz-muted);"></i>
      <span>${hi}</span>
    </div>`;
  }).join('');
}

function pickSuggestion(val) {
  const input = document.getElementById('main-search-input');
  if (input) { input.value = val; }
  const box = document.getElementById('search-suggestions');
  if (box) box.style.display = 'none';
  runSearch(val);
  document.getElementById('search-default').style.display = 'none';
  document.getElementById('search-results').style.display = 'block';
}

/* ══ ACTUAL SEARCH ═════════════════════════════ */
function runSearch(q) {
  const query = q.toLowerCase().trim();
  const grid  = document.getElementById('search-results-grid');
  const count = document.getElementById('results-count');
  if (!grid) return;

  const results = DZ.products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query) ||
    p.tags.some(t => t.toLowerCase().includes(query)) ||
    p.sellers.some(s => s.name.toLowerCase().includes(query))
  );

  if (count) count.textContent = `${results.length} résultat${results.length !== 1 ? 's' : ''} pour "${q}"`;

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px 20px;">
        <div style="font-size:44px; margin-bottom:12px;">🔍</div>
        <div style="font-size:15px; font-weight:700; color:var(--dz-text); margin-bottom:6px;">Aucun résultat</div>
        <div style="font-size:13px; color:var(--dz-muted);">Essayez "${query.slice(0,-1)}" ou une autre orthographe</div>
      </div>`;
  } else {
    grid.innerHTML = results.map(p => promoCardHTML(p)).join('');
  }
}

function clearSearch() {
  const input = document.getElementById('main-search-input');
  if (input) { input.value = ''; input.focus(); }
  handleSearchInput('');
}

function searchFor(query) {
  navigate('search');
  setTimeout(() => {
    const input = document.getElementById('main-search-input');
    if (input) { input.value = query; handleSearchInput(query); }
  }, 120);
}
