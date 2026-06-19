// ============================================
//   DZ PROMO v2.0 — Merchant Module
//   Trial countdown, subscription, payment validation
// ============================================

/* ══ TRIAL COUNTDOWN ══════════════════════════ */
function getMerchantTrialDays(createdAt) {
  if (!createdAt) return 30;
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const elapsed = Math.floor((now - created) / 86400000);
  return Math.max(0, 30 - elapsed);
}

function renderTrialBadge(daysLeft) {
  const pct = (daysLeft / 30) * 100;
  let color = '#00A651', bgColor = '#E6F7EE', textColor = '#007A3D';
  if (daysLeft <= 7)  { color = '#FF6B35'; bgColor = '#FFF0EB'; textColor = '#7A3D00'; }
  if (daysLeft <= 3)  { color = '#E24B4A'; bgColor = '#FCEBEB'; textColor = '#7A0000'; }
  if (daysLeft === 0) { color = '#E24B4A'; bgColor = '#FCEBEB'; textColor = '#7A0000'; }

  const urgency = daysLeft === 0 ? 'Essai expiré !' :
                  daysLeft <= 3  ? 'Expire bientôt !' :
                  daysLeft <= 7  ? 'Plus que quelques jours' : "Période d'essai";

  return `
    <div class="trial-badge" style="background:${bgColor}; border:1px solid ${color}40; border-radius:16px; padding:16px 18px; margin:12px 16px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
        <div>
          <div style="font-size:12px; color:${textColor}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${urgency}</div>
          <div style="font-size:22px; font-weight:900; color:${color}; line-height:1.1;">${daysLeft} <span style="font-size:14px; font-weight:600;">jours restants</span></div>
        </div>
        <div style="width:56px; height:56px; position:relative;">
          <svg width="56" height="56" viewBox="0 0 56 56" style="transform:rotate(-90deg)">
            <circle cx="28" cy="28" r="22" fill="none" stroke="${color}20" stroke-width="5"/>
            <circle cx="28" cy="28" r="22" fill="none" stroke="${color}" stroke-width="5"
              stroke-dasharray="${2*Math.PI*22}"
              stroke-dashoffset="${2*Math.PI*22*(1-pct/100)}"
              stroke-linecap="round"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${color};">${daysLeft}</div>
        </div>
      </div>
      <div style="height:6px; background:${color}20; border-radius:3px; overflow:hidden; margin-bottom:10px;">
        <div style="height:100%; width:${pct}%; background:${color}; border-radius:3px; transition:width 0.5s;"></div>
      </div>
      <div style="font-size:12px; color:${textColor}; margin-bottom:10px;">
        ${daysLeft > 0 ? `Votre essai gratuit se termine dans <strong>${daysLeft} jours</strong>. Abonnez-vous maintenant pour continuer.` : "Votre essai gratuit est terminé. Abonnez-vous pour réactiver votre compte."}
      </div>
      <button onclick="navigate('subscription')" style="width:100%; padding:10px; background:${color}; color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">
        🏷️ S'abonner — 1,000 DA à vie
      </button>
    </div>`;
}

