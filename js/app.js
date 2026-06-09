// ============================================
//   DZ PROMO — Application Logic (js/app.js)
// ============================================

// ---- STATE ----
const State = {
  currentScreen: 'splash',
  previousScreen: null,
  currentProductId: null,
  currentFilter: 'tous',
  isFavorite: true,
  searchQuery: '',
  notifications: [...DZ.notifications]
};

// ---- NAVIGATION ----
function navigate(screen) {
  const prev = State.currentScreen;
  if (prev === screen) return;

  const fromEl = document.getElementById('screen-' + prev);
  const toEl   = document.getElementById('screen-' + screen);
  if (!toEl) return;

  if (fromEl) fromEl.classList.remove('active');
  toEl.classList.add('active');

  // Scroll to top
  const scroll = toEl.querySelector('.screen-scroll');
  if (scroll) scroll.scrollTop = 0;

  State.previousScreen = prev;
  State.currentScreen  = screen;

  // Update nav active state
  toEl.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + screen + "'")) {
      btn.classList.add('active');
    }
  });

  // Screen-specific init
  if (screen === 'product') renderProductDetail(State.currentProductId || 1);
  if (screen === 'compare') renderCompare();
  if (screen === 'favorites') renderFavorites();
  if (screen === 'notifications') renderNotifications();
  if (screen === 'map') renderStores();
  if (screen === 'dashboard') renderDashboard();
}

function goBack() {
  navigate(State.previousScreen || 'home');
}

// ---- SPLASH ----
window.addEventListener('DOMContentLoaded', () => {
  renderHome();

  // Auto-navigate after splash
  setTimeout(() => {
    navigate('auth');
  }, 2200);
});

// ---- AUTH ----
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const tabBtn = document.querySelector(`.tab[onclick="switchTab('${tab}')"]`);
  if (tabBtn) tabBtn.classList.add('active');
  const tabContent = document.getElementById('tab-' + tab);
  if (tabContent) tabContent.classList.add('active');
}

// ---- HOME ----
function renderHome() {
  renderFlashDeals();
  renderTrending();
  renderNearbyStores();
}

function renderFlashDeals() {
  const grid = document.getElementById('flash-deals-grid');
  if (!grid) return;
  const deals = DZ.products.slice(0, 4);
  grid.innerHTML = deals.map(p => promoCardHTML(p)).join('');
}

function renderTrending() {
  const scroll = document.getElementById('trending-scroll');
  if (!scroll) return;
  const items = DZ.products.slice(4);
  scroll.innerHTML = items.map(p => `
    <div class="trend-card" onclick="openProduct(${p.id})">
      <div class="trend-thumb">
        <span>${p.emoji}</span>
        <div class="disc-badge">-${p.discount}%</div>
      </div>
      <div class="trend-body">
        <div class="trend-name">${p.name}</div>
        <div class="trend-sellers">${p.sellers.length} vendeurs</div>
        <div class="trend-price">${formatDA(p.bestPrice)}</div>
      </div>
    </div>
  `).join('');
}

function renderNearbyStores() {
  const el = document.getElementById('nearby-stores');
  if (!el) return;
  el.innerHTML = DZ.stores.slice(0, 3).map(s => storeCardHTML(s)).join('');
}

function promoCardHTML(p) {
  const isFav = DZ.user.favorites.includes(p.id);
  return `
    <div class="promo-card" onclick="openProduct(${p.id})">
      <div class="promo-thumb">
        <span>${p.emoji}</span>
        <div class="disc-badge">-${p.discount}%</div>
        ${p.sellers[0].best ? '<div class="best-badge">🏆</div>' : ''}
      </div>
      <div class="promo-body">
        <div class="promo-name">${p.name}</div>
        <div class="promo-store">${p.sellers[0].name.replace(/^[^\s]+\s/, '')} · Oran</div>
        <div class="promo-prices">
          <span class="p-new">${formatDA(p.bestPrice)}</span>
          <span class="p-old">${formatDA(p.oldPrice)}</span>
        </div>
      </div>
    </div>
  `;
}

