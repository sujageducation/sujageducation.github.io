/* ==========================================================================
   SUJAG Education - main.js
   Shared helpers used by every page: icons, small utilities, the site header
   and footer, the search overlay, dialogs, toasts and accordions.
   Change the navigation or footer in ONE place (NAV and renderFooter below).
   ========================================================================== */
(function () {
  "use strict";
  var S = (window.SUJAG = window.SUJAG || {});
  var site = S.site || { name: "SUJAG Education", logo: "logo.svg", social: {} };

  /* ---------- Icons (24x24, stroke based) ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    "bar-chart": '<path d="M12 20V10M18 20V4M6 20v-4"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    "graduation-cap": '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    flask: '<path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2M8.5 2h7M7 16h10"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "check-circle": '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3"/>',
    "x-circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2zM17.5 6.5h.01"/>',
    youtube: '<path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    play: '<path d="m6 3 14 9-14 9z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "shopping-bag": '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2 3 7v2h18V7z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    "external-link": '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>'
  };

  function icon(name, size, extra) {
    var s = size || 20;
    return '<svg class="icon' + (extra ? " " + extra : "") + '" width="' + s + '" height="' + s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || ICONS.info) + "</svg>";
  }

  /* ---------- Utilities ---------- */
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function area(a) { return a === "session" ? window.sessionStorage : window.localStorage; }
  var store = {
    get: function (k, d, a) { try { var v = area(a).getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v, a) { try { area(a).setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    remove: function (k, a) { try { area(a).removeItem(k); } catch (e) { /* storage unavailable */ } }
  };
  function qs(name) { return new URLSearchParams(window.location.search).get(name); }
  function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 150); }; }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function fmtDate(iso, withTime) {
    var d = new Date(iso && iso.length <= 10 ? iso + "T00:00:00" : iso);
    if (isNaN(d)) return "";
    var o = { day: "numeric", month: "short", year: "numeric" };
    if (withTime) { o.hour = "numeric"; o.minute = "2-digit"; }
    return d.toLocaleDateString("en-GB", o);
  }
  function fmtDuration(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + " min" + (s ? " " + s + " sec" : "");
  }
  function pageFile() {
    var f = window.location.pathname.split("/").pop();
    return f || "index.html";
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  function setTag(sel, attr, value) { var el = $(sel); if (el && value) el.setAttribute(attr, value); }
  function setMeta(o) {
    if (o.title) {
      var full = o.title + " | " + site.name;
      document.title = full;
      setTag('meta[property="og:title"]', "content", full);
    }
    if (o.description) {
      setTag('meta[name="description"]', "content", o.description);
      setTag('meta[property="og:description"]', "content", o.description);
    }
    var url = (site.url || "") + "/" + pageFile() + window.location.search;
    setTag('link[rel="canonical"]', "href", url);
    setTag('meta[property="og:url"]', "content", url);
  }

  S.util = { esc: esc, store: store, qs: qs, debounce: debounce, plural: plural, fmtDate: fmtDate, fmtDuration: fmtDuration, pageFile: pageFile, $: $, $$: $$, ready: ready };
  S.icon = icon;
  S.setMeta = setMeta;

  /* ---------- Dialogs and toasts ---------- */
  var openModals = [];
  function modal(opts) {
    return new Promise(function (resolve) {
      var prev = document.activeElement;
      var uid = "m" + Math.random().toString(36).slice(2, 8);
      var back = document.createElement("div");
      back.className = "modal-backdrop";
      back.innerHTML =
        '<div class="modal' + (opts.wide ? " modal-wide" : "") + '" role="' + (opts.role || "dialog") + '" aria-modal="true" aria-labelledby="' + uid + 't" aria-describedby="' + uid + 'd">' +
        '<h2 id="' + uid + 't">' + esc(opts.title) + "</h2>" +
        '<div id="' + uid + 'd">' + (opts.html || "<p>" + esc(opts.message || "") + "</p>") + "</div>" +
        ((opts.actions && opts.actions.length) ? '<div class="modal-actions"></div>' : "") + "</div>";
      var box = back.firstChild;
      var done = false;
      var handle = {
        el: box,
        close: function (value) {
          if (done) return; done = true;
          openModals = openModals.filter(function (m) { return m !== handle; });
          back.classList.remove("is-visible");
          document.removeEventListener("keydown", onKey, true);
          setTimeout(function () { back.remove(); if (!openModals.length) document.documentElement.style.overflow = ""; }, 200);
          if (prev && prev.focus && document.contains(prev)) { try { prev.focus(); } catch (e) { /* ignore */ } }
          resolve(value);
        }
      };
      var actionsEl = box.querySelector(".modal-actions");
      (opts.actions || []).forEach(function (a) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn " + (a.variant || "btn-ghost");
        b.textContent = a.label;
        b.addEventListener("click", function () { handle.close(a.value); });
        actionsEl.appendChild(b);
      });
      function focusables() {
        return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
          .filter(function (n) { return n.offsetParent !== null; });
      }
      function onKey(e) {
        if (openModals[openModals.length - 1] !== handle) return;
        if (e.key === "Escape" && opts.dismissible !== false) { e.stopPropagation(); handle.close(opts.dismissValue); return; }
        if (e.key === "Tab") {
          var f = focusables();
          if (!f.length) { e.preventDefault(); return; }
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
          else if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        }
      }
      back.addEventListener("mousedown", function (e) { if (e.target === back && opts.dismissible !== false) handle.close(opts.dismissValue); });
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(back);
      document.documentElement.style.overflow = "hidden";
      openModals.push(handle);
      requestAnimationFrame(function () {
        back.classList.add("is-visible");
        var target = (opts.focus && box.querySelector(opts.focus)) || focusables().filter(function (n) { return !n.classList.contains("btn-ghost"); })[0] || focusables()[0] || box;
        if (target === box) box.setAttribute("tabindex", "-1");
        target.focus();
      });
      if (opts.onOpen) opts.onOpen(handle);
    });
  }
  function confirmDialog(o) {
    return modal({
      title: o.title, message: o.message, html: o.html, dismissValue: false,
      actions: [
        { label: o.cancelText || "Cancel", value: false, variant: "btn-ghost" },
        { label: o.confirmText || "Confirm", value: true, variant: o.danger ? "btn-danger" : "btn-primary" }
      ]
    });
  }
  function alertDialog(o) {
    return modal({ title: o.title, message: o.message, html: o.html, wide: o.wide, actions: [{ label: o.okText || "OK", value: true, variant: "btn-primary" }] });
  }
  function closeAll() { openModals.slice().forEach(function (m) { m.close(false); }); }
  var toastRegion;
  function toast(message, type) {
    if (!toastRegion) {
      toastRegion = document.createElement("div");
      toastRegion.className = "toast-region";
      toastRegion.setAttribute("role", "status");
      toastRegion.setAttribute("aria-live", "polite");
      document.body.appendChild(toastRegion);
    }
    var t = document.createElement("div");
    t.className = "toast" + (type === "error" ? " is-error" : "");
    t.innerHTML = icon(type === "error" ? "alert" : "check-circle", 18) + "<span>" + esc(message) + "</span>";
    toastRegion.appendChild(t);
    setTimeout(function () { t.classList.add("is-leaving"); setTimeout(function () { t.remove(); }, 220); }, 3200);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }
  S.ui = { modal: modal, confirm: confirmDialog, alert: alertDialog, closeAll: closeAll, toast: toast, copy: copyText };

  /* ---------- Header and footer ---------- */
  var NAV = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "mock-tests.html", label: "Mock Tests", key: "tests" },
    { href: "notes.html", label: "Notes", key: "notes" },
    { href: "books.html", label: "Books", key: "books" },
    { href: "about.html", label: "About", key: "about" },
    { href: "contact.html", label: "Contact", key: "contact" }
  ];
  var SECTION = {
    "index.html": "home", "mock-tests.html": "tests", "test-category.html": "tests", "test-details.html": "tests",
    "take-test.html": "tests", "test-result.html": "tests", "notes.html": "notes", "note-details.html": "notes",
    "books.html": "books", "book-details.html": "books", "about.html": "about", "contact.html": "contact"
  };

  function brandHtml(cls) {
    return '<a class="brand' + (cls ? " " + cls : "") + '" href="index.html" aria-label="' + esc(site.name) + ' home">' +
      '<img src="' + esc(site.logo) + '" alt="" width="36" height="36">' +
      '<span class="brand-name">SUJAG<span>Education</span></span></a>';
  }

  function renderHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    var current = SECTION[pageFile()];
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.key === current ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
    }).join("");
    var mobile = NAV.map(function (n) {
      return '<li><a href="' + n.href + '"' + (n.key === current ? ' aria-current="page"' : "") + ">" + n.label + icon("chevron-right", 18) + "</a></li>";
    }).join("");
    host.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="container"><div class="header-inner">' + brandHtml() +
      '<nav class="nav" aria-label="Main">' + links + "</nav>" +
      '<div class="header-actions">' +
      '<button type="button" class="icon-btn" id="open-search" aria-label="Search" aria-haspopup="dialog">' + icon("search", 20) + "</button>" +
      '<button type="button" class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">' + icon("menu", 22) + "</button>" +
      "</div></div></div>" +
      '<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile"><div><div class="container"><ul>' + mobile + "</ul></div></div></nav></header>";

    var btn = document.getElementById("menu-btn"), panel = document.getElementById("mobile-nav");
    function setMenu(open) {
      panel.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      btn.innerHTML = icon(open ? "x" : "menu", 22);
    }
    btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); } });
    window.addEventListener("resize", debounce(function () { if (window.innerWidth > 860) setMenu(false); }, 100));
    $$("a", panel).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.getElementById("open-search").addEventListener("click", openSearch);
  }

  function socialHtml() {
    var items = [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"]];
    return items.map(function (it) {
      var url = (site.social || {})[it[0]];
      return url
        ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + it[1] + '">' + icon(it[0], 20) + "</a>"
        : '<span role="img" aria-label="' + it[1] + ' (link not added yet)" title="' + it[1] + ' link not added yet">' + icon(it[0], 20) + "</span>";
    }).join("");
  }

  function renderFooter() {
    var host = document.getElementById("site-footer");
    if (!host) return;
    host.innerHTML =
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      "<div>" + brandHtml() + "<p>" + esc(site.description || "") + '</p><div class="social">' + socialHtml() + "</div></div>" +
      '<div><h4>Learn</h4><ul><li><a href="mock-tests.html">Mock Tests</a></li><li><a href="notes.html">Notes</a></li><li><a href="books.html">Books</a></li><li><a href="search.html">Search</a></li></ul></div>' +
      '<div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li><li><a href="faq.html">FAQ</a></li></ul></div>' +
      '<div><h4>Legal</h4><ul><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="terms.html">Terms</a></li></ul></div>' +
      "</div>" +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + " " + esc(site.name) + '. All rights reserved.</span>' +
      "<span>An independent platform. Not affiliated with any government body or testing service.</span></div></div></footer>";
  }

  /* ---------- Search overlay ---------- */
  function openSearch() {
    if (document.getElementById("search-overlay")) return;
    var prev = document.activeElement;
    var o = document.createElement("div");
    o.className = "overlay";
    o.id = "search-overlay";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-modal", "true");
    o.setAttribute("aria-label", "Search " + site.name);
    var popular = ["SPSC", "English grammar", "Pakistan Studies", "Mathematics", "Computer", "Books"];
    o.innerHTML =
      '<div class="search-panel"><form role="search" action="search.html" method="get">' +
      '<div class="search-field">' + icon("search", 20) + '<input type="search" name="q" placeholder="Search tests, notes, books and categories" aria-label="Search" autocomplete="off" maxlength="80"></div></form>' +
      '<p class="hint">Popular searches</p><div class="chip-row">' +
      popular.map(function (p) { return '<a class="chip" href="search.html?q=' + encodeURIComponent(p) + '">' + esc(p) + "</a>"; }).join("") +
      '</div><div class="modal-actions"><button type="button" class="btn btn-ghost btn-sm" data-close>Close</button></div></div>';
    document.body.appendChild(o);
    document.documentElement.style.overflow = "hidden";
    o.querySelector("input").focus();
    requestAnimationFrame(function () { o.classList.add("is-visible"); });
    function close() {
      document.removeEventListener("keydown", onKey, true);
      o.classList.remove("is-visible");
      document.documentElement.style.overflow = "";
      setTimeout(function () { o.remove(); }, 200);
      if (prev && prev.focus) prev.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { e.stopPropagation(); close(); return; }
      if (e.key === "Tab") {
        var f = $$("input, a, button", o);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey, true);
    o.addEventListener("mousedown", function (e) { if (e.target === o) close(); });
    o.querySelector("[data-close]").addEventListener("click", close);
    o.querySelector("form").addEventListener("submit", function (e) {
      if (!o.querySelector("input").value.trim()) { e.preventDefault(); o.querySelector("input").focus(); }
    });
  }
  S.openSearch = openSearch;

  /* ---------- Accordions (FAQ) ---------- */
  function initAccordions() {
    $$("[data-accordion] .acc-item").forEach(function (item) {
      var trigger = $(".acc-trigger", item), panel = $(".acc-panel", item);
      if (!trigger || !panel) return;
      var inner = panel.firstElementChild;
      function set(open) {
        item.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));
        if (inner) { if (open) inner.removeAttribute("inert"); else inner.setAttribute("inert", ""); }
      }
      set(false);
      trigger.addEventListener("click", function () { set(!item.classList.contains("is-open")); });
    });
  }

  /* ---------- Boot ---------- */
  ready(function () {
    setMeta({}); // keeps canonical and og:url in step with data-site.js
    if (document.body.getAttribute("data-layout") !== "exam") { renderHeader(); renderFooter(); }
    initAccordions();
    $$(".js-year").forEach(function (n) { n.textContent = new Date().getFullYear(); });
    $$("[data-brand]").forEach(function (n) { n.innerHTML = brandHtml(n.getAttribute("data-brand")); });
  });
})();
