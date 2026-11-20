/* ==========================================================================
   SUJAG Education - mock test data
   Everything the test pages show comes from this file.

   HOW TO ADD A TEST
   1. Add a new object to SUJAG.data.tests (copy an existing one).
   2. Give it a unique "id" (lowercase letters, numbers and hyphens).
   3. Set "category" to the "id" of one of the categories below.
   4. Add questions with Q("question", ["A", "B", "C", "D"], correctIndex, "explanation").
      correctIndex counts from 0, so the first option is 0.
   Question counts, listings, search and scoring all update automatically.

   These are demo practice tests written for this website. They are not
   official past papers and are not connected to any examination body.
   ========================================================================== */
window.SUJAG = window.SUJAG || {};
SUJAG.data = SUJAG.data || {};

(function () {
  var Q = function (q, o, a, e) { return { q: q, o: o, a: a, e: e || "" }; };

  /* ---------- Categories ---------- */
  SUJAG.data.testCategories = [
    { id: "spsc", name: "SPSC", icon: "landmark", description: "Practice for Sindh Public Service Commission style recruitment tests." },
    { id: "sts", name: "STS", icon: "clipboard", description: "Practice for Sindh Testing Service style screening tests." },
    { id: "fpsc", name: "FPSC", icon: "flag", description: "General ability practice for federal recruitment examinations." },
    { id: "ppsc", name: "PPSC", icon: "building", description: "Pakistan Studies and Islamiat practice for Punjab recruitment tests." },
    { id: "police", name: "Police Jobs", icon: "shield", description: "Practice for police constable and related recruitment tests." },
    { id: "other-govt", name: "Other Government Jobs", icon: "briefcase", description: "Clerical and general aptitude practice for other government posts." },
    { id: "university", name: "University Entry Tests", icon: "graduation-cap", description: "Mathematics and physics practice for university admission tests." },
    { id: "general-knowledge", name: "General Knowledge", icon: "globe", description: "World and Pakistan general knowledge for any test." },
    { id: "english", name: "English", icon: "type", description: "Grammar, vocabulary and usage practice." },
    { id: "mathematics", name: "Mathematics", icon: "calculator", description: "Arithmetic and basic mathematics for recruitment tests." },
    { id: "computer-science", name: "Computer Science", icon: "monitor", description: "Computer fundamentals for job and entry tests." },
    { id: "science", name: "Science", icon: "flask", description: "General science for school, job and entry tests." },
    { id: "current-affairs", name: "Current Affairs", icon: "newspaper", description: "World organizations and awareness questions." }
  ];

  /* Groups combine several categories into one page. Used by the home page cards. */
  SUJAG.data.testGroups = [
    { id: "government-jobs", name: "Government Jobs", icon: "briefcase", includes: ["spsc", "sts", "fpsc", "ppsc", "police", "other-govt"], description: "SPSC, STS, FPSC, PPSC, police and other recruitment tests." }
  ];

  SUJAG.data.defaultInstructions = [
    "Read each question carefully and choose the one option you think is correct.",
    "Every question carries one mark. There is no negative marking in these practice tests.",
    "You can move between questions at any time using Previous, Next or the question numbers.",
    "Your selected answers are kept while you move around, and you can change them before you submit.",
    "The timer starts when you press Start Test. The test is submitted automatically when time runs out.",
    "Do not close or refresh the page while taking the test. If that happens, your progress on this device is restored.",
    "After submitting, you will see your score and can review every answer with its explanation."
  ];

  /* ---------- Tests ---------- */
  SUJAG.data.tests = [
    {
      id: "spsc-gk-1",
      title: "SPSC General Knowledge Practice Test 1",
      category: "spsc",
      difficulty: "Medium",
      duration: 12,
      featured: true,
      description: "Pakistan, Sindh and world general knowledge in the style of commission screening tests.",
      questions: [
        Q("Which city is the capital of Sindh province?", ["Hyderabad", "Karachi", "Sukkur", "Larkana"], 1, "Karachi is the provincial capital of Sindh and the largest city in Pakistan."),
        Q("Mohenjo-daro, a major Indus Valley Civilization site, is located in which district of Sindh?", ["Larkana", "Sukkur", "Thatta", "Dadu"], 0, "Mohenjo-daro lies in Larkana District and is a UNESCO World Heritage Site."),
        Q("Which is the longest river of Pakistan?", ["Jhelum", "Indus", "Ravi", "Sutlej"], 1, "The Indus rises in Tibet and flows through Pakistan to the Arabian Sea."),
        Q("In which year did Pakistan come into being?", ["1945", "1946", "1947", "1948"], 2, "Pakistan became independent on 14 August 1947."),
        Q("K2, the highest peak in Pakistan, belongs to which mountain range?", ["Himalaya", "Karakoram", "Hindu Kush", "Sulaiman"], 1, "K2 is in the Karakoram range and is the second highest mountain in the world."),
        Q("The Lahore Resolution was passed in which year?", ["1930", "1935", "1940", "1946"], 2, "The resolution was passed at Lahore on 23 March 1940."),
        Q("Which province of Pakistan is the largest by area?", ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"], 3, "Balochistan covers nearly 44 percent of Pakistan's land area."),
        Q("What is the national language of Pakistan?", ["Sindhi", "Urdu", "Punjabi", "English"], 1, "Urdu is the national language. English and Urdu are the official languages."),
        Q("Into which sea does the Indus River finally fall?", ["Arabian Sea", "Red Sea", "Caspian Sea", "Bay of Bengal"], 0, "The Indus delta is in Sindh, where the river meets the Arabian Sea."),
        Q("Sukkur Barrage is built on which river?", ["Indus", "Jhelum", "Chenab", "Kabul"], 0, "Sukkur Barrage was completed in 1932 on the Indus River.")
      ]
    },
    {
      id: "sts-english-1",
      title: "STS English Grammar Practice Test",
      category: "sts",
      difficulty: "Easy",
      duration: 10,
      featured: true,
      description: "Grammar, spelling, tenses and word choice questions for screening tests.",
      questions: [
        Q("She ___ to school every day.", ["go", "goes", "going", "gone"], 1, "A singular subject in the simple present takes a verb ending in -s: she goes."),
        Q("Choose the correct plural of \"child\".", ["childs", "childes", "children", "childrens"], 2, "Child has an irregular plural: children."),
        Q("He is ___ honest man.", ["a", "an", "the", "no article"], 1, "Honest begins with a vowel sound (the h is silent), so we use \"an\"."),
        Q("Neither of the two boys ___ present today.", ["were", "are", "was", "have"], 2, "\"Neither\" is treated as singular, so the verb is \"was\"."),
        Q("Choose the correct spelling.", ["Neccessary", "Necessary", "Necesary", "Neccesary"], 1, "Necessary has one c and two s's."),
        Q("What is the past tense of \"write\"?", ["writed", "wrote", "written", "writing"], 1, "Write, wrote, written. \"Wrote\" is the simple past."),
        Q("She is very good ___ mathematics.", ["in", "on", "at", "with"], 2, "We say \"good at\" a subject or skill."),
        Q("Choose the synonym of \"abundant\".", ["scarce", "plentiful", "tiny", "costly"], 1, "Abundant means existing in large quantities, which is the same as plentiful."),
        Q("Choose the antonym of \"ancient\".", ["old", "modern", "historic", "past"], 1, "Ancient means very old; the opposite is modern."),
        Q("Which sentence is correct?", ["He don't like tea.", "He doesn't like tea.", "He not like tea.", "He didn't likes tea."], 1, "With he/she/it in the simple present negative, we use \"doesn't\" plus the base verb.")
      ]
    },
    {
      id: "fpsc-general-1",
      title: "FPSC General Ability Practice Test",
      category: "fpsc",
      difficulty: "Medium",
      duration: 12,
      featured: true,
      description: "A mix of Pakistan affairs, geography and basic science questions.",
      questions: [
        Q("Who was the first Prime Minister of Pakistan?", ["Liaquat Ali Khan", "Khawaja Nazimuddin", "Muhammad Ali Bogra", "Chaudhry Muhammad Ali"], 0, "Liaquat Ali Khan served as Pakistan's first Prime Minister from 1947 until 1951."),
        Q("Who wrote the lyrics of Pakistan's national anthem?", ["Allama Iqbal", "Hafeez Jalandhari", "Faiz Ahmed Faiz", "Ahmed Faraz"], 1, "Hafeez Jalandhari wrote the lyrics; Ahmed G. Chagla composed the music."),
        Q("Which pass near Peshawar connects Pakistan with Afghanistan?", ["Bolan Pass", "Khyber Pass", "Lowari Pass", "Khunjerab Pass"], 1, "The Khyber Pass links Khyber Pakhtunkhwa with Afghanistan."),
        Q("The Khunjerab Pass connects Pakistan with which country?", ["Afghanistan", "Iran", "China", "India"], 2, "Khunjerab Pass is on the Karakoram Highway and is the border crossing with China."),
        Q("Who is the national poet of Pakistan?", ["Mirza Ghalib", "Allama Muhammad Iqbal", "Altaf Hussain Hali", "Josh Malihabadi"], 1, "Allama Muhammad Iqbal is known as the poet of the East and Pakistan's national poet."),
        Q("In which city is the Federal Public Service Commission headquartered?", ["Lahore", "Karachi", "Islamabad", "Peshawar"], 2, "FPSC has its headquarters in Islamabad."),
        Q("What is the SI unit of force?", ["Joule", "Newton", "Pascal", "Watt"], 1, "Force is measured in newtons (N)."),
        Q("What is the chemical symbol of gold?", ["Ag", "Au", "Gd", "Go"], 1, "Au comes from the Latin word aurum."),
        Q("How many provinces does Pakistan have?", ["3", "4", "5", "6"], 1, "Pakistan has four provinces: Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan."),
        Q("What is the national flower of Pakistan?", ["Rose", "Jasmine", "Tulip", "Lotus"], 1, "Jasmine (Chambeli) is the national flower of Pakistan.")
      ]
    },
    {
      id: "ppsc-studies-1",
      title: "PPSC Pakistan Studies and Islamiat Practice Test",
      category: "ppsc",
      difficulty: "Medium",
      duration: 12,
      featured: false,
      description: "Pakistan movement, constitutional history and basic Islamiat questions.",
      questions: [
        Q("Who moved the Lahore Resolution in 1940?", ["Liaquat Ali Khan", "A. K. Fazlul Huq", "Allama Iqbal", "Sir Syed Ahmad Khan"], 1, "A. K. Fazlul Huq moved the resolution at the Lahore session of the All-India Muslim League."),
        Q("Allama Iqbal presented the idea of a separate Muslim state in his Allahabad Address in which year?", ["1920", "1927", "1930", "1940"], 2, "He delivered the address as President of the Muslim League in 1930."),
        Q("In which Islamic month do Muslims observe the fast?", ["Rajab", "Shaban", "Ramadan", "Shawwal"], 2, "Fasting during Ramadan is one of the five pillars of Islam."),
        Q("How many surahs are there in the Holy Quran?", ["100", "110", "114", "120"], 2, "The Quran has 114 surahs."),
        Q("Who was the first Caliph of Islam?", ["Hazrat Umar (RA)", "Hazrat Abu Bakr (RA)", "Hazrat Uthman (RA)", "Hazrat Ali (RA)"], 1, "Hazrat Abu Bakr (RA) became the first Caliph after the Prophet (PBUH)."),
        Q("In which year of the Hijri calendar did the Battle of Badr take place?", ["1 AH", "2 AH", "3 AH", "5 AH"], 1, "The Battle of Badr took place in Ramadan, 2 AH."),
        Q("How many pillars of Islam are there?", ["3", "4", "5", "6"], 2, "The five pillars are Shahada, Salah, Zakat, Sawm and Hajj."),
        Q("The Objective Resolution was passed by the Constituent Assembly of Pakistan in:", ["1947", "1949", "1956", "1962"], 1, "It was passed in March 1949 and later became a preamble to the constitutions."),
        Q("Pakistan's first constitution came into force in which year?", ["1947", "1950", "1956", "1962"], 2, "The first constitution was enforced on 23 March 1956."),
        Q("Which constitution is currently in force in Pakistan?", ["The Constitution of 1956", "The Constitution of 1962", "The Constitution of 1973", "The Constitution of 1985"], 2, "The Constitution of 1973 came into force on 14 August 1973.")
      ]
    },
    {
      id: "police-constable-1",
      title: "Police Constable Recruitment Practice Test",
      category: "police",
      difficulty: "Easy",
      duration: 10,
      featured: false,
      description: "General knowledge, reasoning and basic arithmetic for constable-level tests.",
      questions: [
        Q("FIR stands for:", ["First Information Report", "Final Investigation Record", "First Inquiry Review", "Federal Information Report"], 0, "An FIR is the First Information Report recorded by police about a reported offence."),
        Q("Which number is commonly used to reach the police in an emergency in Pakistan?", ["911", "15", "999", "199"], 1, "15 is the police emergency number in Pakistan."),
        Q("Complete the series: 2, 4, 8, 16, ?", ["24", "30", "32", "36"], 2, "Each number is double the previous one, so the next is 32."),
        Q("Find the odd one out.", ["Lion", "Tiger", "Leopard", "Cow"], 3, "Lion, tiger and leopard are wild big cats. A cow is a domestic animal."),
        Q("CNIC stands for:", ["Computerized National Identity Card", "Central National Identity Certificate", "Computer Network Identity Card", "Computerized Native Identity Code"], 0, "CNIC is the Computerized National Identity Card issued by NADRA."),
        Q("A vehicle travels 60 km in 1 hour at a steady speed. How far will it travel in 3 hours?", ["120 km", "150 km", "180 km", "240 km"], 2, "Distance = speed x time = 60 x 3 = 180 km."),
        Q("What is the opposite of \"guilty\"?", ["Innocent", "Careful", "Honest", "Strong"], 0, "The opposite of guilty is innocent."),
        Q("What is the national animal of Pakistan?", ["Markhor", "Snow leopard", "Lion", "Indus dolphin"], 0, "The markhor, a wild goat found in northern mountains, is the national animal."),
        Q("Which of these is a primary duty of the police?", ["Collecting taxes", "Maintaining law and order", "Running hospitals", "Printing currency"], 1, "Maintaining law and order and protecting life and property are core police duties."),
        Q("What is the capital city of Punjab?", ["Faisalabad", "Lahore", "Multan", "Rawalpindi"], 1, "Lahore is the capital of Punjab province.")
      ]
    },
    {
      id: "clerical-aptitude-1",
      title: "Clerical Jobs General Aptitude Test",
      category: "other-govt",
      difficulty: "Easy",
      duration: 10,
      featured: false,
      description: "Basic arithmetic, English and computer questions for clerical and assistant posts.",
      questions: [
        Q("What is 15% of 200?", ["20", "25", "30", "35"], 2, "15% of 200 = 0.15 x 200 = 30."),
        Q("Simplify: 25 + 75 ÷ 5", ["20", "40", "50", "100"], 1, "Division comes first: 75 ÷ 5 = 15, then 25 + 15 = 40."),
        Q("How many metres are there in one kilometre?", ["100", "500", "1000", "10000"], 2, "1 km = 1000 m."),
        Q("Which file extension is used by a modern Microsoft Word document?", [".docx", ".xlsx", ".pptx", ".jpg"], 0, "Word documents saved in recent versions use the .docx extension."),
        Q("Choose the synonym of \"rapid\".", ["slow", "fast", "weak", "quiet"], 1, "Rapid means happening very quickly."),
        Q("Express the ratio 12 : 18 in its simplest form.", ["1 : 2", "2 : 3", "3 : 4", "4 : 5"], 1, "Divide both numbers by 6 to get 2 : 3."),
        Q("Which of these is a spreadsheet program?", ["Microsoft Excel", "Notepad", "Paint", "Media Player"], 0, "Excel is a spreadsheet application used for tables and calculations."),
        Q("If 5 pens cost Rs. 50, what is the cost of 8 pens?", ["Rs. 70", "Rs. 80", "Rs. 85", "Rs. 90"], 1, "One pen costs Rs. 10, so 8 pens cost Rs. 80."),
        Q("Choose the correct spelling.", ["Recieve", "Receive", "Receeve", "Receve"], 1, "Remember the rule: i before e, except after c."),
        Q("How many days are there in a leap year?", ["364", "365", "366", "367"], 2, "A leap year has 366 days because February has 29 days.")
      ]
    },
    {
      id: "entry-math-physics-1",
      title: "University Entry Test: Mathematics and Physics",
      category: "university",
      difficulty: "Hard",
      duration: 15,
      featured: true,
      description: "Calculus, algebra and mechanics questions at entry-test level.",
      questions: [
        Q("What is the derivative of x³ + 2x with respect to x?", ["3x² + 2", "x² + 2", "3x + 2", "3x² + 2x"], 0, "Differentiate term by term: d/dx(x³) = 3x² and d/dx(2x) = 2."),
        Q("What is the value of sin 30°?", ["1/2", "√3/2", "1", "0"], 0, "sin 30° = 1/2, one of the standard trigonometric values."),
        Q("What are the roots of x² − 5x + 6 = 0?", ["1 and 6", "2 and 3", "−2 and −3", "5 and 1"], 1, "Factorise: (x − 2)(x − 3) = 0, so x = 2 or x = 3."),
        Q("What is the determinant of the matrix [[1, 2], [3, 4]]?", ["−2", "2", "10", "−10"], 0, "Determinant = (1 x 4) − (2 x 3) = 4 − 6 = −2."),
        Q("What is ∫ 2x dx?", ["x² + C", "2x² + C", "x + C", "2 + C"], 0, "The integral of 2x is x², plus the constant of integration C."),
        Q("Which of the following is a vector quantity?", ["Speed", "Mass", "Velocity", "Time"], 2, "Velocity has both magnitude and direction. Speed, mass and time are scalars."),
        Q("A body of mass 5 kg accelerates at 2 m/s². What is the net force acting on it?", ["2.5 N", "7 N", "10 N", "25 N"], 2, "Newton's second law: F = ma = 5 x 2 = 10 N."),
        Q("What is the value of log₁₀ 1000?", ["1", "2", "3", "10"], 2, "10³ = 1000, so log₁₀ 1000 = 3."),
        Q("What is the kinetic energy of a 2 kg object moving at 3 m/s?", ["3 J", "6 J", "9 J", "18 J"], 2, "KE = ½ m v² = 0.5 x 2 x 9 = 9 J."),
        Q("What is the sum of the first 10 natural numbers?", ["45", "50", "55", "100"], 2, "Use n(n + 1)/2 = 10 x 11 / 2 = 55.")
      ]
    },
    {
      id: "gk-world-1",
      title: "World General Knowledge Quiz",
      category: "general-knowledge",
      difficulty: "Easy",
      duration: 10,
      featured: true,
      description: "Geography, science and literature basics that appear in many recruitment tests.",
      questions: [
        Q("Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], 2, "The Pacific Ocean covers about one third of the Earth's surface."),
        Q("What is the capital of Japan?", ["Kyoto", "Tokyo", "Osaka", "Seoul"], 1, "Tokyo is the capital and largest city of Japan."),
        Q("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Mercury"], 1, "Mars looks red because of iron oxide on its surface."),
        Q("How many continents are there?", ["5", "6", "7", "8"], 2, "The seven continents are Asia, Africa, North America, South America, Antarctica, Europe and Australia."),
        Q("Who wrote the play \"Hamlet\"?", ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], 1, "Hamlet is a tragedy written by William Shakespeare."),
        Q("Which is the largest hot desert in the world?", ["Gobi", "Kalahari", "Sahara", "Thar"], 2, "The Sahara in northern Africa is the largest hot desert."),
        Q("What is the currency of Japan?", ["Won", "Yuan", "Yen", "Ringgit"], 2, "Japan uses the yen."),
        Q("Which is the highest mountain above sea level?", ["K2", "Mount Everest", "Kangchenjunga", "Makalu"], 1, "Mount Everest, on the Nepal-China border, is the highest above sea level."),
        Q("Which gas do humans need to breathe in to live?", ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"], 1, "Our bodies use oxygen for cellular respiration."),
        Q("In which country is the Eiffel Tower located?", ["Italy", "France", "Spain", "Germany"], 1, "The Eiffel Tower stands in Paris, France.")
      ]
    },
    {
      id: "english-vocab-1",
      title: "English Vocabulary and Usage Practice",
      category: "english",
      difficulty: "Medium",
      duration: 10,
      featured: false,
      description: "Synonyms, antonyms, idioms and common usage questions.",
      questions: [
        Q("Choose the synonym of \"benevolent\".", ["kind", "cruel", "careless", "quiet"], 0, "Benevolent means well-meaning and kind."),
        Q("Choose the antonym of \"scarce\".", ["rare", "limited", "plentiful", "small"], 2, "Scarce means in short supply; plentiful is the opposite."),
        Q("What does \"procrastinate\" mean?", ["To delay doing something", "To finish quickly", "To argue loudly", "To celebrate"], 0, "To procrastinate is to put off a task that should be done now."),
        Q("What does the idiom \"break the ice\" mean?", ["To damage something", "To start a conversation in a friendly way", "To freeze water", "To end a friendship"], 1, "It means to ease tension and get a conversation going."),
        Q("Choose the opposite of \"transparent\".", ["clear", "opaque", "thin", "bright"], 1, "Transparent lets light through; opaque does not."),
        Q("Change to passive voice: \"The cat chased the mouse.\"", ["The mouse chased the cat.", "The mouse was chased by the cat.", "The cat was chased by the mouse.", "The mouse is chasing the cat."], 1, "In the passive, the object becomes the subject: the mouse was chased by the cat."),
        Q("Fill in the blank: \"___ going to the market tomorrow.\"", ["Their", "There", "They're", "Them"], 2, "They're is the short form of \"they are\"."),
        Q("What does \"meticulous\" mean?", ["careless", "very careful about details", "lazy", "noisy"], 1, "A meticulous person pays close attention to detail."),
        Q("Which one word means \"a person who writes books\"?", ["Author", "Editor", "Reader", "Printer"], 0, "An author is the writer of a book."),
        Q("Choose the correctly punctuated sentence.", ["Its a sunny day.", "It's a sunny day.", "Its' a sunny day.", "It is' a sunny day."], 1, "It's is the contraction of \"it is\".")
      ]
    },
    {
      id: "math-basics-1",
      title: "Mathematics Fundamentals Practice Test",
      category: "mathematics",
      difficulty: "Easy",
      duration: 12,
      featured: false,
      description: "Arithmetic, percentages, ratios and simple interest for recruitment tests.",
      questions: [
        Q("What is 12 x 12?", ["124", "132", "144", "154"], 2, "12 x 12 = 144."),
        Q("What is the square root of 169?", ["11", "12", "13", "14"], 2, "13 x 13 = 169."),
        Q("What is 25% of 80?", ["15", "20", "25", "30"], 1, "25% is one quarter, and 80 / 4 = 20."),
        Q("What is the LCM of 4 and 6?", ["10", "12", "18", "24"], 1, "The smallest number divisible by both 4 and 6 is 12."),
        Q("What is the HCF of 24 and 36?", ["6", "8", "12", "18"], 2, "The largest number that divides both 24 and 36 is 12."),
        Q("What is the average of 10, 20 and 30?", ["15", "20", "25", "30"], 1, "(10 + 20 + 30) / 3 = 20."),
        Q("What is 3/4 as a decimal?", ["0.34", "0.5", "0.75", "0.8"], 2, "3 divided by 4 is 0.75."),
        Q("What is the perimeter of a rectangle with length 8 cm and width 5 cm?", ["13 cm", "26 cm", "40 cm", "80 cm"], 1, "Perimeter = 2 x (8 + 5) = 26 cm."),
        Q("If x / 5 = 4, what is x?", ["9", "15", "20", "25"], 2, "Multiply both sides by 5 to get x = 20."),
        Q("What is the simple interest on Rs. 1,000 at 10% per year for 2 years?", ["Rs. 100", "Rs. 150", "Rs. 200", "Rs. 210"], 2, "Simple interest = P x R x T / 100 = 1000 x 10 x 2 / 100 = Rs. 200.")
      ]
    },
    {
      id: "cs-basics-1",
      title: "Computer Science Basics Test",
      category: "computer-science",
      difficulty: "Easy",
      duration: 10,
      featured: true,
      description: "Computer fundamentals, hardware, software and the internet.",
      questions: [
        Q("What does CPU stand for?", ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Processing Unit"], 0, "The CPU is the main processor that carries out instructions."),
        Q("Which of these is an input device?", ["Monitor", "Keyboard", "Printer", "Speaker"], 1, "A keyboard sends data into the computer, so it is an input device."),
        Q("How many bits are there in one byte?", ["4", "8", "16", "32"], 1, "One byte is made of eight bits."),
        Q("What does HTML stand for?", ["HyperText Markup Language", "High Transfer Machine Language", "Hyperlink Text Making Language", "Home Tool Markup Language"], 0, "HTML is the standard language for structuring web pages."),
        Q("Which of these is an operating system?", ["Microsoft Excel", "Windows", "Google Chrome", "Adobe Reader"], 1, "Windows is an operating system. The others are applications."),
        Q("Which statement best describes RAM?", ["Permanent storage", "Temporary working memory", "An output device", "A network cable"], 1, "RAM holds data being used right now and is cleared when power is off."),
        Q("Which keyboard shortcut is used to copy in Windows?", ["Ctrl + V", "Ctrl + X", "Ctrl + C", "Ctrl + Z"], 2, "Ctrl + C copies, Ctrl + V pastes, Ctrl + X cuts and Ctrl + Z undoes."),
        Q("What is the base of the binary number system?", ["2", "8", "10", "16"], 0, "Binary uses only two digits: 0 and 1."),
        Q("The physical parts of a computer are called:", ["Software", "Hardware", "Freeware", "Malware"], 1, "Hardware refers to physical components such as the keyboard, CPU and monitor."),
        Q("Which of these is a web browser?", ["Microsoft Word", "Google Chrome", "Notepad", "Calculator"], 1, "Google Chrome is a web browser used to open websites.")
      ]
    },
    {
      id: "science-general-1",
      title: "General Science Practice Test",
      category: "science",
      difficulty: "Medium",
      duration: 10,
      featured: false,
      description: "Physics, chemistry and biology basics that appear in many tests.",
      questions: [
        Q("What is the chemical formula of water?", ["CO₂", "H₂O", "O₂", "NaCl"], 1, "Each water molecule has two hydrogen atoms and one oxygen atom."),
        Q("Which planet is closest to the Sun?", ["Venus", "Earth", "Mercury", "Mars"], 2, "Mercury is the closest planet to the Sun."),
        Q("Which part of the cell is called its powerhouse?", ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], 1, "Mitochondria release energy from food for the cell to use."),
        Q("Which gas do plants take in for photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2, "Plants use carbon dioxide, water and sunlight to make food."),
        Q("At sea level, at what temperature does water boil?", ["90°C", "100°C", "110°C", "120°C"], 1, "Water boils at 100°C at standard atmospheric pressure."),
        Q("How many bones are there in an adult human body?", ["186", "206", "226", "306"], 1, "An adult human skeleton has 206 bones."),
        Q("Which force pulls objects towards the Earth?", ["Magnetism", "Friction", "Gravity", "Tension"], 2, "Gravity is the force of attraction between the Earth and objects."),
        Q("Which vitamin does the skin make when exposed to sunlight?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 3, "Sunlight helps the skin produce vitamin D."),
        Q("What is the chemical symbol of sodium?", ["S", "So", "Na", "N"], 2, "Na comes from the Latin word natrium."),
        Q("What is the approximate speed of light in a vacuum?", ["3,000 km/s", "30,000 km/s", "300,000 km/s", "3,000,000 km/s"], 2, "Light travels at about 300,000 kilometres per second.")
      ]
    },
    {
      id: "world-orgs-1",
      title: "World Organizations Awareness Test",
      category: "current-affairs",
      difficulty: "Medium",
      duration: 10,
      featured: false,
      description: "Headquarters and basics of major international organizations, a common topic in current affairs sections.",
      questions: [
        Q("Where is the headquarters of the United Nations located?", ["Geneva", "New York", "Paris", "Vienna"], 1, "The UN headquarters is in New York City."),
        Q("Where is the headquarters of the World Health Organization?", ["Geneva", "New York", "Rome", "London"], 0, "WHO is headquartered in Geneva, Switzerland."),
        Q("The Secretariat of the Organisation of Islamic Cooperation (OIC) is in which city?", ["Cairo", "Jeddah", "Istanbul", "Islamabad"], 1, "The OIC general secretariat is based in Jeddah, Saudi Arabia."),
        Q("Where is the headquarters of the International Monetary Fund (IMF)?", ["Geneva", "Washington, D.C.", "London", "Brussels"], 1, "The IMF is headquartered in Washington, D.C."),
        Q("The SAARC Secretariat is located in which city?", ["Dhaka", "Kathmandu", "Colombo", "New Delhi"], 1, "The SAARC Secretariat is in Kathmandu, Nepal."),
        Q("Where is the headquarters of UNESCO?", ["Paris", "Geneva", "Rome", "Vienna"], 0, "UNESCO is headquartered in Paris, France."),
        Q("The International Court of Justice has its seat in:", ["Geneva", "The Hague", "Brussels", "Paris"], 1, "The ICJ sits in the Peace Palace in The Hague, Netherlands."),
        Q("In which year was the United Nations founded?", ["1919", "1945", "1950", "1965"], 1, "The UN was founded in 1945 after the Second World War."),
        Q("Where is the headquarters of NATO?", ["Brussels", "Paris", "Berlin", "London"], 0, "NATO's headquarters is in Brussels, Belgium."),
        Q("Where is the World Trade Organization (WTO) headquartered?", ["Geneva", "New York", "Paris", "Washington, D.C."], 0, "The WTO is based in Geneva, Switzerland.")
      ]
    }
  ];
})();
