import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({ href, label, fileName }: { href: string; label: string; fileName: string }) {
  return (
    <Button asChild size="sm" variant="outline" className="no-print">
      <a href={href} download={fileName}>
        <Download className="size-3.5" /> {label}
      </a>
    </Button>
  );
}
