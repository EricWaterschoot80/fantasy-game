/* ============================================================
   account.js — gedeelde Supabase-accounts + cloud-opslag voor
   alle RetroAdventureWorld-spellen.

   Vereist dat supabase-js (UMD) er al staat als window.supabase:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="/shared/account.js"></script>
     <script src="/shared/account-ui.js"></script>

   Project: supabase-amber-village (alleen voor de games).
   De URL + publishable/anon key horen in de client te staan (zijn publiek/veilig).
   ============================================================ */
(function () {
  var URL = 'https://almjzogpokjbueabkcuh.supabase.co';
  // Publieke anon-sleutel (veilig in de client; row-level-security beschermt de data).
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbWp6b2dwb2tqYnVlYWJrY3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODExMjAsImV4cCI6MjA4MjA1NzEyMH0.jkrCtnkwRu6y6to7YfQ1PZUVYIs7Ykp1NVECV1q_Bno';

  if (!window.supabase || !window.supabase.createClient) {
    console.warn('[account] supabase-js niet geladen — account-functies uit.');
    return;
  }

  var client = window.supabase.createClient(URL, ANON, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'raw-auth' }
  });

  var listeners = [];
  var currentUser = null;
  var saves = {};        // gameSlug -> localStorage-sleutel
  var timers = {};
  var patched = false;

  function notify() { listeners.forEach(function (fn) { try { fn(currentUser); } catch (e) {} }); }

  function mapErr(m) {
    if (/Invalid login/i.test(m)) return 'Onjuist e-mailadres of wachtwoord.';
    if (/Email not confirmed/i.test(m)) return 'Account nog niet bevestigd.';
    return m || 'Er ging iets mis.';
  }

  /* Bij elke lokale opslag (setItem) van een geregistreerde game-sleutel:
     ook (vertraagd) naar de cloud schrijven als je bent ingelogd. */
  function patchLocalStorage() {
    if (patched) return; patched = true;
    var orig = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (k, v) {
      orig(k, v);
      if (!currentUser) return;
      var slug = null;
      for (var s in saves) { if (saves[s] === k) { slug = s; break; } }
      if (!slug) return;
      clearTimeout(timers[slug]);
      timers[slug] = setTimeout(function () { RA.cloudSave(slug); }, 800);
    };
  }

  var RA = {
    client: client,
    saves: saves,
    user: function () { return currentUser; },
    isReady: false,

    onChange: function (fn) { listeners.push(fn); if (RA.isReady) { try { fn(currentUser); } catch (e) {} } },

    signUp: function (email, password) {
      return fetch(URL + '/functions/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': ANON, 'Authorization': 'Bearer ' + ANON },
        body: JSON.stringify({ email: email, password: password })
      }).then(function (res) {
        return res.json().catch(function () { return { error: 'Onbekende fout.' }; })
          .then(function (out) {
            if (!res.ok) throw new Error(out.error || 'Registreren mislukt.');
            return RA.signIn(email, password);
          });
      });
    },

    signIn: function (email, password) {
      return client.auth.signInWithPassword({ email: String(email).trim().toLowerCase(), password: password })
        .then(function (r) { if (r.error) throw new Error(mapErr(r.error.message)); return r.data.user; });
    },

    signOut: function () { return client.auth.signOut(); },

    /* Koppel een game (slug) aan zijn localStorage-opslagsleutel. */
    registerSave: function (gameSlug, lsKey) {
      saves[gameSlug] = lsKey;
      patchLocalStorage();
      if (currentUser) RA._pull(gameSlug);
    },

    cloudSave: function (gameSlug) {
      var lsKey = saves[gameSlug];
      if (!lsKey || !currentUser) return Promise.resolve(false);
      var raw = localStorage.getItem(lsKey);
      if (raw == null) return Promise.resolve(false);
      var data; try { data = JSON.parse(raw); } catch (e) { data = { raw: raw }; }
      return client.from('game_saves')
        .upsert({ user_id: currentUser.id, game: gameSlug, data: data }, { onConflict: 'user_id,game' })
        .then(function (r) { return !r.error; });
    },

    cloudLoad: function (gameSlug) {
      var lsKey = saves[gameSlug];
      if (!currentUser) return Promise.resolve(null);
      return client.from('game_saves').select('data').eq('user_id', currentUser.id).eq('game', gameSlug).maybeSingle()
        .then(function (r) {
          if (r.error || !r.data) return null;
          if (lsKey) localStorage.setItem(lsKey, JSON.stringify(r.data.data));
          return r.data.data;
        });
    },

    _pull: function (slug) {
      var lsKey = saves[slug];
      return RA.cloudLoad(slug).then(function (got) {
        if (got != null) {
          window.dispatchEvent(new CustomEvent('ra-cloud-loaded', { detail: { game: slug } }));
          return got;
        }
        // Geen cloud-opslag: lokale voortgang (cache) alvast uploaden zodat het bewaard is.
        if (lsKey && localStorage.getItem(lsKey) != null) RA.cloudSave(slug);
        return null;
      }).catch(function () { return null; });
    },

    _pullAll: function () {
      if (!currentUser) return;
      Object.keys(saves).forEach(function (s) { RA._pull(s); });
    },

    /* Catalogus van alle RetroAdventureWorld-spellen (voor het account-overzicht). */
    GAMES: [
      { slug: 'ravenholt',       title: 'Whispers of Ravenholt — Deel 1', url: '/games/ravenholt/' },
      { slug: 'ravenholt-deel2', title: 'Whispers of Ravenholt — Deel 2', url: '/games/ravenholt-deel2/' }
    ],

    /* Haal voor de ingelogde speler op welke spellen hij speelt of heeft uitgespeeld.
       Geeft per spel: { slug, title, url, played, completed }. */
    listProgress: function () {
      if (!currentUser) return Promise.resolve(RA.GAMES.map(function (g) {
        return { slug: g.slug, title: g.title, url: g.url, played: false, completed: false };
      }));
      return client.from('game_saves').select('game,data').eq('user_id', currentUser.id)
        .then(function (r) {
          var byGame = {};
          (r.data || []).forEach(function (row) { byGame[row.game] = row.data; });
          return RA.GAMES.map(function (g) {
            var d = byGame[g.slug];
            var done = !!(d && d.flags && d.flags.gameComplete);
            return { slug: g.slug, title: g.title, url: g.url, played: !!d, completed: done };
          });
        })
        .catch(function () {
          return RA.GAMES.map(function (g) {
            return { slug: g.slug, title: g.title, url: g.url, played: false, completed: false };
          });
        });
    }
  };

  var lastUid = null;
  function onSession(user) {
    var wasOut = !lastUid;
    currentUser = user || null;
    RA.isReady = true;
    notify();
    if (currentUser && (wasOut || lastUid !== currentUser.id)) RA._pullAll();   // bij inloggen: cloud ophalen
    lastUid = currentUser ? currentUser.id : null;
  }

  client.auth.onAuthStateChange(function (_ev, session) { onSession(session && session.user); });
  client.auth.getSession().then(function (r) { onSession(r.data && r.data.session ? r.data.session.user : null); });

  window.RAAuth = RA;
})();
