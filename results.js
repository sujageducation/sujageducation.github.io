/* ==========================================================================
   SUJAG Education - results.js
   Renders test-result.html: score summary, answer review, retake link, and
   (when no result is selected) the list of results saved on this device.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon, T = S.tests;
  var LETTERS = ["A", "B", "C", "D", "E", "F"];
  var CIRC = 440;

  function summaryText(p) {
    if (p >= 80) return "Excellent result. You have a strong grasp of this topic. Review the few questions you missed and keep practising to stay sharp.";
    if (p >= 60) return "Good result. You know most of this material. Check the review below to fix the gaps and try again for a higher score.";
    if (p >= 40) return "A fair start. You have some of the basics. Read the explanations below, revise the related notes and take the test again.";
    return "This topic needs more practice. Go through each explanation below, study the related notes and retake the test when you are ready.";
  }

  function emptyState(title, text) {
    $("#result-head").hidden = true;
    $("#result-main").innerHTML = '<div class="container">' + S.cards.empty(title, text) +
      '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="mock-tests.html">Browse mock tests</a></p></div>';
  }

  function historyPage() {
    S.setMeta({ title: "Your Results", description: "Test results saved in this browser." });
    var all = T.getResults();
    $("#result-head").innerHTML = '<div class="container"><h1>Your results</h1><p class="lead">Results saved on this device. Online collection requires a shared service.</p></div>';
    if (!all.length) { $("#result-main").innerHTML = '<div class="container">' + S.cards.empty("No results yet", "Finish a mock test and your result will appear here.") +
      '<p style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="mock-tests.html">Browse mock tests</a></p></div>'; return; }
    $("#result-main").innerHTML = '<div class="container"><div class="panel"><div class="table-wrap"><table class="history-table"><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>%</th><th><span class="visually-hidden">View</span></th></tr></thead><tbody>' +
      all.map(function (r) {
        return "<tr><td>" + esc(r.title) + "</td><td>" + esc(U.fmtDate(r.submittedAt, true)) + "</td><td>" + r.marks + " / " + r.total + "</td><td>" + T.fmtPct(r.percent) +
          '</td><td><a href="test-result.html?rid=' + encodeURIComponent(r.rid) + '">View</a></td></tr>';
      }).join("") + '</tbody></table></div></div>' +
      '<div class="row" style="margin-top:18px"><button type="button" class="btn btn-ghost" id="clear-all">' + icon("trash", 18) + " Clear saved results</button></div></div>";
    $("#clear-all").addEventListener("click", function () {
      S.ui.confirm({ title: "Clear all saved results?", message: "This removes every result stored in this browser. It cannot be undone.", confirmText: "Clear results", danger: true })
        .then(function (ok) {
          if (!ok) return;
          U.store.remove("sujag:results"); U.store.remove("sujag:results", "session");
          historyPage(); S.ui.toast("Saved results cleared");
        });
    });
  }

  function reviewItem(q, i, a) {
    var state = a === null || a === undefined ? "skip" : a === q.a ? "ok" : "bad";
    var label = state === "ok" ? "Correct" : state === "bad" ? "Incorrect" : "Not answered";
    var badge = state === "ok" ? "badge-easy" : state === "bad" ? "badge-hard" : "badge-neutral";
    return '<article class="review-item r-' + state + '" data-state="' + state + '"><div class="review-q"><h3><small>Q' + (i + 1) + ".</small>" + esc(q.q) + '</h3><span class="badge ' + badge + '">' + label + "</span></div>" +
      '<ul class="r-opts">' + q.o.map(function (o, k) {
        var cls = k === q.a ? " is-correct" : k === a ? " is-wrong" : "";
        var tag = k === q.a ? '<span class="tag">' + icon("check-circle", 16) + "<span>Correct answer</span></span>" : (k === a ? '<span class="tag">' + icon("x-circle", 16) + "<span>Your answer</span></span>" : "");
        if (k === q.a && k === a) tag = '<span class="tag">' + icon("check-circle", 16) + "<span>Your answer, correct</span></span>";
        return '<li class="r-opt' + cls + '"><span class="opt-key">' + LETTERS[k] + "</span><span>" + esc(o) + "</span>" + tag + "</li>";
      }).join("") + "</ul>" +
      (q.e ? '<div class="explain"><strong>Explanation: </strong>' + esc(q.e) + "</div>" : "") + "</article>";
  }

  function resultPage(r) {
    var test = S.get.test(r.testId), cat = S.get.cat(r.category);
    S.setMeta({ title: "Result: " + r.title });
    var cls = r.percent < 40 ? " is-fail" : r.percent < 60 ? " is-low" : "";
    var who = [r.candidate && r.candidate.name, r.candidate && r.candidate.city].filter(Boolean).join(", ");
    $("#result-head").hidden = false;
    $("#result-head").innerHTML = '<div class="container"><ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="mock-tests.html">Mock Tests</a></li><li aria-current="page">Result</li></ol>' +
      '<div class="result-hero"><div class="ring' + cls + '" id="ring" role="img" aria-label="Score ' + T.fmtPct(r.percent) + ' percent"><svg viewBox="0 0 160 160" aria-hidden="true"><circle class="track" cx="80" cy="80" r="70"/><circle class="value" cx="80" cy="80" r="70"/></svg>' +
      '<div class="ring-label"><strong>' + T.fmtPct(r.percent) + "%</strong><span>Score</span></div></div>" +
      '<div class="result-info"><h1>' + esc(r.title) + "</h1>" +
      '<p class="who">' + (who ? "Candidate: " + esc(who) + " &middot; " : "") + esc(cat ? cat.name : "") + " &middot; " + esc(U.fmtDate(r.submittedAt, true)) + (r.autoSubmitted ? " &middot; Submitted automatically when time ended" : "") + "</p>" +
      '<p class="summary">' + esc(summaryText(r.percent)) + '</p><div class="row">' +
      '<button type="button" class="btn btn-ghost" id="print-result">Save PDF</button><button type="button" class="btn btn-primary" id="show-review">' + icon("eye", 18) + " Review Answers</button>" +
      '<a class="btn btn-glass" href="test-details.html?id=' + encodeURIComponent(r.testId) + "&retake=" + encodeURIComponent(r.rid) + '">' + icon("refresh", 18) + " Retake Test</a></div></div></div></div>";

    var pct = function (x) { return r.total ? (x / r.total) * 100 : 0; };
    var timeLeft = r.duration * 60 - r.timeTaken;
    $("#result-main").innerHTML = '<div class="container">' +
      '<section aria-labelledby="sum-h"><h2 class="visually-hidden" id="sum-h">Score summary</h2><div class="stat-grid">' +
      '<div class="stat"><span>Total questions</span><strong>' + r.total + "</strong></div>" +
      '<div class="stat is-ok"><span>Correct</span><strong>' + r.correct + "</strong></div>" +
      '<div class="stat is-bad"><span>Incorrect</span><strong>' + r.wrong + "</strong></div>" +
      '<div class="stat"><span>Unanswered</span><strong>' + r.unanswered + "</strong></div>" +
      '<div class="stat"><span>Obtained marks</span><strong>' + r.marks + " / " + r.total + "</strong></div>" +
      '<div class="stat"><span>Time taken</span><strong style="font-size:1.25rem">' + esc(U.fmtDuration(r.timeTaken)) + "</strong></div></div>" +
      '<div class="split-bar" role="img" aria-label="' + r.correct + " correct, " + r.wrong + " incorrect, " + r.unanswered + ' unanswered"><span class="s-ok" data-w="' + pct(r.correct) + '"></span><span class="s-bad" data-w="' + pct(r.wrong) + '"></span><span class="s-skip" data-w="' + pct(r.unanswered) + '"></span></div>' +
      '<div class="split-legend"><span><i style="background:var(--accent)"></i>Correct</span><span><i style="background:#d9695f"></i>Incorrect</span><span><i style="background:#c5ccc8"></i>Unanswered</span></div></section>' +
      '<section id="review" class="section-sm" hidden aria-labelledby="rev-h"><div class="review-head"><h2 id="rev-h" style="margin:0">Review answers</h2>' +
      '<div class="filter-row" style="margin:0" id="rev-filter"><button class="chip" type="button" data-f="all" aria-pressed="true">All</button><button class="chip" type="button" data-f="ok" aria-pressed="false">Correct</button><button class="chip" type="button" data-f="bad" aria-pressed="false">Incorrect</button><button class="chip" type="button" data-f="skip" aria-pressed="false">Unanswered</button></div></div>' +
      '<div class="review-list" id="rev-list">' + r.questions.map(function (q, i) { return reviewItem(q, i, r.answers[i]); }).join("") + "</div></section>" +
      '<section class="section-sm" id="next-steps"></section>' +
      '<div class="notice"><span>' + icon("info", 18) + "</span><p>This result is saved only in this browser on this device. It is not uploaded anywhere, and clearing your browser data will remove it.</p></div></div>";

    // Animate ring and bar once on load
    requestAnimationFrame(function () {
      $("#ring .value").style.strokeDashoffset = String(CIRC * (1 - r.percent / 100));
      U.$$(".split-bar span").forEach(function (s) { s.style.width = s.getAttribute("data-w") + "%"; });
    });

    var review = $("#review"), btn = $("#show-review");
    var printBtn=$("#print-result"); if(printBtn) printBtn.addEventListener("click",function(){window.print();});
    btn.addEventListener("click", function () {
      var open = review.hidden;
      review.hidden = !open;
      btn.innerHTML = icon("eye", 18) + (open ? " Hide Review" : " Review Answers");
      btn.setAttribute("aria-expanded", String(open));
      if (open) review.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "review");
    $("#rev-filter").addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]"); if (!b) return;
      var f = b.getAttribute("data-f");
      U.$$("#rev-filter .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      U.$$("#rev-list .review-item").forEach(function (it) { it.hidden = !(f === "all" || it.getAttribute("data-state") === f); });
    });

    // Next steps: other attempts and related tests
    var others = T.getResults().filter(function (x) { return x.testId === r.testId; }).slice(0, 5);
    var more = S.data.tests.filter(function (t) { return t.id !== r.testId; })
      .sort(function (a, b) { return (b.category === r.category) - (a.category === r.category); }).slice(0, 3);
    $("#next-steps").innerHTML =
      (others.length > 1 ? '<h2>Your attempts on this test</h2><div class="panel"><div class="table-wrap"><table class="history-table"><thead><tr><th>Date</th><th>Score</th><th>%</th></tr></thead><tbody>' +
        others.map(function (x) { return '<tr class="' + (x.rid === r.rid ? "is-current" : "") + '"><td>' + esc(U.fmtDate(x.submittedAt, true)) + "</td><td>" + x.marks + " / " + x.total + "</td><td>" + T.fmtPct(x.percent) + "%</td></tr>"; }).join("") + "</tbody></table></div></div>" : "") +
      '<div class="section-head" style="margin-top:36px"><h2>Keep practising</h2><a class="link-arrow" href="mock-tests.html">All mock tests ' + icon("arrow-right", 18) + '</a></div><div class="grid">' + more.map(S.cards.test).join("") + "</div>";
    if (!test) $("#next-steps").insertAdjacentHTML("afterbegin", '<div class="notice notice-warn" style="margin-bottom:20px"><span>' + icon("alert", 18) + "</span><p>This test is no longer in the catalogue, so Retake is unavailable. Your saved review above is still complete.</p></div>");
  }

  U.ready(function () {
    var rid = U.qs("rid");
    if (!rid) { historyPage(); return; }
    var r = T.getResult(rid);
    if (!r) { S.setMeta({ title: "Result not found" }); emptyState("Result not found", "This result is not saved in this browser. It may have been cleared, or it was taken on another device."); return; }
    resultPage(r);
  });
})();
