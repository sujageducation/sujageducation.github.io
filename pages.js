/* ==========================================================================
   SUJAG Education - pages.js
   Fills editable page text from data-pages.js (edited in the admin panel).
   The HTML files already contain the same text as a fallback, so the pages
   still read correctly if this script cannot run.

   Markers used in the HTML:
     data-page-text="home.heroLead"   sets the element's text
     data-page-body="about.body"      renders simple markup (see markup() below)
     data-faq                         renders the FAQ accordion from pages.faq
   Markup: "## Heading", "### Subheading", "- list item", blank line = new paragraph,
   [link text](page.html or https://...) and **bold**.
   ========================================================================== */
(function () {
  "use strict";
  var S = (window.SUJAG = window.SUJAG || {});
  var U = S.util || {};
  var P = (S.pages = S.pages || {});

  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function inline(t) {
    t = esc(t);
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, text, url) {
      url = url.replace(/&amp;/g, "&");
      if (!/^(https?:\/\/|mailto:|#|[\w\-.\/?=&%]+\.html(\?[^\s]*)?$)/i.test(url)) return m;
      var ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + esc(url) + '"' + ext + ">" + text + "</a>";
    });
    return t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  /* Safe markup to HTML: everything is escaped first, then a few patterns are turned into tags. */
  P.markup = function (src) {
    var out = [];
    String(src || "").replace(/\r\n/g, "\n").trim().split(/\n\s*\n/).forEach(function (block) {
      var lines = block.split("\n").filter(function (l) { return l.trim() !== ""; });
      var i = 0;
      while (i < lines.length) {
        var l = lines[i].replace(/\s+$/, "");
        if (l.indexOf("### ") === 0) { out.push("<h3>" + inline(l.slice(4)) + "</h3>"); i++; }
        else if (l.indexOf("## ") === 0) { out.push("<h2>" + inline(l.slice(3)) + "</h2>"); i++; }
        else if (l.indexOf("- ") === 0) {
          var items = [];
          while (i < lines.length && lines[i].indexOf("- ") === 0) { items.push("<li>" + inline(lines[i].slice(2).trim()) + "</li>"); i++; }
          out.push("<ul>" + items.join("") + "</ul>");
        } else {
          var para = [];
          while (i < lines.length && !/^(#{2,3} |- )/.test(lines[i])) { para.push(lines[i].trim()); i++; }
          out.push("<p>" + inline(para.join(" ")) + "</p>");
        }
      }
    });
    return out.join("");
  };

  P.get = function (path) {
    var v = (S.data || {}).pages;
    String(path).split(".").forEach(function (k) { v = v == null ? v : v[k]; });
    return v;
  };

  P.faqHtml = function (items) {
    return items.map(function (f, i) {
      return '<div class="acc-item"><h3 style="margin:0"><button type="button" class="acc-trigger" id="faq-q' + i + '" aria-expanded="false" aria-controls="faq-a' + i + '">' + esc(f.q) +
        '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></button></h3>' +
        '<div class="acc-panel" id="faq-a' + i + '" role="region" aria-labelledby="faq-q' + i + '"><div><p>' + esc(f.a) + "</p></div></div></div>";
    }).join("");
  };

  P.apply = function () {
    if (!S.data || !S.data.pages) return;
    var nodes = document.querySelectorAll("[data-page-text]"), i, v;
    for (i = 0; i < nodes.length; i++) { v = P.get(nodes[i].getAttribute("data-page-text")); if (typeof v === "string" && v) nodes[i].textContent = v; }
    nodes = document.querySelectorAll("[data-page-body]");
    for (i = 0; i < nodes.length; i++) { v = P.get(nodes[i].getAttribute("data-page-body")); if (typeof v === "string" && v) nodes[i].innerHTML = P.markup(v); }
    var faq = document.querySelector("[data-faq]"), items = S.data.pages.faq;
    if (faq && Array.isArray(items) && items.length) {
      faq.innerHTML = P.faqHtml(items);
      if (S.initAccordions) S.initAccordions();
      var ld = document.querySelector('script[type="application/ld+json"]');
      if (ld) {
        try {
          var o = JSON.parse(ld.textContent);
          if (o["@type"] === "FAQPage") {
            o.mainEntity = items.map(function (f) { return { "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }; });
            ld.textContent = JSON.stringify(o);
          }
        } catch (e) { /* keep the static version */ }
      }
    }
  };

  if (U.ready) U.ready(P.apply);
})();
