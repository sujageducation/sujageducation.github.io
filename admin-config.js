/* SUJAG Education - admin-config.js
   Where the admin panel reads and writes. Change only if you move the files. */
window.SUJAG_ADMIN = {
  files: { site: "data-site.js", tests: "data-tests.js", notes: "data-notes.js", books: "data-books.js", updates: "data-updates.js", pages: "data-pages.js" },
  notesDir: "",
  booksDir: "",
  logoDir: "",
  membersFile: "members.json",
  pdfjs: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  pdfWorker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  icons: ["book-open", "briefcase", "building", "calculator", "clipboard", "flag", "flask", "globe", "graduation-cap", "landmark", "monitor", "newspaper", "shield", "type"]
};
