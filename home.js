/* ==========================================================================
   SUJAG Education - home.js
   Fills the category, test, notes and books sections on index.html from the
   data files. Mark items with featured: true in the data to show them here.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, cards = S.cards;

  var HOME_CATEGORIES = ["government-jobs", "university", "general-knowledge", "english", "mathematics", "science", "computer-science", "current-affairs"];
  function stagger(html, i) { return html.replace(/<(article|a) /, '<$1 style="--i:' + Math.min(i, 8) + '" ').replace(/class="/, 'class="rise '); }

  U.ready(function () {
    $("#home-categories").innerHTML = HOME_CATEGORIES.map(S.get.cat).filter(Boolean).map(function (c, i) { return stagger(cards.category(c), i); }).join("");
    $("#home-tests").innerHTML = S.data.tests.filter(function (t) { return t.featured; }).slice(0, 6).map(cards.test).join("");
    $("#home-notes").innerHTML = S.data.notes.filter(function (n) { return n.featured; }).slice(0, 3).map(cards.note).join("");
    $("#home-books").innerHTML = S.data.books.filter(function (b) { return b.featured; }).slice(0, 4).map(cards.book).join("");
  });
})();
