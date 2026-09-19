import katex from "katex";

/** Server-rendered display formula (LaTeX → HTML, no client JavaScript). */
export function Formula({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false, output: "html" });
  return (
    <div
      className="overflow-x-auto rounded-xl border bg-surface px-4 py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
