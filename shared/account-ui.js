/* ============================================================
   account-ui.js — knop + modal voor registreren / inloggen.
   Gebruikt window.RAAuth (uit account.js).
   ============================================================ */
(function () {
  function ready(fn) {
    if (window.RAAuth) return fn();
    var n = 0, t = setInterval(function () { if (window.RAAuth || ++n > 60) { clearInterval(t); if (window.RAAuth) fn(); } }, 50);
  }

  ready(function () {
    var RA = window.RAAuth;

    var css = document.createElement('style');
    css.textContent = [
      '#ra-acc-btn{position:fixed;right:12px;bottom:12px;z-index:2147483000;',
      'font:600 13px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;',
      'background:rgba(28,24,18,.86);color:#f3e2a8;border:1px solid #c9a24b;',
      'border-radius:999px;padding:9px 14px;cursor:pointer;backdrop-filter:blur(4px);',
      'box-shadow:0 4px 14px rgba(0,0,0,.4);max-width:46vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#ra-acc-btn:hover{background:rgba(48,40,26,.95)}',
      '#ra-acc-ov{position:fixed;inset:0;z-index:2147483001;display:none;align-items:center;justify-content:center;',
      'background:rgba(0,0,0,.62);backdrop-filter:blur(3px)}',
      '#ra-acc-ov.open{display:flex}',
      '.ra-acc-card{width:min(92vw,360px);background:#211c15;color:#efe6cf;border:1px solid #c9a24b;',
      'border-radius:16px;padding:22px 20px 18px;box-shadow:0 18px 50px rgba(0,0,0,.6);',
      'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}',
      '.ra-acc-card h2{margin:0 0 2px;font-size:20px;color:#f3e2a8}',
      '.ra-acc-sub{margin:0 0 16px;font-size:13px;color:#b6a982}',
      '.ra-acc-tabs{display:flex;gap:6px;margin-bottom:14px}',
      '.ra-acc-tabs button{flex:1;padding:8px;border-radius:9px;border:1px solid #5a4e34;',
      'background:#2c2519;color:#cdbf9e;font-weight:600;cursor:pointer;font-size:13px}',
      '.ra-acc-tabs button.on{background:#c9a24b;color:#211c15;border-color:#c9a24b}',
      '.ra-acc-card label{display:block;font-size:12px;color:#b6a982;margin:10px 0 4px}',
      '.ra-acc-card input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:9px;',
      'border:1px solid #5a4e34;background:#1a160f;color:#efe6cf;font-size:15px}',
      '.ra-acc-card input:focus{outline:none;border-color:#c9a24b}',
      '.ra-acc-go{width:100%;margin-top:16px;padding:11px;border-radius:10px;border:none;',
      'background:#c9a24b;color:#211c15;font-weight:700;font-size:15px;cursor:pointer}',
      '.ra-acc-go:disabled{opacity:.6;cursor:default}',
      '.ra-acc-msg{margin-top:12px;font-size:13px;min-height:16px}',
      '.ra-acc-msg.err{color:#e8a07a}.ra-acc-msg.ok{color:#9fd08a}',
      '.ra-acc-x{position:absolute;top:10px;right:14px;background:none;border:none;color:#b6a982;',
      'font-size:22px;cursor:pointer;line-height:1}',
      '.ra-acc-card{position:relative}',
      '.ra-acc-who{font-size:14px;color:#efe6cf;margin:6px 0 14px;word-break:break-all}',
      '.ra-acc-who b{color:#f3e2a8}',
      '.ra-acc-foot{margin-top:14px;font-size:11px;color:#8a7f63;text-align:center}'
    ].join('');
    document.head.appendChild(css);

    var btn = document.createElement('button');
    btn.id = 'ra-acc-btn';
    btn.type = 'button';
    btn.textContent = '👤 Account';
    document.body.appendChild(btn);

    var ov = document.createElement('div');
    ov.id = 'ra-acc-ov';
    document.body.appendChild(ov);

    var mode = 'login';
    function shortEmail(u) { var e = (u && u.email) || ''; return e; }

    function render() {
      var u = RA.user();
      if (u) {
        ov.innerHTML =
          '<div class="ra-acc-card"><button class="ra-acc-x" data-x>×</button>' +
          '<h2>Je bent ingelogd</h2>' +
          '<p class="ra-acc-who">Ingelogd als <b>' + esc(shortEmail(u)) + '</b></p>' +
          '<p class="ra-acc-sub">Je voortgang wordt automatisch in de cloud bewaard en op elk apparaat geladen zodra je inlogt.</p>' +
          '<button class="ra-acc-go" data-logout>Uitloggen</button>' +
          '<div class="ra-acc-foot">RetroAdventureWorld-account</div></div>';
      } else {
        ov.innerHTML =
          '<div class="ra-acc-card"><button class="ra-acc-x" data-x>×</button>' +
          '<h2>' + (mode === 'login' ? 'Inloggen' : 'Account aanmaken') + '</h2>' +
          '<p class="ra-acc-sub">Bewaar je voortgang en speel verder op elk apparaat.</p>' +
          '<div class="ra-acc-tabs">' +
          '<button data-mode="login" class="' + (mode === 'login' ? 'on' : '') + '">Inloggen</button>' +
          '<button data-mode="register" class="' + (mode === 'register' ? 'on' : '') + '">Registreren</button></div>' +
          '<label>E-mailadres</label><input type="email" data-email autocomplete="email" inputmode="email" placeholder="jij@voorbeeld.nl">' +
          '<label>Wachtwoord</label><input type="password" data-pass autocomplete="' + (mode === 'login' ? 'current-password' : 'new-password') + '" placeholder="minstens 6 tekens">' +
          '<button class="ra-acc-go" data-go>' + (mode === 'login' ? 'Inloggen' : 'Account aanmaken') + '</button>' +
          '<div class="ra-acc-msg" data-msg></div>' +
          '<div class="ra-acc-foot">Gratis · je e-mail wordt alleen voor je account gebruikt</div></div>';
      }
    }

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
    function open() { render(); ov.classList.add('open'); }
    function close() { ov.classList.remove('open'); }

    btn.addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

    ov.addEventListener('click', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-x')) { close(); return; }
      if (t.hasAttribute('data-mode')) { mode = t.getAttribute('data-mode'); render(); return; }
      if (t.hasAttribute('data-logout')) { RA.signOut().then(function () { close(); }); return; }
      if (t.hasAttribute('data-go')) { submit(); return; }
    });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Enter' && ov.querySelector('[data-go]')) submit(); });

    function submit() {
      var card = ov.querySelector('.ra-acc-card');
      var email = card.querySelector('[data-email]').value;
      var pass = card.querySelector('[data-pass]').value;
      var go = card.querySelector('[data-go]');
      var msg = card.querySelector('[data-msg]');
      msg.className = 'ra-acc-msg'; msg.textContent = '';
      if (!email || !pass) { msg.className = 'ra-acc-msg err'; msg.textContent = 'Vul je e-mail en wachtwoord in.'; return; }
      go.disabled = true; go.textContent = 'Even geduld…';
      var p = (mode === 'login') ? RA.signIn(email, pass) : RA.signUp(email, pass);
      p.then(function () { return afterAuth(); })
        .then(function (reloaded) {
          if (reloaded) return; // pagina herlaadt
          msg.className = 'ra-acc-msg ok'; msg.textContent = 'Gelukt!';
          setTimeout(function () { render(); }, 400);
        })
        .catch(function (err) {
          go.disabled = false; go.textContent = (mode === 'login' ? 'Inloggen' : 'Account aanmaken');
          msg.className = 'ra-acc-msg err'; msg.textContent = err.message || 'Er ging iets mis.';
        });
    }

    /* Na inloggen: cloud-opslag ophalen (of lokale opslag uploaden) per geregistreerde game.
       Als er een cloud-save geladen is die de game moet tonen, herladen we de pagina. */
    function afterAuth() {
      var slugs = Object.keys(RA.saves || {});
      if (!slugs.length) return Promise.resolve(false);
      var pulledAny = false;
      return slugs.reduce(function (chain, slug) {
        return chain.then(function () {
          return RA.cloudLoad(slug).then(function (cloud) {
            if (cloud != null) { pulledAny = true; }
            else { return RA.cloudSave(slug); } // geen cloud-save: lokale voortgang uploaden
          });
        });
      }, Promise.resolve()).then(function () {
        if (pulledAny) { setTimeout(function () { location.reload(); }, 250); return true; }
        return false;
      });
    }

    RA.onChange(function (u) {
      btn.textContent = u ? ('👤 ' + (u.email ? u.email.split('@')[0] : 'Account')) : '👤 Account';
    });
  });
})();
