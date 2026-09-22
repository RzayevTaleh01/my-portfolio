import type { Project } from "../types";

export const unecTtj: Project = {
  slug: "unec-ttj",
  title: "UNEC Student Research Journal",
  tagline:
    "An academic journal platform on OJS: twenty faculties submit papers, each one walks a reviewed editorial pipeline, and the published issue is indexed and citable.",
  kind: "work",
  organization: "ITM",
  year: 2026,
  featured: true,
  links: { demo: "https://journals.unec.edu.az/ttj/index" },
  facts: [
    { label: "Role", value: "Full-stack" },
    { label: "Status", value: "In progress" },
    { label: "Platform", value: "OJS 3.4 (PKP)" },
    { label: "Indexing", value: "DOI · Google Scholar" },
  ],
  overview: [
    "UNEC's Student Scientific Society publishes the university's student research journal twice a year. Around twenty faculties submit to it, in Azerbaijani, Turkish, English or Russian, and every paper has to survive the same editorial pipeline before it reaches an issue.",
    "The platform runs on Open Journal Systems, the open-source journal software from the Public Knowledge Project. OJS carries the editorial workflow and the metadata standards; my work is the Laravel side around it - the public journal site, the theme, and the integration that keeps the two in step.",
  ],
  problem: [
    "A journal is not a blog. A paper is not a document that gets uploaded and appears - it is a record that moves through states, and at every state a different person is allowed to see and do different things. Building that from scratch means rebuilding submission tracking, reviewer assignment, revision rounds, copyediting, galley production, issue assembly, DOI registration and indexing metadata.",
    "The other half of the problem is discoverability. If the metadata is wrong, Google Scholar does not index the article, the DOI does not resolve, and the paper effectively does not exist outside the site.",
  ],
  architecture: {
    summary:
      "OJS owns the editorial record; Laravel owns the public experience. Both read the same journal data, so an article is published in one place and appears everywhere.",
    layers: [
      {
        name: "Readers",
        nodes: [
          { name: "Public journal site", detail: "Issues, articles, abstracts, PDF galleys" },
          { name: "Search engines", detail: "Google Scholar and indexing crawlers" },
        ],
      },
      {
        name: "Presentation",
        nodes: [
          { name: "Laravel front", detail: "Blade views, multilingual routes, static pages" },
          { name: "OJS theme", detail: "Journal skin - issue, article and submission pages" },
        ],
      },
      {
        name: "Editorial",
        nodes: [
          { name: "OJS 3.4 workflow", detail: "Submission → review → copyediting → production" },
          { name: "Roles", detail: "Author, editor, section editor, reviewer, proofreader" },
        ],
      },
      {
        name: "Metadata",
        nodes: [
          { name: "DOI plugin", detail: "Registers a DOI per article and per issue" },
          { name: "OAI-PMH", detail: "Harvesting endpoint for indexing services" },
          { name: "Citation tags", detail: "Highwire Press meta tags Google Scholar reads" },
        ],
      },
      {
        name: "Data",
        nodes: [
          { name: "MySQL", detail: "Submissions, users, issues, metadata" },
          { name: "File store", detail: "Manuscripts, revisions and galleys, outside the web root" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Submission pipeline",
      role: "The state machine a paper moves through",
      points: [
        "A paper enters as a submission and waits: the editor first runs a desk check against the journal's scope and the plagiarism report.",
        "Papers that pass are assigned to a section editor, who invites reviewers; the review round ends in accept, revisions or reject.",
        "Revisions loop back to the author and can run several rounds before a decision sticks.",
        "Accepted papers move to copyediting, then to production, where the PDF galley is generated and attached.",
      ],
      tech: "OJS 3.4",
    },
    {
      name: "Roles and permissions",
      role: "Who may see the paper at each state",
      points: [
        "Authors see their own submissions and the decisions on them, nothing else.",
        "Reviewers see the anonymised manuscript for the round they were invited to.",
        "Section editors act inside their section; the managing editor sees the whole queue.",
      ],
    },
    {
      name: "Issue assembly",
      role: "Turning accepted papers into a published issue",
      points: [
        "Articles are scheduled into a volume and number, ordered and paginated - the page range printed on each article comes from here.",
        "Publishing an issue is one action; it flips every article in it to public at the same moment.",
      ],
    },
    {
      name: "Indexing layer",
      role: "Making the work findable and citable",
      points: [
        "Each article and issue gets a registered DOI, so citations resolve permanently.",
        "Article pages emit the citation meta tags Google Scholar looks for, and the OAI-PMH endpoint lets aggregators harvest the catalogue.",
        "The journal carries an ISSN, which is what turns a website into a citable publication.",
      ],
    },
    {
      name: "Public site",
      role: "What a reader actually lands on",
      points: [
        "Laravel serves the journal's own pages - about, editorial board, author guidelines, archive - with the same look as the OJS pages.",
        "The frontend is hand-written HTML, CSS and JavaScript, so the theme stays close to the OJS templates it has to match.",
      ],
      tech: "Laravel · PHP",
    },
  ],
  flow: [
    { title: "Submit", detail: "The author uploads the manuscript, fills in the metadata and confirms the submission checklist." },
    { title: "Desk check", detail: "The editor screens it for scope, formatting and plagiarism, and either desk-rejects it or sends it on." },
    { title: "Peer review", detail: "A section editor invites reviewers; each returns a recommendation and comments." },
    { title: "Decision", detail: "Accept, revise or reject. Revisions go back to the author and the round repeats." },
    { title: "Production", detail: "Copyediting, then the PDF galley is generated and proofread." },
    { title: "Publish", detail: "The article is scheduled into an issue; publishing the issue makes it public and mints the DOI." },
    { title: "Index", detail: "Metadata goes out through citation tags and OAI-PMH, and the article starts appearing in search." },
  ],
  decisions: [
    {
      title: "OJS instead of a custom CMS",
      detail:
        "The editorial workflow, the role model and the indexing standards are decades of accumulated domain knowledge. Rebuilding them would take longer and still be less correct than adopting PKP's implementation.",
    },
    {
      title: "Laravel around it, not inside it",
      detail:
        "The public site and the journal's static content live in Laravel, so they can change without touching the OJS installation - and an OJS upgrade does not put the site at risk.",
    },
    {
      title: "Metadata treated as a feature",
      detail:
        "DOI registration and citation tags are not an afterthought. They are the difference between a PDF on a server and an article that can be cited.",
    },
    {
      title: "Four submission languages",
      detail:
        "Papers arrive in Azerbaijani, Turkish, English or Russian, so the interface, the metadata fields and the archive all have to be multilingual rather than translated once.",
    },
  ],
  stack: [
    { group: "Backend", items: ["PHP", "Laravel", "MySQL"] },
    { group: "Journal platform", items: ["OJS 3.4", "PKP", "OAI-PMH", "DOI (Crossref)"] },
    { group: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
  ],
  next: [
    "Finish the remaining editorial screens and the archive redesign.",
    "Widen indexing beyond Google Scholar to the subject databases the faculties care about.",
    "Reporting for the Student Scientific Society: submissions, acceptance rate and review turnaround per faculty.",
  ],
};
