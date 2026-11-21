/* ==========================================================================
   SUJAG Education - admin-parser.js
   Detects multiple-choice questions in plain text (typed, pasted, from a TXT
   file, or text extracted from a PDF) and turns them into the question format
   used by the mock tests: { q, o: [options], a: correctIndex, e: explanation }.

   Formats it understands (mix and match):
     1. Question text?            Q1. / Q.1 / Question 1: / 1) / 1-
     A. Option   (A) Option   a) Option   or all options on one line
     Answer: B   Ans: b   Correct Answer: (B) Indus   Answer: Indus
     Explanation: why   Reason: why   Solution: why
     An answer key at the end:  "Answers"  then  "1-B 2-C 3-A"  or  "1. B"
     Marking the right option with * or (correct) or a tick mark
   Anything it cannot find is reported as a warning so you can fix it in the preview.
   ========================================================================== */
(function (root) {
  "use strict";
  var LETTERS = "ABCDEF";

  function clean(text) {
    return String(text || "")
      .replace(/\r/g, "")
      .replace(/­/g, "")
      .replace(/[   ]/g, " ")
      .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl")
      .replace(/[ \t]+/g, " ");
  }
  function sp(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

  var PAIR = /(\d{1,3})\s*[\.\-–—:\)]*\s*\(?([A-Fa-f])\)?(?=\s|,|;|$)/g;
  function isKeyLine(l) {
    var rest = l.replace(PAIR, "").replace(/[\s,;]+/g, "");
    return rest === "" && /\d/.test(l);
  }
  function keyPairs(l, map) {
    var m; PAIR.lastIndex = 0;
    while ((m = PAIR.exec(l))) map[parseInt(m[1], 10)] = m[2].toUpperCase().charCodeAt(0) - 65;
  }

  /* Finds an answer key (a block of "1-B 2-C ..." lines, usually at the end) and removes it from the lines. */
  function extractKey(lines) {
    var map = {}, count = 0, start = -1, i;
    for (i = 0; i < lines.length; i++) {
      if (/^(?:answer\s*keys?|answers?|keys?|solutions?|answer\s*sheet)\s*[:\-]?$/i.test(lines[i])) {
        var j = i + 1, n = 0;
        while (j < lines.length && isKeyLine(lines[j])) { n += (lines[j].match(PAIR) || []).length; j++; }
        if (n >= 3) { start = i; break; }
      }
    }
    if (start === -1) { // trailing block of key-only lines, no header
      var e = lines.length, k = e;
      while (k > 0 && isKeyLine(lines[k - 1])) k--;
      var total = 0; for (i = k; i < e; i++) total += (lines[i].match(PAIR) || []).length;
      if (e - k >= 1 && total >= 5) start = k;
    }
    if (start === -1) return { lines: lines, map: map, found: false };
    var kept = lines.slice(0, start), rest = lines.slice(start);
    rest.forEach(function (l) { if (isKeyLine(l)) { keyPairs(l, map); count++; } else if (!/^(?:answer|key|solution)/i.test(l)) kept.push(l); });
    return { lines: kept, map: map, found: count > 0 };
  }

  var RE_ANS = /^(?:the\s+)?(?:correct\s+)?(?:answer|ans|key)\s*(?:is)?\s*[:\-\.=]?\s*\(?([A-Fa-f])\)?(?:[\.\):,]|\s|$)\s*(.*)$/i;
  var RE_ANS_TEXT = /^(?:the\s+)?(?:correct\s+)?(?:answer|ans)\s*(?:is)?\s*[:\-=]\s*(.+)$/i;
  var RE_EXP = /^(?:explanation|expl?|reason|rationale|solution|note)\s*[:\-]\s*(.*)$/i;
  var RE_QSTART = /^(?:(?:q(?:uestion)?\s*\.?\s*)(\d{1,3})\s*[\.\):\-]?|(\d{1,3})\s*[\.\):\-])\s*(\S.*)$/i;
  function qstart(line) { var m = RE_QSTART.exec(line); return m ? { num: parseInt(m[1] || m[2], 10), text: m[3] } : null; }
  var RE_INLINE_ANS = /\s(?:answer|ans)\s*[:\-=]\s*\(?([A-Fa-f])\)?\s*$/i;
  var RE_OPT = /^\(?([A-Fa-f])[\.\):\]]\s*(.*)$/;
  var RE_OPT_NUM = /^\(([1-6])\)\s*(.*)$/;
  var TICK = /(\*+|\(correct\)|\[correct\]|[✓✔√])\s*$/i;

  function splitInline(first, nextIdx) {
    // "Lahore B) Karachi C) Islamabad" -> ["Lahore", "Karachi", "Islamabad"]
    var parts = [], rest = first, idx = nextIdx;
    for (;;) {
      var re = new RegExp("\\s\\(?" + LETTERS[idx] + "[\\.\\)]\\s+(?=\\S)", "i");
      var m = re.exec(rest);
      if (!m) break;
      parts.push(rest.slice(0, m.index));
      rest = rest.slice(m.index + m[0].length);
      idx++;
      if (idx > 5) break;
    }
    parts.push(rest);
    return parts;
  }

  function parse(raw) {
    var lines = clean(raw).split("\n").map(function (l) { return l.trim(); }).filter(function (l) {
      return l && !/^(?:page\s*\d+(?:\s*of\s*\d+)?|-\s*\d+\s*-)$/i.test(l);
    });
    var kx = extractKey(lines);
    lines = kx.lines;

    var qs = [], cur = null, mode = "q", ignored = 0;
    function push() { if (cur) { qs.push(cur); cur = null; } }
    function begin(num, text) {
      push();
      cur = { num: num, q: sp(text), o: [], a: null, aText: null, e: "", marked: null, warnings: [] };
      mode = "q";
      // options written on the same line as the question
      var m = /\s\(?[Aa][\.\)]\s+\S/.exec(cur.q);
      if (m && /\s\(?[Bb][\.\)]\s+\S/.test(cur.q.slice(m.index))) {
        var qpart = cur.q.slice(0, m.index), optpart = cur.q.slice(m.index).replace(/^\s*\(?[Aa][\.\)]\s+/, "");
        cur.q = sp(qpart);
        splitInline(optpart, 1).forEach(addOpt);
        mode = "opt";
      }
    }
    function addOpt(text) {
      var t = sp(text), hit = false, ia = RE_INLINE_ANS.exec(t);
      if (ia) { cur.a = ia[1].toUpperCase().charCodeAt(0) - 65; t = sp(t.replace(RE_INLINE_ANS, "")); }
      if (TICK.test(t)) { t = sp(t.replace(TICK, "")); hit = true; }
      cur.o.push(t);
      if (hit) cur.marked = cur.o.length - 1;
      mode = "opt";
    }

    lines.forEach(function (line) {
      var m;
      if (cur && (m = RE_EXP.exec(line))) { cur.e = sp(m[1]); mode = "exp"; return; }
      if (cur && cur.o.length >= 2 && (m = RE_ANS.exec(line))) {
        cur.a = m[1].toUpperCase().charCodeAt(0) - 65;
        if (sp(m[2]) && !RE_EXP.test(m[2])) cur.aText = null;
        mode = "ans"; return;
      }
      if (cur && cur.o.length >= 2 && (m = RE_ANS_TEXT.exec(line))) { cur.aText = sp(m[1]); mode = "ans"; return; }
      var qs0 = qstart(line);
      if (cur && qs0 && (cur.o.length >= 2 || qs0.num === (cur.num || 0) + 1) && !(cur.o.length === 0 && RE_OPT.test(line))) {
        begin(qs0.num, qs0.text); return;
      }
      if (!cur && qs0) { begin(qs0.num, qs0.text); return; }
      if (cur) {
        var o = RE_OPT.exec(line), idx;
        if (o && o[1].toUpperCase().charCodeAt(0) - 65 === cur.o.length && cur.o.length < 6) {
          splitInline(o[2], cur.o.length + 1).forEach(addOpt); return;
        }
        o = RE_OPT_NUM.exec(line);
        if (o && parseInt(o[1], 10) - 1 === cur.o.length) { addOpt(o[2]); return; }
        if (mode === "exp") { cur.e = sp(cur.e + " " + line); return; }
        if (mode === "ans") { ignored++; return; }
        if (cur.o.length) { cur.o[cur.o.length - 1] = sp(cur.o[cur.o.length - 1] + " " + line); return; }
        cur.q = sp(cur.q + " " + line); return;
      }
      ignored++;
    });
    push();

    var out = [], dropped = 0, seq = 0;
    qs.forEach(function (c) {
      if (c.o.length < 2) { dropped++; return; }
      seq++;
      var warn = [];
      var a = c.a;
      if (a === null && c.marked !== null) a = c.marked;
      if (a === null && c.aText) {
        var t = c.aText.toLowerCase().replace(/[\s\.]+$/, "");
        for (var i = 0; i < c.o.length; i++) { var ot = c.o[i].toLowerCase().replace(/[\s\.]+$/, ""); if (ot === t || ot.indexOf(t) === 0 || t.indexOf(ot) === 0) { a = i; break; } }
      }
      if (a === null && kx.found) {
        if (c.num != null && kx.map[c.num] !== undefined) a = kx.map[c.num];
        else if (kx.map[seq] !== undefined) a = kx.map[seq];
      }
      if (a !== null && (a < 0 || a >= c.o.length)) { warn.push("The answer letter does not match any option."); a = null; }
      if (a === null) warn.push("No correct answer found. Choose it below.");
      var seen = {}; c.o.forEach(function (x) { var k = x.toLowerCase(); if (seen[k]) warn.push("Two options are identical."); seen[k] = 1; });
      if (c.o.some(function (x) { return !x; })) warn.push("An option is empty.");
      if (c.q.length < 8) warn.push("The question text is very short.");
      out.push({ num: c.num, q: c.q, o: c.o, a: a, e: c.e, warnings: warn });
    });
    return {
      questions: out,
      stats: {
        found: out.length, withAnswer: out.filter(function (x) { return x.a !== null; }).length,
        missingAnswer: out.filter(function (x) { return x.a === null; }).length, keyFound: kx.found, skipped: dropped
      }
    };
  }

  var api = { parse: parse };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SUJAG = root.SUJAG || {};
  root.SUJAG.parser = api;
})(typeof window !== "undefined" ? window : this);