/* ══ SUBSCRIPTION SCREEN HTML ════════════════ */
function renderSubscriptionScreen() {
  const el = document.getElementById('subscription-content');
  if (!el) return;
  el.innerHTML = `
    <div style="padding:0 16px 24px;">

      <!-- Hero offer -->
      <div style="background:linear-gradient(135deg,#00A651,#007A3D); border-radius:18px; padding:22px 18px; margin-bottom:18px; color:#fff; text-align:center; position:relative; overflow:hidden;">
        <div style="position:absolute;right:-20px;top:-20px;width:100px;height:100px;background:rgba(255,255,255,0.07);border-radius:50%;"></div>
        <div style="font-size:36px; margin-bottom:8px;">🏷️</div>
        <div style="font-size:13px; opacity:.8; margin-bottom:4px;">Abonnement Commerçant</div>
        <div style="font-size:40px; font-weight:900; line-height:1;">1,000 <span style="font-size:20px;">DA</span></div>
        <div style="font-size:14px; font-weight:700; margin-top:4px; opacity:.9;">À VIE — Paiement unique</div>
        <div style="margin-top:12px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
          <span style="background:rgba(255,255,255,.2);padding:4px 10px;border-radius:20px;font-size:11px;">✓ Promotions illimitées</span>
          <span style="background:rgba(255,255,255,.2);padding:4px 10px;border-radius:20px;font-size:11px;">✓ 4 photos par article</span>
          <span style="background:rgba(255,255,255,.2);padding:4px 10px;border-radius:20px;font-size:11px;">✓ Stats avancées</span>
          <span style="background:rgba(255,255,255,.2);padding:4px 10px;border-radius:20px;font-size:11px;">✓ Badge Premium</span>
        </div>
      </div>

      <!-- Payment methods -->
      <div style="font-size:15px; font-weight:700; color:var(--dz-text); margin-bottom:12px;">Méthode de paiement</div>

      <!-- BaridiMob -->
      <div class="pay-method-card active" id="pay-baridimob" onclick="selectPayMethod('baridimob')">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:44px;height:44px;background:#E6F7EE;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">📱</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:700;color:var(--dz-text);">BaridiMob</div>
            <div style="font-size:12px;color:var(--dz-muted);">Virement via l'app BaridiMob</div>
          </div>
          <div class="pay-check" id="check-baridimob" style="width:20px;height:20px;border-radius:50%;background:#00A651;display:flex;align-items:center;justify-content:center;">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div style="margin-top:10px; background:var(--dz-surface); border-radius:8px; padding:10px 12px;">
          <div style="font-size:11px; color:var(--dz-muted); margin-bottom:4px;">Numéro de compte BaridiMob :</div>
          <div style="font-size:15px; font-weight:800; color:#00A651; letter-spacing:1px;" id="baridimob-number">00799999004235254364</div>
          <div style="font-size:11px; color:var(--dz-muted); margin-top:4px;">Montant exact : <strong>1,000 DA</strong></div>
        </div>
      </div>

      <!-- CCP -->
      <div class="pay-method-card" id="pay-ccp" onclick="selectPayMethod('ccp')" style="margin-top:10px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:44px;height:44px;background:#FFF0EB;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🏦</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:700;color:var(--dz-text);">Virement CCP</div>
            <div style="font-size:12px;color:var(--dz-muted);">Versement en bureau de poste</div>
          </div>
          <div class="pay-check" id="check-ccp" style="width:20px;height:20px;border-radius:50%;background:var(--dz-border);"></div>
        </div>
        <div style="margin-top:10px; background:var(--dz-surface); border-radius:8px; padding:10px 12px;">
          <div style="font-size:11px; color:var(--dz-muted); margin-bottom:4px;">Compte CCP bénéficiaire :</div>
          <div style="font-size:15px; font-weight:800; color:#00A651;">322867 / Clé 53</div>
          <div style="font-size:11px; color:var(--dz-muted); margin-top:2px;">Nom : <strong>DZ Promo</strong> · Montant : <strong>1,000 DA</strong></div>
        </div>
      </div>

      <!-- Upload proof -->
      <div style="margin-top:18px; font-size:15px; font-weight:700; color:var(--dz-text); margin-bottom:10px;">
        Joindre votre preuve de paiement
      </div>
      <div style="font-size:13px; color:var(--dz-muted); margin-bottom:12px;">
        Après le virement, envoyez le reçu (BaridiMob, reçu CCP ou quittance) pour activer votre compte Premium.
      </div>

      <div class="upload-zone" id="upload-zone" onclick="document.getElementById('proof-file').click()">
        <input type="file" id="proof-file" accept="image/*,.pdf" style="display:none;" onchange="handleProofFile(event)">
        <div id="upload-placeholder">
          <div style="font-size:36px; margin-bottom:8px;">📎</div>
          <div style="font-size:14px; font-weight:600; color:var(--dz-text); margin-bottom:4px;">Appuyer pour joindre</div>
          <div style="font-size:12px; color:var(--dz-muted);">Reçu BaridiMob · Quittance CCP<br>Photo ou PDF acceptés</div>
        </div>
        <div id="upload-preview" style="display:none; text-align:center; padding:8px;">
          <div style="font-size:32px;">✅</div>
          <div style="font-size:13px; font-weight:600; color:#00A651;" id="upload-filename">Fichier joint</div>
          <div style="font-size:11px; color:var(--dz-muted);">Appuyer pour changer</div>
        </div>
      </div>

      <!-- Note field -->
      <div style="margin-top:12px;">
        <label style="font-size:13px; font-weight:600; color:var(--dz-text); display:block; margin-bottom:6px;">
          Note optionnelle (n° transaction, etc.)
        </label>
        <textarea id="payment-note" placeholder="Ex: Transaction BaridiMob n° 002823343656, le 06/08/2024..."
          style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--dz-border); background:var(--dz-surface); font-family:inherit; font-size:13px; color:var(--dz-text); resize:none; min-height:70px; outline:none;"></textarea>
      </div>

      <button onclick="submitPaymentProof()" style="width:100%; margin-top:14px; padding:14px; background:#00A651; color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:inherit;">
        📤 Envoyer la preuve de paiement
      </button>

      <div style="text-align:center; margin-top:12px; font-size:12px; color:var(--dz-muted);">
        Votre compte sera activé sous <strong>24h</strong> après vérification manuelle par notre équipe.
      </div>
    </div>`;
}

