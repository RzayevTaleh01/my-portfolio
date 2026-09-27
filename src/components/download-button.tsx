"use client";

import { Download } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { cvDownloadName, cvStampedDownloadName } from "@/lib/site/content";

export function DownloadButton({ href, label, name }: { href: string; label: string; name: string }) {
  const download = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(String(res.status));
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = cvStampedDownloadName(name);
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.location.href = href;
    }
  };

  return (
    <Button asChild size="sm" variant="outline" className="no-print">
      <a href={href} download={cvDownloadName(name)} onClick={download}>
        <Download className="size-3.5" /> {label}
      </a>
    </Button>
  );
}
