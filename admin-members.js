/* SUJAG Education - admin-members.js
   Admin-managed members list. Data stays in THIS browser (localStorage) and is never written to the
   public website repository. Use Export / Backup to keep a copy, or sync to a separate PRIVATE repo. */
(function () {
  "use strict";
  var A = window.SUJAG_ADMINAPP, h = A.h, C = window.SUJAG_ADMIN;
  var FIELDS = ["name", "phone", "email", "city", "group", "status", "joined", "notes"];
  var HEAD = { name: "Name", phone: "Phone", email: "Email", city: "City", group: "Class / group", status: "Status", joined: "Joined", notes: "Notes" };
  var list = [], deleted = {}, loaded = false, state = { msg: "Loading members...", bad: false, unsaved: false }, saveT, loadP = null;
  function rid() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ----- shared encrypted vault (works in every browser after login) ----- */
  function vpath() { return "/repos/" + A.G.owner + "/" + A.G.repo + "/contents/" + A.epath(C.membersFile); }
  function readRemote() {
    if (A.G.token && A.G.owner && A.G.repo) {
      return A.gh("GET", vpath() + "?ref=" + encodeURIComponent(A.G.branch)).then(function (f) { return A.vault.decrypt(JSON.parse(A.unb64t(f.content)).data).then(JSON.parse); }, function (e) { if (e.status === 404) return null; throw e; });
    }
    return fetch(C.membersFile + "?v=" + Date.now(), { cache: "no-store" }).then(function (r) { if (r.status === 404) return null; if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }).then(function (j) { return j ? A.vault.decrypt(j.data).then(JSON.parse) : null; });
  }
  function load(force) {
    if (loadP && !force) return loadP;
    state.msg = "Loading members..."; state.bad = false;
    loadP = readRemote().then(function (arr) {
      list = Array.isArray(arr) ? arr : []; loaded = true; state.msg = list.length + " member(s) loaded from the shared vault."; state.unsaved = false;
      try { var old = JSON.parse(localStorage.getItem("sujag:admin:members") || "[]"); if (old.length && confirm("This browser has " + old.length + " member(s) from the earlier version. Move them into the shared vault?")) { old.forEach(function (m) { m.u = Date.now(); list.push(m); }); localStorage.removeItem("sujag:admin:members"); persist(); } } catch (e) {}
    }).catch(function (e) { loaded = false; loadP = null; state.bad = true; state.msg = "Could not load members: " + (A.friendly ? A.friendly(e) : e.message) + (e.name === "OperationError" ? " (wrong login for this vault)" : ""); });
    return loadP;
  }
  function mergeRemote(remote) {
    var byId = {}; list.forEach(function (m) { byId[m.id] = m; });
    (remote || []).forEach(function (r) { var m = byId[r.id]; if (!m) { if (!deleted[r.id]) list.push(r); } else if ((r.u || 0) > (m.u || 0)) list[list.indexOf(m)] = r; });
  }
  function saveNow() {
    if (!A.G.token) { state.unsaved = true; state.msg = "Not saved to the shared vault yet. Connect GitHub in Settings, then press Save."; return Promise.reject(new Error("Connect GitHub first (Settings).")); }
    return readRemote().catch(function () { return null; }).then(function (remote) {
      mergeRemote(remote); return A.vault.encrypt(JSON.stringify(list));
    }).then(function (data) {
      var body = JSON.stringify({ v: 1, updated: new Date().toISOString(), count: list.length, data: data });
      return A.putFile(C.membersFile, A.b64t(body), "Update members vault (encrypted)");
    }).then(function () { state.unsaved = false; state.bad = false; state.msg = "Saved " + list.length + " member(s) to the encrypted shared vault."; });
  }
  function persist() { state.unsaved = true; clearTimeout(saveT); if (!A.G.token) { state.msg = "Not saved to the shared vault yet. Connect GitHub in Settings, then press Save."; paintState(); return; } state.msg = "Saving..."; paintState(); saveT = setTimeout(function () { saveNow().then(paintState).catch(function (e) { state.bad = true; state.msg = "Save failed: " + (A.friendly ? A.friendly(e) : e.message); paintState(); }); }, 700); }
  function paintState() { var el = document.getElementById("mstate"); if (el) { el.className = "note" + (state.bad ? " bad" : state.unsaved ? " warn" : ""); el.textContent = state.msg; } var c = document.getElementById("mcount"); if (c) c.textContent = list.length + " members"; }
  A.members = { count: function () { return list.length; }, load: load, saveNow: saveNow, readyToRekey: function () { return load().then(function () { return list; }); } };

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
    rows.slice(1).forEach(function (r) { var m = { id: rid(), status: "active", joined: A.today() }; map.forEach(function (k, i) { if (k && r[i] != null && r[i].trim() !== "") m[k] = unguard(r[i].trim()); }); if (m.name) { m.u = Date.now(); list.push(m); n++; } });
    persist(); return n;
  }
  function edit(m, done) {
    var isNew = !m, o = m ? JSON.parse(JSON.stringify(m)) : { id: rid(), name: "", phone: "", email: "", city: "", group: "", status: "active", joined: A.today(), notes: "" };
    var body = h("div", {}, h("div", { c: "note warn" }, "Do not store ID card numbers, passwords or other sensitive details here."),
      h("div", { c: "cols" }, A.inp(o, "name", { label: "Name" }), A.inp(o, "phone", { label: "Phone / WhatsApp" }), A.inp(o, "email", { label: "Email" }), A.inp(o, "city", { label: "City" }), A.inp(o, "group", { label: "Class / group" }), A.sel(o, "status", ["active", "inactive"], "Status"), A.inp(o, "joined", { label: "Joined", type: "date" })), A.inp(o, "notes", { label: "Notes", area: true, rows: 2 }));
    A.modal(isNew ? "Add member" : "Edit member", body, [A.btn("Cancel", A.closeModal), A.btn("Save", function () {
      if (!o.name.trim()) { A.toast("Name is required.", true); return; }
      o.u = Date.now(); if (isNew) list.push(o); else list[list.indexOf(m)] = o; persist(); A.closeModal(); done();
    }, "primary")]);
  }
  A.ROUTES.members = function () {
    if (!loaded) { A.setView([A.head("Members"), h("div", { c: "note", id: "mstate" }, state.msg), A.btn("Try again", function () { load(true).then(A.redraw); })]); load().then(function () { if (loaded) A.redraw(); else paintState(); }); return; }
    var q = h("input", { type: "search", placeholder: "Search name, phone, email, city", "aria-label": "Search members" }), st = h("select", { "aria-label": "Status" }, ["", "active", "inactive"].map(function (x) { return h("option", { value: x }, x || "All statuses"); })), box = h("div", { c: "tw" });
    function draw() {
      var s = q.value.toLowerCase(), rows = list.filter(function (m) { return (!st.value || m.status === st.value) && (!s || FIELDS.some(function (k) { return String(m[k] || "").toLowerCase().indexOf(s) >= 0; })); });
      box.innerHTML = ""; if (!rows.length) { box.appendChild(h("div", { c: "card" }, list.length ? "No members match." : "No members yet. Add one, or import a CSV file.")); return; }
      box.appendChild(h("table", {}, h("thead", {}, h("tr", {}, ["Name", "Phone", "City", "Group", "Status", ""].map(function (x) { return h("th", {}, x); }))), h("tbody", {}, rows.map(function (m) {
        return h("tr", {}, h("td", {}, m.name), h("td", {}, m.phone || ""), h("td", {}, m.city || ""), h("td", {}, m.group || ""), h("td", {}, h("span", { c: "tag" + (m.status === "inactive" ? " warn" : "") }, m.status || "")),
          h("td", { c: "act" }, A.btn("Edit", function () { edit(m, A.redraw); }, "sm"), " ", A.btn("Delete", function () { if (confirm("Delete " + m.name + "?")) { deleted[m.id] = 1; list.splice(list.indexOf(m), 1); persist(); draw(); } }, "sm danger")));
      }))));
    }
    q.oninput = draw; st.onchange = draw;
    var file = h("input", { type: "file", accept: ".csv,text/csv", style: "display:none", onchange: function (e) { var f = e.target.files[0]; if (!f) return; f.text().then(function (t) { var n = importCsv(t); if (n) { A.toast(n + " member(s) imported."); A.redraw(); } else A.toast("Nothing imported.", true); }); } });
    var jfile = h("input", { type: "file", accept: ".json,application/json", style: "display:none", onchange: function (e) { var f = e.target.files[0]; if (!f) return; f.text().then(function (t) { try { var a = JSON.parse(t); if (!Array.isArray(a)) throw 0; if (confirm("Replace the current " + list.length + " members with " + a.length + " from this backup?")) { list = a; persist(); A.redraw(); } } catch (x) { A.toast("That is not a valid backup file.", true); } }); } });
    A.setView([A.head("Members", "Shared across every browser. Stored encrypted in your repository.", h("div", { c: "row" }, A.btn("Import CSV", function () { file.click(); }), A.btn("Export CSV", function () { A.save(new Blob([toCsv()], { type: "text/csv" }), "members.csv"); }), A.btn("Backup (JSON)", function () { A.save(new Blob([JSON.stringify(list, null, 2)], { type: "application/json" }), "members-backup.json"); }), A.btn("Restore backup", function () { jfile.click(); }), A.btn("Add member", function () { edit(null, A.redraw); }, "primary"))),
      h("div", { id: "mstate", c: "note" }, state.msg), h("p", { c: "mut", style: "font-size:13px" }, "Members are encrypted with your admin login before they are saved, so the public repository only holds unreadable data. Saving needs the GitHub token. Keep a CSV backup. CSV headings: Name, Phone, Email, City, Class, Status, Joined, Notes. ", h("span", { id: "mcount" }, list.length + " members"), " ", A.btn("Reload", function () { load(true).then(A.redraw); }, "sm"), " ", A.btn("Save now", function () { saveNow().then(function () { A.toast("Saved."); paintState(); }).catch(function (e) { A.toast(A.friendly ? A.friendly(e) : e.message, true); }); }, "sm")), file, jfile,
      h("div", { c: "row", style: "margin-bottom:12px" }, q, st), box]);
    draw();
  };
})();
