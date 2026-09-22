"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CV_DOWNLOAD_NAME } from "@/lib/cv/model";

export function PrintButton({ pdf, labels }: { pdf?: string; labels: { pdf: string; print: string } }) {
  return (
    <div className="no-print flex gap-2">
      {pdf && (
        <Button asChild size="sm" variant="outline">
          <a href={pdf} download={CV_DOWNLOAD_NAME}>
            <Download className="size-3.5" /> {labels.pdf}
          </a>
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => window.print()}>
        <Printer className="size-3.5" /> {labels.print}
      </Button>
    </div>
  );
}
