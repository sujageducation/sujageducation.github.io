/* ==========================================================================
   SUJAG Education - study notes data
   Everything the notes pages show comes from this file.

   HOW TO ADD A NOTE
   1. Add a new object to SUJAG.data.notes (copy an existing one).
   2. Give it a unique "id" and set "category" to one of the category ids below.
   3. Put your PDF in assets/notes/ and set "pdf" to its path, for example
      "assets/notes/my-notes.pdf". Leave "pdf" as "" if there is no PDF yet.
   4. "size" and "pages" are optional text shown on the card (for example "120 KB").
   5. "sections" is the readable version of the note shown on the detail page.
      Each section has a heading and a list of points. You can leave it empty.
   "date" uses the format YYYY-MM-DD and is used for sorting.

   The notes below are short demo notes written for this website. Replace
   them with your own material. Make sure you have the right to share any
   PDF you upload.
   ========================================================================== */
window.SUJAG = window.SUJAG || {};
SUJAG.data = SUJAG.data || {};

SUJAG.data.noteCategories = [
  { id: "english", name: "English", icon: "type" },
  { id: "general-knowledge", name: "General Knowledge", icon: "globe" },
  { id: "current-affairs", name: "Current Affairs", icon: "newspaper" },
  { id: "mathematics", name: "Mathematics", icon: "calculator" },
  { id: "science", name: "Science", icon: "flask" },
  { id: "computer", name: "Computer", icon: "monitor" },
  { id: "pakistan-studies", name: "Pakistan Studies", icon: "flag" },
  { id: "islamiat", name: "Islamiat", icon: "book-open" },
  { id: "university-preparation", name: "University Preparation", icon: "graduation-cap" },
  { id: "job-preparation", name: "Job Preparation", icon: "briefcase" }
];

