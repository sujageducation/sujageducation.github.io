/* ==========================================================================
   SUJAG Education - admin.js
   Admin panel core: loads the site's data files, lets you edit them, and
   saves them back to your GitHub repository (or lets you download them).
   Views for members live in admin-members.js.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.SUJAG_ADMIN;
  var A = (window.SUJAG_ADMINAPP = {});
  var D = {}, BASE = {}, PEND = {};
  var G = { owner: "", repo: "", branch: "main", token: "", remember: false };
  var GROUPS = { site: ["site"], tests: ["testCategories", "testGroups", "defaultInstructions", "tests"], notes: ["noteCategories", "notes"], books: ["books"], updates: ["updates"], pages: ["pages"] };
  var LABEL = { site: "Site settings", tests: "Mock tests", notes: "Study notes", books: "Books", updates: "Latest updates", pages: "Page text" };
  var ROUTES = {};
  var viewEl = document.getElementById("view");
  A.D = D; A.G = G; A.ROUTES = ROUTES;

  /* ---------- small helpers ---------- */
  function h(tag, a) {
    var e = document.createElement(tag), n, v; a = a || {};
    for (n in a) {
      v = a[n]; if (v == null || v === false) continue;
      if (n === "c") e.className = v;
      else if (n.slice(0, 2) === "on") e.addEventListener(n.slice(2), v);
      else if (n === "value" || n === "checked" || n === "disabled") e[n] = v;
      else if (n === "html") e.innerHTML = v;
      else e.setAttribute(n, v === true ? "" : v);
    }
    Array.prototype.slice.call(arguments, 2).forEach(function add(c) {
      if (Array.isArray(c)) return c.forEach(add);
      if (c == null || c === false) return;
      e.appendChild(c.nodeType ? c : document.createTextNode(c));
    });
    return e;
  }
  A.h = h;
  function cl(x) { return JSON.parse(JSON.stringify(x === undefined ? null : x)); }
  function J(x) { return JSON.stringify(x, null, 2); }
  function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60); }
  function safeName(n) { var m = /^(.*?)(\.[A-Za-z0-9]+)?$/.exec(n || "file"); return (slug(m[1]) || "file") + (m[2] || "").toLowerCase(); }
  function uniqueId(list, base) { var id = base || "item", n = 2; while (list.some(function (x) { return x.id === id; })) id = base + "-" + n++; return id; }
  function today() { return new Date().toISOString().slice(0, 10); }
  function fmtSize(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; }
  A.slug = slug; A.today = today; A.safeName = safeName;
  function toast(msg, bad) { var t = document.getElementById("toast"), d = h("div", { c: bad ? "e" : "" }, msg); t.appendChild(d); setTimeout(function () { d.remove(); }, bad ? 6000 : 2800); }
  A.toast = toast;
  function modal(title, body, buttons) {
    var m = document.getElementById("modal"); m.innerHTML = "";
    var dlg = h("div", { c: "dlg", role: "dialog", "aria-modal": "true", "aria-label": title }, h("h2", { style: "margin-top:0" }, title), body, h("div", { c: "row", style: "margin-top:14px;justify-content:flex-end" }, buttons || [h("button", { c: "btn", type: "button", onclick: closeModal }, "Close")]));
    m.appendChild(dlg); var f = dlg.querySelector("input,button,textarea,select"); if (f) f.focus(); return dlg;
  }
  function closeModal() { document.getElementById("modal").innerHTML = ""; }
  A.modal = modal; A.closeModal = closeModal;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  function b64(buf) { var b = new Uint8Array(buf), s = "", i; for (i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
  function b64t(str) { return b64(new TextEncoder().encode(str)); }
  function unb64t(s) { var bin = atob(s.replace(/\s/g, "")), u = new Uint8Array(bin.length), i; for (i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new TextDecoder().decode(u); }
  A.b64t = b64t; A.unb64t = unb64t; A.unb64t_raw = function (s) { return s.replace(/\s/g, ""); }; A.fmtSize = fmtSize;

  /* ---------- form builders (edit objects in place) ---------- */
  function fld(label, ctrl, hint, cls) { return h("label", { c: "f " + (cls || "") }, h("span", {}, label), ctrl, hint ? h("small", {}, hint) : null); }
  A.fld = fld;
  function inp(o, k, opt) {
    opt = opt || {}; var t = opt.type || "text";
    var e = h(opt.area ? "textarea" : "input", { type: opt.area ? null : t, rows: opt.rows || 3, value: o[k] == null ? "" : o[k], placeholder: opt.ph, list: opt.list, oninput: function () { var v = e.value; o[k] = t === "number" ? (v === "" ? "" : Number(v)) : v; touch(); if (opt.on) opt.on(v); } });
    return fld(opt.label, e, opt.hint, opt.cls);
  }
  function lines(o, k, opt) {
    var e = h("textarea", { rows: opt.rows || 5, value: (o[k] || []).join("\n"), oninput: function () { o[k] = e.value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); touch(); } });
    return fld(opt.label, e, opt.hint);
  }
  function chk(o, k, label) { return h("label", { c: "chk" }, h("input", { type: "checkbox", checked: !!o[k], onchange: function (ev) { o[k] = ev.target.checked; touch(); } }), label); }
  function sel(o, k, opts, label, hint) {
    var e = h("select", { onchange: function () { o[k] = e.value; touch(); } }, opts.map(function (p) { p = Array.isArray(p) ? p : [p, p]; return h("option", { value: p[0], selected: String(o[k]) === String(p[0]) ? true : null }, p[1]); }));
    e.value = o[k] == null ? "" : o[k]; return fld(label, e, hint);
  }
  A.inp = inp; A.lines = lines; A.chk = chk; A.sel = sel;
  function btn(label, fn, cls) { return h("button", { type: "button", c: "btn " + (cls || ""), onclick: fn }, label); }
  A.btn = btn;
  function move(arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; touch(); }
  function rowBtns(arr, i, redraw) {
    return h("span", { c: "row", style: "gap:4px;flex-wrap:nowrap" },
      btn("Up", function () { move(arr, i, -1); redraw(); }, "sm"), btn("Down", function () { move(arr, i, 1); redraw(); }, "sm"),
      btn("Delete", function () { if (confirm("Delete this item?")) { arr.splice(i, 1); touch(); redraw(); } }, "sm danger"));
  }
  A.rowBtns = rowBtns;
  function head(title, lead, extra) { return h("div", { c: "row sp", style: "margin-bottom:14px" }, h("div", {}, h("h1", {}, title), lead ? h("p", { c: "lead", style: "margin:0" }, lead) : null), extra || null); }
  A.head = head;
  function setView(nodes) { viewEl.innerHTML = ""; [].concat(nodes).forEach(function (n) { if (n) viewEl.appendChild(n); }); }
  A.setView = setView;

  /* ---------- loading and dirty tracking ---------- */
  function loadScript(src, nocache) {
    return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = nocache ? src + "?v=" + Date.now() : src; s.onload = ok; s.onerror = function () { no(new Error("Could not load " + src)); }; document.head.appendChild(s); });
  }
  function group(f) { return GROUPS[f].map(function (k) { return D[k]; }); }
  function dirtyFiles() { return Object.keys(GROUPS).filter(function (f) { return J(group(f)) !== BASE[f]; }); }
  function snapshot(f) { BASE[f] = J(group(f)); }
  function loadAll() {
    return Promise.all(Object.keys(C.files).map(function (f) { return loadScript(C.files[f], true); })).then(function () {
      var S = window.SUJAG;
      D.site = cl(S.site || {});
      ["testCategories", "testGroups", "defaultInstructions", "tests", "noteCategories", "notes", "books", "updates"].forEach(function (k) { D[k] = cl((S.data || {})[k] || []); });
      D.pages = cl((S.data || {}).pages || {});
      D.site.social = D.site.social || {};
      Object.keys(GROUPS).forEach(snapshot);
    });
  }
  var draftTimer;
  function touch() {
    refreshBar(); clearTimeout(draftTimer);
    draftTimer = setTimeout(function () { try { localStorage.setItem("sujag:admin:draft", JSON.stringify({ t: Date.now(), D: D })); } catch (e) {} }, 700);
  }
  A.touch = touch; A.dirtyFiles = dirtyFiles;
  function refreshBar() {
    var d = dirtyFiles(), u = Object.keys(PEND).length, s = document.getElementById("status");
    s.innerHTML = "";
    if (!d.length && !u) { s.textContent = G.token ? "All changes are published. Connected to GitHub." : "No unpublished changes. GitHub is not connected yet (Settings)."; }
    else s.appendChild(h("span", {}, h("b", {}, "Unpublished changes: "), d.map(function (f) { return LABEL[f]; }).concat(u ? [u + " file upload(s)"] : []).join(", ")));
  }

  /* ---------- serializing data files ---------- */
  function serialize(f) {
    var head = "/* SUJAG Education - " + C.files[f] + "\n   Written by the admin panel on " + today() + ". You can still edit this file by hand. */\nwindow.SUJAG = window.SUJAG || {};\n";
    if (f === "site") return head + "SUJAG.site = " + J(D.site) + ";\n";
    return head + "SUJAG.data = SUJAG.data || {};\n" + GROUPS[f].map(function (k) { return "SUJAG.data." + k + " = " + J(D[k]) + ";\n"; }).join("\n");
  }

  /* ---------- checks before publishing ---------- */
  function checkTests() {
    var out = [], ids = {};
    D.tests.forEach(function (t) {
      var n = t.title || t.id || "(untitled test)";
      if (!t.id) out.push(n + ": missing id"); else if (ids[t.id]) out.push("Duplicate test id: " + t.id); ids[t.id] = 1;
      if (!t.title) out.push(t.id + ": missing title");
      if (!D.testCategories.some(function (c) { return c.id === t.category; })) out.push(n + ": category does not exist");
      if (!(t.duration > 0)) out.push(n + ": duration must be more than 0 minutes");
      if (!t.questions || !t.questions.length) out.push(n + ": has no questions");
      (t.questions || []).forEach(function (q, i) {
        if (!q.q) out.push(n + " Q" + (i + 1) + ": empty question");
        if (!q.o || q.o.length < 2 || q.o.some(function (x) { return !x; })) out.push(n + " Q" + (i + 1) + ": needs at least 2 non-empty options");
        else if (typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length) out.push(n + " Q" + (i + 1) + ": no correct answer selected");
      });
    });
    return out;
  }
  function checkOthers() {
    var out = [], ids = {};
    D.notes.forEach(function (n) { if (!n.id || !n.title) out.push("A note is missing its id or title"); if (ids["n" + n.id]) out.push("Duplicate note id: " + n.id); ids["n" + n.id] = 1; if (!D.noteCategories.some(function (c) { return c.id === n.category; })) out.push((n.title || n.id) + ": note category does not exist"); });
    D.books.forEach(function (b) { if (!b.id || !b.title) out.push("A book is missing its id or title"); if (ids["b" + b.id]) out.push("Duplicate book id: " + b.id); ids["b" + b.id] = 1; });
    [D.testCategories, D.noteCategories].forEach(function (list) { var s = {}; list.forEach(function (c) { if (!c.id || !c.name) out.push("A category is missing its id or name"); if (s[c.id]) out.push("Duplicate category id: " + c.id); s[c.id] = 1; }); });
    return out;
  }
  function validate() { return checkTests().concat(checkOthers()); }

  /* ---------- GitHub ---------- */
  function loadG() {
    var m = /^([^.]+)\.github\.io$/.exec(location.hostname), seg = location.pathname.split("/")[1];
    if (m) { G.owner = m[1]; G.repo = seg && seg !== "admin.html" ? seg : m[1] + ".github.io"; }
    try { var s = JSON.parse(sessionStorage.getItem("sujag:admin:gh") || localStorage.getItem("sujag:admin:gh") || "null"); if (s) { G.owner = s.owner || G.owner; G.repo = s.repo || G.repo; G.branch = s.branch || G.branch; G.token = s.token || ""; G.remember = !!s.remember; } } catch (e) {}
  }
  function saveG() {
    try { sessionStorage.removeItem("sujag:admin:gh"); localStorage.removeItem("sujag:admin:gh"); (G.remember ? localStorage : sessionStorage).setItem("sujag:admin:gh", JSON.stringify(G)); } catch (e) {}
  }
  function gh(method, path, body, tok) {
    return fetch("https://api.github.com" + path, { method: method, headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + (tok || G.token), "X-GitHub-Api-Version": "2022-11-28" }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.message || "HTTP " + r.status); e.status = r.status; throw e; } return j; }); });
  }
  function friendly(e) {
    if (e.status === 401) return "GitHub rejected the token (401). Create a new one.";
    if (e.status === 403) return "Not allowed (403). The token needs Contents: Read and write on this repository, or you hit a rate limit.";
    if (e.status === 404) return "Not found (404). Check owner, repository and branch, and that the token can access this repository.";
    return e.message || "Network error";
  }
  A.gh = gh; A.friendly = friendly; A.saveG = function () { saveG(); };
  function epath(p) { return p.split("/").map(encodeURIComponent).join("/"); }
  function putFile(path, b64content, message, repo) {
    repo = repo || G; var base = "/repos/" + repo.owner + "/" + repo.repo + "/contents/" + epath(path);
    function attempt() {
      return gh("GET", base + "?ref=" + encodeURIComponent(repo.branch)).catch(function (e) { if (e.status === 404) return {}; throw e; })
        .then(function (cur) { return gh("PUT", base, { message: message, content: b64content, branch: repo.branch, sha: cur.sha }); });
    }
    return attempt().catch(function (e) { if (e.status === 409 || e.status === 422) return attempt(); throw e; });
  }
  A.putFile = putFile; A.epath = epath;
  function needToken() { if (!G.token || !G.owner || !G.repo) { toast("Connect GitHub first (Settings).", true); location.hash = "#settings"; return true; } return false; }

  /* ---------- publish / download ---------- */
  function publish() {
    var errs = validate();
    if (errs.length) { modal("Fix these first", h("div", {}, h("p", { c: "mut" }, "Publishing is blocked because some content would break the public site:"), h("ul", {}, errs.slice(0, 25).map(function (x) { return h("li", {}, x); })), errs.length > 25 ? h("p", {}, "...and " + (errs.length - 25) + " more.") : null)); return; }
    var files = dirtyFiles(), ups = Object.keys(PEND);
    if (!files.length && !ups.length) { toast("Nothing to publish."); return; }
    if (needToken()) return;
    var msg = h("input", { type: "text", value: "Update content from admin panel" }), list = h("ul", { c: "steps" });
    var items = files.map(function (f) { return { label: C.files[f], path: C.files[f], f: f }; }).concat(ups.map(function (p) { return { label: p, path: p, up: p }; }));
    items.forEach(function (it) { it.li = h("li", {}, it.label + " "); it.st = h("span", { c: "tag" }, "waiting"); it.li.appendChild(it.st); list.appendChild(it.li); });
    var go = btn("Publish now", run, "primary"), out = h("div", {});
    var dlg = modal("Publish to GitHub", h("div", {}, h("p", {}, "These files will be committed to ", h("b", {}, G.owner + "/" + G.repo), " on branch ", h("b", {}, G.branch), ". The live site updates after GitHub Pages rebuilds (usually 1 to 2 minutes)."), list, fld("Commit message", msg), out), [btn("Cancel", closeModal), go]);
    function run() {
      go.disabled = true; var i = 0;
      (function next() {
        if (i >= items.length) { out.className = "note"; out.textContent = "Published. Refresh the public site in a minute or two."; go.remove(); refreshBar(); toast("Published"); return; }
        var it = items[i++]; it.st.textContent = "saving..."; 
        var content = it.f ? b64t(serialize(it.f)) : PEND[it.up].b64;
        putFile(it.path, content, msg.value || "Update from admin panel").then(function () {
          it.st.textContent = "done"; it.st.className = "tag"; if (it.f) snapshot(it.f); else delete PEND[it.up]; try { if (!dirtyFiles().length) localStorage.removeItem("sujag:admin:draft"); } catch (e) {} next();
        }).catch(function (e) { it.st.textContent = "failed"; it.st.className = "tag bad"; out.className = "note bad"; out.textContent = friendly(e) + " Nothing after this file was saved; you can try again."; go.disabled = false; go.textContent = "Try again"; items = items.slice(i - 1); i = 0; });
      })();
    }
  }
  function download() {
    var files = dirtyFiles(), ups = Object.keys(PEND);
    if (!files.length && !ups.length) { toast("No changed files to download."); return; }
    files.forEach(function (f) { save(new Blob([serialize(f)], { type: "text/javascript" }), C.files[f].split("/").pop()); });
    ups.forEach(function (p) { var bin = atob(PEND[p].b64), u = new Uint8Array(bin.length), i; for (i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); save(new Blob([u], { type: PEND[p].mime }), p.split("/").pop()); });
    toast("Downloaded " + (files.length + ups.length) + " file(s). Put them in the same folders on your repository.");
  }
  function save(blob, name) { var a = h("a", { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  A.save = save;

  /* ---------- uploads ---------- */
  function resizeImg(file, mw, mh, type) {
    return new Promise(function (ok, no) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var s = Math.min(1, mw / im.width, mh / im.height), c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        var x = c.getContext("2d"); if (type === "image/jpeg") { x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); } x.drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u); ok(c.toDataURL(type, 0.86).split(",")[1]);
      };
      im.onerror = function () { no(new Error("That file is not a readable image.")); }; im.src = u;
    });
  }
  /* Picks a file, stores it as a pending upload and calls done(path, file). kind: pdf | cover | logo */
  function pickUpload(kind, done) {
    var inpf = h("input", { type: "file", accept: kind === "pdf" ? "application/pdf,.pdf" : "image/*", onchange: function () {
      var f = inpf.files[0]; if (!f) return;
      if (f.size > 25 * 1048576) { toast("File is over 25 MB. Compress it first.", true); return; }
      var name = safeName(f.name), dir = kind === "pdf" ? C.notesDir : kind === "cover" ? C.booksDir : C.logoDir, path, p;
      if (kind === "pdf") { path = dir + name; p = f.arrayBuffer().then(function (b) { return { b64: b64(b), mime: "application/pdf" }; }); }
      else if (/svg/.test(f.type)) { path = dir + name; p = f.arrayBuffer().then(function (b) { return { b64: b64(b), mime: "image/svg+xml" }; }); }
      else if (kind === "cover") { path = dir + name.replace(/\.[a-z0-9]+$/, "") + ".jpg"; p = resizeImg(f, 600, 800, "image/jpeg").then(function (s) { return { b64: s, mime: "image/jpeg" }; }); }
      else { path = dir + name.replace(/\.[a-z0-9]+$/, "") + ".png"; p = resizeImg(f, 256, 256, "image/png").then(function (s) { return { b64: s, mime: "image/png" }; }); }
      p.then(function (r) { PEND[path] = r; touch(); done(path, f); toast("Ready. It is uploaded when you publish."); }).catch(function (e) { toast(e.message, true); });
    } });
    inpf.click();
  }
  function pendingSrc(path) { return PEND[path] ? "data:" + PEND[path].mime + ";base64," + PEND[path].b64 : path; }
  A.pendingSrc = pendingSrc;

  /* ---------- PDF / TXT text extraction ---------- */
  function pdfText(file, progress) {
    return (window.pdfjsLib ? Promise.resolve() : loadScript(C.pdfjs)).then(function () {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = C.pdfWorker;
      return file.arrayBuffer();
    }).then(function (buf) { return window.pdfjsLib.getDocument({ data: buf }).promise; }).then(function (pdf) {
      var out = [], p = 1;
      function page() {
        if (p > pdf.numPages) return out.join("\n");
        if (progress) progress("Reading page " + p + " of " + pdf.numPages);
        return pdf.getPage(p++).then(function (pg) { return pg.getTextContent(); }).then(function (tc) {
          var rows = [];
          tc.items.forEach(function (it) { if (!it.str) return; var y = Math.round(it.transform[5]), r = rows.filter(function (q) { return Math.abs(q.y - y) <= 3; })[0]; if (!r) { r = { y: y, it: [] }; rows.push(r); } r.it.push({ x: it.transform[4], s: it.str }); });
          rows.sort(function (a, b) { return b.y - a.y; }).forEach(function (r) { out.push(r.it.sort(function (a, b) { return a.x - b.x; }).map(function (i) { return i.s; }).join(" ").replace(/\s+/g, " ").trim()); });
          return page();
        });
      }
      return page();
    });
  }
  A.pdfText = pdfText;
  function readFileText(file, progress) {
    if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") return pdfText(file, progress);
    return file.text();
  }
  A.readFileText = readFileText;

  /* ---------- routing ---------- */
  var NAV = [["#dashboard", "Dashboard"], ["sep", "Mock tests"], ["#results", "Mock Test Results"], ["#tests", "All tests"], ["#generate", "Auto-generate from PDF or TXT"], ["#testcats", "Test categories"], ["sep", "Study material"], ["#notes", "Notes"], ["#notecats", "Note categories"], ["#books", "Books"], ["sep", "Website"], ["#updates", "Latest updates"], ["#pages", "Page text and FAQ"], ["#settings", "Settings and GitHub"], ["sep", "People"], ["#members", "Members"]];
  function buildNav() {
    var n = document.getElementById("nav"); n.innerHTML = "";
    NAV.forEach(function (x) { n.appendChild(x[0] === "sep" ? h("div", { c: "sep" }, x[1]) : h("a", { href: x[0] }, x[1])); });
  }
  function route() {
    var hash = location.hash.replace(/^#/, "") || "dashboard", parts = hash.split("/"), name = parts[0];
    var fn = ROUTES[name] || ROUTES.dashboard;
    [].forEach.call(document.querySelectorAll("#nav a"), function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + name || (name === "test" && a.getAttribute("href") === "#tests") || (name === "note" && a.getAttribute("href") === "#notes") || (name === "book" && a.getAttribute("href") === "#books")); });
    document.getElementById("side").classList.remove("open");
    try { fn(parts.slice(1).map(decodeURIComponent)); } catch (e) { setView(h("div", { c: "note bad" }, "Something went wrong showing this page: " + e.message)); }
    window.scrollTo(0, 0);
  }
  A.go = function (hash) { if (location.hash === hash) route(); else location.hash = hash; };
  A.redraw = route;

  /* ---------- dashboard ---------- */
  ROUTES.results = function () {
    var all=[]; try { all=JSON.parse(localStorage.getItem("sujag:results")||"[]"); } catch(e) { all=[]; }
    if(!Array.isArray(all)) all=[];
    var search=h("input",{type:"search",placeholder:"Search name, test, city or phone",c:"input",style:"max-width:420px"});
    var box=h("div",{c:"panel"});
    function csv(){ var keys=["submittedAt","name","city","phone","title","total","correct","wrong","unanswered","marks","percent","timeTaken","rid"]; var rows=[keys.join(",")].concat(all.map(function(r){var c=r.candidate||{};return keys.map(function(k){var v=k==="name"?c.name:k==="city"?c.city:k==="phone"?c.phone:r[k];return '"'+String(v==null?"":v).replace(/"/g,'""')+'"';}).join(",");}));var b=new Blob([rows.join("\n")],{type:"text/csv"}),u=URL.createObjectURL(b),a=h("a",{href:u,download:"sujag-test-results.csv"});a.click();setTimeout(function(){URL.revokeObjectURL(u)},1000);}
    function printResult(r){var c=r.candidate||{},html='<!doctype html><html><head><meta charset="utf-8"><title>SUJAG Education Result</title><style>body{font-family:Arial,sans-serif;margin:28px;color:#17212b}h1{color:#176b58}table{width:100%;border-collapse:collapse}td,th{padding:10px;border:1px solid #ddd;text-align:left}.score{font-size:30px;font-weight:bold}</style></head><body><h1>SUJAG Education</h1><h2>Mock Test Result</h2><p><b>Candidate:</b> '+(c.name||'')+'<br><b>City:</b> '+(c.city||'')+'<br><b>Phone:</b> '+(c.phone||'')+'</p><h2>'+r.title+'</h2><p class="score">'+r.marks+' / '+r.total+' — '+r.percent+'%</p><table><tr><th>Correct</th><th>Wrong</th><th>Unanswered</th><th>Time</th></tr><tr><td>'+r.correct+'</td><td>'+r.wrong+'</td><td>'+r.unanswered+'</td><td>'+r.timeTaken+' sec</td></tr></table><p>Submitted: '+new Date(r.submittedAt).toLocaleString()+'</p><p>Use Print → Save as PDF.</p></body></html>';var w=window.open("","_blank");if(w){w.document.write(html);w.document.close();w.focus();w.print();}}
    function draw(){var q=search.value.toLowerCase();var filtered=all.filter(function(r){var c=r.candidate||{};return [c.name,c.city,c.phone,r.title,r.category].join(" ").toLowerCase().includes(q);});box.innerHTML="";box.appendChild(h("div",{c:"row sp"},h("strong",{},filtered.length+" result record(s) on this browser"),h("div",{c:"row"},btn("Export CSV",csv),btn("Refresh",function(){ROUTES.results();}))));if(!filtered.length){box.appendChild(h("p",{c:"mut"},"No results found. Results saved by candidates in this browser/device will appear here."));return;}var table=h("div",{c:"table-wrap"}),t=h("table",{}),thead=h("thead",{},h("tr",{},["Candidate","Test","Score","City","Date",""].map(function(x){return h("th",{},x)}))),tbody=h("tbody",{});filtered.forEach(function(r){var c=r.candidate||{},tr=h("tr",{});[c.name||"—",r.title,r.marks+" / "+r.total+" ("+r.percent+"%)",c.city||"—",new Date(r.submittedAt).toLocaleString()].forEach(function(v){tr.appendChild(h("td",{},v));});var td=h("td",{},btn("PDF",function(){printResult(r);}),btn("Delete",function(){if(confirm("Delete this result from this browser?")){all=all.filter(function(x){return x.rid!==r.rid});localStorage.setItem("sujag:results",JSON.stringify(all));ROUTES.results();}},"danger"));tr.appendChild(td);tbody.appendChild(tr);});t.appendChild(thead);t.appendChild(tbody);table.appendChild(t);box.appendChild(table);}
    setView([head("Mock Test Results","Candidate attempts saved on this browser/device."),h("div",{c:"note warn"},"This dashboard reads browser-local results. Static GitHub Pages cannot receive submissions from other candidates' devices without a shared online storage service."),search,box]);search.addEventListener("input",draw);draw();
  };

  ROUTES.dashboard = function () {
    var qn = D.tests.reduce(function (s, t) { return s + (t.questions || []).length; }, 0), mem = (A.members ? A.members.count() : 0);
    var probs = validate();
    D.updates.forEach(function (u) { if (u.type !== "info" && !(u.type === "test" ? D.tests : u.type === "note" ? D.notes : D.books).some(function (x) { return x.id === u.id; })) probs.push("Latest update points to a missing " + u.type + ": " + u.id); });
    var stat = function (n, l, href) { return h("a", { c: "stat", href: href, style: "text-decoration:none;color:inherit" }, h("b", {}, String(n)), h("span", {}, l)); };
    setView([head("Dashboard", "Everything on the public website is managed from here."),
      !G.token ? h("div", { c: "note warn" }, "GitHub is not connected, so changes can only be downloaded. ", h("a", { href: "#settings" }, "Connect GitHub"), " to publish with one click.") : null,
      h("div", { c: "grid" }, stat(D.tests.length, "Mock tests", "#tests"), stat(qn, "Questions", "#tests"), stat(D.notes.length, "Notes", "#notes"), stat(D.books.length, "Books", "#books"), stat(mem, "Members (this browser)", "#members")),
      h("h2", {}, "Quick actions"),
      h("div", { c: "row" }, btn("New test", function () { A.go("#test/new"); }, "primary"), btn("Make a test from PDF or TXT", function () { A.go("#generate"); }), btn("New note", function () { A.go("#note/new"); }), btn("New book", function () { A.go("#book/new"); }), btn("Add a member", function () { A.go("#members"); })),
      h("h2", {}, "Health check"),
      probs.length ? h("div", { c: "note warn" }, h("b", {}, probs.length + " thing(s) to fix before publishing:"), h("ul", {}, probs.slice(0, 12).map(function (x) { return h("li", {}, x); }))) : h("div", { c: "note" }, "No problems found in tests, notes, books or categories."),
      h("h2", {}, "How saving works"),
      h("div", { c: "card" }, h("ol", { c: "steps", style: "margin:0;padding-left:20px" }, h("li", {}, "Make your edits. They are kept as a draft in this browser while you work."), h("li", {}, "Press Publish changes. The files are committed to your GitHub repository."), h("li", {}, "GitHub Pages rebuilds the site in a minute or two and visitors see the update."), h("li", {}, "No GitHub token? Use Download files and upload them to the repository yourself."))),
    ]);
  };

  /* ---------- question card (shared by test editor and generator) ---------- */
  var uid = 0;
  function qCard(arr, i, redraw) {
    var q = arr[i], name = "q" + (++uid), bad = typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length;
    var c = h("div", { c: "qc" + (bad ? " bad" : "") });
    c.appendChild(h("div", { c: "hd" }, h("b", {}, "Question " + (i + 1)), (q.warnings || []).map(function (w) { return h("span", { c: "tag warn" }, w); }), rowBtns(arr, i, redraw)));
    c.appendChild(inp(q, "q", { label: "Question", area: true, rows: 2 }));
    q.o.forEach(function (o, j) {
      var t = h("input", { type: "text", value: o, "aria-label": "Option " + "ABCDEF"[j], oninput: function () { q.o[j] = t.value; touch(); } });
      c.appendChild(h("div", { c: "opt" }, h("input", { type: "radio", name: name, checked: q.a === j, "aria-label": "Correct answer is " + "ABCDEF"[j], onchange: function () { q.a = j; touch(); c.classList.remove("bad"); } }), h("span", { c: "l" }, "ABCDEF"[j]), t,
        q.o.length > 2 ? btn("Remove", function () { q.o.splice(j, 1); if (q.a === j) q.a = null; else if (q.a > j) q.a--; touch(); redraw(); }, "sm ghost") : null));
    });
    c.appendChild(h("div", { c: "row", style: "margin-bottom:8px" }, q.o.length < 6 ? btn("Add option", function () { q.o.push(""); touch(); redraw(); }, "sm") : null, h("span", { c: "mut", style: "font-size:13px" }, "Select the circle next to the correct option.")));
    c.appendChild(inp(q, "e", { label: "Explanation (shown in the review)", area: true, rows: 2 }));
    return c;
  }
  A.qCard = qCard;

  /* ---------- tests ---------- */
  function catName(list, id) { var c = list.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; }
  ROUTES.tests = function () {
    var q = h("input", { type: "search", placeholder: "Search tests", "aria-label": "Search tests" }), cat = h("select", { "aria-label": "Category" }, h("option", { value: "" }, "All categories"), D.testCategories.map(function (c) { return h("option", { value: c.id }, c.name); }));
    var box = h("div", { c: "tw" });
    function draw() {
      var s = q.value.toLowerCase(), rows = D.tests.filter(function (t) { return (!cat.value || t.category === cat.value) && (!s || (t.title + " " + t.id).toLowerCase().indexOf(s) >= 0); });
      box.innerHTML = ""; if (!rows.length) { box.appendChild(h("div", { c: "card" }, "No tests match.")); return; }
      box.appendChild(h("table", {}, h("thead", {}, h("tr", {}, ["Test", "Category", "Questions", "Minutes", ""].map(function (x) { return h("th", {}, x); }))),
        h("tbody", {}, rows.map(function (t) {
          return h("tr", {}, h("td", {}, h("a", { href: "#test/" + encodeURIComponent(t.id) }, t.title || t.id), t.featured ? h("span", { c: "tag", style: "margin-left:6px" }, "featured") : null), h("td", {}, catName(D.testCategories, t.category)), h("td", {}, String((t.questions || []).length)), h("td", {}, String(t.duration || "")),
            h("td", { c: "act" }, btn("Edit", function () { A.go("#test/" + encodeURIComponent(t.id)); }, "sm"), " ", btn("Duplicate", function () { var c = cl(t); c.id = uniqueId(D.tests, t.id + "-copy"); c.title = (t.title || "") + " (copy)"; D.tests.push(c); touch(); draw(); }, "sm"), " ",
              btn("Delete", function () { if (confirm("Delete the test \"" + t.title + "\" and all its questions?")) { D.tests.splice(D.tests.indexOf(t), 1); touch(); draw(); } }, "sm danger")));
        }))));
    }
    q.oninput = draw; cat.onchange = draw;
    setView([head("Mock tests", D.tests.length + " tests", h("div", { c: "row" }, btn("Auto-generate from PDF or TXT", function () { A.go("#generate"); }), btn("New test", function () { A.go("#test/new"); }, "primary"))), h("div", { c: "row", style: "margin-bottom:12px" }, q, cat), box]);
    draw();
  };
  ROUTES.test = function (p) {
    var t, isNew = p[0] === "new";
    if (isNew) { t = { id: "", title: "", category: (D.testCategories[0] || {}).id || "", difficulty: "Medium", duration: 15, featured: false, description: "", questions: [] }; }
    else t = D.tests.filter(function (x) { return x.id === p[0]; })[0];
    if (!t) { setView(h("div", { c: "note bad" }, "Test not found.")); return; }
    var qbox = h("div", {}), instr = { v: (t.instructions || []) };
    function drawQ() { qbox.innerHTML = ""; if (!t.questions.length) qbox.appendChild(h("div", { c: "card mut" }, "No questions yet. Add one below or paste many at once.")); t.questions.forEach(function (_, i) { qbox.appendChild(qCard(t.questions, i, drawQ)); }); }
    var paste = h("textarea", { rows: 8, placeholder: "Paste questions here in any common format (1. Question  A) ...  Answer: B)" });
    var form = h("div", { c: "card" },
      inp(t, "title", { label: "Test title", on: function (v) { if (isNew && !t._idTouched) { t.id = slug(v); idIn.value = t.id; } } }),
      h("div", { c: "cols" }, (function () { var f = inp(t, "id", { label: "Test id (used in the web address)", hint: "Lowercase letters, numbers and hyphens. Changing it breaks old links." }); idIn = f.querySelector("input"); idIn.addEventListener("input", function () { t._idTouched = true; }); return f; })(),
        sel(t, "category", D.testCategories.map(function (c) { return [c.id, c.name]; }), "Category"), sel(t, "difficulty", ["Easy", "Medium", "Hard"], "Difficulty"), inp(t, "duration", { label: "Time limit (minutes)", type: "number" })),
      inp(t, "description", { label: "Short description", area: true, rows: 2 }), chk(t, "featured", "Show on the home page as a featured test"),
      lines(t, "instructions", { label: "Custom instructions (optional)", hint: "One per line. Leave empty to use the default instructions from Settings.", rows: 4 }));
    var idIn;
    var addBtns = h("div", { c: "row", style: "margin-bottom:14px" }, btn("Add question", function () { t.questions.push({ q: "", o: ["", "", "", ""], a: null, e: "" }); touch(); drawQ(); }),
      btn("Duration from question count", function () { t.duration = Math.max(1, Math.ceil(t.questions.length * 0.75)); touch(); A.redraw(); }, "ghost"));
    var save = btn(isNew ? "Create test" : "Back to all tests", function () {
      if (isNew) { if (!t.title) { toast("Enter a title.", true); return; } t.id = slug(t.id || t.title); if (!t.id) { toast("Enter an id.", true); return; } if (D.tests.some(function (x) { return x.id === t.id; })) { toast("That id is already used.", true); return; } delete t._idTouched; D.tests.push(t); touch(); toast("Test added. Publish to make it live."); }
      A.go("#tests");
    }, "primary");
    setView([head(isNew ? "New test" : "Edit test", isNew ? "Fill in the details, add questions, then create the test." : t.questions.length + " questions", h("div", { c: "row" }, !isNew ? h("a", { c: "btn", href: "test-details.html?id=" + encodeURIComponent(t.id), target: "_blank", rel: "noopener" }, "View on site") : null, !isNew ? btn("Add from PDF or TXT", function () { A.go("#generate/" + encodeURIComponent(t.id)); }) : null, save)), form,
      h("h2", {}, "Questions"), addBtns, qbox,
      h("h2", {}, "Paste many questions"), h("div", { c: "card" }, h("p", { c: "mut", style: "margin-top:0" }, "Paste text and the panel detects the questions, options and answers. For files, use the PDF/TXT generator."), paste,
        h("div", { c: "row" }, btn("Detect and add to this test", function () { var r = SUJAG.parser.parse(paste.value); if (!r.questions.length) { toast("No questions detected.", true); return; } r.questions.forEach(function (x) { t.questions.push({ q: x.q, o: x.o, a: x.a, e: x.e }); }); paste.value = ""; touch(); drawQ(); toast(r.questions.length + " question(s) added. " + (r.stats.missingAnswer ? r.stats.missingAnswer + " need a correct answer." : "")); })))]);
    drawQ();
  };

  /* ---------- generator ---------- */
  ROUTES.generate = function (p) {
    var G0 = { qs: [], text: "", file: "" }, target = p[0] || "new", res = h("div", {}), prog = h("div", { c: "mut" });
    var paste = h("textarea", { rows: 8, placeholder: "...or paste text here", oninput: function () { G0.text = paste.value; } });
    var drop = h("div", { c: "drop" }, h("p", { style: "margin:0 0 8px" }, h("b", {}, "Drop a PDF or TXT file here"), " or choose one"),
      h("input", { type: "file", accept: ".pdf,.txt,.md,.text,application/pdf,text/plain", "aria-label": "Choose a PDF or text file", onchange: function (e) { handle(e.target.files[0]); } }));
    ["dragover", "dragenter"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { handle(e.dataTransfer.files[0]); });
    function handle(f) {
      if (!f) return; G0.file = f.name; prog.textContent = "Reading " + f.name + "...";
      readFileText(f, function (m) { prog.textContent = m; }).then(function (txt) {
        if (txt.replace(/\s/g, "").length < 40) { prog.textContent = ""; toast("No readable text found. Scanned PDFs (pictures of pages) are not supported. Use a text-based PDF or paste the text.", true); return; }
        paste.value = txt; G0.text = txt; prog.textContent = "Text loaded (" + txt.length + " characters). Detecting questions..."; detect();
      }).catch(function (e) { prog.textContent = ""; toast("Could not read the file: " + e.message, true); });
    }
    function detect() {
      var r = SUJAG.parser.parse(G0.text); G0.qs = r.questions.map(function (x) { return x; });
      prog.textContent = ""; draw(r.stats);
    }
    var tSel = h("select", {}, h("option", { value: "new" }, "Create a new test"), D.tests.map(function (t) { return h("option", { value: t.id, selected: t.id === target ? true : null }, "Add to: " + t.title); }));
    tSel.value = target; tSel.onchange = function () { target = tSel.value; draw(); };
    var nt = { title: "", category: (D.testCategories[0] || {}).id || "", difficulty: "Medium", duration: 15 };
    function draw(st) {
      res.innerHTML = ""; if (!G0.qs.length) { if (st) res.appendChild(h("div", { c: "note warn" }, "No questions were detected. Check that each question starts with a number (1. or Q1.) and options with A) B) C) D).")); return; }
      res.appendChild(h("div", { c: "note" + (st && st.missingAnswer ? " warn" : "") }, "Detected " + G0.qs.length + " question(s)" + (st ? ", " + st.withAnswer + " with an answer" + (st.keyFound ? " (answer key found)" : "") : "") + ". Review them below; fix anything marked in red."));
      var box = h("div", {}); function dq() { box.innerHTML = ""; G0.qs.forEach(function (_, i) { box.appendChild(qCard(G0.qs, i, dq)); }); } dq(); res.appendChild(box);
      var tcard = h("div", { c: "card" }, h("h3", {}, "Where should these go?"), fld("Destination", tSel));
      if (target === "new") {
        nt.title = nt.title || (G0.file ? G0.file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ") : "");
        tcard.appendChild(inp(nt, "title", { label: "New test title" })); tcard.appendChild(h("div", { c: "cols" }, sel(nt, "category", D.testCategories.map(function (c) { return [c.id, c.name]; }), "Category"), sel(nt, "difficulty", ["Easy", "Medium", "Hard"], "Difficulty"), inp(nt, "duration", { label: "Minutes", type: "number" })));
      }
      tcard.appendChild(btn("Add " + G0.qs.length + " question(s)", add, "primary")); res.appendChild(tcard);
    }
    function add() {
      var miss = G0.qs.filter(function (q) { return typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length; }).length;
      if (miss) { toast(miss + " question(s) have no correct answer. Select it on each red card.", true); return; }
      var clean = G0.qs.map(function (q) { return { q: q.q.trim(), o: q.o.map(function (x) { return x.trim(); }), a: q.a, e: (q.e || "").trim() }; });
      if (target === "new") {
        if (!nt.title.trim()) { toast("Give the new test a title.", true); return; }
        var t = { id: uniqueId(D.tests, slug(nt.title)), title: nt.title.trim(), category: nt.category, difficulty: nt.difficulty, duration: nt.duration || Math.max(1, Math.ceil(clean.length * 0.75)), featured: false, description: "Practice test with " + clean.length + " questions.", questions: clean };
        D.tests.push(t); touch(); toast("Test created with " + clean.length + " questions."); A.go("#test/" + encodeURIComponent(t.id));
      } else {
        var t2 = D.tests.filter(function (x) { return x.id === target; })[0], have = {}, added = 0; t2.questions.forEach(function (q) { have[q.q.toLowerCase()] = 1; });
        clean.forEach(function (q) { if (!have[q.q.toLowerCase()]) { t2.questions.push(q); added++; } });
        touch(); toast(added + " added, " + (clean.length - added) + " skipped as duplicates."); A.go("#test/" + encodeURIComponent(t2.id));
      }
    }
    setView([head("Make a test from PDF or TXT", "The panel reads the text, finds questions, options, answers and explanations, and lets you check them before saving."),
      h("div", { c: "card" }, drop, h("div", { style: "margin-top:12px" }, paste), prog, h("div", { c: "row", style: "margin-top:8px" }, btn("Detect questions", detect, "primary"), btn("Download a sample TXT", function () { save(new Blob([SAMPLE], { type: "text/plain" }), "sample-questions.txt"); }))),
      h("details", { c: "card" }, h("summary", {}, "Formats the detector understands"), h("pre", { c: "mono", style: "white-space:pre-wrap" }, SAMPLE), h("p", { c: "mut" }, "Scanned PDFs (photos of pages) have no text to read and are not supported. PDF reading loads a library from cdnjs.cloudflare.com, so it needs an internet connection.")), res]);
  };
  var SAMPLE = "1. Which city is the capital of Sindh?\nA) Hyderabad\nB) Karachi\nC) Sukkur\nD) Larkana\nAnswer: B\nExplanation: Karachi is the provincial capital.\n\nQ2. The Indus River falls into which sea?\n(a) Red Sea (b) Arabian Sea (c) Caspian Sea (d) Black Sea\nAns: b\n\n3. Largest planet in the solar system is\nA. Mars\nB. Earth\nC. Jupiter*\nD. Venus\n\nAnswers\n1-B 2-B 3-C";

  /* ---------- categories ---------- */
  function catView(key, title, withDesc) {
    return function () {
      var list = D[key], box = h("div", {});
      var usedBy = function (id) { return (key === "testCategories" ? D.tests : D.notes).filter(function (x) { return x.category === id; }).length; };
      function draw() {
        box.innerHTML = ""; list.forEach(function (c, i) {
          box.appendChild(h("div", { c: "card" }, h("div", { c: "cols" }, inp(c, "name", { label: "Name" }), inp(c, "id", { label: "Id", hint: usedBy(c.id) + " item(s) use this" }), inp(c, "icon", { label: "Icon", list: "iconlist" })), withDesc ? inp(c, "description", { label: "Description", area: true, rows: 2 }) : null,
            h("div", { c: "row" }, rowBtnsC(i))));
        });
      }
      function rowBtnsC(i) { var c = list[i]; return h("span", { c: "row", style: "gap:4px" }, btn("Up", function () { move(list, i, -1); draw(); }, "sm"), btn("Down", function () { move(list, i, 1); draw(); }, "sm"), btn("Delete", function () { if (usedBy(c.id)) { toast("Move or delete the " + usedBy(c.id) + " item(s) using this category first.", true); return; } if (confirm("Delete this category?")) { list.splice(i, 1); touch(); draw(); } }, "sm danger")); }
      var dl = h("datalist", { id: "iconlist" }, C.icons.map(function (i) { return h("option", { value: i }); }));
      var nodes = [head(title, "Categories appear in menus and filters on the public site.", btn("Add category", function () { list.push({ id: "", name: "", icon: "book-open", description: "" }); touch(); draw(); }, "primary")), dl, box];
      if (key === "testCategories") {
        var gbox = h("div", {});
        var gd = function () { gbox.innerHTML = ""; D.testGroups.forEach(function (g, i) { var inc = { v: (g.includes || []).join(", ") }; gbox.appendChild(h("div", { c: "card" }, h("div", { c: "cols" }, inp(g, "name", { label: "Group name" }), inp(g, "id", { label: "Id" }), inp(g, "icon", { label: "Icon", list: "iconlist" })), inp(g, "description", { label: "Description", area: true, rows: 2 }), fld("Includes these category ids (comma separated)", h("input", { type: "text", value: inc.v, oninput: function (e) { g.includes = e.target.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean); touch(); } }), "Available: " + D.testCategories.map(function (c) { return c.id; }).join(", ")), rowBtns(D.testGroups, i, gd))); }); };
        nodes.push(h("h2", {}, "Groups"), h("p", { c: "mut" }, "A group combines several categories into one card on the home page."), btn("Add group", function () { D.testGroups.push({ id: "", name: "", icon: "briefcase", includes: [], description: "" }); touch(); gd(); }), gbox); gd();
      }
      setView(nodes); draw();
    };
  }
  ROUTES.testcats = catView("testCategories", "Test categories", true);
  ROUTES.notecats = catView("noteCategories", "Note categories", false);

  /* ---------- notes ---------- */
  ROUTES.notes = function () {
    var box = h("div", { c: "tw" });
    function draw() {
      box.innerHTML = ""; if (!D.notes.length) { box.appendChild(h("div", { c: "card" }, "No notes yet.")); return; }
      box.appendChild(h("table", {}, h("thead", {}, h("tr", {}, ["Note", "Category", "PDF", "Date", ""].map(function (x) { return h("th", {}, x); }))), h("tbody", {}, D.notes.map(function (n) {
        return h("tr", {}, h("td", {}, h("a", { href: "#note/" + encodeURIComponent(n.id) }, n.title || n.id)), h("td", {}, catName(D.noteCategories, n.category)), h("td", {}, n.pdf ? h("span", { c: "tag" }, "yes") : h("span", { c: "tag warn" }, "none")), h("td", {}, n.date || ""),
          h("td", { c: "act" }, btn("Edit", function () { A.go("#note/" + encodeURIComponent(n.id)); }, "sm"), " ", btn("Delete", function () { if (confirm("Delete this note?")) { D.notes.splice(D.notes.indexOf(n), 1); touch(); draw(); } }, "sm danger")));
      }))));
    }
    setView([head("Study notes", D.notes.length + " notes", btn("New note", function () { A.go("#note/new"); }, "primary")), box]); draw();
  };
  ROUTES.note = function (p) {
    var isNew = p[0] === "new", n = isNew ? { id: "", title: "", category: (D.noteCategories[0] || {}).id || "", date: today(), featured: false, description: "", pdf: "", size: "", pages: "", intro: "", sections: [] } : D.notes.filter(function (x) { return x.id === p[0]; })[0];
    if (!n) { setView(h("div", { c: "note bad" }, "Note not found.")); return; }
    n.sections = n.sections || []; var pdfInfo = h("span", { c: "mut" }), sbox = h("div", {}), idIn;
    function info() { pdfInfo.textContent = n.pdf ? n.pdf + (PEND[n.pdf] ? " (will upload when you publish)" : "") : "No PDF attached"; }
    function drawS() { sbox.innerHTML = ""; n.sections.forEach(function (s, i) { s.points = s.points || []; sbox.appendChild(h("div", { c: "card" }, inp(s, "heading", { label: "Section heading" }), lines(s, "points", { label: "Points (one per line)", rows: 5 }), rowBtns(n.sections, i, drawS))); }); }
    var imp = h("textarea", { rows: 6, placeholder: "## Heading\nFirst point\nSecond point\n\n## Next heading\n..." });
    var f = h("div", { c: "card" }, inp(n, "title", { label: "Title", on: function (v) { if (isNew && !n._t) { n.id = slug(v); idIn.value = n.id; } } }),
      h("div", { c: "cols" }, (function () { var x = inp(n, "id", { label: "Id (web address)" }); idIn = x.querySelector("input"); idIn.addEventListener("input", function () { n._t = 1; }); return x; })(), sel(n, "category", D.noteCategories.map(function (c) { return [c.id, c.name]; }), "Category"), inp(n, "date", { label: "Date", type: "date" })),
      inp(n, "description", { label: "Short description", area: true, rows: 2 }), inp(n, "intro", { label: "Introduction on the detail page", area: true, rows: 3 }), chk(n, "featured", "Featured on the home page"));
    var pdfCard = h("div", { c: "card" }, h("h3", {}, "PDF file"), pdfInfo, h("div", { c: "row", style: "margin-top:8px" }, btn("Upload PDF", function () { pickUpload("pdf", function (path, file) { n.pdf = path; n.size = fmtSize(file.size); touch(); info(); }); }, "primary"), btn("Remove PDF", function () { n.pdf = ""; n.size = ""; n.pages = ""; touch(); info(); })),
      h("div", { c: "cols", style: "margin-top:10px" }, inp(n, "pdf", { label: "PDF path (advanced)", on: info }), inp(n, "size", { label: "Size label" }), inp(n, "pages", { label: "Pages", type: "number" })));
    var impCard = h("div", { c: "card" }, h("h3", {}, "Create readable sections from a file or text"), h("p", { c: "mut", style: "margin-top:0" }, "Choose a PDF or TXT file, or paste text. Lines starting with ## become section headings; every other line becomes a point."),
      h("input", { type: "file", accept: ".pdf,.txt,.md", "aria-label": "Choose a PDF or text file", onchange: function (e) { var fl = e.target.files[0]; if (!fl) return; readFileText(fl).then(function (t) { imp.value = /^##\s/m.test(t) ? t : "## " + (n.title || "Notes") + "\n" + t; toast("Text loaded. Review it, then press Add sections."); }).catch(function (er) { toast(er.message, true); }); } }), h("div", { style: "margin-top:8px" }, imp),
      btn("Add sections", function () { var cur = null; imp.value.split(/\r?\n/).forEach(function (l) { l = l.trim(); if (!l) return; var m = /^##\s+(.*)$/.exec(l); if (m) { cur = { heading: m[1], points: [] }; n.sections.push(cur); } else { if (!cur) { cur = { heading: "Notes", points: [] }; n.sections.push(cur); } cur.points.push(l); } }); imp.value = ""; touch(); drawS(); }));
    setView([head(isNew ? "New note" : "Edit note", null, h("div", { c: "row" }, !isNew ? h("a", { c: "btn", href: "note-details.html?id=" + encodeURIComponent(n.id), target: "_blank", rel: "noopener" }, "View on site") : null, btn(isNew ? "Create note" : "Back to notes", function () {
      if (isNew) { if (!n.title) { toast("Enter a title.", true); return; } n.id = slug(n.id || n.title); if (D.notes.some(function (x) { return x.id === n.id; })) { toast("That id is already used.", true); return; } delete n._t; D.notes.unshift(n); touch(); toast("Note added."); } A.go("#notes");
    }, "primary"))), f, pdfCard, h("h2", {}, "Sections"), btn("Add section", function () { n.sections.push({ heading: "", points: [] }); touch(); drawS(); }), sbox, impCard]);
    info(); drawS();
  };

  /* ---------- books ---------- */
  ROUTES.books = function () {
    var box = h("div", { c: "tw" });
    function draw() {
      box.innerHTML = ""; if (!D.books.length) { box.appendChild(h("div", { c: "card" }, "No books yet.")); return; }
      box.appendChild(h("table", {}, h("thead", {}, h("tr", {}, ["Book", "Category", "Price", ""].map(function (x) { return h("th", {}, x); }))), h("tbody", {}, D.books.map(function (b) {
        return h("tr", {}, h("td", {}, h("a", { href: "#book/" + encodeURIComponent(b.id) }, b.title || b.id)), h("td", {}, b.category || ""), h("td", {}, b.price ? (D.site.currency || "Rs.") + " " + b.price : "-"),
          h("td", { c: "act" }, btn("Edit", function () { A.go("#book/" + encodeURIComponent(b.id)); }, "sm"), " ", btn("Delete", function () { if (confirm("Delete this book?")) { D.books.splice(D.books.indexOf(b), 1); touch(); draw(); } }, "sm danger")));
      }))));
    }
    setView([head("Books", D.books.length + " books", btn("New book", function () { A.go("#book/new"); }, "primary")), box]); draw();
  };
  ROUTES.book = function (p) {
    var isNew = p[0] === "new", b = isNew ? { id: "", title: "", author: "", category: "", price: 0, featured: false, cover: "", description: "", longDescription: "", contents: [], pages: "", language: "English", format: "Paperback" } : D.books.filter(function (x) { return x.id === p[0]; })[0];
    if (!b) { setView(h("div", { c: "note bad" }, "Book not found.")); return; }
    var img = h("img", { c: "cover", alt: "Cover preview" }), idIn;
    function pv() { img.src = b.cover ? pendingSrc(b.cover) : ""; img.style.visibility = b.cover ? "visible" : "hidden"; }
    var cats = Object.keys(D.books.reduce(function (m, x) { if (x.category) m[x.category] = 1; return m; }, {}));
    setView([head(isNew ? "New book" : "Edit book", "Prices are in " + (D.site.currency || "Rs.") + ". Orders go through the contact method in Settings; no payment is taken on the site.", h("div", { c: "row" }, !isNew ? h("a", { c: "btn", href: "book-details.html?id=" + encodeURIComponent(b.id), target: "_blank", rel: "noopener" }, "View on site") : null, btn(isNew ? "Create book" : "Back to books", function () {
      if (isNew) { if (!b.title) { toast("Enter a title.", true); return; } b.id = slug(b.id || b.title); if (D.books.some(function (x) { return x.id === b.id; })) { toast("That id is already used.", true); return; } delete b._t; D.books.push(b); touch(); toast("Book added."); } A.go("#books");
    }, "primary"))),
      h("div", { c: "card" }, inp(b, "title", { label: "Title", on: function (v) { if (isNew && !b._t) { b.id = slug(v); idIn.value = b.id; } } }),
        h("div", { c: "cols" }, (function () { var x = inp(b, "id", { label: "Id (web address)" }); idIn = x.querySelector("input"); idIn.addEventListener("input", function () { b._t = 1; }); return x; })(), inp(b, "author", { label: "Author" }), inp(b, "category", { label: "Category", list: "bookcats" }), inp(b, "price", { label: "Price", type: "number", hint: "0 shows the price as not decided." })),
        h("datalist", { id: "bookcats" }, cats.map(function (c) { return h("option", { value: c }); })),
        inp(b, "description", { label: "Short description", area: true, rows: 2 }), inp(b, "longDescription", { label: "Full description", area: true, rows: 5 }), lines(b, "contents", { label: "What is inside (one per line)", rows: 5 }),
        h("div", { c: "cols" }, inp(b, "pages", { label: "Pages", type: "number" }), inp(b, "language", { label: "Language" }), inp(b, "format", { label: "Format" })), chk(b, "featured", "Featured on the home page")),
      h("div", { c: "card" }, h("h3", {}, "Cover image"), h("div", { c: "row" }, img, h("div", {}, btn("Upload cover", function () { pickUpload("cover", function (path) { b.cover = path; touch(); pv(); }); }, "primary"), h("p", { c: "mut", style: "font-size:13px" }, "Portrait 3:4 looks best. Photos are shrunk to 600 x 800 automatically."))), inp(b, "cover", { label: "Cover path (advanced)", on: pv }))]);
    pv();
  };

  /* ---------- latest updates ---------- */
  ROUTES.updates = function () {
    var box = h("div", {});
    function draw() {
      box.innerHTML = ""; if (!D.updates.length) box.appendChild(h("div", { c: "card" }, "No updates yet."));
      D.updates.forEach(function (u, i) {
        var pick = u.type === "info" ? h("div", { c: "cols" }, inp(u, "text", { label: "Message" }), inp(u, "href", { label: "Link (page.html or https://...)" })) :
          sel(u, "id", (u.type === "test" ? D.tests : u.type === "note" ? D.notes : D.books).map(function (x) { return [x.id, x.title]; }), "Item", "The title and link come from the item itself.");
        box.appendChild(h("div", { c: "card" }, h("div", { c: "cols" }, inp(u, "date", { label: "Date", type: "date" }), (function () { var s = sel(u, "type", [["test", "Mock test"], ["note", "Note"], ["book", "Book"], ["info", "Message"]], "Type"); s.querySelector("select").addEventListener("change", function () { var t = u.type; delete u.text; delete u.href; delete u.id; if (t === "info") { u.text = ""; u.href = ""; } else { u.id = ((t === "test" ? D.tests : t === "note" ? D.notes : D.books)[0] || {}).id || ""; } draw(); }); return s; })()), pick, rowBtns(D.updates, i, draw)));
      });
    }
    setView([head("Latest updates", "These scroll in the Latest Updates card on the home page. Newest dates show first.", btn("Add update", function () { D.updates.unshift({ date: today(), type: "info", text: "", href: "" }); touch(); draw(); }, "primary")), box]); draw();
  };

  /* ---------- page text ---------- */
  ROUTES.pages = function () {
    var P = D.pages; P.home = P.home || {}; P.about = P.about || {}; P.privacy = P.privacy || {}; P.terms = P.terms || {}; P.faq = P.faq || []; P.home.why = P.home.why || [];
    function mk(o, k, label, rows) { var pv = h("div", { c: "preview" }); var f = inp(o, k, { label: label, area: true, rows: rows || 12, hint: "Markup: ## Heading, ### Subheading, - list item, blank line for a new paragraph, [text](page.html), **bold**.", on: function (v) { pv.innerHTML = SUJAG.pages.markup(v); } }); pv.innerHTML = SUJAG.pages.markup(o[k] || ""); return h("div", {}, f, h("small", { c: "mut" }, "Preview"), pv); }
    var why = h("div", {}), faq = h("div", {});
    function dw() { why.innerHTML = ""; P.home.why.forEach(function (w, i) { why.appendChild(h("div", { c: "card" }, inp(w, "title", { label: "Title" }), inp(w, "text", { label: "Text", area: true, rows: 2 }), rowBtns(P.home.why, i, dw))); }); }
    function df() { faq.innerHTML = ""; P.faq.forEach(function (q, i) { faq.appendChild(h("div", { c: "card" }, inp(q, "q", { label: "Question" }), inp(q, "a", { label: "Answer", area: true, rows: 3 }), rowBtns(P.faq, i, df))); }); }
    function sec(title, nodes, open) { return h("details", { c: "card", open: open ? true : null }, h("summary", { style: "font-weight:600;cursor:pointer" }, title), h("div", { style: "margin-top:12px" }, nodes)); }
    setView([head("Page text and FAQ", "Edit the wording of the home, about, FAQ, privacy and terms pages."),
      sec("Home page", [inp(P.home, "heroEyebrow", { label: "Small line above the heading" }), h("div", { c: "cols" }, inp(P.home, "heroTitle", { label: "Heading" }), inp(P.home, "heroAccent", { label: "Heading (green part)" })), inp(P.home, "heroLead", { label: "Intro text", area: true, rows: 2 }), inp(P.home, "whyEyebrow", { label: "Why section: small line" }), inp(P.home, "whyHeading", { label: "Why section: heading" }), h("h3", {}, "Why cards"), why, btn("Add card", function () { P.home.why.push({ title: "", text: "" }); touch(); dw(); })], true),
      sec("About page", [inp(P.about, "lead", { label: "Intro", area: true, rows: 3 }), mk(P.about, "body", "Body")]),
      sec("FAQ", [btn("Add question", function () { P.faq.push({ q: "", a: "" }); touch(); df(); }), faq]),
      sec("Privacy policy", [inp(P.privacy, "updated", { label: "Date line" }), mk(P.privacy, "body", "Body", 16)]),
      sec("Terms of use", [inp(P.terms, "updated", { label: "Date line" }), mk(P.terms, "body", "Body", 16)]),
      h("p", { c: "mut" }, "The text is shown on the public pages when they load. The pages also keep a built-in copy for search engines.")]);
    dw(); df();
  };

  /* ---------- settings ---------- */
  ROUTES.settings = function () {
    var S = D.site, soc = S.social, status = h("div", {});
    var gh1 = { owner: G.owner, repo: G.repo, branch: G.branch, token: G.token, remember: G.remember };
    var logo = h("img", { src: pendingSrc(S.logo || ""), alt: "Logo", height: 48, style: "height:48px;width:auto" });
    var tok = h("input", { type: "password", value: gh1.token, autocomplete: "off", placeholder: "github_pat_...", oninput: function () { gh1.token = tok.value.trim(); } });
    function conn() {
      Object.assign(G, gh1); saveG(); status.className = "note"; status.textContent = "Checking...";
      gh("GET", "/repos/" + G.owner + "/" + G.repo).then(function (r) { status.className = r.permissions && r.permissions.push ? "note" : "note warn"; status.textContent = r.permissions && r.permissions.push ? "Connected. This token can write to " + r.full_name + (r.private ? " (private repository)." : " (public repository).") : "Connected, but this token cannot write. It needs Contents: Read and write."; refreshBar(); })
        .catch(function (e) { status.className = "note bad"; status.textContent = friendly(e); });
    }
    setView([head("Settings and GitHub"),
      h("div", { c: "card" }, h("h3", {}, "Connect GitHub (needed to publish)"),
        h("ol", { c: "steps", style: "padding-left:20px" }, h("li", {}, "On GitHub open Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token."), h("li", {}, "Choose only this repository, and set Repository permissions, Contents: Read and write."), h("li", {}, "Copy the token and paste it below. It is never put in the website files.")),
        h("div", { c: "cols" }, inp(gh1, "owner", { label: "GitHub username or organization" }), inp(gh1, "repo", { label: "Repository name" }), inp(gh1, "branch", { label: "Branch" })), fld("Token", tok, "Kept only in this browser tab unless you tick the box below."),
        h("label", { c: "chk" }, h("input", { type: "checkbox", checked: gh1.remember, onchange: function (e) { gh1.remember = e.target.checked; } }), "Remember the token on this device (do not tick on a shared computer)"),
        h("div", { c: "row" }, btn("Save and test connection", conn, "primary"), btn("Forget token", function () { G.token = ""; gh1.token = ""; tok.value = ""; saveG(); refreshBar(); toast("Token removed from this browser."); })), status,
        h("div", { c: "note warn", style: "margin-top:12px" }, "This admin page is a normal public web page. Anyone can open it, but nobody can publish without your GitHub token, because GitHub checks it, not this page. Never share the token. Do not add private information anywhere on the public site.")),
      h("div", { c: "card" }, h("h3", {}, "Website details"), inp(S, "name", { label: "Site name" }), inp(S, "tagline", { label: "Tagline" }), inp(S, "description", { label: "Description (search engines)", area: true, rows: 2 }), inp(S, "url", { label: "Website address", hint: "Used for sharing links. The canonical tags in the HTML pages are set at build time; see the README." }),
        h("div", { c: "cols" }, inp(S, "email", { label: "Public email" }), inp(S, "whatsapp", { label: "WhatsApp number", hint: "Digits only with country code, e.g. 923001234567" }), inp(S, "currency", { label: "Currency label" })),
        h("div", { c: "cols" }, inp(soc, "facebook", { label: "Facebook link" }), inp(soc, "instagram", { label: "Instagram link" }), inp(soc, "youtube", { label: "YouTube link" })),
        inp(S, "contactEndpoint", { label: "Contact form endpoint (optional)", hint: "A Formspree-style URL. Empty keeps the form in not-connected mode." }), chk(S, "demoMode", "Show sample-content notices (turn off when you have your own real books)")),
      h("div", { c: "card" }, h("h3", {}, "Logo"), h("div", { c: "row" }, logo, btn("Upload new logo", function () { pickUpload("logo", function (path) { S.logo = path; logo.src = pendingSrc(path); touch(); }); })), h("small", { c: "mut" }, "The logo is shrunk to fit 256 pixels. Favicons are not changed.")),
      h("div", { c: "card" }, h("h3", {}, "Default test instructions"), lines(D, "defaultInstructions", { label: "One per line", rows: 8, hint: "Shown on every test that has no custom instructions." })), A.auth ? A.auth.changeCard() : null]);
  };

  /* ---------- boot ---------- */
  function boot() {
    loadAll().then(function () {
    try { var d = JSON.parse(localStorage.getItem("sujag:admin:draft") || "null"); if (d && d.D && JSON.stringify(d.D) !== JSON.stringify(D) && confirm("You have unpublished edits saved in this browser from " + new Date(d.t).toLocaleString() + ". Restore them?")) { Object.keys(d.D).forEach(function (k) { D[k] = d.D[k]; }); } else if (d) localStorage.removeItem("sujag:admin:draft"); } catch (e) {}
    refreshBar(); route();
  }).catch(function (e) { setView(h("div", { c: "note bad" }, "Could not load the data files: " + e.message + ". Open the admin page from the same folder as the website.")); });
    if (A.members && A.members.load) A.members.load();
  }

  A.start = function () {
    buildNav(); loadG();
    document.getElementById("pubBtn").addEventListener("click", publish);
    document.getElementById("outBtn").addEventListener("click", function () { A.logout(); });
    document.getElementById("dlBtn").addEventListener("click", download);
    var mb = document.getElementById("menuBtn"); mb.addEventListener("click", function () { var o = document.getElementById("side").classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
    window.addEventListener("hashchange", route);
    window.addEventListener("beforeunload", function (e) { if (dirtyFiles().length || Object.keys(PEND).length) { e.preventDefault(); e.returnValue = ""; } });
    (A.gate || function (d) { d(); })(boot);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(A.start, 0); }); else setTimeout(A.start, 0);
})();