function storeCardHTML(s) {
  return `
    <div class="store-card" onclick="navigate('map')">
      <div class="store-icon-box">${s.emoji}</div>
      <div class="store-info">
        <div class="store-name">${s.name}</div>
        <div class="store-meta">${s.promos} promotions actives · ${s.hours}</div>
      </div>
      <div class="store-dist">${s.dist}</div>
    </div>
  `;
}

// ---- CATEGORY FILTER ----
function filterCategory(el, cat) {
  document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  State.currentFilter = cat;

  const grid = document.getElementById('flash-deals-grid');
  if (!grid) return;

  const filtered = cat === 'tous'
    ? DZ.products.slice(0, 4)
    : DZ.products.filter(p => p.category === cat).slice(0, 4);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:32px; color:var(--text-3); font-size:14px;">Aucune promotion dans cette catégorie</div>`;
  } else {
    grid.innerHTML = filtered.map(p => promoCardHTML(p)).join('');
  }
}

// ---- OPEN PRODUCT ----
function openProduct(id) {
  State.currentProductId = id;
  navigate('product');
}

// ---- PRODUCT DETAIL ----
function renderProductDetail(id) {
  const p = DZ.products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('product-emoji').textContent = p.emoji;
  document.getElementById('product-discount').textContent = `-${p.discount}%`;
  document.getElementById('product-name').textContent = p.name;
  document.getElementById('product-desc').textContent = p.desc;
  document.getElementById('product-price').textContent = formatDA(p.bestPrice);
  document.getElementById('product-old-price').textContent = formatDA(p.oldPrice);
  document.getElementById('product-discount-pill').textContent = `-${p.discount}%`;
  document.getElementById('product-expiry').innerHTML = `<i class="ti ti-clock"></i> Expire dans ${p.expiry}`;

  // Tags
  document.getElementById('product-tags').innerHTML = p.tags.map(t =>
    `<span class="tag ${t.includes('Flash') || t.includes('Promo') ? 'tag-orange' : 'tag-green'}">${t}</span>`
  ).join('');

  // Favorite button
  const isFav = DZ.user.favorites.includes(id);
  State.isFavorite = isFav;
  const favCircle = document.getElementById('fav-circle');
  const favIcon   = document.getElementById('fav-icon');
  if (isFav) {
    favCircle.classList.add('active');
    favIcon.className = 'ti ti-heart-filled';
  } else {
    favCircle.classList.remove('active');
    favIcon.className = 'ti ti-heart';
  }

  // Sellers
  const sellersList = document.getElementById('sellers-list');
  sellersList.innerHTML = p.sellers.map(s => `
    <div class="seller-row ${s.best ? 'best-offer' : ''}">
      <div class="seller-left">
        <div class="seller-name">${s.name}</div>
        <div class="seller-dist">📍 ${s.dist} · ${s.stock ? 'En stock' : '<span style="color:var(--red)">Rupture</span>'}</div>
      </div>
      <div class="seller-price-col">
        <div class="s-price">${formatDA(s.price)}</div>
        ${s.best ? '<div class="s-badge">🏆 Meilleur prix</div>' : `<div style="font-size:11px;color:var(--text-3);">+${formatDA(s.price - p.bestPrice)}</div>`}
      </div>
    </div>
  `).join('');

  // Draw price history chart
  setTimeout(() => drawPriceChart(p.priceHistory), 100);
}

