// ============================================
//   DZ PROMO v2.0 — Core App Logic
// ============================================

const State = {
  currentScreen:   'splash',
  previousScreen:  null,
  currentProductId: null,
  currentFilter:   'tous',
  isFavorite:      false,
  notifications:   [...DZ.notifications],
  loginRole:       'user',
  regRole:         'user'
};

window._regRole  = 'user';
window._loginRole = 'user';

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */
function navigate(screen) {
  if (State.currentScreen === screen) return;

  const fromEl = document.getElementById('screen-' + State.currentScreen);
  const toEl   = document.getElementById('screen-' + screen);
  if (!toEl) return;

  if (fromEl) fromEl.classList.remove('active');
  toEl.classList.add('active');

  const scroll = toEl.querySelector('.screen-scroll');
  if (scroll) scroll.scrollTop = 0;

  State.previousScreen = State.currentScreen;
  State.currentScreen  = screen;

  // Update bottom nav active state
  toEl.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    const oc = btn.getAttribute('onclick') || '';
    if (oc.includes("'" + screen + "'")) btn.classList.add('active');
  });

  // Screen-specific init
  const inits = {
    home:         renderHome,
    product:      () => renderProductDetail(State.currentProductId || 1),
    compare:      renderCompare,
    favorites:    renderFavorites,
    notifications:renderNotifications,
    map:          () => { renderStores(); setTimeout(initMap, 200); },
    dashboard:    renderDashboard,
    subscription: renderSubscriptionScreen,
    'add-product':renderAddProductForm,
  };
  if (inits[screen]) inits[screen]();
}

function goBack() {
  navigate(State.previousScreen || 'home');
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderSearchRecent();
  updateNotifBadge();

  // Firebase handles nav — fallback after 4s
  setTimeout(() => {
    if (State.currentScreen === 'splash') navigate('auth');
  }, 4000);
});

/* ══════════════════════════════════════════════
   AUTH UI HELPERS
══════════════════════════════════════════════ */
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const btn = document.querySelector(`.tab[onclick="switchTab('${tab}')"]`);
  if (btn) btn.classList.add('active');
  const content = document.getElementById('tab-' + tab);
  if (content) content.classList.add('active');
}

function selectRole(role) {
  State.loginRole = role;
  window._loginRole = role;
  ['user','merchant'].forEach(r => {
    const btn = document.getElementById('role-' + r);
    if (btn) btn.classList.toggle('active', r === role);
  });
}

function selectRegRole(role) {
  State.regRole = role;
  window._regRole = role;
  ['user','merchant'].forEach(r => {
    const btn = document.getElementById('reg-role-' + r);
    if (btn) btn.classList.toggle('active', r === role);
  });
  const merchantFields = document.getElementById('merchant-store-field');
  if (merchantFields) merchantFields.style.display = role === 'merchant' ? 'block' : 'none';
}

function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  const icon = btn.querySelector('i');
  if (icon) icon.className = isText ? 'ti ti-eye' : 'ti ti-eye-off';
}

/* ══════════════════════════════════════════════
   HOME
══════════════════════════════════════════════ */
function renderHome() {
  renderFlashDeals();
  renderTrending();
  renderNearbyStores();
}

function renderFlashDeals() {
  const grid = document.getElementById('flash-deals-grid');
  if (!grid) return;
  grid.innerHTML = DZ.products.slice(0, 4).map(p => promoCardHTML(p)).join('');
}

function renderTrending() {
  const el = document.getElementById('trending-scroll');
  if (!el) return;
  el.innerHTML = DZ.products.slice(4).map(p => `
    <div class="trend-card" onclick="openProduct(${p.id})">
      <div class="trend-thumb">
        ${p.discount ? `<div class="disc-badge">-${p.discount}%</div>` : ''}
        <span>${p.emoji}</span>
      </div>
      <div class="trend-body">
        <div class="trend-name">${p.name}</div>
        <div class="trend-sellers">${p.sellers.length} vendeur${p.sellers.length > 1 ? 's' : ''}</div>
        <div class="trend-price">${formatDA(p.bestPrice)}</div>
      </div>
    </div>`).join('');
}

function renderNearbyStores() {
  const el = document.getElementById('nearby-stores');
  if (!el) return;
  el.innerHTML = DZ.stores.slice(0, 3).map(s => storeCardHTML(s)).join('');
}

