# 🏷️ DZ Promo — Guide de Déploiement Complet

## Structure du Projet

```
dzpromo/
├── index.html          ← Application principale (toutes les pages)
├── manifest.json       ← Configuration PWA
├── sw.js               ← Service Worker (cache offline)
├── css/
│   └── app.css         ← Tous les styles
├── js/
│   ├── data.js         ← Données (remplacer par Supabase)
│   └── app.js          ← Logique de l'application
└── icons/
    ├── icon-192.png    ← Icône PWA
    └── icon-512.png    ← Icône PWA grande
```

---

## 🚀 Méthode 1 : Déploiement sur Vercel (GRATUIT — RECOMMANDÉ)

### Étape 1 — Créer un compte Vercel
Aller sur https://vercel.com → Créer un compte gratuit

### Étape 2 — Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 3 — Déployer en une commande
```bash
cd dzpromo
vercel --prod
```

→ Vercel génère une URL publique type `dzpromo.vercel.app`
→ Vous pouvez aussi connecter votre domaine personnalisé (ex: dzpromo.dz)

---

## 🚀 Méthode 2 : Déploiement sur Netlify (GRATUIT)

### Via interface web (sans terminal)
1. Aller sur https://netlify.com → Créer un compte
2. Glisser-déposer le dossier `dzpromo/` dans l'interface
3. Netlify génère une URL type `dzpromo.netlify.app`

### Via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dzpromo
```

---

## 🚀 Méthode 3 : GitHub Pages (GRATUIT)

1. Créer un repo GitHub: `dzpromo`
2. Uploader tous les fichiers
3. Aller dans Settings → Pages → Source: main branch
4. URL: `votre-username.github.io/dzpromo`

---

## 📱 Comment installer l'app sur un téléphone

### Android (Chrome)
1. Ouvrir l'URL dans Chrome
2. Appuyer sur les 3 points (menu)
3. "Ajouter à l'écran d'accueil"
4. L'app apparaît comme une vraie app native !

### iPhone/iPad (Safari)
1. Ouvrir l'URL dans Safari
2. Appuyer sur le bouton Partager (carré avec flèche)
3. "Sur l'écran d'accueil"
4. L'app s'installe sans App Store !

---

## 🗄️ Backend — Supabase (Base de données)

### Étape 1 — Créer un projet Supabase
1. Aller sur https://supabase.com
2. Créer un projet gratuit
3. Copier votre `URL` et `anon key`

### Étape 2 — Créer les tables SQL

```sql
-- Table Produits
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  category VARCHAR(50),
  description TEXT,
  best_price INTEGER,
  old_price INTEGER,
  discount INTEGER,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Vendeurs
CREATE TABLE sellers (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  name VARCHAR(255),
  distance FLOAT,
  price INTEGER,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Magasins
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  emoji VARCHAR(10),
  address TEXT,
  latitude FLOAT,
  longitude FLOAT,
  phone VARCHAR(20),
  hours VARCHAR(100),
  is_open BOOLEAN DEFAULT TRUE,
  promo_count INTEGER DEFAULT 0
);

-- Table Utilisateurs (étendue de auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Favoris
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Table Historique des Prix
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  seller_id INTEGER REFERENCES sellers(id),
  price INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Table Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Commerçants
CREATE TABLE merchants (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  store_id INTEGER REFERENCES stores(id),
  plan VARCHAR(20) DEFAULT 'free', -- free, pro, premium
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Étape 3 — Connecter Supabase dans app.js

Ajouter dans `index.html` avant `js/app.js`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Ajouter en haut de `js/app.js`:
```javascript
const SUPABASE_URL = 'https://VOTRE-ID.supabase.co';
const SUPABASE_KEY = 'votre-anon-key';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Remplacer les données mock par des vraies requêtes:
async function loadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, sellers(*)')
    .order('discount', { ascending: false });
  if (!error) return data;
  return DZ.products; // fallback
}
```

---

## 🌐 Domaine Personnalisé (.dz ou .com)

Pour acheter un domaine `.dz`:
- https://www.nic.dz (domaine algérien officiel)

Pour domaine `.com` moins cher:
- https://namecheap.com (~10$/an)

Configurer sur Vercel:
1. Dashboard → Project → Settings → Domains
2. Ajouter votre domaine
3. Modifier les DNS chez votre registrar

---

## 💰 Coûts Estimés

| Service | Prix | Notes |
|---------|------|-------|
| Vercel/Netlify | GRATUIT | Jusqu'à 100GB/mois |
| Supabase | GRATUIT | Jusqu'à 500MB data |
| Domaine .com | ~1,500 DA/an | Via Namecheap |
| Domaine .dz | ~3,000 DA/an | Via NIC.DZ |
| **TOTAL démarrage** | **~0 DA** | Plan gratuit suffit |

---

## 📲 Pas besoin de compilation !

✅ C'est une PWA = site web qui s'installe comme une app  
✅ Pas d'App Store / Play Store nécessaire  
✅ Mise à jour automatique (l'utilisateur a toujours la dernière version)  
✅ Fonctionne hors ligne (Service Worker)  
✅ Notification push possible  
✅ Icône sur l'écran d'accueil  

---

## 🔧 Technologies utilisées

- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript (léger, rapide)
- **PWA**: Service Worker + Web App Manifest
- **Icônes**: Tabler Icons (open source)
- **Polices**: Google Fonts (Cairo)
- **Backend recommandé**: Supabase (PostgreSQL + Auth + Storage)
- **Hébergement**: Vercel ou Netlify

---

## 📞 Support

Pour toute question sur le déploiement,
consultez la documentation officielle:
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- PWA: https://web.dev/progressive-web-apps
