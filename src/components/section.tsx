import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

/** Title block at the top of a page. */
export function PageHeader({ title, description }: { title: string; description?: React.ReactNode }) {
  return (
    <header className="mb-14 space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description && <div className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">{description}</div>}
    </header>
  );
}

/** A titled section. The whole section fades in once as it scrolls into view. */
export function Section({
  title,
  index,
  href,
  linkLabel = "View all",
  id,
  className,
  children,
}: {
  title: string;
  /** Optional "01"-style number - used only on long case-study pages. */
  index?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <Reveal>
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b pb-3">
          <h2 className="flex items-baseline gap-2.5 text-lg font-semibold tracking-tight">
            {index && <span className="font-mono text-xs font-normal text-subtle-foreground">{index}</span>}
            {title}
          </h2>
          {href && <ArrowLink href={href}>{linkLabel}</ArrowLink>}
        </div>
        {children}
      </Reveal>
    </section>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = /^https?:\/\//.test(href) || href.endsWith(".pdf");
  const cls = cn(
    "inline-flex shrink-0 items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground",
    className,
  );
  const Icon = external ? ArrowUpRight : ArrowRight;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      <Icon className="size-3.5" />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
      <Icon className="size-3.5" />
    </Link>
  );
}

/** Underlined inline text link (used in publication rows). */
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={/^https?:\/\//.test(href) ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="text-[13px] text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent"
    >
      {children}
    </a>
  );
}
