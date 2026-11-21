/* ==========================================================================
   SUJAG Education - books data
   Everything the books pages show comes from this file.

   HOW TO ADD A BOOK
   1. Add a new object to SUJAG.data.books (copy an existing one).
   2. Give it a unique "id" and set a "category" (any text; filters are built automatically).
   3. Put the cover image in assets/books/ and set "cover" to its path.
      JPG, PNG, WebP and SVG all work. Portrait 3:4 images look best (for example 600 x 800).
   4. "price" is a number in rupees. Use 0 if the price is not decided yet.
   5. "contents" is the list shown under "What is inside".

   The books below are SAMPLE listings used to demonstrate the store. They are
   not real products. Replace them with your own books before launch and set
   demoMode to false in data-site.js to hide the sample-content notices.
   ========================================================================== */
window.SUJAG = window.SUJAG || {};
SUJAG.data = SUJAG.data || {};

SUJAG.data.books = [
  {
    id: "general-knowledge-complete-guide",
    title: "General Knowledge Complete Guide",
    author: "SUJAG Education",
    category: "General Knowledge",
    price: 650,
    featured: true,
    cover: "general-knowledge-complete-guide.svg",
    description: "A printed guide to Pakistan and world general knowledge for recruitment tests.",
    longDescription: "This guide brings the most commonly tested general knowledge topics into one book. Each chapter is short, organised by topic and ends with practice questions so you can check what you remember.",
    contents: [
      "Pakistan: geography, history and national symbols",
      "World geography, capitals and currencies",
      "Important organisations and their headquarters",
      "Science and technology basics",
      "Practice questions with answers at the end of each chapter"
    ],
    pages: 240, language: "English", format: "Paperback"
  },
  {
    id: "english-grammar-vocabulary-workbook",
    title: "English Grammar and Vocabulary Workbook",
    author: "SUJAG Education",
    category: "English",
    price: 550,
    featured: true,
    cover: "english-grammar-vocabulary-workbook.svg",
    description: "Exercises on grammar, synonyms, antonyms and sentence correction.",
    longDescription: "A workbook for learners who want to practise rather than only read. Short explanations are followed by exercises of the kind that appear in screening tests, with an answer key to check your work.",
    contents: [
      "Parts of speech and tenses",
      "Articles, prepositions and subject-verb agreement",
      "Synonyms, antonyms and one-word substitutions",
      "Sentence correction and passive voice",
      "Answer key with short explanations"
    ],
    pages: 200, language: "English", format: "Paperback"
  },
  {
    id: "pakistan-affairs-islamiat-handbook",
    title: "Pakistan Affairs and Islamiat Handbook",
    author: "SUJAG Education",
    category: "Pakistan Studies",
    price: 600,
    featured: true,
    cover: "pakistan-affairs-islamiat-handbook.svg",
    description: "A concise handbook covering the Pakistan Movement, constitutions and Islamiat basics.",
    longDescription: "A revision handbook for the Pakistan Studies and Islamiat sections of recruitment tests. Key dates, constitutional milestones and Islamiat essentials are presented as short, easy to scan notes.",
    contents: [
      "The Pakistan Movement: timeline and key figures",
      "Constitutional development of Pakistan",
      "Geography and resources of Pakistan",
      "Islamiat essentials: pillars, Quran and early history",
      "Multiple choice practice sets"
    ],
    pages: 210, language: "English", format: "Paperback"
  },
  {
    id: "mathematics-for-recruitment-tests",
    title: "Mathematics for Recruitment Tests",
    author: "SUJAG Education",
    category: "Mathematics",
    price: 700,
    featured: true,
    cover: "mathematics-for-recruitment-tests.svg",
    description: "Arithmetic and basic algebra with solved examples and timed practice sets.",
    longDescription: "This book focuses on the arithmetic and algebra that appear most often in recruitment tests. Every topic starts with a formula summary, followed by solved examples and practice questions.",
    contents: [
      "Percentages, ratios and proportions",
      "Averages, profit and loss, simple interest",
      "Time, speed and distance",
      "Basic algebra and geometry",
      "Timed practice sets with solutions"
    ],
    pages: 260, language: "English", format: "Paperback"
  },
  {
    id: "university-entry-test-guide",
    title: "University Entry Test Preparation Guide",
    author: "SUJAG Education",
    category: "University Preparation",
    price: 850,
    featured: false,
    cover: "university-entry-test-guide.svg",
    description: "A subject-wise guide with practice questions for university admission tests.",
    longDescription: "A preparation guide for students aiming at university admission tests. It covers the common subject areas, explains how to plan your preparation and includes full-length practice papers.",
    contents: [
      "How entry tests work and how to plan your study time",
      "Mathematics and physics fundamentals",
      "English: grammar, vocabulary and comprehension",
      "Chemistry and biology basics",
      "Two full-length practice papers"
    ],
    pages: 320, language: "English", format: "Paperback"
  },
  {
    id: "computer-basics-job-tests",
    title: "Computer Basics for Job Tests",
    author: "SUJAG Education",
    category: "Computer",
    price: 450,
    featured: false,
    cover: "computer-basics-job-tests.svg",
    description: "Computer fundamentals, office software and internet basics explained simply.",
    longDescription: "A short, practical book for candidates who need the computer basics asked in clerical and assistant posts. Concepts are explained in plain language and followed by multiple choice questions.",
    contents: [
      "Hardware, software and memory units",
      "Operating systems and file types",
      "Word processing and spreadsheet basics",
      "The internet, email and online safety",
      "Multiple choice practice with answers"
    ],
    pages: 150, language: "English", format: "Paperback"
  }
];
