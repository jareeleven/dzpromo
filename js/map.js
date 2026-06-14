// ============================================
//   DZ PROMO v2.0 — Interactive Map Module
//   Uses OpenStreetMap + Leaflet (free, no API key)
// ============================================

let mapInstance = null;
let userMarker  = null;

function initMap() {
  const container = document.getElementById('leaflet-map');
  if (!container) return;

  // Default center: Oran, Algeria
  const defaultLat = 35.6976, defaultLng = -0.6337;

  if (mapInstance) { mapInstance.remove(); mapInstance = null; }

  mapInstance = L.map('leaflet-map', { zoomControl: true, scrollWheelZoom: false }).setView([defaultLat, defaultLng], 13);

  // OpenStreetMap tiles (free, no API key needed)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  // Add store markers
  DZ.stores.forEach(store => {
    const iconHtml = `
      <div style="background:#00A651; color:#fff; border-radius:50% 50% 50% 0; width:36px; height:36px;
        display:flex; align-items:center; justify-content:center; font-size:16px;
        transform:rotate(-45deg); border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <span style="transform:rotate(45deg);">${store.emoji}</span>
      </div>`;

    const customIcon = L.divIcon({
      html: iconHtml, className: '', iconSize: [36, 36], iconAnchor: [18, 36]
    });

    const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(mapInstance);

    marker.bindPopup(`
      <div style="font-family:'Cairo',sans-serif; min-width:180px; padding:4px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:4px;">${store.emoji} ${store.name}</div>
        <div style="font-size:12px; color:#666; margin-bottom:4px;">📍 ${store.address}</div>
        <div style="font-size:12px; margin-bottom:4px;">
          <span style="background:#E6F7EE; color:#007A3D; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:600;">
            ${store.promos} promotions
          </span>
          <span style="background:${store.open ? '#E6F7EE' : '#FEE2E2'}; color:${store.open ? '#007A3D' : '#A32D2D'}; padding:2px 7px; border-radius:10px; font-size:11px; margin-left:4px;">
            ${store.open ? '● Ouvert' : '● Fermé'}
          </span>
        </div>
        <div style="font-size:12px; color:#666;">📞 ${store.phone}</div>
        <div style="font-size:12px; color:#666;">🕐 Jusqu'à ${store.hours}</div>
      </div>
    `, { maxWidth: 220 });
  });

  // Try to get user's real location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      if (userMarker) mapInstance.removeLayer(userMarker);
      const userIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;background:#4285F4;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 3px rgba(66,133,244,0.3);"></div>`,
        className: '', iconSize: [16, 16], iconAnchor: [8, 8]
      });
      userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance);
      userMarker.bindPopup('<strong>Votre position</strong>').openPopup();
      mapInstance.setView([lat, lng], 14);
    }, () => {
      // No location access — stay on default view
    });
  }
}

function filterMapStores(type) {
  // Update chip styles
  document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
  event?.target?.classList?.add('active');

  if (!mapInstance) return;
  // Re-render markers (simplified — just centers on filtered stores)
  const filtered = type === 'tous' ? DZ.stores : DZ.stores.filter(s => s.type === type);
  if (filtered.length > 0) {
    const bounds = L.latLngBounds(filtered.map(s => [s.lat, s.lng]));
    mapInstance.fitBounds(bounds, { padding: [40, 40] });
  }
}
