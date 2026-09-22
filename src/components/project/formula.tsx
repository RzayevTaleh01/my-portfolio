import katex from "katex";

export function Formula({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false, output: "html" });
  return (
    <div
      className="overflow-x-auto rounded-xl border bg-surface px-4 py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
