/**
 * Kujto Tiranën — frontend config (no secrets).
 * Keeps magic numbers out of inline scripts where possible.
 */
(function (w) {
  w.KT_CONFIG = {
    defaultMapCenter: [41.3355599, 19.8430004],
    defaultMapZoom: 12,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '&copy; OpenStreetMap',
    fallbackImage: 'images/logo1.webp',
    apiPath: '/api/v1',
  };
})(window);