function drawPriceChart(history) {
  const canvas = document.getElementById('priceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 320;
  const H = 120;
  canvas.width = W;
  canvas.height = H;

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const green = '#00A651';
  const greenBg = isDark ? 'rgba(0,166,81,0.12)' : 'rgba(0,166,81,0.08)';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';

  ctx.clearRect(0, 0, W, H);
  const pad = { top: 14, right: 14, bottom: 4, left: 14 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const min = Math.min(...history) * 0.9;
  const max = Math.max(...history) * 1.1;
  const n = history.length;

  const xStep = chartW / (n - 1);
  const yScale = v => pad.top + chartH - ((v - min) / (max - min)) * chartH;
  const points = history.map((v, i) => ({ x: pad.left + i * xStep, y: yScale(v) }));

  // Fill area
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[n-1].x, H);
  ctx.lineTo(points[0].x, H);
  ctx.closePath();
  ctx.fillStyle = greenBg;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = green;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === n-1 ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = i === n-1 ? green : '#fff';
    ctx.strokeStyle = green;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  });

  // Last price label
  const last = points[n-1];
  ctx.font = 'bold 11px Cairo, sans-serif';
  ctx.fillStyle = green;
  ctx.textAlign = 'right';
  ctx.fillText(formatDA(history[n-1]), last.x + 4, last.y - 9);
}

function toggleFavorite() {
  const id = State.currentProductId;
  const idx = DZ.user.favorites.indexOf(id);
  if (idx === -1) {
    DZ.user.favorites.push(id);
    State.isFavorite = true;
    document.getElementById('fav-circle').classList.add('active');
    document.getElementById('fav-icon').className = 'ti ti-heart-filled';
    showToast('❤️ Ajouté aux favoris');
  } else {
    DZ.user.favorites.splice(idx, 1);
    State.isFavorite = false;
    document.getElementById('fav-circle').classList.remove('active');
    document.getElementById('fav-icon').className = 'ti ti-heart';
    showToast('💔 Retiré des favoris');
  }
}

function shareProduct() {
  const p = DZ.products.find(x => x.id === State.currentProductId);
  if (!p) return;
  if (navigator.share) {
    navigator.share({
      title: `${p.name} à ${formatDA(p.bestPrice)} sur DZ Promo`,
      text: `Découvrez cette offre incroyable sur DZ Promo! ${p.name} à -${p.discount}%`,
      url: window.location.href
    });
  } else {
    showToast('🔗 Lien copié !');
  }
}

