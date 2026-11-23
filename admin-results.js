/* Test submissions are read from the shared results database after CMS sign-in. */
(function () {
  "use strict";
  const A = window.SUJAG_ADMINAPP, h = A.h;
  let poll, linked = false;
  async function request(path, options = {}) {
    const proof = A.resultProof();
    if (!proof) throw new Error("Sign in to the Sujag admin panel to view submissions.");
    const settings = Object.assign({}, options, {headers: Object.assign({}, options.headers, {Authorization: "Bearer " + proof})});
    try { return await window.SujagResults.api(path, settings); }
    catch (error) {
      if (error.status !== 409) throw error;
      if (!linked && await A.linkResultsLogin()) {
        linked = true;
        throw new Error("Your CMS login is linked. The published login may take a moment to update. Use Refresh to check again.");
      }
      throw new Error("Publish your CMS login in the Sujag repository. For a login created with the earlier panel, connect GitHub in Settings once and sign in again.");
    }
  }
  function pageOf(id, before) {
    const params = new URLSearchParams({page:"1", testId:id});
    if (before) params.set("before",before);
    return request("/list?" + params);
  }
  A.ROUTES.results = function (parts) {
    clearInterval(poll);
    const choose = h("select", {id:"results-test", "aria-label":"Select a test"});
    const status = h("p",{c:"result-status", role:"status"},"Loading submissions…");
    const list = h("div",{c:"tw"});
    const title = h("h2",{});
    const count = h("p",{c:"mut result-count"});
    const refreshButton = A.btn("Refresh", () => refresh(true));
    const exportButton = A.btn("Download PDF", exportPDF, "primary");
    const moreButton = A.btn("Load more", loadMore);
    const root = h("section",{c:"result-admin"}, A.head("Test results", "Submissions from candidates on all devices appear under the test they took.",refreshButton),
      h("div",{c:"card result-controls"},A.fld("Select a test",choose)),status,
      h("div",{c:"card result-table-card"},h("div",{c:"row sp"},h("div",{},title,count),exportButton),list,moreButton));
    A.setView(root);
    const catalogue = A.D.tests || [];
    let selected = parts[0] || "", groups = new Map(), items = [], next = null, busy = false, downloading = false, initialized = false;
    exportButton.disabled = true; moreButton.hidden = true;
    choose.onchange = () => A.go("#results/" + encodeURIComponent(choose.value));

    function note(message, bad = false) {
      status.textContent = message; status.classList.toggle("error",bad);
    }
    function draw() {
      const group = groups.get(selected);
      const current = catalogue.find(t => t.id === selected);
      title.textContent = current?.title || group?.title || "Results";
      const n = group?.count || 0;
      count.textContent = n + (n === 1 ? " submission" : " submissions");
      exportButton.disabled = !n || downloading;
      moreButton.hidden = !next;
      if (!items.length) {
        list.replaceChildren(h("p",{c:"mut"}, "Submitted results will appear here automatically.")); return;
      }
      const table = h("table",{},h("thead",{},h("tr",{},["Name","City","Score","Phone",""].map(label => h("th",{scope:"col"},label)))));
      table.appendChild(h("tbody",{},items.map(row => h("tr",{},h("td",{dir:"auto"},row.name), h("td",{dir:"auto"},row.city),
        h("td",{c:"score-cell"},row.marks+" / "+row.total), h("td",{},row.phone || "—"),
        h("td",{c:"act"},A.btn("Delete",() => remove(row),"sm danger"))))));
      list.replaceChildren(table);
    }
    async function refresh(force = false) {
      if (busy || !root.isConnected || (!force && document.hidden)) return;
      busy = true; refreshButton.disabled = true;
      try {
        const data = await request("/groups");
        if (!root.isConnected) return;
        const old = groups.get(selected);
        groups = new Map(data.map(group => [group.testId, group]));
        const tests = new Map(data.map(g => [g.testId,g.title]));
        catalogue.forEach(t => tests.set(t.id,t.title));
        if (!tests.has(selected)) selected = tests.keys().next().value || "";
        choose.replaceChildren(...Array.from(tests, ([id,label]) => h("option",{value:id},label+" ("+(groups.get(id)?.count || 0)+")")));
        choose.value = selected; choose.disabled = !tests.size;
        const group = groups.get(selected);
        if (!initialized || force || old?.count !== group?.count || old?.latest !== group?.latest) {
          const page = group ? await pageOf(selected) : { rows:[], next:null };
          if (!root.isConnected) return;
          items = page.rows; next = page.next; initialized = true;
          draw();
        }
        note("Updated " + new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}));
      } catch (error) {
        if (root.isConnected) note(error.message || "Could not load submissions. Please refresh.",true);
      } finally { busy = false; refreshButton.disabled = false; }
    }
    async function loadMore() {
      if (!next || busy) return;
      busy = true; moreButton.disabled = true;
      try {
        const page = await pageOf(selected,next);
        items.push(...page.rows); next = page.next; draw();
      } catch (error) { note(error.message,true); }
      finally { busy = false; moreButton.disabled = false; }
    }
    async function exportPDF() {
      if (!selected || downloading) return;
      const testID = selected, testTitle = title.textContent;
      downloading = true; exportButton.disabled = true; exportButton.textContent = "Preparing PDF…";
      try {
        const all = []; let before = null;
        do {
          const page = await pageOf(testID,before);
          all.push(...page.rows); before = page.next;
        } while (before);
        if (!all.length) throw new Error("This test has no submissions to export.");
        await window.SujagReport.download(A.D.site, testTitle, all);
        note("PDF downloaded for " + testTitle + ".");
      } catch (error) { note(error.message || "Could not create the complete PDF. Please try again.",true); }
      finally { downloading = false; exportButton.textContent = "Download PDF"; exportButton.disabled = !groups.get(selected)?.count; }
    }
    function remove(row) {
      const confirm = A.btn("Delete result", async () => {
        confirm.disabled = true;
        try {
          await request("/delete",{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify({rid:row.rid})});
          A.closeModal(); await refresh(true);
        } catch (error) { A.closeModal(); note(error.message,true); }
      },"danger");
      A.modal("Delete this result?",h("p",{},row.name + "’s submission for " + title.textContent + " will be removed."),[A.btn("Cancel",A.closeModal),confirm]);
    }
    refresh(true);
    poll = setInterval(() => { if (root.isConnected) refresh(); else clearInterval(poll); },20000);
  };
})();
