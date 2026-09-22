import type { ArchLayer } from "@/content";

export function ArchitectureDiagram({ layers, label }: { layers: ArchLayer[]; label: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3 sm:p-4" role="figure" aria-label={label}>
      {layers.map((layer, i) => (
        <div key={layer.name}>
          {i > 0 && <Connector />}
          <div className="grid gap-2 sm:grid-cols-[92px_1fr] sm:items-center sm:gap-4">
            <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-subtle-foreground">{layer.name}</p>
            <div
              className={`grid gap-2 sm:grid-cols-[repeat(var(--nodes),minmax(0,1fr))] ${layer.nodes.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
              style={{ "--nodes": layer.nodes.length } as React.CSSProperties}
            >
              {layer.nodes.map((node) => (
                <div key={node.name} className="rounded-lg border bg-surface px-3 py-2.5">
                  <p className="text-[13px] font-medium leading-tight">{node.name}</p>
                  {node.detail && <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{node.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex h-6 items-center justify-center sm:pl-[108px]" aria-hidden>
      <svg width="10" height="20" viewBox="0 0 10 20" className="text-border-strong">
        <line x1="5" y1="0" x2="5" y2="15" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
        <path d="M1.5 13 L5 18 L8.5 13" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