/* ══════════════════════════════════════════════
   PROMO CARD HTML  (with banderolle)
══════════════════════════════════════════════ */
function promoCardHTML(p) {
  return `
    <div class="promo-card" onclick="openProduct(${p.id})">
      <div class="promo-thumb">
        <span>${p.emoji}</span>
        ${p.discount ? `<div class="disc-badge">-${p.discount}%</div>` : ''}
        ${p.sellers[0]?.best ? '<div class="best-badge">🏆</div>' : ''}
        ${p.discount >= 30 ? '<div class="promo-banderolle">PROMO</div>' : ''}
      </div>
      <div class="promo-body">
        <div class="promo-name">${p.name}</div>
        <div class="promo-store">${p.sellers[0]?.name?.replace(/^[^\s]+\s/,'') || ''}</div>
        <div class="promo-prices">
          <span class="p-new">${formatDA(p.bestPrice)}</span>
          <span class="p-old">${formatDA(p.oldPrice)}</span>
        </div>
      </div>
    </div>`;
}

function storeCardHTML(s) {
  return `
    <div class="store-card" onclick="navigate('map')">
      <div class="store-icon-box">${s.emoji}</div>
      <div class="store-info">
        <div class="store-name">${s.name}</div>
        <div class="store-meta">${s.promos} promotions · ${s.hours}</div>
      </div>
      <div class="store-dist">${s.dist}</div>
    </div>`;
}

/* ══════════════════════════════════════════════
   CATEGORY FILTER
══════════════════════════════════════════════ */
function filterCategory(el, cat) {
  document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  State.currentFilter = cat;
  const grid = document.getElementById('flash-deals-grid');
  if (!grid) return;
  const filtered = cat === 'tous'
    ? DZ.products.slice(0, 4)
    : DZ.products.filter(p => p.category === cat).slice(0, 8);
  grid.innerHTML = filtered.length
    ? filtered.map(p => promoCardHTML(p)).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--dz-muted);font-size:14px;">Aucune promotion dans cette catégorie</div>`;
}

/* ══════════════════════════════════════════════
   PRODUCT DETAIL  (with photo gallery)
══════════════════════════════════════════════ */
function openProduct(id) {
  State.currentProductId = id;
  navigate('product');
}

function renderProductDetail(id) {
  const p = DZ.products.find(x => x.id === id);
  if (!p) return;

  // Gallery
  const galleryMain   = document.getElementById('gallery-main');
  const galleryThumbs = document.getElementById('gallery-thumbs');
  if (galleryMain) {
    galleryMain.textContent = p.emoji;
    galleryMain.setAttribute('data-current', 0);
  }
  if (galleryThumbs) {
    galleryThumbs.innerHTML = (p.photos || [p.emoji]).map((ph, i) => `
      <div class="thumb ${i === 0 ? 'active' : ''}" onclick="switchPhoto(${i}, '${ph}', this)">
        <span>${ph}</span>
      </div>`).join('');
  }

  // Discount ribbon on gallery
  const ribbonEl = document.querySelector('.gallery-ribbon');
  if (!ribbonEl && p.discount) {
    if (galleryMain) {
      const rib = document.createElement('div');
      rib.className = 'gallery-ribbon';
      rib.textContent = `-${p.discount}%`;
      galleryMain.parentNode.appendChild(rib);
    }
  }

  // Info
  setText('product-name', p.name);
  setText('product-desc', p.desc);
  setText('product-price', formatDA(p.bestPrice));
  setText('product-old-price', formatDA(p.oldPrice));
  setText('product-discount-pill', `-${p.discount}%`);
  const expiryEl = document.getElementById('product-expiry');
  if (expiryEl) expiryEl.innerHTML = `<i class="ti ti-clock"></i> Expire dans ${p.expiry}`;

  const tagsEl = document.getElementById('product-tags');
  if (tagsEl) tagsEl.innerHTML = (p.tags || []).map(t =>
    `<span class="tag ${t.includes('Flash') || t.includes('Promo') ? 'tag-orange' : 'tag-green'}">${t}</span>`
  ).join('');

  // Fav button
  const isFav = DZ.user.favorites.includes(id);
  State.isFavorite = isFav;
  const favBtn  = document.getElementById('fav-main-btn');
  const favIcon = document.getElementById('fav-icon');
  if (favBtn)  favBtn.classList.toggle('active', isFav);
  if (favIcon) favIcon.className = isFav ? 'ti ti-heart-filled' : 'ti ti-heart';

  // Sellers
  const sellersList = document.getElementById('sellers-list');
  if (sellersList) {
    sellersList.innerHTML = p.sellers.map(s => `
      <div class="seller-row ${s.best ? 'best-offer' : ''}" onclick="openMaps(${s.lat},${s.lng},'${s.name}')">
        <div class="seller-left">
          <div class="seller-name">${s.name}</div>
          <div class="seller-dist">📍 ${s.dist} · ${s.stock ? 'En stock' : '<span style="color:var(--red)">Rupture</span>'}</div>
        </div>
        <div class="seller-price-col">
          <div class="s-price">${formatDA(s.price)}</div>
          ${s.best ? '<div class="s-badge">🏆 Meilleur prix</div>'
                   : `<div style="font-size:11px;color:var(--text-3);">+${formatDA(s.price - p.bestPrice)}</div>`}
        </div>
      </div>`).join('');
  }

  setTimeout(() => drawPriceChart(p.priceHistory), 120);
}

