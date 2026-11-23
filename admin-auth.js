/* SUJAG Education - admin-auth.js
   Admin login gate and the encrypted members vault.
   - The login stores only a salted PBKDF2 hash in data/auth.js (never the password).
   - Members are encrypted in the browser (AES-GCM, key derived from your username + password) and the
     ciphertext is saved in the repository, so the same list opens in every browser after you sign in.
   HONEST LIMITS: a static site cannot enforce a login on the server. The login keeps casual visitors out of the
   admin screens and protects the members file by encryption. Publishing changes still needs your GitHub token. */
(function () {
  "use strict";
  var A = window.SUJAG_ADMINAPP, h = A.h, C = window.SUJAG_ADMIN, enc = new TextEncoder(), dec = new TextDecoder();
  var IDLE = 30 * 60 * 1000, ITER = 200000, aes = null, who = "";
  function hex(b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, "0"); }).join(""); }
  function unhex(s) { return Uint8Array.from(s.match(/../g) || [], function (x) { return parseInt(x, 16); }); }
  function b64(b) { var u = new Uint8Array(b), s = "", i; for (i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(t) { return Uint8Array.from(atob(t), function (c) { return c.charCodeAt(0); }); }
  function pbkdf2(text, salt, iter, bits) { return crypto.subtle.importKey("raw", enc.encode(text), "PBKDF2", false, ["deriveBits"]).then(function (k) { return crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: iter, hash: "SHA-256" }, k, bits); }); }
  function norm(u) { return String(u || "").trim().toLowerCase(); }
  function makeHash(u, p, saltHex, iter) { return pbkdf2(norm(u) + ":" + p, unhex(saltHex), iter, 256).then(hex); }
  function makeKey(u, p, saltHex) { return pbkdf2(norm(u) + ":" + p + "|vault", unhex(saltHex), 100000, 256).then(hex); }
  var proof = "", proofHash = "", loginHash = "";
  async function resultsCredentials(keyHex) {
    var key = await crypto.subtle.importKey("raw", unhex(keyHex), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    var token = hex(await crypto.subtle.sign("HMAC", key, enc.encode("SUJAG Education results admin v1")));
    var verifier = hex(await crypto.subtle.digest("SHA-256", enc.encode(token)));
    return { token: token, verifier: verifier };
  }
  A.resultProof = function () { return proof; };
  // Upgrade an older published login once. GitHub credentials go only to GitHub.
  A.linkResultsLogin = async function () {
    if (!proof || !loginHash || !A.G.token) return false;
    var g = A.G;
    var path = "/repos/" + encodeURIComponent(g.owner) + "/" + encodeURIComponent(g.repo) + "/contents/" + A.epath(C.authFile);
    var file = await A.gh("GET", path + "?ref=" + encodeURIComponent(g.branch));
    var source = A.unb64t(file.content);
    var match = /SUJAG\.auth\s*=\s*(\{[\s\S]*?\})\s*;?\s*$/.exec(source);
    if (!match) throw new Error("Could not read the published CMS login.");
    var auth = JSON.parse(match[1]);
    if (auth.hash !== loginHash) throw new Error("Your CMS login has changed. Please sign in again.");
    if (auth.resultsVerifier === proofHash) return true;
    if (auth.resultsVerifier) throw new Error("Sign in with the current CMS login before linking results.");
    auth.resultsVerifier = proofHash;
    await A.gh("PUT", path, { message: "Link the existing CMS login to test results", content: A.b64t(authJs(auth)), sha: file.sha, branch: g.branch });
    return true;
  };
  function useKey(keyHex) { return crypto.subtle.importKey("raw", unhex(keyHex), "AES-GCM", false, ["encrypt", "decrypt"]).then(function (k) { aes = k; }); }
  var V = (A.vault = {
    ready: function () { return !!aes; },
    encrypt: function (text) { var iv = crypto.getRandomValues(new Uint8Array(12)); return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, aes, enc.encode(text)).then(function (ct) { var o = new Uint8Array(12 + ct.byteLength); o.set(iv); o.set(new Uint8Array(ct), 12); return b64(o); }); },
    decrypt: function (t) { var u = unb64(t); return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.subarray(0, 12) }, aes, u.subarray(12)).then(function (p) { return dec.decode(p); }); }
  });
  function authJs(a) { return "/* Admin login (salted hash only). Written by the admin panel. */\nwindow.SUJAG = window.SUJAG || {};\nSUJAG.auth = " + JSON.stringify(a, null, 2) + ";\n"; }
  function loadAuth() {
    return new Promise(function (ok) { var s = document.createElement("script"); s.src = C.authFile + "?v=" + Date.now(); s.onload = function () { ok((window.SUJAG || {}).auth || null); }; s.onerror = function () { ok(null); }; document.head.appendChild(s); });
  }
  function secure() { return !!(window.crypto && crypto.subtle); }
  function lockState() { try { return JSON.parse(localStorage.getItem("sujag:admin:fails") || "{}"); } catch (e) { return {}; } }
  function setLock(o) { try { localStorage.setItem("sujag:admin:fails", JSON.stringify(o)); } catch (e) {} }

  function gateBox(title, nodes) {
    var g = document.getElementById("gate"); if (g) g.remove();
    g = h("div", { id: "gate" }, h("div", { c: "gate-card" }, h("img", { src: "logo-full.png", alt: "SUJAG Education", height: 90, style: "height:90px;width:auto;display:block;margin:0 auto 6px" }), h("h1", { style: "text-align:center;font-size:21px" }, title), nodes));
    document.body.appendChild(g); var f = g.querySelector("input"); if (f) f.focus(); return g;
  }
  function enter(keyHex, user, done) {
    return Promise.all([useKey(keyHex), resultsCredentials(keyHex)]).then(function (parts) {
      proof = parts[1].token; proofHash = parts[1].verifier;
      who = user; try { sessionStorage.setItem("sujag:admin:sess", JSON.stringify({ k: keyHex, u: user, h: loginHash, t: Date.now() })); } catch (e) {}
      var g = document.getElementById("gate"); if (g) g.remove(); document.body.classList.add("authed"); startIdle(); done();
    });
  }
  var idleT;
  function startIdle() {
    function bump() { clearTimeout(idleT); try { var s = JSON.parse(sessionStorage.getItem("sujag:admin:sess") || "null"); if (s) { s.t = Date.now(); sessionStorage.setItem("sujag:admin:sess", JSON.stringify(s)); } } catch (e) {} idleT = setTimeout(A.logout, IDLE); }
    ["click", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, bump, { passive: true }); }); bump();
  }
  A.logout = function () { try { sessionStorage.removeItem("sujag:admin:sess"); } catch (e) {} location.reload(); };
  A.who = function () { return who; };

  function loginUI(auth, done) {
    var u = h("input", { type: "text", autocomplete: "username", required: true }), p = h("input", { type: "password", autocomplete: "current-password", required: true }), msg = h("div", { c: "note bad", style: "display:none" });
    var f = h("form", {}, h("label", { c: "f" }, h("span", {}, "Username"), u), h("label", { c: "f" }, h("span", {}, "Password"), p), msg, h("button", { c: "btn primary", type: "submit", style: "width:100%" }, "Sign in"),
      h("p", { c: "mut", style: "font-size:13px;margin:12px 0 0" }, "Forgot the password? Delete ", h("b", {}, C.authFile), " from the repository to set a new login. Saved members cannot be read without the old password, so keep a CSV backup."));
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var L = lockState(), now = Date.now();
      if (L.until && now < L.until) { show("Too many attempts. Try again in " + Math.ceil((L.until - now) / 1000) + " seconds."); return; }
      makeHash(u.value, p.value, auth.salt, auth.iter || ITER).then(function (hh) {
        if (hh !== auth.hash) { var n = (L.n || 0) + 1; setLock({ n: n, until: n >= 5 ? now + Math.min(3600, 30 * Math.pow(2, n - 5)) * 1000 : 0 }); show("Wrong username or password."); return; }
        loginHash = auth.hash; setLock({}); return makeKey(u.value, p.value, auth.salt).then(function (k) { return enter(k, norm(u.value), done); });
      });
    });
    function show(t) { msg.style.display = "block"; msg.textContent = t; }
    gateBox("Admin login", f);
  }
  function setupUI(done) {
    var G = A.G, u = h("input", { type: "text", autocomplete: "username", required: true }), p = h("input", { type: "password", autocomplete: "new-password", required: true }), p2 = h("input", { type: "password", autocomplete: "new-password", required: true }), tok = h("input", { type: "password", autocomplete: "off", required: true, placeholder: "github_pat_..." });
    var o = h("input", { type: "text", value: G.owner, required: true }), r = h("input", { type: "text", value: G.repo, required: true }), b = h("input", { type: "text", value: G.branch || "main", required: true }), msg = h("div", { c: "note bad", style: "display:none" });
    var f = h("form", {}, h("p", { c: "mut", style: "margin-top:0" }, "First-time setup. Choose the admin username and password, and connect GitHub (token with Contents: Read and write for this one repository)."),
      h("label", { c: "f" }, h("span", {}, "New username"), u), h("label", { c: "f" }, h("span", {}, "New password (10+ characters, use a long phrase)"), p), h("label", { c: "f" }, h("span", {}, "Repeat password"), p2),
      h("div", { c: "cols" }, h("label", { c: "f" }, h("span", {}, "GitHub owner"), o), h("label", { c: "f" }, h("span", {}, "Repository"), r), h("label", { c: "f" }, h("span", {}, "Branch"), b)), h("label", { c: "f" }, h("span", {}, "GitHub token"), tok), msg, h("button", { c: "btn primary", type: "submit", style: "width:100%" }, "Create login"));
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (p.value.length < 10) return show("Password must be at least 10 characters."); if (p.value !== p2.value) return show("The passwords do not match.");
      G.owner = o.value.trim(); G.repo = r.value.trim(); G.branch = b.value.trim() || "main"; G.token = tok.value.trim();
      var salt = hex(crypto.getRandomValues(new Uint8Array(16)));
      A.gh("GET", "/repos/" + G.owner + "/" + G.repo).then(function (rp) {
        if (!(rp.permissions && rp.permissions.push)) throw new Error("This token cannot write to the repository. It needs Contents: Read and write.");
        return makeHash(u.value, p.value, salt, ITER);
      }).then(async function (hh) {
        var k = await makeKey(u.value, p.value, salt), credentials = await resultsCredentials(k);
        await A.putFile(C.authFile, A.b64t(authJs({ salt: salt, hash: hh, iter: ITER, resultsVerifier: credentials.verifier })), "Set admin login");
        loginHash = hh; A.saveG(); return enter(k, norm(u.value), done);
      })
        .catch(function (er) { show(A.friendly ? A.friendly(er) : er.message); });
    });
    function show(t) { msg.style.display = "block"; msg.textContent = t; }
    gateBox("Set up admin login", f);
  }
  A.gate = function (done) {
    if (!secure()) { gateBox("Secure connection needed", h("p", {}, "The login needs HTTPS. Open the admin page from your https:// website address (GitHub Pages), not from a file on your phone.")); return; }
    try { var s = JSON.parse(sessionStorage.getItem("sujag:admin:sess") || "null"); if (s && Date.now() - s.t < IDLE) { loginHash = s.h || ""; enter(s.k, s.u, done); return; } } catch (e) {}
    loadAuth().then(function (auth) { auth ? loginUI(auth, done) : setupUI(done); });
  };

  /* Change username/password: re-encrypts the members vault with the new key. */
  A.auth = {
    changeCard: function () {
      var u = h("input", { type: "text", value: who }), p = h("input", { type: "password", autocomplete: "new-password" }), p2 = h("input", { type: "password", autocomplete: "new-password" }), out = h("div", {});
      return h("div", { c: "card" }, h("h3", {}, "Change admin login"), h("p", { c: "mut", style: "margin-top:0" }, "Needs the GitHub token (Settings above). The members vault is re-encrypted with the new login."),
        h("div", { c: "cols" }, h("label", { c: "f" }, h("span", {}, "Username"), u), h("label", { c: "f" }, h("span", {}, "New password"), p), h("label", { c: "f" }, h("span", {}, "Repeat password"), p2)),
        A.btn("Change login", function () {
          if (!A.G.token) { A.toast("Connect GitHub first.", true); return; } if (p.value.length < 10 || p.value !== p2.value) { A.toast("Passwords must match and be 10+ characters.", true); return; }
          var salt = hex(crypto.getRandomValues(new Uint8Array(16))), nk;
          makeHash(u.value, p.value, salt, ITER).then(function (hh) { return makeKey(u.value, p.value, salt).then(function (k) { nk = k; return hh; }); }).then(async function (hh) {
            var credentials = await resultsCredentials(nk), prev = aes;
            return A.members.readyToRekey().then(function (list) {
              return useKey(nk).then(function () { return A.members.saveNow(); }).then(function () { return A.putFile(C.authFile, A.b64t(authJs({ salt: salt, hash: hh, iter: ITER, resultsVerifier: credentials.verifier })), "Change admin login"); }).catch(function (e) { aes = prev; throw e; });
            });
          }).then(function () { who = norm(u.value); try { sessionStorage.removeItem("sujag:admin:sess"); } catch (e) {} out.className = "note"; out.textContent = "Login changed. Sign in again."; setTimeout(A.logout, 1500); })
            .catch(function (e) { out.className = "note bad"; out.textContent = (A.friendly ? A.friendly(e) : e.message); });
        }, "primary"), out);
    }
  };
})();
