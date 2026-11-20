/* ==========================================================================
   SUJAG Education - contact.js
   Validation and sending for contact.html.
   A static site has no server, so the form only sends a message when
   contactEndpoint in data-site.js points to a form service (for example
   Formspree). Otherwise it says clearly that nothing was sent.
   ========================================================================== */
(function () {
  "use strict";
  var S = window.SUJAG, U = S.util, $ = U.$, esc = U.esc, icon = S.icon;

  U.ready(function () {
    var form = $("#contact-form"); if (!form) return;
    var site = S.site;

    // Contact details (placeholders until filled in data-site.js)
    var wa = (site.whatsapp || "").replace(/\D/g, "");
    $("#c-email").innerHTML = site.email ? '<a href="mailto:' + esc(site.email) + '">' + esc(site.email) + "</a>" : '<span class="muted">Email address coming soon</span>';
    $("#c-whatsapp").innerHTML = wa ? '<a href="https://wa.me/' + wa + '" target="_blank" rel="noopener">Chat on WhatsApp</a>' : '<span class="muted">WhatsApp number coming soon</span>';
    $("#c-social").innerHTML = ["facebook", "instagram", "youtube"].map(function (k) {
      var url = (site.social || {})[k], label = k.charAt(0).toUpperCase() + k.slice(1);
      return url ? '<a class="chip" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon(k, 16) + label + "</a>" : '<span class="chip" style="opacity:.55" title="Link not added yet">' + icon(k, 16) + label + "</span>";
    }).join("");

    var status = $("#form-status"), submit = $("#send-btn"), busy = false;
    var rules = {
      name: function (v) { return v.length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
      subject: function (v) { return v.length >= 3; },
      message: function (v) { return v.length >= 10; }
    };
    function check(name, show) {
      var el = form.elements[name], ok = rules[name](el.value.trim());
      if (show !== false) el.closest(".field").classList.toggle("has-error", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      return ok;
    }
    Object.keys(rules).forEach(function (n) {
      form.elements[n].addEventListener("blur", function () { check(n); });
      form.elements[n].addEventListener("input", function () { if (form.elements[n].closest(".field").classList.contains("has-error")) check(n); });
    });

    function say(type, msg) {
      status.className = "notice" + (type === "warn" ? " notice-warn" : "");
      status.innerHTML = "<span>" + icon(type === "ok" ? "check-circle" : type === "warn" ? "alert" : "info", 18) + "</span><p>" + esc(msg) + "</p>";
      status.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      if (form.elements.website.value) return; // honeypot: bots fill this in
      var firstBad = null;
      Object.keys(rules).forEach(function (n) { if (!check(n) && !firstBad) firstBad = n; });
      if (firstBad) { form.elements[firstBad].focus(); say("warn", "Please fix the highlighted fields and try again."); return; }
      var data = {}; Object.keys(rules).forEach(function (n) { data[n] = form.elements[n].value.trim(); });

      if (!site.contactEndpoint) {
        var text = "Name: " + data.name + "\nEmail: " + data.email + "\nSubject: " + data.subject + "\n\n" + data.message;
        say("warn", "The contact form is not connected to a mailbox yet, so your message has NOT been sent.");
        S.ui.modal({
          title: "Message not sent", dismissValue: "close",
          html: "<p>This website is static and the contact form has not been connected to an email service yet. Nothing was sent. You can copy your message and send it another way once contact details are available.</p><div class=\"summary-box\">" + esc(text) + "</div>",
          actions: [{ label: "Close", value: "close", variant: "btn-ghost" }].concat(site.email ? [{ label: "Open email app", value: "mail", variant: "btn-glass" }] : []).concat([{ label: "Copy message", value: "copy", variant: "btn-primary" }])
        }).then(function (a) {
          if (a === "copy") S.ui.copy(text).then(function () { S.ui.toast("Message copied"); }, function () { S.ui.toast("Could not copy automatically", "error"); });
          if (a === "mail") window.location.href = "mailto:" + site.email + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(data.message + "\n\n" + data.name);
        });
        return;
      }

      busy = true; submit.disabled = true; submit.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px"></span> Sending';
      fetch(site.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error("bad status"); return r; })
        .then(function () { form.reset(); say("ok", "Thank you. Your message was sent. We will reply by email."); S.ui.toast("Message sent"); })
        .catch(function () { say("warn", "Your message could not be sent. Please check your connection and try again."); })
        .then(function () { busy = false; submit.disabled = false; submit.innerHTML = icon("mail", 18) + " Send message"; });
    });
  });
})();
