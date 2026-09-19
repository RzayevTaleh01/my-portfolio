# Taleh Rzayev - Portfolio

Portfolio of a software engineer and AI researcher: experience, skills, research, architecture case studies and articles.

Next.js 16 · Tailwind CSS 4 · Radix UI · Motion · cmdk · next-themes · MDX · Shiki · KaTeX · Plus Jakarta Sans

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Languages (EN · AZ · SK)

Every page exists at `/en`, `/az` and `/sk`. Visiting `/` (or any path without a locale) redirects via `src/proxy.ts` to English, or to the language the visitor picked earlier in the top-right language menu.

| What | Where |
| --- | --- |
| Interface text (buttons, headings, labels) | `src/i18n/dictionaries/{en,az,sk}.ts` |
| Content translations | `src/content/i18n/{az,sk}/core.ts` and `projects.ts` |
| Article translations | `content/posts/<slug>.az.mdx`, `<slug>.sk.mdx` (falls back to English) |

English content is the source of truth. Translations are *overrides* with the same shape that contain only text - stack, code, formulas and links are never repeated. Arrays are matched by position; if a translation has a different number of items than the English content, the build fails with the exact path, so translations can never silently drift. Use `{}` to keep an item in English.

## Editing content

Pages only render data - all content lives in `src/content/` and `content/posts/`.

| What | File |
| --- | --- |
| Name, intro, bio, photo, CV PDF, links | `src/content/profile.ts` |
| Experience, education, certificates, languages | `src/content/experience.ts` |
| Skills, research statement and directions | `src/content/skills.ts` |
| Publications (shown on /research and /cv once the list is not empty) | `src/content/publications.ts` |
| Project case studies - one file per project | `src/content/projects/*.ts` |
| Earlier/smaller projects | `src/content/projects/index.ts` (`archive`) |
| Articles | `content/posts/*.mdx` |
| CV download | `public/Taleh_Rzayev_CV.pdf` |

Types in `src/content/types.ts` make the build fail on missing or misspelled fields.

### Adding a case study

Copy an existing file in `src/content/projects/`, fill it in, and add it to the `projects` array in `index.ts`. A case study has:

- `architecture.layers` - rendered as a layered diagram, top (users) to bottom (data)
- `components`, `flow` (numbered steps), `decisions`, `stack`
- `deepDives` - optional prose with a LaTeX `formula` and/or highlighted `code`

### Writing an article

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

Set `NEXT_PUBLIC_SITE_URL` to your domain (used for SEO metadata and the sitemap). Optionally set `GITHUB_TOKEN` to raise the GitHub API rate limit for the live repository and language stats.
