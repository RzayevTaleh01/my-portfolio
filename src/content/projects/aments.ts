import type { Project } from "../types";

export const aments: Project = {
  slug: "aments",
  title: "Aments Storefront",
  tagline: "A server-rendered Next.js storefront with a strict Route → Query → Mapper → UI data architecture.",
  category: "engineering",
  status: "active",
  year: 2026,
  links: { repo: "https://github.com/RzayevTaleh01/aments-nextjs" },
  facts: [
    { label: "Rendering", value: "SSR" },
    { label: "Data layers", value: "4" },
    { label: "i18n", value: "Server-side lang" },
  ],
  overview: [
    "An e-commerce frontend for a backend whose JSON shape is not under the frontend's control. The goal: UI components always read stable keys, even when the API changes.",
  ],
  problem: [
    "When components read raw API fields directly, every backend rename breaks the UI in many places, and components fill up with fallback logic like raw?.name ?? raw?.title ?? \"\".",
  ],
  architecture: {
    summary: "Each layer has one responsibility, and only the mapper knows what the backend JSON looks like.",
    layers: [
      { name: "UI", nodes: [{ name: "Sections & cards", detail: "Read stable keys only - no fallbacks" }] },
      { name: "Route", nodes: [{ name: "Server page.jsx", detail: "Resolve language, call queries, pass props" }] },
      { name: "Query", nodes: [{ name: "*.query.js", detail: "Request + extract + map + filter" }] },
      { name: "Mapper", nodes: [{ name: "*.mapper.js", detail: "Raw JSON → UI shape with defaults" }] },
      {
        name: "Transport",
        nodes: [
          { name: "ApiService", detail: "HTTP client" },
          { name: "apiRoutes", detail: "Endpoint constants" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Mappers",
      role: "The only place that knows the API shape",
      points: ["Start from a defaults object, copy known fields, derive display values (counts, hrefs)."],
    },
    {
      name: "Queries",
      role: "One function per endpoint",
      points: ["Remove repeated request/extract code and drop invalid items before they reach the UI."],
    },
    {
      name: "Routes",
      role: "Server-side composition",
      points: ["Fetch on the server with the user's language and fall back to an empty list on failure, so a broken endpoint never breaks the page."],
    },
  ],
  flow: [
    { title: "Route", detail: "The server page resolves the language and calls a query." },
    { title: "Query", detail: "Requests the endpoint via ApiService and extracts res.data.data." },
    { title: "Mapper", detail: "Converts each raw item to the stable UI shape." },
    { title: "UI", detail: "Receives props and renders cat.name, cat.image, cat.items, cat.href." },
  ],
  deepDives: [
    {
      title: "A mapper with defaults",
      body: ["If the backend renames orderCount, only this function changes - every component keeps reading items."],
      code: {
        lang: "js",
        title: "src/mappers/popular-category.mapper.js",
        source: `const PopularCategoryDefaults = {
  id: null, name: "", image: "", items: "(0 Items)", href: "/products",
};

export function mapPopularCategory(raw = {}) {
  return {
    ...PopularCategoryDefaults,
    id: raw?.id ?? PopularCategoryDefaults.id,
    name: raw?.name ?? PopularCategoryDefaults.name,
    image: raw?.image ?? PopularCategoryDefaults.image,
    items: \`(\${Number(raw?.orderCount ?? 0) || 0} Items)\`,
    href: raw?.id != null
      ? \`/products?categoryId=\${encodeURIComponent(String(raw.id))}\`
      : PopularCategoryDefaults.href,
  };
}`,
      },
    },
  ],
  decisions: [
    { title: "Anti-corruption layer", detail: "The mapper isolates the UI from an external API - a classic domain-driven design pattern applied to the frontend." },
    { title: "Fail soft on the server", detail: "A failing query returns an empty list; the page still renders." },
  ],
  stack: [{ group: "Frontend", items: ["Next.js (App Router)", "React", "JavaScript", "Bootstrap grid", "SSR"] }],
};
