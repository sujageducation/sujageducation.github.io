# SUJAG Education

A static, multi-page educational website with free mock tests, free study notes and a books store.
The public pages use plain HTML, CSS and JavaScript and can be published directly on GitHub Pages. Submitted test results use the connected Sujag Education database.

> All tests, notes and books in this package are **sample content** written to demonstrate the site.
> They are not official past papers and the books are not real products. Replace them with your own.

---

## 1. Quick start

**Open locally.** Double-click `index.html`, or serve the folder for a more realistic preview:

```bash
cd Suguj-Education
python3 -m http.server 8000
# then open http://localhost:8000
```

**Publish on GitHub Pages**

1. Create a GitHub repository and upload everything in this folder (the files must be at the repository root).
2. Go to *Settings > Pages*, choose *Deploy from a branch*, select `main` and `/ (root)`, then save.
3. After a minute the site is live at `https://<username>.github.io/<repository>/`.

All links are relative, so the site works both at a domain root and inside a repository sub-folder.

---

## 2. Pages

| File | Purpose |
|---|---|
| `index.html` | Home page |
| `mock-tests.html` | All categories and tests, with search and filters |
| `test-category.html?cat=ID` | Tests in one category |
| `test-details.html?id=ID` | Instructions and candidate details before a test |
| `take-test.html?id=ID` | The examination interface |
| `test-result.html?rid=ID` | Score, review, retake (without `rid` it lists saved results) |
| `notes.html`, `note-details.html?id=ID` | Notes list and a single note |
| `books.html`, `book-details.html?id=ID` | Books store and a single book |
| `search.html?q=TEXT` | Search across tests, notes, books and categories |
| `about.html`, `contact.html`, `faq.html` | Information pages |
| `privacy-policy.html`, `terms.html` | Legal pages |
| `404.html` | Used automatically by GitHub Pages for unknown URLs |

Detail pages (test, note, book) are single templates filled from the data files by the `?id=` value.

---

## 3. Project structure

```
Suguj-Education/
├── *.html                 one file per page
├── css/
│   ├── style.css          design tokens, layout, components
│   ├── responsive.css     breakpoints
│   └── test.css           exam interface and results
├── js/
│   ├── main.js            icons, header, footer, dialogs, toasts, search overlay, accordion
│   ├── cards.js           data lookups and card templates
│   ├── tests.js           scoring, saved attempts, test listing and details pages
│   ├── test-engine.js     timer, navigation and submit logic on take-test.html
│   ├── results.js         results page and review
│   ├── notes.js           notes pages
│   ├── books.js           books pages and order dialog
│   ├── search.js          site search
│   ├── home.js            home page sections
│   └── contact.js         contact form
├── data/
│   ├── site.js            site name, contact details, social links, settings
│   ├── tests.js           test categories and tests with questions
│   ├── notes.js           note categories and notes
│   ├── books.js           books
│   └── updates.js         items in the home page Latest Updates card
├── assets/
│   ├── logo/              logo-mark.png, favicon-32.png, apple-touch-icon.png
│   ├── images/            og-image.png (social sharing image)
│   ├── books/             book covers
│   └── notes/             note PDFs
├── favicon.ico, robots.txt, sitemap.xml, .nojekyll
└── README.md
```

---

## 4. Adding and editing content

Each data file starts with a comment that explains the format. Nothing else needs changing:
listings, filters, counts, search, the home page and the sitemap-style links all read from these files.

### Add a mock test (`data-tests.js`)

```js
{
  id: "my-new-test",              // unique, lowercase, hyphens
  title: "My New Test",
  category: "english",            // an id from SUJAG.data.testCategories
  difficulty: "Easy",             // Easy, Medium or Hard
  duration: 10,                   // minutes
  featured: true,                 // show on the home page
  description: "One short sentence.",
  questions: [
    Q("Question text?", ["Option A", "Option B", "Option C", "Option D"], 1, "Why B is correct.")
    //                                                         ^ index of the correct option, starting at 0
  ]
}
```

To add a category, add an object to `SUJAG.data.testCategories`. It appears everywhere automatically.
Marking is 1 mark per correct answer with no negative marking.

### Add a note (`data-notes.js`)

Copy a note object, set a unique `id` and a `category` from `noteCategories`, and put the PDF in
`assets/notes/`. Set `pdf: ""` if there is no PDF yet. The `sections` array is the readable version
shown on the detail page. Make sure you own or have permission to share any PDF you upload.

### Add a book (`data-books.js`)

