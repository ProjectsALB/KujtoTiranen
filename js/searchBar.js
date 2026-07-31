/**
 * Kujto Tiranën — searchBar.js
 * Header search: find location, pan map, open sidebar.
 * Do not remove without checking index.html script order.
 */
/**
 * Search: find location → pan map → open sidebar info → user can open timeline
 */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function getTitle(location) {
    try {
      const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'en';
      const t = translations && translations[lang] ? translations[lang][location.key + '_title'] : null;
      return t || location.key || '';
    } catch {
      return location.key || '';
    }
  }

  function findLocation(searchTerm) {
    const q = normalize(searchTerm);
    if (!q || typeof locations === 'undefined') return null;

    // exact key
    let hit = locations.find((loc) => normalize(loc.key) === q);
    if (hit) return hit;

    // title contains
    hit = locations.find((loc) => normalize(getTitle(loc)).includes(q));
    if (hit) return hit;

    // key contains
    hit = locations.find((loc) => normalize(loc.key).includes(q));
    if (hit) return hit;

    // any word match in title
    const words = q.split(/\s+/).filter(Boolean);
    hit = locations.find((loc) => {
      const title = normalize(getTitle(loc));
      return words.every((w) => title.includes(w) || normalize(loc.key).includes(w));
    });
    return hit || null;
  }

  function goToLocation(location) {
    if (!location) return;

    // Scroll to map section
    const mapSection =
      document.getElementById('map') ||
      document.querySelector('.harta') ||
      document.querySelector('.cont');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Pan map
    if (typeof map !== 'undefined' && map && location.lat && location.lng) {
      map.setView([location.lat, location.lng], 17, { animate: true });
    }

    // Open sidebar / info (main function used by this project)
    setTimeout(function () {
      if (typeof showDestinationInfo === 'function') {
        showDestinationInfo(location);
      } else if (typeof showLocationInfo === 'function') {
        showLocationInfo(location);
      }

      // Highlight marker if present
      if (typeof markers !== 'undefined' && Array.isArray(markers)) {
        const marker =
          markers.find((m) => m.locationKey === location.key) ||
          markers.find(
            (m) =>
              m.getLatLng &&
              Math.abs(m.getLatLng().lat - location.lat) < 0.0001 &&
              Math.abs(m.getLatLng().lng - location.lng) < 0.0001
          );
        if (marker && marker.fire) {
          try {
            marker.fire('click');
          } catch (_) {}
        }
      }

      window.currentLocationKey = location.key;
      window.currentLocation = location;
    }, 350);
  }

  function runSearch(raw) {
    const searchTerm = (raw || '').trim();
    if (!searchTerm) return;

    const form = document.querySelector('.search-form');
    if (form) form.classList.remove('active');

    if (typeof locations === 'undefined' || !locations.length) {
      alert('Lokacionet nuk janë ngarkuar ende. Prit pak dhe provo përsëri.');
      return;
    }

    const location = findLocation(searchTerm);
    if (!location) {
      const msg =
        (typeof translations !== 'undefined' &&
          translations[currentLanguage] &&
          translations[currentLanguage]['search_not_found']) ||
        'Vendndodhja nuk u gjet. Provo: piramida, sheshi, parku, xhamia...';
      alert(msg);
      return;
    }

    goToLocation(location);
  }

  // Expose for gallery / other clicks
  window.searchLocation = runSearch;
  window.goToLocationByKey = function (key) {
    if (typeof locations === 'undefined') return;
    const loc = locations.find((l) => l.key === key);
    if (loc) goToLocation(loc);
  };

  ready(function () {
    const form = document.querySelector('.search-form form');
    const input = document.getElementById('search-box');

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        runSearch(input ? input.value : '');
      });
    }

    // Live suggestions: Enter already handled; also search button icon in form
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          runSearch(input.value);
        }
      });
    }

    // Optional: click on search label
    const label = document.querySelector('.search-form form label');
    if (label && input) {
      label.addEventListener('click', function () {
        runSearch(input.value);
      });
    }
  });
})();
