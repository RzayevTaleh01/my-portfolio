import type { Project } from "../types";

export const vacancyBot: Project = {
  slug: "vacancy-bot",
  title: "Vacancy Scraper Bot",
  tagline: "A Telegram bot that collects jobs and internships from Azerbaijani job sites and publishes them to channels.",
  kind: "hobby",
  year: 2025,
  featured: true,
  links: { repo: "https://github.com/RzayevTaleh01/vacancy_scraper_bot" },
  facts: [
    { label: "Sources", value: "HelloJob.az · Tecrube.az" },
    { label: "Commands", value: "7" },
    { label: "Channels", value: "Test + Prod" },
    { label: "Database", value: "MongoDB" },
  ],
  overview: [
    "The bot replaces the manual work of copying vacancies into Telegram channels. Admins trigger scraping, review what was collected, and publish in batches - first to a test channel, then to production.",
  ],
  architecture: {
    summary:
      "A thin command layer sits on top of source-specific scraper services and Mongoose models. Every command passes through an admin-only middleware.",
    layers: [
      {
        name: "Telegram",
        nodes: [
          { name: "Admin chat", detail: "/scrap /send /list /log" },
          { name: "Channels", detail: "Test & production" },
        ],
      },
      {
        name: "Bot",
        nodes: [
          { name: "Auth middleware", detail: "ALLOWED_USERS whitelist" },
          { name: "Command router", detail: "One module per command" },
          { name: "Message handler", detail: "Per-source formatting" },
        ],
      },
      {
        name: "Scrapers",
        nodes: [
          { name: "Source 1", detail: "HelloJob.az" },
          { name: "Source 2", detail: "Tecrube.az" },
          { name: "Toolkit", detail: "Axios + Cheerio, Puppeteer" },
        ],
      },
      {
        name: "Data",
        nodes: [
          { name: "Job", detail: "Vacancies" },
          { name: "Intern", detail: "Internships" },
          { name: "ScrapeInfo", detail: "Last run per source" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Scraper services",
      role: "Extract listings",
      points: [
        "Axios + Cheerio for static HTML, Puppeteer for pages that render with JavaScript.",
        "Each source returns the same shape: title, link, company, date and description.",
      ],
    },
    {
      name: "Publishing",
      role: "Controlled delivery",
      points: [
        "/send posts the next 10 unsent listings, or one specific post by id.",
        "Message formats differ per source (e.g. start and end dates for internships).",
      ],
    },
  ],
  flow: [
    { title: "/scrap", detail: "Admin picks a source; the scraper fetches and parses the listing page." },
    { title: "Deduplicate", detail: "Each listing is looked up by link; only new ones are stored." },
    { title: "Record", detail: "ScrapeInfo stores the time of the last run for /start statistics." },
    { title: "/send test", detail: "A batch goes to the test channel for review." },
    { title: "/send prod", detail: "The same batch is published; /log shows what was sent." },
  ],
  deepDives: [
    {
      title: "Idempotent scraping",
      body: ["The link is the natural key of a vacancy. Re-running a scrape never creates duplicates, so admins can scrape as often as they like."],
      code: {
        lang: "js",
        title: "services/scraper_model_1.js",
        source: `let addedCount = 0;
for (const job of jobs) {
  const exists = await Job.findOne({ link: job.link });
  if (!exists) {
    await Job.create(job);
    addedCount++;
  }
}

await ScrapeInfo.findOneAndUpdate(
  { sourceId: 1 },
  { lastScrapedAt: new Date() },
  { upsert: true, new: true },
);`,
      },
    },
  ],
  decisions: [
    { title: "Admin-only by design", detail: "A whitelist middleware guards every command, so the bot can live in public channels safely." },
    { title: "Sources as configuration", detail: "Sources are registered through environment config, so adding a site means adding one scraper module." },
    { title: "Test before prod", detail: "Two channels make publishing reviewable without a separate admin UI." },
  ],
  stack: [
    { group: "Runtime", items: ["Node.js", "Express", "node-telegram-bot-api"] },
    { group: "Scraping", items: ["Axios", "Cheerio", "Puppeteer"] },
    { group: "Data", items: ["MongoDB", "Mongoose"] },
  ],
};