Copy a book object, add a cover image to `assets/books/` (portrait 3:4, for example 600 x 800)
and set `price` as a number in rupees. When you replace the sample books with real ones, set
`demoMode: false` in `data-site.js` to hide the sample-content notices.

### Logo

The header and footer use `logo-mark.png` (the S symbol with the sun and book, on a transparent background).
To change it, replace that file, or point `logo` in `data-site.js` to another image. The browser-tab and home-screen icons are
`favicon-32.png`, `favicon.ico` and `apple-touch-icon.png` (180 x 180), and the sharing image is
`og-image.png` (1200 x 630).

### Latest updates (home page)

The scrolling Latest Updates card on the home page reads `data-updates.js`. Add a line such as
`{ date: "2026-12-01", type: "test", id: "my-new-test" }` (types: `test`, `note`, `book`, or `info` with your own `text` and `href`).
Titles and links for tests, notes and books come from the other data files, and the newest date is shown first.
The list scrolls by itself, pauses while the mouse is over it, and stops when a visitor clicks, touches or scrolls it, so they can
move through it by hand. A Pause/Resume button restarts it. Visitors who prefer reduced motion get a normal scrollable list.

### Contact details and settings (`data-site.js`)

| Setting | What it does |
|---|---|
| `url` | Your final domain, used for canonical and sharing tags |
| `email` | Shown on the contact page, enables "Email it" buttons |
| `whatsapp` | Digits only, such as `923001234567`. Turns the book order button into a WhatsApp order |
| `social` | Footer social links. Empty ones show as inactive icons |
| `contactEndpoint` | URL of a form service such as Formspree. Empty means the contact form does not send |
| `currency` | Prefix used for prices |
| `demoMode` | Shows sample-content notices when `true` |

---

## 5. Books, ordering and payments

There is **no payment system**. Pressing *Purchase* opens a form that prepares an order request:

- If `whatsapp` is set, the order text opens in a WhatsApp chat with the seller.
- If only `email` is set, the dialog offers an email draft and a copy button.
- If neither is set, the dialog states that ordering is not connected and that nothing was placed or paid.

To add a real gateway later, change `finishOrder()` in `books.js`.

## 6. Contact form

The form validates input in the browser. It only sends anything when `contactEndpoint` is set
(Formspree and similar services accept a JSON POST). Without it, the site says clearly that the
message was **not** sent, and offers to copy it.

---

## 7. Test results

This ZIP is ready for the Sujag Education GitHub Pages project. Publish its public files at the root of the site. Keep any existing `data-auth.js` and encrypted members file. Use your usual CMS login at `admin.html`. For a new installation, complete the site's existing first-time admin setup.

Choose **Test results** in the admin panel, select a test and choose **Download PDF**. The PDF includes every submitted attempt for the selected test, including rows beyond the current screen. Its header uses the website logo, name, address and test title. The three columns are Name, City and Score. The website address in Settings overrides the published site's address when configured.

All test types, including past papers and tests generated from TXT or PDF, submit to the dedicated Sujag Education results service. Candidates need no account. Each attempt has a unique ID. The service acknowledges the database write before the page reports success. An offline attempt queues on its device and retries when the site is open and connectivity returns. Earlier browser-only results remain available as local review history.

The browser keeps in-progress answers and a fixed deadline, plus up to 30 personal answer reviews. The database keeps submitted summaries until an administrator deletes them. The CMS verifies access against the login published in `data-auth.js` on the `main` branch of `salucommunity/sujageducation.github.io`. The usual CMS setup or password-change flow publishes a results verifier automatically. For a login created by an older panel, sign in with the existing GitHub connection once and open **Test results** to link it. The results service URL is already configured.

## 8. Mock test behaviour

- One question at a time, with Previous and Next, and a numbered question map showing answered,
  unanswered and current questions. On phones the map opens as a bottom sheet so it never covers the question.
- Selecting an answer saves immediately. A selected answer can be changed or cleared.
- The countdown continues after a refresh. It warns at 5 minutes and 1 minute left. When it reaches zero the test is submitted automatically.
- Submitting asks for confirmation (and lists unanswered questions). Double submission is blocked and exactly one result is saved.
- The result page shows marks, percentage, correct, incorrect and unanswered counts, time taken, a visual score ring and bar,
  a downloadable PDF, a filterable answer review with explanations and a retake link.

## 9. Search

The header search icon opens a search overlay. It sends the query to `search.html`, which searches tests, notes,
books and categories from the data files, shows results grouped by type and updates as you type.

## 10. SEO

