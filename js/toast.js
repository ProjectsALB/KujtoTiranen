/**
 * Kujto Tiranën — toast.js
 * Optional non-blocking toast notifications.
 * Do not remove without checking index.html script order.
 */
/**
 * Non-blocking toasts. Safe no-op if DOM missing.
 * Usage: KTToast.show('Mesazhi', 'ok'|'err'|'info')
 */
(function (w) {
  function host() {
    var el = document.getElementById('kt-toast-host');
    if (!el) {
      el = document.createElement('div');
      el.id = 'kt-toast-host';
      el.className = 'kt-toast-host';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('role', 'status');
      if (document.body) document.body.appendChild(el);
    }
    return el;
  }
  function show(message, type) {
    try {
      var h = host();
      var t = document.createElement('div');
      t.className = 'kt-toast' + (type === 'err' ? ' err' : type === 'ok' ? ' ok' : '');
      t.textContent = String(message || '');
      h.appendChild(t);
      setTimeout(function () {
        try { t.remove(); } catch (_) {}
      }, 4200);
    } catch (_) {}
  }
  w.KTToast = { show: show };
})(window);
