/* SUJAG Education - data-tests.js
   Written by the admin panel on 2026-11-23. You can still edit this file by hand. */
window.SUJAG = window.SUJAG || {};
SUJAG.data = SUJAG.data || {};
SUJAG.data.testCategories = [
  {
    "id": "other-govt",
    "name": "Other Jobs",
    "icon": "briefcase",
    "description": "Clerical and general aptitude practice for other private or govt posts."
  },
  {
    "id": "spsc",
    "name": "SPSC",
    "icon": "landmark",
    "description": "Practice for Sindh Public Service Commission style recruitment tests."
  },
  {
    "id": "sts",
    "name": "STS",
    "icon": "clipboard",
    "description": "Practice for Sindh Testing Service style screening tests."
  },
  {
    "id": "fpsc",
    "name": "FPSC",
    "icon": "flag",
    "description": "General ability practice for federal recruitment examinations."
  },
  {
    "id": "ppsc",
    "name": "PPSC",
    "icon": "building",
    "description": "Pakistan Studies and Islamiat practice for Punjab recruitment tests."
  },
  {
    "id": "police",
    "name": "Police Jobs",
    "icon": "shield",
    "description": "Practice for police constable and related recruitment tests."
  },
  {
    "id": "university",
    "name": "University Entry Tests",
    "icon": "graduation-cap",
    "description": "Mathematics and physics practice for university admission tests."
  },
  {
    "id": "general-knowledge",
    "name": "General Knowledge",
    "icon": "globe",
    "description": "World and Pakistan general knowledge for any test."
  },
  {
    "id": "english",
    "name": "English",
    "icon": "type",
    "description": "Grammar, vocabulary and usage practice."
  },
  {
    "id": "mathematics",
    "name": "Mathematics",
    "icon": "calculator",
    "description": "Arithmetic and basic mathematics for recruitment tests."
  },
  {
    "id": "computer-science",
    "name": "Computer Science",
    "icon": "monitor",
    "description": "Computer fundamentals for job and entry tests."
  },
  {
    "id": "science",
    "name": "Science",
    "icon": "flask",
    "description": "General science for school, job and entry tests."
  },
  {
    "id": "current-affairs",
    "name": "Current Affairs",
    "icon": "newspaper",
    "description": "World organizations and awareness questions."
  }
];

SUJAG.data.testGroups = [
  {
    "id": "government-jobs",
    "name": "Government Jobs",
    "icon": "briefcase",
    "includes": [
      "spsc",
      "sts",
      "fpsc",
      "ppsc",
      "police",
      "other-govt"
    ],
    "description": "SPSC, STS, FPSC, PPSC, police and other recruitment tests."
  }
];

SUJAG.data.defaultInstructions = [
  "Read each question carefully and choose the one option you think is correct.",
  "Every question carries one mark. There is no negative marking in these practice tests.",
  "You can move between questions at any time using Previous, Next or the question numbers.",
  "Your selected answers are kept while you move around, and you can change them before you submit.",
  "The timer starts when you press Start Test. The test is submitted automatically when time runs out.",
  "A refresh restores your progress on this device. The timer continues to run.",
  "On the final question, choose Submit test. You can review unanswered questions before confirming. Your result is sent to Sujag Education and you can download your PDF."
];

