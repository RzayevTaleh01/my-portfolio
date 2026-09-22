# Taleh Rzayev - Portfolio

Personal site of a software engineer and AI researcher: experience, projects, research, articles and a printable resume.

**Live:** [therzayev.site](https://therzayev.site)

Next.js 16 · Tailwind CSS 4 · Radix UI · Motion · cmdk · next-themes · MDX · Shiki · KaTeX

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Project structure

```
content/posts/          Articles (MDX)
public/                 Photo and the fonts of the generated CV
src/
  app/[lang]/           Pages - home, projects, research, writing, about, cv
  app/admin/            Admin panel - CV builder
  app/cv/[file]/        The generated CV PDFs
  components/           UI components
  content/              All site content (typed)
    i18n/sk/            Slovak translations of the content
    projects/           Project pages
  i18n/                 Locales and interface dictionaries
  lib/                  Helpers (posts, GitHub, assistant topics)
  proxy.ts              Locale redirect
```

Pages only render data - everything shown on the site lives in `src/content/` and `content/posts/`. Types in `src/content/types.ts` make the build fail on a missing or misspelled field.

## Editing content

| What | File |
| --- | --- |
| Name, headline, intro, bio, photo, social links | `src/content/profile.ts` |
| Experience, volunteering, education, certificates, languages | `src/content/experience.ts` |
| Skills, research statement and directions | `src/content/skills.ts` |
| Publications (shown once the list is not empty) | `src/content/publications.ts` |
| Projects | `src/content/projects/*.ts` |
| Earlier, smaller projects | `src/content/projects/index.ts` (`archive`) |
| Articles | `content/posts/*.mdx` |
| Resume PDFs (which entries go in) | `/admin` (saved in Vercel Blob) |

### Resume PDFs

The downloadable CVs are generated from the content above, in a Europass layout - no PDF is kept by hand. There is one link for everyone, `/cv/taleh-rzayev-cv.pdf`: visitors from Slovakia get the Slovak-region CV, everyone else the international one, always under the same file name.

1. Open `/admin` on the live site and sign in with the admin code
2. Pick a region, tick the entries that go in, fill the personal fields - the preview updates live
3. **Save & publish** - the selection is stored in Vercel Blob and the download buttons give the new PDFs straight away, no redeploy

Setup (once): in Vercel create a **private** Blob store and connect it to the project (Storage → Create → Blob), then add `ADMIN_CODE` under Settings → Environment Variables and redeploy. For `npm run dev`, put `ADMIN_CODE` in `.env.local`; without a Blob token there, Save writes `src/content/cv/cv-config.json` instead (that file is also the fallback until the first save to Blob). Anything added to the content later shows up in the panel unticked until you approve it.

### Experience

Each entry is one organisation with one or more `roles`, newest first. Several roles are shown as a promotion track under the company. A role can link a project page (`caseStudy`) and a credential (`credential`). The home page and the resume render the same components, so they always match.

### Projects

Add a file in `src/content/projects/` (or an entry in `edumedia.ts` for smaller work) and list it in the `projects` array in `index.ts` - the array order is the display order. `featured: true` puts a project on the home page.

- Required: `slug`, `title`, `tagline`, `kind`, `year`, `links` (`repo`, `demo`, `docs` - all optional, `{}` for none), `overview`, `stack`
- `kind` is `work`, `freelance`, `research` or `hobby`; `work` projects also take an `organization`
- Optional: `facts`, `problem`, `components`, `next`, and for a full case study `architecture` (a layered diagram), `flow`, `deepDives` (LaTeX `formula`, highlighted `code`) and `decisions`

Only the sections a project fills are rendered, and they are numbered in order.

## Languages

Every page exists in English (`/en`) and Slovak (`/sk`). Visiting a path without a locale redirects to one.

| What | Where |
| --- | --- |
| Interface text (buttons, headings, labels) | `src/i18n/dictionaries/{en,sk}.ts` |
| Content translations | `src/content/i18n/sk/core.ts` and `projects.ts` |
| Article translations | `content/posts/<slug>.sk.mdx` (falls back to English) |

English is the source of truth. A translation is an *override* with the same shape that contains only text - stack, code, formulas and links are never repeated. Arrays are matched by position: if a translation has a different number of items than the English content, the build fails with the exact path. Use `{}` to keep an item in English. Project translations are keyed by `slug`.

## Writing an article

```mdx
---
title: "Post title"
summary: "One sentence shown in lists."
date: 2026-09-19
category: research   # or: engineering
tags: [llm, notes]
draft: false         # drafts show only in `npm run dev`
---
```

Posts support GitHub-flavoured Markdown, `$LaTeX$`, titled code blocks (```` ```ts title="file.ts" ````) and `<Callout>`.

## Deploying

Deployed on Vercel from `master`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your domain - used for SEO metadata and the sitemap |
| `GITHUB_TOKEN` | Optional - raises the GitHub API rate limit for repository and language stats |
