export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((item, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }} />
  ));
}
