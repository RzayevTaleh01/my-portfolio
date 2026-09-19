import { codeToHtml } from "shiki";

/** Server-rendered, syntax-highlighted code with light and dark themes. */
export async function CodeBlock({ lang, title, source }: { lang: string; title?: string; source: string }) {
  const html = await codeToHtml(source, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <figure className="code-block overflow-hidden rounded-xl border bg-surface">
      {title && (
        <figcaption className="flex items-center justify-between border-b bg-muted/60 px-4 py-2 font-mono text-xs text-muted-foreground">
          <span>{title}</span>
          <span className="text-subtle-foreground">{lang}</span>
        </figcaption>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
