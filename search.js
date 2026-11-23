/* ==========================================================================
   SUJAG Education - search.js
   Search across mock tests, notes, books and categories (search.html).
   Uses the same demo data as every other page.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, cards = S.cards;

  function rank(q, title, text) {
    var t = title.toLowerCase(), qq = q.toLowerCase().trim();
    if (t === qq) return 0;
    if (t.indexOf(qq) === 0) return 1;
    if (t.indexOf(qq) !== -1) return 2;
    return U.matches(q, title) ? 3 : 4;
  }
  function run(list, q, fields, titleKey) {
    return list.filter(function (x) { return U.matches(q, fields(x)); })
      .sort(function (a, b) { return rank(q, a[titleKey]) - rank(q, b[titleKey]); });
  }

  /* Returns matches for every content type. */
  S.search = function (q) {
    q = String(q || "").trim();
    var d = S.data;
    var testCats = d.testCategories.concat(d.testGroups || []).map(function (c) { return { kind: "test", id: c.id, name: c.name, description: c.description, icon: c.icon }; });
    var noteCats = d.noteCategories.map(function (c) { return { kind: "note", id: c.id, name: c.name, description: "Free study notes in " + c.name + ".", icon: c.icon }; });
    return {
      tests: run(d.tests, q, function (t) {
        return [t.title, t.description, (S.get.cat(t.category) || {}).name, t.difficulty, S.catalogue.testKind(t) + "s", "practice tests",
          S.catalogue.groupsFor(t.category).map(function (g) { return g.name; }).join(" "), t.tags, t.keywords,
          (t.questions || []).map(function (question) { return question.q; }).join(" ")].join(" ");
      }, "title"),
      notes: run(d.notes, q, function (n) {
        return ["study notes", n.title, n.description, n.intro, (S.get.noteCat(n.category) || {}).name, n.tags, n.keywords,
          (n.sections || []).map(function (s) { return [s.heading].concat(s.points || []).join(" "); }).join(" ")].join(" ");
      }, "title"),
      books: run(d.books, q, function (b) { return ["books", b.title, b.author, b.description, b.longDescription, b.contents, b.category, b.tags, b.keywords].join(" "); }, "title"),
      categories: run(testCats.concat(noteCats), q, function (c) { return c.name + " " + c.description; }, "name"),
      updates: run((d.updates || []).filter(function (u) { return u.type === "info" && u.text; }), q, function (u) { return u.text; }, "text")
    };
  };

  function categoryResult(c) {
    var href = c.kind === "test" ? "test-category.html?cat=" : "notes.html?cat=";
    return '<a class="card is-link cat-card" href="' + href + encodeURIComponent(c.id) + '"><span class="card-icon tone-green">' + icon(c.icon || "book", 22) + "</span><h3>" + esc(c.name) + "</h3><p>" + esc(c.description) +
      '</p><span class="meta"><span>' + (c.kind === "test" ? "Mock tests" : "Notes") + "</span>" + icon("arrow-right", 18) + "</a>";
  }

  function updateResult(u) {
    var url;
    try { url = new URL(u.href || "index.html", location.href); } catch (_) {}
    var href = url && /^https?:$/.test(url.protocol) ? url.href : "index.html";
    return '<article class="card item-card"><h3><a href="' + esc(href) + '">' + esc(u.text) + '</a></h3><p class="meta">' + esc(U.fmtDate(u.date)) + '</p></article>';
  }

  U.ready(function () {
    var form = $("#search-form"); if (!form) return;
    var input = $("#s-input"), out = $("#s-results"), status = $("#s-status"), chips = $("#s-chips");
    var type = "all";
    var groups = [
      { key: "tests", label: "Tests and past papers", card: cards.test, grid: true },
      { key: "notes", label: "Notes", card: cards.note, grid: true },
      { key: "books", label: "Books", card: cards.book, grid: true },
      { key: "categories", label: "Categories", card: categoryResult, grid: true },
      { key: "updates", label: "Updates", card: updateResult, grid: true }
    ];
    var last = null;

    function draw() {
      var q = input.value.trim();
      if (!q) {
        status.textContent = "";
        chips.innerHTML = "";
        out.innerHTML = '<div class="empty"><h3>Search the whole site</h3><p>Type a topic, exam name or book title.</p><div class="chip-row" style="justify-content:center">' +
          S.keywordLinks() + "</div></div>";
        return;
      }
      last = S.search(q);
      var total = groups.reduce(function (n, g) { return n + last[g.key].length; }, 0);
      status.textContent = total ? U.plural(total, "result") + ' for "' + q + '"' : "";
      chips.innerHTML = '<button type="button" class="chip" data-t="all" aria-pressed="' + (type === "all") + '">All <span class="count">' + total + "</span></button>" +
        groups.map(function (g) { return '<button type="button" class="chip" data-t="' + g.key + '" aria-pressed="' + (type === g.key) + '">' + g.label + ' <span class="count">' + last[g.key].length + "</span></button>"; }).join("");
      if (!total) {
        out.innerHTML = cards.empty("No results for \"" + q + "\"", "Check the spelling, use fewer words, or browse the mock tests, notes and books directly.") +
          '<div class="row" style="justify-content:center;margin-top:18px"><a class="btn btn-ghost" href="mock-tests.html">Mock Tests</a><a class="btn btn-ghost" href="notes.html">Notes</a><a class="btn btn-ghost" href="books.html">Books</a></div>';
        return;
      }
      out.innerHTML = groups.filter(function (g) { return (type === "all" || type === g.key) && last[g.key].length; }).map(function (g) {
        return '<section class="search-group" style="margin-bottom:36px"><h2 style="font-size:1.25rem">' + g.label + ' <span class="muted" style="font-weight:600;font-size:.95rem">(' + last[g.key].length + ')</span></h2><div class="grid">' +
          last[g.key].map(g.card).join("") + "</div></section>";
      }).join("");
    }

    var initial = U.qs("q") || "";
    input.value = initial;
    S.setMeta({ title: initial ? 'Search: ' + initial : "Search" });
    draw();
    input.addEventListener("input", U.debounce(function () {
      type = "all";
      var q = input.value.trim();
      try { history.replaceState(null, "", q ? "search.html?q=" + encodeURIComponent(q) : "search.html"); } catch (e) { /* ignore */ }
      draw();
    }, 140));
    form.addEventListener("submit", function (e) { e.preventDefault(); draw(); });
    chips.addEventListener("click", function (e) { var b = e.target.closest("[data-t]"); if (!b) return; type = b.getAttribute("data-t"); draw(); });
    if (!initial) input.focus();
  });
})();
