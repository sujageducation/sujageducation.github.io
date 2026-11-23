/* ==========================================================================
   SUJAG Education - tests.js
   1. Core test API (scoring, saving attempts and results in the browser).
   2. Page controllers for mock-tests.html, test-category.html and
      test-details.html (chosen by <body data-page="...">).
   Test content itself lives in data-tests.js.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, cards = S.cards;
  var RESULTS_KEY = "sujag:results";
  var MAX_RESULTS = 30;
  var T = (S.tests = {});

  /* ---------- Core API ---------- */
  T.progressKey = function (id) { return "sujag:progress:" + id; };

  T.score = function (questions, answers) {
    var c = 0, w = 0, u = 0;
    questions.forEach(function (q, i) {
      var a = answers[i];
      if (a === null || a === undefined) u++;
      else if (a === q.a) c++;
      else w++;
    });
    var total = questions.length;
    return { total: total, correct: c, wrong: w, unanswered: u, marks: c, percent: total ? Math.round((c / total) * 1000) / 10 : 0 };
  };
  T.fmtPct = function (p) { return (Math.round(p * 10) / 10).toString(); };

  T.getProgress = function (test) {
    var st = U.store.get(T.progressKey(test.id), null);
    if (!st || !Array.isArray(st.answers) || st.answers.length !== test.questions.length || typeof st.endAt !== "number") return null;
    if (!st.rid) {
      // Old in-progress attempts use the same ID after a refresh or in a second tab.
      st.rid = "v1-" + st.startedAt.toString(36) + "-" + encodeURIComponent(test.id).replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
      U.store.set(T.progressKey(test.id), st);
    }
    return st;
  };
  T.clearProgress = function (id) { U.store.remove(T.progressKey(id)); };

  T.clearFinishedProgress = function (id, rid) {
    var active = U.store.get(T.progressKey(id), null);
    if (active && active.rid === rid) T.clearProgress(id);
  };

  T.startAttempt = function (test, candidate) {
    var now = Date.now();
    var st = {
      v: 2, rid: crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), function (b) { return b.toString(16).padStart(2, "0"); }).join(""), testId: test.id, startedAt: now, endAt: now + test.duration * 60000,
      answers: test.questions.map(function () { return null; }), current: 0, candidate: candidate || {}
    };
    return U.store.set(T.progressKey(test.id), st) ? st : null;
  };

  T.getResults = function () {
    var a = U.store.get(RESULTS_KEY, []);
    var b = U.store.get(RESULTS_KEY, [], "session");
    var all = (Array.isArray(a) ? a : []).concat(Array.isArray(b) ? b : []);
    var seen = {};
    return all.filter(function (r) { if (!r || seen[r.rid]) return false; seen[r.rid] = 1; return true; })
      .sort(function (x, y) { return y.submittedAt - x.submittedAt; });
  };
  T.getResult = function (rid) {
    var all = T.getResults();
    for (var i = 0; i < all.length; i++) if (all[i].rid === rid) return all[i];
    return null;
  };
  T.saveResult = function (r) {
    var list = U.store.get(RESULTS_KEY, []);
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (item) { return item.rid !== r.rid; });
    list.unshift(r);
    list = list.slice(0, MAX_RESULTS);
    if (U.store.set(RESULTS_KEY, list)) return true;
    // Local storage is blocked or full. Keep it for this tab only.
    return U.store.set(RESULTS_KEY, [r], "session");
  };

  /* Turns a finished attempt into a saved result and returns it. */
  T.finish = function (test, st, auto) {
    var existing = T.getResult(st.rid);
    if (existing) return existing;
    var now = auto ? Math.min(st.endAt, Date.now()) : Date.now();
    var s = T.score(test.questions, st.answers);
    var result = {
      rid: st.rid, delivery: "pending",
      testId: test.id, title: test.title, category: test.category,
      candidate: st.candidate || {},
      total: s.total, correct: s.correct, wrong: s.wrong, unanswered: s.unanswered, marks: s.marks, percent: s.percent,
      answers: st.answers.slice(),
      questions: test.questions.map(function (q) { return { q: q.q, o: q.o, a: q.a, e: q.e }; }),
      timeTaken: Math.min(Math.round((now - st.startedAt) / 1000), test.duration * 60),
      duration: test.duration, autoSubmitted: !!auto, submittedAt: now
    };
    var stored = T.saveResult(result);
    var queued = window.SujagResults.enqueue(result);
    if (stored && queued) T.clearFinishedProgress(test.id, st.rid);
    // Delivery or the exam page can still recover when device storage fills.
    result.deviceSaved = stored;
    result.queueSaved = queued;
    return result;
  };

  T.instructions = function (test) { return test.instructions || S.data.defaultInstructions || []; };

  /* ---------- Listing helpers ---------- */
  function catName(id) { var c = S.get.cat(id); return c ? c.name : id; }

  function filterTests(items, f) {
    return items.filter(function (t) {
      if (f.cat && t.category !== f.cat) return false;
      if (f.diff && t.difficulty !== f.diff) return false;
      if (f.kind && (t.kind || "mock") !== f.kind) return false;
      return U.matches(f.q, [t.title, t.description, catName(t.category), t.difficulty].join(" "));
    });
  }

  function renderList(el, countEl, items, emptyMsg) {
    countEl.textContent = items.length ? "Showing " + U.plural(items.length, "test") : "";
    el.innerHTML = items.length
      ? items.map(function (t, i) { return cards.test(t).replace("<article ", '<article style="--i:' + Math.min(i, 8) + '" '); }).join("")
      : cards.empty("No tests found", emptyMsg || "Try a different word or clear the filters.");
  }

  function difficulties() {
    var order = ["Easy", "Medium", "Hard"], seen = {};
    S.data.tests.forEach(function (t) { seen[t.difficulty] = 1; });
    return order.filter(function (d) { return seen[d]; });
  }

  /* ---------- mock-tests.html ---------- */
  function pageMockTests() {
    var cats = S.data.testCategories;
    $("#category-grid").innerHTML = cats.map(function (c, i) {
      return cards.category(c, i).replace('class="card', 'style="--i:' + Math.min(i, 8) + '" class="rise card');
    }).join("");

    var state = { q: U.qs("q") || "", cat: U.qs("cat") || "", diff: "", kind: U.qs("type") || "" };
    if (!S.get.cat(state.cat) || S.data.testGroups.some(function (g) { return g.id === state.cat; })) state.cat = "";
    var search = $("#t-search"), diff = $("#t-diff"), chips = $("#t-chips"), list = $("#t-list"), count = $("#t-count");
    var kind = $("#t-kind"); kind.value = state.kind; state.kind = kind.value;
    kind.addEventListener("change", function () { state.kind = kind.value; update(); });
    search.value = state.q;
    diff.innerHTML = '<option value="">All difficulties</option>' + difficulties().map(function (d) { return '<option>' + esc(d) + "</option>"; }).join("");

    function renderChips() {
      var withTests = cats.filter(function (c) { return S.data.tests.some(function (t) { return t.category === c.id; }); });
      chips.innerHTML = '<button type="button" class="chip" data-cat="" aria-pressed="' + (!state.cat) + '">All <span class="count">' + S.data.tests.length + "</span></button>" +
        withTests.map(function (c) {
          var n = S.data.tests.filter(function (t) { return t.category === c.id; }).length;
          return '<button type="button" class="chip" data-cat="' + esc(c.id) + '" aria-pressed="' + (state.cat === c.id) + '">' + esc(c.name) + ' <span class="count">' + n + "</span></button>";
        }).join("");
    }
    function update() { renderList(list, count, filterTests(S.data.tests, state)); }
    renderChips(); update();
    search.addEventListener("input", U.debounce(function () { state.q = search.value; update(); }, 120));
    diff.addEventListener("change", function () { state.diff = diff.value; update(); });
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      state.cat = b.getAttribute("data-cat"); renderChips(); update();
    });
    $("#t-clear").addEventListener("click", function () {
      state.q = ""; state.cat = ""; state.diff = ""; state.kind = ""; kind.value = ""; search.value = ""; diff.value = ""; renderChips(); update(); search.focus();
    });
  }

  /* ---------- test-category.html ---------- */
  function pageCategory() {
    var id = U.qs("cat"), c = S.get.cat(id), head = $("#cat-head"), main = $("#cat-main");
    if (!c) {
      S.setMeta({ title: "Category not found" });
      head.innerHTML = '<div class="container"><h1>Category not found</h1><p class="lead">That test category does not exist.</p></div>';
      main.innerHTML = '<div class="container">' + cards.empty("Nothing here", "Browse all categories from the mock tests page.") +
        '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="mock-tests.html">All mock tests</a></p></div>';
      return;
    }
    var items = S.testsIn(id);
    S.setMeta({ title: c.name + " Mock Tests", description: c.description + " Free online practice tests with instant results." });
    head.innerHTML = '<div class="container"><ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="mock-tests.html">Mock Tests</a></li><li aria-current="page">' + esc(c.name) + "</li></ol>" +
      '<span class="cat-hero-icon">' + icon(c.icon || "book", 28) + "</span><h1>" + esc(c.name) + "</h1><p class=\"lead\">" + esc(c.description) + "</p></div>";

    var state = { q: "", diff: "" };
    var search = $("#t-search"), diff = $("#t-diff"), list = $("#t-list"), count = $("#t-count");
    diff.innerHTML = '<option value="">All difficulties</option>' + difficulties().map(function (d) { return "<option>" + esc(d) + "</option>"; }).join("");
    function update() { renderList(list, count, filterTests(items, state), items.length ? "" : "Tests for this category are being prepared."); }
    update();
    if (!items.length) $("#t-toolbar").hidden = true;
    search.addEventListener("input", U.debounce(function () { state.q = search.value; update(); }, 120));
    diff.addEventListener("change", function () { state.diff = diff.value; update(); });

    var others = S.data.testCategories.filter(function (x) { return x.id !== id; });
    $("#other-cats").innerHTML = others.map(function (x) {
      return '<a class="chip" href="test-category.html?cat=' + encodeURIComponent(x.id) + '">' + esc(x.name) + "</a>";
    }).join("");
  }

  /* ---------- test-details.html ---------- */
  function validPhone(v) {
    if (!v) return true;
    if (!/^[0-9+\-\s()]+$/.test(v)) return false;
    var d = v.replace(/\D/g, "").length;
    return d >= 7 && d <= 15;
  }

  function pageDetails() {
    var id = U.qs("id"), test = S.get.test(id), head = $("#detail-head"), main = $("#detail-main"), side = $("#detail-side");
    if (!test) {
      S.setMeta({ title: "Test not found" });
      head.innerHTML = '<div class="container"><h1>Test not found</h1><p class="lead">We could not find that test. It may have been renamed or removed.</p></div>';
      $("#detail-layout").innerHTML = '<div>' + cards.empty("Nothing to show", "Pick another test from the list.") + '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="mock-tests.html">Browse mock tests</a></p></div>';
      return;
    }
    var c = S.get.cat(test.category), n = test.questions.length;
    S.setMeta({ title: test.title, description: test.description + " " + n + " questions, " + test.duration + " minutes. Free online mock test." });
    head.innerHTML = '<div class="container"><ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="mock-tests.html">Mock Tests</a></li>' +
      '<li><a href="test-category.html?cat=' + encodeURIComponent(test.category) + '">' + esc(c ? c.name : test.category) + '</a></li><li aria-current="page">Details</li></ol>' +
      '<div class="row" style="margin-bottom:12px"><span class="badge">' + esc(c ? c.name : "") + "</span>" + cards.diffBadge(test.difficulty) + '<span class="badge badge-free">Free</span></div>' +
      "<h1>" + esc(test.title) + '</h1><p class="lead">' + esc(test.description) + "</p></div>";

    main.innerHTML =
      '<section class="panel"><h2>Test overview</h2><ul class="key-facts">' +
      "<li><span>" + icon("book", 18) + "Category</span><span>" + esc(c ? c.name : "") + "</span></li>" +
      "<li><span>" + icon("list", 18) + "Questions</span><span>" + n + "</span></li>" +
      "<li><span>" + icon("clock", 18) + "Total time</span><span>" + test.duration + " minutes</span></li>" +
      "<li><span>" + icon("target", 18) + "Marking</span><span>1 mark each, no negative marking</span></li>" +
      "<li><span>" + icon("bar-chart", 18) + "Difficulty</span><span>" + esc(test.difficulty || "Not set") + "</span></li></ul></section>" +
      '<section class="panel"><h2>Instructions</h2><ol class="instructions">' + T.instructions(test).map(function (t) { return "<li><span>" + esc(t) + "</span></li>"; }).join("") + "</ol></section>" +
      '<div id="attempts"></div>';

    renderAttempts(test);
    renderStartBox(test, side);
  }

  function renderAttempts(test) {
    var rows = T.getResults().filter(function (r) { return r.testId === test.id; }).slice(0, 5);
    var host = $("#attempts");
    if (!rows.length) { host.innerHTML = ""; return; }
    host.innerHTML = '<section class="panel"><h2>Your previous attempts on this device</h2><div class="table-wrap"><table class="history-table"><thead><tr><th>Date</th><th>Score</th><th>Percentage</th><th><span class="visually-hidden">View</span></th></tr></thead><tbody>' +
      rows.map(function (r) {
        return "<tr><td>" + esc(U.fmtDate(r.submittedAt, true)) + "</td><td>" + r.marks + " / " + r.total + "</td><td>" + T.fmtPct(r.percent) + '%</td><td><a href="test-result.html?rid=' + encodeURIComponent(r.rid) + '">View result</a></td></tr>';
      }).join("") + '</tbody></table></div><p class="muted" style="margin:12px 0 0;font-size:.85rem">Clearing this browser removes your personal review history.</p></section>';
  }

  function renderStartBox(test, side) {
    var progress = T.getProgress(test);
    var retake = U.qs("retake"), prev = retake ? T.getResult(retake) : null;
    var cand = (prev && prev.candidate) || {};
    var showResume = !!progress;

    function formHtml() {
      return '<form id="start-form" novalidate><div class="field"><label for="cand-name">Candidate name <span class="req">(required)</span></label>' +
        '<input id="cand-name" name="name" type="text" maxlength="60" autocomplete="name" required value="' + esc(cand.name || "") + '"><span class="error">Please enter your name.</span></div>' +
        '<div class="field"><label for="cand-city">City <span class="req">(required)</span></label><input id="cand-city" name="city" type="text" maxlength="40" autocomplete="address-level2" required value="' + esc(cand.city || "") + '"><span class="error">Please enter your city.</span></div>' +
        '<div class="field" id="phone-field"><label for="cand-phone">Contact number <span class="opt">(optional)</span></label><input id="cand-phone" name="phone" type="tel" maxlength="20" autocomplete="tel" inputmode="tel" value="' + esc(cand.phone || "") + '" aria-describedby="phone-err">' +
        '<span class="error" id="phone-err">Enter a valid number using digits, spaces, + or -.</span></div>' +
        '<button type="submit" class="btn btn-primary btn-block">' + icon("play", 18) + " Start Test</button>" +
        '<p class="help muted" style="font-size:.8rem;margin:12px 0 0">When you submit, Sujag Education receives your name, city, score and any phone number you enter. The results PDF shows your name, city and score.</p></form>';
    }

    function paint() {
      if (showResume) {
        var left = Math.max(0, Math.round((progress.endAt - Date.now()) / 1000));
        var answered = progress.answers.filter(function (a) { return a !== null; }).length;
        side.innerHTML = '<div class="panel start-box"><h2>Test in progress</h2><p class="sub">' + answered + " of " + test.questions.length + " answered. " +
          (left > 0 ? "About " + Math.max(1, Math.ceil(left / 60)) + " minutes left." : "The time has run out. Open it to see your result.") + "</p>" +
          '<a class="btn btn-primary btn-block" href="take-test.html?id=' + encodeURIComponent(test.id) + '">' + icon("play", 18) + (left > 0 ? " Resume Test" : " Finish and see result") + "</a>" +
          '<button type="button" class="btn btn-ghost btn-block" id="restart" style="margin-top:10px">Discard and start again</button></div>';
        $("#restart").addEventListener("click", function () {
          S.ui.confirm({ title: "Discard this attempt?", message: "Your saved answers for this test will be removed and a new attempt will begin.", confirmText: "Discard", danger: true })
            .then(function (ok) { if (ok) { T.clearProgress(test.id); showResume = false; paint(); } });
        });
        return;
      }
      side.innerHTML = '<div class="panel start-box"><h2>Start this test</h2><p class="sub">' + test.questions.length + " questions &middot; " + test.duration + " minutes</p>" + formHtml() + "</div>";
      var form = $("#start-form");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var phone = form.phone.value.trim(), field = $("#phone-field");
        var okN = form.name.value.trim().length >= 2, okC = form.city.value.trim().length >= 2, ok = validPhone(phone);
        form.name.closest(".field").classList.toggle("has-error", !okN);
        form.city.closest(".field").classList.toggle("has-error", !okC);
        field.classList.toggle("has-error", !ok);
        if (!okN) { form.name.focus(); return; }
        if (!okC) { form.city.focus(); return; }
        if (!ok) { form.phone.focus(); return; }
        var st = T.startAttempt(test, { name: form.name.value.trim(), city: form.city.value.trim(), phone: phone });
        if (!st) {
          S.ui.alert({ title: "Browser storage is blocked", message: "This test saves your progress in your browser, but storage seems to be blocked or full. Allow site data for this page (or leave private browsing) and try again." });
          return;
        }
        window.location.href = "take-test.html?id=" + encodeURIComponent(test.id);
      });
    }
    paint();
  }

  U.ready(function () {
    var page = document.body.getAttribute("data-page");
    if (page === "mock-tests") pageMockTests();
    else if (page === "test-category") pageCategory();
    else if (page === "test-details") pageDetails();
  });
})();
