/* ==========================================================================
   SUJAG Education - notes.js
   Controllers for notes.html (listing) and note-details.html (single note).
   Note content lives in data/notes.js.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, cards = S.cards;

  function catName(id) { var c = S.get.noteCat(id); return c ? c.name : id; }

  function pageList() {
    var notes = S.data.notes, cats = S.data.noteCategories;
    var state = { q: U.qs("q") || "", cat: S.get.noteCat(U.qs("cat")) ? U.qs("cat") : "", sort: "new" };
    var search = $("#n-search"), sort = $("#n-sort"), chips = $("#n-chips"), list = $("#n-list"), count = $("#n-count");
    search.value = state.q;

    function renderChips() {
      chips.innerHTML = '<button type="button" class="chip" data-cat="" aria-pressed="' + (!state.cat) + '">All <span class="count">' + notes.length + "</span></button>" +
        cats.map(function (c) {
          var n = notes.filter(function (x) { return x.category === c.id; }).length;
          return '<button type="button" class="chip" data-cat="' + esc(c.id) + '" aria-pressed="' + (state.cat === c.id) + '">' + esc(c.name) + ' <span class="count">' + n + "</span></button>";
        }).join("");
    }
    function update() {
      var items = notes.filter(function (n) {
        if (state.cat && n.category !== state.cat) return false;
        return U.matches(state.q, [n.title, n.description, catName(n.category)].join(" "));
      });
      items.sort(function (a, b) {
        if (state.sort === "title") return a.title.localeCompare(b.title);
        var d = String(b.date).localeCompare(String(a.date));
        return state.sort === "old" ? -d : d;
      });
      count.textContent = items.length ? "Showing " + U.plural(items.length, "note") : "";
      list.innerHTML = items.length
        ? items.map(function (n, i) { return cards.note(n).replace("<article ", '<article style="--i:' + Math.min(i, 8) + '" '); }).join("")
        : cards.empty("No notes found", "Try a different word or choose another category.");
    }
    renderChips(); update();
    search.addEventListener("input", U.debounce(function () { state.q = search.value; update(); }, 120));
    sort.addEventListener("change", function () { state.sort = sort.value; update(); });
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      state.cat = b.getAttribute("data-cat"); renderChips(); update();
    });
    $("#n-clear").addEventListener("click", function () {
      state.q = ""; state.cat = ""; search.value = ""; renderChips(); update(); search.focus();
    });
  }

  function pageDetail() {
    var note = S.get.note(U.qs("id")), head = $("#note-head"), main = $("#note-main"), side = $("#note-side");
    if (!note) {
      S.setMeta({ title: "Notes not found" });
      head.innerHTML = '<div class="container"><h1>Notes not found</h1><p class="lead">We could not find those notes. They may have been renamed or removed.</p></div>';
      $("#note-layout").innerHTML = "<div>" + cards.empty("Nothing to show", "Browse the full list of notes.") + '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="notes.html">Browse notes</a></p></div>';
      return;
    }
    S.setMeta({ title: note.title, description: note.description });
    head.innerHTML = '<div class="container"><ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="notes.html">Notes</a></li>' +
      '<li><a href="notes.html?cat=' + encodeURIComponent(note.category) + '">' + esc(catName(note.category)) + '</a></li><li aria-current="page">Details</li></ol>' +
      '<div class="row" style="margin-bottom:12px"><span class="badge">' + esc(catName(note.category)) + '</span><span class="badge badge-free">Free</span></div>' +
      "<h1>" + esc(note.title) + '</h1><p class="lead">' + esc(note.description) + "</p></div>";

    var sections = (note.sections || []).map(function (s) {
      return '<div class="note-section"><h3>' + esc(s.heading) + "</h3><ul>" + s.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>";
    }).join("");
    var pdfBlock = note.pdf
      ? '<section class="panel"><h2>PDF</h2><iframe class="pdf-frame" src="' + esc(note.pdf) + '" title="PDF preview of ' + esc(note.title) + '" loading="lazy"></iframe>' +
        '<p class="muted" style="margin:12px 0 0;font-size:.9rem">If the preview does not appear on your device, use <a href="' + esc(note.pdf) + '" target="_blank" rel="noopener">Open PDF</a> or download it from the side panel.</p></section>'
      : "";
    main.innerHTML =
      '<section class="panel"><h2>Overview</h2>' + (note.intro ? "<p>" + esc(note.intro) + "</p>" : "") + (sections || '<p class="muted">The written version of these notes will be added soon.</p>') + "</section>" + pdfBlock;

    side.innerHTML = '<div class="panel"><h2>About these notes</h2><ul class="key-facts">' +
      "<li><span>" + icon("book", 18) + "Category</span><span>" + esc(catName(note.category)) + "</span></li>" +
      (note.date ? "<li><span>" + icon("clock", 18) + "Updated</span><span>" + esc(U.fmtDate(note.date)) + "</span></li>" : "") +
      "<li><span>" + icon("file-text", 18) + "PDF</span><span>" + (note.pdf ? esc(note.size || "Available") : "Coming soon") + "</span></li>" +
      (note.pages ? "<li><span>" + icon("layers", 18) + "Pages</span><span>" + note.pages + "</span></li>" : "") +
      "<li><span>" + icon("check-circle", 18) + "Price</span><span>Free</span></li></ul>" +
      '<div class="stack" style="margin-top:16px">' +
      (note.pdf
        ? '<a class="btn btn-primary btn-block" href="' + esc(note.pdf) + '" download>' + icon("download", 18) + " Download PDF</a>" +
          '<a class="btn btn-ghost btn-block" href="' + esc(note.pdf) + '" target="_blank" rel="noopener">' + icon("external-link", 18) + " Open PDF</a>"
        : '<button type="button" class="btn btn-primary btn-block" disabled>PDF coming soon</button>') +
      '<a class="btn btn-glass btn-block" href="mock-tests.html">' + icon("play", 18) + " Practise with a mock test</a></div></div>";

    var related = S.data.notes.filter(function (n) { return n.id !== note.id; })
      .sort(function (a, b) { return (b.category === note.category) - (a.category === note.category); }).slice(0, 3);
    $("#related").innerHTML = related.map(cards.note).join("");
  }

  U.ready(function () {
    var page = document.body.getAttribute("data-page");
    if (page === "notes") pageList(); else if (page === "note-details") pageDetail();
  });
})();