// ---- COMPARE ----
function renderCompare() {
  const list = document.getElementById('compare-list');
  if (!list) return;
  list.innerHTML = DZ.compareProducts.map(p => `
    <div class="compare-card">
      <div class="compare-card-header">
        <div class="compare-emoji">${p.emoji}</div>
        <div>
          <div class="compare-title">${p.name}</div>
          <div class="compare-meta">${p.meta}</div>
        </div>
      </div>
      <div class="compare-sellers">
        ${p.sellers.map(s => `
          <div class="compare-seller-row ${s.best ? 'winner' : ''}">
            <div>
              <div class="cs-name">${s.name}</div>
              <div class="cs-dist">📍 ${s.dist}</div>
            </div>
            <div style="text-align:right;">
              <div class="cs-price">${formatDA(s.price)}</div>
              ${s.best ? '<div class="cs-badge">🏆 Meilleur prix</div>' : `<div style="font-size:11px;color:var(--text-3);">+${formatDA(s.price - p.sellers[0].price)}</div>`}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ---- FAVORITES ----
function renderFavorites() {
  const list = document.getElementById('favorites-list');
  if (!list) return;
  const favProducts = DZ.products.filter(p => DZ.user.favorites.includes(p.id));
  const trends = ['down', 'stable', 'down', 'up'];
  const trendTexts = ['Baissé ↓', 'Stable →', 'Baissé ↓', 'Monté ↑'];

  list.innerHTML = favProducts.map((p, i) => `
    <div class="fav-item" onclick="openProduct(${p.id})">
      <div class="fav-emoji">${p.emoji}</div>
      <div class="fav-info">
        <div class="fav-name">${p.name}</div>
        <div class="fav-store">${p.sellers[0].name.replace(/^[^\s]+\s/, '')} · -${p.discount}%</div>
      </div>
      <div class="fav-right">
        <div class="fav-price">${formatDA(p.bestPrice)}</div>
        <div class="fav-trend ${trends[i % trends.length]}">${trendTexts[i % trendTexts.length]}</div>
      </div>
    </div>
  `).join('');
}

// ---- NOTIFICATIONS ----
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  if (!list) return;

  const today = State.notifications.filter(n => n.id <= 2);
  const yesterday = State.notifications.filter(n => n.id > 2);

  list.innerHTML = `
    <div class="notif-section-label">AUJOURD'HUI</div>
    ${today.map(n => notifHTML(n)).join('')}
    <div class="notif-section-label">HIER & AVANT</div>
    ${yesterday.map(n => notifHTML(n)).join('')}
  `;
}

function notifHTML(n) {
  return `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="notif-icon-box ${n.color}">${n.icon}</div>
      <div class="notif-body-wrap">
        <div class="notif-title">${n.title}</div>
        <div class="notif-body-text">${n.body}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="notif-dot-badge"></div>' : ''}
    </div>
  `;
}

function readNotif(id) {
  const n = State.notifications.find(x => x.id === id);
  if (n) n.unread = false;
  renderNotifications();
  updateNotifBadge();
}

function markAllRead() {
  State.notifications.forEach(n => n.unread = false);
  renderNotifications();
  updateNotifBadge();
  showToast('✅ Toutes les notifications lues');
}

function updateNotifBadge() {
  const badge = document.getElementById('notif-badge');
  const hasUnread = State.notifications.some(n => n.unread);
  if (badge) badge.style.display = hasUnread ? 'block' : 'none';
}

// ---- STORES / MAP ----
function renderStores() {
  const list = document.getElementById('stores-list');
  if (!list) return;
  list.innerHTML = DZ.stores.map(s => `
    <div class="store-card">
      <div class="store-icon-box">${s.emoji}</div>
      <div class="store-info">
        <div class="store-name">${s.name}</div>
        <div class="store-meta">${s.promos} promos · ${s.hours}</div>
      </div>
      <div class="store-dist">${s.dist}</div>
    </div>
  `).join('');
}

// ---- DASHBOARD ----
function renderDashboard() {
  const el = document.getElementById('dashboard-promos');
  if (!el) return;
  el.innerHTML = DZ.dashboardPromos.map(p => `
    <div class="dash-promo-item">
      <div class="dash-promo-emoji">${p.emoji}</div>
      <div class="dash-promo-info">
        <div class="dash-promo-name">${p.name}</div>
        <div class="dash-promo-meta">${p.meta}</div>
      </div>
      <div class="dash-promo-right">
        <div class="dash-promo-views">${p.views} vues</div>
        <span class="status-badge ${p.status}">${p.status === 'active' ? 'Active' : 'Expiré'}</span>
      </div>
    </div>
  `).join('');
  setTimeout(drawDashChart, 100);
}

function drawDashChart() {
  const canvas = document.getElementById('dashCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 320;
  const H = 140;
  canvas.width = W;
  canvas.height = H;

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const views = [180, 260, 220, 340, 290, 480, 248];
  const clicks = [40, 65, 55, 90, 72, 130, 60];
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const green = '#00A651';
  const orange = '#FF6B35';
  const bg2 = isDark ? '#1F2937' : '#F9FAFB';
  const textColor = isDark ? '#6B7280' : '#9CA3AF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  ctx.clearRect(0, 0, W, H);
  const pad = { top: 12, right: 10, bottom: 24, left: 10 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const maxV = Math.max(...views) * 1.15;
  const n = days.length;
  const barW = chartW / n;

  // Grid lines
  [0.25, 0.5, 0.75, 1].forEach(frac => {
    const y = pad.top + chartH - frac * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Bars + labels
  views.forEach((v, i) => {
    const x = pad.left + i * barW + barW * 0.15;
    const bW = barW * 0.45;
    const bH = (v / maxV) * chartH;
    const y = pad.top + chartH - bH;

    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, bW, bH, [4, 4, 0, 0]) : ctx.rect(x, y, bW, bH);
    ctx.fillStyle = i === 5 ? green : (isDark ? 'rgba(0,166,81,0.4)' : 'rgba(0,166,81,0.25)');
    ctx.fill();

    // Click bars
    const cH = (clicks[i] / maxV) * chartH;
    const cx = x + bW + 2;
    const cy = pad.top + chartH - cH;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cx, cy, bW * 0.7, cH, [3, 3, 0, 0]) : ctx.rect(cx, cy, bW * 0.7, cH);
    ctx.fillStyle = isDark ? 'rgba(255,107,53,0.5)' : 'rgba(255,107,53,0.3)';
    ctx.fill();

    // Day label
    ctx.font = '10px Cairo, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(days[i], pad.left + i * barW + barW / 2, H - 6);
  });

  // Legend
  ctx.font = 'bold 10px Cairo, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = green;
  ctx.fillText('■ Vues', W - 100, 10);
  ctx.fillStyle = orange;
  ctx.fillText('■ Clics', W - 50, 10);
}

// ---- SEARCH ----
function handleSearch(val) {
  State.searchQuery = val.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear');
  const defaultEl = document.getElementById('search-default');
  const resultsEl = document.getElementById('search-results');

  if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';

  if (!State.searchQuery) {
    if (defaultEl) defaultEl.style.display = 'block';
    if (resultsEl) resultsEl.style.display = 'none';
    return;
  }

  if (defaultEl) defaultEl.style.display = 'none';
  if (resultsEl) resultsEl.style.display = 'block';

  const results = DZ.products.filter(p =>
    p.name.toLowerCase().includes(State.searchQuery) ||
    p.category.toLowerCase().includes(State.searchQuery) ||
    p.tags.some(t => t.toLowerCase().includes(State.searchQuery))
  );

  const countEl = document.getElementById('results-count');
  if (countEl) countEl.textContent = `${results.length} résultat${results.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById('search-results-grid');
  if (!grid) return;

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px 20px;">
        <div style="font-size:40px; margin-bottom:12px;">🔍</div>
        <div style="font-size:15px; font-weight:600; color:var(--text); margin-bottom:6px;">Aucun résultat</div>
        <div style="font-size:13px; color:var(--text-2);">Essayez un autre terme de recherche</div>
      </div>
    `;
  } else {
    grid.innerHTML = results.map(p => promoCardHTML(p)).join('');
  }
}

function clearSearch() {
  const input = document.getElementById('main-search-input');
  if (input) { input.value = ''; input.focus(); }
  handleSearch('');
}

function searchFor(query) {
  navigate('search');
  setTimeout(() => {
    const input = document.getElementById('main-search-input');
    if (input) { input.value = query; handleSearch(query); }
  }, 100);
}

function setFilter(el, cat) {
  document.querySelectorAll('.filter-chips-row .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  if (State.searchQuery) handleSearch(State.searchQuery);
}

// ---- SEARCH: recent grid ----
function renderSearchRecent() {
  const grid = document.getElementById('search-recent-grid');
  if (!grid) return;
  grid.innerHTML = DZ.products.slice(0, 4).map(p => promoCardHTML(p)).join('');
}

// ---- MODAL ----
function showAddPromo() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.add('open');
}
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
}
function submitPromo() {
  closeModal();
  showToast('🎉 Promotion publiée avec succès !');
}

// ---- TOAST ----
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- FORMAT HELPER ----
function formatDA(amount) {
  return amount.toLocaleString('fr-DZ') + ' DA';
}

// ---- INIT DEFERRED ----
document.addEventListener('DOMContentLoaded', () => {
  renderSearchRecent();
  updateNotifBadge();

  // Keyboard: hide nav on focus
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(inp => {
    inp.addEventListener('focus', () => {
      document.querySelectorAll('.bottom-nav').forEach(n => n.style.opacity = '0.2');
    });
    inp.addEventListener('blur', () => {
      document.querySelectorAll('.bottom-nav').forEach(n => n.style.opacity = '1');
    });
  });
});

// ---- PWA INSTALL PROMPT ----
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install banner after 30s if not installed
  setTimeout(() => {
    if (deferredPrompt) {
      showToast('📲 Installez DZ Promo sur votre téléphone !', 5000);
    }
  }, 30000);
});
