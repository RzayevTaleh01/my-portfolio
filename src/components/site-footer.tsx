import { GitFork, Heart, Star } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { GitHubIcon } from "@/components/icons";
import type { Profile } from "@/content";
import { getRepoStats } from "@/lib/github";

export interface FooterStrings {
  madeWith: string;
  sourceTitle: string;
  sourceText: string;
  star: string;
  fork: string;
}

function repoName(url: string) {
  return url.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
}

function MadeWith({ template, name }: { template: string; name: string }) {
  const parts = template.split(/(\{heart\}|\{name\})/);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part === "{heart}" ? (
            <Heart className="mx-0.5 inline size-3.5 -translate-y-px fill-rose-500 text-rose-500" aria-label="love" />
          ) : part === "{name}" ? (
            <span className="font-medium text-muted-foreground">{name}</span>
          ) : (
            part
          )}
        </Fragment>
      ))}
    </>
  );
}

const pill =
  "inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-muted/60";

export async function SiteFooter({
  profile,
  privacy,
  t,
}: {
  profile: Profile;
  privacy: { href: string; label: string };
  t: FooterStrings;
}) {
  const repo = profile.sourceRepo?.replace(/\/$/, "");
  const stats = repo ? await getRepoStats(repo) : null;

  return (
    <footer className="no-print mt-24 space-y-6 border-t pt-8">
      {repo && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-surface px-4 py-3.5">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-semibold tracking-tight">{t.sourceTitle}</p>
            <p className="text-[13px] text-muted-foreground">{t.sourceText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={repo} target="_blank" rel="noopener noreferrer" className={pill}>
              <GitHubIcon size={14} /> {repoName(repo)}
            </a>
            <a href={repo} target="_blank" rel="noopener noreferrer" className={pill}>
              <Star className="size-3.5" /> {t.star}
              {stats && <span className="rounded-md bg-muted px-1.5 font-mono text-[11px] text-muted-foreground">{stats.stars}</span>}
            </a>
            <a href={`${repo}/fork`} target="_blank" rel="noopener noreferrer" className={pill}>
              <GitFork className="size-3.5" /> {t.fork}
              {stats && <span className="rounded-md bg-muted px-1.5 font-mono text-[11px] text-muted-foreground">{stats.forks}</span>}
            </a>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] text-subtle-foreground">
        <p>
          <MadeWith template={t.madeWith} name={profile.name} />
        </p>
        <p>
          © {new Date().getFullYear()}
          <span className="mx-2">·</span>
          <Link href={privacy.href} className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">
            {privacy.label}
          </Link>
          <span className="mx-2">·</span>
          {profile.location}
        </p>
      </div>
    </footer>
  );
}
