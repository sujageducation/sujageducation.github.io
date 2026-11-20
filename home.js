/* ==========================================================================
   SUJAG Education - home.js
   Fills the category, test, notes and books sections on index.html from the
   data files, and runs the "Latest updates" list. Mark items with
   featured: true in the data to show them in the home sections. The updates
   list is edited in data/updates.js.
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
    return { kind: k, title: title, href: href, date: u.date };
  }

  function updateItem(x, clone) {
    return '<li><a class="upd" href="' + esc(x.href) + '"' + (clone ? ' tabindex="-1" aria-hidden="true"' : "") + '>' +
      '<span class="upd-icon tone-' + x.kind.tone + '">' + icon(x.kind.icon, 20) + "</span>" +
      '<span class="upd-body"><span class="upd-title">' + esc(x.title) + '</span><span class="upd-meta"><b>' + esc(x.kind.label) + "</b> &middot; " + esc(U.fmtDate(x.date)) + "</span></span>" +
      icon("arrow-right", 18) + "</a></li>";
  }

  function initUpdates() {
    var host = $("#updates"); if (!host) return;
    var items = (S.data.updates || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); })
      .map(resolveUpdate).filter(Boolean);
    if (!items.length) { host.hidden = true; return; }

    var vp = $("#updates-viewport"), list = $("#updates-list"), btn = $("#updates-toggle"), state = $("#updates-state");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var looping = !reduce && items.length > 3;
    list.innerHTML = items.map(function (x) { return updateItem(x, false); }).join("") +
      (looping ? items.map(function (x) { return updateItem(x, true); }).join("") : "");

    var SPEED = 30; // pixels per second
    var userPaused = reduce, hoverPaused = false, offscreen = false;
    var pos = 0, last = 0, raf = 0;

    function running() { return looping && !userPaused && !hoverPaused && !offscreen && !document.hidden; }
    function loopHeight() { return list.scrollHeight / 2; }

    function paint() {
      host.classList.toggle("is-paused", !running());
      var isRun = !userPaused;
      btn.setAttribute("aria-pressed", String(userPaused));
      btn.innerHTML = icon(userPaused ? "play" : "pause", 16) + (userPaused ? "Resume" : "Pause");
      btn.setAttribute("aria-label", userPaused ? "Resume automatic scrolling" : "Pause automatic scrolling");
      btn.hidden = reduce || !looping;
      state.innerHTML = icon(isRun ? "refresh" : "info", 16) + "<span>" + (reduce || !looping ? "Scroll to see more updates." : isRun ? "Scrolling automatically. Click or touch to pause." : "Paused. Scroll freely, or press Resume.") + "</span>";
    }
    function frame(t) {
      raf = 0;
      if (!running()) { last = 0; return; }
      if (!last) last = t;
      var dt = Math.min(t - last, 64); last = t;
      pos += (SPEED * dt) / 1000;
      var h = loopHeight(); if (h > 0 && pos >= h) pos -= h;
      vp.scrollTop = pos;
      raf = requestAnimationFrame(frame);
    }
    function sync() { // start or stop the loop to match the current state
      paint();
      if (running() && !raf) { pos = vp.scrollTop; last = 0; raf = requestAnimationFrame(frame); }
      if (!running() && raf) { cancelAnimationFrame(raf); raf = 0; last = 0; }
    }
    function pauseForUser() { if (!userPaused) { userPaused = true; sync(); } }

    // Clicking, touching, scrolling or focusing the list stops the movement so the reader can scroll by hand.
    ["pointerdown", "wheel", "touchstart", "focusin"].forEach(function (ev) { vp.addEventListener(ev, pauseForUser, { passive: true }); });
    vp.addEventListener("keydown", function (e) { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].indexOf(e.key) !== -1) pauseForUser(); });
    btn.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    host.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hoverPaused = true; sync(); } });
    host.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { hoverPaused = false; sync(); } });
    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { offscreen = !en[0].isIntersecting; sync(); }).observe(host);

    // Keeps the loop seamless while the reader scrolls by hand (the second half repeats the first).
    vp.addEventListener("scroll", function () {
      if (!looping) return;
      var h = loopHeight(), st = vp.scrollTop;
      if (h > 0 && st >= h) { vp.scrollTop = st - h; pos = vp.scrollTop; }
      else if (st <= 0 && userPaused && h > 0 && last === 0 && vp.dataset.touched) vp.scrollTop = h;
    }, { passive: true });
    vp.addEventListener("pointerdown", function () { vp.dataset.touched = "1"; }, { passive: true });
    sync();
  }

  U.ready(function () {
    $("#home-categories").innerHTML = HOME_CATEGORIES.map(S.get.cat).filter(Boolean).map(function (c, i) { return stagger(cards.category(c, i), i); }).join("");
    $("#home-tests").innerHTML = S.data.tests.filter(function (t) { return t.featured; }).slice(0, 6).map(cards.test).join("");
    $("#home-notes").innerHTML = S.data.notes.filter(function (n) { return n.featured; }).slice(0, 3).map(cards.note).join("");
    $("#home-books").innerHTML = S.data.books.filter(function (b) { return b.featured; }).slice(0, 4).map(cards.book).join("");
    initUpdates();
  });
})();
