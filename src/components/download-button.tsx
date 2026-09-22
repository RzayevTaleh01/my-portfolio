import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CV_DOWNLOAD_NAME } from "@/lib/cv/model";

export function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild size="sm" variant="outline" className="no-print">
      <a href={href} download={CV_DOWNLOAD_NAME}>
        <Download className="size-3.5" /> {label}
      </a>
    </Button>
  );
}
