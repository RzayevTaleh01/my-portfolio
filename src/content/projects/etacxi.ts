import type { Project } from "../types";

// Built at ITM. A ground-up rebuild of etacxi.az, the institute's public site.

export const etacxi: Project = {
  slug: "etacxi",
  title: "Institute of Lung Diseases",
  tagline:
    "A ground-up rebuild of a public health institute's site: hard-coded pages and a dead 2019 layout replaced by a Laravel portal the staff can actually run.",
  kind: "work",
  organization: "ITM",
  year: 2026,
  featured: true,
  links: { demo: "http://etacxi.az/" },
  facts: [
    { label: "Role", value: "Full-stack · ITM" },
    { label: "Status", value: "In progress" },
    { label: "Client", value: "Public legal entity" },
    { label: "Approach", value: "Rewrite, not a reskin" },
  ],
  overview: [
    "The Scientific Research Institute of Lung Diseases is a public legal entity in Baku with roots going back to the 1944 tuberculosis institute. Its site, etacxi.az, is where citizens look for the institute's structure, its leadership, its news and the practical information they need before a visit.",
    "The site standing today was built in 2019 and has not moved since. I am rewriting it from scratch: same institution, same public duty, a platform the staff can keep current without a developer.",
  ],
  problem: [
    "The news section is not a section. Each item is its own hard-coded route - /xeber1, /xeber2, /xeber3 - so publishing anything means editing code and deploying. The newest item is from 2023, which is what happens when publishing is a developer task.",
    "The footer links are placeholders that still read \"link 1\" through \"link 6\" and point nowhere. The page declares itself as English while serving Azerbaijani. The site is served over plain HTTP.",
    "Content sits in markup rather than in a database, so nothing can be listed, filtered, searched or shown in more than one language without duplicating a template.",
  ],
  architecture: {
    summary:
      "Content moves out of the templates and into the database. Everything a visitor reads becomes a record an editor owns, and the public site is a thin rendering layer over it.",
    layers: [
      {
        name: "Visitors",
        nodes: [
          { name: "Citizens", detail: "Services, contacts, leadership, news" },
          { name: "Press and partners", detail: "Announcements, gallery, international relations" },
        ],
      },
      {
        name: "Public site",
        nodes: [
          { name: "Blade views", detail: "Responsive layout, rebuilt from scratch" },
          { name: "Locale routes", detail: "/az and /en resolved from one content model" },
        ],
      },
      {
        name: "Application",
        nodes: [
          { name: "Laravel controllers", detail: "Pages, news, gallery, contact form" },
          { name: "Admin panel", detail: "Authenticated CRUD for every content type" },
          { name: "Validation", detail: "Form requests, CSRF, spam-guarded contact form" },
        ],
      },
      {
        name: "Data",
        nodes: [
          { name: "MySQL", detail: "Pages, news, staff, gallery, translations" },
          { name: "Media store", detail: "Uploaded images and documents" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Content model",
      role: "Turning pages into records",
      points: [
        "Static pages - general information, leadership, structure, international relations - become editable records rather than templates.",
        "Leadership entries carry a photo, a title and a biography, so a change of director is a form, not a commit.",
        "Every text field is per-locale, so Azerbaijani and English are the same record rather than two copies of a page.",
      ],
      tech: "Laravel · MySQL",
    },
    {
      name: "News and announcements",
      role: "Replacing the hard-coded routes",
      points: [
        "One news table with a publish date, a slug and a status, listed with pagination and read at a stable URL.",
        "Drafts stay invisible until published, so an editor can prepare an item ahead of time.",
      ],
    },
    {
      name: "Admin panel",
      role: "Who keeps the site alive",
      points: [
        "Role-separated login: editors publish news and gallery items, an administrator manages pages, staff and users.",
        "Image uploads are resized and stored outside the code tree, so media is never part of a deploy.",
      ],
    },
    {
      name: "Citizen services",
      role: "The part people actually come for",
      points: [
        "The practical pages - compulsory medical insurance, contacts, address and phone numbers - are given their own structure instead of being buried in prose.",
        "The contact form validates server-side and is rate-limited, and submissions are stored as well as mailed.",
      ],
    },
    {
      name: "Frontend",
      role: "A layout that survives a phone",
      points: [
        "Hand-written HTML, CSS and JavaScript, rebuilt responsive rather than patched over the old jQuery-era markup.",
        "Third-party embeds the old site loaded on every page are dropped; the gallery and the video sections are served locally.",
      ],
      tech: "HTML · CSS · JavaScript",
    },
  ],
  flow: [
    { title: "Editor writes", detail: "A staff member creates a news item or edits a page in the admin panel, in both languages." },
    { title: "Validate and store", detail: "The form request validates the input; text goes to MySQL, images to the media store." },
    { title: "Publish", detail: "Setting the status to published puts the record into the public listings immediately." },
    { title: "Request", detail: "A visitor hits a locale route; the controller loads the record for that locale." },
    { title: "Render", detail: "Blade renders the page with the institute's layout, responsive down to phone width." },
  ],
  decisions: [
    {
      title: "Rewrite rather than restyle",
      detail:
        "The problem is not how the 2019 site looks. It is that content lives in code, so a new coat of CSS would leave the institute exactly as unable to publish as it is now.",
    },
    {
      title: "Laravel for a public institution",
      detail:
        "A long-lived, maintainable PHP stack the institute's own people can hand over and keep running, with authentication, validation, migrations and an admin layer already solved.",
    },
    {
      title: "Bilingual by data, not by duplication",
      detail:
        "Translations are columns on the record, not a second copy of the site. That is what keeps the Azerbaijani and English versions from drifting apart the way the old one did.",
    },
    {
      title: "HTTPS and a real domain setup",
      detail:
        "A public health institution asking citizens for contact details over plain HTTP is not acceptable; TLS is part of the rebuild, not a later task.",
    },
  ],
  stack: [
    { group: "Backend", items: ["PHP", "Laravel", "MySQL"] },
    { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "Blade"] },
    { group: "Operations", items: ["Nginx", "Git"] },
  ],
  next: [
    "Migrate the existing pages, news archive and gallery into the new content model.",
    "Finish the English locale so both languages ship together.",
    "Accessibility pass - a public health site has to work for the people least able to fight with it.",
  ],
};
