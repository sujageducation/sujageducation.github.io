/* ==========================================================================
   SUJAG Education - "Latest updates" list on the home page
   Edit this file to change what scrolls in the Latest Updates card.

   Each item has a "date" (YYYY-MM-DD) and ONE of these forms:
     { date: "2026-11-18", type: "test", id: "spsc-gk-1" }      link to a mock test
     { date: "2026-11-17", type: "note", id: "english-grammar-basics" }   link to a note
     { date: "2026-11-16", type: "book", id: "general-knowledge-complete-guide" }   link to a book
     { date: "2026-11-10", type: "info", text: "Your own message", href: "mock-tests.html" }
   For test, note and book items the title and link come from the data files,
   so they never go out of date. Newest items are shown first. Items whose id
   no longer exists are skipped. The dates below are sample dates.
   ========================================================================== */
window.SUJAG = window.SUJAG || {};
SUJAG.data = SUJAG.data || {};

SUJAG.data.updates = [
  { date: "2026-11-19", type: "info", text: "Search now covers mock tests, notes, books and categories.", href: "search.html" },
  { date: "2026-11-18", type: "test", id: "spsc-gk-1" },
  { date: "2026-11-17", type: "test", id: "entry-math-physics-1" },
  { date: "2026-11-17", type: "note", id: "english-grammar-basics" },
  { date: "2026-11-16", type: "book", id: "general-knowledge-complete-guide" },
  { date: "2026-11-15", type: "test", id: "cs-basics-1" },
  { date: "2026-11-15", type: "note", id: "pakistan-movement-timeline" },
  { date: "2026-11-14", type: "test", id: "gk-world-1" },
  { date: "2026-11-13", type: "note", id: "computer-fundamentals" },
  { date: "2026-11-12", type: "book", id: "mathematics-for-recruitment-tests" },
  { date: "2026-11-10", type: "info", text: "Every mock test now ends with a full answer review and explanations.", href: "mock-tests.html" },
  { date: "2026-11-09", type: "test", id: "sts-english-1" }
];
