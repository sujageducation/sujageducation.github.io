/* ==========================================================================
   SUJAG Education - test-engine.js
   Runs the examination interface on take-test.html.
   - Progress (answers, current question, end time) is saved in the browser
     after every change, so a refresh does not lose anything.
   - The timer counts down to a fixed end time, so it stays correct after a
     refresh and cannot be extended by reloading.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, T = S.tests;
  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  U.ready(function () {
    var id = U.qs("id"), test = S.get.test(id);
    var root = $("#exam-root");
    if (!test) { fail("Test not found", "We could not find that test."); return; }
    var st = T.getProgress(test);
    if (!st) { window.location.replace("test-details.html?id=" + encodeURIComponent(id)); return; }

    var n = test.questions.length;
    var cur = Math.min(Math.max(0, st.current || 0), n - 1);
    var submitting = false, tick = null, lastShown = -1, warned = {};

    S.setMeta({ title: test.title + " - Test" });
    $("#exam-title").textContent = test.title;
    $("#exam-sub").textContent = (S.get.cat(test.category) || {}).name + " | " + n + " questions";

    var els = {
      body: $("#q-body"), num: $("#q-num"), answered: $("#answered-count"), bar: $("#progress-bar"), barWrap: $("#progress-wrap"),
      prev: $("#prev"), next: $("#next"), clear: $("#clear"), timer: $("#timer"), timerText: $("#timer-text"),
      grid: $("#q-grid"), panel: $("#nav-panel"), backdrop: $("#sheet-backdrop"), openSheet: $("#open-sheet"), sub: $("#nav-sub")
    };

    function fail(title, msg) {
      document.querySelector("main").innerHTML = '<div class="container" style="padding-block:60px">' + S.cards.empty(title, msg) +
        '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="mock-tests.html">Browse mock tests</a></p></div>';
      $("#exam-title").textContent = title;
    }

    function save() { st.current = cur; U.store.set(T.progressKey(test.id), st); }
    function answeredCount() { return st.answers.filter(function (a) { return a !== null; }).length; }
    function remaining() { return Math.max(0, Math.ceil((st.endAt - Date.now()) / 1000)); }

    /* ----- Navigator grid ----- */
    function buildGrid() {
      els.grid.innerHTML = test.questions.map(function (q, i) {
        return '<button type="button" class="q-dot" data-i="' + i + '" aria-label="Question ' + (i + 1) + '"><span aria-hidden="true">' + (i + 1) + "</span></button>";
      }).join("");
    }
    function paintGrid() {
      var dots = els.grid.children;
      for (var i = 0; i < dots.length; i++) {
        var a = st.answers[i] !== null, c = i === cur;
        dots[i].classList.toggle("is-answered", a);
        dots[i].classList.toggle("is-current", c);
        dots[i].setAttribute("aria-label", "Question " + (i + 1) + ", " + (a ? "answered" : "not answered") + (c ? ", current question" : ""));
        if (c) dots[i].setAttribute("aria-current", "step"); else dots[i].removeAttribute("aria-current");
      }
      var done = answeredCount();
      els.sub.textContent = done + " answered, " + (n - done) + " not answered";
      els.answered.textContent = done + " of " + n + " answered";
      var pct = Math.round((done / n) * 100);
      els.bar.style.width = pct + "%";
      els.barWrap.setAttribute("aria-valuenow", String(pct));
    }

    /* ----- Question view ----- */
    function render(dir) {
      var q = test.questions[cur];
      els.num.textContent = "Question " + (cur + 1) + " of " + n;
      els.body.innerHTML =
        '<h1 class="q-text" id="q-text" tabindex="-1">' + esc(q.q) + "</h1>" +
        '<fieldset class="options"><legend class="visually-hidden">Choose one answer for question ' + (cur + 1) + "</legend>" +
        q.o.map(function (o, i) {
          var sel = st.answers[cur] === i;
          return '<label class="opt' + (sel ? " is-selected" : "") + '"><input type="radio" name="answer" value="' + i + '"' + (sel ? " checked" : "") + ">" +
            '<span class="opt-key" aria-hidden="true">' + LETTERS[i] + '</span><span class="opt-text">' + esc(o) + "</span></label>";
        }).join("") + "</fieldset>";
      els.body.classList.remove("in-next", "in-prev");
      if (dir) { void els.body.offsetWidth; els.body.classList.add(dir > 0 ? "in-next" : "in-prev"); }
      els.prev.disabled = cur === 0;
      els.next.disabled = cur === n - 1;
      els.clear.hidden = st.answers[cur] === null;
      paintGrid();
    }

    function go(i, focusQuestion) {
      if (i < 0 || i >= n || i === cur) { if (focusQuestion) $("#q-text").focus(); return; }
      var dir = i > cur ? 1 : -1;
      cur = i; save(); render(dir);
      if (focusQuestion) $("#q-text").focus({ preventScroll: true });
      if (window.innerWidth <= 960 && !els.panel.classList.contains("is-open")) window.scrollTo({ top: 0 });
    }

    els.body.addEventListener("change", function (e) {
      if (e.target.name !== "answer") return;
      st.answers[cur] = parseInt(e.target.value, 10);
      save();
      Array.prototype.forEach.call(els.body.querySelectorAll(".opt"), function (l) { l.classList.toggle("is-selected", l.querySelector("input").checked); });
      els.clear.hidden = false;
      paintGrid();
    });
    els.clear.addEventListener("click", function () {
      st.answers[cur] = null; save(); render(0);
      var first = els.body.querySelector("input"); if (first) first.focus();
    });
    els.prev.addEventListener("click", function () { go(cur - 1, true); });
    els.next.addEventListener("click", function () { go(cur + 1, true); });
    els.grid.addEventListener("click", function (e) {
      var b = e.target.closest(".q-dot"); if (!b) return;
      go(parseInt(b.getAttribute("data-i"), 10), true);
      closeSheet(false);
    });

    /* ----- Mobile question sheet ----- */
    function isSheet() { return window.innerWidth <= 960; }
    function openSheetFn() {
      els.panel.classList.add("is-open"); els.backdrop.classList.add("is-open");
      els.openSheet.setAttribute("aria-expanded", "true");
      var c = $("#sheet-close"); if (c) c.focus();
    }
    function closeSheet(restoreFocus) {
      els.panel.classList.remove("is-open"); els.backdrop.classList.remove("is-open");
      els.openSheet.setAttribute("aria-expanded", "false");
      if (restoreFocus) els.openSheet.focus();
    }
    els.openSheet.addEventListener("click", openSheetFn);
    els.backdrop.addEventListener("click", function () { closeSheet(true); });
    $("#sheet-close").addEventListener("click", function () { closeSheet(true); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.panel.classList.contains("is-open") && isSheet()) closeSheet(true);
    });

    /* ----- Timer ----- */
    function fmt(sec) {
      var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
      var mm = (h ? String(m).padStart(2, "0") : String(m).padStart(2, "0")), ss = String(s).padStart(2, "0");
      return (h ? h + ":" : "") + mm + ":" + ss;
    }
    function updateTimer() {
      var left = remaining();
      if (left !== lastShown) {
        lastShown = left;
        els.timerText.textContent = fmt(left);
        var total = test.duration * 60;
        els.timer.classList.toggle("is-critical", left <= 60);
        els.timer.classList.toggle("is-warning", left > 60 && left <= Math.min(300, total * 0.25));
        if (left === 300 && total > 600 && !warned[300]) { warned[300] = 1; S.ui.toast("5 minutes remaining"); }
        if (left === 60 && total > 120 && !warned[60]) { warned[60] = 1; S.ui.toast("1 minute remaining"); }
      }
      if (left <= 0 && !submitting) submit(true);
    }

    /* ----- Submit ----- */
    function submit(auto) {
      if (submitting) return;
      submitting = true;
      clearInterval(tick);
      window.removeEventListener("beforeunload", warnLeave);
      $("#submit-top").disabled = true;
      var result = T.finish(test, st, auto);
      var go = function () { window.location.replace("test-result.html?rid=" + encodeURIComponent(result.rid)); };
      if (auto) {
        S.ui.modal({
          title: "Time is up", message: "Your test was submitted automatically. Opening your result now.", dismissible: false,
          actions: [{ label: "View result", value: true, variant: "btn-primary" }]
        }).then(go);
        setTimeout(go, 2500);
      } else go();
    }

    function askSubmit() {
      if (submitting) return;
      var done = answeredCount(), left = n - done, rem = remaining();
      var html = "<p>You are about to submit <strong>" + esc(test.title) + "</strong>. You cannot change your answers after this.</p>" +
        '<ul class="key-facts" style="margin-top:8px"><li><span>Answered</span><span>' + done + "</span></li><li><span>Not answered</span><span>" + left + "</span></li><li><span>Time left</span><span>" + fmt(rem) + "</span></li></ul>" +
        (left ? '<p style="margin:14px 0 0;color:var(--warn);font-weight:600">' + U.plural(left, "question") + (left === 1 ? " is" : " are") + " still unanswered.</p>" : "");
      S.ui.modal({
        title: "Submit your test?", html: html, dismissValue: false,
        actions: [{ label: "Keep working", value: false, variant: "btn-ghost" }, { label: "Submit Test", value: true, variant: "btn-primary" }]
      }).then(function (ok) { if (ok) submit(false); });
    }
    $("#submit-top").addEventListener("click", askSubmit);
    $("#submit-panel").addEventListener("click", function () { closeSheet(false); askSubmit(); });

    function warnLeave(e) { if (!submitting && answeredCount() > 0) { e.preventDefault(); e.returnValue = ""; } }
    window.addEventListener("beforeunload", warnLeave);

    /* ----- Start ----- */
    buildGrid();
    render(0);
    if (remaining() <= 0) { submit(true); return; }
    updateTimer();
    tick = setInterval(updateTimer, 500);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) updateTimer(); });
  });
})();