SUJAG.data.tests = [
  {
    "id": "spsc-gk-1",
    "title": "SPSC General Knowledge Practice Test 1",
    "category": "spsc",
    "difficulty": "Medium",
    "duration": 12,
    "featured": true,
    "description": "Pakistan, Sindh and world general knowledge in the style of commission screening tests.",
    "questions": [
      {
        "q": "Which city is the capital of Sindh province?",
        "o": [
          "Hyderabad",
          "Karachi",
          "Sukkur",
          "Larkana"
        ],
        "a": 1,
        "e": "Karachi is the provincial capital of Sindh and the largest city in Pakistan."
      },
      {
        "q": "Mohenjo-daro, a major Indus Valley Civilization site, is located in which district of Sindh?",
        "o": [
          "Larkana",
          "Sukkur",
          "Thatta",
          "Dadu"
        ],
        "a": 0,
        "e": "Mohenjo-daro lies in Larkana District and is a UNESCO World Heritage Site."
      },
      {
        "q": "Which is the longest river of Pakistan?",
        "o": [
          "Jhelum",
          "Indus",
          "Ravi",
          "Sutlej"
        ],
        "a": 1,
        "e": "The Indus rises in Tibet and flows through Pakistan to the Arabian Sea."
      },
      {
        "q": "In which year did Pakistan come into being?",
        "o": [
          "1945",
          "1946",
          "1947",
          "1948"
        ],
        "a": 2,
        "e": "Pakistan became independent on 14 August 1947."
      },
      {
        "q": "K2, the highest peak in Pakistan, belongs to which mountain range?",
        "o": [
          "Himalaya",
          "Karakoram",
          "Hindu Kush",
          "Sulaiman"
        ],
        "a": 1,
        "e": "K2 is in the Karakoram range and is the second highest mountain in the world."
      },
      {
        "q": "The Lahore Resolution was passed in which year?",
        "o": [
          "1930",
          "1935",
          "1940",
          "1946"
        ],
        "a": 2,
        "e": "The resolution was passed at Lahore on 23 March 1940."
      },
      {
        "q": "Which province of Pakistan is the largest by area?",
        "o": [
          "Punjab",
          "Sindh",
          "Khyber Pakhtunkhwa",
          "Balochistan"
        ],
        "a": 3,
        "e": "Balochistan covers nearly 44 percent of Pakistan's land area."
      },
      {
        "q": "What is the national language of Pakistan?",
        "o": [
          "Sindhi",
          "Urdu",
          "Punjabi",
          "English"
        ],
        "a": 1,
        "e": "Urdu is the national language. English and Urdu are the official languages."
      },
      {
        "q": "Into which sea does the Indus River finally fall?",
        "o": [
          "Arabian Sea",
          "Red Sea",
          "Caspian Sea",
          "Bay of Bengal"
        ],
        "a": 0,
        "e": "The Indus delta is in Sindh, where the river meets the Arabian Sea."
      },
      {
        "q": "Sukkur Barrage is built on which river?",
        "o": [
          "Indus",
          "Jhelum",
          "Chenab",
          "Kabul"
        ],
        "a": 0,
        "e": "Sukkur Barrage was completed in 1932 on the Indus River."
      }
    ]
  },
  {
    "id": "sts-english-1",
    "title": "STS English Grammar Practice Test",
    "category": "sts",
    "difficulty": "Easy",
    "duration": 10,
    "featured": true,
    "description": "Grammar, spelling, tenses and word choice questions for screening tests.",
    "questions": [
      {
        "q": "She ___ to school every day.",
        "o": [
          "go",
          "goes",
          "going",
          "gone"
        ],
        "a": 1,
        "e": "A singular subject in the simple present takes a verb ending in -s: she goes."
      },
      {
        "q": "Choose the correct plural of \"child\".",
        "o": [
          "childs",
          "childes",
          "children",
          "childrens"
        ],
        "a": 2,
        "e": "Child has an irregular plural: children."
      },
      {
        "q": "He is ___ honest man.",
        "o": [
          "a",
          "an",
          "the",
          "no article"
        ],
        "a": 1,
        "e": "Honest begins with a vowel sound (the h is silent), so we use \"an\"."
      },
      {
        "q": "Neither of the two boys ___ present today.",
        "o": [
          "were",
          "are",
          "was",
          "have"
        ],
        "a": 2,
        "e": "\"Neither\" is treated as singular, so the verb is \"was\"."
      },
      {
        "q": "Choose the correct spelling.",
        "o": [
          "Neccessary",
          "Necessary",
          "Necesary",
          "Neccesary"
        ],
        "a": 1,
        "e": "Necessary has one c and two s's."
      },
      {
        "q": "What is the past tense of \"write\"?",
        "o": [
          "writed",
          "wrote",
          "written",
          "writing"
        ],
        "a": 1,
        "e": "Write, wrote, written. \"Wrote\" is the simple past."
      },
      {
        "q": "She is very good ___ mathematics.",
        "o": [
          "in",
          "on",
          "at",
          "with"
        ],
        "a": 2,
        "e": "We say \"good at\" a subject or skill."
      },
      {
        "q": "Choose the synonym of \"abundant\".",
        "o": [
          "scarce",
          "plentiful",
          "tiny",
          "costly"
        ],
        "a": 1,
        "e": "Abundant means existing in large quantities, which is the same as plentiful."
      },
      {
        "q": "Choose the antonym of \"ancient\".",
        "o": [
          "old",
          "modern",
          "historic",
          "past"
        ],
        "a": 1,
        "e": "Ancient means very old; the opposite is modern."
      },
      {
        "q": "Which sentence is correct?",
        "o": [
          "He don't like tea.",
          "He doesn't like tea.",
          "He not like tea.",
          "He didn't likes tea."
        ],
        "a": 1,
        "e": "With he/she/it in the simple present negative, we use \"doesn't\" plus the base verb."
      }
    ]
  },
  {
    "id": "fpsc-general-1",
    "title": "FPSC General Ability Practice Test",
    "category": "fpsc",
    "difficulty": "Medium",
    "duration": 12,
    "featured": true,
    "description": "A mix of Pakistan affairs, geography and basic science questions.",
    "questions": [
      {
        "q": "Who was the first Prime Minister of Pakistan?",
        "o": [
          "Liaquat Ali Khan",
          "Khawaja Nazimuddin",
          "Muhammad Ali Bogra",
          "Chaudhry Muhammad Ali"
        ],
        "a": 0,
        "e": "Liaquat Ali Khan served as Pakistan's first Prime Minister from 1947 until 1951."
      },
      {
        "q": "Who wrote the lyrics of Pakistan's national anthem?",
        "o": [
          "Allama Iqbal",
          "Hafeez Jalandhari",
          "Faiz Ahmed Faiz",
          "Ahmed Faraz"
        ],
        "a": 1,
        "e": "Hafeez Jalandhari wrote the lyrics; Ahmed G. Chagla composed the music."
      },
      {
        "q": "Which pass near Peshawar connects Pakistan with Afghanistan?",
        "o": [
          "Bolan Pass",
          "Khyber Pass",
          "Lowari Pass",
          "Khunjerab Pass"
        ],
        "a": 1,
        "e": "The Khyber Pass links Khyber Pakhtunkhwa with Afghanistan."
      },
      {
        "q": "The Khunjerab Pass connects Pakistan with which country?",
        "o": [
          "Afghanistan",
          "Iran",
          "China",
          "India"
        ],
        "a": 2,
        "e": "Khunjerab Pass is on the Karakoram Highway and is the border crossing with China."
      },
      {
        "q": "Who is the national poet of Pakistan?",
        "o": [
          "Mirza Ghalib",
          "Allama Muhammad Iqbal",
          "Altaf Hussain Hali",
          "Josh Malihabadi"
        ],
        "a": 1,
        "e": "Allama Muhammad Iqbal is known as the poet of the East and Pakistan's national poet."
      },
      {
        "q": "In which city is the Federal Public Service Commission headquartered?",
        "o": [
          "Lahore",
          "Karachi",
          "Islamabad",
          "Peshawar"
        ],
        "a": 2,
        "e": "FPSC has its headquarters in Islamabad."
      },
      {
        "q": "What is the SI unit of force?",
        "o": [
          "Joule",
          "Newton",
          "Pascal",
          "Watt"
        ],
        "a": 1,
        "e": "Force is measured in newtons (N)."
      },
      {
        "q": "What is the chemical symbol of gold?",
        "o": [
          "Ag",
          "Au",
          "Gd",
          "Go"
        ],
        "a": 1,
        "e": "Au comes from the Latin word aurum."
      },
      {
        "q": "How many provinces does Pakistan have?",
        "o": [
          "3",
          "4",
          "5",
          "6"
        ],
        "a": 1,
        "e": "Pakistan has four provinces: Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan."
      },
      {
        "q": "What is the national flower of Pakistan?",
        "o": [
          "Rose",
          "Jasmine",
          "Tulip",
          "Lotus"
        ],
        "a": 1,
        "e": "Jasmine (Chambeli) is the national flower of Pakistan."
      }
    ]
  },
  {
    "id": "ppsc-studies-1",
    "title": "PPSC Pakistan Studies and Islamiat Practice Test",
    "category": "ppsc",
    "difficulty": "Medium",
    "duration": 12,
    "featured": false,
    "description": "Pakistan movement, constitutional history and basic Islamiat questions.",
    "questions": [
      {
        "q": "Who moved the Lahore Resolution in 1940?",
        "o": [
          "Liaquat Ali Khan",
          "A. K. Fazlul Huq",
          "Allama Iqbal",
          "Sir Syed Ahmad Khan"
        ],
        "a": 1,
        "e": "A. K. Fazlul Huq moved the resolution at the Lahore session of the All-India Muslim League."
      },
      {
        "q": "Allama Iqbal presented the idea of a separate Muslim state in his Allahabad Address in which year?",
        "o": [
          "1920",
          "1927",
          "1930",
          "1940"
        ],
        "a": 2,
        "e": "He delivered the address as President of the Muslim League in 1930."
      },
      {
        "q": "In which Islamic month do Muslims observe the fast?",
        "o": [
          "Rajab",
          "Shaban",
          "Ramadan",
          "Shawwal"
        ],
        "a": 2,
        "e": "Fasting during Ramadan is one of the five pillars of Islam."
      },
      {
        "q": "How many surahs are there in the Holy Quran?",
        "o": [
          "100",
          "110",
          "114",
          "120"
        ],
        "a": 2,
        "e": "The Quran has 114 surahs."
      },
      {
        "q": "Who was the first Caliph of Islam?",
        "o": [
          "Hazrat Umar (RA)",
          "Hazrat Abu Bakr (RA)",
          "Hazrat Uthman (RA)",
          "Hazrat Ali (RA)"
        ],
        "a": 1,
        "e": "Hazrat Abu Bakr (RA) became the first Caliph after the Prophet (PBUH)."
      },
      {
        "q": "In which year of the Hijri calendar did the Battle of Badr take place?",
        "o": [
          "1 AH",
          "2 AH",
          "3 AH",
          "5 AH"
        ],
        "a": 1,
        "e": "The Battle of Badr took place in Ramadan, 2 AH."
      },
      {
        "q": "How many pillars of Islam are there?",
        "o": [
          "3",
          "4",
          "5",
          "6"
        ],
        "a": 2,
        "e": "The five pillars are Shahada, Salah, Zakat, Sawm and Hajj."
      },
      {
        "q": "The Objective Resolution was passed by the Constituent Assembly of Pakistan in:",
        "o": [
          "1947",
          "1949",
          "1956",
          "1962"
        ],
        "a": 1,
        "e": "It was passed in March 1949 and later became a preamble to the constitutions."
      },
      {
        "q": "Pakistan's first constitution came into force in which year?",
        "o": [
          "1947",
          "1950",
          "1956",
          "1962"
        ],
        "a": 2,
        "e": "The first constitution was enforced on 23 March 1956."
      },
      {
        "q": "Which constitution is currently in force in Pakistan?",
        "o": [
          "The Constitution of 1956",
          "The Constitution of 1962",
          "The Constitution of 1973",
          "The Constitution of 1985"
        ],
        "a": 2,
        "e": "The Constitution of 1973 came into force on 14 August 1973."
      }
    ]
  },
  {
    "id": "police-constable-1",
    "title": "Police Constable Recruitment Practice Test",
    "category": "police",
    "difficulty": "Easy",
    "duration": 10,
    "featured": false,
    "description": "General knowledge, reasoning and basic arithmetic for constable-level tests.",
    "questions": [
      {
        "q": "FIR stands for:",
        "o": [
          "First Information Report",
          "Final Investigation Record",
          "First Inquiry Review",
          "Federal Information Report"
        ],
        "a": 0,
        "e": "An FIR is the First Information Report recorded by police about a reported offence."
      },
      {
        "q": "Which number is commonly used to reach the police in an emergency in Pakistan?",
        "o": [
          "911",
          "15",
          "999",
          "199"
        ],
        "a": 1,
        "e": "15 is the police emergency number in Pakistan."
      },
      {
        "q": "Complete the series: 2, 4, 8, 16, ?",
        "o": [
          "24",
          "30",
          "32",
          "36"
        ],
        "a": 2,
        "e": "Each number is double the previous one, so the next is 32."
      },
      {
        "q": "Find the odd one out.",
        "o": [
          "Lion",
          "Tiger",
          "Leopard",
          "Cow"
        ],
        "a": 3,
        "e": "Lion, tiger and leopard are wild big cats. A cow is a domestic animal."
      },
      {
        "q": "CNIC stands for:",
        "o": [
          "Computerized National Identity Card",
          "Central National Identity Certificate",
          "Computer Network Identity Card",
          "Computerized Native Identity Code"
        ],
        "a": 0,
        "e": "CNIC is the Computerized National Identity Card issued by NADRA."
      },
      {
        "q": "A vehicle travels 60 km in 1 hour at a steady speed. How far will it travel in 3 hours?",
        "o": [
          "120 km",
          "150 km",
          "180 km",
          "240 km"
        ],
        "a": 2,
        "e": "Distance = speed x time = 60 x 3 = 180 km."
      },
      {
        "q": "What is the opposite of \"guilty\"?",
        "o": [
          "Innocent",
          "Careful",
          "Honest",
          "Strong"
        ],
        "a": 0,
        "e": "The opposite of guilty is innocent."
      },
      {
        "q": "What is the national animal of Pakistan?",
        "o": [
          "Markhor",
          "Snow leopard",
          "Lion",
          "Indus dolphin"
        ],
        "a": 0,
        "e": "The markhor, a wild goat found in northern mountains, is the national animal."
      },
      {
        "q": "Which of these is a primary duty of the police?",
        "o": [
          "Collecting taxes",
          "Maintaining law and order",
          "Running hospitals",
          "Printing currency"
        ],
        "a": 1,
        "e": "Maintaining law and order and protecting life and property are core police duties."
      },
      {
        "q": "What is the capital city of Punjab?",
        "o": [
          "Faisalabad",
          "Lahore",
          "Multan",
          "Rawalpindi"
        ],
        "a": 1,
        "e": "Lahore is the capital of Punjab province."
      }
    ]
  },
  {
    "id": "clerical-aptitude-1",
    "title": "Clerical Jobs General Aptitude Test",
    "category": "other-govt",
    "difficulty": "Easy",
    "duration": 10,
    "featured": false,
    "description": "Basic arithmetic, English and computer questions for clerical and assistant posts.",
    "questions": [
      {
        "q": "What is 15% of 200?",
        "o": [
          "20",
          "25",
          "30",
          "35"
        ],
        "a": 2,
        "e": "15% of 200 = 0.15 x 200 = 30."
      },
      {
        "q": "Simplify: 25 + 75 ÷ 5",
        "o": [
          "20",
          "40",
          "50",
          "100"
        ],
        "a": 1,
        "e": "Division comes first: 75 ÷ 5 = 15, then 25 + 15 = 40."
      },
      {
        "q": "How many metres are there in one kilometre?",
        "o": [
          "100",
          "500",
          "1000",
          "10000"
        ],
        "a": 2,
        "e": "1 km = 1000 m."
      },
      {
        "q": "Which file extension is used by a modern Microsoft Word document?",
        "o": [
          ".docx",
          ".xlsx",
          ".pptx",
          ".jpg"
        ],
        "a": 0,
        "e": "Word documents saved in recent versions use the .docx extension."
      },
      {
        "q": "Choose the synonym of \"rapid\".",
        "o": [
          "slow",
          "fast",
          "weak",
          "quiet"
        ],
        "a": 1,
        "e": "Rapid means happening very quickly."
      },
      {
        "q": "Express the ratio 12 : 18 in its simplest form.",
        "o": [
          "1 : 2",
          "2 : 3",
          "3 : 4",
          "4 : 5"
        ],
        "a": 1,
        "e": "Divide both numbers by 6 to get 2 : 3."
      },
      {
        "q": "Which of these is a spreadsheet program?",
        "o": [
          "Microsoft Excel",
          "Notepad",
          "Paint",
          "Media Player"
        ],
        "a": 0,
        "e": "Excel is a spreadsheet application used for tables and calculations."
      },
      {
        "q": "If 5 pens cost Rs. 50, what is the cost of 8 pens?",
        "o": [
          "Rs. 70",
          "Rs. 80",
          "Rs. 85",
          "Rs. 90"
        ],
        "a": 1,
        "e": "One pen costs Rs. 10, so 8 pens cost Rs. 80."
      },
      {
        "q": "Choose the correct spelling.",
        "o": [
          "Recieve",
          "Receive",
          "Receeve",
          "Receve"
        ],
        "a": 1,
        "e": "Remember the rule: i before e, except after c."
      },
      {
        "q": "How many days are there in a leap year?",
        "o": [
          "364",
          "365",
          "366",
          "367"
        ],
        "a": 2,
        "e": "A leap year has 366 days because February has 29 days."
      }
    ]
  },
  {
    "id": "entry-math-physics-1",
    "title": "University Entry Test: Mathematics and Physics",
    "category": "university",
    "difficulty": "Hard",
    "duration": 15,
    "featured": true,
    "description": "Calculus, algebra and mechanics questions at entry-test level.",
    "questions": [
      {
        "q": "What is the derivative of x³ + 2x with respect to x?",
        "o": [
          "3x² + 2",
          "x² + 2",
          "3x + 2",
          "3x² + 2x"
        ],
        "a": 0,
        "e": "Differentiate term by term: d/dx(x³) = 3x² and d/dx(2x) = 2."
      },
      {
        "q": "What is the value of sin 30°?",
        "o": [
          "1/2",
          "√3/2",
          "1",
          "0"
        ],
        "a": 0,
        "e": "sin 30° = 1/2, one of the standard trigonometric values."
      },
      {
        "q": "What are the roots of x² − 5x + 6 = 0?",
        "o": [
          "1 and 6",
          "2 and 3",
          "−2 and −3",
          "5 and 1"
        ],
        "a": 1,
        "e": "Factorise: (x − 2)(x − 3) = 0, so x = 2 or x = 3."
      },
      {
        "q": "What is the determinant of the matrix [[1, 2], [3, 4]]?",
        "o": [
          "−2",
          "2",
          "10",
          "−10"
        ],
        "a": 0,
        "e": "Determinant = (1 x 4) − (2 x 3) = 4 − 6 = −2."
      },
      {
        "q": "What is ∫ 2x dx?",
        "o": [
          "x² + C",
          "2x² + C",
          "x + C",
          "2 + C"
        ],
        "a": 0,
        "e": "The integral of 2x is x², plus the constant of integration C."
      },
      {
        "q": "Which of the following is a vector quantity?",
        "o": [
          "Speed",
          "Mass",
          "Velocity",
          "Time"
        ],
        "a": 2,
        "e": "Velocity has both magnitude and direction. Speed, mass and time are scalars."
      },
      {
        "q": "A body of mass 5 kg accelerates at 2 m/s². What is the net force acting on it?",
        "o": [
          "2.5 N",
          "7 N",
          "10 N",
          "25 N"
        ],
        "a": 2,
        "e": "Newton's second law: F = ma = 5 x 2 = 10 N."
      },
      {
        "q": "What is the value of log₁₀ 1000?",
        "o": [
          "1",
          "2",
          "3",
          "10"
        ],
        "a": 2,
        "e": "10³ = 1000, so log₁₀ 1000 = 3."
      },
      {
        "q": "What is the kinetic energy of a 2 kg object moving at 3 m/s?",
        "o": [
          "3 J",
          "6 J",
          "9 J",
          "18 J"
        ],
        "a": 2,
        "e": "KE = ½ m v² = 0.5 x 2 x 9 = 9 J."
      },
      {
        "q": "What is the sum of the first 10 natural numbers?",
        "o": [
          "45",
          "50",
          "55",
          "100"
        ],
        "a": 2,
        "e": "Use n(n + 1)/2 = 10 x 11 / 2 = 55."
      }
    ]
  },
  {
    "id": "gk-world-1",
    "title": "World General Knowledge Quiz",
    "category": "general-knowledge",
    "difficulty": "Easy",
    "duration": 10,
    "featured": true,
    "description": "Geography, science and literature basics that appear in many recruitment tests.",
    "questions": [
      {
        "q": "Which is the largest ocean in the world?",
        "o": [
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Arctic Ocean"
        ],
        "a": 2,
        "e": "The Pacific Ocean covers about one third of the Earth's surface."
      },
      {
        "q": "What is the capital of Japan?",
        "o": [
          "Kyoto",
          "Tokyo",
          "Osaka",
          "Seoul"
        ],
        "a": 1,
        "e": "Tokyo is the capital and largest city of Japan."
      },
      {
        "q": "Which planet is known as the Red Planet?",
        "o": [
          "Venus",
          "Mars",
          "Jupiter",
          "Mercury"
        ],
        "a": 1,
        "e": "Mars looks red because of iron oxide on its surface."
      },
      {
        "q": "How many continents are there?",
        "o": [
          "5",
          "6",
          "7",
          "8"
        ],
        "a": 2,
        "e": "The seven continents are Asia, Africa, North America, South America, Antarctica, Europe and Australia."
      },
      {
        "q": "Who wrote the play \"Hamlet\"?",
        "o": [
          "Charles Dickens",
          "William Shakespeare",
          "Mark Twain",
          "Jane Austen"
        ],
        "a": 1,
        "e": "Hamlet is a tragedy written by William Shakespeare."
      },
      {
        "q": "Which is the largest hot desert in the world?",
        "o": [
          "Gobi",
          "Kalahari",
          "Sahara",
          "Thar"
        ],
        "a": 2,
        "e": "The Sahara in northern Africa is the largest hot desert."
      },
      {
        "q": "What is the currency of Japan?",
        "o": [
          "Won",
          "Yuan",
          "Yen",
          "Ringgit"
        ],
        "a": 2,
        "e": "Japan uses the yen."
      },
      {
        "q": "Which is the highest mountain above sea level?",
        "o": [
          "K2",
          "Mount Everest",
          "Kangchenjunga",
          "Makalu"
        ],
        "a": 1,
        "e": "Mount Everest, on the Nepal-China border, is the highest above sea level."
      },
      {
        "q": "Which gas do humans need to breathe in to live?",
        "o": [
          "Nitrogen",
          "Oxygen",
          "Carbon dioxide",
          "Hydrogen"
        ],
        "a": 1,
        "e": "Our bodies use oxygen for cellular respiration."
      },
      {
        "q": "In which country is the Eiffel Tower located?",
        "o": [
          "Italy",
          "France",
          "Spain",
          "Germany"
        ],
        "a": 1,
        "e": "The Eiffel Tower stands in Paris, France."
      }
    ]
  },
  {
    "id": "english-vocab-1",
    "title": "English Vocabulary and Usage Practice",
    "category": "english",
    "difficulty": "Medium",
    "duration": 10,
    "featured": false,
    "description": "Synonyms, antonyms, idioms and common usage questions.",
    "questions": [
      {
        "q": "Choose the synonym of \"benevolent\".",
        "o": [
          "kind",
          "cruel",
          "careless",
          "quiet"
        ],
        "a": 0,
        "e": "Benevolent means well-meaning and kind."
      },
      {
        "q": "Choose the antonym of \"scarce\".",
        "o": [
          "rare",
          "limited",
          "plentiful",
          "small"
        ],
        "a": 2,
        "e": "Scarce means in short supply; plentiful is the opposite."
      },
      {
        "q": "What does \"procrastinate\" mean?",
        "o": [
          "To delay doing something",
          "To finish quickly",
          "To argue loudly",
          "To celebrate"
        ],
        "a": 0,
        "e": "To procrastinate is to put off a task that should be done now."
      },
      {
        "q": "What does the idiom \"break the ice\" mean?",
        "o": [
          "To damage something",
          "To start a conversation in a friendly way",
          "To freeze water",
          "To end a friendship"
        ],
        "a": 1,
        "e": "It means to ease tension and get a conversation going."
      },
      {
        "q": "Choose the opposite of \"transparent\".",
        "o": [
          "clear",
          "opaque",
          "thin",
          "bright"
        ],
        "a": 1,
        "e": "Transparent lets light through; opaque does not."
      },
      {
        "q": "Change to passive voice: \"The cat chased the mouse.\"",
        "o": [
          "The mouse chased the cat.",
          "The mouse was chased by the cat.",
          "The cat was chased by the mouse.",
          "The mouse is chasing the cat."
        ],
        "a": 1,
        "e": "In the passive, the object becomes the subject: the mouse was chased by the cat."
      },
      {
        "q": "Fill in the blank: \"___ going to the market tomorrow.\"",
        "o": [
          "Their",
          "There",
          "They're",
          "Them"
        ],
        "a": 2,
        "e": "They're is the short form of \"they are\"."
      },
      {
        "q": "What does \"meticulous\" mean?",
        "o": [
          "careless",
          "very careful about details",
          "lazy",
          "noisy"
        ],
        "a": 1,
        "e": "A meticulous person pays close attention to detail."
      },
      {
        "q": "Which one word means \"a person who writes books\"?",
        "o": [
          "Author",
          "Editor",
          "Reader",
          "Printer"
        ],
        "a": 0,
        "e": "An author is the writer of a book."
      },
      {
        "q": "Choose the correctly punctuated sentence.",
        "o": [
          "Its a sunny day.",
          "It's a sunny day.",
          "Its' a sunny day.",
          "It is' a sunny day."
        ],
        "a": 1,
        "e": "It's is the contraction of \"it is\"."
      }
    ]
  },
  {
    "id": "math-basics-1",
    "title": "Mathematics Fundamentals Practice Test",
    "category": "mathematics",
    "difficulty": "Easy",
    "duration": 12,
    "featured": false,
    "description": "Arithmetic, percentages, ratios and simple interest for recruitment tests.",
    "questions": [
      {
        "q": "What is 12 x 12?",
        "o": [
          "124",
          "132",
          "144",
          "154"
        ],
        "a": 2,
        "e": "12 x 12 = 144."
      },
      {
        "q": "What is the square root of 169?",
        "o": [
          "11",
          "12",
          "13",
          "14"
        ],
        "a": 2,
        "e": "13 x 13 = 169."
      },
      {
        "q": "What is 25% of 80?",
        "o": [
          "15",
          "20",
          "25",
          "30"
        ],
        "a": 1,
        "e": "25% is one quarter, and 80 / 4 = 20."
      },
      {
        "q": "What is the LCM of 4 and 6?",
        "o": [
          "10",
          "12",
          "18",
          "24"
        ],
        "a": 1,
        "e": "The smallest number divisible by both 4 and 6 is 12."
      },
      {
        "q": "What is the HCF of 24 and 36?",
        "o": [
          "6",
          "8",
          "12",
          "18"
        ],
        "a": 2,
        "e": "The largest number that divides both 24 and 36 is 12."
      },
      {
        "q": "What is the average of 10, 20 and 30?",
        "o": [
          "15",
          "20",
          "25",
          "30"
        ],
        "a": 1,
        "e": "(10 + 20 + 30) / 3 = 20."
      },
      {
        "q": "What is 3/4 as a decimal?",
        "o": [
          "0.34",
          "0.5",
          "0.75",
          "0.8"
        ],
        "a": 2,
        "e": "3 divided by 4 is 0.75."
      },
      {
        "q": "What is the perimeter of a rectangle with length 8 cm and width 5 cm?",
        "o": [
          "13 cm",
          "26 cm",
          "40 cm",
          "80 cm"
        ],
        "a": 1,
        "e": "Perimeter = 2 x (8 + 5) = 26 cm."
      },
      {
        "q": "If x / 5 = 4, what is x?",
        "o": [
          "9",
          "15",
          "20",
          "25"
        ],
        "a": 2,
        "e": "Multiply both sides by 5 to get x = 20."
      },
      {
        "q": "What is the simple interest on Rs. 1,000 at 10% per year for 2 years?",
        "o": [
          "Rs. 100",
          "Rs. 150",
          "Rs. 200",
          "Rs. 210"
        ],
        "a": 2,
        "e": "Simple interest = P x R x T / 100 = 1000 x 10 x 2 / 100 = Rs. 200."
      }
    ]
  },
  {
    "id": "cs-basics-1",
    "title": "Computer Science Basics Test",
    "category": "computer-science",
    "difficulty": "Easy",
    "duration": 10,
    "featured": true,
    "description": "Computer fundamentals, hardware, software and the internet.",
    "questions": [
      {
        "q": "What does CPU stand for?",
        "o": [
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Program Utility",
          "Control Processing Unit"
        ],
        "a": 0,
        "e": "The CPU is the main processor that carries out instructions."
      },
      {
        "q": "Which of these is an input device?",
        "o": [
          "Monitor",
          "Keyboard",
          "Printer",
          "Speaker"
        ],
        "a": 1,
        "e": "A keyboard sends data into the computer, so it is an input device."
      },
      {
        "q": "How many bits are there in one byte?",
        "o": [
          "4",
          "8",
          "16",
          "32"
        ],
        "a": 1,
        "e": "One byte is made of eight bits."
      },
      {
        "q": "What does HTML stand for?",
        "o": [
          "HyperText Markup Language",
          "High Transfer Machine Language",
          "Hyperlink Text Making Language",
          "Home Tool Markup Language"
        ],
        "a": 0,
        "e": "HTML is the standard language for structuring web pages."
      },
      {
        "q": "Which of these is an operating system?",
        "o": [
          "Microsoft Excel",
          "Windows",
          "Google Chrome",
          "Adobe Reader"
        ],
        "a": 1,
        "e": "Windows is an operating system. The others are applications."
      },
      {
        "q": "Which statement best describes RAM?",
        "o": [
          "Permanent storage",
          "Temporary working memory",
          "An output device",
          "A network cable"
        ],
        "a": 1,
        "e": "RAM holds data being used right now and is cleared when power is off."
      },
      {
        "q": "Which keyboard shortcut is used to copy in Windows?",
        "o": [
          "Ctrl + V",
          "Ctrl + X",
          "Ctrl + C",
          "Ctrl + Z"
        ],
        "a": 2,
        "e": "Ctrl + C copies, Ctrl + V pastes, Ctrl + X cuts and Ctrl + Z undoes."
      },
      {
        "q": "What is the base of the binary number system?",
        "o": [
          "2",
          "8",
          "10",
          "16"
        ],
        "a": 0,
        "e": "Binary uses only two digits: 0 and 1."
      },
      {
        "q": "The physical parts of a computer are called:",
        "o": [
          "Software",
          "Hardware",
          "Freeware",
          "Malware"
        ],
        "a": 1,
        "e": "Hardware refers to physical components such as the keyboard, CPU and monitor."
      },
      {
        "q": "Which of these is a web browser?",
        "o": [
          "Microsoft Word",
          "Google Chrome",
          "Notepad",
          "Calculator"
        ],
        "a": 1,
        "e": "Google Chrome is a web browser used to open websites."
      }
    ]
  },
  {
    "id": "science-general-1",
    "title": "General Science Practice Test",
    "category": "science",
    "difficulty": "Medium",
    "duration": 10,
    "featured": false,
    "description": "Physics, chemistry and biology basics that appear in many tests.",
    "questions": [
      {
        "q": "What is the chemical formula of water?",
        "o": [
          "CO₂",
          "H₂O",
          "O₂",
          "NaCl"
        ],
        "a": 1,
        "e": "Each water molecule has two hydrogen atoms and one oxygen atom."
      },
      {
        "q": "Which planet is closest to the Sun?",
        "o": [
          "Venus",
          "Earth",
          "Mercury",
          "Mars"
        ],
        "a": 2,
        "e": "Mercury is the closest planet to the Sun."
      },
      {
        "q": "Which part of the cell is called its powerhouse?",
        "o": [
          "Nucleus",
          "Mitochondria",
          "Ribosome",
          "Chloroplast"
        ],
        "a": 1,
        "e": "Mitochondria release energy from food for the cell to use."
      },
      {
        "q": "Which gas do plants take in for photosynthesis?",
        "o": [
          "Oxygen",
          "Nitrogen",
          "Carbon dioxide",
          "Hydrogen"
        ],
        "a": 2,
        "e": "Plants use carbon dioxide, water and sunlight to make food."
      },
      {
        "q": "At sea level, at what temperature does water boil?",
        "o": [
          "90°C",
          "100°C",
          "110°C",
          "120°C"
        ],
        "a": 1,
        "e": "Water boils at 100°C at standard atmospheric pressure."
      },
      {
        "q": "How many bones are there in an adult human body?",
        "o": [
          "186",
          "206",
          "226",
          "306"
        ],
        "a": 1,
        "e": "An adult human skeleton has 206 bones."
      },
      {
        "q": "Which force pulls objects towards the Earth?",
        "o": [
          "Magnetism",
          "Friction",
          "Gravity",
          "Tension"
        ],
        "a": 2,
        "e": "Gravity is the force of attraction between the Earth and objects."
      },
      {
        "q": "Which vitamin does the skin make when exposed to sunlight?",
        "o": [
          "Vitamin A",
          "Vitamin B12",
          "Vitamin C",
          "Vitamin D"
        ],
        "a": 3,
        "e": "Sunlight helps the skin produce vitamin D."
      },
      {
        "q": "What is the chemical symbol of sodium?",
        "o": [
          "S",
          "So",
          "Na",
          "N"
        ],
        "a": 2,
        "e": "Na comes from the Latin word natrium."
      },
      {
        "q": "What is the approximate speed of light in a vacuum?",
        "o": [
          "3,000 km/s",
          "30,000 km/s",
          "300,000 km/s",
          "3,000,000 km/s"
        ],
        "a": 2,
        "e": "Light travels at about 300,000 kilometres per second."
      }
    ]
  },
  {
    "id": "world-orgs-1",
    "title": "World Organizations Awareness Test",
    "category": "current-affairs",
    "difficulty": "Medium",
    "duration": 10,
    "featured": false,
    "description": "Headquarters and basics of major international organizations, a common topic in current affairs sections.",
    "questions": [
      {
        "q": "Where is the headquarters of the United Nations located?",
        "o": [
          "Geneva",
          "New York",
          "Paris",
          "Vienna"
        ],
        "a": 1,
        "e": "The UN headquarters is in New York City."
      },
      {
        "q": "Where is the headquarters of the World Health Organization?",
        "o": [
          "Geneva",
          "New York",
          "Rome",
          "London"
        ],
        "a": 0,
        "e": "WHO is headquartered in Geneva, Switzerland."
      },
      {
        "q": "The Secretariat of the Organisation of Islamic Cooperation (OIC) is in which city?",
        "o": [
          "Cairo",
          "Jeddah",
          "Istanbul",
          "Islamabad"
        ],
        "a": 1,
        "e": "The OIC general secretariat is based in Jeddah, Saudi Arabia."
      },
      {
        "q": "Where is the headquarters of the International Monetary Fund (IMF)?",
        "o": [
          "Geneva",
          "Washington, D.C.",
          "London",
          "Brussels"
        ],
        "a": 1,
        "e": "The IMF is headquartered in Washington, D.C."
      },
      {
        "q": "The SAARC Secretariat is located in which city?",
        "o": [
          "Dhaka",
          "Kathmandu",
          "Colombo",
          "New Delhi"
        ],
        "a": 1,
        "e": "The SAARC Secretariat is in Kathmandu, Nepal."
      },
      {
        "q": "Where is the headquarters of UNESCO?",
        "o": [
          "Paris",
          "Geneva",
          "Rome",
          "Vienna"
        ],
        "a": 0,
        "e": "UNESCO is headquartered in Paris, France."
      },
      {
        "q": "The International Court of Justice has its seat in:",
        "o": [
          "Geneva",
          "The Hague",
          "Brussels",
          "Paris"
        ],
        "a": 1,
        "e": "The ICJ sits in the Peace Palace in The Hague, Netherlands."
      },
      {
        "q": "In which year was the United Nations founded?",
        "o": [
          "1919",
          "1945",
          "1950",
          "1965"
        ],
        "a": 1,
        "e": "The UN was founded in 1945 after the Second World War."
      },
      {
        "q": "Where is the headquarters of NATO?",
        "o": [
          "Brussels",
          "Paris",
          "Berlin",
          "London"
        ],
        "a": 0,
        "e": "NATO's headquarters is in Brussels, Belgium."
      },
      {
        "q": "Where is the World Trade Organization (WTO) headquartered?",
        "o": [
          "Geneva",
          "New York",
          "Paris",
          "Washington, D.C."
        ],
        "a": 0,
        "e": "The WTO is based in Geneva, Switzerland."
      }
    ]
  },
  {
    "id": "field-production-trainee-uep",
    "title": "Field Production Trainee - UEP",
    "kind": "mock",
    "category": "other-govt",
    "duration": 100,
    "difficulty": "Medium",
    "featured": true,
    "description": "Practice test with 100 questions.",
    "questions": [
      {
        "q": "What is the chemical formula of methane?",
        "o": [
          "C2H6",
          "CH4",
          "CO2",
          "H2S"
        ],
        "a": 1,
        "e": "Methane is the simplest hydrocarbon and a major component of natural gas."
      },
      {
        "q": "What is the atomic number of oxygen?",
        "o": [
          "6",
          "7",
          "8",
          "16"
        ],
        "a": 2,
        "e": "Oxygen contains eight protons in its nucleus."
      },
      {
        "q": "Which gas is mainly responsible for rusting of iron in the presence of moisture?",
        "o": [
          "Nitrogen",
          "Hydrogen",
          "Oxygen",
          "Helium"
        ],
        "a": 2,
        "e": "Iron reacts with oxygen and water to form hydrated iron oxides."
      },
      {
        "q": "What is the pH value of pure water at 25°C?",
        "o": [
          "5",
          "7",
          "9",
          "14"
        ],
        "a": 1,
        "e": "Pure water is neutral at 25°C."
      },
      {
        "q": "Which gas is known as a highly toxic gas in oil and gas fields?",
        "o": [
          "Oxygen",
          "Nitrogen",
          "Hydrogen sulfide",
          "Helium"
        ],
        "a": 2,
        "e": "H2S is a dangerous toxic gas sometimes found in petroleum operations."
      },
      {
        "q": "What is the chemical formula of common salt?",
        "o": [
          "NaCl",
          "HCl",
          "KOH",
          "CaCO3"
        ],
        "a": 0,
        "e": "Common salt is sodium chloride."
      },
      {
        "q": "Which element has the chemical symbol Fe?",
        "o": [
          "Fluorine",
          "Iron",
          "Francium",
          "Fermium"
        ],
        "a": 1,
        "e": "Fe comes from the Latin word ferrum."
      },
      {
        "q": "Which is the most abundant gas in Earth's atmosphere?",
        "o": [
          "Oxygen",
          "Carbon dioxide",
          "Nitrogen",
          "Hydrogen"
        ],
        "a": 2,
        "e": "Nitrogen makes up approximately 78% of the atmosphere."
      },
      {
        "q": "What is the molecular formula of water?",
        "o": [
          "H2O2",
          "H2O",
          "HO2",
          "OH"
        ],
        "a": 1,
        "e": "A water molecule contains two hydrogen atoms and one oxygen atom."
      },
      {
        "q": "Which gas turns limewater milky?",
        "o": [
          "Oxygen",
          "Hydrogen",
          "Carbon dioxide",
          "Nitrogen"
        ],
        "a": 2,
        "e": "Carbon dioxide forms calcium carbonate when passed through limewater."
      },
      {
        "q": "Which of the following is a noble gas?",
        "o": [
          "Chlorine",
          "Neon",
          "Oxygen",
          "Hydrogen"
        ],
        "a": 1,
        "e": "Neon belongs to Group 18 of the periodic table."
      },
      {
        "q": "What is the chemical formula of carbon dioxide?",
        "o": [
          "CO",
          "CO2",
          "C2O",
          "CaO"
        ],
        "a": 1,
        "e": "Carbon dioxide contains one carbon atom and two oxygen atoms."
      },
      {
        "q": "The conversion of liquid into gas at its surface is called:",
        "o": [
          "Freezing",
          "Condensation",
          "Evaporation",
          "Melting"
        ],
        "a": 2,
        "e": "Evaporation occurs at the liquid surface."
      },
      {
        "q": "What is the chemical formula of sulfuric acid?",
        "o": [
          "HCl",
          "H2SO4",
          "HNO3",
          "H2CO3"
        ],
        "a": 1,
        "e": "Sulfuric acid is a strong mineral acid."
      },
      {
        "q": "An acid reacts with a base to form:",
        "o": [
          "Salt and water",
          "Oxygen only",
          "Hydrogen only",
          "Carbon dioxide only"
        ],
        "a": 0,
        "e": "A typical neutralization reaction produces salt and water. SECTION 2: PHYSICS (20 MCQs)"
      },
      {
        "q": "What is the SI unit of force?",
        "o": [
          "Joule",
          "Newton",
          "Watt",
          "Pascal"
        ],
        "a": 1,
        "e": "Force is measured in newtons."
      },
      {
        "q": "What is the SI unit of pressure?",
        "o": [
          "Watt",
          "Newton",
          "Pascal",
          "Joule"
        ],
        "a": 2,
        "e": "Pressure is force per unit area."
      },
      {
        "q": "What is the approximate speed of light in vacuum?",
        "o": [
          "3 × 106 m/s",
          "3 × 108 m/s",
          "3 × 105 m/s",
          "3 × 104 m/s"
        ],
        "a": 1,
        "e": "Light travels at approximately 300 million metres per second in vacuum."
      },
      {
        "q": "Which instrument measures atmospheric pressure?",
        "o": [
          "Thermometer",
          "Barometer",
          "Ammeter",
          "Voltmeter"
        ],
        "a": 1,
        "e": "A barometer measures atmospheric pressure."
      },
      {
        "q": "Newton's second law of motion is expressed as:",
        "o": [
          "F = ma",
          "P = VI",
          "V = IR",
          "E = mc2"
        ],
        "a": 0,
        "e": "Force equals mass multiplied by acceleration."
      },
      {
        "q": "What is the SI unit of electric current?",
        "o": [
          "Volt",
          "Watt",
          "Ampere",
          "Ohm"
        ],
        "a": 2,
        "e": "Electric current is measured in amperes."
      },
      {
        "q": "What is the approximate gravitational acceleration on Earth?",
        "o": [
          "5.8 m/s2",
          "9.8 m/s2",
          "12.8 m/s2",
          "15.8 m/s2"
        ],
        "a": 1,
        "e": "The approximate acceleration due to gravity near Earth's surface is 9.8 m/s2."
      },
      {
        "q": "Which energy is possessed by a moving object?",
        "o": [
          "Potential energy",
          "Chemical energy",
          "Kinetic energy",
          "Nuclear energy"
        ],
        "a": 2,
        "e": "Kinetic energy is energy due to motion."
      },
      {
        "q": "Heat naturally flows from:",
        "o": [
          "Cold to hot",
          "Hot to cold",
          "Low pressure to high pressure only",
          "Vacuum to solid only"
        ],
        "a": 1,
        "e": "Heat flows spontaneously from higher to lower temperature."
      },
      {
        "q": "What is the SI unit of power?",
        "o": [
          "Joule",
          "Newton",
          "Watt",
          "Pascal"
        ],
        "a": 2,
        "e": "Power is the rate of doing work."
      },
      {
        "q": "Electrical resistance is measured in:",
        "o": [
          "Volt",
          "Ampere",
          "Ohm",
          "Watt"
        ],
        "a": 2,
        "e": "The ohm is the SI unit of resistance."
      },
      {
        "q": "Which instrument measures electric current?",
        "o": [
          "Voltmeter",
          "Ammeter",
          "Thermometer",
          "Barometer"
        ],
        "a": 1,
        "e": "An ammeter is used to measure electric current."
      },
      {
        "q": "A body travels 100 metres in 20 seconds. What is its speed?",
        "o": [
          "2 m/s",
          "5 m/s",
          "10 m/s",
          "20 m/s"
        ],
        "a": 1,
        "e": "Speed = Distance ÷ Time = 100 ÷ 20 = 5 m/s."
      },
      {
        "q": "Pressure is calculated by:",
        "o": [
          "Force × Area",
          "Force ÷ Area",
          "Mass × Velocity",
          "Area ÷ Force"
        ],
        "a": 1,
        "e": "Pressure equals force acting per unit area."
      },
      {
        "q": "At standard atmospheric pressure, pure water boils at:",
        "o": [
          "50°C",
          "80°C",
          "100°C",
          "120°C"
        ],
        "a": 2,
        "e": "The normal boiling point of water is 100°C."
      },
      {
        "q": "Sound cannot travel through:",
        "o": [
          "Air",
          "Water",
          "Steel",
          "Vacuum"
        ],
        "a": 3,
        "e": "Sound needs a material medium to travel."
      },
      {
        "q": "Which instrument measures temperature?",
        "o": [
          "Thermometer",
          "Manometer",
          "Ammeter",
          "Hydrometer"
        ],
        "a": 0,
        "e": "A thermometer measures temperature."
      },
      {
        "q": "A hydraulic press works on:",
        "o": [
          "Newton's first law",
          "Pascal's principle",
          "Ohm's law",
          "Hooke's law"
        ],
        "a": 1,
        "e": "Pressure applied to an enclosed fluid is transmitted throughout the fluid."
      },
      {
        "q": "What is the SI unit of frequency?",
        "o": [
          "Watt",
          "Joule",
          "Hertz",
          "Newton"
        ],
        "a": 2,
        "e": "One hertz represents one cycle per second."
      },
      {
        "q": "Which type of electric current is normally used in transformers?",
        "o": [
          "Direct current",
          "Alternating current",
          "Static current",
          "No current"
        ],
        "a": 1,
        "e": "Transformers work through changing magnetic flux, normally produced by AC. SECTION 3: ENGLISH (30 MCQs)"
      },
      {
        "q": "Choose the synonym of \"Rapid\".",
        "o": [
          "Slow",
          "Fast",
          "Weak",
          "Late"
        ],
        "a": 1,
        "e": "Rapid means quick or fast."
      },
      {
        "q": "Choose the antonym of \"Ancient\".",
        "o": [
          "Old",
          "Historic",
          "Modern",
          "Past"
        ],
        "a": 2,
        "e": "Modern means belonging to the present or recent times."
      },
      {
        "q": "He _ to school every day.",
        "o": [
          "Go",
          "Going",
          "Gone",
          "Goes"
        ],
        "a": 3,
        "e": "A third-person singular subject takes \"goes\" in the simple present tense."
      },
      {
        "q": "She is _ honest woman.",
        "o": [
          "A",
          "An",
          "The",
          "No article"
        ],
        "a": 1,
        "e": "Honest begins with a vowel sound because the letter H is silent."
      },
      {
        "q": "What is the plural of \"Child\"?",
        "o": [
          "Childs",
          "Childes",
          "Children",
          "Childrens"
        ],
        "a": 2,
        "e": "Children is the irregular plural of child."
      },
      {
        "q": "Choose the correct spelling.",
        "o": [
          "Enviroment",
          "Environment",
          "Environmant",
          "Envirenment"
        ],
        "a": 1,
        "e": "Environment is the correct spelling."
      },
      {
        "q": "They have been working _ morning.",
        "o": [
          "For",
          "Since",
          "At",
          "From"
        ],
        "a": 1,
        "e": "Since indicates the starting point of an action."
      },
      {
        "q": "Choose the antonym of \"Increase\".",
        "o": [
          "Improve",
          "Expand",
          "Decrease",
          "Grow"
        ],
        "a": 2,
        "e": "Decrease means to become smaller or less."
      },
      {
        "q": "He is good _ mathematics.",
        "o": [
          "In",
          "At",
          "On",
          "By"
        ],
        "a": 1,
        "e": "The correct expression is \"good at\"."
      },
      {
        "q": "What is the past tense of \"Write\"?",
        "o": [
          "Written",
          "Writed",
          "Wrote",
          "Writing"
        ],
        "a": 2,
        "e": "Wrote is the simple past tense of write."
      },
      {
        "q": "Choose the correct sentence.",
        "o": [
          "She do not like tea.",
          "She does not likes tea.",
          "She don't likes tea.",
          "She does not like tea."
        ],
        "a": 3,
        "e": "Does not is followed by the base form of the verb."
      },
      {
        "q": "Choose the synonym of \"Brave\".",
        "o": [
          "Afraid",
          "Weak",
          "Courageous",
          "Lazy"
        ],
        "a": 2,
        "e": "Courageous means brave."
      },
      {
        "q": "I am interested _ science.",
        "o": [
          "On",
          "In",
          "At",
          "For"
        ],
        "a": 1,
        "e": "The correct preposition is \"in\"."
      },
      {
        "q": "Choose the antonym of \"Victory\".",
        "o": [
          "Success",
          "Triumph",
          "Defeat",
          "Achievement"
        ],
        "a": 2,
        "e": "Defeat is the opposite of victory."
      },
      {
        "q": "Choose the correct passive voice of \"He repaired the machine.\"",
        "o": [
          "The machine repairs him.",
          "The machine was repaired by him.",
          "The machine has repaired.",
          "The machine is repairing."
        ],
        "a": 1,
        "e": "The simple past passive uses was/were + past participle."
      },
      {
        "q": "Neither Ali nor his friends _ present.",
        "o": [
          "Is",
          "Was",
          "Are",
          "Be"
        ],
        "a": 2,
        "e": "The plural subject nearest the verb takes \"are\"."
      },
      {
        "q": "Choose the synonym of \"Essential\".",
        "o": [
          "Optional",
          "Necessary",
          "Useless",
          "Minor"
        ],
        "a": 1,
        "e": "Essential means necessary or very important."
      },
      {
        "q": "She has lived here _ five years.",
        "o": [
          "Since",
          "At",
          "For",
          "From"
        ],
        "a": 2,
        "e": "For indicates a duration of time."
      },
      {
        "q": "Choose the comparative form of \"Good\".",
        "o": [
          "Gooder",
          "Best",
          "Better",
          "More good"
        ],
        "a": 2,
        "e": "Better is the irregular comparative of good."
      },
      {
        "q": "If I study hard, I _ pass.",
        "o": [
          "Would",
          "Will",
          "Had",
          "Was"
        ],
        "a": 1,
        "e": "The first conditional uses if + present tense and will + base verb."
      },
      {
        "q": "Choose the antonym of \"Permanent\".",
        "o": [
          "Lasting",
          "Temporary",
          "Fixed",
          "Stable"
        ],
        "a": 1,
        "e": "Temporary means lasting for a limited time."
      },
      {
        "q": "Choose the correct reported speech: He said, \"I am tired.\"",
        "o": [
          "He said that I am tired.",
          "He said that he was tired.",
          "He said that he is tired yesterday.",
          "He said that he were tired."
        ],
        "a": 1,
        "e": "In standard reported speech, am changes to was."
      },
      {
        "q": "Choose the noun form of \"Decide\".",
        "o": [
          "Decisive",
          "Deciding",
          "Decision",
          "Decided"
        ],
        "a": 2,
        "e": "Decision is the noun form of decide."
      },
      {
        "q": "The workers _ completed their tasks.",
        "o": [
          "Has",
          "Have",
          "Is",
          "Was"
        ],
        "a": 1,
        "e": "A plural subject takes \"have\"."
      },
      {
        "q": "Choose the correct spelling.",
        "o": [
          "Maintanance",
          "Maintenance",
          "Maintainence",
          "Maintenence"
        ],
        "a": 1,
        "e": "Maintenance is the correct spelling."
      },
      {
        "q": "Choose the antonym of \"Expand\".",
        "o": [
          "Enlarge",
          "Increase",
          "Contract",
          "Extend"
        ],
        "a": 2,
        "e": "Contract means to become smaller."
      },
      {
        "q": "He is senior _ me.",
        "o": [
          "Than",
          "From",
          "With",
          "To"
        ],
        "a": 3,
        "e": "The correct grammatical expression is \"senior to\"."
      },
      {
        "q": "Which of the following is an adjective?",
        "o": [
          "Beautiful",
          "Beauty",
          "Beautifully",
          "Beautify"
        ],
        "a": 0,
        "e": "An adjective describes a noun."
      },
      {
        "q": "By the time we arrived, the train _ left.",
        "o": [
          "Has",
          "Had",
          "Have",
          "Was"
        ],
        "a": 1,
        "e": "The past perfect tense describes an earlier completed past action."
      },
      {
        "q": "Choose the correct sentence.",
        "o": [
          "Each students have a book.",
          "Each student have a book.",
          "Each student has a book.",
          "Each students has a book."
        ],
        "a": 2,
        "e": "Each takes a singular noun and singular verb. SECTION 4: BASIC MATHEMATICS (15 MCQs)"
      },
      {
        "q": "What is 25% of 200?",
        "o": [
          "25",
          "40",
          "50",
          "75"
        ],
        "a": 2,
        "e": "200 × 25/100 = 50."
      },
      {
        "q": "Solve: 12 × 8 = ?",
        "o": [
          "84",
          "96",
          "108",
          "88"
        ],
        "a": 1,
        "e": "12 multiplied by 8 equals 96."
      },
      {
        "q": "Find the average of 10, 20 and 30.",
        "o": [
          "15",
          "20",
          "25",
          "30"
        ],
        "a": 1,
        "e": "(10 + 20 + 30) ÷ 3 = 20."
      },
      {
        "q": "Solve: 3/4 + 1/4 = ?",
        "o": [
          "1/2",
          "3/8",
          "1",
          "2"
        ],
        "a": 2,
        "e": "3/4 + 1/4 = 4/4 = 1."
      },
      {
        "q": "A product costs Rs. 800 after a 20% discount. What was its original price?",
        "o": [
          "Rs. 900",
          "Rs. 960",
          "Rs. 1,000",
          "Rs. 1,200"
        ],
        "a": 2,
        "e": "Original price = 800 ÷ 0.80 = Rs. 1,000."
      },
      {
        "q": "What is the square root of 144?",
        "o": [
          "10",
          "12",
          "14",
          "16"
        ],
        "a": 1,
        "e": "12 × 12 = 144."
      },
      {
        "q": "Solve: x + 7 = 15. Find x.",
        "o": [
          "7",
          "8",
          "9",
          "10"
        ],
        "a": 1,
        "e": "x = 15 − 7 = 8."
      },
      {
        "q": "A sum of 50 is divided in the ratio 2:3. What is the first share?",
        "o": [
          "10",
          "20",
          "25",
          "30"
        ],
        "a": 1,
        "e": "First share = 2/5 × 50 = 20."
      },
      {
        "q": "Calculate simple interest on Rs. 1,000 at 10% per year for 2 years.",
        "o": [
          "Rs. 100",
          "Rs. 150",
          "Rs. 200",
          "Rs. 250"
        ],
        "a": 2,
        "e": "SI = P × R × T / 100 = 1,000 × 10 × 2 / 100 = 200."
      },
      {
        "q": "A vehicle travels at 60 km/h for 3 hours. Find the distance.",
        "o": [
          "120 km",
          "150 km",
          "180 km",
          "240 km"
        ],
        "a": 2,
        "e": "Distance = Speed × Time = 60 × 3 = 180 km."
      },
      {
        "q": "Solve: 152 = ?",
        "o": [
          "125",
          "225",
          "250",
          "215"
        ],
        "a": 1,
        "e": "15 × 15 = 225."
      },
      {
        "q": "Convert 0.75 into a percentage.",
        "o": [
          "7.5%",
          "70%",
          "75%",
          "750%"
        ],
        "a": 2,
        "e": "0.75 × 100 = 75%."
      },
      {
        "q": "Find the perimeter of a square having a side of 5 cm.",
        "o": [
          "10 cm",
          "15 cm",
          "20 cm",
          "25 cm"
        ],
        "a": 2,
        "e": "Perimeter = 4 × Side = 4 × 5 = 20 cm."
      },
      {
        "q": "If 5 workers complete a task in 10 days, how many days will 10 equally efficient workers take?",
        "o": [
          "5 days",
          "10 days",
          "15 days",
          "20 days"
        ],
        "a": 0,
        "e": "Doubling the workforce halves the time, assuming equal efficiency."
      },
      {
        "q": "Solve: 48 ÷ 6 + 4 × 2 = ?",
        "o": [
          "12",
          "16",
          "20",
          "24"
        ],
        "a": 1,
        "e": "Apply order of operations: 8 + 8 = 16. SECTION 5: GENERAL KNOWLEDGE (20 MCQs)"
      },
      {
        "q": "What is the capital of Pakistan?",
        "o": [
          "Karachi",
          "Lahore",
          "Islamabad",
          "Peshawar"
        ],
        "a": 2,
        "e": "Islamabad is the federal capital of Pakistan."
      },
      {
        "q": "When did Pakistan gain independence?",
        "o": [
          "1940",
          "1945",
          "1947",
          "1956"
        ],
        "a": 2,
        "e": "Pakistan became independent on 14 August 1947."
      },
      {
        "q": "Which is the largest province of Pakistan by area?",
        "o": [
          "Punjab",
          "Sindh",
          "Balochistan",
          "Khyber Pakhtunkhwa"
        ],
        "a": 2,
        "e": "Balochistan is the largest province by area."
      },
      {
        "q": "What is the national language of Pakistan?",
        "o": [
          "Sindhi",
          "Urdu",
          "Punjabi",
          "Pashto"
        ],
        "a": 1,
        "e": "Urdu is Pakistan's national language."
      },
      {
        "q": "Where is the headquarters of the United Nations located?",
        "o": [
          "Geneva",
          "Paris",
          "New York",
          "London"
        ],
        "a": 2,
        "e": "The main United Nations headquarters is in New York City."
      },
      {
        "q": "Which is the largest ocean in the world?",
        "o": [
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Arctic Ocean"
        ],
        "a": 2,
        "e": "The Pacific Ocean is the largest ocean on Earth."
      },
      {
        "q": "What does UEP stand for?",
        "o": [
          "United Energy Pakistan",
          "Universal Energy Project",
          "United Engineering Pakistan",
          "Union Energy Power"
        ],
        "a": 0,
        "e": "UEP stands for United Energy Pakistan."
      },
      {
        "q": "UEP mainly operates in which industry?",
        "o": [
          "Textile",
          "Oil and Gas",
          "Agriculture",
          "Telecommunications"
        ],
        "a": 1,
        "e": "UEP is involved in petroleum exploration and production."
      },
      {
        "q": "What is the main component of natural gas?",
        "o": [
          "Ethane",
          "Propane",
          "Methane",
          "Butane"
        ],
        "a": 2,
        "e": "Natural gas typically contains methane as its major component."
      },
      {
        "q": "What does PPE stand for?",
        "o": [
          "Public Protection Equipment",
          "Personal Protective Equipment",
          "Personal Production Energy",
          "Pressure Protection Element"
        ],
        "a": 1,
        "e": "PPE includes protective clothing and equipment used to reduce workplace hazards."
      },
      {
        "q": "Which is the longest river in Pakistan?",
        "o": [
          "Ravi",
          "Chenab",
          "Indus",
          "Jhelum"
        ],
        "a": 2,
        "e": "The Indus River is Pakistan's longest major river."
      },
      {
        "q": "What is the national animal of Pakistan?",
        "o": [
          "Lion",
          "Markhor",
          "Snow Leopard",
          "Deer"
        ],
        "a": 1,
        "e": "Markhor is the national animal of Pakistan."
      },
      {
        "q": "Where is the headquarters of OPEC located?",
        "o": [
          "London",
          "Geneva",
          "Vienna",
          "New York"
        ],
        "a": 2,
        "e": "OPEC is headquartered in Vienna, Austria."
      },
      {
        "q": "Which gas is particularly dangerous in sour oil and gas production?",
        "o": [
          "Nitrogen",
          "Helium",
          "Neon",
          "Hydrogen sulfide"
        ],
        "a": 3,
        "e": "H2S is highly toxic and requires strict safety precautions."
      },
      {
        "q": "Which is the largest planet in our solar system?",
        "o": [
          "Jupiter",
          "Saturn",
          "Earth",
          "Neptune"
        ],
        "a": 0,
        "e": "Jupiter is the largest planet in the solar system."
      },
      {
        "q": "What is the national flower of Pakistan?",
        "o": [
          "Rose",
          "Jasmine",
          "Tulip",
          "Sunflower"
        ],
        "a": 1,
        "e": "Jasmine is Pakistan's national flower."
      },
      {
        "q": "Which instrument is commonly used to measure pressure in industrial pipelines?",
        "o": [
          "Hygrometer",
          "Tachometer",
          "Pressure gauge",
          "Anemometer"
        ],
        "a": 2,
        "e": "Pressure gauges indicate the pressure of liquids or gases."
      },
      {
        "q": "What does LPG stand for?",
        "o": [
          "Liquid Petroleum Gasoline",
          "Low Pressure Gas",
          "Liquefied Petroleum Gas",
          "Liquefied Power Gas"
        ],
        "a": 2,
        "e": "LPG mainly contains propane, butane, or a mixture of both."
      },
      {
        "q": "Badin is located in which province of Pakistan?",
        "o": [
          "Sindh",
          "Punjab",
          "Balochistan",
          "Khyber Pakhtunkhwa"
        ],
        "a": 0,
        "e": "Badin is a district in Sindh province."
      },
      {
        "q": "What should a worker do first after discovering a suspected gas leak?",
        "o": [
          "Operate nearby electrical switches",
          "Move to safety and raise the alarm",
          "Attempt an untrained repair",
          "Ignore the leak"
        ],
        "a": 1,
        "e": "A suspected gas leak requires immediate safety precautions, avoidance of ignition sources, and notification of trained emergency personnel. About Sujag Education Sujag Education provides free online mock tests, practice MCQs, educational notes, and exam preparation resources to help students and job applicants prepare for competitive examinations in Pakistan. Practice More. Learn Better. Succeed with Sujag Education. Disclaimer: These 100 MCQs are original practice questions based on the shared subject distribution. They are not official UEP questions, and their appearance in the actual examination is not guaranteed."
      }
    ],
    "createdAt": "2026-11-23T10:37:30.398Z",
    "updatedAt": "2026-11-23T13:23:30.726Z",
    "groupUrl": "https://wa.me/923253061605",
    "instructions": [],
    "groupText": "UEP Field Production Trainee\nجيڪي دوست جي تياري ڪري رهيا آهن، اهي اسان جو Paid WhatsApp گروپ جوائن ڪري سگهن ٿا، جتي اوهان کي نوٽس ۽ هر هفتي 2 موڪ ٽيسٽ ڏنيون وينديون. گروپ جوائن ڪرڻ جي فيس صرف 300 رپيا آهي.",
    "groupPhone": "923253061605"
  }
];
