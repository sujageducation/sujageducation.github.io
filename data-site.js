/* ==========================================================================
   SUJAG Education - site settings
   Edit this file to change contact details, social links, ordering options
   and the logo path. Nothing here is secret: this is a static website, so
   anything you add is visible to every visitor.
   ========================================================================== */
window.SUJAG = window.SUJAG || {};

SUJAG.site = {
  name: "SUJAG Education",
  tagline: "Prepare smarter. Learn at your own pace.",
  description: "SUJAG Education is a learning platform that helps students and job seekers prepare for exams with free practice tests, study notes and educational books.",

  // Replace with your real domain once it is final (no trailing slash).
  // Static pages also contain https://example.com in canonical and Open Graph tags;
  // see README.md for the find-and-replace step.
  url: "https://example.com",

  // Logo mark shown in the header and footer. Replace the file at this path to change it.
  logo: "logo-full.png",

  // Contact details. Leave a value empty ("") to show "coming soon" on the site.
  email: "",
  whatsapp: "",          // International format, digits only. Example: "923001234567"

  // Social links. Empty values appear as inactive placeholders in the footer.
  social: {
    facebook: "",
    instagram: "",
    youtube: ""
  },

  // Contact form. Leave empty to keep the form in "not connected" mode.
  // To make it send real messages, create a form at a service such as Formspree
  // and paste its endpoint here, for example "https://formspree.io/f/xxxxxxxx".
  contactEndpoint: "",

  // Book orders. If whatsapp (above) is set, "Place order" opens a WhatsApp chat
  // with the order details filled in. Otherwise the order dialog explains that
  // ordering is not connected yet.
  currency: "Rs.",

  // Shows small "sample content" notices on the books page and in the order dialog.
  // Set to false when you replace the demo data with your real catalogue.
  demoMode: true
};