function switchPhoto(idx, emoji, thumbEl) {
  const main = document.getElementById('gallery-main');
  if (main) main.textContent = emoji;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function openMaps(lat, lng, name) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
}

/* ── Price history chart ── */
function drawPriceChart(history) {
  const canvas = document.getElementById('priceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.parentElement?.offsetWidth - 24 || 320;
  const H = 120;
  canvas.width = W; canvas.height = H;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const green = '#00A651';
  ctx.clearRect(0, 0, W, H);
  const pad = { t:14, r:14, b:4, l:14 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const min = Math.min(...history) * 0.9, max = Math.max(...history) * 1.1;
  const n = history.length;
  const pts = history.map((v, i) => ({
    x: pad.l + (i / (n-1)) * cW,
    y: pad.t + cH - ((v - min) / (max - min)) * cH
  }));
  // Fill
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[n-1].x, H); ctx.lineTo(pts[0].x, H);
  ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(0,166,81,0.15)' : 'rgba(0,166,81,0.08)';
  ctx.fill();
  // Line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = green; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
  // Dots
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === n-1 ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle   = i === n-1 ? green : (isDark ? '#1F2937' : '#fff');
    ctx.strokeStyle = green; ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
  });
  // Label
  const last = pts[n-1];
  ctx.font = 'bold 11px Cairo, sans-serif';
  ctx.fillStyle = green; ctx.textAlign = 'right';
  ctx.fillText(formatDA(history[n-1]), last.x + 6, last.y - 8);
}

/* ══════════════════════════════════════════════
   FAVORITE TOGGLE
══════════════════════════════════════════════ */
function toggleFavorite() {
  const id  = State.currentProductId;
  const idx = DZ.user.favorites.indexOf(id);
  if (idx === -1) {
    DZ.user.favorites.push(id);
    State.isFavorite = true;
    document.getElementById('fav-main-btn')?.classList.add('active');
    const fi = document.getElementById('fav-icon');
    if (fi) fi.className = 'ti ti-heart-filled';
    showToast('❤️ Ajouté aux favoris');
    if (window.saveFavoriteToDB) saveFavoriteToDB(id, true);
  } else {
    DZ.user.favorites.splice(idx, 1);
    State.isFavorite = false;
    document.getElementById('fav-main-btn')?.classList.remove('active');
    const fi = document.getElementById('fav-icon');
    if (fi) fi.className = 'ti ti-heart';
    showToast('💔 Retiré des favoris');
    if (window.saveFavoriteToDB) saveFavoriteToDB(id, false);
  }
  const fc = document.getElementById('favs-count');
  if (fc) fc.textContent = `${DZ.user.favorites.length} produits surveillés · Alertes activées`;
}

function shareProduct() {
  const p = DZ.products.find(x => x.id === State.currentProductId);
  if (!p) return;
  if (navigator.share) {
    navigator.share({ title: `${p.name} à ${formatDA(p.bestPrice)} — DZ Promo`, url: window.location.href });
  } else { showToast('🔗 Lien copié !'); }
}

