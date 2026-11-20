# SUJAG Education (flat version)

**This is the single-folder version.** There are no sub-folders: every file sits next to `index.html`.
It exists so the site can be uploaded from a phone, where GitHub's upload screen cannot upload folders.

## Uploading to GitHub from a phone

1. Unzip the download so you can see all the files (about 60).
2. In your repository open *Add file > Upload files*, tap the upload area and **select all files**. Upload them in one go; if the picker limits you, do it in 2 or 3 batches.
3. Commit the changes, then open *Settings > Pages*, choose the `main` branch and `/ (root)`.
4. Wait a minute, then reload your site. The page should now be fully styled with the menu, cards and scrolling updates.

If the page appears as plain unstyled text, some files did not upload. Check that `style.css`, `main.js` and `data-tests.js` are listed in the repository root.


A static, multi-page educational website with free mock tests, free study notes and a books store.
Built with plain HTML, CSS and JavaScript. No build step, no Node.js, no database and no paid hosting
are needed, so it can be published directly on GitHub Pages.

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

## 3. Project structure (flat)

```
index.html, mock-tests.html, ... 404.html     one file per page
style.css, responsive.css, test.css           styles
main.js cards.js tests.js test-engine.js
results.js notes.js books.js search.js
home.js contact.js                            scripts
data-site.js data-tests.js data-notes.js
data-books.js data-updates.js                 editable content and settings
logo-mark.png favicon-32.png favicon.ico
apple-touch-icon.png og-image.png             logo and icons
*.svg (book covers)  *.pdf (note PDFs)        content files
robots.txt  sitemap.xml  README.md
```

The `data-*.js` files are the ones described below as `data/...`. Put new PDFs and covers in the same folder
and refer to them by file name only, for example `pdf: "my-notes.pdf"` and `cover: "my-book.svg"`.

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
the same folder. Set `pdf: ""` if there is no PDF yet. The `sections` array is the readable version
shown on the detail page. Make sure you own or have permission to share any PDF you upload.

### Add a book (`data-books.js`)

Copy a book object, add a cover image to the same folder (portrait 3:4, for example 600 x 800)
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

To add a real gateway later, change `finishOrder()` in `js/books.js`.

## 6. Contact form

The form validates input in the browser. It only sends anything when `contactEndpoint` is set
(Formspree and similar services accept a JSON POST). Without it, the site says clearly that the
message was **not** sent, and offers to copy it.

---

## 7. How test data is stored (and its limits)

The site is static, so there are no accounts and no server database. Test state is kept in the
browser's `localStorage`:

- `sujag:progress:<testId>`: answers, current question and the fixed end time of an unfinished attempt.
- `sujag:results`: the latest 30 finished results, including the questions and the selected answers.

What this means:

- Data stays on **that browser on that device**. It does not sync across devices.
- Clearing browser data, using a private window or some browser "clean up" tools **deletes** it.
- The site tells users this on the result page, FAQ and privacy policy.
- The candidate name, city and phone are optional and only appear on that person's own result.
  Do not collect sensitive information with this setup.
- The timer counts to a stored end time, so refreshing does not reset it. Because everything runs in
  the browser, a technically skilled user could change their own saved time or read the answers
  from the page source. That is fine for free practice tests; it is **not suitable for graded or
  high-stakes exams**. For that you need a server.
- If storage is blocked, the site tells the user instead of failing silently.

## 8. Mock test behaviour

- One question at a time, with Previous and Next, and a numbered question map showing answered,
  unanswered and current questions. On phones the map opens as a bottom sheet so it never covers the question.
- Selecting an answer saves immediately. A selected answer can be changed or cleared.
- The countdown continues after a refresh. It warns at 5 minutes and 1 minute left. When it reaches zero the test is submitted automatically.
- Submitting asks for confirmation (and lists unanswered questions). Double submission is blocked and exactly one result is saved.
- The result page shows marks, percentage, correct, incorrect and unanswered counts, time taken, a visual score ring and bar,
  a filterable answer review with explanations, and a Retake button.

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
