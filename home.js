/* ==========================================================================
   SUJAG Education - home.js
   Fills the category, test, notes and books sections on index.html from the
   data files, and runs the "Latest updates" list. Mark items with
   featured: true in the data to show them in the home sections. The updates
   list is edited in data-updates.js.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, cards = S.cards;

  var HOME_CATEGORIES = ["government-jobs", "university", "general-knowledge", "english", "mathematics", "science", "computer-science", "current-affairs"];
  function stagger(html, i) { return html.replace(/<(article|a) /, '<$1 style="--i:' + Math.min(i, 8) + '" ').replace(/class="/, 'class="rise '); }

  /* ---------- Latest updates ---------- */
  var KINDS = {
    test: { label: "New mock test", icon: "list", tone: "navy" },
    note: { label: "New notes", icon: "file-text", tone: "green" },
    book: { label: "New book", icon: "book-open", tone: "orange" },
    info: { label: "Update", icon: "sparkles", tone: "green" }
  };

  function resolveUpdate(u) {
    var k = KINDS[u.type]; if (!k) return null;
    var title, href;
    if (u.type === "test") { var t = S.get.test(u.id); if (!t) return null; title = t.title; href = "test-details.html?id=" + encodeURIComponent(t.id); }
    else if (u.type === "note") { var n = S.get.note(u.id); if (!n) return null; title = n.title; href = "note-details.html?id=" + encodeURIComponent(n.id); }
    else if (u.type === "book") { var b = S.get.book(u.id); if (!b) return null; title = b.title; href = "book-details.html?id=" + encodeURIComponent(b.id); }
    else { title = u.text; href = u.href || "index.html"; }
    return { kind: k, label: u.label || k.label, title: title, href: href, date: u.date };
  }

  function updateItem(x, clone) {
    return '<li><a class="upd" href="' + esc(x.href) + '"' + (clone ? ' tabindex="-1" aria-hidden="true"' : "") + '>' +
      '<span class="upd-icon tone-' + x.kind.tone + '">' + icon(x.kind.icon, 20) + "</span>" +
      '<span class="upd-body"><span class="upd-title">' + esc(x.title) + '</span><span class="upd-meta"><b>' + esc(x.label) + "</b>" + (x.date ? " &middot; " + esc(U.fmtDate(x.date)) : "") + "</span></span>" +
      icon("arrow-right", 18) + "</a></li>";
  }

  function initUpdates() {
    var host = $("#updates"); if (!host) return;
    var items = S.catalogue.latestUpdates().map(resolveUpdate).filter(Boolean);
    if (!items.length) { host.hidden = true; return; }

    var vp = $("#updates-viewport"), list = $("#updates-list");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.innerHTML = items.map(function (x) { return updateItem(x, false); }).join("");

    // The list scrolls once from the first update to the last, then stops. Any touch, click, wheel,
    // key press or hover stops the movement for good so the reader can scroll by hand.
    var SPEED = 28, pos = 0, last = 0, raf = 0, stopped = reduce, started = false;
    function frame(t) {
      raf = 0; if (stopped) return;
      if (!last) last = t;
      var dt = Math.min(t - last, 64); last = t;
      pos += (SPEED * dt) / 1000;
      var max = vp.scrollHeight - vp.clientHeight;
      if (max <= 0 || pos >= max) { vp.scrollTop = Math.max(0, max); stopped = true; return; }
      vp.scrollTop = pos; raf = requestAnimationFrame(frame);
    }
    function stop() { stopped = true; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    ["pointerdown", "touchstart", "wheel", "focusin", "mouseenter"].forEach(function (ev) { vp.addEventListener(ev, stop, { passive: true }); });
    vp.addEventListener("keydown", stop);
    function begin() { if (started || stopped) return; started = true; pos = 0; vp.scrollTop = 0; raf = requestAnimationFrame(frame); }
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); setTimeout(begin, 900); } }); io.observe(host); }
    else setTimeout(begin, 900);
  }

  U.ready(function () {
    $("#home-categories").innerHTML = HOME_CATEGORIES.map(S.get.cat).filter(Boolean).map(function (c, i) { return stagger(cards.category(c, i), i); }).join("");
    $("#home-tests").innerHTML = S.data.tests.filter(function (t) { return t.featured; }).sort(S.catalogue.recentFirst).slice(0, 6).map(cards.test).join("");
    $("#home-notes").innerHTML = S.data.notes.filter(function (n) { return n.featured; }).slice(0, 3).map(cards.note).join("");
    $("#home-books").innerHTML = S.data.books.filter(function (b) { return b.featured; }).slice(0, 4).map(cards.book).join("");
    initUpdates();
  });
})();
