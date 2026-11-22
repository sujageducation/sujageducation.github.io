/* SUJAG Education - admin-members.js
   Admin-managed members list. Data stays in THIS browser (localStorage) and is never written to the
   public website repository. Use Export / Backup to keep a copy, or sync to a separate PRIVATE repo. */
(function () {
  "use strict";
  var A = window.SUJAG_ADMINAPP, h = A.h, C = window.SUJAG_ADMIN, KEY = "sujag:admin:members", PK = "sujag:admin:membersrepo";
  var FIELDS = ["name", "phone", "email", "city", "group", "status", "joined", "notes"];
  var HEAD = { name: "Name", phone: "Phone", email: "Email", city: "City", group: "Class / group", status: "Status", joined: "Joined", notes: "Notes" };
  var list = [];
  try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { list = []; }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { A.toast("Browser storage is full or blocked. Export a backup now.", true); } }
  A.members = { count: function () { return list.length; } };
  function rid() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function csvParse(t) {
    t = t.replace(/^﻿/, ""); var first = t.split(/\r?\n/)[0] || "", d = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ";" : ",";
    var rows = [], r = [], f = "", q = false, i, c;
    for (i = 0; i < t.length; i++) {
      c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true; else if (c === d) { r.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; r.push(f); f = ""; if (r.some(Boolean)) rows.push(r); r = []; }
      else f += c;
    }
    r.push(f); if (r.some(Boolean)) rows.push(r); return rows;
  }
  function cell(v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function unguard(v) { return /^'[=+\-@]/.test(v) ? v.slice(1) : v; }
  function toCsv() { return [FIELDS.map(function (k) { return HEAD[k]; }).join(",")].concat(list.map(function (m) { return FIELDS.map(function (k) { return cell(m[k]); }).join(","); })).join("\r\n"); }
  var ALIAS = { name: /^(full\s*)?name$/i, phone: /phone|mobile|whatsapp|contact/i, email: /e-?mail/i, city: /city|town/i, group: /class|group|category|program/i, status: /status/i, joined: /join|date/i, notes: /note|remark/i };
  function importCsv(text) {
    var rows = csvParse(text); if (rows.length < 2) return 0;
    var map = rows[0].map(function (hd) { return Object.keys(ALIAS).filter(function (k) { return ALIAS[k].test(hd.trim()); })[0] || null; }), n = 0;
    if (map.indexOf("name") < 0) { A.toast("The first row must be headings including a Name column.", true); return 0; }
    rows.slice(1).forEach(function (r) { var m = { id: rid(), status: "active", joined: A.today() }; map.forEach(function (k, i) { if (k && r[i] != null && r[i].trim() !== "") m[k] = unguard(r[i].trim()); }); if (m.name) { list.push(m); n++; } });
    persist(); return n;
  }
  function edit(m, done) {
    var isNew = !m, o = m ? JSON.parse(JSON.stringify(m)) : { id: rid(), name: "", phone: "", email: "", city: "", group: "", status: "active", joined: A.today(), notes: "" };
    var body = h("div", {}, h("div", { c: "note warn" }, "Do not store ID card numbers, passwords or other sensitive details here."),
      h("div", { c: "cols" }, A.inp(o, "name", { label: "Name" }), A.inp(o, "phone", { label: "Phone / WhatsApp" }), A.inp(o, "email", { label: "Email" }), A.inp(o, "city", { label: "City" }), A.inp(o, "group", { label: "Class / group" }), A.sel(o, "status", ["active", "inactive"], "Status"), A.inp(o, "joined", { label: "Joined", type: "date" })), A.inp(o, "notes", { label: "Notes", area: true, rows: 2 }));
    A.modal(isNew ? "Add member" : "Edit member", body, [A.btn("Cancel", A.closeModal), A.btn("Save", function () {
      if (!o.name.trim()) { A.toast("Name is required.", true); return; }
      if (isNew) list.push(o); else list[list.indexOf(m)] = o; persist(); A.closeModal(); done();
    }, "primary")]);
  }
  function repoCfg() { try { return JSON.parse(localStorage.getItem(PK) || "{}"); } catch (e) { return {}; } }
  function sync(dir) {
    var rc = repoCfg(), G = A.G; if (!G.token || !rc.owner || !rc.repo) { A.toast("Set the private repository below and connect GitHub first.", true); return; }
    var rp = { owner: rc.owner, repo: rc.repo, branch: rc.branch || "main" };
    A.gh("GET", "/repos/" + rp.owner + "/" + rp.repo).then(function (r) {
      if (!r.private) { A.toast("Refused: that repository is public. Members must only go to a private repository.", true); return; }
      if (dir === "push") return A.putFile(C.membersFile, A.b64t(JSON.stringify(list, null, 2)), "Update members backup", rp).then(function () { A.toast("Backed up " + list.length + " members to the private repository."); });
      return A.gh("GET", "/repos/" + rp.owner + "/" + rp.repo + "/contents/" + A.epath(C.membersFile) + "?ref=" + encodeURIComponent(rp.branch)).then(function (f) {
        var arr = JSON.parse(A.unb64t(f.content)); if (!Array.isArray(arr) || !confirm("Replace the " + list.length + " members in this browser with " + arr.length + " from the private repository?")) return;
        list = arr; persist(); A.redraw(); A.toast("Restored " + arr.length + " members.");
      });
    }).catch(function (e) { A.toast(A.friendly(e), true); });
  }

  A.ROUTES.members = function () {
    var q = h("input", { type: "search", placeholder: "Search name, phone, email, city", "aria-label": "Search members" }), st = h("select", { "aria-label": "Status" }, ["", "active", "inactive"].map(function (x) { return h("option", { value: x }, x || "All statuses"); })), box = h("div", { c: "tw" });
    function draw() {
      var s = q.value.toLowerCase(), rows = list.filter(function (m) { return (!st.value || m.status === st.value) && (!s || FIELDS.some(function (k) { return String(m[k] || "").toLowerCase().indexOf(s) >= 0; })); });
      box.innerHTML = ""; if (!rows.length) { box.appendChild(h("div", { c: "card" }, list.length ? "No members match." : "No members yet. Add one, or import a CSV file.")); return; }
      box.appendChild(h("table", {}, h("thead", {}, h("tr", {}, ["Name", "Phone", "City", "Group", "Status", ""].map(function (x) { return h("th", {}, x); }))), h("tbody", {}, rows.map(function (m) {
        return h("tr", {}, h("td", {}, m.name), h("td", {}, m.phone || ""), h("td", {}, m.city || ""), h("td", {}, m.group || ""), h("td", {}, h("span", { c: "tag" + (m.status === "inactive" ? " warn" : "") }, m.status || "")),
          h("td", { c: "act" }, A.btn("Edit", function () { edit(m, A.redraw); }, "sm"), " ", A.btn("Delete", function () { if (confirm("Delete " + m.name + "?")) { list.splice(list.indexOf(m), 1); persist(); draw(); } }, "sm danger")));
      }))));
    }
    q.oninput = draw; st.onchange = draw;
    var file = h("input", { type: "file", accept: ".csv,text/csv", style: "display:none", onchange: function (e) { var f = e.target.files[0]; if (!f) return; f.text().then(function (t) { var n = importCsv(t); if (n) { A.toast(n + " member(s) imported."); A.redraw(); } else A.toast("Nothing imported.", true); }); } });
    var jfile = h("input", { type: "file", accept: ".json,application/json", style: "display:none", onchange: function (e) { var f = e.target.files[0]; if (!f) return; f.text().then(function (t) { try { var a = JSON.parse(t); if (!Array.isArray(a)) throw 0; if (confirm("Replace the current " + list.length + " members with " + a.length + " from this backup?")) { list = a; persist(); A.redraw(); } } catch (x) { A.toast("That is not a valid backup file.", true); } }); } });
    var rc = repoCfg();
    var rcard = h("div", { c: "card" }, h("h3", {}, "Optional: back up to a private GitHub repository"), h("p", { c: "mut", style: "margin-top:0" }, "Members are never saved in the public website repository. To keep an online copy, create a separate PRIVATE repository and enter it here. The panel refuses to sync to a public one. Use the same token (it must also have access to that repository)."),
      h("div", { c: "cols" }, A.inp(rc, "owner", { label: "Owner" }), A.inp(rc, "repo", { label: "Private repository" }), A.inp(rc, "branch", { label: "Branch", ph: "main" })),
      h("div", { c: "row" }, A.btn("Save settings", function () { localStorage.setItem(PK, JSON.stringify(rc)); A.toast("Saved."); }), A.btn("Back up now", function () { localStorage.setItem(PK, JSON.stringify(rc)); sync("push"); }, "primary"), A.btn("Restore from repository", function () { localStorage.setItem(PK, JSON.stringify(rc)); sync("pull"); })));
    A.setView([A.head("Members", list.length + " members, stored in this browser only", h("div", { c: "row" }, A.btn("Import CSV", function () { file.click(); }), A.btn("Export CSV", function () { A.save(new Blob([toCsv()], { type: "text/csv" }), "members.csv"); }), A.btn("Backup (JSON)", function () { A.save(new Blob([JSON.stringify(list, null, 2)], { type: "application/json" }), "members-backup.json"); }), A.btn("Restore backup", function () { jfile.click(); }), A.btn("Add member", function () { edit(null, A.redraw); }, "primary"))),
      h("div", { c: "note warn" }, "Browser storage can be cleared by the browser or lost with the device. Export a backup regularly. CSV headings can be Name, Phone, Email, City, Class, Status, Joined, Notes."), file, jfile,
      h("div", { c: "row", style: "margin-bottom:12px" }, q, st), box, rcard]);
    draw();
  };
})();
