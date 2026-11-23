/* ==========================================================================
   SUJAG Education - cards.js
   Data lookups and the card templates shared by the home page, listing
   pages, detail pages and search. Load after main.js and the data files.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG;
  var esc = S.util.esc, plural = S.util.plural, icon = S.icon;

  function D() { return S.data || {}; }
  function list(name) { return D()[name] || []; }
  function byId(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; }

  var get = {
    cat: function (id) { return byId(list("testCategories"), id) || byId(list("testGroups"), id); },
    test: function (id) { return byId(list("tests"), id); },
    noteCat: function (id) { return byId(list("noteCategories"), id); },
    note: function (id) { return byId(list("notes"), id); },
    book: function (id) { return byId(list("books"), id); }
  };

  /* All tests in a category, or in every category of a group. */
  function testsIn(id) {
    var g = byId(list("testGroups"), id);
    var ids = g ? g.includes : [id];
    return list("tests").filter(function (t) { return ids.indexOf(t.category) !== -1; });
  }

  function testKind(t) {
    if (t.kind === "past-paper") return "Past paper";
    if (t.kind === "custom") return "Custom test";
    return "Mock test";
  }

  function groupsFor(category) {
    return list("testGroups").filter(function (g) { return (g.includes || []).includes(category); });
  }

  function recentFirst(a, b) {
    return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
  }

  function relatedTests(test, limit) {
    var groups = groupsFor(test.category);
    function relevance(item) {
      if (item.category === test.category) return 2;
      return groups.some(function (g) { return g.includes.includes(item.category); }) ? 1 : 0;
    }
    return list("tests").filter(function (item) { return item.id !== test.id; })
      .sort(function (a, b) { return relevance(b) - relevance(a) || recentFirst(a, b); }).slice(0, limit);
  }

  function latestUpdates() {
    var items = list("updates").filter(function (u) { return u.type !== "test"; });
    var manual = new Map();
    list("updates").forEach(function (u) {
      if (u.type === "test" && (!manual.has(u.id) || u.date > manual.get(u.id))) manual.set(u.id, u.date);
    });
    list("tests").forEach(function (t) {
      var published = t.updatedAt || t.createdAt || "";
      var date = [published, manual.get(t.id) || ""].sort().pop();
      var kind = testKind(t), updated = published && published === t.updatedAt && published !== t.createdAt;
      items.push({ type: "test", id: t.id, date: date,
        label: date ? (updated ? "Updated " : "New ") + kind.toLowerCase() : kind });
    });
    return items.sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
  }

  function price(b) {
    if (!b.price) return "Price on request";
    return (S.site.currency || "Rs.") + " " + Number(b.price).toLocaleString("en-US");
  }

  function diffBadge(d) {
    var k = String(d || "").toLowerCase();
    var cls = k === "easy" ? "badge-easy" : k === "hard" ? "badge-hard" : k === "medium" ? "badge-medium" : "badge-neutral";
    return d ? '<span class="badge ' + cls + '">' + icon("bar-chart", 14) + esc(d) + "</span>" : "";
  }

  function testCard(t) {
    var c = get.cat(t.category);
    var url = "test-details.html?id=" + encodeURIComponent(t.id);
    return '<article class="card item-card card-hover">' +
      '<div class="top"><a class="badge" href="test-category.html?cat=' + encodeURIComponent(t.category) + '">' + esc(c ? c.name : t.category) + "</a>" + diffBadge(t.difficulty) + (t.kind === "past-paper" || t.kind === "custom" ? '<span class="badge badge-neutral">' + (t.kind === "past-paper" ? "Past paper" : "Custom test") + "</span>" : "") + "</div>" +
      '<h3><a href="' + url + '">' + esc(t.title) + "</a></h3>" +
      '<p class="desc">' + esc(t.description) + "</p>" +
      '<ul class="facts"><li>' + icon("list", 16) + plural(t.questions.length, "question") + "</li><li>" + icon("clock", 16) + t.duration + " min</li></ul>" +
      '<div class="actions"><a class="btn btn-primary btn-sm" href="' + url + '">' + icon("play", 16) + " Start Test</a></div></article>";
  }

  function noteCard(n) {
    var c = get.noteCat(n.category);
    var url = "note-details.html?id=" + encodeURIComponent(n.id);
    var pdfFact = n.pdf ? "PDF" + (n.size ? " &middot; " + esc(n.size) : "") : "PDF coming soon";
    return '<article class="card item-card card-hover">' +
      '<div class="top"><a class="badge" href="notes.html?cat=' + encodeURIComponent(n.category) + '">' + esc(c ? c.name : n.category) + '</a><span class="badge badge-free">Free</span></div>' +
      '<h3><a href="' + url + '">' + esc(n.title) + "</a></h3>" +
      '<p class="desc">' + esc(n.description) + "</p>" +
      '<ul class="facts"><li>' + icon("file-text", 16) + pdfFact + "</li>" + (n.date ? "<li>" + icon("clock", 16) + esc(S.util.fmtDate(n.date)) + "</li>" : "") + "</ul>" +
      '<div class="actions"><a class="btn btn-primary btn-sm" href="' + url + '">' + icon("eye", 16) + " View Notes</a>" +
      (n.pdf ? '<a class="btn btn-ghost btn-sm" href="' + esc(n.pdf) + '" download>' + icon("download", 16) + " Download PDF</a>" : "") + "</div></article>";
  }

  function bookCard(b) {
    var url = "book-details.html?id=" + encodeURIComponent(b.id);
    return '<article class="card book-card card-hover">' +
      '<a class="book-cover" href="' + url + '" tabindex="-1" aria-hidden="true"><img src="' + esc(b.cover) + '" alt="Cover of ' + esc(b.title) + '" width="300" height="400" loading="lazy" decoding="async"></a>' +
      '<div class="book-body"><span class="badge badge-paid" style="align-self:flex-start">' + icon("shopping-bag", 14) + " Book &middot; Paid</span>" +
      '<h3><a href="' + url + '">' + esc(b.title) + "</a></h3>" +
      '<p class="book-author">' + (b.author ? "By " + esc(b.author) : "") + "</p>" +
      '<p class="desc">' + esc(b.description) + "</p>" +
      '<div class="book-foot"><span class="price">' + esc(price(b)) + '</span><a class="btn btn-primary btn-sm" href="' + url + '">View Book</a></div></div></article>';
  }

  var TONES = ["green", "navy", "orange"];
  function categoryCard(c, i) {
    var n = testsIn(c.id).length;
    return '<a class="card is-link cat-card" href="test-category.html?cat=' + encodeURIComponent(c.id) + '">' +
      '<span class="card-icon tone-' + TONES[(i || 0) % 3] + '">' + icon(c.icon || "book", 22) + "</span>" +
      "<h3>" + esc(c.name) + "</h3><p>" + esc(c.description || "") + "</p>" +
      '<span class="meta"><span>' + plural(n, "test") + "</span>" + icon("arrow-right", 18) + "</span></a>";
  }

  function empty(title, text) {
    return '<div class="empty"><h3>' + esc(title) + "</h3><p>" + esc(text || "") + "</p></div>";
  }

  /* Every word typed must appear somewhere in the text (case-insensitive). */
  S.util.matches = function (q, text) {
    var tokens = String(q || "").toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return true;
    var hay = String(text || "").toLowerCase();
    return tokens.every(function (t) { return hay.indexOf(t) !== -1; });
  };

  S.get = get;
  S.testsIn = testsIn;
  S.catalogue = { testKind: testKind, groupsFor: groupsFor, recentFirst: recentFirst, relatedTests: relatedTests, latestUpdates: latestUpdates };
  S.cards = { test: testCard, note: noteCard, book: bookCard, category: categoryCard, price: price, diffBadge: diffBadge, empty: empty };
})();
