"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { defaultLocale, hasLocale, localize } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang && hasLocale(params.lang) ? params.lang : defaultLocale;
  const t = getDictionary(lang).notFound;

  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="text-muted-foreground">{t.text}</p>
      <Button asChild size="sm" variant="outline">
        <Link href={localize(lang, "/")}>{t.back}</Link>
      </Button>
    </div>
  );
}