/* ══════════════════════════════════════════════
   COMPARE
══════════════════════════════════════════════ */
function renderCompare() {
  const list = document.getElementById('compare-list');
  if (!list) return;
  list.innerHTML = DZ.compareProducts.map(p => `
    <div class="compare-card">
      <div class="compare-card-header">
        <div class="compare-emoji">${p.emoji}</div>
        <div><div class="compare-title">${p.name}</div><div class="compare-meta">${p.meta}</div></div>
      </div>
      <div class="compare-sellers">
        ${p.sellers.map(s => `
          <div class="compare-seller-row ${s.best ? 'winner' : ''}">
            <div><div class="cs-name">${s.name}</div><div class="cs-dist">📍 ${s.dist}</div></div>
            <div style="text-align:right;">
              <div class="cs-price">${formatDA(s.price)}</div>
              ${s.best ? '<div class="cs-badge">🏆 Meilleur prix</div>'
                       : `<div style="font-size:11px;color:var(--text-3);">+${formatDA(s.price - p.sellers[0].price)}</div>`}
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   FAVORITES
══════════════════════════════════════════════ */
function renderFavorites() {
  const list   = document.getElementById('favorites-list');
  const count  = document.getElementById('favs-count');
  if (!list) return;
  const favProds = DZ.products.filter(p => DZ.user.favorites.includes(p.id));
  if (count) count.textContent = `${favProds.length} produit${favProds.length !== 1 ? 's' : ''} surveillé${favProds.length !== 1 ? 's' : ''} · Alertes activées`;
  if (!favProds.length) {
    list.innerHTML = `<div style="text-align:center;padding:40px 24px;">
      <div style="font-size:48px;margin-bottom:12px;">💔</div>
      <div style="font-size:15px;font-weight:700;color:var(--dz-text);margin-bottom:6px;">Aucun favori</div>
      <div style="font-size:13px;color:var(--dz-muted);">Appuyez sur ❤️ sur un produit pour le sauvegarder</div></div>`;
    return;
  }
  const trends = ['down','stable','down','up'];
  const trendTxt = ['Baissé ↓','Stable →','Baissé ↓','Monté ↑'];
  list.innerHTML = favProds.map((p, i) => `
    <div class="fav-item" onclick="openProduct(${p.id})">
      <div class="fav-emoji">${p.emoji}</div>
      <div class="fav-info">
        <div class="fav-name">${p.name}</div>
        <div class="fav-store">${p.sellers[0]?.name?.replace(/^[^\s]+\s/,'') || ''} · -${p.discount}%</div>
      </div>
      <div class="fav-right">
        <div class="fav-price">${formatDA(p.bestPrice)}</div>
        <div class="fav-trend ${trends[i % trends.length]}">${trendTxt[i % trendTxt.length]}</div>
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════ */
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  if (!list) return;
  const today = State.notifications.filter(n => n.id <= 2);
  const older  = State.notifications.filter(n => n.id > 2);
  list.innerHTML = `
    <div class="notif-section-label">AUJOURD'HUI</div>
    ${today.map(n => notifHTML(n)).join('')}
    <div class="notif-section-label">PRÉCÉDENTES</div>
    ${older.map(n => notifHTML(n)).join('')}`;
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
    </div>`;
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
  const b = document.getElementById('notif-badge');
  const has = State.notifications.some(n => n.unread);
  if (b) b.style.display = has ? 'block' : 'none';
}

/* ══════════════════════════════════════════════
   STORES
══════════════════════════════════════════════ */
function renderStores() {
  const list = document.getElementById('stores-list');
  if (!list) return;
  list.innerHTML = DZ.stores.map(s => `
    <div class="store-card" onclick="openMaps(${s.lat},${s.lng},'${s.name}')">
      <div class="store-icon-box">${s.emoji}</div>
      <div class="store-info">
        <div class="store-name">${s.name}</div>
        <div class="store-meta">${s.promos} promos · ${s.hours} · ${s.address}</div>
      </div>
      <div class="store-dist">${s.dist}</div>
    </div>`).join('');
}

function locateMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => { showToast(`📍 Position: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`); },
      ()  => showToast('⚠️ Localisation non autorisée')
    );
  }
}

