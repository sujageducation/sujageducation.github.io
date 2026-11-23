/* Generates the same three-column A4 report for one candidate or a whole test. */
(function () {
  "use strict";
  let pdfScript, arabicFont;
  const officialSite = "https://salucommunity.github.io/sujageducation.github.io/";
  function siteURL(settings) {
    for (const address of [settings.url, new URL(".", location.href).href, officialSite]) {
      try {
        const u = new URL(address);
        if (/^https?:$/.test(u.protocol) && !/^(?:example\.com|localhost|127\.0\.0\.1|terminal\.local)$/.test(u.hostname)) return u.href;
      } catch (_) {}
    }
    return officialSite;
  }
  function loadPDF() {
    if (!pdfScript) pdfScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "report-assets/pdf-lib.min.js";
      script.onload = () => resolve(window.PDFLib);
      script.onerror = () => { pdfScript = null; script.remove(); reject(new Error("The PDF tools could not load. Please try again.")); };
      document.head.appendChild(script);
    });
    return pdfScript;
  }
  function loadArabic() {
    if (!arabicFont) arabicFont = new FontFace("Sujag Report Arabic", "url(report-assets/arabic.woff)").load()
      .then(font => document.fonts.add(font)).catch(() => {});
    return arabicFont;
  }
  function logoBytes(src) {
    return new Promise((resolve, reject) => {
      const image = new Image(); image.crossOrigin = "anonymous";
      image.onload = () => {
        try {
          const ratio = Math.min(1, 320 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } catch (e) { reject(e); }
      };
      image.onerror = () => reject(new Error("Could not load the report logo.")); image.src = src;
    });
  }
  async function build(settings, title, rows) {
    const L = await loadPDF(), doc = await L.PDFDocument.create();
    const regular = await doc.embedFont(L.StandardFonts.Helvetica), bold = await doc.embedFont(L.StandardFonts.HelveticaBold);
    const brand = settings.name || "SUJAG Education", url = siteURL(settings);
    const logo = await doc.embedPng(await logoBytes(settings.logo || "logo-full.png").catch(() => logoBytes("logo-mark.png")));
    doc.setTitle(title + " | " + brand); doc.setAuthor(brand);
    const ink = L.rgb(.08,.16,.14), green = L.rgb(.055,.29,.22), line = L.rgb(.81,.86,.84), pale = L.rgb(.95,.97,.96), white = L.rgb(1,1,1);
    const W = 595.28, H = 841.89, margin = 40, right = W - margin;
    const cols = [margin + 10, margin + 231, margin + 421], widths = [202, 171, 78];
    const measure = document.createElement("canvas").getContext("2d");
    const native = text => /^[\x20-\x7E\u00A0-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D]+$/.test(text);
    if (/[\u0600-\u08ff]/.test([brand, title].concat(rows.map(r => r.name + r.city)).join(" "))) await loadArabic();
    const face = (size, heavy) => (heavy ? "bold " : "") + size + 'px Arial, "Sujag Report Arabic", sans-serif';
    function width(text, size, heavy) {
      if (native(text)) return (heavy ? bold : regular).widthOfTextAtSize(text, size);
      measure.font = face(size, heavy); return measure.measureText(text).width;
    }
    function wrap(input, size, max, heavy) {
      const text = String(input || "—").replace(/\s+/g, " ").trim();
      const lines = []; let current = "";
      for (const word of text.split(" ")) {
        if (current && width(current + " " + word, size, heavy) <= max) { current += " " + word; continue; }
        if (current) lines.push(current);
        current = "";
        for (const ch of word) {
          if (current && width(current + ch, size, heavy) > max) { lines.push(current); current = ""; }
          current += ch;
        }
      }
      lines.push(current || "—"); return lines;
    }
    let page, y, band;
    async function draw(text, x, baseline, size, heavy = false, color = ink) {
      if (native(text)) { page.drawText(text, { x, y: baseline, font: heavy ? bold : regular, size, color }); return; }
      // Browser shaping preserves joined Urdu and Sindhi letters and mixed-direction names.
      const scale = 3, w = Math.ceil(width(text, size, heavy)) + 5, height = Math.ceil(size * 2.7);
      const canvas = document.createElement("canvas"); canvas.width = w * scale; canvas.height = height * scale;
      const ctx = canvas.getContext("2d"); ctx.scale(scale, scale); ctx.font = face(size, heavy);
      ctx.direction = /^[^A-Za-z\u0600-\u08ff]*[\u0600-\u08ff]/.test(text) ? "rtl" : "ltr";
      ctx.textAlign = "left"; ctx.fillStyle = "rgb(" + [color.red,color.green,color.blue].map(v => Math.round(v * 255)).join(",") + ")";
      const ascent = size * 1.65; ctx.fillText(text, 1, ascent);
      const img = await doc.embedPng(canvas.toDataURL("image/png"));
      page.drawImage(img, { x: x - 1, y: baseline - (height - ascent), width: w, height });
    }
    async function openPage() {
      page = doc.addPage([W,H]);
      page.drawRectangle({x:0,y:H-7,width:W,height:7,color:green});
      const dim = logo.scaleToFit(60,68);
      page.drawImage(logo,{x:right-dim.width,y:H-38-dim.height,width:dim.width,height:dim.height});
      y = H - 55;
      for (const text of wrap(brand,17,385,true)) { await draw(text,margin,y,17,true,green); y -= 21; }
      for (const text of wrap(url,10,385,false)) { await draw(text,margin,y,10,false,green); y -= 14; }
      const link = doc.context.register(doc.context.obj({ Type:"Annot", Subtype:"Link",
        Rect:[margin,y+11,Math.min(right-65,margin+385),H-60], Border:[0,0,0],
        A:{ Type:"Action", S:"URI", URI:L.PDFString.of(url) } }));
      page.node.addAnnot(link);
      y = Math.min(y - 19, H - 123);
      for (const text of wrap(title,19,right-margin,true)) { await draw(text,margin,y,19,true); y -= 25; }
      y -= 3; page.drawRectangle({x:margin,y:y-22,width:right-margin,height:24,color:green});
      for (const [i,heading] of ["Name","City","Score"].entries()) await draw(heading,cols[i],y-14,11,true,white);
      y -= 22; band = false;
    }
    await openPage();
    for (const row of rows) {
      const cells = [row.name, row.city, row.marks + " / " + row.total].map((value,i) => wrap(value,11,widths[i],i===2));
      const height = Math.max(...cells.map(lines => lines.length)) * 18 + 10;
      if (y - height < 54) await openPage();
      if (band) page.drawRectangle({x:margin,y:y-height,width:right-margin,height,color:pale});
      for (let i=0;i<cells.length;i++) {
        for (const [j,text] of cells[i].entries()) await draw(text,cols[i],y-18-j*18,11,i===2,i===2?green:ink);
      }
      y -= height; band = !band;
      page.drawLine({start:{x:margin,y},end:{x:right,y},thickness:.55,color:line});
    }
    const pages = doc.getPages();
    pages.forEach((p,i) => {
      const label = (i+1) + " / " + pages.length;
      p.drawText(label,{x:right-regular.widthOfTextAtSize(label,9),y:28,size:9,font:regular,color:green});
    });
    return doc.save();
  }
  async function download(settings, title, rows) {
    const bytes = await build(settings, title, rows);
    const url = URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
    const a = document.createElement("a");
    a.href = url;
    a.download = (title.replace(/[\\/:*?"<>|\u0000-\u001f]+/g," ").trim().slice(0,112) || "Test") + " - Results.pdf";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  window.SujagReport = { download };
})();
