"use client";

import { LoaderCircle, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function MediaUploader({
  mediaKey,
  title,
  description,
  accept,
  src,
  disabled,
}: {
  mediaKey: string;
  title: string;
  description: string;
  accept: string;
  src: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [broken, setBroken] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    setMessage(null);
    const form = new FormData();
    form.set("key", mediaKey);
    form.set("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setMessage({ tone: "ok", text: "Uploaded - the site uses the new photo now." });
      setBroken(false);
      router.refresh();
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <section className="flex flex-wrap items-start gap-5 rounded-xl border bg-surface p-4 sm:p-5">
      <div className="grid size-32 shrink-0 place-items-center overflow-hidden rounded-xl border bg-muted">
        {broken ? (
          <span className="px-2 text-center text-xs text-muted-foreground">No photo yet</span>
        ) : (
          <Image src={src} alt={title} width={128} height={128} unoptimized className="size-full object-cover" onError={() => setBroken(true)} />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        <p className="text-[13px] text-muted-foreground">{description}</p>
        <input ref={input} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <Button size="sm" variant="outline" disabled={busy || disabled} onClick={() => input.current?.click()}>
          {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />} Upload
        </Button>
        {message && <p className={message.tone === "ok" ? "text-[13px] text-emerald-700" : "text-[13px] text-red-600"}>{message.text}</p>}
      </div>
    </section>
  );
}
