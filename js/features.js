/**
 * Kujto Tiranën — features.js
 * Optional UI features (tours and related extras).
 * Do not remove without checking index.html script order.
 */
/**
 * Extra features: map filters, comments UI, favorites, itineraries, before/after slider, PWA
 */
(function () {
  const API = () => (window.KT_API && window.KT_API.API_BASE) || (location.origin + '/api/v1');

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  /* ---------- Map filters UI ---------- */
  function injectMapFilters() {
    const harta = document.querySelector('.harta') || document.getElementById('map')?.parentElement;
    if (!harta || document.getElementById('kt-map-filters')) return;
    const bar = document.createElement('div');
    bar.id = 'kt-map-filters';
    bar.innerHTML = `
      <div class="kt-filters">
        <label>Tipi
          <select id="kt-filter-type">
            <option value="all">Të gjitha</option>
            <option value="monument">Monument / Shesh</option>
            <option value="religious">Fetare</option>
            <option value="park">Park / Natyrë</option>
            <option value="street">Rrugë / Boulevard</option>
            <option value="museum">Muze / Kulturë</option>
            <option value="other">Tjetër</option>
          </select>
        </label>
        <label>Dekada
          <select id="kt-filter-decade">
            <option value="all">Të gjitha</option>
            <option value="pre1950">Para 1950</option>
            <option value="1950">1950–1979</option>
            <option value="1980">1980–1999</option>
            <option value="2000">2000–2019</option>
            <option value="2020">2020+</option>
          </select>
        </label>
        <button type="button" id="kt-filter-apply" class="btn" style="margin-top:0;padding:.6rem 1.2rem;font-size:1.3rem">Filtro</button>
      </div>`;
    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.parentNode.insertBefore(bar, mapEl);
    else harta.insertBefore(bar, harta.firstChild);

    const typeMap = {
      sheshi: 'monument', piramida: 'monument', kalaja: 'monument', bashkia: 'monument',
      xhamia: 'religious', kisha: 'religious', pali: 'religious', bektashi: 'religious',
      parku: 'park', dajti: 'park', zoo: 'park', lana: 'park', erzen: 'park',
      zogip: 'street', zogizi: 'street', biri: 'street', kavaja: 'street', durres: 'street',
      muzeu: 'museum', teatri: 'museum', kino: 'museum', banka: 'museum',
    };

    document.getElementById('kt-filter-apply')?.addEventListener('click', () => {
      const type = document.getElementById('kt-filter-type').value;
      if (typeof markers === 'undefined' || !Array.isArray(markers)) {
        alert('Harta ende nuk është ngarkuar.');
        return;
      }
      markers.forEach((m) => {
        const key = m.locationKey || '';
        const t = typeMap[key] || 'other';
        const show = type === 'all' || t === type;
        if (show) {
          if (typeof map !== 'undefined') m.addTo(map);
        } else {
          if (typeof map !== 'undefined') map.removeLayer(m);
        }
      });
    });
  }

  /* ---------- Comments panel ---------- */
  async function loadComments(locationKey, container) {
    if (!container) return;
    container.innerHTML = '<p style="opacity:.7">Duke ngarkuar komentet...</p>';
    try {
      const res = await fetch(API() + '/comments/' + encodeURIComponent(locationKey));
      const data = await res.json();
      const list = (data.data || []).map((c) => `
        <div class="kt-comment">
          <div class="kt-comment-head"><strong>${escapeHtml(c.authorName)}</strong>
            <span>${new Date(c.createdAt).toLocaleDateString()}</span>
            <button type="button" class="kt-like-btn" data-id="${c._id}">♥ ${c.likeCount || 0}</button>
          </div>
          <p>${escapeHtml(c.text)}</p>
        </div>`).join('') || '<p style="opacity:.6">Nuk ka komente ende.</p>';
      container.innerHTML = `
        <div class="kt-comments-list">${list}</div>
        <form class="kt-comment-form" data-key="${locationKey}">
          <input name="authorName" placeholder="Emri yt" required />
          <textarea name="text" placeholder="Shkruaj një koment..." required rows="2"></textarea>
          <button type="submit" class="btn" style="margin-top:.5rem">Dërgo komentin</button>
        </form>`;
      container.querySelector('.kt-comment-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const text = String(fd.get('text') || '');
        // Client-side moderation (backend is final authority)
        if (window.ktValidateCaption) {
          const errMsg = window.ktValidateCaption(text);
          if (errMsg) {
            alert(errMsg);
            return;
          }
        }
        try {
          const r = await fetch(API() + '/comments/' + locationKey, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(localStorage.getItem('KT_TOKEN') ? { Authorization: 'Bearer ' + localStorage.getItem('KT_TOKEN') } : {}),
            },
            body: JSON.stringify({
              authorName: fd.get('authorName'),
              text: text,
            }),
          });
          const j = await r.json();
          if (!r.ok) throw new Error(j.message || 'Error');
          loadComments(locationKey, container);
        } catch (err) {
          alert(err.message);
        }
      });
      container.querySelectorAll('.kt-like-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const token = localStorage.getItem('KT_TOKEN');
          if (!token) return alert('Duhet të jesh i identifikuar për like');
          const r = await fetch(API() + '/comments/like/' + btn.dataset.id, {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token },
          });
          const j = await r.json();
          if (r.ok) btn.textContent = '♥ ' + j.likeCount;
          else alert(j.message || 'Error');
        });
      });
    } catch (e) {
      container.innerHTML = '<p style="color:#c44536">Nuk u ngarkuan komentet.</p>';
    }
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }



  /* ---------- Itineraries (real map tour) ---------- */
  let tourPolyline = null;
  let tourActiveStops = [];
  let tourStep = 0;

  const ITINERARIES = [
    {
      id: 'old-tirana',
      title: 'Tirana e Vjetër (2 orë)',
      stops: ['sheshi', 'xhamia', 'kulla', 'pazari', 'kalaja'],
      desc: 'Sheshi Skënderbej → Xhamia → Sahati → Pazari → Kalaja',
    },
    {
      id: 'modern',
      title: 'Tirana Moderne',
      stops: ['piramida', 'parku', 'biri', 'muzeu'],
      desc: 'Piramida → Parku → Bulevardi i Ri → Muzeu',
    },
  ];

  function clearTourLine() {
    if (tourPolyline && typeof map !== 'undefined') {
      try { map.removeLayer(tourPolyline); } catch (_) {}
      tourPolyline = null;
    }
  }

  function runItinerary(tour) {
    if (!tour || typeof locations === 'undefined') {
      alert('Lokacionet nuk janë gati.');
      return;
    }
    if (typeof map === 'undefined' || !map) {
      alert('Harta nuk është gati.');
      return;
    }

    const stopLocs = tour.stops
      .map((key) => locations.find((l) => l.key === key))
      .filter(Boolean);

    if (!stopLocs.length) {
      alert('Asnjë ndalesë e këtij itinerari nuk u gjet në hartë.');
      return;
    }

    tourActiveStops = stopLocs;
    tourStep = 0;
    clearTourLine();

    // Show only tour markers
    if (typeof markers !== 'undefined' && Array.isArray(markers)) {
      markers.forEach((m) => {
        const key = m.locationKey;
        const show = tour.stops.includes(key);
        try {
          if (show) m.addTo(map);
          else map.removeLayer(m);
        } catch (_) {}
      });
    }

    // Draw route line
    const latlngs = stopLocs.map((l) => [l.lat, l.lng]);
    if (typeof L !== 'undefined') {
      tourPolyline = L.polyline(latlngs, {
        color: '#ff6b9d',
        weight: 5,
        opacity: 0.85,
        dashArray: '10, 8',
      }).addTo(map);
      try {
        map.fitBounds(tourPolyline.getBounds().pad(0.2));
      } catch (_) {
        map.setView(latlngs[0], 15);
      }
    }

    // Open first stop
    goTourStep(0);
    showTourHud(tour);
  }

  function goTourStep(i) {
    if (!tourActiveStops.length) return;
    tourStep = Math.max(0, Math.min(i, tourActiveStops.length - 1));
    const loc = tourActiveStops[tourStep];
    if (typeof map !== 'undefined') map.setView([loc.lat, loc.lng], 16, { animate: true });
    if (typeof showDestinationInfo === 'function') showDestinationInfo(loc);
    else if (typeof window.goToLocationByKey === 'function') window.goToLocationByKey(loc.key);
    const hud = document.getElementById('kt-tour-hud-step');
    if (hud) {
      hud.textContent = (tourStep + 1) + ' / ' + tourActiveStops.length + ' — ' + (loc.key || '');
    }
  }

  function showTourHud(tour) {
    let hud = document.getElementById('kt-tour-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'kt-tour-hud';
      document.body.appendChild(hud);
    }
    hud.innerHTML =
      '<div class="kt-tour-hud-inner">' +
      '<strong>' + (tour.title || 'Itinerar') + '</strong>' +
      '<span id="kt-tour-hud-step">1 / ' + tourActiveStops.length + '</span>' +
      '<div class="kt-tour-hud-actions">' +
      '<button type="button" id="kt-tour-prev">← Mëparshëm</button>' +
      '<button type="button" id="kt-tour-next">Tjetri →</button>' +
      '<button type="button" id="kt-tour-close">Mbyll</button>' +
      '</div></div>';
    hud.style.display = 'block';
    document.getElementById('kt-tour-prev').onclick = function () { goTourStep(tourStep - 1); };
    document.getElementById('kt-tour-next').onclick = function () { goTourStep(tourStep + 1); };
    document.getElementById('kt-tour-close').onclick = function () {
      hud.style.display = 'none';
      clearTourLine();
      // restore all markers
      if (typeof markers !== 'undefined' && typeof map !== 'undefined') {
        markers.forEach(function (m) { try { m.addTo(map); } catch (_) {} });
      }
      tourActiveStops = [];
    };
  }

  function injectItineraries() {
    if (document.getElementById('kt-tours')) return;
    const target = document.querySelector('.mapi') || document.querySelector('#hart') || document.body;
    const sec = document.createElement('section');
    sec.id = 'kt-tours';
    sec.className = 'kt-tours-section';
    sec.innerHTML =
      '<h2 class="heading">Itinerare të sugjeruara</h2>' +
      '<p style="text-align:center;color:#6b6280;margin-bottom:2rem;font-size:1.5rem">Kliko një tur — harta shfaq rrugën dhe hap ndalesat një nga një</p>' +
      '<div class="kt-tours-grid">' +
      ITINERARIES.map(function (t) {
        return (
          '<div class="kt-tour-card">' +
          '<h3>' + t.title + '</h3>' +
          '<p>' + t.desc + '</p>' +
          '<button type="button" class="btn" data-tour="' + t.id + '">Fillo itinerarin</button>' +
          '</div>'
        );
      }).join('') +
      '</div>';
    if (target.parentNode) target.parentNode.insertBefore(sec, target.nextSibling);
    else document.body.appendChild(sec);

    sec.querySelectorAll('[data-tour]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tour = ITINERARIES.find(function (x) { return x.id === btn.getAttribute('data-tour'); });
        if (!tour) return;
        // scroll to map
        const mapEl = document.getElementById('map') || document.querySelector('.harta');
        if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { runItinerary(tour); }, 400);
      });
    });
  }

  /* ---------- Favorites panel (real UI) ---------- */
  function locationTitle(key) {
    try {
      const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'en';
      return (translations && translations[lang] && translations[lang][key + '_title']) || key;
    } catch (_) {
      return key;
    }
  }

  async function openFavoritesPanel() {
    const token = localStorage.getItem('KT_TOKEN');
    if (!token) {
      if (window.KT_AUTH && window.KT_AUTH.openModal) window.KT_AUTH.openModal('login');
      else alert('Identifikohu për të parë preferitat');
      return;
    }

    let panel = document.getElementById('kt-fav-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'kt-fav-panel';
      document.body.appendChild(panel);
    }
    panel.innerHTML = '<div class="kt-fav-inner"><h2>★ Preferitat e mia</h2><p>Duke ngarkuar...</p><button type="button" class="kt-fav-close">Mbyll</button></div>';
    panel.classList.add('open');
    panel.querySelector('.kt-fav-close').onclick = function () { panel.classList.remove('open'); };

    try {
      const res = await fetch(API() + '/auth/me', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gabim');
      const favs = data.user && data.user.favorites ? data.user.favorites : [];
      const list =
        favs.length === 0
          ? '<p class="kt-fav-empty">Nuk ke preferita ende.<br>Hap një lokacion dhe kliko <b>★ Preferitat</b>.</p>'
          : '<div class="kt-fav-list">' +
            favs
              .map(function (key) {
                return (
                  '<button type="button" class="kt-fav-item" data-key="' +
                  key +
                  '"><span class="kt-fav-icon">📍</span><span>' +
                  locationTitle(key) +
                  '</span><small>' +
                  key +
                  '</small></button>'
                );
              })
              .join('') +
            '</div>';
      panel.querySelector('.kt-fav-inner').innerHTML =
        '<h2>★ Preferitat e mia</h2><p class="kt-fav-count">' +
        favs.length +
        ' vende të ruajtura</p>' +
        list +
        '<button type="button" class="kt-fav-close">Mbyll</button>';
      panel.querySelector('.kt-fav-close').onclick = function () { panel.classList.remove('open'); };
      panel.querySelectorAll('.kt-fav-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const key = btn.getAttribute('data-key');
          panel.classList.remove('open');
          if (typeof window.goToLocationByKey === 'function') window.goToLocationByKey(key);
          else if (typeof locations !== 'undefined') {
            const loc = locations.find(function (l) { return l.key === key; });
            if (loc && typeof showDestinationInfo === 'function') showDestinationInfo(loc);
          }
        });
      });
    } catch (e) {
      panel.querySelector('.kt-fav-inner').innerHTML =
        '<h2>★ Preferitat</h2><p class="kt-fav-empty">' +
        (e.message || 'Gabim') +
        '</p><button type="button" class="kt-fav-close">Mbyll</button>';
      panel.querySelector('.kt-fav-close').onclick = function () { panel.classList.remove('open'); };
    }
  }

  window.ktOpenFavorites = openFavoritesPanel;
  window.ktToggleFavorite = async function (locationKey) {
    const token = localStorage.getItem('KT_TOKEN');
    if (!token) {
      if (window.KT_AUTH && window.KT_AUTH.openModal) window.KT_AUTH.openModal('login');
      else alert('Identifikohu për të ruajtur preferitat');
      return;
    }
    try {
      const r = await fetch(API() + '/auth/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ locationKey: locationKey }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || 'Gabim');
      // toast
      const t = document.createElement('div');
      t.className = 'kt-toast';
      t.textContent = j.favorited ? '★ U shtua te preferitat' : 'U hoq nga preferitat';
      document.body.appendChild(t);
      setTimeout(function () { t.classList.add('show'); }, 10);
      setTimeout(function () { t.remove(); }, 2500);
    } catch (e) {
      alert(e.message);
    }
  };

  /* ---------- Before/After year slider (simple) ---------- */
  window.ktBuildYearSlider = function (photos, container) {
    if (!container || !photos || !photos.length) return;
    const sorted = [...photos].sort((a, b) => (a.year || 0) - (b.year || 0));
    container.innerHTML = `
      <div class="kt-ba">
        <div class="kt-ba-img" id="kt-ba-img" style="background-image:url('${sorted[0].url || sorted[0].src || ''}')"></div>
        <div class="kt-ba-meta"><span id="kt-ba-year">${sorted[0].year || ''}</span>
          <span id="kt-ba-cap">${sorted[0].description || sorted[0].caption || sorted[0].title || ''}</span></div>
        <input type="range" id="kt-ba-range" min="0" max="${sorted.length - 1}" value="0" />
      </div>`;
    const range = container.querySelector('#kt-ba-range');
    range?.addEventListener('input', () => {
      const p = sorted[Number(range.value)];
      const img = container.querySelector('#kt-ba-img');
      if (img) img.style.backgroundImage = `url('${p.url || p.src || ''}')`;
      const y = container.querySelector('#kt-ba-year');
      if (y) y.textContent = p.year || '';
      const c = container.querySelector('#kt-ba-cap');
      if (c) c.textContent = p.description || p.caption || p.title || '';
    });
  };

  /* expose comments loader for sidebar integration */
  window.ktLoadComments = loadComments;

  document.addEventListener('DOMContentLoaded', () => {
    injectMapFilters();
    injectItineraries();
  });
  // also try after delay (map loads later)
  setTimeout(() => { injectMapFilters(); injectItineraries(); }, 2000);
})();
