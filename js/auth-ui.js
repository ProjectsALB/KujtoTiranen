/**
 * Kujto Tiranën — auth-ui.js
 * Login / register UI wiring to the auth API.
 * Do not remove without checking index.html script order.
 */
/**
 * User Login / Register UI for Kujto Tiranën
 */
(function () {
  const API = () =>
    (window.KT_API && window.KT_API.API_BASE) ||
    (location.port === '5000' ? location.origin + '/api/v1' : 'http://localhost:5000/api/v1');

  function token() {
    return localStorage.getItem('KT_TOKEN');
  }
  function saveAuth(data) {
    // Session isolation: wipe previous session first
    try {
      localStorage.removeItem('KT_TOKEN');
      localStorage.removeItem('KT_USER');
      sessionStorage.removeItem('KT_TOKEN');
      sessionStorage.removeItem('KT_USER');
    } catch (_) {}
    if (!data || !data.token) return;
    var safeUser = {
      id: data.user && (data.user.id || data.user._id),
      name: data.user && data.user.name,
      email: data.user && data.user.email,
      role: data.user && data.user.role,
      avatar: data.user && data.user.avatar,
      favorites: (data.user && data.user.favorites) || []
    };
    // NEVER store password
    localStorage.setItem('KT_TOKEN', data.token);
    localStorage.setItem('KT_USER', JSON.stringify(safeUser));
    // Clear form fields immediately
    var passEl = document.getElementById('kt-auth-password');
    var emailEl = document.getElementById('kt-auth-email');
    if (passEl) passEl.value = '';
    if (emailEl) emailEl.value = '';
  }
  function clearAuth() {
    try {
      localStorage.removeItem('KT_TOKEN');
      localStorage.removeItem('KT_USER');
      sessionStorage.removeItem('KT_TOKEN');
      sessionStorage.removeItem('KT_USER');
      sessionStorage.removeItem('KT_AUTH_EMAIL');
      sessionStorage.removeItem('KT_AUTH_PASSWORD');
    } catch (_) {}
    // Never store passwords anywhere
    var passEl = document.getElementById('kt-auth-password');
    var emailEl = document.getElementById('kt-auth-email');
    var nameEl = document.getElementById('kt-auth-name');
    if (passEl) { passEl.value = ''; passEl.setAttribute('autocomplete', 'off'); }
    if (emailEl) { emailEl.value = ''; emailEl.setAttribute('autocomplete', 'off'); }
    if (nameEl) nameEl.value = '';
  }
  function logout() {
    clearAuth();
    try { updateHeaderButton(); } catch (_) {}
    try { closeModal(); } catch (_) {}
    var menu = document.getElementById('kt-auth-menu');
    if (menu) menu.innerHTML = '';
  }


  function currentUser() {
    try {
      return JSON.parse(localStorage.getItem('KT_USER') || 'null');
    } catch {
      return null;
    }
  }

  function ensureStyles() {
    if (document.getElementById('kt-auth-styles')) return;
    const s = document.createElement('style');
    s.id = 'kt-auth-styles';
    s.textContent = `
      .kt-login-btn, #kt-auth-btn {
        display: inline-flex; align-items: center; gap: .5rem;
        padding: .55rem 1.1rem; margin-left: .5rem;
        font-size: 1.35rem; font-weight: 600;
        border-radius: 999px; border: 1.5px solid #0F2C1A;
        background: #0F2C1A; color: #fff; cursor: pointer;
        font-family: inherit; transition: .2s;
      }
      #kt-auth-btn:hover { background: #1A3D28; }
      #kt-auth-btn.logged { background: transparent; color: #0F2C1A; }
      #kt-auth-menu {
        position: absolute; right: 1rem; top: 70px; z-index: 10001;
        background: #fff; border-radius: 12px; min-width: 200px;
        box-shadow: 0 12px 40px rgba(0,0,0,.15); border: 1px solid #eee;
        display: none; overflow: hidden;
      }
      #kt-auth-menu.open { display: block; }
      #kt-auth-menu button, #kt-auth-menu a {
        display: block; width: 100%; text-align: left; padding: .9rem 1.2rem;
        border: none; background: none; font-size: 1.4rem; cursor: pointer;
        color: #333; font-family: inherit;
      }
      #kt-auth-menu button:hover, #kt-auth-menu a:hover { background: #f5f2eb; }
      #kt-auth-modal {
        position: fixed; inset: 0; z-index: 20000;
        background: rgba(15,44,26,.65); backdrop-filter: blur(6px);
        display: none; align-items: center; justify-content: center; padding: 1rem;
      }
      #kt-auth-modal.open { display: flex; }
      .kt-auth-box {
        background: #fff; border-radius: 20px; width: min(420px, 100%);
        padding: 2rem 1.75rem; box-shadow: 0 20px 60px rgba(0,0,0,.25);
        position: relative;
      }
      .kt-auth-box h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 2.2rem; color: #0F2C1A; margin-bottom: .3rem;
      }
      .kt-auth-box .sub { color: #777; font-size: 1.35rem; margin-bottom: 1.4rem; }
      .kt-auth-box label { display: block; font-size: 1.25rem; color: #555; margin: .7rem 0 .3rem; }
      .kt-auth-box input {
        width: 100%; padding: .85rem 1rem; border: 1.5px solid #e5e5e5;
        border-radius: 10px; font-size: 1.45rem; font-family: inherit;
      }
      .kt-auth-box input:focus { outline: none; border-color: #0F2C1A; }
      .kt-auth-tabs { display: flex; gap: .5rem; margin-bottom: 1rem; }
      .kt-auth-tabs button {
        flex: 1; padding: .7rem; border-radius: 10px; border: 1px solid #e5e5e5;
        background: #f8f8f8; font-weight: 600; cursor: pointer; font-size: 1.35rem;
      }
      .kt-auth-tabs button.active { background: #0F2C1A; color: #fff; border-color: #0F2C1A; }
      .kt-auth-submit {
        width: 100%; margin-top: 1.3rem; padding: 1rem;
        background: #0F2C1A; color: #fff; border: none; border-radius: 999px;
        font-weight: 600; font-size: 1.5rem; cursor: pointer;
      }
      .kt-auth-submit:hover { background: #1A3D28; }
      .kt-auth-close {
        position: absolute; top: 1rem; right: 1rem; border: none; background: none;
        font-size: 2rem; cursor: pointer; color: #999; line-height: 1;
      }
      .kt-auth-msg { margin-top: .8rem; font-size: 1.35rem; min-height: 1.4em; }
      .kt-auth-msg.err { color: #c0392b; }
      .kt-auth-msg.ok { color: #1a7a45; }
      .kt-auth-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    `;
    document.head.appendChild(s);
  }

  function ensureModal() {
    if (document.getElementById('kt-auth-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'kt-auth-modal';
    modal.innerHTML = `
      <div class="kt-auth-box">
        <button type="button" class="kt-auth-close" id="kt-auth-close" aria-label="Close">&times;</button>
        <h2 id="kt-auth-title">Hyr</h2>
        <p class="sub" id="kt-auth-sub">Hyr në llogarinë tënde</p>
        <div class="kt-auth-tabs">
          <button type="button" class="active" data-mode="login">Hyr</button>
          <button type="button" data-mode="register">Regjistrohu</button>
        </div>
        <div id="kt-google-wrap" class="kt-google-wrap">
          <div id="kt-google-btn"></div>
          <p class="kt-google-fallback" id="kt-google-fallback" style="display:none;font-size:1.25rem;color:#888;text-align:center;margin-top:.5rem"></p>
        </div>
        <div class="kt-auth-divider"><span>ose</span></div>
        <form id="kt-auth-form">
          <div id="kt-auth-name-wrap" style="display:none">
            <label>Emri</label>
            <input type="text" id="kt-auth-name" name="name" autocomplete="name" />
          </div>
          <label>Email</label>
          <input type="email" id="kt-auth-email" name="email" required autocomplete="email" />
          <label>Password</label>
          <input type="password" id="kt-auth-password" name="password" required minlength="6" autocomplete="off" />
          <button type="submit" class="kt-auth-submit" id="kt-auth-submit">Hyr</button>
          <p class="kt-auth-msg" id="kt-auth-msg"></p>
        </form>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.getElementById('kt-auth-close').onclick = closeModal;

    modal.querySelectorAll('.kt-auth-tabs button').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    document.getElementById('kt-auth-form').addEventListener('submit', onSubmit);
  }

  let mode = 'login';

  function setMode(m) {
    mode = m;
    const isReg = m === 'register';
    document.querySelectorAll('.kt-auth-tabs button').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === m);
    });
    document.getElementById('kt-auth-name-wrap').style.display = isReg ? 'block' : 'none';
    document.getElementById('kt-auth-name').required = isReg;
    document.getElementById('kt-auth-title').textContent = isReg ? 'Regjistrohu' : 'Hyr';
    document.getElementById('kt-auth-sub').textContent = isReg
      ? 'Krijo llogari të re'
      : 'Hyr në llogarinë tënde';
    document.getElementById('kt-auth-submit').textContent = isReg ? 'Krijo llogari' : 'Hyr';
    document.getElementById('kt-auth-msg').textContent = '';
    document.getElementById('kt-auth-password').autocomplete = 'off';
    document.getElementById('kt-auth-email').autocomplete = 'off';
  }

  function openModal(startMode) {
    ensureModal();
    setMode(startMode || 'login');
    var emailEl = document.getElementById('kt-auth-email');
    var passEl = document.getElementById('kt-auth-password');
    var nameEl = document.getElementById('kt-auth-name');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    if (nameEl) nameEl.value = '';
    var msg = document.getElementById('kt-auth-msg');
    if (msg) msg.textContent = '';
    document.getElementById('kt-auth-modal').classList.add('open');
    if (emailEl) emailEl.focus();
    initGoogleButton();
  }

  function closeModal() {
    const m = document.getElementById('kt-auth-modal');
    if (m) m.classList.remove('open');
    var passEl = document.getElementById('kt-auth-password');
    var emailEl = document.getElementById('kt-auth-email');
    if (passEl) passEl.value = '';
    if (emailEl) emailEl.value = '';
  }

  async function onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const msg = document.getElementById('kt-auth-msg');
    const submitBtn = document.getElementById('kt-auth-submit');
    msg.className = 'kt-auth-msg';
    msg.textContent = 'Duke u procesuar...';
    if (submitBtn) submitBtn.disabled = true;

    const email = document.getElementById('kt-auth-email').value.trim();
    const password = document.getElementById('kt-auth-password').value;
    const name = document.getElementById('kt-auth-name').value.trim();

    try {
      if (!email || !email.includes('@')) throw new Error('Shkruaj një email të vlefshëm');
      if (!password || password.length < 6) throw new Error('Password min. 6 karaktere');
      if (mode === 'register' && (!name || name.length < 2)) throw new Error('Shkruaj emrin tënd');

      const path = mode === 'register' ? '/auth/register' : '/auth/login';
      const body = mode === 'register' ? { name, email, password } : { email, password };
      const res = await fetch(API() + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      let data = {};
      try { data = await res.json(); } catch (_) {}
      if (!res.ok) {
        throw new Error(data.message || (data.errors && data.errors[0] && data.errors[0].msg) || ('Gabim ' + res.status));
      }
      if (!data.token) throw new Error('Serveri nuk ktheu token');
      saveAuth(data);
      var _p = document.getElementById('kt-auth-password'); if (_p) _p.value = '';
      msg.className = 'kt-auth-msg ok';
      msg.textContent = data.message || (mode === 'register' ? 'Llogaria u krijua!' : 'Mirë se erdhe!');
      updateHeaderButton();
      setTimeout(closeModal, 900);
    } catch (err) {
      msg.className = 'kt-auth-msg err';
      msg.textContent = err.message || 'Gabim';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  function updateHeaderButton() {
    const btn = document.getElementById('kt-auth-btn');
    const menu = document.getElementById('kt-auth-menu');
    if (!btn) return;
    const user = currentUser();
    if (user && token()) {
      btn.classList.add('logged');
      btn.innerHTML = `<i class="fas fa-user-circle"></i> <span class="kt-auth-name" id="kt-auth-btn-label">${escapeHtml(user.name || user.email)}</span>`;
      if (menu) {
        menu.innerHTML =
          '<div class="kt-auth-menu-email">' + escapeHtml(user.email || '') + '</div>' +
          '<button type="button" id="kt-auth-favs">★ Preferitat e mia</button>' +
          (user.role === 'admin' ? '<a href="/admin" id="kt-auth-admin">Panel Admin</a>' : '') +
          '<button type="button" id="kt-auth-logout">Dil / Logout</button>';
        const logoutBtn = document.getElementById('kt-auth-logout');
        if (logoutBtn) {
          logoutBtn.onclick = function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            clearAuth();
            menu.classList.remove('open');
            updateHeaderButton();
            // small toast
            try {
              var t = document.createElement('div');
              t.className = 'kt-toast show';
              t.textContent = 'Dole nga llogaria';
              document.body.appendChild(t);
              setTimeout(function () { t.remove(); }, 2000);
            } catch (_) {}
          };
        }
        const favBtn = document.getElementById('kt-auth-favs');
        if (favBtn) {
          favBtn.onclick = function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            menu.classList.remove('open');
            if (window.ktOpenFavorites) window.ktOpenFavorites();
          };
        }
      }
    } else {
      btn.classList.remove('logged');
      btn.innerHTML = `<i class="fas fa-user"></i> <span id="kt-auth-btn-label">Hyr</span>`;
      if (menu) menu.innerHTML = '';
    }
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function injectButton() {
    ensureStyles();
    ensureModal();
    const header = document.querySelector('.header');
    if (!header) return;

    let btn = document.getElementById('kt-auth-btn');
    let menu = document.getElementById('kt-auth-menu');

    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'kt-auth-btn';
      btn.className = 'kt-login-btn';
      btn.innerHTML = '<i class="fas fa-user"></i> <span id="kt-auth-btn-label">Hyr</span>';
      const icons = header.querySelector('.icons');
      if (icons) icons.after(btn);
      else header.appendChild(btn);
    }
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'kt-auth-menu';
      header.appendChild(menu);
    }

    btn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (token() && currentUser()) {
        menu.classList.toggle('open');
      } else {
        openModal('login');
      }
    };

    if (!window.__ktAuthDocClick) {
      window.__ktAuthDocClick = true;
      document.addEventListener('click', function (e) {
        var m = document.getElementById('kt-auth-menu');
        var b = document.getElementById('kt-auth-btn');
        if (!m || !m.classList.contains('open')) return;
        if (m.contains(e.target) || (b && b.contains(e.target))) return;
        m.classList.remove('open');
      });
    }

    updateHeaderButton();
  }


  async function initGoogleButton() {
    try {
      const res = await fetch(API() + '/auth/oauth-config');
      const cfg = await res.json();
      const fallback = document.getElementById('kt-google-fallback');
      if (!cfg.googleEnabled || !cfg.googleClientId) {
        if (fallback) {
          fallback.style.display = 'block';
          fallback.textContent = 'Google OAuth: vendos GOOGLE_CLIENT_ID në backend/.env';
        }
        return;
      }
      window.__KT_GOOGLE_CLIENT_ID = cfg.googleClientId;
      if (!window.google || !window.google.accounts) {
        await loadGoogleScript();
      }
      window.google.accounts.id.initialize({
        client_id: cfg.googleClientId,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      const el = document.getElementById('kt-google-btn');
      if (el) {
        el.innerHTML = '';
        window.google.accounts.id.renderButton(el, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
        });
      }
    } catch (e) {
      console.warn('Google init', e);
    }
  }

  function loadGoogleScript() {
    return new Promise(function (resolve, reject) {
      if (window.google && window.google.accounts) return resolve();
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function handleGoogleCredential(response) {
    const msg = document.getElementById('kt-auth-msg');
    if (msg) {
      msg.className = 'kt-auth-msg';
      msg.textContent = 'Duke u identifikuar me Google...';
    }
    try {
      const res = await fetch(API() + '/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');
      saveAuth(data);
      if (msg) {
        msg.className = 'kt-auth-msg ok';
        msg.textContent = data.message || 'Mirë se erdhe!';
      }
      updateHeaderButton();
      setTimeout(closeModal, 700);
    } catch (err) {
      if (msg) {
        msg.className = 'kt-auth-msg err';
        msg.textContent = err.message;
      }
    }
  }


  // Public API
  window.KT_AUTH = {
    logout: logout, openModal, closeModal, currentUser, token, clearAuth, updateHeaderButton };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
  setTimeout(injectButton, 500);
})();

document.addEventListener('click', function (e) {
  var t = e.target;
  if (!t) return;
  if (t.id === 'kt-logout' || (t.closest && t.closest('#kt-logout')) || (t.getAttribute && t.getAttribute('data-action') === 'logout')) {
    e.preventDefault();
    if (typeof logout === 'function') logout();
    else if (window.KT_AUTH && window.KT_AUTH.logout) window.KT_AUTH.logout();
  }
});