SUJAG.data.notes = [
  {
    id: "english-grammar-basics",
    title: "English Grammar: Parts of Speech and Tenses",
    category: "english",
    date: "2026-11-17",
    featured: true,
    description: "A quick revision sheet covering the eight parts of speech, all twelve tenses and the mistakes students make most often.",
    pdf: "english-grammar-basics.pdf", size: "3 KB", pages: 1,
    intro: "Grammar questions in recruitment tests repeat the same ideas again and again. Revise these basics until you can answer them without thinking.",
    sections: [
      { heading: "The eight parts of speech", points: [
        "Noun: the name of a person, place or thing (Karachi, teacher, book).",
        "Pronoun: replaces a noun (he, she, it, they).",
        "Verb: shows an action or state (run, is, become).",
        "Adjective: describes a noun (tall, green, difficult).",
        "Adverb: describes a verb, adjective or another adverb (quickly, very).",
        "Preposition: shows a relationship in time or place (in, on, at, between).",
        "Conjunction: joins words or clauses (and, but, because).",
        "Interjection: a sudden exclamation (Wow! Oh!)."
      ]},
      { heading: "The twelve tenses with one example each", points: [
        "Simple present: She writes. Present continuous: She is writing.",
        "Present perfect: She has written. Present perfect continuous: She has been writing.",
        "Simple past: She wrote. Past continuous: She was writing.",
        "Past perfect: She had written. Past perfect continuous: She had been writing.",
        "Simple future: She will write. Future continuous: She will be writing.",
        "Future perfect: She will have written. Future perfect continuous: She will have been writing."
      ]},
      { heading: "Mistakes to avoid", points: [
        "Subject and verb must agree: He goes, they go. Neither of the boys was present.",
        "Use an before a vowel sound: an honest man, an hour, a university.",
        "Learn fixed prepositions: good at, interested in, afraid of, depend on.",
        "Do not mix tenses inside one sentence unless the meaning requires it."
      ]}
    ]
  },
  {
    id: "english-synonyms-antonyms",
    title: "Common Synonyms and Antonyms",
    category: "english",
    date: "2026-11-16",
    featured: false,
    description: "Sixteen frequently tested word pairs with a similar word and an opposite for each.",
    pdf: "english-synonyms-antonyms.pdf", size: "3 KB", pages: 1,
    intro: "Vocabulary questions are easier when you learn words in pairs. For each word below you get a synonym and an antonym.",
    sections: [
      { heading: "Word pairs, A to F", points: [
        "abundant: plentiful (opposite: scarce)",
        "accurate: correct (opposite: inaccurate)",
        "ancient: very old (opposite: modern)",
        "benevolent: kind (opposite: cruel)",
        "brave: courageous (opposite: cowardly)",
        "cautious: careful (opposite: reckless)",
        "essential: necessary (opposite: optional)",
        "expand: enlarge (opposite: shrink)",
        "fragile: delicate (opposite: sturdy)"
      ]},
      { heading: "Word pairs, G to V", points: [
        "generous: giving (opposite: stingy)",
        "humble: modest (opposite: arrogant)",
        "ordinary: common (opposite: unusual)",
        "permanent: lasting (opposite: temporary)",
        "rapid: fast (opposite: slow)",
        "transparent: clear (opposite: opaque)",
        "victory: triumph (opposite: defeat)"
      ]}
    ]
  },
  {
    id: "pakistan-movement-timeline",
    title: "Pakistan Movement: Key Dates",
    category: "pakistan-studies",
    date: "2026-11-15",
    featured: true,
    description: "A timeline of the main events from 1857 to 1947 that Pakistan Studies papers ask about.",
    pdf: "pakistan-movement-timeline.pdf", size: "3 KB", pages: 1,
    intro: "Dates and events from the Pakistan Movement appear in almost every Pakistan Studies section. Learn them in order.",
    sections: [
      { heading: "Timeline", points: [
        "1857: The War of Independence. The British Crown took direct control of India in the following year.",
        "1885: The Indian National Congress was founded.",
        "1906: The All-India Muslim League was founded at Dhaka.",
        "1909: The Morley-Minto Reforms gave Muslims separate electorates.",
        "1916: The Lucknow Pact was signed between the Congress and the Muslim League.",
        "1929: Quaid-e-Azam Muhammad Ali Jinnah presented his Fourteen Points.",
        "1930: Allama Iqbal delivered the Allahabad Address.",
        "1940: The Lahore Resolution was passed on 23 March.",
        "1946: Elections were held and the Cabinet Mission arrived.",
        "1947: Pakistan came into being on 14 August."
      ]},
      { heading: "How to revise", points: [
        "Write each year on one side of a flash card and the event on the other.",
        "Group dates into three phases: before 1906, 1906 to 1939, and 1940 to 1947.",
        "Link every date to a person: Iqbal and 1930, Jinnah and 1929, Fazlul Huq and 1940."
      ]}
    ]
  },
  {
    id: "constitutional-development",
    title: "Constitutional Development of Pakistan",
    category: "pakistan-studies",
    date: "2026-11-14",
    featured: false,
    description: "The path from the Objective Resolution to the Constitution of 1973 in a single page.",
    pdf: "constitutional-development.pdf", size: "3 KB", pages: 1,
    intro: "Questions on constitutions usually ask for the year, the system of government or a key feature. This sheet gives you all three.",
    sections: [
      { heading: "Milestones", points: [
        "1947: The Government of India Act 1935, with changes, served as the interim constitution.",
        "1949: The Objective Resolution was passed by the Constituent Assembly.",
        "1956: The first constitution came into force on 23 March and Pakistan became an Islamic Republic.",
        "1962: The second constitution introduced a presidential system.",
        "1973: The present constitution established a parliamentary system and came into force on 14 August 1973.",
        "2010: The 18th Amendment increased the powers of the provinces."
      ]},
      { heading: "Quick comparison", points: [
        "1956 and 1973: parliamentary system.",
        "1962: presidential system.",
        "1973 is the only constitution that has remained in force with amendments."
      ]}
    ]
  },
  {
    id: "world-capitals-currencies",
    title: "World Capitals and Currencies",
    category: "general-knowledge",
    date: "2026-11-13",
    featured: true,
    description: "Fifteen countries with their capitals and currencies, useful for general knowledge sections.",
    pdf: "world-capitals-currencies.pdf", size: "3 KB", pages: 1,
    intro: "Capitals and currencies are easy marks if you revise them regularly.",
    sections: [
      { heading: "Country, capital and currency", points: [
        "Pakistan: Islamabad, Pakistani rupee",
        "India: New Delhi, Indian rupee",
        "China: Beijing, yuan (renminbi)",
        "Japan: Tokyo, yen",
        "United Kingdom: London, pound sterling",
        "United States: Washington, D.C., US dollar",
        "France: Paris, euro",
        "Germany: Berlin, euro",
        "Saudi Arabia: Riyadh, riyal",
        "Turkey: Ankara, lira",
        "Iran: Tehran, rial",
        "Afghanistan: Kabul, afghani",
        "Bangladesh: Dhaka, taka",
        "Egypt: Cairo, Egyptian pound",
        "Canada: Ottawa, Canadian dollar"
      ]}
    ]
  },
  {
    id: "pakistan-quick-facts",
    title: "Pakistan Quick Facts",
    category: "general-knowledge",
    date: "2026-11-12",
    featured: false,
    description: "National symbols, important dates and geography facts about Pakistan in one place.",
    pdf: "pakistan-quick-facts.pdf", size: "3 KB", pages: 1,
    intro: "These are some of the most repeated facts in general knowledge sections of Pakistani tests.",
    sections: [
      { heading: "National symbols", points: [
        "Capital: Islamabad. Largest city: Karachi.",
        "National language: Urdu.",
        "National anthem lyrics: Hafeez Jalandhari.",
        "National flower: Jasmine. National animal: Markhor.",
        "National bird: Chukar (partridge). National tree: Deodar."
      ]},
      { heading: "Important days", points: [
        "Pakistan Day: 23 March.",
        "Independence Day: 14 August.",
        "Birthday of Quaid-e-Azam: 25 December.",
        "Birthday of Allama Iqbal: 9 November."
      ]},
      { heading: "Geography", points: [
        "Highest peak: K2 in the Karakoram range.",
        "Longest river: the Indus, which falls into the Arabian Sea.",
        "Largest province by area: Balochistan.",
        "Provinces: Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan."
      ]}
    ]
  },
  {
    id: "current-affairs-guide",
    title: "How to Prepare Current Affairs",
    category: "current-affairs",
    date: "2026-11-11",
    featured: true,
    description: "A practical method for keeping up with current affairs without memorising rumours or outdated facts.",
    pdf: "current-affairs-guide.pdf", size: "3 KB", pages: 1,
    intro: "Current affairs change every week, so a fixed list of facts goes out of date quickly. A good routine matters more than any single list.",
    sections: [
      { heading: "A simple daily routine", points: [
        "Spend 20 to 30 minutes each day on one reliable newspaper or news website.",
        "Keep a notebook with headings: Pakistan, world, economy, science, sports and awards.",
        "Write only what can be asked in a test: who, what, where and when.",
        "Review your notebook once a week and once more before the exam."
      ]},
      { heading: "What to focus on", points: [
        "The last six to twelve months before your exam date.",
        "Names of organisations, agreements, summits and the cities that host them.",
        "Important appointments and awards, noted together with the date.",
        "Basic facts about the economy such as the national budget and major projects."
      ]},
      { heading: "Be careful with", points: [
        "Rumours and unverified social media posts.",
        "Facts without a date. Always note when something happened.",
        "Old notes. Check anything that may have changed before you rely on it."
      ]}
    ]
  },
  {
    id: "math-formulas-quick",
    title: "Quick Maths Formulas for Recruitment Tests",
    category: "mathematics",
    date: "2026-11-10",
    featured: false,
    description: "Percentages, ratios, averages, simple interest and area formulas on a single revision sheet.",
    pdf: "math-formulas-quick.pdf", size: "3 KB", pages: 1,
    intro: "Most arithmetic questions in recruitment tests use a small set of formulas. Memorise these and practise applying them.",
    sections: [
      { heading: "Arithmetic", points: [
        "Percentage = (part / whole) x 100.",
        "Average = sum of values / number of values.",
        "Ratio a : b can be written as a/b. Divide both terms by their HCF to simplify.",
        "The product of two numbers = their LCM x their HCF.",
        "Simple interest = (Principal x Rate x Time) / 100.",
        "Profit percentage = (profit / cost price) x 100.",
        "Speed = distance / time."
      ]},
      { heading: "Geometry", points: [
        "Rectangle: area = length x width, perimeter = 2 x (length + width).",
        "Square: area = side x side, perimeter = 4 x side.",
        "Triangle: area = 1/2 x base x height.",
        "Circle: area = pi x r x r, circumference = 2 x pi x r."
      ]}
    ]
  },
  {
    id: "science-body-vitamins",
    title: "Human Body and Vitamins",
    category: "science",
    date: "2026-11-09",
    featured: false,
    description: "Vitamins, the diseases linked to their deficiency and some human body facts frequently asked in tests.",
    pdf: "science-body-vitamins.pdf", size: "3 KB", pages: 1,
    intro: "Biology questions in general science sections often come from this short list.",
    sections: [
      { heading: "Vitamins and their roles", points: [
        "Vitamin A: healthy vision and skin. Deficiency can cause night blindness.",
        "Vitamin B group: energy release and nerve function.",
        "Vitamin C: wound healing. Deficiency causes scurvy.",
        "Vitamin D: strong bones. Deficiency causes rickets in children.",
        "Vitamin E: acts as an antioxidant.",
        "Vitamin K: helps blood to clot."
      ]},
      { heading: "Body facts", points: [
        "An adult human has 206 bones.",
        "The heart has four chambers.",
        "The skin is the largest organ of the body.",
        "Normal body temperature is about 37 degrees Celsius.",
        "The four main blood groups are A, B, AB and O.",
        "Mitochondria are known as the powerhouse of the cell."
      ]}
    ]
  },
  {
    id: "computer-fundamentals",
    title: "Computer Fundamentals Quick Notes",
    category: "computer",
    date: "2026-11-08",
    featured: true,
    description: "Hardware, software, memory units, file types and common shortcuts for job and entry tests.",
    pdf: "computer-fundamentals.pdf", size: "3 KB", pages: 1,
    intro: "Computer sections in recruitment tests are usually basic. Make sure you can answer these without hesitation.",
    sections: [
      { heading: "Basics", points: [
        "Hardware is the physical part of a computer. Software is the set of programs that run on it.",
        "Input devices: keyboard, mouse, scanner. Output devices: monitor, printer, speaker.",
        "The CPU (Central Processing Unit) processes instructions.",
        "RAM is temporary working memory. Storage such as an SSD or hard disk keeps data permanently.",
        "Windows, Linux and macOS are operating systems."
      ]},
      { heading: "Units and file types", points: [
        "8 bits = 1 byte. 1 KB = 1024 bytes. Then MB, GB and TB, each 1024 times larger.",
        "Word documents: .docx. Spreadsheets: .xlsx. Presentations: .pptx.",
        "Other common types: .pdf, .jpg, .png, .mp3, .txt."
      ]},
      { heading: "Shortcuts and the internet", points: [
        "Ctrl + C copy, Ctrl + V paste, Ctrl + X cut, Ctrl + Z undo, Ctrl + S save, Ctrl + P print.",
        "A browser such as Chrome or Firefox opens websites. A URL is the address of a web page.",
        "HTML is the language used to structure web pages."
      ]}
    ]
  },
  {
    id: "islamiat-essentials",
    title: "Islamiat Essentials",
    category: "islamiat",
    date: "2026-11-07",
    featured: false,
    description: "The five pillars, the Quran in numbers, the first four caliphs and important dates in a short summary.",
    pdf: "islamiat-essentials.pdf", size: "3 KB", pages: 1,
    intro: "A compact summary of facts that are commonly asked in the Islamiat section of recruitment tests.",
    sections: [
      { heading: "Five pillars of Islam", points: [
        "Shahada: the declaration of faith.",
        "Salah: the five daily prayers.",
        "Zakat: obligatory charity.",
        "Sawm: fasting during the month of Ramadan.",
        "Hajj: pilgrimage to Makkah for those who are able."
      ]},
      { heading: "The Quran and early history", points: [
        "The Quran has 114 surahs and 30 juz (paras).",
        "The Hijra to Madinah took place in 622 CE, which marks the start of the Islamic calendar.",
        "The Battle of Badr took place in 2 AH.",
        "The four Rightly Guided Caliphs in order: Abu Bakr, Umar, Uthman and Ali (may Allah be pleased with them).",
        "The first month of the Islamic calendar is Muharram and the ninth is Ramadan."
      ]}
    ]
  },
  {
    id: "university-test-strategy",
    title: "University Entry Test: Preparation Strategy",
    category: "university-preparation",
    date: "2026-11-06",
    featured: false,
    description: "How to plan your study time, use practice tests and handle the day of an entry test.",
    pdf: "university-test-strategy.pdf", size: "3 KB", pages: 1,
    intro: "This is general advice that applies to most entry tests. Always check the exact format and syllabus on the university's official website.",
    sections: [
      { heading: "Plan your preparation", points: [
        "Find the official syllabus and test format first. Marks per subject differ between universities.",
        "Start with the basics of each subject before moving to difficult problems.",
        "Divide the weeks you have between subjects and write the plan down.",
        "Keep one day each week for revision only."
      ]},
      { heading: "Practise the right way", points: [
        "Solve multiple choice questions with a timer, as you will in the real test.",
        "Keep an error log. Write down every mistake and the reason behind it.",
        "Revise formulas and definitions in short sessions every day.",
        "Take full-length mock tests in the final weeks."
      ]},
      { heading: "On the day", points: [
        "Carry the documents named in your admit card and arrive early.",
        "Answer easy questions first and return to harder ones.",
        "Do not spend too long on one question."
      ]}
    ]
  },
  {
    id: "job-test-preparation-guide",
    title: "Preparing for Government Job Tests",
    category: "job-preparation",
    date: "2026-11-05",
    featured: false,
    description: "A step-by-step approach to preparing for recruitment tests, from reading the advertisement to your final revision.",
    pdf: "job-test-preparation-guide.pdf", size: "3 KB", pages: 1,
    intro: "Different departments follow different formats, so use this as a general plan and confirm every detail from the official advertisement.",
    sections: [
      { heading: "Before you start", points: [
        "Read the official job advertisement fully: qualifications, age limit, last date and test details.",
        "Collect the syllabus or past test format from the official website of the department or testing service.",
        "Note which subjects are covered. These commonly include English, general knowledge, Pakistan Studies, Islamiat, mathematics and computer."
      ]},
      { heading: "Build a routine", points: [
        "Make a weekly timetable and give more time to your weaker subjects.",
        "Read a newspaper daily for current affairs and vocabulary.",
        "Take one timed practice test every few days and review every wrong answer.",
        "Revise notes and formulas regularly instead of only before the test."
      ]},
      { heading: "Stay organised", points: [
        "Keep copies of your documents ready.",
        "Check the official website regularly for changes to dates or the test centre.",
        "Rely on official sources for any decision about applying."
      ]}
    ]
  }
];