/* ══ PAYMENT METHOD SELECTOR ═════════════════ */
let selectedPayMethod = 'baridimob';
function selectPayMethod(method) {
  selectedPayMethod = method;
  ['baridimob','ccp'].forEach(m => {
    const card  = document.getElementById('pay-' + m);
    const check = document.getElementById('check-' + m);
    if (!card || !check) return;
    if (m === method) {
      card.classList.add('active');
      check.style.background = '#00A651';
      check.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
    } else {
      card.classList.remove('active');
      check.style.background = 'var(--dz-border)';
      check.innerHTML = '';
    }
  });
}

/* ══ HANDLE PROOF FILE ═══════════════════════ */
function handleProofFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('upload-placeholder').style.display = 'none';
  document.getElementById('upload-preview').style.display = 'block';
  document.getElementById('upload-filename').textContent = file.name;
  const zone = document.getElementById('upload-zone');
  if (zone) { zone.style.borderColor = '#00A651'; zone.style.background = '#E6F7EE'; }
}

/* ══ SUBMIT PAYMENT PROOF ════════════════════ */
async function submitPaymentProof() {
  const file = document.getElementById("proof-file")?.files[0];
  const note = document.getElementById("payment-note")?.value?.trim();
  if (!file) { showToast("[!] Veuillez joindre votre preuve de paiement"); return; }

  showToast("Envoi en cours...");

  // Generate unique tracking code
  var code = "DZP-" + Math.random().toString(36).substring(2,6).toUpperCase() +
             "-" + Date.now().toString(36).toUpperCase().slice(-4);

  // Save to Firestore
  try {
    if (window._db && window._auth && window._auth.currentUser) {
      var firestoreModule = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
      var docFn = firestoreModule.doc;
      var setDocFn = firestoreModule.setDoc;
      var tsFn = firestoreModule.serverTimestamp;
      await setDocFn(docFn(window._db, "payment_requests", window._auth.currentUser.uid), {
        uid:         window._auth.currentUser.uid,
        email:       window._auth.currentUser.email,
        method:      selectedPayMethod,
        filename:    file.name,
        filesize:    file.size,
        note:        note || "",
        code:        code,
        status:      "pending",
        submittedAt: tsFn()
      });
    }
  } catch(e) { console.log("Firestore:", e.message); }

  // Show confirmation overlay with code
  var codeEl  = document.getElementById("payment-code-display");
  var overlay = document.getElementById("payment-confirm-overlay");
  if (codeEl)  codeEl.textContent = code;
  if (overlay) overlay.style.display = "flex";
  else { showToast("Preuve envoyee !"); navigate("dashboard"); }
}