/* ══════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════ */
async function renderDashboard() {
  // Trial countdown
  const trialArea = document.getElementById('trial-countdown-area');
  if (trialArea) {
    const isPremium  = DZ.user.isPremium || false;
    const trialStart = DZ.user.trialStart || new Date();
    const daysLeft   = getMerchantTrialDays(trialStart);
    if (!isPremium) {
      trialArea.innerHTML = renderTrialBadge(daysLeft);
    } else {
      trialArea.innerHTML = '<div style="margin:12px 16px; background:#E6F7EE; border:1px solid #00A651; border-radius:12px; padding:12px 14px; display:flex; align-items:center; gap:10px;"><span style="font-size:22px;">👑</span><div><div style="font-size:14px; font-weight:700; color:#007A3D;">Compte Premium Actif</div><div style="font-size:12px; color:#007A3D;">Abonnement a vie - Toutes les fonctionnalites debloquees</div></div></div>';
    }
  }

  const el = document.getElementById('dashboard-promos');
  if (!el) return;

  // Charger les vrais produits du commercant depuis Firestore
  if (window.loadMerchantProducts && DZ.user.uid) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--dz-muted);font-size:13px;">Chargement...</div>';
    try {
      const prods = await window.loadMerchantProducts(DZ.user.uid);
      if (prods.length === 0) {
        el.innerHTML = '<div style="text-align:center;padding:24px 16px;">' +
          '<div style="font-size:40px;margin-bottom:10px;">📦</div>' +
          '<div style="font-size:14px;font-weight:700;color:var(--dz-text);margin-bottom:6px;">Aucune promotion publiee</div>' +
          '<div style="font-size:13px;color:var(--dz-muted);">Cliquez "+ Ajouter" pour publier votre premiere promotion !</div>' +
          '</div>';
        return;
      }
      el.innerHTML = prods.map(function(p) {
        var status = p.actif ? 'active' : 'expired';
        var label  = p.actif ? 'Active' : 'Expire';
        return '<div class="dash-promo-item">' +
          '<div class="dash-promo-emoji">' + (p.emoji || '🏷️') + '</div>' +
          '<div class="dash-promo-info">' +
            '<div class="dash-promo-name">' + (p.nom || p.name || 'Produit') + '</div>' +
            '<div class="dash-promo-meta">' + formatDA(p.prixPromo || 0) + ' · Expire ' + (p.dateExpiration || '') + '</div>' +
          '</div>' +
          '<div class="dash-promo-right">' +
            '<div class="dash-promo-views">' + (p.vues || 0) + ' vues</div>' +
            '<span class="status-badge ' + status + '">' + label + '</span>' +
          '</div></div>';
      }).join('');
    } catch(e) {
      el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--dz-muted);">Erreur de chargement</div>';
    }
  } else {
    // Fallback données demo
    el.innerHTML = DZ.dashboardPromos.map(function(p) {
      return '<div class="dash-promo-item">' +
        '<div class="dash-promo-emoji">' + p.emoji + '</div>' +
        '<div class="dash-promo-info">' +
          '<div class="dash-promo-name">' + p.name + '</div>' +
          '<div class="dash-promo-meta">' + p.meta + '</div>' +
        '</div>' +
        '<div class="dash-promo-right">' +
          '<div class="dash-promo-views">' + p.views + ' vues</div>' +
          '<span class="status-badge ' + p.status + '">' + (p.status === 'active' ? 'Active' : 'Expire') + '</span>' +
        '</div></div>';
    }).join('');
  }
}

/* ══════════════════════════════════════════════
   SEARCH HELPERS (wrappers for search.js)
══════════════════════════════════════════════ */
function handleSearch(val) { handleSearchInput(val); }
function setFilter(el, cat) {
  document.querySelectorAll('.filter-chips-row .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}
function renderSearchRecent() {
  const grid = document.getElementById('search-recent-grid');
  if (!grid) return;
  grid.innerHTML = DZ.products.slice(0, 4).map(p => promoCardHTML(p)).join('');
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), duration);
}

/* ══════════════════════════════════════════════
   FORMAT HELPER
══════════════════════════════════════════════ */
function formatDA(n) {
  if (!n && n !== 0) return '';
  return Number(n).toLocaleString('fr-DZ') + ' DA';
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '';
}

/* ══════════════════════════════════════════════
   PWA INSTALL
══════════════════════════════════════════════ */
let _deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstall = e;
  setTimeout(() => {
    if (_deferredInstall) showToast('📲 Installez DZ Promo sur votre téléphone !', 5000);
  }, 30000);
});
