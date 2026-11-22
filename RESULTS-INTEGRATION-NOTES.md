# SUJAG Education test/results integration notes

This build includes a Mock Test Results admin route and PDF/CSV tools for result records saved in the same browser profile. Candidate results continue to use the site's browser-local storage model. Static GitHub Pages cannot collect results across visitors' devices or provide cross-device permanent storage without a shared backend (e.g. a database/service). This build does not pretend to deploy such a service.

The public test UI receives shared CSS refinements inspired by SALU Community. Existing test engine, TXT/PDF parser, category system and content are preserved.