/* ══ MERCHANT PRODUCT FORM ═══════════════════ */
function renderAddProductForm() {
  const el = document.getElementById('add-product-content');
  if (!el) return;
  el.innerHTML = `
    <div style="padding:0 16px 32px;">
      <!-- Product name -->
      <div class="form-group">
        <label>Nom du produit *</label>
        <div class="input-wrap">
          <i class="ti ti-package"></i>
          <input type="text" id="prod-name" placeholder="Ex: Huile Fleurial 5L" maxlength="100">
        </div>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label>Catégorie *</label>
        <div class="input-wrap">
          <i class="ti ti-category"></i>
          <select id="prod-cat">
            <option value="">Choisir une catégorie</option>
            <option value="alimentaire">🛒 Alimentaire</option>
            <option value="electro">📺 Électroménager</option>
            <option value="telephones">📱 Téléphones</option>
            <option value="informatique">💻 Informatique</option>
            <option value="mode">👗 Mode</option>
            <option value="beaute">💄 Beauté</option>
            <option value="pharmacie">💊 Pharmacie</option>
            <option value="maison">🏠 Maison</option>
          </select>
        </div>
      </div>

      <!-- Prices -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group">
          <label>Prix normal (DA) *</label>
          <div class="input-wrap">
            <i class="ti ti-coin"></i>
            <input type="number" id="prod-old-price" placeholder="2700" min="0" oninput="calcDiscount()">
          </div>
        </div>
        <div class="form-group">
          <label>Prix promo (DA) *</label>
          <div class="input-wrap">
            <i class="ti ti-tag"></i>
            <input type="number" id="prod-new-price" placeholder="1890" min="0" oninput="calcDiscount()">
          </div>
        </div>
      </div>

      <!-- Discount preview -->
      <div id="discount-preview" style="display:none; background:#E6F7EE; border:1px solid #00A651; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; align-items:center; gap:10px;">
        <div style="font-size:22px; font-weight:900; color:#00A651;" id="discount-pct">-0%</div>
        <div style="font-size:13px; color:#007A3D;">Réduction calculée automatiquement<br>La <strong>banderolle promo</strong> sera affichée sur votre article</div>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>Description</label>
        <div class="input-wrap" style="align-items:flex-start; padding-top:10px;">
          <i class="ti ti-align-left" style="margin-top:2px;"></i>
          <textarea id="prod-desc" placeholder="Décrivez votre produit..." rows="3"
            style="flex:1;border:none;background:none;font-family:inherit;font-size:14px;color:var(--dz-text);resize:none;outline:none;"></textarea>
        </div>
      </div>

      <!-- Expiry -->
      <div class="form-group">
        <label>Date d'expiration de la promo</label>
        <div class="input-wrap">
          <i class="ti ti-calendar"></i>
          <input type="date" id="prod-expiry">
        </div>
      </div>

      <!-- Photos — up to 4 -->
      <div style="font-size:14px; font-weight:700; color:var(--dz-text); margin-bottom:10px;">
        Photos du produit <span style="font-size:12px; font-weight:400; color:var(--dz-muted);">(jusqu'à 4 photos)</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        ${[1,2,3,4].map(n => `
          <div class="photo-slot" id="photo-slot-${n}" onclick="document.getElementById('photo-input-${n}').click()"
            style="aspect-ratio:1; border:1.5px dashed var(--dz-border); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:var(--dz-surface); position:relative; overflow:hidden;">
            <input type="file" id="photo-input-${n}" accept="image/*" style="display:none;" onchange="previewPhoto(${n}, event)">
            <div id="photo-placeholder-${n}">
              <i class="ti ti-camera" style="font-size:28px; color:var(--dz-muted); display:block; text-align:center;"></i>
              <div style="font-size:11px; color:var(--dz-muted); margin-top:4px;">Photo ${n}</div>
            </div>
            <img id="photo-preview-${n}" style="display:none; position:absolute; inset:0; width:100%; height:100%; object-fit:cover; border-radius:10px;">
            <button id="photo-remove-${n}" onclick="removePhoto(${n}, event)" style="display:none; position:absolute; top:6px; right:6px; width:22px; height:22px; border-radius:50%; background:#E24B4A; color:#fff; border:none; cursor:pointer; font-size:12px; align-items:center; justify-content:center;">×</button>
          </div>`).join('')}
      </div>

      <!-- Promo banner toggle -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--dz-surface); border:1px solid var(--dz-border); border-radius:12px; padding:12px 14px; margin-bottom:16px;">
        <div>
          <div style="font-size:14px; font-weight:600; color:var(--dz-text);">Banderolle Promotion</div>
          <div style="font-size:12px; color:var(--dz-muted);">Affiche un badge rouge "-X%" sur votre article</div>
        </div>
        <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
          <input type="checkbox" id="show-banner" checked style="opacity:0; width:0; height:0;">
          <span id="toggle-span" style="position:absolute; inset:0; background:#00A651; border-radius:12px; transition:0.2s;" onclick="toggleBanner()">
            <span style="position:absolute; left:2px; top:2px; width:20px; height:20px; background:#fff; border-radius:50%; transition:0.2s;" id="toggle-knob"></span>
          </span>
        </label>
      </div>

      <button onclick="submitProduct()" style="width:100%; padding:14px; background:#00A651; color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:inherit;">
        <i class="ti ti-plus"></i> Publier la promotion
      </button>
    </div>`;

  // Set min date to today
  const dateInput = document.getElementById('prod-expiry');
  if (dateInput) { dateInput.min = new Date().toISOString().split('T')[0]; }
}

