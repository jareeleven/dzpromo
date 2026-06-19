// ============================================
//   DZ PROMO v2.0 — Firestore Data Layer
//   Remplace les données fictives de data.js
//   par les vraies données des commerçants
// ============================================

// Flag pour savoir si Firestore est prêt
window._firestoreReady = false;

// Cache local des produits Firestore
window._fsProducts = [];
window._fsStores   = [];

/* ══ CHARGER TOUS LES PRODUITS ACTIFS ══════════════════ */
window.loadProductsFromFirestore = async function() {
  try {
    if (!window._db) {
      console.log('[Firestore] db not ready yet, using mock data');
      return false;
    }

    const { collection, getDocs, query, where, orderBy, limit } =
      await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");

    const db = window._db;

    // Charger produits actifs
    const q = query(
      collection(db, 'products'),
      where('actif', '==', true)
    );

    const snap = await getDocs(q);
    const products = [];

    snap.forEach(doc => {
      const d = doc.data();
      products.push({
        id:         doc.id,
        name:       d.nom        || d.name || 'Produit',
        emoji:      d.emoji      || '🏷️',
        category:   d.categorie  || d.category || 'autre',
        desc:       d.description || '',
        bestPrice:  d.prixPromo  || d.bestPrice || 0,
        oldPrice:   d.prixNormal || d.oldPrice  || 0,
        discount:   d.reduction  || d.discount  || 0,
        expiry:     d.dateExpiration || '7 jours',
        tags:       d.tags       || [d.categorie || 'Promo'],
        photos:     d.photos     || [d.emoji || '🏷️'],
        banderolle: d.banderolle !== false,
        merchantId: d.merchantId || d.uid || null,
        priceHistory: d.priceHistory || [d.prixNormal, d.prixPromo],
        sellers: [{
          name:  d.magasin   || d.storeName || 'Magasin',
          dist:  d.distance  || '-- km',
          price: d.prixPromo || 0,
          stock: d.enStock   !== false,
          best:  true,
          lat:   d.latitude  || 35.6976,
          lng:   d.longitude || -0.6337,
          address: d.adresse || d.adresseMagasin || ''
        }]
      });
    });

    if (products.length > 0) {
      window._fsProducts = products;
      // Remplacer les données mock par les vraies données Firestore
      DZ.products = products;
      window._firestoreReady = true;
      console.log('[Firestore] Charges ' + products.length + ' produits');
      return true;
    } else {
      console.log('[Firestore] Aucun produit actif trouve — données demo affichées');
      return false;
    }

  } catch(e) {
    console.warn('[Firestore] Erreur chargement produits:', e.message);
    return false;
  }
};

/* ══ SAUVEGARDER UN PRODUIT COMMERÇANT ═════════════════ */
window.saveProductToFirestore = async function(productData) {
  try {
    if (!window._db || !window._auth?.currentUser) {
      showToast('Vous devez etre connecte');
      return false;
    }

    const { collection, addDoc, serverTimestamp } =
      await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");

    const user = window._auth.currentUser;

    // Récupérer info du magasin depuis le profil
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");

    const userSnap = await getDoc(doc(window._db, 'users', user.uid));
    const userData = userSnap.exists() ? userSnap.data() : {};

    const docData = {
      // Infos produit
      nom:         productData.nom         || '',
      description: productData.description || '',
      categorie:   productData.categorie   || '',
      emoji:       productData.emoji       || '🏷️',
      prixNormal:  Number(productData.prixNormal) || 0,
      prixPromo:   Number(productData.prixPromo)  || 0,
      reduction:   Math.round(((productData.prixNormal - productData.prixPromo) / productData.prixNormal) * 100),
      dateExpiration: productData.dateExpiration || '',
      banderolle:  true,

      // Infos magasin (depuis profil commerçant)
      merchantId:  user.uid,
      merchantEmail: user.email,
      magasin:     userData.storeName    || userData.name || '',
      adresse:     userData.storeAddress || '',
      latitude:    userData.latitude     || 35.6976,
      longitude:   userData.longitude    || -0.6337,
      telephone:   userData.phone        || '',

      // Statut
      actif:       true,
      enStock:     true,
      vues:        0,
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp()
    };

    const ref = await addDoc(collection(window._db, 'products'), docData);
    console.log('[Firestore] Produit sauvegarde:', ref.id);
    return ref.id;

  } catch(e) {
    console.error('[Firestore] Erreur sauvegarde:', e.message);
    showToast('Erreur: ' + e.message);
    return false;
  }
};

/* ══ INCRÉMENTER LES VUES ══════════════════════════════ */
window.incrementProductViews = async function(productId) {
  try {
    if (!window._db) return;
    const { doc, updateDoc, increment } =
      await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
    await updateDoc(doc(window._db, 'products', productId), {
      vues: increment(1)
    });
  } catch(_) {}
};

/* ══ CHARGER LES PRODUITS D'UN COMMERÇANT ══════════════ */
window.loadMerchantProducts = async function(uid) {
  try {
    if (!window._db) return [];
    const { collection, getDocs, query, where } =
      await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
    const q = query(
      collection(window._db, 'products'),
      where('merchantId', '==', uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {
    return [];
  }
};
