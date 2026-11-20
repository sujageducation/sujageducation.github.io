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
    var testCats = d.testCategories.map(function (c) { return { kind: "test", id: c.id, name: c.name, description: c.description, icon: c.icon }; });
    var noteCats = d.noteCategories.map(function (c) { return { kind: "note", id: c.id, name: c.name, description: "Free study notes in " + c.name + ".", icon: c.icon }; });
    return {
      tests: run(d.tests, q, function (t) { return [t.title, t.description, (S.get.cat(t.category) || {}).name, t.difficulty].join(" "); }, "title"),
      notes: run(d.notes, q, function (n) { return [n.title, n.description, (S.get.noteCat(n.category) || {}).name].join(" "); }, "title"),
      books: run(d.books, q, function (b) { return [b.title, b.author, b.description, b.category].join(" "); }, "title"),
      categories: run(testCats.concat(noteCats), q, function (c) { return c.name + " " + c.description; }, "name")
    };
  };

  function categoryResult(c) {
    var href = c.kind === "test" ? "test-category.html?cat=" : "notes.html?cat=";
    return '<a class="card is-link cat-card" href="' + href + encodeURIComponent(c.id) + '"><span class="card-icon tone-green">' + icon(c.icon || "book", 22) + "</span><h3>" + esc(c.name) + "</h3><p>" + esc(c.description) +
      '</p><span class="meta"><span>' + (c.kind === "test" ? "Mock tests" : "Notes") + "</span>" + icon("arrow-right", 18) + "</a>";
  }

  U.ready(function () {
    var form = $("#search-form"); if (!form) return;
    var input = $("#s-input"), out = $("#s-results"), status = $("#s-status"), chips = $("#s-chips");
    var type = "all";
    var groups = [
      { key: "tests", label: "Mock tests", card: cards.test, grid: true },
      { key: "notes", label: "Notes", card: cards.note, grid: true },
      { key: "books", label: "Books", card: cards.book, grid: true },
      { key: "categories", label: "Categories", card: categoryResult, grid: true }
    ];
    var last = null;

    function draw() {
      var q = input.value.trim();
      if (!q) {
        status.textContent = "";
        chips.innerHTML = "";
        out.innerHTML = '<div class="empty"><h3>Search the whole site</h3><p>Type a topic, exam name or book title. Try one of these:</p><div class="chip-row" style="justify-content:center">' +
          ["SPSC", "grammar", "Pakistan", "mathematics", "computer", "police"].map(function (w) { return '<a class="chip" href="search.html?q=' + encodeURIComponent(w) + '">' + esc(w) + "</a>"; }).join("") + "</div></div>";
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
