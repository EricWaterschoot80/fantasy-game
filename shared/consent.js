/* ============================================================
   consent.js — cookie choice for RetroAdventureWorld.
   Google Analytics (GA4) is only loaded AFTER the visitor says yes.
   Until then nothing is sent to Google at all.
   The choice is stored in localStorage ('raw-consent': 'granted' | 'denied').
   Reopen the banner from anywhere with: window.rawConsent.open()
   ============================================================ */
(function () {
  var GA_ID = 'G-CGDJ4FQ8JQ';
  var KEY = 'raw-consent';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var docLang = (document.documentElement.lang || '').toLowerCase();
  var nl = docLang.indexOf('nl') === 0 || (docLang.indexOf('en') !== 0 && (navigator.language || '').toLowerCase().indexOf('nl') === 0);
  try {
    /* games keep their own language choice */
    ['emberfall_lang', 'maanhoef_lang', 'ravenholt_lang', 'ravenholt2_lang', 'raw-lang'].forEach(function (k) {
      var v = localStorage.getItem(k); if (v === 'nl') nl = true; else if (v === 'en' && docLang.indexOf('nl') !== 0) nl = false;
    });
  } catch (e) {}
  var T = nl ? {
    text: 'Mogen we anoniem meten hoe de spellen gespeeld worden? Dan plaatst Google Analytics cookies. Zonder toestemming meten we niets.',
    yes: 'Ja, mag', no: 'Nee, liever niet', more: 'Privacy', privacy: '/nl/privacy/', label: 'Cookie-keuze'
  } : {
    text: 'May we measure anonymously how the games are played? Google Analytics will then set cookies. Without your OK we measure nothing.',
    yes: 'Yes, OK', no: 'No thanks', more: 'Privacy', privacy: '/privacy/', label: 'Cookie choice'
  };

  var loaded = false;
  function loadGA() {
    if (loaded) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearGA() {
    /* remove Analytics cookies left from an earlier "yes" */
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var box = null;
  function close() { if (box) { box.remove(); box = null; } }
  function choose(v) {
    set(v); close();
    if (v === 'granted') loadGA();
    else { clearGA(); if (loaded) location.reload(); }
  }
  function open() {
    if (box) return;
    var css = document.createElement('style');
    css.textContent =
      '#raw-consent{position:fixed;z-index:2147483600;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));translate:-50% 0;' +
      'width:min(560px,calc(100vw - 20px));box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;' +
      'padding:12px 14px;background:#0b1622;color:#f2f0ea;font:15px/1.4 Nunito,"Trebuchet MS",system-ui,sans-serif;' +
      'box-shadow:inset 0 0 0 2px #1a0d05,inset 0 0 0 4px #d9a23c,inset 0 0 0 5px #1a0d05,0 8px 24px rgba(0,0,0,.5)}' +
      '#raw-consent p{margin:0;flex:1 1 260px}' +
      '#raw-consent a{color:#ffd766;text-underline-offset:.2em}' +
      '#raw-consent .b{display:flex;gap:8px;flex:0 0 auto;align-items:center}' +
      '#raw-consent button{min-height:44px;padding:4px 14px;border:0;cursor:pointer;font:600 15px/1 Nunito,"Trebuchet MS",sans-serif}' +
      '#raw-consent .y{background:#f6ae33;color:#2b1606;box-shadow:inset 0 0 0 2px #7a4210,inset 0 -4px 0 #d48a1f}' +
      '#raw-consent .n{background:transparent;color:#f2f0ea;box-shadow:inset 0 0 0 2px #5d6b78}' +
      '#raw-consent button:focus-visible,#raw-consent a:focus-visible{outline:3px solid #ffd766;outline-offset:2px}' +
      '@media (max-height:420px){#raw-consent{font-size:13px;padding:8px 10px;gap:6px 10px}#raw-consent p{flex-basis:300px}}';
    box = document.createElement('div');
    box.id = 'raw-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', T.label);
    box.innerHTML = '<p>' + T.text + ' <a href="' + T.privacy + '">' + T.more + '</a></p>' +
      '<div class="b"><button type="button" class="n">' + T.no + '</button><button type="button" class="y">' + T.yes + '</button></div>';
    box.appendChild(css);
    box.querySelector('.y').addEventListener('click', function () { choose('granted'); });
    box.querySelector('.n').addEventListener('click', function () { choose('denied'); });
    document.body.appendChild(box);
  }

  window.rawConsent = { open: open, get: get };
  /* Game events (start, step reached, completed, hint used). Sends nothing without consent. */
  window.rawTrack = function (name, params) {
    if (loaded && window.gtag) window.gtag('event', name, params || {});
  };
  var c = get();
  if (c === 'granted') loadGA();
  else if (c !== 'denied') {
    if (document.body) open(); else document.addEventListener('DOMContentLoaded', open);
  }
})();
