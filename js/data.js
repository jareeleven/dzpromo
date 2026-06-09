// ============================================
//   DZ PROMO — Data Layer (js/data.js)
//   Mock data — replace with Supabase API calls
// ============================================

const DZ = {

  user: {
    name: "Ahmed Kaddouri",
    email: "ahmed.k@gmail.com",
    initials: "AK",
    city: "Oran",
    favorites: [1, 3, 5, 8],
    saved: 12400
  },

  products: [
    {
      id: 1,
      name: "Huile de table Fleurial 5L",
      emoji: "🛢️",
      category: "alimentaire",
      desc: "Huile végétale raffinée, idéale pour la friture et la cuisine quotidienne. Bouteille plastique refermable.",
      bestPrice: 1890,
      oldPrice: 2700,
      discount: 30,
      expiry: "2 jours",
      tags: ["Alimentaire", "Flash Deal"],
      priceHistory: [2700, 2600, 2700, 2700, 2500, 1890],
      sellers: [
        { name: "🛒 Uno Market Oran", dist: "0.8 km", price: 1890, stock: true, best: true },
        { name: "🏪 Ardis Hypermarché", dist: "2.1 km", price: 2100, stock: true, best: false },
        { name: "🏬 Brahim Market", dist: "3.5 km", price: 2350, stock: true, best: false }
      ]
    },
    {
      id: 2,
      name: "Samsung Galaxy A15 128GB",
      emoji: "📱",
      category: "telephones",
      desc: "Smartphone Android 6.5 pouces, 4Go RAM, 128Go stockage, batterie 5000mAh.",
      bestPrice: 42000,
      oldPrice: 52500,
      discount: 20,
      expiry: "5 jours",
      tags: ["Téléphones", "Promo"],
      priceHistory: [52500, 52500, 50000, 48000, 45000, 42000],
      sellers: [
        { name: "📱 Condor Store", dist: "1.2 km", price: 42000, stock: true, best: true },
        { name: "🖥️ Tech Plus", dist: "2.8 km", price: 44500, stock: true, best: false },
        { name: "🏬 Electro Maher", dist: "4.0 km", price: 46000, stock: true, best: false },
        { name: "📦 GSM Center", dist: "5.1 km", price: 47000, stock: false, best: false }
      ]
    },
    {
      id: 3,
      name: "Shampooing Head & Shoulders 400ml",
      emoji: "🧴",
      category: "beaute",
      desc: "Shampooing antipelliculaire pour cheveux normaux. Formule renforcée zinc.",
      bestPrice: 550,
      oldPrice: 920,
      discount: 40,
      expiry: "3 jours",
      tags: ["Beauté", "Flash Deal"],
      priceHistory: [920, 900, 880, 800, 700, 550],
      sellers: [
        { name: "💊 Pharmacie El Badr", dist: "0.5 km", price: 550, stock: true, best: true },
        { name: "🏪 Uno Market", dist: "0.8 km", price: 680, stock: true, best: false },
        { name: "💄 Beauty Shop", dist: "1.9 km", price: 750, stock: true, best: false }
      ]
    },
    {
      id: 4,
      name: "Café Mokarabia 250g",
      emoji: "☕",
      category: "alimentaire",
      desc: "Café moulu arabica de qualité supérieure, torréfaction artisanale.",
      bestPrice: 680,
      oldPrice: 910,
      discount: 25,
      expiry: "7 jours",
      tags: ["Alimentaire"],
      priceHistory: [910, 910, 850, 820, 800, 680],
      sellers: [
        { name: "🏪 Ardis", dist: "2.1 km", price: 680, stock: true, best: true },
        { name: "🛒 Uno Market", dist: "0.8 km", price: 780, stock: true, best: false }
      ]
    },
    {
      id: 5,
      name: "Nike Air Max 270",
      emoji: "👟",
      category: "mode",
      desc: "Chaussures de sport Nike avec semelle Air Max. Disponible en plusieurs tailles.",
      bestPrice: 12500,
      oldPrice: 19200,
      discount: 35,
      expiry: "4 jours",
      tags: ["Mode", "Flash Deal"],
      priceHistory: [19200, 19200, 18000, 16500, 15000, 12500],
      sellers: [
        { name: "👟 Sport Zone Oran", dist: "2.8 km", price: 12500, stock: true, best: true },
        { name: "🏬 Fashion Store", dist: "3.5 km", price: 14000, stock: true, best: false },
        { name: "🛍️ Trend Market", dist: "4.2 km", price: 15500, stock: false, best: false }
      ]
    },
    {
      id: 6,
      name: "PC HP Intel i5 8Go 256Go SSD",
      emoji: "🖥️",
      category: "informatique",
      desc: "Ordinateur portable HP 15 pouces, Intel Core i5, 8Go RAM DDR4, SSD 256Go.",
      bestPrice: 67000,
      oldPrice: 79000,
      discount: 15,
      expiry: "10 jours",
      tags: ["Informatique", "Promo"],
      priceHistory: [79000, 79000, 75000, 72000, 70000, 67000],
      sellers: [
        { name: "💻 Info Center", dist: "1.8 km", price: 67000, stock: true, best: true },
        { name: "🖥️ Tech Plus", dist: "2.8 km", price: 71000, stock: true, best: false },
        { name: "📦 Digitek", dist: "3.3 km", price: 73500, stock: true, best: false }
      ]
    },
    {
      id: 7,
      name: "Climatiseur Condor 12000 BTU",
      emoji: "❄️",
      category: "electro",
      desc: "Climatiseur split Condor 12000 BTU, classe A+, Wifi intégré, installation incluse.",
      bestPrice: 55000,
      oldPrice: 67000,
      discount: 18,
      expiry: "14 jours",
      tags: ["Électro"],
      priceHistory: [67000, 67000, 65000, 62000, 58000, 55000],
      sellers: [
        { name: "🏭 Condor Direct", dist: "1.5 km", price: 55000, stock: true, best: true },
        { name: "❄️ Froid Expert", dist: "3.2 km", price: 58500, stock: true, best: false },
        { name: "🏪 Électro Bouzidi", dist: "4.0 km", price: 61000, stock: true, best: false }
      ]
    },
    {
      id: 8,
      name: "Lait Candia 1L x6",
      emoji: "🥛",
      category: "alimentaire",
      desc: "Pack de 6 briques de lait demi-écrémé Candia longue conservation.",
      bestPrice: 1200,
      oldPrice: 1500,
      discount: 20,
      expiry: "2 jours",
      tags: ["Alimentaire"],
      priceHistory: [1500, 1500, 1450, 1400, 1350, 1200],
      sellers: [
        { name: "🛒 Uno Market", dist: "0.8 km", price: 1200, stock: true, best: true },
        { name: "🏪 Ardis", dist: "2.1 km", price: 1350, stock: true, best: false }
      ]
    }
  ],

  stores: [
    { name: "Uno Market Oran", emoji: "🛒", promos: 23, dist: "0.8 km", hours: "Ouvert jusqu'à 22h", open: true },
    { name: "Condor Store", emoji: "📱", promos: 11, dist: "1.2 km", hours: "Ouvert", open: true },
    { name: "Condor Direct (Électro)", emoji: "❄️", promos: 8, dist: "1.5 km", hours: "Ouvert jusqu'à 20h", open: true },
    { name: "Ardis Hypermarché", emoji: "🏪", promos: 45, dist: "2.1 km", hours: "Ouvert 24h/24", open: true },
    { name: "Sport Zone Oran", emoji: "👟", promos: 6, dist: "2.8 km", hours: "Ouvert jusqu'à 21h", open: true },
    { name: "Info Center", emoji: "💻", promos: 4, dist: "1.8 km", hours: "Fermé à 19h", open: false },
    { name: "Pharmacie El Badr", emoji: "💊", promos: 3, dist: "0.5 km", hours: "Ouvert 24h/24", open: true },
    { name: "Fashion Store", emoji: "👗", promos: 7, dist: "3.5 km", hours: "Ouvert jusqu'à 21h", open: true }
  ],

  notifications: [
    {
      id: 1,
      type: "price_drop",
      icon: "📉",
      color: "green",
      title: "Baisse de prix ! Nike Air Max 270",
      body: "Le prix est passé de 19,200 DA à 12,500 DA (-35%) chez Sport Zone Oran",
      time: "Il y a 15 min",
      unread: true
    },
    {
      id: 2,
      type: "flash",
      icon: "⚡",
      color: "orange",
      title: "Offre Flash : Huile Fleurial -30%",
      body: "Expire dans 2 jours ! Disponible chez Uno Market Oran à 1,890 DA",
      time: "Il y a 1h",
      unread: true
    },
    {
      id: 3,
      type: "new_store",
      icon: "🏪",
      color: "green",
      title: "Nouveau magasin près de vous",
      body: "Ardis Hypermarché a ouvert avec 45 promotions actives à 2.1 km de vous",
      time: "Hier à 14:30",
      unread: false
    },
    {
      id: 4,
      type: "restock",
      icon: "📱",
      color: "orange",
      title: "Samsung A15 de nouveau disponible",
      body: "Le Samsung Galaxy A15 est de nouveau en stock à 42,000 DA chez Condor Store",
      time: "Hier à 09:00",
      unread: false
    },
    {
      id: 5,
      type: "price_drop",
      icon: "📉",
      color: "green",
      title: "Baisse de prix ! Café Mokarabia",
      body: "Prix réduit de 910 DA à 680 DA (-25%) chez Ardis Hypermarché",
      time: "Il y a 2 jours",
      unread: false
    }
  ],

  dashboardPromos: [
    { emoji: "🛢️", name: "Huile Fleurial 5L", meta: "1,890 DA · Expire dans 2j", views: 248, status: "active" },
    { emoji: "🍚", name: "Riz Extra 5kg", meta: "2,200 DA · Expire dans 5j", views: 132, status: "active" },
    { emoji: "🧃", name: "Jus Ramy 1L x6", meta: "890 DA · Expiré", views: 87, status: "expired" },
    { emoji: "🥛", name: "Lait Candia 1L x6", meta: "1,200 DA · Expire dans 2j", views: 64, status: "active" }
  ],

  compareProducts: [
    {
      id: 1,
      emoji: "🛢️",
      name: "Huile Fleurial 5L",
      meta: "3 vendeurs · MAJ il y a 2h",
      sellers: [
        { name: "🛒 Uno Market", dist: "0.8 km", price: 1890, best: true },
        { name: "🏪 Ardis", dist: "2.1 km", price: 2100, best: false },
        { name: "🏬 Brahim Market", dist: "3.5 km", price: 2350, best: false }
      ]
    },
    {
      id: 2,
      emoji: "📱",
      name: "Samsung Galaxy A15",
      meta: "4 vendeurs · MAJ il y a 1h",
      sellers: [
        { name: "📱 Condor Store", dist: "1.2 km", price: 42000, best: true },
        { name: "🖥️ Tech Plus", dist: "2.8 km", price: 44500, best: false },
        { name: "🏬 Electro Maher", dist: "4.0 km", price: 46000, best: false }
      ]
    },
    {
      id: 3,
      emoji: "❄️",
      name: "Climatiseur Condor 12000 BTU",
      meta: "5 vendeurs · MAJ il y a 30min",
      sellers: [
        { name: "🏭 Condor Direct", dist: "1.5 km", price: 55000, best: true },
        { name: "❄️ Froid Expert", dist: "3.2 km", price: 58500, best: false },
        { name: "🏪 Électro Bouzidi", dist: "4.0 km", price: 61000, best: false }
      ]
    }
  ]
};