Every page has a title, meta description, canonical URL, Open Graph and Twitter tags, a favicon and semantic headings.
The home page includes Organization and WebSite structured data, and the FAQ page includes FAQPage data.
`sitemap.xml` and `robots.txt` are included.

**Before launch, replace the placeholder domain `https://example.com`:**

1. Set `url` in `data-site.js`. Canonical and `og:url` tags of every page are then updated automatically by JavaScript.
2. For crawlers that do not run JavaScript, also replace the text in the static files. On Linux or macOS:

   ```bash
   grep -rl "https://example.com" --include="*.html" --include="*.xml" --include="*.txt" . \
     | xargs sed -i 's#https://example.com#https://your-domain.com#g'
   ```

3. Submit `sitemap.xml` in Google Search Console.

Note that test, note and book detail pages are filled in by JavaScript. Google can render them, but if search
visibility of individual notes matters, consider pre-generating static pages later.

## 11. Accessibility and performance

- Skip link, visible focus states, labelled form fields, keyboard-operable menu, dialogs (focus is trapped and returned) and accordion.
- Respects the "reduce motion" setting. Motion is limited to hover effects, a short entrance animation on page load,
  question transitions and progress animations. There is no scroll-triggered animation, auto-scrolling or parallax.
- No frameworks or libraries. Images below the fold are lazy loaded. Book covers are small SVG files.
- The only external request is the Manrope font from Google Fonts (see the privacy policy). To remove it, delete the
  three `fonts.googleapis.com` / `fonts.gstatic.com` lines in each HTML file; the site falls back to system fonts.

## 12. Legal text

`privacy-policy.html` and `terms.html` are sensible starting points written for how this site actually works.
They are not legal advice. Have them reviewed before you rely on them, and update them if you add analytics,
advertising, accounts or payments.

## 13. What was verified

The package was tested in a real browser (Chromium) at phone, tablet and desktop widths. Checks covered: every page loads
without script errors or horizontal scrolling, all internal links and data assets exist, the full test flow
(start, answer, Previous/Next, question map, refresh resume, confirm and submit, scoring, review, filters, retake),
automatic submission when time expires, mobile question sheet, navigation menu, notes and books filters, order dialog,
contact validation, FAQ accordion and site search. Real-device testing on your own phone is still recommended.

## Admin panel (admin.html)

Open `admin.html` on your site (for example `https://yourname.github.io/admin.html`). It is not linked from the public menu and is marked noindex.

**What you can edit:** mock tests and questions, test and note categories, notes (with PDF upload), books (with cover upload), latest updates, home/about/FAQ/privacy/terms text, site details, logo, default test instructions, and a members list.

**Make a test from a PDF or TXT file:** Auto-generate, choose a file or paste text. The detector finds numbered questions, A-D options, `Answer: B` lines, explanations, answer keys at the end (`1-B 2-C`), and options marked with `*`. Review the preview, fix anything in red, then create a new test or add to an existing one. Scanned PDFs (photos of pages) have no text and cannot be read. PDF reading loads pdf.js from cdnjs, so it needs internet; TXT and pasted text work offline. The text detector is tested; reading real PDFs in a browser was not testable in the build environment, so try one early.

**Saving (publishing):** Settings, then connect GitHub with a fine-grained personal access token limited to this one repository with Contents: Read and write. Press Publish changes to commit the data files. Without a token, use Download files and upload them yourself. The token stays in your browser tab (or on the device if you tick Remember) and is never written into the site.

**Security, honestly:** a static site has no real login. Anyone can open admin.html, but nobody can publish without your token, because GitHub checks it. Do not share the token.

**Admin login:** the first time you open admin.html you create a username and password (10+ characters, a long phrase is best) and connect GitHub. The CMS publishes the salted password hash and the results verifier in `data-auth.js`. Sign in the same way from any browser. Sessions end after 30 minutes without activity. A static site cannot enforce a login on a server, so the login keeps casual visitors out and protects the members file by encryption; publishing still needs the GitHub token. Forgot the password? Delete `data-auth.js` from the repository and set up again (old saved members then cannot be decrypted, so keep CSV backups).

**Members (shared in every browser):** saved as an AES-encrypted file `data-members.enc.json` in your repository. The key comes from your username and password in your browser, so the public repository only holds unreadable data and the same list opens after login in any browser. Reading needs only the login; saving needs the GitHub token. Add, edit, search, import/export CSV and JSON backups. Changing the login re-encrypts the file. Do not store ID numbers or sensitive details.

**Limits:** the HTML pages' canonical/Open Graph address is set at build time, so changing the website address in Settings does not rewrite those tags.
