import { SocialIcon } from "@/components/icons";
import type { SocialLink } from "@/content";
import { cn } from "@/lib/utils";

export function Socials({ socials, className }: { socials: SocialLink[]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {socials.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target={s.platform === "email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <SocialIcon platform={s.platform} size={15} />
        </a>
      ))}
    </div>
  );
}