function calcDiscount() {
  const oldP = parseFloat(document.getElementById('prod-old-price')?.value) || 0;
  const newP = parseFloat(document.getElementById('prod-new-price')?.value) || 0;
  const preview = document.getElementById('discount-preview');
  const pctEl   = document.getElementById('discount-pct');
  if (!preview || !pctEl) return;
  if (oldP > 0 && newP > 0 && newP < oldP) {
    const pct = Math.round(((oldP - newP) / oldP) * 100);
    pctEl.textContent = '-' + pct + '%';
    preview.style.display = 'flex';
  } else {
    preview.style.display = 'none';
  }
}

function previewPhoto(n, e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById(`photo-placeholder-${n}`).style.display = 'none';
    const img = document.getElementById(`photo-preview-${n}`);
    img.src = ev.target.result;
    img.style.display = 'block';
    const rm = document.getElementById(`photo-remove-${n}`);
    rm.style.display = 'flex';
    const slot = document.getElementById(`photo-slot-${n}`);
    slot.style.border = '1.5px solid #00A651';
  };
  reader.readAsDataURL(file);
}

function removePhoto(n, e) {
  e.stopPropagation();
  document.getElementById(`photo-placeholder-${n}`).style.display = 'block';
  const img = document.getElementById(`photo-preview-${n}`);
  img.src = ''; img.style.display = 'none';
  document.getElementById(`photo-remove-${n}`).style.display = 'none';
  document.getElementById(`photo-input-${n}`).value = '';
  document.getElementById(`photo-slot-${n}`).style.border = '1.5px dashed var(--dz-border)';
}

let bannerOn = true;
function toggleBanner() {
  bannerOn = !bannerOn;
  const span  = document.getElementById('toggle-span');
  const knob  = document.getElementById('toggle-knob');
  if (!span || !knob) return;
  span.style.background = bannerOn ? '#00A651' : '#ccc';
  knob.style.transform  = bannerOn ? 'translateX(20px)' : 'translateX(0)';
}

async function submitProduct() {
  const name   = document.getElementById('prod-name')?.value?.trim();
  const cat    = document.getElementById('prod-cat')?.value;
  const desc   = document.getElementById('prod-desc')?.value?.trim();
  const oldP   = document.getElementById('prod-old-price')?.value;
  const newP   = document.getElementById('prod-new-price')?.value;
  const expiry = document.getElementById('prod-expiry')?.value;

  if (!name || !cat || !oldP || !newP) {
    showToast("[!] Remplissez les champs obligatoires"); return;
  }
  if (parseFloat(newP) >= parseFloat(oldP)) {
    showToast("[!] Prix promo doit etre inferieur au prix normal"); return;
  }

  showToast("Publication en cours...");

  // Emoji par categorie
  var emojis = {
    alimentaire:"🛒", electro:"📺", telephones:"📱",
    informatique:"💻", mode:"👗", beaute:"💄",
    pharmacie:"💊", maison:"🏠"
  };

  var productData = {
    nom:           name,
    categorie:     cat,
    description:   desc || '',
    emoji:         emojis[cat] || "🏷️",
    prixNormal:    parseFloat(oldP),
    prixPromo:     parseFloat(newP),
    dateExpiration: expiry || ''
  };

  // Sauvegarder dans Firestore si disponible
  if (window.saveProductToFirestore) {
    var savedId = await window.saveProductToFirestore(productData);
    if (savedId) {
      showToast("Produit publie ! Visible par tous les clients.");
      // Recharger les produits pour mise a jour immediate
      if (window.loadProductsFromFirestore) {
        await window.loadProductsFromFirestore();
        renderHome();
      }
      // Recharger les produits du commercant dans le dashboard
      if (window.loadMerchantProducts && window._auth?.currentUser) {
        var prods = await window.loadMerchantProducts(window._auth.currentUser.uid);
        DZ.dashboardPromos = prods.map(function(p) {
          return {
            id:     p.id,
            emoji:  p.emoji || "🏷️",
            name:   p.nom   || "Produit",
            meta:   (p.prixPromo || 0) + " DA · Expire " + (p.dateExpiration || ""),
            views:  p.vues  || 0,
            status: p.actif ? "active" : "expired"
          };
        });
      }
      navigate('dashboard');
      return;
    }
  }

  // Fallback si Firestore non disponible
  showToast("Produit publie avec succes !");
  navigate('dashboard');
}
