/* ==========================================================================
   SUJAG Education - books.js
   Controllers for books.html (store listing) and book-details.html, plus the
   order dialog. Ordering is NOT connected to a payment system. Depending on
   data-site.js it opens a WhatsApp chat or email with the order details, or
   explains that ordering is not set up yet. No payment is ever taken here.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, cards = S.cards;

  function pageList() {
    var books = S.data.books;
    var cats = []; books.forEach(function (b) { if (cats.indexOf(b.category) === -1) cats.push(b.category); });
    var state = { q: U.qs("q") || "", cat: cats.indexOf(U.qs("cat")) !== -1 ? U.qs("cat") : "" };
    var search = $("#b-search"), chips = $("#b-chips"), list = $("#b-list"), count = $("#b-count");
    search.value = state.q;
    function renderChips() {
      chips.innerHTML = '<button type="button" class="chip" data-cat="" aria-pressed="' + (!state.cat) + '">All <span class="count">' + books.length + "</span></button>" +
        cats.map(function (c) {
          var n = books.filter(function (b) { return b.category === c; }).length;
          return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (state.cat === c) + '">' + esc(c) + ' <span class="count">' + n + "</span></button>";
        }).join("");
    }
    function update() {
      var items = books.filter(function (b) {
        if (state.cat && b.category !== state.cat) return false;
        return U.matches(state.q, [b.title, b.author, b.description, b.category].join(" "));
      });
      count.textContent = items.length ? "Showing " + U.plural(items.length, "book") : "";
      list.innerHTML = items.length ? items.map(function (b, i) { return cards.book(b).replace("<article ", '<article style="--i:' + Math.min(i, 8) + '" '); }).join("")
        : cards.empty("No books found", "Try a different word or choose another category.");
    }
    renderChips(); update();
    search.addEventListener("input", U.debounce(function () { state.q = search.value; update(); }, 120));
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      state.cat = b.getAttribute("data-cat"); renderChips(); update();
    });
    $("#b-clear").addEventListener("click", function () { state.q = ""; state.cat = ""; search.value = ""; renderChips(); update(); search.focus(); });
    $("#demo-note").hidden = !S.site.demoMode;
  }

  function orderMessage(book, f) {
    var qty = f.qty, total = book.price ? book.price * qty : 0;
    return ["Book order request", "Book: " + book.title, "Quantity: " + qty,
      book.price ? "Price: " + cards.price(book) + " each, total " + (S.site.currency || "Rs.") + " " + total.toLocaleString("en-US") : "Price: to be confirmed",
      "Name: " + f.name, "Phone: " + f.phone, "City / delivery address: " + f.address, f.note ? "Note: " + f.note : ""].filter(Boolean).join("\n");
  }

  function openOrder(book) {
    var html = '<form id="order-form" novalidate><p style="margin-bottom:14px">Fill in your details to prepare an order request for <strong>' + esc(book.title) + "</strong>.</p>" +
      '<div class="field"><label for="o-name">Your name</label><input id="o-name" type="text" maxlength="60" autocomplete="name" required><span class="error">Please enter your name.</span></div>' +
      '<div class="field"><label for="o-phone">Phone number</label><input id="o-phone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" required><span class="error">Enter a valid phone number.</span></div>' +
      '<div class="field"><label for="o-address">City and delivery address</label><textarea id="o-address" maxlength="200" style="min-height:80px" required></textarea><span class="error">Please enter where the book should be sent.</span></div>' +
      '<div class="field"><label for="o-qty">Quantity</label><input id="o-qty" type="number" min="1" max="20" value="1" required><span class="error">Enter a quantity from 1 to 20.</span></div>' +
      '<div class="field"><label for="o-note">Note <span class="opt">(optional)</span></label><input id="o-note" type="text" maxlength="120"></div>' +
      '<p class="muted" style="font-size:.82rem;margin:0">Nothing is paid or sent from this form. It only prepares the order text.</p></form>';
    S.ui.modal({
      title: "Order this book", html: html, wide: true, focus: "#o-name",
      actions: [{ label: "Cancel", value: false, variant: "btn-ghost" }],
      onOpen: function (h) {
        var form = h.el.querySelector("#order-form");
        var actions = h.el.querySelector(".modal-actions");
        var go = document.createElement("button");
        go.type = "button"; go.className = "btn btn-primary"; go.textContent = "Prepare order";
        actions.appendChild(go);
        function check() {
          var v = {
            name: form.querySelector("#o-name").value.trim(), phone: form.querySelector("#o-phone").value.trim(),
            address: form.querySelector("#o-address").value.trim(), qty: parseInt(form.querySelector("#o-qty").value, 10), note: form.querySelector("#o-note").value.trim()
          };
          var digits = v.phone.replace(/\D/g, "").length;
          var ok = {
            "o-name": v.name.length > 1, "o-phone": /^[0-9+\-\s()]+$/.test(v.phone) && digits >= 7 && digits <= 15,
            "o-address": v.address.length > 5, "o-qty": v.qty >= 1 && v.qty <= 20
          };
          var first = null;
          Object.keys(ok).forEach(function (k) {
            form.querySelector("#" + k).closest(".field").classList.toggle("has-error", !ok[k]);
            if (!ok[k] && !first) first = k;
          });
          if (first) { form.querySelector("#" + first).focus(); return null; }
          return v;
        }
        function submit() {
          var v = check(); if (!v) return;
          h.close(true);
          finishOrder(book, v);
        }
        go.addEventListener("click", submit);
        form.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
      }
    });
  }

  function finishOrder(book, v) {
    var text = orderMessage(book, v), wa = (S.site.whatsapp || "").replace(/\D/g, ""), mail = S.site.email || "";
    if (wa) {
      var url = "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
      S.ui.modal({
        title: "Send your order on WhatsApp", dismissValue: false,
        html: "<p>Your order request is ready. Press the button to open WhatsApp and send it. The order is only confirmed once the seller replies to you.</p><div class=\"summary-box\">" + esc(text) + "</div>",
        actions: [{ label: "Close", value: false, variant: "btn-ghost" }, { label: "Open WhatsApp", value: true, variant: "btn-primary" }]
      }).then(function (ok) { if (ok) window.open(url, "_blank", "noopener"); });
      return;
    }
    var body = "<p><strong>Ordering is not connected yet.</strong> " + (S.site.demoMode ? "This website is currently a demonstration, so " : "") + "no order has been placed and no payment has been taken.</p>" +
      '<p>The site owner can connect WhatsApp, email or a payment service in <code>data-site.js</code>. Meanwhile, this is the order text that would be sent:</p><div class="summary-box">' + esc(text) + "</div>";
    var actions = [{ label: "Close", value: "close", variant: "btn-ghost" }, { label: "Copy order text", value: "copy", variant: "btn-primary" }];
    if (mail) actions.splice(1, 0, { label: "Email it", value: "mail", variant: "btn-glass" });
    S.ui.modal({ title: "Order not placed", html: body, dismissValue: "close", actions: actions }).then(function (a) {
      if (a === "copy") S.ui.copy(text).then(function () { S.ui.toast("Order text copied"); }, function () { S.ui.toast("Could not copy. Select the text and copy it manually.", "error"); });
      if (a === "mail") window.location.href = "mailto:" + mail + "?subject=" + encodeURIComponent("Book order: " + book.title) + "&body=" + encodeURIComponent(text);
    });
  }

  function pageDetail() {
    var book = S.get.book(U.qs("id")), head = $("#book-head");
    if (!book) {
      S.setMeta({ title: "Book not found" });
      head.innerHTML = '<div class="container"><h1>Book not found</h1><p class="lead">We could not find that book.</p></div>';
      $("#book-layout").innerHTML = "<div>" + cards.empty("Nothing to show", "Browse the books store.") + '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="books.html">Browse books</a></p></div>';
      return;
    }
    S.setMeta({ title: book.title, description: book.description + " Available on SUJAG Education." });
    head.innerHTML = '<div class="container"><ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="books.html">Books</a></li><li aria-current="page">' + esc(book.title) + "</li></ol>" +
      '<div class="row" style="margin-bottom:12px"><span class="badge">' + esc(book.category) + '</span><span class="badge badge-paid">' + icon("shopping-bag", 14) + " Paid book</span></div>" +
      "<h1>" + esc(book.title) + "</h1>" + (book.author ? '<p class="lead">By ' + esc(book.author) + "</p>" : "") + "</div>";

    $("#book-cover").innerHTML = '<div class="big-cover"><img src="' + esc(book.cover) + '" alt="Cover of ' + esc(book.title) + '" width="300" height="400"></div>';
    $("#book-main").innerHTML = '<section class="panel"><h2>About this book</h2><p>' + esc(book.longDescription || book.description) + "</p></section>" +
      '<section class="panel"><h2>What is inside</h2><ul class="check-list">' + (book.contents || []).map(function (c) { return "<li>" + icon("check", 18) + "<span>" + esc(c) + "</span></li>"; }).join("") + "</ul></section>" +
      '<section class="panel"><h2>Book information</h2><ul class="key-facts">' +
      (book.author ? "<li><span>Author</span><span>" + esc(book.author) + "</span></li>" : "") + "<li><span>Category</span><span>" + esc(book.category) + "</span></li>" +
      (book.format ? "<li><span>Format</span><span>" + esc(book.format) + "</span></li>" : "") + (book.language ? "<li><span>Language</span><span>" + esc(book.language) + "</span></li>" : "") +
      (book.pages ? "<li><span>Pages</span><span>" + book.pages + "</span></li>" : "") + "</ul></section>";

    var contact = [];
    if (S.site.whatsapp) contact.push("WhatsApp");
    if (S.site.email) contact.push("email");
    $("#book-buy").innerHTML = '<div class="panel"><span class="price" style="font-size:1.7rem">' + esc(cards.price(book)) + "</span>" +
      '<p class="muted" style="margin:6px 0 16px;font-size:.92rem">Printed book. Notes and mock tests on this website stay free.</p>' +
      '<button type="button" class="btn btn-primary btn-block" id="buy">' + icon("shopping-bag", 18) + " Purchase this book</button>" +
      '<div class="notice' + (contact.length ? "" : " notice-warn") + '" style="margin-top:16px"><span>' + icon(contact.length ? "info" : "alert", 18) + "</span><p>" +
      (contact.length ? "Ordering is arranged through " + contact.join(" or ") + ". You will confirm price and delivery with the seller; no online payment happens on this site."
        : "Ordering is not connected yet. " + (S.site.demoMode ? "This is a demonstration listing. " : "") + "Press the button to see how the order request will work.") + "</p></div></div>";
    $("#buy").addEventListener("click", function () { openOrder(book); });

    var more = S.data.books.filter(function (b) { return b.id !== book.id; }).slice(0, 3);
    $("#more-books").innerHTML = more.map(cards.book).join("");

    if (!S.site.demoMode) {
      var ld = { "@context": "https://schema.org", "@type": "Book", name: book.title, description: book.description, inLanguage: "en" };
      if (book.author) ld.author = { "@type": "Person", name: book.author };
      var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
    }
  }

  U.ready(function () {
    var page = document.body.getAttribute("data-page");
    if (page === "books") pageList(); else if (page === "book-details") pageDetail();
  });
})();
