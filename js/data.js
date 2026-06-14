// ============================================
//   DZ PROMO v2.0 — Data Layer
// ============================================
const DZ = {
  user: {
    name: "Ahmed Kaddouri", email: "ahmed.k@gmail.com",
    initials: "AK", city: "Oran", uid: null,
    favorites: [], saved: 12400, role: "user"
  },

  products: [
    { id:1, name:"Huile de table Fleurial 5L", emoji:"🛢️", category:"alimentaire",
      desc:"Huile végétale raffinée, idéale pour la friture. Bouteille plastique refermable.",
      bestPrice:1890, oldPrice:2700, discount:30, expiry:"2 jours",
      tags:["Alimentaire","Flash Deal"],
      priceHistory:[2700,2600,2700,2700,2500,1890],
      photos:["🛢️","📦","🏪","✅"],
      sellers:[
        {name:"🛒 Uno Market Oran", dist:"0.8 km", price:1890, stock:true, best:true, lat:35.6976, lng:-0.6337},
        {name:"🏪 Ardis Hypermarché", dist:"2.1 km", price:2100, stock:true, best:false, lat:35.7021, lng:-0.6289},
        {name:"🏬 Brahim Market", dist:"3.5 km", price:2350, stock:true, best:false, lat:35.6901, lng:-0.6412}
      ]
    },
    { id:2, name:"Samsung Galaxy A15 128GB", emoji:"📱", category:"telephones",
      desc:"Smartphone 6.5 pouces, 4Go RAM, 128Go stockage, batterie 5000mAh.",
      bestPrice:42000, oldPrice:52500, discount:20, expiry:"5 jours",
      tags:["Téléphones","Promo"],
      priceHistory:[52500,52500,50000,48000,45000,42000],
      photos:["📱","📦","🔋","🎁"],
      sellers:[
        {name:"📱 Condor Store", dist:"1.2 km", price:42000, stock:true, best:true, lat:35.6956, lng:-0.6301},
        {name:"🖥️ Tech Plus", dist:"2.8 km", price:44500, stock:true, best:false, lat:35.7012, lng:-0.6198},
        {name:"🏬 Electro Maher", dist:"4.0 km", price:46000, stock:true, best:false, lat:35.6878, lng:-0.6523}
      ]
    },
    { id:3, name:"Shampooing Head & Shoulders 400ml", emoji:"🧴", category:"beaute",
      desc:"Shampooing antipelliculaire formule zinc renforcée.",
      bestPrice:550, oldPrice:920, discount:40, expiry:"3 jours",
      tags:["Beauté","Flash Deal"],
      priceHistory:[920,900,880,800,700,550],
      photos:["🧴","💆","✨","📦"],
      sellers:[
        {name:"💊 Pharmacie El Badr", dist:"0.5 km", price:550, stock:true, best:true, lat:35.6989, lng:-0.6345},
        {name:"🏪 Uno Market", dist:"0.8 km", price:680, stock:true, best:false, lat:35.6976, lng:-0.6337},
        {name:"💄 Beauty Shop", dist:"1.9 km", price:750, stock:true, best:false, lat:35.7034, lng:-0.6267}
      ]
    },
    { id:4, name:"Café Mokarabia 250g", emoji:"☕", category:"alimentaire",
      desc:"Café moulu arabica torréfaction artisanale.",
      bestPrice:680, oldPrice:910, discount:25, expiry:"7 jours",
      tags:["Alimentaire"],
      priceHistory:[910,910,850,820,800,680],
      photos:["☕","🫘","📦","🏪"],
      sellers:[
        {name:"🏪 Ardis", dist:"2.1 km", price:680, stock:true, best:true, lat:35.7021, lng:-0.6289},
        {name:"🛒 Uno Market", dist:"0.8 km", price:780, stock:true, best:false, lat:35.6976, lng:-0.6337}
      ]
    },
    { id:5, name:"Nike Air Max 270", emoji:"👟", category:"mode",
      desc:"Chaussures de sport Nike semelle Air Max. Plusieurs tailles disponibles.",
      bestPrice:12500, oldPrice:19200, discount:35, expiry:"4 jours",
      tags:["Mode","Flash Deal"],
      priceHistory:[19200,19200,18000,16500,15000,12500],
      photos:["👟","👟","📦","🏷️"],
      sellers:[
        {name:"👟 Sport Zone Oran", dist:"2.8 km", price:12500, stock:true, best:true, lat:35.6912, lng:-0.6456},
        {name:"🏬 Fashion Store", dist:"3.5 km", price:14000, stock:true, best:false, lat:35.6889, lng:-0.6501},
        {name:"🛍️ Trend Market", dist:"4.2 km", price:15500, stock:false, best:false, lat:35.6845, lng:-0.6578}
      ]
    },
    { id:6, name:"PC HP Intel i5 8Go 256Go SSD", emoji:"🖥️", category:"informatique",
      desc:"Ordinateur portable HP 15 pouces, Intel Core i5, 8Go RAM DDR4, SSD 256Go.",
      bestPrice:67000, oldPrice:79000, discount:15, expiry:"10 jours",
      tags:["Informatique","Promo"],
      priceHistory:[79000,79000,75000,72000,70000,67000],
      photos:["🖥️","⌨️","🔌","📦"],
      sellers:[
        {name:"💻 Info Center", dist:"1.8 km", price:67000, stock:true, best:true, lat:35.6967, lng:-0.6312},
        {name:"🖥️ Tech Plus", dist:"2.8 km", price:71000, stock:true, best:false, lat:35.7012, lng:-0.6198},
        {name:"📦 Digitek", dist:"3.3 km", price:73500, stock:true, best:false, lat:35.6934, lng:-0.6489}
      ]
    },
    { id:7, name:"Climatiseur Condor 12000 BTU", emoji:"❄️", category:"electro",
      desc:"Climatiseur split Condor 12000 BTU, classe A+, Wifi intégré.",
      bestPrice:55000, oldPrice:67000, discount:18, expiry:"14 jours",
      tags:["Électro"],
      priceHistory:[67000,67000,65000,62000,58000,55000],
      photos:["❄️","🔧","📦","✅"],
      sellers:[
        {name:"🏭 Condor Direct", dist:"1.5 km", price:55000, stock:true, best:true, lat:35.6945, lng:-0.6323},
        {name:"❄️ Froid Expert", dist:"3.2 km", price:58500, stock:true, best:false, lat:35.6923, lng:-0.6467},
        {name:"🏪 Électro Bouzidi", dist:"4.0 km", price:61000, stock:true, best:false, lat:35.6867, lng:-0.6534}
      ]
    },
    { id:8, name:"Lait Candia 1L x6", emoji:"🥛", category:"alimentaire",
      desc:"Pack 6 briques lait demi-écrémé longue conservation.",
      bestPrice:1200, oldPrice:1500, discount:20, expiry:"2 jours",
      tags:["Alimentaire"],
      priceHistory:[1500,1500,1450,1400,1350,1200],
      photos:["🥛","📦","🏪","✅"],
      sellers:[
        {name:"🛒 Uno Market", dist:"0.8 km", price:1200, stock:true, best:true, lat:35.6976, lng:-0.6337},
        {name:"🏪 Ardis", dist:"2.1 km", price:1350, stock:true, best:false, lat:35.7021, lng:-0.6289}
      ]
    }
  ],

  stores: [
    {id:1, name:"Uno Market Oran", emoji:"🛒", promos:23, dist:"0.8 km", hours:"22h", open:true,
     address:"Rue Mohamed Benahmed, Oran", lat:35.6976, lng:-0.6337, phone:"041 XX XX XX", type:"alimentaire"},
    {id:2, name:"Condor Store", emoji:"📱", promos:11, dist:"1.2 km", hours:"20h", open:true,
     address:"Boulevard Millénium, Oran", lat:35.6956, lng:-0.6301, phone:"041 XX XX XX", type:"telephones"},
    {id:3, name:"Condor Direct", emoji:"❄️", promos:8, dist:"1.5 km", hours:"20h", open:true,
     address:"Zone Industrielle, Oran", lat:35.6945, lng:-0.6323, phone:"041 XX XX XX", type:"electro"},
    {id:4, name:"Ardis Hypermarché", emoji:"🏪", promos:45, dist:"2.1 km", hours:"24h/24", open:true,
     address:"Route de Canastel, Oran", lat:35.7021, lng:-0.6289, phone:"041 XX XX XX", type:"alimentaire"},
    {id:5, name:"Sport Zone Oran", emoji:"👟", promos:6, dist:"2.8 km", hours:"21h", open:true,
     address:"Centre Commercial Les Pins, Oran", lat:35.6912, lng:-0.6456, phone:"041 XX XX XX", type:"mode"},
    {id:6, name:"Info Center", emoji:"💻", promos:4, dist:"1.8 km", hours:"19h", open:false,
     address:"Rue Larbi Ben M'Hidi, Oran", lat:35.6967, lng:-0.6312, phone:"041 XX XX XX", type:"informatique"},
    {id:7, name:"Pharmacie El Badr", emoji:"💊", promos:3, dist:"0.5 km", hours:"24h/24", open:true,
     address:"Hai El Yasmine, Oran", lat:35.6989, lng:-0.6345, phone:"041 XX XX XX", type:"pharmacie"},
    {id:8, name:"Fashion Store", emoji:"👗", promos:7, dist:"3.5 km", hours:"21h", open:true,
     address:"Rue de la Paix, Oran", lat:35.6889, lng:-0.6501, phone:"041 XX XX XX", type:"mode"}
  ],

  notifications: [
    {id:1, type:"price_drop", icon:"📉", color:"green",
     title:"Baisse de prix ! Nike Air Max 270",
     body:"Prix passé de 19,200 DA à 12,500 DA (-35%) chez Sport Zone Oran",
     time:"Il y a 15 min", unread:true},
    {id:2, type:"flash", icon:"⚡", color:"orange",
     title:"Offre Flash : Huile Fleurial -30%",
     body:"Expire dans 2 jours ! Disponible chez Uno Market à 1,890 DA",
     time:"Il y a 1h", unread:true},
    {id:3, type:"new_store", icon:"🏪", color:"green",
     title:"Nouveau magasin près de vous",
     body:"Ardis Hypermarché : 45 promotions actives à 2.1 km",
     time:"Hier 14:30", unread:false},
    {id:4, type:"restock", icon:"📱", color:"orange",
     title:"Samsung A15 de nouveau disponible",
     body:"En stock à 42,000 DA chez Condor Store",
     time:"Hier 09:00", unread:false},
    {id:5, type:"price_drop", icon:"📉", color:"green",
     title:"Baisse de prix ! Café Mokarabia",
     body:"Prix réduit à 680 DA (-25%) chez Ardis",
     time:"Il y a 2 jours", unread:false}
  ],

  dashboardPromos: [
    {id:1, emoji:"🛢️", name:"Huile Fleurial 5L", meta:"1,890 DA · Expire dans 2j", views:248, status:"active"},
    {id:2, emoji:"🍚", name:"Riz Extra 5kg", meta:"2,200 DA · Expire dans 5j", views:132, status:"active"},
    {id:3, emoji:"🧃", name:"Jus Ramy 1L x6", meta:"890 DA · Expiré", views:87, status:"expired"},
    {id:4, emoji:"🥛", name:"Lait Candia 1L x6", meta:"1,200 DA · Expire dans 2j", views:64, status:"active"}
  ],

  compareProducts: [
    { id:1, emoji:"🛢️", name:"Huile Fleurial 5L", meta:"3 vendeurs · MAJ il y a 2h",
      sellers:[
        {name:"🛒 Uno Market", dist:"0.8 km", price:1890, best:true},
        {name:"🏪 Ardis", dist:"2.1 km", price:2100, best:false},
        {name:"🏬 Brahim Market", dist:"3.5 km", price:2350, best:false}
      ]
    },
    { id:2, emoji:"📱", name:"Samsung Galaxy A15", meta:"4 vendeurs · MAJ il y a 1h",
      sellers:[
        {name:"📱 Condor Store", dist:"1.2 km", price:42000, best:true},
        {name:"🖥️ Tech Plus", dist:"2.8 km", price:44500, best:false},
        {name:"🏬 Electro Maher", dist:"4.0 km", price:46000, best:false}
      ]
    },
    { id:3, emoji:"❄️", name:"Climatiseur Condor 12000 BTU", meta:"5 vendeurs · MAJ il y a 30min",
      sellers:[
        {name:"🏭 Condor Direct", dist:"1.5 km", price:55000, best:true},
        {name:"❄️ Froid Expert", dist:"3.2 km", price:58500, best:false},
        {name:"🏪 Électro Bouzidi", dist:"4.0 km", price:61000, best:false}
      ]
    }
  ],

  // Subscription plans
  subscription: {
    price: 1000,
    currency: "DA",
    label: "À vie",
    trialDays: 30,
    paymentMethods: [
      {id:"baridimob", name:"BaridiMob", icon:"📱", account:"00799999004235254364"},
      {id:"ccp", name:"Virement CCP", icon:"🏦", account:"322867 / Clé 53"},
    ]
  },

  // Search index for autocomplete
  searchIndex: [
    "huile","huile fleurial","huile végétale","samsung","samsung galaxy","samsung a15",
    "smartphone","téléphone","café","café mokarabia","mokarabia","climatiseur","condor",
    "shampooing","head and shoulders","shampoing","nike","nike air max","chaussures",
    "sport","pc","ordinateur","hp","laptop","lait","candia","riz","sucre","farine",
    "tomate","poulet","viande","légumes","fruits","eau","jus","yaourt","fromage",
    "chocolat","biscuit","savon","dentifrice","serviette","couche","pharmacie",
    "médicament","vitamine","parfum","crème","maquillage","robe","pantalon",
    "chemise","veste","chaussure","sac","montre","bijou","maison","cuisine",
    "salon","chambre","matelas","coussin","tapis","rideau","électroménager",
    "réfrigérateur","machine à laver","four","micro-onde","télévision","tv",
    "canapé","table","chaise","armoire","lit","bureau","cartouche","imprimante",
    "papier","stylo","classeur","scolaire","jouet","jeu","sport","ballon",
    "canapé","cartouche","carton","carrelage","câble","casque"
  ]
};
