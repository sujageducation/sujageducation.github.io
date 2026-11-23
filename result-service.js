/* Shared by the exam, the result screen, and the signed-in CMS. */
(function () {
  "use strict";
  const base = "https://sujag-education-results.ziabbalouch.chatgpt.site";
  const prefix = "sujag:send-result:";
  const historyKey = "sujag:results";
  const memory = new Map(), active = new Map(), delivered = new Set(), rejected = new Set();
  let running = false, retryTimer;

  function stores() {
    const areas = [];
    for (const name of ["localStorage", "sessionStorage"]) {
      try { areas.push(window[name]); } catch (_) { /* Browser storage may be disabled. */ }
    }
    return areas;
  }
  function persist(key, value) {
    for (const area of stores()) {
      try { area.setItem(key, JSON.stringify(value)); return true; } catch (_) { /* Try the next store. */ }
    }
    return false;
  }
  function pending() {
    const records = new Map(memory);
    for (const area of stores()) {
      try {
        for (let i = 0; i < area.length; i++) {
          const key = area.key(i);
          if (!key || !key.startsWith(prefix)) continue;
          try {
            const value = JSON.parse(area.getItem(key));
            if (value && value.rid) records.set(value.rid, value);
          } catch (_) { /* A damaged entry must not hide other pending submissions. */ }
        }
      } catch (_) { /* In-memory attempts can still be delivered. */ }
    }
    return records;
  }
  function summary(r) {
    return { rid: r.rid, testId: r.testId, title: r.title, category: r.category,
      name: r.candidate.name || "", city: r.candidate.city || "", phone: r.candidate.phone || "",
      marks: r.marks, total: r.total, finishedAt: r.submittedAt };
  }
  function enqueue(r) {
    const record = summary(r);
    memory.set(record.rid, record);
    return persist(prefix + record.rid, record);
  }
  async function api(path, options) {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(base + path, Object.assign({
        mode: "cors", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer", signal: controller.signal
      }, options));
      let data;
      try { data = await response.json(); }
      catch (_) { throw new Error("The results service returned an unreadable response. Please try again."); }
      if (!response.ok || data.ok === false) {
        const err = new Error(data.error || "The results service is unavailable.");
        err.status = response.status; throw err;
      }
      return data;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("The results service took too long to respond. Please try again.");
      if (error instanceof TypeError) throw new Error("Cannot reach the results service. Check your connection and try again.");
      throw error;
    } finally { clearTimeout(timeout); }
  }
  function notify(rid, state) {
    window.dispatchEvent(new CustomEvent("sujag-result-delivery", { detail: { rid, state } }));
  }
  function confirmSent(rid) {
    delivered.add(rid); rejected.delete(rid); memory.delete(rid);
    for (const area of stores()) {
      try {
        const list = JSON.parse(area.getItem(historyKey) || "[]");
        const r = list.find(item => item.rid === rid);
        if (r) { r.delivery = "sent"; area.setItem(historyKey, JSON.stringify(list)); }
      } catch (_) { /* Other copies and the database receipt remain valid. */ }
      try { area.removeItem(prefix + rid); } catch (_) {}
    }
    notify(rid, "sent");
  }
  function send(record) {
    if (delivered.has(record.rid)) return Promise.resolve(true);
    if (active.has(record.rid)) return active.get(record.rid);
    if (navigator.onLine === false) return Promise.resolve(false);
    const request = api("/submit", { method: "POST", keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(record) })
      .then(data => {
        if (data.ok !== true || data.rid !== record.rid) throw new Error("No receipt");
        confirmSent(record.rid); return true;
      })
      .catch(error => {
        if ([400, 413, 422].includes(error.status)) rejected.add(record.rid);
        notify(record.rid, rejected.has(record.rid) ? "rejected" : "pending"); return false;
      })
      .finally(() => active.delete(record.rid));
    active.set(record.rid, request);
    return request;
  }
  async function flush() {
    if (running || navigator.onLine === false || document.visibilityState === "hidden") return;
    running = true; clearTimeout(retryTimer);
    try {
      for (const record of pending().values()) {
        if (rejected.has(record.rid)) continue;
        if (!await send(record) && !rejected.has(record.rid)) break;
      }
    } finally {
      running = false;
      if (Array.from(pending().keys()).some(rid => !rejected.has(rid))) retryTimer = setTimeout(flush, 30000);
    }
  }
  function sendResult(r) {
    return send(summary(r)).then(sent => {
      if (!sent && !rejected.has(r.rid)) { clearTimeout(retryTimer); retryTimer = setTimeout(flush, 15000); }
      return sent;
    });
  }
  function state(r) {
    if (delivered.has(r.rid) || r.delivery === "sent") return "sent";
    if (rejected.has(r.rid)) return "rejected";
    return r.delivery === "pending" ? "pending" : "local";
  }
  window.SujagResults = { api, enqueue, sendResult, state, flush };
  window.addEventListener("online", flush);
  window.addEventListener("pageshow", flush);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) flush(); });
})();
